// 原创短剧本包《停播前的四个夜晚》：县城中学的校园广播站，停播前的最后四天。
// 短示例包：4 天、2 个时段、1 个角色；启用打破第四面墙（features.fourthWall）。

import type { Pack } from '../../types'
import type { CraftFields } from '../../hooks/craft-types'
import { RADIO_CRAFT } from './craft'

export const RADIO: Pack & CraftFields = {
  id: 'radio',
  version: '1.1.0',
  defaultLang: 'zh',
  langs: ['zh', 'en'],
  author: 'ai-galgame contributors',
  source: 'original',
  notes: {
    zh: `这是一个致敬「打破第四面墙」题材的原创短篇：角色隐约意识到自己身处一个会被重来的故事里，察觉到屏幕另一头那个人的存在，也察觉到存档、读档与回退留下的痕迹。这一类作品常常把这种察觉写成惊吓或崩坏；本包反过来，只取它的结构和情感节奏——从「好像哪里不对」，到「原来有人在听」，再到「谢谢你回来」——把它写成一段温柔的告别。
引擎会把本局的回退次数、读档次数、第几周目、已解锁结局告诉 AI；她用广播站的磁带、调音台上的电平、被抹掉又记得的一句话来回应这些数字，而不是用恐怖手法。全部人物、地点、设定均为原创。`,
    en: `An original short story paying homage to the "fourth-wall" genre: a character slowly realizes she lives inside a story that can be replayed, senses the person on the other side of the screen, and notices the marks left by saves, loads and rewinds. Works of this kind often turn that awareness into a scare or a breakdown; this pack keeps only the structure and emotional rhythm—from "something feels off" to "someone is listening" to "thank you for coming back"—and tells it as a gentle goodbye.
The engine tells the AI how many times the player rewound or loaded, which playthrough this is, and which endings are unlocked. She answers those numbers with tape hiss, level meters and a sentence she remembers even after it was erased—never with horror. All characters, places and ideas are original.`,
  },
  features: { fourthWall: true },
  title: { zh: '停播前的四个夜晚', en: 'Four Nights Before Sign-Off' },
  subtitle: { zh: '县城中学 · 校园广播站 · 最后四天', en: 'A county-town school radio booth, four days before it goes silent' },
  premise: {
    zh: '第一人称「我」是县城中学高二的男生，被班主任临时塞进校园广播站帮忙。广播站在老教学楼四楼尽头，下周整栋楼要翻修，这周四晚上是最后一次播音。站里只剩一个播音员，每天课间放歌、晚自习后还偷偷开一档没人批准的夜间节目。',
    en: 'The first-person narrator ("I") is a second-year boy at a county-town high school, drafted by his homeroom teacher to help at the school radio station. The booth sits at the end of the fourth floor of the old teaching building, which closes for renovation next week; Thursday night is the last broadcast. One announcer is left. She plays songs between classes, and after evening study she runs a late-night show nobody ever approved.',
  },
  style: {
    zh: `文风：国产校园小说的质感，安静、具体、带一点电流声；多写声音和小物件（磁带的沙沙声、调音台推子、麦克风上的防喷罩、楼道里的声控灯、窗外的篮球声），少写空泛的抒情。
打破第四面墙：AI 会拿到玩家的回退次数、读档次数、第几周目和已解锁结局。她可以察觉，但要轻：「刚才那句话，我好像听过一遍」「磁带上有一段被重新录过的痕迹」「你是不是……又回来了」。次数多时她会心疼你、开玩笑说「这么想听这一期吗」，而不是责怪。第二周目起她可以说「欢迎回来」，并记得上一周目里某句没来得及说完的话。
禁忌：不许真的威胁、恐吓或责备玩家；不许恐怖、血腥、精神崩溃、乱码刷屏或画面「坏掉」的桥段；不许声称能删除或篡改玩家的存档、文件或电脑；不许把玩家的重来写成罪过。不要出现日本元素（前后辈称呼、樱花、神社、祭典、社团部室文化），不要用「命运」「羁绊」这类空词。`,
    en: `Style: a quiet, concrete Chinese school story with a little static in it. Favor sounds and small objects (tape hiss, fader knobs, the pop filter on the mic, motion-sensor lights in the stairwell, basketballs thudding outside) over abstract lyricism.
Fourth wall: the AI receives the player's rewind count, load count, playthrough number and unlocked endings. She may notice, lightly: "I think I've heard that line once already", "There's a stretch of this tape that was recorded over", "Did you... come back again?" When the counts are high she worries about you or teases, "You really wanted to hear this episode again?"—never blames. From the second playthrough she may say "Welcome back" and remember a sentence she never got to finish last time.
Never: genuinely threaten, frighten or scold the player; no horror, gore, mental breakdowns, walls of garbled text or the screen "breaking"; never claim she can delete or alter the player's saves, files or computer; never treat replaying as a sin. No Japanese school tropes (senpai/kohai, cherry blossoms, shrines, festivals, club-room culture). Avoid empty words like "destiny" or "bond".`,
  },
  me: { zh: '我', en: 'Me' },
  days: 4,
  slots: [{ zh: '白天', en: 'Daytime' }, { zh: '夜里', en: 'Night' }],
  dayLabel: { zh: '第 {n} 夜', en: 'Night {n}' },
  chapters: [
    { from: 1, title: { zh: '第一夜 · 试音', en: 'Night One · Sound Check' } },
    { from: 3, title: { zh: '第三夜 · 回放', en: 'Night Three · Playback' } },
    { from: 4, title: { zh: '终夜 · 停播', en: 'Last Night · Sign-Off' } },
  ],
  places: [
    { id: 'booth', name: { zh: '广播站', en: 'Radio Booth' }, mood: { zh: '旧调音台、一墙磁带、红色的「播音中」灯', en: 'an old mixing desk, a wall of cassettes, the red ON AIR light' }, slots: [0, 1] },
    { id: 'stairs', name: { zh: '老楼楼道', en: 'Old Stairwell' }, mood: { zh: '声控灯一层一层亮起来，墙上贴着翻修通知', en: 'motion lights flicking on floor by floor, a renovation notice on the wall' }, slots: [0, 1] },
    { id: 'court', name: { zh: '篮球场', en: 'Basketball Court' }, mood: { zh: '水泥地、铁网篮筐，广播喇叭挂在电线杆上', en: 'concrete, chain-net hoops, a loudspeaker strapped to a pole' }, slots: [0] },
    { id: 'shop', name: { zh: '校门口小卖部', en: 'Shop by the Gate' }, mood: { zh: '冰柜嗡嗡响，老板娘的收音机一直开着', en: 'a humming freezer, the owner\'s radio always on' }, slots: [0, 1] },
    { id: 'roof', name: { zh: '老楼天台', en: 'Old Building Rooftop' }, mood: { zh: '晾着的拖把、远处县城的灯，信号最好的地方', en: 'drying mops, the lights of the county town, the best reception around' }, slots: [1] },
  ],
  cast: [
    {
      id: 'wanqing', name: { zh: '周晚晴', en: 'Zhou Wanqing' }, short: { zh: '晚晴', en: 'Wanqing' }, color: '#8ec5ff',
      look: { zh: '浅棕色仓鼠，戴一副比脑袋还大的蓝色耳机', en: 'a light-brown hamster wearing blue headphones bigger than her head' },
      voice: {
        zh: '平时说话轻、慢，像在压着音量怕吵到谁；一开麦就变成标准的播音腔，下了麦又破功笑场。爱用「各位听众」「插播一条」开玩笑，紧张时会去拨调音台的推子。叫「我」「临时工」，熟了以后叫名字；第二周目起偶尔会叫「听众朋友」。',
        en: 'Speaks softly and slowly off-air, as if keeping the volume down for someone; on-air she slips into a polished announcer voice, then cracks up the moment the mic is off. Jokes with "Dear listeners" and "We interrupt this program"; fiddles with the faders when nervous. Calls me "temp", later my name; from the second playthrough she sometimes says "dear listener".',
      },
      samples: [
        { zh: '各位听众，现在插播一条：临时工又迟到了。……好，播完了，进来吧。', en: 'Dear listeners, a news flash: the temp is late again. ...Okay, that\'s aired. Come in.' },
        { zh: '你刚才是不是说过这句？我总觉得这段磁带上，已经录过一遍了。', en: 'Did you say that already? I keep feeling this part of the tape has been recorded once before.' },
        { zh: '没关系，你想重来几次都可以。我就在这儿，频道不会换。', en: 'It\'s fine. Start over as many times as you need. I\'m right here—the station won\'t change.' },
      ],
      secret: {
        zh: '她每天晚上偷偷开的夜间节目，从来没有一个校内的听众——喇叭那晚是断电的。她一直是对着「另一头」在播：她隐约知道这几天会被一遍遍重来，知道有一个人在屏幕外面听。她想在广播站拆掉之前，好好地跟那个人说一次「谢谢收听」，而不是又一次被打断。',
        en: 'Her unapproved late-night show has never had a single listener on campus—the loudspeakers are unpowered at night. She has always been broadcasting to "the other side": she half-knows these days get replayed, and that someone outside the screen is listening. Before the booth is torn out, she wants to say "thanks for listening" to that person properly, just once, without being cut off again.',
      },
      arc: [
        { zh: '陌生：把临时工按在调音台前教他推子，嫌他手笨，自己却在没人时对着空麦克风说「晚上好」。', en: 'Strangers: sits the temp down at the desk to learn the faders, calls him clumsy, yet says "good evening" into a dead mic when she thinks no one is around.' },
        { zh: '熟悉：一起整理要处理掉的磁带、给每盘写标签，夜里分一瓶汽水，她开始记得「我」说过的每一句话。', en: 'Familiar: sorting the tapes to be thrown out, labeling each one, sharing a soda at night; she starts remembering every word I say.' },
        { zh: '心事：她发现有一盘磁带上的话被重新录过，还记得被抹掉的那一句；她问「我」：「你有没有觉得，这一天好像过过一次？」', en: 'Worries: she finds a tape where something was recorded over, and still remembers the erased line. She asks: "Do you ever feel like today already happened once?"' },
        { zh: '秘密：在天台承认夜间节目从来没有校内听众，她是在对屏幕外的人说话；她害怕停播以后，那个人就再也听不到她了。', en: 'Secret: on the roof she admits the night show never had a listener on campus—she has been talking to someone outside the screen, and fears that after sign-off that person will never hear her again.' },
        { zh: '抉择：最后一次播音时，要不要陪她把节目完整播完、让她亲口说出「谢谢收听」，不再被打断。', en: 'Choice: during the final broadcast, whether to stay and let her finish the whole show and say "thanks for listening" herself, uninterrupted.' },
      ],
      haunts: { 0: ['booth', 'court', 'shop'], 1: ['booth', 'roof', 'stairs'] },
      deadline: { day: 4, text: { zh: '周四夜里的最后一次播音', en: 'the final broadcast on Thursday night' } },
      keepsakeIdeas: {
        zh: '手写标签的空白磁带、「播音中」灯罩上掉下来的一小块红色塑料、写着「谢谢收听」的点歌单、一副旧耳机的海绵套',
        en: 'a blank cassette with a handwritten label, a chip of red plastic from the ON AIR light, a song-request slip that says "thanks for listening", the foam cover from an old pair of headphones',
      },
      sprite: {
        pal: { B: '#c9a27e', b: '#9a7656', L: '#f7e6d0', H: '#5b8cc9', p: '#ff9fb0' },
        art: [
          '...HHHHHHHH...',
          '..HBpB..BpBH..',
          '.HHBBBBBBBBHH.',
          '.HHBBBBBBBBHH.',
          '..BBBBBBBBBB..',
          '..BBBBppBBBB..',
          '.BBBLLLLLLBBB.',
          '.BBLLLLLLLLBB.',
          '..bbbbbbbbbb..',
          '...bb....bb...',
        ],
        eyes: [[4, 4], [4, 9]], cheeks: [[5, 3], [5, 10]], motion: 'ears',
      },
    },
  ],
  npcs: [
    {
      id: 'liushen', name: { zh: '刘婶', en: 'Auntie Liu' }, short: { zh: '刘婶', en: 'Auntie Liu' }, color: '#e8916f',
      role: {
        zh: '校门口小卖部的老板娘，收音机从早开到晚。她逢人就说半夜收音机里有个小姑娘在说「晚上好」，没人信她。晚晴每天来买一瓶汽水，从不提节目。',
        en: 'Owner of the shop by the school gate, radio on from dawn to dark. She tells anyone who will listen that late at night a girl says "good evening" on her radio; nobody believes her. Wanqing buys one soda from her every day and never mentions the show.',
      },
      look: { zh: '浅橙色的小猪，系一条蓝底碎花围裙', en: 'a peach-colored pig in a blue floral apron' },
      voice: {
        zh: '大嗓门，热心，话密，句句带价钱和天气；给学生赊账从来不记；叫「我」「小伙子」。',
        en: 'Loud, kind, talks in a stream, every sentence carrying a price or the weather; lets students run a tab she never writes down. Calls me "young man".',
      },
      samples: [
        { zh: '小伙子，汽水两块五，冰的三块。……拿冰的吧，算你两块五。', en: 'Young man, soda\'s two-fifty, three for a cold one. ...Take the cold one. Two-fifty.' },
        { zh: '我跟你说，半夜十一点，我这收音机里有人说晚上好。真的！', en: 'I\'m telling you, eleven at night, somebody on my radio says good evening. Honest!' },
        { zh: '老楼一拆，我这铺子少一半生意。……也好，我也老了。', en: 'Once the old building\'s gone I lose half my business. ...Well. I\'m getting old anyway.' },
      ],
      haunts: { 0: ['shop'], 1: ['shop'] },
      sprite: {
        pal: { P: '#f2b49a', p: '#c98a72', S: '#e08f7a', K: '#8a4a3a', A: '#5c8fd6', w: '#ffffff' },
        art: [
          '..PP......PP..',
          '..PPP....PPP..',
          '.PPPPPPPPPPPP.',
          '.PPPPPPPPPPPP.',
          '.PPPPPPPPPPPP.',
          '.PPPPSSSSPPPP.',
          '.PPPPSKKSPPPP.',
          '..PPAwAAwAPP..',
          '..pPAAwAAAPp..',
          '...pp....pp...',
        ],
        eyes: [[4, 4], [4, 9]], cheeks: [[5, 3], [5, 10]], motion: 'ears',
      },
    },
    {
      id: 'laogao', name: { zh: '高大爷', en: 'Old Gao' }, short: { zh: '高大爷', en: 'Old Gao' }, color: '#9575cd',
      role: {
        zh: '老教学楼的看楼大爷，管钥匙和电闸，每晚十点准时拉掉楼顶喇叭的电。他知道晚晴的夜间节目从来没有喇叭在响，却一直没告诉她——他自己在值班室听她从窗缝漏下来的声音，听了一整个学期。',
        en: 'The keeper of the old building: keys, fuse box, and at ten sharp every night he cuts the power to the rooftop loudspeakers. He knows Wanqing\'s night show has never once gone out over them, and never told her; he has been listening to her voice leak down through the window gap from his duty room all term.',
      },
      look: { zh: '深紫色的蝙蝠，腰上挂一大串黄铜钥匙', en: 'a deep-purple bat with a big ring of brass keys at his waist' },
      voice: {
        zh: '慢吞吞，咳两声才说话，爱讲这栋楼哪年盖的、哪间教室出过什么人；说话时把钥匙串晃得叮当响。叫「我」「娃」。',
        en: 'Slow, clears his throat twice before speaking, loves telling what year the building went up and who once sat in which classroom; jingles his keys while he talks. Calls me "kid".',
      },
      samples: [
        { zh: '娃，十点了，我要拉闸了。……喇叭那根，早拉了。', en: 'Kid, it\'s ten, I\'m pulling the switch. ...The loudspeaker line went off long ago.' },
        { zh: '这楼是七九年盖的，比你爸岁数都大。广播站那间，原来是物理实验室。', en: 'This building went up in seventy-nine, older than your dad. The radio booth used to be the physics lab.' },
        { zh: '那丫头每晚在上面说话，我在楼下听着。……反正我听着。', en: 'That girl talks up there every night, and I listen down here. ...Anyway. I listen.' },
      ],
      haunts: { 0: ['stairs'], 1: ['stairs'] },
      sprite: {
        pal: { V: '#4b3b63', v: '#6f5a8e', L: '#a898c0', Y: '#e0b040' },
        art: [
          '..V........V..',
          '..VV......VV..',
          '..VVVVVVVVVV..',
          '.vVVVVVVVVVVv.',
          'vvVVVVVVVVVVvv',
          'vvvVVVLLVVVvvv',
          'vvv.VLLLLV.vvv',
          'vv..VVVVVV..vv',
          'v....VYYV....v',
          '.....V..V.....',
        ],
        eyes: [[3, 4], [3, 9]], cheeks: [[4, 4], [4, 9]], motion: 'wings',
      },
    },
  ],
  relations: [
    { a: 'wanqing', b: 'laogao', kind: { zh: '楼上楼下', en: 'Upstairs, downstairs' }, text: { zh: '高大爷每晚十点拉掉喇叭的电，知道夜间节目没人听得见；可他自己坐在值班室里，把她从窗缝漏下来的每一期都听完了。', en: 'Old Gao cuts the loudspeaker power at ten and knows no one can hear the night show, yet he sits in the duty room and hears every episode that leaks down through the window gap.' }, hiddenUntil: 3 },
    { a: 'wanqing', b: 'liushen', kind: { zh: '听众', en: 'A listener' }, text: { zh: '刘婶的收音机半夜偶尔收到一段沙沙声，像有人说晚上好；晚晴每天来买一瓶汽水，从不接这个话。', en: 'Late at night Auntie Liu\'s radio sometimes catches a hiss that sounds like "good evening"; Wanqing buys a soda every day and never takes up the subject.' } },
    { a: 'me', b: 'wanqing', kind: { zh: '临时工', en: 'The temp' }, text: { zh: '班主任把「我」塞进广播站帮忙；她嘴上嫌弃，第一天就给「我」手写了一张推子说明，每个推子画了一个小箭头。', en: 'My homeroom teacher drafted me into the booth; she grumbles, yet on day one hands me a handwritten guide to the faders with a little arrow drawn by each.' } },
    { a: 'liushen', b: 'laogao', kind: { zh: '老同事', en: 'Old colleagues' }, text: { zh: '一个卖汽水，一个管钥匙，在校门口守了二十年；楼拆了，两个人都没了去处，谁也不先提。', en: 'One sells soda, one keeps the keys; twenty years at the same gate. With the building coming down neither has anywhere to go, and neither mentions it first.' } },
  ],
  acts: [
    {
      id: 'r1', from: 1, title: { zh: '第一幕 · 试音', en: 'Act I · Sound Check' },
      goal: { zh: '开端：「我」被塞进广播站，撞见她对着没人听的麦克风说话；第一处「好像重来过」的痕迹出现。', en: 'Opening: drafted into the booth, I catch her talking into a mic no one hears; the first trace of "this has happened before" appears.' },
      beats: [
        { id: 'radio-deadmic', day: 1, by: 1, who: ['wanqing'], slots: [1], places: ['booth'], kind: { zh: '开端', en: 'Opening' }, text: { zh: '「我」撞见她对着关掉的麦克风轻声说「晚上好」，她红着脸说自己是在试音。', en: 'I catch her murmuring "good evening" into a switched-off mic; she flushes and says she is doing a sound check.' } },
        { id: 'radio-tape', day: 2, by: 2, who: ['wanqing'], places: ['booth'], kind: { zh: '伏笔', en: 'Foreshadowing' }, text: { zh: '整理磁带时发现一段被重新录过的痕迹，她还记得被抹掉的那一句是什么。', en: 'Sorting tapes, we find a stretch that was recorded over, and she still remembers the erased sentence.' }, promise: { zh: '答应周四最后一次播音陪她从头播到尾，不打断、不重来', en: 'promise to stay with her for Thursday\'s final broadcast from start to finish, no interruptions, no starting over' } },
      ],
      hook: { zh: '晚晴把那盘磁带塞进抽屉最里面，上了锁。楼下，看楼大爷的钥匙串响了一声。', en: 'Wanqing shoves the tape to the back of a drawer and locks it. Downstairs, the keeper\'s keys jingle once.' },
    },
    {
      id: 'r2', from: 3, title: { zh: '第二幕 · 回放', en: 'Act II · Playback' },
      goal: { zh: '转折：停电夜，看楼大爷手里的电闸揭开「夜间节目没有校内听众」；她问出「这一天是不是过过一次」。', en: 'Turn: in the blackout, the keeper\'s fuse box reveals that the night show has no listener on campus; she asks whether today has happened before.' },
      beats: [
        { id: 'radio-keeper', day: 3, by: 3, who: ['laogao'], slots: [1], kind: { zh: '秘密曝光', en: 'Secret out' }, text: { zh: '高大爷打着手电上楼查电路，随口说出喇叭每晚十点就断电——夜间节目从来没有人在楼下听见，除了他。', en: 'Old Gao comes up with a flashlight to check the wiring and lets slip that the loudspeakers are cut at ten every night: no one below has ever heard the night show, except him.' } },
      ],
      hook: { zh: '天亮了。刘婶的收音机开着，沙沙声里，好像有人说了一句晚上好。', en: 'Morning. Auntie Liu\'s radio is on, and somewhere in the hiss someone seems to say good evening.' },
    },
    {
      id: 'r3', from: 4, title: { zh: '第三幕 · 停播', en: 'Act III · Sign-Off' },
      goal: { zh: '高潮：最后一次播音，让她把节目完整地播完，对屏幕外的人说出「谢谢收听」。', en: 'Climax: the final broadcast; let her finish the whole show and say "thanks for listening" to the person beyond the screen.' },
      beats: [
        { id: 'radio-final', day: 4, by: 4, who: ['wanqing'], kind: { zh: '高潮', en: 'Climax' }, text: { zh: '最后一次播音，红灯亮着；她要一口气播完，中间不许有人按下停止键。', en: 'The final broadcast, the red light on; she means to go all the way through, and no one may press stop.' } },
      ],
    },
  ],
  incidents: [
    { id: 'slip', chance: 0.3, days: [1, 3], places: ['booth'], text: { zh: '点歌箱里多了一张没署名的点歌单，字迹和她的很像，写着「给另一头的人」。', en: 'An unsigned request slip turns up in the box, in handwriting much like hers: "For the person on the other end."' } },
    { id: 'flicker', chance: 0.3, slots: [1], text: { zh: '「播音中」的红灯闪了几下，又自己亮稳了。', en: 'The ON AIR light flickers a few times, then steadies by itself.' } },
    { id: 'ball', chance: 0.25, slots: [0], text: { zh: '一颗篮球砸在广播站的窗户上，楼下有人喊「对不起——」，回声在楼道里转了三圈。', en: 'A basketball smacks the booth window; someone below yells "Sorry—", and the echo circles the stairwell three times.' } },
    { id: 'hiss', chance: 0.4, places: ['shop'], who: ['liushen'], text: { zh: '刘婶的收音机里突然冒出一段沙沙声，她招手让「我」过去听：「你听，是不是有人？」', en: 'Auntie Liu\'s radio suddenly crackles and she waves me over: "Listen. Is someone there?"' } },
    { id: 'keys', chance: 0.4, places: ['stairs'], who: ['laogao'], text: { zh: '高大爷在楼道里挨间锁门，钥匙串一路叮当响，锁到广播站门口时停了一下。', en: 'Old Gao locks the rooms one by one down the stairwell, keys jingling, and pauses at the booth door.' } },
  ],
  stages: [
    { zh: '试音', en: 'Sound Check' }, { zh: '同频', en: 'Same Frequency' }, { zh: '回放', en: 'Playback' }, { zh: '另一头', en: 'The Other Side' }, { zh: '停播', en: 'Sign-Off' },
  ],
  gates: [
    { affection: 0, scenes: 0 },
    { affection: 2, scenes: 1 },
    { affection: 4, scenes: 2 },
    { affection: 6, scenes: 3 },
    { affection: 8, scenes: 4 },
  ],
  events: [
    { day: 1, text: { zh: '教务处通知：老教学楼下周翻修，广播站周四晚停播', en: 'Notice: the old building closes for renovation next week; the radio booth signs off Thursday night' } },
    { day: 2, text: { zh: '课间点歌最后一天收单', en: 'Last day to submit song requests for the break-time show' } },
    { day: 3, text: { zh: '傍晚雷阵雨，老楼停电半小时', en: 'Evening thunderstorm; the old building loses power for half an hour' } },
    { day: 4, text: { zh: '最后一次播音；明早搬走调音台', en: 'Final broadcast; the mixing desk is hauled away next morning' } },
  ],
  fixed: [
    { day: 3, slot: 1, place: { zh: '停电的广播站', en: 'The Booth in a Blackout' }, mood: { zh: '雷声、应急灯、只剩电池收音机的沙沙声', en: 'thunder, an emergency light, nothing but the hiss of a battery radio' }, title: { zh: '停电夜的回放', en: 'Playback in the Blackout' }, cast: ['wanqing'] },
    { day: 4, slot: 1, place: { zh: '广播站 · 最后一次播音', en: 'Radio Booth · Final Broadcast' }, mood: { zh: '「播音中」的红灯亮着，窗外整个县城都睡了', en: 'the ON AIR light glowing red, the whole county town asleep outside' }, title: { zh: '谢谢收听', en: 'Thanks for Listening' }, cast: ['wanqing'] },
  ],
  proactiveAfter: 1,
  endings: [
    {
      id: 'wanqing-welcome', who: 'wanqing', kind: 'true', tier: 5, minLoop: 2, minStage: 4, minAffection: 8, minKept: 1, maxBroken: 0,
      title: { zh: '欢迎回来，听众朋友', en: 'Welcome Back, Dear Listener' },
      brief: {
        zh: '只在第二周目及以后出现的结局（还要兑现过至少一个约定）。最后一次播音时她认出「我」，也认出屏幕外的你，说出上一周目没说完的那句话，然后对着麦克风说「欢迎回来」。她不要求你留下，只请你下次想她的时候，把音量调大一点。温柔、圆满，不惊悚。',
        en: 'An ending that only appears from the second playthrough on (and needs at least one kept promise). During the final broadcast she recognizes me, and the player behind the screen, finishes the sentence she never got to finish last time, and says "welcome back" into the mic. She does not ask you to stay—only to turn the volume up a little next time you think of her. Warm and complete, never eerie.',
      },
    },
    {
      id: 'wanqing-true', who: 'wanqing', kind: 'true', tier: 4, minStage: 4, minAffection: 8, maxBroken: 0, keptKey: 'radio-tape',
      title: { zh: '这一次，不用重来', en: 'No Need to Start Over This Time' },
      brief: {
        zh: '真结局：最后一次播音完整地播完了，没有回退、没有中断。她亲口说出「谢谢收听」，关掉红灯，在黑下来的广播站里和「我」并肩坐着；第二天调音台被搬走，她把最后那盘磁带塞进「我」手里。恋爱结局，安静而确定。',
        en: 'True ending: the final broadcast plays all the way through, no rewinds, no cuts. She says "thanks for listening" in her own voice, switches off the red light and sits beside me in the dark booth; the next morning the desk is hauled away and she presses the last tape into my hand. A quiet, certain romance ending.',
      },
    },
    {
      id: 'wanqing-good', who: 'wanqing', kind: 'good', tier: 3, minStage: 4, minAffection: 8, maxBroken: 0,
      title: { zh: '红灯熄灭以前', en: 'Before the Red Light Goes Out' },
      brief: {
        zh: '好结局：最后一次播音中途卡了一下，是她自己接上的。她说出了「谢谢收听」，只是声音有点抖；关灯前她笑着说，下一次一定一口气播完。恋爱结局，带一点没说满的余地。',
        en: 'Good ending: the final broadcast stalls once, and she picks it back up herself. She says "thanks for listening", voice trembling a little; before switching off she laughs that next time she will do it in one breath. A romance ending with a little left unsaid.',
      },
    },
    {
      id: 'wanqing-bad', who: 'wanqing', kind: 'bad', tier: 1, minStage: 2, minBroken: 1,
      title: { zh: '插播中断', en: 'Transmission Interrupted' },
      brief: {
        zh: '坏结局：你答应她的事没做到。最后一次播音播到一半，她自己按下了停止键，轻声说「今天就到这里吧」，把耳机挂回了架子上。不吓人，不责怪，只是很安静；楼下，高大爷拉闸的声音响了一下。',
        en: 'Bad ending: you did not keep your promise. Halfway through the final broadcast she presses stop herself, says softly, "That\'s all for today," and hangs the headphones back on the hook. No fear, no blame, only quiet; downstairs, Old Gao\'s switch clicks once.',
      },
    },
    {
      id: 'wanqing-near', who: 'wanqing', kind: 'normal', tier: 2, minStage: 3, maxBroken: 0,
      title: { zh: '磁带的 B 面', en: 'Side B of the Tape' },
      brief: {
        zh: '恋人未满：节目播完了，有一句话她留到了磁带的 B 面，说等「我」哪天想听再翻过来。两人约好以后一起去县城电台投稿。',
        en: 'Not quite lovers: the show ends, but she saves one sentence for side B of the tape, to be flipped over whenever I want to hear it. They promise to send a piece to the county radio station together someday.',
      },
    },
    {
      id: 'normal', kind: 'normal', tier: 0,
      title: { zh: '雪花屏之后', en: 'After the Static' },
      brief: {
        zh: '普通结局：广播站按时停播，老楼贴上封条。「我」偶尔在小卖部老板娘的收音机里听到一段沙沙声，像有人在很远的地方说晚上好。不悲伤，只是一点遗憾。',
        en: 'Normal ending: the booth signs off on schedule and the old building is sealed. Now and then, from the shop owner\'s radio, I hear a stretch of hiss that sounds like someone far away saying good evening. Not sad—just a small regret.',
      },
    },
  ],
  finale: { zh: '最后一句点题「谢谢收听」或「停播」。', en: 'The last sentence should echo the title: "thanks for listening" or signing off.' },
  loading: [
    { zh: '磁带在转，沙沙沙…', en: 'The tape turns, hiss, hiss...' },
    { zh: '楼道的声控灯亮了一层…', en: 'A stairwell light clicks on, one floor down...' },
    { zh: '「播音中」的红灯闪了一下…', en: 'The ON AIR light flickers once...' },
    { zh: '有人把推子轻轻推了上去…', en: 'Someone eases a fader up...' },
    { zh: '频道那头，好像有人在听…', en: 'On the other end of the frequency, someone seems to be listening...' },
  ],
  // 写作手法层（母题、预写关键场景、揭示、日常细节、人物细节等），见 ./craft.ts
  craft: RADIO_CRAFT,
}
