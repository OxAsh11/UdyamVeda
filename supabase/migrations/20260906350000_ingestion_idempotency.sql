-- Make source refresh retries safe to replay. Older rows have null hashes and
-- remain valid; all new runs and extracted drafts receive deterministic keys.
alter table public.ingestion_runs
  add column if not exists content_hash text;

create unique index if not exists ingestion_runs_source_hash_idx
  on public.ingestion_runs(source_id, content_hash)
  where content_hash is not null;

alter table public.opportunity_drafts
  add column if not exists payload_hash text;

create unique index if not exists opportunity_drafts_snapshot_hash_idx
  on public.opportunity_drafts(source_snapshot_id, payload_hash)
  where payload_hash is not null;
