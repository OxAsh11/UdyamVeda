-- Central Legal Metrology registration and approval routes from official
-- Department of Consumer Affairs evidence. These are compliance journeys,
-- not grants; all remain in_review pending route and document verification.

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
        "slug":"legal-metrology-packaged-commodities-registration-rule-27",
        "name":"Legal Metrology Packaged Commodities Registration (Rule 27)",
        "type":"registration",
        "authority":"Department of Consumer Affairs - Legal Metrology",
        "authority_url":"https://consumeraffairs.gov.in/",
        "canonical_url":"https://lm.doca.gov.in/pcr/",
        "source_url":"https://lm.doca.gov.in/index.aspx",
        "source_kind":"agency_portal",
        "source_title":"Legal Metrology official portal",
        "source_anchor":"Packaged Commodities Registration and Rule 27 application route",
        "summary":"Registration route for manufacturers, packers and importers of packaged commodities under Rule 27 of the Legal Metrology (Packaged Commodities) Rules, 2011.",
        "objective":"Enable regulated businesses to register their packaged-commodity manufacturing, packing or importing activity and comply with mandatory declarations and measurement requirements.",
        "legal_basis":"Legal Metrology Act, 2009 and Rule 27 of the Legal Metrology (Packaged Commodities) Rules, 2011, as amended.",
        "eligibility":{"entity_types":["manufacturer","packer","importer","company","llp","proprietorship","partnership"],"lifecycle_stages":["pre_start","manufacturing","packaging","import","operate"],"industries":["consumer_goods","food","retail","pharmaceuticals","cosmetics","industrial_products"],"locations":["India"],"conditions":["the business manufactures, packs or imports a commodity falling within the current Rule 27 route","the applicant provides the entity, premises, commodity, label and responsible-person information required by the current portal and applicable rules","product declarations, MRP/unit-sale-price/quantity and other packaged-commodity requirements must be checked separately","State/UT enforcement and any product-specific rules may add requirements"],"thresholds":{"legal_basis_rule":"27"},"unknown_handling":"needs_information"},
        "exclusions":["a business whose activity is outside the current packaged-commodity registration route","labels or declarations treated as compliant without product and package review","registration treated as a substitute for FSSAI, BIS, GST, import or sector-specific approvals","State/UT fees, renewals or enforcement terms assumed to be identical nationwide"],
        "application":{"portal":"https://lm.doca.gov.in/pcr/","route":"Use the Legal Metrology portal or NSWS route identified by the official portal, submit the current Rule 27 application and retain certificate and label evidence","selection":"Document and rule-based registration review; additional State/UT or product-specific interaction may apply","fees":"Confirm current portal, State/UT and product-specific fee instructions","applicant_note":"UdyamVeda can prepare the compliance checklist and explain the official handoff, but cannot certify labels, submit on behalf of the business or store portal credentials."},
        "fine_print":{"scope":"Rule 27 registration applies to manufacturers, packers and importers in the packaged-commodities route; it is distinct from model approval of instruments and importer registration for weights and measures.","label_compliance":"The official Department material identifies declarations including manufacturer/packer/importer identity, country of origin, commodity name, net quantity, manufacture/packing date, MRP, unit sale price and best-before/use-by information where applicable; the exact product rule and exemption must be checked.","route":"The Legal Metrology portal says applications may be made through NSWS; current portal routing, documents, fees and issuance conditions must be verified for the business and product.","review_note":"Confirm current Rule 27 form, document list, fee, product exemptions, label declarations, certificate validity, amendment process and State/UT enforcement/renewal obligations before publication."},
        "benefit_summary":{"types":["registration","compliance_support"],"summary":"Official Legal Metrology registration readiness for eligible packaged-commodity manufacturers, packers and importers. This is a compliance authorization route, not a financial benefit."},
        "benefit_type":"registration",
        "benefit_label":"Packaged-commodities Rule 27 registration",
        "benefit_conditions":{"official_registration_required":true,"product_label_review_required":true,"state_or_ut_conditions_may_apply":true},
        "requirement":"Manufacturer, packer or importer profile and compliant packaged-commodity evidence",
        "requirement_description":"Prepare entity, premises, commodity, label, responsible-person, identity, contact, import/manufacturing and any product or State/UT documents required by the current official route.",
        "rules":{"all":[{"field":"manufactures_packs_or_imports_packaged_commodity","operator":"equals","value":true},{"field":"rule_27_route_applicable","operator":"equals","value":true},{"field":"packaged_commodity_documents_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm Rule 27 applicability","description":"Check whether the product and business role fall within the current manufacturer, packer or importer registration route and identify exemptions or additional approvals.","url":"https://consumeraffairs.gov.in/pages/legal-metrology-act"},{"title":"Prepare entity and label evidence","description":"Compile premises, commodity, label declarations, responsible-person, identity and product documents required by the current route.","url":"https://lm.doca.gov.in/index.aspx"},{"title":"Submit through the official portal","description":"Use the Legal Metrology or NSWS route, retain the acknowledgement/certificate and record any State/UT follow-up or renewal obligation.","url":"https://lm.doca.gov.in/pcr/"}],
        "window_type":"rolling",
        "window_label":"Registration is an ongoing compliance route, but the current application form, fee, documents and issuance or renewal conditions must be verified at the time of filing.",
        "window_evidence":{"source_url":"https://lm.doca.gov.in/index.aspx","anchor":"Packaged Commodities Registration and NSWS route"},
        "review_note":"Current Rule 27 route, product exemptions, certificate and State/UT conditions require human review."
      },
      {
        "slug":"legal-metrology-importer-registration-weights-measures-section-19",
        "name":"Legal Metrology Importer Registration for Weights and Measures (Section 19)",
        "type":"registration",
        "authority":"Department of Consumer Affairs - Legal Metrology",
        "authority_url":"https://consumeraffairs.gov.in/",
        "canonical_url":"https://lm.doca.gov.in/oregis/",
        "source_url":"https://consumeraffairs.gov.in/pages/weight-and-measures",
        "source_kind":"ministry_portal",
        "source_title":"Weights and measures overview",
        "source_anchor":"Registration for importers of weights and measures; State enforcement rules",
        "summary":"Importer registration route for businesses importing weights, measures or weighing and measuring instruments under Section 19 of the Legal Metrology Act, 2009.",
        "objective":"Ensure imported weights and measures enter the Indian market through the regulated Legal Metrology route with the required importer, instrument and compliance evidence.",
        "legal_basis":"Section 19 of the Legal Metrology Act, 2009 and applicable Legal Metrology rules.",
        "eligibility":{"entity_types":["importer","company","llp","proprietorship","partnership","manufacturer_importer"],"lifecycle_stages":["pre_start","import","operate"],"industries":["industrial_equipment","retail_equipment","weighing_instruments","measuring_instruments","medical_instruments"],"locations":["India"],"conditions":["the business imports weights or measures or a covered weighing/measuring instrument","the instrument and intended use fit the current Legal Metrology rules and approvals","importer, product, manufacturer, country-of-origin and technical documents are available","State/UT enforcement, customs, model approval and product-specific requirements may also apply"],"thresholds":{"legal_basis_section":"19"},"unknown_handling":"needs_information"},
        "exclusions":["import activity outside weights and measures or covered instruments","an importer relying on registration without checking model approval or other technical requirements","customs, BIS, medical-device or sector permissions treated as satisfied by Legal Metrology registration","State/UT enforcement or fees assumed to be uniform"],
        "application":{"portal":"https://lm.doca.gov.in/oregis/","route":"Use the official Legal Metrology importer registration route and complete the current application with instrument and importer evidence","selection":"Document and legal-metrology review, with possible model, customs or State/UT checks","fees":"Confirm the current portal and enforcement-authority fee instructions","applicant_note":"UdyamVeda can prepare the importer-readiness checklist and official portal handoff, but cannot certify instruments or submit credentials."},
        "fine_print":{"scope":"Section 19 importer registration is separate from Rule 27 packaged-commodity registration and Section 22 model approval; one business may need more than one route.","technical_boundary":"The business must check whether the imported instrument requires model approval, applicable OIML/technical evidence, verification/stamping or another sector permission.","state_boundary":"The Department overview notes State Government enforcement rules; local enforcement, inspection and follow-up may apply after the central portal handoff.","review_note":"Confirm current importer form, document list, instrument coverage, model-approval dependency, customs interaction, validity, fees and State/UT enforcement requirements."},
        "benefit_summary":{"types":["registration","compliance_support"],"summary":"Importer-registration readiness for covered weights and measures. This is a regulatory compliance route, not a grant, subsidy or tax benefit."},
        "benefit_type":"registration",
        "benefit_label":"Weights and measures importer registration",
        "benefit_conditions":{"section_19_route_required":true,"instrument_scope_review_required":true,"model_approval_may_be_required":true,"state_or_ut_conditions_may_apply":true},
        "requirement":"Importer, instrument and technical-compliance evidence",
        "requirement_description":"Prepare importer identity, manufacturer and country-of-origin information, instrument specifications, technical/model documents, customs and State/UT evidence required by the current Legal Metrology route.",
        "rules":{"all":[{"field":"imports_weights_or_measures","operator":"equals","value":true},{"field":"section_19_route_applicable","operator":"equals","value":true},{"field":"importer_and_instrument_documents_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Classify the instrument and route","description":"Confirm whether the goods are covered weights or measures and whether model approval, customs or sector permissions are also required.","url":"https://consumeraffairs.gov.in/pages/weight-and-measures"},{"title":"Prepare importer and technical documents","description":"Compile importer, manufacturer, origin, instrument specification, model and customs evidence for the current application.","url":"https://lm.doca.gov.in/index.aspx"},{"title":"Submit and retain registration evidence","description":"Use the official importer registration route and retain certificate, inspection, verification and State/UT follow-up records.","url":"https://lm.doca.gov.in/oregis/"}],
        "window_type":"rolling",
        "window_label":"Importer registration is an ongoing route; the current instrument scope, documents, fees and model-approval dependencies must be checked before filing.",
        "window_evidence":{"source_url":"https://consumeraffairs.gov.in/pages/weight-and-measures","anchor":"Registration for importers of weights and measures"},
        "review_note":"Current Section 19 route and instrument-specific dependencies require human review."
      },
      {
        "slug":"legal-metrology-model-approval-weights-measures-section-22",
        "name":"Legal Metrology Model Approval for Weights and Measures (Section 22)",
        "type":"certification",
        "authority":"Department of Consumer Affairs - Legal Metrology",
        "authority_url":"https://consumeraffairs.gov.in/",
        "canonical_url":"https://lm.doca.gov.in/model/",
        "source_url":"https://lm.doca.gov.in/index.aspx",
        "source_kind":"agency_portal",
        "source_title":"Legal Metrology official portal",
        "source_anchor":"Model Approval System and Section 22 application route",
        "summary":"Model-approval route for weights, measures and weighing or measuring instruments under Section 22 of the Legal Metrology Act, 2009.",
        "objective":"Verify and approve instrument models before manufacture, import or use where the current Legal Metrology route requires model approval.",
        "legal_basis":"Section 22 of the Legal Metrology Act, 2009 and the Legal Metrology (Approval of Models) Rules, 2011, as amended.",
        "eligibility":{"entity_types":["manufacturer","importer","model_owner","company","llp","proprietorship","research_and_development_entity"],"lifecycle_stages":["prototype","manufacturing","import","certification","market_entry"],"industries":["industrial_equipment","retail_equipment","weighing_instruments","measuring_instruments","medical_instruments"],"locations":["India"],"conditions":["the instrument model is within the current model-approval scope","the applicant supplies drawings, specifications, test and manufacturer/importer evidence required by the current route","testing, verification, OIML or State/UT obligations are checked for the model and intended market","the current rules and any 2025/2026 amendments are reconciled before filing"],"thresholds":{"legal_basis_section":"22"},"unknown_handling":"needs_information"},
        "exclusions":["a model outside the current Legal Metrology approval scope","a business assuming approval of one model covers materially different models","testing, verification, BIS, medical-device or customs permissions treated as automatically satisfied","a model submitted without current technical drawings, specifications and test evidence"],
        "application":{"portal":"https://lm.doca.gov.in/model/","route":"Use the official Model Approval System or NSWS route, submit the current model application and complete testing and review requirements","selection":"Technical and document review under Section 22 and applicable model-approval rules, followed by certificate or further-query handling","fees":"Confirm the current portal, testing and model-approval fee instructions","applicant_note":"UdyamVeda can create the model-approval readiness checklist and source-backed evidence map, but cannot certify the instrument or submit the application."},
        "fine_print":{"scope":"Model approval is a technical certification route distinct from importer registration and packaged-commodity registration; an applicant may need to complete more than one Legal Metrology journey.","amendment_boundary":"The Department of Consumer Affairs publishes continuing amendments to the General and Approval of Models rules; the controlling current rule, technical specification and certificate-validity condition must be verified for the model.","state_boundary":"Central model approval does not eliminate State/UT verification, stamping, inspection or enforcement obligations where those apply.","review_note":"Confirm current model category, test laboratory, technical documents, fee, certificate validity, amendment impact, OIML interaction and State/UT verification requirements."},
        "benefit_summary":{"types":["certification","compliance_support"],"summary":"Model-approval readiness for covered weights and measures or instruments. This is a regulatory certification route, not a financial benefit."},
        "benefit_type":"certification",
        "benefit_label":"Weights and measures model approval",
        "benefit_conditions":{"section_22_route_required":true,"technical_testing_required":true,"current_model_rules_required":true,"state_verification_may_apply":true},
        "requirement":"Instrument model, technical specification and test evidence",
        "requirement_description":"Prepare model drawings, specifications, test reports, manufacturer/importer information, technical declarations and any laboratory or OIML evidence required by the current approval route.",
        "rules":{"all":[{"field":"covered_weights_or_measures_model","operator":"equals","value":true},{"field":"section_22_route_applicable","operator":"equals","value":true},{"field":"model_technical_evidence_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm model-approval applicability","description":"Classify the instrument and reconcile the current Approval of Models Rules and amendments before preparing the application.","url":"https://consumeraffairs.gov.in/pages/legal-metrology-act"},{"title":"Prepare technical and test evidence","description":"Compile drawings, specifications, test reports, manufacturer/importer details and any required laboratory or OIML material.","url":"https://lm.doca.gov.in/index.aspx"},{"title":"Submit through the official model system","description":"Use the official Model Approval System or NSWS route, respond to technical queries and retain the approval certificate and post-approval obligations.","url":"https://lm.doca.gov.in/model/"}],
        "window_type":"rolling",
        "window_label":"Model approval is an ongoing technical route, but current instrument scope, testing, rules, fees and certificate conditions must be verified before filing.",
        "window_evidence":{"source_url":"https://lm.doca.gov.in/index.aspx","anchor":"Model Approval System under Section 22"},
        "review_note":"Current technical rules, amendments, laboratory route and certificate conditions require human review."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Consumer Affairs, Food and Public Distribution', 'Department of Consumer Affairs', item->>'authority_url'
    where not exists (select 1 from public.authorities where name = item->>'authority')
    returning id into authority_id;
    if authority_id is null then select id into authority_id from public.authorities where name = item->>'authority' limit 1; end if;

    seed_opportunity_id := null;
    insert into public.opportunities (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (item->>'slug', item->>'name', item->>'type', 'in_review', authority_id, '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, authority_id = excluded.authority_id, canonical_url = excluded.canonical_url
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1; end if;

    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.87, 0.84, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1; end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, 'https://lm.doca.gov.in/index.aspx', 'agency_portal', 'Legal Metrology official portal', 'Official route index', now(), false),
      (version_id, 'https://consumeraffairs.gov.in/pages/legal-metrology-act', 'act_and_rules', 'Department of Consumer Affairs Legal Metrology Act and rules', 'Current acts, rules and amendments', now(), false),
      (version_id, 'https://consumeraffairs.gov.in/pages/weight-and-measures', 'ministry_portal', 'Department of Consumer Affairs weights and measures overview', 'Instrument and State enforcement scope', now(), false),
      (version_id, 'https://www.nsws.gov.in/', 'government_portal', 'National Single Window System', 'Official application handoff', now(), false)
    on conflict do nothing;
    if item->>'slug' = 'legal-metrology-packaged-commodities-registration-rule-27' then
      insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
      values
        (version_id, 'https://lm.doca.gov.in/pcr/', 'agency_portal', 'Legal Metrology packaged commodities registration portal', 'Rule 27 application route', now(), false),
        (version_id, 'https://lm.doca.gov.in/pcr/certificates', 'agency_portal', 'Legal Metrology packaged commodities certificate list', 'Current certificate evidence', now(), false)
      on conflict do nothing;
    elsif item->>'slug' = 'legal-metrology-importer-registration-weights-measures-section-19' then
      insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
      values (version_id, 'https://lm.doca.gov.in/oregis/', 'agency_portal', 'Legal Metrology importer registration portal', 'Section 19 importer route', now(), false)
      on conflict do nothing;
    else
      insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
      values (version_id, 'https://lm.doca.gov.in/model/', 'agency_portal', 'Legal Metrology Model Approval System', 'Section 22 model approval route', now(), false)
      on conflict do nothing;
    end if;

    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', null, null, item->'benefit_conditions'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = item->>'benefit_label');
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'compliance', item->>'requirement', item->>'requirement_description', true
    where not exists (select 1 from public.opportunity_requirements where opportunity_version_id = version_id and name = item->>'requirement');
    insert into public.eligibility_rule_sets (opportunity_version_id, rules, source_evidence, reviewed)
    select version_id, item->'rules', jsonb_build_array(jsonb_build_object('source_url', item->>'source_url', 'anchor', item->>'source_anchor')), false
    where not exists (select 1 from public.eligibility_rule_sets where opportunity_version_id = version_id);
    insert into public.opportunity_steps (opportunity_version_id, step_number, title, description, official_url)
    select version_id, row_number() over ()::integer, step->>'title', step->>'description', step->>'url'
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
