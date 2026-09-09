import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

function loadTsModule(relativePath) {
  const sourcePath = path.join(process.cwd(), relativePath)
  const source = fs.readFileSync(sourcePath, 'utf8')
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const loadedModule = { exports: {} }
  new Function('exports', 'module', compiled)(loadedModule.exports, loadedModule)
  return loadedModule.exports
}

const { evaluateEligibilityRules } = loadTsModule('src/lib/opportunities/rules.ts')
const { statusFor, urgencyFor, freshnessScore, effortFor, scoreRecommendation } = loadTsModule('src/lib/opportunities/recommendation-ranking.ts')
const { isOfficialSourceUrl, isPrimaryOfficialSource, publicationStatusForWindows, validatePublicationRecord } = loadTsModule('src/lib/opportunities/editorial.ts')
const { parseAuthorityDirectory } = loadTsModule('src/lib/ingest/authority-directory.ts')
const { profileFromBusinessFacts, profileCompleteness } = loadTsModule('src/lib/businesses/profile.ts')
const releaseChecks = fs.readFileSync(path.join(process.cwd(), 'supabase/tests/catalog_release_checks.sql'), 'utf8')
const authorityStatusMigration = fs.readFileSync(path.join(process.cwd(), 'supabase/migrations/20260906380000_authority_assessment_status.sql'), 'utf8')
const authorityInvariantMigration = fs.readFileSync(path.join(process.cwd(), 'supabase/migrations/20260907120000_authority_assessment_invariants.sql'), 'utf8')
const coverageRoute = fs.readFileSync(path.join(process.cwd(), 'src/app/api/admin/catalog/coverage/route.ts'), 'utf8')
const ingestionFunctions = fs.readFileSync(path.join(process.cwd(), 'src/lib/ingest/functions.ts'), 'utf8')
const opportunityCompat = fs.readFileSync(path.join(process.cwd(), 'src/lib/opportunities/compat.ts'), 'utf8')
const schemeLabels = fs.readFileSync(path.join(process.cwd(), 'src/lib/data/schemes.ts'), 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const pmfmeRules = {
  all: [
    { field: 'sector', operator: 'equals', value: 'food_processing' },
    { field: 'enterprise_status', operator: 'equals', value: 'micro' },
    { field: 'is_existing_unit_in_operation', operator: 'equals', value: true },
    { field: 'employees', operator: 'less_than', value: 10 },
  ],
  unknown_handling: 'needs_information',
}

const eligible = evaluateEligibilityRules(pmfmeRules, {
  sector: 'food_processing',
  enterprise_status: 'micro',
  is_existing_unit_in_operation: true,
  employees: 4,
})
assert(eligible.result === true, 'eligible case should pass')

const ineligible = evaluateEligibilityRules(pmfmeRules, {
  sector: 'food_processing',
  enterprise_status: 'micro',
  is_existing_unit_in_operation: true,
  employees: 12,
})
assert(ineligible.result === false && ineligible.blockers.length > 0, 'boundary ineligible case should fail with a blocker')

const missing = evaluateEligibilityRules(pmfmeRules, {
  sector: 'food_processing',
  enterprise_status: 'micro',
  is_existing_unit_in_operation: true,
})
assert(missing.result === null && missing.missingFacts.includes('employees'), 'missing information must not silently disqualify the business')

const contradictory = evaluateEligibilityRules({
  all: [
    { field: 'has_udyam', operator: 'equals', value: true },
    { field: 'has_udyam', operator: 'equals', value: false },
  ],
  unknown_handling: 'needs_information',
}, { has_udyam: true })
assert(contradictory.result === false, 'contradictory rules should fail closed through the explicit blocker')

const failClosed = evaluateEligibilityRules({
  all: [{ field: 'state', operator: 'equals', value: 'Madhya Pradesh' }],
  unknown_handling: 'fail_closed',
}, {})
assert(failClosed.result === false && failClosed.blockers.length > 0, 'fail_closed must turn missing facts into a blocker')

assert(isPrimaryOfficialSource({
  source_url: 'https://example.gov.in/guideline.pdf',
  source_kind: 'guideline',
  source_anchor: 'Page 4, section 2.1',
  is_primary: true,
}), 'anchored official source should satisfy the publication provenance gate')
assert(!isPrimaryOfficialSource({
  source_url: 'https://example.gov.in/guideline.pdf',
  source_kind: 'guideline',
  source_anchor: '',
  is_primary: true,
}), 'official source without an anchor must fail the publication provenance gate')
assert(isOfficialSourceUrl('https://www.cgtmse.in/Home/VS/95'), 'allowlisted implementing-agency portal should pass the official host gate')
assert(isOfficialSourceUrl('https://www.ncgtc.in/en/product-details/CGSS/Credit-Guarantee-Scheme-for-Start-ups-(CGSS)'), 'allowlisted NCGTC portal should pass the official host gate')
assert(isOfficialSourceUrl('https://www.jansamarth.in/'), 'allowlisted Jan Samarth portal should pass the official host gate')
assert(isOfficialSourceUrl('https://vcfapplication.sidbi.in/login'), 'allowlisted SIDBI application portal should pass the official host gate')
assert(isOfficialSourceUrl('https://nlm.udyamimitra.in/'), 'allowlisted Udyamimitra NLM portal should pass the official host gate')
assert(isOfficialSourceUrl('https://pliauto.in/'), 'allowlisted PLI-Auto portal should pass the official host gate')
assert(isOfficialSourceUrl('https://mstcecommerce.com/auctionhome/coalgasnew/index.jsp'), 'allowlisted MSTC coal-gasification portal should pass the official host gate')
assert(isOfficialSourceUrl('https://nivedi.res.in/NaaViC/wp-content/themes/naavic/pdf/RKVY-RAFTAAR_Ent.pdf'), 'allowlisted ICAR institute guideline host should pass the official host gate')
assert(isOfficialSourceUrl('https://bam.eil.co.in/'), 'allowlisted EIL BAM portal should pass the official host gate')
assert(isOfficialSourceUrl('https://sezonline-ndml.co.in/'), 'allowlisted SEZ Online portal should pass the official host gate')
assert(isOfficialSourceUrl('https://plidrone.ifciltd.com/'), 'allowlisted IFCI drone PLI portal should pass the official host gate')
assert(!isOfficialSourceUrl('https://example.com/government-scheme-summary'), 'third-party HTTPS source must fail the official host gate')
assert(publicationStatusForWindows([{ window_type: 'fixed', opens_at: '2030-01-01T00:00:00Z' }], new Date('2029-01-01T00:00:00Z')) === 'upcoming', 'future window should be upcoming')
assert(publicationStatusForWindows([{ window_type: 'fixed', closes_at: '2020-01-01T00:00:00Z' }], new Date('2029-01-01T00:00:00Z')) === 'closed', 'expired window should be closed')
assert(publicationStatusForWindows([{ window_type: 'rolling' }], new Date('2029-01-01T00:00:00Z')) === 'active', 'rolling window should be active')
const completePublicationDossier = {
  title: 'Example opportunity',
  objective: 'Support an eligible business.',
  eligibility: { all: [{ field: 'sector', operator: 'equals', value: 'manufacturing' }] },
  application: { portal: 'https://example.gov.in/apply' },
  fine_print: { exclusions: ['duplicate benefit'] },
  benefit_summary: { summary: 'Structured support' },
  completeness: 1,
  last_verified_at: '2026-09-06T00:00:00Z',
  benefits_count: 1,
  requirements_count: 1,
  steps_count: 1,
  windows_count: 1,
}
assert(validatePublicationRecord(completePublicationDossier).length === 0, 'complete publication dossier should pass')
const incompletePublicationErrors = validatePublicationRecord({ ...completePublicationDossier, fine_print: {}, benefits_count: 0, windows_count: 0 })
assert(incompletePublicationErrors.some(error => error.includes('fine_print')), 'publication gate should require fine print')
assert(incompletePublicationErrors.some(error => error.includes('structured benefit')), 'publication gate should require structured benefits')
assert(incompletePublicationErrors.some(error => error.includes('window')), 'publication gate should require a window or rolling record')

const ministryDirectory = parseAuthorityDirectory([
  '## Ministries',
  '[Ministry of Example](https://example.gov.in/ministry)',
  '[Ministry of Example](https://example.gov.in/ministry)',
  '[Ministry without a linked detail page]',
  '[Details]',
  '## Departments',
  '[Department that must not leak into the ministry parse](https://example.gov.in/department)',
].join('\n'), 'https://igod.gov.in/ug/E002/organizations')
assert(ministryDirectory.authorityLevel === 'ministry', 'ministry directory should identify its authority level')
assert(ministryDirectory.records.length === 2, 'ministry parser should deduplicate records and retain an unlinked authority for review')
assert(ministryDirectory.records[0].authorityUrl === 'https://example.gov.in/ministry', 'ministry parser should preserve official links')
assert(ministryDirectory.records[1].authorityName === 'Ministry without a linked detail page', 'ministry parser should clean unlinked markdown labels')
assert(ministryDirectory.warnings.some(warning => warning.includes('no linked official URL')), 'unlinked ministry should produce a review warning')

const departmentDirectory = parseAuthorityDirectory([
  '## Departments',
  '[Department of Example](https://example.gov.in/department)',
  'Input',
  '## Other links',
  '[This must be excluded](https://example.gov.in/other)',
].join('\n'), 'https://igod.gov.in/ug/E003/organizations')
assert(departmentDirectory.authorityLevel === 'department', 'department directory should identify its authority level')
assert(departmentDirectory.records.length === 1 && departmentDirectory.records[0].authorityName === 'Department of Example', 'department parser should stop at the next heading and ignore navigation noise')
const missingHeadingDirectory = parseAuthorityDirectory('[Ministry that must not be guessed](https://example.gov.in/not-a-directory)', 'https://igod.gov.in/ug/E002/organizations')
assert(missingHeadingDirectory.records.length === 0 && missingHeadingDirectory.warnings.some(warning => warning.includes('no records were extracted')), 'missing directory heading must fail closed without guessing records')

const profile = profileFromBusinessFacts(
  { name: 'Example Foods', lifecycle_stage: 'operating', sector: 'food_processing', state: 'Madhya Pradesh' },
  [
    { fact_key: 'employees', fact_value: { value: 4 }, verified_at: '2026-09-06T00:00:00Z' },
    { fact_key: 'has_udyam', fact_value: true },
    { fact_key: 'founder_type', fact_value: 'woman' },
  ],
)
assert(profile.business_name === 'Example Foods' && profile.employees === 4 && profile.has_udyam === true, 'business facts should normalize into recommendation facts')
assert(profile.sector === 'food_processing' && profile.state === 'Madhya Pradesh', 'business defaults should supplement fact records')
assert(profileCompleteness(profile) === 7, 'recommendation profile completeness should count only known facts')
assert(eligible.usedFacts.includes('sector') && eligible.usedFacts.includes('employees'), 'eligibility evaluation should report the facts it actually used')
assert(profile.verified_fact_keys.includes('employees'), 'profile normalization should preserve verified fact keys')
assert(statusFor(true, [], [], true) === 'eligible', 'true eligibility should produce eligible status')
assert(statusFor(null, ['turnover'], [], true) === 'likely', 'one missing fact without blockers should produce likely status')
assert(statusFor(null, ['turnover', 'employees'], [], true) === 'possible', 'multiple missing facts should produce possible status')
assert(statusFor(false, [], ['sector does not match'], true) === 'not_eligible', 'explicit rule failure should produce not eligible status')
assert(statusFor(null, ['reviewed eligibility rules'], [], false) === 'needs_information', 'missing reviewed rules should require more information')
assert(urgencyFor([{ windowType: 'fixed', opensAt: null, closesAt: '2026-09-10T00:00:00Z' }], new Date('2026-09-07T00:00:00Z')).urgency === 'urgent', 'deadline urgency should detect an imminent closing date')
assert(urgencyFor([{ windowType: 'rolling', opensAt: null, closesAt: null }], new Date('2026-09-07T00:00:00Z')).urgency === 'rolling', 'rolling opportunities should not be treated as deadline urgent')
assert(freshnessScore('2026-08-01T00:00:00Z', new Date('2026-09-07T00:00:00Z')) > freshnessScore('2026-01-01T00:00:00Z', new Date('2026-09-07T00:00:00Z')), 'freshness should reward recently verified sources')
assert(effortFor(1, 2).level === 'low' && effortFor(7, 2).level === 'high', 'effort should reflect official document and step burden')
assert(scoreRecommendation({ eligibilityConfidence: 1, urgency: 0.5, relevance: 0.5, freshness: 0.5, supportFit: 0.5, benefitToEffort: 0.5 }) > scoreRecommendation({ eligibilityConfidence: 0, urgency: 0.5, relevance: 0.5, freshness: 0.5, supportFit: 0.5, benefitToEffort: 0.5 }), 'eligibility confidence should influence ranking independently of secondary signals')
assert(releaseChecks.includes("assessment_status <> 'assessed'"), 'release checks must use the canonical assessed authority status')
assert(authorityStatusMigration.includes("assessment_status = 'assessed'"), 'authority status migration must normalize legacy complete rows')
assert(authorityInvariantMigration.includes("assessment_status = 'assessed'"), 'authority invariants must require terminal decisions to be assessed')
assert(authorityInvariantMigration.includes('assessment_note'), 'authority invariants must retain reviewer notes')
assert(coverageRoute.includes("body.businessRelevance === 'unclear' ? 'in_progress' : 'assessed'"), 'unclear authority decisions must remain unresolved')
assert(coverageRoute.includes('A review note is required when an authority remains unclear.'), 'unclear authority decisions must require a note')
assert(coverageRoute.includes('A review note describing the relevant source scope is required before an authority can be assessed.'), 'relevant authority decisions must require an evidence scope note')
assert(coverageRoute.includes('A verified HTTPS authority portal URL is required before marking this authority relevant.'), 'relevant authority decisions must require an official HTTPS URL')
assert(coverageRoute.includes("requestUrl.searchParams.get('format') === 'csv'"), 'authority coverage must support reviewer CSV export')
assert(coverageRoute.includes("text/csv; charset=utf-8"), 'authority coverage CSV export must return a CSV content type')
assert(authorityInvariantMigration.includes('authority_coverage_relevant_url'), 'database authority invariants must require an HTTPS URL for relevant authorities')
const authorityEvidenceNoteMigration = fs.readFileSync(path.join(process.cwd(), 'supabase/migrations/20260907400000_authority_assessment_evidence_note.sql'), 'utf8')
const authorityEvidenceSourceMigration = fs.readFileSync(path.join(process.cwd(), 'supabase/migrations/20260908350000_authority_assessment_source_registry.sql'), 'utf8')
assert(authorityEvidenceNoteMigration.includes('authority_coverage_assessed_relevant_note'), 'database authority invariants must require an evidence note for assessed relevant authorities')
assert(authorityEvidenceSourceMigration.includes('assessment_evidence_source_registry_id'), 'authority assessments must retain their registered source row')
assert(authorityEvidenceSourceMigration.includes('registered_url <> new.assessment_evidence_url'), 'authority assessment provenance must match the registered URL')
assert(releaseChecks.includes('assessment_evidence_source_registry_id'), 'release checks must inspect authority assessment source provenance')
assert(ingestionFunctions.includes('preserve existing authority assessments'), 'directory refresh must preserve prior authority assessments')
assert(ingestionFunctions.includes('Expected ${source.expected_item_count} authority rows'), 'directory refresh must surface inventory-count mismatches')
assert(opportunityCompat.includes("opportunity.type === 'equity_investment'"), 'equity opportunities must remain distinct in the legacy compatibility mapping')
assert(schemeLabels.includes("equity: 'Equity investment'"), 'equity opportunities must have a distinct user-facing benefit label')

console.log('catalog rules check passed: eligibility, provenance, publication-window, authority-directory, and profile cases')
