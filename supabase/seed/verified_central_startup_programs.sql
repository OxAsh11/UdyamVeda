-- Startup India programme records discovered from official Startup India pages.
-- These are intentionally in_review: current challenge windows, application
-- forms, categories, and selection terms require source-by-source review.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Bharat Startup Grand Challenge official page', 'https://www.startupindia.gov.in/content/sih/en/bharat-startup-grand-challenge.html', 'ministry_portal', 'central', 'weekly', 2, true, 'Official challenge description, FAQ, partner and ongoing/concluded challenge source.'),
  ('National Startup Awards official landing page', 'https://www.startupindia.gov.in/content/sih/en/nsa-landing.html', 'ministry_portal', 'central', 'weekly', 2, true, 'Official award purpose, benefits and application landing page; current edition details require review.')
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
        "slug":"bharat-startup-grand-challenge",
        "name":"Bharat Startup Grand Challenge",
        "type":"challenge",
        "authority":"DPIIT - Startup India",
        "authority_url":"https://www.startupindia.gov.in/",
        "canonical_url":"https://www.startupindia.gov.in/content/sih/en/bharat-startup-grand-challenge.html",
        "source_url":"https://www.startupindia.gov.in/content/sih/en/bharat-startup-grand-challenge.html",
        "source_kind":"ministry",
        "source_title":"Bharat Startup Grand Challenge",
        "source_anchor":"Objective; Benefits; Ongoing Challenges; Frequently Asked Questions",
        "summary":"A Startup India challenge platform connecting startups with real-world industry and societal problems, mentorship and potential industry collaboration.",
        "objective":"Bridge emerging startups and real-world challenges through practical, scalable solutions and cross-sector collaboration.",
        "legal_basis":"Bharat Startup Grand Challenge information published by Startup India and DPIIT",
        "eligibility":{"entity_types":["dpiit_recognized_startup","startup"],"conditions":["a viable solution must address the applicable published problem statement","each challenge may have additional eligibility criteria"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.startupindia.gov.in/content/sih/en/bharat-startup-grand-challenge.html","route":"review the current ongoing challenges and submit through the designated application process","selection":"challenge-specific evaluation and selection"},
        "fine_print":{"participation_fee_inr":0,"benefit_structure":["expert mentorship","potential industry collaboration","partnership and business linkages","possible fiscal or infrastructure support"],"window_dependency":true,"review_note":"The page describes the programme and FAQ but the active challenge, deadline, problem statement, selection rubric, and any challenge-specific prize must be verified before publication."},
        "benefit_summary":{"types":["market_access","mentorship","recognition"],"summary":"Challenge participation may provide mentorship, partnerships, industry linkages and other challenge-specific support; no universal cash amount is assumed."},
        "benefit_type":"market_access",
        "benefit_label":"Challenge participation, mentorship and industry linkage",
        "benefit_conditions":{"challenge_specific":true,"current_problem_statement_required":true},
        "requirement":"A viable solution for an active challenge problem statement",
        "requirement_description":"The startup must identify an active challenge and demonstrate a meaningful solution to its published problem statement.",
        "rules":{"all":[{"field":"startup_exists","operator":"equals","value":true},{"field":"active_challenge_problem_match","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Review active challenge problem statements","description":"Confirm that the current ongoing challenge and its problem statement match the startup solution.","url":"https://www.startupindia.gov.in/content/sih/en/bharat-startup-grand-challenge.html"},{"title":"Submit through the designated process","description":"Prepare the challenge response and submit using the official challenge application flow.","url":"https://www.startupindia.gov.in/content/sih/en/bharat-startup-grand-challenge.html"}],
        "window_type":"call_for_applications",
        "window_label":"Challenge windows are published per problem statement; verify the current ongoing challenge and closing date.",
        "window_evidence":{"source_url":"https://www.startupindia.gov.in/content/sih/en/bharat-startup-grand-challenge.html","anchor":"Ongoing Challenges and How can a startup apply?"}
      },
      {
        "slug":"national-startup-awards",
        "name":"National Startup Awards",
        "type":"award",
        "authority":"DPIIT - Startup India",
        "authority_url":"https://www.startupindia.gov.in/",
        "canonical_url":"https://www.startupindia.gov.in/content/sih/en/nsa-landing.html",
        "source_url":"https://www.startupindia.gov.in/content/sih/en/ams-application/application-listing.html",
        "source_kind":"ministry",
        "source_title":"Startup India Programs - National Startup Awards 5.0 notice",
        "source_anchor":"Applications for National Startup Awards 5.0 are now open; Apply in 20+ Categories; Win a Cash Prize of Rs. 10 Lakhs",
        "summary":"An annual Startup India recognition programme for innovative, impactful and scalable startups and ecosystem enablers.",
        "objective":"Recognise and reward startups and ecosystem enablers building innovative products or solutions with scalable enterprises, employment or wealth creation and measurable social impact.",
        "legal_basis":"National Startup Awards information published by Startup India and DPIIT",
        "eligibility":{"entity_types":["dpiit_recognized_startup","startup","ecosystem_enabler"],"conditions":["current edition categories and eligibility must be satisfied","the official programme page currently highlights DPIIT-recognized startups for NSA 5.0"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.startupindia.gov.in/content/sih/en/ams-application/application-listing.html","detail":"https://www.startupindia.gov.in/content/sih/en/nsa-landing.html","route":"apply through the current National Startup Awards application flow","selection":"category-specific screening and award evaluation"},
        "fine_print":{"current_edition":"NSA 5.0","cash_prize_max_inr":1000000,"category_count_claimed":"20","support":["handholding","investor connections","government connections","market access opportunities"],"application_state":"official NSA 5.0 page currently states that applications are closed; do not present this record as open","review_note":"Confirm the next edition, current application deadline, category-level eligibility, award terms and prize conditions before publication."},
        "benefit_summary":{"types":["recognition","grant","market_access","mentorship"],"summary":"National recognition, a stated cash prize opportunity and handholding/support benefits subject to the current edition rules and category conditions."},
        "benefit_type":"recognition",
        "benefit_label":"National recognition and award opportunity",
        "amount_max":1000000,
        "benefit_conditions":{"current_edition":"NSA 5.0","category_specific":true,"award_not_guaranteed":true},
        "requirement":"Current-edition category and startup eligibility",
        "requirement_description":"The applicant must satisfy the current National Startup Awards category requirements and submit the required application material before the official deadline.",
        "rules":{"all":[{"field":"startup_exists","operator":"equals","value":true},{"field":"current_nsa_category_eligibility","operator":"equals","value":true},{"field":"application_window_open","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Select a current award category","description":"Review the current category, eligibility and application requirements before starting the submission.","url":"https://www.startupindia.gov.in/content/sih/en/nsa-landing.html"},{"title":"Submit through the official application flow","description":"Complete the current National Startup Awards application and retain the submitted materials and confirmation.","url":"https://www.startupindia.gov.in/content/sih/en/ams-application/application-listing.html"}],
        "window_type":"call_for_applications",
        "window_label":"NSA 5.0 is currently displayed as closed on the official Startup India page; no active application deadline is asserted. Recheck the next official edition before recommendation.",
        "window_evidence":{"source_url":"https://www.startupindia.gov.in/content/sih/en/ams-application/application-listing.html","anchor":"Applications for National Startup Awards 5.0 are now open"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, official_url)
    select item->>'authority', 'central', 'Department for Promotion of Industry and Internal Trade', item->>'authority_url'
    where not exists (select 1 from public.authorities where name = item->>'authority')
    returning id into authority_id;
    if authority_id is null then
      select id into authority_id from public.authorities where name = item->>'authority' limit 1;
    end if;

    seed_opportunity_id := null;
    insert into public.opportunities
      (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (item->>'slug', item->>'name', item->>'type', 'in_review', authority_id, '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, authority_id = excluded.authority_id, canonical_url = excluded.canonical_url
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then
      select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1;
    end if;

    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.82, 0.80, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where public.opportunities.id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');

    if item->>'slug' = 'national-startup-awards' then
      insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
      select version_id, 'https://www.startupindia.gov.in/content/sih/en/nsa-landing.html', 'ministry', 'National Startup Awards official landing page', 'Purpose, benefits and application landing page', now(), false
      where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.startupindia.gov.in/content/sih/en/nsa-landing.html');
    end if;

    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', case when item ? 'amount_max' then (item->>'amount_max')::numeric else null end, item->'benefit_conditions'
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
