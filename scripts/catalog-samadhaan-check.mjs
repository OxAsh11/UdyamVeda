import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_batch_3.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260907380000_catalog_samadhaan_current_evidence.sql')
const currentMigrationPath = path.join(root, 'supabase', 'migrations', '20260908410000_catalog_samadhaan_odr_current_evidence.sql')
const auditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-07-samadhaan-source-audit.md')
const packetPath = path.join(root, 'docs', 'catalog-review-evidence', 'central-review-071.json')
const seed = fs.readFileSync(seedPath, 'utf8')
const migration = fs.readFileSync(migrationPath, 'utf8')
const currentMigration = fs.readFileSync(currentMigrationPath, 'utf8')
const audit = fs.readFileSync(auditPath, 'utf8')
const packet = fs.readFileSync(packetPath, 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog Samadhaan check failed: ${message}`)
}

for (const marker of [
  '"slug":"msme-samadhaan-delayed-payment-assistance"',
  '"portal":"https://odr.msme.gov.in/seller/"',
  '"effective_from":"2025-10-15"',
  '"payment_delay_trigger_days":45',
  '"complaint_registration_target_days":15',
  'odr.msme.gov.in/seller/',
  'MSMEANNUALREPORT2025-26ENGLISH_0.pdf',
]) assert(seed.includes(marker), `Samadhaan seed is missing ${marker}`)

for (const marker of [
  '2025-10-15',
  'payment_delay_trigger_days',
  'complaint_registration_target_days',
  'odr.msme.gov.in/seller/',
  'MSMEANNUALREPORT2025-26ENGLISH_0.pdf',
  'current_source_reconciliation',
]) assert(migration.includes(marker), `Samadhaan current migration is missing ${marker}`)

for (const marker of [
  'MSE_Scheme_on_ODR_for_Delayed_Payment_Guidelines.pdf',
  'odr_pre_msefc_process_days',
  'odr_consent_extension_max_days',
  'msefc_registration_statement_days',
  'separate_process_timing',
  'no_guaranteed_recovery',
  '2026-09-08',
]) assert(currentMigration.includes(marker), `Samadhaan ODR current migration is missing ${marker}`)
for (const marker of ['ODR guideline', 'separately', 'Status remains `in_review`', '8 September 2026']) {
  assert(audit.toLowerCase().includes(marker.toLowerCase()), `Samadhaan audit is missing ${marker}`)
}
for (const marker of ['ODR-first', 'pre-MSEFC', 'no grant', 'remain_in_review', 'publicationReady']) {
  assert(packet.toLowerCase().includes(marker.toLowerCase()), `Samadhaan evidence packet is missing ${marker}`)
}

console.log('catalog Samadhaan check passed: ODR-first route, separate process timings, MSEFC boundary and review gate are encoded')
