import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_birac_pace.sql'), 'utf8')
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-048.json'), 'utf8'))
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-08-pace-source-audit.md'), 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog PACE check failed: ${message}`)
}

assert(seed.includes('"slug":"birac-pace-academic-research-conversion-to-enterprise"'), 'structured PACE slug must exist')
assert(seed.includes('"lifecycle_status":"paused"'), 'PACE must remain paused until a current RFP is verified')
assert(seed.includes('"air_project_cost_max_inr":5000000'), 'AIR ceiling must remain explicit')
assert(seed.includes('"crs_funding_ceiling":"none stated in reviewed guideline"'), 'CRS ceiling caveat must remain explicit')
assert(seed.includes('desc_new.php?id=286'), 'official current PACE page must be cited')
assert(seed.includes('current PACE page'), 'current-call gate must remain explicit')
assert(seed.includes('1729751841_Revised_PACE_guidelines_oct.pdf'), 'official revised guideline PDF must be cited')
assert(packet.batchId === 'central-review-048', 'PACE must be in the BIRAC review packet')
const record = packet.records.find(value => value.slug === 'birac-pace-academic-research-conversion-to-enterprise')
assert(record, 'PACE review record must exist')
assert(record.proposedDecision === 'remain_in_review', 'PACE must remain review-gated')
assert(record.supportingSources.some(source => source.url.includes('1729751841_Revised_PACE_guidelines_oct.pdf')), 'packet must cite the revised guideline')
assert(record.reviewFollowUps.some(value => value.toLowerCase().includes('active air/crs call')), 'packet must require current-call verification')
assert(audit.includes('publicationAllowed: false'), 'audit must deny publication before review')

console.log('catalog PACE check passed: AIR/CRS boundaries, academic-primary route, funding caveats and current-call review controls remain explicit')
