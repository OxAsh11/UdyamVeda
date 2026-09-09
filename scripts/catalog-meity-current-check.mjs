import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packetPath = path.join(root, 'docs', 'catalog-review-evidence', 'central-review-031.json')
const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'))

function assert(condition, message) {
  if (!condition) throw new Error(`catalog MeitY current check failed: ${message}`)
}

assert(packet.batchId === 'central-review-031', 'batch 031 evidence packet is missing')
assert(packet.records.length === 6, 'batch 031 must cover six MeitY records')
assert(packet.records.every((record) => record.proposedDecision === 'remain_in_review'), 'all MeitY records must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'MeitY records must not be publication-ready')

for (const slug of [
  'meity-genesis-gen-next-support-for-innovative-startups',
  'meity-tide-2-incubation-centres',
  'technology-incubation-and-development-of-entrepreneurs-tide-2',
  'production-linked-incentive-2-it-hardware',
  'design-linked-incentive-semiconductor-design',
  'chips-to-startup-c2s',
]) {
  const record = packet.records.find((item) => item.slug === slug)
  assert(record, `${slug} is missing from the evidence packet`)
  assert(record.supportingSources.length >= 2, `${slug} needs current supporting sources`)
  assert(record.reviewFollowUps.length >= 3, `${slug} needs explicit review follow-ups`)
}

const meitySeed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_meity_genesis_telecom_testing.sql'), 'utf8').toLowerCase()
const tideIncubatorSeed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_incubator_programs.sql'), 'utf8').toLowerCase()
const tideStartupSeed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_innovation_programs.sql'), 'utf8').toLowerCase()
const pliSeed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_pli_it_hardware.sql'), 'utf8').toLowerCase()

for (const [name, source] of [
  ['GENESIS', meitySeed],
  ['TIDE incubator', tideIncubatorSeed],
  ['TIDE startup', tideStartupSeed],
  ['PLI 2.0', pliSeed],
]) {
  assert(source.includes("'in_review'") || source.includes('"in_review"'), `${name} seed is not review-gated`)
  assert(source.includes('meity.gov.in') || source.includes('msh.meity.gov.in') || source.includes('startupindia.gov.in'), `${name} seed lacks official provenance`)
}

const incubator = packet.records.find((record) => record.slug === 'meity-tide-2-incubation-centres')
const startup = packet.records.find((record) => record.slug === 'technology-incubation-and-development-of-entrepreneurs-tide-2')
assert(incubator.observations.some((item) => item.includes('eligible host institutions') && item.includes('not ordinary startups')), 'TIDE host/startup boundary is missing')
assert(startup.observations.some((item) => item.includes('mediated by TIDE-supported incubators')), 'startup-facing TIDE route boundary is missing')

const pli = packet.records.find((record) => record.slug === 'production-linked-incentive-2-it-hardware')
assert(pli.observations.some((item) => item.includes('not a flat subsidy')), 'PLI must not be represented as a flat subsidy')
assert(pli.observations.some((item) => item.includes('new application window is open')), 'PLI application-window uncertainty is missing')

const dli = packet.records.find((record) => record.slug === 'design-linked-incentive-semiconductor-design')
assert(dli.observations.some((item) => item.includes('separate benefit buckets')), 'DLI benefit buckets must remain separate')
assert(dli.observations.some((item) => item.includes('INR 15 crore') && item.includes('INR 30 crore')), 'DLI component ceilings are missing or combined incorrectly')

const c2s = packet.records.find((record) => record.slug === 'chips-to-startup-c2s')
assert(c2s.observations.some((item) => item.includes('umbrella MeitY programme')), 'C2S umbrella boundary is missing')
assert(c2s.observations.some((item) => item.includes('separate benefit buckets')), 'C2S benefit buckets must remain separate')
assert(c2s.observations.some((item) => item.includes('BLDC call page is currently marked closed')), 'C2S closed-call evidence is missing')

console.log('catalog MeitY current check passed: GENESIS, distinct TIDE host/startup routes, PLI 2.0, C2S component boundaries and review gates are present')
