-- Private, business-scoped document storage foundation.
-- Files remain unavailable to users until an external scanner marks the metadata row clean.

alter table public.business_documents
  add column if not exists scan_status text not null default 'pending'
    check (scan_status in ('pending', 'clean', 'rejected', 'failed'));
alter table public.business_documents
  add column if not exists scan_provider text;
alter table public.business_documents
  add column if not exists scanned_at timestamptz;
alter table public.business_documents
  add column if not exists scan_error text;

create index if not exists documents_business_scan_idx
  on public.business_documents(business_id, scan_status, deleted_at);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'business-documents',
  'business-documents',
  false,
  10485760,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'text/csv',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]::text[]
)
on conflict (id) do update set
  name = excluded.name,
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "business members can read document objects" on storage.objects;
create policy "business members can read document objects"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'business-documents'
    and exists (
      select 1 from public.business_memberships membership
      where membership.business_id::text = (storage.foldername(name))[1]
        and membership.user_id = (select auth.uid())
    )
  );

drop policy if exists "business members can upload document objects" on storage.objects;
create policy "business members can upload document objects"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'business-documents'
    and exists (
      select 1 from public.business_memberships membership
      where membership.business_id::text = (storage.foldername(name))[1]
        and membership.user_id = (select auth.uid())
    )
  );

drop policy if exists "business members can update document objects" on storage.objects;
create policy "business members can update document objects"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'business-documents'
    and exists (
      select 1 from public.business_memberships membership
      where membership.business_id::text = (storage.foldername(name))[1]
        and membership.user_id = (select auth.uid())
    )
  )
  with check (
    bucket_id = 'business-documents'
    and exists (
      select 1 from public.business_memberships membership
      where membership.business_id::text = (storage.foldername(name))[1]
        and membership.user_id = (select auth.uid())
    )
  );

drop policy if exists "business members can delete document objects" on storage.objects;
create policy "business members can delete document objects"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'business-documents'
    and exists (
      select 1 from public.business_memberships membership
      where membership.business_id::text = (storage.foldername(name))[1]
        and membership.user_id = (select auth.uid())
    )
  );

drop policy if exists "members can create audit logs" on public.audit_logs;
create policy "members can create audit logs"
  on public.audit_logs for insert to authenticated
  with check (
    actor_id = (select auth.uid())
    and (business_id is null or public.is_business_member(business_id))
  );
