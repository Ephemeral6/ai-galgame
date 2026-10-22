// 原创剧本包《白桦岭的最后一班车》：东北林区小镇，整体搬迁前的十天。
// 致敬「雪国小镇 / 冬日 / 青梅竹马与离别」这一类恋爱冒险题材，人物与情节全部原创。

import type { Pack } from '../../types'

export const SNOW: Pack = {
  id: 'snow',
  version: '1.0.0',
  defaultLang: 'zh',
  langs: ['zh', 'en'],
  author: 'ai-galgame contributors',
  source: 'original',
  notes: {
    zh: `这是一个原创致敬包，致敬的是恋爱冒险游戏里「雪国小镇」这一类题材：主角在冬天回到久别的小地方，雪把时间放慢，几段感情各自通向一场离别，大雪、车站和倒计时一起构成情绪的骨架。
我们只借用这种题材的结构与氛围——冬日小镇、重逢的青梅竹马、以离别为终点的倒计时——把舞台换成中国东北的林区小镇：停伐后整体搬迁、绿皮车支线停运、锅炉房和澡堂一家家熄火。人物、情节、地名、台词与道具均为原创，不对应任何具体作品。`,
    en: `An original homage pack. It pays tribute to a familiar kind of romance adventure story: the "snow-country town" tale, where the hero returns to a half-forgotten place in winter, snow slows time down, and every relationship quietly leads toward a parting, with the station and the countdown as its emotional spine.
We borrow only the structure and atmosphere of that genre (a winter town, a childhood friend met again, a countdown that ends in goodbye) and move the stage to a logging town in northeast China: logging has stopped, the whole town is being relocated, the branch-line train is being retired, and the boiler rooms and bathhouses are going cold one by one. All characters, events, place names, lines and objects are original and do not correspond to any specific work.`,
  },
  title: { zh: '白桦岭的最后一班车', en: 'Last Train from Birch Ridge' },
  subtitle: { zh: '东北林区小镇 · 整体搬迁前的十天', en: 'A northeastern logging town, ten days before it empties' },
  premise: {
    zh: `第一人称「我」叫陈远，十七岁，小名「远子」。小学毕业那年跟爸妈搬去了南方，五年没回过白桦岭——大兴安岭南麓、挨着内蒙古边界的一个林业局小镇。
林场停伐以后，全镇要整体搬迁到四百里外的市里新小区。林区支线的绿皮车腊月二十三（第 10 天）开完最后一班就停运，铁轨开春就拆。寒假里，「我」被派回来帮奶奶打包搬家，也坐那最后一班车走。
零下三十度，窗户上结着霜花，家家户户的门口堆着捆好的纸箱。`,
    en: `The first-person narrator ("I") is Chen Yuan, seventeen, nicknamed "Yuanzi". The year I finished primary school my parents moved us south, and I have not been back to Birch Ridge in five years: a forestry-bureau town on the southern slopes of the Greater Khingan range, right by the Inner Mongolia border.
Logging has stopped, and the whole town is being relocated to new apartment blocks in a city four hundred li away. The old green branch-line train runs for the last time on the 23rd of the twelfth lunar month (Day 10); the rails come up in spring. Over winter break I have been sent back to help Grandma pack, and I will leave on that last train with her.
It is thirty below. Frost ferns cover the windows, and every doorway is stacked with taped-up cardboard boxes.`,
  },
  style: {
    zh: `文风：国产北方小城文学的质感，克制、具体、冷热分明。写冷要写到身上：呵出的白气、睫毛结霜、手套冻得发硬、铁栏杆粘手；写热要写到屋里：暖气片咕噜响、火炕、澡堂的蒸汽、炉子上烤着的土豆。多写动作和物件，少写抽象心理。
东北话点到为止（「咋的」「整」「贼冷」），不要满篇网络梗。每个人的说话方式必须分得开。离别写得克制，不哭天抢地；搬迁没有反派，只有一个时代在收尾。
禁忌：不要出现任何日本元素（前后辈称呼、神社、祭典、樱花、和式点心）；不要失忆、超自然、天使、车祸或旧日事故的桥段；不要用「命运」「羁绊」这类空词。`,
    en: `Style: understated small-town fiction from northern China, concrete, with a sharp contrast between cold and warmth. Cold should be felt on the body: breath turning white, frost on eyelashes, gloves frozen stiff, fingers sticking to iron railings. Warmth belongs indoors: radiators gurgling, a heated brick kang, bathhouse steam, potatoes roasting on a stove. Favor actions and objects over abstract inner monologue.
A light touch of northeastern dialect is fine; no internet memes. Every character must sound distinct. Goodbyes stay restrained, never melodramatic. The relocation has no villain; an era is simply closing.
Never: anything Japanese (senpai/kohai, shrines, festivals in the matsuri sense, cherry blossoms, Japanese sweets); amnesia, the supernatural, angels, car crashes or a tragic accident in the past; empty words like "destiny" or "bond".`,
  },
  me: { zh: '我', en: 'Me' },
  days: 10,
  slots: [{ zh: '上午', en: 'Morning' }, { zh: '下午', en: 'Afternoon' }, { zh: '夜里', en: 'Night' }],
  dayLabel: { zh: '第 {n} 天', en: 'Day {n}' },
  chapters: [
    { from: 1, title: { zh: '第一章 · 回到白桦岭', en: 'Ch.1 · Back to Birch Ridge' } },
    { from: 4, title: { zh: '第二章 · 清仓', en: 'Ch.2 · Clearance Sale' } },
    { from: 7, title: { zh: '第三章 · 冰灯', en: 'Ch.3 · Ice Lanterns' } },
    { from: 10, title: { zh: '终章 · 腊月二十三', en: 'Finale · The Twenty-Third' } },
  ],
  places: [
    { id: 'school', name: { zh: '镇中学补课班', en: 'Winter Cram Class' }, mood: { zh: '暖气片烫手，窗户上一层霜，粉笔冻得写不出字', en: 'scalding radiators, frosted windows, chalk too cold to write' }, slots: [0] },
    { id: 'coop', name: { zh: '供销社', en: 'Co-op Store' }, mood: { zh: '玻璃柜台、算盘、门口论堆卖的冻梨冻柿子', en: 'glass counters, an abacus, frozen pears and persimmons sold by the heap' }, slots: [0, 1] },
    { id: 'station', name: { zh: '小火车站', en: 'Branch-Line Station' }, mood: { zh: '一间候车室、一个铁炉子、扫不干净的站台', en: 'one waiting room, one iron stove, a platform no one can keep swept' }, slots: [0, 1] },
    { id: 'river', name: { zh: '河套冰场', en: 'Frozen River Bend' }, mood: { zh: '冻透的河面、锯开的冰块、冰车划过的白道子', en: 'the river frozen solid, sawn ice blocks, white tracks from sleds' }, slots: [1, 2] },
    { id: 'bath', name: { zh: '白桦岭浴池', en: 'Birch Ridge Bathhouse' }, mood: { zh: '棉门帘一掀全是白汽，门口挂着「本月底停业」', en: 'lift the quilted curtain and it is all steam; a sign says "Closing end of month"' }, slots: [1, 2] },
    { id: 'boiler', name: { zh: '锅炉房', en: 'Boiler House' }, mood: { zh: '煤堆、炉膛的红光、烟囱里冒出的白气', en: 'coal heaps, red light from the firebox, white plumes from the stack' }, slots: [1, 2] },
    { id: 'radio', name: { zh: '镇广播站', en: 'Town Broadcast Room' }, mood: { zh: '镇政府二楼，老式调音台、一摞磁带、窗外的大喇叭', en: 'second floor of the town office, an old mixing desk, stacks of cassettes, the loudspeaker outside' }, slots: [1, 2] },
    { id: 'street', name: { zh: '主街', en: 'Main Street' }, mood: { zh: '路灯下的烤地瓜炉子、门口的纸箱、还没点亮的冰灯坯子', en: 'a sweet-potato drum under the streetlight, boxes on doorsteps, ice lanterns not yet lit' }, slots: [2] },
  ],
  cast: [
    {
      id: 'donghe', name: { zh: '韩冬禾', en: 'Han Donghe' }, short: { zh: '冬禾', en: 'Donghe' }, color: '#ff7043',
      look: { zh: '橘红色狐狸团子，脖子上一条织歪了的绿围巾', en: 'a round orange-red fox with a lopsided hand-knit green scarf' },
      voice: {
        zh: '东北话，嘎嘣脆，句尾爱带「啊」「呗」，常说「咋的」「可拉倒吧」；损人不过三句就往你手里塞吃的；被说中心事就转身去捅炉子。叫「我」「远子」，生气时叫全名「陈远」。',
        en: 'Blunt northeastern speech, quick and crunchy, ends lines with "huh" or "c\'mon"; says "What, scared?" and "Oh, give it a rest"; teases you for three lines then shoves food into your hand; when you hit a nerve she turns away to poke the stove. Calls me "Yuanzi", my full name when she\'s mad.',
      },
      samples: [
        { zh: '哟，南方人回来啦？穿这点儿就敢出门，冻掉耳朵别找我哭啊。', en: 'Well, look who\'s back from the south. Dressed like that? If your ears freeze off, don\'t come crying to me.' },
        { zh: '拿着，冻梨，泡凉水里缓一宿的。……看啥看，又不是专门给你留的。', en: 'Here. Frozen pear, thawed in cold water overnight. ...What? I didn\'t save it for you or anything.' },
        { zh: '总得有人给这地方留一口热乎气吧，远子。', en: 'Somebody\'s got to keep a little warmth in this place, Yuanzi.' },
      ],
      secret: {
        zh: '全镇搬迁后林业局只留七户人守林防火，她爸是留守点的锅炉工。她已经偷偷把市里高中的转学名额退了，打算留下陪她爸过冬；对所有人都说「我们家也搬，就是晚点走」。家里一样东西都没打包。',
        en: 'After the relocation, the forestry bureau is keeping only seven households behind for fire watch, and her father will stoke the boiler for them. She has quietly given up her transfer place at the city high school to stay and keep him company through the winters. To everyone she says, "We\'re moving too, just later." Not one box at her house is packed.',
      },
      arc: [
        { zh: '重逢：在站台上一雪球砸过来，笑话「我」成了怕冷的南方人，转头又把自己的狗皮帽子扣到我头上。', en: 'Reunion: a snowball to the head on the platform, mockery for the cold-shy southerner, then she jams her own fur hat onto my head.' },
        { zh: '熟悉：一起去供销社抢清仓的冻柿子，在锅炉房炉膛边烤土豆，把仓房里的旧冰车拖出来再滑一次河套。', en: 'Familiar: fighting over clearance-sale persimmons, roasting potatoes by the boiler firebox, dragging the old ice sled out of the shed for one more run down the river.' },
        { zh: '心事：家家门口堆纸箱，只有她家门口干干净净；一问到搬家，她就岔开话题去骂天气。', en: 'Worries: boxes stand in every doorway except hers; ask about moving and she starts cursing the weather instead.' },
        { zh: '秘密：夜里的锅炉房，炉门一开一合，她承认自己不走了，「这烟囱一灭，这地方就真没了」。', en: 'Secret: in the boiler house at night, the firebox door swinging open and shut, she admits she is staying: "Once this chimney goes out, this place is really gone."' },
        { zh: '抉择：最后一班车开车前，劝她上车，还是答应她每年冬天回来，替她看一眼烟囱还冒不冒烟。', en: 'Choice: before the last train leaves, urge her to get on, or promise to come back every winter to see if the chimney is still smoking.' },
      ],
      haunts: { 0: ['school', 'coop'], 1: ['boiler', 'bath'], 2: ['boiler', 'street'] },
      deadline: { day: 10, text: { zh: '腊月二十三，最后一班绿皮车', en: 'the 23rd, the last green train' } },
      keepsakeIdeas: { zh: '一只泡在搪瓷盆里的冻梨、旧冰车上掉下来的铜铃铛、她织歪了的一只红手套', en: 'a frozen pear in an enamel basin, the brass bell off the old ice sled, one lopsided red mitten she knitted' },
      sprite: {
        pal: { B: '#e8673a', b: '#b4461f', L: '#fff3e6', A: '#3f9a6b', w: '#4a2414' },
        art: [
          '..B........B..',
          '..BB......BB..',
          '..BBBBBBBBBB..',
          '.BBBBBBBBBBBB.',
          '.BBBBBBBBBBBB.',
          '.BLLLBwwBLLLB.',
          '..LLLLLLLLLL..',
          '..AAAAAAAAAA..',
          '..BBLLLLLLBBA.',
          '..BBLLLLLLBBBB',
          '..bbbbbbbbbbBL',
          '...bb....bb...',
        ],
        eyes: [[4, 4], [4, 9]], cheeks: [[5, 3], [5, 10]], motion: 'tail',
      },
    },
    {
      id: 'wulan', name: { zh: '乌兰', en: 'Ulan' }, short: { zh: '乌兰', en: 'Ulan' }, color: '#4fc3f7',
      look: { zh: '浅棕色狍子，屁股一团白毛，头上一顶冰蓝色毛线帽', en: 'a light-brown roe deer with a white powder-puff rump and an ice-blue knit hat' },
      voice: {
        zh: '蒙古族，两年前随阿爸从牧区搬来林场。说话慢，开口前要想一会儿，句子短而完整，用词偏书面；偶尔冒一个蒙语词；从不开玩笑，却常常让人笑出来。叫「我」全名「陈远」。',
        en: 'Mongolian; moved from the grasslands to the forestry farm with her father two years ago. Speaks slowly, pauses before answering, in short complete sentences with slightly formal wording; now and then a Mongolian word slips in. Never tells jokes, yet often makes people laugh. Calls me by my full name, "Chen Yuan".',
      },
      samples: [
        { zh: '冰里有气泡，说明冻的那天风大。……你奶奶家的窗户，是六格的，对吗。', en: 'There are bubbles in the ice. It means the wind was strong the day it froze. ...Your grandmother\'s window has six panes. Is that right.' },
        { zh: '不用帮我。……好吧。锯子给你，那头。', en: 'You don\'t have to help me. ...Fine. Take the saw. That end.' },
        { zh: '冰会化。我知道。我只是想让它们先亮一次。', en: 'Ice melts. I know. I just want them to shine once first.' },
      ],
      secret: {
        zh: '她在河套冰场背风处用冰凿一整座缩小的白桦岭：每有一户人家搬走，她就把那户的房子雕出来，要在冰灯会那夜全部点亮。她家不跟大家去市里，第 8 天一早就坐班车回呼伦贝尔的牧区；她对谁都说「开春才走」。',
        en: 'In the lee of the river bend she is carving the whole of Birch Ridge in miniature out of ice: each time a family moves out, she carves their house, and she means to light every one on the night of the ice-lantern fair. Her family is not going to the city with everyone else; they take the bus back to the Hulunbuir grasslands early on Day 8. She tells everyone, "We leave in spring."',
      },
      arc: [
        { zh: '陌生：补课班同桌，她在草稿纸背面画房子的平面图，被「我」看见就默默翻过去。', en: 'Strangers: my deskmate in cram class draws house floor plans on the back of her scrap paper, and silently turns the page when I look.' },
        { zh: '熟悉：帮她从冻河里锯冰块、拉爬犁，她教「我」看冰的纹路，冻得说不出话时两个人一起跺脚。', en: 'Familiar: sawing ice blocks from the river and hauling them on a sledge; she teaches me to read the grain of ice, and when we are too cold to talk we stamp our feet in time.' },
        { zh: '心事：她开始雕「我」奶奶家，雕得特别慢，一遍遍问窗户几格、烟囱朝哪边，却不肯说为什么着急。', en: 'Worries: she starts carving Grandma\'s house, very slowly, asking again and again how many panes, which way the chimney faces, but will not say why she is in a hurry.' },
        { zh: '秘密：冰雕小镇只差最后一栋时，她承认冰灯会第二天一早就走，「我想让它们在有人住的时候亮一次」。', en: 'Secret: with one house left to carve, she admits she leaves the morning after the fair: "I want them lit once while people still live in them."' },
        { zh: '抉择：冰灯会那夜，帮她点亮整座冰雕小镇，并在她走之前说出心意，或者只是替她把最后一栋雕完。', en: 'Choice: on the fair night, help her light the whole ice town and tell her how I feel before she goes, or simply finish the last house for her.' },
      ],
      haunts: { 0: ['school'], 1: ['river'], 2: ['river', 'street'] },
      deadline: { day: 8, text: { zh: '清晨回牧区的班车', en: 'the early bus back to the grasslands' } },
      keepsakeIdeas: { zh: '一小块包着气泡的透明冰（注定会化）、画着奶奶家六格窗户的草稿纸、她用过的旧冰凿', en: 'a small clear block of ice with bubbles inside (bound to melt), the scrap paper with Grandma\'s six-pane window, her worn ice chisel' },
      sprite: {
        pal: { B: '#b07a4f', b: '#8a5a35', L: '#fbf3e8', A: '#4fc3f7', w: '#3a2a20' },
        art: [
          '.BB...AA...BB.',
          '.BBBAAAAAABBB.',
          '..BAAAAAAAAB..',
          '..BBBBBBBBBB..',
          '..BBBBBBBBBB..',
          '..BBBLwwLBBB..',
          '...BBLLLLBB...',
          '..bBBBBBBBBb..',
          '..bBBLLLLBBb..',
          '...b.b..b.b...',
        ],
        eyes: [[4, 4], [4, 9]], cheeks: [[5, 3], [5, 10]], motion: 'ears',
      },
    },
    {
      id: 'yanqiu', name: { zh: '许砚秋', en: 'Xu Yanqiu' }, short: { zh: '砚秋', en: 'Yanqiu' }, color: '#b39ddb',
      look: { zh: '黑白相间的喜鹊，戴一副淡紫色的大耳机', en: 'a black-and-white magpie wearing big lavender headphones' },
      voice: {
        zh: '对着话筒是标准播音腔，字正腔圆、一口气不带停；面对面却会卡在第一个字上，于是改用递纸条、或者干脆把话筒拿在手里说。冷幽默，纸条上的字比嘴上的话刻薄。叫「我」「陈远同学」。',
        en: 'On the mic she is flawless broadcast voice, crisp and unbroken; face to face she catches on the first word, so she passes notes instead, or simply holds the microphone while she talks. Dry humor; her notes are sharper than her speech. Calls me "Classmate Chen Yuan".',
      },
      samples: [
        { zh: '各位听众晚上好，这里是白桦岭之声。今天零下三十一度，陈家奶奶的外孙从南方回来了，请大家路上见了打个招呼。', en: 'Good evening, listeners, this is Birch Ridge Calling. Tonight it is thirty-one below, and Grandma Chen\'s grandson is back from the south. Say hello if you pass him on the road.' },
        { zh: '（纸条）你、你别等我说完。我写得比较快。', en: '(Note) D-don\'t wait for me to finish. I write faster.' },
        { zh: '……这、这盘磁带，你别听。等车开了，再、再听。', en: '...Th-this tape, don\'t listen to it. Not until the train has l-left.' },
      ],
      secret: {
        zh: '她从小口吃，只有对着话筒才说得顺，所以原播音员调走后她主动接了广播站。这半个月她扛着录音机挨家挨户录告别留言，要在最后一期节目里播给全镇；最后一盘磁带是她录给「我」的，她录了又擦、擦了又录，不敢播。',
        en: 'She has stammered since childhood and speaks freely only into a microphone, which is why she took over the broadcast room when the old announcer was transferred. For two weeks she has been carrying a recorder door to door, taping every family\'s farewell for the final broadcast. The last cassette is one she recorded for me; she has erased and re-recorded it over and over, and does not dare air it.',
      },
      arc: [
        { zh: '陌生：夜里广播里她把「我」回镇的事播给了全镇，第二天在车站碰见，她只点了点头，一个字没说。', en: 'Strangers: on the night broadcast she announces my return to the entire town; when we meet at the station next day she only nods and says nothing.' },
        { zh: '熟悉：帮她扛录音机挨家挨户录告别留言，发现她递纸条比说话快，纸条上的吐槽比谁都毒。', en: 'Familiar: carrying her recorder from house to house for farewells; I learn her notes come faster than her words, and her written jokes are the meanest in town.' },
        { zh: '心事：她在广播里越说越好，面对面却卡得越来越多；她反复擦掉同一盘磁带，标签上什么也没写。', en: 'Worries: she gets better on air and stammers more in person; she keeps erasing the same cassette, its label left blank.' },
        { zh: '秘密：广播站关了灯，她把话筒推开又拉回来，隔着话筒对「我」说出口吃的事，和那盘没敢播的磁带。', en: 'Secret: lights off in the broadcast room, she pushes the mic away and pulls it back, and through it tells me about her stammer, and the tape she never dared play.' },
        { zh: '抉择：最后一期《白桦岭之声》，让她把那盘磁带播给全镇，还是关掉话筒，让她当面说，不管卡多少次。', en: 'Choice: on the last Birch Ridge Calling, let her air the tape to the whole town, or switch the mic off and let her say it to my face, however many times she stumbles.' },
      ],
      haunts: { 0: ['station', 'coop'], 1: ['radio', 'coop'], 2: ['radio'] },
      deadline: { day: 9, text: { zh: '最后一期《白桦岭之声》，广播站停播', en: 'the final Birch Ridge Calling; the station goes silent' } },
      keepsakeIdeas: { zh: '标签空白的磁带、写满吐槽的纸条、广播站门口的旧节目单', en: 'a cassette with a blank label, a note full of snark, the old program sheet from the broadcast-room door' },
      sprite: {
        pal: { B: '#2b2f3a', b: '#3d5a99', L: '#f2f2f2', A: '#b39ddb', w: '#6b6b78' },
        art: [
          '....AAAAAA....',
          '...A.BBBB.A...',
          '..ABBBBBBBBA..',
          '..ABBBBBBBBA..',
          '..BBLBBBBLBB..',
          '..BBBBwwBBBB..',
          '.bBLLLLLLLLBb.',
          'bbBLLLLLLLLBbb',
          '.bBBLLLLLLBBb.',
          '...BBBBBBBB...',
          '....w....w....',
        ],
        eyes: [[4, 4], [4, 9]], cheeks: [[5, 3], [5, 10]], motion: 'wings',
      },
    },
  ],
  stages: [
    { zh: '重逢', en: 'Reunion' }, { zh: '熟悉', en: 'Familiar' }, { zh: '心事', en: 'Worries' }, { zh: '秘密', en: 'Secret' }, { zh: '抉择', en: 'Choice' },
  ],
  gates: [
    { affection: 0, scenes: 0 },
    { affection: 3, scenes: 1 },
    { affection: 6, scenes: 2 },
    { affection: 9, scenes: 4 },
    { affection: 12, scenes: 5 },
  ],
  events: [
    { day: 1, text: { zh: '坐绿皮车回到白桦岭；林业局贴出公告：腊月二十三支线停运，全镇搬迁', en: 'Arrive by green train; the forestry bureau posts notice: the branch line closes on the 23rd, the whole town relocates' } },
    { day: 2, text: { zh: '镇中学寒假补课开始，这是最后一期', en: 'Winter cram classes begin at the town school, for the last time' } },
    { day: 4, text: { zh: '供销社清仓甩卖，冻梨冻柿子论堆卖', en: 'Co-op clearance sale: frozen pears and persimmons by the heap' } },
    { day: 5, text: { zh: '第一批人家搬走，解放卡车拉着家具出镇', en: 'The first families leave; trucks haul furniture out of town' } },
    { day: 6, text: { zh: '白桦岭浴池最后一天营业', en: 'The bathhouse\'s last day open' } },
    { day: 7, text: { zh: '最后一届河套冰灯会', en: 'The last ice-lantern fair at the river bend' } },
    { day: 8, text: { zh: '清晨，乌兰家回牧区的班车', en: 'Early morning: Ulan\'s family takes the bus back to the grasslands' } },
    { day: 9, text: { zh: '最后一期《白桦岭之声》，广播站停播', en: 'The final Birch Ridge Calling; the broadcast room shuts down' } },
    { day: 10, text: { zh: '腊月二十三小年，最后一班绿皮车', en: 'Little New Year, the 23rd: the last green train' } },
  ],
  fixed: [
    { day: 7, slot: 2, place: { zh: '河套冰灯会', en: 'Ice-Lantern Fair' }, mood: { zh: '冰灯一盏盏亮起来，冻河上挤满了全镇的人，最后一次', en: 'ice lanterns lighting one by one, the whole town crowded onto the frozen river, one last time' }, title: { zh: '最后一届冰灯会', en: 'The Last Lantern Fair' }, cast: ['donghe', 'wulan', 'yanqiu'] },
    { day: 9, slot: 2, place: { zh: '镇广播站', en: 'Town Broadcast Room' }, mood: { zh: '大喇叭最后一次响彻全镇，窗外家家亮着灯在听', en: 'the loudspeaker carries over town one last time; every lit window is listening' }, title: { zh: '最后一期《白桦岭之声》', en: 'The Final Broadcast' }, cast: ['yanqiu'] },
    { day: 10, slot: 1, place: { zh: '小火车站站台', en: 'Station Platform' }, mood: { zh: '绿皮车喷着白汽进站，站台上挤满送行的人和打包的行李', en: 'the green train pulls in trailing steam; the platform is packed with luggage and people seeing others off' }, title: { zh: '最后一班车', en: 'The Last Train' }, cast: ['donghe', 'yanqiu'] },
  ],
  proactiveAfter: 2,
  endings: [
    { id: 'donghe-true', who: 'donghe', tier: 3, minStage: 4, minAffection: 12, maxBroken: 0, title: { zh: '一口热乎气', en: 'Keeping the Fire Lit' }, brief: { zh: '车开了，她留在站台上没有哭，冲你比了个「明年」的手势；你答应每年冬天回来，她答应烟囱一直冒烟。隔着四百里的恋爱结局。', en: 'The train pulls out; she stays on the platform and does not cry, just signs "next year" at you. You promise to come back every winter; she promises the chimney will keep smoking. A romance across four hundred li.' } },
    { id: 'wulan-true', who: 'wulan', tier: 3, minStage: 4, minAffection: 12, maxBroken: 0, title: { zh: '开春之前', en: 'Before the Thaw' }, brief: { zh: '冰灯会那夜整座冰雕白桦岭亮了起来，她把冰雕的奶奶家指给你看，窗户是六格的；第二天清晨班车开走前，她说开春冰化了就给你写信。恋爱结局。', en: 'On the fair night the whole ice-carved Birch Ridge lights up and she shows you Grandma\'s house, six panes in the window. Before the bus leaves next morning, she says she will write when the ice melts in spring. Romance ending.' } },
    { id: 'yanqiu-true', who: 'yanqiu', tier: 3, minStage: 4, minAffection: 12, maxBroken: 0, title: { zh: '这里是白桦岭之声', en: 'This Is Birch Ridge Calling' }, brief: { zh: '最后一期广播，她关掉话筒，当着你的面一个字一个字地说完了，卡了很多次，但说完了；全镇都没听见，只有你听见。恋爱结局。', en: 'On the last broadcast she switches the mic off and says it to your face, word by word, stumbling many times, but finishing. The town hears none of it; only you do. Romance ending.' } },
    { id: 'donghe-near', who: 'donghe', tier: 2, minStage: 3, title: { zh: '冰车还在仓房里', en: 'The Sled Is Still in the Shed' }, brief: { zh: '恋人未满：她还是留下了，你还是走了；她说冰车给你留着，你下回来了再一起滑。', en: 'Not quite lovers: she stays and you go; she says she will keep the sled for you, for next time.' } },
    { id: 'wulan-near', who: 'wulan', tier: 2, minStage: 3, title: { zh: '窗户是六格的', en: 'Six Panes' }, brief: { zh: '恋人未满：她走后，你在补课班桌洞里找到那张草稿纸，奶奶家的窗户画得一格不差。', en: 'Not quite lovers: after she leaves, you find her scrap paper in the desk at cram class; Grandma\'s window is drawn pane for pane.' } },
    { id: 'yanqiu-near', who: 'yanqiu', tier: 2, minStage: 3, title: { zh: '磁带 B 面', en: 'Side B' }, brief: { zh: '恋人未满：车开以后，你在随身听里放那盘磁带，A 面是全镇的告别，B 面只有一句没说完的话。', en: 'Not quite lovers: after the train leaves, you play the tape on your Walkman. Side A is the whole town saying goodbye; side B holds a single unfinished sentence.' } },
    { id: 'together', tier: 1, minStage: 2, title: { zh: '全镇的合影', en: 'The Whole Town in One Photo' }, brief: { zh: '隐藏群像结局：你和三个人都走到了心事这一步，却没有和谁走到最后。最后一班车开车前，四个人在站台上挤着拍了一张合影，背后是冒烟的烟囱、没化的冰灯和广播站的大喇叭。', en: 'Hidden ensemble ending: you reached each of them, but went all the way with none. Before the last train, the four of you squeeze onto the platform for one photo, with the smoking chimney, the unmelted lanterns and the broadcast loudspeaker behind you.' } },
    { id: 'normal', tier: 0, title: { zh: '车窗上的霜', en: 'Frost on the Window' }, brief: { zh: '普通结局：你帮奶奶搬完了家，坐上最后一班车；车窗结了霜，你用手指划开一道，白桦岭在后面越来越小。', en: 'Normal ending: you finish packing Grandma\'s house and board the last train. Frost covers the window; you draw a line through it with a finger and watch Birch Ridge grow small behind you.' } },
  ],
  finale: { zh: '最后一句点题「最后一班车」或「白桦岭」，落在一个具体的冬天画面上（铁轨、烟囱、霜花之一）。', en: 'The last sentence should echo the title, the last train or Birch Ridge, and land on one concrete winter image (rails, a chimney, or frost on glass).' },
  loading: [
    { zh: '暖气片咕噜响了一声…', en: 'The radiator gives a low gurgle...' },
    { zh: '窗户上的霜花又厚了一层…', en: 'The frost ferns on the window thicken...' },
    { zh: '远处，绿皮车拉了一声长笛…', en: 'Far off, the green train sounds one long whistle...' },
    { zh: '锅炉房的烟囱冒着白气…', en: 'White steam rises from the boiler-house chimney...' },
    { zh: '大喇叭里沙沙地响了一阵…', en: 'The loudspeaker crackles for a while...' },
  ],
}
