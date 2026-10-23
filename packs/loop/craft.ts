// 《潮信七日》的写作手法层。时间循环包：预写关键场景每一轮都会重新触发（flags 随循环清空），台词写成第 1 轮和第 N 轮都成立的样子。
// 全部原创。字段定义见 hooks/craft-types.ts。

import type { PackCraft } from '../../hooks/craft-types'

export const LOOP_CRAFT: PackCraft = {
  motifs: [
    { id: 'tide-log', who: 'wanlan', thing: { zh: '潮信簿和空着的最后一行', en: 'the tide log and its blank last line' },
      meanings: [
        { stage: 0, text: { zh: '一本旧簿子，访客页上有「我」的签名', en: 'an old ledger with my signature on the visitors\' page' } },
        { stage: 2, text: { zh: '她每天抄潮位，抄的都是她早就知道的数', en: 'she copies the tides each day, numbers she already knows' } },
        { stage: 3, text: { zh: '写下最后一行，这一周就会结束', en: 'writing the last line ends the week' } },
      ],
      payoff: { zh: '她亲手写下的那一行', en: 'the line she writes herself' } },
    { id: 'tide-time', who: 'wanlan', thing: { zh: '满潮的时刻', en: 'the time of high tide' },
      meanings: [
        { stage: 0, text: { zh: '她随口报出的数字，准得吓人', en: 'a number she reels off, uncannily precise' } },
        { stage: 2, text: { zh: '她用它确认这一轮和上一轮哪里不一样', en: 'how she checks what differs from the last loop' } },
      ] },
    { id: 'lamp', thing: { zh: '灯塔旋转的光', en: 'the lighthouse beam turning' },
      meanings: [
        { stage: 0, text: { zh: '海角上的风景', en: 'scenery on the headland' } },
        { stage: 3, text: { zh: '最后几夜亮着的老灯', en: 'an old lamp in its last nights' } },
        { stage: 4, text: { zh: '熄灭，或者再亮一次', en: 'going out, or shining once more' } },
      ] },
    { id: 'song-slip', who: 'yetang', thing: { zh: '每晚同一首歌的匿名点歌条', en: 'the anonymous request slip for the same song every night' },
      meanings: [
        { stage: 0, text: { zh: '节目里的一个怪听众', en: 'an odd listener on the show' } },
        { stage: 2, text: { zh: '叶棠念到署名栏会停一下', en: 'Ye Tang pauses at the signature line' } },
        { stage: 3, text: { zh: '一个人点给另一个人的、听不见的歌', en: 'a song requested for someone who can no longer hear it' } },
      ] },
    { id: 'herbal-jelly', who: 'yetang', thing: { zh: '玻璃碗盖着的龟苓膏', en: 'herbal jelly under a glass cover' },
      meanings: [
        { stage: 0, text: { zh: '外地仔的入门费', en: 'the out-of-towner\'s entry fee' } },
        { stage: 3, text: { zh: '阿嬷一直多做的那一碗', en: 'the extra bowl Ah-Ma always makes' } },
      ] },
    { id: 'on-air', who: 'yetang', thing: { zh: '「直播中」的红灯', en: 'the red ON AIR lamp' },
      meanings: [
        { stage: 1, text: { zh: '她最自在的地方', en: 'where she is most herself' } },
        { stage: 3, text: { zh: '红灯亮着时她才说得出真话', en: 'she can only tell the truth while it is lit' } },
      ] },
    { id: 'net', who: 'chendu', thing: { zh: '补到一半的渔网', en: 'a half-mended net' },
      meanings: [
        { stage: 0, text: { zh: '码头上干不完的活', en: 'endless dock work' } },
        { stage: 2, text: { zh: '要跟船一起卖掉的东西', en: 'something to be sold along with the boat' } },
        { stage: 4, text: { zh: '补好了，就能出海', en: 'once mended, it can go to sea' } },
      ] },
    { id: 'boat-name', who: 'chendu', thing: { zh: '船头的「浅湾七号」', en: '"Qianwan No. 7" on the bow' },
      meanings: [
        { stage: 1, text: { zh: '阿爸的船', en: 'her father\'s boat' } },
        { stage: 3, text: { zh: '她想接过来的那条船', en: 'the boat she wants to take over' } },
      ],
      payoff: { zh: '风停之后，是谁站在船头', en: 'who stands at the bow after the wind drops' } },
    { id: 'horn', thing: { zh: '渡轮的汽笛', en: 'the ferry\'s horn' },
      meanings: [
        { stage: 0, text: { zh: '小县城的早晨', en: 'a small town\'s morning' } },
        { stage: 2, text: { zh: '又一个第一天的信号', en: 'the signal of another first day' } },
      ] },
  ],

  setPieces: [
    {
      id: 'wn-sign', who: 'wanlan', kind: 'daily', motif: 'tide-log',
      title: { zh: '访客页', en: 'The Visitors\' Page' },
      trigger: { beat: 'loop-sign' },
      staging: { zh: '灯塔一层，海风从门缝灌进来，簿子的纸页扑扑响。她站在「我」身后看着「我」签名。这一幕第 1 轮和以后每一轮都会发生：后来的轮次里她看「我」签名的眼神更久。', en: 'The lighthouse ground floor, sea wind through the door, the ledger pages fluttering. She stands behind me watching me sign. This happens every loop; in later loops she watches longer.' },
      lines: [
        { who: 'narration', text: { zh: '签名的墨还没干，她用指尖碰了一下那一行字。', en: 'The ink of my name is still wet; she touches the line with a fingertip.' } },
        { who: 'wanlan', text: { zh: '签名的人。', en: 'The one who signed.' } },
        { who: 'me', text: { zh: '……要登记别的吗？', en: '...Do I need to fill in anything else?' } },
        { who: 'wanlan', text: { zh: '不用。今天的潮来得早，你也是。', en: 'No. The tide came early today. So did you.' } },
        { who: 'wanlan', text: { zh: '下次来，记得把日期也写上。', en: 'Next time, write the date too.' } },
      ],
    },
    {
      id: 'wn-log', who: 'wanlan', kind: 'reveal', motif: 'tide-log',
      title: { zh: '空着的一行', en: 'The Empty Line' },
      trigger: { beat: 'loop-log' },
      staging: { zh: '台风前夜的灯室，老灯在头顶转，光每隔几秒扫过她的脸。她翻到潮信簿最后一页。窗外的风声越来越大，两人说话越来越轻。', en: 'The lamp room on the eve of the typhoon; the old lamp turns overhead, sweeping her face every few seconds. She opens the log to its last page. The wind grows louder; their voices grow quieter.' },
      lines: [
        { who: 'narration', text: { zh: '四十年的字迹到这一页停了，下面空着一行。', en: 'Forty years of handwriting stops on this page. One line is left blank.' } },
        { who: 'wanlan', text: { zh: '爷爷的字。这一行，是留给我的。', en: 'Grandpa\'s writing. This line was left for me.' } },
        { who: 'me', text: { zh: '你为什么不写？', en: 'Why haven\'t you written it?' } },
        { who: 'wanlan', text: { zh: '写了，灯就熄了。这一周……就过去了。', en: 'If I write it, the lamp goes out. And this week... is over.' } },
        { who: 'wanlan', text: { zh: '我过了很多遍。你是第一个，和我一起记得的人。', en: 'I\'ve lived it many times. You\'re the first one who remembers with me.' } },
      ],
      unsaid: { zh: '她舍不得的不是灯，是爷爷。', en: 'It isn\'t the lamp she can\'t let go of; it\'s her grandfather.' },
    },
    {
      id: 'yt-slip', who: 'yetang', kind: 'daily', motif: 'song-slip',
      title: { zh: '夜潮点歌台', en: 'Night Tide Requests' },
      trigger: { beat: 'loop-slip' },
      staging: { zh: '夜里的广播站，红灯亮着。她用播音腔念点歌条，念到署名栏停了一下。歌放起来、红灯一灭，她马上换回平常的声音。', en: 'The radio station at night, ON AIR lit. She reads the request in her announcer voice and pauses at the signature line. The moment the song starts and the lamp goes off, she drops back into her normal voice.' },
      lines: [
        { who: 'yetang', text: { zh: '各位听众朋友，今晚的点歌条——还是那一首。', en: 'Dear listeners, tonight\'s request is... that same song again.' } },
        { who: 'narration', text: { zh: '署名那一栏没有名字，只画着一道小小的浪。', en: 'There\'s no name on the signature line, only a tiny drawn wave.' } },
        { who: 'yetang', text: { zh: '点歌的朋友什么也没写。好，我们听歌。', en: 'Our listener wrote nothing else. Okay. Let\'s hear it.' } },
        { who: 'yetang', text: { zh: '外地仔，你说，一首歌天天点，是想让谁听见？', en: 'Out-of-towner, tell me. Request one song every single night, who are you hoping will hear it?' } },
      ],
    },
    {
      id: 'yt-letter', who: 'yetang', kind: 'reveal', motif: 'herbal-jelly',
      title: { zh: '放回原处', en: 'Back Where It Was' },
      trigger: { beat: 'loop-letter' },
      staging: { zh: '凉茶铺，铜壶冒着气，收音机开着。录取信从柜台底下滑出来，落在阿嬷脚边。阿嬷先说话，说的是别的事。全程没有人提那封信。', en: 'The tea stall, steam from the brass urns, the radio on. The admission letter slides from under the counter and lands at Ah-Ma\'s feet. Ah-Ma speaks first, about something else. Nobody mentions the letter at all.' },
      lines: [
        { who: 'narration', text: { zh: '信从柜台底下滑出来，落在阿嬷脚边。', en: 'The letter slides out from under the counter and lands at Ah-Ma\'s feet.' } },
        { who: 'amah', text: { zh: '……地上凉，信会潮。', en: '...The floor\'s damp. Paper goes soft.' } },
        { who: 'narration', text: { zh: '阿嬷弯腰捡起来，拍了拍灰，放回柜台底下原来的位置。', en: 'Ah-Ma bends, picks it up, brushes it off and puts it back under the counter where it was.' } },
        { who: 'yetang', text: { zh: '阿嬷——', en: 'Ah-Ma—' } },
        { who: 'amah', text: { zh: '龟苓膏凉好了，给外地仔端一碗。', en: 'The jelly has set. Bring the out-of-towner a bowl.' } },
      ],
      unsaid: { zh: '「去吧」', en: '"Go."' },
    },
    {
      id: 'cd-net', who: 'chendu', kind: 'daily', motif: 'net',
      title: { zh: '扯住这头', en: 'Hold This End' },
      trigger: { beat: 'loop-net' },
      staging: { zh: '码头，柴油味，渔网摊在水泥地上。她手里的梭子穿得飞快，说话不抬头。说漏嘴之后她让「我」把网扯紧，好像那样就能把话收回去。', en: 'The dock, diesel fumes, a net spread on concrete. Her shuttle flies; she talks without looking up. After she lets it slip she tells me to pull the net tighter, as if that could take the words back.' },
      lines: [
        { who: 'chendu', text: { zh: '读书人，手别闲着，帮我扯住这头。', en: 'Bookworm, don\'t just stand there. Hold this end.' } },
        { who: 'narration', text: { zh: '网上的破洞一个一个合上，梭子在她指缝里来回。', en: 'One by one the holes close; the shuttle darts between her fingers.' } },
        { who: 'chendu', text: { zh: '这张网补完，阿爸就拿去一起卖。', en: 'Once this net\'s done, Dad\'s selling it along with the rest.' } },
        { who: 'me', text: { zh: '卖什么？', en: 'Selling what?' } },
        { who: 'chendu', text: { zh: '船。……你当我没说。扯紧点。', en: 'The boat. ...Forget I said that. Pull it tighter.' } },
      ],
    },
    {
      id: 'cd-boat', who: 'chendu', kind: 'climax', motif: 'boat-name',
      title: { zh: '等船回来', en: 'Waiting for the Boat' },
      trigger: { beat: 'loop-boat' },
      staging: { zh: '黄色预警的夜，码头的灯被雨打得发白，海上什么都看不见。她拿手电对着海一开一关。第 2 轮起，「我」可能早已让阿爸检修过机器；按改变后的样子写，但核心台词不变。', en: 'The night of the yellow warning; dock lights blanched by rain, nothing visible at sea. She flashes a torch at the water, on, off. From loop 2 I may already have had the engine checked; write the changed outcome, but keep the core lines.' },
      lines: [
        { who: 'chendu', text: { zh: '阿爸的船，平时这个点早回了。', en: 'Dad\'s boat is always back by now.' } },
        { who: 'chendu', text: { zh: '你别跟我说没事。你又不懂海。', en: 'Don\'t tell me it\'s fine. You don\'t know the sea.' } },
        { who: 'narration', text: { zh: '手电的光扎进雨里，开、关、开、关。', en: 'The torch beam stabs into the rain: on, off, on, off.' } },
        { who: 'chendu', text: { zh: '……读书人，你要是知道什么，现在就说。', en: '...Bookworm. If you know something, say it now.' } },
      ],
    },
    {
      // 第七夜：停在落笔之前。写不写、谁来写，交给结局
      id: 'wn-seventh', who: 'wanlan', kind: 'climax', motif: 'lamp',
      title: { zh: '再转一圈', en: 'One More Turn' },
      trigger: { beat: 'loop-seventh', minStage: 3 },
      staging: { zh: '台风登陆的夜，塔身在风里嗡嗡作响，老灯转过最后几圈。叶棠和阿渡也在塔里，守着收音机和应急灯，上下楼梯的脚步声时有时无。潮信簿摊在灯室的小桌上。她报时间，问一个问题，然后不让「我」马上回答。这一幕停在笔尖落下之前。', en: 'Landfall night; the tower hums in the wind; the old lamp turns its last few rounds. Ye Tang and Chen Du are in the tower too, minding the radio and the emergency lamp; footsteps come and go on the stairs. The tide log lies open on the lamp-room table. She gives the time, asks one question, and will not let me answer yet. The scene stops before the pen touches the page.' },
      lines: [
        { who: 'narration', text: { zh: '塔身在风里嗡嗡作响，老灯又转过一圈，光扫过潮信簿摊开的那一页。', en: 'The tower hums in the wind; the old lamp comes round again, its beam sweeping the open page of the tide log.' } },
        { who: 'wanlan', text: { zh: '九点四十分，风最大。在你签名之前，每一次，我都是一个人数到这里。', en: 'Nine-forty. The wind peaks now. Before you signed, every time, I counted to here alone.' } },
        { who: 'wanlan', text: { zh: '你帮我看看。今晚，跟我以前过的那些第七天，一样吗。', en: 'Look for me. Tonight, is it the same as the Day Sevens I lived before?' } },
        { who: 'narration', text: { zh: '她把笔拧开，笔尖悬在空着的那一行上面，没有落下去。', en: 'She uncaps the pen. The nib hangs over the blank line and does not come down.' } },
        { who: 'wanlan', text: { zh: '你先别回答。……等灯再转一圈。', en: 'Don\'t answer yet. ...Wait for the lamp to come round once more.' } },
      ],
      unsaid: { zh: '她写不写，谁握着笔。', en: 'Whether she writes it, and whose hand is on the pen.' },
    },
    {
      id: 'yt-market', who: 'yetang', kind: 'daily', motif: 'song-slip',
      title: { zh: '现场版', en: 'Live Edition' },
      trigger: { beat: 'loop-market' },
      staging: { zh: '台风前最后一个夜市，柱廊挂满灯泡。叶棠站在糖水摊的板凳上，拿着点歌条当众念，播音腔对着一条街。晚澜就在人群里。阿渡看见了，什么都不问。', en: 'The last night market before the storm, bulbs strung along the colonnade. Ye Tang stands on a sweet-soup stall\'s bench and reads a request slip to the whole street in her announcer voice. Wanlan is in the crowd. Chen Du sees everything and asks nothing.' },
      lines: [
        { who: 'yetang', text: { zh: '各位街坊！夜潮点歌台现场版——今晚的点歌条，又是这一首。', en: 'Neighbors! Night Tide Requests, live edition: tonight\'s slip asks for this same song again.' } },
        { who: 'narration', text: { zh: '晚澜手里那碗糖水一歪，绿豆沙洒了一地。', en: 'The bowl in Wanlan\'s hand tips; mung-bean soup spills across the ground.' } },
        { who: 'yetang', text: { zh: '署名还是一道小浪。点歌的朋友，你要是在场，举个手？', en: 'Signed with a little wave again. If our listener is here tonight, raise a hand?' } },
        { who: 'narration', text: { zh: '没有人举手。阿渡看了晚澜一眼，把自己那碗推了过去。', en: 'No hand goes up. Chen Du glances at Wanlan and slides her own bowl across.' } },
        { who: 'chendu', text: { zh: '吃我的。洒了就洒了。', en: 'Have mine. Spilled is spilled.' } },
        { who: 'yetang', text: { zh: '……好，那我们听歌。外地仔，帮我把收音机拧大点。', en: '...Okay, let\'s hear it. Out-of-towner, turn the radio up for me.' } },
      ],
      unsaid: { zh: '点歌条是谁写的。', en: 'Who writes the slips.' },
    },
    {
      id: 'yt-weather', who: 'yetang', kind: 'comedy', motif: 'on-air',
      title: { zh: '念得像台风', en: 'Read It Like a Typhoon' },
      trigger: { places: ['station'], slots: [2], minStage: 1, after: ['beat:loop-slip'] },
      staging: { zh: '夜里的广播站，歌还在放，红灯暗着。她把天气稿推给「我」，先排练一遍，自己坐在旁边挑刺。红灯一亮就不能出声，她就在桌子底下踢「我」的鞋。', en: 'The radio station at night; a song is still playing and the ON AIR lamp is dark. She pushes the weather script at me for a run-through and sits beside me picking holes. Once the lamp is lit she can\'t speak, so she kicks my shoe under the desk.' },
      lines: [
        { who: 'yetang', text: { zh: '外地仔，天气你来念。照稿子念，别加戏。', en: 'Out-of-towner, you read the weather. Stick to the script. No acting.' } },
        { who: 'me', text: { zh: '第十一号台风……正在向我县逼近……', en: 'Typhoon No. 11... is closing in on our county...' } },
        { who: 'yetang', text: { zh: '停。「逼近」要念得像逼近。你这念得像路过。', en: 'Stop. "Closing in" has to sound like it\'s closing in. You make it sound like it\'s passing by.' } },
        { who: 'narration', text: { zh: '歌放完了，红灯亮起来。她在桌子底下用脚尖踢了踢「我」的鞋，示意念下去。', en: 'The song ends and the lamp comes on. Under the desk she nudges my shoe with her toe: go.' } },
        { who: 'yetang', text: { zh: '（播音腔）以上是外地仔为您播报的天气。念得很烂，但是很准时。', en: '(Announcer voice) That was the weather, read by our out-of-towner. Badly, but on time.' } },
      ],
    },
    {
      id: 'cd-lights', who: 'chendu', kind: 'daily', motif: 'boat-name',
      title: { zh: '挂得低的那盏', en: 'The One Hung Low' },
      // 第 4、5 天夜里是固定事件，第 6 天起封港、海上没有渔火，所以只剩第 1 到 3 天的夜里
      trigger: { places: ['seawall'], days: [1, 3], minStage: 1 },
      staging: { zh: '夜里的海堤，两人坐着吃炒粉，远处渔火排成一线。她一盏一盏认是谁家的船，认到阿爸的那条就不说了。', en: 'The seawall at night; we eat fried noodles while boat lights string out along the horizon. She names each boat by its light, and goes quiet when she reaches her father\'s.' },
      lines: [
        { who: 'chendu', text: { zh: '炒粉，加蛋的给你。别谢，下回你掏钱。', en: 'Fried noodles. The one with egg is yours. Don\'t thank me. You\'re paying next time.' } },
        { who: 'narration', text: { zh: '海堤下的浪一下一下拍上来，远处的渔火排成一线。', en: 'Waves slap the foot of the seawall; far out, boat lights string along in a line.' } },
        { who: 'me', text: { zh: '你一眼就认得出哪盏是谁家的？', en: 'You can tell whose boat each light is?' } },
        { who: 'chendu', text: { zh: '灯挂的高低不一样。阿爸挂得低，他说挂高了招风。', en: 'They hang them at different heights. Dad hangs his low. Says a high lamp catches the wind.' } },
        { who: 'chendu', text: { zh: '读书人，你们学校教这个吗？……不教吧。', en: 'Bookworm, does your school teach that? ...Didn\'t think so.' } },
      ],
      unsaid: { zh: '她想接那条船。', en: 'That she wants that boat.' },
    },
    {
      id: 'wn-notch', who: 'wanlan', kind: 'daily', motif: 'tide-time',
      title: { zh: '三滴灯油', en: 'Three Drops of Oil' },
      // 「明天起风」只在台风登陆前说得通
      trigger: { places: ['lighthouse'], slots: [1], days: [1, 5], minStage: 1, after: ['beat:loop-sign'] },
      staging: { zh: '下午的灯室，她教「我」给老灯的转轴上油。铜扶手上有一道刻痕，她每次经过都摸一下。最后她说出明天起风的时刻，让「我」记着，像在出一道题。', en: 'The lamp room in the afternoon; she shows me how to oil the old lamp\'s spindle. There is a notch in the brass rail, and she touches it every time she passes. At the end she names the minute the wind will rise tomorrow and tells me to note it, like setting a test.' },
      lines: [
        { who: 'wanlan', text: { zh: '顺着转轴滴，三滴。多了会冒烟。', en: 'Along the spindle. Three drops. Any more and it smokes.' } },
        { who: 'narration', text: { zh: '铜扶手上有一道刻痕，她走过时用指尖碰了一下。', en: 'There is a notch in the brass rail; she brushes it with a fingertip as she passes.' } },
        { who: 'me', text: { zh: '这道痕是什么？', en: 'What\'s that mark?' } },
        { who: 'wanlan', text: { zh: '爷爷量我个子刻的。后来我长过它了，他就不刻了。', en: 'Grandpa marked my height there. When I grew past it, he stopped marking.' } },
        { who: 'wanlan', text: { zh: '明天下午四点零五分起风。你记一下，看我说得准不准。', en: 'Tomorrow the wind rises at 4:05 p.m. Write it down. See if I\'m right.' } },
      ],
      unsaid: { zh: '她为什么说得准。', en: 'Why she is always right.' },
    },
  ],

  routes: {
    commonUntil: 3,
    commonGoal: { zh: '共通线：台风还很远，三个人都要露面；每人露出一个「怪」——晚澜知道得太多，叶棠的点歌条，阿渡逃掉的补习班。', en: 'Common route: the typhoon is still far off; all three appear, each showing one oddity: Wanlan knows too much, Ye Tang\'s request slips, Chen Du\'s skipped classes.' },
    lock: { minStage: 2, minAffection: 6, margin: 2 },
    branches: [
      { who: 'wanlan', goal: { zh: '个人线·晚澜：灯塔、潮位、最后一行；循环的真相从她身上一点点露出来。', en: 'Wanlan route: the lighthouse, the tides, the last line; the truth of the loop surfaces through her.' }, others: { zh: '叶棠的节目照常，点歌条照常；阿渡一个人补网。', en: 'Ye Tang\'s show goes on, the slips keep coming; Chen Du mends nets alone.' } },
      { who: 'yetang', goal: { zh: '个人线·叶棠：广播站与凉茶铺之间，走还是留。', en: 'Ye Tang route: between the station and the tea stall, go or stay.' }, others: { zh: '匿名点歌条每晚照常来；晚澜在灯塔上一个人抄潮位。', en: 'The anonymous slip keeps coming every night; Wanlan copies the tides alone up at the lighthouse.' } },
      { who: 'chendu', goal: { zh: '个人线·阿渡：一条船、一个阿爸、一场台风；知道未来的人能改变什么。', en: 'Chen Du route: one boat, one father, one typhoon; what someone who knows the future can change.' }, others: { zh: '叶棠嘴上酸「外地仔改行打鱼了」，晚澜把潮位表多抄了一份给码头。', en: 'Ye Tang teases "the out-of-towner\'s turned fisherman"; Wanlan copies an extra tide table for the dock.' } },
    ],
    ensemble: { zh: '群像线：三个人的事在第七夜汇到一起，循环要靠大家一起才能走出去。', en: 'Ensemble route: all three threads converge on the seventh night; the loop can only be left together.' },
  },

  reveals: [
    {
      // 阶段 3：「我来之前已经点了很多轮」就是她的秘密（循环的真相）
      id: 'rv-slip-writer', when: { after: ['beat:loop-slip'], who: 'wanlan', minStage: 3 },
      truth: { zh: '每晚那张点歌条是晚澜写的，点给爷爷。她在「我」来之前已经点了很多轮。', en: 'The request slip every night is Wanlan\'s, for her grandfather. She was sending it for many loops before I came.' },
      reframes: [
        { zh: '叶棠念署名栏时那一下停顿', en: 'Ye Tang\'s pause at the signature line' },
        { zh: '晚澜第一次看「我」签名时那个像等了很久、又怕它来的表情', en: 'the look on Wanlan\'s face the first time she watched me sign, as if she had waited for it a long time and feared it' },
      ],
    },
    {
      id: 'rv-amah-knew', when: { after: ['beat:loop-letter'], who: 'yetang', minStage: 3 },
      truth: { zh: '阿嬷早就从邮递员那里知道了录取信，她多熬的每一锅凉茶都是在等孙女开口。', en: 'Ah-Ma knew about the letter from the postman long ago; every extra pot of tea was her waiting for her granddaughter to say it.' },
      reframes: [
        { zh: '阿嬷把信放回原处', en: 'Ah-Ma putting the letter back where it was' },
        { zh: '「凉茶苦口」那句老话', en: 'the old saying "herbal tea is bitter"' },
      ],
    },
    {
      id: 'rv-lunchbox', when: { after: ['beat:loop-net'], who: 'chendu', minStage: 3 },
      truth: { zh: '阿爸早就知道她天天逃补习班来码头。他每天在船舱里多放一个饭盒，嘴上说是给自己留的。他要卖船，一半是还债，一半是怕她真接了这条船，一辈子跟他一样看天吃饭。', en: 'Her father has known all along that she skips cram school for the harbor. Every day he leaves an extra lunchbox in the cabin and claims it is his spare. He is selling the boat half to clear the debt, half from fear that she really will take it over and spend her life at the mercy of the weather, like him.' },
      reframes: [
        { zh: '父女俩吵完又蹲在一起补网', en: 'how father and daughter squat down to mend nets after every fight' },
        { zh: '陈阿爸那句「这条船养不活两个人，她不懂」', en: 'Old Chen\'s "This boat can\'t feed two of us. She doesn\'t understand."' },
      ],
    },
  ],

  flashbacks: [
    { id: 'fb-grandpa', who: 'wanlan', trigger: { minStage: 2, motif: 'lamp' }, text: { zh: '小时候的灯室，爷爷握着她的手在簿子上写潮位，字歪歪扭扭，爷爷说「海认得」。', en: 'The lamp room in childhood: her grandfather guiding her hand to write the tide in the log, the letters crooked; "the sea can read it," he says.' } },
    { id: 'fb-first-sail', who: 'chendu', trigger: { minStage: 1 }, text: { zh: '七岁第一次跟船出海，她吐了一路，回港时却抢着去拉缆绳。', en: 'Her first time at sea, aged seven: seasick the whole way, then fighting to haul the mooring line on the way back.' } },
    { id: 'fb-knot', who: 'chendu', trigger: { minStage: 2 }, text: { zh: '小时候在灯塔底下，符伯教她打缆绳结，打错一回就拆了重来，一直拆到手指头起泡；晚澜坐在台阶上替她数。', en: 'As a child at the foot of the lighthouse, old Fu taught her rope knots: one mistake and she untied it and started over, until her fingers blistered, while Wanlan sat on the steps counting for her.' } },
    { id: 'fb-amah-radio', who: 'yetang', trigger: { minStage: 1, motif: 'on-air' }, text: { zh: '凉茶铺的旧收音机前，小时候的她对着铜壶学播音，阿嬷在旁边当唯一的听众。', en: 'In front of the tea stall\'s old radio, little Ye Tang practises announcing to a brass urn, Ah-Ma her only listener.' } },
  ],

  texture: {
    days: [
      { day: 1, weather: { zh: '晴，海面平，远处有一线云', en: 'clear, flat sea, a line of cloud far off' }, bits: [{ zh: '姑妈的杂货铺里卖蚊香和电池', en: 'Auntie\'s shop sells mosquito coils and batteries' }] },
      { day: 2, weather: { zh: '闷热，海鸥飞得低', en: 'muggy, gulls flying low' }, bits: [{ zh: '骑楼下的糖水店换了新的绿豆沙', en: 'the sweet-soup shop under the arcade has fresh mung-bean soup' }] },
      { day: 3, weather: { zh: '晚霞红得发紫', en: 'a sunset red to purple' }, bits: [{ zh: '渔港里有人在给船刷新漆', en: 'someone in the harbor repainting a hull' }] },
      { day: 4, weather: { zh: '风开始转向，夜市的灯泡晃', en: 'the wind turns; the night-market bulbs sway' }, bits: [{ zh: '夜市的炒粉摊多放了一把豆芽', en: 'the fried-noodle stall adds an extra handful of bean sprouts' }] },
      { day: 5, weather: { zh: '黄色预警，阵雨', en: 'yellow warning, squalls' }, bits: [{ zh: '家家门口堆起沙袋', en: 'sandbags piled at every door' }] },
      { day: 6, weather: { zh: '封港，海是灰的', en: 'harbor closed, the sea grey' }, bits: [{ zh: '玻璃窗贴上米字胶带', en: 'windows taped in crosses' }] },
      { day: 7, weather: { zh: '台风登陆，风雨', en: 'landfall, wind and rain' }, bits: [{ zh: '停电后全镇只剩灯塔亮着', en: 'after the power cut only the lighthouse is lit' }] },
    ],
    places: {
      harbor: [{ zh: '潮位尺上的青苔一格一格', en: 'moss stepped along the tide gauge' }],
      teashop: [{ zh: '收音机里的天气预报总比实际慢半天', en: 'the radio forecast always half a day behind' }],
      arcade: [{ zh: '修鞋摊的老伯边钉鞋边听粤剧', en: 'the cobbler hammers along to Cantonese opera' }],
      lighthouse: [{ zh: '螺旋楼梯一百零八级，每一级都被踩出了凹', en: 'a hundred and eight spiral steps, each worn hollow' }],
      seawall: [{ zh: '海堤上晒着鱼干，猫在偷', en: 'fish drying on the seawall, a cat stealing' }],
      tutoring: [{ zh: '吊扇转得太慢，试卷边角被汗洇软了', en: 'the ceiling fan turns too slowly; the corners of the test papers go soft with sweat' }],
      station: [{ zh: '点歌条用一个铁皮饼干盒装着，盒盖上贴着「夜潮」', en: 'the request slips kept in a tin biscuit box labelled "Night Tide"' }],
    },
    any: [{ zh: '渡轮的汽笛', en: 'the ferry horn' }, { zh: '每一轮，有些小事不一样：一只猫换了屋顶', en: 'each loop, some small thing differs: a cat on a different roof' }],
  },

  gags: [
    { id: 'aunt-questions', who: ['aunt'], text: { zh: '姑妈一口气问三句不等回答，「我」第二轮开始提前答完，姑妈吓得把蚊香掉了。', en: 'Auntie fires three questions without waiting; from loop 2 I answer them all in advance, and she drops the mosquito coil in fright.' } },
    { id: 'aunt-umbrella', who: ['aunt'], text: { zh: '每次去灯塔，姑妈都往「我」手里塞一把伞，「我」床底下已经攒了三把，没有一把是「我」的。', en: 'Every time I head for the lighthouse Auntie presses an umbrella on me; there are three under my bed now and none of them is mine.' } },
    { id: 'slip-guess', who: ['yetang'], text: { zh: '叶棠猜那张匿名点歌条是谁写的，越猜越离谱：修鞋摊的老伯、糖水店的猫、县长本人。', en: 'Ye Tang keeps guessing who writes the anonymous slip, each guess wilder than the last: the old cobbler, the sweet-soup shop\'s cat, the county head himself.' }, places: ['station'] },
    { id: 'engine-talk', who: ['chenba'], text: { zh: '陈阿爸骂那台老机器，骂完拍拍它，像拍一头老牛。', en: 'Old Chen curses the old engine, then pats it like an old ox.' }, places: ['harbor'] },
    { id: 'tea-bitter', who: ['amah', 'yetang'], text: { zh: '阿嬷说「凉茶苦口」，叶棠用播音腔接「良药利于病」，阿嬷说「讲反了」。', en: 'Ah-Ma says "tea is bitter"; Ye Tang adds, announcer-style, "and good for you"; Ah-Ma says "you\'ve got it backwards."' }, places: ['teashop'] },
  ],

  gossip: [
    { id: 'g-aunt', from: 'aunt', about: 'wanlan', truth: 'true', text: { zh: '「符伯走了以后，那妹仔天天上灯塔，一坐一下午。」', en: '"Since old Fu passed, that girl\'s up the lighthouse every day, all afternoon."' } },
    { id: 'g-amah', from: 'amah', about: 'yetang', truth: 'half', text: { zh: '「她最近念天气预报，念着念着就停了。」', en: '"Lately she stops halfway through the weather report."' } },
    { id: 'g-chenba', from: 'chenba', about: 'chendu', truth: 'true', fromDay: 3, text: { zh: '「她补的网比我补的密。……别跟她讲。」', en: '"Her nets are tighter than mine. ...Don\'t tell her."' } },
    { id: 'g-amah-chen', from: 'amah', about: 'chenba', truth: 'true', fromDay: 3, text: { zh: '「老陈年轻时每回出海前都来喝一碗，账我一笔没记。他现在要卖船，我也不记。」', en: '"Old Chen, back when he was young, drank a bowl here before every trip out, and I never wrote down a cent. Now he\'s selling the boat, and I won\'t write that down either."' } },
    { id: 'g-chen-wanlan', from: 'chenba', about: 'wanlan', truth: 'true', fromDay: 2, text: { zh: '「灯塔那妹仔抄的潮位表，比气象台还准。……邪门。」', en: '"That girl at the lighthouse copies tide tables more accurate than the weather bureau. ...Uncanny."' } },
    { id: 'g-me', from: 'aunt', about: 'me', truth: 'half', text: { zh: '「阿弟这礼拜怪怪的，一天往灯塔跑三趟，魂都丢在那上头了。」', en: '"The boy\'s been odd this week, up to the lighthouse three times a day, like he left his soul up there."' } },
  ],

  people: {
    wanlan: {
      quirks: [{ zh: '用潮汐和天气说事', en: 'speaks in tides and weather' }, { zh: '「你上次不是这么说的」（第 2 轮起）', en: '"That\'s not what you said last time" (from cycle 2)' }],
      habits: [{ zh: '报时间精确到分钟', en: 'states times to the minute' }, { zh: '摸灯塔扶手上的一道刻痕', en: 'touches a notch on the lighthouse rail' }],
      contradiction: { zh: '最想让这一周结束，又最怕它结束', en: 'wants the week to end, dreads that it will' },
      growth: { zh: '从一个人重复，到愿意写下最后一行', en: 'from repeating alone to being willing to write the last line' },
      diaryVoice: {
        style: { zh: '和潮信簿一样的格式：时刻、潮高、风向，最后一句才是她自己的话', en: 'in the tide log\'s format: time, height, wind; only the last sentence is her own' },
        hides: { zh: '她已经过了多少轮；她累了', en: 'how many loops she has lived; that she is tired' },
        seesMe: [
          { zh: '签名的人（第一个）', en: 'the one who signed (the first)' },
          { zh: '陪我抄潮位的人', en: 'the one who copies tides with me' },
          { zh: '他也会记得吗', en: 'will he remember too' },
          { zh: '和我一起记得的人', en: 'the one who remembers with me' },
          { zh: '第八天', en: 'Day Eight' },
        ],
      },
      dejaVu: [{ zh: '「你又来了。……这次，记得把日期写上。」', en: '"You\'re here again. ...This time, write the date."' }, { zh: '「今天的潮比上一次早了一分钟。是你改的吗？」', en: '"The tide came a minute earlier than last time. Was that you?"' }],
      awayVoice: [{ zh: '「今天满潮三点十二分。你不在。」', en: '"High tide at 3:12 today. You weren\'t here."' }],
    },
    yetang: {
      quirks: [{ zh: '「各位听众朋友」', en: '"Dear listeners"' }, { zh: '「外地仔」', en: '"Out-of-towner"' }],
      habits: [{ zh: '被说中就转去倒凉茶', en: 'turns to pour tea when you hit a nerve' }],
      contradiction: { zh: '整个县城都听她说话，她自己的事一句都说不出口', en: 'the whole county listens to her; she can\'t say a word about herself' },
      growth: { zh: '从替阿嬷守着，到相信阿嬷也想让她走', en: 'from guarding Ah-Ma to believing Ah-Ma wants her to go' },
      diaryVoice: {
        style: { zh: '节目串词稿：开场白、插播、结束语，真心话写在「备用稿」一栏', en: 'a show script: opening, bulletins, sign-off; the honest bits go in the "backup copy" column' },
        hides: { zh: '录取信；她其实很想去', en: 'the letter; that she really wants to go' },
        seesMe: [
          { zh: '白喝凉茶的外地仔', en: 'the out-of-towner drinking free tea' },
          { zh: '帮我念天气的人', en: 'the one who reads the weather for me' },
          { zh: '他是不是偷听过我的节目', en: 'has he been eavesdropping on my show' },
          { zh: '红灯亮着时可以说真话的人', en: 'someone I can be honest with while the light is on' },
          { zh: '第八天的点歌', en: 'Day Eight\'s request' },
        ],
      },
      dejaVu: [{ zh: '「你怎么知道我要点这首歌？我还没说出口。」', en: '"How did you know I\'d pick this song? I hadn\'t said it."' }],
      awayVoice: [{ zh: '「各位听众朋友，插播一条寻人启事：外地仔。」', en: '"Dear listeners, a missing-person bulletin: one out-of-towner."' }],
    },
    chendu: {
      quirks: [{ zh: '「读书人」', en: '"Bookworm"' }, { zh: '渔港俚语', en: 'harbor slang' }],
      habits: [{ zh: '说两句就动手干活', en: 'starts working after two sentences' }, { zh: '不会安慰人，只会递东西', en: 'can\'t comfort, only hands you things' }],
      contradiction: { zh: '逃补习班，却比谁都怕让阿爸失望', en: 'skips cram school, yet fears disappointing her father more than anything' },
      growth: { zh: '从「你当我没说」到当面说「我想要这条船」', en: 'from "forget I said that" to saying "I want this boat" to his face' },
      diaryVoice: {
        style: { zh: '写在补习班作业本背面：鱼价、风向、一句骂人的话', en: 'on the back of cram-school homework: fish prices, wind, one curse' },
        hides: { zh: '她想接船', en: 'that she wants the boat' },
        seesMe: [
          { zh: '看热闹的外人', en: 'a gawking outsider' },
          { zh: '扯网还行的读书人', en: 'a bookworm who can hold a net' },
          { zh: '他到底是什么人', en: 'who is he, really' },
          { zh: '知道阿爸船会晚的人', en: 'the one who knew Dad\'s boat would be late' },
          { zh: '一起出海的人', en: 'someone to go to sea with' },
        ],
      },
      dejaVu: [{ zh: '「……你怎么知道阿爸的船会晚？你又不看海。」', en: '"...How did you know Dad\'s boat would be late? You don\'t watch the sea."' }],
      awayVoice: [{ zh: '「网补完了。没人扯那头。」', en: '"Net\'s mended. Nobody held the other end."' }],
    },
    aunt: { quirks: [{ zh: '「哎哟」「阿弟」', en: '"Aiyo", "little brother"' }], habits: [{ zh: '往人手里塞东西', en: 'presses things into your hands' }] },
    chenba: { quirks: [{ zh: '只说风向和鱼价', en: 'only talks wind and fish prices' }], contradiction: { zh: '对女儿凶，转过身就叹气', en: 'gruff with his daughter, sighs when she turns away' } },
    amah: { quirks: [{ zh: '「凉茶苦口」', en: '"Herbal tea is bitter"' }], habits: [{ zh: '多熬一锅', en: 'always brews one pot extra' }] },
  },
}
