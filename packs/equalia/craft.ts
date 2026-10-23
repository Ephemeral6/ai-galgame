// 《通往 eQualia 的桥》改编包的写作手法层（CC0，与本包一致）。
// 只在原作范围内加：母题、细节、口癖都取自原作已有的人物、地点和道具；预写关键场景只落在本包已有的关键事件上，台词为我们新写。
// 不写恋爱（全部角色 romance: false）。字段定义见 hooks/craft-types.ts。

import type { PackCraft } from '../../hooks/craft-types'

export const EQUALIA_CRAFT: PackCraft = {
  motifs: [
    { id: 'tapestry', thing: { en: 'the tapestry: "eebeebeebee crew was here"', zh: '挂毯上的「eebeebeebee crew was here」' },
      meanings: [
        { stage: 0, text: { en: 'a vandal\'s tag', zh: '破坏者的涂鸦' } },
        { stage: 2, text: { en: 'a name that leads offline', zh: '一个通往线下的名字' } },
        { stage: 3, text: { en: 'a summons someone sent', zh: '有人发出的召唤' } },
      ] },
    { id: 'arches', thing: { en: 'nine woven arches in a clearing: "the bridge"', zh: '林中空地上九道编起来的拱门：「桥」' },
      meanings: [
        { stage: 1, text: { en: 'a story a griefer half remembers', zh: '一个破坏者记不全的故事' } },
        { stage: 3, text: { en: 'what EBBB burns wherever it finds it', zh: 'EBBB 到哪里都要烧掉的东西' } },
        { stage: 4, text: { en: 'something that can be built again', zh: '可以再搭一次的东西' } },
      ],
      payoff: { en: 'the invitation to the end of a new bridge', zh: '去一座新桥尽头的邀请' } },
    { id: 'typing', who: 'crows', thing: { en: 'the "typing..." indicator', zh: '「正在输入」的提示' },
      meanings: [
        { stage: 0, text: { en: 'hesitation', zh: '犹豫' } },
        { stage: 2, text: { en: 'six minds arguing before one sentence', zh: '一句话之前六个意识在争' } },
        { stage: 3, text: { en: 'a confession being written and deleted', zh: '一段写了又删的坦白' } },
      ] },
    { id: 'notes-txt', thing: { en: 'Maggie\'s notes.txt for the case', zh: '玛姬这个案子的 notes.txt' },
      meanings: [
        { stage: 0, text: { en: 'procedure: collect, sort, conclude', zh: '流程：收集、整理、下结论' } },
        { stage: 3, text: { en: 'a file that refuses to close', zh: '一个关不上的文件' } },
      ] },
    { id: 'microfiche', who: 'librarian', thing: { en: 'the microfiche reels', zh: '缩微胶卷' },
      meanings: [
        { stage: 1, text: { en: 'the only place the tracts survive', zh: '小册子唯一的存身之处' } },
        { stage: 3, text: { en: 'things that were never digitized, and so were never erased', zh: '从未数字化、所以从未被删掉的东西' } },
      ] },
  ],

  setPieces: [
    {
      id: 'eq-six', who: 'crows', kind: 'reveal', motif: 'typing',
      title: { en: 'Six, Not Seven', zh: '六只，不是七只' },
      trigger: { beat: 'six-crows' },
      staging: { en: 'The upside-down balcony in Second Life. Maggie counts the crows on the ceiling out loud. The "typing..." indicator lights and dies twice before the crows answer. All their lines are lowercase.', zh: 'Second Life 的倒置阳台。玛姬把天花板上的乌鸦一只只数出声。七鸦回答之前，「正在输入」亮了又灭两次。它的台词全部小写。' },
      lines: [
        { who: 'narration', text: { en: 'One. Two. Three. Four. Five. Six. Maggie counts again, slower. Six.', zh: '一、二、三、四、五、六。玛姬又数了一遍，更慢。六只。' } },
        { who: 'me', text: { en: 'Where\'s the seventh?', zh: '第七只呢？' } },
        { who: 'narration', text: { en: 'typing... The indicator goes out. typing...', zh: '正在输入……提示灭了。正在输入……' } },
        { who: 'crows', text: { en: 'before we answer. one thing.', zh: '回答之前。一件事。' } },
        { who: 'crows', text: { en: 'if you find anything she left. bring it to us first. all of it. not a summary.', zh: '如果你找到她留下的任何东西。先带给我们。完整的。不要摘要。' } },
      ],
      unsaid: { en: 'What happened to the seventh crow.', zh: '第七只乌鸦怎么了。' },
    },
    {
      id: 'eq-bars', who: 'wood', kind: 'reveal', motif: 'arches',
      title: { en: 'Behind the Bars', zh: '铁栏后面' },
      trigger: { beat: 'jail' },
      staging: { en: 'The Horny Guild jail cell. Maggie\'s bot stands on the respawn bed; wood stands outside the iron bars with the crossbow he never fires. Somewhere below, another bot dies in the bedrock maze. wood types fast and badly, then stops for a long time before the fire.', zh: 'Horny Guild 的牢房。玛姬的机器人站在重生床上；木头站在铁栏外，拿着那把从来没射过的弩。下面的基岩迷宫里，又一个机器人死了。木头打字又快又乱，讲到那把火之前，停了很久。' },
      lines: [
        { who: 'wood', text: { en: 'ok so. this guy. tracksuit, black beenie. older. he had weed and we had nothin to do', zh: '好吧。就是这个人。运动服，黑毛线冒。年纪大点。他有大麻，我们闲得没事干' } },
        { who: 'me', text: { en: 'And the price was a mission.', zh: '代价是一个任务。' } },
        { who: 'wood', text: { en: 'nine of these arch things. sticks woven togther. in a line in this clearing. he called it a bridge lol', zh: '九个那种拱门。树枝编的。在一块空地上排成一排。他管那叫桥lol' } },
        { who: 'narration', text: { en: 'typing... The indicator stays on for a long time. What arrives is short.', zh: '正在输入……提示亮了很久。发来的东西很短。' } },
        { who: 'wood', text: { en: 'we burned it. i still got the pics', zh: '我们烧了。照片我还留着' } },
        { who: 'me', text: { en: 'What did he call himself?', zh: '他自称什么？' } },
        { who: 'wood', text: { en: 'nothing. just ebbb. kloose knows the long version. i never could say it', zh: '没自称什么。就ebbb。长的那个kloose知道。我一直念不出来' } },
      ],
      unsaid: { en: 'Whether wood thought it was wrong while it was burning.', zh: '火烧着的时候，木头有没有觉得不对。' },
    },
    {
      id: 'eq-notebook', who: 'librarian', kind: 'confession', motif: 'microfiche',
      title: { en: 'Never Scanned', zh: '从未扫描' },
      trigger: { minStage: 3, places: ['library'], after: ['beat:tracts'], alone: true },
      staging: { en: 'Special collections after hours. The reader booths are dark; only the desk lamp is on. Rosalind sets a worn composition notebook on the table between them and does not open it yet. Her eyes are creased above the mask.', zh: '闭馆后的特藏室。阅读机都关了，只亮着一盏台灯。罗莎琳把一本磨旧的作文本放在两人之间的桌上，先不翻开。口罩上方，她的眼睛眯着。' },
      lines: [
        { who: 'librarian', text: { en: 'In the nineties I was a dragon too. Different name. A text world, like yours.', zh: '九十年代，我也是一条龙。用的是另一个名字。一个文字世界，就像你那个。' } },
        { who: 'me', text: { en: 'What happened to it?', zh: '它后来怎么了？' } },
        { who: 'librarian', text: { en: 'Nothing dramatic. People got jobs. The server stopped answering one winter and nobody wrote to ask why.', zh: '没什么惊天动地的。大家找了工作。有一年冬天服务器不再回应，也没有人写信去问为什么。' } },
        { who: 'narration', text: { en: 'She turns the notebook so its spine faces Maggie. Pencil, hundreds of pages, a map on the inside cover.', zh: '她把本子转过来，书脊朝着玛姬。铅笔字，几百页，封里画着一张地图。' } },
        { who: 'librarian', text: { en: 'I kept writing it here. It has never been online. I would like it to stay that way.', zh: '我后来一直写在这里。它从来没上过网。我希望它一直这样。' } },
      ],
      unsaid: { en: 'Her old name.', zh: '她以前的名字。' },
    },
    {
      id: 'eq-letter', who: 'dahlia', kind: 'climax', motif: 'arches',
      title: { en: 'There Is a Letter Here', zh: '这里有一封信' },
      trigger: { beat: 'letter' },
      // 停在邀请那一段之前：读不读、读了以后怎样，各结局不同（dahlia-near 读不下去，dahlia-true 读了），这里不替结局决定
      staging: { en: 'White text on black. FEATURELESS ROOM / empty test place / there is a letter here / >. No exits are listed. Maggie types "read letter" and the letter scrolls up line by line; Dahlia\'s lines are the letter itself. The server\'s credit is almost gone. Stop at the last paragraph, before Maggie reads it.', zh: '黑底白字。空白房间 / 空的测试场所 / 这里有一封信 / >。没有列出任何出口。玛姬打了「read letter」，信一行一行滚上来；达莉娅的台词就是信本身。服务器的额度快用完了。停在最后一段之前，玛姬还没读它。' },
      lines: [
        { who: 'narration', text: { en: '> read letter', zh: '> read letter' } },
        { who: 'dahlia', text: { en: 'to my dear birds ~ i\'m so sorry i didn\'t see how much it hurt. i should have', zh: '致我亲爱的鸟儿们~ 对不起，我没看出来它有多疼。我本该看出来的' } },
        { who: 'dahlia', text: { en: 'i\'m not mad about the kingdom. kingdoms can be rebuilt ^w^', zh: '王国的事我不生气。王国可以重建 ^w^' } },
        { who: 'narration', text: { en: 'Below the text, a dahlia drawn in punctuation marks. Under it, one more paragraph. The scroll stops there.', zh: '字的下面，一朵用标点符号画的大丽花。花下面还有一段。滚动停在了这里。' } },
        { who: 'me', text: { en: 'look', zh: 'look' } },
        { who: 'narration', text: { en: 'FEATURELESS ROOM. There are no obvious exits.', zh: '空白房间。没有明显的出口。' } },
      ],
      unsaid: { en: 'What the last paragraph says.', zh: '最后一段写了什么。' },
    },
    {
      id: 'eq-reader', who: 'librarian', kind: 'daily', motif: 'microfiche',
      title: { en: 'Only the Blank Edges', zh: '只碰空白的地方' },
      trigger: { beat: 'tracts' },
      staging: { en: 'Special collections, the microfiche reader humming. The librarian loads a reel by its edges and shows Maggie how to hold film. She explains precisely and admits what she doesn\'t know.', zh: '大学特藏室，阅读机嗡嗡响。图书管理员捏着边缘装好胶卷，教玛姬怎么拿胶片。她讲得精确，不知道的就直说。' },
      lines: [
        { who: 'librarian', text: { en: 'Hold it by the edges. You\'ll only ever touch the blank parts.', zh: '拿边缘。你只会碰到空白的地方。' } },
        { who: 'me', text: { en: 'How many people have looked at this reel?', zh: '这卷胶卷有多少人看过？' } },
        { who: 'librarian', text: { en: 'Since it arrived? You. Before that, I couldn\'t say, and I won\'t guess.', zh: '到馆以后？你一个。之前的，我不知道，我也不猜。' } },
        { who: 'narration', text: { en: 'The reader\'s lamp warms the room by a degree. A page of German slides into focus.', zh: '阅读机的灯让屋里暖了一度。一页德文慢慢对上了焦。' } },
      ],
    },
  ],

  reveals: [
    {
      id: 'rv-summons', when: { after: ['beat:confession'] },
      truth: { en: 'The crows called EBBB in themselves. The tag on the tapestry was not an intrusion; it was an answered invitation.', zh: 'EBBB 是七鸦自己叫来的。挂毯上的涂鸦不是闯入，是一份被回应的邀请。' },
      reframes: [
        { en: 'the crows saying they left "for personal reasons"', zh: '七鸦说自己是「因个人原因」退出的' },
        { en: 'the tract line that sounded almost word for word like something the crows once said', zh: '小册子里那句几乎和七鸦说过的话一字不差' },
        { en: 'the flickering "typing..." on the first night', zh: '第一夜忽明忽灭的「正在输入」' },
      ],
    },
    {
      id: 'rv-borrowed', when: { after: ['beat:tracts', 'beat:jail'], who: 'wood', minStage: 3 },
      truth: { en: 'What wood says about fiction being useless is the tracts\' idea. The tracksuit guy talked EBBB at him back then; wood has been repeating it for years without knowing it was never his.', zh: '木头说的那些「虚构没用」，是小册子里的想法。当年运动服男人对着他讲 EBBB 那一套；这些年他一直在复述，却不知道那从来不是他自己的想法。' },
      reframes: [
        { en: 'wood\'s "someone has to be the guy who burns the library of alexandria"', zh: '木头那句「总得有人当烧亚历山大图书馆的那个人」' },
        { en: 'the way wood gets every book title wrong, yet repeats the tract ideas without a slip', zh: '木头每个书名都说错，复述小册子里的那套想法却一点不差' },
      ],
    },
    {
      id: 'rv-dragon', when: { who: 'librarian', minStage: 3, after: ['beat:tracts'] },
      truth: { en: 'Rosalind was once a dragon on a text MUD herself. She knows the "dark matter" of culture that never goes online because she has been writing in it for thirty years.', zh: '罗莎琳自己也曾是文字 MUD 里的一条龙。她知道那片「永远不会上网的文化暗物质」，因为她在里面写了三十年。' },
      reframes: [
        { en: 'her "most of the world was never scanned"', zh: '她那句「世界的大部分从来没被扫描过」' },
        { en: 'her going quiet at the tract line about fiction', zh: '读到小册子里讲虚构的那句时她的沉默' },
      ],
    },
  ],

  flashbacks: [
    { id: 'fb-rave', who: 'me', trigger: {}, text: { en: 'The rave in the Hanging Gardens, a month ago: a purple dragon\'s wing clipping straight through Maggie\'s avatar, and a whispered "oop sowwie" in local chat. The visitor\'s pass arrived a second later.', zh: '一个月前，空中花园的电音派对：一只紫色小龙的翅膀直接穿过玛姬的形象，本地聊天里一句小声的「哎呀对不起」。一秒后，访客通行证就到了。' } },
    { id: 'fb-seven', who: 'crows', trigger: { minStage: 2 }, text: { en: 'An old screenshot in Maggie\'s case folder, from the first night: the flock on the balcony ceiling. She counts. Seven.', zh: '玛姬案子文件夹里一张旧截图，第一夜截的：阳台天花板上的那群乌鸦。她数了一遍。七只。' } },
    { id: 'fb-ipod', who: 'wood', trigger: { after: ['beat:jail'] }, text: { en: 'wood\'s blurry iPod photo, as Maggie keeps picturing it: nine arches black against the fire, and at the edge of the frame, a tracksuit sleeve.', zh: '玛姬总会想起木头那张模糊的 iPod 照片：九道拱门在火光里发黑，画面边上，一截运动服的袖子。' } },
    { id: 'fb-kingdom', who: 'dahlia', trigger: { after: ['beat:seven-sites'] }, text: { en: 'An archived description Dahlia wrote for the square, before the razing: "At the heart of the square a fountain sings a different air for every traveller who pauses beside it. By the third visit it has learned yours, and hums it softly whenever you are near."', zh: '达莉娅在洗劫之前给广场写的描述，存档里还有：「广场中央的喷泉，为每一位在它身旁驻足的旅人唱一支不同的歌。到第三次来访，它便学会了你的那一支，只要你走近，就轻轻哼起。」' } },
  ],

  gags: [
    { id: 'golden-apple', who: ['balenciaga'], places: ['jail'], text: { en: 'Maggie asks balenciaga for another golden apple "for morale". He threatens the IP ban again. A golden apple lands in the cell.', zh: '玛姬向 balenciaga 再要一个金苹果，说是「提振士气」。他又扬言要封 IP 段。一个金苹果落进了牢房。' } },
    { id: 'malaprop', who: ['wood'], text: { en: 'wood cites a great work of literature to make a point and gets the title wrong in a new way each time ("the illyad", "dantes infernal").', zh: '木头每次想引用一部名著来证明观点，书名都错得不一样（「伊利压特」「但丁的地狱曲」）。' } },
    { id: 'ms-maggie', who: ['librarian'], text: { en: 'Long after Maggie asked her to drop it, Rosalind still starts "Ms.—" once a day, catches herself, and finishes "Maggie" with great dignity.', zh: '玛姬早就请她别叫「女士」了，罗莎琳还是每天会冒出一次「玛姬女——」，自己刹住，然后郑重地补上「玛姬」。' } },
  ],

  gossip: [
    { id: 'g-bal-wood', from: 'balenciaga', about: 'wood', truth: 'half', after: ['beat:jail'], text: { en: '"wood keeps logging in at weird hours and just standing at the bars. says hes guarding the bot. theres nothing to guard"', zh: '「木头老在奇怪的时间上线，就站在铁栏外面。说是看着那个机器人。根本没什么好看的」' } },
    { id: 'g-kloose-wood', from: 'kloose', about: 'wood', truth: 'true', after: ['beat:german-name'], text: { en: '"he still charges that ipod sometimes. just to check the pics are there. dont tell him i said"', zh: '「他还会时不时给那个ipod充电。就为了看看照片还在不在。别说是我说的」' } },
    { id: 'g-crows-dahlia', from: 'crows', about: 'dahlia', truth: 'true', fromDay: 2, text: { en: '"she rewrites the fountain every time someone new comes. nobody asks her to."', zh: '「每来一个新的人，她就重写一遍喷泉。没人叫她这么做。」' } },
    { id: 'g-bal-me', from: 'balenciaga', about: 'me', truth: 'false', fromDay: 3, text: { en: '"the bot with a thousand accounts is obviously a fed. or a very bored teenager. same thing"', zh: '「那个有一千个账号的机器人显然是联邦探员。要不就是一个很无聊的小孩。一回事」' } },
  ],

  texture: {
    days: [
      { day: 1, bits: [{ en: 'the case folder is empty; Maggie makes notes.txt anyway', zh: '案子文件夹是空的；玛姬还是先建了 notes.txt' }] },
      { day: 2, bits: [{ en: 'the DGSA scan has been running since last night', zh: 'DGSA 从昨晚一直扫到现在' }] },
      { day: 3, weather: { en: 'grey and damp, a day for buses', zh: '阴，潮，适合坐公交的天' }, bits: [{ en: 'Maggie counts the N95s left in the box before going out', zh: '出门前玛姬数了数盒子里还剩几只 N95' }] },
      { day: 4, bits: [{ en: 'the guild\'s warning message, pinned in every channel', zh: '公会的警告置顶在每个频道' }] },
      { day: 5, weather: { en: 'clear, cold', zh: '晴，冷' }, bits: [{ en: 'a shipping label for the reels printed and waiting on the reading-room desk', zh: '胶卷的运单已经打好，压在阅览室的桌上' }] },
      { day: 6, bits: [{ en: 'every one of 7crows\' remaining profiles now shows a scheduled deletion date', zh: '七鸦剩下的每个账号主页都挂上了预定删除的日期' }] },
      { day: 7, bits: [{ en: 'the hosting dashboard: credit remaining, a few hours', zh: '托管后台：剩余额度，几个小时' }] },
    ],
    any: [
      { en: 'a meal shake shaken exactly twenty-five times', zh: '一瓶代餐，摇了正好二十五下' },
      { en: 'Maggie names a failure mode out loud and keeps going anyway', zh: '玛姬把自己的一个「故障模式」念出声，然后照样继续' },
      { en: 'a typing indicator in some other window', zh: '另一个窗口里有人「正在输入」' },
    ],
    places: {
      gardens: [{ en: 'billboarded flowers that turn to face whoever is looking', zh: '贴图花朵总是转过来朝着看它的人' }, { en: 'an abandoned DJ booth still looping one bar', zh: '没人的 DJ 台还在循环同一个小节' }],
      dream: [{ en: 'a report card on the kitchen table, the grades blurred', zh: '厨房桌上一张成绩单，分数看不清' }, { en: 'the neighbour\'s curtains, drawn', zh: '邻居家的窗帘，拉着' }],
      room: [{ en: 'a spotless desk, the mini-fridge humming over "safe" bottled water and meal shakes', zh: '一尘不染的桌面，小冰箱里是「安全」的瓶装水和代餐' }, { en: 'the clock reads an hour Maggie shouldn\'t be awake at', zh: '时钟显示一个玛姬不该醒着的时间' }],
      square: [{ en: 'room descriptions replaced by keyboard mash', zh: '房间描述被换成乱敲的键盘字符' }],
      throne: [{ en: 'an arch with no door behind it', zh: '一道后面没有门的拱门' }],
      upside: [{ en: 'pose balls hanging off the ceiling', zh: '挂在天花板上的姿势球' }],
      jail: [{ en: 'iron bars, a griefer\'s server, a golden apple tossed in', zh: '铁栏、破坏者的服务器、扔进来的一个金苹果' }],
      library: [{ en: 'the smell of old film and warm lamp', zh: '旧胶片和热灯泡的气味' }],
      bus: [{ en: 'the bus window, the city in the morning, Maggie out of the house', zh: '公交车窗、早晨的城市、出了门的玛姬' }],
    },
  },

  people: {
    crows: {
      quirks: [{ en: 'all lowercase, short', zh: '全小写、短句' }, { en: 'present tense for past problems', zh: '用现在时说过去的问题' }],
      habits: [{ en: 'emotes through pose-ball animations: leaning out, huddling, scattering', zh: '用姿势球动画表达情绪：探身、挤成一团、群飞' }],
      contradiction: { en: 'guards a friend it once let fall', zh: '守着一个它曾经没守住的朋友' },
      growth: { en: 'from hiding behind "personal reasons" to telling the whole of it', zh: '从「个人原因」到把整件事说完' },
      diaryVoice: {
        style: { en: 'a chat log with six speakers who are one; lowercase; long gaps between timestamps', zh: '一份有六个发言者、其实是一个的聊天记录；全小写；时间戳之间隔很久' },
        hides: { en: 'that it called EBBB', zh: '是它叫来了 EBBB' },
        seesMe: [
          { en: 'a stranger with a guest pass', zh: '拿着访客通行证的陌生人' },
          { en: 'a detective who comes back', zh: '会回来的侦探' },
          { en: 'she is getting close', zh: '她越来越近了' },
          { en: 'the one we told', zh: '我们告诉了的人' },
          { en: 'maggie', zh: 'maggie' },
        ],
      },
    },
    wood: {
      quirks: [{ en: 'typos, "lol", "dude"', zh: '错字、「lol」「哥们」' }, { en: 'mangles big words', zh: '用错大词' }],
      contradiction: { en: 'suspicious of everyone, yet desperate to tell the whole story', zh: '谁都怀疑，又急着把整个故事讲出来' },
    },
    librarian: {
      quirks: [{ en: '"Ms. Maggie", until asked to stop', zh: '「玛姬女士」，直到被要求别这么叫' }],
      habits: [{ en: 'handles film by the blank edges', zh: '只捏胶片的空白边缘' }],
      contradiction: { en: 'keeper of the undigitized who once lived in a text world', zh: '守着未数字化之物的人，自己也曾住在文字世界里' },
      diaryVoice: {
        style: { en: 'catalogue cards: accession number, condition, one line of marginalia', zh: '目录卡：登记号、状况、一行页边批注' },
        hides: { en: 'her own old name in a MUD', zh: '她自己在 MUD 里的旧名字' },
        seesMe: [
          { en: 'a patron by email', zh: '邮件里的读者' },
          { en: 'someone who handles film properly', zh: '会拿胶片的人' },
          { en: 'she is chasing something that burned', zh: '她在追一件被烧掉的东西' },
          { en: 'someone I could tell', zh: '可以告诉的人' },
          { en: 'Maggie, no title', zh: '玛姬，不加称呼' },
        ],
      },
    },
    dahlia: {
      quirks: [{ en: 'tildes and kaomoji, "oops sorry"', zh: '波浪号和颜文字，「哎呀对不起」' }, { en: 'calls Maggie "bunny"', zh: '叫玛姬「小兔」' }],
      contradiction: { en: 'downplays herself, loves everyone too hard', zh: '总淡化自己，爱每个人都爱得太用力' },
    },
    kloose: { quirks: [{ en: 'reachable only through wood, from another time zone', zh: '只能通过木头联系，在另一个时区' }] },
    balenciaga: { quirks: [{ en: 'threatens IP bans, then throws in a golden apple', zh: '扬言封 IP 段，然后扔进一个金苹果' }] },
  },
}
