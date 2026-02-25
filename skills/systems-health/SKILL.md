---
name: systems-health
description: Measure the health of a software development system using stocks, flows, and feedback loops. Use when someone says "systems health", "how's the project going", "health check", "measure our process", "are we shipping fast enough", "what's slowing us down", or for periodic check-ins on development velocity and quality. Pulls data from git, GitHub, and CI to diagnose what's working and what's broken. Outputs to .tap/system-health.md.
---

# Systems Health

Diagnose the development system. Measure stocks, flows, and feedback loops. Find what's sick and prescribe the cheapest fix.

## Process

1. Collect data
2. Measure stocks
3. Measure flows
4. Assess feedback loops
5. Diagnose and prescribe
6. Write .tap/system-health.md

### 1. Collect Data

Pull from available sources (skip any that aren't accessible):

```
git log --oneline --since="30 days ago"          → commit frequency
git log --oneline --since="90 days ago"           → longer trend
git shortlog -sn --no-merges --since="30 days ago" → contributor activity
gh pr list --state all --limit 50                 → PR lifecycle
gh pr list --state open                           → current open PRs
gh run list --limit 20                            → CI pass/fail rate
gh issue list --state all --label bug --limit 50  → bug lifecycle
gh issue list --state open                        → current open issues
```

Also read if available:
- `.tap/tap-audit.md` → prior assessment context
- `.tap/system-health.md` → prior health snapshot for trend comparison
- Test runner output → test count, coverage

**Time windows**: Default to 30-day snapshot with 90-day trend. Use `--since` flag on all git/gh commands.

### 2. Measure Stocks

Stocks are things that accumulate. Measure current level + trend.

| Stock | How to measure | Healthy signal |
|-------|---------------|----------------|
| Backlog | `gh issue list --state open` count | Stable or shrinking |
| Open PRs | `gh pr list --state open` count + age | < 5 open, oldest < 3 days |
| Open bugs | `gh issue list --label bug --state open` count | Stable or shrinking |
| Test count | Test runner `--list` or dry-run | Growing with codebase |
| Deploy count | `gh run list` with deploy workflow, or git tags | Weekly+ |

**Trend indicators**: Compare current 30-day window to previous 30-day window.
- ▲ growing (stock increasing)
- ▼ shrinking (stock decreasing)
- ─ stable (within 10% variance)

### 3. Measure Flows

Flows change stocks. Measure rate + balance.

| Flow | How to measure | What it tells you |
|------|---------------|-------------------|
| Stories in | Issues created per week | Demand on the system |
| Stories out | PRs merged per week | Throughput |
| Cycle time | PR open → merge duration (median) | How fast work moves |
| Review time | PR open → first review (median) | Bottleneck indicator |
| Bug inflow | Bug issues created per week | Quality signal |
| Bug outflow | Bug issues closed per week | Fix rate |
| Deploy frequency | Deploys per week/month | Delivery cadence |

**Balance check for each stock:**
- Inflow > outflow → stock accumulates → system backing up
- Inflow < outflow → stock drains → system clearing
- Inflow ≈ outflow → stable

### 4. Assess Feedback Loops

Identify which loops are working and which are broken.

**Balancing loops (self-correcting):**

| Loop | Working | Broken |
|------|---------|--------|
| CI gate | CI fails → dev fixes → CI passes | CI fails → ignored, merged anyway |
| Code review | Review catches issues → dev fixes → quality maintained | Reviews rubber-stamped or stuck for days |
| Bug triage | Bug found → prioritized → fixed | Bugs accumulate, never triaged |
| Test failures | Test fails → investigate → fix code or test | Tests disabled, skipped, or ignored |

**Reinforcing loops (amplifying):**

| Loop | Working | Broken |
|------|---------|--------|
| Test coverage | Good tests → catch bugs → write more tests | No tests → bugs escape → "tests don't help" |
| Documentation | Good docs → agents work well → docs updated | Thin docs → agent rework → "docs don't help" |
| Small batches | Small PRs → fast review → more small PRs | Big PRs → slow review → bigger PRs |

**Evidence-based assessment**: Don't guess. Check CI pass rate (from `gh run list`), review turnaround (from PR data), bug trends (from issue data).

### 5. Diagnose and Prescribe

For each problem found, follow the pattern:

```
Diagnosis: [what's sick]
Evidence:  [data that proves it]
Impact:    [how it slows delivery or hurts quality]
Rx:        [cheapest intervention]
```

Prioritize by: most impact for least effort.

**Common diagnoses:**
- Stocks accumulating → find the bottleneck flow
- Slow cycle time → usually review time or CI time
- Broken feedback loop → identify who/what stopped responding to the signal
- No feedback loop → suggest creating one (tests, CI gate, review process)

### 6. Write Output

Write to `.tap/system-health.md` using the template in [references/system-health-template.md](references/system-health-template.md).

If prior `.tap/system-health.md` exists, compare trends. Call out what improved and what worsened since last measurement.

**Human mode**: Walk through findings. Start with the headline ("your system is healthy / has 2 problems / is backing up"). Show the data. Explain the diagnosis. Propose the cheapest fix. Ask: "Want to dig into any of these?"

**Agent mode**: Write `.tap/system-health.md` silently. If run as part of a `/retrospective`, feed findings into the retro.

## Boundaries

- Read-only — does NOT modify code, config, or process
- Does NOT assess code quality (that's CLAUDE.md / code review)
- Does NOT assess agent readiness (that's /tap-audit)
- Does NOT capture learnings (that's /retrospective)
- ONLY measures the system and diagnoses problems
- Data-driven — every claim backed by evidence from git/GitHub/CI
