import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const script = fs.readFileSync(path.join(root, 'scripts', 'catalog-manual-source-capture.mjs'), 'utf8')
const liveCaptureScript = fs.readFileSync(path.join(root, 'scripts', 'catalog-live-capture.mjs'), 'utf8')
const resolutionPlan = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-source-resolution-plan.json'), 'utf8'))
const captureManifest = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-live-source-capture.json'), 'utf8'))
const reviewBatches = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-batches.json'), 'utf8'))

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

assert(script.includes("requireArgument('--slug')"), 'manual capture must require a target opportunity slug')
assert(script.includes("requireArgument('--markdown-file')"), 'manual capture must require a reviewer-provided markdown file')
assert(script.includes("argumentValue('--source-url')"), 'manual capture must support a selected alternate source URL')
assert(script.includes('source-url') && script.includes('must exactly match'), 'manual capture must bind the text to the registered official source URL')
assert(script.includes('matchedAnchorTokens') && script.includes('source-anchor terms'), 'manual capture must verify source-anchor terms in the extracted text')
assert(script.includes('isPrimarySource') && script.includes("captureRole: isPrimarySource ? 'primary' : 'alternate'"), 'manual capture must classify the current primary source separately from alternate evidence')
assert(script.includes('captureKey'), 'manual capture must preserve primary and alternate evidence as separate source-keyed entries')
assert(script.includes('createHash(\'sha256\')'), 'manual capture must hash the extracted evidence')
assert(script.includes("manual_official_text") && script.includes("manual_official_pdf_text"), 'manual capture methods must distinguish official HTML and PDF text')
assert(script.includes("publicationStatus: 'blocked'"), 'manual capture must not approve a record')
assert(liveCaptureScript.includes("process.argv.includes('--http-fallback')"), 'live capture must require an explicit opt-in for HTTP fallback')
assert(liveCaptureScript.includes("captureMethod = 'http_html_fallback'"), 'HTTP fallback captures must record their extraction method')
assert(liveCaptureScript.includes('sameHost(record.source.url') || liveCaptureScript.includes('sameHost(url, response.url'), 'HTTP fallback must reject cross-host redirects')
assert(liveCaptureScript.includes("contentType") && liveCaptureScript.includes('text\\/html'), 'HTTP fallback must accept HTML only')
assert(liveCaptureScript.includes("publicationStatus: 'blocked'"), 'HTTP fallback captures must remain publication-blocked')
assert(resolutionPlan.plans.every(plan => typeof plan.manualPath === 'string' && plan.manualPath.length > 20), 'every open source failure must have a manual resolution path')
assert(new Set(resolutionPlan.plans.map(plan => plan.slug)).size === resolutionPlan.plans.length, 'source-resolution plans must have unique opportunity slugs')

const plansBySlug = new Map(resolutionPlan.plans.map(plan => [plan.slug, plan]))
const currentSourceBySlug = new Map(
  reviewBatches.batches.flatMap(batch => batch.records ?? [])
    .filter(record => record.slug && record.source?.url)
    .map(record => [record.slug, record.source.url]),
)
const currentFailedSlugs = captureManifest.captures
  .filter(capture => {
    if (capture.status !== 'failed') return false
    const currentSourceUrl = currentSourceBySlug.get(capture.slug)
    return !currentSourceUrl || currentSourceUrl === capture.sourceUrl
  })
  .map(capture => capture.slug)
assert(currentFailedSlugs.every(slug => plansBySlug.has(slug)), 'every current failed source must have a resolution plan before manual review')

console.log(`catalog manual capture check passed: ${resolutionPlan.plans.length} source-resolution plans require exact URL binding, hashing, and review blocking`)
