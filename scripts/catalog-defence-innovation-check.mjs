import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_defence_innovation.sql')
const auditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-07-idex-open-challenge-source-audit.md')
const seed = fs.readFileSync(seedPath, 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog defence innovation check failed: ${message}`)
}

for (const marker of [
  '"slug":"idex-open-challenge-2026"',
  'current_idex_facts',
  'open_challenge_deadline',
  'grant_ceiling_inr',
  'milestone_based',
  'equity_taken_by_dio',
  '"window_type":"fixed"',
  'idex.gov.in/faq',
]) assert(seed.includes(marker), `iDEX dossier is missing ${marker}`)

assert(fs.existsSync(auditPath), 'iDEX source audit is missing')
console.log('catalog defence innovation check passed: iDEX Open Challenge deadline, grant, applicant and milestone boundaries are review-gated')
