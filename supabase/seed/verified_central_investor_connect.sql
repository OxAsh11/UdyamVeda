-- Startup India Investor Connect.
-- This record describes a Government-facilitated market-access platform. It
-- is not a grant, loan, guaranteed investor introduction, or guaranteed funding outcome.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Startup India Investor Connect overview', 'https://www.startupindia.gov.in/content/sih/en/about-startup-india-initiative.html', 'ministry', 'central', 'weekly', 1, true, 'Official Startup India overview for the Investor Connect purpose and platform context.'),
  ('Startup India Investor Connect dashboard entry', 'https://www.startupindia.gov.in/content/sih/en/user/my-dashboard/Startup.html', 'ministry', 'central', 'weekly', 1, true, 'Official Startup India dashboard route for the current profile and Investor Connect entry.')
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
  item jsonb;
  authority_id uuid;
  seed_opportunity_id uuid;
  version_id uuid;
begin
  for item in
    select value from jsonb_array_elements($records$[
      {
        "slug":"startup-india-investor-connect",
        "name":"Startup India Investor Connect",
        "type":"market_access",
        "authority":"Department for Promotion of Industry and Internal Trade - Startup India",
        "authority_url":"https://www.startupindia.gov.in/",
        "canonical_url":"https://www.startupindia.gov.in/content/sih/en/about-startup-india-initiative.html",
        "source_url":"https://www.startupindia.gov.in/content/sih/en/about-startup-india-initiative.html",
        "source_kind":"ministry",
        "source_title":"Startup India Investor Connect overview",
        "source_anchor":"Startup India Investor Connect: purpose, launch and investor-startup engagement description",
        "summary":"A Startup India platform that helps startups connect with investors and participate in investor-hosted funding opportunities through a startup profile.",
        "objective":"Facilitate investor-startup connections and support entrepreneurship by enabling startup discovery, pitching and engagement across sectors, stages, geographies and backgrounds.",
        "legal_basis":"Startup India Investor Connect initiative described by the Department for Promotion of Industry and Internal Trade; current platform terms and access rules require portal review.",
        "eligibility":{"entity_types":["startup"],"lifecycle_stages":["validation","early_revenue","growth"],"industries":["all"],"locations":["India"],"conditions":["the startup must complete the current Startup India/BHASKAR profile or other portal onboarding required for access","investor participation and screening are controlled by the platform and participating investors"],"exclusions":["the platform does not guarantee an investor response, pitch invitation, investment, valuation or funding","investor due diligence and commercial negotiation remain separate from platform participation","current profile, visibility, data-sharing and participating-investor conditions must be confirmed from the live portal"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.startupindia.gov.in/","route":"Register or sign in through the current Startup India/BHASKAR onboarding, complete the startup profile and use the Investor Connect entry when available.","direct_funding_application":false,"applicant_note":"UdyamVeda can help prepare a profile and pitch checklist, but cannot promise investor access, submit as the applicant, or represent itself as Startup India.","fees":"Confirm current portal terms and any event-specific fee before proceeding."},
        "fine_print":{"support_type":"non_cash_market_access","outcomes_not_guaranteed":["investor response","pitch invitation","investment","valuation","funding"],"investor_due_diligence_required":true,"data_sharing_consent_required":true,"review_note":"Confirm the current registration handoff, profile fields, investor discovery controls, data-sharing consent, pitch or event windows, eligibility restrictions and platform terms before publication. Do not advertise a guaranteed match or financing amount."},
        "benefit_summary":{"types":["market_access","mentorship"],"summary":"Investor discovery, pitching and engagement opportunities; participation does not guarantee an investor introduction or funding.","separate_value_buckets":true},
        "benefit_type":"market_access",
        "benefit_label":"Investor discovery and pitching access",
        "benefit_conditions":{"non_cash":true,"funding_not_guaranteed":true,"investor_selection_controlled_by_participating_investors":true},
        "requirement":"Completed Startup India profile and consent",
        "requirement_description":"Complete the current Startup India/BHASKAR profile and review the platform and investor data-sharing terms before making startup information discoverable.",
        "rules":{"all":[{"field":"applicant_role","operator":"equals","value":"startup"},{"field":"startup_profile_complete","operator":"equals","value":true},{"field":"investor_data_sharing_consent","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Create or complete the Startup India profile","description":"Use the current official Startup India/BHASKAR onboarding and complete the startup information required for discovery.","url":"https://www.startupindia.gov.in/"},{"title":"Review data-sharing and visibility settings","description":"Confirm what information is shared with investors and whether the profile is discoverable under the current portal controls.","url":"https://www.startupindia.gov.in/content/sih/en/user/my-dashboard/Startup.html"},{"title":"Use Investor Connect and respond to investor opportunities","description":"Use the current Investor Connect entry to discover, pitch or respond to investor-hosted opportunities. Investor interest and investment remain discretionary.","url":"https://www.startupindia.gov.in/content/sih/en/user/my-dashboard/Startup.html"}],
        "window_type":"rolling",
        "window_label":"Platform access is presented as ongoing; investor-hosted opportunities and pitch events may have their own windows and must be verified individually.",
        "window_evidence":{"source_url":"https://www.startupindia.gov.in/content/sih/en/user/my-dashboard/Startup.html","anchor":"Investor Connect dashboard entry and investor-hosted opportunities"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Commerce and Industry', 'Department for Promotion of Industry and Internal Trade', item->>'authority_url'
    where not exists (select 1 from public.authorities where name = item->>'authority')
    returning id into authority_id;
    if authority_id is null then
      select id into authority_id from public.authorities where name = item->>'authority' limit 1;
    end if;

    seed_opportunity_id := null;
    insert into public.opportunities (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (item->>'slug', item->>'name', item->>'type', 'in_review', authority_id, '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, authority_id = excluded.authority_id, canonical_url = excluded.canonical_url
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then
      select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1;
    end if;

    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.90, 0.84, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where public.opportunities.id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://www.startupindia.gov.in/content/sih/en/user/my-dashboard/Startup.html', 'ministry', 'Startup India Investor Connect dashboard entry', 'Investor Connect dashboard entry: startup profile and investor opportunity description', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.startupindia.gov.in/content/sih/en/user/my-dashboard/Startup.html');
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', item->'benefit_conditions'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = item->>'benefit_label');
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'other', item->>'requirement', item->>'requirement_description', true
    where not exists (select 1 from public.opportunity_requirements where opportunity_version_id = version_id and name = item->>'requirement');
    insert into public.eligibility_rule_sets (opportunity_version_id, rules, source_evidence, reviewed)
    select version_id, item->'rules', jsonb_build_array(jsonb_build_object('source_url', item->>'source_url', 'anchor', item->>'source_anchor')), false
    where not exists (select 1 from public.eligibility_rule_sets where opportunity_version_id = version_id);
    insert into public.opportunity_steps (opportunity_version_id, step_number, title, description, official_url)
    select version_id, (row_number() over ())::integer, step->>'title', step->>'description', step->>'url'
    from jsonb_array_elements(item->'steps') as steps(step)
    where not exists (select 1 from public.opportunity_steps where opportunity_version_id = version_id);
    insert into public.opportunity_windows (opportunity_version_id, window_type, label, source_evidence)
    select version_id, item->>'window_type', item->>'window_label', item->'window_evidence'
    where not exists (select 1 from public.opportunity_windows where opportunity_version_id = version_id);
    insert into public.review_tasks (opportunity_version_id, task_type, status)
    select version_id, 'publish', 'open'
    where not exists (select 1 from public.review_tasks where opportunity_version_id = version_id and task_type = 'publish' and status in ('open', 'in_review'));
  end loop;
end $$;
