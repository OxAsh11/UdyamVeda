import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_pmvbry_employment_incentive.sql')
const seed = fs.readFileSync(seedPath, 'utf8').toLowerCase()
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-035.json'), 'utf8'))

function assert(condition, message) {
  if (!condition) throw new Error(`catalog employment-incentive check failed: ${message}`)
}

for (const marker of [
  'pm-viksit-bharat-rozgar-yojana-part-a-first-timers',
  'pm-viksit-bharat-rozgar-yojana-part-b-employer-incentive',
  'pmvbry-final.pdf',
  'labour.gov.in/sites/default/files/pib2141129.pdf',
  'part a first-time employee incentive',
  'part b employer incentive',
  'first-time employee',
  'employer/establishment',
  '"maximum_amount_inr":15000',
  '"maximum_per_additional_employee_per_month_inr":3000',
  '"threshold_baseline_below_50":2',
  '"threshold_baseline_50_or_above":5',
  '"standard_duration_years":2',
  '"manufacturing_duration_years":4',
  'uan_face_authenticated_on_umang',
  'ecr_filed_with_contributions',
  'not_employee_benefit',
  'not_employer_benefit',
  '"unknown_handling":"needs_information"',
  '"window_type":"fixed"',
  'review_note',
  "'in_review'",
  "'publish', 'open'",
]) assert(seed.includes(marker), `${marker} is missing from the separated review-gated tracks`)

assert(!seed.includes('"operator":"between"'), 'unsupported between operator must not enter the rule set')
assert(seed.indexOf('part a first-time employee incentive') < seed.indexOf('part b employer incentive'), 'track ordering is not stable')
assert(packet.batchId === 'central-review-035', 'batch 035 evidence packet is missing')
assert(packet.records.length === 2, 'batch 035 must cover Part A and Part B')
assert(packet.records.every((record) => record.proposedDecision === 'remain_in_review'), 'both PMVBRY tracks must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'PMVBRY records must not be publication-ready')
assert(packet.records.every((record) => record.supportingSources.length >= 3), 'each PMVBRY record needs current official supporting sources')
assert(packet.records.every((record) => record.reviewFollowUps.length >= 6), 'each PMVBRY record needs explicit operational follow-ups')
assert(packet.records.some((record) => record.slug.includes('part-a') && record.observations.some((item) => item.includes('not the employer'))), 'Part A beneficiary boundary is missing')
assert(packet.records.some((record) => record.slug.includes('part-b') && record.observations.some((item) => item.includes('not an employee benefit'))), 'Part B beneficiary boundary is missing')
assert(packet.records.some((record) => record.observations.some((item) => item.includes('1 August 2025 to 31 July 2027'))), 'PMVBRY registration period is missing from evidence')

console.log('catalog employment-incentive check passed: PMVBRY Part A and Part B remain separate, review-gated and source-anchored')
