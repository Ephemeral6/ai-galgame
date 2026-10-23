// AI 原生视觉小说引擎：面板、按键、存档、设置、剧本包导入、自动游玩、边等边玩、陪伴、成就。
// 所有 $.state 读写都集中在这个文件（engine.ts / fx.ts / pilot.ts / native.ts 只有纯函数和模型调用）。
//
// 规矩：
// - 画面板（ui.render）时只读状态，绝不写；写状态只在按键回调、定时器回调、事件钩子、命令和会话开始里。
// - 动画 ≤ 4 帧/秒（TICK_MS），只用 $.ui.blit 重画变了的那几块 Raster（立绘、氛围带、标题卡、地图、关系图）；
//   面板不在屏幕上时 blit 被拒，定时器自己停；设置里关掉动画就没有定时器。
// - AI 成本：默认每幕 1 次写作 + 1 次检查（不过才重写 1 次）；演出指令、氛围、镜头在同一次写作输出里；
//   其余调用（自动决策、消息、八卦、日记、画像、顺其自然）都是 Haiku、按需、可单独关闭。

import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type {
  AutoSpeed, AutoState, AutoStrategy, Choice, GalSettings, JobState, Keepsake, Lang, Meta, Pack, PackEntry, PackMeta, Story, Tone, Usage, UiState, View, WorkState,
} from '../types'
import { fetchIndex, fetchPack } from './browse'
import type { CommunityEntry } from './browse'
import { generatePack, packFromRepo, scanRepo } from './gen'
import type { GenResult, GenStep } from './gen'
import { endingCard, exportFileName, exportRun, shareSummary } from './share'
import type { ExportFormat } from './share'
import { PORTRAIT_ROWS, STAGE_ROWS, STAGE_W, cells, keepsakeFrame, portraitFrame, stageFrame } from './art'
import type { Px } from './art'
import { BUDGETS, dateKey, usd } from './cost'
import {
  addUsage, advanceTime, applyChoice, applyScene, drawKeepsake, forcedEvent, freshStory, incidentOf, needsMigration, normalizeStory, pickEnding, planOptions, proactive, sceneKey, writeEnding, writeScene,
} from './engine'
import type { PlanOption } from './engine'
import { ACHIEVEMENTS, EMPTY_FEATS, achievementsOnFinish, achievementsOnScene, dailyChallenge, dailyShare, okFeats } from './feats'
import type { AchievementId, Feats } from './feats'
import { BAND_H, CARD_FRAMES, DEFAULT_THEME, atmoBand, backdrop, backdropOf, backdropTop, cardFrame, fxOf, mapSize, over, relationGraph, stageDirections, themeOf, tint, townMap } from './fx'
import type { CardSpec } from './fx'
import { LANGS, helpLines, t } from './i18n'
import type { UiKey } from './i18n'
import { FALLBACK, KIND, PX, STATE_CB, TEXT, css, inkOn, onScreen, readable } from './theme'
import type { Bg } from './theme'
import { AWAY_MS, EXTRA_KEYS, awayLetter, diaryEntry, nightGossip, portraitOf, tendencies } from './native'
import type { ExtraKey } from './native'
import { castOf, chapterOf, dayText, meterOf, packText, personOf, tr, validatePack } from './pack'
import { decide } from './pilot'
import type { Decision } from './pilot'
import { BREAK_GAP_MS, REST_AFTER_MS, canSpeak, classifyBash, commitKeepsake, companionLine } from './work'
import type { CompanionCue, WorkEvent } from './work'
import { BUILTIN } from '../packs/index'

const PANE = 'ai-galgame'
const TICK_MS = 250 // 4 帧/秒
const SAVE_SLOTS = [1, 2, 3]

const DEFAULT_SETTINGS: GalSettings = {
  lang: 'zh', anim: true, pageMode: 'line', pack: BUILTIN[0]!.id,
  autoStrategy: 'whim', autoSpeed: 'mid', autoLimit: 6, autoTarget: '',
  map: true, extras: {}, watch: true, workEvents: false, writer: 'sonnet', budget: 0, short: false,
  companion: '', voice: false, sfx: false, layout: 'auto', palette: 'default',
}

const story = atom<'ai-galgame', 'story'>({ plugin: 'ai-galgame', key: 'story' } as const, { ...freshStory(BUILTIN[0]!, 'zh'), phase: 'title' })
const undo = atom<'ai-galgame', 'undo'>({ plugin: 'ai-galgame', key: 'undo' } as const, [])
const ui = atom<'ai-galgame', 'ui'>({ plugin: 'ai-galgame', key: 'ui' } as const, { view: 'game', tab: 0, saveMode: 'save', back: 'game' })
const settings = atom<'ai-galgame', 'settings'>({ plugin: 'ai-galgame', key: 'settings' } as const, DEFAULT_SETTINGS)
const meta = atom<'ai-galgame', 'meta'>({ plugin: 'ai-galgame', key: 'meta' } as const, {})
const packs = atom<'ai-galgame', 'packs'>({ plugin: 'ai-galgame', key: 'packs' } as const, [])
const DEFAULT_AUTO: AutoState = { on: false, scenes: 0, startDay: 1, target: '', reason: '', note: '' }
const auto = atom<'ai-galgame', 'auto'>({ plugin: 'ai-galgame', key: 'auto' } as const, DEFAULT_AUTO)
const DEFAULT_WORK: WorkState = { busy: false, notice: '', since: 0, lastTurn: 0, said: [], line: '' }
const work = atom<'ai-galgame', 'work'>({ plugin: 'ai-galgame', key: 'work' } as const, DEFAULT_WORK)
const feats = atom<'ai-galgame', 'feats'>({ plugin: 'ai-galgame', key: 'feats' } as const, EMPTY_FEATS)
const DEFAULT_JOB: JobState = { kind: '', step: '', attempt: 0, message: '', scan: null, entries: [] }
const job = atom<'ai-galgame', 'job'>({ plugin: 'ai-galgame', key: 'job' } as const, DEFAULT_JOB)

// 旧版本留下的会话状态格式不同（插件热重载后 $.state 还在），读到就降级，免得渲染时报错整块不画
const DEFAULT_UI: UiState = { view: 'game', tab: 0, saveMode: 'save', back: 'game' }
const TITLE_STORY: Story = { ...freshStory(BUILTIN[0]!, 'zh'), phase: 'title' }
const VIEWS: View[] = ['game', 'album', 'saves', 'settings', 'help', 'packs', 'graph', 'feats']

function okStory(x: unknown): boolean {
  const s = x as Partial<Story> | null
  return !!s && typeof s.pack === 'string' && !!s.heroines && typeof s.heroines === 'object'
    && Array.isArray(s.promises) && Array.isArray(s.album) && !!s.usage && typeof s.phase === 'string'
}
function okUi(x: unknown): x is UiState {
  return !!x && VIEWS.includes((x as Partial<UiState>).view as View) && typeof (x as UiState).tab === 'number'
}
function okSettings(x: unknown): boolean {
  const st = x as Partial<GalSettings> | null
  return !!st && typeof st.lang === 'string' && typeof st.pack === 'string'
}
function okAuto(x: unknown): x is AutoState {
  return !!x && typeof (x as AutoState).on === 'boolean' && typeof (x as AutoState).scenes === 'number'
}
function okJob(x: unknown): x is JobState {
  return !!x && typeof (x as JobState).kind === 'string' && Array.isArray((x as JobState).entries)
}
function okWork(x: unknown): x is WorkState {
  return !!x && typeof (x as WorkState).busy === 'boolean' && Array.isArray((x as WorkState).said)
}
const extraOn = (st: GalSettings, k: ExtraKey) => st.extras?.[k] !== false

const packById = (id: string, extra: PackEntry[] = []): Pack | undefined => allPacks(extra).find(e => e.id === id)?.pack

/**
 * 迁移：旧格式的会话状态、回退栈、存档补成当前格式。
 * 只在 command.run 和 session.start 里调用——画面板时不许写状态；画面板时只读，遇到认不出的格式降级显示。
 */
async function migrate($: EngineInterface): Promise<void> {
  const extra = await read($, packs)
  const raw = await read($, story) as unknown
  const p0 = okStory(raw) ? packById((raw as Story).pack, extra) : undefined
  const fixed = okStory(raw) ? normalizeStory(raw, p0) : null
  if (!fixed) {
    await update($, story, () => ({ ...freshStory(BUILTIN[0]!, 'zh'), phase: 'title' as const }))
    await update($, undo, () => [])
  } else if (needsMigration(raw, p0)) {
    await update($, story, () => fixed)
    await update($, undo, u => u.map(x => {
      try { return normalizeStory(JSON.parse(x), p0) } catch { return null }
    }).filter((x): x is Story => !!x).map(x => JSON.stringify(x)))
  }
  if (!okUi(await read($, ui))) await update($, ui, () => DEFAULT_UI)
  if (!okSettings(await read($, settings))) await update($, settings, () => DEFAULT_SETTINGS)
  // 自动模式不跨会话、不跨热重载：定时器已经没了，状态也关掉
  const a0 = await read($, auto) as unknown
  if (!okAuto(a0) || (a0 as AutoState).on) await update($, auto, x => ({ ...DEFAULT_AUTO, note: okAuto(x) ? x.note : '' }))
  if (!okWork(await read($, work))) await update($, work, () => DEFAULT_WORK)
  if (!okFeats(await read($, feats))) await update($, feats, () => EMPTY_FEATS)
  // 后台任务不跨热重载：取消控制器已经没了，正在跑的标成空闲（等确认的保留）
  const j0 = await read($, job) as unknown
  if (!okJob(j0)) await update($, job, () => DEFAULT_JOB)
  else if (j0.kind !== '' && j0.kind !== 'confirm' && !genAbort) await update($, job, x => ({ ...x, kind: '' as const, step: '' }))
  // 存档：save:<pack>:<n>，旧格式补全后写回；认不出来的不动（读的时候降级显示）
  for (const key of await $.store.keys()) {
    if (!key.startsWith('save:')) continue
    const f = await $.store.get(key)
    if (!f || typeof f !== 'object') continue
    const st = (f as { story?: unknown }).story
    const p = packById(String((st as { pack?: unknown } | undefined)?.pack ?? ''), extra)
    if (!needsMigration(st, p)) continue
    const n = normalizeStory(st, p)
    if (n) await $.store.set(key, { ...(f as object), story: n })
  }
}

// ---------- 剧本包 ----------
function allPacks(extra: PackEntry[]): PackEntry[] {
  const out: PackEntry[] = BUILTIN.map(p => ({ id: p.id, origin: 'builtin' as const, pack: p }))
  for (const e of extra) if (!out.some(o => o.id === e.id)) out.push(e)
  return out
}

async function currentPack($: EngineInterface, id?: string): Promise<Pack> {
  const want = id ?? (await read($, settings)).pack
  const list = allPacks(await read($, packs))
  return (list.find(e => e.id === want) ?? list[0]!).pack
}

async function packDir($: EngineInterface): Promise<string> {
  const home = (await $.env.get('USERPROFILE')) ?? (await $.env.get('HOME')) ?? '.'
  return `${home.replace(/\\/g, '/')}/.claude/galgame-packs`
}

/** 读取已导入的包与剧本目录里的包（都是纯 JSON），校验后放进 packs */
async function loadExtraPacks($: EngineInterface): Promise<void> {
  const out: PackEntry[] = []
  const stored = await $.store.get('packs-imported')
  const fromCommunity = new Set((await $.store.get('packs-community') as string[] | undefined) ?? [])
  if (stored && typeof stored === 'object') {
    for (const raw of Object.values(stored as Record<string, unknown>)) {
      if (validatePack(raw).length === 0) out.push({ id: (raw as Pack).id, origin: fromCommunity.has((raw as Pack).id) ? 'community' : 'imported', pack: raw as Pack })
    }
  }
  try {
    const dir = await packDir($)
    if (await $.fs.exists(dir)) {
      for (const f of await $.fs.list(dir)) {
        if (f.kind !== 'file' || !f.name.endsWith('.json') || f.size > 512 * 1024) continue
        try {
          const raw = JSON.parse(await $.fs.read(`${dir}/${f.name}`)) as unknown
          const errs = validatePack(raw)
          if (errs.length === 0) out.push({ id: (raw as Pack).id, origin: 'folder', pack: raw as Pack })
          else $.ui.log(`galgame: ${f.name}: ${errs.slice(0, 3).join('; ')}`, { to: 'debug' })
        } catch {
          $.ui.log(`galgame: ${f.name}: not JSON`, { to: 'debug' })
        }
      }
    }
  } catch {
    // 目录读不了就只用内置与导入的包
  }
  await update($, packs, () => out)
}

/** /gal validate：只校验，不导入 */
async function checkPackFile($: EngineInterface, path: string, lang: Lang): Promise<string> {
  let raw: unknown
  try {
    raw = JSON.parse(await $.fs.read(path))
  } catch {
    return t(lang, 'importReadFail', { path })
  }
  const errs = validatePack(raw)
  if (errs.length) return t(lang, 'importBad', { errors: errs.map(x => `- ${x}`).join('\n') })
  const p = raw as Pack
  return t(lang, 'validateOk', { title: tr(p.title, lang, p.defaultLang), days: p.days, cast: p.cast.length, endings: p.endings.length })
}

async function importPack($: EngineInterface, path: string, lang: Lang): Promise<string> {
  let raw: unknown
  try {
    raw = JSON.parse(await $.fs.read(path))
  } catch {
    return t(lang, 'importReadFail', { path })
  }
  const errs = validatePack(raw)
  const p = raw as Pack
  if (errs.length === 0 && BUILTIN.some(b => b.id === p.id)) errs.push(`id: "${p.id}" is a built-in pack id`)
  if (errs.length) return t(lang, 'importBad', { errors: errs.slice(0, 12).map(x => `- ${x}`).join('\n') })
  const stored = ((await $.store.get('packs-imported')) ?? {}) as Record<string, unknown>
  await $.store.set('packs-imported', { ...stored, [p.id]: p })
  await loadExtraPacks($)
  return t(lang, 'imported', { title: tr(p.title, lang, p.defaultLang) })
}

// ---------- 存储 ----------
function packMeta(m: Meta, id: string): PackMeta {
  return m[id] ?? { endings: [], clears: 0, keepsakes: [] }
}

async function setMeta($: EngineInterface, id: string, fn: (pm: PackMeta) => PackMeta): Promise<void> {
  const m = await update($, meta, x => ({ ...x, [id]: fn(packMeta(x, id)) }))
  await $.store.set('meta', m)
}

async function setSettings($: EngineInterface, fn: (s: GalSettings) => GalSettings): Promise<void> {
  const s = await update($, settings, fn)
  await $.store.set('settings', s)
}

async function setFeats($: EngineInterface, fn: (f: Feats) => Feats): Promise<Feats> {
  const f = await update($, feats, x => fn(okFeats(x) ? x : EMPTY_FEATS))
  await $.store.set('feats', f)
  return f
}

type SaveFile = { story: Story; at: number }
/** 读到的存档：正常、空、或者认不出的格式（降级显示，不报错） */
type SaveRead = SaveFile | 'bad' | null

function saveKey(pack: string, n: number): string {
  return `save:${pack}:${n}`
}

/** 只读：存档的 story 先过 normalizeStory（不写回），认不出来返回 'bad' */
async function readSave($: EngineInterface, pack: string, n: number, extra: PackEntry[] = []): Promise<SaveRead> {
  let raw: unknown
  try { raw = await $.store.get(saveKey(pack, n)) } catch { return 'bad' }
  if (raw === undefined || raw === null) return null
  if (typeof raw !== 'object') return 'bad'
  const f = raw as Partial<SaveFile>
  const st = normalizeStory(f.story, packById(pack, extra))
  if (!st) return 'bad'
  return { story: st, at: typeof f.at === 'number' ? f.at : 0 }
}

const okSave = (f: SaveRead): f is SaveFile => !!f && f !== 'bad'

async function writeSave($: EngineInterface, n: number): Promise<void> {
  const s = await read($, story)
  await $.store.set(saveKey(s.pack, n), { story: s, at: Date.now() } satisfies SaveFile)
}

// ---------- 时间 ----------
/** 现在的时间（毫秒）：走引擎的时钟（测试里可以拨），拿不到就用本机时间 */
async function nowMs($: EngineInterface): Promise<number> {
  try { return await $.clock.now() } catch { return Date.now() }
}

// ---------- 花费与预算 ----------
async function todaySpent($: EngineInterface): Promise<number> {
  const f = await read($, feats)
  const today = dateKey(await nowMs($))
  return okFeats(f) && f.today.date === today ? f.today.usd : 0
}

/** 把一次（或一批）调用记到本局用量、今日花费和累计统计上 */
async function charge($: EngineInterface, u: Usage): Promise<void> {
  await update($, story, x => ({ ...x, usage: addUsage(x.usage, u) }))
  const c = u.cost ?? 0
  if (!c) return
  const today = dateKey(await nowMs($))
  await setFeats($, f => ({ ...f, today: { date: today, usd: (f.today.date === today ? f.today.usd : 0) + c }, stats: { ...f.stats, cost: f.stats.cost + c } }))
}

/** 每日预算：到了就不再调用模型；返回原因文字，没到返回 '' */
async function overBudget($: EngineInterface): Promise<string> {
  const st = await read($, settings)
  const budget = st.budget ?? 0
  if (!budget) return ''
  const used = await todaySpent($)
  return used >= budget ? t(st.lang, 'budgetHit', { used: usd(used), budget: usd(budget) }) : ''
}

// ---------- 音效与朗读 ----------
function sfx($: EngineInterface, st: GalSettings, name: 'choice' | 'page' | 'ending' | 'notice'): void {
  if (st.sfx) void $.audio.play({ asset: `assets/sfx/${name}.wav` }).catch(() => undefined)
}
function speak($: EngineInterface, st: GalSettings, text: string): void {
  if (st.voice && text) void $.audio.speak(text).catch(() => undefined)
}

// ---------- 动画：只 blit 变了的那几块 ----------
/** 一块会动的 Raster：key、尺寸和按帧画的函数 */
type Layer = { key: string; cols: number; rows: number; draw: (t: number) => Px[][] }
let layers: Layer[] = []
let animTimer: { cancel: () => void } | null = null
let frame = 0
let misses = 0
const lastCells: Record<string, string> = {}
/** 标题卡第一次出现在哪一帧（过渡动画用；模块变量，不是状态） */
const cardStart: Record<string, number> = {}
let revealKey = ''
let revealTick = 0

function stopAnim(): void {
  animTimer?.cancel()
  animTimer = null
}

function ensureAnim($: EngineInterface): void {
  if (animTimer) return
  misses = 0
  animTimer = $.clock.every(TICK_MS, () => {
    if (!layers.length) { stopAnim(); return }
    frame++
    for (const l of layers) {
      const c = cells(l.draw(frame))
      if (c === lastCells[l.key]) continue
      lastCells[l.key] = c
      void $.ui.blit({ requestId: PANE, key: l.key, cells: c, columns: l.cols, rows: l.rows }).then(r => {
        if (r.deny) { if (++misses >= 4 * layers.length) stopAnim() } else misses = 0
      }, () => stopAnim())
    }
  })
}

function startOf(id: string): number {
  if (!(id in cardStart)) cardStart[id] = frame
  return cardStart[id]!
}

// ---------- 游戏动作 ----------
async function snapshot($: EngineInterface): Promise<void> {
  const s = await read($, story)
  await update($, undo, u => [...u, JSON.stringify(s)].slice(-12))
}

async function rewind($: EngineInterface): Promise<void> {
  const u = await read($, undo)
  if (u.length === 0) return
  const now = await read($, story)
  let last: Story | null = null
  try { last = normalizeStory(JSON.parse(u[u.length - 1]!), await currentPack($, now.pack)) } catch { last = null }
  await update($, undo, x => x.slice(0, -1))
  if (!last) return
  const prev = last
  // 回退恢复旧状态，但「回退过几次」和用量记在当前这一局上
  await update($, story, () => ({ ...prev, error: '', rewinds: now.rewinds + 1, loads: now.loads, usage: now.usage }))
}

async function newGame($: EngineInterface, loop: number, opts: { seed?: number; daily?: string } = {}): Promise<void> {
  const st = await read($, settings)
  const p = await currentPack($)
  const pm = packMeta(await read($, meta), p.id)
  const fresh = freshStory(p, st.lang, loop, opts.seed ?? Math.floor(Math.random() * 0x7fffffff))
  // 二周目起：上一局的相册摘要化作「回声」，角色会隐约觉得见过你（不额外调用）
  const echoes = loop >= 2 && extraOn(st, 'echoes') ? pm.lastRun?.lines ?? [] : []
  await update($, story, () => ({ ...fresh, echoes, daily: opts.daily ?? '' }))
  await update($, undo, () => [])
  await update($, ui, x => ({ ...x, view: 'game' as View }))
  await writeSave($, 0)
}

async function startDaily($: EngineInterface): Promise<void> {
  const date = dateKey(await nowMs($))
  const { pack, seed } = dailyChallenge(date, BUILTIN)
  await setSettings($, x => ({ ...x, pack: pack.id }))
  await newGame($, 1, { seed, daily: date })
}

async function continueGame($: EngineInterface): Promise<void> {
  const st = await read($, settings)
  const s = await read($, story)
  if (s.pack === st.pack && s.phase !== 'title' && s.day >= 1 && (s.album.length > 0 || s.slot > 0 || s.day > 1)) {
    await update($, ui, x => ({ ...x, view: 'game' as View }))
    return
  }
  if (okSave(await readSave($, st.pack, 0, await read($, packs))) && await loadSlot($, st.pack, 0)) return
  await newGame($, 1)
}

async function continueAndCheck($: EngineInterface): Promise<void> {
  await continueGame($)
  void maybeLetter($)
}

async function loadSlot($: EngineInterface, pack: string, n: number): Promise<boolean> {
  const f = await readSave($, pack, n, await read($, packs))
  if (f === 'bad') { $.ui.toast(t((await read($, settings)).lang, 'loadBad')); return false }
  if (!f) return false
  const now = await read($, story)
  const loads = now.pack === pack ? now.loads + 1 : f.story.loads
  await update($, story, () => ({ ...f.story, loads, phase: f.story.phase === 'loading' ? 'plan' : f.story.phase, error: '' }))
  await update($, undo, () => [])
  await update($, ui, x => ({ ...x, view: 'game' as View }))
  return true
}

async function touchSeen($: EngineInterface): Promise<void> {
  await $.store.set('lastSeen', await nowMs($))
}

async function goTo($: EngineInterface, opt: PlanOption, who: string | null): Promise<void> {
  const s0 = await read($, story)
  if (s0.phase !== 'plan') return
  const st = await read($, settings)
  const over = await overBudget($)
  if (over) { await update($, story, x => ({ ...x, error: over })); return }
  const p = await currentPack($, s0.pack)
  await snapshot($)
  const T = packText(p, st.lang)
  await update($, story, x => ({ ...x, phase: 'loading' as const, error: '', after: '', letter: null, loadingText: T(p.loading[Math.floor(Math.random() * p.loading.length)]) }))
  const s = await read($, story)
  const pm = packMeta(await read($, meta), p.id)
  const r = await writeScene($, p, s, opt, who, st.lang, {
    endingsSeen: pm.endings, clears: pm.clears, writer: st.writer === 'haiku' ? 'haiku' : undefined, short: !!st.short,
    world: st.workEvents ? s.world : [],
  })
  await charge($, r.usage)
  if (!r.value) {
    await update($, story, x => ({ ...x, phase: 'plan' as const, error: t(st.lang, 'sceneFail') }))
    return
  }
  const sc = r.value
  await update($, story, x => ({ ...applyScene(x, sc), reveal: st.pageMode === 'page' ? 999 : 0 }))
  sfx($, st, 'page')
  speak($, st, sc.narration)
  await touchSeen($)
  const f = await setFeats($, x => ({ ...x, stats: { ...x.stats, scenes: x.stats.scenes + 1 } }))
  await unlock($, achievementsOnScene(f), st.lang)
}

async function nextLine($: EngineInterface): Promise<void> {
  const s = await update($, story, x => ({ ...x, reveal: x.reveal + 1 }))
  const line = s.scene?.lines[s.reveal - 1]
  if (line) speak($, await read($, settings), line.text)
}

async function revealAll($: EngineInterface): Promise<void> {
  await update($, story, x => ({ ...x, reveal: 999 }))
}

async function choose($: EngineInterface, c: Choice): Promise<void> {
  const s = await read($, story)
  if (s.phase !== 'scene' || !s.scene) return
  const st = await read($, settings)
  const p = await currentPack($, s.pack)
  await snapshot($)
  const r = applyChoice(p, s, c, st.lang)
  await update($, story, () => r.story)
  sfx($, st, 'choice')
  await touchSeen($)
  if (!(await overBudget($))) for (const id of r.keepsakeFor) void makeKeepsake($, p, id, st.lang)
}

/** 「顺其自然」：按我的选择倾向，让 AI 替我选（1 次 Haiku） */
async function letItBe($: EngineInterface): Promise<void> {
  const s = await read($, story)
  if (s.phase !== 'scene' || !s.scene) return
  const st = await read($, settings)
  const p = await currentPack($, s.pack)
  const over = await overBudget($)
  if (over) { $.ui.toast(over); return }
  const choices = s.scene.choices
  const d = await decide($, p, s, 'choice', choices.map(c => `[${c.kind}${c.tone ? `, ${c.tone}` : ''}] ${c.text}`), 'self', '', { endingsSeen: [] }, st.lang)
  await charge($, d.usage)
  if (d.error) { $.ui.toast(t(st.lang, 'autoError', { err: d.error })); return }
  await update($, auto, x => ({ ...x, reason: reasonOf(st.lang, d), note: reasonOf(st.lang, d) }))
  await choose($, choices[d.index]!)
}

async function makeKeepsake($: EngineInterface, p: Pack, id: string, lang: Lang): Promise<void> {
  const s = await read($, story)
  const st = await read($, settings)
  const g = await drawKeepsake($, p, s, id, lang, st.writer === 'haiku' ? 'haiku' : undefined)
  await charge($, g.usage)
  await giveKeepsake($, p, g.value, lang)
}

async function giveKeepsake($: EngineInterface, p: Pack, k: Keepsake | null, lang: Lang): Promise<void> {
  if (!k) return
  await update($, story, x => ({ ...x, keepsakes: x.pack === p.id ? [...x.keepsakes, k] : x.keepsakes }))
  await setMeta($, p.id, pm => ({ ...pm, keepsakes: [...pm.keepsakes.filter(o => !(o.heroine === k.heroine && o.title === k.title)), k].slice(-24) }))
  $.ui.toast(t(lang, 'keepsakeGot', { title: k.title }))
}

async function advance($: EngineInterface): Promise<void> {
  const s = await read($, story)
  if (s.phase !== 'after') return
  const st = await read($, settings)
  const p = await currentPack($, s.pack)
  const r = advanceTime(p, s, st.lang)
  await update($, story, () => ({ ...r.story, deltas: {} }))
  await writeSave($, 0)
  // 一天过完：夜里的小镇（配角之间的八卦、幕后），1 次 Haiku，不等它
  if (!r.finished && r.story.day !== s.day && extraOn(st, 'gossip') && !(await overBudget($))) void gossip($, p, s, s.day, st.lang)
  if (r.finished) await finish($, p, st.lang)
}

async function gossip($: EngineInterface, p: Pack, s: Story, day: number, lang: Lang): Promise<void> {
  const g = await nightGossip($, p, s, day, lang)
  await charge($, g.usage)
  if (g.text) await update($, story, x => (x.pack === p.id ? { ...x, gossip: [...x.gossip, { day, text: g.text! }].slice(-20) } : x))
}

async function finish($: EngineInterface, p: Pack, lang: Lang): Promise<void> {
  const st = await read($, settings)
  await update($, story, x => ({ ...x, phase: 'loading' as const, loadingText: packText(p, lang)(p.loading[0]) }))
  const s = await read($, story)
  const e = pickEnding(p, s)
  const g = (await overBudget($)) ? { value: null, usage: { writer: 0, checker: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } } : await writeEnding($, p, s, e, lang, st.writer === 'haiku' ? 'haiku' : undefined)
  await charge($, g.usage)
  await update($, story, x => ({ ...x, phase: 'ending' as const, endingId: e.id, ending: g.value ?? t(lang, 'endingFail'), reveal: 0 }))
  await setMeta($, p.id, pm => ({
    ...pm, clears: pm.clears + 1, endings: pm.endings.includes(e.id) ? pm.endings : [...pm.endings, e.id],
    lastRun: { ending: e.id, lines: s.album.slice(-8).map(m => m.text) },
  }))
  await writeSave($, 0)
  sfx($, st, 'ending')
  $.ui.toast(t(lang, 'endingUnlocked', { title: tr(e.title, lang, p.defaultLang) }))
  // 成就、统计、每日挑战
  const a = await read($, auto)
  const pm = packMeta(await read($, meta), p.id)
  const f0 = await read($, feats)
  const got = achievementsOnFinish(p, s, e, pm, okFeats(f0) ? f0 : EMPTY_FEATS, okAuto(a) && a.on)
  await setFeats($, f => ({
    ...f, stats: { ...f.stats, clears: f.stats.clears + 1 },
    daily: s.daily && !f.daily[s.daily] ? { ...f.daily, [s.daily]: { pack: p.id, ending: e.id, kind: e.kind ?? (e.tier >= 4 ? 'true' : 'normal') } } : f.daily,
  }))
  await unlock($, got, lang)
}

async function unlock($: EngineInterface, ids: AchievementId[], lang: Lang): Promise<void> {
  if (!ids.length) return
  await setFeats($, f => ({ ...f, achievements: [...new Set([...f.achievements, ...ids])] }))
  for (const id of ids) $.ui.toast(t(lang, 'achGot', { name: t(lang, `ach_${id}` as UiKey) }))
}

async function genDiary($: EngineInterface, id: string, day: number): Promise<void> {
  const s = await read($, story)
  const st = await read($, settings)
  const over = await overBudget($)
  if (over) { $.ui.toast(over); return }
  const p = await currentPack($, s.pack)
  const g = await diaryEntry($, p, s, id, day, st.lang)
  await charge($, g.usage)
  if (g.text) await update($, story, x => ({ ...x, diary: { ...x.diary, [`${id}:${day}`]: g.text! } }))
}

async function genPortrait($: EngineInterface, id: string): Promise<void> {
  const s = await read($, story)
  const st = await read($, settings)
  const over = await overBudget($)
  if (over) { $.ui.toast(over); return }
  const p = await currentPack($, s.pack)
  const g = await portraitOf($, p, s, id, st.lang)
  await charge($, g.usage)
  if (g.text) await update($, story, x => ({ ...x, portrait: { ...x.portrait, [id]: g.text! } }))
}

/**
 * 你离开很久（真实时间）后回来：她发来一条消息（1 次 Haiku，不等它）。
 * 回到一局里（打开面板时正在日程页，或者从标题继续 / 读档）才检查；「上次在玩」的时间只在真的玩了的时候更新。
 */
async function maybeLetter($: EngineInterface): Promise<void> {
  const st = await read($, settings)
  const s = await read($, story)
  if (s.phase !== 'plan') return
  const now = await nowMs($)
  const last = Number(await $.store.get('lastSeen')) || 0
  await $.store.set('lastSeen', now)
  if (!extraOn(st, 'letters') || !last || now - last < AWAY_MS) return
  if (s.letter || (await overBudget($))) return
  const p = await currentPack($, s.pack)
  const lt = await awayLetter($, p, s, (now - last) / 3600_000, st.lang)
  if (lt) await update($, story, x => (x.pack === s.pack && x.phase === 'plan' ? { ...x, letter: lt } : x))
}

async function show($: EngineInterface, view: View, tab = 0): Promise<void> {
  await update($, ui, x => ({ ...x, view, tab, back: view === 'game' || x.view === view ? x.back : x.view }))
}

// ---------- 自动游玩 ----------
// 用 $.clock.after 一步一步排程（不用高频定时器）；定时器回调里写状态，ui.render 里只读。
// 每一步先核对 autoGen：玩家按键、关掉自动或热重载后，排着的旧步骤自动作废。
const SPEED_MS: Record<AutoSpeed, number> = { slow: 3000, mid: 1500, fast: 600 }
const CHOICE_PAUSE_MS = 2000
const AUTO_STRATEGIES: AutoStrategy[] = ['focus', 'whim', 'collect', 'chaos']
const AUTO_SPEEDS: AutoSpeed[] = ['slow', 'mid', 'fast']
const AUTO_LIMITS = [6, 3, 12, 24, 0]
let autoGen = 0
let autoTimer: { cancel: () => void } | null = null
let choicesShown = ''

function autoCfg(st: GalSettings): { strategy: AutoStrategy; speed: AutoSpeed; limit: number; target: string } {
  return {
    strategy: AUTO_STRATEGIES.includes(st.autoStrategy as AutoStrategy) ? st.autoStrategy! : 'whim',
    speed: AUTO_SPEEDS.includes(st.autoSpeed as AutoSpeed) ? st.autoSpeed! : 'mid',
    limit: typeof st.autoLimit === 'number' && st.autoLimit >= 0 ? st.autoLimit : 6,
    target: typeof st.autoTarget === 'string' ? st.autoTarget : '',
  }
}

function schedule($: EngineInterface, ms: number, gen: number): void {
  autoTimer?.cancel()
  autoTimer = $.clock.after(ms, () => { if (gen === autoGen) void autoStep($, gen) })
}

/** 状态栏：后台生成的进度 + 自动模式 + 陪伴模式的一句话 */
async function refreshStatus($: EngineInterface): Promise<void> {
  const st = await read($, settings)
  const a = await read($, auto)
  const w = await read($, work)
  const j = await read($, job)
  const parts = [okJob(j) ? jobLine(st.lang, j) : '', okAuto(a) && a.on ? t(st.lang, 'autoStatus') : '', st.companion && okWork(w) ? w.line : ''].filter(Boolean)
  $.ui.status(parts.length ? parts.join(' · ') : undefined)
}

async function startAuto($: EngineInterface): Promise<void> {
  autoGen++
  const gen = autoGen
  const s = await read($, story)
  await update($, auto, () => ({ ...DEFAULT_AUTO, on: true, startDay: s.day }))
  await refreshStatus($)
  choicesShown = ''
  schedule($, 400, gen)
}

/** 停下或暂停：先让排着的步骤作废，再写原因 */
async function stopAuto($: EngineInterface, key: UiKey, vars?: Record<string, string | number>): Promise<void> {
  autoGen++
  autoTimer?.cancel()
  autoTimer = null
  const lang = (await read($, settings)).lang
  await update($, auto, x => ({ ...(okAuto(x) ? x : DEFAULT_AUTO), on: false, note: t(lang, key, vars) }))
  await refreshStatus($)
}

async function toggleAuto($: EngineInterface): Promise<void> {
  const a = await read($, auto)
  if (okAuto(a) && a.on) await stopAuto($, 'autoStopped')
  else await startAuto($)
}

function reasonOf(lang: Lang, d: Decision): string {
  return d.why ? t(lang, 'autoReason', { n: d.index + 1, why: d.why }) : t(lang, 'autoReasonBare', { n: d.index + 1 })
}

/** 自动游玩的一步：看当前阶段做一件事，再排下一步 */
async function autoStep($: EngineInterface, gen: number): Promise<void> {
  try {
    const a = await read($, auto)
    if (!okAuto(a) || !a.on || gen !== autoGen) return
    const st = await read($, settings)
    const lang = st.lang
    const cfg = autoCfg(st)
    const s = await read($, story)
    const p = await currentPack($, s.phase === 'title' ? st.pack : s.pack)
    const T = packText(p, lang)
    const wait = SPEED_MS[cfg.speed]
    const seen = { endingsSeen: packMeta(await read($, meta), p.id).endings }
    if (s.phase === 'title') { await continueGame($); return schedule($, 600, gen) }
    if (s.phase === 'loading') return schedule($, 800, gen)
    if (s.phase === 'ending') return await stopAuto($, 'autoEnded')
    const over = await overBudget($)
    if (over && (s.phase === 'plan' || (s.phase === 'scene' && cfg.strategy !== 'chaos'))) return await stopAuto($, 'autoError', { err: over })
    if (s.phase === 'plan') {
      if (s.error) return await stopAuto($, 'autoError', { err: s.error })
      if (cfg.limit > 0 && a.scenes >= cfg.limit) return await stopAuto($, 'autoLimitHit', { n: a.scenes })
      if (cfg.limit === 0 && s.day !== a.startDay) return await stopAuto($, 'autoDayEnd')
      let target = a.target
      if (cfg.strategy === 'focus' && !castOf(p, target)) {
        target = castOf(p, cfg.target) ? cfg.target : ''
        if (!target) {
          const d = await decide($, p, s, 'target', p.cast.map(c => `${c.id} ${T(c.name)}: ${T(c.tagline ?? c.look)}`), 'focus', '', seen, lang)
          await charge($, d.usage)
          if (d.error) return await stopAuto($, 'autoError', { err: d.error })
          target = p.cast[d.index]!.id
        }
        if (gen !== autoGen) return
        await update($, auto, x => ({ ...x, target }))
      }
      const forced = forcedEvent(p, s, lang)
      const lonely = forced ? null : proactive(p, s)
      const opts = [
        ...(lonely ? [{ place: T(p.places[0]!.name), mood: '', maybe: [lonely], who: lonely }] : []),
        ...(forced ? [forced] : planOptions(p, s, lang)),
      ]
      const labels = opts.map(o => (o.who ? `${o.who} came looking for me: go with her` : `${o.forced ?? o.place}${o.maybe.length ? ` (maybe: ${o.maybe.join(', ')})` : ''}`))
      const d = await decide($, p, s, 'place', labels, cfg.strategy, target, seen, lang)
      await charge($, d.usage)
      if (d.error) return await stopAuto($, 'autoError', { err: d.error })
      if (gen !== autoGen) return
      await update($, auto, x => ({ ...x, reason: opts.length > 1 ? reasonOf(lang, d) : '' }))
      const o = opts[d.index]!
      await goTo($, o, o.who ?? null)
      if (gen !== autoGen) return
      const s2 = await read($, story)
      if (s2.phase === 'plan' && s2.error) return await stopAuto($, 'autoError', { err: s2.error })
      await update($, auto, x => ({ ...x, scenes: x.scenes + 1 }))
      return schedule($, wait, gen)
    }
    if (s.phase === 'scene' && s.scene) {
      const key = `${sceneKey(s)}:${s.scene.title}`
      const items = sceneItems(s.scene, '').length
      if (s.reveal + 1 < items) {
        await nextLine($)
        // 最后一句出来时选项也出来了：停顿约 2 秒再选，让人看得到
        if (s.reveal + 2 >= items) { choicesShown = key; return schedule($, CHOICE_PAUSE_MS, gen) }
        return schedule($, wait, gen)
      }
      if (choicesShown !== key) { choicesShown = key; return schedule($, CHOICE_PAUSE_MS, gen) }
      const choices = s.scene.choices
      const d = await decide($, p, s, 'choice', choices.map(c => `[${c.kind}] ${c.text}`), cfg.strategy, a.target, seen, lang)
      await charge($, d.usage)
      if (d.error) return await stopAuto($, 'autoError', { err: d.error })
      if (gen !== autoGen) return
      await update($, auto, x => ({ ...x, reason: reasonOf(lang, d) }))
      await choose($, choices[d.index]!)
      return schedule($, wait, gen)
    }
    if (s.phase === 'after') { await advance($); return schedule($, wait, gen) }
    return schedule($, wait, gen)
  } catch (err) {
    await stopAuto($, 'autoError', { err: String((err as Error)?.message ?? err).slice(0, 80) })
  }
}

// ---------- 边等边玩与陪伴模式 ----------
async function companionSay($: EngineInterface, cue: CompanionCue): Promise<void> {
  const st = await read($, settings)
  if (!st.companion) return
  const p = await currentPack($)
  const c = castOf(p, st.companion)
  if (!c) return
  const now = await nowMs($)
  const w = await read($, work)
  if (!okWork(w) || !canSpeak(w.said, now)) return
  const line = companionLine(st.lang, cue, tr(c.short, st.lang, p.defaultLang), w.said.length + Math.floor(now / 1000))
  await update($, work, x => ({ ...x, said: [...x.said.filter(y => now - y < 3600_000), now], line }))
  await refreshStatus($)
}

async function onTurnStart($: EngineInterface): Promise<void> {
  const st = await read($, settings)
  const now = await nowMs($)
  const w = await read($, work)
  const prev = okWork(w) ? w : DEFAULT_WORK
  const since = !prev.since || now - prev.lastTurn > BREAK_GAP_MS ? now : prev.since
  await update($, work, x => ({ ...(okWork(x) ? x : DEFAULT_WORK), busy: true, since, lastTurn: now, notice: (st.watch !== false ? 'busy' : '') as WorkState['notice'] }))
  if (st.companion && now - since >= REST_AFTER_MS) await companionSay($, 'rest')
}

/** Claude 写完或在等批准：暂停游戏（含自动模式），在面板上提示 */
async function pauseForClaude($: EngineInterface, why: 'done' | 'permission'): Promise<void> {
  const st = await read($, settings)
  const now = await nowMs($)
  await update($, work, x => ({ ...(okWork(x) ? x : DEFAULT_WORK), busy: why === 'permission', lastTurn: now, notice: (st.watch !== false ? why : '') as WorkState['notice'] }))
  if (st.watch === false) return
  const a = await read($, auto)
  if (okAuto(a) && a.on) await stopAuto($, why === 'done' ? 'watchDone' : 'watchPermission')
  const s = await read($, story)
  if (s.phase !== 'title') {
    $.ui.toast(t(st.lang, why === 'done' ? 'watchDone' : 'watchPermission'))
    sfx($, st, 'notice')
  }
  await companionSay($, why)
}

/** 写代码的事件：只看命令种类和成败，不留命令、路径、输出 */
async function onWorkEvent($: EngineInterface, ev: WorkEvent): Promise<void> {
  const st = await read($, settings)
  await companionSay($, ev)
  if (!st.workEvents) return
  const s = await read($, story)
  if (s.phase === 'title' || s.phase === 'ending') return
  await update($, story, x => ({ ...x, world: [...x.world, ev].slice(-4) }))
  if (ev === 'commit') {
    const p = await currentPack($, s.pack)
    const best = p.cast.filter(c => (s.heroines[c.id]?.lastDay ?? 0) > 0).sort((a, b) => (s.heroines[b.id]?.affection ?? 0) - (s.heroines[a.id]?.affection ?? 0))[0]
    if (best && s.keepsakes.filter(k => k.title.includes('#') || k.title.includes('提交')).length < 3) {
      const n = s.keepsakes.filter(k => k.title.includes('#') || k.title.includes('提交')).length + 1
      await giveKeepsake($, p, commitKeepsake(p.id, best.id, s.day, st.lang, n), st.lang)
    }
  }
}

// ---------- 生成剧本包、从项目生成、导出、社区 ----------
// 这些是另一条线写的模块（gen.ts / share.ts / browse.ts）：纯逻辑加 $ 调用；这里负责状态、进度、取消、保存。
let genAbort: AbortController | null = null
/** 社区索引的完整条目（含下载地址）；面板只显示 job.entries 里的摘要。模块变量，不是状态 */
let communityEntries: CommunityEntry[] = []

function jobLine(lang: Lang, j: JobState): string {
  if (j.kind !== 'gen' && j.kind !== 'repo') return j.kind === 'browse' ? t(lang, 'communityLoading') : ''
  const step = j.step === 'expand' ? t(lang, 'genExpand') : j.step === 'repair' ? t(lang, 'genRepair', { n: j.attempt }) : t(lang, 'genOutline')
  return t(lang, 'genRunning', { step })
}

async function setJob($: EngineInterface, fn: (j: JobState) => JobState): Promise<void> {
  await update($, job, x => fn(okJob(x) ? x : DEFAULT_JOB))
  await refreshStatus($)
}

/** 换一个不冲突的 id：内置包、已导入的包都不能撞 */
async function freeId($: EngineInterface, id: string): Promise<string> {
  const taken = new Set([...allPacks(await read($, packs)).map(e => e.id), ...Object.keys(((await $.store.get('packs-imported')) ?? {}) as object)])
  if (!taken.has(id)) return id
  for (let n = 2; ; n++) if (!taken.has(`${id}-${n}`)) return `${id}-${n}`
}

/** 保存一个校验过的包：存进导入表（下次启动还在），并尽量在剧本目录里留一份 JSON 方便手改 */
async function savePack($: EngineInterface, pack: Pack, origin: 'imported' | 'community', replace = false): Promise<Pack> {
  const id = replace ? pack.id : await freeId($, pack.id)
  const p = { ...pack, id }
  const stored = ((await $.store.get('packs-imported')) ?? {}) as Record<string, unknown>
  await $.store.set('packs-imported', { ...stored, [id]: p })
  if (origin === 'community') {
    const ids = ((await $.store.get('packs-community')) as string[] | undefined) ?? []
    await $.store.set('packs-community', [...new Set([...ids, id])])
  }
  try { await $.fs.write(`${await packDir($)}/${id}.json`, JSON.stringify(p, null, 2)) } catch { /* 目录写不了也没关系：导入表里已经有了 */ }
  await loadExtraPacks($)
  return p
}

async function draftPath($: EngineInterface, id: string): Promise<string> {
  const home = (await $.env.get('USERPROFILE')) ?? (await $.env.get('HOME')) ?? '.'
  return `${home.replace(/\\/g, '/')}/.claude/galgame-drafts/${id || 'draft'}.draft.json`
}

async function handleGenResult($: EngineInterface, r: GenResult, lang: Lang): Promise<string> {
  await charge($, r.usage)
  if (r.refused) { $.ui.toast(r.refused); return r.refused }
  if (r.pack) {
    const p = await savePack($, r.pack, 'imported')
    const msg = `${t(lang, 'genDone', { title: tr(p.title, lang, p.defaultLang) })}${r.homage ? ` ${r.homage}` : ''}`
    $.ui.toast(msg)
    return msg
  }
  if (genAbort?.signal.aborted) return t(lang, 'genCancelled')
  let path = ''
  try {
    const id = String((JSON.parse(r.json || '{}') as { id?: unknown }).id ?? 'draft')
    path = await draftPath($, id.replace(/[^a-z0-9_-]/gi, '') || 'draft')
    await $.fs.write(path, r.json)
  } catch { path = '-' }
  const errors = r.errors.filter(e => !e.startsWith('privacy:')).slice(0, 4).join('; ') || r.errors.slice(0, 1).map(() => 'privacy').join('')
  const msg = t(lang, 'genFailed', { errors, path })
  $.ui.toast(msg)
  return msg
}

/** 一句话生成（几分钟，后台跑，状态栏显示进度，可取消） */
async function runGenerate($: EngineInterface, idea: string, days?: number, cast?: number): Promise<void> {
  const st = await read($, settings)
  genAbort = new AbortController()
  const signal = genAbort.signal
  await setJob($, j => ({ ...j, kind: 'gen', step: 'outline', attempt: 0, message: t(st.lang, 'genStart', { idea }) }))
  try {
    const r = await generatePack($, idea, { lang: st.lang, days, castSize: cast, signal, onStep: (step: GenStep, attempt: number) => { if (step !== 'done') void setJob($, j => ({ ...j, step, attempt })) } })
    const msg = signal.aborted ? t(st.lang, 'genCancelled') : await handleGenResult($, r, st.lang)
    await setJob($, j => ({ ...j, kind: '', step: '', message: msg }))
  } catch (err) {
    await setJob($, j => ({ ...j, kind: '', step: '', message: String((err as Error)?.message ?? err).slice(0, 120) }))
  } finally {
    genAbort = null
  }
}

/** 从当前项目生成：先列出要读的文件，等玩家确认 */
async function askRepo($: EngineInterface, root: string, idea: string): Promise<string> {
  const st = await read($, settings)
  const d = await scanRepo($, root)
  const files = d.read.length ? d.read : ['(none)']
  await setJob($, j => ({ ...j, kind: 'confirm', scan: { root, idea, files, bytes: d.bytes }, message: '' }))
  return t(st.lang, 'repoConfirm', { files: files.join('、'), n: d.read.length, kb: Math.max(1, Math.round(d.bytes / 1024)) })
}

async function runRepo($: EngineInterface): Promise<void> {
  const j0 = await read($, job)
  if (!okJob(j0) || j0.kind !== 'confirm' || !j0.scan) return
  const { root, idea } = j0.scan
  const st = await read($, settings)
  genAbort = new AbortController()
  const signal = genAbort.signal
  await setJob($, j => ({ ...j, kind: 'repo', step: 'outline', attempt: 0, scan: null }))
  try {
    const r = await packFromRepo($, root, idea || undefined, { lang: st.lang, signal, onStep: (step: GenStep, attempt: number) => { if (step !== 'done') void setJob($, j => ({ ...j, step, attempt })) } })
    const msg = signal.aborted ? t(st.lang, 'genCancelled') : await handleGenResult($, r, st.lang)
    await setJob($, j => ({ ...j, kind: '', step: '', message: msg }))
  } catch (err) {
    await setJob($, j => ({ ...j, kind: '', step: '', message: String((err as Error)?.message ?? err).slice(0, 120) }))
  } finally {
    genAbort = null
  }
}

async function cancelJob($: EngineInterface): Promise<void> {
  const st = await read($, settings)
  genAbort?.abort()
  await setJob($, j => ({ ...j, kind: '', step: '', scan: null, message: t(st.lang, 'genCancelled') }))
}

/** 导出这一局（不调用模型）：写到会话根目录 */
async function doExport($: EngineInterface, format: ExportFormat): Promise<string> {
  const st = await read($, settings)
  const s = await read($, story)
  const p = await currentPack($, s.pack)
  try {
    const root = await $.session.root()
    const path = `${root.replace(/\\/g, '/')}/${exportFileName(s, p, format)}`
    await $.fs.write(path, exportRun(s, p, st.lang, format, { quotes: s.quotes }))
    const msg = t(st.lang, 'exported', { path })
    $.ui.toast(msg)
    return msg
  } catch (err) {
    const msg = t(st.lang, 'exportFail', { err: String((err as Error)?.message ?? err).slice(0, 80) })
    $.ui.toast(msg)
    return msg
  }
}

async function shareText($: EngineInterface): Promise<string> {
  const st = await read($, settings)
  const s = await read($, story)
  return shareSummary(s, await currentPack($, s.pack), st.lang)
}

/** 结局卡：不剧透的分享方格（结局页按 C；/gal card） */
async function cardText($: EngineInterface): Promise<string> {
  const st = await read($, settings)
  const s = await read($, story)
  return endingCard(s, await currentPack($, s.pack), st.lang)
}

/** 社区索引（不调用模型）；被许可白名单挡下的条目不显示，只写调试日志 */
async function browse($: EngineInterface): Promise<void> {
  const st = await read($, settings)
  await setJob($, j => ({ ...j, kind: 'browse', message: '' }))
  const r = await fetchIndex($)
  for (const x of r.rejected) $.ui.log(`galgame community: ${x.id}: ${x.reason}`, { to: 'debug' })
  communityEntries = r.entries
  const T = (x: Parameters<typeof tr>[0]) => tr(x, st.lang, 'en')
  await setJob($, j => ({
    ...j, kind: '', message: r.error ? t(st.lang, 'communityFail', { err: r.error }) : r.entries.length ? '' : t(st.lang, 'communityEmpty'),
    entries: r.entries.map(e => ({ id: e.id, title: T(e.title), author: e.author, license: e.license, lang: e.lang.join('/'), summary: T(e.summary) })),
  }))
}

async function install($: EngineInterface, id: string): Promise<void> {
  const st = await read($, settings)
  const e = communityEntries.find(x => x.id === id)
  if (!e) return
  const title = tr(e.title, st.lang, 'en')
  await setJob($, j => ({ ...j, kind: 'download', message: t(st.lang, 'downloading', { title }) }))
  const r = await fetchPack($, e)
  if (!r.pack) {
    await setJob($, j => ({ ...j, kind: '', message: t(st.lang, 'installFail', { err: r.errors[0] ?? '?' }) }))
    return
  }
  if (BUILTIN.some(b => b.id === r.pack!.id)) {
    await setJob($, j => ({ ...j, kind: '', message: t(st.lang, 'installFail', { err: `"${r.pack!.id}" is built in` }) }))
    return
  }
  await savePack($, r.pack, 'community', true)
  const msg = t(st.lang, 'installed', { title })
  $.ui.toast(msg)
  await setJob($, j => ({ ...j, kind: '', message: msg }))
}

// ---------- 剧情画面的条目（旁白、特写、台词、留白） ----------
type Item = { who: string; text: string; line: number; kind: 'narration' | 'focus' | 'line' | 'pause' }

/** 一幕的条目：旁白（0），镜头特写跟在旁白后，留白插在第 pause 句之后；line 是原来的句号（演出指令按它算） */
function sceneItems(sc: NonNullable<Story['scene']>, focusText: string): Item[] {
  const out: Item[] = [{ who: '', text: sc.narration, line: 0, kind: 'narration' }]
  if (sc.camera?.focus) out.push({ who: '', text: focusText || sc.camera.focus, line: 0, kind: 'focus' })
  sc.lines.forEach((l, i) => {
    out.push({ who: l.who, text: l.text, line: i + 1, kind: 'line' })
    if (sc.camera?.pause === i + 1 && i + 1 < sc.lines.length) out.push({ who: '', text: '……', line: i + 1, kind: 'pause' })
  })
  return out
}

// ---------- 小部件 ----------
/** 关系值：五格，图标来自角色的 meter（恋爱角色默认 ♥ ♡，非恋爱角色如「看穿 ◆◇」「信任 ●○」） */
function hearts(n: number, max: number, on = '♥', off = '♡'): string {
  const full = Math.max(0, Math.min(5, Math.round((n / Math.max(1, max)) * 5)))
  return on.repeat(full) + off.repeat(5 - full)
}

const KIND_ICON: Record<string, string> = { reply: '❝', observe: '◎', promise: '✦', keep: '✔' }
// 终端深浅还读不到（VISUAL-REDESIGN §5-2），先按深色
const BG: Bg = 'dark'
const TONE_ORDER: Tone[] = ['honest', 'evasive', 'joking', 'committed', 'caring', 'bold']

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'gal', description: 'AI 视觉小说 / AI visual novel', argumentHint: '[new <idea> | repo [path] | export [html|md] | share | card | browse | cancel | import | validate <path.json>]' })
    const st = await $.store.get('settings')
    if (st && typeof st === 'object') await update($, settings, () => ({ ...DEFAULT_SETTINGS, ...(st as Partial<GalSettings>) }))
    const m = await $.store.get('meta')
    if (m && typeof m === 'object') await update($, meta, () => m as Meta)
    const f = await $.store.get('feats')
    if (okFeats(f)) await update($, feats, () => f)
    await loadExtraPacks($)
    await migrate($)
    return next(e)
  })

  on('session.end', async ($, e, next) => {
    stopAnim()
    layers = []
    autoGen++
    autoTimer?.cancel()
    autoTimer = null
    return next(e)
  })

  // 边等边玩：Claude 开始干活时提示「趁现在玩一幕」；干完或等批准时暂停游戏（只看主循环，不看子代理）
  on('turn.start', async ($, e, next) => {
    const r = await next(e)
    if (!e.agentId) await onTurnStart($)
    return r
  })
  on('turn.complete', async ($, e, next) => {
    const r = await next(e)
    if (!e.agentId) await pauseForClaude($, 'done')
    return r
  })
  on('classic.PermissionRequest', async ($, e, next) => {
    await pauseForClaude($, 'permission')
    return next(e)
  })

  // 写代码的事件：Bash 里的测试、构建、git commit，只取种类和成败
  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const r = await next(e)
    try {
      const command = String(e.command ?? '')
      const failed = 'deny' in r && !!r.deny ? true : !!(r as { isError?: boolean }).isError
      const ev = classifyBash(command, failed)
      if (ev) await onWorkEvent($, ev)
    } catch {
      // 游戏的事不能影响工具调用
    }
    return r
  })

  on('command.run', { command: 'gal' }, async ($, e) => {
    await migrate($)
    const st = await read($, settings)
    const args = e.args.trim()
    if (args.startsWith('validate')) {
      const path = args.slice('validate'.length).trim().replace(/^["']|["']$/g, '')
      return { text: await checkPackFile($, path, st.lang) }
    }
    if (args.startsWith('import')) {
      const path = args.slice('import'.length).trim().replace(/^["']|["']$/g, '')
      if (!path) return { text: t(st.lang, 'importHint', { dir: await packDir($) }) }
      return { text: await importPack($, path, st.lang) }
    }
    const busy = () => { const j = genAbort; return !!j }
    if (args === 'new' || args.startsWith('new ')) {
      let idea = args.slice(3).trim()
      const num = (k: string) => { const m = new RegExp(`--${k}\\s+(\\d+)`).exec(idea); idea = idea.replace(new RegExp(`--${k}\\s+\\d+`), '').trim(); return m ? Number(m[1]) : undefined }
      const days = num('days')
      const cast = num('cast')
      if (!idea) return { text: t(st.lang, 'genHint') }
      if (busy()) return { text: t(st.lang, 'genBusy') }
      void runGenerate($, idea, days, cast)
      return { text: t(st.lang, 'genStart', { idea }) }
    }
    if (args === 'repo' || args.startsWith('repo ')) {
      const rest = args.slice(4).trim()
      if (rest === '--yes') { if (busy()) return { text: t(st.lang, 'genBusy') }; void runRepo($); return { text: t(st.lang, 'genStart', { idea: 'repo' }) } }
      if (busy()) return { text: t(st.lang, 'genBusy') }
      const [first, ...more] = rest.split(/\s+/).filter(Boolean)
      const looksPath = !!first && /[\\/]|^\.$|^~/.test(first)
      const root = looksPath ? first! : await $.session.root()
      const idea = (looksPath ? more : rest.split(/\s+/).filter(Boolean)).join(' ')
      const text = await askRepo($, root, idea)
      await $.ui.open({ id: PANE, title: 'ai-galgame', focus: true })
      return { text: `${text}\n${t(st.lang, 'repoAsk')}` }
    }
    if (args === 'cancel') { await cancelJob($); return { text: t(st.lang, 'genCancelled') } }
    if (args === 'export' || args.startsWith('export ')) return { text: await doExport($, args.includes('md') ? 'md' : 'html') }
    if (args === 'share') return { text: await shareText($) }
    if (args === 'card') return { text: await cardText($) }
    if (args === 'browse') {
      await update($, ui, x => ({ ...x, view: 'packs' as View, tab: 1 }))
      await $.ui.open({ id: PANE, title: 'ai-galgame', focus: true })
      void browse($)
      return { text: t(st.lang, 'communityLoading') }
    }
    await loadExtraPacks($)
    const s = await read($, story)
    if (s.phase === 'loading') await update($, story, x => ({ ...x, phase: 'plan' as const }))
    await update($, ui, x => ({ ...x, view: 'game' as View }))
    if (s.phase === 'title' || s.pack !== st.pack) await update($, story, x => ({ ...x, phase: 'title' as const }))
    await $.ui.open({ id: PANE, title: 'ai-galgame', focus: true })
    void maybeLetter($)
    return { text: t(st.lang, 'opened') }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    // ====== 这里只读状态，不写 ======
    const el = $.ui.resolve(e)
    const { Box, Text, Button } = el
    const RasterEl = 'Raster' in el ? el.Raster : null
    const rawSt = await read($, settings)
    const st: GalSettings = okSettings(rawSt) ? { ...DEFAULT_SETTINGS, ...rawSt } : DEFAULT_SETTINGS
    const rawUi = await read($, ui) as unknown
    const view: UiState = okUi(rawUi) ? rawUi : DEFAULT_UI
    const extra = await read($, packs)
    // 旧格式的状态在这里补成能显示的样子，不写回（写回在 migrate 里）
    const rawStory = await read($, story) as unknown
    const s = (okStory(rawStory) ? normalizeStory(rawStory, packById((rawStory as Story).pack, extra)) : null) ?? TITLE_STORY
    const m = await read($, meta)
    const canUndo = (await read($, undo)).length > 0
    const rawAuto = await read($, auto) as unknown
    const ao: AutoState = okAuto(rawAuto) ? rawAuto : DEFAULT_AUTO
    const rawWork = await read($, work) as unknown
    const wk: WorkState = okWork(rawWork) ? rawWork : DEFAULT_WORK
    const rawJob = await read($, job) as unknown
    const jb: JobState = okJob(rawJob) ? rawJob : DEFAULT_JOB
    const rawFeats = await read($, feats) as unknown
    const fe: Feats = okFeats(rawFeats) ? rawFeats : EMPTY_FEATS
    const cfg = autoCfg(st)
    // 玩家按了自动以外的键：先暂停自动模式，再做这件事（写状态发生在按键回调里，不在画面板时）
    const hit = (fn: () => void) => () => { if (ao.on) void stopAuto($, 'autoKeyPause'); fn() }
    const lang = st.lang
    const L = (k: UiKey, v?: Record<string, string | number>) => t(lang, k, v)
    const list = allPacks(extra)
    const p = (list.find(x => x.id === (view.view === 'packs' ? st.pack : s.phase === 'title' ? st.pack : s.pack)) ?? list[0]!).pack
    const T = packText(p, lang)
    const pm = packMeta(m, p.id)
    const seenCount = p.endings.filter(x => pm.endings.includes(x.id)).length
    const cols = e.props.bodyColumns ?? 80
    const compact = st.layout === 'compact' || (st.layout !== 'full' && cols < 80)
    const anim = st.anim !== false
    const Raster = RasterEl
    const TX = TEXT[BG]
    const cb = st.palette === 'cb'
    const C = { ...(cb ? KIND.cb : KIND.default), ...(cb ? STATE_CB : TX) }
    const stageW = Math.min(STAGE_W, cols - 4)
    const canStage = !!Raster && stageW >= 60
    const nextLayers: Layer[] = []
    const today = dateKey(Date.now())
    const spentToday = fe.today.date === today ? fe.today.usd : 0

    const inScene = view.view === 'game' && (s.phase === 'scene' || s.phase === 'after') && !!s.scene
    const theme = inScene ? themeOf(s.scene?.atmo) : DEFAULT_THEME
    // rawColor 给色块和像素；colorOf 是当前景用的、对终端底色够对比的版本
    const rawColor = (id: string) => (id === 'me' ? TX.me : personOf(p, id)?.color ?? FALLBACK)
    const colorOf = (id: string) => readable(rawColor(id), BG)
    const tinted = (id: string) => tint(rawColor(id), theme, inScene ? 0.22 : 0)
    const nameOf = (id: string) => (id === 'me' ? T(p.me) : T(personOf(p, id)?.name) || id)
    const shortOf = (id: string) => T(personOf(p, id)?.short) || id

    /** 一块（可能会动的）像素画：画初始帧，并登记给动画定时器 */
    const raster = (key: string, w: number, rowsPx: number, draw: (t: number) => Px[][], moving = true) => {
      if (!Raster) return null
      const rows = Math.ceil(rowsPx / 2)
      const lit = (tt: number) => onScreen(draw(tt))
      const c = cells(lit(frame))
      lastCells[key] = c
      if (moving && anim) nextLayers.push({ key, cols: w, rows, draw: lit })
      return <Raster key={key} columns={w} rows={rows} cells={c} />
    }
    /** 标题卡：开场、章名、结局。动画开着时 6 帧淡入或擦入，之后静止 */
    const card = (id: string, spec: CardSpec, w: number) => {
      if (!Raster || compact) return null
      const t0 = startOf(id)
      const h = cardFrame(spec, w, CARD_FRAMES, 0).length
      return raster(`card-${id}`.slice(0, 60), w, h, tt => cardFrame(spec, w, anim ? tt - t0 : CARD_FRAMES, tt))
    }
    const finishRender = <X,>(x: X): X => {
      // 模块变量（不是状态）：告诉动画定时器这一帧有哪些会动的块
      layers = nextLayers
      if (layers.length) ensureAnim($)
      else stopAnim()
      return x
    }

    const keyBar = (items: (false | null | undefined | { k: string; label: string; on: () => void; dim?: boolean; keep?: boolean })[]) => (
      <Box flexDirection="row" gap={1} flexWrap="wrap" marginTop={1}>
        {items.filter(x => !!x).map(x => (
          <Button key={`kb-${x!.k}`} hotkey={x!.k} plain dimColor={x!.dim ?? true} onPress={x!.keep ? x!.on : hit(x!.on)}>{x!.label}</Button>
        ))}
      </Box>
    )
    const autoKey = { k: 'o', label: ao.on ? L('autoStop') : L('autoStart'), keep: true, dim: !ao.on, on: () => void toggleAuto($) }
    const autoInfo = (
      <Box flexDirection="column">
        {ao.on && ao.reason ? <Text dimColor italic wrap="wrap">{ao.reason}</Text> : null}
        {!ao.on && ao.note ? <Text color={TX.accent} wrap="wrap">{ao.note}</Text> : null}
      </Box>
    )
    // 后台任务的横幅：等确认要读哪些文件（Y / N）、生成中（K 取消）、上一条结果
    const jobBanner = jb.kind === 'confirm' && jb.scan ? (
      <Box key="job" flexDirection="column" borderStyle="round" borderColor={TX.accent} paddingX={1}>
        <Text wrap="wrap">{L('repoConfirm', { files: jb.scan.files.join('、'), n: jb.scan.files.length, kb: Math.max(1, Math.round(jb.scan.bytes / 1024)) })}</Text>
        <Box flexDirection="row" gap={2}>
          <Button key="job-yes" hotkey="y" plain onPress={() => void runRepo($)}><Text color={TX.accent} bold>{L('repoYes')}</Text></Button>
          <Button key="job-no" hotkey="n" plain onPress={() => void cancelJob($)}>{L('repoNo')}</Button>
        </Box>
      </Box>
    ) : jb.kind === 'gen' || jb.kind === 'repo' ? (
      <Box key="job" flexDirection="row" gap={2} flexWrap="wrap">
        <Text color={C.info}>⟳ {jobLine(lang, jb)}</Text>
        <Button key="job-cancel" hotkey="k" plain onPress={() => void cancelJob($)}>{L('repoNo')}</Button>
      </Box>
    ) : jb.message && view.view === 'packs' ? <Text key="job" dimColor wrap="wrap">{jb.message}</Text> : null
    const watchInfo = st.watch !== false && wk.notice && s.phase !== 'title'
      ? <Text color={wk.notice === 'busy' ? C.info : C.event} bold={wk.notice !== 'busy'} wrap="wrap">{wk.notice === 'busy' ? '◷ ' : '⏸ '}{L(wk.notice === 'busy' ? 'watchBusy' : wk.notice === 'done' ? 'watchDone' : 'watchPermission')}</Text>
      : null

    const calendar = () => {
      const chars: { ch: string; color?: string }[] = []
      for (let d = 1; d <= p.days; d++) {
        const ev = p.events.some(x => x.day === d) || p.fixed.some(x => x.day === d)
        chars.push(d < s.day ? { ch: '▪' } : d === s.day ? { ch: '◉', color: readable(theme, BG) } : ev ? { ch: '◆', color: C.event } : { ch: '·' })
      }
      return <Text>{chars.map((c, i) => <Text key={`cal${i}`} color={c.color} dimColor={!c.color}>{c.ch}</Text>)}</Text>
    }

    const maxAff = p.gates[4]?.affection ?? 12
    const costText = L('costLine', { run: usd(s.usage.cost ?? 0), today: usd(spentToday) })
    // 顶栏：两行、无边框，下面一根主题色分隔线。剧情里只列在场的人和这一幕好感变了的人
    const onStage = new Set(inScene ? s.scene!.cast.map(a => a.id) : [])
    const header = (
      <Box flexDirection="column">
        <Box flexDirection="row" justifyContent="space-between" flexWrap="wrap" columnGap={2}>
          <Text>
            <Text bold>{dayText(p, lang, s.day)} · {T(p.slots[s.slot])}</Text>
            {compact ? null : <Text>  </Text>}
            {compact ? null : calendar()}
          </Text>
          <Text dimColor>{ao.on ? <Text color={TX.accent} bold>{L('autoBadge')} · </Text> : null}{T(p.title)} · {chapterOf(p, lang, s.day)}{s.loop > 1 ? ` · ${L('runN', { n: s.loop })}` : ''}{p.features?.timeLoop ? ` · ${L('loopNotice', { n: s.cycle })}` : ''}{s.daily ? ` · ${L('dailyMenu')}` : ''} · {costText}</Text>
        </Box>
        <Box flexDirection="row" columnGap={2} flexWrap="wrap">
          {p.cast.map(c => {
            const hs = s.heroines[c.id]
            if (!hs) return null
            if (inScene && !onStage.has(c.id) && !s.deltas[c.id]) return null
            const mt = meterOf(c)
            const d = s.deltas[c.id] ?? 0
            return (
              <Text key={`hs-${c.id}`}>
                <Text color={readable(tinted(c.id), BG)} bold>{T(c.short)} </Text>
                {mt.label ? <Text dimColor>{T(mt.label)} </Text> : null}
                <Text color={readable(tinted(c.id), BG)}>{hearts(hs.affection, maxAff, mt.full, mt.empty)}</Text>
                {d ? <Text color={d > 0 ? C.kept : C.broken} bold>{d > 0 ? ` +${d}` : ` ${d}`}</Text> : null}
                {compact ? null : <Text dimColor> {T(p.stages[hs.stage])}</Text>}
              </Text>
            )
          })}
        </Box>
        <Text color={theme}>{'─'.repeat(Math.max(10, Math.min(cols - 2, 96)))}</Text>
      </Box>
    )

    const gameKeys = (extraItems: Parameters<typeof keyBar>[0] = []) => keyBar([
      ...extraItems,
      canUndo && s.phase !== 'loading' && { k: 'u', label: L('undo'), on: () => void rewind($) },
      { k: 's', label: L('saves'), on: () => void update($, ui, x => ({ ...x, view: 'saves' as View, saveMode: 'save' as const, back: 'game' as View })) },
      { k: 'p', label: L('album'), on: () => void update($, ui, x => ({ ...x, view: 'album' as View, tab: 0, back: 'game' as View })) },
      { k: 'r', label: L('graphKey'), on: () => void update($, ui, x => ({ ...x, view: 'graph' as View, back: 'game' as View })) },
      { k: 'h', label: L('help'), on: () => void update($, ui, x => ({ ...x, view: 'help' as View, back: 'game' as View })) },
      { k: 't', label: L('toTitle'), on: () => void update($, story, x => ({ ...x, phase: x.phase === 'loading' ? x.phase : ('title' as const) })) },
      autoKey,
      { k: 'e', label: L('settings'), keep: true, on: () => void update($, ui, x => ({ ...x, view: 'settings' as View, tab: 0, back: 'game' as View })) },
    ])
    const backKey = keyBar([{ k: 'b', label: L('back'), dim: false, on: () => void update($, ui, x => ({ ...x, view: x.back === x.view ? 'game' : x.back })) }])

    // ---------- 设置（分页；这里的按钮都不打断自动模式） ----------
    if (view.view === 'settings') {
      const u = s.usage
      const sec = Math.max(0, Math.min(4, view.tab))
      const SECS: UiKey[] = ['secDisplay', 'secAuto', 'secAI', 'secCost', 'secWork']
      const SEC_KEYS = ['z', 'x', 'c', 'v', 'n']
      const row = (key: string, hk: string, label: string, value: string, act: () => void, hint?: string) => (
        <Button key={key} hotkey={hk} plain onPress={act}>
          {label}  <Text color={TX.accent}>{value}</Text>{hint ? <Text dimColor>  {hint}</Text> : null}
        </Button>
      )
      const onOff = (b: boolean | undefined) => (b ? L('on') : L('off'))
      const cyc = <V,>(xs: readonly V[], cur: V) => xs[(xs.indexOf(cur) + 1) % xs.length]!
      let body
      if (sec === 0) {
        body = [
          row('set-lang', '1', L('lang'), LANGS.find(l => l.id === lang)!.label, () => void setSettings($, x => ({ ...x, lang: LANGS[(LANGS.findIndex(l => l.id === x.lang) + 1) % LANGS.length]!.id }))),
          row('set-anim', '2', L('anim'), onOff(st.anim), () => void setSettings($, x => ({ ...x, anim: !x.anim }))),
          row('set-page', '3', L('pageMode'), st.pageMode === 'line' ? L('page_line') : L('page_page'), () => void setSettings($, x => ({ ...x, pageMode: x.pageMode === 'line' ? 'page' : 'line' }))),
          row('set-map', '4', L('mapSet'), onOff(st.map !== false), () => void setSettings($, x => ({ ...x, map: x.map === false }))),
          row('set-layout', '5', L('layout'), L(`layout_${st.layout ?? 'auto'}` as UiKey), () => void setSettings($, x => ({ ...x, layout: cyc(['auto', 'compact', 'full'] as const, x.layout ?? 'auto') }))),
          row('set-palette', '6', L('palette'), L(`palette_${st.palette ?? 'default'}` as UiKey), () => void setSettings($, x => ({ ...x, palette: x.palette === 'cb' ? 'default' : 'cb' }))),
          row('set-voice', '7', L('voice'), onOff(st.voice), () => void setSettings($, x => ({ ...x, voice: !x.voice }))),
          row('set-sfx', '8', L('sfx'), onOff(st.sfx), () => void setSettings($, x => ({ ...x, sfx: !x.sfx }))),
          row('set-short', '9', L('short'), onOff(st.short), () => void setSettings($, x => ({ ...x, short: !x.short }))),
        ]
      } else if (sec === 1) {
        body = [
          row('set-strategy', '1', L('autoStrategy'), L(`strategy_${cfg.strategy}` as UiKey), () => void setSettings($, x => ({ ...x, autoStrategy: cyc(AUTO_STRATEGIES, autoCfg(x).strategy) })).then(() => update($, auto, x => ({ ...x, target: '' }))), L(`strategyHint_${cfg.strategy}` as UiKey)),
          cfg.strategy === 'focus' ? row('set-target', '2', L('autoTarget'), castOf(p, cfg.target) ? T(castOf(p, cfg.target)!.name) : L('autoTargetAsk'), () => void setSettings($, x => ({ ...x, autoTarget: cyc(['', ...p.cast.map(c => c.id)], autoCfg(x).target) })).then(() => update($, auto, x => ({ ...x, target: '' }))), ao.on && ao.target ? `(${T(castOf(p, ao.target)?.short)})` : undefined) : null,
          row('set-speed', '3', L('autoSpeed'), L(`speed_${cfg.speed}` as UiKey), () => void setSettings($, x => ({ ...x, autoSpeed: cyc(AUTO_SPEEDS, autoCfg(x).speed) }))),
          row('set-limit', '4', L('autoLimit'), cfg.limit > 0 ? L('autoLimitN', { n: cfg.limit }) : L('autoLimitDay'), () => void setSettings($, x => ({ ...x, autoLimit: cyc(AUTO_LIMITS, autoCfg(x).limit) }))),
        ]
      } else if (sec === 2) {
        body = EXTRA_KEYS.map((k, i) => row(`set-x-${k}`, String(i + 1), L(`extra_${k}` as UiKey), onOff(extraOn(st, k)), () => void setSettings($, x => ({ ...x, extras: { ...x.extras, [k]: !(x.extras?.[k] !== false) } }))))
      } else if (sec === 3) {
        body = [
          row('set-writer', '1', L('writer'), L(st.writer === 'haiku' ? 'writer_haiku' : 'writer_sonnet'), () => void setSettings($, x => ({ ...x, writer: x.writer === 'haiku' ? 'sonnet' : 'haiku' }))),
          row('set-budget', '2', L('budget'), st.budget ? usd(st.budget) : L('budgetNone'), () => void setSettings($, x => ({ ...x, budget: cyc(BUDGETS, x.budget ?? 0) }))),
          <Box key="usage" flexDirection="column" marginTop={1}>
            <Text dimColor>{L('usage')}</Text>
            <Text dimColor>{L('usageLine', { w: u.writer, c: u.checker, i: u.input, r: u.cacheRead, o: u.output })}</Text>
            <Text dimColor>{L('usagePilot', { n: u.pilot ?? 0, i: u.pilotIn ?? 0, o: u.pilotOut ?? 0 })}</Text>
            <Text dimColor>{L('usageExtra', { n: u.extra ?? 0, i: u.extraIn ?? 0, o: u.extraOut ?? 0 })}</Text>
            <Text dimColor>{L('usageCost', { run: usd(u.cost ?? 0), today: usd(spentToday) })}</Text>
          </Box>,
        ]
      } else {
        body = [
          row('set-watch', '1', L('watch'), onOff(st.watch !== false), () => void setSettings($, x => ({ ...x, watch: x.watch === false }))),
          row('set-work', '2', L('workEvents'), onOff(st.workEvents), () => void setSettings($, x => ({ ...x, workEvents: !x.workEvents }))),
          row('set-companion', '3', L('companion'), castOf(p, st.companion ?? '') ? T(castOf(p, st.companion!)!.name) : L('companionOff'), () => void setSettings($, x => ({ ...x, companion: cyc(['', ...p.cast.map(c => c.id)], x.companion ?? '') })).then(() => refreshStatus($))),
        ]
      }
      return finishRender(
        <Box flexDirection="column">
          <Text bold color={TX.accent}>{L('settings')}{ao.on ? <Text dimColor> · {L('autoBadge')}</Text> : null}</Text>
          <Box flexDirection="row" gap={2} flexWrap="wrap">
            {SECS.map((k, i) => (
              <Button key={`sec${i}`} hotkey={SEC_KEYS[i]} plain dimColor={sec !== i} onPress={() => void update($, ui, x => ({ ...x, tab: i }))}>{sec === i ? '▶ ' : ''}{L(k)}</Button>
            ))}
          </Box>
          <Box flexDirection="column" marginTop={1}>{body}</Box>
          {sec === 0 ? <Text dimColor wrap="wrap">{L('importHint', { dir: '~/.claude/galgame-packs' })}</Text> : null}
          {keyBar([{ k: 'b', label: L('back'), dim: false, keep: true, on: () => void update($, ui, x => ({ ...x, view: x.back === x.view ? 'game' : x.back, tab: 0 })) }])}
        </Box>,
      )
    }

    // ---------- 操作说明 ----------
    if (view.view === 'help') {
      return finishRender(
        <Box flexDirection="column">
          <Text bold color={TX.accent}>{L('help')}</Text>
          <Box flexDirection="column" marginTop={1} gap={1}>
            {helpLines(lang).map((x, i) => <Text key={`help${i}`} wrap="wrap">{x}</Text>)}
          </Box>
          {backKey}
        </Box>,
      )
    }

    // ---------- 关系图 ----------
    if (view.view === 'graph') {
      const gw = Math.max(40, Math.min(76, cols - 4))
      const gh = 34
      const graph = relationGraph(p, s, s.deltas, gw, gh, frame)
      const revealed = (p.relations ?? []).filter(r => r.hiddenUntil === undefined || [r.a, r.b].some(x => castOf(p, x) && (s.heroines[x]?.stage ?? 0) >= r.hiddenUntil!))
      return finishRender(
        <Box flexDirection="column">
          <Text bold color={TX.accent}>{L('graph')}</Text>
          {Raster && !compact ? raster('graph', gw, gh, tt => relationGraph(p, s, s.deltas, gw, gh, tt).px, Object.keys(s.deltas).length > 0) : null}
          <Box flexDirection="row" columnGap={2} flexWrap="wrap">
            {graph.nodes.filter(n => castOf(p, n.id)).map(n => {
              const c = castOf(p, n.id)!
              const hs = s.heroines[n.id]
              const mt = meterOf(c)
              return <Text key={`gn-${n.id}`}><Text color={colorOf(c.id)}>■ {T(c.short)} </Text><Text color={colorOf(c.id)}>{hearts(hs?.affection ?? 0, maxAff, mt.full, mt.empty)}</Text><Text dimColor> {T(p.stages[hs?.stage ?? 0])}</Text></Text>
            })}
          </Box>
          <Box flexDirection="column" marginTop={1}>
            {revealed.map((r, i) => (
              <Text key={`rel${i}`} dimColor wrap="wrap">
                <Text color={colorOf(r.a)}>{r.a === 'me' ? T(p.me) : shortOf(r.a)}</Text> — <Text color={colorOf(r.b)}>{r.b === 'me' ? T(p.me) : shortOf(r.b)}</Text>  {T(r.kind)}
              </Text>
            ))}
          </Box>
          <Text dimColor wrap="wrap">{L('graphHint')}</Text>
          {backKey}
        </Box>,
      )
    }

    // ---------- 成就与每日挑战 ----------
    if (view.view === 'feats') {
      const dc = dailyChallenge(today, BUILTIN)
      const res = fe.daily[today]
      const resPack = res ? BUILTIN.find(b => b.id === res.pack) : undefined
      const resEnd = resPack?.endings.find(x => x.id === res?.ending)
      return finishRender(
        <Box flexDirection="column">
          <Text bold color={TX.accent}>{L('feats')}</Text>
          <Text dimColor>{L('statsLine', { c: fe.stats.clears, s: fe.stats.scenes, cost: usd(fe.stats.cost) })}</Text>
          <Box flexDirection="column" marginTop={1}>
            {ACHIEVEMENTS.map(id => {
              const got = fe.achievements.includes(id)
              return <Text key={`ach-${id}`} color={got ? TX.accent : undefined} dimColor={!got}>{got ? '★' : '☆'} {L(`ach_${id}` as UiKey)}<Text dimColor>  {L(`achd_${id}` as UiKey)}</Text></Text>
            })}
          </Box>
          <Box flexDirection="column" marginTop={1} borderStyle="round" borderDimColor paddingX={1}>
            <Text bold>{L('dailyTitle')} · {today}</Text>
            <Text dimColor wrap="wrap">{L('dailyHint')}</Text>
            {res && resPack && resEnd ? (
              <>
                <Text>{L('dailyDone', { ending: tr(resEnd.title, lang, resPack.defaultLang) })}</Text>
                <Text dimColor>{L('dailyShare')} {dailyShare(today, tr(resPack.title, 'en', resPack.defaultLang), tr(resEnd.title, 'en', resPack.defaultLang), res.kind)}</Text>
                {s.daily === today && s.phase === 'ending' ? endingCard(s, p, lang).split('\n').map((x, i) => <Text key={`dcard${i}`}>{x}</Text>) : null}
              </>
            ) : (
              <Button key="daily-start" hotkey="1" plain onPress={hit(() => void startDaily($))}>{L('dailyStart', { title: tr(dc.pack.title, lang, dc.pack.defaultLang) })}</Button>
            )}
          </Box>
          {keyBar([{ k: 'b', label: L('back'), dim: false, on: () => void update($, ui, x => ({ ...x, view: 'game' as View })) }])}
        </Box>,
      )
    }

    // ---------- 剧本选择 ----------
    if (view.view === 'packs' && view.tab === 1) {
      const installed = new Set(list.map(x => x.id))
      return finishRender(
        <Box flexDirection="column">
          <Box flexDirection="row" gap={2}>
            <Button key="pk-tab0" hotkey="l" plain dimColor onPress={hit(() => void update($, ui, x => ({ ...x, tab: 0 })))}>{L('packs')}</Button>
            <Text bold color={TX.accent}>▶ {L('community')}</Text>
          </Box>
          {jobBanner}
          {jb.kind === 'browse' ? <Text color={C.info}>⟳ {L('communityLoading')}</Text> : null}
          <Box flexDirection="column" marginTop={1}>
            {jb.entries.map((en, i) => (
              <Button key={`cm-${en.id}`} hotkey={i < 9 ? String(i + 1) : undefined} plain onPress={hit(() => void install($, en.id))}>
                <Text bold>{en.title}</Text>
                <Text dimColor>  {en.author} · {en.license} · {en.lang}  </Text>
                <Text color={TX.accent}>{installed.has(en.id) ? L('update') : L('install')}</Text>
                {compact ? null : <Text dimColor>  {en.summary}</Text>}
              </Button>
            ))}
          </Box>
          {keyBar([
            { k: 'g', label: L('communityLoading').replace(/[….]+$/, ''), on: () => void browse($) },
            { k: 'b', label: L('back'), dim: false, on: () => void update($, ui, x => ({ ...x, view: 'game' as View, tab: 0 })) },
          ])}
        </Box>,
      )
    }

    if (view.view === 'packs') {
      return finishRender(
        <Box flexDirection="column">
          <Box flexDirection="row" gap={2}>
            <Text bold color={TX.accent}>▶ {L('packs')}</Text>
            <Button key="pk-tab1" hotkey="c" plain dimColor onPress={hit(() => { void update($, ui, x => ({ ...x, tab: 1 })); if (!jb.entries.length) void browse($) })}>{L('community')}</Button>
          </Box>
          {jobBanner}
          <Box flexDirection="column" marginTop={1}>
            {list.map((en, i) => {
              const q = en.pack
              const Q = packText(q, lang)
              const cur = q.id === st.pack
              return (
                <Button key={`pk-${en.id}`} hotkey={i < 9 ? String(i + 1) : undefined} plain onPress={hit(() => void setSettings($, x => ({ ...x, pack: q.id })).then(() => update($, story, x => ({ ...x, phase: 'title' as const }))))}>
                  <Text bold color={cur ? TX.accent : undefined}>{cur ? '▶ ' : '  '}{Q(q.title)}</Text>
                  <Text dimColor>  {Q(q.subtitle)} · {L('castN', { n: q.cast.length })}{q.npcs?.length ? ` · ${L('npcs', { n: q.npcs.length })}` : ''} · {q.days}d · {L(`packOrigin_${en.origin}` as UiKey)}{q.langs.includes(lang) ? '' : ` · ${q.defaultLang}`}</Text>
                </Button>
              )
            })}
          </Box>
          <Box flexDirection="column" marginTop={1} borderStyle="round" borderDimColor paddingX={1}>
            <Text bold>{T(p.title)}</Text>
            {p.source === 'original'
              ? <Text dimColor>{L('original')} · {p.author}</Text>
              : <Text dimColor wrap="wrap">{L('sourceBy', { work: T(p.source.work), author: T(p.source.author), license: T(p.source.license) })}{p.source.notice ? `\n${T(p.source.notice)}` : ''}</Text>}
            {p.notes ? <Text wrap="wrap"><Text color={TX.accent}>{L('homage')}：</Text>{T(p.notes)}</Text> : null}
            {p.source !== 'original' ? <Text wrap="wrap" dimColor>{T(p.source.adaptation)}</Text> : null}
          </Box>
          <Text dimColor wrap="wrap">{L('importHint', { dir: '~/.claude/galgame-packs' })}</Text>
          <Text dimColor wrap="wrap">{L('genHint')}</Text>
          {keyBar([
            { k: 'f', label: L('repoKey'), on: () => void $.session.root().then(root => askRepo($, root, '')) },
            { k: 'b', label: L('back'), dim: false, on: () => void update($, ui, x => ({ ...x, view: 'game' as View })) },
          ])}
        </Box>,
      )
    }

    // ---------- 存档 ----------
    if (view.view === 'saves') {
      const pack = s.phase === 'title' ? st.pack : s.pack
      const files = await Promise.all([0, ...SAVE_SLOTS].map(n => readSave($, pack, n, extra)))
      const canSave = view.saveMode === 'save' && s.pack === pack && (s.phase === 'plan' || s.phase === 'after' || s.phase === 'scene')
      const info = (f: SaveRead) => {
        if (f === 'bad') return L('saveBad')
        if (!f) return L('empty')
        const q = list.find(x => x.id === f.story.pack)?.pack ?? p
        const d = new Date(f.at)
        const when = `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
        return `${dayText(q, lang, f.story.day)} ${tr(q.slots[f.story.slot], lang, q.defaultLang)} · ${chapterOf(q, lang, f.story.day)} · ${when}`
      }
      return finishRender(
        <Box flexDirection="column">
          <Box flexDirection="row" gap={2}>
            <Button key="mode-save" hotkey="w" plain dimColor={view.saveMode !== 'save'} onPress={hit(() => void update($, ui, x => ({ ...x, saveMode: 'save' as const })))}>{view.saveMode === 'save' ? '▶ ' : ''}{L('modeSave')}</Button>
            <Button key="mode-load" hotkey="r" plain dimColor={view.saveMode !== 'load'} onPress={hit(() => void update($, ui, x => ({ ...x, saveMode: 'load' as const })))}>{view.saveMode === 'load' ? '▶ ' : ''}{L('modeLoad')}</Button>
          </Box>
          <Box flexDirection="column" marginTop={1} borderStyle="round" borderDimColor paddingX={1}>
            {[0, ...SAVE_SLOTS].map((n, i) => {
              const f = files[i] ?? null
              const label = n === 0 ? L('auto') : L('slot', { n })
              const act = view.saveMode === 'save'
                ? (n === 0 || !canSave ? null : () => void writeSave($, n).then(() => { $.ui.toast(L('saved', { n })); return update($, ui, x => ({ ...x })) }))
                : (okSave(f) ? () => void loadSlot($, pack, n) : null)
              return act ? (
                <Button key={`slot${n}`} hotkey={String(n)} plain onPress={hit(act)}>
                  <Text bold>{label}</Text><Text dimColor>  {info(f)}</Text>
                </Button>
              ) : (
                <Text key={`slotx${n}`} dimColor>   {label}  {info(f)}</Text>
              )
            })}
          </Box>
          {backKey}
        </Box>,
      )
    }

    // ---------- 相册：回忆 / 信物 / 结局 / 约定 / 她的日记 / 你在她眼里 ----------
    if (view.view === 'album') {
      const tabs: UiKey[] = ['tabMemories', 'tabKeepsakes', 'tabEndings', 'tabPromises', 'tabDiary', 'tabPortrait']
      const mine = s.pack === p.id
      const perRow = Math.max(1, Math.floor((cols - 2) / 28))
      const tab = Math.max(0, Math.min(tabs.length - 1, view.tab))
      let body
      if (tab === 0) {
        const mem = mine ? s.album.slice(-16) : []
        const nights = mine ? s.gossip.slice(-4) : []
        body = mem.length ? [
          ...mem.map((x, i) => (
            <Text key={`mem${i}`} wrap="wrap">
              <Text dimColor>{dayText(p, lang, x.day)} {T(p.slots[x.slot])}  </Text>
              <Text color={x.heroine ? colorOf(x.heroine) : undefined}>{x.heroine ? `${shortOf(x.heroine)}  ` : ''}</Text>
              <Text>{x.text}</Text>
            </Text>
          )),
          ...nights.map((g, i) => <Text key={`gos${i}`} dimColor italic wrap="wrap">☾ {dayText(p, lang, g.day)}  {g.text}</Text>),
        ] : <Text dimColor>{L('noMemories')}</Text>
      } else if (tab === 1) {
        const ks: Keepsake[] = pm.keepsakes
        body = ks.length ? (
          <Box flexDirection="row" flexWrap="wrap" gap={2}>
            {ks.slice(-perRow * 2).map((k, i) => (
              <Box key={`ks${i}`} flexDirection="column" width={26}>
                {Raster ? <Raster key={`ksr${i}`} columns={24} rows={12} cells={cells(onScreen(keepsakeFrame(k)))} /> : null}
                <Text bold color={colorOf(k.heroine)}>{k.title}</Text>
                <Text dimColor wrap="wrap">{k.desc}</Text>
              </Box>
            ))}
          </Box>
        ) : <Text dimColor wrap="wrap">{L('noKeepsakes')}</Text>
      } else if (tab === 2) {
        body = (
          <Box flexDirection="column">
            <Text dimColor>{L('endingsSeen', { a: seenCount, b: p.endings.length })} · {L('clears', { n: pm.clears })}</Text>
            {p.endings.map(x => {
              const seen = pm.endings.includes(x.id)
              return (
                <Text key={`end-${x.id}`} wrap="wrap">
                  <Text color={seen ? (x.who ? colorOf(x.who) : TX.accent) : undefined} dimColor={!seen}>{seen ? '★' : '☆'} {seen ? T(x.title) : L('locked')}</Text>
                  <Text dimColor>{x.who ? `  ${shortOf(x.who)}` : ''}{x.who && meterOf(castOf(p, x.who)).label ? ` · ${T(meterOf(castOf(p, x.who)).label)}` : ''}{x.kind ? ` · ${L(`end_${x.kind}` as UiKey)}` : ''}</Text>
                </Text>
              )
            })}
          </Box>
        )
      } else if (tab === 3) {
        const ps = mine ? s.promises : []
        body = ps.length ? ps.map((x, i) => (
          <Text key={`pr${i}`} color={x.status === 'kept' ? C.kept : x.status === 'broken' ? C.broken : undefined} wrap="wrap">
            {x.status === 'kept' ? '✓' : x.status === 'broken' ? '✗' : '○'} {x.key ? '★' : ''}<Text color={colorOf(x.heroine)}>{shortOf(x.heroine)}</Text>：{x.text}（{dayText(p, lang, x.due)}）
          </Text>
        )) : <Text dimColor>—</Text>
      } else if (tab === 4) {
        // 她的日记：关系到「心事」解锁；打开某一天时才生成（1 次 Haiku），之后缓存在存档里
        const open = p.cast.filter(c => (s.heroines[c.id]?.stage ?? 0) >= 2)
        const pick = open.find(c => c.id === view.pick) ?? open[0]
        const days = pick ? [...new Set(s.album.filter(a => a.heroine === pick.id).map(a => a.day))].slice(-3) : []
        body = !extraOn(st, 'diary') ? <Text dimColor>{L('off')}</Text> : !mine || !open.length ? <Text dimColor wrap="wrap">{L('diaryLocked')}</Text> : (
          <Box flexDirection="column">
            <Box flexDirection="row" gap={2} flexWrap="wrap">
              <Text dimColor>{L('diaryPick')}</Text>
              {open.map((c, i) => <Button key={`dp-${c.id}`} hotkey={String.fromCharCode(97 + i)} plain dimColor={pick?.id !== c.id} onPress={hit(() => void update($, ui, x => ({ ...x, pick: c.id })))}><Text color={colorOf(c.id)}>{T(c.short)}</Text></Button>)}
            </Box>
            {days.map(d => {
              const cached = s.diary[`${pick!.id}:${d}`]
              return (
                <Box key={`dy-${d}`} flexDirection="column" marginTop={1}>
                  <Text color={colorOf(pick!.id)} bold>{dayText(p, lang, d)}</Text>
                  {cached ? <Text italic wrap="wrap">{cached}</Text> : <Button key={`dr-${d}`} plain onPress={hit(() => void genDiary($, pick!.id, d))}><Text dimColor>✎ {L('diaryRead')}</Text></Button>}
                </Box>
              )
            })}
          </Box>
        )
      } else {
        // 你在她眼里：选择倾向（本地统计，不调用模型）+ 她的话（打开时生成，缓存）
        const tend = tendencies(s)
        const met = p.cast.filter(c => (s.heroines[c.id]?.stage ?? 0) >= 1)
        body = !extraOn(st, 'portrait') ? <Text dimColor>{L('off')}</Text> : (
          <Box flexDirection="column">
            <Text dimColor>{L('portraitBars')}</Text>
            {tend.length < 1 || tend.reduce((a, b) => a + b.n, 0) < 3 ? <Text dimColor>{L('portraitFew')}</Text> : TONE_ORDER.filter(tn => tend.some(x => x.tone === tn)).map(tn => {
              const x = tend.find(y => y.tone === tn)!
              return <Text key={`tn-${tn}`}><Text>{L(`tone_${tn}` as UiKey).padEnd(lang === 'zh' ? 3 : 10, '　')} </Text><Text color={TX.accent}>{'█'.repeat(Math.max(1, Math.round(x.share * 20)))}</Text><Text dimColor> {x.n}</Text></Text>
            })}
            {mine ? met.map((c, i) => (
              <Box key={`pt-${c.id}`} flexDirection="column" marginTop={1}>
                <Text color={colorOf(c.id)} bold>{T(c.name)}</Text>
                {s.portrait[c.id] ? <Text italic wrap="wrap">「{s.portrait[c.id]}」</Text> : <Button key={`pg-${c.id}`} hotkey={String.fromCharCode(97 + i)} plain onPress={hit(() => void genPortrait($, c.id))}><Text dimColor>{L('portraitGen', { name: T(c.short) })}</Text></Button>}
              </Box>
            )) : null}
          </Box>
        )
      }
      return finishRender(
        <Box flexDirection="column">
          <Box flexDirection="row" gap={2} flexWrap="wrap">
            {tabs.map((x, i) => (
              <Button key={`tab${i}`} hotkey={String(i + 1)} plain dimColor={tab !== i} onPress={hit(() => void update($, ui, y => ({ ...y, tab: i })))}>{tab === i ? `▶ ${L(x)}` : L(x)}</Button>
            ))}
          </Box>
          <Box flexDirection="column" marginTop={1} borderStyle="round" borderDimColor paddingX={1}>{body}</Box>
          {keyBar([
            mine && s.album.length > 0 && { k: 'x', label: L('exportHtml'), on: () => void doExport($, 'html') },
            mine && s.album.length > 0 && { k: 'm', label: L('exportMd'), on: () => void doExport($, 'md') },
            mine && s.album.length > 0 && { k: 'c', label: L('shareText'), on: () => void shareText($).then(x => $.ui.toast(x)) },
            { k: 'b', label: L('back'), dim: false, on: () => void update($, ui, x => ({ ...x, view: x.back === x.view ? 'game' : x.back })) },
          ])}
        </Box>,
      )
    }

    // ---------- 标题 ----------
    if (s.phase === 'title') {
      const autoSave = await readSave($, p.id, 0, extra)
      const hasCont = okSave(autoSave) && autoSave.story.phase !== 'ending'
      const items: { id: string; label: string; on: () => void; primary?: boolean }[] = [
        ...(hasCont ? [{ id: 'continue', label: L('continue'), on: () => void continueAndCheck($), primary: true }] : []),
        { id: 'new', label: L('newGame'), on: () => void newGame($, 1), primary: !hasCont },
        ...(pm.clears > 0 ? [{ id: 'plus', label: L('newGamePlus', { n: pm.clears + 1 }), on: () => void newGame($, pm.clears + 1) }] : []),
        { id: 'load', label: L('loadGame'), on: () => void update($, ui, x => ({ ...x, view: 'saves' as View, saveMode: 'load' as const, back: 'game' as View })) },
        { id: 'packs', label: L('packs'), on: () => void show($, 'packs') },
        { id: 'album', label: L('album'), on: () => void update($, ui, x => ({ ...x, view: 'album' as View, tab: 1, back: 'game' as View })) },
        { id: 'feats', label: L('featsMenu'), on: () => void update($, ui, x => ({ ...x, view: 'feats' as View, back: 'game' as View })) },
        { id: 'settings', label: L('settings'), on: () => void update($, ui, x => ({ ...x, view: 'settings' as View, tab: 0, back: 'game' as View })) },
        { id: 'help', label: L('help'), on: () => void update($, ui, x => ({ ...x, view: 'help' as View, back: 'game' as View })) },
      ]
      const menu = items.map((x, i) => ({ ...x, k: String(i + 1) }))
      const cw = Math.max(40, Math.min(96, cols - 4))
      const titleCard = card(`title-${p.id}`, { big: tr(p.title, 'en', p.defaultLang), small: 'AI GALGAME', color: css(PX.accent), accent: css(PX.accent2), style: 'fade' }, cw)
      return finishRender(
        <Box flexDirection="column" alignItems="center">
          {jobBanner}
          {titleCard}
          <Box flexDirection="column" alignItems="center" borderStyle="double" borderColor={TX.accent} paddingX={3} marginTop={titleCard ? 0 : 1}>
            <Text bold color={TX.accent}>{T(p.title)}</Text>
            <Text dimColor>{T(p.subtitle)}</Text>
          </Box>
          {Raster && !compact ? (
            <Box flexDirection="row" gap={2} marginTop={1} flexWrap="wrap" justifyContent="center">
              {p.cast.slice(0, 6).map((c, i) => (
                <Box key={`pt-${c.id}`} flexDirection="column" alignItems="center">
                  <Raster key={`portrait-${c.id}`} columns={14} rows={PORTRAIT_ROWS} cells={cells(onScreen(portraitFrame(c.sprite, i % 2 ? 'normal' : 'smile', 1)))} />
                  <Text color={colorOf(c.id)} bold>{T(c.name)}</Text>
                </Box>
              ))}
            </Box>
          ) : null}
          <Box flexDirection="column" marginTop={1}>
            {menu.map(x => (
              <Button key={`menu-${x.id}`} hotkey={x.k} variant={x.primary ? 'primary' : undefined} plain={x.primary ? undefined : true} onPress={hit(x.on)}>{x.label}</Button>
            ))}
          </Box>
          {keyBar([autoKey])}
          {autoInfo}
          <Box flexDirection="row" gap={1} marginTop={1}>
            {LANGS.map(l => (
              <Button key={`lang-${l.id}`} plain dimColor={l.id !== lang} onPress={hit(() => void setSettings($, x => ({ ...x, lang: l.id })))}>{l.id === lang ? `[${l.label}]` : l.label}</Button>
            ))}
          </Box>
          <Text dimColor>
            {p.source === 'original' ? `${L('original')} · ${p.author}` : L('sourceBy', { work: T(p.source.work), author: T(p.source.author), license: T(p.source.license) })}
            {pm.clears > 0 ? ` · ${L('clears', { n: pm.clears })} · ${L('endingsSeen', { a: seenCount, b: p.endings.length })}` : ''}
          </Text>
        </Box>,
      )
    }

    // ---------- 生成中 ----------
    if (s.phase === 'loading') {
      return finishRender(
        <Box flexDirection="column">
          {header}
          <Box marginY={1} paddingX={2}><Text dimColor italic>{s.loadingText}</Text></Box>
          {autoInfo}
          {watchInfo}
        </Box>,
      )
    }

    // ---------- 日程 ----------
    if (s.phase === 'plan') {
      const forced = forcedEvent(p, s, lang)
      const lonely = forced ? null : proactive(p, s)
      const opts = forced ? [forced] : planOptions(p, s, lang)
      const open = s.promises.filter(x => x.status === 'open')
      const todayEv = p.events.filter(x => x.day === s.day).map(x => T(x.text)).join(' · ')
      const inc = incidentOf(p, s.incident)
      const night = s.gossip.find(g => g.day === s.day - 1)
      // 每天第一个时段：像素「DAY n」卡（逢新章节再带英文章名），擦入
      const act = (p.acts ?? []).find(a => a.from === s.day) ?? (p.chapters ?? []).find(c => c.from === s.day)
      const cw = Math.max(40, Math.min(76, cols - 4))
      const dayCard = s.slot === 0 ? card(`day-${p.id}-${s.cycle}-${s.day}`, { big: `DAY ${s.day}`, small: act ? tr(act.title, 'en', p.defaultLang) : undefined, color: css(PX.title), accent: css(PX.accent), style: 'wipe', layout: 'inline' }, cw) : null
      // 像素小镇地图：开放的地点亮着，标着按键数字，下面是可能遇见的人
      const labels: Record<string, string> = {}
      const maybe: Record<string, string[]> = {}
      opts.forEach((o, i) => { if (o.id) { labels[o.id] = String(i + 1); maybe[o.id] = o.maybe.map(rawColor) } })
      const mw = Math.max(40, Math.min(76, cols - 4))
      const showMap = !!Raster && !compact && st.map !== false && !forced
      return finishRender(
        <Box flexDirection="column">
          {header}
          {dayCard}
          {todayEv ? <Text color={C.event}>◆ {L('today', { text: todayEv })}</Text> : null}
          {inc && !inc.places ? <Text color={C.info} wrap="wrap">◇ {L('happening', { text: T(inc.text) })}</Text> : null}
          {night && extraOn(st, 'gossip') ? <Text dimColor italic wrap="wrap">☾ {L('gossipNight', { text: night.text })}</Text> : null}
          {s.letter ? (
            <Box flexDirection="column" borderStyle="round" borderColor={colorOf(s.letter.from)} paddingX={1}>
              <Text color={colorOf(s.letter.from)} bold>{L('letterFrom', { name: shortOf(s.letter.from) })}</Text>
              <Text wrap="wrap">{s.letter.text}</Text>
            </Box>
          ) : null}
          {s.after ? <Text wrap="wrap">{s.after}</Text> : null}
          {open.map((x, i) => <Text key={`op${i}`} color={colorOf(x.heroine)} wrap="wrap">{x.key ? '★' : '○'} {L('promised', { name: shortOf(x.heroine), text: x.text, due: dayText(p, lang, x.due) })}</Text>)}
          {showMap ? raster('map', mw, mapSize(p.places.length, mw).h, tt => townMap(p.places, new Set(opts.map(o => o.id ?? '')), labels, maybe, mw, tt)) : null}
          <Box flexDirection="column" marginTop={1}>
            <Text bold>{forced ? L('mustGo') : L('where', { slot: T(p.slots[s.slot]) })}</Text>
            {lonely ? (
              <Button key="lonely" hotkey="0" plain onPress={hit(() => void goTo($, { place: T(p.places[0]!.name), mood: '', maybe: [lonely], who: lonely }, lonely))}>
                <Text color={colorOf(lonely)} bold>✉ {L('seeksYou', { name: shortOf(lonely) })}</Text>
              </Button>
            ) : null}
            {opts.map((o, i) => (
              <Button key={`go-${i}`} hotkey={String(i + 1)} plain onPress={hit(() => void goTo($, o, null))}>
                <Text bold>{o.forced ? `★ ${o.forced}` : o.place}</Text>
                {compact ? null : <Text dimColor>  {o.mood}</Text>}
                {o.maybe.length ? <Text>  {o.maybe.map((id, j) => <Text key={`mb${j}`} color={colorOf(id)} dimColor={!!personOf(p, id)?.npc}>{j ? '/' : ''}{shortOf(id)}</Text>)}<Text dimColor>?</Text></Text> : null}
              </Button>
            ))}
          </Box>
          {s.error ? <Text color={C.broken} wrap="wrap">{s.error}</Text> : null}
          {autoInfo}
          {watchInfo}
          {gameKeys(s.letter ? [{ k: 'l', label: L('letterDismiss'), on: () => void update($, story, x => ({ ...x, letter: null })) }] : [])}
        </Box>,
      )
    }

    // ---------- 结局 ----------
    if (s.phase === 'ending') {
      const end = p.endings.find(x => x.id === s.endingId)
      const c = end?.who ? colorOf(end.who) : TX.accent
      const cPx = end?.who ? rawColor(end.who) : css(PX.accent)
      const big = end?.kind === 'true' ? 'TRUE END' : end?.kind === 'good' ? 'GOOD END' : end?.kind === 'bad' ? 'BAD END' : end?.kind === 'normal' ? 'NORMAL END' : 'THE END'
      const cw = Math.max(40, Math.min(76, cols - 4))
      return finishRender(
        <Box flexDirection="column">
          {card(`end-${p.id}-${s.endingId}-${s.loop}`, { big, small: end ? tr(end.title, 'en', p.defaultLang) : '', color: cPx, accent: css(PX.accent), style: 'fade' }, cw)}
          <Box flexDirection="column" alignItems="center" borderStyle="double" borderColor={c} paddingX={2}>
            <Text dimColor>{L('endingHead')}</Text>
            <Text bold color={c}>{end ? T(end.title) : ''}</Text>
          </Box>
          <Box marginTop={1} paddingX={1}><Text wrap="wrap">{s.ending}</Text></Box>
          <Text dimColor>{L('endingsSeen', { a: seenCount, b: p.endings.length })} · {L('clears', { n: pm.clears })}</Text>
          {keyBar([
            { k: '1', label: L('newGamePlus', { n: s.loop + 1 }), dim: false, on: () => void newGame($, s.loop + 1) },
            { k: 'p', label: L('album'), on: () => void update($, ui, x => ({ ...x, view: 'album' as View, tab: 2, back: 'game' as View })) },
            { k: 'x', label: L('exportHtml'), on: () => void doExport($, 'html') },
            { k: 'm', label: L('exportMd'), on: () => void doExport($, 'md') },
            { k: 'c', label: L('endingCardKey'), on: () => void cardText($).then(x => $.ui.toast(x)) },
            { k: 't', label: L('toTitle'), on: () => void update($, story, x => ({ ...x, phase: 'title' as const })) },
          ])}
          <Box flexDirection="column" borderStyle="round" borderDimColor paddingX={1} marginTop={1}>
            <Text dimColor>{L('endingCardHint')}</Text>
            {endingCard(s, p, lang).split('\n').map((x, i) => <Text key={`card${i}`}>{x}</Text>)}
          </Box>
          {autoInfo}
        </Box>,
      )
    }

    // ---------- 剧情 / 余波 ----------
    const sc = s.scene
    if (!sc) {
      return finishRender(<Box flexDirection="column">{header}{gameKeys()}</Box>)
    }
    const items = sceneItems(sc, sc.camera?.focus ? L('closeUp', { text: sc.camera.focus }) : '')
    const shown = s.phase === 'after' ? items.length : Math.min(items.length, s.reveal + 1)
    const done = shown >= items.length
    const lead = sc.cast.find(a => castOf(p, a.id))?.id ?? sc.cast[0]?.id
    const castShown = sc.cast.filter(a => !!personOf(p, a.id)?.sprite)
    // 演出：当前这一句出现后过了几帧（模块变量，不是状态）
    const rk = `${sceneKey(s)}:${sc.title}:${shown}`
    if (rk !== revealKey) { revealKey = rk; revealTick = frame }
    const curLine = items[shown - 1]?.line ?? 0
    const since0 = revealTick
    const fx = fxOf(sc.atmo)
    // 舞台 = 按地点推出的背景板 + 立绘；氛围带画在天空（或墙）色上，和舞台拼成一幅
    const scenery = backdropOf(sc.place)
    const band = canStage && !compact && fx !== 'none' ? raster('atmo', stageW, BAND_H, tt => onScreen(atmoBand(fx, theme, stageW, tt), backdropTop(scenery, sc.atmo))) : null
    const stage = canStage
      ? raster('stage', stageW, STAGE_ROWS * 2, tt => over(backdrop(scenery, sc.atmo, stageW, STAGE_ROWS * 2, tt), stageFrame(p, castShown, sc.distance, tt, stageDirections(sc, s.phase === 'after' ? 999 : curLine, anim ? tt - since0 : 99), stageW)))
      : null
    const showLetItBe = done && s.phase === 'scene' && extraOn(st, 'letItBe')
    return finishRender(
      <Box flexDirection="column">
        {header}
        <Text>
          <Text bold color={TX.accent}>{sc.title}</Text>
          <Text dimColor>  @{sc.place}{sc.proactive ? ` · ${L('cameToYou')}` : ''}{sc.atmo?.mood ? ` · ${sc.atmo.mood}` : ''}</Text>
        </Text>
        {band}
        {stage}
        <Box flexDirection="column" borderStyle="round" borderColor={readable(lead ? tinted(lead) : theme, BG)} paddingX={1}>
          {items.slice(0, shown).map((l, i) => {
            // 只有最新一句是实底名牌 + 粗体；旧句名牌去底、整句变暗；余波里本幕台词全暗
            const newest = i === shown - 1 && s.phase === 'scene'
            if (l.kind === 'narration') return <Text key={`n${i}`} italic dimColor={s.phase === 'after'} wrap="wrap">{l.text}</Text>
            if (l.kind === 'focus') return <Text key={`f${i}`} dimColor wrap="wrap">◈ {l.text}</Text>
            if (l.kind === 'pause') return <Text key={`z${i}`} dimColor>{'　'.repeat(4)}……</Text>
            return (
              <Text key={`l${i}`} wrap="wrap">
                {newest
                  ? <Text backgroundColor={tinted(l.who)} color={inkOn(tinted(l.who))} bold> {nameOf(l.who)} </Text>
                  : <Text dimColor> {nameOf(l.who)} </Text>}
                <Text> </Text>
                <Text bold={newest} dimColor={!newest}>{lang === 'zh' ? `「${l.text}」` : `"${l.text}"`}</Text>
                {newest && !done ? <Text dimColor>  ▼</Text> : null}
              </Text>
            )
          })}
          {s.phase === 'after' ? <Box marginTop={1}><Text wrap="wrap">{s.after}</Text></Box> : null}
        </Box>
        {s.phase === 'after' ? (
          keyBar([{ k: 'j', label: `▼ ${L('cont')}`, dim: false, on: () => void advance($) }])
        ) : !done ? (
          keyBar([
            { k: 'j', label: L('next'), dim: false, on: () => void nextLine($) },
            { k: 'a', label: L('all'), on: () => void revealAll($) },
          ])
        ) : (
          <Box flexDirection="column" marginTop={1}>
            {sc.choices.map((c, i) => (
              // 选项不加框：类型做成芯片（底 = 类型色，字 = inkOn），后面是选项文字
              <Button key={`c${i}`} hotkey={String(i + 1)} plain onPress={hit(() => void choose($, c))}>
                <Text backgroundColor={C[c.kind]} color={inkOn(C[c.kind])} bold> {KIND_ICON[c.kind]} {L(`kind_${c.kind}` as UiKey)} </Text>
                <Text>  {c.text}</Text>
              </Button>
            ))}
            {showLetItBe ? (
              <Button key="c-let" hotkey={String(sc.choices.length + 1)} plain onPress={hit(() => void letItBe($))}>
                <Text dimColor> ☁ {L('letItBe')}  {L('letItBeHint')}</Text>
              </Button>
            ) : null}
          </Box>
        )}
        {autoInfo}
        {watchInfo}
        {gameKeys()}
      </Box>,
    )
  })
}
