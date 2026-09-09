-- Tie publication provenance to the central source registry. The URL audit is
-- useful for seed files, but the database should retain the relationship that
-- powers cadence, refresh, and change tracking after records are promoted.
alter table public.opportunity_sources
  add column if not exists source_registry_id uuid references public.source_registry(id) on delete set null;

create index if not exists opportunity_sources_registry_idx
  on public.opportunity_sources(source_registry_id);

create or replace function public.link_opportunity_source_registry()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.source_registry_id is null then
    select id into new.source_registry_id
    from public.source_registry
    where rtrim(url, '/') = rtrim(new.source_url, '/')
    limit 1;
  end if;
  return new;
end;
$$;

drop trigger if exists opportunity_sources_registry_link on public.opportunity_sources;
create trigger opportunity_sources_registry_link
  before insert or update of source_url, source_registry_id on public.opportunity_sources
  for each row execute function public.link_opportunity_source_registry();

update public.opportunity_sources source
set source_registry_id = registry.id
from public.source_registry registry
where source.source_registry_id is null
  and rtrim(source.source_url, '/') = rtrim(registry.url, '/');
