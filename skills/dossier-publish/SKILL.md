---
name: dossier-publish
description: Publish docs (plans, research, shapes, alignment atlases) to the private Dossier platform at teambrilliant.dev, pull them back with comments on any machine, and manage external share links. Use when someone says "publish to dossier", "dossier publish", "publish this doc/plan", "push this to teambrilliant.dev", "share this doc with the team", "share this externally", "pull the plan from dossier", "get the comments on the doc", or when resuming work on a plan that lives on Dossier. Scope guard - "publish" alone is ambiguous (npm, blog, git); this skill is only for the Dossier doc platform. Requires DOSSIER_TOKEN in the environment. Pairs with tap-skills:render-doc, which produces the HTML this skill uploads.
---

# Dossier Publish

Client for the team's private doc platform (`teambrilliant.dev`) — org-SSO reads for humans,
token API for agents, per-doc external sharing, permanent page-level comments.

All commands:

```bash
bun <this-skill-dir>/scripts/dossier.ts <command> ...
```

`DOSSIER_TOKEN` must be set (minted by the platform operator; see dossier repo
`scripts/mint-token.ts`). `DOSSIER_API` overrides the endpoint for local dev.

## Name the doc, then publish (first time)

Slug rules — set identity explicitly; never rely on the filename default:

- Always pass `--slug`.
- If the doc lives under a project/area directory, prefix the slug with the project:
  `areas/emma/diagrams/atlas` → `--slug=emma-atlas`. The slug and URL should answer
  "whose atlas?" on their own.
- Give the doc's H1/`<title>` the same identity ("Emma — Alignment Atlas") — the home
  page lists and searches by title.

```bash
# markdown docs: render first (deterministic), then publish — the sibling .md is
# uploaded automatically as the doc's source for round-trip pulls
bun <render-doc-skill-dir>/scripts/render.ts thoughts/plans/my-plan.md
bun scripts/dossier.ts publish thoughts/plans/my-plan.html --slug=emma-auth-plan

# directory bundles (e.g. an alignment atlas)
bun scripts/dossier.ts publish areas/emma/diagrams/atlas --slug=emma-atlas

# markdown docs TREE: render to a bundle first
bun <render-doc-skill-dir>/scripts/render-tree.ts docs/behavior-catalog
bun scripts/dossier.ts publish <printed outdir> --slug=behavior-catalog
```

`publish` **creates** — if the slug is already taken it stops and tells you what lives
there; it never overwrites.

## Update a published doc

```bash
bun scripts/dossier.ts republish <ns>/<slug> <file.html|dir>
# same URL, new version, comments intact; bundle assets re-uploaded
```

Bundle notes: dotfiles and `CLAUDE.md` are never uploaded; comments attach to the bundle
as a whole (one thread, shown on every page).

- Namespace defaults to the current repo name (git remote); `--namespace=scratch` for
  repo-less docs. URL: `https://teambrilliant.dev/<namespace>/<slug>/`.
- `update_key`s are cached in `~/.config/dossier/keys.json` (machine-local). On a fresh
  machine the script recovers access automatically by rotating the key with your token.

## Continue work from another machine (the round-trip)

```bash
bun scripts/dossier.ts pull <namespace>/<slug> [outdir]   # → <slug>.md + <slug>.comments.json
# ...edit the md, re-render, then: republish <ns>/<slug> <file.html> — same URL, comments intact
```

**Always `pull` before resuming work** on a doc that lives on the platform — someone (or
some agent) may have republished or commented since your local copy.

## Comments

```bash
bun scripts/dossier.ts comment <ns>/<slug> "text"   # post as the token identity
```

Humans comment in the browser (widget on every org page). Comments attach to the doc, not
the version — they survive republishing and record the version they were made against.

## External sharing (off by default)

```bash
bun scripts/dossier.ts share <ns>/<slug>                    # anyone with the link
bun scripts/dossier.ts share <ns>/<slug> --password=SECRET  # link + password
bun scripts/dossier.ts unshare <ns>/<slug>                  # revoke immediately
```

Share links are bearer credentials — prefer `--password` for client-data docs, and never
publish anything credential-bearing. Re-sharing mints a fresh URL; old links stay dead.

## Housekeeping

```bash
bun scripts/dossier.ts list [namespace]
bun scripts/dossier.ts delete <ns>/<slug>   # removes doc, versions, comments (offboarding)
```
