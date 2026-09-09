import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-042.json'), 'utf8'))
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_msde_naps2_pmkvy.sql'), 'utf8')
const batch = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-batches.json'), 'utf8')).batches.find((item) => item.batchId === 'central-review-042')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog MSDE batch check failed: ${message}`)
}

assert(packet.schemaVersion === 1, 'schema version must be 1')
assert(packet.batchId === 'central-review-042', 'packet batch id mismatch')
assert(packet.authority.includes('Skill Development'), 'authority must include MSDE')
assert(batch && batch.recordCount === 2, 'review batch registry must contain two records')
assert(packet.records.length === 2, 'packet must contain two distinct MSDE records')
assert(packet.records.every((record) => record.proposedDecision === 'remain_in_review' && record.humanReviewer === null), 'both records must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'packet cannot be publication-ready')
for (const marker of [
  'government_stipend_share_percent_max":25',
  'government_stipend_support_max_inr_per_apprentice_per_month":1500',
  'guideline_programme_period":"2022-23 to 2025-26',
  'unknown_handling":"needs_information"',
  'in_review',
]) assert(seed.includes(marker), `missing seed marker ${marker}`)
for (const marker of ['Central support is paid through DBT', 'not an unrestricted employer grant', 'published programme evidence states a PMKVY 4.0 period', 'No direct cash benefit']) assert(packet.records.some((record) => record.observations.concat(record.reviewFollowUps).some((text) => text.includes(marker))), `packet is missing ${marker}`)

console.log('catalog MSDE batch check passed: NAPS-2 stipend/DBT and PMKVY learner/provider boundaries remain current-source and review-gated')
