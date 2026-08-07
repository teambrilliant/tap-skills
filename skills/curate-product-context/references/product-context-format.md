# Product Context Format

`.tap/product.md` is a single compressed file of product-strategic context optimized for human + agent consumption. Vision, what we build, audience, current focus, bets, non-goals — the cathedral down to the walls. NOT a feature roadmap, persona doc, or market analysis.

## Principles

- **One file, not many** — agents and humans load one file, not scan a portfolio
- **Six sections only** — Vision / What we build / Audience & pain / Current focus / Bets / Non-goals
- **3-6 lines per section** — capture the principle, not the backstory (exception: `What we build` allows up to 3 sentences for compound value props)
- **≤ 80 lines total** — if it's longer, compress
- **No dates, status, authors, personas** — product context, not meeting notes
- **Never duplicates CLAUDE.md or `.tap/architecture.md`** — stack, patterns, system decisions live there

## Format

```markdown
# Product Context

## Vision
[1-2 sentences. How the customer's world is different 3-10 years out because this exists. A changed world, not a company outcome and not a bigger version of this quarter. `not yet articulated` is a valid value — write it rather than faking one.]

## What we build
[1-3 sentences. Product + who it's for. Ground truth, not marketing. Use the third sentence only if the value prop is compound — e.g., product + delivery model.]
How we win: [what makes this hard to copy — structural advantage, not a feature. `no structural advantage yet — competing on execution` is a valid and common answer.]

## Audience & pain
[Who the users are. The pain that hurts most today.]
Principle: [the one belief about our audience that shapes all decisions]

## Current focus
[The problem we're solving THIS quarter. Not a feature list.]
Insight: [what data/users/tech showed us that made this the focus]
Success signal: [the one measurable thing that tells us it's working]

## Bets
[2-4 bets we're making to address the focus. Each must be capable of being wrong.]
Each: [what we're trying + why we think it'll work] — kill: [what we'd have to see to stop]

## Non-goals
[What we're explicitly NOT doing now, and why.]
Principle: [why this boundary matters]
```

## Example

```markdown
# Product Context

## Vision
Consulting teams carry their own agent tooling from engagement to engagement, compounding it — instead of rebuilding the same workflows from scratch for every customer.

## What we build
A Claude Code plugin marketplace and distribution tool for consulting teams who ship agent-augmented workflows to customers. Delivered as a set of versioned skills rather than a SaaS — consultants install once per engagement and carry their own improvements forward.
How we win: every engagement compounds the skill bundle, so the tooling gets better the more customers we serve — a competitor starting today ships v1 against our accumulated set.

## Audience & pain
Consultants building with Claude Code for multiple customer repos. Today they copy-paste skills and lose track of which customer has which version.
Principle: consultants' leverage comes from reusable, versioned skill bundles — not per-engagement rewrites.

## Current focus
Make skill distribution trivially repeatable across customer repos.
Insight: two consulting engagements in Q1 each burned >1 day reinstalling the same skill set.
Success signal: new customer repo reaches "ready for agent work" in under 15 minutes.

## Bets
- Plugin marketplaces as primary distribution — fewer moving parts than scripts — kill: two engagements in a row where install still needs manual steps
- Each skill carries its own template/reference — no shared asset layer to version — kill: the same reference gets copy-edited in 3+ skills
- `.tap/` project memory as the contract between skills — one directory, known files — kill: agents keep missing the files because nothing points at them

## Non-goals
Not building a SaaS, not hosting customer data, not a CI enforcement layer this quarter.
Principle: the skill surface is the product; infrastructure is a distraction from getting to 3 live engagements.
```

## What NOT to include

- Feature roadmaps or ticket lists (belongs in issue tracker)
- Personas, jobs-to-be-done frameworks, competitor matrices (belongs in discovery docs)
- Team structure, OKRs, hiring plans (not product context — keep them wherever the org plans them)
- Anything already in `CLAUDE.md` (stack, conventions, commands) or `.tap/architecture.md` (system decisions)
- Dates, authors, status, revision history

## When to write

Via `/tap-skills:curate-product-context`. Do not author by hand after the skill exists — the skill's review/refresh modes enforce pruning and length.
