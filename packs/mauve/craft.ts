// 《小紫帽》改编包的写作手法层。本文件与本目录其余内容一样按 CC BY-SA 4.0 发布（见同目录 LICENSE 与 README「改动清单」第 13 条）。
// 只在原作范围内加：母题、细节、口癖都取自原作已有的人物、地点和道具（以及本包 1.0/1.1 已有的改编）；
// 预写关键场景只落在本包已有的关键事件上，台词为我们新写，不引用原作句子。
// 阿紫未成年；狼是操纵者，不是恋爱对象；外婆、妈妈、狼都是 romance: false。字段定义见 hooks/craft-types.ts。

import type { PackCraft } from '../../hooks/craft-types'

export const MAUVE_CRAFT: PackCraft = {
  motifs: [
    { id: 'glasses', thing: { en: 'the glasses Mo\' thinks are ugly', zh: '阿紫嫌丑的眼镜' },
      meanings: [
        { stage: 0, text: { en: 'an embarrassment kept in a pocket', zh: '一件塞在口袋里的丢人东西' } },
        { stage: 2, text: { en: 'the thing that would let her see clearly', zh: '能让她看清楚的东西' } },
        { stage: 3, text: { en: 'seeing clearly matters more than looking cool', zh: '看清楚比好看要紧' } },
      ],
      payoff: { en: 'putting them on at No. 173', zh: '在 173 号戴上' } },
    { id: 'butter', thing: { en: 'the little pot of butter in the basket', zh: '篮子里那一小罐黄油' },
      meanings: [
        { stage: 0, text: { en: 'a boring errand', zh: '无聊的跑腿' } },
        { stage: 2, text: { en: 'a clock: the longer the detour, the softer it gets', zh: '一只钟：绕路越久，化得越软' } },
      ] },
    { id: 'door', who: 'granny', thing: { en: 'Granny\'s door that is never locked', zh: '外婆从不上锁的门' },
      meanings: [
        { stage: 0, text: { en: 'old-fashioned trust', zh: '老派的信任' } },
        { stage: 2, text: { en: 'an open invitation to anyone who knows the address', zh: '对任何知道门牌号的人敞开' } },
      ] },
    { id: 'suzie', who: 'granny', thing: { en: '"Suzie", the spray under Granny\'s pillow', zh: '外婆枕头底下的「苏西」' },
      meanings: [
        { stage: 2, text: { en: 'something heavy under the pillow', zh: '枕头底下一个沉甸甸的东西' } },
        { stage: 3, text: { en: 'Granny was never as helpless as everyone assumed', zh: '外婆从来没有大家以为的那么无助' } },
      ] },
    { id: 'kay', who: 'wolf', thing: { en: 'Wolf\'s "kay?"', zh: '狼的「好吧？」' },
      meanings: [
        { stage: 0, text: { en: 'a friendly verbal tic', zh: '一个友好的口头禅' } },
        { stage: 2, text: { en: 'a question that isn\'t really a question', zh: '一个不是问题的问题' } },
        { stage: 3, text: { en: 'the tell that gives him away when someone else says it', zh: '别人嘴里冒出来时，就露了馅' } },
      ] },
    { id: 'once-upon', who: 'mom', thing: { en: 'Mom\'s "Once upon a time..."', zh: '妈妈的「很久很久以前……」' },
      meanings: [
        { stage: 0, text: { en: 'a bedtime story nobody asked for', zh: '没人要听的睡前故事' } },
        { stage: 3, text: { en: 'her own story, told sideways', zh: '她自己的故事，换了个说法' } },
      ] },
  ],

  setPieces: [
    {
      id: 'mv-cucumbers', who: 'wolf', kind: 'climax', motif: 'glasses',
      title: { en: 'Big Cucumbers', zh: '好大的黄瓜片' },
      trigger: { beat: 'cucumbers' },
      staging: { en: 'Granny\'s room at No. 173, curtains drawn, the TV off for once. "Granny" in bed, two huge cucumber slices over the eyes, blanket to the nose. Slapstick timing, no real violence. Mo\'s hand finds the glasses in her pocket at the end.', zh: '173 号外婆的房间，窗帘拉着，电视难得关着。床上的「外婆」脸上敷着两片巨大的黄瓜，被子拉到鼻子。闹剧节奏，没有真正的暴力。最后阿紫的手在口袋里摸到了眼镜。' },
      lines: [
        { who: 'wolf', text: { en: 'Come in, darling. Granny\'s voice is a bit... ahem... rough today, kay?', zh: '进来呀，宝贝。外婆今天嗓子有点……咳……哑，好吧？' } },
        { who: 'me', text: { en: 'Granny? You sound... different.', zh: '外婆？你声音……怪怪的。' } },
        { who: 'wolf', text: { en: 'It\'s the cold, darling. Come closer, kay?', zh: '着凉了，宝贝。过来点，好吧？' } },
        { who: 'narration', text: { en: 'A cucumber slice slides off and lands on the pillow. In Mo\'s pocket, the glasses case.', zh: '一片黄瓜滑下来，掉在枕头上。阿紫口袋里，是那个眼镜盒。' } },
      ],
      unsaid: { en: 'How much she has already noticed.', zh: '她到底已经看出了多少。' },
    },
    {
      id: 'mv-verdict', who: 'mom', kind: 'confession', motif: 'once-upon',
      title: { en: 'Speakerphone', zh: '免提' },
      // 原来要求阶段 3：8 个时段里妈妈单独相处凑不满 3 次，裁决那一幕永远到不了阶段 3（束搜索 2026-10-23 确认），所以降到 2
      trigger: { beat: 'verdict', minStage: 2 },
      staging: { en: 'The kitchen on Saturday evening. Mom at the table, phone face up on speaker; Dad\'s cough comes through first. Mom raises one eyebrow instead of her voice. Short lines, deadpan.', zh: '周六晚上的厨房。妈妈坐在桌边，手机面朝上开着免提，先传出来的是爸爸的一声咳嗽。妈妈只挑眉，不提高嗓门。台词短，冷面。' },
      lines: [
        { who: 'mom', text: { en: 'Sit. Your father is on speaker.', zh: '坐。你爸在免提上。' } },
        { who: 'narration', text: { en: 'From the phone: a dry cough, then a "Good evening." with a full stop you can hear.', zh: '手机里一声干咳，然后是一句听得出句号的「晚上好。」' } },
        { who: 'mom', text: { en: 'Saturday. Your father and I want to hear it from you. Take your time.', zh: '周六的事。我和你爸想听你自己说。慢慢说。' } },
        { who: 'narration', text: { en: 'Mo\'s phone lies face down on the table between them. Nobody reaches for it yet.', zh: '阿紫的手机扣在两人中间的桌上。谁都还没去碰它。' } },
      ],
      // 停在阿紫开口之前：说了多少、妈妈讲不讲自己的旧事（阶段 3 的秘密），留给这一幕和结局
      unsaid: { en: 'What Mom went through at Mo\'s age.', zh: '妈妈在阿紫这个年纪经历过什么。' },
    },
    {
      id: 'mv-hello', who: 'wolf', kind: 'daily', motif: 'kay',
      title: { en: 'Hello!', zh: '哈喽！' },
      trigger: { beat: 'hello' },
      staging: { en: 'Wilson Boulevard in the afternoon, plane trees, the basket on Mo\'s arm, her phone in the other hand. Wolf falls into step beside her as if they had arranged it. He is all smiles; every question he asks bends back toward "where". Comic, a little uneasy; Mo\' is mostly annoyed.', zh: '下午的威尔逊大道，梧桐，阿紫一手挎篮子一手拿手机。狼像约好了似的走到她旁边。他满脸笑，每个问题都会拐回「去哪」。好笑，又有点不对劲；阿紫主要是嫌烦。' },
      lines: [
        { who: 'wolf', text: { en: 'Hello! Let me guess: errand for the family again?', zh: '哈喽！让我猜猜：又替家里跑腿？' } },
        { who: 'me', text: { en: 'Is it that obvious?', zh: '有那么明显吗？' } },
        { who: 'wolf', text: { en: 'Young, lively, pretty, and stuck carrying butter. Parents forget how to live, kay?', zh: '年轻、有活力、漂亮，却被派来送黄油。家长都忘了怎么活，好吧？' } },
        { who: 'wolf', text: { en: 'So where are we headed? Far? Which number?', zh: '那我们这是去哪？远吗？几号？' } },
        { who: 'narration', text: { en: 'The pot of butter in the basket has started to go soft.', zh: '篮子里那一小罐黄油，开始变软了。' } },
      ],
      unsaid: { en: 'That she already posted the number.', zh: '门牌号她早就发出去了。' },
    },
    {
      id: 'mv-suzie', who: 'granny', kind: 'reveal', motif: 'suzie',
      title: { en: 'Meet Suzie', zh: '这位是苏西' },
      trigger: { beat: 'warn-granny' },
      staging: { en: 'Friday afternoon at No. 173. The TV is muted for once. Granny sits up far too easily for someone stuck in bed, lifts her pillow, and presents a small pepper spray like a grandchild. The Scrabble box waits on the blanket. Keep it cosy and funny; the unease comes from the salesman, not from Granny.', zh: '周五下午的 173 号。电视难得静了音。外婆坐起来，对一个卧床的人来说太轻松了点；她掀起枕头，像介绍孙辈一样亮出一小罐防狼喷雾。拼字游戏盒放在被子上。气氛温馨好笑；不安来自那个推销员，不来自外婆。' },
      lines: [
        { who: 'granny', text: { en: 'Darling, I\'d like you to meet Suzie. She sleeps under my pillow. Hihi!', zh: '宝贝，给你介绍一下苏西。她就睡在我枕头底下。嘻嘻！' } },
        { who: 'me', text: { en: 'Granny. That\'s pepper spray.', zh: '外婆。那是防狼喷雾。' } },
        { who: 'granny', text: { en: 'And that charming salesman is dropping by tomorrow with the whole box set. Such a silver tongue.', zh: '那个嘴很甜的推销员明天要带着整套全集过来。真会说话。' } },
        { who: 'me', text: { en: 'Did he say how he got your number?', zh: '他说过他怎么有你的电话吗？' } },
        { who: 'granny', text: { en: 'He didn\'t say. I didn\'t ask. Now, Scrabble?', zh: '他没说。我也没问。好了，下盘拼字？' } },
      ],
      unsaid: { en: 'That Granny is less ill than she lets on.', zh: '外婆其实没病得那么厉害。' },
    },
  ],

  reveals: [
    {
      // 阶段 2：与 relations 里「狼—推销员」hiddenUntil: 2 一致；阶段 3 在黄瓜片那一幕之前凑不出来。
      // 不等 beat:request：好友申请之后狼只剩黄瓜片一幕，那是预写场景，预写场景里不出揭示（craft.ts pickCraft）
      id: 'rv-one-man', when: { after: ['beat:salesman'], who: 'wolf', minStage: 2 },
      // 只揭「是同一个人」；「他从阿紫的动态里找到地址」是 me–wolf 关系 hiddenUntil: 3 的内容，不在这里说
      truth: { en: 'The "salesman" who keeps phoning No. 173 and Loup3769 are the same man.', zh: '一直往 173 号打电话的「推销员」和 Loup3769 是同一个人。' },
      reframes: [
        { en: 'Granny\'s "you silver-tongued devil, hehe!" on the phone', zh: '外婆在电话里那句「哎哟，你这张甜嘴，嘻嘻！」' },
        { en: 'Wolf on the kiosk bench, "as if he knew"', zh: '狼坐在小亭长椅上，「好像早知道她会来」' },
      ],
    },
    {
      id: 'rv-binge', when: { who: 'granny', minStage: 3 },
      truth: { en: 'Granny was never really bedridden: she stayed up two nights binge-watching detective shows and let the family believe she was ill, so Mo\' would keep coming.', zh: '外婆根本没有卧床不起：她连熬两夜追侦探剧，顺水推舟让家里以为她病了，好让阿紫一直来看她。' },
      reframes: [
        { en: 'the TV guide circled all over in pen', zh: '电视节目单上画满的圈' },
        { en: '"stuck in bed for two days"', zh: '「卧床两天了」' },
        { en: 'how easily she sat up to show Suzie', zh: '她亮出苏西时坐起来得那么轻松' },
      ],
    },
  ],

  flashbacks: [
    { id: 'fb-status', who: 'me', trigger: { after: ['beat:basket'] }, text: { en: 'Wednesday, one thumb, no thought: "off to Granny\'s AGAIN #173WilsonBlvd #ugh". Posted. Public.', zh: '周三，单手，没过脑子：「又去外婆家了 #威尔逊大道173号 #烦」。已发布。公开。' } },
    { id: 'fb-mom-fifteen', who: 'mom', trigger: { minStage: 3 }, text: { en: 'Mom at fifteen, in a photo nobody shows: a jean jacket, a scooter at the kerb, and a boy who called her "pretty" before he knew her name.', zh: '十五岁的妈妈，一张没人拿出来看的照片：牛仔外套，路边一辆小摩托，一个还不知道她名字就叫她「美女」的男孩。' } },
    { id: 'fb-scrabble', who: 'granny', trigger: { motif: 'door' }, text: { en: 'Years ago, Mo\' aged six on Granny\'s lap, spelling C-A-T with three tiles and being told it was worth a thousand points.', zh: '很多年前，六岁的阿紫坐在外婆腿上，用三块牌拼出 C-A-T，外婆说这值一千分。' } },
  ],

  gossip: [
    { id: 'g-dad-mom', from: 'dad', about: 'mom', truth: 'true', fromDay: 2, text: { en: '(text) Your mother has checked your SocialBook three times tonight. She thinks I didn\'t notice.', zh: '（短信）你妈今晚看了三次你的 SocialBook。她以为我没发现。' } },
    { id: 'g-dad-granny', from: 'dad', about: 'granny', truth: 'true', fromDay: 2, text: { en: '(text) Granny called to ask if "qi" is a real word. It is. She already knew. She just wanted to tell someone she played it.', zh: '（短信）外婆打电话问我「qi」算不算一个词。算。她早知道。她就是想找个人说她摆出来了。' } },
    { id: 'g-granny-dad', from: 'granny', about: 'dad', truth: 'false', text: { en: '"Your father proposed with a Scrabble word that doesn\'t exist. I let it count. Hihi."', zh: '「你爸求婚的时候摆了一个根本不存在的拼字词。我还是给他算分了。嘻嘻。」' } },
  ],

  texture: {
    days: [
      { day: 1, weather: { en: 'a warm Wednesday, too nice for errands', zh: '暖和的周三，好天气不该拿来跑腿' }, bits: [{ en: 'the rice cake wrapped in cling film twice', zh: '米饼裹了两层保鲜膜' }] },
      { day: 2, bits: [{ en: 'Thursday homework nobody has started', zh: '没人动过的周四作业' }] },
      { day: 3, bits: [{ en: 'everyone at school talking about weekend parties', zh: '学校里人人都在聊周末派对' }] },
      { day: 4, weather: { en: 'Saturday, bright, the boulevard full of shoppers', zh: '周六，晴，大道上满是逛街的人' }, bits: [{ en: 'Mo\'s party outfit laid out on the bed, just in case', zh: '派对要穿的衣服摊在床上，以防万一' }] },
    ],
    any: [
      { en: 'a hashtag typed and deleted', zh: '打了又删的一个话题标签' },
      { en: 'the glasses case, still unopened in a pocket', zh: '口袋里的眼镜盒，还没打开过' },
    ],
    places: {
      hallway: [{ en: 'the name plate "Margaret Little", first door on the right', zh: '姓名牌「玛格丽特·小」，右手第一间' }, { en: 'the light that flickers on every third second', zh: '每隔三秒闪一下的灯' }],
      kitchen: [{ en: 'the organic rice cakes nobody likes', zh: '没人爱吃的有机米饼' }],
      boulevard: [{ en: 'a long, long walk; the sun on the basket', zh: '很长很长的一段路，太阳晒着篮子' }],
      icecream: [{ en: 'the bench by the kiosk, always occupied by the same person', zh: '小亭旁的长椅，总被同一个人坐着' }],
      granny: [{ en: 'the TV guide circled all over in pen', zh: '电视节目单上画满了圈' }, { en: 'the Scrabble board with outrageous old words', zh: '拼字盘上离谱的老词' }],
      phone: [{ en: 'a notification at midnight, then another', zh: '半夜一条通知，接着又一条' }],
    },
  },

  gags: [
    { id: 'scrabble', who: ['granny'], text: { en: 'Granny plays an archaic word nobody has heard of, insists it\'s real, and wins anyway.', zh: '外婆摆出一个谁也没听过的老词，坚持说它存在，然后照样赢了。' }, places: ['granny'] },
    { id: 'dad-period', who: ['dad'], text: { en: 'Dad\'s texts always end with a full stop, which Mo\' reads as a threat.', zh: '爸爸的消息永远以句号结尾，阿紫把它读成威胁。' } },
    { id: 'hashtags', who: ['mom'], places: ['kitchen'], text: { en: 'Mom reads one of Mo\'s statuses aloud in a flat voice, hashtags included: "hashtag ugh. hashtag mom."', zh: '妈妈用毫无起伏的语调把阿紫的一条动态念出来，连话题标签一起：「井号烦。井号老妈。」' } },
    { id: 'rice-cake', who: ['granny'], places: ['granny'], text: { en: 'Granny asks Mo\' to read the ingredients on the organic rice cake aloud, slowly, like evidence in a detective show. "Brown rice... and what else? Suspicious."', zh: '外婆让阿紫把有机米饼的配料表慢慢念出来，像侦探剧里念证物。「糙米……还有呢？可疑。」' } },
  ],

  people: {
    wolf: { quirks: [{ en: '"kay?"', zh: '「好吧？」' }, { en: '"young adults like you and me"', zh: '「我们这样的年轻人」' }], contradiction: { en: 'all charm on the surface; every question circles back to "where exactly"', zh: '表面全是殷勤，每个问题都绕回「到底在哪」' } },
    granny: {
      quirks: [{ en: '"hihi"', zh: '「嘻嘻」' }, { en: 'fairy-tale formulas and TV detective plots', zh: '童话套话和电视侦探剧情' }],
      habits: [{ en: 'circles the TV guide', zh: '在电视节目单上画圈' }],
      contradiction: { en: '"bedridden", yet suspiciously spry', zh: '说是卧床不起，却灵活得可疑' },
      diaryVoice: {
        style: { en: 'a TV-guide margin: episode titles, Scrabble scores, one smug "hihi"', zh: '写在电视节目单的页边：剧集名、拼字比分、一个得意的「嘻嘻」' },
        hides: { en: 'that she half-faked being ill', zh: '她一半是装病' },
        seesMe: [
          { en: 'my little one, sent by her mother', zh: '被妈妈打发来的小乖' },
          { en: 'a Scrabble opponent', zh: '拼字对手' },
          { en: 'she\'s noticing things', zh: '她开始注意到了' },
          { en: 'my accomplice', zh: '我的同谋' },
          { en: 'a match for any wolf', zh: '对付得了任何狼' },
        ],
      },
    },
    mom: {
      quirks: [{ en: '"young lady"', zh: '「小姑娘」' }, { en: '"we\'ll talk about it with your father"', zh: '「等你爸回来再说」' }],
      habits: [{ en: 'raises an eyebrow instead of her voice', zh: '挑眉，不提高嗓门' }],
      contradiction: { en: 'tells the old story because she lived it', zh: '总讲那个老故事，因为她亲身经历过' },
      diaryVoice: {
        style: { en: 'a grocery list that turns into a letter halfway down', zh: '一张写着写着变成信的购物清单' },
        hides: { en: 'Saturday is already a "maybe"', zh: '周六其实已经是「可以考虑」' },
        seesMe: [
          { en: 'too old for stories, apparently', zh: '据说已经过了听故事的年纪' },
          { en: 'a fierce negotiator', zh: '难缠的谈判对手' },
          { en: 'someone is talking to her online', zh: '网上有人在跟她说话' },
          { en: 'old enough to hear the real story', zh: '够大了，可以听真实的故事' },
          { en: 'trustworthy', zh: '值得信任' },
        ],
      },
    },
    dad: { quirks: [{ en: 'texts in full sentences with a full stop', zh: '消息写完整句子，句号结尾' }] },
  },
}
