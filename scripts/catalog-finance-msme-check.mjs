import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const financeSeedPath = path.join(root, 'supabase', 'seed', 'verified_central_finance_batch_2.sql')
const pmfmeSeedPath = path.join(root, 'supabase', 'seed', 'verified_central_batch_3.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260907340000_catalog_standup_zed_pmfme_current_evidence.sql')
const zedMigrationPath = path.join(root, 'supabase', 'migrations', '20260908580000_catalog_zed_current_reconciliation.sql')
const zedPacketPath = path.join(root, 'docs', 'catalog-review-evidence', 'central-review-087.json')
const zedAuditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-08-zed-current-source-audit.md')
const auditPaths = [
  path.join(root, 'docs', 'catalog-audits', '2026-09-07-stand-up-india-source-audit.md'),
  path.join(root, 'docs', 'catalog-audits', '2026-09-07-zed-source-audit.md'),
  path.join(root, 'docs', 'catalog-audits', '2026-09-07-pmfme-source-audit.md'),
]
const financeSeed = fs.readFileSync(financeSeedPath, 'utf8')
const pmfmeSeed = fs.readFileSync(pmfmeSeedPath, 'utf8')
const migration = fs.readFileSync(migrationPath, 'utf8')
const zedMigration = fs.readFileSync(zedMigrationPath, 'utf8')
const zedPacket = fs.readFileSync(zedPacketPath, 'utf8')
const zedAudit = fs.readFileSync(zedAuditPath, 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog finance/MSME check failed: ${message}`)
}

for (const marker of [
  '"slug":"stand-up-india-scheme"',
  'current_stand_up_india_facts',
  'scheme_window',
  'successor_boundary',
  '"window_type":"closed"',
]) assert(financeSeed.includes(marker), `Stand Up India dossier is missing ${marker}`)

for (const marker of [
  '"slug":"msme-sustainable-zed-certification"',
  'current_zed_facts',
  'levels_and_cost',
  'support_boundary',
]) assert(financeSeed.includes(marker), `ZED dossier is missing ${marker}`)

for (const marker of [
  '"slug":"pm-formalisation-micro-food-processing-enterprises"',
  'current_pmfme_facts',
  'current_notices',
  'separate_components',
  'availability_boundary',
]) assert(pmfmeSeed.includes(marker), `PMFME dossier is missing ${marker}`)

for (const marker of [
  '2025-03-31 23:59:59+05:30',
  'standupmitra.in',
  'zed.msme.gov.in/contact-us',
  'PMFME_Guidelines_Modification.pdf',
  'current_source_reconciliation',
]) assert(migration.includes(marker), `current finance/MSME migration is missing ${marker}`)

for (const auditPath of auditPaths) assert(fs.existsSync(auditPath), `audit is missing: ${path.basename(auditPath)}`)
for (const marker of ['2026-09-08', 'current_zed_reconciliation', 'level_version_conflict', 'Operational_Guidelines_ZED.pdf']) {
  assert(zedMigration.includes(marker), `current ZED reconciliation is missing ${marker}`)
}
for (const marker of ['three certification levels', '80%/60%/50%', 'version conflict', 'QCI']) {
  assert(zedAudit.toLowerCase().includes(marker.toLowerCase()), `current ZED audit is missing ${marker}`)
}
for (const marker of ['remain_in_review', 'publicationReady', 'level-version conflict', 'human reviewer', 'UdyamVeda']) {
  assert(zedPacket.toLowerCase().includes(marker.toLowerCase()), `current ZED evidence packet is missing ${marker}`)
}

console.log('catalog finance/MSME check passed: Stand Up India closure, ZED support separation and PMFME amendment boundaries are review-gated')
