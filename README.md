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
| `R` | 关系图 |
| `E` | 设置（分页：`Z` 显示、`X` 自动、`C` AI 功能、`V` 费用、`N` 工作陪伴；自动游玩时进设置不会打断） |
| `X` / `M` / `C` | 结局页和相册里：导出 HTML / 导出 Markdown / 分享文字 |
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
- **画面**：像素字体的开场标题卡、每天的「DAY n」卡和结局卡，用淡入、擦入过渡；立绘上方有一条氛围带（雨、雪、萤火、蝉鸣的声波、灯笼、流星、星点、薄雾），主题色随天气和时段变化（黄昏暖橙、雨夜冷蓝），边框和名字色调跟着变；角色会冒情绪气泡（！？♪…💢汗滴♥）、入场退场、一步步走近、害羞时背过身去；说话人有名牌，最新一句加粗；选项是带图标和色条的卡片；选地点时有一张像素小镇地图，开放的地点亮着、标着按键数字、下面是可能遇见的人；`R` 打开人物关系网，刚变过的好感会闪。动画不超过每秒 4 帧，只重画变了的那几块，面板不在屏幕上就停，设置里可以全部关掉。
- **AI 导演**：每一幕由写剧情的那一次 Sonnet 调用顺带给出天气、时段、氛围粒子、镜头特写的物件、哪句话之后留白，以及上面那些演出指令，引擎来执行，不额外调用。
- **AI 原生的部分（普通 galgame 做不到）**：
  - **跨周目记忆**：二周目起，上一局的回忆摘要化作「回声」，角色会隐约觉得见过你（「我们……是不是在哪见过？」）。
  - **现实时间**：真实时间离开超过 6 小时再回来，她会发来一条消息，说说你不在的时候；每过完一天，小镇里配角之间的八卦和幕后小事会写进下一天（相册里也能翻到）。
  - **她的日记和视角**：关系到「心事」后，在相册里读她对同一天的记录，常常会重新解读你以为的剧情。打开时才写，写完存进存档。
  - **你在她眼里**：每个选项都带着态度（坦诚、逃避、玩笑、承诺、体贴、冲动），累计成你的画像；角色会据此回应你（「你总是这样，一到关键时候就开玩笑」）。相册里能看倾向条，也能听她说一段。
  - **「顺其自然」**：选项下面多一张卡，交给 AI 按你一贯的样子替你选，和自动游玩共用同一套决策。
- **边等边玩**：Claude 开始干活时面板提示「趁现在玩一幕？」；它写完或在等你批准权限时，游戏（包括自动游玩）自动暂停并提醒你。设置里可以关。
- **写代码的事件进入剧情**（默认关）：Bash 里的测试通过或失败、构建失败、`git commit` 成功，会作为事件写进下一幕，在场的人替你高兴或安慰你；commit 还会变成一件信物。只用命令的种类和成败，提示里不放代码、路径、输出。
- **陪伴模式**（默认关）：选一位角色常驻状态栏，测试失败时安慰、通过时高兴、连续工作两小时提醒休息、Claude 写完时叫你。每小时最多 2 句，用预写台词，不调用模型。
- **省额度**：写剧情可以改用 Haiku；可以设每日预算（美元，按 token 估算），到了就不再调用模型；头部显示本局和今日花费。「短幕」模式每幕旁白 1–2 句、台词 2–4 句，适合等编译的空档。
- **成就与每日挑战**：首个真结局、全结局、不回退通关、收集全部信物等成就，以及通关次数、总幕数、累计花费；每日挑战以日期为种子，同一天所有人玩同一个剧本、同一个随机种子，看谁拿到真结局，结束后给一行可以贴出去的战绩。
- **声音与可读性**（默认关）：朗读台词（系统语音），选项、翻页、结局、提醒的短音效（插件自带的合成波形；目前只有 macOS 能播放）；窄终端自动紧凑排版，可选色盲友好配色（Okabe–Ito 色板，图标也各不相同）。
- **自己做剧本包、导出、社区**：`/gal new <一句话想法>` 让 AI 生成一个完整的剧本包（约 3–5 分钟，状态栏显示进度，`K` 取消）；`/gal repo` 从当前项目的 README 和清单文件生成（先列出要读的文件等你确认，不读源码、隐藏文件和密钥）；`/gal export [html|md]` 把这一局导出成带像素图的网页或 Markdown，`/gal share` 给一段分享文字；`/gal browse` 浏览社区剧本（只收原创、CC0、CC BY、CC BY-SA），一键安装。
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
- **AI 导演与选项态度**：在同一次 Sonnet 输出里，每幕多约 80–120 个输出 token（约 0.001 美元），不额外调用。
- **AI 原生机制**（都用 Haiku，都能在设置 · AI 功能里逐项关掉）：

| 功能 | 什么时候调用 | 次数 | 每次约 |
| --- | --- | --- | --- |
| 跨周目回声、你的选择倾向 | 写进每一幕的提示 | 0 | — |
| 夜里的小镇八卦 | 每过完一天 | 1 次 / 天 | 0.0003 美元 |
| 离开很久后她的消息 | 真实时间离开 6 小时以上回来 | 最多 1 次 / 次 | 0.0003 美元 |
| 她的日记 | 你在相册里点开某一天时 | 1 次 / 篇（缓存） | 0.0004 美元 |
| 你在她眼里 | 你在相册里点开时 | 1 次 / 人（缓存） | 0.0003 美元 |
| 顺其自然 | 你按下这张卡时 | 1 次 | 0.0002 美元 |

  旗舰包一局 14 天，默认开着的八卦约 13 次，合计约 0.004 美元。陪伴模式、边等边玩、写代码事件、成就、导出、社区都不调用模型。
- **一句话生成剧本包**（`/gal new`、`/gal repo`）：2–4 次 Sonnet 调用，约 0.15–0.45 美元、3–5 分钟一个；只在你主动发起时才有。
- **省额度**：写剧情改用 Haiku 后，每幕约 0.002 美元（Sonnet 时约 0.016–0.02 美元），文笔会弱一些；每日预算到了就不再调用模型。

| 剧本包 | 幕数 | 大约调用次数 | 大约费用 |
| --- | --- | --- | --- |
| 蝉鸣与晚自习 | 42 | 95–110（另有约 13 次 Haiku 八卦） | 约 0.75–0.85 美元 |
| 防空洞与江雾音乐节 | 39 | 90–100（另有约 12 次 Haiku 八卦） | 约 0.75 美元 |
| 停播前的四个夜晚 | 8 | 约 20 | 约 0.15 美元 |

按 Anthropic 公开价目粗算（Sonnet 输入 2 美元 / 百万 token、输出 10 美元，缓存读取 0.2 美元；Haiku 输入 0.1 美元、输出 0.5 美元），以实际账单为准；设置页会显示本局实际的调用次数和 token 数。和上一版相比，调用次数不变；因为旗舰包人物从 3 个增加到 11 个，每幕要带上相关人物的完整设定，每幕不走缓存的输入大约多 2000 token，整局费用约高三成，主要开销仍是输出。

**不会拖慢 Claude Code**：动画（立绘、氛围带、标题卡、关系图）每秒 4 帧，只重画变了的那几块，面板不在屏幕上或关掉动画时就停；台词按键翻句，没有逐字打字的定时器；画面板时不写任何状态；自动游玩用一步一步的单次定时器排程。

## 开发

```
claude --plugin-dir <本仓库目录>      # 从源码加载
claude plugin validate <本仓库目录>   # 校验清单、hooks 模块和状态契约
claude plugin test <本仓库目录>       # 运行 tests/：日程、约定、阶段、关键事件、随机事件、配角、关系提示、多结局、时间循环、存档迁移、旧包兼容、导入（模型调用全部 mock）
```

代码结构：`hooks/register.tsx` 界面与状态（含存档迁移、自动游玩排程、边等边玩、后台任务），`hooks/engine.ts` 剧情引擎（纯函数与模型调用），`hooks/fx.ts` 画面效果（像素字体、标题卡、氛围带、演出、地图、关系网），`hooks/art.ts` 像素立绘，`hooks/pilot.ts` 自动游玩与「顺其自然」的决策，`hooks/native.ts` AI 原生机制（消息、八卦、日记、画像），`hooks/work.ts` 写代码事件与陪伴台词，`hooks/cost.ts` 花费估算，`hooks/feats.ts` 成就与每日挑战，`hooks/gen.ts` 生成剧本包，`hooks/share.ts` 导出，`hooks/browse.ts` 社区，`hooks/pack.ts` 剧本包校验与多语言，`hooks/i18n.ts` 界面文案，`assets/sfx/` 音效，`community/` 社区索引，`packs/` 剧本包，`types/index.d.ts` 类型与状态契约。

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

Keys: `1–9` choose · `J` next · `A` show all · `U` undo · `S` save/load · `P` album · `R` relationships · `H` help · `O` autoplay · `E` settings (tabs `Z` display, `X` autoplay, `C` AI features, `V` cost, `N` work companion) · `X`/`M`/`C` export HTML / Markdown / share text (ending and album) · `T` title · `B` back.

**Looks**: pixel-font title, day and ending cards with fade and wipe transitions; an ambient strip above the sprites (rain, snow, fireflies, cicada sound waves, lanterns, meteors, stars, mist) whose theme color follows weather and time of day (warm orange at dusk, cold blue on rainy nights) and tints borders and names; emote bubbles, entrances and exits, stepping closer, turning away when shy; name plates and choice cards with icons and color bars; a pixel town map when picking a place (open places lit, numbered, with dots for who might be there); and a relationship web (`R`) where a line that just changed flashes. Animation stays at 4 fps, repaints only what changed, stops when the pane is hidden, and can be turned off.

**AI director**: the same Sonnet call that writes a scene also sets weather, time, ambient particles, a close-up object, a silent beat and stage directions; the engine performs them. No extra calls.

**AI-native mechanics**: echoes of your previous playthrough (characters half-remember you); a message from her when you come back after more than 6 real hours, and nightly offstage gossip between supporting characters; her diary — her side of the same day, written when you open it and then cached; "you, in her eyes", built from the attitude (`tone`) of every choice you make, which characters call out; and a fourth card, "Let it be", where the AI chooses the way you usually would.

**Play while you wait**: when Claude starts working the pane suggests a scene; when it finishes or needs your approval, the game (and autoplay) pauses and tells you. **Coding events** (off by default): passing or failing tests, a broken build or a `git commit` become story events — only the kind and outcome, never code, paths or output; a commit becomes a keepsake. **Companion** (off by default): one character in the status line comforts, cheers and reminds you to rest after two hours, at most twice an hour, from a pre-written library (no calls). **Budget**: write scenes with Haiku, set a daily budget, and see run and today's cost in the header; **short scenes** fit a build break. **Achievements and a daily challenge** (same pack and seed for everyone that day). **Voice and sound** (off by default), compact layout for narrow terminals and a colorblind-friendly palette. **Make, export, share**: `/gal new <idea>` generates a whole pack (3–5 min, progress in the status line, `K` cancels), `/gal repo` makes one from this project's README and manifests after showing you exactly which files it will read, `/gal export [html|md]` and `/gal share` export a run, and `/gal browse` installs community packs (original, CC0, CC BY, CC BY-SA only).

**Autoplay (`O`)**: on the title screen or in game, the AI plays for you — it picks places, who to go with, and choices, showing its reason dimmed ("→ Picked 2: I want to see whether she'll tell her secret"). Lines advance automatically (slow / medium / fast) and it pauses about 2 s on the choices so you can see them. Strategies: Devoted (pursue one character, chosen by you or the AI), Whim (the AI's own curiosity), Collector (new people, places and unlocked endings first, steering toward unseen endings on replays) and Chaos (random, no model calls). To avoid spending unattended, it pauses after 6 scenes by default (3 / 12 / 24 or "end of the day" in settings), stops at an ending or on an error with the reason shown, and any other key pauses it. Autoplayed choices go into the album and notebook as usual, can be undone, and unlock endings normally. Click the pane (or `ctrl+x`, `tab`) to focus it first.

### Bundled packs

Five original packs (CC BY 4.0): *Cicadas & Evening Study* (the flagship: 14 days, 5 romanceable characters, 6 supporting characters, 3 acts with 9 key events, 12 random incidents, 22 endings), *The Shelter Band & the River Fog Festival* (new: a band in a converted air-raid shelter in a foggy southwestern river city, aiming for a summer festival's new-band stage; 13 days, 4 + 5 characters, 18 endings), *Last Train from Birch Ridge*, *Seven Tides* (time loop) and *Four Nights Before Sign-Off* (fourth wall); plus two adaptations, thickened only within the originals' characters and settings: *Bridge to eQualia* (from Blackle Mori's CC0 work) and *Little Mauve Riding Hood* (from *Le Petit Chaperon Mauve*, CC BY-SA 4.0). Adaptations use only the original text and characters; no original art, music, sound or fonts. See each pack's `README.md` for sources and changes.

### Write your own pack

Copy `packs/_template/`, fill in characters (voice, sample lines, secret, five-stage beats, routines, deadline, pixel sprite), places, events and endings. Optional fields: `npcs` (supporting characters), `relations` (with `hiddenUntil` for reveals), `acts` (acts with key `beats`, key `promise`s and `hook`s; `chapters` may then be omitted) and `incidents` (random or conditional events with `chance`, `days`, `slots`, `places`, `who`, `need`, `after`). Characters who aren't love interests (family, rivals, a con man) take `romance: false` plus `meter: { label, full, empty }`: the pane shows e.g. "Trust ●●○" or "Seen through ◆◇" instead of hearts, and the prompt tells the AI not to write romance. Endings can also use `maxAffection`, `minBroken`, `keptKey`, `flags` and `kind`. All new fields are optional; first-version packs run unchanged. Every text field may be `{ "zh": "…", "en": "…" }`. Play it locally with `/gal validate <path>` and `/gal import <path>` (or drop the JSON into `~/.claude/galgame-packs/`), or contribute it via a PR — see [CONTRIBUTING.md](CONTRIBUTING.md).

### AI cost

Each scene is one Sonnet call (choices carry their own reactions) plus one Haiku consistency check, with at most one rewrite, however many characters a pack has. The fixed part (premise, style, a one-line summary of everyone, the act outline, the output format) is prompt-cached; when a pack has more than three characters, each scene carries full notes and relations only for the people present or likely to appear and their related supporting characters. A full 42-scene run of *Cicadas & Evening Study* is about 95–110 calls, roughly US$0.75–0.85 at public list prices including stage directions and nightly gossip (Sonnet $2 / $10 per million input / output tokens, cache reads $0.20; Haiku $0.10 / $0.50); the 8-scene short pack is about 20 calls, about US$0.15. Call counts are unchanged from the previous version; the flagship now has 11 characters instead of 3, so each scene sends about 2,000 more uncached input tokens and a run costs about 30% more, still dominated by output. Autoplay adds about one Haiku call per decision (2–3 per scene, under US$0.001 a scene; none with Chaos), counted separately on the settings page. Stage directions and choice tones ride in the same Sonnet output (about 100 more output tokens, ~US$0.001 a scene). AI-native extras are Haiku and each can be switched off: nightly gossip once per story day (~US$0.0003), the away message at most once per return, diary entries and "in her eyes" only when you open them (then cached), "Let it be" once per use; echoes and tendencies cost nothing. A 14-day flagship run with default settings adds about US$0.004. Generating a pack with `/gal new` or `/gal repo` is 2–4 Sonnet calls (~US$0.15–0.45) and only happens when you ask. With Haiku as the story model a scene costs about US$0.002 instead of ~US$0.016–0.02. The settings page shows actual calls, tokens and estimated cost. Animation runs at 4 fps and repaints only what changed, and drawing the pane never writes state, so it won't slow Claude Code down.

### License

Engine code is MIT. Each story pack carries its own license (see the table above). Please don't submit or distribute packs built from copyrighted commercial works; only original, CC0, CC BY or CC BY-SA material is accepted (no NC, ND or fan works). Import packs only if you have the right to use them.
