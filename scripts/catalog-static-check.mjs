import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migrationsDir = path.join(root, 'supabase', 'migrations')
const seedsDir = path.join(root, 'supabase', 'seed')
const releaseChecksPath = path.join(root, 'supabase', 'tests', 'catalog_release_checks.sql')
const supabaseConfigPath = path.join(root, 'supabase', 'config.toml')
const remoteRunnerPath = path.join(root, 'scripts', 'apply-catalog-remote.ps1')
const remoteRunnerWindowsWrapperPath = path.join(root, 'scripts', 'apply-catalog-remote.cmd')
const reviewerBootstrapPath = path.join(root, 'scripts', 'bootstrap-catalog-reviewer.ps1')
const reviewerBootstrapWindowsWrapperPath = path.join(root, 'scripts', 'bootstrap-catalog-reviewer.cmd')
const batch5JsonCheckPath = path.join(root, 'scripts', 'catalog-seed-json-check.mjs')
const seedAuditPath = path.join(root, 'scripts', 'catalog-seed-audit.mjs')
const sourceRegistryAuditPath = path.join(root, 'scripts', 'catalog-source-registry-audit.mjs')
const legacyAuditPath = path.join(root, 'scripts', 'catalog-legacy-audit.mjs')
const gateCheckPath = path.join(root, 'scripts', 'catalog-gate-check.mjs')
const draftsCheckPath = path.join(root, 'scripts', 'catalog-drafts-check.mjs')
const reviewCheckPath = path.join(root, 'scripts', 'catalog-review-check.mjs')
const publishedCatalogPath = path.join(root, 'src', 'lib', 'opportunities', 'published.ts')
const sourceRegistryLinkMigrationPath = path.join(root, 'supabase', 'migrations', '20260906400000_opportunity_source_registry_link.sql')
const provenanceCheckPath = path.join(root, 'scripts', 'catalog-provenance-check.mjs')
const ingestionCheckPath = path.join(root, 'scripts', 'catalog-ingestion-check.mjs')
const changeCheckPath = path.join(root, 'scripts', 'catalog-change-check.mjs')
const evidenceImmutabilityMigrationPath = path.join(root, 'supabase', 'migrations', '20260906420000_catalog_evidence_immutability.sql')
const discoveryCheckPath = path.join(root, 'scripts', 'catalog-discovery-check.mjs')
const authorityStatusMigrationPath = path.join(root, 'supabase', 'migrations', '20260906380000_authority_assessment_status.sql')
const publicationInvariantMigrationPath = path.join(root, 'supabase', 'migrations', '20260906430000_catalog_publication_invariants.sql')
const searchCheckPath = path.join(root, 'scripts', 'catalog-search-check.mjs')
const registrationCheckPath = path.join(root, 'scripts', 'catalog-registrations-check.mjs')
const sourceLocatorMigrationPath = path.join(root, 'supabase', 'migrations', '20260907080000_catalog_source_locators.sql')
const incorporationFoodCheckPath = path.join(root, 'scripts', 'catalog-incorporation-food-check.mjs')
const iecTaxCheckPath = path.join(root, 'scripts', 'catalog-iec-tax-check.mjs')
const socialSecurityCheckPath = path.join(root, 'scripts', 'catalog-social-security-check.mjs')
const localGatePath = path.join(root, 'scripts', 'catalog-local-gate.mjs')
const currentSourceGapsPath = path.join(root, 'scripts', 'catalog-current-source-gaps.mjs')
const authorityInvariantMigrationPath = path.join(root, 'supabase', 'migrations', '20260907120000_authority_assessment_invariants.sql')
const operationsDocPath = path.join(root, 'docs', 'catalog-operations.md')
const authorityBaselinePath = path.join(root, 'docs', 'igod-coverage-baseline.json')
const authorityBaselineCheckPath = path.join(root, 'scripts', 'catalog-authority-baseline-check.mjs')
const crosswalkCandidateCheckPath = path.join(root, 'scripts', 'catalog-crosswalk-candidate-check.mjs')
const authoritySeedPath = path.join(root, 'supabase', 'seed', 'authority_directory_baseline.sql')
const authoritySeedCheckPath = path.join(root, 'scripts', 'catalog-authority-seed-check.mjs')
const cgssAuditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-07-cgss-source-audit.md')

function fail(message) {
  console.error(`catalog check failed: ${message}`)
  process.exitCode = 1
}

function readSql(directory, file) {
  return fs.readFileSync(path.join(directory, file), 'utf8')
}

const migrations = fs.readdirSync(migrationsDir)
  .filter(file => file.endsWith('.sql'))
  .sort()

if (migrations.length === 0) fail('no migration files found')
const migrationVersions = migrations.map(file => file.split('_')[0])
if (new Set(migrationVersions).size !== migrationVersions.length) fail('duplicate migration version identifiers')
if (migrations.some((file, index) => index > 0 && file <= migrations[index - 1])) {
  fail('migration filenames are not strictly ordered')
}

const requiredMigrations = [
  '20260906120000_udyamveda_foundation.sql',
  '20260906150000_catalog_source_registry.sql',
  '20260906170000_catalog_review_access.sql',
  '20260906290000_catalog_search.sql',
  '20260906300000_lifecycle_rls_hardening.sql',
  '20260907060000_catalog_registration_sources.sql',
  '20260907070000_catalog_compliance_benefit_type.sql',
  '20260907080000_catalog_source_locators.sql',
  '20260907090000_catalog_incorporation_food_sources.sql',
  '20260907100000_catalog_iec_tax_identity_sources.sql',
  '20260907110000_catalog_social_security_sources.sql',
  '20260907120000_authority_assessment_invariants.sql',
  '20260907190000_catalog_audit_sample_items.sql',
  '20260907200000_application_task_controls.sql',
  '20260907210000_application_reminders.sql',
  '20260907220000_catalog_cgss_current_evidence.sql',
  '20260907230000_catalog_fof2_current_evidence.sql',
  '20260907240000_catalog_svanidhi_current_evidence.sql',
  '20260907250000_catalog_udyam_current_evidence.sql',
  '20260907260000_catalog_gst_current_evidence.sql',
  '20260907270000_catalog_dpiit_recognition_current_evidence.sql',
  '20260907280000_catalog_spice_plus_current_evidence.sql',
  '20260907290000_catalog_fssai_current_evidence.sql',
  '20260907300000_catalog_iec_tax_current_evidence.sql',
  '20260907310000_catalog_social_security_current_evidence.sql',
  '20260907320000_catalog_pmegp_current_evidence.sql',
  '20260907330000_catalog_credit_current_evidence.sql',
  '20260907340000_catalog_standup_zed_pmfme_current_evidence.sql',
  '20260908350000_authority_assessment_source_registry.sql',
  '20260909030000_catalog_snapshot_provenance.sql',
  '20260909040000_catalog_manual_evidence_capture.sql',
]
for (const file of requiredMigrations) {
  if (!migrations.includes(file)) fail(`required migration is missing: ${file}`)
}

const seeds = fs.readdirSync(seedsDir)
  .filter(file => file.endsWith('.sql'))
  .sort()

if (seeds.length === 0) fail('no seed files found')

for (const file of seeds) {
  const sql = readSql(seedsDir, file)
  const lower = sql.toLowerCase()
  if (file === 'authority_directory_baseline.sql' || file === 'zz_authority_relationship_candidates.sql' || file === 'zz_catalog_source_resolution_alternates.sql' || file === 'zz_catalog_source_resolution_plan_context.sql') continue
  if (!lower.includes('https://')) fail(`${file} has no official HTTPS source`) 
  if (!lower.includes("'in_review'")) fail(`${file} contains no in_review seed status`)
  if (!lower.includes('review_tasks')) fail(`${file} does not create a review task`)
  if (!lower.includes('opportunity_sources')) fail(`${file} does not attach opportunity provenance`)
  if (lower.includes("review_status)\n  select") && !lower.includes("'in_review'")) {
    fail(`${file} has a review status insert without in_review`) 
  }
  const directOpportunitySourceKinds = [...sql.matchAll(/select\s+(?:v_version_id|version_id)\s*,\s*'https:\/\/[^']+'\s*,\s*'([^']+)'/gi)]
    .map(match => match[1])
  const allowedOpportunitySourceKinds = new Set(['gazette', 'guideline', 'ministry', 'agency', 'myscheme', 'startup_india', 'pib', 'reference_playbook', 'other'])
  const invalidOpportunitySourceKinds = [...new Set(directOpportunitySourceKinds.filter(kind => !allowedOpportunitySourceKinds.has(kind)))]
  if (invalidOpportunitySourceKinds.length) fail(`${file} contains invalid opportunity source kinds: ${invalidOpportunitySourceKinds.join(', ')}`)
}

const batch3 = readSql(seedsDir, 'verified_central_batch_3.sql')
for (const slug of [
  'pm-formalisation-micro-food-processing-enterprises',
  'msme-samadhaan-delayed-payment-assistance',
]) {
  if (!batch3.includes(`'${slug}'`)) fail(`batch 3 is missing ${slug}`)
}
const batch3RuleSets = batch3.match(/\(opportunity_version_id, rules, source_evidence, reviewed\)/g) ?? []
const batch3UnreviewedRules = batch3.match(/\n\s+false\n\s+where not exists/g) ?? []
const batch3StructuredRecordCount = batch3.match(/\"rules\"\s*:/g)?.length ?? 0
const batch3StructuredRuleInsert = batch3.includes("select version_id, item->'rules', jsonb_build_array(jsonb_build_object('source_url', item->>'source_url', 'anchor', item->>'source_anchor')), false")
if (batch3StructuredRecordCount === 2) {
  if (!batch3StructuredRuleInsert) fail('batch 3 structured records do not explicitly insert both eligibility rule sets as unreviewed')
} else if (batch3RuleSets.length !== 2 || batch3UnreviewedRules.length < 2) {
  fail('batch 3 does not explicitly leave both eligibility rule sets unreviewed')
}
if (batch3.includes("review_status\n    select")) fail('batch 3 has malformed review_status syntax')

const batch4 = readSql(seedsDir, 'verified_central_batch_4.sql')
for (const slug of [
  'procurement-and-marketing-support-pms',
  'msme-international-cooperation-scheme',
]) {
  if (!batch4.includes(`'${slug}'`)) fail(`batch 4 is missing ${slug}`)
}
const batch4RuleSets = batch4.match(/\(opportunity_version_id, rules, source_evidence, reviewed\)/g) ?? []
const batch4UnreviewedRules = batch4.match(/\n\s+false\n\s+where not exists/g) ?? []
const batch4StructuredRecordCount = batch4.match(/\"rules\"\s*:/g)?.length ?? 0
const batch4StructuredRuleInsert = batch4.includes("select version_id, item->'rules', jsonb_build_array(jsonb_build_object('source_url', item->>'source_url', 'anchor', item->>'source_anchor')), false")
if (batch4StructuredRecordCount >= 2) {
  if (!batch4StructuredRuleInsert) fail('batch 4 structured records do not explicitly insert both eligibility rule sets as unreviewed')
} else if (batch4RuleSets.length !== 2 || batch4UnreviewedRules.length < 2) {
  fail('batch 4 does not explicitly leave both eligibility rule sets unreviewed')
}

const batch5 = readSql(seedsDir, 'verified_central_batch_5.sql')
for (const slug of [
  'msme-innovative-incubation-design-ipr',
  'scheme-for-fund-for-regeneration-of-traditional-industries-sfurti',
  'national-scheduled-caste-scheduled-tribe-hub',
  'special-credit-linked-capital-subsidy-scheme-sclcss',
  'aspire-innovation-rural-industry-entrepreneurship',
]) {
  if (!batch5.includes(`\"slug\":\"${slug}\"`)) fail(`batch 5 is missing ${slug}`)
}
if ((batch5.match(/\"review_note\"/g) ?? []).length !== 5) {
  fail('batch 5 does not keep all five records explicitly review-gated')
}

if (!fs.existsSync(releaseChecksPath)) fail('catalog release checks are missing')
else {
  const releaseChecks = fs.readFileSync(releaseChecksPath, 'utf8')
  for (const requiredAssertion of [
    'relrowsecurity = true',
    "published opportunities are public",
    "review_status = 'approved'",
    'unresolved_active_or_upcoming_discoveries',
    "'authority_coverage'",
    "'catalog_audits'",
    'Application status-event actor policy is not hardened',
    'Application document-link tenant policy is not hardened',
    'Application task ownership or dependency columns are missing',
    'Application task status-event policy is missing',
    'Catalog audit sample read policy is missing',
    'Catalog audit sample insert policy is missing',
    'Catalog accuracy audit function is not executable by authenticated reviewers',
    'Private business-documents storage bucket is missing or public',
    'Storage object RLS is not enabled',
    'business members can upload document objects',
    "event_type in ('initial', 'changed')",
    'Source snapshot immutability trigger is missing',
    'Change-event immutability trigger is missing',
    'Approved opportunity version has no reviewed eligibility rule set',
    'Approved opportunity version has no registered primary official source',
    's.page_number',
  ]) {
    if (!releaseChecks.includes(requiredAssertion)) fail(`release checks are missing: ${requiredAssertion}`)
  }
}

if (!fs.existsSync(supabaseConfigPath)) fail('supabase/config.toml is missing')
else if (!fs.readFileSync(supabaseConfigPath, 'utf8').includes('sql_paths = ["./seed/*.sql"]')) fail('Supabase config does not include the ordered seed glob')

if (!fs.existsSync(remoteRunnerPath)) fail('remote catalog runner is missing')
else {
  const remoteRunner = fs.readFileSync(remoteRunnerPath, 'utf8')
  const hasMigrationCommand = remoteRunner.includes('supabase db push') || remoteRunner.includes("'db', 'push'")
  const hasLinkedQueryCommand = remoteRunner.includes('supabase db query --linked') || remoteRunner.includes("'db', 'query', '--linked'")
  if (!hasMigrationCommand || !hasLinkedQueryCommand) {
    fail('remote catalog runner is missing migration or linked-query execution')
  }
}
if (!fs.existsSync(remoteRunnerWindowsWrapperPath)) fail('Windows remote catalog runner wrapper is missing')
else if (!fs.readFileSync(remoteRunnerWindowsWrapperPath, 'utf8').includes('ExecutionPolicy Bypass')) fail('Windows remote catalog runner wrapper must use a process-scoped execution-policy bypass')
if (!fs.existsSync(reviewerBootstrapPath)) fail('catalog reviewer bootstrap script is missing')
else {
  const reviewerBootstrap = fs.readFileSync(reviewerBootstrapPath, 'utf8')
  for (const requiredText of ['catalog_reviewers', 'on conflict', 'projects', 'db', 'query', 'New-TemporaryFile']) {
    if (!reviewerBootstrap.toLowerCase().includes(requiredText.toLowerCase())) fail(`catalog reviewer bootstrap is missing ${requiredText}`)
  }
}
if (!fs.existsSync(reviewerBootstrapWindowsWrapperPath)) fail('Windows catalog reviewer bootstrap wrapper is missing')
else if (!fs.readFileSync(reviewerBootstrapWindowsWrapperPath, 'utf8').includes('ExecutionPolicy Bypass')) fail('Windows catalog reviewer bootstrap wrapper must use a process-scoped execution-policy bypass')

if (!fs.existsSync(batch5JsonCheckPath)) fail('batch 5 JSON validation script is missing')
if (!fs.existsSync(seedAuditPath)) fail('catalog seed audit script is missing')
if (!fs.existsSync(sourceRegistryAuditPath)) fail('catalog source registry audit script is missing')
if (!fs.existsSync(legacyAuditPath)) fail('legacy catalog audit script is missing')
if (!fs.existsSync(gateCheckPath)) fail('catalog gate validation script is missing')
if (!fs.existsSync(draftsCheckPath)) fail('catalog drafts validation script is missing')
if (!fs.existsSync(reviewCheckPath)) fail('catalog review validation script is missing')
if (!fs.existsSync(publishedCatalogPath)) fail('published catalog boundary module is missing')
else {
  const publishedCatalog = fs.readFileSync(publishedCatalogPath, 'utf8')
  if (!publishedCatalog.includes("NEXT_PUBLIC_SHOW_LEGACY_DRAFT_CATALOG === 'true'")) fail('legacy catalog fallback is not explicitly opt-in')
  if (!publishedCatalog.includes("process.env.NODE_ENV !== 'production'")) fail('legacy catalog fallback is not production-disabled')
  if (!publishedCatalog.includes("'empty_unpublished'")) fail('published catalog has no empty-unpublished state')
  if (!publishedCatalog.includes("'unavailable'")) fail('published catalog has no explicit unavailable state')
}
if (!fs.existsSync(sourceRegistryLinkMigrationPath)) fail('opportunity source registry-link migration is missing')
if (!fs.existsSync(changeCheckPath)) fail('catalog change validation script is missing')
if (!fs.existsSync(evidenceImmutabilityMigrationPath)) fail('catalog evidence immutability migration is missing')
if (!fs.existsSync(discoveryCheckPath)) fail('catalog discovery validation script is missing')
if (!fs.existsSync(authorityBaselinePath)) fail('IGOD authority coverage baseline is missing')
if (!fs.existsSync(authorityBaselineCheckPath)) fail('IGOD authority baseline validation script is missing')
if (!fs.existsSync(crosswalkCandidateCheckPath)) fail('crosswalk candidate validation script is missing')
if (!fs.existsSync(authoritySeedPath)) fail('IGOD authority baseline seed is missing')
if (!fs.existsSync(authoritySeedCheckPath)) fail('IGOD authority seed validation script is missing')
if (!fs.existsSync(cgssAuditPath)) fail('CGSS source audit is missing')
if (!fs.existsSync(authorityStatusMigrationPath)) fail('authority assessment status migration is missing')
if (!fs.existsSync(publicationInvariantMigrationPath)) fail('catalog publication invariant migration is missing')
if (!fs.existsSync(searchCheckPath)) fail('catalog search validation script is missing')
if (!fs.existsSync(registrationCheckPath)) fail('catalog registration validation script is missing')
if (!fs.existsSync(sourceLocatorMigrationPath)) fail('catalog source-locator migration is missing')
if (!fs.existsSync(incorporationFoodCheckPath)) fail('catalog incorporation/food validation script is missing')
if (!fs.existsSync(iecTaxCheckPath)) fail('catalog IEC/tax identity validation script is missing')
if (!fs.existsSync(socialSecurityCheckPath)) fail('catalog social-security validation script is missing')
if (!fs.existsSync(localGatePath)) fail('catalog local release-gate script is missing')
else {
  const localGate = fs.readFileSync(localGatePath, 'utf8')
  if (!localGate.includes('catalog-remote-status.mjs') || !localGate.includes("remoteStatus.state === 'schema_available'")) {
    fail('catalog local release gate does not consume the fail-closed remote schema probe')
  }
  if (!localGate.includes('catalog-live-source-capture.json') || !localGate.includes('catalog-live-evidence-integrity.json') || !localGate.includes('currentIntegrityPassingSnapshots')) {
    fail('catalog local release gate does not reconcile current source-capture and integrity manifests')
  }
}
if (!fs.existsSync(currentSourceGapsPath)) fail('catalog current-source-gap report script is missing')
if (!fs.existsSync(authorityInvariantMigrationPath)) fail('authority assessment invariant migration is missing')
if (!fs.existsSync(operationsDocPath)) fail('catalog operations runbook is missing')
else {
  const operationsDoc = fs.readFileSync(operationsDocPath, 'utf8')
  if (!operationsDoc.includes('Get-ChildItem supabase/seed/*.sql') || !operationsDoc.includes('Sort-Object Name')) fail('catalog operations runbook does not apply every seed in filename order')
}
if (!fs.existsSync(provenanceCheckPath)) fail('catalog provenance validation script is missing')
if (!fs.existsSync(ingestionCheckPath)) fail('catalog ingestion validation script is missing')

if (process.exitCode) process.exit()
console.log(`catalog static check passed: ${migrations.length} migrations, ${seeds.length} seed files, opportunity seeds remain review-gated and authority seeds remain unassessed`)
