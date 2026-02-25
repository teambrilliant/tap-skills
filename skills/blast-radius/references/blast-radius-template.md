# Blast Radius Report Template

Use this template for blast-radius analysis. Adapt based on the PR — omit sections where not applicable.

```markdown
# Blast Radius: [PR title or branch name]
Risk Level: [LOW / MEDIUM / HIGH]

## Intent
[1-2 sentences: what this change is trying to do]

## Changes
| File | What changed | Dependents |
|------|-------------|------------|
| [path] | [behavioral change] | [who imports/calls this] |

## Impact Map
### Direct
- [component/function] — [what changed behaviorally]

### Ripple Effects
- [dependent] → uses [changed thing] → [what could break]

### Shared State
- [state/schema/API] — [how it's affected]
[or "None — changes are isolated"]

## Test Coverage
- Covered: [what's tested]
- Gaps: [what's NOT tested that could break]

## Verification Checklist
□ [page/flow] — [what to verify] — [why]
□ [page/flow] — [what to verify] — [why]
□ [page/flow] — [what to verify] — [why]

## Flags
- [suspicious pattern or concern]
[or "None — changes look clean"]

## Summary
[1-2 sentences: overall assessment, what to focus manual testing on]
```
