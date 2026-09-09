import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_meity_c2s.sql')
const packetPath = path.join(root, 'docs', 'catalog-review-evidence', 'central-review-031.json')
const auditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-08-c2s-source-audit.md')
const seed = fs.readFileSync(seedPath, 'utf8')
const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'))

function assert(condition, message) {
  if (!condition) throw new Error(`catalog C2S current check failed: ${message}`)
}

for (const marker of [
  '"slug":"chips-to-startup-c2s"',
  '"lifecycle_status":"paused"',
  '"current_call_required":true',
  '"generic_ceiling_not_established":true',
  'call_for_proposal_RSCs.jsp',
  'request_for_EDA_Tool.jsp',
  'proposal submission is closed',
]) assert(seed.includes(marker), `C2S dossier is missing ${marker}`)

assert(fs.existsSync(auditPath), 'C2S source audit is missing')
assert(packet.batchId === 'central-review-031', 'C2S review packet is missing')
const record = packet.records.find((item) => item.slug === 'chips-to-startup-c2s')
assert(record, 'C2S record is missing from the MeitY review packet')
assert(record.proposedDecision === 'remain_in_review', 'C2S record must remain review-gated')
assert(record.supportingSources.some((source) => source.url.includes('call_for_proposal.jsp')), 'closed BLDC call evidence is missing')
assert(record.supportingSources.some((source) => source.url.includes('call_for_proposal_RSCs.jsp')), 'RSC deadline evidence is missing')
assert(record.reviewFollowUps.some((item) => item.toLowerCase().includes('c2s call, route')), 'current-call follow-up is missing')

console.log('catalog C2S current check passed: MeitY programme, component boundaries, closed/deadline evidence and review gate remain explicit')
