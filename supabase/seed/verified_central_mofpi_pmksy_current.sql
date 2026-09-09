-- Current MoFPI/PMKSY opportunity records from official pages, FAQs and
-- guidelines. They are structured editorial drafts, not public approvals.

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
        "slug":"mofpi-integrated-cold-chain-value-addition-pmksy",
        "name":"Integrated Cold Chain and Value Addition Infrastructure (PMKSY)",
        "type":"grant",
        "authority":"Ministry of Food Processing Industries - PMKSY",
        "authority_url":"https://mofpi.gov.in/",
        "canonical_url":"https://mofpi.gov.in/en/Schemes/cold-chain/pattern-assistance-0",
        "source_url":"https://www.mofpi.gov.in/en/announcements/revised-operational-guidelines-dated-22052025-respect-component-scheme-integrated-cold",
        "source_kind":"guideline",
        "source_title":"Revised operational guidelines dated 22.05.2025 for Integrated Cold Chain and Value Addition Infrastructure",
        "source_anchor":"Component scope and current operational guidelines",
        "summary":"Project-based PMKSY grant support for cold storage, pack houses, pre-cooling, transport, value-addition and eligible irradiation infrastructure across the food supply chain.",
        "objective":"Create integrated post-harvest cold-chain and value-addition infrastructure that reduces loss, improves shelf life and connects food producers with processing and markets.",
        "legal_basis":"Integrated Cold Chain and Value Addition Infrastructure component of Pradhan Mantri Kisan Sampada Yojana (PMKSY), administered by the Ministry of Food Processing Industries.",
        "eligibility":{"entity_types":["company","partnership","proprietorship","fpo","cooperative","shg","ngo","central_psu","state_psu","joint_venture","entrepreneur_group"],"lifecycle_stages":["pre_start","expansion","modernisation","operate","market_entry"],"industries":["food_processing","agriculture_value_chain","cold_chain","food_irradiation","logistics","dairy","meat","poultry","fish","horticulture"],"locations":["India","north_east","himalayan_state","itdp_area","island","difficult_area"],"conditions":["the proposal must fit the current component and eligible project-cost definition","promoter contribution, term-loan and project-execution evidence are required for grant release","the relevant EOI must be open and the proposed facility must satisfy current technical and food-safety requirements","the irradiation deadline applies only to the specified multiproduct irradiation EOI, not to every cold-chain project"],"thresholds":{"maximum_grant_per_project_inr":100000000,"general_area_storage_rate_percent":35,"difficult_area_storage_rate_percent":50,"general_area_value_addition_rate_percent":50,"difficult_area_value_addition_rate_percent":75,"general_area_irradiation_rate_percent":50,"difficult_area_irradiation_rate_percent":75},"unknown_handling":"needs_information"},
        "exclusions":["a business treating the ₹10 crore project ceiling as a guaranteed payment","ordinary working capital, land or non-eligible costs outside the current guideline","an irradiation proposal using the September 2026 deadline without matching the specified 20 May 2026 EOI","a project without promoter, term-loan, land, technical, statutory or implementation evidence","a cold-chain grant presented as a loan, tax benefit or universal subsidy"],
        "application":{"portal":"https://sampada-mofpi.gov.in/","route":"Identify the applicable PMKSY component and submit a project proposal through the SAMPADA route when MoFPI invites the relevant EOI.","selection":"EOI-based project appraisal, technical and financial review, approval by the applicable Ministry process, milestones, utilization evidence and staged grant release.","fees":"Confirm any current portal, appraisal or project-specific fee instruction; no fee is inferred from the scheme record.","applicant_note":"UdyamVeda can prepare the project-readiness checklist and official handoff, but cannot promise approval, submit credentials or act as MoFPI."},
        "fine_print":{"benefit":"The official pattern-of-assistance page describes a project ceiling of ₹10 crore. Rates differ by storage, value-addition/processing and irradiation infrastructure and by general or difficult-area classification.","release":"The official pattern page describes staged releases of 25%, 40% and 35% subject to promoter-contribution and term-loan expenditure milestones.","deadline":"The current MoFPI notice extends the specified multiproduct food irradiation EOI to 17:00 on 30 September 2026. That date must not be displayed for unrelated cold-chain components.","dependencies":"The July 2026 circular list also includes compulsory WDRA registration for cold-storage facilities created under the scheme; current facility and State/UT permissions require review.","review_note":"Confirm the exact 2025 guideline provisions, eligible-cost treatment, project category, EOI scope, fund availability, WDRA dependency, technical documents, release milestones and current portal acceptance before publication."},
        "benefit_summary":{"types":["grant","infrastructure_support","reimbursement"],"summary":"Project-level grant-in-aid for eligible cold-chain and value-addition infrastructure, with component-specific rates and a maximum project ceiling. It is not a guaranteed individual payout and cannot be combined with other scheme values.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"PMKSY cold-chain and value-addition grant; up to ₹10 crore per project subject to current component rules",
        "amount_max":100000000,
        "benefit_conditions":{"project_level_support":true,"maximum_per_project_inr":100000000,"component_specific_rates":true,"staged_release":true,"current_eoi_required":true,"irradiation_deadline_specific_to_eoi":"2026-09-30T17:00:00+05:30"},
        "requirement":"Eligible food-chain project with promoter, financing, technical and statutory evidence",
        "requirement_description":"Prepare entity, land/site, promoter contribution, term-loan, technical design, eligible-cost, capacity, food-safety, environmental and project-implementation evidence required by the current EOI and guidelines.",
        "rules":{"all":[{"field":"eligible_food_chain_entity","operator":"equals","value":true},{"field":"cold_chain_or_value_addition_project_fit_verified","operator":"equals","value":true},{"field":"current_mofpi_eoi_open_or_route_verified","operator":"equals","value":true},{"field":"project_finance_and_statutory_documents_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Classify the PMKSY component","description":"Determine whether the project is storage, transport, value addition, processing or the specified multiproduct irradiation route and confirm the current EOI.","url":"https://mofpi.gov.in/en/Schemes/cold-chain/pattern-assistance-0"},{"title":"Prepare the project and finance dossier","description":"Compile site, technical, eligible-cost, promoter-contribution, term-loan, capacity, statutory and implementation evidence.","url":"https://www.mofpi.gov.in/en/announcements/revised-operational-guidelines-dated-22052025-respect-component-scheme-integrated-cold"},{"title":"Submit through SAMPADA and track milestones","description":"Use the official SAMPADA route during the applicable EOI, retain acknowledgement and track appraisal, approval, utilization and staged release evidence.","url":"https://sampada-mofpi.gov.in/"}],
        "window_type":"call_for_applications",
        "window_label":"Component-specific EOI. The specified multiproduct food irradiation EOI is extended to 17:00 on 30 September 2026; no universal cold-chain deadline is asserted.",
        "window_evidence":{"source_url":"https://mofpi.gov.in/en/announcements/extension-timeline-1700-hrs-30092026-submission-multiproduct-food-irradiation","anchor":"Extension up to 17:00 hrs of 30.09.2026 for multiproduct food irradiation proposals"},
        "review_note":"Current EOI scope, project category, exact eligible costs, fund availability and statutory dependencies require human review."
      },
      {
        "slug":"mofpi-cefppc-food-processing-preservation-capacities-pmksy",
        "name":"Creation/Expansion of Food Processing and Preservation Capacities (CEFPPC)",
        "type":"grant",
        "authority":"Ministry of Food Processing Industries - PMKSY",
        "authority_url":"https://mofpi.gov.in/",
        "canonical_url":"https://mofpi.gov.in/en/Schemes/creation-expansion-food-processing-preservation-capacities-unit-scheme",
        "source_url":"https://mofpi.gov.in/en/Schemes/creation-expansion-food-processing-preservation-capacities-unit-scheme",
        "source_kind":"scheme_page",
        "source_title":"Creation/Expansion of Food Processing/Preservation Capacities (Unit Scheme)",
        "source_anchor":"Objective, covered units, eligible organizations and EOI route",
        "summary":"EOI-based project grant route for setting up new food-processing units or modernising and expanding existing processing and preservation capacity.",
        "objective":"Increase food processing, value addition and shelf life while reducing wastage through new, upgraded or expanded processing and preservation units.",
        "legal_basis":"Creation/Expansion of Food Processing and Preservation Capacities component of PMKSY, administered by the Ministry of Food Processing Industries.",
        "eligibility":{"entity_types":["company","partnership","proprietorship","fpo","cooperative","shg","ngo","central_psu","state_psu","joint_venture","individual"],"lifecycle_stages":["pre_start","expansion","modernisation","operate"],"industries":["food_processing","fruit_processing","vegetable_processing","dairy","meat","poultry","fish","ready_to_eat","ready_to_cook","bakery","grains","pulses","oilseed_processing"],"locations":["India","north_east","himalayan_state","itdp_area","island","difficult_area"],"conditions":["the project must create, modernise or expand an eligible processing or preservation unit","applications are invited through EOI from time to time and are not continuously open by default","the eligible project-cost base, promoter contribution, term loan, capacity and statutory evidence must satisfy the current guidelines","approved project support is not the same as a personal grant or operating subsidy"],"thresholds":{"maximum_grant_per_project_inr":50000000,"general_area_rate_percent":35,"difficult_area_rate_percent":50},"unknown_handling":"needs_information"},
        "exclusions":["a business treating the ₹5 crore ceiling as an assured entitlement","routine working capital or costs excluded by the current eligible-cost rules","a proposal submitted outside an active EOI or without project-finance evidence","an existing unit claiming expansion support without capacity and baseline evidence","a CEFPPC grant presented as PMFME individual-unit support; PMFME is a separate record"],
        "application":{"portal":"https://sampada-mofpi.gov.in/","route":"Prepare the unit project and submit through SAMPADA when MoFPI opens the relevant CEFPPC EOI.","selection":"EOI-based technical and financial appraisal, project approval, milestone and utilization review, with grant release under the applicable guidelines.","fees":"Confirm current portal and appraisal instructions; no fee is inferred from the scheme record.","applicant_note":"UdyamVeda can explain the project route and prepare the evidence checklist, but cannot guarantee approval or file using applicant credentials."},
        "fine_print":{"scope":"The official scheme page covers new units and modernisation or expansion of existing food-processing units across multiple food sectors.","assistance":"The official PMKSY FAQ states 35%/50% of eligible project cost subject to a maximum grant-in-aid/subsidy of ₹5 crore; the applicable rate and eligible cost must be reconciled to the current guideline and promoter category.","window":"MoFPI describes proposals as invited through EOI from time to time. The 2025 EOI and 2026 approved-project status are evidence of operation, not proof that a new application window is open today.","review_note":"Confirm current EOI status, eligible entities, project-cost exclusions, sector list, difficult-area/SC-ST/FPO/SHG treatment, promoter and loan conditions, documents, milestones and current SAMPADA acceptance before publication."},
        "benefit_summary":{"types":["grant","capacity_expansion","infrastructure_support"],"summary":"Project-level grant-in-aid for eligible food-processing and preservation capacity creation or expansion, up to the current scheme ceiling and subject to EOI approval and eligible-cost rules.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"CEFPPC project grant; up to ₹5 crore subject to eligible-cost and EOI rules",
        "amount_max":50000000,
        "benefit_conditions":{"project_level_support":true,"maximum_per_project_inr":50000000,"general_area_rate_percent":35,"difficult_area_rate_percent":50,"eoi_required":true,"approval_and_milestones_required":true},
        "requirement":"Eligible new or existing food-processing unit with a financeable capacity project",
        "requirement_description":"Prepare entity, project report, existing/proposed capacity, site, plant and machinery, eligible-cost, promoter contribution, term-loan, food-safety and statutory documents required by the current CEFPPC EOI.",
        "rules":{"all":[{"field":"eligible_food_processing_entity","operator":"equals","value":true},{"field":"new_or_expansion_unit_project","operator":"equals","value":true},{"field":"current_cefppc_eoi_open_or_route_verified","operator":"equals","value":true},{"field":"project_and_finance_documents_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Check current CEFPPC EOI","description":"Confirm that MoFPI is accepting proposals and identify any category, geography or sector restrictions in the live EOI.","url":"https://mofpi.gov.in/en/Schemes/creation-expansion-food-processing-preservation-capacities-unit-scheme/download-circulars-1"},{"title":"Build the unit project dossier","description":"Document existing or proposed capacity, technology, plant and machinery, eligible costs, financing, promoter contribution and statutory readiness.","url":"https://mofpi.gov.in/en/Schemes/creation-expansion-food-processing-preservation-capacities-unit-scheme/download-guidelines-1"},{"title":"Submit through SAMPADA and retain approval evidence","description":"Submit during the applicable EOI, retain acknowledgement and track appraisal, approval, utilization and milestone evidence.","url":"https://sampada-mofpi.gov.in/"}],
        "window_type":"call_for_applications",
        "window_label":"EOI-based and intermittent. MoFPI invites CEFPPC proposals from time to time; the latest EOI and approved-project status must be checked before an application is presented as actionable.",
        "window_evidence":{"source_url":"https://mofpi.gov.in/en/Schemes/creation-expansion-food-processing-preservation-capacities-unit-scheme/download-circulars-1","anchor":"Current EOI, FAQ and approved-project-status notices"},
        "review_note":"Current EOI opening, category restrictions, project-cost treatment, amendment history and portal acceptance require human review."
      },
      {
        "slug":"mofpi-agro-processing-cluster-pmksy",
        "name":"Creation of Infrastructure for Agro Processing Clusters (APC)",
        "type":"grant",
        "authority":"Ministry of Food Processing Industries - PMKSY",
        "authority_url":"https://mofpi.gov.in/",
        "canonical_url":"https://www.mofpi.gov.in/en/announcements/operational-guidelines-scheme-creation-infrastructure-agro-processing-clusters-apc",
        "source_url":"https://www.mofpi.gov.in/en/announcements/operational-guidelines-scheme-creation-infrastructure-agro-processing-clusters-apc",
        "source_kind":"guideline",
        "source_title":"Operational guidelines for Creation of Infrastructure for Agro Processing Clusters (APC) under PMKSY",
        "source_anchor":"Objective, common infrastructure and current 25 April 2025 guidelines",
        "summary":"Cluster-based project grant route for common enabling and core processing infrastructure that links producers, processors and markets.",
        "objective":"Create modern common infrastructure and facilities in a cluster so groups of producers or farmers can connect to food processors and markets through an equipped supply chain.",
        "legal_basis":"Creation of Infrastructure for Agro Processing Clusters component of PMKSY, administered by the Ministry of Food Processing Industries.",
        "eligibility":{"entity_types":["company","partnership","proprietorship","fpo","cooperative","shg","ngo","central_psu","state_psu","joint_venture","entrepreneur_group"],"lifecycle_stages":["pre_start","expansion","operate","market_entry"],"industries":["food_processing","agriculture_value_chain","cold_chain","warehousing","logistics","dairy","meat","poultry","fish","horticulture"],"locations":["India","north_east","himalayan_state","itdp_area","island","difficult_area"],"conditions":["the proposal must establish or strengthen a cluster with common enabling or core processing infrastructure","the project must link producers or farmers with processors and markets and satisfy current cluster design requirements","applications depend on an active MoFPI EOI and project-level appraisal","common infrastructure grant support must not be presented as an individual-unit cash entitlement"],"thresholds":{"maximum_grant_per_project_inr":100000000,"general_area_rate_percent":35,"difficult_area_rate_percent":50},"unknown_handling":"needs_information"},
        "exclusions":["an individual business treating the ₹10 crore project ceiling as its own guaranteed grant","a standalone unit proposal with no eligible cluster/common-infrastructure rationale","working capital or ineligible land and construction costs outside the current guidelines","a project submitted without producer, processor, market, financing and statutory evidence","a cluster grant presented as PMFME unit assistance or a cold-chain-only benefit"],
        "application":{"portal":"https://sampada-mofpi.gov.in/","route":"Develop the cluster proposal and submit through SAMPADA when MoFPI invites the current APC EOI.","selection":"EOI-based cluster appraisal covering common infrastructure, producer/processor linkage, finance, technical feasibility, implementation and utilization milestones.","fees":"Confirm current portal and appraisal instructions; no fee is inferred from the scheme record.","applicant_note":"UdyamVeda can help structure the cluster-readiness dossier and official handoff, but cannot form or represent a project SPV or guarantee approval."},
        "fine_print":{"scope":"The official PMKSY FAQ describes basic enabling infrastructure such as internal roads, boundary wall, ETP/STP, water and power supply and core facilities such as warehouse, cold storage and ripening chamber.","assistance":"The official FAQ states 35%/50% of eligible project cost subject to a maximum grant-in-aid/subsidy of ₹10 crore; the current guideline controls eligible cost, applicant structure and project conditions.","window":"The current APC guideline and circular pages show an EOI-based route and project-status notices. A historical or status notice does not establish that a fresh EOI is open.","review_note":"Confirm current EOI status, cluster-area and common-infrastructure conditions, applicant/SPV route, project-cost exclusions, promoter contribution, documents, milestones and amendment history before publication."},
        "benefit_summary":{"types":["grant","cluster_infrastructure","market_access_support"],"summary":"Project-level grant-in-aid for common agro-processing-cluster infrastructure, subject to eligible-cost rules, EOI selection and implementation milestones. It is not an individual working-capital or universal subsidy benefit.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"APC cluster infrastructure grant; up to ₹10 crore subject to eligible-cost and EOI rules",
        "amount_max":100000000,
        "benefit_conditions":{"project_level_support":true,"maximum_per_project_inr":100000000,"general_area_rate_percent":35,"difficult_area_rate_percent":50,"cluster_common_infrastructure_required":true,"eoi_required":true},
        "requirement":"Cluster proposal with producer, processor, market, finance and common-infrastructure evidence",
        "requirement_description":"Prepare cluster map, producer and processor linkages, common-facility plan, site and utilities, project cost, financing, implementation structure, statutory permissions and market evidence.",
        "rules":{"all":[{"field":"eligible_cluster_entity_or_project_structure","operator":"equals","value":true},{"field":"agro_processing_cluster_fit_verified","operator":"equals","value":true},{"field":"current_apc_eoi_open_or_route_verified","operator":"equals","value":true},{"field":"cluster_finance_and_statutory_documents_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm the cluster route and current EOI","description":"Review the current APC guideline and circular list for the applicable EOI, applicant structure, cluster conditions and project scope.","url":"https://mofpi.gov.in/Schemes/agro-processing-cluster/download-circulars-2"},{"title":"Prepare the common-infrastructure proposal","description":"Document producer and processor linkages, site, utilities, core facilities, project cost, financing, implementation and market evidence.","url":"https://www.mofpi.gov.in/en/announcements/operational-guidelines-scheme-creation-infrastructure-agro-processing-clusters-apc"},{"title":"Submit through SAMPADA and track milestones","description":"Submit during the applicable EOI, retain acknowledgement and track appraisal, approval, utilization and project-completion evidence.","url":"https://sampada-mofpi.gov.in/"}],
        "window_type":"call_for_applications",
        "window_label":"EOI-based and intermittent. Confirm the current APC call before presenting this route as open or deadline-sensitive.",
        "window_evidence":{"source_url":"https://mofpi.gov.in/Schemes/agro-processing-cluster/download-circulars-2","anchor":"Current EOI, FAQ and approved-project-status notices"},
        "review_note":"Current EOI opening, cluster structure, eligible costs, project area, amendment history and portal acceptance require human review."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Food Processing Industries', null, item->>'authority_url'
    where not exists (select 1 from public.authorities where name = item->>'authority')
    returning id into authority_id;
    if authority_id is null then select id into authority_id from public.authorities where name = item->>'authority' limit 1; end if;

    seed_opportunity_id := null;
    insert into public.opportunities (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (item->>'slug', item->>'name', item->>'type', 'in_review', authority_id, '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, authority_id = excluded.authority_id, canonical_url = excluded.canonical_url
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1; end if;

    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.9, 0.86, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1; end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true),
      (version_id, 'https://mofpi.gov.in/', 'ministry_portal', 'MoFPI official home and PMKSY index', 'PMKSY components and current announcements', now(), false),
      (version_id, 'https://mofpi.gov.in/sites/default/files/pmksy_faqs.pdf', 'faq', 'FAQs on PMKSY component schemes', 'Applicant categories, SAMPADA route and assistance', now(), false),
      (version_id, 'https://sampada-mofpi.gov.in/', 'implementing_portal', 'MoFPI SAMPADA portal', 'Official application handoff', now(), false)
    on conflict do nothing;
    if item->>'slug' = 'mofpi-integrated-cold-chain-value-addition-pmksy' then
      insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
      values
        (version_id, 'https://mofpi.gov.in/en/Schemes/cold-chain/pattern-assistance-0', 'scheme_page', 'MoFPI Cold Chain pattern of assistance', 'Rates, ceiling and release milestones', now(), false),
        (version_id, 'https://mofpi.gov.in/en/Schemes/cold-chain/download-circulars-0', 'ministry_portal', 'MoFPI Cold Chain circulars and irradiation EOI', 'Current EOI and circular list', now(), false),
        (version_id, 'https://mofpi.gov.in/en/announcements/extension-timeline-1700-hrs-30092026-submission-multiproduct-food-irradiation', 'notice', 'MoFPI multiproduct irradiation deadline notice', '17:00 on 30 September 2026', now(), false)
      on conflict do nothing;
    elsif item->>'slug' = 'mofpi-cefppc-food-processing-preservation-capacities-pmksy' then
      insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
      values
        (version_id, 'https://mofpi.gov.in/en/Schemes/creation-expansion-food-processing-preservation-capacities-unit-scheme/download-guidelines-1', 'guideline', 'MoFPI CEFPPC current guidelines', '22 January 2025 guidelines', now(), false),
        (version_id, 'https://mofpi.gov.in/en/Schemes/creation-expansion-food-processing-preservation-capacities-unit-scheme/download-circulars-1', 'ministry_portal', 'MoFPI CEFPPC circulars and project status', 'Current EOI and approved-project-status notices', now(), false)
      on conflict do nothing;
    else
      insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
      values
        (version_id, 'https://www.mofpi.gov.in/en/announcements/operational-guidelines-scheme-creation-infrastructure-agro-processing-clusters-apc', 'guideline', 'MoFPI APC current guidelines', '25 April 2025 operational guidelines', now(), false),
        (version_id, 'https://www.mofpi.gov.in//Schemes/agro-processing-cluster/download-guidelines-2', 'ministry_portal', 'MoFPI APC guideline archive', 'Dated APC guideline revisions', now(), false),
        (version_id, 'https://mofpi.gov.in/Schemes/agro-processing-cluster/download-circulars-2', 'ministry_portal', 'MoFPI APC circulars and project status', 'Current EOI and approved-project-status notices', now(), false)
      on conflict do nothing;
    end if;

    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', (item->>'amount_max')::numeric, null, item->'benefit_conditions'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = item->>'benefit_label');
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'project_readiness', item->>'requirement', item->>'requirement_description', true
    where not exists (select 1 from public.opportunity_requirements where opportunity_version_id = version_id and name = item->>'requirement');
    insert into public.eligibility_rule_sets (opportunity_version_id, rules, source_evidence, reviewed)
    select version_id, item->'rules', jsonb_build_array(jsonb_build_object('source_url', item->>'source_url', 'anchor', item->>'source_anchor')), false
    where not exists (select 1 from public.eligibility_rule_sets where opportunity_version_id = version_id);
    insert into public.opportunity_steps (opportunity_version_id, step_number, title, description, official_url)
    select version_id, row_number() over ()::integer, step->>'title', step->>'description', step->>'url'
    from jsonb_array_elements(item->'steps') as steps(step)
    where not exists (select 1 from public.opportunity_steps where opportunity_version_id = version_id);
    insert into public.opportunity_windows (opportunity_version_id, window_type, closes_at, label, source_evidence)
    select version_id, item->>'window_type',
      case when item->>'slug' = 'mofpi-integrated-cold-chain-value-addition-pmksy' then '2026-09-30 17:00:00+05:30'::timestamptz else null end,
      item->>'window_label', item->'window_evidence'
    where not exists (select 1 from public.opportunity_windows where opportunity_version_id = version_id);
    insert into public.review_tasks (opportunity_version_id, task_type, status)
    select version_id, 'publish', 'open'
    where not exists (select 1 from public.review_tasks where opportunity_version_id = version_id and task_type = 'publish' and status in ('open', 'in_review'));
  end loop;
end $$;
