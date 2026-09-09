import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedDir = path.join(root, 'supabase', 'seed')
const migrationDir = path.join(root, 'supabase', 'migrations')
const implementationDoc = fs.readFileSync(path.join(root, 'docs', 'udyamveda-implementation-checklist.md'), 'utf8')
const catalogDoc = fs.readFileSync(path.join(root, 'docs', 'udyamveda-catalog-status.md'), 'utf8')
const operationsDoc = fs.readFileSync(path.join(root, 'docs', 'catalog-operations.md'), 'utf8')
const seedFiles = fs.readdirSync(seedDir).filter(file => file.endsWith('.sql')).sort()
const opportunityFiles = seedFiles.filter(file => fs.readFileSync(path.join(seedDir, file), 'utf8').toLowerCase().includes('insert into public.opportunities'))
const corpus = opportunityFiles.map(file => fs.readFileSync(path.join(seedDir, file), 'utf8')).join('\n')
const slugs = [
  ...[...corpus.matchAll(/where\s+slug\s*=\s*'([^']+)'/gi)].map(match => match[1]),
  ...[...corpus.matchAll(/"slug"\s*:\s*"([^"]+)"/g)].map(match => match[1]),
]
const uniqueSlugs = new Set(slugs)
const structuredRecords = opportunityFiles.reduce((count, file) => {
  const sql = fs.readFileSync(path.join(seedDir, file), 'utf8')
  const payload = sql.match(/jsonb_array_elements\(\$records\$(\[[\s\S]*?\])\$records\$::jsonb\)/)
    ?? sql.match(/jsonb_array_elements\('(\[[\s\S]*?\])'::jsonb\)/)
  return count + (payload ? JSON.parse(payload[1]).length : 0)
}, 0)
const rawSqlDossiers = opportunityFiles.reduce((count, file) => {
  const sql = fs.readFileSync(path.join(seedDir, file), 'utf8')
  const structured = sql.match(/jsonb_array_elements\(\$records\$(\[[\s\S]*?\])\$records\$::jsonb\)/)
    ?? sql.match(/jsonb_array_elements\('(\[[\s\S]*?\])'::jsonb\)/)
  return count + (structured ? 0 : (sql.match(/insert\s+into\s+public\.opportunity_versions/gi) ?? []).length)
}, 0)

function normalize(url) {
  return url.replace(/[.;]+$/, '').replace(/\/$/, '')
}

function urlsIn(text) {
  return [...text.matchAll(/'(?<url>https:\/\/[^']+)'/g), ...text.matchAll(/"(?<url>https:\/\/[^\"]+)"/g)]
    .map(match => normalize(match.groups.url))
    .filter(url => !url.endsWith('%'))
}

const registryFiles = [
  ...fs.readdirSync(migrationDir).filter(file => file.endsWith('.sql')).map(file => path.join(migrationDir, file)),
  ...seedFiles.map(file => path.join(seedDir, file)),
]
const registeredSourceUrls = new Set()
for (const file of registryFiles) {
  const text = fs.readFileSync(file, 'utf8')
  for (const block of text.matchAll(/insert\s+into\s+public\.source_registry[\s\S]*?on\s+conflict/gi)) {
    for (const url of urlsIn(block[0])) registeredSourceUrls.add(url)
  }
}
const seededUrls = new Set(seedFiles.flatMap(file => urlsIn(fs.readFileSync(path.join(seedDir, file), 'utf8'))))

const expected = [
  [`implementation checklist opportunity count`, implementationDoc, `${uniqueSlugs.size} official-source seed records`],
  [`implementation checklist structured count`, implementationDoc, `separates ${structuredRecords} structured records from ${rawSqlDossiers} raw-SQL dossiers`],
  [`implementation checklist review sequence`, implementationDoc, `Review and publish the ${uniqueSlugs.size} official-source seed records`],
  [`catalog status opportunity count`, catalogDoc, `contains ${uniqueSlugs.size} Central records`],
  [`catalog status seed-file count`, catalogDoc, `across ${opportunityFiles.length} seed files`],
  [`catalog status editorial count`, catalogDoc, `identifies ${structuredRecords} structured records and ${rawSqlDossiers} raw-SQL dossiers`],
  [`operations seed-file count`, operationsDoc, `contains ${opportunityFiles.length} opportunity seed files`],
  [`catalog status source count`, catalogDoc, `${seededUrls.size} seeded URLs covered by ${registeredSourceUrls.size} registered sources`],
]
const failures = expected.filter(([, document, text]) => !document.includes(text))
if (failures.length) {
  console.error('catalog status consistency check failed:')
  for (const [label, , text] of failures) console.error(`- ${label}: missing '${text}'`)
  process.exit(1)
}

console.log(`catalog status consistency check passed: ${uniqueSlugs.size} opportunities, ${structuredRecords} structured, ${rawSqlDossiers} raw, ${opportunityFiles.length} seed files, ${seededUrls.size}/${registeredSourceUrls.size} source URLs are reflected in the status docs`)
