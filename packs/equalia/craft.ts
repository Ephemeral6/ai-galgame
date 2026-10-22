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
  ],

  texture: {
    places: {
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
