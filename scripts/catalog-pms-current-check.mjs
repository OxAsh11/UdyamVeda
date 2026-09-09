import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_batch_4.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260907370000_catalog_pms_iitf_2026_current_evidence.sql')
const reconciliationMigrationPath = path.join(root, 'supabase', 'migrations', '20260908570000_catalog_pms_iitf_2026_reconciliation.sql')
const packetPath = path.join(root, 'docs', 'catalog-review-evidence', 'central-review-086.json')
const auditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-08-pms-iitf-2026-current-source-audit.md')
const seed = fs.readFileSync(seedPath, 'utf8')
const migration = fs.readFileSync(migrationPath, 'utf8')
const reconciliationMigration = fs.readFileSync(reconciliationMigrationPath, 'utf8')
const packet = fs.readFileSync(packetPath, 'utf8')
const audit = fs.readFileSync(auditPath, 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog PMS current check failed: ${message}`)
}

for (const marker of [
  '"slug":"procurement-and-marketing-support-pms"',
  '"slug":"iitf-2026-pms-domestic-trade-fair"',
  '"application_deadline":"2026-09-20"',
  '"udyam_valid_as_of":"2026-08-31"',
  '"late_applications":"not_considered"',
  '"window_type":"fixed"',
  'pms.dcmsme.gov.in/view-all-event',
]) assert(seed.includes(marker), `PMS seed is missing ${marker}`)

for (const marker of [
  '2026-09-20',
  '2026-08-31',
  'pms.dcmsme.gov.in/view-all-event',
  'current_extension_note',
  'separate IITF 2026 opportunity record',
]) assert(migration.includes(marker), `PMS current migration is missing ${marker}`)

for (const marker of [
  "iitf-2026-pms-domestic-trade-fair",
  '2026-09-08',
  '2026-09-20',
  '2026-08-31',
  'organiser_route_separate',
  'stall_fee_at_application',
]) assert(reconciliationMigration.includes(marker), `PMS IITF reconciliation is missing ${marker}`)

for (const marker of ['application dates', 'Udyam validity', 'late-application rule', 'stall-fee', 'fixed-window']) {
  assert(audit.toLowerCase().includes(marker.toLowerCase()), `PMS IITF audit is missing ${marker}`)
}
for (const marker of ['remain_in_review', 'publicationReady', 'not considered', 'UdyamVeda', 'human reviewer']) {
  assert(packet.toLowerCase().includes(marker.toLowerCase()), `PMS IITF evidence packet is missing ${marker}`)
}

console.log('catalog PMS current check passed: generic scheme boundary, IITF 2026 deadline, Udyam cut-off and separate event record are review-gated')
