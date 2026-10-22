// 花费估算：按 token 和公开价目粗算（美元），用于头部显示「本局 / 今日」和每日预算上限。
// 以实际账单为准；价目按 sonnet / haiku 两个别名当前对应的模型。

export type Price = { input: number; output: number; cacheRead: number; cacheWrite: number }

/** 每百万 token 的美元价 */
export const PRICES: Record<string, Price> = {
  sonnet: { input: 2, output: 10, cacheRead: 0.2, cacheWrite: 2.5 },
  haiku: { input: 0.1, output: 0.5, cacheRead: 0.01, cacheWrite: 0.125 },
}

export type TokenUsage = { input_tokens: number; output_tokens: number; cache_read_input_tokens: number; cache_creation_input_tokens: number }

export function costOf(model: string, u: TokenUsage): number {
  const p = PRICES[model] ?? PRICES.sonnet!
  return (u.input_tokens * p.input + u.output_tokens * p.output + u.cache_read_input_tokens * p.cacheRead + u.cache_creation_input_tokens * p.cacheWrite) / 1e6
}

/** 本地日期 YYYY-MM-DD（每日预算、每日挑战用） */
export function dateKey(ms: number): string {
  const d = new Date(ms)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function usd(n: number): string {
  return n < 0.01 ? `$${n.toFixed(3)}` : `$${n.toFixed(2)}`
}

/** 预算选项：0 表示不限 */
export const BUDGETS = [0, 0.5, 1, 2, 5]
