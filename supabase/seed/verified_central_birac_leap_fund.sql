-- BIRAC Launching Entrepreneurial Driven Affordable Products (LEAP) Fund.
-- The programme is evidenced as an active partner-mediated equity route, but
-- no universal current startup call was verified; keep it paused and review-gated.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('BIRAC LEAP Fund official page', 'https://birac.nic.in/leapFundNew.php', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Official BIRAC page describing the post-PoC-to-pilot biotech route, partner incubators, current partner-mediated access and displayed impact context.'),
  ('BIRAC LEAP Fund operational guidelines', 'https://birac.nic.in/webcontent/1616486900_leap_fund_guidelines.pdf', 'scheme_guideline', 'central', 'monthly', 1, true, 'Official three-page BIRAC guideline defining incubator eligibility, startup ownership, investment ceiling, non-concurrency, milestones, governance, reporting and exit terms.'),
  ('BIRAC LEAP Fund legacy programme page', 'https://birac.nic.in/leapFund.php', 'scheme_description', 'central', 'monthly', 1, true, 'Official BIRAC programme description retained as supporting evidence for the fund framework and partner eligibility.'),
  ('BIRAC SEED Fund dependency page', 'https://www.birac.nic.in/seedFundNew.php', 'implementing_agency_portal', 'central', 'monthly', 1, true, 'Official SEED page used only to preserve the threshold and dependency boundary between SEED and LEAP.'),
  ('Startup India Government Schemes Playbook LEAP entry', 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'discovery_playbook', 'central', 'monthly', 1, true, 'Official Startup India discovery entry; BIRAC sources control the operational record.')
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
        "slug":"birac-leap-fund-biotech-startup-equity",
        "name":"LEAP Fund - Launching Entrepreneurial Driven Affordable Products Fund",
        "type":"equity_investment",
        "lifecycle_status":"paused",
        "authority":"Biotechnology Industry Research Assistance Council (BIRAC)",
        "authority_url":"https://birac.nic.in/",
        "canonical_url":"https://birac.nic.in/leapFundNew.php",
        "source_url":"https://birac.nic.in/webcontent/1616486900_leap_fund_guidelines.pdf",
        "source_kind":"official_scheme_guideline",
        "source_title":"BIRAC LEAP Fund operational guidelines",
        "source_anchor":"Pages 1-3: scope, funding framework, incubator criteria, startup ownership, investment ceiling, non-concurrency, monitoring and exit terms",
        "summary":"A BIRAC equity and equity-linked support route for post-proof-of-concept biotechnology, med-tech and life-science startups moving from piloting toward commercialization, delivered through selected BioNEST incubators.",
        "objective":"Help potential biotech startups pilot and commercialize products or technologies, shorten the path to commercialization and attract follow-on angel or venture investment.",
        "legal_basis":"BIRAC's Launching Entrepreneurial Driven Affordable Products Fund guideline for BIRAC-funded incubators, administered under the Department of Biotechnology; the current BIRAC partner route and any later amendment control the live programme.",
        "eligibility":{"entity_types":["startup","private_limited_company","biotechnology_startup","medtech_startup","life_science_startup"],"lifecycle_stages":["post_proof_of_concept","pilot","commercialization","venture_readiness"],"industries":["biotechnology","life_sciences","medtech","biopharmaceuticals","biomedical_devices","healthcare_technology","agri_biotechnology","industrial_biotechnology"],"locations":["India"],"conditions":["the startup must be identified and selected through a BIRAC LEAP Fund partner incubator","the startup must be registered under the Companies Act, 2013","at least 51% of shareholders must be Indian citizens; OCI and PIO holdings do not satisfy this mandatory condition","the startup should have a post-PoC product or technology with pilot or commercialization potential","the startup must satisfy the selected incubator's screening, diligence, investment and milestone process","the startup must execute a legally binding funding and investment agreement with the incubator","SEED funding must have completed and must not have been foreclosed or terminated before LEAP support","a startup suitable for up to INR 30 lakh investment support belongs under SEED, not LEAP","SEED, LEAP and AcE support are mutually exclusive instruments and SEED/LEAP support must not be concurrent"],"exclusions":["individual applicants without an eligible startup entity are not the beneficiary route","a startup may not receive BIRAC LEAP funding if its SEED funding duration has not completed or its SEED funding was foreclosed or terminated","a startup suitable for up to INR 30 lakh investment support must not be matched to LEAP","the INR 1 crore figure is a maximum investment ceiling, not a guaranteed grant or entitlement","support is equity or equity-linked investment, not a non-repayable startup grant","current partner availability, valuation, dilution, instrument, milestones and investment approval remain incubator-controlled","the selected incubator must address conflicts of interest before final recommendation"],"thresholds":{"maximum_startup_investment_inr":10000000,"minimum_indian_citizen_shareholding_percent":51,"incubator_fund_max_inr":50000000,"implementation_period_months":24,"minimum_incubator_operating_years":5,"minimum_resident_biotech_life_science_startups":5,"minimum_incubator_funding_experience_years":4,"seed_route_threshold_inr":3000000},"unknown_handling":"needs_information"},
        "application":{"portal":"https://birac.nic.in/leapFundNew.php","route":"Review the current BIRAC LEAP Fund partner list, identify a suitable selected BioNEST incubator, confirm partner-level startup intake, complete technical and commercial diligence, and execute the incubator's investment agreement if selected.","selection":"Selected LEAP partner incubators design the startup screening and selection process. Their investment or expert committee evaluates the proposal, while the BIRAC LEAP Fund Committee and governance nominee requirements apply under the guideline.","fees":"No universal application fee was identified in the reviewed official sources. Confirm any incubator-specific participation, diligence, legal or programme cost before proceeding.","documents":["certificate of incorporation and constitutional documents","shareholding and Indian-citizen ownership evidence","post-PoC validation and pilot-readiness dossier","IP ownership, freedom-to-operate and IP/technology-transfer information","founder and key-team profiles","pilot, commercialization, market and follow-on-funding plan","financial statements, cap table and use-of-funds plan","milestones, budget and tranche requirements","SEED funding completion/non-termination evidence","conflict-of-interest and related-party declarations","documents requested by the selected BioNEST incubator and investment committee"],"applicant_note":"UdyamVeda can prepare the LEAP partner, eligibility, dependency, diligence, equity-instrument and document checklist, but cannot submit on behalf of the applicant, negotiate investment terms or represent the ceiling as assured funding."},
        "fine_print":{"support_model":"LEAP Fund is an equity/equity-linked investment route delivered through selected BIRAC-supported BioNEST incubators; BIRAC provides grant-in-aid to the incubator and the incubator invests in selected startups.","benefit_boundary":"The guideline permits up to INR 1 crore per startup through equity or equity-linked instruments, while a selected partner may receive up to INR 5 crore for implementation. These are separate value buckets and neither is a guaranteed startup grant.","instrument_boundary":"The equity or equity-linked instruments are held in the incubator's name under a legally binding agreement; instrument, valuation, dilution, milestone tranche and exit terms must be reviewed before acceptance.","dependency_boundary":"LEAP is not a generic next step after any seed support. The guideline excludes a startup whose SEED duration has not completed or whose SEED support was foreclosed/terminated, routes startups suitable for up to INR 30 lakh to SEED, and states that SEED, LEAP and AcE are mutually exclusive and non-concurrent.","governance_boundary":"The incubator must include a BIRAC nominee in the LEAP Fund Governance Committee, monitor milestones, provide hand-holding, submit half-yearly reports with utilization/account statements and respond to BIRAC information or visit requests.","return_boundary":"On exit, the incubator retains 50% of gross investment return and must restitute the remaining 50% to BIRAC within 60 days, subject to the governing agreement and applicable guideline.","current_state":"The current BIRAC page lists six LEAP Fund partner BioNEST incubators and a partner-mediated startup route. Its displayed impact figures are marked February 2023, and no universal current startup call or deadline was verified. Do not present the route as currently open without partner-level confirmation.","review_note":"Before publication, verify the current selected partner list, partner-level intake, fund availability, SEED completion evidence, investment instrument, valuation/dilution, IP and governance terms, selection timelines, grievance route, amendments and current application route."},
        "benefit_summary":{"types":["equity_investment","equity_linked_instrument","incubation","commercialization_support"],"summary":"A selected post-PoC biotech, med-tech or life-science startup may receive up to INR 1 crore through equity or equity-linked instruments from a BIRAC LEAP partner incubator, subject to SEED dependency, partner selection, diligence and investment agreement; no current universal call is asserted.","separate_value_buckets":true},
        "benefit_type":"equity_investment",
        "benefit_label":"Up to INR 1 crore equity or equity-linked investment per selected post-PoC startup",
        "benefit_conditions":{"selection_required":true,"partner_incubator_required":true,"investment_agreement_required":true,"seed_dependency_check_required":true,"not_guaranteed":true,"grant_not_cash_entitlement":true},
        "requirement":"Post-PoC biotechnology, med-tech or life-science startup moving toward piloting or commercialization, with Indian ownership, SEED dependency evidence, a selected LEAP partner route and investment-ready documentation",
        "requirement_description":"Prepare the startup entity, Indian-citizen shareholding, post-PoC and pilot evidence, IP, technical dossier, commercialization plan, cap table, financials, SEED status, milestones and partner-specific investment documents.",
        "rules":{"all":[{"field":"biotech_medtech_or_life_science_fit_verified","operator":"equals","value":true},{"field":"post_poc_or_pilot_stage_verified","operator":"equals","value":true},{"field":"indian_citizen_shareholding_percent","operator":"greater_than_or_equal","value":51,"unit":"percent"},{"field":"selected_leap_partner_route_verified","operator":"equals","value":true},{"field":"seed_nonconcurrency_status_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm post-PoC and commercialization fit","description":"Map the product, technology, proof-of-concept evidence, pilot readiness and commercialization plan to the BIRAC LEAP Fund scope.","url":"https://birac.nic.in/leapFundNew.php"},{"title":"Verify Indian ownership and company status","description":"Confirm Companies Act registration and at least 51% shareholding by Indian citizens, excluding OCI and PIO holdings for this mandatory criterion.","url":"https://birac.nic.in/webcontent/1616486900_leap_fund_guidelines.pdf"},{"title":"Resolve SEED/LEAP/AcE routing","description":"Check whether the startup belongs under SEED at or below INR 30 lakh, whether SEED support has completed without foreclosure or termination, and that no concurrent support exists.","url":"https://birac.nic.in/webcontent/1616486900_leap_fund_guidelines.pdf"},{"title":"Choose a current LEAP partner route","description":"Use the official BIRAC partner list and confirm that the selected BioNEST incubator is currently accepting or sourcing proposals; do not infer an open call from the static programme page.","url":"https://birac.nic.in/leapFundNew.php"},{"title":"Submit diligence materials and review investment terms","description":"Follow the partner incubator's intake and committee process, then review valuation, dilution, instrument, milestones, governance, exit and reporting terms before signing.","url":"https://birac.nic.in/webcontent/1616486900_leap_fund_guidelines.pdf"}],
        "window_type":"partner_intake",
        "window_label":"The LEAP Fund programme and partner route are evidenced, but no universal current startup application window or deadline was verified; keep paused until a selected BioNEST partner confirms an active intake.",
        "window_evidence":{"source_url":"https://birac.nic.in/leapFundNew.php","anchor":"Lines 21-23 and 79-81: current partner-mediated startup access and guidelines link; no universal current startup call is stated"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Department of Biotechnology', 'Biotechnology Industry Research Assistance Council', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.95, 0.93, 'in_review')
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
      (version_id, 'https://birac.nic.in/leapFundNew.php', 'implementing_agency_portal', 'BIRAC LEAP Fund official page', 'Current partner route, post-PoC objective, partner criteria and programme context', now(), false),
      (version_id, 'https://birac.nic.in/leapFund.php', 'scheme_description', 'BIRAC LEAP Fund legacy programme page', 'Fund framework, up-to-INR 1 crore support, partner criteria and historical partner evidence', now(), false),
      (version_id, 'https://www.birac.nic.in/seedFundNew.php', 'implementing_agency_portal', 'BIRAC SEED Fund dependency page', 'SEED route used to preserve the mutually exclusive threshold boundary', now(), false),
      (version_id, 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'discovery_playbook', 'Startup India Government Schemes Playbook LEAP entry', 'LEAP equity-funding discovery entry and SEED threshold distinction', now(), false)
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
