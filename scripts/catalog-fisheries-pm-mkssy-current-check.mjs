import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_fisheries_pm_mkssy.sql'), 'utf8')
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260907460000_catalog_fisheries_pm_mkssy_current_evidence.sql'), 'utf8')

const required = [
  'pradhan-mantri-matsya-kisan-samridhi-sah-yojana',
  'https://pmmsy.dof.gov.in/',
  'https://www.dof.gov.in/static/uploads/2025/09/db9e0987df6461b69304fe4115aceec9.pdf',
  'https://dof.gov.in/sites/default/files/2024-12/PMMKSSY_compressed.pdf',
  'https://nfdp.dof.gov.in/nfdp/',
  'https://pmmkssy.dof.gov.in/pmmkssy/',
  'performance_grants',
  'post-verification',
  'nfdp_registration_required',
  'no_upfront_subsidy_assumed',
  '2026-27',
  'review_note',
  'in_review',
]

for (const token of required) {
  if (!seed.includes(token) && !migration.includes(token)) throw new Error(`PM-MKSSY current evidence missing: ${token}`)
}

if (!seed.includes('"window_type":"fixed"')) throw new Error('PM-MKSSY must preserve its fixed FY 2026-27 boundary')
if (!seed.includes('eligibility_rule_sets') || !seed.includes('reviewed)')) throw new Error('PM-MKSSY eligibility rules must remain unreviewed')
if (!migration.includes('on conflict (url) do update')) throw new Error('PM-MKSSY source registry must be idempotent')

console.log('catalog fisheries PM-MKSSY current check passed: FY 2026-27 boundary, NFDP route, component-separated benefits and post-verification conditions are review-gated')
