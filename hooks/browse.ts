// 社区剧本：读一个 JSON 索引，按条目下载剧本包并校验。只接受许可在白名单里的条目：原创、CC0、CC BY、CC BY-SA。
// 只走 $.http.fetch，不读写 $.state；界面接入见 hooks/INTEGRATION.md，投稿规则见 community/README.md。

import type { EngineInterface } from 'claude-code'

import type { L, Lang, Pack } from '../types'
import { tr, validatePack } from './pack'

export const DEFAULT_INDEX_URL = 'https://raw.githubusercontent.com/Ephemeral6/ai-galgame/main/community/index.json'
/** 索引和单个剧本包的大小上限（字符） */
export const MAX_INDEX_CHARS = 512 * 1024
export const MAX_PACK_CHARS = 1024 * 1024
const MAX_ENTRIES = 500

export type CommunityEntry = {
  id: string
  title: L
  author: string
  /** 剧本包本身的发布许可：original | CC0-1.0 | CC-BY-4.0 | CC-BY-SA-4.0（也接受 "CC BY 4.0" 这类写法） */
  license: string
  /** 包提供的语言 */
  lang: Lang[]
  summary: L
  /** 剧本包 JSON 的地址（https） */
  url: string
  version?: string
  /** 作者主页或讨论帖（可选，只显示，不自动打开） */
  homepage?: string
}
export type Rejected = { id: string; reason: string }
export type IndexResult = { entries: CommunityEntry[]; rejected: Rejected[]; error?: string }
export type FetchPackResult = { pack: Pack | null; errors: string[] }

export type LicenseId = 'original' | 'CC0' | 'CC-BY' | 'CC-BY-SA'

/** 把许可写法归一；不在白名单里（含 NC、ND、MIT、未写）返回 null */
export function normalizeLicense(raw: unknown): LicenseId | null {
  if (typeof raw !== 'string') return null
  const s = raw.trim().toLowerCase().replace(/^creative\s*commons\s*/, 'cc ').replace(/attribution[- ]share[- ]?alike/, 'by-sa').replace(/attribution/, 'by')
  const k = s.replace(/[\s_\-./]+/g, '').replace(/international|unported|generic|license|licence/g, '')
  if (k === 'original' || k === '原创') return 'original'
  if (/^cc0(10)?$/.test(k) || k === 'publicdomaincc0') return 'CC0'
  if (/^ccby([1-4]0?)?$/.test(k)) return 'CC-BY'
  if (/^ccbysa([1-4]0?)?$/.test(k)) return 'CC-BY-SA'
  return null
}

export function licenseOk(raw: unknown): boolean {
  return normalizeLicense(raw) !== null
}

const ID = /^[a-z][a-z0-9_-]{0,31}$/
const isL = (x: unknown) => (typeof x === 'string' && x.length > 0) || (!!x && typeof x === 'object' && !Array.isArray(x) && Object.values(x).every(v => typeof v === 'string') && Object.keys(x).length > 0)

function httpsUrl(u: unknown): u is string {
  // https、有主机名、不带账号密码、没有空白
  return typeof u === 'string' && u.length <= 500 && /^https:\/\/[A-Za-z0-9.-]+(:\d{1,5})?(\/[^\s]*)?$/.test(u)
}

/** 校验并整理一条索引；不合格返回原因 */
export function checkEntry(raw: unknown): { entry: CommunityEntry } | { reason: string } {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { reason: 'not an object' }
  const o = raw as Record<string, unknown>
  if (typeof o.id !== 'string' || !ID.test(o.id)) return { reason: 'id: lowercase id' }
  if (!isL(o.title)) return { reason: 'title: text' }
  if (typeof o.author !== 'string' || !o.author.trim()) return { reason: 'author: string' }
  if (!licenseOk(o.license)) return { reason: `license not accepted: ${String(o.license ?? '(missing)')} (allowed: original, CC0, CC BY, CC BY-SA)` }
  const langs = (Array.isArray(o.lang) ? o.lang : [o.lang]).filter((l): l is Lang => l === 'zh' || l === 'en')
  if (!langs.length) return { reason: 'lang: zh | en | [zh, en]' }
  if (!isL(o.summary)) return { reason: 'summary: text' }
  if (!httpsUrl(o.url)) return { reason: 'url: https URL of the pack JSON' }
  const entry: CommunityEntry = { id: o.id, title: o.title as L, author: o.author.trim().slice(0, 80), license: String(o.license), lang: langs, summary: o.summary as L, url: o.url }
  if (typeof o.version === 'string') entry.version = o.version.slice(0, 20)
  if (httpsUrl(o.homepage)) entry.homepage = o.homepage
  return { entry }
}

async function get($: EngineInterface, url: string, cap: number): Promise<{ text: string } | { error: string }> {
  try {
    const r = await $.http.fetch(url, { headers: { accept: 'application/json' } })
    if (!r.ok) return { error: `HTTP ${r.status}` }
    if (r.text.length > cap) return { error: `too large (${r.text.length} > ${cap} characters)` }
    return { text: r.text }
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) }
  }
}

/** 读取社区索引：{ "version": 1, "packs": [条目...] }（也接受直接是数组）。不合格、许可不在白名单的条目放进 rejected */
export async function fetchIndex($: EngineInterface, url: string = DEFAULT_INDEX_URL): Promise<IndexResult> {
  if (!httpsUrl(url)) return { entries: [], rejected: [], error: 'index URL must be https' }
  const r = await get($, url, MAX_INDEX_CHARS)
  if ('error' in r) return { entries: [], rejected: [], error: r.error }
  let raw: unknown
  try {
    raw = JSON.parse(r.text)
  } catch {
    return { entries: [], rejected: [], error: 'index is not valid JSON' }
  }
  const list = Array.isArray(raw) ? raw : raw && typeof raw === 'object' && Array.isArray((raw as { packs?: unknown }).packs) ? (raw as { packs: unknown[] }).packs : null
  if (!list) return { entries: [], rejected: [], error: 'index: expected { "packs": [...] }' }
  const entries: CommunityEntry[] = []
  const rejected: Rejected[] = []
  const seen = new Set<string>()
  for (const item of list.slice(0, MAX_ENTRIES)) {
    const c = checkEntry(item)
    const id = item && typeof item === 'object' && typeof (item as { id?: unknown }).id === 'string' ? (item as { id: string }).id : '?'
    if ('reason' in c) rejected.push({ id, reason: c.reason })
    else if (seen.has(c.entry.id)) rejected.push({ id, reason: 'duplicate id' })
    else { seen.add(c.entry.id); entries.push(c.entry) }
  }
  return { entries, rejected }
}

/**
 * 下载一个社区剧本包并校验：条目许可必须在白名单；包 id 与条目一致；改编包的原作许可也必须在白名单；validatePack 通过。
 * 返回的包是纯数据，可以直接放进 packs 列表（origin 记为 'imported' 或另设 'community'）。
 */
export async function fetchPack($: EngineInterface, entry: CommunityEntry): Promise<FetchPackResult> {
  const c = checkEntry(entry)
  if ('reason' in c) return { pack: null, errors: [c.reason] }
  const r = await get($, entry.url, MAX_PACK_CHARS)
  if ('error' in r) return { pack: null, errors: [`download: ${r.error}`] }
  let raw: unknown
  try {
    raw = JSON.parse(r.text)
  } catch {
    return { pack: null, errors: ['pack is not valid JSON'] }
  }
  const errors = validatePack(raw)
  if (errors.length) return { pack: null, errors }
  const pack = raw as Pack
  const more: string[] = []
  if (pack.id !== entry.id) more.push(`id: pack says "${pack.id}", index says "${entry.id}"`)
  if (pack.source !== 'original') {
    const srcLicense = tr(pack.source.license, 'en', pack.defaultLang)
    if (!licenseOk(srcLicense)) more.push(`source.license not accepted: ${srcLicense} (the adapted work must be CC0, CC BY or CC BY-SA)`)
    if (normalizeLicense(entry.license) === 'original') more.push('license: an adaptation cannot be listed as "original"')
    if (normalizeLicense(tr(pack.source.license, 'en', pack.defaultLang)) === 'CC-BY-SA' && normalizeLicense(entry.license) !== 'CC-BY-SA') {
      more.push('license: an adaptation of a CC BY-SA work must itself be CC BY-SA')
    }
  }
  if (more.length) return { pack: null, errors: more }
  return { pack, errors: [] }
}
