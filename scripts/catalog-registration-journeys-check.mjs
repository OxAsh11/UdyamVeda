import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const dataPath = path.join(root, 'src', 'lib', 'data', 'national-registration-journeys.ts')
const source = fs.readFileSync(dataPath, 'utf8')

const expectedIds = [
  'company-incorporation-spice-plus',
  'pan-tan-tax-identity',
  'business-banking-readiness',
  'udyam-registration',
  'gst-registration',
  'dpiit-startup-recognition',
  'iec-registration',
  'fssai-license',
  'epfo-esic-compliance',
  'state-local-licences',
]

const failures = []
for (const id of expectedIds) {
  if (!source.includes(`id: '${id}'`)) failures.push(`missing journey: ${id}`)
}

const journeyCount = (source.match(/\n    id: '/g) ?? []).length
if (journeyCount !== expectedIds.length) failures.push(`expected ${expectedIds.length} journeys, found ${journeyCount}`)
if (!source.includes("status: 'review-gated'")) failures.push('review-gated status is missing')
if (!source.includes("status: 'expanding'")) failures.push('expanding status is missing')
if (!source.includes('applicant')) failures.push('applicant-control boundary is missing')
if (!source.includes('officialUrl')) failures.push('official source links are missing')

if (failures.length > 0) {
  console.error(`registration journey check failed:\n- ${failures.join('\n- ')}`)
  process.exit(1)
}

console.log(`registration journey check passed: ${journeyCount} national journeys with review and source boundaries`)
