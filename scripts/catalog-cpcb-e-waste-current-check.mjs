import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-052.json'), 'utf8'))
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_environment_compliance_current.sql'), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(`catalog CPCB e-waste check failed: ${message}`) }

assert(packet.batchId === 'central-review-052', 'packet must target central-review-052')
assert(packet.records.length === 1 && packet.records[0].slug === 'cpcb-e-waste-epr-producer-registration', 'packet must cover only the e-waste registration record')
assert(packet.records[0].proposedDecision === 'remain_in_review', 'e-waste must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'packet cannot authorize publication')
assert(packet.records[0].sourceUrl === 'https://cpcb.nic.in/uploads/Projects/E-Waste/FAQ_ewaste_23012024.pdf', 'packet must use the official CPCB FAQ')
for (const url of ['https://cpcb.nic.in/rules-7/', 'https://cpcb.nic.in/index.php', 'https://eprewastecpcb.in/']) {
  assert(packet.records[0].supportingSources.some(source => source.url === url), `missing supporting source ${url}`)
}
for (const marker of ['E-Waste (Management) Rules, 2022', '106 electrical', 'registered e-waste recyclers', '60%', '70%', '80%', 'micro enterprises', 'bulk consumer', 'RoHS']) {
  assert(packet.records[0].observations.some(value => value.includes(marker)), `packet boundary is missing: ${marker}`)
}
for (const marker of ['cpcb-e-waste-epr-producer-registration', 'bulk_consumer_producer_registration', 'registered_recycler_route_required', 'fy_2025_26_and_2026_27_target_percent":70']) {
  assert(seed.includes(marker), `structured seed boundary is missing: ${marker}`)
}

console.log('catalog CPCB e-waste batch check passed: roles, exclusions, registered-recycler route, target phases and review gate remain explicit')
