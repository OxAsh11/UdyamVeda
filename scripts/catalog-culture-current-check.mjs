import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packetPath = path.join(root, 'docs', 'catalog-review-evidence', 'central-review-030.json')
const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'))
const seedFiles = [
  'verified_central_culture_cfpg.sql',
  'verified_central_culture_allied_activities.sql',
  'verified_central_culture_building_grants.sql',
  'verified_central_culture_tagore_complexes.sql',
  'verified_central_culture_national_presence.sql',
]

function assert(condition, message) {
  if (!condition) throw new Error(`catalog Culture current check failed: ${message}`)
}

assert(packet.batchId === 'central-review-030', 'batch 030 evidence packet is missing')
assert(packet.records.length === 5, 'batch 030 must cover five Ministry of Culture records')
assert(packet.records.every((record) => record.proposedDecision === 'remain_in_review'), 'all records must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'culture records must not be publication-ready')

for (const slug of [
  'cultural-function-and-production-grant-cfpg',
  'financial-assistance-allied-cultural-activities',
  'financial-assistance-building-grants-studio-theatres',
  'financial-assistance-tagore-cultural-complexes',
  'financial-assistance-cultural-organizations-national-presence',
]) {
  const record = packet.records.find((item) => item.slug === slug)
  assert(record, `${slug} is missing from the evidence packet`)
  assert(record.supportingSources.length >= 2, `${slug} needs current supporting sources`)
  assert(record.reviewFollowUps.length >= 3, `${slug} needs explicit review follow-ups`)
}

for (const file of seedFiles) {
  const source = fs.readFileSync(path.join(root, 'supabase', 'seed', file), 'utf8').toLowerCase()
  assert(source.includes("'in_review'") || source.includes('"in_review"'), `${file} is not review-gated`)
  assert(source.includes('culture.gov.in'), `${file} lacks official Ministry of Culture provenance`)
}

const national = packet.records.find((record) => record.slug === 'financial-assistance-cultural-organizations-national-presence')
assert(national.observations.some((item) => item.includes('15 July 2026') && item.includes('closed')), 'closed 2026-27 National Presence call boundary is missing')
assert(national.sourceUrl.includes('2026-27-grant-in-aid.pdf'), 'National Presence current call evidence is missing')

console.log('catalog Culture current check passed: five institutional routes, current Ministry pages, closed National Presence call boundary and review gates are present')
