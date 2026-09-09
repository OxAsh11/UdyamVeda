-- Credit Guarantee Scheme for Startups (CGSS).
-- This record intentionally remains in_review until a reviewer confirms
-- current lender operation, fees, guarantee conditions and amendments.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Credit Guarantee Scheme for Startups 8 May 2025 Gazette notification', 'https://www.startupindia.gov.in/content/dam/invest-india/PGF/credit-guarantee-scheme-for-startup.pdf', 'gazette', 'central', 'monthly', 1, true, 'S.O. 2046(E), dated 8 May 2025; supersedes S.O. 4741(E) dated 6 October 2022.'),
  ('Startup India Credit Guarantee Scheme for Startups page', 'https://www.startupindia.gov.in/content/sih/en/credit-guarantee-scheme-for-startups.html', 'ministry', 'central', 'weekly', 1, true, 'Official overview for eligibility, application and guarantee cover.'),
  ('NCGTC Credit Guarantee Scheme for Startups product page', 'https://www.ncgtc.in/cgss/', 'agency', 'central', 'weekly', 1, true, 'Current official trustee page with operational-guideline, FAQ, notification and registered-MI links.'),
  ('Jan Samarth Startup business-loan route', 'https://www.jansamarth.in/business-loan-startup-scheme', 'agency', 'central', 'weekly', 1, true, 'Specific official startup application handoff linked by the current Startup India page.')
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
        "slug":"credit-guarantee-scheme-for-startups",
        "name":"Credit Guarantee Scheme for Startups",
        "type":"guarantee",
        "authority":"Department for Promotion of Industry and Internal Trade - Startup India",
        "authority_url":"https://www.startupindia.gov.in/content/sih/en/credit-guarantee-scheme-for-startups.html",
        "canonical_url":"https://www.startupindia.gov.in/content/sih/en/credit-guarantee-scheme-for-startups.html",
        "source_url":"https://www.startupindia.gov.in/content/dam/invest-india/PGF/credit-guarantee-scheme-for-startup.pdf",
        "source_kind":"gazette",
        "source_title":"Credit Guarantee Scheme for Startups 8 May 2025 Gazette notification",
        "source_anchor":"S.O. 2046(E), 8 May 2025; Chapters I-V: commencement, objective, definitions, eligible borrowers and Member Institutions",
        "summary":"Credit guarantee support for debt facilities extended to eligible DPIIT-recognized startups through eligible Member Institutions.",
        "objective":"Facilitate collateral-free debt funding for eligible startups by providing guarantee cover to eligible lending or investing institutions.",
        "eligibility":{"entity_types":["dpiit_recognized_startup","private_limited_company","llp","registered_partnership"],"lifecycle_stages":["early_revenue","growth","scaling"],"locations":["India"],"conditions":["the startup must be recognized by DPIIT as per Gazette notifications issued from time to time","the startup must not be in default to a lending or investing institution","the startup must not be classified as an NPA under applicable RBI guidance","eligibility must be certified by the Member Institution for guarantee cover"],"eligible_member_institutions":["scheduled_commercial_bank","financial_institution","rbi_registered_nbfc","sebi_registered_aif"],"member_institution_conditions":["an RBI-registered NBFC must have a rating of BBB or above from an RBI-accredited external credit rating agency","an eligible NBFC must have minimum net worth of Rs. 100 crore","a SEBI-registered AIF must be an eligible Member Institution under the current framework"],"exclusions":["the guarantee is not direct cash to the startup","the trustee does not receive a direct borrower application for guarantee cover","lender appraisal, facility sanction, fees, claims and guarantee conditions remain separate requirements"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.jansamarth.in/business-loan-startup-scheme","detail":"https://www.startupindia.gov.in/content/sih/en/credit-guarantee-scheme-for-startups.html","route":"The startup approaches an eligible Member Institution through the current Jan Samarth startup route or directly; the institution evaluates the proposal and seeks guarantee cover from NCGTC.","direct_application_to_trustee":false,"applicant_note":"UdyamVeda can prepare the lender dossier and explain the route, but cannot promise sanction, guarantee cover, or impersonate the startup."},
        "fine_print":{"maximum_debt_covered_per_borrower_inr":200000000,"coverage_models":["transaction_based","umbrella_based"],"transaction_based_coverage":{"up_to_100000000":85,"above_100000000":75},"umbrella_based_coverage":"Actual losses or up to 5 percent of pooled investment, whichever is lower, subject to the per-borrower ceiling.","instruments":["venture_debt","working_capital","subordinated_debt","mezzanine_debt","debentures","optionally_convertible_debt","fund_based_facility","non_fund_based_facility"],"member_institution_conditions":{"rbi_registered_nbfc":{"minimum_rating":"BBB","minimum_networth_inr":1000000000,"rating_source":"External credit rating agency accredited by RBI"}},"guarantee_not_direct_cash":true,"current_page_last_updated":"20 August 2026","review_note":"Current Startup India page confirms the revised Rs. 20 crore ceiling, 85%/75% transaction coverage, 5% umbrella cap and NBFC conditions. Before publication, reconcile the Gazette and NCGTC operational-guideline links, guarantee fees, lock-in, claims, current Member Institution list and amendments."},
        "benefit_summary":{"types":["guarantee"],"summary":"Guarantee cover for eligible debt facilities; the scheme does not make a direct grant or direct loan to the startup.","separate_value_buckets":true},
        "benefit_type":"guarantee",
        "benefit_label":"Transaction-based credit guarantee cover",
        "benefit_conditions":{"up_to_100000000_percent":85,"above_100000000_percent":75,"maximum_per_borrower_inr":200000000,"eligible_member_institution_required":true,"not_direct_cash":true},
        "requirement":"DPIIT recognition and eligible Member Institution route",
        "requirement_description":"Provide DPIIT recognition, lender/facility and financial information, default/NPA declarations and the evidence required by the eligible Member Institution for appraisal and guarantee-cover filing.",
        "rules":{"all":[{"field":"dpiit_recognized","operator":"equals","value":true},{"field":"lending_default","operator":"equals","value":false},{"field":"npa_classification","operator":"equals","value":false},{"field":"member_institution_certifies_eligibility","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm DPIIT and credit eligibility","description":"Verify DPIIT recognition, default/NPA status, proposed debt instrument and whether the intended lender or fund is an eligible Member Institution.","url":"https://www.startupindia.gov.in/content/sih/en/credit-guarantee-scheme-for-startups.html"},{"title":"Prepare the lender proposal","description":"Prepare the business, facility, financial and recognition documents required for Member Institution appraisal.","url":"https://www.jansamarth.in/business-loan-startup-scheme"},{"title":"Apply through Jan Samarth or a Member Institution","description":"Submit through the current official startup route or approach a Member Institution directly; the institution evaluates and sanctions the facility.","url":"https://www.jansamarth.in/business-loan-startup-scheme"},{"title":"Track guarantee-cover filing","description":"The Member Institution applies to the trustee for guarantee cover after satisfying scheme eligibility and facility conditions; retain sanction and guarantee evidence.","url":"https://www.ncgtc.in/cgss/"}],
        "window_type":"rolling",
        "window_label":"Credit guarantee support is accessed through eligible Member Institutions as facilities are evaluated and sanctioned; current operational availability requires review.",
        "window_evidence":{"source_url":"https://www.startupindia.gov.in/content/sih/en/credit-guarantee-scheme-for-startups.html","anchor":"How to Apply and current Member Institution route"}
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.90, 0.90, 'in_review')
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
    select version_id, 'https://www.startupindia.gov.in/content/sih/en/credit-guarantee-scheme-for-startups.html', 'ministry', 'Startup India Credit Guarantee Scheme for Startups page', 'Overview, eligibility, how to apply and extent of guarantee cover', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.startupindia.gov.in/content/sih/en/credit-guarantee-scheme-for-startups.html');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://www.ncgtc.in/cgss/', 'agency', 'NCGTC Credit Guarantee Scheme for Startups product page', 'Operational guidelines, FAQs, DPIIT notifications and registered Member Institution links', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.ncgtc.in/cgss/');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://www.jansamarth.in/business-loan-startup-scheme', 'agency', 'Jan Samarth Startup business-loan route', 'Startup-specific online application handoff', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.jansamarth.in/business-loan-startup-scheme');
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', item->'benefit_conditions'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = item->>'benefit_label');
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'registration', item->>'requirement', item->>'requirement_description', true
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
