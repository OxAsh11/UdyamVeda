-- TIES is preserved as a review-gated institutional infrastructure record.
-- It must not be ranked as a direct startup or exporter cash opportunity.

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
        "slug":"trade-infrastructure-for-export-scheme-ties",
        "name":"Trade Infrastructure for Export Scheme (TIES)",
        "type":"grant",
        "lifecycle_status":"closed",
        "authority":"Department of Commerce - Trade Infrastructure for Export Scheme",
        "authority_url":"https://www.commerce.gov.in/",
        "canonical_url":"https://www.commerce.gov.in/wp-content/uploads/2021/07/TIES-revised-guidelines-FY22-to-FY26.pdf",
        "source_url":"https://www.commerce.gov.in/wp-content/uploads/2021/07/TIES-revised-guidelines-FY22-to-FY26.pdf",
        "source_kind":"guideline",
        "source_title":"Trade Infrastructure for Export Scheme (TIES) Guidelines, FY 2021-22 to FY 2025-26",
        "source_anchor":"Objectives, scope, eligible implementing agencies and extent of financial assistance, pages 1-4",
        "summary":"Institutional project grant for export-oriented infrastructure such as testing and certification labs, cold chains, trade promotion centres, dry ports, export warehousing, packaging and export-logistics connectivity.",
        "objective":"Bridge export-infrastructure gaps and improve export competitiveness through focused infrastructure, quality/certification facilities and first-mile or last-mile export connectivity.",
        "legal_basis":"Trade Infrastructure for Export Scheme (TIES), Department of Commerce, Ministry of Commerce and Industry; revised guidelines for FY 2021-22 to FY 2025-26.",
        "eligibility":{"entity_types":["central_government_agency","state_government_agency","export_promotion_council","commodity_board","sez_authority","recognised_apex_trade_body","government_joint_venture","eligible_ppp_project"],"lifecycle_stages":["pre_start","expansion","operate","export_infrastructure_development"],"industries":["export_logistics","testing_and_certification","cold_chain","warehousing","packaging","trade_promotion","ports_and_cargo","sez_infrastructure"],"locations":["India","north_east","himalayan_state","jammu_and_kashmir","ladakh","export_corridor"],"conditions":["the implementing agency must own the facility and be responsible for operation and maintenance","the project must establish overwhelming export linkage and address a documented infrastructure gap","the agency must prepare a DPR, obtain statutory approvals and use transparent competitive procurement","land must be available and unencumbered and the project must not receive duplicate support under another sector-specific Central scheme"],"thresholds":{"normal_grant_ceiling_per_project_inr":200000000,"normal_grant_share_of_equity_percent":50,"special_area_or_low_capacity_grant_share_of_equity_percent":80,"guideline_period_end":"2026-03-31"},"unknown_handling":"needs_information"},
        "exclusions":["ordinary startups, exporters or individuals applying for a direct personal grant under TIES","general highways, power or infrastructure without overwhelming export linkage","projects already covered by a sector-specific scheme or listed in the negative list","recurring expenditure, establishment cost or land cost claimed as eligible Central assistance","the historical FY 2021-22 to FY 2025-26 guideline period being presented as a currently open national application window"],
        "application":{"portal":"https://www.commerce.gov.in/","route":"Eligible implementing agencies must follow the Department of Commerce proposal and Empowered Committee route; the claim-monitoring portal is for status visibility and is not treated as a fresh-application portal.","selection":"Technical and financial vetting, Nodal Ministry or State Export Commissioner review where applicable, Empowered Committee decision, project milestones, utilization evidence and operation-and-maintenance commitments.","fees":"No applicant fee is inferred from the official guideline.","applicant_note":"UdyamVeda should show this as institutional export-infrastructure support and route ordinary businesses to relevant exporter, market-access or sector schemes instead of recommending TIES directly."},
        "fine_print":{"scope":"The guideline covers border haats, land customs stations, quality testing and certification labs, cold chains, trade promotion centres, dry ports, export warehousing and packaging, SEZs, cargo terminals and export-logistics connectivity.","agency_boundary":"Eligible agencies include Central and State Government agencies, Export Promotion Councils, Commodity Boards, SEZ Authorities, recognised apex trade bodies, qualifying government joint ventures and PPP projects. The agency must own and operate the facility.","assistance":"Central assistance is normally not more than the implementing agency equity or 50% of total equity, up to 80% in specified special-area or low-capacity circumstances, with a normal ceiling of ₹20 crore per infrastructure project. The ceiling is project-level and not an exporter entitlement.","current_status":"The revised guideline states FY 2021-22 to FY 2025-26. July 2025 committee minutes and the official claim monitor show continuing implementation/claims, but do not prove a new FY 2026-27 proposal window.","review_note":"Confirm whether any successor or extension exists, whether a new proposal window is open, remaining committed outlay, agency route, special-area treatment, eligible costs, procurement, land, statutory approvals and clawback/undertaking terms before publication."},
        "benefit_summary":{"types":["grant","export_infrastructure","market_access_support"],"summary":"Institutional project grant for export infrastructure. It supports implementing agencies and facilities used by exporters; it is not a direct startup grant, exporter reimbursement or individual benefit.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"TIES institutional export-infrastructure grant; normal ceiling ₹20 crore per project subject to agency equity and current route",
        "amount_max":200000000,
        "benefit_conditions":{"institutional_project_support":true,"normal_grant_ceiling_inr":200000000,"normal_grant_share_of_equity_percent":50,"special_area_share_may_reach_percent":80,"implementing_agency_ownership_required":true,"new_window_not_asserted":true},
        "requirement":"Eligible implementing agency with export-linked infrastructure gap, DPR, financing and statutory readiness",
        "requirement_description":"Prepare export-gap evidence, DPR, site and land title, project cost, equity and financing, export linkage, measurable outcomes, procurement plan, statutory clearances and sustainable operation-and-maintenance model.",
        "rules":{"all":[{"field":"eligible_ties_implementing_agency","operator":"equals","value":true},{"field":"overwhelming_export_linkage_verified","operator":"equals","value":true},{"field":"dpr_finance_land_and_statutory_documents_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Check whether a current TIES or successor window exists","description":"Review the Department of Commerce portal and current notices; do not treat claim monitoring or historical committee minutes as a new applicant call.","url":"https://www.commerce.gov.in/"},{"title":"Prepare the export-infrastructure DPR","description":"Document the infrastructure gap, export linkage, measurable outcomes, site, financing, equity, statutory clearances, procurement and O&M plan.","url":"https://www.commerce.gov.in/wp-content/uploads/2021/07/TIES-revised-guidelines-FY22-to-FY26.pdf"},{"title":"Use the institutional appraisal and approval route","description":"Submit through the current Department of Commerce route if open, retain committee/appraisal evidence and track release, utilization and completion obligations.","url":"https://www.commerce.gov.in/wp-content/uploads/2025/08/MoM_20th-EC_23.07.2025.pdf"}],
        "window_type":"closed",
        "window_label":"The captured guideline period is FY 2021-22 to FY 2025-26. Existing implementation and claims continued to be monitored, but no FY 2026-27 fresh proposal window is asserted.",
        "window_evidence":{"source_url":"https://www.commerce.gov.in/wp-content/uploads/2021/07/TIES-revised-guidelines-FY22-to-FY26.pdf","anchor":"15th FCP (FY 2021-22 to FY 2025-26), page 1"},
        "review_note":"Review as a closed/institutional route unless the Department of Commerce publishes an extension or successor call. Do not recommend directly to ordinary startups or exporters."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Commerce and Industry', 'Department of Commerce', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.9, 0.86, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1; end if;
    update public.opportunities
       set current_version_id = version_id,
           status = coalesce(item->>'lifecycle_status', 'in_review')
     where id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true),
      (version_id, 'https://www.commerce.gov.in/', 'ministry_portal', 'Department of Commerce official portal', 'Official scheme and notice portal', now(), false),
      (version_id, 'https://apps.commerce.gov.in/schemes/schemereport', 'monitoring_portal', 'Department of Commerce scheme claim monitoring system', 'TIES status and claims context', now(), false),
      (version_id, 'https://www.commerce.gov.in/wp-content/uploads/2025/08/MoM_20th-EC_23.07.2025.pdf', 'notice', 'TIES 20th Empowered Committee minutes', 'Implementation status and proposals considered', now(), false),
      (version_id, 'https://www.commerce.gov.in/wp-content/uploads/2025/03/LS-USQ-No.2050-dated.-11.03.2025.pdf', 'policy_update', 'Department of Commerce Projects under TIES parliamentary answer', 'TIES objective, eligible Central/State agencies, joint ventures and projects sanctioned through 11 March 2025', now(), false)
    on conflict do nothing;

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
    select version_id, item->>'window_type', '2026-03-31 23:59:59+05:30'::timestamptz, item->>'window_label', item->'window_evidence'
    where not exists (select 1 from public.opportunity_windows where opportunity_version_id = version_id);
    insert into public.review_tasks (opportunity_version_id, task_type, status)
    select version_id, 'publish', 'open'
    where not exists (select 1 from public.review_tasks where opportunity_version_id = version_id and task_type = 'publish' and status in ('open', 'in_review'));
  end loop;
end $$;
