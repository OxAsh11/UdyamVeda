import fs from 'node:fs'

const proxy = fs.readFileSync(new URL('../src/proxy.ts', import.meta.url), 'utf8')
const reviewer = fs.readFileSync(new URL('../src/lib/catalog/reviewer.ts', import.meta.url), 'utf8')
const login = fs.readFileSync(new URL('../src/app/(auth)/login/page.tsx', import.meta.url), 'utf8')

const assertions = [
  [proxy.includes("const isAdminPage = pathname === '/admin' || pathname.startsWith('/admin/')"), 'proxy must classify every admin page route'],
  [proxy.includes("if (!AUTH_REQUIRED && !isAdminPage)"), 'public preview must not bypass the admin page boundary'],
  [proxy.includes("if (isAdminPage && !user)"), 'anonymous admin page requests must be redirected'],
  [proxy.includes("loginUrl.searchParams.set('next', pathname)"), 'admin redirects must preserve the requested path'],
  [reviewer.includes(".from('catalog_reviewers')"), 'reviewer APIs must check catalog reviewer membership'],
  [reviewer.includes(".eq('active', true)"), 'reviewer membership must require an active reviewer row'],
  [login.includes("new URLSearchParams(window.location.search).get('next')"), 'sign-in must read the preserved reviewer return path'],
  [login.includes("!requestedPath.startsWith('//')"), 'sign-in return paths must reject external protocol-relative redirects'],
  [login.includes('router.replace(safePath)'), 'sign-in must return to the safe requested path'],
]

const failures = assertions.filter(([passed]) => !passed).map(([, message]) => message)
if (failures.length) throw new Error('catalog admin boundary check failed: ' + failures.join('; '))

console.log('catalog admin boundary check passed: public preview excludes reviewer pages and reviewer APIs require active membership')
