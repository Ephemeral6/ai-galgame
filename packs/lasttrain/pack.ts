// 原创剧本包《零点四十七分》：南方大城市，一条老地铁线停运改造前的最后十个夜晚。
// 致敬「都市夜班 / 末班车 / 告别一座旧站」这一类恋爱冒险题材，人物与情节全部原创。

import type { Pack } from '../../types'
import { LASTTRAIN_CRAFT } from './craft'

export const LASTTRAIN: Pack = {
  id: 'lasttrain',
  version: '1.0.0',
  defaultLang: 'zh',
  langs: ['zh', 'en'],
  author: 'ai-galgame contributors',
  source: 'original',
  notes: {
    zh: `这是一个原创致敬包，致敬的是「都市夜班」一类的恋爱冒险题材：主角在城市睡着以后才开始工作，几个只在深夜出现的人，各自守着一件快要结束的事，末班车和停运倒计时构成情绪的骨架。
我们只借用这种题材的结构与氛围——夜班、末班车、一座要拆的旧站——把舞台放在一座虚构的南方大城市「沿江市」的老 7 号线上。人物、情节、站名、台词与道具均为原创，不对应任何具体城市、线路或作品。`,
    en: `An original homage pack. It pays tribute to a familiar kind of romance adventure story: the "city night shift" tale, where the hero starts work after the city falls asleep, meets a few people who only exist after midnight, each of them guarding something about to end, with the last train and a countdown as the emotional spine.
We borrow only the structure and atmosphere of that genre (night shifts, the last train, an old station about to be torn down) and set it on the old Line 7 of Yanjiang, a fictional southern city. All characters, events, station names, lines and objects are original and do not correspond to any real city, line or work.`,
  },
  // 不叫「末班车」：snow 已经叫《白桦岭的最后一班车》，列表里两个名字太像
  title: { zh: '零点四十七分', en: '00:47' },
  subtitle: { zh: '沿江市老 7 号线 · 停运改造前的十个夜晚', en: 'Old Line 7 in Yanjiang, ten nights before it closes' },
  premise: {
    zh: `第一人称「我」叫唐越，二十二岁，刚毕业，下个月要去外地上班。走之前这十天，「我」在沿江市地铁 7 号线的青柳站做临时夜班站务员：老 7 号线第 10 天夜里开完最后一班车就停运，青柳站整座拆掉重建，一年半以后才通车。
青柳站是 1998 年的老站，站厅墙上有一整面瓷砖壁画「江上的早班船」，公告说随站拆除，不做保留。末班车 23:49 到青柳，23:51 开出，00:47 到终点江尾站；之后检修班下隧道，站里只剩值班室的一盏灯。
南方的夏夜，地面上闷热，站台上有一股铁轨和机油的凉味。`,
    en: `The first-person narrator ("I") is Tang Yue, twenty-two, just graduated, starting a job in another city next month. For these last ten days I am a temporary night-shift attendant at Qingliu Station on Yanjiang Metro Line 7. Old Line 7 runs its last train on the night of Day 10, then closes; Qingliu is torn down and rebuilt, and reopens in a year and a half.
Qingliu is an old station from 1998. One wall of its concourse is a tiled mural, "The Early Ferry on the River"; the notice says it goes with the station and will not be kept. The last train reaches Qingliu at 23:49, leaves at 23:51 and reaches the terminus, Jiangwei, at 00:47; after that the maintenance crew goes down into the tunnel and the station is left with one lamp in the duty office.
A southern summer night: muggy at street level, and down on the platform a cool smell of rails and machine oil.`,
  },
  style: {
    zh: `文风：国产都市文学的质感，克制、具体、安静。写夜要写到细处：站台广播的回声、闸机的嘀声、隧道里吹出来的风、车门关上前的提示音、夜宵铺锅里的白汽、凌晨一点的路灯。多写动作和物件，少写抽象心理；时间要准，几点几分说清楚。
每个人的说话方式必须分得开。离别写得克制；停运和拆站没有反派，只是一条线到了该换的时候。
禁忌：不要出现任何日本元素（前后辈称呼、电车痴汉、便利店饭团这类符号）；不要写列车事故、有人掉下站台、隧道里出事、灵异或怪谈；不要用「命运」「羁绊」这类空词。主角色都是成年人，感情写到牵手和告白为止，不写性内容。`,
    en: `Style: understated Chinese urban fiction, concrete and quiet. Night lives in the details: the echo of platform announcements, the beep of the gates, the wind pushed out of the tunnel, the chime before the doors close, steam over the noodle pot, a streetlight at one in the morning. Favor actions and objects over abstract inner monologue; keep times exact, to the minute.
Every character must sound distinct. Goodbyes stay restrained; the closure and the demolition have no villain, a line has simply reached the time to be replaced.
Never: anything Japanese (senpai/kohai, train gropers, convenience-store onigiri as a trope); no train accidents, no one falling from the platform, nothing going wrong in the tunnel, no ghosts or urban legends; no empty words like "destiny" or "bond". All main characters are adults; romance goes as far as holding hands and a confession, never sexual content.`,
  },
  me: { zh: '我', en: 'Me' },
  days: 10,
  slots: [{ zh: '傍晚', en: 'Evening' }, { zh: '末班车后', en: 'After the Last Train' }],
  dayLabel: { zh: '第 {n} 夜', en: 'Night {n}' },
  chapters: [
    { from: 1, title: { zh: '第一章 · 白线后面', en: 'Ch.1 · Behind the White Line' } },
    { from: 4, title: { zh: '第二章 · 停运公告', en: 'Ch.2 · The Closure Notice' } },
    { from: 8, title: { zh: '第三章 · 末班车', en: 'Ch.3 · The Last Train' } },
  ],
  places: [
    { id: 'concourse', name: { zh: '青柳站站厅', en: 'Qingliu Station Concourse' }, mood: { zh: '闸机的嘀声、一整面瓷砖壁画、停在 00:47 的老挂钟', en: 'beeping gates, a whole wall of tiled mural, an old clock stopped at 00:47' }, slots: [0, 1] },
    { id: 'platform', name: { zh: '青柳站站台', en: 'Qingliu Platform' }, mood: { zh: '老站还是白漆的安全线、隧道口吹出来的风、广播的回声', en: 'the old station\'s white-painted safety line, wind from the tunnel mouth, echoing announcements' }, slots: [0, 1] },
    { id: 'office', name: { zh: '值班室', en: 'Duty Office' }, mood: { zh: '对讲机、失物招领柜、一摞写满字的值班日志', en: 'walkie-talkies, the lost-and-found cabinet, a stack of crowded duty logs' }, slots: [0, 1] },
    { id: 'stall', name: { zh: 'B 口夜宵铺', en: 'Exit B Noodle Shop' }, mood: { zh: '一口大锅、塑料凳、头顶嗡嗡响的灯管', en: 'one big pot, plastic stools, a humming tube light overhead' }, slots: [0, 1] },
    { id: 'exit', name: { zh: 'A 口街角', en: 'Exit A Street Corner' }, mood: { zh: '闷热的晚风、骑电动车的外卖员、一排早关门的店', en: 'a muggy evening wind, delivery riders on e-bikes, a row of shops already shut' }, slots: [0] },
    { id: 'car', name: { zh: '末班车车厢', en: 'Last Train Car' }, mood: { zh: '空荡的座椅、拉环一起晃、车窗上映出自己的脸', en: 'empty seats, hand straps swaying together, your own face in the dark window' }, slots: [1] },
    // 地名里不带「江」：背景按地名推，带「江」会画成水边
    { id: 'terminal', name: { zh: '终点站出口', en: 'Terminal Station Exit' }, mood: { zh: '江尾站，最后一站；出口外一家二十四小时自助洗衣店亮着灯', en: 'Jiangwei, the end of the line; outside the exit, a 24-hour laundromat with its lights on' }, slots: [1] },
    { id: 'tunnel', name: { zh: '隧道检修通道', en: 'Tunnel Maintenance Walkway' }, mood: { zh: '头灯的光圈、滴水声、每隔五十米一盏昏黄的应急灯', en: 'circles of headlamp light, dripping water, a dim emergency lamp every fifty metres' }, slots: [1] },
  ],
  cast: [
    {
      id: 'wanzhou', name: { zh: '林晚舟', en: 'Lin Wanzhou' }, short: { zh: '晚舟', en: 'Wanzhou' }, color: '#7fa8d6',
      look: { zh: '灰蓝色的夜鹭，头顶一撮黑羽，司机制服的领口别着一枚旧哨子', en: 'a grey-blue night heron with a black crown, an old whistle pinned to the collar of her driver\'s uniform' },
      voice: {
        zh: '二十六岁，7 号线末班车司机。说话像报信号，短、准、带时间：「23:51，正点。」「绿灯，走。」不爱解释，关心人的方式是提醒：「白线后面。」笑的时候会先低头。叫「我」「新来的」，熟了叫「唐越」。',
        en: 'Twenty-six, driver of Line 7\'s last train. Talks like calling signals: short, exact, with times. "23:51, on time." "Green. Go." Doesn\'t explain herself; shows care by reminding: "Behind the white line." Looks down before she smiles. Calls me "new guy", later "Tang Yue".',
      },
      samples: [
        { zh: '新来的，白线后面。……车进站带风，帽子会飞。', en: 'New guy, behind the white line. ...Trains bring wind. Your cap will fly.' },
        { zh: '23:49 到青柳，我会按两声喇叭。你听见了就挥一下手。', en: '23:49 at Qingliu, I\'ll give two horns. If you hear them, wave.' },
        { zh: '白线后面。……我说的是你，新来的。', en: 'Behind the white line. ...I mean you, new guy.' },
      ],
      secret: {
        zh: '今年的年度体检，她夜间视力明显下降。单位已经批了她调离驾驶岗，从停运那天起生效，这十夜按规定限速、由调度逐个确认信号；这件事只有调度和人事知道，她没告诉站里任何人。老 7 号线的最后一班车，就是她最后一次开车，之后她去车辆段做地面工作，再也不进驾驶室。',
        en: 'Her annual medical showed a clear decline in her night vision. Her transfer off driving is approved and takes effect the day the line closes; for these ten nights she runs at reduced speed with dispatch confirming every signal. Only dispatch and HR know; she has told no one at the station. The last train on old Line 7 will be the last time she ever drives. After that she moves to ground work at the depot and never sits in a cab again.',
      },
      arc: [
        { zh: '初见：第一夜的末班车进站，司机按了两声短喇叭，探出头来说「新来的，白线后面」。', en: 'First meeting: on my first night the last train pulls in, the driver gives two short horns, leans out and says, "New guy, behind the white line."' },
        { zh: '熟识：她交班前在夜宵铺吃一碗粉，报出每一站的到站时间，一分不差；她教「我」听轨道的声音判断车到哪了。', en: 'Familiar: before her shift she eats a bowl of noodles at the shop and recites every station\'s arrival time to the minute; she teaches me to tell where a train is from the sound of the rails.' },
        { zh: '心事：对讲机里她晚报了一个黄灯，调度问了两遍；下车后她揉着眼睛说隧道里的灯暗了。', en: 'Worries: on the radio she calls a yellow signal late and dispatch asks twice; off the train she rubs her eyes and says the tunnel lamps have gone dim.' },
        { zh: '秘密：末班车开走以后，值班室里只剩一盏灯，她承认夜里的绿灯在她眼里越来越像一团雾，最后一班车是她最后一次开车。', en: 'Secret: after the last train, with one lamp left in the duty office, she admits that at night the green signals look more and more like fog to her, and that the last train will be her last drive.' },
        { zh: '抉择：最后一班车，要不要申请添乘进驾驶室，坐在她旁边陪她开完最后一程。', en: 'Choice: on the last train, will I apply to ride in the cab and sit beside her for the last run.' },
      ],
      haunts: { 0: ['office', 'stall'], 1: ['car', 'platform'] },
      deadline: { day: 10, text: { zh: '第十夜，最后一班车', en: 'Night 10, the last train' } },
      keepsakeIdeas: { zh: '她制服领口上的旧哨子、一张写着各站到站时间的便签、末班车驾驶室里撕下来的一页行车日志', en: 'the old whistle from her collar, a note of every station\'s arrival time, a page torn from the last train\'s cab log' },
      sprite: {
        pal: { B: '#5b6b80', K: '#1c2230', L: '#e8ecf0', Y: '#f2c14e' },
        art: [
          '.....KK.......',
          '....KKKK..K...',
          '...BBBBBB.....',
          '..BBBBBBBYYY..',
          '..BBBBBBBB....',
          '..BBBBBBBB....',
          '..BLLLLLLB....',
          '.BBLLLLLLBB...',
          '.BBLLLLLLBB...',
          '..BBBBBBBB....',
          '....Y..Y......',
          '....Y..Y......',
        ],
        eyes: [[3, 4], [3, 7]], cheeks: [[4, 3], [4, 8]], motion: 'wings',
      },
    },
    {
      id: 'xunian', name: { zh: '许念', en: 'Xu Nian' }, short: { zh: '许念', en: 'Nian' }, color: '#e6a15c',
      look: { zh: '狸花猫，歪戴一顶酒红色贝雷帽，帆布包里永远插着一本速写本', en: 'a tabby cat in a tilted wine-red beret, a sketchbook always sticking out of her canvas bag' },
      voice: {
        zh: '二十岁，美院大三。话多、跳跃，一句话里能拐三个弯；画画时一个字都不说，画完了才抬头问「你刚才说什么」。爱用颜色形容人（「你今天是灰绿色的」）。被问到住哪就笑着岔开。叫「我」「站务员」，熟了叫「唐越」。',
        en: 'Twenty, third-year art student. Chatty, jumpy, three turns in one sentence; silent while she draws, then looks up: "What did you just say?" Describes people in colours ("You\'re grey-green today"). Laughs and changes the subject when asked where she lives. Calls me "attendant", later "Tang Yue".',
      },
      samples: [
        { zh: '别动别动——你的影子正好落在第三块砖上。好了。站务员，你今天是灰绿色的。', en: 'Don\'t move, don\'t move, your shadow is right on the third tile. Done. Attendant, you\'re grey-green today.' },
        { zh: '我坐末班车是为了画车厢里的人。真的。……你别那么看我。', en: 'I ride the last train to draw the people in it. Really. ...Don\'t look at me like that.' },
        { zh: '这面墙一共四百三十二块砖，我画了一大半了。拆之前，我想把它画完。', en: 'This wall has four hundred and thirty-two tiles. I\'ve drawn more than half. I want to finish it before they take it down.' },
      ],
      secret: {
        zh: '暑假前房东把房子卖了，她没找到住处，也没告诉学校和家里。这一个月她每晚坐末班车到终点，在江尾站外那家二十四小时自助洗衣店里坐到天亮，「画车厢里的人」是她给自己找的理由。洗衣店第 9 天关门转租，她得在那之前想办法。',
        en: 'Before summer break her landlord sold the flat; she found nowhere else and told neither the school nor her family. All month she has ridden the last train to the terminus and sat in the 24-hour laundromat outside Jiangwei until dawn; "drawing the people on the train" is the reason she gave herself. The laundromat closes for good on Day 9, and she has to work something out before then.',
      },
      arc: [
        { zh: '初见：末班车上她坐在对面画速写，「我」在她的本子上看见了自己，她理直气壮地说「你刚才那个姿势很好看，别浪费」。', en: 'First meeting: on the last train she sits across from me sketching; I find myself in her book, and she says without shame, "That pose of yours was nice. Don\'t waste it."' },
        { zh: '熟识：傍晚她在站厅里一块一块画壁画，「我」帮她挡路过的人；她用颜色给车站里每个人起外号。', en: 'Familiar: in the evenings she draws the mural tile by tile in the concourse while I keep passers-by out of her way; she gives everyone in the station a colour for a nickname.' },
        { zh: '心事：她说要坐末班车到终点「画最后一站」，却从来不坐回来；夜宵铺的阿珍每晚多给她煮一个蛋。', en: 'Worries: she says she rides to the terminus to "draw the last stop", but never rides back; Ah-Zhen at the noodle shop boils her an extra egg every night.' },
        { zh: '秘密：江尾站外的洗衣店里，她把速写本当枕头，承认自己已经一个月没有住处，「画完这面墙我就去想办法，真的」。', en: 'Secret: in the laundromat outside Jiangwei, her sketchbook for a pillow, she admits she has had nowhere to live for a month: "Once I finish the wall I\'ll sort it out. Really."' },
        { zh: '抉择：壁画拆掉之前的最后一夜，是陪她把最后一块砖画完，还是先陪她去把住处的事说出口。', en: 'Choice: on the last night before the mural comes down, do I help her draw the last tile, or first go with her to say out loud where she\'s been sleeping.' },
      ],
      haunts: { 0: ['concourse', 'exit'], 1: ['car', 'terminal'] },
      deadline: { day: 9, text: { zh: '第九夜，洗衣店关门，壁画的最后一夜', en: 'Night 9, the laundromat closes and the mural has its last night' } },
      keepsakeIdeas: { zh: '速写本里撕下来的一页（上面有「我」）、一截用短了的炭笔、一枚从壁画上掉下来的小碎瓷', en: 'a page torn from her sketchbook with me on it, a worn-down stick of charcoal, a small chip fallen off the mural' },
      sprite: {
        pal: { O: '#c9a27a', o: '#8a6a4a', L: '#f5eee4', R: '#9e2b3a' },
        art: [
          '.O..RRRR..O...',
          '.OORRRRRROO...',
          '.OOOOOOOOOO...',
          '.oOOOOOOOOo...',
          '.OOOOOOOOOO...',
          '..OLLLLLLO....',
          '..OOOOOOOO....',
          '.oOOOLLOOOo...',
          '.oOOOLLOOOoO..',
          '..oo....ooOO..',
        ],
        eyes: [[3, 4], [3, 7]], cheeks: [[4, 3], [4, 8]], motion: 'tail',
      },
    },
    {
      id: 'chengye', name: { zh: '程野', en: 'Cheng Ye' }, short: { zh: '程野', en: 'Cheng Ye' }, color: '#d9a43a',
      look: { zh: '深褐色的鼹鼠，黄色安全帽上一盏头灯，橙色反光背心上全是灰', en: 'a dark-brown mole with a headlamp on his yellow hard hat and dust all over his orange hi-vis vest' },
      voice: {
        zh: '二十八岁，夜班轨道检修工。话很少，带一点山城口音，说话前先「嗯」一声；不会客套，夸人只说「还行」。手上永远在擦一样东西：扳手、头灯、一块瓷砖。叫「我」「小唐」。',
        en: 'Twenty-eight, night-shift track maintenance. Few words, a slight hill-city accent, a low "mm" before he speaks; no small talk, and his highest praise is "not bad". His hands are always wiping something: a wrench, a headlamp, a tile. Calls me "Little Tang".',
      },
      samples: [
        { zh: '嗯。……脚踩枕木中间，别踩钢轨。钢轨滑。', en: 'Mm. ...Step between the sleepers, not on the rail. Rails are slippery.' },
        { zh: '这块砖，别告诉站长。……你就当没看见。', en: 'This tile. Don\'t tell the station master. ...Pretend you didn\'t see it.' },
        { zh: '还行。……我是说你。还行。', en: 'Not bad. ...I mean you. Not bad.' },
      ],
      secret: {
        zh: '这八年，壁画上每碎一块砖，他就照着原样自己烧一块，夜里收工后偷偷换上去。现在墙上有六十三块是他烧的，几乎没人看得出来，除了站长。他打算第十夜趁拆除队进场前，把这六十三块自己的砖撬下来带走——那是他的东西，可这么做不合规定，他一个人干不完。',
        en: 'For eight years, every time a tile on the mural cracked, he fired a copy himself and swapped it in at night after his shift. Sixty-three tiles on that wall are his now, and almost no one can tell except the station master. On Night 10, before the demolition crew arrives, he means to pry his sixty-three tiles off and take them home. They are his, but it is against the rules, and he cannot do it alone.',
      },
      arc: [
        { zh: '初见：第一次跟检修班下隧道，他把一块松动的瓷砖塞进「我」手里，说「别告诉站长」。', en: 'First meeting: on my first walk down the tunnel with the maintenance crew, he presses a loose tile into my hand: "Don\'t tell the station master."' },
        { zh: '熟识：收工后在夜宵铺吃宵夜，他教「我」分辨隧道里的声音，夸「我」一句「还行」。', en: 'Familiar: midnight noodles after his shift; he teaches me to tell the tunnel\'s sounds apart and tells me I\'m "not bad".' },
        { zh: '心事：拆除公告贴出来那天，他站在壁画前看了很久，一句话没说；他工具箱里总有一块没上釉的砖坯。', en: 'Worries: the day the demolition notice goes up he stands in front of the mural a long time and says nothing; there is always an unglazed tile blank in his toolbox.' },
        { zh: '秘密：检修通道的应急灯下，他打开一个旧鞋盒，里面是一摞自己烧的备用砖，承认墙上有六十三块是他的。', en: 'Secret: under an emergency lamp in the walkway he opens an old shoebox full of spare tiles he fired himself, and admits sixty-three tiles on the wall are his.' },
        { zh: '抉择：第十夜，要不要陪他在拆除队来之前，把那六十三块砖一块一块撬下来。', en: 'Choice: on Night 10, will I help him pry those sixty-three tiles off, one by one, before the demolition crew comes.' },
      ],
      haunts: { 0: ['stall', 'exit'], 1: ['tunnel', 'platform'] },
      deadline: { day: 10, text: { zh: '第十夜，拆除队进场之前', en: 'Night 10, before the demolition crew arrives' } },
      keepsakeIdeas: { zh: '一块他亲手烧的青色瓷砖、一盏用旧的头灯、检修日志里他画的一张隧道草图', en: 'a blue-green tile he fired himself, a worn headlamp, a tunnel sketch he drew in the maintenance log' },
      sprite: {
        pal: { H: '#f2b632', W: '#fff6c0', M: '#4a3b35', m: '#2e2420', P: '#e8a0a0', V: '#ff7a1a' },
        art: [
          '....HHHHHH....',
          '...HHHWWHHH...',
          '..HHHHHHHHHH..',
          '..MMMMMMMMMM..',
          '.MMMMMMMMMMMM.',
          '.MMMMMPPMMMMM.',
          '..MMMMMMMMMM..',
          '.mVVVVVVVVVVm.',
          '.mVVVMMMMVVVm.',
          '..mm......mm..',
        ],
        eyes: [[4, 4], [4, 9]], cheeks: [[5, 3], [5, 10]], motion: 'bob',
      },
    },
  ],
  npcs: [
    {
      id: 'weizhang', name: { zh: '韦站长', en: 'Stationmaster Wei' }, short: { zh: '韦站长', en: 'Wei' }, color: '#8fa86a',
      role: {
        zh: '青柳站的站长，五十八岁，在这个站干了二十二年，跟着老 7 号线一起退休。「我」的直属领导，规矩多，说话报时间；值班日志一天不落。',
        en: 'Qingliu\'s stationmaster, fifty-eight, twenty-two years at this station, retiring together with old Line 7. My direct boss: full of rules, quotes the time, never misses a day of the duty log.',
      },
      look: { zh: '一只老乌龟，戴藏蓝色大檐帽，龟壳上的纹路像一张线路图', en: 'an old tortoise in a navy peaked cap, the pattern on his shell like a route map' },
      voice: {
        zh: '慢、稳，句句带时间和规定：「23:55 清客，一个不落。」从不夸人，只说「记日志」。有事不直说，把东西放在桌上就走。叫「我」「小唐」。',
        en: 'Slow and steady, every sentence a time or a rule: "Clear the station at 23:55. Every last one." Never praises anyone, only says "Log it." Never says what he means; leaves something on the desk and walks away. Calls me "Little Tang".',
      },
      samples: [
        { zh: '23:55 清客，一个不落。……落了的，记日志。', en: 'Clear the station at 23:55. Every last one. ...Anyone missed, log it.' },
        { zh: '末班车不等人。人可以等末班车。', en: 'The last train waits for no one. People can wait for the last train.' },
        { zh: '钥匙放桌上了。我什么都没看见。', en: 'Keys are on the desk. I didn\'t see a thing.' },
      ],
      // 末班车后也在站台：他每晚 23:49 站在站台上听那两声喇叭（rv-horns）
      haunts: { 0: ['office'], 1: ['office', 'platform'] },
      sprite: {
        pal: { N: '#23345e', R: '#c0392b', S: '#6f8f5a', s: '#4c6640', K: '#c9b38a' },
        art: [
          '...NNNNNNNN...',
          '..NNNNNNNNNN..',
          '..RRRRRRRRRR..',
          '...KKKKKKKK...',
          '..KKKKKKKKKK..',
          '...KKKKKKKK...',
          '.SSSSSSSSSSSS.',
          'SSsSSsSSsSSsSS',
          '.SSSSSSSSSSSS.',
          '..KK......KK..',
        ],
        eyes: [[4, 4], [4, 9]], cheeks: [[5, 3], [5, 10]], motion: 'bob',
      },
    },
    {
      id: 'azhen', name: { zh: '阿珍', en: 'Ah-Zhen' }, short: { zh: '阿珍', en: 'Ah-Zhen' }, color: '#e07a5f',
      role: {
        zh: 'B 口夜宵铺的老板娘，开到凌晨三点，地铁夜班的人都在她这儿吃。谁今晚多点了一碗、谁好几天没来，她都知道；她每晚给许念多煮一个蛋，从不收钱，也从不问。',
        en: 'Owner of the noodle shop by Exit B, open till three in the morning; everyone on the metro night shift eats here. She knows who ordered an extra bowl tonight and who hasn\'t come in for days; every night she boils Xu Nian an extra egg, never charges for it, never asks.',
      },
      look: { zh: '一只母鸡，红冠子，系一条洗得发白的蓝围裙', en: 'a hen with a red comb and a faded blue apron' },
      voice: {
        zh: '嗓门大、语速快，满嘴「靓仔」「食咗未」；心里有数的事不说破，只往碗里多加东西。叫「我」「新来的靓仔」。',
        en: 'Loud and fast, "handsome" and "eaten yet?" in every breath; what she knows she never says outright, she just adds more to your bowl. Calls me "handsome new boy".',
      },
      samples: [
        { zh: '新来的靓仔，食咗未？坐，粉马上到。', en: 'Handsome new boy, eaten yet? Sit. Noodles coming.' },
        { zh: '那个画画的妹仔，蛋我照煮。她不来，我就自己吃。', en: 'The girl who draws, I boil her egg anyway. If she doesn\'t come, I eat it myself.' },
        { zh: '车停了，我这锅也该歇歇了。……才怪，我开到地球爆炸。', en: 'Trains stop, my pot should rest too. ...As if. I\'m open till the world ends.' },
      ],
      haunts: { 0: ['stall'], 1: ['stall'] },
      sprite: {
        pal: { W: '#f4efe6', R: '#d23c3c', Y: '#f39c34', A: '#5aa0d6' },
        art: [
          '.....RRR......',
          '....RRRR......',
          '....WWWWW.....',
          '...WWWWWWW....',
          '...WWWWWWYY...',
          '..WWWWWWWW....',
          '.WWAAAAAAWW...',
          '.WWAAAAAAWWW..',
          '..WAAAAAAW....',
          '....Y..Y......',
        ],
        eyes: [[3, 5], [3, 7]], cheeks: [[4, 4], [4, 8]], motion: 'bob',
      },
    },
    {
      id: 'diaodu', name: { zh: '调度老方', en: 'Fang at Dispatch' }, short: { zh: '调度', en: 'Dispatch' }, color: '#9aa3ad',
      role: {
        zh: '控制中心的夜班调度员，只在对讲机里出现，从不露面。声音平得像念稿，每晚 00:50 准时说一句「7 号线收车，辛苦」。',
        en: 'The night dispatcher at the control centre, heard only over the radio, never seen. Flat as a script, and every night at 00:50 sharp he says, "Line 7 is in for the night. Thanks, everyone."',
      },
      look: { zh: '只是对讲机里的一个声音', en: 'only a voice on the radio' },
      voice: {
        zh: '对讲机腔，先报呼号再说事：「青柳，调度呼叫。」从不带情绪，只在最后一夜破例。',
        en: 'Radio voice, call sign first: "Qingliu, dispatch calling." Never any feeling in it, except on the very last night.',
      },
      samples: [
        { zh: '青柳，调度呼叫。末班车已过江心站，预计 23:49 到你站。', en: 'Qingliu, dispatch calling. Last train has passed Jiangxin, expected at your station 23:49.' },
        { zh: '末班车司机，请复诵信号。……请复诵。', en: 'Last train driver, repeat the signal. ...Repeat, please.' },
        { zh: '7 号线收车，辛苦。', en: 'Line 7 is in for the night. Thanks, everyone.' },
      ],
    },
  ],
  relations: [
    { a: 'wanzhou', b: 'weizhang', kind: { zh: '师徒', en: 'Mentor and trainee' }, text: { zh: '晚舟当年在青柳站实习，是韦站长带出来的。', en: 'Wanzhou trained at Qingliu under Wei.' } },
    { a: 'xunian', b: 'azhen', kind: { zh: '一碗粉一个蛋', en: 'A bowl and an egg' }, text: { zh: '阿珍每晚给许念多煮一个蛋，不收钱；许念以为阿珍只是心好。', en: 'Every night Ah-Zhen boils Nian an extra egg for free; Nian thinks Ah-Zhen is simply kind.' } },
    { a: 'xunian', b: 'azhen', kind: { zh: '没说破', en: 'Unspoken' }, text: { zh: '阿珍早就看见许念每晚坐末班车去终点、从不回来，猜到她没地方住，等她自己开口。', en: 'Ah-Zhen noticed long ago that Nian rides to the terminus every night and never comes back; she has guessed Nian has nowhere to live and is waiting for her to say so.' }, hiddenUntil: 3 },
    { a: 'chengye', b: 'weizhang', kind: { zh: '装作没看见', en: 'Looking the other way' }, text: { zh: '韦站长知道壁画上有六十三块砖是程野换的，八年来一次也没记进日志。', en: 'Wei knows sixty-three tiles on the mural are Cheng Ye\'s replacements and in eight years has never once logged it.' }, hiddenUntil: 3 },
    { a: 'wanzhou', b: 'chengye', kind: { zh: '灯语', en: 'Signal lamps' }, text: { zh: '检修班每晚在青柳站台尽头集合，退在安全线后面，等末班车到终点、调度 00:50 收车以后才下隧道；车出站时晚舟把车头灯闪一下，程野用头灯回一下。两人几乎没当面说过话。', en: 'The maintenance crew gathers at the end of the Qingliu platform every night, standing back behind the safety line, and goes down only after the last train reaches the terminus and dispatch closes the line at 00:50; as the train pulls out Wanzhou flashes her headlights once and Cheng Ye answers with his headlamp. They have barely ever spoken face to face.' } },
    { a: 'xunian', b: 'chengye', kind: { zh: '同一面墙', en: 'The same wall' }, text: { zh: '两个人都守着站厅那面墙，互相不知道对方。', en: 'Both of them keep watch over the concourse wall, and neither knows about the other.' }, hiddenUntil: 2 },
    { a: 'weizhang', b: 'me', kind: { zh: '站长与临时工', en: 'Stationmaster and temp' }, text: { zh: '韦站长从不夸「我」，只让「我」记日志；他把日志里写不进去的事，用把东西放在桌上的方式告诉「我」。', en: 'Wei never praises me, only tells me to log things; what can\'t go in the log he tells me by leaving things on the desk.' } },
  ],
  acts: [
    {
      id: 'act1', from: 1, title: { zh: '第一幕 · 白线后面', en: 'Act I · Behind the White Line' },
      goal: { zh: '开端：「我」第一次上夜班，认识三个只在深夜出现的人；每个人都守着一件快结束的事，谁也不说。', en: 'Opening: my first night shifts; I meet three people who only appear late at night, each guarding something about to end, none of them saying so.' },
      beats: [
        { id: 'lt-horn', day: 1, by: 1, who: ['wanzhou'], slots: [1], places: ['platform'], kind: { zh: '初见', en: 'First meeting' }, text: { zh: '末班车进站，司机按了两声短喇叭，探出头说「新来的，白线后面」。', en: 'The last train pulls in; the driver gives two short horns, leans out and says, "New guy, behind the white line."' } },
        { id: 'lt-sketch', day: 2, by: 3, who: ['xunian'], slots: [1], places: ['car'], kind: { zh: '约定', en: 'A promise' }, text: { zh: '末班车上「我」在许念的速写本里看见了自己；她说她在一块一块画青柳站的壁画，拆之前想画完。', en: 'On the last train I find myself in Nian\'s sketchbook; she says she is drawing Qingliu\'s mural tile by tile and wants to finish before it comes down.' }, promise: { zh: '答应壁画拆掉之前，陪她把每一块砖都画完', en: 'promise to help her draw every last tile before the mural comes down' } },
        // by 4：第 3 夜末班车后是 lt-sketch 的最后机会
        { id: 'lt-tile', day: 3, by: 4, who: ['chengye'], slots: [1], places: ['tunnel'], kind: { zh: '伏笔', en: 'Foreshadowing' }, text: { zh: '第一次跟检修班下隧道，程野把一块松动的瓷砖塞进「我」手里：「别告诉站长。」', en: 'My first walk down the tunnel with the maintenance crew; Cheng Ye presses a loose tile into my hand: "Don\'t tell the station master."' } },
      ],
      hook: { zh: '收车以后，站厅的老挂钟还是停在 00:47。韦站长说那是末班车到终点的时间，它停了十几年，没人去修。', en: 'After closing the concourse clock still says 00:47. Wei says that is when the last train reaches the terminus; it stopped over ten years ago and no one has fixed it.' },
    },
    {
      id: 'act2', from: 4, title: { zh: '第二幕 · 停运公告', en: 'Act II · The Closure Notice' },
      goal: { zh: '转折：拆除公告贴出来，壁画不保留；每个人「快结束的事」都开始露出来。', en: 'Turn: the demolition notice goes up and the mural will not be kept; everyone\'s "thing about to end" starts to show.' },
      beats: [
        { id: 'lt-notice', day: 4, by: 4, who: ['xunian', 'chengye'], slots: [0], kind: { zh: '转折', en: 'Turning point' }, text: { zh: '站厅贴出公告：壁画随旧站拆除，不做保留。许念对着公告画了一张速写；程野站在壁画前看了很久，一句话没说。两人隔着一个闸机，谁也没注意谁。', en: 'A notice goes up in the concourse: the mural comes down with the old station and will not be kept. Nian sketches the notice; Cheng Ye stands before the mural a long time and says nothing. One gate apart, neither notices the other.' } },
        // 限在第 5 夜的站台：不限地点的话玩家在车厢里也会碰上，而且错过之后带约定的事件就丢了
        { id: 'lt-signal', day: 5, by: 5, who: ['wanzhou'], slots: [1], places: ['platform'], kind: { zh: '心事', en: 'Worries' }, text: { zh: '对讲机里晚舟晚报了一个黄灯，调度问了两遍；车到青柳，她下车揉着眼睛，说隧道里的灯今年暗了。', en: 'On the radio Wanzhou calls a yellow signal late and dispatch asks twice; at Qingliu she steps out rubbing her eyes and says the tunnel lamps have gone dim this year.' }, promise: { zh: '答应最后一班车申请添乘，坐在驾驶室里陪她开完', en: 'promise to apply to ride in the cab on the last train and keep her company to the end of the line' } },
        // by 6：第 7 夜末班车后是 lt-shoebox 的最后机会，两个限地点的事件不能挤在同一格
        { id: 'lt-laundry', day: 6, by: 6, who: ['xunian'], slots: [1], places: ['terminal'], kind: { zh: '秘密曝光', en: 'Secret out' }, text: { zh: '末班车到了终点，许念没有走向任何一个小区，而是推开了江尾站外那家自助洗衣店的门；她回头看见「我」，说「别问」。', en: 'At the terminus Nian walks toward no housing estate at all, but pushes open the door of the laundromat outside Jiangwei; she turns, sees me, and says, "Don\'t ask."' } },
        { id: 'lt-shoebox', day: 7, by: 7, who: ['chengye'], slots: [1], places: ['tunnel', 'platform'], kind: { zh: '秘密曝光', en: 'Secret out' }, text: { zh: '收工后程野打开一个旧鞋盒，里面是一摞他自己烧的瓷砖；他问「我」第十夜能不能帮个忙。', en: 'After his shift Cheng Ye opens an old shoebox full of tiles he fired himself and asks if I can help him with something on Night 10.' }, promise: { zh: '答应第十夜拆除队来之前，帮他把他的那些砖一块块撬下来', en: 'promise to help him pry his tiles off one by one on Night 10, before the demolition crew arrives' } },
      ],
      hook: { zh: '韦站长把一串钥匙放在值班室桌上，说「我什么都没看见」，就去巡站了。', en: 'Wei puts a ring of keys on the duty-office desk, says, "I didn\'t see a thing," and goes off on his rounds.' },
    },
    {
      id: 'act3', from: 8, title: { zh: '第三幕 · 末班车', en: 'Act III · The Last Train' },
      goal: { zh: '高潮：洗衣店关门、壁画的最后一夜、最后一班车；所有「快结束的事」都到了点。', en: 'Climax: the laundromat closes, the mural\'s last night, the last train; every "thing about to end" falls due.' },
      beats: [
        { id: 'lt-log', day: 8, by: 8, who: ['weizhang'], slots: [0], places: ['office'], kind: { zh: '点拨', en: 'A nudge' }, text: { zh: '韦站长翻开二十二年的值班日志给「我」看，说「末班车不等人，人可以等末班车」。', en: 'Wei opens twenty-two years of duty logs for me and says, "The last train waits for no one. People can wait for the last train."' } },
        { id: 'lt-mural', day: 9, by: 9, who: ['xunian'], slots: [1], kind: { zh: '高潮', en: 'Climax' }, text: { zh: '壁画的最后一夜，许念对着最后几块砖；程野扛着工具箱进了站厅。两个人第一次看见对方。', en: 'The mural\'s last night; Nian faces the last few tiles, and Cheng Ye walks into the concourse with his toolbox. They see each other for the first time.' } },
        { id: 'lt-last', day: 10, by: 10, who: ['wanzhou'], slots: [1], kind: { zh: '高潮', en: 'Climax' }, text: { zh: '最后一班车 23:51 从青柳开出；站台上挤满了来送它的人。', en: 'The last train leaves Qingliu at 23:51; the platform is crowded with people who came to see it off.' } },
      ],
    },
  ],
  incidents: [
    // 只在第 5、6 夜：别的夜里按天写的天气是晴或阴
    { id: 'rain', chance: 0.2, days: [5, 6], text: { zh: '地面上下起了暴雨，A 口的台阶淌成小瀑布，进站的人都在抖伞。', en: 'A downpour at street level; the steps at Exit A turn into a small waterfall, and everyone coming in shakes out an umbrella.' } },
    { id: 'lost-glove', chance: 0.3, places: ['office'], who: ['weizhang'], text: { zh: '失物招领柜里多了一只没人认领的白手套，韦站长让「我」记日志：「一只，左手。」', en: 'A single unclaimed white glove turns up in the lost-and-found; Wei has me log it: "One. Left hand."' } },
    { id: 'egg', chance: 0.35, places: ['stall'], who: ['azhen'], text: { zh: '阿珍往「我」碗里多放了一个蛋，说今天的蛋煮多了。', en: 'Ah-Zhen drops an extra egg into my bowl and says she boiled too many today.' } },
    { id: 'delay', chance: 0.25, days: [3, 9], slots: [1], text: { zh: '调度广播：前方站信号检修，末班车晚点三分钟。站台上的人一起抬头看了看钟。', en: 'Dispatch announces signal work ahead; the last train is three minutes late. Everyone on the platform looks up at the clock at once.' } },
    // 第 10 夜之后线路就停了，「明天还要坐回来」只在前九夜成立
    { id: 'sleeper', chance: 0.3, days: [1, 9], slots: [1], places: ['car'], text: { zh: '末班车上一个加班的上班族睡过了站，醒来问「这是哪」，又笑着说「算了，反正明天还要坐回来」。', en: 'An office worker on the last train sleeps past his stop, wakes up asking "Where are we?", then laughs: "Never mind. I\'ll be riding back tomorrow anyway."' } },
    { id: 'photographers', chance: 0.4, days: [7, 10], places: ['concourse', 'platform'], text: { zh: '来拍老站的人越来越多，有人对着停在 00:47 的挂钟拍了好几张。', en: 'More and more people come to photograph the old station; someone takes several shots of the clock stuck at 00:47.' } },
    { id: 'headlamp', chance: 0.35, slots: [1], places: ['tunnel'], who: ['chengye'], text: { zh: '隧道深处一盏应急灯坏了，程野用头灯照着换灯泡，嘴里叼着螺丝。', en: 'Deep in the tunnel an emergency lamp is out; Cheng Ye changes the bulb by his headlamp, a screw between his teeth.' } },
  ],
  stages: [
    { zh: '初见', en: 'First Meeting' }, { zh: '熟识', en: 'Familiar' }, { zh: '心事', en: 'Worries' }, { zh: '秘密', en: 'Secret' }, { zh: '抉择', en: 'Choice' },
  ],
  gates: [
    { affection: 0, scenes: 0 },
    { affection: 3, scenes: 1 },
    { affection: 6, scenes: 2 },
    { affection: 9, scenes: 3 },
    { affection: 12, scenes: 4 },
  ],
  events: [
    { day: 1, text: { zh: '「我」第一次上夜班；站厅里贴着「老 7 号线第 10 夜停运」的通知', en: 'My first night shift; a notice in the concourse says old Line 7 closes after Night 10' } },
    { day: 4, text: { zh: '拆除公告贴出：壁画随旧站拆除，不做保留', en: 'The demolition notice goes up: the mural comes down with the station and will not be kept' } },
    { day: 7, text: { zh: '来拍老站的人多了起来', en: 'More people start coming to photograph the old station' } },
    { day: 9, text: { zh: '江尾站外的自助洗衣店关门转租；壁画的最后一夜', en: 'The laundromat outside Jiangwei closes for good; the mural\'s last night' } },
    { day: 10, text: { zh: '老 7 号线最后一班车，23:51 从青柳开出', en: 'Old Line 7\'s last train, leaving Qingliu at 23:51' } },
  ],
  fixed: [
    { day: 4, slot: 0, place: { zh: '青柳站站厅', en: 'Qingliu Station Concourse' }, mood: { zh: '公告栏前围着几个人，壁画在灯下颜色发旧', en: 'a few people gathered at the notice board, the mural faded under the lights' }, title: { zh: '拆除公告', en: 'The Demolition Notice' }, cast: ['xunian', 'chengye'] },
    { day: 9, slot: 1, place: { zh: '青柳站站厅', en: 'Qingliu Station Concourse' }, mood: { zh: '收车以后，站厅只开了一排灯，壁画前铺着一张旧报纸', en: 'after closing, one row of lights left on, an old newspaper spread in front of the mural' }, title: { zh: '壁画的最后一夜', en: 'The Mural\'s Last Night' }, cast: ['xunian', 'chengye'] },
    { day: 10, slot: 1, place: { zh: '青柳站站台', en: 'Qingliu Platform' }, mood: { zh: '站台上挤满了来送车的人，有人举着手机，有人只是站着', en: 'the platform packed with people seeing the train off, some holding up phones, some just standing' }, title: { zh: '最后一班车', en: 'The Last Train' }, cast: ['wanzhou', 'xunian', 'chengye'] },
  ],
  proactiveAfter: 2,
  endings: [
    { id: 'wanzhou-true', who: 'wanzhou', kind: 'true', tier: 4, minStage: 4, minAffection: 12, maxBroken: 0, keptKey: 'lt-signal', title: { zh: '最后一个绿灯', en: 'The Last Green' }, brief: { zh: '真结局：你守住了约定，韦站长签了添乘单，你坐进驾驶室，和她一起把每一个信号念出声，调度照常一个个确认。00:47 到江尾，她关掉驾驶室的灯，把领口那枚旧哨子摘下来放进你手心：「以后我站白线后面，你记得来接我下班。」恋爱结局。', en: 'True ending: you keep your promise; Wei signs the ride-along slip, you sit in the cab and call each signal aloud with her while dispatch confirms them one by one as usual. At 00:47 at Jiangwei she switches off the cab lights and puts the old whistle from her collar into your palm: "From now on I stand behind the white line. Remember to come and walk me home after work." Romance ending.' } },
    { id: 'wanzhou-good', who: 'wanzhou', kind: 'good', tier: 3, minStage: 4, minAffection: 12, maxBroken: 0, title: { zh: '两声喇叭', en: 'Two Horns' }, brief: { zh: '好结局：最后一班车是她一个人开完的。驶过青柳时，她按了两声短喇叭，你在白线后面挥手。第二天她发来一条消息：「明天起我上白班了。一起吃个早饭？」', en: 'Good ending: she drives the last train alone. Passing Qingliu she gives two short horns, and you wave from behind the white line. Next day she texts: "Day shift from tomorrow. Breakfast together?"' } },
    { id: 'wanzhou-bad', who: 'wanzhou', kind: 'bad', tier: 1, minStage: 2, minBroken: 1, title: { zh: '没有响的喇叭', en: 'No Horn' }, brief: { zh: '坏结局：你答应她的事没做到。最后一班车驶过青柳，她没有按喇叭；你在站台上看着车尾的红灯一点点缩进隧道。', en: 'Bad ending: you broke your word to her. The last train passes Qingliu without a horn; from the platform you watch its red tail lights shrink into the tunnel.' } },
    { id: 'wanzhou-near', who: 'wanzhou', kind: 'normal', tier: 2, minStage: 3, maxBroken: 0, title: { zh: '调度频道', en: 'The Dispatch Channel' }, brief: { zh: '恋人未满：停运以后她去了车辆段。你去外地之前，她在对讲机的旧频道里说了一句「唐越，正点」，就再没有下文。', en: 'Not quite lovers: after the closure she goes to the depot. Before you leave town she says one line on the old radio channel, "Tang Yue, on time," and nothing after.' } },
    { id: 'xunian-true', who: 'xunian', kind: 'true', tier: 4, minStage: 4, minAffection: 12, maxBroken: 0, keptKey: 'lt-sketch', title: { zh: '第四百三十二块砖', en: 'Tile Four Hundred and Thirty-Two' }, brief: { zh: '真结局：你守住了约定，壁画拆掉前的最后一夜，你们一起画完了最后一块砖。天亮前她自己给学校打了电话，阿珍的二楼空房先借给她住。展览那天，四百三十二块砖排满一整面墙，角落里写着你的名字。恋爱结局。', en: 'True ending: you keep your promise, and on the mural\'s last night the two of you draw the last tile together. Before dawn she calls the school herself, and Ah-Zhen lends her the empty room upstairs for now. At her exhibition four hundred and thirty-two tiles fill a whole wall, with your name in the corner. Romance ending.' } },
    { id: 'xunian-good', who: 'xunian', kind: 'good', tier: 3, minStage: 4, minAffection: 12, maxBroken: 0, title: { zh: '速写本第四十七页', en: 'Page Forty-Seven' }, brief: { zh: '好结局：壁画差两块没画完，她说「留两块给记性」。她把速写本第四十七页撕给你，上面是你们第一次在末班车上遇见时的你；住处的事，她说她已经开口了。', en: 'Good ending: two tiles are left undrawn, and she says, "Two for memory to fill in." She tears out page forty-seven for you: you, the first time you met on the last train. As for where she lives, she says she has finally told someone.' } },
    { id: 'xunian-bad', who: 'xunian', kind: 'bad', tier: 1, minStage: 2, minBroken: 1, title: { zh: '洗衣店的灯', en: 'The Laundromat Light' }, brief: { zh: '坏结局：你答应她的事没做到。洗衣店关门那天她就离开了沿江，速写本最后一页是空的；你只记得终点站外那盏一直亮着的灯。', en: 'Bad ending: you broke your word to her. She leaves Yanjiang the day the laundromat closes, and the last page of her sketchbook is blank; all you remember is the light that never went off outside the terminus.' } },
    { id: 'xunian-near', who: 'xunian', kind: 'normal', tier: 2, minStage: 3, maxBroken: 0, title: { zh: '下一站', en: 'Next Stop' }, brief: { zh: '恋人未满：她搬去了同学家暂住。分别那天你们交换了东西，她给你一张速写，你给她一张站厅的照片，谁都没说下一站在哪。', en: 'Not quite lovers: she moves onto a classmate\'s sofa for now. On the day you part you trade: a sketch for you, a photo of the concourse for her, and neither says where the next stop is.' } },
    { id: 'chengye-true', who: 'chengye', kind: 'true', tier: 4, minStage: 4, minAffection: 12, maxBroken: 0, keptKey: 'lt-shoebox', title: { zh: '带走的那面墙', en: 'The Wall We Took Home' }, brief: { zh: '真结局：你守住了约定，第十夜你们赶在拆除队之前，把他的六十三块砖一块块撬了下来。天亮时他在夜宵铺的后墙上拼出一小片江和一条早班船，说「还行。……我是说，有你在，还行」。恋爱结局。', en: 'True ending: you keep your promise, and on Night 10, ahead of the demolition crew, the two of you pry off his sixty-three tiles one by one. At dawn he sets a small piece of river and an early ferry into the back wall of the noodle shop and says, "Not bad. ...I mean, with you here, not bad." Romance ending.' } },
    { id: 'chengye-good', who: 'chengye', kind: 'good', tier: 3, minStage: 4, minAffection: 12, maxBroken: 0, title: { zh: '安全帽上的灯', en: 'The Lamp on His Hat' }, brief: { zh: '好结局：砖是他一个人撬完的，凌晨四点他把一块青色的砖塞进你手里，说「这块，给你」。你走的那天，他用头灯在站外闪了一下。', en: 'Good ending: he pries the tiles off alone, and at four in the morning presses a blue-green one into your hand: "This one. For you." The day you leave, he flashes his headlamp once outside the station.' } },
    { id: 'chengye-bad', who: 'chengye', kind: 'bad', tier: 1, minStage: 2, minBroken: 1, title: { zh: '碎在墙里', en: 'Broken in the Wall' }, brief: { zh: '坏结局：你答应他的事没做到。拆除队进场时，那六十三块砖还在墙上，和别的砖一起碎了；他在夜宵铺坐了一夜，没再说「还行」。', en: 'Bad ending: you broke your word to him. When the demolition crew arrives the sixty-three tiles are still on the wall, and they break with all the others; he sits in the noodle shop all night and never says "not bad" again.' } },
    { id: 'chengye-near', who: 'chengye', kind: 'normal', tier: 2, minStage: 3, maxBroken: 0, title: { zh: '检修日志', en: 'The Maintenance Log' }, brief: { zh: '恋人未满：你走之前，他在检修日志最后一页画了一张隧道草图，旁边写着「小唐，到此一游」。', en: 'Not quite lovers: before you leave he draws a sketch of the tunnel on the last page of the maintenance log, with "Little Tang was here" beside it.' } },
    // maxBroken 0：失约的玩家应该拿坏结局，不该拿群像合影（群像在同级里优先）
    { id: 'together', kind: 'good', tier: 2, minStage: 2, maxBroken: 0, title: { zh: '青柳站的最后一张合影', en: 'The Last Photo at Qingliu' }, brief: { zh: '隐藏群像结局：你和三个人都走到了心事这一步，却没有和谁走到最后。最后一班车开走以后，韦站长、阿珍、晚舟、许念、程野和你挤在停在 00:47 的挂钟下拍了一张合影；对讲机里调度破例多说了一句：「青柳，辛苦了。」', en: 'Hidden ensemble ending: you reached each of them, but went all the way with none. After the last train leaves, Wei, Ah-Zhen, Wanzhou, Nian, Cheng Ye and you squeeze under the clock stuck at 00:47 for one photo; on the radio, dispatch breaks habit and adds, "Qingliu, thank you."' } },
    { id: 'normal', kind: 'normal', tier: 0, title: { zh: '末班车开走了', en: 'The Last Train Leaves' }, brief: { zh: '普通结局：你做完了十个夜班，在日志最后一页写下「00:50，收车」。第二天你坐上去外地的高铁，窗外的城市里，再也没有那条老 7 号线。', en: 'Normal ending: you finish ten night shifts and write "00:50, in for the night" on the log\'s last page. Next day you board a train to another city; in the city outside the window, old Line 7 is gone.' } },
  ],
  finale: { zh: '最后一句点题「00:47」或「末班车」，落在一个具体的夜里画面上（白线、隧道口的风、停住的挂钟之一）。', en: 'The last sentence should echo the title, 00:47 or the last train, and land on one concrete night image (the white line, wind from the tunnel mouth, or the stopped clock).' },
  loading: [
    { zh: '隧道里吹来一阵风…', en: 'A gust of wind comes up the tunnel...' },
    { zh: '站台广播的回声慢慢散了…', en: 'The echo of an announcement fades...' },
    { zh: '闸机嘀了一声…', en: 'A gate beeps once...' },
    { zh: '夜宵铺的锅冒着白汽…', en: 'Steam rises from the noodle pot...' },
    { zh: '挂钟还停在 00:47…', en: 'The clock still says 00:47...' },
  ],
  // 写作手法层（母题、预写关键场景、揭示、日常细节、人物细节等），见 ./craft.ts
  craft: LASTTRAIN_CRAFT,
}
