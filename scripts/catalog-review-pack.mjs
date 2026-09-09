import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedDir = path.join(root, 'supabase', 'seed')
const migrationDir = path.join(root, 'supabase', 'migrations')
const outputPath = path.join(root, 'docs', 'catalog-review-pack.json')
const captureManifestPath = path.join(root, 'docs', 'catalog-live-source-capture.json')

function normalizeUrl(value) {
  return String(value ?? '').replace(/[.;]+$/, '').replace(/\/$/, '')
}

function parseRecords(sql, file) {
  const payloadMatch = sql.match(/jsonb_array_elements\(\$records\$([\s\S]*?)\$records\$::jsonb\)/)
    ?? sql.match(/jsonb_array_elements\('([\s\S]*?)'::jsonb\)/)
  if (!payloadMatch) return []
  try {
    return JSON.parse(payloadMatch[1])
  } catch (error) {
    throw new Error('catalog review pack failed: ' + file + ' contains invalid structured JSON: ' + error.message)
  }
}

function urlsIn(text) {
  return [
    ...text.matchAll(/'(?<url>https:\/\/[^']+)'/g),
    ...text.matchAll(/"(?<url>https:\/\/[^"]+)"/g),
  ].map(match => normalizeUrl(match.groups.url)).filter(Boolean)
}

function valueOrNull(value) {
  return value === undefined ? null : value
}

function readCaptureManifest() {
  if (!fs.existsSync(captureManifestPath)) return { captures: [] }
  try {
    return JSON.parse(fs.readFileSync(captureManifestPath, 'utf8'))
  } catch (error) {
    throw new Error('catalog review pack failed: source capture manifest is not valid JSON: ' + error.message)
  }
}

const seedFiles = fs.readdirSync(seedDir).filter(file => file.endsWith('.sql')).sort()
const captureManifest = readCaptureManifest()
const capturesByKey = new Map(
  (captureManifest.captures ?? []).map(capture => [
    `${capture.slug}::${normalizeUrl(capture.sourceUrl)}`,
    capture,
  ]),
)
const registeredSourceUrls = new Set()
for (const file of [
  ...fs.readdirSync(migrationDir).filter(file => file.endsWith('.sql')).sort().map(file => path.join(migrationDir, file)),
  ...seedFiles.map(file => path.join(seedDir, file)),
]) {
  const text = fs.readFileSync(file, 'utf8')
  for (const block of text.matchAll(/insert\s+into\s+public\.source_registry[\s\S]*?on\s+conflict/gi)) {
    for (const url of urlsIn(block[0])) registeredSourceUrls.add(url)
  }
}

const reviewChecks = [
  { key: 'source', label: 'Official source and locator', required: true },
  { key: 'eligibility', label: 'Eligibility and unknown handling', required: true },
  { key: 'benefit', label: 'Benefit structure and amount separation', required: true },
  { key: 'application', label: 'Application route and requirements', required: true },
  { key: 'window', label: 'Window, deadline and freshness', required: true },
  { key: 'fine_print', label: 'Fine print, exclusions and dependencies', required: true },
  { key: 'amendment', label: 'Amendment and supersession review', required: true, notApplicableAllowed: true },
]

const records = []
for (const file of seedFiles) {
  const sql = fs.readFileSync(path.join(seedDir, file), 'utf8')
  if (!sql.toLowerCase().includes('insert into public.opportunities')) continue
  for (const record of parseRecords(sql, file)) {
    const sourceUrl = normalizeUrl(record.source_url)
    const capture = capturesByKey.get(`${record.slug}::${sourceUrl}`)
    const liveSnapshot = capture?.status === 'captured'
      ? {
        status: 'captured',
        fetchedAt: capture.fetchedAt ?? null,
        snapshotPath: capture.snapshotPath ?? null,
        contentHash: capture.contentHash ?? null,
        captureMethod: capture.captureMethod ?? null,
        reviewStatus: capture.reviewStatus ?? 'in_review',
        publicationStatus: capture.publicationStatus ?? 'blocked',
      }
      : {
        status: capture?.status ?? 'missing',
        fetchedAt: capture?.fetchedAt ?? null,
        snapshotPath: capture?.snapshotPath ?? null,
        contentHash: capture?.contentHash ?? null,
        captureMethod: capture?.captureMethod ?? null,
        reviewStatus: 'in_review',
        publicationStatus: 'blocked',
      }
    records.push({
      slug: record.slug,
      name: record.name,
      seedFile: file,
      authority: record.authority,
      opportunityType: record.type,
      lifecycleStatus: record.status ?? 'in_review',
      canonicalUrl: record.canonical_url ?? null,
      reviewStatus: 'in_review',
      publicationStatus: 'blocked',
      source: {
        url: record.source_url,
        anchor: record.source_anchor,
        registered: registeredSourceUrls.has(sourceUrl),
        liveSnapshotRequired: true,
        liveSnapshot,
      },
      eligibility: {
        entityTypes: record.eligibility?.entity_types ?? [],
        lifecycleStages: record.eligibility?.lifecycle_stages ?? [],
        industries: record.eligibility?.industries ?? [],
        locations: record.eligibility?.locations ?? [],
        conditions: record.eligibility?.conditions ?? [],
        thresholds: record.eligibility?.thresholds ?? {},
        exclusions: record.exclusions ?? [],
        unknownHandling: record.rules?.unknown_handling ?? record.eligibility?.unknown_handling ?? 'needs_information',
      },
      benefit: {
        type: record.benefit_type ?? null,
        label: record.benefit_label ?? null,
        amountMin: valueOrNull(record.amount_min),
        amountMax: valueOrNull(record.amount_max),
        percentage: valueOrNull(record.percentage),
        summary: record.benefit_summary ?? {},
        conditions: record.benefit_conditions ?? {},
      },
      application: {
        portal: record.application?.portal ?? null,
        route: record.application?.route ?? null,
        selection: record.application?.selection ?? null,
        requirements: {
          name: record.requirement ?? null,
          description: record.requirement_description ?? null,
        },
        steps: record.steps ?? [],
      },
      window: {
        type: record.window_type ?? null,
        label: record.window_label ?? null,
        evidence: record.window_evidence ?? null,
      },
      finePrint: record.fine_print ?? {},
      reviewChecklist: reviewChecks.map(check => ({
        ...check,
        status: 'pending',
        reviewer: null,
        reviewedAt: null,
        note: null,
      })),
      reviewerDecision: {
        decision: 'pending',
        reviewer: null,
        reviewedAt: null,
        note: null,
      },
      nextAction: liveSnapshot.status === 'captured'
        ? 'compare_captured_official_snapshot_then_complete_all_review_checks'
        : 'capture_current_official_snapshot_then_complete_all_review_checks',
    })
  }
}

if (!records.length) throw new Error('catalog review pack failed: no structured opportunity records found')
if (records.some(record => !record.source.registered)) {
  throw new Error('catalog review pack failed: one or more primary sources are not registered')
}

const pack = {
  generatedAt: new Date().toISOString(),
  status: 'local_human_review_pack',
  interpretation: 'This pack is an editorial work queue. Every record is blocked and requires live official evidence plus an authorized human decision before publication.',
  reviewChecks,
  summary: {
    totalRecords: records.length,
    inReview: records.filter(record => record.reviewStatus === 'in_review').length,
    sourceRegistered: records.filter(record => record.source.registered).length,
    pendingReviewChecks: records.reduce((total, record) => total + record.reviewChecklist.filter(check => check.status === 'pending').length, 0),
    publicationReady: 0,
  },
  records,
}

function stablePack(value) {
  return JSON.stringify({ ...value, generatedAt: '<generated-at>' }, null, 2)
}

if (process.argv.includes('--write')) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(pack, null, 2) + '\n')
  console.log('catalog review pack written: ' + path.relative(root, outputPath))
} else if (!fs.existsSync(outputPath)) {
  throw new Error('catalog review pack is missing: run npm run catalog:review-pack -- --write')
} else {
  let existingPack
  try {
    existingPack = JSON.parse(fs.readFileSync(outputPath, 'utf8'))
  } catch (error) {
    throw new Error('catalog review pack is not valid JSON: ' + error.message)
  }
  if (stablePack(existingPack) !== stablePack(pack)) {
    throw new Error('catalog review pack is stale: run npm run catalog:review-pack -- --write')
  }
}

console.log(JSON.stringify(pack.summary, null, 2))
console.log('catalog review pack passed: ' + records.length + ' records remain blocked pending human review')
