import fs from 'node:fs'
import path from 'node:path'

const file = path.join(process.cwd(), 'supabase', 'seed', 'verified_central_artisan_programs.sql')
const sql = fs.readFileSync(file, 'utf8').toLowerCase()

function assert(condition, message) {
  if (!condition) throw new Error(`catalog artisan programme check failed: ${message}`)
}

for (const marker of ['pm-vishwakarma', '18 trades', 'fine_print', 'source_anchor', 'opportunity_requirements', 'opportunity_steps', 'opportunity_windows', "'in_review'", "'publish', 'open'"]) {
  assert(sql.includes(marker), `${marker} is missing`)
}
assert(sql.includes('pmvishwakarma.gov.in/cdn/miscfiles'), 'official PM Vishwakarma guidelines are missing')
assert(sql.includes('pmvishwakarma.gov.in/home'), 'official PM Vishwakarma portal is missing')
assert(sql.includes('review_note'), 'PM Vishwakarma record is not explicitly review-gated')

console.log('catalog artisan programme check passed: PM Vishwakarma is structured and review-gated')
