import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-051.json'), 'utf8'))
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_bis_product_compliance_current.sql'), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(`catalog BIS hallmarking batch check failed: ${message}`) }

assert(packet.batchId === 'central-review-051', 'packet must target central-review-051')
assert(packet.records.length === 1 && packet.records[0].slug === 'bis-hallmarking-jeweller-registration', 'packet must cover only the jeweller-registration record')
assert(packet.records[0].proposedDecision === 'remain_in_review', 'hallmarking must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'packet cannot authorize publication')
assert(packet.records[0].sourceUrl === 'https://www.bis.gov.in/hallmarking-jewellers/?lang=en', 'packet must use the official jeweller page')
for (const url of ['https://www.bis.gov.in/hallmarking-overview/?lang=en', 'https://www.bis.gov.in/apply-for-jewellers-registration/?lang=en', 'https://www.bis.gov.in/wp-content/uploads/2024/01/Revised-Guidelines-for-JEWELLERS-Jan-24.pdf', 'https://www.nsws.gov.in/']) {
  assert(packet.records[0].supportingSources.some(source => source.url === url), `missing supporting source ${url}`)
}
for (const marker of ['INR 40 lakh', 'instantly', 'valid for life', '30 days', 'job workers', 'first-point-of-sale']) {
  assert(packet.records[0].observations.some(value => value.includes(marker)), `packet boundary is missing: ${marker}`)
}
for (const marker of ['bis-hallmarking-jeweller-registration', 'current_turnover_exemption_reference_inr":4000000', 'registration_fee":0', 'registration_validity":"lifetime"']) {
  assert(seed.includes(marker), `structured seed boundary is missing: ${marker}`)
}

console.log('catalog BIS hallmarking batch check passed: gold/silver scope, seller roles, turnover/job-work boundaries, lifetime registration and operating duties remain review-gated')
