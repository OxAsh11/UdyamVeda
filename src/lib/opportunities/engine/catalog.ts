import { createHash } from 'node:crypto'
import { reviewerChecksFrom, type RuleFieldMapping } from '../fact-mapping'
import { applicationView, isInternalNote } from '../display'
import { benefitRateFromRow, type BenefitRateRow } from './calculator'
import type { Relationship } from './combination'
import type { EngineContext, EngineRecord, FactDefinition } from './types'

// Publishing a correction clears this, so a closed scheme stops showing as open.
export const CATALOG_CACHE_TAG = 'catalog'

// Plain JSON, so it can sit in the Next.js data cache.
export type EngineCatalogData = {
  records: EngineRecord[]
  relationships: Relationship[]
  mappings: RuleFieldMapping[]
  definitions: FactDefinition[]
  activityPacks: Record<string, string[]>
  version: string
}

export type EngineCatalog = {
  records: EngineRecord[]
  relationships: Relationship[]
  context: EngineContext
  definitions: FactDefinition[]
  activityIds: ReadonlySet<string>
  version: string
}

/** Changes whenever anything that can affect a founder's result changes. */
export function catalogVersion(data: Omit<EngineCatalogData, 'version'>): string {
  const { records, relationships, mappings, definitions, activityPacks } = data
  return createHash('sha256').update(JSON.stringify({ records, relationships, mappings, definitions, activityPacks })).digest('hex').slice(0, 16)
}

export function hydrateCatalog(data: EngineCatalogData): EngineCatalog {
  return {
    records: data.records,
    relationships: data.relationships,
    definitions: data.definitions,
    activityIds: new Set(Object.keys(data.activityPacks)),
    version: data.version,
    context: {
      mappings: data.mappings,
      reviewerChecks: reviewerChecksFrom(data.mappings),
      factKeys: new Set(data.definitions.map(definition => definition.key)),
      fixableKeys: new Set(data.definitions.filter(definition => definition.fixable).map(definition => definition.key)),
      // buildResults replaces the date with the date of the request.
      derivation: { now: new Date(0), activityPacks: data.activityPacks },
    },
  }
}

export type CatalogRows = {
  opportunities: { id: string; slug: string; opportunity_type: string; status: string; geography: { coverage?: string; locations?: string[] } | null; current_version_id: string | null; last_checked_at: string | null }[]
  versions: { id: string; title: string; application: Record<string, unknown> | null; benefit_summary: Record<string, unknown> | null }[]
  ruleSets: { opportunity_version_id: string; rules: unknown }[]
  windows: { opportunity_version_id: string; window_type: string; opens_at: string | null; closes_at: string | null }[]
  requirements: { opportunity_version_id: string }[]
  steps: { opportunity_version_id: string }[]
  rates: (BenefitRateRow & { opportunity_version_id: string })[]
  packs: { opportunity_id: string; pack_id: string }[]
  relationships: { opportunity_a: string; opportunity_b: string; relation: Relationship['relation']; cap_rule: Relationship['capRule']; note_en: string | null; source_url: string }[]
  mappings: RuleFieldMapping[]
  definitions: { key: string; value_type: string; fixable: boolean; allowed_values: { value: string }[] | null }[]
  activityPacks: { activity_id: string; pack_id: string }[]
}

function grouped<T, K>(rows: T[], keyOf: (row: T) => K) {
  const groups = new Map<K, T[]>()
  for (const row of rows) groups.set(keyOf(row), [...(groups.get(keyOf(row)) ?? []), row])
  return groups
}

// The one-line benefit an editor wrote for founders. A reviewer's working note is not one.
export function headlineOf(summary: Record<string, unknown> | null) {
  const headline = summary?.headline
  return typeof headline === 'string' && headline.trim() && !isInternalNote(headline) ? headline.trim() : null
}

/** Only published records with an approved version and reviewed rules reach founders. */
export function catalogDataFromRows(rows: CatalogRows): EngineCatalogData {
  const versions = new Map(rows.versions.map(version => [version.id, version]))
  const rules = new Map(rows.ruleSets.map(ruleSet => [ruleSet.opportunity_version_id, ruleSet.rules]))
  const windows = grouped(rows.windows, row => row.opportunity_version_id)
  const requirements = grouped(rows.requirements, row => row.opportunity_version_id)
  const steps = grouped(rows.steps, row => row.opportunity_version_id)
  const rates = grouped(rows.rates, row => row.opportunity_version_id)
  const packs = grouped(rows.packs, row => row.opportunity_id)

  const records: EngineRecord[] = rows.opportunities.flatMap(row => {
    const versionId = row.current_version_id
    const version = versionId ? versions.get(versionId) : undefined
    if (!versionId || !version || !rules.has(versionId)) return []
    return [{
      id: row.id,
      slug: row.slug,
      title: version.title,
      type: row.opportunity_type,
      status: row.status,
      versionId,
      rules: rules.get(versionId),
      windows: (windows.get(versionId) ?? []).map(window => ({ windowType: window.window_type, opensAt: window.opens_at, closesAt: window.closes_at })),
      lastCheckedAt: row.last_checked_at,
      packIds: (packs.get(row.id) ?? []).map(pack => pack.pack_id).sort(),
      coverage: row.geography?.coverage ?? 'central',
      locations: row.geography?.locations ?? [],
      rates: (rates.get(versionId) ?? []).map(benefitRateFromRow),
      requiredCount: requirements.get(versionId)?.length ?? 0,
      stepCount: steps.get(versionId)?.length ?? 0,
      applyRoute: applicationView(version.application).route,
      benefitHeadline: headlineOf(version.benefit_summary),
    }]
  }).sort((left, right) => left.slug.localeCompare(right.slug))

  // A table that comes back empty would quietly make every record look open or
  // eligible, so it counts as an outage rather than as an answer.
  const empty = Object.entries({
    records: records.length,
    definitions: rows.definitions.length,
    mappings: rows.mappings.length,
    'activity packs': rows.activityPacks.length,
    'pack tags': rows.packs.length,
    windows: rows.windows.length,
  }).filter(([, count]) => count === 0).map(([name]) => name)
  if (empty.length) throw new Error(`The catalog is incomplete: no ${empty.join(', ')}.`)

  const data = {
    records,
    relationships: rows.relationships.map(row => ({
      a: row.opportunity_a, b: row.opportunity_b, relation: row.relation, capRule: row.cap_rule, noteEn: row.note_en, sourceUrl: row.source_url,
    })),
    mappings: rows.mappings,
    definitions: rows.definitions.map(row => ({
      key: row.key,
      type: row.value_type,
      fixable: row.fixable,
      ...(row.allowed_values ? { values: row.allowed_values.map(item => item.value) } : {}),
    })),
    activityPacks: Object.fromEntries([...grouped(rows.activityPacks, row => row.activity_id)].map(([id, items]) => [id, items.map(item => item.pack_id)])),
  }
  return { ...data, version: catalogVersion(data) }
}
