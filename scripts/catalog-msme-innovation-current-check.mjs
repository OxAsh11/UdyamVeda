import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_batch_5.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260907440000_catalog_msme_innovation_sfurti_aspire_current_evidence.sql')
const innovativeMigrationPath = path.join(root, 'supabase', 'migrations', '20260908560000_catalog_msme_innovative_current_reconciliation.sql')
const aspireMigrationPath = path.join(root, 'supabase', 'migrations', '20260908390000_catalog_aspire_current_evidence.sql')
const sfurtiMigrationPath = path.join(root, 'supabase', 'migrations', '20260908430000_catalog_sfurti_current_reconciliation.sql')
const auditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-07-msme-innovation-sfurti-aspire-source-audit.md')
const innovativeAuditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-08-msme-innovative-current-source-audit.md')
const packetPath = path.join(root, 'docs', 'catalog-review-evidence', 'central-review-069.json')
const innovativePacketPath = path.join(root, 'docs', 'catalog-review-evidence', 'central-review-085.json')
const seed = fs.readFileSync(seedPath, 'utf8')
const migration = fs.readFileSync(migrationPath, 'utf8')
const innovativeMigration = fs.readFileSync(innovativeMigrationPath, 'utf8')
const aspireMigration = fs.readFileSync(aspireMigrationPath, 'utf8')
const sfurtiMigration = fs.readFileSync(sfurtiMigrationPath, 'utf8')
const audit = fs.readFileSync(auditPath, 'utf8')
const innovativeAudit = fs.readFileSync(innovativeAuditPath, 'utf8')
const packet = fs.readFileSync(packetPath, 'utf8')
const innovativePacket = fs.readFileSync(innovativePacketPath, 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog MSME innovation/SFURTI/ASPIRE current check failed: ${message}`)
}

for (const marker of [
  'msme-innovative-incubation-design-ipr',
  'scheme-for-fund-for-regeneration-of-traditional-industries-sfurti',
  'aspire-innovation-rural-industry-entrepreneurship',
  'Idea Hackathon 6.0',
  'current_innovative_facts',
  'current_sfurti_facts',
  'current_aspire_facts',
  'innovative.msme.gov.in/Home/Index',
  'sfurti.msme.gov.in/SFURTI/Home.aspx',
  'aspire.msme.gov.in/ASPIRE/Registration.aspx',
  '"window_type":"rolling"',
]) assert(seed.includes(marker), `seed is missing ${marker}`)

for (const marker of [
  'Idea Hackathon 6.0',
  'current_innovative_facts',
  'current_sfurti_facts',
  'current_aspire_facts',
  'innovative.msme.gov.in/Home/IprIndex',
  'sfurti.msme.gov.in/SFURTI/Home.aspx',
  'aspire.msme.gov.in/ASPIRE/Registration.aspx',
  "window_type = 'rolling'",
]) assert(migration.includes(marker), `migration is missing ${marker}`)

for (const marker of ['RegistrationUserManualAspire.pdf', 'ASPIRE_New_21112023.pdf', 'direct_individual_grant', 'guideline_cycle_end', '2026-09-08']) {
  assert(aspireMigration.includes(marker), `ASPIRE current reconciliation is missing ${marker}`)
}
for (const marker of [
  'dashboard_scopes_not_combinable',
  'cluster_minimum_artisans_general',
  'cluster_minimum_artisans_ner_hilly',
  'hard_intervention_scheme_share_percent_general',
  'hard_intervention_ia_cash_contribution_percent_general',
  'land_cost_excluded',
  'MinistryDashboard.aspx',
  'AllPendingProposals.aspx',
  '2026-09-08',
]) assert(sfurtiMigration.includes(marker), `SFURTI current reconciliation is missing ${marker}`)
for (const marker of ['MSME Innovative official About page', 'current incubation route', '2026-09-08', 'current_innovative_reconciliation']) {
  assert(innovativeMigration.includes(marker), `MSME Innovative current reconciliation is missing ${marker}`)
}
for (const marker of ['Current portal', 'Design page', 'IPR page', 'MyMSME incubation route', 'component-specific', '8 September 2026']) {
  assert(innovativeAudit.toLowerCase().includes(marker.toLowerCase()), `MSME Innovative audit is missing ${marker}`)
}
for (const marker of ['component-specific', 'remain_in_review', 'publicationReady', 'human reviewer', 'UdyamVeda']) {
  assert(innovativePacket.toLowerCase().includes(marker.toLowerCase()), `MSME Innovative evidence packet is missing ${marker}`)
}
for (const marker of ['Current SFURTI update', 'source-specific dashboard scopes', '100-artisan general', '90:10', 'cluster/institution-led']) {
  assert(audit.toLowerCase().includes(marker.toLowerCase()), `SFURTI audit is missing ${marker}`)
}
for (const marker of ['institution-led', '2025-26 guideline boundary', 'Dashboard metrics are programme reporting', 'Status: `in_review`']) {
  assert(audit.includes(marker), `ASPIRE source audit is missing ${marker}`)
}
for (const marker of ['institution-led', 'direct personal grant', 'remain_in_review', 'publicationReady', 'human reviewer']) {
  assert(packet.toLowerCase().includes(marker.toLowerCase()), `ASPIRE evidence packet is missing ${marker}`)
}

console.log('catalog MSME innovation/SFURTI/ASPIRE current check passed: current portal notices, component boundaries and review-gated routes are present')
