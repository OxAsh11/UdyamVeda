-- First evidence-backed seed batch.
-- Records remain in_review until a human reviewer confirms every field and
-- current application-window status.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Udyam current new-enterprise registration form', 'https://udyamregistration.gov.in/UdyamRegistration.aspx/', 'agency', 'central', 'monthly', 1, true, 'Current official form for Aadhaar role, PAN/GST fields, organisation type and applicant consent.'),
  ('Udyam official application form PDF', 'https://udyamregistration.gov.in/docs/UdyamApplication.pdf', 'agency', 'central', 'monthly', 1, true, 'Official application-form structure and identity/data-consent evidence.'),
  ('MSME Annual Report 2025-26 classification section', 'https://msme.gov.in/sites/default/files/MSMEANNUALREPORT2025-26ENGLISH_0.pdf', 'ministry', 'central', 'monthly', 1, true, 'Ministry publication recording the revised MSME classification criteria effective 2025-04-01.')
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
        "slug":"udyam-registration",
        "name":"Udyam Registration",
        "type":"registration",
        "authority":"Office of the Development Commissioner (MSME)",
        "authority_url":"https://udyamregistration.gov.in/",
        "canonical_url":"https://udyamregistration.gov.in/",
        "source_url":"https://udyamregistration.gov.in/default.aspx/UdyamRegistrationExist.aspx",
        "source_kind":"agency",
        "source_title":"Udyam Registration official portal",
        "source_anchor":"Current portal guidance: free, paperless and self-declaration; current MSME classification thresholds and identity fields",
        "summary":"Free, paperless, online MSME registration based on self-declaration.",
        "objective":"Classify an enterprise as a micro, small, or medium enterprise and issue a permanent registration number and online certificate.",
        "legal_basis":"MSME Development Act, 2006 and current Udyam Registration rules and official operating guidance.",
        "eligibility":{"entity_types":["enterprise"],"locations":["India"],"conditions":["PAN and GSTIN are required where applicable","Aadhaar is required; the applicable proprietor, managing partner, karta or authorised signatory must provide it","one enterprise must not file more than one Udyam Registration; multiple activities may be specified in one registration"],"classification_thresholds":{"effective_from":"2025-04-01","micro":{"investment_inr_max":25000000,"turnover_inr_max":100000000},"small":{"investment_inr_max":250000000,"turnover_inr_max":1000000000},"medium":{"investment_inr_max":1250000000,"turnover_inr_max":5000000000}},"unknown_handling":"needs_information"},
        "application":{"portal":"https://udyamregistration.gov.in/","mode":"online","fees":"free","route":"Use the official portal and complete the self-declaration registration with the applicant's own identity and contact details.","identity_requirements":{"sole_proprietorship":"proprietor Aadhaar","partnership":"managing partner Aadhaar","huf":"karta Aadhaar","company_llp_cooperative_society_trust":"organisation or authorised signatory Aadhaar plus PAN and GSTIN where applicable"},"applicant_note":"The enterprise or authorised representative must use its own identity, mobile number, email, OTPs and declarations; UdyamVeda may guide but may not impersonate the applicant."},
        "fine_print":{"renewal":"not_required","documents_uploaded":false,"certificate":"online with dynamic QR code","classification_basis":"investment in plant and machinery or equipment and turnover, using the current portal's linked government data where applicable","warning":"No private intermediary is authorized to charge a registration fee","review_note":"The current portal was checked for the updated thresholds, identity fields, no-upload/no-renewal terms and official fee disclaimer. Before publication, confirm the live workflow, update/cancellation routes and any subsequent MSME notification."},
        "benefit_summary":{"types":["recognition","market_access"],"amounts":[],"summary":"MSME recognition and access to linked government services; no direct cash benefit is asserted here.","separate_value_buckets":true},
        "benefit_type":"recognition",
        "benefit_label":"Udyam enterprise registration and certificate",
        "benefit_conditions":{"direct_cash_benefit":false,"online_certificate":true,"linked_support_has_separate_rules":true},
        "requirement":"Aadhaar and applicable PAN/GST-linked details",
        "requirement_description":"Provide the identity and enterprise details required by the official registration flow, including PAN and GST-linked information where applicable.",
        "rules":{"all":[{"field":"entity_type","operator":"exists"},{"field":"country","operator":"equals","value":"India"}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Open the official Udyam portal","description":"Use the Government of India portal only.","url":"https://udyamregistration.gov.in/"},{"title":"Complete the self-declaration registration","description":"Provide identity, enterprise, activity and applicable tax details using the applicant's own contact details and OTPs.","url":"https://udyamregistration.gov.in/"},{"title":"Download and retain the certificate","description":"Retain the online Udyam certificate and registration number; linked schemes have separate eligibility rules.","url":"https://udyamregistration.gov.in/"}],
        "window_type":"rolling",
        "window_label":"Portal registration is available online; reviewer confirmation of current operation is required.",
        "window_evidence":{"source_url":"https://udyamregistration.gov.in/default.aspx/UdyamRegistrationExist.aspx","anchor":"New Registration; free, paperless and self-declaration guidance"}
      },
      {
        "slug":"startup-india-seed-fund-scheme",
        "name":"Startup India Seed Fund Scheme",
        "type":"grant",
        "authority":"Department for Promotion of Industry and Internal Trade (DPIIT)",
        "authority_url":"https://dpiit.gov.in/",
        "canonical_url":"https://seedfund.startupindia.gov.in/",
        "source_url":"https://seedfund.startupindia.gov.in/faq",
        "source_kind":"agency",
        "source_title":"SISFS official FAQ",
        "source_anchor":"Eligibility, funding limits, terms and conditions",
        "summary":"Financial assistance for proof of concept, prototype development, product trials, market entry and commercialisation.",
        "objective":"Provide early-stage financial support to eligible DPIIT-recognised startups through eligible incubators.",
        "legal_basis":"DPIIT Startup India Seed Fund Scheme guidelines.",
        "eligibility":{"entity_types":["private_limited_company","registered_partnership_firm","llp"],"founder_categories":["startup"],"lifecycle_stages":["validation","prototype","early_revenue"],"locations":["India"],"conditions":["DPIIT recognised","incorporated not more than 2 years before application","technology in the core product, service, business model, distribution model or methodology","not more than INR 10 lakh monetary support from another government scheme","Indian promoter shareholding is at least 51%"],"exclusions":["sole proprietorship","public limited company","individual entrepreneur"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://seedfund.startupindia.gov.in/","route":"Apply through the Startup India portal and eligible incubators.","selection":"Incubator and Expert Advisory Committee evaluation.","applicant_note":"The startup must use its own account, mobile number, email, declarations and incubator route; UdyamVeda may guide but may not impersonate the applicant."},
        "fine_print":{"grant":{"maximum_inr":2000000,"purpose":["proof of concept","prototype development","product trials"],"disbursement":"milestone-based installments"},"investment":{"maximum_inr":5000000,"purpose":["market entry","commercialisation","scaling"],"instruments":["convertible debentures","debt","debt-linked instruments"],"interest":"not more than prevailing repo rate","tenure_months_max":60,"moratorium_months_max":12,"security":"unsecured"},"frequency":"Grant and debt/convertible support may each be availed once under the guidelines.","current_source_reconciliation":"The official SISFS portal displays a final extended deadline of 31 May 2026 for startup applications and 30 June 2026 for incubators to complete selection. The official Startup India playbook says disbursals are ongoing; this does not reopen the startup application window or create a direct entitlement.","startup_application_deadline":"2026-05-31","incubator_selection_deadline":"2026-06-30","disbursals_ongoing_note":true,"current_source_checked_at":"2026-09-07","review_note":"Treat new startup applications as closed unless a newer official notice changes the dates. Confirm the current SISFS guideline, portal operation, eligible-incubator route, incorporation-age calculation, government-support exclusion, funding instruments, tranche milestones, any post-deadline intake and disbursal status before publication."},
        "benefit_summary":{"types":["grant","loan"],"amounts":[{"type":"grant","max_inr":2000000},{"type":"investment","max_inr":5000000}],"corpus_inr":9450000000,"summary":"Separate milestone-based grant and debt/convertible-support components subject to the official guidelines; the corpus is not an individual entitlement.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"Proof of concept, prototype development and product trials grant",
        "benefit_conditions":{"maximum_inr":2000000,"milestones_required":true,"eligible_incubator_route":true},
        "requirement":"DPIIT recognition and Indian promoter shareholding",
        "requirement_description":"The startup must be recognised by DPIIT and meet the applicable incorporation-age, prior-government-support, technology and promoter-shareholding conditions before applying through an eligible incubator.",
        "rules":{"all":[{"field":"dpiit_recognized","operator":"equals","value":true},{"field":"incorporation_age_years","operator":"less_than_or_equal","value":2,"unit":"years"},{"field":"government_support_received_inr","operator":"less_than","value":1000000,"unit":"INR"},{"field":"indian_promoter_shareholding_percent","operator":"greater_than_or_equal","value":51,"unit":"percent"}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm DPIIT recognition and incorporation age","description":"Verify that the startup meets the recognition and two-year incorporation condition on the application date.","url":"https://seedfund.startupindia.gov.in/about"},{"title":"Prepare the milestone and incubator dossier","description":"Separate the grant and debt/convertible-support use cases and prepare product, technology, promoter, financial and milestone evidence.","url":"https://seedfund.startupindia.gov.in/faq"},{"title":"Apply through the official SISFS portal","description":"Submit the startup application for evaluation through eligible incubators.","url":"https://seedfund.startupindia.gov.in/"}],
        "window_type":"closed",
        "window_label":"Startup applications closed on 31 May 2026; incubators were to complete selection by 30 June 2026. Ongoing disbursals do not reopen the application window.",
        "closes_at":"2026-05-31",
        "window_evidence":{"source_url":"https://seedfund.startupindia.gov.in/","anchor":"Final Notice (Extended): Last date for startups to apply under SISFS – 31 May 2026; incubators to complete 100% startup selection by – 30 June 2026"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', item->>'authority', item->>'authority', item->>'authority_url'
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
    select version_id, case when item->>'slug' = 'udyam-registration' then 'https://udyamregistration.gov.in/' else 'https://seedfund.startupindia.gov.in/about' end, 'agency', case when item->>'slug' = 'udyam-registration' then 'Udyam Registration official portal' else 'SISFS official scheme and eligibility page' end, case when item->>'slug' = 'udyam-registration' then 'Official Udyam registration portal entry and registration guidance' else 'Eligibility Criteria and funding structure' end, now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = case when item->>'slug' = 'udyam-registration' then 'https://udyamregistration.gov.in/' else 'https://seedfund.startupindia.gov.in/about' end);
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://udyamregistration.gov.in/Important.aspx', 'agency', 'Udyam Registration official important-information page', 'Current thresholds, free/paperless/self-declaration, no upload, no renewal and official fee warning', now(), false
    where item->>'slug' = 'udyam-registration'
      and not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://udyamregistration.gov.in/Important.aspx');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://www.startupindia.gov.in/content/dam/invest-india/Templates/public/Guidelines%20for%20Startup%20India%20Seed%20Fund%20Scheme.pdf', 'guideline', 'SISFS official guidelines', 'Startup India Seed Fund Scheme guidelines', now(), false
    where item->>'slug' = 'startup-india-seed-fund-scheme'
      and not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.startupindia.gov.in/content/dam/invest-india/Templates/public/Guidelines%20for%20Startup%20India%20Seed%20Fund%20Scheme.pdf');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'reference_playbook', 'Startup India Schemes Playbook June 2026', 'SISFS application deadline and ongoing-disbursal note; discovery reference only', now(), false
    where item->>'slug' = 'startup-india-seed-fund-scheme'
      and not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://seedfund.startupindia.gov.in/contact', 'agency', 'SISFS official contact and grievance route', 'Startup and incubator contact and grievance form', now(), false
    where item->>'slug' = 'startup-india-seed-fund-scheme'
      and not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://seedfund.startupindia.gov.in/contact');
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

-- Clean-seed current-source correction for Udyam. The applicant identity and
-- OTP boundary is intentionally explicit and review-gated.
do $$
declare
  version_id uuid;
begin
  select current_version_id into version_id
  from public.opportunities
  where slug = 'udyam-registration';

  if version_id is null then
    return;
  end if;

  update public.opportunity_versions
  set
    eligibility = coalesce(eligibility, '{}'::jsonb) || jsonb_build_object(
      'classification_thresholds', jsonb_build_object(
        'effective_from', '2025-04-01',
        'source_basis', 'MSME Annual Report 2025-26 Section 1.2.4 plus current Udyam portal',
        'micro', jsonb_build_object('investment_inr_max', 25000000, 'turnover_inr_max', 100000000),
        'small', jsonb_build_object('investment_inr_max', 250000000, 'turnover_inr_max', 1000000000),
        'medium', jsonb_build_object('investment_inr_max', 1250000000, 'turnover_inr_max', 5000000000)
      )
    ),
    application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
      'official_form_url', 'https://udyamregistration.gov.in/UdyamRegistration.aspx/',
      'application_pdf_url', 'https://udyamregistration.gov.in/docs/UdyamApplication.pdf',
      'current_route_checked_at', '2026-09-08',
      'otp_boundary', 'UdyamVeda must not collect, store or use applicant OTPs; the applicant must complete the official verification.'
    ),
    fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
      'current_source_reconciliation', 'Current official Udyam portal, form and application PDF were checked on 2026-09-08; the Ministry Annual Report 2025-26 records the revised 2025-04-01 classification thresholds.',
      'portal_is_free_paperless_self_declared', true,
      'documents_uploaded_for_registration', false,
      'certificate_dynamic_qr', true,
      'renewal_required', false,
      'one_registration_per_enterprise', true,
      'multiple_activities_allowed', true,
      'private_intermediary_fee_warning', true,
      'aadhaar_pan_storage_requires_security_review', true,
      'current_route_checked_at', '2026-09-08'
    ),
    last_verified_at = now(),
    review_status = 'in_review'
  where id = version_id;

  insert into public.opportunity_sources
    (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
  values
    (version_id, 'https://udyamregistration.gov.in/UdyamRegistration.aspx/', 'agency', 'Udyam current new-enterprise registration form', 'Aadhaar role, PAN/GST fields, organisation type and consent', now(), false),
    (version_id, 'https://udyamregistration.gov.in/docs/UdyamApplication.pdf', 'agency', 'Udyam official application form', 'Aadhaar/PAN/GST verification and consent fields', now(), false),
    (version_id, 'https://msme.gov.in/sites/default/files/MSMEANNUALREPORT2025-26ENGLISH_0.pdf', 'ministry', 'MSME Annual Report 2025-26', 'Section 1.2.4: revised classification criteria effective 2025-04-01', now(), false)
  on conflict do nothing;
end $$;
