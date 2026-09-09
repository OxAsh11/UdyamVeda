export type AuthorityLevel = 'ministry' | 'department'

export interface AuthorityDirectoryRecord {
  authorityLevel: AuthorityLevel
  authorityName: string
  authorityUrl: string | null
}

export interface AuthorityDirectoryParse {
  authorityLevel: AuthorityLevel
  records: AuthorityDirectoryRecord[]
  warnings: string[]
}

function authorityLevelFor(sourceUrl: string): AuthorityLevel | null {
  if (sourceUrl.includes('/ug/E002/')) return 'ministry'
  if (sourceUrl.includes('/ug/E003/')) return 'department'
  return null
}

function cleanName(value: string) {
  return value
    .replace(/^[*-]\s*/, '')
    .replace(/^\d+[.)]\s*/, '')
    .replace(/^\[|\]$/g, '')
    .replace(/\s+\[Details\].*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function parseAuthorityDirectory(markdown: string, sourceUrl: string): AuthorityDirectoryParse {
  const authorityLevel = authorityLevelFor(sourceUrl)
  if (!authorityLevel) throw new Error(`Unsupported authority directory: ${sourceUrl}`)

  const lines = markdown.split(/\r?\n/)
  const heading = authorityLevel === 'ministry' ? '## ministries' : '## departments'
  const start = lines.findIndex(line => line.trim().toLowerCase() === heading)
  if (start < 0) {
    return {
      authorityLevel,
      records: [],
      warnings: [`Could not find the expected ${authorityLevel} section heading; no records were extracted.`],
    }
  }
  const end = lines.findIndex((line, index) => index > start && /^##\s+/.test(line.trim()))
  const section = lines.slice(start + 1, end > start ? end : lines.length)
  const records: AuthorityDirectoryRecord[] = []
  const seenNames = new Set<string>()
  const seenUrls = new Set<string>()

  for (const line of section) {
    const link = line.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/)
    const name = cleanName(link?.[1] ?? line)
    if (!name || /^\[?input\]?$/i.test(name) || /^\d+\s+results$/i.test(name) || /^\[?(details|skip to|in focus|new additions|more sites)\]?$/i.test(name)) continue
    if (name.length < 3 || name.length > 180 || /^(help|connect|about|contact|feedback|link|bookmark)/i.test(name)) continue
    const authorityUrl = link?.[2] ?? null
    const nameKey = name.toLocaleLowerCase()
    const urlKey = authorityUrl?.replace(/\/$/, '').toLocaleLowerCase() ?? null
    if (seenNames.has(nameKey) || (urlKey && seenUrls.has(urlKey))) continue
    seenNames.add(nameKey)
    if (urlKey) seenUrls.add(urlKey)
    records.push({ authorityLevel, authorityName: name, authorityUrl })
  }

  const warnings: string[] = []
  if (records.length === 0) warnings.push('No authority records were extracted; source requires manual inspection.')
  if (records.some(record => !record.authorityUrl)) warnings.push('Some directory records have no linked official URL and require manual completion.')

  return { authorityLevel, records, warnings }
}
