// AI 原生视觉小说引擎：面板、按键、存档、设置、剧本包导入。
// 所有 $.state 读写都集中在这个文件（引擎 engine.ts 只有纯函数和模型调用）。
//
// 性能：不跑逐字定时器，台词按键翻句；立绘动画 4 帧/秒，只用 $.ui.blit 重画立绘那块 Raster，
// 只在剧情画面且开了动画时才有定时器；面板不在屏幕上时 blit 被拒，定时器自己停。
// AI 成本：每幕 1 次写作 + 1 次检查（不过才重写 1 次）；设定集是提示的第一块并打缓存标记。

import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Choice, Keepsake, Lang, Meta, Pack, PackEntry, PackMeta, GalSettings, Story, UiState, View } from '../types'
import { PORTRAIT_ROWS, STAGE_ROWS, STAGE_W, cells, keepsakeFrame, portraitFrame, stageFrame } from './art'
import {
  addUsage, advanceTime, applyChoice, applyScene, drawKeepsake, forcedEvent, freshStory, incidentOf, needsMigration, normalizeStory, pickEnding, planOptions, proactive, writeEnding, writeScene,
} from './engine'
import type { PlanOption } from './engine'
import { LANGS, helpLines, t } from './i18n'
import { castOf, chapterOf, dayText, packText, personOf, tr, validatePack } from './pack'
import { BUILTIN } from '../packs/index'

const PANE = 'ai-galgame'
const TICK_MS = 250 // 4 帧/秒
const SAVE_SLOTS = [1, 2, 3]

const DEFAULT_SETTINGS: GalSettings = { lang: 'zh', anim: true, pageMode: 'line', pack: BUILTIN[0]!.id }

const story = atom<'ai-galgame', 'story'>({ plugin: 'ai-galgame', key: 'story' } as const, { ...freshStory(BUILTIN[0]!, 'zh'), phase: 'title' })
const undo = atom<'ai-galgame', 'undo'>({ plugin: 'ai-galgame', key: 'undo' } as const, [])
const ui = atom<'ai-galgame', 'ui'>({ plugin: 'ai-galgame', key: 'ui' } as const, { view: 'game', tab: 0, saveMode: 'save', back: 'game' })
const settings = atom<'ai-galgame', 'settings'>({ plugin: 'ai-galgame', key: 'settings' } as const, DEFAULT_SETTINGS)

// 旧版本留下的会话状态格式不同（插件热重载后 $.state 还在），读到就重置，免得渲染时报错整块不画
const DEFAULT_UI: UiState = { view: 'game', tab: 0, saveMode: 'save', back: 'game' }
const TITLE_STORY: Story = { ...freshStory(BUILTIN[0]!, 'zh'), phase: 'title' }

function okStory(x: unknown): boolean {
  const s = x as Partial<Story> | null
  return !!s && typeof s.pack === 'string' && !!s.heroines && typeof s.heroines === 'object'
    && Array.isArray(s.promises) && Array.isArray(s.album) && !!s.usage && typeof s.phase === 'string'
}
function okUi(x: unknown): boolean {
  return !!x && typeof (x as Partial<UiState>).view === 'string'
}
function okSettings(x: unknown): boolean {
  const st = x as Partial<GalSettings> | null
  return !!st && typeof st.lang === 'string' && typeof st.pack === 'string'
}

const packById = (id: string, extra: PackEntry[] = []): Pack | undefined => allPacks(extra).find(e => e.id === id)?.pack

/**
 * 迁移：旧格式的会话状态、回退栈、存档补成当前格式。
 * 只在 command.run 和 session.start 里调用——画面板（ui.render）时不许写状态；画面板时只读，遇到认不出的格式降级显示。
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
const meta = atom<'ai-galgame', 'meta'>({ plugin: 'ai-galgame', key: 'meta' } as const, {})
const packs = atom<'ai-galgame', 'packs'>({ plugin: 'ai-galgame', key: 'packs' } as const, [])

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
  if (stored && typeof stored === 'object') {
    for (const raw of Object.values(stored as Record<string, unknown>)) {
      if (validatePack(raw).length === 0) out.push({ id: (raw as Pack).id, origin: 'imported', pack: raw as Pack })
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

// ---------- 动画：只在剧情画面、只重画立绘 ----------
type Anim = { pack: Pack; cast: Story['scene'] extends infer S ? S extends { cast: infer C } ? C : never : never; distance: 'near' | 'far' } | null
let anim: Anim = null
let animTimer: { cancel: () => void } | null = null
let frame = 0
let misses = 0
let lastCells = ''

function stopAnim(): void {
  animTimer?.cancel()
  animTimer = null
}

function ensureAnim($: EngineInterface): void {
  if (animTimer) return
  misses = 0
  animTimer = $.clock.every(TICK_MS, () => {
    if (!anim) { stopAnim(); return }
    frame++
    const c = cells(stageFrame(anim.pack, anim.cast, anim.distance, frame))
    if (c === lastCells) return
    lastCells = c
    void $.ui.blit({ requestId: PANE, key: 'stage', cells: c, columns: STAGE_W, rows: STAGE_ROWS }).then(r => {
      if (r.deny) { if (++misses >= 4) stopAnim() } else misses = 0
    }, () => stopAnim())
  })
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
  // 回退恢复旧状态，但「回退过几次」记在当前这一局上（打破第四面墙的包会用到）
  await update($, story, () => ({ ...prev, error: '', rewinds: now.rewinds + 1, loads: now.loads, usage: now.usage }))
}

async function newGame($: EngineInterface, loop: number): Promise<void> {
  const st = await read($, settings)
  const p = await currentPack($)
  await update($, story, () => freshStory(p, st.lang, loop, Math.floor(Math.random() * 0x7fffffff)))
  await update($, undo, () => [])
  await update($, ui, x => ({ ...x, view: 'game' as View }))
  await writeSave($, 0)
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

async function goTo($: EngineInterface, opt: PlanOption, who: string | null): Promise<void> {
  const s0 = await read($, story)
  if (s0.phase !== 'plan') return
  const st = await read($, settings)
  const p = await currentPack($, s0.pack)
  await snapshot($)
  const T = packText(p, st.lang)
  await update($, story, x => ({ ...x, phase: 'loading' as const, error: '', after: '', loadingText: T(p.loading[Math.floor(Math.random() * p.loading.length)]) }))
  const s = await read($, story)
  const pm = packMeta(await read($, meta), p.id)
  const r = await writeScene($, p, s, opt, who, st.lang, { endingsSeen: pm.endings, clears: pm.clears })
  if (!r.value) {
    await update($, story, x => ({ ...x, phase: 'plan' as const, error: t(st.lang, 'sceneFail'), usage: addUsage(x.usage, r.usage) }))
    return
  }
  const sc = r.value
  await update($, story, x => ({ ...applyScene(x, sc), usage: addUsage(x.usage, r.usage), reveal: st.pageMode === 'page' ? 999 : 0 }))
}

async function nextLine($: EngineInterface): Promise<void> {
  await update($, story, x => ({ ...x, reveal: x.reveal + 1 }))
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
  for (const id of r.keepsakeFor) void makeKeepsake($, p, id, st.lang)
}

async function makeKeepsake($: EngineInterface, p: Pack, id: string, lang: Lang): Promise<void> {
  const s = await read($, story)
  const g = await drawKeepsake($, p, s, id, lang)
  const k = g.value
  await update($, story, x => ({ ...x, usage: addUsage(x.usage, g.usage), keepsakes: k && x.pack === p.id ? [...x.keepsakes, k] : x.keepsakes }))
  if (!k) return
  await setMeta($, p.id, pm => ({ ...pm, keepsakes: [...pm.keepsakes.filter(o => !(o.heroine === k.heroine && o.title === k.title)), k].slice(-24) }))
  $.ui.toast(t(lang, 'keepsakeGot', { title: k.title }))
}

async function advance($: EngineInterface): Promise<void> {
  const s = await read($, story)
  if (s.phase !== 'after') return
  const st = await read($, settings)
  const p = await currentPack($, s.pack)
  const r = advanceTime(p, s, st.lang)
  await update($, story, () => r.story)
  await writeSave($, 0)
  if (r.finished) await finish($, p, st.lang)
}

async function finish($: EngineInterface, p: Pack, lang: Lang): Promise<void> {
  await update($, story, x => ({ ...x, phase: 'loading' as const, loadingText: packText(p, lang)(p.loading[0]) }))
  const s = await read($, story)
  const e = pickEnding(p, s)
  const g = await writeEnding($, p, s, e, lang)
  await update($, story, x => ({ ...x, phase: 'ending' as const, endingId: e.id, ending: g.value ?? t(lang, 'endingFail'), reveal: 0, usage: addUsage(x.usage, g.usage) }))
  await setMeta($, p.id, pm => ({ ...pm, clears: pm.clears + 1, endings: pm.endings.includes(e.id) ? pm.endings : [...pm.endings, e.id] }))
  await writeSave($, 0)
  $.ui.toast(t(lang, 'endingUnlocked', { title: tr(e.title, lang, p.defaultLang) }))
}

async function show($: EngineInterface, view: View, tab = 0): Promise<void> {
  await update($, ui, x => ({ ...x, view, tab, back: view === 'game' || x.view === view ? x.back : x.view }))
}

// ---------- 小部件 ----------
function hearts(n: number, max: number): string {
  const full = Math.max(0, Math.min(5, Math.round((n / Math.max(1, max)) * 5)))
  return '♥'.repeat(full) + '♡'.repeat(5 - full)
}

const KIND_COLOR: Record<string, string> = { reply: '#7fd1c7', observe: '#9aa0a6', promise: '#f2c14e' }
const ACCENT = '#f2c14e'
const DIM = '#8a8f98'

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'gal', description: 'AI 视觉小说 / AI visual novel', argumentHint: '[import | validate <path.json>]' })
    const st = await $.store.get('settings')
    if (st && typeof st === 'object') await update($, settings, () => ({ ...DEFAULT_SETTINGS, ...(st as Partial<GalSettings>) }))
    const m = await $.store.get('meta')
    if (m && typeof m === 'object') await update($, meta, () => m as Meta)
    await loadExtraPacks($)
    await migrate($)
    return next(e)
  })

  on('session.end', async ($, e, next) => {
    stopAnim()
    return next(e)
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
    await loadExtraPacks($)
    const s = await read($, story)
    if (s.phase === 'loading') await update($, story, x => ({ ...x, phase: 'plan' as const }))
    await update($, ui, x => ({ ...x, view: 'game' as View }))
    if (s.phase === 'title' || s.pack !== st.pack) await update($, story, x => ({ ...x, phase: 'title' as const }))
    await $.ui.open({ id: PANE, title: 'ai-galgame', focus: true })
    return { text: t(st.lang, 'opened') }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const el = $.ui.resolve(e)
    const { Box, Text, Button } = el
    const Raster = 'Raster' in el ? el.Raster : null
    const st = okSettings(await read($, settings)) ? await read($, settings) : DEFAULT_SETTINGS
    const view = okUi(await read($, ui)) ? await read($, ui) : DEFAULT_UI
    const extra = await read($, packs)
    // 只读：旧格式的状态在这里补成能显示的样子，不写回（写回在 migrate 里）
    const rawStory = await read($, story) as unknown
    const s = (okStory(rawStory) ? normalizeStory(rawStory, packById((rawStory as Story).pack, extra)) : null) ?? TITLE_STORY
    const m = await read($, meta)
    const canUndo = (await read($, undo)).length > 0
    const lang = st.lang
    const L = (k: Parameters<typeof t>[1], v?: Record<string, string | number>) => t(lang, k, v)
    const list = allPacks(extra)
    const p = (list.find(x => x.id === (view.view === 'packs' ? st.pack : s.phase === 'title' ? st.pack : s.pack)) ?? list[0]!).pack
    const T = packText(p, lang)
    const pm = packMeta(m, p.id)
    // 只数本包里还存在的结局（包更新后旧 id 不算）
    const seenCount = p.endings.filter(x => pm.endings.includes(x.id)).length
    const cols = e.props.bodyColumns ?? 80
    const colorOf = (id: string) => personOf(p, id)?.color ?? '#cccccc'
    const nameOf = (id: string) => (id === 'me' ? T(p.me) : T(personOf(p, id)?.name) || id)
    const shortOf = (id: string) => T(personOf(p, id)?.short) || id
    const inScene = view.view === 'game' && (s.phase === 'scene' || s.phase === 'after')
    if (!inScene) anim = null

    const keyBar = (items: (false | null | { k: string; label: string; on: () => void; dim?: boolean })[]) => (
      <Box flexDirection="row" gap={1} flexWrap="wrap" marginTop={1}>
        {items.filter(x => !!x).map(x => (
          <Button key={`kb-${x!.k}`} hotkey={x!.k} plain dimColor={x!.dim ?? true} onPress={x!.on}>{x!.label}</Button>
        ))}
      </Box>
    )

    const calendar = () => {
      const chars: { ch: string; color: string }[] = []
      for (let d = 1; d <= p.days; d++) {
        const ev = p.events.some(x => x.day === d) || p.fixed.some(x => x.day === d)
        chars.push(d < s.day ? { ch: '▪', color: DIM } : d === s.day ? { ch: '◉', color: ACCENT } : ev ? { ch: '◆', color: '#e57373' } : { ch: '·', color: DIM })
      }
      return <Text>{chars.map((c, i) => <Text key={`cal${i}`} color={c.color}>{c.ch}</Text>)}</Text>
    }

    const maxAff = p.gates[4]?.affection ?? 12
    const header = (
      <Box flexDirection="column" borderStyle="round" borderColor={ACCENT} paddingX={1}>
        <Box flexDirection="row" justifyContent="space-between">
          <Text bold color={ACCENT}>{T(p.title)}</Text>
          <Text color={DIM}>{chapterOf(p, lang, s.day)}{s.loop > 1 ? ` · ${L('runN', { n: s.loop })}` : ''}{p.features?.timeLoop ? ` · ${L('loopNotice', { n: s.cycle })}` : ''}</Text>
        </Box>
        <Text>
          <Text bold>{dayText(p, lang, s.day)} · {T(p.slots[s.slot])}</Text>
          <Text>  </Text>
          {calendar()}
        </Text>
        <Box flexDirection="row" columnGap={2} flexWrap="wrap">
          {p.cast.map(c => {
            const hs = s.heroines[c.id]
            if (!hs) return null
            return (
              <Text key={`hs-${c.id}`}>
                <Text color={c.color} bold>{T(c.short)} </Text>
                <Text color={c.color}>{hearts(hs.affection, maxAff)}</Text>
                <Text color={DIM}> {T(p.stages[hs.stage])}</Text>
              </Text>
            )
          })}
        </Box>
      </Box>
    )

    const gameKeys = (extraItems: Parameters<typeof keyBar>[0] = []) => keyBar([
      ...extraItems,
      canUndo && s.phase !== 'loading' && { k: 'u', label: `U ${L('undo')}`, on: () => void rewind($) },
      { k: 's', label: `S ${L('saves')}`, on: () => void update($, ui, x => ({ ...x, view: 'saves' as View, saveMode: 'save' as const, back: 'game' as View })) },
      { k: 'p', label: `P ${L('album')}`, on: () => void update($, ui, x => ({ ...x, view: 'album' as View, tab: 0, back: 'game' as View })) },
      { k: 'h', label: `H ${L('help')}`, on: () => void update($, ui, x => ({ ...x, view: 'help' as View, back: 'game' as View })) },
      { k: 't', label: `T ${L('toTitle')}`, on: () => void update($, story, x => ({ ...x, phase: x.phase === 'loading' ? x.phase : ('title' as const) })) },
    ])
    const backKey = keyBar([{ k: 'b', label: `B ${L('back')}`, dim: false, on: () => void update($, ui, x => ({ ...x, view: x.back === x.view ? 'game' : x.back })) }])

    // ---------- 设置 ----------
    if (view.view === 'settings') {
      const u = s.usage
      return (
        <Box flexDirection="column">
          <Text bold color={ACCENT}>{L('settings')}</Text>
          <Box flexDirection="column" marginTop={1}>
            <Button key="set-lang" hotkey="1" plain onPress={() => void setSettings($, x => ({ ...x, lang: LANGS[(LANGS.findIndex(l => l.id === x.lang) + 1) % LANGS.length]!.id }))}>
              {L('lang')}  <Text color={ACCENT}>{LANGS.find(l => l.id === lang)!.label}</Text>
            </Button>
            <Button key="set-anim" hotkey="2" plain onPress={() => void setSettings($, x => ({ ...x, anim: !x.anim }))}>
              {L('anim')}  <Text color={ACCENT}>{st.anim ? L('on') : L('off')}</Text>
            </Button>
            <Button key="set-page" hotkey="3" plain onPress={() => void setSettings($, x => ({ ...x, pageMode: x.pageMode === 'line' ? 'page' : 'line' }))}>
              {L('pageMode')}  <Text color={ACCENT}>{st.pageMode === 'line' ? L('page_line') : L('page_page')}</Text>
            </Button>
          </Box>
          <Box flexDirection="column" marginTop={1}>
            <Text color={DIM}>{L('usage')}</Text>
            <Text color={DIM}>{L('usageLine', { w: u.writer, c: u.checker, i: u.input, r: u.cacheRead, o: u.output })}</Text>
            <Text color={DIM} wrap="wrap">{L('importHint', { dir: '~/.claude/galgame-packs' })}</Text>
          </Box>
          {backKey}
        </Box>
      )
    }

    // ---------- 操作说明 ----------
    if (view.view === 'help') {
      return (
        <Box flexDirection="column">
          <Text bold color={ACCENT}>{L('help')}</Text>
          <Box flexDirection="column" marginTop={1} gap={1}>
            {helpLines(lang).map((x, i) => <Text key={`help${i}`} wrap="wrap">{x}</Text>)}
          </Box>
          {backKey}
        </Box>
      )
    }

    // ---------- 剧本选择 ----------
    if (view.view === 'packs') {
      return (
        <Box flexDirection="column">
          <Text bold color={ACCENT}>{L('packs')}</Text>
          <Box flexDirection="column" marginTop={1}>
            {list.map((en, i) => {
              const q = en.pack
              const Q = packText(q, lang)
              const cur = q.id === st.pack
              return (
                <Button key={`pk-${en.id}`} hotkey={i < 9 ? String(i + 1) : undefined} plain onPress={() => void setSettings($, x => ({ ...x, pack: q.id })).then(() => update($, story, x => ({ ...x, phase: 'title' as const })))}>
                  <Text bold color={cur ? ACCENT : undefined}>{cur ? '▶ ' : '  '}{Q(q.title)}</Text>
                  <Text color={DIM}>  {Q(q.subtitle)} · {q.cast.length}♥{q.npcs?.length ? ` · ${L('npcs', { n: q.npcs.length })}` : ''} · {q.days}d · {L(`packOrigin_${en.origin}` as Parameters<typeof t>[1])}{q.langs.includes(lang) ? '' : ` · ${q.defaultLang}`}</Text>
                </Button>
              )
            })}
          </Box>
          <Box flexDirection="column" marginTop={1} borderStyle="round" borderColor={DIM} paddingX={1}>
            <Text bold>{T(p.title)}</Text>
            {p.source === 'original'
              ? <Text color={DIM}>{L('original')} · {p.author}</Text>
              : <Text color={DIM} wrap="wrap">{L('sourceBy', { work: T(p.source.work), author: T(p.source.author), license: T(p.source.license) })}{p.source.notice ? `\n${T(p.source.notice)}` : ''}</Text>}
            {p.notes ? <Text wrap="wrap"><Text color={ACCENT}>{L('homage')}：</Text>{T(p.notes)}</Text> : null}
            {p.source !== 'original' ? <Text wrap="wrap" color={DIM}>{T(p.source.adaptation)}</Text> : null}
          </Box>
          <Text color={DIM} wrap="wrap">{L('importHint', { dir: '~/.claude/galgame-packs' })}</Text>
          {keyBar([{ k: 'b', label: `B ${L('back')}`, dim: false, on: () => void update($, ui, x => ({ ...x, view: 'game' as View })) }])}
        </Box>
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
      return (
        <Box flexDirection="column">
          <Box flexDirection="row" gap={2}>
            <Button key="mode-save" hotkey="w" plain dimColor={view.saveMode !== 'save'} onPress={() => void update($, ui, x => ({ ...x, saveMode: 'save' as const }))}>{view.saveMode === 'save' ? '▶ ' : ''}{L('modeSave')}</Button>
            <Button key="mode-load" hotkey="r" plain dimColor={view.saveMode !== 'load'} onPress={() => void update($, ui, x => ({ ...x, saveMode: 'load' as const }))}>{view.saveMode === 'load' ? '▶ ' : ''}{L('modeLoad')}</Button>
          </Box>
          <Box flexDirection="column" marginTop={1} borderStyle="round" borderColor={DIM} paddingX={1}>
            {[0, ...SAVE_SLOTS].map((n, i) => {
              const f = files[i] ?? null
              const label = n === 0 ? L('auto') : L('slot', { n })
              const act = view.saveMode === 'save'
                ? (n === 0 || !canSave ? null : () => void writeSave($, n).then(() => { $.ui.toast(L('saved', { n })); return update($, ui, x => ({ ...x })) }))
                : (okSave(f) ? () => void loadSlot($, pack, n) : null)
              return act ? (
                <Button key={`slot${n}`} hotkey={String(n)} plain onPress={act}>
                  <Text bold>{label}</Text><Text color={DIM}>  {info(f)}</Text>
                </Button>
              ) : (
                <Text key={`slotx${n}`} color={DIM}>   {label}  {info(f)}</Text>
              )
            })}
          </Box>
          {backKey}
        </Box>
      )
    }

    // ---------- 相册：回忆 / 信物图鉴 / 结局 / 约定 ----------
    if (view.view === 'album') {
      const tabs = [L('tabMemories'), L('tabKeepsakes'), L('tabEndings'), L('tabPromises')]
      const mine = s.pack === p.id
      const perRow = Math.max(1, Math.floor((cols - 2) / 28))
      let body
      if (view.tab === 0) {
        const mem = mine ? s.album.slice(-16) : []
        body = mem.length ? mem.map((x, i) => (
          <Text key={`mem${i}`} wrap="wrap">
            <Text color={DIM}>{dayText(p, lang, x.day)} {T(p.slots[x.slot])}  </Text>
            <Text color={x.heroine ? colorOf(x.heroine) : DIM}>{x.heroine ? `${shortOf(x.heroine)}  ` : ''}</Text>
            <Text>{x.text}</Text>
          </Text>
        )) : <Text color={DIM}>{L('noMemories')}</Text>
      } else if (view.tab === 1) {
        const ks: Keepsake[] = pm.keepsakes
        body = ks.length ? (
          <Box flexDirection="row" flexWrap="wrap" gap={2}>
            {ks.slice(-perRow * 2).map((k, i) => (
              <Box key={`ks${i}`} flexDirection="column" width={26}>
                {Raster ? <Raster key={`ksr${i}`} columns={24} rows={12} cells={cells(keepsakeFrame(k))} /> : null}
                <Text bold color={colorOf(k.heroine)}>{k.title}</Text>
                <Text color={DIM} wrap="wrap">{k.desc}</Text>
              </Box>
            ))}
          </Box>
        ) : <Text color={DIM} wrap="wrap">{L('noKeepsakes')}</Text>
      } else if (view.tab === 2) {
        body = (
          <Box flexDirection="column">
            <Text color={DIM}>{L('endingsSeen', { a: seenCount, b: p.endings.length })} · {L('clears', { n: pm.clears })}</Text>
            {p.endings.map(x => {
              const seen = pm.endings.includes(x.id)
              return (
                <Text key={`end-${x.id}`} wrap="wrap">
                  <Text color={seen ? (x.who ? colorOf(x.who) : ACCENT) : DIM}>{seen ? '★' : '☆'} {seen ? T(x.title) : L('locked')}</Text>
                  <Text color={DIM}>{x.who ? `  ${shortOf(x.who)}` : ''}{x.kind ? ` · ${L(`end_${x.kind}` as Parameters<typeof t>[1])}` : ''}</Text>
                </Text>
              )
            })}
          </Box>
        )
      } else {
        const ps = mine ? s.promises : []
        body = ps.length ? ps.map((x, i) => (
          <Text key={`pr${i}`} color={x.status === 'kept' ? '#81c784' : x.status === 'broken' ? '#e57373' : undefined} wrap="wrap">
            {x.status === 'kept' ? '✓' : x.status === 'broken' ? '✗' : '○'} {x.key ? '★' : ''}<Text color={colorOf(x.heroine)}>{shortOf(x.heroine)}</Text>：{x.text}（{dayText(p, lang, x.due)}）
          </Text>
        )) : <Text color={DIM}>—</Text>
      }
      return (
        <Box flexDirection="column">
          <Box flexDirection="row" gap={2}>
            {tabs.map((x, i) => (
              <Button key={`tab${i}`} hotkey={String(i + 1)} plain dimColor={view.tab !== i} onPress={() => void update($, ui, y => ({ ...y, tab: i }))}>{view.tab === i ? `▶ ${x}` : x}</Button>
            ))}
          </Box>
          <Box flexDirection="column" marginTop={1} borderStyle="round" borderColor={DIM} paddingX={1}>{body}</Box>
          {backKey}
        </Box>
      )
    }

    // ---------- 标题 ----------
    if (s.phase === 'title') {
      const auto = await readSave($, p.id, 0, extra)
      const hasCont = okSave(auto) && auto.story.phase !== 'ending'
      const items: { id: string; label: string; on: () => void; primary?: boolean }[] = [
        ...(hasCont ? [{ id: 'continue', label: L('continue'), on: () => void continueGame($), primary: true }] : []),
        { id: 'new', label: L('newGame'), on: () => void newGame($, 1), primary: !hasCont },
        ...(pm.clears > 0 ? [{ id: 'plus', label: L('newGamePlus', { n: pm.clears + 1 }), on: () => void newGame($, pm.clears + 1) }] : []),
        { id: 'load', label: L('loadGame'), on: () => void update($, ui, x => ({ ...x, view: 'saves' as View, saveMode: 'load' as const, back: 'game' as View })) },
        { id: 'packs', label: L('packs'), on: () => void show($, 'packs') },
        { id: 'album', label: L('album'), on: () => void update($, ui, x => ({ ...x, view: 'album' as View, tab: 1, back: 'game' as View })) },
        { id: 'settings', label: L('settings'), on: () => void update($, ui, x => ({ ...x, view: 'settings' as View, back: 'game' as View })) },
        { id: 'help', label: L('help'), on: () => void update($, ui, x => ({ ...x, view: 'help' as View, back: 'game' as View })) },
      ]
      const menu = items.map((x, i) => ({ ...x, k: String(i + 1) }))
      return (
        <Box flexDirection="column" alignItems="center">
          <Box flexDirection="column" alignItems="center" borderStyle="double" borderColor={ACCENT} paddingX={3} marginTop={1}>
            <Text bold color={ACCENT}>{T(p.title)}</Text>
            <Text color={DIM}>{T(p.subtitle)}</Text>
          </Box>
          {Raster ? (
            <Box flexDirection="row" gap={2} marginTop={1} flexWrap="wrap" justifyContent="center">
              {p.cast.slice(0, 6).map((c, i) => (
                <Box key={`pt-${c.id}`} flexDirection="column" alignItems="center">
                  <Raster key={`portrait-${c.id}`} columns={14} rows={PORTRAIT_ROWS} cells={cells(portraitFrame(c.sprite, i % 2 ? 'normal' : 'smile', 1))} />
                  <Text color={c.color} bold>{T(c.name)}</Text>
                </Box>
              ))}
            </Box>
          ) : null}
          <Box flexDirection="column" marginTop={1}>
            {menu.map(x => (
              <Button key={`menu-${x.id}`} hotkey={x.k} variant={x.primary ? 'primary' : undefined} plain={x.primary ? undefined : true} onPress={x.on}>{x.label}</Button>
            ))}
          </Box>
          <Box flexDirection="row" gap={1} marginTop={1}>
            {LANGS.map(l => (
              <Button key={`lang-${l.id}`} plain dimColor={l.id !== lang} onPress={() => void setSettings($, x => ({ ...x, lang: l.id }))}>{l.id === lang ? `[${l.label}]` : l.label}</Button>
            ))}
          </Box>
          <Text color={DIM}>
            {p.source === 'original' ? `${L('original')} · ${p.author}` : L('sourceBy', { work: T(p.source.work), author: T(p.source.author), license: T(p.source.license) })}
            {pm.clears > 0 ? ` · ${L('clears', { n: pm.clears })} · ${L('endingsSeen', { a: seenCount, b: p.endings.length })}` : ''}
          </Text>
        </Box>
      )
    }

    // ---------- 生成中 ----------
    if (s.phase === 'loading') {
      return (
        <Box flexDirection="column">
          {header}
          <Box marginY={1} paddingX={2}><Text color={DIM} italic>{s.loadingText}</Text></Box>
        </Box>
      )
    }

    // ---------- 日程 ----------
    if (s.phase === 'plan') {
      const forced = forcedEvent(p, s, lang)
      const lonely = forced ? null : proactive(p, s)
      const opts = forced ? [forced] : planOptions(p, s, lang)
      const open = s.promises.filter(x => x.status === 'open')
      const today = p.events.filter(x => x.day === s.day).map(x => T(x.text)).join(' · ')
      const inc = incidentOf(p, s.incident)
      return (
        <Box flexDirection="column">
          {header}
          {today ? <Text color="#e57373">◆ {L('today', { text: today })}</Text> : null}
          {inc && !inc.places ? <Text color="#9fc5e8" wrap="wrap">◇ {L('happening', { text: T(inc.text) })}</Text> : null}
          {s.after ? <Text color={ACCENT} wrap="wrap">{s.after}</Text> : null}
          {open.map((x, i) => <Text key={`op${i}`} color={colorOf(x.heroine)} wrap="wrap">{x.key ? '★' : '○'} {L('promised', { name: shortOf(x.heroine), text: x.text, due: dayText(p, lang, x.due) })}</Text>)}
          <Box flexDirection="column" marginTop={1}>
            <Text bold>{forced ? L('mustGo') : L('where', { slot: T(p.slots[s.slot]) })}</Text>
            {lonely ? (
              <Button key="lonely" hotkey="0" plain onPress={() => void goTo($, { place: T(p.places[0]!.name), mood: '', maybe: [lonely], who: lonely }, lonely)}>
                <Text color={colorOf(lonely)} bold>✉ {L('seeksYou', { name: shortOf(lonely) })}</Text>
              </Button>
            ) : null}
            {opts.map((o, i) => (
              <Button key={`go-${i}`} hotkey={String(i + 1)} plain onPress={() => void goTo($, o, null)}>
                <Text bold>{o.forced ? `★ ${o.forced}` : o.place}</Text>
                <Text color={DIM}>  {o.mood}</Text>
                {o.maybe.length ? <Text>  {o.maybe.map((id, j) => <Text key={`mb${j}`} color={colorOf(id)} dimColor={!!personOf(p, id)?.npc}>{j ? '/' : ''}{shortOf(id)}</Text>)}<Text color={DIM}>?</Text></Text> : null}
              </Button>
            ))}
          </Box>
          {s.error ? <Text color="#e57373">{s.error}</Text> : null}
          {gameKeys()}
        </Box>
      )
    }

    // ---------- 结局 ----------
    if (s.phase === 'ending') {
      const end = p.endings.find(x => x.id === s.endingId)
      const c = end?.who ? colorOf(end.who) : ACCENT
      return (
        <Box flexDirection="column">
          <Box flexDirection="column" alignItems="center" borderStyle="double" borderColor={c} paddingX={2}>
            <Text color={DIM}>{L('endingHead')}</Text>
            <Text bold color={c}>{end ? T(end.title) : ''}</Text>
          </Box>
          <Box marginTop={1} paddingX={1}><Text wrap="wrap">{s.ending}</Text></Box>
          <Text color={DIM}>{L('endingsSeen', { a: seenCount, b: p.endings.length })} · {L('clears', { n: pm.clears })}</Text>
          {keyBar([
            { k: '1', label: `1 ${L('newGamePlus', { n: s.loop + 1 })}`, dim: false, on: () => void newGame($, s.loop + 1) },
            { k: 'p', label: `P ${L('album')}`, on: () => void update($, ui, x => ({ ...x, view: 'album' as View, tab: 2, back: 'game' as View })) },
            { k: 't', label: `T ${L('toTitle')}`, on: () => void update($, story, x => ({ ...x, phase: 'title' as const })) },
          ])}
        </Box>
      )
    }

    // ---------- 剧情 / 余波 ----------
    const sc = s.scene
    if (!sc) {
      return <Box flexDirection="column">{header}{gameKeys()}</Box>
    }
    const items = [{ who: '', text: sc.narration }, ...sc.lines]
    const shown = s.phase === 'after' ? items.length : Math.min(items.length, s.reveal + 1)
    const done = shown >= items.length
    const lead = sc.cast.find(a => castOf(p, a.id))?.id ?? sc.cast[0]?.id
    const castShown = sc.cast.filter(a => !!personOf(p, a.id)?.sprite)
    if (Raster && castShown.length && st.anim) {
      anim = { pack: p, cast: castShown, distance: sc.distance, }
      ensureAnim($)
    } else anim = null
    lastCells = ''
    return (
      <Box flexDirection="column">
        {header}
        <Text>
          <Text bold>{sc.title}</Text>
          <Text color={DIM}>  @{sc.place}{sc.proactive ? ` · ${L('cameToYou')}` : ''}</Text>
        </Text>
        {Raster && castShown.length ? (
          <Raster key="stage" columns={STAGE_W} rows={STAGE_ROWS} cells={cells(stageFrame(p, castShown, sc.distance, frame))} />
        ) : null}
        <Box flexDirection="column" borderStyle="round" borderColor={lead ? colorOf(lead) : DIM} paddingX={1}>
          {items.slice(0, shown).map((l, i) =>
            l.who === '' ? (
              <Text key={`n${i}`} italic color={DIM} wrap="wrap">{l.text}</Text>
            ) : (
              <Text key={`l${i}`} wrap="wrap">
                <Text bold color={l.who === 'me' ? '#7fd1c7' : colorOf(l.who)}>{nameOf(l.who)}  </Text>
                <Text>{lang === 'zh' ? `「${l.text}」` : `"${l.text}"`}</Text>
              </Text>
            ),
          )}
          {s.phase === 'after' ? <Box marginTop={1}><Text wrap="wrap" color={ACCENT}>{s.after}</Text></Box> : null}
        </Box>
        {s.phase === 'after' ? (
          keyBar([{ k: 'j', label: `▼ J ${L('cont')}`, dim: false, on: () => void advance($) }])
        ) : !done ? (
          keyBar([
            { k: 'j', label: `▼ J ${L('next')}`, dim: false, on: () => void nextLine($) },
            { k: 'a', label: `A ${L('all')}`, on: () => void revealAll($) },
          ])
        ) : (
          <Box flexDirection="column" marginTop={1}>
            {sc.choices.map((c, i) => (
              <Button key={`c${i}`} hotkey={String(i + 1)} plain onPress={() => void choose($, c)}>
                <Text color={KIND_COLOR[c.kind]}>[{L(`kind_${c.kind}` as Parameters<typeof t>[1])}] </Text>
                <Text>{c.text}</Text>
              </Button>
            ))}
          </Box>
        )}
        {gameKeys()}
      </Box>
    )
  })
}
