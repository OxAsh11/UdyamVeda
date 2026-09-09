import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_registration_journeys.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260907260000_catalog_gst_current_evidence.sql')
const auditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-07-gst-registration-source-audit.md')
const seed = fs.readFileSync(seedPath, 'utf8')
const migration = fs.readFileSync(migrationPath, 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog GST check failed: ${message}`)
}

for (const marker of [
  '"slug":"gst-registration"',
  'GST_Registration_Document_Checklist.pdf',
  'current_checklist_findings',
  'constitution_proof',
  'stakeholder_or_authorised_signatory_photo',
  'principal_place_of_business',
  'application_caution',
  'review_note',
  "'in_review'",
]) assert(seed.includes(marker), `${marker} is missing from the review-gated dossier`)

assert(migration.includes('current_checklist_findings'), 'current GST evidence migration is incomplete')
assert(fs.existsSync(auditPath), 'GST source audit is missing')

console.log('catalog GST check passed: official document checklist, upload rules, tax boundary and review gate are present')
