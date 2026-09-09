import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const baseline = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'igod-coverage-baseline.json'), 'utf8'))
const ledger = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'authority-assessment-ledger.json'), 'utf8'))

function assert(condition, message) {
  if (!condition) throw new Error(`catalog authority assessment ledger check failed: ${message}`)
}

const expected = baseline.inventories.flatMap((inventory) => inventory.records.map((record) => ({
  authorityLevel: inventory.authorityLevel,
  authorityName: record.authorityName,
})))
const rows = ledger.rows ?? []
const key = (row) => `${row.authorityLevel}|${row.authorityName}`
const expectedKeys = new Set(expected.map(key))
const actualKeys = new Set(rows.map(key))

assert(ledger.schemaVersion === 1, 'ledger schema version must be 1')
assert(ledger.sourceBaseline === 'docs/igod-coverage-baseline.json', 'ledger must point to the versioned IGOD baseline')
assert(rows.length === expected.length, `ledger row count must be ${expected.length}`)
assert(actualKeys.size === rows.length, 'ledger authority keys must be unique')
assert(rows.every((row) => ['ministry', 'department'].includes(row.authorityLevel)), 'ledger rows must be ministry or department rows')
assert(rows.every((row) => row.disposition === 'review_required'), 'no authority may be treated as assessed by this pending ledger')
assert(expected.every((row) => actualKeys.has(key(row))), 'every IGOD authority must appear in the ledger')
assert(rows.every((row) => expectedKeys.has(key(row))), 'ledger must not contain authorities outside the IGOD baseline')

const ministryCount = rows.filter((row) => row.authorityLevel === 'ministry').length
const departmentCount = rows.filter((row) => row.authorityLevel === 'department').length
assert(ministryCount === 53, 'ledger must contain 53 ministries')
assert(departmentCount === 50, 'ledger must contain 50 departments')

console.log(`catalog authority assessment ledger passed: ${rows.length} IGOD authorities explicitly queued for manual relevance review (${ministryCount} ministries, ${departmentCount} departments)`)
