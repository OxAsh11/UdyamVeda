-- Make factual-accuracy audits auditable at the opportunity-version level.

create table if not exists public.catalog_audit_items (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid not null references public.catalog_audits(id) on delete cascade,
  opportunity_version_id uuid not null references public.opportunity_versions(id),
  accurate boolean not null,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (audit_id, opportunity_version_id)
);

create index if not exists catalog_audit_items_audit_idx
  on public.catalog_audit_items(audit_id);

alter table public.catalog_audit_items enable row level security;

create policy "reviewers can read catalog audit items"
  on public.catalog_audit_items for select
  to authenticated
  using (public.is_catalog_reviewer((select auth.uid())));

create policy "reviewers can create catalog audit items"
  on public.catalog_audit_items for insert
  to authenticated
  with check (public.is_catalog_reviewer((select auth.uid())));

create or replace function public.record_catalog_accuracy_audit(
  p_sample_version_ids uuid[],
  p_inaccurate_version_ids uuid[],
  p_notes text
)
returns public.catalog_audits
language plpgsql
security definer
set search_path = public
as $$
declare
  audit_row public.catalog_audits;
  sample_id uuid;
  sample_count integer := coalesce(array_length(p_sample_version_ids, 1), 0);
  inaccurate_count integer := coalesce(array_length(p_inaccurate_version_ids, 1), 0);
begin
  if not public.is_catalog_reviewer((select auth.uid())) then
    raise exception 'Catalog reviewer access is required';
  end if;
  if sample_count < 20 then
    raise exception 'A factual-accuracy audit must cover at least 20 records';
  end if;
  if nullif(trim(p_notes), '') is null then
    raise exception 'Sampling notes are required';
  end if;
  if p_sample_version_ids is null or p_inaccurate_version_ids is null then
    raise exception 'Sample version IDs are required';
  end if;
  if sample_count <> (select count(distinct value) from unnest(p_sample_version_ids) as sample_values(value)) then
    raise exception 'Sample version IDs must be unique';
  end if;
  if inaccurate_count <> (select count(distinct value) from unnest(p_inaccurate_version_ids) as inaccurate_values(value)) then
    raise exception 'Inaccurate version IDs must be unique';
  end if;
  if exists (
    select 1
    from unnest(p_inaccurate_version_ids) as inaccurate(version_id)
    where not (inaccurate.version_id = any(p_sample_version_ids))
  ) then
    raise exception 'Every inaccurate version must be included in the sample';
  end if;
  if exists (
    select 1
    from public.opportunity_versions version
    where version.id = any(p_sample_version_ids)
      and version.review_status <> 'approved'
  ) then
    raise exception 'Accuracy samples may only contain approved opportunity versions';
  end if;
  if exists (
    select 1
    from unnest(p_sample_version_ids) as sample(version_id)
    join public.opportunity_versions version on version.id = sample.version_id
    join public.opportunities opportunity on opportunity.id = version.opportunity_id
    where opportunity.status not in ('active', 'upcoming')
  ) then
    raise exception 'Accuracy samples may only contain active or upcoming opportunities';
  end if;
  if exists (
    select 1
    from unnest(p_sample_version_ids) as sample(version_id)
    left join public.opportunity_versions version on version.id = sample.version_id
    where version.id is null
  ) then
    raise exception 'Every sampled opportunity version must exist';
  end if;

  insert into public.catalog_audits (audit_type, sample_size, accurate_count, notes, audited_by)
  values ('factual_accuracy', sample_count, sample_count - inaccurate_count, trim(p_notes), (select auth.uid()))
  returning * into audit_row;

  foreach sample_id in array p_sample_version_ids loop
    insert into public.catalog_audit_items (audit_id, opportunity_version_id, accurate)
    values (audit_row.id, sample_id, not (sample_id = any(p_inaccurate_version_ids)));
  end loop;

  return audit_row;
end;
$$;

revoke all on function public.record_catalog_accuracy_audit(uuid[], uuid[], text) from public;
grant execute on function public.record_catalog_accuracy_audit(uuid[], uuid[], text) to authenticated;
