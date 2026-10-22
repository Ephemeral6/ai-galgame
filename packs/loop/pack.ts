// 原创剧本包《潮信七日》：南方海边小县城，台风登陆前的一周，这一周会重来。
// 致敬「时间循环」类 galgame 的结构：重复的一周、逐轮发现真相、知道未来却难以改变、最后打破循环。
// 循环由引擎的 features.timeLoop 驱动：到第 7 天结束达不到 tier ≥ 2 的结局，就回到第 1 天（好感清零，伏笔与事实保留）。

import type { Pack } from '../../types'

export const LOOP: Pack = {
  id: 'loop',
  version: '1.0.0',
  defaultLang: 'zh',
  langs: ['zh', 'en'],
  author: 'ai-galgame contributors',
  source: 'original',
  title: { zh: '潮信七日', en: 'Seven Tides' },
  subtitle: { zh: '南方海边小县城 · 台风周 · 一直重来的七天', en: 'A small southern seaside town, typhoon week, seven days that keep coming back' },
  notes: {
    zh: `创作说明：这是一个致敬「时间循环」类恋爱冒险游戏的原创剧本。这一类作品通常有几个共同的骨架：被困在同一段日子里反复经历；每一轮都多知道一点真相；主角明明知道明天会发生什么，却发现改变它比想象中难；最后不是靠「重来」而是靠某个人放下、某句话说出口，循环才被打破。
本包只借用这种结构与情感节奏，人物、地名、循环成因、台词全部原创：循环不来自任何机器或科学设定，而来自一个女孩不肯写完祖父潮信簿的最后一行——一个温和的、关于「不愿告别」的原因。场景放在中国南方海边小县城的台风周：渔港、骑楼、凉茶铺、县广播站、灯塔、补习班。`,
    en: `Creator's note: an original script paying tribute to the time-loop genre of romance adventure games. Such stories tend to share a skeleton: being stuck re-living the same stretch of days; learning a little more of the truth each time around; knowing exactly what tomorrow brings yet finding it harder to change than expected; and finally escaping not by trying again, but because someone lets go, or something finally gets said.
This pack borrows only that structure and emotional rhythm. Characters, places, the cause of the loop and all dialogue are original: the loop comes from no machine or scientific conceit, but from a girl who will not write the last line in her late grandfather's tide log, a gentle cause about not wanting to say goodbye. It is set during typhoon week in a small seaside county town in southern China: a fishing harbor, arcaded shophouses, an herbal-tea stall, the county radio station, a lighthouse, a cram school.`,
  },
  features: {
    timeLoop: {
      maxLoops: 2,
      minTier: 2,
      text: {
        zh: '风把日历吹回了第一页。你在渡轮的汽笛声里醒来，又是第 1 天的早晨——可你什么都记得。',
        en: 'The wind has blown the calendar back to its first page. You wake to the ferry horn on the morning of Day 1 again, and you remember everything.',
      },
    },
  },
  premise: {
    zh: `第一人称「我」是刚高考完、九月就要去外地读大学的男生，暑假最后一周被家里送到南方海边的浅湾县，住在开杂货铺的姑妈家。浅湾县有渔港、骑楼老街、凉茶铺、县广播站，海角上有一座快要退役的旧灯塔。广播里说，今年第 11 号台风正在南海加强，预计第 7 天登陆。
第 1 天上午，「我」去灯塔参观，在一本旧簿子后面的访客页上签了名——那是老守灯人的潮信簿。从这一刻起，「我」被写进了这一周：如果第 7 天过去之后没有一个足够好的结局，这一周就会重来，而「我」会记得上一轮发生的一切。`,
    en: `The first-person narrator ("I") has just finished the college entrance exam and leaves for university in September. For the last week of summer his family sends him to Qianwan, a small county town on the southern coast, to stay with his aunt who runs a corner shop. Qianwan has a fishing harbor, an old street of arcaded shophouses, an herbal-tea stall, the county radio station, and on the headland an old lighthouse about to be retired. The radio says this year's Typhoon No. 11 is strengthening over the South China Sea and should make landfall on Day 7.
On the morning of Day 1 I visit the lighthouse and sign my name in the visitors' pages at the back of an old ledger: the former keeper's tide log. From that moment I am written into this week. If Day 7 passes without a good enough ending, the week starts over, and I remember everything from the last time around.`,
  },
  style: {
    zh: `文风：国产青春小说的质感，克制、具体、有画面；多写南方海边的细节——咸湿的风、骑楼柱子上的旧招牌、凉茶的苦和回甘、渔船柴油味、广播里的天气预报、台风前闷热发白的天。少写空泛形容词和大段心理独白。
循环：引擎会告诉你现在是第几轮。第 1 轮一切都是第一次；从第 2 轮起，「我」记得上一轮，可以提前说出别人要说的话、提前去等一件事发生，别人会觉得奇怪、被吓到，或者渐渐起疑；同一件事在不同轮次要写出差别（「我」的语气更疲惫或更笃定，小细节被改变）。被「我」改变过的事件，要按改变后的样子写。不要让任何人用科幻术语解释循环，它只是「这一周又来了」。
禁忌：不要出现任何日本元素（前后辈称呼、樱花、神社、祭典、浴衣、便当）；不要出现「世界线」「时间机器」「平行宇宙」「穿越」「命运」「羁绊」这类词；不要让任何角色死亡或反复遭遇不幸，不幸的事最多是受伤、损失和离别；循环的成因只按本包设定，不要另起炉灶。`,
    en: `Style: understated, concrete, cinematic Chinese young-adult fiction. Lean on details of the southern coast: salty damp wind, faded signboards on arcade pillars, the bitterness and sweet aftertaste of herbal tea, diesel from the fishing boats, weather bulletins on the radio, the pale, airless sky before a typhoon. Avoid empty adjectives and long inner monologue.
The loop: the engine tells you which cycle this is. In cycle 1 everything happens for the first time. From cycle 2 on, I remember the last cycle: I can say people's lines before they do or wait somewhere for something I know will happen; others find this odd, are startled, or slowly grow suspicious. The same event should read differently across cycles (my tone wearier or surer, small details changed). If I changed an event, write it as changed. Never let anyone explain the loop with science-fiction jargon; it is simply 'this week, again'.
Taboos: no Japanese elements (senpai/kohai, cherry blossoms, shrines, festivals, yukata, bento); no words like 'worldline', 'time machine', 'parallel universe', 'destiny' or 'bond'; no one dies or suffers the same tragedy over and over, misfortune goes no further than injury, loss and parting; the loop's cause is exactly as this pack defines it, do not invent another.`,
  },
  me: { zh: '我', en: 'Me' },
  days: 7,
  slots: [{ zh: '上午', en: 'Morning' }, { zh: '下午', en: 'Afternoon' }, { zh: '夜里', en: 'Night' }],
  dayLabel: { zh: '第 {n} 天', en: 'Day {n}' },
  chapters: [
    { from: 1, title: { zh: '第一章 · 风还很远', en: 'Ch.1 · The Wind Is Still Far Off' } },
    { from: 4, title: { zh: '第二章 · 夜市与预警', en: 'Ch.2 · Night Market, Storm Warning' } },
    { from: 6, title: { zh: '第三章 · 封港', en: 'Ch.3 · Harbor Closed' } },
    { from: 7, title: { zh: '终章 · 第七天', en: 'Finale · Day Seven' } },
  ],
  places: [
    { id: 'harbor', name: { zh: '渔港码头', en: 'Fishing Harbor' }, mood: { zh: '柴油味、晒着的渔网、潮位尺上的青苔', en: 'diesel fumes, nets laid out to dry, moss on the tide gauge' }, slots: [0, 1] },
    { id: 'tutoring', name: { zh: '补习班', en: 'Cram School' }, mood: { zh: '二楼的铁皮屋顶，吊扇和一黑板的错题', en: 'a tin-roofed upstairs room, a ceiling fan, a blackboard of wrong answers' }, slots: [0] },
    { id: 'teashop', name: { zh: '叶记凉茶铺', en: "Ye's Herbal Tea Stall" }, mood: { zh: '铜壶、玻璃碗盖着的龟苓膏、收音机开着', en: 'brass urns, herbal jelly under glass covers, the radio always on' }, slots: [0, 1] },
    { id: 'arcade', name: { zh: '骑楼老街', en: 'Arcade Street' }, mood: { zh: '骑楼柱廊的阴凉、褪色招牌、修鞋摊和糖水店', en: 'shade under the colonnades, faded signs, a cobbler and a sweet-soup shop' }, slots: [0, 1, 2] },
    { id: 'station', name: { zh: '县广播站', en: 'County Radio Station' }, mood: { zh: '旧楼顶的天线、隔音棉、红色的「直播中」灯', en: 'an antenna on an old rooftop, foam soundproofing, a red ON AIR lamp' }, slots: [1, 2] },
    { id: 'lighthouse', name: { zh: '鹅颈角灯塔', en: 'Goose-Neck Point Lighthouse' }, mood: { zh: '白色塔身、铜扶手、旋转的老灯和满墙潮汐表', en: 'a white tower, brass rails, the turning old lamp, walls of tide tables' }, slots: [1, 2] },
    { id: 'seawall', name: { zh: '海堤', en: 'Seawall' }, mood: { zh: '夜里的浪声、远处渔火、堤上乘凉的人', en: 'waves in the dark, distant boat lights, people cooling off on the wall' }, slots: [2] },
  ],
  cast: [
    {
      id: 'wanlan', name: { zh: '符晚澜', en: 'Fu Wanlan' }, short: { zh: '晚澜', en: 'Wanlan' }, color: '#7ec8e3',
      look: { zh: '白灰色的小海鸥，脖子上围着一条海蓝色旧围巾', en: 'a small white-and-grey seagull wearing a faded sea-blue scarf' },
      voice: {
        zh: '声音轻、句子短，常用潮汐和天气说事（「今天的潮来得早」）；对「我」第一次见面就像认识很久，偶尔说漏嘴「你上次不是这么说的」；叫「我」「签名的人」，熟了叫名字。',
        en: "Soft-spoken, short sentences, talks in tides and weather ('the tide came early today'); acts as if she has known me a long time from the very first meeting, occasionally slips ('that's not what you said last time'); calls me 'the one who signed', later my name.",
      },
      samples: [
        { zh: '你在那页签了名？……那你也会记得的。', en: 'You signed that page? ...Then you will remember too.' },
        { zh: '下午三点十二分满潮，比昨天晚四十分钟。我每天都记。', en: 'High tide at 3:12 this afternoon, forty minutes later than yesterday. I write it down every day.' },
        { zh: '最后一行我写不下去。写了，灯就真的灭了。', en: "I can't write the last line. If I do, the lamp really goes out." },
      ],
      secret: {
        zh: '鹅颈角灯塔的老守灯人是她爷爷，今年春天去世；灯塔台风后要换成自动灯标，旧灯退役。爷爷记了四十年的潮信簿只剩最后一行「第七日，风过，灯熄」要她来写。她一直没写，于是这一周一直重来——在「我」来之前，她已经一个人过了很多遍同样的七天。「我」在访客页签了名，所以是第一个和她一起记得的人。只要她亲手写下最后一行，循环就会结束。',
        en: "The lighthouse's old keeper was her grandfather, who died this spring. After the typhoon the tower gets an automatic beacon and the old lamp is retired. His forty-year tide log has one line left for her to write: 'Day seven, the wind passes, the lamp goes out.' She has never written it, so this week keeps repeating; before I came she had lived these same seven days alone many times. Because I signed the visitors' page, I am the first person to remember alongside her. The loop ends once she writes that line with her own hand.",
      },
      arc: [
        { zh: '初见：第 1 天在灯塔里，她看着「我」签名，表情像是看见了一件等了很久又怕的事。', en: 'First meeting: on Day 1 in the lighthouse she watches me sign, looking like she has seen something she waited for and feared.' },
        { zh: '相熟：每天陪她去码头抄潮位、爬灯塔给老灯上油；她总能说中明天的天气，一分不差。', en: 'Familiar: I go with her to read the harbor tide gauge and oil the old lamp; she always calls tomorrow’s weather to the minute.' },
        { zh: '既视：她察觉「你好像知道明天会发生什么」，反过来试探「我」是不是也记得上一轮；第 2 轮起她会松一口气似地说「原来不止我一个」。', en: "Déjà vu: she notices 'you seem to know what happens tomorrow' and tests whether I remember the last cycle too; from cycle 2 she says with relief, 'So it isn't only me.'" },
        { zh: '真相：在灯室里给「我」看潮信簿空着的最后一行，承认这一周是因为她才停不下来，说「我只是还没跟这盏灯说完话」。', en: "The truth: in the lamp room she shows me the blank last line of the log and admits the week won't stop because of her: 'I just haven't finished talking to this lamp.'" },
        { zh: '第七天：台风夜守在灯塔，要不要陪她一起写下最后一行，让灯熄掉，让第八天来。', en: 'Day seven: keeping watch in the lighthouse on typhoon night, will I write the last line with her, let the lamp go out, and let Day 8 come.' },
      ],
      haunts: { 0: ['harbor'], 1: ['lighthouse'], 2: ['lighthouse', 'seawall'] },
      deadline: { day: 7, text: { zh: '台风夜，潮信簿的最后一行', en: "typhoon night, the tide log's last line" } },
      keepsakeIdeas: { zh: '手抄的潮汐表、灯塔铜扶手上掉下的螺丝、潮信簿里夹着的爷爷的老照片', en: "a hand-copied tide table, a screw from the lighthouse brass rail, her grandfather's old photo tucked in the log" },
      sprite: {
        pal: { W: '#f2f6fa', G: '#9fb3c8', g: '#5f7890', Y: '#f5b942', S: '#3f8fc0' },
        art: [
          '.....GGGG.....',
          '...WWWWWWWW...',
          '..WWWWWWWWWW..',
          '..WWWWWWWWWW..',
          '.GWWWWYYWWWWG.',
          'GGWWWWWWWWWWGG',
          'GgWWSSSSSSWWgG',
          '.gWWWWWWWWWWg.',
          '..WWWWWWWWWW..',
          '....YY..YY....',
        ],
        eyes: [[3, 4], [3, 9]], cheeks: [[4, 3], [4, 10]], motion: 'wings',
      },
    },
    {
      id: 'yetang', name: { zh: '叶棠', en: 'Ye Tang' }, short: { zh: '阿棠', en: 'Ah-Tang' }, color: '#ff8a65',
      look: { zh: '橘红色小狐狸，脖子上挂着一副旧耳机', en: 'a little coral-orange fox with old headphones around her neck' },
      voice: {
        zh: '热络、嘴快，爱用播音腔逗人（「各位听众朋友」），被说中心事就把话题转去凉茶；叫「我」「外地仔」，熟了叫名字。',
        en: "Warm and quick-tongued, teases people in a radio-host voice ('dear listeners'), changes the subject to herbal tea when someone hits a nerve; calls me 'out-of-towner', later my name.",
      },
      samples: [
        { zh: '各位听众朋友，现在插播一条消息：外地仔又来白喝凉茶了。', en: 'Dear listeners, a news flash: the out-of-towner is here for free herbal tea again.' },
        { zh: '……你怎么知道我要点这首歌？我还没说出口。', en: "...How did you know which song I was going to play? I hadn't said it yet." },
        { zh: '阿嬷的铺子在这条街上开了五十年，我走了，谁来守？', en: "Grandma's stall has been on this street for fifty years. If I leave, who keeps it?" },
      ],
      secret: {
        zh: '她被省城一所学校的播音专业补录了，第 6 天是确认入学的截止日，可她一直没告诉阿嬷：骑楼街年底要改造，凉茶铺可能保不住，她觉得自己走了就是丢下阿嬷。她每晚在广播站做「夜潮点歌台」，有一张每晚都点同一首老歌的匿名点歌条，是晚澜写的。',
        en: "A broadcasting program in the provincial capital accepted her off the waitlist, and Day 6 is the deadline to confirm, but she hasn't told her grandmother: the arcade street is being redeveloped at year's end and the tea stall may not survive, and leaving feels like abandoning her. Every night she hosts 'Night Tide Requests' at the radio station; an anonymous slip requests the same old song every night, and Wanlan writes it.",
      },
      arc: [
        { zh: '初见：在凉茶铺被她用播音腔调侃，一碗龟苓膏就成了熟客。', en: 'First meeting: she teases me in her radio voice at the tea stall; one bowl of herbal jelly and I am a regular.' },
        { zh: '相熟：晚上去广播站看她做节目，帮她念天气预报、整理点歌条。', en: 'Familiar: I watch her show at the radio station at night, read the weather for her, sort the request slips.' },
        { zh: '既视：她发现「我」总在她开口前接上她的话，半开玩笑地问「你是不是偷听过我的节目重播」——其实她自己也开始做梦梦见这一周。', en: "Déjà vu: she notices I always finish her sentences before she speaks and half-jokes, 'Have you been listening to reruns of my show?' In truth she has started dreaming of this week." },
        { zh: '真相：承认录取通知和截止日，说「只要这一周不结束，我就不用选」——她隐约希望一切重来。', en: "The truth: she admits the acceptance letter and the deadline: 'As long as this week doesn't end, I don't have to choose.' Part of her wants it to repeat." },
        { zh: '抉择：第 6 天截止前，陪她去跟阿嬷说清楚，还是帮她继续瞒下去。', en: "Choice: before the Day 6 deadline, go with her to tell her grandmother, or help her keep hiding it." },
      ],
      haunts: { 0: ['teashop'], 1: ['teashop', 'arcade'], 2: ['station'] },
      deadline: { day: 6, text: { zh: '入学确认截止', en: 'the deadline to confirm enrollment' } },
      keepsakeIdeas: { zh: '手写的点歌条、凉茶铺的竹筒杯、广播站的旧磁带', en: 'a handwritten song-request slip, a bamboo cup from the tea stall, an old cassette from the station' },
      sprite: {
        pal: { O: '#ff8a5c', o: '#d0603a', L: '#fff0e6', D: '#5a3326', H: '#6b6b7a' },
        art: [
          '.O..........O.',
          '.OO........OO.',
          '.OOOHHHHHHOOO.',
          'HOOOOOOOOOOOOH',
          'HOOOOOOOOOOOOH',
          '.OOLLLDDLLLOO.',
          '..OLLLLLLLLO..',
          '..ooooooooooOO',
          '...oo....ooOL.',
          '............L.',
        ],
        eyes: [[4, 4], [4, 9]], cheeks: [[5, 3], [5, 10]], motion: 'tail',
      },
    },
    {
      id: 'chendu', name: { zh: '陈渡', en: 'Chen Du' }, short: { zh: '阿渡', en: 'Ah-Du' }, color: '#ffd54f',
      look: { zh: '棕色小水獭，戴一顶明黄色的渔家雨帽', en: 'a small brown otter in a bright yellow fisherman’s rain hat' },
      voice: {
        zh: '直来直去、话糙理不糙，满嘴渔港俚语，说两句就要动手干活；不会安慰人，只会递东西；叫「我」「读书人」。',
        en: "Blunt, rough-spoken but right, full of harbor slang, always doing something with her hands; can't comfort anyone, just hands them things; calls me 'bookworm'.",
      },
      samples: [
        { zh: '读书人，帮我拉一下这根缆，别光看。', en: "Bookworm, grab this line. Don't just stand there." },
        { zh: '补习班？去了又怎样，题目又不会帮我把船开回来。', en: "Cram school? So what if I go. The math problems won't bring the boat home." },
        { zh: '……你怎么知道阿爸的船会晚？你又不看海。', en: "...How did you know Dad's boat would be late? You don't even read the sea." },
      ],
      secret: {
        zh: '她是复读生，这个暑假一直逃补习班去码头帮阿爸。阿爸欠了债，打算这一季结束就卖掉那条老渔船，让她专心考大学；她想接过这条船，却从没敢说。第 5 天黄色预警那晚阿爸的船迟迟不回——第 1 轮里船是拖着坏掉的机器回来的，阿爸伤了手，卖船的事就此定下。知道未来的人可以提前改变这件事。',
        en: "She is retaking the exam and has skipped cram school all summer to help her dad at the harbor. He is in debt and plans to sell the old boat after this season so she can focus on university; she wants to take the boat over but has never dared say so. On Day 5, the night of the yellow warning, his boat is late. In cycle 1 it limps home with a dead engine and he hurts his hand, which settles the sale. Someone who knows the future can change this.",
      },
      arc: [
        { zh: '初见：在码头被她当成看热闹的外人，一句「让开」就把一筐鱼塞进「我」怀里。', en: "First meeting: at the harbor she takes me for a gawker, says 'move' and shoves a basket of fish into my arms." },
        { zh: '相熟：一早陪她补渔网，替她在补习班点名时打掩护，一起在海堤吃炒粉。', en: 'Familiar: mending nets with her at dawn, covering for her at cram-school roll call, fried noodles on the seawall.' },
        { zh: '既视：她发现「我」提前知道哪条船先回港、哪天收鱼价，盯着「我」问「你到底是什么人」；第 2 轮起「我」可以提前提醒阿爸检修机器。', en: "Déjà vu: she notices I know in advance which boat docks first and what fish will fetch, and stares: 'What are you, really?' From cycle 2 I can warn her dad to fix the engine early." },
        { zh: '真相：在船舱里承认自己想接船、不想读书，说「你们读书人有的是路，我只有这一条」。', en: "The truth: in the cabin she admits she wants the boat, not school: 'You bookworms have roads everywhere. I've only got this one.'" },
        { zh: '抉择：第 5 天夜里在码头等船，要不要帮她把心里话对阿爸说出来。', en: 'Choice: waiting at the harbor on the night of Day 5, will I help her say it to her father.' },
      ],
      haunts: { 0: ['tutoring', 'harbor'], 1: ['harbor'], 2: ['seawall', 'arcade'] },
      deadline: { day: 5, text: { zh: '黄色预警那晚，阿爸的船回港', en: "the night of the yellow warning, when her dad's boat comes in" } },
      keepsakeIdeas: { zh: '一截编好的缆绳结、渔船的旧船牌、晒干的海星', en: "a knotted length of rope, the boat's old number plate, a dried starfish" },
      sprite: {
        pal: { B: '#a0785a', b: '#6e4f3a', L: '#e8d2b8', Y: '#ffd54f', y: '#d9a920' },
        art: [
          '...YYYYYYYY...',
          '..YYYYYYYYYY..',
          'yyyyyyyyyyyyyy',
          '.BBBBBBBBBBBB.',
          '.BBBBBBBBBBBB.',
          '.BBBLLbbLLBBB.',
          '..BLLLLLLLLB..',
          '.bBBBBBBBBBBb.',
          '.bBBBLLLLBBBb.',
          '..bb......bb..',
        ],
        eyes: [[4, 4], [4, 9]], cheeks: [[5, 3], [5, 10]], motion: 'bob',
      },
    },
  ],
  stages: [
    { zh: '初见', en: 'First Meeting' }, { zh: '相熟', en: 'Familiar' }, { zh: '既视', en: 'Déjà Vu' }, { zh: '真相', en: 'The Truth' }, { zh: '第七天', en: 'Day Seven' },
  ],
  gates: [
    { affection: 0, scenes: 0 },
    { affection: 3, scenes: 1 },
    { affection: 6, scenes: 2 },
    { affection: 9, scenes: 4 },
    { affection: 12, scenes: 6 },
  ],
  events: [
    { day: 1, text: { zh: '「我」坐渡轮到浅湾县；广播：第 11 号台风在南海生成', en: 'I arrive in Qianwan by ferry; radio: Typhoon No. 11 has formed over the South China Sea' } },
    { day: 2, text: { zh: '补习班摸底考；最后一批渔船出海', en: 'Placement test at the cram school; the last fishing boats head out' } },
    { day: 3, text: { zh: '县里通知：鹅颈角灯塔台风后改装自动灯标，旧灯退役', en: 'County notice: after the typhoon the lighthouse gets an automatic beacon and the old lamp is retired' } },
    { day: 4, text: { zh: '骑楼街台风前最后一个夜市', en: 'The last night market on Arcade Street before the typhoon' } },
    { day: 5, text: { zh: '台风黄色预警，渔船回港；陈家的船迟迟未归（第 1 轮如此，此后可被改变）', en: "Typhoon yellow warning, boats return; the Chen family's boat is late (so in cycle 1; can be changed later)" } },
    { day: 6, text: { zh: '停课封港，骑楼钉木板；广播站通宵值班；叶棠的入学确认截止', en: "Classes cancelled, harbor closed, shutters boarded up; the radio station stays on air all night; Ye Tang's enrollment deadline" } },
    { day: 7, text: { zh: '台风登陆；灯塔旧灯最后一夜', en: "Typhoon landfall; the old lighthouse lamp's last night" } },
  ],
  fixed: [
    { day: 4, slot: 2, place: { zh: '骑楼夜市', en: 'Arcade Night Market' }, mood: { zh: '炒螺、糖水、挂满灯泡的柱廊，闷热的风里已有台风的味道', en: 'stir-fried snails, sweet soups, bulbs strung along the colonnade, the muggy wind already tasting of storm' }, title: { zh: '台风前的夜市', en: 'Night Market Before the Storm' }, cast: ['wanlan', 'yetang', 'chendu'] },
    { day: 5, slot: 2, place: { zh: '渔港码头', en: 'Fishing Harbor' }, mood: { zh: '黄色预警，雨点开始打在棚顶，港口的灯一盏盏亮起来等船', en: 'yellow warning, rain starting on the awnings, harbor lights coming on one by one to wait for the boats' }, title: { zh: '等船回来', en: 'Waiting for the Boat' }, cast: ['chendu'] },
    { day: 7, slot: 2, place: { zh: '鹅颈角灯塔', en: 'Goose-Neck Point Lighthouse' }, mood: { zh: '台风登陆，塔身在风里嗡嗡作响，旧灯最后一次旋转', en: 'landfall, the tower humming in the wind, the old lamp turning for the last time' }, title: { zh: '第七夜', en: 'The Seventh Night' }, cast: ['wanlan', 'yetang', 'chendu'] },
  ],
  proactiveAfter: 2,
  endings: [
    { id: 'wanlan-true', who: 'wanlan', tier: 3, minStage: 4, minAffection: 12, maxBroken: 0, title: { zh: '最后一行潮信', en: 'The Last Line of the Tide Log' }, brief: { zh: '台风夜，你握着她的手一起写下最后一行，旧灯熄灭，新灯标亮起；风停后的清晨是第 8 天。循环被打破，恋爱结局。', en: 'On typhoon night you hold her hand and write the last line together; the old lamp goes dark and the new beacon lights. The morning after the storm is Day 8. The loop is broken. Romance ending.' } },
    { id: 'yetang-true', who: 'yetang', tier: 3, minStage: 4, minAffection: 12, maxBroken: 0, title: { zh: '第八天的点歌', en: 'A Request on Day Eight' }, brief: { zh: '她在截止前对阿嬷说了实话；台风夜晚澜看着你们，终于肯写下最后一行。第 8 天早上，她在广播里为你点了一首歌，然后去省城报到；恋爱结局。', en: "She tells her grandmother the truth before the deadline; on typhoon night Wanlan, watching you both, finally writes the last line. On the morning of Day 8 she plays a song for you on air, then leaves to enroll. Romance ending." } },
    { id: 'chendu-true', who: 'chendu', tier: 3, minStage: 4, minAffection: 12, maxBroken: 0, title: { zh: '风停之后出海', en: 'Out to Sea After the Wind' }, brief: { zh: '你让阿爸的船平安回港，她当面说出想接船；台风夜晚澜看见有人改变了「第七天」，写下最后一行。第 8 天风停，你们一起把船开出港；恋爱结局。', en: "You get her dad's boat home safe and she tells him to his face she wants it; on typhoon night Wanlan, seeing Day 7 changed by someone, writes the last line. On Day 8 the wind drops and you take the boat out together. Romance ending." } },
    { id: 'wanlan-near', who: 'wanlan', tier: 2, minStage: 3, title: { zh: '替她留着的空行', en: 'A Blank Line Kept for Her' }, brief: { zh: '恋人未满：她写下了最后一行，却在下面又空出一行，说「等你下个夏天再来签名」。循环结束。', en: "Not quite lovers: she writes the last line but leaves one more blank beneath it: 'Come back and sign it next summer.' The loop ends." } },
    { id: 'yetang-near', who: 'yetang', tier: 2, minStage: 3, title: { zh: '没播出去的那首歌', en: 'The Song Never Aired' }, brief: { zh: '恋人未满：她做了决定，你们在台风后的凉茶铺道别，那首想点给你的歌她留在了磁带里。循环结束。', en: 'Not quite lovers: she makes her choice and you part at the tea stall after the storm; the song she meant to play for you stays on the tape. The loop ends.' } },
    { id: 'chendu-near', who: 'chendu', tier: 2, minStage: 3, title: { zh: '欠一网鱼', en: 'One Catch Owed' }, brief: { zh: '恋人未满：船保住了，她送你上渡轮，说「明年来，带你出海，鱼算你的」。循环结束。', en: "Not quite lovers: the boat is saved and she sees you onto the ferry: 'Come back next year. I'll take you out, the catch is yours.' The loop ends." } },
    { id: 'lamp-burns', who: 'wanlan', tier: 1, minStage: 2, title: { zh: '灯还亮着', en: 'The Lamp Still Burns' }, brief: { zh: '坏结局：你知道了真相，却没能让她写下最后一行。台风夜过去，旧灯还亮着；你在渡轮汽笛声里醒来，枕边是第 1 天的报纸，而循环已经没有人再数了。', en: 'Bad ending: you learned the truth but could not get her to write the last line. The typhoon night passes, the old lamp still burns; you wake to the ferry horn with Day 1’s newspaper by your pillow, and no one counts the cycles anymore.' } },
    { id: 'same-week', tier: 1, minAffection: 6, title: { zh: '又一个第一天', en: 'Another Day One' }, brief: { zh: '坏结局：你和这里的人都熟了，却始终没有走进任何人的心事。第七天的风过去，日历又翻回第一页，这一次你决定不再去灯塔签名——却发现名字已经在那一页上了。', en: 'Bad ending: you know everyone here now, but never reached anyone’s real worry. The wind of Day 7 passes, the calendar flips back to page one, and this time you decide not to sign at the lighthouse, only to find your name already on the page.' } },
    { id: 'normal', tier: 0, title: { zh: '台风过境', en: 'The Storm Passes' }, brief: { zh: '普通结局：台风照常登陆又离开，循环在某个说不清的时刻松开了手。你坐渡轮离开浅湾县，觉得好像忘了什么很重要的事。', en: 'Normal ending: the typhoon lands and leaves as typhoons do, and the loop lets go at some moment no one can name. You take the ferry out of Qianwan feeling you have forgotten something important.' } },
  ],
  finale: { zh: '最后一句点题「潮」或「第八天」。', en: 'The last sentence should echo the title: the tide, or Day 8.' },
  loading: [
    { zh: '远处的渡轮拉了一声汽笛…', en: 'A ferry horn sounds somewhere out on the water...' },
    { zh: '收音机里在念台风路径…', en: "The radio is reading out the typhoon's track..." },
    { zh: '灯塔的光又扫过一圈海面…', en: 'The lighthouse beam sweeps the sea once more...' },
    { zh: '骑楼下的风铃响了一下…', en: 'A wind chime under the arcade rings once...' },
    { zh: '潮水退下去，又涨上来…', en: 'The tide goes out, and comes back in...' },
    { zh: '你好像在哪里见过这一幕…', en: 'You feel you have seen this before...' },
  ],
}
