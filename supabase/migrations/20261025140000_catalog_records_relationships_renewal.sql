-- MVP PRD P0.4 apply step:
--   * "pending_renewal" lifecycle status (PRD bucket C)
--   * publish_catalog_correction() can replace eligibility rules and set pending_renewal
--   * scheme_relationships table (stacking, PRD §8.3)
--   * publish_catalog_record() for brand-new published records

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
  if next_status not in ('active', 'upcoming', 'paused', 'pending_renewal', 'closed') then
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

  -- Step text, matched by step number.
  if jsonb_typeof(p_changes -> 'steps') = 'array' then
    update public.opportunity_steps s
       set title = coalesce(patch ->> 'title', s.title),
           description = case when patch ? 'description' then patch ->> 'description' else s.description end
      from jsonb_array_elements(p_changes -> 'steps') as patch
     where s.opportunity_version_id = new_version_id
       and s.step_number = (patch ->> 'step_number')::integer;
  end if;

  -- Requirement text, matched by the current requirement name.
  if jsonb_typeof(p_changes -> 'requirements') = 'array' then
    update public.opportunity_requirements r
       set name = coalesce(patch ->> 'new_name', r.name),
           description = case when patch ? 'description' then patch ->> 'description' else r.description end
      from jsonb_array_elements(p_changes -> 'requirements') as patch
     where r.opportunity_version_id = new_version_id
       and r.name = patch ->> 'name';
  end if;

  -- Replace the eligibility rule tree (e.g. to add a condition the approved
  -- version missed). The copied rule set keeps its evidence and stays reviewed.
  if jsonb_typeof(p_changes -> 'rules') = 'object' then
    update public.eligibility_rule_sets
       set rules = p_changes -> 'rules', reviewed = true
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

-- ---------------------------------------------------------------------------
-- "Pending renewal": the scheme period ended and renewal is awaited (PRD
-- bucket C). Publicly visible like paused/closed records.
-- ---------------------------------------------------------------------------
alter table public.opportunities drop constraint if exists opportunities_status_check;
alter table public.opportunities add constraint opportunities_status_check
  check (status in ('draft', 'in_review', 'active', 'upcoming', 'paused', 'pending_renewal', 'closed', 'superseded', 'archived'));

create or replace function public.keep_unreviewed_catalog_private()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status in ('active', 'upcoming', 'paused', 'pending_renewal', 'closed', 'superseded', 'archived') then
    new.reported_lifecycle_status := new.status;
    if not exists (
      select 1 from public.opportunity_versions v
      where v.id = new.current_version_id and v.review_status = 'approved'
    ) then
      new.status := 'in_review';
    end if;
  end if;
  return new;
end $$;

drop policy if exists "published opportunities are public" on public.opportunities;
create policy "published opportunities are public"
  on public.opportunities for select
  to anon, authenticated
  using (
    status in ('active', 'upcoming', 'paused', 'pending_renewal', 'closed', 'superseded', 'archived')
    and exists (
      select 1 from public.opportunity_versions v
      where v.id = current_version_id and v.review_status = 'approved'
    )
  );

-- ---------------------------------------------------------------------------
-- Which schemes can be combined on the same project (PRD §8.3). Every row
-- carries its official source; the engine never infers "stackable".
-- ---------------------------------------------------------------------------
create table if not exists public.scheme_relationships (
  id uuid primary key default gen_random_uuid(),
  opportunity_a uuid not null references public.opportunities(id) on delete cascade,
  opportunity_b uuid not null references public.opportunities(id) on delete cascade,
  relation text not null check (relation in ('stackable', 'exclusive', 'sequential', 'conditional', 'unknown')),
  cap_rule jsonb,
  note_en text,
  source_url text not null check (source_url ~* '^https://'),
  quote text not null,
  verified_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  check (opportunity_a <> opportunity_b),
  unique (opportunity_a, opportunity_b, relation)
);

alter table public.scheme_relationships enable row level security;
create policy "scheme relationships are public" on public.scheme_relationships
  for select to anon, authenticated using (true);
create policy "reviewers manage scheme relationships" on public.scheme_relationships for all to authenticated
  using (public.is_catalog_reviewer((select auth.uid()))) with check (public.is_catalog_reviewer((select auth.uid())));

-- ---------------------------------------------------------------------------
-- One-step creation of a new published record, the counterpart of
-- publish_catalog_correction(). Creates (or reuses) the authority and the
-- registered sources, inserts the version and every child row, approves it
-- under the existing publication contract, and records a completed review
-- task, its seven checks and an audit log entry. All or nothing.
--
-- p_record: {slug, name, opportunity_type, status, coverage, locations[],
--   canonical_url, authority{name, level, ministry, department, official_url},
--   version{title, summary, objective, legal_basis, eligibility, application,
--     fine_print, benefit_summary, completeness, confidence},
--   benefits[], requirements[], steps[], windows[], sources[], rules}
-- ---------------------------------------------------------------------------
create or replace function public.publish_catalog_record(p_record jsonb, p_reason text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid := auth.uid();
  v_slug text := p_record ->> 'slug';
  v_status text := coalesce(p_record ->> 'status', 'active');
  v_authority uuid;
  v_opportunity uuid;
  v_version uuid := gen_random_uuid();
  v_source jsonb;
  v_registry uuid;
  task_id uuid;
begin
  if actor_id is null or not public.is_catalog_reviewer(actor_id) then
    raise exception 'Catalog reviewer access is required.' using errcode = '42501';
  end if;
  if nullif(trim(coalesce(p_reason, '')), '') is null then
    raise exception 'A reason is required.' using errcode = '22023';
  end if;
  if v_slug is null or v_slug !~ '^[a-z0-9][a-z0-9-]*$' then
    raise exception 'A lowercase slug is required.' using errcode = '22023';
  end if;
  if exists (select 1 from public.opportunities where slug = v_slug) then
    raise exception 'Opportunity % already exists; use publish_catalog_correction.', v_slug using errcode = '23505';
  end if;
  if v_status not in ('active', 'upcoming', 'paused', 'pending_renewal', 'closed') then
    raise exception 'Unsupported status %.', v_status using errcode = '22023';
  end if;

  select id into v_authority from public.authorities where name = p_record #>> '{authority,name}' limit 1;
  if v_authority is null then
    insert into public.authorities (name, level, ministry, department, official_url, active)
    values (p_record #>> '{authority,name}', coalesce(p_record #>> '{authority,level}', 'central'),
            p_record #>> '{authority,ministry}', p_record #>> '{authority,department}', p_record #>> '{authority,official_url}', true)
    returning id into v_authority;
  end if;

  insert into public.opportunities (slug, name, opportunity_type, status, authority_id, geography, canonical_url, is_business_relevant)
  values (v_slug, p_record ->> 'name', p_record ->> 'opportunity_type', v_status, v_authority,
          jsonb_build_object('coverage', coalesce(p_record ->> 'coverage', 'central'), 'locations', coalesce(p_record -> 'locations', '[]'::jsonb)),
          p_record ->> 'canonical_url', true)
  returning id into v_opportunity;

  insert into public.opportunity_versions (
    id, opportunity_id, version_number, title, summary, objective, legal_basis,
    eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status
  ) values (
    v_version, v_opportunity, 1,
    p_record #>> '{version,title}', p_record #>> '{version,summary}', p_record #>> '{version,objective}', p_record #>> '{version,legal_basis}',
    coalesce(p_record #> '{version,eligibility}', '{}'::jsonb), coalesce(p_record #> '{version,application}', '{}'::jsonb),
    coalesce(p_record #> '{version,fine_print}', '{}'::jsonb), coalesce(p_record #> '{version,benefit_summary}', '{}'::jsonb),
    timezone('utc', now()), coalesce((p_record #>> '{version,completeness}')::numeric, 1), coalesce((p_record #>> '{version,confidence}')::numeric, 0.9), 'draft'
  );

  insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_min, amount_max, currency, percentage, conditions)
  select v_version, x.benefit_type, x.label, x.amount_min, x.amount_max, coalesce(x.currency, 'INR'), x.percentage, coalesce(x.conditions, '{}'::jsonb)
  from jsonb_to_recordset(coalesce(p_record -> 'benefits', '[]'::jsonb))
    as x(benefit_type text, label text, amount_min numeric, amount_max numeric, currency text, percentage numeric, conditions jsonb);

  insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
  select v_version, x.requirement_type, x.name, x.description, coalesce(x.required, true)
  from jsonb_to_recordset(coalesce(p_record -> 'requirements', '[]'::jsonb))
    as x(requirement_type text, name text, description text, required boolean);

  insert into public.opportunity_steps (opportunity_version_id, step_number, title, description, official_url, expected_days)
  select v_version, x.step_number, x.title, x.description, x.official_url, x.expected_days
  from jsonb_to_recordset(coalesce(p_record -> 'steps', '[]'::jsonb))
    as x(step_number integer, title text, description text, official_url text, expected_days integer);

  insert into public.opportunity_windows (opportunity_version_id, window_type, opens_at, closes_at, label, source_evidence)
  select v_version, x.window_type, x.opens_at, x.closes_at, x.label, coalesce(x.source_evidence, '{}'::jsonb)
  from jsonb_to_recordset(coalesce(p_record -> 'windows', '[]'::jsonb))
    as x(window_type text, opens_at timestamptz, closes_at timestamptz, label text, source_evidence jsonb);

  for v_source in select * from jsonb_array_elements(coalesce(p_record -> 'sources', '[]'::jsonb)) loop
    insert into public.source_registry (name, url, source_kind, coverage_level, cadence, active, verification_required, notes)
    values (coalesce(v_source ->> 'registry_name', v_source ->> 'title', v_source ->> 'url'), v_source ->> 'url', v_source ->> 'kind',
            coalesce(p_record ->> 'coverage', 'central'), 'monthly', true, true, 'Registered by publish_catalog_record for ' || v_slug)
    on conflict (url) do update set active = true
    returning id into v_registry;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary, source_registry_id, page_number, section)
    values (v_version, v_source ->> 'url', v_source ->> 'kind', v_source ->> 'title', v_source ->> 'anchor', timezone('utc', now()),
            coalesce((v_source ->> 'is_primary')::boolean, false), v_registry, (v_source ->> 'page_number')::integer, v_source ->> 'section');
  end loop;

  insert into public.eligibility_rule_sets (opportunity_version_id, rules, rule_version, source_evidence, reviewed)
  values (v_version, coalesce(p_record -> 'rules', '{}'::jsonb), '1.0', coalesce(p_record -> 'sources', '[]'::jsonb), true);

  update public.opportunity_versions
     set content_hash = md5(concat_ws('|', title, summary, objective, legal_basis, eligibility::text, application::text, fine_print::text, benefit_summary::text)),
         review_status = 'approved', reviewed_by = actor_id, reviewed_at = timezone('utc', now())
   where id = v_version;

  update public.opportunities set status = v_status where id = v_opportunity;

  insert into public.review_tasks (opportunity_version_id, task_type, status, assigned_to, reviewer_notes, completed_at)
  values (v_version, 'publish', 'approved', actor_id, 'New record: ' || trim(p_reason), timezone('utc', now()))
  returning id into task_id;

  update public.catalog_review_checks
     set status = 'passed', reviewer_note = 'New record: ' || trim(p_reason),
         evidence = jsonb_build_object('reason', trim(p_reason), 'sources', coalesce(p_record -> 'sources', '[]'::jsonb)),
         reviewed_by = actor_id, reviewed_at = timezone('utc', now())
   where review_task_id = task_id;

  insert into public.audit_logs (actor_id, entity_type, entity_id, action, metadata)
  values (actor_id, 'opportunity_version', v_version, 'catalog_new_record', jsonb_build_object('slug', v_slug, 'reason', trim(p_reason)));

  return jsonb_build_object('opportunity_id', v_opportunity, 'version_id', v_version, 'status', v_status);
end;
$$;

revoke all on function public.publish_catalog_record(jsonb, text) from public;
revoke all on function public.publish_catalog_record(jsonb, text) from anon;
grant execute on function public.publish_catalog_record(jsonb, text) to authenticated;
