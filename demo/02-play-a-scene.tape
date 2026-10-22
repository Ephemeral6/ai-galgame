# 02 玩一幕：选地点 → 遇到角色 → 读台词 → 选「答应」→ 好感变化和约定记录。
# 目标 30–45 秒。用于 README「玩法」一节和 B 站视频素材。
# 建议先手动玩到第 2 天，存档到 1 号位，录制时从存档开始，画面更丰富（好感条不是全空）。

Require claude

Output ../docs/play-a-scene.gif
Output ../docs/play-a-scene.mp4

Source _settings.tape

Hide
Type "claude"
Enter
Wait+Screen@30s />/
Type "/gal"
Enter
Sleep 2s
Ctrl+X
Tab
# 标题菜单：继续 / 读档（编号按实际菜单调整），读 1 号存档
Type "2"
Sleep 1s
Type "1"
Sleep 2s
Show

# ---- 选地点 ----
Sleep 2s                        # 停留在地点列表，看清时段和日程
Type "2"                        # 去某个地点

Hide
Wait+Screen@60s /\[1\]|1 \[/    # 等这一幕写完
Show

Sleep 1.5s
Type "J"
Sleep 1.5s
Type "J"
Sleep 1.5s
Type "J"
Sleep 2s

# ---- 选「答应」（第 3 个选项通常是答应，按实际调整）----
Type "3"
Sleep 3s                        # 看好感变化和「约定」提示

# ---- 打开相册看约定和伏笔簿 ----
Type "P"
Sleep 3s
Type "B"
Sleep 1s
