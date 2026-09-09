import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260907510000_catalog_pharmaceuticals_bulk_drugs_pli_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_pharmaceuticals_bulk_drugs_pli.sql'), 'utf8')

for (const token of [
  'production-linked-incentive-bulk-drugs-ksm-di-api',
  'Gazettee%20notification%20of%20bulk%20drug%20schemes',
  'Guidelines%20for%20the%20Production%20Linked%20Incentive',
  'Corrigendum%20dated%2012.03.2024',
  'Corrigendum%20Under%20PLI%20scheme%20for%20Bulk%20Drugs',
  'eligible_product_count":41',
  'application_window_days":120',
  'minimum_investment_inr":4000000000',
  'minimum_investment_inr":500000000',
  'minimum_investment_inr":200000000',
  'greenfield_only',
  'FY 2029-30',
  '20%',
  'bank-guarantee',
  'in_review',
]) {
  if (!seed.includes(token) && !migration.includes(token)) throw new Error(`Bulk Drugs PLI evidence missing: ${token}`)
}

if (!seed.includes('"window_type":"closed_or_claim_only"')) throw new Error('Bulk Drugs PLI must preserve historic-window/current-claim uncertainty')
if (!seed.includes('eligibility_rule_sets') || !seed.includes('reviewed)')) throw new Error('Bulk Drugs PLI rules must remain unreviewed')
if (!migration.includes('on conflict (url) do update')) throw new Error('Bulk Drugs PLI source registry must be idempotent')

console.log('catalog Bulk Drugs PLI current check passed: distinct 41-product greenfield route, thresholds, amendments and claim uncertainty remain review-gated')
