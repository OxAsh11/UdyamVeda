import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const baseline = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'igod-coverage-baseline.json'), 'utf8'))
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'authority_directory_baseline.sql'), 'utf8')
const sourceRegistryFiles = [
  ...fs.readdirSync(path.join(root, 'supabase', 'migrations')).filter(file => file.endsWith('.sql')).sort().map(file => path.join(root, 'supabase', 'migrations', file)),
  ...fs.readdirSync(path.join(root, 'supabase', 'seed')).filter(file => file.endsWith('.sql')).sort().map(file => path.join(root, 'supabase', 'seed', file)),
]

function assert(condition, message) {
  if (!condition) throw new Error(`catalog authority seed check failed: ${message}`)
}

const payloadMatch = seed.match(/\$baseline\$(\{[\s\S]*?\})\$baseline\$::jsonb/)
assert(payloadMatch, 'names-only baseline payload is missing')
const payload = JSON.parse(payloadMatch[1])
const registeredAuthorityUrls = new Set()
for (const file of sourceRegistryFiles) {
  const sourceSql = fs.readFileSync(file, 'utf8')
  for (const block of sourceSql.matchAll(/insert\s+into\s+public\.source_registry[\s\S]*?on\s+conflict/gi)) {
    for (const match of block[0].matchAll(/'(?<url>https:\/\/[^']+)'/g)) registeredAuthorityUrls.add(match.groups.url.replace(/\/$/, ''))
  }
}

for (const [level, expectedCount] of [['ministry', 53], ['department', 50]]) {
  const baselineInventory = baseline.inventories.find(item => item.authorityLevel === level)
  const seedRecords = payload[level]
  assert(baselineInventory?.records.length === expectedCount, `${level} baseline count is not ${expectedCount}`)
  assert(Array.isArray(seedRecords) && seedRecords.length === expectedCount, `${level} seed count is not ${expectedCount}`)
  assert(JSON.stringify(seedRecords) === JSON.stringify(baselineInventory.records), `${level} seed diverges from the reviewed baseline`)
  for (const record of baselineInventory.records) {
    if (record.authorityUrl) assert(registeredAuthorityUrls.has(record.authorityUrl.replace(/\/$/, '')), `${level} authority portal is not registered as a source: ${record.authorityUrl}`)
  }
}

assert(seed.includes('authority_coverage'), 'authority coverage insert is missing')
assert(seed.includes("'pending', 'not_assessed'"), 'seed must remain unassessed')
assert(seed.includes('on conflict (source_registry_id, authority_level, authority_name)'), 'seed must be idempotent')
assert(seed.includes('https://igod.gov.in/ug/E002/organizations') && seed.includes('https://igod.gov.in/ug/E003/organizations'), 'IGOD sources are missing')
assert(!seed.toLowerCase().includes("'approved'"), 'authority seed must not publish anything')

console.log(`catalog authority seed check passed: 53 ministries and 50 departments are seeded idempotently with official portal URLs, ${registeredAuthorityUrls.size} authority sources are registered, and no assessments are published`)
