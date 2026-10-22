# 01 开场：README 主动图。目标 ≤20 秒。
# 内容：输入 /gal → 标题画面 → 新的故事 → 第一幕立绘和台词 → 三个选项。
# 结尾一帧停在安装命令上（录完在剪辑里叠字，或用最后的 Type 显示）。

Require claude

Output ../docs/demo.gif
Output ../docs/demo.mp4

Source _settings.tape

# ---- 准备（不录）：启动 Claude Code，等输入框出现 ----
Hide
Type "claude"
Enter
Wait+Screen@30s />/
Sleep 1s
Show

# ---- 打开面板 ----
Type "/gal"
Sleep 400ms
Enter
Sleep 2.5s                      # 标题画面 + 立绘眨眼，留够时间

# 让面板获得焦点（ctrl+x 再按 tab）
Ctrl+X
Tab
Sleep 300ms

# 标题菜单：新的故事（编号按实际菜单调整）
Type "1"
Sleep 1s
# 选剧本包：录英文版时选《防空洞与江雾音乐节》，编号按实际列表调整
Type "1"

# ---- 等模型写第一幕（不录） ----
Hide
Wait+Screen@60s /\[1\]|1 \[/
Show

# 逐句翻台词
Sleep 1.5s
Type "J"
Sleep 1.5s
Type "J"
Sleep 1.5s
Type "A"                        # 显示全部，露出三个选项
Sleep 3s

# 结尾停在选项上，剪辑时叠加安装命令字幕：
# /plugin install ai-galgame --marketplace Ephemeral6/ai-galgame
