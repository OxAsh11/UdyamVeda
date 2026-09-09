-- Startup India MAARG mentorship access. This is a non-financial support
-- route, not a grant or guaranteed advisory outcome; it remains in_review
-- until the current platform onboarding, matching and availability are checked.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Startup India MAARG portal', 'https://maarg.startupindia.gov.in/', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Official Startup India MAARG portal for startup and mentor onboarding; current availability and terms require live review.'),
  ('Startup India MAARG get-a-mentor route', 'https://maarg.startupindia.gov.in/get-a-mentor', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Official MAARG startup mentorship route and application entry point.'),
  ('Startup India MAARG platform overview', 'https://www.startupindia.gov.in/', 'ministry_portal', 'central', 'monthly', 1, true, 'Startup India discovery source describing MAARG as a national mentorship and matchmaking platform.'),
  ('Startup India mentor dashboard guidance', 'https://www.startupindia.gov.in/content/sih/en/user/my-dashboard/Investor.html', 'ministry_portal', 'central', 'monthly', 1, true, 'Startup India dashboard source describing mentor connections and the MAARG portal; current account limits and interface require review.')
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
        "slug":"startup-india-maarg-mentorship",
        "name":"Startup India MAARG Mentorship",
        "type":"mentorship",
        "authority":"Department for Promotion of Industry and Internal Trade - Startup India",
        "authority_url":"https://www.startupindia.gov.in/",
        "canonical_url":"https://maarg.startupindia.gov.in/",
        "source_url":"https://maarg.startupindia.gov.in/",
        "source_kind":"implementing_agency_portal",
        "source_title":"Startup India MAARG Portal",
        "source_anchor":"The Startup India National Mentorship Platform; Startup Application; Get a Mentor",
        "summary":"A national Startup India mentorship platform that helps startups connect with relevant experts across sectors, functions, stages, geographies and backgrounds.",
        "objective":"Give startups a structured route to seek expert guidance, connect with mentors and track mentorship interactions while keeping the official platform in control of matching and communication.",
        "legal_basis":"Startup India MAARG programme and current platform terms administered under the Department for Promotion of Industry and Internal Trade; current onboarding and participation conditions apply.",
        "eligibility":{"entity_types":["startup","dpiit_recognised_startup","startup_founder"],"lifecycle_stages":["idea","early_stage","growth","scaling"],"industries":["all_business_sectors"],"locations":["India"],"conditions":["startup must complete the current Startup India or MAARG onboarding route","mentor matching depends on the current platform profile, stated needs and available mentors","the startup must follow platform communication, consent and conduct terms","a mentor match or session is not guaranteed"],"exclusions":["cash-grant or loan claims","guaranteed mentor, investment, customer, regulatory or commercial outcome"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://maarg.startupindia.gov.in/get-a-mentor","route":"use the official MAARG startup application or Startup India sign-in, complete the startup profile and mentorship need, then use the current mentor-matching and connection workflow","applicant_note":"UdyamVeda may help the founder clarify goals and prepare a profile, but the founder must use their own official account and control all login credentials, consent and communications."},
        "fine_print":{"benefit_is_non_financial":true,"grant_or_subsidy":false,"mentor_match_guaranteed":false,"platform_functions":["mentor and startup matching","mentor and startup interaction tracking","video calls and platform communication","ecosystem or cohort programmes","feedback, query and grievance mechanism"],"availability_dependency":"The quality and timing of support depend on current mentor availability, profile fit, cohort or programme participation and platform operating rules.","privacy_note":"UdyamVeda must not collect or store Startup India credentials, passwords or OTPs; official sign-in and consent stay with the founder.","review_note":"Confirm the current MAARG sign-in/SSO route, startup-profile fields, mentor availability, matching process, communication terms, cohort route, privacy notice and any current participation limits before publication."},
        "benefit_summary":{"types":["mentorship","expert_guidance","networking"],"summary":"Potential access to expert mentorship and structured startup guidance through the official MAARG platform; there is no assumed cash benefit or guaranteed match."},
        "benefit_type":"mentorship",
        "benefit_label":"Expert mentorship through Startup India MAARG",
        "benefit_conditions":{"startup_profile_required":true,"official_account_required":true,"mentor_availability_required":true,"no_guaranteed_match":true},
        "requirement":"Startup profile and defined mentorship need",
        "requirement_description":"The startup must complete the official onboarding profile and describe the business stage, sector, function and problem for which mentorship is sought.",
        "rules":{"all":[{"field":"mentorship_intent","operator":"equals","value":true},{"field":"startup_profile_ready","operator":"equals","value":true},{"field":"maarg_route_available","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Define the mentorship objective","description":"Identify the stage, sector, function and specific decision or problem for which the founder needs expert guidance.","url":"https://www.startupindia.gov.in/"},{"title":"Use the official MAARG route","description":"Open the official MAARG startup application or use the current Startup India sign-in route with the founder's own credentials.","url":"https://maarg.startupindia.gov.in/get-a-mentor"},{"title":"Complete the startup profile","description":"Provide the current business and mentorship information requested by the platform; do not share passwords or OTPs with UdyamVeda.","url":"https://maarg.startupindia.gov.in/"},{"title":"Request and manage mentor connections","description":"Review available matches, send the official connection request and use the platform's communication, feedback and grievance tools.","url":"https://maarg.startupindia.gov.in/get-a-mentor"}],
        "window_type":"rolling",
        "window_label":"The mentorship route is platform-based and generally rolling; mentor availability, cohorts and platform operating windows require current verification.",
        "window_evidence":{"source_url":"https://maarg.startupindia.gov.in/","anchor":"Startup Application; Get a Mentor; Key Functions of MAARG Program"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Commerce and Industry', 'DPIIT', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.84, 0.82, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where public.opportunities.id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
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
