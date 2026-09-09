import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_birac_eyuva.sql'), 'utf8')
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-048.json'), 'utf8'))
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-08-eyuva-source-audit.md'), 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog E-YUVA check failed: ${message}`)
}

assert(seed.includes('"slug":"birac-eyuva-student-research-innovation"'), 'structured E-YUVA slug must exist')
assert(seed.includes('"lifecycle_status":"paused"'), 'E-YUVA must remain paused until a current call is verified')
assert(seed.includes('"innovation_fellow_pg_monthly_inr":30000'), 'Innovation Fellow postgraduate fellowship must remain separate')
assert(seed.includes('"eyuva_fellow_annual_team_research_grant_inr":250000'), 'E-YUVA Fellow team grant must remain separate')
assert(seed.includes('e_yuva.php'), 'official current E-YUVA page must be cited')
assert(seed.includes('NO ACTIVE CALLS'), 'current no-active-call state must remain explicit')
assert(seed.includes('1643177664_EYUVA_Guidelines.pdf'), 'official guideline PDF must be cited')
assert(packet.batchId === 'central-review-048', 'E-YUVA must be in the BIRAC review packet')
const record = packet.records.find(value => value.slug === 'birac-eyuva-student-research-innovation')
assert(record, 'E-YUVA review record must exist')
assert(record.proposedDecision === 'remain_in_review', 'E-YUVA must remain review-gated')
assert(record.supportingSources.some(source => source.url.includes('1643177664_EYUVA_Guidelines.pdf')), 'packet must cite the guideline PDF')
assert(record.reviewFollowUps.some(value => value.toLowerCase().includes('current e-yuva call')), 'packet must require current-call verification')
assert(audit.includes('publicationAllowed: false'), 'audit must deny publication before review')

console.log('catalog E-YUVA check passed: student/researcher routes, separate benefits, no-active-call state and review controls remain explicit')
