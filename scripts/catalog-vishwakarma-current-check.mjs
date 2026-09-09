import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_artisan_programs.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260907390000_catalog_vishwakarma_current_evidence.sql')
const currentMigrationPath = path.join(root, 'supabase', 'migrations', '20260908420000_catalog_vishwakarma_current_reconciliation.sql')
const auditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-07-pm-vishwakarma-source-audit.md')
const packetPath = path.join(root, 'docs', 'catalog-review-evidence', 'central-review-072.json')
const seed = fs.readFileSync(seedPath, 'utf8')
const migration = fs.readFileSync(migrationPath, 'utf8')
const currentMigration = fs.readFileSync(currentMigrationPath, 'utf8')
const audit = fs.readFileSync(auditPath, 'utf8')
const packet = fs.readFileSync(packetPath, 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog PM Vishwakarma current check failed: ${message}`)
}

for (const marker of [
  '"slug":"pm-vishwakarma"',
  '"registration_target":"through 2028"',
  '"second_tranche_condition"',
  '"digital_transaction_incentive"',
  'Home/FAQ',
  'Home/HowToRegister',
  'Home/TermsandConditions',
  'ration card',
  'one member of the family',
]) {
  assert(seed.includes(marker), `PM Vishwakarma seed is missing ${marker}`)
}

for (const marker of [
  'registration target through 2028',
  'toolkit_condition',
  'second_tranche_condition',
  'digital_transaction_incentive',
  'Home/FAQ',
  'Home/HowToRegister',
  'Home/TermsandConditions',
  'Current PM Vishwakarma registration document pack',
  'current_source_reconciliation',
]) assert(migration.includes(marker), `PM Vishwakarma migration is missing ${marker}`)

for (const marker of [
  '2026-09-08',
  'benefit_buckets_separate',
  'registration_not_benefit_approval',
  'portal_registration_target',
  'target_requires_guideline_reconciliation',
  'sensitive_document_minimization_required',
]) assert(currentMigration.includes(marker), `PM Vishwakarma current reconciliation is missing ${marker}`)
for (const marker of ['8 September 2026', 'review-gated', 'through 2028', 'Status: `in_review`']) {
  assert(audit.toLowerCase().includes(marker.toLowerCase()), `PM Vishwakarma audit is missing ${marker}`)
}
for (const marker of ['staged benefits', 'registration alone', 'sensitive identity', 'remain_in_review', 'publicationReady']) {
  assert(packet.toLowerCase().includes(marker.toLowerCase()), `PM Vishwakarma evidence packet is missing ${marker}`)
}

console.log('catalog PM Vishwakarma current check passed: staged benefits, portal target caveat, document minimization and review gate are encoded')
