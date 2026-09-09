-- Persist the authority mapping decision for every seeded opportunity.
-- The generated crosswalk remains a deterministic work queue; this table is
-- the reviewer-owned evidence that can eventually satisfy the beta gate.

create table if not exists public.opportunity_authority_reviews (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  authority_coverage_id uuid references public.authority_coverage(id) on delete restrict,
  decision text not null default 'pending' check (decision in ('pending', 'confirmed', 'excluded')),
  mapping_kind text not null default 'unresolved' check (mapping_kind in ('exact_authority_portal', 'same_authority_host', 'source_host_evidence_only', 'manual', 'explicit_exclusion', 'unresolved')),
  evidence_url text,
  evidence_anchor text,
  reviewer_note text,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (opportunity_id),
  check (
    decision = 'pending'
    or (
      decision = 'confirmed'
      and authority_coverage_id is not null
      and evidence_url ~* '^https://'
      and nullif(trim(evidence_anchor), '') is not null
      and reviewed_by is not null
      and reviewed_at is not null
    )
    or (
      decision = 'excluded'
      and nullif(trim(reviewer_note), '') is not null
      and reviewed_by is not null
      and reviewed_at is not null
    )
  )
);

create index if not exists opportunity_authority_reviews_decision_idx
  on public.opportunity_authority_reviews(decision, mapping_kind);

alter table public.opportunity_authority_reviews enable row level security;

create policy "reviewers can manage opportunity authority reviews"
  on public.opportunity_authority_reviews for all to authenticated
  using (public.is_catalog_reviewer(auth.uid()))
  with check (public.is_catalog_reviewer(auth.uid()) and (reviewed_by is null or reviewed_by = auth.uid()));

drop trigger if exists opportunity_authority_reviews_updated_at on public.opportunity_authority_reviews;
create trigger opportunity_authority_reviews_updated_at
  before update on public.opportunity_authority_reviews
  for each row execute function public.set_updated_at();
