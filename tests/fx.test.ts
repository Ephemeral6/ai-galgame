// 画面效果、演出指令、AI 原生机制、写代码事件、花费、成就与每日挑战：纯函数测试（模型调用用假的 $）。

import { describe, expect, test } from 'claude-code/testing'
import type { EngineInterface } from 'claude-code'

import type { Scene, Story } from '../types'
import { portraitFrame, stageFrame } from '../hooks/art'
import { PX, bgOfTheme, framed } from '../hooks/theme'
import { costOf, dateKey } from '../hooks/cost'
import { advanceTime, applyChoice, applyScene, freshStory, parseDirection, parseScene, planOptions, profileLine, sceneDynamic, staticBlock } from '../hooks/engine'
import { EMPTY_FEATS, achievementsOnFinish, dailyChallenge, dailyShare } from '../hooks/feats'
import { CARD_FRAMES, WALK_H, atmoBand, backdrop, backdropOf, backdropTop, cardFrame, cellWidth, endFx, fontText, fxOf, mapLabelRow, mapSlot, over, relationGraph, stageDirections, themeOf, titleScene, townMap, walkFrame } from '../hooks/fx'
import { awayLetter, diaryEntry, letterFrom, nightGossip, portraitOf, tendencies } from '../hooks/native'
import { BUILTIN } from '../packs/index'
import { CICADA } from '../packs/cicada/pack'
import { endingCard } from '../hooks/share'
import { canSpeak, classifyBash, commitKeepsake, companionLine, workLine } from '../hooks/work'

const P = CICADA
const META = { endingsSeen: [], clears: 0 }
const lit = (px: (number | null)[][]) => px.reduce((a, r) => a + r.filter(v => v !== null).length, 0)
const scene = (extra: Partial<Scene> = {}): Scene => ({
  title: 't', place: 'p', cast: [{ id: 'xiaoman', expression: 'normal' }, { id: 'wenli', expression: 'normal' }], distance: 'far', narration: 'n',
  lines: [{ who: 'xiaoman', text: 'a' }, { who: 'wenli', text: 'b' }, { who: 'me', text: 'c' }], choices: [], summary: 's', ...extra,
})

describe('AI 导演：氛围、镜头、演出指令随写作输出一起来，认不出的丢掉', () => {
  test('解析与校验', () => {
    const d = parseDirection({
      atmo: { weather: 'rain', time: 'night', fx: 'rain', mood: '闷' },
      camera: { focus: '旧望远镜的目镜', pause: 2 },
      cues: [{ at: 1, who: 'xiaoman', emote: '!' }, { at: 2, who: 'wenli', move: 'turn' }, { at: 9, who: 'xiaoman', emote: '?' }, { at: 1, who: 'ghost', emote: '!' }, { at: 1, who: 'xiaoman', emote: 'lol' }],
    }, ['xiaoman', 'wenli'], 3)
    expect(d.atmo).toEqual({ weather: 'rain', time: 'night', fx: 'rain', mood: '闷' })
    expect(d.camera).toEqual({ focus: '旧望远镜的目镜', pause: 2 })
    expect(d.cues).toEqual([{ at: 1, who: 'xiaoman', emote: '!' }, { at: 2, who: 'wenli', move: 'turn' }])
    expect(parseDirection({ atmo: { weather: 'lava' }, camera: { pause: 0 } }, [], 2)).toEqual({})
    const sc = parseScene(P, { narration: 'n', cast: [{ id: 'xiaoman' }], lines: [{ who: 'xiaoman', text: 'x' }], choices: [{ text: 'a', tone: 'joking' }, { text: 'b', tone: 'weird' }], atmo: { time: 'dusk' } }, '天台')!
    expect([sc.choices[0]!.tone, sc.choices[1]!.tone, sc.atmo]).toEqual(['joking', undefined, { time: 'dusk' }])
  })

  test('输出格式里要求导演指令，写进缓存的固定块（不额外调用）', () => {
    const st = staticBlock(P, 'zh')
    expect(st).toContain('"atmo"')
    expect(st).toContain('"cues"')
    expect(st).toContain('"camera"')
    expect(st).toContain('"tone"')
  })

  test('主题色：黄昏暖橙、雨夜冷蓝；没给粒子时按天气时段推', () => {
    expect(themeOf({ time: 'dusk' })).toBe('#f2a65a')
    expect(themeOf({ weather: 'rain', time: 'night' })).toBe('#4a6fb5')
    expect(fxOf({ weather: 'snow' })).toBe('snow')
    expect(fxOf({ time: 'night' })).toBe('stars')
    expect(fxOf({ time: 'night', fx: 'meteors' })).toBe('meteors')
    expect(fxOf(undefined)).toBe('none')
  })

  test('演出：入场前不在台上，背过身，气泡只在那一句时出现，靠近一步步来', () => {
    const sc = scene({ cues: [{ at: 2, who: 'wenli', move: 'enter' }, { at: 1, who: 'xiaoman', emote: '!' }, { at: 3, who: 'xiaoman', move: 'turn' }, { at: 3, who: 'wenli', move: 'approach' }] })
    expect(stageDirections(sc, 0, 0).wenli!.hidden).toBe(true)
    expect(stageDirections(sc, 1, 0).xiaoman!.emote).toBe('!')
    expect(stageDirections(sc, 2, 0).xiaoman!.emote).toBe('')
    expect(stageDirections(sc, 2, 0).wenli!.hidden).toBe(false)
    expect(stageDirections(sc, 2, 0).wenli!.offset).toBeLessThan(0) // 正在从边上滑进来
    expect(stageDirections(sc, 2, 9).wenli!.offset).toBe(0)
    const end = stageDirections(sc, 3, 9)
    expect([end.xiaoman!.turned, end.wenli!.offset]).toEqual([true, 3])
    // 画出来：背过身的那一帧和正面不同；有气泡时多出像素
    const cast = sc.cast
    expect(lit(stageFrame(P, cast, 'far', 1, stageDirections(sc, 1, 0)))).toBeGreaterThan(lit(stageFrame(P, cast, 'far', 1, stageDirections(sc, 0, 0))))
  })
})

describe('像素画面', () => {
  test('像素字体只留拉丁字母和数字；标题卡淡入、擦入，6 帧后静止', () => {
    expect(fontText('Cicadas & Évening Study 蝉鸣')).toBe('CICADAS & EVENING STUDY')
    const spec = { big: 'DAY 3', small: 'ACT II', color: '#ffffff', accent: '#f2c14e', style: 'wipe' as const }
    const a = cardFrame(spec, 60, 0, 0)
    const b = cardFrame(spec, 60, 3, 0)
    const c = cardFrame(spec, 60, CARD_FRAMES, 0)
    expect(lit(a)).toBeLessThan(lit(b))
    expect(lit(b)).toBeLessThan(lit(c))
    expect(cardFrame(spec, 60, CARD_FRAMES + 5, 0)).toEqual(c)
    const fade = cardFrame({ ...spec, style: 'fade' }, 60, 1, 0)
    expect(lit(fade)).toBe(lit(c)) // 淡入：像素都在，颜色暗
  })

  test('DAY 卡 inline：大字小字同一行、矮一截，字不重画；排不下退回上下两行', () => {
    const spec = { big: 'DAY 3', small: 'ACT II', color: '#ffffff', accent: '#f2c14e', style: 'wipe' as const }
    const stack = cardFrame(spec, 76, CARD_FRAMES, 0)
    const inline = cardFrame({ ...spec, layout: 'inline' as const }, 76, CARD_FRAMES, 0)
    expect(inline.length).toBe(14)
    expect(inline.length).toBeLessThan(stack.length)
    // 边框以外的亮像素：inline 和上下两行画的是同一批字
    expect(lit(inline) - 2 * (76 + 14) + 4).toBe(lit(stack) - 2 * (76 + stack.length) + 4)
    expect(cardFrame({ ...spec, big: 'DAY 3 OF THE LONG SUMMER', layout: 'inline' as const }, 40, CARD_FRAMES, 0).length).toBeGreaterThan(14)
  })

  test('舞台背景板：地名推出种类，中英文地名结果一致；英文只按整词匹配', () => {
    expect(['教学楼天台', '镇广播站', '江边夜市', '江雾音乐节 · 新人舞台', '江边', '操场', '老街', '天文社'].map(backdropOf))
      .toEqual(['roof', 'room', 'shop', 'hall', 'water', 'field', 'street', 'room'])
    expect(['Town Broadcast Room', 'County Radio Station', 'Outside the Shelter Door', 'Slope (live bar)', 'Ice-Lantern Fair', 'Seawall'].map(backdropOf))
      .toEqual(['room', 'room', 'street', 'hall', 'water', 'water'])
    const differ = BUILTIN.flatMap(p => [...p.places.map(x => x.name), ...p.fixed.map(x => x.place)])
      .filter(n => typeof n !== 'string' && n.zh && n.en && backdropOf(n.zh) !== backdropOf(n.en))
      .map(n => typeof n === 'string' ? n : `${n.zh} ${backdropOf(n.zh!)} / ${n.en} ${backdropOf(n.en!)}`)
    expect(differ).toEqual([])
  })

  test('舞台背景板：氛围带底色接上背景板第一行；立绘叠在上面；随时段变', () => {
    const st = stageFrame(P, [{ id: 'xiaoman', expression: 'normal' }], 'near', 0)
    for (const k of ['room', 'hall', 'street', 'shop', 'field', 'water', 'roof'] as const) {
      for (const time of ['day', 'dusk'] as const) {
        const bd = backdrop(k, { time }, 76, st.length, 0)
        expect([k, time, bd[0]![1]]).toEqual([k, time, backdropTop(k, { time })])
      }
      const both = over(backdrop(k, { time: 'night' }, 76, st.length, 0), st)
      expect([k, both.flat().filter((v, i) => st.flat()[i] !== null && v !== st.flat()[i]).length]).toEqual([k, 0])
    }
    expect(JSON.stringify(backdrop('street', { time: 'night' }, 76, 30, 0))).not.toEqual(JSON.stringify(backdrop('street', { time: 'day' }, 76, 30, 0)))
  })

  test('氛围带：每种粒子都画得出来，而且会动', () => {
    for (const fx of ['rain', 'snow', 'fireflies', 'cicadas', 'lanterns', 'meteors', 'stars', 'mist'] as const) {
      const f1 = atmoBand(fx, '#f2a65a', 76, 1)
      const f2 = atmoBand(fx, '#f2a65a', 76, 2)
      expect([fx, lit(f1) + lit(f2) > 0, JSON.stringify(f1) !== JSON.stringify(f2)]).toEqual([fx, true, true])
    }
    expect(lit(atmoBand('none', '#fff', 76, 1))).toBe(0)
  })

  test('标题页、结局粒子、生成中的小路、信物画框', () => {
    const card = cardFrame({ big: 'CICADAS', small: 'AI GALGAME', color: '#f2c14e', accent: '#f8bbd0', style: 'fade' }, 76, CARD_FRAMES, 0)
    const figs = P.cast.map(c => portraitFrame(c.sprite, 'normal', 1))
    const ts = titleScene(card, figs, 76, 0)
    expect(ts.length).toBe(card.length + figs[0]!.length + 4)
    // 头像帧最下面留一行透明，看得见的脚落在草地正上方一行：那一行里五个人各有像素
    const feet = ts[ts.length - 3]!
    const slot = Math.floor(76 / P.cast.length)
    expect(P.cast.map((_, i) => feet.slice(i * slot, (i + 1) * slot).some(v => v !== null && v !== feet[i * slot])).every(Boolean)).toBe(true)
    const kinds = ['true', 'good', 'normal', 'bad'].map(k => JSON.stringify(endFx(k, 76, 20, 3)))
    expect(new Set(kinds).size).toBe(4)
    expect(JSON.stringify(endFx('bad', 76, 20, 3))).not.toEqual(JSON.stringify(endFx('bad', 76, 20, 4)))
    const fig = portraitFrame(P.cast[0]!.sprite, 'normal', 1)
    expect(walkFrame(fig, 76, 0).length).toBe(WALK_H)
    expect(JSON.stringify(walkFrame(fig, 76, 5))).not.toEqual(JSON.stringify(walkFrame(fig, 76, 6)))
    // 窄屏、人多时也不越界：每一行都正好 w 个像素，没有写到数组外面的键
    const six = [...figs, figs[0]!]
    const rowsOk = (px: (number | null)[][], w: number) => px.every(r => r.length === w && Object.keys(r).length === w)
    const bad: string[] = []
    for (const w of [30, 40, 45, 50, 60, 61, 79]) {
      if (!rowsOk(titleScene(cardFrame({ big: 'CICADAS', color: '#fff', accent: '#fff', style: 'fade' }, w, CARD_FRAMES, 0), six, w, 0), w)) bad.push(`title ${w}`)
      if (!rowsOk(walkFrame(portraitFrame(P.cast[0]!.sprite, 'normal', 1), w, 0), w)) bad.push(`walk ${w}`)
      if (!rowsOk(townMap(P.places, new Set(P.places.map(x => x.id)), {}, Object.fromEntries(P.places.map(x => [x.id, ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']])), w, 0), w)) bad.push(`map ${w}`)
    }
    expect(bad).toEqual([])
    expect(['dark', 'light', 'light-daltonized', 'dark-ansi', 'auto', '', 3].map(bgOfTheme)).toEqual(['dark', 'light', 'light', 'dark', null, null, null])
    const f = framed([[null, 1], [2, null]])
    expect([f.length, f[0]!.length, f[1]![1], f[0]![0]]).toEqual([4, 4, null, PX.frame])
  })

  test('小镇地图：开放的地点亮着、标着按键数字，关着的暗', () => {
    const s = freshStory(P, 'zh')
    const opts = planOptions(P, s, 'zh')
    const open = new Set(opts.map(o => o.id!))
    const labels = Object.fromEntries(opts.map((o, i) => [o.id!, String(i + 1)]))
    const px = townMap(P.places, open, labels, { shop: ['#c0ca33'] }, 76, 1)
    const none = townMap(P.places, new Set(), {}, {}, 76, 1)
    expect(JSON.stringify(px)).not.toEqual(JSON.stringify(none))
    expect(px.flat().includes(0xc0ca33)).toBe(true) // 小卖部下面有黄阿姨的小点
  })

  test('地图标签行：数字落在房子正下方，地名按显示宽度截断、不压到下一栋', () => {
    expect([cellWidth('abc'), cellWidth('小卖部'), cellWidth('1 天文社')]).toEqual([3, 6, 8])
    const names = [{ i: 0, label: '1', name: '校门口小卖部和一个很长的名字' }, { i: 1, label: '2', name: 'Library' }, { i: 6, label: '7', name: '老街' }]
    const row0 = mapLabelRow(names, 0, 76)
    expect(row0.map(x => x.label)).toEqual(['1', '2'])
    let col = 0
    for (const [k, x] of row0.entries()) {
      col += x.gap
      expect(col).toBe(mapSlot(names[k]!.i, 76).x)
      const used = cellWidth(x.label) + (x.name ? 1 + cellWidth(x.name) : 0)
      expect(used).toBeLessThan(15) // 一格 15 列，至少留一列空隙
      col += used
    }
    expect(row0[0]!.name).toBe('校门口小卖部') // 1 + 空格 + 12 格，留 1 格空隙
    expect(mapLabelRow(names, 1, 76).map(x => [x.label, x.name])).toEqual([['7', '老街']])
  })

  test('关系网：刚变过好感的线会闪；还没挑明的关系不画', () => {
    const s = freshStory(P, 'zh')
    const a = relationGraph(P, s, { xiaoman: 1 }, 76, 34, 0).px
    const b = relationGraph(P, s, { xiaoman: 1 }, 76, 34, 1).px
    expect(JSON.stringify(a)).not.toEqual(JSON.stringify(b))
    const calm0 = relationGraph(P, s, {}, 76, 34, 0).px
    expect(relationGraph(P, s, {}, 76, 34, 0).nodes.length).toBe(1 + P.cast.length + P.npcs!.length)
    // 一诺 ↔ 周主任（母女）要到一诺阶段 3 才画
    const later = { ...s, heroines: { ...s.heroines, yinuo: { ...s.heroines.yinuo!, stage: 3 } } }
    expect(lit(relationGraph(P, later, {}, 76, 34, 0).px)).toBeGreaterThan(lit(calm0))
  })
})

describe('选择倾向、回声、小镇夜话、短幕、写代码事件都写进下一幕的提示', () => {
  test('选项的态度累计成「你在她眼里」的倾向；好感变化记下来给关系网闪', () => {
    let s = applyScene(freshStory(P, 'zh'), { ...scene(), cast: [{ id: 'xiaoman', expression: 'normal' }] })
    for (let i = 0; i < 3; i++) s = applyChoice(P, { ...s, phase: 'scene' }, { text: 'x', kind: 'reply', tone: 'joking', effects: { xiaoman: 1 } }, 'zh').story
    expect([s.profile.joking, s.deltas]).toEqual([3, { xiaoman: 1 }])
    expect(profileLine(s)).toBe('joking 3')
    expect(tendencies(s)).toEqual([{ tone: 'joking', n: 3, share: 1 }])
    const o = planOptions(P, s, 'zh')[0]!
    expect(sceneDynamic(P, s, o, null, '', 'zh', META)).toContain('[How I tend to act] joking 3')
  })

  test('二周目的回声、昨夜的八卦、短幕、写代码事件', () => {
    const s: Story = { ...freshStory(P, 'zh', 2), day: 3, echoes: ['和小满在天台修望远镜'], gossip: [{ day: 2, text: '黄阿姨说周主任昨晚在办公室待到十点。' }] }
    const o = planOptions(P, s, 'zh')[0]!
    const dyn = sceneDynamic(P, s, o, null, '', 'zh', { ...META, short: true, world: ['test-fail'] })
    expect(dyn).toContain('和小满在天台修望远镜')
    expect(dyn).toContain('黄阿姨说周主任昨晚')
    expect(dyn).toContain('[Short scene]')
    expect(dyn).toContain('my tests just failed')
    expect(sceneDynamic(P, { ...s, loop: 1 }, o, null, '', 'zh', META)).not.toContain('Echoes')
    expect(applyScene(s, scene()).world).toEqual([]) // 提到一次就清空
  })
})

describe('写代码的事件：只看命令种类和成败', () => {
  test('分类', () => {
    expect(classifyBash('npm test', false)).toBe('test-pass')
    expect(classifyBash('cd app && pytest -q tests/', true)).toBe('test-fail')
    expect(classifyBash('git commit -m "fix: secret thing"', false)).toBe('commit')
    expect(classifyBash('git commit -m x', true)).toBe(null)
    expect(classifyBash('tsc -p .', true)).toBe('build-fail')
    expect(classifyBash('tsc -p .', false)).toBe(null)
    expect(classifyBash('ls -la', false)).toBe(null)
  })
  test('写进提示的只有事件类型，没有命令、路径、输出', () => {
    const line = workLine(['test-fail', 'commit'])
    expect(line).toContain('tests just failed')
    expect(line).not.toMatch(/npm|pytest|git|\//)
    expect(commitKeepsake('cicada', 'xiaoman', 3, 'zh', 1).title).toBe('第 1 次提交')
  })
  test('陪伴模式：预写台词、每小时最多 2 句', () => {
    expect(companionLine('zh', 'test-fail', '小满', 0)).toContain('小满：')
    expect(canSpeak([0, 1000], 2000)).toBe(false)
    expect(canSpeak([0, 1000], 3600_000 + 2000)).toBe(true)
  })
})

describe('AI 原生机制：一次 Haiku、提示短、不剧透', () => {
  const calls: { model: string; prompt: string }[] = []
  const $ = { model: { complete: async (r: { model: string; prompt: { text: string }[] }) => { calls.push({ model: r.model, prompt: r.prompt.map(b => b.text).join('') }); return { isAnswered: true, text: '「今天老街下雨了。」', usage: { input_tokens: 300, output_tokens: 60, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } } } } } as unknown as EngineInterface
  const s: Story = { ...freshStory(P, 'zh'), day: 4, album: [{ day: 3, slot: 1, heroine: 'qingyi', text: '图书馆交换书签' }] }
  s.heroines.qingyi = { ...s.heroines.qingyi!, stage: 2, affection: 7, lastDay: 3 }

  test('离开很久后：好感最高、见过面的人发来消息', async () => {
    expect(letterFrom(P, s)).toBe('qingyi')
    expect(letterFrom(P, freshStory(P, 'zh'))).toBe(null)
    const lt = await awayLetter($, P, s, 9, 'zh')
    expect(lt).toEqual({ from: 'qingyi', text: '今天老街下雨了。' })
    expect(calls.at(-1)!.model).toBe('haiku')
  })

  test('日记：阶段 3 之前不给秘密；画像带着选择倾向；八卦只写幕后', async () => {
    const d = await diaryEntry($, P, s, 'qingyi', 3, 'zh')
    expect([d.text, d.usage.extra, (d.usage.cost ?? 0) > 0]).toEqual(['今天老街下雨了。', 1, true])
    expect(calls.at(-1)!.prompt).not.toContain('14 日早上的车')
    await diaryEntry($, P, { ...s, heroines: { ...s.heroines, qingyi: { ...s.heroines.qingyi!, stage: 3 } } }, 'qingyi', 3, 'zh')
    expect(calls.at(-1)!.prompt).toContain('14 日早上的车')
    await portraitOf($, P, { ...s, profile: { evasive: 4 } }, 'qingyi', 'zh')
    expect(calls.at(-1)!.prompt).toContain('evasive 4')
    await nightGossip($, P, s, 3, 'zh')
    expect(calls.at(-1)!.prompt).toContain('黄阿姨')
    expect(calls.every(c => c.model === 'haiku')).toBe(true)
  })
})

describe('花费、成就、每日挑战', () => {
  test('按 token 估算花费', () => {
    expect(costOf('sonnet', { input_tokens: 1_000_000, output_tokens: 0, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 })).toBe(2)
    expect(costOf('haiku', { input_tokens: 0, output_tokens: 1_000_000, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 })).toBe(0.5)
    expect(dateKey(new Date(2026, 9, 23, 12).getTime())).toBe('2026-10-23')
  })
  test('通关时的成就', () => {
    const s = freshStory(P, 'zh')
    const trueEnd = P.endings.find(e => e.id === 'xiaoman-true')!
    const got = achievementsOnFinish(P, s, trueEnd, { endings: [], clears: 0, keepsakes: [] }, EMPTY_FEATS, true)
    expect(got).toEqual(expect.arrayContaining(['first-true', 'no-undo', 'autoplay-clear']))
    expect(achievementsOnFinish(P, { ...s, rewinds: 1 }, trueEnd, { endings: [], clears: 0, keepsakes: [] }, { ...EMPTY_FEATS, achievements: ['first-true'] }, false)).not.toContain('first-true')
  })
  test('每日挑战：同一天同一个包、同一个种子', () => {
    const a = dailyChallenge('2026-10-23', BUILTIN)
    expect(dailyChallenge('2026-10-23', BUILTIN)).toEqual(a)
    expect(BUILTIN.includes(a.pack)).toBe(true)
    expect(dailyShare('2026-10-23', 'Cicadas', 'Meteors on the Rooftop', 'true')).toBe('ai-galgame daily 2026-10-23 · Cicadas · Meteors on the Rooftop ★')
  })
})

describe('写作手法层接进引擎', () => {
  const route = P.craft!.routes!
  test('共通线过完那天锁定路线，在余波里给一行提示；没人领先就是群像线', () => {
    const s0: Story = { ...freshStory(P, 'zh'), day: route.commonUntil, slot: P.slots.length - 1, phase: 'after' }
    const lead: Story = { ...s0, heroines: { ...s0.heroines, zhiyao: { ...s0.heroines.zhiyao!, stage: 4, affection: 20 } } }
    const r = advanceTime(P, lead, 'zh').story
    expect(r.flags).toContain('route:zhiyao')
    expect(r.after).toContain('落在了知遥身上')
    const tie = advanceTime(P, s0, 'zh').story
    expect(tie.flags).toContain('route:ensemble')
    expect(advanceTime(P, { ...tie, phase: 'after', slot: P.slots.length - 1 }, 'zh').story.flags.filter(f => f.startsWith('route:')).length).toBe(1)
  })
  test('写作指南进缓存的固定块；检查员的固定块不加', () => {
    expect(staticBlock(P, 'zh')).toContain('[Craft')
  })
  test('一幕写完：场景类型记成 lastKind，手法层的标记并进 flags', () => {
    const s = applyScene(freshStory(P, 'zh'), { ...scene(), kind: 'comedy', craftFlags: ['set:yn-interview', 'gag:x'] })
    expect([s.lastKind, s.flags]).toEqual(['comedy', ['set:yn-interview', 'gag:x']])
  })
})

describe('结局卡（不剧透的分享方格）', () => {
  test('只写结局等级、幕数、约定方格、信物、回退和关系值图标，不写结局名和剧情', () => {
    const s: Story = { ...freshStory(P, 'zh'), phase: 'ending', endingId: 'xiaoman-true', daily: '2026-11-06', rewinds: 1,
      album: Array.from({ length: 8 }, (_, i) => ({ day: i + 1, slot: 0, heroine: 'xiaoman', text: `秘密剧情 ${i}` })),
      promises: [{ text: 'a', heroine: 'xiaoman', day: 1, due: 2, status: 'kept' }, { text: 'b', heroine: 'xiaoman', day: 1, due: 2, status: 'kept' }, { text: 'c', heroine: 'zhiyao', day: 1, due: 2, status: 'broken' }],
      keepsakes: [{ pack: 'cicada', day: 1, heroine: 'xiaoman', title: 'x', desc: '', art: [], palette: {} }, { pack: 'cicada', day: 1, heroine: 'xiaoman', title: 'y', desc: '', art: [], palette: {} }] }
    s.heroines.xiaoman = { ...s.heroines.xiaoman!, affection: 10 }
    const card = endingCard(s, P, 'zh')
    expect(card).toBe(['ai-galgame · 蝉鸣与晚自习 · 每日挑战 11-06', '★ 真结局', '8 幕 · 约定 ✓✓✗ · 信物 2 · 回退 1 次', '♥♥♥♥♡', 'github.com/Ephemeral6/ai-galgame'].join(String.fromCharCode(10)))
    expect(card).not.toContain('流星落在天台上')
    expect(card).not.toContain('秘密剧情')
    expect(endingCard({ ...s, phase: 'plan', endingId: '', daily: '' }, P, 'en')).toContain('Day 1 of 14, in progress')
  })
  test('非恋爱角色用她自己的图标', () => {
    const M = BUILTIN.find(p => p.id === 'mauve')!
    const s: Story = { ...freshStory(M, 'en'), phase: 'ending', endingId: 'my-prisoner' }
    s.heroines.wolf = { ...s.heroines.wolf!, affection: 8 }
    expect(endingCard(s, M, 'en')).toContain('◆◆◆◆◆')
  })
})
