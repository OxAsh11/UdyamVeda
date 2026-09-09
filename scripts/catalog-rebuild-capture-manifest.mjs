import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const root = process.cwd()
const snapshotRoot = path.join(root, '.catalog-snapshots')
const batchesPath = path.join(root, 'docs', 'catalog-review-batches.json')
const resolutionPlanPath = path.join(root, 'docs', 'catalog-source-resolution-plan.json')
const outputPath = path.join(root, 'docs', 'catalog-live-source-capture.json')

function walk(directory) {
  if (!fs.existsSync(directory)) return []
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const entryPath = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(entryPath) : [entryPath]
  })
}

function timestampFromDirectory(directoryName) {
  const value = directoryName.replace(/^manual-/, '').replace(/^(\d{4}-\d{2}-\d{2})T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z$/, '$1T$2:$3:$4.$5Z')
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

function sourceUrlFromMarkdown(markdown) {
  return markdown.match(/(?:^|\n)\s*(?:<!--\s*)?source-url\s*:\s*(\S+)(?:\s*-->)?\s*(?:\n|$)/i)?.[1]
    ?? markdown.match(/(?:^|\n)\s*Source URL:\s*(\S+)\s*(?:\n|$)/i)?.[1]
    ?? null
}

function isUsableSnapshotBody(markdown) {
  const normalized = markdown.trim().toLowerCase()
  return normalized.length >= 80
    && !normalized.includes('404 banner')
    && !normalized.includes('page not found')
    && !normalized.includes('requested page could not be found')
    && !normalized.includes('the requested url was not found')
    && !normalized.includes('the requested url was rejected')
    && !normalized.includes('consult with your administrator')
    && !normalized.includes('support id:')
    && !normalized.includes('potentially suspicious content entered by you')
    && !normalized.includes('review all errors and resolve them one by one')
    && !normalized.includes('access denied')
    && !normalized.includes('request blocked')
}

function manualMethod(markdown, sourceUrl) {
  if (/^\s*# Official PDF text extraction/im.test(markdown) || /\.pdf(?:$|[?#])/i.test(sourceUrl)) return 'manual_official_pdf_text'
  if (/source-url\s*:/i.test(markdown)) return 'manual_official_text'
  return 'firecrawl_markdown'
}

const batches = JSON.parse(fs.readFileSync(batchesPath, 'utf8'))
const resolutionPlan = JSON.parse(fs.readFileSync(resolutionPlanPath, 'utf8'))
const records = batches.batches.flatMap(batch => batch.records ?? [])
const recordBySlug = new Map(records.map(record => [record.slug, record]))
const planBySlug = new Map((resolutionPlan.plans ?? []).map(plan => [plan.slug, plan]))
const slugs = [...recordBySlug.keys()].sort((a, b) => b.length - a.length)
const recoveredRetryableSlugs = new Set([
  'assistance-to-training-institutions-ati',
  'dairy-sahakar-cooperative-dairy-business-support',
  'epfo-establishment-registration',
  'khadi-gramodyog-vikas-yojana',
  'nhdp-marketing-support-services-handicrafts',
  'nhdp-skill-development-handicraft-sector',
  'pmjvm-tribal-value-chain',
  'prime-ministers-employment-generation-programme',
  'production-linked-incentive-bulk-drugs-ksm-di-api',
  'production-linked-incentive-medical-devices',
  'production-linked-incentive-pharmaceuticals',
  'promotion-of-medical-device-parks',
  'production-linked-incentive-specialty-steel',
  'startup-accelerator-meity-samridh',
  'vcf-st-tribal-startups',
])
const candidates = walk(snapshotRoot).filter(file => {
  const relative = path.relative(snapshotRoot, file)
  const firstDirectory = relative.split(path.sep)[0]
  return Boolean(timestampFromDirectory(firstDirectory))
    && file.toLowerCase().endsWith('.md')
})

const capturesByKey = new Map()
for (const file of candidates) {
  const name = path.basename(file)
  const slug = slugs.find(value => name.startsWith(`${value}-`))
  if (!slug) continue
  const record = recordBySlug.get(slug)
  const markdown = fs.readFileSync(file, 'utf8')
  if (!isUsableSnapshotBody(markdown)) continue
  const contentHash = createHash('sha256').update(markdown).digest('hex')
  const sourceUrl = sourceUrlFromMarkdown(markdown) ?? record.source.url
  const alternateSource = planBySlug.get(slug)?.alternateOfficialSources?.find(item => item.url === sourceUrl)
  const sourceAnchor = alternateSource?.sourceAnchor ?? record.source.anchor
  const fetchedAt = timestampFromDirectory(path.relative(snapshotRoot, file).split(path.sep)[0]) ?? new Date(fs.statSync(file).mtimeMs).toISOString()
  const relativePath = path.relative(root, file).replaceAll('\\', '/')
  const capture = {
    slug,
    name: record.name,
    sourceUrl,
    sourceAnchor,
    fetchedAt,
    status: 'captured',
    captureRole: sourceUrl === record.source.url ? 'primary' : 'alternate',
    captureMethod: manualMethod(markdown, sourceUrl),
    contentHash,
    characterCount: markdown.length,
    attempts: 1,
    snapshotPath: relativePath,
    reviewStatus: 'in_review',
    publicationStatus: 'blocked',
  }
  const key = `${slug}::${sourceUrl}`
  const previous = capturesByKey.get(key)
  if (!previous || new Date(capture.fetchedAt) > new Date(previous.fetchedAt)) capturesByKey.set(key, capture)
}

for (const record of records) {
  const key = `${record.slug}::${record.source.url}`
  if (capturesByKey.has(key)) continue
  capturesByKey.set(key, {
    slug: record.slug,
    name: record.name,
    sourceUrl: record.source.url,
    sourceAnchor: record.source.anchor,
    fetchedAt: new Date().toISOString(),
    status: 'failed',
    error: 'Manifest recovery: no preserved snapshot for the current primary source; rerun capture or submit bounded official evidence.',
    failureKind: recoveredRetryableSlugs.has(record.slug) ? 'transient_fetch' : 'source_or_policy',
    retryable: recoveredRetryableSlugs.has(record.slug),
    attempts: 0,
    reviewStatus: 'in_review',
    publicationStatus: 'blocked',
  })
}

const captures = [...capturesByKey.values()].sort((a, b) => `${a.slug}::${a.sourceUrl}`.localeCompare(`${b.slug}::${b.sourceUrl}`))
const output = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  status: 'local_evidence_capture',
  interpretation: 'This manifest records live official-source fetches for editorial review. A captured snapshot is not a publication approval or an eligibility decision.',
  summary: {
    requested: records.length,
    captured: captures.filter(capture => capture.status === 'captured').length,
    failed: captures.filter(capture => capture.status === 'failed').length,
    publicationReady: 0,
  },
  captures,
}

const write = process.argv.includes('--write')
if (write) fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
console.log(JSON.stringify({ ...output.summary, uniqueSources: captures.length, wrote: write }, null, 2))
