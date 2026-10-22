# 社区剧本 / Community packs

游戏里的「社区剧本」列表读的是本目录的 `index.json`。任何人都可以投稿：把剧本包 JSON 放到一个 https 地址，在 `index.json` 里加一条，提 Pull Request。

The in-game community list reads `index.json` in this folder. To submit a pack, host its JSON at an https URL, add one entry to `index.json`, and open a pull request. English summary at the end.

## 投稿步骤

1. 写好剧本包。从 `packs/_template/pack.json` 开始，或用游戏里的「一句话生成」再手改。剧本包是纯 JSON 数据，不能含代码。
2. 本地验证：把 JSON 放进剧本目录或用 `/gal import` 导入，确认能开局、能走到至少一个结局。
3. 选一个 https 地址放 JSON：
   - 放进本仓库：提交到 `community/packs/<id>.json`，地址写 `https://raw.githubusercontent.com/Ephemeral6/ai-galgame/main/community/packs/<id>.json`；
   - 或放在你自己的仓库、Gist 等，地址写它的 raw 链接。
4. 在 `index.json` 的 `packs` 数组末尾加一条（字段见下），提 PR。PR 描述里写清许可和是否改编。

## 索引条目格式

```json
{
  "id": "my-pack",
  "title": { "zh": "标题", "en": "Title" },
  "author": "你的名字或网名",
  "license": "CC-BY-4.0",
  "lang": ["zh", "en"],
  "summary": { "zh": "一句话简介", "en": "One-line summary" },
  "url": "https://raw.githubusercontent.com/<you>/<repo>/main/my-pack.json",
  "version": "1.0.0"
}
```

| 字段 | 要求 |
| --- | --- |
| `id` | 小写字母开头，只用 `a-z 0-9 - _`，最长 32；必须与剧本包里的 `id` 一致，且不与已有条目和内置包重名 |
| `title`、`summary` | 文本，或 `{ "zh": "...", "en": "..." }` |
| `author` | 必填 |
| `license` | 只接受下面白名单里的许可 |
| `lang` | `"zh"`、`"en"` 或两者的数组；写剧本包真正提供了完整文本的语言 |
| `url` | 必须是 https；指向剧本包 JSON，不超过 1 MB |
| `version`、`homepage` | 可选；`homepage` 也必须是 https，游戏里只显示、不自动打开 |

## 许可要求

只接受以下许可，其他（包括 CC BY-NC、CC BY-ND、未写许可、「保留所有权利」、MIT 等软件许可）一律不收录，游戏也会拒绝下载：

| `license` 写法 | 含义 |
| --- | --- |
| `original` | 原创，作者同意按本仓库的方式分发（建议直接写成 CC 许可，更清楚） |
| `CC0-1.0` | 放弃所有权利 |
| `CC-BY-4.0` | 署名 |
| `CC-BY-SA-4.0` | 署名—相同方式共享 |

游戏也认 `CC BY 4.0`、`CC0 1.0` 这类写法，但索引里请用上表的写法。

改编作品另有要求：

- 剧本包的 `source` 必须写清原作、原作者、原作许可、改编了什么（`work`、`author`、`license`、`adaptation`，有要求时加 `notice`）；
- 原作许可本身也必须在白名单里；改编 CC BY-SA 的作品，剧本包也必须以 `CC-BY-SA-4.0` 发布；
- 改编作品不能标成 `original`；
- 只拿到作者私下授权、没有公开许可的改编，请不要投稿到公共索引。

## 审核清单（维护者合并前逐条确认）

- [ ] 在游戏里下载能通过校验（`fetchPack` 不报错），并能开局、走到至少一个结局
- [ ] `id` 与剧本包一致，不与已有条目、内置包重名
- [ ] 许可在白名单内；改编作品的 `source` 完整，原作许可也在白名单，SA 许可链条正确
- [ ] 原创：人物、名字、设定没有照搬或模仿现有作品（书、游戏、动画、影视）；致敬只保留题材与氛围
- [ ] 没有露骨性内容、血腥细节、仇恨内容；不涉及真实人物
- [ ] 未成年角色（含设定为学生的角色）不是恋爱对象：`romance: false`，提示与结局里没有恋爱、暧昧描写
- [ ] 文本里没有链接、联系方式、广告、个人信息、密钥或本机路径
- [ ] 声明的 `lang` 与包里实际提供的语言一致
- [ ] JSON 不超过 1 MB，地址是 https 且可公开访问

不符合的 PR 会请作者修改；已收录的条目如果后来发现问题，会从索引里移除。

## English summary

- Add one entry to `packs` in `index.json` (fields above) pointing to your pack JSON at an https URL (max 1 MB). The entry `id` must equal the pack's `id`.
- Accepted licenses only: `original`, `CC0-1.0`, `CC-BY-4.0`, `CC-BY-SA-4.0`. NC/ND, unlicensed, "all rights reserved" and software licenses are rejected by the game.
- Adaptations must fill in `source` (work, author, license, adaptation), the source license must itself be on the list, adaptations of CC BY-SA works must be CC BY-SA, and an adaptation is never `original`.
- Review checklist: loads and validates in game and reaches an ending; original characters and names (no imitation of existing works); no explicit content, gore, hate or real people; minors are never romance routes; no links, contact details, personal data, keys or local paths in the text; declared languages are complete.

## 维护：自带包的社区版

`community/packs/*.json` 是仓库内置包（`packs/<id>/pack.ts`）导出的 JSON，许可见各包目录下的 `LICENSE`。内置包改动后需要重新导出，以免社区版与内置版不一致。
