import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_registration_journeys.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260907060000_catalog_registration_sources.sql')
const seed = fs.readFileSync(seedPath, 'utf8')
const migration = fs.readFileSync(migrationPath, 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog registrations check failed: ${message}`)
}

for (const slug of ['dpiit-startup-recognition', 'gst-registration']) {
  assert(seed.includes(`"slug":"${slug}"`), `missing ${slug}`)
}
for (const url of [
  'https://www.startupindia.gov.in/content/sih/en/startupgov/startup_recognition_page.html',
  'https://www.nsws.gov.in/',
  'https://www.gst.gov.in/',
  'https://tutorial.gst.gov.in/cbt/registration/gstregistration/course/story_content/external_files/GST_Registration_Document_Checklist.pdf',
]) {
  assert(seed.includes(url), `seed is missing official source ${url}`)
  assert(migration.includes(url), `source registry is missing official source ${url}`)
}
assert(seed.includes("'in_review'"), 'registration records are not review-gated')
assert(seed.includes('review_tasks'), 'registration records have no review tasks')
assert(seed.includes('source_anchor'), 'registration records have no source anchors')
assert(seed.includes('eligibility_rule_sets'), 'registration records have no structured rules')
assert(seed.includes('opportunity_requirements'), 'registration records have no requirements')
assert(seed.includes('opportunity_steps'), 'registration records have no application steps')
assert(seed.includes('"benefit_type":"compliance"'), 'GST registration is missing a compliance benefit classification')
assert(fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260907070000_catalog_compliance_benefit_type.sql'), 'utf8').includes("'compliance'"), 'compliance benefit type migration is missing')

console.log('catalog registrations check passed: DPIIT recognition and GST registration remain review-gated with official provenance')
