-- Terminal authority assessments must point to the exact registered source row
-- whose URL and evidence anchor were reviewed. This keeps the reviewer API and
-- direct database writes behind the same provenance boundary.

alter table public.authority_coverage
  add column if not exists assessment_evidence_source_registry_id uuid
  references public.source_registry(id) on delete restrict;

update public.authority_coverage authority
set assessment_evidence_source_registry_id = source.id
from public.source_registry source
where authority.assessment_evidence_source_registry_id is null
  and authority.assessment_evidence_url = source.url;

update public.authority_coverage
set assessment_status = 'in_progress',
    assessed_at = null,
    assessed_by = null,
    assessment_note = coalesce(
      nullif(trim(assessment_note), ''),
      'Terminal authority decision needs an evidence URL registered in source_registry.'
    )
where assessment_status = 'assessed'
  and assessment_evidence_source_registry_id is null;

alter table public.authority_coverage
  drop constraint if exists authority_coverage_assessed_source_registry;

alter table public.authority_coverage
  add constraint authority_coverage_assessed_source_registry
  check (
    assessment_status <> 'assessed'
    or assessment_evidence_source_registry_id is not null
  );

create or replace function public.validate_authority_assessment_source()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  registered_url text;
begin
  if new.assessment_status = 'assessed' then
    if new.assessment_evidence_source_registry_id is null then
      raise exception 'Terminal authority assessments require a registered evidence source.';
    end if;

    select url
      into registered_url
      from public.source_registry
     where id = new.assessment_evidence_source_registry_id;

    if registered_url is null or registered_url <> new.assessment_evidence_url then
      raise exception 'Terminal authority evidence URL must exactly match the registered source URL.';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists authority_assessment_source_validation on public.authority_coverage;
create trigger authority_assessment_source_validation
  before insert or update on public.authority_coverage
  for each row execute function public.validate_authority_assessment_source();
