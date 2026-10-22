// 写作手法：给 AI 的短提示片段 + 按当前状态挑片段 + 剧本包 craft 字段（母题、预写关键场景、路线锁定、揭示、日常细节、群像笑料、八卦）的选取与校验。
// 纯函数，不读写 $.state，不调用模型。接入方法见 hooks/INTEGRATION-NARRATIVE.md，设计依据见 docs/NARRATIVE-CRAFT.md。
// 片段用英文写（与 engine.ts 的提示同一种指令语言），越短越好：固定部分进缓存块，变化部分每幕只放两三条。

import type { BeatDef, Choice, Lang, Pack, Scene, Story } from '../types'
import type { CraftFields, PackCraft, PersonCraft, RevealDef, SceneKind, SetPieceDef } from './craft-types'
import { castOf, packText, personOf } from './pack'

// ---------- 片段 ----------

/** 每一幕都适用的写法（进缓存块） */
export const CRAFT_CORE = `[Craft — every scene]
- Anchor the scene on ONE concrete object or action (a thing in someone's hands, food, weather on skin). Prefer an object already seen before.
- Subtext over statement: characters talk around what they feel; at least one line should mean more than it says. Never have anyone name their own emotion.
- Show feeling through action and setting (hands, distance, what they look at, the sound in the room), not inner monologue or adjectives.
- Every character keeps their verbal tics and habits; supporting characters have their own errands and jokes.
- Call back one small earlier detail (a motif, a fact, a past choice) and let it carry a slightly new meaning.
- End on an image or a half-finished line, not a summary of feelings.`

/** 导演片段：先做调度决定，再写（进缓存块） */
export const DIRECTOR = `[Direction — decide before writing]
1. Close-up: pick one object for the camera to rest on (from the motifs if one fits) and mention it at the start and at the turn of the scene.
2. Who speaks first, and who answers late. A pause is a beat: show it as an action or a "……"/"..." line, not as narration about silence.
3. Blocking: where each person stands or sits, and one move that changes the distance between them.
4. Weather/light and the scene's mood in one phrase.
Put these decisions into the direction fields: camera.focus = the close-up object; camera.pause = the line after which the silence falls; atmo = weather/time/particles; cues = at most 2-3 moves or emote bubbles at the turning lines. A cue that changes distance (approach, turn) is worth more than an emote.`

/** 按场景类型的片段（每幕挑一条，放动态块） */
export const KIND_TIPS: Record<SceneKind, string> = {
  daily: 'Scene type: everyday. Small stakes, real texture: food, errands, weather, a running joke. Plant one detail that could matter later; do not explain it.',
  comedy: 'Scene type: ensemble comedy. Fast exchanges, each person funny in their own way (tic, misunderstanding, deadpan). Keep it warm; let one quiet line slip through near the end.',
  conflict: 'Scene type: conflict. Both sides are partly right. Short lines, interruptions, one cruel sentence someone regrets at once. Nobody explains the real reason yet.',
  confession: 'Scene type: confession. Slow down. Few lines, long pauses; the key sentence is plain and short. Let an object or gesture do half the work. Do not resolve everything.',
  farewell: 'Scene type: farewell. Talk about small practical things instead of the parting itself. One look back. The last line is ordinary words that carry everything.',
  reveal: 'Scene type: reveal. Deliver the truth plainly in one or two lines, then show its weight through a re-seen earlier detail. No speeches.',
  climax: 'Scene type: climax. Concrete action under pressure, counted time, physical detail. Earlier promises and motifs come due here; keep dialogue lean.',
}

/** 按关系阶段的片段（领头主角色的阶段，放动态块） */
export const STAGE_TIPS: [string, string, string, string, string] = [
  'Relationship stage 0: first impressions. Show her tics and her world; keep her guarded; one memorable line.',
  'Relationship stage 1: easy company. Shared routine, teasing, a small favour; a crack in her front she quickly covers.',
  'Relationship stage 2: worries. Something is off and she hides it; let me notice a physical sign, not be told.',
  'Relationship stage 3: the secret surfaces. Fewer jokes, more silence; she says less than she means; trust is the stake.',
  'Relationship stage 4: the choice. Everything earlier (promises, motifs) is now load-bearing; make the moment plain and earned.',
]

/** 非恋爱角色的补充（任何阶段都适用） */
const NO_ROMANCE_TIP = 'This relationship is not romantic: express closeness as trust, respect, teamwork or family warmth, never flirtation.'

/** 笑与泪交替：上一幕沉重时，这一幕先给一口气 */
const RELIEF_TIP = 'Rhythm: the previous scene was heavy; open lighter (a joke, a snack, a supporting character) before returning to the thread.'
/** 高潮前的平静 */
const CALM_TIP = 'Rhythm: the big day is close. Write a calm, almost ordinary scene; let one small detail feel like a goodbye.'

// ---------- 取值 ----------

export function craftOf(p: Pack): PackCraft | undefined {
  return (p as Pack & CraftFields).craft
}

function hash(key: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0 }
  h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b) >>> 0; h ^= h >>> 13
  return (h >>> 0) / 4294967296
}

/** 与引擎同样的思路：由种子、轮次、天、时段决定，回退读档结果不变 */
function rnd(s: Story, key: string): number {
  return hash(`${s.seed}:${s.cycle}:${s.day}:${s.slot}:craft:${key}`)
}

function pickN<T>(s: Story, key: string, xs: T[], n: number): T[] {
  return xs.map((x, i) => ({ x, r: rnd(s, `${key}:${i}`) })).sort((a, b) => a.r - b.r).slice(0, n).map(o => o.x)
}

const has = (s: Story, f: string) => s.flags.includes(f)
const allAfter = (s: Story, fs: string[] | undefined) => !fs || fs.every(f => has(s, f))

/** 已锁定的个人线：flags 里的 'route:<id>'（'route:ensemble' 表示群像线） */
export function routeOf(s: Story): string | null {
  const f = s.flags.find(x => x.startsWith('route:'))
  return f ? f.slice(6) : null
}

/**
 * 共通线结束时决定路线（引擎在跨过 commonUntil 那天时调用一次）：返回要写入 flags 的 'route:<id>'，
 * 没有 routes、还没到、已锁定则返回 null。
 */
export function decideRoute(p: Pack, s: Story): string | null {
  const r = craftOf(p)?.routes
  if (!r || routeOf(s) || s.day <= r.commonUntil) return null
  const ranked = p.cast.map(c => ({ id: c.id, h: s.heroines[c.id] }))
    .filter(x => !!x.h && x.h.stage >= r.lock.minStage && x.h.affection >= r.lock.minAffection)
    .sort((a, b) => b.h!.affection - a.h!.affection)
  const top = ranked[0]
  if (!top) return 'route:ensemble'
  const second = p.cast.filter(c => c.id !== top.id).map(c => s.heroines[c.id]?.affection ?? 0).sort((a, b) => b - a)[0] ?? -999
  if (top.h!.affection - second < (r.lock.margin ?? 0)) return 'route:ensemble'
  return r.branches.some(b => b.who === top.id) ? `route:${top.id}` : 'route:ensemble'
}

// ---------- 场景类型 ----------

const KIND_WORDS: [SceneKind, RegExp][] = [
  ['climax', /climax|高潮|决战|final/i],
  ['conflict', /conflict|misunderstand|feud|冲突|误会|旧怨|争吵|对峙/i],
  ['reveal', /secret|truth|reveal|discover|秘密|真相|发现|曝光|揭/i],
  ['farewell', /farewell|parting|离别|告别|送别/i],
  ['confession', /confess|告白|坦白/i],
]

export type CraftInput = {
  /** 地点 id（planOptions 给的 opt.id） */
  place?: string
  /** 可能在场的人（主角色与配角） */
  present: string[]
  /** 这一幕必须写到的关键事件 */
  beat?: BeatDef | null
  /** 主动来找「我」的那个人 */
  lead?: string | null
  /** 看过的结局 id（跨周目） */
  endingsSeen?: string[]
  /** 上一幕的场景类型（用来做笑泪交替；没有就不管） */
  lastKind?: SceneKind
}

function leadOf(p: Pack, input: CraftInput): string | undefined {
  if (input.lead) return input.lead
  return input.present.find(id => !!castOf(p, id)) ?? input.beat?.who?.find(id => !!castOf(p, id))
}

export function sceneKind(p: Pack, s: Story, input: CraftInput, piece?: SetPieceDef): SceneKind {
  if (piece) return piece.kind
  const T = packText(p, s.lang)
  if (input.beat) {
    const label = `${T(input.beat.kind)} ${input.beat.id}`
    for (const [k, re] of KIND_WORDS) if (re.test(label)) return k
  }
  const lead = leadOf(p, input)
  const c = lead ? castOf(p, lead) : undefined
  const h = lead ? s.heroines[lead] : undefined
  if (c && h) {
    if (h.stage >= 2 && c.deadline.day - s.day <= 0) return 'farewell'
    if (h.stage === 3 && input.present.filter(id => castOf(p, id)).length <= 1) return 'confession'
  }
  const npcHere = input.present.filter(id => !castOf(p, id) && personOf(p, id)).length
  if (npcHere > 0 && rnd(s, 'comedy') < 0.45) return 'comedy'
  return 'daily'
}

// ---------- 关键场景、揭示、闪回 ----------

function pieceTriggered(p: Pack, s: Story, x: SetPieceDef, input: CraftInput): boolean {
  if (has(s, `set:${x.id}`)) return false
  const t = x.trigger
  const here = input.present.includes(x.who) || input.lead === x.who || !!input.beat?.who?.includes(x.who)
  if (!here) return false
  if (t.beat && input.beat?.id !== t.beat) return false
  if (t.minStage !== undefined && (s.heroines[x.who]?.stage ?? 0) < t.minStage) return false
  if (t.places && !(input.place && t.places.includes(input.place))) return false
  if (t.slots && !t.slots.includes(s.slot)) return false
  if (t.days && (s.day < t.days[0] || s.day > t.days[1])) return false
  if (!allAfter(s, t.after)) return false
  if (t.route && routeOf(s) !== t.route) return false
  if (t.alone && input.present.filter(id => castOf(p, id)).length > 1 && input.lead !== x.who) return false
  return true
}

/** 这一幕要不要由预写关键场景接管：beat 绑定的优先，其余按包里的顺序 */
export function setPieceDue(p: Pack, s: Story, input: CraftInput): SetPieceDef | null {
  const list = craftOf(p)?.setPieces ?? []
  return list.find(x => x.trigger.beat && pieceTriggered(p, s, x, input))
    ?? list.find(x => !x.trigger.beat && pieceTriggered(p, s, x, input))
    ?? null
}

function revealReady(p: Pack, s: Story, r: RevealDef, input: CraftInput): boolean {
  if (has(s, `reveal:${r.id}`)) return false
  const w = r.when
  if (!allAfter(s, w.after)) return false
  if (w.minLoop !== undefined && Math.max(s.loop, s.cycle) < w.minLoop) return false
  if (w.needEndings && !w.needEndings.every(e => input.endingsSeen?.includes(e))) return false
  if (w.who) {
    if (!input.present.includes(w.who) && input.lead !== w.who) return false
    if (w.minStage !== undefined && (s.heroines[w.who]?.stage ?? 0) < w.minStage) return false
  }
  return true
}

export function revealDue(p: Pack, s: Story, input: CraftInput): RevealDef | null {
  return (craftOf(p)?.reveals ?? []).find(r => revealReady(p, s, r, input)) ?? null
}

// ---------- 每幕的选择结果 ----------

export type CraftPick = {
  kind: SceneKind
  setPiece: SetPieceDef | null
  reveal: RevealDef | null
  /** 这一幕成功写完后要加进 story.flags 的标记（'set:<id>'、'reveal:<id>'、'fb:<id>'、'gag:<id>'） */
  flags: string[]
  /** 放进动态块的文字（已本地化，可直接拼接；可能为空） */
  text: string
}

/**
 * 按当前状态挑这一幕的写作片段与素材。控制长度：场景类型 1 条 + 阶段 1 条 + 节奏 ≤1 条 + 母题 ≤3 + 细节 ≤2 + 笑料/闪回/揭示各 ≤1。
 * 预写关键场景另见 setPieceBrief（它替换引擎末尾的「Write this scene」指令）。
 */
export function pickCraft(p: Pack, s: Story, lang: Lang, input: CraftInput): CraftPick {
  const T = packText(p, lang)
  const cr = craftOf(p)
  const piece = setPieceDue(p, s, input)
  const reveal = piece ? null : revealDue(p, s, input)
  const kind = reveal && !input.beat ? 'reveal' : sceneKind(p, s, input, piece ?? undefined)
  const out: string[] = [KIND_TIPS[kind]]
  const flags: string[] = []
  const lead = piece?.who ?? leadOf(p, input)
  const lc = lead ? castOf(p, lead) : undefined
  if (lc) {
    out.push(STAGE_TIPS[Math.max(0, Math.min(4, s.heroines[lc.id]?.stage ?? 0))] ?? STAGE_TIPS[0])
    if (lc.romance === false) out.push(NO_ROMANCE_TIP)
  }
  if (input.lastKind && ['conflict', 'reveal', 'climax', 'farewell'].includes(input.lastKind) && kind === 'daily') out.push(RELIEF_TIP)
  else if (lc && lc.deadline.day - s.day === 1 && kind === 'daily') out.push(CALM_TIP)

  // 路线
  const r = cr?.routes
  if (r) {
    const route = routeOf(s)
    if (!route && s.day <= r.commonUntil) out.push(`[Common route, until day ${r.commonUntil}] ${T(r.commonGoal)}`)
    else if (route && route !== 'ensemble') {
      const b = r.branches.find(x => x.who === route)
      if (b) out.push(`[Personal route: ${route}] ${T(b.goal)} Others: ${T(b.others)}`)
    } else if (route === 'ensemble' && r.ensemble) out.push(`[Ensemble route] ${T(r.ensemble)}`)
  }

  // 母题：在场的人的、全剧的，取当前阶段的意义
  if (cr?.motifs?.length) {
    const ids = new Set([...input.present, ...(lead ? [lead] : [])])
    const ms = cr.motifs.filter(m => !m.who || ids.has(m.who))
    const chosen = piece?.motif ? [...ms.filter(m => m.id === piece.motif), ...pickN(s, 'motif', ms.filter(m => m.id !== piece.motif), 1)] : pickN(s, 'motif', ms, 2)
    const lines = chosen.map(m => {
      const st = m.who ? (s.heroines[m.who]?.stage ?? 0) : Math.max(0, ...Object.values(s.heroines).map(h => h.stage))
      const mean = [...m.meanings].sort((a, b) => a.stage - b.stage).filter(x => x.stage <= st).pop()
      return mean ? `- ${T(m.thing)}: ${T(mean.text)}` : ''
    }).filter(Boolean)
    if (lines.length) out.push(`[Motifs in play — use one as the close-up]\n${lines.join('\n')}`)
  }

  // 日常细节
  const tx = cr?.texture
  if (tx && !piece) {
    const today = tx.days?.find(d => d.day === s.day)
    const pool = [...(today?.bits ?? []), ...((input.place && tx.places?.[input.place]) || []), ...(tx.any ?? [])]
    const bits = pickN(s, 'texture', pool, 2).map(b => T(b))
    const weather = today?.weather ? `Weather today: ${T(today.weather)}. ` : ''
    if (weather || bits.length) out.push(`[Texture — use at most one or two] ${weather}${bits.join(' / ')}`)
  }

  // 群像笑料
  if (kind === 'comedy' && cr?.gags?.length) {
    const gs = cr.gags.filter(g => !has(s, `gag:${g.id}`) && g.who.some(id => input.present.includes(id)) && (!g.places || (input.place && g.places.includes(input.place))))
    const g = pickN(s, 'gag', gs, 1)[0]
    if (g) { out.push(`[Running gag available] ${T(g.text)}`); flags.push(`gag:${g.id}`) }
  }

  // 闪回
  if (!piece && cr?.flashbacks?.length) {
    const fb = cr.flashbacks.find(f => !has(s, `fb:${f.id}`)
      && (f.who === 'me' || input.present.includes(f.who) || lead === f.who)
      && (f.trigger.minStage === undefined || (s.heroines[f.who]?.stage ?? s.heroines[lead ?? '']?.stage ?? 0) >= f.trigger.minStage)
      && allAfter(s, f.trigger.after)
      && (!f.trigger.motif || (cr.motifs ?? []).some(m => m.id === f.trigger.motif && (!m.who || input.present.includes(m.who)))))
    if (fb && rnd(s, `fb:${fb.id}`) < 0.4) { out.push(`[Flashback — one or two sentences, as a sudden memory] ${T(fb.text)}`); flags.push(`fb:${fb.id}`) }
  }

  // 揭示
  if (reveal) {
    out.push(`[Reveal in this scene] ${T(reveal.truth)}\nAfter it, re-see one earlier detail in its new light: ${reveal.reframes.map(x => T(x)).join(' | ')}`)
    flags.push(`reveal:${reveal.id}`)
  }
  if (piece) flags.push(`set:${piece.id}`)
  return { kind, setPiece: piece, reveal, flags, text: out.join('\n') }
}

/** 已揭示过的真相：之后的幕偶尔点回一条（一行，便宜） */
export function revealedEcho(p: Pack, s: Story, lang: Lang): string {
  const T = packText(p, lang)
  const done = (craftOf(p)?.reveals ?? []).filter(r => has(s, `reveal:${r.id}`))
  const r = pickN(s, 'echo', done, 1)[0]
  if (!r || rnd(s, 'echo-on') > 0.3) return ''
  return `[Already revealed — may echo once] ${T(r.reframes[Math.floor(rnd(s, 'echo-i') * r.reframes.length)] ?? r.truth)}`
}

// ---------- 预写关键场景 ----------

const speaker = (p: Pack, who: string, lang: Lang) => (who === 'me' ? packText(p, lang)(p.me) : who === 'narration' ? '(narration)' : `${who}「${packText(p, lang)(personOf(p, who)?.name)}」`)

/**
 * 关键场景的写作指令：替换引擎动态块末尾的「Write this scene…」。
 * 核心台词逐字保留、顺序不变；AI 只写衔接（动作、旁白、≤2 句过渡台词）、narration、summary、fact，以及（没有预写时的）选项。
 */
export function setPieceBrief(p: Pack, piece: SetPieceDef, lang: Lang): string {
  const T = packText(p, lang)
  const core = piece.lines.map((l, i) => `${i + 1}. ${speaker(p, l.who, lang)}: ${T(l.text)}`).join('\n')
  const ch = piece.choices?.length
    ? `\nThe three choices are prewritten; copy them exactly:\n${piece.choices.map(c => `- [${c.kind}] ${T(c.text)}`).join('\n')}`
    : ''
  return `[SET PIECE — "${T(piece.title)}" (${piece.kind}); the human author wrote the core of this scene]
Staging: ${T(piece.staging)}
Core lines — keep each one VERBATIM and IN ORDER in "lines" (lines marked (narration) go into "narration" verbatim):
${core}
${piece.unsaid ? `Never said aloud in this scene: ${T(piece.unsaid)}\n` : ''}You may add only short connecting action in narration and at most two brief bridging lines between core lines. Do not add speeches, do not explain feelings, do not change any core wording.${ch}`
}

const norm = (x: string) => x.replace(/[\s，。、！？…—「」『』“”"',.!?\-:;：；（）()]/g, '')

/** 检查 AI 写回来的一幕是否完整保留了核心台词（程序检查，不花模型调用） */
export function setPieceIntact(p: Pack, sc: Scene, piece: SetPieceDef, lang: Lang): boolean {
  const T = packText(p, lang)
  const body = norm([sc.narration, ...sc.lines.map(l => l.text)].join('|'))
  return piece.lines.every(l => body.includes(norm(T(l.text))))
}

/**
 * 核心台词缺了时的兜底：按顺序把核心台词放回去，AI 写的台词只保留不重复的、最多插在两句之间各一句。
 * 旁白类核心句并入 narration。
 */
export function spliceSetPiece(p: Pack, sc: Scene, piece: SetPieceDef, lang: Lang): Scene {
  const T = packText(p, lang)
  const coreTexts = piece.lines.filter(l => l.who !== 'narration').map(l => norm(T(l.text)))
  const extra = sc.lines.filter(l => !coreTexts.some(c => norm(l.text).includes(c) || c.includes(norm(l.text))))
  const lines: Scene['lines'] = []
  let k = 0
  let n = 0
  for (const l of piece.lines) {
    if (l.who === 'narration') continue
    lines.push({ who: l.who, text: T(l.text) })
    // 每隔一句核心台词，插回一句 AI 写的过渡台词
    if (n++ % 2 === 0 && k < extra.length && lines.length < 9) lines.push(extra[k++]!)
  }
  const narr = piece.lines.filter(l => l.who === 'narration').map(l => T(l.text))
  const narration = narr.length && !narr.every(n => norm(sc.narration).includes(norm(n))) ? [sc.narration, ...narr].join(' ') : sc.narration
  return { ...sc, lines, narration }
}

/** 预写选项（本地化成引擎的 Choice）；没有预写返回 null */
export function setPieceChoices(p: Pack, piece: SetPieceDef, lang: Lang): Choice[] | null {
  if (!piece.choices?.length) return null
  const T = packText(p, lang)
  return piece.choices.map(c => ({ text: T(c.text), kind: c.kind, effects: { ...c.effects }, reaction: T(c.reaction), ...(c.promise ? { promise: T(c.promise) } : {}) }))
}

/** 关键场景需要上台的人（引擎据此把这些人放进「可能在场」） */
export function setPieceCast(piece: SetPieceDef): string[] {
  const ids = [piece.who, ...piece.lines.map(l => l.who).filter(w => w !== 'me' && w !== 'narration')]
  return [...new Set(ids)].slice(0, 2)
}

// ---------- 固定块（缓存） ----------

function personLine(p: Pack, id: string, pc: PersonCraft, lang: Lang): string {
  const T = packText(p, lang)
  const parts = [
    pc.quirks?.length ? `tics: ${pc.quirks.map(x => T(x)).join(' / ')}` : '',
    pc.habits?.length ? `habits: ${pc.habits.map(x => T(x)).join(' / ')}` : '',
    pc.contradiction ? `contradiction: ${T(pc.contradiction)}` : '',
    pc.growth ? `growth: ${T(pc.growth)}` : '',
  ].filter(Boolean)
  return parts.length ? `- ${id}: ${parts.join('; ')}` : ''
}

/**
 * 进缓存块的写作手法：通用写法 + 导演片段 + 这个包的人物细节与母题清单 + 路线说明。
 * 每个包固定不变，接在 staticBlock 后面（同一个 cache 块），不随幕变化。
 */
export function craftStatic(p: Pack, lang: Lang): string {
  const T = packText(p, lang)
  const cr = craftOf(p)
  const parts = [CRAFT_CORE, DIRECTOR]
  const people = Object.entries(cr?.people ?? {}).map(([id, pc]) => personLine(p, id, pc, lang)).filter(Boolean)
  if (people.length) parts.push(`[Character texture]\n${people.join('\n')}`)
  if (cr?.motifs?.length) parts.push(`[Motifs — recurring objects; their meaning shifts with the relationship]\n${cr.motifs.map(m => `- ${m.id}: ${T(m.thing)}${m.who ? ` (${m.who})` : ''}${m.payoff ? ` → payoff: ${T(m.payoff)}` : ''}`).join('\n')}`)
  if (cr?.routes) parts.push(`[Routes] Common route until day ${cr.routes.commonUntil}; then one personal route may lock (or the ensemble route). The neglected stay in the world with their own feelings; they never vanish.`)
  return parts.join('\n\n')
}

/** 写结局时的回收清单：她的母题怎么收、已经揭示的真相（一两行，接在 writeEnding 的提示里） */
export function endingCraft(p: Pack, s: Story, who: string | undefined, lang: Lang): string {
  const T = packText(p, lang)
  const cr = craftOf(p)
  if (!cr) return ''
  const ms = (cr.motifs ?? []).filter(m => m.payoff && (!m.who || m.who === who)).slice(0, 3)
  const rv = (cr.reveals ?? []).filter(r => has(s, `reveal:${r.id}`)).slice(0, 2)
  const out = [
    ms.length ? `Pay off these motifs (land the last image on one): ${ms.map(m => `${T(m.thing)} → ${T(m.payoff)}`).join('; ')}` : '',
    rv.length ? `Truths already revealed (may echo): ${rv.map(r => T(r.truth)).join(' / ')}` : '',
  ].filter(Boolean)
  return out.join('\n')
}

// ---------- 主开发线的新功能用到的素材 ----------

/** 她的日记：写日记那次调用的说明（文风、隐瞒、她此刻怎么看「我」） */
export function diaryBrief(p: Pack, s: Story, who: string, lang: Lang): string {
  const T = packText(p, lang)
  const dv = craftOf(p)?.people?.[who]?.diaryVoice
  if (!dv) return ''
  const st = Math.max(0, Math.min(4, s.heroines[who]?.stage ?? 0))
  return `[Her diary voice] ${T(dv.style)}\nShe never writes down: ${T(dv.hides)}\nHow she sees "me" now: ${T(dv.seesMe[st])}`
}

/** 跨周目「既视感」：二周目起（或时间循环第 2 轮起）给一条种子，没有返回 '' */
export function dejaVuFor(p: Pack, s: Story, who: string, lang: Lang): string {
  if (Math.max(s.loop, s.cycle) < 2) return ''
  const seeds = craftOf(p)?.people?.[who]?.dejaVu ?? []
  const x = pickN(s, `deja:${who}`, seeds, 1)[0]
  return x ? `[Déjà vu — she may say something like this once, unexplained] ${packText(p, lang)(x)}` : ''
}

/** 离开后她发来的消息：语气样本（给写消息那次调用） */
export function awayBrief(p: Pack, who: string, lang: Lang, daysAway: number): string {
  const xs = craftOf(p)?.people?.[who]?.awayVoice ?? []
  if (!xs.length) return ''
  const T = packText(p, lang)
  return `[Her message tone — the player has been away ${daysAway} real day(s); write in this voice, short, no guilt-tripping]\n${xs.map(x => `- ${T(x)}`).join('\n')}`
}

/** 幕后八卦素材：当前可用的几条（给八卦功能） */
export function gossipFor(p: Pack, s: Story, lang: Lang, n = 2): string[] {
  const T = packText(p, lang)
  const xs = (craftOf(p)?.gossip ?? []).filter(g => (g.fromDay ?? 1) <= s.day && allAfter(s, g.after))
  return pickN(s, 'gossip', xs, n).map(g => `${speaker(p, g.from, lang)} on ${speaker(p, g.about, lang)} (${g.truth ?? 'half'}): ${T(g.text)}`)
}

// ---------- 校验 ----------

const ID = /^[a-z][a-z0-9_-]{0,31}$/
const KINDS: SceneKind[] = ['daily', 'comedy', 'conflict', 'confession', 'farewell', 'reveal', 'climax']

function isL(x: unknown): boolean {
  if (typeof x === 'string') return x.length > 0
  if (!x || typeof x !== 'object' || Array.isArray(x)) return false
  const vals = Object.entries(x as Record<string, unknown>)
  return vals.length > 0 && vals.every(([k, v]) => (k === 'zh' || k === 'en') && typeof v === 'string')
}
const isLs = (x: unknown) => Array.isArray(x) && x.every(isL)

/**
 * 校验 pack.craft（可选字段；没有 craft 返回 []）。只校验数据形状与 id 引用；
 * 主开发线在 validatePack 末尾调用：`err.push(...validateCraft(raw))`。
 */
export function validateCraft(raw: unknown): string[] {
  if (!raw || typeof raw !== 'object') return []
  const p = raw as Partial<Pack> & { craft?: unknown }
  if (p.craft === undefined) return []
  const err: string[] = []
  const need = (ok: boolean, msg: string) => { if (!ok) err.push(`craft.${msg}`) }
  const c = p.craft as Record<string, unknown>
  if (!c || typeof c !== 'object' || Array.isArray(c)) return ['craft: object']
  const cast = new Set((Array.isArray(p.cast) ? p.cast : []).map(x => x?.id))
  const people = new Set([...cast, ...(Array.isArray(p.npcs) ? p.npcs : []).map(x => x?.id)])
  const places = new Set((Array.isArray(p.places) ? p.places : []).map(x => x?.id))
  const beats = new Set((Array.isArray(p.acts) ? p.acts : []).flatMap(a => (Array.isArray(a?.beats) ? a.beats : []).map(b => b?.id)))
  const endings = new Set((Array.isArray(p.endings) ? p.endings : []).map(e => e?.id))
  const days = typeof p.days === 'number' ? p.days : 60
  const nSlots = Array.isArray(p.slots) ? p.slots.length : 4
  const motifIds = new Set<string>()
  const setIds = new Set<string>()
  const revIds = new Set<string>()
  const stage = (n: unknown) => Number.isInteger(n) && (n as number) >= 0 && (n as number) <= 4

  const motifs = c.motifs as PackCraft['motifs']
  if (motifs !== undefined) {
    if (!Array.isArray(motifs)) need(false, 'motifs: array')
    else for (const [i, m] of motifs.entries()) {
      need(typeof m?.id === 'string' && ID.test(m.id) && !motifIds.has(m.id), `motifs[${i}].id: unique id`)
      motifIds.add(m?.id)
      need(isL(m?.thing), `motifs[${i}].thing: text`)
      need(m?.who === undefined || people.has(m.who), `motifs[${i}].who: known id`)
      need(Array.isArray(m?.meanings) && m.meanings.length > 0 && m.meanings.every(x => stage(x?.stage) && isL(x?.text)), `motifs[${i}].meanings: [{ stage 0..4, text }]`)
      if (m?.payoff !== undefined) need(isL(m.payoff), `motifs[${i}].payoff: text`)
    }
  }

  const sets = c.setPieces as PackCraft['setPieces']
  if (Array.isArray(sets)) for (const x of sets) if (typeof x?.id === 'string') setIds.add(x.id)
  const revs = c.reveals as PackCraft['reveals']
  if (Array.isArray(revs)) for (const x of revs) if (typeof x?.id === 'string') revIds.add(x.id)
  const knownFlag = (f: unknown) => typeof f === 'string' && (
    (f.startsWith('beat:') && beats.has(f.slice(5))) || f.startsWith('inc:')
    || (f.startsWith('set:') && setIds.has(f.slice(4))) || (f.startsWith('reveal:') && revIds.has(f.slice(7))))
  const flagsOk = (x: unknown) => x === undefined || (Array.isArray(x) && x.every(knownFlag))

  if (sets !== undefined) {
    if (!Array.isArray(sets)) need(false, 'setPieces: array')
    else {
      const seen = new Set<string>()
      for (const [i, x] of sets.entries()) {
        const at = `setPieces[${i}]`
        need(typeof x?.id === 'string' && ID.test(x.id) && !seen.has(x.id), `${at}.id: unique id`)
        seen.add(x?.id)
        need(cast.has(x?.who), `${at}.who: a cast id`)
        need(isL(x?.title) && isL(x?.staging), `${at}: title, staging`)
        need(KINDS.includes(x?.kind), `${at}.kind: ${KINDS.join(' | ')}`)
        const t = (x?.trigger ?? null) as SetPieceDef['trigger'] | null
        need(!!t && typeof t === 'object', `${at}.trigger: object`)
        if (t) {
          if (t.beat !== undefined) need(beats.has(t.beat), `${at}.trigger.beat: known beat id`)
          if (t.minStage !== undefined) need(stage(t.minStage), `${at}.trigger.minStage: 0..4`)
          if (t.places !== undefined) need(Array.isArray(t.places) && t.places.every(id => places.has(id)), `${at}.trigger.places: known place ids`)
          if (t.slots !== undefined) need(Array.isArray(t.slots) && t.slots.every(s => Number.isInteger(s) && s >= 0 && s < nSlots), `${at}.trigger.slots: slot indexes`)
          if (t.days !== undefined) need(Array.isArray(t.days) && t.days.length === 2 && t.days[0] >= 1 && t.days[0] <= t.days[1] && t.days[1] <= days, `${at}.trigger.days: [from, to]`)
          need(flagsOk(t.after), `${at}.trigger.after: 'beat:'/'inc:'/'set:'/'reveal:' flags`)
          if (t.route !== undefined) need(cast.has(t.route) || t.route === 'ensemble', `${at}.trigger.route: cast id or ensemble`)
        }
        need(Array.isArray(x?.lines) && x.lines.length >= 2 && x.lines.length <= 10 && x.lines.every(l => (people.has(l?.who) || l?.who === 'me' || l?.who === 'narration') && isL(l?.text)), `${at}.lines: 2..10 { who, text }`)
        if (x?.unsaid !== undefined) need(isL(x.unsaid), `${at}.unsaid: text`)
        if (x?.motif !== undefined) need(motifIds.has(x.motif), `${at}.motif: known motif id`)
        if (x?.choices !== undefined) need(Array.isArray(x.choices) && x.choices.length === 3 && x.choices.every(ch => isL(ch?.text) && isL(ch?.reaction) && ['reply', 'observe', 'promise'].includes(ch?.kind)
          && !!ch?.effects && typeof ch.effects === 'object' && Object.entries(ch.effects).every(([k, v]) => cast.has(k) && typeof v === 'number' && v >= -2 && v <= 2)
          && (ch.kind !== 'promise' || isL(ch.promise))), `${at}.choices: exactly 3 { text, kind, effects, reaction, promise? }`)
      }
    }
  }

  const r = c.routes as PackCraft['routes']
  if (r !== undefined) {
    need(!!r && Number.isInteger(r.commonUntil) && r.commonUntil >= 1 && r.commonUntil < days, 'routes.commonUntil: 1..days-1')
    need(isL(r?.commonGoal), 'routes.commonGoal: text')
    need(!!r?.lock && stage(r.lock.minStage) && typeof r.lock.minAffection === 'number' && (r.lock.margin === undefined || typeof r.lock.margin === 'number'), 'routes.lock: { minStage, minAffection, margin? }')
    need(Array.isArray(r?.branches) && r.branches.every(b => cast.has(b?.who) && isL(b?.goal) && isL(b?.others)), 'routes.branches: [{ who: cast id, goal, others }]')
    if (r?.ensemble !== undefined) need(isL(r.ensemble), 'routes.ensemble: text')
    if (r?.truth !== undefined) need(Array.isArray(r.truth.needEndings) && r.truth.needEndings.every(e => endings.has(e)) && isL(r.truth.text) && (r.truth.who === undefined || cast.has(r.truth.who)), 'routes.truth: { needEndings: ending ids, who?, text }')
  }

  const tx = c.texture as PackCraft['texture']
  if (tx !== undefined) {
    need(!!tx && typeof tx === 'object', 'texture: object')
    if (tx?.days !== undefined) need(Array.isArray(tx.days) && tx.days.every(d => Number.isInteger(d?.day) && d.day >= 1 && d.day <= days && isLs(d.bits) && (d.weather === undefined || isL(d.weather))), 'texture.days: [{ day, weather?, bits }]')
    if (tx?.places !== undefined) need(!!tx.places && typeof tx.places === 'object' && Object.entries(tx.places).every(([k, v]) => places.has(k) && isLs(v)), 'texture.places: { placeId: [text] }')
    if (tx?.any !== undefined) need(isLs(tx.any), 'texture.any: [text]')
  }

  const fbs = c.flashbacks as PackCraft['flashbacks']
  if (fbs !== undefined) {
    if (!Array.isArray(fbs)) need(false, 'flashbacks: array')
    else for (const [i, f] of fbs.entries()) {
      need(typeof f?.id === 'string' && ID.test(f.id), `flashbacks[${i}].id: id`)
      need(people.has(f?.who) || f?.who === 'me', `flashbacks[${i}].who: known id or me`)
      need(isL(f?.text) && !!f?.trigger && typeof f.trigger === 'object', `flashbacks[${i}]: text, trigger`)
      if (f?.trigger?.minStage !== undefined) need(stage(f.trigger.minStage), `flashbacks[${i}].trigger.minStage: 0..4`)
      if (f?.trigger?.motif !== undefined) need(motifIds.has(f.trigger.motif), `flashbacks[${i}].trigger.motif: known motif`)
      need(flagsOk(f?.trigger?.after), `flashbacks[${i}].trigger.after: known flags`)
    }
  }

  if (revs !== undefined) {
    if (!Array.isArray(revs)) need(false, 'reveals: array')
    else for (const [i, x] of revs.entries()) {
      need(typeof x?.id === 'string' && ID.test(x.id), `reveals[${i}].id: id`)
      need(isL(x?.truth) && isLs(x?.reframes) && x.reframes.length > 0, `reveals[${i}]: truth, reframes`)
      const w = x?.when
      need(!!w && typeof w === 'object', `reveals[${i}].when: object`)
      if (w) {
        need(flagsOk(w.after), `reveals[${i}].when.after: known flags`)
        if (w.who !== undefined) need(cast.has(w.who), `reveals[${i}].when.who: cast id`)
        if (w.minStage !== undefined) need(stage(w.minStage), `reveals[${i}].when.minStage: 0..4`)
        if (w.needEndings !== undefined) need(Array.isArray(w.needEndings) && w.needEndings.every(e => endings.has(e)), `reveals[${i}].when.needEndings: ending ids`)
      }
    }
  }

  const ppl = c.people as PackCraft['people']
  if (ppl !== undefined) {
    if (!ppl || typeof ppl !== 'object' || Array.isArray(ppl)) need(false, 'people: { id: {...} }')
    else for (const [id, pc] of Object.entries(ppl)) {
      const at = `people.${id}`
      need(people.has(id), `${at}: known cast or npc id`)
      for (const k of ['quirks', 'habits', 'dejaVu', 'awayVoice'] as const) if (pc?.[k] !== undefined) need(isLs(pc[k]), `${at}.${k}: [text]`)
      for (const k of ['contradiction', 'growth'] as const) if (pc?.[k] !== undefined) need(isL(pc[k]), `${at}.${k}: text`)
      if (pc?.diaryVoice !== undefined) need(isL(pc.diaryVoice?.style) && isL(pc.diaryVoice?.hides) && Array.isArray(pc.diaryVoice?.seesMe) && pc.diaryVoice.seesMe.length === 5 && isLs(pc.diaryVoice.seesMe), `${at}.diaryVoice: { style, hides, seesMe: 5 texts }`)
    }
  }

  const gags = c.gags as PackCraft['gags']
  if (gags !== undefined) need(Array.isArray(gags) && gags.every(g => typeof g?.id === 'string' && ID.test(g.id) && Array.isArray(g.who) && g.who.length > 0 && g.who.every(id => people.has(id)) && isL(g.text) && (g.places === undefined || (Array.isArray(g.places) && g.places.every(x => places.has(x))))), 'gags: [{ id, who: known ids, text, places? }]')

  const gos = c.gossip as PackCraft['gossip']
  if (gos !== undefined) need(Array.isArray(gos) && gos.every(g => typeof g?.id === 'string' && ID.test(g.id) && (people.has(g.from)) && (people.has(g.about) || g.about === 'me') && isL(g.text)
    && (g.truth === undefined || ['true', 'half', 'false'].includes(g.truth)) && (g.fromDay === undefined || (Number.isInteger(g.fromDay) && g.fromDay >= 1 && g.fromDay <= days)) && flagsOk(g.after)), 'gossip: [{ id, from, about, text, truth?, fromDay?, after? }]')
  return err
}
