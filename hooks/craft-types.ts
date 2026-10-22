// 剧本包的「写作手法」字段（全部可选）。设计依据见 docs/NARRATIVE-CRAFT.md。
// 类型本体已合并进 types/index.d.ts（状态契约必须自包含）；这里只转出，方便原来的引用继续可用。

export type {
  DiaryVoice, FlashbackDef, GagDef, GossipDef, MotifDef, PackCraft, PersonCraft, RevealDef, RouteDef, SceneKind, SetPieceChoice, SetPieceDef, SetPieceLine, TextureDef,
} from '../types'
import type { PackCraft } from '../types'

/** 合并前内置包用 `Pack & CraftFields` 声明；合并后 Pack 自带 craft，这个别名保留以免旧引用编译失败 */
export type CraftFields = { craft?: PackCraft }
