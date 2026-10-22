// 剧本包：多语言取值、格式校验、按 id 查人物 / 配角 / 章节。

import type { ActDef, BeatDef, CastDef, L, Lang, NpcDef, Pack, SpriteDef } from '../types'
import { validateCraft } from './craft'

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

export function npcOf(p: Pack, id: string): NpcDef | undefined {
  return (p.npcs ?? []).find(c => c.id === id)
}

/** 主角色或配角：界面和舞台只需要这些 */
export type Person = { id: string; name: L; short: L; color: string; sprite?: SpriteDef; npc: boolean }

export function personOf(p: Pack, id: string): Person | undefined {
  const c = castOf(p, id)
  if (c) return { id, name: c.name, short: c.short, color: c.color, sprite: c.sprite, npc: false }
  const n = npcOf(p, id)
  if (n) return { id, name: n.name, short: n.short ?? n.name, color: n.color, sprite: n.sprite, npc: true }
  return undefined
}

/** 关系值的显示：图标与含义；没写 meter 的恋爱角色用 ♥ ♡ */
export function meterOf(c: CastDef | undefined): { full: string; empty: string; label?: L; romance: boolean } {
  const m = c?.meter
  return { full: m?.full ?? '♥', empty: m?.empty ?? '♡', label: m?.label, romance: c?.romance !== false }
}

/** 第 day 天所在的一幕 */
export function actOf(p: Pack, day: number): ActDef | undefined {
  let a: ActDef | undefined
  for (const x of p.acts ?? []) if (day >= x.from) a = x
  return a
}

export function allBeats(p: Pack): BeatDef[] {
  return (p.acts ?? []).flatMap(a => a.beats)
}

export function beatOf(p: Pack, id: string | undefined): BeatDef | undefined {
  return id ? allBeats(p).find(b => b.id === id) : undefined
}

export function dayText(p: Pack, lang: Lang, day: number): string {
  return tr(p.dayLabel, lang, p.defaultLang).replace('{n}', String(day))
}

/** 章节名：有 chapters 用 chapters，否则用 acts 的标题 */
export function chapterOf(p: Pack, lang: Lang, day: number): string {
  let t = ''
  const list: { from: number; title: L }[] = p.chapters?.length ? p.chapters : (p.acts ?? [])
  for (const c of list) if (day >= c.from) t = tr(c.title, lang, p.defaultLang)
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

function knownFlag(f: unknown, beats: Set<string>, incs: Set<string>): boolean {
  if (typeof f !== 'string') return false
  if (f.startsWith('beat:')) return beats.has(f.slice(5))
  if (f.startsWith('inc:')) return incs.has(f.slice(4))
  return false
}

function checkHaunts(h: unknown, at: string, nSlots: number, places: Set<string>, err: string[]): void {
  if (!h || typeof h !== 'object' || Array.isArray(h)) { err.push(`${at}.haunts: { slot: [placeId] }`); return }
  for (const [slot, ids] of Object.entries(h as Record<string, unknown>)) {
    if (!(Number(slot) >= 0 && Number(slot) < nSlots)) err.push(`${at}.haunts: slot ${slot} out of range`)
    if (!(Array.isArray(ids) && ids.every(id => places.has(id)))) err.push(`${at}.haunts[${slot}]: unknown place`)
  }
}

/**
 * 校验一个剧本包（内置的、目录里的、导入的都走这里）。返回问题列表，空表示通过。
 * 只校验数据：剧本包是纯 JSON 数据，不含代码。新字段（npcs、relations、acts、incidents）都可省略，旧包照常通过。
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
  const days = typeof p.days === 'number' ? p.days : 0
  need(Number.isInteger(p.days) && days >= 1 && days <= 60, 'days: integer 1..60')
  need(Array.isArray(p.slots) && p.slots.length >= 1 && p.slots.length <= 4 && p.slots.every(isL), 'slots: 1..4 texts')
  const nSlots = Array.isArray(p.slots) ? p.slots.length : 0
  if (p.chapters !== undefined || !Array.isArray(p.acts)) {
    need(Array.isArray(p.chapters) && p.chapters.every(c => !!c && typeof c.from === 'number' && isL(c.title)), 'chapters: [{ from, title }] (may be left out when acts are written)')
  }
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

  // ---------- 主角色 ----------
  const castIds = new Set<string>()
  if (!Array.isArray(p.cast) || p.cast.length === 0 || p.cast.length > 6) err.push('cast: 1..6 characters')
  else for (const [i, c] of p.cast.entries()) {
    const at = `cast[${i}]`
    need(typeof c.id === 'string' && ID.test(c.id) && c.id !== 'me' && !castIds.has(c.id), `${at}.id: unique id, not "me"`)
    castIds.add(c.id)
    for (const k of ['name', 'short', 'look', 'voice', 'secret'] as const) need(isL(c[k]), `${at}.${k}: text`)
    if (c.tagline !== undefined) need(isL(c.tagline), `${at}.tagline: text`)
    if (c.romance !== undefined) need(typeof c.romance === 'boolean', `${at}.romance: true | false`)
    if (c.meter !== undefined) {
      const m = c.meter as Record<string, unknown> | null
      const ch = (x: unknown) => x === undefined || (typeof x === 'string' && [...x].length === 1)
      need(!!m && typeof m === 'object' && isL(m.label) && ch(m.full) && ch(m.empty), `${at}.meter: { label, full?: one character, empty?: one character }`)
    }
    need(typeof c.color === 'string' && HEX.test(c.color), `${at}.color: #rrggbb`)
    need(Array.isArray(c.samples) && c.samples.length > 0 && c.samples.every(isL), `${at}.samples: [text, ...]`)
    need(Array.isArray(c.arc) && c.arc.length === 5 && c.arc.every(isL), `${at}.arc: exactly 5 texts`)
    need(!!c.deadline && typeof c.deadline.day === 'number' && isL(c.deadline.text), `${at}.deadline: { day, text }`)
    checkHaunts(c.haunts, at, nSlots, placeIds, err)
    err.push(...validateSprite(c.sprite, `${at}.sprite`))
  }

  // ---------- 配角 ----------
  const npcIds = new Set<string>()
  if (p.npcs !== undefined) {
    if (!Array.isArray(p.npcs) || p.npcs.length > 8) err.push('npcs: 0..8 characters')
    else for (const [i, n] of p.npcs.entries()) {
      const at = `npcs[${i}]`
      need(typeof n.id === 'string' && ID.test(n.id) && n.id !== 'me' && !castIds.has(n.id) && !npcIds.has(n.id), `${at}.id: unique id (also among cast), not "me"`)
      npcIds.add(n.id)
      for (const k of ['name', 'role', 'voice'] as const) need(isL(n[k]), `${at}.${k}: text`)
      if (n.short !== undefined) need(isL(n.short), `${at}.short: text`)
      if (n.look !== undefined) need(isL(n.look), `${at}.look: text`)
      need(typeof n.color === 'string' && HEX.test(n.color), `${at}.color: #rrggbb`)
      need(Array.isArray(n.samples) && n.samples.length > 0 && n.samples.every(isL), `${at}.samples: [text, ...]`)
      if (n.haunts !== undefined) checkHaunts(n.haunts, at, nSlots, placeIds, err)
      if (n.sprite !== undefined) err.push(...validateSprite(n.sprite, `${at}.sprite`))
    }
  }
  const anyone = (id: unknown) => typeof id === 'string' && (castIds.has(id) || npcIds.has(id))

  // ---------- 关系 ----------
  if (p.relations !== undefined) {
    if (!Array.isArray(p.relations)) err.push('relations: array')
    else for (const [i, r] of p.relations.entries()) {
      const at = `relations[${i}]`
      need((anyone(r.a) || r.a === 'me') && (anyone(r.b) || r.b === 'me') && r.a !== r.b, `${at}: a, b are two known ids (cast, npc or "me")`)
      need(isL(r.kind) && isL(r.text), `${at}: kind, text`)
      if (r.hiddenUntil !== undefined) need(Number.isInteger(r.hiddenUntil) && r.hiddenUntil >= 0 && r.hiddenUntil <= 4, `${at}.hiddenUntil: stage 0..4`)
    }
  }

  // ---------- 分幕与关键事件 ----------
  const beatIds = new Set<string>()
  const promiseBeats = new Set<string>()
  if (p.acts !== undefined) {
    if (!Array.isArray(p.acts) || p.acts.length === 0) err.push('acts: at least one act, or leave it out')
    else {
      const actIds = new Set<string>()
      let last = 0
      for (const [i, a] of p.acts.entries()) {
        const at = `acts[${i}]`
        need(typeof a.id === 'string' && ID.test(a.id) && !actIds.has(a.id), `${at}.id: unique id`)
        actIds.add(a.id)
        need(isL(a.title) && isL(a.goal), `${at}: title, goal`)
        need(Number.isInteger(a.from) && a.from >= 1 && a.from <= days && a.from > last, `${at}.from: 1..days, ascending`)
        if (i === 0) need(a.from === 1, `${at}.from: the first act starts on day 1`)
        last = a.from
        if (a.hook !== undefined) need(isL(a.hook), `${at}.hook: text`)
        if (!Array.isArray(a.beats)) { err.push(`${at}.beats: array`); continue }
        for (const [j, b] of a.beats.entries()) {
          const bt = `${at}.beats[${j}]`
          need(typeof b.id === 'string' && ID.test(b.id) && !beatIds.has(b.id), `${bt}.id: unique id`)
          beatIds.add(b.id)
          need(Number.isInteger(b.day) && b.day >= 1 && b.day <= days, `${bt}.day: 1..days`)
          if (b.by !== undefined) need(Number.isInteger(b.by) && b.by >= b.day && b.by <= days, `${bt}.by: day..days`)
          need(isL(b.text), `${bt}.text: text`)
          if (b.kind !== undefined) need(isL(b.kind), `${bt}.kind: text`)
          if (b.who !== undefined) need(Array.isArray(b.who) && b.who.every(anyone), `${bt}.who: known ids`)
          if (b.promise !== undefined) { need(isL(b.promise), `${bt}.promise: text`); promiseBeats.add(b.id) }
        }
      }
    }
  }

  // ---------- 随机事件 ----------
  const incIds = new Set<string>()
  if (p.incidents !== undefined) {
    if (!Array.isArray(p.incidents)) err.push('incidents: array')
    else {
      for (const x of p.incidents) if (x && typeof x.id === 'string') incIds.add(x.id)
      const seen = new Set<string>()
      for (const [i, x] of p.incidents.entries()) {
        const at = `incidents[${i}]`
        need(typeof x.id === 'string' && ID.test(x.id) && !seen.has(x.id), `${at}.id: unique id`)
        seen.add(x.id)
        need(isL(x.text), `${at}.text: text`)
        if (x.chance !== undefined) need(typeof x.chance === 'number' && x.chance >= 0 && x.chance <= 1, `${at}.chance: 0..1`)
        if (x.days !== undefined) need(Array.isArray(x.days) && x.days.length === 2 && x.days[0] >= 1 && x.days[0] <= x.days[1] && x.days[1] <= days, `${at}.days: [from, to] within 1..days`)
        if (x.slots !== undefined) need(Array.isArray(x.slots) && x.slots.every(s => Number.isInteger(s) && s >= 0 && s < nSlots), `${at}.slots: slot indexes`)
        if (x.places !== undefined) need(Array.isArray(x.places) && x.places.every(id => placeIds.has(id)), `${at}.places: known place ids`)
        if (x.who !== undefined) need(Array.isArray(x.who) && x.who.every(anyone), `${at}.who: known ids`)
        if (x.need !== undefined) need(!!x.need && castIds.has(x.need.who), `${at}.need.who: a cast id`)
        if (x.after !== undefined) need(Array.isArray(x.after) && x.after.every(f => knownFlag(f, beatIds, incIds)), `${at}.after: 'beat:<id>' or 'inc:<id>'`)
      }
    }
  }

  if (Array.isArray(p.events)) for (const [i, e] of p.events.entries()) need(typeof e.day === 'number' && isL(e.text), `events[${i}]: { day, text }`)
  else err.push('events: array')
  if (Array.isArray(p.fixed)) for (const [i, f] of p.fixed.entries()) {
    need(typeof f.day === 'number' && f.day >= 1 && f.day <= days, `fixed[${i}].day: 1..days`)
    need(Number.isInteger(f.slot) && f.slot >= 0 && f.slot < nSlots, `fixed[${i}].slot: slot index`)
    need(isL(f.place) && isL(f.mood) && isL(f.title), `fixed[${i}]: place, mood, title`)
    need(Array.isArray(f.cast) && f.cast.every(anyone), `fixed[${i}].cast: known ids`)
  }
  else err.push('fixed: array')

  if (!Array.isArray(p.endings) || p.endings.length === 0) err.push('endings: at least one')
  else {
    const ids = new Set<string>()
    for (const [i, e] of p.endings.entries()) {
      const at = `endings[${i}]`
      need(typeof e.id === 'string' && ID.test(e.id) && !ids.has(e.id), `${at}.id: unique id`)
      ids.add(e.id)
      need(isL(e.title) && isL(e.brief) && typeof e.tier === 'number', `${at}: title, brief, tier`)
      need(e.who === undefined || castIds.has(e.who), `${at}.who: known id`)
      for (const k of ['minStage', 'minAffection', 'maxAffection', 'maxBroken', 'minBroken', 'minKept', 'minKeepsakes', 'minLoop'] as const) {
        if (e[k] !== undefined) need(typeof e[k] === 'number', `${at}.${k}: number`)
      }
      if (e.keptKey !== undefined) need(promiseBeats.has(e.keptKey), `${at}.keptKey: id of a beat that has a promise`)
      if (e.flags !== undefined) need(Array.isArray(e.flags) && e.flags.every(f => knownFlag(f, beatIds, incIds)), `${at}.flags: 'beat:<id>' or 'inc:<id>'`)
      if (e.kind !== undefined) need(['true', 'good', 'normal', 'bad'].includes(e.kind), `${at}.kind: true | good | normal | bad`)
    }
    need(p.endings.some(e => e.who === undefined && e.minStage === undefined && e.minAffection === undefined && e.maxAffection === undefined
      && e.minLoop === undefined && e.flags === undefined && e.keptKey === undefined), 'endings: needs one fallback ending with no conditions')
  }
  const tl = p.features?.timeLoop
  if (tl) need(typeof tl.maxLoops === 'number' && tl.maxLoops >= 1 && typeof tl.minTier === 'number' && isL(tl.text), 'features.timeLoop: { maxLoops ≥ 1, minTier, text }')
  // 写作手法层（可选）：没有 craft 的包这里是 []
  err.push(...validateCraft(raw))
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
