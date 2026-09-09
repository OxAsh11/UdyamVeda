-- Department of Pharmaceuticals PLI record. This is a review-gated
-- manufacturing incentive dossier; current application availability,
-- selection status and claim windows must be confirmed before publication.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Department of Pharmaceuticals PLI Pharmaceuticals Gazette notification', 'https://pharmaceuticals.gov.in/sites/default/files/Gazette%20Notification%20of%20PLI%20scheme%20for%20Pharmaceuticals_0_0.pdf', 'gazette_notification', 'central', 'monthly', 1, true, 'Primary Gazette notification for the Production Linked Incentive Scheme for Pharmaceuticals, dated 3 March 2021; current amendments, application status and claim rules require review.'),
  ('Department of Pharmaceuticals monthly summary reports', 'https://www.pharmaceuticals.gov.in/monthly-summary-report', 'department_portal', 'central', 'monthly', 1, true, 'Official Department of Pharmaceuticals reporting route for implementation and progress updates; use the latest report for change detection.'),
  ('Department of Pharmaceuticals official portal', 'https://pharmaceuticals.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Department of Pharmaceuticals portal and notices index for current scheme status, notices and implementing-agency updates.')
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
        "slug":"production-linked-incentive-pharmaceuticals",
        "name":"Production Linked Incentive Scheme for Pharmaceuticals",
        "type":"manufacturing_incentive",
        "authority":"Department of Pharmaceuticals",
        "authority_url":"https://pharmaceuticals.gov.in/",
        "canonical_url":"https://pharmaceuticals.gov.in/",
        "source_url":"https://pharmaceuticals.gov.in/sites/default/files/Gazette%20Notification%20of%20PLI%20scheme%20for%20Pharmaceuticals_0_0.pdf",
        "source_kind":"gazette_notification",
        "source_title":"Gazette Notification of PLI Scheme for Pharmaceuticals",
        "source_anchor":"Sections 2, 3.1 and 3.2; objective, target groups and scheme outlay",
        "summary":"A production-linked incentive framework administered by the Department of Pharmaceuticals to increase investment and production in selected high-value pharmaceutical goods and strengthen domestic manufacturing capability.",
        "objective":"Increase investment and production in selected high-value pharmaceutical products, support product diversification and help Indian manufacturers scale into global value chains.",
        "legal_basis":"Department of Pharmaceuticals Gazette Notification No. 31026/60/2020-Policy-DoP dated 3 March 2021, subject to later guidelines, amendments, application decisions and claim conditions.",
        "eligibility":{"entity_types":["company","private_limited","public_limited","msme"],"lifecycle_stages":["operating","growth","scaling"],"industries":["pharmaceuticals","biopharmaceuticals","complex_generics","api_manufacturing","drug_intermediates"],"locations":["India"],"conditions":["applicant must be a manufacturer of eligible pharmaceutical goods registered in India","product must fall within an eligible target category and satisfy the applicable scheme definition","applicant group and baseline financial criteria must be demonstrated using the current guidelines","investment, production, sales and other performance conditions apply before any incentive is claimed","the official application, approval and claim process and any current implementing-agency route must be followed"],"exclusions":["businesses that do not manufacture eligible target products","claims that scheme outlay is an individual applicant entitlement","applications or claims that ignore current guidelines, selection decisions, milestones or verification"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://pharmaceuticals.gov.in/","route":"review the current Department of Pharmaceuticals notice and implementing-agency instructions, establish eligibility for the relevant target group, then use the current official application or claim route if open","applicant_note":"UdyamVeda can explain the scheme, prepare a checklist and identify missing evidence, but the applicant must submit through the official route and remain responsible for representations, claims and compliance."},
        "fine_print":{"benefit_is_performance_linked":true,"grant_or_subsidy":false,"loan":false,"scheme_outlay_not_applicant_ceiling":true,"target_groups":["Group A: global manufacturing revenue of pharmaceutical goods at or above the threshold in the Gazette","Group B: global manufacturing revenue in the Gazette range","Group C: global manufacturing revenue below the Gazette threshold, with an MSME sub-group"],"eligible_goods_note":"The Gazette identifies high-value categories including biopharmaceuticals, complex generic drugs, patented drugs or drugs nearing patent expiry, cell-based or gene-therapy drugs and specified API/KSM-related production objectives; the current eligible-product list and guidelines control.","claim_note":"Incentive is linked to qualifying investment, production and other scheme conditions. The published scheme outlay is not an automatic benefit for every applicant.","review_note":"Confirm current application/selection status, eligible product list, target-group thresholds, baseline year, investment and production milestones, incentive rates, claim period, PMA route, audit evidence, clawback provisions, amendments and whether any new applicant window remains open before publication."},
        "benefit_summary":{"types":["production_linked_incentive","manufacturing_support"],"summary":"Potential performance-linked incentive support for eligible Indian manufacturers of selected pharmaceutical goods; exact rates, milestones, ceilings and claimability depend on the applicable current guidelines and approval."},
        "benefit_type":"production_linked_incentive",
        "benefit_label":"Performance-linked support for eligible pharmaceutical manufacturing",
        "benefit_conditions":{"eligible_product_required":true,"indian_manufacturer_required":true,"approval_required":true,"investment_and_production_conditions_apply":true,"scheme_outlay_not_individual_entitlement":true},
        "requirement":"Eligible product, Indian manufacturing status and financial/performance evidence",
        "requirement_description":"The applicant must evidence its legal entity and Indian manufacturing status, target product eligibility, relevant baseline financial information, planned or completed investment and the production, sales and reporting evidence required by the current scheme documents.",
        "rules":{"all":[{"field":"is_registered_indian_manufacturer","operator":"equals","value":true},{"field":"pharmaceutical_target_product_identified","operator":"equals","value":true},{"field":"scheme_evidence_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Identify the target product and scheme route","description":"Map the proposed or existing pharmaceutical product to the current eligible category and target-group criteria in the Gazette, guidelines and latest Department notices.","url":"https://pharmaceuticals.gov.in/sites/default/files/Gazette%20Notification%20of%20PLI%20scheme%20for%20Pharmaceuticals_0_0.pdf"},{"title":"Verify current application status","description":"Check the latest Department of Pharmaceuticals notices and implementing-agency instructions; do not treat the historic Gazette as proof that a new application window is open.","url":"https://pharmaceuticals.gov.in/"},{"title":"Prepare eligibility and baseline evidence","description":"Assemble entity, manufacturing, product, financial baseline, investment, capacity and compliance evidence in the format currently prescribed by the official route.","url":"https://pharmaceuticals.gov.in/"},{"title":"Submit and report through the official route","description":"If the official route is open and the applicant is approved, submit claims and periodic reports through the designated official process and retain audit evidence for milestones and verification.","url":"https://pharmaceuticals.gov.in/"}],
        "window_type":"call_for_applications",
        "window_label":"The Gazette establishes the scheme framework, but current application, selection and claim windows must be verified from the latest official Department notices before this record becomes actionable.",
        "window_evidence":{"source_url":"https://pharmaceuticals.gov.in/sites/default/files/Gazette%20Notification%20of%20PLI%20scheme%20for%20Pharmaceuticals_0_0.pdf","anchor":"Scheme notification dated 3 March 2021; current window and amendments require a live official-status check"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Chemicals and Fertilizers', 'Department of Pharmaceuticals', item->>'authority_url'
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
