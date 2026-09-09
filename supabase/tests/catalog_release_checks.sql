-- Run this file after applying every migration and seed file, as a database
-- owner or service role. It is intentionally not part of the public API.
-- A successful run proves structural invariants only; it does not replace the
-- human source-to-record factual audit required by the Central beta gate.

do $$
declare
  required_table text;
  missing_tables text[] := '{}';
  protected_tables text[] := array[
    'businesses',
    'business_memberships',
    'business_facts',
    'consent_records',
    'saved_opportunities',
    'applications',
    'application_tasks',
    'application_task_status_events',
    'business_documents',
    'notifications',
    'audit_logs',
    'authorities',
    'opportunities',
    'opportunity_versions',
    'opportunity_sources',
    'opportunity_benefits',
    'eligibility_rule_sets',
    'opportunity_requirements',
    'opportunity_steps',
    'opportunity_windows',
    'source_registry',
    'ingestion_runs',
    'source_snapshots',
    'opportunity_drafts',
    'review_tasks',
    'catalog_review_checks',
    'opportunity_authority_reviews',
    'authority_coverage',
    'authority_relationships',
    'catalog_audits',
    'catalog_audit_items',
    'content_translations',
    'recommendation_runs',
    'recommendation_results',
    'application_status_events',
    'application_document_links',
    'application_task_status_events',
    'notification_preferences',
    'concierge_requests',
    'catalog_reviewers',
    'catalog_taxonomies',
    'catalog_taxonomy_terms',
    'opportunity_taxonomy_terms',
    'catalog_discoveries',
    'change_events',
    'source_resolution_reviews'
  ];
begin
  foreach required_table in array array[
    'businesses',
    'business_memberships',
    'business_facts',
    'consent_records',
    'authorities',
    'opportunities',
    'opportunity_versions',
    'opportunity_sources',
    'opportunity_benefits',
    'eligibility_rule_sets',
    'opportunity_requirements',
    'opportunity_steps',
    'opportunity_windows',
    'source_registry',
    'ingestion_runs',
    'source_snapshots',
    'opportunity_drafts',
    'review_tasks',
    'catalog_review_checks',
    'opportunity_authority_reviews',
    'authority_coverage',
    'authority_relationships',
    'recommendation_runs',
    'recommendation_results',
    'application_status_events',
    'application_document_links',
    'notification_preferences',
    'concierge_requests',
    'catalog_reviewers',
    'catalog_audits',
    'catalog_audit_items',
    'catalog_discoveries',
    'change_events',
    'source_resolution_reviews'
  ] loop
    if to_regclass('public.' || required_table) is null then
      missing_tables := array_append(missing_tables, required_table);
    end if;
  end loop;

  if cardinality(missing_tables) > 0 then
    raise exception 'Catalog migrations are incomplete; missing tables: %', array_to_string(missing_tables, ', ');
  end if;

  foreach required_table in array protected_tables loop
    if not exists (
      select 1
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public'
        and c.relname = required_table
        and c.relrowsecurity = true
    ) then
      raise exception 'RLS is not enabled on public.%', required_table;
    end if;
  end loop;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'opportunities'
      and policyname = 'published opportunities are public'
  ) then
    raise exception 'Public opportunity policy is missing';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'opportunities'
      and policyname = 'published opportunities are public'
      and qual ilike '%current_version_id%'
      and qual ilike '%review_status%'
      and qual ilike '%approved%'
  ) then
    raise exception 'Public opportunity policy must require an approved current version';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'opportunity_authority_reviews'
      and policyname = 'reviewers can manage opportunity authority reviews'
  ) then
    raise exception 'Opportunity authority crosswalk RLS policy is missing';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'source_resolution_reviews'
      and policyname = 'reviewers can manage source resolution reviews'
  ) then
    raise exception 'Source resolution review RLS policy is missing';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'catalog_review_checks'
      and policyname = 'reviewers can read catalog review checks'
      and cmd = 'SELECT'
  ) then
    raise exception 'Catalog review checklist read policy is missing';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'opportunity_versions'
      and policyname = 'published opportunity versions are public'
  ) then
    raise exception 'Public opportunity-version policy is missing';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'authorities'
      and policyname = 'published authorities are public'
      and qual ilike '%opportunity_versions%'
      and qual ilike '%review_status%'
      and qual ilike '%approved%'
  ) then
    raise exception 'Authority public policy must require an approved current version';
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'application_status_events'
      and policyname = 'members can create application status events'
      and with_check ilike '%actor_id is null%'
      and with_check ilike '%auth.uid()%'
  ) then
    raise exception 'Application status-event actor policy is not hardened';
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'application_document_links'
      and policyname = 'members can manage application document links'
      and with_check ilike '%business_documents%'
      and with_check ilike '%business_id%'
  ) then
    raise exception 'Application document-link tenant policy is not hardened';
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'application_tasks'
      and column_name = 'owner_id'
  ) or not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'application_tasks'
      and column_name = 'depends_on_task_ids'
  ) then
    raise exception 'Application task ownership or dependency columns are missing';
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'authority_coverage'
      and column_name = 'assessment_evidence_source_registry_id'
  ) then
    raise exception 'Authority assessment source registry linkage column is missing';
  end if;

  if not exists (
    select 1
    from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'authority_coverage'
      and t.tgname = 'authority_assessment_source_validation'
      and not t.tgisinternal
  ) then
    raise exception 'Authority assessment source registry trigger is missing';
  end if;

  if exists (
    select 1
    from public.authority_coverage coverage
    left join public.source_registry source
      on source.id = coverage.assessment_evidence_source_registry_id
    where coverage.assessment_status = 'assessed'
      and (
        coverage.assessment_evidence_source_registry_id is null
        or source.id is null
        or source.url <> coverage.assessment_evidence_url
      )
  ) then
    raise exception 'Authority assessment provenance mismatch';
  end if;

  foreach required_table in array array[
    'members can view application task status events',
    'members can create application task status events'
  ] loop
    if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'application_task_status_events' and policyname = required_table) then
      raise exception 'Application task status-event policy is missing: %', required_table;
    end if;
  end loop;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'catalog_audit_items'
      and policyname = 'reviewers can read catalog audit items'
      and cmd = 'SELECT'
  ) then
    raise exception 'Catalog audit sample read policy is missing';
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'catalog_audit_items'
      and policyname = 'reviewers can create catalog audit items'
      and cmd = 'INSERT'
  ) then
    raise exception 'Catalog audit sample insert policy is missing';
  end if;

  if not has_function_privilege(
    'authenticated',
    'public.record_catalog_accuracy_audit(uuid[],uuid[],text)',
    'EXECUTE'
  ) then
    raise exception 'Catalog accuracy audit function is not executable by authenticated reviewers';
  end if;

  if not exists (select 1 from storage.buckets where id = 'business-documents' and public = false) then
    raise exception 'Private business-documents storage bucket is missing or public';
  end if;

  if not exists (
    select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'storage' and c.relname = 'objects' and c.relrowsecurity = true
  ) then
    raise exception 'Storage object RLS is not enabled';
  end if;

  foreach required_table in array array[
    'business members can read document objects',
    'business members can upload document objects',
    'business members can delete document objects'
  ] loop
    if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = required_table) then
      raise exception 'Storage policy is missing: %', required_table;
    end if;
  end loop;

  if exists (
    select 1
    from public.opportunities o
    left join public.opportunity_versions v on v.id = o.current_version_id
    where o.status in ('active', 'upcoming')
      and (v.id is null or v.review_status <> 'approved')
  ) then
    raise exception 'An active/upcoming opportunity points to a non-approved version';
  end if;

  if exists (
    select 1
    from public.opportunity_versions v
    where v.review_status = 'approved'
      and (v.completeness < 0.95 or v.last_verified_at is null)
  ) then
    raise exception 'An approved opportunity version fails completeness or verification freshness prerequisites';
  end if;

  if exists (
    select 1
    from public.opportunity_versions v
    where v.review_status = 'approved'
      and not exists (
        select 1 from public.eligibility_rule_sets r
        where r.opportunity_version_id = v.id and r.reviewed = true
      )
  ) then
    raise exception 'Approved opportunity version has no reviewed eligibility rule set';
  end if;

  if exists (
    select 1
    from public.opportunity_versions v
    where v.review_status = 'approved'
      and (
        not exists (select 1 from public.opportunity_benefits b where b.opportunity_version_id = v.id)
        or not exists (select 1 from public.opportunity_requirements r where r.opportunity_version_id = v.id)
        or not exists (select 1 from public.opportunity_steps s where s.opportunity_version_id = v.id)
        or not exists (select 1 from public.opportunity_windows w where w.opportunity_version_id = v.id)
      )
  ) then
    raise exception 'Approved opportunity version is missing structured benefits, requirements, steps, or windows';
  end if;

  if exists (
    select 1
    from public.opportunity_versions v
    where v.review_status = 'approved'
      and not exists (
        select 1
        from public.opportunity_sources s
        where s.opportunity_version_id = v.id
          and s.is_primary = true
          and s.source_kind in ('gazette', 'guideline', 'ministry', 'agency')
          and s.source_url ~* '^https://'
          and (
            nullif(trim(s.source_anchor), '') is not null
            or s.page_number is not null
            or nullif(trim(s.section), '') is not null
            or nullif(trim(s.paragraph), '') is not null
            or nullif(trim(s.document_anchor), '') is not null
          )
          and s.source_registry_id is not null
      )
  ) then
    raise exception 'Approved opportunity version has no registered primary official source';
  end if;

  if not exists (
    select 1
    from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'source_snapshots'
      and t.tgname = 'source_snapshots_immutable_evidence'
      and not t.tgisinternal
  ) then
    raise exception 'Source snapshot immutability trigger is missing';
  end if;

  if not exists (
    select 1
    from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'change_events'
      and t.tgname = 'change_events_immutable_evidence'
      and not t.tgisinternal
  ) then
    raise exception 'Change-event immutability trigger is missing';
  end if;

  foreach required_table in array array[
    'opportunity_versions_approved_invariants',
    'opportunity_sources_approved_invariants',
    'opportunity_benefits_approved_invariants',
    'eligibility_rule_sets_approved_invariants',
    'opportunity_requirements_approved_invariants',
    'opportunity_steps_approved_invariants',
    'opportunity_windows_approved_invariants'
  ] loop
    if not exists (select 1 from pg_trigger where tgname = required_table and not tgisinternal) then
      raise exception 'Catalog publication invariant trigger is missing: %', required_table;
    end if;
  end loop;

  if exists (
    select 1
    from public.catalog_audits audit
    where audit.audit_type = 'factual_accuracy'
      and (
        (select count(*) from public.catalog_audit_items item where item.audit_id = audit.id) <> audit.sample_size
        or (select count(*) from public.catalog_audit_items item where item.audit_id = audit.id and item.accurate) <> audit.accurate_count
      )
  ) then
    raise exception 'A factual accuracy audit does not reconcile to its sampled records';
  end if;

  raise notice 'Catalog structural checks passed';
end $$;

-- The following queries should be empty before the Central beta gate is
-- declared ready. They are emitted as an operator-readable report rather
-- than hard failures so the reviewer can see the remaining work.
select 'unresolved_active_or_upcoming_discoveries' as check_name, count(*) as remaining
from public.catalog_discoveries
where lifecycle_status in ('active', 'upcoming')
  and (
    assessment_status <> 'assessed'
    or business_relevance in ('pending', 'unclear')
    or (business_relevance = 'relevant' and linked_opportunity_id is null)
    or (business_relevance = 'not_relevant' and nullif(trim(exclusion_reason), '') is null)
  );

select 'open_source_change_events' as check_name, count(*) as remaining
from public.change_events
where review_status = 'open'
  and event_type in ('initial', 'changed');

with latest_factual_audit as (
  select accuracy_percent
  from public.catalog_audits
  where audit_type = 'factual_accuracy'
  order by completed_at desc
  limit 1
)
select 'factual_accuracy_below_98' as check_name,
  case when coalesce((select accuracy_percent from latest_factual_audit), 0) >= 98 then 0 else 1 end as remaining;

with directory_inventory as (
  select
    source_registry.id as source_registry_id,
    source_registry.expected_item_count,
    count(authority_coverage.id) as discovered_count,
    count(authority_coverage.id) filter (where authority_coverage.assessment_status <> 'assessed') as unassessed_count
  from public.source_registry
  left join public.authority_coverage
    on authority_coverage.source_registry_id = source_registry.id
   and authority_coverage.authority_level in ('ministry', 'department')
  where source_registry.url in (
    'https://igod.gov.in/ug/E002/organizations',
    'https://igod.gov.in/ug/E003/organizations'
  )
  group by source_registry.id, source_registry.expected_item_count
)
select 'unassessed_central_authorities' as check_name,
  coalesce(sum(
    greatest(coalesce(expected_item_count, 0) - discovered_count, 0) + unassessed_count
  ), 0) as remaining
from directory_inventory;

select 'unresolved_opportunity_authority_crosswalk' as check_name, count(*) as remaining
from public.opportunities opportunity
left join public.opportunity_authority_reviews review
  on review.opportunity_id = opportunity.id
where opportunity.status not in ('archived', 'superseded')
  and (review.id is null or review.decision = 'pending');
