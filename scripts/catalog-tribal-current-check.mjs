import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-045.json'), 'utf8'))
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_tribal_livelihood_nstfdc_current.sql'), 'utf8')
const batch = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-batches.json'), 'utf8')).batches.find((item) => item.batchId === 'central-review-045')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog Tribal batch check failed: ${message}`)
}

assert(packet.schemaVersion === 1, 'schema version must be 1')
assert(packet.batchId === 'central-review-045', 'packet batch id mismatch')
assert(packet.authority.includes('Tribal'), 'authority must include Tribal Affairs')
assert(batch && batch.recordCount === 2, 'review batch registry must contain two records')
assert(packet.records.length === 2, 'packet must contain PMJVM and VCF-ST only')
assert(packet.records.every((record) => record.proposedDecision === 'remain_in_review' && record.humanReviewer === null), 'both records must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'packet cannot be publication-ready')
for (const marker of ['pmjvm-tribal-value-chain', 'vcf-st-tribal-startups', 'tribal_value_chain_required', 'ifci_vcf_route_required', 'no_universal_applicant_ceiling_published', 'investment_not_guaranteed', 'in_review']) assert(seed.includes(marker), `missing seed marker ${marker}`)
for (const marker of ['does not establish a universal per-founder cash amount', 'allocation line', 'not proof of an open founder application call', 'TRIFED', 'IFCI VCF Ltd']) assert(packet.records.some((record) => record.observations.concat(record.reviewFollowUps).some((value) => value.includes(marker))), `packet is missing ${marker}`)

console.log('catalog Tribal batch check passed: PMJVM value-chain and VCF-ST venture-finance routes remain distinct, current-source and review-gated')
