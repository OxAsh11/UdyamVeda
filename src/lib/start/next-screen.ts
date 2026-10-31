import type { EngineCatalog } from '@/lib/opportunities/engine/catalog'
import { buildResults, type RecordResult } from '@/lib/opportunities/engine/results'
import type { CanonicalFacts } from '@/lib/opportunities/engine/types'
import { evaluateEligibilityRules } from '@/lib/opportunities/rules'
import type { FlowFact, FlowQuestion, StartBundle } from './types'

// Results appear after stage 7; later answers only sharpen them (PRD §7.2).
const LAST_FIRST_RESULT_STAGE = 7
// "Refined by up to 7 more questions" (PRD §7).
export const MAX_REFINE_QUESTIONS = 7

export type ScreenQuestion = FlowQuestion & { facts: FlowFact[] }

export type NextStep = {
  phase: 'first' | 'refine' | 'done'
  stage: number | null
  questions: ScreenQuestion[]
  // How many schemes the refinement question would settle or re-price.
  decides: number
  refineLeft: number
  // Sharpening questions already answered, so a slip can still be corrected.
  answered: ScreenQuestion[]
}

type FlowInput = {
  facts: CanonicalFacts
  nonAnswers: Record<string, string>
  asked: readonly string[]
}

function founderPacks(facts: CanonicalFacts, bundle: StartBundle) {
  const chosen = facts.activity_codes
  if (!Array.isArray(chosen) || !chosen.length) return null
  return new Set(bundle.activities.filter(activity => chosen.includes(activity.id)).flatMap(activity => activity.packIds))
}

// A fact tied to packs is only for founders in one of them. Until the activity
// is known there is nothing to rule it out on.
function factFits(fact: FlowFact, packs: Set<string> | null) {
  return !fact.packIds.length || !packs || fact.packIds.some(pack => packs.has(pack))
}

function screenQuestion(question: FlowQuestion, facts: CanonicalFacts, packs: Set<string> | null, bundle: StartBundle): ScreenQuestion | null {
  if (question.dependsOn && evaluateEligibilityRules(question.dependsOn, facts).result !== true) return null
  const fitting = question.factKeys.flatMap(key => {
    const fact = bundle.facts[key]
    return fact && factFits(fact, packs) ? [fact] : []
  })
  return fitting.length ? { ...question, factKeys: fitting.map(fact => fact.key), facts: fitting } : null
}

function fieldsIn(node: unknown): string[] {
  if (!node || typeof node !== 'object') return []
  const record = node as Record<string, unknown>
  if (Array.isArray(record.all)) return record.all.flatMap(fieldsIn)
  if (Array.isArray(record.any)) return record.any.flatMap(fieldsIn)
  return typeof record.field === 'string' ? [record.field] : []
}

/** How many schemes a question would settle: open steps naming its facts, or a better rate waiting on them. */
function schemesDecided(question: ScreenQuestion, unsettled: RecordResult[]) {
  return unsettled.filter(item => item.steps.some(step => step.kind === 'answer' && question.factKeys.includes(step.factKey))
    || item.lines?.betterIfAnswered.some(key => question.factKeys.includes(key))).length
}

/**
 * The next thing to ask. The first-result screens come in order, as whole
 * screens. After that, one question at a time: whichever settles the most
 * schemes for this founder, and nothing that would settle none.
 */
export function nextStep(input: FlowInput, bundle: StartBundle, catalog: EngineCatalog, now: Date): NextStep {
  const asked = new Set(input.asked)
  const packs = founderPacks(input.facts, bundle)
  const isOpen = (question: FlowQuestion) => !asked.has(question.id)
  const shown = (question: FlowQuestion) => screenQuestion(question, input.facts, packs, bundle)
  const answered = bundle.questions
    .filter(question => question.stage > LAST_FIRST_RESULT_STAGE && asked.has(question.id))
    .flatMap(question => shown({ ...question, dependsOn: null }) ?? [])

  const stages = [...new Set(bundle.questions.filter(question => question.stage <= LAST_FIRST_RESULT_STAGE).map(question => question.stage))].sort((left, right) => left - right)
  for (const stage of stages) {
    const open = bundle.questions.filter(question => question.stage === stage && isOpen(question))
    const unansweredHere = new Set(open.flatMap(question => question.factKeys).filter(key => input.facts[key] === undefined && !input.nonAnswers[key]))
    const questions = open.flatMap(question => {
      // A follow-up stays on the screen of the answer that triggers it; the page
      // reveals it, so it costs the founder no extra screen.
      if (!fieldsIn(question.dependsOn).some(field => unansweredHere.has(field))) return shown(question) ?? []
      const followUp = shown({ ...question, dependsOn: null })
      return followUp ? [{ ...followUp, dependsOn: question.dependsOn }] : []
    })
    if (questions.length) return { phase: 'first', stage, questions, decides: 0, refineLeft: MAX_REFINE_QUESTIONS, answered }
  }

  const refineAsked = bundle.questions.filter(question => question.stage > LAST_FIRST_RESULT_STAGE && asked.has(question.id)).length
  const refineLeft = Math.max(0, MAX_REFINE_QUESTIONS - refineAsked)
  const finished: NextStep = { phase: 'done', stage: null, questions: [], decides: 0, refineLeft, answered }
  if (!refineLeft) return finished

  const { buckets } = buildResults(input.facts, input.nonAnswers, catalog, now)
  const unsettled = [...buckets.A, ...buckets.B, ...buckets.C]
  let best: ScreenQuestion | null = null
  let bestDecides = 0
  for (const question of bundle.questions) {
    if (question.stage <= LAST_FIRST_RESULT_STAGE || !isOpen(question)) continue
    const candidate = shown(question)
    if (!candidate) continue
    const decides = schemesDecided(candidate, unsettled)
    if (decides > bestDecides) {
      best = candidate
      bestDecides = decides
    }
  }
  return best ? { phase: 'refine', stage: best.stage, questions: [best], decides: bestDecides, refineLeft, answered } : finished
}
