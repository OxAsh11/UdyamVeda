import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-055.json'), 'utf8'))
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_rural_entrepreneurship.sql'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-07-svep-source-audit.md'), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(`catalog SVEP check failed: ${message}`) }

assert(packet.batchId === 'central-review-055', 'packet must target central-review-055')
assert(packet.records.length === 1 && packet.records[0].slug === 'startup-village-entrepreneurship-programme', 'packet must cover only the SVEP record')
assert(packet.records[0].proposedDecision === 'remain_in_review', 'SVEP must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'packet cannot authorize publication')
assert(packet.records[0].sourceUrl === 'https://www.svep.nrlm.gov.in/landing', 'packet must use the official SVEP portal')
for (const url of ['https://svep.nrlm.gov.in/svepdemo/pdf/FAQ_SVEP.pdf', 'https://svep.nrlm.gov.in/contactUs', 'https://rural.gov.in/', 'https://svep.nrlm.gov.in/Privacy-Policy.html']) {
  assert(packet.records[0].supportingSources.some(source => source.url === url), `missing supporting source ${url}`)
}
for (const marker of ['DAY-NRLM', '19 January 2026', 'rural poor', 'State/block', 'universal applicant-level grant', 'community cadres', 'more-information-required']) {
  assert(packet.records[0].observations.some(value => value.includes(marker)), `packet boundary is missing: ${marker}`)
}
for (const marker of ['startup-village-entrepreneurship-programme', 'current_svep_facts', 'covered_block_required', 'direct_cash_benefit', 'direct_online_application', '"window_type":"rolling"']) {
  assert(seed.includes(marker), `structured seed boundary is missing: ${marker}`)
}
assert(audit.includes('universal direct grant') && audit.includes('State/block'), 'SVEP audit boundaries are missing')

console.log('catalog SVEP batch check passed: DAY-NRLM relationship, local block coverage, support model, non-universal entitlement and review gate remain explicit')
