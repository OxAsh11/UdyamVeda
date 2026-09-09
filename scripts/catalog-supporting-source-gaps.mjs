import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const evidenceDir = path.join(root, 'docs', 'catalog-review-evidence')
const args = new Map()
for (let index = 2; index < process.argv.length; index += 1) {
  const key = process.argv[index]
  const value = process.argv[index + 1]
  if (key.startsWith('--')) args.set(key, value)
}
const offset = Number.parseInt(args.get('--offset') ?? '0', 10)
const limit = Number.parseInt(args.get('--limit') ?? '0', 10)
const sourceFiles = [
  ...fs.readdirSync(path.join(root, 'supabase', 'migrations')).filter(file => file.endsWith('.sql')).sort().map(file => path.join(root, 'supabase', 'migrations', file)),
  ...fs.readdirSync(path.join(root, 'supabase', 'seed')).filter(file => file.endsWith('.sql')).sort().map(file => path.join(root, 'supabase', 'seed', file)),
]

function normalize(url) {
  return url.replace(/[.;]+$/, '').replace(/\/$/, '')
}

function urlsIn(text) {
  return [
    ...text.matchAll(/'(?<url>https:\/\/[^']+)'/g),
    ...text.matchAll(/"(?<url>https:\/\/[^\"]+)"/g),
  ].map(match => normalize(match.groups.url)).filter(url => !url.endsWith('%'))
}

const registered = new Set()
for (const file of sourceFiles) {
  const text = fs.readFileSync(file, 'utf8')
  for (const block of text.matchAll(/insert\s+into\s+public\.source_registry[\s\S]*?on\s+conflict/gi)) {
    for (const url of urlsIn(block[0])) registered.add(url)
  }
}

const gaps = new Map()
for (const file of fs.readdirSync(evidenceDir).filter(name => name.endsWith('.json')).sort()) {
  const packet = JSON.parse(fs.readFileSync(path.join(evidenceDir, file), 'utf8'))
  for (const record of packet.records) {
    for (const source of record.supportingSources ?? []) {
      const url = normalize(source.url)
      if (!registered.has(url) && !gaps.has(url)) {
        gaps.set(url, {
          title: source.title ?? `${packet.batchId} supporting source`,
          anchor: source.anchor ?? 'Supporting source cited by review evidence packet',
          packet: file,
          slug: record.slug,
        })
      }
    }
  }
}

const sources = [...gaps.entries()].map(([url, metadata]) => ({ url, ...metadata }))
const selectedSources = limit > 0 ? sources.slice(offset, offset + limit) : sources.slice(offset)

console.log(JSON.stringify({
  count: gaps.size,
  offset,
  limit: limit > 0 ? limit : null,
  selectedCount: selectedSources.length,
  sources: selectedSources,
}, null, 2))
