import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { basename, resolve } from "node:path"
import { renderHtml } from "./render-lib"

const input = process.argv[2]
if (input === undefined) {
  console.error("usage: bun render.ts <input.md> [output.html]")
  process.exit(1)
}
const inputPath = resolve(input)
if (!existsSync(inputPath)) {
  console.error(`no such file: ${inputPath}`)
  process.exit(1)
}
const outputPath =
  process.argv[3] !== undefined ? resolve(process.argv[3]) : inputPath.replace(/\.md$/, ".html")

const { html, hasMermaid } = renderHtml(readFileSync(inputPath, "utf8"), basename(inputPath, ".md"))
writeFileSync(outputPath, html)
console.log(
  `${outputPath} (${Math.round(html.length / 1024)}KB${hasMermaid ? ", mermaid embedded" : ""})`,
)
