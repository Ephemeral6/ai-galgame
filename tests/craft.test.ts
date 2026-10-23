// 写作手法层：craft 字段校验、片段选取、预写关键场景、路线锁定、揭示、旧包兼容、内容禁忌。

import { describe, expect, test } from 'claude-code/testing'

import type { Pack, Scene, Story } from '../types'
import type { CraftFields, PackCraft } from '../hooks/craft-types'
import {
  CRAFT_CORE, DIRECTOR, craftOf, craftStatic, decideRoute, dejaVuFor, diaryBrief, endingCraft, gossipFor, pickCraft, routeOf, setPieceBrief,
  setPieceChoices, setPieceDue, setPieceIntact, spliceSetPiece, validateCraft,
} from '../hooks/craft'
import { freshStory } from '../hooks/engine'
import { beatOf, packText, validatePack } from '../hooks/pack'
import { BUILTIN } from '../packs/index'
import { BAND } from '../packs/band/pack'
import { CICADA } from '../packs/cicada/pack'
import { LOOP } from '../packs/loop/pack'
import { TEMPLATE } from '../packs/_template/pack'

const at = (s: Story, day: number, slot: number, extra: Partial<Story> = {}): Story => ({ ...s, day, slot, ...extra })
const withStage = (s: Story, id: string, stage: number, affection = stage * 3): Story => ({ ...s, heroines: { ...s.heroines, [id]: { ...s.heroines[id]!, stage, affection } } })
const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T

describe('craft 字段校验', () => {
  test('所有内置包的 craft 都合法，validatePack 仍然通过', () => {
    for (const p of BUILTIN) {
      expect([p.id, validateCraft(p)]).toEqual([p.id, []])
      expect([p.id, validatePack(p)]).toEqual([p.id, []])
    }
  })

  test('旗舰包：每个主角色至少 2 个预写关键场景、3 个母题，有口癖、矛盾、日记口吻', () => {
    for (const p of [CICADA, BAND]) {
      const cr = craftOf(p)!
      for (const c of p.cast) {
        expect([p.id, c.id, (cr.setPieces ?? []).filter(x => x.who === c.id).length >= 2]).toEqual([p.id, c.id, true])
        expect([p.id, c.id, (cr.motifs ?? []).filter(m => m.who === c.id).length + (cr.motifs ?? []).filter(m => !m.who).length >= 3]).toEqual([p.id, c.id, true])
        const pc = cr.people?.[c.id]
        expect([c.id, !!pc?.quirks?.length && !!pc?.habits?.length && !!pc?.contradiction && pc?.diaryVoice?.seesMe.length === 5]).toEqual([c.id, true])
      }
      expect(!!cr.routes && (cr.reveals?.length ?? 0) >= 1 && (cr.texture?.days?.length ?? 0) === p.days && (cr.gags?.length ?? 0) >= 3).toBe(true)
    }
  })

  test('没有 craft 的包返回 []；坏引用会报出来', () => {
    expect(validateCraft(TEMPLATE)).toEqual([])
    const bad = clone(CICADA) as Pack & CraftFields
    const cr = bad.craft as PackCraft
    cr.setPieces![0]!.who = 'nobody'
    cr.setPieces![1]!.trigger.beat = 'no-such-beat'
    cr.motifs![0]!.meanings = [{ stage: 9, text: 'x' }]
    cr.routes!.branches[0]!.who = 'ghost'
    const errs = validateCraft(bad)
    expect(errs.some(e => e.includes('setPieces[0].who'))).toBe(true)
    expect(errs.some(e => e.includes('trigger.beat'))).toBe(true)
    expect(errs.some(e => e.includes('motifs[0].meanings'))).toBe(true)
    expect(errs.some(e => e.includes('routes.branches'))).toBe(true)
  })

  test('国内背景包的 craft 不出现日本元素', () => {
    const banned = /樱花|神社|祭典|浴衣|便当|前辈|后辈|学姐大人|社团部室|senpai|kohai|matsuri|yukata|bento|shrine|cherry blossom/i
    for (const p of [CICADA, BAND, LOOP, ...BUILTIN.filter(x => x.id === 'snow' || x.id === 'radio')]) {
      expect([p.id, banned.test(JSON.stringify(craftOf(p)))]).toEqual([p.id, false])
    }
  })
})

describe('片段选取', () => {
  test('固定块：通用写法 + 导演片段 + 人物细节 + 母题清单；旧包只有通用部分', () => {
    const st = craftStatic(CICADA, 'zh')
    expect(st).toContain(CRAFT_CORE)
    expect(st).toContain(DIRECTOR)
    expect(st).toContain('[Character texture]')
    expect(st).toContain('screwdriver')
    expect(craftStatic(TEMPLATE, 'zh')).toBe(`${CRAFT_CORE}\n\n${DIRECTOR}`)
    // 控制体积：固定块不超过 9000 字符（约 3k token 以内）
    for (const p of BUILTIN) expect([p.id, craftStatic(p, p.defaultLang).length < 9000]).toEqual([p.id, true])
  })

  test('动态块短小：场景类型 + 阶段 + 素材，不超过 1200 字符', () => {
    const s = withStage(at(freshStory(CICADA, 'zh'), 4, 1), 'xiaoman', 1)
    const pick = pickCraft(CICADA, s, 'zh', { place: 'astro', present: ['xiaoman'] })
    expect(pick.text.length < 1200).toBe(true)
    expect(pick.text).toContain('Relationship stage 1')
    expect(pick.setPiece).toBe(null)
  })

  test('旧包（没有 craft）也能挑片段', () => {
    const s = freshStory(TEMPLATE, 'zh')
    const pick = pickCraft(TEMPLATE, s, 'zh', { present: [TEMPLATE.cast[0]!.id] })
    expect(pick.text).toContain('Scene type')
    expect(pick.flags).toEqual([])
  })

  test('关键事件的类型决定场景类型；非恋爱角色加上提醒', () => {
    const s = at(freshStory(CICADA, 'zh'), 8, 0)
    const pick = pickCraft(CICADA, s, 'zh', { place: 'classroom', present: ['xiaoman', 'yinuo'], beat: beatOf(CICADA, 'rumor') })
    expect(pick.kind).toBe('conflict')
    const mauve = BUILTIN.find(p => p.id === 'mauve')!
    const m = pickCraft(mauve, freshStory(mauve, 'en'), 'en', { place: 'granny', present: ['granny'] })
    expect(m.text).toContain('not romantic')
  })
})

describe('预写关键场景', () => {
  test('关键事件到期时由预写场景接管，写完后不再触发', () => {
    const s = at(freshStory(CICADA, 'zh'), 9, 2)
    const input = { place: 'river', present: ['qingyi'], beat: beatOf(CICADA, 'river') }
    const piece = setPieceDue(CICADA, s, input)
    expect(piece?.id).toBe('qy-river')
    const pick = pickCraft(CICADA, s, 'zh', input)
    expect(pick.flags).toContain('set:qy-river')
    expect(setPieceDue(CICADA, { ...s, flags: [...s.flags, ...pick.flags] }, input)).toBe(null)
  })

  test('阶段触发：小满到「秘密」、单独在器材室', () => {
    const s = withStage(at(freshStory(CICADA, 'zh'), 8, 1), 'xiaoman', 3)
    expect(setPieceDue(CICADA, s, { place: 'astro', present: ['xiaoman'] })?.id).toBe('xm-screwdriver')
    expect(setPieceDue(CICADA, s, { place: 'astro', present: ['xiaoman', 'qingyi'] })).toBe(null)
    expect(setPieceDue(CICADA, withStage(s, 'xiaoman', 2), { place: 'astro', present: ['xiaoman'] })).toBe(null)
  })

  test('写作指令列出核心台词；完整性检查与兜底拼接', () => {
    const piece = craftOf(CICADA)!.setPieces!.find(x => x.id === 'zy-knee')!
    const brief = setPieceBrief(CICADA, piece, 'zh')
    expect(brief).toContain('VERBATIM')
    expect(brief).toContain('这里没有水。')
    const T = packText(CICADA, 'zh')
    const full: Scene = {
      title: 't', place: 'p', cast: [{ id: 'zhiyao', expression: 'sad' }], distance: 'near',
      narration: `${T(piece.lines[0]!.text)} 风很小。`, lines: piece.lines.filter(l => l.who !== 'narration').map(l => ({ who: l.who, text: T(l.text) })),
      choices: [], summary: 's',
    }
    expect(setPieceIntact(CICADA, full, piece, 'zh')).toBe(true)
    const broken: Scene = { ...full, lines: [{ who: 'zhiyao', text: '我没事啦！' }, { who: 'me', text: '真的？' }] }
    expect(setPieceIntact(CICADA, broken, piece, 'zh')).toBe(false)
    const fixed = spliceSetPiece(CICADA, broken, piece, 'zh')
    expect(setPieceIntact(CICADA, fixed, piece, 'zh')).toBe(true)
    expect(fixed.lines.length <= 9).toBe(true)
    expect(setPieceChoices(CICADA, piece, 'zh')).toBe(null)
  })
})

describe('路线与揭示', () => {
  test('共通线结束后锁定好感最高且领先的人；不够就走群像线', () => {
    let s = at(freshStory(CICADA, 'zh'), 6, 2)
    expect(decideRoute(CICADA, s)).toBe(null) // 还在共通线
    s = withStage(withStage(at(s, 7, 0), 'zhiyao', 2, 8), 'qingyi', 2, 5)
    expect(decideRoute(CICADA, s)).toBe('route:zhiyao')
    expect(decideRoute(CICADA, withStage(s, 'qingyi', 2, 7))).toBe('route:ensemble') // 领先不足 2
    expect(routeOf({ ...s, flags: ['route:zhiyao'] })).toBe('zhiyao')
    expect(decideRoute(CICADA, { ...s, flags: ['route:zhiyao'] })).toBe(null)
    const pick = pickCraft(CICADA, { ...s, flags: ['route:zhiyao'] }, 'zh', { place: 'track', present: ['zhiyao'] })
    expect(pick.text).toContain('[Personal route: zhiyao]')
  })

  test('揭示在条件满足、相关的人在场时触发，并记下标记', () => {
    // wl-stairs 也在行政楼、阶段 3 触发，预写场景那一幕不出揭示，所以先当它演过了
    const s = withStage(at(freshStory(CICADA, 'zh'), 11, 1, { flags: ['beat:roofkey', 'set:wl-folders', 'set:wl-stairs'] }), 'wenli', 3)
    const pick = pickCraft(CICADA, s, 'zh', { place: 'council', present: ['wenli', 'yinuo'] })
    expect(pick.reveal?.id).toBe('rv-roofkey')
    expect(pick.flags).toContain('reveal:rv-roofkey')
    expect(pickCraft(CICADA, { ...s, flags: [...s.flags, 'reveal:rv-roofkey'] }, 'zh', { place: 'council', present: ['wenli', 'yinuo'] }).reveal?.id).not.toBe('rv-roofkey')
  })
})

describe('给主开发线新功能的素材', () => {
  test('日记口吻随阶段变化；既视感只在二周目或循环第二轮起', () => {
    const s = freshStory(CICADA, 'zh')
    expect(diaryBrief(CICADA, s, 'xiaoman', 'zh')).toContain('凑数的转学生')
    expect(diaryBrief(CICADA, withStage(s, 'xiaoman', 4), 'xiaoman', 'zh')).toContain('想让他在天台上')
    expect(dejaVuFor(CICADA, s, 'xiaoman', 'zh')).toBe('')
    expect(dejaVuFor(CICADA, { ...s, loop: 2 }, 'xiaoman', 'zh')).toContain('Déjà vu')
    expect(dejaVuFor(LOOP, { ...freshStory(LOOP, 'zh'), cycle: 2 }, 'wanlan', 'zh')).toContain('Déjà vu')
  })

  test('结局回收：她的母题与已揭示的真相', () => {
    const s = { ...freshStory(CICADA, 'zh'), flags: ['reveal:rv-roofkey'] }
    const t = endingCraft(CICADA, s, 'xiaoman', 'zh')
    expect(t).toContain('社员表上的第三行')
    expect(t).toContain('没收天台钥匙')
    expect(endingCraft(TEMPLATE, freshStory(TEMPLATE, 'zh'), undefined, 'zh')).toBe('')
  })

  test('八卦按天数与前置条件过滤', () => {
    const early = gossipFor(BAND, freshStory(BAND, 'zh'), 'zh', 10)
    expect(early.some(g => g.includes('Wen Chuan') || g.includes('闻川'))).toBe(false)
    const later = gossipFor(BAND, at(freshStory(BAND, 'zh'), 7, 0, { flags: ['beat:b-leak', 'beat:b-audition'] }), 'zh', 10)
    expect(later.length > early.length).toBe(true)
  })
})
