import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-034.json'), 'utf8'))
const evSeed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_mhi_pm_e_drive_current.sql'), 'utf8').toLowerCase()
const autoSeed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_auto_pli.sql'), 'utf8').toLowerCase()
const evMigration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908220000_catalog_mhi_pm_e_drive_current.sql'), 'utf8').toLowerCase()

function assert(condition, message) {
  if (!condition) throw new Error(`catalog MHI current check failed: ${message}`)
}

assert(packet.batchId === 'central-review-034', 'batch 034 evidence packet is missing')
assert(packet.records.length === 2, 'batch 034 must cover two MHI records')
assert(packet.records.every((record) => record.proposedDecision === 'remain_in_review'), 'all MHI records must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'MHI records must not be publication-ready')
assert(packet.records.every((record) => record.supportingSources.length >= 4), 'each MHI record needs current official supporting sources')
assert(packet.records.every((record) => record.reviewFollowUps.length >= 6), 'each MHI record needs explicit current-term follow-ups')

for (const slug of [
  'mhi-pm-e-drive-ev-public-charging-stations',
  'production-linked-incentive-automobile-auto-components',
]) assert(packet.records.some((record) => record.slug === slug), `missing ${slug}`)

for (const url of [
  'https://pmedrive.heavyindustries.gov.in/policy_procedure',
  'https://pmedrive.heavyindustries.gov.in/docs/policy_document/FAQs-Operational%20Guidelines%20for%20EV%20PCS%20under%20PM%20E-DRIVE.pdf',
  'https://heavyindustries.gov.in/en/pli-scheme-automobile-and-auto-component-industry',
  'https://pliauto.in/approvedaatproduct/1',
]) assert(packet.records.some((record) => record.sourceUrl === url || record.supportingSources.some((source) => source.url === url)), `missing official source ${url}`)

for (const marker of [
  'institutional_eligibility_verified',
  'appointed_nodal_agency_verified',
  'public_access_required',
  'ordinary founders, startups, private landowners and private cpos are not direct subsidy beneficiaries',
  "'in_review'",
]) assert(evSeed.includes(marker), `EV PCS seed is missing ${marker}`)

for (const marker of [
  'production-linked-incentive-automobile-auto-components',
  'advanced automotive technology',
  'budgetary_outlay_inr":25938',
  'budgetary_outlay_is_not_applicant_ceiling',
  'window_type":"closed',
  "'in_review'",
]) assert(autoSeed.includes(marker), `PLI-Auto seed is missing ${marker}`)

assert(evMigration.includes('pmedrive.heavyindustries.gov.in'), 'EV PCS source registry migration lacks official provenance')
assert(packet.records.some((record) => record.slug === 'mhi-pm-e-drive-ev-public-charging-stations' && record.observations.some((item) => item.includes('institutional'))), 'EV PCS institutional boundary is missing')
assert(packet.records.some((record) => record.slug === 'production-linked-incentive-automobile-auto-components' && record.observations.some((item) => item.includes('not a flat grant or subsidy'))), 'PLI-Auto performance-linked boundary is missing')
assert(packet.records.some((record) => record.slug === 'production-linked-incentive-automobile-auto-components' && record.observations.some((item) => item.includes('new applicant window is open'))), 'PLI-Auto intake uncertainty is missing')

console.log('catalog MHI current check passed: PM E-DRIVE institutional EV PCS route, PLI-Auto performance boundaries, current implementation evidence and review gates are present')
