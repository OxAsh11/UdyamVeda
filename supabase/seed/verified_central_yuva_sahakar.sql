-- Yuva Sahakar: NCDC's cooperative enterprise support and innovation scheme.
-- It is a cooperative-sector credit route with an interest incentive, not a
-- general startup grant or an automatic loan sanction.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('NCDC Yuva Sahakar pattern of assistance', 'https://www.ncdc.in/documents/faq/2010210223Pattern-of-Assistance-2021-22.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official NCDC pattern-of-assistance document covering Yuva Sahakar eligibility, project cost, loan period, interest incentive, security and subsidy/convergence conditions.'),
  ('NCDC Yuva Sahakar scheme compendium', 'https://www.ncdc.in/documents/booklet/2609240524English-Compendium-as-on-22.05.2024.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official NCDC compendium with the current recorded Yuva Sahakar project-cost, loan, interest and debt-equity details; latest circulars require review.'),
  ('NCDC official portal', 'https://www.ncdc.in/', 'agency_portal', 'central', 'weekly', 1, true, 'Official NCDC portal for current scheme, loan application, financing and rate information.'),
  ('Ministry of Cooperation programmes and schemes', 'https://www.cooperation.gov.in/en/programmes-schemes', 'ministry_portal', 'central', 'monthly', 1, true, 'Official Ministry of Cooperation page describing NCDC cooperative-development assistance and enterprise activity coverage.')
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
        "slug":"yuva-sahakar-cooperative-enterprise-support-innovation",
        "name":"Yuva Sahakar - Cooperative Enterprise Support and Innovation Scheme",
        "type":"credit_subsidy",
        "authority":"National Cooperative Development Corporation - Yuva Sahakar",
        "authority_url":"https://www.ncdc.in/",
        "canonical_url":"https://www.ncdc.in/documents/faq/2010210223Pattern-of-Assistance-2021-22.pdf",
        "source_url":"https://www.ncdc.in/documents/faq/2010210223Pattern-of-Assistance-2021-22.pdf",
        "source_kind":"guideline",
        "source_title":"Yuva Sahakar - Cooperative Enterprise Support and Innovation Scheme",
        "source_anchor":"Eligibility, project cost, loan period, rate of interest, security and subsidy sections",
        "summary":"A cooperative-sector startup and innovation credit route for new, innovative or value-chain-enhancement projects, with NCDC project assistance and an interest incentive subject to appraisal and timely repayment.",
        "objective":"Enable newly formed and other eligible cooperative societies to develop innovative, value-adding enterprises across sectors through project finance, capacity support and a cooperative startup and innovation fund framework.",
        "legal_basis":"Yuva Sahakar - Cooperative Enterprise Support and Innovation Scheme of the National Cooperative Development Corporation.",
        "eligibility":{"entity_types":["cooperative_society","state_cooperative_society","multi_state_cooperative_society","primary_cooperative_society"],"lifecycle_stages":["idea","pre_startup","early_stage","growth"],"industries":["all_cooperative_activities","agriculture","agro_processing","food_processing","manufacturing","services","logistics","retail","tourism","healthcare","education","renewable_energy"],"locations":["India"],"conditions":["the applicant is a cooperative society with a new, innovative or value-chain-enhancement project","the society has operated for at least three months","the society has positive net worth","the society satisfies the applicable cash-loss, project-viability, contribution, security and NCDC appraisal conditions","the project activity and any proposed subsidy or convergence fit the current NCDC and implementing-scheme rules"],"exclusions":["a newly registered company, LLP or sole proprietorship cannot use this cooperative-only record unless it is an eligible cooperative society","membership or application does not guarantee NCDC sanction, subsidy or interest incentive","working capital included in the project is subject to the stated percentage cap and current NCDC terms","subsidy under another government scheme is conditional on that scheme's separate eligibility and approval","project cost, rates, security and category preferences can change through NCDC circulars"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.ncdc.in/","route":"Prepare a viable cooperative project and apply through the current NCDC financing/application route, directly or through the applicable State Government/UT channel.","applicant_note":"UdyamVeda can prepare the cooperative, innovation, project-cost, contribution, debt-equity, security and convergence checklist, but cannot obtain NCDC sanction or submit as the applicant.","fees":"Confirm current NCDC processing, documentation, interest-rate and security terms before proceeding."},
        "fine_print":{"project_cost_caps_inr":{"operation_more_than_3_months_less_than_1_year":10000000,"operation_at_least_1_year":30000000},"working_capital_max_percent_of_project_cost":20,"loan_period_years":{"maximum":5},"principal_moratorium_years":{"maximum":2},"interest_incentive":{"term_loan_rate_reduction_percent":2,"condition":"valid only for timely repayments and subject to the applicable NCDC rate/circular"},"debt_equity_patterns":{"category_a":"80:20 for eligible cooperatives in the North Eastern Region, Aspirational Districts, or with 100% women, SC, ST or PwD members, subject to current criteria","category_b":"70:30 for other eligible cooperative societies"},"security":"Mortgage, FDR, credible cooperative/government/statutory/financial-institution guarantee or other security may be required to NCDC's satisfaction.","subsidy":"Subsidy from a flagship Government scheme or another source may apply only if the proposed activity is separately eligible; Yuva Sahakar itself is not a guaranteed subsidy.","benefit_is_credit_linkage":true,"no_guaranteed_sanction":true,"review_note":"Confirm the latest NCDC scheme/circular, current rate, project-cost and working-capital limits, three-month operation test, cash-loss test, Category A preference, debt-equity, security, direct versus State route, subsidy convergence, appraisal, repayment, monitoring and grievance terms before publication."},
        "benefit_summary":{"types":["loan","interest_subvention","business_support"],"summary":"Potential NCDC project finance, business-plan support and a 2% term-loan interest incentive for timely repayment, subject to cooperative eligibility, project appraisal, contribution, security and current NCDC conditions; no fixed grant entitlement is created.","separate_value_buckets":true},
        "benefit_type":"loan",
        "benefit_label":"Yuva Sahakar cooperative innovation project finance",
        "benefit_conditions":{"cooperative_society_required":true,"innovative_or_value_chain_project_required":true,"positive_net_worth_required":true,"ncdc_appraisal_and_security_required":true,"timely_repayment_for_interest_incentive":true,"no_guaranteed_sanction":true},
        "requirement":"Eligible cooperative and viable innovation project",
        "requirement_description":"Provide cooperative registration, operation period, net-worth and loss history, innovation/value-chain project report, cost and working-capital split, contribution/debt-equity, security, financials and any convergence evidence requested by NCDC.",
        "rules":{"all":[{"field":"eligible_cooperative_society","operator":"equals","value":true},{"field":"cooperative_operation_months","operator":"greater_than_or_equal","value":3},{"field":"positive_net_worth","operator":"equals","value":true},{"field":"new_innovative_or_value_chain_project","operator":"equals","value":true},{"field":"viable_business_plan","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm cooperative eligibility","description":"Verify cooperative registration, at least three months of operation, positive net worth and applicable cash-loss history.","url":"https://www.ncdc.in/documents/faq/2010210223Pattern-of-Assistance-2021-22.pdf"},{"title":"Classify the innovation project","description":"Document the new, innovative or value-chain-enhancement activity and map it to an eligible cooperative business sector.","url":"https://www.cooperation.gov.in/en/programmes-schemes"},{"title":"Calculate project finance","description":"Separate project cost, working capital, contribution, debt-equity, project-cost band, security and repayment assumptions; keep working capital within the applicable cap.","url":"https://www.ncdc.in/documents/booklet/2609240524English-Compendium-as-on-22.05.2024.pdf"},{"title":"Prepare appraisal and convergence evidence","description":"Prepare the business plan, financials, estimates, member and governance records, security and any separately approved subsidy or convergence documents.","url":"https://www.ncdc.in/"},{"title":"Use the official NCDC route","description":"Apply through the current NCDC or State Government/UT route and retain sanction, loan, repayment, interest-incentive, monitoring and grievance records.","url":"https://www.ncdc.in/"}],
        "window_type":"rolling",
        "window_label":"Yuva Sahakar is a framework-based NCDC financing route; current application forms, rates, channel and acceptance availability must be confirmed before action.",
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
    select version_id, 'https://www.ncdc.in/documents/booklet/2609240524English-Compendium-as-on-22.05.2024.pdf', 'guideline', 'NCDC scheme compendium', 'Yuva Sahakar eligibility, project cost, loan, interest and debt-equity pattern', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.ncdc.in/documents/booklet/2609240524English-Compendium-as-on-22.05.2024.pdf');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://www.cooperation.gov.in/en/programmes-schemes', 'ministry', 'Ministry of Cooperation programmes and schemes', 'NCDC cooperative enterprise and financing activity coverage', now(), false
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
