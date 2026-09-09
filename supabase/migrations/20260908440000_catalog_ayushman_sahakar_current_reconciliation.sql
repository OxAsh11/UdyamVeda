-- Current Ayushman Sahakar reconciliation. Preserve cooperative/project-finance
-- boundaries and keep sanction, subsidy and permission terms review-gated.

do $$
declare
  ayushman_version_id uuid;
begin
  select current_version_id into ayushman_version_id
  from public.opportunities
  where slug = 'ayushman-sahakar-cooperative-healthcare-support';

  if ayushman_version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_scheme_route', 'https://www.ncdc.in/index.jsp?page=scheme',
        'current_common_application_route', 'https://ncdc.in/index.jsp?page=common-application%3Den',
        'current_route_checked_at', '2026-09-08',
        'official_handoff_boundary', 'Select the activity/purpose and loan type through the official NCDC route; UdyamVeda prepares and explains but does not submit or guarantee sanction.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_source_reconciliation', 'The Ayushman Sahakar document, NCDC compendium, current scheme index, common application route and FAQ were checked on 8 September 2026.',
        'cooperative_project_finance', true,
        'direct_infrastructure_loan_max_percent', 70,
        'direct_society_share_min_percent', 30,
        'state_route_ncdc_loan_max_percent', 90,
        'loan_period_years', 8,
        'principal_moratorium_years', jsonb_build_object('minimum', 1, 'maximum', 2),
        'women_majority_term_loan_incentive_percent', 1,
        'interest_incentive_condition', 'Women members in majority and timely repayments, subject to current NCDC circulars.',
        'security_required', true,
        'subsidy_convergence_not_guaranteed', true,
        'current_route_checked_at', '2026-09-08'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = ayushman_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select ayushman_version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://www.ncdc.in/index.jsp?page=scheme', 'agency', 'NCDC current scheme index', 'Hospital, healthcare and education financial-assistance guideline and scheme navigation'),
      ('https://ncdc.in/index.jsp?page=common-application%3Den', 'application_portal', 'NCDC common loan application', 'Activity/purpose and loan-type selection for applicable form'),
      ('https://www.ncdc.in/index.jsp?page=faq%3Dhi', 'agency', 'NCDC application FAQ', 'State Government/direct application channel context'),
      ('https://ncdc.in/documents/other/Ayushman-sahakar20102020.pdf', 'guideline', 'Ayushman Sahakar scheme document', 'Eligibility, loan period, interest, security and funding pattern'),
      ('https://www.ncdc.in/documents/booklet/2609240524English-Compendium-as-on-22.05.2024.pdf', 'guideline', 'NCDC scheme compendium', 'Eligibility, loan period, moratorium, interest incentive and funding pattern')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = ayushman_version_id and source_url = evidence.source_url
    );
  end if;
end $$;
