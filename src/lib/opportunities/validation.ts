import { completenessFor } from './editorial'

export type ExtractedOpportunityDraft = {
  name?: unknown
  summary?: unknown
  opportunity_type?: unknown
  objective?: unknown
  legal_basis?: unknown
  authority?: unknown
  eligibility?: unknown
  benefit_summary?: unknown
  benefits?: unknown
  application?: unknown
  fine_print?: unknown
  requirements?: unknown
  steps?: unknown
  sources?: unknown
  effective_dates?: unknown
  geography?: unknown
  legacy_import?: unknown
}

export type DraftValidation = {
  completeness: number
  errors: string[]
  warnings: string[]
  valid: boolean
}

const RULE_OPERATORS = new Set([
  'equals',
  'not_equals',
  'greater_than',
  'greater_than_or_equal',
  'less_than',
  'less_than_or_equal',
  'in',
  'not_in',
  'contains',
  'starts_with',
  'exists',
  'not_exists',
])

const UNKNOWN_HANDLING = new Set(['needs_information', 'fail_closed', 'pass_through'])

function present(value: unknown) {
  if (value === undefined || value === null || value === '') return false
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'object') return Object.keys(value as Record<string, unknown>).length > 0
  return true
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function validateEligibilityRules(input: unknown): string[] {
  const errors: string[] = []
  if (!isObject(input)) return ['Eligibility rules must be an object.']

  const rootHandling = input.unknown_handling
  if (rootHandling !== undefined && (typeof rootHandling !== 'string' || !UNKNOWN_HANDLING.has(rootHandling))) {
    errors.push('Eligibility rules have an unsupported unknown_handling value.')
  }

  function visit(node: unknown, path: string) {
    if (!isObject(node)) {
      errors.push(path + ' must be an object.')
      return
    }
    const groupKeys = ['all', 'any'].filter(key => key in node)
    if (groupKeys.length > 1) errors.push(path + ' cannot contain both all and any.')
    if (groupKeys.length === 1) {
      const key = groupKeys[0]
      const children = node[key]
      if (!Array.isArray(children) || children.length === 0) {
        errors.push(path + '.' + key + ' must be a non-empty array.')
        return
      }
      children.forEach((child, index) => visit(child, path + '.' + key + '[' + index + ']'))
      return
    }

    if (typeof node.field !== 'string' || !node.field.trim()) errors.push(path + '.field is required.')
    if (typeof node.operator !== 'string' || !RULE_OPERATORS.has(node.operator)) {
      errors.push(path + '.operator is unsupported or missing.')
      return
    }
    if (!['exists', 'not_exists'].includes(node.operator) && !('value' in node)) {
      errors.push(path + '.value is required for ' + node.operator + '.')
    }
    if (['in', 'not_in'].includes(node.operator) && !Array.isArray(node.value)) {
      errors.push(path + '.value must be an array for ' + node.operator + '.')
    }
  }

  const hasRootGroup = 'all' in input || 'any' in input
  if (!hasRootGroup) errors.push('Eligibility rules must have an all or any root group.')
  else visit(input, 'rules')
  return errors
}

export function validateBenefitAmounts(input: unknown): string[] {
  if (!Array.isArray(input)) return []
  const errors: string[] = []
  input.forEach((value, index) => {
    if (!isObject(value)) {
      errors.push('benefits[' + index + '] must be an object.')
      return
    }
    const minimum = value.amount_min
    const maximum = value.amount_max
    const percentage = value.percentage
    if (minimum !== undefined && minimum !== null && (typeof minimum !== 'number' || !Number.isFinite(minimum) || minimum < 0)) errors.push('benefits[' + index + '].amount_min must be a non-negative number.')
    if (maximum !== undefined && maximum !== null && (typeof maximum !== 'number' || !Number.isFinite(maximum) || maximum < 0)) errors.push('benefits[' + index + '].amount_max must be a non-negative number.')
    if (typeof minimum === 'number' && typeof maximum === 'number' && maximum < minimum) errors.push('benefits[' + index + '].amount_max cannot be lower than amount_min.')
    if (percentage !== undefined && percentage !== null && (typeof percentage !== 'number' || !Number.isFinite(percentage) || percentage < 0 || percentage > 100)) errors.push('benefits[' + index + '].percentage must be between 0 and 100.')
  })
  return errors
}

export function validateOpportunityDraft(draft: ExtractedOpportunityDraft): DraftValidation {
  const completeness = completenessFor({
    name: draft.name,
    objective: draft.objective,
    authority: draft.authority,
    eligibility: draft.eligibility,
    benefit_summary: present(draft.benefit_summary) || present(draft.benefits) ? draft.benefit_summary ?? draft.benefits : undefined,
    application: draft.application,
    fine_print: draft.fine_print,
    requirements: draft.requirements,
    steps: draft.steps,
    sources: draft.sources,
    effective_dates: draft.effective_dates,
  })
  const errors: string[] = []
  const warnings: string[] = []

  if (draft.legacy_import === true) {
    errors.push('Legacy imported records require official-source review before promotion.')
  }

  errors.push(...validateEligibilityRules(draft.eligibility))
  errors.push(...validateBenefitAmounts(draft.benefits))

  for (const field of ['name', 'objective', 'authority', 'eligibility', 'application', 'fine_print', 'requirements', 'steps', 'sources'] as const) {
    if (!present(draft[field])) errors.push('Missing required field: ' + field)
  }
  if (!present(draft.benefit_summary) && !present(draft.benefits)) errors.push('Missing required field: benefit_summary or benefits')
  if (!present(draft.effective_dates)) warnings.push('Effective dates are not explicit; reviewer must confirm whether the opportunity is current.')
  if (Array.isArray(draft.sources)) {
    const sources = draft.sources as Array<Record<string, unknown>>
    if (sources.some(source => typeof source.url !== 'string' || !/^https:\/\//i.test(source.url))) {
      errors.push('Every source must include an HTTPS URL.')
    }
  }
  if (typeof draft.opportunity_type !== 'string' || !draft.opportunity_type) warnings.push('Opportunity type was not confidently extracted.')
  if (completeness < 0.95) warnings.push('Completeness is ' + Math.round(completeness * 100) + '%; publication requires at least 95%.')

  return { completeness, errors, warnings, valid: errors.length === 0 }
}
