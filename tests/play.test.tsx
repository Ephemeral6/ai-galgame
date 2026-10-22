// 面板上的新功能：边等边玩、写代码事件、预算与省额度、短幕、陪伴、成就与每日挑战、离开后的消息、顺其自然、
// 关系图、地图与标题卡、音效、紧凑排版。模型调用全部 mock。

import { expect, mock, test } from 'claude-code/testing'
import type { On } from 'claude-code'

const PANE = {
  plugin: 'ai-galgame', component: 'Pane', requestId: 'ai-galgame',
  props: { title: 'ai-galgame', isFocused: true, bodyColumns: 100, placement: 'dock', scroll: { offset: 0, bodyRows: 60 }, view: {} },
} as const

const SCENE = {
  title: '旧望远镜', atmo: { weather: 'clear', time: 'dusk', fx: 'cicadas' }, camera: { focus: '镜筒上的灰', pause: 0 },
  cast: [{ id: 'xiaoman', expression: 'smile' }], distance: 'near',
  narration: '天文社的门半开着。', lines: [{ who: 'xiaoman', text: '诶——你也太慢了吧！' }],
  cues: [{ at: 1, who: 'xiaoman', emote: '!' }],
  choices: [
    { text: '帮她擦镜片', kind: 'reply', tone: 'caring', effects: { xiaoman: 2 }, reaction: '她别过脸去。' },
    { text: '看看桌上的星图', kind: 'observe', tone: 'honest', effects: {}, reaction: '星图上画满了红圈。' },
    { text: '开个玩笑', kind: 'reply', tone: 'joking', effects: { xiaoman: 1 }, reaction: '「真是的！」' },
  ],
  summary: '第一次走进天文社', callback: '', fact: '天文社在旧器材室',
}

const gal = { command: 'gal', args: '', origin: { kind: 'composer' as const }, presentation: { isFullscreen: true, columns: 160 } }

type World = {
  writer: number; writerModels: string[]; checker: number; pilot: number; extras: number; prompts: string[]
  toasts: string[]; status: (string | undefined)[]; audio: string[]; clock: ReturnType<typeof mock.clock>
}

function world(on: On, opts: { store?: Record<string, unknown>; big?: boolean; pilotSays?: string } = {}): World {
  const w: World = { writer: 0, writerModels: [], checker: 0, pilot: 0, extras: 0, prompts: [], toasts: [], status: [], audio: [], clock: mock.clock(on, { now: Date.UTC(2026, 9, 23, 4) }) }
  mock.store(on, opts.store)
  on('command.register', () => ({ value: { command: 'gal' } }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('ui.toast', (_, e) => { w.toasts.push(e.text); return { value: undefined } })
  on('ui.log', () => ({ value: undefined }))
  on('ui.blit', () => ({ value: {} }))
  on('ui.status', (_, e) => { w.status.push(e.text); return { value: undefined } })
  on('audio.play', (_, e) => { w.audio.push(String((e.clip as { asset?: string }).asset ?? '')); return { value: undefined } })
  on('turn.start', (_, e) => ({ turnId: e.turnId }))
  on('turn.complete', (_, e) => ({ text: e.answer }))
  on('classic.PermissionRequest', () => ({}) as never)
  on('audio.speak', () => ({ value: { synthesizer: 'mock' } as never }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('env.get', () => ({ value: '/home/test' }))
  on('fs.exists', () => ({ value: false }))
  on('model.complete', (_, e) => {
    const usage = { input_tokens: 100, output_tokens: opts.big ? 2_000_000 : 50, cache_read_input_tokens: 900, cache_creation_input_tokens: 0 }
    const text = (e.promptBlocks ?? []).map(b => b.text).join('\n')
    w.prompts.push(text)
    if (text.startsWith('[Autoplay]')) { w.pilot++; return { value: { isAnswered: true as const, text: opts.pilotSays ?? '{"pick":3,"why":"你总爱开玩笑"}', usage } } }
    if (text.startsWith('Continuity')) { w.checker++; return { value: { isAnswered: true as const, text: '{"ok":true}', usage } } }
    if (text.startsWith('You are writing')) { w.writer++; w.writerModels.push(e.model); return { value: { isAnswered: true as const, text: JSON.stringify(SCENE), usage } } }
    w.extras++
    return { value: { isAnswered: true as const, text: '今天老街下雨了，我在图书馆等了你一会儿。', usage } }
  })
  return w
}

type TestEngine = Parameters<Extract<Parameters<typeof test>[1], (...args: never[]) => unknown>>[0]
async function open($: TestEngine, cols = 100) {
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })
  await $.command.run(gal)
  return $.ui.mount({ ...PANE, props: { ...PANE.props, bodyColumns: cols }, surface: 'terminal' })
}
async function settingsTab(ui: Awaited<ReturnType<typeof open>>, from: 'title' | 'game', sec: number) {
  await ui.press({ key: from === 'title' ? 'menu-settings' : 'kb-e' })
  await ui.press({ key: `sec${sec}` })
}

test('画面：标题卡、像素地图、氛围带、名牌、选项卡片与「顺其自然」', async ($, on) => {
  const w = world(on)
  const ui = await open($)
  expect(["{ key: 'card-title-cicada' }", !!(await ui.find({ key: 'card-title-cicada' }))]).toEqual(["{ key: 'card-title-cicada' }", true])
  await ui.press({ key: 'menu-new' })
  expect(["{ key: 'map' }", !!(await ui.find({ key: 'map' }))]).toEqual(["{ key: 'map' }", true])
  expect(["{ key: 'card-day-cicada-1-1' }", !!(await ui.find({ key: 'card-day-cicada-1-1' }))]).toEqual(["{ key: 'card-day-cicada-1-1' }", true])
  await ui.press({ key: 'go-5' })
  expect(["{ key: 'atmo' }", !!(await ui.find({ key: 'atmo' }))]).toEqual(["{ key: 'atmo' }", true])
  expect(["{ key: 'stage' }", !!(await ui.find({ key: 'stage' }))]).toEqual(["{ key: 'stage' }", true])
  expect(await ui.find({ type: 'Text', text: /◈ 特写：镜筒上的灰/ })).toBeUndefined() // 还没翻到
  await ui.press({ key: 'kb-a' })
  expect(["{ type: 'Text', text: /◈ 特写：镜筒上的灰/ }", !!(await ui.find({ type: 'Text', text: /◈ 特写：镜筒上的灰/ }))]).toEqual(["{ type: 'Text', text: /◈ 特写：镜筒上的灰/ }", true])
  expect(["{ type: 'Text', text: /^ 林小满 $/ }", !!(await ui.find({ type: 'Text', text: /^ 林小满 $/ }))]).toEqual(["{ type: 'Text', text: /^ 林小满 $/ }", true])
  expect(["{ key: 'c-let' }", !!(await ui.find({ key: 'c-let' }))]).toEqual(["{ key: 'c-let' }", true])
  // 顺其自然：1 次 Haiku，按我的习惯选
  await ui.press({ key: 'c-let' })
  expect(w.pilot).toBe(1)
  expect(w.prompts.at(-1)).toContain('Let it be')
  expect(["{ type: 'Text', text: /真是的/ }", !!(await ui.find({ type: 'Text', text: /真是的/ }))]).toEqual(["{ type: 'Text', text: /真是的/ }", true]) // 选了第 3 个
  expect(["{ type: 'Text', text: /→ 选 3：你总爱开玩笑/ }", !!(await ui.find({ type: 'Text', text: /→ 选 3：你总爱开玩笑/ }))]).toEqual(["{ type: 'Text', text: /→ 选 3：你总爱开玩笑/ }", true])
  expect(["{ type: 'Text', text: /小满 .* \\+1/ }", !!(await ui.find({ type: 'Text', text: /小满 .* \+1/ }))]).toEqual(["{ type: 'Text', text: /小满 .* \\+1/ }", true]) // 好感变化
  await ui.unmount()
})

test('关系图与「你在她眼里」', async ($, on) => {
  world(on)
  const ui = await open($)
  await ui.press({ key: 'menu-new' })
  await ui.press({ key: 'go-5' })
  await ui.press({ key: 'kb-a' })
  await ui.press({ key: 'c0' })
  await ui.press({ key: 'kb-r' })
  expect(await ui.find({ type: 'Text', text: /^关系图$/ })).toBeDefined()
  expect(await ui.find({ key: 'graph' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /小满/ })).toBeDefined()
  await ui.press({ key: 'kb-b' })
  await ui.press({ key: 'kb-p' })
  await ui.press({ key: 'tab5' })
  expect(await ui.find({ type: 'Text', text: /再多做几个选择/ })).toBeDefined()
  await ui.unmount()
})

test('边等边玩：Claude 开始干活时提示，写完或等批准时暂停自动模式并提醒', async ($, on) => {
  const w = world(on)
  const ui = await open($)
  await ui.press({ key: 'menu-new' })
  await $.turn.start({ text: 'fix the bug', turnId: 't1' })
  expect(await ui.find({ type: 'Text', text: /Claude 正在干活——趁现在玩一幕/ })).toBeDefined()
  await ui.press({ key: 'kb-o' })
  await w.clock.advance(500)
  expect(await ui.find({ type: 'Text', text: /自动中/ })).toBeDefined()
  await $.turn.complete({ answer: 'done', durationMs: 1000, isAborted: false, turnId: 't1', reason: 'answer' } as never)
  expect(w.toasts).toContain('Claude 写完了。游戏先停在这里。')
  expect(await ui.find({ type: 'Text', text: /自动中/ })).toBeUndefined()
  await $.classic.PermissionRequest({ tool_name: 'Bash', tool_input: {} } as never)
  expect(await ui.find({ type: 'Text', text: /Claude 在等你批准/ })).toBeDefined()
  // 子代理的回合不算
  await $.turn.start({ text: '', turnId: 't2', agentId: 'a1' } as never)
  expect(await ui.find({ type: 'Text', text: /Claude 正在干活/ })).toBeUndefined()
  // 设置里可以关掉
  await settingsTab(ui, 'game', 4)
  await ui.press({ key: 'set-watch' })
  await ui.press({ key: 'kb-b' })
  await $.turn.start({ text: 'again', turnId: 't3' })
  expect(await ui.find({ type: 'Text', text: /Claude 正在干活/ })).toBeUndefined()
  await ui.unmount()
})

test('写代码的事件（默认关）：测试失败进入下一幕的提示，不带命令内容；commit 变成信物；陪伴模式说一句', async ($, on) => {
  const w = world(on)
  on('tool.call', (_, e) => ({ result: { stdout: 'secret output', stderr: '', interrupted: false } as never, isError: (e as { command?: string }).command?.includes('fail') ?? false } as never))
  const ui = await open($)
  await ui.press({ key: 'menu-new' })
  await $.tool.call({ tool: 'Bash', command: 'npm test -- fail', tool_use_id: 'u1' } as never)
  await ui.press({ key: 'go-5' })
  expect(w.prompts.find(x => x.startsWith('You are writing'))).not.toContain('my tests just failed') // 默认关
  await settingsTab(ui, 'game', 4)
  await ui.press({ key: 'set-work' })
  await ui.press({ key: 'set-companion' }) // 小满
  await ui.press({ key: 'kb-b' })
  await ui.press({ key: 'kb-a' })
  await ui.press({ key: 'c0' })
  await ui.press({ key: 'kb-j' })
  await $.tool.call({ tool: 'Bash', command: 'npm test -- fail', tool_use_id: 'u2' } as never)
  expect(w.status.at(-1)).toContain('小满：')
  await $.tool.call({ tool: 'Bash', command: 'git commit -m "secret message"', tool_use_id: 'u3' } as never)
  expect(w.toasts.some(x => x.includes('第 1 次提交'))).toBe(true)
  await ui.press({ key: 'go-0' })
  const last = w.prompts.filter(x => x.startsWith('You are writing')).at(-1)!
  expect(last).toContain('my tests just failed')
  expect(last).toContain('committed my work')
  expect(last).not.toMatch(/npm test|secret message|secret output|git commit/)
  await ui.unmount()
})

test('省额度：写剧情改用 Haiku；每日预算到了就停；短幕；头部显示本局和今日花费', async ($, on) => {
  const w = world(on, { big: true })
  const ui = await open($)
  await settingsTab(ui, 'title', 3)
  await ui.press({ key: 'set-writer' })
  await ui.press({ key: 'set-budget' }) // $0.50
  expect(await ui.find({ type: 'Text', text: /Haiku（省额度）/ })).toBeDefined()
  await ui.press({ key: 'sec0' })
  await ui.press({ key: 'set-short' })
  await ui.press({ key: 'kb-b' })
  await ui.press({ key: 'menu-new' })
  await ui.press({ key: 'go-5' })
  expect(w.writerModels).toEqual(['haiku'])
  expect(w.prompts.find(x => x.startsWith('You are writing'))).toContain('[Short scene]')
  expect(await ui.find({ type: 'Text', text: /本局 \$\d.* · 今日 \$/ })).toBeDefined()
  await ui.press({ key: 'kb-a' })
  await ui.press({ key: 'c0' })
  await ui.press({ key: 'kb-j' })
  // 大量 token 让今日花费超过 $0.50：下一幕不再调用模型
  const before = w.writer
  await ui.press({ key: 'go-0' })
  expect(w.writer).toBe(before)
  expect(await ui.find({ type: 'Text', text: /今日预算已用完/ })).toBeDefined()
  await ui.unmount()
})

test('成就与每日挑战', async ($, on) => {
  const w = world(on)
  const ui = await open($)
  await ui.press({ key: 'menu-new' })
  await ui.press({ key: 'go-5' })
  expect(w.toasts).toContain('获得成就：第一幕')
  await ui.press({ key: 'kb-t' })
  await ui.press({ key: 'menu-feats' })
  expect(await ui.find({ type: 'Text', text: /★ 第一幕/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /通关 0 次 · 共 1 幕/ })).toBeDefined()
  await ui.press({ key: 'daily-start' })
  expect(await ui.find({ type: 'Text', text: /每日挑战/ })).toBeDefined()
  await ui.unmount()
})

test('离开超过 6 小时再回来：她发来一条消息（1 次 Haiku），可以收起', async ($, on) => {
  const save = { story: { pack: 'cicada', lang: 'zh', phase: 'plan', day: 3, slot: 0, heroines: { xiaoman: { affection: 5, stage: 1, scenes: 2, mood: '', lastDay: 2 } }, promises: [], notes: [], facts: [], keepsakes: [], album: [{ day: 2, slot: 1, heroine: 'xiaoman', text: '一起修望远镜' }], usage: {} }, at: 0 }
  const start = Date.UTC(2026, 9, 23, 4)
  const w = world(on, { store: { 'save:cicada:0': save, lastSeen: start - 7 * 3600_000 } })
  const ui = await open($)
  await ui.press({ key: 'menu-continue' })
  await w.clock.settle()
  expect(w.extras).toBe(1)
  expect(await ui.find({ type: 'Text', text: /小满发来一条消息/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /我在图书馆等了你一会儿/ })).toBeDefined()
  await ui.press({ key: 'kb-l' })
  expect(await ui.find({ type: 'Text', text: /发来一条消息/ })).toBeUndefined()
  await ui.unmount()
})

test('音效（默认关）与紧凑排版', async ($, on) => {
  const w = world(on)
  const ui = await open($, 70)
  await settingsTab(ui, 'title', 0)
  await ui.press({ key: 'set-sfx' })
  await ui.press({ key: 'kb-b' })
  await ui.press({ key: 'menu-new' })
  expect(await ui.find({ key: 'map' })).toBeUndefined() // 70 列：紧凑，不画地图
  await ui.press({ key: 'go-5' })
  await ui.press({ key: 'kb-a' })
  expect(await ui.find({ key: 'cc0' })).toBeUndefined() // 选项不加框
  await ui.press({ key: 'c0' })
  expect(w.audio).toEqual(['assets/sfx/page.wav', 'assets/sfx/choice.wav'])
  await ui.unmount()
})

test('写作手法层：预写关键场景那一幕仍是 1 次写作 + 1 次检查；作者的核心台词一句不少，检查员不许改；只演一次', async ($, on) => {
  const w = world(on)
  const ui = await open($)
  await ui.press({ key: 'menu-new' })
  await ui.press({ key: 'go-1' }) // 第 1 天午休去食堂：一诺的预写场景「三个问题一包辣条」
  expect([w.writer, w.checker]).toEqual([1, 1])
  const writerPrompt = w.prompts.find(x => x.startsWith('You are writing'))!
  expect(writerPrompt).toContain('第三题：你昨天在天台待到九点四十')
  expect(writerPrompt).toContain('[Craft') // 写作指南在缓存块里
  expect(w.prompts.find(x => x.startsWith('Continuity'))).toContain('canon')
  await ui.press({ key: 'kb-a' })
  // 模型没照抄（mock 回的是别的台词）：程序把核心台词拼回去，不重写
  expect(await ui.find({ type: 'Text', text: /第三题：你昨天在天台待到九点四十/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /不回答也是一种回答/ })).toBeDefined()
  await ui.press({ key: 'c0' })
  await ui.press({ key: 'kb-j' })
  await ui.press({ key: 'go-0' }) // 下一幕：同一场预写场景不再演
  expect(w.prompts.filter(x => x.startsWith('You are writing')).at(-1)).not.toContain('第三题：你昨天在天台待到九点四十')
  await ui.unmount()
})
