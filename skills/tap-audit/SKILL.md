---
name: tap-audit
description: Assess how ready a repository is for autonomous agent work. Use when someone says "audit this repo", "tap audit", "how ready is this codebase", "assess this project", or when an agent enters an unfamiliar codebase and needs to understand it before working. Scans documentation, MCP servers, CLI tools, permissions, test infrastructure, environments, and process to produce a readiness assessment with actionable leverage points. Outputs to .tap/tap-audit.md.
---

# TAP Audit

Assess how autonomous an agent can be in this repo right now. Produce a structured assessment at `.tap/tap-audit.md`.

This skill does NOT describe coding conventions — that's CLAUDE.md's job. This skill assesses the system: what's configured, what's missing, what's slowing delivery or letting bugs through.

## Process

0. Check existing audit
1. Scan the repo
2. Assess each dimension
3. Score readiness
4. Identify leverage points
5. Write `.tap/tap-audit.md`
6. Seed `.tap/architecture.md`
7. Present findings (human) or proceed to task (agent)

### 0. Check Existing Audit

If `.tap/tap-audit.md` exists, read it before doing anything else.

1. Parse `Last run:` date from the file.
2. Run `git log --oneline --since="[date]"` to count commits since last audit.
3. Check if key config files changed since that date: `git diff --name-only HEAD@{[date]} -- .claude/ .mcp.json package.json .github/workflows/ CLAUDE.md`

**Decision tree:**

| Condition | Action |
|-----------|--------|
| `--force` flag | Full re-run (skip to step 1) |
| <30 days old, no key config changes | **Summary mode**: print score + top leverage points + audit age. Say "Audit is current ([N] days). Use `--force` to re-scan." **STOP.** |
| <30 days old, key config changed | **Delta mode**: re-assess only affected dimensions. Update `.tap/tap-audit.md` in-place with new `Last run:` date. Skip unchanged sections. |
| >=30 days old, significant repo activity (many commits, new contributors) | Recommend full re-run. Ask before proceeding. |
| >=30 days old, low activity (few commits, same contributors) | **Summary mode**: the audit is likely still accurate. Print score + leverage points. Say "Audit is [N] days old but repo activity is low. Use `--force` to re-scan." **STOP.** |
| Date missing or unparseable | Full re-run (skip to step 1) |

The audit file IS the cache. Don't re-scan what hasn't changed.

### 1. Scan the Repo

Read these files/locations (skip any that don't exist):

```
.claude/settings.json         → permissions
.claude/settings.local.json   → local overrides
.mcp.json                     → MCP servers configured
CLAUDE.md                     → coding instructions quality
AGENTS.md                     → agent-specific boundaries
package.json / Cargo.toml / go.mod / requirements.txt → stack + scripts
tsconfig.json / biome.json / .eslintrc → tooling config
.github/workflows/            → CI/CD setup
.tap/                         → existing project memory
vercel.json / fly.toml / Dockerfile / render.yaml → deploy config
```

Run (if tools available):
- `git log --oneline -20` → recent activity
- `git shortlog -sn --no-merges --since="90 days ago"` → contributors
- `gh run list --limit 5` → recent CI runs
- Test runner dry-run to discover test count

### 2. Assess Each Dimension

#### Environments

Discover all available environments with URLs. Check package.json scripts, deploy configs, CI workflows, CLAUDE.md, README.

```
- Local:      [command] → [url]
- Preview:    [url pattern or "not configured"]
- Staging:    [url or "not configured"]
- Production: [url or "not configured"]
```

#### Agent Harness Readiness

Assess six areas. Mark ✓ (available) or ✗ (missing/incomplete) for each item.

**Documentation**
- CLAUDE.md: exists? covers stack, conventions, run/test/deploy commands?
- AGENTS.md: exists? defines scope boundaries, escalation rules?
- ADRs: any architectural decisions documented?

**MCP Servers** (from .mcp.json)
- List each configured server and what it enables
- Flag missing ones based on stack (e.g., using Postgres but no DB MCP; web app but no chrome-devtools)

**Skills**
- What skills are available?
- What's missing for this stack? (e.g., Neon skill for Neon Postgres, Temporal skill for Temporal)

**CLI Tools**
- Verify: package manager, test runner, linter, build tool, deploy tool, DB CLI, infra CLI
- Flag tools the stack requires but agent can't access

**Permissions** (from .claude/settings.json + settings.local.json)
- What's explicitly allowed and denied?
- What's missing that blocks autonomous work?

**Test Infrastructure**
- Test count and coverage if discoverable
- Types present: unit, integration, acceptance, e2e, browser
- Can the agent verify its own work?

#### Readiness Score

- **FULL**: Agent can implement, test (unit + browser), access DB, verify end-to-end. CLAUDE.md comprehensive. All necessary MCP servers and CLIs configured.
- **PARTIAL**: Agent can implement and run some tests. Missing some integrations. CLAUDE.md exists but has gaps.
- **MINIMAL**: Agent can read/write code but can't run tests, no MCP servers, thin or missing CLAUDE.md.

#### Design Complexity

Quick spot check on how hard this codebase is to modify. Sample the 5-10 most-changed files recently (`git log --name-only --since="30 days ago"`) — these are what agents will touch most.

For each sampled file, check:
- **File size** — proxy for module depth. Large files doing too much = hard to understand, easy to break
- **Import fanout** — proxy for coupling. Many imports = many dependencies = change amplification risk
- **Layer structure** — pass-through wrappers, thin abstractions that add interface cost without hiding complexity
- **Consistency** — do similar things follow similar patterns, or does each file invent its own approach

Rate overall: **Easy** / **Moderate** / **Hard** to modify.
- **Easy**: small focused modules, low coupling, consistent patterns
- **Moderate**: some large files or high coupling, but patterns are clear
- **Hard**: god files, high coupling, inconsistent patterns, pass-through layers

Specific design smells found flow into Approach Gaps as actionable items.

#### Feedback Loops

Identify the **top 3 workflows** an agent will perform most in this repo (e.g., implement feature, fix bug, generate assets, deploy, migrate data). For each, assess:

| Element | What to look for |
|---------|-----------------|
| **Generator** | Can the agent produce the output? (code, assets, config) |
| **Evaluator** | Can something *other than the generator* verify the output? (tests, lint, visual regression, Playwright, type checker) |
| **Handoff** | Can the agent context-reset and resume? (shaped docs, plans, `.tap/` memory, clear commit history) |
| **Grading criteria** | Are quality expectations measurable, not vibes? (test suites, lint rules, acceptance criteria, design specs) |

Rate each workflow:

- **Closed loop** — all four elements present. Agent can iterate autonomously.
- **Open loop** — evaluator or grading criteria missing. Agent produces output but can't verify quality — human must inspect.
- **No loop** — no evaluator, no criteria. Agent guesses and hopes.

For each open/no loop, prescribe a concrete fix: a specific skill to create, MCP to wire up, hook to add, or test to write. Be specific — "add browser tests" is too vague; "add Playwright acceptance tests for the onboarding flow using /design-acceptance-tests" is actionable.

#### Approach Gaps

Don't repeat CLAUDE.md. Flag what's MISSING that causes agent rework:
- Test coverage gaps (which areas have no tests?)
- Missing ADRs (where do agents guess at architectural intent?)
- Undocumented patterns (inconsistencies agents will copy?)
- Design smells from the complexity spot check (god files to split, pass-through layers to collapse, inconsistent patterns to standardize)

#### Process

- Branching strategy
- CI/CD pipeline (what runs, recent pass rate)
- Deploy mechanics (auto or manual, to which environments)

### 3. Identify Leverage Points

Goal: **ship faster while maintaining quality bar.**

Find 3-5 leverage points. Each answers: what's slowing delivery OR letting defects through?

```
### N. [Short description] → [consequence]
- Symptom: [observable problem]
- Why it costs: [concrete impact on speed or quality]
- Fix: [cheapest intervention + estimated effort]
```

Prioritize by: cheapest fix that unblocks the most agent autonomy.

### 4. Write .tap/tap-audit.md

Create `.tap/` directory if it doesn't exist. Write the assessment using the template in references/tap-audit-template.md.

### 5. Seed .tap/architecture.md

**Always do this step.** If `.tap/architecture.md` doesn't already exist, create it now.

Scan the codebase for deliberate architectural decisions — they're visible as:
- Consistent patterns across the codebase (same error handling everywhere)
- Config that implies decisions (Temporal config, ORM choice, auth provider)
- Package choices that constrain patterns (Result library, specific framework)
- Comments or docs explaining "why" something is done a certain way

Write each decision in compressed format: 2-4 lines max. Capture the **principle** behind the decision so agents can apply it to novel situations. See [references/architecture-format.md](references/architecture-format.md) for format and examples.

**Do NOT create individual ADR files.** Everything goes in one `.tap/architecture.md` — one file, ~50 lines, optimized for agent consumption.

If `.tap/architecture.md` already exists, review it against what you discovered and note any missing decisions in the Approach Gaps section of tap-audit.md.

### 6. Present Findings

**Human mode (default):**

Always open with the signature block:

```
`★ Audit View ────────────────────────────────────`
[repo name] — [readiness score]
  ├─ [top feedback loop finding]
  ├─ [#1 leverage point]
  └─ [cheapest fix to start with]
`─────────────────────────────────────────────────`
```

Then:
- Summarize readiness score and what it means
- Highlight top 2-3 leverage points
- Propose the single cheapest fix to start with
- Ask if they want to address any leverage points now

**Agent mode (invoked with `--agent` or in automated pipeline):**
- Write .tap/tap-audit.md and .tap/architecture.md silently
- Log readiness score
- Proceed to assigned task

## Boundaries

- Does NOT describe the tech stack (CLAUDE.md's job)
- Does NOT set coding conventions (CLAUDE.md's job)
- Does NOT measure team dynamics like review turnaround (/systems-health's job)
- Does NOT modify any code or config — read-only assessment
