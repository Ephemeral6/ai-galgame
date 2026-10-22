// 改编剧本包《通往 eQualia 的桥》：改编自 Blackle Mori 的 Bridge to eQualia（CC0 1.0）。
// 原作是一部无选项的线性动态小说（约 1.4 万词）。本包只取人物、世界观、关键情节与语言气质；
// 日程、地点、分支、约定、结局、图书管理员一角与全部像素形象为改编新增，台词大部分为我们新写。
// 原作者未参与、未背书本改编。原作美术、音乐、字体一概未使用。

import type { Pack } from '../../types'

export const EQUALIA: Pack = {
  id: 'equalia',
  version: '1.0.0',
  defaultLang: 'en',
  langs: ['en', 'zh'],
  author: 'ai-galgame contributors',
  source: {
    work: { en: 'Bridge to eQualia', zh: 'Bridge to eQualia（通往 eQualia 的桥）' },
    author: { en: 'Blackle Mori (blackle)', zh: 'Blackle Mori（blackle）' },
    license: { en: 'CC0 1.0', zh: 'CC0 1.0' },
    adaptation: {
      en: 'Adapted from a linear kinetic novel with no choices. Kept: the characters (Maggie, 7crows, wood, Princess Dahlia / kewpie_faygo), the setting (a razed text MUSH, Second Life, a griefers\' Minecraft server, EBBB) and the main beats of the mystery. Added by the adapters: a seven-day schedule with places and time slots, branching scenes written live by AI, promises with deadlines, a trust system with five stages, nine endings, an original character (the special-collections librarian), and new block-pixel animal/abstract sprites. Most dialogue is newly written; a few original lines are quoted as voice samples. No original art, music or fonts are used. Not endorsed by the original author.',
      zh: '原作是无选项的线性动态小说。保留：人物（玛姬、七鸦、木头、达莉娅公主 / kewpie_faygo）、世界观（被洗劫的文字 MUSH、Second Life、恶意破坏者的 Minecraft 服务器、EBBB）与谜案主线。改编新增：七天日程、地点与时段、由 AI 实时书写的分支场景、有期限的约定、五阶段信任系统、九个结局、一个原创角色（特藏室图书管理员），以及新的方块像素小动物/抽象形象。台词大部分为新写，少量原句作为语气示例引用。未使用原作任何美术、音乐、字体。原作者未为本改编背书。',
    },
    url: 'https://blackle.itch.io/bteq',
    notice: {
      en: 'Based on Bridge to eQualia by Blackle Mori (CC0)',
      zh: '改编自 Blackle Mori 的 Bridge to eQualia（CC0）',
    },
  },
  features: { fourthWall: true },
  title: { en: 'Bridge to eQualia', zh: '通往 eQualia 的桥' },
  subtitle: {
    en: 'An internet sleuth, a razed fantasy kingdom, and nine people who blinked out of existence',
    zh: '一个网络侦探、一座被洗劫的幻想王国，和九个凭空消失的人',
  },
  premise: {
    en: `The first-person narrator ("I") is Maggie: a freelance security researcher who pays rent with bug bounties and spends the rest of her time solving online mysteries nobody asked her to solve. She lives alone in a scrubbed-clean room with a minifridge of "safe" bottled water and meal-replacement drinks, sleeps at strange hours, and in every virtual world wears the same commissioned avatar: a girl with rabbit ears pressed down by a hat, sweatshirt sleeves far too long. She keeps a "cases" folder and a notes.txt per case. Her rules: "This ain't Rapture" (it is happening now, not an archive); "Nosiness pays"; "Process: gather knowledge, infer what's missing, extrapolate, make it make sense."
A month ago, at a Second Life rave, a dragon girl named kewpie_faygo gave her a visitor's pass to a text MUSH called eQualia. Maggie forgot. On Day 1 she finally connected and found the kingdom razed: descriptions replaced by keysmash, NPCs scrambled, doors deleted, and behind the throne a tapestry reading "eebeebeebee crew was here". kewpie's accounts have been deleted on seven websites; her last post was six days ago; all eight other "citizens" of eQualia are missing too. Only one citizen remains reachable: 7crows, a flock-of-crows avatar who resigned its citizenship weeks before.
The story runs seven days. Over them Maggie can learn (in roughly this order, never all at once): that kewpie was really eQualia's only moderator, "Princess Dahlia"; that the citizens held a "sovereignty party" six days before Day 1; that "EBBB" is a closed vandal group, which a griefer called wood knows from a teenage "mission" burning a woven "bridge" of nine arches in the woods; that EBBB stands for "Einsatzgruppe zur Begrenzung von Brücken und Bruchstellen", a German offline anti-fantasy group whose tracts survive only on microfilm; that 7crows itself called EBBB in and handed them moderator accounts; and finally, that Dahlia may have left a letter in an unlisted, featureless test room only royalty knew about. The eQualia server is running on leftover credit and will go dark at the end of Day 7.`,
    zh: `第一人称「我」是玛姬：靠漏洞赏金付房租的自由安全研究员，剩下的时间都在破解没人请她破解的网络谜案。她独自住在一间擦得一尘不染的房间里，小冰箱里放着「安全」的瓶装水和代餐饮料，作息颠倒；在每个虚拟世界里都用同一个定制形象：兔耳朵被帽子压着、卫衣袖子长得过分的女孩。她有一个 cases 文件夹，每个案子一个 notes.txt。她的规矩：「这里不是销魂城」（事情正在发生，不是档案）；「好管闲事有好处」；「流程：收集、推断缺失、外推、让它说得通。」
一个月前，在 Second Life 的一场电音派对上，一个叫 kewpie_faygo 的龙女孩给了她一张文字 MUSH「eQualia」的访客通行证。玛姬忘了。第 1 天她终于连上去，看到的是一个被洗劫的王国：描述被换成乱敲的键盘字符，NPC 被打乱，门被删除，王座后的挂毯上写着「eebeebeebee crew was here」。kewpie 在七个网站上的账号全被删除，最后一条帖子是六天前；eQualia 的另外八位「公民」也都失踪了。唯一还联系得上的公民是七鸦——一个由一群乌鸦组成的形象，几周前它主动放弃了公民身份。
故事共七天。玛姬可以逐步得知（大致按这个顺序，不要一次全揭开）：kewpie 其实是 eQualia 唯一的管理员「达莉娅公主」；公民们在第 1 天前六天办过一场「主权派对」；「EBBB」是一个封闭的破坏者团体，一个叫木头的恶意破坏者在少年时为他们执行过「任务」——烧掉林中九道树枝编成的拱门，那座「桥」；EBBB 是德语「Einsatzgruppe zur Begrenzung von Brücken und Bruchstellen」（限制桥梁与裂隙特别行动组）的缩写，一个线下的反幻想团体，它的小册子只存在于缩微胶卷里；七鸦本人把 EBBB 叫进了 eQualia，并给了他们管理员账号；最后，达莉娅也许在一个只有王室知道、不对外连通的空白测试房间里留下了一封信。eQualia 的服务器靠剩余额度运行，第 7 天结束时就会熄灭。`,
  },
  style: {
    en: `Style: hard-boiled internet noir in Maggie's clipped first person. Short declarative sentences, sentence fragments, deadpan self-deprecation, precise technical detail (APIs, deleted-account flags, IP ranges, MUSH rooms as graph nodes) used as texture, never as lecture. She repeats her mantras ("Not my first case." "Nosiness pays." "Process, Maggie, process.") and names her own "failure modes" when she slips into them. She notices how people perform body language through avatars: poseballs, typing indicators flickering on and off, a cursor shaken in frustration.
Online characters type in their own registers: 7crows in lowercase, guarded, present tense; wood in lowercase slang with typos; Dahlia with tildes and emoticons (~ ^w^ >.>). Render chat as quoted typed lines. Maggie speaks in full, dry sentences.
"Affection" in this pack means trust and closeness, not romance. Do not write romance. The endings are about relationships and truth.
Unreality: Maggie is a "threshold person" who needs fantasy to survive but cannot go all the way. When coincidences pile up (waking at exactly the right moment, a typed touch that is felt), she feels the "flowers of unreality" bloom and pushes them away ("Not today."). Never confirm or deny that eQualia became real. Keep both readings open to the very end.
Fourth wall: the engine may report that the player rewound or reloaded. Treat it as déjà vu that Maggie notices and distrusts: lines she has "already read", a scene that feels like a re-run of a teleplay. She may address the reader dryly, as she sometimes does ("If I've given the wrong impression..."), but never break into game-UI language.
Content: the original carries warnings (unreality, drugs, alcohol, death, missing people, ableism, claustrophobia). Handle them with restraint; no gore, no graphic vomit. Do not reproduce slurs; if a griefer throws one, say only that he did and Maggie took it wordlessly. EBBB are fascistic anti-fantasy vandals: show them as small, cringe and dangerous, never cool. No cops, no courtroom: Maggie has no authority and knows it.`,
    zh: `文风：玛姬冷硬的第一人称网络黑色小说腔调。短句、断句、面无表情的自嘲；技术细节（API、被删除账号的标志位、IP 段、作为图节点的 MUSH 房间）只当质感，不当讲解。她会反复念叨自己的口头禅（「不是我第一个案子。」「好管闲事有好处。」「流程，玛姬，流程。」），掉进自己的「故障模式」时会点名说出来。她会注意别人如何用虚拟形象表演肢体语言：姿势球、忽明忽灭的「正在输入」、因为烦躁而抖动的光标。
网上的角色各有打字腔调：七鸦全小写、戒备、用现在时说旧事；木头满是俚语和错字；达莉娅爱用波浪号和颜文字（~ ^w^ >.>）。聊天内容按打出来的字引用。玛姬说话完整、干巴巴。
本包的「好感」指信任与亲近，不是恋爱，不要写恋爱。结局关于关系与真相。
不真实感：玛姬是「门槛上的人」，靠幻想活着却走不到底。当巧合堆积（恰好在对的时刻醒来、一句打出来的抚摸被真的感觉到），她会感到「不真实的花」开起来，然后把它推开（「今天不行。」）。永远不要确认或否认 eQualia 变成了真的，两种解读都留到最后。
第四面墙：引擎可能告诉你玩家回退或读档了。把它写成玛姬察觉并且不信任的既视感：「已经读过」的台词，像重播的电视剧。她可以偶尔干巴巴地对读者说话（原作里她也会这样），但不要说出游戏界面的词。
内容：原作带有内容提示（不真实感、药物、酒精、死亡、失踪、能力歧视、幽闭）。克制处理；不写血腥，不写具体的呕吐。不复述歧视性脏话；如果破坏者骂了，只写他骂了、玛姬一声不吭地受着。EBBB 是法西斯式的反幻想破坏者：写得渺小、尴尬而危险，绝不写得帅。没有警察、没有法庭：玛姬没有任何权力，她自己也知道。`,
  },
  me: { en: 'Maggie', zh: '玛姬' },
  days: 7,
  slots: [{ en: 'Daylight', zh: '白天' }, { en: 'Evening', zh: '傍晚' }, { en: 'Small hours', zh: '深夜' }],
  dayLabel: { en: 'Day {n}', zh: '第 {n} 天' },
  chapters: [
    { from: 1, title: { en: 'I · Trailhead', zh: '一 · 起点' } },
    { from: 3, title: { en: 'II · Off the Internet', zh: '二 · 离开互联网' } },
    { from: 5, title: { en: 'III · The Eschatology of Bridges', zh: '三 · 桥的末世论' } },
    { from: 7, title: { en: 'IV · Featureless Room', zh: '四 · 空白房间' } },
  ],
  places: [
    { id: 'room', name: { en: 'My Room', zh: '我的房间' }, mood: { en: 'detergent-and-isopropyl clean, a hostile IKEA chair, notes.txt glowing on the second screen', zh: '洗涤剂和异丙醇的干净气味，一把反人类的宜家椅子，副屏上亮着 notes.txt' }, slots: [0, 1, 2] },
    { id: 'square', name: { en: 'eQualia: Ruined Square', zh: 'eQualia：废墟广场' }, mood: { en: 'white-on-black text, keysmash where descriptions were, NPCs walking in circles', zh: '黑底白字，描述被换成乱码，NPC 原地兜圈' }, slots: [0, 1, 2] },
    { id: 'throne', name: { en: 'eQualia: Throne Room', zh: 'eQualia：王座厅' }, mood: { en: 'an empty archway, a deleted door, one tapestry still hanging', zh: '空荡的拱门、被删掉的门、唯一还挂着的挂毯' }, slots: [2] },
    { id: 'upside', name: { en: 'SL: Upside-down Sim', zh: 'SL：倒置模拟区' }, mood: { en: 'skyscrapers hanging like stalactites, a glass-cube apartment, an empty ferris wheel turning in the sky below', zh: '摩天楼像钟乳石一样倒挂，玻璃立方体公寓，下方天空里一座空摩天轮慢慢转' }, slots: [1, 2] },
    { id: 'gardens', name: { en: 'SL: Hanging Gardens', zh: 'SL：空中花园' }, mood: { en: 'billboarded flowers, a digital Babylon after the rave has ended', zh: '贴图花朵，派对散场后的数字巴比伦' }, slots: [1, 2] },
    { id: 'jail', name: { en: 'Guild Server: Jail Cell', zh: '公会服务器：牢房' }, mood: { en: 'iron bars, a bed placed for respawning, bots still dying in the bedrock maze', zh: '铁栏、为重生而放的床，机器人还在基岩迷宫里一个个死去' }, slots: [1, 2] },
    { id: 'library', name: { en: 'Special Collections', zh: '大学特藏室' }, mood: { en: 'quiet, microfilm booths, the old Fujifilm logo on cardboard boxes, an N95 that almost keeps the smells out', zh: '安静，缩微胶卷阅读机，纸盒上的旧富士胶片标志，几乎挡住所有气味的 N95' }, slots: [0, 1] },
    { id: 'bus', name: { en: 'City Bus', zh: '进城的公交' }, mood: { en: 'diesel, strangers, eyes closed, counting polygons to survive the ride', zh: '柴油味、陌生人，闭上眼数多边形熬过这一路' }, slots: [0] },
    { id: 'dream', name: { en: 'The Teleplay Dream', zh: '重播的梦' }, mood: { en: 'a kitchen table, a report card, the neighbour\'s curtains across the gap between houses', zh: '厨房餐桌、成绩单，房子间隙对面邻居家的窗帘' }, slots: [2] },
  ],
  cast: [
    {
      id: 'crows', name: { en: '7crows', zh: '七鸦' }, short: { en: '7crows', zh: '七鸦' }, color: '#5c6bc0',
      look: { en: 'a flock of small black block-pixel crows huddled around one larger crow; later only six', zh: '一群黑色方块像素小乌鸦簇拥着一只大一点的乌鸦；后来只剩六只' },
      voice: {
        en: 'Types in lowercase, short and guarded; long pauses, the typing indicator flickering on and off. Talks about past problems in present tense. Refers to itself as "it" and sometimes as the flock. Communicates mood through poseball animations (leaning over a ledge, huddling, murmuration). Calls Maggie "maggie" or "sleuth".',
        zh: '全小写、短句、戒备；长时间停顿，「正在输入」忽明忽灭。用现在时说过去的问题。自称「它」，有时以群体自称。用姿势球动画表达情绪（俯身探出阳台、挤成一团、群飞）。叫玛姬「maggie」或「侦探」。',
      },
      samples: [
        { en: 'it was too real. fantasy is too compelling. it makes me make bad decisions.', zh: '太真了。幻想太有说服力。它让我做出坏决定。' },
        { en: 'sorta. updated it, slightly.', zh: '算是吧。稍微更新了一下。' },
        { en: 'you keep asking where they went. ask me where i went.', zh: '你一直问他们去哪了。问问我去哪了。' },
        { en: 'six of us agree. the seventh doesn\'t get a vote anymore.', zh: '我们六个都同意。第七个已经没有投票权了。' },
      ],
      secret: {
        en: 'It was Dahlia\'s closest friend and her Attendant to the Crown ("The Seventh Crow, It-who-paints-the-sky"). After it felt her typed head-pat as a real touch, the other six crows staged a mutiny against that part of itself. Radicalized by EBBB tracts it found locally, it got moderator status from Dahlia days before the sovereignty party, gave mod accounts to EBBB, and froze its friends in place while the vandals razed the world. It believes, or says it believes, that the party really opened a bridge and that Dahlia and The Seventh Crow are still "on the other side".',
        zh: '它是达莉娅最亲近的朋友，也是她的王冠侍从（「第七只乌鸦，描绘天空者」）。在它把达莉娅打出来的一句「摸摸头」真切地感觉到之后，另外六只乌鸦对自己的那一部分发动了「兵变」。它在本地接触到 EBBB 的小册子而被激进化，在主权派对前几天从达莉娅那里拿到管理员权限，把管理员账号交给 EBBB，并在破坏者洗劫世界时冻结了所有朋友。它相信（或声称相信）派对真的打开了一座桥，达莉娅和第七只乌鸦仍在「另一边」。',
      },
      arc: [
        { en: 'Witness: the last reachable citizen; worried, helpful, careful. Shares that kewpie\'s phone number is dead. Quits-for-personal-reasons, it says.', zh: '证人：最后一个联系得上的公民；担心、肯帮忙、很谨慎。说 kewpie 的电话已停机，说自己是「因个人原因」退出的。' },
        { en: 'Old friend: tells Maggie who Princess Dahlia really was, recites her full title from memory, lets slip a phrase that sounds rehearsed.', zh: '老朋友：告诉玛姬达莉娅公主是谁，能一字不差地背出她的全名封号，说漏了一句听上去像背过的话。' },
        { en: 'Silence: stops answering when Maggie mentions EBBB; its avatar changes; one crow is missing.', zh: '沉默：玛姬一提 EBBB 它就不回了；它的形象变了，少了一只乌鸦。' },
        { en: 'Confession: "the only reason you know ebbb exists at all is because i called them." Tells its version of the sovereignty party.', zh: '坦白：「你知道 ebbb 存在，唯一的原因是我把他们叫来的。」讲出它版本的主权派对。' },
        { en: 'Choice: what Maggie gives back to it. The whole truth, an edited letter, or nothing. Whether the six can ever fly together again.', zh: '抉择：玛姬还给它什么——全部真相、删改过的信，还是什么都不给。六只乌鸦还能不能一起飞。' },
      ],
      haunts: { 1: ['upside', 'gardens'], 2: ['upside'] },
      deadline: { day: 6, text: { en: 'the day it plans to delete the last of its accounts and fly off', zh: '它打算删掉最后几个账号、飞走的那天' } },
      keepsakeIdeas: { en: 'a single black feather texture, a poseball, a screenshot of a murmuration', zh: '一张黑羽毛贴图、一个姿势球、一张群飞的截图' },
      sprite: {
        pal: { K: '#2f2f3d', k: '#4a4a5e', Y: '#e0a030' },
        art: [
          '.KK........KK.',
          'KKKY......YKKK',
          '....KKKKKK....',
          '...KKKKKKKK...',
          '...KKKKKKKK...',
          '...KKKYYKKK...',
          '..kKKKKKKKKk..',
          '.kkKKKKKKKKkk.',
          '..k.KKKKKK.k..',
          '.....Y..Y.....',
          '.KK........KK.',
          'KKKY......YKKK',
        ],
        eyes: [[4, 5], [4, 8]], cheeks: [[5, 4], [5, 9]], motion: 'wings',
      },
    },
    {
      id: 'wood', name: { en: 'normalblockofwood', zh: '普通木块（木头）' }, short: { en: 'wood', zh: '木头' }, color: '#b5834a',
      look: { en: 'a plain block-pixel cube of wood grain on two stubby legs, with a crossbow it never fires', zh: '一块木纹方块像素立方体，两条短腿，拿着一把从来没射过的弩' },
      voice: {
        en: 'Lowercase, typos, "lol", "dude", "jeez"; suspicious ("you a fed?"), then oddly eager to tell a long story with every detail. Parrots big ideas in malapropisms ("the epic of girugamesh"). Bristles, swears, backs down when overpowered. Calls Maggie "dude" or "maze guy".',
        zh: '全小写、错字、「lol」「哥们」「我去」；先是怀疑（「你是联邦探员？」），然后奇怪地热衷于把一个长故事每个细节都讲出来。转述大道理时用错词（「吉尔伽美户史诗」）。会炸毛、会骂人，被压制就退缩。叫玛姬「哥们」或「迷宫那家伙」。',
      },
      samples: [
        { en: 'who wants to know? you a fed?', zh: '谁想知道？你是联邦探员？' },
        { en: 'point taken jeez, I just need to know youre cool', zh: '行行行我懂了，我就想知道你靠不靠谱' },
        { en: 'look someone has to be the guy who burns the library of alexandria. thats just how it works. i think', zh: '听着总得有人当烧亚历山大图书馆的那个人吧。就是这么回事。大概' },
        { en: 'i still got the pics on my ipod. dont ask me why i kept them', zh: '照片还在我的ipod里。别问我为什么留着' },
      ],
      secret: {
        en: 'As a high-schooler (before he moved abroad) he and kloose took weed from an older guy in a tracksuit and black beanie in exchange for "missions". The first: pull up and burn nine woven arches standing in a line in a forest glade, which the guy called a "bridge". He still has the photos. Later missions: blacking out stickers, leaving dead animals on doorsteps. The guy talked about EBBB and the uselessness of fiction; wood still repeats those ideas without knowing they are not his. He cannot remember the German name; kloose can.',
        zh: '高中时（他移居国外之前）他和 kloose 从一个穿运动服、戴黑色毛线帽的年长家伙那里换大麻，代价是去完成「任务」。第一个任务：拔起林中空地上排成一列、用树枝编成的九道拱门并烧掉，那人管它叫「桥」。照片他还留着。之后的任务：涂黑贴纸、往别人门口放死动物。那人常讲 EBBB 和「虚构毫无用处」；木头至今还在复述这些观点，却不知道那不是他自己的话。他记不住那个德语全名，kloose 记得。',
      },
      arc: [
        { en: 'Jailer: meets "the bot with a thousand accounts" behind iron bars; crossbow raised; thinks Maggie is a fed.', zh: '狱卒：隔着铁栏见到「有一千个账号的机器人」，举着弩，以为玛姬是联邦探员。' },
        { en: 'Curious: wants the exploit; trades small talk about the guild; turns out to know less than he pretends.', zh: '好奇：想要那个漏洞；聊些公会的闲话；结果他知道的比装出来的少。' },
        { en: 'Rattled: Maggie\'s threat (or patience) makes him admit he knows the name EBBB from somewhere offline.', zh: '动摇：玛姬的威胁（或耐心）让他承认，EBBB 这个名字他是在线下听到的。' },
        { en: 'Confession: the woods, the tracksuit guy, the nine arches, the fire, the photos.', zh: '坦白：树林、运动服男人、九道拱门、那把火、那些照片。' },
        { en: 'Choice: whether he passes Maggie\'s email to kloose, hands over the photos, and admits the ideas he repeats were never his.', zh: '抉择：他会不会把玛姬的邮箱转给 kloose、交出照片，并承认他复述的那些想法从来不是他自己的。' },
      ],
      haunts: { 1: ['jail'], 2: ['jail'] },
      deadline: { day: 4, text: { en: 'the guild wipes the jail and bans the whole IP range', zh: '公会清空牢房、封掉整个 IP 段' } },
      keepsakeIdeas: { en: 'a golden apple tossed through the bars, a respawn bed, a blurry iPod photo of a bonfire', zh: '从铁栏间扔进来的金苹果、一张重生床、一张模糊的 iPod 篝火照片' },
      sprite: {
        pal: { T: '#c8a06a', t: '#a87d48', D: '#7a5530' },
        art: [
          '..DDDDDDDDDD..',
          '..TTTTtTTTTT..',
          '..TtTTTTTtTT..',
          '..TTTTTTTTTT..',
          '..TTTTTTTTTT..',
          '..tTTTTTTTTt..',
          '..TTTtttTTTT..',
          '..TTTTTTTtTT..',
          '..DDDDDDDDDD..',
          '...D......D...',
        ],
        eyes: [[4, 4], [4, 9]], cheeks: [[5, 3], [5, 10]], motion: 'bob',
      },
    },
    {
      id: 'dahlia', name: { en: 'Princess Dahlia (kewpie_faygo)', zh: '达莉娅公主（kewpie_faygo）' }, short: { en: 'Dahlia', zh: '达莉娅' }, color: '#c06bd6',
      look: { en: 'a small purple block-pixel dragon with a pink dahlia behind one horn and wings she keeps apologizing for', zh: '一只紫色方块像素小龙，一只角后面别着粉色大丽花，翅膀总是让她不停道歉' },
      voice: {
        en: 'Missing. She reaches Maggie only through traces: archived posts, one-sided replies, chat logs from the rave, room descriptions she wrote, dreams, and perhaps something stranger. In those traces she types soft and lowercase, apologizes for everything ("oop sowwie"), uses tildes and emoticons (~ ^w^ >.>), downplays her own role, and loves everyone a little too hard. In her own kingdom her prose is lush and careful. Calls Maggie "bunny" (from her avatar).',
        zh: '失踪。她只通过痕迹出现：存档帖子、只剩一方的回复、派对那晚的聊天记录、她写下的房间描述、梦，或许还有更奇怪的东西。在这些痕迹里她打字轻柔、全小写，什么都道歉（「哎呀对不起」），爱用波浪号和颜文字（~ ^w^ >.>），总是淡化自己的角色，爱每个人都爱得太用力。在她自己的王国里，她的文字华丽又细心。因为玛姬的形象，叫她「小兔」。',
      },
      samples: [
        { en: 'u can just call me Dahlia~ ^w^', zh: '叫我达莉娅就好啦~ ^w^' },
        { en: 'maybe even actully reach it… >.>', zh: '说不定真的能到那里…… >.>' },
        { en: 'oop sowwie, my wings again!! i promise they have a mind of their own', zh: '哎呀对不起，又是我的翅膀！！我发誓它们有自己的想法' },
        { en: 'if u ever find this, bunny, u were always invited. always always', zh: '小兔，如果你看到这个，你一直都是被邀请的。一直一直' },
      ],
      secret: {
        en: 'Three days after the sovereignty party, Dahlia left a letter in the featureless white test room that only royalty knew: "To my dear birds," an apology to 7crows for not seeing how much it was hurting, forgiveness for the razing, and at the bottom, after a drawn dahlia, an invitation to "the end of a new bridge", a glade where flowers of every colour grow tall. She is alive, or at least she wrote after the party; she changed her phone number out of fear. Whether she is "on the other side" is never settled.',
        zh: '主权派对三天后，达莉娅在只有王室知道的空白测试房间里留下了一封信：「致我亲爱的鸟儿们」——向七鸦道歉，说自己没看出它有多痛苦；原谅了这场洗劫；信末画着一朵大丽花，下面是一份邀请，去「一座新桥的尽头」，一片各色花朵长得高高的林间空地。她还活着，至少派对之后她还写过字；她因为害怕换了电话号码。她是不是在「另一边」，永远没有定论。',
      },
      arc: [
        { en: 'Echo: a deleted account, a remembered rave, a dragon who whispered apologies when her wings clipped through Maggie.', zh: '回声：一个被删除的账号，一场记得的派对，一只翅膀穿模时会悄悄道歉的龙。' },
        { en: 'Builder: her careful descriptions surface in the ruins; Maggie learns the "modest caretaker" was a benevolent Queen.', zh: '建造者：她细心写下的描述在废墟里露出来；玛姬得知那个「谦虚的管理员」其实是一位仁慈的女王。' },
        { en: 'Behind the curtains: she appears in Maggie\'s teleplay dream, unseen behind the neighbour\'s curtains. Maggie cannot call 911 for her.', zh: '窗帘后面：她出现在玛姬重播的梦里，藏在邻居家窗帘后看不见。玛姬没法为她打 911。' },
        { en: 'Hypothesis: Maggie reconstructs who Dahlia must be, a woman of endless forgiveness, and guesses where she would leave a message.', zh: '假设：玛姬重建出达莉娅必然是怎样的人——一个无限宽恕的女人，并猜到她会把留言放在哪里。' },
        { en: 'Choice: inside the featureless room, with the letter in hand and no way out, what to do with the invitation.', zh: '抉择：在空白房间里，信在手里、没有出口，那份邀请怎么处理。' },
      ],
      haunts: { 0: ['square'], 1: ['square', 'gardens'], 2: ['throne', 'dream'] },
      deadline: { day: 7, text: { en: 'the eQualia server runs out of credit and goes dark', zh: 'eQualia 服务器额度耗尽、彻底熄灭' } },
      keepsakeIdeas: { en: 'the visitor\'s pass, a screenshot from the rave, a strip of paper cut from a letter', zh: '访客通行证、派对那晚的截图、从信上剪下的一条纸' },
      sprite: {
        pal: { G: '#9c6bd6', g: '#6f45a8', P: '#ff6fa0', Y: '#ffe08a', p: '#ffd0e0' },
        art: [
          '..PPP....g....',
          '..PYP...gG....',
          '...PGGGGGG....',
          'g.GGGGGGGGG..g',
          'gg.GGGGGGGG.gg',
          'ggg.GGGGGG.ggg',
          'gggGGppppGGggg',
          '.ggGpppppGGgg.',
          '...GpppppGG...',
          '....GGGGGGGG..',
          '....G..G...GG.',
        ],
        eyes: [[4, 5], [4, 8]], cheeks: [[5, 4], [5, 9]], motion: 'tail',
      },
    },
    {
      id: 'librarian', name: { en: 'Rosalind (the librarian)', zh: '罗莎琳（图书管理员）' }, short: { en: 'Rosalind', zh: '罗莎琳' }, color: '#7f9a8c',
      look: { en: 'a grey block-pixel mole in a white mask, eyes creased in a smile you cannot see', zh: '一只戴白口罩的灰色方块像素鼹鼠，眼睛眯起来——那是你看不见的笑' },
      voice: {
        en: 'An original character added for this adaptation. Warm, unhurried, librarian-precise; handles film with bare fingers ("you\'ll only be touching the blank area"). Explains what she knows and admits what she doesn\'t. Fond of things that were never digitized. Calls Maggie "Ms. Maggie" until told not to.',
        zh: '本改编新增的原创角色。温和、不急不慢，图书馆员式的精确；徒手拿胶片（「你只会碰到空白的地方」）。知道的就讲清楚，不知道的就承认。偏爱那些从未被数字化的东西。一直叫玛姬「玛姬女士」，直到被要求别这么叫。',
      },
      samples: [
        { en: 'I\'m smiling. You can\'t see because of the mask.', zh: '我在笑。你看不见，因为戴着口罩。' },
        { en: 'Most of the world was never scanned, you know. It\'s still here. It just doesn\'t answer search queries.', zh: '世界的大部分从来没被扫描过，你知道吧。它还在，只是不回应搜索。' },
        { en: 'The reels go back overseas in two days. After that, you\'d need a plane ticket and a very patient archivist.', zh: '胶卷两天后寄回海外。之后你就得买机票，再找一个非常有耐心的档案员了。' },
      ],
      secret: {
        en: 'In the 1990s she was a dragon too: a regular on a text MUD under another name, until her friends drifted off and the server died. Since then she has written one long fantasy serial by hand, in notebooks she has never scanned and never will, for no reader but herself. She recognizes the EBBB tracts\' kind of contempt from people in her own life, and she knows the "dark matter cloud of culture that never goes online" from the inside.',
        zh: '九十年代她也是一条龙：用另一个名字常驻在一个文字 MUD 里，直到朋友们散去、服务器关停。从那以后她一直手写一部很长的奇幻连载，写在从未扫描、也永远不会扫描的笔记本里，读者只有她自己。她从身边人身上认得出 EBBB 小册子里的那种轻蔑，也从内部认识那片「永远不会上网的文化暗物质」。',
      },
      arc: [
        { en: 'Stranger: the special-collections librarian who answered Maggie\'s email; she squints, which turns out to be a smile.', zh: '陌生人：回复过玛姬邮件的特藏室管理员；她眯眼，原来是在笑。' },
        { en: 'Guide: teaches the microfilm reader, helps with the German tables of contents, lets Maggie stay after hours.', zh: '向导：教她用缩微胶卷阅读机，帮忙看德语目录，允许玛姬待到闭馆后。' },
        { en: 'Unease: reading the tracts over Maggie\'s shoulder, she goes quiet at the line about fiction making you make poor decisions.', zh: '不安：她从玛姬肩后看那些小册子，读到「虚构会让你做出糟糕的决定」那句时沉默了。' },
        { en: 'Notebooks: shows Maggie one unscanned notebook and tells her about the MUD she lost.', zh: '笔记本：给玛姬看一本没扫描的笔记本，讲起她失去的那个 MUD。' },
        { en: 'Choice: whether Maggie promises never to put any of it online, and whether two threshold people stay in touch offline.', zh: '抉择：玛姬是否答应永远不把这些放上网，两个门槛上的人是否在线下保持联系。' },
      ],
      haunts: { 0: ['library', 'bus'], 1: ['library'] },
      deadline: { day: 5, text: { en: 'the microfilm reels are shipped back overseas', zh: '缩微胶卷寄回海外' } },
      keepsakeIdeas: { en: 'a djvu file on a USB key, a tray of Fujifilm boxes, a page torn from a handwritten notebook', zh: 'U 盘里的一个 djvu 文件、一托盘富士胶片盒、从手写笔记本上撕下的一页' },
      sprite: {
        pal: { M: '#8a7f8e', m: '#6b6170', W: '#f2f2f2', w: '#c9c9c9' },
        art: [
          '...MMMMMMMM...',
          '..MMMMMMMMMM..',
          '.MMMMMMMMMMMM.',
          '.MMMMMMMMMMMM.',
          '.MWWWWWWWWWWM.',
          '.MWWWwwwWWWWM.',
          '.MMWWWWWWWWMM.',
          '..MMMMMMMMMM..',
          '.mMMMMMMMMMMm.',
          '.mm.mm..mm.mm.',
        ],
        eyes: [[3, 4], [3, 9]], cheeks: [[3, 2], [3, 11]], motion: 'bob',
      },
    },
  ],
  stages: [
    { en: 'Stranger', zh: '陌生' }, { en: 'Contact', zh: '接触' }, { en: 'Doubt', zh: '疑点' }, { en: 'Truth', zh: '真相' }, { en: 'Choice', zh: '抉择' },
  ],
  gates: [
    { affection: 0, scenes: 0 },
    { affection: 3, scenes: 1 },
    { affection: 5, scenes: 2 },
    { affection: 8, scenes: 3 },
    { affection: 11, scenes: 4 },
  ],
  events: [
    { day: 1, text: { en: 'eQualia found razed; "eebeebeebee crew was here"; kewpie_faygo unreachable', zh: '发现 eQualia 被洗劫；「eebeebeebee crew was here」；kewpie_faygo 联系不上' } },
    { day: 2, text: { en: 'DGSA returns: kewpie existed on seven sites and was deleted on all seven', zh: 'DGSA 返回结果：kewpie 在七个网站存在过，七个全被删除' } },
    { day: 3, text: { en: 'Interlibrary microfilm arrives from overseas', zh: '馆际借阅的缩微胶卷从海外寄到' } },
    { day: 4, text: { en: 'The guild threatens to wipe the jail and ban the IP range', zh: '公会扬言清空牢房、封 IP 段' } },
    { day: 5, text: { en: 'Microfilm reels shipped back; 7crows asks to meet at its apartment', zh: '胶卷寄回；七鸦约在它的公寓见面' } },
    { day: 6, text: { en: '7crows plans to delete its last accounts', zh: '七鸦打算删除最后的账号' } },
    { day: 7, text: { en: 'The eQualia server\'s credit runs out tonight', zh: 'eQualia 服务器额度今晚耗尽' } },
  ],
  fixed: [
    { day: 1, slot: 0, place: { en: 'eQualia: Throne Room', zh: 'eQualia：王座厅' }, mood: { en: 'north, north, north; an archway with no doors; a tapestry with one surviving sentence', zh: '向北、向北、再向北；没有门的拱门；只剩一句话的挂毯' }, title: { en: 'Was Here', zh: '到此一游' }, cast: [] },
    { day: 3, slot: 0, place: { en: 'Special Collections', zh: '大学特藏室' }, mood: { en: 'six small boxes on a plastic tray, the hum of a reader booth', zh: '塑料托盘上六个小纸盒，阅读机嗡嗡作响' }, title: { en: 'Reels from Overseas', zh: '来自海外的胶卷' }, cast: ['librarian'] },
    { day: 5, slot: 1, place: { en: 'SL: Upside-down Sim', zh: 'SL：倒置模拟区' }, mood: { en: 'the balcony ceiling, legs dangling over the sky, a flock that counts differently now', zh: '阳台的天花板，双腿悬在天空上，一群数目不对的乌鸦' }, title: { en: 'Six, Not Seven', zh: '六只，不是七只' }, cast: ['crows'] },
    { day: 7, slot: 2, place: { en: 'Featureless Room', zh: '空白房间' }, mood: { en: 'FEATURELESS ROOM / empty test place / there is a letter here / >', zh: '空白房间 / 空的测试场所 / 这里有一封信 / >' }, title: { en: 'There Is a Letter Here', zh: '这里有一封信' }, cast: ['dahlia'] },
  ],
  proactiveAfter: 2,
  endings: [
    {
      id: 'threshold', tier: 4, minStage: 3,
      title: { en: 'Threshold People', zh: '门槛上的人' },
      brief: {
        en: 'Everyone trusted Maggie with their truth. She delivers Dahlia\'s letter to 7crows whole, invitation and all, because the six crows asked to choose for themselves; wood sends the bonfire photos and stops repeating the tracts; Rosalind lends her a notebook to read offline. A reply arrives from a brand-new account with a dragon avatar. The case is not "solved", but for once nobody is alone behind the curtains.',
        zh: '每个人都把自己的真相交给了玛姬。她把达莉娅的信完整交给七鸦，连同邀请，因为六只乌鸦要求自己做选择；木头发来篝火照片，不再复述那些小册子；罗莎琳借给她一本笔记本在线下读。一个全新的账号、一个龙形象发来了回复。案子没有「破」，但这一次，窗帘后面没有人是孤单的。',
      },
    },
    {
      id: 'crows-true', who: 'crows', tier: 3, minStage: 4, minAffection: 11, maxBroken: 0,
      title: { en: 'Murmuration', zh: '群飞' },
      brief: {
        en: 'Maggie gives 7crows the letter, the invitation cut away "like removing the detonator from a bomb", and stays on the balcony while it reads. The six do not ask about the missing strip. They paint one new shape on the sky. Trust ending, close to the original\'s.',
        zh: '玛姬把信交给七鸦，邀请那一截已经剪掉——「像拆掉炸弹的引信」——然后在阳台上陪它读完。六只乌鸦没有问缺了的那一条。它们在天空上画出一个新的形状。信任结局，最接近原作。',
      },
    },
    {
      id: 'dahlia-true', who: 'dahlia', tier: 3, minStage: 4, minAffection: 11, maxBroken: 0,
      title: { en: 'The End of a New Bridge', zh: '新桥的尽头' },
      brief: {
        en: 'Locked in the featureless room with no exit, Maggie reads the invitation and, for the first time, does not push the flowers of unreality away. She blinks, and she is out; or she is somewhere tall with flowers. Write it so either reading holds. The last thing in her inbox: "Sent."',
        zh: '被锁在没有出口的空白房间里，玛姬读了那份邀请，第一次没有把「不真实的花」推开。她眨了眨眼，就出来了；或者，她在一片开满高高花朵的地方。写成两种解读都成立。她收件箱里最后一条：「已发送。」',
      },
    },
    {
      id: 'wood-true', who: 'wood', tier: 3, minStage: 4, minAffection: 11, maxBroken: 0,
      title: { en: 'Somebody Has to Burn It', zh: '总得有人去烧' },
      brief: {
        en: 'wood sends the iPod photos of nine arches on fire, gets kloose to give up the full German name, and admits he never believed any of it; he just wanted to look cool. He asks Maggie whether the bridge was for anything. She tells him the truth: nobody will ever know. He logs off the guild for good.',
        zh: '木头发来九道拱门在火中的 iPod 照片，让 kloose 说出德语全名，并承认他从来不信那一套，只是想显得酷。他问玛姬那座桥到底是干什么用的。她说了实话：永远不会有人知道了。他从此退出了公会。',
      },
    },
    {
      id: 'librarian-true', who: 'librarian', tier: 3, minStage: 4, minAffection: 11, maxBroken: 0,
      title: { en: 'Dark Matter', zh: '暗物质' },
      brief: {
        en: 'After the reels go home, Rosalind meets Maggie in the empty reading room and hands her a notebook: a fantasy kingdom in pencil that has never touched the internet. Maggie promises to never scan a page. An offline friendship between two threshold people. Trust ending.',
        zh: '胶卷寄走后，罗莎琳在空无一人的阅览室里递给玛姬一本笔记本：一个用铅笔写下、从未碰过互联网的奇幻王国。玛姬答应永远不扫描任何一页。两个门槛上的人之间的线下友谊。信任结局。',
      },
    },
    {
      id: 'crows-near', who: 'crows', tier: 2, minStage: 3,
      title: { en: 'A Comforting Story', zh: '一个让人安心的故事' },
      brief: {
        en: '7crows tells its version and flies off before Maggie can say what she thinks. She is left holding a story she does not believe, and a letter she never found.',
        zh: '七鸦讲完它的版本，没等玛姬开口就飞走了。她手里只剩一个她不信的故事，和一封她没找到的信。',
      },
    },
    {
      id: 'dahlia-near', who: 'dahlia', tier: 2, minStage: 3,
      title: { en: 'Behind the Curtains', zh: '窗帘后面' },
      brief: {
        en: 'Maggie guesses where the letter must be but the server goes dark before she gets in. In the last dream the curtains move once. She never finds out who was behind them.',
        zh: '玛姬猜到了信在哪里，但服务器在她进去之前熄灭了。最后一个梦里，窗帘动了一下。她始终不知道后面是谁。',
      },
    },
    {
      id: 'wood-near', who: 'wood', tier: 2, minStage: 3,
      title: { en: 'Golden Apple', zh: '金苹果' },
      brief: {
        en: 'wood passes the email along and gets Maggie the name, then bans her anyway, grudgingly, with a golden apple tossed through the bars as a goodbye.',
        zh: '木头转了邮箱、替玛姬拿到了名字，然后还是不情不愿地封了她，临别从铁栏间扔进来一个金苹果。',
      },
    },
    {
      id: 'not-closure', tier: 0,
      title: { en: 'Not Closure', zh: '不是结案' },
      brief: {
        en: 'Occam\'s razor: the eQualia gang were scared off the internet and shucked their identities like old clothes, somewhere Maggie will never be privy to. She closes notes.txt without believing it. Not every case can be solved. That\'s just part of the job.',
        zh: '奥卡姆剃刀：eQualia 的人被吓离了互联网，像脱掉旧衣服一样褪下了身份，去了玛姬永远不会知道的地方。她关掉 notes.txt，心里并不相信。不是每个案子都能破。这只是工作的一部分。',
      },
    },
  ],
  finale: {
    en: 'The last line should echo the title or the original\'s close: a bridge, or a message going "Sending... Sent."',
    zh: '最后一句点题「桥」，或呼应原作的结尾：一条消息「发送中……已发送」。',
  },
  loading: [
    { en: 'Sending... Sending... Sending...', zh: '发送中……发送中……发送中……' },
    { en: 'The DGSA progress bar sits full, hanging...', zh: 'DGSA 的进度条满了，卡着不动……' },
    { en: 'A typing indicator flickers on, then off...', zh: '「正在输入」亮了，又灭了……' },
    { en: 'An empty ferris wheel turns in the sky below...', zh: '下方天空里，一座空摩天轮慢慢转……' },
    { en: 'Process, Maggie. Process...', zh: '流程，玛姬。流程……' },
    { en: 'north, north, north...', zh: '向北，向北，再向北……' },
  ],
}
