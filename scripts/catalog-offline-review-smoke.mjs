const baseArgumentIndex = process.argv.indexOf('--base-url')
const baseUrl = (baseArgumentIndex >= 0 ? process.argv[baseArgumentIndex + 1] : null) ?? process.env.CATALOG_BASE_URL ?? 'http://localhost:3010'
const authenticated = process.argv.includes('--authenticated')

function fail(message) {
  throw new Error(`catalog offline review smoke failed: ${message}`)
}

const endpoint = new URL('/admin/catalog/offline-review', baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`)
let response

try {
  response = await fetch(endpoint, {
    cache: 'no-store',
    redirect: 'manual',
    headers: process.env.CATALOG_REVIEW_COOKIE ? { cookie: process.env.CATALOG_REVIEW_COOKIE } : undefined,
  })
} catch (error) {
  fail(`could not reach ${endpoint}: ${error instanceof Error ? error.message : String(error)}`)
}

const html = await response.text()
const location = response.headers.get('location')
const loginRedirect = location?.startsWith('/login?next=%2Fadmin%2Fcatalog%2Foffline-review')

if (!authenticated && loginRedirect) {
  console.log(JSON.stringify({
    baseUrl,
    status: response.status,
    route: '/admin/catalog/offline-review',
    protected: true,
    redirect: location,
  }, null, 2))
  console.log('catalog offline review smoke passed: unauthenticated reviewer access is redirected to sign-in without exposing the review pack')
  process.exit(0)
}

if (html.includes('"children":"Page not found"') || html.includes('Page not found')) {
  fail(`/admin/catalog/offline-review resolved to the application's 404 page; use a development server for the dev-only review surface`)
}
if (!response.ok) {
  fail(`/admin/catalog/offline-review returned HTTP ${response.status}`)
}
if (!authenticated) {
  fail(`expected an unauthenticated request to redirect to /login, received HTTP ${response.status}; use --authenticated only with a reviewer session`)
}
if (!process.env.CATALOG_REVIEW_COOKIE) {
  fail('--authenticated requires CATALOG_REVIEW_COOKIE; the cookie is never printed or stored by this check')
}

const requiredMarkers = [
  'Offline catalog review pack',
  'Local editorial tooling',
  'Publication-ready',
  'AcE Fund',
]
const missingMarkers = requiredMarkers.filter(marker => !html.includes(marker))
if (missingMarkers.length) fail(`review surface is missing generated-pack markers: ${missingMarkers.join(', ')}`)

console.log(JSON.stringify({
  baseUrl,
  status: response.status,
  route: '/admin/catalog/offline-review',
  protected: true,
  authenticatedContent: true,
  generatedPackMarkers: requiredMarkers,
}, null, 2))
console.log('catalog offline review smoke passed: authenticated reviewer surface renders generated catalog content and remains a read-only dev tool')
