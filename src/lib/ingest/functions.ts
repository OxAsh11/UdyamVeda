import { createHash } from 'node:crypto'
import { inngest } from './inngest'
import { scrapeOfficialSource } from './firecrawl'
import { parseAuthorityDirectory } from './authority-directory'
import { extractOpportunityDrafts, extractionModel } from './extractor'
import { validateOpportunityDraft } from '@/lib/opportunities/validation'
import { createAdminClient } from '@/lib/supabase/admin'
import { stablePayloadHash } from './idempotency'

function textValue(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function recordValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

type CaptureMetadata = {
  captureMethod: 'firecrawl_markdown' | 'http_html_fallback' | 'manual_official_text' | 'manual_official_pdf_text' | 'unknown'
  finalUrl?: string | null
  responseStatus?: number | null
  responseContentType?: string | null
}

async function recordSourceRefresh(sourceId: string | undefined, url: string, markdown: string, captureMetadata: CaptureMetadata = { captureMethod: 'unknown' }) {
  const supabase = createAdminClient()
  const contentHash = createHash('sha256').update(markdown).digest('hex')
  const checkedAt = new Date().toISOString()
  const { data: source, error: sourceError } = sourceId
    ? await supabase.from('source_registry').select('id, url, expected_item_count').eq('id', sourceId).maybeSingle()
    : await supabase.from('source_registry').select('id, url, expected_item_count').eq('url', url).maybeSingle()

  if (sourceError || !source) throw new Error('Source is not registered in source_registry')

  const { data: existingRun, error: existingRunError } = await supabase
    .from('ingestion_runs')
    .select('id, status, discovered_count, changed_count, error')
    .eq('source_id', source.id)
    .eq('content_hash', contentHash)
    .maybeSingle()
  if (existingRunError) throw new Error('Unable to check ingestion idempotency')
  if (existingRun && ['running', 'completed', 'needs_review'].includes(existingRun.status)) {
    await supabase.from('source_registry').update({ last_checked_at: checkedAt, last_content_hash: contentHash }).eq('id', source.id)
    return {
      sourceId: source.id,
      runId: existingRun.id,
      contentHash,
      discoveredCount: existingRun.discovered_count,
      changedCount: existingRun.changed_count,
      warning: existingRun.status === 'running' ? 'An identical source refresh is already running.' : 'Identical source content was already staged; no duplicate extraction was created.',
    }
  }

  const { data: run, error: runError } = existingRun
    ? await supabase
      .from('ingestion_runs')
      .update({ status: 'running', started_at: checkedAt, completed_at: null, error: null })
      .eq('id', existingRun.id)
      .select('id')
      .single()
    : await supabase
      .from('ingestion_runs')
      .insert({ source_id: source.id, content_hash: contentHash, status: 'running', started_at: checkedAt })
      .select('id')
      .single()
  if (runError || !run) throw new Error('Unable to create ingestion run')

  let snapshotId: string | undefined
  try {
    const { data: previous } = await supabase
      .from('source_snapshots')
      .select('id, content_hash, status')
      .eq('source_registry_id', source.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    const unchanged = previous?.content_hash === contentHash && !['failed', 'fetched'].includes(previous.status)

    const snapshotPayload: Record<string, unknown> = {
      source_registry_id: source.id,
      ingestion_run_id: run.id,
      content_hash: contentHash,
      body_markdown: markdown,
      status: unchanged ? 'unchanged' : 'fetched',
    }
    // Evidence metadata is immutable. Do not attempt to rewrite it when an
    // identical hash already exists, including a legacy row marked unknown.
    if (!previous || previous.content_hash !== contentHash) {
      snapshotPayload.capture_method = captureMetadata.captureMethod
      snapshotPayload.final_url = captureMetadata.finalUrl ?? url
      snapshotPayload.response_status = captureMetadata.responseStatus ?? null
      snapshotPayload.response_content_type = captureMetadata.responseContentType ?? null
    }
    const { error: snapshotError } = await supabase
      .from('source_snapshots')
      .upsert(snapshotPayload, { onConflict: 'source_registry_id,content_hash' })
    const { data: snapshot } = await supabase
      .from('source_snapshots')
      .select('id')
      .eq('source_registry_id', source.id)
      .eq('content_hash', contentHash)
      .single()
    if (snapshotError || !snapshot) throw new Error('Unable to persist source snapshot')
    snapshotId = snapshot.id

    const eventType = !previous ? 'initial' : unchanged ? 'unchanged' : 'changed'
    const { error: changeEventError } = await supabase.from('change_events').upsert({
      source_registry_id: source.id,
      source_snapshot_id: snapshot.id,
      previous_snapshot_id: previous?.id ?? null,
      event_type: eventType,
      previous_content_hash: previous?.content_hash ?? null,
      content_hash: contentHash,
      summary: eventType === 'initial'
        ? 'Initial source snapshot captured; review extracted content before publication.'
        : eventType === 'unchanged'
          ? 'Content hash unchanged since the previous snapshot.'
          : 'Content hash changed; compare the previous and current snapshots before updating records.',
    }, { onConflict: 'source_registry_id,content_hash,event_type', ignoreDuplicates: true })
    if (changeEventError) throw new Error('Unable to persist source change event: ' + changeEventError.message)

    let discoveredCount = 0
    let changedCount = unchanged ? 0 : 1
    let warning: string | null = unchanged ? 'Content hash is unchanged; no new extraction was created.' : null
    const isAuthorityDirectory = url.includes('/ug/E002/') || url.includes('/ug/E003/')

    if (isAuthorityDirectory) {
      const parsed = parseAuthorityDirectory(markdown, url)
      discoveredCount = parsed.records.length
      const countWarning = typeof source.expected_item_count === 'number' && source.expected_item_count !== parsed.records.length
        ? `Expected ${source.expected_item_count} authority rows but extracted ${parsed.records.length}; inspect the directory snapshot before assessment.`
        : null
      warning = [...parsed.warnings, countWarning].filter(Boolean).join(' ') || warning
      if (parsed.records.length) {
        const { data: existingCoverage, error: existingCoverageError } = await supabase
          .from('authority_coverage')
          .select('authority_level, authority_name, authority_url, business_relevance, assessment_status, exclusion_reason, assessment_note, assessed_at, assessed_by')
          .eq('source_registry_id', source.id)
        if (existingCoverageError) throw new Error('Unable to preserve existing authority assessments: ' + existingCoverageError.message)
        const existingByKey = new Map((existingCoverage ?? []).map(row => [`${row.authority_level}:${row.authority_name.toLocaleLowerCase()}`, row]))
        const coverageRows = parsed.records.map(record => ({
          source_registry_id: source.id,
          authority_level: record.authorityLevel,
          authority_name: record.authorityName,
          authority_url: record.authorityUrl,
          business_relevance: existingByKey.get(`${record.authorityLevel}:${record.authorityName.toLocaleLowerCase()}`)?.business_relevance ?? 'pending',
          assessment_status: existingByKey.get(`${record.authorityLevel}:${record.authorityName.toLocaleLowerCase()}`)?.assessment_status ?? 'not_assessed',
          exclusion_reason: existingByKey.get(`${record.authorityLevel}:${record.authorityName.toLocaleLowerCase()}`)?.exclusion_reason ?? null,
          assessment_note: existingByKey.get(`${record.authorityLevel}:${record.authorityName.toLocaleLowerCase()}`)?.assessment_note ?? null,
          assessed_at: existingByKey.get(`${record.authorityLevel}:${record.authorityName.toLocaleLowerCase()}`)?.assessed_at ?? null,
          assessed_by: existingByKey.get(`${record.authorityLevel}:${record.authorityName.toLocaleLowerCase()}`)?.assessed_by ?? null,
        }))
        const { error: coverageError } = await supabase
          .from('authority_coverage')
          .upsert(coverageRows, { onConflict: 'source_registry_id,authority_level,authority_name' })
        if (coverageError) throw new Error('Unable to persist authority coverage: ' + coverageError.message)
      }
      const { error: authoritySnapshotUpdateError } = await supabase.from('source_snapshots').update({
        extracted_payload: { authority_level: parsed.authorityLevel, expected_item_count: source.expected_item_count, records: parsed.records },
        status: 'needs_review',
        error: warning,
      }).eq('id', snapshot.id)
      if (authoritySnapshotUpdateError) throw new Error('Unable to persist authority directory evidence: ' + authoritySnapshotUpdateError.message)
    } else if (!unchanged) {
      try {
        const drafts = await extractOpportunityDrafts(markdown, url)
        discoveredCount = drafts.length
        changedCount = drafts.length
        const draftRows = drafts.map(draft => {
          const validation = validateOpportunityDraft(draft)
          return {
            source_snapshot_id: snapshot.id,
            ingestion_run_id: run.id,
            payload: draft,
            payload_hash: stablePayloadHash(draft),
            completeness: validation.completeness,
            validation_errors: validation.errors,
            validation_warnings: validation.warnings,
            extraction_model: extractionModel(),
            status: validation.valid ? 'validated' : 'needs_review',
          }
        })
        if (draftRows.length) {
          const { error: draftError } = await supabase.from('opportunity_drafts').upsert(draftRows, { onConflict: 'source_snapshot_id,payload_hash' })
          if (draftError) throw new Error('Unable to persist extracted opportunity drafts: ' + draftError.message)
        }
        const discoveryRows = drafts.flatMap(draft => {
          const name = textValue(draft.name)
          if (!name) return []
          const application = recordValue(draft.application)
          const effectiveDates = recordValue(draft.effective_dates)
          const sourceRecords = Array.isArray(draft.sources) ? draft.sources as Array<Record<string, unknown>> : []
          const lifecycle = ['active', 'upcoming', 'closed', 'superseded', 'archived'].includes(String(effectiveDates.status))
            ? String(effectiveDates.status)
            : 'active'
          return [{
            source_registry_id: source.id,
            source_snapshot_id: snapshot.id,
            name,
            canonical_url: textValue(application.portal) ?? textValue(application.official_url) ?? textValue(sourceRecords[0]?.url),
            opportunity_type: textValue(draft.opportunity_type),
            lifecycle_status: lifecycle,
          }]
        })
        if (discoveryRows.length) {
          const { error: discoveryError } = await supabase
            .from('catalog_discoveries')
            .upsert(discoveryRows, { onConflict: 'source_registry_id,name' })
          if (discoveryError) throw new Error('Unable to persist catalog discoveries: ' + discoveryError.message)
        }
        warning = drafts.length ? 'AI extraction is staged for human review; no draft is publishable automatically.' : 'No distinct opportunity was found in this source.'
        const { error: opportunitySnapshotUpdateError } = await supabase.from('source_snapshots').update({
          extracted_payload: { records: drafts },
          status: 'needs_review',
          error: warning,
        }).eq('id', snapshot.id)
        if (opportunitySnapshotUpdateError) throw new Error('Unable to persist extracted opportunity evidence: ' + opportunitySnapshotUpdateError.message)
      } catch (error) {
        warning = error instanceof Error ? error.message : 'Opportunity extraction failed'
        await supabase.from('source_snapshots').update({ status: 'needs_review', error: warning }).eq('id', snapshot.id)
        throw error
      }
    }

    const { error: sourceUpdateError } = await supabase
      .from('source_registry')
      .update({ last_checked_at: checkedAt, last_content_hash: contentHash })
      .eq('id', source.id)
    if (sourceUpdateError) throw new Error('Unable to update source registry state')

    const { error: runUpdateError } = await supabase
      .from('ingestion_runs')
      .update({
        status: unchanged ? 'completed' : 'needs_review',
        discovered_count: discoveredCount,
        changed_count: changedCount,
        error: warning,
        completed_at: checkedAt,
      })
      .eq('id', run.id)
    if (runUpdateError) throw new Error('Unable to close ingestion run')

    return { sourceId: source.id, runId: run.id, contentHash, discoveredCount, changedCount, warning }
  } catch (error) {
    if (snapshotId) {
      await supabase.from('source_snapshots').update({
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown snapshot error',
      }).eq('id', snapshotId)
    }
    await supabase.from('ingestion_runs').update({
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown ingestion error',
      completed_at: new Date().toISOString(),
    }).eq('id', run.id)
    throw error
  }
}

export const refreshOpportunitySource = inngest.createFunction(
  { id: 'refresh-official-opportunity-source', retries: 3, triggers: [{ event: 'catalog/source.refresh.requested' }] },
  async ({ event, step }) => {
    const result = await step.run('fetch-and-stage-source', async () => {
      const document = await scrapeOfficialSource(event.data.url)
      const persisted = await recordSourceRefresh(event.data.sourceId, event.data.url, document.markdown, document)
      return { url: event.data.url, characters: document.markdown.length, fetchedAt: new Date().toISOString(), persistence: persisted }
    })

    return { status: 'needs_review', source: result }
  },
)

async function queueSourcesForCadence(cadence: string) {
  const supabase = createAdminClient()
  const { data: sources, error } = await supabase
    .from('source_registry')
    .select('id, url')
    .eq('active', true)
    .eq('cadence', cadence)
  if (error) throw new Error('Unable to load ' + cadence + ' catalog sources: ' + error.message)
  if (!sources?.length) return { cadence, queued: 0, eventIds: [] as string[] }

  const result = await inngest.send(sources.map(source => ({
    name: 'catalog/source.refresh.requested',
    data: { sourceId: source.id, url: source.url, requestedBy: 'system:scheduler' },
  })))
  return { cadence, queued: sources.length, eventIds: result.ids }
}

export const scheduleDailyCatalogSources = inngest.createFunction(
  { id: 'schedule-daily-catalog-sources', retries: 3, triggers: [{ cron: '0 2 * * *' }] },
  async ({ step }) => step.run('queue-daily-catalog-sources', () => queueSourcesForCadence('daily')),
)

export const scheduleWeeklyCatalogSources = inngest.createFunction(
  { id: 'schedule-weekly-catalog-sources', retries: 3, triggers: [{ cron: '0 3 * * 1' }] },
  async ({ step }) => step.run('queue-weekly-catalog-sources', () => queueSourcesForCadence('weekly')),
)

export const scheduleMonthlyCatalogSources = inngest.createFunction(
  { id: 'schedule-monthly-catalog-sources', retries: 3, triggers: [{ cron: '0 4 1 * *' }] },
  async ({ step }) => step.run('queue-monthly-catalog-sources', () => queueSourcesForCadence('monthly')),
)

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10)
}

function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setUTCDate(result.getUTCDate() + days)
  return result
}

type ReminderTask = {
  id: string
  application_id: string
  title: string
  due_date: string | null
  owner_id: string | null
}

type ReminderApplication = {
  id: string
  business_id: string
  opportunity?: { name?: string | null } | Array<{ name?: string | null }> | null
}

export const scheduleApplicationReminders = inngest.createFunction(
  { id: 'schedule-application-deadline-reminders', retries: 3, triggers: [{ cron: '30 2 * * *' }] },
  async ({ step }) => step.run('create-application-deadline-reminders', async () => {
    const supabase = createAdminClient()
    const today = dateOnly(new Date())
    const horizon = dateOnly(addDays(new Date(), 7))
    const { data: taskRows, error: taskError } = await supabase
      .from('application_tasks')
      .select('id, application_id, title, due_date, owner_id')
      .in('status', ['todo', 'in_progress', 'blocked'])
      .not('due_date', 'is', null)
      .gte('due_date', today)
      .lte('due_date', horizon)
      .limit(1000)

    if (taskError) throw new Error('Unable to load application tasks for reminders: ' + taskError.message)
    const tasks = (taskRows ?? []) as ReminderTask[]
    if (!tasks.length) return { scanned: 0, created: 0 }

    const applicationIds = [...new Set(tasks.map(task => task.application_id))]
    const { data: applicationRows, error: applicationError } = await supabase
      .from('applications')
      .select('id, business_id, opportunity:opportunities(name)')
      .in('id', applicationIds)
    if (applicationError) throw new Error('Unable to load applications for reminders: ' + applicationError.message)

    const applications = (applicationRows ?? []) as ReminderApplication[]
    const applicationById = new Map(applications.map(application => [application.id, application]))
    let created = 0

    for (const task of tasks) {
      if (!task.owner_id || !task.due_date) continue
      const application = applicationById.get(task.application_id)
      if (!application) continue

      const { data: preferences, error: preferenceError } = await supabase
        .from('notification_preferences')
        .select('business_id, enabled')
        .eq('user_id', task.owner_id)
        .eq('notification_type', 'application_deadline')
        .eq('channel', 'in_app')
        .or(`business_id.eq.${application.business_id},business_id.is.null`)
      if (preferenceError) throw new Error('Unable to load notification preferences: ' + preferenceError.message)
      const businessPreference = preferences?.find(preference => preference.business_id === application.business_id)
      const globalPreference = preferences?.find(preference => preference.business_id === null)
      if ((businessPreference ?? globalPreference)?.enabled === false) continue

      const opportunity = Array.isArray(application.opportunity) ? application.opportunity[0] : application.opportunity
      const dueLabel = task.due_date === today ? 'today' : `by ${task.due_date}`
      const { error: insertError } = await supabase.from('notifications').upsert({
        user_id: task.owner_id,
        business_id: application.business_id,
        type: 'application_deadline',
        title: `Application task due ${dueLabel}`,
        body: `${task.title}${opportunity?.name ? ` for ${opportunity.name}` : ''} is due ${dueLabel}.`,
        href: `/dashboard/applications/${application.id}`,
        dedupe_key: `application-task-due:${task.id}:${task.due_date}`,
      }, { onConflict: 'user_id,dedupe_key', ignoreDuplicates: true })
      if (insertError) throw new Error('Unable to create an application reminder: ' + insertError.message)
      created += 1
    }

    return { scanned: tasks.length, created, window: { from: today, to: horizon } }
  }),
)
