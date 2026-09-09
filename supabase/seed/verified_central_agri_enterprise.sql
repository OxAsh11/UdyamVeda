-- Agriculture and agri-enterprise records from official DA&FW and MNRE
-- sources. Both remain in_review: current lender, state implementation,
-- amendment and window checks are required before publication.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Agriculture Infrastructure Fund official portal', 'https://agriinfra.dac.gov.in/', 'agency_portal', 'central', 'weekly', 2, true, 'Official DA&FW AIF application and information portal; current lender and project routes require review.'),
  ('Agriculture Infrastructure Fund scheme guidelines', 'https://agriinfra.dac.gov.in/Documents/Circular/91EE46A50D3941908F192725717E431B.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official DA&FW scheme guidelines for AIF; amendments and current implementation terms require review.'),
  ('MNRE PM-KUSUM official scheme page', 'https://mnre.gov.in/en/pradhan-mantri-kisan-urja-suraksha-evam-utthaan-mahabhiyaan-pm-kusum/', 'ministry_portal', 'central', 'weekly', 1, true, 'Official MNRE PM-KUSUM scheme page; state implementation and current extension status are deadline-sensitive.'),
  ('MNRE official portal', 'https://mnre.gov.in/en/', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Ministry of New and Renewable Energy portal referenced as the PM-KUSUM authority homepage.'),
  ('National PM-KUSUM portal and FAQ', 'https://pmkusum.mnre.gov.in/landing-faq.html', 'implementing_portal', 'central', 'weekly', 2, true, 'Official national PM-KUSUM portal with component and implementation information.'),
  ('National PM-KUSUM publicity and implementation page', 'https://pmkusum.mnre.gov.in/Publicity.html', 'implementing_portal', 'central', 'weekly', 2, true, 'Official national PM-KUSUM portal page with component assistance, implementation boundary and latest achievement context.'),
  ('PM-KUSUM revised FAQ PDF', 'https://pmkusum.mnre.gov.in/assets/pdf/PM%20KUSUM%20FAQs%20-%20Revised_%20April%20%28Brand%29.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official PM-KUSUM FAQ used for component, stakeholder and assistance fine print.'),
  ('PM-KUSUM 2025 sunset memorandum', 'https://apipmk.mnre.gov.in/api/Master_Document_Landing/SliderImage?docid=190&docspid=41', 'guideline', 'central', 'weekly', 1, true, 'Official 2025 memorandum stating the 31 March 2026 sunset boundary and state allocation context.')
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
    select value from jsonb_array_elements('[
      {
        "slug":"agriculture-infrastructure-fund",
        "name":"Agriculture Infrastructure Fund (AIF)",
        "type":"credit_subsidy",
        "authority":"Department of Agriculture and Farmers Welfare - Agriculture Infrastructure Fund",
        "authority_url":"https://agriinfra.dac.gov.in/",
        "canonical_url":"https://agriinfra.dac.gov.in/",
        "source_url":"https://agriinfra.dac.gov.in/Documents/Circular/91EE46A50D3941908F192725717E431B.pdf",
        "source_kind":"guideline",
        "source_title":"Scheme Guidelines for Central Sector Scheme of Financing Facility under Agriculture Infrastructure Fund",
        "source_anchor":"Eligible entities, project purpose and financing facility",
        "summary":"Medium- and long-term debt financing support for eligible post-harvest management infrastructure and community farming assets.",
        "objective":"Improve farm-gate and aggregation-point infrastructure, reduce post-harvest losses and support viable agriculture infrastructure projects.",
        "legal_basis":"Central Sector Scheme of Financing Facility under Agriculture Infrastructure Fund",
        "eligibility":{"entity_types":["agriculture_entrepreneur","startup","farmer_producer_organisation","primary_agricultural_cooperative_society","cooperative","farmer_collective","apmc","self_help_group","joint_liability_group","state_agency","local_body_ppp_project"],"lifecycle_stages":["pre_production","operating","scaling","infrastructure_expansion"],"industries":["agriculture","food_processing","post_harvest","agri_logistics","renewable_energy","precision_agriculture"],"locations":["India"],"conditions":["project must fit eligible post-harvest management infrastructure or viable farming asset categories","loan must be sanctioned through a participating eligible lending institution","each project location must have a separate LGD code where the guideline requires it","a private-sector farmer, agri-entrepreneur or startup is subject to the stated project-count and location conditions","current scheme guidelines and amendments govern project and entity eligibility"],"thresholds":{"private_sector_max_projects":25,"interest_subvention_loan_limit_inr":20000000,"scheme_operational_through":"2032-33"},"unknown_handling":"needs_information"},
        "exclusions":["Standalone secondary processing is not automatically eligible under the cited guideline boundary","Interest subvention and credit guarantee are loan-linked support and must not be displayed as a direct grant","A loan above ₹2 crore does not receive subvention above the ₹2 crore limit","A lender sanction, guarantee coverage or convergence support is not automatic merely because the project category appears eligible","Project, location, LGD-code, asset, monitoring and state/PMU conditions may limit the route"],
        "application":{"portal":"https://agriinfra.dac.gov.in/","route":"classify the project under the current AIF guideline, prepare the project and financing dossier, and apply through the official AIF platform and a participating lending institution","selection":"The lender and applicable DA&FW/state PMU or scheme process assess project viability, borrower eligibility, sanction and implementation; the financing facility is not an automatic grant entitlement.","requirements":["project report and cost/viability evidence","entity, land/location and LGD-code evidence where applicable","lender and sanction documentation","eligible asset, invoice, utilization and monitoring evidence","convergence and credit-guarantee declarations where applicable"],"lender_route":true},
        "fine_print":{"interest_subvention_percent":3,"eligible_loan_limit_for_subvention_inr":20000000,"maximum_subvention_years":7,"credit_guarantee_limit_inr":20000000,"repayment_moratorium_months":{"minimum":0,"maximum":24},"scheme_operational_period":"2020-21 to 2032-33 under the September 2024 revised guideline","loan_disbursement_completion_boundary":"end of FY 2025-26 under the September 2024 guideline; current sanction/disbursement position requires verification","benefit_is_not_a_cash_grant":true,"eligible_project_boundary":"post-harvest management infrastructure and viable farming assets, including the illustrative crop/activity table; standalone secondary processing is not automatically eligible","project_count_boundary":"private-sector farmer, agri-entrepreneur or startup may have up to 25 projects, with location/LGD-code and project-specific conditions","review_note":"Confirm the latest AIF amendment, eligible project list, entity limits, location/LGD treatment, lender route, credit-guarantee coverage, convergence rules, current portal operation, sanction status and application timeline before publication."},
        "benefit_summary":{"types":["interest_subvention","credit_guarantee","loan"],"amounts":[{"type":"interest_subvention","percentage":3,"loan_limit_inr":20000000,"maximum_years":7},{"type":"credit_guarantee","loan_limit_inr":20000000,"fee_treatment":"Government-paid subject to eligibility and route"}],"summary":"Eligible project loans may receive 3% annual interest subvention up to a ₹2 crore loan limit for up to seven years, with credit-guarantee support subject to the current guidelines; this is loan-linked support, not a direct grant entitlement.","separate_value_buckets":true},
        "benefit_type":"interest_subvention_and_credit_guarantee",
        "benefit_label":"Agriculture infrastructure loan support",
        "benefit_conditions":{"eligible_project_required":true,"eligible_lender_required":true,"loan_based_support":true},
        "requirement":"Eligible agriculture infrastructure project and lender route",
        "requirement_description":"The applicant must develop a viable eligible post-harvest or community-farming-asset project and obtain financing through the applicable lender route.",
        "rules":{"all":[{"field":"agriculture_infrastructure_project","operator":"equals","value":true},{"field":"eligible_lending_institution_available","operator":"equals","value":true},{"field":"project_category_in_aif_guidelines","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Classify the proposed project","description":"Confirm that the project fits the current AIF post-harvest-management or community-farming-asset categories.","url":"https://agriinfra.dac.gov.in/Documents/Circular/91EE46A50D3941908F192725717E431B.pdf"},{"title":"Prepare the project and lender application","description":"Use the official AIF route, project documents and eligible lending institution process; preserve sanction and asset evidence.","url":"https://agriinfra.dac.gov.in/"}],
        "window_type":"rolling",
        "window_label":"Financing-facility route; current project and lender availability require verification.",
        "window_evidence":{"source_url":"https://agriinfra.dac.gov.in/Documents/Circular/91EE46A50D3941908F192725717E431B.pdf","anchor":"Scheme period, eligible entities and financing facility"}
      },
      {
        "slug":"pradhan-mantri-kisan-urja-suraksha-evam-utthaan-mahabhiyaan-pm-kusum",
        "name":"Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyaan (PM-KUSUM)",
        "type":"subsidy",
        "authority":"Ministry of New and Renewable Energy - PM-KUSUM",
        "authority_url":"https://mnre.gov.in/en/",
        "canonical_url":"https://mnre.gov.in/en/pradhan-mantri-kisan-urja-suraksha-evam-utthaan-mahabhiyaan-pm-kusum/",
        "source_url":"https://mnre.gov.in/en/pradhan-mantri-kisan-urja-suraksha-evam-utthaan-mahabhiyaan-pm-kusum/",
        "source_kind":"ministry_portal",
        "source_title":"PM-KUSUM scheme page",
        "source_anchor":"Objectives, components, beneficiaries and period",
        "summary":"Component-based renewable-energy support for decentralized solar plants, solar agriculture pumps and solarisation of grid-connected agricultural pumps.",
        "objective":"Reduce diesel use in agriculture, support renewable generation and improve farm-energy access and income opportunities.",
        "legal_basis":"Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyaan (PM-KUSUM)",
        "eligibility":{"entity_types":["individual_farmer","farmer_group","farmer_producer_organisation","cooperative","panchayat","water_user_association","primary_agricultural_cooperative_society","renewable_energy_developer"],"lifecycle_stages":["pre_production","operating","infrastructure_expansion"],"industries":["agriculture","renewable_energy"],"locations":["India","specified_special_regions"],"conditions":["component-specific beneficiary, land, pump and capacity conditions apply","state designated implementing department, DISCOM and allocation route apply","projects must be completed and documented within the applicable sanction and implementation conditions","current extension and state allocation must be confirmed"],"thresholds":{"component_a_capacity_kw":{"minimum":500,"maximum":2000},"component_b_pump_capacity_hp_max":7.5,"component_c_solar_pv_capacity_multiple_of_pump_kw":2,"general_central_financial_assistance_percent":30,"specified_special_regions_central_financial_assistance_percent":50},"unknown_handling":"needs_information"},
        "exclusions":["The national scheme page states a period ending 31 March 2026; a post-period continuation must not be inferred","A national scheme record does not establish a live state or DISCOM application window","Central assistance is component-specific and calculated against the applicable benchmark or tender cost, whichever is lower","State allocation, implementing-agency, vendor, land, pump, capacity and completion conditions can block an otherwise plausible match","Feeder-level solarisation is an institutional/state/DISCOM route and must not be presented as an individual-farmer pump grant"],
        "application":{"portal":"https://pmkusum.mnre.gov.in/landing-faq.html","route":"apply through the designated State Government department, DISCOM or current PM-KUSUM implementing route","components":["component_a_decentralized_solar_plant","component_b_standalone_solar_pump","component_c_pump_or_feeder_solarisation"]},
        "fine_print":{"component_a_capacity_kw":{"minimum":500,"maximum":2000},"component_b_or_c_central_financial_assistance_percent":{"general":30,"specified_special_regions":50},"component_b_or_c_state_share_minimum_percent":30,"component_b_or_c_beneficiary_or_finance_balance_required":true,"page_stated_period_end":"2026-03-31","state_implementation_required":true,"current_pmkusum_facts":{"official_sources_checked":"2026-09-07","scheme_period_end":"2026-03-31","sunset_boundary_source":"https://apipmk.mnre.gov.in/api/Master_Document_Landing/SliderImage?docid=190&docspid=41","national_portal_context":"The national portal reports implementation and achievements after the cited period, but this does not by itself establish a new application window.","state_allocation_boundary":"The 2025 official memorandum states that target capacities were allocated to states and that state implementing agencies control the operational route.","current_availability":"No post-31 March 2026 central continuation or universal application window was evidenced in the official sources checked; keep closed pending an official extension or state-specific current window."},"current_source_reconciliation":"The MNRE scheme page, national portal, revised FAQ and 2025 sunset memorandum were reconciled on 7 September 2026. Component assistance remains represented as historical/current-guideline context, while the opportunity is not actionable until continuation and a designated state route are verified.","review_note":"Do not recommend an active application from the national record. A reviewer must verify any state-specific live window, designated implementing agency, allocation, vendor and beneficiary terms before surfacing an actionable route."},
        "benefit_summary":{"types":["capital_subsidy","renewable_energy","market_access"],"amounts":[{"component":"B standalone solar pump","central_assistance_percent":30,"specified_special_regions_percent":50,"basis":"lower of benchmark cost or tender cost"},{"component":"C individual pump solarisation","central_assistance_percent":30,"specified_special_regions_percent":50,"basis":"lower of benchmark cost or tender cost"},{"component":"C feeder-level solarisation","central_assistance_percent":30,"specified_special_regions_percent":50,"basis":"component-specific eligible cost and milestone rules"}],"summary":"Component-specific central financial assistance and state support for eligible solar plants or agricultural pump projects; percentages and routes vary by component, geography and state implementation.","separate_value_buckets":true},
        "benefit_type":"component_subsidy",
        "benefit_label":"Solar agriculture and renewable-energy support",
        "benefit_conditions":{"component_specific":true,"state_implementation_required":true,"current_extension_required":true},
        "requirement":"Eligible PM-KUSUM component and state implementation route",
        "requirement_description":"The applicant must select a component, satisfy the relevant land, pump, entity or project conditions and apply through the designated state route.",
        "rules":{"all":[{"field":"pm_kusum_component_selected","operator":"exists"},{"field":"state_implementing_route_available","operator":"equals","value":true},{"field":"current_pm_kusum_period_or_extension_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Choose the applicable component","description":"Determine whether the project is a decentralized solar plant, standalone pump or grid-connected pump/feeders solarisation project.","url":"https://mnre.gov.in/en/pradhan-mantri-kisan-urja-suraksha-evam-utthaan-mahabhiyaan-pm-kusum/"},{"title":"Confirm the state route and current window","description":"Check the designated state department or DISCOM and confirm current extension, allocation, vendor and beneficiary requirements before submitting.","url":"https://pmkusum.mnre.gov.in/landing-faq.html"}],
        "window_type":"closed",
        "window_label":"The cited PM-KUSUM scheme period ended on 31 March 2026. No post-period central continuation is asserted; state-specific routes require separate official verification.",
        "closes_at":"2026-03-31",
        "window_evidence":{"source_url":"https://apipmk.mnre.gov.in/api/Master_Document_Landing/SliderImage?docid=190&docspid=41","anchor":"Sunset date 31 March 2026 and state allocation context","checked_at":"2026-09-07"}
      }
    ]'::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, official_url)
    select item->>'authority', 'central', 'Government of India', item->>'authority_url'
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
