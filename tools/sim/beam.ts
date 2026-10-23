// 定向搜索：对指定结局做束搜索，判断在「AI 给出合理选项」的假设下能否走到。
// 分支：地点 × 领头的人（在场主角色之一或无人）× 选项（+2 / 约定+1 / -2 / 观察 0；预写场景用作者写的选项）
// 用法：bun tools/sim/beam.ts <width> pack:ending ...；只写 pack 表示这个包的全部结局
import { resolve } from 'node:path'
const repo = resolve(import.meta.dir, '../..')
const WIDTH = Number(process.argv[2] ?? 1500)
const args = process.argv.slice(3)
const E = await import(`${repo}/hooks/engine.ts`)
const C = await import(`${repo}/hooks/craft.ts`)
const P = await import(`${repo}/hooks/pack.ts`)
const { BUILTIN } = await import(`${repo}/packs/index.ts`)
const targets = args.flatMap(a => a.includes(':') ? [a] : BUILTIN.find((x: any) => x.id === a).endings.map((e: any) => `${a}:${e.id}`))

type Node = { s: any; path: string[] }

function expand(p: any, s: any, endingsSeen: string[]): { s: any; step: string }[] {
  const out: { s: any; step: string }[] = []
  const forced = E.forcedEvent(p, s, 'zh')
  const lonely = forced ? null : E.proactive(p, s)
  const opts: any[] = forced ? [forced] : E.planOptions(p, s, 'zh')
  if (lonely) opts.push({ place: 'lonely', mood: '', maybe: [lonely], who: lonely })
  const castIds = p.cast.map((c: any) => c.id)
  for (const opt of opts) {
    const who = opt.who ?? null
    const ctx = E.sceneContext(p, s, opt, who)
    const present = [...opt.maybe, ...(who ? [who] : []), ...(ctx.incident?.who ?? [])]
    const pick = C.pickCraft(p, s, 'zh', { place: opt.id, present, beat: ctx.beat, lead: who, endingsSeen, lastKind: s.lastKind })
    const stages: string[][] = []
    if (pick.setPiece) stages.push(C.setPieceCast(pick.setPiece))
    else {
      const leads = who ? [who] : [...new Set(present.filter((id: string) => castIds.includes(id)))]
      const base = (lead: string | null) => {
        const st = lead ? [lead] : []
        if (ctx.beat?.who?.length && !ctx.beat.who.some((id: string) => st.includes(id))) st.push(ctx.beat.who[0]!)
        return st.filter(id => P.personOf(p, id)).slice(0, 2)
      }
      for (const l of leads) stages.push(base(l))
      if (!who) stages.push(base(null))
      // 两位主角色同台（群像）
      if (!who && leads.length >= 2) stages.push([leads[0]!, leads[1]!])
    }
    const seenSig = new Set<string>()
    for (const stage of stages) {
      const sig = stage.join(','); if (seenSig.has(sig)) continue; seenSig.add(sig)
      const lead = stage.find(id => castIds.includes(id)) ?? ''
      let choices: any[] | null = pick.setPiece ? C.setPieceChoices(p, pick.setPiece, 'zh') : null
      if (!choices) {
        const both = Object.fromEntries(stage.filter(id => castIds.includes(id)).map(id => [id, 1]))
        const eff = (d: number) => (lead ? { [lead]: d } : {})
        choices = [
          { text: '+2', kind: 'reply', effects: eff(2) },
          { text: '+1both', kind: 'reply', effects: both },
          { text: 'promise', kind: 'promise', promise: 'p', effects: eff(1) },
          { text: '-2', kind: 'reply', effects: eff(-2) },
          { text: 'observe', kind: 'observe', effects: {} },
        ]
      }
      const sc: any = {
        title: 't', place: opt.place, cast: stage.map(id => ({ id, expression: 'normal' })), distance: 'near', narration: 'n', lines: [], choices,
        summary: 's', callback: '', fact: '', proactive: !!who, kind: pick.kind,
        ...(pick.flags.length ? { craftFlags: pick.flags } : {}), ...(ctx.beat ? { beat: ctx.beat.id } : {}), ...(ctx.also ? { also: ctx.also.id } : {}), ...(ctx.incident ? { incident: ctx.incident.id } : {}),
      }
      if (E.withKeep) choices = sc.choices = E.withKeep(p, s, sc, undefined, 'zh')
      const s1 = E.applyScene(s, sc)
      for (const c of choices) {
        const res = E.applyChoice(p, s1, c, 'zh')
        let s2 = res.story
        for (const id of res.keepsakeFor) s2 = { ...s2, keepsakes: [...s2.keepsakes, { heroine: id }] }
        const adv = E.advanceTime(p, s2, 'zh')
        out.push({ s: { ...adv.story, _done: adv.finished }, step: `d${s.day}s${s.slot} ${opt.place}${pick.setPiece ? `[set:${pick.setPiece.id}]` : ''}${ctx.beat ? `[beat:${ctx.beat.id}]` : ''} 台上=${stage.join('+') || '-'} 选=${c.text}` })
      }
    }
  }
  return out
}

function dist(p: any, s: any, e: any): number {
  let d = 0
  const hs = e.who ? [e.who] : p.cast.map((c: any) => c.id)
  for (const id of hs) {
    const h = s.heroines[id]
    if (e.minStage !== undefined) d += Math.max(0, e.minStage - h.stage) * 6
    if (e.minAffection !== undefined) d += Math.max(0, e.minAffection - h.affection)
    if (e.maxAffection !== undefined) d += Math.max(0, h.affection - e.maxAffection)
  }
  if (e.who) {
    const mine = s.promises.filter((x: any) => x.heroine === e.who)
    const broken = mine.filter((x: any) => x.status === 'broken').length
    const open = mine.filter((x: any) => x.status === 'open').length
    if (e.minBroken !== undefined) d += Math.max(0, e.minBroken - broken - open * 0.5) * 4
    if (e.maxBroken !== undefined) d += Math.max(0, broken - e.maxBroken) * 20
    if (e.minKept !== undefined) d += Math.max(0, e.minKept - mine.filter((x: any) => x.status === 'kept').length) * 3
    if (e.keptKey) { const k = mine.find((x: any) => x.key === e.keptKey); d += !k ? 8 : k.status === 'kept' ? 0 : k.status === 'open' ? 3 : 30 }
    if (e.minKeepsakes) d += Math.max(0, e.minKeepsakes - s.keepsakes.filter((k: any) => k.heroine === e.who).length) * 4
  }
  for (const f of e.flags ?? []) if (!s.flags.includes(f)) d += 3
  // 被更高优先级的结局抢走
  const now = E.pickEnding(p, s)
  if (now.id !== e.id && (now.tier > e.tier || (now.tier === e.tier && E.endingMatches(p, s, e)))) d += 4 + (now.tier - e.tier) * 2
  return d
}

const sigOf = (s: any) => JSON.stringify([s.day, s.slot, s.cycle, Object.values(s.heroines).map((h: any) => [h.affection, h.stage, Math.min(h.scenes, 9), h.lastDay]), s.promises.map((x: any) => x.status + x.heroine + (x.key ?? '')), s.flags.filter((f: string) => !f.startsWith('gag:') && !f.startsWith('fb:')).sort(), s.keepsakes.length])

for (const t of targets) {
  const [pid, eid] = t.split(':')
  const p = BUILTIN.find((x: any) => x.id === pid)
  const e = p.endings.find((x: any) => x.id === eid)
  const all = p.endings.map((x: any) => x.id)
  let found: Node | null = null
  let best = Infinity
  for (const loop of e.minLoop ? [e.minLoop] : [1, 2]) {
    let beam: Node[] = [{ s: { ...E.freshStory(p, 'zh', loop, 12345), phase: 'plan' }, path: [] }]
    const t0 = Date.now()
    while (beam.length && !found) {
      const next = new Map<string, { n: Node; d: number }>()
      for (const n of beam) {
        for (const x of expand(p, n.s, loop >= 2 ? all : [])) {
          const node = { s: x.s, path: [...n.path, x.step] }
          if (x.s._done) {
            const got = E.pickEnding(p, x.s)
            if (got.id === eid) { found = node; break }
            best = Math.min(best, dist(p, x.s, e))
            continue
          }
          const k = sigOf(x.s)
          const d = dist(p, x.s, e)
          const prev = next.get(k)
          if (!prev || prev.d > d) next.set(k, { n: node, d })
        }
        if (found) break
      }
      // 取前 WIDTH，留一点多样性：前 80% 按距离，后 20% 随机
      const arr = [...next.values()].sort((a, b) => a.d - b.d)
      const keep = arr.slice(0, Math.floor(WIDTH * 0.8))
      const rest = arr.slice(Math.floor(WIDTH * 0.8))
      for (let i = 0; i < WIDTH * 0.2 && rest.length; i++) keep.push(rest.splice(Math.floor(Math.random() * rest.length), 1)[0]!)
      beam = keep.map(x => x.n)
    }
    if (found) { console.log(`✔ ${t} (loop ${loop}, ${((Date.now() - t0) / 1000).toFixed(1)}s)`); for (const st of found.path) console.log('   ' + st); break }
  }
  if (!found) console.log(`✘ ${t} 束宽 ${WIDTH} 未找到；终局最小距离 ${best}`)
}
