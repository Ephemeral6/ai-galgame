// 无模型的剧情可达性模拟器：用引擎的纯函数跑完整局，桩代替 AI 写的幕。
// 用法：bun sim.ts <repo> [runsPerPolicy]
import { resolve } from 'node:path'
import { writeFileSync } from 'node:fs'

const repo = resolve(import.meta.dir, '../..')
const RUNS = Number(process.argv[2] ?? 40)
const E = await import(`${repo}/hooks/engine.ts`)
const C = await import(`${repo}/hooks/craft.ts`)
const P = await import(`${repo}/hooks/pack.ts`)
const { BUILTIN } = await import(`${repo}/packs/index.ts`)

type Pack = any; type Story = any; type Choice = any

// 可复现的 PRNG
function rng(seed: number) { let x = seed >>> 0 || 1; return () => { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296 } }

type Policy = { name: string; focus: string | null; mode: 'love' | 'hate' | 'spread' | 'random'; gain: 1 | 2; promises: 'keep' | 'break' | 'none'; eps: number }

type Obs = {
  endings: Map<string, number>
  beats: Map<string, { hit: number; lateNoWho: number; wrongOwner: number }>
  sets: Map<string, number>; reveals: Map<string, number>; incidents: Map<string, number>; routes: Map<string, number>
  issues: Map<string, number>
  winsBy: Map<string, string> // ending -> example policy
}
const bump = (m: Map<string, number>, k: string, n = 1) => m.set(k, (m.get(k) ?? 0) + n)

function stubScene(p: Pack, s: Story, opt: any, who: string | null, pol: Policy, r: () => number, endingsSeen: string[], obs: Obs) {
  const ctx = E.sceneContext(p, s, opt, who)
  const present = [...opt.maybe, ...(who ? [who] : []), ...(ctx.incident?.who ?? [])]
  const pick = C.pickCraft(p, s, 'zh', { place: opt.id, present, beat: ctx.beat, lead: who, endingsSeen, lastKind: s.lastKind })
  const castIds = p.cast.map((c: any) => c.id)
  const isCast = (id: string) => castIds.includes(id)
  let stage: string[] = []
  if (pick.setPiece) stage = C.setPieceCast(pick.setPiece)
  else {
    let lead = who
      ?? (pol.focus && present.includes(pol.focus) ? pol.focus : null)
      ?? ctx.beat?.who?.find((id: string) => present.includes(id) && isCast(id))
      ?? present.find(isCast) ?? null
    if (pol.mode === 'random' && present.length) lead = present[Math.floor(r() * present.length)]!
    if (lead) stage.push(lead)
    // 关键事件涉及、但不在台上的人：AI 通常会把她带上（这里按「带上第一位」近似）
    if (ctx.beat?.who?.length && !ctx.beat.who.some((id: string) => stage.includes(id))) {
      obs.issues.has(`beatAbsent:${ctx.beat.id}`) || 0
      stage.push(ctx.beat.who[0]!)
      bump(obs.issues, `关键事件 ${ctx.beat.id} 到期时相关的人(${ctx.beat.who.join(',')})不在可能在场名单里，靠 AI 硬拉上台`)
    }
  }
  stage = stage.filter(id => P.personOf(p, id)).slice(0, 2)
  const lead = stage.find(isCast) ?? ''
  let choices: Choice[] = pick.setPiece ? C.setPieceChoices(p, pick.setPiece, 'zh') : null
  if (!choices) {
    const g = pol.gain
    const eff = (d: number) => (lead ? { [lead]: d } : {})
    choices = [
      { text: 'warm', kind: 'reply', effects: pol.mode === 'spread' ? Object.fromEntries(stage.filter(isCast).map(id => [id, 1])) : eff(g), reaction: '' },
      { text: 'promise', kind: 'promise', promise: 'p', effects: eff(1), reaction: '' },
      { text: 'cold', kind: 'reply', effects: eff(-2), reaction: '' },
    ]
  }
  const sc: any = {
    title: 't', place: opt.place, cast: stage.map(id => ({ id, expression: 'normal' })), distance: 'near', narration: 'n', lines: [], choices,
    summary: 's', callback: '', fact: '', proactive: !!who, kind: pick.kind,
    ...(pick.flags.length ? { craftFlags: pick.flags } : {}), ...(ctx.beat ? { beat: ctx.beat.id } : {}), ...(ctx.also ? { also: ctx.also.id } : {}), ...(ctx.incident ? { incident: ctx.incident.id } : {}),
  }
  if (E.withKeep) sc.choices = E.withKeep(p, s, sc, undefined, 'zh')
  if (ctx.beat) {
    const b = obs.beats.get(ctx.beat.id) ?? { hit: 0, lateNoWho: 0, wrongOwner: 0 }
    b.hit++
    if (ctx.beat.who?.length && !ctx.beat.who.some((id: string) => present.includes(id))) b.lateNoWho++
    obs.beats.set(ctx.beat.id, b)
  }
  if (pick.setPiece) bump(obs.sets, pick.setPiece.id)
  if (pick.reveal) bump(obs.reveals, pick.reveal.id)
  if (ctx.incident) bump(obs.incidents, ctx.incident.id)
  return { sc, lead, beat: ctx.beat }
}

function chooseOption(p: Pack, s: Story, opts: any[], pol: Policy, r: () => number) {
  if (r() < pol.eps || pol.mode === 'random') return opts[Math.floor(r() * opts.length)]
  const castIds = p.cast.map((c: any) => c.id)
  const score = (o: any) => {
    if (o.forced) return 0
    const castHere = o.maybe.filter((id: string) => castIds.includes(id))
    if (pol.mode === 'spread') {
      // 去最久没见的人那里
      const ages = castHere.map((id: string) => s.day * 10 + s.slot - (s.heroines[id]?.lastDay ?? 0) * 10)
      return ages.length ? Math.max(...ages) + r() : -1
    }
    if (pol.focus) {
      // 有开着的约定要兑现：去见约定对象
      if (pol.promises === 'keep') {
        const due = s.promises.filter((x: any) => x.status === 'open' && castHere.includes(x.heroine)).length
        if (due) return 50 + due
      }
      if (pol.promises === 'break') {
        if (s.promises.some((x: any) => x.status === 'open' && castHere.includes(x.heroine))) return -10
      }
      if (castHere.includes(pol.focus)) return 20 - castHere.length + r()
    }
    return r()
  }
  return [...opts].sort((a, b) => score(b) - score(a))[0]
}

function chooseChoice(p: Pack, s: Story, sc: any, lead: string, beat: any, pol: Policy, r: () => number) {
  const cs: Choice[] = sc.choices
  if (pol.mode === 'random' || r() < pol.eps) return cs[Math.floor(r() * cs.length)]!
  const target = pol.focus
  const val = (c: Choice) => {
    let v = 0
    for (const [id, d] of Object.entries(c.effects)) {
      if (pol.mode === 'spread') v += Number(d)
      else if (id === target) v += pol.mode === 'hate' ? -Number(d) : Number(d) * 3
      else v -= pol.mode === 'love' ? Math.max(0, Number(d)) * 0.2 : 0
    }
    if (c.kind === 'keep') v += pol.promises === 'keep' && (!target || c.keeps === target || pol.mode === 'spread') ? 8 : -8
    if (c.kind === 'promise') {
      if (pol.promises === 'none') v -= 5
      else if (beat?.promise) v += 6
      else if (pol.promises === 'break') v += 4
      else v += 0.5
    }
    return v + r() * 0.01
  }
  return [...cs].sort((a, b) => val(b) - val(a))[0]!
}

function runGame(p: Pack, pol: Policy, seed: number, loop: number, endingsSeen: string[], obs: Obs) {
  const r = rng(seed * 7919 + loop)
  let s: Story = { ...E.freshStory(p, 'zh', loop, seed), phase: 'plan' }
  let guard = 0
  while (guard++ < 2000) {
    const forced = E.forcedEvent(p, s, 'zh')
    const lonely = forced ? null : E.proactive(p, s)
    const opts = forced ? [forced] : E.planOptions(p, s, 'zh')
    if (!opts.length && !lonely) { bump(obs.issues, `第${s.day}天 时段${s.slot} 没有任何开放地点`); }
    let opt: any, who: string | null = null
    if (lonely && (pol.mode !== 'hate' ? (lonely === pol.focus || pol.mode === 'spread' || r() < 0.3) : false)) {
      opt = { place: P.packText(p, 'zh')(p.places[0].name), mood: '', maybe: [lonely], who: lonely }; who = lonely
    } else opt = opts.length ? chooseOption(p, s, opts, pol, r) : { place: '?', mood: '', maybe: [] }
    const { sc, lead, beat } = stubScene(p, s, opt, who, pol, r, endingsSeen, obs)
    s = E.applyScene(s, sc)
    const c = chooseChoice(p, s, sc, lead, beat, pol, r)
    // 关键约定记到了谁名下
    if (beat?.promise && c.kind === 'promise') {
      const before = s.promises.length
      const res0 = E.applyChoice(p, s, c, 'zh')
      const np = res0.story.promises[before]
      if (np && beat.who?.length && !beat.who.includes(np.heroine)) {
        const b = obs.beats.get(beat.id)!; b.wrongOwner++
      }
    }
    const res = E.applyChoice(p, s, c, 'zh')
    s = res.story
    for (const id of res.keepsakeFor) s = { ...s, keepsakes: [...s.keepsakes, { pack: p.id, day: s.day, heroine: id, title: 'k', desc: '', art: [], palette: {} }] }
    const adv = E.advanceTime(p, s, 'zh')
    s = adv.story
    for (const f of s.flags) if (f.startsWith('route:')) { /* counted at end */ }
    if (adv.finished) {
      const e = E.pickEnding(p, s)
      const route = s.flags.find((f: string) => f.startsWith('route:')) ?? '(none)'
      bump(obs.routes, route)
      for (const b of P.allBeats(p)) if (!s.flags.includes(`beat:${b.id}`)) bump(obs.issues, `终局时关键事件未发生: ${b.id}(第${b.day}天)`)
      bump(obs.issues, '__runs')
      return { s, e }
    }
  }
  throw new Error('runaway game')
}

function policies(p: Pack): Policy[] {
  const out: Policy[] = []
  for (const c of p.cast) for (const gain of [2, 1] as const) {
    out.push({ name: `love:${c.id}:g${gain}:keep`, focus: c.id, mode: 'love', gain, promises: 'keep', eps: 0.05 })
    out.push({ name: `love:${c.id}:g${gain}:none`, focus: c.id, mode: 'love', gain, promises: 'none', eps: 0.05 })
    out.push({ name: `love:${c.id}:g${gain}:break`, focus: c.id, mode: 'love', gain, promises: 'break', eps: 0.05 })
  }
  for (const c of p.cast) out.push({ name: `hate:${c.id}:break`, focus: c.id, mode: 'hate', gain: 2, promises: 'break', eps: 0.05 })
  for (const c of p.cast) out.push({ name: `meh:${c.id}`, focus: c.id, mode: 'love', gain: 1, promises: 'keep', eps: 0.5 })
  out.push({ name: 'spread:g1', focus: null, mode: 'spread', gain: 1, promises: 'keep', eps: 0.05 })
  out.push({ name: 'spread:g2', focus: null, mode: 'spread', gain: 2, promises: 'keep', eps: 0.1 })
  out.push({ name: 'random', focus: null, mode: 'random', gain: 1, promises: 'keep', eps: 1 })
  return out
}

function staticChecks(p: Pack): string[] {
  const out: string[] = []
  const ids = new Set([...p.cast.map((c: any) => c.id), ...(p.npcs ?? []).map((n: any) => n.id)])
  const place = (id: string) => p.places.find((x: any) => x.id === id)
  for (const c of [...p.cast, ...(p.npcs ?? [])]) for (const [slot, ps] of Object.entries(c.haunts ?? {})) for (const pid of ps as string[]) {
    const pl = place(pid)
    if (!pl) out.push(`${c.id} 常去不存在的地点 ${pid}`)
    else if (!pl.slots.includes(Number(slot))) out.push(`${c.id} 在时段 ${slot} 常去 ${pid}，但那个时段 ${pid} 不开放`)
  }
  for (const c of p.cast) {
    if (c.deadline.day > p.days) out.push(`${c.id} 截止日 ${c.deadline.day} 超过总天数 ${p.days}`)
    const slots = Object.values(c.haunts ?? {}).flat()
    if (!slots.length) out.push(`${c.id} 没有常去地点`)
  }
  for (const b of P.allBeats(p)) {
    for (const w of b.who ?? []) if (!ids.has(w)) out.push(`关键事件 ${b.id} 涉及不存在的人 ${w}`)
    if (b.day > p.days) out.push(`关键事件 ${b.id} 在第 ${b.day} 天，超过总天数`)
    if ((b.by ?? b.day + 1) > p.days && b.by) out.push(`关键事件 ${b.id} 最晚 ${b.by} 超过总天数`)
    // 关键事件涉及的主角色在 day..by 期间有没有任何可达的时段地点
    const by = b.by ?? Math.min(p.days, b.day + 1)
    for (const w of (b.who ?? []).filter((x: string) => p.cast.some((c: any) => c.id === x))) {
      const c = p.cast.find((x: any) => x.id === w)
      const reach = Object.entries(c.haunts ?? {}).some(([sl, ps]) => (ps as string[]).some(pid => place(pid)?.slots.includes(Number(sl))))
      if (!reach) out.push(`关键事件 ${b.id} 的 ${w} 没有任何可去的常去点`)
    }
    if (b.promise && !(b.who ?? []).some((x: string) => p.cast.some((c: any) => c.id === x))) out.push(`关键约定 ${b.id} 没有涉及主角色：约定会记在当时领头的人名下`)
  }
  for (const f of p.fixed) for (const w of f.cast) if (!ids.has(w)) out.push(`固定事件 第${f.day}天 涉及不存在的人 ${w}`)
  const beatIds = new Set(P.allBeats(p).map((b: any) => b.id))
  const incIds = new Set((p.incidents ?? []).map((x: any) => x.id))
  const cr = C.craftOf(p)
  const setIds = new Set((cr?.setPieces ?? []).map((x: any) => x.id))
  const revIds = new Set((cr?.reveals ?? []).map((x: any) => x.id))
  const flagOk = (f: string) => {
    const [k, id] = [f.slice(0, f.indexOf(':')), f.slice(f.indexOf(':') + 1)]
    return (k === 'beat' && beatIds.has(id)) || (k === 'inc' && incIds.has(id)) || (k === 'set' && setIds.has(id)) || (k === 'reveal' && revIds.has(id)) || k === 'route' || k === 'fb' || k === 'gag'
  }
  for (const e of p.endings) {
    for (const f of e.flags ?? []) if (!flagOk(f)) out.push(`结局 ${e.id} 要求的标记 ${f} 不会被产生`)
    if (e.keptKey && !beatIds.has(e.keptKey)) out.push(`结局 ${e.id} 的 keptKey ${e.keptKey} 不是关键事件`)
    if (e.keptKey) { const b = P.beatOf(p, e.keptKey); if (b && !b.promise) out.push(`结局 ${e.id} 要兑现 ${e.keptKey} 的关键约定，但该事件没定义 promise`) ; if (b && e.who && b.who?.length && !b.who.includes(e.who)) out.push(`结局 ${e.id}（${e.who}）要兑现 ${e.keptKey}，但该事件涉及的是 ${b.who.join(',')}`) }
    if (e.minKeepsakes && e.minKeepsakes > E.KEEPSAKES_PER) out.push(`结局 ${e.id} 要 ${e.minKeepsakes} 个信物，上限 ${E.KEEPSAKES_PER}`)
    if (e.minStage !== undefined && e.minStage > 4) out.push(`结局 ${e.id} minStage>4`)
  }
  for (const x of p.incidents ?? []) {
    for (const f of x.after ?? []) if (!flagOk(f)) out.push(`随机事件 ${x.id} 的前置 ${f} 不会被产生`)
    for (const pid of x.places ?? []) { const pl = place(pid); if (!pl) out.push(`随机事件 ${x.id} 的地点 ${pid} 不存在`); else if (x.slots && !x.slots.some((sl: number) => pl.slots.includes(sl))) out.push(`随机事件 ${x.id} 限 ${pid}，但限定时段里它都不开放`) }
    if (x.days && x.days[0] > p.days) out.push(`随机事件 ${x.id} 起始天超过总天数`)
  }
  for (const sp of cr?.setPieces ?? []) {
    if (sp.trigger.beat && !beatIds.has(sp.trigger.beat)) out.push(`预写场景 ${sp.id} 绑定的关键事件 ${sp.trigger.beat} 不存在`)
    for (const f of sp.trigger.after ?? []) if (!flagOk(f)) out.push(`预写场景 ${sp.id} 的前置 ${f} 不会被产生`)
    for (const pid of sp.trigger.places ?? []) if (!place(pid)) out.push(`预写场景 ${sp.id} 的地点 ${pid} 不存在`)
    if (sp.trigger.route && !(cr?.routes?.branches ?? []).some((b: any) => b.who === sp.trigger.route)) out.push(`预写场景 ${sp.id} 要求路线 ${sp.trigger.route}，但没有这条路线`)
  }
  for (const rv of cr?.reveals ?? []) {
    for (const f of rv.when.after ?? []) if (!flagOk(f)) out.push(`揭示 ${rv.id} 的前置 ${f} 不会被产生`)
    for (const e of rv.when.needEndings ?? []) if (!p.endings.some((x: any) => x.id === e)) out.push(`揭示 ${rv.id} 需要的结局 ${e} 不存在`)
  }
  return out
}

const report: any = {}
for (const p of BUILTIN as Pack[]) {
  const obs: Obs = { endings: new Map(), beats: new Map(), sets: new Map(), reveals: new Map(), incidents: new Map(), routes: new Map(), issues: new Map(), winsBy: new Map() }
  const perPolicy: Record<string, Record<string, number>> = {}
  const endingsSeen: string[] = []
  for (const loop of [1, 2]) {
    for (const pol of policies(p)) {
      for (let i = 0; i < RUNS; i++) {
        const { e } = runGame(p, pol, 1000 + i, loop, loop === 2 ? p.endings.map((x: any) => x.id) : endingsSeen, obs)
        bump(obs.endings, e.id)
        if (!obs.winsBy.has(e.id)) obs.winsBy.set(e.id, `${pol.name} loop${loop}`)
        if (!endingsSeen.includes(e.id)) endingsSeen.push(e.id)
        const k = `${pol.name}@${loop}`; perPolicy[k] ??= {}; perPolicy[k][e.id] = (perPolicy[k][e.id] ?? 0) + 1
      }
    }
  }
  const cr = C.craftOf(p)
  const allEnd = p.endings.map((e: any) => e.id)
  report[p.id] = {
    days: p.days, slots: p.slots.length, cast: p.cast.map((c: any) => c.id), timeLoop: !!p.features?.timeLoop,
    static: staticChecks(p),
    unreachedEndings: allEnd.filter((id: string) => !obs.endings.has(id)),
    endings: Object.fromEntries(allEnd.map((id: string) => [id, { n: obs.endings.get(id) ?? 0, eg: obs.winsBy.get(id) ?? '' }])),
    unreachedBeats: P.allBeats(p).map((b: any) => b.id).filter((id: string) => !obs.beats.has(id)),
    beatProblems: Object.fromEntries([...obs.beats].filter(([, b]) => b.lateNoWho || b.wrongOwner)),
    unreachedSets: (cr?.setPieces ?? []).map((x: any) => x.id).filter((id: string) => !obs.sets.has(id)),
    unreachedReveals: (cr?.reveals ?? []).map((x: any) => x.id).filter((id: string) => !obs.reveals.has(id)),
    unreachedIncidents: (p.incidents ?? []).map((x: any) => x.id).filter((id: string) => !obs.incidents.has(id)),
    routes: Object.fromEntries(obs.routes),
    issues: Object.fromEntries(obs.issues),
    perPolicy,
  }
  console.log(`${p.id}: endings ${allEnd.length - report[p.id].unreachedEndings.length}/${allEnd.length}, static ${report[p.id].static.length}, unreached beats ${report[p.id].unreachedBeats.length}, sets ${report[p.id].unreachedSets.length}, reveals ${report[p.id].unreachedReveals.length}, incidents ${report[p.id].unreachedIncidents.length}`)
}
writeFileSync(resolve(import.meta.dir, 'report.json'), JSON.stringify(report, null, 2))
