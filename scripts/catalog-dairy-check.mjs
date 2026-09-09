import fs from 'node:fs'
import path from 'node:path'

const seedPath = path.join(process.cwd(), 'supabase', 'seed', 'verified_central_dairy_sahakar.sql')
const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260908450000_catalog_dairy_sahakar_current_reconciliation.sql')
const auditPath = path.join(process.cwd(), 'docs', 'catalog-audits', '2026-09-08-dairy-sahakar-source-audit.md')
const packetPath = path.join(process.cwd(), 'docs', 'catalog-review-evidence', 'central-review-075.json')
const seed = fs.readFileSync(seedPath, 'utf8').toLowerCase()
const migration = fs.readFileSync(migrationPath, 'utf8').toLowerCase()
const audit = fs.readFileSync(auditPath, 'utf8').toLowerCase()
const packet = fs.readFileSync(packetPath, 'utf8').toLowerCase()

function assert(condition, message) {
  if (!condition) throw new Error(`catalog Dairy Sahakar check failed: ${message}`)
}

for (const marker of [
  'dairy-sahakar-cooperative-dairy-business-support',
  'dairy-sahakar-english.pdf',
  'cooperative_society',
  'dairy_cooperative',
  'dairy_or_supporting_activity',
  'suitable_cooperative_bye_laws',
  'loan_period_years',
  'minimum":5',
  'maximum":8',
  'direct_infrastructure_loan_max_percent":70',
  'state_route_financial_assistance_max_percent":90',
  'margin_money',
  'working_capital',
  'no_guaranteed_sanction',
  'review_note',
  "'in_review'",
  "'publish', 'open'",
]) assert(seed.includes(marker), `${marker} is missing from the Dairy Sahakar record`)

assert(seed.includes('milk_processing') && seed.includes('cold_chain'), 'dairy processing and cold-chain activities must be captured')
assert(seed.includes('veterinary_services') && seed.includes('dairy_exports'), 'supporting services and export activity must be captured')
assert(seed.includes('guaranteed dairy grant') && seed.includes('direct entitlement'), 'the record must not imply a guaranteed grant')
assert(seed.includes('food-safety, animal-husbandry, veterinary, environmental'), 'statutory-permission review must be explicit')

for (const marker of [
  'current_scheme_route',
  'current_common_application_route',
  'cooperative_project_finance',
  'project_assistance_fixed_minimum_or_maximum',
  'direct_infrastructure_loan_max_percent',
  'state_route_ncdc_loan_max_percent',
  'principal_moratorium_years',
  'scheme_level_launch_earmark_inr',
  'scheme_level_launch_earmark_is_not_applicant_entitlement',
  'subsidy_convergence_not_guaranteed',
  '2026-09-08',
]) assert(migration.includes(marker), `${marker} is missing from the current Dairy Sahakar reconciliation`)
for (const marker of ['current dairy and livestock route', 'common loan application', 'project finance', 'scheme-level 2021 earmark', 'status: `in_review`']) {
  assert(audit.includes(marker), `${marker} is missing from the Dairy Sahakar audit`)
}
for (const marker of ['project-finance', 'scheme-level launch earmark', 'applicant entitlement', 'remain_in_review', 'publicationready']) {
  assert(packet.includes(marker), `${marker} is missing from the Dairy Sahakar evidence packet`)
}

console.log('catalog Dairy Sahakar check passed: current NCDC route, cooperative finance, corpus boundary and funding terms are review-gated')
