-- Department of Telecommunications PLI record. This is a review-gated
-- manufacturing incentive dossier; a scheme page does not prove that a new
-- application window is open or that an applicant will receive an incentive.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Department of Telecommunications PLI guidelines', 'https://www.dot.gov.in/static/uploads/2025/07/425537d318df04ffd54bd262fa9610f6.pdf', 'scheme_guidelines', 'central', 'monthly', 1, true, 'Official revised PLI guidelines for Telecom and Networking Products; current window, target segments and amendments require review.'),
  ('Department of Telecommunications PLI amendments', 'https://www.dot.gov.in/static/uploads/2025/07/73c25f6e2641b31ee2e50b5ba4ffdd62.pdf', 'office_memorandum', 'central', 'monthly', 1, true, 'Official DoT amendment document covering design-led manufacturing and scheme timeline changes.'),
  ('Department of Telecom eServices PLI service', 'https://www.eservices.dot.gov.in/service-list', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Official eServices entry point listing the Production Linked Incentive service for telecom equipment production.')
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
        "slug":"production-linked-incentive-telecom-networking-products",
        "name":"Production Linked Incentive Scheme for Telecom and Networking Products",
        "type":"manufacturing_incentive",
        "authority":"Department of Telecommunications",
        "authority_url":"https://www.dot.gov.in/",
        "canonical_url":"https://www.eservices.dot.gov.in/service-list",
        "source_url":"https://www.dot.gov.in/static/uploads/2025/07/425537d318df04ffd54bd262fa9610f6.pdf",
        "source_kind":"scheme_guidelines",
        "source_title":"PLI Scheme Guidelines for Telecom and Networking Products",
        "source_anchor":"Sections 1.1, 1.3, 5.3, 5.6 and 5.7; scheme purpose, application route and window caveat",
        "summary":"A production-linked incentive framework administered by the Department of Telecommunications to promote manufacturing of specified telecom and networking products in India.",
        "objective":"Promote domestic manufacturing and investment in specified telecom and networking products, including design-led manufacturing routes covered by the applicable amendments.",
        "legal_basis":"Department of Telecommunications PLI notification and guidelines issued under File No. 13-01/2020-IC, including applicable amendments and later official instructions.",
        "eligibility":{"entity_types":["company","private_limited","public_limited","msme"],"lifecycle_stages":["operating","growth","scaling"],"industries":["telecom_equipment","networking_products","electronics_manufacturing"],"locations":["India"],"conditions":["applicant must be a company registered in India under the applicable guidelines","proposed products must fall within the scheme target segments","eligible investment, sales, domestic value addition and other qualification conditions must be demonstrated","one application and the current Project Management Agency process apply subject to the guidelines","the applicant must satisfy current application, approval, reporting and claim conditions"],"exclusions":["products outside the current target segments","applications submitted after a closed window unless the competent authority permits otherwise","claims that an application acknowledgement or scheme listing confers a right to incentive","businesses unable to evidence the required investment, sales, manufacturing or reporting conditions"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.eservices.dot.gov.in/service-list","route":"review the current DoT guidelines and eServices route, identify the target segment and submit through the designated Project Management Agency process if the official application window is open","applicant_note":"UdyamVeda can prepare a route checklist and evidence map, but the applicant must submit through the official DoT/PMA process and remain responsible for all statements and claims."},
        "fine_print":{"benefit_is_performance_linked":true,"grant_or_subsidy":false,"loan":false,"application_acknowledgement_is_not_entitlement":true,"one_application_rule":"The guidelines state that an applicant may make only one application under the scheme, subject to the current guidelines.","window_note":"The guidelines state that no fresh application is accepted after the application window closes unless otherwise permitted by the competent authority.","design_led_manufacturing_note":"The applicable amendment expands the framework for design-led manufacturing for specified 5G products and imposes technology, in-house/captive R&D or qualifying technology-transfer conditions where applicable.","review_note":"Confirm the current target-segment list, application fee, investment and sales thresholds, domestic value-addition rules, design-led criteria, claim rates, tenure, PMA portal, open/closed window, reporting evidence and clawback or recovery conditions before publication."},
        "benefit_summary":{"types":["production_linked_incentive","manufacturing_support"],"summary":"Potential performance-linked support for eligible Indian manufacturers of specified telecom and networking products; exact rate, ceiling, milestone and claimability depend on current guidelines, approval and performance evidence."},
        "benefit_type":"production_linked_incentive",
        "benefit_label":"Performance-linked support for eligible telecom and networking manufacturing",
        "benefit_conditions":{"indian_company_required":true,"target_segment_required":true,"approval_required":true,"investment_and_sales_conditions_apply":true,"application_window_must_be_open_or_authorized":true,"no_entitlement_from_acknowledgement":true},
        "requirement":"Indian company, eligible target product and investment/sales evidence",
        "requirement_description":"The applicant must evidence its Indian company status, target product, manufacturing plan, eligible investment, sales, domestic value addition and any design-led or technology conditions required by the current official guidelines.",
        "rules":{"all":[{"field":"is_registered_indian_company","operator":"equals","value":true},{"field":"telecom_target_segment_identified","operator":"equals","value":true},{"field":"investment_sales_evidence_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Map the product to a target segment","description":"Identify the specified telecom or networking product and check the current target-segment, technology and design-led manufacturing criteria.","url":"https://www.dot.gov.in/static/uploads/2025/07/425537d318df04ffd54bd262fa9610f6.pdf"},{"title":"Verify the current application window","description":"Check the official DoT eServices route and latest guidelines or notices; do not treat a historical guideline as proof that new applications are open.","url":"https://www.eservices.dot.gov.in/service-list"},{"title":"Prepare the qualification evidence","description":"Assemble company, product, manufacturing, investment, sales, domestic value-addition and technology/R&D evidence in the prescribed format.","url":"https://www.dot.gov.in/static/uploads/2025/07/425537d318df04ffd54bd262fa9610f6.pdf"},{"title":"Submit and report through the PMA route","description":"If eligible and the official route is open, submit through the designated Project Management Agency and maintain the records needed for approval, claims, reporting and audit.","url":"https://www.eservices.dot.gov.in/service-list"}],
        "window_type":"call_for_applications",
        "window_label":"Application availability is controlled by the official window and competent-authority instructions; a closed window does not become actionable because the scheme guidelines remain online.",
        "window_evidence":{"source_url":"https://www.dot.gov.in/static/uploads/2025/07/425537d318df04ffd54bd262fa9610f6.pdf","anchor":"Section 5.7: no fresh application after the close of the application window unless otherwise permitted"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Communications', 'Department of Telecommunications', item->>'authority_url'
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
