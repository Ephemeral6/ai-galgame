// 自动游玩：开关、四种策略的决策、连跑上限、按键打断、出错停下、混乱策略零调用、画面板不写状态。模型调用全部 mock，时钟用 mock.clock。

import { describe, expect, mock, test } from 'claude-code/testing'
import type { EngineInterface, On } from 'claude-code'

import { freshStory } from '../hooks/engine'
import { decide, parsePick, pilotPrompt } from '../hooks/pilot'
import { CICADA } from '../packs/cicada/pack'

const PANE = {
  plugin: 'ai-galgame', component: 'Pane', requestId: 'ai-galgame',
  props: { title: 'ai-galgame', isFocused: true, bodyColumns: 90, placement: 'dock', scroll: { offset: 0, bodyRows: 40 }, view: {} },
} as const

const SCENE = {
  title: '旧望远镜', cast: [{ id: 'xiaoman', expression: 'smile' }], distance: 'near',
  narration: '天文社的门半开着。', lines: [{ who: 'xiaoman', text: '诶——你也太慢了吧！' }, { who: 'me', text: '路上有点堵。' }],
  choices: [
    { text: '帮她擦镜片', kind: 'reply', effects: { xiaoman: 1 }, reaction: '她别过脸去。' },
    { text: '看看桌上的星图', kind: 'observe', effects: {}, reaction: '星图上画满了红圈。' },
    { text: '答应明天还来', kind: 'promise', effects: { xiaoman: 1 }, promise: '明天还来', reaction: '「说好了啊！」' },
  ],
  summary: '第一次走进天文社', callback: '', fact: '天文社在旧器材室',
}

const gal = { command: 'gal', args: '', origin: { kind: 'composer' as const }, presentation: { isFullscreen: true, columns: 160 } }

type World = { writer: number; checker: number; pilot: number; pilotPrompts: string[]; status: (string | undefined)[]; writes: number; clock: ReturnType<typeof mock.clock> }

function world(on: On, opts: { pilotSays?: (prompt: string) => string; writerSays?: string } = {}): World {
  const w: World = { writer: 0, checker: 0, pilot: 0, pilotPrompts: [], status: [], writes: 0, clock: mock.clock(on) }
  mock.store(on)
  on('command.register', () => ({ value: { command: 'gal' } }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('ui.toast', () => ({ value: undefined }))
  on('ui.log', () => ({ value: undefined }))
  on('ui.blit', () => ({ value: {} }))
  on('ui.status', (_, e) => { w.status.push(e.text); return { value: undefined } })
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('env.get', () => ({ value: '/home/test' }))
  on('fs.exists', () => ({ value: false }))
  on('state.set', (_, e, next) => { w.writes++; return next(e) })
  on('model.complete', (_, e) => {
    const usage = { input_tokens: 100, output_tokens: 20, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 }
    const text = (e.promptBlocks ?? []).map(b => b.text).join('\n')
    if (text.startsWith('[Autoplay]')) {
      w.pilot++
      w.pilotPrompts.push(text)
      return { value: { isAnswered: true as const, text: opts.pilotSays?.(text) ?? '{"pick":2,"why":"想看她会不会说出秘密"}', usage } }
    }
    if (e.model === 'haiku' && !text.startsWith('Continuity')) return { value: { isAnswered: true as const, text: '夜里老街的馄饨摊收得很晚。', usage } }
    if (e.model === 'haiku') { w.checker++; return { value: { isAnswered: true as const, text: '{"ok":true}', usage } } }
    w.writer++
    return { value: { isAnswered: true as const, text: opts.writerSays ?? JSON.stringify(SCENE), usage } }
  })
  return w
}

type TestEngine = Parameters<Extract<Parameters<typeof test>[1], (...args: never[]) => unknown>>[0]

async function open($: TestEngine, w: World) {
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })
  await $.command.run(gal)
  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  return ui
}

describe('决策（模型 mock）', () => {
  const s = { ...freshStory(CICADA, 'zh', 1, 3), day: 2 }
  const opts = ['教室 (maybe: xiaoman)', '图书馆 (maybe: qingyi)', '天文社']
  const meta = { endingsSeen: ['normal'] }

  test('提示用状态摘要，不带设定集；按策略换说法', () => {
    const whim = pilotPrompt(CICADA, s, 'place', opts, 'whim', '', meta, 'zh')
    expect(whim).toContain('Whim')
    expect(whim).toContain('3. 天文社')
    expect(whim).not.toContain('14 日早上的车') // 没有秘密、没有设定集
    expect(whim.length).toBeLessThan(1600)
    const focus = pilotPrompt(CICADA, s, 'place', opts, 'focus', 'qingyi', meta, 'zh')
    expect(focus).toContain('Target: qingyi 沈清漪')
    const collect = pilotPrompt(CICADA, { ...s, loop: 2 }, 'place', opts, 'collect', '', meta, 'zh')
    expect(collect).toContain('Not met yet: xiaoman, qingyi, zhiyao, yinuo, wenli')
    expect(collect).toContain('Endings not unlocked: 流星落在天台上')
    expect(collect).toContain('this is a replay')
    expect(collect).not.toContain('各自的暑假') // 已解锁的不列
  })

  test('选项提示说明观察不动人，选地点时不说', () => {
    // 实测：不说明时「随心」偏向观察，6 幕全选观察、好感全 0
    expect(pilotPrompt(CICADA, s, 'choice', ['[reply] 嗯', '[observe] 看她'], 'whim', '', meta, 'zh')).toContain('[observe] only notices a detail and moves no one')
    expect(pilotPrompt(CICADA, s, 'place', opts, 'whim', '', meta, 'zh')).not.toContain('[observe]')
  })

  test('只要编号和一句理由；读不懂时有退路', () => {
    expect(parsePick('{"pick": 2, "why": "想看她会不会说出秘密"}', 3)).toEqual({ index: 1, why: '想看她会不会说出秘密' })
    expect(parsePick('3：去天文社看看', 3)).toEqual({ index: 2, why: '去天文社看看' })
    expect(parsePick('{"pick": 9}', 3)).toBe(null)
    expect(parsePick(null, 3)).toBe(null)
  })

  test('四种策略：前三种各 1 次 Haiku 调用，混乱随机、零调用', async () => {
    const w = { pilot: 0, models: [] as string[] }
    const $ = { model: { complete: async (r: { model: string }) => { w.pilot++; w.models.push(r.model); return { isAnswered: true, text: '{"pick":2,"why":"想看她会不会说出秘密"}', usage: { input_tokens: 80, output_tokens: 20, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } } } } } as unknown as EngineInterface
    for (const strategy of ['focus', 'whim', 'collect'] as const) {
      const d = await decide($, CICADA, s, 'place', opts, strategy, 'qingyi', meta, 'zh')
      expect([d.index, d.why, d.usage.pilot]).toEqual([1, '想看她会不会说出秘密', 1])
    }
    expect([w.pilot, [...new Set(w.models)]]).toEqual([3, ['haiku']])
    const chaos = await decide($, CICADA, s, 'place', opts, 'chaos', '', meta, 'zh', () => 0.9)
    expect([chaos.index, chaos.usage.pilot]).toEqual([2, undefined])
    expect(w.pilot).toBe(3)
    expect((await decide($, CICADA, s, 'place', ['只有一个'], 'whim', '', meta, 'zh')).usage.pilot).toBe(undefined)
  })
})

test('开关：标题页按 O 开始，头部和状态栏显示「自动中」，再按 O 停止', async ($, on) => {
  const w = world(on)
  const ui = await open($, w)
  await ui.press({ key: 'kb-o' })
  await w.clock.advance(500)
  expect(await ui.find({ type: 'Text', text: /自动中/ })).toBeDefined()
  expect(w.status.at(-1)).toContain('自动中')
  await ui.press({ key: 'kb-o' })
  expect(w.status.at(-1)).toBe(undefined)
  expect(await ui.find({ type: 'Text', text: /自动模式已关闭/ })).toBeDefined()
  const before = w.writer + w.pilot
  await w.clock.advance(20_000)
  expect(w.writer + w.pilot).toBe(before) // 停了就不再推进
  await ui.unmount()
})

test('自动玩一幕：选地点 → 自动翻句 → 停顿后选选项，理由暗色显示，记进伏笔簿和相册，可以回退', async ($, on) => {
  const w = world(on)
  const ui = await open($, w)
  await ui.press({ key: 'menu-new' })
  await ui.press({ key: 'kb-o' })
  await w.clock.advance(500) // 选地点 + 写一幕
  expect([w.pilot, w.writer, w.checker]).toEqual([1, 1, 1])
  expect(await ui.find({ type: 'Text', text: /→ 选 2：想看她会不会说出秘密/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /路上有点堵/ })).toBeUndefined()
  // 中速：每句 1.5 秒（预写关键场景可能多拼进几句作者台词，所以等到最后一句出来为止）
  for (let i = 0; i < 12 && !(await ui.find({ key: 'c0' })); i++) await w.clock.advance(1500)
  expect(await ui.find({ type: 'Text', text: /路上有点堵/ })).toBeDefined()
  expect(w.pilot).toBe(1) // 选项出现后先停顿
  await w.clock.advance(2000)
  expect(w.pilot).toBe(2)
  expect(await ui.find({ type: 'Text', text: /星图上画满了红圈/ })).toBeDefined() // 选了第 2 项
  await ui.press({ key: 'kb-o' }) // 停下，看相册
  await ui.press({ key: 'kb-p' })
  expect(await ui.find({ type: 'Text', text: /第一次走进天文社/ })).toBeDefined()
  await ui.press({ key: 'kb-b' })
  await ui.press({ key: 'kb-u' }) // 可以回退
  expect(await ui.find({ key: 'c0' })).toBeDefined()
  // 设置页：决策调用单独计数
  await ui.press({ key: 'kb-e' })
  await ui.press({ key: 'sec3' }) // 设置 · 费用
  expect(await ui.find({ type: 'Text', text: /自动决策 2 次/ })).toBeDefined()
  await ui.unmount()
})

test('连跑上限：到了 N 幕自动暂停并提示', async ($, on) => {
  const w = world(on, { pilotSays: () => '{"pick":1,"why":"去近的地方"}' })
  const ui = await open($, w)
  await ui.press({ key: 'menu-settings' })
  await ui.press({ key: 'sec1' }) // 设置 · 自动
  await ui.press({ key: 'set-limit' }) // 6 → 3
  expect(await ui.find({ type: 'Text', text: /3 幕后暂停/ })).toBeDefined()
  await ui.press({ key: 'kb-b' })
  await ui.press({ key: 'menu-new' })
  await ui.press({ key: 'kb-o' })
  for (let i = 0; i < 40; i++) await w.clock.advance(1500)
  expect(w.writer).toBe(3)
  expect(await ui.find({ type: 'Text', text: /已连跑 3 幕/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /自动中/ })).toBeUndefined()
  await ui.unmount()
})

test('按别的键就暂停自动模式；在设置里切换策略不打断', async ($, on) => {
  const w = world(on)
  const ui = await open($, w)
  await ui.press({ key: 'menu-new' })
  await ui.press({ key: 'kb-o' })
  await w.clock.advance(500)
  await ui.press({ key: 'kb-e' }) // 设置：不打断
  await ui.press({ key: 'sec1' })
  await ui.press({ key: 'set-strategy' })
  expect(await ui.find({ type: 'Text', text: /收集/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /设置 · 自动中/ })).toBeDefined()
  await ui.press({ key: 'kb-b' })
  await ui.press({ key: 'kb-a' }) // 玩家自己翻句：暂停
  expect(await ui.find({ type: 'Text', text: /自动模式已暂停（你按了键）/ })).toBeDefined()
  const before = w.writer + w.pilot
  await w.clock.advance(20_000)
  expect(w.writer + w.pilot).toBe(before)
  await ui.unmount()
})

test('出错时停下并显示原因', async ($, on) => {
  const w = world(on, { writerSays: 'not json' })
  const ui = await open($, w)
  await ui.press({ key: 'menu-new' })
  await ui.press({ key: 'kb-o' })
  await w.clock.advance(500)
  expect(w.writer).toBe(2) // 写一次 + 带意见重写一次，都失败
  expect(await ui.find({ type: 'Text', text: /自动模式停下：这一幕没写出来/ })).toBeDefined()
  await w.clock.advance(20_000)
  expect(w.writer).toBe(2)
  await ui.unmount()
})

test('混乱策略：随机选，不调用决策模型', async ($, on) => {
  const w = world(on)
  const ui = await open($, w)
  await ui.press({ key: 'menu-settings' })
  await ui.press({ key: 'sec1' }) // 设置 · 自动
  for (let i = 0; i < 2; i++) await ui.press({ key: 'set-strategy' }) // 随心 → 收集 → 混乱
  expect(await ui.find({ type: 'Text', text: /混乱/ })).toBeDefined()
  await ui.press({ key: 'kb-b' })
  await ui.press({ key: 'menu-new' })
  await ui.press({ key: 'kb-o' })
  for (let i = 0; i < 12; i++) await w.clock.advance(1500)
  expect(w.writer).toBeGreaterThan(1)
  expect(w.pilot).toBe(0)
  await ui.unmount()
})

test('专一策略：没指定对象时先问 AI 想追谁（1 次），之后的决策都带上这个人', async ($, on) => {
  const w = world(on, { pilotSays: p => (p.includes('Which character') ? '{"pick":3,"why":"想知道她的膝盖怎么了"}' : '{"pick":1,"why":"跟着她"}') })
  const ui = await open($, w)
  await ui.press({ key: 'menu-settings' })
  await ui.press({ key: 'sec1' }) // 设置 · 自动
  for (let i = 0; i < 3; i++) await ui.press({ key: 'set-strategy' }) // 随心 → 收集 → 混乱 → 专一
  expect(await ui.find({ type: 'Text', text: /专一/ })).toBeDefined()
  await ui.press({ key: 'kb-b' })
  await ui.press({ key: 'menu-new' })
  await ui.press({ key: 'kb-o' })
  await w.clock.advance(500)
  expect(w.pilotPrompts[0]).toContain('Which character')
  expect(w.pilotPrompts[1]).toContain('Target: zhiyao')
  await ui.unmount()
})

test('画面板不写状态：挂载、重画各个页面时没有任何 state.set', async ($, on) => {
  const w = world(on)
  const ui = await open($, w)
  await ui.press({ key: 'menu-new' })
  await ui.press({ key: 'kb-o' })
  await w.clock.advance(500)
  await ui.press({ key: 'kb-o' })
  await w.clock.settle()
  await ui.unmount()
  const before = w.writes
  for (let i = 0; i < 3; i++) {
    const again = await $.ui.mount({ ...PANE, surface: 'terminal' })
    expect(await again.find({ type: 'Text', text: /自动模式已关闭/ })).toBeDefined()
    await again.unmount()
  }
  expect(w.writes).toBe(before)
})
