import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_incorporation_food_safety.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260907290000_catalog_fssai_current_evidence.sql')
const auditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-07-fssai-source-audit.md')
const seed = fs.readFileSync(seedPath, 'utf8')
const migration = fs.readFileSync(migrationPath, 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog FSSAI check failed: ${message}`)
}

for (const marker of [
  '"slug":"fssai-food-business-registration-licensing"',
  'current_2026_facts',
  'registration_annual_turnover_up_to_inr',
  '15000000',
  '500000000',
  '2026-04-01',
  'perpetual validity',
  'FoSCoS',
  'review_note',
]) assert(seed.includes(marker), `${marker} is missing from the review-gated dossier`)

assert(migration.includes('69c6a23234827order_27032026.pdf'), '2026 FSSAI amendment FAQ provenance is missing')
assert(migration.includes("where slug = 'fssai-food-business-registration-licensing'"), 'migration is not scoped to the FSSAI record')
assert(fs.existsSync(auditPath), 'FSSAI source audit is missing')

console.log('catalog FSSAI check passed: revised 2026 thresholds, perpetual-validity caveat and review gate are present')
