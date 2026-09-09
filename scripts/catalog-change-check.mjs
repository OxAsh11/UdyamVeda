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

const { buildLineDiff } = loadTsModule('src/lib/ingest/line-diff.ts')
const route = fs.readFileSync(path.join(process.cwd(), 'src/app/api/admin/catalog/changes/route.ts'), 'utf8')
const gate = fs.readFileSync(path.join(process.cwd(), 'src/app/api/admin/catalog/gate/route.ts'), 'utf8')
const releaseChecks = fs.readFileSync(path.join(process.cwd(), 'supabase/tests/catalog_release_checks.sql'), 'utf8')
const immutabilityMigration = fs.readFileSync(path.join(process.cwd(), 'supabase/migrations/20260906420000_catalog_evidence_immutability.sql'), 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const diff = buildLineDiff('alpha\nbeta\ngamma', 'alpha\ndelta\ngamma\nomega')
assert(diff.added === 2 && diff.removed === 1, 'line diff should count additions and removals')
assert(diff.rows.some(row => row.kind === 'same' && row.text === 'alpha'), 'line diff should retain unchanged lines')
assert(route.includes('buildLineDiff'), 'change API must return a deterministic diff')
assert(route.includes('reviewerNote') && route.includes("action === 'ignore'"), 'change API must require a note for ignored events')
assert(gate.includes(".in('event_type', ['initial', 'changed'])"), 'beta gate must exclude unchanged events from blocking review')
assert(releaseChecks.includes("event_type in ('initial', 'changed')"), 'SQL release check must exclude unchanged events from blocking review')
assert(immutabilityMigration.includes('source_snapshots_immutable_evidence'), 'source snapshots must have an immutability trigger')
assert(immutabilityMigration.includes('change_events_immutable_evidence'), 'change events must have an immutability trigger')
assert(immutabilityMigration.includes('Source snapshots are immutable and cannot be deleted'), 'source snapshot deletion must be blocked')
assert(immutabilityMigration.includes('Source change events are immutable and cannot be deleted'), 'change event deletion must be blocked')
assert(immutabilityMigration.includes('new.body_markdown is distinct from old.body_markdown'), 'source snapshot body must be immutable')
assert(immutabilityMigration.includes('new.previous_content_hash is distinct from old.previous_content_hash'), 'change event hashes must be immutable')

console.log('catalog change check passed: diff counts, reviewer disposition notes, gate filtering, and immutable evidence')
