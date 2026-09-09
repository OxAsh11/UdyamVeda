const baseArgumentIndex = process.argv.indexOf('--base-url')
const baseUrl = (baseArgumentIndex >= 0 ? process.argv[baseArgumentIndex + 1] : null) ?? process.env.CATALOG_BASE_URL ?? 'http://localhost:3010'

function fail(message) {
  throw new Error(`catalog public runtime smoke failed: ${message}`)
}

function endpoint(pathname) {
  return new URL(pathname, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`).toString()
}

async function readResponse(response) {
  const text = await response.text()
  try {
    return text ? JSON.parse(text) : {}
  } catch {
    return { raw: text }
  }
}

const pageResponse = await fetch(endpoint('/dashboard/schemes'), { cache: 'no-store' })
if (!pageResponse.ok) fail(`/dashboard/schemes returned HTTP ${pageResponse.status}`)

const catalogResponse = await fetch(endpoint('/api/opportunities?limit=5'), { cache: 'no-store' })
const catalog = await readResponse(catalogResponse)
const source = catalog?.meta?.source
const allowedSources = new Set(['database', 'empty_unpublished', 'unavailable'])
if (!allowedSources.has(source)) fail(`unexpected catalog source: ${String(source)}`)
if (source === 'legacy_draft') fail('legacy draft catalog reached the public runtime')
if (!Array.isArray(catalog.data)) fail('opportunity response does not contain a data array')

if (source === 'unavailable') {
  if (catalogResponse.status !== 503) fail(`unavailable catalog must return HTTP 503, got ${catalogResponse.status}`)
  if (catalog.data.length !== 0) fail('unavailable catalog returned records')
  if (catalog.meta?.retryable !== true) fail('unavailable catalog must be marked retryable')
  if (!String(catalog.meta?.verification ?? '').toLowerCase().includes('no eligibility')) {
    fail('unavailable catalog must state that no eligibility result is being inferred')
  }
} else {
  if (catalogResponse.status !== 200) fail(`published or empty catalog must return HTTP 200, got ${catalogResponse.status}`)
  if (source === 'empty_unpublished' && catalog.data.length !== 0) fail('empty_unpublished catalog returned records')
  if (source === 'database' && catalog.data.some(item => !item?.verificationStatus || !item?.lastVerifiedAt)) {
    fail('database catalog records must expose verification metadata')
  }
}

const searchResponse = await fetch(endpoint('/api/opportunities?q=MSME&type=grant&coverage=central&limit=5'), { cache: 'no-store' })
const searchedCatalog = await readResponse(searchResponse)
const searchSource = searchedCatalog?.meta?.source
if (!allowedSources.has(searchSource)) fail(`unexpected searched catalog source: ${String(searchSource)}`)
if (searchSource === 'legacy_draft') fail('legacy draft catalog reached the public search runtime')
if (!Array.isArray(searchedCatalog.data)) fail('searched opportunity response does not contain a data array')
if (searchSource === 'unavailable') {
  if (searchResponse.status !== 503) fail(`searched unavailable catalog must return HTTP 503, got ${searchResponse.status}`)
  if (searchedCatalog.data.length !== 0) fail('searched unavailable catalog returned records')
} else if (searchResponse.status !== 200) {
  fail(`searched published or empty catalog must return HTTP 200, got ${searchResponse.status}`)
}

console.log(JSON.stringify({
  baseUrl,
  dashboardStatus: pageResponse.status,
  catalogStatus: catalogResponse.status,
  source,
  count: catalog.data.length,
  searchStatus: searchResponse.status,
  searchSource,
  searchCount: searchedCatalog.data.length,
  legacyDraftExposed: source === 'legacy_draft',
}, null, 2))
console.log('catalog public runtime smoke passed: dashboard loads and public opportunities respect the published-catalog boundary')
