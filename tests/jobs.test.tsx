// 接进命令和面板的后台任务：一句话生成（进度、id 冲突、取消）、从项目生成（先确认要读的文件）、导出与分享、社区安装。
// 模型、文件系统、网络全部 mock。

import { expect, mock, test } from 'claude-code/testing'
import type { On } from 'claude-code'

import type { Pack } from '../types'
import { TEMPLATE } from '../packs/_template/pack'
import { CICADA } from '../packs/cicada/pack'

const PANE = {
  plugin: 'ai-galgame', component: 'Pane', requestId: 'ai-galgame',
  props: { title: 'ai-galgame', isFocused: true, bodyColumns: 100, placement: 'dock', scroll: { offset: 0, bodyRows: 60 }, view: {} },
} as const
const gal = (args: string) => ({ command: 'gal', args, origin: { kind: 'composer' as const }, presentation: { isFullscreen: true, columns: 160 } })
const usage = { input_tokens: 1000, output_tokens: 500, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 }
const OUTLINE = JSON.stringify({ refuse: '', homage: '', id: 'my-pack', title: '雨夜书店', days: 7, cast: [{ id: 'her', name: '她', age: 22, romance: true }, { id: 'friend', name: '朋友', age: 30, romance: false }] })
const PACK = JSON.stringify({ ...TEMPLATE, days: 7 })

type World = { writes: Record<string, string>; reads: string[]; toasts: string[]; status: (string | undefined)[]; models: string[]; clock: ReturnType<typeof mock.clock>; fetched: string[] }

/** 测试环境会把路径换成本机格式（Windows 上是 C:\proj\…）：统一成 /proj/… 再比 */
const norm = (x: unknown) => String(x).split(String.fromCharCode(92)).join('/').replace(/^[A-Za-z]:/, '')

function world(on: On, opts: { slowModel?: boolean; repo?: Record<string, string> } = {}): World {
  const w: World = { writes: {}, reads: [], toasts: [], status: [], models: [], clock: mock.clock(on), fetched: [] }
  mock.store(on)
  on('command.register', () => ({ value: { command: 'gal' } }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('ui.toast', (_, e) => { w.toasts.push(e.text); return { value: undefined } })
  on('ui.log', () => ({ value: undefined }))
  on('ui.blit', () => ({ value: {} }))
  on('ui.status', (_, e) => { w.status.push(e.text); return { value: undefined } })
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('session.root', () => ({ value: '/proj' }))
  on('env.get', () => ({ value: '/home/test' }))
  on('fs.exists', () => ({ value: false }))
  on('fs.write', (_, e) => { w.writes[norm(e.path)] = e.text; return { value: undefined } })
  const repo = opts.repo ?? {}
  on('fs.list', (_, e) => {
    const dir = norm(e.path).replace(/\/$/, '')
    const names = Object.keys(repo).filter(k => k.startsWith(`${dir}/`)).map(k => k.slice(dir.length + 1).split('/')[0]!)
    return { value: [...new Set(names)].map(n => ({ name: n, kind: Object.keys(repo).some(k => k.startsWith(`${dir}/${n}/`)) ? 'dir' : 'file', size: repo[`${dir}/${n}`]?.length ?? 0 })) as never }
  })
  on('fs.read', (_, e) => { w.reads.push(norm(e.path)); const f = repo[norm(e.path)]; return f === undefined ? { deny: 'missing' } : { value: f } })
  on('http.fetch', (_, e) => {
    w.fetched.push(e.url)
    const mine = { ...JSON.parse(JSON.stringify(CICADA)) as Pack, id: 'rainy-shop', title: { zh: '雨天的店', en: 'Rainy Shop' } }
    if (e.url.endsWith('index.json')) {
      return { value: { status: 200, ok: true, headers: {}, text: JSON.stringify({ version: 1, packs: [
        { id: 'rainy-shop', title: { zh: '雨天的店', en: 'Rainy Shop' }, author: 'someone', license: 'CC BY 4.0', lang: ['zh'], summary: { zh: '一家只在雨天开门的店' }, url: 'https://example.org/rainy-shop.json' },
        { id: 'nc-pack', title: 'NC', author: 'x', license: 'CC BY-NC 4.0', lang: ['zh'], summary: 's', url: 'https://example.org/nc.json' },
      ] }) } }
    }
    return { value: { status: 200, ok: true, headers: {}, text: JSON.stringify(mine) } }
  })
  on('model.complete', async (_, e) => {
    const text = (e.promptBlocks ?? []).map(b => b.text).join('\n')
    w.models.push(e.model)
    if (opts.slowModel) await w.clock.sleep(60_000)
    return { value: { isAnswered: true as const, text: text.includes('step 1 of 2') ? OUTLINE : PACK, usage } }
  })
  return w
}

type TestEngine = Parameters<Extract<Parameters<typeof test>[1], (...args: never[]) => unknown>>[0]
async function open($: TestEngine) {
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })
  await $.command.run(gal(''))
  return $.ui.mount({ ...PANE, surface: 'terminal' })
}

test('/gal new：后台生成，状态栏显示进度，id 冲突时自动改名，生成的包出现在剧本列表里', async ($, on) => {
  const w = world(on)
  const ui = await open($)
  const r = await $.command.run(gal('new 雨夜里只开到凌晨的旧书店 --days 7 --cast 2'))
  expect(JSON.stringify(r)).toContain('开始生成')
  await w.clock.settle()
  expect(w.status.some(x => x?.includes('正在构思大纲'))).toBe(true)
  expect(w.toasts.some(x => x.includes('已生成《'))).toBe(true)
  await $.command.run(gal('new 再来一个'))
  await w.clock.settle()
  expect(Object.keys(w.writes).filter(k => k.includes('galgame-packs'))).toEqual(['/home/test/.claude/galgame-packs/my-pack.json', '/home/test/.claude/galgame-packs/my-pack-2.json'])
  await ui.press({ key: 'menu-packs' })
  expect(await ui.find({ key: 'pk-my-pack' })).toBeDefined()
  expect(await ui.find({ key: 'pk-my-pack-2' })).toBeDefined()
  expect(w.status.at(-1)).toBe(undefined) // 做完清掉状态栏
  expect(JSON.stringify(await $.command.run(gal('new')))).toContain('/gal new')
  await ui.unmount()
})

test('生成中可以取消（K 或 /gal cancel）', async ($, on) => {
  const w = world(on, { slowModel: true })
  const ui = await open($)
  await $.command.run(gal('new 慢慢来'))
  await w.clock.settle()
  expect(await ui.find({ key: 'job-cancel' })).toBeDefined()
  expect(JSON.stringify(await $.command.run(gal('new 再来')))).toContain('已经有一个')
  await ui.press({ key: 'job-cancel' })
  await w.clock.advance(200_000)
  expect(await ui.find({ key: 'job-cancel' })).toBeUndefined()
  expect(Object.keys(w.writes).filter(k => k.endsWith('.json') && !k.includes('draft'))).toEqual([])
  await ui.unmount()
})

test('/gal repo：先列出要读的文件等确认（不读源码、不读隐藏文件和密钥），确认后才调用模型', async ($, on) => {
  const w = world(on, { repo: { '/proj/README.md': '# My tool\nA tiny CLI.', '/proj/package.json': '{"name":"my-tool"}', '/proj/.env': 'TOKEN=abc', '/proj/src/main.ts': 'secret code', '/proj/secrets.json': '{}' } })
  const ui = await open($)
  const r = JSON.stringify(await $.command.run(gal('repo')))
  expect(r).toContain('README.md')
  expect(r).not.toContain('.env')
  expect(w.models).toEqual([]) // 还没确认，不调用模型
  expect(w.reads.filter(x => x.endsWith('main.ts') || x.endsWith('.env') || x.endsWith('secrets.json'))).toEqual([])
  expect(await ui.find({ key: 'job-yes' })).toBeDefined()
  await ui.press({ key: 'job-yes' })
  await w.clock.settle()
  expect(w.models.length).toBeGreaterThan(0)
  expect(w.toasts.slice(-1)).toEqual([expect.stringContaining('已生成《')])
  // 也可以不确认
  await $.command.run(gal('repo'))
  await ui.press({ key: 'job-no' })
  expect(await ui.find({ key: 'job-yes' })).toBeUndefined()
  await ui.unmount()
})

test('导出这一局与分享文字（不调用模型）', async ($, on) => {
  const w = world(on)
  const ui = await open($)
  await ui.press({ key: 'menu-new' })
  const r = JSON.stringify(await $.command.run(gal('export md')))
  expect(r).toContain('/proj/cicada-day-1.md')
  expect(w.writes['/proj/cicada-day-1.md']).toContain('蝉鸣与晚自习')
  await $.command.run(gal('export'))
  expect(Object.keys(w.writes).some(k => k.endsWith('.html'))).toBe(true)
  expect(JSON.stringify(await $.command.run(gal('share')))).toContain('蝉鸣与晚自习')
  expect(w.models).toEqual([])
  await ui.unmount()
})

test('社区：读索引（许可不在白名单的不显示），安装后出现在剧本列表，标成「社区」', async ($, on) => {
  const w = world(on)
  const ui = await open($)
  await $.command.run(gal('browse'))
  await w.clock.settle()
  expect(await ui.find({ key: 'cm-rainy-shop' })).toBeDefined()
  expect(await ui.find({ key: 'cm-nc-pack' })).toBeUndefined()
  await ui.press({ key: 'cm-rainy-shop' })
  await w.clock.settle()
  expect(w.toasts.some(x => x.includes('已安装《雨天的店》'))).toBe(true)
  await ui.press({ key: 'pk-tab0' })
  expect(await ui.find({ key: 'pk-rainy-shop', text: /社区/ })).toBeDefined()
  expect(w.models).toEqual([])
  await ui.unmount()
})
