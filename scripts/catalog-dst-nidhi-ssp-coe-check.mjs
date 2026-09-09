import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908030000_catalog_dst_nidhi_ssp_coe_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_dst_nidhi_ssp_coe.sql'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-07-dst-nidhi-ssp-coe-source-audit.md'), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(`catalog DST NIDHI check failed: ${message}`) }

for (const slug of ['dst-nidhi-seed-support-program', 'dst-nidhi-centres-of-excellence']) assert(seed.includes(slug), `record is missing: ${slug}`)
for (const url of [
  'https://nidhi.dst.gov.in/nidhissp/',
  'https://nidhi.dst.gov.in/document/nidhi-seed-support-program-nidhi-ssp-guidelines/',
  'https://nidhi.dst.gov.in/nidhicoe/',
  'https://nidhi.dst.gov.in/documents/',
  'https://onlinedst.gov.in/',
]) assert(migration.includes(url) && seed.includes(url), `missing official source evidence ${url}`)
assert(seed.includes('startup_max_support_inr":10000000') && seed.includes('incubator_max_support_inr":100000000'), 'SSP support ceilings are missing')
assert(seed.includes('listed_tbi_required') && seed.includes('periodic_call_required'), 'SSP intermediary route boundary is missing')
assert(seed.includes('five_year_institution_support_described') && seed.includes('no_amount_claimed'), 'CoE amount boundary is missing')
assert(seed.includes('"window_type":"call_for_applications"') && seed.includes('does not display a universal open call'), 'call-status boundary is missing')
assert(seed.includes('review_status)') && seed.includes("'in_review'"), 'review gate is missing')
assert(audit.includes('Human review gate') && audit.includes('not a guaranteed cash grant'), 'audit boundaries are missing')

console.log('catalog DST NIDHI check passed: SSP and CoE routes, ceilings, call boundaries and review gates are present')
