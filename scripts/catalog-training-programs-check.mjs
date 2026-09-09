import fs from 'node:fs'
import path from 'node:path'

const file = path.join(process.cwd(), 'supabase', 'seed', 'verified_central_training_programs.sql')
const sql = fs.readFileSync(file, 'utf8').toLowerCase()

function assert(condition, message) {
  if (!condition) throw new Error(`catalog training check failed: ${message}`)
}

for (const slug of ['assistance-to-training-institutions-ati', 'entrepreneurship-and-skill-development-programme-esdp']) {
  assert(sql.includes(`"slug":"${slug}"`), `${slug} is missing`)
}
for (const marker of ['fine_print', 'source_anchor', 'opportunity_requirements', 'opportunity_steps', 'opportunity_windows', "'in_review'", "'publish', 'open'"]) {
  assert(sql.includes(marker), `${marker} is missing`)
}
for (const source of ['ati.msme.gov.in', 'approved_esdp_guidelines.pdf']) {
  assert(sql.includes(source), `official source marker ${source} is missing`)
}
assert(sql.includes('review_note'), 'records are not explicitly review-gated')

console.log('catalog training check passed: two review-gated institutional and founder training records')
