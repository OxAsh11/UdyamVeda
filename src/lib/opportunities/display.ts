// Turns raw catalog records into text that is safe to show applicants.
// Approved versions still carry editorial working notes (reviewer guidance,
// "recheck before recommendation", portal caveats); those stay in the
// database for reviewers but are filtered out of every public surface.

const INTERNAL_NOTE = /\b(do not|don't|re-?check|before recommendation|reviewer|codex|seed(ed)? record|dossier|evidence packet|must be (re)?verified|requires? (re)?verification|not (yet )?(established|asserted)|is asserted)\b/i

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

function publicText(value: unknown): string | null {
  return typeof value === 'string' && value.trim() && !isInternalNote(value) ? value.trim() : null
}

const DATE_FORMAT = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })

export type WindowInput = { window_type: string; opens_at: string | null; closes_at: string | null }

/** Short, applicant-facing application-window label. */
export function windowLabel(window: WindowInput | undefined, status: string, now = new Date()): string {
  if (status === 'closed') return 'Closed to new applications'
  if (status === 'paused') return 'Paused: no open call right now'
  if (!window) return 'See official portal'
  if (window.closes_at) {
    const closes = new Date(window.closes_at)
    return closes < now ? `Closed on ${DATE_FORMAT.format(closes)}` : `Apply by ${DATE_FORMAT.format(closes)}`
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
