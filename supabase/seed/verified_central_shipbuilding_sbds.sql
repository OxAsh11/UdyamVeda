-- Shipbuilding Development Scheme (SbDS) component records.
-- These records deliberately separate greenfield clusters, brownfield
-- expansion and credit-risk coverage.

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
        "slug":"shipbuilding-development-scheme-greenfield-cluster",
        "name":"Shipbuilding Development Scheme - Greenfield Shipbuilding Cluster Development",
        "type":"shipbuilding_cluster_grant",
        "authority":"Ministry of Ports, Shipping and Waterways - National Shipbuilding Mission",
        "authority_url":"https://shipmin.gov.in/",
        "canonical_url":"https://shipmin.gov.in/en/content/guidelines-greenfield-shipbuilding-cluster-development-under-shipbuilding-development-0",
        "source_url":"https://shipmin.gov.in/sites/default/files/Annexure%203%20Greenfield%20guidelines.pdf",
        "source_kind":"guideline",
        "source_title":"Guidelines for Greenfield Shipbuilding Cluster Development under SbDS",
        "source_anchor":"Pages 1-5 and monitoring sections: SPV, anchor shipyard, eligible items, capital assistance and approval validity",
        "summary":"An SbDS capital-assistance route for State-Centre or eligible Central-entity SPVs establishing greenfield shipbuilding clusters with shared marine and landside infrastructure.",
        "objective":"Help States, Central entities, SPVs and prospective anchor shipyards understand the cluster-creation route, project/DPR obligations, shared infrastructure support and investor-readiness conditions.",
        "legal_basis":"Shipbuilding Development Scheme (SbDS) Greenfield Shipbuilding Cluster guidelines under the National Shipbuilding Mission and Ministry of Ports, Shipping and Waterways framework.",
        "eligibility":{"entity_types":["state_government_entity","central_government_entity","special_purpose_vehicle","anchor_shipyard","public_sector_entity","private_shipyard_partner"],"lifecycle_stages":["new_project","infrastructure_expansion","scaling"],"industries":["shipbuilding","ship_repair","marine_engineering","maritime_manufacturing","port_linked_industry"],"locations":["India"],"conditions":["the proposal is for an approved or eligible greenfield shipbuilding cluster and not an ordinary standalone yard subsidy","the SPV has the required State-Centre or eligible Central-entity structure and responsibilities","the SPV prepares a prescribed Detailed Project Report and identifies eligible cluster infrastructure","the cluster secures the applicable in-principle/final approval, implementation-agency and National Shipbuilding Mission route","the project can meet KPIs, quarterly reporting, monitoring, climate-resilience, insurance and utilization conditions"],"thresholds":{"valid_from":"2025-09-24","approval_deadline":"2036-03-31","spv_structure":"generally 50:50 State-Centre for a State-led SPV; eligible Central entity may establish independently","common_infrastructure_support":"current official implementation overview describes 100% central capital assistance for common maritime infrastructure; eligible items and sanction control"},"exclusions":["ordinary private development without an eligible SPV/cluster route","all proposed infrastructure is not automatically funded; support is limited to eligible items essential to cluster viability","anchor-shipyard commercial assets and common maritime assets remain distinct","capital assistance is subject to DPR, approval, KPI, monitoring and utilization evidence","scheme outlay and current cluster status are not an individual applicant entitlement"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://dgma.gov.in/pillar3-shipbuilding-development-scheme","route":"Form the eligible SPV or Central-entity proposal, prepare the prescribed DPR and infrastructure/KPI plan, obtain the required in-principle and final approvals through NSbM/IA, and follow the current DGMA or Ministry route","applicant_note":"UdyamVeda can prepare a cluster, SPV, DPR, anchor-investor, KPI, permissions and funding checklist, but cannot act as NSbM/IA or certify a Government approval","selection":"NSbM and implementation-agency appraisal, in-principle/final approval, tranche release, monitoring and utilization verification"},
        "fine_print":{"capital_assistance":"The official guideline limits assistance to eligible items essential for cluster viability and does not require the Government to fund every proposed item.","spv":"The official guideline describes a Special Purpose Vehicle, generally involving a State Government entity and Central Government entity; a Central entity may establish independently where allowed.","assets":["dry docks","slipways","ship lifts","fabrication areas","utilities","common maritime assets","breakwaters","dredged channels","turning basins","shared infrastructure"],"monitoring":"KPIs may include annual GT output, capacity utilization, ancillary-industry investment/output, jobs, local content and environmental compliance; quarterly physical and financial reporting is required.","risk":"Climate-resilient and disaster-mitigation features, insurance and other risk cover are required according to the current guideline and implementation instructions.","review_note":"Confirm current State/Centre SPV, eligible location, cluster approval, DPR format, eligible items, capital-assistance percentage, anchor-shipyard responsibilities, implementation agency, tranche rules, KPI, reporting and utilization conditions before publication."},
        "benefit_summary":{"types":["capital_assistance","cluster_infrastructure","shipbuilding_ecosystem_support"],"summary":"Potential capital assistance for eligible greenfield shipbuilding-cluster infrastructure through the approved SPV/central-entity route; it is not a general company grant or a guaranteed anchor-investor benefit.","separate_value_buckets":true},
        "benefit_type":"capital_assistance",
        "benefit_label":"Greenfield shipbuilding cluster capital assistance",
        "benefit_conditions":{"eligible_spv_or_central_entity_required":true,"dpr_required":true,"eligible_cluster_infrastructure_required":true,"nsbm_approval_required":true,"quarterly_reporting_required":true,"no_individual_company_entitlement":true},
        "requirement":"Eligible SPV/Central entity and approved cluster DPR",
        "requirement_description":"Prepare SPV/entity documents, land and location evidence, cluster DPR, eligible-item schedule, anchor-shipyard and common-asset plan, funding structure, KPI, climate-resilience, insurance, implementation and reporting documents.",
        "rules":{"all":[{"field":"eligible_greenfield_cluster_entity","operator":"equals","value":true},{"field":"greenfield_cluster_dpr_ready","operator":"equals","value":true},{"field":"nsbm_or_ia_route_confirmed","operator":"equals","value":true},{"field":"eligible_cluster_infrastructure_identified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm the eligible cluster structure","description":"Determine whether the proposal is a State-Centre SPV or eligible Central-entity cluster and identify the NSbM/IA route.","url":"https://shipmin.gov.in/sites/default/files/Annexure%203%20Greenfield%20guidelines.pdf"},{"title":"Prepare the cluster DPR","description":"Document location, land, common maritime and landside assets, anchor shipyard, eligible items, cost, funding, KPIs and implementation responsibilities.","url":"https://shipmin.gov.in/en/content/guidelines-greenfield-shipbuilding-cluster-development-under-shipbuilding-development-0"},{"title":"Secure approvals and investor route","description":"Follow the current NSbM/IA process for in-principle and final approval and coordinate the anchor-shipyard and State/Central entity obligations.","url":"https://dgma.gov.in/pillar3-shipbuilding-development-scheme"},{"title":"Track tranches and monitoring","description":"Maintain quarterly physical/financial progress, IPMA or IA monitoring, utilization, climate-resilience and insurance records.","url":"https://shipmin.gov.in/guideline/guidelines-shipping"}],
        "window_type":"fixed",
        "window_label":"SbDS guidelines are valid for applications approved from 24 September 2025 through 31 March 2036; current cluster intake, location approval and implementation capacity require confirmation.",
        "window_evidence":{"source_url":"https://shipmin.gov.in/sites/default/files/Annexure%203%20Greenfield%20guidelines.pdf","anchor":"Validity from 24 September 2025 to 31 March 2036; SPV and capital-assistance provisions"},
        "review_note":"Confirm the live greenfield cluster pipeline, SPV and State/Centre structure, eligible items, capital-assistance rate, DPR and approval route before approval. Do not represent this as an ordinary startup grant."
      },
      {
        "slug":"shipbuilding-development-scheme-brownfield-capacity-expansion",
        "name":"Shipbuilding Development Scheme - Brownfield Capacity Expansion",
        "type":"shipyard_capacity_grant",
        "authority":"Ministry of Ports, Shipping and Waterways - National Shipbuilding Mission",
        "authority_url":"https://shipmin.gov.in/",
        "canonical_url":"https://shipmin.gov.in/en/content/guidelines-brownfield-capacity-expansion-under-shipbuilding-development-scheme-sbds",
        "source_url":"https://shipmin.gov.in/sites/default/files/Annexure%204%20Brownfield_V23%20%282%29_0.pdf",
        "source_kind":"guideline",
        "source_title":"Guidelines for Brownfield Capacity Expansion under SbDS",
        "source_anchor":"Pages 1-3 and Section 5.10: existing shipyard, approved project cost, 25% grant, financial closure and tranche release",
        "summary":"An SbDS capital-assistance grant for existing Indian shipyards expanding, modernizing or technologically upgrading shipbuilding and repair facilities.",
        "objective":"Help existing shipyards prepare a Brownfield Capacity Expansion DPR, establish financial closure, calculate the 25% capital assistance boundary and track milestone-based grant release.",
        "legal_basis":"Shipbuilding Development Scheme (SbDS) Brownfield Capacity Expansion guidelines under the National Shipbuilding Mission and Ministry of Ports, Shipping and Waterways framework.",
        "eligibility":{"entity_types":["shipyard","company","private_limited_company","public_limited_company","public_sector_shipyard","joint_venture"],"lifecycle_stages":["operating","growth","scaling","manufacturing_expansion"],"industries":["shipbuilding","ship_repair","marine_engineering","maritime_manufacturing"],"locations":["India"],"conditions":["the applicant is an existing Indian shipyard with the required operating history and current guideline eligibility","the project expands, modernizes or upgrades shipbuilding or repair capacity and contains eligible items under Schedule I","the applicant prepares a prescribed DPR and obtains IA/NSbM approval","the applicant demonstrates complete financial closure for the approved project cost before the first grant instalment","the project accepts third-party monitoring, completion certification, utilization and milestone reporting"],"thresholds":{"valid_from":"2025-09-24","approval_deadline":"2036-03-31","capital_assistance_percent":25,"capital_assistance_cap_inr_per_shipyard":150000000000,"grant_tranches_percent":[15,30,35,20],"operating_history":"existing shipyard operational for at least 3 years before 24 September 2025"},"exclusions":["new greenfield clusters belong to the separate Greenfield component","capital assistance is calculated case-by-case on approved eligible project cost and is not a guaranteed maximum for every applicant","a later project phase or expansion requires fresh application and appraisal","the first instalment requires complete financial closure for the entire expansion","unsupported land, ordinary working capital, ineligible assets or costs outside Schedule I cannot be assumed eligible","sanction, grant release, monitoring and completion are conditional"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://dgma.gov.in/pillar3-shipbuilding-development-scheme","route":"Confirm the existing-yard eligibility, prepare the prescribed DPR and eligible-item cost plan, demonstrate financial closure, and apply through the current IA/NSbM route","applicant_note":"UdyamVeda can prepare the expansion, funding, DPR, financial-closure and milestone checklist, but cannot certify project cost or represent a shipyard before NSbM/IA","selection":"IA/NSbM appraisal, approved project cost, grant sanction, four milestone tranches, monitoring and completion certification"},
        "fine_print":{"grant_rate":"The Brownfield guideline states that Approved Capital Assistance is a grant equal to 25% of Approved Project Cost, estimated case-by-case by the IA.","cap":"The current official implementation overview describes up to INR 1,500 crore per shipyard; the controlling guideline, approved project cost and sanction govern.","tranches":[15,30,35,20],"financial_closure":"The first 15% instalment is released only after complete financial closure for the entire expansion is demonstrated through equity, debt and funding-plan evidence.","monitoring":"Third-party monitoring, progress reports, utilization certificates and a project completion certificate are required before later/final tranches.","review_note":"Confirm the current operating-history test, Schedule I, eligible cost, INR 1,500 crore cap, financial-closure documents, IA/NSbM route, tranche triggers, monitoring and completion conditions before publication."},
        "benefit_summary":{"types":["capital_assistance","grant","capacity_expansion"],"summary":"Potential 25% capital-assistance grant for an eligible existing Indian shipyard's approved brownfield expansion, subject to the project-cost cap, financial closure, milestones and verification.","separate_value_buckets":true},
        "benefit_type":"capital_assistance",
        "benefit_label":"Brownfield shipyard expansion capital assistance",
        "benefit_conditions":{"existing_shipyard_required":true,"three_year_operating_history_required":true,"approved_project_cost_required":true,"financial_closure_required":true,"milestone_tranches_required":true,"no_automatic_sanction":true},
        "requirement":"Existing Indian shipyard and approved brownfield DPR",
        "requirement_description":"Prepare shipyard history, DPR, eligible-item schedule, project cost, technical design, equity/debt commitments, CA-certified funding plan, permits, procurement, KPI, monitoring and completion evidence.",
        "rules":{"all":[{"field":"existing_indian_shipyard","operator":"equals","value":true},{"field":"shipyard_operational_three_years_before_2025_09_24","operator":"equals","value":true},{"field":"brownfield_expansion_dpr_ready","operator":"equals","value":true},{"field":"complete_financial_closure_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm existing-shipyard eligibility","description":"Verify operating history, Indian registration and the distinction between brownfield expansion and the separate greenfield component.","url":"https://shipmin.gov.in/sites/default/files/Annexure%204%20Brownfield_V23%20%282%29_0.pdf"},{"title":"Prepare the DPR and eligible cost","description":"List the expansion, modernization and technology-upgrade items under Schedule I and prepare the approved-project-cost calculation.","url":"https://shipmin.gov.in/en/content/guidelines-brownfield-capacity-expansion-under-shipbuilding-development-scheme-sbds"},{"title":"Close the funding plan","description":"Secure equity and debt commitments for the full project cost excluding the grant and obtain the required CA-certified funding plan.","url":"https://shipmin.gov.in/sites/default/files/Annexure%204%20Brownfield_V23%20%282%29_0.pdf"},{"title":"Apply and track four tranches","description":"Use the current IA/NSbM route and track 15%, 30%, 35% and 20% tranches against financial closure, progress, utilization and completion certification.","url":"https://dgma.gov.in/pillar3-shipbuilding-development-scheme"}],
        "window_type":"fixed",
        "window_label":"SbDS guidelines are valid for applications approved from 24 September 2025 through 31 March 2036; current project intake and IA capacity require confirmation.",
        "window_evidence":{"source_url":"https://shipmin.gov.in/sites/default/files/Annexure%204%20Brownfield_V23%20%282%29_0.pdf","anchor":"Validity from 24 September 2025 to 31 March 2036; Section 5.10 capital assistance and tranche rules"},
        "review_note":"Confirm the current Brownfield route, three-year history, Schedule I, project-cost cap, grant calculation, financial closure, tranche triggers and completion certification before approval."
      },
      {
        "slug":"shipbuilding-development-scheme-risk-coverage",
        "name":"Shipbuilding Development Scheme - Shipbuilding Risk Coverage",
        "type":"credit_risk_coverage",
        "authority":"Ministry of Ports, Shipping and Waterways - National Shipbuilding Mission",
        "authority_url":"https://shipmin.gov.in/",
        "canonical_url":"https://shipmin.gov.in/en/content/guidelines-shipbuilding-risk-coverage-under-shipbuilding-development-scheme-sbds-0",
        "source_url":"https://shipmin.gov.in/sites/default/files/Annexure%202%20Credit%20risk%20coverage%20guidelines_0.pdf",
        "source_kind":"guideline",
        "source_title":"Guidelines for Shipbuilding Risk Coverage under SbDS",
        "source_anchor":"Pages 1-3: validity, credit-risk coverage agencies, pre-shipment, post-shipment and vendor-default risks",
        "summary":"An SbDS risk-coverage component for Government-nominated agencies to design and administer insurance products covering specified shipbuilding-related pre-shipment, post-shipment and vendor-default risks.",
        "objective":"Help shipyards and maritime financiers understand the risk-coverage architecture, distinguish it from a direct grant or loan guarantee, and identify the current insurer/agency product before relying on it.",
        "legal_basis":"Shipbuilding Development Scheme (SbDS) Shipbuilding Risk Coverage guidelines under the National Shipbuilding Mission and Ministry of Ports, Shipping and Waterways framework.",
        "eligibility":{"entity_types":["shipyard","shipbuilding_company","vessel_buyer","lender","credit_risk_coverage_agency","insurance_provider","vendor"],"lifecycle_stages":["operating","growth","scaling","contract_execution"],"industries":["shipbuilding","ship_repair","marine_equipment","maritime_manufacturing","shipping_finance"],"locations":["India"],"conditions":["the risk falls within an approved SbDS shipbuilding-related coverage product","the applicant or insured party satisfies the current insurer/credit-risk agency and vessel/project terms","a Government-nominated Credit Risk Cover Agency or approved implementation route is available","the policy, premium, exclusions, claim process, security and documentation are confirmed before contract reliance","the application/project fits the SbDS validity and approval boundary"],"thresholds":{"valid_from":"2025-09-24","approval_deadline":"2036-03-31","coverage_types":["pre_shipment_insurance","post_shipment_insurance","vendor_default_insurance"],"implementation_agency":"Sagarmala Financial Corporation Limited"},"exclusions":["this record is not a direct grant, loan, equity investment or unconditional Government guarantee","coverage is not automatic merely because a shipyard or vessel qualifies for another SbDS component","premiums, deductibles, exclusions, claim settlement and agency product terms must be confirmed","risks outside the approved product, project or policy terms are excluded","draft or proposed products must not be represented as available insurance"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://dgma.gov.in/pillar3-shipbuilding-development-scheme","route":"Identify the approved Credit Risk Cover Agency and current product, confirm the risk and insured party, then apply through the current agency/implementation route with contract, project, vendor and financial evidence","applicant_note":"UdyamVeda can prepare a risk, contract, vendor and insurance-readiness checklist, but cannot issue coverage, guarantee a claim or replace the nominated agency","fees":"Confirm current premium, deductible, valuation, policy, agency and professional charges from the live product","selection":"Agency/product eligibility, underwriting or risk assessment, policy/coverage issuance and claim handling under current product terms"},
        "fine_print":{"coverage_scope":["buyer default or cancellation during construction","non-payment after delivery due to disputes, defects or other covered causes","vendor failure to deliver components or equipment"],"agency":"The guideline describes Government-owned entities or PSUs nominated by NSbM as Credit Risk Cover Agencies and identifies Sagarmala Financial Corporation Limited as the implementation agency.","validity":"The guideline states validity for applications approved from 24 September 2025 through 31 March 2036.","product_boundary":"The guidelines establish the architecture; they do not by themselves prove that a particular insurer, premium, policy limit, deductible or claim route is currently live for a specific shipyard or vessel.","review_note":"Confirm the nominated agency, current insurance product, policy wording, premium, deductible, exclusions, claim process, project approval and current portal before publication. Do not describe SbDS risk coverage as a guaranteed subsidy or loan guarantee."},
        "benefit_summary":{"types":["credit_risk_coverage","insurance","risk_mitigation"],"summary":"Potential access to an approved shipbuilding-risk coverage product for pre-shipment, post-shipment or vendor-default risks; availability and terms depend on the nominated agency and live policy.","separate_value_buckets":true},
        "benefit_type":"credit_risk_coverage",
        "benefit_label":"Shipbuilding pre/post-shipment and vendor-default risk coverage",
        "benefit_conditions":{"approved_product_required":true,"nominated_agency_required":true,"project_and_contract_terms_required":true,"premium_and_policy_required":true,"no_guaranteed_claim":true},
        "requirement":"Shipbuilding contract, risk assessment and live coverage product",
        "requirement_description":"Prepare shipyard, vessel, buyer, vendor, contract, delivery, payment, financial, risk, security and claim evidence required by the nominated Credit Risk Cover Agency and live policy.",
        "rules":{"all":[{"field":"shipbuilding_project_or_contract_identified","operator":"equals","value":true},{"field":"sbds_risk_type_identified","operator":"in","value":["pre_shipment","post_shipment","vendor_default"]},{"field":"approved_credit_risk_product_confirmed","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Classify the shipbuilding risk","description":"Determine whether the exposure is pre-shipment, post-shipment or vendor default and identify the affected contract, buyer, vessel or supplier.","url":"https://shipmin.gov.in/sites/default/files/Annexure%202%20Credit%20risk%20coverage%20guidelines_0.pdf"},{"title":"Confirm the nominated agency and product","description":"Verify the live Credit Risk Cover Agency, Sagarmala/NSbM implementation route, policy wording, premium, deductible and exclusions.","url":"https://dgma.gov.in/pillar3-shipbuilding-development-scheme"},{"title":"Prepare underwriting evidence","description":"Assemble contract, buyer, vendor, project, payment, delivery, financial and risk evidence in the format required by the live product.","url":"https://shipmin.gov.in/en/content/guidelines-shipbuilding-risk-coverage-under-shipbuilding-development-scheme-sbds-0"},{"title":"Issue and monitor coverage","description":"Complete policy issuance, retain premium and endorsement evidence, monitor conditions and follow the approved claim route if a covered event occurs.","url":"https://shipmin.gov.in/guideline/guidelines-shipping"}],
        "window_type":"fixed",
        "window_label":"SbDS risk-coverage guidelines apply to applications approved from 24 September 2025 through 31 March 2036; current policy/product availability requires live agency confirmation.",
        "window_evidence":{"source_url":"https://shipmin.gov.in/sites/default/files/Annexure%202%20Credit%20risk%20coverage%20guidelines_0.pdf","anchor":"Page 1: validity, Credit Risk Cover Agencies, implementation agency and coverage types"},
        "review_note":"Confirm the live nominated agency, insurance/product terms, premium, deductible, exclusions, policy limits, claim route and project approval before approval. This is risk coverage, not a cash benefit."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    select id into authority_id from public.authorities where name = item->>'authority' and level = 'central' order by created_at, id limit 1;
    if authority_id is null then
      insert into public.authorities (name, level, ministry, department, official_url)
    values (item->>'authority', 'central', 'Ministry of Ports, Shipping and Waterways', 'National Shipbuilding Mission', item->>'authority_url')
    returning id into authority_id;
    else
      update public.authorities set official_url = item->>'authority_url' where id = authority_id;
    end if;
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.88, 0.84, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true)
    on conflict do nothing;
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, 'https://shipmin.gov.in/en/orders/guideline', 'notice_index', 'Ministry of Ports SbDS guideline index', 'Greenfield, Brownfield and Risk Coverage listings', now(), false),
      (version_id, 'https://shipmin.gov.in/guideline/guidelines-shipping', 'scheme_page', 'Ministry of Ports shipping guidelines overview', 'Current SbDS component routes', now(), false),
      (version_id, 'https://dgma.gov.in/pillar3-shipbuilding-development-scheme', 'implementing_portal', 'DGMA SbDS implementation overview', 'Current component status and implementation route', now(), false)
    on conflict do nothing;
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, conditions)
    values (version_id, item->>'benefit_type', item->>'benefit_label', item->'benefit_conditions')
    on conflict do nothing;
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    values (version_id, 'shipbuilding', item->>'requirement', item->>'requirement_description', true)
    on conflict do nothing;
    insert into public.eligibility_rule_sets (opportunity_version_id, rules, source_evidence, reviewed)
    values (version_id, item->'rules', jsonb_build_array(jsonb_build_object('source_url', item->>'source_url', 'anchor', item->>'source_anchor')), false)
    on conflict do nothing;
    insert into public.opportunity_steps (opportunity_version_id, step_number, title, description, official_url)
    select version_id, row_number() over ()::integer, step->>'title', step->>'description', step->>'url'
    from jsonb_array_elements(item->'steps') as steps(step)
    on conflict do nothing;
    insert into public.opportunity_windows (opportunity_version_id, window_type, label, source_evidence)
    values (version_id, item->>'window_type', item->>'window_label', item->'window_evidence')
    on conflict do nothing;
    insert into public.review_tasks (opportunity_version_id, task_type, status)
    values (version_id, 'publish', 'open')
    on conflict do nothing;
  end loop;
end $$;
