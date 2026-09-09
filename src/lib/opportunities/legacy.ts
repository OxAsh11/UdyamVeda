import { SCHEMES, type Scheme } from '@/lib/data/schemes'

/**
 * Converts the legacy UI catalog into draft-shaped records for a later
 * reviewed import. This deliberately does not mark records active or verified.
 */
export function legacySchemeToDraft(scheme: Scheme) {
  return {
    opportunity: {
      slug: scheme.id,
      name: scheme.name,
      opportunity_type: scheme.benefitType,
      status: 'draft' as const,
      canonical_url: scheme.officialUrl,
      geography: { coverage: scheme.category === 'state' ? 'state' : 'central' },
      is_business_relevant: true,
    },
    version: {
      version_number: 1,
      title: scheme.name,
      summary: scheme.description,
      objective: null,
      legal_basis: null,
      eligibility: scheme.eligibility,
      application: {
        deadline: scheme.deadline,
        processing_time: scheme.processingTime,
      },
      fine_print: {
        legacy_benefit_estimate: scheme.benefitEstimate,
        legacy_application_steps: scheme.applicationSteps,
        requires_official_review: true,
      },
      benefit_summary: {
        headline: scheme.benefitHeadline,
        type: scheme.benefitType,
      },
      completeness: 0,
      confidence: 0,
      review_status: 'draft' as const,
    },
    legacy_import: true,
    authority: {
      name: scheme.ministry,
    },
    effective_dates: {
      status: 'unknown',
      reason: 'Legacy static record; current validity must be established from an official source.',
    },
    name: scheme.name,
    summary: scheme.description,
    opportunity_type: scheme.benefitType,
    eligibility: scheme.eligibility,
    benefit_summary: {
      headline: scheme.benefitHeadline,
      type: scheme.benefitType,
    },
    application: {
      portal: scheme.officialUrl,
      deadline: scheme.deadline,
      processing_time: scheme.processingTime,
    },
    fine_print: {
      legacy_benefit_estimate: scheme.benefitEstimate,
      legacy_application_steps: scheme.applicationSteps,
      requires_official_review: true,
    },
    requirements: [],
    steps: scheme.applicationSteps.map((title, index) => ({ number: index + 1, title, official_url: scheme.officialUrl })),
    sources: [{
      url: scheme.officialUrl,
      kind: 'other',
      title: 'Legacy application record; authority not yet reviewed',
      anchor: `legacy scheme record: ${scheme.id}`,
      is_primary: false,
    }],
    geography: { coverage: scheme.category === 'state' ? 'state' : 'central' },
    source: {
      source_url: scheme.officialUrl,
      source_kind: 'other' as const,
      source_title: 'Legacy application record; authority not yet reviewed',
      source_anchor: `legacy scheme record: ${scheme.id}`,
      is_primary: false,
    },
  }
}

export function legacyCatalogDrafts() {
  return SCHEMES.map(legacySchemeToDraft)
}
