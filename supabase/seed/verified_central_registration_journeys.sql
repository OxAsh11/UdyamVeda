-- National registration and recognition records for the Start & Operate catalog.
-- These records are intentionally review-gated. Registration applicability,
-- current forms and legal thresholds must be checked before publication.

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
        "slug":"dpiit-startup-recognition",
        "name":"DPIIT Startup Recognition",
        "type":"registration",
        "authority":"Department for Promotion of Industry and Internal Trade (DPIIT)",
        "authority_url":"https://dpiit.gov.in/",
        "canonical_url":"https://www.startupindia.gov.in/content/sih/en/startupgov/startup_recognition_page.html",
        "source_url":"https://www.startupindia.gov.in/content/sih/en/startupgov/startup_recognition_page.html",
        "source_title":"Startup India DPIIT Startup Recognition and Tax Exemption",
        "source_anchor":"DPIIT Startup Recognition; Eligibility Criteria for Startup Recognition; Apply through National Single Window System; applicant and fee disclaimer",
        "summary":"Official recognition route for eligible Indian startups through the National Single Window System.",
        "objective":"Recognise eligible startups working toward innovation or improvement with potential for employment or wealth creation and connect them to Startup India benefits and support routes.",
        "legal_basis":"Startup India Action Plan and the current recognition notification referenced by the official Startup India portal",
        "eligibility":{"entity_types":["private_limited_company","registered_partnership_firm","llp","cooperative_society"],"locations":["India"],"conditions":["entity must be incorporated or registered in an eligible form","entity must work toward innovation or improvement of products, services or processes","entity must have potential to generate employment or create wealth","entity must not be formed by splitting up or reconstruction of an existing business"],"thresholds":{"standard_turnover_less_than_inr":2000000000,"deeptech_turnover_less_than_inr":3000000000,"standard_incorporation_age_years_less_than_or_equal":10,"deeptech_incorporation_age_years_less_than_or_equal":20},"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.nsws.gov.in/","route":"Create or use an NSWS account, add the Central Approval named Registration as a Startup, complete the official application and submit using the startup's own details","fees":"No fee is charged by DPIIT for the recognition or eligibility certificate","selection":"DPIIT recognition review; additional benefit applications may have separate conditions"},
        "fine_print":{"applicant_control":"The startup must apply using its own details, mobile number and email; UdyamVeda may prepare and guide but may not impersonate the applicant","agency_warning":"The official portal states that DPIIT has not appointed an agency, representative or franchise for the certificates","certificate":"Recognition certificate is issued through the official process","benefit_scope":"Recognition is not itself a cash grant and does not guarantee every Startup India benefit","current_page_facts":{"last_updated":"20-AUG-2026","application_route":"Create an Investor Account on NSWS, choose Add Approvals > Central Approvals, find Registration as a Startup, add it to the dashboard, complete the application and submit it","self_certification":"The application details are submitted on a self-certification basis","fee":"The Ministry of Commerce and Industry states that it does not charge a fee for the DPIIT recognition or eligibility certificate","deeptech_boundary":"DeepTech recognition has separate age and turnover limits and requires the applicant to satisfy the applicable DPIIT deep-tech framework and evidence requirements; do not infer DeepTech status from an ordinary innovation claim","linked_tax_routes":"80-IAC and other tax exemptions are separate post-recognition applications with their own entity, incorporation-date and approval conditions"},"review_note":"Confirm the current notification, document list, form fields, deep-tech evidence, application status path and any revised turnover or age thresholds before approval."},
        "benefit_summary":{"types":["recognition","market_access","regulatory_support"],"summary":"DPIIT recognition can unlock access to Startup India support and separate benefit routes subject to their own rules; no direct cash benefit is assumed."},
        "benefit_type":"recognition",
        "benefit_label":"DPIIT startup recognition and access to linked support",
        "benefit_conditions":{"recognition_not_cash_grant":true,"linked_benefits_have_separate_rules":true},
        "requirement":"Eligible incorporated entity and innovation or improvement case",
        "requirement_description":"Prepare incorporation and startup information, the innovation or improvement explanation and the support documents required by the current official form.",
        "rules":{"all":[{"field":"entity_type","operator":"in","value":["private_limited_company","registered_partnership_firm","llp","cooperative_society"]},{"field":"innovation_or_improvement_case","operator":"equals","value":true},{"field":"not_split_or_reconstructed_entity","operator":"equals","value":true},{"any":[{"all":[{"field":"turnover_inr","operator":"less_than","value":2000000000},{"field":"incorporation_age_years","operator":"less_than_or_equal","value":10}]},{"all":[{"field":"deeptech_startup","operator":"equals","value":true},{"field":"turnover_inr","operator":"less_than","value":3000000000},{"field":"incorporation_age_years","operator":"less_than_or_equal","value":20}]}]}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm the entity and current recognition criteria","description":"Check entity form, incorporation date, turnover, innovation or improvement case and the current notification before starting.","url":"https://www.startupindia.gov.in/content/sih/en/startupgov/startup_recognition_page.html"},{"title":"Create or use the NSWS account","description":"Use the startup's own account, email and mobile details on the National Single Window System.","url":"https://www.nsws.gov.in/"},{"title":"Add Registration as a Startup and submit","description":"Complete the current Central Approval form, attach the requested material and retain the acknowledgement.","url":"https://www.nsws.gov.in/"}],
        "window_type":"rolling",
        "window_label":"Recognition applications are presented as an online route; current form availability and processing terms require reviewer confirmation.",
        "window_evidence":{"source_url":"https://www.startupindia.gov.in/content/sih/en/startupgov/startup_recognition_page.html","anchor":"To apply for DPIIT Startup Recognition, you will be redirected to nsws.gov.in"}
      },
      {
        "slug":"gst-registration",
        "name":"GST Registration",
        "type":"registration",
        "authority":"Goods and Services Tax Network (GSTN)",
        "authority_url":"https://www.gst.gov.in/",
        "source_url":"https://tutorial.gst.gov.in/cbt/registration/gstregistration/course/story_content/external_files/GST_Registration_Document_Checklist.pdf",
        "canonical_url":"https://www.gst.gov.in/",
        "source_title":"GST Registration Document Checklist",
        "source_anchor":"Check-list of Documents Required For GST Registration; Proof of Constitution; Proof of Appointment of Authorised Signatory; Proof of Principal Place of Business; supporting document while filing clarification",
        "summary":"Official GST registration entry point with a documented checklist for constitution, authorised-signatory and business-premises evidence.",
        "objective":"Guide a business to determine GST registration applicability and prepare the official registration submission with the correct document formats and size limits.",
        "legal_basis":"GST registration process and current applicable provisions; applicability and threshold conditions must be confirmed against current law and notifications",
        "eligibility":{"entity_types":["proprietorship","partnership_firm","llp","private_limited_company","public_limited_company","trust","society","other_legal_entity"],"locations":["India"],"conditions":["registration may be mandatory when the business is liable under applicable GST law","voluntary registration may be available where permitted","state, supply, turnover, e-commerce and sector facts affect applicability"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.gst.gov.in/","mode":"online","route":"Use the official GST portal registration workflow and the current state or taxpayer details requested by the form","fees":"No UdyamVeda filing fee is implied; confirm any official statutory or professional charges separately","selection":"Tax-authority validation and registration workflow under applicable GST rules"},
        "fine_print":{"document_rules":{"common_formats":["JPG","PDF"],"constitution_document_max_size_mb":1,"authorised_signatory_photo_max_size_kb":100,"many_supporting_documents_max_size_kb":100,"multiple_documents":"The official checklist marks some categories as permitting multiple documents and others as not permitting multiple uploads"},"document_groups":["proof of constitution of business","photo of stakeholder or authorised signatory","proof of appointment of authorised signatory","proof of principal place of business","proof of additional place of business where applicable","supporting document while filing clarification"],"current_checklist_findings":{"constitution_proof":"JPG/PDF up to 1 MB; multiple upload not permitted in the official checklist row","stakeholder_or_authorised_signatory_photo":"JPG up to 100 KB; multiple upload not permitted","authorised_signatory_appointment":"Letter of Authorisation or Board/Managing Committee resolution and acceptance letter, JPG/PDF up to 100 KB; multiple upload permitted for the resolution/acceptance row","principal_place_of_business":"Property tax receipt, municipal khata, electricity bill, rent/lease agreement, consent letter or government-issued document; JPG/PDF with 100 KB or 1 MB limits and multiple upload permitted","additional_place_of_business":"Same evidence pattern where applicable; multiple upload permitted","clarification":"Any supporting document, JPG/PDF up to 1 MB; multiple upload permitted"},"application_caution":"Do not infer GST liability or exemption from a generic company profile; a current tax review is required for state, supply, turnover and sector details","review_note":"The current official GSTN checklist was reviewed for document types, formats, size limits and multiple-upload rules. Confirm current registration thresholds, state-specific requirements, form sequence, OTP or verification requirements, bank-account timing and any revised checklist before approval."},
        "benefit_summary":{"types":["registration","compliance","market_access"],"summary":"GST registration supports lawful tax compliance and transaction readiness where registration is applicable; it is not a grant or subsidy."},
        "benefit_type":"compliance",
        "benefit_label":"GST registration and tax-compliance readiness",
        "benefit_conditions":{"applicability_law_dependent":true,"state_and_supply_facts_required":true},
        "requirement":"Constitution, authorised signatory and business-place evidence",
        "requirement_description":"Prepare the applicable constitution document, authorised-signatory evidence and principal or additional place-of-business proof in the official accepted formats and size limits.",
        "rules":{"all":[{"field":"business_operates_in_india","operator":"equals","value":true},{"field":"gst_applicability_assessed","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Assess GST applicability","description":"Review current GST law and the business's state, supply, turnover, e-commerce and sector facts before applying.","url":"https://www.gst.gov.in/"},{"title":"Prepare the official document set","description":"Use the current GSTN checklist for constitution, authorised signatory and business-place evidence, including file type and size limits.","url":"https://tutorial.gst.gov.in/cbt/registration/gstregistration/course/story_content/external_files/GST_Registration_Document_Checklist.pdf"},{"title":"Submit through the official GST portal","description":"Complete the current online registration workflow and retain the application reference and clarification records.","url":"https://www.gst.gov.in/"}],
        "window_type":"rolling",
        "window_label":"The official portal provides an online registration route; applicability and current workflow terms require reviewer confirmation.",
        "window_evidence":{"source_url":"https://www.gst.gov.in/","anchor":"Official GST portal registration entry point"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central',
      case when item->>'slug' = 'gst-registration' then 'Ministry of Finance' else 'Ministry of Commerce and Industry' end,
      case when item->>'slug' = 'gst-registration' then 'Department of Revenue' else 'DPIIT' end,
      item->>'authority_url'
    where not exists (select 1 from public.authorities where name = item->>'authority')
    returning id into authority_id;
    if authority_id is null then
      select id into authority_id from public.authorities where name = item->>'authority' limit 1;
    end if;

    seed_opportunity_id := null;
    insert into public.opportunities
      (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (item->>'slug', item->>'name', item->>'type', 'in_review', authority_id, '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, authority_id = excluded.authority_id, canonical_url = excluded.canonical_url
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then
      select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1;
    end if;

    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.84, 0.84, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', case when item->>'slug' = 'gst-registration' then 'guideline' else 'ministry' end, item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
    if item->>'slug' = 'dpiit-startup-recognition' then
      insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
      select version_id, 'https://www.nsws.gov.in/', 'ministry', 'National Single Window System', 'Registration as a Startup application route', now(), false
      where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.nsws.gov.in/');
    else
      insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
      select version_id, 'https://www.gst.gov.in/', 'ministry', 'GST official portal', 'Official registration entry point', now(), false
      where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.gst.gov.in/');
    end if;

    if item->>'slug' = 'gst-registration' then
      update public.opportunity_sources
      set page_number = 1,
          section = 'Check-list of Documents Required For GST Registration',
          document_anchor = 'Pages 1-2: constitution, authorised signatory and principal/additional place of business evidence'
      where opportunity_version_id = version_id
        and source_url = item->>'source_url';
    else
      update public.opportunity_sources
      set section = 'DPIIT Startup Recognition; Eligibility Criteria for Startup Recognition; Apply through National Single Window System'
      where opportunity_version_id = version_id
        and source_url = item->>'source_url';
    end if;

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
