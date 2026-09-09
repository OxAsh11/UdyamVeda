import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260907500000_catalog_shipbuilding_sbds_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_shipbuilding_sbds.sql'), 'utf8')

for (const token of [
  'shipbuilding-development-scheme-greenfield-cluster',
  'shipbuilding-development-scheme-brownfield-capacity-expansion',
  'shipbuilding-development-scheme-risk-coverage',
  'Annexure%203%20Greenfield%20guidelines',
  'Annexure%204%20Brownfield_V23',
  'Annexure%202%20Credit%20risk%20coverage',
  '100% central capital assistance',
  'capital_assistance_percent":25',
  'capital_assistance_cap_inr_per_shipyard":150000000000',
  'grant_tranches_percent":[15,30,35,20]',
  'pre_shipment_insurance',
  'post_shipment_insurance',
  'vendor_default_insurance',
  'Sagarmala Financial Corporation Limited',
  '2036-03-31',
  'in_review',
]) {
  if (!seed.includes(token) && !migration.includes(token)) throw new Error(`SbDS evidence missing: ${token}`)
}

if (!seed.includes('"window_type":"fixed"')) throw new Error('SbDS records must preserve their fixed scheme boundary')
if (!seed.includes('eligibility_rule_sets') || !seed.includes('reviewed)')) throw new Error('SbDS rules must remain unreviewed')
if (!migration.includes('on conflict (url) do update')) throw new Error('SbDS source registry must be idempotent')

console.log('catalog SbDS current check passed: greenfield, brownfield and risk-coverage routes remain separate and review-gated')
