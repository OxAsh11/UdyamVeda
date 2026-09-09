-- Antariksh Venture Capital Fund (AVCF) is an equity-investment route, not a
-- grant, subsidy or loan. The fund-manager page is the primary operational
-- source; Department of Space/PIB releases provide institutional and status
-- context. Keep the record review-gated because fund documents, diligence,
-- investment terms and availability are not an entitlement to every startup.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('SIDBI Venture Capital Antariksh Venture Capital Fund page', 'https://www.sidbiventure.co.in/antariksh_venture_capital_fund.html', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Official SIDBI Venture Capital Limited fund-manager page describing AVCF registration, sponsor, investment manager, space-sector scope, TRL 4+ criterion, investment instruments and contact/application route.'),
  ('Department of Space PIB Antariksh Venture Fund operationalisation release', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2247865&lang=1&reg=1', 'pib_release', 'central', 'monthly', 1, true, 'Official Department of Space/PIB release on SEBI registration, initial close, committed corpus, institutional mechanisms and investment-cycle status.'),
  ('Department of Space PIB Antariksh Venture Capital Fund current status reply', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2294772&lang=1&reg=3', 'pib_release', 'central', 'weekly', 1, true, 'Official Department of Space/PIB parliamentary reply confirming operation, contributions as of 24 July 2026, selected startups and the investment objective/strategy.'),
  ('Startup India Government Schemes Playbook Antariksh VCF entry', 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'discovery_playbook', 'central', 'monthly', 1, true, 'Official Startup India discovery entry used to cross-check TRL 4+, equity instruments and the SIDBI Venture Capital application route; it is not the sole publication authority.')
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
        "slug":"antariksh-venture-capital-fund",
        "name":"Antariksh Venture Capital Fund (AVCF)",
        "type":"equity_investment",
        "lifecycle_status":"paused",
        "authority":"Indian National Space Promotion and Authorisation Centre (IN-SPACe)",
        "authority_url":"https://www.inspace.gov.in/",
        "canonical_url":"https://www.sidbiventure.co.in/antariksh_venture_capital_fund.html",
        "source_url":"https://www.sidbiventure.co.in/antariksh_venture_capital_fund.html",
        "source_kind":"official_fund_manager_portal",
        "source_title":"Antariksh Venture Capital Fund",
        "source_anchor":"Fund overview, SEBI Category II AIF registration, fund manager, key investment criteria, mode of investment and contact/application route",
        "summary":"A SEBI-registered Category II Alternative Investment Fund managed by SIDBI Venture Capital Limited and anchored by IN-SPACe to invest in unlisted Indian space companies.",
        "objective":"Provide equity capital to Indian space-sector companies at different stages of development and support technology development, commercialization and operational scale-up.",
        "legal_basis":"The AVCF fund documents and applicable SEBI Alternative Investment Fund Regulations, including the investment objective, strategy, Private Placement Memorandum and other fund documents; Department of Space/PIB releases provide official institutional-status context.",
        "eligibility":{"entity_types":["indian_company","startup","space_sector_company","unlisted_company"],"lifecycle_stages":["technology_development","validation","commercialization","scaling","market_entry","expansion"],"industries":["space_technology","satellite","launch_vehicle","earth_observation","navigation","communications","space_data","aerospace"],"locations":["India"],"conditions":["the applicant must be an Indian company operating in the space sector","the fund-manager page states a Technology Readiness Level of 4 or above as a key investment criterion","the company must satisfy the fund's investment strategy, due-diligence, valuation, governance and exit requirements","the investment is negotiated with the fund and is subject to the Private Placement Memorandum, fund documents and applicable SEBI AIF regulations","the applicant must use the fund manager's current application/contact route and provide the requested diligence information"],"exclusions":["AVCF is not a universal grant, subsidy, loan or guaranteed government payment","the committed corpus is not an amount available to an individual company","the TRL 4+ criterion does not by itself guarantee selection or a ticket size","fund-level investment restrictions, portfolio construction, valuation, governance, dilution, exit and other terms require the current fund documents and negotiated diligence","a Startup India Playbook entry or PIB status release does not replace the fund manager's current application and investment process","the fund manager may require a company to be unlisted and may apply additional sector, financial, legal and commercial conditions"],"thresholds":{"technology_readiness_level_min":4,"fund_committed_corpus_inr":"10050000000_initial_close_context_only","company_ticket_inr":"varies_by_diligence_and_fund_documents","investment_instrument":"privately negotiated equity, convertible instruments and/or other permissible instruments","selection":"not automatic; fund screening, investment committee and diligence required"},"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.sidbiventure.co.in/antariksh_venture_capital_fund.html","route":"Review the current AVCF fund-manager page, use its contact/application form route, submit the company and space-technology dossier, and complete the fund's screening, due-diligence, valuation, investment-committee and documentation process.","selection":"Selection is discretionary and subject to the fund's investment objective/strategy, fund documents, screening and investment committees, third-party diligence, applicable SEBI AIF requirements and negotiated terms.","fees":"No application fee is established by the reviewed official sources; verify with SIDBI Venture Capital Limited before submitting.","applicant_note":"UdyamVeda may explain the equity-investment route and prepare a diligence checklist, but it cannot promise investment, represent the fund or submit on behalf of the company."},
        "fine_print":{"benefit_buckets":["negotiated_equity_investment","convertible_instrument_investment","other_permissible_fund_instrument"],"fund_structure":"AVCF is a SEBI-registered Category II AIF; SIDBI Venture Capital Limited is the fund manager/sponsor and IN-SPACe is the key investor/anchor described by the official sources.","corpus_note":"The April 2026 Department of Space/PIB release reports an initial close with a committed corpus of INR 1,005 crore. This is fund-level capital and must never be shown as an applicant benefit or individual ticket.","investment_terms":"The fund-manager page states privately negotiated equity, convertible instruments and/or other permissible instruments in unlisted Indian space companies; ticket size, valuation, dilution, governance, milestones, reporting and exit terms are not fixed entitlements in the reviewed public page.","current_portal_state":"The fund-manager page provides a current fund overview and application/contact route. The August 2026 Department of Space/PIB reply states that the fund is in operation and that its Investment Committee has selected three startups; current diligence availability and portfolio capacity must still be verified before recommendation.","window_note":"Treat the route as rolling/availability-controlled rather than as a fixed grant call. Confirm that the fund is accepting preliminary applications and that the current application form and fund documents are operative.","review_note":"Reconcile the current fund-manager page, latest PIB status, Private Placement Memorandum and other fund documents for company incorporation/Indian ownership, unlisted status, TRL evidence, sector scope, financial condition, application form, diligence pack, screening, committee process, ticket size, instruments, valuation, governance, dilution, fees, confidentiality, reporting, exit and any amended terms before publication."},
        "benefit_summary":{"types":["equity_investment"],"summary":"Negotiated equity or permitted instrument investment for eligible Indian space-sector companies; selection, ticket size and terms are fund-determined and the fund corpus is not an individual entitlement.","separate_value_buckets":true},
        "benefit_type":"equity_investment",
        "benefit_label":"Negotiated AVCF equity or permitted instrument investment - ticket varies",
        "benefit_conditions":{"trl_min":4,"unlisted_indian_space_company_required":true,"fund_diligence_required":true,"investment_committee_decision_required":true,"not_a_grant_or_subsidy":true,"corpus_not_individual_entitlement":true},
        "requirement":"Indian unlisted space-sector company with TRL 4+ evidence and a fund-ready diligence package",
        "requirement_description":"Prepare incorporation and ownership records, space-sector and TRL evidence, product/technology dossier, market and commercialisation plan, financial model, cap table, IP and regulatory position, customer/revenue evidence where available, governance information and the current fund-manager application/diligence documents.",
        "rules":{"all":[{"field":"indian_company_verified","operator":"equals","value":true},{"field":"space_sector_activity_verified","operator":"equals","value":true},{"field":"unlisted_status_verified","operator":"equals","value":true},{"field":"technology_readiness_level","operator":"greater_than_or_equal","value":4},{"field":"current_avcf_route_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Verify the current AVCF route and fund availability","description":"Check the official SIDBI Venture Capital page and confirm that the current application/contact route and fund documents are operative before treating AVCF as actionable.","url":"https://www.sidbiventure.co.in/antariksh_venture_capital_fund.html"},{"title":"Confirm the company and space-sector criteria","description":"Verify Indian company status, unlisted status, core space-sector activity and TRL 4+ evidence; do not infer eligibility from a generic technology label.","url":"https://www.sidbiventure.co.in/antariksh_venture_capital_fund.html"},{"title":"Prepare the investment and diligence dossier","description":"Assemble the technology, TRL, market, financial, ownership, IP, regulatory, governance, customer and commercialisation evidence requested by the fund manager.","url":"https://www.pib.gov.in/PressReleasePage.aspx?PRID=2247865&lang=1&reg=1"},{"title":"Submit through the fund manager and track diligence","description":"Use the SIDBI Venture Capital contact/application route, retain all submitted materials, and track screening, diligence, committee decisions, negotiated terms and definitive investment documents.","url":"https://www.sidbiventure.co.in/antariksh_venture_capital_fund.html"}],
        "window_type":"rolling",
        "window_label":"Fund-manager application/contact route; investment availability, diligence and selection are controlled by AVCF and are not a fixed grant-call deadline.",
        "window_evidence":{"source_url":"https://www.sidbiventure.co.in/antariksh_venture_capital_fund.html","anchor":"Contact us and application form; key investment criteria and mode of investment"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Department of Space', 'Indian National Space Promotion and Authorisation Centre', item->>'authority_url'
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
      (version_id, 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2247865&lang=1&reg=1', 'pib_release', 'Department of Space PIB Antariksh Venture Fund operationalisation release', 'SEBI registration, initial close, committed corpus, fund manager and institutional mechanisms', now(), false),
      (version_id, 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2294772&lang=1&reg=3', 'pib_release', 'Department of Space PIB Antariksh Venture Capital Fund current status reply', 'Fund in operation, contributions as of 24 July 2026, selected startups and investment objective/strategy', now(), false),
      (version_id, 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'discovery_playbook', 'Startup India Government Schemes Playbook Antariksh VCF entry', 'Page 77: TRL 4+, equity instruments and SIDBI Venture Capital application route', now(), false)
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
