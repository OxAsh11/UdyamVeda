-- Controlled catalog review access.
-- Reviewers are explicitly provisioned in this table; publishing is never
-- available to ordinary signed-in users or anonymous visitors.

create table if not exists public.catalog_reviewers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email_snapshot text,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.is_catalog_reviewer(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.catalog_reviewers
    where user_id = target_user_id
      and active = true
  );
$$;

alter table public.catalog_reviewers enable row level security;
alter table public.authorities enable row level security;
alter table public.opportunity_versions enable row level security;
alter table public.opportunity_sources enable row level security;
alter table public.opportunity_benefits enable row level security;
alter table public.eligibility_rule_sets enable row level security;
alter table public.opportunity_requirements enable row level security;
alter table public.opportunity_steps enable row level security;
alter table public.opportunity_windows enable row level security;
alter table public.source_registry enable row level security;
alter table public.ingestion_runs enable row level security;
alter table public.review_tasks enable row level security;
alter table public.authority_coverage enable row level security;

create policy "reviewers can view their reviewer record"
  on public.catalog_reviewers for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "reviewers can view catalog opportunities"
  on public.opportunities for select
  to authenticated
  using (public.is_catalog_reviewer((select auth.uid())));

create policy "reviewers can update catalog opportunities"
  on public.opportunities for update
  to authenticated
  using (public.is_catalog_reviewer((select auth.uid())))
  with check (public.is_catalog_reviewer((select auth.uid())));

create policy "reviewers can manage authorities"
  on public.authorities for all
  to authenticated
  using (public.is_catalog_reviewer((select auth.uid())))
  with check (public.is_catalog_reviewer((select auth.uid())));

create policy "reviewers can manage opportunity versions"
  on public.opportunity_versions for all
  to authenticated
  using (public.is_catalog_reviewer((select auth.uid())))
  with check (public.is_catalog_reviewer((select auth.uid())));

create policy "reviewers can manage opportunity sources"
  on public.opportunity_sources for all
  to authenticated
  using (public.is_catalog_reviewer((select auth.uid())))
  with check (public.is_catalog_reviewer((select auth.uid())));

create policy "reviewers can manage opportunity benefits"
  on public.opportunity_benefits for all
  to authenticated
  using (public.is_catalog_reviewer((select auth.uid())))
  with check (public.is_catalog_reviewer((select auth.uid())));

create policy "reviewers can manage eligibility rules"
  on public.eligibility_rule_sets for all
  to authenticated
  using (public.is_catalog_reviewer((select auth.uid())))
  with check (public.is_catalog_reviewer((select auth.uid())));

create policy "reviewers can manage opportunity requirements"
  on public.opportunity_requirements for all
  to authenticated
  using (public.is_catalog_reviewer((select auth.uid())))
  with check (public.is_catalog_reviewer((select auth.uid())));

create policy "reviewers can manage opportunity steps"
  on public.opportunity_steps for all
  to authenticated
  using (public.is_catalog_reviewer((select auth.uid())))
  with check (public.is_catalog_reviewer((select auth.uid())));

create policy "reviewers can manage opportunity windows"
  on public.opportunity_windows for all
  to authenticated
  using (public.is_catalog_reviewer((select auth.uid())))
  with check (public.is_catalog_reviewer((select auth.uid())));

create policy "reviewers can manage source registry"
  on public.source_registry for all
  to authenticated
  using (public.is_catalog_reviewer((select auth.uid())))
  with check (public.is_catalog_reviewer((select auth.uid())));

create policy "reviewers can manage ingestion runs"
  on public.ingestion_runs for all
  to authenticated
  using (public.is_catalog_reviewer((select auth.uid())))
  with check (public.is_catalog_reviewer((select auth.uid())));

create policy "reviewers can manage review tasks"
  on public.review_tasks for all
  to authenticated
  using (public.is_catalog_reviewer((select auth.uid())))
  with check (public.is_catalog_reviewer((select auth.uid())));

create policy "reviewers can manage authority coverage"
  on public.authority_coverage for all
  to authenticated
  using (public.is_catalog_reviewer((select auth.uid())))
  with check (public.is_catalog_reviewer((select auth.uid())));

create policy "published authorities are public"
  on public.authorities for select
  to anon, authenticated
  using (exists (
    select 1
    from public.opportunities o
    where o.authority_id = id
      and o.status in ('active', 'upcoming', 'closed', 'superseded', 'archived')
  ));

create policy "published opportunity benefits are public"
  on public.opportunity_benefits for select
  to anon, authenticated
  using (exists (
    select 1 from public.opportunity_versions v
    where v.id = opportunity_version_id and v.review_status = 'approved'
  ));

create policy "published eligibility rules are public"
  on public.eligibility_rule_sets for select
  to anon, authenticated
  using (exists (
    select 1 from public.opportunity_versions v
    where v.id = opportunity_version_id and v.review_status = 'approved'
  ));

create policy "published opportunity requirements are public"
  on public.opportunity_requirements for select
  to anon, authenticated
  using (exists (
    select 1 from public.opportunity_versions v
    where v.id = opportunity_version_id and v.review_status = 'approved'
  ));

create policy "published opportunity steps are public"
  on public.opportunity_steps for select
  to anon, authenticated
  using (exists (
    select 1 from public.opportunity_versions v
    where v.id = opportunity_version_id and v.review_status = 'approved'
  ));

create policy "published opportunity windows are public"
  on public.opportunity_windows for select
  to anon, authenticated
  using (exists (
    select 1 from public.opportunity_versions v
    where v.id = opportunity_version_id and v.review_status = 'approved'
  ));

create policy "reviewers can write audit logs"
  on public.audit_logs for insert
  to authenticated
  with check (
    actor_id = (select auth.uid())
    and public.is_catalog_reviewer((select auth.uid()))
  );
