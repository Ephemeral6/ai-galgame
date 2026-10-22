// 像素美术：方块小动物立绘（来自剧本包的字母图）、双人同框、AI 画的信物。
// 像素压成终端格：两行像素一格，上半「▀」前景=上像素、背景=下像素；透明处用终端默认色，不画背景。

import type { Actor, Keepsake, Pack, SpriteDef } from '../types'
import { personOf } from './pack'

const DEFAULT = 0x01000000
export const INK = 0x1e1a1a
const CHEEK = 0xff7f95
const TEAR = 0x8fd3ff
const WHITE = 0xffffff
const EYE_LIGHT = 0xf2f2f2

type Px = number | null
const S = 2 // 立绘放大倍数
const W = 14 // 字母图宽
const SW = W * S
const HEAD = 6 // 头顶留给跳跃
const MAX_ROWS = 12
export const STAGE_W = 64
const SH = MAX_ROWS * S + HEAD
export const STAGE_ROWS = SH / 2
export const PORTRAIT_ROWS = (MAX_ROWS + 2) / 2

export const EXPRS = ['normal', 'smile', 'blush', 'sad', 'angry', 'surprised'] as const

const HOP: Record<string, number[]> = {
  smile: [0, 1, 2, 3, 2, 1, 0, 0, 0, 0],
  surprised: [0, 2, 4, 5, 4, 2, 0, 0, 0, 0, 0, 0],
}

export function hex(s: string): number {
  return parseInt(s.replace('#', ''), 16)
}

/** 一帧立绘。t 是帧序号（≤5 帧/秒推进） */
export function sprite(sp: SpriteDef, expr: string, t: number): Px[][] {
  const pal: Record<string, number> = {}
  for (const [k, v] of Object.entries(sp.pal)) pal[k] = hex(v)
  const g: (string | number)[][] = sp.art.map(r => r.split(''))
  const orig = sp.art.map(r => r.split(''))
  const put = (r: number, c: number, v: string | number) => { if (g[r] && c >= 0 && c < W && g[r]![c] !== undefined) g[r]![c] = v }
  const eyes = (sp.eyes.length >= 2 ? sp.eyes : [[3, 4], [3, 9]]) as [number, number][]
  // 深色身体上眼睛画成浅色，否则看不见
  const under = pal[orig[eyes[0]![0] - 1]?.[eyes[0]![1]] ?? ''] ?? 0xffffff
  const lum = ((under >> 16) & 255) * 0.3 + ((under >> 8) & 255) * 0.59 + (under & 255) * 0.11
  const ink = lum < 70 ? EYE_LIGHT : INK
  const eye = (f: (r: number, c: number, side: -1 | 1) => [number, number][]) => {
    eyes.slice(0, 2).forEach(([r, c], i) => { for (const [y, x] of f(r, c, i === 0 ? -1 : 1)) put(y, x, ink) })
  }
  switch (expr) {
    case 'smile': eye((r, c) => [[r, c - 1], [r - 1, c], [r, c + 1]]); break
    case 'blush': eye((r, c) => [[r, c]]); for (const [r, c] of sp.cheeks) put(r, c, CHEEK); break
    case 'sad': eye((r, c) => [[r, c]]); break
    case 'angry': eye((r, c, side) => [[r, c], [r - 1, c - side]]); break
    case 'surprised': eye((r, c) => [[r, c], [r - 1, c]]); for (const [r, c] of eyes) put(r + 1, c, WHITE); break
    default: eye((r, c) => [[r, c], [r - 1, c]])
  }
  // 眨眼：每 22 帧闭一下（笑眼本来就弯着，不眨）
  if (t % 22 === 0 && expr !== 'smile') for (const [r, c] of eyes) for (const dr of [-1, 0]) if (g[r + dr]?.[c] === ink) g[r + dr]![c] = orig[r + dr]?.[c] ?? '.'
  // 各自的小动作：在轮廓边缘挪一两个像素
  const body = Object.keys(sp.pal).includes('b') ? 'b' : Object.keys(sp.pal)[0] ?? '.'
  if (sp.motion === 'tail' && Math.floor(t / 3) % 2 === 1) {
    const r = Math.max(1, sp.art.length - 5)
    const v = g[r]?.[W - 1]
    if (v !== undefined && v !== '.') { g[r]![W - 1] = '.'; put(r - 1, W - 1, v) }
  }
  if (sp.motion === 'wings' && t % 6 < 2) {
    const mid = Math.floor(sp.art.length / 2)
    for (const r of [mid, mid + 1]) { put(r, 0, body); put(r, W - 1, body) }
  }
  if (sp.motion === 'ears' && t % 14 < 2) {
    const row = g[0]
    if (row) { row.push(row.shift()!); row[W - 1] = '.' }
  }
  const out: Px[][] = g.map(row => row.map(v => (typeof v === 'number' ? v : v === '.' ? null : pal[v] ?? null)))
  if (expr === 'sad' && t % 4 < 2) { const [r, c] = eyes[0]!; if (out[r + 1]) out[r + 1]![c] = TEAR }
  return out
}

function blank(w: number, h: number): Px[][] {
  return Array.from({ length: h }, () => Array<Px>(w).fill(null))
}

function stamp(dst: Px[][], src: Px[][], ox: number, oy: number, scale: number): void {
  src.forEach((row, r) => row.forEach((v, c) => {
    if (v === null) return
    for (let a = 0; a < scale; a++) for (let b = 0; b < scale; b++) {
      const y = oy + r * scale + a
      const x = ox + c * scale + b
      if (dst[y] && x >= 0 && x < dst[y]!.length) dst[y]![x] = v
    }
  }))
}

/** 舞台：一到两只小动物（主角色或有立绘的配角）；near 时靠在一起，far 时分站两边 */
export function stageFrame(pack: Pack, cast: Actor[], distance: 'near' | 'far', t: number): Px[][] {
  const px = blank(STAGE_W, SH)
  const shown = cast.filter(a => !!personOf(pack, a.id)?.sprite).slice(0, 2)
  const n = shown.length
  const xs = n === 1 ? [(STAGE_W - SW) / 2] : distance === 'near' ? [STAGE_W / 2 - SW - 1, STAGE_W / 2 + 1] : [2, STAGE_W - SW - 2]
  shown.forEach((act, i) => {
    const spr = sprite(personOf(pack, act.id)!.sprite!, act.expression, t + i * 7)
    let dy = 0
    let dx = 0
    const hop = HOP[act.expression]
    if (hop) dy = -hop[(t + i * 3) % hop.length]!
    else if (act.expression === 'sad') dy = 1
    else dy = Math.floor((t + i * 2) / 4) % 2 === 0 ? 0 : -1 // 待机起伏
    if (act.expression === 'angry' && t % 10 < 4) dx = t % 2 === 0 ? 1 : -1
    stamp(px, spr, xs[i]! + dx, SH - spr.length * S - 1 + dy, S)
  })
  return px
}

/** 小号头像（标题页、日程） */
export function portraitFrame(sp: SpriteDef, expr: string, t: number): Px[][] {
  const px = blank(W, MAX_ROWS + 2)
  const spr = sprite(sp, expr, t)
  stamp(px, spr, 0, MAX_ROWS + 2 - spr.length - 1, 1)
  return px
}

/** 信物：AI 用 8×8 调色字母画的小图标，放大 3 倍 */
export function keepsakeFrame(k: Keepsake): Px[][] {
  const px = blank(24, 24)
  const src: Px[][] = k.art.slice(0, 8).map(row => row.padEnd(8, '.').slice(0, 8).split('').map(ch => (ch === '.' ? null : k.palette[ch] ?? null)))
  stamp(px, src, 0, 0, 3)
  return px
}

export function b64(bytes: Uint8Array): string {
  const T = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let out = ''
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i]!, b = bytes[i + 1] ?? 0, c = bytes[i + 2] ?? 0
    const n = (a << 16) | (b << 8) | c
    out += T[(n >> 18) & 63]! + T[(n >> 12) & 63]! + (i + 1 < bytes.length ? T[(n >> 6) & 63]! : '=') + (i + 2 < bytes.length ? T[n & 63]! : '=')
  }
  return out
}

/** 像素 → Raster 的 cells（base64 的 [码点, 前景, 背景] 三元组） */
export function cells(px: Px[][]): string {
  const w = px[0]!.length
  const words = new Uint32Array(w * Math.ceil(px.length / 2) * 3)
  let k = 0
  for (let y = 0; y < px.length; y += 2) {
    for (let x = 0; x < w; x++) {
      const top = px[y]![x] ?? null
      const bot = px[y + 1]?.[x] ?? null
      if (top === null && bot === null) { words[k++] = 0x20; words[k++] = DEFAULT; words[k++] = DEFAULT }
      else if (top === null) { words[k++] = 0x2584; words[k++] = bot!; words[k++] = DEFAULT }
      else { words[k++] = 0x2580; words[k++] = top; words[k++] = bot ?? DEFAULT }
    }
  }
  return b64(new Uint8Array(words.buffer))
}

/** 校验 AI 画的信物：至少 6 行、每行截到 8 字符（不足补透明）、只用调色板里的字母、至多 6 色、不能全透明 */
export function validKeepsake(art: unknown, palette: unknown): { art: string[]; palette: Record<string, number> } | null {
  if (!Array.isArray(art) || art.length < 6 || typeof palette !== 'object' || !palette || Array.isArray(palette)) return null
  const pal: Record<string, number> = {}
  for (const [k, v] of Object.entries(palette as Record<string, unknown>)) {
    if (k.length !== 1 || k === '.') continue
    const n = typeof v === 'string' ? parseInt(v.replace('#', ''), 16) : Number(v)
    if (Number.isFinite(n) && n >= 0 && n <= 0xffffff) pal[k] = n
  }
  if (Object.keys(pal).length > 6) return null
  const rows = art.slice(0, 8).map(r => String(r).padEnd(8, '.').slice(0, 8))
  while (rows.length < 8) rows.push('........')
  const used = new Set(rows.join('').replace(/\./g, '').split(''))
  if (used.size === 0 || [...used].some(ch => !(ch in pal))) return null
  return { art: rows, palette: pal }
}
