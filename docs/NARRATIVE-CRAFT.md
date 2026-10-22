# 叙事手法：从优秀视觉小说学到的可迁移方法

本文是 ai-galgame 剧情层的设计依据。用户反馈「剧情很匮乏」，问题不在 AI 写不出句子，而在于每一幕都是孤立地写出来的：没有积累，没有回收，高潮和日常写得一样平。下面整理了公认优秀的 galgame 和视觉小说在结构上的做法，逐条说明它为什么有效，以及在本引擎里怎样落地。

范围说明：

- 只学结构和方法，不复述任何作品的剧情、台词、人物或专有设定。文中的示意都是为本项目新写的。
- 依据是评论、维基条目、设计博客和少量学术文章（见文末来源）。没有可靠来源的条目标为「常识性归纳」。
- 每条手法的落地方式分四种：**字段**（剧本包里人写的数据）、**提示**（`hooks/craft.ts` 的提示片段）、**规则**（引擎里的纯函数判定）、**预写**（人写核心台词的关键场景）。

字段定义见 `hooks/craft-types.ts`，引擎接入方法见 `hooks/INTEGRATION-NARRATIVE.md`。

---

## 一、结构：共通线、个人线、锁定与真结局

### 1. 共通线负责铺垫，个人线负责深挖

- **是什么**：前半段是所有人共有的群像日常，世界、人物关系和基调在这里一次铺好。达到某个分叉点后，故事收束到一个人身上，之后只处理她的主题和冲突。
- **为什么有效**：个人线不用重复交代背景，节奏更紧。玩家进入任何一条线时，已经对整个群体有感情，被冷落的人也因此有分量。评论者认为这种「共通线承担重活」的写法是视觉小说区别于一般选择类游戏的特点；Katawa Shoujo 第一幕共通、之后按好感进入个人线，被当作「分院帽」结构的范例。
- **引擎里怎么做**：
  - 字段 `craft.routes`：`commonUntil`（共通线到第几天）、`commonGoal`（共通线怎么写）、`branches[].goal / others`（每条个人线的走向，以及被冷落的人怎样继续存在）、`ensemble`（不锁定时走群像线）。
  - 规则 `decideRoute()`：共通线最后一天过完时调用一次。阶段和好感达标、并且领先第二名 `margin` 的那个人锁定为个人线，写进 `flags` 的 `route:<id>`；没有人达标就锁定为群像线。
  - 提示：共通线期间，每幕带一行 `[Common route]`；锁定后改为 `[Personal route]`，同时写明「其他人退到背景，但带着情绪」。

### 2. 冷落也是一种选择

- **是什么**：时间和注意力是稀缺资源。不去见某个人，本身就会改变她的线，而且后果往往要到很后面才显现。
- **为什么有效**：玩家要为「没做的事」负责，选择因此有重量。评论者常拿 Mass Effect 2 的终局举例：那些没有被标成生死抉择的前置选择，最后决定了谁能活下来。
- **引擎里怎么做**：引擎已有 `proactiveAfter`（冷落几天后她会主动来找）和失约扣好感。新增的 `branches[].others` 规定了个人线锁定后其他人的反应，例如「知遥不再叫阿屿」，让冷落在剧情里看得见，而不只是一个数字。

### 3. 用前置结局解锁真结局，后一条线回应前一条线

- **是什么**：某些路线要先看过别的结局才开放；后开放的路线建立在前面路线的信息之上，补完或者推翻它。评论者常举 CLANNAD 用收集物解锁终章、Ever17 的终章需要先通其余四线、Fate/stay night 固定的解锁顺序。
- **为什么有效**：每通一条线都像拿到一块拼图。重读时，前面看过的场景会翻出新的意思。
- **引擎里怎么做**：引擎已有 `EndingDef.minLoop`。新增 `routes.truth.needEndings` 和 `reveals[].when.needEndings / minLoop`：看过指定结局，或者进入二周目之后，某个揭示才会触发。例如《蝉鸣与晚自习》里，「清漪为什么赶人离开靠窗座位」只在二周目揭示。

---

## 二、日常的质感：日常是为后面的情感爆发投入的本钱

### 4. 长日常，然后转调，然后回收

- **是什么**：先写一段平稳、甚至套路化的轻松日常，然后换一个语境，让日常里的小细节逐一变成情感筹码。评论者常举 Muv-Luv（第一部分公式化但有效的校园喜剧，后面完全换了语境）和寒蝉鸣泣之时（作者自己说是「先上坡再俯冲」）。
- **为什么有效**：玩家在日常段积累的熟悉感和安全感，就是后来失去时的痛感来源。写日常的时候，作者就已经知道后面会怎样。
- **引擎里怎么做**：
  - 字段 `craft.texture`：按天给出天气和小事，按地点给出细节，再加一组任何时候都能用的细节。每幕最多抽两条，用种子决定抽哪条，所以回退和读档的结果不变。
  - 提示 `KIND_TIPS.daily`：「低风险、真实的质感；埋一个以后可能有用的细节，不解释它」。

### 5. 反复出现的物件，以及它意义的变化（母题）

- **是什么**：一个小物件或小意象贯穿全作。早期它是笑点或背景，后期承载主题；到了关键时刻，它只要再出现一次，不需要任何解释，就能唤起前面积累的全部感情。评论者举过 CLANNAD 里一个孩子气的母题和「家族」主题的绑定。
- **为什么有效**：重复建立熟悉感。意义的变化让玩家自己完成联想，作者不必点明。
- **引擎里怎么做**：
  - 字段 `craft.motifs[]`：`thing`（物件）、`who`（属于谁）、`meanings[{stage, text}]`（从哪个关系阶段起它代表什么）、`payoff`（最后怎样回收）。
  - 规则 `pickCraft()`：从在场的人和全剧母题里挑一到两个，按当前阶段取出意义，写进 `[Motifs in play — use one as the close-up]`。
  - 缓存块里放母题清单和回收方式；动态块只放「它现在代表什么」，保持很短。
  - 预写关键场景可以指定 `motif`，保证高潮时由它来做特写。
  - 示意（自写）：入社表在阶段 0 是「凑人数的手续」，阶段 2 变成「她每天来都先看一眼它还在不在」，阶段 4 变成「一张证明有人留下来了的纸」。

### 6. 季节、天气和小事

- **是什么**：雪季、盛夏、台风周这类季节天气作为全作的底色；吃东西、上学路这类小事展示人物最放松的一面。Newtype USA 评 Kanon 时说，角色吃到好吃的东西时显得最鲜活。季节作为底色属于常识性归纳。
- **为什么有效**：小事给悲伤提供反衬的底色，天气把时间推进变得可以感知。
- **引擎里怎么做**：`texture.days[].weather` 给每天的天气，配合主开发线新增的 `atmo` 演出字段（天气、时段、粒子）。示意（自写）：第 6 天「雷阵雨前的低气压，蜻蜓飞得很低」。

### 7. 群像搞笑段落

- **是什么**：配角之间固定的笑料、口癖和误会，用在沉重段落之间。评论者把 Kanon「幽默与严肃的转换」视为它的决定性特征，也认为 CLANNAD 的笑点平衡了沉重的剧情。
- **为什么有效**：笑让玩家喘口气，也让后来的失去更重。配角因此是活人，而不是传话筒。
- **引擎里怎么做**：
  - 字段 `craft.gags[]`：参与者、笑料、限定地点。
  - 规则：场景类型判成 `comedy` 时，从在场的人能参与的笑料里抽一条，每局每条只用一次（`gag:<id>`）。
  - 提示 `KIND_TIPS.comedy`：「每个人按自己的方式好笑；结尾漏出一句安静的话」。

---

## 三、伏笔、反转、视角

### 8. 揭示：一个真相改变前文的意义

- **是什么**：在某个选择或阶段之后公开一个真相，让玩家回头重读，前面看过的细节换了意思。寒蝉鸣泣之时的出题篇和解答篇、素晴日用不同角色视角重走同一时段，都被评论者当作这种「重读时意义翻转」的例子。
- **为什么有效**：玩家会自己回头重新拼前面的信息，这比作者直接说明有力得多。前提是前文确实留下了可以回溯的线索；评论者批评 Ever17 终局「强行」时，指的正是铺垫不够的反转。
- **引擎里怎么做**：
  - 字段 `craft.reveals[]`：`when`（前置标记、谁在场、阶段、周目、看过的结局）、`truth`（真相）、`reframes[]`（前文里哪些细节因此换了意思）。
  - 规则 `revealDue()`：条件满足、相关的人在场时触发，写入 `reveal:<id>`。之后的幕偶尔会用 `revealedEcho()` 点回一条 `reframes`。
  - 「可回溯的线索」怎么保证：`reframes` 列出的细节，都是包里已经写进节拍、样例台词或母题的东西，AI 早已写过它们。
  - 示意（自写）：温璃没收天台钥匙不是刁难，而是怕小满一个人在天台待到深夜。揭示之后，「她站在天台门口看着小满的背影很久」这个早期细节就换了意思。

### 9. 闪回

- **是什么**：一两句过去的画面，像突然想起来一样插进当前一幕。
- **为什么有效**：用画面给现在的情绪找到来源，不需要大段交代背景。
- **引擎里怎么做**：字段 `craft.flashbacks[]`，可以按阶段、母题是否在场、前置标记触发；每局每条最多一次，触发概率 40%。

### 10. 视角切换：她的日记

- **是什么**：用另一个人的眼睛重看同一件事。素晴日按章节轮换视角，Ever17 两个视角的信息各不完整、到终章才拼合。
- **为什么有效**：玩家以为自己知道的事，在别人的视角里有另一层意思。
- **引擎里怎么做**：主开发线已经做了「她的日记」（`native.ts` 的 `diaryEntry`）。本层为每个主角色补充 `people.<id>.diaryVoice`：`style`（文风）、`hides`（她连日记里都不写的事）、`seesMe[5]`（每个阶段她心里怎么看「我」）。`diaryBrief()` 生成写作指引，作为 `diaryEntry` 的 `guide` 参数传入。

### 11. 元叙事与跨周目

- **是什么**：把存档、读档、重来本身写进故事，例如心跳文学部，以及东浩纪讨论过的 YU-NO 分支可视化。
- **为什么有效**：玩家的操作本身成了叙事行为，这是只有这种媒介才能做到的效果。
- **引擎里怎么做**：引擎已有 `fourthWall`、`timeLoop`，主开发线新增了上一局相册的「回声」。本层补充 `people.<id>.dejaVu[]`：二周目起，或时间循环的第 2 轮起，用 `dejaVuFor()` 给一条「好像记得什么」的台词种子。它和「回声」互补：回声来自上一局实际发生的事，既视感台词由人写定，保证语气对。

---

## 四、人物塑造

### 12. 口癖与行为习惯：同时是笑点和信号

- **是什么**：每个人有一个能被一眼认出来的小习惯。早期用来搞笑，关键时刻这个习惯「出现」或「没有出现」本身就是信息。评论者举过 CLANNAD 和 Kanon 里的这类小习惯。
- **为什么有效**：读者靠它认人；而在关键场景里，习惯消失比任何台词都响。
- **引擎里怎么做**：字段 `people.<id>.quirks / habits`，进缓存块。示意（自写）：知遥难过时反而不叫「阿屿」了；苏枕一紧张就敲桌子。

### 13. 矛盾点与成长弧

- **是什么**：嘴上想要的和心里怕的之间要有拉扯。人物的核心标签（伤病、家庭、出身）会影响她，但不能定义她。评论者这样评价 Katawa Shoujo；心跳文学部的作者自述是从人物的不安全感出发设计角色的。
- **为什么有效**：没有矛盾的人物只是一个标签。成长弧给玩家的选择一个方向。
- **引擎里怎么做**：字段 `people.<id>.contradiction / growth`，进缓存块。`growth` 只写方向，不写结果，结果由玩家的选择和结局条件决定。

### 14. 配角承担主题

- **是什么**：长辈和配角有自己没说完的故事，到后半段才收尾。评论者指出 CLANNAD 的部分家庭故事只在后篇完成。
- **为什么有效**：恋爱故事因此扩展成成长和家庭的故事，世界也显得更大。
- **引擎里怎么做**：引擎已有配角和人物关系字段。本层补充配角的 `people`（口癖、矛盾），`gossip[]`（配角之间的八卦，标明真话、半真还是误会，给主开发线的「幕后八卦」用），以及配角参与的 `reveals`。示意（自写）：闻川反对妹妹玩乐队，原来是怕她走自己五年前的老路。

---

## 五、情感节奏

### 15. 笑与泪交替

- **是什么**：沉重段落之间插入短小的轻松段落。
- **为什么有效**：给玩家喘息，也加深失去的分量（理由同第 7 条）。
- **引擎里怎么做**：`pickCraft()` 接收 `lastKind`，也就是上一幕的场景类型。上一幕是冲突、揭示、高潮或离别，而这一幕是日常时，加一条 `RELIEF_TIP`：「先轻松一下再回到主线」。

### 16. 高潮前的平静

- **是什么**：大事件的前一天，写一段几乎普通的平静场景，让一个小细节像在告别。AIR 在终章前插入一段无选项、换时代的线性章节，评论者认为这种做法让玩家放下选择压力、全情投入。
- **为什么有效**：张力来自对比。平静本身就在预告接下来的事。
- **引擎里怎么做**：领头主角色的截止日在明天、这一幕又是日常时，加一条 `CALM_TIP`。

### 17. 关键场景的写法：克制、留白、动作代替心理

- **是什么**：关键场景里台词要少，主题让读者自己领会。评论者批评魔法使之夜在读者已经领会之后，仍然反复点明主题。用动作和环境代替心理描写属于常识性归纳。
- **为什么有效**：留白让玩家参与进来。说得太满，情绪反而被说没了。
- **引擎里怎么做**：
  - 提示 `CRAFT_CORE`（每幕都有）：每幕锚定一个具体物件或动作；用潜台词，不让人物说出自己的情绪；用动作和环境表达感受；结尾停在一个画面或半句话上。
  - 提示 `KIND_TIPS.confession / farewell / reveal`：告白场景放慢、关键句写得朴素而短；离别场景谈琐事而不谈离别；揭示场景用一两句说清真相，再用一个旧细节承接它的重量。
  - 字段 `setPieces[].unsaid`：这一幕绝不说出口的话，人物要绕着它走。
  - **预写关键场景**（`setPieces`）：最容易被 AI 写平的告白、离别和高潮，由人写核心台词、调度和留白，AI 只负责补衔接（见第 19 条）。

### 18. 导演视角：特写、停顿、谁先开口

- **是什么**：电影化的调度：镜头停在哪个物件上，沉默落在哪一句之后，谁先开口，一个改变两人距离的动作。属于常识性归纳，也就是视觉小说演出（立绘走位、表情、CG 特写）的通用做法。
- **为什么有效**：同样的台词，不同的调度会带来完全不同的情绪；距离的变化本身就是情节。
- **引擎里怎么做**：提示 `DIRECTOR` 放进缓存块，要求 AI 写之前先做四个决定：特写物件、开口顺序与停顿、走位、天气和光，并把这些决定填进主开发线新增的演出字段：`camera.focus`、`camera.pause`、`atmo`、`cues`。

---

## 六、AI 原生引擎的特有做法

### 19. 预写关键场景：人写骨架，AI 补衔接

- **是什么**：每个主角色有 2 到 3 场由人写好的关键场景，包括标题、触发条件、调度说明、4 到 6 句核心台词、留白，以及可选的预写选项。触发时，AI 必须逐字保留核心台词、保持顺序，只能在台词之间补动作、旁白和最多两句过渡台词。
- **为什么有效**：每幕实时生成的好处是灵活，代价是高潮质量没有下限。把高潮的骨架交给人写，日常交给 AI 写，两者各取所长。
- **引擎里怎么做**：
  - 规则 `setPieceDue()`：绑定在某个关键事件（`trigger.beat`）上的场景优先；其余场景按阶段、地点、时段、天数、前置标记、路线、是否单独相处来判断。每局每场只触发一次（`set:<id>`）。时间循环包里标记会随循环清空，所以每一轮都会重演；台词因此写成第 1 轮和第 N 轮都说得通的样子。
  - 提示 `setPieceBrief()`：替换动态块末尾的「Write this scene…」那一句。
  - 程序检查 `setPieceIntact()`：核心台词是否都在，忽略标点和空格。不完整时用 `spliceSetPiece()` 把核心台词按顺序放回去，不额外调用模型。
  - 示意标题（自写）：「螺丝刀与零花钱」「只开了一盏灯的操场」「消防楼梯」「对着右边再说一次」。

### 20. 选择的设计

- **是什么**：选项本身就在叙事。给出哪些选项、它们怎样措辞，暴露了人物能想象到什么、能做什么（Bruno Dias）。剧情可以分开后再在固定事件处汇合，用状态记住之前的选择，在后面兑现，这就是延迟后果（Emily Short 的小结构分析；Fendt 等人 2012 年的研究发现，即时确认加上长期反馈能明显增强玩家的能动感）。质量驱动的 storylets（Failbetter，Emily Short 的总结）则按条件拼出小片段。Jon Ingold 提醒：不必每个选择都生死攸关。
- **为什么有效**：玩家在意的是「我的选择被记住了」，而不是每次都面对道德难题。
- **引擎里怎么做**：引擎已有约定、兑现、失约、关键约定（`keptKey`）和随机或条件事件（`incidents`）。本层的 `setPieces`、`reveals`、`flashbacks`、`gags` 本质上都是带前置条件的小片段，也就是 storylet 的思路。预写场景可以带 `choices`，把最关键的三个选项交给人写；平时仍由 AI 写，同时遵守引擎的「三种态度、至少一个 reply」规则。

---

## 七、写作检查单（给剧本包作者）

1. 每个主角色有 3 个以上母题，并且每个母题至少写两个阶段的意义。
2. 每个主角色有 2 到 3 场预写关键场景：至少一场日常或搞笑，一场告白或揭示，一场高潮或离别。核心台词 4 到 6 句，写上 `unsaid`。
3. 至少一个改变前文意义的揭示，`reframes` 列出的细节必须是前文真的会写到的东西。
4. 共通线写明「每人露出一个反常」；每条个人线写明「被冷落的人怎样继续存在」。
5. 每天写一条天气和一两件小事；每个常用地点写一两个细节。
6. 至少 3 段配角之间的固定笑料。
7. 每个人写口癖、行为习惯、矛盾点；主角色再写日记口吻、既视感台词、离开后发消息的语气。
8. 国内背景的包不出现日本元素；未成年角色不写露骨内容；非恋爱角色（`romance: false`）不写暧昧。

---

## 来源

（多为二手来源。两个 Fuwanovel 链接抓取时返回 403，只能依据搜索摘要；Fate/stay night 的路线顺序只有一篇玩家帖子作为依据，可靠度较低。）

- Fuwanovel, *The Common Route – An Anatomy of Visual Novels*: https://forums.fuwanovel.moe/blogs/entry/3703-the-common-route-–-an-anatomy-of-visual-novels
- Sam Kabo Ashwell, *Standard Patterns in Choice-Based Games*（gwern 镜像）: https://gwern.net/doc/www/heterogenoustasks.wordpress.com/927e47e1d10dd1b25586b7dc48eaa3a5a4ab5cdd.html
- Wikipedia: Clannad (video game) / Air (video game) / Kanon (video game) / Ever 17 / Higurashi When They Cry / Katawa Shoujo / Steins;Gate / Jun Maeda
- Steam 讨论：Fate/stay night 路线顺序: https://steamcommunity.com/app/2396980/discussions/0/597399045151953363
- Tech-Gaming, Muv-Luv review: https://tech-gaming.com/muv-luv/
- 07th Expansion Wiki, ACen 2015 Panels: https://07th-expansion.fandom.com/wiki/ACen_2015_07th_Expansion_Panels
- Steam 讨论：素晴日的结构: https://steamcommunity.com/app/658620/discussions/0/1471967615861232141
- Fuwanovel, Ever17 评论: https://forums.fuwanovel.moe/blogs/entry/2551-reorganizing-my-thoughts-on-ever17-to-be-revised-accordingly
- Prima Games, Dan Salvato 访谈: https://primagames.com/gaming/doki-doki-literature-club-plus
- Princeton Tortoise, *The Cute as Uncanny*: https://tortoise.princeton.edu/2020/05/11/the-cute-as-uncanny-how-doki-doki-literature-club-subverts-the-dating-sim-genre/
- 机核，《三色绘恋》评测: https://www.gcores.com/articles/133469
- RPG Site, *Witch on the Holy Night* review: https://www.rpgsite.net/review/15232-witch-on-holy-night-review
- Bruno Dias, *Making Interactive Fiction: Branching Choices*: https://sub-q.com/making-interactive-fiction-branching-choices/
- Emily Short, *Small-Scale Structures in CYOA*: https://emshort.blog/2016/11/05/small-scale-structures-in-cyoa/
- Emily Short, *Storylets: You Want Them*: https://emshort.blog/2019/11/29/storylets-you-want-them/
- Emily Short, *Beyond Branching*: https://emshort.blog/2016/04/12/beyond-branching-quality-based-and-salience-based-narrative-structures/
- Fendt et al. 2012, *Achieving the Illusion of Agency*: https://www.cs.uky.edu/~sgware/reading/papers/fendt2012achieving.pdf
- Wikipedia: Suicide Mission (Mass Effect 2)
- IF50, *80 Days*: https://if50.substack.com/p/2014-80-days
- Xsolla（Jon Ingold, GDC 2017）, *Narrative Sorcery*: https://accelerator.xsolla.com/blog/narrative-sorcery-coherent-storytelling-in-an-open-world

---

## English summary

This document is the design basis for the narrative layer of ai-galgame. Players found the stories thin. The cause is that every scene is generated in isolation: nothing accumulates, nothing pays off, and climaxes read like everyday scenes. We studied how acclaimed visual novels are structured, learning only methods. No text, characters or proprietary settings from any work are reused, and every example here is our own.

Transferable techniques, each with how this engine implements it (pack field / prompt snippet / engine rule / prewritten scene):

1. **Common route → personal routes, route lock, truth route.** `craft.routes` (`commonUntil`, `lock`, `branches[].others`, `ensemble`, `truth.needEndings`); `decideRoute()` locks the leading heroine into `route:<id>`, or locks the ensemble route.
2. **Neglect is a choice.** The existing proactive visits and broken promises, plus `branches[].others`, so that neglected characters stay visible and carry their feelings.
3. **Everyday life as investment.** `craft.texture` (daily weather and small things, place details); at most two picks per scene, seeded so undo and reload give the same result.
4. **Motifs whose meaning shifts with the relationship.** `craft.motifs[].meanings[{stage}]`; the current meaning is injected and used as the scene's close-up.
5. **Ensemble comedy and laugh/cry alternation.** `craft.gags`, `RELIEF_TIP`, and a calm scene before the climax (`CALM_TIP`).
6. **Reveals that reframe earlier scenes.** `craft.reveals[]` with `reframes` pointing at details the story has already shown; can be gated by playthrough or by endings seen.
7. **Flashbacks, the diary point of view, déjà vu.** `flashbacks`, `people.*.diaryVoice` (style, what she hides, how she sees "me" at each stage), `people.*.dejaVu`, `people.*.awayVoice`.
8. **Characterization.** Verbal tics, habits, contradiction, growth direction; supporting characters carry themes; `gossip` gives material for offstage gossip.
9. **Restraint and direction.** `CRAFT_CORE` (one concrete object, subtext, action over inner monologue, end on an image) and `DIRECTOR` (close-up, who speaks first, where the pause falls, blocking), which map onto the engine's `camera` / `atmo` / `cues` fields.
10. **Prewritten set pieces.** Humans write the core lines, staging and the unsaid; the AI only bridges between them; the engine checks that the core lines are intact, and splices them back in without another model call.

Sources are listed above; most are reviews and secondary analyses.
