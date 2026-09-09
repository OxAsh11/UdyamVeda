import fs from 'node:fs'
import path from 'node:path'

const seedPath = path.join(process.cwd(), 'supabase', 'seed', 'verified_central_wep_women_entrepreneurship.sql')
const seed = fs.readFileSync(seedPath, 'utf8').toLowerCase()
const root = process.cwd()
const reconciliation = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260909000000_catalog_wep_current_reconciliation.sql'), 'utf8').toLowerCase()
const packet = fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-089.json'), 'utf8').toLowerCase()
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-08-wep-current-source-audit.md'), 'utf8').toLowerCase()

function assert(condition, message) {
  if (!condition) throw new Error(`catalog WEP check failed: ${message}`)
}

for (const marker of [
  'women-entrepreneurship-platform-wep',
  'wep.gov.in/knowledge-portal',
  'niti.gov.in/sites/default/files/2025-06',
  'woman_entrepreneur',
  'women_led_collective',
  'smart matching',
  'no_direct_entitlement',
  'no_grant_entitlement',
  'no_loan_sanction_guarantee',
  'partner_due_diligence_required',
  'current_wep_reconciliation',
  'underlying_authority_controls',
  'current_mentorship_route',
  'ciiyi-disclaimer',
  'no sensitive personal information',
  'discovery/cross-check',
  'government_scheme_discovery',
  'mentorship',
  'market_linkages',
  '"window_type":"rolling"',
  'review_note',
  "'in_review'",
  "'publish', 'open'",
]) assert(seed.includes(marker) || reconciliation.includes(marker) || packet.includes(marker) || audit.includes(marker), `${marker} is missing from the WEP current evidence set`)

assert(seed.includes('"non_financial_support":true'), 'WEP must remain classified as non-financial support')
assert(seed.includes('"no_direct_entitlement":true'), 'WEP must not imply a direct government entitlement')
assert(packet.includes('"proposeddecision": "remain_in_review"') && packet.includes('"humanreviewer": null'), 'WEP evidence packet must remain review-gated')
assert(audit.includes('underlying authority') && audit.includes('discovery/cross-check'), 'WEP audit must preserve the underlying-authority boundary')

console.log('catalog WEP check passed: current ecosystem, mentorship, partner-content and underlying-authority boundaries remain review-gated')
