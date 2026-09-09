-- Harden cross-tenant lifecycle writes without rewriting the original migration.

drop policy if exists "members can create application status events" on public.application_status_events;
create policy "members can create application status events"
  on public.application_status_events
  for insert
  to authenticated
  with check (
    (actor_id is null or actor_id = (select auth.uid()))
    and exists (
      select 1
      from public.applications a
      where a.id = application_id
        and public.is_business_member(a.business_id)
    )
  );

drop policy if exists "members can manage application document links" on public.application_document_links;
create policy "members can manage application document links"
  on public.application_document_links
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.applications a
      join public.business_documents d on d.business_id = a.business_id
      where a.id = application_id
        and d.id = business_document_id
        and public.is_business_member(a.business_id)
    )
  )
  with check (
    exists (
      select 1
      from public.applications a
      join public.business_documents d on d.business_id = a.business_id
      where a.id = application_id
        and d.id = business_document_id
        and public.is_business_member(a.business_id)
    )
  );
