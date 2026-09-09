import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908130000_catalog_minority_nmdfc_current_evidence.sql'), 'utf8')
const currentMigration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908460000_catalog_nmdfc_microfinance_current_reconciliation.sql'), 'utf8')
const termLoanMigration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908470000_catalog_nmdfc_term_loan_current_reconciliation.sql'), 'utf8')
const virasatMigration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908480000_catalog_nmdfc_virasat_current_reconciliation.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_minority_nmdfc_current.sql'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-07-minority-nmdfc-source-audit.md'), 'utf8')
const currentAudit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-08-nmdfc-microfinance-source-audit.md'), 'utf8').toLowerCase()
const termLoanAudit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-08-nmdfc-term-loan-source-audit.md'), 'utf8').toLowerCase()
const virasatAudit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-08-nmdfc-virasat-source-audit.md'), 'utf8').toLowerCase()
const packet = fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-076.json'), 'utf8')
const termLoanPacket = fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-077.json'), 'utf8')
const virasatPacket = fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-078.json'), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(`catalog Minority/NMDFC check failed: ${message}`) }

for (const slug of ['nmdfc-term-loan-employment-venture', 'nmdfc-micro-finance-shg', 'nmdfc-virasat-artisan-credit']) {
  assert(seed.includes(slug), `${slug} is missing`)
  assert(migration.includes(slug), `${slug} is missing from migration`)
}

for (const url of [
  'https://www.nmdfc.org/nmdfcschemes',
  'https://www.nmdfc.org/faq',
  'https://www.nmdfc.org/credit-1',
  'https://www.nmdfc.org/guidelines_for_micro_financing_schemes',
  'https://www.nmdfc.org/home/nmdfc_schemes',
  'https://minorityaffairs.gov.in/WriteReadData/RTF1984/1953017398.pdf',
]) assert(migration.includes(url) && seed.includes(url), `missing official source evidence ${url}`)

for (const marker of [
  'credit_line_1_annual_family_income_max_inr":300000',
  'credit_line_2_annual_family_income_max_inr":800000',
  'credit_line_1_loan_ceiling_inr":2000000',
  'credit_line_2_loan_ceiling_inr":3000000',
  'credit_line_1_member_loan_max_inr":100000',
  'credit_line_2_group_loan_max_inr":3000000',
  'loan_ceiling_inr":1000000',
  'sca_route_required',
  'loan_not_guaranteed',
]) assert(seed.includes(marker), `fine-print boundary is missing: ${marker}`)

assert(seed.includes('review_status') && seed.includes("'in_review'"), 'review gate is missing')
assert(audit.includes('Human review gate') && audit.includes('must not be combined'), 'audit boundaries are missing')
for (const marker of [
  'current_scheme_route',
  'current_guideline_route',
  'shg_max_members',
  'credit_line_1_member_credit_max_inr',
  'credit_line_1_group_credit_max_inr',
  'credit_line_2_member_credit_max_inr',
  'credit_line_2_group_credit_max_inr',
  'micro_credit_moratorium_months',
  'historical_older_per_member_value_inr',
  'historical_value_is_not_current_summary',
  'member_and_group_values_must_remain_separate',
  '2026-09-08',
]) assert(currentMigration.includes(marker), `current reconciliation is missing: ${marker}`)
for (const marker of ['status: `in_review`', 'current nmdfc schemes page', 'historical micro-finance values', 'must remain separate']) {
  assert(currentAudit.includes(marker), `current audit is missing: ${marker}`)
}
for (const marker of ['self help groups', 'current NMDFC schemes page', 'historical conflict', 'remain_in_review', 'publicationReady']) {
  assert(packet.toLowerCase().includes(marker.toLowerCase()), `evidence packet is missing: ${marker}`)
}
for (const marker of [
  'current_scheme_route',
  'current_credit_line_1_route',
  'current_credit_line_2_route',
  'credit_line_1_nmdfc_share_cap_inr',
  'credit_line_2_nmdfc_share_cap_inr',
  'nmdfc_project_cost_share_percent',
  'beneficiary_min_contribution_percent',
  'sca_financing_pattern',
  'beneficiary_moratorium_months',
  'beneficiary_repayment_years',
  'headline_ceiling_is_not_guaranteed_sanction',
  'project_cost_and_nmdfc_share_must_remain_separate',
  '2026-09-08',
]) assert(termLoanMigration.includes(marker), `term-loan reconciliation is missing: ${marker}`)
for (const marker of ['status: `in_review`', 'credit line detail pages', 'headline credit ceilings', 'must not be displayed']) {
  assert(termLoanAudit.includes(marker), `term-loan audit is missing: ${marker}`)
}
for (const marker of ['economically viable', 'technical feasibility', 'headline ceilings', 'remain_in_review', 'publicationReady']) {
  assert(termLoanPacket.toLowerCase().includes(marker.toLowerCase()), `term-loan evidence packet is missing: ${marker}`)
}

for (const url of [
  'https://nmdfc.org/virasat_a_credit_scheme_for_craftpersons',
  'https://nmdfc.org/credit-2',
  'https://nmdfc.org/lendingpolicy',
]) assert(virasatMigration.includes(url), `missing Virasat official source evidence ${url}`)
for (const marker of [
  'current_virasat_route',
  'credit_line_1_artisan_annual_family_income_max_inr',
  'credit_line_2_artisan_annual_family_income_max_inr',
  'loan_ceiling_inr',
  'credit_line_1_interest_percent',
  'credit_line_2_interest_percent_male',
  'female_artisan_concession_percent',
  'beneficiary_moratorium_months',
  'beneficiary_repayment_years',
  'working_capital_and_fixed_capital',
  'not_free_toolkit_or_grant',
  'sca_or_partner_route_required',
  'current_page_female_rate_conflict',
  '2026-09-08',
]) assert(virasatMigration.includes(marker), `Virasat reconciliation is missing: ${marker}`)
for (const marker of ['status: `in_review`', 'internally inconsistent', 'not a guaranteed grant', 'must not publish']) {
  assert(virasatAudit.includes(marker), `Virasat audit is missing: ${marker}`)
}
for (const marker of ['minority craftperson', 'current NMDFC schemes page', 'not a universal grant', 'remain_in_review', 'publicationReady']) {
  assert(virasatPacket.toLowerCase().includes(marker.toLowerCase()), `Virasat evidence packet is missing: ${marker}`)
}

console.log('catalog Minority/NMDFC check passed: Term Loan, Micro-Finance and Virasat routes remain separate; current term-loan and micro-finance evidence remains review-gated')
