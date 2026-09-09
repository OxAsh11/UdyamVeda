import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_iec_tax_identity.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260907100000_catalog_iec_tax_identity_sources.sql')
const currentMigrationPath = path.join(root, 'supabase', 'migrations', '20260907300000_catalog_iec_tax_current_evidence.sql')
const iecAuditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-07-iec-source-audit.md')
const taxAuditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-07-pan-tan-source-audit.md')
const seed = fs.readFileSync(seedPath, 'utf8')
const migration = fs.readFileSync(migrationPath, 'utf8')
const currentMigration = fs.readFileSync(currentMigrationPath, 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog IEC/tax identity check failed: ${message}`)
}

for (const slug of ['importer-exporter-code-iec', 'pan-tan-allocation-readiness']) {
  assert(seed.includes(`"slug":"${slug}"`), `missing ${slug}`)
}
for (const url of [
  'https://www.dgft.gov.in/',
  'https://www.dgft.gov.in/CP/',
  'https://www.incometax.gov.in/iec/foportal/',
  'https://www.mca.gov.in/content/dam/mca/pdf/SPICEplus-and-linked-filings-FAQs-V3-20230122.pdf',
]) {
  assert(seed.includes(url), `seed is missing official source ${url}`)
  assert(migration.includes(url), `source registry is missing official source ${url}`)
}
for (const marker of ["'in_review'", 'fine_print', 'source_anchor', 'opportunity_requirements', 'opportunity_steps', 'opportunity_windows', 'review_tasks', 'current_dgft_facts', 'annual_update_window', 'current_tax_facts', 'existing_numbers', 'fresh_applications']) {
  assert(seed.includes(marker), `seed is missing ${marker}`)
}
for (const marker of ['HBP2023_Chapter02.pdf', 'Appendix-2k.pdf', 'income-tax-forms', 'current_source_reconciliation']) {
  assert(currentMigration.includes(marker), `current evidence migration is missing ${marker}`)
}
assert(fs.existsSync(iecAuditPath), 'IEC source audit is missing')
assert(fs.existsSync(taxAuditPath), 'PAN/TAN source audit is missing')
const payloadMatch = seed.match(/jsonb_array_elements\(\$records\$(\[[\s\S]*?\])\$records\$::jsonb\)/)
assert(payloadMatch, 'structured JSON payload was not found')
const records = JSON.parse(payloadMatch[1])
assert(Array.isArray(records) && records.length === 2, `expected two structured records; found ${records?.length ?? 'non-array'}`)

console.log('catalog IEC/tax identity check passed: IEC and PAN/TAN readiness remain review-gated with official provenance')
