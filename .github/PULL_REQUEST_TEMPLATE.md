<!-- 中英任选。Either language is fine. -->

## What this PR does / 改了什么

<!-- One or two sentences. Link the issue: "Closes #123". / 一两句话，关联 issue。 -->

## Type / 类型

- [ ] Story pack / 剧本包
- [ ] Engine / 引擎（hooks/、types/）
- [ ] UI text or translation / 界面文案或翻译
- [ ] Docs / 文档
- [ ] Tests / 测试

## For story packs / 剧本包填写

- Pack id / 包 id:
- Submission issue / 投稿 issue: #
- Origin / 来源: original / CC0 / CC BY / CC BY-SA adaptation
- License text URL and date checked / 许可原文链接与核对日期:
- Size / 规模: days x slots, cast, endings
- Endings reached in playtest / 试玩打出的结局:

### License checklist / 许可核对

- [ ] Original, or source is CC0 / CC BY / CC BY-SA and I read the license text / 原创，或原作为 CC0、CC BY、CC BY-SA 且已核对原文
- [ ] License covers the story text / 许可覆盖剧本文本
- [ ] Not a fan work; no material from copyrighted commercial works / 非同人，不含商业作品内容
- [ ] No source art, music, sound or fonts / 不含原作美术、音乐、音效、字体
- [ ] `source` field complete; `README.md` and `LICENSE` in the pack directory / source 写全，目录有 README 与 LICENSE
- [ ] Ages of main characters stated in the pack README; no sexual content involving anyone under 18 / 包 README 写明主要角色年龄；无涉及未成年人的性内容

## Checks / 校验

- [ ] `claude plugin validate .` passes / 通过
- [ ] `claude plugin test .` passes / 通过
- [ ] (packs) `/gal validate` passes and the pack is added to `packs/index.ts` / 剧本包已校验并加入 index
- [ ] (UI) Checked in a narrow terminal and in the text fallback (desktop app or VS Code) / 窄终端和文字版下检查过
- [ ] (engine) Old saves still load / 旧存档仍能读取
- [ ] Model calls per scene unchanged, or the cost change is explained below / 每幕调用次数不变，或在下面说明费用变化

## Screenshots / 截图

<!-- For UI or pack changes. / 界面或剧本包改动请附截图。 -->
