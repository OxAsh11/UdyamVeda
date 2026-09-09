import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-056.json'), 'utf8'))
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_defence_production_tdf_aditi_current.sql'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-07-defence-production-tdf-aditi-source-audit.md'), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(`catalog ADITI check failed: ${message}`) }

assert(packet.batchId === 'central-review-056', 'packet must target central-review-056')
assert(packet.records.length === 1 && packet.records[0].slug === 'idex-aditi-critical-technologies', 'packet must cover only the ADITI record')
assert(packet.records[0].proposedDecision === 'remain_in_review', 'ADITI must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'packet cannot authorize publication')
assert(packet.records[0].sourceUrl === 'https://idex.gov.in/disc-category/26', 'packet must retain the batch primary source')
for (const url of ['https://www.idex.gov.in/disc-category/44', 'https://idex.gov.in/disc-category/34', 'https://idex.gov.in/disc-category/35', 'https://idex.gov.in/faq', 'https://www.idex.gov.in/financial-faq', 'https://www.idex.gov.in/uploads/page/aditi_scheeme.pdf']) {
  assert(packet.records[0].supportingSources.some(source => source.url === url), `missing supporting source ${url}`)
}
for (const marker of ['ADITI 1', 'ADITI 4', '21 April 2026', '4 May 2026', '₹25 crore', '50% of the Product Development Budget', 'matching contribution', 'procurement', 'multiple historical/reopened editions']) {
  assert(packet.records[0].observations.some(value => value.includes(marker)), `packet boundary is missing: ${marker}`)
}
for (const marker of ['idex-aditi-critical-technologies', 'maximum_grant_inr":250000000', 'applicant_matching_contribution', 'current_call_must_be_verified', 'product_development_budget_approval_required']) {
  assert(seed.includes(marker), `structured seed boundary is missing: ${marker}`)
}
assert(audit.includes('ADITI and TDF are distinct') && audit.includes('historical ADITI 1'), 'ADITI audit boundaries are missing')

console.log('catalog ADITI batch check passed: edition conflict, critical-technology scope, grant ceiling, matching contribution, milestones and procurement separation remain review-gated')
