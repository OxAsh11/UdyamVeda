import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260907580000_catalog_meity_genesis_telecom_testing_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_meity_genesis_telecom_testing.sql'), 'utf8')

for (const token of [
  'meity-genesis-gen-next-support-for-innovative-startups',
  'dot-telecom-testing-certification-reimbursement-startups-mses',
  'Brochure_GENESIS.pdf',
  '837f9d009185a3e2061fb12ba8ef4d17.pdf',
  'scheme_outlay_inr":4900000000',
  'brochure_deep_tech_support_max_inr":10000000',
  'startup_reimbursement_percent":75',
  'micro_enterprise_reimbursement_percent":60',
  'small_enterprise_reimbursement_percent":50',
  'maximum_reimbursement_per_entity_inr":5000000',
  'in_review',
]) {
  if (!seed.includes(token) && !migration.includes(token)) throw new Error(`MeitY/DoT evidence missing: ${token}`)
}

if (!seed.includes('selected_implementing_agency_required') || !seed.includes('historical component ceilings')) throw new Error('GENESIS agency and historical-ceiling boundaries are missing')
if (!seed.includes('no_duplicate_reimbursement') || !seed.includes('same_expense_not_reimbursed_elsewhere')) throw new Error('Telecom reimbursement no-double-benefit boundaries are missing')
if (!seed.includes('eligibility_rule_sets') || !seed.includes('reviewed)')) throw new Error('MeitY/DoT rules must remain unreviewed')
if (!migration.includes('on conflict (url) do update')) throw new Error('MeitY/DoT source registry must be idempotent')

console.log('catalog MeitY GENESIS/DoT testing current check passed: component-specific startup support, telecom reimbursement rates/caps, agency routes and review gates remain explicit')
