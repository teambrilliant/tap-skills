---
name: tap-audit
description: Assess how ready a repository is for autonomous agent work. Use when someone says "audit this repo", "tap audit", "how ready is this codebase", "assess this project", or when an agent enters an unfamiliar codebase and needs to understand it before working. Scans documentation, MCP servers, CLI tools, permissions, test infrastructure, environments, and process to produce a readiness assessment with actionable leverage points. Outputs to .tap/tap-audit.md.
---

# TAP Audit

Assess how autonomous an agent can be in this repo right now. Produce a structured assessment at `.tap/tap-audit.md`.

This skill does NOT describe coding conventions — that's CLAUDE.md's job. This skill assesses the system: what's configured, what's missing, what's slowing delivery or letting bugs through.

## Process

1. Scan the repo
2. Assess each dimension
3. Score readiness
4. Identify leverage points
5. Write `.tap/tap-audit.md`
6. Present findings (human) or proceed to task (agent)

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

#### Approach Gaps

Don't repeat CLAUDE.md. Flag what's MISSING that causes agent rework:
- Test coverage gaps (which areas have no tests?)
- Missing ADRs (where do agents guess at architectural intent?)
- Undocumented patterns (inconsistencies agents will copy?)

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

If `.tap/architecture.md` doesn't exist and ADRs are discoverable from the codebase (e.g., patterns that clearly reflect deliberate decisions), seed it with discovered decisions.

### 5. Present Findings

**Human mode (default):**
- Summarize readiness score and what it means
- Highlight top 2-3 leverage points
- Propose the single cheapest fix to start with
- Ask if they want to address any leverage points now

**Agent mode (invoked with `--agent` or in automated pipeline):**
- Write .tap/tap-audit.md silently
- Log readiness score
- Proceed to assigned task

## Boundaries

- Does NOT describe the tech stack (CLAUDE.md's job)
- Does NOT set coding conventions (CLAUDE.md's job)
- Does NOT measure team dynamics like review turnaround (/systems-health's job)
- Does NOT modify any code or config — read-only assessment
