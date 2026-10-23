// 《零点四十七分》的写作手法层。全部原创。字段定义见 hooks/craft-types.ts。

import type { PackCraft } from '../../hooks/craft-types'

export const LASTTRAIN_CRAFT: PackCraft = {
  motifs: [
    { id: 'clock', thing: { zh: '停在 00:47 的挂钟', en: 'the clock stopped at 00:47' },
      meanings: [
        { stage: 0, text: { zh: '老站里一件没人修的东西', en: 'one more thing nobody fixed in an old station' } },
        { stage: 2, text: { zh: '末班车到终点的时间', en: 'the minute the last train reaches the terminus' } },
        { stage: 4, text: { zh: '一个夜晚该结束的时候', en: 'the moment a night is meant to end' } },
      ],
      payoff: { zh: '最后一班车到站的那一分钟', en: 'the minute the last train arrives' } },
    { id: 'horns', who: 'wanzhou', thing: { zh: '到青柳时的两声短喇叭', en: 'two short horns at Qingliu' },
      meanings: [
        { stage: 0, text: { zh: '司机跟新来的打招呼', en: 'the driver saying hello to the new guy' } },
        { stage: 2, text: { zh: '她每晚都按，一次没落', en: 'she gives them every night without fail' } },
        { stage: 4, text: { zh: '最后一次', en: 'the last time' } },
      ] },
    { id: 'white-line', who: 'wanzhou', thing: { zh: '站台上那条白漆的安全线', en: 'the white-painted safety line on the platform' },
      meanings: [
        { stage: 0, text: { zh: '「白线后面」，一句规定', en: '"behind the white line", a rule' } },
        { stage: 3, text: { zh: '她以后要站的地方', en: 'where she will stand from now on' } },
      ] },
    { id: 'sketchbook', who: 'xunian', thing: { zh: '许念的速写本', en: 'Nian\'s sketchbook' },
      meanings: [
        { stage: 0, text: { zh: '画车厢里的陌生人', en: 'for drawing strangers on the train' } },
        { stage: 2, text: { zh: '一块一块记下要拆的墙', en: 'recording a wall that will be torn down, tile by tile' } },
        { stage: 3, text: { zh: '洗衣店里的枕头', en: 'her pillow in the laundromat' } },
      ] },
    { id: 'tile-count', who: 'xunian', thing: { zh: '四百三十二块砖', en: 'four hundred and thirty-two tiles' },
      meanings: [
        { stage: 1, text: { zh: '她报出来的一个数', en: 'a number she reels off' } },
        { stage: 3, text: { zh: '画完了，她才肯去想住处', en: 'only when it\'s finished will she think about a place to live' } },
      ],
      payoff: { zh: '最后一块砖', en: 'the last tile' } },
    { id: 'laundromat', who: 'xunian', thing: { zh: '终点站外洗衣店的灯', en: 'the laundromat light outside the terminus' },
      meanings: [
        { stage: 1, text: { zh: '江尾站外唯一亮着的店', en: 'the only lit shop outside Jiangwei' } },
        { stage: 3, text: { zh: '她每晚过夜的地方', en: 'where she spends every night' } },
      ] },
    { id: 'his-tiles', who: 'chengye', thing: { zh: '程野工具箱里的砖坯', en: 'the tile blank in Cheng Ye\'s toolbox' },
      meanings: [
        { stage: 0, text: { zh: '检修工随手带着的一块砖', en: 'a tile a maintenance worker happens to carry' } },
        { stage: 2, text: { zh: '他擦得比扳手还仔细', en: 'he wipes it more carefully than his wrench' } },
        { stage: 3, text: { zh: '墙上有六十三块是他的', en: 'sixty-three tiles on the wall are his' } },
      ],
      payoff: { zh: '第十夜撬下来的那些砖', en: 'the tiles pried off on Night 10' } },
    { id: 'lamp-flash', thing: { zh: '车头灯和头灯互相闪一下', en: 'headlights and a headlamp flashing once at each other' },
      meanings: [
        { stage: 0, text: { zh: '隧道里的习惯', en: 'a tunnel habit' } },
        { stage: 3, text: { zh: '两个夜里的人打招呼的方式', en: 'how two people of the night say hello' } },
      ] },
    { id: 'duty-log', thing: { zh: '值班日志', en: 'the duty log' },
      meanings: [
        { stage: 0, text: { zh: '站长让「我」记的流水账', en: 'the ledger Wei makes me keep' } },
        { stage: 3, text: { zh: '写不进去的事，比写进去的多', en: 'more left out of it than written in' } },
      ] },
  ],

  setPieces: [
    {
      id: 'wz-horn', who: 'wanzhou', kind: 'comedy', motif: 'horns',
      title: { zh: '白线后面', en: 'Behind the White Line' },
      trigger: { beat: 'lt-horn' },
      staging: { zh: '第一夜，青柳站台，23:49。隧道口先来一阵风，然后是车灯。车停稳前两声短喇叭。她拉开驾驶室侧窗，只探出半张脸。她先开口。', en: 'Night one, Qingliu platform, 23:49. First a gust from the tunnel mouth, then the headlights. Two short horns before the train stops. She slides open the cab\'s side window and shows half a face. She speaks first.' },
      lines: [
        { who: 'narration', text: { zh: '隧道口先吹出一阵风，把「我」的帽檐掀了起来，然后才是车灯。', en: 'A gust from the tunnel mouth lifts the brim of my cap before the headlights even appear.' } },
        { who: 'narration', text: { zh: '车停稳之前，响了两声短喇叭。', en: 'Before the train stops, two short horns.' } },
        { who: 'wanzhou', text: { zh: '新来的，白线后面。', en: 'New guy. Behind the white line.' } },
        { who: 'me', text: { zh: '我在白线后面啊。', en: 'I am behind the white line.' } },
        { who: 'wanzhou', text: { zh: '帽子没在。……车进站带风，下回按住。', en: 'Your cap isn\'t. ...Trains bring wind. Hold it next time.' } },
        { who: 'wanzhou', text: { zh: '23:49，正点。', en: '23:49. On time.' } },
      ],
    },
    {
      id: 'xn-sketch', who: 'xunian', kind: 'comedy', motif: 'sketchbook',
      title: { zh: '别浪费', en: 'Don\'t Waste It' },
      trigger: { beat: 'lt-sketch' },
      staging: { zh: '末班车车厢，整节车只有四五个人。她坐在对面，本子立在膝盖上，铅笔一直在动。「我」看见本子上是自己。她不慌，反而让「我」别动。', en: 'The last train car, four or five people in the whole carriage. She sits across from me, sketchbook propped on her knees, pencil never still. I see myself on the page. She isn\'t flustered; she tells me to hold still.' },
      lines: [
        { who: 'narration', text: { zh: '她本子上那个靠着门打瞌睡的人，制服跟「我」一模一样。', en: 'The figure dozing against the door in her sketchbook is wearing my exact uniform.' } },
        { who: 'xunian', text: { zh: '别动别动——你刚才那个姿势很好看，别浪费。', en: 'Don\'t move, don\'t move. That pose was nice. Don\'t waste it.' } },
        { who: 'me', text: { zh: '你画陌生人都不问的吗？', en: 'You draw strangers without asking?' } },
        { who: 'xunian', text: { zh: '问了就不好看了。……站务员，你是青柳站的？', en: 'Asking ruins it. ...Attendant, you\'re from Qingliu?' } },
        { who: 'xunian', text: { zh: '那面墙，一共四百三十二块砖。我画到第二百六十块了。', en: 'That wall has four hundred and thirty-two tiles. I\'m up to two hundred and sixty.' } },
      ],
      unsaid: { zh: '她为什么每晚都坐到终点。', en: 'Why she rides to the end of the line every night.' },
    },
    {
      id: 'cy-tile', who: 'chengye', kind: 'daily', motif: 'his-tiles',
      title: { zh: '枕木中间', en: 'Between the Sleepers' },
      trigger: { beat: 'lt-tile' },
      staging: { zh: '凌晨一点的检修通道，头灯照出一小圈。他走在前面，不回头，只在要紧处停一下。走到站厅背面的检修口，他从墙缝里摸出一块松了的瓷砖。', en: 'The maintenance walkway at one in the morning, a small circle of headlamp light. He walks ahead without looking back, stopping only where it matters. At the inspection hatch behind the concourse he works a loose tile out of a crack.' },
      lines: [
        { who: 'chengye', text: { zh: '嗯。……脚踩枕木中间，别踩钢轨。钢轨滑。', en: 'Mm. ...Step between the sleepers. Not on the rail. Rails are slippery.' } },
        { who: 'narration', text: { zh: '他从检修口的墙缝里抠出一块瓷砖，用袖子擦了擦，蓝色从灰底下露出来。', en: 'He works a tile out of the crack by the hatch and wipes it with his sleeve; blue shows through the dust.' } },
        { who: 'chengye', text: { zh: '这块，你先拿着。', en: 'This one. Hold it for now.' } },
        { who: 'me', text: { zh: '这是壁画上的？', en: 'Is it from the mural?' } },
        { who: 'chengye', text: { zh: '别告诉站长。……你就当没看见。', en: 'Don\'t tell the station master. ...Pretend you didn\'t see it.' } },
      ],
      unsaid: { zh: '这块砖是谁烧的。', en: 'Who fired this tile.' },
    },
    {
      id: 'xn-notice', who: 'xunian', kind: 'daily', motif: 'tile-count',
      title: { zh: '一个闸机的距离', en: 'One Gate Apart' },
      trigger: { beat: 'lt-notice' },
      staging: { zh: '傍晚的站厅，公告栏前围着几个人。许念蹲在公告前面画公告本身，画完才开口；程野站在壁画前，手插在背心口袋里。两个人隔着一个闸机，谁也没看谁。「我」站在中间。', en: 'The concourse in the evening, a few people at the notice board. Nian crouches in front of the notice and draws the notice itself, speaking only once she has finished; Cheng Ye stands in front of the mural, hands in his vest pockets. One gate apart, neither looks at the other. I stand between them.' },
      lines: [
        { who: 'narration', text: { zh: '公告只有三行字，最后一行是「站内壁画随站拆除，不做保留」。', en: 'The notice is three lines long; the last says, "The mural in the station will be removed with it and not kept."' } },
        { who: 'xunian', text: { zh: '「不做保留」。四个字，比我画一块砖还快。', en: '"Not kept." Two words. Faster than I can draw one tile.' } },
        { who: 'narration', text: { zh: '闸机那边，程野伸手碰了碰壁画右下角的一块砖，又把手收回口袋里。', en: 'Across the gate, Cheng Ye touches a tile in the mural\'s lower right corner, then puts his hand back in his pocket.' } },
        { who: 'xunian', text: { zh: '站务员，还剩几天？', en: 'Attendant, how many days left?' } },
        { who: 'me', text: { zh: '六天。', en: 'Six.' } },
        { who: 'xunian', text: { zh: '一百五十块砖，六天。……够了。够了吧？', en: 'A hundred and fifty tiles in six days. ...That\'s enough. That\'s enough, right?' } },
      ],
      unsaid: { zh: '闸机那边的人也在看同一面墙。', en: 'That the man across the gate is looking at the same wall.' },
    },
    {
      id: 'wz-signal', who: 'wanzhou', kind: 'conflict', motif: 'white-line',
      title: { zh: '请复诵', en: 'Repeat, Please' },
      trigger: { beat: 'lt-signal' },
      staging: { zh: '青柳站台，末班车进站之前，「我」手里的对讲机传来调度和她的对话。车进站后，她下车透口气，站在白线后面揉眼睛。她不解释，只说灯的事。', en: 'Qingliu platform, before the last train comes in; the radio in my hand carries dispatch talking to her. Once the train is in, she steps out for a breath of air and stands behind the white line rubbing her eyes. She explains nothing, only talks about the lamps.' },
      lines: [
        { who: 'diaodu', text: { zh: '末班车司机，请复诵信号。……请复诵。', en: 'Last train driver, repeat the signal. ...Repeat, please.' } },
        { who: 'wanzhou', text: { zh: '……黄灯，减速。收到。', en: '...Yellow. Slowing. Copy.' } },
        { who: 'narration', text: { zh: '车进站以后，她下车站在白线后面，用手背按了按眼睛。', en: 'After the train comes in she steps out, stands behind the white line and presses the back of her hand to her eyes.' } },
        { who: 'wanzhou', text: { zh: '隧道里的灯，今年好像暗了一点。', en: 'The tunnel lamps seem a bit dimmer this year.' } },
        { who: 'me', text: { zh: '你眼睛不舒服？', en: 'Are your eyes bothering you?' } },
        { who: 'wanzhou', text: { zh: '没事。……绿灯我还看得见。', en: 'It\'s fine. ...I can still see green.' } },
      ],
      unsaid: { zh: '她的眼睛。', en: 'Her eyes.' },
    },
    {
      id: 'xn-laundry', who: 'xunian', kind: 'confession', motif: 'laundromat',
      title: { zh: '别问', en: 'Don\'t Ask' },
      trigger: { beat: 'lt-laundry' },
      staging: { zh: '江尾站外，凌晨一点，整条街只有自助洗衣店亮着。她推门进去，在靠窗的塑料椅上坐下，把速写本垫在脑后。回头看见「我」，她先笑。', en: 'Outside Jiangwei at one in the morning, only the self-service laundromat lit on the whole street. She goes in, sits on the plastic chair by the window and puts her sketchbook behind her head. She turns, sees me, and smiles first.' },
      lines: [
        { who: 'narration', text: { zh: '洗衣店里一台烘干机在转，空的，没放衣服。', en: 'One dryer in the laundromat is turning, empty, no clothes inside.' } },
        { who: 'xunian', text: { zh: '……别问。', en: '...Don\'t ask.' } },
        { who: 'me', text: { zh: '我没问。', en: 'I didn\'t.' } },
        { who: 'xunian', text: { zh: '你脸上问了。灰绿色的，一直在问。', en: 'Your face did. Grey-green, asking the whole time.' } },
        { who: 'xunian', text: { zh: '这里有空调，有灯，凌晨三点有人来收硬币。……挺好的。真的。', en: 'There\'s air-con, there\'s light, someone comes to empty the coins at three. ...It\'s fine. Really.' } },
      ],
      unsaid: { zh: '她已经一个月没有住处。', en: 'That she has had nowhere to live for a month.' },
    },
    {
      id: 'cy-shoebox', who: 'chengye', kind: 'reveal', motif: 'his-tiles',
      title: { zh: '旧鞋盒', en: 'The Old Shoebox' },
      trigger: { beat: 'lt-shoebox' },
      staging: { zh: '收工以后，一盏应急灯下。他打开一个旧鞋盒，里面用报纸隔着一摞瓷砖，颜色和壁画一模一样。他先说数字，再说请求，中间停了很久。', en: 'After his shift, under an emergency lamp. He opens an old shoebox: a stack of tiles separated by newspaper, the exact colours of the mural. He gives a number first, then a request, with a long pause between.' },
      lines: [
        { who: 'narration', text: { zh: '鞋盒里的砖用报纸一层层隔着，最上面一块还没上釉，是灰白的砖坯。', en: 'The tiles in the shoebox are layered with newspaper; the top one is unglazed, a grey-white blank.' } },
        { who: 'chengye', text: { zh: '嗯。……这些是备用的。墙上那些，有一些是我烧的。', en: 'Mm. ...These are spares. Some of the ones on the wall, I fired.' } },
        { who: 'me', text: { zh: '一些是多少？', en: 'How many is some?' } },
        { who: 'chengye', text: { zh: '六十三块。', en: 'Sixty-three.' } },
        { who: 'narration', text: { zh: '他把鞋盒盖上，又打开，又盖上。', en: 'He closes the shoebox, opens it, closes it again.' } },
        { who: 'chengye', text: { zh: '第十夜，拆除队来之前。……我一个人，撬不完。', en: 'Night ten, before the demolition crew. ...On my own, I can\'t get them all off.' } },
      ],
      unsaid: { zh: '站长早就知道。', en: 'That the station master has known all along.' },
    },
    {
      id: 'xn-mural', who: 'xunian', kind: 'climax', motif: 'tile-count',
      title: { zh: '颜色不对的那一块', en: 'The Tile in the Wrong Blue' },
      trigger: { beat: 'lt-mural', minStage: 2 },
      staging: { zh: '第九夜收车以后，站厅只开了一排灯。许念坐在壁画前的旧报纸上，面前是最后几块砖。程野扛着工具箱从检修口进来，看见她，停住。「我」在两人之间。这一幕停在他们第一次说话之后，不替结局决定画没画完、她有没有开口。', en: 'Night nine after closing, one row of lights in the concourse. Nian sits on old newspaper in front of the mural, the last few tiles before her. Cheng Ye comes in through the inspection hatch with his toolbox, sees her, and stops. I am between them. The scene stops after they first speak; it does not decide for the endings whether the drawing gets finished or whether she speaks up.' },
      lines: [
        { who: 'xunian', text: { zh: '你是谁？……拆除队不是明天才来吗。', en: 'Who are you? ...Isn\'t the demolition crew coming tomorrow?' } },
        { who: 'chengye', text: { zh: '嗯。我不是拆的。', en: 'Mm. I\'m not here to tear it down.' } },
        { who: 'narration', text: { zh: '她的铅笔停在一块砖上。那块的蓝，比旁边的都新一点。', en: 'Her pencil stops on one tile. Its blue is a little newer than the ones around it.' } },
        { who: 'xunian', text: { zh: '这一块，我画了三遍都不对。颜色太新了。', en: 'This one, I\'ve drawn it three times and it\'s never right. The colour is too new.' } },
        { who: 'chengye', text: { zh: '……嗯。去年换的。', en: '...Mm. Changed last year.' } },
      ],
      unsaid: { zh: '是他换的。', en: 'That he changed it.' },
    },
    {
      id: 'wz-last', who: 'wanzhou', kind: 'farewell', motif: 'clock',
      title: { zh: '最后一分钟', en: 'The Last Minute' },
      trigger: { beat: 'lt-last', minStage: 3 },
      staging: { zh: '第十夜，23:50，青柳站台挤满了送车的人。她从驾驶室侧窗探出来，看了一眼站台上的时钟，又看「我」。这一幕停在车门关上之前，「我」站在哪里由选择决定。', en: 'Night ten, 23:50, the Qingliu platform packed with people seeing the train off. She leans out of the cab\'s side window, glances at the platform clock, then at me. The scene stops before the doors close; where I stand is up to the choice.' },
      lines: [
        { who: 'narration', text: { zh: '站台上有人在拍车头，有人在拍「青柳」两个字，有个老人只是摸了摸立柱。', en: 'People photograph the cab, people photograph the word "Qingliu", one old man just touches a pillar.' } },
        { who: 'wanzhou', text: { zh: '23:50。还有一分钟。', en: '23:50. One minute.' } },
        { who: 'wanzhou', text: { zh: '00:47 到江尾。最后一次，跟站厅那个钟对上。', en: '00:47 at Jiangwei. Last time it matches the clock in the concourse.' } },
        { who: 'wanzhou', text: { zh: '唐越。……你站哪儿，自己选。', en: 'Tang Yue. ...Where you stand, you choose.' } },
      ],
      unsaid: { zh: '这是她最后一次开车。', en: 'That this is her last drive.' },
    },
    {
      id: 'wz-noodles', who: 'wanzhou', kind: 'daily', motif: 'clock',
      title: { zh: '一碗粉的时刻表', en: 'A Timetable over Noodles' },
      trigger: { places: ['stall'], slots: [0], minStage: 1, after: ['beat:lt-horn'] },
      staging: { zh: '傍晚的夜宵铺，她交班前在这儿吃一碗粉，制服外套搭在椅背上。「我」随口问到哪一站要多久，她不看手机，一口气报完。', en: 'The noodle shop in the evening; she eats a bowl before her shift, uniform jacket over the chair. I ask offhand how long to some station; without looking at a phone she recites them all in one breath.' },
      lines: [
        { who: 'me', text: { zh: '从青柳到江尾要多久？', en: 'How long from Qingliu to Jiangwei?' } },
        { who: 'wanzhou', text: { zh: '青柳 23:51 开，柳岸 23:56，老码头 00:03，纺织厂 00:11，南湾 00:20，鹭洲 00:31，江尾 00:47。', en: 'Qingliu departs 23:51, Liu\'an 23:56, Old Pier 00:03, Textile Mill 00:11, Nanwan 00:20, Luzhou 00:31, Jiangwei 00:47.' } },
        { who: 'azhen', text: { zh: '晚舟，粉要坨啦。', en: 'Wanzhou, your noodles are going soggy.' } },
        { who: 'wanzhou', text: { zh: '……五十六分钟。你问的是这个吧。', en: '...Fifty-six minutes. That\'s what you asked, right?' } },
      ],
    },
    {
      id: 'cy-sounds', who: 'chengye', kind: 'daily',
      title: { zh: '隧道的声音', en: 'What the Tunnel Sounds Like' },
      trigger: { places: ['tunnel'], slots: [1], minStage: 1, after: ['beat:lt-tile'] },
      staging: { zh: '收车以后的检修通道，两人站在应急灯下，他让「我」把头灯压低、别出声。他一样一样指给「我」听。', en: 'The walkway after service; standing under an emergency lamp, he has me tilt my headlamp down and keep quiet. He points out each sound.' },
      lines: [
        { who: 'chengye', text: { zh: '头灯压低。……听。', en: 'Lamp down. ...Listen.' } },
        { who: 'narration', text: { zh: '滴水声，远处排风扇的嗡嗡声，还有一种很细的、像有人在很远的地方吹口哨的声音。', en: 'Dripping water, the hum of a distant exhaust fan, and something very thin, like someone whistling far away.' } },
        { who: 'me', text: { zh: '那个口哨是什么？', en: 'What\'s the whistling?' } },
        { who: 'chengye', text: { zh: '风过道岔。……它一响，就是要下雨了。', en: 'Wind through the points. ...When it sings, rain\'s coming.' } },
        { who: 'chengye', text: { zh: '还行。你耳朵还行。', en: 'Not bad. Your ears are not bad.' } },
      ],
    },
    {
      id: 'xn-colors', who: 'xunian', kind: 'comedy', motif: 'sketchbook',
      title: { zh: '每个人的颜色', en: 'Everyone\'s Colour' },
      trigger: { places: ['concourse'], slots: [0], minStage: 1, after: ['beat:lt-sketch'] },
      staging: { zh: '傍晚的站厅，她坐在壁画前的台阶上画砖，「我」站在旁边挡着路过的人。她画的时候一个字不说；每画完一块，才抬头给车站里的一个人配一个颜色。', en: 'The concourse in the evening; she sits on the step in front of the mural drawing tiles while I stand guard against passers-by. She says nothing while drawing; each time she finishes a tile she looks up and gives one person in the station a colour.' },
      lines: [
        { who: 'xunian', text: { zh: '站长是深绿色的，旧铁皮柜那种。阿珍是橘红色，锅底火那种。', en: 'The station master is dark green, old filing-cabinet green. Ah-Zhen is orange-red, flame-under-the-pot red.' } },
        { who: 'me', text: { zh: '末班车司机呢？', en: 'And the last-train driver?' } },
        { who: 'xunian', text: { zh: '凌晨四点的天，蓝里带一点灰。……你呢，还是灰绿色。', en: 'The sky at four in the morning, blue with a little grey. ...You\'re still grey-green.' } },
        { who: 'me', text: { zh: '灰绿色是好是坏？', en: 'Is grey-green good or bad?' } },
        { who: 'xunian', text: { zh: '你刚才说什么？……哦。灰绿色是青柳站站名牌的颜色。你自己想。', en: 'What did you just say? ...Oh. Grey-green is the colour of Qingliu\'s station sign. Work it out.' } },
      ],
    },
  ],

  routes: {
    commonUntil: 3,
    commonGoal: { zh: '共通线：三个夜里的人都露面，每人一个反常：司机每晚到青柳按两声喇叭、画画的人从不坐回程、检修工让「我」别告诉站长。', en: 'Common route: all three night people appear, each with one oddity: the driver\'s two horns at Qingliu, the artist who never rides back, the maintenance worker\'s "don\'t tell the station master".' },
    lock: { minStage: 2, minAffection: 6, margin: 2 },
    branches: [
      { who: 'wanzhou', goal: { zh: '个人线·晚舟：信号、喇叭、白线；最后一班车，最后一次开车。', en: 'Wanzhou route: signals, horns, the white line; the last train, her last drive.' }, others: { zh: '许念照常每晚坐到终点；程野的头灯在隧道深处闪一下。', en: 'Nian still rides to the end every night; Cheng Ye\'s headlamp flashes once deep in the tunnel.' } },
      { who: 'xunian', goal: { zh: '个人线·许念：四百三十二块砖和一盏洗衣店的灯。', en: 'Nian route: four hundred and thirty-two tiles and one laundromat light.' }, others: { zh: '晚舟到青柳照样按两声喇叭；程野在站厅背面补着什么。', en: 'Wanzhou still gives two horns at Qingliu; Cheng Ye is mending something behind the concourse wall.' } },
      { who: 'chengye', goal: { zh: '个人线·程野：一面别人都以为是原样的墙，和六十三块他自己烧的砖。', en: 'Cheng Ye route: a wall everyone thinks is original, and sixty-three tiles he fired himself.' }, others: { zh: '许念对着壁画画到半夜；晚舟的车头灯每晚闪一下检修班。', en: 'Nian draws the mural until midnight; Wanzhou\'s headlights flash at the maintenance crew every night.' } },
    ],
    ensemble: { zh: '群像线：最后一班车开走以后，三个人的事在停住的挂钟下一起收尾。', en: 'Ensemble route: after the last train leaves, all three threads close together under the stopped clock.' },
  },

  reveals: [
    {
      id: 'rv-horns', when: { after: ['beat:lt-signal'], who: 'wanzhou', minStage: 3 },
      truth: { zh: '到青柳的两声喇叭，是她实习那年和韦站长约好的：「到了按两声，我就知道你平安。」她开车这五年，他每晚 23:49 都站在站台上听。第一夜她多看了「我」一眼，是因为那天站台上站的是一个新来的人，而他站在新人身后。', en: 'The two horns at Qingliu were a deal she made with Wei the year she trained: "Give two when you arrive, and I\'ll know you\'re safe." Every night at 23:49 in her five years of driving he has stood on the platform to hear them. On the first night she looked twice at me because a new person was standing there, with him just behind.' },
      reframes: [
        { zh: '第一夜那两声短喇叭', en: 'the two short horns on the first night' },
        { zh: '韦站长每晚 23:49 都出现在站台上', en: 'Wei turning up on the platform at 23:49 every night' },
      ],
    },
    {
      id: 'rv-zhen', when: { after: ['beat:lt-laundry'], who: 'xunian', minStage: 3 },
      truth: { zh: '阿珍早就看出许念每晚坐末班车去终点、从不回来。那个多煮的蛋，是她想不出别的办法时能做的唯一一件事；她楼上有一间空房，一直等许念开口。', en: 'Ah-Zhen worked out long ago that Nian rides the last train to the end and never comes back. The extra egg was the one thing she could do when she couldn\'t think of anything else; there is an empty room upstairs, and she has been waiting for Nian to ask.' },
      reframes: [
        { zh: '阿珍每晚多煮的那个蛋', en: 'the extra egg Ah-Zhen boils every night' },
        { zh: '阿珍那句「她不来，我就自己吃」', en: 'Ah-Zhen\'s "if she doesn\'t come, I eat it myself"' },
      ],
    },
    {
      id: 'rv-keys', when: { after: ['beat:lt-shoebox'], who: 'chengye', minStage: 3 },
      truth: { zh: '韦站长八年来都知道壁画上有程野换的砖，一次也没记进日志。放在桌上的那串钥匙，是检修口和站厅侧门的；「我什么都没看见」是说给第十夜听的。', en: 'For eight years Wei has known Cheng Ye was replacing tiles on the mural and never once logged it. The ring of keys he left on the desk opens the inspection hatch and the concourse side door; "I didn\'t see a thing" was meant for Night 10.' },
      reframes: [
        { zh: '值班室桌上那串钥匙', en: 'the ring of keys on the duty-office desk' },
        { zh: '程野那句「别告诉站长」', en: 'Cheng Ye\'s "don\'t tell the station master"' },
      ],
    },
  ],

  flashbacks: [
    { id: 'fb-first-ride', who: 'me', trigger: { after: ['beat:lt-horn'] }, text: { zh: '小时候妈妈带「我」第一次坐 7 号线，从头坐到终点再坐回来，「我」趴在车窗上数隧道里的灯，数到睡着。', en: 'The first time Mum took me on Line 7 as a kid, we rode to the end and back, and I pressed my face to the window counting tunnel lamps until I fell asleep.' } },
    { id: 'fb-solo', who: 'wanzhou', trigger: { minStage: 2, motif: 'horns' }, text: { zh: '她第一次单独开末班车，到青柳时手心全是汗，按了两声喇叭，手才不抖了。', en: 'Her first solo last train: palms wet when she reached Qingliu; she gave two horns, and only then did her hands stop shaking.' } },
    { id: 'fb-class', who: 'xunian', trigger: { minStage: 2 }, text: { zh: '大一的色彩课上，老师说她调的灰「有温度」，那天她在宿舍走廊上来回走了二十趟。', en: 'In first-year colour class her teacher said her greys "had warmth", and that night she walked the dorm corridor twenty times.' } },
    { id: 'fb-kiln', who: 'chengye', trigger: { minStage: 2, motif: 'his-tiles' }, text: { zh: '他烧的第一块砖在舅舅的小窑里裂成了两半，舅舅说「釉配得对，火急了」，他又等了三天才敢再开窑。', en: 'The first tile he ever fired cracked in two in his uncle\'s little kiln. "Glaze is right, fire was too hasty," his uncle said, and he waited three days before daring to fire again.' } },
  ],

  texture: {
    days: [
      { day: 1, weather: { zh: '闷热，没有风', en: 'muggy, no wind' }, bits: [{ zh: '新发的制服领子太硬，磨脖子', en: 'the collar of the new uniform is stiff and chafes' }] },
      { day: 2, weather: { zh: '傍晚一阵雷阵雨', en: 'a thunder shower at dusk' }, bits: [{ zh: '站厅地上的伞套堆成一小座山', en: 'umbrella sleeves pile up in a small hill on the concourse floor' }] },
      { day: 3, weather: { zh: '晴，夜里有月亮', en: 'clear, a moon at night' }, bits: [{ zh: '夜宵铺来了一桌刚下班的护士', en: 'a table of nurses just off shift at the noodle shop' }] },
      { day: 4, weather: { zh: '阴', en: 'overcast' }, bits: [{ zh: '公告栏的玻璃上贴着一张手写的「舍不得」', en: 'a handwritten "we\'ll miss you" taped to the notice-board glass' }] },
      { day: 5, weather: { zh: '湿热，地面在冒汽', en: 'humid, the pavement steaming' }, bits: [{ zh: '值班室的风扇卡住了一片叶子', en: 'the duty-office fan has one blade stuck' }] },
      { day: 6, weather: { zh: '夜里起风', en: 'wind at night' }, bits: [{ zh: '江尾站外的路灯坏了两盏', en: 'two streetlights out near Jiangwei' }] },
      { day: 7, weather: { zh: '晴', en: 'clear' }, bits: [{ zh: '有人在站台立柱上贴了一张「谢谢你，7 号线」', en: 'someone has stuck "Thank you, Line 7" on a platform pillar' }] },
      { day: 8, weather: { zh: '小雨', en: 'light rain' }, bits: [{ zh: '韦站长的帽子放在日志上压着', en: 'Wei\'s cap sitting on the log to hold it down' }] },
      { day: 9, weather: { zh: '闷热，云很低', en: 'muggy, low cloud' }, bits: [{ zh: '洗衣店玻璃上贴出「转租」', en: '"To let" taped on the laundromat window' }] },
      { day: 10, weather: { zh: '晴，没有风', en: 'clear, no wind' }, bits: [{ zh: '站台上的人比任何一个早高峰都多', en: 'more people on the platform than any morning rush' }] },
    ],
    places: {
      concourse: [{ zh: '壁画右下角有一块砖的蓝比别的新', en: 'one tile in the mural\'s lower right is a newer blue than the rest' }, { zh: '闸机的嘀声在空站厅里会回一下', en: 'in the empty concourse a gate\'s beep echoes once' }],
      platform: [{ zh: '隧道口的风带着铁锈和机油味', en: 'the tunnel wind smells of rust and machine oil' }],
      office: [{ zh: '失物招领柜里有一把十年没人认领的伞', en: 'an umbrella in lost-and-found nobody has claimed in ten years' }],
      stall: [{ zh: '锅边的辣椒罐用胶带缠着', en: 'the chilli jar by the pot held together with tape' }],
      exit: [{ zh: '外卖员在台阶上坐着等单', en: 'delivery riders sitting on the steps waiting for orders' }],
      car: [{ zh: '拉环一起晃，像一排钟摆', en: 'hand straps swaying together like a row of pendulums' }],
      terminal: [{ zh: '出站口的自动门开了又关，外面没有人', en: 'the exit\'s automatic door opens and shuts on no one' }],
      tunnel: [{ zh: '应急灯下的墙上用粉笔写着日期和名字', en: 'dates and names chalked on the wall under an emergency lamp' }],
    },
    any: [{ zh: '车门关上前的提示音', en: 'the chime before the doors close' }, { zh: '凌晨的路灯底下飞着小虫', en: 'small insects around a streetlight in the small hours' }],
  },

  gags: [
    { id: 'azhen-handsome', who: ['azhen'], text: { zh: '阿珍管所有男的叫「靓仔」，包括韦站长；韦站长每次都纠正「叫站长」，阿珍每次都说「好的靓仔」。', en: 'Ah-Zhen calls every man "handsome", Wei included; every time he corrects her, "Stationmaster," and every time she says, "Sure, handsome."' }, places: ['stall'] },
    { id: 'wei-log', who: ['weizhang'], text: { zh: '韦站长让「我」什么都记日志，连「22:13，站厅飞进一只蛾子」也要记，「我」开始怀疑日志比「我」先认识这个站。', en: 'Wei has me log everything, down to "22:13, a moth flew into the concourse"; I start to suspect the log knew this station before I did.' } },
    { id: 'dispatch-flat', who: ['diaodu'], text: { zh: '调度说什么都一个调子，连「有人在站台求婚，请注意秩序」也念得像天气预报。', en: 'Dispatch says everything in one tone, even "someone is proposing on the platform, please keep order", read like a weather report.' } },
    { id: 'nian-colors', who: ['xunian'], text: { zh: '许念给每个人配颜色，配到后来连闸机都有颜色：「这台是不耐烦的黄。」', en: 'Nian gives everyone a colour, and eventually the gates get colours too: "This one is an impatient yellow."' }, places: ['concourse'] },
  ],

  gossip: [
    { id: 'g-zhen-nian', from: 'azhen', about: 'xunian', truth: 'true', text: { zh: '「那个画画的妹仔，每晚坐末班车去终点，没见她坐回来过。」', en: '"That girl who draws rides the last train to the end every night. Never seen her ride back."' } },
    // 晚舟眼睛的两条八卦都等第 5 夜站台那一幕（晚报黄灯）发生过再说
    { id: 'g-zhen-wanzhou', from: 'azhen', about: 'wanzhou', truth: 'true', after: ['beat:lt-signal'], text: { zh: '「晚舟最近看菜单要凑得好近。我跟她说字没变小，她说那是灯暗了。」', en: '"Wanzhou\'s been holding the menu right up to her face. I told her the writing hasn\'t shrunk, she said the light\'s dimmer."' } },
    { id: 'g-dispatch', from: 'diaodu', about: 'wanzhou', truth: 'half', after: ['beat:lt-signal'], text: { zh: '「末班车司机复诵信号，比上周慢半拍。……记录在案。」', en: '"Last-train driver repeating signals half a beat slower than last week. ...Noted."' } },
    // 站长知道程野换砖是阶段 3 的关系：等鞋盒那一幕之后才让他含糊提一句
    { id: 'g-wei-ye', from: 'weizhang', about: 'chengye', truth: 'half', after: ['beat:lt-shoebox'], text: { zh: '「检修班那个程野，活干得细。细到有些活，日志里不用记。」', en: '"Cheng Ye on the maintenance crew does careful work. So careful some of it doesn\'t need logging."' } },
    { id: 'g-zhen-me', from: 'azhen', about: 'me', truth: 'half', fromDay: 3, text: { zh: '「新来的靓仔，三个人都跟他说过话了。……我这铺子以后有生意了。」', en: '"The handsome new boy\'s already talking to all three of them. ...My shop\'s got business ahead."' } },
  ],

  people: {
    wanzhou: {
      quirks: [{ zh: '报时间精确到分', en: 'gives times to the minute' }, { zh: '「白线后面」', en: '"Behind the white line"' }],
      habits: [{ zh: '笑之前先低头', en: 'looks down before smiling' }, { zh: '用手背按眼睛', en: 'presses the back of her hand to her eyes' }],
      contradiction: { zh: '比谁都守规定，却把自己的体检结果压着不报', en: 'keeps every rule, yet sits on her own medical result' },
      growth: { zh: '从一个人看信号，到让别人替她报一次', en: 'from watching signals alone to letting someone call them for her once' },
      diaryVoice: {
        style: { zh: '像行车日志：时间、站名、信号，最后一行才写一句自己的话', en: 'like a cab log: times, stations, signals; only the last line is her own' },
        hides: { zh: '眼睛的事', en: 'her eyes' },
        seesMe: [
          { zh: '新来的，帽子会飞', en: 'the new guy whose cap flies off' },
          { zh: '每晚 23:49 站在白线后面的人', en: 'the one behind the white line at 23:49 every night' },
          { zh: '他听出我晚报了一个黄灯', en: 'he heard me call a yellow late' },
          { zh: '我想让他坐在我旁边', en: 'I want him beside me' },
          { zh: '最后一班车', en: 'the last train' },
        ],
      },
      dejaVu: [{ zh: '「新来的……你好像不是第一次站这儿。」', en: '"New guy... you don\'t seem new to this spot."' }],
      awayVoice: [{ zh: '「23:49，青柳。白线后面没人。」', en: '"23:49, Qingliu. No one behind the white line."' }],
    },
    xunian: {
      quirks: [{ zh: '用颜色形容人', en: 'describes people in colours' }, { zh: '「你刚才说什么？」', en: '"What did you just say?"' }],
      habits: [{ zh: '画画时一个字不说', en: 'silent while drawing' }, { zh: '被问住处就笑着岔开', en: 'laughs off questions about where she lives' }],
      contradiction: { zh: '能一块不落地记下一面墙，却不肯开口说自己没地方住', en: 'can record a whole wall tile by tile, but won\'t say she has nowhere to live' },
      growth: { zh: '从「画完再说」到先开口', en: 'from "after I finish" to speaking up first' },
      diaryVoice: {
        style: { zh: '写在速写本的背面，句子很短，每句后面标一个颜色', en: 'on the back of sketch pages, short sentences, each tagged with a colour' },
        hides: { zh: '洗衣店', en: 'the laundromat' },
        seesMe: [
          { zh: '站务员，灰绿色', en: 'the attendant, grey-green' },
          { zh: '帮我挡人的', en: 'the one who keeps people out of my way' },
          { zh: '他看见我去了洗衣店', en: 'he saw me go into the laundromat' },
          { zh: '灰绿色是青柳站的颜色', en: 'grey-green is Qingliu\'s colour' },
          { zh: '第四百三十二块', en: 'number four hundred and thirty-two' },
        ],
      },
      dejaVu: [{ zh: '「站务员，这个姿势……我是不是画过你？」', en: '"Attendant, this pose... have I drawn you before?"' }],
      awayVoice: [{ zh: '「今天画了二十五块。你不在，没人挡路。」', en: '"Twenty-five tiles today. You weren\'t here; no one kept the way clear."' }],
    },
    chengye: {
      quirks: [{ zh: '说话前先「嗯」', en: '"mm" before speaking' }, { zh: '「还行」', en: '"Not bad"' }],
      habits: [{ zh: '手上永远在擦东西', en: 'always wiping something' }, { zh: '用头灯闪一下代替打招呼', en: 'flashes his headlamp instead of saying hi' }],
      contradiction: { zh: '把别人的墙补了八年，却觉得拿走自己的砖是件坏事', en: 'mended someone else\'s wall for eight years, yet feels taking back his own tiles is wrong' },
      growth: { zh: '从一个人夜里补墙，到开口请人帮忙', en: 'from mending the wall alone at night to asking for help' },
      diaryVoice: {
        style: { zh: '写在检修日志的空白处：日期、里程、换了什么，偶尔画一块砖', en: 'in the margins of the maintenance log: date, chainage, what was replaced, now and then a drawing of a tile' },
        hides: { zh: '六十三块', en: 'the sixty-three' },
        seesMe: [
          { zh: '小唐，踩钢轨的', en: 'Little Tang, the one who steps on rails' },
          { zh: '耳朵还行', en: 'ears not bad' },
          { zh: '他拿着那块砖没告诉站长', en: 'he kept that tile and didn\'t tell the station master' },
          { zh: '鞋盒给他看了', en: 'I showed him the shoebox' },
          { zh: '还行。有他在，还行', en: 'not bad; with him here, not bad' },
        ],
      },
      dejaVu: [{ zh: '「嗯……枕木中间。你好像本来就知道。」', en: '"Mm... between the sleepers. Seems you already knew."' }],
      awayVoice: [{ zh: '「隧道里口哨响了。要下雨。你人呢。」', en: '"The tunnel\'s whistling. Rain coming. Where are you."' }],
    },
    weizhang: { quirks: [{ zh: '「记日志」', en: '"Log it"' }], habits: [{ zh: '把东西放在桌上就走', en: 'leaves things on the desk and walks off' }] },
    azhen: { quirks: [{ zh: '「靓仔」「食咗未」', en: '"handsome", "eaten yet?"' }], habits: [{ zh: '往碗里多加东西', en: 'adds extra to your bowl' }] },
    diaodu: { quirks: [{ zh: '先报呼号', en: 'call sign first' }] },
  },
}
