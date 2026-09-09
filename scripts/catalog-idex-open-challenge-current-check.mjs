import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-057.json'), 'utf8'))
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_defence_innovation.sql'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-07-idex-open-challenge-source-audit.md'), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(`catalog iDEX Open Challenge check failed: ${message}`) }

assert(packet.batchId === 'central-review-057', 'packet must target central-review-057')
assert(packet.records.length === 1 && packet.records[0].slug === 'idex-open-challenge-2026', 'packet must cover only the Open Challenge record')
assert(packet.records[0].proposedDecision === 'remain_in_review', 'Open Challenge must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'packet cannot authorize publication')
assert(packet.records[0].sourceUrl === 'https://idex.gov.in/open-challenge/', 'packet must retain the batch primary source')
for (const url of ['https://idex.gov.in/disc-category/18', 'https://www.idex.gov.in/challenges', 'https://idex.gov.in/faq', 'https://idex.gov.in/financial-faq', 'https://idex.gov.in/how_to_apply', 'https://idex.gov.in/register']) {
  assert(packet.records[0].supportingSources.some(source => source.url === url), `missing supporting source ${url}`)
}
for (const marker of ['30 September 2026', '₹1.5 crore', 'No Challenge Found', 'throughout the year', 'Matching contribution', '10%, 20%, 20%, 20%, 20% and 10%', 'procurement', 'sparse page content']) {
  assert(packet.records[0].observations.some(value => value.includes(marker)), `packet boundary is missing: ${marker}`)
}
for (const marker of ['idex-open-challenge-2026', 'open_challenge_deadline', 'open_challenge_grant_ceiling_inr', 'milestone_based', 'equity_taken_by_dio', 'challenge_fit_required']) {
  assert(seed.includes(marker), `structured seed boundary is missing: ${marker}`)
}
assert(audit.includes('30 September 2026') && audit.includes('separate Open Challenge benefit bucket'), 'Open Challenge audit boundaries are missing')

console.log('catalog iDEX Open Challenge batch check passed: window conflict, grant ceiling, applicant route, matching contribution, milestones and procurement separation remain review-gated')
