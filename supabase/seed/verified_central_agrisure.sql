-- AgriSURE is a blended-capital Category II AIF with two distinct routes:
-- a Fund-of-Funds scheme for eligible AIFs and a Direct scheme for early-stage
-- agriculture/rural startups. It is equity/debt investment support, not a
-- grant or guaranteed founder entitlement. Keep both routes separate in review.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('NABVENTURES AgriSURE Fund page', 'https://nabventures.in/agrisure.aspx', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Official NABVENTURES page describing AgriSURE purpose, two schemes, corpus buckets, target sectors, duration, route and non-guarantee terms.'),
  ('NABARD AgriSURE FAQ', 'https://www.nabard.org/pdf/agrisure-faq.pdf', 'faq', 'central', 'monthly', 1, true, 'Official NABARD FAQ covering corpus, sponsors, investment manager, duration, target beneficiaries, two schemes and support boundaries.'),
  ('NABARD AgriSURE public notice', 'https://www.nabard.org/auth/writereaddata/WhatsNew/aisclaimer-for-agrisure.pdf', 'public_notice', 'central', 'monthly', 1, true, 'Official NABARD fraud-prevention notice confirming NABVENTURES as investment manager and direct contact route; no fee is charged for seeking assistance.'),
  ('PIB AgriSURE launch release', 'https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=2051466&lang=2&reg=48', 'pib_release', 'central', 'monthly', 1, true, 'Official Ministry of Agriculture and Farmers Welfare/PIB launch release describing blended capital and fund sponsors.'),
  ('Startup India Government Schemes Playbook AgriSURE entry', 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'discovery_playbook', 'central', 'monthly', 1, true, 'Official Startup India discovery entry used for cross-checking the startup-facing route; it is not the sole publication authority.')
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
        "slug":"agrisure-agri-fund-startups-rural-enterprises",
        "name":"AgriSURE - Agri Fund for Start-ups & Rural Enterprises",
        "type":"equity_investment",
        "lifecycle_status":"paused",
        "authority":"NABVENTURES Limited / NABARD - AgriSURE Fund",
        "authority_url":"https://nabventures.in/agrisure.aspx",
        "canonical_url":"https://nabventures.in/agrisure.aspx",
        "source_url":"https://nabventures.in/agrisure.aspx",
        "source_kind":"official_nabventures_fund_manager_portal",
        "source_title":"AgriSURE Fund - Agri Fund for Start-ups & Rural Enterprises",
        "source_anchor":"About AgriSURE, FoF Scheme, Direct Scheme, key features, target beneficiaries, duration, other information and investment-manager contact route",
        "summary":"A blended-capital SEBI Category II AIF promoted by the Ministry of Agriculture and Farmers Welfare and NABARD, with a Fund-of-Funds route for eligible AIFs and a Direct route for early-stage agriculture and rural startups.",
        "objective":"Support innovative, technology-driven, high-risk and high-impact activity in the agriculture and rural startup ecosystem through indirect AIF investments and direct equity investment in eligible startups.",
        "legal_basis":"AgriSURE fund documents, Private Placement Memorandum, applicable SEBI Alternative Investment Fund Regulations and official Ministry of Agriculture/NABARD/NABVENTURES materials; the current fund-manager terms and investment-manager decision control each route.",
        "eligibility":{"entity_types":["startup","dpiit_recognized_startup","aif","category_i_aif","category_ii_aif","rural_enterprise"],"lifecycle_stages":["early_stage","validation","commercialization","scaling","growth"],"industries":["agritech","food_processing","animal_husbandry","fisheries","supply_chain","farm_mechanisation","biotechnology","waste_management","renewable_energy","agri_value_chain","fpo_support","farm_level_technology","climate_technology","rural_enterprise"],"locations":["India"],"conditions":["Direct Scheme applicants must be early-stage startups focused on agriculture and rural development opportunities","FoF applicants must be eligible SEBI-registered Category I or Category II AIFs incorporated in India and investing in permitted equity, equity-related instruments and/or debt securities","the startup or AIF must fit the applicable AgriSURE preferred sector, instrument and investment strategy","the applicant must approach NABVENTURES as Investment Manager through the current official contact route and complete the applicable fund diligence and documentation","investment is merit-based and qualifying criteria do not guarantee sanction, contribution or investment"],"exclusions":["AgriSURE is not a universal grant, subsidy, loan window or guaranteed payment to every startup","the INR 750 crore total corpus, INR 450 crore FoF corpus and INR 300 crore Direct corpus are fund-level figures, not applicant entitlements","FoF and Direct routes must not be merged: FoF invests in AIFs while Direct invests in eligible early-stage startups","targeting approximately 85 startups is a fund objective, not a promise or quota for applicants","no intermediary may charge a fee for seeking assistance from AgriSURE; use the direct NABVENTURES contact route","investment amount, valuation, dilution, governance, repayment/debt terms, fees, milestones, exit and selection remain subject to fund documents and Investment Manager decision"],"thresholds":{"total_corpus_inr":7500000000,"fof_corpus_inr":4500000000,"direct_scheme_corpus_inr":3000000000,"fund_duration_years":10,"fund_duration_extension_years":2,"target_startups_approx":85,"fof_max_investment_per_aif_inr":250000000,"fof_max_percent_of_aif_corpus":5,"fof_aif_categories":["category_i","category_ii"],"investment_mode":"equity, equity-related instruments and/or debt securities as permitted by the applicable route and fund documents"},"unknown_handling":"needs_information"},
        "application":{"portal":"https://nabventures.in/agrisure.aspx","route":"Determine whether the applicant is a Direct Scheme startup or a FoF AIF, review the applicable official fund terms, contact NABVENTURES at agrisure@nabard.org through the official route, and complete the requested investment/contribution and diligence process.","selection":"The Investment Manager considers the merits of the case and the applicable fund documents; meeting listed criteria does not guarantee sanction, contribution or investment.","fees":"The official NABARD public notice states that no money is charged for seeking assistance from AgriSURE; verify any transaction, fund or professional fee only through the official fund documents and NABVENTURES.","applicant_note":"UdyamVeda may separate the Direct and FoF routes and prepare a diligence checklist, but it cannot promise investment, collect fees, represent NABVENTURES or submit on behalf of the startup/AIF."},
        "fine_print":{"benefit_buckets":["direct_equity_investment","fof_aif_contribution","permitted_equity_related_instrument","permitted_debt_instrument"],"fund_structure":"AgriSURE is a close-ended Category II AIF with a Direct Scheme and a Fund-of-Funds Scheme. NABVENTURES Limited, a wholly owned subsidiary of NABARD, is the Investment Manager.","corpus_separation":"The official page describes a total corpus of INR 750 crore: INR 450 crore for the FoF Scheme and INR 300 crore for the Direct Scheme. These are fund-level corpus buckets and must not be displayed as money available to an individual startup.","fof_terms":"The official page describes FoF investment into eligible Category I and Category II AIFs incorporated in India, with up to 5% of the AIF corpus or INR 25 crore in one AIF, whichever is lower, subject to the scheme and fund documents.","direct_terms":"The Direct Scheme aims to invest in early-stage startups addressing agriculture and rural-development challenges. Individual ticket, valuation, instrument, dilution, governance, milestone and exit terms are not fixed on the reviewed public page.","current_portal_state":"The official NABVENTURES page and NABARD public notice provide a current fund overview and direct contact route. Investment availability, active intake, fund capacity and applicable Private Placement Memorandum terms require current confirmation.","window_note":"Treat the route as rolling/availability-controlled rather than as a fixed grant call or guaranteed application window.","review_note":"Reconcile the current NABVENTURES page, FAQ, public notice, fund documents and latest official status for startup/AIF definitions, incorporation, sectors, preferred instruments, FoF limits, Direct Scheme terms, duration, target count, diligence, investment committee, fees, fraud warnings, application route, reporting, valuation, governance, dilution, exit and amendments before publication."},
        "benefit_summary":{"types":["equity_investment","debt_instrument"],"summary":"Separate Direct and Fund-of-Funds investment routes for agriculture/rural startups and eligible AIFs; fund corpus figures are not applicant benefits and investment is not guaranteed.","separate_value_buckets":true},
        "benefit_type":"equity_investment",
        "benefit_label":"AgriSURE Direct equity or FoF AIF contribution route - terms vary",
        "benefit_conditions":{"direct_and_fof_separate":true,"merit_based_decision":true,"fund_documents_control":true,"corpus_not_individual_entitlement":true,"no_fee_for_seeking_assistance":true},
        "requirement":"Agriculture/rural early-stage startup or eligible India-incorporated Category I/II AIF with route-specific fund diligence evidence",
        "requirement_description":"Prepare incorporation and recognition records, sector and problem statement, product/technology evidence, market and rural/agriculture impact, financial model, cap table, IP/regulatory position, customer/revenue evidence, governance information and route-specific fund documents; AIF applicants must also provide SEBI registration, corpus, mandate and investment strategy evidence.",
        "rules":{"any":[{"all":[{"field":"applicant_role","operator":"equals","value":"startup"},{"field":"direct_scheme_route_verified","operator":"equals","value":true},{"field":"agriculture_or_rural_focus_verified","operator":"equals","value":true},{"field":"early_stage_status_verified","operator":"equals","value":true}]},{"all":[{"field":"applicant_role","operator":"equals","value":"aif"},{"field":"fof_route_verified","operator":"equals","value":true},{"field":"sebi_registered_category_i_or_ii_aif","operator":"equals","value":true},{"field":"aif_incorporated_in_india","operator":"equals","value":true}]}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Choose the correct AgriSURE route","description":"Classify the applicant as a Direct Scheme startup or a Fund-of-Funds AIF. Do not combine startup investment and AIF contribution eligibility.","url":"https://nabventures.in/agrisure.aspx"},{"title":"Verify sector, stage and fund criteria","description":"Confirm agriculture/rural-development relevance, early-stage status for the Direct Scheme or SEBI Category I/II AIF status for FoF, and the current fund documents.","url":"https://www.nabard.org/pdf/agrisure-faq.pdf"},{"title":"Prepare investment or contribution diligence","description":"Assemble the technology, market, impact, financial, ownership, governance, IP, regulatory, portfolio and fund-strategy material requested by NABVENTURES.","url":"https://nabventures.in/agrisure.aspx"},{"title":"Contact NABVENTURES through the official route","description":"Use agrisure@nabard.org and the current official page route, avoid intermediaries charging money for assistance, and retain all submitted materials and fund-document references.","url":"https://www.nabard.org/auth/writereaddata/WhatsNew/aisclaimer-for-agrisure.pdf"}],
        "window_type":"rolling",
        "window_label":"Fund-manager contact route; intake, investment availability and selection are controlled by AgriSURE/NABVENTURES and are not a fixed grant-call deadline.",
        "window_evidence":{"source_url":"https://nabventures.in/agrisure.aspx","anchor":"Start-ups or AIFs desirous of seeking investment/contribution may reach out to the Investment Manager; merit-based and no-guarantee terms"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Agriculture and Farmers Welfare', 'NABARD / NABVENTURES Limited', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.88, 0.84, 'in_review')
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
      (version_id, 'https://www.nabard.org/pdf/agrisure-faq.pdf', 'faq', 'NABARD AgriSURE FAQ', 'Corpus, sponsors, Investment Manager, duration, target beneficiaries and two schemes', now(), false),
      (version_id, 'https://www.nabard.org/auth/writereaddata/WhatsNew/aisclaimer-for-agrisure.pdf', 'public_notice', 'NABARD AgriSURE public notice', 'No fee for seeking assistance and direct contact with NABVENTURES', now(), false),
      (version_id, 'https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=2051466&lang=2&reg=48', 'pib_release', 'PIB AgriSURE launch release', 'INR 750 crore blended Category II AIF, sponsors and agriculture/rural startup focus', now(), false),
      (version_id, 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'discovery_playbook', 'Startup India Government Schemes Playbook AgriSURE entry', 'AgriSURE discovery and startup-facing support route', now(), false)
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
