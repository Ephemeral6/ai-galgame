# Changelog

All notable changes to this project are listed here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/). Story packs carry their own change lists in `packs/<id>/README.md`.

## [Unreleased]

### Added
- CI on every pull request: `claude plugin validate .` and `claude plugin test .` on Linux and Windows.
- `SECURITY.md`, `CODE_OF_CONDUCT.md`, a feature-request issue form and this changelog.
- `tools/sim/beam.ts` and `tools/sim/sim.ts`: check without a model whether every ending of a pack can be reached. `beam.ts <pack>:craft` does the same for every set piece and reveal, and exits 1 when a target is not found.
- Reachability workflow: beam search over all seven packs on pack and engine changes, weekly and by hand.
- Stage backdrops for seven kinds of place that follow time of day and weather; a title card with the cast on grass; one house shape per kind of place on the map; ending-card particles by ending kind; a night-road loading screen; faces in the relationship web.
- A "terminal background" setting (auto / dark / light).
- equalia, mauve and radio get a fuller writing layer: new hand-written set pieces, reveals, flashbacks, running gags, gossip and day-by-day texture.
- snow and loop get the same: loop's seventh night and night market now have hand-written scenes; snow gets five new set pieces and the missing content of the tape Yanqiu made of Old Han.
- A test that every place-bound key beat's last chance actually takes the player to its place.

### Changed
- `LICENSE` is the plain MIT text so GitHub detects it; which folders it covers moved to `NOTICE`.
- A promise counts as kept only when she is on stage and you pick the option that keeps it; fixed scenes no longer keep promises by themselves. A promise made on the last day can now expire.
- Ensemble endings check promises too; on a tie in the same tier the ensemble ending wins.
- All colours come from one theme file. Nameplate text is picked for its background (worst contrast 2.06:1 → 8.37:1), status colours follow Claude Code's theme, and every pixel block carries its own dark screen so it stays visible on light terminals.
- Choices are chips instead of boxes, the header is two lines, only the newest line gets a solid nameplate, the DAY card is 7 rows instead of 12, and menus use tab chips and divider lines.

### Fixed
- Key beats and set pieces respect their time slot and place; a slot-limited beat missed on its last day counts as overdue.
- Every ending of every bundled pack can now be reached (several in band, mauve, radio, equalia, snow, loop and cicada could not). Ending texts agree with the fixed scenes, secrets no longer leak before their reveal, timelines are consistent. Details in `docs/PLOT-AUDIT-2026-10-23.md`.
- Set pieces and reveals that could never fire: radio's roof scene, mauve's verdict scene and salesman reveal, cicada's two confession scenes.
- Pixel drawing no longer writes outside its canvas at narrow widths.
- A promise made on the last day has a deadline and can be broken; one made in the very last scene, which nothing could keep, is not recorded. The "keep" choice the engine adds now has a reaction instead of a bare "…". An overdue beat with a key promise is no longer folded into another scene as an aside, where no promise choice is offered.
- The pane scrolls to its end as new lines, the choices and the aftermath appear, so a long scene in a short terminal no longer leaves the choices out of reach.
- snow's boiler-room beat and equalia's microfilm beat had their last chance taken by a fixed scene, so a player who missed them lost the beat (and in snow the key promise for Donghe's true ending).
- Beats on fixed-scene days are now limited to the fixed scene's slot, so climaxes no longer fire in the morning somewhere else.
- snow and loop: English names now match throughout; character notes and relations no longer state secrets before their stage.

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
