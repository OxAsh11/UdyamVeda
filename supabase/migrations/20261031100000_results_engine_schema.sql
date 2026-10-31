-- MVP M1 results engine (PRD §8.1, §8.4, FR-08):
--   opportunity_packs  which industry packs a catalog record belongs to
--   benefit_rates      own / subsidy / loan terms the calculator uses
--   last_checked_at    when someone last confirmed a record's status; lives on
--                      opportunities because approved versions are immutable
--   answer_state       a founder's "don't know" or "prefer not to say"

create table if not exists public.opportunity_packs (
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  pack_id text not null references public.packs(id) on delete cascade,
  primary key (opportunity_id, pack_id)
);

create index if not exists opportunity_packs_pack_idx on public.opportunity_packs (pack_id);

alter table public.opportunity_packs enable row level security;
create policy "opportunity packs are public" on public.opportunity_packs
  for select to anon, authenticated using (true);
create policy "reviewers manage opportunity packs" on public.opportunity_packs for all to authenticated
  using (public.is_catalog_reviewer((select auth.uid()))) with check (public.is_catalog_reviewer((select auth.uid())));

create table if not exists public.benefit_rates (
  id uuid primary key default gen_random_uuid(),
  opportunity_version_id uuid not null references public.opportunity_versions(id) on delete cascade,
  -- Lower is tried first, so the most generous row gets the lowest number.
  priority smallint not null default 100,
  -- Rule tree over fact_definitions keys; null means everyone.
  applies_when jsonb,
  area text not null default 'any' check (area in ('rural', 'urban', 'any')),
  project_types text[] not null default '{any}'
    check (project_types <@ array['any', 'manufacturing', 'service', 'trading', 'agri_allied'] and cardinality(project_types) > 0),
  own_pct numeric not null default 0 check (own_pct between 0 and 100),
  subsidy_pct numeric not null default 0 check (subsidy_pct between 0 and 100),
  subsidy_cap_inr numeric check (subsidy_cap_inr >= 0),
  -- "₹6.25 lakh or 20%, whichever is higher" (UP ODOP).
  subsidy_floor_inr numeric check (subsidy_floor_inr >= 0),
  loan_cap_inr numeric check (loan_cap_inr >= 0),
  project_min_inr numeric check (project_min_inr >= 0),
  project_cap_inr numeric check (project_cap_inr >= 0),
  interest_rate_pct numeric check (interest_rate_pct >= 0),
  interest_subvention_pct numeric check (interest_subvention_pct >= 0),
  label_en text not null,
  source_url text not null check (source_url ~* '^https://'),
  quote text not null check (nullif(trim(quote), '') is not null),
  created_at timestamptz not null default timezone('utc', now()),
  check (own_pct + subsidy_pct <= 100)
);

create index if not exists benefit_rates_version_idx on public.benefit_rates (opportunity_version_id, priority);

alter table public.benefit_rates enable row level security;
create policy "benefit rates are public" on public.benefit_rates
  for select to anon, authenticated using (true);
create policy "reviewers manage benefit rates" on public.benefit_rates for all to authenticated
  using (public.is_catalog_reviewer((select auth.uid()))) with check (public.is_catalog_reviewer((select auth.uid())));

alter table public.business_facts
  add column if not exists answer_state text not null default 'answered'
  check (answer_state in ('answered', 'dont_know', 'declined'));

alter table public.opportunities add column if not exists last_checked_at timestamptz;

update public.opportunities o
   set last_checked_at = v.last_verified_at
  from public.opportunity_versions v
 where v.id = o.current_version_id and o.last_checked_at is null;

-- Publishing a version means someone just confirmed the record.
create or replace function public.stamp_opportunity_checked()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.current_version_id is not null
     and (tg_op = 'INSERT' or new.current_version_id is distinct from old.current_version_id) then
    new.last_checked_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists opportunities_stamp_checked on public.opportunities;
create trigger opportunities_stamp_checked
before insert or update of current_version_id on public.opportunities
for each row execute function public.stamp_opportunity_checked();

-- A correction publishes a new version; without this a scheme would silently
-- lose its amounts every time its text is fixed.
create or replace function public.carry_benefit_rates_forward()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.current_version_id is not null
     and new.current_version_id is not null
     and new.current_version_id is distinct from old.current_version_id
     and not exists (select 1 from public.benefit_rates where opportunity_version_id = new.current_version_id) then
    insert into public.benefit_rates (
      opportunity_version_id, priority, applies_when, area, project_types, own_pct, subsidy_pct,
      subsidy_cap_inr, subsidy_floor_inr, loan_cap_inr, project_min_inr, project_cap_inr,
      interest_rate_pct, interest_subvention_pct, label_en, source_url, quote
    )
    select
      new.current_version_id, priority, applies_when, area, project_types, own_pct, subsidy_pct,
      subsidy_cap_inr, subsidy_floor_inr, loan_cap_inr, project_min_inr, project_cap_inr,
      interest_rate_pct, interest_subvention_pct, label_en, source_url, quote
    from public.benefit_rates
    where opportunity_version_id = old.current_version_id;
  end if;
  return null;
end;
$$;

drop trigger if exists opportunities_carry_benefit_rates on public.opportunities;
create trigger opportunities_carry_benefit_rates
after update of current_version_id on public.opportunities
for each row execute function public.carry_benefit_rates_forward();

-- "I opened the official source today and the status still holds": no new
-- version, just a fresh date and an audit trail (PRD §10.4).
create or replace function public.mark_opportunity_checked(p_slug text, p_note text default null)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid := auth.uid();
  opp_id uuid;
  checked_at timestamptz := now();
begin
  if actor_id is null or not public.is_catalog_reviewer(actor_id) then
    raise exception 'Catalog reviewer access is required.' using errcode = '42501';
  end if;

  update public.opportunities set last_checked_at = checked_at where slug = p_slug returning id into opp_id;
  if opp_id is null then
    raise exception 'Opportunity % not found.', p_slug using errcode = 'P0002';
  end if;

  insert into public.audit_logs (actor_id, entity_type, entity_id, action, metadata)
  values (actor_id, 'opportunity', opp_id, 'catalog_status_checked', jsonb_build_object('slug', p_slug, 'note', p_note));

  return checked_at;
end;
$$;

revoke all on function public.mark_opportunity_checked(text, text) from public;
revoke all on function public.mark_opportunity_checked(text, text) from anon;
grant execute on function public.mark_opportunity_checked(text, text) to authenticated;
