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
- **结局**：每个可攻略角色至少一个高 tier 结局，外加一个无条件的兜底结局。`brief` 写清结局走向，AI 会照着写。
- **文风与禁忌写进 `style`**：比如年代、地域的生活质感，不想出现的元素。致敬包在 `notes` 里写清致敬的题材类型，**不点名具体作品**，角色、剧情、台词、名称全部原创。
- **立绘**：方块像素小动物或抽象形象，14 列宽、4–12 行，3–6 种颜色；不画人脸，不画背景。每个角色一个主色（`#rrggbb`），在深色和浅色终端上都要看得清。
- **篇幅与成本**：每个「天 × 时段」是一幕，约 2 次模型调用。短篇（3–5 天 × 2 时段）约 20 次调用，长篇（14 天 × 3 时段）约 100 次。门槛 `gates` 按篇幅调：短篇用 0/2/4/6/8、单独相处 0/1/2/3/4。

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
- 性能约束：不用定时器重绘整个面板；动画只用 `$.ui.blit` 重画立绘那块 Raster，≤ 5 帧/秒；不做逐字打字机。
- 成本约束：每幕最多 1 次写作调用 + 1 次检查调用（不过才重写 1 次）；固定内容放在提示第一块并打缓存标记。改动调用次数请同步更新 README 的估算。

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

**Multilingual fields**: any text is a string or `{ "zh": …, "en": … }`; `defaultLang` is the fallback; `langs` lists only complete languages; write your own translations.

**License checklist**: accept only original work or works under CC0, CC BY, CC BY-SA or another license that clearly allows derivatives and covers the script text. No NC, no ND, no fan works, no commercial copyrighted works. Link the license text and the date you checked it in the PR. Use the text and characters only — never the original art, music, sound or fonts. Fill `source` completely (and `notice` when attribution is required). CC BY-SA adaptations stay CC BY-SA in their own folder with the full license.

**Engine**: keep `$.state` access in `hooks/register.tsx` and game logic as pure, tested functions in `hooks/engine.ts`. Keep the performance limits (blit-only sprite animation ≤ 5 fps, no typewriter timers) and the cost limits (≤ 1 writer + 1 checker call per scene, one rewrite at most, cached fixed prompt block).

**Checks**: `claude plugin validate .` and `claude plugin test .` must pass.
