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
  sprite: SpriteDef
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
  /** 章节：从某天起的章节名，按 from 升序 */
  chapters: { from: number; title: L }[]
  places: PlaceDef[]
  cast: CastDef[]
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
}
export type HState = { affection: number; stage: number; scenes: number; mood: string; lastDay: number }
export type Promise_ = { text: string; heroine: string; day: number; due: number; status: 'open' | 'kept' | 'broken'; made?: string }
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
