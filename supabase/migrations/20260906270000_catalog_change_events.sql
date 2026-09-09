-- Immutable source-change evidence for reviewer comparison and audit history.

create table if not exists public.change_events (
  id uuid primary key default gen_random_uuid(),
  source_registry_id uuid not null references public.source_registry(id) on delete cascade,
  source_snapshot_id uuid not null references public.source_snapshots(id) on delete cascade,
  previous_snapshot_id uuid references public.source_snapshots(id) on delete set null,
  event_type text not null check (event_type in ('initial', 'changed', 'unchanged')),
  previous_content_hash text,
  content_hash text not null,
  summary text not null,
  review_status text not null default 'open' check (review_status in ('open', 'reviewed', 'ignored')),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  unique (source_registry_id, content_hash, event_type)
);

create index if not exists change_events_review_idx
  on public.change_events(review_status, created_at desc);

alter table public.change_events enable row level security;

create policy "reviewers can manage change events"
  on public.change_events for all
  to authenticated
  using (public.is_catalog_reviewer((select auth.uid())))
  with check (public.is_catalog_reviewer((select auth.uid())));
