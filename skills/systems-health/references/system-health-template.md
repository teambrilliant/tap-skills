# System Health Report Template

Use this template for systems-health output. Adapt based on available data — omit sections where data isn't accessible.

```markdown
# System Health
Measured: [YYYY-MM-DD]
Window: 30 days (trend: 90 days)
Repo: [repo name]

## Stocks
| Stock | Current | 30d trend | Signal |
|-------|---------|-----------|--------|
| Backlog | [n] open | ▲/▼/─ | [healthy/concern] |
| Open PRs | [n] open, oldest [age] | ▲/▼/─ | [healthy/concern] |
| Open bugs | [n] open | ▲/▼/─ | [healthy/concern] |
| Tests | [n] tests, [x]% coverage | ▲/▼/─ | [healthy/concern] |

## Flows
| Flow | Rate | Balance |
|------|------|---------|
| Stories in | [n]/wk | [accumulating/draining/stable] |
| Stories out (merged) | [n]/wk | |
| Cycle time (median) | [n] hours | [fast/slow] |
| Review time (median) | [n] hours | [fast/slow] |
| Bug inflow | [n]/wk | [accumulating/draining/stable] |
| Bug outflow | [n]/wk | |
| Deploy frequency | [n]/month | [healthy/concern] |

## Feedback Loops
### Working
- [loop name]: [evidence]

### Broken or Weak
- [loop name]: [evidence of failure]

## Diagnosis
### 1. [what's sick]
- Evidence: [data]
- Impact: [how it slows delivery or hurts quality]
- Rx: [cheapest intervention]

### 2. [what's sick]
- Evidence: [data]
- Impact: [how it slows delivery or hurts quality]
- Rx: [cheapest intervention]

## Trends (vs prior measurement)
- Improved: [what got better]
- Worsened: [what got worse]
- Unchanged: [what stayed the same]
[or "First measurement — no prior data"]

## Summary
[2-3 sentences: overall health, biggest risk, recommended action]
```
