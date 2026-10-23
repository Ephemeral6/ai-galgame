// 颜色令牌：界面上所有颜色从这里取，组件里不写裸十六进制。见 docs/VISUAL-REDESIGN.md §3.2。
// 像素层自带深色幕布，不随终端背景变；文字层按终端深浅取两套值，字色在色块上由 inkOn 挑黑或白。

import type { Px } from './art'

/** 像素层（Raster）。数值是 0xRRGGBB */
export const PX = {
  screen: 0x17151f, // 幕布底：所有像素块的透明处都填这个色
  frame: 0x3a3548,
  frameLit: 0xf2c14e,
  title: 0xf4f1e8,
  accent: 0xf2c14e,
  accent2: 0xf8bbd0,
  lamp: 0xffd27a,
} as const

export type Bg = 'dark' | 'light'

/** 文字层。括号外的说明见 VISUAL-REDESIGN §3.2-B；对比度深底对 #1e1e1e、浅底对 #ffffff，均 ≥ 4.5 */
export const TEXT = {
  dark: { accent: '#f2c14e', kept: '#81c784', broken: '#ef8a8a', event: '#f0a070', info: '#9fc5e8', me: '#7fd1c7' },
  light: { accent: '#8a5a00', kept: '#2e7d32', broken: '#c62828', event: '#b23c17', info: '#2f6db5', me: '#00796b' },
} as const

/** 选项类型色：只做芯片底（字色走 inkOn）。cb 是 Okabe–Ito 色盲配色；图标也各不相同 */
export const KIND = {
  default: { reply: '#7fd1c7', observe: '#b0b6bd', promise: '#f2c14e', keep: '#81c784' },
  cb: { reply: '#56b4e9', observe: '#cc79a7', promise: '#f0e442', keep: '#009e73' },
} as const

/** 色盲配色下文字层的状态色（Okabe–Ito），深底用 */
export const STATE_CB = { kept: '#009e73', broken: '#d55e00', event: '#e69f00', info: '#56b4e9' } as const

/** 角色没写颜色时的退路 */
export const FALLBACK = '#cccccc'

const REF: Record<Bg, string> = { dark: '#1e1e1e', light: '#ffffff' }

function rgb(c: string): [number, number, number] {
  const n = parseInt(c.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function lum(c: string): number {
  const [r, g, b] = rgb(c).map(v => {
    const x = v / 255
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG 对比度 */
export function contrast(a: string, b: string): number {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m) as [number, number]
  return (x + 0.05) / (y + 0.05)
}

/** 色块上的字色：纯黑、纯白里对比更高的那个（对任何底色都 ≥ 4.58） */
export function inkOn(bg: string): string {
  return contrast(bg, '#000000') >= contrast(bg, '#ffffff') ? '#000000' : '#ffffff'
}

function mix(c: string, to: string, k: number): string {
  const a = rgb(c)
  const b = rgb(to)
  return `#${a.map((v, i) => Math.round(v + (b[i]! - v) * k).toString(16).padStart(2, '0')).join('')}`
}

/** 角色色当前景用：往白（深底）或往黑（浅底）按 5% 一步混，直到对终端底色 ≥ 4.5 */
export function readable(c: string, bg: Bg = 'dark'): string {
  const ref = REF[bg]
  const to = bg === 'dark' ? '#ffffff' : '#000000'
  for (let k = 0; k <= 1; k += 0.05) {
    const x = mix(c, to, k)
    if (contrast(x, ref) >= 4.5) return x
  }
  return to
}

/** 0xRRGGBB → '#rrggbb'（像素卡的 CardSpec 收字符串） */
export function css(n: number): string {
  return `#${n.toString(16).padStart(6, '0')}`
}

/** 外面加 1 像素的幕框（信物画框用）：宽高各多 2 */
export function framed(px: Px[][], c: number = PX.frame): Px[][] {
  const w = (px[0]?.length ?? 0) + 2
  const edge = Array<Px>(w).fill(c)
  return [edge, ...px.map(r => [c, ...r, c]), edge.slice()]
}

/** 像素块自带幕布：透明处填 PX.screen，深浅终端上是同一幅画 */
export function onScreen(px: Px[][], fill: number = PX.screen): Px[][] {
  return px.map(r => r.map(v => v ?? fill))
}
