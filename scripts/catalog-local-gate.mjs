import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const requireReady = process.argv.includes('--require-ready')
const ledgerPath = path.join(root, 'docs', 'catalog-review-ledger.json')
const authorityLedgerPath = path.join(root, 'docs', 'authority-assessment-ledger.json')
const crosswalkPath = path.join(root, 'docs', 'catalog-authority-opportunity-crosswalk.json')
const captureManifestPath = path.join(root, 'docs', 'catalog-live-source-capture.json')
const integrityManifestPath = path.join(root, 'docs', 'catalog-live-evidence-integrity.json')
const outputPath = path.join(root, 'docs', 'catalog-local-gate-report.json')

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function readOptionalJson(file) {
  return fs.existsSync(file) ? readJson(file) : { captures: [], records: [] }
}

function normalizeUrl(value) {
  return String(value ?? '').replace(/[.;]+$/, '').replace(/\/$/, '')
}

function readRemoteStatus() {
  const probe = spawnSync(process.execPath, [path.join(root, 'scripts', 'catalog-remote-status.mjs')], {
    cwd: root,
    encoding: 'utf8',
    timeout: 20000,
    windowsHide: true,
  })
  const output = `${probe.stdout ?? ''}`.trim()
  try {
    return JSON.parse(output)
  } catch {
    return {
      state: 'probe_error',
      detail: `${probe.error?.message ?? probe.stderr ?? 'remote status probe did not return JSON'}`.trim(),
    }
  }
}

for (const file of [ledgerPath, authorityLedgerPath, crosswalkPath]) {
  if (!fs.existsSync(file)) throw new Error(`catalog local gate failed: missing ${path.relative(root, file)}`)
}

const ledger = readJson(ledgerPath)
const authorityLedger = readJson(authorityLedgerPath)
const crosswalk = readJson(crosswalkPath)
const captureManifest = readOptionalJson(captureManifestPath)
const integrityManifest = readOptionalJson(integrityManifestPath)
const authorityRows = authorityLedger.rows ?? []
const authorityPending = authorityRows.filter(row => row.disposition === 'review_required').length
const summary = ledger.summary ?? {}
const crosswalkSummary = crosswalk.summary ?? {}
const unresolvedOpportunityRecords = Number(crosswalkSummary.mappingCounts?.unresolved ?? 0)
const authoritiesWithoutExplicitSeedEvidence = Number(crosswalkSummary.authoritiesWithoutExplicitSeedEvidence ?? 0)
const remoteStatus = readRemoteStatus()
const remoteSchemaAvailable = remoteStatus.state === 'schema_available'
const captureByKey = new Map((captureManifest.captures ?? []).map(capture => [
  `${capture.slug}::${normalizeUrl(capture.sourceUrl)}`,
  capture,
]))
const integrityByKey = new Map((integrityManifest.records ?? []).map(record => [
  `${record.slug}::${normalizeUrl(record.sourceUrl)}`,
  record,
]))
const ledgerRecords = ledger.records ?? []
const currentSnapshotStates = ledgerRecords.map(record => {
  const key = `${record.slug}::${normalizeUrl(record.source?.url)}`
  const capture = captureByKey.get(key)
  const integrity = integrityByKey.get(key)
  return {
    captured: capture?.status === 'captured',
    integrityPassed: integrity?.integrityStatus === 'passed',
  }
})
const currentCapturedSnapshots = currentSnapshotStates.filter(item => item.captured).length
const currentIntegrityPassingSnapshots = currentSnapshotStates.filter(item => item.captured && item.integrityPassed).length
const currentSnapshotFailures = currentSnapshotStates.filter(item => !item.captured).length

const checks = [
  {
    id: 'remote_schema',
    passed: remoteSchemaAvailable,
    value: remoteStatus.state,
    blocker: 'Apply the ordered migrations and seeds to the configured Supabase project.',
  },
  {
    id: 'opportunity_approval',
    passed: Number(summary.publicationReady) > 0 && Number(summary.humanReviewPending) === 0,
    value: `${summary.publicationReady ?? 0} publishable / ${summary.humanReviewPending ?? 0} human-review pending`,
    blocker: 'Every opportunity requires a source, eligibility, window and amendment review decision.',
  },
  {
    id: 'authority_assessment',
    passed: authorityPending === 0 && authorityRows.length === 103,
    value: `${authorityRows.length - authorityPending}/${authorityRows.length} assessed`,
    blocker: 'Assess every IGOD ministry and department for business relevance or documented exclusion.',
  },
  {
    id: 'authority_crosswalk',
    passed: unresolvedOpportunityRecords === 0 && authoritiesWithoutExplicitSeedEvidence === 0,
    value: `${unresolvedOpportunityRecords} unresolved records / ${authoritiesWithoutExplicitSeedEvidence} authorities without explicit seed evidence`,
    blocker: 'Crawl authority sources and map or explicitly exclude discovered business-relevant opportunities.',
  },
  {
    id: 'live_source_snapshots',
    passed: ledgerRecords.length > 0
      && currentIntegrityPassingSnapshots === ledgerRecords.length,
    value: `${currentIntegrityPassingSnapshots}/${ledgerRecords.length} current records have integrity-passing snapshots; ${currentSnapshotFailures} missing or failed`,
    blocker: 'Capture current official-source snapshots through the provisioned ingestion workflow.',
  },
  {
    id: 'factual_accuracy',
    passed: false,
    value: 'not_recorded',
    blocker: 'Complete a representative factual audit of at least 20 approved records and reach 98% accuracy.',
  },
]

const report = {
  generatedAt: new Date().toISOString(),
  status: 'central_beta_blocked',
  centralBetaReady: checks.every(check => check.passed),
  interpretation: 'This is a local release-gate explanation. It does not substitute for remote database checks, live source snapshots, or human review.',
  summary: {
    opportunityRecords: summary.totalRecords ?? 0,
    structuredRecords: summary.structuredRecords ?? 0,
    editorialFieldsComplete: summary.editorialFieldsComplete ?? 0,
    publicationReady: summary.publicationReady ?? 0,
    authorities: authorityRows.length,
    authoritiesPending: authorityPending,
    unresolvedOpportunityRecords,
    authoritiesWithoutExplicitSeedEvidence,
    capturedSnapshots: currentCapturedSnapshots,
    integrityPassingSnapshots: currentIntegrityPassingSnapshots,
    snapshotFailures: currentSnapshotFailures,
  },
  remoteStatus,
  checks,
}

if (report.summary.opportunityRecords <= 0 || report.summary.structuredRecords !== report.summary.opportunityRecords) {
  throw new Error('catalog local gate failed: opportunity records must be non-empty and fully structured')
}
if (report.summary.authorities !== 103) throw new Error('catalog local gate failed: expected 103 authority rows')

if (process.argv.includes('--write')) {
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`)
  console.log(`catalog local gate report written: ${path.relative(root, outputPath)}`)
}

console.log(JSON.stringify(report.summary, null, 2))
console.log(`catalog local gate: ${report.centralBetaReady ? 'ready' : 'blocked'} (${checks.filter(check => check.passed).length}/${checks.length} checks passed)`)

if (requireReady && !report.centralBetaReady) {
  process.exitCode = 1
}
