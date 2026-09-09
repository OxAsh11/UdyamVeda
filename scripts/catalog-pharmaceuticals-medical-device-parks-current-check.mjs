import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260907530000_catalog_pharmaceuticals_medical_device_parks_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_pharmaceuticals_medical_device_parks.sql'), 'utf8')

for (const token of [
  'promotion-of-medical-device-parks',
  'Guidelines%20of%20the%20Scheme%20Promotion%20of%20Medical%20Devices%20Parks',
  'financial_outlay_inr":40000000000',
  'parks_supported":4',
  'maximum_grant_inr_per_park":10000000000',
  'standard_assistance_percent_project_cost":70',
  'north_east_and_hilly_states_assistance_percent_project_cost":90',
  'application_window_closed":"2020-10-15"',
  'State Implementing Agency',
  'individual_unit_not_direct_recipient',
  'window_type":"closed"',
  'in_review',
]) {
  if (!seed.includes(token) && !migration.includes(token)) throw new Error(`Medical Device Parks evidence missing: ${token}`)
}

if (!seed.includes('eligibility_rule_sets') || !seed.includes('reviewed)')) throw new Error('Medical Device Parks rules must remain unreviewed')
if (!migration.includes('on conflict (url) do update')) throw new Error('Medical Device Parks source registry must be idempotent')

console.log('catalog Medical Device Parks current check passed: State/SIA route, common-infrastructure grant limits and closed-window boundary remain review-gated')
