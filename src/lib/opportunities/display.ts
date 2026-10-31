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

function textList(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

/** Text for an applicant: trimmed, and nothing at all when it is empty or a reviewer's working note. */
export function publicText(value: unknown): string | null {
  return typeof value === 'string' && value.trim() && !isInternalNote(value) ? value.trim() : null
}

const DATE_FORMAT = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })

export type WindowInput = { window_type: string; opens_at: string | null; closes_at: string | null }

/** Short, applicant-facing application-window label. */
export function windowLabel(window: WindowInput | undefined, status: string, now = new Date()): string {
  if (status === 'closed') return 'Closed to new applications'
  if (status === 'paused') return 'Paused: no open call right now'
  if (status === 'pending_renewal') return 'Renewal awaited: scheme period has ended'
  if (!window) return 'See official portal'
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
    default: return 'See official portal'
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
