import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_birac_sitare.sql'), 'utf8')
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-048.json'), 'utf8'))
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-08-sitare-source-audit.md'), 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog SITARE check failed: ${message}`)
}

assert(seed.includes('"slug":"birac-sitare-student-innovation"'), 'structured SITARE slug must exist')
assert(seed.includes('"lifecycle_status":"paused"'), 'SITARE must remain paused until a current call is verified')
assert(seed.includes('"gyti_max_grant_inr":1500000'), 'GYTI ceiling must remain component-specific')
assert(seed.includes('"biis_appreciation_max_grant_inr":100000'), 'BIIS Appreciation ceiling must remain separate')
assert(seed.includes('desc_new.php?id=581'), 'official SITARE page must be cited')
assert(seed.includes('active call') && seed.includes('current_call_required'), 'active-call gate must remain explicit')
assert(seed.includes('1568955483_birac_sitare_gyti_biis_guidelines.pdf'), 'official guideline PDF must be cited')
assert(packet.batchId === 'central-review-048', 'SITARE must be in the BIRAC review packet')
const record = packet.records.find(value => value.slug === 'birac-sitare-student-innovation')
assert(record, 'SITARE review record must exist')
assert(record.proposedDecision === 'remain_in_review', 'SITARE must remain review-gated')
assert(record.supportingSources.some(source => source.url.includes('1568955483_birac_sitare_gyti_biis_guidelines.pdf')), 'packet must cite the guideline PDF')
assert(record.reviewFollowUps.some(value => value.toLowerCase().includes('current sitare call')), 'packet must require current-call verification')
assert(audit.includes('publicationAllowed: false'), 'audit must deny publication before review')

console.log('catalog SITARE check passed: student route, separate GYTI/BIIS benefits, current-call gate and review controls remain explicit')
