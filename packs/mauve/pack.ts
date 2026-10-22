// 改编剧本包《小紫帽》：改编自 bosinpai 的视觉小说 Le Petit Chaperon Mauve / Little Mauve Riding Hood（2015）。
// 原作按 CC BY-SA 4.0 发布；本文件（本目录）是改编作品，同样按 CC BY-SA 4.0 发布，不适用引擎的 MIT 许可。
// 只改编了原作的剧本文本（人物、情节、台词风格）；未使用原作的任何美术、音乐、音效或字体。详见同目录 README.md 与 LICENSE。

import type { Pack } from '../../types'

export const MAUVE: Pack = {
  id: 'mauve',
  version: '1.0.0',
  defaultLang: 'en',
  langs: ['en', 'zh'],
  author: 'ai-galgame contributors',
  source: {
    work: {
      en: 'Le Petit Chaperon Mauve / Little Mauve Riding Hood (2015)',
      zh: '《Le Petit Chaperon Mauve / 小紫帽》（Little Mauve Riding Hood，2015）',
    },
    author: {
      en: 'bosinpai (script); Lady, redgriff (art, not used here)',
      zh: 'bosinpai（剧本）；Lady、redgriff（立绘，本包未使用）',
    },
    license: 'CC BY-SA 4.0',
    adaptation: {
      en: 'Script adapted from the original Ren\'Py script (French text and the author\'s English translation). Changes: the single afternoon is stretched into four days (Wed–Sat) with two time slots; Mom, a voice-only narrator in the original, becomes a full character; trust meters, deadlines, promises and foreshadowing are added (SocialBook posts, Granny\'s unlocked door, the pepper spray "Suzie", the TV box set, Mo\'s glasses); the original four choices and five endings are reworked into seven condition-based endings, including a new ensemble ending; the original "VICTIM" bad ending (assault and death) is replaced by a non-graphic close call; all scenes are written live by AI from this outline; Chinese translation is ours; no original art, music, sound effects or fonts are used — sprites are new block-pixel animals.',
      zh: '据原作 Ren\'Py 剧本（法语原文与作者英译）改编。改动：原作的一个下午拉长为周三到周六四天、每天两个时段；原作只有画外音的妈妈成为正式角色；加入信任值、期限、约定与伏笔（SocialBook 动态、外婆不锁的门、防狼喷雾「苏西」、电视剧全集、阿紫的眼镜）；原作四个选择、五个结局改写为七个按条件触发的结局，新增一个群像结局；原作「受害者」坏结局（侵害与死亡）改为不露骨的「险些出事」；每一幕由 AI 按本骨架实时写出；中文为我们自己的翻译；未使用原作任何美术、音乐、音效、字体，立绘为新画的方块像素小动物。',
    },
    url: 'https://gitlab.com/chaperon_mauve/chaperon_mauve',
    notice: {
      en: 'Adapted from "Le Petit Chaperon Mauve / Little Mauve Riding Hood" (2015) by bosinpai (https://gitlab.com/chaperon_mauve/chaperon_mauve), licensed under CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/); modified by ai-galgame contributors, and this adaptation is released under the same CC BY-SA 4.0 license.',
      zh: '改编自 bosinpai 的《Le Petit Chaperon Mauve / Little Mauve Riding Hood》（2015，https://gitlab.com/chaperon_mauve/chaperon_mauve），原作采用 CC BY-SA 4.0 许可（https://creativecommons.org/licenses/by-sa/4.0/）；本包由 ai-galgame contributors 修改，并以同样的 CC BY-SA 4.0 许可发布。',
    },
  },
  title: { en: 'Little Mauve Riding Hood', zh: '小紫帽' },
  subtitle: {
    en: 'Once upon a time, on Wilson Boulevard · four days, one wolf, zero patience',
    zh: '很久很久以前，在威尔逊大道 · 四天，一只狼，零耐心',
  },
  premise: {
    en: 'The first-person narrator is Mo\' ("Chap\'" in the French original), a fifteen-year-old in a mauve hoodie who is far too old for fairy tales, thank you very much. It is Wednesday in a modern French town. Granny (Margaret Little) has been "stuck in bed" for two days at No. 173 Wilson Boulevard, and Mom keeps sending Mo\' over with an organic rice cake and a little pot of butter. Mo\' narrates her life in SocialBook statuses — including, carelessly, Granny\'s exact address. On the boulevard a smooth stranger, Wolf ("Loup3769"), has started paying her compliments. Saturday evening Mo\' wants to go to a party; Mom says "we\'ll talk about it with your father".',
    zh: '第一人称是阿紫（法语原作里叫 Chap\'，英译叫 Mo\'），十五岁，穿一件紫色连帽衫，自认早就过了听童话的年纪。现代法国小城，周三。外婆（玛格丽特·小）在威尔逊大道 173 号「卧床」两天了，妈妈一直派阿紫送去一块有机米饼和一小罐黄油。阿紫用 SocialBook 动态直播自己的生活——包括随手写出了外婆家的门牌号。大道上，一个嘴很甜的陌生人「狼」（账号 Loup3769）开始夸她。周六晚上阿紫想去一个派对，妈妈说「等你爸回来再说」。',
  },
  style: {
    en: `Style: a comic, modern parody of Perrault's Little Red Riding Hood, in the spirit of the original: eye-rolling teen slang from Mo' ("geez", "you're pushing it", "ain't fair"), SocialBook statuses and hashtags in italics, old-fashioned fairy-tale formulas spoken straight-faced by the grown-ups ("Pull out the peg and the latch will fall"), deadpan narration, slapstick timing, and ending cards in the original's format, e.g. "GOOD ENDING (...well, bad ending for Wolf!)".
Wolf is a manipulator, not a love interest: his flattery ("young, lively, pretty", "parents forgot how to live") should read as a hook the player can learn to spot. Mo' is a minor — no romance or flirtation is reciprocated, no sexual content, no on-screen violence beyond slapstick (pepper spray, a nursing-home van). Danger is implied and defused by the characters' choices, never by a rescuing hunter.
Keep scenes short and punchy. Occasional French phrases are welcome ("'tain", "Mamie", "Il était une fois...") but keep them easy to follow. Granny's weight jokes stay affectionate and brief.`,
    zh: `文风：贝洛童话《小红帽》的现代喜剧戏仿，沿用原作的味道：阿紫满口不耐烦的青少年口语（「烦死了」「你有点过分了啊」「不公平！」），SocialBook 动态和话题标签用斜体，大人一本正经地说老派童话套话（「拉一下门闩，门就开了」），旁白冷面，节奏像短剧和闹剧；结局标题沿用原作格式，如「好结局（……对狼来说是坏结局！）」。
狼是操纵者，不是恋爱对象：他的恭维（「年轻、有活力、漂亮」「家长都忘了怎么活」）要写成玩家能逐渐识破的钩子。阿紫未成年——不回应任何调情，不写性内容，暴力只限闹剧程度（防狼喷雾、养老院的车）。危险只做暗示，由角色自己的选择化解，不靠猎人救场。
每幕短而有梗。可以偶尔夹法语（「'tain」「Mamie」「Il était une fois...」），但要好懂。拿外婆体重开的玩笑要亲昵、点到为止。`,
  },
  me: { en: 'Mo\'', zh: '阿紫' },
  days: 4,
  slots: [{ en: 'Afternoon', zh: '下午' }, { en: 'Evening', zh: '晚上' }],
  dayLabel: { en: 'Day {n}', zh: '第 {n} 天' },
  chapters: [
    { from: 1, title: { en: 'Ch.1 · Once Upon a Time...', zh: '第一章 · 很久很久以前……' } },
    { from: 3, title: { en: 'Ch.2 · Friday on SocialBook', zh: '第二章 · SocialBook 上的周五' } },
    { from: 4, title: { en: 'Finale · 173 Wilson Boulevard', zh: '终章 · 威尔逊大道 173 号' } },
  ],
  places: [
    { id: 'kitchen', name: { en: 'Home Kitchen', zh: '家里厨房' }, mood: { en: 'a basket by the door, a rice cake in cling film, Mom\'s lectures', zh: '门边的篮子、保鲜膜里的米饼、妈妈的唠叨' }, slots: [0, 1] },
    { id: 'boulevard', name: { en: 'Wilson Boulevard', zh: '威尔逊大道' }, mood: { en: 'a long, long walk to No. 173, a phone in hand, traffic and plane trees', zh: '去 173 号的路又长又长，手里一部手机，车流和梧桐' }, slots: [0] },
    { id: 'icecream', name: { en: 'Ice-Cream Kiosk', zh: '冰淇淋小亭' }, mood: { en: 'the "little detour", neon flavors, a bench where people linger', zh: '「绕一小段路」的去处，荧光色口味，一张让人逗留的长椅' }, slots: [0, 1] },
    { id: 'granny', name: { en: 'Granny\'s Room, No. 173', zh: '外婆的房间（173 号）' }, mood: { en: 'lace doilies, a blaring detective series, a Scrabble box, a chair she barely fits in', zh: '蕾丝垫布、开得很响的侦探剧、一盒拼字游戏、一把她快坐不下的椅子' }, slots: [0, 1] },
    { id: 'hallway', name: { en: 'Hallway at No. 173', zh: '173 号的走廊' }, mood: { en: 'name plates on doors ("Margaret Little", first door on the right), a flickering light, footsteps that are not a neighbor\'s', zh: '门上的姓名牌（「玛格丽特·小」，右手第一间），一闪一闪的灯，不像邻居的脚步声' }, slots: [1] },
    { id: 'phone', name: { en: 'SocialBook (my phone, in bed)', zh: 'SocialBook（床上，手机里）' }, mood: { en: 'notifications at midnight, friend requests, statuses typed too fast', zh: '半夜的通知、好友申请、打得太快的动态' }, slots: [1] },
  ],
  cast: [
    {
      id: 'wolf', name: { en: 'Wolf', zh: '狼' }, short: { en: 'Wolf', zh: '狼' }, color: '#d0352f',
      look: { en: 'a grey wolf with a red scarf and a very confident tail', zh: '戴红围巾的灰狼，尾巴摇得非常自信' },
      voice: {
        en: 'Smooth, chummy, all flattery and "young adults like you and me"; asks questions that sound casual but always circle back to where she is going; signs off with "kay?"; calls Mo\' "you" or "pretty" until she objects. Asides in parentheses reveal his real thoughts only in endings.',
        zh: '油滑、自来熟，满嘴恭维和「我们这样的年轻人」；问题听着随口，绕来绕去总回到「你要去哪」；句尾爱加「好吧？」；一直叫阿紫「美女」，直到她反对。他括号里的真实想法只在结局里露出来。',
      },
      samples: [
        { en: 'Hello!', zh: '哈喽！' },
        { en: 'Seeing you frown like that, I bet they made you the family errand-runner again.', zh: '看你皱着眉，我猜家里又让你跑腿了吧。' },
        { en: '"Ajoute-moi sur SocialBook, tu cherches Loup3769." — Add me on SocialBook, look up "Loup3769", kay? I\'ll ping you the details.', zh: '「Ajoute-moi sur SocialBook, tu cherches Loup3769.」——加我 SocialBook，搜「Loup3769」，好吧？我把细节发你。' },
        { en: 'And where exactly is that "farther away"?', zh: '那个「更远的地方」，到底是哪儿？' },
      ],
      secret: {
        en: 'Wolf is no "young adult": he is an older con man who friends teenagers on SocialBook to harvest their grandparents\' addresses. He has already read Mo\'s status about "#173 Wilson Blvd". His plan for Saturday: knock at Granny\'s door as a salesman with a complete detective-series box set, shut her in the wardrobe, put on her nightgown and cucumber slices, and wait in her bed for Mo\'.',
        zh: '狼根本不是什么「年轻人」：他是个老练的骗子，在 SocialBook 上加青少年好友，套出他们爷爷奶奶的住址。他早就看到了阿紫那条「威尔逊大道 173 号」的动态。他周六的计划：装成推销员、拿着侦探剧全集去敲外婆的门，把外婆关进衣柜，穿上她的睡袍、脸上敷黄瓜片，躺在她床上等阿紫。',
      },
      arc: [
        { en: 'Whatever: a stranger on the boulevard says "Hello!" and guesses she has been sent on chores; flattering, a bit too fast.', zh: '无所谓：大道上一个陌生人说「哈喽！」，一眼猜出她被派去跑腿；很会夸人，快得有点过头。' },
        { en: 'Small talk: "parents forgot how to live"; invites her to a Friday party "with friends and their girlfriends" and asks to be added as Loup3769.', zh: '搭话：「家长都忘了怎么活」；邀她周五去一个「哥们和他们女朋友」的派对，要她加 Loup3769。' },
        { en: 'Hunch: his questions keep circling back to "where exactly"; his profile photos look like stock images; he mentions a detail she only ever posted online.', zh: '起疑：他的问题总绕回「到底在哪」；头像像是图库照片；他说出了一个她只在网上发过的细节。' },
        { en: 'Glasses on: Mo\' sees through him — a con man mining SocialBook for addresses, who has already been seen in the hallway at No. 173.', zh: '戴上眼镜：阿紫看穿了他——一个靠 SocialBook 套地址的骗子，已经有人在 173 号走廊见过他。' },
        { en: 'Showdown: in Granny\'s bed with cucumber slices on his face: play along with "Granny", or put on the glasses and make a phone call.', zh: '摊牌：他脸上敷着黄瓜片躺在外婆床上——顺着「外婆」演下去，还是戴上眼镜、打一个电话。' },
      ],
      haunts: { 0: ['boulevard', 'icecream'], 1: ['phone', 'hallway'] },
      deadline: { day: 3, text: { en: 'the Friday party — he wants her to "ping" him before then', zh: '周五的派对——他要她在那之前「戳」他' } },
      keepsakeIdeas: { en: 'a screenshot of the "Loup3769" profile, a party flyer with no address, a grey hair on a red scarf', zh: '「Loup3769」主页截图、一张没写地址的派对传单、红围巾上的一根灰毛' },
      sprite: {
        pal: { G: '#8a8f99', g: '#5f646e', L: '#d9dce2', N: '#222222', R: '#d0352f' },
        art: [
          '.G..........G.',
          '.GG........GG.',
          '.GGGGGGGGGGGG.',
          '.GGGGGGGGGGGG.',
          '.GGGGGGGGGGGG.',
          '..GGGLLLLGGG..',
          '...GLLNNLLG...',
          '...RRRRRRRR...',
          '..gGGGGGGGGg..',
          '..gg......gg..',
        ],
        eyes: [[3, 4], [3, 9]], cheeks: [[4, 3], [4, 10]], motion: 'tail',
      },
    },
    {
      id: 'granny', name: { en: 'Granny (Margaret Little)', zh: '外婆（玛格丽特·小）' }, short: { en: 'Granny', zh: '外婆' }, color: '#b07ab8',
      look: { en: 'a fluffy white sheep with round dark glasses and a mauve shawl', zh: '一只蓬松的白羊，戴圆框深色眼镜，披紫色披肩' },
      voice: {
        en: 'Sweet, old-fashioned, fond of fairy-tale formulas and TV detective plots; giggles "hihi"; fiercely competitive at Scrabble; calls Mo\' "my little one" and "darling".',
        zh: '甜，老派，爱说童话套话、爱聊电视侦探剧情节；笑起来「嘻嘻」；拼字游戏上好胜心极强；叫阿紫「我的小乖」「宝贝」。',
      },
      samples: [
        { en: '"Tire la chevillette, et la bobinette cherra." — Pull out the peg and the latch will fall.', zh: '「Tire la chevillette, et la bobinette cherra.」——拉一下门闩，门就开了。' },
        { en: 'How about a little Scrabble? I bet I\'ll beat you again this time, hihi!', zh: '来盘拼字游戏怎么样？我打赌这回还是我赢，嘻嘻！' },
        { en: 'Double word score!', zh: '双倍词分！' },
      ],
      secret: {
        en: 'Granny is not nearly as bedridden as everyone thinks: she stayed up two nights binge-watching detective series and lets the family believe she is ill so Mo\' will visit. She keeps "Suzie", a faithful little pepper spray, under her pillow, and leaves her door unlocked on purpose because she likes visitors. A charming salesman has phoned her about a box set.',
        zh: '外婆远没有大家以为的那么「卧床不起」：她连熬了两夜追侦探剧，顺水推舟让家里以为她病了，好让阿紫来看她。她枕头底下放着「苏西」——一罐忠心耿耿的小防狼喷雾；门故意不锁，因为她喜欢有人来。最近还有个嘴甜的推销员打电话来，说要卖她一套剧集全集。',
      },
      arc: [
        { en: 'Whatever: "stuck in bed for two days", sweet and dusty; Mo\' visits only because Mom made her.', zh: '无所谓：「卧床两天」，甜得有点老旧；阿紫只是被妈妈逼着来。' },
        { en: 'Small talk: Scrabble with outrageous archaic words; she wins, and teases Mo\' back about her phone.', zh: '搭话：拼字游戏里她用离谱的古词；她赢了，还反过来笑阿紫离不开手机。' },
        { en: 'Hunch: the TV guide is circled all over, she is suspiciously spry, something heavy is under the pillow, and she mentions a salesman\'s phone call.', zh: '起疑：电视节目单上画满了圈，她灵活得可疑，枕头底下有个硬东西，她还提到推销员的电话。' },
        { en: 'Glasses on: she confesses she half-faked the illness to see Mo\', and introduces Suzie.', zh: '戴上眼镜：她承认病有一半是装的，只为见阿紫，并介绍了苏西。' },
        { en: 'Showdown: on Saturday, does Mo\' warn her and plan together — or leave her alone with the "salesman"?', zh: '摊牌：周六，阿紫是提前告诉外婆、一起布局，还是让她一个人面对那位「推销员」？' },
      ],
      haunts: { 0: ['granny'], 1: ['granny', 'hallway'] },
      deadline: { day: 4, text: { en: 'Saturday afternoon: the Scrabble rematch, and the rice cake delivered at last', zh: '周六下午：拼字游戏复仇赛，还有终于送到的米饼' } },
      keepsakeIdeas: { en: 'a Scrabble tile worth 10 points, a crocheted doily, a TV guide with circled crime shows', zh: '一块 10 分的拼字牌、钩针垫布、圈满侦探剧的电视节目单' },
      sprite: {
        pal: { W: '#f2eee6', w: '#cfc8ba', F: '#e8c9a8', K: '#4a4a4a', P: '#b07ab8' },
        art: [
          '...WW.WW.WW...',
          '..WWWWWWWWWW..',
          '.WWWFFFFFFWWW.',
          '.WWKKKFFKKKWW.',
          '.WWFFFFFFFFWW.',
          '.WWWFFwwFFWWW.',
          '..WWWWWWWWWW..',
          '.PPPPPPPPPPPP.',
          '..WWWWWWWWWW..',
          '...ww....ww...',
        ],
        eyes: [[3, 4], [3, 9]], cheeks: [[4, 3], [4, 10]], motion: 'bob',
      },
    },
    {
      id: 'mom', name: { en: 'Mom', zh: '妈妈' }, short: { en: 'Mom', zh: '妈妈' }, color: '#8e6bb0',
      look: { en: 'a mauve rabbit in a white apron, one ear always turned toward the door', zh: '系白围裙的紫色兔子，一只耳朵总朝着门口' },
      voice: {
        en: 'Brisk, dry, starts bedtime stories nobody asked for; never raises her voice, just her eyebrows; "young lady", "we\'ll talk about it with your father"; secretly funny.',
        zh: '利落、冷幽默，总在没人要的时候开讲睡前故事；从不提高嗓门，只挑眉；「小姑娘」「等你爸回来再说」；其实很好笑。',
      },
      samples: [
        { en: '"Il était une fois..." — Once upon a time, in a faraway land...', zh: '「Il était une fois……」——很久很久以前，在一个遥远的国度……' },
        { en: 'Since that\'s how it is, young lady, make yourself useful and take these treats to your grandmother.', zh: '既然这样，小姑娘，做点有用的事，把这些点心给你外婆送去。' },
        { en: 'I don\'t want to hear you badmouth your grandmother. Even if it\'s true.', zh: '我不想听你说外婆的坏话。哪怕是真的。' },
      ],
      secret: {
        en: 'At Mo\'s age Mom was fooled by a sweet-talker herself — that is why she keeps telling the old tale. She and Dad have already agreed to let Mo\' go to Saturday\'s party if Mo\' shows she can be trusted this week; she just doesn\'t know how to say it without sounding like a fairy tale.',
        zh: '妈妈在阿紫这个年纪，自己也被一个嘴甜的人骗过——所以她总讲那个老故事。她和爸爸其实已经说好：只要阿紫这周表现得值得信任，周六的派对就让她去；她只是不知道怎么说出口，才能不像在讲童话。',
      },
      arc: [
        { en: 'Whatever: "Once upon a time..." — "Mooom! I\'m too old for stories!" Sent off with a rice cake and a little pot of butter.', zh: '无所谓：「很久很久以前……」——「妈——！我早过了听故事的年纪！」被打发去送米饼和一小罐黄油。' },
        { en: 'Small talk: kitchen bargaining over chores, homework and Saturday night; neither side blinks.', zh: '搭话：在厨房为家务、作业和周六晚上讨价还价；谁也不让步。' },
        { en: 'Hunch: Mom is oddly worried about strangers on SocialBook and has started reading Mo\'s public posts.', zh: '起疑：妈妈对 SocialBook 上的陌生人担心得反常，开始翻阿紫的公开动态。' },
        { en: 'Glasses on: she admits she was fooled once at Mo\'s age, and that Saturday is not a "no" yet.', zh: '戴上眼镜：她承认自己在这个年纪也被骗过，周六还不算「不行」。' },
        { en: 'Showdown: Saturday evening — does Mo\' tell her about Loup3769 and earn the party, or get grounded?', zh: '摊牌：周六晚上——阿紫会把 Loup3769 的事告诉她、换来派对，还是被禁足？' },
      ],
      haunts: { 0: ['kitchen'], 1: ['kitchen'] },
      deadline: { day: 4, text: { en: 'Saturday evening: the verdict on Mo\'s party', zh: '周六晚上：派对去不去的最终裁决' } },
      keepsakeIdeas: { en: 'the basket\'s checked napkin, a sticky note "be home by 7", a battered book of Perrault tales', zh: '篮子里的格子餐巾、一张「7 点前回家」便利贴、一本翻旧的贝洛童话' },
      sprite: {
        pal: { B: '#a98bc4', b: '#7d619b', L: '#efe4f7', A: '#ffffff', k: '#5b3f73' },
        art: [
          '...BB....BB...',
          '...BL....LB...',
          '...BL....LB...',
          '..BBBBBBBBBB..',
          '.BBBBBBBBBBBB.',
          '.BBBBBkkBBBBB.',
          '..BBAAAAAABB..',
          '..BBAAAAAABB..',
          '..bBBBBBBBBb..',
          '...bb....bb...',
        ],
        eyes: [[4, 4], [4, 9]], cheeks: [[5, 3], [5, 10]], motion: 'ears',
      },
    },
  ],
  stages: [
    { en: 'Whatever', zh: '无所谓' },
    { en: 'Small Talk', zh: '搭话' },
    { en: 'Hunch', zh: '起疑' },
    { en: 'Glasses On', zh: '戴上眼镜' },
    { en: 'Showdown', zh: '摊牌' },
  ],
  gates: [
    { affection: 0, scenes: 0 },
    { affection: 2, scenes: 1 },
    { affection: 4, scenes: 2 },
    { affection: 6, scenes: 3 },
    { affection: 8, scenes: 4 },
  ],
  events: [
    { day: 1, text: { en: 'Wednesday: Granny has been stuck in bed for two days', zh: '周三：外婆已经卧床两天' } },
    { day: 2, text: { en: 'Thursday: a "salesman" phones No. 173 about a complete box set', zh: '周四：一个「推销员」打电话到 173 号推销剧集全集' } },
    { day: 3, text: { en: 'Friday: Wolf\'s party (address "TBA")', zh: '周五：狼说的派对（地址「待定」）' } },
    { day: 4, text: { en: 'Saturday: visit to No. 173 in the afternoon; Mo\'s party in the evening — if allowed', zh: '周六：下午去 173 号；晚上阿紫的派对——如果准去的话' } },
  ],
  fixed: [
    {
      day: 1, slot: 0,
      place: { en: 'Home Kitchen', zh: '家里厨房' },
      mood: { en: '"Once upon a time..." — a record scratch, a basket, an eye-roll', zh: '「很久很久以前……」——唱针一划，一个篮子，一个白眼' },
      title: { en: 'Il était une fois...', zh: '很久很久以前……' },
      cast: ['mom'],
    },
    {
      day: 4, slot: 0,
      place: { en: 'Granny\'s Room, No. 173', zh: '外婆的房间（173 号）' },
      mood: { en: 'the door unlocked, the curtains drawn, "Granny" in bed with cucumber slices on her face; Mo\'s glasses in her pocket', zh: '门没锁，窗帘拉着，「外婆」躺在床上，脸上敷着黄瓜片；阿紫的眼镜在口袋里' },
      title: { en: 'What Big Cucumbers You Have', zh: '外婆，你的黄瓜片好大呀' },
      cast: ['granny', 'wolf'],
    },
  ],
  proactiveAfter: 1,
  endings: [
    {
      id: 'three-generations', tier: 4, minStage: 2, minAffection: 4, maxBroken: 0,
      title: { en: 'GOOD ENDING (for the whole family — bad ending for Wolf!) · THREE GENERATIONS', zh: '好结局（全家都好——狼除外！）· 三代同堂' },
      brief: {
        en: 'Mo\' kept her word to Mom and Granny and figured Wolf out in time. Mom, Granny and Mo\' set the trap together: Granny opens the unlocked door with Suzie in hand, Mo\' calls the "Handov Erzycash" nursing home, Mom arrives with the police. Wolf, in Granny\'s nightgown, insists he is "just a young wolf". Mo\' goes to her Saturday party — and blocks Loup3769.',
        zh: '阿紫守住了对妈妈和外婆的约定，也及时看穿了狼。三代人一起设局：外婆握着苏西开了那扇不锁的门，阿紫打给「交出钱来」养老院，妈妈带着警察赶到。穿着外婆睡袍的狼还在坚称自己「只是一只年轻的狼」。阿紫去了周六的派对——顺手拉黑了 Loup3769。',
      },
    },
    {
      id: 'my-prisoner', who: 'wolf', tier: 3, minStage: 4, minAffection: 7,
      title: { en: 'GOOD ENDING (for Mo\'! — bad ending for Wolf!) · MY PRISONER', zh: '好结局（对阿紫！——对狼是坏结局！）· 我的囚犯' },
      brief: {
        en: 'The original\'s good ending: Mo\' puts on her glasses (ugly, but effective), recognizes Wolf under the cucumbers, says she must call her "boyfriend" back, and instead calls the "Handov Erzycash" nursing home ("Paricil Amonai" in French) to report that her grandmother is wearing fruit on her head. The orderlies cart "Granny" off; Wolf\'s "it was a prank, I\'m a young wolf!" only proves he has lost his marbles. Granny is found in the wardrobe, unharmed and furious about her nightgown. Wolf\'s "affection" here means how well Mo\' read him, not that she liked him.',
        zh: '原作的好结局：阿紫戴上眼镜（丑，但管用），认出黄瓜片下面是狼，说要给「男朋友」回个电话，转头打给「交出钱来」养老院（法语原作叫 Paricil Amonai），报告外婆把水果戴在头上了。护工把「外婆」抬走；狼喊「只是恶作剧，我是年轻的狼！」只让人更确定他疯了。外婆在衣柜里被找到，毫发无伤，只为睡袍生气。这里狼的「好感」指阿紫把他看得多透，不是她喜欢他。',
      },
    },
    {
      id: 'jail-space', who: 'granny', tier: 3, minStage: 4, minAffection: 7, minKept: 1,
      title: { en: 'GOOD ENDING (...well, bad ending for Wolf!) · JAIL SPACE', zh: '好结局（……对狼来说是坏结局！）· 牢房格' },
      brief: {
        en: 'The original\'s pepper-spray ending, earned: because Mo\' kept her promise and warned Granny, Granny is ready. "Sir, meet Suzie, my faithful little pepper spray. Suzie, introduce yourself again." Wolf howls twice; the police congratulate Granny on her cool head. Mo\' and Granny finish the Scrabble game while the sirens fade.',
        zh: '原作的喷雾结局，这次是挣来的：阿紫守约提前提醒了外婆，外婆早有准备。「先生，这位是苏西，我忠实的小防狼喷雾。苏西，再跟先生打个招呼。」狼惨叫两回；警察夸外婆临危不乱。警笛声远去，祖孙俩把那盘拼字游戏下完。',
      },
    },
    {
      id: 'saturday-night', who: 'mom', tier: 3, minStage: 4, minAffection: 7, maxBroken: 0,
      title: { en: 'GOOD ENDING · SATURDAY NIGHT', zh: '好结局 · 周六之夜' },
      brief: {
        en: 'Mo\' tells Mom everything about Loup3769 before Saturday. Mom tells her own story at last — no fairy tale this time. They report the account together; Wolf is picked up on the boulevard. Mom drives Mo\' to her party and, at the door, starts "Once upon a time..." — Mo\' rolls her eyes and hugs her anyway.',
        zh: '阿紫在周六前把 Loup3769 的事全告诉了妈妈。妈妈终于讲了自己的故事——这回不是童话。母女一起举报了那个账号，狼在大道上被带走。妈妈开车送阿紫去派对，在门口又开了个头「很久很久以前……」——阿紫翻了个白眼，还是抱了她一下。',
      },
    },
    {
      id: 'quiet-games', who: 'granny', tier: 2, minStage: 2,
      title: { en: 'QUIET ENDING · GAMES', zh: '平静结局 · 游戏' },
      brief: {
        en: 'The original\'s quiet ending: Mo\' hurries to Granny\'s instead of lingering, never adds the stranger ("was he high or something?"), and the afternoon becomes a Scrabble rematch. Wolf is never heard from again — this time. Final line: "Double word score!"',
        zh: '原作的平静结局：阿紫没在路上逗留，径直去了外婆家，也没加那个陌生人（「他是嗑多了吧？」），下午变成一场拼字游戏复仇赛。狼再也没出现——至少这一次。最后一句：「双倍词分！」',
      },
    },
    {
      id: 'close-call', who: 'wolf', tier: 1, minStage: 2,
      title: { en: 'BAD ENDING · CLOSE CALL', zh: '坏结局 · 险些出事' },
      brief: {
        en: 'Replaces the original\'s "VICTIM" ending without anything graphic. Mo\' trusted Loup3769 and never put on her glasses; "Granny" asks her to play her youngster music loud and come closer — Mo\' realizes too late, screams for Mom and bolts into the hallway. Neighbors come running; Wolf escapes through the window with Granny\'s purse and Mo\'s phone (and all her friends\' addresses). Granny is found shaken in the wardrobe. Mo\' sits on the stairs, finally understanding why Mom tells that story.',
        zh: '替换原作「受害者」结局，不写任何露骨内容。阿紫信了 Loup3769，始终没戴眼镜；「外婆」让她把年轻人的音乐开大声、凑近一点——阿紫这才反应过来，喊着妈妈冲进走廊。邻居们跑来；狼带着外婆的钱包和阿紫的手机（连同她所有朋友的地址）从窗户逃走。外婆在衣柜里被找到，吓坏了。阿紫坐在楼梯上，终于明白妈妈为什么总讲那个故事。',
      },
    },
    {
      id: 'grounded', tier: 0,
      title: { en: 'BAD ENDING · GROUNDED', zh: '坏结局 · 禁足' },
      brief: {
        en: 'The original\'s first bad ending: Mo\' dodged the chores and the trust both ways. Granny got her rice cake from a neighbor; Mom\'s verdict on Saturday is homework in her room and "we\'ll talk about it with your father". Final line: "Ain\'t fair!"',
        zh: '原作的第一个坏结局：阿紫家务和信任两头都没顾上。外婆的米饼是邻居帮忙送的；妈妈对周六的裁决是：回房写作业，「等你爸回来再说」。最后一句：「不公平！」',
      },
    },
  ],
  finale: {
    en: 'End on the ending card in the original\'s format (e.g. "GOOD ENDING (...well, bad ending for Wolf!)"), preceded by one last line that echoes the tale — a Perrault formula, a SocialBook status, or "Il était une fois..."',
    zh: '用原作格式的结局标题收尾（如「好结局（……对狼来说是坏结局！）」），在它之前留一句呼应童话的话——一句贝洛套话、一条 SocialBook 动态，或「Il était une fois……」。',
  },
  loading: [
    { en: 'Il était une fois...', zh: 'Il était une fois……很久很久以前……' },
    { en: 'Typing a status: #173 Wilson Blvd, ugh...', zh: '正在打一条动态：威尔逊大道 173 号，烦死了……' },
    { en: 'Loup3769 is online...', zh: 'Loup3769 正在线……' },
    { en: 'Granny\'s TV is blaring a detective show...', zh: '外婆的电视在大声放侦探剧……' },
    { en: 'Pull out the peg and the latch will fall...', zh: '拉一下门闩，门就开了……' },
  ],
}
