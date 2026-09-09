import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260907550000_catalog_pharmaceuticals_prip_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_pharmaceuticals_prip.sql'), 'utf8')

for (const token of [
  'prip-component-a-niper-centres-of-excellence',
  'prip-component-b-industry-startup-rd-projects',
  'Scheme_Guidelines_Final.pdf',
  'prip.pharma-dept.gov.in',
  'component_a_outlay_inr":70000000000',
  'component_b_outlay_inr":420000000000',
  'early_stage_full_assistance_percent":100',
  'early_stage_above_1_to_5_crore_assistance_percent":50',
  'later_stage_assistance_percent":35',
  'later_stage_cap_inr_per_project":10000000000',
  'strategic_priority_assistance_percent":50',
  'financial_closure_weeks":8',
  'Second Call for Applications',
  'in_review',
]) {
  if (!seed.includes(token) && !migration.includes(token)) throw new Error(`PRIP evidence missing: ${token}`)
}

if (!seed.includes('"window_type":"call_for_applications"')) throw new Error('PRIP Component B must preserve call-window uncertainty')
if (!seed.includes('eligibility_rule_sets') || !seed.includes('reviewed)')) throw new Error('PRIP rules must remain unreviewed')
if (!migration.includes('on conflict (url) do update')) throw new Error('PRIP source registry must be idempotent')

console.log('catalog PRIP current check passed: Components A/B, TRL-based startup funding, co-funding and second-call state remain review-gated')
