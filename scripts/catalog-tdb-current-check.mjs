import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260907470000_catalog_tdb_current_evidence.sql'), 'utf8')
const reconciliation = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908590000_catalog_tdb_current_reconciliation.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_tdb_technology_funding.sql'), 'utf8')
const packet = fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-088.json'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-08-tdb-current-source-audit.md'), 'utf8')

for (const token of [
  'technology-development-board-technology-commercialisation-finance',
  'Technology Development Board Project Funding Guidelines',
  'Technology Development Board Act, 1995',
  'https://www.tdb.gov.in/modes-funding',
  'https://tdb.gov.in/faqs_new',
  'general_loan_share_up_to_percent',
  'equity_share_up_to_percent',
  'exceptional_cases_and_national_interest',
  'sole proprietorship concerns',
  'committee exception',
  'DPIIT-registered startup',
  'current_tdb_reconciliation',
  'tdb_core_funding',
  'current FAQ PDF',
  'rdi_slfm',
  'collateral',
  'royalty',
  'in_review',
]) {
  if (!seed.includes(token) && !migration.includes(token) && !reconciliation.includes(token) && !packet.includes(token) && !audit.includes(token)) throw new Error(`TDB evidence missing: ${token}`)
}

if (!seed.includes('"window_type":"rolling"')) throw new Error('TDB must preserve its rolling application boundary')
if (!seed.includes('eligibility_rule_sets') || !seed.includes('reviewed)')) throw new Error('TDB eligibility rules must remain unreviewed')
if (!migration.includes('on conflict (url) do update')) throw new Error('TDB source registry must be idempotent')
if (!reconciliation.includes('on conflict (url) do update')) throw new Error('TDB current source registry must be idempotent')
if (!packet.includes('"proposedDecision": "remain_in_review"') || !packet.includes('"humanReviewer": null')) throw new Error('TDB evidence packet must remain review-gated')
if (!audit.includes('Core Funding') || !audit.includes('RDIF/SLFM')) throw new Error('TDB current audit must preserve the Core Funding/RDIF boundary')

console.log('catalog TDB current check passed: Core Funding, startup exception, fee/repayment conflicts and RDIF boundary remain review-gated')
