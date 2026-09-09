-- Current-source reconciliation for GeM Startup Runway.
-- This is market access and procurement readiness, not a guaranteed award or
-- financial benefit. The record remains review-gated.

do $$
declare
  version_id uuid;
begin
  select current_version_id into version_id
  from public.opportunities
  where slug = 'gem-startup-runway-public-procurement';

  if version_id is null then
    return;
  end if;

  update public.opportunity_versions
  set
    fine_print = fine_print || jsonb_build_object(
      'current_source_reconciliation', 'Official GeM Startup Runway, current Startup India public-procurement guidance, June 2026 Startup Schemes Playbook and PIB Startup Runway 2.0 update reviewed; seller route, category rules, DPIIT linkage and tender-specific relaxations remain review items.',
      'current_policy_boundary', 'Prior experience, prior turnover and EMD relaxations are conditional and tender/category/buyer dependent; State procurement rules are separate from Central Ministries, Departments and CPSE orders.',
      'eligibility_conflict_boundary', 'Current official materials describe DPIIT-recognised startup benefits alongside broader Startup Runway/all-startup listing language. Do not publish one universal eligibility rule until the live GeM route is reconciled.',
      'benefit_boundary', 'Market access and public-procurement participation only; no grant, subsidy, loan, tax benefit, guaranteed order or guaranteed revenue.'
    ),
    last_verified_at = now(),
    review_status = 'in_review'
  where id = version_id;

  insert into public.opportunity_sources
    (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
  select version_id, source_url, source_kind, source_title, source_anchor, now(), false
  from (values
    ('https://gem.gov.in/Startup_Runway', 'official_gem_portal', 'GeM Startup Runway', 'Seller sign-up, innovative product/service categories and government-buyer marketplace'),
    ('https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'official_playbook', 'Startup Schemes Playbook June 2026', 'Page 37: GeM Startup Runway applicant, benefit and application route'),
    ('https://www.pib.gov.in/PressReleasePage.aspx?PRID=2296546&lang=1&reg=6', 'pib_release', 'PIB GeM Startup Runway 2.0 update', 'Startup Runway 2.0 and GeM Suvidha Kendra change-detection context')
  ) as sources(source_url, source_kind, source_title, source_anchor)
  where not exists (
    select 1 from public.opportunity_sources existing
    where existing.opportunity_version_id = version_id
      and existing.source_url = sources.source_url
  );
end $$;
