import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs/catalog-review-evidence/central-review-036.json'), 'utf8'))
const batch = JSON.parse(fs.readFileSync(path.join(root, 'docs/catalog-review-batches.json'), 'utf8')).batches.find((item) => item.batchId === 'central-review-036')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog MSME batch check failed: ${message}`)
}

const expected = [
  'coir-vikas-yojana',
  'entrepreneurship-and-skill-development-programme-esdp',
  'msme-international-cooperation-scheme',
  'khadi-gramodyog-vikas-yojana',
  'micro-and-small-enterprises-cluster-development-programme',
  'mse-green-investment-and-financing-for-transformation',
  'mse-scheme-for-promotion-and-investment-in-circular-economy',
  'mse-online-dispute-resolution-scheme',
  'msme-competitive-lean-scheme',
  'msme-technology-centres-tool-rooms-extension-centres',
  'msme-tool-rooms-and-technology-centres',
  'msme-trade-enablement-and-marketing-team-initiative',
  'national-scheduled-caste-scheduled-tribe-hub',
  'nsic-consortia-and-tender-marketing-scheme',
  'performance-and-credit-rating-scheme-for-micro-and-small-enterprises',
  'procurement-and-marketing-support-pms',
  'msme-promotion-north-eastern-region-sikkim-infrastructure',
  'public-procurement-policy-for-micro-and-small-enterprises',
]

assert(packet.schemaVersion === 1, 'schema version must be 1')
assert(packet.batchId === 'central-review-036', 'packet batch id mismatch')
assert(packet.authority.includes('Micro, Small'), 'authority must be the Ministry of MSME')
assert(packet.status === 'draft_source_cross_check', 'packet must remain source-review draft')
assert(packet.publicationGuard.publicationReady === false, 'packet cannot be publication-ready')
assert(batch && batch.recordCount === expected.length, 'review batch registry must contain 18 records')
assert(packet.records.length === expected.length, 'packet must contain 18 records')
assert(JSON.stringify(packet.records.map((record) => record.slug)) === JSON.stringify(expected), 'packet record order or slug set mismatch')

for (const record of packet.records) {
  assert(record.sourceUrl.startsWith('https://'), `${record.slug} must have an HTTPS primary source`)
  assert(record.supportingSources.length >= 2, `${record.slug} needs at least two supporting sources`)
  assert(record.observations.length >= 4, `${record.slug} needs four source observations`)
  assert(record.reviewFollowUps.length >= 4, `${record.slug} needs four reviewer follow-ups`)
  assert(record.proposedDecision === 'remain_in_review', `${record.slug} must remain review-gated`)
  assert(record.humanReviewer === null, `${record.slug} cannot claim a reviewer decision`)
}

const requiredMarkers = [
  'ramp.msme.gov.in',
  'dcmsme.gov.in',
  'lean.msme.gov.in',
  'sclcss.msme.gov.in',
  'nsic.co.in',
  'ner-promotion.msme.gov.in',
  'my.msme.gov.in',
]
for (const marker of requiredMarkers) assert(packet.records.some((record) => record.sourceUrl.includes(marker) || record.supportingSources.some((source) => source.url.includes(marker))), `packet is missing official source family ${marker}`)

assert(packet.records.some((record) => record.slug === 'mse-green-investment-and-financing-for-transformation' && record.observations.some((text) => text.includes('not a guaranteed loan or grant value'))), 'GIFT loan/guarantee boundary is missing')
assert(packet.records.some((record) => record.slug === 'micro-and-small-enterprises-cluster-development-programme' && record.observations.some((text) => text.includes('not an individual enterprise grant'))), 'cluster programme beneficiary boundary is missing')
assert(packet.records.some((record) => record.slug === 'msme-promotion-north-eastern-region-sikkim-infrastructure' && record.observations.some((text) => text.includes('State Government organisations'))), 'NER/Sikkim institutional boundary is missing')
assert(packet.records.some((record) => record.slug === 'public-procurement-policy-for-micro-and-small-enterprises' && record.observations.some((text) => text.includes('does not guarantee an individual MSE an order'))), 'procurement non-guarantee boundary is missing')

console.log('catalog MSME batch check passed: 18 official-source review records, component boundaries and publication guard are present')
