# ai-galgame

**在 Claude Code 里玩的 AI 原生视觉小说。** 人写故事骨架，AI 现场写每一幕；你只用键盘做选择，不用打字。

[English](#english) · [安装](#安装) · [玩法](#玩法) · [剧本包](#随附剧本包) · [写自己的剧本包](#写自己的剧本包) · [费用](#ai-费用) · [许可](#许可与版权)

```
╭─ 蝉鸣与晚自习 ─────────────────────────── 第一章 · 转学 ─╮
│ 第 3 天 · 放学   ▪▪◉▫▫▫◆▫▫◆▫◆◆◆                          │
│ 小满 ♥♥♡♡♡  清漪 ♥♡♡♡♡  知遥 ♥♥♥♡♡                       │
╰──────────────────────────────────────────────────────────╯
            ▄▄      ▄▄
           █▀▀██████▀▀█        （像素小动物立绘，会眨眼、会动）
           █ ▌      ▐ █
小满「诶——你也太慢了吧！天文社的门我都替你开好了！」
 1 [回话] 帮她擦镜片
 2 [观察] 看看桌上的星图
 3 [答应] 明天放学还来
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
| `T` | 回到标题 · `B` 返回 |

先点一下面板（或 `ctrl+x` 再按 `tab`）让它获得焦点，按键才会生效。

**一局是怎样的**

- **选地点，决定遇见谁。** 每天分几个时段，你选去哪里。每个角色有自己的日常行踪，冷落太久的人会主动来找你。比赛、灯会、清晨的车站这类固定事件会锁定当天的地点。
- **每一幕都是 AI 现写的。** 旁白、台词和三个选项都按剧本包的设定、人物当前的关系阶段和你之前的选择生成。选项分三种：回话、观察（换来一个细节，之后会被回收）、答应（记成约定）。
- **她记得你做过什么。** 你的选择和观察记进伏笔簿，后面的剧情会提起；答应过的事有期限，做到了加分，没做到会伤人；每一幕确立的事实记进事实表，之后的剧情不许矛盾。
- **关系分五个阶段**（陌生 → 熟悉 → 心事 → 秘密 → 抉择，名字由剧本包定），好感和相处次数都够了才会推进。到后两个阶段时，AI 会画一件 8×8 像素的信物收进图鉴。
- **多结局。** 按阶段、好感、约定和信物选出结局，AI 写一段回收你们真实经历的终章。解锁的结局和通关次数跨周目保存，通关后可以开二周目。
- **完整的游戏外壳**：标题画面、继续 / 读档、3 个存档位加自动存档、回退、相册、设置（语言、立绘动画、逐句 / 整段显示）、操作说明。
- **中英双语**：标题页切换语言，界面和 AI 写的剧情都会跟着换。

## 随附剧本包

| 剧本包 | 题材 | 规模 | 许可 |
| --- | --- | --- | --- |
| **蝉鸣与晚自习** Cicadas & Evening Study | 原创：江南小镇县城中学，暑假前的十四天 | 14 天 × 3 时段，3 名角色 | CC BY 4.0 |
| **白桦岭的最后一班车** Last Train from Birch Ridge | 原创：雪国小镇、青梅竹马与离别 | 10 天 | CC BY 4.0 |
| **潮信七日** Seven Tides | 原创：时间循环，记忆保留、最多重来 2 次 | 7 天 | CC BY 4.0 |
| **停播前的四个夜晚** Four Nights Before Sign-Off | 原创短篇：打破第四面墙，有二周目专属结局 | 4 天，1 名角色 | CC BY 4.0 |
| **Bridge to eQualia**（改编） | 改编自 Blackle Mori 的同名作品 | 7 天，4 名角色 | CC0 1.0 |
| **Little Mauve Riding Hood**（改编） | 改编自 bosinpai 等人的 *Le Petit Chaperon Mauve* | 4 天 | CC BY-SA 4.0 |

原创包借的是题材类型的结构和氛围，角色、剧情、台词、名字全部原创。两部改编只用了原作的文本和人物设定，没有用原作的美术、音乐、音效和字体；所有立绘都是本项目自己画的方块像素小动物。每个剧本包的出处、许可原文和改动清单见各自目录下的 `README.md`。

## 写自己的剧本包

剧本包定义一个故事的骨架：人物（说话方式、示例台词、秘密、五个阶段的剧情节拍、日常行踪、截止日、像素立绘）、地点、日历事件、固定事件和结局条件。所有文本字段都可以写成 `{ "zh": "…", "en": "…" }`。

- **只在自己电脑上玩**：照 `packs/_template/pack.json` 写一个 JSON 文件，用 `/gal validate <路径>` 检查格式、`/gal import <路径>` 导入；或者直接放进 `~/.claude/galgame-packs/`，标题页的「剧本」里就会出现。
- **贡献到本仓库**：复制 `packs/_template/` 为 `packs/<你的 id>/`，写好 `pack.ts`、`README.md` 和 `LICENSE`，跑通校验后提 PR。完整的字段说明、写作规范、许可核对清单和 PR 模板见 [CONTRIBUTING.md](CONTRIBUTING.md)，完整示例见 `packs/cicada/pack.ts`。

像素立绘是一张 14 列宽的字母图（`.` 为透明，其余字母在调色板里取色），引擎在眼睛的位置画表情和眨眼，并按 `motion` 加上摇尾巴、扑翅膀、抖耳朵等小动作。

## AI 费用

剧情由 Claude 生成，使用你当前 Claude Code 账号的额度。

- **每一幕**：Sonnet 写 1 次（选项自带后续反应）+ Haiku 检查 1 次一致性；检查不过才带着修改意见重写 1 次。
- **提示缓存**：剧本包里不变的设定放在提示开头并开启缓存，后面每一幕都复用。
- **其他**：信物每人最多 2 个，结局 1 次。

| 剧本包 | 幕数 | 大约调用次数 | 大约费用 |
| --- | --- | --- | --- |
| 蝉鸣与晚自习 | 42 | 95–105 | 约 1 美元 |
| 停播前的四个夜晚 | 8 | 约 20 | 约 0.2 美元 |

按 Anthropic 公开价目粗算，以实际账单为准；设置页会显示本局实际的调用次数和 token 数。

**不会拖慢 Claude Code**：立绘动画每秒 4 帧，只重画立绘那一小块，面板不在屏幕上或关掉动画时就停；台词按键翻句，没有逐字打字的定时器。

## 开发

```
claude --plugin-dir <本仓库目录>      # 从源码加载
claude plugin validate <本仓库目录>   # 校验清单、hooks 模块和状态契约
claude plugin test <本仓库目录>       # 运行 tests/：日程、约定、阶段、时间循环、结局、存档/回退、信物、剧本包校验、导入（模型调用全部 mock）
```

代码结构：`hooks/register.tsx` 界面与状态，`hooks/engine.ts` 剧情引擎（纯函数），`hooks/pack.ts` 剧本包校验与多语言，`hooks/art.ts` 像素渲染，`hooks/i18n.ts` 界面文案，`packs/` 剧本包，`types/index.d.ts` 类型与状态契约。

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
- **Every scene is written live** from the story pack, the current relationship stage and your past choices. Choices are *reply*, *observe* (a detail that pays off later) or *promise* (a commitment with a deadline).
- **Characters remember.** Choices and observations go into a foreshadowing log that later scenes call back; promises are kept or broken; a fact sheet keeps the story consistent.
- **Five relationship stages**, AI-drawn 8×8 pixel keepsakes, multiple endings written from what actually happened, New Game+, three save slots plus autosave, undo, an album, settings, and Chinese/English UI.

Keys: `1–9` choose · `J` next · `A` show all · `U` undo · `S` save/load · `P` album · `H` help · `T` title · `B` back. Click the pane (or `ctrl+x`, `tab`) to focus it first.

### Bundled packs

Four original packs (CC BY 4.0) — *Cicadas & Evening Study*, *Last Train from Birch Ridge*, *Seven Tides* (time loop), *Four Nights Before Sign-Off* (fourth wall) — plus two adaptations: *Bridge to eQualia* (from Blackle Mori's CC0 work) and *Little Mauve Riding Hood* (from *Le Petit Chaperon Mauve*, CC BY-SA 4.0). Adaptations use only the original text and characters; no original art, music, sound or fonts. See each pack's `README.md` for sources and changes.

### Write your own pack

Copy `packs/_template/`, fill in characters (voice, sample lines, secret, five-stage beats, routines, deadline, pixel sprite), places, events and endings. Every text field may be `{ "zh": "…", "en": "…" }`. Play it locally with `/gal validate <path>` and `/gal import <path>` (or drop the JSON into `~/.claude/galgame-packs/`), or contribute it via a PR — see [CONTRIBUTING.md](CONTRIBUTING.md).

### AI cost

Each scene is one Sonnet call (choices carry their own reactions) plus one Haiku consistency check, with at most one rewrite; the fixed pack text is prompt-cached. A full 42-scene run of *Cicadas & Evening Study* is about 95–105 calls, roughly US$1 at public list prices; the 8-scene short pack is about 20 calls. The settings page shows actual calls and tokens. The sprite animation runs at 4 fps and repaints only the sprite area, so it won't slow Claude Code down.

### License

Engine code is MIT. Each story pack carries its own license (see the table above). Please don't submit or distribute packs built from copyrighted commercial works; only original, CC0, CC BY or CC BY-SA material is accepted (no NC, ND or fan works). Import packs only if you have the right to use them.
