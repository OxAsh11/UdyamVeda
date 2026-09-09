import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-047.json'), 'utf8'))
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_incubator_programs.sql'), 'utf8')
const batch = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-batches.json'), 'utf8')).batches.find((item) => item.batchId === 'central-review-047')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog BioNEST batch check failed: ${message}`)
}

const record = packet.records[0]
assert(packet.schemaVersion === 1, 'schema version must be 1')
assert(packet.batchId === 'central-review-047', 'packet batch id mismatch')
assert(packet.authority.includes('BIRAC'), 'authority must include BIRAC')
assert(batch && batch.recordCount === 1, 'review batch registry must contain one record')
assert(record.slug === 'birac-bionest-incubation-support', 'BioNEST record is missing')
assert(record.sourceUrl === 'https://birac.nic.in/bionest.php', 'primary source must be direct BIRAC BioNEST')
assert(record.supportingSources.length >= 4, 'BioNEST needs direct page, guideline, assessment/submission and discovery cross-checks')
assert(record.proposedDecision === 'remain_in_review' && record.humanReviewer === null, 'record must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'packet cannot be publication-ready')
for (const marker of ['birac-bionest-incubation-support', 'biotech_host_required', 'category_specific', 'bionest_category_selected', '"window_type":"call_for_applications"', 'in_review']) assert(seed.includes(marker), `missing seed marker ${marker}`)
for (const marker of ['not a direct grant paid to every biotech startup', '2025 assessment criteria', '20% private-capex contribution', 'current BioNEST call', 'separate records']) assert(record.observations.concat(record.reviewFollowUps, [packet.publicationGuard.reason]).some((value) => value.includes(marker)), `packet is missing ${marker}`)

console.log('catalog BioNEST batch check passed: institutional beneficiary, host assessment, category-specific funding and call review boundaries remain review-gated')
