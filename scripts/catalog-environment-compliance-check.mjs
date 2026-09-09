import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908150000_catalog_environment_compliance_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_environment_compliance_current.sql'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-07-environment-compliance-source-audit.md'), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(`catalog Environment compliance check failed: ${message}`) }

for (const slug of ['cpcb-plastic-packaging-epr-registration', 'cpcb-e-waste-epr-producer-registration', 'moefcc-parivesh-environmental-clearance']) {
  assert(seed.includes(slug), `${slug} is missing`)
}
for (const url of ['https://cpcb.nic.in/uploads/plasticwaste/SOP_PWM_24062024.pdf', 'https://cpcb.nic.in/uploads/Projects/E-Waste/FAQ_ewaste_23012024.pdf', 'https://cpcb.nic.in/rules-7/', 'https://cpcbeprplastic.in/', 'https://moef.gov.in/index.php/environmental-impact-assessment-eia', 'https://parivesh.nic.in/']) {
  assert(migration.includes(url) && seed.includes(url), `missing source evidence ${url}`)
}
for (const marker of ['multiple_categories_separate_registration', 'epr_obligations_continue_after_registration', 'fy_2025_26_and_2026_27_target_percent":70', 'project_category_and_site_screening_required', 'approval_not_guaranteed']) {
  assert(seed.includes(marker), `boundary is missing: ${marker}`)
}
assert(seed.includes('review_status') && seed.includes("'in_review'"), 'review gate is missing')
assert(audit.includes('Human review gate') && audit.includes('not a grant'), 'audit boundaries are missing')
console.log('catalog Environment compliance check passed: plastic EPR, e-waste EPR and PARIVESH clearance routes remain separate, source-anchored and review-gated')
