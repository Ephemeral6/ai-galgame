// 状态契约与剧本包格式。引擎不写死任何人物：人物、地点、日程、结局都来自剧本包（Pack）。

// ---------- 语言 ----------
export type Lang = 'zh' | 'en'
/** 可本地化文本：一个字符串（包的默认语言），或按语言分开写；缺失时回落到包的默认语言。 */
export type L = string | { zh?: string; en?: string }

// ---------- 剧本包 ----------
/** 像素立绘：14 列宽、最多 12 行的字母图；'.' 透明。字母在 pal 里取色（#rrggbb）。 */
export type SpriteDef = {
  pal: Record<string, string>
  art: string[]
  /** 两只眼睛的位置 [行, 列]，表情由引擎画在这里 */
  eyes: [number, number][]
  /** 脸颊（害羞时变红） */
  cheeks: [number, number][]
  /** 各自的小动作：摇尾巴 / 扑翅膀 / 抖耳朵 / 只上下起伏 */
  motion: 'tail' | 'wings' | 'ears' | 'bob'
}

export type CastDef = {
  id: string
  name: L
  short: L
  /** 主色（#rrggbb）：名字、边框、心形都用它 */
  color: string
  /** 外形（像素小动物的描述，给 AI 看） */
  look: L
  /** 说话方式 */
  voice: L
  /** 示例台词 */
  samples: L[]
  /** 秘密：阶段 3（下标）之前不许直接说出来 */
  secret: L
  /** 5 阶段节拍，与 pack.stages 一一对应 */
  arc: [L, L, L, L, L]
  /** 各时段（slot 下标）常去的地点 id */
  haunts: Record<number, string[]>
  /** 截止日：约定的期限不会晚于这一天 */
  deadline: { day: number; text: L }
  /** 信物灵感：AI 画信物时参考 */
  keepsakeIdeas?: L
  /** 一行摘要：她不在这一幕时，提示里只放这一行（不填就用 look） */
  tagline?: L
  /** 不是恋爱对象（默认 true 是恋爱线）：false 时 AI 提示写明不写恋爱、暧昧，「好感」按 meter 的意思理解 */
  romance?: boolean
  /** 关系值怎么显示：label 是含义（如「信任」「看穿」），full / empty 是满格、空格的单个字符（默认 ♥ ♡） */
  meter?: { label: L; full?: string; empty?: string }
  sprite: SpriteDef
}

/** 配角：不可攻略，没有好感与阶段；AI 可以让他们出场推动剧情 */
export type NpcDef = {
  id: string
  name: L
  short?: L
  /** 主色（#rrggbb）：名字颜色 */
  color: string
  /** 身份，以及与主角、主角色的关系（一两句；也是不在场时的一行摘要） */
  role: L
  /** 说话方式 */
  voice: L
  /** 示例台词 */
  samples: L[]
  /** 外形（有立绘时给 AI 看） */
  look?: L
  /** 常出没的地点：时段下标 → 地点 id；玩家去那里时会写进提示 */
  haunts?: Record<number, string[]>
  /** 可选的像素立绘（同一套字母图格式）；有立绘才会上台 */
  sprite?: SpriteDef
}

/** 人物之间的关系：a、b 是主角色或配角的 id，也可以是 'me' */
export type RelationDef = {
  a: string
  b: string
  /** 关系类型：旧友、情敌、兄妹、误会…… */
  kind: L
  /** 具体说明：发生过什么、现在卡在哪 */
  text: L
  /** a 或 b（主角色）到达这个阶段之前，AI 只能暗示、不能挑明 */
  hiddenUntil?: number
}

/** 章节关键事件：从 day 起，相关的人在场时引擎要求 AI 写到；到 by 那天最后一个时段不论谁在场都写 */
export type BeatDef = {
  id: string
  day: number
  /** 最晚哪天（默认 day + 1） */
  by?: number
  /** 涉及谁（主角色或配角）；不填表示任何一幕都行 */
  who?: string[]
  /** 事件类型：转折、误会、秘密曝光…… */
  kind?: L
  /** 必须发生的事 */
  text: L
  /** 关键约定：这一幕要给出一个这样的「答应」选项；结局可以用 keptKey 要求兑现它 */
  promise?: L
}

/** 一幕（开端、转折、高潮……）：走向、关键事件、结束时的悬念钩子 */
export type ActDef = {
  id: string
  title: L
  /** 从第几天开始，按升序 */
  from: number
  /** 这一幕的走向 */
  goal: L
  beats: BeatDef[]
  /** 这一幕结束、进入下一幕时给玩家看的悬念 */
  hook?: L
}

/** 随机或条件事件：每个时段最多一个；用每局的随机种子掷，回退、读档结果不变 */
export type IncidentDef = {
  id: string
  /** 发生了什么（给玩家看，也写进提示） */
  text: L
  /** 符合条件的时段触发概率 0..1，默认 0.25 */
  chance?: number
  /** 天数范围 [起, 止] */
  days?: [number, number]
  /** 只在这些时段 */
  slots?: number[]
  /** 只在去这些地点时发生（不填：整个时段，日程页会显示） */
  places?: string[]
  /** 会带出谁（主角色或配角） */
  who?: string[]
  /** 条件：某个主角色到达阶段 / 好感 */
  need?: { who: string; minStage?: number; minAffection?: number }
  /** 条件：先发生过这些（'beat:<id>' 或 'inc:<id>'） */
  after?: string[]
  /** 可以在一局里重复发生（默认只发生一次） */
  repeat?: boolean
}

export type PlaceDef = { id: string; name: L; mood: L; slots: number[] }

/** 固定事件：某天某时段只能去这里 */
export type FixedEvent = { day: number; slot: number; place: L; mood: L; title: L; cast: string[] }

/** 结局条件：先比 tier（高者优先），同 tier 比关联角色好感；没有条件的是兜底结局 */
export type EndingDef = {
  id: string
  title: L
  tier: number
  /** 关联角色；不填表示群像/普通结局 */
  who?: string
  minStage?: number
  minAffection?: number
  /** 和她之间最多允许几个没兑现的约定 */
  maxBroken?: number
  /** 至少兑现几个和她的约定 */
  minKept?: number
  /** 至少拿到她几个信物 */
  minKeepsakes?: number
  /** 至少第几周目（2 = 通关后再来才可能达成） */
  minLoop?: number
  /** 好感不超过（坏结局用） */
  maxAffection?: number
  /** 至少失约几次（坏结局用） */
  minBroken?: number
  /** 必须兑现在这个关键事件（beat id）里对她许下的关键约定 */
  keptKey?: string
  /** 必须发生过（'beat:<id>' 或 'inc:<id>'） */
  flags?: string[]
  /** 相册里显示的类别 */
  kind?: 'true' | 'good' | 'normal' | 'bad'
  /** 给 AI 的结局走向说明 */
  brief: L
}

/** 非原创内容的出处说明：作者授权的作品必须写清 */
export type PackSource = {
  work: L
  author: L
  /** 授权方式：如「作者书面授权」「CC BY 4.0」 */
  license: L
  /** 做了哪些改编 */
  adaptation: L
  /** 原作链接或许可链接 */
  url?: string
  /** 必须随包显示的署名文字（许可要求时） */
  notice?: L
}

/** 引擎提供的可选玩法 */
export type PackFeatures = {
  /** 时间循环：到最后一天仍未达成任何 tier ≥ minTier 的结局，就回到第 1 天；伏笔簿与事实表保留（「记得上一轮」），好感清零 */
  timeLoop?: { maxLoops: number; minTier: number; text: L }
  /** 打破第四面墙：把玩家的回退、读档次数告诉 AI，角色可以察觉 */
  fourthWall?: boolean
}

export type Pack = {
  id: string
  version: string
  defaultLang: Lang
  /** 包提供了完整文本的语言 */
  langs: Lang[]
  title: L
  subtitle: L
  /** 包作者 */
  author: string
  /** 原创写 'original'；否则写出处与授权 */
  source: 'original' | PackSource
  /** 原创致敬包：说明致敬的题材类型（不点名具体作品） */
  notes?: L
  features?: PackFeatures
  /** 前提：第一人称是谁、在哪、什么时候 */
  premise: L
  /** 文风要求与禁忌 */
  style: L
  /** 主角在台词里的显示名（如「我」/「Me」） */
  me: L
  days: number
  slots: L[]
  /** 日期显示模板，{n} 替换为天数，如「第 {n} 天」「Day {n}」 */
  dayLabel: L
  /** 章节：从某天起的章节名，按 from 升序（写了 acts 可以省略，标题取 acts） */
  chapters?: { from: number; title: L }[]
  places: PlaceDef[]
  /** 可攻略的主角色（1..6） */
  cast: CastDef[]
  /** 配角（0..8） */
  npcs?: NpcDef[]
  /** 人物关系 */
  relations?: RelationDef[]
  /** 剧情主线：分幕与关键事件 */
  acts?: ActDef[]
  /** 随机 / 条件事件 */
  incidents?: IncidentDef[]
  /** 5 个阶段名 */
  stages: [L, L, L, L, L]
  /** 阶段门槛：好感 ≥ affection 且单独相处 ≥ scenes 幕；下标 0 为起点 */
  gates: { affection: number; scenes: number }[]
  /** 日历事件 */
  events: { day: number; text: L }[]
  fixed: FixedEvent[]
  /** 冷落几天后她会主动来找你；0 表示不启用 */
  proactiveAfter: number
  endings: EndingDef[]
  /** 结局最后一句的点题要求 */
  finale: L
  /** 生成中的氛围句 */
  loading: L[]
}

// ---------- 运行状态 ----------
export type Line = { who: string; text: string }
export type Actor = { id: string; expression: string }
export type Choice = {
  text: string
  kind: 'reply' | 'observe' | 'promise'
  effects: Record<string, number>
  promise?: string
  reaction?: string
}
export type Scene = {
  title: string
  place: string
  cast: Actor[]
  distance: 'near' | 'far'
  narration: string
  lines: Line[]
  choices: Choice[]
  summary: string
  callback?: string
  fact?: string
  proactive?: boolean
  /** 引擎要求这一幕写到的关键事件 id */
  beat?: string
  /** 这一幕带上的随机事件 id */
  incident?: string
}
export type HState = { affection: number; stage: number; scenes: number; mood: string; lastDay: number }
export type Promise_ = { text: string; heroine: string; day: number; due: number; status: 'open' | 'kept' | 'broken'; made?: string; /** 关键约定：对应的 beat id */ key?: string }
export type Note = { day: number; heroine: string; text: string; used: boolean }
export type Keepsake = { pack: string; day: number; heroine: string; title: string; desc: string; art: string[]; palette: Record<string, number> }
export type Moment = { day: number; slot: number; heroine: string; text: string }
export type Phase = 'title' | 'plan' | 'loading' | 'scene' | 'after' | 'ending'
export type Usage = { writer: number; checker: number; input: number; output: number; cacheRead: number; cacheWrite: number }
export type Story = {
  pack: string
  lang: Lang
  /** 第几周目（通关后再来） */
  loop: number
  /** 时间循环包里的第几轮 */
  cycle: number
  /** 玩家的回退、读档次数（打破第四面墙的包会用到） */
  rewinds: number
  loads: number
  phase: Phase
  day: number
  slot: number
  heroines: Record<string, HState>
  promises: Promise_[]
  notes: Note[]
  facts: string[]
  keepsakes: Keepsake[]
  album: Moment[]
  scene: Scene | null
  after: string
  reveal: number
  loadingText: string
  ending: string
  endingId: string
  error: string
  usage: Usage
  /** 存档格式版本（2 起有） */
  v: number
  /** 这一局随机事件的种子 */
  seed: number
  /** 已发生的关键事件与随机事件：'beat:<id>'、'inc:<id>' */
  flags: string[]
  /** 当前时段掷出的随机事件 id（'' 表示没有） */
  incident: string
}

export type View = 'game' | 'album' | 'saves' | 'settings' | 'help' | 'packs'
export type UiState = { view: View; tab: number; saveMode: 'save' | 'load'; back: View }
export type GalSettings = { lang: Lang; anim: boolean; pageMode: 'line' | 'page'; pack: string }
export type PackMeta = { endings: string[]; clears: number; keepsakes: Keepsake[] }
export type Meta = Record<string, PackMeta>
/** 标题页可选的剧本包：内置、目录里的、导入的 */
export type PackEntry = { id: string; origin: 'builtin' | 'folder' | 'imported'; pack: Pack }

declare module 'claude-code' {
  interface PluginState {
    'ai-galgame': { story: Story; undo: string[]; ui: UiState; settings: GalSettings; meta: Meta; packs: PackEntry[] }
  }
}
