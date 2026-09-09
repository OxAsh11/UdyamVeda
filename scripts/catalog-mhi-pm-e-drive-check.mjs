import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908220000_catalog_mhi_pm_e_drive_current.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_mhi_pm_e_drive_current.sql'), 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog PM E-DRIVE check failed: ${message}`)
}

for (const url of [
  'https://pmedrive.heavyindustries.gov.in/',
  'https://pmedrive.heavyindustries.gov.in/policy_procedure',
  'https://pmedrive.heavyindustries.gov.in/policy_document',
  'https://pmedrive.heavyindustries.gov.in/docs/policy_document/EV%20PCS%20operational%20guidelines_F.pdf',
  'https://pmedrive.heavyindustries.gov.in/docs/policy_document/FAQs-Operational%20Guidelines%20for%20EV%20PCS%20under%20PM%20E-DRIVE.pdf',
  'https://pmedrive.heavyindustries.gov.in/docs/policy_document/Extension%20of%20Scheme%20till%2031%2003%202028%20dated%2007%2008%202025.pdf',
]) {
  assert(migration.includes(url), `source registry is missing ${url}`)
}

for (const marker of [
  'mhi-pm-e-drive-ev-public-charging-stations',
  'institutional_eligibility_verified',
  'appointed_nodal_agency_verified',
  'ev_pcs_feasibility_study_verified',
  'scheme_outlay_inr":109000000000',
  'scheme_end":"2028-03-31',
  'charger_benchmark_inr',
  'refundable deposits and GST are not eligible subsidy costs',
  'ordinary founders, startups, private landowners and private CPOs are not direct subsidy beneficiaries',
  'review_tasks',
  "'publish', 'open'",
]) {
  assert(seed.includes(marker), `seed is missing ${marker}`)
}

assert(seed.includes('appointed nodal agency') && seed.includes('CPO'), 'institutional and CPO boundaries must remain explicit')
assert(seed.includes("'in_review'"), 'record must remain review-gated')
assert(seed.includes('on conflict do nothing'), 'seed inserts must be idempotent')

console.log('catalog PM E-DRIVE check passed: current EV PCS route, institutional eligibility, benchmark boundaries and review gate are present')
