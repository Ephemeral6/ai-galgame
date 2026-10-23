# Changelog

All notable changes to this project are listed here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/). Story packs carry their own change lists in `packs/<id>/README.md`.

## [Unreleased]

### Added
- CI on every pull request: `claude plugin validate .` and `claude plugin test .` on Linux and Windows.
- `SECURITY.md`, `CODE_OF_CONDUCT.md`, a feature-request issue form and this changelog.

### Changed
- `LICENSE` is the plain MIT text so GitHub detects it; which folders it covers moved to `NOTICE`.

## [0.4.0] - 2026-10-23

First public release.

### Added
- **Autoplay** (`O`): the AI plays with four strategies, three speeds, visible reasoning and a spend cap.
- **Play while Claude works**: the game pauses and pings you when Claude finishes or needs approval.
- **Visuals**: pixel title, day and ending cards, weather particles, emote bubbles, stage movement, town map, relationship graph.
- **AI-native mechanics**: echoes of the previous run, messages while you're away, her diary, "you in her eyes", nightly gossip, a "Let it be" choice.
- **Pack tools**: `/gal new <idea>`, `/gal repo`, `/gal export`, `/gal card`, `/gal browse`.
- **Story depth**: supporting casts, relations, acts, incidents, routes, reveals and hand-written set pieces; seven bundled packs, including the new *The Shelter Band & the River Fog Festival*.
- Budget mode, achievements, a daily challenge, voice and sound effects (off by default), compact and colour-blind themes.

[Unreleased]: https://github.com/Ephemeral6/ai-galgame/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/Ephemeral6/ai-galgame/releases/tag/v0.4.0
