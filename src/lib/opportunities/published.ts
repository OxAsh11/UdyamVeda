import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verificationStatusFor } from './freshness'
import { isInternalNote, windowLabel } from './display'
import type { OpportunityDetail, OpportunitySummary, OpportunityType } from './types'

type DatabaseOpportunity = {
  id: string
  slug: string
  name: string
  opportunity_type: string
  status: string
  geography: Record<string, unknown> | null
  canonical_url: string | null
  authority_id: string | null
  current_version_id: string | null
}

type DatabaseVersion = {
  id: string
  opportunity_id: string
  summary: string | null
  objective: string | null
  legal_basis: string | null
  eligibility: Record<string, unknown> | null
  application: Record<string, unknown> | null
  fine_print: Record<string, unknown> | null
  benefit_summary: Record<string, unknown> | null
  last_verified_at: string | null
  completeness: number
  review_status: string
}

type DatabaseAuthority = { id: string; name: string }
type DatabaseBenefit = {
  opportunity_version_id: string
  benefit_type: string
  label: string
  amount_min: number | null
  amount_max: number | null
  percentage: number | null
}
type DatabaseWindow = {
  opportunity_version_id: string
  window_type: string
  opens_at: string | null
  closes_at: string | null
  label: string | null
}
type DatabaseRequirement = {
  requirement_type: string
  name: string
  description: string | null
  required: boolean
  accepted_formats: string[] | null
  max_size_mb: number | null
}
type DatabaseStep = {
  step_number: number
  title: string
  description: string | null
  official_url: string | null
  expected_days: number | null
  depends_on: number[] | null
}
type DatabaseSource = {
  source_url: string
  source_kind: string
  source_title: string | null
  source_anchor: string | null
  page_number: number | null
  section: string | null
  paragraph: string | null
  document_anchor: string | null
  is_primary: boolean
}

export type CatalogSource = 'database' | 'research_beta' | 'legacy_draft' | 'empty_unpublished' | 'unavailable'
export type CatalogAvailability = 'available' | 'unavailable'

export type PublishedCatalogResult = {
  items: OpportunitySummary[]
  source: CatalogSource
  availability: CatalogAvailability
}

function researchBetaEnabled() {
  return process.env.CATALOG_RESEARCH_BETA === 'true'
}

function catalogStatuses() {
  return researchBetaEnabled()
    ? ['in_review', 'active', 'upcoming', 'paused', 'closed', 'superseded', 'archived']
    : ['active', 'upcoming', 'paused', 'closed', 'superseded', 'archived']
}

async function createCatalogReadClient() {
  const sessionClient = await createClient()

  // Research Beta is an explicitly labelled, read-only server path. The
  // public Supabase policies intentionally expose approved rows only, so the
  // server uses the service-role client to read in_review rows when this mode
  // is enabled. No write path uses this client, and downstream actions still
  // require approved versions.
  if (researchBetaEnabled() && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createAdminClient()
  }

  return sessionClient
}

async function fallbackCatalog(query?: string, type?: string, coverage?: string, limit?: number): Promise<PublishedCatalogResult> {
  const legacyCatalogEnabled = process.env.NODE_ENV !== 'production'
    && process.env.NEXT_PUBLIC_SHOW_LEGACY_DRAFT_CATALOG === 'true'
  if (legacyCatalogEnabled) {
    const { searchOpportunities } = await import('./catalog')
    const items = searchOpportunities(query, type, coverage)
    return {
      items: limit ? items.slice(0, limit) : items,
      source: 'legacy_draft',
      availability: 'unavailable',
    }
  }
  return { items: [], source: 'unavailable', availability: 'unavailable' }
}

function availableCatalog(items: OpportunitySummary[] = []): PublishedCatalogResult {
  return {
    items,
    source: items.length
      ? process.env.CATALOG_RESEARCH_BETA === 'true' ? 'research_beta' : 'database'
      : 'empty_unpublished',
    availability: 'available',
  }
}

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, character => '\\' + character)
}

function boundedLimit(limit?: number) {
  if (limit === undefined) return undefined
  return Math.min(Math.max(Math.floor(limit), 1), 500)
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function asText(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value : fallback
}

function typeFor(value: string): OpportunityType {
  const known: OpportunityType[] = [
    'scheme', 'grant', 'loan', 'guarantee', 'subsidy', 'tax_benefit', 'policy',
    'accelerator', 'incubator', 'challenge', 'procurement', 'training', 'equity_investment',
    'mentorship', 'event', 'registration', 'licence', 'compliance',
  ]
  return known.includes(value as OpportunityType) ? value as OpportunityType : 'scheme'
}

function cadenceFor(windows: DatabaseWindow[]) {
  const deadlineWindow = windows.find(window => ['fixed', 'call_for_applications'].includes(window.window_type))
  return deadlineWindow ? 'deadline_sensitive' as const : 'rolling' as const
}

function mapPublishedOpportunity(
  opportunity: DatabaseOpportunity,
  version: DatabaseVersion,
  authority: DatabaseAuthority | undefined,
  benefits: DatabaseBenefit[],
  windows: DatabaseWindow[],
): OpportunitySummary {
  const geography = asRecord(opportunity.geography)
  const application = asRecord(version.application)
  const benefitSummary = asRecord(version.benefit_summary)
  const benefit = benefits[0]
  const coverage = geography.coverage === 'state' || geography.coverage === 'local' ? geography.coverage : 'central'
  const locations = Array.isArray(geography.locations) ? geography.locations.filter((item): item is string => typeof item === 'string') : []
  // `headline` is set by the admin editor and takes precedence.
  const benefitCandidates = [asText(benefitSummary.headline, ''), benefit?.label, asText(benefitSummary.summary, ''), version.summary ?? '']
  const benefitLabel = benefitCandidates.find(text => text && !isInternalNote(text)) ?? 'See official source for benefit details'
  const summaryTypes = Array.isArray(benefitSummary.types) ? benefitSummary.types : []
  const benefitType = benefit?.benefit_type ?? asText(summaryTypes[0], opportunity.opportunity_type)
  const processingTime = asText(application.processing_time, 'Varies by implementing agency')

  return {
    id: opportunity.slug,
    name: opportunity.name,
    type: typeFor(opportunity.opportunity_type),
    category: opportunity.opportunity_type,
    authority: authority?.name ?? 'Government implementing authority',
    benefitLabel,
    benefitType,
    description: version.summary ?? 'Official opportunity details are available in the source record.',
    officialUrl: opportunity.canonical_url ?? asText(application.portal, '#'),
    // Window labels hold reviewer prose; applicants get a short derived label.
    deadline: windowLabel(windows[0], opportunity.status),
    // Window labels stay reviewer-only; the public note is a separate field
    // that only the admin editor writes.
    windowNote: asText(application.window_note, '') || undefined,
    processingTime,
    tags: [opportunity.opportunity_type, ...locations].filter(Boolean),
    status: opportunity.status as OpportunitySummary['status'],
    coverage,
    sourceLabel: `${researchBetaEnabled() ? 'Research Beta source' : 'Official source'} · ${authority?.name ?? 'Government authority'}`,
    verificationStatus: verificationStatusFor(version.review_status, version.last_verified_at, cadenceFor(windows)),
    lastVerifiedAt: version.last_verified_at ?? undefined,
    completeness: Number(version.completeness ?? 0),
  }
}

export async function searchPublishedOpportunities(query?: string, type?: string, coverage?: string, limit?: number) {
  try {
    const supabase = await createCatalogReadClient()
    const resultLimit = boundedLimit(limit)
    const normalizedQuery = query?.trim()
    let candidateOpportunityIds: string[] | undefined

    if (normalizedQuery) {
      const searchTerm = `%${escapeLike(normalizedQuery)}%`
      const versionSearchQuery = supabase
        .from('opportunity_versions')
        .select('opportunity_id')
        .textSearch('search_document', normalizedQuery, { type: 'websearch' })
        .limit(resultLimit ?? 100)
      const versionSearch = researchBetaEnabled()
        ? versionSearchQuery.in('review_status', ['approved', 'in_review'])
        : versionSearchQuery.eq('review_status', 'approved')
      const [nameResult, versionResult] = await Promise.all([
        supabase.from('opportunities').select('id').ilike('search_text', searchTerm).limit(resultLimit ?? 100),
        versionSearch,
      ])
      if (nameResult.error || versionResult.error) return await fallbackCatalog(query, type, coverage, resultLimit)
      candidateOpportunityIds = Array.from(new Set([
        ...(nameResult.data ?? []).map(row => row.id),
        ...(versionResult.data ?? []).map(row => row.opportunity_id),
      ]))
      if (!candidateOpportunityIds.length) return availableCatalog()
    }

    let opportunityQuery = supabase
      .from('opportunities')
      .select('id, slug, name, opportunity_type, status, geography, canonical_url, authority_id, current_version_id')
      .in('status', catalogStatuses())
      .order('name')
    if (type && type !== 'all') opportunityQuery = opportunityQuery.eq('opportunity_type', type)
    if (coverage && coverage !== 'all') opportunityQuery = opportunityQuery.eq('geography->>coverage', coverage)
    if (candidateOpportunityIds) opportunityQuery = opportunityQuery.in('id', candidateOpportunityIds)
    if (resultLimit) opportunityQuery = opportunityQuery.limit(resultLimit)

    const { data: opportunities, error: opportunityError } = await opportunityQuery
    if (opportunityError) return await fallbackCatalog(query, type, coverage, resultLimit)
    if (!opportunities?.length) return availableCatalog()

    const rows = opportunities as DatabaseOpportunity[]
    const versionIds = rows.map(row => row.current_version_id).filter((id): id is string => Boolean(id))
    if (!versionIds.length) return availableCatalog()

    const versionsQueryBase = supabase
      .from('opportunity_versions')
      .select('id, opportunity_id, summary, application, benefit_summary, last_verified_at, completeness, review_status')
      .in('id', versionIds)
    const versionsQuery = researchBetaEnabled()
      ? versionsQueryBase.in('review_status', ['approved', 'in_review'])
      : versionsQueryBase.eq('review_status', 'approved')

    const authorityIds = Array.from(new Set(rows.map(row => row.authority_id).filter((id): id is string => Boolean(id))))
    const [versionsResult, authoritiesResult, benefitsResult, windowsResult] = await Promise.all([
      versionsQuery,
      authorityIds.length ? supabase.from('authorities').select('id, name').in('id', authorityIds) : Promise.resolve({ data: [], error: null }),
      supabase.from('opportunity_benefits').select('opportunity_version_id, benefit_type, label, amount_min, amount_max, percentage').in('opportunity_version_id', versionIds),
      supabase.from('opportunity_windows').select('opportunity_version_id, window_type, opens_at, closes_at, label').in('opportunity_version_id', versionIds),
    ])

    if (versionsResult.error || authoritiesResult.error || benefitsResult.error || windowsResult.error) return await fallbackCatalog(query, type, coverage, resultLimit)

    const versions = (versionsResult.data ?? []) as DatabaseVersion[]
    const authorities = (authoritiesResult.data ?? []) as DatabaseAuthority[]
    const benefits = (benefitsResult.data ?? []) as DatabaseBenefit[]
    const windows = (windowsResult.data ?? []) as DatabaseWindow[]
    const mapped = rows.flatMap(row => {
      const version = versions.find(item => item.id === row.current_version_id)
      if (!version) return []
      return [mapPublishedOpportunity(
        row,
        version,
        authorities.find(item => item.id === row.authority_id),
        benefits.filter(item => item.opportunity_version_id === version.id),
        windows.filter(item => item.opportunity_version_id === version.id),
      )]
    })

    return availableCatalog(mapped)
  } catch {
    return await fallbackCatalog(query, type, coverage, boundedLimit(limit))
  }
}

export async function getPublishedOpportunity(slug: string): Promise<OpportunityDetail | null> {
  try {
    const supabase = await createCatalogReadClient()
    const { data: opportunity, error: opportunityError } = await supabase
      .from('opportunities')
      .select('id, slug, name, opportunity_type, status, geography, canonical_url, authority_id, current_version_id')
      .eq('slug', slug)
      .in('status', catalogStatuses())
      .maybeSingle()

    if (opportunityError || !opportunity?.current_version_id) return null

    const [versionResult, authorityResult, benefitsResult, windowsResult, requirementsResult, stepsResult, sourcesResult] = await Promise.all([
      (researchBetaEnabled()
        ? supabase.from('opportunity_versions').select('id, opportunity_id, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, review_status').eq('id', opportunity.current_version_id).in('review_status', ['approved', 'in_review'])
        : supabase.from('opportunity_versions').select('id, opportunity_id, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, review_status').eq('id', opportunity.current_version_id).eq('review_status', 'approved')).maybeSingle(),
      opportunity.authority_id ? supabase.from('authorities').select('id, name').eq('id', opportunity.authority_id).maybeSingle() : Promise.resolve({ data: null, error: null }),
      supabase.from('opportunity_benefits').select('opportunity_version_id, benefit_type, label, amount_min, amount_max, percentage').eq('opportunity_version_id', opportunity.current_version_id),
      supabase.from('opportunity_windows').select('opportunity_version_id, window_type, opens_at, closes_at, label').eq('opportunity_version_id', opportunity.current_version_id).order('closes_at', { ascending: true, nullsFirst: false }),
      supabase.from('opportunity_requirements').select('requirement_type, name, description, required, accepted_formats, max_size_mb').eq('opportunity_version_id', opportunity.current_version_id),
      supabase.from('opportunity_steps').select('step_number, title, description, official_url, expected_days, depends_on').eq('opportunity_version_id', opportunity.current_version_id).order('step_number'),
      supabase.from('opportunity_sources').select('source_url, source_kind, source_title, source_anchor, page_number, section, paragraph, document_anchor, is_primary').eq('opportunity_version_id', opportunity.current_version_id).order('is_primary', { ascending: false }),
    ])

    if (
      versionResult.error
      || !versionResult.data
      || authorityResult.error
      || benefitsResult.error
      || windowsResult.error
      || requirementsResult.error
      || stepsResult.error
      || sourcesResult.error
    ) return null

    const row = opportunity as DatabaseOpportunity
    const version = versionResult.data as DatabaseVersion
    const summary = mapPublishedOpportunity(
      row,
      version,
      (authorityResult.data ?? undefined) as DatabaseAuthority | undefined,
      (benefitsResult.data ?? []) as DatabaseBenefit[],
      (windowsResult.data ?? []) as DatabaseWindow[],
    )

    return {
      ...summary,
      objective: version.objective ?? null,
      legalBasis: version.legal_basis ?? null,
      eligibility: asRecord(version.eligibility),
      application: asRecord(version.application),
      finePrint: asRecord(version.fine_print),
      benefits: ((benefitsResult.data ?? []) as DatabaseBenefit[]).map(benefit => ({
        type: benefit.benefit_type,
        label: benefit.label,
        amountMin: benefit.amount_min,
        amountMax: benefit.amount_max,
        percentage: benefit.percentage,
      })),
      requirements: ((requirementsResult.data ?? []) as DatabaseRequirement[]).map(requirement => ({
        type: requirement.requirement_type,
        name: requirement.name,
        description: requirement.description,
        required: requirement.required,
        acceptedFormats: requirement.accepted_formats ?? [],
        maxSizeMb: requirement.max_size_mb,
      })),
      steps: ((stepsResult.data ?? []) as DatabaseStep[]).map(step => ({
        number: step.step_number,
        title: step.title,
        description: step.description,
        officialUrl: step.official_url,
        expectedDays: step.expected_days,
        dependsOn: step.depends_on ?? [],
      })),
      sources: ((sourcesResult.data ?? []) as DatabaseSource[]).map(source => ({
        url: source.source_url,
        kind: source.source_kind,
        title: source.source_title,
        anchor: source.source_anchor,
        pageNumber: source.page_number,
        section: source.section,
        paragraph: source.paragraph,
        documentAnchor: source.document_anchor,
        isPrimary: source.is_primary,
      })),
    }
  } catch {
    return null
  }
}
