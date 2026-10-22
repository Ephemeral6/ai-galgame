// 纯逻辑测试：日程推进、约定到期、阶段推进、时间循环、结局判定、信物校验、剧本包校验。

import { describe, expect, test } from 'claude-code/testing'

import type { Choice, Pack, Scene, Story } from '../types'
import { validKeepsake } from '../hooks/art'
import { advanceTime, applyChoice, applyScene, forcedEvent, freshStory, pickEnding, planOptions, proactive } from '../hooks/engine'
import { tr, validatePack } from '../hooks/pack'
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

describe('日程推进', () => {
  test('一个时段接一个时段，跨天回到第一个时段', () => {
    let s: Story = { ...freshStory(P, 'zh'), phase: 'after' }
    s = advanceTime(P, s, 'zh').story
    expect([s.day, s.slot, s.phase]).toEqual([1, 1, 'plan'])
    s = advanceTime(P, at(s, 1, 2), 'zh').story
    expect([s.day, s.slot]).toEqual([2, 0])
  })

  test('地点按时段开放，常去的人列在「可能遇见」', () => {
    const opts = planOptions(P, freshStory(P, 'zh'), 'zh')
    const lib = opts.find(o => o.place === '图书馆')!
    expect(lib.maybe).toEqual(['qingyi'])
    expect(opts.some(o => o.place === '江边')).toBe(false)
    expect(planOptions(P, freshStory(P, 'en'), 'en').some(o => o.place === 'Library')).toBe(true)
  })

  test('固定事件锁定地点', () => {
    const f = forcedEvent(P, at(freshStory(P, 'zh'), 12, 1), 'zh')
    expect(f?.place).toBe('市体育场')
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

  test('到期前再见到她就算兑现', () => {
    let s = applyScene(at(freshStory(P, 'zh'), 3, 0), scene(['zhiyao']))
    s = applyChoice(P, s, choice({ kind: 'promise' }), 'zh').story
    s = applyScene(at(s, 4, 1), scene(['zhiyao']))
    expect(s.promises[0]!.status).toBe('kept')
  })

  test('同一幕里不会立刻算兑现', () => {
    let s = applyScene(at(freshStory(P, 'zh'), 3, 0), scene(['zhiyao']))
    s = applyChoice(P, s, choice({ kind: 'promise' }), 'zh').story
    s = applyScene(s, scene(['zhiyao']))
    expect(s.promises[0]!.status).toBe('open')
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

describe('结局判定', () => {
  test('真结局优先，兜底普通结局', () => {
    const s = freshStory(P, 'zh')
    expect(pickEnding(P, s).id).toBe('normal')
    s.heroines.qingyi = { ...s.heroines.qingyi!, stage: 4, affection: 14 }
    s.heroines.zhiyao = { ...s.heroines.zhiyao!, stage: 3, affection: 20 }
    expect(pickEnding(P, s).id).toBe('qingyi-true')
    s.promises = [{ text: 'x', heroine: 'qingyi', day: 1, due: 2, status: 'broken' }]
    expect(pickEnding(P, s).id).toBe('zhiyao-near')
  })
})

describe('时间循环', () => {
  test('没达到目标结局就回到第 1 天，伏笔簿与事实保留，好感清零', () => {
    const s: Story = { ...at(freshStory(LOOP, 'zh'), LOOP.days, LOOP.slots.length - 1), phase: 'after', facts: ['f'], notes: [{ day: 2, heroine: '', text: 'n', used: true }] }
    const id = LOOP.cast[0]!.id
    s.heroines[id] = { ...s.heroines[id]!, affection: 3 }
    const r = advanceTime(LOOP, s, 'zh')
    expect(r.looped).toBe(true)
    expect([r.story.day, r.story.cycle, r.story.facts, r.story.heroines[id]!.affection]).toEqual([1, 2, ['f'], 0])
    expect(r.story.notes[0]!.used).toBe(false)
    const last = advanceTime(LOOP, { ...s, cycle: LOOP.features!.timeLoop!.maxLoops + 1 }, 'zh')
    expect(last.finished).toBe(true)
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
      expect(validatePack(p)).toEqual([])
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
    const errs = validatePack(bad)
    expect(errs.some(e => e.startsWith('id:'))).toBe(true)
    expect(errs.some(e => e.includes('sprite.art[0]'))).toBe(true)
    expect(errs.some(e => e.includes('unknown place'))).toBe(true)
    expect(errs.some(e => e.includes('fallback'))).toBe(true)
    expect(validatePack('not a pack')).toEqual(['pack: not an object'])
  })
  test('缺失的语言回落到默认语言', () => {
    expect(tr({ zh: '中' }, 'en', 'zh')).toBe('中')
    expect(tr('plain', 'en', 'zh')).toBe('plain')
  })
})
