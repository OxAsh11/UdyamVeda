import fs from 'node:fs'
import path from 'node:path'

const file = path.join(process.cwd(), 'supabase', 'seed', 'verified_central_startup_programs.sql')
const sql = fs.readFileSync(file, 'utf8').toLowerCase()

function assert(condition, message) {
  if (!condition) throw new Error(`catalog Startup India programme check failed: ${message}`)
}

for (const slug of ['bharat-startup-grand-challenge', 'national-startup-awards']) {
  assert(sql.includes(`"slug":"${slug}"`), `${slug} is missing`)
}
for (const marker of ['fine_print', 'source_anchor', 'opportunity_requirements', 'opportunity_steps', 'opportunity_windows', "'in_review'", "'publish', 'open'"]) {
  assert(sql.includes(marker), `${marker} is missing`)
}
assert(sql.includes('application-listing.html'), 'official Startup India programme listing source is missing')
assert(sql.includes('bharat-startup-grand-challenge.html'), 'official challenge source is missing')
assert(sql.includes('nsa-landing.html'), 'official National Startup Awards source is missing')

console.log('catalog Startup India programme check passed: two review-gated records with source evidence and structured review data')
