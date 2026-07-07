---
name: render-doc
description: Deterministically convert a markdown doc (plan, research, shape, report) into one self-contained HTML file with house styling, TOC, checklists, and mermaid support. Use when someone says "render this doc", "render this plan", "make this markdown a web page", "convert md to html", "make this plan shareable as HTML", or before publishing a markdown doc with tap-skills:dossier-publish. NOT for authoring content — the markdown is the source of truth; this only renders it.
---

# Render Doc

Convert a markdown file into a single self-contained HTML file. The conversion is a
**deterministic script** — never hand-write or "improve" the HTML output, and never edit
the generated `.html` directly. To change the page, change the markdown and re-render.

## Usage

```bash
# single doc
bun <this-skill-dir>/scripts/render.ts <input.md> [output.html]

# markdown TREE → linked multi-page bundle (e.g. a docs/ catalog)
bun <this-skill-dir>/scripts/render-tree.ts <docs-dir> [outdir]
```

Tree mode renders every `.md` preserving directory structure (`README.md` → `index.html` at
each level), copies non-md files (images etc.) as-is, and writes a publishable bundle to
`outdir` (default: a `dossier-site` temp dir; never renders into the source tree). Relative
`.md` links in docs are rewritten to `.html` at view time, so cross-doc navigation works.
Publish the outdir as a directory bundle with `tap-skills:dossier-publish`.

- Output defaults to the input path with `.html` extension (sibling of the source).
- Frontmatter (`---` block) becomes the header band; `title:` overrides the doc title,
  otherwise the first `# heading` is used.
- ```mermaid blocks are rendered as diagrams; the mermaid library (~2.7MB) is embedded
  **only when** such a block exists — plain docs stay ~40KB.
- The original markdown is embedded losslessly (JSON-encoded, `<`-escaped) in a
  `<script type="application/json" id="src">` block — recoverable from the HTML via
  `JSON.parse`, so the rendered file still carries its exact source.

## Behavior contract

- Works from `file://` — no network, no CDN, no build step (vendored marked/mermaid inlined).
- GFM: tables, task lists (`- [ ]`), code blocks, blockquotes. Light/dark via system theme.
- Re-rendering the same md produces the same HTML (modulo embedded md) — safe to regenerate
  on every edit.

## Workflow fit

1. A planning skill produces `thoughts/plans/<name>.md` (or research/shape doc).
2. `render.ts` → `<name>.html` next to it.
3. Optionally publish: `/tap-skills:dossier-publish` uploads the HTML (and the md as source) to
   teambrilliant.dev.

Do not commit generated `.html` files unless asked — like the `thoughts/` sources, they are
working artifacts.
