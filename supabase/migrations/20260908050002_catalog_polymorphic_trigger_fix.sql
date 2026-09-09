-- Make the publication contract database-enforced, not only an API promise.
-- Approved versions are historical evidence: corrections create a new version
-- instead of mutating or deleting the approved record and its child evidence.

create or replace function public.assert_approved_catalog_version()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  version_id uuid;
  version_row public.opportunity_versions%rowtype;
begin
  if tg_op = 'DELETE' then
    if tg_table_name = 'opportunity_versions' then
      version_id := old.id;
    else
      version_id := old.opportunity_version_id;
    end if;
  elsif tg_table_name = 'opportunity_versions' then
    version_id := new.id;
  else
    version_id := new.opportunity_version_id;
  end if;

  if tg_table_name = 'opportunity_versions' then
    if tg_op = 'DELETE' and old.review_status = 'approved' then
    raise exception 'Approved opportunity versions cannot be deleted; create a correction version';
    end if;
  end if;

  select * into version_row
  from public.opportunity_versions
  where id = version_id;

  if version_row.id is null or version_row.review_status <> 'approved' then
    return null;
  end if;

  if tg_table_name = 'opportunity_versions' then
    if tg_op = 'UPDATE'
    and old.review_status = 'approved'
    and (
      new.title is distinct from old.title
      or new.summary is distinct from old.summary
      or new.objective is distinct from old.objective
      or new.legal_basis is distinct from old.legal_basis
      or new.eligibility is distinct from old.eligibility
      or new.application is distinct from old.application
      or new.fine_print is distinct from old.fine_print
      or new.benefit_summary is distinct from old.benefit_summary
      or new.effective_from is distinct from old.effective_from
      or new.effective_to is distinct from old.effective_to
      or new.last_verified_at is distinct from old.last_verified_at
      or new.completeness is distinct from old.completeness
      or new.confidence is distinct from old.confidence
      or new.content_hash is distinct from old.content_hash
    )
  then
    raise exception 'Approved opportunity versions are immutable; create a correction version';
    end if;
  end if;

  if nullif(trim(version_row.title), '') is null
    or nullif(trim(version_row.objective), '') is null
    or version_row.eligibility = '{}'::jsonb
    or version_row.application = '{}'::jsonb
    or version_row.fine_print = '{}'::jsonb
    or version_row.benefit_summary = '{}'::jsonb
  then
    raise exception 'Approved opportunity version is missing required editorial fields';
  end if;

  if version_row.completeness < 0.95 or version_row.last_verified_at is null then
    raise exception 'Approved opportunity version does not meet completeness or verification requirements';
  end if;

  if not exists (
    select 1 from public.eligibility_rule_sets
    where opportunity_version_id = version_id and reviewed = true
  ) then
    raise exception 'Approved opportunity version has no reviewed eligibility rule set';
  end if;

  if not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id)
    or not exists (select 1 from public.opportunity_requirements where opportunity_version_id = version_id)
    or not exists (select 1 from public.opportunity_steps where opportunity_version_id = version_id)
    or not exists (select 1 from public.opportunity_windows where opportunity_version_id = version_id)
  then
    raise exception 'Approved opportunity version is missing structured benefits, requirements, steps, or windows';
  end if;

  if not exists (
    select 1
    from public.opportunity_sources source
    where source.opportunity_version_id = version_id
      and source.is_primary = true
      and source.source_kind in ('gazette', 'guideline', 'ministry', 'agency')
      and source.source_url ~* '^https://'
      and (
        nullif(trim(source.source_anchor), '') is not null
        or source.page_number is not null
        or nullif(trim(source.section), '') is not null
        or nullif(trim(source.paragraph), '') is not null
        or nullif(trim(source.document_anchor), '') is not null
      )
      and source.source_registry_id is not null
  ) then
    raise exception 'Approved opportunity version has no registered primary official source';
  end if;

  return null;
end;
$$;
