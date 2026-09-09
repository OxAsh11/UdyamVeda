import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_self_employment.sql'), 'utf8')
const currentEvidenceMigration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260907240000_catalog_svanidhi_current_evidence.sql'), 'utf8')
const auditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-07-pm-svanidhi-source-audit.md')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog PM SVANidhi check failed: ${message}`)
}

assert(seed.includes('pm-street-vendors-atmanirbhar-nidhi-pm-svanidhi'), 'PM SVANidhi identity is missing')
assert(seed.includes('"amount_max_inr":15000') && seed.includes('"amount_max_inr":25000') && seed.includes('"amount_max_inr":50000'), 'current progressive loan tranches are missing')
assert(seed.includes('"repayment_months":12') && seed.includes('"repayment_months":18') && seed.includes('"repayment_months":36'), 'current repayment periods are missing')
assert(seed.includes('"upi_linked_rupay_credit_card_max_inr":30000'), 'UPI-linked RuPay credit-card ceiling is missing')
assert(seed.includes('"digital_cashback_max_inr":1600'), 'digital cashback ceiling is missing')
assert(seed.includes('"scheme_outlay_inr":73320000000') && seed.includes('"outlay_is_not_applicant_entitlement":true'), 'total outlay is not separated from applicant benefit')
assert(seed.includes('The older MoHUA FAQ and guideline describe the original'), 'obsolete terms are not explicitly reconciled')
assert(seed.includes('PRID=2161157') && seed.includes('PRID=2289997'), 'current restructuring and tranche clarification sources are missing')
assert(seed.includes('PMSVANidhi%20Guideline_English.pdf') && seed.includes('FAQ-PM-SAVNidhi-English.pdf'), 'MoHUA guideline and FAQ sources are missing')
assert(seed.includes('current_source_findings') && seed.includes('clarification_as_of'), 'current PIB reconciliation is missing')
assert(currentEvidenceMigration.includes('current_source_findings'), 'current PM SVANidhi evidence migration is missing')
assert(fs.existsSync(auditPath), 'PM SVANidhi source audit is missing')
assert(seed.includes("'in_review'"), 'record must remain review-gated')
assert(!seed.includes(", 'active',") && !seed.includes(", 'upcoming',"), 'record must not be published before review')

console.log('catalog PM SVANidhi check passed: current tranches, amendment reconciliation, official provenance and review gate are present')
