import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-054.json'), 'utf8'))
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_finance_batch.sql'), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(`catalog CGTMSE check failed: ${message}`) }

assert(packet.batchId === 'central-review-054', 'packet must target central-review-054')
assert(packet.records.length === 1 && packet.records[0].slug === 'credit-guarantee-scheme-cgtmse', 'packet must cover only the CGTMSE record')
assert(packet.records[0].proposedDecision === 'remain_in_review', 'CGTMSE must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'packet cannot authorize publication')
assert(packet.records[0].sourceUrl === 'https://www.cgtmse.in/Home/VS/3', 'packet must use the official CGTMSE overview')
for (const url of ['https://www.cgtmse.in/Default/ViewFile/?id=1743176302611_CGTMSE+-+Scheme+Document+CGS+I_updated+as+on+Apr+1+2025.pdf&path=Page', 'https://www.cgtmse.in/Home/VS/96', 'https://www.cgtmse.in/Home/VS/98', 'https://www.cgtmse.in/Circulars']) {
  assert(packet.records[0].supportingSources.some(source => source.url === url), `missing supporting source ${url}`)
}
for (const marker of ['not a direct borrower loan', 'April 1, 2025', '₹10 crore', '90% for women', 'Annual Guarantee Fee', 'hybrid', 'Member Lending Institution', 'Micro Credit Card']) {
  assert(packet.records[0].observations.some(value => value.includes(marker)), `packet boundary is missing: ${marker}`)
}
for (const marker of ['credit-guarantee-scheme-cgtmse', 'current_cgtmse_facts', 'coverage_ceiling', 'cover_basis', 'hybrid_security', 'not_a_direct_loan', 'not_a_subsidy']) {
  assert(seed.includes(marker), `structured seed boundary is missing: ${marker}`)
}

console.log('catalog CGTMSE batch check passed: lender route, guarantee-vs-loan separation, current coverage, fee, hybrid-security and amendment boundaries remain review-gated')
