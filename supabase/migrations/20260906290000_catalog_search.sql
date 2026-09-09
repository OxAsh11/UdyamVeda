-- Search indexes for the initial catalog scale. No separate search vendor is needed.

create extension if not exists pg_trgm;

alter table public.opportunities
  add column if not exists search_text text generated always as (lower(coalesce(name, '') || ' ' || coalesce(slug, ''))) stored;

alter table public.opportunity_versions
  add column if not exists search_document tsvector generated always as (
    to_tsvector('simple'::regconfig, coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(objective, ''))
  ) stored;

alter table public.authorities
  add column if not exists search_text text generated always as (lower(coalesce(name, '') || ' ' || coalesce(ministry, '') || ' ' || coalesce(department, ''))) stored;

create index if not exists opportunities_search_trgm_idx on public.opportunities using gin (search_text gin_trgm_ops);
create index if not exists opportunity_versions_search_idx on public.opportunity_versions using gin (search_document);
create index if not exists authorities_search_trgm_idx on public.authorities using gin (search_text gin_trgm_ops);
