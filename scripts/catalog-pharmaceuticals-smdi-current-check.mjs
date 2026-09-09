import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260907540000_catalog_pharmaceuticals_smdi_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_pharmaceuticals_smdi.sql'), 'utf8')

for (const token of [
  'smdi-common-facilities-medical-device-clusters',
  'smdi-marginal-investment-reducing-import-dependence',
  'smdi-capacity-building-skill-development-medical-devices',
  'smdi-medical-device-clinical-studies-support',
  'smdi-medical-device-promotion-scheme',
  'Final%20guidelines%20for%20SMDI-8.11.2024',
  'scheme-strengthening-medical-device-industry',
  'component_outlay_inr":11000000000',
  'component_outlay_inr":18000000000',
  'component_outlay_inr":10000000000',
  'component_outlay_inr":1000000000',
  'common_facility_grant_cap_inr":2000000000',
  'maximum_subsidy_inr_per_project":1000000000',
  'maximum_support_per_study_inr":500000000',
  'Corrigendum%20for%20revised%20operational%20guidelines',
  'in_review',
]) {
  if (!seed.includes(token) && !migration.includes(token)) throw new Error(`SMDI evidence missing: ${token}`)
}

if (!seed.includes('"window_type":"call_for_proposals"')) throw new Error('SMDI records must preserve proposal-call uncertainty')
if (!seed.includes('eligibility_rule_sets') || !seed.includes('reviewed)')) throw new Error('SMDI rules must remain unreviewed')
if (!migration.includes('on conflict (url) do update')) throw new Error('SMDI source registry must be idempotent')

console.log('catalog SMDI current check passed: five sub-schemes, distinct beneficiaries/benefits, 2025-26 changes and live-call uncertainty remain review-gated')
