import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_msme_technology_centres_current.sql'), 'utf8')
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908290000_catalog_msme_technology_centres_current_evidence.sql'), 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog MSME Technology Centres check failed: ${message}`)
}

for (const marker of [
  'msme-technology-centres-tool-rooms-extension-centres',
  'Tool Rooms & Technology Development Centres',
  'service_modes',
  'existing_technology_centres":18',
  'new_technology_centres_target":20',
  'new_extension_centres_target":100',
  'direct_cash_grant_not_assumed',
  'Most Technology Centre services are chargeable',
  'window_type":"rolling"',
]) assert(seed.includes(marker), `seed is missing ${marker}`)

for (const marker of [
  'Tool_Room_Tech_Institutions/Scheme_Guidelines.aspx',
  'CLCS_TUS_Scheme/TCSP/Scheme_Guidelines.aspx',
  'new-Technology-Centers/Scheme_Guidelines.aspx',
  'dashboard.msme.gov.in/100_TC_EC.aspx',
  'on conflict (url) do update',
]) assert(migration.includes(marker), `migration is missing ${marker}`)

assert(!seed.includes('"amount_max"'), 'Technology Centre service access must not invent a cash ceiling')
assert(seed.includes('institutional expansion targets are not applicant benefits') || seed.includes('institutional establishment and expansion targets do not create an automatic business grant'), 'institutional/applicant boundary is missing')

console.log('catalog MSME Technology Centres check passed: service access, institutional boundary, current network context and centre-specific review gate are present')
