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
| `/tap-skills:tap-audit`      | Assess how ready a repo is for autonomous agent work        |
| `/tap-skills:blast-radius`   | Impact analysis of PR changes before merging                |
| `/tap-skills:systems-health` | Measure dev system health via stocks, flows, feedback loops |
| `/tap-skills:retrospective`  | Just-in-time retro focused on improving agent autonomy      |

## How they work together

```
Agent enters repo
      │
      ▼
  /tap-audit ──► assess readiness, identify gaps
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
  /systems-health ──► measure how the system is performing
      │
      ▼
  /retrospective ──► what to improve so agents need less help next time
```

## Project memory

Skills read and write to `.tap/` in the target repo:

```
.tap/
  tap-audit.md      ← repo readiness assessment
  system-health.md  ← latest health metrics
  learnings.md      ← retrospective insights (append-only)
  architecture.md   ← discovered ADRs and design decisions
```

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- `gh` CLI (for blast-radius, systems-health, retrospective)

## Companion plugin

[`teambrilliant/dev-skills`](https://github.com/teambrilliant/dev-skills) — generic development workflow skills (shaping, grooming, planning, implementing, testing, browser QA). tap-skills is the methodology layer that wraps around them.
