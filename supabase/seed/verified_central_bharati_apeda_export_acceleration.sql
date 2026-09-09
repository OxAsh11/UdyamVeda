-- APEDA BHARATI export-enablement acceleration programme.
-- The pilot application window is closed. This record preserves the official
-- route and fine print without presenting acceleration as a grant or funding
-- entitlement.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('APEDA official portal', 'https://apeda.gov.in/', 'authority_portal', 'central', 'monthly', 1, true, 'Official APEDA authority portal for the BHARATI implementing agency.'),
  ('APEDA BHARATI programme home', 'https://apeda.gov.in/bharati/index.html', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Official APEDA BHARATI programme home with announcements and links to objectives, structure, benefits, application and evaluation pages.'),
  ('APEDA BHARATI eligibility', 'https://apeda.gov.in/bharati/Who_Can_Apply.html', 'eligibility', 'central', 'monthly', 1, true, 'Official APEDA eligibility page covering agri-food startups, export-enabling technology startups, SPS solution providers, exporters, FPCs and individual innovators.'),
  ('APEDA BHARATI application process', 'https://apeda.gov.in/bharati/How_to_Apply.html', 'application_guidance', 'central', 'weekly', 1, true, 'Official APEDA application and documentation page; category questionnaires are linked there and are not treated as independent authority sources.'),
  ('APEDA BHARATI terms and conditions', 'https://apeda.gov.in/bharati/Terms_Conditions.html', 'terms_and_conditions', 'central', 'monthly', 1, true, 'Official APEDA terms covering application cap, cohort, costs, paid mentorship, attendance, data use, selection discretion and no-funding guarantee.'),
  ('APEDA BHARATI objectives', 'https://apeda.gov.in/bharati/Objective_Initiative.html', 'programme_objectives', 'central', 'monthly', 1, true, 'Official APEDA objectives for high-value agri-food products, export technology, SPS solutions, market access and investor readiness.'),
  ('APEDA BHARATI programme structure', 'https://apeda.gov.in/bharati/Program_Structure.html', 'programme_structure', 'central', 'monthly', 1, true, 'Official APEDA multi-phase structure, screening, business challenge, 120-hour acceleration and investor-outreach boundaries.'),
  ('APEDA BHARATI focus areas', 'https://apeda.gov.in/bharati/Focus_Areas.html', 'focus_areas', 'central', 'monthly', 1, true, 'Official APEDA focus areas and scheduled agri-food/export/SPS solution categories.'),
  ('APEDA BHARATI programme benefits', 'https://apeda.gov.in/bharati/Program_Benefits.html', 'programme_benefits', 'central', 'monthly', 1, true, 'Official APEDA benefits page covering knowledge, market linkages, certification guidance, trade events and investor exposure.'),
  ('APEDA BHARATI timelines', 'https://apeda.gov.in/bharati/Timelines.html', 'programme_window', 'central', 'weekly', 1, true, 'Official APEDA page states the application window is closed and later phase dates are to be intimated.'),
  ('APEDA BHARATI evaluation', 'https://apeda.gov.in/bharati/Evaluation.html', 'evaluation', 'central', 'monthly', 1, true, 'Official APEDA evaluation page describing the 20-criterion scoring framework, 200-to-100 cohort selection and results route.'),
  ('Startup India Government Schemes Playbook BHARATI entry', 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'discovery_playbook', 'central', 'monthly', 1, true, 'Official Startup India discovery entry; APEDA pages control the operational record.')
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
        "slug":"apeda-bharati-export-enablement-acceleration",
        "name":"APEDA BHARATI Export Enablement Acceleration",
        "type":"accelerator",
        "lifecycle_status":"closed",
        "authority":"Agricultural and Processed Food Products Export Development Authority (APEDA)",
        "authority_url":"https://apeda.gov.in/",
        "canonical_url":"https://apeda.gov.in/bharati/index.html",
        "source_url":"https://apeda.gov.in/bharati/index.html",
        "source_kind":"official_implementing_agency_portal",
        "source_title":"APEDA BHARATI programme home",
        "source_anchor":"About BHARATI; application process; programme announcements and official subpages",
        "summary":"APEDA's export-enablement acceleration programme for innovative agri-food startups, export-enabling technology companies, FPCs, exporters and SPS solution providers, with a closed pilot application window.",
        "objective":"Help Indian agri-food and export-technology ventures become export-ready through structured acceleration, market intelligence, compliance and certification guidance, market linkages, mentorship and best-effort investor exposure.",
        "legal_basis":"APEDA BHARATI initiative pages, programme structure and terms and conditions published by the Agricultural and Processed Food Products Export Development Authority; the applicable future cohort notice controls the live route.",
        "eligibility":{"entity_types":["agri_food_startup","export_enabling_technology_startup","sps_solution_startup","farmer_producer_company","apeda_registered_exporter","individual_researcher","innovator","solo_self_employed_entrepreneur"],"lifecycle_stages":["idea","prototype","mvp","validation","early_traction","scaling","export_readiness"],"industries":["agri_food","food_processing","agriculture","horticulture","cold_chain","post_harvest_technology","export_logistics","traceability","sps_compliance","quality_assurance","packaging","agri_fintech","market_intelligence"],"locations":["India"],"conditions":["applicant must apply under only one BHARATI category relevant to the business or solution","startup, exporter and FPC routes must satisfy the applicable Indian-registration and category conditions on the current APEDA page","a startup must generally be a private limited company, registered partnership or LLP, be no more than 5 years old, have not exceeded INR 10 crore turnover in any financial year, not be formed by splitting or reconstruction, and pursue innovation or a scalable model","participants must demonstrate export intent focused on international markets, APEDA scheduled agri-food products, export-enabling technology or SPS risk/compliance solutions","high-value agri-food and export-enabling technology applicants must have an MVP or commercialized product; SPS solution applicants may qualify with an idea, research paper, MVP or validated solution under the stated category","shortlisted or selected non-APEDA applicants must obtain the applicable APEDA RCMC before the acceleration phase; individual SPS solution applicants are expressly exempt from the merchant RCMC requirement","screening, business challenge, cohort selection and APEDA discretion are required; submission is not acceptance"],"exclusions":["the pilot application window is closed and later phase dates are to be intimated; no current open application window is asserted","BHARATI does not provide or guarantee direct funding, grants, investment or automatic access to other Government schemes","the 120-hour acceleration, 3 one-hour mentorship sessions, trade events, buyer connections, exposure visits and investor interactions are programme opportunities subject to selection, participation, availability and stated terms","only one category may be selected and a maximum of one representative may participate for an entity","APEDA may require INR 5,000 for the optional personalized one-to-one mentorship sessions; participants otherwise receive only the common acceleration content","applicants bear application, travel, attendance, infrastructure and related participation costs and must satisfy attendance, conduct, reporting, data-use and disclosure conditions"],"thresholds":{"startup_age_years_max":5,"startup_turnover_max_inr":100000000,"pilot_screened_application_cap":1000,"pilot_final_cohort_max":100,"pilot_shortlist_max":200,"acceleration_hours":120,"optional_mentorship_sessions":3,"optional_mentorship_fee_inr":5000,"one_representative_max":1},"unknown_handling":"needs_information"},
        "application":{"portal":"https://apeda.gov.in/bharati/How_to_Apply.html","route":"Select exactly one BHARATI category, complete the category questionnaire linked by APEDA, submit the supporting documents and corporate/innovation/export dossier, complete screening and any business challenge, and follow the selected-cohort acceleration and reporting requirements.","selection":"APEDA applies category-specific screening and a 20-criterion scoring framework, shortlists up to 200 applicants for the business challenge, and selects up to 100 for the pilot cohort; selection is discretionary and not guaranteed.","fees":"APEDA terms state that participants bear application and participation costs; optional personalized one-to-one mentorship costs INR 5,000, while the common 120-hour acceleration content does not carry that stated mentorship fee.","documents":["IEC if applicable","company or FPC registration details","MSME registration if applicable","GST and PAN if applicable","audited or provisional financials for FY 2024-25 if applicable","promoter or farmer-member profiles","corporate presentation covering product, market, traction, infrastructure, export readiness and financial snapshot","individual identity, profile/CV and project evidence for the individual SPS category"],"applicant_note":"UdyamVeda can prepare the category, export-readiness and document checklist, but cannot submit APEDA forms, impersonate applicants, guarantee selection, or represent acceleration as funding."},
        "fine_print":{"support_model":"BHARATI is an APEDA export-enablement acceleration programme rather than a direct grant or investment scheme.","focus_areas":["high-value and innovative agri-food products","technology-led export-enablement solutions","SPS risks and compliance barriers"],"programme_phases":["application and screening","business challenge and cohort selection","120-hour structured acceleration","best-effort investor or Government-agency outreach"],"benefit_boundary":"Benefits include guidance, knowledge, market and buyer linkages, certification inputs, possible exposure visits, optional paid mentorship and potential investor pitch opportunities. APEDA does not provide or guarantee funding, grants, investment or automatic access to other Government schemes.","selection_boundary":"The official terms state that APEDA may modify programme structure, timelines and selection criteria and that selection decisions are discretionary.","current_window":"APEDA's official timelines page states Application Window Closed; the pilot structure references September 2025 to June 2026 with dates subject to change. A future cohort must be separately verified.","data_and_ip":"APEDA terms include data-use and partner-sharing consent, confidentiality limitations, possible NDA requirements, applicant responsibility for IP protection and promotional-use provisions.","participation":"One representative per entity, mandatory participation and attendance for completion certification, optional paid 1-to-1 mentorship, participant-borne travel/event/technology costs and one-year post-programme progress updates apply under the reviewed terms.","review_note":"Recheck the current APEDA BHARATI page, next cohort notice, category questionnaire, application window, RCMC timing, documentary checklist, fee, attendance, privacy, IP, selection, investor-outreach and no-funding terms before any actionable recommendation."},
        "benefit_summary":{"types":["accelerator","training","mentorship","market_access","export_support","investor_access"],"summary":"Selected BHARATI participants may receive structured export-enablement acceleration, APEDA knowledge and market inputs, certification and buyer-linkage guidance, potential events/exposure, optional paid mentorship and best-effort investor outreach; no direct funding or grant is promised.","separate_value_buckets":true},
        "benefit_type":"accelerator",
        "benefit_label":"APEDA BHARATI 120-hour export-enablement acceleration",
        "benefit_conditions":{"selection_required":true,"current_cohort_required":true,"application_window_required":true,"one_category_only":true,"one_representative_max":1,"attendance_required_for_certificate":true,"direct_funding_not_provided":true},
        "requirement":"Export-focused agri-food, export-technology or SPS solution fit with category-specific registration, product/idea evidence and APEDA screening eligibility",
        "requirement_description":"Prepare the category-specific application, Indian/entity or individual records, export-intent evidence, product/MVP/research/SPS evidence, promoter or researcher profiles, corporate presentation, market and traction material, financials where applicable, APEDA RCMC where required and current declarations.",
        "rules":{"any":[{"all":[{"field":"high_value_agri_food_startup_verified","operator":"equals","value":true},{"field":"startup_definition_under_apeda_verified","operator":"equals","value":true},{"field":"mvp_or_commercialized_product_verified","operator":"equals","value":true}]},{"all":[{"field":"export_enabling_technology_startup_verified","operator":"equals","value":true},{"field":"startup_definition_under_apeda_verified","operator":"equals","value":true},{"field":"mvp_or_commercialized_solution_verified","operator":"equals","value":true}]},{"all":[{"field":"sps_solution_provider_verified","operator":"equals","value":true},{"field":"sps_idea_research_mvp_or_validated_solution_verified","operator":"equals","value":true}]}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Choose one BHARATI category","description":"Select exactly one category: high-value/innovative agri-food, export-enabling technology/services, or SPS-risk and compliance solutions. Confirm the product or solution is export-focused.","url":"https://apeda.gov.in/bharati/Focus_Areas.html"},{"title":"Verify applicant route and current window","description":"Check the official APEDA eligibility and timelines pages. The reviewed pilot window is closed; do not treat the historical form links as a live application without a new official notice.","url":"https://apeda.gov.in/bharati/Timelines.html"},{"title":"Prepare the category dossier","description":"Assemble incorporation/FPC/individual records, product or MVP/research evidence, export intent, market, team, financial, compliance, presentation and RCMC evidence where applicable.","url":"https://apeda.gov.in/bharati/How_to_Apply.html"},{"title":"Submit only through the current APEDA route","description":"Use the current category questionnaire and official APEDA instructions when a new window opens; retain screening, challenge, selection, participation and reporting records.","url":"https://apeda.gov.in/bharati/How_to_Apply.html"}],
        "window_type":"closed",
        "window_label":"Closed: APEDA's official timelines page states the application window is closed. The pilot structure references September 2025 to June 2026 with later phase dates to be intimated; verify a future cohort before actioning.",
        "window_evidence":{"source_url":"https://apeda.gov.in/bharati/Timelines.html","anchor":"Application Window Closed; screening, business challenge, structured acceleration and investor outreach dates to be intimated"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Commerce and Industry', 'Agricultural and Processed Food Products Export Development Authority (APEDA)', item->>'authority_url'
    where not exists (select 1 from public.authorities where name = item->>'authority')
    returning id into authority_id;
    if authority_id is null then
      select id into authority_id from public.authorities where name = item->>'authority' limit 1;
      update public.authorities set official_url = item->>'authority_url' where id = authority_id;
    end if;

    seed_opportunity_id := null;
    insert into public.opportunities (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (item->>'slug', item->>'name', item->>'type', item->>'lifecycle_status', authority_id, '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, status = excluded.status, authority_id = excluded.authority_id, canonical_url = excluded.canonical_url
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1; end if;

    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.92, 0.89, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1; end if;
    update public.opportunities set current_version_id = version_id, status = item->>'lifecycle_status' where id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true),
      (version_id, 'https://apeda.gov.in/bharati/Who_Can_Apply.html', 'eligibility', 'APEDA BHARATI eligibility', 'Eligibility for startups, FPCs, exporters, SPS solution providers and individual innovators', now(), false),
      (version_id, 'https://apeda.gov.in/bharati/How_to_Apply.html', 'application_guidance', 'APEDA BHARATI application process', 'Category application, APEDA RCMC and supporting documentation', now(), false),
      (version_id, 'https://apeda.gov.in/bharati/Terms_Conditions.html', 'terms_and_conditions', 'APEDA BHARATI terms and conditions', 'Application cap, paid mentorship, costs, participation, no-funding and selection boundaries', now(), false),
      (version_id, 'https://apeda.gov.in/bharati/Objective_Initiative.html', 'programme_objectives', 'APEDA BHARATI objectives', 'Export enablement, market access, SPS and investor-readiness objectives', now(), false),
      (version_id, 'https://apeda.gov.in/bharati/Program_Structure.html', 'programme_structure', 'APEDA BHARATI programme structure', 'Closed application window, screening, 200 shortlist, 100 cohort and 120-hour acceleration', now(), false),
      (version_id, 'https://apeda.gov.in/bharati/Focus_Areas.html', 'focus_areas', 'APEDA BHARATI focus areas', 'High-value agri-food, export technology and SPS solution categories', now(), false),
      (version_id, 'https://apeda.gov.in/bharati/Program_Benefits.html', 'programme_benefits', 'APEDA BHARATI programme benefits', 'Knowledge, market linkages, certification guidance, events and investor exposure', now(), false),
      (version_id, 'https://apeda.gov.in/bharati/Timelines.html', 'programme_window', 'APEDA BHARATI timelines', 'Application Window Closed and later phase dates to be intimated', now(), false),
      (version_id, 'https://apeda.gov.in/bharati/Evaluation.html', 'evaluation', 'APEDA BHARATI evaluation', '20-criterion scoring, 200 shortlist and final cohort selection', now(), false),
      (version_id, 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'discovery_playbook', 'Startup India Government Schemes Playbook BHARATI entry', 'BHARATI APEDA export-enablement discovery entry', now(), false)
    on conflict do nothing;
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
