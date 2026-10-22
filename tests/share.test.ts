// 导出这一局：HTML 自包含（无外部资源、无脚本、文本全部转义）、深浅色都有样式、像素图用内联 SVG；
// Markdown 有每天摘要、选择、约定、信物字符块和结局；分享短文本不超长。

import { describe, expect, test } from 'claude-code/testing'

import type { Story } from '../types'
import { freshStory } from '../hooks/engine'
import { exportFileName, exportRun, gridSvg, runDigest, shareSummary, spriteGrid } from '../hooks/share'
import { CICADA } from '../packs/cicada/pack'
import { MAUVE } from '../packs/mauve/pack'

function played(lang: 'zh' | 'en' = 'zh', finished = true): Story {
  const s = freshStory(CICADA, lang)
  s.day = finished ? 14 : 3
  s.phase = finished ? 'ending' : 'plan'
  s.heroines.xiaoman = { ...s.heroines.xiaoman!, stage: 4, affection: 13 }
  s.heroines.qingyi = { ...s.heroines.qingyi!, stage: 1, affection: 3 }
  s.album = [
    { day: 1, slot: 0, heroine: 'xiaoman', text: '第一次走进天文社' },
    { day: 1, slot: 2, heroine: 'qingyi', text: '图书馆的靠窗座位被赶走了' },
    { day: 2, slot: 1, heroine: 'xiaoman', text: '一起擦望远镜 <script>alert(1)</script>' },
  ]
  s.notes = [{ day: 1, heroine: 'xiaoman', text: '天文社：答应明天还来', used: false }, { day: 2, heroine: 'xiaoman', text: '天文社：帮她擦镜片', used: false }]
  s.promises = [{ text: '流星雨那晚一起守天台', heroine: 'xiaoman', day: 2, due: 13, status: 'kept' }, { text: '还书', heroine: 'qingyi', day: 1, due: 4, status: 'broken' }]
  s.keepsakes = [{
    pack: 'cicada', day: 2, heroine: 'xiaoman', title: '小螺丝刀', desc: '修望远镜用的 "小" 螺丝刀',
    art: ['...AA...', '...AA...', '...BB...', '...BB...', '...BB...', '...BB...', '...BB...', '........'], palette: { A: 0xe0313c, B: 0x9c9c9c },
  }]
  s.scene = { title: 't', place: '天台', cast: [{ id: 'xiaoman', expression: 'smile' }], distance: 'near', narration: '', lines: [{ who: 'xiaoman', text: '今年不会了，对吧？' }, { who: 'me', text: '嗯。' }], choices: [], summary: '' }
  if (finished) {
    s.endingId = 'xiaoman-true'
    s.ending = '流星一颗一颗落下来。\n她转过身，说了那句话。'
  }
  return s
}

describe('HTML 导出', () => {
  test('自包含：没有外部资源、没有脚本，文本全部转义', () => {
    const html = exportRun(played(), CICADA, 'zh', 'html')
    expect(html).toStartWith('<!doctype html>')
    expect(html).toContain('<meta charset="utf-8">')
    for (const bad of ['<script', '<link', '<iframe', '<img', 'src=', 'href=', '@import', 'url(', 'http://', 'https://']) expect(html).not.toContain(bad)
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(html).toContain('修望远镜用的 &quot;小&quot; 螺丝刀')
  })

  test('深色浅色都有配色；像素图是内联 SVG', () => {
    const html = exportRun(played(), CICADA, 'zh', 'html')
    expect(html).toContain('prefers-color-scheme:dark')
    expect(html).toContain('color-scheme:light dark')
    expect(html.match(/<svg /g)!.length).toBe(1 + CICADA.cast.length) // 一个信物 + 每个主角色
    expect(html).toContain('fill="#e0313c"')
    expect(html).toContain('流星落在天台上')
    expect(html).toContain('第 1 天')
    expect(html).toContain('答应明天还来')
    expect(html).toContain('今年不会了，对吧？')
  })

  test('改编包显示署名（作为文字，不生成链接）', () => {
    const s = freshStory(MAUVE, 'en')
    const html = exportRun(s, MAUVE, 'en', 'html')
    expect(html).toContain('bosinpai')
    expect(html).not.toContain('href=')
    expect(html).toContain('Still in progress')
  })

  test('SVG：同色连续像素合并成一条，透明处不画', () => {
    const svg = gridSvg([['#ff0000', '#ff0000', null, '#00ff00']], 2)
    expect(svg).toContain('<rect x="0" y="0" width="2" height="1" fill="#ff0000"/>')
    expect(svg).toContain('<rect x="3" y="0" width="1" height="1" fill="#00ff00"/>')
    expect(svg.match(/<rect/g)!.length).toBe(2)
    expect(gridSvg([['javascript:alert(1)']])).toContain('fill="currentColor"')
  })
})

describe('Markdown 导出', () => {
  test('标题、每天摘要、选择、关键台词、约定、信物字符块、结局', () => {
    const md = exportRun(played(), CICADA, 'zh', 'md')
    expect(md).toStartWith('# 蝉鸣与晚自习')
    expect(md).toContain('**第 1 天**')
    expect(md).toContain('### 第一章 · 转学生')
    expect(md).toContain('我的选择：天文社：答应明天还来')
    expect(md).toContain('> **林小满**：今年不会了，对吧？')
    expect(md).toContain('✔ 林小满：流星雨那晚一起守天台（已兑现）')
    expect(md).toContain('✘ 沈清漪：还书（失约）')
    expect(md).toContain('██')
    expect(md).toContain('## 结局：流星落在天台上（真结局）')
    expect(md).toContain('\\<script\\>')
  })

  test('英文；传入的关键台词优先于最后一幕', () => {
    const md = exportRun(played('en'), CICADA, 'en', 'md', { quotes: [{ day: 5, who: 'qingyi', text: 'Why do you ask.' }] })
    expect(md).toContain('# Cicadas & Evening Study')
    expect(md).toContain('> **Shen Qingyi**: Why do you ask.')
    expect(md).not.toContain('今年不会了')
  })

  test('立绘转像素格时把眼睛画上', () => {
    const sp = CICADA.cast[0]!.sprite
    const g = spriteGrid(sp)
    const [r, c] = sp.eyes[0]!
    expect(g[r]![c]).toBe('#1e1a1a')
    expect(g[0]!.length).toBe(14)
    expect(runDigest(played(), CICADA, 'zh').days.map(d => d.day)).toEqual([1, 2])
  })
})

describe('分享短文本', () => {
  test('通关：标题、结局、最在意的人、约定与信物数', () => {
    const t = shareSummary(played(), CICADA, 'zh')
    expect(t).toContain('《蝉鸣与晚自习》')
    expect(t).toContain('流星落在天台上')
    expect(t).toContain('林小满')
    expect(t).toContain('兑现 1 个约定，收下 1 件信物')
    expect(t).toContain('#aigalgame')
    expect([...t].length).toBeLessThanOrEqual(220)
  })

  test('未通关、英文、长度上限', () => {
    const t = shareSummary(played('en', false), CICADA, 'en')
    expect(t).toContain('day 3 of 14')
    expect([...shareSummary(played(), CICADA, 'zh', 40)].length).toBeLessThanOrEqual(40)
    expect(exportFileName(played(), CICADA, 'html')).toBe('cicada-xiaoman-true.html')
    expect(exportFileName(played('zh', false), CICADA, 'md')).toBe('cicada-day-3.md')
  })
})
