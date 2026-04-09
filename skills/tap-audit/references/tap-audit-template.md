# TAP Audit Output Template

Use this template when writing `.tap/tap-audit.md`. Adapt sections based on what's discoverable — omit sections where no data is available rather than writing "unknown."

```markdown
# TAP Audit
Last run: [YYYY-MM-DD]
Codebase: [repo name or directory name]

## Environments
- Local:      [command] → [url]
- Preview:    [url or "not configured"]
- Staging:    [url or "not configured"]
- Production: [url or "not configured"]

## Agent Harness Readiness

### Documentation
- CLAUDE.md: [status and quality assessment]
- AGENTS.md: [status or "missing"]
- Architecture decisions: [.tap/architecture.md seeded / existing / "none discovered"]

### MCP Servers (.mcp.json)
- ✓/✗ [server name] → [what it enables]
[for each configured + each missing-but-needed]

### Skills
- ✓/✗ [skill name]
[for each available + each missing-but-needed for this stack]

### CLI Tools
- ✓/✗ [tool name]
[for each available + each missing-but-needed]

### Permissions (.claude/settings.json)
- Allowed: [list]
- Denied: [list]
- Missing: [anything needed but not configured]

### Test Infrastructure
- [test type]: [count] tests, [coverage]% coverage
- [test type]: [status]
[for each type: unit, integration, acceptance, e2e, browser]

### Design Complexity: [Easy / Moderate / Hard] to modify
Sampled [n] most-changed files.
- [file] — [size, imports, observation]
- [file] — [size, imports, observation]
- [file] — [size, imports, observation]
[1 sentence interpretation]

### Readiness Score: [FULL / PARTIAL / MINIMAL]
[1-2 sentence summary: what agent CAN do, what it CANNOT do, key gaps]

### Feedback Loops

Top 3 agent workflows assessed:

#### 1. [workflow name] — [Closed / Open / No] loop
- Generator: [what produces the output]
- Evaluator: [what verifies it, or "missing"]
- Handoff: [how context persists across resets, or "missing"]
- Grading: [measurable criteria, or "missing"]
- Rx: [concrete fix if not closed — specific skill, MCP, hook, or test to add]

#### 2. [workflow name] — [Closed / Open / No] loop
- Generator: [what produces the output]
- Evaluator: [what verifies it, or "missing"]
- Handoff: [how context persists across resets, or "missing"]
- Grading: [measurable criteria, or "missing"]
- Rx: [concrete fix if not closed]

#### 3. [workflow name] — [Closed / Open / No] loop
- Generator: [what produces the output]
- Evaluator: [what verifies it, or "missing"]
- Handoff: [how context persists across resets, or "missing"]
- Grading: [measurable criteria, or "missing"]
- Rx: [concrete fix if not closed]

## Approach Gaps
- [gap description — what's missing and why it matters for agents]
[for each identified gap, including design smells from complexity spot check]

## Process
- Branching: [strategy]
- CI: [tools and pass rate]
- Deploy: [mechanics]

## Leverage Points

Goal: ship faster while maintaining quality bar.

### 1. [Short description] → [consequence]
- Symptom: [observable problem]
- Why it costs: [impact on speed or quality]
- Fix: [cheapest intervention + effort estimate]

### 2. [Short description] → [consequence]
- Symptom: [observable problem]
- Why it costs: [impact on speed or quality]
- Fix: [cheapest intervention + effort estimate]

### 3. [Short description] → [consequence]
- Symptom: [observable problem]
- Why it costs: [impact on speed or quality]
- Fix: [cheapest intervention + effort estimate]
```
