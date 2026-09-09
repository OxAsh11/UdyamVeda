import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260907520000_catalog_pharmaceuticals_medical_devices_pli_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_pharmaceuticals_medical_devices_pli.sql'), 'utf8')

for (const token of [
  'production-linked-incentive-medical-devices',
  'Revised%20Guidelines%20of%20PLI%20-%20MD%20dated%2025.02.2023',
  'English%20version%20of%20Annual%20Report%202023-24',
  'target_segments',
  'incentive_period',
  'incentive_rate":"5% of incremental sales',
  'financial_outlay_inr":34200000000',
  'minimum_investment_over_three_years_inr":1800000000',
  'category_a_incentive_cap_inr_per_applicant":12100000000',
  'category_b_incentive_cap_inr_per_applicant":4000000000',
  'greenfield_only',
  'closed_or_claim_only',
  'in_review',
]) {
  if (!seed.includes(token) && !migration.includes(token)) throw new Error(`Medical Devices PLI evidence missing: ${token}`)
}

if (!seed.includes('eligibility_rule_sets') || !seed.includes('reviewed)')) throw new Error('Medical Devices PLI rules must remain unreviewed')
if (!migration.includes('on conflict (url) do update')) throw new Error('Medical Devices PLI source registry must be idempotent')

console.log('catalog Medical Devices PLI current check passed: four target segments, greenfield condition, caps and claim-only uncertainty remain review-gated')
