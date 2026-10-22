// 剧本包：多语言取值、格式校验、按 id 查人物。

import type { CastDef, L, Lang, Pack } from '../types'

/** 取一段可本地化文本：先要所选语言，再回落到包的默认语言，再回落到任意一种 */
export function tr(x: L | undefined, lang: Lang, fallback: Lang): string {
  if (x === undefined) return ''
  if (typeof x === 'string') return x
  return x[lang] ?? x[fallback] ?? x.zh ?? x.en ?? ''
}

/** 绑定一个包与语言的取值函数 */
export function packText(p: Pack, lang: Lang): (x: L | undefined) => string {
  return x => tr(x, lang, p.defaultLang)
}

export function castOf(p: Pack, id: string): CastDef | undefined {
  return p.cast.find(c => c.id === id)
}

export function dayText(p: Pack, lang: Lang, day: number): string {
  return tr(p.dayLabel, lang, p.defaultLang).replace('{n}', String(day))
}

export function chapterOf(p: Pack, lang: Lang, day: number): string {
  let t = ''
  for (const c of p.chapters) if (day >= c.from) t = tr(c.title, lang, p.defaultLang)
  return t
}

const HEX = /^#[0-9a-fA-F]{6}$/
const ID = /^[a-z][a-z0-9_-]{0,31}$/

function isL(x: unknown): boolean {
  if (typeof x === 'string') return x.length > 0
  if (!x || typeof x !== 'object' || Array.isArray(x)) return false
  const o = x as Record<string, unknown>
  const vals = Object.entries(o)
  return vals.length > 0 && vals.every(([k, v]) => (k === 'zh' || k === 'en') && typeof v === 'string')
}

/**
 * 校验一个剧本包（内置的、目录里的、导入的都走这里）。返回问题列表，空表示通过。
 * 只校验数据：剧本包是纯 JSON 数据，不含代码。
 */
export function validatePack(raw: unknown): string[] {
  const err: string[] = []
  const need = (ok: boolean, msg: string) => { if (!ok) err.push(msg) }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return ['pack: not an object']
  const p = raw as Partial<Pack> & Record<string, unknown>
  need(typeof p.id === 'string' && ID.test(p.id), 'id: lowercase letters/digits/-/_ , starts with a letter, ≤32')
  need(typeof p.version === 'string', 'version: string')
  need(p.defaultLang === 'zh' || p.defaultLang === 'en', 'defaultLang: zh | en')
  need(Array.isArray(p.langs) && p.langs.length > 0 && p.langs.every(l => l === 'zh' || l === 'en'), 'langs: [zh|en, ...]')
  need(typeof p.author === 'string' && p.author.length > 0, 'author: string')
  for (const k of ['title', 'subtitle', 'premise', 'style', 'me', 'dayLabel', 'finale'] as const) need(isL(p[k]), `${k}: text`)
  if (p.source !== 'original') {
    const s = p.source as Record<string, unknown> | undefined
    need(!!s && typeof s === 'object' && isL(s.work) && isL(s.author) && isL(s.license) && isL(s.adaptation), 'source: "original" or { work, author, license, adaptation }')
  }
  const days = p.days
  need(typeof days === 'number' && Number.isInteger(days) && days >= 1 && days <= 60, 'days: integer 1..60')
  need(Array.isArray(p.slots) && p.slots.length >= 1 && p.slots.length <= 4 && p.slots.every(isL), 'slots: 1..4 texts')
  const nSlots = Array.isArray(p.slots) ? p.slots.length : 0
  need(Array.isArray(p.chapters) && p.chapters.every(c => typeof c.from === 'number' && isL(c.title)), 'chapters: [{ from, title }]')
  need(Array.isArray(p.stages) && p.stages.length === 5 && p.stages.every(isL), 'stages: exactly 5 texts')
  need(Array.isArray(p.gates) && p.gates.length === 5 && p.gates.every(g => typeof g.affection === 'number' && typeof g.scenes === 'number'), 'gates: exactly 5 { affection, scenes }')
  need(Array.isArray(p.loading) && p.loading.length > 0 && p.loading.every(isL), 'loading: [text, ...]')
  need(typeof p.proactiveAfter === 'number' && p.proactiveAfter >= 0, 'proactiveAfter: number ≥ 0')

  const placeIds = new Set<string>()
  if (!Array.isArray(p.places) || p.places.length === 0) err.push('places: at least one')
  else for (const [i, pl] of p.places.entries()) {
    const at = `places[${i}]`
    need(typeof pl.id === 'string' && ID.test(pl.id) && !placeIds.has(pl.id), `${at}.id: unique id`)
    placeIds.add(pl.id)
    need(isL(pl.name) && isL(pl.mood), `${at}: name, mood`)
    need(Array.isArray(pl.slots) && pl.slots.length > 0 && pl.slots.every(s => Number.isInteger(s) && s >= 0 && s < nSlots), `${at}.slots: slot indexes`)
  }
  if (nSlots > 0 && Array.isArray(p.places)) {
    for (let s = 0; s < nSlots; s++) need(p.places.some(pl => Array.isArray(pl.slots) && pl.slots.includes(s)), `places: no place open in slot ${s}`)
  }

  const castIds = new Set<string>()
  if (!Array.isArray(p.cast) || p.cast.length === 0 || p.cast.length > 6) err.push('cast: 1..6 characters')
  else for (const [i, c] of p.cast.entries()) {
    const at = `cast[${i}]`
    need(typeof c.id === 'string' && ID.test(c.id) && c.id !== 'me' && !castIds.has(c.id), `${at}.id: unique id, not "me"`)
    castIds.add(c.id)
    for (const k of ['name', 'short', 'look', 'voice', 'secret'] as const) need(isL(c[k]), `${at}.${k}: text`)
    need(typeof c.color === 'string' && HEX.test(c.color), `${at}.color: #rrggbb`)
    need(Array.isArray(c.samples) && c.samples.length > 0 && c.samples.every(isL), `${at}.samples: [text, ...]`)
    need(Array.isArray(c.arc) && c.arc.length === 5 && c.arc.every(isL), `${at}.arc: exactly 5 texts`)
    need(!!c.deadline && typeof c.deadline.day === 'number' && isL(c.deadline.text), `${at}.deadline: { day, text }`)
    if (c.haunts && typeof c.haunts === 'object') {
      for (const [slot, ids] of Object.entries(c.haunts)) {
        need(Number(slot) >= 0 && Number(slot) < nSlots, `${at}.haunts: slot ${slot} out of range`)
        need(Array.isArray(ids) && ids.every(id => placeIds.has(id)), `${at}.haunts[${slot}]: unknown place`)
      }
    } else err.push(`${at}.haunts: { slot: [placeId] }`)
    err.push(...validateSprite(c.sprite, `${at}.sprite`))
  }

  if (Array.isArray(p.events)) for (const [i, e] of p.events.entries()) need(typeof e.day === 'number' && isL(e.text), `events[${i}]: { day, text }`)
  else err.push('events: array')
  if (Array.isArray(p.fixed)) for (const [i, f] of p.fixed.entries()) {
    need(typeof f.day === 'number' && f.day >= 1 && f.day <= (days ?? 0), `fixed[${i}].day: 1..days`)
    need(Number.isInteger(f.slot) && f.slot >= 0 && f.slot < nSlots, `fixed[${i}].slot: slot index`)
    need(isL(f.place) && isL(f.mood) && isL(f.title), `fixed[${i}]: place, mood, title`)
    need(Array.isArray(f.cast) && f.cast.every(id => castIds.has(id)), `fixed[${i}].cast: known ids`)
  }
  else err.push('fixed: array')

  if (!Array.isArray(p.endings) || p.endings.length === 0) err.push('endings: at least one')
  else {
    const ids = new Set<string>()
    for (const [i, e] of p.endings.entries()) {
      need(typeof e.id === 'string' && ID.test(e.id) && !ids.has(e.id), `endings[${i}].id: unique id`)
      ids.add(e.id)
      need(isL(e.title) && isL(e.brief) && typeof e.tier === 'number', `endings[${i}]: title, brief, tier`)
      need(e.who === undefined || castIds.has(e.who), `endings[${i}].who: known id`)
    }
    need(p.endings.some(e => e.who === undefined && e.minStage === undefined && e.minAffection === undefined), 'endings: needs one fallback ending with no conditions')
  }
  const tl = p.features?.timeLoop
  if (tl) need(typeof tl.maxLoops === 'number' && tl.maxLoops >= 1 && typeof tl.minTier === 'number' && isL(tl.text), 'features.timeLoop: { maxLoops ≥ 1, minTier, text }')
  return err
}

export function validateSprite(sp: unknown, at: string): string[] {
  const err: string[] = []
  if (!sp || typeof sp !== 'object') return [`${at}: missing`]
  const s = sp as Record<string, unknown>
  const pal = s.pal as Record<string, unknown> | undefined
  if (!pal || typeof pal !== 'object') return [`${at}.pal: { letter: "#rrggbb" }`]
  for (const [k, v] of Object.entries(pal)) {
    if (k.length !== 1 || k === '.') err.push(`${at}.pal: key "${k}" must be one letter`)
    if (typeof v !== 'string' || !HEX.test(v)) err.push(`${at}.pal.${k}: #rrggbb`)
  }
  const art = s.art
  if (!Array.isArray(art) || art.length < 4 || art.length > 12) err.push(`${at}.art: 4..12 rows`)
  else for (const [r, row] of art.entries()) {
    if (typeof row !== 'string' || row.length !== 14) { err.push(`${at}.art[${r}]: exactly 14 characters`); continue }
    for (const ch of row) if (ch !== '.' && !(ch in pal)) { err.push(`${at}.art[${r}]: letter "${ch}" not in pal`); break }
  }
  const pts = (x: unknown) => Array.isArray(x) && x.every(q => Array.isArray(q) && q.length === 2 && q.every(n => Number.isInteger(n) && n >= 0 && n < 14))
  if (!pts(s.eyes) || (s.eyes as unknown[]).length !== 2) err.push(`${at}.eyes: two [row, col]`)
  if (!pts(s.cheeks)) err.push(`${at}.cheeks: [[row, col], ...]`)
  if (!['tail', 'wings', 'ears', 'bob'].includes(String(s.motion))) err.push(`${at}.motion: tail | wings | ears | bob`)
  return err
}
