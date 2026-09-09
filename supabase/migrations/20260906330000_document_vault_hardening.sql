-- User sessions may create metadata and soft-delete documents, but cannot forge
-- scanner-controlled fields or move a stored object across paths.
create or replace function public.protect_business_document_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    if tg_op = 'INSERT' then
      new.created_by = (select auth.uid());
      new.scan_status = 'pending';
      new.scan_provider = null;
      new.scanned_at = null;
      new.scan_error = null;
    else
      new.business_id = old.business_id;
      new.storage_path = old.storage_path;
      new.file_name = old.file_name;
      new.mime_type = old.mime_type;
      new.size_bytes = old.size_bytes;
      new.checksum = old.checksum;
      new.sensitivity = old.sensitivity;
      new.created_by = old.created_by;
      new.scan_status = old.scan_status;
      new.scan_provider = old.scan_provider;
      new.scanned_at = old.scanned_at;
      new.scan_error = old.scan_error;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_business_document_fields on public.business_documents;
create trigger protect_business_document_fields
  before insert or update on public.business_documents
  for each row execute function public.protect_business_document_fields();

drop policy if exists "business members can update document objects" on storage.objects;
