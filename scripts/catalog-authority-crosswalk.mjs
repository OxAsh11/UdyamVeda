import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const baselinePath = path.join(root, 'docs', 'igod-coverage-baseline.json')
const seedDir = path.join(root, 'supabase', 'seed')
const outputPath = path.join(root, 'docs', 'catalog-authority-opportunity-crosswalk.json')

function fail(message) {
  throw new Error(`catalog authority crosswalk failed: ${message}`)
}

function normalizeUrl(value) {
  return String(value ?? '').trim().replace(/[.;]+$/, '').replace(/\/$/, '')
}

function canonicalHost(value) {
  try {
    return new URL(value).hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return null
  }
}

function normalizeAuthorityName(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function structuredRecords(sql, file) {
  const payloadMatch = sql.match(/jsonb_array_elements\(\$records\$(\[[\s\S]*?\])\$records\$::jsonb\)/)
    ?? sql.match(/jsonb_array_elements\('(\[[\s\S]*?\])'::jsonb\)/)
  if (!payloadMatch) fail(`${file} has no structured opportunity JSON payload`)
  try {
    const records = JSON.parse(payloadMatch[1])
    if (!Array.isArray(records)) fail(`${file} payload is not an array`)
    return records
  } catch (error) {
    fail(`${file} contains invalid structured opportunity JSON: ${error.message}`)
  }
}

function collectUrls(record) {
  const urls = new Set()
  const add = value => {
    if (typeof value === 'string' && /^https:\/\//i.test(value)) urls.add(normalizeUrl(value))
  }
  add(record.authority_url)
  add(record.canonical_url)
  add(record.source_url)
  add(record.application?.portal)
  add(record.application?.detail)
  add(record.window_evidence?.source_url)
  for (const step of Array.isArray(record.steps) ? record.steps : []) add(step?.url)
  return [...urls]
}

function authorityKey(authority) {
  return `${authority.authorityLevel}:${authority.authorityName}`
}

const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'))
const authorities = baseline.inventories.flatMap(inventory => inventory.records.map(record => ({
  authorityLevel: inventory.authorityLevel,
  authorityName: record.authorityName,
  authorityUrl: normalizeUrl(record.authorityUrl),
  authorityHost: canonicalHost(record.authorityUrl),
})))
if (authorities.length !== 103) fail(`expected 103 IGOD baseline authorities, found ${authorities.length}`)

const baselineByUrl = new Map()
const baselineByHost = new Map()
for (const authority of authorities) {
  if (authority.authorityUrl) baselineByUrl.set(authority.authorityUrl, [...(baselineByUrl.get(authority.authorityUrl) ?? []), authority])
  if (authority.authorityHost) baselineByHost.set(authority.authorityHost, [...(baselineByHost.get(authority.authorityHost) ?? []), authority])
}

const seedFiles = fs.readdirSync(seedDir).filter(file => file.endsWith('.sql')).sort()
const recordEntries = []
for (const file of seedFiles) {
  const sql = fs.readFileSync(path.join(seedDir, file), 'utf8')
  if (!sql.toLowerCase().includes('insert into public.opportunities')) continue
  for (const [index, record] of structuredRecords(sql, file).entries()) {
    if (!record.slug || !record.authority || !record.authority_url) fail(`${file} record ${index + 1} is missing slug, authority, or authority_url`)
    const authorityUrl = normalizeUrl(record.authority_url)
    const authorityHost = canonicalHost(authorityUrl)
    const sourceUrls = collectUrls(record)
    const exactMatches = baselineByUrl.get(authorityUrl) ?? []
    const authorityHostMatches = baselineByHost.get(authorityHost) ?? []
    const sourceHostMatches = authorities.filter(authority => sourceUrls.some(url => canonicalHost(url) === authority.authorityHost))
    const declaredAuthorityName = normalizeAuthorityName(record.authority)
    const declaredNameMatches = authorities.filter(authority => {
      const baselineName = normalizeAuthorityName(authority.authorityName)
      if (!baselineName || baselineName.length < 12) return false
      return declaredAuthorityName === baselineName
        || declaredAuthorityName.startsWith(`${baselineName} `)
        || declaredAuthorityName.includes(` ${baselineName} `)
    })
    const candidates = exactMatches.length
      ? exactMatches
      : authorityHostMatches.length
        ? authorityHostMatches
        : sourceHostMatches.length
          ? sourceHostMatches
          : declaredNameMatches
    const uniqueCandidates = [...new Map(candidates.map(candidate => [authorityKey(candidate), candidate])).values()]
    const mapping = exactMatches.length
      ? 'exact_authority_portal'
      : authorityHostMatches.length
        ? 'same_authority_host'
        : sourceHostMatches.length
          ? 'source_host_evidence_only'
          : 'unresolved'
    recordEntries.push({
      slug: record.slug,
      name: record.name,
      seedFile: file,
      seedRecord: index + 1,
      declaredAuthority: record.authority,
      declaredAuthorityUrl: authorityUrl,
      mapping,
      candidateAuthorities: uniqueCandidates.map(candidate => ({
        authorityLevel: candidate.authorityLevel,
        authorityName: candidate.authorityName,
        authorityUrl: candidate.authorityUrl,
        matchBasis: exactMatches.length
          ? 'exact_authority_portal'
          : authorityHostMatches.length
            ? 'same_authority_host'
            : sourceHostMatches.length
              ? 'source_host_evidence_only'
              : 'declared_authority_name_candidate',
      })),
      officialEvidenceUrls: sourceUrls,
      nextAction: mapping === 'exact_authority_portal' || mapping === 'same_authority_host'
        ? 'review_authority_relationship_and_confirm_discovery_coverage'
        : mapping === 'source_host_evidence_only'
          ? 'confirm_source_host_is_the_implementing_authority_or_add_explicit_mapping'
          : declaredNameMatches.length
            ? 'review_declared_authority_name_candidate_against_official_IGOD_relationship'
            : 'manually_map_record_to_IGOD_authority_before_counting_coverage',
    })
  }
}

const duplicateSlugs = [...new Set(recordEntries.map(record => record.slug))]
  .filter(slug => recordEntries.filter(record => record.slug === slug).length > 1)
if (duplicateSlugs.length) fail(`duplicate opportunity slugs: ${duplicateSlugs.join(', ')}`)

const perAuthority = authorities.map(authority => {
  const key = authorityKey(authority)
  const matched = recordEntries.filter(record => record.candidateAuthorities.some(candidate => authorityKey(candidate) === key))
  const direct = matched.filter(record => ['exact_authority_portal', 'same_authority_host'].includes(record.mapping))
  const sourceOnly = matched.filter(record => record.mapping === 'source_host_evidence_only')
  const nameCandidates = matched.filter(record => record.mapping === 'unresolved')
  return {
    authorityLevel: authority.authorityLevel,
    authorityName: authority.authorityName,
    authorityUrl: authority.authorityUrl,
    directOpportunityCount: direct.length,
    sourceHostEvidenceOnlyCount: sourceOnly.length,
    nameCandidateCount: nameCandidates.length,
    opportunitySlugs: matched.map(record => record.slug).sort(),
    discoveryDisposition: direct.length || sourceOnly.length ? 'opportunity_evidence_present' : 'no_explicit_seed_evidence',
    nextAction: direct.length || sourceOnly.length
      ? 'review_official_authority_sources_and_record_discovered_or_excluded_items'
      : nameCandidates.length
        ? 'review_name_candidates_and_crawl_authority_sources_before_counting_coverage'
        : 'crawl_authority_sources_and_document_opportunities_or_exclusion_reason',
  }
})

const mappingCounts = recordEntries.reduce((counts, record) => {
  counts[record.mapping] = (counts[record.mapping] ?? 0) + 1
  return counts
}, {})
const output = {
  schemaVersion: 1,
  generatedFrom: {
    authorityBaseline: 'docs/igod-coverage-baseline.json',
    seedDirectory: 'supabase/seed',
  },
  interpretation: 'This is a deterministic review-prioritization crosswalk. It does not prove that an authority has been fully crawled, that an opportunity is complete, or that any record is approved for publication. Source-host evidence alone is not an authority relationship.',
  summary: {
    authorityCount: authorities.length,
    opportunityRecordCount: recordEntries.length,
    authorityWithOpportunityEvidence: perAuthority.filter(authority => authority.discoveryDisposition === 'opportunity_evidence_present').length,
    authoritiesWithoutExplicitSeedEvidence: perAuthority.filter(authority => authority.discoveryDisposition === 'no_explicit_seed_evidence').length,
    opportunityRecordsWithNameCandidates: recordEntries.filter(record => record.mapping === 'unresolved' && record.candidateAuthorities.some(candidate => candidate.matchBasis === 'declared_authority_name_candidate')).length,
    mappingCounts,
  },
  authorities: perAuthority,
  opportunityRecords: recordEntries,
}

const serialized = JSON.stringify(output, null, 2) + '\n'
if (process.argv.includes('--write')) {
  fs.writeFileSync(outputPath, serialized, 'utf8')
  console.log(`catalog authority crosswalk written: ${path.relative(root, outputPath)}`)
} else {
  if (!fs.existsSync(outputPath)) fail('crosswalk artifact is missing; run with --write once')
  const existing = JSON.parse(fs.readFileSync(outputPath, 'utf8'))
  if (JSON.stringify(existing) !== JSON.stringify(output)) fail('crosswalk artifact is stale; run with --write and review the diff')
}

console.log(JSON.stringify({
  ...output.summary,
  unresolvedOpportunityRecords: mappingCounts.unresolved ?? 0,
  sourceHostEvidenceOnlyRecords: mappingCounts.source_host_evidence_only ?? 0,
}, null, 2))
