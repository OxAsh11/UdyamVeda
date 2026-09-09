-- BIRAC Biotechnology Innovation Fund - AcE (Accelerating Entrepreneurs).
-- This is a fund-of-funds route. It is not a direct BIRAC grant application for
-- startups; startup access is through selected SEBI-registered AIF partners.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('BIRAC AcE Fund official page', 'https://www.birac.nic.in/aceFundNew.php', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Current BIRAC page describing the fund-of-funds model, AIF partners, biotech sectors, partner route and displayed impact context.'),
  ('BIRAC AcE Fund guidelines', 'https://www.birac.nic.in/webcontent/ace_fund_guidelines.pdf', 'scheme_guideline', 'central', 'monthly', 1, true, 'Official guideline defining the fund-of-funds structure, AIF partner selection, BIRAC commitment limits, startup investment boundary and governance.'),
  ('BIRAC AcE Fund FAQ', 'https://www.birac.nic.in/webcontent/1680262332_AcE_FAQ_revised.pdf', 'scheme_faq', 'central', 'monthly', 1, true, 'Official FAQ clarifying the INR 7 crore portfolio-entity limit, follow-on conditions, Indian ownership interpretation, nominee role and timing questions.'),
  ('BIRAC AcE Fund AIF application form', 'https://www.birac.nic.in/webcontent/1668922503_Application_form_ACE.pdf', 'scheme_form', 'central', 'monthly', 1, true, 'Official AIF-facing application form; retained to make the beneficiary boundary and required fund-manager diligence explicit.'),
  ('Startup India Government Schemes Playbook AcE entry', 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'discovery_playbook', 'central', 'monthly', 1, true, 'Official Startup India discovery entry; BIRAC sources control the operational record.')
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
        "slug":"birac-ace-fund-biotech-fund-of-funds",
        "name":"BIRAC AcE Fund (Accelerating Entrepreneurs)",
        "type":"equity_investment",
        "lifecycle_status":"paused",
        "authority":"Biotechnology Industry Research Assistance Council (BIRAC)",
        "authority_url":"https://birac.nic.in/",
        "canonical_url":"https://www.birac.nic.in/aceFundNew.php",
        "source_url":"https://www.birac.nic.in/webcontent/ace_fund_guidelines.pdf",
        "source_kind":"official_scheme_guideline",
        "source_title":"BIRAC AcE Fund guidelines",
        "source_anchor":"Pages 1-4: scope, fund-of-funds framework, AIF partner criteria, commitment limits, startup investment boundary, governance and reporting",
        "summary":"A BIRAC fund-of-funds route that invests in selected SEBI-registered Category I or II AIFs, which then invest in biotech and life-science startups and SMEs at early or growth stages.",
        "objective":"Fill the product-development and growth-capital gap for biotech enterprises by catalysing private capital through professionally managed daughter funds.",
        "legal_basis":"BIRAC AcE Fund guideline promoted by the Department of Biotechnology through BIRAC; the current BIRAC page, guideline, FAQ, contribution agreement and any later amendment control the live terms.",
        "eligibility":{"entity_types":["startup","small_and_medium_enterprise","biotechnology_startup","life_science_startup","biotech_portfolio_company"],"lifecycle_stages":["early_stage","pre_series_a","series_a","growth"],"industries":["biotechnology","healthcare","life_sciences","pharma","biopharma","medtech","diagnostics","industrial_biotechnology","agri_technology","bio_it_services"],"locations":["India"],"conditions":["the startup must be sourced and selected by an AcE Fund Partner or daughter AIF; BIRAC does not directly select individual startup applicants through this route","the startup should have biotech or life-science fit and growth potential, with the daughter funds targeting early or growth-stage businesses that may be ready for pre-Series-A or Series-A funding","the selected fund must apply its own investment, diligence, securities, valuation and portfolio-company process","the portfolio investment must count toward the partner's obligation to invest at least twice BIRAC's commitment in biotech or life-science startups over the daughter-fund term","Indian ownership and any applicable contribution-agreement conditions must be verified before matching; the official FAQ explains the 51% as-converted Indian ownership requirement in the contribution terms"],"exclusions":["an individual or ordinary business cannot apply to BIRAC as though AcE were a direct grant or loan","BIRAC's maximum commitment to a daughter fund is not the startup's guaranteed investment amount","the partner's 2x investment commitment is a fund-level obligation, not an entitlement for every matched startup","investment is equity or equity-linked through the AIF and depends on private-fund selection, diligence, valuation, dilution and investment committee approval","do not merge BIRAC's fund commitment, partner corpus and startup investment ceiling into one eligible-value figure","a static partner list or historical supported-startup list does not establish an open current intake"],"thresholds":{"birac_max_commitment_per_daughter_fund_inr":300000000,"birac_max_commitment_percent_of_daughter_fund_corpus":30,"maximum_countable_investment_per_biotech_portfolio_entity_inr":70000000,"partner_minimum_biotech_life_science_investment_multiple":2,"follow_on_countable_limit_inr":35000000,"follow_on_max_share_of_total_biotech_commitment_percent":25,"indian_ownership_requirement_percent":51,"partner_experience_years_in_preceding_five_years":3},"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.birac.nic.in/aceFundNew.php","route":"Review the current AcE Fund Partner list, identify a relevant SEBI-registered AIF, confirm that the fund is currently sourcing investments in the startup's sector and stage, and apply through that fund's own intake. The official BIRAC application form is for AIFs requesting contribution under AcE, not for individual startups.","selection":"BIRAC selects or commits to daughter funds through an application and evaluation process. The daughter AIF and its investment committee select portfolio companies; BIRAC may nominate a representative or observer under the governing agreements.","fees":"No universal startup application fee was identified in the reviewed official sources. Confirm any fund-specific diligence, legal, advisory or transaction costs directly with the AIF before proceeding.","documents":["certificate of incorporation and constitutional documents","founder, ownership and as-converted cap-table evidence","biotech or life-science technology and sector-fit dossier","product, R&D, proof-of-concept, validation and regulatory-readiness materials","market, commercialization and growth plan","financial statements, runway, cap table and use-of-funds plan","IP ownership, licences, freedom-to-operate and technology-transfer information","data room materials and diligence responses requested by the AIF","milestone, reporting and portfolio-company documents requested under the investment agreement","documents evidencing any applicable Indian ownership and contribution-agreement condition"],"applicant_note":"UdyamVeda can explain the AcE structure, match the business to partner-fund criteria, prepare a diligence checklist and hand off to the official AIF route. It cannot submit to BIRAC or the AIF on behalf of the applicant, promise investment, or represent the BIRAC commitment as a startup grant."},
        "fine_print":{"support_model":"AcE is a fund of funds. BIRAC invests in selected SEBI-registered Category I or II AIFs; those daughter funds invest in selected biotech startups and SMEs and take commensurate securities.","benefit_boundary":"The guideline permits BIRAC to commit up to INR 30 crore or 30% of each daughter-fund corpus, while assistance to an individual startup is described as up to INR 7 crore against equity held by the partner. These are separate fund-level and portfolio-level boundaries, not a guaranteed startup entitlement.","multiplier_boundary":"Each AcE partner must commit to invest at least twice BIRAC's committed amount into biotech or life-science startups over the daughter-fund term. This is a partner obligation and must not be presented as a guaranteed amount available to one applicant.","follow_on_boundary":"The official FAQ permits a second-round follow-on contribution of up to INR 3.5 crore in the same company, capped at 25% of the total amount committed for the 2x computation and requiring an external VC in that follow-on round. This is a counting rule, not an assured follow-on benefit.","selection_boundary":"BIRAC's guidelines describe selection of daughter funds through detailed application and evaluation. Startup selection is made by the partner AIF under its own diligence and investment process; the BIRAC AIF application form expressly says receipt does not bind BIRAC to sanction assistance.","governance_boundary":"BIRAC may nominate a representative to the partner advisory or investment governance structure. Partners submit half-yearly implementation information and operate under contribution and investment-management agreements.","current_state":"The current BIRAC page lists AcE Fund Partners and says startups can avail the route through those partners. No universal current startup call, single startup application window or guaranteed ticket was verified; keep the record paused until partner-level intake is confirmed.","review_note":"Before publication, verify current partner status, partner-specific sector and stage fit, fund availability, current intake, Indian ownership conditions, instrument, valuation, dilution, external-VC/follow-on terms, application route, amendments, governance, reporting and grievance path."},
        "benefit_summary":{"types":["equity_investment","venture_capital_access","fund_of_funds","private_fund_referral"],"summary":"Selected biotech or life-science startups may receive equity investment from an AcE Fund Partner daughter AIF, with an official guideline boundary of up to INR 7 crore per startup against partner-held equity; the route is indirect, competitive and not a guaranteed grant or entitlement.","separate_value_buckets":true},
        "benefit_type":"equity_investment",
        "benefit_label":"Up to INR 7 crore equity investment per selected biotech portfolio entity through an AcE Fund Partner AIF",
        "benefit_conditions":{"aif_partner_required":true,"partner_selection_required":true,"investment_committee_approval_required":true,"equity_or_equity_linked_instrument":true,"not_guaranteed":true,"grant_not_cash_entitlement":true,"fund_level_commitment_separate":true},
        "requirement":"Biotech or life-science startup or SME with a growth-capital case, partner-AIF fit, diligence-ready evidence and a current AcE Fund Partner route",
        "requirement_description":"Prepare company, ownership, technology, IP, product, validation, market, financial, regulatory, cap-table and investment materials for the selected AIF's own diligence and investment process.",
        "rules":{"all":[{"field":"biotech_or_life_science_fit_verified","operator":"equals","value":true},{"field":"early_or_growth_stage_fit_verified","operator":"equals","value":true},{"field":"current_ace_partner_route_verified","operator":"equals","value":true},{"field":"aif_diligence_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm biotech or life-science fit","description":"Map the product, technology, R&D, validation and market thesis to the AcE sectors and early/growth-stage purpose.","url":"https://www.birac.nic.in/aceFundNew.php"},{"title":"Separate fund-level and startup-level economics","description":"Understand BIRAC's daughter-fund commitment, the partner's 2x obligation and the up-to-INR 7 crore portfolio-entity boundary as separate, non-guaranteed values.","url":"https://www.birac.nic.in/webcontent/ace_fund_guidelines.pdf"},{"title":"Find a current AcE Fund Partner route","description":"Use the official partner list, then confirm the AIF is currently sourcing investments matching the startup's sector, stage, geography and ticket needs.","url":"https://www.birac.nic.in/aceFundNew.php"},{"title":"Prepare the AIF diligence pack","description":"Compile company, ownership, IP, technology, validation, market, regulatory, financial, cap-table and use-of-funds evidence requested by the partner AIF.","url":"https://www.birac.nic.in/webcontent/1668922503_Application_form_ACE.pdf"},{"title":"Review investment terms before acceptance","description":"Assess valuation, dilution, instrument, milestones, governance, reporting, exit, follow-on and any fund-specific costs with the AIF before signing.","url":"https://www.birac.nic.in/webcontent/1680262332_AcE_FAQ_revised.pdf"}],
        "window_type":"partner_intake",
        "window_label":"The AcE Fund and partner list are evidenced, but no universal current startup application window or deadline was verified; keep paused until a relevant AcE Fund Partner confirms active intake.",
        "window_evidence":{"source_url":"https://www.birac.nic.in/aceFundNew.php","anchor":"Current page states that startups can avail AcE through listed partners; it does not state a universal startup call or deadline"}
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
      (version_id, 'https://www.birac.nic.in/aceFundNew.php', 'implementing_agency_portal', 'BIRAC AcE Fund official page', 'Current fund-of-funds model, sectors, partner route and displayed impact context', now(), false),
      (version_id, 'https://www.birac.nic.in/webcontent/1680262332_AcE_FAQ_revised.pdf', 'scheme_faq', 'BIRAC AcE Fund FAQ', 'INR 7 crore portfolio limit, follow-on rule, Indian ownership, nominee and timing clarifications', now(), false),
      (version_id, 'https://www.birac.nic.in/webcontent/1668922503_Application_form_ACE.pdf', 'scheme_form', 'BIRAC AcE Fund AIF application form', 'AIF-only application route and fund-manager diligence requirements', now(), false),
      (version_id, 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'discovery_playbook', 'Startup India Government Schemes Playbook AcE entry', 'AcE listed under growth/scaling schemes; discovery only', now(), false)
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
