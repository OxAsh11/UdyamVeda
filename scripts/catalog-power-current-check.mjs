import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs/catalog-review-evidence/central-review-040.json'), 'utf8'))
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_power_adeetie_current.sql'), 'utf8')
const batch = JSON.parse(fs.readFileSync(path.join(root, 'docs/catalog-review-batches.json'), 'utf8')).batches.find((item) => item.batchId === 'central-review-040')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog Power batch check failed: ${message}`)
}

const record = packet.records.find((item) => item.slug === 'mop-adeetie-energy-efficiency-msme')
assert(packet.schemaVersion === 1, 'schema version must be 1')
assert(packet.batchId === 'central-review-040', 'packet batch id mismatch')
assert(packet.authority.includes('Power'), 'authority must include Ministry of Power')
assert(batch && batch.records.some((item) => item.slug === 'mop-adeetie-energy-efficiency-msme'), 'review batch registry must contain ADEETIE')
assert(record, 'ADEETIE record is missing')
assert(record.sourceUrl.includes('beeindia.gov.in'), 'primary source must be BEE')
assert(record.supportingSources.length >= 5, 'ADEETIE needs current page, guideline, technology, brochure and EOI evidence')
assert(record.proposedDecision === 'remain_in_review' && record.humanReviewer === null, 'record must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'packet cannot be publication-ready')
for (const marker of [
  'micro_small_interest_subvention_percent":5',
  'medium_interest_subvention_percent":3',
  'minimum_energy_savings_percent":10',
  'maximum_debt_funding_percent":75',
  'scheme_end_fy":"2027-28',
  '60 identified energy-intensive clusters',
]) assert(seed.includes(marker) || record.observations.concat(record.reviewFollowUps).some((text) => text.includes(marker)), `missing marker ${marker}`)
for (const marker of ['not itself a grant', 'separate support tracks', 'loan principal', '10% energy savings']) assert(record.observations.concat(record.reviewFollowUps).some((text) => text.includes(marker)), `packet is missing ${marker}`)

console.log('catalog Power batch check passed: ADEETIE cluster, lender, subvention, audit and savings boundaries remain review-gated')
