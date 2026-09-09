import fs from 'node:fs'
import path from 'node:path'

const seedPath = path.join(process.cwd(), 'supabase', 'seed', 'verified_central_handicrafts_nhdp.sql')
const seed = fs.readFileSync(seedPath, 'utf8').toLowerCase()
const migration = fs.readFileSync(path.join(process.cwd(), 'supabase', 'migrations', '20260908530000_catalog_handicrafts_nhdp_current_reconciliation.sql'), 'utf8').toLowerCase()
const audit = fs.readFileSync(path.join(process.cwd(), 'docs', 'catalog-audits', '2026-09-08-handicrafts-nhdp-source-audit.md'), 'utf8').toLowerCase()
const packet = fs.readFileSync(path.join(process.cwd(), 'docs', 'catalog-review-evidence', 'central-review-083.json'), 'utf8').toLowerCase()

function assert(condition, message) {
  if (!condition) throw new Error(`catalog handicrafts check failed: ${message}`)
}

for (const marker of [
  'nhdp-marketing-support-services-handicrafts',
  'nhdp-skill-development-handicraft-sector',
  'marketing support and services',
  'skill development in handicraft sector',
  'handicrafts.nic.in/cmsupload/20230425203825nhdp_guidlines.pdf',
  'handicrafts.nic.in/schemes.aspx',
  'handicrafts.nic.in/tenders.aspx?type=27',
  'artisan_producer_company',
  'registered_shg',
  'buyer_seller_meets',
  'pahchan',
  'comprehensive_skill_upgradation',
  'no_fixed_entitlement',
  'agency_route',
  'selection_required',
  'review_note',
  "'in_review'",
  "'publish', 'open'",
]) assert(seed.includes(marker), `${marker} is missing from the separated NHDP tracks`)

assert(seed.includes('no_guaranteed_amount'), 'NHDP must not imply a guaranteed monetary entitlement')
assert(seed.includes('fy 2026-27'), 'current FY 2026-27 notice context is required')
assert(seed.includes('annual_calendar_or_notice_applies'), 'marketing route must remain notice/calendar dependent')
assert(seed.includes('batch of 30 artisans'), 'skill route must preserve the cited batch-size detail')
for (const url of [
  'https://handicrafts.nic.in/showall.aspx?link=allnews',
  'https://handicrafts.nic.in/tenders.aspx?type=27',
  'https://handicrafts.nic.in/cmsupload/20230425203825nhdp_guidlines.pdf',
]) assert(migration.includes(url), `current official source is missing: ${url}`)
for (const marker of [
  'notice_presence_is_not_open_deadline',
  'deadline_status',
  'open_window_not_inferred',
  'historical_csup_terms_not_current',
  '2026-01-02',
  '2026-03-31',
  '2026-04-06',
  'current_terms_require_attachment_capture',
]) assert(migration.includes(marker), `current notice boundary is missing: ${marker}`)
for (const marker of ['status: `in_review`', 'notice presence does not establish', 'historical csup details remain supporting context only', 'human review gate']) {
  assert(audit.includes(marker), `audit boundary is missing: ${marker}`)
}
for (const marker of ['draft_source_cross_check', 'remain_in_review', 'publicationready', '2026-01-02', '2026-03-31', '2026-04-06']) {
  assert(packet.includes(marker), `evidence packet marker is missing: ${marker}`)
}

console.log('catalog handicrafts check passed: NHDP marketing and skill tracks, agency boundaries and current notice caveats are review-gated')
