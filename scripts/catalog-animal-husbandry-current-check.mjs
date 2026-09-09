import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_animal_husbandry.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260907410000_catalog_animal_husbandry_current_evidence.sql')
const seed = fs.readFileSync(seedPath, 'utf8')
const migration = fs.readFileSync(migrationPath, 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog animal-husbandry current check failed: ${message}`)
}

for (const marker of [
  'national-livestock-mission-entrepreneurship-development',
  'animal-husbandry-infrastructure-development-fund-ahidf',
  'RevisedNLMGuidelines.pdf',
  'additional_species_focus',
  '"camel"',
  '"donkey"',
  '"horse"',
  '"mule"',
  'current_ahidf_facts',
  '"cited_outlay_period_end":"2026-03-31"',
  'window_type":"closed"',
  'AnnualReport2025-26.pdf',
]) assert(seed.includes(marker), `seed is missing ${marker}`)

for (const marker of [
  'RevisedNLMGuidelines.pdf',
  'additional_species_focus',
  'current_ahidf_facts',
  '2026-03-31',
  "window_type = 'closed'",
  'AnnualReport2025-26.pdf',
  'current_source_reconciliation',
]) assert(migration.includes(marker), `migration is missing ${marker}`)

console.log('catalog animal-husbandry current check passed: NLM 2026 amendment, expanded species, AHIDF period boundary and current-source evidence are review-gated')
