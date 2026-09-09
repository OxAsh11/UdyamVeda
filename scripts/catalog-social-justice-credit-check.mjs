import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908120000_catalog_social_justice_credit_current_evidence.sql'), 'utf8')
const nsfdcMigration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908500000_catalog_nsfdc_current_reconciliation.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_social_justice_credit_current.sql'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-07-social-justice-credit-source-audit.md'), 'utf8')
const nsfdcAudit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-08-nsfdc-income-credit-source-audit.md'), 'utf8').toLowerCase()
const nsfdcPacket = fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-080.json'), 'utf8').toLowerCase()
const assert = (condition, message) => { if (!condition) throw new Error(`catalog Social Justice credit check failed: ${message}`) }

for (const slug of ['credit-enhancement-guarantee-sc', 'nsfdc-income-generating-credit']) {
  assert(seed.includes(slug), `${slug} is missing`)
  assert(migration.includes(slug), `${slug} is missing from migration`)
}

for (const url of [
  'https://socialjustice.gov.in/schemes/32',
  'https://www.ifcicegssc.in/',
  'https://socialjustice.gov.in/writereaddata/UploadFile/creditguide09082019.pdf',
  'https://socialjustice.gov.in/writereaddata/UploadFile/CreditEnhancementGuaranteeSchemeSCs.pdf',
  'https://socialjustice.gov.in/schemes/34',
  'https://nsfdc.nic.in/',
  'https://nsfdc.nic.in/faqs',
  'https://nsfdc.nic.in/about-us-3',
  'https://nsfdc.nic.in/UploadedFiles/other/2024-05-15/1-4-1.pdf',
  'https://pmsuraj.dosje.gov.in/',
]) assert(migration.includes(url) && seed.includes(url), `missing official source evidence ${url}`)

for (const marker of [
  'guarantee_cover_min_inr":1500000',
  'guarantee_cover_max_inr":50000000',
  'sc_ownership_min_percent":51',
  'guarantee_not_direct_loan',
  'member_lending_institution_route',
  'annual_family_income_max_inr":500000',
  'channel_partner_required',
  'track_specific_limits',
  'loan_not_guaranteed',
  'PM-SURAJ',
]) assert(seed.includes(marker), `fine-print boundary is missing: ${marker}`)

assert(seed.includes('review_status') && seed.includes("'in_review'"), 'review gate is missing')
assert(audit.includes('Human review gate') && audit.includes('not a direct grant') && audit.includes('product tracks must remain separate'), 'audit boundaries are missing')

for (const marker of [
  'current_faq_route',
  'annual_family_income_max_inr',
  'income_rule_effective_date',
  'authorized_channel_partner_required',
  'direct_nsfdc_application_not_available',
  'maximum_project_cost_finance_percent',
  'product_tracks_must_remain_separate',
  'micro_finance_scheme',
  'aajeevika_micro_finance_yojana',
  'term_loan',
  'udyam_nidhi',
  'training_and_market_support_are_separate',
  '2026-09-08',
]) assert(nsfdcMigration.includes(marker), `NSFDC reconciliation is missing: ${marker}`)
for (const marker of ['status: `in_review`', 'channel partners', 'current faq controls', 'separate non-loan activities']) {
  assert(nsfdcAudit.includes(marker), `NSFDC audit is missing: ${marker}`)
}
for (const marker of ['current official nsfdc faq', 'inr 5 lakh', 'pm-suraj', 'remain_in_review', 'publicationready']) {
  assert(nsfdcPacket.includes(marker), `NSFDC evidence packet is missing: ${marker}`)
}

console.log('catalog Social Justice credit check passed: CEGSSC guarantee and NSFDC channel-credit routes remain separate, source-anchored and review-gated')
