-- One-step correction for a published catalog record.
--
-- Approved versions are immutable by design (assert_approved_catalog_version),
-- so every edit has to become a new version. Doing that by hand meant copying
-- the version and seven child tables, re-running the seven-check review and
-- relinking the opportunity. This function does all of it in one transaction:
--
--   1. copies the current approved version into a new draft version,
--   2. copies every child row (benefits, requirements, steps, windows, sources,
--      eligibility rule sets, taxonomy terms),
--   3. applies the requested changes,
--   4. approves it (the existing trigger still enforces the full publication
--      contract: official source, reviewed rules, structured content),
--   5. records a completed review task, its seven checks and an audit log entry,
--   6. points the opportunity at the new version and sets its lifecycle status.
--
-- Any failure rolls the whole correction back; the previous approved version
-- stays live and untouched.
--
-- p_changes keys (all optional):
--   status          'active' | 'upcoming' | 'paused' | 'closed'
--   official_url    canonical URL on the opportunity
--   title, summary, objective, legal_basis   plain text on the version
--   eligibility, application, fine_print, benefit_summary
--                   objects merged into the stored JSON; a key set to null
--                   is removed (e.g. {"applicant_note": null})
--   window          {window_type, opens_at, closes_at, label}; opens_at and
--                   closes_at accept null to clear the date

create or replace function public.catalog_merge_json(base jsonb, patch jsonb)
returns jsonb
language sql
immutable
as $$
  select case
    when patch is null or jsonb_typeof(patch) <> 'object' then base
    else (coalesce(base, '{}'::jsonb) || patch)
      - coalesce(array(select key from jsonb_each(patch) where value = 'null'::jsonb), '{}'::text[])
  end
$$;

create or replace function public.publish_catalog_correction(
  p_slug text,
  p_changes jsonb,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid := auth.uid();
  opp public.opportunities%rowtype;
  old_version public.opportunity_versions%rowtype;
  new_version_id uuid := gen_random_uuid();
  new_version_number integer;
  next_status text;
  child_table text;
  column_list text;
  window_patch jsonb := p_changes -> 'window';
  task_id uuid;
begin
  if actor_id is null or not public.is_catalog_reviewer(actor_id) then
    raise exception 'Catalog reviewer access is required.' using errcode = '42501';
  end if;
  if nullif(trim(coalesce(p_reason, '')), '') is null then
    raise exception 'A reason for the correction is required.' using errcode = '22023';
  end if;
  if p_changes is null or jsonb_typeof(p_changes) <> 'object' then
    raise exception 'Changes must be a JSON object.' using errcode = '22023';
  end if;

  select * into opp from public.opportunities where slug = p_slug for update;
  if not found then
    raise exception 'Opportunity % not found.', p_slug using errcode = 'P0002';
  end if;

  select * into old_version from public.opportunity_versions where id = opp.current_version_id;
  if old_version.id is null or old_version.review_status <> 'approved' then
    raise exception 'Only a published (approved) record can be corrected here.' using errcode = '22023';
  end if;

  next_status := coalesce(p_changes ->> 'status', opp.status);
  if next_status not in ('active', 'upcoming', 'paused', 'closed') then
    raise exception 'Unsupported status %.', next_status using errcode = '22023';
  end if;

  select max(version_number) + 1 into new_version_number
  from public.opportunity_versions where opportunity_id = opp.id;

  insert into public.opportunity_versions (
    id, opportunity_id, version_number, title, summary, objective, legal_basis,
    eligibility, application, fine_print, benefit_summary, effective_from, effective_to,
    last_verified_at, completeness, confidence, review_status
  ) values (
    new_version_id, opp.id, new_version_number,
    coalesce(p_changes ->> 'title', old_version.title),
    coalesce(p_changes ->> 'summary', old_version.summary),
    coalesce(p_changes ->> 'objective', old_version.objective),
    coalesce(p_changes ->> 'legal_basis', old_version.legal_basis),
    public.catalog_merge_json(old_version.eligibility, p_changes -> 'eligibility'),
    public.catalog_merge_json(old_version.application, p_changes -> 'application'),
    public.catalog_merge_json(old_version.fine_print, p_changes -> 'fine_print'),
    public.catalog_merge_json(old_version.benefit_summary, p_changes -> 'benefit_summary'),
    old_version.effective_from, old_version.effective_to,
    timezone('utc', now()), old_version.completeness, old_version.confidence, 'draft'
  );

  -- Copy every child table generically so new columns are never silently dropped.
  foreach child_table in array array[
    'opportunity_benefits', 'opportunity_requirements', 'opportunity_steps', 'opportunity_windows',
    'opportunity_sources', 'eligibility_rule_sets', 'opportunity_taxonomy_terms'
  ] loop
    select string_agg(quote_ident(column_name), ', ' order by ordinal_position) into column_list
    from information_schema.columns
    where table_schema = 'public' and table_name = child_table
      and column_name not in ('id', 'opportunity_version_id')
      and is_generated = 'NEVER';
    execute format(
      'insert into public.%I (opportunity_version_id, %s) select $1, %s from public.%I where opportunity_version_id = $2',
      child_table, column_list, column_list, child_table
    ) using new_version_id, old_version.id;
  end loop;

  if window_patch is not null and jsonb_typeof(window_patch) = 'object' then
    update public.opportunity_windows
       set window_type = coalesce(window_patch ->> 'window_type', window_type),
           opens_at = case when window_patch ? 'opens_at' then (window_patch ->> 'opens_at')::timestamptz else opens_at end,
           closes_at = case when window_patch ? 'closes_at' then (window_patch ->> 'closes_at')::timestamptz else closes_at end,
           label = coalesce(window_patch ->> 'label', label)
     where opportunity_version_id = new_version_id;
  end if;

  update public.opportunity_versions
     set content_hash = md5(concat_ws('|', title, summary, objective, legal_basis, eligibility::text,
                                      application::text, fine_print::text, benefit_summary::text)),
         review_status = 'approved',
         reviewed_by = actor_id,
         reviewed_at = timezone('utc', now())
   where id = new_version_id;

  insert into public.review_tasks (opportunity_version_id, task_type, status, assigned_to, reviewer_notes, completed_at)
  values (new_version_id, 'publish', 'approved', actor_id, 'Correction: ' || trim(p_reason), timezone('utc', now()))
  returning id into task_id;

  update public.catalog_review_checks
     set status = 'passed',
         reviewer_note = 'Correction of a published record: ' || trim(p_reason),
         evidence = jsonb_build_object(
           'correction_of_version', old_version.id,
           'reason', trim(p_reason),
           'changed_fields', (select coalesce(jsonb_agg(key order by key), '[]'::jsonb) from jsonb_object_keys(p_changes) as key)
         ),
         reviewed_by = actor_id,
         reviewed_at = timezone('utc', now())
   where review_task_id = task_id;

  update public.opportunities
     set current_version_id = new_version_id,
         status = next_status,
         canonical_url = coalesce(nullif(trim(p_changes ->> 'official_url'), ''), canonical_url)
   where id = opp.id;

  insert into public.audit_logs (actor_id, entity_type, entity_id, action, metadata)
  values (actor_id, 'opportunity_version', new_version_id, 'catalog_correction', jsonb_build_object(
    'slug', p_slug,
    'previous_version_id', old_version.id,
    'version_number', new_version_number,
    'reason', trim(p_reason),
    'changes', p_changes
  ));

  return jsonb_build_object(
    'version_id', new_version_id,
    'version_number', new_version_number,
    'previous_version_id', old_version.id,
    'status', next_status
  );
end;
$$;

revoke all on function public.publish_catalog_correction(text, jsonb, text) from public;
revoke all on function public.publish_catalog_correction(text, jsonb, text) from anon;
grant execute on function public.publish_catalog_correction(text, jsonb, text) to authenticated;
