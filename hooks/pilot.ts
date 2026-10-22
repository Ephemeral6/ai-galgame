// 自动游玩：替玩家选地点、选主动来找的人、选选项。
// 每个决策最多 1 次 Haiku 调用，提示只用状态摘要（不带设定集，不打缓存标记），只要编号和一句理由。
// 「混乱」策略随机选，不调用模型。这里不读写 $.state。

import type { EngineInterface } from 'claude-code'

import type { AutoStrategy, Lang, Pack, Story, Usage } from '../types'
import { CHECKER, zeroUsage } from './engine'
import { castOf, dayText, meterOf, packText } from './pack'

export const PILOT_MODEL = CHECKER
export type Decision = { index: number; why: string; usage: Usage; error?: string }
export type DecisionKind = 'place' | 'choice' | 'target'

const STRATEGY: Record<Exclude<AutoStrategy, 'chaos'>, string> = {
  focus: 'Focus: pursue ONE character (the target below). Prefer places and replies that bring you closer to the target; keep promises to the target.',
  whim: 'Whim: follow your own curiosity about the story. Pick whatever you most want to see happen next, dramatically.',
  collect: 'Collector: prefer people you have not met yet, places you have not visited, and paths toward endings not yet unlocked.',
}

/** 已去过的地点：伏笔簿里每条都是「地点：选项」 */
function visitedPlaces(s: Story): string[] {
  return [...new Set(s.notes.map(n => n.text.split('：')[0] ?? '').filter(Boolean))]
}

export function pilotPrompt(
  p: Pack, s: Story, kind: DecisionKind, options: string[], strategy: Exclude<AutoStrategy, 'chaos'>, target: string,
  meta: { endingsSeen: string[] }, lang: Lang,
): string {
  const T = packText(p, lang)
  const people = p.cast.map(c => {
    const h = s.heroines[c.id]
    const nr = meterOf(c).romance ? '' : ', not a romance'
    return `${c.id} ${T(c.short)}: stage ${h?.stage ?? 0}, affection ${h?.affection ?? 0}, last seen day ${h?.lastDay || '-'}${nr}`
  }).join('; ')
  const promises = s.promises.filter(x => x.status === 'open').map(x => `${x.heroine} "${x.text}" by day ${x.due}`).join('; ') || 'none'
  const last = s.album.slice(-2).map(m => m.text).join(' / ') || 'none'
  const collect = strategy === 'collect'
    ? `\nNot met yet: ${p.cast.filter(c => !s.album.some(m => m.heroine === c.id)).map(c => c.id).join(', ') || 'none'}. Places visited: ${visitedPlaces(s).join(', ') || 'none'}.\nEndings not unlocked: ${p.endings.filter(e => !meta.endingsSeen.includes(e.id)).slice(0, 8).map(e => `${T(e.title)}${e.who ? ` (${e.who})` : ''}`).join('; ') || 'all unlocked'}${s.loop >= 2 ? ' — this is a replay, steer toward one of these.' : ''}`
    : ''
  const focus = strategy === 'focus' && target ? `\nTarget: ${target} ${T(castOf(p, target)?.name)}` : ''
  const ask = kind === 'target' ? 'Which character do you want to pursue?' : kind === 'place' ? 'Where do I go now?' : 'What do I do?'
  return `[Autoplay] You make one choice for the player of the visual novel "${T(p.title)}". ${STRATEGY[strategy]}
${dayText(p, lang, s.day)} of ${p.days}, ${T(p.slots[s.slot])}. People: ${people}.
Open promises: ${promises}. Last scenes: ${last}.${collect}${focus}
${ask}
${options.map((o, i) => `${i + 1}. ${o}`).join('\n')}
Reply with JSON only: {"pick": <option number>, "why": "<one short sentence${lang === 'zh' ? ' in Simplified Chinese' : ' in English'}>"}`
}

/** 解析 {"pick": n, "why": "..."}；也接受「2：理由」 */
export function parsePick(text: string | null, n: number): { index: number; why: string } | null {
  if (!text) return null
  const a = text.indexOf('{')
  const b = text.lastIndexOf('}')
  if (a >= 0 && b > a) {
    try {
      const j = JSON.parse(text.slice(a, b + 1)) as Record<string, unknown>
      const k = Math.round(Number(j.pick))
      if (k >= 1 && k <= n) return { index: k - 1, why: String(j.why ?? '').slice(0, 80) }
    } catch {
      // 落到下面的宽松解析
    }
  }
  const m = /^\s*(\d+)\s*[:：.、-]?\s*(.*)$/s.exec(text)
  if (m && Number(m[1]) >= 1 && Number(m[1]) <= n) return { index: Number(m[1]) - 1, why: (m[2] ?? '').trim().slice(0, 80) }
  return null
}

/** 一个决策。混乱策略随机、零调用；其余 1 次 Haiku 调用 */
export async function decide(
  $: EngineInterface, p: Pack, s: Story, kind: DecisionKind, options: string[], strategy: AutoStrategy, target: string,
  meta: { endingsSeen: string[] }, lang: Lang, rand: () => number = Math.random,
): Promise<Decision> {
  const u = zeroUsage()
  if (options.length <= 1) return { index: 0, why: '', usage: u }
  if (strategy === 'chaos') return { index: Math.floor(rand() * options.length) % options.length, why: lang === 'zh' ? '随便选的' : 'picked at random', usage: u }
  try {
    const r = await $.model.complete({ model: PILOT_MODEL, prompt: [{ text: pilotPrompt(p, s, kind, options, strategy, target, meta, lang) }], maxTokens: 120, timeoutMs: 30_000 })
    u.pilot = 1
    u.pilotIn = r.usage.input_tokens + r.usage.cache_read_input_tokens + r.usage.cache_creation_input_tokens
    u.pilotOut = r.usage.output_tokens
    if (!r.isAnswered) return { index: 0, why: '', usage: u, error: lang === 'zh' ? 'AI 没有回答' : 'the AI gave no answer' }
    const pick = parsePick(r.text, options.length)
    if (!pick) return { index: 0, why: lang === 'zh' ? '（没读懂 AI 的回答，按第 1 个）' : '(could not read the answer; took option 1)', usage: u }
    return { ...pick, usage: u }
  } catch (err) {
    return { index: 0, why: '', usage: u, error: String((err as Error)?.message ?? err).slice(0, 80) }
  }
}
