-- Current PM Vishwakarma portal and beneficiary-level evidence.
-- The record remains review-gated; current portal facts are not automatic approval.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('PM Vishwakarma official FAQ', 'https://pmvishwakarma.gov.in/Home/FAQ', 'implementing_portal', 'central', 'weekly', 1, true, 'Official current FAQ for eligibility, documents, component conditions and support routes.'),
  ('PM Vishwakarma official registration guide', 'https://pmvishwakarma.gov.in/Home/HowToRegister', 'implementing_portal', 'central', 'weekly', 1, true, 'Official registration and verification route.'),
  ('PM Vishwakarma official terms and conditions', 'https://pmvishwakarma.gov.in/Home/TermsandConditions', 'implementing_portal', 'central', 'monthly', 1, true, 'Official portal terms and current operating boundary.')
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
  vishwakarma_version_id uuid;
begin
  select current_version_id into vishwakarma_version_id
  from public.opportunities
  where slug = 'pm-vishwakarma';

  if vishwakarma_version_id is not null then
    update public.opportunity_versions
    set
      eligibility = coalesce(eligibility, '{}'::jsonb) || jsonb_build_object(
        'current_portal_conditions', jsonb_build_array(
          'Applicant must be engaged in the concerned trade on the registration date.',
          'Similar Central or State self-employment/business loans in the past five years can block eligibility.',
          'Only one member of a family may register.',
          'Government employees and their family members are not eligible.'
        )
      ),
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'portal', 'https://pmvishwakarma.gov.in/Home/',
        'registration_guide', 'https://pmvishwakarma.gov.in/Home/HowToRegister',
        'verification', 'Multi-stage local and committee verification is required before benefits are released.',
        'documents', jsonb_build_array('Aadhaar', 'mobile number', 'bank details', 'ration card or Aadhaar details for all family members if no ration card'),
        'support_routes', jsonb_build_array('Common Service Centre', 'MSME Development and Facilitation Office', 'District Industries Centre'),
        'current_portal_checked_at', '2026-09-07'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'implementation_period', 'The current official portal shows a registration target through 2028; the governing guideline version and any extension basis require reviewer confirmation.',
        'toolkit_condition', 'Toolkit incentive is provided after skill verification at the start of Basic Training.',
        'second_tranche_condition', 'Second tranche is available to skilled beneficiaries who maintain a standard loan account and have adopted digital transactions or undergone Advanced Skill Training.',
        'digital_transaction_incentive', jsonb_build_object('amount_inr_per_transaction', 1, 'eligible_transaction_cap_per_month', 100),
        'guarantee_fee', 'Government of India bears the guarantee fee.',
        'prepayment_penalty', 'No prepayment penalty after six months of loan disbursement.',
        'current_portal_facts', jsonb_build_object(
          'portal_checked', '2026-09-07',
          'registration_target', 'through 2028',
          'benefit_release_boundary', 'Registration alone does not release benefits; prescribed verification and component conditions apply.'
        ),
        'current_source_reconciliation', 'The current portal FAQ and registration pages provide operational conditions and document guidance that must be reconciled with the guideline version before publication.'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = vishwakarma_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select vishwakarma_version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://pmvishwakarma.gov.in/Home/FAQ', 'agency', 'PM Vishwakarma official FAQ', 'Eligibility, documents, training, toolkit, credit, digital incentive and support route'),
      ('https://pmvishwakarma.gov.in/Home/HowToRegister', 'agency', 'PM Vishwakarma official registration guide', 'Registration and verification route'),
      ('https://pmvishwakarma.gov.in/Home/TermsandConditions', 'agency', 'PM Vishwakarma official terms and conditions', 'Portal terms and current operating boundary')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = vishwakarma_version_id and source_url = evidence.source_url
    );

    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select vishwakarma_version_id, 'document', 'Current PM Vishwakarma registration document pack', 'Aadhaar, mobile number, bank details and ration card, or Aadhaar details for all family members if no ration card; final requirements must be confirmed at the live portal/CSC route.', true
    where not exists (
      select 1 from public.opportunity_requirements
      where opportunity_version_id = vishwakarma_version_id and name = 'Current PM Vishwakarma registration document pack'
    );
  end if;
end $$;
