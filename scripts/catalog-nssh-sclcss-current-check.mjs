import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_batch_5.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260907430000_catalog_nssh_sclcss_current_evidence.sql')
const reconciliationPath = path.join(root, 'supabase', 'migrations', '20260908490000_catalog_nssh_sclcss_current_reconciliation.sql')
const auditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-08-nssh-sclcss-source-audit.md')
const packetPath = path.join(root, 'docs', 'catalog-review-evidence', 'central-review-079.json')
const seed = fs.readFileSync(seedPath, 'utf8')
const migration = fs.readFileSync(migrationPath, 'utf8')
const reconciliation = fs.readFileSync(reconciliationPath, 'utf8')
const audit = fs.readFileSync(auditPath, 'utf8').toLowerCase()
const packet = fs.readFileSync(packetPath, 'utf8').toLowerCase()

function assert(condition, message) {
  if (!condition) throw new Error(`catalog NSSH/SCLCSS current check failed: ${message}`)
}

for (const marker of [
  'national-scheduled-caste-scheduled-tribe-hub',
  'special-credit-linked-capital-subsidy-scheme-sclcss',
  'sclcss.msme.gov.in/Manual/Guidelines.pdf',
  'dashboard.msme.gov.in/scsthub.aspx',
  'current_nssh_facts',
  'current_sclcss_facts',
  '"cited_cycle_end":"2026-03-31"',
  '"window_type":"closed"',
  '"subsidy_percent":25',
]) assert(seed.includes(marker), `seed is missing ${marker}`)

for (const marker of [
  'sclcss.msme.gov.in/Manual/Guidelines.pdf',
  'dashboard.msme.gov.in/scsthub.aspx',
  'current_nssh_facts',
  'current_sclcss_facts',
  '2026-03-31',
  "window_type = 'closed'",
  'component co-terminus',
]) assert(migration.includes(marker), `migration is missing ${marker}`)

for (const marker of [
  'current_portal_route',
  'current_checklist_route',
  'subsidy_percent',
  'subsidy_ceiling_inr',
  'institutional_finance_reference_ceiling_inr',
  'trading_activity_excluded',
  'red_category_excluded',
  'pli_route_required',
  'cited_nssh_cycle_end',
  'dashboard_activity_is_not_continuation',
  '2026-09-08',
]) assert(reconciliation.includes(marker), `reconciliation is missing ${marker}`)
for (const marker of ['status: `in_review`', '31 March 2026', 'not treated as a successor legal cycle', 'trading activity is excluded']) {
  assert(audit.includes(marker.toLowerCase()), `audit is missing ${marker}`)
}
for (const marker of ['current sclcss portal', 'january 2026 checklist', 'remain_in_review', 'publicationready']) {
  assert(packet.includes(marker), `review packet is missing ${marker}`)
}

console.log('catalog NSSH/SCLCSS current check passed: current portal/checklist evidence, 2025 guideline cycle, dashboard context, component boundaries and closed-window evidence are review-gated')
