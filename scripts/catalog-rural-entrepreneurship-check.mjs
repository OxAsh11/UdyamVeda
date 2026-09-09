import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_rural_entrepreneurship.sql')
const auditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-07-svep-source-audit.md')
const seed = fs.readFileSync(seedPath, 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog rural entrepreneurship check failed: ${message}`)
}

for (const marker of [
  '"slug":"startup-village-entrepreneurship-programme"',
  'current_svep_facts',
  'covered_block_required',
  'direct_cash_benefit',
  'direct_online_application',
  '"window_type":"rolling"',
  'svep.nrlm.gov.in/svepdemo/pdf/FAQ_SVEP.pdf',
]) assert(seed.includes(marker), `SVEP dossier is missing ${marker}`)

assert(fs.existsSync(auditPath), 'SVEP source audit is missing')
console.log('catalog rural entrepreneurship check passed: SVEP local-coverage, support-model and non-universal-entitlement boundaries are review-gated')
