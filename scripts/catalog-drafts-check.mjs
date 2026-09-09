import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const extractor = fs.readFileSync(path.join(root, 'src/lib/ingest/extractor.ts'), 'utf8')
const route = fs.readFileSync(path.join(root, 'src/app/api/admin/catalog/drafts/route.ts'), 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog drafts check failed: ${message}`)
}

assert(extractor.includes('does not cite the crawled source URL exactly'), 'extraction must require exact crawled-source provenance')
assert(extractor.includes('omitted the records array'), 'extraction must fail closed on malformed envelopes')
assert(route.includes('windowRowsFor'), 'draft promotion must derive window rows')
assert(route.includes("from('opportunity_windows').insert(windowRows)"), 'draft promotion must persist opportunity windows')
assert(route.includes("review_status: 'in_review'"), 'promoted drafts must remain in review')
assert(route.includes('reviewed: false'), 'promoted eligibility rules must remain unreviewed')

console.log('catalog drafts check passed: exact source evidence, fail-closed extraction, and window persistence')
