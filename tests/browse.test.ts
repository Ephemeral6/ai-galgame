// 社区剧本：索引读取与逐条校验、许可白名单（原创、CC0、CC BY、CC BY-SA）、下载后 validatePack、改编包的原作许可。
// 网络全部 mock。

import { describe, expect, test } from 'claude-code/testing'
import type { EngineInterface, HttpResponse } from 'claude-code'

import type { Pack } from '../types'
import { DEFAULT_INDEX_URL, fetchIndex, fetchPack, normalizeLicense, type CommunityEntry } from '../hooks/browse'
import { BUILTIN } from '../packs/index'
import { CICADA } from '../packs/cicada/pack'
import { MAUVE } from '../packs/mauve/pack'

const BASE = 'https://raw.githubusercontent.com/Ephemeral6/ai-galgame/main/community/packs'

/** 假的 $：只有 http.fetch，按地址回答；数字表示 HTTP 状态码 */
function net(files: Record<string, string | number>): { $: EngineInterface; urls: string[] } {
  const urls: string[] = []
  const fetch = async (url: string): Promise<HttpResponse> => {
    urls.push(url)
    const f = files[url]
    if (f === undefined) return { status: 404, ok: false, headers: {}, text: 'not found' }
    if (typeof f === 'number') return { status: f, ok: f >= 200 && f < 300, headers: {}, text: '' }
    return { status: 200, ok: true, headers: { 'content-type': 'application/json' }, text: f }
  }
  return { $: { http: { fetch } } as unknown as EngineInterface, urls }
}

const entry = (id: string, license: string, extra: Partial<CommunityEntry> = {}): CommunityEntry => ({
  id, title: id, author: 'someone', license, lang: ['zh'], summary: 's', url: `${BASE}/${id}.json`, ...extra,
})

describe('许可白名单', () => {
  test('接受原创、CC0、CC BY、CC BY-SA 的各种写法；拒绝 NC、ND、其他与未写', () => {
    for (const ok of ['original', '原创', 'CC0', 'CC0 1.0', 'CC0-1.0', 'CC BY 4.0', 'CC-BY-4.0', 'cc by 3.0', 'CC BY-SA 4.0', 'CC-BY-SA-4.0', 'Creative Commons Attribution 4.0 International', 'Creative Commons Attribution-ShareAlike 4.0']) {
      expect([ok, normalizeLicense(ok) !== null]).toEqual([ok, true])
    }
    for (const bad of ['CC BY-NC 4.0', 'CC BY-NC-SA 4.0', 'CC BY-ND 4.0', 'MIT', 'All rights reserved', '', 'proprietary']) {
      expect([bad, normalizeLicense(bad)]).toEqual([bad, null])
    }
    expect(normalizeLicense(undefined)).toBe(null)
    expect(normalizeLicense('CC BY-SA 4.0')).toBe('CC-BY-SA')
  })
})

describe('读取索引', () => {
  test('默认地址；不合格与许可不在白名单的条目放进 rejected', async () => {
    const index = {
      version: 1,
      packs: [
        entry('good', 'CC-BY-4.0'),
        entry('nc', 'CC BY-NC 4.0'),
        entry('mit', 'MIT'),
        { ...entry('nolicense', 'x'), license: undefined },
        entry('plain', 'CC0', { url: 'http://example.com/plain.json' }),
        entry('good', 'CC0'),
        entry('Bad ID', 'CC0'),
        entry('sa', 'CC BY-SA 4.0', { lang: ['zh', 'en'] }),
      ],
    }
    const { $, urls } = net({ [DEFAULT_INDEX_URL]: JSON.stringify(index) })
    const r = await fetchIndex($)
    expect(urls).toEqual([DEFAULT_INDEX_URL])
    expect(r.error).toBeUndefined()
    expect(r.entries.map(e => e.id)).toEqual(['good', 'sa'])
    expect(r.rejected.map(x => x.id)).toEqual(['nc', 'mit', 'nolicense', 'plain', 'good', 'Bad ID'])
    expect(r.rejected[0]!.reason).toContain('license not accepted')
    expect(r.rejected[3]!.reason).toContain('https')
    expect(r.rejected[4]!.reason).toBe('duplicate id')
  })

  test('网络错误、非 JSON、格式不对、非 https 地址都给出错误而不抛', async () => {
    const { $ } = net({ 'https://a.test/i.json': 500, 'https://a.test/x.json': 'not json', 'https://a.test/o.json': '{"items": []}', 'https://a.test/arr.json': JSON.stringify([entry('cicada', 'CC BY 4.0')]) })
    expect((await fetchIndex($, 'https://a.test/i.json')).error).toBe('HTTP 500')
    expect((await fetchIndex($, 'https://a.test/x.json')).error).toContain('not valid JSON')
    expect((await fetchIndex($, 'https://a.test/o.json')).error).toContain('packs')
    expect((await fetchIndex($, 'http://a.test/i.json')).error).toContain('https')
    expect((await fetchIndex($, 'https://a.test/arr.json')).entries.map(e => e.id)).toEqual(['cicada'])
  })
})

describe('下载剧本包', () => {
  test('许可不在白名单：拒绝，且不发请求', async () => {
    const { $, urls } = net({})
    const r = await fetchPack($, entry('cicada', 'CC BY-NC 4.0'))
    expect(r.pack).toBe(null)
    expect(r.errors[0]).toContain('license not accepted')
    expect(urls).toEqual([])
  })

  test('合格：下载、validatePack 通过、id 一致', async () => {
    const { $ } = net({ [`${BASE}/cicada.json`]: JSON.stringify(CICADA) })
    const r = await fetchPack($, entry('cicada', 'CC BY 4.0'))
    expect(r.errors).toEqual([])
    expect(r.pack?.id).toBe('cicada')
  })

  test('校验不过、id 不一致、404：拒绝并说明', async () => {
    const bad = JSON.parse(JSON.stringify(CICADA)) as Record<string, unknown>
    delete bad.endings
    const { $ } = net({ [`${BASE}/bad.json`]: JSON.stringify(bad), [`${BASE}/other.json`]: JSON.stringify(CICADA) })
    const b = await fetchPack($, entry('bad', 'CC0'))
    expect(b.pack).toBe(null)
    expect(b.errors.some(e => e.startsWith('endings'))).toBe(true)
    const o = await fetchPack($, entry('other', 'CC0'))
    expect(o.errors[0]).toContain('id: pack says "cicada"')
    const m = await fetchPack($, entry('missing', 'CC0'))
    expect(m.errors).toEqual(['download: HTTP 404'])
  })

  test('改编包：原作许可也要在白名单；改编 CC BY-SA 的作品必须同样以 CC BY-SA 发布；不能标成原创', async () => {
    const nc = JSON.parse(JSON.stringify(MAUVE)) as Pack
    if (nc.source !== 'original') nc.source.license = 'CC BY-NC 4.0'
    const { $ } = net({ [`${BASE}/mauve.json`]: JSON.stringify(MAUVE), [`${BASE}/nc.json`]: JSON.stringify({ ...nc, id: 'nc' }) })
    expect((await fetchPack($, entry('mauve', 'CC BY-SA 4.0'))).errors).toEqual([])
    expect((await fetchPack($, entry('mauve', 'CC BY 4.0'))).errors[0]).toContain('must itself be CC BY-SA')
    expect((await fetchPack($, entry('mauve', 'original'))).errors[0]).toContain('cannot be listed as "original"')
    expect((await fetchPack($, entry('nc', 'CC BY-SA 4.0'))).errors[0]).toContain('source.license not accepted')
  })

  test('仓库自带的包都能按社区格式发布（与 community/index.json 的许可一致）', async () => {
    const LICENSE: Record<string, string> = { cicada: 'CC-BY-4.0', band: 'CC-BY-4.0', snow: 'CC-BY-4.0', lasttrain: 'CC-BY-4.0', loop: 'CC-BY-4.0', radio: 'CC-BY-4.0', equalia: 'CC0-1.0', mauve: 'CC-BY-SA-4.0' }
    const files: Record<string, string> = {}
    for (const p of BUILTIN) files[`${BASE}/${p.id}.json`] = JSON.stringify(p)
    const { $ } = net(files)
    for (const p of BUILTIN) {
      const r = await fetchPack($, entry(p.id, LICENSE[p.id] ?? 'missing', { lang: p.langs }))
      expect([p.id, r.errors]).toEqual([p.id, []])
    }
  })
})
