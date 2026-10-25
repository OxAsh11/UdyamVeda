export const SOURCE_AUTHORITY_ORDER = [
  'gazette',
  'guideline',
  'ministry',
  'agency',
  'myscheme',
  'startup_india',
  'pib',
  'other',
] as const

export const PUBLISHABLE_SOURCE_KINDS = ['gazette', 'guideline', 'ministry', 'agency'] as const

// These are official implementing-agency portals used by the current seed set
// but do not use a .gov.in or .nic.in hostname. Keep this allowlist explicit;
// a generic HTTPS check would let third-party summaries pass publication.
export const OFFICIAL_IMPLEMENTING_AGENCY_HOSTS = ['cgtmse.in', 'standupmitra.in', 'nsic.co.in', 'ncgtc.in', 'jansamarth.in', 'sidbi.in', 'udyamimitra.in', 'pliauto.in', 'mstcecommerce.com', 'eil.co.in', 'sezonline-ndml.co.in', 'plidrone.ifciltd.com', 'nivedi.res.in'] as const

export const REQUIRED_OPPORTUNITY_FIELDS = [
  'name',
  'objective',
  'authority',
  'eligibility',
  'benefit_summary',
  'application',
  'fine_print',
  'requirements',
  'steps',
  'sources',
  'effective_dates',
] as const

export const PUBLISHING_STATUSES = ['draft', 'in_review', 'active', 'upcoming', 'paused', 'pending_renewal', 'closed', 'superseded', 'archived'] as const

export type PublishingStatus = typeof PUBLISHING_STATUSES[number]

export type SourceEvidence = {
  source_url?: unknown
  source_kind?: unknown
  source_anchor?: unknown
  page_number?: unknown
  section?: unknown
  paragraph?: unknown
  document_anchor?: unknown
  is_primary?: unknown
}

export function isOfficialSourceUrl(sourceUrl: unknown) {
  if (typeof sourceUrl !== 'string' || !/^https:\/\//i.test(sourceUrl)) return false
  try {
    const url = new URL(sourceUrl)
    const host = url.hostname.toLowerCase()
    return host === 'gov.in'
      || host.endsWith('.gov.in')
      || host === 'nic.in'
      || host.endsWith('.nic.in')
      || OFFICIAL_IMPLEMENTING_AGENCY_HOSTS.some(allowedHost => host === allowedHost || host.endsWith('.' + allowedHost))
  } catch {
    return false
  }
}

export type PublicationRecordEvidence = {
  title?: unknown
  objective?: unknown
  eligibility?: unknown
  application?: unknown
  fine_print?: unknown
  benefit_summary?: unknown
  completeness?: unknown
  last_verified_at?: unknown
  benefits_count: number
  requirements_count: number
  steps_count: number
  windows_count: number
}

function hasContent(value: unknown) {
  if (value === undefined || value === null || value === '') return false
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'object') return Object.keys(value as Record<string, unknown>).length > 0
  return true
}

export function validatePublicationRecord(record: PublicationRecordEvidence): string[] {
  const errors: string[] = []
  for (const field of ['title', 'objective', 'eligibility', 'application', 'fine_print', 'benefit_summary'] as const) {
    if (!hasContent(record[field])) errors.push('Missing publication field: ' + field)
  }
  if (Number(record.completeness) < 0.95) errors.push('Completeness is below the 95% publication threshold.')
  if (!hasContent(record.last_verified_at)) errors.push('The record has no verification timestamp.')
  if (record.benefits_count < 1) errors.push('At least one structured benefit is required.')
  if (record.requirements_count < 1) errors.push('At least one requirement or prerequisite is required.')
  if (record.steps_count < 1) errors.push('At least one application step is required.')
  if (record.windows_count < 1) errors.push('At least one application window or rolling-status record is required.')
  return errors
}

export function isPrimaryOfficialSource(source: SourceEvidence) {
  const hasTextAnchor = typeof source.source_anchor === 'string' && source.source_anchor.trim().length > 0
  const hasStructuredLocator = [source.page_number, source.section, source.paragraph, source.document_anchor]
    .some(value => typeof value === 'string' ? value.trim().length > 0 : typeof value === 'number' && Number.isInteger(value) && value >= 1)
  return source.is_primary === true
    && isOfficialSourceUrl(source.source_url)
    && typeof source.source_kind === 'string'
    && PUBLISHABLE_SOURCE_KINDS.includes(source.source_kind as typeof PUBLISHABLE_SOURCE_KINDS[number])
    && (hasTextAnchor || hasStructuredLocator)
}

type OpportunityWindow = {
  window_type?: string | null
  opens_at?: string | null
  closes_at?: string | null
}

export function publicationStatusForWindows(windows: OpportunityWindow[], now = new Date()): PublishingStatus {
  if (!windows.length) return 'active'

  const hasFutureOpening = windows.some(window => {
    if (!window.opens_at) return false
    const opensAt = new Date(window.opens_at)
    return !Number.isNaN(opensAt.getTime()) && opensAt > now
  })
  if (hasFutureOpening) return 'upcoming'

  const hasOpenWindow = windows.some(window => {
    if (window.window_type === 'closed') return false
    if (!window.closes_at) return ['rolling', 'annual', 'call_for_applications'].includes(window.window_type ?? '')
    const closesAt = new Date(window.closes_at)
    return Number.isNaN(closesAt.getTime()) || closesAt > now
  })
  return hasOpenWindow ? 'active' : 'closed'
}

export function sourceRank(sourceKind: string): number {
  const index = SOURCE_AUTHORITY_ORDER.indexOf(sourceKind as typeof SOURCE_AUTHORITY_ORDER[number])
  return index === -1 ? SOURCE_AUTHORITY_ORDER.length : index
}

export function completenessFor(fields: Partial<Record<typeof REQUIRED_OPPORTUNITY_FIELDS[number], unknown>>): number {
  const present = REQUIRED_OPPORTUNITY_FIELDS.filter(field => {
    const value = fields[field]
    return value !== undefined && value !== null && value !== '' && (!Array.isArray(value) || value.length > 0)
  }).length
  return present / REQUIRED_OPPORTUNITY_FIELDS.length
}
