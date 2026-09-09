import type { BusinessProfileForMatching } from '@/lib/opportunities/types'

type BusinessRow = {
  name?: string | null
  lifecycle_stage?: string | null
  sector?: string | null
  state?: string | null
}

type FactRow = { fact_key: string; fact_value: unknown; verified_at?: string | null }

function factValue(value: unknown): unknown {
  if (value && typeof value === 'object' && !Array.isArray(value) && 'value' in value) {
    return (value as { value?: unknown }).value
  }
  return value
}

function text(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function numberValue(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) return Number(value)
  return null
}

function booleanValue(value: unknown) {
  return typeof value === 'boolean' ? value : null
}

export function profileFromBusinessFacts(business: BusinessRow, facts: FactRow[]): BusinessProfileForMatching {
  const values = new Map(facts.map(fact => [fact.fact_key, factValue(fact.fact_value)]))
  const valueFor = (...keys: string[]) => keys.map(key => values.get(key)).find(value => value !== undefined)

  return {
    business_name: text(valueFor('business_name')) ?? text(business.name),
    stage: text(valueFor('stage', 'lifecycle_stage')) ?? text(business.lifecycle_stage),
    founder_type: text(valueFor('founder_type', 'founder_category')),
    sector: text(valueFor('sector', 'industry')) ?? text(business.sector),
    state: text(valueFor('state')) ?? text(business.state),
    initial_capital: text(valueFor('initial_capital', 'capital_band')),
    turnover: numberValue(valueFor('turnover', 'annual_turnover')),
    employees: numberValue(valueFor('employees', 'employee_count')),
    has_udyam: booleanValue(valueFor('has_udyam', 'udyam_registered')),
    has_dpiit: booleanValue(valueFor('has_dpiit', 'dpiit_recognized')),
    verified_fact_keys: facts.filter(fact => Boolean(fact.verified_at)).map(fact => fact.fact_key),
  }
}

export function profileCompleteness(profile: BusinessProfileForMatching) {
  return Object.entries(profile)
    .filter(([key]) => key !== 'verified_fact_keys')
    .filter(([, value]) => value !== null && value !== undefined && value !== '').length
}
