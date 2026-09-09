-- Preserve how and where a source snapshot was captured without weakening the
-- review gate. Existing rows are explicitly marked unknown; new ingestion
-- runs must record the capture method and resolved source metadata.

alter table public.source_snapshots
  add column if not exists capture_method text not null default 'unknown';

alter table public.source_snapshots
  drop constraint if exists source_snapshots_capture_method_check;

alter table public.source_snapshots
  add constraint source_snapshots_capture_method_check
  check (capture_method in ('firecrawl_markdown', 'http_html_fallback', 'manual_official_pdf_text', 'unknown'));

alter table public.source_snapshots
  add column if not exists final_url text,
  add column if not exists response_status smallint,
  add column if not exists response_content_type text;

alter table public.source_snapshots
  drop constraint if exists source_snapshots_response_status_check;

alter table public.source_snapshots
  add constraint source_snapshots_response_status_check
  check (response_status is null or response_status between 100 and 599);

create or replace function public.protect_source_snapshot_evidence()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    raise exception 'Source snapshots are immutable and cannot be deleted';
  end if;

  if new.id is distinct from old.id
    or new.source_registry_id is distinct from old.source_registry_id
    or new.content_hash is distinct from old.content_hash
    or new.content_type is distinct from old.content_type
    or new.capture_method is distinct from old.capture_method
    or new.final_url is distinct from old.final_url
    or new.response_status is distinct from old.response_status
    or new.response_content_type is distinct from old.response_content_type
    or new.body_markdown is distinct from old.body_markdown
    or new.created_at is distinct from old.created_at
  then
    raise exception 'Source snapshot evidence is immutable';
  end if;

  return new;
end;
$$;

drop trigger if exists source_snapshots_immutable_evidence on public.source_snapshots;
create trigger source_snapshots_immutable_evidence
before update or delete on public.source_snapshots
for each row execute function public.protect_source_snapshot_evidence();
