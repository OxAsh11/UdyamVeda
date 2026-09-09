import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const capturePath = path.join(root, 'docs', 'catalog-live-source-capture.json')
const outputPath = path.join(root, 'docs', 'catalog-source-failure-queue.json')
const resolutionPath = path.join(root, 'docs', 'catalog-source-resolution-plan.json')
const batchPath = path.join(root, 'docs', 'catalog-review-batches.json')

if (!fs.existsSync(capturePath)) throw new Error('source failure queue failed: capture manifest is missing')
if (!fs.existsSync(resolutionPath)) throw new Error('source failure queue failed: source resolution plan is missing')
if (!fs.existsSync(batchPath)) throw new Error('source failure queue failed: review-batch manifest is missing')

const manifest = JSON.parse(fs.readFileSync(capturePath, 'utf8'))
const resolutionPlan = JSON.parse(fs.readFileSync(resolutionPath, 'utf8'))
const reviewBatches = JSON.parse(fs.readFileSync(batchPath, 'utf8'))
const plansBySlug = new Map((resolutionPlan.plans ?? []).map(plan => [plan.slug, plan]))
const currentSourceBySlug = new Map(
  reviewBatches.batches.flatMap(batch => batch.records ?? [])
    .filter(record => record.slug && record.source?.url)
    .map(record => [record.slug, record.source.url]),
)
const failedCaptures = (manifest.captures ?? []).filter(capture => {
  if (capture.status !== 'failed') return false
  const currentSourceUrl = currentSourceBySlug.get(capture.slug)
  // A failed capture for a source that was later replaced is historical evidence,
  // not a current publication blocker. The current primary source remains gated
  // by its own capture/review state.
  return !currentSourceUrl || capture.sourceUrl === currentSourceUrl
})
const capturedBySlug = new Map()
for (const capture of manifest.captures ?? []) {
  if (capture.status !== 'captured') continue
  const captures = capturedBySlug.get(capture.slug) ?? []
  captures.push(capture)
  capturedBySlug.set(capture.slug, captures)
}

function nextActionFor(capture) {
  if (capture.failureKind === 'quota_exhausted') {
    return 'restore Firecrawl credits or use the exact-URL-bound manual capture path before retrying'
  }
  if (capture.failureKind === 'transient_fetch' || capture.retryable === true) {
    return 'retry_capture_with_bounded_backoff_then_verify_current_official_content'
  }
  if (capture.failureKind === 'unusable_content') {
    return 'obtain_manual_text_extraction_or_an_alternate_official_source_then_complete_source_review'
  }
  return 'verify_official_url_access_and_source_policy_before_retrying'
}

const failures = failedCaptures
  .map(capture => {
    const plan = plansBySlug.get(capture.slug)
    const failureKind = /returned (402|403)\b|insufficient credits|credit quota|quota exhausted/i.test(capture.error ?? '')
      ? 'quota_exhausted'
      : capture.failureKind ?? 'unknown'
    const alternateSources = plan?.alternateOfficialSources ?? []
    const alternateCaptures = (capturedBySlug.get(capture.slug) ?? [])
      .filter(item => alternateSources.some(source => source.url === item.sourceUrl))
      .map(item => ({
        sourceUrl: item.sourceUrl,
        snapshotPath: item.snapshotPath,
        contentHash: item.contentHash,
        captureRole: item.captureRole ?? 'alternate',
      }))
    return {
      slug: capture.slug,
      name: capture.name,
      sourceUrl: capture.sourceUrl,
      sourceAnchor: capture.sourceAnchor,
      failureKind,
      retryable: capture.retryable === true,
      attempts: Number.isInteger(capture.attempts) ? capture.attempts : null,
      error: capture.error ?? 'Capture failed without an error message',
      status: alternateCaptures.length > 0 ? 'alternate_captured_pending_review' : (plan?.status ?? 'needs_resolution_plan'),
      resolutionPlanStatus: plan ? plan.status : 'missing',
      publicationStatus: 'blocked',
      nextAction: !plan
        ? 'create_source_resolution_plan_before_review'
        : alternateCaptures.length > 0
        ? 'review_alternate_official_source_and_record_primary_source_resolution'
        : alternateSources.length > 0
        ? 'capture_alternate_official_source_then_complete_source_review'
        : nextActionFor({ ...capture, failureKind }),
      manualPath: plan?.manualPath ?? 'Create an exact-URL-bound official alternate-source plan before review.',
      alternateOfficialSources: alternateSources,
      alternateCaptures,
    }
  })
  .sort((a, b) => a.slug.localeCompare(b.slug))

const queue = {
  generatedAt: new Date().toISOString(),
  status: 'local_source_failure_queue',
  interpretation: 'Every item in this queue blocks publication until current official evidence is captured or a reviewer documents an approved alternate/manual evidence path.',
  summary: {
    totalOpen: failures.length,
    retryable: failures.filter(item => item.retryable).length,
    manualReviewRequired: failures.filter(item => !item.retryable).length,
    alternateCapturedPendingReview: failures.filter(item => item.status === 'alternate_captured_pending_review').length,
    publicationReady: 0,
  },
  failures,
}

function stableQueue(value) {
  return JSON.stringify({ ...value, generatedAt: '<generated-at>' }, null, 2)
}

if (process.argv.includes('--write')) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(queue, null, 2) + '\n')
  console.log('catalog source failure queue written: ' + path.relative(root, outputPath))
} else if (!fs.existsSync(outputPath)) {
  throw new Error('catalog source failure queue is missing: run npm run catalog:source-failure-queue -- --write')
} else {
  let existingQueue
  try {
    existingQueue = JSON.parse(fs.readFileSync(outputPath, 'utf8'))
  } catch (error) {
    throw new Error('catalog source failure queue is not valid JSON: ' + error.message)
  }
  if (stableQueue(existingQueue) !== stableQueue(queue)) {
    throw new Error('catalog source failure queue is stale: run npm run catalog:source-failure-queue -- --write')
  }
}

console.log(JSON.stringify(queue.summary, null, 2))
console.log('catalog source failure queue passed: ' + failures.length + ' publication-blocking failures remain open')
