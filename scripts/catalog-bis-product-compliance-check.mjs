import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908160000_catalog_bis_product_compliance_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_bis_product_compliance_current.sql'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-07-bis-product-compliance-source-audit.md'), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(`catalog BIS product compliance check failed: ${message}`) }

for (const slug of ['bis-fmcs-foreign-manufacturer-licence', 'bis-hallmarking-jeweller-registration', 'bis-crs-electronics-it-registration']) {
  assert(seed.includes(slug), `${slug} is missing`)
}
for (const url of ['https://www.bis.gov.in/fmcs/fmcs-overview/?lang=en', 'https://www.bis.gov.in/fmcs/certification-process/how-to-apply/?lang=en', 'https://www.bis.gov.in/fmcs/certification-process/who-can-apply/?lang=en', 'https://www.bis.gov.in/fmcs/fmcs-faqs/?lang=en', 'https://www.bis.gov.in/hallmarking-jewellers/?lang=en', 'https://www.bis.gov.in/hallmarking-overview/?lang=en', 'https://www.bis.gov.in/wp-content/uploads/2024/01/Revised-Guidelines-for-JEWELLERS-Jan-24.pdf', 'https://www.crsbis.in/BIS/about-crs.do', 'https://www.manakonline.in/']) {
  assert(migration.includes(url) && seed.includes(url), `missing source evidence ${url}`)
}
for (const marker of ['separate_application_per_product_standard_factory', 'crs_boundary_for_meity_electronics_it', 'current_turnover_exemption_reference_inr":4000000', 'registration_validity":"lifetime"', 'meity_notification_check_required', 'recognized_lab_evidence_required']) {
  assert(seed.includes(marker), `boundary is missing: ${marker}`)
}
assert(seed.includes('review_status') && seed.includes("'in_review'"), 'review gate is missing')
assert(audit.includes('Human review gate') && audit.includes('not grants'), 'audit boundaries are missing')
console.log('catalog BIS product compliance check passed: FMCS, jeweller hallmarking and CRS routes remain separate, source-anchored and review-gated')
