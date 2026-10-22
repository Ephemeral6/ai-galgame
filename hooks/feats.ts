// 成就、统计、每日挑战（纯函数）。

import type { EndingDef, Feats, Pack, PackMeta, Story } from '../types'

export type { Feats }

export const EMPTY_FEATS: Feats = { achievements: [], stats: { clears: 0, scenes: 0, cost: 0 }, today: { date: '', usd: 0 }, daily: {} }

export function okFeats(x: unknown): x is Feats {
  const f = x as Feats | null
  return !!f && Array.isArray(f.achievements) && !!f.stats && typeof f.stats.clears === 'number' && !!f.today && !!f.daily
}

export type AchievementId = 'first-scene' | 'first-true' | 'all-endings' | 'no-undo' | 'all-keepsakes' | 'autoplay-clear' | 'hundred-scenes' | 'daily-true' | 'bad-end' | 'second-run'
export const ACHIEVEMENTS: AchievementId[] = ['first-scene', 'first-true', 'all-endings', 'no-undo', 'all-keepsakes', 'autoplay-clear', 'hundred-scenes', 'daily-true', 'bad-end', 'second-run']

const isTrue = (e: EndingDef | undefined) => !!e && (e.kind === 'true' || (e.kind === undefined && e.tier >= 4))

/** 通关时新解锁的成就 */
export function achievementsOnFinish(p: Pack, s: Story, e: EndingDef, pm: PackMeta, f: Feats, autoplay: boolean): AchievementId[] {
  const got = new Set(f.achievements)
  const out: AchievementId[] = []
  const add = (id: AchievementId, ok: boolean) => { if (ok && !got.has(id)) out.push(id) }
  add('first-true', isTrue(e))
  add('all-endings', p.endings.every(x => pm.endings.includes(x.id) || x.id === e.id))
  add('no-undo', s.rewinds === 0 && s.loads === 0)
  add('all-keepsakes', p.cast.every(c => pm.keepsakes.filter(k => k.heroine === c.id).length >= 2))
  add('autoplay-clear', autoplay)
  add('daily-true', !!s.daily && isTrue(e))
  add('bad-end', e.kind === 'bad')
  add('second-run', s.loop >= 2)
  return out
}

/** 每一幕结束时新解锁的成就 */
export function achievementsOnScene(f: Feats): AchievementId[] {
  const got = new Set(f.achievements)
  const out: AchievementId[] = []
  if (!got.has('first-scene') && f.stats.scenes >= 1) out.push('first-scene')
  if (!got.has('hundred-scenes') && f.stats.scenes >= 100) out.push('hundred-scenes')
  return out
}

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0 }
  return h >>> 0
}

/** 每日挑战：同一天所有人同一个剧本包、同一个随机种子 */
export function dailyChallenge(date: string, packs: Pack[]): { pack: Pack; seed: number } {
  const h = hash(`daily:${date}`)
  return { pack: packs[h % packs.length]!, seed: h }
}

/** 可以贴出去的一行战绩 */
export function dailyShare(date: string, title: string, endingTitle: string, kind: string): string {
  const star = kind === 'true' ? '★' : kind === 'good' ? '☆' : '·'
  return `ai-galgame daily ${date} · ${title} · ${endingTitle} ${star}`
}
