-- Reviewer-only decisions for failed primary source captures.
-- An accepted alternate remains supporting evidence; it never replaces the
-- primary source or publishes an opportunity automatically.

create table if not exists public.source_resolution_reviews (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  primary_source_url text not null,
  alternate_source_registry_id uuid references public.source_registry(id) on delete set null,
  alternate_source_url text not null,
  alternate_snapshot_hash text,
  decision text not null check (decision in ('accepted_as_supporting', 'rejected', 'needs_new_capture', 'primary_retry_required')),
  evidence_anchor text,
  reviewer_note text not null,
  reviewed_by uuid not null references auth.users(id),
  reviewed_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (opportunity_id, primary_source_url, alternate_source_url),
  check (length(trim(primary_source_url)) > 0),
  check (length(trim(alternate_source_url)) > 0),
  check (length(trim(reviewer_note)) > 0),
  check (decision <> 'accepted_as_supporting' or (alternate_source_registry_id is not null and evidence_anchor is not null and length(trim(evidence_anchor)) > 0))
);

create index if not exists source_resolution_reviews_opportunity_idx
  on public.source_resolution_reviews(opportunity_id, reviewed_at desc);

create index if not exists source_resolution_reviews_decision_idx
  on public.source_resolution_reviews(decision, reviewed_at desc);

alter table public.source_resolution_reviews enable row level security;

create policy "reviewers can manage source resolution reviews"
  on public.source_resolution_reviews for all
  to authenticated
  using (public.is_catalog_reviewer((select auth.uid())))
  with check (
    public.is_catalog_reviewer((select auth.uid()))
    and reviewed_by = (select auth.uid())
  );

create or replace function public.touch_source_resolution_review_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists source_resolution_reviews_updated_at on public.source_resolution_reviews;
create trigger source_resolution_reviews_updated_at
before update on public.source_resolution_reviews
for each row execute function public.touch_source_resolution_review_updated_at();
