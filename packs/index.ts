// 内置剧本包登记表。新增内置包：建 packs/<id>/pack.ts（导出一个 Pack），在这里加一行。
// 玩家自己的包不需要改代码：放进剧本目录或用 /gal import 导入（纯 JSON 数据）。

import type { Pack } from '../types'
import { BAND } from './band/pack'
import { CICADA } from './cicada/pack'
import { EQUALIA } from './equalia/pack'
import { LOOP } from './loop/pack'
import { MAUVE } from './mauve/pack'
import { RADIO } from './radio/pack'
import { SNOW } from './snow/pack'

export const BUILTIN: Pack[] = [CICADA, BAND, SNOW, LOOP, RADIO, EQUALIA, MAUVE]
