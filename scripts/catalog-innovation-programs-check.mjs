import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_innovation_programs.sql')
const migrationPath = path.join(root, 'supabase', 'migrations', '20260908380000_catalog_meity_samridh_current_evidence.sql')
const auditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-08-meity-samridh-source-audit.md')
const packetPath = path.join(root, 'docs', 'catalog-review-evidence', 'central-review-068.json')
const seed = fs.readFileSync(seedPath, 'utf8')
const migration = fs.readFileSync(migrationPath, 'utf8')
const audit = fs.readFileSync(auditPath, 'utf8')
const packet = fs.readFileSync(packetPath, 'utf8')
const lower = seed.toLowerCase()

function assert(condition, message) {
  if (!condition) throw new Error(`catalog innovation programme check failed: ${message}`)
}

const slugs = [
  'technology-incubation-and-development-of-entrepreneurs-tide-2',
  'startup-accelerator-meity-samridh',
  'nidhi-prayas-2-0',
  'biotechnology-ignition-grant-big',
]

for (const slug of slugs) assert(lower.includes(`"slug":"${slug}"`), `${slug} identity is missing`)
for (const url of [
  'https://www.meity.gov.in/offerings/schemes-and-services/details/technology-incubation-and-development-of-entrepreneurs-qmwejntqwa',
  'https://msh.meity.gov.in/schemes/samridh',
  'https://nidhi.dst.gov.in/prayas2-0/',
  'https://nidhi.dst.gov.in/document/nidhi-prayas-2-0-program-guidelines/',
  'https://www.birac.nic.in/big.php',
]) assert(lower.includes(url), `${url} is missing from the review-gated dossier`)

for (const marker of [
  '"matching_funding_max_inr":4000000',
  '"prayas_centre_max_inr":2000000',
  '"advance_prayas_centre_max_inr":4000000',
  '"grant_max_inr":5000000',
  '"track_specific_ceiling":true',
  '"current_call_required":true',
  '"unknown_handling":"needs_information"',
]) assert(lower.includes(marker), `${marker} is missing from the fine-print or rule payload`)

assert(lower.includes("'in_review'"), 'records must remain review-gated')
assert(!lower.includes(", 'active',") && !lower.includes(", 'upcoming',"), 'records must not publish before review')
assert(lower.includes('source_anchor') && lower.includes('review_note'), 'source anchors and reviewer notes are required')
for (const marker of ['Scheme-Report.pdf', 'samridh2ndcohrot', 'investment_not_grant', 'separate_value_buckets', '2026-09-08']) {
  assert(migration.includes(marker), `current SAMRIDH migration is missing ${marker}`)
}
for (const marker of ['Cohort 2', 'not evidence of an open startup application window', 'equity-linked', 'Remain `in_review`']) {
  assert(audit.includes(marker), `SAMRIDH source audit is missing ${marker}`)
}
for (const marker of ['investment/equity-linked', 'remain_in_review', 'publicationReady', 'human reviewer']) {
  assert(packet.toLowerCase().includes(marker.toLowerCase()), `SAMRIDH evidence packet is missing ${marker}`)
}

console.log('catalog innovation programme check passed: TIDE 2.0, SAMRIDH, NIDHI PRAYAS 2.0 and BIRAC BIG remain review-gated with official provenance and track-specific fine print')
