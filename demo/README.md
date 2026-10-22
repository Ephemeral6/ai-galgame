# 演示录屏脚本

| 文件 | 内容 | 用途 | 目标时长 |
| --- | --- | --- | --- |
| `01-opening.tape` | `/gal` → 标题 → 第一幕 → 三个选项 | README 主动图、X 第一条、V2EX | ≤20 秒 |
| `02-play-a-scene.tape` | 选地点 → 台词 → 选「答应」→ 相册里的约定 | README「玩法」、B 站 | 30–45 秒 |
| `03-autoplay.tape` | 按 O，AI 选择并显示理由 | README 第二张图、X 第二条、小红书 | 20–30 秒 |
| `04-write-a-pack.tape` | `/gal new` 一句话生成剧本包 → 状态栏进度 → 出现在列表 | CONTRIBUTING、投稿活动帖 | 30–40 秒 |
| `_settings.tape` | 公共尺寸、字体、主题 | 被上面四个 `Source` | — |

这些脚本没有实际跑过（本机没装 vhs），菜单编号、等待用的正则要在第一次录时按实际画面调整。

## 需要的工具

- **vhs**（[charmbracelet/vhs](https://github.com/charmbracelet/vhs)）：Windows 用 `winget install charmbracelet.vhs` 或 `scoop install vhs`；macOS `brew install vhs`。依赖 **ttyd** 和 **ffmpeg**，都要在 PATH 里。
- **Claude Code** 已登录，版本 ≥2.1.287，已装好 ai-galgame。
- 字体 **JetBrains Mono**（或改 `_settings.tape` 里的 `FontFamily`，要等宽且能显示 `▄▀█♥♡◆` 这些字符）。
- 在 Windows 上 vhs 的 `Set Shell` 可以改成 `pwsh` 或 `cmd`；ttyd 在 Windows 上的兼容性不如 macOS / Linux，录不顺就用 WSL 或 Docker：`docker run --rm -v $PWD:/vhs ghcr.io/charmbracelet/vhs 01-opening.tape`（Docker 里要另装并登录 Claude Code，麻烦，优先用 macOS / Linux 机器）。

## 终端尺寸与主题

- 1200×720 像素、字号 16，约 120 列。面板要 110 列以上才会出现在对话右侧，再窄就会占满当前视图，录出来像另一个产品。
- 主题用 `Catppuccin Mocha`（深色，立绘颜色对比好）。另录一版浅色（`Set Theme "Catppuccin Latte"`）用于小红书封面，检查立绘在浅色背景下是否看得清。`vhs themes` 列出所有主题。
- GitHub README 里 GIF 宽度显示约 800 像素，1200 宽录制后缩放仍清晰。GIF 超过 10MB 加载慢，超了就降 `Framerate` 到 20，或改用 mp4（GitHub README 支持直接拖入 mp4）。

## 录制步骤

1. 先手动玩一局，到第 2 天存到 1 号存档位，好感条不全是空的，画面更好看（02、03 从这个存档开始）。
2. 在设置（`E`）里：语言选要录的语言；自动游玩策略「随心」、节奏「快」、上限 3 幕。
3. 英文版录《The Shelter Band & the River Fog Festival》（主角 18 岁，理由见 LAUNCH-PLAN.md 风险一节）；中文版可以录《蝉鸣与晚自习》或《防空洞》。
4. `cd` 到本目录，运行 `vhs 01-opening.tape`，输出在 `../docs/`。
5. 看一遍：等待模型的时间是否都被 `Hide` 掉；最后一帧是否停在有信息的画面上。
6. 03 的价值在于"理由"那一行，确认它在 GIF 里停留够 3 秒以上能读完。

## 为什么用 Hide / Wait

每一幕要等模型几秒到十几秒。脚本里在等待前 `Hide`、用 `Wait+Screen@60s /正则/` 等画面出现特定内容后 `Show`，观众看不到等待。如果 `Wait` 的正则匹配不到，vhs 会超时报错，按实际画面改正则（比如匹配选项的编号格式或 `→`）。

## 备选：asciinema + agg

手动玩一局比写脚本更自然时：
```
asciinema rec game.cast        # 手动玩，Ctrl+D 结束
agg game.cast game.gif         # 转 GIF；用 agg 的空闲时间上限参数压掉等待
```
agg 支持换主题、字号、播放速度和空闲时间上限，参数名见 [agg 文档](https://docs.asciinema.org/manual/agg/)。也可以把 `.cast` 上传 asciinema.org 嵌入 README（可复制文字，但 GitHub 里不能直接播放，要用 GIF 预览图链接过去）。

terminalizer 也能录并转 GIF（需要 Node 环境），本项目用 vhs 的脚本化录制更方便重录，优先 vhs。

## 不要录进去的东西

- 账号邮箱、组织名、用量面板里的余额。
- 真实项目代码（04 在一个空目录里录）。
- 任何商业作品的名字或截图。
