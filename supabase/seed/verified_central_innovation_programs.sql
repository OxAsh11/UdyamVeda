-- Additional Central Government innovation and startup-support records from
-- official MeitY, DST and BIRAC sources. These records remain in_review:
-- current calls, centre availability, amendments and applicant evidence still
-- require editorial confirmation before publication.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('MeitY TIDE scheme page', 'https://www.meity.gov.in/offerings/schemes-and-services/details/technology-incubation-and-development-of-entrepreneurs-QMwEjNtQWa', 'ministry_portal', 'central', 'monthly', 2, true, 'Official MeitY scheme page for TIDE 2.0; detailed centre and applicant terms require review.'),
  ('MeitY Startup Hub SAMRIDH page', 'https://msh.meity.gov.in/schemes/samridh', 'agency_portal', 'central', 'monthly', 2, true, 'Official MeitY Startup Hub page for SAMRIDH; accelerator cohorts and current routes require review.'),
  ('MeitY Startup Hub official portal', 'https://msh.meity.gov.in/', 'agency_portal', 'central', 'monthly', 2, true, 'Official MeitY Startup Hub portal referenced as the SAMRIDH authority homepage.'),
  ('DST NIDHI PRAYAS 2.0 page', 'https://nidhi.dst.gov.in/prayas2-0/', 'ministry_portal', 'central', 'monthly', 2, true, 'Official DST NIDHI page for PRAYAS 2.0 and current centre routes.'),
  ('DST NIDHI official portal', 'https://nidhi.dst.gov.in/', 'ministry_portal', 'central', 'monthly', 2, true, 'Official DST NIDHI portal referenced as the NIDHI PRAYAS authority homepage.'),
  ('DST NIDHI PRAYAS 2.0 guidelines', 'https://nidhi.dst.gov.in/document/nidhi-prayas-2-0-program-guidelines/', 'guideline', 'central', 'monthly', 1, true, 'Official DST NIDHI guidelines page; the linked document is the primary fine-print source.'),
  ('BIRAC Biotechnology Ignition Grant page', 'https://www.birac.nic.in/big.php', 'agency_portal', 'central', 'monthly', 2, true, 'Official BIRAC BIG scheme page with current call cadence and grant overview.'),
  ('BIRAC official portal', 'https://www.birac.nic.in/', 'agency_portal', 'central', 'monthly', 2, true, 'Official BIRAC portal referenced as the BIG authority homepage.'),
  ('BIRAC BIG user guide', 'https://birac.nic.in/webcontent/big_user_guide.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official BIRAC BIG user guide for eligibility and proof-of-concept conditions.')
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
        "slug":"technology-incubation-and-development-of-entrepreneurs-tide-2",
        "name":"Technology Incubation and Development of Entrepreneurs (TIDE 2.0)",
        "type":"incubator",
        "authority":"Ministry of Electronics and Information Technology - TIDE",
        "authority_url":"https://www.meity.gov.in/",
        "canonical_url":"https://www.meity.gov.in/offerings/schemes-and-services/details/technology-incubation-and-development-of-entrepreneurs-QMwEjNtQWa",
        "source_url":"https://www.meity.gov.in/offerings/schemes-and-services/details/technology-incubation-and-development-of-entrepreneurs-QMwEjNtQWa",
        "source_kind":"ministry_portal",
        "source_title":"Technology Incubation and Development of Entrepreneurs (TIDE)",
        "source_anchor":"Introduction and Eligibility",
        "summary":"Technology incubation and financial or technical support for emerging-technology startups through supported incubation centres.",
        "objective":"Strengthen technology incubation and help young entrepreneurs turn innovative technology ideas into startup companies and commercially useful products.",
        "legal_basis":"MeitY Technology Incubation and Development of Entrepreneurs (TIDE 2.0) scheme",
        "eligibility":{"entity_types":["individual","student","startup"],"industries":["information_technology","ai","iot","blockchain","robotics","emerging_technology"],"conditions":["the official page describes TRL 3 potential as an eligibility signal","application is routed through a supported incubation centre or current programme route"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.meity.gov.in/offerings/schemes-and-services/details/technology-incubation-and-development-of-entrepreneurs-QMwEjNtQWa","route":"identify a currently supported TIDE incubation centre and follow its official intake route","support_route":"incubator-led financial, technical and mentoring support"},
        "fine_print":{"incubator_led":true,"official_page_centre_count":51,"official_page_target_startups":2000,"technology_focus":["IoT","AI","blockchain","robotics"],"support_is_not_a_single_nationwide_cash_entitlement":true,"review_note":"Confirm the current TIDE 2.0 guideline, supported-centre list, applicant route, financial-support structure and remaining cohort availability before publication."},
        "benefit_summary":{"types":["incubation","technical_support","grant"],"summary":"Centre-mediated financial, technical, mentoring and incubation support; the applicant route and amount depend on the supported centre and current programme terms."},
        "benefit_type":"incubation_support",
        "benefit_label":"Technology incubation and startup support",
        "benefit_conditions":{"supported_tide_centre_required":true,"current_route_required":true},
        "requirement":"Innovative technology idea and supported incubation route",
        "requirement_description":"The applicant must present an innovative technology idea and satisfy the current intake conditions of a supported TIDE incubation centre.",
        "rules":{"all":[{"field":"technology_innovation_identified","operator":"equals","value":true},{"field":"innovation_readiness_level","operator":"greater_than_or_equal","value":3},{"field":"supported_tide_centre_available","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Check the TIDE 2.0 centre route","description":"Review the official MeitY page and identify a supported centre whose current intake matches the technology and stage.","url":"https://www.meity.gov.in/offerings/schemes-and-services/details/technology-incubation-and-development-of-entrepreneurs-QMwEjNtQWa"},{"title":"Submit to the supported centre","description":"Follow the centre's current application, pitch and document requirements; do not treat the national scheme page as a direct applicant filing portal.","url":"https://www.meity.gov.in/offerings/schemes-and-services/details/technology-incubation-and-development-of-entrepreneurs-QMwEjNtQWa"}],
        "window_type":"rolling",
        "window_label":"Centre-led intake; current supported-centre availability must be verified.",
        "window_evidence":{"source_url":"https://www.meity.gov.in/offerings/schemes-and-services/details/technology-incubation-and-development-of-entrepreneurs-QMwEjNtQWa","anchor":"Eligibility and List of TIDE Centres"}
      },
      {
        "slug":"startup-accelerator-meity-samridh",
        "name":"Startup Accelerator of MeitY for Product Innovation, Development and Growth (SAMRIDH)",
        "type":"accelerator",
        "authority":"MeitY Startup Hub - SAMRIDH",
        "authority_url":"https://msh.meity.gov.in/",
        "canonical_url":"https://msh.meity.gov.in/schemes/samridh",
        "source_url":"https://msh.meity.gov.in/schemes/samridh",
        "source_kind":"agency_portal",
        "source_title":"SAMRIDH scheme",
        "source_anchor":"Programme overview and salient features",
        "summary":"Accelerator-led support for technology product startups through customer, investor and market-access connections with matching funding support.",
        "objective":"Help product-based technology startups scale through selected accelerators, market access, mentorship and investor or international connections.",
        "legal_basis":"MeitY Startup Accelerator for Product Innovation, Development and Growth (SAMRIDH)",
        "eligibility":{"entity_types":["technology_startup"],"industries":["information_technology","technology_product"],"conditions":["startup must be selected by a participating SAMRIDH accelerator","product and scale-readiness conditions apply under the current cohort route"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://msh.meity.gov.in/schemes/samridh","route":"apply through a current participating SAMRIDH accelerator or cohort notice","selection":"accelerator-led screening and selection"},
        "fine_print":{"matching_funding_max_inr":4000000,"programme_target_startups":300,"programme_duration_years":3,"cohort_size_range":[5,10],"support_areas":["customer_connect","investor_connect","international_market_connect","mentorship"],"funding_is_accelerator_route":true,"review_note":"Confirm the current cohort, participating accelerator list, matching-funding mechanics, startup contribution or milestone conditions and application window before publication."},
        "benefit_summary":{"types":["matching_funding","accelerator","market_access","mentorship"],"summary":"Accelerator support and one-to-one matching funding of up to Rs. 40 lakh as described on the official SAMRIDH page, subject to cohort and accelerator terms."},
        "benefit_type":"matching_funding",
        "benefit_label":"Accelerator support with matching funding",
        "amount_max":4000000,
        "benefit_conditions":{"selected_accelerator_required":true,"matching_funding_not_unconditional":true},
        "requirement":"Technology product startup and participating accelerator selection",
        "requirement_description":"The startup must fit the current SAMRIDH product and technology focus and be selected through a participating accelerator route.",
        "rules":{"all":[{"field":"technology_product_startup","operator":"equals","value":true},{"field":"samridh_accelerator_selection","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Review the current SAMRIDH cohort route","description":"Check the official MeitY Startup Hub page for participating accelerators and cohort availability.","url":"https://msh.meity.gov.in/schemes/samridh"},{"title":"Apply through the accelerator","description":"Submit the product, traction, market and funding information requested by the selected participating accelerator.","url":"https://msh.meity.gov.in/schemes/samridh"}],
        "window_type":"call_for_applications",
        "window_label":"Cohort-based; current accelerator and application windows require verification.",
        "window_evidence":{"source_url":"https://msh.meity.gov.in/schemes/samridh","anchor":"Result of SAMRIDH cohort and list of centres"}
      },
      {
        "slug":"nidhi-prayas-2-0",
        "name":"NIDHI PRAYAS 2.0",
        "type":"grant",
        "authority":"Department of Science and Technology - NIDHI PRAYAS",
        "authority_url":"https://nidhi.dst.gov.in/",
        "canonical_url":"https://nidhi.dst.gov.in/prayas2-0/",
        "source_url":"https://nidhi.dst.gov.in/document/nidhi-prayas-2-0-program-guidelines/",
        "source_kind":"guideline",
        "source_title":"NIDHI PRAYAS 2.0 Program Guidelines",
        "source_anchor":"NIDHI PRAYAS 2.0 Program Guidelines page; View / Download link",
        "summary":"Prototype funding, fabrication infrastructure, technical mentorship and market connections for technology innovators and startups.",
        "objective":"Bridge the idea-to-prototype gap and help indigenous technology innovations move toward validation and commercialisation.",
        "legal_basis":"Department of Science and Technology NIDHI PRAYAS 2.0 programme",
        "eligibility":{"entity_types":["innovator","student","researcher","startup"],"industries":["technology","deep_tech","knowledge_based_innovation"],"lifecycle_stages":["idea","prototype","proof_of_concept"],"conditions":["application is through a PRAYAS Centre or Advance PRAYAS Centre","current centre-specific intake conditions apply"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://nidhi.dst.gov.in/prayas2-0/","route":"apply through a current PRAYAS Centre or Advance PRAYAS Centre when its intake is open","selection":"centre-level screening under the current NIDHI PRAYAS route"},
        "fine_print":{"prayas_centre_max_inr":2000000,"advance_prayas_centre_max_inr":4000000,"support_areas":["prototype_funding","fabrication_lab_access","technical_mentorship","ip_and_legal_assistance","industry_and_investor_connect"],"track_specific_ceiling":true,"review_note":"Confirm the latest guideline definitions, applicant restrictions, eligible cost heads, centre list, milestone/disbursement terms and current intake before publication."},
        "benefit_summary":{"types":["grant","prototype_support","mentorship"],"summary":"Prototype support up to Rs. 20 lakh through PRAYAS Centres or up to Rs. 40 lakh through Advance PRAYAS Centres, subject to track-specific rules and centre selection."},
        "benefit_type":"prototype_grant",
        "benefit_label":"Prototype funding and technical support",
        "amount_max":4000000,
        "benefit_conditions":{"track_specific_ceiling":true,"centre_selection_required":true},
        "requirement":"Technology innovation and PRAYAS centre route",
        "requirement_description":"The applicant must have a technology-driven innovation and apply through a current PRAYAS or Advance PRAYAS Centre under its published conditions.",
        "rules":{"all":[{"field":"technology_innovation_identified","operator":"equals","value":true},{"field":"prototype_or_poc_need","operator":"equals","value":true},{"field":"current_prayas_centre_route_available","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Select the appropriate PRAYAS track","description":"Use the official programme page and guidelines to determine whether a PRAYAS Centre or Advance PRAYAS Centre route fits the innovation stage.","url":"https://nidhi.dst.gov.in/prayas2-0/"},{"title":"Apply through the centre","description":"Submit the prototype plan, technical evidence and other documents required by the current centre intake.","url":"https://nidhi.dst.gov.in/prayas2-0/"}],
        "window_type":"call_for_applications",
        "window_label":"Centre-led calls; current centre availability and intake dates require verification.",
        "window_evidence":{"source_url":"https://nidhi.dst.gov.in/document/nidhi-prayas-2-0-program-guidelines/","anchor":"NIDHI PRAYAS 2.0 Program Guidelines page; View / Download link"}
      },
      {
        "slug":"biotechnology-ignition-grant-big",
        "name":"Biotechnology Ignition Grant (BIG)",
        "type":"grant",
        "authority":"Biotechnology Industry Research Assistance Council (BIRAC)",
        "authority_url":"https://www.birac.nic.in/",
        "canonical_url":"https://www.birac.nic.in/big.php",
        "source_url":"https://www.birac.nic.in/big.php",
        "source_kind":"agency_portal",
        "source_title":"Biotechnology Ignition Grant (BIG) scheme",
        "source_anchor":"Scheme overview and call announcement calendar",
        "summary":"Early-stage biotechnology grant-in-aid for innovators and startups developing commercially promising proof of concept.",
        "objective":"Fund and mentor high-potential biotechnology ideas through proof of concept and toward startup formation or commercialisation.",
        "legal_basis":"BIRAC Biotechnology Ignition Grant (BIG) scheme under the Department of Biotechnology interface",
        "eligibility":{"entity_types":["biotech_startup","individual_innovator","researcher","incubatee"],"industries":["biotechnology","biomedical","life_sciences"],"lifecycle_stages":["ideation","proof_of_concept"],"conditions":["technology must have commercialisation potential","individual applicants may need an eligible incubator route","prior BIG award and current call-specific criteria must be checked"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.birac.nic.in/big.php","route":"register and submit online during a current BIG call","selection":"BIRAC BIG Partner and programme evaluation under the current call"},
        "fine_print":{"grant_max_inr":5000000,"maximum_duration_months":18,"call_frequency":"twice yearly, announced around 1 January and 1 July","implementation_partners":8,"support_is_grant_in_aid":true,"review_note":"Confirm current call dates, revised startup-age and ownership rules, eligible cost heads, incubator conditions, prior-recipient exclusion and milestone/disbursement terms before publication."},
        "benefit_summary":{"types":["grant","prototype_support","mentorship"],"summary":"Grant-in-aid up to Rs. 50 lakh for up to 18 months for eligible biotechnology proof-of-concept work, subject to the current call and guidelines."},
        "benefit_type":"grant",
        "benefit_label":"Biotechnology proof-of-concept grant",
        "amount_max":5000000,
        "benefit_conditions":{"biotechnology_focus_required":true,"current_call_required":true,"proof_of_concept_stage_required":true},
        "requirement":"Biotechnology innovation with proof-of-concept potential",
        "requirement_description":"The proposal must be a biotechnology innovation with a credible path to proof of concept and commercialisation, and satisfy the current BIG call conditions.",
        "rules":{"all":[{"field":"biotechnology_innovation","operator":"equals","value":true},{"field":"proof_of_concept_stage","operator":"equals","value":true},{"field":"current_big_call_open","operator":"equals","value":true},{"field":"prior_big_award","operator":"equals","value":false}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Check the current BIG call","description":"Review the official BIRAC page for call dates, revised eligibility, proposal formats and current BIG Partners.","url":"https://www.birac.nic.in/big.php"},{"title":"Submit the online proposal","description":"Register as a BIG user and submit the proof-of-concept proposal and required declarations through the official route.","url":"https://www.birac.nic.in/big.php"}],
        "window_type":"recurring",
        "window_label":"Recurring call normally announced twice yearly; verify the current call notice and deadline.",
        "window_evidence":{"source_url":"https://www.birac.nic.in/big.php","anchor":"Call announcement calendar"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, official_url)
    select
      item->>'authority', 'central', 'Government of India', item->>'authority_url'
    where not exists (
      select 1 from public.authorities existing_authority
      where existing_authority.name = item->>'authority'
    )
    returning id into authority_id;
    if authority_id is null then
      select id into authority_id from public.authorities where name = item->>'authority' limit 1;
    end if;

    seed_opportunity_id := null;
    insert into public.opportunities
      (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (
      item->>'slug', item->>'name', item->>'type', 'in_review', authority_id,
      '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url'
    )
    on conflict (slug) do update set
      name = excluded.name,
      authority_id = excluded.authority_id,
      canonical_url = excluded.canonical_url
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then
      select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1;
    end if;

    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis,
       eligibility, application, fine_print, benefit_summary,
       last_verified_at, completeness, confidence, review_status)
    values (
      seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis',
      item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary',
      now(), 0.82, 0.80, 'in_review'
    )
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov
      where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where id = seed_opportunity_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (
      select 1 from public.opportunity_sources os
      where os.opportunity_version_id = version_id and os.source_url = item->>'source_url'
    );

    insert into public.opportunity_benefits
      (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select
      version_id, item->>'benefit_type', item->>'benefit_label',
      case when item ? 'amount_max' then (item->>'amount_max')::numeric else null end,
      case when item ? 'percentage' then (item->>'percentage')::numeric else null end,
      item->'benefit_conditions'
    where not exists (
      select 1 from public.opportunity_benefits ob
      where ob.opportunity_version_id = version_id and ob.label = item->>'benefit_label'
    );

    insert into public.opportunity_requirements
      (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'other', item->>'requirement', item->>'requirement_description', true
    where not exists (
      select 1 from public.opportunity_requirements oq
      where oq.opportunity_version_id = version_id and oq.name = item->>'requirement'
    );

    insert into public.eligibility_rule_sets
      (opportunity_version_id, rules, source_evidence, reviewed)
    select version_id, item->'rules', jsonb_build_array(jsonb_build_object('source_url', item->>'source_url', 'anchor', item->>'source_anchor')), false
    where not exists (
      select 1 from public.eligibility_rule_sets er
      where er.opportunity_version_id = version_id
    );

    insert into public.opportunity_steps
      (opportunity_version_id, step_number, title, description, official_url)
    select version_id, step_number, step->>'title', step->>'description', step->>'url'
    from (
      select (row_number() over ())::integer as step_number, step
      from jsonb_array_elements(item->'steps') as steps(step)
    ) numbered_steps
    where not exists (
      select 1 from public.opportunity_steps os
      where os.opportunity_version_id = version_id
        and os.step_number = numbered_steps.step_number
    );

    insert into public.opportunity_windows
      (opportunity_version_id, window_type, label, opens_at, closes_at, source_evidence)
    select
      version_id, item->>'window_type', item->>'window_label',
      case when item ? 'opens_at' then (item->>'opens_at')::date else null end,
      case when item ? 'closes_at' then (item->>'closes_at')::date else null end,
      item->'window_evidence'
    where not exists (
      select 1 from public.opportunity_windows ow
      where ow.opportunity_version_id = version_id
    );

    insert into public.review_tasks (opportunity_version_id, task_type, status)
    select version_id, 'publish', 'open'
    where not exists (
      select 1 from public.review_tasks rt
      where rt.opportunity_version_id = version_id
        and rt.task_type = 'publish'
        and rt.status in ('open', 'in_review')
    );
  end loop;
end $$;
