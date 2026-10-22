// 空白剧本包模板 / Blank story pack template
// 复制整个 _template 目录，改名为你的包 id，把每个「TODO」换成你的内容。
// Copy this folder, rename it to your pack id, and replace every "TODO".
// 字段说明见 CONTRIBUTING.md；同内容的 JSON 版是 pack.json（可直接 /gal import）。

import type { Pack } from '../../types'

export const TEMPLATE: Pack = {
  id: 'my-pack', // 小写字母开头，只用 a-z 0-9 - _ ；与目录名一致
  version: '0.1.0',
  defaultLang: 'zh', // 缺某种语言时回落到这里
  langs: ['zh', 'en'], // 你提供了完整文本的语言
  author: 'TODO your name',
  source: 'original', // 改编作品改成 { work, author, license, adaptation, url, notice }
  notes: { zh: 'TODO 创作说明（可选）', en: 'TODO author\'s note (optional)' },
  title: { zh: 'TODO 标题', en: 'TODO Title' },
  subtitle: { zh: 'TODO 一句话副标题', en: 'TODO one-line subtitle' },
  premise: { zh: 'TODO 第一人称「我」是谁、在哪里、什么时候。', en: 'TODO Who "I" am, where and when.' },
  style: { zh: 'TODO 文风要求与禁忌。', en: 'TODO Style rules and taboos.' },
  me: { zh: '我', en: 'Me' },
  days: 3,
  slots: [{ zh: '白天', en: 'Day' }, { zh: '夜里', en: 'Night' }],
  dayLabel: { zh: '第 {n} 天', en: 'Day {n}' },
  chapters: [{ from: 1, title: { zh: 'TODO 第一章', en: 'TODO Chapter 1' } }],
  places: [
    { id: 'place-a', name: { zh: 'TODO 地点 A', en: 'TODO Place A' }, mood: { zh: 'TODO 氛围', en: 'TODO mood' }, slots: [0, 1] },
    { id: 'place-b', name: { zh: 'TODO 地点 B', en: 'TODO Place B' }, mood: { zh: 'TODO 氛围', en: 'TODO mood' }, slots: [0] },
  ],
  cast: [
    {
      id: 'her',
      name: { zh: 'TODO 全名', en: 'TODO Full Name' },
      short: { zh: 'TODO 简称', en: 'TODO Short' },
      color: '#8ecae6', // 主色：名字、边框、心形
      look: { zh: 'TODO 像素小动物外形', en: 'TODO pixel-animal look' },
      voice: { zh: 'TODO 说话方式', en: 'TODO how she talks' },
      samples: [{ zh: 'TODO 示例台词', en: 'TODO sample line' }],
      secret: { zh: 'TODO 秘密（阶段 3 之前不会说出）', en: 'TODO secret (not revealed before stage 3)' },
      arc: [
        { zh: 'TODO 阶段 0 节拍', en: 'TODO beat 0' },
        { zh: 'TODO 阶段 1 节拍', en: 'TODO beat 1' },
        { zh: 'TODO 阶段 2 节拍', en: 'TODO beat 2' },
        { zh: 'TODO 阶段 3 节拍', en: 'TODO beat 3' },
        { zh: 'TODO 阶段 4 节拍', en: 'TODO beat 4' },
      ],
      haunts: { 0: ['place-a'], 1: ['place-a'] }, // 时段下标 → 常去的地点 id
      deadline: { day: 3, text: { zh: 'TODO 截止事件', en: 'TODO deadline event' } },
      keepsakeIdeas: { zh: 'TODO 信物灵感', en: 'TODO keepsake ideas' },
      tagline: { zh: 'TODO 一行摘要（她不在场时提示里只放这一行）', en: 'TODO one-line summary (all the prompt gets when she is not in the scene)' }, // 可选
      sprite: {
        // 14 列宽、4–12 行；'.' 透明；字母在 pal 里取色
        pal: { B: '#8ecae6', b: '#5fa8c9', L: '#e8f6fb', A: '#ffb703' },
        art: [
          '...BB....BB...',
          '..BBBB..BBBB..',
          '..BBBBBBBBBB..',
          '.BBBBBBBBBBBB.',
          '.BBBBBBBBBBBB.',
          '.BBBBBAABBBBB.',
          '..BBLLLLLLBB..',
          '..bBLLLLLLBb..',
          '..bbbbbbbbbb..',
          '...bb....bb...',
        ],
        eyes: [[4, 4], [4, 9]], // [行, 列]
        cheeks: [[5, 3], [5, 10]],
        motion: 'ears', // tail | wings | ears | bob
      },
    },
  ],
  // 以下四项都可省略（第一版格式的包没有它们也照常能玩）
  npcs: [ // 配角：不可攻略，0..8 人
    {
      id: 'friend',
      name: { zh: 'TODO 配角名', en: 'TODO Supporting Name' },
      color: '#b0bec5',
      role: { zh: 'TODO 身份，以及和主角、主角色的关系', en: 'TODO who they are and how they relate to me and the heroine' },
      voice: { zh: 'TODO 说话方式', en: 'TODO how they talk' },
      samples: [{ zh: 'TODO 示例台词', en: 'TODO sample line' }],
      haunts: { 0: ['place-b'] }, // 可选：在哪出没（玩家去那里时会写进提示）
      // sprite: { ... } 可选：有立绘才会上台，格式同主角色
    },
  ],
  relations: [ // a、b 是主角色、配角的 id，或 'me'
    { a: 'her', b: 'friend', kind: { zh: 'TODO 关系类型', en: 'TODO kind' }, text: { zh: 'TODO 发生过什么、现在卡在哪', en: 'TODO what happened, where it stands' }, hiddenUntil: 2 },
  ],
  acts: [ // 分幕：每一幕的走向、关键事件、结束时的悬念
    {
      id: 'act1', from: 1,
      title: { zh: 'TODO 第一幕', en: 'TODO Act I' },
      goal: { zh: 'TODO 这一幕的走向', en: 'TODO where this act goes' },
      beats: [
        { id: 'turn', day: 2, by: 3, who: ['her'], kind: { zh: '转折', en: 'turning point' }, text: { zh: 'TODO 必须发生的事', en: 'TODO what must happen' }, promise: { zh: 'TODO 关键约定（可选）', en: 'TODO key promise (optional)' } },
      ],
      hook: { zh: 'TODO 悬念钩子（可选）', en: 'TODO cliffhanger (optional)' },
    },
  ],
  incidents: [ // 随机 / 条件事件
    { id: 'rain', chance: 0.3, days: [1, 3], slots: [1], text: { zh: 'TODO 下雨了', en: 'TODO it rains' } },
  ],
  stages: [{ zh: '陌生', en: 'Strangers' }, { zh: '熟悉', en: 'Friends' }, { zh: '心事', en: 'Worries' }, { zh: '秘密', en: 'Secret' }, { zh: '抉择', en: 'Choice' }],
  gates: [
    { affection: 0, scenes: 0 },
    { affection: 2, scenes: 1 },
    { affection: 4, scenes: 2 },
    { affection: 6, scenes: 3 },
    { affection: 8, scenes: 4 },
  ],
  events: [{ day: 1, text: { zh: 'TODO 日历事件', en: 'TODO calendar event' } }],
  fixed: [{ day: 3, slot: 1, place: { zh: 'TODO 固定事件地点', en: 'TODO fixed place' }, mood: { zh: 'TODO', en: 'TODO' }, title: { zh: 'TODO 固定事件', en: 'TODO fixed event' }, cast: ['her'] }],
  proactiveAfter: 1,
  endings: [ // 先比 tier（高者优先），同 tier 比好感；kind 只用于相册显示
    { id: 'her-true', who: 'her', kind: 'true', tier: 4, minStage: 4, minAffection: 8, maxBroken: 0, keptKey: 'turn', title: { zh: 'TODO 真结局', en: 'TODO True Ending' }, brief: { zh: 'TODO 走向', en: 'TODO what happens' } },
    { id: 'her-good', who: 'her', kind: 'good', tier: 3, minStage: 4, minAffection: 8, maxBroken: 0, title: { zh: 'TODO 好结局', en: 'TODO Good Ending' }, brief: { zh: 'TODO 走向', en: 'TODO what happens' } },
    { id: 'her-near', who: 'her', kind: 'normal', tier: 2, minStage: 3, title: { zh: 'TODO 普通结局', en: 'TODO Normal Ending' }, brief: { zh: 'TODO 走向', en: 'TODO what happens' } },
    { id: 'her-bad', who: 'her', kind: 'bad', tier: 1, minStage: 2, minBroken: 1, title: { zh: 'TODO 坏结局', en: 'TODO Bad Ending' }, brief: { zh: 'TODO 走向', en: 'TODO what happens' } },
    { id: 'normal', kind: 'normal', tier: 0, title: { zh: 'TODO 兜底结局', en: 'TODO Fallback Ending' }, brief: { zh: 'TODO 走向', en: 'TODO what happens' } },
  ],
  finale: { zh: 'TODO 最后一句的点题要求', en: 'TODO how the last sentence should echo the title' },
  loading: [{ zh: 'TODO 生成中的氛围句…', en: 'TODO a mood line while writing...' }],
}
