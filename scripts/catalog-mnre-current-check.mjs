import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs/catalog-review-evidence/central-review-037.json'), 'utf8'))
const batch = JSON.parse(fs.readFileSync(path.join(root, 'docs/catalog-review-batches.json'), 'utf8')).batches.find((item) => item.batchId === 'central-review-037')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog MNRE batch check failed: ${message}`)
}

const record = packet.records[0]
assert(packet.schemaVersion === 1, 'schema version must be 1')
assert(packet.batchId === 'central-review-037', 'packet batch id mismatch')
assert(packet.authority.includes('Renewable Energy'), 'authority must be MNRE')
assert(batch && batch.recordCount === 1, 'review batch registry must contain one record')
assert(packet.records.length === 1 && record.slug === 'pradhan-mantri-kisan-urja-suraksha-evam-utthaan-mahabhiyaan-pm-kusum', 'PM-KUSUM record is missing')
assert(record.sourceUrl.includes('mnre.gov.in'), 'primary source must be MNRE')
assert(record.supportingSources.length >= 3, 'PM-KUSUM needs national portal, FAQ and guideline evidence')
assert(record.proposedDecision === 'remain_in_review' && record.humanReviewer === null, 'record must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'packet cannot be publication-ready')
for (const marker of ['500 kW to 2 MW', '7.5 HP', '31 March 2026', 'State allocation', 'new universal national application window']) assert(record.observations.concat(record.reviewFollowUps).some((text) => text.includes(marker)), `missing marker ${marker}`)
assert(record.observations.some((text) => text.includes('separate buckets')), 'benefit bucket separation is missing')
assert(record.reviewFollowUps.some((text) => text.includes('State/DISCOM application forms')), 'state route follow-up is missing')

console.log('catalog MNRE batch check passed: PM-KUSUM component, date boundary, state route and benefit separation remain review-gated')
