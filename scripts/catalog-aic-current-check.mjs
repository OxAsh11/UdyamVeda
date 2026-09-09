import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-046.json'), 'utf8'))
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_incubator_programs.sql'), 'utf8')
const batch = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-batches.json'), 'utf8')).batches.find((item) => item.batchId === 'central-review-046')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog AIC batch check failed: ${message}`)
}

const record = packet.records[0]
assert(packet.schemaVersion === 1, 'schema version must be 1')
assert(packet.batchId === 'central-review-046', 'packet batch id mismatch')
assert(packet.authority.includes('Atal Innovation'), 'authority must include AIM')
assert(batch && batch.recordCount === 1, 'review batch registry must contain one record')
assert(record.slug === 'atal-incubation-centres', 'AIC record is missing')
assert(record.sourceUrl.includes('aim.gov.in'), 'primary source must be AIM')
assert(record.supportingSources.length >= 4, 'AIC needs direct page, guideline, EIC distinction and discovery cross-checks')
assert(record.proposedDecision === 'remain_in_review' && record.humanReviewer === null, 'record must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'packet cannot be publication-ready')
for (const marker of ['atal-incubation-centres', 'source_displayed_max_grant_inr', 'source_displayed_max_grant_note', 'aic_call_open', 'incubator', 'in_review']) assert(seed.includes(marker), `missing seed marker ${marker}`)
for (const marker of ['not a grant paid directly to every startup', 'INR 10 crore', '10,000 square feet', 'not establish an open nationwide deadline', 'distinct routes']) assert(record.observations.concat(record.reviewFollowUps, [packet.publicationGuard.reason]).some((value) => value.includes(marker)), `packet is missing ${marker}`)

console.log('catalog AIC batch check passed: institution-led beneficiary, grant ceiling, infrastructure and unverified-call boundaries remain review-gated')
