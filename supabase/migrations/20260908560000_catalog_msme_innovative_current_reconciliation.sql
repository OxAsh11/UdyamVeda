-- Current MSME Innovative reconciliation for controlled Batch 085 review.
-- The record remains review-gated; current portal availability is not approval.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('MSME Innovative official About page', 'https://innovative.msme.gov.in/Home/About', 'ministry_portal', 'central', 'weekly', 2, true, 'Official Ministry of MSME description of the unified Incubation, Design and IPR framework.'),
  ('MSME Innovative current incubation route', 'https://www.my.msme.gov.in/inc/Default.aspx', 'implementing_portal', 'central', 'weekly', 2, true, 'Official MyMSME incubation route with Host Institute and Idea Hackathon instructions.')
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
  where slug = 'msme-innovative-incubation-design-ipr';

  if version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_portal_context', 'The official MSME Innovative portal displays Idea Hackathon 6.0 host-institute instructions and separate Design, IPR and incubation routes.',
        'current_source_checked_at', '2026-09-08'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_innovative_reconciliation', jsonb_build_object(
          'official_sources_checked', '2026-09-08',
          'framework_boundary', 'Incubation, Design and IPR are separate component verticals with permitted interoperability; benefits and conditions are not one combined entitlement.',
          'current_portal', 'https://innovative.msme.gov.in/',
          'design_route', 'https://innovative.msme.gov.in/Home/Index',
          'ipr_route', 'https://innovative.msme.gov.in/Home/IprIndex',
          'incubation_route', 'https://www.my.msme.gov.in/inc/Default.aspx',
          'hackathon_status', 'Existing controlled evidence records the displayed 7 September 2026 Host Institute forwarding deadline as closed; fresh live capture is required before publication.',
          'review_boundary', 'Verify current component notice, applicant type, eligible costs, contribution, window, documents and selection conditions before recommendation.'
        ),
        'current_source_reconciliation', 'Official MSME Innovative portal, About page, Design route, IPR route, guideline and MyMSME incubation route were checked on 8 September 2026. The record remains component-specific and review-gated; portal availability is not a universal entitlement.'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://innovative.msme.gov.in/Home/About', 'ministry', 'MSME Innovative official About page', 'Unified Incubation, Design and IPR framework'),
      ('https://www.my.msme.gov.in/inc/Default.aspx', 'implementing_portal', 'MSME Innovative current incubation route', 'Host Institute and Idea Hackathon instructions')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources os
      where os.opportunity_version_id = version_id
        and os.source_url = evidence.source_url
    );
  end if;
end $$;
