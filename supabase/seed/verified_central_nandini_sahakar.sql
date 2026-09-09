-- Nandini Sahakar: women-focused cooperative enterprise and credit support
-- framework of the National Cooperative Development Corporation (NCDC).
-- This is credit linkage and project assistance, not a guaranteed grant or
-- automatic loan sanction.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('National Cooperative Development Corporation official portal', 'https://ncdc.in', 'agency_portal', 'central', 'weekly', 1, true, 'Official NCDC portal for scheme, financing, application and current-rate navigation.'),
  ('NCDC Nandini Sahakar scheme document', 'https://ncdc.in/documents/other/Nandini-Sahakar-Scheme-Eng-01.11.2021.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official NCDC Nandini Sahakar scheme document describing eligibility, activities, credit linkage and project-support framework.'),
  ('Ministry of Cooperation programmes and schemes', 'https://www.cooperation.gov.in/en/programmes-schemes', 'ministry_portal', 'central', 'monthly', 1, true, 'Official Ministry of Cooperation page describing cooperative development and NCDC assistance; current route and convergence terms require review.'),
  ('Ministry of Cooperation Nandini Sahakar parliamentary answer', 'https://www.cooperation.gov.in/sites/default/files/2025-01/USQ%20PQ%201032%20English.pdf', 'ministry', 'central', 'monthly', 1, true, 'Official government answer confirming Nandini Sahakar as women-cooperative financial assistance with term loan and interest-subvention features.')
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
        "slug":"nandini-sahakar-women-cooperative-enterprise-support",
        "name":"Nandini Sahakar - Women Cooperative Enterprise and Credit Support",
        "type":"credit_subsidy",
        "authority":"National Cooperative Development Corporation - Nandini Sahakar",
        "authority_url":"https://ncdc.in/",
        "canonical_url":"https://ncdc.in/documents/other/Nandini-Sahakar-Scheme-Eng-01.11.2021.pdf",
        "source_url":"https://ncdc.in/documents/other/Nandini-Sahakar-Scheme-Eng-01.11.2021.pdf",
        "source_kind":"guideline",
        "source_title":"Nandini Sahakar Scheme - NCDC",
        "source_anchor":"Summary, eligibility, activities covered, period of loan, interest subvention and pattern of funding",
        "summary":"A women-focused NCDC framework combining business-plan support, hand-holding, capacity development and credit linkage for eligible women cooperatives.",
        "objective":"Improve the socio-economic status of women and support women-led cooperative enterprise through project formulation, capacity development, credit linkage and convergence with subsidy or interest-subvention schemes.",
        "legal_basis":"Nandini Sahakar framework of the National Cooperative Development Corporation under the administrative control of the Ministry of Cooperation.",
        "eligibility":{"entity_types":["women_cooperative_society","registered_cooperative_society","multi_state_cooperative_society","state_cooperative_society"],"founder_categories":["women_led_cooperative"],"lifecycle_stages":["idea","operating","growth","scaling"],"industries":["agriculture","agro_processing","food_processing","supply_chain","logistics","retail","dairy","poultry","livestock","fishery","handloom","coir","jute","sericulture","tourism","healthcare","education","renewable_energy","services"],"locations":["India"],"conditions":["the society is registered as a women cooperative under a State or Multi-State Cooperative Societies Act, or has at least 50% women as primary members","the proposed business-plan activity or service falls within NCDC's credit-linkage mandate and is not urban housing","new or innovative activity proposals satisfy the applicable minimum operating-period and current NCDC guidelines","the proposal is viable and passes the applicable direct or State Government/UT financing route, appraisal and security requirements"],"exclusions":["urban housing activities","membership or application does not guarantee NCDC sanction, subsidy, interest subvention or disbursement","Nandini Sahakar credit linkage must not be presented as a direct grant","converged subsidy or interest subvention retains the other scheme's eligibility and sanction conditions","project-cost limits, funding pattern, rates, security and current lending terms can change under NCDC circulars"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://ncdc.in/","route":"Prepare a viable project and apply through the applicable NCDC direct-funding or State Government/UT Administration route using the current NCDC forms, appraisal and security instructions.","applicant_note":"UdyamVeda can prepare the cooperative, member-composition, project-cost, business-plan, contribution, security and convergence checklist, but cannot obtain NCDC sanction or represent itself as NCDC.","fees":"Confirm current NCDC processing, appraisal, documentation, interest-rate and security terms before proceeding."},
        "fine_print":{"eligibility_structure":"A women cooperative means a society registered as a women cooperative under a State or Multi-State Act, or a cooperative with at least 50% women as primary members. For new or innovative activities, the official scheme document allows a women cooperative operating for at least three months to be eligible subject to applicable NCDC guidelines.","project_cost_caps_inr":{"operation_more_than_3_months_less_than_1_year":10000000,"operation_more_than_1_year_less_than_3_years":30000000,"operation_more_than_3_years":"no stated cap for viable proposals"},"loan_period_years":{"minimum":5,"maximum":8},"principal_moratorium_years":{"minimum":1,"maximum":2},"interest_subvention":{"new_or_innovative_term_loan_percent":2,"other_activity_term_loan_percent":1,"condition":"timely repayment and current NCDC circular terms"},"funding_pattern":{"direct_infrastructure_loan_max_percent":70,"direct_society_share_min_percent":30,"state_route_ncdc_loan_max_percent":90,"state_route_society_share_min_percent":10,"new_innovative_direct_debt_equity":"80:20","working_capital":"loan as per requirement; current route and appraisal apply"},"benefit_is_credit_linkage":true,"no_guaranteed_sanction":true,"convergence":"NCDC credit linkage may converge with government, state, development-agency or other approved schemes, but each converged benefit must be evaluated separately.","review_note":"Confirm the latest NCDC circulars and application form, current interest rates, eligible activities, project-cost caps, operating-period test, direct versus State route, contribution, security, appraisal, moratorium, subvention, convergence, repayment, monitoring and grievance terms before publication."},
        "benefit_summary":{"types":["loan","interest_subvention","business_support"],"summary":"Potential NCDC credit linkage for infrastructure, margin money or working capital, with project formulation and capacity support and possible interest subvention subject to the current route, appraisal and repayment conditions; this is not a guaranteed grant or sanction.","separate_value_buckets":true},
        "benefit_type":"loan",
        "benefit_label":"Nandini Sahakar cooperative credit linkage",
        "benefit_conditions":{"women_cooperative_required":true,"business_plan_required":true,"ncdc_credit_linkage_route":true,"appraisal_and_security_required":true,"interest_subvention_subject_to_timely_repayment":true,"no_guaranteed_sanction":true},
        "requirement":"Women-cooperative identity and viable business plan",
        "requirement_description":"Provide registration and member-composition evidence, operating history, viable business plan, project-cost and funding pattern, contribution, security, financial statements and any convergence or subsidy details required by the current NCDC route.",
        "rules":{"all":[{"any":[{"field":"registered_as_women_cooperative","operator":"equals","value":true},{"field":"women_primary_members_percent","operator":"greater_than_or_equal","value":50}]},{"field":"ncdc_credit_linkage_activity","operator":"equals","value":true},{"field":"urban_housing_activity","operator":"equals","value":false},{"field":"viable_business_plan","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm women-cooperative eligibility","description":"Verify the registration basis or at least 50% women primary membership and the applicable operating-period condition for any new or innovative activity.","url":"https://ncdc.in/documents/other/Nandini-Sahakar-Scheme-Eng-01.11.2021.pdf"},{"title":"Classify the business activity","description":"Map the proposed infrastructure, margin-money or working-capital need to a business-plan activity within NCDC's mandate and exclude urban housing.","url":"https://www.cooperation.gov.in/en/programmes-schemes"},{"title":"Select the financing route","description":"Compare direct NCDC funding with the State Government/UT route, then calculate contribution, project-cost cap, debt/equity, security and repayment assumptions.","url":"https://ncdc.in/documents/other/Nandini-Sahakar-Scheme-Eng-01.11.2021.pdf"},{"title":"Prepare appraisal and convergence evidence","description":"Prepare the project report, financials, member records, estimates, security, permits and any separate subsidy or interest-subvention evidence for appraisal.","url":"https://ncdc.in/"},{"title":"Use the official NCDC handoff","description":"Apply through the current NCDC or State/UT route and retain sanction, loan, repayment, subvention, monitoring and grievance records.","url":"https://ncdc.in/"}],
        "window_type":"rolling",
        "window_label":"Nandini Sahakar is a framework-based NCDC credit route; current application availability, forms, rates and State/UT implementation must be confirmed before action.",
        "window_evidence":{"source_url":"https://ncdc.in/","anchor":"Current NCDC scheme and financing navigation; the existence of the framework does not itself establish a live sanction window"}
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.88, 0.85, 'in_review')
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
    select version_id, 'https://www.cooperation.gov.in/en/programmes-schemes', 'ministry', 'Ministry of Cooperation programmes and schemes', 'NCDC assistance and cooperative business-development programmes', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.cooperation.gov.in/en/programmes-schemes');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://www.cooperation.gov.in/sites/default/files/2025-01/USQ%20PQ%201032%20English.pdf', 'ministry', 'Ministry of Cooperation parliamentary answer', 'Nandini Sahakar term loan and interest-subvention description', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.cooperation.gov.in/sites/default/files/2025-01/USQ%20PQ%201032%20English.pdf');
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
