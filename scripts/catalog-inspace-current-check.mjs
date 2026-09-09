import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_inspace_seed_fund.sql')
const packetPath = path.join(root, 'docs', 'catalog-review-evidence', 'central-review-067.json')
const auditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-08-inspace-seed-fund-source-audit.md')
const seed = fs.readFileSync(seedPath, 'utf8')
const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'))

function assert(condition, message) {
  if (!condition) throw new Error(`catalog IN-SPACe current check failed: ${message}`)
}

for (const marker of [
  '"slug":"in-space-seed-fund"',
  '"lifecycle_status":"paused"',
  '"indian_shareholding_min_percent":80',
  '"maximum_grant_inr":10000000',
  '"window_type":"call_for_applications"',
  'results_seedfund_2026',
  '7adb190c4703aa10d4bc5b31516d43fc',
]) assert(seed.includes(marker), `IN-SPACe dossier is missing ${marker}`)

assert(fs.existsSync(auditPath), 'IN-SPACe source audit is missing')
assert(packet.batchId === 'central-review-067', 'IN-SPACe review packet is missing')
const record = packet.records.find((item) => item.slug === 'in-space-seed-fund')
assert(record, 'IN-SPACe record is missing from the review packet')
assert(record.proposedDecision === 'remain_in_review', 'IN-SPACe record must remain review-gated')
assert(record.supportingSources.some((source) => source.url.includes('results_seedfund_2026')), 'current results route is missing from review evidence')
assert(record.reviewFollowUps.some((item) => item.toLowerCase().includes('accepting new applications')), 'current-window follow-up is missing')

console.log('catalog IN-SPACe current check passed: official scheme evidence is registered, current-window uncertainty is explicit and publication remains paused/review-gated')
