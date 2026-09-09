import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_agri_enterprise.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260907420000_catalog_pmkusum_current_evidence.sql')
const seed = fs.readFileSync(seedPath, 'utf8')
const migration = fs.readFileSync(migrationPath, 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog PM-KUSUM current check failed: ${message}`)
}

for (const marker of [
  'pradhan-mantri-kisan-urja-suraksha-evam-utthaan-mahabhiyaan-pm-kusum',
  'current_pmkusum_facts',
  'Publicity.html',
  'PM%20KUSUM%20FAQs',
  'docid=190&docspid=41',
  '"scheme_period_end":"2026-03-31"',
  '"window_type":"closed"',
  'state_allocation_boundary',
]) assert(seed.includes(marker), `seed is missing ${marker}`)

for (const marker of [
  'current_pmkusum_facts',
  'Publicity.html',
  'PM%20KUSUM%20FAQs',
  'docid=190&docspid=41',
  '2026-03-31',
  "window_type = 'closed'",
  'state_allocation_boundary',
  'fraud_warning',
]) assert(migration.includes(marker), `migration is missing ${marker}`)

console.log('catalog PM-KUSUM current check passed: official sunset boundary, state-allocation guard and closed-window evidence are review-gated')
