import fs from 'node:fs'
import path from 'node:path'

const file = path.join(process.cwd(), 'supabase', 'seed', 'verified_central_technology_coir_programs.sql')
const sql = fs.readFileSync(file, 'utf8').toLowerCase()

function assert(condition, message) {
  if (!condition) throw new Error(`catalog technology/coir check failed: ${message}`)
}

for (const slug of ['msme-tool-rooms-and-technology-centres', 'coir-vikas-yojana']) {
  assert(sql.includes(`"slug":"${slug}"`), `${slug} is missing`)
}
for (const marker of ['fine_print', 'source_anchor', 'opportunity_requirements', 'opportunity_steps', 'opportunity_windows', "'in_review'", "'publish', 'open'"]) {
  assert(sql.includes(marker), `${marker} is missing`)
}
for (const source of ['msmeschemebooklet2024.pdf', 'tool_rooms.aspx', 'coir-vikas-yojana', 'coirboard.gov.in']) {
  assert(sql.includes(source), `official source marker ${source} is missing`)
}
assert(sql.includes('review_note'), 'records are not explicitly review-gated')

console.log('catalog technology/coir check passed: two review-gated technical and sector-support records')
