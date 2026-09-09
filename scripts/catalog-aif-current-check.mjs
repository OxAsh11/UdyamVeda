import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_agri_enterprise.sql'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-08-agriculture-infrastructure-fund-source-audit.md'), 'utf8')
const assert = (condition, message) => {
  if (!condition) throw new Error('catalog AIF check failed: ' + message)
}

assert(seed.includes('"slug":"agriculture-infrastructure-fund"'), 'AIF record is missing')
assert(seed.includes('91EE46A50D3941908F192725717E431B.pdf'), 'official guideline source is missing')
assert(seed.includes('"interest_subvention_percent":3'), '3% interest subvention is missing')
assert(seed.includes('"eligible_loan_limit_for_subvention_inr":20000000'), '₹2 crore subvention limit is missing')
assert(seed.includes('"maximum_subvention_years":7'), 'seven-year subvention boundary is missing')
assert(seed.includes('"private_sector_max_projects":25'), 'private-sector project-count boundary is missing')
assert(seed.includes('"scheme_operational_period":"2020-21 to 2032-33'), 'revised operational period is missing')
assert(seed.includes('"benefit_is_not_a_cash_grant":true'), 'loan-support boundary is missing')
assert(seed.includes('"separate_value_buckets":true'), 'benefit buckets are not separated')
assert(seed.includes('"exclusions"') && seed.includes('Standalone secondary processing'), 'AIF exclusions are missing')
assert(seed.includes('"unknown_handling":"needs_information"'), 'unknown handling is missing')
assert(audit.includes('Human review gate') && audit.includes('review-gated'), 'human review gate is missing')

console.log('catalog AIF check passed: official guideline, financing boundaries, project limits, exclusions and review gate remain encoded')
