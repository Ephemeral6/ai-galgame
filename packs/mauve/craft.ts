// 《小紫帽》改编包的写作手法层。本文件与本目录其余内容一样按 CC BY-SA 4.0 发布（见同目录 LICENSE 与 README「改动清单」第 13 条）。
// 只在原作范围内加：母题、细节、口癖都取自原作已有的人物、地点和道具（以及本包 1.0/1.1 已有的改编）；
// 预写关键场景只落在本包已有的两个关键事件上，台词为我们新写，不引用原作句子。
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
        { who: 'me', text: { en: 'Since when do you say "kay", Granny?', zh: '外婆你什么时候开始说「好吧」了？' } },
        { who: 'wolf', text: { en: 'Picked it up on TV. All the young people say it.', zh: '电视里学的。年轻人都这么说。' } },
        { who: 'narration', text: { en: 'A cucumber slice slides off and lands on the pillow. Mo\'s hand closes around the glasses in her pocket.', zh: '一片黄瓜滑下来，掉在枕头上。阿紫的手在口袋里握住了那副眼镜。' } },
      ],
      unsaid: { en: 'That she already knows.', zh: '她其实已经知道了。' },
    },
    {
      id: 'mv-verdict', who: 'mom', kind: 'confession', motif: 'once-upon',
      title: { en: 'Speakerphone', zh: '免提' },
      trigger: { beat: 'verdict', minStage: 2 },
      staging: { en: 'The kitchen on Saturday evening. Mom at the table, phone face up on speaker; Dad\'s cough comes through first. Mom raises one eyebrow instead of her voice. Short lines, deadpan.', zh: '周六晚上的厨房。妈妈坐在桌边，手机面朝上开着免提，先传出来的是爸爸的一声咳嗽。妈妈只挑眉，不提高嗓门。台词短，冷面。' },
      lines: [
        { who: 'mom', text: { en: 'Sit. Your father is on speaker.', zh: '坐。你爸在免提上。' } },
        { who: 'narration', text: { en: 'From the phone: a dry cough, then a "Good evening." with a full stop you can hear.', zh: '手机里一声干咳，然后是一句听得出句号的「晚上好。」' } },
        { who: 'mom', text: { en: 'One question. Who is Loup3769?', zh: '就问一件事。Loup3769 是谁？' } },
        { who: 'me', text: { en: '...Just someone online.', zh: '……就一个网友。' } },
        { who: 'mom', text: { en: 'When I was your age, I had a "just someone" too.', zh: '我在你这个年纪，也有过一个「就一个」。' } },
      ],
    },
  ],

  texture: {
    places: {
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
