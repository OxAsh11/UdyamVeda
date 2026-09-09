import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs/catalog-review-evidence/central-review-039.json'), 'utf8'))
const batch = JSON.parse(fs.readFileSync(path.join(root, 'docs/catalog-review-batches.json'), 'utf8')).batches.find((item) => item.batchId === 'central-review-039')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog shipbuilding batch check failed: ${message}`)
}

const expected = [
  'shipbuilding-development-scheme-brownfield-capacity-expansion',
  'shipbuilding-development-scheme-greenfield-cluster',
  'shipbuilding-development-scheme-risk-coverage',
  'shipbuilding-financial-assistance-scheme-sbfas',
]
assert(packet.schemaVersion === 1, 'schema version must be 1')
assert(packet.batchId === 'central-review-039', 'packet batch id mismatch')
assert(packet.authority.includes('Ports'), 'authority must be MoPSW')
assert(batch && batch.recordCount === expected.length, 'review batch registry must contain four records')
assert(JSON.stringify(packet.records.map((record) => record.slug).sort()) === JSON.stringify(expected.sort()), 'packet record set mismatch')
assert(packet.publicationGuard.publicationReady === false, 'packet cannot be publication-ready')

for (const record of packet.records) {
  assert(record.sourceUrl.includes('shipmin.gov.in'), `${record.slug} must have a Ministry primary source`)
  assert(record.supportingSources.length >= 3, `${record.slug} needs three official supporting sources`)
  assert(record.observations.length >= 4, `${record.slug} needs four observations`)
  assert(record.reviewFollowUps.length >= 4, `${record.slug} needs four reviewer follow-ups`)
  assert(record.proposedDecision === 'remain_in_review' && record.humanReviewer === null, `${record.slug} must remain review-gated`)
}

const bySlug = Object.fromEntries(packet.records.map((record) => [record.slug, record]))
assert(bySlug['shipbuilding-development-scheme-greenfield-cluster'].observations.some((text) => text.includes('not an ordinary standalone startup or shipyard grant')), 'greenfield institutional boundary is missing')
assert(bySlug['shipbuilding-development-scheme-brownfield-capacity-expansion'].observations.some((text) => text.includes('25%')), 'brownfield grant boundary is missing')
assert(bySlug['shipbuilding-development-scheme-risk-coverage'].observations.some((text) => text.includes('not a direct grant')), 'risk-coverage non-cash boundary is missing')
assert(bySlug['shipbuilding-financial-assistance-scheme-sbfas'].observations.some((text) => text.includes('45-day application')), 'SBFAS deadline boundary is missing')
assert(bySlug['shipbuilding-financial-assistance-scheme-sbfas'].observations.some((text) => text.includes('7 January 2026')), 'SBFAS current-version marker is missing')

console.log('catalog shipbuilding batch check passed: four distinct MoPSW routes, beneficiary boundaries and review gates are present')
