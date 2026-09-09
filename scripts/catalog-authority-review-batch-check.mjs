import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const baselinePath = path.join(root, 'docs', 'igod-coverage-baseline.json')

const fail = (message) => {
  throw new Error(`authority review batch check failed: ${message}`)
}

const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'))
const baselineRows = baseline.inventories.flatMap((inventory) =>
  inventory.records.map((record) => ({
    authorityLevel: inventory.authorityLevel,
    authorityName: record.authorityName,
    authorityUrl: record.authorityUrl,
  })),
)
const baselineByKey = new Map(baselineRows.map((row) => [`${row.authorityLevel}:${row.authorityName}`, row]))

const packPaths = fs.readdirSync(path.join(root, 'docs'))
  .filter((name) => /^authority-review-batch-\d+\.json$/.test(name))
  .sort()
if (packPaths.length < 2) fail('at least two bounded review batches are required')

const sourceFiles = []
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(entryPath)
    else sourceFiles.push(entryPath)
  }
}
walk(path.join(root, 'supabase'))
const sourceRegistryUrls = new Set()
for (const file of sourceFiles) {
  const text = fs.readFileSync(file, 'utf8')
  for (const block of text.matchAll(/insert\s+into\s+public\.source_registry[\s\S]*?on\s+conflict/gi)) {
    for (const match of block[0].matchAll(/['"](?<url>https:\/\/[^'"]+)['"]/g)) {
      sourceRegistryUrls.add(match.groups.url.replace(/[.;]+$/, '').replace(/\/$/, ''))
    }
  }
}
const keys = new Set()
let totalRows = 0

for (const [packIndex, packName] of packPaths.entries()) {
  const pack = JSON.parse(fs.readFileSync(path.join(root, 'docs', packName), 'utf8'))
  if (pack.reviewStatus !== 'pending_human_approval') fail(`${packName} must remain pending human approval`)
  if (pack.terminalAssessmentWritesAllowed !== false) fail(`${packName} must not authorize terminal assessment writes`)
  if (pack.sourceBaseline !== 'docs/igod-coverage-baseline.json') fail(`${packName} must point to the IGOD baseline`)
  if (!Array.isArray(pack.rows)) fail(`${packName} must contain a rows array`)
  const isFinalPack = packIndex === packPaths.length - 1
  if (isFinalPack) {
    if (pack.rows.length < 1 || pack.rows.length > 8) fail(`${packName} must contain between one and eight final bounded rows`)
  } else if (pack.rows.length !== 8) {
    fail(`${packName} must contain exactly eight bounded rows unless it is the final pack`)
  }
  totalRows += pack.rows.length

  for (const row of pack.rows) {
    const key = `${row.authorityLevel}:${row.authorityName}`
    if (keys.has(key)) fail(`duplicate authority ${key}`)
    keys.add(key)

    const baselineRow = baselineByKey.get(key)
    if (!baselineRow) fail(`authority is outside the IGOD baseline: ${key}`)
    if (baselineRow.authorityUrl !== row.authorityUrl) fail(`authority URL differs from the IGOD baseline: ${key}`)
    if (!['relevant', 'not_relevant', 'unclear'].includes(row.proposedDisposition)) fail(`invalid proposed disposition for ${key}`)
    if (!/^https:\/\//i.test(row.evidenceUrl)) fail(`evidence URL is not HTTPS for ${key}`)
    if (!row.evidenceAnchor?.trim()) fail(`evidence anchor is missing for ${key}`)
    if (!row.rationale?.trim()) fail(`rationale is missing for ${key}`)
    const evidenceUrl = row.evidenceUrl.replace(/[.;]+$/, '').replace(/\/$/, '')
    if (!sourceRegistryUrls.has(evidenceUrl)) fail(`evidence URL is not registered in source_registry for ${key}`)
  }
}

console.log(`catalog authority review batch check passed: ${totalRows} proposed relevance decisions across ${packPaths.length} batches are source-anchored, baseline-bound, and still pending human approval`)
