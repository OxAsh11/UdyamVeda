-- National incorporation and food-safety registration records.
-- These records remain in_review until current forms, amendments, fees and
-- state/sector conditions are confirmed by a catalog reviewer.

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
        "slug":"company-incorporation-spice-plus",
        "name":"Company Incorporation through SPICe+",
        "type":"registration",
        "authority":"Ministry of Corporate Affairs (MCA)",
        "authority_url":"https://www.mca.gov.in/",
        "canonical_url":"https://www.mca.gov.in/",
        "source_url":"https://www.mca.gov.in/content/dam/mca/pdf/SPICEplus-and-linked-filings-FAQs-V3-20230122.pdf",
        "source_title":"MCA SPICe+ and Linked Filings FAQ",
        "source_anchor":"FAQs on Incorporation and Allied Matters; SPICe+ Part A; SPICe+ Part B and integrated services",
        "summary":"Integrated Ministry of Corporate Affairs route for reserving a company name and applying for company incorporation with linked services where applicable.",
        "objective":"Prepare founders for the official SPICe+ name-reservation and incorporation workflow while identifying linked PAN, TAN, DIN, GST, EPFO, ESIC, bank-account and other service conditions that require current-form review.",
        "legal_basis":"Companies Act, 2013 and the MCA incorporation rules and web-service guidance referenced by the current SPICe+ materials",
        "eligibility":{"entity_types":["proposed_company","private_limited_company","public_limited_company","section_8_company"],"locations":["India"],"conditions":["proposed company must satisfy the current Companies Act and incorporation rules","name reservation and incorporation information must pass MCA validation","linked services depend on the entity, location and current form conditions"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.mca.gov.in/","route":"Create or use an MCA account, open MCA Services and start the current SPICe+ application; use Part A for name reservation and Part B for incorporation and linked services as applicable","fees":"Applicable filing and state stamp-duty charges must be confirmed in the current MCA workflow","selection":"Central Registration Centre and Registrar of Companies processing under current MCA rules"},
        "fine_print":{"parts":{"part_a":"Name reservation for a new company; it may be submitted separately or with Part B","part_b":"Incorporation and linked services, including DIN and PAN/TAN allocation; other services depend on current form and applicability"},"linked_services":["DIN","PAN","TAN","GSTIN where applied","EPFO and ESIC where applicable","bank account and other linked registrations where applicable"],"current_mca_facts":{"portal_context":"MCA is operating the company incorporation workflow in the V3 environment; use the current MCA portal route rather than relying on legacy V2 links","part_a_part_b":"The official SPICe+ instruction kit states that Part A covers name reservation and Part B covers the remaining incorporation details; Part A may be filed separately or together with Part B","agile_pro_s":"The official FAQ describes AGILE-PRO-S as the linked route for GSTIN where applied, EPFO, ESIC, professional tax in Maharashtra/Karnataka/West Bengal, bank-account opening and Shops and Establishment registration for Delhi","epfo_esic_boundary":"EPFO and ESIC registration is described as mandatory for new companies through SPICe+, but substantive compliance begins only when the applicable statutory threshold is crossed; ESIC has a non-implemented-area exception","bank_account":"New companies are required to apply for a bank account through the linked AGILE-PRO-S route","gst_boundary":"GSTIN is optional in the linked route and remains subject to GST applicability and the applicant's current facts","document_examples":"The FAQ calls out constitutional documents, recent office utility/address evidence and applicable subscriber/director material; the exact current form checklist must be checked before filing"},"applicant_control":"Founders or their authorised professionals must use the applicant's own MCA account and signing credentials; UdyamVeda may guide and prepare but must not impersonate the applicant","review_note":"Confirm current SPICe+ V3 version, linked forms, mandatory/optional services, DSC requirements, fees, state stamp duty, subscriber/director documents, name rules, portal handoff and processing terms before publication."},
        "benefit_summary":{"types":["recognition","compliance"],"summary":"A lawful incorporated-company identity and a coordinated route to linked registrations; no approval or incorporation outcome is guaranteed."},
        "benefit_type":"compliance",
        "benefit_label":"Company incorporation and linked registration readiness",
        "benefit_conditions":{"current_mca_form_required":true,"linked_services_conditioned_on_entity_and_location":true},
        "requirement":"Promoter, director, name and incorporation documentation",
        "requirement_description":"Prepare the current MCA form data, constitutional documents, subscriber/director identity and address evidence, registered-office information and digital-signature material required by the applicable route.",
        "rules":{"all":[{"field":"intends_company_incorporation","operator":"equals","value":true},{"field":"promoter_and_director_information_available","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Choose the company form and check name rules","description":"Confirm entity type, proposed name, objects, subscribers/directors and current Companies Act conditions.","url":"https://www.mca.gov.in/"},{"title":"Complete SPICe+ Part A and Part B as applicable","description":"Use the current MCA web service and linked forms for name reservation, incorporation and applicable services.","url":"https://www.mca.gov.in/"},{"title":"Sign, upload and retain acknowledgements","description":"Complete current DSC, PDF, linked-form and fee steps, then retain application numbers, challans and resubmission records.","url":"https://www.mca.gov.in/"}],
        "window_type":"rolling",
        "window_label":"MCA presents SPICe+ as an online incorporation route; current form version, fees and processing terms require reviewer confirmation.",
        "window_evidence":{"source_url":"https://www.mca.gov.in/content/dam/mca/pdf/SPICEplus-and-linked-filings-FAQs-V3-20230122.pdf","anchor":"SPICe+ web form offers name reservation and incorporation through Part A and Part B"}
      },
      {
        "slug":"fssai-food-business-registration-licensing",
        "name":"FSSAI Food Business Registration or Licence",
        "type":"licence",
        "authority":"Food Safety and Standards Authority of India (FSSAI)",
        "authority_url":"https://fssai.gov.in/",
        "canonical_url":"https://fssai.gov.in/business/registration",
        "source_url":"https://fssai.gov.in/business/registration",
        "source_title":"FSSAI Food Business Registration",
        "source_anchor":"Business Registration; Section 31; registration and licensing route, reconciled with the 2026 turnover-threshold amendment FAQ",
        "summary":"Official food-safety registration and licensing route for food business operators through FSSAI and FoSCoS.",
        "objective":"Help food businesses identify whether the current route is registration or a state/central licence and prepare the official application and continuing food-safety obligations.",
        "legal_basis":"Food Safety and Standards Act, 2006 and Food Safety and Standards (Licensing and Registration of Food Businesses) Regulations, 2011, subject to current amendments and notifications",
        "eligibility":{"entity_types":["food_business_operator","petty_food_manufacturer","retailer","hawker","itinerant_vendor","temporary_stall_holder","food_manufacturer","food_storage","food_distributor","food_service"],"locations":["India"],"conditions":["every food business operator must follow the applicable registration or licensing route","the current 2026 amendment FAQ states that registration applies up to INR 1.5 crore for new applications from 1 April 2026","state and central licensing bands depend on turnover, kind of business, capacity, location and other activity-specific criteria","larger, central, multi-state or activity-specific businesses may require a licence"],"thresholds":{"registration_annual_turnover_up_to_inr":15000000,"state_license_annual_turnover_above_inr":15000000,"state_license_annual_turnover_up_to_inr":500000000,"central_license_annual_turnover_above_inr":500000000,"new_application_threshold_effective_date":"2026-04-01"},"unknown_handling":"needs_information"},
        "application":{"portal":"https://foscos.fssai.gov.in/","route":"Use the official FoSCoS route to identify the food-business activity, select registration or licence, submit the current form and upload the applicable documents","fees":"Current statutory fee depends on the selected registration/licence route and must be confirmed in FoSCoS","selection":"Food-safety authority scrutiny and inspection or verification where applicable"},
        "fine_print":{"route_choice":"Registration versus state or central licensing depends on the current activity, capacity, premises, turnover and location conditions","current_2026_facts":{"thresholds_effective_from":"2026-04-01","registration_band":"Up to INR 1.5 crore for new applications covered by the 2026 amendment FAQ","state_license_band":"Above INR 1.5 crore and up to INR 50 crore","central_license_band":"Above INR 50 crore","validity":"The 2026 amendment FAQ states that FSSAI licences and registrations have perpetual validity unless suspended, cancelled or surrendered; continuing food-safety compliance still applies","migration":"Existing food businesses may require migration through FoSCoS to align with revised thresholds"},"continuing_obligations":["display or retain the current certificate/licence as required","follow food-safety and hygiene conditions","respond to inspections, notices, modifications and other continuing obligations"],"portal_note":"FSSAI identifies FoSCoS as the food-safety compliance system for licensing and registration","review_note":"Confirm the current kind-of-business eligibility matrix, revised threshold application, licence conditions, documents, fee schedule, inspection rules, migration path and current FoSCoS workflow before publication."},
        "benefit_summary":{"types":["compliance","recognition"],"summary":"Food-safety registration or licensing readiness for an applicable food business; it is a regulatory requirement, not a subsidy or grant."},
        "benefit_type":"compliance",
        "benefit_label":"Food-safety registration or licensing readiness",
        "benefit_conditions":{"food_business_activity_required":true,"route_depends_on_current_activity_and_scale":true},
        "requirement":"Food-business activity, premises and operator details",
        "requirement_description":"Prepare the current FoSCoS information and supporting documents for the food activity, premises, operator, ownership and applicable technical or hygiene conditions.",
        "rules":{"all":[{"field":"food_business_activity","operator":"exists"},{"field":"food_business_operates_in_india","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Classify the food business activity","description":"Identify the activity, premises, capacity, states and current registration or licence route using official FSSAI guidance.","url":"https://fssai.gov.in/business/registration"},{"title":"Apply through FoSCoS","description":"Complete the current registration or licence application and attach the documents requested for the selected activity.","url":"https://foscos.fssai.gov.in/"},{"title":"Track compliance and renewal obligations","description":"Retain the certificate, respond to authority requests and track modification, renewal, inspection and food-safety obligations.","url":"https://fssai.gov.in/business"}],
        "window_type":"rolling",
        "window_label":"FSSAI provides an online registration and licensing route; current eligibility, fees and processing conditions require reviewer confirmation.",
        "window_evidence":{"source_url":"https://fssai.gov.in/business/registration","anchor":"Registration Process and Licensing & Registration of food businesses"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central',
      case when item->>'slug' = 'fssai-food-business-registration-licensing' then 'Ministry of Health and Family Welfare' else 'Ministry of Corporate Affairs' end,
      case when item->>'slug' = 'fssai-food-business-registration-licensing' then 'Food Safety and Standards Authority of India' else 'Registrar of Companies' end,
      item->>'authority_url'
    where not exists (select 1 from public.authorities where name = item->>'authority')
    returning id into authority_id;
    if authority_id is null then
      select id into authority_id from public.authorities where name = item->>'authority' limit 1;
    end if;

    seed_opportunity_id := null;
    insert into public.opportunities
      (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (item->>'slug', item->>'name', item->>'type', 'in_review', authority_id, '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, authority_id = excluded.authority_id, canonical_url = excluded.canonical_url
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then
      select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1;
    end if;

    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.84, 0.84, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', case when item->>'slug' = 'company-incorporation-spice-plus' then 'guideline' else 'ministry' end, item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
    if item->>'slug' = 'company-incorporation-spice-plus' then
      update public.opportunity_sources
      set section = 'FAQs on Incorporation and Allied Matters; SPICe+ Part A and Part B'
      where opportunity_version_id = version_id and source_url = item->>'source_url';
      insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
      select version_id, 'https://www.mca.gov.in/', 'ministry', 'MCA official portal', 'MCA Services and SPICe+ application route', now(), false
      where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.mca.gov.in/');
    else
      update public.opportunity_sources
      set section = 'Business Registration; Registration Process', document_anchor = 'FSSAI business registration and licensing route'
      where opportunity_version_id = version_id and source_url = item->>'source_url';
      insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
      select version_id, 'https://foscos.fssai.gov.in/', 'ministry', 'FoSCoS official portal', 'Apply for new licence or registration', now(), false
      where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://foscos.fssai.gov.in/');
    end if;

    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', item->'benefit_conditions'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = item->>'benefit_label');
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'registration', item->>'requirement', item->>'requirement_description', true
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
