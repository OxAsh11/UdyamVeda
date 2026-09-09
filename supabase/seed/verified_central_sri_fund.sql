-- Self-Reliant India (SRI) Fund.
-- SRI is a Category-II fund-of-funds route: government capital is committed
-- through NVCFL/daughter funds and is not a direct founder grant or loan.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('NVCFL SRI Fund home', 'https://www.nvcfl.co.in/', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Official NVCFL portal describing SRI objectives, current notifications, beneficiary boundary and contact route.'),
  ('NVCFL SRI Fund scheme details and guidelines', 'https://www.nvcfl.co.in/Scheme', 'scheme_guideline', 'central', 'monthly', 1, true, 'Official NVCFL scheme page describing the Category-II mother fund, daughter-fund structure, MSME eligibility, exclusions and investment process.'),
  ('NVCFL daughter-fund interest route', 'https://www.nvcfl.co.in/Home/InterestAsDaughterFund', 'application_portal', 'central', 'weekly', 1, true, 'Official NVCFL route for prospective daughter-fund empanelment; it is not a direct MSME application.'),
  ('NVCFL empanelled daughter funds', 'https://www.nvcfl.co.in/Corporate/EmpanelledDaughterFunds', 'fund_directory', 'central', 'weekly', 1, true, 'Official NVCFL directory used to identify current daughter funds; fund availability and mandate still require review.'),
  ('Ministry of MSME Annual Report 2025-26 SRI Fund', 'https://msme.gov.in/sites/default/files/MSMEANNUALREPORT2025-26ENGLISH_0.pdf', 'annual_report', 'central', 'monthly', 1, true, 'Official Ministry annual report describing SRI objectives and the government-backed equity fund-of-funds structure.'),
  ('Ministry of MSME Annual Report 2024-25 SRI Fund status', 'https://msme.gov.in/sites/default/files/MSME-ANNUAL-REPORT-2024-25-ENGLISH.pdf', 'annual_report', 'central', 'monthly', 1, true, 'Official Ministry annual report with the latest captured programme-status figures and NVCFL implementation history.'),
  ('Startup India Government Schemes Playbook SRI Fund entry', 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'discovery_playbook', 'central', 'monthly', 1, true, 'Official Startup India discovery entry; used for cross-checking startup/MSME relevance, not as the sole publication authority.')
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
        "slug":"self-reliant-india-sri-fund-msme-growth-capital",
        "name":"Self-Reliant India (SRI) Fund",
        "type":"equity_investment",
        "lifecycle_status":"paused",
        "authority":"Ministry of Micro, Small and Medium Enterprises - SRI Fund / NVCFL",
        "authority_url":"https://www.nvcfl.co.in/",
        "canonical_url":"https://www.nvcfl.co.in/Scheme",
        "source_url":"https://www.nvcfl.co.in/Scheme",
        "source_kind":"official_nvcfl_scheme_guideline",
        "source_title":"Guidelines for Self-Reliant India (SRI) Fund",
        "source_anchor":"Introduction, Objectives, SRI Fund Structure, Investment Process and eligibility/exclusion conditions",
        "summary":"A Ministry of MSME-backed Category-II fund-of-funds route that provides growth capital to eligible MSMEs indirectly through empanelled daughter funds using equity or permitted quasi-equity instruments.",
        "objective":"Address MSME growth-capital constraints, support faster growth and corporatisation, help viable enterprises become national or international champions, and support self-reliant technologies, goods and services.",
        "legal_basis":"Official Ministry of MSME SRI Fund materials, NVCFL scheme guidelines, the AatmaNirbhar Bharat announcement, the SRI contribution arrangement and applicable SEBI Alternative Investment Fund requirements; current fund documents and NVCFL decisions control investment terms.",
        "eligibility":{"entity_types":["msme","startup_msme","private_company","public_company"],"lifecycle_stages":["growth","scaling","expansion"],"industries":["manufacturing","services","technology","self_reliant_technology","goods","supply_chain"],"locations":["India"],"conditions":["the enterprise must be an MSME as defined under the MSMED Act, as amended from time to time","the enterprise should be viable or have high-growth potential and fit the applicable daughter-fund mandate","the enterprise must be evaluated through an empanelled daughter fund; SRI is not a direct founder application or guaranteed entitlement","the enterprise must satisfy the applicable investment strategy, diligence, governance and documentation requirements","the proposed investment must fit the applicable Private Placement Memorandum, SEBI requirements and current fund terms"],"exclusions":["SRI is not a universal grant, subsidy, interest subvention or government loan","non-profit institutions, NBFCs, financial-inclusion entities, micro-credit entities, SHGs and other financial intermediaries are excluded under the published scheme page","the INR 10,000 crore government provision and approximately INR 50,000 crore leveraged structure are fund-level figures, not an applicant ticket","NVCFL empanels daughter funds; it does not promise investment to every MSME","investment amount, valuation, dilution, governance, exit, milestones, fees, reporting and selection remain daughter-fund and fund-document controlled"],"thresholds":{"government_provision_inr":100000000000,"target_leveraged_fund_size_inr":500000000000,"leverage_ratio":"4:1 daughter-fund mobilisation to SRI commitment, subject to current fund documents","mother_fund_category":"category_ii_aif","daughter_fund_categories":["category_i","category_ii"],"msme_definition":"MSMED Act as amended from time to time","enterprise_ticket":"varies by daughter fund and investment case"},"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.nvcfl.co.in/","route":"An MSME should review the current NVCFL scheme guidance and approach an empanelled daughter fund whose mandate fits the enterprise. The NVCFL interest route is for prospective daughter-fund empanelment, not a direct MSME investment application.","daughter_fund_route":"Identify an empanelled daughter fund, submit the enterprise pitch and diligence materials to that fund, and complete its investment process.","fund_route":"Prospective daughter funds use the official NVCFL interest/empanelment route and current guidelines.","daughter_fund_portal":"https://www.nvcfl.co.in/Home/InterestAsDaughterFund","direct_msmE_application":false,"selection":"NVCFL and the relevant daughter fund assess eligibility, mandate fit, diligence and investment case; meeting baseline conditions does not guarantee investment.","fees":"No applicant fee or investment term should be inferred from the public scheme overview; verify all fund, professional and transaction costs in the applicable fund documents.","applicant_note":"UdyamVeda may prepare MSME readiness and investor-diligence checklists, but cannot promise SRI investment, collect fees, represent NVCFL or submit for the enterprise."},
        "fine_print":{"fund_structure":"Government of India is the anchor investor in the SRI mother fund, a Category-II AIF. Empanelled Category-I/II daughter funds provide onward growth capital to MSMEs.","benefit_route":"The direct enterprise-facing benefit is an investment decision by a daughter fund, not a direct government disbursement.","corpus_separation":"The published structure describes a government provision of INR 10,000 crore intended to leverage approximately INR 50,000 crore through private participation. These are programme/fund-level figures and must not be displayed as applicant eligibility value.","instrument_boundary":"Growth capital may be equity or quasi-equity as permitted by the applicable SEBI rules, Private Placement Memorandum and term sheet.","current_status":"The NVCFL portal contains current notifications and an interest route, but current daughter-fund availability, enterprise intake, ticket sizes and fund capacity require live confirmation.","window_note":"Treat the MSME route as mandate- and availability-controlled rather than a fixed grant call deadline.","review_note":"Reconcile the current NVCFL guidelines, latest amendments, empanelled daughter-fund list, current MSME definition, investment process, PPM, application/interest route, exclusions, fees, valuation, dilution, governance, reporting and status evidence before publication."},
        "benefit_summary":{"types":["equity_investment","quasi_equity"],"summary":"Indirect growth-capital access for eligible MSMEs through empanelled daughter funds; programme corpus figures are not individual applicant benefits and investment is not guaranteed.","separate_value_buckets":true},
        "benefit_type":"equity_investment",
        "benefit_label":"Indirect MSME growth capital through empanelled daughter funds - terms vary",
        "benefit_conditions":{"indirect_route":true,"daughter_fund_selection":true,"not_direct_cash_grant":true,"not_individual_entitlement":true,"investment_not_guaranteed":true},
        "requirement":"MSME status, viable/high-growth case and daughter-fund mandate fit",
        "requirement_description":"Prepare current MSME classification/Udyam evidence, incorporation and ownership records, business plan, financial statements, cap table, use of funds, growth and employment case, technology or self-reliance relevance, governance, IP/regulatory position and the diligence material requested by the selected daughter fund.",
        "rules":{"all":[{"field":"msme_status_verified","operator":"equals","value":true},{"field":"viable_or_high_growth_case_verified","operator":"equals","value":true},{"field":"empanelled_daughter_fund_mandate_fit_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm MSME status and route","description":"Verify that the enterprise is an MSME under the current MSMED Act definition and understand that SRI access is indirect through a daughter fund.","url":"https://www.nvcfl.co.in/Scheme"},{"title":"Review the current daughter-fund landscape","description":"Check the current NVCFL empanelled-fund information and identify a daughter fund whose sector, stage, geography and ticket mandate fit the enterprise.","url":"https://www.nvcfl.co.in/Corporate/EmpanelledDaughterFunds"},{"title":"Prepare growth-capital diligence","description":"Assemble financial, ownership, governance, market, technology, employment, regulatory, IP and use-of-funds evidence requested by the selected daughter fund.","url":"https://www.nvcfl.co.in/Scheme"},{"title":"Approach the selected daughter fund","description":"Submit directly to the relevant daughter fund. Do not use the NVCFL daughter-fund interest form as if it were an MSME investment application.","url":"https://www.nvcfl.co.in/"}],
        "window_type":"rolling",
        "window_label":"Mandate- and availability-controlled daughter-fund route; current intake, fund capacity and investment windows require confirmation with NVCFL or the selected daughter fund.",
        "window_evidence":{"source_url":"https://www.nvcfl.co.in/","anchor":"Recent Notifications, current SRI Fund portal and Show Your Interest route"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Micro, Small and Medium Enterprises', 'NSIC Venture Capital Fund Limited (NVCFL)', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.88, 0.83, 'in_review')
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
      (version_id, 'https://www.nvcfl.co.in/', 'implementing_agency_portal', 'NVCFL SRI Fund home', 'Objectives, Recent Notifications, current portal and contact route', now(), false),
      (version_id, 'https://www.nvcfl.co.in/Home/InterestAsDaughterFund', 'application_portal', 'NVCFL daughter-fund interest route', 'Prospective daughter-fund empanelment route; not a direct MSME application', now(), false),
      (version_id, 'https://msme.gov.in/sites/default/files/MSMEANNUALREPORT2025-26ENGLISH_0.pdf', 'annual_report', 'Ministry of MSME Annual Report 2025-26 SRI Fund', 'Section 1.10.2: objective and government-backed equity fund-of-funds structure', now(), false),
      (version_id, 'https://msme.gov.in/sites/default/files/MSME-ANNUAL-REPORT-2024-25-ENGLISH.pdf', 'annual_report', 'Ministry of MSME Annual Report 2024-25 SRI Fund status', 'Special Measures under Aatmanirbhar Bharat: SRI Fund and NVCFL implementation status', now(), false),
      (version_id, 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'discovery_playbook', 'Startup India Government Schemes Playbook SRI Fund entry', 'Page 11 index and SRI Fund entry: indirect route for viable MSMEs and startup MSMEs', now(), false)
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
