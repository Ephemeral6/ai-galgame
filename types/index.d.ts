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
  /** 只在这些时段发生（不填：任何时段） */
  slots?: number[]
  /** 只在这些地点发生（不填：任何地点）。到了最后机会（by 那天的最后一个可用时段），日程会把玩家带到第一个地点 */
  places?: string[]
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
  /** 关联角色；不填表示群像/普通结局（约定条件按所有人合计；同 tier 平局时群像结局优先） */
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
  /** 写作手法层：母题、预写关键场景、路线、揭示、日常细节、人物细节（全部可选） */
  craft?: PackCraft
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

// ---------- 写作手法层（craft，全部可选；设计见 docs/NARRATIVE-CRAFT.md） ----------
/** 母题：反复出现的物件或意象；同一个东西在不同关系阶段代表不同的意思 */
export type MotifDef = {
  id: string
  /** 物件或意象本身（一个短名词） */
  thing: L
  /** 属于谁（主角色或配角 id）；不填是全剧母题 */
  who?: string
  /** 意义随阶段变化：stage 是 0..4，从这一阶段起它代表 text（按 stage 升序） */
  meanings: { stage: number; text: L }[]
  /** 最终怎么回收（关键场景、结局里落在它上面） */
  payoff?: L
}

/** 预写关键场景里的一句台词。who 是主角色 / 配角 id、'me' 或 'narration'（旁白） */
export type SetPieceLine = { who: string; text: L }

/** 预写关键场景的选项（可选；不写就由 AI 按 FORMAT 写三个选项） */
export type SetPieceChoice = {
  text: L
  kind: 'reply' | 'observe' | 'promise'
  effects: Record<string, number>
  reaction: L
  promise?: L
}

/**
 * 预写关键场景：人写核心台词、调度和留白，AI 只补核心台词之间的衔接。
 * 高潮、告白、离别这些最容易被 AI 写平的幕，由它保底。
 */
export type SetPieceDef = {
  id: string
  /** 这一幕的主角色 */
  who: string
  title: L
  /** 场景类型，决定配哪一条写作片段 */
  kind: SceneKind
  /**
   * 触发条件（全部满足才触发；每局只触发一次）。
   * beat：这个关键事件到期的那一幕由本场景接管；minStage：主角色到达这个阶段；
   * places / slots / days：只在这些地点、时段、天数；after：先发生过（'beat:<id>' / 'inc:<id>' / 'set:<id>' / 'reveal:<id>'）；
   * route：只在锁定了这条个人线之后；alone：只在单独相处时
   */
  trigger: {
    beat?: string
    minStage?: number
    places?: string[]
    slots?: number[]
    days?: [number, number]
    after?: string[]
    route?: string
    alone?: boolean
  }
  /** 调度：环境、光线、物件、谁在哪、谁先开口（给 AI 的导演说明） */
  staging: L
  /** 人写的核心台词，按出现顺序。AI 必须逐字保留，只能在它们之间加衔接的动作、旁白和不超过两句的过渡台词 */
  lines: SetPieceLine[]
  /** 这一幕绝不说出口的话（留白）：让人物绕着它走 */
  unsaid?: L
  /** 回收哪个母题（MotifDef.id） */
  motif?: string
  /** 预写选项；不写由 AI 写 */
  choices?: SetPieceChoice[]
}

/** 场景类型：写作指南按它挑片段 */
export type SceneKind = 'daily' | 'comedy' | 'conflict' | 'confession' | 'farewell' | 'reveal' | 'climax'

/** 共通线 → 个人线：分叉与锁定 */
export type RouteDef = {
  /** 共通线到第几天结束（含这一天）；之后进入个人线 */
  commonUntil: number
  /** 共通线的写法：群像为主、每人都要露面、只埋伏笔不揭底 */
  commonGoal: L
  /**
   * 锁定条件：共通线结束那天过完时，阶段 ≥ minStage、好感 ≥ minAffection，且比第二名至少高 margin 的那个人锁定为个人线；
   * 没有人满足就走「群像线」（不锁定）。
   */
  lock: { minStage: number; minAffection: number; margin?: number }
  /** 每条个人线的走向，以及被冷落的人怎么继续存在（不消失，但退到背景、带着情绪） */
  branches: { who: string; goal: L; others: L }[]
  /** 不锁定时（群像线）的走向 */
  ensemble?: L
  /** 真相路线：看过这些结局（任一周目）后才开放；揭示由 reveals 里 minLoop / needEndings 的条目承担 */
  truth?: { needEndings: string[]; who?: string; text: L }
}

/** 日常质感库：天气、食物、小事；每幕只抽一两条，不要全用 */
export type TextureDef = {
  /** 按天：天气和当天的小事 */
  days?: { day: number; weather?: L; bits: L[] }[]
  /** 按地点 id 的细节 */
  places?: Record<string, L[]>
  /** 任何时候都能用的细节 */
  any?: L[]
}

/** 闪回：一小段过去的画面，在条件满足时插进一幕（一两句，像突然想起） */
export type FlashbackDef = {
  id: string
  /** 谁的过去（主角色 / 配角 id，或 'me'） */
  who: string
  /** 触发：主角色到达阶段 / 母题在场 / 先发生过 */
  trigger: { minStage?: number; motif?: string; after?: string[] }
  text: L
}

/** 揭示：在某个条件之后公开的真相，会改变前文的意义（重读时意义翻转） */
export type RevealDef = {
  id: string
  /** 触发条件（全部满足）：先发生过 / 某人到达阶段 / 第几周目 / 看过这些结局 */
  when: { after?: string[]; who?: string; minStage?: number; minLoop?: number; needEndings?: string[] }
  /** 真相本身（给 AI 写的那一幕用；台词要克制） */
  truth: L
  /** 前文里哪些细节因此换了意思：AI 在揭示后的幕里点回其中一条 */
  reframes: L[]
}

/** 她的日记（主开发线的「她的视角」功能用） */
export type DiaryVoice = {
  /** 文风：句子长短、记什么不记什么、用什么符号 */
  style: L
  /** 日记里也不写的事（她连自己都瞒着的） */
  hides: L
  /** 各阶段她心里怎么看「我」：与 pack.stages 一一对应 */
  seesMe: [L, L, L, L, L]
}

/** 人物塑造的细节：主角色和配角都可以写 */
export type PersonCraft = {
  /** 口癖：反复出现的说法 */
  quirks?: L[]
  /** 行为习惯：手上在做什么，紧张、说谎、开心时的小动作 */
  habits?: L[]
  /** 矛盾点：嘴上和心里、想要和害怕之间的拉扯 */
  contradiction?: L
  /** 成长弧：从哪里到哪里（只写方向，不写结果） */
  growth?: L
  /** 她写日记的口吻（主角色） */
  diaryVoice?: DiaryVoice
  /** 跨周目「既视感」台词种子：二周目起她偶尔说出的、像记得什么的话 */
  dejaVu?: L[]
  /** 玩家离开一段时间后她发来消息的语气样本 */
  awayVoice?: L[]
}

/** 群像搞笑小段：几个配角（或配角 + 主角色）之间的固定笑料，给日常幕调味 */
export type GagDef = {
  id: string
  /** 参与的人（至少一人在场才用） */
  who: string[]
  text: L
  /** 只在这些地点 */
  places?: string[]
}

/** 配角之间的八卦素材（幕后八卦功能用）：谁在说谁，说的是真是假 */
export type GossipDef = {
  id: string
  /** 说的人 */
  from: string
  /** 被说的人 */
  about: string
  text: L
  /** 是真话、半真、还是误会（AI 写八卦时据此决定语气） */
  truth?: 'true' | 'half' | 'false'
  /** 从第几天起能说 */
  fromDay?: number
  /** 先发生过 */
  after?: string[]
}

export type PackCraft = {
  motifs?: MotifDef[]
  setPieces?: SetPieceDef[]
  routes?: RouteDef
  texture?: TextureDef
  flashbacks?: FlashbackDef[]
  reveals?: RevealDef[]
  /** 人物塑造：主角色或配角 id → 细节 */
  people?: Record<string, PersonCraft>
  gags?: GagDef[]
  gossip?: GossipDef[]
}

/** 合并进 types 之前，内置包用 `Pack & CraftFields` 声明 */
export type CraftFields = { craft?: PackCraft }

// ---------- 运行状态 ----------
export type Line = { who: string; text: string }
export type Actor = { id: string; expression: string }
/** 这一幕的氛围：AI 每幕给出，引擎据此选主题色和氛围带粒子 */
export type Atmo = {
  weather?: 'clear' | 'rain' | 'snow' | 'fog' | 'storm' | 'wind'
  time?: 'dawn' | 'day' | 'dusk' | 'night'
  /** 氛围带粒子 */
  fx?: 'rain' | 'snow' | 'fireflies' | 'cicadas' | 'lanterns' | 'meteors' | 'mist' | 'stars' | 'none'
  mood?: string
}
/** 演出指令：第 at 句（0 = 旁白）出现时，who 做这件事 */
export type StageCue = {
  at: number
  who: string
  emote?: '!' | '?' | 'note' | '...' | 'anger' | 'sweat' | 'heart'
  move?: 'enter' | 'exit' | 'approach' | 'turn' | 'face'
}
/** 镜头：特写哪个物件、第几句后留白 */
export type Camera = { focus?: string; pause?: number }
/** 选项透露的态度，用来总结「你在她眼里」 */
export type Tone = 'honest' | 'evasive' | 'joking' | 'committed' | 'caring' | 'bold'
/** keep：履行一个还开着的约定（她在场时才会出现；选了才算兑现） */
export type Choice = {
  text: string
  kind: 'reply' | 'observe' | 'promise' | 'keep'
  tone?: Tone
  effects: Record<string, number>
  promise?: string
  /** keep：兑现的是对谁的约定（主角色 id） */
  keeps?: string
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
  /** 顺带补上的、已经过期的关键事件 id */
  also?: string
  /** 这一幕带上的随机事件 id */
  incident?: string
  atmo?: Atmo
  cues?: StageCue[]
  camera?: Camera
  /** 这一幕的类型（写作手法层判定；笑泪交替用） */
  kind?: SceneKind
  /** 写作手法层要并进 Story.flags 的标记（预写场景、揭示、闪回、笑料） */
  craftFlags?: string[]
}
export type HState = { affection: number; stage: number; scenes: number; mood: string; lastDay: number }
export type Promise_ = { text: string; heroine: string; day: number; due: number; status: 'open' | 'kept' | 'broken'; made?: string; /** 关键约定：对应的 beat id */ key?: string }
export type Note = { day: number; heroine: string; text: string; used: boolean }
export type Keepsake = { pack: string; day: number; heroine: string; title: string; desc: string; art: string[]; palette: Record<string, number> }
export type Moment = { day: number; slot: number; heroine: string; text: string }
export type Phase = 'title' | 'plan' | 'loading' | 'scene' | 'after' | 'ending'
export type Usage = {
  writer: number; checker: number; input: number; output: number; cacheRead: number; cacheWrite: number
  /** 自动游玩的决策调用（Haiku，不走设定集缓存块），单独计数 */
  pilot?: number; pilotIn?: number; pilotOut?: number
  /** AI 原生机制的额外调用（Haiku：消息、八卦、日记、画像） */
  extra?: number; extraIn?: number; extraOut?: number
  /** 估算花费（美元） */
  cost?: number
}
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
  /** 上一次选择带来的好感变化（关系网上闪一下） */
  deltas: Record<string, number>
  /** 我的选择倾向：每种态度选过几次（「你在她眼里」） */
  profile: Partial<Record<Tone, number>>
  /** 二周目起：上一局留下的回声（相册摘要），角色会隐约「记得」 */
  echoes: string[]
  /** 每天结束时小镇里发生的事（配角之间的八卦、幕后） */
  gossip: { day: number; text: string }[]
  /** 你离开很久后她发来的消息 */
  letter: { from: string; text: string } | null
  /** 她的日记 / 视角（打开时才生成，之后缓存）：key 为 `${heroine}:${day}` */
  diary: Record<string, string>
  /** 「你在她眼里」（打开时才生成，缓存）：heroine → 一段话 */
  portrait: Record<string, string>
  /** 现实里写代码的事件（只有类型），下一幕提到后清空 */
  world: string[]
  /** 每日挑战的日期（不是挑战局为 ''） */
  daily: string
  /** 关键台词（每幕一句，导出整局时用） */
  quotes: { day: number; who: string; text: string }[]  /** 上一幕的类型（笑泪交替用） */
  lastKind?: SceneKind
}

export type View = 'game' | 'album' | 'saves' | 'settings' | 'help' | 'packs' | 'graph' | 'feats'
export type UiState = { view: View; tab: number; saveMode: 'save' | 'load'; back: View; pick?: string }
/** 成就、统计、今日花费、每日挑战（跨会话，存在 $.store） */
export type Feats = {
  achievements: string[]
  stats: { clears: number; scenes: number; cost: number }
  /** 今日花费（每日预算用） */
  today: { date: string; usd: number }
  /** 每日挑战：日期 → 结果 */
  daily: Record<string, { pack: string; ending: string; kind: string }>
}
/** 边等边玩与陪伴模式的运行状态（会话内） */
export type WorkState = {
  /** Claude 正在干活 */
  busy: boolean
  /** 面板上的提示：趁现在玩一幕 / 写完了 / 在等你批准 */
  notice: '' | 'busy' | 'done' | 'permission'
  /** 连续工作从什么时候开始（毫秒） */
  since: number
  /** 上一次 Claude 回合的时间 */
  lastTurn: number
  /** 陪伴模式最近说话的时间点 */
  said: number[]
  /** 陪伴模式最近一句 */
  line: string
}
/** 自动游玩的策略：专一 / 随心 / 收集 / 混乱（随机、不调用模型） */
export type AutoStrategy = 'focus' | 'whim' | 'collect' | 'chaos' | 'self'
export type AutoSpeed = 'slow' | 'mid' | 'fast'
export type GalSettings = {
  lang: Lang; anim: boolean; pageMode: 'line' | 'page'; pack: string
  autoStrategy?: AutoStrategy
  autoSpeed?: AutoSpeed
  /** 自动模式连跑几幕后暂停；0 表示跑到当天结束 */
  autoLimit?: number
  /** 专一策略锁定的角色 id；'' 表示开局时问 AI 想追谁 */
  autoTarget?: string
  /** 像素小镇地图 */
  map?: boolean
  /** AI 原生机制逐项开关：echoes / letters / gossip / diary / portrait / letItBe */
  extras?: Partial<Record<string, boolean>>
  /** 边等边玩：Claude 干活时提示、干完或等批准时暂停 */
  watch?: boolean
  /** 写代码的事件进入剧情（默认关） */
  workEvents?: boolean
  /** 写剧情用的模型：sonnet（默认）或 haiku（省额度） */
  writer?: 'sonnet' | 'haiku'
  /** 每日预算（美元，0 = 不限） */
  budget?: number
  /** 短幕：旁白 1–2 句、台词 2–4 句 */
  short?: boolean
  /** 陪伴模式：常驻状态栏的角色 id，'' 关闭 */
  companion?: string
  /** 朗读台词 */
  voice?: boolean
  /** 音效 */
  sfx?: boolean
  /** 排版：auto 按宽度自动、compact 紧凑、full 完整 */
  layout?: 'auto' | 'compact' | 'full'
  /** 配色：default 或 cb（色盲友好） */
  palette?: 'default' | 'cb'
  /** 终端底色：auto 按 /config 的主题推，读不到按深色；dark / light 手动指定 */
  bg?: 'auto' | 'dark' | 'light'
}
/** 自动游玩的运行状态（会话内） */
export type AutoState = {
  on: boolean
  /** 本次开启后跑了几幕 */
  scenes: number
  /** 开启时是第几天（「跑到当天结束」用） */
  startDay: number
  /** 专一策略这次追的人 */
  target: string
  /** 最近一次决策：「→ 选 2：理由」 */
  reason: string
  /** 暂停或停下的原因 */
  note: string
}
export type PackMeta = {
  endings: string[]; clears: number; keepsakes: Keepsake[]
  /** 上一局的结局与回忆摘要：二周目时化作「回声」 */
  lastRun?: { ending: string; lines: string[] }
}
export type Meta = Record<string, PackMeta>
/** 标题页可选的剧本包：内置、目录里的、导入的 */
export type PackEntry = { id: string; origin: 'builtin' | 'folder' | 'imported' | 'community'; pack: Pack }
/** 生成剧本包、从仓库生成、社区下载这些后台任务的状态（会话内） */
export type JobState = {
  /** '' 空闲；gen / repo 生成中；confirm 等玩家确认要读哪些文件；browse 读社区索引；download 下载中 */
  kind: '' | 'gen' | 'repo' | 'confirm' | 'browse' | 'download'
  /** 生成的步骤：outline / expand / repair */
  step: string
  /** 第几次（修复第几处） */
  attempt: number
  /** 最近一条结果或错误 */
  message: string
  /** 从仓库生成前，要读的文件清单（等确认） */
  scan: { root: string; idea: string; files: string[]; bytes: number } | null
  /** 社区索引（显示用） */
  entries: { id: string; title: string; author: string; license: string; lang: string; summary: string }[]
}

declare module 'claude-code' {
  interface PluginState {
    'ai-galgame': { story: Story; undo: string[]; ui: UiState; settings: GalSettings; meta: Meta; packs: PackEntry[]; auto: AutoState; work: WorkState; feats: Feats; job: JobState }
  }
}
