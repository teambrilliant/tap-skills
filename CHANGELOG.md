# Changelog

All notable changes to this package are documented here. Versions follow [Semantic Versioning](https://semver.org/).

## [0.17.0]

### Vision lands in `.tap/product.md`; `tech-roadmap` retired

**Removed**
- **`tech-roadmap` skill removed.** It was built for a single purpose — helping assemble a board/budget roadmap — and never became part of the loop. Its Step 3 also carried a defect: it claimed `.tap/product.md` held the product vision and reconstructed a "3-10 year vision" out of `What we build` (present tense) plus `Current focus` (this quarter). That's a status report wearing a vision's name. Removing the skill removes the fiction; the Vision section below removes the gap. Also dropped: the README row and `curate-product-context`'s handoff recommending it on a focus shift.

**Added**
- **`curate-product-context` — new Vision section**, first in the file, making the artifact six sections instead of five. 1-2 sentences on how the customer's world differs 3-10 years out. Three things keep it from becoming filler: a **cathedral test** run on every draft (is this a cathedral or a wall? could a competitor sign it unchanged? does it name a changed world or a changed company?), `not yet articulated` as an explicit valid value, and **confirm-not-churn** handling in review/refresh — a vision rewritten every quarter was never a vision, so a change is surfaced as a pivot and asked about rather than silently accepted.
- **Current focus now traces upward** — one question after the focus is captured: does it move toward the Vision? "No" is allowed and often correct (survival work, table stakes), but it gets named. Unremarked "no"s accumulating is the condition this file exists to make visible.
- **Bet test** — bets were the least-scrutinized content in the file and the most load-bearing: Audience and Non-goals each get a three-check Principle loop, Vision now gets the cathedral test, while bets were captured from a single prompt and accepted as given — and `/dev-skills:shaping-work` checks every shaped feature against them. Four checks now run per bet: *could this be wrong?* (a direction can't be — "improve onboarding" vs "users who hit the checklist activate at 2×"), *what kills it?* (no kill condition = a commitment wearing a bet's clothes, and it absorbs budget indefinitely), *does it follow from the insight or did you already want to build it?* (the reverse-justified feature is the common failure — test by asking what the insight predicts if you'd never thought of the feature), *what does being wrong cost?* (expensive → it's an experiment, route to `/dev-skills:product-discovery` before it enters the file). Explicitly refuses the escape hatch: don't soften a bet into a direction to make it pass check 1.
- **Kill conditions are now part of the format** — `Each: [what we're trying + why we think it'll work] — kill: [what we'd have to see to stop]`. A test that shapes the artifact beats one that gets asked and evaporates.
- **`How we win`** — one line under `What we build`: the structural advantage, not a feature. Pushed once if the answer is a feature ("could a competitor ship that next quarter?"); `no structural advantage yet — competing on execution` is valid, common, and decision-changing (it means speed matters more than moats this year). Deliberately not a new section — the file's value is compression.
- **Review mode: bets resolve, they don't accumulate** — each existing bet is asked `paid off / killed / still open?`. Twice "still open" across reviews means either no kill signal or nobody watching; say which. Bets are the only section where the right answer is often deletion.

**Changed**
- Section renumbering throughout `curate-product-context` (Principle lines now on sections 3 and 6), format spec, example, `tap-audit`'s Strategic Context description, README, and the CLAUDE.md discoverability index line — all now name vision.

**Internal**
- Synced `package.json` (was 0.13.0) to `.claude-plugin/plugin.json`. CHANGELOG entries for 0.14.0–0.16.0 were never written; their commits are in `git log`.

## [0.13.0]

### Rename: `publish` → `dossier-publish`; discoverability wiring everywhere

**Changed**
- **`publish` renamed to `dossier-publish`** — bare "publish" was ambiguous at invocation time (npm? blog? git?). Invoke as `/tap-skills:dossier-publish`; description now carries a scope guard. All cross-references updated (render-doc, README, dev-skills handoffs, Dossier's agent-handoff prompt).
- **Every artifact-writing skill now wires discoverability**: after writing its `.tap/` artifact, the skill ensures the repo's CLAUDE.md carries a single growing `.tap/` context-index line naming the artifacts that exist (CLAUDE.md is the only auto-loaded file — an unreferenced artifact is invisible to agents). Applied to `tap-audit` (tap-audit.md + architecture.md), `systems-health`, `tech-roadmap`, `qa-smoke-catalog`, `retrospective` (learnings.md — carved a one-line exception into its no-CLAUDE.md-edits boundary), `alignment-atlas` (atlas path, incl. per-area), and `curate-product-context` (converted from the 0.12.1 per-file pointer to the shared index line). `qa-smoke-run` deliberately skipped: its `qa-runs/` output is ephemeral run evidence, not durable context.

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
