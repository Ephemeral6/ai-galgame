// 《白桦岭的最后一班车》的写作手法层。全部原创。字段定义见 hooks/craft-types.ts。

import type { PackCraft } from '../../hooks/craft-types'

export const SNOW_CRAFT: PackCraft = {
  motifs: [
    { id: 'fur-hat', who: 'donghe', thing: { zh: '冬禾的狗皮帽子', en: 'Donghe\'s fur hat' },
      meanings: [
        { stage: 0, text: { zh: '笑话南方人怕冷的道具', en: 'a prop for mocking the cold-shy southerner' } },
        { stage: 2, text: { zh: '她自己冻红了耳朵也不要回去', en: 'she won\'t take it back even with her own ears frozen red' } },
        { stage: 4, text: { zh: '站台上谁给谁戴上', en: 'who puts it on whom at the platform' } },
      ],
      payoff: { zh: '最后一班车开动前', en: 'before the last train pulls out' } },
    { id: 'boxes', thing: { zh: '家家门口捆好的纸箱', en: 'taped-up boxes at every door' },
      meanings: [
        { stage: 0, text: { zh: '搬迁的样子', en: 'what moving looks like' } },
        { stage: 2, text: { zh: '韩家门口一个都没有', en: 'there are none outside the Han house' } },
        { stage: 3, text: { zh: '留下的人不需要纸箱', en: 'people who stay don\'t need boxes' } },
      ] },
    { id: 'stove', who: 'donghe', thing: { zh: '炉子', en: 'the stove' },
      meanings: [
        { stage: 1, text: { zh: '她被说中心事就去捅的东西', en: 'what she pokes when you hit a nerve' } },
        { stage: 3, text: { zh: '「总得有人给这地方留一口热乎气」', en: '"someone has to keep this place warm"' } },
      ] },
    { id: 'ice-bubbles', who: 'wulan', thing: { zh: '冰里的气泡', en: 'bubbles in the ice' },
      meanings: [
        { stage: 0, text: { zh: '她嘴里一个冷门知识', en: 'an obscure fact she mentions' } },
        { stage: 2, text: { zh: '冻住的那天刮过的风', en: 'the wind that blew the day it froze' } },
        { stage: 4, text: { zh: '被冻住、留下来的一天', en: 'a day frozen and kept' } },
      ] },
    { id: 'ice-town', who: 'wulan', thing: { zh: '冰雕的白桦岭', en: 'the ice-carved Birch Ridge' },
      meanings: [
        { stage: 1, text: { zh: '河套背风处的怪东西', en: 'a strange thing in the lee of the river bend' } },
        { stage: 2, text: { zh: '每搬走一户，就多一座冰房子', en: 'one more ice house for every family that leaves' } },
        { stage: 4, text: { zh: '要先亮一次', en: 'it has to shine once first' } },
      ],
      payoff: { zh: '冰灯会那夜点亮', en: 'lit on the night of the ice-lantern fair' } },
    { id: 'six-panes', who: 'wulan', thing: { zh: '六格的窗户', en: 'six-paned windows' },
      meanings: [
        { stage: 0, text: { zh: '她问「我」奶奶家的窗户是几格', en: 'she asks how many panes Grandma\'s windows have' } },
        { stage: 3, text: { zh: '她要把每一户都雕对', en: 'she means to carve every house right' } },
      ] },
    { id: 'notes', who: 'yanqiu', thing: { zh: '砚秋递来的纸条', en: 'Yanqiu\'s passed notes' },
      meanings: [
        { stage: 0, text: { zh: '她代替说话的东西', en: 'what she uses instead of speaking' } },
        { stage: 2, text: { zh: '纸条比嘴刻薄，也比嘴诚实', en: 'sharper than her mouth, and more honest' } },
        { stage: 4, text: { zh: '她终于不用纸条了', en: 'she finally doesn\'t need them' } },
      ] },
    { id: 'blank-tape', who: 'yanqiu', thing: { zh: '那盘没贴标签的磁带', en: 'the unlabelled tape' },
      meanings: [
        { stage: 1, text: { zh: '录音机里拿错的一盘', en: 'a tape grabbed by mistake' } },
        { stage: 3, text: { zh: '录了又擦、擦了又录', en: 'recorded, erased, recorded again' } },
      ],
      payoff: { zh: '车开以后才能听', en: 'only to be played after the train leaves' } },
    { id: 'train-whistle', thing: { zh: '小火车的汽笛', en: 'the little train\'s whistle' },
      meanings: [
        { stage: 0, text: { zh: '镇上的报时', en: 'the town\'s clock' } },
        { stage: 4, text: { zh: '最后一声', en: 'the last one' } },
      ] },
  ],

  setPieces: [
    {
      id: 'dh-hat', who: 'donghe', kind: 'comedy', motif: 'fur-hat',
      title: { zh: '雪球', en: 'Snowball' },
      trigger: { beat: 'snow-arrival' },
      staging: { zh: '小火车站的站台，零下三十度，墙上贴着停运公告。一个雪球先到，人后到。她嘴上损，手上把帽子扣到「我」头上。', en: 'The little station platform, thirty below, the closure notice on the wall. The snowball arrives before she does. Her mouth mocks; her hands put her hat on my head.' },
      lines: [
        { who: 'narration', text: { zh: '一个雪球砸在「我」后脑勺上，碎雪顺着领口往里钻。', en: 'A snowball smacks the back of my head; snow slides down my collar.' } },
        { who: 'donghe', text: { zh: '哟，南方人回来啦？穿这点儿就敢下车？', en: 'Well, well, the southerner\'s back? Getting off the train dressed like that?' } },
        { who: 'me', text: { zh: '韩冬禾？', en: 'Han Donghe?' } },
        { who: 'donghe', text: { zh: '咋的，五年就不认识了？可拉倒吧。', en: 'What, five years and you don\'t know me? Give me a break.' } },
        { who: 'narration', text: { zh: '她把自己头上的狗皮帽子一把摘下来，扣在「我」头上，帽子里还是热的。', en: 'She yanks off her fur hat and jams it on my head. It\'s still warm inside.' } },
        { who: 'donghe', text: { zh: '冻掉耳朵别找我哭啊。……戴着，看啥看。', en: 'Don\'t come crying to me when your ears drop off. ...Keep it on. What are you looking at.' } },
      ],
    },
    {
      id: 'dh-boiler', who: 'donghe', kind: 'conflict', motif: 'stove',
      title: { zh: '炉门', en: 'The Furnace Door' },
      trigger: { beat: 'snow-chimney' },
      staging: { zh: '锅炉房门口，门缝里透出红光，里面韩师傅的吼声刚停。她摔门出来，撞上「我」。她先开口，不哭，只是一直拿袖子擦鼻子。', en: 'Outside the boiler house; red light through the door gap; Master Han\'s shouting has just stopped. She slams out and walks into me. She speaks first, doesn\'t cry, just keeps wiping her nose on her sleeve.' },
      lines: [
        { who: 'donghe', text: { zh: '看啥。没见过吵架啊。', en: 'What. Never seen a fight before?' } },
        { who: 'me', text: { zh: '名额的事，他知道了？', en: 'He found out about the transfer?' } },
        { who: 'donghe', text: { zh: '他吼我。二十三年，他头一回吼我。', en: 'He yelled at me. Twenty-three years, first time he\'s ever yelled at me.' } },
        { who: 'narration', text: { zh: '锅炉房里传出一声铁锹铲煤的响，接着又是一声。', en: 'From inside comes the scrape of a shovel into coal, then another.' } },
        { who: 'donghe', text: { zh: '你听，他吼完了还在添煤。……他一个人咋整啊，远子。', en: 'Hear that? Done yelling and he\'s still feeding the fire. ...How\'s he supposed to manage alone, Yuanzi.' } },
      ],
      unsaid: { zh: '她怕的是自己走了，炉子会灭。', en: 'Her fear that if she leaves, the fire goes out.' },
    },
    {
      id: 'wl-icetown', who: 'wulan', kind: 'reveal', motif: 'ice-town',
      title: { zh: '半个白桦岭', en: 'Half of Birch Ridge' },
      trigger: { beat: 'snow-icetown' },
      staging: { zh: '河套背风处，冰凿的声音一下一下。「我」循声找过去，半个镇子已经用冰雕好了。她先不说话，凿完手里那一下才开口。', en: 'The lee of the river bend; the chisel strikes, one, then another. Following the sound, I find half the town already carved in ice. She doesn\'t speak until she finishes the stroke in hand.' },
      lines: [
        { who: 'narration', text: { zh: '供销社的冰房子门口，连那把算盘都雕出来了，珠子一颗一颗。', en: 'Outside the ice co-op, even the abacus is carved, bead by bead.' } },
        { who: 'wulan', text: { zh: '……陈远。你来了。', en: '...Chen Yuan. You came.' } },
        { who: 'me', text: { zh: '这是……全镇？', en: 'This is... the whole town?' } },
        { who: 'wulan', text: { zh: '搬走的。搬走一户，我雕一户。', en: 'The ones who left. One family leaves, I carve one house.' } },
        { who: 'wulan', text: { zh: '你奶奶家的窗户，是六格的，对吗。', en: 'Your grandmother\'s windows have six panes. Right?' } },
      ],
    },
    {
      id: 'wl-lanterns', who: 'wulan', kind: 'climax', motif: 'ice-bubbles',
      title: { zh: '先亮一次', en: 'Let Them Shine Once' },
      trigger: { beat: 'snow-lanterns', minStage: 2 },
      staging: { zh: '冰灯会的夜，河套上挤满了人。冰雕的白桦岭还没点灯。她手里攥着一盒火柴，迟迟不划。周围越热闹，两人越安静。', en: 'The ice-lantern night; the river bend packed with people. The ice Birch Ridge is still dark. She holds a box of matches and doesn\'t strike one. The louder the crowd, the quieter the two of them.' },
      lines: [
        { who: 'wulan', text: { zh: '冰会化。我知道。', en: 'Ice melts. I know.' } },
        { who: 'wulan', text: { zh: '我只是想让它们先亮一次。', en: 'I only want them to shine once first.' } },
        { who: 'narration', text: { zh: '她把火柴盒递过来，盒子被她攥得有点软。', en: 'She holds out the matchbox; it has gone a little soft from her grip.' } },
        { who: 'wulan', text: { zh: '你家的那一座，你来点。', en: 'Your family\'s house. You light it.' } },
      ],
      unsaid: { zh: '她第 8 天一早就走。', en: 'That she leaves early on Day 8.' },
    },
    {
      id: 'yq-note', who: 'yanqiu', kind: 'comedy', motif: 'notes',
      title: { zh: '纸条', en: 'The Note' },
      trigger: { beat: 'snow-recorder' },
      staging: { zh: '主街上，她扛着一台录音机，递来一张纸条，然后站着等「我」看完。她开口说的第一个字卡住了，于是又递了一张。', en: 'On the main street, a tape recorder on her shoulder, she hands me a note and waits while I read. The first word she tries to say sticks, so she hands me another.' },
      lines: [
        { who: 'narration', text: { zh: '纸条上写：「缺一个拎磁带的。管饭。不管饱。」', en: 'The note says: "Need someone to carry tapes. Meals provided. Not enough of them."' } },
        { who: 'yanqiu', text: { zh: '陈、陈……', en: 'Ch-Ch...' } },
        { who: 'narration', text: { zh: '她放弃了，又递来一张：「陈远同学。答应就点头。」', en: 'She gives up and hands over another: "Chen Yuan. Nod if yes."' } },
        { who: 'me', text: { zh: '你可以直接说的。', en: 'You can just say it.' } },
        { who: 'yanqiu', text: { zh: '（举起录音机的话筒，一口气）各位听众，陈远同学已经点头了。', en: '(Raising the recorder\'s mic, in one breath) Dear listeners, Chen Yuan has nodded.' } },
      ],
    },
    {
      id: 'yq-tape', who: 'yanqiu', kind: 'confession', motif: 'blank-tape',
      title: { zh: '没贴标签', en: 'No Label' },
      trigger: { beat: 'snow-broadcast', minStage: 2 },
      staging: { zh: '广播站，最后一期节目的 A 面刚放完，红灯还亮着。她手里攥着那盘没贴标签的磁带，在话筒前说得顺，转过脸来就卡住。最后她把话筒拿在手里对着「我」说。', en: 'The radio station; side A of the last show has just finished; the light is still on. She grips the unlabelled tape. Into the mic she\'s fluent; facing me she sticks. In the end she holds the mic in her hand and speaks into it, at me.' },
      lines: [
        { who: 'yanqiu', text: { zh: '这、这盘……', en: 'Th-this tape...' } },
        { who: 'narration', text: { zh: '她把话筒从架子上拔下来，攥在手里，像攥着一根扶手。', en: 'She pulls the mic off its stand and holds it like a handrail.' } },
        { who: 'yanqiu', text: { zh: '这盘磁带，你别现在听。等车开了，再听。', en: 'Don\'t play this tape now. Play it after the train leaves.' } },
        { who: 'me', text: { zh: '为什么？', en: 'Why?' } },
        { who: 'yanqiu', text: { zh: '因为……车开了，你就不能回来骂我了。', en: 'Because... once the train\'s gone, you can\'t come back and tell me off.' } },
      ],
      unsaid: { zh: '磁带里录的是什么。', en: 'What\'s on the tape.' },
    },
  ],

  routes: {
    commonUntil: 3,
    commonGoal: { zh: '共通线：重逢与清仓，三个人都露面；每人一个反常：韩家门口没有纸箱、乌兰草稿纸上的平面图、砚秋的纸条。', en: 'Common route: reunions and clearance sales; all three appear, each with one oddity: no boxes at the Han house, Wulan\'s floor plans, Yanqiu\'s notes.' },
    lock: { minStage: 2, minAffection: 6, margin: 2 },
    branches: [
      { who: 'donghe', goal: { zh: '个人线·冬禾：走的人和留的人；炉子、帽子、锅炉房。', en: 'Donghe route: those who leave and those who stay; the stove, the hat, the boiler house.' }, others: { zh: '乌兰照样凿冰，砚秋的纸条变少了。', en: 'Wulan keeps carving; Yanqiu\'s notes grow fewer.' } },
      { who: 'wulan', goal: { zh: '个人线·乌兰：一座冰做的镇子，一次要亮的灯。', en: 'Wulan route: a town made of ice, a light that has to shine once.' }, others: { zh: '冬禾嘴上骂「远子天天往河套跑」，手上给你们送热水。', en: 'Donghe grumbles "Yuanzi\'s always at the river", then brings you hot water.' } },
      { who: 'yanqiu', goal: { zh: '个人线·砚秋：全镇的告别都录了，只有一盘不敢播。', en: 'Yanqiu route: she has recorded the whole town\'s goodbyes except the one she dare not air.' }, others: { zh: '冬禾以为砚秋在录韩家的事，见她就绕道。', en: 'Donghe thinks Yanqiu is recording her family\'s business and avoids her.' } },
    ],
    ensemble: { zh: '群像线：最后一班车上挤满了全镇的人，三个人的事在站台上一起收尾。', en: 'Ensemble route: the last train is packed with the whole town; all three threads close together on the platform.' },
  },

  reveals: [
    {
      id: 'rv-third-grade', when: { after: ['beat:snow-quarrel'], who: 'yanqiu', minStage: 3 },
      truth: { zh: '三年级那次全班笑砚秋口吃，冬禾当场把带头的人推进了雪堆。砚秋一直以为冬禾是在嫌她丢人。', en: 'In third grade, when the class laughed at Yanqiu\'s stutter, Donghe shoved the ringleader into a snowbank. Yanqiu always thought Donghe was ashamed of her.' },
      reframes: [
        { zh: '澡堂门口那场争吵', en: 'the quarrel outside the bathhouse' },
        { zh: '旧合影里两个人挤在同一辆冰车上', en: 'the old photo of the two of them squeezed onto one ice sled' },
      ],
    },
    {
      id: 'rv-batu', when: { after: ['beat:snow-icetown'], who: 'wulan', minStage: 3 },
      truth: { zh: '「开春才走」是巴特尔替女儿圆的话：乌兰怕说出走的日子，冰雕会来不及。', en: '"Not till spring" was Batu covering for his daughter: Wulan feared that naming the day would leave the ice town unfinished.' },
      reframes: [
        { zh: '巴特尔在冻河上喊的那一嗓子长调', en: 'Batu\'s long-song shout across the frozen river' },
        { zh: '她雕得越来越快', en: 'how she carved faster and faster' },
      ],
    },
  ],

  flashbacks: [
    { id: 'fb-sled', who: 'me', trigger: { minStage: 1 }, text: { zh: '小学时的冬天，三个孩子挤一辆冰车从坡上冲下去，翻在雪里，谁也不肯先起来。', en: 'A primary-school winter: three kids on one ice sled down the slope, tipping into the snow, nobody willing to get up first.' } },
    { id: 'fb-grassland', who: 'wulan', trigger: { minStage: 2 }, text: { zh: '牧区的春天，雪化的那天，草从冰下面露出来一点绿。', en: 'Spring on the grassland: the day the snow melts, a little green shows beneath the ice.' } },
    { id: 'fb-mic', who: 'yanqiu', trigger: { minStage: 2, motif: 'notes' }, text: { zh: '第一次对着广播站的话筒，她念完整整一页稿子，一个字都没卡，自己吓了一跳。', en: 'The first time at the station mic, she read a whole page without a single stutter and startled herself.' } },
  ],

  texture: {
    days: [
      { day: 1, weather: { zh: '零下三十一度，晴，天蓝得发硬', en: 'minus thirty-one, clear, a hard blue sky' }, bits: [{ zh: '火车窗上的霜花', en: 'frost ferns on the train window' }] },
      { day: 2, weather: { zh: '小雪', en: 'light snow' }, bits: [{ zh: '奶奶把腌酸菜的缸也要带走', en: 'Grandma insists on taking the pickling crock' }] },
      { day: 3, weather: { zh: '白毛风', en: 'a white-out wind' }, bits: [{ zh: '补课班的炉子烧得太旺，前排的人脸通红', en: 'the classroom stove is too hot; the front row is red-faced' }] },
      { day: 4, weather: { zh: '晴，冷得耳朵疼', en: 'clear, cold enough to hurt the ears' }, bits: [{ zh: '冰面上有人凿洞钓鱼', en: 'someone ice-fishing through a hole' }] },
      { day: 5, weather: { zh: '阴', en: 'overcast' }, bits: [{ zh: '浴池的水汽从门缝里冒出来，在门框上结成冰溜子', en: 'bathhouse steam leaks out and freezes into icicles on the frame' }] },
      { day: 6, weather: { zh: '晴', en: 'clear' }, bits: [{ zh: '浴池最后一天，搓澡师傅不收钱', en: 'the bathhouse\'s last day; the scrubber charges nothing' }] },
      { day: 7, weather: { zh: '夜里无风，适合点灯', en: 'windless night, good for lanterns' }, bits: [{ zh: '冰灯里的蜡烛要用玻璃罩挡风', en: 'candles in the ice lanterns need glass shades' }] },
      { day: 8, weather: { zh: '清晨大雾', en: 'thick morning fog' }, bits: [{ zh: '班车的排气管冒着白汽', en: 'white exhaust from the bus' }] },
      { day: 9, weather: { zh: '雪', en: 'snow' }, bits: [{ zh: '广播站的暖气片上烤着两个冻梨', en: 'two frozen pears thawing on the station radiator' }] },
      { day: 10, weather: { zh: '晴，没有风', en: 'clear, no wind' }, bits: [{ zh: '站台上的人比雪还多', en: 'more people on the platform than snow' }] },
    ],
    places: {
      coop: [{ zh: '清仓的牌子用红纸写着，墨冻住了', en: 'the clearance sign on red paper, the ink frozen' }],
      station: [{ zh: '候车室的铁炉子上烤着一排棉鞋', en: 'a row of cotton shoes drying on the waiting-room stove' }],
      boiler: [{ zh: '煤堆上落着一层雪，雪上有一串猫脚印', en: 'snow on the coal heap, a line of cat prints across it' }],
      street: [{ zh: '主街两边的冰溜子有一人高', en: 'icicles along the main street as tall as a person' }],
      radio: [{ zh: '广播站的窗户糊着报纸挡风', en: 'the station windows papered over against the wind' }],
    },
    any: [{ zh: '说话呼出的白气', en: 'breath like smoke' }, { zh: '冻梨泡在凉水里缓一宿，外面结一层冰壳', en: 'frozen pears soaking overnight, growing an ice crust' }],
  },

  gags: [
    { id: 'han-coal', who: ['hanshifu'], text: { zh: '韩师傅高兴了添一锹煤，不高兴也添一锹，「我」开始用添煤的力度猜他的心情。', en: 'Master Han adds a shovel of coal when he\'s happy and when he\'s not; I start guessing his mood by how hard he shovels.' }, places: ['boiler'] },
    { id: 'meng-time', who: ['mengzhan'], text: { zh: '孟站长报时报到秒，「我」的手机慢了两分钟，他非要帮「我」调。', en: 'Stationmaster Meng gives the time to the second; my phone is two minutes slow, and he insists on fixing it.' }, places: ['station'] },
    { id: 'batu-song', who: ['batu'], text: { zh: '巴特尔一喝奶茶就哼长调，哼到一半忘词，就改成锅炉房的口令。', en: 'Batu hums a long-song whenever he drinks milk tea; when he forgets the words he switches to boiler-room shift calls.' } },
    { id: 'nainai-sewing', who: ['nainai'], text: { zh: '奶奶说「孩儿啊」的时候低头摆弄针线笸箩，说明下一句是要紧话。', en: 'When Grandma says "child" and fiddles with her sewing basket, the next sentence matters.' } },
  ],

  gossip: [
    { id: 'g-nainai', from: 'nainai', about: 'donghe', truth: 'true', text: { zh: '「韩家一个纸箱都没要。孩儿啊，你说这是咋回事。」', en: '"The Hans didn\'t take a single box. Child, what do you make of that."' } },
    { id: 'g-meng', from: 'mengzhan', about: 'yanqiu', truth: 'true', fromDay: 2, text: { zh: '「许家丫头跟我约好了，最后一声汽笛归她录。正点。」', en: '"The Xu girl and I have a deal: the last whistle is hers to record. On the dot."' } },
    { id: 'g-batu', from: 'batu', about: 'wulan', truth: 'half', text: { zh: '「乌兰？开春走。开春……对，开春。」——说完喝了一大口奶茶。', en: '"Wulan? Leaving in spring. Spring... yes, spring." Then a long gulp of milk tea.' } },
    { id: 'g-han', from: 'hanshifu', about: 'donghe', truth: 'false', fromDay: 3, text: { zh: '「她开春去市里念书……念书好。」', en: '"She\'s off to school in the city in spring... school\'s good."' } },
  ],

  people: {
    donghe: {
      quirks: [{ zh: '「咋的」「可拉倒吧」', en: '"What?" "Give me a break"' }],
      habits: [{ zh: '损人三句就塞吃的', en: 'three insults, then food in your hand' }, { zh: '被说中就去捅炉子', en: 'pokes the stove when you hit a nerve' }],
      contradiction: { zh: '对谁都说「我们家也搬」，家里一样没打包', en: 'tells everyone "we\'re moving too", hasn\'t packed a thing' },
      growth: { zh: '从一个人扛，到让她爸知道', en: 'from carrying it alone to letting her father know' },
      diaryVoice: {
        style: { zh: '写在供销社的旧账本上，东北话，错别字，句号用得很少', en: 'in an old co-op ledger, dialect, typos, few full stops' },
        hides: { zh: '退掉的名额', en: 'the transfer she gave up' },
        seesMe: [
          { zh: '怕冷的南方人', en: 'the cold-shy southerner' },
          { zh: '还是小时候那个远子', en: 'still the Yuanzi from back then' },
          { zh: '他也要坐那班车走', en: 'he\'s leaving on that train too' },
          { zh: '唯一知道名额的人', en: 'the only one who knows about the transfer' },
          { zh: '想把帽子给他', en: 'I want to give him the hat' },
        ],
      },
      dejaVu: [{ zh: '「咋的，这雪球你咋躲开了？」', en: '"What? How\'d you dodge that snowball?"' }],
      awayVoice: [{ zh: '「远子，炉子还热着呢。你人呢。」', en: '"Yuanzi, the stove\'s still warm. Where are you."' }],
    },
    wulan: {
      quirks: [{ zh: '叫全名「陈远」', en: 'uses my full name, "Chen Yuan"' }, { zh: '开口前要想一会儿', en: 'thinks before speaking' }],
      habits: [{ zh: '在草稿纸背面画平面图', en: 'draws floor plans on the backs of worksheets' }],
      contradiction: { zh: '雕的是会化的东西，要的是留下来的东西', en: 'carves what melts, wants what lasts' },
      growth: { zh: '从一个人凿冰，到把火柴递出去', en: 'from carving alone to handing over the matches' },
      diaryVoice: {
        style: { zh: '短句，完整，像测量记录：哪一户、几格窗、冰里有没有气泡', en: 'short complete sentences, like survey notes: which house, how many panes, whether the ice has bubbles' },
        hides: { zh: '第 8 天走', en: 'leaving on Day 8' },
        seesMe: [
          { zh: '陈远，同桌', en: 'Chen Yuan, deskmate' },
          { zh: '会拉爬犁的人', en: 'someone who can pull a sledge' },
          { zh: '他看见了冰城', en: 'he has seen the ice town' },
          { zh: '我想让他点那一座', en: 'I want him to light that one' },
          { zh: '开春之前', en: 'before spring' },
        ],
      },
      dejaVu: [{ zh: '「陈远。你奶奶家的窗户……我好像已经问过你了。」', en: '"Chen Yuan. Your grandmother\'s windows... I think I\'ve asked you before."' }],
      awayVoice: [{ zh: '「冰没化。」', en: '"The ice hasn\'t melted."' }],
    },
    yanqiu: {
      quirks: [{ zh: '对话筒字正腔圆，对人卡第一个字', en: 'fluent into a mic, stuck on the first word face to face' }],
      habits: [{ zh: '递纸条', en: 'passes notes' }, { zh: '紧张时把话筒拿在手里', en: 'holds the mic when nervous' }],
      contradiction: { zh: '替全镇说告别，自己的那句不敢播', en: 'broadcasts the whole town\'s goodbyes, can\'t air her own' },
      growth: { zh: '从纸条到当面说', en: 'from notes to saying it aloud' },
      diaryVoice: {
        style: { zh: '广播稿格式，标点精确；页边有小字，比正文刻薄', en: 'broadcast-script format, precise punctuation; marginal notes sharper than the text' },
        hides: { zh: '最后一盘磁带录的是什么', en: 'what\'s on the last tape' },
        seesMe: [
          { zh: '陈家奶奶的外孙（已播报）', en: 'Grandma Chen\'s grandson (announced on air)' },
          { zh: '拎磁带的', en: 'the tape-carrier' },
          { zh: '他会听见吗', en: 'will he hear it' },
          { zh: '我可以不用纸条对他说话', en: 'I can talk to him without notes' },
          { zh: 'B 面', en: 'side B' },
        ],
      },
      dejaVu: [{ zh: '（纸条）「这句我好像写过。」', en: '(note) "I think I\'ve written this before."' }],
      awayVoice: [{ zh: '「各位听众，陈远同学今天缺席。」', en: '"Dear listeners, Chen Yuan is absent today."' }],
    },
    nainai: { quirks: [{ zh: '「孩儿啊」', en: '"Child"' }], habits: [{ zh: '说要紧话前摆弄针线笸箩', en: 'fiddles with her sewing basket before saying something important' }] },
    hanshifu: { quirks: [{ zh: '一句话分三截', en: 'speaks in three broken pieces' }], habits: [{ zh: '添煤', en: 'adds coal' }] },
    mengzhan: { quirks: [{ zh: '「十点零七，正点」', en: '"Ten-oh-seven, on time"' }] },
    batu: { quirks: [{ zh: '词序有点倒', en: 'word order a little scrambled' }], habits: [{ zh: '喝奶茶哼长调', en: 'hums long-song over milk tea' }] },
  },
}
