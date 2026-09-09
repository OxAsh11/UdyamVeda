-- Staging layer between crawled official content and publishable opportunity versions.
-- AI extraction and deterministic validation may create drafts here; publication
-- still requires the existing human review workflow.

create table if not exists public.source_snapshots (
  id uuid primary key default gen_random_uuid(),
  source_registry_id uuid not null references public.source_registry(id) on delete cascade,
  ingestion_run_id uuid references public.ingestion_runs(id) on delete set null,
  content_hash text not null,
  content_type text not null default 'text/markdown',
  body_markdown text not null,
  extracted_payload jsonb not null default '{}'::jsonb,
  status text not null default 'fetched' check (status in ('fetched', 'unchanged', 'extracted', 'needs_review', 'failed')),
  error text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (source_registry_id, content_hash)
);

create index if not exists source_snapshots_source_idx
  on public.source_snapshots(source_registry_id, created_at desc);

create table if not exists public.opportunity_drafts (
  id uuid primary key default gen_random_uuid(),
  source_snapshot_id uuid not null references public.source_snapshots(id) on delete cascade,
  ingestion_run_id uuid references public.ingestion_runs(id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  completeness numeric(5, 4) not null default 0,
  validation_errors jsonb not null default '[]'::jsonb,
  validation_warnings jsonb not null default '[]'::jsonb,
  extraction_model text,
  status text not null default 'draft' check (status in ('draft', 'validated', 'needs_review', 'rejected')),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists opportunity_drafts_status_idx
  on public.opportunity_drafts(status, created_at desc);

alter table public.source_snapshots enable row level security;
alter table public.opportunity_drafts enable row level security;

create policy "reviewers can manage source snapshots"
  on public.source_snapshots for all
  to authenticated
  using (public.is_catalog_reviewer((select auth.uid())))
  with check (public.is_catalog_reviewer((select auth.uid())));

create policy "reviewers can manage opportunity drafts"
  on public.opportunity_drafts for all
  to authenticated
  using (public.is_catalog_reviewer((select auth.uid())))
  with check (public.is_catalog_reviewer((select auth.uid())));
