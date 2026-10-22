# 贡献指南 / Contributing

欢迎贡献剧本包和引擎改进。剧本包是这个项目的主要贡献方式：你写骨架，AI 写每一幕。

*English summary at the end.*

## 一、写一个剧本包

1. 复制 `packs/_template/` 为 `packs/<你的包 id>/`（id 小写字母开头，只用 `a-z 0-9 - _`）。
2. 改 `pack.ts`：把每个 `TODO` 换成你的内容，把常量名 `TEMPLATE` 改成你的包名（如 `MY_PACK`）。字段说明见 README 的「剧本包格式」，完整写法参考 `packs/cicada/pack.ts`。
3. 在 `packs/index.ts` 里 import 并加进 `BUILTIN`。
4. 写 `packs/<id>/README.md`（标题、作者、许可、简介；改编作品写出处与改动）和 `packs/<id>/LICENSE`（许可全文）。
5. 跑校验与测试（见第四节）。

只想自己玩、不提交？写成 JSON（结构同 `packs/_template/pack.json`），用 `/gal validate <路径>` 检查、`/gal import <路径>` 导入，或放进 `~/.claude/galgame-packs/`。

### 写作规范

- **骨架要具体**：每人的说话方式要分得开，给 3 句示例台词；秘密要具体到一件事；5 个阶段节拍要有画面（地点、动作、一句关键的话），不写「关系更近了」这种空话。
- **时间压力**：每个角色一个截止日，加上日历事件和 1–3 个固定事件，让「去哪里」有取舍。
- **结局**：每个可攻略角色最好有真、好、普通、坏四种（至少一个高 tier 结局），外加一个无条件的兜底结局。`brief` 写清结局走向，AI 会照着写。
- **文风与禁忌写进 `style`**：比如年代、地域的生活质感，不想出现的元素。致敬包在 `notes` 里写清致敬的题材类型，**不点名具体作品**，角色、剧情、台词、名称全部原创。
- **立绘**：方块像素小动物或抽象形象，14 列宽、4–12 行，3–6 种颜色；不画人脸，不画背景。每个角色一个主色（`#rrggbb`），在深色和浅色终端上都要看得清。
- **篇幅与成本**：每个「天 × 时段」是一幕，约 2 次模型调用。短篇（3–5 天 × 2 时段）约 20 次调用，长篇（14 天 × 3 时段）约 100 次。门槛 `gates` 按篇幅调：短篇用 0/2/4/6/8、单独相处 0/1/2/3/4。

### 配角、关系、分幕、随机事件（都可省略）

第一版格式的包没有这些字段也照常能玩；写上它们，故事会更有起伏。完整写法见 `packs/_template/pack.ts` 和 `packs/cicada/pack.ts`。

- **`npcs` 配角**（0–8 人）：`id`、`name`、`color`、`role`（身份，以及和「我」、主角色的关系；也是他不在场时提示里的一行摘要）、`voice`、`samples`（3 句以上），可选 `short`、`look`、`haunts`（时段 → 地点，玩家去那里时会写进提示）、`sprite`（有立绘才会上台；同框最多 2 人，主角色和配角一起算）。配角没有好感和阶段，AI 写的好感变化只记在主角色身上。配角的 `id` 不能和主角色重复。
- **`relations` 关系**：`a`、`b` 是主角色、配角的 id 或 `me`，`kind` 一个词（旧友、情敌、兄妹、误会），`text` 写具体发生过什么。要当作秘密慢慢揭开的，加 `hiddenUntil: 3`：a 或 b 到阶段 3 之前 AI 只能暗示。
- **`acts` 分幕**：每幕 `id`、`from`（第几天起，第一幕从 1 开始，升序）、`title`、`goal`（这一幕的走向）、`beats`、可选 `hook`（这一幕结束时给玩家的悬念）。写了 `acts` 可以省略 `chapters`，章节名取幕名。
  - **关键事件 `beats`**：`id`、`day`（最早哪天）、`by`（最晚哪天，默认 day+1）、`who`（涉及谁；这些人可能在场时才写，不填表示任何一幕都行）、`kind`（转折、误会、秘密曝光……）、`text`（必须发生的事，写具体）。到了 `by` 那天的最后一个时段，不论谁在场都会写。
  - **关键约定 `promise`**：写在 beat 上，表示这一幕要给出这样一个「答应」选项。玩家答应后约定记在 beat 涉及的主角色名下，结局用 `keptKey: '<beat id>'` 要求兑现它。
- **`incidents` 随机事件**：`id`、`text`、`chance`（每个符合条件的时段的概率，默认 0.25）、可选 `days: [起, 止]`、`slots`、`places`（只在去这些地点时发生；不填则整个时段都算，日程页会显示）、`who`（会带出谁）、`need: { who, minStage, minAffection }`、`after: ['beat:<id>', 'inc:<id>']`、`repeat`（默认一局只发生一次）。每个时段最多一个事件；概率用每局固定的种子算，回退、读档不变。建议整局粗算下来触发 6–10 次，别每个时段都有事。
- **结局的新条件**：`maxAffection`、`minBroken`（坏结局常用：到过「心事」阶段且失约过）、`keptKey`、`flags`（要求某个关键事件或随机事件发生过）、`kind: 'true' | 'good' | 'normal' | 'bad'`（相册显示用）。按 tier 从高到低取第一个满足条件的结局，同 tier 比好感；建议真 4、好 3、普通 2、坏 1、兜底 0，群像结局放 2 以免被坏结局盖掉。
- **`tagline`**（主角色可选）：她不在这一幕时提示里只放这一行，不填就用 `look`。
- **人多时只放相关的人**：主角色加配角超过 3 人时，每一幕的提示只附上在场、可能出场的人和相关配角的完整设定，其余人用 `tagline` / `role` 一行带过。所以 `tagline` 和 `role` 要写得能单独看懂。

### 多语言字段

- 任何文本字段都可以写成字符串（默认语言），或 `{ "zh": "…", "en": "…" }`。
- `defaultLang` 是回落语言：玩家选的语言缺失时显示它。`langs` 只列你**写全了**的语言。
- 翻译请自己写，不要照搬受版权保护的现有译本。
- 引擎界面文字在 `hooks/i18n.ts`；新增语言要同时加界面语言表、`Lang` 类型和 `tr()` 的回落顺序。

## 二、许可核对清单（提交前逐条确认）

- [ ] 内容是**原创**，或原作许可是 **CC0、CC BY、CC BY-SA** 或其他明确允许演绎的许可。
- [ ] **不收**：NC（非商业）、ND（禁止演绎）许可的作品；同人作品（原作 IP 不归作者）；只有「免费」「开源」标签但没有许可原文的作品；受版权保护的商业作品。
- [ ] 已打开许可原文页面核对，确认许可覆盖**剧本/文本**（不只是代码或美术），并在 PR 里附上许可原文链接和核对日期。
- [ ] 只取原作的文本与人物设定；**不使用原作的美术、音乐、音效、字体**。
- [ ] `source` 字段写全：`work`、`author`、`license`、`adaptation`（改了什么）、`url`；许可要求署名时写 `notice`，标题页会显示它。
- [ ] CC BY-SA 的改编包整体按 CC BY-SA 发布，放在自己的目录并附许可全文；不要把它的文字搬进其他目录。
- [ ] 不暗示原作者为改编版背书；不涉及真实人物的隐私。
- [ ] 本包目录有 `README.md` 和 `LICENSE`。原创包推荐 CC BY 4.0。

## 三、引擎贡献

- 状态（`$.state`）的读写集中在 `hooks/register.tsx`；剧情逻辑写成 `hooks/engine.ts` 里的纯函数，并配测试。
- 画面板（`ui.render`）时不许写状态，只能读；按钮的回调里可以写。状态或存档格式变了，要在 `engine.ts` 的 `normalizeStory` 里补默认值，迁移只在 `command.run` 和 `session.start` 里做（`register.tsx` 的 `migrate`）；读到认不出的格式要降级显示，不能报错。
- 性能约束：不用定时器重绘整个面板；动画只用 `$.ui.blit` 重画立绘那块 Raster，≤ 5 帧/秒；不做逐字打字机。
- 成本约束：每幕最多 1 次写作调用 + 1 次检查调用（不过才重写 1 次）；固定内容放在提示第一块并打缓存标记；人多时每幕只放相关的人。改动调用次数或提示长度请同步更新 README 的估算。

## 四、校验与测试

```
claude plugin validate .        # 清单、hooks 模块、状态契约
claude plugin test .            # 全部测试；其中会校验所有内置包和空白模板
```

在游戏里：`/gal validate <路径.json>` 校验一个 JSON 剧本包。类型检查用插件类型文件头部给出的 tsconfig，`include` 加上 `hooks`、`types`、`tests`、`packs`。

## 五、PR 模板

```markdown
## 内容
- [ ] 新剧本包：`packs/<id>`  - [ ] 引擎改动  - [ ] 文档

## 剧本包信息
- 标题 / id / 天数 × 时段 / 角色数 / 语言：
- 类型：原创 / 致敬（题材类型：） / 改编
- 改编作品：原作标题、作者、链接：
- 许可原文链接与核对日期：
- 本包许可：

## 许可核对清单
（把第二节的清单粘贴到这里并逐条勾选）

## 测试
- [ ] `claude plugin validate .` 通过
- [ ] `claude plugin test .` 通过
- [ ] 实际玩过至少一天，截图或描述：
```

---

## English summary

**Write a story pack**: copy `packs/_template/` to `packs/<your-id>/`, replace every `TODO`, rename the exported constant, register it in `packs/index.ts`, and add `README.md` and `LICENSE` in the pack folder. For personal use only, write the same structure as JSON and use `/gal validate <path>` / `/gal import <path>` or drop it into `~/.claude/galgame-packs/`.

**Writing guidelines**: distinct voices with three sample lines each; concrete secrets; vivid five-stage beats; one deadline per character plus calendar and fixed events; at least one high-tier ending per romanceable character and one unconditional fallback ending. Homage packs describe the genre in `notes` without naming specific works, and all characters, plot, lines and names must be original. Sprites are blocky pixel animals or abstract shapes, 14 columns wide, 4–12 rows, no faces, no backgrounds.

**Optional fields** (first-version packs run without them): `npcs` — supporting characters (0–8) with `role`, `voice`, ≥3 `samples`, optional `haunts` and `sprite`; no affection, ids distinct from the cast. `relations` — `a`/`b` (cast, npc or `me`), `kind`, `text`, optional `hiddenUntil` (hints only until that stage). `acts` — `from`, `title`, `goal`, `beats` (`day`, `by`, `who`, `kind`, `text`, optional key `promise`, which endings require via `keptKey`), optional `hook`; with acts, `chapters` may be omitted. `incidents` — `text`, `chance` (default 0.25), `days`, `slots`, `places`, `who`, `need`, `after`, `repeat`; at most one per slot, seeded per run so undo and reload don't change them; aim for roughly 6–10 per run. New ending conditions: `maxAffection`, `minBroken`, `keptKey`, `flags`, plus `kind` for the album; suggested tiers are true 4, good 3, normal 2, bad 1, fallback 0, ensemble 2. With more than three characters, each scene's prompt carries full notes only for the people relevant to it and a one-line `tagline` / `role` for the rest, so write those to stand on their own.

**Multilingual fields**: any text is a string or `{ "zh": …, "en": … }`; `defaultLang` is the fallback; `langs` lists only complete languages; write your own translations.

**License checklist**: accept only original work or works under CC0, CC BY, CC BY-SA or another license that clearly allows derivatives and covers the script text. No NC, no ND, no fan works, no commercial copyrighted works. Link the license text and the date you checked it in the PR. Use the text and characters only — never the original art, music, sound or fonts. Fill `source` completely (and `notice` when attribution is required). CC BY-SA adaptations stay CC BY-SA in their own folder with the full license.

**Engine**: keep `$.state` access in `hooks/register.tsx` and game logic as pure, tested functions in `hooks/engine.ts`. Never write state while drawing the pane (`ui.render`); migrate state and saves only in `command.run` and `session.start` (via `normalizeStory`), and show an unknown save format as unreadable instead of failing. Keep the performance limits (blit-only sprite animation ≤ 5 fps, no typewriter timers) and the cost limits (≤ 1 writer + 1 checker call per scene, one rewrite at most, cached fixed prompt block).

**Checks**: `claude plugin validate .` and `claude plugin test .` must pass.
