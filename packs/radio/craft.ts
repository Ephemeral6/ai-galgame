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
    {
      id: 'wq-retaped', who: 'wanqing', kind: 'reveal', motif: 'retaped',
      title: { zh: '被录过的一段', en: 'The Recorded-Over Stretch' },
      trigger: { beat: 'radio-tape' },
      staging: { zh: '白天的广播站，窗外有人在打篮球。桌上摊着要处理掉的磁带，每盘贴一张手写标签。她把一盘放进卡座，倒回去又放了一遍：中间有几秒的底噪不一样。她说出被抹掉的那句话时很平静，说完才去拨推子。', en: 'The booth by day, basketballs thudding outside. Tapes to be thrown out are spread on the desk, each with a handwritten label. She puts one in the deck, rewinds, plays it again: for a few seconds the hiss sounds different. She says the erased line calmly, and only afterwards reaches for a fader.' },
      lines: [
        { who: 'wanqing', text: { zh: '你听这里。底噪变了。有人在这上面重新录过。', en: 'Listen here. The hiss changes. Someone recorded over this bit.' } },
        { who: 'me', text: { zh: '录过什么？', en: 'Recorded what?' } },
        { who: 'wanqing', text: { zh: '原来这里是一句「明天见」。我记得。……我不知道我为什么记得。', en: 'It used to say "see you tomorrow" here. I remember. ...I don\'t know why I remember.' } },
        { who: 'narration', text: { zh: '卡座咔哒一声停了。她把那盘磁带的标签撕下来，又贴回去。', en: 'The deck clicks to a stop. She peels the label off the tape and sticks it back on.' } },
        { who: 'wanqing', text: { zh: '周四那期，我想从头播到尾。一次就好。', en: 'Thursday\'s show, I want to do it start to finish. Just once.' } },
      ],
      unsaid: { zh: '是谁重录的。', en: 'Who recorded over it.' },
    },
    {
      id: 'wq-blackout', who: 'wanqing', kind: 'reveal', motif: 'on-air',
      title: { zh: '电闸', en: 'The Fuse Box' },
      trigger: { beat: 'radio-keeper' },
      // 她早知道喇叭不响（秘密、天台那一幕都这么说）；这一幕揭开的是「楼下其实有一个人在听」
      staging: { zh: '停电的广播站，雷声，应急灯是唯一的光。手电光从楼道一级一级照上来，高大爷咳了两声才进门，钥匙串叮当响。他查完电路，随口说了一句，然后发现自己说多了。晚晴不意外喇叭的事，意外的是他。反应要轻：先愣住，再笑一下。', en: 'The booth in the blackout, thunder, the emergency light the only light. A flashlight beam climbs the stairs step by step; Old Gao clears his throat twice before he comes in, keys jingling. He checks the wiring, says one thing in passing, and realizes he has said too much. Wanqing is not surprised about the loudspeakers; she is surprised about him. Keep it small: she freezes, then smiles.' },
      lines: [
        { who: 'laogao', text: { zh: '咳，咳。线没事，是总闸跳了。……喇叭那根你们别惦记，十点我就拉了。', en: 'Ahem. Ahem. Wiring\'s fine, the main tripped. ...Don\'t worry about the loudspeaker line. I pull it at ten.' } },
        { who: 'wanqing', text: { zh: '我知道。', en: 'I know.' } },
        { who: 'laogao', text: { zh: '……那你上周三放的那首，后半段跳带了。', en: '...That song you played last Wednesday. The second half skipped.' } },
        { who: 'narration', text: { zh: '应急灯嗡了一声。她抬起头，看着这个每晚十点拉闸的人。', en: 'The emergency light hums. She looks up at the man who pulls the switch at ten every night.' } },
        { who: 'wanqing', text: { zh: '高大爷，你……听见了？', en: 'Mr. Gao... you heard it?' } },
        { who: 'narration', text: { zh: '高大爷咳了两声，没回答，把钥匙串攥在手里，不让它响。', en: 'Old Gao coughs twice and doesn\'t answer. He closes his hand around the keys so they won\'t jingle.' } },
      ],
      unsaid: { zh: '他听了一整个学期。', en: 'That he has listened all term.' },
    },
    {
      id: 'wq-roof', who: 'wanqing', kind: 'confession', motif: 'soda',
      title: { zh: '信号最好的地方', en: 'Best Reception Around' },
      // 天台只在夜里开，第 3、4 夜都是固定事件，所以不能要求停电夜之后：只能落在第 1、2 夜
      trigger: { minStage: 3, places: ['roof'], alone: true },
      staging: { zh: '夜里的老楼天台，晾着的拖把，远处县城的灯。她带了两瓶橘子汽水，自己那瓶没开。生锈的喇叭朝着操场，不响。她先说节目的事，绕了很久才说到「另一头」。说的时候不看「我」，看着远处——也像看着屏幕外面。', en: 'The old building\'s roof at night, mops drying, the lights of the county town in the distance. She brought two bottles of orange soda and leaves her own unopened. The rusty loudspeaker faces the field, silent. She talks about the show for a long time before she gets to "the other end". She does not look at me while she says it; she looks into the distance, and also, somehow, out of the screen.' },
      lines: [
        { who: 'wanqing', text: { zh: '你知道这上面为什么信号最好吗。因为离哪儿都远。', en: 'Know why reception\'s best up here? Because it\'s far from everything.' } },
        { who: 'wanqing', text: { zh: '那个节目，我一直不是播给学校听的。', en: 'That show. I was never doing it for the school.' } },
        { who: 'me', text: { zh: '那是给谁？', en: 'Then who for?' } },
        { who: 'wanqing', text: { zh: '给另一头。有个人会回来听。同一期，听好多遍。', en: 'The other end. Someone comes back to listen. The same episode, over and over.' } },
        { who: 'narration', text: { zh: '她把没开的那瓶汽水放在栏杆上，瓶身朝着远处。', en: 'She sets the unopened soda on the railing, the bottle facing the distance.' } },
        { who: 'wanqing', text: { zh: '停播以后，我怕那个人就听不到了。', en: 'After sign-off, I\'m scared that person won\'t be able to hear anymore.' } },
      ],
      unsaid: { zh: '「你是不是就是那个人」', en: '"Are you that person?"' },
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
    { id: 'fb-drafted', who: 'me', trigger: {}, text: { zh: '周一早读，班主任敲敲「我」的桌子：「你嗓门小，正好，去广播站帮几天忙，别添乱。」', en: 'Monday morning reading period, my homeroom teacher taps my desk: "You\'re quiet, good. Go help at the radio booth for a few days. Don\'t make trouble."' } },
    { id: 'fb-duty-room', who: 'laogao', trigger: { after: ['beat:radio-keeper'] }, text: { zh: '值班室，一杯泡开的浓茶，窗户留着一条缝。十点拉完闸，高大爷没关收音机，也没开，就坐着，等楼上的声音漏下来。', en: 'The duty room: a mug of strong tea, the window left open a crack. After pulling the switch at ten, Old Gao leaves his own radio alone, neither on nor off. He just sits and waits for the voice upstairs to leak down.' } },
    { id: 'fb-same-day', who: 'wanqing', trigger: { minStage: 3 }, text: { zh: '某个她说不清是哪一天的傍晚：同一颗篮球砸在同一扇窗户上，楼下同一个人喊「对不起——」，回声转了三圈。她那时就想，这一天是不是过过。', en: 'An evening she can\'t place: the same basketball hits the same window, the same voice below yells "Sorry—", the echo circles three times. Even then she wondered whether this day had already happened.' } },
  ],

  texture: {
    days: [
      { day: 1, weather: { zh: '初冬，傍晚就黑', en: 'early winter, dark by dusk' }, bits: [{ zh: '老楼的楼梯扶手被磨得发亮', en: 'the old stair rail polished by hands' }] },
      { day: 2, weather: { zh: '小雨', en: 'drizzle' }, bits: [{ zh: '广播站的磁带柜上贴着手写的分类', en: 'hand-written labels on the tape cabinet' }] },
      { day: 3, weather: { zh: '停电夜，雷阵雨', en: 'a blackout night, thunderstorms' }, bits: [{ zh: '走廊里有人拿手机当手电', en: 'someone in the hall using a phone as a torch' }] },
      { day: 4, weather: { zh: '晴，冷', en: 'clear, cold' }, bits: [{ zh: '翻修通知贴在楼门口，被风吹掉了一角', en: 'the renovation notice at the door, one corner torn off by the wind' }] },
    ],
    any: [
      { zh: '楼道里一层一层亮起来的声控灯', en: 'motion lights clicking on floor by floor in the stairwell' },
      { zh: '耳机线缠在一起，她解了很久', en: 'headphone cords tangled; she takes ages to unpick them' },
      { zh: '窗外篮球砸地的闷响', en: 'the dull thud of a basketball outside' },
    ],
    places: {
      booth: [{ zh: '隔音棉上插着一支笔', en: 'a pen stuck into the foam soundproofing' }, { zh: '点歌箱的锁坏了，用皮筋捆着', en: 'the request box\'s lock is broken, held shut with a rubber band' }],
      stairs: [{ zh: '楼道的声控灯要拍两下手', en: 'the stair lights need two claps' }],
      court: [{ zh: '篮球架的网只剩一半', en: 'half a net left on the hoop' }],
      shop: [{ zh: '刘婶的收音机永远在两个台之间', en: 'Aunt Liu\'s radio forever between two stations' }],
      roof: [{ zh: '楼顶的喇叭生了锈，朝着操场', en: 'the rusty rooftop speaker facing the sports field' }],
    },
  },

  gags: [
    { id: 'liushen-tab', who: ['liushen'], text: { zh: '刘婶给学生赊账从来不记，问她欠多少，她说「记在天上了」。', en: 'Aunt Liu never writes down student tabs; ask what you owe and she says "it\'s written in the sky."' }, places: ['shop'] },
    { id: 'gao-history', who: ['laogao'], text: { zh: '高大爷讲这栋楼的历史，每次年份都不一样。', en: 'Old Gao tells the building\'s history, with a different year each time.' } },
    { id: 'bulletin', who: ['wanqing'], places: ['booth'], text: { zh: '一点小事她都要用播音腔「插播一条」：汽水打翻了、推子卡住了、临时工又把磁带装反了。', en: 'She announces every small mishap in her broadcast voice: "We interrupt this program"—the soda spilled, a fader stuck, the temp loaded a tape upside down again.' } },
    { id: 'gate-pair', who: ['liushen', 'laogao'], text: { zh: '刘婶和高大爷为谁先在校门口落脚吵了二十年，一个说「我来的时候那棵树还没栽」，一个说「那树是我栽的」。谁也记不清，谁也不让。', en: 'Auntie Liu and Old Gao have argued for twenty years about which of them came to the gate first. One says "the tree wasn\'t even planted when I came", the other says "I planted that tree". Neither remembers, neither gives in.' } },
  ],

  gossip: [
    { id: 'g-liushen', from: 'liushen', about: 'wanqing', truth: 'true', text: { zh: '「半夜收音机里有个小姑娘说『晚上好』，你们都不信。」', en: '"There\'s a girl saying \'good evening\' on my radio at midnight, and none of you believe me."' } },
    { id: 'g-gao', from: 'laogao', about: 'wanqing', truth: 'half', fromDay: 2, text: { zh: '「那娃的节目……咳，我是说，十点就该断电了。」', en: '"That kid\'s show... ahem. I mean, power\'s off at ten."' } },
    { id: 'g-liu-gao', from: 'liushen', about: 'laogao', truth: 'half', after: ['beat:radio-keeper'], text: { zh: '「老高那值班室，半夜十一点窗户还开着缝。冬天哎，也不怕冻着。」', en: '"Old Gao\'s duty room, the window\'s still open a crack at eleven at night. In winter! Not afraid of catching cold."' } },
    { id: 'g-gao-liu', from: 'laogao', about: 'liushen', truth: 'true', text: { zh: '「她那台收音机，比这栋楼岁数还大。……咳，差不多大。」', en: '"That radio of hers is older than this building. ...Ahem. About as old."' } },
    { id: 'g-liu-me', from: 'liushen', about: 'me', truth: 'false', fromDay: 2, text: { zh: '「那个新来的小伙子，天天往四楼跑，我看呐，不是去帮忙的。」', en: '"That new boy runs up to the fourth floor every day. If you ask me, it isn\'t to help."' } },
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
