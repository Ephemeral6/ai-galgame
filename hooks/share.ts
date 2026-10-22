// 导出这一局：Markdown 或自带样式的单页 HTML（不引用任何外部资源），以及一段可直接贴到社交平台的短文本。
// 纯函数：只读 Story 与 Pack，不调用模型，不读写 $.state。

import type { Keepsake, Lang, Pack, SpriteDef, Story } from '../types'
import { chapterOf, dayText, meterOf, packText, personOf } from './pack'

export type ExportFormat = 'md' | 'html'
export type Quote = { day: number; who: string; text: string }
/** 引擎没有保存历史台词；另一条线若记录了关键台词，可以从这里传入，否则取最后一幕的台词 */
export type ExportExtra = { quotes?: Quote[] }

type Px = string | null
type Grid = Px[][]

export type RunDigest = {
  title: string
  subtitle: string
  author: string
  notice: string
  lang: Lang
  finished: boolean
  dayReached: number
  totalDays: number
  days: { day: number; label: string; chapter: string; moments: { slot: string; who: string; text: string }[]; choices: string[] }[]
  quotes: { who: string; color: string; text: string }[]
  promises: { who: string; text: string; status: 'open' | 'kept' | 'broken' }[]
  keepsakes: { who: string; title: string; desc: string; day: string; grid: Grid }[]
  cast: { name: string; color: string; stage: string; meter: string; grid: Grid | null }[]
  ending: { title: string; kind: string; text: string } | null
}

const INK = '#1e1a1a'

/** 立绘转成像素格（与终端里一样把眼睛画上，表情取 normal） */
export function spriteGrid(sp: SpriteDef): Grid {
  const g: Grid = sp.art.map(row => [...row].map(ch => (ch === '.' ? null : sp.pal[ch] ?? null)))
  for (const [r, c] of sp.eyes.slice(0, 2)) {
    for (const rr of [r - 1, r]) if (g[rr] && g[rr]![c] !== undefined && g[rr]![c] !== null) g[rr]![c] = INK
  }
  return g
}

export function keepsakeGrid(k: Keepsake): Grid {
  const hex = (n: number) => `#${n.toString(16).padStart(6, '0')}`
  return k.art.map(row => [...row].map(ch => (ch === '.' || !(ch in k.palette) ? null : hex(k.palette[ch]!))))
}

function nameOf(p: Pack, lang: Lang, id: string): string {
  const T = packText(p, lang)
  if (id === 'me') return T(p.me)
  return T(personOf(p, id)?.name) || id
}

/** 把一局整理成导出用的数据（Markdown 与 HTML 共用） */
export function runDigest(s: Story, p: Pack, lang: Lang, extra: ExportExtra = {}): RunDigest {
  const T = packText(p, lang)
  const slotName = (i: number) => T(p.slots[i])
  const finished = s.phase === 'ending' || !!s.ending
  const lastDay = Math.max(1, Math.min(p.days, s.day))
  const days: RunDigest['days'] = []
  for (let d = 1; d <= lastDay; d++) {
    const moments = s.album.filter(m => m.day === d).map(m => ({ slot: slotName(m.slot), who: m.heroine ? nameOf(p, lang, m.heroine) : '', text: m.text }))
    const choices = s.notes.filter(n => n.day === d).map(n => n.text)
    if (moments.length || choices.length) days.push({ day: d, label: dayText(p, lang, d), chapter: chapterOf(p, lang, d), moments, choices })
  }
  const rawQuotes: Quote[] = extra.quotes?.length ? extra.quotes : (s.scene?.lines ?? []).map(l => ({ day: s.day, who: l.who, text: l.text }))
  const quotes = rawQuotes.filter(q => q.text.trim()).slice(0, 8).map(q => ({ who: nameOf(p, lang, q.who), color: personOf(p, q.who)?.color ?? '', text: q.text }))
  const endingDef = p.endings.find(e => e.id === s.endingId)
  const ending = finished
    ? { title: T(endingDef?.title) || (lang === 'zh' ? '结局' : 'Ending'), kind: endingDef?.kind ?? '', text: s.ending }
    : null
  const cast = p.cast.map(c => {
    const h = s.heroines[c.id]
    const m = meterOf(c)
    const filled = Math.max(0, Math.min(4, h?.stage ?? 0))
    return { name: T(c.name), color: c.color, stage: T(p.stages[h?.stage ?? 0]), meter: m.full.repeat(filled) + m.empty.repeat(4 - filled), grid: c.sprite ? spriteGrid(c.sprite) : null }
  })
  const src = p.source === 'original' ? '' : T(p.source.notice) || `${T(p.source.work)} · ${T(p.source.author)} · ${T(p.source.license)}`
  return {
    title: T(p.title), subtitle: T(p.subtitle), author: p.author, notice: src, lang, finished,
    dayReached: lastDay, totalDays: p.days, days, quotes,
    promises: s.promises.map(x => ({ who: nameOf(p, lang, x.heroine), text: x.text, status: x.status })),
    keepsakes: s.keepsakes.map(k => ({ who: nameOf(p, lang, k.heroine), title: k.title, desc: k.desc, day: dayText(p, lang, k.day), grid: keepsakeGrid(k) })),
    cast, ending,
  }
}

const W: Record<Lang, Record<string, string>> = {
  zh: {
    by: '作者', days: '每天', quotes: '关键台词', choices: '我的选择', promises: '约定', keepsakes: '信物', cast: '人物', ending: '结局',
    open: '未到期', kept: '已兑现', broken: '失约', unfinished: '这一局还没结束：进行到', of: '/', made: '用 ai-galgame 生成',
    true: '真结局', good: '好结局', normal: '普通结局', bad: '坏结局', none: '（无）',
  },
  en: {
    by: 'by', days: 'Day by day', quotes: 'Key lines', choices: 'My choices', promises: 'Promises', keepsakes: 'Keepsakes', cast: 'Characters', ending: 'Ending',
    open: 'open', kept: 'kept', broken: 'broken', unfinished: 'Still in progress: reached', of: 'of', made: 'Made with ai-galgame',
    true: 'True ending', good: 'Good ending', normal: 'Normal ending', bad: 'Bad ending', none: '(none)',
  },
}

// ---------- Markdown ----------

const SHADES = ['██', '▓▓', '▒▒', '░░']

function lum(hex: string): number {
  const n = parseInt(hex.slice(1), 16)
  return ((n >> 16) & 255) * 0.3 + ((n >> 8) & 255) * 0.59 + (n & 255) * 0.11
}

/** 像素格转成字符块：越深越实 */
export function gridText(g: Grid): string {
  return g.map(row => row.map(px => (px === null ? '  ' : SHADES[Math.min(3, Math.floor(lum(px) / 64))]!)).join('').replace(/\s+$/, '')).join('\n')
}

const mdEsc = (s: string) => s.replace(/([\\`*_[\]<>#|])/g, '\\$1').replace(/\r?\n/g, ' ')

function toMarkdown(d: RunDigest): string {
  const w = W[d.lang]
  const co = d.lang === 'zh' ? '：' : ': '
  const out: string[] = [`# ${mdEsc(d.title)}`, '', `*${mdEsc(d.subtitle)}* · ${w.by} ${mdEsc(d.author)}`]
  if (d.notice) out.push('', `> ${mdEsc(d.notice)}`)
  if (!d.finished) out.push('', `> ${w.unfinished} ${d.dayReached} ${w.of} ${d.totalDays}`)
  out.push('', `## ${w.days}`)
  let chapter = ''
  for (const day of d.days) {
    if (day.chapter && day.chapter !== chapter) { chapter = day.chapter; out.push('', `### ${mdEsc(chapter)}`) }
    out.push('', `**${mdEsc(day.label)}**`, '')
    for (const m of day.moments) out.push(`- ${mdEsc(m.slot)}${m.who ? ` · ${mdEsc(m.who)}` : ''}${co}${mdEsc(m.text)}`)
    if (day.choices.length) out.push(`- ${w.choices}${co}${day.choices.map(mdEsc).join(d.lang === 'zh' ? '；' : '; ')}`)
  }
  if (d.quotes.length) {
    out.push('', `## ${w.quotes}`, '')
    for (const q of d.quotes) out.push(`> **${mdEsc(q.who)}**${co}${mdEsc(q.text)}`, '>')
    out.pop()
  }
  if (d.promises.length) {
    out.push('', `## ${w.promises}`, '')
    for (const x of d.promises) out.push(`- ${x.status === 'kept' ? '✔' : x.status === 'broken' ? '✘' : '…'} ${mdEsc(x.who)}${co}${mdEsc(x.text)}${d.lang === 'zh' ? `（${w[x.status]}）` : ` (${w[x.status]})`}`)
  }
  if (d.keepsakes.length) {
    out.push('', `## ${w.keepsakes}`)
    for (const k of d.keepsakes) out.push('', `**${mdEsc(k.title)}** · ${mdEsc(k.who)} · ${mdEsc(k.day)}`, '', mdEsc(k.desc), '', '```', gridText(k.grid), '```')
  }
  out.push('', `## ${w.cast}`)
  for (const c of d.cast) {
    out.push('', `**${mdEsc(c.name)}** · ${mdEsc(c.stage)} ${c.meter}`)
    if (c.grid) out.push('', '```', gridText(c.grid), '```')
  }
  if (d.ending) {
    out.push('', `## ${w.ending}${co}${mdEsc(d.ending.title)}${d.ending.kind ? (d.lang === 'zh' ? `（${w[d.ending.kind] ?? d.ending.kind}）` : ` (${w[d.ending.kind] ?? d.ending.kind})`) : ''}`, '')
    for (const para of d.ending.text.split(/\n+/).filter(Boolean)) out.push(mdEsc(para), '')
  }
  out.push('', `---`, `*${w.made}*`, '')
  return out.join('\n').replace(/\n{3,}/g, '\n\n')
}

// ---------- HTML ----------

export function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

const safeColor = (c: string) => (/^#[0-9a-fA-F]{6}$/.test(c) ? c : 'currentColor')

/** 像素格转内联 SVG：同色连续像素合并成一条矩形 */
export function gridSvg(g: Grid, scale = 6, label = ''): string {
  const h = g.length
  const w = Math.max(1, ...g.map(r => r.length))
  const rects: string[] = []
  g.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const c = row[x]
      if (c === null || c === undefined) { x++; continue }
      let e = x + 1
      while (e < row.length && row[e] === c) e++
      rects.push(`<rect x="${x}" y="${y}" width="${e - x}" height="1" fill="${safeColor(c)}"/>`)
      x = e
    }
  })
  const aria = label ? ` role="img" aria-label="${esc(label)}"` : ' aria-hidden="true"'
  return `<svg class="px" viewBox="0 0 ${w} ${h}" width="${w * scale}" height="${h * scale}" shape-rendering="crispEdges"${aria}>${rects.join('')}</svg>`
}

const CSS = `
:root{color-scheme:light dark;--bg:#faf7f2;--card:#ffffff;--ink:#1f1d1a;--muted:#6b645b;--line:#e6dfd4;--accent:#c2416b;--kept:#2f855a;--broken:#c53030}
@media (prefers-color-scheme:dark){:root{--bg:#16151a;--card:#1f1e25;--ink:#ece8e1;--muted:#a59f96;--line:#33313a;--accent:#f0739a;--kept:#68d391;--broken:#fc8181}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.7 -apple-system,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans CJK SC",sans-serif}
main{max-width:760px;margin:0 auto;padding:40px 16px 64px}
header{text-align:center;margin-bottom:32px}
h1{font-size:2rem;line-height:1.25;margin:0 0 6px}
h2{font-size:1.15rem;margin:40px 0 12px;padding-bottom:6px;border-bottom:1px solid var(--line)}
h3{font-size:.95rem;color:var(--accent);margin:24px 0 8px;letter-spacing:.04em}
.sub,.muted{color:var(--muted)}
.notice{font-size:.85rem;color:var(--muted);border-left:3px solid var(--line);padding-left:10px}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px;margin:10px 0}
.day b{display:block;margin-bottom:4px}
.day ul{margin:0;padding-left:1.2em}
.choice{color:var(--muted);font-size:.92rem}
blockquote{margin:10px 0;padding:10px 14px;border-left:4px solid var(--accent);background:var(--card);border-radius:0 8px 8px 0}
blockquote b{margin-right:.4em}
.grid{display:flex;flex-wrap:wrap;gap:12px}
.item{flex:1 1 200px;display:flex;gap:12px;align-items:center;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px}
.px{flex:none;image-rendering:pixelated}
.kept{color:var(--kept)}.broken{color:var(--broken)}.open{color:var(--muted)}
.ending{background:var(--card);border:1px solid var(--line);border-top:4px solid var(--accent);border-radius:10px;padding:18px 20px}
.ending p{margin:0 0 .9em}
footer{margin-top:48px;text-align:center;font-size:.85rem;color:var(--muted)}
`

function toHtml(d: RunDigest): string {
  const w = W[d.lang]
  const e = esc
  const parts: string[] = []
  parts.push(`<header><h1>${e(d.title)}</h1><div class="sub">${e(d.subtitle)} · ${e(w.by!)} ${e(d.author)}</div>${d.notice ? `<p class="notice">${e(d.notice)}</p>` : ''}${d.finished ? '' : `<p class="muted">${e(w.unfinished!)} ${d.dayReached} ${e(w.of!)} ${d.totalDays}</p>`}</header>`)
  if (d.days.length) {
    parts.push(`<h2>${e(w.days!)}</h2>`)
    let chapter = ''
    for (const day of d.days) {
      if (day.chapter && day.chapter !== chapter) { chapter = day.chapter; parts.push(`<h3>${e(chapter)}</h3>`) }
      const li = day.moments.map(m => `<li><span class="muted">${e(m.slot)}${m.who ? ` · ${e(m.who)}` : ''}</span> ${e(m.text)}</li>`).join('')
      const ch = day.choices.length ? `<div class="choice">${e(w.choices!)}：${day.choices.map(e).join('；')}</div>` : ''
      parts.push(`<section class="card day"><b>${e(day.label)}</b><ul>${li}</ul>${ch}</section>`)
    }
  }
  if (d.quotes.length) {
    parts.push(`<h2>${e(w.quotes!)}</h2>`)
    for (const q of d.quotes) parts.push(`<blockquote><b${q.color ? ` style="color:${safeColor(q.color)}"` : ''}>${e(q.who)}</b>${e(q.text)}</blockquote>`)
  }
  if (d.promises.length) {
    parts.push(`<h2>${e(w.promises!)}</h2><ul>`)
    for (const x of d.promises) parts.push(`<li><span class="${x.status}">${x.status === 'kept' ? '✔' : x.status === 'broken' ? '✘' : '…'} ${e(w[x.status]!)}</span> · ${e(x.who)}：${e(x.text)}</li>`)
    parts.push('</ul>')
  }
  if (d.keepsakes.length) {
    parts.push(`<h2>${e(w.keepsakes!)}</h2><div class="grid">`)
    for (const k of d.keepsakes) parts.push(`<div class="item">${gridSvg(k.grid, 7, k.title)}<div><b>${e(k.title)}</b><div class="muted">${e(k.who)} · ${e(k.day)}</div><div>${e(k.desc)}</div></div></div>`)
    parts.push('</div>')
  }
  parts.push(`<h2>${e(w.cast!)}</h2><div class="grid">`)
  for (const c of d.cast) parts.push(`<div class="item">${c.grid ? gridSvg(c.grid, 4, c.name) : ''}<div><b style="color:${safeColor(c.color)}">${e(c.name)}</b><div class="muted">${e(c.stage)} ${e(c.meter)}</div></div></div>`)
  parts.push('</div>')
  if (d.ending) {
    const kind = d.ending.kind ? ` <span class="muted">${e(w[d.ending.kind] ?? d.ending.kind)}</span>` : ''
    parts.push(`<h2>${e(w.ending!)}</h2><section class="ending"><h3>${e(d.ending.title)}${kind}</h3>${d.ending.text.split(/\n+/).filter(Boolean).map(p => `<p>${e(p)}</p>`).join('')}</section>`)
  }
  parts.push(`<footer>${e(w.made!)}</footer>`)
  return `<!doctype html>
<html lang="${d.lang === 'zh' ? 'zh-CN' : 'en'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>${e(d.title)}</title>
<style>${CSS}</style>
</head>
<body><main>
${parts.join('\n')}
</main></body>
</html>
`
}

/** 导出这一局：标题、每天的剧情摘要、关键台词、做过的选择、约定、信物（像素图）、人物、结局 */
export function exportRun(story: Story, pack: Pack, lang: Lang, format: ExportFormat, extra: ExportExtra = {}): string {
  const d = runDigest(story, pack, lang, extra)
  return format === 'html' ? toHtml(d) : toMarkdown(d)
}

/** 建议的文件名（不含目录）：<包 id>-<结局 id 或 day-n>.<md|html> */
export function exportFileName(story: Story, pack: Pack, format: ExportFormat): string {
  const tail = story.endingId || `day-${story.day}`
  return `${pack.id}-${tail}`.replace(/[^a-z0-9_-]+/gi, '-') + `.${format}`
}

/** 一段可以直接贴到社交平台的短文本（不超过 limit 个字符） */
export function shareSummary(story: Story, pack: Pack, lang: Lang, limit = 220): string {
  const T = packText(pack, lang)
  const title = T(pack.title)
  const ending = pack.endings.find(e => e.id === story.endingId)
  const top = pack.cast
    .map(c => ({ c, h: story.heroines[c.id] }))
    .filter(x => x.h)
    .sort((a, b) => b.h!.stage - a.h!.stage || b.h!.affection - a.h!.affection)[0]
  const kept = story.promises.filter(x => x.status === 'kept').length
  const gifts = story.keepsakes.length
  const finished = story.phase === 'ending' || !!story.ending
  const kindWord = ending?.kind ? W[lang][ending.kind] : ''
  const tag = lang === 'zh' ? '#aigalgame #AI视觉小说' : '#aigalgame #visualnovel'
  let text: string
  if (lang === 'zh') {
    const head = finished
      ? `我在《${title}》里过完了 ${pack.days} 天，走到「${T(ending?.title) || '结局'}」${kindWord ? `（${kindWord}）` : ''}。`
      : `我在《${title}》里玩到了第 ${story.day} 天（共 ${pack.days} 天）。`
    const who = top && top.h!.affection > 0 ? `最在意的人：${T(top.c.name)}（${T(pack.stages[top.h!.stage])}）。` : ''
    text = `${head}${who}兑现 ${kept} 个约定，收下 ${gifts} 件信物。${tag}`
  } else {
    const head = finished
      ? `I lived through all ${pack.days} days of "${title}" and reached "${T(ending?.title) || 'an ending'}"${kindWord ? ` (${kindWord})` : ''}.`
      : `I'm on day ${story.day} of ${pack.days} in "${title}".`
    const who = top && top.h!.affection > 0 ? ` Closest to: ${T(top.c.name)} (${T(pack.stages[top.h!.stage])}).` : ''
    text = `${head}${who} Promises kept: ${kept}. Keepsakes: ${gifts}. ${tag}`
  }
  if ([...text].length <= limit) return text
  // 超长时截断（标题很长的包）
  return [...text].slice(0, limit - 1).join('') + '…'
}


// ---------- 结局卡：不剧透的分享方格（像 Wordle 那样） ----------

const CARD_KIND: Record<Lang, Record<string, string>> = {
  zh: { true: '★ 真结局', good: '☆ 好结局', normal: '· 普通结局', bad: '✗ 坏结局', none: '· 结局' },
  en: { true: '★ True ending', good: '☆ Good ending', normal: '· Normal ending', bad: '✗ Bad ending', none: '· Ending' },
}
export const CARD_URL = 'github.com/Ephemeral6/ai-galgame'

/**
 * 结局卡：只写结局等级，不写结局名和剧情，方便贴出去比较又不剧透。
 * 包名 · 每日挑战日期 / 结局等级 / 幕数 · 约定兑现方格 · 信物数 · 回退次数 / 她的关系值图标 / 仓库地址。
 * 没到结局时第二行写「进行到第 n 天」。
 */
export function endingCard(story: Story, pack: Pack, lang: Lang): string {
  const T = packText(pack, lang)
  const ending = pack.endings.find(e => e.id === story.endingId)
  const finished = story.phase === 'ending' || !!story.endingId
  const kind = ending?.kind ?? (ending ? (ending.tier >= 4 ? 'true' : ending.tier >= 3 ? 'good' : ending.tier >= 1 ? 'normal' : 'normal') : 'none')
  const daily = story.daily ? (lang === 'zh' ? ` · 每日挑战 ${story.daily.slice(5)}` : ` · daily ${story.daily.slice(5)}`) : ''
  const head = `ai-galgame · ${T(pack.title)}${daily}`
  const line2 = finished ? CARD_KIND[lang][kind]! : lang === 'zh' ? `进行到第 ${story.day} 天 / ${pack.days}` : `Day ${story.day} of ${pack.days}, in progress`
  const marks = story.promises.slice(0, 10).map(x => (x.status === 'kept' ? '✓' : x.status === 'broken' ? '✗' : '○')).join('') || '—'
  const scenes = story.album.length
  const line3 = lang === 'zh'
    ? `${scenes} 幕 · 约定 ${marks} · 信物 ${story.keepsakes.length} · 回退 ${story.rewinds} 次`
    : `${scenes} scenes · promises ${marks} · keepsakes ${story.keepsakes.length} · undos ${story.rewinds}`
  // 关系值：结局绑定的人，没有就取最亲近的人；图标用她的 meter（非恋爱角色不用心形）
  const who = ending?.who ?? pack.cast.map(c => c.id).sort((a, b) => (story.heroines[b]?.affection ?? 0) - (story.heroines[a]?.affection ?? 0))[0]
  const c = pack.cast.find(x => x.id === who)
  const h = who ? story.heroines[who] : undefined
  const mt = meterOf(c)
  const max = pack.gates[4]?.affection ?? 12
  const full = Math.max(0, Math.min(5, Math.round(((h?.affection ?? 0) / Math.max(1, max)) * 5)))
  const line4 = c ? mt.full.repeat(full) + mt.empty.repeat(5 - full) : ''
  return [head, line2, line3, line4, CARD_URL].filter(Boolean).join('\n')
}
