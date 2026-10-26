---
name: blast-radius
description: Analyze the impact surface of a PR or set of changes before merging. Use when someone says "blast radius", "review this PR", "what does this change affect", "is this safe to merge", "impact analysis", or after an agent opens a PR that needs human verification. Surfaces the decisions the change made that nobody asked for, maps what else is affected and what could break, assigns risk level, and generates a manual verification checklist. The human gate for mixed human-agent teams.
---

# Blast Radius

Map the impact surface of changes. Help humans focus their limited attention on what matters before merging.

Reading every line doesn't scale with agent-written code. Two things do: the **decisions** the change made on its own, and **what could break**. Lead with those, in plain words.

## Process

1. Get the diff
2. Summarize intent
3. Surface decisions
4. Map impact surface
5. Assess risk level
6. Identify blind spots (MEDIUM/HIGH only)
7. Generate verification checklist
8. Flag suspicious patterns
9. Present findings

### 1. Get the Diff

Determine what to analyze (in priority order):
- PR number provided → `gh pr diff <number>`
- Branch provided → `git diff main...<branch>`
- Nothing specified → `git diff $(git merge-base main HEAD)` — current branch vs main, uncommitted changes included. Add new files from `git status --short` (untracked files aren't in the diff).

Also read:
- PR description / commit messages for stated intent
- Linked ticket/issue if referenced
- The plan and shape behind the change, if any — `thoughts/plans/`, `thoughts/shapes/` matching the branch or PR topic. The plan's `## Decisions` section is the implementer's own log of calls the plan didn't make.
- `.tap/tap-audit.md` for environment URLs (needed for verification checklist)

### 2. Summarize Intent

In 1-2 sentences, state what the change is TRYING to do. This frames the entire analysis — every finding relates back to "does this serve or endanger the stated intent?"

### 3. Surface Decisions

A decision is a call the change makes that the intent (plan, shape, ticket, PR description) didn't. Working code can still rest on calls nobody chose — and whoever merges now owns them.

- **Start from the plan's `## Decisions` log if there is one.** Treat it as a starting point: implementers under-report their own calls. Check each entry against the diff, then sweep for ones it missed and mark those `(not in log)`.
- **Sweep for:** data shapes and storage, API contracts and error behavior, new dependencies, retries / timeouts / concurrency, scope interpretations (did more or less than asked), patterns other code will copy.
- **Skip trivia:** internal names, import paths, file moves.
- **Per decision, one line in plain words:** what happens, as a concrete scenario → that the intent didn't say → the alternative not taken → verdict: **fine**, **looks wrong** (+ what it should be instead), or **your call** (taste, product direction, cost).
- **Order least sure first.** That's where the human's attention goes.

An empty list on a nontrivial change is a red flag, not a pass — ask what the intent left unspecified; something filled that gap.

### 4. Map Impact Surface

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

**Size and new surfaces:**
- Net lines added, production code vs tests (`git diff --numstat`; skip lockfiles and generated files)
- New things someone now owns: tables, columns, endpoints, crons/jobs, dependencies, env vars, flags

A large net addition for a small behavior change is a finding — flag it under suspicious patterns.

### 5. Assess Risk Level

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

### 6. Identify Blind Spots (MEDIUM/HIGH only)

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

Blind spots, ripple effects, shared-state changes and test gaps all land in one ranked "What could break" list — don't report them as separate sections.

Skip this section entirely for LOW risk PRs.

### 7. Generate Verification Checklist

Produce a concrete list of things to manually test. Be specific — pages, flows, inputs, edge cases.

**Format:**
```
□ [page/flow] — [what to verify]
```

Include:
- **Happy paths**: Core flows through changed code
- **Edge cases**: Error states, empty states, boundary inputs
- **Regressions**: Flows through UNCHANGED code that depends on changed code
- **Environment-specific**: If `.tap/tap-audit.md` has URLs, reference specific environments
- **Blind spot items**: For MEDIUM/HIGH, items surfaced by blind spot analysis

Prioritize the checklist: most likely to break first, most damaging if broken second. The "why" lives in "What could break" — don't repeat it per item.

### 8. Flag Suspicious Patterns

Call out anything that doesn't look right:

- **Scope creep**: Changes that don't relate to the stated intent, or a net size out of proportion to the behavior change
- **Orphaned code**: Deleted exports/functions that might be used via dynamic import or string reference
- **New dependencies**: Packages added — are they necessary? Maintained? Secure?
- **Missing migrations**: Schema changes without corresponding migration files
- **Hardcoded values**: Magic numbers, URLs, credentials
- **Test gaps**: Modified behavior with no corresponding test updates

### 9. Present Findings

Use the template in [references/blast-radius-template.md](references/blast-radius-template.md).

**Write it so a smart friend gets it on first read:**
- Plain sentences, "if X, then Y breaks" — no tables, no impact-map tiers.
- Every term of art gets a few plain words the first time it appears.
- Facts verbatim: paths, commands, numbers, names stay exactly as they are.
- Omit any section with nothing in it. A LOW-risk change fits in ~4 lines.

**Human mode**: Interactive walkthrough. Start with risk level and intent summary. Walk through decisions, then what could break. Present verification checklist. Ask: "Want me to dig deeper into any area?"

**Agent mode**: Write structured report as a PR comment via `gh pr comment`. Include risk level, decisions, what could break, and verification checklist. Human reads async.

## Boundaries

- Read-only analysis — does NOT modify code, the plan, or approve/reject the PR
- Decisions marked "looks wrong" are reported, not fixed — whoever acts on the report redoes them
- Does NOT run tests (that's run-acceptance-tests / qa-test)
- Does NOT assess code quality or style (that's CLAUDE.md / code review)
- Does NOT re-implement or suggest code changes
- ONLY maps impact and helps humans decide
