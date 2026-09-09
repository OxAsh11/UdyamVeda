import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_startup_fund.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260907140000_catalog_startup_fund_sources.sql')
const benefitMigrationPath = path.join(root, 'supabase', 'migrations', '20260907150000_catalog_equity_benefit_type.sql')
const currentEvidenceMigrationPath = path.join(root, 'supabase', 'migrations', '20260907230000_catalog_fof2_current_evidence.sql')
const auditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-07-startup-fof2-source-audit.md')
const seed = fs.readFileSync(seedPath, 'utf8').toLowerCase()
const migration = fs.readFileSync(migrationPath, 'utf8').toLowerCase()
const benefitMigration = fs.readFileSync(benefitMigrationPath, 'utf8').toLowerCase()
const currentEvidenceMigration = fs.readFileSync(currentEvidenceMigrationPath, 'utf8').toLowerCase()

function assert(condition, message) {
  if (!condition) throw new Error(`catalog Startup Fund check failed: ${message}`)
}

for (const marker of [
  '"slug":"startup-india-fund-of-funds-2"',
  'equity_investment',
  'dpiit_recognized_startup',
  'sebi_registered_category_i_or_ii_aif',
  'annexure_parameters',
  'minimum_investment_multiplier',
  'private_placement_memorandum',
  'direct_startup_application":false',
  'selected-aif',
  'review_note',
  'opportunity_requirements',
  'opportunity_steps',
  'opportunity_windows',
  "'in_review'",
  "'publish', 'open'",
]) assert(seed.includes(marker), `${marker} is missing from the review-gated dossier`)

for (const url of [
  '8949d8e0dabf11cb9291b00ec1d1f727.pdf',
  '3382625ffc31ea32ecc33ea68365172d.pdf',
  'vcfapplication.sidbi.in/login',
]) assert(seed.includes(url) && migration.includes(url), `${url} is not present in both the seed and source registry migration`)

assert(benefitMigration.includes('equity_investment'), 'equity investment benefit type is not enabled in the database migration')
assert(seed.includes('"benefit_type":"equity_investment"') && seed.includes('"corpus_total_inr":100000000000') && seed.includes('"separate_value_buckets":true'), 'the corpus must remain separate from an individual startup amount')
assert(currentEvidenceMigration.includes('annexure_parameters'), 'current FoF 2.0 evidence migration is missing Annexure-I parameters')
assert(fs.existsSync(auditPath), 'FoF 2.0 source audit is missing')

console.log('catalog Startup Fund check passed: indirect AIF route, equity benefit type, official DPIIT evidence and review gates are present')
