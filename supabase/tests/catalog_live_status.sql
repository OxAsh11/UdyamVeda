-- One result set: the management API returns only the last SELECT's rows.
select 'applied_migrations' as metric, count(*)::numeric as value from supabase_migrations.schema_migrations
union all select 'opportunities', count(*) from public.opportunities
union all select 'versions', count(*) from public.opportunity_versions
union all select 'missing_current_versions', count(*) from public.opportunities where current_version_id is null
union all select 'approved_versions', count(*) from public.opportunity_versions where review_status = 'approved'
union all select 'published_current_records', count(*) from public.opportunities o join public.opportunity_versions v on v.id=o.current_version_id where v.review_status='approved' and o.status in ('active','upcoming','closed','superseded','archived')
union all select 'source_registry', count(*) from public.source_registry
union all select 'source_snapshots', count(*) from public.source_snapshots
union all select 'authority_inventory', count(*) from public.authority_coverage
union all select 'unassessed_authorities', count(*) from public.authority_coverage where assessment_status <> 'assessed'
union all select 'review_tasks', count(*) from public.review_tasks where task_type='publish'
union all select 'pending_review_checks', count(*) from public.catalog_review_checks where status='pending'
union all select 'active_reviewers', count(*) from public.catalog_reviewers where active
union all select 'factual_audits', count(*) from public.catalog_audits where audit_type='factual_accuracy'
union all select 'unresolved_authority_crosswalk', count(*) from public.opportunities o left join public.opportunity_authority_reviews r on r.opportunity_id=o.id where r.id is null or r.decision='pending'
union all select 'private_document_bucket', count(*) from storage.buckets where id='business-documents' and public=false
order by metric;
