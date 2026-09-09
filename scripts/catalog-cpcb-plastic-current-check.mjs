import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-053.json'), 'utf8'))
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_environment_compliance_current.sql'), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(`catalog CPCB plastic EPR check failed: ${message}`) }

assert(packet.batchId === 'central-review-053', 'packet must target central-review-053')
assert(packet.records.length === 1 && packet.records[0].slug === 'cpcb-plastic-packaging-epr-registration', 'packet must cover only the plastic EPR registration record')
assert(packet.records[0].proposedDecision === 'remain_in_review', 'plastic EPR must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'packet cannot authorize publication')
assert(packet.records[0].sourceUrl === 'https://cpcb.nic.in/uploads/plasticwaste/SOP_PWM_24062024.pdf', 'packet must use the official CPCB plastic SOP')
for (const url of ['https://cpcb.nic.in/rules-7/', 'https://cpcb.nic.in/index.php', 'https://cpcbeprplastic.in/']) {
  assert(packet.records[0].supportingSources.some(source => source.url === url), `missing supporting source ${url}`)
}
for (const marker of ['Producer', 'Importer', 'Brand Owner', 'Plastic Waste Processor', 'micro and small producers', '2024-25', 'Category I', 'Category II', 'Category III', 'plastic raw material', 'obligations continue']) {
  assert(packet.records[0].observations.some(value => value.includes(marker)), `packet boundary is missing: ${marker}`)
}
for (const marker of ['cpcb-plastic-packaging-epr-registration', 'multiple_categories_separate_registration', 'epr_obligations_continue_after_registration', 'https://cpcbeprplastic.in/']) {
  assert(seed.includes(marker), `structured seed boundary is missing: ${marker}`)
}

console.log('catalog CPCB plastic EPR batch check passed: covered roles, micro/small boundary, target categories, continuing obligations and review gate remain explicit')
