import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_finance_batch.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260907320000_catalog_pmegp_current_evidence.sql')
const operatingMigrationPath = path.join(root, 'supabase', 'migrations', '20260907360000_catalog_pmegp_current_operating_evidence.sql')
const reconciliationMigrationPath = path.join(root, 'supabase', 'migrations', '20260908100000_catalog_pmegp_current_operating_reconciliation.sql')
const auditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-07-pmegp-source-audit.md')
const packetDir = path.join(root, 'docs', 'catalog-review-evidence')
const seed = fs.readFileSync(seedPath, 'utf8')
const migration = fs.readFileSync(migrationPath, 'utf8')
const operatingMigration = fs.readFileSync(operatingMigrationPath, 'utf8')
const reconciliationMigration = fs.readFileSync(reconciliationMigrationPath, 'utf8')
const packetPath = fs.readdirSync(packetDir)
  .filter((file) => file.endsWith('.json'))
  .map((file) => path.join(packetDir, file))
  .find((file) => fs.readFileSync(file, 'utf8').includes('"slug": "prime-ministers-employment-generation-programme"'))
if (!packetPath) throw new Error('catalog PMEGP check failed: PMEGP evidence packet is missing')
const packet = fs.readFileSync(packetPath, 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog PMEGP check failed: ${message}`)
}

for (const marker of [
  '"slug":"prime-ministers-employment-generation-programme"',
  'current_pmegp_facts',
  'udyam_registration',
  'subsidy_boundary',
  'scope_boundary',
  'separate_value_buckets',
  'review_note',
]) assert(seed.includes(marker), `${marker} is missing from the review-gated dossier`)

for (const marker of ['common-pmegp.msme.gov.in', 'Home/MSME_List', 'current_source_reconciliation']) {
  assert(migration.includes(marker), `current PMEGP migration is missing ${marker}`)
}
for (const marker of ['pmegp.msme.gov.in/Home/TermsAndConditions', 'UserManual_NewApplicant.pdf', 'one_applicant_per_family', 'capital_expenditure_required']) {
  assert(operatingMigration.includes(marker), `current PMEGP operating migration is missing ${marker}`)
}
for (const marker of ['common-pmegp.msme.gov.in', 'current_operating_boundary', 'separate_value_buckets', 'fund_availability_and_bank_appraisal', '2026-09-08']) {
  assert(reconciliationMigration.includes(marker), `current PMEGP reconciliation migration is missing ${marker}`)
}
for (const marker of ['separate value buckets', 'Udyam prerequisite', 'remain_in_review', 'publicationReady', 'human reviewer']) {
  assert(packet.toLowerCase().includes(marker.toLowerCase()), `PMEGP evidence packet is missing ${marker}`)
}
assert(fs.existsSync(auditPath), 'PMEGP source audit is missing')
assert(fs.existsSync(packetPath), 'PMEGP evidence packet is missing')

console.log('catalog PMEGP check passed: current portal, operating boundaries, Udyam prerequisite, subsidy separation and review gate are present')
