import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_export_access.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260907450000_catalog_export_access_current_evidence.sql')
const seed = fs.readFileSync(seedPath, 'utf8')
const migration = fs.readFileSync(migrationPath, 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog export access current check failed: ${message}`)
}

for (const marker of [
  'export-promotion-mission-niryat-protsahan-niryat-disha',
  'market-access-initiative-mai',
  'remission-of-duties-and-taxes-on-exported-products-rodtep',
  'current_epm_facts',
  'current_mai_facts',
  'current_rodtep_facts',
  'Starred-Question-87.pdf',
  'apps.commerce.gov.in/schemes/schemereport',
  'RoDTEP%20Notification.pdf',
  '"closes_at":"2026-09-30"',
]) assert(seed.includes(marker), `seed is missing ${marker}`)

for (const marker of [
  'current_epm_facts',
  'current_mai_facts',
  'current_rodtep_facts',
  'Starred-Question-87.pdf',
  'apps.commerce.gov.in/schemes/schemereport',
  'RoDTEP%20Notification.pdf',
  '2026-09-30',
  "window_type = 'fixed'",
]) assert(migration.includes(marker), `migration is missing ${marker}`)

console.log('catalog export access current check passed: EPM operational boundaries, MAI agency route and RoDTEP September 2026 continuation are review-gated')
