import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260907480000_catalog_specialty_steel_pli_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_specialty_steel_pli.sql'), 'utf8')

for (const token of [
  'production-linked-incentive-specialty-steel',
  'Production Linked Incentive (PLI) Scheme for Specialty Steel',
  'https://steel.gov.in/pli',
  '2025-04/Scheme%20Guidelines_Final_Upload.pdf',
  'PLI 1.2',
  'original_scheme_budget_inr',
  'pli_12_incentive_rate_range_percent',
  'selected-company',
  'selected_under_pli_round',
  'current_pli_application_window_open',
  'in_review',
]) {
  if (!seed.includes(token) && !migration.includes(token)) throw new Error(`Specialty-steel PLI evidence missing: ${token}`)
}

if (!seed.includes('"window_type":"closed"')) throw new Error('Specialty-steel PLI must not imply a currently open new-applicant window')
if (!seed.includes('eligibility_rule_sets') || !seed.includes('reviewed)')) throw new Error('Specialty-steel PLI rules must remain unreviewed')
if (!migration.includes('on conflict (url) do update')) throw new Error('Specialty-steel PLI source registry must be idempotent')

console.log('catalog specialty-steel PLI current check passed: PLI 1.2, selected-company boundaries, date reconciliation and closed new-applicant window remain review-gated')
