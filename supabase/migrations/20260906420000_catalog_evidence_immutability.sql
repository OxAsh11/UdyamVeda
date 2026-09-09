-- Keep crawled source evidence and change history append-only.
-- Reviewers may dispose or annotate records, but cannot rewrite the evidence
-- that a later audit relies on.

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

create or replace function public.protect_change_event_evidence()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    raise exception 'Source change events are immutable and cannot be deleted';
  end if;

  if new.id is distinct from old.id
    or new.source_registry_id is distinct from old.source_registry_id
    or new.source_snapshot_id is distinct from old.source_snapshot_id
    or new.previous_snapshot_id is distinct from old.previous_snapshot_id
    or new.event_type is distinct from old.event_type
    or new.previous_content_hash is distinct from old.previous_content_hash
    or new.content_hash is distinct from old.content_hash
    or new.summary is distinct from old.summary
    or new.created_at is distinct from old.created_at
  then
    raise exception 'Source change evidence is immutable';
  end if;

  return new;
end;
$$;

drop trigger if exists change_events_immutable_evidence on public.change_events;
create trigger change_events_immutable_evidence
before update or delete on public.change_events
for each row execute function public.protect_change_event_evidence();
