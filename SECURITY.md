# Security policy / 安全策略

## Reporting / 报告漏洞

Please report security problems privately through GitHub: **Security → Report a vulnerability** on this repository. Do not open a public issue for them. We aim to reply within 7 days.

请通过本仓库的 **Security → Report a vulnerability** 私下报告，不要开公开 issue。我们会在 7 天内回复。

## Supported versions / 支持的版本

Only the latest release and `main` get fixes. / 只修复最新发布版和 `main`。

## What counts / 哪些算安全问题

ai-galgame runs inside Claude Code with the permissions of a mod. These are in scope:

- **Story packs.** A pack is data, but its text goes into model prompts. A pack (imported, generated or from `/gal browse`) that makes the engine write files, read files outside its own folders, or reach the network beyond the community index and the pack URLs it lists.
- **`/gal repo`.** It must skip hidden files, dependency and build folders, and files whose names look like secrets, and must show you the file list before reading anything. Any way to make it read a file it should skip.
- **Exports.** `/gal export` and `/gal card` output that runs script or leaks local paths when opened.
- **Coding events and the companion.** These must pass only the kind and outcome of an event (tests passed, build failed, commit made), never code, paths or command output.
- **Saves.** A crafted save or store value that crashes the engine or runs code when loaded.

Out of scope: what the model writes inside a scene (report that as a content bug), cost estimates being off, and problems in Claude Code itself (report those to Anthropic).

模型写出的剧情内容、费用估算偏差、Claude Code 本身的问题不在此列：前者按内容 bug 报，后者报给 Anthropic。
