import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const ledgerPath = path.join(root, 'docs', 'catalog-review-ledger.json')
const capturePath = path.join(root, 'docs', 'catalog-live-source-capture.json')
const integrityPath = path.join(root, 'docs', 'catalog-live-evidence-integrity.json')
const resolutionPath = path.join(root, 'docs', 'catalog-source-resolution-plan.json')
const outputPath = path.join(root, 'docs', 'catalog-current-source-gaps.json')

function readJson(file) {
  if (!fs.existsSync(file)) throw new Error(`current source gaps failed: missing ${path.relative(root, file)}`)
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function normalizeUrl(value) {
  return String(value ?? '').replace(/[.;]+$/, '').replace(/\/$/, '')
}

function key(slug, url) {
  return `${slug}::${normalizeUrl(url)}`
}

const ledger = readJson(ledgerPath)
const captureManifest = readJson(capturePath)
const integrityManifest = readJson(integrityPath)
const resolutionPlan = readJson(resolutionPath)
const capturesByKey = new Map((captureManifest.captures ?? []).map(capture => [key(capture.slug, capture.sourceUrl), capture]))
const integrityByKey = new Map((integrityManifest.records ?? []).map(record => [key(record.slug, record.sourceUrl), record]))
const plansBySlug = new Map((resolutionPlan.plans ?? []).map(plan => [plan.slug, plan]))

const gaps = []
for (const record of ledger.records ?? []) {
  const sourceUrl = record.source?.url
  const capture = capturesByKey.get(key(record.slug, sourceUrl))
  const integrity = integrityByKey.get(key(record.slug, sourceUrl))
  if (capture?.status === 'captured' && integrity?.integrityStatus === 'passed') continue

  const plan = plansBySlug.get(record.slug)
  const alternateCaptures = (captureManifest.captures ?? [])
    .filter(item => item.status === 'captured' && item.slug === record.slug && item.sourceUrl !== sourceUrl)
    .map(item => ({
      sourceUrl: item.sourceUrl,
      contentHash: item.contentHash ?? null,
      snapshotPath: item.snapshotPath ?? null,
      captureMethod: item.captureMethod ?? null,
    }))

  const status = capture?.status === 'failed'
    ? 'primary_capture_failed'
    : capture?.status === 'captured'
      ? 'integrity_review_required'
      : 'primary_snapshot_missing'
  const nextAction = status === 'primary_capture_failed' && alternateCaptures.length > 0
    ? 'review_captured_alternate_before_retrying_primary'
    : status === 'primary_capture_failed'
      ? 'retry_or_manually_capture_current_primary_source'
      : status === 'integrity_review_required'
        ? 'inspect_snapshot_and_reconcile_hash_or_anchor'
        : 'capture_current_primary_source_before_editorial_review'

  gaps.push({
    slug: record.slug,
    name: record.name,
    sourceUrl,
    sourceAnchor: record.source?.anchor ?? null,
    sourceRegistered: record.source?.registered === true,
    status,
    captureError: capture?.error ?? null,
    captureFailureKind: capture?.failureKind ?? null,
    captureRetryable: typeof capture?.retryable === 'boolean' ? capture.retryable : null,
    captureMethod: capture?.captureMethod ?? null,
    snapshotPath: capture?.snapshotPath ?? null,
    contentHash: capture?.contentHash ?? null,
    integrityStatus: integrity?.integrityStatus ?? 'missing',
    alternateOfficialSources: plan?.alternateOfficialSources ?? [],
    alternateCaptures,
    nextAction,
    publicationStatus: 'blocked',
  })
}

gaps.sort((a, b) => a.slug.localeCompare(b.slug))
const report = {
  generatedAt: new Date().toISOString(),
  status: 'current_primary_source_gaps',
  interpretation: 'This report reconciles each structured record with its current primary source URL. Every listed record remains publication-blocked until current evidence is captured, integrity-checked, and reviewed by an authorized human.',
  summary: {
    totalRecords: (ledger.records ?? []).length,
    currentSourceGaps: gaps.length,
    primarySnapshotMissing: gaps.filter(item => item.status === 'primary_snapshot_missing').length,
    primaryCaptureFailed: gaps.filter(item => item.status === 'primary_capture_failed').length,
    retryableFailures: gaps.filter(item => item.status === 'primary_capture_failed' && item.captureRetryable === true).length,
    manualReviewRequired: gaps.filter(item => item.status !== 'primary_capture_failed' || item.captureRetryable !== true).length,
    integrityReviewRequired: gaps.filter(item => item.status === 'integrity_review_required').length,
    alternateCapturesAvailable: gaps.filter(item => item.alternateCaptures.length > 0).length,
    publicationReady: 0,
  },
  gaps,
}

function stable(value) {
  return JSON.stringify({ ...value, generatedAt: '<generated-at>' }, null, 2)
}

if (process.argv.includes('--write')) {
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  console.log(`current source gap report written: ${path.relative(root, outputPath)}`)
} else if (!fs.existsSync(outputPath)) {
  throw new Error('current source gaps report is missing: run npm run catalog:current-source-gaps -- --write')
} else {
  const existing = readJson(outputPath)
  if (stable(existing) !== stable(report)) throw new Error('current source gaps report is stale: run npm run catalog:current-source-gaps -- --write')
}

console.log(JSON.stringify(report.summary, null, 2))
console.log(`catalog current source gaps passed: ${gaps.length} current records remain evidence-blocked`)
