# 小紫帽 / Little Mauve Riding Hood（剧本包 `mauve`）

## 许可

**本目录（`packs/mauve/`）的全部内容按 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 发布**，法律文本全文见同目录 `LICENSE`。这与引擎本身的 MIT 许可相互独立：引擎代码仍是 MIT，本剧本包是 CC BY-SA 4.0 的改编作品。转载、再改编本包须保留下方署名并以相同许可（CC BY-SA 4.0）发布。

## 原作署名

- 作品：*Le Petit Chaperon Mauve / Little Mauve Riding Hood*（2015）
- 剧本、程序、背景、音乐、英译：bosinpai；Mo' 与外婆立绘：Lady；狼立绘：redgriff；英文校对：Hazel-Bun（Cherubim Scribes）
- 链接：<https://gitlab.com/chaperon_mauve/chaperon_mauve> · <https://bosinpai.itch.io/little-mauve-riding-hood> · <https://linuxfr.org/news/visual-novel-le-petit-chaperon-mauve>
- 许可：CC BY-SA 4.0 — <https://creativecommons.org/licenses/by-sa/4.0/>

署名声明（随包显示）：

> Adapted from "Le Petit Chaperon Mauve / Little Mauve Riding Hood" (2015) by bosinpai (https://gitlab.com/chaperon_mauve/chaperon_mauve), licensed under CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/); modified by ai-galgame contributors, and this adaptation is released under the same CC BY-SA 4.0 license.

## 许可核对（2026-10-22）

- 仓库 `CREDITS.txt`：
  > Le Petit Chaperon Mauve - Little Mauve Riding Hood
  > is fully released under Creative Common BY-SA 4.0.
  > See COPYING.txt for details.
- 仓库 `COPYING.txt`：Creative Commons Attribution-ShareAlike 4.0 International 法律文本全文。
- itch.io 页面：「This game is released under Creative Commons BY-SA.」资产许可栏：「Creative Commons Attribution_ShareAlike v4.0 International」。

## 只用了什么

只改编了原作剧本文本（`game/script.rpy` 法语原文与 `game/tl/english/script.rpy` 作者英译）中的人物、关系、情节与语言风格。**未使用原作的任何美术（立绘、背景、CG）、音乐、音效或字体**。本包立绘是新画的 14 列方块像素小动物（狼、羊外婆、兔妈妈），不模仿原作立绘。原作 `CREDITS.txt` 中另有第三方音乐与音效（Bach 演奏录音、freesound.org 音效，CC BY 3.0 / CC0），本包均未使用。

## 改动清单

1. 原作一个下午 → 四天（周三到周六）× 两个时段（下午、晚上）；每一幕由 AI 按本包骨架实时写出。
2. 原作中只有画外音的妈妈成为正式角色；狼、外婆、妈妈各有信任值、5 阶段节拍、秘密与截止日。
3. 新增伏笔与道具：SocialBook 动态泄露门牌号、外婆不锁的门、防狼喷雾「苏西」、侦探剧全集推销电话、阿紫嫌丑的眼镜、妈妈自己的旧事。
4. 原作 4 个选择、5 个结局 → 7 个按条件触发的结局：三代同堂（新增群像）、我的囚犯、牢房格、周六之夜（新增）、平静结局·游戏、险些出事、禁足。
5. 原作「受害者」坏结局（侵害与死亡）改为不露骨的「险些出事」；文风规则明确狼是操纵者而非恋爱对象，阿紫未成年，不写性内容。
6. 英文名沿用作者英译（Mo'、Wolf、Margaret Little、Handov Erzycash）；中文为我们自己的翻译（阿紫、狼、玛格丽特·小、「交出钱来」养老院）；样例台词少量保留法语原句并附译文。
7. （1.1 版）新增三个配角，均出自原作：爸爸（原作只出现在妈妈的「等你爸回来再说」里，本包也不让他上台，只通过电话和短信出现，台词为我们新写）；警员（原作喷雾结局里的 "Agent"，部分台词引自原作）；「交出钱来」养老院护工（原作「我的囚犯」结局里的护工，部分台词引自原作）。警员和护工配了新画的方块像素小动物（戴警帽的鸽子、穿白大褂的蜥蜴），不模仿原作立绘。
8. （1.1 版）新增人物关系（母女、父母统一战线、阿紫与狼、狼与外婆、拼字游戏宿敌、警员与外婆），均来自原作情节；其中「狼看过那条门牌号动态」「推销员就是狼」标为到一定阶段才挑明。
9. （1.1 版）新增三幕主线与 7 个关键事件，按原作场景排列：妈妈的故事与篮子、大道上的「哈喽！」、推销员电话、SocialBook 好友申请、关键约定（答应外婆周六提前过来；兑现才可能达成「牢房格」结局，替换原来的「至少兑现一个约定」条件）、黄瓜片与眼镜、周六晚上的裁决。「推销员周六顺路过来」「答应外婆提前过来」是我们的推断性改编，原作中不存在。
10. （1.1 版）新增 6 个随机小事件（SocialBook 半夜通知、外婆的电视声、推销员来电、绕路买冰淇淋、黄油在太阳下变软、爸爸的短信），都发生在原作已有的地点与道具上；爸爸的短信为新增推断。
11. （1.1 版）新增两个不露骨的坏结局：「没有复仇赛」（失约于外婆）、「手机没收」（失约于妈妈）；所有结局标注了类别（真 / 好 / 普通 / 坏）。原作结局名与文风保持不变；狼仍然只是操纵者，阿紫未成年，不写任何性内容或暴力细节。
12. （1.1 版）狼、外婆、妈妈标记为非恋爱角色（`romance: false`）：界面上狼显示「看穿 ◆◇」，外婆和妈妈显示「信任 ●○」，不再用心形；提示里写明这几位不是恋爱对象。
13. （写作手法层，`packs/mauve/craft.ts`）新增可选字段 `craft`：母题（阿紫的眼镜、篮子里的黄油、外婆不锁的门、「苏西」、狼的「好吧？」、妈妈的「很久很久以前」）、各地点的日常细节、两段群像小笑料（外婆的拼字老词、爸爸消息里的句号）、人物口癖与矛盾点、外婆和妈妈的日记口吻；两个预写关键场景，只落在本包已有的关键事件上（「黄瓜片」与「周六的裁决」），核心台词为我们新写，不引用原作句子。全部取材于原作已有的人物、地点与道具，没有新增人物或情节；狼仍然只是操纵者，阿紫未成年，不写恋爱、性内容或暴力细节。本文件同样按 CC BY-SA 4.0 发布。
14. （写作手法层补充，2026-10-23）新增两个预写关键场景，落在本包已有的关键事件上：「哈喽！」（大道上的初遇）、「这位是苏西」（周五的关键约定）；两条揭示：推销员就是 Loup3769、外婆其实没卧床；三段闪回；三条八卦；两段笑料（妈妈念话题标签、外婆让阿紫念米饼配料表）；按天的天气和日常细节，以及走廊的细节。台词全部为我们新写。以下是我们新加的推断性细节，原作里没有：
- 妈妈十五岁时的一张照片。
- 爸爸求婚时摆的不存在的拼字词。
- 外婆打电话问「qi」算不算一个词。
- 阿紫六岁时拼的 C-A-T。
- 妈妈一晚上看了三次阿紫的 SocialBook（对应原作「妈妈开始翻她的公开动态」）。
- 外婆让阿紫像念证物一样念米饼配料表。

人物的秘密仍按原来的阶段揭开：
- 外婆装病、妈妈年轻时被骗，都是阶段 3。
- 「推销员就是狼」是阶段 2，与人物关系里的设定一致。
- 「他从阿紫的动态里找到地址」是阶段 3。

周六裁决那一幕停在阿紫开口之前，不替结局决定她说了多少。阿紫未成年的规则不变。

---

## English summary

**Everything in this directory is released under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)** (full legal code in `LICENSE`), separately from the engine's MIT license.

This pack adapts the script of *Le Petit Chaperon Mauve / Little Mauve Riding Hood* (2015) by bosinpai (art by Lady and redgriff — not used here), <https://gitlab.com/chaperon_mauve/chaperon_mauve>, licensed under CC BY-SA 4.0. License checked on 2026-10-22: the repository's `CREDITS.txt` states the game "is fully released under Creative Common BY-SA 4.0" and `COPYING.txt` contains the CC BY-SA 4.0 legal code; the itch.io page states "This game is released under Creative Commons BY-SA."

Only the script text (characters, plot, tone) was adapted. **No original art, music, sound effects or fonts are used**; sprites are new block-pixel animals.

Changes: one afternoon expanded to four days with two time slots; Mom promoted to a full character; trust meters, deadlines, promises and foreshadowing added; the original five endings reworked into nine condition-based endings (four new: an ensemble ending, Saturday Night, and two non-graphic bad endings); the original "VICTIM" ending replaced with a non-graphic close call; Wolf, Granny and Mom are marked as non-romance characters (`romance: false`): the pane shows "Seen through ◆◇" for Wolf and "Trust ●○" for Granny and Mom instead of hearts, and the prompt states they are not love interests; scenes are written live by AI from this outline; Chinese translation is ours.

Version 1.1 additions: three supporting characters taken from the original — Dad (only mentioned in the original, kept off stage here and heard by phone/text; his lines are ours), the police officer ("Agent") of the pepper-spray ending, and the Handov Erzycash orderly of the My Prisoner ending (some lines quoted from the original) — with new block-pixel sprites for the last two; character relations from the original's plot; three acts with seven key beats following the original's scenes, one of them a key promise to Granny (our inference, not in the original) that now gates the Jail Space ending; six small random incidents set in the original's places and props (Dad's text is our addition); ending categories (true / good / normal / bad).

Craft layer (`packs/mauve/craft.ts`, also CC BY-SA 4.0): an optional `craft` field with motifs (Mo's glasses, the pot of butter, Granny's unlocked door, Suzie, Wolf's "kay?", Mom's "Once upon a time"), per-place texture, two small running gags, character tics and contradictions, diary voices for Granny and Mom, and two prewritten set pieces placed only on existing beats (the cucumbers, Saturday's verdict) with newly written core lines — no lines quoted from the original. Everything draws on the original's characters, places and props; no new characters or plot. Wolf remains a manipulator only; Mo' is a minor; no romance, sexual content or graphic violence.

License obligations kept: the attribution notice above is shown with the pack; every change is listed here; this adaptation, including the version 1.1 additions, remains under CC BY-SA 4.0 with the full legal code in `LICENSE`.
