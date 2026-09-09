-- A staged extraction can be promoted into a version under review, but never
-- directly into a public opportunity.

alter table public.opportunity_drafts
  add column if not exists promoted_opportunity_id uuid references public.opportunities(id) on delete set null,
  add column if not exists promoted_version_id uuid references public.opportunity_versions(id) on delete set null;

alter table public.opportunity_drafts
  drop constraint if exists opportunity_drafts_status_check;

alter table public.opportunity_drafts
  add constraint opportunity_drafts_status_check
  check (status in ('draft', 'validated', 'needs_review', 'rejected', 'promoted'));

create index if not exists opportunity_drafts_promoted_idx
  on public.opportunity_drafts(promoted_opportunity_id, promoted_version_id);
