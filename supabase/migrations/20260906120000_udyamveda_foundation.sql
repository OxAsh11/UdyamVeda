-- UdyamVeda foundation: versioned opportunity intelligence and multi-business workspaces.
-- This migration is intentionally additive so the existing Center tables and user journeys remain intact.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text,
  state text,
  district text,
  sector text,
  lifecycle_stage text,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.business_memberships (
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'admin', 'member', 'professional')),
  created_at timestamptz not null default timezone('utc', now()),
  primary key (business_id, user_id)
);

create table if not exists public.business_facts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  fact_key text not null,
  fact_value jsonb not null default '{}'::jsonb,
  source text not null default 'user',
  confidence numeric(5, 4) not null default 1,
  verified_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (business_id, fact_key)
);

create table if not exists public.consent_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_id uuid references public.businesses(id) on delete cascade,
  purpose text not null,
  policy_version text not null,
  granted boolean not null,
  granted_at timestamptz not null default timezone('utc', now()),
  withdrawn_at timestamptz
);

create table if not exists public.authorities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  level text not null default 'central' check (level in ('central', 'state', 'local')),
  ministry text,
  department text,
  official_url text,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  opportunity_type text not null,
  status text not null default 'draft' check (status in ('draft', 'in_review', 'active', 'upcoming', 'paused', 'closed', 'superseded', 'archived')),
  authority_id uuid references public.authorities(id),
  geography jsonb not null default '{}'::jsonb,
  canonical_url text,
  current_version_id uuid,
  is_business_relevant boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.opportunity_versions (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  version_number integer not null,
  title text not null,
  summary text,
  objective text,
  legal_basis text,
  eligibility jsonb not null default '{}'::jsonb,
  application jsonb not null default '{}'::jsonb,
  fine_print jsonb not null default '{}'::jsonb,
  benefit_summary jsonb not null default '{}'::jsonb,
  effective_from date,
  effective_to date,
  last_verified_at timestamptz,
  completeness numeric(5, 4) not null default 0,
  confidence numeric(5, 4) not null default 0,
  content_hash text,
  review_status text not null default 'draft' check (review_status in ('draft', 'in_review', 'approved', 'rejected')),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  unique (opportunity_id, version_number)
);

alter table public.opportunities
  drop constraint if exists opportunities_current_version_fk;
alter table public.opportunities
  add constraint opportunities_current_version_fk
  foreign key (current_version_id) references public.opportunity_versions(id);

create table if not exists public.opportunity_sources (
  id uuid primary key default gen_random_uuid(),
  opportunity_version_id uuid not null references public.opportunity_versions(id) on delete cascade,
  source_url text not null,
  source_kind text not null check (source_kind in ('gazette', 'guideline', 'ministry', 'agency', 'myscheme', 'startup_india', 'pib', 'other')),
  source_title text,
  source_anchor text,
  published_at date,
  fetched_at timestamptz not null default timezone('utc', now()),
  content_hash text,
  is_primary boolean not null default false
);

create table if not exists public.opportunity_benefits (
  id uuid primary key default gen_random_uuid(),
  opportunity_version_id uuid not null references public.opportunity_versions(id) on delete cascade,
  benefit_type text not null check (benefit_type in ('grant', 'loan', 'subsidy', 'tax', 'guarantee', 'reimbursement', 'recognition', 'training', 'market_access', 'mentorship')),
  label text not null,
  amount_min numeric,
  amount_max numeric,
  currency text not null default 'INR',
  percentage numeric,
  conditions jsonb not null default '{}'::jsonb
);

create table if not exists public.eligibility_rule_sets (
  id uuid primary key default gen_random_uuid(),
  opportunity_version_id uuid not null references public.opportunity_versions(id) on delete cascade,
  rules jsonb not null default '{}'::jsonb,
  rule_version text not null default '1.0',
  source_evidence jsonb not null default '[]'::jsonb,
  reviewed boolean not null default false
);

create table if not exists public.opportunity_requirements (
  id uuid primary key default gen_random_uuid(),
  opportunity_version_id uuid not null references public.opportunity_versions(id) on delete cascade,
  requirement_type text not null check (requirement_type in ('document', 'registration', 'declaration', 'financial', 'other')),
  name text not null,
  description text,
  required boolean not null default true,
  accepted_formats text[] not null default '{}',
  max_size_mb numeric
);

create table if not exists public.opportunity_steps (
  id uuid primary key default gen_random_uuid(),
  opportunity_version_id uuid not null references public.opportunity_versions(id) on delete cascade,
  step_number integer not null,
  title text not null,
  description text,
  official_url text,
  expected_days integer,
  depends_on integer[] not null default '{}'
);

create table if not exists public.source_registry (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null unique,
  source_kind text not null,
  coverage_level text not null default 'central',
  cadence text not null default 'weekly',
  active boolean not null default true,
  last_checked_at timestamptz,
  last_content_hash text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.ingestion_runs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.source_registry(id),
  workflow_run_id text,
  status text not null default 'queued' check (status in ('queued', 'running', 'needs_review', 'completed', 'failed')),
  discovered_count integer not null default 0,
  changed_count integer not null default 0,
  error text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.review_tasks (
  id uuid primary key default gen_random_uuid(),
  opportunity_version_id uuid references public.opportunity_versions(id) on delete cascade,
  ingestion_run_id uuid references public.ingestion_runs(id) on delete set null,
  task_type text not null default 'publish',
  status text not null default 'open' check (status in ('open', 'in_review', 'approved', 'rejected')),
  assigned_to uuid references auth.users(id),
  reviewer_notes text,
  created_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz
);

create table if not exists public.saved_opportunities (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  status text not null default 'saved' check (status in ('saved', 'started', 'applied', 'approved', 'rejected', 'withdrawn')),
  created_at timestamptz not null default timezone('utc', now()),
  unique (business_id, opportunity_id)
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  opportunity_id uuid references public.opportunities(id),
  opportunity_version_id uuid references public.opportunity_versions(id),
  status text not null default 'started' check (status in ('started', 'ready', 'submitted', 'under_review', 'approved', 'rejected', 'withdrawn')),
  eligibility_snapshot jsonb not null default '{}'::jsonb,
  official_portal_url text,
  target_date date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.application_tasks (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'blocked', 'done')),
  due_date date,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz
);

create table if not exists public.business_documents (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null,
  checksum text,
  sensitivity text not null default 'standard' check (sensitivity in ('standard', 'sensitive', 'highly_sensitive')),
  expires_at date,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_id uuid references public.businesses(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  business_id uuid references public.businesses(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists businesses_owner_idx on public.businesses(owner_id);
create unique index if not exists businesses_owner_unique_idx on public.businesses(owner_id);
create index if not exists business_memberships_user_idx on public.business_memberships(user_id);
create index if not exists opportunities_status_idx on public.opportunities(status);
create index if not exists opportunities_type_idx on public.opportunities(opportunity_type);
create index if not exists opportunity_versions_opportunity_idx on public.opportunity_versions(opportunity_id, version_number desc);
create index if not exists opportunity_sources_version_idx on public.opportunity_sources(opportunity_version_id);
create index if not exists applications_business_idx on public.applications(business_id, status);
create index if not exists documents_business_idx on public.business_documents(business_id, deleted_at);
create index if not exists notifications_user_idx on public.notifications(user_id, read_at, created_at desc);

drop trigger if exists businesses_updated_at on public.businesses;
create trigger businesses_updated_at before update on public.businesses for each row execute function public.set_updated_at();
drop trigger if exists business_facts_updated_at on public.business_facts;
create trigger business_facts_updated_at before update on public.business_facts for each row execute function public.set_updated_at();
drop trigger if exists opportunities_updated_at on public.opportunities;
create trigger opportunities_updated_at before update on public.opportunities for each row execute function public.set_updated_at();
drop trigger if exists applications_updated_at on public.applications;
create trigger applications_updated_at before update on public.applications for each row execute function public.set_updated_at();

create or replace function public.is_business_member(target_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.business_memberships
    where business_id = target_business_id and user_id = (select auth.uid())
  );
$$;

alter table public.businesses enable row level security;
alter table public.business_memberships enable row level security;
alter table public.business_facts enable row level security;
alter table public.consent_records enable row level security;
alter table public.saved_opportunities enable row level security;
alter table public.applications enable row level security;
alter table public.application_tasks enable row level security;
alter table public.business_documents enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

create policy "business members can view businesses" on public.businesses for select to authenticated using (owner_id = (select auth.uid()) or public.is_business_member(id));
create policy "owners can create businesses" on public.businesses for insert to authenticated with check (owner_id = (select auth.uid()));
create policy "owners can update businesses" on public.businesses for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

create policy "members can view memberships" on public.business_memberships for select to authenticated using (user_id = (select auth.uid()) or public.is_business_member(business_id));
create policy "owners can manage memberships" on public.business_memberships for all to authenticated using (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = (select auth.uid()))) with check (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = (select auth.uid())));

create policy "members can manage business facts" on public.business_facts for all to authenticated using (public.is_business_member(business_id)) with check (public.is_business_member(business_id));
create policy "users can manage their consents" on public.consent_records for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "members can manage saved opportunities" on public.saved_opportunities for all to authenticated using (public.is_business_member(business_id)) with check (public.is_business_member(business_id));
create policy "members can manage applications" on public.applications for all to authenticated using (public.is_business_member(business_id)) with check (public.is_business_member(business_id));
create policy "members can manage application tasks" on public.application_tasks for all to authenticated using (exists (select 1 from public.applications a where a.id = application_id and public.is_business_member(a.business_id))) with check (exists (select 1 from public.applications a where a.id = application_id and public.is_business_member(a.business_id)));
create policy "members can manage business documents" on public.business_documents for all to authenticated using (public.is_business_member(business_id)) with check (public.is_business_member(business_id));
create policy "users can manage notifications" on public.notifications for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "members can view audit logs" on public.audit_logs for select to authenticated using (actor_id = (select auth.uid()) or public.is_business_member(business_id));

alter table public.opportunities enable row level security;
create policy "published opportunities are public" on public.opportunities for select to anon, authenticated using (status in ('active', 'upcoming', 'closed', 'superseded', 'archived'));

alter table public.opportunity_versions enable row level security;
create policy "published opportunity versions are public" on public.opportunity_versions for select to anon, authenticated using (review_status = 'approved');

alter table public.opportunity_sources enable row level security;
create policy "published opportunity sources are public" on public.opportunity_sources for select to anon, authenticated using (exists (select 1 from public.opportunity_versions v where v.id = opportunity_version_id and v.review_status = 'approved'));
