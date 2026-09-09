-- Public catalog visibility must follow publication approval, not only the
-- lifecycle label. This protects direct Supabase reads as well as the app DAL.

drop policy if exists "published opportunities are public" on public.opportunities;
create policy "published opportunities are public"
  on public.opportunities for select
  to anon, authenticated
  using (
    status in ('active', 'upcoming', 'closed', 'superseded', 'archived')
    and exists (
      select 1
      from public.opportunity_versions v
      where v.id = current_version_id
        and v.review_status = 'approved'
    )
  );

drop policy if exists "published authorities are public" on public.authorities;
create policy "published authorities are public"
  on public.authorities for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.opportunities o
      join public.opportunity_versions v on v.id = o.current_version_id
      where o.authority_id = authorities.id
        and o.status in ('active', 'upcoming', 'closed', 'superseded', 'archived')
        and v.review_status = 'approved'
    )
  );
