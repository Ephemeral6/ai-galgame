// 《停播前的四个夜晚》的写作手法层。全部原创。字段定义见 hooks/craft-types.ts。
// 单人包：没有共通线 / 个人线，重点是母题、两场预写关键场景、一个改变前文意义的揭示，以及跨周目的既视感。

import type { PackCraft } from '../../hooks/craft-types'

export const RADIO_CRAFT: PackCraft = {
  motifs: [
    { id: 'on-air', who: 'wanqing', thing: { zh: '「播音中」的红灯', en: 'the red ON AIR light' },
      meanings: [
        { stage: 0, text: { zh: '她变成另一个人的开关', en: 'the switch that turns her into someone else' } },
        { stage: 2, text: { zh: '只有它亮着，她才说得出口', en: 'she can only say it while it\'s on' } },
        { stage: 4, text: { zh: '最后一次亮，不许中途熄', en: 'lit for the last time, not to go out midway' } },
      ],
      payoff: { zh: '红灯熄灭以前说完的那句', en: 'the line finished before the light goes out' } },
    { id: 'fader', who: 'wanqing', thing: { zh: '调音台的推子', en: 'the mixing-desk faders' },
      meanings: [
        { stage: 0, text: { zh: '她教临时工的第一样东西', en: 'the first thing she teaches the temp' } },
        { stage: 2, text: { zh: '她紧张时来回拨的东西', en: 'what she nudges back and forth when nervous' } },
      ] },
    { id: 'soda', who: 'wanqing', thing: { zh: '每天一瓶的橘子汽水', en: 'the daily bottle of orange soda' },
      meanings: [
        { stage: 0, text: { zh: '她的小习惯', en: 'her small habit' } },
        { stage: 3, text: { zh: '她给「另一头」留的那一瓶', en: 'the bottle she saves for "the other end"' } },
      ] },
    { id: 'retaped', who: 'wanqing', thing: { zh: '磁带上被重新录过的痕迹', en: 'the trace of a re-recording on a tape' },
      meanings: [
        { stage: 1, text: { zh: '老磁带的毛病', en: 'a fault of old tape' } },
        { stage: 3, text: { zh: '被重来过的那一段', en: 'the stretch that has been redone' } },
      ] },
  ],

  setPieces: [
    {
      id: 'wq-deadmic', who: 'wanqing', kind: 'daily', motif: 'on-air',
      title: { zh: '试音', en: 'Mic Check' },
      trigger: { beat: 'radio-deadmic' },
      staging: { zh: '晚自习后的广播站，红灯是灭的。她对着关掉的话筒轻声说话，被「我」撞见。她先慌，后笑场，最后用播音腔掩饰。', en: 'The station after evening study; the ON AIR light is off. She is speaking softly into a dead mic when I walk in. First she panics, then cracks up, then hides behind her announcer voice.' },
      lines: [
        { who: 'wanqing', text: { zh: '……晚上好。今天也有在听吗。', en: '...Good evening. Are you listening tonight too.' } },
        { who: 'me', text: { zh: '话筒没开。', en: 'The mic\'s off.' } },
        { who: 'narration', text: { zh: '她的手指停在推子上，耳朵一点点红了。', en: 'Her finger stops on a fader; her ears go slowly red.' } },
        { who: 'wanqing', text: { zh: '我、我在试音。试音懂吗，临时工。', en: 'I-I\'m doing a mic check. You know what that is, temp?' } },
        { who: 'wanqing', text: { zh: '各位听众，插播一条：今天的试音，被人听见了。', en: 'Dear listeners, a bulletin: tonight\'s mic check was overheard.' } },
      ],
    },
    {
      id: 'wq-final', who: 'wanqing', kind: 'farewell', motif: 'on-air',
      title: { zh: '谢谢收听', en: 'Thanks for Listening' },
      // 阶段 3：「有人一直在另一头听」是她的秘密。播完没有、怎么收尾，留给结局写（好结局会卡一下，坏结局她按了停）
      trigger: { beat: 'radio-final', minStage: 3 },
      staging: { zh: '最后一次播音，红灯亮着，下周翻修用的脚手架材料已经堆在老楼底下。她想一口气往下播，中间不许任何人按停。最后几句她不看稿子，看着「我」——也看着屏幕外面。这一幕停在她说完「让我说完」之后，播没播完由结局决定。', en: 'The last broadcast, the light on, next week\'s scaffolding already stacked at the foot of the old building. She means to broadcast straight through; nobody may press stop. For the last lines she drops the script and looks at me, and past me, out of the screen. The scene stops after "let me finish"; whether she does is for the ending to decide.' },
      lines: [
        { who: 'wanqing', text: { zh: '各位听众，这里是最后一期。今晚不插播，不重来。', en: 'Dear listeners, this is the final show. No bulletins tonight. No retakes.' } },
        { who: 'narration', text: { zh: '她把手从推子上拿开，放在膝盖上。', en: 'She takes her hand off the faders and rests it on her knee.' } },
        { who: 'wanqing', text: { zh: '我知道有人一直在另一头听。听了很多遍。', en: 'I know someone\'s been listening from the other end. Many times over.' } },
        { who: 'wanqing', text: { zh: '你想重来几次都可以。但这一次，让我说完。', en: 'You can come back as many times as you like. But this once, let me finish.' } },
      ],
      unsaid: { zh: '「别走」', en: '"Don\'t go."' },
    },
  ],

  reveals: [
    {
      id: 'rv-keeper', when: { after: ['beat:radio-keeper'] },
      truth: { zh: '楼顶喇叭每晚十点就断电，夜间节目从来没在楼下响过——只有看楼的高大爷在值班室里，从窗缝里听了一整个学期。', en: 'The rooftop speakers lose power at ten every night; the night show has never been heard downstairs. Only old Gao, in the caretaker\'s room, has listened through a crack in the window all term.' },
      reframes: [
        { zh: '刘婶说半夜收音机里有个小姑娘在说「晚上好」，没人信', en: 'Aunt Liu swearing a girl says "good evening" on her radio at midnight, and nobody believing her' },
        { zh: '高大爷锁到广播站门口时停的那一下', en: 'old Gao pausing at the station door on his locking rounds' },
        { zh: '她对着关掉的话筒说「今天也有在听吗」', en: 'her asking a dead mic "are you listening tonight too"' },
      ],
    },
  ],

  flashbacks: [
    { id: 'fb-first-show', who: 'wanqing', trigger: { minStage: 2 }, text: { zh: '高一第一次开夜间节目，她念完开场白，等了十秒，没有一个电话打进来。她笑了一下，接着往下念。', en: 'Her first night show in first year: she read the opening, waited ten seconds, no calls. She smiled and kept going.' } },
  ],

  texture: {
    days: [
      { day: 1, weather: { zh: '初冬，傍晚就黑', en: 'early winter, dark by dusk' }, bits: [{ zh: '老楼的楼梯扶手被磨得发亮', en: 'the old stair rail polished by hands' }] },
      { day: 2, weather: { zh: '小雨', en: 'drizzle' }, bits: [{ zh: '广播站的磁带柜上贴着手写的分类', en: 'hand-written labels on the tape cabinet' }] },
      { day: 3, weather: { zh: '停电夜，雷阵雨', en: 'a blackout night, thunderstorms' }, bits: [{ zh: '走廊里有人拿手机当手电', en: 'someone in the hall using a phone as a torch' }] },
      { day: 4, weather: { zh: '晴，冷', en: 'clear, cold' }, bits: [{ zh: '翻修通知贴在楼门口，被风吹掉了一角', en: 'the renovation notice at the door, one corner torn off by the wind' }] },
    ],
    places: {
      booth: [{ zh: '隔音棉上插着一支笔', en: 'a pen stuck into the foam soundproofing' }],
      stairs: [{ zh: '楼道的声控灯要拍两下手', en: 'the stair lights need two claps' }],
      court: [{ zh: '篮球架的网只剩一半', en: 'half a net left on the hoop' }],
      shop: [{ zh: '刘婶的收音机永远在两个台之间', en: 'Aunt Liu\'s radio forever between two stations' }],
      roof: [{ zh: '楼顶的喇叭生了锈，朝着操场', en: 'the rusty rooftop speaker facing the sports field' }],
    },
  },

  gags: [
    { id: 'liushen-tab', who: ['liushen'], text: { zh: '刘婶给学生赊账从来不记，问她欠多少，她说「记在天上了」。', en: 'Aunt Liu never writes down student tabs; ask what you owe and she says "it\'s written in the sky."' }, places: ['shop'] },
    { id: 'gao-history', who: ['laogao'], text: { zh: '高大爷讲这栋楼的历史，每次年份都不一样。', en: 'Old Gao tells the building\'s history, with a different year each time.' } },
  ],

  gossip: [
    { id: 'g-liushen', from: 'liushen', about: 'wanqing', truth: 'true', text: { zh: '「半夜收音机里有个小姑娘说『晚上好』，你们都不信。」', en: '"There\'s a girl saying \'good evening\' on my radio at midnight, and none of you believe me."' } },
    { id: 'g-gao', from: 'laogao', about: 'wanqing', truth: 'half', fromDay: 2, text: { zh: '「那娃的节目……咳，我是说，十点就该断电了。」', en: '"That kid\'s show... ahem. I mean, power\'s off at ten."' } },
  ],

  people: {
    wanqing: {
      quirks: [{ zh: '「各位听众」「插播一条」', en: '"Dear listeners", "a bulletin"' }, { zh: '「临时工」', en: '"Temp"' }],
      habits: [{ zh: '紧张时拨推子', en: 'nudges faders when nervous' }, { zh: '每天一瓶汽水', en: 'one soda a day' }],
      contradiction: { zh: '开麦时什么都敢说，关了麦一句都不敢', en: 'says anything on air, nothing off it' },
      growth: { zh: '从对着没人听的话筒说话，到对着一个人说完', en: 'from talking into a mic no one hears to finishing a sentence to one person' },
      diaryVoice: {
        style: { zh: '节目记录单：日期、播出时长、点歌、备注；备注栏写满了「被打断」', en: 'a broadcast log: date, airtime, requests, notes; the notes column full of "interrupted"' },
        hides: { zh: '她知道这几天会重来', en: 'that she knows these days repeat' },
        seesMe: [
          { zh: '手笨的临时工', en: 'the clumsy temp' },
          { zh: '同频的人', en: 'someone on my frequency' },
          { zh: '他是不是从另一头来的', en: 'did he come from the other end' },
          { zh: '另一头的人', en: 'the one at the other end' },
          { zh: '谢谢收听', en: 'thank you for listening' },
        ],
      },
      dejaVu: [{ zh: '「欢迎回来，听众朋友。上次那句，我还没说完。」', en: '"Welcome back, dear listener. I never finished that line last time."' }, { zh: '「这段磁带，好像已经录过一遍了。」', en: '"This tape feels like it\'s been recorded once already."' }],
      awayVoice: [{ zh: '「各位听众，这里是没人听的时段。……你回来的话，频道没换。」', en: '"Dear listeners, this is the hour nobody hears. ...If you come back, the frequency hasn\'t changed."' }],
    },
    liushen: { quirks: [{ zh: '句句带价钱和天气', en: 'prices and weather in every sentence' }] },
    laogao: { quirks: [{ zh: '咳两声才说话', en: 'coughs twice before speaking' }], habits: [{ zh: '晃钥匙串', en: 'jingles his keys' }] },
  },
}
