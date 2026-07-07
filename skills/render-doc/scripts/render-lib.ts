import { readFileSync } from "node:fs"
import { join } from "node:path"

const skillDir = join(import.meta.dir, "..")
const template = readFileSync(join(skillDir, "references", "doc-template.html"), "utf8")
const markedSource = readFileSync(join(skillDir, "references", "vendor", "marked.min.js"), "utf8")
let mermaidSource: string | null = null

export type Rendered = { html: string; title: string; hasMermaid: boolean }

export type TreeContext = {
  // relative prefix from this page to the bundle root, e.g. "../"
  prefix: string
  siteTitle: string
  // wiki-link name → bundle-root-relative .html path
  map: Record<string, string>
}

export function renderHtml(raw: string, fallbackTitle: string, tree?: TreeContext): Rendered {
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n/)
  const frontmatter: Record<string, string> = {}
  if (fmMatch?.[1] !== undefined) {
    for (const line of fmMatch[1].split("\n")) {
      const idx = line.indexOf(":")
      if (idx > 0) frontmatter[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
    }
  }
  const markdown = fmMatch !== null ? raw.slice(fmMatch[0].length) : raw

  const headingMatch = markdown.match(/^#\s+(.+)$/m)
  const title = frontmatter["title"] ?? headingMatch?.[1] ?? fallbackTitle

  const hasMermaid = /^```mermaid\s*$/m.test(markdown)
  if (hasMermaid && mermaidSource === null)
    mermaidSource = readFileSync(join(skillDir, "references", "vendor", "mermaid.min.js"), "utf8")

  const metaHtml = Object.entries(frontmatter)
    .map(([k, v]) => `<span class="fm"><b>${escapeHtml(k)}</b>${escapeHtml(v)}</span>`)
    .join("")

  const html = template
    .replaceAll("__TITLE__", () => escapeHtml(title))
    .replace("__FRONTMATTER__", () => metaHtml)
    .replace("__MARKED__", () => markedSource)
    .replace("__MERMAID__", () => (hasMermaid && mermaidSource !== null ? mermaidSource : ""))
    .replace("__MARKDOWN_JSON__", () => JSON.stringify(markdown).replaceAll("<", "\\u003c"))
    .replace("__TREE_JSON__", () =>
      tree === undefined ? "" : JSON.stringify(tree).replaceAll("<", "\\u003c"),
    )

  return { html, title, hasMermaid }
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}
