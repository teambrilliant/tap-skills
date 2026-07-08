import { execSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { basename, join, relative, resolve } from "node:path"

const HOST = process.env["DOSSIER_HOST"] ?? "teambrilliant.dev"
const TOKEN = process.env["DOSSIER_TOKEN"]
const API = process.env["DOSSIER_API"] ?? `https://${HOST}/v1`
const KEYS_DIR = join(homedir(), ".config", "dossier")
const KEYS_PATH = join(KEYS_DIR, "keys.json")

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function str(value: Record<string, unknown>, key: string): string | null {
  const v = value[key]
  return typeof v === "string" ? v : null
}

function loadKeys(): Record<string, string> {
  if (!existsSync(KEYS_PATH)) return {}
  const parsed: unknown = JSON.parse(readFileSync(KEYS_PATH, "utf8"))
  if (!isRecord(parsed)) return {}
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(parsed)) if (typeof v === "string") out[k] = v
  return out
}

function saveKey(siteId: string, key: string): void {
  const keys = loadKeys()
  keys[siteId] = key
  mkdirSync(KEYS_DIR, { recursive: true })
  writeFileSync(KEYS_PATH, JSON.stringify(keys, null, 2))
}

function detectNamespace(): string {
  try {
    const url = execSync("git remote get-url origin", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim()
    const name = basename(url).replace(/\.git$/, "").toLowerCase()
    return name.length > 0 ? name : "scratch"
  } catch {
    return "scratch"
  }
}

function requireToken(): string {
  if (TOKEN === undefined || TOKEN.length === 0) {
    console.error("DOSSIER_TOKEN is not set")
    process.exit(1)
  }
  return TOKEN
}

async function req(method: string, path: string, bearer: string, body?: unknown): Promise<Response> {
  const headers: Record<string, string> = { Authorization: `Bearer ${bearer}` }
  if (body !== undefined) headers["Content-Type"] = "application/json"
  return fetch(`${API}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

async function fail(context: string, res: Response): Promise<never> {
  console.error(`${context}: ${res.status} ${await res.text()}`)
  process.exit(1)
}

async function jsonOf(res: Response): Promise<Record<string, unknown>> {
  const parsed: unknown = await res.json()
  return isRecord(parsed) ? parsed : {}
}

function splitSiteId(value: string): [string, string] {
  const [ns, slug] = value.split("/")
  if (ns === undefined || slug === undefined || ns.length === 0 || slug.length === 0) {
    console.error(`expected <namespace>/<slug>, got: ${value}`)
    process.exit(1)
  }
  return [ns, slug]
}

async function keyFor(siteId: string): Promise<string> {
  const cached = loadKeys()[siteId]
  if (cached !== undefined) return cached
  const [ns, slug] = splitSiteId(siteId)
  const res = await req("POST", `/sites/${ns}/${slug}/rotate-key`, requireToken())
  if (res.status === 404) {
    console.error(
      `${siteId} does not exist — create it first: bun dossier.ts publish <file.html|dir> --slug=${slug} --namespace=${ns}`,
    )
    process.exit(1)
  }
  if (!res.ok) await fail(`cannot recover update_key for ${siteId}`, res)
  const data = await jsonOf(res)
  const key = str(data, "update_key")
  if (key === null) await fail(`rotate-key returned no key for ${siteId}`, res)
  saveKey(siteId, key)
  return key
}

function flagValue(args: string[], name: string): string | undefined {
  const found = args.find((a) => a.startsWith(`--${name}=`))
  return found?.slice(name.length + 3)
}

function readDoc(inputPath: string): { html: string; sourceMd: string | undefined; isDir: boolean } {
  const isDir = statSync(inputPath).isDirectory()
  const htmlPath = isDir ? join(inputPath, "index.html") : inputPath
  const html = readFileSync(htmlPath, "utf8")
  const sourceCandidate = isDir ? null : inputPath.replace(/\.html$/, ".md")
  const sourceMd =
    sourceCandidate !== null && sourceCandidate !== inputPath && existsSync(sourceCandidate)
      ? readFileSync(sourceCandidate, "utf8")
      : undefined
  return { html, sourceMd, isDir }
}

async function uploadAssets(namespace: string, slug: string, inputPath: string): Promise<void> {
  const key = await keyFor(`${namespace}/${slug}`)
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((f) => {
      if (f.startsWith(".") || f === "CLAUDE.md") return []
      const p = join(dir, f)
      return statSync(p).isDirectory() ? walk(p) : [p]
    })
  for (const file of walk(inputPath)) {
    const rel = relative(inputPath, file)
    if (rel === "index.html") continue
    const res = await fetch(
      `${API}/sites/${namespace}/${slug}/assets?relative_path=${encodeURIComponent(rel)}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${key}` },
        body: new Uint8Array(readFileSync(file)),
      },
    )
    if (!res.ok) await fail(`asset ${rel} failed`, res)
    console.log(`  asset ${rel}`)
  }
}

const [command, target, ...rest] = process.argv.slice(2)

if (command === "publish" && target !== undefined) {
  const token = requireToken()
  const inputPath = resolve(target)
  const slug =
    flagValue(rest, "slug") ??
    basename(inputPath).replace(/\.(html|md)$/, "").toLowerCase().replace(/[^a-z0-9-]+/g, "-")
  const namespace = flagValue(rest, "namespace") ?? detectNamespace()
  const siteId = `${namespace}/${slug}`
  const doc = readDoc(inputPath)
  const only = flagValue(rest, "only")

  const createRes = await req("POST", "/sites", token, {
    namespace,
    slug,
    html: doc.html,
    source_md: doc.sourceMd,
    restricted_to:
      only === undefined
        ? undefined
        : only.split(",").map((s) => s.trim()).filter((s) => s.length > 0),
  })
  if (createRes.status === 409) {
    const data = await jsonOf(createRes)
    const title = str(data, "title")
    const updated = str(data, "updated_at")
    const version = data["version"]
    console.error(
      `${siteId} already exists` +
        (title !== null ? `: "${title}"` : "") +
        (typeof version === "number" ? ` (v${String(version)}` : " (") +
        (updated !== null ? `, updated ${updated})` : ")"),
    )
    console.error(`  update that doc:   bun dossier.ts republish ${siteId} ${target}`)
    console.error(`  or distinct slug:  bun dossier.ts publish ${target} --slug=<project>-${slug}`)
    process.exit(1)
  }
  if (createRes.status !== 201) await fail("publish failed", createRes)
  const data = await jsonOf(createRes)
  const url = str(data, "url")
  const updateKey = str(data, "update_key")
  if (updateKey !== null) saveKey(siteId, updateKey)
  console.log(`published ${url ?? siteId}`)
  const restrictedTo = data["restricted_to"]
  if (Array.isArray(restrictedTo) && restrictedTo.length > 0)
    console.log(`  restricted to: ${restrictedTo.join(", ")}`)
  if (doc.isDir) await uploadAssets(namespace, slug, inputPath)
} else if (command === "republish" && target !== undefined && rest[0] !== undefined) {
  const [ns, slug] = splitSiteId(target)
  const inputPath = resolve(rest[0])
  const doc = readDoc(inputPath)
  const key = await keyFor(target)
  const putRes = await req("PUT", `/sites/${ns}/${slug}`, key, {
    html: doc.html,
    source_md: doc.sourceMd,
  })
  if (!putRes.ok) await fail("republish failed", putRes)
  const data = await jsonOf(putRes)
  console.log(`republished https://${HOST}/${target}/ (v${String(data["version"])})`)
  if (doc.isDir) await uploadAssets(ns, slug, inputPath)
} else if (command === "pull" && target !== undefined) {
  const token = requireToken()
  const [ns, slug] = splitSiteId(target)
  const sourceRes = await req("GET", `/sites/${ns}/${slug}/source`, token)
  if (!sourceRes.ok) await fail("pull failed", sourceRes)
  const commentsRes = await req("GET", `/sites/${ns}/${slug}/comments`, token)
  const outDir = rest[0] !== undefined ? resolve(rest[0]) : process.cwd()
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, `${slug}.md`), await sourceRes.text())
  if (commentsRes.ok)
    writeFileSync(
      join(outDir, `${slug}.comments.json`),
      JSON.stringify(await jsonOf(commentsRes), null, 2),
    )
  console.log(`pulled ${target} → ${join(outDir, `${slug}.md`)} (+ ${slug}.comments.json)`)
} else if (command === "list") {
  const res = await req("GET", target !== undefined ? `/sites?namespace=${target}` : "/sites", requireToken())
  if (!res.ok) await fail("list failed", res)
  console.log(JSON.stringify(await jsonOf(res), null, 2))
} else if (command === "comment" && target !== undefined) {
  const token = requireToken()
  const [ns, slug] = splitSiteId(target)
  const body = rest.join(" ")
  if (body.length === 0) {
    console.error("usage: comment <ns/slug> <text>")
    process.exit(1)
  }
  const res = await req("POST", `/sites/${ns}/${slug}/comments`, token, { body })
  if (!res.ok) await fail("comment failed", res)
  console.log("comment posted")
} else if (command === "share" && target !== undefined) {
  const [ns, slug] = splitSiteId(target)
  const password = flagValue(rest, "password")
  const key = await keyFor(target)
  const res = await req(
    "POST",
    `/sites/${ns}/${slug}/share`,
    key,
    password !== undefined ? { password } : {},
  )
  if (!res.ok) await fail("share failed", res)
  console.log(JSON.stringify(await jsonOf(res), null, 2))
} else if (command === "unshare" && target !== undefined) {
  const [ns, slug] = splitSiteId(target)
  const key = await keyFor(target)
  const res = await req("DELETE", `/sites/${ns}/${slug}/share`, key)
  if (!res.ok) await fail("unshare failed", res)
  console.log("share revoked")
} else if (command === "restrict" && target !== undefined) {
  const [ns, slug] = splitSiteId(target)
  const only = flagValue(rest, "only")
  if (only === undefined) {
    console.error("usage: restrict <ns/slug> --only=me | --only=a@x,b@y | --only=org")
    process.exit(1)
  }
  const payload = {
    restricted_to:
      only === "org" ? null : only.split(",").map((s) => s.trim()).filter((s) => s.length > 0),
  }
  let res = await req("POST", `/sites/${ns}/${slug}/restrict`, requireToken(), payload)
  if (res.status === 401)
    res = await req("POST", `/sites/${ns}/${slug}/restrict`, await keyFor(target), payload)
  if (!res.ok) await fail("restrict failed", res)
  const data = await jsonOf(res)
  const list = data["restricted_to"]
  console.log(Array.isArray(list) ? `restricted to: ${list.join(", ")}` : "org-visible")
} else if (command === "delete" && target !== undefined) {
  const [ns, slug] = splitSiteId(target)
  const key = await keyFor(target)
  const res = await req("DELETE", `/sites/${ns}/${slug}`, key)
  if (!res.ok) await fail("delete failed", res)
  console.log(`deleted ${target}`)
} else {
  console.error(`usage:
  bun dossier.ts publish <file.html|dir> --slug=x [--namespace=x] [--only=me|a@x,...]   # create; never overwrites
  bun dossier.ts republish <ns/slug> <file.html|dir>                # update; same URL, new version
  bun dossier.ts pull <ns/slug> [outdir]
  bun dossier.ts list [namespace]
  bun dossier.ts comment <ns/slug> <text>
  bun dossier.ts share <ns/slug> [--password=x]
  bun dossier.ts unshare <ns/slug>
  bun dossier.ts restrict <ns/slug> --only=me|a@x,b@y|org   # viewer allowlist (keyed)
  bun dossier.ts delete <ns/slug>

env: DOSSIER_TOKEN (required), DOSSIER_HOST (default teambrilliant.dev), DOSSIER_API (override for local dev)`)
  process.exit(1)
}
