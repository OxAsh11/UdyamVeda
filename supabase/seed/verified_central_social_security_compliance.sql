-- National social-security registration/compliance records.
-- These records are guidance records, not delegated filing services, and remain
-- review-gated until current applicability, forms, thresholds and portal routes
-- are checked by a human reviewer.

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
        "slug":"epfo-establishment-registration",
        "name":"EPFO Establishment Registration and Employer Compliance",
        "type":"registration",
        "authority":"Employees' Provident Fund Organisation (EPFO)",
        "authority_url":"https://www.epfindia.gov.in/",
        "canonical_url":"https://www.epfindia.gov.in/site_en/EODB.php",
        "source_url":"https://www.epfindia.gov.in/site_en/EODB.php",
        "source_title":"EPFO Ease of Doing Business",
        "source_anchor":"Registration in EPFO; Common Registration for EPFO/ESIC; employer registration services",
        "source_section":"EASE OF DOING BUSINESS",
        "summary":"Guided readiness path for an establishment to assess EPFO coverage and use the current official employer or common-registration route.",
        "objective":"Help an employer understand the EPFO registration starting point, assemble consistent establishment and workforce information, and hand off to the official portal without taking control of credentials or filing declarations.",
        "legal_basis":"Employees' Provident Funds and Miscellaneous Provisions Act, 1952, applicable schemes, notifications and current EPFO procedures",
        "eligibility":{"entity_types":["proprietorship","partnership_firm","llp","private_limited_company","public_limited_company","trust","society","other_legal_entity"],"locations":["India"],"conditions":["the establishment must assess whether the EPF law and current notifications apply to its establishment class, workforce and activities","coverage can depend on establishment facts, employee information, exclusions and current legal notifications","the employer or authorised representative must provide its own identity and establishment information"],"thresholds":{"employee_count":"Do not hardcode a single employee threshold; confirm the current Act, notifications, establishment class and exclusions during review"},"unknown_handling":"needs_information"},
        "application":{"portal":"https://unifiedportal-emp.epfindia.gov.in/epfo/","route":"Use the current EPFO employer registration or common EPFO/ESIC registration route shown from the official EPFO employer services page; create and use the employer's own account and complete the official declarations","fees":"Confirm the current official portal terms; UdyamVeda does not add a filing fee","selection":"EPFO registration and establishment-code workflow under current EPFO law and procedure"},
        "fine_print":{"applicant_control":"The employer or authorised representative must use its own account, mobile number, email, credentials, OTPs and declarations; UdyamVeda may explain, prepare and validate but may not impersonate the applicant","threshold_caution":"Do not conclude that an establishment is exempt or covered from employee count alone; verify establishment class, current law, notifications, exclusions and any voluntary-coverage route","portal_caution":"EPFO exposes employer registration, common EPFO/ESIC registration and legacy or pre-OLRE routes; the reviewer must confirm which route applies to the business and current portal state","current_epfo_facts":{"registration_route":"EPFO describes online employer registration and a common EPFO/ESIC registration route","registration_cost_boundary":"EPFO employer guidance describes registration as online and free of cost; UdyamVeda must not add a filing fee","document_boundary":"EPFO's Ease of Doing Business guidance states that a bank account and company seal are not required for establishment registration, but the current portal checklist controls what is actually requested","coverage_threshold_caution":"Official employer guidance refers to 20 or more employees for specified establishment types and permits voluntary coverage for other establishments; this is not a universal threshold for every establishment or employee"},"review_note":"Confirm current statutory coverage, employee and wage treatment, establishment categories, documents, digital-signature or authentication requirements, registration timing, post-registration returns and current portal path before approval."},
        "benefit_summary":{"types":["compliance"],"summary":"EPFO registration and compliance readiness supports lawful provident-fund administration where applicable; it is not a grant, subsidy, loan or tax benefit."},
        "benefit_type":"compliance",
        "benefit_label":"EPFO registration and employer-compliance readiness",
        "benefit_conditions":{"coverage_law_dependent":true,"current_establishment_assessment_required":true},
        "requirement":"Establishment, authorised-employer and workforce information",
        "requirement_description":"Prepare the current establishment identity, PAN and address information, authorised-person details, workforce and wage facts, and any current portal-specific evidence required by EPFO.",
        "rules":{"all":[{"field":"business_operates_in_india","operator":"equals","value":true},{"field":"employee_compliance_assessed","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Assess current EPFO applicability","description":"Review the establishment class, workforce, activities, exclusions and current EPFO notifications before deciding that registration is required or not required.","url":"https://www.epfindia.gov.in/site_en/EODB.php"},{"title":"Prepare establishment and employer information","description":"Align the current PAN, address, authorised-person, workforce and wage information with the official EPFO route; do not upload credentials or OTPs to UdyamVeda.","url":"https://www.epfindia.gov.in/site_docs/PDFs/OLRE_PDFs/OLRE_withDSC_RevisedJune2016.pdf"},{"title":"Use the official employer registration route","description":"Open the current EPFO employer or common-registration service, complete the official declarations using the employer's own account and retain the registration reference and future compliance instructions.","url":"https://unifiedportal-emp.epfindia.gov.in/epfo/"}],
        "window_type":"rolling",
        "window_label":"Employer registration is an ongoing official service route; current applicability, registration timing and portal workflow require reviewer confirmation.",
        "window_evidence":{"source_url":"https://www.epfindia.gov.in/site_en/EODB.php","anchor":"Registration in EPFO; Common Registration for EPFO/ESIC"}
      },
      {
        "slug":"esic-employer-registration",
        "name":"ESIC Employer Registration",
        "type":"registration",
        "authority":"Employees' State Insurance Corporation (ESIC)",
        "authority_url":"https://esic.gov.in/",
        "canonical_url":"https://esic.gov.in/",
        "source_url":"https://portal.esic.gov.in/ESICInsurance1/ESICInsurancePortal/Employer_Employee_registration_through_portal.pdf",
        "source_title":"ESIC Online Registration of the Employer",
        "source_anchor":"Online Registration of the Employers; registration under the ESI Act; registration workflow and applicability overview",
        "source_section":"ONLINE REGISTRATION OF THE EMPLOYERS - OVERVIEW",
        "document_anchor":"Official employer-registration PDF: overview, online process, applicability table and required information",
        "summary":"Guided readiness path for an employer to assess ESIC coverage and complete the current official employer-registration handoff.",
        "objective":"Help a factory or establishment understand the ESIC applicability questions, prepare the Form 01 and employee information, and proceed through the official ESIC or Shram Suvidha route without filing on the employer's behalf.",
        "legal_basis":"Employees' State Insurance Act, 1948, applicable regulations, notifications and current ESIC procedures",
        "eligibility":{"entity_types":["proprietorship","partnership_firm","llp","private_limited_company","public_limited_company","trust","society","other_legal_entity"],"locations":["India"],"conditions":["the business must assess whether it is a covered factory or establishment in the applicable area","coverage depends on establishment type, employee count, wage and other current statutory conditions","the employer must provide current unit, employer, factory or establishment and employee information"],"thresholds":{"employee_count":"The official overview contains applicability figures, but do not publish a universal 10/20 threshold without confirming the current law, state or area coverage and establishment category","wage_coverage":"Confirm current wage and employee-coverage conditions from the current official rules before recommendation"},"unknown_handling":"needs_information"},
        "application":{"portal":"https://esic.gov.in/","route":"Use the current ESIC employer registration or Unified Shram Suvidha route, select the applicable Act where requested, complete the official registration form and retain the employer code or registration letter","fees":"Confirm the current official portal terms and any contribution obligations; UdyamVeda does not add a filing fee","selection":"ESIC employer-code and registration workflow under the current ESI Act, regulations and portal process"},
        "fine_print":{"applicant_control":"The employer or authorised representative must use its own account, mobile number, email, credentials, OTPs and declarations; UdyamVeda may prepare and validate but may not impersonate the applicant","coverage_caution":"Do not rely on a generic employee count or old portal manual; check the current area, establishment type, wage coverage, statutory amendments and applicability notifications","registration_output":"The official materials describe an employer registration and employer-code workflow; the exact current confirmation, contribution and post-registration steps must be verified before publication","current_esic_facts":{"covered_factory":"Official ESIC material describes factories employing 10 or more persons as covered, subject to the applicable Act, area and establishment conditions","covered_establishments":"Shops, hotels, restaurants, cinemas, road motor transport and newspaper establishments may be covered at 10 or more coverable employees in notified areas, with state/UT and category exceptions","wage_ceiling_inr_per_month":21000,"wage_ceiling_person_with_disability_inr_per_month":25000,"area_boundary":"ESI coverage is implemented through notified areas and the current jurisdiction/notification must be checked before recommendation"},"review_note":"Confirm the current portal route, Form 01 fields, documents, timing after applicability, area and establishment coverage, employee or wage conditions, initial contribution treatment, returns, amendments and cancellation process before approval."},
        "benefit_summary":{"types":["compliance"],"summary":"ESIC registration and compliance readiness supports lawful employee-insurance administration where applicable; it is not a grant, subsidy, loan or tax benefit."},
        "benefit_type":"compliance",
        "benefit_label":"ESIC registration and employer-compliance readiness",
        "benefit_conditions":{"coverage_law_dependent":true,"current_area_and_employee_assessment_required":true},
        "requirement":"Unit, employer, establishment and employee information",
        "requirement_description":"Prepare current unit and address details, employer and authorised-person information, nature of work or licence information where applicable, employee counts and wage information, and current declaration evidence.",
        "rules":{"all":[{"field":"business_operates_in_india","operator":"equals","value":true},{"field":"employee_compliance_assessed","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Assess current ESIC applicability","description":"Check the current establishment type, area, employee and wage conditions and statutory exceptions before deciding whether registration is required.","url":"https://portal.esic.gov.in/ESICInsurance1/ESICInsurancePortal/Employer_Employee_registration_through_portal.pdf"},{"title":"Choose the official registration route","description":"Use the current ESIC or Unified Shram Suvidha route and select the applicable Act or acts when the portal presents that choice.","url":"https://esic.gov.in/attachments/circularfile/Guidelines_for_USSP_Unified_Shram_Suvidha_Portal_Registration_for_ESIC_User_Manual_V1_0_1752730200.pdf"},{"title":"Complete the official employer registration","description":"Complete the current unit, employer, establishment and employee sections, submit the required declaration using the employer's own credentials and retain the code or registration confirmation.","url":"https://esic.gov.in/"}],
        "window_type":"rolling",
        "window_label":"ESIC employer registration is an ongoing official service route; applicability timing and current portal workflow require reviewer confirmation.",
        "window_evidence":{"source_url":"https://portal.esic.gov.in/ESICInsurance1/ESICInsurancePortal/Employer_Employee_registration_through_portal.pdf","anchor":"Online Registration of the Employers - Overview"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Labour and Employment', item->>'authority', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.82, 0.82, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', 'guideline', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
    update public.opportunity_sources
    set section = item->>'source_section', document_anchor = item->>'document_anchor'
    where opportunity_version_id = version_id and source_url = item->>'source_url';

    if item->>'slug' = 'epfo-establishment-registration' then
      insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
      select version_id, 'https://unifiedportal-emp.epfindia.gov.in/epfo/', 'ministry', 'EPFO employer unified portal', 'Employer registration and common EPFO/ESIC registration entry point', now(), false
      where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://unifiedportal-emp.epfindia.gov.in/epfo/');
      insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
      select version_id, 'https://www.epfindia.gov.in/site_docs/PDFs/OLRE_PDFs/OLRE_withDSC_RevisedJune2016.pdf', 'guideline', 'EPFO online employer registration instructions', 'Employer registration form and digital-signature procedure', now(), false
      where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.epfindia.gov.in/site_docs/PDFs/OLRE_PDFs/OLRE_withDSC_RevisedJune2016.pdf');
    else
      insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
      select version_id, 'https://esic.gov.in/attachments/circularfile/Guidelines_for_USSP_Unified_Shram_Suvidha_Portal_Registration_for_ESIC_User_Manual_V1_0_1752730200.pdf', 'guideline', 'ESIC employer registration manual', 'Unified Shram Suvidha registration; ESIC/EPFO Act selection', now(), false
      where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://esic.gov.in/attachments/circularfile/Guidelines_for_USSP_Unified_Shram_Suvidha_Portal_Registration_for_ESIC_User_Manual_V1_0_1752730200.pdf');
      insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
      select version_id, 'https://esic.gov.in/Publications/ESIAct1948Amendedupto010610.htm', 'other', 'Employees State Insurance Act official text', 'Registration of factories and establishments; contributions and employer duties', now(), false
      where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://esic.gov.in/Publications/ESIAct1948Amendedupto010610.htm');
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
