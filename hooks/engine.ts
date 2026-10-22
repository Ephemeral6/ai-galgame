// 剧情引擎。纯函数（日程、约定、阶段、关键事件、随机事件、时间循环、结局判定、存档迁移）+ 三种模型调用（写一幕、画信物、写结局）。
// 这里不读写 $.state：状态读写集中在 register.tsx，便于校验和测试。

import type { EngineInterface, ModelTextBlock } from 'claude-code'

import type { Actor, Atmo, BeatDef, Camera, CastDef, Choice, EndingDef, HState, IncidentDef, Keepsake, Lang, NpcDef, Pack, RelationDef, Scene, StageCue, Story, Tone, Usage } from '../types'
import { EXPRS, validKeepsake } from './art'
import { costOf } from './cost'
import { craftStatic, decideRoute, dejaVuFor, endingCraft, pickCraft, revealedEcho, setPieceBrief, setPieceCast, setPieceChoices, setPieceIntact, spliceSetPiece } from './craft'
import type { CraftPick } from './craft'
import { workLine } from './work'
import type { WorkEvent } from './work'
import { t } from './i18n'
import { actOf, allBeats, beatOf, castOf, dayText, meterOf, npcOf, packText, personOf, tr } from './pack'

export const WRITER = 'sonnet'
export const CHECKER = 'haiku'
/** 每个角色最多几个信物 */
export const KEEPSAKES_PER = 2
/** 存档格式版本：2 起有 flags / incident / seed；3 起有 deltas / profile / echoes / gossip / letter / diary / portrait */
export const STORY_V = 3
export const TONES: Tone[] = ['honest', 'evasive', 'joking', 'committed', 'caring', 'bold']
/** 人物（主角色 + 配角）多于这个数时，提示只放这一幕相关的人的完整设定，其余人一行摘要 */
export const FOCUS_ABOVE = 3

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x))

export function zeroUsage(): Usage {
  return { writer: 0, checker: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }
}

export function freshHeroines(p: Pack): Record<string, HState> {
  const h: Record<string, HState> = {}
  for (const c of p.cast) h[c.id] = { affection: 0, stage: 0, scenes: 0, mood: '', lastDay: 0 }
  return h
}

/** 新的一局。loop ≥ 2 是二周目及以后：每人起始好感 +1（她们「好像见过你」）。seed 决定这一局的随机事件 */
export function freshStory(p: Pack, lang: Lang, loop = 1, seed = 1): Story {
  const heroines = freshHeroines(p)
  if (loop >= 2) for (const id of Object.keys(heroines)) heroines[id]!.affection = 1
  const s: Story = {
    pack: p.id, lang, loop, cycle: 1, rewinds: 0, loads: 0,
    phase: 'plan', day: 1, slot: 0, heroines, promises: [], notes: [], facts: [], keepsakes: [], album: [],
    scene: null, after: '', reveal: 0, loadingText: '', ending: '', endingId: '', error: '', usage: zeroUsage(),
    v: STORY_V, seed: seed >>> 0, flags: [], incident: '',
    deltas: {}, profile: {}, echoes: [], gossip: [], letter: null, diary: {}, portrait: {}, world: [], daily: '', quotes: [],
  }
  return { ...s, incident: rollIncident(p, s) }
}

// ---------- 存档迁移 ----------
const isObj = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x)
const arr = <T>(x: unknown): T[] => (Array.isArray(x) ? (x as T[]) : [])

/**
 * 把任意版本的 Story 补成当前格式（缺的字段用新局的默认值，包里新加的角色补上空白关系）。
 * 认不出来（不是对象、没有 pack/day/slot）返回 null，调用方降级显示。纯函数，不写状态。
 */
export function normalizeStory(raw: unknown, p: Pack | undefined): Story | null {
  if (!isObj(raw) || typeof raw.pack !== 'string' || typeof raw.day !== 'number' || typeof raw.slot !== 'number') return null
  const lang: Lang = raw.lang === 'en' ? 'en' : 'zh'
  const base = p ? freshStory(p, lang, 1, 1) : null
  const hs = isObj(raw.heroines) ? (raw.heroines as Record<string, HState>) : {}
  const heroines: Record<string, HState> = { ...(base?.heroines ?? {}) }
  for (const [id, h] of Object.entries(hs)) {
    if (isObj(h)) heroines[id] = { affection: Number(h.affection) || 0, stage: clamp(Number(h.stage) || 0, 0, 4), scenes: Number(h.scenes) || 0, mood: typeof h.mood === 'string' ? h.mood : '', lastDay: Number(h.lastDay) || 0 }
  }
  const u = isObj(raw.usage) ? (raw.usage as Partial<Usage>) : {}
  const phase = ['title', 'plan', 'loading', 'scene', 'after', 'ending'].includes(String(raw.phase)) ? (raw.phase as Story['phase']) : 'plan'
  const scene = isObj(raw.scene) && typeof raw.scene.narration === 'string' && Array.isArray(raw.scene.choices) ? (raw.scene as unknown as Scene) : null
  const str = (x: unknown) => (typeof x === 'string' ? x : '')
  const num = (x: unknown, d: number) => (typeof x === 'number' && Number.isFinite(x) ? x : d)
  return {
    pack: raw.pack, lang,
    loop: num(raw.loop, 1), cycle: num(raw.cycle, 1), rewinds: num(raw.rewinds, 0), loads: num(raw.loads, 0),
    phase: (phase === 'scene' || phase === 'after') && !scene ? 'plan' : phase,
    day: Math.max(1, raw.day), slot: Math.max(0, raw.slot),
    heroines,
    promises: arr(raw.promises), notes: arr(raw.notes), facts: arr<unknown>(raw.facts).filter((x): x is string => typeof x === 'string'),
    keepsakes: arr(raw.keepsakes), album: arr(raw.album),
    scene, after: str(raw.after), reveal: num(raw.reveal, 0), loadingText: str(raw.loadingText),
    ending: str(raw.ending), endingId: str(raw.endingId), error: str(raw.error),
    usage: { ...zeroUsage(), ...Object.fromEntries(Object.entries(u).filter(([, v]) => typeof v === 'number')) },
    v: STORY_V,
    seed: num(raw.seed, hashSeed(`${raw.pack}:${raw.day}:${raw.slot}`)) >>> 0,
    flags: arr<unknown>(raw.flags).filter((x): x is string => typeof x === 'string'),
    incident: str(raw.incident),
    deltas: numMap(raw.deltas),
    profile: numMap(raw.profile),
    echoes: arr<unknown>(raw.echoes).filter((x): x is string => typeof x === 'string').slice(0, 12),
    gossip: arr<unknown>(raw.gossip).filter((g): g is { day: number; text: string } => isObj(g) && typeof g.day === 'number' && typeof g.text === 'string').slice(-20),
    letter: isObj(raw.letter) && typeof raw.letter.from === 'string' && typeof raw.letter.text === 'string' ? { from: raw.letter.from, text: raw.letter.text } : null,
    diary: strMap(raw.diary),
    portrait: strMap(raw.portrait),
    world: arr<unknown>(raw.world).filter((x): x is string => typeof x === 'string').slice(-4),
    daily: str(raw.daily),
    quotes: arr<unknown>(raw.quotes).filter((q): q is { day: number; who: string; text: string } => isObj(q) && typeof q.day === 'number' && typeof q.who === 'string' && typeof q.text === 'string').slice(-60),
  }
}

function numMap(x: unknown): Record<string, number> {
  return isObj(x) ? Object.fromEntries(Object.entries(x).filter(([, v]) => typeof v === 'number')) as Record<string, number> : {}
}
function strMap(x: unknown): Record<string, string> {
  return isObj(x) ? Object.fromEntries(Object.entries(x).filter(([, v]) => typeof v === 'string')) as Record<string, string> : {}
}

/** 旧格式（或补了字段才完整）的存档需要写回 */
export function needsMigration(raw: unknown, p: Pack | undefined): boolean {
  if (!isObj(raw)) return false
  if (raw.v !== STORY_V || !Array.isArray(raw.flags) || typeof raw.seed !== 'number' || typeof raw.incident !== 'string' || !isObj(raw.profile) || !Array.isArray(raw.gossip)) return true
  return !!p && p.cast.some(c => !isObj((raw.heroines as Record<string, unknown> | undefined)?.[c.id]))
}

// ---------- 随机 ----------
function hashSeed(key: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0 }
  h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b) >>> 0; h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35) >>> 0; h ^= h >>> 16
  return h >>> 0
}

/** 由种子、轮次、天、时段、事件 id 决定的 0..1 随机数：回退、读档都得到同样的结果 */
export function roll(s: Story, key: string): number {
  return hashSeed(`${s.seed}:${s.cycle}:${s.day}:${s.slot}:${key}`) / 4294967296
}

// ---------- 随机 / 条件事件 ----------
export function incidentOf(p: Pack, id: string | undefined): IncidentDef | undefined {
  return id ? (p.incidents ?? []).find(x => x.id === id) : undefined
}

export function incidentEligible(p: Pack, s: Story, x: IncidentDef): boolean {
  if (!x.repeat && s.flags.includes(`inc:${x.id}`)) return false
  if (x.days && (s.day < x.days[0] || s.day > x.days[1])) return false
  if (x.slots && !x.slots.includes(s.slot)) return false
  if (x.need) {
    const h = s.heroines[x.need.who]
    if (!h || h.stage < (x.need.minStage ?? 0) || h.affection < (x.need.minAffection ?? -999)) return false
  }
  if (x.after && !x.after.every(f => s.flags.includes(f))) return false
  return true
}

/** 给当前时段掷一个随机事件；没有返回 '' */
export function rollIncident(p: Pack, s: Story): string {
  for (const x of p.incidents ?? []) {
    if (incidentEligible(p, s, x) && roll(s, x.id) < (x.chance ?? 0.25)) return x.id
  }
  return ''
}

/** 当前时段的随机事件是否落在这个地点（不限地点的事件处处都算） */
export function incidentHere(p: Pack, s: Story, opt: PlanOption): IncidentDef | undefined {
  const x = incidentOf(p, s.incident)
  if (!x) return undefined
  if (x.places && !(opt.id && x.places.includes(opt.id))) return undefined
  return x
}

// ---------- 日程 ----------
export type PlanOption = { place: string; mood: string; maybe: string[]; forced?: string; who?: string; id?: string }

export function forcedEvent(p: Pack, s: Story, lang: Lang): PlanOption | null {
  const f = p.fixed.find(x => x.day === s.day && x.slot === s.slot)
  if (!f) return null
  const T = packText(p, lang)
  return { place: T(f.place), mood: T(f.mood), maybe: [...f.cast], forced: T(f.title) }
}

/** 冷落 proactiveAfter 天以上、已经熟悉的人，会在每天第二个时段主动来找你（好感最高者优先） */
export function proactive(p: Pack, s: Story): string | null {
  if (p.proactiveAfter <= 0) return null
  if (s.slot !== Math.min(1, p.slots.length - 1)) return null
  const lonely = p.cast.map(c => c.id).filter(id => {
    const h = s.heroines[id]
    return !!h && h.stage >= 1 && s.day - h.lastDay >= p.proactiveAfter
  })
  return lonely.sort((a, b) => s.heroines[b]!.affection - s.heroines[a]!.affection)[0] ?? null
}

/** 这个时段开放的地点；maybe 先列主角色，再列在这里出没的配角 */
export function planOptions(p: Pack, s: Story, lang: Lang): PlanOption[] {
  const T = packText(p, lang)
  return p.places.filter(pl => pl.slots.includes(s.slot)).map(pl => ({
    id: pl.id, place: T(pl.name), mood: T(pl.mood),
    maybe: [
      ...p.cast.filter(c => c.haunts[s.slot]?.includes(pl.id)).map(c => c.id),
      ...(p.npcs ?? []).filter(n => n.haunts?.[s.slot]?.includes(pl.id)).map(n => n.id),
    ],
  }))
}

// ---------- 关键事件 ----------
/**
 * 这一幕要写到的关键事件：已到日子、还没发生、相关的人可能在场的第一个；
 * 过了 by 那天（或就在 by 那天的最后一个时段），不论谁在场都要写。
 */
export function dueBeat(p: Pack, s: Story, present: string[]): BeatDef | null {
  const lastSlot = s.slot === p.slots.length - 1
  const beats = allBeats(p).filter(b => b.day <= s.day && !s.flags.includes(`beat:${b.id}`)).sort((a, b) => a.day - b.day)
  for (const b of beats) {
    if (!b.who?.length || b.who.some(id => present.includes(id))) return b
  }
  for (const b of beats) {
    const by = b.by ?? Math.min(p.days, b.day + 1)
    if (s.day > by || (s.day === by && lastSlot)) return b
  }
  return null
}

/** 这一幕的上下文：关键事件、随机事件，以及要放完整设定的人 */
export type SceneCtx = { beat: BeatDef | null; incident: IncidentDef | null; focus: string[]; craft?: CraftPick; lead?: string }

export function sceneContext(p: Pack, s: Story, opt: PlanOption, who: string | null): SceneCtx {
  const inc = incidentHere(p, s, opt) ?? null
  const present = [...opt.maybe, ...(who ? [who] : []), ...(inc?.who ?? [])]
  const beat = dueBeat(p, s, present)
  const ids: string[] = []
  const add = (id: string) => { if (!ids.includes(id) && personOf(p, id)) ids.push(id) }
  for (const id of [...present, ...(beat?.who ?? [])]) add(id)
  // 在场主角色的相关配角（最多两位）
  let extra = 0
  for (const r of p.relations ?? []) {
    if (extra >= 2) break
    for (const [x, y] of [[r.a, r.b], [r.b, r.a]] as const) {
      if (castOf(p, x) && ids.includes(x) && npcOf(p, y) && !ids.includes(y) && extra < 2) { add(y); extra++ }
    }
  }
  return { beat, incident: inc, focus: ids }
}

// ---------- 场景落地、选择、推进 ----------
const firstHeroine = (s: Story, sc: Scene) => sc.cast.find(a => !!s.heroines[a.id])?.id ?? ''

/** 一幕写好后：记见面、单独相处、约定兑现、伏笔回收、事实、相册、关键事件与随机事件 */
export function applyScene(s: Story, sc: Scene): Story {
  const heroines = { ...s.heroines }
  for (const a of sc.cast) {
    const h = heroines[a.id]
    if (h) heroines[a.id] = { ...h, lastDay: s.day, scenes: h.scenes + (sc.cast.length === 1 ? 1 : 0) }
  }
  const notes = sc.callback ? s.notes.map(n => (!n.used && sc.callback!.includes(n.text.slice(0, 6)) ? { ...n, used: true } : n)) : s.notes
  const promises = s.promises.map(pr => (pr.status === 'open' && pr.day < s.day + 1 && sc.cast.some(a => a.id === pr.heroine) && s.day <= pr.due && !(pr.day === s.day && pr.made === sceneKey(s)) ? { ...pr, status: 'kept' as const } : pr))
  const flags = [...s.flags]
  if (sc.beat && !flags.includes(`beat:${sc.beat}`)) flags.push(`beat:${sc.beat}`)
  if (sc.incident && !flags.includes(`inc:${sc.incident}`)) flags.push(`inc:${sc.incident}`)
  for (const f of sc.craftFlags ?? []) if (!flags.includes(f)) flags.push(f)
  return {
    ...s, phase: 'scene', scene: sc, reveal: 0, heroines, notes, promises, error: '', after: '', flags, world: [],
    incident: sc.incident && sc.incident === s.incident ? '' : s.incident,
    quotes: keyQuote(s, sc),
    ...(sc.kind ? { lastKind: sc.kind } : {}),
    facts: sc.fact ? [...s.facts, sc.fact].slice(-40) : s.facts,
    album: [...s.album, { day: s.day, slot: s.slot, heroine: firstHeroine(s, sc) || sc.cast[0]?.id || '', text: sc.summary }].slice(-80),
  }
}

/** 每幕留一句关键台词（主角色说的最长的一句），导出整局时用 */
function keyQuote(s: Story, sc: Scene): Story['quotes'] {
  const line = sc.lines.filter(l => !!s.heroines[l.who]).sort((a, b) => b.text.length - a.text.length)[0]
  return line ? [...s.quotes, { day: s.day, who: line.who, text: line.text }].slice(-60) : s.quotes
}

/** 同一天同一时段的标识，防止「刚答应就在同一幕里算兑现」 */
export function sceneKey(s: Story): string {
  return `${s.cycle}:${s.day}:${s.slot}`
}

export type ChoiceResult = { story: Story; advanced: string[]; keepsakeFor: string[] }

export function applyChoice(p: Pack, s: Story, c: Choice, lang: Lang): ChoiceResult {
  const sc = s.scene!
  const lead = firstHeroine(s, sc)
  const heroines = { ...s.heroines }
  for (const [id, d] of Object.entries(c.effects)) {
    const h = heroines[id]
    if (h) heroines[id] = { ...h, affection: h.affection + clamp(Math.round(Number(d)) || 0, -2, 2) }
  }
  const notes = [...s.notes, { day: s.day, heroine: lead, text: `${sc.place}：${c.text}`, used: false }].slice(-30)
  const promises = [...s.promises]
  // 关键约定记在关键事件涉及的那位主角色名下：领头的人在 beat.who 里就是她，否则取 beat.who 里第一个在场的主角色
  const beat = beatOf(p, sc.beat)
  const key = beat?.promise ? beat.id : undefined
  const onStage = (id: string) => sc.cast.some(a => a.id === id) && !!castOf(p, id)
  const owner = key && beat?.who?.length && !beat.who.includes(lead) ? (beat.who.find(onStage) ?? lead) : lead
  if (c.kind === 'promise' && owner && castOf(p, owner)) {
    const dl = castOf(p, owner)!.deadline.day
    promises.push({ text: c.promise || c.text, heroine: owner, day: s.day, due: clamp(dl, s.day + 1, p.days), status: 'open', made: sceneKey(s), ...(key ? { key } : {}) })
  }
  const advanced: string[] = []
  for (const ch of p.cast) {
    const st = heroines[ch.id]
    if (!st) continue
    const next = p.gates[st.stage + 1]
    if (next && st.affection >= next.affection && st.scenes >= next.scenes) {
      heroines[ch.id] = { ...st, stage: st.stage + 1 }
      advanced.push(ch.id)
    }
  }
  const T = packText(p, lang)
  const turns = advanced.map(id => t(lang, 'stageUp', { name: T(castOf(p, id)!.name), stage: T(p.stages[heroines[id]!.stage]) }))
  const after = [c.reaction || '…', ...turns.map(x => `（${x}）`)].join('\n\n')
  const have = (id: string) => s.keepsakes.filter(k => k.heroine === id).length
  const keepsakeFor = advanced.filter(id => heroines[id]!.stage >= 3 && have(id) < KEEPSAKES_PER)
  const deltas: Record<string, number> = {}
  for (const [id, d] of Object.entries(c.effects)) if (heroines[id] && d) deltas[id] = clamp(Math.round(Number(d)) || 0, -2, 2)
  const profile = c.tone ? { ...s.profile, [c.tone]: (s.profile[c.tone] ?? 0) + 1 } : s.profile
  return { story: { ...s, phase: 'after', heroines, notes, promises, reveal: 0, after, deltas, profile }, advanced, keepsakeFor }
}

export type AdvanceResult = { story: Story; finished: boolean; looped: boolean; broken: string[] }

/** 推进到下一个时段；跨天时结算过期约定、给出章节钩子；最后一天结束时进入结局或时间循环；每个新时段重掷随机事件 */
export function advanceTime(p: Pack, s: Story, lang: Lang): AdvanceResult {
  let { day, slot } = s
  slot++
  let promises = s.promises
  let heroines = s.heroines
  const broken: string[] = []
  const T = packText(p, lang)
  const notes: string[] = []
  if (slot >= p.slots.length) {
    slot = 0
    day++
    heroines = { ...s.heroines }
    promises = s.promises.map(pr => {
      if (pr.status !== 'open' || pr.due >= day) return pr
      const h = heroines[pr.heroine]
      if (h) heroines[pr.heroine] = { ...h, affection: h.affection - 2, mood: 'disappointed' }
      broken.push(t(lang, 'promiseBroken', { name: T(castOf(p, pr.heroine)?.name), text: pr.text }))
      return { ...pr, status: 'broken' as const }
    })
    const was = actOf(p, s.day)
    const now = actOf(p, day)
    if (now && was && now.id !== was.id && day <= p.days) {
      if (was.hook) notes.push(T(was.hook))
      notes.push(t(lang, 'actStart', { title: T(now.title) }))
    }
  }
  let base0: Story = { ...s, day, slot, promises, heroines, phase: 'plan', scene: null, reveal: 0, after: [...broken, ...notes].join('\n'), error: '', incident: '' }
  // 共通线过完时锁定路线（只影响提示里的走向和指定了路线的关键场景，不改结局判定）
  if (day !== s.day && day <= p.days) {
    const route = decideRoute(p, base0)
    if (route) {
      const id = route.slice('route:'.length)
      const note = id === 'ensemble' ? t(lang, 'routeEnsemble') : t(lang, 'routeLocked', { name: T(castOf(p, id)?.short) })
      base0 = { ...base0, flags: [...base0.flags, route], after: [base0.after, note].filter(Boolean).join('\n') }
    }
  }
  const base: Story = { ...base0, incident: day <= p.days ? rollIncident(p, base0) : '' }
  if (day <= p.days) return { story: base, finished: false, looped: false, broken }
  // 最后一天过完：时间循环包在没达到目标结局时回到第 1 天
  const loop = p.features?.timeLoop
  if (loop && s.cycle < loop.maxLoops + 1 && pickEnding(p, base).tier < loop.minTier) {
    const looped0: Story = {
      ...base, day: 1, slot: 0, cycle: s.cycle + 1, heroines: freshHeroines(p), promises: [], flags: [],
      after: tr(loop.text, lang, p.defaultLang),
      notes: base.notes.map(n => ({ ...n, used: false })),
    }
    return { story: { ...looped0, incident: rollIncident(p, looped0) }, finished: false, looped: true, broken }
  }
  return { story: { ...base, day: p.days, slot: p.slots.length - 1 }, finished: true, looped: false, broken }
}

// ---------- 结局判定 ----------
export function endingMatches(p: Pack, s: Story, e: EndingDef): boolean {
  if (e.minLoop !== undefined && s.loop < e.minLoop) return false
  if (e.flags && !e.flags.every(f => s.flags.includes(f))) return false
  // 不绑角色的结局：阶段/好感条件对每个角色都要满足（群像结局）
  if (!e.who) return p.cast.every(c => {
    const h = s.heroines[c.id]
    return !!h && (e.minStage === undefined || h.stage >= e.minStage) && (e.minAffection === undefined || h.affection >= e.minAffection)
      && (e.maxAffection === undefined || h.affection <= e.maxAffection)
  })
  const h = s.heroines[e.who]
  if (!h) return false
  if (e.minStage !== undefined && h.stage < e.minStage) return false
  if (e.minAffection !== undefined && h.affection < e.minAffection) return false
  if (e.maxAffection !== undefined && h.affection > e.maxAffection) return false
  const mine = s.promises.filter(x => x.heroine === e.who)
  const nBroken = mine.filter(x => x.status === 'broken').length
  if (e.maxBroken !== undefined && nBroken > e.maxBroken) return false
  if (e.minBroken !== undefined && nBroken < e.minBroken) return false
  if (e.minKept !== undefined && mine.filter(x => x.status === 'kept').length < e.minKept) return false
  if (e.keptKey !== undefined && !mine.some(x => x.key === e.keptKey && x.status === 'kept')) return false
  if (e.minKeepsakes !== undefined && s.keepsakes.filter(k => k.heroine === e.who).length < e.minKeepsakes) return false
  return true
}

export function pickEnding(p: Pack, s: Story): EndingDef {
  const aff = (e: EndingDef) => (e.who ? s.heroines[e.who]?.affection ?? 0 : -999)
  const ok = p.endings.filter(e => endingMatches(p, s, e))
  ok.sort((a, b) => b.tier - a.tier || aff(b) - aff(a))
  return ok[0] ?? p.endings[p.endings.length - 1]!
}

// ---------- 提示 ----------
export type Gen<T> = { value: T | null; usage: Usage }

function json(text: string | null): Record<string, unknown> | null {
  if (!text) return null
  const a = text.indexOf('{')
  const b = text.lastIndexOf('}')
  if (a < 0 || b <= a) return null
  try {
    const v = JSON.parse(text.slice(a, b + 1)) as unknown
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null
  } catch {
    return null
  }
}

async function ask($: EngineInterface, model: string, prompt: ModelTextBlock[], maxTokens: number, u: Usage, kind: 'write' | 'check' = 'write'): Promise<string | null> {
  const r = await $.model.complete({ model, prompt, maxTokens, timeoutMs: 90_000 })
  if (model === CHECKER && kind === 'check') u.checker++
  else u.writer++
  u.input += r.usage.input_tokens
  u.output += r.usage.output_tokens
  u.cacheRead += r.usage.cache_read_input_tokens
  u.cacheWrite += r.usage.cache_creation_input_tokens
  u.cost = (u.cost ?? 0) + costOf(model, r.usage)
  return r.isAnswered ? r.text : null
}

function langRule(lang: Lang): string {
  return lang === 'en'
    ? 'Write ALL story text (titles, narration, dialogue, choices, reactions, summaries, facts) in natural English.'
    : '所有剧情文字（标题、旁白、台词、选项、反应、概括、事实）都用简体中文写。'
}

/** 人物多时只给相关的人完整设定 */
export function focusMode(p: Pack): boolean {
  return p.cast.length + (p.npcs?.length ?? 0) > FOCUS_ABOVE
}

/** 非恋爱角色：写进人物设定和一行摘要，让 AI 不写成恋爱对象 */
function noRomance(p: Pack, c: CastDef, lang: Lang): string {
  if (meterOf(c).romance) return ''
  const label = packText(p, lang)(c.meter?.label) || 'trust'
  return `NOT a romance route: "affection" with this character means ${label}; never write romance, flirtation, crushes or a love-interest framing`
}

function castEntry(p: Pack, c: CastDef, lang: Lang): string {
  const T = packText(p, lang)
  const nr = noRomance(p, c, lang)
  return [
    `- id=${c.id}「${T(c.name)}」 look: ${T(c.look)}`,
    ...(nr ? [`  ${nr}.`] : []),
    `  voice: ${T(c.voice)}`,
    `  samples: ${c.samples.map(x => `「${T(x)}」`).join(' ')}`,
    `  secret (do not reveal before stage 3 "${T(p.stages[3])}"): ${T(c.secret)}`,
    `  arc: ${c.arc.map((a, i) => `[${i}] ${T(a)}`).join(' ')}`,
    `  deadline: day ${c.deadline.day}, ${T(c.deadline.text)}`,
  ].join('\n')
}

function npcEntry(p: Pack, n: NpcDef, lang: Lang): string {
  const T = packText(p, lang)
  return [
    `- id=${n.id}「${T(n.name)}」 (supporting character, not romanceable, no affection) role: ${T(n.role)}${n.look ? ` look: ${T(n.look)}` : ''}`,
    `  voice: ${T(n.voice)}`,
    `  samples: ${n.samples.map(x => `「${T(x)}」`).join(' ')}`,
  ].join('\n')
}

function personEntry(p: Pack, id: string, lang: Lang): string {
  const c = castOf(p, id)
  if (c) return castEntry(p, c, lang)
  const n = npcOf(p, id)
  return n ? npcEntry(p, n, lang) : ''
}

function summaryLines(p: Pack, lang: Lang): string {
  const T = packText(p, lang)
  return [
    ...p.cast.map(c => `- ${c.id}「${T(c.name)}」: ${T(c.tagline ?? c.look)}${meterOf(c).romance ? '' : ` (${noRomance(p, c, lang)})`}`),
    ...(p.npcs ?? []).map(n => `- ${n.id}「${T(n.name)}」 (supporting): ${T(n.role)}`),
  ].join('\n')
}

function relationLine(p: Pack, r: RelationDef, lang: Lang): string {
  const T = packText(p, lang)
  const nm = (id: string) => (id === 'me' ? T(p.me) : `${id}「${T(personOf(p, id)?.name)}」`)
  const hidden = r.hiddenUntil !== undefined ? ` (keep this implicit, hints only, until ${[r.a, r.b].filter(x => castOf(p, x)).join(' or ') || 'later'} reaches stage ${r.hiddenUntil})` : ''
  return `- ${nm(r.a)} ↔ ${nm(r.b)} [${T(r.kind)}]: ${T(r.text)}${hidden}`
}

function relationsFor(p: Pack, ids: string[] | null, lang: Lang): string {
  const rs = (p.relations ?? []).filter(r => !ids || ids.includes(r.a) || ids.includes(r.b))
  return rs.map(r => relationLine(p, r, lang)).join('\n')
}

/** 小包：全部人物设定都在固定块里（与旧版一致） */
function fullBible(p: Pack, lang: Lang): string {
  const npcs = p.npcs?.length ? `\n[Supporting characters — may appear to move the plot]\n${p.npcs.map(n => npcEntry(p, n, lang)).join('\n')}` : ''
  const rel = p.relations?.length ? `\n[Relations]\n${relationsFor(p, null, lang)}` : ''
  return `[Cast]\n${p.cast.map(c => castEntry(p, c, lang)).join('\n')}${npcs}${rel}`
}

function actsOverview(p: Pack, lang: Lang): string {
  if (!p.acts?.length) return ''
  const T = packText(p, lang)
  return `\n\n[Story arc — acts]\n${p.acts.map(a => `- ${T(a.title)} (from day ${a.from}): ${T(a.goal)}`).join('\n')}`
}

const FORMAT = `Reply with ONE JSON object only:
{"title":"scene title","atmo":{"weather":"clear|rain|snow|fog|storm|wind","time":"dawn|day|dusk|night","fx":"rain|snow|fireflies|cicadas|lanterns|meteors|mist|stars|none"},"camera":{"focus":"one small object the camera lingers on, or empty","pause":0},"cast":[{"id":"<cast or supporting id>","expression":"normal|smile|blush|sad|angry|surprised"}],"distance":"near|far","narration":"2-4 sentences","lines":[{"who":"<cast id, supporting id, or me>","text":"..."}],"cues":[{"at":1,"who":"<id on stage>","emote":"!|?|note|...|anger|sweat|heart","move":"enter|exit|approach|turn|face"}],"choices":[{"text":"...","kind":"reply|observe|promise","tone":"honest|evasive|joking|committed|caring|bold","effects":{"<cast id>":1},"promise":"what I promised (promise only)","reaction":"the immediate reaction and close of the scene after this choice, 2-3 sentences, may include one line of dialogue"}],"summary":"one-sentence summary","callback":"which earlier note this scene calls back, or empty","fact":"one concrete new fact this scene establishes"}
Rules: at most two characters on stage (romanceable or supporting; zero is allowed); 3-7 lines of dialogue; exactly 3 choices with clearly different attitudes, at least one "reply"; "observe" gains a detail and does not change affection; "promise" must fill the promise field; effects range -2..+2 and list only affected romanceable cast ids.
Direction (you are also the director): "atmo" sets the weather, time of day and the ambient particles; "camera.focus" names one object for a close-up, "camera.pause" is the line number after which a silent beat falls (0 = none); "cues" are 0-4 stage directions — "at" is the line number (0 = narration) when it happens: an emote bubble over someone's head, entering or leaving, stepping closer, turning away when shy or hurt, turning back. Use them sparingly, only where they add something. Give every choice a "tone".`

/** 固定不变的部分（前提、文风、人物、分幕、格式）放第一块并打缓存标记，每一幕复用 */
export function staticBlock(p: Pack, lang: Lang): string {
  const T = packText(p, lang)
  const wall = p.features?.fourthWall
    ? '\nThis story may break the fourth wall: characters may sense the player\'s undos, reloads and replays (given in the state below) and gently remark on them. Never threaten the player.'
    : ''
  const loop = p.features?.timeLoop
    ? `\nThis story has a time loop: after day ${p.days} it may return to day 1. "I" remember earlier loops (the notebook and facts persist); others do not, unless their secret says otherwise.`
    : ''
  const people = focusMode(p)
    ? `[Everyone — one line each. Full notes for the people relevant to a scene come with that scene; put on stage only people whose full notes you are given, others may only be mentioned]\n${summaryLines(p, lang)}`
    : fullBible(p, lang)
  return `You are writing an interactive visual novel: "${T(p.title)}".
${langRule(lang)}

[Premise]
${T(p.premise)}

[Style]
${T(p.style)}

${people}${actsOverview(p, lang)}

[Stages] ${p.stages.map((x, i) => `${i}=${T(x)}`).join(', ')}${wall}${loop}

${craftStatic(p, lang)}

[Output format — for the writer]
${FORMAT}`
}

/** 检查员只需要人物与禁忌，不需要写作格式：比写手的固定块短，省输入 */
export function checkerBlock(p: Pack, lang: Lang): string {
  const T = packText(p, lang)
  return `Continuity reference for the visual novel "${T(p.title)}".
[Style and taboos]
${T(p.style)}
${focusMode(p) ? `[Everyone — one line each]\n${summaryLines(p, lang)}` : fullBible(p, lang)}
[Stages] ${p.stages.map((x, i) => `${i}=${T(x)}`).join(', ')}`
}

/** 关系状态：focus 里的主角色给完整一行（含当前节拍），其余人只给阶段与好感 */
export function stateText(p: Pack, s: Story, lang: Lang, focus?: string[]): string {
  const T = packText(p, lang)
  return p.cast.map(c => {
    const h = s.heroines[c.id]
    if (!h) return `- ${c.id}: stage 0`
    const aff = meterOf(c).romance ? 'affection' : `${T(c.meter?.label) || 'trust'} (not romance)`
    if (focus && focusMode(p) && !focus.includes(c.id)) return `- ${c.id} ${T(c.short)}: stage ${h.stage}, ${aff} ${h.affection}, last seen day ${h.lastDay || '-'}`
    return `- ${c.id} ${T(c.name)}: ${aff} ${h.affection}, stage ${h.stage} "${T(p.stages[h.stage])}" (beat: ${T(c.arc[h.stage])}), mood ${h.mood || 'normal'}, alone-scenes ${h.scenes}, last seen day ${h.lastDay || '-'}`
  }).join('\n')
}

/** 只放这一幕相关的人：完整设定 + 关系 */
function focusNotes(p: Pack, ids: string[], lang: Lang): string {
  if (!focusMode(p)) return ''
  const people = ids.map(id => personEntry(p, id, lang)).filter(Boolean).join('\n')
  const rel = relationsFor(p, ids, lang)
  return `[People relevant to this scene — full notes]\n${people || '(nobody in particular; keep the stage empty or bring someone in only by mention)'}\n${rel ? `[Relations in play]\n${rel}\n` : ''}`
}

/** 每一幕的写法开关：写作模型（省额度时换 haiku）、短幕、现实里写代码的事件 */
export type MetaInfo = { endingsSeen: string[]; clears: number; writer?: string; short?: boolean; world?: string[] }

export function sceneDynamic(p: Pack, s: Story, opt: PlanOption, who: string | null, fix: string, lang: Lang, meta: MetaInfo, ctx?: SceneCtx): string {
  const T = packText(p, lang)
  const c = ctx ?? sceneContext(p, s, opt, who)
  const open = s.promises.filter(x => x.status === 'open')
  const notes = s.notes.filter(n => !n.used).slice(-6)
  const today = p.events.filter(e => e.day === s.day).map(e => T(e.text)).join('; ')
  const lead = who ? `${T(castOf(p, who)?.name)} came looking for me (not seen for ${s.day - s.heroines[who]!.lastDay} days); she leads this scene.` : ''
  const wall = p.features?.fourthWall
    ? `\n[Player traces] undos this run: ${s.rewinds}; reloads: ${s.loads}; playthrough #${s.loop}; endings seen before: ${meta.endingsSeen.join(', ') || 'none'}`
    : ''
  const cyc = p.features?.timeLoop ? `\n[Loop] this is loop ${s.cycle}.` : ''
  const act = actOf(p, s.day)
  const actLine = act ? `[Act] ${T(act.title)}: ${T(act.goal)}\n` : ''
  const b = c.beat
  const beatLine = b
    ? `\n[Must happen in this scene${b.kind ? ` — ${T(b.kind)}` : ''}] ${T(b.text)}${b.who?.length ? ` (involves ${b.who.join(', ')})` : ''}${b.promise ? `\nOne of the three choices must be a "promise" choice of this kind: ${T(b.promise)}` : ''}\n`
    : ''
  const inc = c.incident
  const incLine = inc ? `\n[Something happens this time] ${T(inc.text)}${inc.who?.length ? ` (brings in ${inc.who.join(', ')})` : ''}\n` : ''
  const present = opt.maybe.length ? `\n[Likely here] ${opt.maybe.join(', ')}` : ''
  const pk = c.craft
  const leadId = c.lead ?? who ?? opt.maybe.find(id => !!castOf(p, id)) ?? ''
  const craftLines = `${pk?.text ? `\n${pk.text}\n` : ''}${pk ? revealedEcho(p, s, lang) : ''}${leadId && Math.max(s.loop, s.cycle) >= 2 ? dejaVuFor(p, s, leadId, lang) : ''}`
  const finalLine = pk?.setPiece ? `${setPieceBrief(p, pk.setPiece, lang)} ${langRule(lang)}` : `Write this scene following the current stage beat of whoever is present. ${langRule(lang)}`
  const echoes = s.loop >= 2 && s.echoes.length ? `\n[Echoes of a previous playthrough] The characters do not remember it, but now and then one may feel a faint déjà vu ("have we... met somewhere before?") tied to one of these; at most one subtle hint per scene, never a clear memory: ${s.echoes.slice(0, 6).join(' / ')}` : ''
  const prof = profileLine(s)
  const gossip = s.gossip.filter(g => g.day === s.day - 1).map(g => g.text).join(' ')
  const extra = `${echoes}${prof ? `\n[How I tend to act] ${prof}. Characters who know me may notice the pattern and say so, once, in their own words ("you always joke when it matters").` : ''}${gossip ? `\n[Overnight in town — offstage, may be mentioned] ${gossip}` : ''}`
  return `[Now] ${dayText(p, lang, s.day)} of ${p.days} · ${T(p.slots[s.slot])} · place: ${opt.place} (${opt.mood})${opt.forced ? ` · fixed event: ${opt.forced}` : ''}
${actLine}${today ? `Today: ${today}\n` : ''}${focusNotes(p, c.focus, lang)}[State]
${stateText(p, s, lang, c.focus)}${present}${extra}
${lead}${wall}${cyc}${beatLine}${incLine}${craftLines}
[Established facts — do not contradict]
${s.facts.slice(-24).map(f => `- ${f}`).join('\n') || '(none)'}
[Open promises]
${open.map(x => `- day ${x.day} promised ${x.heroine}: ${x.text} (due day ${x.due})`).join('\n') || '(none)'}
[Notebook: my earlier choices — call one back naturally]
${notes.map(n => `- day ${n.day} (${n.heroine}): ${n.text}`).join('\n') || '(none)'}
${fix ? `\n[Problems in the previous draft — must fix] ${fix}\n` : ''}
${meta.world?.length ? `${workLine(meta.world as WorkEvent[])}\n` : ''}${meta.short && !pk?.setPiece ? '[Short scene] This is a short scene for a quick break: narration 1-2 sentences, only 2-4 lines of dialogue, still exactly 3 choices.\n' : ''}${finalLine}`
}

/** 选择倾向的一行摘要：选过 3 次以上才有 */
export function profileLine(s: Story): string {
  const total = Object.values(s.profile).reduce((a, b) => a + (b ?? 0), 0)
  if (total < 3) return ''
  return Object.entries(s.profile).filter(([, n]) => (n ?? 0) > 0).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0)).slice(0, 3).map(([k, n]) => `${k} ${n}`).join(', ')
}

export function checkDynamic(p: Pack, s: Story, draft: string, lang: Lang, ctx?: SceneCtx): string {
  const T = packText(p, lang)
  const must = `${ctx?.beat ? `\n7. this required event does not happen: ${T(ctx.beat.text)}` : ''}${ctx?.craft?.setPiece ? '\nLines quoted from the author\'s set piece are canon; never ask to change them.' : ''}`
  return `You are now the continuity editor, not the writer. Check this draft scene for hard errors only:
1. contradicts an established fact; 2. a character's voice clearly wrong; 3. reveals a secret before stage 3, or states a relation marked "keep implicit" too early; 4. wrong language (must follow: ${langRule(lang)}); 5. violates the style taboos; 6. missing JSON fields.${must}
${ctx ? focusNotes(p, ctx.focus, lang) : ''}State:
${stateText(p, s, lang, ctx?.focus)}
Facts: ${s.facts.slice(-24).join('; ') || 'none'}
Draft:
${draft}
Reply with JSON only: {"ok":true} or {"ok":false,"fix":"one sentence on what to change"}`
}

export function parseScene(p: Pack, j: Record<string, unknown>, place: string): Scene | null {
  if (typeof j.narration !== 'string' || !Array.isArray(j.choices) || j.choices.length < 2) return null
  const ids = p.cast.map(c => c.id)
  const onStage = [...ids, ...(p.npcs ?? []).map(n => n.id)]
  const cast: Actor[] = (Array.isArray(j.cast) ? j.cast : [])
    .map(a => {
      const o = (a ?? {}) as Record<string, unknown>
      const ex = String(o.expression)
      return { id: String(o.id), expression: (EXPRS as readonly string[]).includes(ex) ? ex : 'normal' }
    })
    .filter((a, i, all) => onStage.includes(a.id) && all.findIndex(x => x.id === a.id) === i)
    .slice(0, 2)
  const TONE_SET = new Set<string>(TONES)
  const choices: Choice[] = (j.choices as unknown[]).slice(0, 3).map(raw => {
    const c = (raw ?? {}) as Record<string, unknown>
    const eff: Record<string, number> = {}
    if (c.effects && typeof c.effects === 'object') for (const [k, v] of Object.entries(c.effects as Record<string, unknown>)) if (ids.includes(k)) eff[k] = clamp(Math.round(Number(v)) || 0, -2, 2)
    return {
      text: String(c.text ?? '…'),
      kind: c.kind === 'observe' || c.kind === 'promise' ? c.kind : 'reply',
      ...(TONE_SET.has(String(c.tone)) ? { tone: c.tone as Tone } : {}),
      effects: eff,
      promise: typeof c.promise === 'string' && c.promise ? c.promise : undefined,
      reaction: typeof c.reaction === 'string' ? c.reaction : '',
    }
  })
  return {
    title: String(j.title ?? ''), place, cast, distance: j.distance === 'far' ? 'far' : 'near',
    narration: j.narration,
    lines: (Array.isArray(j.lines) ? j.lines : []).map(l => {
      const o = (l ?? {}) as Record<string, unknown>
      return { who: String(o.who ?? ''), text: String(o.text ?? '') }
    }).filter(l => l.text),
    choices, summary: String(j.summary ?? ''), callback: String(j.callback ?? ''), fact: String(j.fact ?? ''),
    ...parseDirection(j, cast.map(a => a.id), Array.isArray(j.lines) ? j.lines.length : 0),
  }
}

const WEATHER = ['clear', 'rain', 'snow', 'fog', 'storm', 'wind']
const TIMES = ['dawn', 'day', 'dusk', 'night']
const FX = ['rain', 'snow', 'fireflies', 'cicadas', 'lanterns', 'meteors', 'mist', 'stars', 'none']
const EMOTE = ['!', '?', 'note', '...', 'anger', 'sweat', 'heart']
const MOVES = ['enter', 'exit', 'approach', 'turn', 'face']

/** 氛围、镜头、演出指令：认不出的值直接丢掉，不影响这一幕 */
export function parseDirection(j: Record<string, unknown>, onStage: string[], nLines: number): { atmo?: Atmo; camera?: Camera; cues?: StageCue[] } {
  const out: { atmo?: Atmo; camera?: Camera; cues?: StageCue[] } = {}
  const a = isObj(j.atmo) ? j.atmo : null
  if (a) {
    const atmo: Atmo = {}
    if (WEATHER.includes(String(a.weather))) atmo.weather = a.weather as Atmo['weather']
    if (TIMES.includes(String(a.time))) atmo.time = a.time as Atmo['time']
    if (FX.includes(String(a.fx))) atmo.fx = a.fx as Atmo['fx']
    if (typeof a.mood === 'string' && a.mood) atmo.mood = a.mood.slice(0, 24)
    if (Object.keys(atmo).length) out.atmo = atmo
  }
  const c = isObj(j.camera) ? j.camera : null
  if (c) {
    const cam: Camera = {}
    if (typeof c.focus === 'string' && c.focus.trim()) cam.focus = c.focus.trim().slice(0, 40)
    const pause = Math.round(Number(c.pause))
    if (pause >= 1 && pause <= nLines) cam.pause = pause
    if (Object.keys(cam).length) out.camera = cam
  }
  if (Array.isArray(j.cues)) {
    const cues = (j.cues as unknown[]).filter(isObj).map(x => ({
      at: Math.round(Number(x.at)), who: String(x.who ?? ''),
      ...(EMOTE.includes(String(x.emote)) ? { emote: x.emote as StageCue['emote'] } : {}),
      ...(MOVES.includes(String(x.move)) ? { move: x.move as StageCue['move'] } : {}),
    })).filter(x => x.at >= 0 && x.at <= nLines && onStage.includes(x.who) && (x.emote || x.move)).slice(0, 6)
    if (cues.length) out.cues = cues
  }
  return out
}

// ---------- 模型调用 ----------
/**
 * 写一幕：Sonnet 初稿 → Haiku 检查 → 不过则带意见重写一次（重写稿不再检查）。
 * 每幕最多 2 次写作调用 + 1 次检查调用；正常 1 + 1。
 */
export async function writeScene($: EngineInterface, p: Pack, s: Story, opt: PlanOption, who: string | null, lang: Lang, meta: MetaInfo): Promise<Gen<Scene>> {
  const u = zeroUsage()
  const head: ModelTextBlock = { text: staticBlock(p, lang), cache: true }
  const ctx = sceneContext(p, s, opt, who)
  // 写作手法层：每幕只挑一次（两次写作尝试共用），预写关键场景的人也要有完整设定
  const pick = pickCraft(p, s, lang, { place: opt.id, present: [...opt.maybe, ...(who ? [who] : []), ...(ctx.incident?.who ?? [])], beat: ctx.beat, lead: who, endingsSeen: meta.endingsSeen, lastKind: s.lastKind })
  if (pick.setPiece) for (const id of setPieceCast(pick.setPiece)) if (!ctx.focus.includes(id) && personOf(p, id)) ctx.focus.push(id)
  ctx.craft = pick
  let fix = ''
  for (let attempt = 0; attempt < 2; attempt++) {
    const draft = await ask($, meta.writer ?? WRITER, [head, { text: sceneDynamic(p, s, opt, who, fix, lang, meta, ctx) }], 1800, u)
    const j = json(draft)
    let sc = j ? parseScene(p, j, opt.place) : null
    if (!sc) { fix = 'The previous reply was not valid JSON or missed fields.'; continue }
    // 预写关键场景：核心台词缺了就由程序拼回（不重写）；预写选项优先
    if (pick.setPiece) {
      if (!setPieceIntact(p, sc, pick.setPiece, lang)) sc = spliceSetPiece(p, sc, pick.setPiece, lang)
      const pre = setPieceChoices(p, pick.setPiece, lang)
      if (pre) sc.choices = pre
    }
    if (attempt === 0) {
      const verdict = json(await ask($, CHECKER, [{ text: checkerBlock(p, lang), cache: true }, { text: checkDynamic(p, s, draft!, lang, ctx) }], 200, u, 'check'))
      if (verdict && verdict.ok === false && typeof verdict.fix === 'string' && verdict.fix) { fix = verdict.fix; continue }
    }
    sc.proactive = !!who
    sc.kind = pick.kind
    if (pick.flags.length) sc.craftFlags = pick.flags
    if (ctx.beat) sc.beat = ctx.beat.id
    if (ctx.incident) sc.incident = ctx.incident.id
    return { value: sc, usage: u }
  }
  return { value: null, usage: u }
}

/** 画信物：一次调用；不合格再试一次 */
export async function drawKeepsake($: EngineInterface, p: Pack, s: Story, id: string, lang: Lang, model = WRITER): Promise<Gen<Keepsake>> {
  const u = zeroUsage()
  const T = packText(p, lang)
  const c = castOf(p, id)
  if (!c) return { value: null, usage: u }
  const recent = s.album.filter(m => m.heroine === id).slice(-4).map(m => m.text).join('; ')
  const owned = s.keepsakes.filter(k => k.heroine === id).map(k => k.title).join(', ')
  const prompt = `Design an 8x8 pixel-art icon for a small keepsake between "me" and ${T(c.name)} in the visual novel "${T(p.title)}".
Her: ${T(c.look)}. ${T(c.secret)}
Recent moments: ${recent || 'none'}
Ideas: ${T(c.keepsakeIdeas) || 'a concrete small object tied to the moments above'}${owned ? `\nAlready given (choose something different): ${owned}` : ''}
Use at most 5 colors. ${langRule(lang)}
Reply with JSON only: {"title":"object name","desc":"one sentence on why it matters","palette":{"a":"#rrggbb","b":"#rrggbb"},"art":["8 chars per row, '.' = transparent", "... 8 rows"]}`
  for (let i = 0; i < 2; i++) {
    const j = json(await ask($, model, [{ text: prompt }], 500, u))
    const ok = j ? validKeepsake(j.art, j.palette) : null
    if (j && ok) return { value: { pack: p.id, day: s.day, heroine: id, title: String(j.title ?? '?').slice(0, 24), desc: String(j.desc ?? '').slice(0, 120), art: ok.art, palette: ok.palette }, usage: u }
  }
  return { value: null, usage: u }
}

/** 写结局：一次调用，回收回忆、信物、关键约定 */
export async function writeEnding($: EngineInterface, p: Pack, s: Story, e: EndingDef, lang: Lang, model = WRITER): Promise<Gen<string>> {
  const u = zeroUsage()
  const T = packText(p, lang)
  const promises = s.promises.map(x => `${x.heroine} "${x.text}" ${x.status}${x.key ? ' (key promise)' : ''}`).join('; ') || 'none'
  const keeps = s.keepsakes.map(k => `${k.heroine}: ${k.title}`).join(', ') || 'none'
  const album = s.album.slice(-30).map(m => `${dayText(p, lang, m.day)}: ${m.text}`).join('\n')
  const who = e.who ? [e.who] : p.cast.filter(c => (s.heroines[c.id]?.stage ?? 0) >= 2).map(c => c.id)
  const kind = e.kind ? ` [${e.kind} ending]` : ''
  const text = await ask($, model, [{ text: staticBlock(p, lang), cache: true }, {
    text: `Now write the ENDING instead of a scene. Plain prose, no JSON.
Ending: "${T(e.title)}"${kind} — ${T(e.brief)}${e.who ? ` (with ${T(castOf(p, e.who)?.name)})` : ''}${e.who && !meterOf(castOf(p, e.who)).romance ? `\n${noRomance(p, castOf(p, e.who)!, lang)}.` : ''}
${focusNotes(p, who, lang)}Final state:
${stateText(p, s, lang, who)}
Promises: ${promises}
Keepsakes: ${keeps}
Memories in order:
${album}
${endingCraft(p, s, e.who, lang)}
Write 10-14 sentences: call back at least three specific memories and the keepsakes, say what became of her secret, include images and a few lines of dialogue. ${T(p.finale)} ${langRule(lang)}`,
  }], 1600, u)
  return { value: text ? text.trim() : null, usage: u }
}

export function addUsage(a: Usage, b: Usage): Usage {
  return {
    writer: a.writer + b.writer, checker: a.checker + b.checker, input: a.input + b.input, output: a.output + b.output, cacheRead: a.cacheRead + b.cacheRead, cacheWrite: a.cacheWrite + b.cacheWrite,
    pilot: (a.pilot ?? 0) + (b.pilot ?? 0), pilotIn: (a.pilotIn ?? 0) + (b.pilotIn ?? 0), pilotOut: (a.pilotOut ?? 0) + (b.pilotOut ?? 0),
    extra: (a.extra ?? 0) + (b.extra ?? 0), extraIn: (a.extraIn ?? 0) + (b.extraIn ?? 0), extraOut: (a.extraOut ?? 0) + (b.extraOut ?? 0),
    cost: (a.cost ?? 0) + (b.cost ?? 0),
  }
}
