// AI 原生机制：离开很久后她发来的消息、每天夜里小镇的幕后、她的日记 / 视角、「你在她眼里」。
// 全部用 Haiku、一次调用、只在需要时生成（日记和画像打开时才写，写完缓存进存档），每一项都能在设置里关掉。
// 跨周目回声和选择倾向不调用模型：回声来自上一局的相册摘要，倾向来自选项的 tone，直接写进每一幕的提示。
// 这里不读写 $.state。

import type { EngineInterface } from 'claude-code'

import type { Lang, Pack, Story, Tone, Usage } from '../types'
import { CHECKER, profileLine, zeroUsage } from './engine'
import { costOf } from './cost'
import { awayBrief, diaryBrief, gossipFor } from './craft'
import { castOf, dayText, meterOf, packText } from './pack'

export const EXTRA_MODEL = CHECKER
export type Extra = { text: string | null; usage: Usage }

/** 额外功能的开关键（设置页逐项可关） */
export type ExtraKey = 'echoes' | 'letters' | 'gossip' | 'diary' | 'portrait' | 'letItBe'
export const EXTRA_KEYS: ExtraKey[] = ['echoes', 'letters', 'gossip', 'diary', 'portrait', 'letItBe']
/** 真实时间离开多久算「很久」 */
export const AWAY_MS = 6 * 3600 * 1000

function langLine(lang: Lang): string {
  return lang === 'en' ? 'Write in natural English.' : '用简体中文写。'
}

async function haiku($: EngineInterface, prompt: string, maxTokens: number): Promise<Extra> {
  const u = zeroUsage()
  try {
    const r = await $.model.complete({ model: EXTRA_MODEL, prompt: [{ text: prompt }], maxTokens, timeoutMs: 30_000 })
    u.extra = 1
    u.extraIn = r.usage.input_tokens + r.usage.cache_read_input_tokens + r.usage.cache_creation_input_tokens
    u.extraOut = r.usage.output_tokens
    u.cost = costOf(EXTRA_MODEL, r.usage)
    const text = r.isAnswered ? r.text.trim().replace(/^["「]|["」]$/g, '') : ''
    return { text: text || null, usage: u }
  } catch {
    return { text: null, usage: u }
  }
}

function brief(p: Pack, lang: Lang, id: string): string {
  const T = packText(p, lang)
  const c = castOf(p, id)
  if (!c) return id
  return `${T(c.name)} — ${T(c.tagline ?? c.look)}; voice: ${T(c.voice)}; e.g. ${c.samples.slice(0, 2).map(x => `「${T(x)}」`).join(' ')}${meterOf(c).romance ? '' : ' (not a romance)'}`
}

/** 离开时她最可能想起谁：好感最高、见过面的那位 */
export function letterFrom(p: Pack, s: Story): string | null {
  const met = p.cast.filter(c => (s.heroines[c.id]?.lastDay ?? 0) > 0)
  if (!met.length) return null
  return met.sort((a, b) => (s.heroines[b.id]?.affection ?? 0) - (s.heroines[a.id]?.affection ?? 0))[0]!.id
}

/** 你离开很久（真实时间）后回来：她发来一条消息，说说你不在的时候 */
export async function awayLetter($: EngineInterface, p: Pack, s: Story, hours: number, lang: Lang): Promise<{ from: string; text: string } | null> {
  const from = letterFrom(p, s)
  if (!from) return null
  const T = packText(p, lang)
  const last = s.album.filter(m => m.heroine === from).slice(-3).map(m => m.text).join(' / ') || 'none'
  const r = await haiku($, `You write one short message from a character in the visual novel "${T(p.title)}" to the player-character ("me"), who has been away for about ${Math.round(hours)} real hours.
Character: ${brief(p, lang, from)}. Relationship stage: ${T(p.stages[s.heroines[from]?.stage ?? 0])}. Story time: ${dayText(p, lang, s.day)}.
Our recent moments: ${last}.
2-3 sentences in her voice: what happened while I was gone (small, concrete, in-world), and a light nudge to come back. Do not reveal secrets, do not invent major plot events. Plain text only. ${langLine(lang)}
${awayBrief(p, from, lang, Math.max(1, Math.round(hours / 24)))}`, 220)
  return r.text ? { from, text: r.text.slice(0, 400) } : null
}

/** 一天结束时，小镇里发生的幕后事：配角之间的八卦或某件小事，1-2 句 */
export async function nightGossip($: EngineInterface, p: Pack, s: Story, day: number, lang: Lang): Promise<Extra> {
  const T = packText(p, lang)
  const npcs = (p.npcs ?? []).map(n => `${T(n.name)}: ${T(n.role)}`).join('; ') || 'none'
  const today = s.album.filter(m => m.day === day).map(m => m.text).join(' / ') || 'nothing in particular'
  return haiku($, `Offstage in the visual novel "${T(p.title)}" (${T(p.premise).slice(0, 300)}): it is the night after ${dayText(p, lang, day)}.
Supporting characters: ${npcs}. Heroines: ${p.cast.map(c => T(c.short)).join(', ')}.
What I did today: ${today}.
${gossipFor(p, s, lang, 2).map(g => `Possible material (mark whether it is true, half-true or a misunderstanding): ${g}`).join('\n')}
Write 1-2 sentences of small-town gossip or something that happened offstage tonight, between supporting characters or about the heroines, that the player did not see. Concrete and in-world; no secrets revealed, no major plot changes. Plain text only. ${langLine(lang)}`, 160)
}

/** 她的日记：同一天、她的视角，常常重新解读「我」以为的事 */
export async function diaryEntry($: EngineInterface, p: Pack, s: Story, id: string, day: number, lang: Lang, guide = diaryBrief(p, s, id, lang)): Promise<Extra> {
  const T = packText(p, lang)
  const c = castOf(p, id)
  const moments = s.album.filter(m => m.heroine === id && m.day === day).map(m => m.text).join(' / ') || 'we did not meet today'
  const stage = s.heroines[id]?.stage ?? 0
  const secret = stage >= 3 && c ? `Her secret (she may write about it now): ${T(c.secret)}` : 'She keeps her secret to herself; hint at most.'
  return haiku($, `Write ${T(c?.name)}'s private diary entry for ${dayText(p, lang, day)} in the visual novel "${T(p.title)}".
Her: ${brief(p, lang, id)}. ${secret}
What happened between us that day (from my side): ${moments}.
${guide ? `Writing guide: ${guide}\n` : ''}4-6 sentences in her own voice. Reinterpret at least one moment: what she noticed that I did not, or why she really said what she said. No headings, plain text. ${langLine(lang)}`, 320)
}

/** 「你在她眼里」：根据我的选择倾向与约定，她怎么看我 */
export async function portraitOf($: EngineInterface, p: Pack, s: Story, id: string, lang: Lang): Promise<Extra> {
  const T = packText(p, lang)
  const mine = s.promises.filter(x => x.heroine === id)
  const kept = mine.filter(x => x.status === 'kept').length
  const broken = mine.filter(x => x.status === 'broken').length
  const moments = s.album.filter(m => m.heroine === id).slice(-5).map(m => m.text).join(' / ') || 'few'
  return haiku($, `In the visual novel "${T(p.title)}", ${T(castOf(p, id)?.name)} sums up what kind of person "I" am.
Her: ${brief(p, lang, id)}.
My habits in choices: ${profileLine(s) || 'not enough to tell yet'}. Promises to her: kept ${kept}, broken ${broken}. Our moments: ${moments}.
2-3 sentences in her voice, direct and specific ("you always..."), affectionate or sharp as fits our relationship. Plain text only. ${langLine(lang)}`, 200)
}

/** 选择倾向：百分比条，给相册页用（不调用模型） */
export function tendencies(s: Story): { tone: Tone; n: number; share: number }[] {
  const total = Object.values(s.profile).reduce((a, b) => a + (b ?? 0), 0)
  return (Object.entries(s.profile) as [Tone, number][]).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).map(([tone, n]) => ({ tone, n, share: total ? n / total : 0 }))
}
