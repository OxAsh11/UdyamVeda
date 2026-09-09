import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const route = fs.readFileSync(path.join(root, 'src', 'app', 'api', 'admin', 'catalog', 'source-failures', 'evidence', 'route.ts'), 'utf8')
const sourceFailureRoute = fs.readFileSync(path.join(root, 'src', 'app', 'api', 'admin', 'catalog', 'source-failures', 'route.ts'), 'utf8')
const page = fs.readFileSync(path.join(root, 'src', 'app', 'admin', 'catalog', 'source-failures', 'page.tsx'), 'utf8')
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260909040000_catalog_manual_evidence_capture.sql'), 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog manual evidence check failed: ${message}`)
}

assert(route.includes("getSourceFailureSummary()"), 'manual intake must bind submissions to the current failure queue')
assert(route.includes(".from('source_registry')") && route.includes(".eq('url', sourceUrl)"), 'manual intake must require a registered exact evidence URL')
assert(route.includes("createHash('sha256')"), 'manual intake must hash evidence server-side')
assert(route.includes("capture_method: 'manual_official_text'"), 'manual intake must record a distinct capture method')
assert(sourceFailureRoute.includes("['manual_official_text', 'manual_official_pdf_text']"), 'source-failure review queue must expose both manual text and manual PDF evidence')
assert(route.includes("status: 'needs_review'") && route.includes("publicationStatus: 'blocked'"), 'manual intake must remain review-blocked')
assert(route.includes('MAX_EVIDENCE_CHARACTERS') && route.includes('413'), 'manual intake must bound evidence size')
assert(route.includes('potentially suspicious content entered by you') && route.includes('request blocked'), 'manual intake must reject known error/security-interstitial text')
assert(route.includes("action: 'catalog_manual_evidence_submitted'"), 'manual intake must write an audit event')
assert(!route.includes("from('opportunities').update") && !route.includes("publication_status: 'approved'"), 'manual intake must not approve opportunity records')
assert(migration.includes('manual_official_text'), 'manual capture migration must allow the explicit capture method')
assert(page.includes('/api/admin/catalog/source-failures/evidence') && page.includes('Store blocked evidence'), 'reviewer UI must expose blocked manual evidence intake')
assert(page.includes('Do not paste passwords, OTPs, or personal identity numbers'), 'reviewer UI must warn against sensitive credentials and identity data')

console.log('catalog manual evidence check passed: exact registered URLs, server hashes, review blocking, audit logging, and reviewer intake are present')
