import fs from 'node:fs'
import path from 'node:path'

const seedPath = path.join(process.cwd(), 'supabase', 'seed', 'verified_central_ayushman_sahakar.sql')
const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260908440000_catalog_ayushman_sahakar_current_reconciliation.sql')
const auditPath = path.join(process.cwd(), 'docs', 'catalog-audits', '2026-09-08-ayushman-sahakar-source-audit.md')
const packetPath = path.join(process.cwd(), 'docs', 'catalog-review-evidence', 'central-review-074.json')
const seed = fs.readFileSync(seedPath, 'utf8').toLowerCase()
const migration = fs.readFileSync(migrationPath, 'utf8').toLowerCase()
const audit = fs.readFileSync(auditPath, 'utf8').toLowerCase()
const packet = fs.readFileSync(packetPath, 'utf8').toLowerCase()

function assert(condition, message) {
  if (!condition) throw new Error(`catalog Ayushman Sahakar check failed: ${message}`)
}

for (const marker of [
  'ayushman-sahakar-cooperative-healthcare-support',
  'ayushman-sahakar20102020.pdf',
  'cooperative_society',
  'healthcare_cooperative',
  'eligible_ayushman_sahakar_activity',
  'healthcare_or_health_education_bye_law_provision',
  'loan_period_years',
  'fixed_period":8',
  'women_members_majority_term_loan_rate_reduction_percent":1',
  'direct_infrastructure_loan_max_percent":70',
  'state_route_ncdc_loan_max_percent":90',
  'no_guaranteed_sanction',
  'required_statutory_permissions_ready',
  'review_note',
  "'in_review'",
  "'publish', 'open'",
]) assert(seed.includes(marker), `${marker} is missing from the Ayushman Sahakar record`)

assert(seed.includes('telemedicine') && seed.includes('digital-health'), 'digital-health and telemedicine activities must be captured')
assert(seed.includes('health_insurance') && seed.includes('irda-accredited'), 'health-insurance boundary must be captured')
assert(seed.includes('no universal healthcare grant') || seed.includes('not a universal healthcare grant'), 'the record must not imply a universal grant')
assert(seed.includes('statutory healthcare/education/insurance permits'), 'statutory-permission review must be explicit')

for (const marker of [
  'current_scheme_route',
  'current_common_application_route',
  'cooperative_project_finance',
  'direct_infrastructure_loan_max_percent',
  'state_route_ncdc_loan_max_percent',
  'women_majority_term_loan_incentive_percent',
  'subsidy_convergence_not_guaranteed',
  '2026-09-08',
]) assert(migration.includes(marker), `${marker} is missing from the current Ayushman Sahakar reconciliation`)
for (const marker of ['current ncdc scheme index', 'common loan application', 'cooperative project finance', 'status: `in_review`']) {
  assert(audit.includes(marker), `${marker} is missing from the Ayushman Sahakar audit`)
}
for (const marker of ['cooperative project-finance', 'not a universal grant', 'does not guarantee loan sanction', 'remain_in_review', 'publicationready']) {
  assert(packet.includes(marker), `${marker} is missing from the Ayushman Sahakar evidence packet`)
}

console.log('catalog Ayushman Sahakar check passed: current NCDC route, cooperative finance, funding boundaries and review gate are encoded')
