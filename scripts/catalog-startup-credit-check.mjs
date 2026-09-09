import fs from 'node:fs'
import path from 'node:path'

const seedPath = path.join(process.cwd(), 'supabase', 'seed', 'verified_central_startup_credit.sql')
const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260907130000_catalog_startup_credit_sources.sql')
const currentEvidenceMigrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260907220000_catalog_cgss_current_evidence.sql')
const seed = fs.readFileSync(seedPath, 'utf8').toLowerCase()
const migration = fs.readFileSync(migrationPath, 'utf8').toLowerCase()
const currentEvidenceMigration = fs.readFileSync(currentEvidenceMigrationPath, 'utf8').toLowerCase()

function assert(condition, message) {
  if (!condition) throw new Error(`catalog Startup Credit check failed: ${message}`)
}

for (const marker of [
  '"slug":"credit-guarantee-scheme-for-startups"',
  'dpiit_recognized',
  'maximum_debt_covered_per_borrower_inr',
  'transaction_based_coverage',
  'umbrella_based_coverage',
  'review_note',
  'opportunity_requirements',
  'opportunity_steps',
  'opportunity_windows',
  "'in_review'",
  "'publish', 'open'",
]) assert(seed.includes(marker), `${marker} is missing from the review-gated dossier`)

assert(seed.includes('credit-guarantee-scheme-for-startups.html'), 'Startup India detail page is missing from the seed')
for (const url of [
  'credit-guarantee-scheme-for-startup.pdf',
  'ncgtc.in/cgss/',
  'jansamarth.in/business-loan-startup-scheme',
]) assert(seed.includes(url) && (migration.includes(url) || currentEvidenceMigration.includes(url)), `${url} is not present in both the seed and a source registry migration`)

console.log('catalog Startup Credit check passed: CGSS is review-gated with Gazette provenance, lender-route caveats, structured benefits and application workflow')
