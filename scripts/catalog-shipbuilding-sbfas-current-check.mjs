import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260907490000_catalog_shipbuilding_sbfas_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_shipbuilding_sbfas.sql'), 'utf8')

for (const token of [
  'shipbuilding-financial-assistance-scheme-sbfas',
  'Shipbuilding Financial Assistance Scheme (SBFAS)',
  'Modified%20Guidelines%20for%20implementation%20of%20Shipbuilding%20Financial%20Assistance%20Scheme',
  'eligible_contracts_from',
  'application_deadline_days_after_contract',
  'domestic_content_below_30_percent_support',
  'specialized_vessel_assistance_above_100_crore_percent',
  'SBFAP/SBFAS',
  'Chartered Accountant',
  'in_review',
]) {
  if (!seed.includes(token) && !migration.includes(token)) throw new Error(`SBFAS evidence missing: ${token}`)
}

if (!seed.includes('"window_type":"fixed"')) throw new Error('SBFAS must preserve its fixed contract/approval boundary')
if (!seed.includes('eligibility_rule_sets') || !seed.includes('reviewed)')) throw new Error('SBFAS rules must remain unreviewed')
if (!migration.includes('on conflict (url) do update')) throw new Error('SBFAS source registry must be idempotent')

console.log('catalog SBFAS current check passed: contract boundary, 45-day application, domestic content and vessel-rate conditions remain review-gated')
