import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908140000_catalog_tribal_livelihood_nstfdc_current_evidence.sql'), 'utf8')
const nstfdcMigration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908510000_catalog_nstfdc_term_loan_current_reconciliation.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_tribal_livelihood_nstfdc_current.sql'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-07-tribal-livelihood-nstfdc-source-audit.md'), 'utf8')
const nstfdcAudit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-08-nstfdc-term-loan-source-audit.md'), 'utf8').toLowerCase()
const nstfdcPacket = fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-081.json'), 'utf8').toLowerCase()
const artisanMigration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908520000_catalog_nstfdc_trifed_artisan_current_reconciliation.sql'), 'utf8')
const artisanAudit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-08-nstfdc-trifed-artisan-source-audit.md'), 'utf8').toLowerCase()
const artisanPacket = fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-082.json'), 'utf8').toLowerCase()
const assert = (condition, message) => { if (!condition) throw new Error(`catalog Tribal/NSTFDC check failed: ${message}`) }

for (const slug of ['pmjvm-tribal-value-chain', 'vcf-st-tribal-startups', 'nstfdc-term-loan-st-entrepreneurs', 'nstfdc-trifed-empanelled-artisan-credit']) {
  assert(seed.includes(slug), `${slug} is missing`)
  assert(migration.includes(slug), `${slug} is missing from migration`)
}

for (const url of [
  'https://tribal.gov.in/Livelihood.aspx',
  'https://tribal.gov.in/PFMS_SentionDtSchemewise2627.aspx',
  'https://trifed.tribal.gov.in/index.php/en/pmvdy',
  'https://trifed.tribal.gov.in/en/node/950',
  'https://nstfdc.tribal.gov.in/',
  'https://nstfdc.tribal.gov.in/CuteSoft_Client/writereaddata/upload/NSTFDC_AR%20-%202024-25_Final_03-12-25_English.pdf',
]) assert(migration.includes(url) && seed.includes(url), `missing official source evidence ${url}`)

for (const marker of [
  'project_cost_max_inr":5000000',
  'nstfdc_finance_share_max_percent":90',
  'individual_assistance_max_inr":50000',
  'shg_or_cooperative_assistance_max_inr":500000',
  'tribal_value_chain_required',
  'ifci_vcf_route_required',
  'loan_not_guaranteed',
]) assert(seed.includes(marker), `fine-print boundary is missing: ${marker}`)

assert(seed.includes('review_status') && seed.includes("'in_review'"), 'review gate is missing')
assert(audit.includes('Human review gate') && audit.includes('not a universal individual grant'), 'audit boundaries are missing')

for (const url of [
  'https://nstfdc.tribal.gov.in/frm_term_loan.aspx',
  'https://nstfdc.tribal.gov.in/frm_eligibility.aspx',
  'https://nstfdc.tribal.gov.in/frm_how_to_apply.aspx',
  'https://nstfdc.tribal.gov.in/UploadData/pdf/List_of_Addresses_of_SCAs.pdf',
]) assert(nstfdcMigration.includes(url), `NSTFDC current source is missing: ${url}`)
for (const marker of [
  'unit_cost_max_inr',
  'nstfdc_finance_share_max_percent',
  'promoter_contribution_by_unit_cost',
  'beneficiary_interest_by_loan_amount',
  'sca_interest_by_loan_amount',
  'repayment_installment_frequency',
  'repayment_max_years',
  'moratorium_duration_published',
  'current_eligibility_income_reference_inr',
  'cooperative_min_st_membership_percent',
  'notified_state_or_ut_residence_required',
  'current_income_reference_conflict_requires_review',
  '2026-09-08',
]) assert(nstfdcMigration.includes(marker), `NSTFDC reconciliation is missing: ${marker}`)
for (const marker of ['status: `in_review`', 'promoter contribution', 'current page does not state', 'income-reference reconciliation']) {
  assert(nstfdcAudit.includes(marker), `NSTFDC audit is missing: ${marker}`)
}
for (const marker of ['current first-party nstfdc term loan', 'inr 50 lakh', '90%', 'remain_in_review', 'publicationready']) {
  assert(nstfdcPacket.includes(marker), `NSTFDC evidence packet is missing: ${marker}`)
}

for (const url of [
  'https://nstfdc.tribal.gov.in/UploadData/pdf/RTI.pdf',
  'https://trifed.tribal.gov.in/en/node/950',
  'https://nstfdc.tribal.gov.in/frm_eligibility.aspx',
]) assert(artisanMigration.includes(url), `NSTFDC/TRIFED artisan source is missing: ${url}`)
for (const marker of [
  'individual_assistance_max_inr',
  'shg_or_cooperative_assistance_max_inr',
  'nstfdc_finance_share_max_percent',
  'sca_interest_percent_women',
  'beneficiary_interest_percent_men',
  'trifed_group_minimum_tribal_share_percent',
  'group_ceiling_and_unit_cost_base_require_review',
  'empanelment_does_not_guarantee_credit',
  '2026-09-08',
]) assert(artisanMigration.includes(marker), `NSTFDC/TRIFED artisan reconciliation is missing: ${marker}`)
for (const marker of ['provenance correction', 'in_review', '50,000', '5 lakh', '70%', 'human review gate']) {
  assert(artisanAudit.includes(marker), `NSTFDC/TRIFED artisan audit is missing: ${marker}`)
}
for (const marker of ['direct nstfdc rti manual', 'inr 50,000', 'inr 5 lakh', '90%', 'remain_in_review', 'publicationready']) {
  assert(artisanPacket.includes(marker), `NSTFDC/TRIFED artisan evidence packet is missing: ${marker}`)
}

console.log('catalog Tribal/NSTFDC check passed: PMJVM, VCF-ST, NSTFDC term-loan and TRIFED-artisan routes remain separate, source-anchored and review-gated')
