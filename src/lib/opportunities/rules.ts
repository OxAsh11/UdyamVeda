export type RuleFactMap = Record<string, unknown>

export type RuleEvaluation = {
  result: boolean | null
  reasons: string[]
  missingFacts: string[]
  blockers: string[]
  usedFacts: string[]
}

const comparisonOperators = new Set([
  'equals', 'not_equals', 'greater_than', 'greater_than_or_equal',
  'less_than', 'less_than_or_equal', 'in', 'not_in', 'contains',
  'starts_with', 'exists', 'not_exists',
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isMissing(value: unknown) {
  return value === undefined || value === null || value === ''
}

function fieldLabel(field: string) {
  return field.replace(/[_-]+/g, ' ').replace(/\b\w/g, character => character.toUpperCase())
}

function valueLabel(value: unknown): string {
  if (Array.isArray(value)) return value.map(valueLabel).join(', ')
  if (typeof value === 'boolean') return value ? 'yes' : 'no'
  if (value === null || value === undefined) return 'provided'
  return String(value)
}

function includesValue(actual: unknown, expected: unknown) {
  if (Array.isArray(actual)) return actual.some(item => Object.is(item, expected))
  if (typeof actual === 'string' && typeof expected === 'string') return actual.toLowerCase().includes(expected.toLowerCase())
  return false
}

function compare(actual: unknown, operator: string, expected: unknown): boolean | null {
  if (!comparisonOperators.has(operator)) return null
  if (operator === 'exists') return !isMissing(actual)
  if (operator === 'not_exists') return isMissing(actual)
  if (isMissing(actual)) return null

  switch (operator) {
    case 'equals': return Object.is(actual, expected)
    case 'not_equals': return !Object.is(actual, expected)
    case 'greater_than': return typeof actual === 'number' && typeof expected === 'number' ? actual > expected : null
    case 'greater_than_or_equal': return typeof actual === 'number' && typeof expected === 'number' ? actual >= expected : null
    case 'less_than': return typeof actual === 'number' && typeof expected === 'number' ? actual < expected : null
    case 'less_than_or_equal': return typeof actual === 'number' && typeof expected === 'number' ? actual <= expected : null
    case 'in': return Array.isArray(expected) ? expected.some(item => Object.is(item, actual)) : null
    case 'not_in': return Array.isArray(expected) ? !expected.some(item => Object.is(item, actual)) : null
    case 'contains': return includesValue(actual, expected)
    case 'starts_with': return typeof actual === 'string' && typeof expected === 'string' ? actual.toLowerCase().startsWith(expected.toLowerCase()) : null
    default: return null
  }
}

function combineAll(children: RuleEvaluation[]): RuleEvaluation {
  const failures = children.filter(child => child.result === false)
  const unknown = children.filter(child => child.result === null)
  return {
    result: failures.length > 0 ? false : unknown.length > 0 ? null : true,
    reasons: children.flatMap(child => child.reasons),
    missingFacts: [...new Set(children.flatMap(child => child.missingFacts))],
    blockers: [...new Set(children.flatMap(child => child.blockers))],
    usedFacts: [...new Set(children.flatMap(child => child.usedFacts))],
  }
}

function combineAny(children: RuleEvaluation[]): RuleEvaluation {
  const passing = children.filter(child => child.result === true)
  const unknown = children.filter(child => child.result === null)
  return {
    result: passing.length > 0 ? true : unknown.length > 0 ? null : false,
    reasons: children.flatMap(child => child.reasons),
    missingFacts: [...new Set(children.flatMap(child => child.missingFacts))],
    blockers: [...new Set(children.flatMap(child => child.blockers))],
    usedFacts: [...new Set(children.flatMap(child => child.usedFacts))],
  }
}

function evaluateNode(node: unknown, facts: RuleFactMap): RuleEvaluation {
  if (!isRecord(node)) return { result: null, reasons: [], missingFacts: [], blockers: ['Malformed eligibility rule'], usedFacts: [] }
  if ('all' in node) {
    return combineAll(Array.isArray(node.all) ? node.all.map(child => evaluateNode(child, facts)) : [{ result: null, reasons: [], missingFacts: [], blockers: ['Malformed all rule'], usedFacts: [] }])
  }
  if ('any' in node) {
    return combineAny(Array.isArray(node.any) ? node.any.map(child => evaluateNode(child, facts)) : [{ result: null, reasons: [], missingFacts: [], blockers: ['Malformed any rule'], usedFacts: [] }])
  }

  const field = typeof node.field === 'string' ? node.field : ''
  const operator = typeof node.operator === 'string' ? node.operator : ''
  if (!field || !operator) return { result: null, reasons: [], missingFacts: [], blockers: ['Malformed eligibility rule'], usedFacts: [] }

  const result = compare(facts[field], operator, node.value)
  if (result === null) return { result: null, reasons: [], missingFacts: [field], blockers: [], usedFacts: [] }
  if (result) return { result: true, reasons: [`${fieldLabel(field)} matches the official eligibility rule`], missingFacts: [], blockers: [], usedFacts: [field] }
  return {
    result: false,
    reasons: [],
    missingFacts: [],
    blockers: [`${fieldLabel(field)} does not satisfy the official requirement${operator === 'equals' || operator === 'in' ? ` (${valueLabel(node.value)})` : ''}`],
    usedFacts: [field],
  }
}

export function evaluateEligibilityRules(rules: unknown, facts: RuleFactMap): RuleEvaluation {
  const root = isRecord(rules) ? rules : {}
  const evaluation = evaluateNode(root, facts)
  if (evaluation.result === null && root.unknown_handling === 'fail_closed') {
    return { ...evaluation, result: false, blockers: [...evaluation.blockers, 'Required eligibility information is missing'] }
  }
  return evaluation
}
