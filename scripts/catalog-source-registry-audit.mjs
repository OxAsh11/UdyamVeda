import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedDir = path.join(root, 'supabase', 'seed')
const migrationDir = path.join(root, 'supabase', 'migrations')
const seedFiles = fs.readdirSync(seedDir).filter(file => file.endsWith('.sql')).sort()
const sourceRegistryFiles = [
  ...fs.readdirSync(migrationDir).filter(file => file.endsWith('.sql')).sort().map(file => path.join(migrationDir, file)),
  ...seedFiles.map(file => path.join(seedDir, file)),
]
const sourceLinkMigration = path.join(root, 'supabase', 'migrations', '20260906400000_opportunity_source_registry_link.sql')
const resolutionPlanPath = path.join(root, 'docs', 'catalog-source-resolution-plan.json')

function read(file) {
  return fs.readFileSync(file, 'utf8')
}

function normalize(url) {
  return url.replace(/[.;]+$/, '').replace(/\/$/, '')
}

function urlsIn(text) {
  const quotedUrls = [
    ...text.matchAll(/'(?<url>https:\/\/[^']+)'/g),
    ...text.matchAll(/"(?<url>https:\/\/[^\"]+)"/g),
  ]
  return quotedUrls
    .map(match => normalize(match.groups.url))
    .filter(url => !url.endsWith('%'))
}

function fail(message) {
  throw new Error(`catalog source registry audit failed: ${message}`)
}

const registryUrls = new Set()
for (const file of sourceRegistryFiles) {
  const text = read(file)
  for (const block of text.matchAll(/insert\s+into\s+public\.source_registry[\s\S]*?on\s+conflict/gi)) {
    for (const url of urlsIn(block[0])) registryUrls.add(url)
  }
}

const seededUrls = new Set()
for (const file of seedFiles) {
  for (const url of urlsIn(read(path.join(seedDir, file)))) seededUrls.add(url)
}

const unregistered = [...seededUrls].filter(url => !registryUrls.has(url)).sort()
if (unregistered.length) fail(`seeded URLs missing from source_registry: ${unregistered.join(', ')}`)
if (registryUrls.size < 25) fail(`expected at least 25 registered official sources; found ${registryUrls.size}`)
const resolutionPlan = JSON.parse(read(resolutionPlanPath))
const plannedAlternateUrls = new Set(
  (resolutionPlan.plans ?? []).flatMap(plan => plan.alternateOfficialSources ?? [])
    .map(source => normalize(source.url)),
)
const unregisteredPlannedAlternates = [...plannedAlternateUrls].filter(url => !registryUrls.has(url)).sort()
if (unregisteredPlannedAlternates.length) fail(`resolution-plan alternate URLs missing from source_registry: ${unregisteredPlannedAlternates.join(', ')}`)
const requiredDiscoveryUrls = [
  'https://www.startupindia.gov.in/content/sih/en/ams-application/application-listing.html',
  'https://www.startupindia.gov.in/content/sih/en/credit-guarantee-scheme-for-startups.html',
  'https://www.startupindia.gov.in/content/sih/en/incubator-schemes.html',
  'https://www.startupindia.gov.in/content/sih/en/bharat-startup-grand-challenge.html',
  'https://www.startupindia.gov.in/content/sih/en/nsa-landing.html',
  'https://www.startupindia.gov.in/content/dam/startupindia/Startup-India-Fund-of-Funds-2.0-Scheme.pdf',
]
const missingDiscoveryUrls = requiredDiscoveryUrls.filter(url => !registryUrls.has(normalize(url)))
if (missingDiscoveryUrls.length) fail(`required Startup India discovery sources missing: ${missingDiscoveryUrls.join(', ')}`)
if (!read(sourceLinkMigration).includes('link_opportunity_source_registry')) fail('opportunity provenance is not linked to source_registry')

console.log(`catalog source registry audit passed: ${seededUrls.size} seeded URLs covered by ${registryUrls.size} registered sources`)
