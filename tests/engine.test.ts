// 纯逻辑测试：日程推进、约定到期、阶段推进、时间循环、结局判定、信物校验、剧本包校验，
// 以及新格式：配角出场、关系写进提示、章节关键事件、随机事件、多结局、旧包兼容、旧存档迁移。

import { describe, expect, test } from 'claude-code/testing'

import type { Choice, Pack, Scene, Story } from '../types'
import { stageFrame, validKeepsake } from '../hooks/art'
import {
  advanceTime, alsoBeat, applyChoice, applyScene, dueBeat, focusMode, forcedEvent, freshStory, incidentHere, keepable, needsMigration, normalizeStory, parseScene,
  pickEnding, planOptions, proactive, rollIncident, sceneContext, sceneDynamic, staticBlock, withKeep,
} from '../hooks/engine'
import { allBeats, chapterOf, personOf, tr, validatePack } from '../hooks/pack'
import { BUILTIN } from '../packs/index'
import { CICADA } from '../packs/cicada/pack'
import { LOOP } from '../packs/loop/pack'
import { TEMPLATE } from '../packs/_template/pack'

const P = CICADA
const scene = (ids: string[], extra: Partial<Scene> = {}): Scene => ({
  title: 't', place: 'p', cast: ids.map(id => ({ id, expression: 'normal' })), distance: 'near', narration: 'n',
  lines: [], choices: [], summary: 's', ...extra,
})
const choice = (c: Partial<Choice>): Choice => ({ text: 'c', kind: 'reply', effects: {}, reaction: 'r', ...c })
const at = (s: Story, day: number, slot: number): Story => ({ ...s, day, slot })
const META = { endingsSeen: [], clears: 0 }
const opt = (s: Story, placeId: string) => planOptions(P, s, 'zh').find(o => o.id === placeId)!

/** 一个只有旧字段的包（第一版格式）：没有 npcs / relations / acts / incidents */
function oldPack(): Pack {
  const p = JSON.parse(JSON.stringify(TEMPLATE)) as Pack & Record<string, unknown>
  p.id = 'oldfmt'
  for (const k of ['npcs', 'relations', 'acts', 'incidents']) delete p[k]
  for (const e of p.endings) for (const k of ['kind', 'keptKey', 'flags', 'minBroken', 'maxAffection']) delete (e as unknown as Record<string, unknown>)[k]
  for (const c of p.cast) delete (c as unknown as Record<string, unknown>).tagline
  return p
}

describe('日程推进', () => {
  test('一个时段接一个时段，跨天回到第一个时段', () => {
    let s: Story = { ...freshStory(P, 'zh'), phase: 'after' }
    s = advanceTime(P, s, 'zh').story
    expect([s.day, s.slot, s.phase]).toEqual([1, 1, 'plan'])
    s = advanceTime(P, at(s, 1, 2), 'zh').story
    expect([s.day, s.slot]).toEqual([2, 0])
  })

  test('地点按时段开放，常去的人列在「可能遇见」，配角排在主角色后面', () => {
    const opts = planOptions(P, freshStory(P, 'zh'), 'zh')
    expect(opts.find(o => o.place === '图书馆')!.maybe).toEqual(['qingyi', 'wenli'])
    expect(opts.find(o => o.id === 'shop')!.maybe).toEqual(['huang'])
    expect(opts.find(o => o.id === 'classroom')!.maybe).toEqual(['xiaoman', 'zhiyao', 'chen', 'dachuan'])
    expect(opts.some(o => o.place === '江边')).toBe(false)
    expect(planOptions(P, freshStory(P, 'en'), 'en').some(o => o.place === 'Library')).toBe(true)
  })

  test('固定事件锁定地点，可以带配角', () => {
    const f = forcedEvent(P, at(freshStory(P, 'zh'), 12, 1), 'zh')
    expect(f?.place).toBe('市体育场')
    expect(f?.maybe).toEqual(['zhiyao', 'zheng'])
    expect(forcedEvent(P, at(freshStory(P, 'zh'), 12, 0), 'zh')).toBe(null)
  })

  test('冷落 3 天以上、已熟悉的人会主动来找', () => {
    const s = at(freshStory(P, 'zh'), 6, 1)
    s.heroines.qingyi = { ...s.heroines.qingyi!, stage: 1, lastDay: 2, affection: 4 }
    s.heroines.zhiyao = { ...s.heroines.zhiyao!, stage: 1, lastDay: 5 }
    expect(proactive(P, s)).toBe('qingyi')
    expect(proactive(P, at(s, 6, 0))).toBe(null)
  })

  test('最后一天结束进入结局', () => {
    const r = advanceTime(P, { ...at(freshStory(P, 'zh'), 14, 2), phase: 'after' }, 'zh')
    expect(r.finished).toBe(true)
  })
})

describe('约定', () => {
  test('答应的事记成约定，期限不晚于她的截止日', () => {
    let s = applyScene(at(freshStory(P, 'zh'), 3, 0), scene(['zhiyao']))
    s = applyChoice(P, s, choice({ kind: 'promise', promise: '陪她晨跑' }), 'zh').story
    expect(s.promises[0]).toEqual(expect.objectContaining({ heroine: 'zhiyao', due: 12, status: 'open' }))
  })

  test('只见到她不算兑现；到期前她在场、我选了「兑现」才算', () => {
    let s = applyScene(at(freshStory(P, 'zh'), 3, 0), scene(['zhiyao']))
    s = applyChoice(P, s, choice({ kind: 'promise' }), 'zh').story
    s = applyScene(at(s, 4, 1), scene(['zhiyao']))
    expect(s.promises[0]!.status).toBe('open')
    s = applyChoice(P, s, choice({ kind: 'keep', keeps: 'zhiyao' }), 'zh').story
    expect(s.promises[0]!.status).toBe('kept')
  })

  test('同一幕里不能兑现刚许下的约定；没有可兑现的约定时不给「兑现」选项', () => {
    let s = applyScene(at(freshStory(P, 'zh'), 3, 0), scene(['zhiyao']))
    s = applyChoice(P, s, choice({ kind: 'promise' }), 'zh').story
    expect(keepable(s, ['zhiyao'])).toEqual([])
    const sc = scene(['zhiyao'], { choices: [choice({}), choice({ kind: 'keep' })] })
    expect(withKeep(P, s, sc, sc.choices[1], 'zh').map(c => c.kind)).toEqual(['reply'])
  })

  test('她在场又有可兑现的约定：AI 没写「兑现」就由程序补一个；对别人的约定不能借她兑现', () => {
    let s = applyScene(at(freshStory(P, 'zh'), 3, 0), scene(['zhiyao']))
    s = applyChoice(P, s, choice({ kind: 'promise', promise: '陪她晨跑' }), 'zh').story
    s = applyScene(at(s, 5, 0), scene(['zhiyao', 'xiaoman']))
    const sc = scene(['zhiyao', 'xiaoman'], { choices: [choice({}), choice({ kind: 'observe' }), choice({ kind: 'promise' })] })
    const cs = withKeep(P, s, sc, undefined, 'zh')
    expect(cs.length).toBe(4)
    expect(cs[3]).toEqual(expect.objectContaining({ kind: 'keep', keeps: 'zhiyao', text: '兑现约定：陪她晨跑' }))
    expect(applyChoice(P, s, choice({ kind: 'keep', keeps: 'xiaoman' }), 'zh').story.promises[0]!.status).toBe('open')
    expect(withKeep(P, s, { ...sc, cast: [{ id: 'xiaoman', expression: 'normal' }] }, undefined, 'zh').some(c => c.kind === 'keep')).toBe(false)
  })

  test('过期没兑现：失约、好感 -2', () => {
    let s = applyScene(at(freshStory(P, 'zh'), 10, 0), scene(['zhiyao']))
    s = applyChoice(P, s, choice({ kind: 'promise', effects: { zhiyao: 2 } }), 'zh').story
    expect(s.heroines.zhiyao!.affection).toBe(2)
    const r = advanceTime(P, at(s, 12, 2), 'zh')
    expect(r.story.promises[0]!.status).toBe('broken')
    expect(r.story.heroines.zhiyao!.affection).toBe(0)
    expect(r.broken.length).toBe(1)
  })
})

describe('阶段推进', () => {
  test('好感与单独相处都达标才进阶', () => {
    let s = applyScene(freshStory(P, 'zh'), scene(['xiaoman']))
    let r = applyChoice(P, s, choice({ effects: { xiaoman: 2 } }), 'zh')
    expect(r.story.heroines.xiaoman!.stage).toBe(0)
    s = { ...r.story, phase: 'scene' }
    r = applyChoice(P, s, choice({ effects: { xiaoman: 2 } }), 'zh')
    expect(r.advanced).toEqual(['xiaoman'])
    expect(r.story.heroines.xiaoman!.stage).toBe(1)
    expect(r.story.after).toContain('熟悉')
  })

  test('效果被限制在 -2..+2', () => {
    const s = applyScene(freshStory(P, 'zh'), scene(['xiaoman']))
    expect(applyChoice(P, s, choice({ effects: { xiaoman: 9 } }), 'zh').story.heroines.xiaoman!.affection).toBe(2)
  })

  test('进入「秘密」阶段时要一个信物，每人最多两个', () => {
    const s = applyScene(freshStory(P, 'zh'), scene(['qingyi']))
    s.heroines.qingyi = { ...s.heroines.qingyi!, stage: 2, affection: 8, scenes: 5 }
    const r = applyChoice(P, s, choice({ effects: { qingyi: 1 } }), 'zh')
    expect(r.keepsakeFor).toEqual(['qingyi'])
    const k = { pack: 'cicada', day: 1, heroine: 'qingyi', title: 'x', desc: '', art: [], palette: {} }
    const full = applyChoice(P, { ...s, keepsakes: [k, k] }, choice({ effects: { qingyi: 1 } }), 'zh')
    expect(full.keepsakeFor).toEqual([])
  })
})

describe('配角出场', () => {
  test('AI 写的一幕里配角可以上台、说话；好感只记在主角色身上', () => {
    const sc = parseScene(P, {
      narration: 'n', cast: [{ id: 'huang', expression: 'smile' }, { id: 'zhiyao', expression: 'normal' }, { id: 'nobody' }],
      lines: [{ who: 'huang', text: '小鬼头' }], choices: [{ text: 'a', effects: { huang: 2, zhiyao: 1 } }, { text: 'b' }],
    }, '小卖部')!
    expect(sc.cast.map(a => a.id)).toEqual(['huang', 'zhiyao'])
    expect(sc.choices[0]!.effects).toEqual({ zhiyao: 1 })
    const s = applyScene(freshStory(P, 'zh'), sc)
    expect(s.album[0]!.heroine).toBe('zhiyao')
    expect(s.heroines.zhiyao!.lastDay).toBe(1)
    expect(personOf(P, 'huang')).toEqual(expect.objectContaining({ npc: true, color: '#c0ca33' }))
  })

  test('有立绘的配角会画在舞台上，没有立绘的不画', () => {
    const blank = (px: (number | null)[][]) => px.every(r => r.every(v => v === null))
    expect(blank(stageFrame(P, [{ id: 'huang', expression: 'normal' }], 'near', 1))).toBe(false)
    const noSprite = { ...P, npcs: P.npcs!.map(n => ({ ...n, sprite: undefined })) }
    expect(blank(stageFrame(noSprite, [{ id: 'huang', expression: 'normal' }], 'near', 1))).toBe(true)
  })

  test('配角常出没的地方会进提示的「相关人物」', () => {
    const s = freshStory(P, 'zh')
    const ctx = sceneContext(P, s, opt(s, 'shop'), null)
    expect(ctx.focus).toContain('huang')
    expect(sceneDynamic(P, s, opt(s, 'shop'), null, '', 'zh', META, ctx)).toContain('黄阿姨')
  })
})

describe('关系写进提示（只放这一幕相关的人）', () => {
  test('在场主角色的关系与相关配角写进这一幕；不在场的人只在固定块里留一行摘要', () => {
    // 前面的关键事件都已发生（否则到期的事件会把涉及的人带进这一幕）
    const s = { ...at(freshStory(P, 'zh'), 4, 0), flags: allBeats(P).filter(b => b.day <= 4).map(b => `beat:${b.id}`) }
    const o = opt(s, 'astro')
    const ctx = sceneContext(P, s, o, null)
    expect(ctx.focus).toEqual(expect.arrayContaining(['xiaoman', 'fang']))
    const dyn = sceneDynamic(P, s, o, null, '', 'zh', META, ctx)
    expect(dyn).toContain('初中同桌，一起创办天文社') // 小满 ↔ 温璃
    expect(dyn).toContain('望远镜其实是他毕业前弄坏的') // 方既白 ↔ 小满
    expect(dyn).not.toContain('14 日早上的车') // 清漪的秘密不在这一幕
    expect(dyn).not.toContain('去年英仙座流星雨那晚，她和小满约好') // 温璃不在场：秘密不进提示
    const st = staticBlock(P, 'zh')
    expect(focusMode(P)).toBe(true)
    expect(st).toContain('沈清漪') // 一行摘要
    expect(st).not.toContain('14 日早上的车')
  })

  test('还没到挑明阶段的关系带着「只能暗示」的标注', () => {
    const s = at(freshStory(P, 'zh'), 4, 1)
    const o = opt(s, 'council')
    const dyn = sceneDynamic(P, s, o, null, '', 'zh', META, sceneContext(P, s, o, null))
    expect(dyn).toMatch(/yinuo「程一诺」 ↔ zhou「周主任」 \[母女\].*keep this implicit/)
  })

  test('人少的包（旧格式）：全部人物设定照旧放在缓存的固定块里', () => {
    const p = oldPack()
    expect(focusMode(p)).toBe(false)
    expect(staticBlock(p, 'zh')).toContain('TODO 秘密')
  })
})

describe('非恋爱角色', () => {
  test('romance: false 的角色在提示里写明不是恋爱对象，关系值按 meter 的含义写', () => {
    const mauve = BUILTIN.find(p => p.id === 'mauve')!
    const st = staticBlock(mauve, 'en')
    expect(st).toContain('wolf「Wolf」')
    expect(st.match(/NOT a romance route: "affection" with this character means Seen through/g)?.length).toBe(1)
    const s = freshStory(mauve, 'en')
    const o = planOptions(mauve, s, 'en')[0]!
    expect(sceneDynamic(mauve, s, o, null, '', 'en', META)).toContain('Trust (not romance)')
    expect(staticBlock(P, 'zh')).not.toContain('NOT a romance route') // 恋爱包不受影响
    const eq = BUILTIN.find(p => p.id === 'equalia')!
    expect(eq.cast.every(c => c.romance === false && !!c.meter)).toBe(true)
  })
  test('meter 格式错误会报出', () => {
    const bad = JSON.parse(JSON.stringify(P)) as Pack
    bad.cast[0]!.meter = { label: '', full: '◆◆' }
    expect(validatePack(bad).some(e => e.includes('cast[0].meter'))).toBe(true)
  })
})

describe('章节关键事件', () => {
  test('相关的人可能在场时，引擎要求这一幕写到关键事件；写完记进 flags，不再重复', () => {
    const s = freshStory(P, 'zh')
    const ctx = sceneContext(P, s, opt(s, 'astro'), null)
    expect(ctx.beat?.id).toBe('recruit')
    expect(sceneDynamic(P, s, opt(s, 'astro'), null, '', 'zh', META, ctx)).toContain('[Must happen in this scene — 开端]')
    expect(sceneContext(P, s, opt(s, 'library'), null).beat).toBe(null) // 小满不在图书馆
    const after = applyScene(s, scene(['xiaoman'], { beat: 'recruit' }))
    expect(after.flags).toContain('beat:recruit')
    expect(sceneContext(P, after, opt(after, 'astro'), null).beat).toBe(null)
  })

  test('到了最后期限的最后一个时段，不论谁在场都要写', () => {
    const s = at(freshStory(P, 'zh'), 2, 2) // recruit：第 1 天起，最晚第 2 天
    expect(dueBeat(P, s, ['qingyi'])?.id).toBe('recruit')
    expect(dueBeat(P, at(s, 2, 1), ['qingyi'])).toBe(null)
  })

  test('关键约定：在关键事件里答应的事带上 key，记在事件涉及的主角色名下', () => {
    let s = applyScene(at(freshStory(P, 'zh'), 8, 1), scene(['yinuo', 'xiaoman'], { beat: 'rumor' }))
    s = applyChoice(P, s, choice({ kind: 'promise', promise: '流星雨那晚一定到' }), 'zh').story
    expect(s.promises[0]).toEqual(expect.objectContaining({ key: 'rumor', heroine: 'yinuo' })) // 一诺也在 beat.who 里，领头的就是她
    let t = applyScene(at(freshStory(P, 'zh'), 9, 2), scene(['zhiyao', 'qingyi'], { beat: 'river' }))
    t = applyChoice(P, t, choice({ kind: 'promise' }), 'zh').story
    expect(t.promises[0]).toEqual(expect.objectContaining({ key: 'river', heroine: 'qingyi' })) // 领头的知遥不在 beat.who 里
  })

  test('关键约定：几个人共用的关键事件，约定记在在场的人里好感最高的那位名下', () => {
    let s = at(freshStory(P, 'zh'), 10, 1)
    s.heroines.wenli = { ...s.heroines.wenli!, affection: 7 }
    s = applyScene(s, scene(['yinuo', 'wenli'], { beat: 'vote' })) // 领头的是一诺，但玩家在追温璃
    s = applyChoice(P, s, choice({ kind: 'promise' }), 'zh').story
    expect(s.promises[0]).toEqual(expect.objectContaining({ key: 'vote', heroine: 'wenli' }))
  })

  test('过期的关键事件不再挤占后面的时段：先写此时此地该写的，过期的那个顺带补上', () => {
    const mauve = BUILTIN.find(p => p.id === 'mauve')!
    // 第 3 天没去见狼：request 过期；第 4 天下午的固定事件（狼扮外婆）仍写 cucumbers
    const s = { ...at(freshStory(mauve, 'zh'), 4, 0), flags: ['beat:basket', 'beat:hello', 'beat:salesman', 'beat:warn-granny'] }
    const ctx = sceneContext(mauve, s, forcedEvent(mauve, s, 'zh')!, null)
    expect([ctx.beat?.id, ctx.also?.id]).toEqual(['cucumbers', 'request'])
    const after = applyScene(s, scene(['wolf'], { beat: 'cucumbers', also: 'request' }))
    expect(after.flags).toEqual(expect.arrayContaining(['beat:cucumbers', 'beat:request']))
    expect(alsoBeat(mauve, after, null)).toBe(null)
  })

  test('关键事件可以限定时段和地点；到了最后机会，日程把玩家带到那里', () => {
    const p = JSON.parse(JSON.stringify(P)) as Pack
    const b = p.acts![0]!.beats.find(x => x.id === 'recruit')!
    b.slots = [2]; b.places = ['roof']
    expect(validatePack(p)).toEqual([])
    const s = freshStory(p, 'zh')
    expect(dueBeat(p, s, ['xiaoman'], 'roof')).toBe(null) // 第 0 时段不合
    expect(dueBeat(p, at(s, 1, 2), ['xiaoman'], 'oldstreet')).toBe(null) // 地点不合
    expect(dueBeat(p, at(s, 1, 2), ['xiaoman'], 'roof')?.id).toBe('recruit')
    const f = forcedEvent(p, at(s, 2, 2), 'zh') // by 那天的最后一个允许时段
    expect([f?.id, f?.maybe]).toEqual(['roof', ['xiaoman']])
    expect(forcedEvent(p, { ...at(s, 2, 2), flags: ['beat:recruit'] }, 'zh')).toBe(null)
    b.places = ['library']
    expect(validatePack(p).some(e => e.includes('beats[0].places'))).toBe(true) // 图书馆第 2 时段不开
  })

  test('跨幕时给出悬念钩子和下一幕的标题', () => {
    const r = advanceTime(P, { ...at(freshStory(P, 'zh'), 4, 2), phase: 'after' }, 'zh')
    expect(r.story.after).toContain('社团人数核查表')
    expect(r.story.after).toContain('第二幕 · 转折')
    expect(chapterOf(P, 'zh', 5)).toBe('第二章 · 月考前后')
  })
})

describe('随机事件', () => {
  test('同一个种子掷出同样的结果（回退、读档不变），换种子会变', () => {
    const s = at(freshStory(P, 'zh', 1, 42), 3, 2)
    expect(rollIncident(P, s)).toBe(rollIncident(P, { ...s }))
    const seen = new Set<string>()
    for (let seed = 1; seed <= 400; seed++) seen.add(rollIncident(P, at(freshStory(P, 'zh', 1, seed), 3, 2)))
    expect(seen.has('')).toBe(true)
    expect(seen.has('storm')).toBe(true)
    expect(seen.has('blackout')).toBe(true)
  })

  test('条件：天数、时段、需要的阶段、先发生过的事', () => {
    const find = (s: Story, id: string) => {
      for (let seed = 1; seed <= 2000; seed++) if (rollIncident(P, { ...s, seed }) === id) return seed
      return 0
    }
    const day6 = at(freshStory(P, 'zh'), 6, 0)
    expect(find(day6, 'sickday')).toBe(0) // 知遥还没到「心事」
    day6.heroines.zhiyao = { ...day6.heroines.zhiyao!, stage: 2 }
    expect(find(day6, 'sickday')).toBeGreaterThan(0)
    const day9 = at(freshStory(P, 'zh'), 9, 0)
    expect(find(day9, 'queue')).toBe(0) // 误会那件事还没发生
    expect(find({ ...day9, flags: ['beat:rumor'] }, 'queue')).toBeGreaterThan(0)
    expect(find(at(freshStory(P, 'zh'), 1, 0), 'storm')).toBe(0) // storm 从第 2 天起
  })

  test('限地点的事件只在那里发生；发生过就不再掷（可重复的除外）', () => {
    const s = { ...freshStory(P, 'zh'), incident: 'freezer' }
    expect(incidentHere(P, s, opt(s, 'shop'))?.id).toBe('freezer')
    expect(incidentHere(P, s, opt(s, 'library'))).toBe(undefined)
    const ctx = sceneContext(P, s, opt(s, 'shop'), null)
    expect(ctx.incident?.id).toBe('freezer')
    const done = applyScene(s, scene(['zhiyao'], { incident: 'freezer' }))
    expect([done.incident, done.flags.includes('inc:freezer')]).toEqual(['', true])
    for (let seed = 1; seed <= 300; seed++) expect(rollIncident(P, at({ ...done, seed }, 5, 1))).not.toBe('freezer')
  })

  test('推进时段时重掷', () => {
    let hit = false
    for (let seed = 1; seed <= 200 && !hit; seed++) {
      const r = advanceTime(P, { ...at(freshStory(P, 'zh', 1, seed), 2, 2), phase: 'after' }, 'zh')
      if (r.story.incident) hit = true
    }
    expect(hit).toBe(true)
  })
})

describe('多结局', () => {
  const ready = (s: Story, id: string, stage: number, aff: number) => { s.heroines[id] = { ...s.heroines[id]!, stage, affection: aff } }
  const kept = (heroine: string, key?: string) => ({ text: 'x', heroine, day: 1, due: 2, status: 'kept' as const, ...(key ? { key } : {}) })

  test('真 > 好 > 普通 > 坏 > 群像 / 兜底', () => {
    const s = freshStory(P, 'zh')
    expect(pickEnding(P, s).id).toBe('normal')
    ready(s, 'xiaoman', 4, 12)
    expect(pickEnding(P, s).id).toBe('xiaoman-good')
    s.promises = [kept('xiaoman', 'rumor')]
    expect(pickEnding(P, s).id).toBe('xiaoman-good') // 还差流星雨那一幕
    s.flags = ['beat:meteor']
    expect(pickEnding(P, s).id).toBe('xiaoman-true')
    s.promises = [kept('xiaoman', 'rumor'), { ...kept('xiaoman'), status: 'broken' }]
    expect(pickEnding(P, s).id).toBe('xiaoman-near')
    ready(s, 'xiaoman', 2, 6)
    expect(pickEnding(P, s).id).toBe('xiaoman-bad')
  })

  test('关键约定要记在她名下才算；二周目真结局只在二周目出现', () => {
    const s = freshStory(P, 'zh')
    ready(s, 'wenli', 4, 13)
    s.promises = [kept('yinuo', 'vote')]
    expect(pickEnding(P, s).id).toBe('wenli-good')
    s.promises = [kept('wenli', 'vote')]
    expect(pickEnding(P, s).id).toBe('wenli-good') // minLoop 2
    expect(pickEnding(P, { ...s, loop: 2 }).id).toBe('wenli-true')
  })

  test('真结局可以要求集齐信物', () => {
    const s = freshStory(P, 'zh')
    ready(s, 'qingyi', 4, 12)
    s.promises = [kept('qingyi', 'river')]
    expect(pickEnding(P, s).id).toBe('qingyi-good')
    const k = { pack: 'cicada', day: 1, heroine: 'qingyi', title: 'x', desc: '', art: [], palette: {} }
    expect(pickEnding(P, { ...s, keepsakes: [k, k] }).id).toBe('qingyi-true')
  })

  test('群像结局：五个人都到「心事」，没有人更进一步', () => {
    const s = freshStory(P, 'zh')
    for (const c of P.cast) ready(s, c.id, 2, 6)
    expect(pickEnding(P, s).id).toBe('five-on-the-roof')
  })

  test('群像结局同 tier 平局时优先；约定条件按所有人合计', () => {
    const s = freshStory(P, 'zh')
    for (const c of P.cast) ready(s, c.id, 2, 6)
    ready(s, 'xiaoman', 3, 9) // 小满的「近」结局也是 tier 2
    expect(pickEnding(P, s).id).toBe('five-on-the-roof')
    const p = JSON.parse(JSON.stringify(P)) as Pack
    p.endings.find(e => e.id === 'five-on-the-roof')!.maxBroken = 0
    s.promises = [{ text: 'x', heroine: 'qingyi', day: 1, due: 2, status: 'broken' }]
    expect(pickEnding(p, s).id).toBe('xiaoman-near')
  })

  test('每个主角色都有真、好、普通、坏四种结局', () => {
    for (const c of P.cast) {
      expect(P.endings.filter(e => e.who === c.id).map(e => e.kind).sort()).toEqual(['bad', 'good', 'normal', 'true'])
    }
  })
})

describe('时间循环', () => {
  test('没达到目标结局就回到第 1 天，伏笔簿与事实保留，好感与关键事件清零', () => {
    const s: Story = { ...at(freshStory(LOOP, 'zh'), LOOP.days, LOOP.slots.length - 1), phase: 'after', facts: ['f'], flags: ['beat:x'], notes: [{ day: 2, heroine: '', text: 'n', used: true }] }
    const id = LOOP.cast[0]!.id
    s.heroines[id] = { ...s.heroines[id]!, affection: 3 }
    const r = advanceTime(LOOP, s, 'zh')
    expect(r.looped).toBe(true)
    expect([r.story.day, r.story.cycle, r.story.facts, r.story.heroines[id]!.affection, r.story.flags]).toEqual([1, 2, ['f'], 0, []])
    expect(r.story.notes[0]!.used).toBe(false)
    const last = advanceTime(LOOP, { ...s, cycle: LOOP.features!.timeLoop!.maxLoops + 1 }, 'zh')
    expect(last.finished).toBe(true)
  })
})

describe('旧包兼容', () => {
  test('第一版格式的包照常通过校验、开局、推进、结局', () => {
    const p = oldPack()
    expect(validatePack(p)).toEqual([])
    let s: Story = { ...freshStory(p, 'zh'), phase: 'after' }
    expect(s.incident).toBe('')
    const ctx = sceneContext(p, s, planOptions(p, s, 'zh')[0]!, null)
    expect([ctx.beat, ctx.incident]).toEqual([null, null])
    s = advanceTime(p, s, 'zh').story
    expect([s.day, s.slot]).toEqual([1, 1])
    expect(pickEnding(p, s).id).toBe('normal')
    expect(chapterOf(p, 'zh', 1)).toBe('TODO 第一章')
  })

  test('写了 acts 的包可以省略 chapters；两样都没有才报错', () => {
    const p = JSON.parse(JSON.stringify(P)) as Pack
    delete p.chapters
    expect(validatePack(p)).toEqual([])
    expect(chapterOf(p, 'zh', 6)).toBe('第二幕 · 转折')
    delete p.acts
    for (const e of p.endings) { delete e.keptKey; delete e.flags }
    p.incidents = p.incidents!.filter(x => !x.after)
    expect(validatePack(p).some(e => e.startsWith('chapters'))).toBe(true)
  })
})

describe('旧存档迁移', () => {
  /** 第一版存档里的 Story：没有 v / seed / flags / incident，主角色只有三个 */
  const OLD = {
    pack: 'cicada', lang: 'zh', loop: 1, cycle: 1, rewinds: 0, loads: 0, phase: 'plan', day: 3, slot: 1,
    heroines: { xiaoman: { affection: 4, stage: 1, scenes: 2, mood: '', lastDay: 2 }, qingyi: { affection: 0, stage: 0, scenes: 0, mood: '', lastDay: 0 }, zhiyao: { affection: 1, stage: 0, scenes: 0, mood: '', lastDay: 1 } },
    promises: [{ text: 'x', heroine: 'xiaoman', day: 2, due: 13, status: 'open' }], notes: [], facts: ['天文社在旧器材室'], keepsakes: [], album: [],
    scene: null, after: '', reveal: 0, loadingText: '', ending: '', endingId: '', error: '',
    usage: { writer: 4, checker: 4, input: 1, output: 2, cacheRead: 3, cacheWrite: 0 },
  }

  test('补上新字段和新角色，原有进度不丢', () => {
    expect(needsMigration(OLD, P)).toBe(true)
    const s = normalizeStory(OLD, P)!
    expect([s.v, s.flags, s.incident, typeof s.seed, s.gossip, s.world]).toEqual([3, [], '', 'number', [], []])
    expect(s.heroines.xiaoman).toEqual(OLD.heroines.xiaoman)
    expect(s.heroines.wenli).toEqual({ affection: 0, stage: 0, scenes: 0, mood: '', lastDay: 0 })
    expect([s.day, s.slot, s.facts, s.usage.writer, s.promises.length]).toEqual([3, 1, ['天文社在旧器材室'], 4, 1])
    expect(needsMigration(s, P)).toBe(false)
    // 迁移后能接着玩
    expect(advanceTime(P, { ...s, phase: 'after' }, 'zh').story.slot).toBe(2)
  })

  test('认不出的格式返回 null（调用方降级显示），不抛错', () => {
    for (const bad of [null, 'junk', 42, [], { foo: 1 }, { pack: 'cicada', day: 'x', slot: 0 }]) expect(normalizeStory(bad, P)).toBe(null)
    expect(normalizeStory({ ...OLD, phase: 'scene', scene: { broken: true } }, P)!.phase).toBe('plan')
  })
})

describe('信物校验', () => {
  test('合格的 8×8 图', () => {
    const ok = validKeepsake(['..aa....', '.abba...', '.abba...', '..aa....', '...c....', '...c....', '...c....', '..ccc...'], { a: '#ff0000', b: '#ffffff', c: '#00ff00' })
    expect(ok?.art.length).toBe(8)
    expect(ok?.palette.a).toBe(0xff0000)
  })
  test('用了调色板外的字母、行数太少、全透明、颜色太多都不收', () => {
    const rows = Array(8).fill('aaaaaaaa')
    expect(validKeepsake(rows.map(r => r.replace('a', 'z')), { a: '#000000' })).toBe(null)
    expect(validKeepsake(['aa', 'aa'], { a: '#000000' })).toBe(null)
    expect(validKeepsake(Array(8).fill('........'), { a: '#000000' })).toBe(null)
    expect(validKeepsake(rows, { a: '#1', b: '#2', c: '#3', d: '#4', e: '#5', f: '#6', g: '#7' })).toBe(null)
    expect(validKeepsake(rows, null)).toBe(null)
  })
  test('短行补透明', () => {
    expect(validKeepsake(['a', 'a', 'a', 'a', 'a', 'a'], { a: '#000000' })?.art[0]).toBe('a.......')
  })
})

describe('剧本包加载校验', () => {
  test('所有内置包通过校验，且中英文齐全', () => {
    for (const p of BUILTIN) {
      expect([p.id, validatePack(p)]).toEqual([p.id, []])
      for (const c of p.cast) expect(tr(c.name, 'en', p.defaultLang) !== tr(c.name, 'zh', p.defaultLang)).toBe(true)
    }
    expect(new Set(BUILTIN.map(p => p.id)).size).toBe(BUILTIN.length)
  })
  test('空白模板本身通过校验（作者从能跑的状态开始改）', () => {
    expect(validatePack(TEMPLATE)).toEqual([])
    expect(BUILTIN.some(p => p.id === TEMPLATE.id)).toBe(false)
  })
  test('格式错误逐条报出', () => {
    const bad = JSON.parse(JSON.stringify(CICADA)) as Pack & Record<string, unknown>
    bad.id = 'Bad Id'
    bad.cast[0]!.sprite.art[0] = 'short'
    bad.cast[1]!.haunts = { 0: ['nowhere'] }
    bad.endings = bad.endings.filter(e => e.id !== 'normal')
    bad.npcs![0]!.id = 'xiaoman'
    bad.relations![0]!.b = 'ghost'
    bad.acts![0]!.beats[0]!.who = ['ghost']
    bad.incidents![0]!.after = ['beat:nope']
    bad.endings[0]!.keptKey = 'photo' // photo 这个关键事件没有约定
    const errs = validatePack(bad)
    for (const k of ['id:', 'sprite.art[0]', 'unknown place', 'fallback', 'npcs[0].id', 'relations[0]', 'acts[0].beats[0].who', 'incidents[0].after', 'keptKey']) {
      expect([k, errs.some(e => e.includes(k))]).toEqual([k, true])
    }
    expect(validatePack('not a pack')).toEqual(['pack: not an object'])
  })
  test('缺失的语言回落到默认语言', () => {
    expect(tr({ zh: '中' }, 'en', 'zh')).toBe('中')
    expect(tr('plain', 'en', 'zh')).toBe('plain')
  })
})
