# 04 一句话生成剧本包：用 /gal new 让 AI 写一个完整的剧本包，状态栏显示进度，完成后出现在剧本列表里。
# 目标 30–40 秒（生成要 3–5 分钟，用 Hide 跳过，只露出开头的进度和最后的列表）。
# 在一个空目录里录；不要录进真实项目代码。

Require claude

Output ../docs/write-a-pack.gif
Output ../docs/write-a-pack.mp4

Source _settings.tape

Hide
Type "claude"
Enter
Wait+Screen@30s />/
Show

# ---- 一句话需求 ----
Type "/gal new two nurses on the last night shift before a small-town hospital closes --days 4 --cast 2"
Sleep 500ms
Enter
Sleep 3s                        # 状态栏：正在构思大纲…（1/3）

Hide
Wait+Screen@600s /Generated|已生成/
Show
Sleep 2s

# ---- 打开面板，看新剧本出现在列表里 ----
Type "/gal"
Enter
Sleep 2s
Ctrl+X
Tab
Type "1"                        # 新的故事 → 剧本列表
Sleep 3s
