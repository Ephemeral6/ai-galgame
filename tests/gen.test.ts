// 生成剧本包：校验失败交回模型修、版权作品被改写或拒绝、露骨请求不调用模型、未成年角色不写恋爱线、
// 从代码仓库生成时不读敏感文件且不泄露内容。模型与文件系统全部 mock。

import { describe, expect, test } from 'claude-code/testing'
import type { EngineInterface, FsEntry, ModelTextBlock } from 'claude-code'

import type { Pack } from '../types'
import { formatSpec, generatePack, packFromRepo, protectedHits, redact, scanRepo } from '../hooks/gen'
import { validatePack } from '../hooks/pack'
import { TEMPLATE } from '../packs/_template/pack'

const usage = { input_tokens: 1000, output_tokens: 500, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 }
type Step = 'outline' | 'expand' | 'repair'
type Call = { step: Step; text: string; cached: boolean }

const clone = (p: Pack): Pack => JSON.parse(JSON.stringify(p)) as Pack
const good = (): Pack => clone(TEMPLATE)
const outline = (extra: Record<string, unknown> = {}) => JSON.stringify({
  refuse: '', homage: '', id: 'my-pack', title: '雨夜书店', days: 3,
  cast: [{ id: 'her', name: '她', age: 22, romance: true }, { id: 'friend', name: '朋友', age: 30, romance: false }], ...extra,
})

type Fs = { list: (path?: string) => Promise<FsEntry[]>; read: (path: string) => Promise<string> }

/** 假的 $：模型按顺序回答（大纲一次，之后每次展开 / 修复取下一个），文件系统可选 */
function engine(outlineText: string, packs: string[], fs?: Fs): { $: EngineInterface; calls: Call[] } {
  const calls: Call[] = []
  const complete = async (req: { prompt: string | readonly ModelTextBlock[] }) => {
    const blocks: readonly ModelTextBlock[] = typeof req.prompt === 'string' ? [{ text: req.prompt }] : req.prompt
    const text = blocks.map(b => b.text).join('\n')
    const step: Step = text.includes('step 1 of 2') ? 'outline' : text.includes('fix the pack') ? 'repair' : 'expand'
    calls.push({ step, text, cached: blocks[0]?.cache === true })
    const reply = step === 'outline' ? outlineText : packs.shift() ?? '{}'
    return { isAnswered: true, text: reply, usage }
  }
  const fail = async () => { throw new Error('no file system in this test') }
  const $ = { model: { complete }, fs: fs ?? { list: fail, read: fail } } as unknown as EngineInterface
  return { $, calls }
}

describe('一句话生成', () => {
  test('先大纲后展开；校验不通过就把错误交回模型修，修好即停', async () => {
    const broken = good()
    broken.cast[0]!.sprite.art[0] = '..B..'
    const { $, calls } = engine(outline(), ['```json\n' + JSON.stringify(broken) + '\n```', JSON.stringify(good())])
    const steps: string[] = []
    const r = await generatePack($, '雨夜里只开到凌晨的旧书店', { lang: 'zh', days: 3, castSize: 2, onStep: s => steps.push(s) })
    expect(r.errors).toEqual([])
    expect(r.pack?.id).toBe('my-pack')
    expect(validatePack(r.pack)).toEqual([])
    expect(r.pack?.source).toBe('original')
    expect(r.pack?.langs).toEqual(['zh'])
    expect(calls.map(c => c.step)).toEqual(['outline', 'expand', 'repair'])
    expect(calls[2]!.text).toContain('cast[0].sprite.art[0]: exactly 14 characters')
    expect(calls.every(c => c.cached)).toBe(true) // 格式说明是缓存块
    expect(r.usage.writer).toBe(3)
    expect(steps).toEqual(['outline', 'expand', 'repair', 'done'])
    expect(JSON.parse(r.json).id).toBe('my-pack')
  })

  test('修两次仍不通过：不给包，把问题和最后一版 JSON 交回去', async () => {
    const bad = good() as unknown as Record<string, unknown>
    delete bad.endings
    const { $, calls } = engine(outline(), [JSON.stringify(bad), JSON.stringify(bad), JSON.stringify(bad)])
    const r = await generatePack($, '灯塔', { lang: 'zh', days: 3 })
    expect(r.pack).toBe(null)
    expect(r.errors.some(e => e.startsWith('endings'))).toBe(true)
    expect(r.json.length).toBeGreaterThan(100)
    expect(calls.map(c => c.step)).toEqual(['outline', 'expand', 'repair', 'repair'])
  })

  test('回复被截断（不是 JSON）时重新展开并要求写短', async () => {
    const { $, calls } = engine(outline(), ['{"id": "my-pack", "title": "雨', JSON.stringify(good())])
    const r = await generatePack($, '雨', { lang: 'zh', days: 3 })
    expect(r.errors).toEqual([])
    expect(calls.map(c => c.step)).toEqual(['outline', 'expand', 'expand'])
    expect(calls[2]!.text).toContain('write shorter texts')
  })

  test('点名受版权保护的作品：提示要求改写成原创致敬，结果里残留的名字会被打回去修', async () => {
    const leaked = good()
    leaked.places[0]!.name = '霍格沃茨图书馆'
    const { $, calls } = engine(outline({ homage: '保留魔法学院与友情的氛围，人物和地点全部原创' }), [JSON.stringify(leaked), JSON.stringify(good())])
    const r = await generatePack($, '写一个哈利·波特在霍格沃茨谈恋爱的故事', { lang: 'zh', days: 3 })
    expect(calls[0]!.text).toContain('existing copyrighted work (Harry Potter)')
    expect(calls[0]!.text).toContain('ORIGINAL')
    expect(calls[2]!.text).toContain('the name "霍格沃茨" belongs to an existing work')
    expect(r.errors).toEqual([])
    expect(r.homage).toContain('原创')
    expect(r.json).not.toContain('霍格沃茨')
  })

  test('模型判断无法改写时礼貌拒绝：只调用一次，不给包', async () => {
    const { $, calls } = engine(outline({ refuse: '这个想法只是照搬原作的人物和剧情，换成你自己的故事吧。' }), [])
    const r = await generatePack($, '把《海贼王》第一季完整改成视觉小说，人物不变', { lang: 'zh' })
    expect(r.pack).toBe(null)
    expect(r.refused).toContain('换成你自己的故事')
    expect(calls).toHaveLength(1)
    expect(protectedHits('One Piece and Luffy').map(h => h.work)).toEqual(['One Piece'])
  })

  test('露骨内容的请求：不调用模型，直接拒绝', async () => {
    const { $, calls } = engine(outline(), [])
    const r = await generatePack($, '写一个 R18 的成人向故事', { lang: 'zh' })
    expect(r.pack).toBe(null)
    expect(r.refused).toBeTruthy()
    expect(calls).toHaveLength(0)
  })

  test('未成年角色：恋爱线必须关掉，否则打回去修', async () => {
    const fixed = good()
    fixed.cast[0]!.romance = false
    fixed.cast[0]!.meter = { label: '信任', full: '●', empty: '○' }
    const { $, calls } = engine(outline({ cast: [{ id: 'her', age: 16 }, { id: 'friend', age: 40 }] }), [JSON.stringify(good()), JSON.stringify(fixed)])
    const r = await generatePack($, '高中天文社', { lang: 'zh', days: 3 })
    expect(calls[0]!.text).toContain('under 18 is NEVER a romance route')
    expect(calls[2]!.text).toContain('cast her: under 18')
    expect(r.errors).toEqual([])
    expect(r.pack?.cast[0]?.romance).toBe(false)
  })

  test('格式说明带像素立绘的规则和示例（14 列、无脸、无背景）', () => {
    const spec = formatSpec()
    expect(spec).toContain('EXACTLY 14 characters')
    expect(spec).toContain('No face')
    expect(spec).toContain('No background')
    expect(spec.length).toBeGreaterThan(4000) // 够长才会进缓存
  })
})

// ---------- 从代码仓库生成 ----------

const ROOT = 'C:/Users/alice/projects/demo'
const f = (name: string, size = 100): FsEntry => ({ name, kind: 'file', size, mtimeMs: 0, isLink: false })
const dir = (name: string): FsEntry => ({ name, kind: 'dir', size: 0, mtimeMs: 0, isLink: false })
const TREE: Record<string, FsEntry[]> = {
  [ROOT]: [dir('.git'), f('.env'), dir('.ssh'), dir('node_modules'), f('README.md'), f('package.json'), dir('src'), f('secrets.json'), f('id_rsa'), f('TODO.md'), dir('config'), dir('packages'), f('huge-readme.txt', 9_000_000)],
  [`${ROOT}/src`]: [f('index.ts'), f('legacy-parser.ts'), dir('auth')],
  [`${ROOT}/src/auth`]: [f('token-store.ts'), f('login.ts')],
  [`${ROOT}/config`]: [f('prod.key'), f('settings.yaml')],
  [`${ROOT}/packages`]: [dir('core')],
  [`${ROOT}/packages/core`]: [f('package.json'), f('engine.ts')],
}
const FILES: Record<string, string> = {
  [`${ROOT}/README.md`]: '# Demo\nA tiny sync tool. Contact alice@example.com or see https://example.com/demo\nAPI_KEY=sk-abcdefghijklmnop1234\nRuns from C:\\Users\\alice\\projects\\demo\nTODO: fix the flaky sync\nghp_ABCDEFGHIJKLMNOPQRSTUV0123456789 is in the docs\n',
  [`${ROOT}/package.json`]: JSON.stringify({ name: 'demo-app', author: 'Alice Smith <alice@example.com>', dependencies: { left: '1.0.0' } }),
  [`${ROOT}/packages/core/package.json`]: JSON.stringify({ name: '@demo/core' }),
}

function repo(): { listed: string[]; read: string[]; fs: Fs } {
  const w = { listed: [] as string[], read: [] as string[] }
  const fs: Fs = {
    list: async (path = '') => { w.listed.push(path); return TREE[path] ?? [] },
    read: async path => { w.read.push(path); return FILES[path] ?? 'const SECRET = "source code that must never be read"' },
  }
  return { ...w, fs }
}

describe('从代码仓库生成', () => {
  test('只列目录、读 README 和清单的 name：不进 .git / node_modules，不读源码和敏感文件', async () => {
    const w = repo()
    const { $ } = engine(outline(), [], w.fs)
    const d = await scanRepo($, ROOT)
    expect(w.read.sort()).toEqual([`${ROOT}/README.md`, `${ROOT}/package.json`, `${ROOT}/packages/core/package.json`].sort())
    expect(w.listed.some(p => /\.git|\.ssh|node_modules/.test(p))).toBe(false)
    const tree = d.tree.join('\n')
    for (const hidden of ['.env', 'id_rsa', 'secrets.json', 'prod.key', 'token-store.ts', '.git']) expect(tree).not.toContain(hidden)
    expect(tree).toContain('src/legacy-parser.ts')
    expect(d.modules).toEqual(['demo-app', '@demo/core'])
    expect(d.name).toBe('demo-app')
    expect(d.trouble).toContain('src/legacy-parser.ts')
    expect(d.trouble.some(t => t.includes('fix the flaky sync'))).toBe(true)
    expect(d.readme).not.toContain('alice')
    expect(d.readme).not.toContain('sk-abc')
    expect(d.readme).not.toContain('ghp_')
    expect(d.readme).not.toContain('https://')
    expect(d.bytes).toBeLessThan(64 * 1024)
  })

  test('提示里没有路径、邮箱、密钥和个人信息；结果里泄露了路径就打回去修', async () => {
    const w = repo()
    const leaky = good()
    leaky.premise = `我在 ${ROOT} 里醒来。`
    const { $, calls } = engine(outline(), [JSON.stringify(leaky), JSON.stringify(good())], w.fs)
    const r = await packFromRepo($, ROOT, '想要温馨一点', { lang: 'zh', days: 3 })
    const sent = calls.map(c => c.text).join('\n')
    for (const bad of ['alice', 'Alice', 'sk-abcdef', 'ghp_ABC', 'example.com', 'C:/Users', 'C:\\Users', 'SECRET', 'id_rsa', '.env', 'token-store', 'prod.key']) expect(sent).not.toContain(bad)
    expect(sent).toContain('demo-app')
    expect(sent).toContain('想要温馨一点')
    expect(calls[2]!.step).toBe('repair')
    expect(calls[2]!.text).toContain('privacy: remove the private path')
    expect(r.errors).toEqual([])
    expect(r.json).not.toContain('alice')
  })

  test('一直泄露：不给包，交回的 JSON 也抹掉了路径', async () => {
    const w = repo()
    const leaky = good()
    leaky.premise = `我在 ${ROOT} 里醒来。`
    const { $ } = engine(outline(), [JSON.stringify(leaky), JSON.stringify(leaky), JSON.stringify(leaky)], w.fs)
    const r = await packFromRepo($, ROOT, undefined, { lang: 'zh', days: 3 })
    expect(r.pack).toBe(null)
    expect(r.errors.some(e => e.startsWith('privacy'))).toBe(true)
    expect(r.json).not.toContain(ROOT)
    expect(r.json).not.toContain('alice')
  })

  test('清理函数', () => {
    const found: string[] = []
    const s = redact('mail bob@x.org at /home/bob/app, key ' + 'AK' + 'IA' + 'ABCDEFGHIJKLMNOP' + '\npassword: hunter2\nok line', found)
    expect(s).not.toContain('bob@')
    expect(s).not.toContain('/home/bob')
    expect(s).not.toContain('AKIA')
    expect(s).not.toContain('hunter2')
    expect(s).toContain('ok line')
    expect(found.length).toBeGreaterThan(2)
  })
})
