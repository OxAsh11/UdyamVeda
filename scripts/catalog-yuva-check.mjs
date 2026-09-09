import fs from 'node:fs'
import path from 'node:path'

const seedPath = path.join(process.cwd(), 'supabase', 'seed', 'verified_central_yuva_sahakar.sql')
const seed = fs.readFileSync(seedPath, 'utf8').toLowerCase()

function assert(condition, message) {
  if (!condition) throw new Error(`catalog Yuva Sahakar check failed: ${message}`)
}

for (const marker of [
  'yuva-sahakar-cooperative-enterprise-support-innovation',
  'ncdc.in/documents/faq/2010210223pattern-of-assistance-2021-22.pdf',
  'ncdc.in/documents/booklet/2609240524english-compendium-as-on-22.05.2024.pdf',
  'cooperative_society',
  'new_innovative_or_value_chain_project',
  'cooperative_operation_months',
  'working_capital_max_percent_of_project_cost',
  'term_loan_rate_reduction_percent":2',
  'category_a',
  'category_b',
  'benefit_is_credit_linkage',
  'no_guaranteed_sanction',
  'review_note',
  "'in_review'",
  "'publish', 'open'",
]) assert(seed.includes(marker), `${marker} is missing from the Yuva Sahakar record`)

assert(seed.includes('project_cost_caps_inr') && seed.includes('10000000') && seed.includes('30000000'), 'project-cost bands must be captured')
assert(seed.includes('80:20') && seed.includes('70:30'), 'category-specific debt-equity patterns must be captured')
assert(seed.includes('working capital will not be more than 20%') || seed.includes('working_capital_max_percent_of_project_cost'), 'working-capital cap must be explicit')
assert(seed.includes('not a guaranteed subsidy') && seed.includes('automatic loan sanction'), 'credit and subsidy must not be presented as guaranteed')

console.log('catalog Yuva Sahakar check passed: cooperative startup eligibility, project limits, credit terms and non-guarantee boundaries are review-gated')
