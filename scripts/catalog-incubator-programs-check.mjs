import fs from 'node:fs'
import path from 'node:path'

const file = path.join(process.cwd(), 'supabase', 'seed', 'verified_central_incubator_programs.sql')
const sql = fs.readFileSync(file, 'utf8').toLowerCase()

function assert(condition, message) {
  if (!condition) throw new Error(`catalog incubator programme check failed: ${message}`)
}

for (const slug of ['dst-technology-business-incubator', 'birac-bionest-incubation-support', 'atal-incubation-centres', 'meity-tide-2-incubation-centres']) {
  assert(sql.includes(`"slug":"${slug}"`), `${slug} is missing`)
}
for (const marker of ['fine_print', 'source_anchor', 'opportunity_requirements', 'opportunity_steps', 'opportunity_windows', "'in_review'", "'publish', 'open'"]) {
  assert(sql.includes(marker), `${marker} is missing`)
}
assert(sql.includes('incubator-schemes.html'), 'official Startup India incubator source is missing')
assert(sql.includes('source_displayed_support_note'), 'displayed funding must remain explicitly unnormalised until direct review')

console.log('catalog incubator programme check passed: four review-gated records with separate eligibility and funding caveats')
