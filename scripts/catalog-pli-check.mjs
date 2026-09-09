import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_pli_it_hardware.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260907170000_catalog_pli_it_hardware_sources.sql')
const seed = fs.readFileSync(seedPath, 'utf8').toLowerCase()
const migration = fs.readFileSync(migrationPath, 'utf8').toLowerCase()

function assert(condition, message) {
  if (!condition) throw new Error(`catalog PLI IT Hardware check failed: ${message}`)
}

for (const marker of [
  '"slug":"production-linked-incentive-2-it-hardware"',
  'company_registered_in_india',
  'laptops',
  'tablets',
  'all_in_one_pcs',
  'servers',
  'ultra_small_form_factor',
  'not_a_flat_subsidy',
  'portal_summary_average_incentive_percent',
  'review_note',
  'opportunity_requirements',
  'opportunity_steps',
  'opportunity_windows',
  "'in_review'",
  "'publish', 'open'",
]) assert(seed.includes(marker), `${marker} is missing from the review-gated dossier`)

for (const url of [
  'pliwg.dpiit.gov.in/',
  'guidelines_pli-scheme-ithw-min.pdf',
  'production%20linked%20scheme%202.0%20for%20it%20hardware%20notification_0.pdf',
]) assert(seed.includes(url) && migration.includes(url), `${url} is not present in both the seed and source registry migration`)

assert(seed.includes('no flat percentage or guaranteed amount'), 'benefit summary must reject a flat guaranteed amount')
assert(seed.includes('application window'), 'current application-window review requirement is missing')

console.log('catalog PLI IT Hardware check passed: official MeitY/DPIIT provenance, target segments, qualification caveats and review gates are present')
