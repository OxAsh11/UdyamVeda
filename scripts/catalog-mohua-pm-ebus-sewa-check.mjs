import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908230000_catalog_mohua_pm_ebus_sewa_current.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_mohua_pm_ebus_sewa_current.sql'), 'utf8')

const assert = (condition, message) => {
  if (!condition) throw new Error(`catalog PM-eBus Sewa check failed: ${message}`)
}

for (const url of [
  'https://pm-ebus-sewa.mohua.gov.in/',
  'https://pm-ebus-sewa.mohua.gov.in/wp-content/uploads/2025/08/PM-eBus-Sewa-Guidelines-Part-I-1.pdf',
  'https://pm-ebus-sewa.mohua.gov.in/wp-content/uploads/2025/08/Addendum_PM-eBus-Sewa-Guidelines.pdf',
  'https://pm-ebus-sewa.mohua.gov.in/wp-content/uploads/2026/03/https-www.pib_.gov_.in-PressReleasePage.aspx-PRID2237554reg3lang2-1.pdf',
]) assert(migration.includes(url), `source registry is missing ${url}`)

for (const marker of [
  'mohua-pm-ebus-sewa-ppp-urban-transport-access',
  'current_eligible_city_or_tender_route_verified',
  'business_role_matches_live_tender',
  'target_ebuses":10000',
  'contract_duration_years":12',
  'behind_the_meter_assistance_percent":100',
  'not a direct universal grant',
  'historical progress indicators',
  'review_tasks',
  "'publish', 'open'",
]) assert(seed.includes(marker), `seed is missing ${marker}`)

assert(seed.includes('challenge method') && seed.includes('CESL'), 'institutional challenge and CESL tender route must remain explicit')
assert(seed.includes('contract_not_guaranteed') && seed.includes("'in_review'"), 'contract boundary and review gate must remain explicit')
assert(seed.includes('on conflict do nothing'), 'seed inserts must be idempotent')

console.log('catalog PM-eBus Sewa check passed: institutional city route, tender boundaries, PPP terms and review gate are present')
