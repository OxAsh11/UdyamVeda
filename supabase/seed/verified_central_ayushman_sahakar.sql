-- Ayushman Sahakar: NCDC financial-assistance framework for cooperative
-- healthcare, AYUSH, health education, insurance and digital-health projects.
-- It is project credit support subject to appraisal, security and repayment;
-- it is not a universal healthcare grant.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('NCDC Ayushman Sahakar scheme document', 'https://ncdc.in/documents/other/Ayushman-sahakar20102020.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official NCDC Ayushman Sahakar document covering eligible cooperative healthcare activities, loan period, interest incentive, security, funding pattern and subsidy convergence.'),
  ('NCDC Ayushman Sahakar scheme compendium', 'https://www.ncdc.in/documents/booklet/2609240524English-Compendium-as-on-22.05.2024.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official NCDC compendium recording Ayushman Sahakar eligibility, 8-year loan period, funding pattern and women-majority interest incentive.'),
  ('NCDC official portal', 'https://www.ncdc.in/', 'agency_portal', 'central', 'weekly', 1, true, 'Official NCDC portal for current scheme, loan application, financing and rate information.'),
  ('NCDC current scheme index', 'https://www.ncdc.in/index.jsp?page=scheme', 'agency_portal', 'central', 'monthly', 1, true, 'Current NCDC scheme index and loan-application navigation; individual activity forms and current terms require confirmation.'),
  ('NCDC common loan application route', 'https://ncdc.in/index.jsp?page=common-application%3Den', 'application_portal', 'central', 'weekly', 1, true, 'Current NCDC common loan application route for selecting activity/purpose and loan type and downloading the applicable form.'),
  ('NCDC current application FAQ', 'https://www.ncdc.in/index.jsp?page=faq%3Dhi', 'agency_portal', 'central', 'monthly', 1, true, 'Current NCDC FAQ describing State Government/direct application channels and general loan-period guidance.'),
  ('Ministry of Cooperation programmes and schemes', 'https://www.cooperation.gov.in/en/programmes-schemes', 'ministry_portal', 'central', 'monthly', 1, true, 'Official Ministry of Cooperation page describing cooperative-sector NCDC assistance and programme navigation.')
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
        "slug":"ayushman-sahakar-cooperative-healthcare-support",
        "name":"Ayushman Sahakar - Cooperative Healthcare and Health-Education Support",
        "type":"credit_subsidy",
        "authority":"National Cooperative Development Corporation - Ayushman Sahakar",
        "authority_url":"https://www.ncdc.in/",
        "canonical_url":"https://ncdc.in/documents/other/Ayushman-sahakar20102020.pdf",
        "source_url":"https://ncdc.in/documents/other/Ayushman-sahakar20102020.pdf",
        "source_kind":"guideline",
        "source_title":"Ayushman Sahakar - NCDC",
        "source_anchor":"Objectives, activities covered, eligibility, loan period, interest incentive, security and funding pattern",
        "summary":"An NCDC credit-support framework for eligible cooperative societies creating or modernizing hospitals, healthcare, AYUSH, health-education, insurance and digital-health facilities.",
        "objective":"Help cooperative societies provide affordable and holistic healthcare, promote AYUSH, support health education and insurance, and participate in national digital-health objectives.",
        "legal_basis":"Ayushman Sahakar scheme of the National Cooperative Development Corporation.",
        "eligibility":{"entity_types":["cooperative_society","state_cooperative_society","multi_state_cooperative_society","healthcare_cooperative"],"lifecycle_stages":["operating","growth","scaling","infrastructure_expansion"],"industries":["healthcare","hospitals","ayush","medical_education","nursing_education","pharmacy_education","paramedical_services","diagnostics","health_insurance","digital_health"],"locations":["India"],"conditions":["the applicant is registered under a State or Multi-State Cooperative Societies Act","the bye-laws contain suitable provisions to undertake hospital, healthcare or health-education services","the project fits an eligible healthcare, AYUSH, education, insurance, telemedicine, digital-health, margin-money or working-capital activity","the project satisfies the current NCDC appraisal, contribution, security, statutory-permit and financing-route requirements"],"exclusions":["a private company, LLP or individual cannot use this cooperative-only record without an eligible cooperative applicant","credit linkage does not guarantee sanction, grant, viability-gap funding or interest incentive","healthcare approvals, clinical, education, insurance, pharmacy, environmental, building and local permissions remain separate requirements","converged subsidy or grant retains the other scheme's eligibility and sanction conditions","project cost, rates, funding pattern, security and current NCDC terms may change by circular"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.ncdc.in/","route":"Prepare a viable healthcare or health-education project and apply through the current NCDC direct-funding or State Government/UT route with the required statutory and financial documents.","applicant_note":"UdyamVeda can prepare the cooperative, bye-law, project, permissions, funding, contribution, security and convergence checklist, but cannot obtain NCDC sanction or act as the healthcare regulator.","fees":"Confirm current NCDC processing, appraisal, documentation, interest-rate and security terms before proceeding."},
        "fine_print":{"eligible_activity_groups":["hospital_and_healthcare_infrastructure","medical_ayush_dental_nursing_pharmacy_paramedical_or_physiotherapy_colleges","yoga_and_wellness_centres","traditional_medicine_centres","elderly_palliative_disability_and_mental_health_services","emergency_trauma_physiotherapy_mobile_clinic_diagnostic_laboratory_and_blood-bank_services","ayush_pharmaceutical_manufacturing_and_drug-testing_laboratories","telemedicine_and_remote_assisted_procedures","healthcare_and_education_logistics","digital-health_information_and_communication_technology","IRDA-accredited_health_insurance","margin_money_and_working_capital"],"loan_period_years":{"fixed_period":8},"principal_moratorium_years":{"minimum":1,"maximum":2},"interest_incentive":{"women_members_majority_term_loan_rate_reduction_percent":1,"condition":"applies for the entire loan tenure only where timely repayments are made and subject to current NCDC rates/circulars"},"funding_pattern":{"direct_infrastructure_loan_max_percent":70,"direct_society_share_min_percent":30,"state_route_ncdc_loan_max_percent":90,"state_route_society_share_min_percent":10,"state_to_society_loan_percent":50,"state_to_society_share_capital_percent":40,"margin_money":"loan or share-capital/loan-cum-share-capital pattern as applicable","working_capital":"loan as per requirement and appraisal"},"subsidy_convergence":"NCDC loan may be dovetailed with Government, State or other funding-agency subsidy, grant or VGF; the loan amount and funding pattern may change proportionately and the other programme's rules remain separate.","no_fixed_project_entitlement":true,"no_guaranteed_sanction":true,"review_note":"Confirm the latest NCDC circular and application form, eligible activity, cooperative bye-laws, statutory healthcare/education/insurance permits, project cost, direct versus State route, contribution, security, moratorium, interest incentive, convergence, repayment, monitoring and grievance terms before publication."},
        "benefit_summary":{"types":["loan","interest_subvention","business_support"],"summary":"Potential NCDC loan support for cooperative healthcare infrastructure, margin money or working capital, with a 1% term-loan interest incentive for qualifying women-majority cooperatives that repay on time; sanction and any converged grant remain conditional.","separate_value_buckets":true},
        "benefit_type":"loan",
        "benefit_label":"Ayushman Sahakar cooperative healthcare project finance",
        "benefit_conditions":{"healthcare_cooperative_required":true,"suitable_bye_laws_required":true,"eligible_healthcare_project_required":true,"statutory_permissions_required":true,"ncdc_appraisal_and_security_required":true,"women_majority_for_interest_incentive":true,"no_guaranteed_sanction":true},
        "requirement":"Healthcare cooperative and permitted project",
        "requirement_description":"Provide cooperative registration and bye-laws, project report, healthcare/education/insurance permissions, estimates, financials, contribution, security, operating model and any subsidy or convergence approvals required by NCDC.",
        "rules":{"all":[{"field":"eligible_healthcare_cooperative","operator":"equals","value":true},{"field":"healthcare_or_health_education_bye_law_provision","operator":"equals","value":true},{"field":"eligible_ayushman_sahakar_activity","operator":"equals","value":true},{"field":"required_statutory_permissions_ready","operator":"equals","value":true},{"field":"viable_business_plan","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm cooperative and bye-law eligibility","description":"Verify registration under the applicable State or Multi-State Act and the bye-law provision for hospital, healthcare or health-education services.","url":"https://ncdc.in/documents/other/Ayushman-sahakar20102020.pdf"},{"title":"Classify the healthcare activity","description":"Map the project to eligible infrastructure, AYUSH, education, insurance, telemedicine, digital-health, margin-money or working-capital activity.","url":"https://www.ncdc.in/documents/booklet/2609240524English-Compendium-as-on-22.05.2024.pdf"},{"title":"Secure statutory permissions","description":"Identify and obtain the healthcare, clinical, education, pharmacy, insurance, building, environmental and local permissions applicable to the proposed project.","url":"https://ncdc.in/documents/other/Ayushman-sahakar20102020.pdf"},{"title":"Calculate funding and security","description":"Separate project cost, loan, society contribution, State/direct route, security, moratorium, working capital and any separately approved subsidy or VGF.","url":"https://www.ncdc.in/"},{"title":"Use the official NCDC route","description":"Apply through the current NCDC or State Government/UT channel and retain sanction, disbursement, permit, repayment, interest-incentive, monitoring and grievance records.","url":"https://www.ncdc.in/"}],
        "window_type":"rolling",
        "window_label":"Ayushman Sahakar is a framework-based NCDC financing route; current application forms, rates, lender channel and acceptance availability must be confirmed before action.",
        "window_evidence":{"source_url":"https://www.ncdc.in/","anchor":"Current NCDC scheme and financing navigation; framework availability does not itself establish sanction or an open application call"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Cooperation', 'National Cooperative Development Corporation', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.87, 0.84, 'in_review')
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
    select version_id, 'https://www.ncdc.in/documents/booklet/2609240524English-Compendium-as-on-22.05.2024.pdf', 'guideline', 'NCDC scheme compendium', 'Ayushman Sahakar eligibility, loan period, funding pattern and women-majority interest incentive', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.ncdc.in/documents/booklet/2609240524English-Compendium-as-on-22.05.2024.pdf');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://www.cooperation.gov.in/en/programmes-schemes', 'ministry', 'Ministry of Cooperation programmes and schemes', 'NCDC cooperative healthcare and enterprise assistance', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.cooperation.gov.in/en/programmes-schemes');
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
