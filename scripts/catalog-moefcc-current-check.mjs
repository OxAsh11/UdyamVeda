import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packetPath = path.join(root, 'docs', 'catalog-review-evidence', 'central-review-032.json')
const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'))
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_environment_compliance_current.sql'), 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog MoEFCC current check failed: ${message}`)
}

assert(packet.batchId === 'central-review-032', 'batch 032 evidence packet is missing')
assert(packet.records.length === 1, 'batch 032 must cover one MoEFCC/PARIVESH record')
assert(packet.records[0].slug === 'moefcc-parivesh-environmental-clearance', 'PARIVESH record is missing')
assert(packet.records[0].proposedDecision === 'remain_in_review', 'PARIVESH record must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'PARIVESH record must not be publication-ready')
assert(packet.records[0].supportingSources.length >= 4, 'PARIVESH needs current portal, workflow and notification sources')
assert(packet.records[0].reviewFollowUps.length >= 7, 'PARIVESH needs explicit category, dependency and amendment follow-ups')

for (const url of [
  'https://moef.gov.in/index.php/environmental-impact-assessment-eia',
  'https://parivesh.nic.in/',
  'https://cpc.parivesh.nic.in/acts.aspx?id=EC',
]) assert(packet.records[0].sourceUrl === url || packet.records[0].supportingSources.some((source) => source.url === url), `missing official source ${url}`)

assert(seed.includes('moefcc-parivesh-environmental-clearance'), 'PARIVESH seed record is missing')
assert(seed.includes("'in_review'"), 'PARIVESH seed is not review-gated')
assert(seed.includes('project_requires_environmental_clearance'), 'project-specific eligibility rule is missing')
assert(seed.includes('approval_not_guaranteed'), 'approval-not-guaranteed boundary is missing')
assert(seed.includes('forest, wildlife, coastal, pollution-control and local permissions'), 'separate-permission boundary is missing')
assert(seed.includes('https://parivesh.nic.in/'), 'PARIVESH official portal provenance is missing')
assert(packet.records[0].observations.some((item) => item.includes('not required for every company')), 'universal-clearance boundary is missing')
assert(packet.records[0].observations.some((item) => item.includes('not itself a clearance') && item.includes('does not guarantee approval')), 'proposal/approval boundary is missing')
assert(packet.records[0].observations.some((item) => item.includes('90-day reference') && item.includes('not a guaranteed approval deadline')), 'timeline boundary is missing')

console.log('catalog MoEFCC current check passed: PARIVESH route, project/category boundary, separate clearances, timeline caution and review gates are present')
