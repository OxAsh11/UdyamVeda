-- MSME RAMP sub-scheme records from official Ministry of MSME pages.
-- Each remains in_review because current implementation routes, notices and
-- applicant-level terms require editorial confirmation.

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
        "slug":"mse-online-dispute-resolution-scheme",
        "name":"MSE Scheme on Online Dispute Resolution (MSE-ODR)",
        "type":"compliance_support",
        "authority":"Ministry of Micro, Small and Medium Enterprises - RAMP",
        "authority_url":"https://msme.gov.in/",
        "canonical_url":"https://ramp.msme.gov.in/ramp/index.php/RAMP-initiative/mse-odr/mse-odr-scheme",
        "source_url":"https://ramp.msme.gov.in/ramp/pdf-documents/scheme-guidelines/odr-guidelines.pdf",
        "source_kind":"guideline",
        "source_title":"MSE ODR Scheme Guidelines",
        "source_anchor":"Financial Assistance to MSEs; Eligibility Criterion; Implementation Period",
        "summary":"Technology-enabled online dispute-resolution support for delayed-payment disputes of eligible micro and small enterprises.",
        "objective":"Digitise delayed-payment dispute resolution and support MSEs and MSEFCs with online processes and limited eligible assistance.",
        "legal_basis":"MSE ODR Scheme under the Raising and Accelerating MSME Performance programme",
        "eligibility":{"entity_types":["micro","small"],"conditions":["registered on Udyam or Udyam Assist Platform","the dispute and filing must fit the applicable MSMED Act and MSEFC route"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://ramp.msme.gov.in/ramp/index.php/RAMP-initiative/mse-odr/mse-odr-scheme","route":"use the current official ODR or MSEFC route when available","handoff":"MSME Samadhaan and state MSEFC processes may be relevant and must not be conflated with the ODR scheme"},
        "fine_print":{"scheme_outlay_inr":1890000000,"implementation_period":"2023-24 to 2026-27","components":["ODR portal development","operations and maintenance","support to MSEFCs","financial assistance for eligible documentation and application fees"],"mse_assistance_max_inr":4000,"review_note":"Confirm the current ODR portal status, fee categories, state availability, integration with Samadhaan, and whether the assistance is currently claimable before publication."},
        "benefit_summary":{"types":["grant","compliance_support"],"summary":"Online dispute-resolution access and a possible one-time assistance for eligible documentation or application fees, subject to the current guidelines."},
        "benefit_type":"grant",
        "benefit_label":"Eligible MSE ODR documentation and application-fee assistance",
        "amount_max":4000,
        "benefit_conditions":{"udyam_or_uap_required":true,"one_time_assistance":true,"current_odr_route_required":true},
        "requirement":"Udyam or UAP registration and delayed-payment matter",
        "requirement_description":"The enterprise must be an eligible MSE with the required registration and an applicable delayed-payment dispute route.",
        "rules":{"all":[{"field":"enterprise_size","operator":"in","value":["micro","small"]},{"field":"udyam_or_uap_registered","operator":"equals","value":true},{"field":"delayed_payment_matter","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm MSE registration and matter eligibility","description":"Verify Udyam/UAP registration, buyer-payment facts and the applicable MSEFC/ODR route.","url":"https://ramp.msme.gov.in/ramp/index.php/RAMP-initiative/mse-odr/mse-odr-scheme"},{"title":"Use the current official filing route","description":"Submit through the current ODR or designated MSEFC route and retain filing and fee evidence.","url":"https://ramp.msme.gov.in/ramp/index.php/RAMP-initiative/mse-odr/mse-odr-scheme"}],
        "window_type":"rolling",
        "window_label":"The scheme has a stated 2023-24 to 2026-27 implementation period; current portal availability requires review.",
        "window_evidence":{"source_url":"https://ramp.msme.gov.in/ramp/pdf-documents/scheme-guidelines/odr-guidelines.pdf","anchor":"Implementation Period of the Scheme"}
      },
      {
        "slug":"mse-green-investment-and-financing-for-transformation",
        "name":"MSE Green Investment and Financing for Transformation (MSE GIFT)",
        "type":"green_finance",
        "authority":"Ministry of Micro, Small and Medium Enterprises - RAMP",
        "authority_url":"https://msme.gov.in/",
        "canonical_url":"https://ramp.msme.gov.in/ramp/RAMP-initiative/mse-gift/gift-risk-sharing-facility-coverage-rsf",
        "source_url":"https://ramp.msme.gov.in/ramp/RAMP-initiative/mse-gift/gift-risk-sharing-facility-coverage-rsf",
        "source_kind":"ministry",
        "source_title":"MSE GIFT Risk Sharing Facility Coverage",
        "source_anchor":"Scheme Components; Eligibility; Sectors Covered",
        "summary":"Interest-subvention and risk-sharing support to help eligible MSEs adopt green technologies and clean-energy solutions.",
        "objective":"Create an enabling finance ecosystem for MSEs adopting green technologies, resource efficiency and climate-positive solutions.",
        "legal_basis":"MSE GIFT sub-scheme under the Raising and Accelerating MSME Performance programme",
        "eligibility":{"entity_types":["micro","small"],"conditions":["Udyam registration required","loan must be routed through an eligible participating lending institution","project must fit an eligible green or climate-related sector"],"industries":["resource_efficiency","waste_management","water_efficiency","green_buildings","clean_transportation","carbon_management"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://ramp.msme.gov.in/ramp/RAMP-initiative/mse-gift/gift-risk-sharing-facility-coverage-rsf","route":"approach a participating lending institution and follow the current MSE GIFT route","lender_requirement":"scheduled commercial bank, SIDBI, small finance bank, MFI or NBFC may participate subject to the official terms"},
        "fine_print":{"scheme_outlay_inr":4780000000,"duration_years":4,"interest_subvention_percent":2,"term_loan_limit_for_interest_subvention_inr":20000000,"risk_sharing_coverage_percent":75,"risk_sharing_loan_limit_inr":20000000,"guarantee_overlap_note":"CGTMSE and MSE GIFT guarantee cover may not be combined within the maximum permitted limit; confirm current interaction rules","review_note":"Confirm participating-lender list, eligible project costs, subvention period, guarantee mechanics and current application route before publication."},
        "benefit_summary":{"types":["subsidy","guarantee"],"summary":"Interest subvention and lender risk-sharing support for eligible green MSE projects; this is not a direct cash grant to the borrower."},
        "benefit_type":"subsidy",
        "benefit_label":"Green-loan interest subvention and risk-sharing support",
        "benefit_conditions":{"udyam_required":true,"participating_lender_required":true,"eligible_green_project_required":true},
        "requirement":"Udyam-registered MSE and eligible green project",
        "requirement_description":"The enterprise must be an eligible Udyam-registered MSE with a qualifying green project and participating lender route.",
        "rules":{"all":[{"field":"enterprise_size","operator":"in","value":["micro","small"]},{"field":"udyam_registered","operator":"equals","value":true},{"field":"green_project_category","operator":"exists"},{"field":"participating_lender","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Classify the green project","description":"Map the proposed investment to an eligible resource-efficiency, clean-energy, waste, water, building or transport category.","url":"https://ramp.msme.gov.in/ramp/RAMP-initiative/mse-gift/gift-risk-sharing-facility-coverage-rsf"},{"title":"Confirm the lender route","description":"Approach a participating lending institution and confirm current MSE GIFT documentation and financing terms.","url":"https://ramp.msme.gov.in/ramp/RAMP-initiative/mse-gift/gift-risk-sharing-facility-coverage-rsf"}],
        "window_type":"rolling",
        "window_label":"Lender-led support operates subject to corpus, participating-lender and current scheme conditions.",
        "window_evidence":{"source_url":"https://ramp.msme.gov.in/ramp/RAMP-initiative/mse-gift/gift-risk-sharing-facility-coverage-rsf","anchor":"Scheme Components and Eligibility"}
      },
      {
        "slug":"mse-scheme-for-promotion-and-investment-in-circular-economy",
        "name":"MSE Scheme for Promotion and Investment in Circular Economy (MSE SPICE)",
        "type":"subsidy",
        "authority":"Ministry of Micro, Small and Medium Enterprises - RAMP",
        "authority_url":"https://msme.gov.in/",
        "canonical_url":"https://ramp.msme.gov.in/ramp/RAMP-initiative/mse-spice/mse-spice",
        "source_url":"https://ramp.msme.gov.in/ramp/RAMP-initiative/mse-spice/mse-spice",
        "source_kind":"ministry",
        "source_title":"MSE SPICE official scheme page",
        "source_anchor":"Scheme Components; Eligibility; Capital Subsidy",
        "summary":"Capital-subsidy support for eligible brownfield MSE projects adopting circular-economy practices and plant or machinery improvements.",
        "objective":"Help MSEs adopt circular solutions, improve resource use and reduce environmental impact through eligible brownfield investments.",
        "legal_basis":"MSE SPICE sub-scheme under the Raising and Accelerating MSME Performance programme",
        "eligibility":{"entity_types":["micro","small"],"conditions":["Udyam registration required","brownfield project required","subsidy applies to eligible plant and machinery"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://ramp.msme.gov.in/ramp/RAMP-initiative/mse-spice/mse-spice","route":"follow the current official MSE SPICE and participating-lender route"},
        "fine_print":{"scheme_outlay_inr":4725000000,"duration_years":4,"capital_subsidy_percent":25,"subsidy_ceiling_inr":1250000,"project_cost_ceiling_inr":20000000,"asset_scope":"plant and machinery only","project_condition":"brownfield projects","review_note":"Confirm the current lender route, eligible plant and machinery, project-cost calculation, subsidy disbursement and live application window before publication."},
        "benefit_summary":{"types":["subsidy"],"summary":"25% capital subsidy for eligible plant and machinery, capped at the stated amount and subject to the brownfield and current scheme conditions."},
        "benefit_type":"subsidy",
        "benefit_label":"Circular-economy plant and machinery capital subsidy",
        "amount_max":1250000,
        "percentage":25,
        "benefit_conditions":{"udyam_required":true,"brownfield_required":true,"plant_and_machinery_only":true,"project_cost_ceiling_inr":20000000},
        "requirement":"Udyam-registered MSE brownfield project",
        "requirement_description":"The applicant must be an eligible Udyam-registered MSE proposing a qualifying brownfield circular-economy project.",
        "rules":{"all":[{"field":"enterprise_size","operator":"in","value":["micro","small"]},{"field":"udyam_registered","operator":"equals","value":true},{"field":"is_brownfield_project","operator":"equals","value":true},{"field":"circular_economy_project","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Verify brownfield and asset eligibility","description":"Confirm that the project is brownfield and that the proposed expenditure is eligible plant or machinery.","url":"https://ramp.msme.gov.in/ramp/RAMP-initiative/mse-spice/mse-spice"},{"title":"Use the current application route","description":"Follow the official MSE SPICE route and retain project-cost, Udyam and lender documents.","url":"https://ramp.msme.gov.in/ramp/RAMP-initiative/mse-spice/mse-spice"}],
        "window_type":"rolling",
        "window_label":"Application availability depends on current MSE SPICE implementation and lender conditions.",
        "window_evidence":{"source_url":"https://ramp.msme.gov.in/ramp/RAMP-initiative/mse-spice/mse-spice","anchor":"Eligibility and Capital Subsidy"}
      },
      {
        "slug":"msme-trade-enablement-and-marketing-team-initiative",
        "name":"MSME Trade Enablement and Marketing (TEAM) Initiative",
        "type":"market_access",
        "authority":"Ministry of Micro, Small and Medium Enterprises - RAMP",
        "authority_url":"https://msme.gov.in/",
        "canonical_url":"https://ramp.msme.gov.in/ramp/RAMP-initiative/msme-team-initiative/msme-team-initiative",
        "source_url":"https://ramp.msme.gov.in/ramp/RAMP-initiative/msme-team-initiative/msme-team-initiative",
        "source_kind":"ministry",
        "source_title":"MSME TEAM Initiative official scheme page",
        "source_anchor":"Scheme Components; Partners; Expected Impact",
        "summary":"Digital-market and ONDC onboarding support for eligible micro and small enterprises, including catalogue, account-management, logistics and packaging assistance.",
        "objective":"Improve market access for MSEs by helping them use ONDC and strengthen digital marketing capabilities.",
        "legal_basis":"MSME TEAM Initiative under the Raising and Accelerating MSME Performance programme",
        "eligibility":{"entity_types":["micro","small"],"conditions":["the enterprise must fit the current MSE route","specific onboarding, product and partner conditions apply","current geographic or cohort availability must be checked"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://ramp.msme.gov.in/ramp/RAMP-initiative/msme-team-initiative/msme-team-initiative","route":"follow the current TEAM onboarding and ONDC partner route","implementing_agency":"National Small Industries Corporation","technical_partner":"Open Network for Digital Commerce"},
        "fine_print":{"outlay_inr":2773500000,"duration":"2024-27","catalogue_support_cap_inr":2500,"account_management_support_cap_inr":5000,"support_components":["awareness and workshops","ONDC onboarding","catalogue creation","account management","transport and logistics subsidy","packaging subsidy","packaging design support"],"expected_impact_mse_count":500000,"review_note":"Confirm current onboarding eligibility, partner availability, geographic coverage, SKU caps, logistics and packaging terms before publication."},
        "benefit_summary":{"types":["market_access","training","subsidy"],"summary":"Digital-market onboarding and capped catalogue, account-management, logistics and packaging support through the current TEAM partner route."},
        "benefit_type":"market_access",
        "benefit_label":"ONDC onboarding and digital market-access support",
        "benefit_conditions":{"mse_route_required":true,"current_ondc_partner_route_required":true},
        "requirement":"Eligible MSE and digital catalogue readiness",
        "requirement_description":"The enterprise must be eligible under the current TEAM route and provide the product and business information needed for onboarding and catalogue creation.",
        "rules":{"all":[{"field":"enterprise_size","operator":"in","value":["micro","small"]},{"field":"team_onboarding_route_available","operator":"equals","value":true},{"field":"product_catalogue_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Prepare the business and product catalogue","description":"Collect enterprise, product, pricing and fulfilment information needed for the current digital onboarding route.","url":"https://ramp.msme.gov.in/ramp/RAMP-initiative/msme-team-initiative/msme-team-initiative"},{"title":"Use the official TEAM/ONDC partner route","description":"Follow the current onboarding process and confirm which support caps apply to the enterprise.","url":"https://ramp.msme.gov.in/ramp/RAMP-initiative/msme-team-initiative/msme-team-initiative"}],
        "window_type":"rolling",
        "window_label":"Onboarding is partner and cohort dependent; current availability and support caps require confirmation.",
        "window_evidence":{"source_url":"https://ramp.msme.gov.in/ramp/RAMP-initiative/msme-team-initiative/msme-team-initiative","anchor":"Scheme Components and Partners"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, official_url)
    select item->>'authority', 'central', 'Ministry of Micro, Small and Medium Enterprises', item->>'authority_url'
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
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', case when item ? 'amount_max' then (item->>'amount_max')::numeric else null end, case when item ? 'percentage' then (item->>'percentage')::numeric else null end, item->'benefit_conditions'
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
