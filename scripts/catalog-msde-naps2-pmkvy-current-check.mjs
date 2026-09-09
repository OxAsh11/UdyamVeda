import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260907570000_catalog_msde_naps2_pmkvy_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_msde_naps2_pmkvy.sql'), 'utf8')

for (const token of [
  'msde-national-apprenticeship-promotion-scheme-2',
  'msde-pradhan-mantri-kaushal-vikas-yojana-4',
  'PRID=2294856',
  '20d9aac4ce972a765e83f28682536ee0.pdf',
  'government_stipend_share_percent_max":25',
  'government_stipend_support_max_inr_per_apprentice_per_month":1500',
  'cash_benefit_not_asserted":true',
  'guideline_programme_period":"2022-23 to 2025-26',
  'in_review',
]) {
  if (!seed.includes(token) && !migration.includes(token)) throw new Error(`MSDE evidence missing: ${token}`)
}

if (!seed.includes('DBT') || !seed.includes('apprenticeship_contract_required')) throw new Error('NAPS-2 DBT and contract boundaries are missing')
if (!seed.includes('provider_route') || !seed.includes('candidate enrolment')) throw new Error('PMKVY candidate/provider distinction is missing')
if (!seed.includes('post-FY2025-26') || !seed.includes('transition')) throw new Error('PMKVY transition uncertainty must remain explicit')
if (!seed.includes('eligibility_rule_sets') || !seed.includes('reviewed)')) throw new Error('MSDE rules must remain unreviewed')
if (!migration.includes('on conflict (url) do update')) throw new Error('MSDE source registry must be idempotent')

console.log('catalog MSDE NAPS-2/PMKVY current check passed: apprenticeship and training routes, capped DBT support, candidate/provider separation and post-FY2025-26 uncertainty remain review-gated')
