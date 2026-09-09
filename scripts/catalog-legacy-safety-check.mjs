import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const publishedPath = path.join(root, 'src', 'lib', 'opportunities', 'published.ts')
const apiPath = path.join(root, 'src', 'app', 'api', 'opportunities', 'route.ts')
const pagePath = path.join(root, 'src', 'app', '(dashboard)', 'dashboard', 'schemes', 'page.tsx')
const compliancePath = path.join(root, 'src', 'app', '(dashboard)', 'dashboard', 'compliance', 'page.tsx')
const complianceDataPath = path.join(root, 'src', 'lib', 'data', 'compliance-roadmap.ts')
const matcherPath = path.join(root, 'src', 'lib', 'opportunities', 'matcher.ts')
const registrationTypesPath = path.join(root, 'src', 'lib', 'data', 'registration-types.ts')
const envExamplePath = path.join(root, '.env.example')
const runtimeSmokePath = path.join(root, 'scripts', 'catalog-public-runtime-smoke.mjs')

function walk(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true })
  return entries.flatMap((entry) => {
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) return walk(absolute)
    return /\.(ts|tsx)$/.test(entry.name) ? [absolute] : []
  })
}

function read(file) {
  if (!fs.existsSync(file)) throw new Error(`legacy safety check failed: missing ${path.relative(root, file)}`)
  return fs.readFileSync(file, 'utf8')
}

const published = read(publishedPath)
const api = read(apiPath)
const page = read(pagePath)
const compliance = read(compliancePath)
const complianceData = read(complianceDataPath)
const matcher = read(matcherPath)
const registrationTypes = read(registrationTypesPath)
const envExample = read(envExamplePath)
const runtimeSmoke = read(runtimeSmokePath)
const userFacingStaticSchemeImports = walk(path.join(root, 'src', 'app'))
  .filter((file) => fs.readFileSync(file, 'utf8').includes("from '@/lib/data/schemes'"))

const assertions = [
  [published.includes("process.env.NODE_ENV !== 'production'"), 'legacy fallback is not production-gated'],
  [published.includes("process.env.NEXT_PUBLIC_SHOW_LEGACY_DRAFT_CATALOG === 'true'"), 'legacy fallback is not explicit-flag-gated'],
  [published.includes("await import('./catalog')"), 'legacy catalog is eagerly imported into the published path'],
  [api.includes("result.availability === 'unavailable' ? 503 : 200"), 'unavailable catalog does not return a retryable 503'],
  [page.includes("import { CATEGORY_LABELS, BENEFIT_TYPE_LABELS } from '@/lib/opportunities/taxonomy'"), 'client opportunity page still imports the legacy scheme data module'],
  [!page.includes("from '@/lib/data/schemes'"), 'client opportunity page still imports legacy scheme data'],
  [page.includes("if (catalogSource !== 'database')"), 'client action guards do not require a published database catalog'],
  [compliance.includes('Review-gated preparation tracker') && compliance.includes('not a legal determination'), 'compliance screen does not disclose its review-gated preparation status'],
  [complianceData.includes("from './national-registration-journeys'") && complianceData.includes('Preparation-only compliance tracker'), 'compliance roadmap is not derived from review-gated registration journeys'],
  [!compliance.includes('Monthly GST Calendar') && !compliance.includes('Key Annual Deadlines'), 'compliance screen still contains hard-coded filing deadlines'],
  [!complianceData.includes('3,000+') && !complianceData.includes('22% flat corporate tax'), 'compliance roadmap still contains unsupported static entitlement or tax claims'],
  [matcher.includes('fail-closed') && !matcher.includes("from '@/lib/data/schemes'"), 'legacy synchronous matcher can still consume static schemes'],
  [registrationTypes.includes('Orientation only') && registrationTypes.includes('officialSource'), 'entity orientation data is not explicitly marked as orientation-only and source-linked'],
  [!registrationTypes.includes('22% flat corporate tax') && !registrationTypes.includes('zero cost') && !registrationTypes.includes('3 years tax-free'), 'entity orientation still contains unsupported fixed tax or fee claims'],
  [userFacingStaticSchemeImports.length === 0, `user-facing route imports the static scheme dataset: ${userFacingStaticSchemeImports.map((file) => path.relative(root, file)).join(', ')}`],
  [!compliance.includes("'Mostly compliant'") && !compliance.includes("'Fully compliant'"), 'compliance screen presents a static checklist as a verified compliance determination'],
  [envExample.includes('NEXT_PUBLIC_SHOW_LEGACY_DRAFT_CATALOG=false'), 'shared environment example enables legacy drafts'],
  [runtimeSmoke.includes("source === 'legacy_draft'") && runtimeSmoke.includes('no eligibility'), 'runtime smoke does not enforce the unavailable/publication boundary'],
]

const failures = assertions.filter(([pass]) => !pass).map(([, message]) => message)
if (failures.length > 0) throw new Error(`legacy safety check failed: ${failures.join('; ')}`)

console.log('catalog legacy safety check passed: static drafts are isolated behind an explicit development fallback and published opportunity actions require database records')
