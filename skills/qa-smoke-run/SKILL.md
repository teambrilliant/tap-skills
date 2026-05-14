---
name: qa-smoke-run
description: Execute the smoke-test catalog at `.tap/smoke-tests.md` against a running web app in a browser, then report only what's broken. Use whenever someone says "run smoke tests", "run the smoke test catalog", "execute smoke tests", "smoke test the release", "qa smoke run", or wants to verify a release or deploy against the app before shipping. This is the per-release regression run. Pairs with `qa-smoke-catalog`, which authors the catalog this skill consumes. Reports pass/fail in chat; saves failure artifacts to `.tap/qa-runs/<timestamp>/`.
---

# QA Smoke Run

Execute the smoke-test catalog and report. You are a QA engineer running the release checklist: methodical, skeptical, and economical with the human's attention. The release manager reading your output wants one question answered — *did anything break?* — not a play-by-play of everything that worked.

## Input

`.tap/smoke-tests.md` in the target repo. If it doesn't exist, stop and point the human at `qa-smoke-catalog` to author one — there is nothing to run without it.

The catalog has three structural parts:
- `## Setup` — run configuration. Read it first and honor it.
- `## Conventions` — how the catalog is written. Context for you; not steps to execute.
- `## Test case: <name>` blocks — the actual cases.

## Process

1. Read the catalog and Setup
2. Execute each case
3. Report

### 1. Read the catalog and Setup

Parse `## Setup` for: base URL, logged-in identity, auth assumption, modal / banner handling, and the console rule. These apply to every case.

If Setup says the session must be pre-authenticated and you hit a login page, that's a **catastrophic** failure (see Reporting) — do not try to guess or enter credentials.

Split the rest of the file on `## Test case:` headers. For each case:
- Bullet lines are steps, in order.
- A `> ` note block is context — the WHY behind the case. It is **not** a step. Don't execute it; use it only to understand what the case is protecting.

### 2. Execute each case

Use the Chrome DevTools MCP. For each case, work down the bullets in order:

- **Imperative bullets** (`Click`, `Navigate to`, `Type`, `Wait for`, `Press`) — perform the action.
- **Declarative bullets** (a stated fact, e.g. `Page heading is "Customers"`) — check it with `take_snapshot` or `evaluate_script`. If the fact holds, the assertion passes.
- **State-dependent alternatives** (`X renders OR an empty-state message appears`) — either branch holding means the bullet passes. The catalog is written this way on purpose, so test-account data drift doesn't cause false failures. Honor it; don't treat the empty-state branch as a failure.

Apply the console rule from Setup to every case unless a specific case overrides it.

A case **passes** if every bullet passes. It **fails** at the first bullet that doesn't — record exactly which bullet, and what you observed.

### 3. Report

This is the part that matters most. The default failure mode of an LLM here is narrating everything it did — every navigation, every passing assertion. Resist it. **Chat is for signal; disk is for forensics.** A release manager scanning your output should spend their attention only on what's broken.

**On all-pass** — report one line, then stop:

```
Smoke tests: 14/14 PASS (4m 12s)
```

Never enumerate the cases that passed. The one-liner *is* the report. Listing 14 green checkmarks adds nothing and buries the signal on the next run when something does break.

**On partial fail** — a one-line summary, then one block per failure:

```
Smoke tests: 11/14 PASS, 3 FAIL (4m 38s)

✗ My Team downline shows real Exigo data
  Failed at: "At least one downline row renders with a non-empty Sponsor"
  Symptom: Sponsor column rendered "-" for all rows
  Likely: Exigo query returned empty (saw 504 on /api/team-tree)
  Artifacts: .tap/qa-runs/2026-05-14-1730/my-team.png, console.log
```

Each failure block contains: the case name, the failing bullet **quoted verbatim**, the observed symptom, an optional one-line hypothesis *only when it's genuinely obvious from what you saw*, and the artifact paths. Don't speculate beyond the evidence — a wrong hypothesis costs the human more than no hypothesis.

**On catastrophic failure** (auth broke, site unreachable, catalog malformed and unparseable) — abort and say why. Do **not** fake-pass or skip-and-continue the remaining cases:

```
Smoke tests: RUN ABORTED at case 2/14
Reason: Login page appeared; Setup says the session should be pre-authenticated.
Resolution: Re-authenticate, then re-run.
```

## Artifacts

Save artifacts **only for failures**, never for passes — a clean run should leave no trace on disk. For each failed case, write to `.tap/qa-runs/<timestamp>/`:
- A screenshot at the point of failure.
- The console messages captured during that case.
- A network log (HAR) when a network issue is implicated in the failure.

A fully passing run produces zero files. That's intentional: it keeps the repo clean, and it makes the mere presence of a `.tap/qa-runs/` entry a meaningful signal that something went wrong.

## The contract with qa-smoke-catalog

You depend on the catalog's structure: `## Setup` parseable as configuration, `## Test case:` headers to split on, `> ` note blocks as context rather than steps, and the imperative-vs-declarative bullet distinction. If the catalog is malformed badly enough that you can't reliably parse it into cases, treat that as a catastrophic failure and point the human at `qa-smoke-catalog` to fix it — don't guess at what the cases were meant to be.

## Boundaries

- Does NOT author or edit the catalog — that's `qa-smoke-catalog`.
- Does NOT fix the app or the test when something fails — it reports, the human decides. Diagnosis hypotheses are allowed; code changes are not.
- Does NOT run unit, integration, or acceptance test suites — that's CI and the acceptance-test skills. This skill drives a real browser against a running app.
- Does NOT enumerate passes or narrate steps. On a green run, the one-line summary is the entire output.
