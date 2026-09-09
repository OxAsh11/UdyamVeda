import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_social_security_compliance.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260907110000_catalog_social_security_sources.sql')
const currentMigrationPath = path.join(root, 'supabase', 'migrations', '20260907310000_catalog_social_security_current_evidence.sql')
const auditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-07-social-security-source-audit.md')
const seed = fs.readFileSync(seedPath, 'utf8')
const migration = fs.readFileSync(migrationPath, 'utf8')
const currentMigration = fs.readFileSync(currentMigrationPath, 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog social-security check failed: ${message}`)
}

for (const slug of ['epfo-establishment-registration', 'esic-employer-registration']) {
  assert(seed.includes(`"slug":"${slug}"`), `missing ${slug}`)
}
for (const url of [
  'https://www.epfindia.gov.in/site_en/EODB.php',
  'https://unifiedportal-emp.epfindia.gov.in/epfo/',
  'https://www.epfindia.gov.in/site_docs/PDFs/OLRE_PDFs/OLRE_withDSC_RevisedJune2016.pdf',
  'https://portal.esic.gov.in/ESICInsurance1/ESICInsurancePortal/Employer_Employee_registration_through_portal.pdf',
  'https://esic.gov.in/attachments/circularfile/Guidelines_for_USSP_Unified_Shram_Suvidha_Portal_Registration_for_ESIC_User_Manual_V1_0_1752730200.pdf',
  'https://esic.gov.in/Publications/ESIAct1948Amendedupto010610.htm',
]) {
  assert(seed.includes(url), `seed is missing official source ${url}`)
  assert(migration.includes(url), `source registry is missing official source ${url}`)
}
for (const marker of ["'in_review'", 'fine_print', 'source_anchor', 'source_section', 'opportunity_requirements', 'opportunity_steps', 'opportunity_windows', 'review_tasks', 'current_epfo_facts', 'current_esic_facts', 'wage_ceiling_inr_per_month', 'coverage_threshold_caution']) {
  assert(seed.includes(marker), `seed is missing ${marker}`)
}
for (const marker of ['site_en/FAQ.php', 'publicationfile/4bba80675aa61f0e8c9f7f57c155b185.pdf', 'current_source_reconciliation']) {
  assert(currentMigration.includes(marker), `current evidence migration is missing ${marker}`)
}
assert(fs.existsSync(auditPath), 'social-security source audit is missing')
const payloadMatch = seed.match(/jsonb_array_elements\(\$records\$(\[[\s\S]*?\])\$records\$::jsonb\)/)
assert(payloadMatch, 'structured JSON payload was not found')
const records = JSON.parse(payloadMatch[1])
assert(Array.isArray(records) && records.length === 2, `expected two structured records; found ${records?.length ?? 'non-array'}`)
for (const record of records) {
  assert(record.benefit_type === 'compliance', `${record.slug} must use compliance benefit type`)
  assert(record.eligibility?.unknown_handling === 'needs_information', `${record.slug} must fail open to more information`)
  assert(record.fine_print?.review_note, `${record.slug} needs a reviewer note`)
}

console.log('catalog social-security check passed: EPFO and ESIC records remain review-gated with official provenance')
