import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import ts from 'typescript'

const require = createRequire(import.meta.url)

function loadTsModule(relativePath) {
  const sourcePath = path.join(process.cwd(), relativePath)
  const source = fs.readFileSync(sourcePath, 'utf8')
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const loadedModule = { exports: {} }
  new Function('exports', 'module', 'require', compiled)(loadedModule.exports, loadedModule, require)
  return loadedModule.exports
}

const { stablePayloadHash } = loadTsModule('src/lib/ingest/idempotency.ts')
const source = fs.readFileSync(path.join(process.cwd(), 'src/lib/ingest/functions.ts'), 'utf8')
const inngestRoute = fs.readFileSync(path.join(process.cwd(), 'src/app/api/inngest/route.ts'), 'utf8')
const firecrawl = fs.readFileSync(path.join(process.cwd(), 'src/lib/ingest/firecrawl.ts'), 'utf8')
const liveCapture = fs.readFileSync(path.join(process.cwd(), 'scripts/catalog-live-capture.mjs'), 'utf8')
const liveEvidence = fs.readFileSync(path.join(process.cwd(), 'scripts/catalog-live-evidence-check.mjs'), 'utf8')
const manualCapture = fs.readFileSync(path.join(process.cwd(), 'scripts/catalog-manual-source-capture.mjs'), 'utf8')
const sourceRoute = fs.readFileSync(path.join(process.cwd(), 'src/app/api/admin/catalog/sources/route.ts'), 'utf8')
const migration = fs.readFileSync(path.join(process.cwd(), 'supabase/migrations/20260906350000_ingestion_idempotency.sql'), 'utf8')
const provenanceMigration = fs.readFileSync(path.join(process.cwd(), 'supabase/migrations/20260909030000_catalog_snapshot_provenance.sql'), 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

assert(stablePayloadHash({ name: 'Scheme', nested: { b: 2, a: 1 } }) === stablePayloadHash({ nested: { a: 1, b: 2 }, name: 'Scheme' }), 'payload hash must be stable across object key order')
assert(stablePayloadHash({ name: 'Scheme' }) !== stablePayloadHash({ name: 'Changed scheme' }), 'payload hash must change when extracted content changes')
assert(source.includes(".eq('content_hash', contentHash)"), 'refresh pipeline must check an existing content hash before creating a run')
assert(source.includes("!['failed', 'fetched'].includes(previous.status)"), 'failed or unprocessed snapshots must be reprocessed on retry')
assert(source.includes("onConflict: 'source_snapshot_id,payload_hash'"), 'draft persistence must be idempotent by snapshot and payload hash')
assert(source.includes("onConflict: 'source_registry_id,name' })"), 'discovery persistence must update existing discoveries instead of duplicating them')
assert(source.includes('authoritySnapshotUpdateError') && source.includes('opportunitySnapshotUpdateError'), 'snapshot evidence updates must fail closed when persistence fails')
assert(source.includes('capture_method') && source.includes('response_content_type') && source.includes('final_url'), 'persisted snapshots must retain capture provenance metadata')
assert(source.includes('Evidence metadata is immutable') && source.includes("if (!previous || previous.content_hash !== contentHash)"), 'immutable snapshot provenance must not be rewritten during idempotent retries')
assert(firecrawl.includes("captureMethod: 'firecrawl_markdown'") && firecrawl.includes('responseContentType'), 'Firecrawl documents must carry explicit capture provenance metadata')
assert(firecrawl.includes('requested url was not found') && firecrawl.includes('requested page could not be found') && firecrawl.includes('requested url was rejected') && firecrawl.includes('page not found') && firecrawl.includes('request blocked') && firecrawl.includes('potentially suspicious content entered by you') && firecrawl.includes('urlLike') && firecrawl.includes('isUsableMarkdown'), 'Firecrawl must reject URL-only, not-found, security-interstitial, or error-page markdown')
assert(firecrawl.includes('isOfficialSourceUrl'), 'Firecrawl refresh must restrict source URLs to the official-host policy')
assert(firecrawl.includes('AbortSignal.timeout(45000)'), 'Firecrawl refresh must have an upper request timeout')
assert(firecrawl.includes('isUsableMarkdown'), 'Firecrawl refresh must reject empty or unusable content')
assert(liveCapture.includes("process.argv.includes('--resume')") && liveCapture.includes("previous.status === 'failed'"), 'live capture must support deterministic resume of missing or failed records')
assert(liveCapture.includes('needsCaptureRefresh') && liveCapture.includes('isUsableMarkdown(fs.readFileSync'), 'live capture resume must repair existing unusable snapshots')
assert(liveCapture.includes("process.argv.includes('--http-only')") && liveCapture.includes('httpOnly || !firecrawlKey'), 'live capture must support direct HTML-only retries when Firecrawl quota is unavailable')
assert(liveCapture.includes("process.argv.includes('--pdf-only')") && liveCapture.includes('capturePdfFallback') && liveCapture.includes("captureMethod = 'manual_official_pdf_text'"), 'live capture must support review-blocked official PDF text extraction')
assert(liveCapture.includes('potentially suspicious content entered by you') && liveEvidence.includes('potentially suspicious content entered by you') && manualCapture.includes('potentially suspicious content entered by you'), 'all local capture validators must reject known security interstitials')
assert(liveCapture.includes('const maxAttempts = retries + 1') && liveCapture.includes('retryDelayMs(attempt)'), 'live capture must retry retryable Firecrawl failures with bounded backoff')
assert(liveCapture.includes('function errorWithAttempts') && liveCapture.includes('throw errorWithAttempts'), 'live capture failures must preserve the number of attempts in the failure manifest')
assert(liveCapture.includes("? 'quota_exhausted'") && liveCapture.includes('insufficient credits'), 'quota failures must be classified separately from source-policy failures')
const failureQueue = fs.readFileSync(path.join(process.cwd(), 'scripts/catalog-source-failure-queue.mjs'), 'utf8')
assert(failureQueue.includes('restore Firecrawl credits or use the exact-URL-bound manual capture path'), 'quota failures must direct operators to credit recovery or manual capture')
assert(failureQueue.includes('insufficient credits') && failureQueue.includes("failureKind ="), 'failure queue must normalize stored quota errors from older manifests')
assert(firecrawl.includes('payload.error ??'), 'Firecrawl refresh must preserve provider error details for quota and policy failures')
assert(liveCapture.includes('function captureKey') && liveCapture.includes('capturesByKey'), 'live capture must keep primary and alternate source captures separate')
assert(liveCapture.includes("const append = !process.argv.includes('--replace') && existingManifest?.captures"), 'single-record live captures must append to the manifest unless explicit replacement is requested')
assert(manualCapture.includes("manual_official_text") && manualCapture.includes("manual_official_pdf_text"), 'manual capture must preserve HTML-versus-PDF provenance')
assert(sourceRoute.includes('isOfficialSourceUrl(source.url)'), 'source refresh API must enforce the official-host policy before queueing')
assert(migration.includes('ingestion_runs_source_hash_idx'), 'ingestion run idempotency index is missing')
assert(migration.includes('opportunity_drafts_snapshot_hash_idx'), 'draft idempotency index is missing')
assert(provenanceMigration.includes('capture_method') && provenanceMigration.includes('final_url') && provenanceMigration.includes('response_status') && provenanceMigration.includes('response_content_type'), 'snapshot provenance migration is missing capture metadata columns')
assert(provenanceMigration.includes('source_snapshots_capture_method_check') && provenanceMigration.includes('source_snapshots_response_status_check'), 'snapshot provenance migration is missing metadata constraints')
assert(provenanceMigration.includes('new.capture_method is distinct from old.capture_method') && provenanceMigration.includes('new.final_url is distinct from old.final_url'), 'snapshot provenance metadata must be immutable')
assert(source.includes("id: 'schedule-daily-catalog-sources'") && source.includes("cron: '0 2 * * *'"), 'daily catalog source monitoring must run at its declared cadence')
assert(source.includes("id: 'schedule-weekly-catalog-sources'") && source.includes("cron: '0 3 * * 1'"), 'weekly catalog source monitoring must run at its declared cadence')
assert(source.includes("id: 'schedule-monthly-catalog-sources'") && source.includes("cron: '0 4 1 * *'"), 'monthly catalog source monitoring must run at its declared cadence')
assert((source.match(/retries: 3/g) ?? []).length >= 4, 'catalog refresh and scheduler functions must retain bounded retries')
assert(inngestRoute.includes('scheduleDailyCatalogSources') && inngestRoute.includes('scheduleWeeklyCatalogSources') && inngestRoute.includes('scheduleMonthlyCatalogSources'), 'all catalog schedulers must be registered with the Inngest route')

console.log('catalog ingestion check passed: source policy, timeout, content validation, stable hashes, replay guard, draft deduplication, and discovery upsert')
