// Saved answers as the flow expects them. Accounts made before the question flow
// hold display labels ("Maharashtra", "pre-launch"), so those are converted when
// read. Old sector labels mean nothing to the rules, so they are simply re-asked.
type FactRow = { fact_key: string; fact_value: unknown; answer_state?: string | null }

const LEGACY_STAGES: Record<string, string> = {
  'pre-launch': 'idea',
  'just-started': 'running',
  '1-2-years': 'running',
  '2-plus': 'running',
  'Just an idea': 'idea',
  'Setting it up now': 'setting_up',
  'Already running': 'running',
}

const LEGACY_STATES: Record<string, string> = {
  'jammu & kashmir': 'jammu_kashmir',
  'andaman & nicobar': 'andaman_nicobar',
  'dadra & nagar haveli': 'dadra_nagar_haveli_daman_diu',
  'daman & diu': 'dadra_nagar_haveli_daman_diu',
  'jammu and kashmir': 'jammu_kashmir',
  'andaman and nicobar islands': 'andaman_nicobar',
  'dadra and nagar haveli and daman and diu': 'dadra_nagar_haveli_daman_diu',
}

const NON_ANSWER_VALUES: Record<string, string> = { declined: 'prefer_not', dont_know: 'dont_know' }

function storedValue(value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as { value?: unknown }).value : value
}

function stateCode(value: string) {
  const label = value.trim().toLowerCase()
  return LEGACY_STATES[label] ?? label.replace(/\s+/g, '_')
}

/** Facts from what an old account's founder type can tell us, without guessing. */
function fromLegacyFounderType(value: unknown): Record<string, unknown> {
  if (value === 'women') return { gender: 'woman' }
  if (value === 'ex-serviceman') return { ex_serviceman: true }
  return {}
}

export function founderFactsFromRows(rows: FactRow[]): Record<string, unknown> {
  const facts: Record<string, unknown> = {}
  let legacy: Record<string, unknown> = {}

  for (const row of rows) {
    const value = storedValue(row.fact_value)
    if (value === undefined || value === null || value === '') {
      // A value saved later (from Settings) outranks an earlier "don't know".
      const nonAnswer = row.answer_state ? NON_ANSWER_VALUES[row.answer_state] : undefined
      if (nonAnswer) facts[row.fact_key] = nonAnswer
      continue
    }

    if (row.fact_key === 'founder_type') legacy = fromLegacyFounderType(value)
    else if (row.fact_key === 'sector' || row.fact_key === 'business_name' || row.fact_key === 'initial_capital') continue
    else if (row.fact_key === 'state' && typeof value === 'string') facts.state = stateCode(value)
    else if (row.fact_key === 'stage' && typeof value === 'string') facts.stage = LEGACY_STAGES[value] ?? value
    else facts[row.fact_key] = value
  }

  // A new answer always wins over what was inferred from an old one.
  return { ...legacy, ...facts }
}
