// Turns raw catalog records into text that is safe to show applicants.
// Approved versions still carry editorial working notes (reviewer guidance,
// "recheck before recommendation", portal caveats); those stay in the
// database for reviewers but are filtered out of every public surface.

// Matches instructions addressed to reviewers ("do not infer an open call",
// "no current call is asserted"), not ordinary applicant rules such as
// "OCI holdings do not satisfy this condition" or "prepare the dossier".
const INTERNAL_NOTE = /\b(do not (infer|treat|recommend|present|rely|merge|combine)|don't (infer|treat|recommend|present|rely)|re-?check (before|the next)|before recommend(ation|ing)?|reviewers?|codex|seed(ed)? record|evidence packet|(is|are|was|were) (not )?(yet )?asserted|not (yet )?established|do(es)? not establish)\b/i

export function isInternalNote(text: string) {
  return INTERNAL_NOTE.test(text)
}

export function humanize(token: string) {
  const text = token.replace(/[_-]+/g, ' ').trim()
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// A code written into a sentence ("self_help_group"). A web address, a file name or an e-mail address
// holds underscores too, so a code must not follow or run into any of the characters they are built from.
const CODE_IN_TEXT = /(?<![\w/.:=@#?&-])(?=[a-z0-9_]*[a-z])[a-z0-9]+(?:_[a-z0-9]+)+(?![\w/@-]|\.\w)/g

/**
 * Record text an applicant can read. Records keep some answers as codes ("self_help_group",
 * "once_per_year") and a lone lowercase word ("agriculture", "free"); a code must never reach a
 * founder, so each becomes words, and a code inside a sentence is spelled out where it stands.
 */
export function readableText(text: string): string {
  const trimmed = text.trim()
  if (/^[a-z][a-z0-9_]*$/.test(trimmed)) return humanize(trimmed)
  return trimmed === text ? text.replace(CODE_IN_TEXT, code => code.replace(/_/g, ' ')) : readableText(trimmed)
}

function textList(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0).map(readableText)
}

/** Text for an applicant: in words, trimmed, and nothing at all when it is empty or a reviewer's working note. */
export function publicText(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null
  // Read after the codes are spelled out: a working note written as a code is still a working note.
  const text = readableText(value)
  return isInternalNote(text) ? null : text
}

const DATE_FORMAT = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })

// What an application window says when the record gives none. A page showing it to founders hides it.
export const WINDOW_FALLBACK = 'See official portal'

export type WindowInput = { window_type: string; opens_at: string | null; closes_at: string | null }

/** Short, applicant-facing application-window label. */
export function windowLabel(window: WindowInput | undefined, status: string, now = new Date()): string {
  if (status === 'closed') return 'Closed to new applications'
  if (status === 'paused') return 'Paused: no open call right now'
  if (status === 'pending_renewal') return 'Renewal awaited: scheme period has ended'
  if (!window) return WINDOW_FALLBACK
  if (window.closes_at) {
    const closes = new Date(window.closes_at)
    if (closes >= now) return `Apply by ${DATE_FORMAT.format(closes)}`
    // An active record with a past date usually means an extension we have
    // not recorded yet, so never tell applicants it is closed.
    return status === 'active' ? 'Check official portal for current dates' : `Closed on ${DATE_FORMAT.format(closes)}`
  }
  if (window.opens_at && new Date(window.opens_at) > now) return `Opens ${DATE_FORMAT.format(new Date(window.opens_at))}`
  switch (window.window_type) {
    case 'rolling': return 'Open year-round'
    case 'call_for_applications':
    case 'call_for_proposals': return 'Opens in periodic calls'
    case 'partner_intake': return 'Apply through partner institutions'
    case 'recurring': return 'Recurring intake'
    case 'event': return 'Event-based'
    case 'closed':
    case 'closed_or_claim_only': return 'Closed to new applications'
    default: return WINDOW_FALLBACK
  }
}

export type EligibilityView = {
  conditions: string[]
  exclusions: string[]
  chips: Array<{ label: string; values: string[] }>
  thresholds: Array<{ label: string; value: string }>
}

/** Readable eligibility: plain conditions plus labelled chip groups. */
export function eligibilityView(eligibility: Record<string, unknown> | null | undefined): EligibilityView {
  const source = eligibility ?? {}
  const chipGroups: Array<[string, string]> = [
    ['entity_types', 'Business types'],
    ['founder_categories', 'Founder categories'],
    ['lifecycle_stages', 'Business stage'],
    ['industries', 'Sectors'],
    ['sectors', 'Sectors'],
    ['activities', 'Activities'],
    ['locations', 'Locations'],
  ]
  const chips = chipGroups
    .map(([key, label]) => ({ label, values: textList(source[key]).map(humanize) }))
    .filter(group => group.values.length > 0)

  const thresholdSource = source.thresholds && typeof source.thresholds === 'object' && !Array.isArray(source.thresholds)
    ? source.thresholds as Record<string, unknown>
    : {}
  const thresholds = Object.entries(thresholdSource)
    .map(([key, value]) => ({ label: humanize(key), value: publicText(value) ?? (typeof value === 'number' ? value.toLocaleString('en-IN') : null) }))
    .filter((item): item is { label: string; value: string } => Boolean(item.value))

  return {
    conditions: textList(source.conditions).filter(item => !isInternalNote(item)),
    exclusions: textList(source.exclusions).filter(item => !isInternalNote(item)),
    chips,
    thresholds,
  }
}

export type ApplicationView = { route: string | null; selection: string | null; fees: string | null }

export function applicationView(application: Record<string, unknown> | null | undefined): ApplicationView {
  const source = application ?? {}
  return { route: publicText(source.route), selection: publicText(source.selection), fees: publicText(source.fees) }
}
