import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const baselinePath = path.join(root, 'docs', 'igod-coverage-baseline.json')
const outputPath = path.join(root, 'docs', 'catalog-coverage-report.json')
const seedDir = path.join(root, 'supabase', 'seed')
const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'))
const seedFiles = fs.readdirSync(seedDir).filter(file => file.endsWith('.sql')).sort()
const sourceRegistryFiles = [
  ...fs.readdirSync(path.join(root, 'supabase', 'migrations')).filter(file => file.endsWith('.sql')).sort().map(file => path.join(root, 'supabase', 'migrations', file)),
  ...seedFiles.map(file => path.join(seedDir, file)),
]
const opportunitySeedFiles = seedFiles.filter(file => {
  const sql = fs.readFileSync(path.join(seedDir, file), 'utf8').toLowerCase()
  return sql.includes('insert into public.opportunities')
})
const opportunityCorpus = opportunitySeedFiles
  .map(file => fs.readFileSync(path.join(seedDir, file), 'utf8'))
  .join('\n')
const opportunitySeedSlugs = [
  ...[...opportunityCorpus.matchAll(/where\s+slug\s*=\s*'([^']+)'/gi)].map(match => match[1]),
  ...[...opportunityCorpus.matchAll(/"slug"\s*:\s*"([^"]+)"/g)].map(match => match[1]),
]
const uniqueOpportunitySeedSlugs = [...new Set(opportunitySeedSlugs)]

function normalizeUrl(url) {
  return url.replace(/[.;]+$/, '').replace(/\/$/, '')
}

function urlsIn(text) {
  return [...text.matchAll(/'(?<url>https:\/\/[^']+)'/g), ...text.matchAll(/"(?<url>https:\/\/[^\"]+)"/g)]
    .map(match => normalizeUrl(match.groups.url))
    .filter(url => !url.endsWith('%'))
}

const registeredSourceUrls = new Set()
for (const file of sourceRegistryFiles) {
  const sql = fs.readFileSync(file, 'utf8')
  for (const block of sql.matchAll(/insert\s+into\s+public\.source_registry[\s\S]*?on\s+conflict/gi)) {
    for (const url of urlsIn(block[0])) registeredSourceUrls.add(url)
  }
}

function normalize(value) {
  return value
    .toLowerCase()
    .replace(/https?:\/\//g, '')
    .replace(/^www\./g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function canonicalHost(value) {
  try {
    return new URL(value.includes('://') ? value : `https://${value}`).hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return null
  }
}

function significantTokens(value) {
  return normalize(value)
    .split(/\s+/)
    .filter(token => token.length > 2 && !['ministry', 'department', 'the', 'and', 'of', 'for', 'with'].includes(token))
}

const corpus = normalize(opportunityCorpus)
const sourceHosts = new Set(
  [...opportunityCorpus.matchAll(/https?:\/\/([^/\s'")]+)/gi)]
    .map(match => canonicalHost(match[1]))
    .filter(Boolean),
)
const records = baseline.inventories.flatMap(inventory => inventory.records.map(record => ({
  ...record,
  authorityLevel: inventory.authorityLevel,
})))

const authorityPortalUrls = records.filter(record => record.authorityUrl).map(record => normalizeUrl(record.authorityUrl))
const authorityPortalUrlSet = new Set(authorityPortalUrls)
const unregisteredAuthorityPortalUrls = [...authorityPortalUrlSet].filter(url => !registeredSourceUrls.has(url)).sort()

const report = records.map(record => {
  const authorityHost = record.authorityUrl ? canonicalHost(record.authorityUrl) : null
  const portalSourceRegistered = record.authorityUrl ? registeredSourceUrls.has(normalizeUrl(record.authorityUrl)) : false
  const hostMatch = authorityHost ? sourceHosts.has(authorityHost) : false
  const tokens = significantTokens(record.authorityName)
  const matchedTokens = tokens.filter(token => corpus.includes(token))
  const tokenMatches = matchedTokens.length
  const nameMatch = !hostMatch && tokens.length >= 2 && tokenMatches / tokens.length >= 0.75
  const evidence = hostMatch ? 'opportunity_source_host_present' : nameMatch ? 'authority_name_tokens_present' : record.authorityUrl ? 'not_yet_seeded' : 'url_unresolved'
  return {
    authorityLevel: record.authorityLevel,
    authorityName: record.authorityName,
    authorityUrl: record.authorityUrl,
    portalSourceRegistered,
    evidence,
    matchedHost: hostMatch ? authorityHost : null,
    matchedNameTokens: nameMatch ? matchedTokens : [],
    nextAction: evidence === 'url_unresolved'
      ? 'resolve_official_portal_url'
      : evidence === 'not_yet_seeded'
        ? 'assess_authority_and_crawl_official_sources'
        : 'review_relevance_and_source_records',
  }
})

const counts = report.reduce((result, item) => {
  result[item.evidence] = (result[item.evidence] ?? 0) + 1
  return result
}, {})

const output = {
  authorityInventory: records.length,
  authorityPortalUrlPresent: authorityPortalUrls.length,
  authorityPortalUniqueUrls: authorityPortalUrlSet.size,
  authorityPortalSourcesRegistered: authorityPortalUrlSet.size - unregisteredAuthorityPortalUrls.length,
  authorityPortalSourcesUnregistered: unregisteredAuthorityPortalUrls.length,
  opportunitySeedFiles: opportunitySeedFiles.length,
  opportunitySeedIdentities: uniqueOpportunitySeedSlugs.length,
  opportunitySeedInsertStatements: (opportunityCorpus.match(/insert into public\.opportunities/gi) ?? []).length,
  counts,
  unregisteredAuthorityPortalUrls,
  interpretation: 'Portal registration is deterministic; opportunity-source evidence and name-token matches are heuristic only. This report does not assess business relevance, prove complete scheme coverage, or authorize publication.',
}

if (process.argv.includes('--details')) output.authorities = report
if (process.argv.includes('--write')) {
  const persisted = {
    ...output,
    authorities: report,
    generatedAt: new Date().toISOString(),
  }
  fs.writeFileSync(outputPath, `${JSON.stringify(persisted, null, 2)}\n`, 'utf8')
  console.log(`catalog coverage report written: ${path.relative(root, outputPath)}`)
}
console.log(JSON.stringify(output, null, 2))
