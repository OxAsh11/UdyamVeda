import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const cgtmseSeedPath = path.join(root, 'supabase', 'seed', 'verified_central_finance_batch.sql')
const pmmySeedPath = path.join(root, 'supabase', 'seed', 'verified_central_finance_batch_2.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260907330000_catalog_credit_current_evidence.sql')
const cgtmseAuditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-07-cgtmse-source-audit.md')
const pmmyAuditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-07-pmmy-source-audit.md')
const cgtmseSeed = fs.readFileSync(cgtmseSeedPath, 'utf8')
const pmmySeed = fs.readFileSync(pmmySeedPath, 'utf8')
const migration = fs.readFileSync(migrationPath, 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog credit check failed: ${message}`)
}

for (const marker of ['"slug":"credit-guarantee-scheme-cgtmse"', 'current_cgtmse_facts', 'coverage_ceiling', 'cover_basis', 'hybrid_security', 'not_a_direct_loan', 'not_a_subsidy']) {
  assert(cgtmseSeed.includes(marker), `CGTMSE dossier is missing ${marker}`)
}
for (const marker of ['"slug":"pradhan-mantri-mudra-yojana"', 'current_pmmy_facts', 'last_official_page_update', 'tarun_plus_boundary', 'direct_cash_benefit']) {
  assert(pmmySeed.includes(marker), `PMMY dossier is missing ${marker}`)
}
for (const marker of ['Home/VS/96', 'Home/VS/98', 'Home/VS/99', 'Circulars', 'current_source_reconciliation']) {
  assert(migration.includes(marker), `current credit migration is missing ${marker}`)
}
assert(fs.existsSync(cgtmseAuditPath), 'CGTMSE source audit is missing')
assert(fs.existsSync(pmmyAuditPath), 'PMMY source audit is missing')

console.log('catalog credit check passed: CGTMSE and PMMY current lender boundaries, benefit separation and review gates are present')
