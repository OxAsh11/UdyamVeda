import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260907560000_catalog_birac_sbiri_bipp_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_birac_sbiri_bipp.sql'), 'utf8')

for (const token of [
  'birac-sbiri-small-business-innovation-research-initiative',
  'birac-bipp-biotechnology-industry-partnership-programme',
  '1745298212_SBIRI_scheme_guidelines_16_04_2025.pdf',
  '1729751884_BIPP_scheme_guidelines_revised.pdf',
  'first_time_startup_grant_cap_inr":5000000',
  'first_time_startup_above_cap_assistance_percent":70',
  'standard_birac_contribution_percent":50',
  'phase_three_clinical_or_ag_field_trial_max_assistance_percent":75',
  'royalty_percent_on_net_sales":7',
  'in_review',
]) {
  if (!seed.includes(token) && !migration.includes(token)) throw new Error(`BIRAC evidence missing: ${token}`)
}

if (!seed.includes('legacy_conflict')) throw new Error('SBIRI legacy funding conflict must remain explicit')
if (!seed.includes('window_type":"recurring"')) throw new Error('BIRAC recurring call windows are missing')
if (!seed.includes('eligibility_rule_sets') || !seed.includes('reviewed)')) throw new Error('BIRAC rules must remain unreviewed')
if (!migration.includes('on conflict (url) do update')) throw new Error('BIRAC source registry must be idempotent')

console.log('catalog BIRAC SBIRI/BIPP current check passed: distinct early-stage and advanced biotech routes, funding tracks, royalty boundaries and recurring-call uncertainty remain review-gated')
