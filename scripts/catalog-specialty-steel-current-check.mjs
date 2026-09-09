import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-043.json'), 'utf8'))
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_specialty_steel_pli.sql'), 'utf8')
const batch = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-batches.json'), 'utf8')).batches.find((item) => item.batchId === 'central-review-043')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog specialty-steel batch check failed: ${message}`)
}

const record = packet.records[0]
assert(packet.schemaVersion === 1, 'schema version must be 1')
assert(packet.batchId === 'central-review-043', 'packet batch id mismatch')
assert(packet.authority.includes('Steel'), 'authority must include Steel')
assert(batch && batch.recordCount === 1, 'review batch registry must contain one record')
assert(record.slug === 'production-linked-incentive-specialty-steel', 'specialty-steel record is missing')
assert(record.sourceUrl === 'https://steel.gov.in/pli', 'primary source must be the Ministry PLI page')
assert(record.supportingSources.length >= 4, 'PLI needs current page, annual report, guideline and official 2026-27/Parliament cross-checks')
assert(record.proposedDecision === 'remain_in_review' && record.humanReviewer === null, 'record must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'packet cannot be publication-ready')
for (const marker of ['PLI 1.2', 'pli_12_incentive_rate_range_percent', 'selected-company', 'selected_under_pli_round', 'current_pli_application_window_open', '"window_type":"closed"', 'in_review']) assert(seed.includes(marker), `missing seed marker ${marker}`)
for (const marker of ['performance-linked manufacturing framework', 'does not establish a universal new-applicant window', 'not the applicant\'s benefit ceiling', 'current new-applicant availability']) assert(record.observations.concat(record.reviewFollowUps, [packet.publicationGuard.reason]).some((text) => text.includes(marker)), `packet is missing ${marker}`)

console.log('catalog specialty-steel batch check passed: PLI 1.2, selected-company, performance and closed-new-window boundaries remain review-gated')
