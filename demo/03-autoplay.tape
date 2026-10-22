# 03 自动游玩：按 O，AI 选地点和选项，暗色字显示理由。
# 最有传播力的一段（"让 AI 替你谈恋爱"）。目标 20–30 秒。
# 录之前在设置（E）里：策略选「随心」，节奏选「快」，连跑上限 3 幕，避免录制时花太多额度。
# 模型等待时间会被 Hide 掉，但理由那一行要露出来：每次出现理由后 Show 一段。

Require claude

Output ../docs/autoplay.gif
Output ../docs/autoplay.mp4

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
# 从存档开始（同 02）
Type "2"
Sleep 1s
Type "1"
Sleep 2s
Show

Sleep 1s
Type "O"                        # 开启自动游玩
Sleep 1s

# 第一个决策：选地点，等理由出现
Hide
Wait+Screen@60s /→/
Show
Sleep 3s

# 等这一幕写完、翻句、选项出现、理由出现
Hide
Wait+Screen@90s /→.*[2-9]|→ (Picked|选)/
Show
Sleep 4s

# 再录一个决策
Hide
Wait+Screen@90s /→/
Show
Sleep 4s

Type "O"                        # 停止
Sleep 1.5s
