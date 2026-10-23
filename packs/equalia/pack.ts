// 改编剧本包《通往 eQualia 的桥》：改编自 Blackle Mori 的 Bridge to eQualia（CC0 1.0）。
// 原作是一部无选项的线性动态小说（约 1.4 万词）。本包只取人物、世界观、关键情节与语言气质；
// 日程、地点、分支、约定、结局、图书管理员一角与全部像素形象为改编新增，台词大部分为我们新写。
// 原作者未参与、未背书本改编。原作美术、音乐、字体一概未使用。

import type { Pack } from '../../types'
import type { CraftFields } from '../../hooks/craft-types'
import { EQUALIA_CRAFT } from './craft'

export const EQUALIA: Pack & CraftFields = {
  id: 'equalia',
  version: '1.1.0',
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
      romance: false, meter: { label: { en: 'Trust', zh: '信任' }, full: '●', empty: '○' },
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
      romance: false, meter: { label: { en: 'Trust', zh: '信任' }, full: '●', empty: '○' },
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
      keepsakeIdeas: { en: 'the respawn bed in the jail cell, the crossbow he never fires, a blurry iPod photo of a bonfire', zh: '牢房里那张重生床、他从来没射过的弩、一张模糊的 iPod 篝火照片' },
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
      romance: false, meter: { label: { en: 'Trust', zh: '信任' }, full: '●', empty: '○' },
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
      romance: false, meter: { label: { en: 'Trust', zh: '信任' }, full: '●', empty: '○' },
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
  npcs: [
    {
      id: 'kloose', name: { en: 'kloose', zh: 'kloose' }, short: { en: 'kloose', zh: 'kloose' }, color: '#a89a86',
      role: {
        en: 'wood\'s high-school friend and fellow Horny Guild member; was there for the nine arches; lives in another timezone and is reachable only through wood. The one who still remembers EBBB\'s full German name.',
        zh: '木头的高中朋友，同在「Horny Guild」；烧九道拱门那次他也在；住在另一个时区，只能通过木头联系上。唯一还记得 EBBB 德语全名的人。',
      },
      look: { en: 'a dusty grey-brown moth with feathery antennae, awake at the wrong hours', zh: '一只灰褐色的蛾子，羽毛状触角，总在不对的时间醒着' },
      voice: {
        en: 'Lowercase, terse, half asleep; answers by email or relayed through wood rather than in person; more careful than wood, less willing to brag; types the German slowly and correctly.',
        zh: '全小写、极短、半睡半醒；用邮件或让木头转话，几乎不亲自出现；比木头谨慎，不爱吹；德语打得很慢，但一个字母都不错。',
      },
      samples: [
        { en: 'this isnt my timezone. make it quick', zh: '现在不是我这边的时间。快点说' },
        { en: 'wood talks too much. i remember the name. i just never wanted to type it', zh: '木头话太多。名字我记得。只是从来不想把它打出来' },
        { en: 'Einsatzgruppe zur Begrenzung von Brücken und Bruchstellen. dont email me again', zh: 'Einsatzgruppe zur Begrenzung von Brücken und Bruchstellen。别再给我发邮件了' },
      ],
      sprite: {
        pal: { A: '#c9b36a', M: '#a89a86', m: '#7d705f', B: '#4b4038', F: '#e8dcc4' },
        art: [
          '....A....A....',
          '.....A..A.....',
          'MM...FFFF...MM',
          'MMM.FFFFFF.MMM',
          'MMMMBBBBBBMMMM',
          'MmMMBBBBBBMMmM',
          '.MMMBBBBBBMMM.',
          '..mmBFFFFBmm..',
          '...mBBBBBBm...',
          '.....B..B.....',
        ],
        eyes: [[3, 5], [3, 8]], cheeks: [[3, 4], [3, 9]], motion: 'wings',
      },
    },
    {
      id: 'balenciaga', name: { en: 'balenciaga', zh: 'balenciaga' }, short: { en: 'balenciaga', zh: 'balenciaga' }, color: '#4f7a52',
      role: {
        en: 'admin of the Horny Guild Minecraft server; jailed Maggie\'s bot ykwilk921 behind iron bars, threatens to ban her IP range, and tossed her a golden apple when she asked. Fetches wood when kloose is asleep.',
        zh: '「Horny Guild」Minecraft 服务器的管理员；把玛姬的机器人 ykwilk921 关进铁栏牢房，扬言封她的 IP 段，她要金苹果时也真的扔了一个进来。kloose 睡着时，是他去把木头叫来。',
      },
      look: { en: 'a glossy dark-green beetle with a stubby horn, blocky as a server mob', zh: '一只油亮的墨绿色甲虫，一只短角，方得像服务器里的怪物' },
      voice: {
        en: 'Lowercase, flat, threats with no punctuation; bored power; never explains a rule, only enforces it; grudgingly fair when outplayed.',
        zh: '全小写、平板、威胁不带标点；无聊的权力感；从不解释规矩，只执行；被玩明白了会不情不愿地讲道理。',
      },
      samples: [
        { en: 'tell me your trick before I ban your ip range', zh: '先说你用的什么招，不然我封你整个ip段' },
        { en: 'what do you even want', zh: '你到底想要什么' },
        { en: 'this isnt his timezone. ill get wood. dont touch anything', zh: '现在不是他那边的时间。我去叫木头。什么都别碰' },
      ],
      haunts: { 1: ['jail'], 2: ['jail'] },
      sprite: {
        pal: { H: '#6b5a3a', K: '#2e3b2f', k: '#4f7a52', L: '#d9e6c8', N: '#1f2420' },
        art: [
          '......HH......',
          '.....HH.......',
          '...KKKKKKKK...',
          '..KLLLLLLLLK..',
          '..KLLLLLLLLK..',
          '.KKKKKkKKKKKK.',
          'NKkKKKkKKKkKKN',
          '.KKkKKkKKkKKK.',
          'NKKKKKkKKKKKKN',
          '..KKKKKKKKKK..',
          '.N..N....N..N.',
        ],
        eyes: [[4, 5], [4, 8]], cheeks: [[4, 3], [4, 10]], motion: 'bob',
      },
    },
    {
      id: 'coolguy', name: { en: 'the guy in the tracksuit', zh: '穿运动服的那个人' }, short: { en: 'tracksuit guy', zh: '运动服' }, color: '#5e5e5e',
      role: {
        en: 'Only a memory, never a live speaker or on stage: the older "cool guy" in a tracksuit, black beanie and five-o\'clock shadow who paid wood, kloose and their crew in weed for "missions", called the nine arches a "bridge", and preached EBBB\'s contempt for fiction. Appears only in wood\'s retelling, his iPod photos, and the tracts.',
        zh: '只存在于回忆里，从不当面说话、不上台：那个穿运动服、戴黑毛线帽、一脸胡茬的「酷哥」，用大麻换木头、kloose 和他们那伙人去做「任务」，把九道拱门叫作「桥」，宣讲 EBBB 对虚构的轻蔑。只出现在木头的讲述、iPod 照片和那些小册子里。',
      },
      voice: {
        en: 'Heard only second-hand, through wood\'s paraphrase: smooth, conspiratorial, always "they"; speaks of fiction as a trick played on the world.',
        zh: '只通过木头的转述出现：油滑、阴谋论腔调，开口就是「他们」；把虚构说成一场针对世界的骗局。',
      },
      samples: [
        { en: '(as wood remembers it) I need a couple of guys with guts for a little mission.', zh: '（木头记得的原话）我需要几个有胆子的家伙，去做个小任务。' },
        { en: '(as wood remembers it) That thing in the glade? It\'s a bridge. Pull it up.', zh: '（木头记得的原话）林子里那个东西？那是座桥。把它拔了。' },
        { en: '(as wood remembers it) Fiction is a trick they\'re playing on you. All of it.', zh: '（木头记得的原话）虚构是他们耍你的把戏。全部都是。' },
      ],
    },
  ],
  relations: [
    { a: 'crows', b: 'dahlia', kind: { en: 'best friends; Attendant to the Crown', zh: '挚友；王冠侍从' }, text: { en: 'Old friends who spoke in long chains of reference and lovingly aggressive banter. Dahlia granted 7crows moderator status days before the sovereignty party; it handed mod accounts to EBBB.', zh: '老朋友，说话靠一长串只有彼此懂的梗和亲昵的互损。主权派对前几天，达莉娅把管理员权限给了七鸦；它转手把管理员账号交给了 EBBB。' }, hiddenUntil: 3 },
    { a: 'wood', b: 'kloose', kind: { en: 'high-school crew; guild mutuals', zh: '高中同伙；公会互关' }, text: { en: 'Six of them tagged in the woods as teenagers; both did the arson "mission". Now members of the same Horny Guild; wood forgot the German name, kloose did not.', zh: '少年时六个人一起在林子里涂鸦，那次纵火「任务」两人都在。如今同在 Horny Guild；德语全名木头忘了，kloose 没忘。' } },
    { a: 'wood', b: 'coolguy', kind: { en: 'errand boy and recruiter', zh: '跑腿的与招募人' }, text: { en: 'The tracksuit guy paid in weed for missions: the nine arches, blacked-out stickers, dead animals on doorsteps. wood still repeats his ideas without knowing they were never his own.', zh: '运动服男人用大麻换任务：九道拱门、涂黑的贴纸、别人门口的死动物。木头至今还在复述他的观点，却不知道那从来不是自己的想法。' }, hiddenUntil: 3 },
    { a: 'balenciaga', b: 'wood', kind: { en: 'guild admin and member', zh: '公会管理员与成员' }, text: { en: 'balenciaga runs the server and the jail; wood is the one sent to the bars to talk to the "bot with a thousand accounts".', zh: 'balenciaga 管服务器和牢房；被派到铁栏前跟「有一千个账号的机器人」谈话的是木头。' } },
    { a: 'me', b: 'dahlia', kind: { en: 'a visitor\'s pass', zh: '一张访客通行证' }, text: { en: 'They met at a Second Life rave; kewpie gave Maggie a visitor\'s pass to eQualia and called her "bunny". Maggie promised to stop by the next day and forgot.', zh: '两人在 Second Life 的派对上认识；kewpie 给了玛姬一张 eQualia 的访客通行证，叫她「小兔」。玛姬答应第二天就去看看，然后忘了。' } },
    { a: 'me', b: 'librarian', kind: { en: 'email correspondents', zh: '邮件往来' }, text: { en: 'They had spoken over email before Maggie came in for the interlibrary microfilm.', zh: '玛姬来看馆际借阅的缩微胶卷之前，两人通过邮件联系过。' } },
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
  acts: [
    {
      id: 'trailhead', from: 1, title: { en: 'I · Trailhead', zh: '一 · 起点' },
      goal: { en: 'Setup. Maggie finds the razed kingdom, reconstructs kewpie from deleted accounts, and meets the only citizen left.', zh: '开端。玛姬发现被洗劫的王国，从被删除的账号里拼出 kewpie，见到唯一剩下的公民。' },
      beats: [
        { id: 'tapestry', day: 1, by: 1, kind: { en: 'inciting incident', zh: '起因' }, text: { en: 'In the throne room behind a door-less archway, the one surviving tapestry reads "eebeebeebee crew was here". kewpie is unreachable.', zh: '王座厅没有门的拱门后，唯一幸存的挂毯上写着「eebeebeebee crew was here」。kewpie 联系不上。' } },
        { id: 'seven-sites', day: 2, by: 2, kind: { en: 'clue', zh: '线索' }, text: { en: 'DGSA finally returns: kewpie_faygo existed on seven websites and was deleted on all seven; every eQualia citizen but one is gone too.', zh: 'DGSA 终于返回：kewpie_faygo 在七个网站上存在过，七个全被删除；eQualia 的公民除了一个，全都不见了。' } },
        { id: 'witness', day: 1, by: 3, who: ['crows'], places: ['upside', 'gardens'], kind: { en: 'first contact', zh: '初次接触' }, text: { en: '7crows, on its upside-down balcony, tells Maggie that kewpie was Princess Dahlia, eQualia\'s only moderator, and says it resigned for "personal reasons". Its typing indicator flickers on and off.', zh: '七鸦在倒置的阳台上告诉玛姬：kewpie 就是 eQualia 唯一的管理员达莉娅公主；说自己是「因个人原因」退出的。它的「正在输入」忽明忽灭。' } },
      ],
      hook: { en: 'Everyone who knew the Princess has vanished from the internet at once. Whatever did that does not live online.', zh: '认识公主的人同时从互联网上消失了。干这件事的东西，不住在网上。' },
    },
    {
      id: 'offline', from: 3, title: { en: 'II · Off the Internet', zh: '二 · 离开互联网' },
      goal: { en: 'Rising action. The trail leaves the internet: a griefers\' jail, a story about burning a bridge in the woods, and German tracts on microfilm.', zh: '发展。线索离开了互联网：恶意破坏者的牢房、一个在林子里烧掉一座桥的故事、缩微胶卷上的德语小册子。' },
      beats: [
        { id: 'jail', day: 3, by: 4, who: ['wood', 'balenciaga'], places: ['jail'], kind: { en: 'reversal', zh: '转折' }, text: { en: 'Behind the iron bars of the Horny Guild jail, wood finally tells the story: the tracksuit guy, the nine woven arches in a glade, the fire, the iPod photos. He knows the word "EBBB" but not what it stands for.', zh: '隔着 Horny Guild 牢房的铁栏，木头终于讲出来：运动服男人、林间空地上九道编织的拱门、那把火、iPod 照片。他知道「EBBB」这个词，却说不出它代表什么。' } },
        { id: 'german-name', day: 4, by: 5, who: ['kloose', 'wood'], kind: { en: 'clue', zh: '线索' }, text: { en: 'Through wood, kloose emails the full name: "Einsatzgruppe zur Begrenzung von Brücken und Bruchstellen". The worst thing that can happen to an internet sleuth: the case has left the internet.', zh: '通过木头转交，kloose 发来了全名：「Einsatzgruppe zur Begrenzung von Brücken und Bruchstellen」。对网络侦探来说最糟的事发生了：案子离开了互联网。' } },
        { id: 'tracts', day: 3, by: 5, who: ['librarian'], slots: [0, 1], places: ['library'], kind: { en: 'revelation', zh: '揭示' }, text: { en: 'On the microfilm reader Maggie finds the EBBB tracts, including a line almost word for word what 7crows said to her: fantasy is too compelling, it makes you make bad decisions.', zh: '在缩微胶卷阅读机上，玛姬找到了 EBBB 的小册子，其中一句几乎和七鸦对她说过的话一字不差：幻想太有说服力，会让你做出坏决定。' } },
      ],
      hook: { en: '7crows quoted the tracts before Maggie ever found them. It has known, this whole time.', zh: '玛姬还没找到小册子，七鸦就已经引用过它们了。它一直都知道。' },
    },
    {
      id: 'bridges', from: 5, title: { en: 'III · The Eschatology of Bridges', zh: '三 · 桥的末世论' },
      goal: { en: 'Crisis. 7crows meets Maggie as six crows, not seven, and confesses its version of the sovereignty party.', zh: '危机。七鸦以六只、而不是七只乌鸦的样子来见玛姬，讲出它版本的主权派对。' },
      beats: [
        { id: 'six-crows', day: 5, by: 6, who: ['crows'], kind: { en: 'key promise', zh: '关键约定' }, text: { en: 'On the balcony ceiling Maggie counts six crows, not seven. Before it will talk, 7crows asks one thing: whatever she finds out about Dahlia, she tells the six first, exactly as it is, before they fly.', zh: '在阳台的天花板上，玛姬数了一遍：六只，不是七只。七鸦开口之前只求一件事：她查到的任何关于达莉娅的事，都先原原本本告诉它们六个——在它们飞走之前。' }, promise: { en: 'promise 7crows to come back before they fly and tell the six everything she has found about Dahlia, unedited', zh: '答应七鸦：在它们飞走之前回来，把查到的关于达莉娅的一切原原本本告诉它们六个，不删不改' } },
        { id: 'confession', day: 5, by: 6, who: ['crows'], places: ['upside', 'gardens'], kind: { en: 'secret revealed', zh: '秘密曝光' }, text: { en: '"the only reason you know ebbb exists at all is because i called them." The lever on its pedestal, the Seventh Crow waking too late, the mod accounts handed over, the friends frozen while the vandals razed the world.', zh: '「你知道 ebbb 存在，唯一的原因是我把他们叫来的。」底座上的拉闸、太晚醒来的第七只乌鸦、交出去的管理员账号、破坏者洗劫世界时被冻住的朋友们。' } },
      ],
      hook: { en: 'Dahlia would have forgiven it. A woman like that leaves a message somewhere only royalty would look.', zh: '达莉娅会原谅它的。那样的人，会把话留在只有王室才会去看的地方。' },
    },
    {
      id: 'featureless', from: 7, title: { en: 'IV · Featureless Room', zh: '四 · 空白房间' },
      goal: { en: 'Climax. The server runs out of credit tonight. Maggie finds the unlisted test room and decides what to do with what is inside.', zh: '高潮。服务器今晚额度耗尽。玛姬找到那个不对外连通的测试房间，决定怎么处理里面的东西。' },
      beats: [
        { id: 'letter', day: 7, who: ['dahlia'], kind: { en: 'climax', zh: '高潮' }, text: { en: 'FEATURELESS ROOM / empty test place / there is a letter here. "To my dear birds": an apology, forgiveness, and an invitation to the end of a new bridge. The room has no exit.', zh: '空白房间 / 空的测试场所 / 这里有一封信。「致我亲爱的鸟儿们」：一封道歉、一份原谅，和去一座新桥尽头的邀请。房间没有出口。' } },
      ],
    },
  ],
  incidents: [
    { id: 'dgsa-hang', chance: 0.3, days: [1, 3], slots: [0, 2], text: { en: 'The DGSA progress bar sits full and hangs for an hour; the results come in only after Maggie has given up and opened the minifridge.', zh: 'DGSA 的进度条满了却卡住一个小时；直到玛姬放弃、打开小冰箱，结果才出来。' } },
    { id: 'typing-flicker', chance: 0.35, days: [1, 6], places: ['upside', 'gardens'], who: ['crows'], text: { en: '7crows\' typing indicator flickers on and off for a long time, and what finally arrives is much shorter than what it was typing.', zh: '七鸦的「正在输入」亮了又灭，灭了又亮；最后发来的，比它打了那么久的短得多。' } },
    { id: 'bots-dying', chance: 0.4, days: [2, 4], places: ['jail'], who: ['balenciaga'], text: { en: 'Maggie\'s other bots keep dying one by one in the bedrock maze; balenciaga watches the kill feed scroll and is not amused.', zh: '玛姬剩下的机器人在基岩迷宫里一个接一个死去；balenciaga 盯着滚动的击杀提示，一点也不觉得好笑。' } },
    { id: 'reader-jam', chance: 0.4, days: [3, 5], places: ['library'], who: ['librarian'], text: { en: 'The microfilm reader jams mid-reel; the librarian threads it again by hand, touching only the blank area.', zh: '缩微胶卷阅读机卷到一半卡住了；图书管理员徒手重新穿片，只碰空白的地方。' } },
    { id: 'translate-mount', chance: 0.5, days: [4, 6], places: ['room'], after: ['beat:tracts'], text: { en: 'The open-source translators choke on the two-column German; Maggie builds a K\'Nex mount for her phone and realizes she has rebuilt a microfilm reader.', zh: '开源翻译工具被两栏排版的德语卡死；玛姬用 K\'Nex 给手机搭了个支架，才发现自己造了一台简陋的缩微胶卷阅读机。' } },
    { id: 'ensure-sleep', chance: 0.2, slots: [2], text: { en: 'A chilled vanilla Ensure, twenty-five shakes, carbs on an empty stomach: Maggie nods off mid-case and wakes at exactly the wrong, or right, moment.', zh: '一瓶冰香草 Ensure，摇二十五下，空腹的碳水：玛姬在案子中间睡着了，醒来的时机恰好不对——或者恰好对。' } },
    { id: 'visitors-reply', chance: 0.3, days: [4, 6], places: ['room', 'square'], text: { en: 'A few former eQualia visitors answer Maggie\'s messages; they know less than she does and can offer only curiosity and worry.', zh: '几个曾经的 eQualia 访客回了玛姬的消息；他们知道的比她还少，能给的只有好奇和担心。' } },
  ],
  proactiveAfter: 2,
  endings: [
    {
      id: 'threshold', kind: 'true', tier: 4, minStage: 3, maxBroken: 0,
      title: { en: 'Threshold People', zh: '门槛上的人' },
      brief: {
        en: 'Everyone trusted Maggie with their truth. She delivers Dahlia\'s letter to 7crows whole, invitation and all, because the six crows asked to choose for themselves; wood sends the bonfire photos and stops repeating the tracts; Rosalind lends her a notebook to read offline. A reply arrives from a brand-new account with a dragon avatar. The case is not "solved", but for once nobody is alone behind the curtains.',
        zh: '每个人都把自己的真相交给了玛姬。她把达莉娅的信完整交给七鸦，连同邀请，因为六只乌鸦要求自己做选择；木头发来篝火照片，不再复述那些小册子；罗莎琳借给她一本笔记本在线下读。一个全新的账号、一个龙形象发来了回复。案子没有「破」，但这一次，窗帘后面没有人是孤单的。',
      },
    },
    {
      id: 'crows-true', kind: 'true', who: 'crows', tier: 3, minStage: 4, minAffection: 11, maxBroken: 0, keptKey: 'six-crows',
      title: { en: 'Murmuration', zh: '群飞' },
      brief: {
        en: 'Because Maggie kept her word and told the six everything before they flew, they come back for the letter. She hands it over whole and stays on the balcony while 7crows reads. The six cut the invitation away themselves, "like removing the detonator from a bomb", and keep the rest. They paint one new shape on the sky. Trust ending, close to the original\'s.',
        zh: '因为玛姬守约，在它们飞走之前把查到的一切都告诉了它们，六只乌鸦回来取那封信。她把信完整地交出去，在阳台上陪七鸦读完。是它们自己剪掉了邀请那一截——「像拆掉炸弹的引信」——留下了其余的部分。它们在天空上画出一个新的形状。信任结局，最接近原作。',
      },
    },
    {
      id: 'dahlia-true', kind: 'good', who: 'dahlia', tier: 3, minStage: 4, minAffection: 11, maxBroken: 0,
      title: { en: 'The End of a New Bridge', zh: '新桥的尽头' },
      brief: {
        en: 'Locked in the featureless room with no exit, Maggie reads the invitation and, for the first time, does not push the flowers of unreality away. She blinks, and she is out; or she is somewhere tall with flowers. Write it so either reading holds. The last thing in her inbox: "Sent."',
        zh: '被锁在没有出口的空白房间里，玛姬读了那份邀请，第一次没有把「不真实的花」推开。她眨了眨眼，就出来了；或者，她在一片开满高高花朵的地方。写成两种解读都成立。她收件箱里最后一条：「已发送。」',
      },
    },
    {
      id: 'wood-true', kind: 'good', who: 'wood', tier: 3, minStage: 4, minAffection: 11, maxBroken: 0,
      title: { en: 'Somebody Has to Burn It', zh: '总得有人去烧' },
      brief: {
        en: 'wood sends the iPod photos of nine arches on fire, gets kloose to give up the full German name, and admits he never believed any of it; he just wanted to look cool. He asks Maggie whether the bridge was for anything. She tells him the truth: nobody will ever know. He logs off the guild for good.',
        zh: '木头发来九道拱门在火中的 iPod 照片，让 kloose 说出德语全名，并承认他从来不信那一套，只是想显得酷。他问玛姬那座桥到底是干什么用的。她说了实话：永远不会有人知道了。他从此退出了公会。',
      },
    },
    {
      id: 'librarian-true', kind: 'good', who: 'librarian', tier: 3, minStage: 4, minAffection: 11, maxBroken: 0,
      title: { en: 'Dark Matter', zh: '暗物质' },
      brief: {
        en: 'After the reels go home, Rosalind meets Maggie in the empty reading room and hands her a notebook: a fantasy kingdom in pencil that has never touched the internet. Maggie promises to never scan a page. An offline friendship between two threshold people. Trust ending.',
        zh: '胶卷寄走后，罗莎琳在空无一人的阅览室里递给玛姬一本笔记本：一个用铅笔写下、从未碰过互联网的奇幻王国。玛姬答应永远不扫描任何一页。两个门槛上的人之间的线下友谊。信任结局。',
      },
    },
    {
      id: 'crows-near', kind: 'normal', who: 'crows', tier: 2, minStage: 3, maxBroken: 0,
      title: { en: 'A Comforting Story', zh: '一个让人安心的故事' },
      brief: {
        en: '7crows tells its version and flies off before Maggie can say what she thinks. By the time she finds Dahlia\'s letter, the balcony is empty. She is left holding a story she does not believe, and a letter with no one to read it to.',
        zh: '七鸦讲完它的版本，没等玛姬开口就飞走了。等她找到达莉娅的信，阳台已经空了。她手里只剩一个她不信的故事，和一封没有人可以念给它听的信。',
      },
    },
    {
      id: 'dahlia-near', kind: 'normal', who: 'dahlia', tier: 2, minStage: 3, maxBroken: 0,
      title: { en: 'Behind the Curtains', zh: '窗帘后面' },
      brief: {
        en: 'Maggie finds the letter in the featureless room, but cannot make herself read the invitation before the server goes dark. In the last dream the curtains move once. She never finds out who was behind them.',
        zh: '玛姬在空白房间里找到了那封信，却没能在服务器熄灭之前读完那份邀请。最后一个梦里，窗帘动了一下。她始终不知道后面是谁。',
      },
    },
    {
      id: 'wood-near', kind: 'normal', who: 'wood', tier: 2, minStage: 3, maxBroken: 0,
      title: { en: 'Golden Apple', zh: '金苹果' },
      brief: {
        en: 'wood passes the email along and gets Maggie the name; the guild bans her bot anyway, and the last thing in the cell is the golden apple balenciaga once tossed through the bars. wood logs off without saying goodbye, which is how he says it.',
        zh: '木头转了邮箱、替玛姬拿到了名字；公会还是封了她的机器人，牢房里最后剩下的，是 balenciaga 当初从铁栏间扔进来的那个金苹果。木头没说再见就下线了——这就是他的再见。',
      },
    },
    {
      id: 'crows-scatter', kind: 'bad', who: 'crows', tier: 1, minStage: 2, minBroken: 1,
      title: { en: 'Scatter', zh: '四散' },
      brief: {
        en: 'Maggie broke her word to the six. When she comes back with what she found, the upside-down apartment is empty and the account is gone; somewhere a flock of six lands on six different perches. She keeps the letter, and no one to read it to.',
        zh: '玛姬对那六只乌鸦食言了。等她带着找到的东西回来，倒置的公寓空了，账号也没了；某个地方，六只乌鸦落在了六根不同的枝头。信在她手里，却没有人可以念给它听。',
      },
    },
    {
      id: 'wood-banned', kind: 'bad', who: 'wood', tier: 1, minStage: 1, minBroken: 1,
      title: { en: 'IP Range Banned', zh: '封禁整个 IP 段' },
      brief: {
        en: 'Maggie let wood down; balenciaga wipes the jail and bans the whole IP range. The German name sits in her inbox, but she can never ask wood what he saw in the clearing, and the only trace of the nine arches stays on an old iPod nobody will ever charge again.',
        zh: '玛姬让木头失望了；balenciaga 清空牢房，封掉整个 IP 段。德语全名还躺在她的收件箱里，可她再也没法问木头那天在空地上看到了什么；九道拱门唯一的痕迹留在一台没人会再充电的旧 iPod 里。',
      },
    },
    {
      id: 'reels-gone', kind: 'bad', who: 'librarian', tier: 1, minStage: 1, minBroken: 1,
      title: { en: 'Shipped Back Overseas', zh: '寄回海外' },
      brief: {
        en: 'Maggie missed the reading room; the reels went back overseas with half the pages unread. Rosalind\'s email is polite and final. The part of the world that never answers search queries stays silent.',
        zh: '玛姬没赶上阅览室；胶卷寄回了海外，一半的页数没读。罗莎琳的邮件客气而干脆。世界上那部分不回应搜索的东西，继续沉默。',
      },
    },
    {
      id: 'not-closure', kind: 'normal', tier: 0,
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
  // 写作手法层（母题、预写关键场景、揭示、日常细节、人物细节等），见 ./craft.ts
  craft: EQUALIA_CRAFT,
}
