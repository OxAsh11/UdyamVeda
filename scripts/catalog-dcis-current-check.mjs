import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_dcis_innovation.sql')
const packetPath = path.join(root, 'docs', 'catalog-review-evidence', 'central-review-023.json')
const auditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-08-dcis-source-audit.md')
const seed = fs.readFileSync(seedPath, 'utf8')
const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'))

function assert(condition, message) {
  if (!condition) throw new Error(`catalog DCIS current check failed: ${message}`)
}

for (const marker of [
  '"slug":"digital-communication-innovation-square-dcis"',
  '"lifecycle_status":"closed"',
  'grant_ceiling_as_stated_by_faq',
  'Technical Expert Committee',
  '86ad6f0555dd4aa05a455d61b2294a3a.pdf',
  'ab1626d64d8125b7ef400cf641abfc65.pdf',
  '"window_type":"closed"',
]) assert(seed.includes(marker), `DCIS dossier is missing ${marker}`)

assert(fs.existsSync(auditPath), 'DCIS source audit is missing')
assert(packet.batchId === 'central-review-023', 'DoT review packet is missing')
const record = packet.records.find((item) => item.slug === 'digital-communication-innovation-square-dcis')
assert(record, 'DCIS record is missing from the DoT review packet')
assert(record.proposedDecision === 'remain_in_review', 'DCIS record must remain review-gated')
assert(record.supportingSources.some((source) => source.url.includes('86ad6f0555dd4aa05a455d61b2294a3a.pdf')), 'DCIS eligibility flyer is missing from review evidence')
assert(record.supportingSources.some((source) => source.url.includes('ab1626d64d8125b7ef400cf641abfc65.pdf')), 'DCIS grant SOP is missing from review evidence')
assert(record.reviewFollowUps.some((item) => item.toLowerCase().includes('current dcis guidelines 2.0')), 'DCIS current-guideline follow-up is missing')

console.log('catalog DCIS current check passed: existing record is linked to the Playbook lead, current DoT evidence is registered, historical window is explicit and publication remains review-gated')
