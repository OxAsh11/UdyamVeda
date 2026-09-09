import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const crosswalkPath = path.join(root, 'docs', 'catalog-authority-opportunity-crosswalk.json')
const batchesPath = path.join(root, 'docs', 'catalog-review-batches.json')

function fail(message) {
  throw new Error(`catalog crosswalk candidate check failed: ${message}`)
}

const crosswalk = JSON.parse(fs.readFileSync(crosswalkPath, 'utf8'))
const batches = JSON.parse(fs.readFileSync(batchesPath, 'utf8'))
const candidates = (crosswalk.opportunityRecords ?? []).filter(record =>
  (record.candidateAuthorities ?? []).some(candidate => candidate.matchBasis === 'declared_authority_name_candidate'),
)

for (const record of candidates) {
  if (record.mapping !== 'unresolved') fail(`${record.slug} name candidate is not unresolved`)
  if (!String(record.nextAction ?? '').includes('review_declared_authority_name_candidate')) {
    fail(`${record.slug} does not require official relationship review`)
  }
}

const batchRecords = new Map(
  (batches.batches ?? []).flatMap(batch => (batch.records ?? []).map(record => [record.slug, record])),
)
for (const record of candidates) {
  const batchRecord = batchRecords.get(record.slug)
  if (!batchRecord) fail(`${record.slug} is missing from the review-batch manifest`)
  if (batchRecord.authority.crosswalkDisposition !== 'unresolved_authority_mapping') {
    fail(`${record.slug} name candidate was treated as confirmed crosswalk evidence`)
  }
  if (batchRecord.publicationStatus !== 'blocked') fail(`${record.slug} is not publication-blocked`)
}

const unresolvedCount = (batches.summary ?? {}).unresolvedMappingRecords
if (unresolvedCount !== (crosswalk.summary.mappingCounts?.unresolved ?? 0)) {
  fail(`review-batch unresolved count ${unresolvedCount} does not match crosswalk unresolved count ${crosswalk.summary.mappingCounts?.unresolved ?? 0}`)
}

console.log(`catalog crosswalk candidate check passed: ${candidates.length} name candidates remain unresolved and publication-blocked`)
