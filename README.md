# ai-galgame

**在 Claude Code 里玩的 AI 原生视觉小说。** 人写故事骨架，AI 现场写每一幕；你只用键盘做选择，不用打字。

[English](#english) · [安装](#安装) · [玩法](#玩法) · [剧本包](#随附剧本包) · [写自己的剧本包](#写自己的剧本包) · [费用](#ai-费用) · [许可](#许可与版权)

```
╭─ 蝉鸣与晚自习 ─────────────────────────── 第一章 · 转学生 ─╮
│ 第 3 天 · 放学   ▪▪◉·◆·◆◆·◆·◆◆◆                            │
│ 小满 ♥♥♡♡♡  清漪 ♥♡♡♡♡  知遥 ♥♥♥♡♡  一诺 ♡♡♡♡♡  温璃 ♡♡♡♡♡ │
╰────────────────────────────────────────────────────────────╯
            ▄▄      ▄▄
           █▀▀██████▀▀█        （像素小动物立绘，会眨眼、会动）
           █ ▌      ▐ █
小满「诶——你也太慢了吧！天文社的门我都替你开好了！」
 1 [回话] 帮她擦镜片
 2 [观察] 看看桌上的星图
 3 [答应] 流星雨那晚一定到天台
```

## 安装

需要较新的 Claude Code（支持插件 hooks 模块；本项目在 2.1.308 上开发和测试）。在 Claude Code 的输入框里运行：

```
/plugin install ai-galgame --marketplace Ephemeral6/ai-galgame
```

出现 `Add marketplace?` 时按 `y`，作用范围选默认的 user 即可。也可以在终端里运行：

```
claude plugin install ai-galgame --marketplace Ephemeral6/ai-galgame
```

装好后输入 **`/gal`** 打开面板。终端较宽（约 110 列以上）时面板会出现在对话右侧；窄的时候 `/gal` 会把它打开在当前视图里。像素立绘只在终端里显示，桌面版和 VS Code 里显示文字版。

## 玩法

| 按键 | 作用 |
| --- | --- |
| `1`–`9` | 选择选项 / 地点 |
| `J` | 下一句 / 继续 |
| `A` | 显示全部台词 |
| `U` | 回退一步 |
| `S` | 存档 · 读档 |
| `P` | 相册（回忆、信物、结局、约定） |
| `H` | 操作说明 |
| `O` | 自动游玩：让 AI 替你玩，再按一次停止 |
| `E` | 设置（自动游玩时进设置不会打断） |
| `T` | 回到标题 · `B` 返回 |

先点一下面板（或 `ctrl+x` 再按 `tab`）让它获得焦点，按键才会生效。

**一局是怎样的**

- **选地点，决定遇见谁。** 每天分几个时段，你选去哪里。每个角色有自己的日常行踪，冷落太久的人会主动来找你。比赛、灯会、清晨的车站这类固定事件会锁定当天的地点。
- **故事分幕，有必须发生的关键事件。** 每个剧本包可以把故事分成开端、转折、高潮几幕，每一幕有两三个关键事件（转折、误会、秘密曝光）。相关的人在场时，引擎要求 AI 把它写进这一幕；拖到最后期限就不论谁在场都会发生。一幕结束时给出悬念。
- **不只是女主。** 班主任、同桌、小卖部老板娘、教练、学长……配角不可攻略，但会出场推动剧情，也可以有自己的像素立绘（同框最多两人）。人物之间有旧友、情敌、误会、亲属关系，写进提示里让剧情交织。
- **每局都有点不一样。** 下雨、停电、月考成绩、在老街碰见谁——随机事件按条件和概率触发。种子随这一局固定，回退、读档不会把结果洗掉。
- **每一幕都是 AI 现写的。** 旁白、台词和三个选项按剧本包的设定、人物当前的关系阶段和你之前的选择生成。选项分三种：回话、观察（换来一个细节，之后会被回收）、答应（记成约定）。
- **她记得你做过什么。** 选择和观察记进伏笔簿，后面的剧情会提起；答应过的事有期限，做到了加分，没做到会伤人。在关键事件里许下的是「关键约定」（★），兑现与否决定能不能走到真结局。
- **关系分五个阶段**（陌生 → 熟悉 → 心事 → 秘密 → 抉择，名字由剧本包定），好感和相处次数都够了才会推进。到后两个阶段时，AI 会画一件 8×8 像素的信物收进图鉴。
- **多结局。** 每个人有真、好、普通、坏几种结局；真结局要兑现关键约定、集齐信物或二周目。AI 写一段回收你们真实经历的终章。解锁的结局和通关次数跨周目保存。
- **自动游玩（`O`）**：标题页和游戏中都能开关。AI 替你选地点、选主动来找的人、选选项，每次的理由用暗色显示（如「→ 选 2：想看她会不会说出秘密」），台词按慢 / 中 / 快自动翻句，选项出现后停顿约 2 秒再选。策略可选：专一（锁定一个人，自己指定或问 AI）、随心（按 AI 对剧情的兴趣）、收集（优先没见过的人、地点和未解锁的结局）、混乱（随机，不调用模型）。为了不在无人看管时一直花额度，默认连跑 6 幕就暂停（可改成 3 / 12 / 24 幕或「跑到当天结束」），到结局、出错时停下并显示原因；按别的键就暂停。自动玩过的选择照样记进相册和伏笔簿，可以回退，结局正常解锁。
- **完整的游戏外壳**：标题画面、继续 / 读档、3 个存档位加自动存档、回退、相册、设置（语言、立绘动画、逐句 / 整段显示）、操作说明。旧版本的存档会自动迁移；认不出来的存档显示为「无法识别」，不会报错。
- **中英双语**：标题页切换语言，界面和 AI 写的剧情都会跟着换。

## 随附剧本包

| 剧本包 | 题材 | 规模 | 许可 |
| --- | --- | --- | --- |
| **蝉鸣与晚自习** Cicadas & Evening Study | 原创旗舰：江南县城中学，暑假前的十四天；天文社撤社、省运会、出国、校报与学生会 | 14 天 × 3 时段 · 5 名主角色 · 6 名配角 · 3 幕 9 个关键事件 · 12 种随机事件 · 22 个结局 | CC BY 4.0 |
| **防空洞与江雾音乐节** The Shelter Band & the River Fog Festival | 原创：西南雾都，高考后的夏天，防空洞里的乐队冲音乐节新人舞台 | 13 天 × 3 时段 · 4 名主角色 · 5 名配角 · 3 幕 9 个关键事件 · 12 种随机事件 · 18 个结局 | CC BY 4.0 |
| **白桦岭的最后一班车** Last Train from Birch Ridge | 原创：东北林区小镇整体搬迁前的十天 | 10 天 × 3 时段 · 3 名主角色 · 4 名配角 · 3 幕 · 14 个结局 | CC BY 4.0 |
| **潮信七日** Seven Tides | 原创：台风周的时间循环，记忆保留、最多重来 2 次 | 7 天 × 3 时段 · 3 名主角色 · 3 名配角 · 3 幕 · 14 个结局 | CC BY 4.0 |
| **停播前的四个夜晚** Four Nights Before Sign-Off | 原创短篇：打破第四面墙，有二周目专属结局 | 4 天 × 2 时段 · 1 名主角色 · 2 名配角 · 6 个结局 | CC BY 4.0 |
| **Bridge to eQualia**（改编） | 改编自 Blackle Mori 的同名作品 | 7 天 · 4 名角色 · 3 名配角 · 12 个结局 | CC0 1.0 |
| **Little Mauve Riding Hood**（改编） | 改编自 bosinpai 等人的 *Le Petit Chaperon Mauve* | 4 天 · 3 名角色 · 3 名配角 · 9 个结局 | CC BY-SA 4.0 |

原创包借的是题材类型的结构和氛围，角色、剧情、台词、名字全部原创。两部改编只在原作的人物与设定范围内加厚，只用了原作的文本和人物设定，没有用原作的美术、音乐、音效和字体；所有立绘都是本项目自己画的方块像素小动物。每个剧本包的出处、许可原文和改动清单见各自目录下的 `README.md`。

## 写自己的剧本包

剧本包定义一个故事的骨架。所有文本字段都可以写成 `{ "zh": "…", "en": "…" }`。

| 字段 | 必填 | 写什么 |
| --- | --- | --- |
| `cast` | 是 | 可攻略的主角色（1–6）：说话方式、示例台词、秘密、五个阶段的剧情节拍、日常行踪、截止日、像素立绘；可选 `tagline`（不在场时提示里的一行摘要）；不是恋爱对象的角色（亲人、对手、骗子）写 `romance: false` 和 `meter: { label, full, empty }`，界面显示「信任 ●●○」「看穿 ◆◇」而不是心形，提示里也写明不写恋爱 |
| `places`、`slots`、`days`、`events`、`fixed` | 是 | 地点、时段、天数、日历事件、固定事件（固定事件的 `cast` 可以有配角） |
| `endings` | 是 | 结局条件：`minStage`、`minAffection`、`maxAffection`、`maxBroken`、`minBroken`、`minKept`、`keptKey`（兑现某个关键约定）、`minKeepsakes`、`minLoop`（二周目）、`flags`（某个关键事件 / 随机事件发生过）；`kind` 标明真 / 好 / 普通 / 坏；要有一个无条件的兜底结局 |
| `npcs` | 否 | 配角（0–8）：身份与关系 `role`、说话方式、示例台词、出没地点 `haunts`、可选立绘 |
| `relations` | 否 | 人物关系：`a`、`b`（主角色、配角或 `me`）、`kind`、`text`；`hiddenUntil` 表示到某个阶段前只能暗示 |
| `acts` | 否 | 分幕：`from`（第几天起）、`title`、`goal`、`beats`（关键事件：`day`、`by`、`who`、`kind`、`text`，可带 `promise` 关键约定）、`hook`（悬念）。写了 `acts` 可以省略 `chapters` |
| `incidents` | 否 | 随机 / 条件事件：`text`、`chance`、`days`、`slots`、`places`、`who`、`need`（某人到某阶段）、`after`（先发生过什么）、`repeat` |

新字段都可以省略，第一版格式的包不改也能跑。

- **只在自己电脑上玩**：照 `packs/_template/pack.json` 写一个 JSON 文件，用 `/gal validate <路径>` 检查格式、`/gal import <路径>` 导入；或者直接放进 `~/.claude/galgame-packs/`，标题页的「剧本」里就会出现。
- **贡献到本仓库**：复制 `packs/_template/` 为 `packs/<你的 id>/`，写好 `pack.ts`、`README.md` 和 `LICENSE`，跑通校验后提 PR。字段写法、写作规范、许可核对清单和 PR 模板见 [CONTRIBUTING.md](CONTRIBUTING.md)，完整示例见 `packs/cicada/pack.ts`。

像素立绘是一张 14 列宽的字母图（`.` 为透明，其余字母在调色板里取色），引擎在眼睛的位置画表情和眨眼，并按 `motion` 加上摇尾巴、扑翅膀、抖耳朵等小动作。

## AI 费用

剧情由 Claude 生成，使用你当前 Claude Code 账号的额度。

- **每一幕**：Sonnet 写 1 次（选项自带后续反应）+ Haiku 检查 1 次一致性；检查不过才带着修改意见重写 1 次。人物再多也不增加调用次数。
- **提示缓存**：前提、文风、所有人的一行摘要、分幕走向和输出格式放在提示第一块并开启缓存，每一幕复用。
- **只放相关的人**：人物（主角色 + 配角）超过 3 个时，每一幕只附上在场、可能出场的人和相关配角的完整设定与关系，其余人只留一行摘要；人少的包（如《停播前》）全部设定照旧放在缓存块里。
- **其他**：信物每人最多 2 个，结局 1 次。
- **自动游玩（可选）**：每个决策约 1 次 Haiku 调用，提示只用状态摘要、不带设定集，单独计数显示在设置页。按幕算约多 2–3 次（选地点、选选项，专一策略开局再问一次想追谁），每幕多不到 0.001 美元；「混乱」策略不调用模型。

| 剧本包 | 幕数 | 大约调用次数 | 大约费用 |
| --- | --- | --- | --- |
| 蝉鸣与晚自习 | 42 | 95–110 | 约 0.7–0.8 美元 |
| 防空洞与江雾音乐节 | 39 | 90–100 | 约 0.7 美元 |
| 停播前的四个夜晚 | 8 | 约 20 | 约 0.15 美元 |

按 Anthropic 公开价目粗算（Sonnet 输入 2 美元 / 百万 token、输出 10 美元，缓存读取 0.2 美元；Haiku 输入 0.1 美元、输出 0.5 美元），以实际账单为准；设置页会显示本局实际的调用次数和 token 数。和上一版相比，调用次数不变；因为旗舰包人物从 3 个增加到 11 个，每幕要带上相关人物的完整设定，每幕不走缓存的输入大约多 2000 token，整局费用约高三成，主要开销仍是输出。

**不会拖慢 Claude Code**：立绘动画每秒 4 帧，只重画立绘那一小块，面板不在屏幕上或关掉动画时就停；台词按键翻句，没有逐字打字的定时器；画面板时不写任何状态。

## 开发

```
claude --plugin-dir <本仓库目录>      # 从源码加载
claude plugin validate <本仓库目录>   # 校验清单、hooks 模块和状态契约
claude plugin test <本仓库目录>       # 运行 tests/：日程、约定、阶段、关键事件、随机事件、配角、关系提示、多结局、时间循环、存档迁移、旧包兼容、导入（模型调用全部 mock）
```

代码结构：`hooks/register.tsx` 界面与状态（含存档迁移），`hooks/engine.ts` 剧情引擎（纯函数与模型调用），`hooks/pack.ts` 剧本包校验与多语言，`hooks/art.ts` 像素渲染，`hooks/i18n.ts` 界面文案，`packs/` 剧本包，`types/index.d.ts` 类型与状态契约。

## 许可与版权

- 引擎代码（`hooks/`、`types/`、`tests/`、`packs/index.ts`）：**MIT**，见 [LICENSE](LICENSE)。
- 每个剧本包使用自己目录里声明的许可，见上表。`packs/mauve` 是 CC BY-SA 4.0，基于它的改编也必须以 CC BY-SA 4.0 发布。
- **请勿把受版权保护的商业作品**（角色、剧情、台词、美术、名称）做成剧本包提交或分发。本仓库只接受原创、CC0、CC BY、CC BY-SA 等允许改编的作品；NC、ND 许可的作品和同人作品不收。导入功能只在你自己的电脑上使用，请只导入你有权使用的内容。

---

## English

**An AI-native visual novel you play inside Claude Code.** Authors write the story's skeleton; the AI writes every scene live. You play with the keyboard only — no typing.

### Install

Requires a recent Claude Code with plugin hooks-module support (developed and tested on 2.1.308). At the Claude Code prompt:

```
/plugin install ai-galgame --marketplace Ephemeral6/ai-galgame
```

Answer `y` to *Add marketplace?* and keep the default user scope. Or from a shell: `claude plugin install ai-galgame --marketplace Ephemeral6/ai-galgame`. Then type **`/gal`** to open the pane. Pixel sprites render in the terminal; the desktop app and VS Code show a text version.

### How it plays

- **Pick where to go, and you pick who you meet.** Each day has a few time slots; every character keeps her own routine, and someone you've neglected may come looking for you. Fixed events lock the location on their day.
- **Acts and key events.** A pack can split its story into acts (setup, turn, climax), each with two or three key events — a twist, a misunderstanding, a secret coming out. When the people involved may be present, the engine tells the AI to write the event into that scene; past its deadline it happens regardless of who is there. Each act ends on a cliffhanger.
- **A supporting cast.** Teachers, deskmates, shopkeepers, coaches: supporting characters can't be romanced but step in to move the plot, and may have their own pixel sprites (two on stage at most). Relations between characters — old friends, rivals, misunderstandings, family — go into the prompt so the routes interweave.
- **Every run differs a little.** Rain, a blackout, exam results, bumping into someone on the old street: random incidents fire by condition and chance. The seed is fixed per run, so undo and reload don't reshuffle them.
- **Every scene is written live** from the story pack, the current relationship stage and your past choices. Choices are *reply*, *observe* (a detail that pays off later) or *promise* (a commitment with a deadline). A promise made during a key event is a *key promise* (★); keeping it can unlock a true ending.
- **Characters remember**, five relationship stages, AI-drawn 8×8 pixel keepsakes, true / good / normal / bad endings per character (true endings may need a key promise kept, keepsakes collected or a second playthrough), New Game+, three save slots plus autosave, undo, an album, settings, and Chinese/English UI. Saves from the previous version are migrated automatically; a save in an unknown format is shown as unreadable instead of breaking the pane.

Keys: `1–9` choose · `J` next · `A` show all · `U` undo · `S` save/load · `P` album · `H` help · `O` autoplay · `E` settings · `T` title · `B` back.

**Autoplay (`O`)**: on the title screen or in game, the AI plays for you — it picks places, who to go with, and choices, showing its reason dimmed ("→ Picked 2: I want to see whether she'll tell her secret"). Lines advance automatically (slow / medium / fast) and it pauses about 2 s on the choices so you can see them. Strategies: Devoted (pursue one character, chosen by you or the AI), Whim (the AI's own curiosity), Collector (new people, places and unlocked endings first, steering toward unseen endings on replays) and Chaos (random, no model calls). To avoid spending unattended, it pauses after 6 scenes by default (3 / 12 / 24 or "end of the day" in settings), stops at an ending or on an error with the reason shown, and any other key pauses it. Autoplayed choices go into the album and notebook as usual, can be undone, and unlock endings normally. Click the pane (or `ctrl+x`, `tab`) to focus it first.

### Bundled packs

Five original packs (CC BY 4.0): *Cicadas & Evening Study* (the flagship: 14 days, 5 romanceable characters, 6 supporting characters, 3 acts with 9 key events, 12 random incidents, 22 endings), *The Shelter Band & the River Fog Festival* (new: a band in a converted air-raid shelter in a foggy southwestern river city, aiming for a summer festival's new-band stage; 13 days, 4 + 5 characters, 18 endings), *Last Train from Birch Ridge*, *Seven Tides* (time loop) and *Four Nights Before Sign-Off* (fourth wall); plus two adaptations, thickened only within the originals' characters and settings: *Bridge to eQualia* (from Blackle Mori's CC0 work) and *Little Mauve Riding Hood* (from *Le Petit Chaperon Mauve*, CC BY-SA 4.0). Adaptations use only the original text and characters; no original art, music, sound or fonts. See each pack's `README.md` for sources and changes.

### Write your own pack

Copy `packs/_template/`, fill in characters (voice, sample lines, secret, five-stage beats, routines, deadline, pixel sprite), places, events and endings. Optional fields: `npcs` (supporting characters), `relations` (with `hiddenUntil` for reveals), `acts` (acts with key `beats`, key `promise`s and `hook`s; `chapters` may then be omitted) and `incidents` (random or conditional events with `chance`, `days`, `slots`, `places`, `who`, `need`, `after`). Characters who aren't love interests (family, rivals, a con man) take `romance: false` plus `meter: { label, full, empty }`: the pane shows e.g. "Trust ●●○" or "Seen through ◆◇" instead of hearts, and the prompt tells the AI not to write romance. Endings can also use `maxAffection`, `minBroken`, `keptKey`, `flags` and `kind`. All new fields are optional; first-version packs run unchanged. Every text field may be `{ "zh": "…", "en": "…" }`. Play it locally with `/gal validate <path>` and `/gal import <path>` (or drop the JSON into `~/.claude/galgame-packs/`), or contribute it via a PR — see [CONTRIBUTING.md](CONTRIBUTING.md).

### AI cost

Each scene is one Sonnet call (choices carry their own reactions) plus one Haiku consistency check, with at most one rewrite, however many characters a pack has. The fixed part (premise, style, a one-line summary of everyone, the act outline, the output format) is prompt-cached; when a pack has more than three characters, each scene carries full notes and relations only for the people present or likely to appear and their related supporting characters. A full 42-scene run of *Cicadas & Evening Study* is about 95–110 calls, roughly US$0.7–0.8 at public list prices (Sonnet $2 / $10 per million input / output tokens, cache reads $0.20; Haiku $0.10 / $0.50); the 8-scene short pack is about 20 calls, about US$0.15. Call counts are unchanged from the previous version; the flagship now has 11 characters instead of 3, so each scene sends about 2,000 more uncached input tokens and a run costs about 30% more, still dominated by output. Autoplay adds about one Haiku call per decision (2–3 per scene, under US$0.001 a scene; none with Chaos), counted separately on the settings page. The settings page shows actual calls and tokens. The sprite animation runs at 4 fps and repaints only the sprite area, and drawing the pane never writes state, so it won't slow Claude Code down.

### License

Engine code is MIT. Each story pack carries its own license (see the table above). Please don't submit or distribute packs built from copyrighted commercial works; only original, CC0, CC BY or CC BY-SA material is accepted (no NC, ND or fan works). Import packs only if you have the right to use them.
