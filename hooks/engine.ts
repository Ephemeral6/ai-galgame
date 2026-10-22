// 剧情引擎。纯函数（日程、约定、阶段、时间循环、结局判定）+ 三种模型调用（写一幕、画信物、写结局）。
// 这里不读写 $.state：状态读写集中在 register.tsx，便于校验和测试。

import type { EngineInterface, ModelTextBlock } from 'claude-code'

import type { Actor, Choice, EndingDef, HState, Keepsake, Lang, Pack, Scene, Story, Usage } from '../types'
import { EXPRS, validKeepsake } from './art'
import { t } from './i18n'
import { castOf, dayText, packText, tr } from './pack'

export const WRITER = 'sonnet'
export const CHECKER = 'haiku'
/** 每个角色最多几个信物 */
export const KEEPSAKES_PER = 2

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x))

export function zeroUsage(): Usage {
  return { writer: 0, checker: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }
}

export function freshHeroines(p: Pack): Record<string, HState> {
  const h: Record<string, HState> = {}
  for (const c of p.cast) h[c.id] = { affection: 0, stage: 0, scenes: 0, mood: '', lastDay: 0 }
  return h
}

/** 新的一局。loop ≥ 2 是二周目及以后：每人起始好感 +1（她们「好像见过你」） */
export function freshStory(p: Pack, lang: Lang, loop = 1): Story {
  const heroines = freshHeroines(p)
  if (loop >= 2) for (const id of Object.keys(heroines)) heroines[id]!.affection = 1
  return {
    pack: p.id, lang, loop, cycle: 1, rewinds: 0, loads: 0,
    phase: 'plan', day: 1, slot: 0, heroines, promises: [], notes: [], facts: [], keepsakes: [], album: [],
    scene: null, after: '', reveal: 0, loadingText: '', ending: '', endingId: '', error: '', usage: zeroUsage(),
  }
}

// ---------- 日程 ----------
export type PlanOption = { place: string; mood: string; maybe: string[]; forced?: string; who?: string }

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

export function planOptions(p: Pack, s: Story, lang: Lang): PlanOption[] {
  const T = packText(p, lang)
  return p.places.filter(pl => pl.slots.includes(s.slot)).map(pl => ({
    place: T(pl.name), mood: T(pl.mood), maybe: p.cast.filter(c => c.haunts[s.slot]?.includes(pl.id)).map(c => c.id),
  }))
}

// ---------- 场景落地、选择、推进 ----------
/** 一幕写好后：记见面、单独相处、约定兑现、伏笔回收、事实、相册 */
export function applyScene(s: Story, sc: Scene): Story {
  const heroines = { ...s.heroines }
  for (const a of sc.cast) {
    const h = heroines[a.id]
    if (h) heroines[a.id] = { ...h, lastDay: s.day, scenes: h.scenes + (sc.cast.length === 1 ? 1 : 0) }
  }
  const notes = sc.callback ? s.notes.map(n => (!n.used && sc.callback!.includes(n.text.slice(0, 6)) ? { ...n, used: true } : n)) : s.notes
  const promises = s.promises.map(pr => (pr.status === 'open' && pr.day < s.day + 1 && sc.cast.some(a => a.id === pr.heroine) && s.day <= pr.due && !(pr.day === s.day && pr.made === sceneKey(s)) ? { ...pr, status: 'kept' as const } : pr))
  return {
    ...s, phase: 'scene', scene: sc, reveal: 0, heroines, notes, promises, error: '', after: '',
    facts: sc.fact ? [...s.facts, sc.fact].slice(-40) : s.facts,
    album: [...s.album, { day: s.day, slot: s.slot, heroine: sc.cast[0]?.id ?? '', text: sc.summary }].slice(-80),
  }
}

/** 同一天同一时段的标识，防止「刚答应就在同一幕里算兑现」 */
export function sceneKey(s: Story): string {
  return `${s.cycle}:${s.day}:${s.slot}`
}

export type ChoiceResult = { story: Story; advanced: string[]; keepsakeFor: string[] }

export function applyChoice(p: Pack, s: Story, c: Choice, lang: Lang): ChoiceResult {
  const sc = s.scene!
  const lead = sc.cast[0]?.id ?? ''
  const heroines = { ...s.heroines }
  for (const [id, d] of Object.entries(c.effects)) {
    const h = heroines[id]
    if (h) heroines[id] = { ...h, affection: h.affection + clamp(Math.round(Number(d)) || 0, -2, 2) }
  }
  const notes = [...s.notes, { day: s.day, heroine: lead, text: `${sc.place}：${c.text}`, used: false }].slice(-30)
  const promises = [...s.promises]
  if (c.kind === 'promise' && lead && castOf(p, lead)) {
    const dl = castOf(p, lead)!.deadline.day
    promises.push({ text: c.promise || c.text, heroine: lead, day: s.day, due: clamp(dl, s.day + 1, p.days), status: 'open', made: sceneKey(s) })
  }
  const advanced: string[] = []
  for (const ch of p.cast) {
    const st = heroines[ch.id]!
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
  return { story: { ...s, phase: 'after', heroines, notes, promises, reveal: 0, after }, advanced, keepsakeFor }
}

export type AdvanceResult = { story: Story; finished: boolean; looped: boolean; broken: string[] }

/** 推进到下一个时段；跨天时结算过期约定；最后一天结束时进入结局或时间循环 */
export function advanceTime(p: Pack, s: Story, lang: Lang): AdvanceResult {
  let { day, slot } = s
  slot++
  let promises = s.promises
  let heroines = s.heroines
  const broken: string[] = []
  const T = packText(p, lang)
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
  }
  const base: Story = { ...s, day, slot, promises, heroines, phase: 'plan', scene: null, reveal: 0, after: broken.join('\n'), error: '' }
  if (day <= p.days) return { story: base, finished: false, looped: false, broken }
  // 最后一天过完：时间循环包在没达到目标结局时回到第 1 天
  const loop = p.features?.timeLoop
  if (loop && s.cycle < loop.maxLoops + 1 && pickEnding(p, base).tier < loop.minTier) {
    const looped: Story = {
      ...base, day: 1, slot: 0, cycle: s.cycle + 1, heroines: freshHeroines(p), promises: [],
      after: tr(loop.text, lang, p.defaultLang),
      notes: base.notes.map(n => ({ ...n, used: false })),
    }
    return { story: looped, finished: false, looped: true, broken }
  }
  return { story: { ...base, day: p.days, slot: p.slots.length - 1 }, finished: true, looped: false, broken }
}

// ---------- 结局判定 ----------
export function endingMatches(p: Pack, s: Story, e: EndingDef): boolean {
  if (e.minLoop !== undefined && s.loop < e.minLoop) return false
  // 不绑角色的结局：阶段/好感条件对每个角色都要满足（群像结局）
  if (!e.who) return p.cast.every(c => {
    const h = s.heroines[c.id]
    return !!h && (e.minStage === undefined || h.stage >= e.minStage) && (e.minAffection === undefined || h.affection >= e.minAffection)
  })
  const h = s.heroines[e.who]
  if (!h) return false
  if (e.minStage !== undefined && h.stage < e.minStage) return false
  if (e.minAffection !== undefined && h.affection < e.minAffection) return false
  const mine = s.promises.filter(x => x.heroine === e.who)
  if (e.maxBroken !== undefined && mine.filter(x => x.status === 'broken').length > e.maxBroken) return false
  if (e.minKept !== undefined && mine.filter(x => x.status === 'kept').length < e.minKept) return false
  if (e.minLoop !== undefined && s.loop < e.minLoop) return false
  if (e.minKeepsakes !== undefined && s.keepsakes.filter(k => k.heroine === e.who).length < e.minKeepsakes) return false
  return true
}

export function pickEnding(p: Pack, s: Story): EndingDef {
  const aff = (e: EndingDef) => (e.who ? s.heroines[e.who]?.affection ?? 0 : -999)
  const ok = p.endings.filter(e => endingMatches(p, s, e))
  ok.sort((a, b) => b.tier - a.tier || aff(b) - aff(a))
  return ok[0] ?? p.endings[p.endings.length - 1]!
}

// ---------- 模型调用 ----------
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

async function ask($: EngineInterface, model: string, prompt: ModelTextBlock[], maxTokens: number, u: Usage): Promise<string | null> {
  const r = await $.model.complete({ model, prompt, maxTokens, timeoutMs: 90_000 })
  if (model === WRITER) u.writer++
  else u.checker++
  u.input += r.usage.input_tokens
  u.output += r.usage.output_tokens
  u.cacheRead += r.usage.cache_read_input_tokens
  u.cacheWrite += r.usage.cache_creation_input_tokens
  return r.isAnswered ? r.text : null
}

function langRule(lang: Lang): string {
  return lang === 'en'
    ? 'Write ALL story text (titles, narration, dialogue, choices, reactions, summaries, facts) in natural English.'
    : '所有剧情文字（标题、旁白、台词、选项、反应、概括、事实）都用简体中文写。'
}

function bibleText(p: Pack, lang: Lang): string {
  const T = packText(p, lang)
  return p.cast.map(c => [
    `- id=${c.id}「${T(c.name)}」 look: ${T(c.look)}`,
    `  voice: ${T(c.voice)}`,
    `  samples: ${c.samples.map(x => `「${T(x)}」`).join(' ')}`,
    `  secret (do not reveal before stage 3 "${T(p.stages[3])}"): ${T(c.secret)}`,
    `  arc: ${c.arc.map((a, i) => `[${i}] ${T(a)}`).join(' ')}`,
    `  deadline: day ${c.deadline.day}, ${T(c.deadline.text)}`,
  ].join('\n')).join('\n')
}

const FORMAT = `Reply with ONE JSON object only:
{"title":"scene title","cast":[{"id":"<cast id>","expression":"normal|smile|blush|sad|angry|surprised"}],"distance":"near|far","narration":"2-4 sentences","lines":[{"who":"<cast id or me>","text":"..."}],"choices":[{"text":"...","kind":"reply|observe|promise","effects":{"<cast id>":1},"promise":"what I promised (promise only)","reaction":"the immediate reaction and close of the scene after this choice, 2-3 sentences, may include one line of dialogue"}],"summary":"one-sentence summary","callback":"which earlier note this scene calls back, or empty","fact":"one concrete new fact this scene establishes"}
Rules: at most two cast members on stage (zero is allowed); 3-7 lines of dialogue; exactly 3 choices with clearly different attitudes, at least one "reply"; "observe" gains a detail and does not change affection; "promise" must fill the promise field; effects range -2..+2 and list only affected cast ids.`

/** 固定不变的部分（设定集 + 格式）放第一块并打缓存标记，每一幕复用 */
export function staticBlock(p: Pack, lang: Lang): string {
  const T = packText(p, lang)
  const wall = p.features?.fourthWall
    ? '\nThis story may break the fourth wall: characters may sense the player\'s undos, reloads and replays (given in the state below) and gently remark on them. Never threaten the player.'
    : ''
  const loop = p.features?.timeLoop
    ? `\nThis story has a time loop: after day ${p.days} it may return to day 1. "I" remember earlier loops (the notebook and facts persist); others do not, unless their secret says otherwise.`
    : ''
  return `You are writing an interactive visual novel: "${T(p.title)}".
${langRule(lang)}

[Premise]
${T(p.premise)}

[Style]
${T(p.style)}

[Cast]
${bibleText(p, lang)}

[Stages] ${p.stages.map((x, i) => `${i}=${T(x)}`).join(', ')}${wall}${loop}

[Output format — for the writer]
${FORMAT}`
}

/** 检查员只需要人物设定与禁忌，不需要写作格式：比写手的固定块短，省输入 */
export function checkerBlock(p: Pack, lang: Lang): string {
  const T = packText(p, lang)
  return `Continuity reference for the visual novel "${T(p.title)}".
[Style and taboos]
${T(p.style)}
[Cast]
${bibleText(p, lang)}
[Stages] ${p.stages.map((x, i) => `${i}=${T(x)}`).join(', ')}`
}

export function stateText(p: Pack, s: Story, lang: Lang): string {
  const T = packText(p, lang)
  return p.cast.map(c => {
    const h = s.heroines[c.id]!
    return `- ${c.id} ${T(c.name)}: affection ${h.affection}, stage ${h.stage} "${T(p.stages[h.stage])}" (beat: ${T(c.arc[h.stage])}), mood ${h.mood || 'normal'}, alone-scenes ${h.scenes}, last seen day ${h.lastDay || '-'}`
  }).join('\n')
}

export type MetaInfo = { endingsSeen: string[]; clears: number }

export function sceneDynamic(p: Pack, s: Story, opt: PlanOption, who: string | null, fix: string, lang: Lang, meta: MetaInfo): string {
  const T = packText(p, lang)
  const open = s.promises.filter(x => x.status === 'open')
  const notes = s.notes.filter(n => !n.used).slice(-6)
  const today = p.events.filter(e => e.day === s.day).map(e => T(e.text)).join('; ')
  const lead = who ? `${T(castOf(p, who)?.name)} came looking for me (not seen for ${s.day - s.heroines[who]!.lastDay} days); she leads this scene.` : ''
  const wall = p.features?.fourthWall
    ? `\n[Player traces] undos this run: ${s.rewinds}; reloads: ${s.loads}; playthrough #${s.loop}; endings seen before: ${meta.endingsSeen.join(', ') || 'none'}`
    : ''
  const cyc = p.features?.timeLoop ? `\n[Loop] this is loop ${s.cycle}.` : ''
  return `[Now] ${dayText(p, lang, s.day)} of ${p.days} · ${T(p.slots[s.slot])} · place: ${opt.place} (${opt.mood})${opt.forced ? ` · fixed event: ${opt.forced}` : ''}
${today ? `Today: ${today}\n` : ''}${stateText(p, s, lang)}
${lead}${wall}${cyc}
[Established facts — do not contradict]
${s.facts.slice(-24).map(f => `- ${f}`).join('\n') || '(none)'}
[Open promises]
${open.map(x => `- day ${x.day} promised ${x.heroine}: ${x.text} (due day ${x.due})`).join('\n') || '(none)'}
[Notebook: my earlier choices — call one back naturally]
${notes.map(n => `- day ${n.day} (${n.heroine}): ${n.text}`).join('\n') || '(none)'}
${fix ? `\n[Problems in the previous draft — must fix] ${fix}\n` : ''}
Write this scene following the current stage beat of whoever is present. ${langRule(lang)}`
}

export function checkDynamic(p: Pack, s: Story, draft: string, lang: Lang): string {
  return `You are now the continuity editor, not the writer. Check this draft scene for hard errors only:
1. contradicts an established fact; 2. a character's voice clearly wrong; 3. reveals a secret before stage 3; 4. wrong language (must follow: ${langRule(lang)}); 5. violates the style taboos; 6. missing JSON fields.
State:
${stateText(p, s, lang)}
Facts: ${s.facts.slice(-24).join('; ') || 'none'}
Draft:
${draft}
Reply with JSON only: {"ok":true} or {"ok":false,"fix":"one sentence on what to change"}`
}

export function parseScene(p: Pack, j: Record<string, unknown>, place: string): Scene | null {
  if (typeof j.narration !== 'string' || !Array.isArray(j.choices) || j.choices.length < 2) return null
  const ids = p.cast.map(c => c.id)
  const cast: Actor[] = (Array.isArray(j.cast) ? j.cast : [])
    .map(a => {
      const o = (a ?? {}) as Record<string, unknown>
      const ex = String(o.expression)
      return { id: String(o.id), expression: (EXPRS as readonly string[]).includes(ex) ? ex : 'normal' }
    })
    .filter(a => ids.includes(a.id))
    .slice(0, 2)
  const choices: Choice[] = (j.choices as unknown[]).slice(0, 3).map(raw => {
    const c = (raw ?? {}) as Record<string, unknown>
    const eff: Record<string, number> = {}
    if (c.effects && typeof c.effects === 'object') for (const [k, v] of Object.entries(c.effects as Record<string, unknown>)) if (ids.includes(k)) eff[k] = clamp(Math.round(Number(v)) || 0, -2, 2)
    return {
      text: String(c.text ?? '…'),
      kind: c.kind === 'observe' || c.kind === 'promise' ? c.kind : 'reply',
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
  }
}

/**
 * 写一幕：Sonnet 初稿 → Haiku 检查 → 不过则带意见重写一次（重写稿不再检查）。
 * 每幕最多 2 次写作调用 + 1 次检查调用；正常 1 + 1。
 */
export async function writeScene($: EngineInterface, p: Pack, s: Story, opt: PlanOption, who: string | null, lang: Lang, meta: MetaInfo): Promise<Gen<Scene>> {
  const u = zeroUsage()
  const head: ModelTextBlock = { text: staticBlock(p, lang), cache: true }
  let fix = ''
  for (let attempt = 0; attempt < 2; attempt++) {
    const draft = await ask($, WRITER, [head, { text: sceneDynamic(p, s, opt, who, fix, lang, meta) }], 1800, u)
    const j = json(draft)
    const sc = j ? parseScene(p, j, opt.place) : null
    if (!sc) { fix = 'The previous reply was not valid JSON or missed fields.'; continue }
    if (attempt === 0) {
      const verdict = json(await ask($, CHECKER, [{ text: checkerBlock(p, lang), cache: true }, { text: checkDynamic(p, s, draft!, lang) }], 200, u))
      if (verdict && verdict.ok === false && typeof verdict.fix === 'string' && verdict.fix) { fix = verdict.fix; continue }
    }
    sc.proactive = !!who
    return { value: sc, usage: u }
  }
  return { value: null, usage: u }
}

/** 画信物：一次调用；不合格再试一次 */
export async function drawKeepsake($: EngineInterface, p: Pack, s: Story, id: string, lang: Lang): Promise<Gen<Keepsake>> {
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
    const j = json(await ask($, WRITER, [{ text: prompt }], 500, u))
    const ok = j ? validKeepsake(j.art, j.palette) : null
    if (j && ok) return { value: { pack: p.id, day: s.day, heroine: id, title: String(j.title ?? '?').slice(0, 24), desc: String(j.desc ?? '').slice(0, 120), art: ok.art, palette: ok.palette }, usage: u }
  }
  return { value: null, usage: u }
}

/** 写结局：一次调用，回收回忆与信物 */
export async function writeEnding($: EngineInterface, p: Pack, s: Story, e: EndingDef, lang: Lang): Promise<Gen<string>> {
  const u = zeroUsage()
  const T = packText(p, lang)
  const promises = s.promises.map(x => `${x.heroine} "${x.text}" ${x.status}`).join('; ') || 'none'
  const keeps = s.keepsakes.map(k => `${k.heroine}: ${k.title}`).join(', ') || 'none'
  const album = s.album.slice(-30).map(m => `${dayText(p, lang, m.day)}: ${m.text}`).join('\n')
  const text = await ask($, WRITER, [{ text: staticBlock(p, lang), cache: true }, {
    text: `Now write the ENDING instead of a scene. Plain prose, no JSON.
Ending: "${T(e.title)}" — ${T(e.brief)}${e.who ? ` (with ${T(castOf(p, e.who)?.name)})` : ''}
Final state:
${stateText(p, s, lang)}
Promises: ${promises}
Keepsakes: ${keeps}
Memories in order:
${album}
Write 10-14 sentences: call back at least three specific memories and the keepsakes, say what became of her secret, include images and a few lines of dialogue. ${T(p.finale)} ${langRule(lang)}`,
  }], 1600, u)
  return { value: text ? text.trim() : null, usage: u }
}

export function addUsage(a: Usage, b: Usage): Usage {
  return { writer: a.writer + b.writer, checker: a.checker + b.checker, input: a.input + b.input, output: a.output + b.output, cacheRead: a.cacheRead + b.cacheRead, cacheWrite: a.cacheWrite + b.cacheWrite }
}
