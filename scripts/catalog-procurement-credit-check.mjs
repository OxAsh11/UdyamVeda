import fs from 'node:fs'
import path from 'node:path'

const file = path.join(process.cwd(), 'supabase', 'seed', 'verified_central_procurement_credit_access.sql')
const sql = fs.readFileSync(file, 'utf8').toLowerCase()

function assert(condition, message) {
  if (!condition) throw new Error(`catalog procurement/credit check failed: ${message}`)
}

for (const slug of ['public-procurement-policy-for-micro-and-small-enterprises', 'performance-and-credit-rating-scheme-for-micro-and-small-enterprises']) {
  assert(sql.includes(`"slug":"${slug}"`), `${slug} is missing`)
}
for (const marker of ['fine_print', 'source_anchor', 'opportunity_requirements', 'opportunity_steps', 'opportunity_windows', "'in_review'", "'publish', 'open'"]) {
  assert(sql.includes(marker), `${marker} is missing`)
}
for (const source of ['msmeannualreport2025-26english_0.pdf', 'ppp_home.aspx', 'pcrschemeguidelines.pdf', '1_2_0.html']) {
  assert(sql.includes(source), `official source marker ${source} is missing`)
}
assert(sql.includes('review_note'), 'records are not explicitly review-gated')

console.log('catalog procurement/credit check passed: two review-gated public-market and credit-readiness records')
