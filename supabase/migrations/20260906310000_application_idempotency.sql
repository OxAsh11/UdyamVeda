-- Prevent duplicate active application workspaces for the same business and opportunity.
-- Withdrawn applications remain historical and may be restarted later.
create unique index if not exists applications_active_opportunity_unique_idx
  on public.applications(business_id, opportunity_id)
  where opportunity_id is not null and status <> 'withdrawn';
