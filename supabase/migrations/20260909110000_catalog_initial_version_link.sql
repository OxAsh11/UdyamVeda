-- Attach only the first version when a catalog record has no current pointer.
-- Corrections never replace an existing current or approved version here.
update public.opportunities o
set current_version_id = v.id
from public.opportunity_versions v
where v.opportunity_id = o.id and o.current_version_id is null
  and not exists (
    select 1 from public.opportunity_versions other
    where other.opportunity_id = o.id and other.id <> v.id
  );

create or replace function public.link_initial_catalog_version()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.opportunities
  set current_version_id = new.id
  where id = new.opportunity_id and current_version_id is null;
  return new;
end $$;

create trigger opportunity_versions_link_initial
after insert on public.opportunity_versions
for each row execute function public.link_initial_catalog_version();
