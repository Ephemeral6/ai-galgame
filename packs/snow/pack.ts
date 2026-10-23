// 原创剧本包《白桦岭的最后一班车》：东北林区小镇，整体搬迁前的十天。
// 致敬「雪国小镇 / 冬日 / 青梅竹马与离别」这一类恋爱冒险题材，人物与情节全部原创。

import type { Pack } from '../../types'
import type { CraftFields } from '../../hooks/craft-types'
import { SNOW_CRAFT } from './craft'

export const SNOW: Pack & CraftFields = {
  id: 'snow',
  version: '1.1.0',
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
  npcs: [
    {
      id: 'nainai', name: { zh: '陈家奶奶', en: 'Grandma Chen' }, short: { zh: '奶奶', en: 'Grandma' }, color: '#c48b9f',
      role: {
        zh: '「我」的奶奶，在白桦岭住了五十年，这次跟「我」坐最后一班车走。镇上谁家的事她都知道一点，比如韩家一个纸箱都没要，比如广播站的灯亮到半夜。',
        en: 'My grandmother. Fifty years in Birch Ridge; she leaves with me on the last train. She knows a little about everyone, like the Han house never asking for a single box, or the broadcast-room light burning past midnight.',
      },
      look: { zh: '白色大鹅，头上系一条红头巾', en: 'a big white goose in a red headscarf' },
      voice: {
        zh: '东北老太太，慢悠悠，开口先叫「孩儿啊」，爱用老话和反问；说到要紧的事就低头摆弄炕上的针线笸箩；从不戳破谁，只拐着弯提醒。',
        en: 'An old northeastern lady, unhurried, opening with "child"; fond of old sayings and questions that answer themselves; when something matters she busies herself with the sewing basket on the kang. She never exposes anyone, only nudges.',
      },
      samples: [
        { zh: '孩儿啊，那箱子里的碗别拿报纸包，拿棉袄包，到了市里冬天还得穿。', en: 'Child, don\'t wrap those bowls in newspaper. Wrap them in the padded coat. You\'ll still need the coat in the city.' },
        { zh: '韩家那丫头，一个箱子都没跟我要。你说怪不怪？', en: 'That Han girl hasn\'t asked me for a single box. Odd, wouldn\'t you say?' },
        { zh: '人走了，地方还在。地方没了，人还记着。一样的。', en: 'When people leave, the place stays. When the place goes, people remember it. Same thing.' },
      ],
      haunts: { 0: ['coop'] },
      sprite: {
        pal: { W: '#f4f1ea', w: '#cfc8bc', R: '#c62f3a', O: '#f39c34' },
        art: [
          '.....RRRR.....',
          '....RRRRRR....',
          '....RWWWWR....',
          '....WWWWWW....',
          '....WWWWWW....',
          '....WWOOWW....',
          '.....WWWW.....',
          '..WWWWWWWWWW..',
          '.WWWWWWWWWWWW.',
          '.wWWWWWWWWWWw.',
          '..wwwwwwwwww..',
          '....OO..OO....',
        ],
        eyes: [[4, 5], [4, 8]], cheeks: [[5, 4], [5, 9]], motion: 'wings',
      },
    },
    {
      id: 'hanshifu', name: { zh: '韩师傅', en: 'Old Han' }, short: { zh: '韩师傅', en: 'Old Han' }, color: '#90a4ae',
      role: {
        zh: '韩冬禾的爸爸，林场锅炉工，烧了二十三年锅炉；搬迁后留在守林点烧炉子。他以为闺女开春就去市里念书，不知道她把名额退了。',
        en: 'Donghe\'s father, boiler man at the forestry farm for twenty-three years; he stays behind to stoke the fire-watch boiler. He believes his daughter is off to the city high school in spring and does not know she gave up her place.',
      },
      look: { zh: '灰色的獾，头顶一道白，戴藏青色棉帽，爪子上全是煤灰', en: 'a grey badger with a white stripe, a navy padded cap and coal dust on his paws' },
      voice: {
        zh: '话少，一句话分三截说，中间全是省略号；三句不离炉子和煤；高兴了往炉膛添一锹煤，不高兴也添。叫「我」「陈家小子」。',
        en: 'Few words, each sentence broken into three pieces with long pauses; every topic returns to the stove and the coal; he shovels in more coal when happy and when not. Calls me "the Chen boy".',
      },
      samples: [
        { zh: '陈家小子。……坐。……炉子边上暖和。', en: 'Chen boy. ...Sit. ...It\'s warm by the stove.' },
        { zh: '这烟囱，我烧了二十三年。……它比我闺女岁数都大。', en: 'Twenty-three years I\'ve fed this chimney. ...It\'s older than my girl.' },
        { zh: '她念书的事，我跟她说好了。……她答应我了。', en: 'Her schooling\'s settled. I told her. ...She promised me.' },
      ],
      haunts: { 1: ['boiler'], 2: ['boiler'] },
      sprite: {
        pal: { C: '#3a3a3a', G: '#8a7058', g: '#5a4636', W: '#f0f0f0', L: '#e2d6c6' },
        art: [
          '...CCCCCCCC...',
          '..CCCCCCCCCC..',
          '.GGGGWWWWGGGG.',
          '.GGGGWWWWGGGG.',
          '.GGGGGWWGGGGG.',
          '.GGGGGWWGGGGG.',
          '..GGLLLLLLGG..',
          '.gGGGGGGGGGGg.',
          '.gGGGGGGGGGGg.',
          '..gg......gg..',
        ],
        eyes: [[3, 3], [3, 10]], cheeks: [[4, 2], [4, 11]], motion: 'bob',
      },
    },
    {
      id: 'mengzhan', name: { zh: '孟站长', en: 'Stationmaster Meng' }, short: { zh: '孟站长', en: 'Meng' }, color: '#5c7cba',
      role: {
        zh: '小火车站最后一任站长，干了三十一年，第 10 天要亲手给最后一班车发车。最后一期节目在第 9 天夜里播，他答应那天傍晚把车头开出来试鸣一声，让许砚秋在站台上录下来做节目的结尾。',
        en: 'The branch-line station\'s last stationmaster, thirty-one years on the job; on Day 10 he flags off the last train himself. Her last broadcast airs on the night of Day 9, so he has promised to run the engine out that evening and sound the whistle once for Yanqiu to record on the platform, to close the show.',
      },
      look: { zh: '灰白色的哈士奇，戴一顶藏蓝色铁路大檐帽', en: 'a grey-and-white husky in a navy railway peaked cap' },
      voice: {
        zh: '铁路腔，说话报点，「十点零七，正点」；爱讲哪年哪趟车晚过点；把每个人都当乘客招呼。叫「我」「这位旅客」。',
        en: 'Railway speech, always quoting times: "Ten-oh-seven, on the dot"; loves telling which train was late in which year; addresses everyone like a passenger. Calls me "this passenger here".',
      },
      samples: [
        { zh: '十点零七，正点。这趟车三十一年就晚过四回，回回都有说道。', en: 'Ten-oh-seven, on the dot. Thirty-one years and this train\'s been late four times. Every time there was a story.' },
        { zh: '上车的往里走，送人的别过白线。……习惯了，跟你也这么说。', en: 'Boarding passengers move inside, well-wishers behind the white line. ...Habit. I say it to you too.' },
        { zh: '最后一班车的路票，我留了一张空的。给谁，还没想好。', en: 'For the last train I\'ve kept one blank ticket. Haven\'t decided who it\'s for.' },
      ],
      haunts: { 0: ['station'], 1: ['station'] },
      sprite: {
        pal: { N: '#23345e', R: '#c0392b', A: '#7d8794', a: '#59626e', W: '#f5f5f5', K: '#222222' },
        art: [
          '...NNNNNNNN...',
          '..NNNNNNNNNN..',
          '..RRRRRRRRRR..',
          '.AAAAAAAAAAAA.',
          '.AAWWAAAAWWAA.',
          '.AAWWWAAWWWAA.',
          '..AWWWWWWWWA..',
          '...WWWKKWWW...',
          '..aAAWWWWAAa..',
          '..aAAAAAAAAa..',
          '...aa....aa...',
        ],
        eyes: [[5, 4], [5, 9]], cheeks: [[6, 3], [6, 10]], motion: 'bob',
      },
    },
    {
      id: 'batu', name: { zh: '巴特尔', en: 'Bater' }, short: { zh: '巴特尔', en: 'Bater' }, color: '#c0703a',
      role: {
        zh: '乌兰的阿爸，两年前带全家从牧区来林场，和韩师傅一个锅炉班组；第 8 天一早带全家坐班车回呼伦贝尔。对外说「开春才走」，是替女儿圆的话。',
        en: 'Ulan\'s father. Two years ago he brought the family from the grasslands to the forestry farm and shares a boiler shift with Old Han; early on Day 8 he takes them back to Hulunbuir. "We leave in spring" is a cover he keeps up for his daughter.',
      },
      look: { zh: '枣红色的马，戴一顶带护耳的狐皮帽', en: 'a chestnut horse in a fur hat with earflaps' },
      voice: {
        zh: '汉话说得慢、词序有点倒，嗓门大，笑声更大；一喝热奶茶就哼两句长调；叫「我」「南方来的小伙子」。',
        en: 'Slow Mandarin with the word order a little turned around, a big voice and a bigger laugh; hums a line of long-song whenever he drinks hot milk tea. Calls me "young fellow from the south".',
      },
      samples: [
        { zh: '南方来的小伙子，奶茶喝不？咸的，喝了就不冷了。', en: 'Young fellow from the south, milk tea, yes? Salty. Drink it and the cold goes.' },
        { zh: '老韩这个人，炉子比老婆还亲。……我这话你别跟他说。', en: 'Old Han loves that stove more than his wife. ...Don\'t tell him I said it.' },
        { zh: '草原上的雪，比这儿的软。乌兰说这儿的硬。她说的对。', en: 'Snow on the grassland is softer than here. Ulan says this snow is hard. She is right.' },
      ],
      haunts: { 1: ['river'], 2: ['boiler'] },
      sprite: {
        pal: { H: '#d9b07a', M: '#3b2618', B: '#9a5a2e', b: '#5e3a1a', L: '#d6b08a' },
        art: [
          '...HHHHHHHH...',
          '..HHHHHHHHHH..',
          '..HHMMMMMMHH..',
          '...BBBBBBBB...',
          '..BBBBBBBBBB..',
          '..BBBBBBBBBB..',
          '...BBBBBBBB...',
          '...BLLLLLLB...',
          '...BLMLLMLB...',
          '..bBBBBBBBBb..',
          '..bb......bb..',
        ],
        eyes: [[4, 3], [4, 10]], cheeks: [[5, 2], [5, 11]], motion: 'ears',
      },
    },
  ],
  relations: [
    { a: 'donghe', b: 'yanqiu', kind: { zh: '旧同学 · 心结', en: 'Old classmates · a knot' }, text: { zh: '小学三年级有男生学砚秋口吃，冬禾一拳把人打哭，被全校通报；砚秋那天一个「谢」字卡了一下午也没说出口。从那以后两人见面就别扭，冬禾以为砚秋嫌她粗。', en: 'In third grade a boy mocked Yanqiu\'s stammer and Donghe punched him to tears, earning a school-wide reprimand; Yanqiu spent the whole afternoon stuck on the first sound of "thank you" and never got it out. They have been awkward ever since; Donghe thinks Yanqiu finds her crude.' } },
    { a: 'donghe', b: 'hanshifu', kind: { zh: '父女', en: 'Father and daughter' }, text: { zh: '冬禾背着她爸把市里高中的名额退了；韩师傅以为闺女开春就去市里念书，还托人在市里租了间小屋。', en: 'Donghe gave up her city school place behind her father\'s back; Old Han thinks she starts there in spring and has even had someone rent her a little room in town.' }, hiddenUntil: 3 },
    { a: 'hanshifu', b: 'batu', kind: { zh: '老搭档', en: 'Shift partners' }, text: { zh: '两人在一个锅炉班组搭了两年班，一个留下一个走；谁都没提散伙酒的事，只是这几天抢着多上夜班。', en: 'Two years on the same boiler shift; one stays, one goes. Neither has mentioned a farewell drink; both just keep volunteering for the night shift.' } },
    { a: 'wulan', b: 'batu', kind: { zh: '父女', en: 'Father and daughter' }, text: { zh: '「开春才走」是阿爸替她说的；其实是乌兰求他晚点告诉大家，好把冰雕小镇雕完。', en: '"We leave in spring" is her father\'s line, said for her: Ulan begged him to tell people late so she could finish the ice town.' }, hiddenUntil: 3 },
    { a: 'nainai', b: 'me', kind: { zh: '祖孙', en: 'Grandmother and grandson' }, text: { zh: '奶奶什么都看在眼里，从不戳破；她会拐着弯提醒「我」谁家门口没纸箱、谁家窗户亮到半夜、谁天天往河套跑。', en: 'Grandma sees everything and exposes nothing; she nudges me sideways: whose doorstep has no boxes, whose window burns past midnight, who keeps running down to the river.' } },
    { a: 'yanqiu', b: 'mengzhan', kind: { zh: '录音之约', en: 'The recording' }, text: { zh: '孟站长答应第 9 天傍晚为砚秋试鸣一声汽笛，让她录进最后一期节目；砚秋对着他的对讲机说话，一个字都不卡。', en: 'Meng has promised to sound the whistle once on the evening of Day 9 so Yanqiu can put it on her last show; speaking into his walkie-talkie, she never stammers once.' } },
    { a: 'wulan', b: 'yanqiu', kind: { zh: '前后桌 · 默契', en: 'Desk neighbors · an unspoken pact' }, text: { zh: '乌兰每雕完一户人家，砚秋就去那户录告别；两人在补课班传纸条交换名单，谁也没问对方为什么。', en: 'Every time Ulan finishes carving a house, Yanqiu goes to tape that family\'s farewell; they swap lists by note in cram class and neither asks the other why.' } },
  ],
  acts: [
    {
      id: 'act1', from: 1, title: { zh: '第一幕 · 回到白桦岭', en: 'Act I · Back to Birch Ridge' },
      goal: { zh: '开端：「我」回到快要空掉的小镇，和三个人重新认识；每个人都说「晚点走」，每个人都在瞒点什么。', en: 'Opening: I return to a town about to empty and meet the three of them again; everyone says "we\'ll go later", and everyone is hiding something.' },
      beats: [
        { id: 'snow-arrival', day: 1, by: 1, who: ['donghe'], slots: [0, 1], places: ['station'], kind: { zh: '重逢', en: 'Reunion' }, text: { zh: '站台上冬禾一雪球砸过来，又把自己的狗皮帽子扣到「我」头上；墙上贴着停运搬迁的公告。', en: 'On the platform Donghe nails me with a snowball, then jams her own fur hat on my head; the relocation notice is pasted on the wall.' } },
        { id: 'snow-boxes', day: 2, by: 3, who: ['donghe', 'nainai'], kind: { zh: '伏笔', en: 'Foreshadowing' }, text: { zh: '「我」注意到家家门口都堆着纸箱，只有韩家门口干干净净；一问，冬禾就骂起了天气。', en: 'I notice boxes stacked at every door except the Hans\'; when I ask, Donghe starts cursing the weather.' } },
        { id: 'snow-recorder', day: 2, by: 3, who: ['yanqiu'], kind: { zh: '约定', en: 'A promise' }, text: { zh: '砚秋递来一张纸条：要扛着录音机挨家挨户录告别，缺一个拎磁带的人。', en: 'Yanqiu passes me a note: she is taping farewells door to door and needs someone to carry the cassettes.' }, promise: { zh: '答应陪她把全镇的告别录完，最后一期节目一定到场', en: 'promise to help her tape every farewell in town and be there for the final broadcast' } },
      ],
      hook: { zh: '奶奶在灯下数着纸箱，忽然说：「韩家那丫头，一个箱子都没跟我要。」', en: 'Counting boxes under the lamp, Grandma says out of nowhere: "That Han girl never asked me for a single box."' },
    },
    {
      id: 'act2', from: 4, title: { zh: '第二幕 · 清仓', en: 'Act II · Clearance Sale' },
      goal: { zh: '转折：第一批人家搬走，河套背风处的冰雕小镇露了出来，旧怨在澡堂的蒸汽里炸开；每个人的「晚点走」都开始站不住。', en: 'Turn: the first families leave, the ice town in the lee of the river comes to light, and an old grudge bursts open in the bathhouse steam; everyone\'s "later" starts to crack.' },
      beats: [
        { id: 'snow-icetown', day: 4, by: 5, who: ['wulan'], places: ['river'], kind: { zh: '发现', en: 'Discovery' }, text: { zh: '「我」跟着冰凿的声音找到河套背风处：半个白桦岭已经用冰雕好了，连供销社的算盘都有。', en: 'Following the sound of a chisel, I find the lee of the river bend: half of Birch Ridge already carved in ice, down to the co-op abacus.' }, promise: { zh: '答应冰灯会那夜帮她把整座冰雕小镇点亮', en: 'promise to help her light the whole ice town on the fair night' } },
        { id: 'snow-quarrel', day: 5, by: 6, who: ['donghe', 'yanqiu'], places: ['bath'], kind: { zh: '误会', en: 'Misunderstanding' }, text: { zh: '澡堂门口，冬禾听说砚秋录下了韩师傅的一段话，以为她要在广播里抖出去；两人当着「我」吵起来，谁都不肯说那段话到底是什么，三年级那件事倒是被翻了出来（只提一句，细节留到之后）。', en: 'Outside the bathhouse Donghe hears that Yanqiu taped something Old Han said and thinks she will air it; they fight in front of me, neither will say what was on the tape, and the third-grade incident comes up too (one line only, details later).' } },
        { id: 'snow-grandma', day: 6, by: 6, who: ['nainai'], places: ['bath'], kind: { zh: '点拨', en: 'A nudge' }, text: { zh: '浴池最后一天营业，奶奶在热水汽里跟「我」说：留下的人有留下的道理，别劝，陪着就行。', en: 'On the bathhouse\'s last day, in the steam, Grandma tells me: those who stay have their reasons; don\'t argue, just keep them company.' } },
      ],
      hook: { zh: '第一批卡车开走的那晚，河套背风处传来冰凿的声音，一下，又一下。', en: 'The night the first trucks leave, a chisel rings from the lee of the river, once, and again.' },
    },
    {
      id: 'act3', from: 7, title: { zh: '第三幕 · 冰灯与汽笛', en: 'Act III · Lanterns and the Whistle' },
      goal: { zh: '高潮：冰灯会、清晨的班车、最后一期广播、最后一班车；所有「晚点走」都到了点。', en: 'Climax: the lantern fair, the dawn bus, the last broadcast, the last train; every "later" falls due.' },
      beats: [
        { id: 'snow-lanterns', day: 7, by: 7, who: ['wulan'], kind: { zh: '高潮', en: 'Climax' }, text: { zh: '冰灯会那夜，整座冰雕白桦岭要不要点亮、由谁来点。', en: 'On the fair night: will the ice-carved Birch Ridge be lit, and by whose hand.' } },
        { id: 'snow-chimney', day: 8, by: 9, who: ['donghe', 'hanshifu'], places: ['boiler'], kind: { zh: '秘密曝光', en: 'Secret out' }, text: { zh: '韩师傅从市里来的电话里知道了名额被退的事，在锅炉房里第一次冲闺女吼；冬禾摔门出来，撞上「我」。', en: 'A phone call from the city tells Old Han the school place was turned down; in the boiler house he shouts at his daughter for the first time. Donghe storms out and runs into me.' }, promise: { zh: '答应每年冬天回来，替她看一眼烟囱还冒不冒烟', en: 'promise to come back every winter and check the chimney is still smoking' } },
        { id: 'snow-broadcast', day: 9, by: 9, who: ['yanqiu'], kind: { zh: '高潮', en: 'Climax' }, text: { zh: '最后一期《白桦岭之声》，A 面是全镇的告别，那盘没贴标签的磁带还在她手里。', en: 'The last Birch Ridge Calling: side A is the whole town saying goodbye, and the unlabeled cassette is still in her hand.' } },
      ],
    },
  ],
  incidents: [
    { id: 'whiteout', chance: 0.2, days: [2, 9], text: { zh: '白毛风刮起来，十步外看不见人，大家都往有炉子的地方挤。', en: 'A whiteout wind kicks up; you can\'t see ten steps ahead, and everyone crowds toward the nearest stove.' } },
    { id: 'pipes', chance: 0.25, days: [2, 8], slots: [0], who: ['nainai', 'hanshifu'], text: { zh: '奶奶家的暖气管冻裂了，韩师傅扛着喷灯来修，修完不肯喝一口水就走。', en: 'Grandma\'s radiator pipe freezes and splits; Old Han comes with a blowtorch, fixes it, and leaves without so much as a sip of water.' } },
    { id: 'powercut', chance: 0.2, slots: [2], text: { zh: '全镇停电，家家点起蜡烛，只有锅炉房的窗户还透着红光。', en: 'The whole town loses power; candles come out in every window, and only the boiler house still glows red.' } },
    { id: 'truck', chance: 0.25, days: [5, 9], slots: [0, 1], text: { zh: '又一辆解放卡车装满家具开出镇，车斗上绑着一盆冻死的君子兰。', en: 'Another truck loaded with furniture rolls out of town, a frozen-dead clivia lashed to the tailboard.' } },
    { id: 'photo', chance: 0.3, slots: [0], after: ['beat:snow-boxes'], who: ['nainai'], text: { zh: '打包时从奶奶的相框后面掉出一张旧合影：小学时的「我」、冬禾和砚秋挤在一辆冰车上。', en: 'While packing, an old photo slips from behind Grandma\'s frame: primary-school me, Donghe and Yanqiu squashed onto one ice sled.' } },
    { id: 'whistle', chance: 0.4, places: ['station'], who: ['mengzhan'], text: { zh: '孟站长在站台上刷最后一班车的车牌，招呼「我」帮把手。', en: 'Stationmaster Meng is repainting the last train\'s route board on the platform and waves me over to help.' } },
    { id: 'sledge', chance: 0.4, days: [2, 7], places: ['river'], who: ['batu'], text: { zh: '巴特尔赶着马爬犁从冻河上过来，车上是给乌兰拉的冰块，他冲「我」喊了一嗓子长调。', en: 'Bater drives a horse sledge across the frozen river with ice blocks for Ulan, and hollers a line of long-song at me.' } },
    { id: 'pears', chance: 0.3, places: ['coop'], text: { zh: '供销社把最后一盆冻梨白送，门口排起了长队，排队的人都在说去了市里住几楼。', en: 'The co-op gives away its last basin of frozen pears for free; the line out the door is all talk of which floor people will live on in the city.' } },
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
    { id: 'donghe-true', who: 'donghe', kind: 'true', tier: 4, minStage: 4, minAffection: 12, maxBroken: 0, keptKey: 'snow-chimney', title: { zh: '一口热乎气', en: 'Keeping the Fire Lit' }, brief: { zh: '真结局：你兑现了「每年冬天回来看烟囱」的约定的头一回——走前那一夜你陪韩师傅和她把锅炉房的煤码齐，父女俩在炉子前把话说开了。车开了，她留在站台上没有哭，冲你比了个「明年」的手势；她答应烟囱一直冒烟。隔着四百里的恋爱结局。', en: 'True ending: you keep the first round of your promise to come back for the chimney: on your last night you help Old Han and her stack the coal, and father and daughter finally talk it through by the firebox. The train pulls out; she stays on the platform and does not cry, just signs "next year" at you, and promises the chimney will keep smoking. A romance across four hundred li.' } },
    { id: 'donghe-good', who: 'donghe', kind: 'good', tier: 3, minStage: 4, minAffection: 12, maxBroken: 0, title: { zh: '站台上的狗皮帽子', en: 'The Fur Hat on the Platform' }, brief: { zh: '好结局：车开前她把狗皮帽子又扣回你头上，说「南方冬天也冷，别冻掉耳朵」；话没说满，但她把一只织歪的红手套塞进了你的兜里。那晚锅炉房里吼开的话还没收尾，她说剩下的，她自己回去跟她爸说完。', en: 'Good ending: before the train she jams the fur hat back on your head: "Southern winters are cold too, don\'t lose your ears." Not everything gets said, but she stuffs one lopsided red mitten into your pocket. What was shouted in the boiler room that night is still unfinished; she says she will go home and finish it with her father herself.' } },
    { id: 'donghe-bad', who: 'donghe', kind: 'bad', tier: 1, minStage: 2, minBroken: 1, title: { zh: '炉门关上了', en: 'The Firebox Door Shuts' }, brief: { zh: '坏结局：你答应过她的事没做到。她在锅炉房背对着你捅炉子，一句话没说；最后一班车开的时候，站台上没有她，只有烟囱照常冒着白气。', en: 'Bad ending: you did not keep your word to her. She pokes the stove with her back to you and says nothing; when the last train leaves she is not on the platform, only the chimney smoking as usual.' } },
    { id: 'wulan-true', who: 'wulan', kind: 'true', tier: 4, minStage: 4, minAffection: 12, maxBroken: 0, keptKey: 'snow-icetown', title: { zh: '开春之前', en: 'Before the Thaw' }, brief: { zh: '真结局：你守住了约定，冰灯会那夜和她一起把整座冰雕白桦岭点亮，她把冰雕的奶奶家指给你看，窗户是六格的；第二天清晨班车开走前，她说开春冰化了就给你写信。恋爱结局。', en: 'True ending: you keep your promise and light the whole ice-carved Birch Ridge with her on the fair night; she shows you Grandma\'s house, six panes in the window. Before the bus leaves next morning, she says she will write when the ice melts in spring. Romance ending.' } },
    { id: 'wulan-good', who: 'wulan', kind: 'good', tier: 3, minStage: 4, minAffection: 12, maxBroken: 0, title: { zh: '冰里的气泡', en: 'Bubbles in the Ice' }, brief: { zh: '好结局：冰雕小镇亮了一大半，最后一栋是你替她雕完的，歪了一点。班车开之前她把一小块带气泡的冰塞进你手心，说「化了也算数」。', en: 'Good ending: most of the ice town lights up; you finished the last house for her, a little crooked. Before the bus she presses a small bubbled block of ice into your palm: "It still counts after it melts."' } },
    { id: 'wulan-bad', who: 'wulan', kind: 'bad', tier: 1, minStage: 2, minBroken: 1, title: { zh: '冰化了', en: 'The Ice Melted' }, brief: { zh: '坏结局：答应她的事你没做到。冰灯会那夜她一个人点了一半就收了凿子；第二天班车开走时，冰雕的奶奶家塌了一角，没人去扶。', en: 'Bad ending: you broke your word. On the fair night she lights half the town alone and puts the chisel away; when the bus leaves next morning, a corner of Grandma\'s ice house has fallen in and no one props it up.' } },
    { id: 'yanqiu-true', who: 'yanqiu', kind: 'true', tier: 4, minStage: 4, minAffection: 12, maxBroken: 0, keptKey: 'snow-recorder', title: { zh: '这里是白桦岭之声', en: 'This Is Birch Ridge Calling' }, brief: { zh: '真结局：你陪她把全镇的告别录完了。最后一期广播，她关掉话筒，当着你的面一个字一个字地说完了，卡了很多次，但说完了；全镇都没听见，只有你听见。片尾是孟站长给的那声汽笛。恋爱结局。', en: 'True ending: you helped her tape every farewell in town. On the last broadcast she switches the mic off and says it to your face, word by word, stumbling many times, but finishing. The town hears none of it; only you do. The sign-off is Meng\'s train whistle. Romance ending.' } },
    { id: 'yanqiu-good', who: 'yanqiu', kind: 'good', tier: 3, minStage: 4, minAffection: 12, maxBroken: 0, title: { zh: '对讲机里的一句', en: 'One Line over the Walkie-Talkie' }, brief: { zh: '好结局：她还是没能当面说完，车开前借了孟站长的对讲机，在站台那头对你说了一句完整的话，一个字都没卡。', en: 'Good ending: she still cannot say it to your face, but before the train she borrows Meng\'s walkie-talkie and, from the far end of the platform, says one whole sentence to you without a single stumble.' } },
    { id: 'yanqiu-bad', who: 'yanqiu', kind: 'bad', tier: 1, minStage: 2, minBroken: 1, title: { zh: '空白标签', en: 'A Blank Label' }, brief: { zh: '坏结局：你答应的事没做到。最后一期节目播得一字不差，可她把那盘磁带擦干净了，标签空着交给孟站长，说「随便录点什么吧」。', en: 'Bad ending: you did not keep your promise. The last broadcast goes out flawless, but she erases the tape and hands it to Meng with the label blank: "Record anything on it."' } },
    { id: 'donghe-near', who: 'donghe', kind: 'normal', tier: 2, minStage: 3, maxBroken: 0, title: { zh: '冰车还在仓房里', en: 'The Sled Is Still in the Shed' }, brief: { zh: '恋人未满：她还是留下了，你还是走了；她说冰车给你留着，你下回来了再一起滑。', en: 'Not quite lovers: she stays and you go; she says she will keep the sled for you, for next time.' } },
    { id: 'wulan-near', who: 'wulan', kind: 'normal', tier: 2, minStage: 3, maxBroken: 0, title: { zh: '窗户是六格的', en: 'Six Panes' }, brief: { zh: '恋人未满：她走后，你在补课班桌洞里找到那张草稿纸，奶奶家的窗户画得一格不差。', en: 'Not quite lovers: after she leaves, you find her scrap paper in the desk at cram class; Grandma\'s window is drawn pane for pane.' } },
    { id: 'yanqiu-near', who: 'yanqiu', kind: 'normal', tier: 2, minStage: 3, maxBroken: 0, title: { zh: '磁带 B 面', en: 'Side B' }, brief: { zh: '恋人未满：车开以后，你在随身听里放那盘磁带，A 面是全镇的告别，B 面只有一句没说完的话。', en: 'Not quite lovers: after the train leaves, you play the tape on your Walkman. Side A is the whole town saying goodbye; side B holds a single unfinished sentence.' } },
    { id: 'together', kind: 'good', tier: 2, minStage: 2, title: { zh: '全镇的合影', en: 'The Whole Town in One Photo' }, brief: { zh: '隐藏群像结局：你和三个人都走到了心事这一步，却没有和谁走到最后。最后一班车开车前，你、冬禾和砚秋在站台上挤着拍了一张合影，乌兰两天前就跟着牧场走了，她的位置空着，砚秋举起手机——视频那头是草原上的风。背后是冒烟的烟囱、没化的冰灯和广播站的大喇叭。', en: 'Hidden ensemble ending: you reached each of them, but went all the way with none. Before the last train, you, Donghe and Yanqiu squeeze onto the platform for one photo; Wulan left with the herds days ago, so her spot is a phone Yanqiu holds up, the steppe wind on the video call. Behind you: the smoking chimney, the unmelted lanterns and the broadcast loudspeaker.' } },
    { id: 'normal', kind: 'normal', tier: 0, title: { zh: '车窗上的霜', en: 'Frost on the Window' }, brief: { zh: '普通结局：你帮奶奶搬完了家，坐上最后一班车；车窗结了霜，你用手指划开一道，白桦岭在后面越来越小。', en: 'Normal ending: you finish packing Grandma\'s house and board the last train. Frost covers the window; you draw a line through it with a finger and watch Birch Ridge grow small behind you.' } },
  ],
  finale: { zh: '最后一句点题「最后一班车」或「白桦岭」，落在一个具体的冬天画面上（铁轨、烟囱、霜花之一）。', en: 'The last sentence should echo the title, the last train or Birch Ridge, and land on one concrete winter image (rails, a chimney, or frost on glass).' },
  loading: [
    { zh: '暖气片咕噜响了一声…', en: 'The radiator gives a low gurgle...' },
    { zh: '窗户上的霜花又厚了一层…', en: 'The frost ferns on the window thicken...' },
    { zh: '远处，绿皮车拉了一声长笛…', en: 'Far off, the green train sounds one long whistle...' },
    { zh: '锅炉房的烟囱冒着白气…', en: 'White steam rises from the boiler-house chimney...' },
    { zh: '大喇叭里沙沙地响了一阵…', en: 'The loudspeaker crackles for a while...' },
  ],
  // 写作手法层（母题、预写关键场景、揭示、日常细节、人物细节等），见 ./craft.ts
  craft: SNOW_CRAFT,
}
