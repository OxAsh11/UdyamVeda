import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_incorporation_food_safety.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260907090000_catalog_incorporation_food_sources.sql')
const seed = fs.readFileSync(seedPath, 'utf8')
const migration = fs.readFileSync(migrationPath, 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog incorporation/food check failed: ${message}`)
}

for (const slug of ['company-incorporation-spice-plus', 'fssai-food-business-registration-licensing']) {
  assert(seed.includes(`"slug":"${slug}"`), `missing ${slug}`)
}
for (const url of [
  'https://www.mca.gov.in/content/dam/mca/pdf/SPICEplus-and-linked-filings-FAQs-V3-20230122.pdf',
  'https://www.mca.gov.in/',
  'https://fssai.gov.in/',
  'https://fssai.gov.in/business',
  'https://fssai.gov.in/business/registration',
  'https://foscos.fssai.gov.in/',
]) {
  assert(seed.includes(url), `seed is missing official source ${url}`)
  assert(migration.includes(url), `source registry is missing official source ${url}`)
}
for (const marker of ["'in_review'", 'fine_print', 'source_anchor', 'opportunity_requirements', 'opportunity_steps', 'opportunity_windows', 'review_tasks']) {
  assert(seed.includes(marker), `seed is missing ${marker}`)
}

const payloadMatch = seed.match(/jsonb_array_elements\(\$records\$(\[[\s\S]*?\])\$records\$::jsonb\)/)
assert(payloadMatch, 'structured JSON payload was not found')
let records
try {
  records = JSON.parse(payloadMatch[1])
} catch (error) {
  throw new Error(`catalog incorporation/food check failed: invalid JSON payload: ${error.message}`)
}
assert(Array.isArray(records) && records.length === 2, `expected two structured records; found ${records?.length ?? 'non-array'}`)
for (const record of records) {
  assert(record.slug && record.source_url && record.rules && record.steps && record.window_evidence, `record ${record.slug ?? 'unknown'} is missing structured evidence`)
}

console.log('catalog incorporation/food check passed: SPICe+ and FSSAI records remain review-gated with official provenance')
