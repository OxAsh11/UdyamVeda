-- Current-source reconciliation for CGTMSE and PMMY.
-- Guarantee percentages and loan ceilings remain separate from any direct
-- benefit calculation and are always subject to lender/applicant conditions.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('CGTMSE credit facilities and parameters', 'https://www.cgtmse.in/Home/VS/96', 'agency_portal', 'central', 'weekly', 1, true, 'Current CGTMSE facility ceiling, hybrid-security and lender-fee guidance.'),
  ('CGTMSE annual guarantee fee', 'https://www.cgtmse.in/Home/VS/98', 'agency_portal', 'central', 'monthly', 1, true, 'Current Annual Guarantee Fee information; rates are not hardcoded into user eligibility without lender-level review.'),
  ('CGTMSE circulars and amendments', 'https://www.cgtmse.in/Circulars', 'agency_portal', 'central', 'weekly', 1, true, 'Current CGTMSE circular index for changes to coverage, products and special provisions.'),
  ('CGTMSE guarantee and claims guidance', 'https://www.cgtmse.in/Home/VS/99', 'agency_portal', 'central', 'monthly', 1, true, 'Current cover, invocation and claim boundary; lender claim process is not a borrower grant.')
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
  cgtmse_version_id uuid;
  pmmy_version_id uuid;
begin
  select current_version_id into cgtmse_version_id
  from public.opportunities
  where slug = 'credit-guarantee-scheme-cgtmse';

  select current_version_id into pmmy_version_id
  from public.opportunities
  where slug = 'pradhan-mantri-mudra-yojana';

  if cgtmse_version_id is not null then
    update public.opportunity_versions
    set
      fine_print = fine_print || jsonb_build_object(
        'current_source_reconciliation', 'Current CGTMSE facility parameters confirm the ₹10 crore covered-credit ceiling, coverage as a percentage of amount in default, hybrid security treatment, current category coverage and lender-paid Annual Guarantee Fee boundary.',
        'current_source_checked_at', '2026-09-07'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = cgtmse_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select cgtmse_version_id, source_url, 'agency', source_title, source_anchor, now(), false
    from (values
      ('https://www.cgtmse.in/Home/VS/96', 'CGTMSE credit facilities and parameters', '₹10 crore covered-credit ceiling; hybrid security; lender fee guidance'),
      ('https://www.cgtmse.in/Home/VS/98', 'CGTMSE annual guarantee fee', 'Annual Guarantee Fee and current fee schedule route'),
      ('https://www.cgtmse.in/Circulars', 'CGTMSE circulars and amendments', 'Current 2025-26 circulars and product amendments'),
      ('https://www.cgtmse.in/Home/VS/99', 'CGTMSE guarantee and claims guidance', 'Coverage as percentage of amount in default; invocation and claim boundary')
    ) as evidence(source_url, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = cgtmse_version_id and source_url = evidence.source_url
    );
  end if;

  if pmmy_version_id is not null then
    update public.opportunity_versions
    set
      fine_print = fine_print || jsonb_build_object(
        'current_source_reconciliation', 'The current Department of Financial Services PMMY page, last updated 5 February 2026, confirms the Shishu/Kishor/Tarun/Tarun Plus bands, collateral-free lender route and prior Tarun repayment condition for Tarun Plus.',
        'current_source_checked_at', '2026-09-07'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = pmmy_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select pmmy_version_id, 'https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy', 'ministry', 'Department of Financial Services PMMY page', 'Last updated 5 February 2026; current categories and member-lending-institution route', now(), false
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = pmmy_version_id
        and source_url = 'https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy'
    );
  end if;
end $$;
