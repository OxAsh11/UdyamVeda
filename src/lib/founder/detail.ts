// What the scheme page works out before it draws anything: what a scheme means for this
// founder in money, what to keep ready, which other schemes it is tied to, and the
// founder's own saved and started state. None of it decides eligibility; verdicts come
// from the rules engine and are only worded here.
import type { SupabaseClient } from '@supabase/supabase-js'
import { getBusinessForUser } from '@/lib/businesses/dal'
import type { BenefitLines } from '@/lib/opportunities/engine/calculator'
import type { Combination, Relationship } from '@/lib/opportunities/engine/combination'
import type { RecordResult, ResultsPayload } from '@/lib/opportunities/engine/results'
import { applicationView, eligibilityView, isInternalNote, publicText, type ApplicationView, type EligibilityView } from '@/lib/opportunities/display'
import type { OpportunityDetail } from '@/lib/opportunities/types'
import { formatRange } from '@/lib/start/format'
import { t } from '@/lib/start/i18n'
import type { Lang } from '@/lib/start/types'
import { hasAmount, loanValue, roundedRate } from './card'
import { findResult } from './browse'
import type { FounderResults } from './load-results'
import { ft } from './text'
import { onPathVerdict, verdictFor, type Verdict } from './verdict'

/** The one-paragraph suggestion for a scheme in the best route, or nothing when it would be a guess. */
export function suggestionFor(item: RecordResult, combination: Combination, lang: Lang): string | null {
  if (item.bucket !== 'A' || !item.lines || !combination.recommended.includes(item.id)) return null
  const left = hasAmount(item.lines.uncovered) ? ft('suggestArrange', { range: formatRange(item.lines.uncovered, lang) }) : null
  return [ft('suggestStart'), left].filter((part): part is string => part !== null).join(' ')
}

export type MoneyTileView = {
  label: string
  value: string
  note: string | null
  // go: free money or a lower rate. step: still to arrange. plain: money you must pay back.
  tone: 'go' | 'step' | 'plain'
}

/**
 * The tiles under a scheme's name: each line the calculator worked out, standing alone and in the
 * order a founder reads a budget. A tile with no value is left out, never shown as zero by default.
 */
export function moneyTiles(lines: BenefitLines, lang: Lang): MoneyTileView[] {
  const renewed = lines.ifRenewed
  const loan = lines.loan && hasAmount(lines.loan) ? lines.loan : null
  const rate = lines.interestRatePct
  const relief = lines.interestSubventionPct
  const tiles: MoneyTileView[] = []

  if (loan) {
    tiles.push({ label: t(lang, renewed ? 'moneyLoanRenewed' : 'moneyLoan'), value: loanValue(lines, loan, lang), note: ft('tileLoanNote'), tone: 'plain' })
  }
  if (loan && rate !== null) {
    tiles.push(relief
      ? { label: ft('tileInterest'), value: `${roundedRate(rate - relief)}%`, note: ft('tileInterestOtherwise', { rate: roundedRate(rate) }), tone: 'go' }
      : { label: ft('tileInterestPlain'), value: `${roundedRate(rate)}%`, note: null, tone: 'plain' })
  }
  if (hasAmount(lines.subsidy)) {
    tiles.push({ label: renewed ? t(lang, 'moneyFreeRenewed') : ft('tileFree'), value: formatRange(lines.subsidy, lang), note: null, tone: 'go' })
  } else if (loan) {
    // Only next to a loan is "credit, not a subsidy" true; with nothing else there is nothing to say.
    tiles.push({ label: ft('tileFree'), value: formatRange(lines.subsidy, lang), note: ft('tileFreeNote'), tone: 'plain' })
  }
  if (hasAmount(lines.uncovered)) {
    tiles.push({ label: t(lang, 'toArrange'), value: formatRange(lines.uncovered, lang), note: lines.own ? null : t(lang, 'toArrangeNote'), tone: 'step' })
  }
  return tiles
}

const isYes = (value: unknown) => value === true
const isOneOf = (...values: string[]) => (value: unknown) => typeof value === 'string' && values.includes(value)

// The answers that mean the founder has what a document needs. "No", "don't know" and "prefer not
// to say" are all missing from these, so none of them can be read as having it.
const DOCUMENT_FACTS: { factKey: string; named: RegExp; hasIt: (value: unknown) => boolean }[] = [
  { factKey: 'aadhaar_mobile_linked', named: /aadhaar/i, hasIt: isYes },
  // Case matters: "pan" is also an ordinary word.
  { factKey: 'has_pan', named: /\bPAN\b/, hasIt: isYes },
  { factKey: 'has_bank_account', named: /bank account|passbook/i, hasIt: isYes },
  { factKey: 'udyam_registered', named: /udyam/i, hasIt: isYes },
  { factKey: 'gst_registered', named: /\bGST/i, hasIt: isYes },
  { factKey: 'shop_act_registered', named: /shop act|trade licen[cs]e/i, hasIt: isYes },
  { factKey: 'training_certificate', named: /training|\bEDP\b/i, hasIt: isYes },
  { factKey: 'dpiit_recognized', named: /DPIIT|startup recognition/i, hasIt: isYes },
  { factKey: 'fssai_status', named: /FSSAI/i, hasIt: isOneOf('basic_registration', 'state_licence', 'central_licence') },
  // A lease with no registered papers is not papers to hand over.
  { factKey: 'land_or_pond_status', named: /\b(land|pond|lease)/i, hasIt: isOneOf('owned', 'family_owned', 'registered_lease') },
]

// "Aadhaar and PAN" is two documents: the founder has it only if they have both.
const PARTS_OF_A_DOCUMENT = /,|&|\band\b/i

function hasDocument(name: string, answers: Record<string, unknown>): boolean {
  return name.split(PARTS_OF_A_DOCUMENT).every(part => {
    const facts = DOCUMENT_FACTS.filter(fact => fact.named.test(part))
    // A part no answer covers (address proof, a project report) is never claimed.
    return facts.length > 0 && facts.every(fact => fact.hasIt(answers[fact.factKey]))
  })
}

/** What a scheme asks you to keep ready, with a mark on what the founder said they already have. */
export function keepReady<T extends { name: string; required: boolean }>(requirements: T[], answers: Record<string, unknown>): (T & { have: boolean })[] {
  return requirements.map(requirement => ({ ...requirement, have: hasDocument(requirement.name, answers) }))
}

export type ConnectedScheme = { slug: string; title: string; verdict: Verdict; note: string | null }

type Tie = 'together' | 'not_confirmed' | 'excluded'

const TIE_OF_ROW: Record<Relationship['relation'], Tie> = {
  exclusive: 'excluded',
  stackable: 'together',
  sequential: 'together',
  conditional: 'not_confirmed',
  unknown: 'not_confirmed',
}

const isPair = (row: Relationship, left: string, right: string) => (row.a === left && row.b === right) || (row.a === right && row.b === left)

/**
 * The other schemes this one is tied to, among the founder's own: the best route and the schemes
 * that are not confirmed with it or cannot be taken with it, whichever of the two is being read,
 * then any stored relationship. A scheme not for the founder is not worth a link, so it is left out.
 * Each one carries the verdict the cards give it. `item` need not be in the results.
 */
export function connectedSchemes(
  item: Pick<RecordResult, 'id' | 'title'>,
  results: ResultsPayload,
  relationships: Relationship[],
  lang: Lang,
  labelOf: (factKey: string) => string,
  now: Date = new Date(),
): ConnectedScheme[] {
  const known = new Map<string, RecordResult>([...results.buckets.A, ...results.buckets.B, ...results.buckets.C, ...results.registrations].map(result => [result.id, result]))
  const registrations = new Set(results.registrations.map(result => result.id))
  const ties = new Map<string, Tie>()
  const tie = (id: string, how: Tie) => {
    if (id !== item.id && known.has(id) && !ties.has(id)) ties.set(id, how)
  }

  const { recommended, alternatives } = results.combination
  if (recommended.includes(item.id)) {
    for (const id of recommended) tie(id, 'together')
    for (const alternative of alternatives) {
      if (alternative.excludedBy.includes(item.id)) tie(alternative.id, 'excluded')
      else if (alternative.notConfirmedWith.includes(item.id)) tie(alternative.id, 'not_confirmed')
    }
  } else {
    const alternative = alternatives.find(candidate => candidate.id === item.id)
    if (alternative) {
      for (const id of recommended) {
        tie(id, alternative.excludedBy.includes(id) ? 'excluded' : alternative.notConfirmedWith.includes(id) ? 'not_confirmed' : 'together')
      }
    }
  }
  for (const row of relationships) {
    if (row.a === item.id) tie(row.b, TIE_OF_ROW[row.relation])
    else if (row.b === item.id) tie(row.a, TIE_OF_ROW[row.relation])
  }

  const noteFor = (id: string, how: Tie) => {
    // A note written for this pair says more than the general sentence.
    const written = relationships.find(row => isPair(row, item.id, id) && row.noteEn?.trim())?.noteEn?.trim()
    if (written) return written
    if (how === 'together') return ft('connectedTogether')
    return how === 'excluded' ? t(lang, 'excludedByName', { names: item.title }) : t(lang, 'notConfirmedWith', { names: item.title })
  }

  return [...ties].map(([id, how]) => {
    const other = known.get(id)!
    return {
      slug: other.slug,
      title: other.title,
      verdict: registrations.has(id) ? onPathVerdict(lang) : verdictFor(other, results.combination, lang, labelOf, now),
      note: noteFor(id, how),
    }
  })
}

/**
 * Whether to offer "Start my application checklist". Not for a scheme the rules say is not for
 * this founder, or one left out of their results; with no verdict to go by it is offered.
 */
export function offersChecklist(founder: FounderResults, slug: string): boolean {
  if (founder.status !== 'ready') return true
  if (founder.results.registrations.some(registration => registration.slug === slug)) return true
  const item = findResult(founder.results, slug)
  return item !== undefined && item.bucket !== 'D'
}

export type RecordSections = {
  eligibility: EligibilityView | null
  about: { objective: string | null; legalBasis: string | null } | null
  apply: ApplicationView | null
  steps: OpportunityDetail['steps']
}

/**
 * What the record itself says, for every founder, whether or not they have answers. A section
 * the record leaves empty is null, and a reviewer's working note is never shown.
 */
export function recordSections(record: Pick<OpportunityDetail, 'eligibility' | 'application' | 'objective' | 'legalBasis' | 'steps'>): RecordSections {
  const eligibility = eligibilityView(record.eligibility)
  const apply = applicationView(record.application)
  const objective = publicText(record.objective)
  const legalBasis = publicText(record.legalBasis)
  return {
    eligibility: [eligibility.chips, eligibility.conditions, eligibility.thresholds, eligibility.exclusions].some(list => list.length > 0) ? eligibility : null,
    about: objective || legalBasis ? { objective, legalBasis } : null,
    apply: apply.route || apply.selection || apply.fees ? apply : null,
    steps: record.steps.filter(step => !isInternalNote(step.title)),
  }
}

export type SchemeState = { applicationId: string | null; saved: boolean }

const NO_STATE: SchemeState = { applicationId: null, saved: false }

// One failed read must not take the other down, or the page.
async function rowsOf(read: PromiseLike<{ data: unknown; error: unknown }>): Promise<Record<string, unknown>[]> {
  try {
    const { data, error } = await read
    return error || !Array.isArray(data) ? [] : data
  } catch {
    return []
  }
}

/**
 * Whether this founder has started an application for the scheme, and whether they saved it.
 * A failed read leaves that part out; Save and Start are then offered, and Start finds an
 * existing application for itself.
 */
export async function loadSchemeState(supabase: SupabaseClient, userId: string, slug: string): Promise<SchemeState> {
  try {
    const { business } = await getBusinessForUser(supabase, userId)
    if (!business) return NO_STATE
    const [applications, saved] = await Promise.all([
      rowsOf(supabase.from('applications')
        .select('id, status, opportunity:opportunities!inner(slug)')
        .eq('business_id', business.id)
        .eq('opportunity.slug', slug)
        .neq('status', 'withdrawn')
        .order('created_at', { ascending: false })
        .limit(1)),
      rowsOf(supabase.from('saved_opportunities')
        .select('status, opportunity:opportunities!inner(slug)')
        .eq('business_id', business.id)
        .eq('opportunity.slug', slug)
        .limit(1)),
    ])
    const id = applications[0]?.id
    // Once it is an application it is no longer "saved for later".
    return { applicationId: typeof id === 'string' ? id : null, saved: saved.some(row => row.status === 'saved') }
  } catch {
    return NO_STATE
  }
}

export type RateQuote = { quote: string; sourceUrl: string }

/**
 * The words of the source behind the rate the founder's figures came from. The engine does not
 * carry them, so they are read for this version of the scheme; without a match there is no quote.
 */
export async function loadRateQuote(supabase: SupabaseClient, versionId: string, rateLabel: string): Promise<RateQuote | null> {
  try {
    const { data, error } = await supabase.from('benefit_rates').select('quote, source_url, label_en').eq('opportunity_version_id', versionId)
    if (error || !Array.isArray(data)) return null
    const row = data.find(candidate => candidate.label_en === rateLabel)
    if (!row) return null
    const quote = typeof row.quote === 'string' ? row.quote.trim() : ''
    return quote && typeof row.source_url === 'string' && row.source_url.startsWith('https://') ? { quote, sourceUrl: row.source_url } : null
  } catch {
    return null
  }
}
