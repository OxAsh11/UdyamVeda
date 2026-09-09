-- Startup India Fund of Funds 2.0.
-- This is an indirect funding opportunity: Government capital is committed to
-- eligible AIFs, not directly to startups. It remains review-gated.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('DPIIT Startup India Fund of Funds 2.0 operational guidelines', 'https://www.dpiit.gov.in/static/uploads/2026/04/8949d8e0dabf11cb9291b00ec1d1f727.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official DPIIT operational guidelines for the Fund of Funds 2.0.'),
  ('DPIIT Startup India Fund of Funds 2.0 notification', 'https://www.dpiit.gov.in/static/uploads/2026/04/3382625ffc31ea32ecc33ea68365172d.pdf', 'gazette', 'central', 'monthly', 1, true, 'Official DPIIT notification and VCIC/implementing-agency arrangements.'),
  ('Startup India Fund of Funds 2.0 scheme document', 'https://www.startupindia.gov.in/content/dam/startupindia/Startup-India-Fund-of-Funds-2.0-Scheme.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official Startup India scheme document for corpus and objectives.'),
  ('SIDBI Fund of Funds application portal', 'https://vcfapplication.sidbi.in/login', 'agency', 'central', 'weekly', 1, true, 'Official SIDBI route for eligible AIF proposals; not a direct startup application route.')
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
        "slug":"startup-india-fund-of-funds-2",
        "name":"Startup India Fund of Funds 2.0",
        "type":"equity_investment",
        "authority":"Department for Promotion of Industry and Internal Trade - Startup India",
        "authority_url":"https://www.startupindia.gov.in/",
        "canonical_url":"https://www.dpiit.gov.in/static/uploads/2026/04/8949d8e0dabf11cb9291b00ec1d1f727.pdf",
        "source_url":"https://www.dpiit.gov.in/static/uploads/2026/04/8949d8e0dabf11cb9291b00ec1d1f727.pdf",
        "source_kind":"guideline",
        "source_title":"Operational Guidelines for Startup India Fund of Funds 2.0",
        "source_anchor":"Pages 1-5: principal features, purpose, investment in AIFs, investment by AIFs, operating expenses, AIF selection process and Annexure-I parameters",
        "summary":"Government-backed venture-capital access routed through selected SEBI-registered Alternative Investment Funds (AIFs) for DPIIT-recognized startups.",
        "objective":"Mobilise venture capital for startups across stages and sectors, with emphasis on innovation-driven manufacturing, long-gestation technology and smaller funds supporting early-growth startups.",
        "legal_basis":"DPIIT notification dated 13 April 2026 and operational guidelines issued on 25 April 2026 for Startup India Fund of Funds 2.0.",
        "eligibility":{"entity_types":["dpiit_recognized_startup","sebi_registered_category_i_or_ii_aif"],"lifecycle_stages":["validation","early_revenue","growth","scaling"],"startup_conditions":["the startup must be recognized by DPIIT under the latest applicable criteria","startup access is through an AIF selected under the scheme"],"aif_conditions":["the AIF must be Category I or Category II","the AIF must be registered with SEBI"],"conditions":["A startup can only access the scheme indirectly through a selected AIF and must satisfy that AIF's mandate and diligence.","An AIF route requires Category I or Category II status and SEBI registration."],"exclusions":["the Government corpus is not a direct grant, subsidy or individual startup entitlement","the startup must separately satisfy the selected AIF investment mandate, diligence and commercial terms","the selected-AIF list, proposal windows and startup-facing access route require current review"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://vcfapplication.sidbi.in/login","route":"Use the applicable route: a startup approaches a selected AIF for investment, while an eligible AIF submits a proposal through the current implementing-agency route.","startup_route":"Approach selected AIFs for investment; there is no direct startup application to the Fund of Funds.","aif_route":"Eligible AIFs submit proposals through the SIDBI Fund Application Portal or the current implementing-agency route.","aif_portal":"https://vcfapplication.sidbi.in/login","direct_startup_application":false,"applicant_note":"UdyamVeda can separate the startup and AIF routes and prepare diligence checklists, but cannot promise investment or act as DPIIT, SIDBI or an AIF."},
        "fine_print":{"corpus_inr":100000000000,"implementation_agency":"Small Industries Development Bank of India (SIDBI), with another domestic implementing agency to be selected by DPIIT","investment_route":"The Fund invests in eligible AIFs; AIFs invest in startup equity, equity-linked and permitted debt instruments","aif_categories":["category_i","category_ii"],"aggregate_government_fund_of_funds_limit_percent_of_aif_corpus":50,"operating_expense_cap_percent_per_annum":0.50,"finance_commission_cycles":["16th","17th"],"priority_segments":["deep_tech_startups","early_growth_startups","innovation_driven_manufacturing","sector_or_stage_agnostic_startups","startups_beyond_metro_regions"],"annexure_parameters":{"deep_tech":{"aif_corpus_cap":"none","aif_life_years_max":18,"contribution_percent_max":40,"contribution_inr_max":5000000000,"minimum_investment_multiplier":1.5},"smaller_aif_early_growth":{"aif_corpus_inr_max":4000000000,"aif_life_years_max":10,"contribution_percent_max":30,"contribution_inr_max":1000000000,"minimum_investment_multiplier":2,"private_placement_memorandum":"At least 50% of corpus for seed/early-stage funding and funding up to Rs. 10 crore per startup."},"innovative_manufacturing":{"aif_corpus_cap":"none","aif_life_years_max":18,"contribution_percent_max":30,"contribution_inr_max":2000000000,"minimum_investment_multiplier":1.75,"private_placement_memorandum":"Support technology-driven innovative startups in at least one manufacturing-oriented champion sector."},"sector_or_stage_agnostic":{"aif_corpus_cap":"none","aif_life_years_max":12,"contribution_percent_max":25,"contribution_inr_max":1800000000,"minimum_investment_multiplier":2.5}},"review_note":"Confirm the latest operational guidelines, Annexure-I segment multipliers, selected AIF list, AIF application window, startup-facing access route, investment instruments, disclosure requirements and subsequent DPIIT amendments before publication. Do not present the Rs. 10,000 crore corpus as an amount available to an individual startup."},
        "benefit_summary":{"types":["equity_investment"],"corpus_total_inr":100000000000,"summary":"Indirect venture-capital access through selected AIFs; no direct grant, subsidy or individual startup entitlement is created by the corpus figure.","separate_value_buckets":true},
        "benefit_type":"equity_investment",
        "benefit_label":"Indirect venture-capital access through selected AIFs",
        "benefit_conditions":{"route":"selected SEBI-registered Category I or II AIFs","not_direct_cash_grant":true,"not_individual_entitlement":true,"startup_must_meet_aif_investment_criteria":true},
        "requirement":"DPIIT recognition and selected-AIF route",
        "requirement_description":"A startup must hold applicable DPIIT recognition and approach a selected AIF; an AIF applicant must be Category I or II and SEBI-registered and follow the implementing-agency proposal process.",
        "rules":{"any":[{"all":[{"field":"applicant_role","operator":"equals","value":"startup"},{"field":"dpiit_recognized","operator":"equals","value":true},{"field":"selected_scheme_aif_available","operator":"equals","value":true}]},{"all":[{"field":"applicant_role","operator":"equals","value":"aif"},{"field":"aif_category","operator":"in","value":["category_i","category_ii"]},{"field":"sebi_registered","operator":"equals","value":true}]}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm the correct applicant route","description":"Determine whether the business is seeking indirect AIF-backed investment or whether the applicant is an eligible AIF submitting a fund proposal. These are different routes.","url":"https://www.dpiit.gov.in/static/uploads/2026/04/8949d8e0dabf11cb9291b00ec1d1f727.pdf"},{"title":"Verify DPIIT recognition and AIF availability","description":"A startup should confirm DPIIT recognition and identify a selected AIF whose mandate fits its stage, sector and investment needs.","url":"https://www.dpiit.gov.in/static/uploads/2026/04/8949d8e0dabf11cb9291b00ec1d1f727.pdf"},{"title":"Approach the selected AIF","description":"Submit the startup pitch and diligence material directly to the selected AIF. UdyamVeda must not imply that the Government or SIDBI accepts a direct startup investment application through this scheme.","url":"https://www.startupindia.gov.in/"},{"title":"AIF applicants use the current SIDBI route","description":"An eligible AIF applicant should use the official SIDBI Fund Application Portal or the latest implementing-agency route and retain the submitted proposal and due-diligence record.","url":"https://vcfapplication.sidbi.in/login"}],
        "window_type":"rolling",
        "window_label":"The scheme commenced in April 2026; AIF proposal windows and selected-fund availability are controlled by the implementing agency and must be verified before recommendation.",
        "window_evidence":{"source_url":"https://www.dpiit.gov.in/static/uploads/2026/04/3382625ffc31ea32ecc33ea68365172d.pdf","anchor":"13 April 2026 notification and VCIC/implementing-agency arrangements"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Commerce and Industry', 'Department for Promotion of Industry and Internal Trade', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.90, 0.86, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where public.opportunities.id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://www.dpiit.gov.in/static/uploads/2026/04/3382625ffc31ea32ecc33ea68365172d.pdf', 'gazette', 'DPIIT Startup India Fund of Funds 2.0 notification', '13 April 2026 notification and VCIC/implementing-agency arrangements', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.dpiit.gov.in/static/uploads/2026/04/3382625ffc31ea32ecc33ea68365172d.pdf');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://www.startupindia.gov.in/content/dam/startupindia/Startup-India-Fund-of-Funds-2.0-Scheme.pdf', 'guideline', 'Startup India Fund of Funds 2.0 scheme document', 'Gazette notification: scheme commencement, corpus and objectives', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.startupindia.gov.in/content/dam/startupindia/Startup-India-Fund-of-Funds-2.0-Scheme.pdf');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://vcfapplication.sidbi.in/login', 'agency', 'SIDBI Fund of Funds application portal', 'AIF proposal/application route; not a direct startup application', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://vcfapplication.sidbi.in/login');
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
