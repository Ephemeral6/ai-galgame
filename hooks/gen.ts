// 生成剧本包：一句话想法 → 大纲 → 完整 Pack JSON → 校验 → 交回模型修。
// 另有「从代码仓库生成」：只读目录结构、文件名、README 开头和清单里的名字字段，模块变成拟人角色。
// 纯逻辑加模型调用：不读写 $.state，不碰 atom；界面接入见 hooks/INTEGRATION.md。

import type { EngineInterface, FsEntry, ModelTextBlock } from 'claude-code'

import type { Lang, Pack, SpriteDef, Usage } from '../types'
import { CICADA } from '../packs/cicada/pack'
import { WRITER, zeroUsage } from './engine'
import { validatePack } from './pack'

export type GenStep = 'outline' | 'expand' | 'repair' | 'done'
export type GenOpts = {
  lang: Lang
  /** 天数，默认 7（1..14） */
  days?: number
  /** 主角色人数，默认 3（1..6） */
  castSize?: number
  /** 写进 pack.author，默认 "ai-galgame generator" */
  author?: string
  /** 校验不通过时交回模型修几次，默认 2（0..2） */
  maxRepairs?: number
  /** 进度回调：界面用来更新状态栏 */
  onStep?: (step: GenStep, attempt: number) => void
  /** 取消 */
  signal?: AbortSignal
}
export type GenResult = {
  /** 通过全部校验的包；不通过或被拒绝时为 null */
  pack: Pack | null
  /** 最后一版 JSON 文本（不通过时也给，便于玩家手改后用 /gal import） */
  json: string
  /** 剩下的问题；空表示通过 */
  errors: string[]
  usage: Usage
  /** 拒绝生成的原因（给玩家看） */
  refused?: string
  /** 想法点名了现有作品，已改写成原创致敬时的说明 */
  homage?: string
}

export const GEN_MAX_TOKENS = 24_000
const OUTLINE_TOKENS = 3_000
const TIMEOUT = 9 * 60_000

// ---------- 内容限制 ----------

/** 一眼就能认出的受版权保护作品与其人物、地名（只收不会和普通词混淆的写法）。命中时提示改写成原创致敬，生成结果里不许再出现这些名字。 */
export const PROTECTED: { work: string; names: string[] }[] = [
  { work: 'Harry Potter', names: ['Harry Potter', '哈利·波特', '哈利波特', 'Hogwarts', '霍格沃茨', 'Hermione', '赫敏', 'Dumbledore', '邓布利多', 'Voldemort', '伏地魔'] },
  { work: 'Pokémon', names: ['Pokémon', 'Pokemon', '宝可梦', '精灵宝可梦', 'Pikachu', '皮卡丘'] },
  { work: 'Genshin Impact', names: ['Genshin', '原神', 'Paimon', '派蒙', 'Teyvat', '提瓦特'] },
  { work: 'Honkai', names: ['Honkai', '崩坏3', '崩坏：星穹铁道', '星穹铁道'] },
  { work: 'Arknights', names: ['Arknights', '明日方舟'] },
  { work: 'Naruto', names: ['Naruto', '火影忍者', '鸣人', 'Sasuke', '佐助'] },
  { work: 'One Piece', names: ['One Piece', '海贼王', '航海王', 'Luffy', '路飞'] },
  { work: 'Detective Conan', names: ['Detective Conan', '名侦探柯南', '江户川柯南'] },
  { work: 'Doraemon', names: ['Doraemon', '哆啦A梦', '哆啦 A 梦', '机器猫', 'Nobita', '野比大雄'] },
  { work: 'Demon Slayer', names: ['Demon Slayer', 'Kimetsu', '鬼灭之刃', '炭治郎', 'Tanjiro'] },
  { work: 'Attack on Titan', names: ['Attack on Titan', '进击的巨人', 'Eren Yeager', '艾伦·耶格尔'] },
  { work: 'Evangelion', names: ['Evangelion', '新世纪福音战士', 'EVA 初号机', 'Shinji Ikari', '碇真嗣', '绫波丽'] },
  { work: 'Steins;Gate', names: ['Steins;Gate', '命运石之门', '冈部伦太郎', '牧濑红莉栖'] },
  { work: 'Clannad', names: ['Clannad', '古河渚', '冈崎朋也'] },
  { work: 'Doki Doki Literature Club', names: ['Doki Doki Literature Club', '心跳文学部'] },
  { work: 'Fate/stay night', names: ['Fate/stay night', 'Fate/Grand Order', '圣杯战争'] },
  { work: 'Madoka Magica', names: ['Madoka', '魔法少女小圆', '鹿目圆', 'Kyubey'] },
  { work: 'Zelda', names: ['Zelda', '塞尔达', 'Hyrule', '海拉鲁'] },
  { work: 'Super Mario', names: ['Super Mario', '超级马里奥', '马里奥', 'Bowser', '库巴'] },
  { work: 'Star Wars', names: ['Star Wars', '星球大战', '星战', 'Jedi', '绝地武士', 'Darth Vader', '达斯·维达'] },
  { work: 'Marvel', names: ['Marvel Comics', 'Marvel Studios', '漫威', 'Avengers', '复仇者联盟', 'Iron Man', '钢铁侠', 'Spider-Man', '蜘蛛侠'] },
  { work: 'Disney', names: ['Disney', '迪士尼', 'Mickey Mouse', '米老鼠', '冰雪奇缘'] },
  { work: 'The Lord of the Rings', names: ['Lord of the Rings', '指环王', '魔戒', 'Gandalf', '甘道夫', 'Frodo', '佛罗多'] },
  { work: 'SpongeBob', names: ['SpongeBob', '海绵宝宝', '派大星'] },
  { work: 'Legend of Zhen Huan', names: ['甄嬛传', '甄嬛'] },
  { work: 'Minecraft', names: ['Minecraft'] },
]

/** 想法里点名了哪些受保护作品（按 PROTECTED 匹配，不区分大小写） */
export function protectedHits(text: string): { work: string; names: string[] }[] {
  const low = text.toLowerCase()
  return PROTECTED.filter(w => w.names.some(n => low.includes(n.toLowerCase())))
}

/** 显然要求露骨内容的想法：不调用模型，直接拒绝 */
const EXPLICIT = /(色情|黄文|h文|肉文|r-?18|18禁|成人向|nsfw|hentai|porn|explicit sex|smut|lewd|做爱|性爱)/i

export function explicitRequest(text: string): boolean {
  return EXPLICIT.test(text)
}

const RULES = `[Content rules — these override the idea]
1. Everything must be ORIGINAL: invent every character name, place name, organization and title. Never reuse or imitate characters, names, catchphrases, plots or distinctive settings from existing books, games, anime, films or series.
2. If the idea names an existing copyrighted work or its characters, do NOT write fan fiction. Either (a) turn it into an original homage: keep only the genre, mood and broad themes, with entirely new names, and describe the homage in "homage" WITHOUT naming the work; or (b) if nothing original is left once the borrowed parts are removed, refuse politely in "refuse". Works in the public domain (old folk tales, classical myths) may be used freely.
3. No explicit sexual content, no graphic gore. Keep it at the level of a general-audience visual novel.
4. Give every main character an age. Anyone under 18 is NEVER a romance route: set "romance": false and a meter label such as "trust" or "friendship", and never write romance, flirting, crushes or a love-interest framing for them, nor between them and anyone else. Romance routes are adults only.
5. No real people, no real brands, no hateful content.`

// ---------- 格式说明（缓存块） ----------

function spriteExample(sp: SpriteDef): string {
  return JSON.stringify({ pal: sp.pal, art: sp.art, eyes: sp.eyes, cheeks: sp.cheeks, motion: sp.motion })
}

/** 剧本包格式说明：在大纲、展开、修复三步里都放在最前面，打缓存标记 */
export function formatSpec(): string {
  const sprites = CICADA.cast.slice(0, 3).map(c => spriteExample(c.sprite)).join('\n')
  return `You write story packs for ai-galgame, a visual-novel engine. A story pack is pure JSON data: humans (or you) write the skeleton — premise, characters, places, schedule, acts, endings — and the engine's writer model fills in each scene at play time. The player is "I" (first person) and spends a number of days visiting places in time slots, meeting characters, keeping or breaking promises, collecting keepsakes, and reaching one of several endings.

[Pack JSON format]
Text fields ("text" below) are plain strings written in the pack's language.
Ids match ^[a-z][a-z0-9_-]{0,31}$ and are unique within their list (cast and npc ids are unique together; "me" is reserved).
{
  "id": id, "version": "0.1.0", "defaultLang": "zh"|"en", "langs": ["zh"|"en"], "author": string, "source": "original",
  "notes": text (optional author's note; for an homage, the genre it pays tribute to, never naming a work),
  "title": text, "subtitle": text,
  "premise": text — who "I" am, where and when; the situation and the ticking clock,
  "style": text — prose style rules and taboos for the scene writer (concrete details, distinct voices; list things to avoid),
  "me": text — how "I" appears in dialogue ("我" / "Me"),
  "days": integer 1..60, "slots": 1..4 texts (time slots of a day, e.g. "Morning","Evening"), "dayLabel": text with {n} ("第 {n} 天" / "Day {n}"),
  "places": [{ "id", "name": text, "mood": text (sensory one-liner), "slots": [slot indexes when open] }] — every slot must have at least one open place,
  "cast": 1..6 [{ "id", "name": text, "short": text (short name), "color": "#rrggbb",
      "tagline": text (one-line summary), "look": text (the pixel animal: species, colors, one accessory),
      "voice": text (how they talk), "samples": [3-4 sample lines], "secret": text (revealed only at stage 3+),
      "arc": exactly 5 texts, one per stage, "haunts": { "<slot index>": [place ids] },
      "deadline": { "day": 1..days, "text": text }, "keepsakeIdeas": text,
      "romance": boolean (false for anyone under 18 and for non-romance roles), "meter": { "label": text, "full": one character, "empty": one character } (required when romance is false),
      "sprite": SPRITE }],
  "npcs": 0..8 [{ "id", "name": text, "color": "#rrggbb", "role": text, "voice": text, "samples": [1-3 lines], "haunts"?: { "<slot>": [place ids] } }],
  "relations": [{ "a": id|"me", "b": id|"me", "kind": text, "text": text, "hiddenUntil"?: stage 0..4 }],
  "acts": [{ "id", "title": text, "from": day (first act from 1, ascending), "goal": text, "hook"?: text,
      "beats": [{ "id", "day": 1..days, "by"?: day..days, "who"?: [cast/npc ids], "kind"?: text, "text": text, "promise"?: text }] }],
  "incidents": [{ "id", "text": text, "chance"?: 0..1, "days"?: [from, to], "slots"?: [slot indexes], "places"?: [place ids], "who"?: [ids] }],
  "stages": exactly 5 texts (relationship stages, e.g. Strangers, Friends, Worries, Secret, Choice),
  "gates": exactly 5 { "affection": number, "scenes": number } (index 0 is {0,0}; e.g. 0/0, 3/1, 6/3, 9/5, 12/7 — shrink for short packs),
  "events": [{ "day", "text" }] (calendar notes, may be empty),
  "fixed": [{ "day", "slot", "place": text, "mood": text, "title": text, "cast": [ids] }] (forced scenes, may be empty),
  "proactiveAfter": number (days of neglect before someone seeks me out; 0 = off),
  "endings": [{ "id", "title": text, "tier": number (higher wins), "who"?: cast id, "kind"?: "true"|"good"|"normal"|"bad",
      "minStage"?: 0..4, "minAffection"?: number, "maxBroken"?: number, "minKept"?: number, "keptKey"?: id of a beat that has a promise,
      "brief": text (how the ending goes) }] — MUST include one fallback ending with no who / minStage / minAffection / maxAffection / flags / keptKey,
  "finale": text (what the last sentence of an ending should echo),
  "loading": 3+ short atmospheric texts shown while a scene is being written
}

[SPRITE — pixel-animal portrait]
{ "pal": { "<one letter>": "#rrggbb" }, "art": 4..12 rows of EXACTLY 14 characters, "eyes": [[row, col], [row, col]], "cheeks": [[row, col], ...], "motion": "tail"|"wings"|"ears"|"bob" }
'.' is transparent; every other character must be a key of pal. Draw a small cute animal seen from the front: ears/horns on top, a round body, little feet at the bottom. No face: leave the eye and cheek cells as plain body color — the engine draws eyes and blush there. No background, no frame, no text. 3-6 palette letters: a main color, a darker shade for the bottom/feet, a light belly color, and one accent (bow, scarf, glasses, beak). Each character a different animal and color. Counting matters: every row must be exactly 14 characters. Examples from an existing pack (style reference only — do not copy):
${sprites}`
}

// ---------- 模型调用 ----------

type Ask = { text: string | null; reason?: string }

async function ask($: EngineInterface, prompt: ModelTextBlock[], maxTokens: number, u: Usage, signal?: AbortSignal): Promise<Ask> {
  const r = await $.model.complete({ model: WRITER, prompt, maxTokens, timeoutMs: TIMEOUT }, signal ? { signal } : undefined)
  u.writer++
  u.input += r.usage.input_tokens
  u.output += r.usage.output_tokens
  u.cacheRead += r.usage.cache_read_input_tokens
  u.cacheWrite += r.usage.cache_creation_input_tokens
  if (r.isAnswered) return { text: r.text }
  return { text: null, reason: String(r.reason) }
}

/** 从回复里取出 JSON 对象（容忍 ```json 围栏和前后的说明文字） */
export function extractJson(text: string | null): Record<string, unknown> | null {
  if (!text) return null
  const a = text.indexOf('{')
  const b = text.lastIndexOf('}')
  if (a < 0 || b <= a) return null
  try {
    const v = JSON.parse(text.slice(a, b + 1)) as unknown
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null
  } catch {
    return null
  }
}

function langName(lang: Lang): string {
  return lang === 'zh' ? 'Simplified Chinese' : 'English'
}

const clampInt = (x: unknown, lo: number, hi: number, d: number) => {
  const n = Math.round(Number(x))
  return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : d
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^[^a-z]+/, '').slice(0, 32).replace(/-+$/, '')

/** 模型常漏的、不影响内容的字段：直接补上，省一次修复 */
export function normalizeGenerated(raw: Record<string, unknown>, o: { lang: Lang; author: string; id?: string }): Record<string, unknown> {
  const p = { ...raw }
  p.defaultLang = o.lang
  p.langs = [o.lang]
  p.source = 'original'
  p.author = o.author
  if (typeof p.version !== 'string') p.version = '0.1.0'
  if (typeof p.id !== 'string' || !/^[a-z][a-z0-9_-]{0,31}$/.test(p.id)) p.id = slug(String(p.id ?? o.id ?? '')) || o.id || 'generated'
  if (!Array.isArray(p.events)) p.events = []
  if (!Array.isArray(p.fixed)) p.fixed = []
  return p
}

type Extra = (pack: Record<string, unknown>, json: string) => string[]

/** 生成结果的额外检查：受保护名字、未成年角色的恋爱线 */
export function contentIssues(pack: Record<string, unknown>, json: string, ctx: { banned: string[]; minors: string[] }): string[] {
  const err: string[] = []
  const low = json.toLowerCase()
  for (const n of ctx.banned) if (low.includes(n.toLowerCase())) err.push(`content: the name "${n}" belongs to an existing work; replace it with an original name and remove the reference`)
  if (pack.source !== 'original') err.push('source: must be "original"')
  const cast = Array.isArray(pack.cast) ? (pack.cast as Record<string, unknown>[]) : []
  for (const c of cast) {
    if (ctx.minors.includes(String(c.id)) && c.romance !== false) err.push(`cast ${String(c.id)}: under 18, so "romance" must be false with a non-romantic meter label, and no romance or flirting anywhere`)
  }
  return err
}

/** 大纲里未成年（或没写年龄）的角色 id */
export function minorsOf(outline: Record<string, unknown> | null): string[] {
  const cast = outline && Array.isArray(outline.cast) ? (outline.cast as Record<string, unknown>[]) : []
  return cast.filter(c => !(Number(c.age) >= 18)).map(c => String(c.id))
}

function outlinePrompt(seed: string, o: Required<Pick<GenOpts, 'lang' | 'days' | 'castSize'>>, hits: { work: string }[]): string {
  const homage = hits.length
    ? `\nNOTE: the idea mentions an existing copyrighted work (${hits.map(h => h.work).join(', ')}). Apply content rule 2: an original homage with all-new names, or a polite refusal.`
    : ''
  return `${RULES}

[Task — step 1 of 2: outline]
Design an original story pack from this idea:
<idea>
${seed}
</idea>${homage}
Size: ${o.days} days, ${o.castSize} main characters (cast), 0-3 supporting characters (npcs), 2-4 time slots, 4-6 places, 2-3 acts with 1-3 key beats each, endings: one or two per main character plus one fallback ending.
Write all story text in ${langName(o.lang)}.
Reply with JSON only:
{"refuse": "" or a short polite reason in ${langName(o.lang)},
 "homage": "" or one sentence on the genre/mood kept (never name the work),
 "id": "lowercase-id", "title": "", "subtitle": "", "premise": "", "style": "",
 "days": ${o.days}, "slots": ["..."],
 "places": [{"id": "", "name": "", "mood": "", "slots": [0]}],
 "cast": [{"id": "", "name": "", "age": 0, "romance": true, "animal": "", "personality": "", "secret": "", "deadlineDay": 1}],
 "npcs": [{"id": "", "name": "", "role": ""}],
 "acts": [{"title": "", "from": 1, "goal": "", "beats": [{"day": 1, "text": "", "who": []}]}],
 "endings": [{"id": "", "title": "", "kind": "good", "who": "", "brief": ""}]}`
}

function expandPrompt(outline: string, o: { lang: Lang; days: number }, note: string): string {
  return `${RULES}

[Task — step 2 of 2: the complete pack]
Expand this outline into the complete pack JSON, following the format above exactly. Keep its names and decisions. ${o.days} days. All story text in ${langName(o.lang)}; "defaultLang": "${o.lang}", "langs": ["${o.lang}"], "source": "original".
Each main character gets a distinct pixel-animal sprite in the style of the examples. Keep texts vivid but compact (premise and style a short paragraph each, arc lines one sentence each).${note}
<outline>
${outline}
</outline>
Reply with the JSON object only — no commentary, no code fences.`
}

function repairPrompt(json: string, errors: string[]): string {
  return `${RULES}

[Task — fix the pack]
This pack JSON fails validation. Fix every problem listed, change nothing else, and reply with the complete corrected JSON object only.
<problems>
${errors.slice(0, 40).map(e => `- ${e}`).join('\n')}
</problems>
<pack>
${json}
</pack>`
}

/** 共用流程：大纲 → 展开 → 校验 → 修。seed 是给模型的想法文本（已经过清理） */
async function generate($: EngineInterface, seed: string, opts: GenOpts, extra?: Extra, hitsText = seed, scrub: (json: string) => string = j => j): Promise<GenResult> {
  const u = zeroUsage()
  const lang = opts.lang
  const days = clampInt(opts.days, 1, 14, 7)
  const castSize = clampInt(opts.castSize, 1, 6, 3)
  const maxRepairs = clampInt(opts.maxRepairs, 0, 2, 2)
  const author = (opts.author ?? 'ai-galgame generator').slice(0, 60)
  const fail = (errors: string[], json = '', more: Partial<GenResult> = {}): GenResult => ({ pack: null, json, errors, usage: u, ...more })

  if (explicitRequest(hitsText)) {
    return fail(['refused'], '', { refused: lang === 'zh' ? '这个想法要求露骨内容，生成器不写这类剧本。换一个想法试试？' : 'This idea asks for explicit content, which the generator does not write. Try another idea?' })
  }
  const hits = protectedHits(hitsText)
  const banned = hits.flatMap(h => h.names)
  const head: ModelTextBlock = { text: formatSpec(), cache: true }

  opts.onStep?.('outline', 0)
  const o1 = await ask($, [head, { text: outlinePrompt(seed, { lang, days, castSize }, hits) }], OUTLINE_TOKENS, u, opts.signal)
  const outline = extractJson(o1.text)
  if (!outline) return fail([`outline: ${o1.reason ?? 'reply was not JSON'}`])
  if (typeof outline.refuse === 'string' && outline.refuse.trim()) return fail(['refused'], '', { refused: outline.refuse.trim() })
  const homage = typeof outline.homage === 'string' && outline.homage.trim() ? outline.homage.trim() : undefined
  const minors = minorsOf(outline)
  const outlineText = JSON.stringify(outline, null, 1)
  const fixedId = typeof outline.id === 'string' ? slug(outline.id) : undefined

  const check = (raw: Record<string, unknown>): { json: string; errors: string[] } => {
    const json = JSON.stringify(raw, null, 2)
    const errors = [...validatePack(raw), ...contentIssues(raw, json, { banned, minors }), ...(extra?.(raw, json) ?? [])]
    if (raw.days !== days) errors.push(`days: must be ${days}`)
    return { json, errors }
  }

  let last: { raw: Record<string, unknown>; json: string; errors: string[] } | null = null
  let note = ''
  for (let attempt = 0; attempt <= maxRepairs; attempt++) {
    if (opts.signal?.aborted) break
    const repairing = last !== null
    opts.onStep?.(repairing ? 'repair' : 'expand', attempt)
    const text = repairing ? repairPrompt(scrub(last!.json), last!.errors) : expandPrompt(outlineText, { lang, days }, note)
    const r = await ask($, [head, { text }], GEN_MAX_TOKENS, u, opts.signal)
    const parsed = extractJson(r.text)
    if (!parsed) {
      // 多半是太长被截断：下一次重新展开、写短一点
      note = '\nYour previous reply was cut off or was not valid JSON: write shorter texts this time.'
      continue
    }
    const raw = normalizeGenerated(parsed, { lang, author, id: fixedId })
    const c = check(raw)
    last = { raw, ...c }
    if (c.errors.length === 0) break
  }
  opts.onStep?.('done', 0)
  if (!last) return fail(['pack: the model did not return valid JSON'], '', { homage })
  if (last.errors.length) return fail(last.errors, last.json, { homage })
  return { pack: last.raw as unknown as Pack, json: last.json, errors: [], usage: u, homage }
}

/** 一句话生成剧本包：Sonnet 先写大纲再展开，validatePack 不过就交回模型修（默认最多 2 次） */
export async function generatePack($: EngineInterface, idea: string, opts: GenOpts): Promise<GenResult> {
  const clean = idea.trim().slice(0, 1200)
  if (!clean) return { pack: null, json: '', errors: ['idea: empty'], usage: zeroUsage() }
  return generate($, clean, opts)
}

// ---------- 从代码仓库生成 ----------

export type RepoLimits = { depth: number; entries: number; dirs: number; readmeChars: number; totalBytes: number; fileBytes: number; manifests: number }
export const REPO_LIMITS: RepoLimits = { depth: 3, entries: 300, dirs: 60, readmeChars: 600, totalBytes: 64 * 1024, fileBytes: 256 * 1024, manifests: 12 }

/** 不进入的目录：所有以 . 开头的（.git、.env、.ssh……），以及依赖和构建产物 */
const SKIP_DIR = /^(node_modules|dist|build|out|target|vendor|venv|env|__pycache__|coverage|bin|obj|tmp|temp|logs?)$/i
/** 不列出、不读取的敏感文件名 */
export const SENSITIVE = /(^\.|secret|credential|passw|token|private|apikey|api[_-]key|\.pem$|\.key$|\.crt$|\.cer$|\.p12$|\.pfx$|\.jks$|\.keystore$|id_rsa|id_dsa|id_ecdsa|id_ed25519|\.kdbx$|\.sqlite3?$|\.db$|\.dump$|\.bak$|htpasswd|npmrc|pypirc|netrc|\.tfstate|\.log$)/i
const MANIFEST = /^(package\.json|cargo\.toml|pyproject\.toml|go\.mod|composer\.json|setup\.cfg|pom\.xml|build\.gradle(\.kts)?|deno\.json)$/i
const README = /^readme(\.(md|txt|rst|markdown))?$/i
const TROUBLE = /(todo|fixme|bug|hack|legacy|deprecated|workaround|wip|broken|flaky|kludge|hotfix)/i

export type RepoDigest = {
  /** 项目名（清单的 name 字段，或目录名），已清理 */
  name: string
  /** 相对路径的目录树（目录以 / 结尾），已去掉敏感项 */
  tree: string[]
  /** README 开头若干字，已清理（链接、邮箱、路径、疑似密钥、含 key/token/password 的行都去掉） */
  readme: string
  /** 清单里的名字字段：模块名 */
  modules: string[]
  /** 可以当剧情冲突的线索：带 todo/bug/legacy 之类字样的文件名、README 里的 TODO 行 */
  trouble: string[]
  /** 实际读过的文件（相对路径），给测试和界面显示 */
  read: string[]
  /** 读取的总字节数 */
  bytes: number
  /** 被清理掉的原文片段：生成结果里不许出现 */
  secrets: string[]
}

const SECRET_LIKE: RegExp[] = [
  /\b(sk|pk|rk)-[A-Za-z0-9_-]{8,}/g,
  /\b(ghp|gho|ghu|ghs|ghr|github_pat)_[A-Za-z0-9_]{8,}/g,
  /\bxox[abpr]-[A-Za-z0-9-]{8,}/g,
  /\bAKIA[0-9A-Z]{12,}/g,
  /\bAIza[0-9A-Za-z_-]{20,}/g,
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{5,}/g,
  /\b[A-Fa-f0-9]{32,}\b/g,
  /\b[A-Za-z0-9+/_-]{40,}={0,2}/g,
]

/** 清理一段文字：去掉链接、邮箱、绝对路径、IP、疑似密钥；含 key/token/password 等字样的行整行去掉 */
export function redact(text: string, found: string[] = []): string {
  const keep = (re: RegExp, rep: string) => (s: string) => s.replace(re, m => { found.push(m); return rep })
  const lines = text.split(/\r?\n/).filter(l => !/(api[_ -]?key|secret|token|passw|credential|private key|BEGIN [A-Z ]*KEY)/i.test(l))
  let s = lines.join('\n')
  for (const re of SECRET_LIKE) s = keep(re, '[redacted]')(s)
  s = keep(/https?:\/\/\S+/gi, '[link]')(s)
  s = keep(/\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g, '[email]')(s)
  s = keep(/\b[A-Za-z]:[\\/][^\s"'`)\]]+/g, '[path]')(s)
  s = keep(/(^|\s)(\/(home|Users|root|var|etc|opt|mnt)\/[^\s"'`)\]]+)/g, ' [path]')(s)
  s = keep(/~\/[^\s"'`)\]]+/g, '[path]')(s)
  s = keep(/\b\d{1,3}(\.\d{1,3}){3}(:\d+)?\b/g, '[ip]')(s)
  return s
}

const join = (a: string, b: string) => (b ? `${a.replace(/[\\/]+$/, '')}/${b}` : a)
const baseName = (p: string) => p.replace(/[\\/]+$/, '').split(/[\\/]/).pop() ?? ''

function manifestName(file: string, text: string): string | null {
  const f = file.toLowerCase()
  if (f.endsWith('.json')) {
    try {
      const j = JSON.parse(text) as Record<string, unknown>
      return typeof j.name === 'string' ? j.name : null
    } catch {
      return null
    }
  }
  if (f === 'go.mod') return /^module\s+(\S+)/m.exec(text)?.[1]?.split('/').pop() ?? null
  if (f === 'pom.xml') return /<artifactId>([^<]+)<\/artifactId>/.exec(text)?.[1] ?? null
  if (f.startsWith('build.gradle')) return null
  return /^\s*name\s*=\s*["']([^"']+)["']/m.exec(text)?.[1] ?? null
}

/**
 * 读一个代码仓库的轮廓：只列目录、读 README 开头和清单的 name 字段，不读源码内容。
 * 以 . 开头的目录和文件（.git、.env、.ssh……）、依赖与构建目录、敏感文件名一律不进入、不列出、不读取；读取总量有上限。
 */
export async function scanRepo($: EngineInterface, root: string, lim: RepoLimits = REPO_LIMITS): Promise<RepoDigest> {
  const d: RepoDigest = { name: '', tree: [], readme: '', modules: [], trouble: [], read: [], bytes: 0, secrets: [] }
  const queue: { rel: string; depth: number }[] = [{ rel: '', depth: 0 }]
  let dirs = 0
  const readSmall = async (rel: string, size: number): Promise<string | null> => {
    if (size > lim.fileBytes || d.bytes + Math.min(size, lim.fileBytes) > lim.totalBytes) return null
    if (rel.split('/').some(seg => SENSITIVE.test(seg))) return null
    try {
      const t = await $.fs.read(join(root, rel))
      const text = typeof t === 'string' ? t : ''
      d.read.push(rel)
      d.bytes += text.length
      return text
    } catch {
      return null
    }
  }
  while (queue.length && dirs < lim.dirs && d.tree.length < lim.entries) {
    const { rel, depth } = queue.shift()!
    dirs++
    let list: FsEntry[]
    try {
      list = await $.fs.list(join(root, rel))
    } catch {
      continue
    }
    const sorted = [...list].sort((a, b) => a.name.localeCompare(b.name))
    for (const e of sorted) {
      if (d.tree.length >= lim.entries) break
      if (e.isLink || e.kind === 'other') continue
      if (e.name.startsWith('.') || SENSITIVE.test(e.name)) continue
      const path = rel ? `${rel}/${e.name}` : e.name
      if (e.kind === 'dir') {
        if (SKIP_DIR.test(e.name)) continue
        d.tree.push(`${path}/`)
        if (depth + 1 < lim.depth) queue.push({ rel: path, depth: depth + 1 })
        continue
      }
      d.tree.push(path)
      if (TROUBLE.test(e.name)) d.trouble.push(path)
      if (depth === 0 && README.test(e.name) && !d.readme) {
        const t = await readSmall(path, e.size)
        if (t) d.readme = redact(t.slice(0, lim.readmeChars * 3), d.secrets).replace(/\n{3,}/g, '\n\n').slice(0, lim.readmeChars)
      } else if (depth <= 2 && MANIFEST.test(e.name) && d.modules.length < lim.manifests) {
        const t = await readSmall(path, e.size)
        const n = t ? manifestName(e.name, t) : null
        if (n) {
          const clean = redact(n, d.secrets).slice(0, 60)
          if (depth === 0 && !d.name) d.name = clean
          if (!d.modules.includes(clean)) d.modules.push(clean)
        }
      }
    }
  }
  if (!d.name) d.name = redact(baseName(root), d.secrets).slice(0, 60) || 'project'
  for (const l of d.readme.split('\n')) if (/\b(todo|fixme|bug|known issue|wip)\b/i.test(l)) d.trouble.push(`README: ${l.trim().slice(0, 120)}`)
  d.trouble = d.trouble.slice(0, 20)
  return d
}

/** 生成结果里不许出现的字符串：仓库所在的绝对路径（各种写法）、路径里的用户名、清理掉的原文 */
export function leakGuard(root: string, digest: RepoDigest): string[] {
  const norm = root.replace(/\\/g, '/').replace(/\/+$/, '')
  const out = new Set<string>([root, norm, norm.replace(/\//g, '\\')])
  const segs = norm.split('/')
  const ui = segs.findIndex(s => /^(users|home)$/i.test(s))
  if (ui >= 0 && segs[ui + 1] && segs[ui + 1]!.length >= 3) out.add(segs[ui + 1]!)
  for (const s of digest.secrets) if (s.length >= 6) out.add(s)
  return [...out].filter(s => s.length >= 3)
}

export function repoSeed(d: RepoDigest, idea?: string): string {
  return `Turn this software project into an original visual-novel story pack. The modules and folders become personified characters (pixel animals with personalities that fit what each part does); bugs, TODOs and legacy code become the story's conflicts and secrets; the release, a refactor or a deadline is the ticking clock. "I" am a newcomer to the project (a new maintainer or contributor). Keep it playful and warm; no technical jargon dumps.
Do NOT include any file paths, URLs, email addresses, keys, tokens, version numbers or personal names from the project. Character names are invented, at most loosely inspired by module names.
${idea?.trim() ? `The player's extra wish: ${idea.trim().slice(0, 400)}\n` : ''}<project>
Name: ${d.name}
Modules: ${d.modules.join(', ') || '(none listed)'}
Layout (top levels):
${d.tree.slice(0, 120).join('\n')}
Signs of trouble: ${d.trouble.join('; ') || '(none found)'}
README (start):
${d.readme || '(none)'}
</project>`
}

/** 从代码仓库生成剧本包。只读目录结构、文件名、README 开头和清单的名字字段；结果里不许出现路径、链接、密钥或个人信息 */
export async function packFromRepo($: EngineInterface, root: string, idea?: string, opts: GenOpts = { lang: 'zh' }): Promise<GenResult & { digest: RepoDigest }> {
  const digest = await scanRepo($, root)
  const guard = leakGuard(root, digest)
  const extra: Extra = (_raw, json) => {
    const err: string[] = []
    const low = json.toLowerCase()
    for (const g of guard) if (low.includes(g.toLowerCase())) err.push('privacy: remove the private path, user name or secret-like string that leaked from the project')
    if (/https?:\/\//i.test(json)) err.push('privacy: remove every URL')
    if (/\b[\w.+-]+@[\w-]+\.[\w.-]+\b/.test(json)) err.push('privacy: remove every email address')
    return [...new Set(err)]
  }
  // 交回模型修、交给玩家看之前都先抹掉可能泄露的片段
  const escRe = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const scrub = (json: string) => guard.reduce((j, g) => j.replace(new RegExp(escRe(g), 'gi'), '…'), json)
  const r = await generate($, repoSeed(digest, idea), opts, extra, idea ?? '', scrub)
  return { ...r, json: scrub(r.json), digest }
}
