-- BIRAC Sustainable Entrepreneurship and Enterprise Development (SEED) Fund.
-- The programme is evidenced as an active partner-mediated equity route, but
-- no universal current startup call was verified; keep it paused and review-gated.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('BIRAC SEED Fund official page', 'https://www.birac.nic.in/seedFundNew.php', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Official BIRAC page describing the post-PoC biotech startup route, partner incubators, current partner-mediated access and programme figures.'),
  ('BIRAC SEED Fund guidelines', 'https://www.birac.nic.in/webcontent/1616486925_seed_fund_Guidelines.pdf', 'scheme_guideline', 'central', 'monthly', 1, true, 'Official three-page BIRAC guideline defining incubator eligibility, startup ownership, investment ceiling, instruments, agreements, monitoring and exits.'),
  ('BIRAC SEED Fund description', 'https://www.birac.nic.in/description_new.php?id=263', 'scheme_description', 'central', 'monthly', 1, true, 'Official BIRAC description of the incubator SEED Fund framework and selected-incubator implementation.'),
  ('ISTI SEED Fund discovery record', 'https://www.indiascienceandtechnology.gov.in/programme-schemes/sustainable-entrepreneurship-and-enterprise-development-seed-fund-0', 'government_discovery_portal', 'central', 'monthly', 1, true, 'Government science and technology discovery record; BIRAC page and guideline control the operational record.'),
  ('Startup India Government Schemes Playbook SEED entry', 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'discovery_playbook', 'central', 'monthly', 1, true, 'Official Startup India discovery entry; BIRAC sources control the operational record.')
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
        "slug":"birac-seed-fund-biotech-startup-equity",
        "name":"SEED Fund - Sustainable Entrepreneurship and Enterprise Development Fund",
        "type":"equity_investment",
        "lifecycle_status":"paused",
        "authority":"Biotechnology Industry Research Assistance Council (BIRAC)",
        "authority_url":"https://birac.nic.in/",
        "canonical_url":"https://www.birac.nic.in/seedFundNew.php",
        "source_url":"https://www.birac.nic.in/webcontent/1616486925_seed_fund_Guidelines.pdf",
        "source_kind":"official_scheme_guideline",
        "source_title":"BIRAC SEED Fund guidelines",
        "source_anchor":"Pages 1-3: scope, incubator criteria, startup ownership, investment ceiling, instruments, monitoring and exit terms",
        "summary":"A BIRAC equity and equity-linked support route for post-proof-of-concept biotechnology and life-science startups, delivered through selected BioNEST incubators to bridge promoter funding and angel or venture investment.",
        "objective":"Provide first equity exposure and capital assistance to promising post-PoC biotech startups so they can cover early startup costs and progress toward angel, venture or institutional financing.",
        "legal_basis":"BIRAC's Sustainable Entrepreneurship and Enterprise Development Fund guideline for BIRAC-funded incubators, administered under the Department of Biotechnology; the current BIRAC partner route and any later amendment control the live programme.",
        "eligibility":{"entity_types":["startup","private_limited_company","biotechnology_startup","life_science_startup"],"lifecycle_stages":["post_proof_of_concept","early_stage","commercialization_preparation","scale_up_readiness"],"industries":["biotechnology","life_sciences","medtech","biopharmaceuticals","biomedical_devices","healthcare_technology","agri_biotechnology","industrial_biotechnology"],"locations":["India"],"conditions":["the startup must be identified and selected through a BIRAC SEED Fund partner incubator","the startup must be registered under the Companies Act, 2013","at least 51% of shareholders must be Indian citizens; OCI and PIO holdings do not satisfy this mandatory condition","the startup should be at post-PoC stage with new and meritorious ideas, innovations or technologies","the proposal must pass the selected incubator's due diligence, selection mechanism and investment committee process","the startup must enter a legally binding funding and investment agreement with the incubator","the startup must satisfy any current BioNEST partner-specific eligibility, diligence, sector and milestone conditions"],"exclusions":["individual applicants without an eligible startup entity are not the beneficiary route","a startup may not receive BIRAC SEED Funding support more than once","the BIRAC page and guideline do not establish a universal open application window for all startups","the INR 30 lakh figure is a maximum investment ceiling, not a guaranteed grant or entitlement","support is equity or equity-linked investment, not a non-repayable startup grant","current partner availability, valuation, dilution, instrument, milestones and investment approval remain incubator-controlled","the selected incubator must address conflicts of interest before final recommendation"],"thresholds":{"maximum_startup_investment_inr":3000000,"minimum_indian_citizen_shareholding_percent":51,"incubator_fund_range_min_inr":10000000,"incubator_fund_range_max_inr":20000000,"implementation_period_months":36,"minimum_incubator_operating_years":3,"minimum_resident_biotech_life_science_startups":5},"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.birac.nic.in/seedFundNew.php","route":"Review the BIRAC SEED Fund partner list, identify a suitable selected BioNEST incubator, follow that incubator's current startup intake or proposal route, complete technical and commercial diligence, and execute the incubator's legally binding investment agreement if selected.","selection":"Selected BioNEST incubators design the startup screening and selection process. Their investment or expert committee evaluates the proposal, while BIRAC governance and nominee requirements apply under the guideline.","fees":"No universal application fee was identified in the reviewed official sources. Confirm any incubator-specific participation, diligence, legal or programme cost before proceeding.","documents":["certificate of incorporation and constitutional documents","shareholding and Indian-citizen ownership evidence","post-PoC technical dossier and validation evidence","IP ownership, freedom-to-operate and IP/technology-transfer information","founder and key-team profiles","commercialization, market and scale-up plan","financial statements, cap table and use-of-funds plan","milestones, budget and hiring/equipment requirements","conflict-of-interest and related-party declarations","documents requested by the selected BioNEST incubator and investment committee"],"applicant_note":"UdyamVeda can prepare the SEED Fund partner, eligibility, diligence, equity-instrument and document checklist, but cannot submit on behalf of the applicant, negotiate investment terms or represent the ceiling as assured funding."},
        "fine_print":{"support_model":"SEED Fund is an equity/equity-linked investment route delivered through selected BIRAC-supported BioNEST incubators; BIRAC provides grant-in-aid to the incubator and the incubator invests in selected startups.","benefit_boundary":"The guideline permits up to INR 30 lakh per startup for equity or equity-linked instruments and startup costs such as equipment, supplies and employees. The incubator-level INR 100-200 lakh fund and the startup-level INR 30 lakh ceiling are separate value buckets.","instrument_boundary":"The equity or equity-linked instruments are held in the incubator's name under a legally binding agreement; instrument, valuation, dilution, exit and governance terms must be reviewed before acceptance.","governance_boundary":"The incubator must include a BIRAC nominee in the SEED Fund Governance Committee, monitor milestones, provide hand-holding, and submit half-yearly reports with utilization and account statements.","return_boundary":"On exit, the incubator retains 50% of gross investment return and must restitute the remaining 50% to BIRAC within 60 days, subject to the governing agreement and applicable guideline.","current_state":"The BIRAC page lists 16 SEED Fund partner BioNEST incubators and a partner-mediated startup route, but its displayed impact figures are marked February 2023 and no universal current startup call or deadline was verified. Do not present the route as currently open without partner-level confirmation.","review_note":"Before publication, verify the current partner list, current partner-level calls, fund availability, investment instruments, valuation/dilution, due diligence, IP and board-observer terms, selection timelines, grievance route, amendments and whether the 2016 guideline remains the controlling document."},
        "benefit_summary":{"types":["equity_investment","equity_linked_instrument","incubation","mentorship"],"summary":"A selected post-PoC biotech startup may receive up to INR 30 lakh through equity or equity-linked instruments from a BIRAC SEED Fund partner incubator, subject to partner selection, diligence and investment agreement; no current universal call is asserted.","separate_value_buckets":true},
        "benefit_type":"equity_investment",
        "benefit_label":"Up to INR 30 lakh equity or equity-linked investment per selected post-PoC biotech startup",
        "benefit_conditions":{"selection_required":true,"partner_incubator_required":true,"investment_agreement_required":true,"not_guaranteed":true,"grant_not_cash_entitlement":true},
        "requirement":"Post-PoC biotechnology or life-science startup with Indian ownership, technical/commercial evidence, a selected BIRAC SEED Fund partner route and investment-ready documentation",
        "requirement_description":"Prepare the startup entity, Indian-citizen shareholding, post-PoC validation, IP, technical dossier, commercialization plan, cap table, financials, milestones and partner-specific investment documents.",
        "rules":{"all":[{"field":"biotech_or_life_science_fit_verified","operator":"equals","value":true},{"field":"post_poc_stage_verified","operator":"equals","value":true},{"field":"indian_citizen_shareholding_percent","operator":"greater_than_or_equal","value":51,"unit":"percent"},{"field":"selected_seed_partner_route_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm the biotech and post-PoC fit","description":"Map the product, technology, proof-of-concept evidence and intended commercial use to the BIRAC SEED Fund scope." ,"url":"https://www.birac.nic.in/seedFundNew.php"},{"title":"Verify Indian ownership and company status","description":"Confirm Companies Act registration and at least 51% shareholding by Indian citizens, excluding OCI and PIO holdings for this mandatory criterion.","url":"https://www.birac.nic.in/webcontent/1616486925_seed_fund_Guidelines.pdf"},{"title":"Choose a current SEED Fund partner route","description":"Use the official BIRAC partner list and confirm that the selected BioNEST incubator is currently accepting or sourcing proposals; do not infer an open call from the static programme page.","url":"https://www.birac.nic.in/seedFundNew.php"},{"title":"Submit diligence materials and review investment terms","description":"Follow the partner incubator's intake and committee process, then review valuation, dilution, instrument, milestones, governance, exit and reporting terms before signing.","url":"https://www.birac.nic.in/webcontent/1616486925_seed_fund_Guidelines.pdf"}],
        "window_type":"partner_intake",
        "window_label":"The SEED Fund programme and partner route are evidenced, but no universal current startup application window or deadline was verified; keep paused until a selected BioNEST partner confirms an active intake.",
        "window_evidence":{"source_url":"https://www.birac.nic.in/seedFundNew.php","anchor":"Lines 23-25 and 73-75: post-PoC route, partner-mediated startup access and guidelines link; no universal current startup call is stated"}
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.94, 0.92, 'in_review')
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
      (version_id, 'https://www.birac.nic.in/seedFundNew.php', 'implementing_agency_portal', 'BIRAC SEED Fund official page', 'Post-PoC objective, partner incubator route, startup access and displayed impact context', now(), false),
      (version_id, 'https://www.birac.nic.in/description_new.php?id=263', 'scheme_description', 'BIRAC SEED Fund description', 'Incubator framework and selected-incubator implementation', now(), false),
      (version_id, 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'discovery_playbook', 'Startup India Government Schemes Playbook SEED entry', 'SEED equity-funding discovery entry', now(), false)
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
