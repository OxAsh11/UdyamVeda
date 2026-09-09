import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_opportunities.sql'), 'utf8')
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260907250000_catalog_udyam_current_evidence.sql'), 'utf8')
const currentMigration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908540000_catalog_udyam_current_reconciliation.sql'), 'utf8').toLowerCase()
const auditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-07-udyam-source-audit.md')
const currentAudit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-08-udyam-current-source-audit.md'), 'utf8').toLowerCase()
const packet = fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-084.json'), 'utf8').toLowerCase()

function assert(condition, message) {
  if (!condition) throw new Error(`catalog Udyam check failed: ${message}`)
}

for (const marker of [
  '"slug":"udyam-registration"',
  'classification_thresholds',
  'investment_inr_max":25000000',
  'turnover_inr_max":100000000',
  'identity_requirements',
  'dynamic QR code',
  'renewal":"not_required"',
  'source_anchor',
  "'in_review'",
]) assert(seed.includes(marker), `${marker} is missing from the review-gated dossier`)

assert(seed.includes('udyamregistration.gov.in/Important.aspx'), 'official current-information source is missing')
assert(migration.includes('classification_thresholds') && migration.includes('identity_requirements'), 'current Udyam evidence migration is incomplete')
assert(fs.existsSync(auditPath), 'Udyam source audit is missing')
for (const url of [
  'https://udyamregistration.gov.in/udyamregistration.aspx/',
  'https://udyamregistration.gov.in/docs/udyamapplication.pdf',
  'https://msme.gov.in/sites/default/files/msmeannualreport2025-26english_0.pdf',
]) assert(currentMigration.includes(url), `current official source is missing: ${url}`)
for (const marker of [
  '2025-04-01',
  'otp_boundary',
  'aadhaar_pan_storage_requires_security_review',
  'private_intermediary_fee_warning',
  'one_registration_per_enterprise',
]) assert(currentMigration.includes(marker), `current Udyam boundary is missing: ${marker}`)
for (const marker of ['status: `in_review`', 'official udyam portal', 'aadhaar', 'human review gate', 'otp']) {
  assert(currentAudit.includes(marker), `current Udyam audit marker is missing: ${marker}`)
}
for (const marker of ['draft_source_cross_check', 'remain_in_review', 'publicationready', '2025-04-01', 'privacy_security']) {
  assert(packet.includes(marker), `Udyam evidence packet marker is missing: ${marker}`)
}

console.log('catalog Udyam check passed: current thresholds, identity boundaries, official provenance and review gate are present')
