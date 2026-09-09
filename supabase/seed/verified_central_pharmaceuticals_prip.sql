-- Promotion of Research and Innovation in Pharma MedTech (PRIP) Sector.
-- Component A and Component B remain separate because their beneficiaries,
-- application routes and benefit logic differ.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('PRIP Department scheme page', 'https://pharma-dept.gov.in/schemes/scheme-promotion-research-and-innovation-pharma-medtech-sector-prip', 'scheme_page', 'central', 'weekly', 1, true, 'Current PRIP scheme documents, CoE scope and priority areas require review.'),
  ('PRIP official scheme portal', 'https://prip.pharma-dept.gov.in/', 'application_portal', 'central', 'daily', 1, true, 'Current PRIP application state, support toolkit and call state require review.'),
  ('PRIP current scheme guidelines', 'https://prip.pharma-dept.gov.in/resources/21.%20Guidelines.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official 1 October 2025 PRIP guidelines for Components A and B, priority areas, assistance and milestones.'),
  ('PRIP legacy guideline URL retained for historical step references', 'https://pharma-dept.gov.in/sites/default/files/Scheme_Guidelines_Final.pdf', 'historical_guideline', 'central', 'monthly', 1, true, 'Historical URL retained only because older step references may resolve to it; current review must use the PRIP portal guideline PDF above.'),
  ('Department of Pharmaceuticals PRIP FAQ page', 'https://www.pharma-dept.gov.in/important-document/frequently-asked-questions-faqs-regarding-promotion-research-and-innovation', 'faq', 'central', 'weekly', 1, true, 'Official page linking the current PRIP FAQ; eligibility, TRL, assistance and call terms require review.')
on conflict (url) do nothing;

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
        "slug":"prip-component-a-niper-centres-of-excellence",
        "name":"PRIP Component A - NIPER Centres of Excellence",
        "type":"research_infrastructure_support",
        "lifecycle_status":"active",
        "authority":"Department of Pharmaceuticals",
        "authority_url":"https://pharma-dept.gov.in/",
        "canonical_url":"https://pharma-dept.gov.in/schemes/scheme-promotion-research-and-innovation-pharma-medtech-sector-prip",
        "source_url":"https://pharma-dept.gov.in/schemes/scheme-promotion-research-and-innovation-pharma-medtech-sector-prip",
        "source_kind":"scheme_page",
        "source_title":"PRIP official scheme portal",
        "source_anchor":"Department scheme page: PRIP scheme guidelines, Gazette notification and additional PRIP portal resources",
        "summary":"PRIP Component A establishes Centres of Excellence at seven NIPERs to build focused research capacity in priority Pharma and MedTech areas and support industry-academia innovation infrastructure.",
        "objective":"Strengthen national research infrastructure and a pool of scientists in selected Pharma and MedTech priority areas.",
        "legal_basis":"PRIP scheme notification and guidelines dated 1 October 2025 under the Department of Pharmaceuticals.",
        "eligibility":{"entity_types":["NIPER","central_government_institution","research_institution","academic_institution","industry_academic_partner"],"lifecycle_stages":["research","prototype","validation","scaling"],"industries":["pharmaceuticals","biopharmaceuticals","medical_devices","medtech_research","drug_discovery"],"locations":["India"],"conditions":["the proposal is within a NIPER Centre of Excellence or an eligible approved collaboration route","the work fits an identified PRIP priority area and approved CoE programme","the project has research, infrastructure, collaboration, milestones and reporting evidence","a private company or startup participates only through the approved collaboration/partner route"],"thresholds":{"total_prip_outlay_inr":500000000000,"component_a_outlay_inr":70000000000,"niper_centres":7,"scheme_period":"FY 2023-24 to FY 2027-28"},"unknown_handling":"needs_information"},
        "exclusions":["direct unrestricted startup grant outside a CoE or approved collaboration","research outside the PRIP priority areas or approved CoE plan","the total PRIP outlay treated as a Component A applicant entitlement","private applicants represented as independent Component A beneficiaries without the approved NIPER route"],
        "application":{"portal":"https://prip.pharma-dept.gov.in/","route":"Identify the relevant NIPER CoE and approved collaboration route, prepare the research/infrastructure and milestone dossier, and follow the Department/CoE process","applicant_note":"UdyamVeda can help a startup map an academic collaboration and prepare a readiness checklist; it cannot promise a CoE partnership or Government approval","selection":"Department/NIPER programme appraisal, collaboration approval, milestone monitoring and research-output reporting","fees":"Confirm institutional, testing, collaboration and project charges"},
        "fine_print":{"beneficiary":"Component A is CoE and NIPER infrastructure/programme support; a startup generally benefits through an approved collaboration or access route rather than receiving an automatic direct grant.","priority_areas":"The guidelines identify focused Pharma and MedTech research areas; the current CoE programme and collaboration call control.","scheme_outlay":"The PRIP portal describes ₹700 crore for seven NIPER CoEs within total PRIP outlay of ₹5,000 crore; outlay is not an individual entitlement.","review_note":"Confirm the relevant NIPER, CoE scope, current collaboration route, project ownership/IP terms, eligible costs, milestones, access and reporting conditions before publication."},
        "benefit_summary":{"types":["research_infrastructure","centre_of_excellence","industry_academia_collaboration"],"summary":"Potential access to PRIP-supported NIPER Centres of Excellence and approved collaboration infrastructure; not a general direct startup grant.","separate_value_buckets":true},
        "benefit_type":"research_infrastructure_support",
        "benefit_label":"PRIP NIPER Centre of Excellence collaboration and research infrastructure",
        "benefit_conditions":{"niper_or_coe_route_required":true,"priority_area_required":true,"approved_collaboration_required":true,"milestone_reporting_required":true},
        "requirement":"Relevant NIPER CoE and approved Pharma/MedTech research collaboration",
        "requirement_description":"Prepare startup/institution profile, research problem, priority-area mapping, IP and collaboration proposal, milestones, budget, facilities and evidence plan.",
        "rules":{"all":[{"field":"relevant_prip_niper_coe_identified","operator":"equals","value":true},{"field":"priority_area_research_project_identified","operator":"equals","value":true},{"field":"approved_collaboration_route_confirmed","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Identify the priority area and NIPER route","description":"Map the research need to a PRIP priority area and identify the relevant NIPER CoE or approved academic partner.","url":"https://pharma-dept.gov.in/sites/default/files/Scheme_Guidelines_Final.pdf"},{"title":"Prepare collaboration and IP terms","description":"Document research objectives, roles, IP, data, facilities, milestones, budget and expected outputs.","url":"https://prip.pharma-dept.gov.in/"},{"title":"Confirm the active route","description":"Check the current PRIP portal and Department page for the applicable CoE or collaboration call and submission route.","url":"https://pharma-dept.gov.in/schemes/scheme-promotion-research-and-innovation-pharma-medtech-sector-prip"}],
        "window_type":"programme_route",
        "window_label":"Component A is a programme/CoE route within PRIP FY 2023-24 to FY 2027-28; the startup-facing collaboration route and current CoE availability must be confirmed from the official portal.",
        "window_evidence":{"source_url":"https://prip.pharma-dept.gov.in/","anchor":"PRIP portal: current call state and application/support routes"},
        "review_note":"Confirm current CoE and collaboration availability before publication."
      },
      {
        "slug":"prip-component-b-industry-startup-rd-projects",
        "name":"PRIP Component B - Industry, Startup and MSME Pharma-MedTech R&D Projects",
        "type":"research_grant",
        "lifecycle_status":"active",
        "authority":"Department of Pharmaceuticals",
        "authority_url":"https://pharma-dept.gov.in/",
        "canonical_url":"https://prip.pharma-dept.gov.in/",
        "source_url":"https://prip.pharma-dept.gov.in/resources/21.%20Guidelines.pdf",
        "source_kind":"faq",
        "source_title":"Department of Pharmaceuticals PRIP FAQ page",
        "source_anchor":"PRIP FAQ download and official application guidance for eligibility, TRL routes and financial assistance",
        "summary":"Financial assistance for industry, startups and MSMEs developing or validating Pharma and MedTech products and technologies in defined priority areas, with separate early-stage and later-stage TRL routes.",
        "objective":"Accelerate discovery, development, validation and commercialization of innovative medicines, medical devices and related technologies while strengthening industry-academia collaboration.",
        "legal_basis":"PRIP scheme notification and revised guidelines dated 1 October 2025, with current FAQ and portal application guidance.",
        "eligibility":{"entity_types":["startup","msme","company","pharmaceutical_company","medical_device_company","research_institution","industry_academic_consortium"],"lifecycle_stages":["prototype","validation","growth","scaling"],"industries":["pharmaceuticals","new_medicines","complex_generics","biosimilars","medical_devices","diagnostics","medtech_software","drug_discovery"],"locations":["India"],"conditions":["the project fits a PRIP priority area: new medicines, complex generics/biosimilars, precision medicine, medical devices, orphan drugs or antimicrobial resistance","the applicant and project satisfy the current early-stage or later-stage TRL route","the applicant can meet co-funding and financial-closure conditions where applicable","the proposal has milestones within the scheme period even if the longer R&D journey extends beyond it","the application is submitted through the official PRIP portal and any academic collaboration is documented"],"thresholds":{"total_prip_outlay_inr":500000000000,"component_b_outlay_inr":420000000000,"scheme_period":"FY 2023-24 to FY 2027-28","early_stage_trl":"TRL 1, 2 or 3 completed to advance up to TRL 5","early_stage_up_to_inr":100000000,"early_stage_full_assistance_percent":100,"early_stage_above_1_to_5_crore_assistance_percent":50,"later_stage_trl":"TRL 4, 5 or 6 completed to advance higher","later_stage_assistance_percent":35,"later_stage_cap_inr_per_project":10000000000,"strategic_priority_assistance_percent":50,"financial_closure_weeks":8},"unknown_handling":"needs_information"},
        "exclusions":["projects outside the six priority areas","early-stage applications from entities other than startups/MSMEs where the current FAQ restricts the route","assistance treated as an unconditional grant or revenue entitlement","co-funding and financial closure omitted from the application","milestones outside the approved scheme period without an eligible in-period plan","application submitted outside the official PRIP portal"],
        "application":{"portal":"https://prip.pharma-dept.gov.in/","route":"Create the entity-portal application, choose early-stage or later-stage route, map the project to a priority area and TRL, prepare the technical/financial/IP/academic-collaboration dossier, and submit through the official portal","applicant_note":"UdyamVeda can help startups and MSMEs structure the PRIP application, TRL evidence, co-funding plan and milestone checklist; it cannot submit, authenticate through Entity Locker or represent the applicant","selection":"Call, technical evaluation, conditional selection, eight-week financial closure where required, funding agreement, milestone disbursement and monitoring","fees":"Confirm portal, testing, regulatory, academic, professional and project costs; the official route controls any fees"},
        "fine_print":{"early_stage":"The PRIP portal describes early-stage support for startups/MSMEs only: up to ₹1 crore fully assisted, and above ₹1 crore to ₹5 crore at up to 50% assistance.","later_stage":"The portal describes later-stage industry support at up to 35% of approved project cost capped at ₹100 crore per project; strategic-priority innovations may receive up to 50% subject to the guidelines.","co_funding":"The FAQ requires financial closure and documentary evidence of the applicant share; the portal states that the second call is opening soon and early-stage applications will use a two-step concept-note/detailed-application process.","priority_areas":["new chemical medicines, new biological entities and phytopharmaceuticals","complex generics and biosimilars","precision medicine","novel medical devices","orphan drugs","antimicrobial resistance"],"academic_collaboration":"Academic collaboration may receive preference subject to proposal quality and partner credentials; project-linked technology transfer and eligible academic infrastructure rules require guideline review.","review_note":"Confirm current call dates, entity eligibility, TRL evidence, strategic-priority definition, approved-cost calculation, co-funding, eight-week financial closure, IP/data, regulatory, milestone and recovery conditions before publication."},
        "benefit_summary":{"types":["research_grant","innovation_support","industry_academia_collaboration"],"summary":"Potential PRIP Component B financial assistance for eligible startup, MSME and industry Pharma/MedTech R&D projects, with assistance varying by TRL, project stage and strategic priority; do not combine the different assistance buckets.","separate_value_buckets":true},
        "benefit_type":"research_grant",
        "benefit_label":"PRIP Pharma-MedTech R&D project assistance",
        "benefit_conditions":{"priority_area_required":true,"trl_route_required":true,"official_portal_required":true,"co_funding_or_financial_closure_may_apply":true,"milestone_disbursement":true,"project_cap_applies":true},
        "requirement":"Priority-area R&D project with TRL, milestone and co-funding evidence",
        "requirement_description":"Prepare entity/startup/MSME status, problem and product dossier, TRL evidence, priority-area mapping, technical plan, regulatory/IP/data plan, budget, co-funding and milestone evidence.",
        "rules":{"all":[{"field":"eligible_prip_priority_area_identified","operator":"equals","value":true},{"field":"trl_stage_and_route_confirmed","operator":"equals","value":true},{"field":"official_prip_portal_application_route_confirmed","operator":"equals","value":true},{"field":"cofunding_or_financial_closure_plan_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Select the priority area and TRL route","description":"Choose an eligible Pharma/MedTech priority area and determine whether the project is early-stage or later-stage under the current FAQ and guidelines.","url":"https://prip.pharma-dept.gov.in/"},{"title":"Prepare technical and evidence dossier","description":"Document product/technology, TRL, novelty, regulatory path, IP/data, team, milestones, academic partner and commercialization plan.","url":"https://pharma-dept.gov.in/sites/default/files/Scheme_Guidelines_Final.pdf"},{"title":"Build the co-funding plan","description":"Prepare the applicant share and documentary financial-closure evidence; do not treat the assistance cap as the total project budget.","url":"https://prip.pharma-dept.gov.in/resources/12.%20FAQ.pdf"},{"title":"Submit through the official portal","description":"Use the PRIP portal and current call; early-stage applicants should be ready for the two-step concept-note and detailed-application process described on the portal.","url":"https://prip.pharma-dept.gov.in/auth/login"}],
        "window_type":"call_for_applications",
        "window_label":"The PRIP portal currently states that a second call is opening soon; technical evaluation is shown as live, and early-stage applications will use a two-step process. Treat the next application deadline as unconfirmed until the official call is published.",
        "window_evidence":{"source_url":"https://prip.pharma-dept.gov.in/","anchor":"Current portal state: Second Call for Applications opening soon; early-stage two-step process"},
        "review_note":"Confirm the live call notice, deadline and current application form before publication."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Chemicals and Fertilizers', 'Department of Pharmaceuticals', item->>'authority_url'
    where not exists (select 1 from public.authorities where name = item->>'authority')
    returning id into authority_id;
    if authority_id is null then select id into authority_id from public.authorities where name = item->>'authority' limit 1; end if;
    seed_opportunity_id := null;
    insert into public.opportunities (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (item->>'slug', item->>'name', item->>'type', coalesce(item->>'lifecycle_status', 'in_review'), authority_id, '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, authority_id = excluded.authority_id, canonical_url = excluded.canonical_url, status = excluded.status
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1; end if;
    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.91, 0.88, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1; end if;
    update public.opportunities set current_version_id = version_id, status = coalesce(item->>'lifecycle_status', 'in_review') where id = seed_opportunity_id;
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true) on conflict do nothing;
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, 'https://prip.pharma-dept.gov.in/resources/21.%20Guidelines.pdf', 'guideline', 'PRIP revised scheme guidelines', 'Components, priority areas and assistance', now(), false),
      (version_id, 'https://prip.pharma-dept.gov.in/', 'application_portal', 'Official PRIP application portal', 'Current call state and application toolkit', now(), false),
      (version_id, 'https://pharma-dept.gov.in/schemes/scheme-promotion-research-and-innovation-pharma-medtech-sector-prip', 'scheme_page', 'Department of Pharmaceuticals PRIP scheme page', 'Official scheme documents and route', now(), false)
    on conflict do nothing;
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, conditions) values (version_id, item->>'benefit_type', item->>'benefit_label', item->'benefit_conditions') on conflict do nothing;
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required) values (version_id, 'research', item->>'requirement', item->>'requirement_description', true) on conflict do nothing;
    insert into public.eligibility_rule_sets (opportunity_version_id, rules, source_evidence, reviewed) values (version_id, item->'rules', jsonb_build_array(jsonb_build_object('source_url', item->>'source_url', 'anchor', item->>'source_anchor')), false) on conflict do nothing;
    insert into public.opportunity_steps (opportunity_version_id, step_number, title, description, official_url) select version_id, row_number() over ()::integer, step->>'title', step->>'description', step->>'url' from jsonb_array_elements(item->'steps') as steps(step) on conflict do nothing;
    insert into public.opportunity_windows (opportunity_version_id, window_type, label, source_evidence) values (version_id, item->>'window_type', item->>'window_label', item->'window_evidence') on conflict do nothing;
    insert into public.review_tasks (opportunity_version_id, task_type, status) values (version_id, 'publish', 'open') on conflict do nothing;
  end loop;
end $$;
