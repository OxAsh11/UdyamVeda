-- Promotion of MSMEs in North Eastern Region and Sikkim.
-- Review-gated because the route is State/institution-led and the 2022
-- guideline ceilings must be reconciled with the later official scheme-booklet
-- figures before publication.

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
        "slug":"msme-promotion-north-eastern-region-sikkim-infrastructure",
        "name":"Promotion of MSMEs in North Eastern Region and Sikkim",
        "type":"infrastructure_support",
        "status":"active",
        "authority":"Ministry of Micro, Small and Medium Enterprises - Promotion of MSMEs in NER and Sikkim",
        "authority_url":"https://msme.gov.in/",
        "canonical_url":"https://ner-promotion.msme.gov.in/NERegion/NERLoginNew.aspx",
        "source_url":"https://ner-promotion.msme.gov.in/NERegion/NERLoginNew.aspx",
        "source_kind":"ministry_portal",
        "source_title":"Promotion of MSMEs in NER and Sikkim official portal",
        "source_anchor":"Scheme components, official registration and proposal route",
        "summary":"Central assistance for State Government and State implementing agencies in the North Eastern Region and Sikkim to create or modernize common MSME infrastructure, industrial estates and tourism facilities.",
        "objective":"Improve MSME productivity, technology, skills, quality, market access and enterprise infrastructure in the North Eastern Region and Sikkim through shared facilities and State-led projects.",
        "legal_basis":"Central Sector Scheme Promotion of MSMEs in North Eastern Region and Sikkim under Ministry of MSME guidelines and current official scheme notices.",
        "eligibility":{"entity_types":["state_government","state_government_department","state_implementing_agency","state_msme_promotion_agency","tourism_implementing_agency"],"lifecycle_stages":["infrastructure_planning","cluster_development","enterprise_support","tourism_infrastructure"],"industries":["manufacturing","agriculture_processing","food_processing","forestry","sericulture","bamboo","tourism","msme_common_facilities"],"locations":["assam","arunachal_pradesh","manipur","meghalaya","mizoram","nagaland","sikkim","tripura"],"conditions":["proposal must be made by an eligible State Government or State organization engaged in MSME promotion","project must fit a mini technology centre, industrial estate or tourism common-facility component","a detailed project report, project site, implementation agency and outcome plan are required","geo-tagging is mandatory for the project","State contribution, land and costs above the permitted Central assistance must be arranged by the State or implementing agency","proposal must follow the MSME-DFO, O/o DC MSME and Project Approval and Monitoring Committee route"],"thresholds":{"government_assistance_percent_max":90,"new_mini_technology_centre_current_booklet_project_cost_ceiling_inr":150000000,"new_industrial_estate_current_booklet_project_cost_ceiling_inr":150000000,"existing_industrial_estate_current_booklet_project_cost_ceiling_inr":100000000,"tourism_current_booklet_project_cost_ceiling_inr":50000000,"guideline_mini_technology_centre_assistance_cap_inr":135000000,"guideline_tourism_assistance_cap_inr":45000000},"unknown_handling":"needs_information"},
        "exclusions":["individual MSMEs, NGOs and private founders do not receive the Central grant directly under this institutional route","MSMEs may benefit through a technology centre, industrial estate or tourism common facility but that is not a personal subsidy or automatic entitlement","land cost is not eligible for Central assistance and excess project cost is borne by the State or implementing agency","project approval, State contribution, geo-tagging, procurement, utilization certificates and milestone compliance are required","the later official scheme booklet states component project-cost figures that differ from caps in the 2022 revised guideline; do not publish a single ceiling until the controlling current notice is confirmed"],
        "application":{"portal":"https://ner-promotion.msme.gov.in/NERegion/NERLoginNew.aspx","route":"State Government or eligible State organization prepares the proposal and DPR, submits through the official scheme portal and follows the MSME-DFO, O/o DC MSME and Project Approval and Monitoring Committee route.","selection":"Project approval is institutional and sanction-based; the State or implementing agency remains responsible for contribution, procurement, implementation, reporting and utilization certificates.","fees":"No applicant fee is stated in the reviewed official sources; any portal or processing requirement must be checked in the current notice.","applicant_note":"UdyamVeda may help an MSME identify relevant common facilities or help an eligible State agency prepare a document checklist, but it must not present this as a direct MSME grant or submit institutional proposals on the applicant's behalf."},
        "fine_print":{"components":["setting up or modernization of Mini Technology Centres","development of new or existing Industrial Estates","development of tourism-sector common services in NER and Sikkim"],"assistance_model":"The official scheme provides up to 90% Central assistance subject to component-specific project-cost and assistance limits, with the balance and excess cost borne by the State Government.","current_booklet_figures":{"mini_technology_centre_project_cost_ceiling_inr":150000000,"new_industrial_estate_project_cost_ceiling_inr":150000000,"existing_industrial_estate_project_cost_ceiling_inr":100000000,"tourism_project_cost_ceiling_inr":50000000},"revised_guideline_figures":{"mini_technology_centre_assistance_cap_inr":135000000,"tourism_assistance_cap_inr":45000000,"new_industrial_estate_assistance_cap_inr":"The guideline states the component ceiling and contribution pattern; reconcile against the later official booklet before publication.","existing_industrial_estate_assistance_cap_inr":"The guideline states the component ceiling and contribution pattern; reconcile against the later official booklet before publication."},"implementation":"Central funds are released to the project implementing agency in installments subject to approval, State contribution, progress and utilization certificates; official sources describe component-specific completion periods.","review_note":"Verify the current scheme continuation, controlling ceiling for each component, eligible implementing agency, State contribution, land, DPR template, geo-tagging, procurement, installment ratio, completion period, monitoring, utilization certificates, grievance route and current portal availability before publication."},
        "benefit_summary":{"types":["grant","infrastructure_support","market_access"],"summary":"Institutional Central assistance for shared MSME technology, industrial-estate and tourism infrastructure in NER and Sikkim; participating MSMEs benefit indirectly through the approved facility.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"State-led Central assistance for MSME common infrastructure in NER and Sikkim",
        "amount_max":null,
        "percentage":90,
        "benefit_conditions":{"state_or_state_agency_applicant_required":true,"ner_or_sikkim_location_required":true,"component_specific_ceiling_requires_review":true,"state_contribution_required":true,"geo_tagging_required":true},
        "requirement":"Eligible State proposal, DPR, implementing agency, geo-tagged site and State contribution",
        "requirement_description":"Prepare the component-specific DPR, site and land evidence, implementing-agency details, State contribution, outcome projections, procurement plan and current portal documents.",
        "rules":{"all":[{"field":"state_or_state_agency_applicant_verified","operator":"equals","value":true},{"field":"ner_or_sikkim_project_verified","operator":"equals","value":true},{"field":"dpr_and_geo_tagging_ready","operator":"equals","value":true},{"field":"state_contribution_available","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Classify the infrastructure component","description":"Decide whether the proposal concerns a Mini Technology Centre, Industrial Estate or tourism common facility and identify the MSME users who will benefit.","url":"https://ner-promotion.msme.gov.in/NERegion/Reports/FAQs.aspx"},{"title":"Prepare the DPR and site evidence","description":"Document demand, location, services, capital cost, operating costs, implementation agency, outcomes, geo-tagging and land availability.","url":"https://msme.gov.in/sites/default/files/RevisedGuidelines_NER_Sikkim.pdf"},{"title":"Reconcile the current financial limits","description":"Compare the current official scheme booklet with the revised guideline and obtain confirmation of the applicable component ceiling before submission.","url":"https://msme.gov.in/sites/default/files/assets/pdf/v2.0%20-2025-%20Scheme%20booklet%20Eng-14.02.2025.pdf"},{"title":"Submit through the institutional route","description":"Upload the proposal through the official portal and follow MSME-DFO, O/o DC MSME and Project Approval and Monitoring Committee scrutiny.","url":"https://ner-promotion.msme.gov.in/NERegion/NERLoginNew.aspx"},{"title":"Implement and report","description":"Maintain State contribution, procurement, milestone, installment, utilization-certificate and facility-outcome records.","url":"https://msme.gov.in/sites/default/files/RevisedGuidelines_NER_Sikkim.pdf"}],
        "window_type":"rolling",
        "window_label":"Institutional proposal route; State proposal and current portal availability determine timing. No universal founder application deadline is asserted.",
        "window_evidence":{"source_url":"https://ner-promotion.msme.gov.in/NERegion/NERLoginNew.aspx","anchor":"Official scheme portal and proposal route"},
        "review_note":"Keep review-gated. Show this to eligible State agencies and to MSMEs only as an indirect common-infrastructure and market-access opportunity until the current component terms are reconciled."
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
    values (item->>'slug', item->>'name', item->>'type', 'in_review', authority_id, '{"coverage":"central","locations":["India","North Eastern Region","Sikkim"]}'::jsonb, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, authority_id = excluded.authority_id, canonical_url = excluded.canonical_url
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then
      select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1;
    end if;

    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.91, 0.86, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where public.opportunities.id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true),
      (version_id, 'https://ner-promotion.msme.gov.in/NERegion/Reports/FAQs.aspx', 'faq', 'Promotion of MSMEs in NER and Sikkim official FAQ', 'Components, assistance, beneficiaries, DPR and approval route', now(), false),
      (version_id, 'https://msme.gov.in/sites/default/files/RevisedGuidelines_NER_Sikkim.pdf', 'guideline', 'Promotion of MSMEs in NER and Sikkim revised guidelines', 'Components, funding pattern, proposal route and utilization conditions', now(), false),
      (version_id, 'https://msme.gov.in/sites/default/files/assets/pdf/v2.0%20-2025-%20Scheme%20booklet%20Eng-14.02.2025.pdf', 'ministry', 'MSME scheme booklet NER and Sikkim entry', 'Pages 31-33: component figures and State proposal route', now(), false)
    on conflict do nothing;
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    values (version_id, item->>'benefit_type', item->>'benefit_label', null, (item->>'percentage')::numeric, item->'benefit_conditions')
    on conflict do nothing;
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    values (version_id, 'other', item->>'requirement', item->>'requirement_description', true)
    on conflict do nothing;
    insert into public.eligibility_rule_sets (opportunity_version_id, rules, source_evidence, reviewed)
    values (version_id, item->'rules', jsonb_build_array(jsonb_build_object('source_url', item->>'source_url', 'anchor', item->>'source_anchor')), false)
    on conflict do nothing;
    insert into public.opportunity_steps (opportunity_version_id, step_number, title, description, official_url)
    select version_id, (row_number() over ())::integer, step->>'title', step->>'description', step->>'url'
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
