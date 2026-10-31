// Translates a founder's canonical facts (fact_definitions keys) into the
// field names the approved eligibility rules were written with.
//
// Approved rule sets are immutable, so instead of rewriting them every legacy
// rule field has one row in rule_field_mappings:
//   fact        → reads one canonical fact, optionally through a value map
//   derived     → computed from canonical facts by a named derivation below
//   bank_check  → a condition only the bank/DIC/department can confirm; it
//                 never decides the founder's result and is shown as a note
// Fields with no mapping stay unknown, exactly as before.
import type { AnyOf, NumberRange, RuleFactMap } from './rules'

export type RuleFieldMapping = {
  legacy_field: string
  treatment: 'fact' | 'derived' | 'bank_check'
  fact_key: string | null
  // canonical value → legacy value(s); an array becomes "any of these"
  value_map: Record<string, unknown> | null
  derive: string | null
  check_note_en: string | null
}

export type CanonicalFacts = Record<string, unknown>

export type DerivationContext = {
  now: Date
  // activity id → pack ids, from public.activity_packs
  activityPacks: Readonly<Record<string, readonly string[]>>
}

// A derivation returns undefined when the founder has not answered the facts
// it needs (the rule stays unknown) and null / false / an empty AnyOf when
// they have answered and the answer does not qualify.
type Derivation = (facts: CanonicalFacts, context: DerivationContext) => unknown

const LAKH = 100_000
const CRORE = 10_000_000

// Inclusive bounds for every band in supabase/seed/mvp/facts.json.
export const BAND_RANGES: Record<string, Record<string, NumberRange>> = {
  annual_turnover_band: {
    up_to_5l: { min: 0, max: 5 * LAKH },
    '5l_20l': { min: 5 * LAKH, max: 20 * LAKH },
    '20l_40l': { min: 20 * LAKH, max: 40 * LAKH },
    '40l_1_5cr': { min: 40 * LAKH, max: 1.5 * CRORE },
    '1_5cr_10cr': { min: 1.5 * CRORE, max: 10 * CRORE },
    '10cr_100cr': { min: 10 * CRORE, max: 100 * CRORE },
    above_100cr: { min: 100 * CRORE, max: Number.POSITIVE_INFINITY },
  },
  project_cost_band: {
    up_to_1l: { min: 0, max: LAKH },
    '1l_2l': { min: LAKH, max: 2 * LAKH },
    '2l_5l': { min: 2 * LAKH, max: 5 * LAKH },
    '5l_10l': { min: 5 * LAKH, max: 10 * LAKH },
    '10l_25l': { min: 10 * LAKH, max: 25 * LAKH },
    '25l_50l': { min: 25 * LAKH, max: 50 * LAKH },
    '50l_1cr': { min: 50 * LAKH, max: CRORE },
    '1cr_2cr': { min: CRORE, max: 2 * CRORE },
    above_2cr: { min: 2 * CRORE, max: Number.POSITIVE_INFINITY },
  },
  own_contribution_band: {
    none: { min: 0, max: 0 },
    up_to_25k: { min: 0, max: 25_000 },
    '25k_1l': { min: 25_000, max: LAKH },
    '1l_2_5l': { min: LAKH, max: 2.5 * LAKH },
    '2_5l_5l': { min: 2.5 * LAKH, max: 5 * LAKH },
    '5l_10l': { min: 5 * LAKH, max: 10 * LAKH },
    above_10l: { min: 10 * LAKH, max: Number.POSITIVE_INFINITY },
  },
  annual_family_income_band: {
    up_to_72k: { min: 0, max: 72_000 },
    '72k_1l': { min: 72_000, max: LAKH },
    '1l_2l': { min: LAKH, max: 2 * LAKH },
    '2l_3l': { min: 2 * LAKH, max: 3 * LAKH },
    '3l_5l': { min: 3 * LAKH, max: 5 * LAKH },
    '5l_6l': { min: 5 * LAKH, max: 6 * LAKH },
    '6l_8l': { min: 6 * LAKH, max: 8 * LAKH },
    above_8l: { min: 8 * LAKH, max: Number.POSITIVE_INFINITY },
  },
}

const anyOf = (values: unknown[], incomplete = false): AnyOf => ({
  anyOf: [...new Set(values)],
  ...(incomplete ? { incomplete: true } : {}),
})
const isAnswered = (value: unknown) => value !== undefined && value !== 'prefer_not'

function bandRange(facts: CanonicalFacts, key: string): NumberRange | undefined {
  const band = facts[key]
  return typeof band === 'string' ? BAND_RANGES[key]?.[band] : undefined
}

function yearsSince(value: unknown, now: Date): number | undefined {
  if (typeof value !== 'string') return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  return (now.getTime() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
}

function activities(facts: CanonicalFacts): string[] | undefined {
  const value = facts.activity_codes
  return Array.isArray(value) && value.length ? value.filter((item): item is string => typeof item === 'string') : undefined
}

function packsOf(facts: CanonicalFacts, context: DerivationContext): Set<string> | undefined {
  const chosen = activities(facts)
  return chosen ? new Set(chosen.flatMap(id => context.activityPacks[id] ?? [])) : undefined
}

// true when any chosen activity is in the list; undefined when none chosen.
function hasActivity(facts: CanonicalFacts, ids: readonly string[]): boolean | undefined {
  const chosen = activities(facts)
  return chosen ? chosen.some(id => ids.includes(id)) : undefined
}

function knownBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined
}

// Legacy rule vocabularies for the canonical entity_type answers.
const ENTITY_SYNONYMS: Record<string, string[]> = {
  not_registered: ['individual'],
  proprietorship: ['proprietorship', 'sole_proprietorship', 'individual'],
  partnership: ['partnership', 'partnership_firm', 'registered_partnership_firm'],
  llp: ['llp'],
  private_limited: ['private_limited_company', 'private_company', 'company'],
  opc: ['one_person_company', 'private_company', 'company'],
  cooperative: ['cooperative', 'cooperative_society'],
  fpo: ['fpo', 'farmer_producer_company', 'company'],
  shg: ['shg', 'self_help_group'],
  trust_society: ['trust', 'society', 'trust_society'],
}

const COMPANY_FORMS = new Set(['private_limited', 'opc', 'fpo'])
const REGISTERED_FORMS = new Set(['proprietorship', 'partnership', 'llp', 'private_limited', 'opc', 'cooperative', 'fpo', 'trust_society', 'shg'])
const TRADING_ACTIVITIES = ['kirana_store', 'wholesale_trading', 'online_selling', 'street_vending', 'fish_retail']
const SERVICE_IN_GOODS_PACKS = ['tiffin_catering', 'dhaba_cafe', 'cold_storage', 'warehouse_godown', 'custom_hiring_centre', 'sorting_grading']
const FISHERIES = ['pond_fish', 'biofloc_ras', 'fish_seed_hatchery', 'ornamental_fish', 'shrimp_coastal', 'fish_processing', 'fish_retail']
const DAIRY = ['dairy_farm', 'milk_collection', 'dairy_products']
const ARTISAN = ['tailoring_garments', 'handloom_weaving', 'embroidery_printing', 'carpentry_furniture', 'pottery', 'blacksmith_tools', 'leather_footwear', 'jewellery', 'bamboo', 'agarbatti_candles']
const NLM_SECTORS: Record<string, string> = {
  poultry_backyard: 'rural_poultry', poultry_breeding_hatchery: 'rural_poultry', poultry_broiler: 'rural_poultry', poultry_layer: 'rural_poultry',
  goat_sheep: 'sheep_goat', piggery: 'piggery', animal_feed: 'feed_fodder',
}

// Named derivations referenced by rule_field_mappings.derive.
export const DERIVATIONS: Record<string, Derivation> = {
  annual_turnover_inr: facts => bandRange(facts, 'annual_turnover_band'),
  project_cost_inr: facts => (typeof facts.project_cost_exact_inr === 'number'
    ? { min: facts.project_cost_exact_inr, max: facts.project_cost_exact_inr }
    : bandRange(facts, 'project_cost_band')),
  own_contribution_inr: facts => bandRange(facts, 'own_contribution_band'),
  annual_family_income_inr: facts => bandRange(facts, 'annual_family_income_band'),
  // MSME class by turnover (micro ≤ ₹10 Cr, small ≤ ₹100 Cr). Investment also
  // counts officially, so a band that straddles a limit stays unknown.
  enterprise_size_by_turnover: facts => {
    const range = bandRange(facts, 'annual_turnover_band')
    if (!range) return undefined
    if (range.max <= 10 * CRORE) return 'micro'
    if (range.min >= 10 * CRORE && range.max <= 100 * CRORE) return 'small'
    return range.min >= 100 * CRORE ? 'medium_or_large' : undefined
  },
  business_age_years: (facts, { now }) => yearsSince(facts.operating_since, now),
  incorporation_age_years: (facts, { now }) => yearsSince(facts.incorporation_date ?? facts.operating_since, now),
  operates_in_india: facts => (typeof facts.state === 'string' ? true : undefined),
  country_india: facts => (typeof facts.state === 'string' ? 'India' : undefined),
  entity_type_legacy: facts => (typeof facts.entity_type === 'string' ? anyOf(ENTITY_SYNONYMS[facts.entity_type] ?? []) : undefined),
  is_indian_company: facts => (typeof facts.entity_type === 'string' ? COMPANY_FORMS.has(facts.entity_type) : undefined),
  is_registered_entity: facts => (typeof facts.entity_type === 'string' ? REGISTERED_FORMS.has(facts.entity_type) : undefined),
  is_woman: facts => (facts.gender === 'woman' ? true : facts.gender === 'man' || facts.gender === 'transgender' ? false : undefined),
  is_sc_st: facts => (facts.social_category === 'sc' || facts.social_category === 'st' ? true
    : typeof facts.social_category === 'string' && facts.social_category !== 'prefer_not' ? false : undefined),
  // Ownership percentages are only clear for a one-person business.
  sc_st_ownership_percent: facts => {
    if (!['proprietorship', 'not_registered'].includes(String(facts.entity_type))) return undefined
    const sc = DERIVATIONS.is_sc_st(facts, { now: new Date(), activityPacks: {} })
    return sc === undefined ? undefined : sc ? 100 : 0
  },
  sc_ownership_percent: facts => {
    if (!['proprietorship', 'not_registered'].includes(String(facts.entity_type))) return undefined
    if (facts.social_category === 'sc') return 100
    return typeof facts.social_category === 'string' && facts.social_category !== 'prefer_not' ? 0 : undefined
  },
  founder_category_legacy: facts => {
    if (facts.gender === undefined && facts.social_category === undefined) return undefined
    const values: string[] = []
    if (facts.gender === 'woman') values.push('woman', 'women')
    if (facts.social_category === 'sc') values.push('sc')
    if (facts.social_category === 'st') values.push('st')
    if (facts.social_category === 'obc') values.push('obc')
    return anyOf(values, !isAnswered(facts.gender) || !isAnswered(facts.social_category))
  },
  is_minority: facts => (facts.minority_community === 'yes' ? true : facts.minority_community === 'no' ? false : undefined),
  is_traditional_artisan: facts => (typeof facts.artisan_trade === 'string' ? facts.artisan_trade !== 'other' : undefined),
  is_street_vendor: facts => hasActivity(facts, ['street_vending']),
  has_fisheries_activity: facts => hasActivity(facts, FISHERIES),
  has_dairy_activity: facts => hasActivity(facts, DAIRY),
  has_artisan_activity: facts => hasActivity(facts, ARTISAN),
  has_food_activity: (facts, context) => {
    const packs = packsOf(facts, context)
    return packs ? packs.has('food') : undefined
  },
  // "manufacturing" / "service" / "trading" / "activities allied to agriculture"
  activity_nature: (facts, context) => {
    const chosen = activities(facts)
    if (!chosen) return undefined
    const values: string[] = []
    for (const id of chosen) {
      const packs = context.activityPacks[id] ?? []
      if (TRADING_ACTIVITIES.includes(id)) values.push('trading')
      else if (SERVICE_IN_GOODS_PACKS.includes(id) || packs.includes('services_retail') || packs.includes('tech_lite')) values.push('service', 'services')
      if (packs.includes('food') || packs.includes('manufacturing')) if (!SERVICE_IN_GOODS_PACKS.includes(id)) values.push('manufacturing', 'processing')
      if (packs.includes('livestock_fisheries') || packs.includes('agri')) values.push('activities allied to agriculture', 'agri_allied')
    }
    return anyOf(values)
  },
  // Legacy industry codes used by rule sets ("food_processing", "coir").
  activity_sector: (facts, context) => {
    const packs = packsOf(facts, context)
    if (!packs) return undefined
    const values: string[] = []
    if (packs.has('food')) values.push('food_processing')
    if (packs.has('livestock_fisheries')) values.push('animal_husbandry', 'fisheries')
    if (packs.has('agri')) values.push('agriculture')
    if (packs.has('manufacturing')) values.push('manufacturing')
    if (packs.has('services_retail')) values.push('services')
    if (packs.has('tech_lite')) values.push('technology')
    return anyOf(values)
  },
  nlm_project_sector: facts => {
    const chosen = activities(facts)
    return chosen ? anyOf(chosen.map(id => NLM_SECTORS[id]).filter(Boolean)) : undefined
  },
  hospitality_unit_type: facts => {
    const has = hasActivity(facts, ['homestay'])
    return has === undefined ? undefined : has ? anyOf(['homestay', 'bed_and_breakfast']) : anyOf([])
  },
  // DPIIT startup / MSME / individual innovator routes.
  applicant_type: facts => {
    if (facts.dpiit_recognized === undefined && facts.udyam_registered === undefined && facts.entity_type === undefined) return undefined
    const values: string[] = []
    if (facts.dpiit_recognized === true) values.push('dpiit_recognized_startup')
    if (facts.udyam_registered === true) values.push('msme')
    if (facts.entity_type === 'not_registered') values.push('individual_innovator')
    return anyOf(values, facts.dpiit_recognized === undefined || facts.udyam_registered === undefined || facts.entity_type === undefined)
  },
  is_startup_or_msme: facts => {
    const dpiit = knownBoolean(facts.dpiit_recognized)
    const udyam = knownBoolean(facts.udyam_registered)
    if (dpiit === true || udyam === true) return true
    return dpiit === false && udyam === false ? false : undefined
  },
  is_tech_startup: (facts, context) => {
    const packs = packsOf(facts, context)
    if (!packs) return undefined
    if (!packs.has('tech_lite')) return false
    return knownBoolean(facts.has_innovative_product)
  },
  is_new_unit: facts => (facts.stage === 'idea' || facts.stage === 'setting_up' ? true : facts.stage === 'running' ? false : undefined),
  is_existing_business: facts => (facts.stage === 'running' || facts.stage === 'setting_up' ? true : facts.stage === 'idea' ? false : undefined),
}

// The founder facts each derivation reads, so an unknown rule field can be
// traced back to the question that would decide it.
export const DERIVATION_INPUTS: Record<string, readonly string[]> = {
  annual_turnover_inr: ['annual_turnover_band'],
  project_cost_inr: ['project_cost_exact_inr', 'project_cost_band'],
  own_contribution_inr: ['own_contribution_band'],
  annual_family_income_inr: ['annual_family_income_band'],
  enterprise_size_by_turnover: ['annual_turnover_band'],
  business_age_years: ['operating_since'],
  incorporation_age_years: ['incorporation_date', 'operating_since'],
  operates_in_india: ['state'],
  country_india: ['state'],
  entity_type_legacy: ['entity_type'],
  is_indian_company: ['entity_type'],
  is_registered_entity: ['entity_type'],
  is_woman: ['gender'],
  is_sc_st: ['social_category'],
  sc_st_ownership_percent: ['entity_type', 'social_category'],
  sc_ownership_percent: ['entity_type', 'social_category'],
  founder_category_legacy: ['gender', 'social_category'],
  is_minority: ['minority_community'],
  is_traditional_artisan: ['artisan_trade'],
  is_street_vendor: ['activity_codes'],
  has_fisheries_activity: ['activity_codes'],
  has_dairy_activity: ['activity_codes'],
  has_artisan_activity: ['activity_codes'],
  has_food_activity: ['activity_codes'],
  activity_nature: ['activity_codes'],
  activity_sector: ['activity_codes'],
  nlm_project_sector: ['activity_codes'],
  hospitality_unit_type: ['activity_codes'],
  applicant_type: ['dpiit_recognized', 'udyam_registered', 'entity_type'],
  is_startup_or_msme: ['dpiit_recognized', 'udyam_registered'],
  is_tech_startup: ['activity_codes', 'has_innovative_product'],
  is_new_unit: ['stage'],
  is_existing_business: ['stage'],
}

/** The founder facts that decide a rule field; empty for bank checks and unmapped fields. */
export function factKeysForRuleField(field: string, mappings: RuleFieldMapping[]): string[] {
  const mapping = mappings.find(candidate => candidate.legacy_field === field)
  if (mapping?.treatment === 'fact' && mapping.fact_key) return [mapping.fact_key]
  if (mapping?.treatment === 'derived' && mapping.derive) return [...(DERIVATION_INPUTS[mapping.derive] ?? [])]
  return []
}

/** Facts keyed by legacy rule field, ready for evaluateEligibilityRules(). */
export function ruleFactsFromCanonical(canonical: CanonicalFacts, mappings: RuleFieldMapping[], context: DerivationContext): RuleFactMap {
  const facts: RuleFactMap = { ...canonical }
  for (const mapping of mappings) {
    if (mapping.treatment === 'fact' && mapping.fact_key) {
      const value = canonical[mapping.fact_key]
      if (value === undefined) continue
      if (mapping.value_map && typeof value === 'string' && value in mapping.value_map) {
        const mapped = mapping.value_map[value]
        facts[mapping.legacy_field] = Array.isArray(mapped) ? anyOf(mapped) : mapped
      } else {
        facts[mapping.legacy_field] = value
      }
    } else if (mapping.treatment === 'derived' && mapping.derive) {
      const derive = DERIVATIONS[mapping.derive]
      const value = derive ? derive(canonical, context) : undefined
      if (value !== undefined) facts[mapping.legacy_field] = value
    }
  }
  return facts
}

/** Rule fields that are bank/DIC checks, with the note shown to the founder. */
export function reviewerChecksFrom(mappings: RuleFieldMapping[]): Map<string, string> {
  return new Map(mappings
    .filter(mapping => mapping.treatment === 'bank_check')
    .map(mapping => [mapping.legacy_field, mapping.check_note_en ?? 'The bank or department will check this condition.']))
}
