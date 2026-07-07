# Changelog

All notable changes to this package are documented here. Versions follow [Semantic Versioning](https://semver.org/).

## [0.12.1]

**Changed**
- `curate-product-context` — after writing `.tap/product.md`, the skill now wires discoverability: it checks CLAUDE.md for a pointer to the artifact and adds a one-line reference if missing (CLAUDE.md is the only auto-loaded file; without the pointer the product context is invisible to agents).

## [0.12.0]

### Dossier publishing pipeline — render-doc + publish

Two new skills form the client side of [Dossier](https://github.com/teambrilliant/dossier), the team's private doc platform at teambrilliant.dev: render markdown deterministically, publish anywhere, pull source + comments back on any machine.

**Added**
- `render-doc` — deterministic md → self-contained HTML (template + vendored marked/mermaid, no LLM-authored markup). Frontmatter header band, TOC, task lists, light/dark/auto theme selector, source md embedded losslessly (JSON, `<`-escaped) and recoverable from the file. Tree mode (`render-tree.ts`): renders a whole docs directory into a linked bundle — README → index + generated Contents section, relative `.md` links rewritten at view time, Obsidian-style `[[wiki-links]]` resolved via a per-bundle map, breadcrumbs on every page.
- `publish` — Dossier client (`DOSSIER_TOKEN`): publish single docs or directory bundles (atlases, rendered trees), republish to the same URL, `pull` source + comments for cross-machine continuity, `comment`, `share`/`unshare` (external links, optional password), `list`, `delete`. Update keys cached locally, auto-recovered by rotation on fresh machines.

## [0.11.0]

### Adopted the two harness meta-skills from dev-skills

`loop-check` and `tighten-loop` now live here, completing the assess×learn / full×focused quadrant with `tap-audit` and `retrospective`. Invoke as `/tap-skills:loop-check` and `/tap-skills:tighten-loop`.

**Added**
- `loop-check` — focused feedback-loop assessment for a single workflow (sibling of `tap-audit`). New **Legibility** element (can the agent perceive the running system — UI, logs, metrics?), plus raised bars: Evaluator must return agent-legible remediation, Grading must be mechanically enforced. Distilled from OpenAI's *Harness Engineering*.
- `tighten-loop` — in-session debrief that harvests course-corrections into durable fixes (sibling of `retrospective`). Now also harvests **agent-struggle** signals, escalates repeat steers from documentation to mechanical enforcement, and keeps context fixes map-not-manual.

**Changed**
- `tap-audit`'s Feedback Loops section now delegates to `loop-check` (single source of truth) instead of duplicating the rubric.

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
