-- Paused opportunities (no open call right now, programme still exists) stay
-- publicly visible with a "Paused" label instead of disappearing.
drop policy if exists "published opportunities are public" on public.opportunities;
create policy "published opportunities are public"
  on public.opportunities for select
  to anon, authenticated
  using (
    status in ('active', 'upcoming', 'paused', 'closed', 'superseded', 'archived')
    and exists (
      select 1
      from public.opportunity_versions v
      where v.id = current_version_id
        and v.review_status = 'approved'
    )
  );
