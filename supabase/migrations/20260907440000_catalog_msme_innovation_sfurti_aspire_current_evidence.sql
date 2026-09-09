-- Current official evidence for MSME Innovative, SFURTI and ASPIRE.
-- These records remain review-gated; portal availability does not remove the
-- need to verify component eligibility, current notices and application terms.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('MSME Innovative Idea Hackathon 6.0', 'https://innovative.msme.gov.in/Home/', 'ministry_portal', 'central', 'weekly', 2, true, 'Official portal with current Idea Hackathon 6.0 and host-institute instructions.'),
  ('MSME Innovative current design page', 'https://innovative.msme.gov.in/Home/Index', 'ministry_portal', 'central', 'weekly', 2, true, 'Official current design-component page; assistance and Udyam requirement require review.'),
  ('MSME Innovative current IPR page', 'https://innovative.msme.gov.in/Home/IprIndex', 'ministry_portal', 'central', 'monthly', 2, true, 'Official current IPR-component page with reimbursement routes.'),
  ('SFURTI current portal and notices', 'https://sfurti.msme.gov.in/SFURTI/Home.aspx', 'agency_portal', 'central', 'weekly', 2, true, 'Official current SFURTI portal with proposal, cluster and notice status.'),
  ('ASPIRE revised operational guidelines 2022', 'https://aspire.msme.gov.in/WriteReadData/DocumentFile/ASPIRE_NEW.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official revised guideline for the 2021-22 to 2025-26 cycle; continuation requires review.'),
  ('ASPIRE current registration portal', 'https://aspire.msme.gov.in/ASPIRE/Registration.aspx', 'agency_portal', 'central', 'weekly', 2, true, 'Official current registration route for new Livelihood Business Incubators.'),
  ('ASPIRE current scheme dashboard', 'https://aspire.msme.gov.in/ASPIRE/AFHome.aspx', 'agency_portal', 'central', 'weekly', 2, true, 'Official ASPIRE portal reporting and current LBI application notice.')
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
  innovative_version_id uuid;
  sfurti_version_id uuid;
  aspire_version_id uuid;
begin
  select current_version_id into innovative_version_id from public.opportunities where slug = 'msme-innovative-incubation-design-ipr';
  if innovative_version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_portal_context', 'The official portal currently advertises Idea Hackathon 6.0 and host-institute instructions; component-specific routes remain separate.',
        'current_source_checked_at', '2026-09-07'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_innovative_facts', jsonb_build_object(
          'official_sources_checked', '2026-09-07',
          'current_portal', 'https://innovative.msme.gov.in/',
          'current_hackathon', 'Idea Hackathon 6.0 is displayed on the official MSME Innovative portal; no universal deadline is asserted from the portal landing page.',
          'design_context', 'The current design page advertises up to Rs. 40 lakh financial assistance and an Udyam-registration route, subject to component conditions.',
          'ipr_context', 'The current IPR page exposes reimbursement routes for patents, GI, trademarks and design patents; exact reimbursement and applicant conditions remain guideline-dependent.'
        ),
        'current_source_reconciliation', 'The current MSME Innovative portal, design page and IPR page were checked on 7 September 2026. The record remains component-specific and review-gated; current portal notices are not treated as a universal entitlement.'
      ),
      last_verified_at = now(), review_status = 'in_review'
    where id = innovative_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select innovative_version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://innovative.msme.gov.in/Home/', 'ministry', 'MSME Innovative Idea Hackathon 6.0', 'Idea Hackathon 6.0 and host-institute instructions'),
      ('https://innovative.msme.gov.in/Home/Index', 'ministry', 'MSME Innovative current design page', 'Up to Rs. 40 lakh assistance and Udyam route'),
      ('https://innovative.msme.gov.in/Home/IprIndex', 'ministry', 'MSME Innovative current IPR page', 'Patent, GI, trademark and design-patent reimbursement routes')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = innovative_version_id and source_url = evidence.source_url);
  end if;

  select current_version_id into sfurti_version_id from public.opportunities where slug = 'scheme-for-fund-for-regeneration-of-traditional-industries-sfurti';
  if sfurti_version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_portal_context', 'The official portal currently exposes SignUp for New Proposal, nodal-agency information and current notices.',
        'current_source_checked_at', '2026-09-07'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_sfurti_facts', jsonb_build_object(
          'official_sources_checked', '2026-09-07',
          'current_portal', 'https://sfurti.msme.gov.in/SFURTI/Home.aspx',
          'current_portal_status', 'The official portal reports 513 approved clusters, 376 functional clusters and 0 proposals under consideration at the displayed dashboard snapshot.',
          'current_guideline', 'The portal displays Revised Guidelines for SFURTI dated 09 September 2022; current notices and proposal requirements govern implementation.',
          'current_availability', 'A current proposal route is visible, but no universal deadline is asserted; verify the nodal agency, notice, project terms and live submission state before recommendation.'
        ),
        'current_source_reconciliation', 'The current SFURTI portal, notices and revised guideline link were checked on 7 September 2026. Portal proposal access is retained as operational evidence, not as proof that every cluster or applicant is eligible.'
      ),
      last_verified_at = now(), review_status = 'in_review'
    where id = sfurti_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select sfurti_version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://sfurti.msme.gov.in/SFURTI/Home.aspx', 'agency', 'SFURTI current portal and notices', 'SignUp for New Proposal, Nodal Agency List and current notices')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = sfurti_version_id and source_url = evidence.source_url);
  end if;

  select current_version_id into aspire_version_id from public.opportunities where slug = 'aspire-innovation-rural-industry-entrepreneurship';
  if aspire_version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'portal', 'https://aspire.msme.gov.in/ASPIRE/Registration.aspx',
        'current_portal_context', 'The official ASPIRE portal currently states that eligible applicants may apply for new Livelihood Business Incubators and exposes a registration form.',
        'current_source_checked_at', '2026-09-07'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_aspire_facts', jsonb_build_object(
          'official_sources_checked', '2026-09-07',
          'current_portal', 'https://aspire.msme.gov.in/ASPIRE/AFHome.aspx',
          'current_notice', 'The official portal displays that eligible applicants may apply for new Livelihood Business Incubators.',
          'current_dashboard_context', 'The portal reports 109 LBIs approved, 82 functional and 1,15,437 beneficiaries skilled at the displayed snapshot; these are programme metrics, not applicant entitlement.',
          'guideline_boundary', 'The revised operational guideline cited on the portal covers the 2021-22 to 2025-26 cycle; continuation and current assistance ceilings require review.'
        ),
        'current_source_reconciliation', 'The current ASPIRE dashboard, registration route and revised 2022 operational guideline were checked on 7 September 2026. The record remains institution-led and review-gated; the portal notice does not establish eligibility for a specific institution without the current application review.'
      ),
      last_verified_at = now(), review_status = 'in_review'
    where id = aspire_version_id;

    update public.opportunity_windows
    set window_type = 'rolling',
        label = 'The official ASPIRE portal displays an invitation for eligible applicants to apply for new Livelihood Business Incubators; verify current eligibility and submission state.',
        source_evidence = jsonb_build_object('source_url', 'https://aspire.msme.gov.in/ASPIRE/Registration.aspx', 'anchor', 'ASPIRE Registration Form for Livelihood Business Incubator; checked 7 September 2026')
    where opportunity_version_id = aspire_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select aspire_version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://aspire.msme.gov.in/WriteReadData/DocumentFile/ASPIRE_NEW.pdf', 'guideline', 'ASPIRE revised operational guidelines 2022', '2021-22 to 2025-26 cycle and LBI/FoF operating guidance'),
      ('https://aspire.msme.gov.in/ASPIRE/Registration.aspx', 'agency', 'ASPIRE current registration portal', 'Registration Form for new Livelihood Business Incubator'),
      ('https://aspire.msme.gov.in/ASPIRE/AFHome.aspx', 'agency', 'ASPIRE current scheme dashboard', 'Current LBI application notice and dashboard context')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = aspire_version_id and source_url = evidence.source_url);
  end if;
end $$;
