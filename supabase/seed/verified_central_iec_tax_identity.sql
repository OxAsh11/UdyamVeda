-- Export registration and tax-identity readiness records.
-- These are guidance records, not delegated filing services, and remain
-- review-gated until current exceptions, forms and fee terms are checked.

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
        "slug":"importer-exporter-code-iec",
        "name":"Importer Exporter Code (IEC)",
        "type":"registration",
        "authority":"Directorate General of Foreign Trade (DGFT)",
        "authority_url":"https://www.dgft.gov.in/",
        "canonical_url":"https://www.dgft.gov.in/",
        "source_url":"https://www.dgft.gov.in/CP/",
        "source_title":"DGFT official portal and IEC services",
        "source_anchor":"Importer Exporter Code services and current DGFT application route",
        "summary":"Official DGFT readiness path for businesses that import or export goods, subject to current law, policy and exceptions.",
        "objective":"Help an India-based business determine whether it needs an IEC and prepare the current DGFT application and compliance information without filing on its behalf.",
        "legal_basis":"Foreign Trade (Development and Regulation) Act, 1992 and current foreign-trade policy, rules, notifications and DGFT procedures",
        "eligibility":{"entity_types":["proprietorship","partnership_firm","llp","private_limited_company","public_limited_company","trust","society","other_legal_entity"],"locations":["India"],"conditions":["business intends to undertake import or export activity","current policy and statutory exceptions must be checked before concluding that IEC is required","applicant identity, PAN, address, bank and authorised-person information must match the current DGFT form"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.dgft.gov.in/","route":"Use the current DGFT portal IEC service, create or use the applicant account, complete the official form, authenticate as required and retain the application reference","fees":"Confirm the current official application fee and payment route in the DGFT portal","selection":"DGFT processing and verification under current foreign-trade procedures"},
        "fine_print":{"applicant_control":"The business or its authorised representative must use its own account, credentials and declarations; UdyamVeda may guide and validate but may not impersonate the applicant","policy_dependency":"IEC applicability, exemptions, modification, annual update and surrender rules can change with foreign-trade policy and notifications","current_dgft_facts":{"application_fee_inr":500,"annual_update_window":"The current Handbook of Procedures material describes annual IEC updation during April-June","exemption_boundary":"IEC is compulsory for import/export subject to the exempted categories in the current Foreign Trade (Exemption from application of Rules in certain cases) Order and related procedures","identity_consistency":"PAN, bank and entity details must match the current DGFT application and supporting evidence","product_controls":"An IEC does not itself authorize every product or shipment; restricted, prohibited, regulated and product-specific permissions remain separate"},"review_note":"Confirm the current IEC application path, PAN and bank-account requirements, DSC or Aadhaar signing options, fee, annual update obligation, exemptions, modification workflow and any new DGFT notifications before publication."},
        "benefit_summary":{"types":["compliance","market_access"],"summary":"Import/export compliance readiness and access to the official foreign-trade workflow; IEC is not a grant, subsidy or guaranteed export permission."},
        "benefit_type":"compliance",
        "benefit_label":"Import/export compliance and IEC readiness",
        "benefit_conditions":{"trade_activity_required":true,"policy_exceptions_must_be_checked":true},
        "requirement":"Trade activity, PAN, address and authorised-person information",
        "requirement_description":"Prepare the current DGFT-required identity, entity, address, bank and authorised-person information and check product-specific licences separately.",
        "rules":{"all":[{"field":"intends_import_or_export","operator":"equals","value":true},{"field":"business_operates_in_india","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Assess IEC applicability","description":"Check current DGFT policy, product, transaction and exception conditions before applying.","url":"https://www.dgft.gov.in/"},{"title":"Prepare the current DGFT information set","description":"Align PAN, entity, address, bank and authorised-person information with the official form.","url":"https://www.dgft.gov.in/CP/"},{"title":"Apply and retain the DGFT reference","description":"Complete the current official IEC route and keep acknowledgement, clarification and modification records.","url":"https://www.dgft.gov.in/"}],
        "window_type":"rolling",
        "window_label":"DGFT provides an online foreign-trade service route; current IEC form and processing terms require reviewer confirmation.",
        "window_evidence":{"source_url":"https://www.dgft.gov.in/CP/","anchor":"DGFT official portal and current IEC services"}
      },
      {
        "slug":"pan-tan-allocation-readiness",
        "name":"PAN and TAN Allocation Readiness",
        "type":"registration",
        "authority":"Income Tax Department and Ministry of Corporate Affairs",
        "authority_url":"https://www.incometax.gov.in/iec/foportal/",
        "canonical_url":"https://www.incometax.gov.in/iec/foportal/",
        "source_url":"https://www.mca.gov.in/content/dam/mca/pdf/SPICEplus-and-linked-filings-FAQs-V3-20230122.pdf",
        "source_title":"MCA SPICe+ PAN/TAN allocation guidance",
        "source_anchor":"SPICe+ Part B; Application for PAN / TAN allocation; linked services and current MCA form conditions",
        "summary":"Preparation path for PAN and TAN allocation, including the integrated SPICe+ route for companies and current tax-portal handoffs.",
        "objective":"Help founders understand when PAN or TAN is needed, prepare consistent legal-entity and contact data, and choose the official allocation or update route.",
        "legal_basis":"Income-tax law and current MCA incorporation forms, tax-portal procedures and notifications",
        "eligibility":{"entity_types":["individual","proprietorship","partnership_firm","llp","private_limited_company","public_limited_company","trust","society","other_legal_entity"],"locations":["India"],"conditions":["PAN or TAN requirement depends on applicant, entity and tax-deduction or collection role","company incorporation may offer PAN/TAN allocation through the current SPICe+ linked route","current tax law and form-specific documents control the final route"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.incometax.gov.in/iec/foportal/","route":"For a new company, review the current SPICe+ linked allocation route; for other cases, use the current official Income Tax or authorised PAN/TAN application route","fees":"Confirm current statutory or application charges with the official route","selection":"Tax-authority and MCA validation of the submitted identity and entity information"},
        "fine_print":{"data_consistency":"Legal name, date of incorporation or birth, address, authorised person and supporting documents must be consistent across MCA, Income Tax and linked registrations","privacy":"Never send PAN, TAN, OTP or identity credentials to UdyamVeda chat or store them outside an approved private workflow","current_tax_facts":{"income_tax_act_2025_transition":"The Income Tax Department states that the Income-tax Act, 1961 is repealed from 01-Apr-2026 with transitional provisions under the Income-tax Act, 2025","existing_numbers":"Existing PAN and TAN numbers remain valid under the Income-tax Act, 2025","fresh_applications":"Fresh PAN applications filed on or after 01-Apr-2026 use the new forms prescribed under the Income-tax Rules, 2026","pending_applications":"PAN allotment applications pending on 31-Mar-2026 remain valid and do not require a fresh application under the new Act"},"review_note":"Confirm the current PAN/TAN application providers, forms, fees, document requirements, e-sign or DSC route, TAN-specific conditions and any further Income-tax Act 2025 transition updates before publication."},
        "benefit_summary":{"types":["compliance","recognition"],"summary":"Tax-identity readiness for lawful incorporation, filing and deduction or collection workflows; it is not a financial benefit."},
        "benefit_type":"compliance",
        "benefit_label":"PAN/TAN tax-identity readiness",
        "benefit_conditions":{"applicant_and_entity_specific":true,"current_tax_route_required":true},
        "requirement":"Applicant identity and entity formation information",
        "requirement_description":"Prepare the current legal name, entity or applicant identity, incorporation or birth details, address, authorised contact and official supporting documents.",
        "rules":{"all":[{"field":"business_or_founder_identity_available","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Identify the required tax identity","description":"Determine whether the applicant needs PAN, TAN or both based on entity, incorporation and tax-deductor or collector role.","url":"https://www.incometax.gov.in/iec/foportal/"},{"title":"Choose the current official route","description":"Review the current SPICe+ linked route for companies or the official Income Tax and authorised application route for other applicants.","url":"https://www.mca.gov.in/content/dam/mca/pdf/SPICEplus-and-linked-filings-FAQs-V3-20230122.pdf"},{"title":"Submit and protect the acknowledgement","description":"Use the applicant's own credentials, submit current documents and retain the acknowledgement without sharing OTPs or passwords.","url":"https://www.incometax.gov.in/iec/foportal/"}],
        "window_type":"rolling",
        "window_label":"PAN/TAN routes are online or linked to incorporation; current form, fee and processing terms require reviewer confirmation.",
        "window_evidence":{"source_url":"https://www.mca.gov.in/content/dam/mca/pdf/SPICEplus-and-linked-filings-FAQs-V3-20230122.pdf","anchor":"Application for PAN / TAN allocation"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central',
      case when item->>'slug' = 'importer-exporter-code-iec' then 'Ministry of Commerce and Industry' else 'Ministry of Finance' end,
      case when item->>'slug' = 'importer-exporter-code-iec' then 'Directorate General of Foreign Trade' else 'Income Tax Department' end,
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
    if item->>'slug' = 'importer-exporter-code-iec' then
      update public.opportunity_sources set section = 'DGFT IEC services and current application route'
      where opportunity_version_id = version_id and source_url = item->>'source_url';
      insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
      select version_id, 'https://www.dgft.gov.in/', 'ministry', 'DGFT official portal', 'Foreign-trade and IEC portal entry point', now(), false
      where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.dgft.gov.in/');
    else
      update public.opportunity_sources set section = 'SPICe+ Part B; PAN/TAN allocation'
      where opportunity_version_id = version_id and source_url = item->>'source_url';
      insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
      select version_id, 'https://www.incometax.gov.in/iec/foportal/', 'ministry', 'Income Tax e-Filing official portal', 'PAN/TAN application and tax-identity entry point', now(), false
      where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.incometax.gov.in/iec/foportal/');
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
