import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const baselinePath = path.join(root, 'docs', 'igod-coverage-baseline.json')
const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'))

function assert(condition, message) {
  if (!condition) throw new Error(`catalog authority baseline check failed: ${message}`)
}

assert(baseline.authority.includes('Integrated Government Online Directory'), 'baseline authority is missing')
assert(baseline.sourceLastUpdatedAt === '2026-09-03', 'baseline source date is not the recorded IGOD update date')
assert(baseline.sources?.ministries === 'https://igod.gov.in/ug/E002/organizations', 'ministry source URL is incorrect')
assert(baseline.sources?.departments === 'https://igod.gov.in/ug/E003/organizations', 'department source URL is incorrect')
assert(baseline.sources?.unionGovernmentCategories === 'https://igod.gov.in/ug/categories', 'union government categories source URL is incorrect')
assert(baseline.liveInventoryAudit?.checkedAt === '2026-09-07', 'live inventory audit date is missing')
assert(baseline.liveInventoryAudit?.ministriesResultCount === 53, 'live ministry result count must be 53')
assert(baseline.liveInventoryAudit?.departmentsResultCount === 50, 'live department result count must be 50')
assert(baseline.liveInventoryAudit?.sourceLastUpdatedAt === '2026-09-03', 'live audit must retain the official directory last-updated date')
assert(baseline.liveInventoryAudit?.method?.includes('does not assess business relevance'), 'live audit must not be treated as a relevance assessment')

const inventories = new Map((baseline.inventories ?? []).map(item => [item.authorityLevel, item]))
for (const [level, expectedCount] of [['ministry', 53], ['department', 50]]) {
  const inventory = inventories.get(level)
  assert(inventory, `${level} baseline is missing`)
  assert(inventory.expectedCount === expectedCount, `${level} expected count must be ${expectedCount}`)
  assert(Array.isArray(inventory.records) && inventory.records.length === expectedCount, `${level} must contain all expected names`) 
  const names = inventory.records.map(record => record.authorityName)
  assert(names.every(name => typeof name === 'string' && name.trim().length > 0), `${level} names must be non-empty`)
  assert(new Set(names).size === names.length, `${level} names must be unique`)
  assert(inventory.records.every(record => record.authorityUrl === null || (typeof record.authorityUrl === 'string' && record.authorityUrl.startsWith('https://'))), `${level} URLs must be null or official HTTPS URLs`)
  assert(['names_and_partial_urls_pending_assessment', 'names_and_urls_pending_assessment'].includes(inventory.inventoryStatus), `${level} must remain explicitly pending assessment`)
  if (inventory.inventoryStatus === 'names_and_partial_urls_pending_assessment') {
    assert(inventory.records.some(record => record.authorityUrl === null), `${level} must preserve unresolved URL work instead of pretending the directory is complete`)
  }
}

assert(baseline.gateEffect.includes('must remain closed'), 'baseline must preserve the fail-closed beta gate')
console.log('catalog authority baseline check passed: IGOD names and official portal URLs are versioned, while relevance assessments remain pending')
