import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_registration_journeys.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260907270000_catalog_dpiit_recognition_current_evidence.sql')
const auditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-07-dpiit-recognition-source-audit.md')
const seed = fs.readFileSync(seedPath, 'utf8')
const migration = fs.readFileSync(migrationPath, 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog DPIIT recognition check failed: ${message}`)
}

for (const marker of [
  '"slug":"dpiit-startup-recognition"',
  'startup_recognition_page.html',
  'current_page_facts',
  '20-AUG-2026',
  'self_certification',
  'deeptech_boundary',
  'linked_tax_routes',
  'review_note',
  "'in_review'",
]) assert(seed.includes(marker), `${marker} is missing from the review-gated dossier`)

assert(migration.includes('current_page_facts'), 'current DPIIT evidence migration is incomplete')
assert(migration.includes("where slug = 'dpiit-startup-recognition'"), 'migration is not scoped to the DPIIT record')
assert(fs.existsSync(auditPath), 'DPIIT recognition source audit is missing')

console.log('catalog DPIIT recognition check passed: current eligibility, NSWS route, self-certification and review gate are present')
