import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const root = process.cwd()
const batchPath = path.join(root, 'docs', 'catalog-review-batches.json')
const capturePath = path.join(root, 'docs', 'catalog-live-source-capture.json')
const resolutionPath = path.join(root, 'docs', 'catalog-source-resolution-plan.json')

function argumentValue(name) {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : null
}

function requireArgument(name) {
  const value = argumentValue(name)
  if (!value?.trim()) throw new Error(`manual source capture requires ${name}`)
  return value.trim()
}

function isUsableMarkdown(markdown) {
  const normalized = markdown.trim().toLowerCase()
  return normalized.length >= 80
    && !normalized.startsWith('%pdf-')
    && !normalized.includes('the requested url was not found')
    && !normalized.includes('potentially suspicious content entered by you')
    && !normalized.includes('review all errors and resolve them one by one')
    && !normalized.includes('error code "err_')
}

function normalized(value) {
  return String(value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function meaningfulTokens(value) {
  return normalized(value).split(' ').filter(token => token.length >= 4 && !['pages', 'page', 'section', 'source', 'official', 'criteria', 'terms'].includes(token))
}

function snapshotFileName(slug, contentHash) {
  return `${slug.replace(/[^a-z0-9-]+/gi, '-').replace(/^-|-$/g, '')}-${contentHash.slice(0, 12)}.md`
}

const slug = requireArgument('--slug')
const markdownFile = requireArgument('--markdown-file')
if (!fs.existsSync(batchPath)) throw new Error('manual source capture failed: review-batch manifest is missing')
if (!fs.existsSync(capturePath)) throw new Error('manual source capture failed: capture manifest is missing')
if (!fs.existsSync(resolutionPath)) throw new Error('manual source capture failed: source resolution plan is missing')
if (!fs.existsSync(markdownFile)) throw new Error(`manual source capture failed: markdown file does not exist: ${markdownFile}`)

const manifest = JSON.parse(fs.readFileSync(batchPath, 'utf8'))
const captureManifest = JSON.parse(fs.readFileSync(capturePath, 'utf8'))
const resolutionPlan = JSON.parse(fs.readFileSync(resolutionPath, 'utf8'))
const record = manifest.batches.flatMap(batch => batch.records).find(item => item.slug === slug)
if (!record?.source?.url) throw new Error(`manual source capture failed: no official source is registered for ${slug}`)
const plan = resolutionPlan.plans?.find(item => item.slug === slug)
const sourceUrl = argumentValue('--source-url') ?? record.source.url
const isPrimarySource = sourceUrl === record.source.url
const requestedCaptureMethod = argumentValue('--capture-method')
const captureMethod = requestedCaptureMethod ?? (/\.pdf(?:$|[?#])/i.test(sourceUrl) ? 'manual_official_pdf_text' : 'manual_official_text')
if (!['manual_official_text', 'manual_official_pdf_text'].includes(captureMethod)) {
  throw new Error(`manual source capture failed: unsupported capture method ${captureMethod}`)
}
const alternateSource = isPrimarySource
  ? null
  : (plan?.alternateOfficialSources ?? []).find(item => item.url === sourceUrl)
if (sourceUrl !== record.source.url && !alternateSource) {
  throw new Error(`manual source capture failed: ${sourceUrl} is not the primary or an approved alternate source for ${slug}`)
}

const markdown = fs.readFileSync(markdownFile, 'utf8')
if (!isUsableMarkdown(markdown)) throw new Error('manual source capture failed: extracted text is empty, too short, or an error page')

const sourceHeader = markdown.match(/(?:^|\n)\s*(?:<!--\s*)?source-url\s*:\s*(\S+)(?:\s*-->)?\s*(?:\n|$)/i)?.[1]
if (sourceHeader !== sourceUrl) {
  throw new Error(`manual source capture failed: source-url header must exactly match ${sourceUrl}`)
}
const normalizedBody = normalized(markdown)
const effectiveSourceAnchor = alternateSource?.sourceAnchor ?? record.source.anchor
const anchorTokens = meaningfulTokens(effectiveSourceAnchor)
const matchedAnchorTokens = anchorTokens.filter(token => normalizedBody.includes(token))
if (matchedAnchorTokens.length < Math.min(3, Math.max(1, anchorTokens.length))) {
  throw new Error(`manual source capture failed: extracted text does not contain enough source-anchor terms (${matchedAnchorTokens.length}/${Math.min(3, Math.max(1, anchorTokens.length))})`)
}

const contentHash = createHash('sha256').update(markdown).digest('hex')
const runId = `manual-${new Date().toISOString().replace(/[:.]/g, '-')}`
const relativePath = path.join('.catalog-snapshots', runId, snapshotFileName(slug, contentHash)).replaceAll('\\', '/')
const capture = {
  slug,
  name: record.name,
  sourceUrl,
  sourceAnchor: effectiveSourceAnchor,
  fetchedAt: new Date().toISOString(),
  status: 'captured',
  captureRole: isPrimarySource ? 'primary' : 'alternate',
  captureMethod,
  contentHash,
  characterCount: markdown.length,
  attempts: 1,
  snapshotPath: relativePath,
  reviewStatus: 'in_review',
  publicationStatus: 'blocked',
}

if (!process.argv.includes('--write')) {
  console.log(JSON.stringify(capture, null, 2))
  console.log('manual source capture validated: add --write to persist the blocked snapshot and manifest entry')
  process.exit(0)
}

fs.mkdirSync(path.join(root, path.dirname(relativePath)), { recursive: true })
fs.writeFileSync(path.join(root, relativePath), markdown, 'utf8')
const captureKey = item => `${item.slug}::${item.sourceUrl}`
const capturesByKey = new Map((captureManifest.captures ?? []).map(item => [captureKey(item), item]))
capturesByKey.set(captureKey(capture), capture)
const captures = [...capturesByKey.values()].sort((a, b) => captureKey(a).localeCompare(captureKey(b)))
const output = {
  ...captureManifest,
  generatedAt: new Date().toISOString(),
  captures,
  summary: {
    ...captureManifest.summary,
    captured: captures.filter(item => item.status === 'captured').length,
    failed: captures.filter(item => item.status === 'failed').length,
    publicationReady: 0,
  },
}
fs.writeFileSync(capturePath, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
console.log(`manual source capture written: ${relativePath}`)
console.log(JSON.stringify(output.summary, null, 2))
