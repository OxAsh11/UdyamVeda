-- Current Dairy Sahakar reconciliation. Preserve cooperative/project-finance,
-- corpus-versus-entitlement and route-specific funding boundaries.

do $$
declare
  dairy_version_id uuid;
begin
  select current_version_id into dairy_version_id
  from public.opportunities
  where slug = 'dairy-sahakar-cooperative-dairy-business-support';

  if dairy_version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_scheme_route', 'https://www.ncdc.in/index.jsp?page=dairy',
        'current_common_application_route', 'https://www.ncdc.in/index.jsp?page=common-application',
        'current_route_checked_at', '2026-09-08',
        'official_handoff_boundary', 'Select the activity/purpose and loan type through the official NCDC route; UdyamVeda prepares and explains but does not submit or guarantee sanction.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_source_reconciliation', 'The Dairy Sahakar brochure, NCDC pattern-of-assistance document, NCDC compendium, current dairy portal, common application route and launch notice were checked on 8 September 2026.',
        'cooperative_project_finance', true,
        'project_assistance_fixed_minimum_or_maximum', false,
        'direct_infrastructure_loan_max_percent', 70,
        'direct_society_share_min_percent', 30,
        'state_route_ncdc_loan_max_percent', 90,
        'state_route_society_share_min_percent', 10,
        'loan_period_years', jsonb_build_object('minimum', 5, 'maximum', 8),
        'principal_moratorium_years', jsonb_build_object('minimum', 1, 'maximum', 3),
        'scheme_level_launch_earmark_inr', 50000000000,
        'scheme_level_launch_earmark_is_not_applicant_entitlement', true,
        'security_required', true,
        'subsidy_convergence_not_guaranteed', true,
        'margin_money_and_working_capital_assessment_dependent', true,
        'current_route_checked_at', '2026-09-08'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = dairy_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select dairy_version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://www.ncdc.in/index.jsp?page=dairy', 'agency', 'NCDC current dairy and livestock route', 'Current dairy financing and common loan application navigation'),
      ('https://www.ncdc.in/index.jsp?page=common-application', 'application_portal', 'NCDC common loan application', 'Activity/purpose and loan-type selection for applicable form'),
      ('https://www.ncdc.in/documents/faq/2010210223Pattern-of-Assistance-2021-22.pdf', 'guideline', 'NCDC pattern of assistance', 'Dairy Sahakar scope, project cost, loan period, moratorium and current-term caveats'),
      ('https://www.ncdc.in/documents/booklet/2609240524English-Compendium-as-on-22.05.2024.pdf', 'guideline', 'NCDC scheme compendium', 'Dairy Sahakar activities, eligibility, loan period, security, subsidy and funding pattern'),
      ('https://www.ncdc.in/documents/whats-new/3716081121LAUNCH-OF-DAIRY-SAHAKAR.pdf', 'announcement', 'Dairy Sahakar launch notice', '2021 launch-level Rs 5,000 crore earmark; not an applicant entitlement')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = dairy_version_id and source_url = evidence.source_url
    );
  end if;
end $$;
