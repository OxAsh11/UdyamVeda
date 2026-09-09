import { NextResponse } from 'next/server'
import { getCatalogReviewer } from '@/lib/catalog/reviewer'
import { getSourceFailureSummary } from '@/lib/catalog/source-failure-queue'
import { getCurrentSourceGapSummary } from '@/lib/catalog/current-source-gaps'

type Check = { id: string; label: string; passed: boolean; required: boolean; detail: string }

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET() {
  const context = await getCatalogReviewer()
  if (!context.user) return errorResponse('Sign in is required.', 401)
  if (context.error) return errorResponse('Catalog operations are not provisioned yet.', 503)
  if (!context.reviewer) return errorResponse('Catalog reviewer access is required.', 403)

  const checks: Check[] = [
    { id: 'supabase_service_role', label: 'Supabase server-role key configured', passed: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY), required: true, detail: 'Required by ingestion workers; never exposed to the browser.' },
    { id: 'firecrawl', label: 'Firecrawl key configured', passed: Boolean(process.env.FIRECRAWL_API_KEY), required: true, detail: 'Required for official-source snapshots.' },
    { id: 'inngest_event', label: 'Inngest event key configured', passed: Boolean(process.env.INNGEST_EVENT_KEY), required: true, detail: 'Required to queue refresh work.' },
    { id: 'inngest_signing', label: 'Inngest signing key configured', passed: Boolean(process.env.INNGEST_SIGNING_KEY), required: true, detail: 'Required to authenticate worker callbacks.' },
    { id: 'openai', label: 'OpenAI extraction key configured', passed: Boolean(process.env.OPENAI_API_KEY), required: true, detail: 'Required for structured draft extraction; all output remains review-only.' },
    { id: 'resend', label: 'Resend key configured (optional)', passed: Boolean(process.env.RESEND_API_KEY), required: false, detail: 'Optional until transactional email is enabled.' },
  ]

  const tables = [
    'authorities',
    'authority_coverage',
    'authority_relationships',
    'catalog_audit_items',
    'catalog_audits',
    'catalog_discoveries',
    'catalog_review_checks',
    'catalog_reviewers',
    'catalog_taxonomies',
    'catalog_taxonomy_terms',
    'change_events',
    'content_translations',
    'eligibility_rule_sets',
    'ingestion_runs',
    'opportunity_authority_reviews',
    'opportunities',
    'opportunity_benefits',
    'opportunity_drafts',
    'opportunity_requirements',
    'opportunity_sources',
    'opportunity_steps',
    'opportunity_taxonomy_terms',
    'opportunity_versions',
    'opportunity_windows',
    'review_tasks',
    'source_registry',
    'source_resolution_reviews',
    'source_snapshots',
    'businesses',
    'business_memberships',
    'business_facts',
    'applications',
    'application_tasks',
    'application_status_events',
    'application_task_status_events',
    'application_document_links',
    'business_documents',
    'recommendation_runs',
    'recommendation_results',
    'saved_opportunities',
    'consent_records',
    'notifications',
    'notification_preferences',
    'concierge_requests',
    'audit_logs',
  ]
  const tableChecks = await Promise.all(tables.map(async table => {
    const { error } = await context.supabase.from(table).select('*', { head: true, count: 'exact' })
    return {
      id: 'table_' + table,
      label: 'Remote table: ' + table,
      passed: !error,
      required: true,
      detail: error ? error.message : 'Table is reachable from the reviewer session.',
    }
  }))
  checks.push(...tableChecks)

  const { error: opportunitySearchError } = await context.supabase.from('opportunity_versions').select('search_document', { head: true }).limit(1)
  checks.push({
    id: 'full_text_search',
    label: 'Postgres full-text search column',
    passed: !opportunitySearchError,
    required: true,
    detail: opportunitySearchError ? opportunitySearchError.message : 'search_document is available.',
  })

  return NextResponse.json({
    ready: checks.filter(check => check.required).every(check => check.passed),
    checks,
    sourceFailureQueue: getSourceFailureSummary(),
    currentSourceGapQueue: getCurrentSourceGapSummary(),
    evaluatedAt: new Date().toISOString(),
  })
}
