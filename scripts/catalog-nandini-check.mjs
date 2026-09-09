import fs from 'node:fs'
import path from 'node:path'

const seedPath = path.join(process.cwd(), 'supabase', 'seed', 'verified_central_nandini_sahakar.sql')
const seed = fs.readFileSync(seedPath, 'utf8').toLowerCase()

function assert(condition, message) {
  if (!condition) throw new Error(`catalog Nandini Sahakar check failed: ${message}`)
}

for (const marker of [
  'nandini-sahakar-women-cooperative-enterprise-support',
  'ncdc.in/documents/other/nandini-sahakar-scheme-eng-01.11.2021.pdf',
  'cooperation.gov.in/en/programmes-schemes',
  'women_cooperative_society',
  'women_primary_members_percent',
  'minimum":5',
  'maximum":8',
  'new_or_innovative_term_loan_percent":2',
  'other_activity_term_loan_percent":1',
  'direct_infrastructure_loan_max_percent":70',
  'state_route_ncdc_loan_max_percent":90',
  'benefit_is_credit_linkage',
  'no_guaranteed_sanction',
  'review_note',
  "'in_review'",
  "'publish', 'open'",
]) assert(seed.includes(marker), `${marker} is missing from the Nandini Sahakar record`)

assert(seed.includes('urban housing activities'), 'urban housing exclusion is required')
assert(seed.includes('at least 50% women'), 'women-member threshold must be explicit')
assert(seed.includes('operation_more_than_3_months_less_than_1_year'), 'project-cost bands must be captured')
assert(seed.includes('80:20'), 'new and innovative direct debt/equity pattern must be captured')
assert(seed.includes('not a guaranteed grant') && seed.includes('automatic loan sanction'), 'credit must not be presented as guaranteed')

console.log('catalog Nandini Sahakar check passed: women-cooperative eligibility, credit terms, contribution and non-guarantee boundaries are review-gated')
