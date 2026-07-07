---
name: qa-smoke-catalog
description: Explore a running web app in a browser and build or update `.tap/smoke-tests.md` — a lean catalog of post-release smoke-test cases. Use whenever someone says "build smoke tests", "create a smoke test catalog", "explore the site for testing", "what should we smoke test", "update the smoke test catalog", "add smoke test cases", or wants exploratory testing of a web app to capture what matters before a release. Use it proactively when entering an app that has no `.tap/smoke-tests.md` and the user wants release coverage. Pairs with `qa-smoke-run`, which executes the catalog this skill produces. Outputs to `.tap/smoke-tests.md`.
---

# QA Smoke Catalog

Build the catalog of smoke tests a human relies on after every release. The catalog is a lean markdown file that an agent can later execute in a browser. Your job is to be a sharp exploratory-testing partner — explore the real app, propose what's worth testing, and let the human curate. You are not a generator. A catalog the human rubber-stamps without thinking is worse than no catalog, because it creates false confidence.

## What this produces

`.tap/smoke-tests.md` — a single markdown file. See [references/example-catalog.md](references/example-catalog.md) for a complete, real example. Study that file before you start — it is the canonical format, and the cases in it show the level of specificity to aim for.

The file has three structural parts:
- `## Setup` — project-specific context the runner needs (base URL, identity, auth assumption, modal handling, console rule).
- `## Conventions` — how cases are written. Seeded verbatim on create (see step 6).
- A series of `## Test case: <name>` blocks, separated from the header sections by a `---`.

## Process

1. Detect mode
2. Gather inputs
3. Explore the app
4. Propose cases — apply judgment
5. Curate with the human
6. Write the catalog

### 1. Detect mode

Check whether `.tap/smoke-tests.md` exists in the target repo.

- **Does not exist → CREATE mode.** You'll seed `## Setup` + `## Conventions` and propose an initial catalog from scratch.
- **Exists → UPDATE mode.** Read it first. You'll propose new or changed cases as a diff against what's already there. Never silently rewrite or drop existing cases — the human owns them. Surface every proposed change and let them decide.

### 2. Gather inputs

You need:

- **Base URL** (required) — where the app lives. If the user hasn't given it, ask. This is the one input you can't discover.
- **Auth / identity** (usually needed) — which account is logged in, how auth is handled. Most back-office apps assume a pre-authenticated session; capture that assumption.
- **Focus area** (optional) — in UPDATE mode especially, the user may say "I just shipped the payments tab." Explore that area first and deepest.

Discover what you can; confirm assumptions rather than interrogating the user.

### 3. Explore the app

Use the Chrome DevTools MCP. Drive the real app the way a user would on their first day:

- `navigate_page` through the primary navigation, breadth-first.
- `take_snapshot` to read the accessibility tree — this is your main sense organ. Prefer it over screenshots; it gives you element labels, roles, and `uid`s to act on.
- `evaluate_script` to inspect what the snapshot misses — dropdown menus that only render on hover or click, hidden nav items, the DOM behind a custom component.
- Notice what's data-backed vs. static, what's behind an interaction, what looks fragile or slow.

Explore enough to make good proposals — you don't need to click everything. You're an architect surveying terrain, not a crawler indexing it.

### 4. Propose cases — apply judgment

This is where the skill earns its keep. A catalog that tests everything tests nothing — it gets slow, noisy, and ignored. Propose cases that protect what actually matters.

**Worth a case:**

- **Golden paths** — the handful of flows that, if broken, mean the app is down for its core user. If the dashboard won't load or login is broken, nothing else matters. Cover these first.
- **Cross-DB / external-integration surfaces** — pages backed by a secondary datastore or third-party API that can fail *independently* of the main app. These break in ways unit tests never catch, because the failure lives in infrastructure, not code. Tag them with a `> ` note block naming the dependency.
- **Money & auth flows** — payments, payouts, bank details, login, logout. Anything with financial or legal consequence deserves a case even when the UI looks "simple."
- **Recent-incident / recently-shipped areas** — surfaces tied to a recent ticket or postmortem. Tag with a `> ` note block citing the ticket, so a future reader knows *why* the case exists and doesn't delete it as redundant.

**Not worth a case:**

- Cosmetic-only checks — exact pixel positions, colors, font sizes.
- Exhaustive permutations — one representative case per behavior, not one per input value.
- Anything a unit or integration test covers better and faster. Smoke tests are for "is the system wired together," not "is this function correct."
- File export/download internals — that the button exists and fires is enough; asserting file contents belongs in a different test layer.

Present proposals grouped — by nav area, or by risk tier — each with a one-line rationale. Make it easy for the human to react quickly.

### 5. Curate with the human

**This step is non-skippable.** Show your proposed cases and let the human cut, keep, and reshape — "skip export," "add the Team tab," "make this one lighter," "this matters more than you think, here's why." Their domain knowledge is the thing you don't have and can't infer from the DOM. Iterate until they're satisfied.

The conversation *is* the authoring tool. If this skill ever feels like a generator the human approves in one pass, something is wrong — either you're proposing too safely, or they're not engaging, and the resulting catalog won't reflect real risk.

### 6. Write the catalog

Once curated, write `.tap/smoke-tests.md`.

**In CREATE mode**, seed the two header sections first.

`## Setup` — fill from what you learned: base URL, logged-in identity, auth assumption, any modal / cookie-banner the runner will hit on load, and a console rule (typically: no `error`-level console messages during a case). Keep it to what the runner genuinely needs.

`## Conventions` — seed verbatim:

```markdown
## Conventions

How to write a test case in this file. Keep edits consistent.

- **Actions are imperative.** Use `Click`, `Navigate to`, `Type`, `Wait for`, `Press`.
- **Assertions are declarative.** State the fact that should hold. Do not use `Verify`, `Ensure`, or `Check` as a verb. Write `Page heading is "Customers"`, not `Verify the page heading is "Customers"`.
- **UI labels, routes, and copy in backticks, exact.** E.g. `/pages/bo-orders`, `Run Report`.
- **State-dependent alternatives are explicit.** Write `At least one row renders OR an empty-state message appears` so the test tolerates account state drift.
- **Note blocks (`> ...`) carry the WHY** — data source, ticket reference, risk rationale. They are not instructions to the runner.
- **Each case starts from a known state.** The first step either navigates to a URL or explicitly continues from the previous case's end state.
- **Case names describe user-visible behavior**, not routes. Prefer `Customer search filters the list` over `GET /bo-customers with search param`.
```

Then write the curated cases following those conventions exactly. Each case is:
- A `## Test case: <behavior name>` header.
- An optional `> ` note block when there's a non-obvious WHY (data source, ticket, risk rationale).
- A flat bullet list mixing imperative action steps and declarative assertion steps, in execution order.

**In UPDATE mode**, apply only the curated changes — insert new cases into the relevant area, modify the specific cases the human approved changing, and leave everything else byte-for-byte untouched.

## The contract with qa-smoke-run

The catalog you produce is executed by `qa-smoke-run`. That skill depends on the structure: `## Setup` parsed as run config, `## Conventions` ignored at run time, `## Test case:` headers used to split cases, `> ` note blocks treated as context rather than steps. Keep the structure clean and conventional — a malformed catalog silently breaks the runner.

## Wire discoverability

`.tap/smoke-tests.md` is only read by agents that know it exists — CLAUDE.md is the only file loaded automatically. After writing, check the repo's CLAUDE.md for a `.tap/` context-index line:

- **Index line exists** → make sure it mentions `smoke-tests.md` (release smoke-test catalog); append if missing.
- **No index line** → add one (show the diff, write on confirm): `Durable project context lives in .tap/ — smoke-tests.md (release smoke-test catalog)[, plus any other .tap/ files present]. Read the relevant file before deciding in that area.`
- **No CLAUDE.md** → tell the user the catalog is invisible to agents until something references it; offer a minimal CLAUDE.md containing just that pointer.

## Boundaries

- Does NOT execute the catalog — that's `qa-smoke-run`.
- Does NOT write per-feature acceptance tests, unit tests, or integration tests — that's a different test layer (e.g. dev-skills' acceptance-test skills).
- Does NOT do per-implementation browser QA of a single change — that's dev-skills' `qa-test`. This skill builds the durable, release-cadence catalog.
- Does NOT touch application code.
- Proposes; the human decides. The curation step is required, not optional.
