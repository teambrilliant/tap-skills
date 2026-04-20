---
name: curate-product-context
description: Curate and maintain `.tap/product.md` — a compressed, agent-readable product-context file (what we build, audience, current focus, bets, non-goals). Use when someone says "curate product context", "install product context", "update product context", "product vision in repo", "what are we building", or when an agent enters a repo and can't find durable product-strategic context. Auto-detects interview / review / refresh mode. Outputs to `.tap/product.md`.
---

# Curate Product Context

Install and maintain durable product-strategic context as an in-repo artifact (`.tap/product.md`) so human engineers and AI agents can make decisions without pinging the leader. One file, five sections, ≤ 80 lines, principle-driven.

This skill does NOT describe the tech stack (CLAUDE.md's job) or architectural decisions (`.tap/architecture.md` — seeded by `/tap-skills:tap-audit`). It captures product direction: what, for whom, what we're solving now, what bets we're making, what we're NOT doing.

## Process

0. Check state
1. Auto-detect mode
2. Read inputs
3. Run interview / review / refresh
4. Show diff
5. Write on confirm

### 0. Check State

Check for `.tap/product.md`:

```bash
if [[ -f .tap/product.md ]]; then
  mtime_epoch=$(stat -f %m .tap/product.md 2>/dev/null || stat -c %Y .tap/product.md)
  days_old=$(( ( $(date +%s) - mtime_epoch ) / 86400 ))
fi
```

### 1. Auto-detect Mode

| Condition | Mode |
|-----------|------|
| `.tap/product.md` missing | **Interview** — walk all five sections, require confirmation before write |
| `.tap/product.md` exists, < 90 days old | **Review** — prune-first protocol, diff, write on confirm |
| `.tap/product.md` exists, ≥ 90 days old | **Refresh** — staleness framing, then review protocol |

Never overwrite without explicit user confirmation of the final diff.

### 2. Read Inputs

Always read before asking anything (skip any that don't exist):

```
CLAUDE.md                     → stack signals, product hints
README.md                     → product description, audience
.tap/tap-audit.md             → readiness score, leverage points
.tap/system-health.md         → velocity, in-flight areas
.tap/architecture.md          → arch decisions (to avoid duplicating)
git log --oneline --since="90 days ago"   → recent focus signals
gh pr list --state merged --limit 30      → what shipped recently
```

For each input that doesn't exist or doesn't yield a useful signal, announce: "I couldn't infer [section] from [source] — starting cold for this one." Never block on missing inputs.

### 3. Run Interview / Review / Refresh

Pick the mode from step 1. Use the protocol below.

#### Mode: Interview (no file exists)

Walk the five sections in order. For each, present inferred starter content labeled with its source, then ask to confirm, edit, or discard. When nothing is inferrable, open-question.

**Before asking any Principle line, run the coaching loop below.** Sections 2 (Audience & pain) and 5 (Non-goals) each require a Principle line. These are the hardest part of the file — don't just ask "what's the principle?" and write down whatever comes back.

##### Principle coaching (use whenever a Principle line is requested)

Open with the definition:

> A Principle is the underlying belief that shapes decisions in this area.
> - Not a **goal** (the outcome you want — e.g., "grow to 100 customers").
> - Not a **feature** (a thing you built — e.g., "we have a self-serve onboarding").
> - Not a **preference** (a stylistic choice — e.g., "we like simple UIs").
>
> It's the thing that, if it stopped being true, would change how you decide.

Show 2-3 examples from `.tap/architecture.md`'s Principle lines (or the format spec's example if no `architecture.md` exists yet):

- `Principle: errors are data, not exceptions. Make error paths visible in types.` *(tells you what to build AND what to reject)*
- `Principle: separate orchestration from execution. Let the platform handle retry/state/recovery.` *(tells you what belongs where)*
- `Principle: most "state management" is actually server cache. Treat it that way.` *(reframes a whole class of decisions)*

Then ask the user to draft, and **pressure-test** with these three checks. Surface each check explicitly to the user:

1. *Is this the belief, or is it a goal / feature / preference?* If it names an outcome, a thing you shipped, or a taste, it's not a principle — ask what's underneath it.
2. *If this belief stopped being true, would you decide differently?* If not, it's too generic (e.g., "we care about users"). Push for the belief that actually changes calls.
3. *Can you restate this without naming the outcome you want?* Principles explain how you decide; they don't pre-announce the result.

Loop: user drafts → skill runs the three checks out loud → user refines. Typical convergence: 2-3 passes. Don't accept the first draft if it fails any check — say which check it failed and why.

**Section 1 — What we build**
- Inferred from: `README.md` description, `package.json` / `plugin.json` description, `gh repo view` description
- Present: `Inferred from README.md: "[quoted 1-3 sentences]". Keep, edit, or discard?`
- Cold prompt: `1-3 sentences: the product + who it's specifically for. Ground truth, not marketing. Use the third sentence only if your value prop is compound (e.g., product + delivery model).`

**Section 2 — Audience & pain**
- Inferred from: README ("who is this for" section), CLAUDE.md audience hints
- Usually cold. Ask directly:
  - `Who are the users, concretely? (role + context, not a persona archetype)`
  - `What pain hurts them most today that this product addresses?`
  - For the Principle line, **run the Principle coaching loop above** before accepting a draft. Frame: `What's the one belief about your audience that shapes every decision? (running pressure-test after your draft)`

**Section 3 — Current focus**
- Inferred from: `git log --oneline --since="90 days ago"` (group commit subjects), recent merged PR titles, `.tap/system-health.md` if it names in-flight areas
- Present: `Recent activity clusters around: [themes extracted from git log / PR titles]. Is the current focus one of these, or something else?`
- Prompts:
  - `The problem you're solving this quarter (not a feature list — the underlying problem)?`
  - `Insight: what data / users / tech showed you this was THE focus?`
  - `Success signal: the one measurable thing that tells you it's working?`

**Section 4 — Bets**
- Inferred from: Current focus (step 3 answer) + active feature branches (`git branch -r --sort=-committerdate | head -20`) + recent architectural decisions in `.tap/architecture.md`
- Present: `Given the focus above, it looks like these are in-flight: [list]. Are these your bets, or are the real bets different?`
- Prompt: `List 2-4 bets. For each: what you're trying + why you think it'll work.`

**Section 5 — Non-goals**
- Inferred from: nothing reliable. Usually cold.
- Prompts:
  - `What are you explicitly NOT doing this quarter, even though people ask for it?`
  - For the Principle line, **run the Principle coaching loop above** before accepting a draft. Frame: `Why does this boundary matter right now? State it as a belief, not as an outcome you want (running pressure-test after your draft).`

After all five sections, assemble the draft and go to step 4 (diff) → step 5 (write).

#### Mode: Review (file exists, < 90 days old)

Read the existing file. For each section, **prune before adding**:

1. Show the current content of the section.
2. Ask: `Still true? Anything stale or wrong?`
3. Only after pruning, ask: `Anything new to add here?`
4. Move to next section.

Do this for all five sections. Then assemble the revised draft and go to step 4.

#### Mode: Refresh (file exists, ≥ 90 days old)

Open with: `This file is [N] days old — what's shifted since it was written?`

Capture the top-line shifts before diving into sections. Then run the Review protocol (prune-first, section by section).

### 4. Show Diff

Assemble the full draft. Before writing:

**Length check**: count lines. If > 80:
```
Draft is [N] lines, over the 80-line ceiling. Which section should we compress?
- [section name]: [line count]
- [section name]: [line count]
...
```
Refuse to proceed until the draft is ≤ 80 lines.

**Duplication check**: for each section, scan `CLAUDE.md` and `.tap/architecture.md` for overlapping content. Report: `Detected overlap with [file]: "[text]". Removed from draft.`

**Present the diff**:
- For interview mode: show full draft.
- For review/refresh: show unified diff of current vs draft, with deletions displayed as prominently as additions (the pruning matters).

Ask: `Write this to .tap/product.md? (yes / edit / cancel)`

### 5. Write on Confirm

On `yes`:
- Create `.tap/` if it doesn't exist.
- Write `.tap/product.md`.
- Confirm write + line count.

On `edit`: loop back to step 4 with the requested changes.
On `cancel`: discard the draft. Do not write.

## Format reference

See [references/product-context-format.md](references/product-context-format.md) for the format spec, principles, and a full example. The draft assembled by this skill must conform to that format.

## Handoff

- **First-time run in a new repo** (interview mode completed) → recommend running `/tap-skills:tap-audit` next. `product.md` gives `tap-audit`'s new Strategic Context dimension a ✓.
- **When review/refresh surfaces a major shift in focus** → recommend `/tap-skills:tech-roadmap` to re-align the 12-month plan with the updated context.
- **When the user wants to codify product-strategic rules into enforceable checks** → not in scope here. That's the future `codify-opinion` skill.

## Boundaries

- Does NOT author or modify `.tap/architecture.md` (that's `/tap-skills:tap-audit`).
- Does NOT describe the tech stack, coding conventions, or commands (CLAUDE.md's job).
- Does NOT capture feature roadmaps, personas, team topology, or competitor positioning.
- Does NOT enforce freshness in CI — `/tap-skills:tap-audit`'s Strategic Context dimension scores it, but nothing blocks on it.
- Does NOT overwrite `.tap/product.md` without explicit user confirmation of the final diff.
