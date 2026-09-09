import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908250000_catalog_nidhi_eir_current.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_nidhi_eir_current.sql'), 'utf8')

const assert = (condition, message) => {
  if (!condition) throw new Error(`catalog NIDHI-EIR check failed: ${message}`)
}

for (const url of [
  'https://nidhi.dst.gov.in/nidhieir/',
  'https://nidhi.dst.gov.in/schemes-programmes/',
  'https://nidhi.dst.gov.in/about-department/about-nidhi/',
  'https://cdnbbsr.s3waas.gov.in/s312b1e42dc0746f22cf361267de07073f/uploads/2023/01/2023010680.pdf',
]) assert(migration.includes(url), `source registry is missing ${url}`)

for (const marker of [
  'dst-nidhi-entrepreneur-in-residence-fellowship',
  'monthly_support_min_inr":10000',
  'monthly_support_max_inr":30000',
  'current_page_max_period_months":12',
  'guideline_extension_max_period_months":18',
  'selected_nidhi_eir_tbi_route_verified',
  'not a universal direct DST application',
  'current 12-month page term',
  'review_tasks',
  "'publish', 'open'",
]) assert(seed.includes(marker), `seed is missing ${marker}`)

assert(seed.includes('selected TBI') && seed.includes('no concurrent remuneration'), 'incubator and full-time boundaries must remain explicit')
assert(seed.includes('on conflict do nothing') && seed.includes("'in_review'"), 'seed must remain idempotent and review-gated')

console.log('catalog NIDHI-EIR check passed: fellowship amounts, duration conflict, TBI route and review gate are present')
