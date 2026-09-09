import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const schemesPath = path.join(root, 'src/lib/data/schemes.ts')
const legacyPath = path.join(root, 'src/lib/opportunities/legacy.ts')
const routePath = path.join(root, 'src/app/api/admin/catalog/legacy-import/route.ts')

function read(file) {
  return fs.readFileSync(file, 'utf8')
}

function assert(condition, message) {
  if (!condition) throw new Error(`catalog legacy audit failed: ${message}`)
}

const schemes = read(schemesPath)
const legacy = read(legacyPath)
const route = read(routePath)
const ids = [...schemes.matchAll(/^\s{4}id:\s*'([^']+)'/gm)].map(match => match[1])
const duplicates = [...new Set(ids)].filter(id => ids.filter(candidate => candidate === id).length > 1)

assert(ids.length === 36, `expected the current legacy catalog to contain 36 records; found ${ids.length}`)
assert(duplicates.length === 0, `duplicate legacy IDs: ${duplicates.join(', ')}`)
assert(legacy.includes('legacy_import: true'), 'legacy drafts are not marked as legacy imports')
assert(legacy.includes("review_status: 'draft'"), 'legacy drafts are not review-gated')
assert(legacy.includes('is_primary: false'), 'legacy provenance is incorrectly marked primary')
assert(route.includes('getCatalogReviewer'), 'legacy import is not reviewer-protected')
assert(route.includes("extraction_model: 'legacy-static-import'"), 'legacy import does not identify its extraction model')
assert(route.includes("status: 'needs_review'"), 'legacy import does not stage records for review')
assert(route.includes('contentHash'), 'legacy import does not use content-hash idempotency')

console.log(`catalog legacy audit passed: ${ids.length} unique legacy records remain review-gated and importer-protected`)
