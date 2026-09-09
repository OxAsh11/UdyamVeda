import fs from 'node:fs'
import path from 'node:path'

const file = path.join(process.cwd(), 'supabase', 'seed', 'verified_central_market_productivity_programs.sql')
const sql = fs.readFileSync(file, 'utf8').toLowerCase()

function assert(condition, message) {
  if (!condition) throw new Error(`catalog market/productivity check failed: ${message}`)
}

for (const slug of [
  'micro-and-small-enterprises-cluster-development-programme',
  'msme-competitive-lean-scheme',
  'nsic-consortia-and-tender-marketing-scheme',
]) {
  assert(sql.includes(`"slug":"${slug}"`), `${slug} is missing`)
}
for (const marker of ['fine_print', 'source_anchor', 'opportunity_requirements', 'opportunity_steps', 'opportunity_windows', "'in_review'", "'publish', 'open'"]) {
  assert(sql.includes(marker), `${marker} is missing`)
}
for (const source of ['modifiedguidelinesofmse.pdf', 'lean.msme.gov.in', 'msme.gov.in/offerings', 'nsic.co.in']) {
  assert(sql.includes(source), `official source marker ${source} is missing`)
}
assert(sql.includes('review_note'), 'records are not explicitly review-gated')

console.log('catalog market/productivity check passed: three review-gated records with collective, subsidy and procurement models')
