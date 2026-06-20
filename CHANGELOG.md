# Changelog

All notable changes to this package are documented here. Versions follow [Semantic Versioning](https://semver.org/).

## [0.10.0]

### alignment-atlas — hardening + opt-in cockpit layout

Backward compatible: every atlas embeds its own frozen copy of `renderer.html`, so existing atlases are unaffected. New config keys are all optional with behavior-preserving defaults.

**Fixed**
- Scaffolded atlases shipped literal `__ATLAS_TITLE__` / `__ATLAS_META__` placeholders in the header. The header (title + meta) is now computed at runtime from `window.ATLAS`, so there is no placeholder to forget.

**Added**
- Opt-in cockpit layout: `home.stripPosition:"top"` renders the off-grid strip above the grid; `home.stripAlign:"grid"` aligns strip cards under the grid columns (coverage home only).
- Per-map `lov:false` suppresses the line-of-visibility row for non-flow reference grids.
- Second example layer preset (`offer`: get/pay/risk/proof) plus a non-flow example map, demonstrating multiple layer types per atlas.
- Console warning when a map is placed in more than one home cell (the tile renders once per cell — no colspan).
- `## Patterns` section in SKILL.md documenting the premise-first cockpit layout; capability notes in atlas-spec.md.

**Changed**
- Strip cards no longer stretch to fill a wide window — capped at 260–320px, left-aligned and wrapping.
- Documentation traps surfaced in verification: force a full document reload (not a hash change) after edits, grep for residual placeholders, and the one-cell-per-placement rule.

**Internal**
- Synced `package.json` (was 0.8.0) and `.claude-plugin/plugin.json` (was 0.9.0) to a single version.

## [0.9.0]

- Added `alignment-atlas` skill — navigable alignment-diagram atlases rendered as a self-contained `file://` SPA.
- Added Pi package manifest.

## [0.8.0]

- Version alignment (0.7.0 was taken by the qa-smoke skills).

## [0.7.0]

- Added `qa-smoke-catalog` and `qa-smoke-run` skills.
- `tap-audit`: capture feature-flag system in `.tap/architecture.md`.

## [0.6.0]

- Added `curate-product-context` skill.

## [0.5.0]

- `tap-audit`: active discovery heuristics for manual workflows.

## [0.4.0]

- `tap-audit`: feedback-loop assessment + Audit View signature; discover manual workflows, not just agent ones.

## [0.3.0]

- Added `tech-roadmap` skill.

## [0.2.0]

- Applied Ousterhout design principles across all tap skills.

## [0.1.0]

- Initial skill set: repo readiness, blast radius, system health, retrospectives.
