import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908310000_catalog_defence_msme_promotion_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_defence_msme_promotion.sql'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-08-defence-msme-promotion-source-audit.md'), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(`catalog Defence MSME promotion check failed: ${message}`) }

assert(seed.includes('scheme-for-promotion-of-msmes-in-defence'), 'record is missing')
for (const url of [
  'https://www.ddpmod.gov.in/en/scheme_for_promotion_of_msmes_in_defence_0',
  'https://www.ddpmod.gov.in/sites/default/files/2e7aaf1bd5030bd12ef5e83c096ef5bca4dc3aac2c4b7f55013996b6cbc75239/4ac52b4c9f672575ba175be70bcc2be4f5b96d9614b2e2081ee88cfccb809c87.pdf'
]) assert(migration.includes(url) && seed.includes(url), `missing official source evidence ${url}`)
for (const marker of [
  'event_sponsorship',
  'national_event_sponsorship_ceiling_inr":300000',
  'state_event_sponsorship_ceiling_inr":150000',
  'participant_msm_es_do_not_receive_direct_cash_entitlement',
  'eligible_organiser_or_participant_route_verified',
  'Empowered Committee'
]) assert(seed.includes(marker), `boundary is missing: ${marker}`)
assert(seed.includes("'in_review'") && seed.includes('FY 2026-27'), 'review gate and upcoming-window context are missing')
assert(audit.includes('Organizer boundary') && audit.includes('Human review gate'), 'audit boundaries are missing')
console.log('catalog Defence MSME promotion check passed: event sponsorship and defence market-access route remain in_review, window-contextualized, source-anchored and review-gated')
