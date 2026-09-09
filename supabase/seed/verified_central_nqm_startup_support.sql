-- National Quantum Mission startup support.
-- NQM support is hub-mediated and may combine milestone-based financial support,
-- equity/CCPS, mentoring and facilities. It is not a guaranteed grant or a
-- single national application window.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('DST National Quantum Mission startup call', 'https://dst.gov.in/node/8226', 'official_startup_call', 'central', 'weekly', 1, true, 'Official DST page listing the four NQM startup support hubs and instructing startups to apply to only one hub.'),
  ('DST NQM startup support guidelines', 'https://dst.gov.in/sites/default/files/Guidelines%20to%20support%20start-ups.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official DST guidelines covering eligibility, application modes, selection, funding slabs, equity, milestones, mentoring, monitoring and Government support.'),
  ('DST NQM startup support announcement', 'https://dst.gov.in/dst-drive-quantum-leap-indian-startups-i-hub-qtf-iiser-pune-issues-call-proposals', 'pib_or_ministry_release', 'central', 'monthly', 1, true, 'Official DST announcement describing the startup-support guidelines and initial I-HUB QTF implementation route.'),
  ('DST National Quantum Mission page', 'https://dst.gov.in/national-quantum-mission-nqm', 'ministry_portal', 'central', 'weekly', 1, true, 'Official DST mission page for current NQM activities, hub information and mission updates.'),
  ('NQM Quantum Computing Innovation hub', 'https://qcinnovation.co.in/', 'implementing_hub_portal', 'central', 'weekly', 1, true, 'Hub route linked from the official DST NQM startup call for Quantum Computing.'),
  ('NQM Quantum Communication hub', 'https://samgnya.in/', 'implementing_hub_portal', 'central', 'weekly', 1, true, 'Hub route linked from the official DST NQM startup call for Quantum Communication.'),
  ('NQM Quantum Sensing and Metrology hub', 'https://qmettech.com/', 'implementing_hub_portal', 'central', 'weekly', 1, true, 'Hub route linked from the official DST NQM startup call for Quantum Sensing and Metrology.'),
  ('NQM Quantum Materials and Devices hub', 'https://qmdhub.co.in/', 'implementing_hub_portal', 'central', 'weekly', 1, true, 'Hub route linked from the official DST NQM startup call for Quantum Materials and Devices.'),
  ('Startup India Government Schemes Playbook NQM entry', 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'discovery_playbook', 'central', 'monthly', 1, true, 'Official Startup India discovery entry; used for cross-checking only, not as the sole operational authority.')
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
        "slug":"national-quantum-mission-startup-support",
        "name":"National Quantum Mission Startup Support",
        "type":"equity_investment",
        "lifecycle_status":"paused",
        "authority":"Department of Science and Technology - National Quantum Mission",
        "authority_url":"https://dst.gov.in/national-quantum-mission-nqm",
        "canonical_url":"https://dst.gov.in/node/8226",
        "source_url":"https://dst.gov.in/sites/default/files/Guidelines%20to%20support%20start-ups.pdf",
        "source_kind":"official_dst_guideline",
        "source_title":"Guidelines for supporting Start-ups under National Quantum Mission",
        "source_anchor":"Pages 1-6: background, eligibility, application, selection, funding mechanism, mentoring, monitoring and Government support",
        "summary":"A Department of Science and Technology startup-support route for DPIIT-registered Indian quantum-technology companies, delivered through NQM thematic hubs with milestone-based financial support, equity/CCPS structures, mentoring and access to facilities.",
        "objective":"Seed, nurture and scale Indian quantum-technology startups by connecting eligible companies with NQM thematic hubs, technical and business mentors, facilities, users and follow-on private capital.",
        "legal_basis":"National Quantum Mission approved by the Union Cabinet and the official DST Guidelines for supporting Start-ups under National Quantum Mission; hub governing boards, investment committees, equity agreements and current hub calls control operational terms.",
        "eligibility":{"entity_types":["dpiit_recognized_startup","indian_company","quantum_technology_startup","private_limited_company"],"lifecycle_stages":["idea","prototype","validation","pilot","commercialization","scaling"],"industries":["quantum_computing","quantum_communication","quantum_sensing","metrology","quantum_materials","quantum_devices","deep_technology","cybersecurity","defence_technology","healthcare_technology","energy_technology","space_technology","financial_technology"],"locations":["India"],"conditions":["the startup should be DPIIT-registered at the time of application, or complete registration before release of funds under the guideline","the business idea should have market fit, viable commercialisation and scope to scale","technology must be core to the product, service, business model, distribution model or methodology used to solve the target problem","the holding company must be registered in India, IP must reside in India and the company must be majority owned in India","Indian promoters must hold at least 51% shareholding under the applicable Companies Act and SEBI rules","the proposal must fit a current NQM hub vertical, call, problem statement or open challenge and pass hub evaluation, diligence, Board/IEMC and agreement conditions"],"exclusions":["NQM support is not a guaranteed grant, loan, subsidy or automatic entitlement","financial support, equity, CCPS, incubation fee, valuation, dilution, milestones, tranches, reporting, facility charges and follow-on capital are route- and agreement-controlled","a startup should apply to only one of the four NQM hubs for the applicable support route","historical I-HUB QTF calls and hub pages do not prove a current open deadline","quantum relevance, DPIIT registration, Indian ownership/IP and current hub intake must be verified before recommendation"],"thresholds":{"mission_outlay_inr":60036500000,"mission_period_years":8,"mission_period_end":"2031-03-31","indian_promoter_shareholding_min_percent":51,"track_1_seed_funding_reference_max_inr":500000000,"slab_a_max_inr":100000000,"slab_b_max_inr":500000000,"slab_c_max_inr":2500000000,"slab_a_incubation_equity_max_percent":3,"slab_b_total_incubation_equity_max_percent":4.5,"slab_c_next_round_discount_percent_range":[15,30],"application_to_disbursal_target_months_max":3,"nqm_hub_count":4},"unknown_handling":"needs_information"},
        "application":{"portal":"https://dst.gov.in/node/8226","route":"Identify the relevant NQM hub and current call, apply to only one hub, submit the team/problem/product/business/funding-use material, complete technical and business evaluation, legal and financial diligence, Board/IEMC approval and the applicable equity agreement.","hub_routes":["https://qcinnovation.co.in/","https://samgnya.in/","https://qmettech.com/","https://qmdhub.co.in/"],"selection":"Applications may be cohort-based, rolling, problem-statement or open-challenge based. A hub IEMC evaluates need, feasibility, impact, novelty, team, fund use, funds raised and presentation; selected applicants undergo diligence and milestone-controlled release.","fees":"The guideline describes incubation-equity and negotiated investment terms; no universal application fee is asserted. Confirm hub, facility, mentor and transaction terms in the current call and agreement.","applicant_note":"UdyamVeda can prepare quantum-technology, DPIIT, Indian ownership/IP, technical, market, funding-use and milestone evidence, but cannot represent the startup, choose a hub on its behalf or guarantee selection/equity terms."},
        "fine_print":{"support_model":"NQM support may be provided through four Section-8 thematic hubs. The initial implementation route included I-HUB Quantum Technology Foundation at IISER Pune, with later support through the NQM hubs.","application_modes":"The guideline allows quarterly cohorts, rolling evaluation, problem statements, open challenges and hub/technical-group recommendations; the current mode must be verified from the applicable hub call.","financial_support":"Track 1 references seed funding up to INR 5 crore with incubation equity; Slab A is up to INR 1 crore and Slab B is above INR 1 crore up to INR 5 crore. Track 2 Slab C describes equity or CCPS up to INR 25 crore for startups with prior VC rounds. These are guideline ceilings/reference structures, not automatic entitlements.","equity_and_milestones":"The guideline describes up to 3% incubation equity for Slab A, up to total 4.5% for Slab B, negotiated equity/CCPS terms for Slab C, milestone-based tranches, equity agreements and hub approval. Actual terms require the current hub route and agreement.","non_financial_support":"NQM hubs may provide technical and business mentors, access to facilities, user-agency engagement, demo days and Government procurement preference where applicable; these are not guaranteed outcomes.","current_portal_state":"DST's official startup page lists four hubs and says startups should apply to only one. Individual hub windows and currently open calls must be confirmed before actioning.","review_note":"Reconcile the latest DST guidelines/amendments, current hub list, current hub calls, applicant route, DPIIT/Indian-company/IP tests, quantum vertical, funding slab, equity/CCPS terms, valuation, dilution, milestones, monitoring, facility charges, procurement preference and grievance route before publication."},
        "benefit_summary":{"types":["equity_investment","grant","incubation","mentorship","testing_access","market_access"],"summary":"Hub-mediated NQM support for selected quantum-technology startups, potentially including milestone-based funding, equity/CCPS, mentoring, facilities, user engagement and procurement preference; current hub call and negotiated terms are required.","separate_value_buckets":true},
        "benefit_type":"equity_investment",
        "benefit_label":"NQM hub-mediated quantum startup support - funding and equity terms vary",
        "benefit_conditions":{"current_hub_call_required":true,"selection_required":true,"milestone_release":true,"equity_or_ccps_agreement_possible":true,"not_guaranteed":true,"apply_to_one_hub_only":true},
        "requirement":"DPIIT-registered Indian quantum-technology startup with Indian ownership/IP, commercialisation plan and current hub-route fit",
        "requirement_description":"Prepare DPIIT recognition, incorporation and Indian ownership records, IP location, quantum technology mapping, problem statement, product/PoC or pilot evidence, team, market, business model, funding requirement, use-of-funds plan, milestones, prior funding and regulatory/technical documents.",
        "rules":{"all":[{"field":"dpiit_recognized","operator":"equals","value":true},{"field":"indian_company_and_ip_verified","operator":"equals","value":true},{"field":"quantum_technology_fit_verified","operator":"equals","value":true},{"field":"current_nqm_hub_call_verified","operator":"equals","value":true},{"field":"application_submitted_to_only_one_hub","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Map the startup to one NQM vertical","description":"Choose the relevant current hub and vertical: quantum computing, communication, sensing/metrology, or materials/devices. Apply to only one hub for the relevant route.","url":"https://dst.gov.in/node/8226"},{"title":"Verify startup and Indian-company eligibility","description":"Confirm DPIIT registration, Indian holding company status, India-resident IP, majority Indian ownership and at least 51% Indian promoter shareholding.","url":"https://dst.gov.in/sites/default/files/Guidelines%20to%20support%20start-ups.pdf"},{"title":"Prepare the technical and business dossier","description":"Prepare team, problem, product/service, quantum technology, market, customer, novelty/IP, funds-needed, use-of-funds, prior-funding and milestone evidence.","url":"https://dst.gov.in/sites/default/files/Guidelines%20to%20support%20start-ups.pdf"},{"title":"Submit through the current hub call","description":"Use the current official hub route, complete technical/business evaluation and retain all call, diligence, equity-agreement and milestone records.","url":"https://dst.gov.in/node/8226"}],
        "window_type":"rolling",
        "window_label":"Guideline supports cohort-based and rolling applications, but the actionable window is hub-specific and must be confirmed from a current NQM hub call.",
        "window_evidence":{"source_url":"https://dst.gov.in/sites/default/files/Guidelines%20to%20support%20start-ups.pdf","anchor":"Pages 2-3: cohort-based, rolling, problem-statement and open-challenge application routes"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Science and Technology', 'Department of Science and Technology - National Quantum Mission', item->>'authority_url'
    where not exists (select 1 from public.authorities where name = item->>'authority')
    returning id into authority_id;
    if authority_id is null then
      select id into authority_id from public.authorities where name = item->>'authority' limit 1;
    end if;

    seed_opportunity_id := null;
    insert into public.opportunities (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (item->>'slug', item->>'name', item->>'type', coalesce(item->>'lifecycle_status', 'in_review'), authority_id, '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, authority_id = excluded.authority_id, canonical_url = excluded.canonical_url, status = excluded.status
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then
      select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1;
    end if;

    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.91, 0.87, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = coalesce(item->>'lifecycle_status', 'in_review') where public.opportunities.id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, 'https://dst.gov.in/node/8226', 'official_startup_call', 'DST National Quantum Mission startup call', 'Startup - Call for Proposals; four hub routes and apply-to-one-hub instruction', now(), false),
      (version_id, 'https://dst.gov.in/dst-drive-quantum-leap-indian-startups-i-hub-qtf-iiser-pune-issues-call-proposals', 'pib_or_ministry_release', 'DST NQM startup support announcement', 'Guidelines, I-HUB QTF implementation route, funding, mentorship and facilities', now(), false),
      (version_id, 'https://dst.gov.in/national-quantum-mission-nqm', 'ministry_portal', 'DST National Quantum Mission page', 'Current NQM mission and hub activity context', now(), false),
      (version_id, 'https://qcinnovation.co.in/', 'implementing_hub_portal', 'NQM Quantum Computing Innovation hub', 'Hub route linked by official DST startup call', now(), false),
      (version_id, 'https://samgnya.in/', 'implementing_hub_portal', 'NQM Quantum Communication hub', 'Hub route linked by official DST startup call', now(), false),
      (version_id, 'https://qmettech.com/', 'implementing_hub_portal', 'NQM Quantum Sensing and Metrology hub', 'Hub route linked by official DST startup call', now(), false),
      (version_id, 'https://qmdhub.co.in/', 'implementing_hub_portal', 'NQM Quantum Materials and Devices hub', 'Hub route linked by official DST startup call', now(), false),
      (version_id, 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'discovery_playbook', 'Startup India Government Schemes Playbook NQM entry', 'NQM discovery entry for quantum technology startup support', now(), false)
    on conflict do nothing;
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
