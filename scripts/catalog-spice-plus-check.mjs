import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_incorporation_food_safety.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260907280000_catalog_spice_plus_current_evidence.sql')
const auditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-07-spice-plus-source-audit.md')
const seed = fs.readFileSync(seedPath, 'utf8')
const migration = fs.readFileSync(migrationPath, 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog SPICe+ check failed: ${message}`)
}

for (const marker of [
  '"slug":"company-incorporation-spice-plus"',
  'SPICEplus-and-linked-filings-FAQs-V3-20230122.pdf',
  'current_mca_facts',
  'portal_context',
  'agile_pro_s',
  'epfo_esic_boundary',
  'gst_boundary',
  'applicant_control',
  'review_note',
]) assert(seed.includes(marker), `${marker} is missing from the review-gated dossier`)

assert(migration.includes('SPICe%2B_help.pdf'), 'current SPICe+ instruction-kit provenance is missing')
assert(migration.includes("where slug = 'company-incorporation-spice-plus'"), 'migration is not scoped to the SPICe+ record')
assert(fs.existsSync(auditPath), 'SPICe+ source audit is missing')

console.log('catalog SPICe+ check passed: current MCA V3 boundary, linked services and review gate are present')
