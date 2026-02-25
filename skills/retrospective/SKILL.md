---
name: retrospective
description: Just-in-time retrospective focused on improving agent autonomy. Use when someone says "retro", "retrospective", "what did we learn", "what went wrong", "post-mortem", "incident review", or after a feature ships, an incident resolves, a pattern of agent failures emerges, or any event worth reflecting on. Analyzes what happened, identifies what blocked agent autonomy, and produces concrete improvements (learnings + tickets). Not calendar-driven — event-driven. The learning loop that makes the system self-improving.
---

# Retrospective

Reflect on what happened. Identify what blocked agent autonomy. Produce concrete improvements so the system gets better.

Not tied to sprints or calendars. Run a retro when there's something worth learning from: a feature shipped, an incident resolved, a pattern of failures, a project wrapped.

## Core Question

**What happened that an agent couldn't handle autonomously, and what's the cheapest fix so it can next time?**

## Process

1. Identify the trigger
2. Gather evidence
3. Analyze through the autonomy lens
4. Capture learnings
5. Create improvement tickets
6. Append to .tap/learnings.md

### 1. Identify the Trigger

What event prompted this retro? Determines scope and data to analyze.

- **Feature shipped** → analyze the full cycle from ticket to merge
- **Incident** → analyze what broke, how it was detected, how it was fixed
- **Agent failure pattern** → analyze recent rejected PRs, rework cycles, blocked tasks
- **Project wrap** → analyze the full engagement
- **Ad hoc** → user specifies what to reflect on

### 2. Gather Evidence

Pull data relevant to the trigger:

```
git log --since="[relevant period]"           → what was committed
gh pr list --state merged --search "[scope]"  → PRs in scope
gh pr list --state closed --search "[scope]"  → rejected PRs (signal!)
gh issue list --search "[scope]"              → related issues
```

Also read if available:
- `.tap/system-health.md` → system metrics around the event
- `.tap/tap-audit.md` → current readiness assessment
- `.tap/learnings.md` → prior learnings (avoid repeating known issues)
- PR review comments → why PRs were rejected or revised
- CI logs → what failed and how often

**Rejected PRs are gold.** Every rejection is a gap in agent capability or context.

### 3. Analyze Through the Autonomy Lens

For each problem found, classify the root cause:

**Context gap** — agent lacked information to make the right choice
- Missing or incomplete CLAUDE.md
- Missing ADR → agent guessed wrong pattern
- Unclear acceptance criteria → agent built the wrong thing
- No prior learnings → agent repeated a known mistake

**Harness gap** — agent lacked tools or access to complete the task
- Missing MCP server (DB, browser, external API)
- Missing CLI tool
- Missing skill
- Insufficient permissions

**Feedback gap** — agent couldn't verify its own work
- No tests for the affected area
- No browser QA setup
- CI doesn't catch the type of failure that occurred

**Scope gap** — agent took on work it shouldn't have
- No AGENTS.md boundaries
- Task was too ambiguous for autonomous execution
- Architecture decision needed human judgment

### 4. Capture Learnings

For each finding, write a concise learning:

```
[date] — [trigger]
- [what happened] → [root cause category] → [specific fix]
```

**Good learnings are specific and actionable:**
- "Agent used raw SQL instead of Drizzle → context gap → add data access pattern to CLAUDE.md"
- "Agent couldn't test payment flow → harness gap → configure Stripe test MCP"
- "Agent PR touched auth middleware without tests → feedback gap → add auth integration tests"

**Bad learnings are vague:**
- "Agent needs to be more careful" (not actionable)
- "We should write better tests" (not specific)
- "Communication needs improvement" (not a system fix)

### 5. Create Improvement Tickets

Each learning that requires work becomes a ticket. Categorize by impact on agent autonomy:

**Raises readiness score** (MINIMAL→PARTIAL or PARTIAL→FULL):
- Add missing MCP server
- Add missing test infrastructure
- Write AGENTS.md
- Document key ADRs

**Prevents repeat failures:**
- Update CLAUDE.md with discovered pattern
- Add tests for uncovered area
- Capture decision in .tap/architecture.md

**Human mode**: Present findings. Propose tickets. Ask: "Which of these should we create issues for?"

**Agent mode**: Create issues via `gh issue create` with label `retro-improvement`. Human reviews and prioritizes.

### 6. Write to .tap/learnings.md

Append (never overwrite) to `.tap/learnings.md`. Create the file and `.tap/` directory if they don't exist.

Use the template in [references/learnings-template.md](references/learnings-template.md).

Agents read `.tap/learnings.md` before starting work. Captured learnings prevent the same mistakes from repeating across sessions.

## Boundaries

- Does NOT edit CLAUDE.md or AGENTS.md (creates tickets suggesting updates — human decides)
- Does NOT edit .tap/architecture.md (creates tickets — human decides on ADRs)
- Does NOT assign blame or assess team performance
- Does NOT follow a calendar — runs when there's something to learn from
- ONLY analyzes events, captures learnings, creates improvement tickets
- Goal is always: increase agent autonomy for next time
