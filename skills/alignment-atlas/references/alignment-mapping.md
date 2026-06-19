# Alignment mapping — elicitation reference

An alignment diagram puts what people **do/think/feel** alongside what the org **does backstage**, aligned across a sequence, to expose value and gaps. This atlas is its navigable, git-committable form. The skill's job is the _elicitation_ — the HTML is the receipt.

## The two axes of one grid

- **Steps (columns)** = the points in the flow's sequence. Name each as an event ("Order placed"), not a feature. 4–9 steps is typical.
- **Layers (rows)** = the perspectives/layers. Front-stage layers (what the user experiences) sit above the **line of visibility**; back-stage layers (org systems, data) below it.

## What to elicit, per flow

1. **The frame** — who's the primary actor, where does the flow start and end.
2. **The steps** — the sequence. Stop when the next step is a different flow.
3. **Per layer, per step** — fill the cell or leave it deliberately empty. Quote the user's actual words for `thinking`.
4. **Moments of truth** — find the 1–2 steps where the whole flow is won or lost → `mot.level:2` (★★). Lesser pivots → ★. If everything is ★★, nothing is.
5. **Line of visibility** — which layer is the last front-stage one (`lovAfter`).
6. **Status** — per back-stage cell, where does reality stand (works / to-wire / stub / live, per the atlas vocab).
7. **Acceptance** — for product atlases, the testable behavior at each step (feeds shaping-work).

## Coverage honesty

A flow you can't fill yet is a **stub**, not an omission: `status:"stub"` + `wouldAnswer[]` (the questions mapping it would answer). Empty home cells mean "nobody has named this flow" — leave them visible. Promote stub → partial → mapped as you learn.

## Choosing layers (the per-atlas decision)

Layers are the perspectives that matter for _this_ subject. Product flows: Customer / Partner / Org(backstage). Operating loops: You / Engine / Platform / Audience / Business. Pick 3–5; more than 5 and the grid stops being legible. This is the single most important scaffold decision — derive it from who the subject serves (run product-thinker first if unsure).
