-- Current WEP reconciliation for controlled Batch 089 review.
-- WEP is a discovery/ecosystem platform. Underlying schemes and partner
-- offerings remain separate records with their own authority and terms.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('WEP access-to-finance current page', 'https://wep.gov.in/access-finance/about-us', 'agency_portal', 'central', 'monthly', 1, true, 'Current WEP access-to-finance categories and partner/resource content; underlying scheme authorities remain controlling.'),
  ('WEP individual mentorship current page', 'https://wep.gov.in/mentor-individual-landing', 'agency_portal', 'central', 'monthly', 1, true, 'Current WEP mentee/mentor route, Smart Match fields, consent and no-sensitive-information boundary.'),
  ('WEP individual mentorship guidelines', 'https://wep.gov.in/individual-mentorship-guidelines-and-code-of-conduct', 'guideline', 'central', 'monthly', 1, true, 'Current WEP pro-bono mentor, conduct and service-boundary guidance.'),
  ('WEP/CII-Yi current disclaimer', 'https://wep.gov.in/ciiyi-disclaimer', 'disclaimer', 'central', 'monthly', 1, true, 'Current WEP/CII-Yi disclaimer requiring verification with the respective authorities and distinguishing external content.'),
  ('NITI Aayog Annual Report 2022-23 WEP description', 'https://niti.gov.in/sites/default/files/2023-02/Annual-Report-2022-2023-English_06022023_compressed.pdf?trk=public_post_comment-text', 'ministry_portal', 'central', 'annual', 1, true, 'Official NITI Aayog description of WEP as a unified-access aggregator and knowledge hub.')
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
  where slug = 'women-entrepreneurship-platform-wep';

  if version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_source_checked_at', '2026-09-08',
        'current_wEP_route', 'https://wep.gov.in/knowledge-portal',
        'current_mentorship_route', 'https://wep.gov.in/mentor-individual-landing',
        'current_route_boundary', 'WEP provides discovery, matching and ecosystem services. The underlying Government scheme or partner route controls its own application, eligibility, fees and outcome.',
        'current_submission_boundary', 'UdyamVeda may explain WEP categories and prepare questions, but cannot guarantee matching, mentor acceptance, funding, partner service or Government approval.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_wep_reconciliation', jsonb_build_object(
          'observed_at', '2026-09-08',
          'platform_role', 'discovery_matching_and_ecosystem_support',
          'underlying_authority_controls', true,
          'current_categories', jsonb_build_array('funding', 'incubation_and_acceleration', 'mentoring_and_networking', 'market_linkages', 'business_development_services', 'schemes', 'publications', 'videos'),
          'mentorship_boundary', 'Current WEP mentorship welcomes women entrepreneurs and women-led collective enterprises; Smart Match uses stage, industry, location, language, ecosystem need and engagement mode. A match is not acceptance.',
          'service_boundary', 'Individual mentorship is described as free/pro-bono, mentees contact mentors first, and sensitive personal information should not be shared with mentors.',
          'content_boundary', 'WEP/CII-Yi disclaimer states that external content may not be complete or accurate and users should verify details with the respective authorities.',
          'partner_boundary', 'Partner and financial-institution listings require separate terms, authority classification, fees and due diligence.',
          'review_boundary', 'Confirm WEP/NITI Aayog authority mapping, registration and consent behavior, privacy/data controls, current availability and underlying-source verification before publication.'
        ),
        'current_source_reconciliation', 'Current WEP discovery, finance, mentorship, guidelines and disclaimer pages plus NITI Aayog context were checked on 8 September 2026. The record remains in_review and non_financial.'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://wep.gov.in/access-finance/about-us', 'agency_portal', 'WEP access-to-finance current page', 'Current Government-scheme, financial-institution, State-scheme and knowledge-bank categories'),
      ('https://wep.gov.in/mentor-individual-landing', 'agency_portal', 'WEP individual mentorship current page', 'Mentee/mentor route, Smart Match fields, consent and no-sensitive-information boundary'),
      ('https://wep.gov.in/individual-mentorship-guidelines-and-code-of-conduct', 'guideline', 'WEP individual mentorship guidelines', 'Pro-bono mentor and conduct conditions'),
      ('https://wep.gov.in/ciiyi-disclaimer', 'disclaimer', 'WEP/CII-Yi current disclaimer', 'External-content and authority-verification disclaimer'),
      ('https://niti.gov.in/sites/default/files/2023-02/Annual-Report-2022-2023-English_06022023_compressed.pdf?trk=public_post_comment-text', 'ministry_portal', 'NITI Aayog Annual Report 2022-23 WEP description', 'WEP unified-access aggregator and knowledge hub')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources os
      where os.opportunity_version_id = version_id
        and os.source_url = evidence.source_url
    );
  end if;
end $$;
