-- Current PM Vishwakarma reconciliation. Keep staged benefits, portal facts,
-- verification and sensitive-document boundaries explicit and review-gated.

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
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_portal_checked_at', '2026-09-08',
        'official_handoff_boundary', 'Applicant must use the official portal/CSC/department route and their own mobile, identity and banking details; UdyamVeda prepares and explains but does not submit or handle OTPs.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_source_reconciliation', 'The PM Vishwakarma portal, FAQ, registration guide, terms and guideline were rechecked on 8 September 2026. Portal facts and targets remain separate from the governing guideline and staged verification.',
        'benefit_buckets_separate', true,
        'registration_not_benefit_approval', true,
        'portal_registration_target', 'through 2028',
        'target_requires_guideline_reconciliation', true,
        'sensitive_document_minimization_required', true,
        'current_route_checked_at', '2026-09-08'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = vishwakarma_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select vishwakarma_version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://pmvishwakarma.gov.in/Home/', 'agency', 'PM Vishwakarma official portal', '18 trades, beneficiary components and registration indicator'),
      ('https://pmvishwakarma.gov.in/Home/FAQ', 'agency', 'PM Vishwakarma official FAQ', 'Eligibility, documents, training, toolkit, credit, digital incentive and support route'),
      ('https://pmvishwakarma.gov.in/Home/HowToRegister', 'agency', 'PM Vishwakarma official registration guide', 'Registration and multi-stage verification route'),
      ('https://pmvishwakarma.gov.in/Home/TermsandConditions', 'agency', 'PM Vishwakarma official terms and conditions', 'Portal terms and current operating boundary'),
      ('https://pmvishwakarma.gov.in/cdn/MiscFiles/eng_v30.0_PM_Vishwakarma_Guidelines_final.pdf', 'guideline', 'PM Vishwakarma scheme guidelines', 'Trade, eligibility, staged benefits, verification and implementation terms')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = vishwakarma_version_id and source_url = evidence.source_url
    );
  end if;
end $$;
