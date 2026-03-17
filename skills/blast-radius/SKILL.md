---
name: blast-radius
description: Analyze the impact surface of a PR or set of changes before merging. Use when someone says "blast radius", "review this PR", "what does this change affect", "is this safe to merge", "impact analysis", or after an agent opens a PR that needs human verification. Maps what changed, what else is affected, what could break, assigns risk level, and generates a manual verification checklist. The human gate for mixed human-agent teams.
---

# Blast Radius

Map the impact surface of changes. Help humans focus their limited attention on what matters before merging.

## Process

1. Get the diff
2. Summarize intent
3. Map impact surface
4. Assess risk level
5. Identify blind spots (MEDIUM/HIGH only)
6. Generate verification checklist
7. Flag suspicious patterns
8. Present findings

### 1. Get the Diff

Determine what to analyze (in priority order):
- PR number provided → `gh pr diff <number>`
- Branch provided → `git diff main...<branch>`
- Nothing specified → `git diff main...HEAD` (current branch vs main)

Also read:
- PR description / commit messages for stated intent
- Linked ticket/issue if referenced
- `.tap/tap-audit.md` for environment URLs (needed for verification checklist)

### 2. Summarize Intent

In 1-2 sentences, state what the change is TRYING to do. This frames the entire analysis — every finding relates back to "does this serve or endanger the stated intent?"

### 3. Map Impact Surface

For each changed file, trace the impact outward:

**Direct changes:**
- What files changed
- What functions/components were modified, added, or removed
- What the behavioral change is (not just the code diff)

**Dependents (ripple effects):**
- What imports/calls/extends the changed code
- Search for: imports, function calls, component usage, shared state access
- Use `grep` / codebase search to find callers and importers
- Trace 2 levels deep (direct dependents + their dependents)

**Shared state:**
- Database schema changes (migrations)
- API contract changes (request/response shapes)
- Shared config, env vars, feature flags
- Global state, context providers, stores
- CSS/style changes that affect multiple components

**Test coverage gaps:**
- Which changed code paths have tests?
- Which dependents have tests covering the integration point?
- What's NOT tested that could break?

### 4. Assess Risk Level

**LOW** — Merge confidently
- Cosmetic changes (copy, styling, formatting)
- Isolated leaf components with no dependents
- New code that doesn't modify existing behavior
- Well-tested changes with full coverage on affected paths

**MEDIUM** — Test these specific flows
- Shared utilities or components with multiple callers
- API route changes (even if backward-compatible)
- Changes touching 3+ files across different domains
- Modifications to business logic with partial test coverage

**HIGH** — Test everything on the checklist
- Auth, payments, data mutations, permissions
- Database migrations or schema changes
- Public API contract changes
- Deleted code that might be referenced dynamically
- Architecture-level changes (routing, middleware, providers)
- Changes with zero test coverage on critical paths

### 5. Identify Blind Spots (MEDIUM/HIGH only)

Surface what the static analysis CAN'T see. Scan the diff for patterns that indicate hidden dependencies, grounded in Ousterhout's complexity symptoms:

**Obscurity** — behavior depends on information not visible in the diff:
- Env vars, config files, feature flags, runtime values
- Conditional logic driven by external state

**Hidden dependencies** — connections not traceable via static imports:
- Dynamic dispatch, event emitters/listeners, pub/sub, message queues
- Webhook contracts, callback registrations
- String-based lookups, reflection, dynamic requires

**Change amplification risk** — external consumers of changed interfaces where the full set of consumers is unknown:
- API response shapes consumed by external clients
- Shared DB tables read by other services
- Published events consumed by unknown subscribers

Each blind spot states: [what's hidden] — [why it matters for this PR].

Merge blind spots that overlap with Verification Checklist items into the checklist instead of duplicating. Remaining blind spots feed additional checklist items.

Skip this section entirely for LOW risk PRs.

### 6. Generate Verification Checklist

Produce a concrete list of things to manually test. Be specific — pages, flows, inputs, edge cases.

**Format:**
```
□ [page/flow] — [what to verify] — [why it might break]
```

Include:
- **Happy paths**: Core flows through changed code
- **Edge cases**: Error states, empty states, boundary inputs
- **Regressions**: Flows through UNCHANGED code that depends on changed code
- **Environment-specific**: If `.tap/tap-audit.md` has URLs, reference specific environments
- **Blind spot items**: For MEDIUM/HIGH, items surfaced by blind spot analysis

Prioritize the checklist: most likely to break first, most damaging if broken second.

### 7. Flag Suspicious Patterns

Call out anything that doesn't look right:

- **Scope creep**: Changes that don't relate to the stated intent
- **Orphaned code**: Deleted exports/functions that might be used via dynamic import or string reference
- **New dependencies**: Packages added — are they necessary? Maintained? Secure?
- **Missing migrations**: Schema changes without corresponding migration files
- **Hardcoded values**: Magic numbers, URLs, credentials
- **Test gaps**: Modified behavior with no corresponding test updates

### 8. Present Findings

Use the template in [references/blast-radius-template.md](references/blast-radius-template.md).

**Human mode**: Interactive walkthrough. Start with risk level and intent summary. Walk through impact map. Present verification checklist. Ask: "Want me to dig deeper into any area?"

**Agent mode**: Write structured report as a PR comment via `gh pr comment`. Include risk level, impact map, and verification checklist. Human reads async.

## Boundaries

- Read-only analysis — does NOT modify code or approve/reject the PR
- Does NOT run tests (that's run-acceptance-tests / qa-test)
- Does NOT assess code quality or style (that's CLAUDE.md / code review)
- Does NOT re-implement or suggest code changes
- ONLY maps impact and helps humans decide
