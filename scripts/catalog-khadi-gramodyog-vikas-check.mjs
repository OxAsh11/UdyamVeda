import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908270000_catalog_khadi_gramodyog_vikas_current.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_khadi_gramodyog_vikas_current.sql'), 'utf8')

const assert = (condition, message) => {
  if (!condition) throw new Error(`catalog KGVY check failed: ${message}`)
}

for (const url of [
  'https://kviconline.gov.in/pmegpeportalappdoc/DigitalKVICupload/43320231218130809.pdf',
  'https://msme.gov.in/sites/default/files/RevisedOperationalKVYguidelines.pdf',
  'https://kviconline.gov.in/mdaclaims/commPgs/41320221201121713.pdf',
  'https://kviconline.gov.in/pmegpeportalappdoc/DigitalKVICupload/42620240304174114.pdf',
  'https://kviconline.gov.in/khadi.jsp',
]) assert(migration.includes(url), `source registry is missing ${url}`)

for (const marker of [
  'khadi-gramodyog-vikas-yojana',
  'umbrella_components',
  'khadi_vikas_yojana',
  'gramodyog_vikas_yojana',
  'khadi_grant',
  'component_route_required',
  'current_component_call_verified',
  'Khadi Grant is an establishment-expense provision for KVIC officers and staff',
  'not a direct enterprise benefit',
  'review_tasks',
  "'in_review'",
]) assert(seed.includes(marker), `seed is missing ${marker}`)

assert(seed.includes('on conflict do nothing'), 'seed must remain idempotent')
assert(seed.includes('must not inherit one another'), 'component eligibility separation must remain explicit')

console.log('catalog KGVY check passed: umbrella components, component-specific eligibility, Khadi Grant boundary and review gate are present')
