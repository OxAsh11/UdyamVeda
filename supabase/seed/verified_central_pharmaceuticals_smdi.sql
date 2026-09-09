-- Five separate sub-schemes under the 2024 Scheme for Strengthening of
-- Medical Device Industry (SMDI). All remain review-gated.

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
        "slug":"smdi-common-facilities-medical-device-clusters",
        "name":"SMDI - Common Facilities for Medical Device Clusters",
        "type":"cluster_infrastructure_grant",
        "lifecycle_status":"active",
        "authority":"Department of Pharmaceuticals",
        "authority_url":"https://pharma-dept.gov.in/",
        "canonical_url":"https://pharma-dept.gov.in/schemes/scheme-strengthening-medical-device-industry",
        "source_url":"https://pharma-dept.gov.in/sites/default/files/Final%20guidelines%20for%20SMDI-8.11.2024_0.pdf",
        "source_kind":"guideline",
        "source_title":"Operational Guidelines for Scheme Strengthening of Medical Device Industry",
        "source_anchor":"Chapter II, Common Facilities for Medical Device Clusters: Sections 2.1.4-2.1.5",
        "summary":"Grant support for common facilities and testing facilities serving medical-device clusters, including R&D, design, testing, sterilization and related shared infrastructure.",
        "objective":"Strengthen cluster-level common infrastructure and testing capacity so medical-device manufacturers can access shared facilities and improve domestic manufacturing quality.",
        "legal_basis":"Operational Guidelines for the Central Sector Scheme Strengthening of Medical Device Industry dated 8 November 2024.",
        "eligibility":{"entity_types":["medical_device_cluster","central_government_entity","state_government_entity","private_entity","institution","testing_laboratory","industry_association"],"lifecycle_stages":["new_project","operating","growth","scaling"],"industries":["medical_devices","medical_device_testing","healthcare_equipment","medtech_manufacturing"],"locations":["India"],"conditions":["the proposal serves an identified medical-device cluster or qualifying testing facility","the applicant is eligible under the current operational guidelines and call","the project has the required facility, equipment, cost, co-funding, technical and implementation evidence","the grant is used for eligible common or testing facilities and not ordinary company capex","the current Department/PMA call and proposal route is open or otherwise permits the action"],"thresholds":{"smdi_tenure":"FY 2024-25 to FY 2026-27","component_outlay_inr":11000000000,"common_facility_grant_cap_inr":2000000000,"testing_facility_grant_cap_inr":500000000,"government_entity_assistance_percent":70,"private_entity_assistance_percent":50},"unknown_handling":"needs_information"},
        "exclusions":["ordinary single-company plant or working-capital expenditure","projects outside an eligible cluster or testing-facility route","the grant cap is not a personal or unit-level benefit","proposal submission without current call, eligibility and co-funding confirmation"],
        "application":{"portal":"https://pharma-dept.gov.in/schemes/scheme-strengthening-medical-device-industry","route":"Check the current call, identify the eligible cluster/testing-facility entity, prepare the technical and financial proposal, and submit through the current Department/PMA route","applicant_note":"UdyamVeda can prepare a facility-readiness and proposal checklist but cannot certify cluster eligibility or Government grant approval","selection":"Technical and financial appraisal, Scheme Steering Committee/Department decision, grant release, monitoring and utilization verification","fees":"Confirm current application, certification, project and facility charges"},
        "fine_print":{"support_model":"Grant-in-aid supports shared infrastructure; it is not a subsidy to add to every unit's eligible value.","facility_caps":"Official launch material describes up to INR 20 crore for common facilities and up to INR 5 crore for testing facilities, subject to the applicable percentage and guideline conditions.","cost_share":"The guidelines distinguish Central/State Government-funded entities from private entities for the assistance percentage; current proposal-specific treatment must be verified.","review_note":"Confirm eligible entity, cluster definition, facility list, assistance percentage, cap, co-funding, procurement, current call, PMA route, monitoring and utilization conditions before publication."},
        "benefit_summary":{"types":["grant_in_aid","common_infrastructure","testing_facility"],"summary":"Potential grant support for shared medical-device cluster or testing infrastructure; value is project/facility-specific and not a direct unit-level subsidy.","separate_value_buckets":true},
        "benefit_type":"cluster_infrastructure_grant",
        "benefit_label":"Shared medical-device cluster and testing-facility grant",
        "benefit_conditions":{"eligible_cluster_or_testing_entity_required":true,"project_proposal_required":true,"facility_use_required":true,"cap_applies":true},
        "requirement":"Eligible facility proposal and current SMDI call",
        "requirement_description":"Prepare entity, cluster, facility, equipment, cost, co-funding, technical, procurement, regulatory, implementation and utilization evidence.",
        "rules":{"all":[{"field":"eligible_medical_device_cluster_or_testing_entity","operator":"equals","value":true},{"field":"common_or_testing_facility_identified","operator":"equals","value":true},{"field":"current_smdi_call_confirmed","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm entity and facility route","description":"Determine whether the proposal is for a cluster common facility or testing facility and identify the eligible applicant route.","url":"https://pharma-dept.gov.in/sites/default/files/Final%20guidelines%20for%20SMDI-8.11.2024_0.pdf"},{"title":"Check the current call","description":"Review the current SMDI scheme page and active/revised notice before preparing a proposal.","url":"https://pharma-dept.gov.in/schemes/scheme-strengthening-medical-device-industry"},{"title":"Prepare proposal and co-funding evidence","description":"Document facility need, equipment, cost, assistance percentage, co-funding, implementation and utilization plan.","url":"https://www.pib.gov.in/PressReleasePage.aspx/pib.gov.in/Pressreleaseshare.aspx?PRID=2071850"}],
        "window_type":"call_for_proposals",
        "window_label":"SMDI is a three-year FY 2024-25 to FY 2026-27 framework with current calls and revised notices listed on the official scheme page; applicant-specific availability must be verified.",
        "window_evidence":{"source_url":"https://pharma-dept.gov.in/schemes/scheme-strengthening-medical-device-industry","anchor":"Current page: operational guidelines, apply-online route and 2026 calls/revised notices"},
        "review_note":"Confirm the current call, entity route and facility-specific percentage/cap before publication."
      },
      {
        "slug":"smdi-marginal-investment-reducing-import-dependence",
        "name":"SMDI - Marginal Investment Scheme for Reducing Import Dependence",
        "type":"capital_subsidy",
        "lifecycle_status":"active",
        "authority":"Department of Pharmaceuticals",
        "authority_url":"https://pharma-dept.gov.in/",
        "canonical_url":"https://pharma-dept.gov.in/schemes/scheme-strengthening-medical-device-industry",
        "source_url":"https://pharma-dept.gov.in/sites/default/files/Final%20guidelines%20for%20SMDI-8.11.2024_0.pdf",
        "source_kind":"guideline",
        "source_title":"Operational Guidelines for SMDI - Marginal Investment Scheme",
        "source_anchor":"Chapter III, Marginal Investment Scheme for Reducing Import Dependence",
        "summary":"One-time capital subsidy support for Indian manufacturing of key medical-device components, raw materials and accessories to reduce import dependence.",
        "objective":"Deepen domestic medical-device value chains by supporting marginal investment in key components, raw materials and accessories.",
        "legal_basis":"Operational Guidelines for the Central Sector Scheme Strengthening of Medical Device Industry dated 8 November 2024.",
        "eligibility":{"entity_types":["company","msme","medical_device_manufacturer","component_manufacturer","accessory_manufacturer"],"lifecycle_stages":["new_project","operating","growth","scaling"],"industries":["medical_devices","medical_device_components","medical_device_accessories","medical_materials","healthcare_equipment"],"locations":["India"],"conditions":["the applicant manufactures an eligible key component, raw material or accessory","the proposed investment reduces identified import dependence and fits the current product/technology list","the applicant satisfies the current project, investment, domestic-manufacturing and regulatory conditions","the proposal is submitted through the current Department/PMA call and is approved before subsidy claim"],"thresholds":{"smdi_tenure":"FY 2024-25 to FY 2026-27","component_outlay_inr":18000000000,"capital_subsidy_percent_range":"10% to 20%","maximum_subsidy_inr_per_project":1000000000},"unknown_handling":"needs_information"},
        "exclusions":["finished medical devices or products outside the eligible component/raw-material/accessory list","ordinary working capital or unsupported historical investment","import/distribution without eligible Indian manufacturing","subsidy cap or scheme outlay treated as an individual entitlement"],
        "application":{"portal":"https://pharma-dept.gov.in/schemes/scheme-strengthening-medical-device-industry","route":"Map the component/raw material/accessory to the current list, prepare project and import-dependence evidence, and submit through the current Department/PMA call","applicant_note":"UdyamVeda can prepare product, investment and evidence checklists but cannot certify product eligibility or subsidy approval","selection":"Technical/economic appraisal, approval, eligible investment verification and subsidy release subject to current guidelines","fees":"Confirm current application, certification, testing and professional charges"},
        "fine_print":{"subsidy":"Official launch material describes a one-time capital subsidy of 10% to 20%, capped at INR 10 crore per project.","product_boundary":"Component, raw-material and accessory eligibility must be checked against the current list and import-dependence rationale.","claim_boundary":"Subsidy depends on approved eligible investment and verification; it is not a reimbursement of all project cost.","review_note":"Confirm the current product list, applicant class, eligible investment, subsidy percentage, cap, import baseline, regulatory approvals, PMA route, call deadline and clawback conditions before publication."},
        "benefit_summary":{"types":["capital_subsidy","import_substitution","manufacturing_support"],"summary":"Potential one-time capital subsidy for eligible domestic medical-device component, raw-material or accessory manufacturing, subject to the current list, approved investment and a per-project cap.","separate_value_buckets":true},
        "benefit_type":"capital_subsidy",
        "benefit_label":"Medical-device component and accessory capital subsidy",
        "benefit_conditions":{"eligible_component_required":true,"domestic_manufacturing_required":true,"approved_project_required":true,"subsidy_cap_applies":true},
        "requirement":"Eligible component/accessory project and import-dependence evidence",
        "requirement_description":"Prepare product classification, import baseline, domestic manufacturing plan, project cost, eligible investment, regulatory, technology, financial and audit evidence.",
        "rules":{"all":[{"field":"eligible_medical_device_component_or_accessory_identified","operator":"equals","value":true},{"field":"domestic_manufacturing_project_confirmed","operator":"equals","value":true},{"field":"current_smdi_call_confirmed","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Map the component or accessory","description":"Confirm that the product is within the current eligible list and supports import-dependence reduction.","url":"https://pharma-dept.gov.in/sites/default/files/Final%20guidelines%20for%20SMDI-8.11.2024_0.pdf"},{"title":"Prepare investment and import baseline","description":"Document project cost, eligible investment, current import dependence, domestic capacity and regulatory status.","url":"https://www.pib.gov.in/PressReleasePage.aspx/pib.gov.in/Pressreleaseshare.aspx?PRID=2071850"},{"title":"Submit through the live call","description":"Use the current SMDI/PMA route and retain approval, investment, production and verification records.","url":"https://pharma-dept.gov.in/sites/default/files/Marginal%20Investment%20Scheme-English.pdf"}],
        "window_type":"call_for_proposals",
        "window_label":"The SMDI framework runs through FY 2026-27; the official MIS/MDCSS call recorded a 15 February 2026 deadline, while the current scheme page lists subsequent 2026 calls/revised notices. Verify the applicable live call.",
        "window_evidence":{"source_url":"https://pharma-dept.gov.in/sites/default/files/Marginal%20Investment%20Scheme-English.pdf","anchor":"Call for proposals: MIS RID and MDCSSS, deadline 15 February 2026"},
        "review_note":"Verify current call and eligible product list before publication."
      },
      {
        "slug":"smdi-capacity-building-skill-development-medical-devices",
        "name":"SMDI - Capacity Building and Skill Development for Medical Devices",
        "type":"skill_development_support",
        "lifecycle_status":"active",
        "authority":"Department of Pharmaceuticals",
        "authority_url":"https://pharma-dept.gov.in/",
        "canonical_url":"https://pharma-dept.gov.in/schemes/scheme-strengthening-medical-device-industry",
        "source_url":"https://pharma-dept.gov.in/sites/default/files/Final%20guidelines%20for%20SMDI-8.11.2024_0.pdf",
        "source_kind":"guideline",
        "source_title":"Operational Guidelines for SMDI - Capacity Building and Skill Development",
        "source_anchor":"Capacity Building and Skill Development component: eligible institutions, Masters, diploma and short-term courses",
        "summary":"Support for medical-device education and industry-ready skills through eligible Masters, diploma and short-term programmes delivered by qualifying institutions.",
        "objective":"Build a skilled technical workforce able to design, develop, test and manufacture medical devices.",
        "legal_basis":"Operational Guidelines for the Central Sector Scheme Strengthening of Medical Device Industry dated 8 November 2024, as modified on 9 June 2025.",
        "eligibility":{"entity_types":["central_government_institution","state_government_institution","university","technical_institution","ncvet_approved_institute","industry_training_body"],"lifecycle_stages":["new_project","operating","scaling"],"industries":["medical_devices","medtech_manufacturing","medical_device_testing","healthcare_engineering"],"locations":["India"],"conditions":["the institution and course are eligible under current operational guidelines","the course has industry-relevant curriculum, faculty, facilities and outcome plan","short-term or diploma routes meet NCVET and current modification conditions where applicable","the proposal follows the current Department/PMA call and reporting route"],"thresholds":{"smdi_tenure":"FY 2024-25 to FY 2026-27","component_outlay_inr":10000000000,"masters_support_cap_inr":2100000000,"short_term_support_per_candidate_inr":10000,"diploma_support_per_candidate_inr":25000},"unknown_handling":"needs_information"},
        "exclusions":["individual founder cash support outside an approved course","unapproved training providers or courses","general training unrelated to medical-device design, development, testing or manufacturing","current 2025 modification conditions ignored"],
        "application":{"portal":"https://pharma-dept.gov.in/schemes/scheme-strengthening-medical-device-industry","route":"Eligible institution prepares course, faculty, infrastructure, candidate, industry linkage and budget proposal and submits through the current Department/PMA call","applicant_note":"UdyamVeda can help founders and institutions identify relevant courses and prepare an evidence checklist; it cannot certify course approval or candidate funding","selection":"Technical appraisal, approval, course monitoring, candidate/outcome reporting and financial verification","fees":"Confirm institution, course, examination and any candidate charges"},
        "fine_print":{"support":"Official launch material describes support up to INR 21 crore for Masters courses in central Government institutions, INR 10,000 per candidate for short-term courses and INR 25,000 per candidate for diploma courses in NCVET-approved institutes.","modification":"The official Department page lists a 9 June 2025 modification; current course and institution conditions must be taken from the modified guideline.","beneficiary":"This is institutional/course support; it must not be shown as a direct unrestricted grant to a founder or business.","review_note":"Confirm current modified course rules, institution eligibility, candidate limits, cost sharing, current call, reporting, assessment and payment route before publication."},
        "benefit_summary":{"types":["training_support","institutional_grant","skill_development"],"summary":"Potential institutional and candidate-linked support for approved medical-device courses; benefit is tied to eligible institutions, courses and reporting, not a general founder grant.","separate_value_buckets":true},
        "benefit_type":"skill_development_support",
        "benefit_label":"Medical-device capacity-building and skills support",
        "benefit_conditions":{"eligible_institution_required":true,"eligible_course_required":true,"modified_guideline_required":true,"candidate_or_course_limits_apply":true},
        "requirement":"Eligible institution, course and medical-device industry linkage",
        "requirement_description":"Prepare institutional registration, faculty, curriculum, facilities, industry linkage, candidate plan, course outcomes, budget and reporting evidence.",
        "rules":{"all":[{"field":"eligible_medical_device_training_institution","operator":"equals","value":true},{"field":"eligible_course_and_industry_linkage_confirmed","operator":"equals","value":true},{"field":"current_smdi_call_confirmed","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Choose the course route","description":"Identify Masters, diploma or short-term medical-device training and apply the correct current modified guideline.","url":"https://pharma-dept.gov.in/sites/default/files/Final%20guidelines%20for%20SMDI-8.11.2024_0.pdf"},{"title":"Confirm the 2025 modification","description":"Review the official capacity-building modification and current scheme page before preparing the institutional proposal.","url":"https://pharma-dept.gov.in/important-document/modification-operational-guidelines-sub-scheme-capacity-building-and-skill"},{"title":"Prepare institution and outcome evidence","description":"Document course, faculty, facilities, industry linkage, candidates, outcomes, budget and reporting route.","url":"https://pharma-dept.gov.in/schemes/scheme-strengthening-medical-device-industry"}],
        "window_type":"call_for_proposals",
        "window_label":"SMDI capacity-building support runs within FY 2024-25 to FY 2026-27; current calls and the 9 June 2025 modification are listed by the Department. Verify the live call before applying.",
        "window_evidence":{"source_url":"https://pharma-dept.gov.in/important-document/modification-operational-guidelines-sub-scheme-capacity-building-and-skill","anchor":"Department page last updated 9 June 2025 and current SMDI scheme route"},
        "review_note":"Confirm modified guideline and current call before publication."
      },
      {
        "slug":"smdi-medical-device-clinical-studies-support",
        "name":"SMDI - Medical Device Clinical Studies Support Scheme",
        "type":"clinical_studies_grant",
        "lifecycle_status":"active",
        "authority":"Department of Pharmaceuticals",
        "authority_url":"https://pharma-dept.gov.in/",
        "canonical_url":"https://pharma-dept.gov.in/schemes/scheme-strengthening-medical-device-industry",
        "source_url":"https://pharma-dept.gov.in/sites/default/files/Final%20guidelines%20for%20SMDI-8.11.2024_0.pdf",
        "source_kind":"guideline",
        "source_title":"Operational Guidelines for SMDI - Medical Device Clinical Studies Support",
        "source_anchor":"Clinical Studies Support component: animal studies, clinical investigations, post-market follow-up and eligible applicants",
        "summary":"Support for eligible medical-device animal studies, clinical investigations and post-market clinical follow-up to generate evidence for safety, efficacy and market access.",
        "objective":"Reduce the cost barrier to clinical evidence generation for investigational and approved medical devices and support safer, more export-ready products.",
        "legal_basis":"Operational Guidelines for the Central Sector Scheme Strengthening of Medical Device Industry dated 8 November 2024, modified on 23 February 2026.",
        "eligibility":{"entity_types":["medical_device_company","startup","msme","research_institution","hospital","clinical_research_organization","university"],"lifecycle_stages":["prototype","validation","growth","scaling","post_market"],"industries":["medical_devices","diagnostic_devices","healthcare_equipment","medtech_research"],"locations":["India"],"conditions":["the device and study are eligible under current clinical-studies guidelines","the applicant has the regulatory, ethics, site, protocol, investigator and safety arrangements required for the study","the study is an eligible animal study, clinical investigation or post-market follow-up","the proposal uses the current Department/PMA route and follows the 23 February 2026 modification"],"thresholds":{"smdi_tenure":"FY 2024-25 to FY 2026-27","component_outlay_inr":10000000000,"maximum_support_per_study_inr":500000000,"study_types":["animal_study","clinical_investigation","post_market_clinical_follow_up"]},"unknown_handling":"needs_information"},
        "exclusions":["research without an eligible medical-device study plan","clinical activity without required regulatory and ethics approvals","support treated as a guaranteed reimbursement of every study cost","current 23 February 2026 modification ignored"],
        "application":{"portal":"https://pharma-dept.gov.in/schemes/scheme-strengthening-medical-device-industry","route":"Prepare the device, protocol, regulatory, ethics, site, budget and investigator dossier and submit through the current Department/PMA call","applicant_note":"UdyamVeda can prepare a study-readiness checklist and explain evidence dependencies; it cannot approve a protocol, provide medical advice or replace an ethics/regulatory authority","selection":"Technical and regulatory appraisal, approval, milestone monitoring, study evidence and financial verification","fees":"Confirm current application, ethics, regulatory, CRO, testing and professional charges"},
        "fine_print":{"support":"Official launch material describes up to INR 5 crore for clinical investigation of investigational devices and post-market clinical follow-up on approved devices; the controlling modified guideline determines the eligible cost and cap.","amendment":"The Department lists a 23 February 2026 modification to paragraphs 5.4 and 5.11; this is material to current study eligibility and must be read before publication.","study_boundary":"Support does not waive regulatory, ethics, safety, informed-consent or clinical-trial obligations.","review_note":"Confirm the modified study types, applicant class, device class, eligible costs, cap, regulatory/ethics prerequisites, PMA route, milestone payments, data ownership and recovery conditions before publication."},
        "benefit_summary":{"types":["clinical_study_grant","research_support","medical_device_validation"],"summary":"Potential support for eligible medical-device animal, clinical or post-market studies, subject to the current modified guideline, regulatory approvals and per-study limits.","separate_value_buckets":true},
        "benefit_type":"clinical_studies_grant",
        "benefit_label":"Medical-device clinical studies and post-market evidence support",
        "benefit_conditions":{"eligible_device_required":true,"protocol_and_regulatory_route_required":true,"ethics_and_site_requirements_apply":true,"per_study_cap_applies":true},
        "requirement":"Eligible device study protocol and regulatory/ethics readiness",
        "requirement_description":"Prepare device classification, protocol, investigators, sites, ethics and regulatory approvals, safety/quality evidence, budget, milestones, data and reporting plan.",
        "rules":{"all":[{"field":"eligible_medical_device_study_identified","operator":"equals","value":true},{"field":"protocol_and_regulatory_readiness_confirmed","operator":"equals","value":true},{"field":"current_smdi_clinical_guideline_confirmed","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Classify the study and device","description":"Determine whether the proposal is an animal study, clinical investigation or post-market follow-up and identify the device/regulatory class.","url":"https://pharma-dept.gov.in/sites/default/files/Final%20guidelines%20for%20SMDI-8.11.2024_0.pdf"},{"title":"Read the 2026 modification","description":"Apply the 23 February 2026 amendment before interpreting paragraphs 5.4 and 5.11 or preparing a claim.","url":"https://pharma-dept.gov.in/sites/default/files/Corrigendum%20for%20revised%20operational%20guidelines%20of%20sub-scheme%20Medical%20Device_0.pdf"},{"title":"Prepare the protocol dossier","description":"Assemble regulatory, ethics, investigator, site, safety, budget, milestones and reporting evidence.","url":"https://pharma-dept.gov.in/schemes/scheme-strengthening-medical-device-industry"}],
        "window_type":"call_for_proposals",
        "window_label":"The official MIS/MDCSS call recorded a 15 February 2026 deadline and the Department lists a 23 February 2026 modification; current proposal windows and any later calls must be confirmed on the live scheme page.",
        "window_evidence":{"source_url":"https://pharma-dept.gov.in/sites/default/files/Marginal%20Investment%20Scheme-English.pdf","anchor":"Call for proposals for MIS RID and MDCSSS; deadline 15 February 2026"},
        "review_note":"Clinical eligibility and the 2026 modification require specialist manual review before publication."
      },
      {
        "slug":"smdi-medical-device-promotion-scheme",
        "name":"SMDI - Medical Device Promotion Scheme",
        "type":"industry_promotion_support",
        "lifecycle_status":"active",
        "authority":"Department of Pharmaceuticals",
        "authority_url":"https://pharma-dept.gov.in/",
        "canonical_url":"https://pharma-dept.gov.in/schemes/scheme-strengthening-medical-device-industry",
        "source_url":"https://pharma-dept.gov.in/sites/default/files/Final%20guidelines%20for%20SMDI-8.11.2024_0.pdf",
        "source_kind":"guideline",
        "source_title":"Operational Guidelines for SMDI - Medical Device Promotion Scheme",
        "source_anchor":"Medical Device Promotion component: industry bodies, institutions, events, studies, database and international promotion",
        "summary":"Non-financial and grant-based industry-promotion support for medical-device associations and institutions to run events, studies, databases, missions and market-development activities.",
        "objective":"Promote knowledge sharing, awareness, market development, brand India and sector coordination for the medical-device industry.",
        "legal_basis":"Operational Guidelines for the Central Sector Scheme Strengthening of Medical Device Industry dated 8 November 2024.",
        "eligibility":{"entity_types":["industry_association","educational_institution","research_institution","medical_device_body","public_institution"],"lifecycle_stages":["operating","growth","scaling"],"industries":["medical_devices","healthcare_equipment","medtech_manufacturing"],"locations":["India"],"conditions":["the proposal supports medical-device industry promotion and fits an eligible activity","the applicant and event/study/database/mission plan meet the current guideline","the proposal is approved through the Department route and provides outputs, budget and reporting evidence"],"thresholds":{"smdi_tenure":"FY 2024-25 to FY 2026-27","component_outlay_inr":1000000000,"activities":["seminars","workshops","events","roadshows","expos","manufacturer_evaluation_studies","database_creation","international_study_missions"]},"unknown_handling":"needs_information"},
        "exclusions":["ordinary company marketing or sales expenditure","activities unrelated to medical-device industry development","unapproved promotional claims or events","component outlay treated as an individual applicant ceiling"],
        "application":{"portal":"https://pharma-dept.gov.in/schemes/scheme-strengthening-medical-device-industry","route":"Prepare the activity concept, applicant credentials, participant/market plan, budget, outputs and reporting route and submit through the current Department call","applicant_note":"UdyamVeda can help structure an event, study or promotion proposal but cannot endorse marketing claims or guarantee Department support","selection":"Department technical and budget appraisal, approval, activity delivery and output/expense verification","fees":"Confirm event, registration, professional and execution charges"},
        "fine_print":{"support_model":"The component may support industry bodies and educational institutions for eligible promotion activities; it is not a general subsidy for a company’s advertising budget.","outlay":"The operational framework allocates INR 1 crore to the Medical Device Promotion component within the INR 500 crore SMDI outlay.","outputs":"The proposal must specify the activity, participants, knowledge/market output, budget and reporting evidence.","review_note":"Confirm the eligible applicant class, activity list, grant limits, cost-sharing, current call and reporting requirements before publication."},
        "benefit_summary":{"types":["industry_promotion_support","grant_in_aid","market_access_support"],"summary":"Potential support for eligible medical-device industry promotion activities by associations or institutions; not a direct business marketing subsidy.","separate_value_buckets":true},
        "benefit_type":"industry_promotion_support",
        "benefit_label":"Medical-device industry promotion and market-development support",
        "benefit_conditions":{"eligible_body_required":true,"eligible_activity_required":true,"approved_proposal_required":true,"output_reporting_required":true},
        "requirement":"Eligible promotion activity and institutional proposal",
        "requirement_description":"Prepare applicant credentials, activity design, participants, sector relevance, budget, outputs, procurement and reporting evidence.",
        "rules":{"all":[{"field":"eligible_medical_device_promotion_body","operator":"equals","value":true},{"field":"eligible_promotion_activity_identified","operator":"equals","value":true},{"field":"current_smdi_call_confirmed","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Choose the eligible activity","description":"Identify an event, study, database, roadshow, expo, workshop or international mission that fits the current guideline.","url":"https://pharma-dept.gov.in/sites/default/files/Final%20guidelines%20for%20SMDI-8.11.2024_0.pdf"},{"title":"Prepare the institutional proposal","description":"Document body credentials, sector need, participants, outputs, budget, procurement and reporting.","url":"https://pharma-dept.gov.in/schemes/scheme-strengthening-medical-device-industry"},{"title":"Submit and report","description":"Use the current official call and retain evidence of delivery, participants, outputs and eligible expenditure.","url":"https://pharma-dept.gov.in/sites/default/files/Annual%20Report%202025-26_0.pdf"}],
        "window_type":"call_for_proposals",
        "window_label":"The SMDI promotion component runs within FY 2024-25 to FY 2026-27; current calls and revised notices are listed on the official scheme page and must be checked before submission.",
        "window_evidence":{"source_url":"https://pharma-dept.gov.in/schemes/scheme-strengthening-medical-device-industry","anchor":"Current SMDI page: apply-online route and proposal calls"},
        "review_note":"Confirm eligible activity, grant limits and current call before publication."
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.88, 0.83, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1; end if;
    update public.opportunities set current_version_id = version_id, status = coalesce(item->>'lifecycle_status', 'in_review') where id = seed_opportunity_id;
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true)
    on conflict do nothing;
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, 'https://pharma-dept.gov.in/schemes/scheme-strengthening-medical-device-industry', 'scheme_page', 'Department of Pharmaceuticals SMDI current scheme page', 'Current apply-online route, amendments and 2026 calls', now(), false),
      (version_id, 'https://www.pib.gov.in/PressReleasePage.aspx/pib.gov.in/Pressreleaseshare.aspx?PRID=2071850', 'press_release', 'PIB SMDI launch release', 'Component outlays and support boundaries', now(), false),
      (version_id, 'https://pharma-dept.gov.in/sites/default/files/Annual%20Report%202025-26_0.pdf', 'annual_report', 'Department of Pharmaceuticals Annual Report 2025-26', 'Current implementation context', now(), false)
    on conflict do nothing;
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, conditions)
    values (version_id, item->>'benefit_type', item->>'benefit_label', item->'benefit_conditions') on conflict do nothing;
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    values (version_id, 'medical_device_support', item->>'requirement', item->>'requirement_description', true) on conflict do nothing;
    insert into public.eligibility_rule_sets (opportunity_version_id, rules, source_evidence, reviewed)
    values (version_id, item->'rules', jsonb_build_array(jsonb_build_object('source_url', item->>'source_url', 'anchor', item->>'source_anchor')), false) on conflict do nothing;
    insert into public.opportunity_steps (opportunity_version_id, step_number, title, description, official_url)
    select version_id, row_number() over ()::integer, step->>'title', step->>'description', step->>'url' from jsonb_array_elements(item->'steps') as steps(step) on conflict do nothing;
    insert into public.opportunity_windows (opportunity_version_id, window_type, label, source_evidence)
    values (version_id, item->>'window_type', item->>'window_label', item->'window_evidence') on conflict do nothing;
    insert into public.review_tasks (opportunity_version_id, task_type, status) values (version_id, 'publish', 'open') on conflict do nothing;
  end loop;
end $$;
