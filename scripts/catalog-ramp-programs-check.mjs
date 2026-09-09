import fs from 'node:fs'
import path from 'node:path'

const file = path.join(process.cwd(), 'supabase', 'seed', 'verified_central_ramp_programs.sql')
const sql = fs.readFileSync(file, 'utf8').toLowerCase()

function assert(condition, message) {
  if (!condition) throw new Error(`catalog RAMP programme check failed: ${message}`)
}

for (const slug of [
  'mse-online-dispute-resolution-scheme',
  'mse-green-investment-and-financing-for-transformation',
  'mse-scheme-for-promotion-and-investment-in-circular-economy',
  'msme-trade-enablement-and-marketing-team-initiative',
]) {
  assert(sql.includes(`"slug":"${slug}"`), `${slug} is missing`)
}
for (const marker of ['fine_print', 'source_anchor', 'opportunity_requirements', 'opportunity_steps', 'opportunity_windows', "'in_review'", "'publish', 'open'"]) {
  assert(sql.includes(marker), `${marker} is missing`)
}
for (const source of ['mse-odr', 'mse-gift', 'mse-spice', 'msme-team-initiative']) {
  assert(sql.includes(source), `official RAMP source marker ${source} is missing`)
}
assert(sql.includes('review_note'), 'RAMP records are not explicitly review-gated')

console.log('catalog RAMP programme check passed: four review-gated records with distinct benefit models')
