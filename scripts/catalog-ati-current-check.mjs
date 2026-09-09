import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_training_programs.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260908400000_catalog_ati_current_evidence.sql')
const auditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-08-ati-source-audit.md')
const packetPath = path.join(root, 'docs', 'catalog-review-evidence', 'central-review-070.json')
const seed = fs.readFileSync(seedPath, 'utf8')
const migration = fs.readFileSync(migrationPath, 'utf8')
const audit = fs.readFileSync(auditPath, 'utf8')
const packet = fs.readFileSync(packetPath, 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog ATI current check failed: ${message}`)
}

for (const marker of [
  '"slug":"assistance-to-training-institutions-ati"',
  'ati.msme.gov.in/ATI/home.aspx',
  'current ATI guidelines',
  'institutional application route',
  'window_type":"rolling"',
]) assert(seed.includes(marker), `seed is missing ${marker}`)

for (const marker of [
  'ATIguidelinesEnglish.pdf',
  'trainee_discovery_route',
  'approved_programme_route',
  'direct_individual_grant',
  'historical_terms_not_current_entitlement',
  '2025-04-25',
  '2026-09-08',
]) assert(migration.includes(marker), `migration is missing ${marker}`)

for (const marker of [
  'institution-led',
  '25 April 2025',
  'historical context only',
  'Programme reporting',
  'Status: `in_review`',
]) assert(audit.toLowerCase().includes(marker.toLowerCase()), `audit is missing ${marker}`)

for (const marker of [
  'institution-led',
  'direct personal grant',
  'remain_in_review',
  'publicationReady',
  'human reviewer',
]) assert(packet.toLowerCase().includes(marker.toLowerCase()), `packet is missing ${marker}`)

console.log('catalog ATI current check passed: 2025 institutional boundary, trainee discovery and review-gated terms are present')
