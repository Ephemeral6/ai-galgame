// 画面效果（纯函数，只算像素）：像素字体标题卡与过渡、氛围带粒子、主题色、演出指令、像素小镇地图、人物关系网。
// 由 register.tsx 的动画定时器按 ≤5 帧/秒调用，只 blit 变了的那一块。

import type { Atmo, Pack, PlaceDef, Scene, Story } from '../types'
import { blank, hex } from './art'
import type { Px, StageDir } from './art'
import { castOf, npcOf } from './pack'

// ---------- 颜色 ----------
export function rgb(n: number): [number, number, number] {
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
export function mix(a: number, b: number, k: number): number {
  const [r1, g1, b1] = rgb(a)
  const [r2, g2, b2] = rgb(b)
  const m = (x: number, y: number) => Math.round(x + (y - x) * Math.max(0, Math.min(1, k)))
  return (m(r1, r2) << 16) | (m(g1, g2) << 8) | m(b1, b2)
}
export function toHex(n: number): string {
  return `#${n.toString(16).padStart(6, '0')}`
}
/** 名字、边框随主题色调轻轻偏一点 */
export function tint(color: string, theme: string, k = 0.25): string {
  return toHex(mix(hex(color), hex(theme), k))
}

// ---------- 主题色：由 AI 每幕给出的天气、时段决定 ----------
const THEME: Record<string, string> = {
  dawn: '#f8bbd0', day: '#ffd54f', dusk: '#f2a65a', night: '#8c9eff',
  rain: '#5b8fd9', storm: '#607d8b', snow: '#cfd8dc', fog: '#a7b6c2', wind: '#9ccc65',
}
export const DEFAULT_THEME = '#f2c14e'

export function themeOf(a: Atmo | undefined): string {
  if (!a) return DEFAULT_THEME
  if (a.weather === 'rain' && a.time === 'night') return '#4a6fb5'
  if (a.weather && a.weather !== 'clear' && THEME[a.weather]) return THEME[a.weather]!
  return (a.time && THEME[a.time]) || DEFAULT_THEME
}

/** 氛围带粒子：AI 没给 fx 时按天气、时段推一个 */
export function fxOf(a: Atmo | undefined): NonNullable<Atmo['fx']> {
  if (!a) return 'none'
  if (a.fx) return a.fx
  if (a.weather === 'rain' || a.weather === 'storm') return 'rain'
  if (a.weather === 'snow') return 'snow'
  if (a.weather === 'fog') return 'mist'
  if (a.time === 'night') return 'stars'
  if (a.time === 'dawn') return 'mist'
  return 'cicadas'
}

// ---------- 像素字体（3×5，拉丁字母与数字） ----------
const G: Record<string, string> = {
  A: '.x.x.xxxxx.xx.x', B: 'xx.x.xxx.x.xxx.', C: '.xxx..x..x...xx', D: 'xx.x.xx.xx.xxx.', E: 'xxxx..xx.x..xxx',
  F: 'xxxx..xx.x..x..', G: '.xxx..x.xx.x.xx', H: 'x.xx.xxxxx.xx.x', I: 'xxx.x..x..x.xxx', J: '..x..x..xx.x.x.',
  K: 'x.xx.xxx.x.xx.x', L: 'x..x..x..x..xxx', M: 'x.xxxxxxxx.xx.x', N: 'xx.x.xx.xx.xx.x', O: '.x.x.xx.xx.x.x.',
  P: 'xx.x.xxx.x..x..', Q: '.x.x.xx.xxx..xx', R: 'xx.x.xxx.x.xx.x', S: '.xxx...x...xxx.', T: 'xxx.x..x..x..x.',
  U: 'x.xx.xx.xx.xxxx', V: 'x.xx.xx.xx.x.x.', W: 'x.xx.xxxxxxxx.x', X: 'x.xx.x.x.x.xx.x', Y: 'x.xx.x.x..x..x.',
  Z: 'xxx..x.x.x..xxx', '0': 'xxxx.xx.xx.xxxx', '1': '.x.xx..x..x.xxx', '2': 'xx...x.x.x..xxx', '3': 'xx...x.x...xxx.',
  '4': 'x.xx.xxxx..x..x', '5': 'xxxx..xx...xxx.', '6': '.xxx..xxxx.xxxx', '7': 'xxx..x.x..x..x.', '8': 'xxxx.xxxxx.xxxx',
  '9': 'xxxx.xxxx..xxx.', ' ': '...............', '-': '......xxx......', '.': '.............x.', '!': '.x..x..x.....x.',
  '?': 'xx...x.x.....x.', '&': '.x.x.x.x.x.x.xx', "'": '.x..x..........', ':': '....x.....x....', ',': '..........x.x..',
}

/** 只留字体里有的字符（去掉重音、汉字等） */
export function fontText(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[·•—–]/g, '-').toUpperCase().split('').filter(ch => G[ch] !== undefined).join('').replace(/\s+/g, ' ').trim()
}

export function textWidth(s: string, scale: number): number {
  return Math.max(0, s.length * 4 * scale - scale)
}

/** 把一行字画进 dst（左上角 x, y） */
export function drawText(dst: Px[][], s: string, x: number, y: number, color: number, scale = 1): void {
  for (const [i, ch] of [...s].entries()) {
    const g = G[ch]
    if (!g) continue
    for (let k = 0; k < 15; k++) {
      if (g[k] !== 'x') continue
      const gx = x + (i * 4 + (k % 3)) * scale
      const gy = y + Math.floor(k / 3) * scale
      for (let a = 0; a < scale; a++) for (let b = 0; b < scale; b++) if (dst[gy + a] && gx + b >= 0 && gx + b < dst[gy + a]!.length) dst[gy + a]![gx + b] = color
    }
  }
}

/** 把一句话按词折成最多 n 行，每行不超过 width 像素 */
function wrap(s: string, width: number, scale: number, n: number): string[] {
  const out: string[] = []
  let cur = ''
  for (const w of s.split(' ')) {
    const next = cur ? `${cur} ${w}` : w
    if (textWidth(next, scale) <= width) cur = next
    else { if (cur) out.push(cur); cur = w }
  }
  if (cur) out.push(cur)
  return out.slice(0, n)
}

// ---------- 标题卡（开场、每章、结局） ----------
/** layout: 'inline' 时大字和小字排在同一行（DAY 卡用，矮一截）；排不下就退回上下两行 */
export type CardSpec = { big: string; small?: string; color: string; accent: string; style: 'fade' | 'wipe'; layout?: 'stack' | 'inline' }
export const CARD_FRAMES = 6

/** 一张卡；step 是从出现起的第几帧（0..CARD_FRAMES，之后静止，只剩星点闪烁） */
export function cardFrame(spec: CardSpec, w: number, step: number, t: number): Px[][] {
  const big0 = fontText(spec.big)
  const scale = textWidth(big0, 2) <= w - 6 ? 2 : 1
  const small0 = fontText(spec.small ?? '')
  const inlineW = textWidth(big0, scale) + (small0 ? 6 + textWidth(small0, 1) : 0)
  const inline = spec.layout === 'inline' && inlineW <= w - 6
  const bigLines = inline ? [big0] : wrap(big0, w - 6, scale, 2)
  const small = inline ? [] : wrap(small0, w - 6, 1, 2)
  const h = inline ? 4 + 5 * scale : 4 + bigLines.length * 6 * scale + small.length * 7
  const px = blank(w, h)
  const color = hex(spec.color)
  const accent = hex(spec.accent)
  if (inline) {
    const x0 = Math.floor((w - inlineW) / 2)
    drawText(px, big0, x0, 2, color, scale)
    if (small0) drawText(px, small0, x0 + textWidth(big0, scale) + 6, 2 + 5 * scale - 5, accent, 1)
  }
  const dim = mix(accent, 0x101018, 0.6)
  // 细边框与四角星点
  for (let x = 1; x < w - 1; x++) { px[0]![x] = dim; px[h - 1]![x] = dim }
  for (let y = 1; y < h - 1; y++) { px[y]![0] = dim; px[y]![w - 1] = dim }
  for (const [x, y] of [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1]] as const) px[y]![x] = (t % 6 < 3) ? accent : dim
  let y = 2
  if (!inline) for (const line of bigLines) { drawText(px, line, Math.floor((w - textWidth(line, scale)) / 2), y, color, scale); y += 6 * scale }
  for (const line of small) { drawText(px, line, Math.floor((w - textWidth(line, 1)) / 2), y + 1, accent, 1); y += 7 }
  // 过渡：淡入（由暗到亮）或擦入（从左往右，前沿一列亮白）
  const k = Math.min(1, step / CARD_FRAMES)
  if (k >= 1) return px
  if (spec.style === 'fade') return px.map(row => row.map(v => (v === null ? null : mix(0x101018, v, k))))
  const edge = Math.floor(k * w)
  return px.map(row => row.map((v, x) => (x > edge ? null : x === edge && v !== null ? 0xffffff : v)))
}

// ---------- 氛围带 ----------
export const BAND_H = 6

/** 一条细的氛围带：雨、雪、萤火、蝉鸣声波、灯笼光点、流星、星点、薄雾 */
export function atmoBand(fx: NonNullable<Atmo['fx']>, theme: string, w: number, t: number): Px[][] {
  const px = blank(w, BAND_H)
  const th = hex(theme)
  const put = (x: number, y: number, c: number) => { const xx = ((x % w) + w) % w; if (y >= 0 && y < BAND_H) px[y]![xx] = c }
  switch (fx) {
    case 'rain':
      for (let i = 0; i < 16; i++) {
        const y = (t * 2 + i * 5) % (BAND_H + 3) - 1
        const x = (i * 37) % w - Math.floor(y / 2)
        put(x, y, mix(th, 0xffffff, 0.3)); put(x - 1, y + 1, th)
      }
      break
    case 'snow':
      for (let i = 0; i < 14; i++) put(i * 11 + Math.round(Math.sin((t + i) / 3) * 2), Math.floor((t + i * 3) / 2) % BAND_H, 0xf4f6f8)
      break
    case 'fireflies':
      for (let i = 0; i < 8; i++) if ((t + i * 5) % 8 < 5) put(i * 9 + Math.round(Math.sin((t + i * 7) / 5) * 3), 1 + Math.round((Math.cos((t + i * 3) / 4) + 1) * 1.8), (t + i) % 3 ? 0xd4e157 : 0xfff59d)
      break
    case 'cicadas': {
      const amp = t % 4 < 2 ? 2 : 1
      for (let x = 0; x < w; x++) if ((x + t * 3) % 16 < 9) put(x, 2 + Math.round(Math.sin(x / 2.2 + t) * amp), mix(th, 0x101018, 0.35))
      break
    }
    case 'lanterns':
      for (let i = 0; i < 6; i++) {
        const x = 5 + i * Math.floor(w / 6)
        const y = 1 + Math.round(Math.sin((t + i * 2) / 3) + 1)
        const c = (t + i) % 4 === 0 ? 0xffe082 : i % 2 ? 0xef5350 : 0xff8a65
        put(x, y, c); put(x + 1, y, c); put(x, y + 1, mix(c, 0x000000, 0.3)); put(x + 1, y + 1, mix(c, 0x000000, 0.3))
      }
      break
    case 'meteors': {
      for (let i = 0; i < 8; i++) if ((t + i) % 7 < 4) put((i * 23) % w, (i * 3) % BAND_H, 0xc5cae9)
      const k = t % 14
      if (k < 9) for (let j = 0; j < 6; j++) put(w - 4 - k * 8 + j * 2, Math.floor(k / 2) + Math.floor(j / 3) - 1, mix(0xffffff, th, j / 6))
      break
    }
    case 'stars':
      for (let i = 0; i < 12; i++) if ((t + i * 2) % 6 < 4) put((i * 29) % w, (i * 7) % BAND_H, i % 3 ? 0xe8eaf6 : th)
      break
    case 'mist':
      for (let y = 0; y < BAND_H; y++) for (let x = 0; x < w; x++) if ((x + t + y * 7) % 22 < 7 && (x + y) % 2 === 0) put(x, y, mix(0xb0bec5, 0x101018, 0.45 + y * 0.05))
      break
    default:
      break
  }
  return px
}

// ---------- 舞台背景板 ----------
export type Backdrop = 'room' | 'hall' | 'street' | 'shop' | 'field' | 'water' | 'roof'

// 顺序有讲究：「江边灯会与天台」先算天台，「王座厅」先算大厅，「镇广播站」先算室内，「江边夜市」先算店铺。
// 英文只按整词匹配（「Broadcast」里有 road），中英两边各管各的地名，结果要一致
const BACKDROP_RULES: [RegExp, Backdrop][] = [
  [/天台|\brooftop\b/i, 'roof'],
  [/门前|铁门|\bdoor\b/i, 'street'],
  [/食堂|礼堂|livehouse|音乐节|舞台|王座|大厅|\b(canteen|stage|festival|throne|hall|live bar)\b/i, 'hall'],
  [/广播|教室|图书馆|房间|厨房|走廊|楼道|补习|补课|会议室|浴池|锅炉|特藏|牢房|防空洞|\b(broadcast|radio|booth|room|classroom|library|club|kitchen|hallway|stairwell|cram|bathhouse|boiler|collections|cell|shelter)\b/i, 'room'],
  [/小卖部|供销社|铺|小亭|店|夜市|琴行|\b(shop|store|stall|kiosk|market)\b/i, 'shop'],
  [/江|河|海|码头|港|湖|冰场|灯塔|堤|\b(river|riverside|harbou?r|sea|seawall|lake|pier|lighthouse|frozen|ice-lantern)\b/i, 'water'],
  [/操场|球场|体育场|广场|花园|\b(field|court|stadium|square|gardens?|park)\b/i, 'field'],
  [/街|大道|梯|站|缆车|公交|路|桥|\b(street|boulevard|steps|station|bus|road|platform)\b/i, 'street'],
]

/** 按地名（中英都可）推背景种类；都不中就当室内 */
export function backdropOf(place: string): Backdrop {
  return BACKDROP_RULES.find(([re]) => re.test(place))?.[1] ?? 'room'
}

const SKY: Record<NonNullable<Atmo['time']>, [number, number]> = {
  dawn: [0x3b2e5a, 0xf2a7a0], day: [0x5aa7e0, 0xbfe3f2], dusk: [0x2a2350, 0xf2a65a], night: [0x0e1030, 0x2a2f5a],
}
const SCREEN = 0x17151f
const LAMP = 0xffd27a
const OUTDOOR: Backdrop[] = ['street', 'shop', 'field', 'water', 'roof']

/** 天空上下两色：按时段，阴雨雪雾再压灰一点 */
function skyOf(a: Atmo | undefined): [number, number] {
  const [top, bot] = SKY[a?.time ?? 'day']
  const grey = a?.weather && a.weather !== 'clear' && a.weather !== 'wind' ? 0.35 : 0
  return [mix(top, 0x6b7280, grey), mix(bot, 0x9aa3ad, grey)]
}

/** 天空渐变量化成 4 档，控制 Raster 的色对数 */
function band4(a: number, b: number, k: number): number {
  return mix(a, b, Math.round(Math.max(0, Math.min(1, k)) * 4) / 4)
}

/** 背景板最上一行的底色（压暗前）：室外是天空顶色，室内、大厅是各自的墙色 */
function topOf(kind: Backdrop, top: number): number {
  return kind === 'hall' ? mix(0x4a4458, top, 0.2) : kind === 'room' ? mix(0x6b5a4e, top, 0.25) : top
}

/** 氛围带的底色：和背景板最上一行同色（同样压暗 20%），拼成一幅 */
export function backdropTop(kind: Backdrop, a: Atmo | undefined): number {
  return mix(topOf(kind, skyOf(a)[0]), SCREEN, 0.2)
}

/**
 * 舞台背景板：天空或墙、远景、地面。立绘的脚落在倒数第 2 行，地面占底部 4 行。
 * 只有窗灯、水面反光、星星随 t 动；整体往幕布色压 20%，让立绘更突出。
 */
export function backdrop(kind: Backdrop, a: Atmo | undefined, w: number, h: number, t: number): Px[][] {
  const px: Px[][] = blank(w, h)
  const [top, bot] = skyOf(a)
  const night = a?.time === 'night'
  const g = h - 4 // 地面第一行
  const put = (x: number, y: number, c: number) => { if (y >= 0 && y < h && x >= 0 && x < w) px[y]![x] = c }
  const fill = (x0: number, y0: number, x1: number, y1: number, c: number | ((x: number, y: number) => number)) => {
    for (let y = Math.max(0, y0); y < Math.min(h, y1); y++) for (let x = Math.max(0, x0); x < Math.min(w, x1); x++) put(x, y, typeof c === 'number' ? c : c(x, y))
  }
  const sky = (y1: number) => fill(0, 0, w, y1, (_, y) => band4(top, bot, y / Math.max(1, y1 - 1)))
  const stars = (y1: number) => { if (night) for (let i = 0; i < 14; i++) if ((t + i * 2) % 6 < 4) put((i * 29) % w, (i * 7) % Math.max(1, y1), 0xe8eaf6) }
  const skyline = (base: number, tall: number, c: number) => {
    for (let x = 0; x < w; x++) { const hh = tall - ((x >> 3) * 7 % 5); fill(x, base - hh, x + 1, base, c) }
    for (let x = 0; x < w; x++) if ((x >> 3) % 2 === 0 && x % 3 === 1 && (night || a?.time === 'dusk')) put(x, base - 3, (t + x) % 9 < 7 ? LAMP : mix(LAMP, c, 0.5))
  }
  switch (kind) {
    case 'room': case 'hall': {
      const wall = topOf(kind, top)
      fill(0, 0, w, g, wall)
      fill(0, g - 3, w, g, mix(wall, 0x000000, 0.18)) // 墙裙
      if (kind === 'room') {
        // 两扇窗，窗里是天空
        for (const wx of [6, w - 24]) {
          fill(wx, 3, wx + 18, 14, (_, y) => band4(top, bot, (y - 3) / 10))
          if (night) for (let i = 0; i < 3; i++) if ((t + i) % 5 < 3) put(wx + 3 + i * 6, 5 + (i % 2) * 3, 0xe8eaf6)
          const frame = 0xe8dcc8
          fill(wx - 1, 2, wx + 19, 3, frame); fill(wx - 1, 14, wx + 19, 15, frame)
          fill(wx - 1, 2, wx, 15, frame); fill(wx + 18, 2, wx + 19, 15, frame); fill(wx + 9, 2, wx + 10, 15, frame)
        }
        fill(0, g, w, h, (x, y) => ((x + y * 3) % 12 === 0 ? 0x6e4a32 : 0x8a5d3e)) // 木地板
      } else {
        // 顶上一排吊灯，地面是打磨过的深色地板
        for (let x = 4; x < w; x += 12) { fill(x, 0, x + 1, 2, 0x2a2633); fill(x - 1, 2, x + 2, 3, (t + x) % 10 < 8 ? LAMP : mix(LAMP, wall, 0.4)) }
        fill(0, g, w, h, (x, y) => (y === g ? 0x5a5266 : (x + y) % 2 ? 0x3a3445 : 0x342f3e))
      }
      break
    }
    case 'street':
      sky(g); stars(g - 8)
      skyline(g, 11, mix(top, 0x000000, 0.45))
      fill(0, g, w, h, (x, y) => (y === g ? 0x6b6f7a : y === g + 2 && x % 6 < 3 ? 0x8a8d96 : 0x44464f))
      break
    case 'shop': {
      sky(g); stars(6)
      // 店面：条纹雨棚、货架、柜台
      fill(0, 7, w, 10, (x) => ((x >> 2) % 2 ? 0xe8e0d0 : 0xc0504d))
      fill(0, 10, w, g, 0x5a4636)
      for (let y = 12; y < g - 3; y += 4) fill(2, y, w - 2, y + 1, 0x8a6a4e)
      for (let x = 3; x < w - 3; x += 3) put(x, 11 + ((x * 7) % 3) * 4, [0xf79646, 0x9bbb59, 0x4bacc6, 0xffd27a][x % 4]!)
      fill(0, g - 3, w, g, 0x7a5a42) // 柜台
      fill(0, g, w, h, (x, y) => (y === g ? 0x6b6f7a : 0x44464f))
      break
    }
    case 'field':
      sky(g - 3); stars(g - 8)
      for (let x = 0; x < w; x++) fill(x, g - 6 + Math.round(Math.sin(x / 3) * 1.5), x + 1, g - 3, mix(0x2e4a2a, top, 0.2)) // 远处树影
      fill(0, g - 3, w, h, (x, y) => ((x >> 2) % 2 ? 0x4f7a3a : 0x46703a))
      fill(0, g - 1, w, g, 0xd8d8d0) // 白线
      break
    case 'water': {
      const wy = g - 9
      sky(wy); stars(wy - 2)
      skyline(wy, 4, mix(top, 0x000000, 0.5)) // 对岸
      fill(0, wy, w, g, (x, y) => ((x + y * 5 + t) % 13 === 0 ? mix(bot, 0xffffff, 0.3) : band4(0x2b4f7a, 0x3d6a9a, (y - wy) / 9)))
      fill(0, g, w, h, (x, y) => (y === g ? 0x8a8d96 : (x + y) % 5 ? 0x5a5d66 : 0x4e515a)) // 石堤
      break
    }
    case 'roof':
      sky(g - 5); stars(g - 8)
      skyline(g - 5, 5, mix(top, 0x000000, 0.4))
      fill(0, g - 5, w, g, mix(top, 0x000000, 0.55))
      for (let x = 0; x < w; x++) { put(x, g - 5, 0x9aa0a6); if (x % 4 === 0) fill(x, g - 5, x + 1, g, 0x9aa0a6) } // 栏杆
      fill(0, g, w, h, (x, y) => ((x + y * 2) % 7 ? 0x5a5a66 : 0x4e4e5a))
      break
  }
  return px.map(r => r.map(v => (v === null ? SCREEN : v === LAMP ? v : mix(v, SCREEN, 0.2))))
}

/** 把 top 叠在 base 上：top 的透明处露出 base */
export function over(base: Px[][], top: Px[][]): Px[][] {
  return base.map((row, y) => row.map((v, x) => top[y]?.[x] ?? v))
}

// ---------- 演出指令 ----------
/** 演出到第 reveal 句（0 = 旁白），since 是这一句出现后过了几帧：算出每人的走位、转身、气泡 */
export function stageDirections(sc: Scene, reveal: number, since: number): StageDir {
  const dir: StageDir = {}
  const cues = (sc.cues ?? []).slice().sort((a, b) => a.at - b.at)
  for (const a of sc.cast) dir[a.id] = { offset: 0, turned: false, hidden: cues.some(c => c.who === a.id && c.move === 'enter' && c.at > 0), emote: '' }
  const steps: Record<string, number> = {}
  for (const c of cues) {
    const d = dir[c.who]
    if (!d || c.at > reveal) continue
    const now = c.at === reveal
    if (c.emote && now) d.emote = c.emote
    switch (c.move) {
      case 'enter': d.hidden = false; if (now && since < 4) d.offset = -(24 - since * 6); break
      case 'exit': if (now && since < 5) d.offset = -since * 6; else d.hidden = true; break
      case 'approach': {
        const n = (steps[c.who] = (steps[c.who] ?? 0) + 1)
        d.offset = Math.max(d.offset, (n - 1) * 3 + (now ? Math.min(3, since) : 3))
        break
      }
      case 'turn': d.turned = true; break
      case 'face': d.turned = false; break
      default: break
    }
  }
  for (const d of Object.values(dir)) d.offset = Math.min(d.offset, 7)
  return dir
}

// ---------- 像素小镇地图 ----------
const ROOFS = [0xc0504d, 0x4f81bd, 0x9bbb59, 0x8064a2, 0xf79646, 0x4bacc6, 0xb08968, 0x7f7f9f]
const MAP_COLS = 5
const CELL_W = 15
const CELL_H = 11

function hashId(s: string): number {
  let h = 7
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return h
}

export function mapSize(n: number, w: number): { w: number; h: number } {
  return { w, h: Math.ceil(n / MAP_COLS) * CELL_H + 1 }
}

/**
 * 小镇地图：每个地点一栋小房子。开放的亮着（窗户闪），关着的暗；
 * labels 是日程里这个地点的按键数字，maybe 是可能遇见的人的颜色小点。
 */
export function townMap(places: PlaceDef[], open: Set<string>, labels: Record<string, string>, maybe: Record<string, string[]>, w: number, t: number): Px[][] {
  const { h } = mapSize(places.length, w)
  const px = blank(w, h)
  const ox = Math.max(0, Math.floor((w - MAP_COLS * CELL_W) / 2))
  places.forEach((pl, i) => {
    const cx = ox + (i % MAP_COLS) * CELL_W + 2
    const cy = Math.floor(i / MAP_COLS) * CELL_H
    const lit = open.has(pl.id)
    const roof = lit ? ROOFS[hashId(pl.id) % ROOFS.length]! : 0x3a3a46
    const wall = lit ? 0xe8e0d0 : 0x55555f
    // 屋顶（3 行，逐行变宽）与墙（5 行）
    for (let r = 0; r < 3; r++) for (let x = 3 - r; x <= 7 + r; x++) px[cy + r]![cx + x] = roof
    for (let r = 3; r < 8; r++) for (let x = 0; x <= 10; x++) px[cy + r]![cx + x] = wall
    if (lit) { const win = (t + i) % 6 < 4 ? 0xffe082 : 0xffca28; px[cy + 4]![cx + 1] = win; px[cy + 4]![cx + 9] = win }
    const label = labels[pl.id]
    if (label) drawText(px, label, cx + 4, cy + 3, lit ? 0x1e1a1a : 0x9aa0a6)
    // 可能遇见的人：墙下一排彩色小点
    ;(maybe[pl.id] ?? []).slice(0, 5).forEach((c, j) => { px[cy + 9]![cx + j * 2] = hex(c) })
    // 路
    for (let x = 0; x < CELL_W; x++) if ((x + i) % 3 !== 0) px[cy + 10]![cx - 2 + x] = 0x3d3d4a
  })
  return px
}

// ---------- 人物关系网 ----------
export type GraphNode = { id: string; x: number; y: number; color: number; size: number }

function line(px: Px[][], x0: number, y0: number, x1: number, y1: number, color: number, every = 1, phase = 0): void {
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0)
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1
  let err = dx + dy, x = x0, y = y0, k = 0
  for (;;) {
    if ((k + phase) % every === 0 && px[y] && x >= 0 && x < px[y]!.length) px[y]![x] = color
    if (x === x1 && y === y1) break
    const e2 = 2 * err
    if (e2 >= dy) { err += dy; x += sx }
    if (e2 <= dx) { err += dx; y += sy }
    k++
  }
}

const RIVAL = /情敌|对手|rival|敌|过节|grudge|feud|误会|misunderstand/i

/**
 * 关系网：中间是「我」，主角色在内圈，配角在外圈。我和她之间的线越实、越亮，关系越近；
 * 这一幕好感变过的那条线会闪（涨了闪白，降了闪红）。人物之间的关系是虚线，有过节的是红色；没到挑明阶段的关系不画。
 */
export function relationGraph(p: Pack, s: Story, deltas: Record<string, number>, w: number, h: number, t: number): { px: Px[][]; nodes: GraphNode[] } {
  const px = blank(w, h)
  const cx = Math.floor(w / 2), cy = Math.floor(h / 2)
  const nodes: GraphNode[] = [{ id: 'me', x: cx, y: cy, color: 0xf4f4f4, size: 3 }]
  const heroines = p.cast
  heroines.forEach((c, i) => {
    const a = -Math.PI / 2 + (i / heroines.length) * Math.PI * 2
    nodes.push({ id: c.id, x: Math.round(cx + Math.cos(a) * (w * 0.3)), y: Math.round(cy + Math.sin(a) * (h * 0.36)), color: hex(c.color), size: 3 })
  })
  const npcs = p.npcs ?? []
  npcs.forEach((n, i) => {
    const a = -Math.PI / 2 + ((i + 0.5) / Math.max(1, npcs.length)) * Math.PI * 2
    nodes.push({ id: n.id, x: Math.round(cx + Math.cos(a) * (w * 0.46)), y: Math.round(cy + Math.sin(a) * (h * 0.46)), color: mix(hex(n.color), 0x101018, 0.35), size: 2 })
  })
  const at = (id: string) => nodes.find(n => n.id === id)
  const stageOf = (id: string) => s.heroines[id]?.stage ?? 0
  // 人物之间
  for (const r of p.relations ?? []) {
    if (r.a === 'me' || r.b === 'me') continue
    const hidden = r.hiddenUntil !== undefined && ![r.a, r.b].some(x => castOf(p, x) && stageOf(x) >= r.hiddenUntil!)
    const A = at(r.a), B = at(r.b)
    if (hidden || !A || !B) continue
    const kind = typeof r.kind === 'string' ? r.kind : `${r.kind.zh ?? ''} ${r.kind.en ?? ''}`
    line(px, A.x, A.y, B.x, B.y, RIVAL.test(kind) ? 0xb53d3d : 0x4a4a5c, 2, t % 2)
  }
  // 我和她
  for (const c of heroines) {
    const N = at(c.id)!
    const st = stageOf(c.id)
    const d = deltas[c.id] ?? 0
    let color = mix(0x101018, hex(c.color), 0.35 + st * 0.16)
    if (d && t % 2 === 0) color = d > 0 ? 0xffffff : 0xff5252
    line(px, cx, cy, N.x, N.y, color, st >= 2 ? 1 : 3 - st, 0)
  }
  for (const n of nodes) {
    for (let a = 0; a < n.size; a++) for (let b = 0; b < n.size; b++) {
      const y = n.y - Math.floor(n.size / 2) + a, x = n.x - Math.floor(n.size / 2) + b
      if (px[y] && x >= 0 && x < w) px[y]![x] = n.color
    }
    if (npcOf(p, n.id) === undefined && n.id !== 'me' && (deltas[n.id] ?? 0) !== 0 && t % 2 === 0 && px[n.y - 2]) px[n.y - 2]![n.x] = 0xffffff
  }
  return { px, nodes }
}
