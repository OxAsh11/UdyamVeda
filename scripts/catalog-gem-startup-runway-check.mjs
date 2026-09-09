import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_gem_startup_runway.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260908080000_catalog_gem_startup_runway_current_evidence.sql')
const auditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-08-gem-startup-runway-source-audit.md')
const packetPath = path.join(root, 'docs', 'catalog-review-evidence', 'central-review-065.json')
const seed = fs.readFileSync(seedPath, 'utf8')
const migration = fs.readFileSync(migrationPath, 'utf8')
const packet = fs.readFileSync(packetPath, 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog GeM Startup Runway check failed: ${message}`)
}

for (const marker of [
  '"slug":"gem-startup-runway-public-procurement"',
  'procurement_market_access',
  'benefit_is_market_access',
  'orders_guaranteed":false',
  'prior_turnover',
  'prior_experience',
  'earnest_money_deposit',
  'review_note',
  "'in_review'",
]) assert(seed.includes(marker), `${marker} is missing from the review-gated dossier`)

for (const marker of [
  'current_source_reconciliation',
  'current_policy_boundary',
  'eligibility_conflict_boundary',
  '2026 Startup Schemes Playbook',
  'Startup Runway 2.0',
  "where slug = 'gem-startup-runway-public-procurement'",
]) assert(migration.includes(marker), `${marker} is missing from the current-evidence migration`)

for (const marker of [
  'DPIIT-recognised',
  'broader-startup-listing',
  'market-access route',
  'publicationReady',
]) assert(packet.includes(marker), `${marker} is missing from the evidence packet`)

assert(fs.existsSync(auditPath), 'GeM Startup Runway source audit is missing')

console.log('catalog GeM Startup Runway check passed: market-access boundary, conditional procurement relaxations, eligibility conflict and review gate are present')
