import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908100001_catalog_power_adeetie_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_power_adeetie_current.sql'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-07-power-adeetie-source-audit.md'), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(`catalog ADEETIE check failed: ${message}`) }

assert(seed.includes('mop-adeetie-energy-efficiency-msme'), 'record is missing')
for (const url of [
  'https://adeetie.beeindia.gov.in/adeetie-scheme',
  'https://www.beeindia.gov.in/show_content.php?lang=1&level=1&lid=384&ls_id=234',
  'https://adeetie.beeindia.gov.in/operation-guideline-of-scheme',
  'https://adeetie.beeindia.gov.in/expression-of-interest-for-msmes-under-adeetie-scheme',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2144822&lang=2&reg=3',
]) assert(migration.includes(url) && seed.includes(url), `missing official source evidence ${url}`)
assert(seed.includes('micro_small_interest_subvention_percent":5') && seed.includes('medium_interest_subvention_percent":3'), 'subvention rates are missing')
assert(seed.includes('minimum_eligible_loan_inr":1000000') && seed.includes('maximum_eligible_loan_inr":150000000'), 'loan boundaries are missing')
assert(seed.includes('minimum_energy_savings_percent":10') && seed.includes('maximum_debt_funding_percent":75'), 'energy-savings or debt-funding boundary is missing')
assert(seed.includes('scheme_outlay_inr":10000000000') && seed.includes('not an applicant entitlement'), 'scheme corpus boundary is missing')
assert(seed.includes('review_status)') && seed.includes("'in_review'"), 'review gate is missing')
assert(audit.includes('Human review gate') && audit.includes('not an applicant entitlement'), 'audit boundaries are missing')

console.log('catalog ADEETIE check passed: current BEE/PIB evidence, MSME boundaries, subvention rates, loan/savings conditions and review gate are present')
