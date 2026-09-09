import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs/catalog-review-evidence/central-review-038.json'), 'utf8'))
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_mopng_cbg_bam_current.sql'), 'utf8')
const batch = JSON.parse(fs.readFileSync(path.join(root, 'docs/catalog-review-batches.json'), 'utf8')).batches.find((item) => item.batchId === 'central-review-038')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog MoPNG batch check failed: ${message}`)
}

const record = packet.records[0]
assert(packet.schemaVersion === 1, 'schema version must be 1')
assert(packet.batchId === 'central-review-038', 'packet batch id mismatch')
assert(packet.authority.includes('Petroleum'), 'authority must be MoPNG')
assert(batch && batch.recordCount === 1, 'review batch registry must contain one record')
assert(record.slug === 'mopng-cbg-biomass-aggregation-machinery', 'BAM record is missing')
assert(record.sourceUrl.includes('mopng.gov.in'), 'primary source must be MoPNG')
assert(record.supportingSources.length >= 5, 'BAM needs policy index, guideline, portal, FAQ and checklist evidence')
assert(record.proposedDecision === 'remain_in_review' && record.humanReviewer === null, 'record must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'packet cannot be publication-ready')
for (const marker of [
  'minimum_cbg_capacity_tpd":2',
  'minimum_agri_residue_feedstock_percent":50',
  'maximum_financial_assistance_per_bam_set_inr":9000000',
  'maximum_assistance_per_project_inr":90000000',
  'scheme_period_end":"2027-03-31',
  'window_reconciliation',
  'portal_notice_last_date":"2026-07-30',
  'unresolved_conflict',
]) assert(seed.includes(marker), `seed is missing ${marker}`)
for (const marker of ['2 TPD', '50% agricultural-residue', 'Rs 90 lakh', '30 September 2026', '1 July to 30 July 2026', 'unresolved official-source window conflict']) assert(record.observations.concat(record.reviewFollowUps).some((text) => text.includes(marker)), `packet is missing ${marker}`)
assert(record.reviewFollowUps.some((text) => text.includes('PMA/PAC/PAB')), 'approval workflow follow-up is missing')
assert(record.reviewFollowUps.some((text) => text.includes('grant value separate')), 'benefit separation follow-up is missing')

console.log('catalog MoPNG batch check passed: BAM eligibility, caps, portal/guideline window conflict and fine-print obligations remain review-gated')
