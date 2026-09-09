import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-044.json'), 'utf8'))
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_tourism_hospitality.sql'), 'utf8')
const batch = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-batches.json'), 'utf8')).batches.find((item) => item.batchId === 'central-review-044')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog Tourism batch check failed: ${message}`)
}

const record = packet.records[0]
assert(packet.schemaVersion === 1, 'schema version must be 1')
assert(packet.batchId === 'central-review-044', 'packet batch id mismatch')
assert(packet.authority.includes('Tourism'), 'authority must include Tourism')
assert(batch && batch.recordCount === 1, 'review batch registry must contain one record')
assert(record.slug === 'incredible-india-bed-breakfast-homestay-classification', 'tourism classification record is missing')
assert(record.sourceUrl.includes('nidhi.tourism.gov.in'), 'primary source must be NIDHI+')
assert(record.supportingSources.length >= 4, 'Tourism needs portal, guideline index, MyNIDHI and accommodation-definition cross-checks')
assert(record.proposedDecision === 'remain_in_review' && record.humanReviewer === null, 'record must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'packet cannot be publication-ready')
for (const marker of ['maximum_rooms', 'maximum_beds', 'classification_validity_years', 'classification_fee_applies', 'inspection_required', 'discontinued_route', '"window_type":"rolling"', 'in_review']) assert(seed.includes(marker), `missing seed marker ${marker}`)
for (const marker of ['not a grant', 'one to six lettable rooms', '16 March 2026', 'State/UT', 'local permissions']) assert(record.observations.concat(record.reviewFollowUps, [packet.publicationGuard.reason]).some((value) => value.includes(marker)), `packet is missing ${marker}`)

console.log('catalog Tourism batch check passed: NIDHI+ classification, capacity, inspection, local-permission and discontinued-project boundaries remain review-gated')
