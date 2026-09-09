-- Track every opportunity found during an official-source crawl.
-- A discovery is not a published opportunity: it must be assessed, linked to
-- an approved record, or explicitly excluded with a reason.

create table if not exists public.catalog_discoveries (
  id uuid primary key default gen_random_uuid(),
  source_registry_id uuid not null references public.source_registry(id) on delete cascade,
  source_snapshot_id uuid references public.source_snapshots(id) on delete set null,
  name text not null,
  canonical_url text,
  opportunity_type text,
  lifecycle_status text not null default 'active' check (lifecycle_status in ('active', 'upcoming', 'closed', 'superseded', 'archived')),
  business_relevance text not null default 'pending' check (business_relevance in ('pending', 'relevant', 'not_relevant', 'unclear')),
  assessment_status text not null default 'not_assessed' check (assessment_status in ('not_assessed', 'assessed')),
  exclusion_reason text,
  linked_opportunity_id uuid references public.opportunities(id) on delete set null,
  assessed_by uuid references auth.users(id),
  assessed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (source_registry_id, name)
);

create index if not exists catalog_discoveries_status_idx
  on public.catalog_discoveries(lifecycle_status, assessment_status, business_relevance);

alter table public.catalog_discoveries enable row level security;

create policy "reviewers can manage catalog discoveries"
  on public.catalog_discoveries for all
  to authenticated
  using (public.is_catalog_reviewer((select auth.uid())))
  with check (public.is_catalog_reviewer((select auth.uid())));

drop trigger if exists catalog_discoveries_updated_at on public.catalog_discoveries;
create trigger catalog_discoveries_updated_at
  before update on public.catalog_discoveries
  for each row execute function public.set_updated_at();
