---
name: alignment-atlas
description: Generate and maintain an alignment-diagram atlas — a self-contained file:// viewer in a target directory (default `.tap/diagrams/atlas/`; supports several atlases per repo, e.g. per PARA area) whose tiles open per-flow alignment grids (layers × steps, line of visibility, moments of truth, coverage honesty). Use when someone says "alignment diagram", "alignment map", "experience atlas", "map this flow", "diagram how this works end to end", "service blueprint", "Kalbach map", or wants one navigable surface showing how a product behaves / an engine runs, flow by flow. Auto-detects scaffold / map-a-flow / review mode. Outputs to `.tap/diagrams/atlas/`.
---

# Alignment Atlas

Build and maintain a navigable **alignment diagram** — what people do/think/feel aligned against what the org does backstage, across a sequence, rendered as a self-contained `file://` SPA in the repo. The value is the _elicitation_ (force every layer×step cell, name the moments of truth, draw the line of visibility, be honest about coverage); the HTML is the durable, shareable, git-committable receipt.

This skill does NOT capture build plans (those live in `thoughts/plans/`), the tech stack (CLAUDE.md), or architectural decisions (`.tap/architecture.md`). It captures **how something behaves/runs, flow by flow**.

See [references/alignment-mapping.md](references/alignment-mapping.md) for the elicitation method and [references/atlas-spec.md](references/atlas-spec.md) for the in-atlas spec. The renderer is [references/renderer.html](references/renderer.html); the worked map is [references/example-map.js](references/example-map.js).

## Process

0. Check state
1. Auto-detect mode
2. Read inputs
3. Run scaffold / map-a-flow / review
4. Show diff
5. Write on confirm + verify in browser

### 0. Resolve Location & Check State

Atlases are **not** at a fixed path — one repo can hold several (e.g. one atlas per PARA area). Resolve the target atlas root first; the default is `.tap/diagrams/atlas/`.

1. **Explicit** — the request names a directory or area → atlas root = the path given, or `<area>/diagrams/atlas/`. E.g. "set up an atlas for the emma area" in a PARA repo → `areas/emma/diagrams/atlas/`.
2. **Discover** — otherwise, find existing atlases (an atlas = a directory whose `index.html` contains `window.ATLAS`): `grep -rl 'window.ATLAS' --include=index.html .` then take each match's directory (plus the default root).
   - **0 found** → Scaffold. Default root `.tap/diagrams/atlas/`; if the repo looks like PARA (top-level `areas/` or `projects/`), propose the area-local root and confirm before writing.
   - **1 found** → use it, unless the request names a different one.
   - **≥2 found** → list them by title (from each atlas's `CLAUDE.md` / `window.ATLAS.title`); infer the target from the area/flow named, else ask which.
3. Set `$ATLAS` to the resolved root, then check state:

```bash
[[ -f "$ATLAS/index.html" ]] && echo "atlas exists" || echo "no atlas"
[[ -d "$ATLAS/maps" ]] && ls "$ATLAS/maps"/*.js 2>/dev/null
```

### 1. Auto-detect Mode

| Condition                                                                | Mode                                                        |
| ------------------------------------------------------------------------ | ----------------------------------------------------------- |
| no atlas at the resolved `$ATLAS`                                        | **Scaffold** — interview the frame, then stand up the atlas |
| atlas exists + request names/implies a flow to add or update             | **Map-a-flow** — elicit one grid                            |
| atlas exists + request is "review" / "what's missing" / no specific flow | **Review** — surface coverage gaps & stubs                  |

Never overwrite a file without showing the diff and getting confirmation.

### 2. Read Inputs

Read before asking (skip any that don't exist):

```
.tap/product.md          → subject, audience → candidate layers (who the flow serves)
.tap/architecture.md     → systems/data → backstage layer content + real code anchors
.tap/design/*brand*      → brand tokens (fonts, palette) for the config block
README.md / CLAUDE.md    → what the product/repo is
existing maps/*.js        → established layer preset, status vocab, axes (match them)
```

If a brand file exists, lift fonts + palette into the config block; else keep the neutral default.

### 3. Run the mode

#### Mode: Scaffold (no atlas exists)

Interview the **frame** — the decisions baked into the config block. Present an inferred starter for each (labeled with its source) and ask to confirm/edit:

1. **Subject** — what does this atlas capture? ("how the product behaves" / "how the engine runs").
2. **Home layout** — `coverage` (tiles placed in a rowAxis×colAxis matrix — most products) or `facet` (one map per row, columns are facets — e.g. topic×platform). Then the axes/facets themselves.
3. **Layers** — the 3–5 perspectives that are the grid rows. The most important call; run the layer-choosing guidance in `references/alignment-mapping.md` (and `product-thinker` if the audience is unclear). Front-stage layers above the line of visibility, back-stage below; set `lovDefault`.
4. **Status vocabulary** — the per-cell states for this subject (e.g. works/to-wire/stub/live, or proven/tested/unproven), each with a label + fill + border.
5. **Brand** — from `.tap/design/*brand*` or the default.

Then write into `$ATLAS/`: `index.html` (copy `references/renderer.html`, fill the `window.ATLAS` config block + title/meta + font links), `CLAUDE.md` (from `references/atlas-spec.md`, specialized), `maps/example.js` (from `references/example-map.js`, registry name matched), and confirm the example `<script src>` line is present. Tell the user to open `index.html` and replace the example with their first real flow (→ map-a-flow).

#### Mode: Map-a-flow (atlas exists)

Elicit ONE flow as a grid, using `references/alignment-mapping.md`:

- Frame (primary actor, start/end), then the **steps** (the sequence).
- For each layer × step: fill the cell or leave it deliberately empty. Quote real user words for `thinking`/quote cells.
- Find the **1–2 moments of truth** (`mot.level:2` = ★★). Set `lovAfter` if it differs from the default.
- Per back-stage cell: **status** from the atlas vocab; for product atlases, **acceptance** (testable behavior).
- If the flow isn't ready, write a **stub** (`status:"stub"` + `wouldAnswer[]`) instead and stop.
  Write `maps/<kebab-id>.js` conforming to the envelope below, add one `<script src>` line before `</body>`, bump `updated`. Match the existing layer preset and status vocab — don't invent new ones mid-atlas.

#### Mode: Review (atlas exists)

List every map with status, the blank home cells (named-but-unmapped vs nobody-named), and stubs whose `wouldAnswer[]` could now be filled. Recommend the next map to promote. Offer per-map edits; apply on confirm.

### 4. Show Diff

Show the new/changed file(s) (full content for a new map; unified diff for edits). For scaffold, list the four files to be written. Ask: `Write these? (yes / edit / cancel)`.

### 5. Write on Confirm + Verify

On `yes`: write the files (create `$ATLAS/` if needed). Then **verify in a browser** (Chrome DevTools MCP preferred; manual fallback otherwise):

- Open `file://…/index.html`. **After any edit, force a FULL document reload** — DevTools `navigate {type:"reload", ignoreCache:true}`, or Cmd-Shift-R. ⚠️ A hash change alone (`#/` ↔ `#/map/x`) does **not** re-fetch `index.html`, so edits to the renderer or maps won't appear (`file://` + in-page routing). This is the #1 "why isn't my change showing" trap.
- Home renders; the new/changed tile lands in the right cell; `#/map/<id>` renders the grid.
- `list_console_messages` → zero errors.
- `grep -o '__[A-Z_]*__' index.html` → **no matches** (no unfilled scaffold placeholders shipped).
- Grep the rendered grid for literal `false` / `undefined` / `[object Object]` — none (the documented falsy-leak footgun).
  Report what rendered. On `edit`: loop to step 4. On `cancel`: write nothing.

## Data envelope (every map)

```js
window.<Registry>.register({
  id, title, type,                 // type selects the layer preset
  status: "mapped" | "partial" | "stub",
  updated: "YYYY-MM-DD",
  summary,                          // tile + stub description
  cell: { rows:[...], cols:[...] }, // coverage home placement; omit → strip
  row: {label, sub}, facets: {...}, // facet home only (instead of cell)
  source, coveredBy:{map,note},     // provenance / partial-coverage link
  wouldAnswer: [...],               // stubs only
  goal: {kind, text},               // optional banner
  stepWord, lovAfter,               // stepWord: column label (default "STEP") · lovAfter: line-of-visibility layer
  steps: [ { num, title, tag, cells: { [layerId]: { [rowKey]: value } } } ],
})
```

> **`cell.rows`/`cols` are the EXACT cells the tile occupies — not a span.** Listing N columns renders the SAME card in each of the N cells (there is no colspan). For a single, clean placement use **one** row and **one** col. (Multi-cell "bands" duplicate the card and read as a bug.)

Cell value by kind: `html`=string · `quote`=string · `mot`={level,text} · `status`=[{k}] · `acceptance`=string[]|{text,optional}[] · `kv`=[{k,v,todo}].

## Handoffs

- **Unsure who the flow serves / what the layers should be** → `/dev-skills:product-thinker` (the user defines the layers).
- **A mapped flow's acceptance rows are ready to build** → `/dev-skills:shaping-work` then `/dev-skills:implementation-planning` (the grid feeds shaping).
- **First scaffold in a new repo** → recommend `/tap-skills:curate-product-context` so `.tap/product.md` can seed future layers.

## Boundaries

- Ships ONE view per map: the layers×steps grid. `journey` / `blueprint` / `mental-model` / system-map types are reserved, not implemented (render as stubs). An atlas may host many maps of different `type`s (flow + non-flow reference grids); the home composes them (grid + strip).
- Does NOT author `.tap/product.md`, `.tap/architecture.md`, or `thoughts/plans/`.
- Does NOT invent a brand system — detects `.tap/design/*brand*` or uses the neutral default.
- Does NOT overwrite any atlas file without showing the diff and getting confirmation.

## Patterns

### Cockpit layout (premise-first)

The grid maps _flows_. For an operating surface you often also want **premise** — non-flow context (what's sold, the economics, who it's for, positioning). Don't grid-ify premise:

- Give premise maps **no `cell`** → they fall to the strip (off-grid, still openable). Use a non-flow layer `type` (e.g. `offer` with rows get/pay/risk/proof, `lov:false`, `stepWord:"RUNG"`).
- Surface the premise band at the **top**: `home.stripPosition:"top"` + `home.stripAlign:"grid"` (cards align under the columns). Carry headline context + links in `home.intro` (it renders HTML).
- Result reads premise → motion (the flow grid) → meta. The grid stays pure flow-mapping.

**Multiple layer presets per atlas are supported and encouraged** — `layers` is keyed by map `type`. A flow type (`customer`/`org` rows) and reference types (`offer`/`money`) can coexist; each map picks its `type`.

> `stripPosition` / `stripAlign` apply to the **coverage** home only — they're silent no-ops in `facet` mode (the cockpit pattern is a coverage home).

