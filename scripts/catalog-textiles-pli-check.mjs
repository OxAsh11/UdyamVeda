import fs from 'node:fs'
import path from 'node:path'

const seedPath = path.join(process.cwd(), 'supabase', 'seed', 'verified_central_textiles_pli.sql')
const seed = fs.readFileSync(seedPath, 'utf8').toLowerCase()

function assert(condition, message) {
  if (!condition) throw new Error(`catalog textiles PLI check failed: ${message}`)
}

for (const marker of [
  'production-linked-incentive-textiles-new-applicants',
  'production-linked-incentive-textiles-existing-participants-added-products',
  'approved%20guidelines%20for%20pli%20scheme%20for%20textiles.pdf',
  'amendment%20%26%20addition-pli%20for%20textiles',
  'pli.texmin.gov.in/scheme-notifications',
  'pli.texmin.gov.in/applicants_list',
  'mmf_apparel',
  'mmf_fabrics',
  'technical_textiles',
  'notified_product_gst_hsn_evidence_ready',
  'statutory_auditor_certificate_ready',
  'part_1_rates_percent_by_year',
  'part_2_rates_percent_by_year',
  'fresh_investment_minimum_percent_of_threshold',
  'existing_participant_required',
  'no_guaranteed_amount',
  '"window_type":"closed"',
  '"window_type":"call_for_applications"',
  'review_note',
  "'in_review'",
  "'publish', 'open'",
]) assert(seed.includes(marker), `${marker} is missing from the separated PLI Textiles tracks`)

assert(seed.includes('new-applicant deadline was recorded') && seed.includes('existing selected participants'), 'new and existing-participant window caveats are required')
assert(seed.includes('"current_entry_thresholds"') && seed.includes('1500000000') && seed.includes('500000000'), 'amended entry thresholds are not recorded')
assert(!seed.includes('"amount_max"'), 'PLI Textiles must not use a fixed amount_max entitlement')

console.log('catalog textiles PLI check passed: new and existing-participant tracks, product codes, thresholds and window caveats are review-gated')
