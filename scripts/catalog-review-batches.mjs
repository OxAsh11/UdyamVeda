import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedDir = path.join(root, 'supabase', 'seed')
const crosswalkPath = path.join(root, 'docs', 'catalog-authority-opportunity-crosswalk.json')
const outputPath = path.join(root, 'docs', 'catalog-review-batches.json')
const evidenceDir = path.join(root, 'docs', 'catalog-review-evidence')

const normalize = value => String(value ?? '').trim().toLowerCase()

function parseRecords(sql, file) {
  const payloadMatch = sql.match(/jsonb_array_elements\(\$records\$(\[[\s\S]*?\])\$records\$::jsonb\)/)
    ?? sql.match(/jsonb_array_elements\('([\s\S]*?)'::jsonb\)/)
  if (!payloadMatch) return []
  try {
    return JSON.parse(payloadMatch[1]).map(record => ({ ...record, seedFile: file }))
  } catch (error) {
    throw new Error(`catalog review batches failed: ${file} contains invalid structured JSON: ${error.message}`)
  }
}

const crosswalk = JSON.parse(fs.readFileSync(crosswalkPath, 'utf8'))
const authorityRows = new Map(
  (crosswalk.authorities ?? []).map(row => [normalize(row.authorityName), row]),
)
const opportunityAuthorityRows = new Map()
for (const row of crosswalk.authorities ?? []) {
  for (const slug of row.opportunitySlugs ?? []) opportunityAuthorityRows.set(slug, row)
}
const crosswalkOpportunityRows = new Map(
  (crosswalk.opportunityRecords ?? []).map(row => [row.slug, row]),
)
const records = []
for (const file of fs.readdirSync(seedDir).filter(name => name.endsWith('.sql')).sort()) {
  const sql = fs.readFileSync(path.join(seedDir, file), 'utf8')
  if (!sql.toLowerCase().includes('insert into public.opportunities')) continue
  records.push(...parseRecords(sql, file))
}

const seen = new Set()
const grouped = new Map()
for (const record of records) {
  if (!record.slug) throw new Error('catalog review batches failed: a record is missing a slug')
  if (seen.has(record.slug)) throw new Error(`catalog review batches failed: duplicate slug ${record.slug}`)
  seen.add(record.slug)

  const crosswalkRecord = crosswalkOpportunityRows.get(record.slug)
  const hasAuthorityEvidence = ['exact_authority_portal', 'same_authority_host', 'source_host_evidence_only'].includes(crosswalkRecord?.mapping)
  const mappedAuthority = hasAuthorityEvidence ? opportunityAuthorityRows.get(record.slug) : null
  const nameCandidate = crosswalkRecord?.candidateAuthorities?.find(candidate => candidate.matchBasis === 'declared_authority_name_candidate')
  const candidateAuthority = nameCandidate ? authorityRows.get(normalize(nameCandidate.authorityName)) : null
  const implementingAuthorityName = record.authority ?? 'Unassigned authority'
  const authority = mappedAuthority ?? candidateAuthority ?? authorityRows.get(normalize(implementingAuthorityName))
  const authorityName = mappedAuthority?.authorityName
    ?? (candidateAuthority ? `Candidate: ${candidateAuthority.authorityName}` : `Unresolved mapping: ${implementingAuthorityName}`)
  const authorityKey = mappedAuthority
    ? normalize(mappedAuthority.authorityName)
    : candidateAuthority
      ? `candidate:${normalize(candidateAuthority.authorityName)}`
    : `unresolved:${normalize(implementingAuthorityName)}`
  const crosswalkDisposition = mappedAuthority
    ? 'crosswalk_authority_evidence'
    : 'unresolved_authority_mapping'
  const item = {
    slug: record.slug,
    name: record.name,
    seedFile: record.seedFile,
    reviewStatus: 'in_review',
    publicationStatus: 'blocked',
    authority: {
      name: authorityName,
      level: authority?.authorityLevel ?? 'unresolved',
      officialUrl: authority?.authorityUrl ?? null,
      crosswalkDisposition,
      implementingAuthority: implementingAuthorityName,
    },
    source: {
      url: record.source_url ?? null,
      anchor: record.source_anchor ?? null,
      liveSnapshotRequired: true,
    },
    reviewTasks: [
      'verify_current_official_source_and_anchor',
      'review_eligibility_thresholds_exclusions_and_unknown_handling',
      'reconcile_benefit_amounts_conditions_and_value_buckets',
      'verify_documents_steps_application_route_and_window',
      'record_amendment_or_supersession_evidence',
      'record_reviewer_decision_before_publication',
    ],
  }
  const key = authorityKey || 'unassigned-authority'
  if (!grouped.has(key)) grouped.set(key, { authority, authorityName, records: [] })
  grouped.get(key).records.push(item)
}

const batches = [...grouped.values()]
  .sort((a, b) => a.authorityName.localeCompare(b.authorityName))

// Batch IDs are referenced by evidence packets and reviewer links. Do not
// renumber every later batch when a new authority appears in the sorted list.
// Existing evidence packets are the strongest identity signal; the previous
// manifest is only a fallback for groups without a packet yet.
const groupKeyForSlug = new Map()
for (const [groupKey, group] of grouped.entries()) {
  for (const record of group.records) groupKeyForSlug.set(record.slug, groupKey)
}
const preservedBatchIds = new Map()
if (fs.existsSync(evidenceDir)) {
  for (const file of fs.readdirSync(evidenceDir).filter(name => name.endsWith('.json')).sort()) {
    try {
      const packet = JSON.parse(fs.readFileSync(path.join(evidenceDir, file), 'utf8'))
      const groupKeys = [...new Set((packet.records ?? []).map(record => groupKeyForSlug.get(record.slug)).filter(Boolean))]
      if (groupKeys.length === 1 && typeof packet.batchId === 'string') {
        preservedBatchIds.set(groupKeys[0], packet.batchId)
      }
    } catch {
      // The review-evidence validator will report malformed packets separately.
    }
  }
}
if (fs.existsSync(outputPath)) {
  try {
    const previousManifest = JSON.parse(fs.readFileSync(outputPath, 'utf8'))
    for (const batch of previousManifest.batches ?? []) {
      const groupKeys = [...new Set((batch.records ?? []).map(record => groupKeyForSlug.get(record.slug)).filter(Boolean))]
      if (
        groupKeys.length === 1
        && !preservedBatchIds.has(groupKeys[0])
        && typeof batch.batchId === 'string'
        && ![...preservedBatchIds.values()].includes(batch.batchId)
      ) {
        preservedBatchIds.set(groupKeys[0], batch.batchId)
      }
    }
  } catch {
    // A fresh sequential allocation below remains safe if the prior manifest is unusable.
  }
}

const numericBatchId = value => Number.parseInt(String(value ?? '').match(/(\d+)$/)?.[1] ?? '', 10)
const usedBatchIds = new Set()
let nextBatchNumber = Math.max(0, ...[...preservedBatchIds.values()].map(numericBatchId).filter(Number.isFinite)) + 1
const batchIdForGroup = group => {
  const groupKey = [...grouped.entries()].find(([, candidate]) => candidate === group)?.[0]
  const preserved = preservedBatchIds.get(groupKey)
  if (preserved && !usedBatchIds.has(preserved)) {
    usedBatchIds.add(preserved)
    return preserved
  }
  while (usedBatchIds.has(`central-review-${String(nextBatchNumber).padStart(3, '0')}`)) nextBatchNumber += 1
  const allocated = `central-review-${String(nextBatchNumber).padStart(3, '0')}`
  usedBatchIds.add(allocated)
  nextBatchNumber += 1
  return allocated
}

const manifestBatches = batches.map(group => ({
    batchId: batchIdForGroup(group),
    authorityName: group.authorityName,
    authorityLevel: group.authority?.authorityLevel ?? 'unresolved',
    authorityUrl: group.authority?.authorityUrl ?? null,
    authorityDisposition: group.authority?.discoveryDisposition ?? 'unresolved_authority',
    reviewStatus: 'review_required',
    recordCount: group.records.length,
    records: group.records.sort((a, b) => a.name.localeCompare(b.name)),
  }))

const batchesByNumber = (a, b) => numericBatchId(a.batchId) - numericBatchId(b.batchId)
manifestBatches.sort(batchesByNumber)

const manifest = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  status: 'local_review_queue',
  interpretation: 'This manifest orders human review work. It does not approve an authority, opportunity, source, eligibility decision, or publication status.',
  summary: {
    opportunityRecords: records.length,
    reviewBatches: manifestBatches.length,
    recordsWithExactlyOneBatch: manifestBatches.reduce((count, batch) => count + batch.recordCount, 0) === records.length,
    crosswalkMappedRecords: manifestBatches.reduce((count, batch) => count + batch.records.filter(record => record.authority.crosswalkDisposition === 'crosswalk_authority_evidence').length, 0),
    unresolvedMappingRecords: manifestBatches.reduce((count, batch) => count + batch.records.filter(record => record.authority.crosswalkDisposition === 'unresolved_authority_mapping').length, 0),
    publicationReady: 0,
    reviewStatus: 'all_records_in_review',
  },
  batches: manifestBatches,
}

if (records.length === 0) throw new Error('catalog review batches failed: no structured opportunity records found')
if (manifest.summary.recordsWithExactlyOneBatch !== true) throw new Error('catalog review batches failed: records are not partitioned exactly once')
if (manifestBatches.some(batch => batch.records.some(record => record.publicationStatus !== 'blocked'))) {
  throw new Error('catalog review batches failed: a record is not publication-blocked')
}

if (process.argv.includes('--write')) {
  fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`catalog review batches written: ${path.relative(root, outputPath)}`)
}

console.log(JSON.stringify(manifest.summary, null, 2))
console.log(`catalog review batches passed: ${batches.length} authority batches / ${records.length} records remain review-gated`)
