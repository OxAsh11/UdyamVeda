-- Official scheme lifecycle is not editorial publication approval.
alter table public.opportunities add column if not exists reported_lifecycle_status text;

update public.opportunities o
set reported_lifecycle_status = o.status, status = 'in_review'
where o.status in ('active', 'upcoming', 'paused', 'closed', 'superseded', 'archived')
  and not exists (
    select 1 from public.opportunity_versions v
    where v.id = o.current_version_id and v.review_status = 'approved'
  );

create or replace function public.keep_unreviewed_catalog_private()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status in ('active', 'upcoming', 'paused', 'closed', 'superseded', 'archived') then
    new.reported_lifecycle_status := new.status;
    if not exists (
      select 1 from public.opportunity_versions v
      where v.id = new.current_version_id and v.review_status = 'approved'
    ) then
      new.status := 'in_review';
    end if;
  end if;
  return new;
end $$;

create trigger opportunities_separate_review_from_lifecycle
before insert or update of status, current_version_id on public.opportunities
for each row execute function public.keep_unreviewed_catalog_private();
