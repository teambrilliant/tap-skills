# <Atlas name>

Source of truth for **<what this atlas captures, one line>**. One surface: a <rowAxis>×<colAxis> coverage home (`index.html#/`) whose tiles open per-flow alignment grids (maps). Build detail does NOT live here — that's `thoughts/plans/`.

## Architecture

- `index.html` — the shell. Owns ALL rendering (home, stub, grid) + hash routing + runtime style injection from `window.ATLAS`. Maps never contain markup. Runs from `file://`, no build/server.
- `maps/*.js` — one data file per flow; self-registers via `window.<Registry>.register({...})` with a classic `<script src>` line at the bottom of `index.html` (ES modules break on `file://` — keep classic scripts).
- After editing, **hard-reload** (`file://` caches aggressively).

## The config block (top of index.html)

`window.ATLAS` is the only thing that changes per atlas: `title`, `registry`, `home` (type + axes + facets + strip label + intro), `layers` (presets by map type), `lovDefault`, `status` (vocabulary → label/fill/border). The engine below it is generic — do not edit it to add a map.

## Adding or updating a flow

1. Create/edit `maps/<kebab-id>.js`; add one `<script src>` line in `index.html`.
2. Start as a **stub** (`status:"stub"`, `wouldAnswer:[...]`). Promote to `mapped` by adding `steps[]`.
3. Bump `updated`.
4. Verify in a browser: home tile lands in the right cell, `#/map/<id>` renders, no console errors, no literal `false`/`undefined` in cells (falsy data leaks as text if a kind is mishandled).

## Cell kinds (the closed set the renderer understands)

`html` (default — trusted local HTML), `quote`, `mot` (`{level,text}`; `level:2` = ★★, reserved for the 1–2 make-or-break steps), `status` (`[{k}]` from the status vocab; drives the filter), `acceptance` (`string[]` or `{text,optional}[]`), `kv` (`[{k,v,todo}]`). Express risk/belief/spoken as `html` cells (`<span class="risk-text">`, `<strong>`, a `spoken` badge).

## Conventions (hard rules)

- **Text always black.** Status/layers convey meaning via fills + borders, never colored text.
- **★★ is reserved** for the one or two make-or-break moments. Everything else is ★.
- **One home placement per map** — don't spread a map across cells to fake coverage; use `coveredBy` on the other flow's stub.
- **Empty cells are the point** — unmapped territory stays visible. Stubs carry `wouldAnswer[]`.
- Cell content is trusted local HTML; keep steps independently legible.
