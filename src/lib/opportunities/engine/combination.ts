import type { BenefitLines } from './calculator'

export type Relationship = {
  a: string
  b: string
  // sequential means a comes before b.
  relation: 'stackable' | 'exclusive' | 'sequential' | 'conditional' | 'unknown'
  capRule: { max_total_subsidy_pct?: number } | null
  noteEn: string | null
  sourceUrl: string
}

export type Combination = {
  recommended: string[]
  alternatives: { id: string; excludedBy: string[]; notConfirmedWith: string[] }[]
  sequences: { before: string; after: string }[]
}

type Candidate = { id: string; lines: BenefitLines | null }
type PairStatus = 'allowed' | 'excluded' | 'not_confirmed'

// Small enough to try every subset (PRD §10.1).
const MAX_COMBINED = 10

const pairKey = (left: string, right: string) => (left < right ? `${left}|${right}` : `${right}|${left}`)
const subsidyOf = (candidate: Candidate) => candidate.lines?.subsidy.max ?? candidate.lines?.subsidy.min ?? -1

function withinCap(left: Candidate, right: Candidate, relationship: Relationship) {
  const pct = relationship.capRule?.max_total_subsidy_pct
  const cost = left.lines?.projectCost.max
  const leftSubsidy = left.lines?.subsidy.max
  const rightSubsidy = right.lines?.subsidy.max
  if (pct === undefined || cost === undefined || cost === null || leftSubsidy === undefined || leftSubsidy === null || rightSubsidy === undefined || rightSubsidy === null) return false
  return leftSubsidy + rightSubsidy <= (pct / 100) * cost
}

// The engine never assumes two schemes combine: no stored row means not
// confirmed, however different their ministries are (PRD §8.3).
function pairStatus(left: Candidate, right: Candidate, rows: Relationship[]): PairStatus {
  if (rows.some(row => row.relation === 'exclusive')) return 'excluded'
  const conditional = rows.find(row => row.relation === 'conditional')
  if (conditional) return withinCap(left, right, conditional) ? 'allowed' : 'excluded'
  return rows.some(row => row.relation === 'stackable' || row.relation === 'sequential') ? 'allowed' : 'not_confirmed'
}

/** The best set of schemes that can certainly be taken on one project, and why the others are left out. */
export function chooseCombination(candidates: Candidate[], relationships: Relationship[]): Combination {
  const ranked = [...candidates].sort((left, right) => subsidyOf(right) - subsidyOf(left) || left.id.localeCompare(right.id))
  // Only schemes with amounts can be recommended; the rest stay as alternatives.
  const pool = ranked.filter(candidate => candidate.lines).slice(0, MAX_COMBINED)

  const rowsByPair = new Map<string, Relationship[]>()
  for (const row of relationships) {
    const key = pairKey(row.a, row.b)
    rowsByPair.set(key, [...(rowsByPair.get(key) ?? []), row])
  }
  const status = (left: Candidate, right: Candidate) => pairStatus(left, right, rowsByPair.get(pairKey(left.id, right.id)) ?? [])

  let best: Candidate[] = []
  let bestScore = -1
  for (let mask = 1; mask < 2 ** pool.length; mask += 1) {
    const subset = pool.filter((_, index) => mask & (1 << index))
    const compatible = subset.every((left, index) => subset.slice(index + 1).every(right => status(left, right) === 'allowed'))
    if (!compatible) continue
    const score = subset.reduce((sum, candidate) => sum + subsidyOf(candidate), 0)
    if (score > bestScore
      || (score === bestScore && subset.length > best.length)
      || (score === bestScore && subset.length === best.length && subset.map(item => item.id).join() < best.map(item => item.id).join())) {
      best = subset
      bestScore = score
    }
  }

  const recommended = new Set(best.map(candidate => candidate.id))
  const alternatives = ranked
    .filter(candidate => !recommended.has(candidate.id))
    .map(candidate => ({
      id: candidate.id,
      excludedBy: best.filter(chosen => status(candidate, chosen) === 'excluded').map(chosen => chosen.id),
      notConfirmedWith: best.filter(chosen => status(candidate, chosen) === 'not_confirmed').map(chosen => chosen.id),
    }))
  const sequences = relationships
    .filter(row => row.relation === 'sequential' && recommended.has(row.a) && recommended.has(row.b))
    .map(row => ({ before: row.a, after: row.b }))

  return { recommended: best.map(candidate => candidate.id), alternatives, sequences }
}
