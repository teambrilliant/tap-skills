# tap-skills

The operating system for human+agent dev teams. Enables agents to work autonomously and helps human developers support them effectively.

Two questions TAP answers:
1. How to enable agents to work autonomously in the most effective way
2. How can human developers support AI agents to actually complete the work

## Install

```bash
# Add Team Brilliant marketplace (one-time)
/plugin marketplace add teambrilliant/marketplace

# Install
/plugin install tap-skills@teambrilliant
```

Or install directly from GitHub:

```bash
/plugin install --from github teambrilliant/tap-skills
```

## Skills

| Skill                        | What it does                                                |
| ---------------------------- | ----------------------------------------------------------- |
| `/tap-skills:tap-audit`      | Assess how ready a repo is for autonomous agent work; seeds `.tap/architecture.md` (incl. feature-flag system) |
| `/tap-skills:loop-check`     | Assess what's needed to make one workflow's feedback loop autonomous — focused sibling of tap-audit |
| `/tap-skills:blast-radius`   | Impact analysis of PR changes before merging                |
| `/tap-skills:systems-health` | Measure dev system health via stocks, flows, feedback loops |
| `/tap-skills:retrospective`  | Just-in-time retro focused on improving agent autonomy      |
| `/tap-skills:tighten-loop`   | Harvest this session's course-corrections into durable, repo-portable fixes — in-session sibling of retrospective |
| `/tap-skills:tech-roadmap`   | Build 12-month outcome-based tech roadmap for CEO/board     |
| `/tap-skills:curate-product-context` | Install and maintain `.tap/product.md` — product vision, focus, bets, non-goals |
| `/tap-skills:qa-smoke-catalog` | Explore a web app and build/update the `.tap/smoke-tests.md` release smoke-test catalog |
| `/tap-skills:qa-smoke-run`   | Execute the smoke-test catalog in a browser and report only what's broken |
| `/tap-skills:alignment-atlas` | Generate/maintain alignment-diagram atlases — flow-by-flow grids on one navigable surface (default `.tap/diagrams/atlas/`, or any target dir, e.g. per PARA area) |

## How they work together

```
Agent enters repo
      │
      ▼
  /tap-audit ──────────► assess whole-repo readiness, identify gaps
  /loop-check ─────────► assess a single workflow's feedback loop (focused)
  /qa-smoke-catalog ───► build the release smoke-test catalog
      │
      ▼
  (implement + test using dev-skills)
      │
      ▼
  Agent opens PR
      │
      ▼
  /blast-radius ──► human reviews impact, merges or rejects
      │
      ▼
  /qa-smoke-run ──► execute the smoke catalog against the release
      │
      ▼
  /systems-health ──► measure how the system is performing
      │
      ▼
  /retrospective ──► what to improve so agents need less help next time (event-driven)
  /tighten-loop ───► same, harvested from the current session's steers (in-session)
```

### The harness meta-skills

Four skills read a repo or session and prescribe autonomy improvements, in the same Context/Harness/Feedback/Scope vocabulary:

|              | Full repo        | Single loop / session |
| ------------ | ---------------- | --------------------- |
| **Assess**   | `tap-audit`      | `loop-check`          |
| **Learn**    | `retrospective`  | `tighten-loop`        |

## Project memory

Skills read and write to `.tap/` in the target repo:

```
.tap/
  tap-audit.md      ← repo readiness assessment
  system-health.md  ← latest health metrics
  learnings.md      ← retrospective insights (append-only)
  architecture.md   ← discovered ADRs, design decisions, and feature-flag system
  product.md        ← durable product context: what we build, focus, bets, non-goals
  smoke-tests.md    ← release smoke-test catalog
  qa-runs/          ← smoke-run failure artifacts (only written when a run fails)
  diagrams/atlas/   ← alignment-diagram atlas (self-contained file:// viewer + per-flow map data; default location, can also live per-area, e.g. areas/<x>/diagrams/atlas/)
```

### `.tap/architecture.md` and the feature-flag system

`tap-audit` always captures the repo's **feature-flag system** as a dedicated decision in `.tap/architecture.md` — provider (PostHog / LaunchDarkly / Unleash / Flagsmith / static / DB-driven / env-var / "None — direct deploy only"), where flags are defined and read, and naming conventions.

This is the contract that `dev-skills`'s rollout-primitives reference reads when planning a change: discover from `.tap/architecture.md` first, fall back to grep, ask only if nothing is found. Capturing it once during audit means every downstream plan reads the same answer instead of re-deriving it on each invocation.

If a repo has no flag infra, `.tap/architecture.md` says so explicitly — planners then default to "direct deploy" without spending cycles re-confirming the absence.

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- `gh` CLI (for blast-radius, systems-health, retrospective)
- Chrome DevTools MCP (for qa-smoke-catalog, qa-smoke-run)

## Companion plugin

[`teambrilliant/dev-skills`](https://github.com/teambrilliant/dev-skills) — generic development workflow skills (shaping, grooming, planning, implementing, testing, browser QA). tap-skills is the methodology layer that wraps around them.
