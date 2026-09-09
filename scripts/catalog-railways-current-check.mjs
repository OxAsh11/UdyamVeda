import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-041.json'), 'utf8'))
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_railways_startup_procurement_current.sql'), 'utf8')
const batch = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-batches.json'), 'utf8')).batches.find((item) => item.batchId === 'central-review-041')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog Railways batch check failed: ${message}`)
}

const record = packet.records[0]
assert(packet.schemaVersion === 1, 'schema version must be 1')
assert(packet.batchId === 'central-review-041', 'packet batch id mismatch')
assert(packet.authority.includes('Railways'), 'authority must include Railways')
assert(batch && batch.recordCount === 1, 'review batch registry must contain one record')
assert(record.slug === 'railways-dpiit-startup-procurement-access', 'startup procurement record is missing')
assert(record.sourceUrl.includes('indianrailways.gov.in'), 'primary source must be Indian Railways')
assert(record.supportingSources.length >= 4, 'Railways needs IREPS, vendor, RailTech and Startup India cross-checks')
assert(record.proposedDecision === 'remain_in_review' && record.humanReviewer === null, 'record must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'packet cannot be publication-ready')
for (const marker of [
  'maximum_startup_age_years":10',
  'maximum_turnover_any_financial_year_inr":1000000000',
  'bid-security',
  'prior-experience/turnover',
  'cash_benefit":false',
  'contract_not_guaranteed":true',
  'current_tender_route_verified',
  'unknown_handling":"needs_information"',
]) assert(seed.includes(marker), `missing seed marker ${marker}`)
for (const marker of ['does not create a grant', 'live tender', 'DPIIT recognition', 'human-review pending']) assert(record.observations.concat(record.reviewFollowUps, [packet.publicationGuard.reason]).some((text) => text.includes(marker)), `packet is missing ${marker}`)

console.log('catalog Railways batch check passed: official procurement manual, startup boundaries, conditional relief and tender review gate are present')
