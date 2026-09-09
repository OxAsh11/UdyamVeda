-- Current-source reconciliation for MCA SPICe+ incorporation.
-- This records preparation facts while keeping the applicant-controlled filing
-- and current-form review boundary explicit.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('MCA SPICe+ current instruction kit', 'https://www.mca.gov.in/Ministry/pdf/SPICe%2B_help.pdf', 'guideline', 'central', 'monthly', 1, true, 'Current official instruction kit for SPICe+ Part A and Part B; form version and linked-service changes require review.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;

do $$
declare
  version_id uuid;
begin
  select current_version_id into version_id
  from public.opportunities
  where slug = 'company-incorporation-spice-plus';

  if version_id is null then
    return;
  end if;

  update public.opportunity_versions
  set
    fine_print = fine_print || jsonb_build_object(
      'current_source_reconciliation', 'The current official MCA instruction kit and FAQ support the Part A/Part B split, V3 portal boundary and linked-service cautions for AGILE-PRO-S, EPFO, ESIC, bank-account opening, GSTIN, professional tax and Delhi Shops and Establishment registration.',
      'current_source_checked_at', '2026-09-07',
      'review_status_note', 'Current form version, fees, state stamp duty, exact document checklist and live V3 portal behavior remain reviewer-controlled.'
    ),
    last_verified_at = now(),
    review_status = 'in_review'
  where id = version_id;

  insert into public.opportunity_sources
    (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
  select
    version_id,
    'https://www.mca.gov.in/Ministry/pdf/SPICe%2B_help.pdf',
    'guideline',
    'Instruction Kit for SPICe+ (INC-32)',
    'Part A name reservation; Part B incorporation details; current V3 form instructions',
    now(),
    false
  where not exists (
    select 1 from public.opportunity_sources
    where opportunity_version_id = version_id
      and source_url = 'https://www.mca.gov.in/Ministry/pdf/SPICe%2B_help.pdf'
  );
end $$;
