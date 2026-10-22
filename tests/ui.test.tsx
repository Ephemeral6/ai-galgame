// 通过面板走一遍：开新局 → 选地点（模型 mock）→ 翻句 → 选择 → 回退；存档/读档；导入剧本包；调用次数。

import { expect, mock, test } from 'claude-code/testing'
import type { On } from 'claude-code'

import { CICADA } from '../packs/cicada/pack'

const PANE = {
  plugin: 'ai-galgame',
  component: 'Pane',
  requestId: 'ai-galgame',
  props: {
    title: 'ai-galgame',
    isFocused: true,
    bodyColumns: 90,
    placement: 'dock',
    scroll: { offset: 0, bodyRows: 40 },
    view: {},
  },
} as const

const SCENE = {
  title: '旧望远镜', cast: [{ id: 'xiaoman', expression: 'smile' }], distance: 'near',
  narration: '天文社的门半开着。', lines: [{ who: 'xiaoman', text: '诶——你也太慢了吧！' }, { who: 'me', text: '路上有点堵。' }],
  choices: [
    { text: '帮她擦镜片', kind: 'reply', effects: { xiaoman: 2 }, reaction: '她别过脸去。' },
    { text: '看看桌上的星图', kind: 'observe', effects: {}, reaction: '星图上画满了红圈。' },
    { text: '答应明天还来', kind: 'promise', effects: { xiaoman: 1 }, promise: '明天放学还来天文社', reaction: '「说好了啊！」' },
  ],
  summary: '第一次走进天文社', callback: '', fact: '天文社在旧器材室',
}

const gal = (args: string) => ({ command: 'gal', args, origin: { kind: 'composer' as const }, presentation: { isFullscreen: true, columns: 160 } })

type Calls = { writer: number; checker: number; firstBlockCached: boolean[] }

function engineBeneath(on: On, opts: { checkerSays?: string; files?: Record<string, string> } = {}): Calls {
  const calls: Calls = { writer: 0, checker: 0, firstBlockCached: [] }
  mock.store(on)
  on('command.register', () => ({ value: { command: 'gal' } }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('ui.toast', () => ({ value: undefined }))
  on('ui.log', () => ({ value: undefined }))
  on('ui.blit', () => ({ value: {} }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('env.get', () => ({ value: '/home/test' }))
  on('fs.exists', () => ({ value: false }))
  on('fs.read', (_, e) => {
    const name = String(e.path).split('\\').join('/').split('/').pop()
    const f = Object.entries(opts.files ?? {}).find(([k]) => k.endsWith(`/${name}`))?.[1]
    return f === undefined ? { deny: 'missing' } : { value: f }
  })
  on('model.complete', (_, e) => {
    const usage = { input_tokens: 100, output_tokens: 50, cache_read_input_tokens: 900, cache_creation_input_tokens: 0 }
    calls.firstBlockCached.push(e.promptBlocks?.[0]?.cache === true)
    if (e.model === 'haiku') {
      calls.checker++
      return { value: { isAnswered: true as const, text: opts.checkerSays ?? '{"ok":true}', usage } }
    }
    calls.writer++
    return { value: { isAnswered: true as const, text: JSON.stringify(SCENE), usage } }
  })
  return calls
}

test('一幕：1 次写作 + 1 次检查，设定集打缓存；翻句、选择、回退', async ($, on) => {
  const calls = engineBeneath(on)
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })
  await $.command.run(gal(''))
  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })

  await ui.press({ key: 'menu-new' }) // 新的故事
  expect((await ui.find({ type: 'Text', text: /午休，去哪里/ }))).toBeDefined()
  await ui.press({ key: 'go-3' }) // 第 4 个地点：天文社（午休）
  expect(calls).toEqual({ writer: 1, checker: 1, firstBlockCached: [true, true] })
  expect(await ui.find({ type: 'Text', text: /天文社的门半开着/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /路上有点堵/ })).toBeUndefined()

  await ui.press({ key: 'kb-j' })
  await ui.press({ key: 'kb-a' })
  expect(await ui.find({ type: 'Text', text: /路上有点堵/ })).toBeDefined()

  await ui.press({ key: 'c2' }) // 答应明天还来
  expect(await ui.find({ type: 'Text', text: /说好了啊/ })).toBeDefined()
  await ui.press({ key: 'kb-j' }) // 继续 → 放学
  expect(await ui.find({ type: 'Text', text: /答应过小满/ })).toBeDefined()

  await ui.press({ key: 'kb-u' }) // 回退到选择前
  expect(await ui.find({ key: 'c0' })).toBeDefined()
  await ui.press({ key: 'kb-u' }) // 再退：回到选地点
  expect(await ui.find({ type: 'Text', text: /午休，去哪里/ })).toBeDefined()
  expect(calls.writer).toBe(1)
  await ui.unmount()
})

test('检查不过：带意见重写一次，重写稿不再检查', async ($, on) => {
  const calls = engineBeneath(on, { checkerSays: '{"ok":false,"fix":"她不会这样说话"}' })
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })
  await $.command.run(gal(''))
  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  await ui.press({ key: 'menu-new' })
  await ui.press({ key: 'go-0' })
  expect([calls.writer, calls.checker]).toEqual([2, 1])
  expect(await ui.find({ key: 'kb-j' })).toBeDefined()
  await ui.unmount()
})

test('存档与读档', async ($, on) => {
  engineBeneath(on)
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })
  await $.command.run(gal(''))
  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  await ui.press({ key: 'menu-new' })
  await ui.press({ key: 'kb-s' })
  await ui.press({ key: 'slot2' }) // 存到档位 2（第 1 天午休）
  await ui.press({ key: 'kb-b' })
  await ui.press({ key: 'go-0' })
  await ui.press({ key: 'kb-a' })
  await ui.press({ key: 'c0' })
  await ui.press({ key: 'kb-j' })
  expect(await ui.find({ type: 'Text', text: /放学，去哪里/ })).toBeDefined()
  await ui.press({ key: 'kb-s' })
  await ui.press({ key: 'mode-load' })
  await ui.press({ key: 'slot2' })
  expect(await ui.find({ type: 'Text', text: /午休，去哪里/ })).toBeDefined()
  await ui.unmount()
})

test('切换语言后界面与剧本都换成英文', async ($, on) => {
  engineBeneath(on)
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  await $.command.run(gal(''))
  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  await ui.press({ key: 'lang-en' })
  expect(await ui.find({ type: 'Text', text: /Cicadas & Evening Study/ })).toBeDefined()
  await ui.press({ key: 'menu-new' })
  expect(await ui.find({ type: 'Text', text: /Lunch — where to/ })).toBeDefined()
  await ui.unmount()
})

test('/gal import：校验通过才收下，列进剧本选择', async ($, on) => {
  const good = JSON.parse(JSON.stringify(CICADA)) as typeof CICADA
  good.id = 'mypack'
  good.title = { zh: '我的剧本', en: 'My Pack' }
  const bad = { ...good, id: 'broken', cast: [] }
  engineBeneath(on, { files: { '/p/good.json': JSON.stringify(good), '/p/bad.json': JSON.stringify(bad) } })
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })
  const r1 = await $.command.run(gal('import /p/bad.json'))
  expect(JSON.stringify(r1)).toContain('cast')
  const r2 = await $.command.run(gal('import /p/good.json'))
  expect(JSON.stringify(r2)).toContain('我的剧本')
  const v = await $.command.run(gal('validate /p/bad.json'))
  expect(JSON.stringify(v)).toContain('cast')
  const v2 = await $.command.run(gal('validate /p/good.json'))
  expect(JSON.stringify(v2)).toContain('14')
  const r3 = await $.command.run(gal('import /p/none.json'))
  expect(JSON.stringify(r3)).toContain('/p/none.json')
  await $.command.run(gal(''))
  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  await ui.press({ key: 'menu-packs' })
  expect(await ui.find({ key: 'pk-mypack' })).toBeDefined()
  await ui.unmount()
})

test('通关：结局解锁、通关次数、自动存档、二周目', async ($, on) => {
  const calls = engineBeneath(on)
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })
  await $.command.run(gal(''))
  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  await ui.press({ key: 'menu-packs' })
  await ui.press({ key: 'pk-radio' }) // 4 天 × 2 时段的短包
  await ui.press({ key: 'kb-b' })
  await ui.press({ key: 'menu-new' })
  for (let i = 0; i < 8; i++) {
    await ui.press({ key: 'go-0' })
    await ui.press({ key: 'kb-a' })
    await ui.press({ key: 'c0' })
    await ui.press({ key: 'kb-j' })
  }
  expect(await ui.find({ type: 'Text', text: /终幕/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /已见结局 1\/\d · 通关 1 次/ })).toBeDefined()
  // 8 幕 × (1 写作 + 1 检查) + 1 次结局
  expect([calls.writer, calls.checker]).toEqual([9, 8])
  await ui.press({ key: 'kb-1' }) // 二周目
  expect(await ui.find({ type: 'Text', text: /第 2 周目/ })).toBeDefined()
  await ui.unmount()
})

