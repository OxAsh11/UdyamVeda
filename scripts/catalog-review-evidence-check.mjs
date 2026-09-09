import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const batchPath = path.join(root, 'docs', 'catalog-review-batches.json')
const manifest = JSON.parse(fs.readFileSync(batchPath, 'utf8'))
const evidenceDir = path.join(root, 'docs', 'catalog-review-evidence')
const evidenceFiles = fs.readdirSync(evidenceDir).filter(file => file.endsWith('.json')).sort()
const seedDir = path.join(root, 'supabase', 'seed')
const migrationDir = path.join(root, 'supabase', 'migrations')
const sourceRegistryFiles = [
  ...fs.readdirSync(migrationDir).filter(file => file.endsWith('.sql')).sort().map(file => path.join(migrationDir, file)),
  ...fs.readdirSync(seedDir).filter(file => file.endsWith('.sql')).sort().map(file => path.join(seedDir, file)),
]

function normalizeUrl(url) {
  return url.replace(/[.;]+$/, '').replace(/\/$/, '')
}

function urlsIn(text) {
  return [
    ...text.matchAll(/'(?<url>https:\/\/[^']+)'/g),
    ...text.matchAll(/"(?<url>https:\/\/[^\"]+)"/g),
  ].map(match => normalizeUrl(match.groups.url)).filter(url => !url.endsWith('%'))
}

const registeredSourceUrls = new Set()
for (const file of sourceRegistryFiles) {
  const text = fs.readFileSync(file, 'utf8')
  for (const block of text.matchAll(/insert\s+into\s+public\.source_registry[\s\S]*?on\s+conflict/gi)) {
    for (const url of urlsIn(block[0])) registeredSourceUrls.add(url)
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(`catalog review evidence check failed: ${message}`)
}

assert(evidenceFiles.length > 0, 'no draft evidence packets were found')

let recordCount = 0
const missingRegisteredSources = []
const unregisteredSupportingSources = []
for (const evidenceFile of evidenceFiles) {
  const evidence = JSON.parse(fs.readFileSync(path.join(evidenceDir, evidenceFile), 'utf8'))
  const batch = manifest.batches.find(item => item.batchId === evidence.batchId)
  assert(batch, `${evidenceFile}: evidence packet batch is missing from the generated review-batch manifest`)
  assert(evidence.status === 'draft_source_cross_check', `${evidenceFile}: packet must remain a draft source cross-check`)
  assert(evidence.publicationGuard?.publicationReady === false, `${evidenceFile}: packet must never mark itself publication-ready`)

  const batchSlugs = new Set(batch.records.map(record => record.slug))
  const evidenceSlugs = new Set(evidence.records.map(record => record.slug))
  assert(evidence.records.length === batch.records.length, `${evidenceFile}: packet must cover the complete selected batch`)
  assert(evidence.records.every(record => batchSlugs.has(record.slug)), `${evidenceFile}: packet contains a record outside the selected batch`)
  assert(batch.records.every(record => evidenceSlugs.has(record.slug)), `${evidenceFile}: selected batch contains a record without evidence`)
  assert(evidence.records.every(record => record.proposedDecision === 'remain_in_review'), `${evidenceFile}: source cross-check cannot approve a record`)
  assert(evidence.records.every(record => record.humanReviewer === null), `${evidenceFile}: source cross-check cannot claim human review`)
  assert(evidence.records.every(record => /^https:\/\//.test(record.sourceUrl)), `${evidenceFile}: every evidence record must have an HTTPS source URL`)
  assert(evidence.records.every(record => record.sourceAnchor && record.reviewFollowUps?.length), `${evidenceFile}: every evidence record needs an anchor and follow-up queue`)
  for (const record of evidence.records) {
    const citedUrls = [record.sourceUrl, ...(record.supportingSources ?? []).map(source => source.url)]
    assert(citedUrls.every(url => typeof url === 'string' && /^https:\/\//.test(url)), `${evidenceFile}/${record.slug}: every cited supporting source must be HTTPS`)
    const primarySource = normalizeUrl(record.sourceUrl)
    if (!registeredSourceUrls.has(primarySource)) {
      missingRegisteredSources.push(`${evidenceFile}/${record.slug}: primary ${primarySource}`)
    }
    const supportingSources = citedUrls.slice(1).map(normalizeUrl).filter(url => !registeredSourceUrls.has(url))
    if (supportingSources.length) {
      unregisteredSupportingSources.push(`${evidenceFile}/${record.slug}: ${supportingSources.join(', ')}`)
    }
  }
  recordCount += evidence.records.length
}

assert(missingRegisteredSources.length === 0, `cited sources are missing from source_registry: ${missingRegisteredSources.join(' | ')}`)
if (unregisteredSupportingSources.length) {
  console.warn(`catalog review evidence warning: ${unregisteredSupportingSources.length} records cite supporting URLs not yet registered; primary sources are registered`)
}
console.log(`catalog review evidence check passed: ${evidenceFiles.length} packets / ${recordCount} records remain human-review pending; all primary sources are registered`)
