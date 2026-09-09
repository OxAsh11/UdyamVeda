-- Review-gated Department of Defence Production market-access and event-support route.
-- The sponsorship ceilings belong to approved events/organisers, not to individual MSMEs.

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
        "slug":"scheme-for-promotion-of-msmes-in-defence",
        "name":"Scheme for Promotion of MSMEs in Defence",
        "type":"market_access",
        "authority":"Department of Defence Production (DDP)",
        "authority_url":"https://ddpmod.gov.in/",
        "canonical_url":"https://www.ddpmod.gov.in/en/scheme_for_promotion_of_msmes_in_defence_0",
        "source_url":"https://www.ddpmod.gov.in/sites/default/files/2e7aaf1bd5030bd12ef5e83c096ef5bca4dc3aac2c4b7f55013996b6cbc75239/4ac52b4c9f672575ba175be70bcc2be4f5b96d9614b2e2081ee88cfccb809c87.pdf",
        "source_kind":"guideline",
        "source_title":"Scheme for Promotion of MSMEs in Defence - FY 2026-27 proposal form and guidelines",
        "source_anchor":"Pages 1-3: objectives, scope, operationalisation, eligible agencies, criteria for sanction and funding; page 4: FY 2026-27 event proposal form",
        "summary":"A Department of Defence Production route for approved conclaves, workshops, vendor-development meets, seminars, exhibitions and site visits that help MSMEs understand defence procurement, connect with OEMs/DPSUs and enter the defence supply chain.",
        "objective":"Bring MSMEs, including capable non-defence-sector MSMEs in Tier II and Tier III cities, into the defence supply chain through information, market-access, vendor-development and industry-connection events.",
        "legal_basis":"Scheme for Promotion of MSMEs in Defence issued by the Department of Defence Production, Ministry of Defence; the current official document and any later DDP order control the route.",
        "eligibility":{"entity_types":["industry_association","local_industry_chamber","think_tank","nsic","defence_exhibition_organisation","eligible_event_agency"],"lifecycle_stages":["operating","growth"],"industries":["defence","aerospace","advanced_manufacturing","electronics","ai","cybersecurity","dual_use_technology","engineering","export"],"locations":["India"],"conditions":["organiser must fit an eligible agency category or be recommended through the current DDP route","event proposal must show catchment area, expected MSME participation, target defence items/equipment and regional or infrastructure potential","event must be relevant to defence procurement, Make in India, vendor development, innovation, exports or related approved themes","individual MSMEs are intended beneficiaries/participants unless they separately qualify as an eligible event organiser"],"exclusions":["this is not a universal cash grant for every MSME","national/state sponsorship ceilings apply per approved event, not per participating MSME","approval, event dates, venue, co-hosts and support are subject to DDP/Empowered Committee review","the FY 2026-27 proposal form does not itself prove an open application window"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.ddpmod.gov.in/en/scheme_for_promotion_of_msmes_in_defence_0","route":"Download the current official scheme document, prepare the FY 2026-27 event proposal and submit through the DDP/Defence Exhibition Organisation or current authorised route stated by the department.","selection":"An Empowered Committee evaluates the proposal using catchment area, number of MSME units, target defence items/equipment, outreach, geo-demographic potential and infrastructure criteria.","fees":"No application fee is stated in the official scheme document; confirm the current department route before submission.","applicant_note":"UdyamVeda can help an eligible organiser prepare the proposal and an MSME prepare for participation, but cannot represent the organiser or promise sponsorship, attendance, procurement or contract award."},
        "fine_print":{"support_model":"Government sponsorship/support for approved MSME promotion events and related market-access outreach","national_event_sponsorship_ceiling_inr":300000,"state_event_sponsorship_ceiling_inr":150000,"event_formats":["conclave","workshop","vendor_development_meet","seminar","exhibition","on_site_visit"],"target_locations":"Tier II and Tier III cities with strong industrial and MSME presence","eligible_event_topics":["indigenization","innovation","export_promotion","electronic_warfare","AI","cyber security"],"support_conditions":["annual sponsorship is subject to the stated maximum and approval","permission to use the Ministry of Defence logo is tied to approved national/state events","private establishments may submit a plan which DDP evaluates before working out support/funding"],"review_note":"Verify the current submission contact, live FY 2026-27 intake window, eligible-organiser interpretation, event-level budget, co-host requirements, logo permission, reporting and payment terms before publication."},
        "benefit_summary":{"types":["event_support","market_access","training","procurement_support"],"amounts":[{"type":"event_sponsorship","scope":"national_event","max_inr":300000},{"type":"event_sponsorship","scope":"state_event","max_inr":150000}],"summary":"Potential DDP sponsorship/support for approved MSME promotion events, plus defence-sector market-access and vendor-development connections for participating MSMEs; sponsorship is not an individual MSME grant or procurement award.","separate_value_buckets":true},
        "benefit_type":"event_support",
        "benefit_label":"DDP-approved MSME defence promotion event support",
        "amount_max":300000,
        "benefit_conditions":{"organiser_route_required":true,"empowered_committee_approval_required":true,"national_or_state_event_scope_required":true,"participant_msm_es_do_not_receive_direct_cash_entitlement":true},
        "requirement":"Eligible organiser or participating MSME profile and event/procurement-readiness evidence",
        "requirement_description":"An organiser prepares the event proposal and impact evidence; an MSME participant prepares its Udyam/entity, capability, product, export, quality, testing and procurement-readiness information for the relevant defence opportunity.",
        "rules":{"all":[{"field":"eligible_organiser_or_participant_route_verified","operator":"equals","value":true},{"field":"current_ddp_event_route_verified","operator":"equals","value":true},{"field":"event_or_defence_market_access_fit_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm the applicant role","description":"Determine whether the user is an eligible event organiser seeking DDP support or an MSME seeking participation and market access; do not treat participant status as a cash-grant application.","url":"https://www.ddpmod.gov.in/en/scheme_for_promotion_of_msmes_in_defence_0"},{"title":"Review the current scheme document and proposal form","description":"Check the current objectives, event themes, eligible agency categories, sanction criteria, national/state sponsorship ceilings and FY 2026-27 proposal fields.","url":"https://www.ddpmod.gov.in/sites/default/files/2e7aaf1bd5030bd12ef5e83c096ef5bca4dc3aac2c4b7f55013996b6cbc75239/4ac52b4c9f672575ba175be70bcc2be4f5b96d9614b2e2081ee88cfccb809c87.pdf"},{"title":"Prepare the event or MSME capability evidence","description":"Organisers prepare catchment, MSME coverage, target defence items, outreach, venue and infrastructure evidence; MSMEs prepare entity, capability and procurement-readiness evidence.","url":"https://www.ddpmod.gov.in/sites/default/files/2e7aaf1bd5030bd12ef5e83c096ef5bca4dc3aac2c4b7f55013996b6cbc75239/4ac52b4c9f672575ba175be70bcc2be4f5b96d9614b2e2081ee88cfccb809c87.pdf"},{"title":"Use the current DDP submission or event route","description":"Submit only through the current DDP/authorised route and retain approval, sponsorship, venue, co-host, reporting and event records.","url":"https://www.ddpmod.gov.in/en/scheme_for_promotion_of_msmes_in_defence_0"}],
        "window_type":"event",
        "window_label":"FY 2026-27 event proposal form is published, but a live submission deadline and current intake contact must be confirmed with DDP.",
        "window_evidence":{"source_url":"https://www.ddpmod.gov.in/sites/default/files/2e7aaf1bd5030bd12ef5e83c096ef5bca4dc3aac2c4b7f55013996b6cbc75239/4ac52b4c9f672575ba175be70bcc2be4f5b96d9614b2e2081ee88cfccb809c87.pdf","anchor":"Page 4: Proposal of Events for the FY 2026-27"}
      }
    ]'::jsonb)
  loop
    select id into authority_id from public.authorities where name = item->>'authority' limit 1;
    if authority_id is null then
      insert into public.authorities (name, level, ministry, official_url)
      values (item->>'authority', 'central', 'Ministry of Defence', item->>'authority_url')
      returning id into authority_id;
    end if;

    insert into public.opportunities (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (item->>'slug', item->>'name', item->>'type', 'in_review', authority_id, '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, opportunity_type = excluded.opportunity_type, authority_id = excluded.authority_id, geography = excluded.geography, canonical_url = excluded.canonical_url;
    select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1;

    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.82, 0.78, 'in_review')
    on conflict (opportunity_id, version_number) do nothing;
    select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://www.ddpmod.gov.in/en/scheme_for_promotion_of_msmes_in_defence_0', 'ministry', 'DDP Scheme for Promotion of MSMEs in Defence page', 'Publication date 23 February 2026 and last updated 3 September 2026', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.ddpmod.gov.in/en/scheme_for_promotion_of_msmes_in_defence_0');
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', (item->>'amount_max')::numeric, item->'benefit_conditions'
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
