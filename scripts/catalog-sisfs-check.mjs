import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_opportunities.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260907350000_catalog_sisfs_current_evidence.sql')
const auditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-07-sisfs-source-audit.md')
const seed = fs.readFileSync(seedPath, 'utf8')
const migration = fs.readFileSync(migrationPath, 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog SISFS check failed: ${message}`)
}

for (const marker of [
  '"slug":"startup-india-seed-fund-scheme"',
  '"startup_application_deadline":"2026-05-31"',
  '"incubator_selection_deadline":"2026-06-30"',
  '"disbursals_ongoing_note":true',
  '"window_type":"closed"',
  'Ongoing disbursals do not reopen the application window',
  'Startup-Schemes-Playbook-June-2026.pdf',
]) assert(seed.includes(marker), `seed dossier is missing ${marker}`)

for (const marker of [
  '2026-05-31 23:59:59+05:30',
  '2026-06-30',
  'seedfund.startupindia.gov.in/contact',
  'Startup-Schemes-Playbook-June-2026.pdf',
  'window_type = \'closed\'',
]) assert(migration.includes(marker), `current SISFS migration is missing ${marker}`)

assert(fs.existsSync(auditPath), 'SISFS source audit is missing')
console.log('catalog SISFS check passed: current startup deadline, incubator deadline, disbursal boundary and closed-window status are review-gated')
