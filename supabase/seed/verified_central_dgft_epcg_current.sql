-- Review-gated DGFT EPCG record. FTP/HBP conditions and the export obligation
-- mean this must not be presented as unconditional tax relief.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('DGFT Foreign Trade Policy 2023 Chapter 5 EPCG', 'https://content.dgft.gov.in/Website/dgftprod/62a8184d-a7c6-42c5-8711-f7964ab7b2ba/FTP2023_Chapter05.pdf', 'guideline', 'central', 'monthly', 1, true, 'Current FTP Chapter 5 EPCG policy source.'),
  ('DGFT Handbook of Procedures Chapter 5 EPCG', 'https://content.dgft.gov.in/Website/dgftprod/d539da8e-57a9-47b1-9d2f-4fd5b3453cd5/HBP%20Chapter%205.pdf', 'guideline', 'central', 'monthly', 1, true, 'Current HBP Chapter 5 operational and discharge source.'),
  ('DGFT EPCG FAQ', 'https://content.dgft.gov.in/Website/DGFT_FAQs-Export_Promotion_Capital_Goods%28EPCG%29v1.0.pdf', 'agency', 'central', 'monthly', 1, true, 'Operational FAQ; current FTP/HBP prevail over older FAQ text.'),
  ('DGFT EPCG average export-obligation relief circular 2025-26', 'https://content.dgft.gov.in/Website/dgftprod/6626fbc5-754f-434a-8a3c-fb4faf305c33/Policy%20Circular%20No.%2010%20%282025-26%29.pdf', 'policy_update', 'central', 'weekly', 1, true, 'Sector/product-group average EO relief circular, not a universal exemption.'),
  ('DGFT official portal', 'https://www.dgft.gov.in/', 'agency', 'central', 'weekly', 1, true, 'Official DGFT handoff.'),
  ('DGFT IEC and services portal', 'https://www.dgft.gov.in/CP/', 'agency', 'central', 'weekly', 1, true, 'Official EPCG service entry point.')
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
        "slug":"dgft-export-promotion-capital-goods-epcg",
        "name":"Export Promotion Capital Goods (EPCG) Scheme",
        "type":"tax_benefit",
        "authority":"Directorate General of Foreign Trade - EPCG",
        "authority_url":"https://www.dgft.gov.in/",
        "canonical_url":"https://content.dgft.gov.in/Website/dgftprod/62a8184d-a7c6-42c5-8711-f7964ab7b2ba/FTP2023_Chapter05.pdf",
        "source_url":"https://content.dgft.gov.in/Website/dgftprod/62a8184d-a7c6-42c5-8711-f7964ab7b2ba/FTP2023_Chapter05.pdf",
        "source_kind":"guideline",
        "source_title":"Foreign Trade Policy 2023 Chapter 5 - Export Promotion Capital Goods Scheme",
        "source_anchor":"Paras 5.00-5.04, 5.10-5.12: objective, zero-duty treatment, coverage, six-times export obligation, validity and reduced EO routes",
        "summary":"Authorisation route that can allow eligible exporters and service providers to import or procure qualifying capital goods with specified customs-duty treatment, subject to a substantial export obligation and continuing conditions.",
        "objective":"Facilitate capital-goods access for producing quality goods and services and improve manufacturing and export competitiveness.",
        "legal_basis":"Foreign Trade Policy 2023 Chapter 5 and Handbook of Procedures Chapter 5 under the Foreign Trade (Development and Regulation) framework.",
        "eligibility":{"entity_types":["manufacturer_exporter","merchant_exporter_with_supporting_manufacturer","service_provider","common_service_provider"],"lifecycle_stages":["operating","exporting","scaling"],"industries":["manufacturing","export","engineering","textiles","services","green_technology"],"locations":["India"],"conditions":["manufacturer exporters may apply with or without supporting manufacturers","merchant exporters must be tied to supporting manufacturers","service providers are covered subject to the policy and HBP","supporting manufacturers must be endorsed before installation where applicable","restricted imports or exports require the prescribed DGFT approval route","IEC-linked DGFT account, digital signature/e-sign, GST branch details and current RCMC/application evidence may be required by the live route"],"thresholds":{"specific_export_obligation_multiple_of_duty_saved":6,"export_obligation_period_years":6,"first_block_years":4,"first_block_minimum_percent":50,"authorisation_import_validity_months":24,"indigenous_sourcing_specific_eo_reduction_percent":25,"green_technology_specific_eo_percent":75,"north_east_jammu_kashmir_ladakh_specific_eo_percent":25},"unknown_handling":"needs_information"},
        "exclusions":["capital goods or categories excluded by the current FTP, negative list or applicable customs notification","treating zero-duty treatment as a universal tax exemption without checking the capital-goods category, export type and current notifications","assuming the authorisation itself is a grant or cash benefit","ignoring annual-average export obligation, actual-user restrictions, installation and EODC requirements","relying on the older FAQ's 18-month import-validity statement where current FTP Chapter 5 states 24 months","claiming the special green-technology or regional reduction without confirming the current category and application route"],
        "application":{"portal":"https://www.dgft.gov.in/CP/","route":"Link the applicant profile to IEC, complete the current DGFT EPCG/Post Export EPCG authorisation route, attach current certificates and declarations, and retain the authorisation, customs and export records.","selection":"DGFT Regional Authority processing under the current FTP/HBP, with Exim Facilitation Committee approval where the policy requires it.","fees":"Confirm the current DGFT application fee and payment route in the live portal.","applicant_note":"UdyamVeda can prepare the eligibility, export-obligation and document checklist but must not store credentials, sign, submit, or impersonate the exporter."},
        "fine_print":{"benefit":"EPCG permits qualifying capital-goods import at the treatment specified in FTP Chapter 5; physical exports may receive the stated IGST/Compensation Cess treatment subject to the applicable Department of Revenue notification, and indigenous procurement follows the prescribed route.","export_obligation":"Specific EO is six times the duties, taxes and cess saved and must be fulfilled within six years; average export obligation may also apply. HBP provides block-wise evidence and compliance requirements.","validity":"Current FTP Chapter 5 states 24 months for import under the authorisation and no revalidation. An older DGFT FAQ states 18 months, so the current FTP/HBP and live DGFT instruction must control publication.","special_routes":"Indigenous sourcing reduces specific EO by 25% without changing any average EO; green-technology products have specific EO at 75%; units in the listed North-East states, Jammu and Kashmir and Ladakh have specific EO at 25%, subject to current policy conditions.","obligations":"Capital goods remain subject to actual-user conditions until EO completion and EODC; export proceeds, shipping documents, installation, third-party exports, block compliance and discharge evidence must be retained.","documents":"The FAQ and HBP identify IEC-linked application records, Chartered Engineer certificate in Appendix 5A, Chartered Accountant/Cost Accountant/Company Secretary certificate in Appendix 5B and supporting-manufacturer/export evidence where applicable; the exact live attachment list must be checked.","current_policy_update":"DGFT Policy Circular No. 10/2025-26 provides sector/product-group average-EO relief for qualifying 2024-25 export decline; this is not a universal reduction and must be evaluated by the Regional Authority.","review_note":"Human review must confirm the current FTP/HBP versions, customs treatment and exclusions, authorisation route, fee, live attachment checklist, RCMC/IEC requirements, regional/special-category conditions, amendments and current DGFT portal behaviour before publication."},
        "benefit_summary":{"types":["tax_benefit"],"summary":"Potential customs-duty and related tax treatment for qualifying capital goods, exchanged for a six-times-duty-saved export obligation; no fixed grant amount or universal tax saving is promised.","separate_value_buckets":true},
        "benefit_type":"tax",
        "benefit_label":"Specified customs-duty treatment for qualifying capital goods, subject to export obligation",
        "benefit_conditions":{"specific_export_obligation_multiple_of_duty_saved":6,"export_obligation_period_years":6,"current_ftp_and_customs_notification_required":true,"actual_user_until_eodc":true,"no_universal_cash_benefit":true},
        "requirement":"IEC-linked exporter/service-provider profile, qualifying capital goods and a feasible export-obligation plan",
        "requirement_description":"Prepare IEC, entity, GST/branch, RCMC and authorised-person information, the capital-goods and installation plan, export projections, supporting-manufacturer evidence where applicable, Chartered Engineer certificate, CA/Cost Accountant/CS certificate and current declarations/attachments required by DGFT.",
        "rules":{"all":[{"field":"iec_active_and_dgft_profile_linked","operator":"equals","value":true},{"field":"applicant_is_covered_exporter_or_service_provider","operator":"equals","value":true},{"field":"qualifying_capital_goods_identified","operator":"equals","value":true},{"field":"export_obligation_plan_feasible","operator":"equals","value":true},{"field":"current_ftp_hbp_and_customs_treatment_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Check current EPCG coverage and duty treatment","description":"Confirm that the capital goods, export type, applicant category and any restricted items fit the current FTP, customs notification and HBP route.","url":"https://content.dgft.gov.in/Website/dgftprod/62a8184d-a7c6-42c5-8711-f7964ab7b2ba/FTP2023_Chapter05.pdf"},{"title":"Prepare the export-obligation and certification file","description":"Prepare IEC-linked details, capital-goods and installation plan, export projections, supporting-manufacturer records, Appendix 5A/5B certificates and other current attachments.","url":"https://content.dgft.gov.in/Website/dgftprod/d539da8e-57a9-47b1-9d2f-4fd5b3453cd5/HBP%20Chapter%205.pdf"},{"title":"Apply through the official DGFT route","description":"Use the current DGFT EPCG/Post Export EPCG service, pay the current fee if applicable, respond to deficiencies and retain the authorisation and customs records.","url":"https://www.dgft.gov.in/CP/"},{"title":"Install, export and complete discharge","description":"Maintain actual-user and installation conditions, meet block-wise and total EO, retain export-realisation evidence and apply for EODC or regularise any shortfall under current rules.","url":"https://content.dgft.gov.in/Website/dgftprod/d539da8e-57a9-47b1-9d2f-4fd5b3453cd5/HBP%20Chapter%205.pdf"}],
        "window_type":"rolling",
        "window_label":"No single public closing date is stated in the cited FTP/HBP; applications follow the current DGFT authorisation route, policy and portal availability. Recheck before recommendation.",
        "window_evidence":{"source_url":"https://www.dgft.gov.in/CP/","anchor":"Current DGFT EPCG service route and live application availability must be verified"},
        "review_note":"Keep review-gated. Do not display the duty treatment as an unconditional grant, tax saving or fixed rupee entitlement; calculate only after the approved authorisation and current customs treatment are known."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Commerce and Industry', 'Department of Commerce', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.9, 0.86, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1; end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true),
      (version_id, 'https://content.dgft.gov.in/Website/dgftprod/d539da8e-57a9-47b1-9d2f-4fd5b3453cd5/HBP%20Chapter%205.pdf', 'guideline', 'DGFT Handbook of Procedures Chapter 5 EPCG', 'Paras 5.10-5.17: evidence, annual-average rules, blocks and discharge', now(), false),
      (version_id, 'https://content.dgft.gov.in/Website/DGFT_FAQs-Export_Promotion_Capital_Goods%28EPCG%29v1.0.pdf', 'agency', 'DGFT EPCG FAQ', 'Prerequisites, documents and older 18-month validity statement reconciled against current FTP', now(), false),
      (version_id, 'https://content.dgft.gov.in/Website/dgftprod/6626fbc5-754f-434a-8a3c-fb4faf305c33/Policy%20Circular%20No.%2010%20%282025-26%29.pdf', 'agency', 'DGFT EPCG average export-obligation relief circular 2025-26', 'Sector/product-group average EO relief for qualifying 2024-25 export decline', now(), false),
      (version_id, 'https://www.dgft.gov.in/CP/', 'agency', 'DGFT IEC and services portal', 'Official application handoff', now(), false)
    on conflict do nothing;
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', (item->>'amount_max')::numeric, (item->>'percentage')::numeric, item->'benefit_conditions'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = item->>'benefit_label');
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'export_obligation', item->>'requirement', item->>'requirement_description', true
    where not exists (select 1 from public.opportunity_requirements where opportunity_version_id = version_id and name = item->>'requirement');
    insert into public.eligibility_rule_sets (opportunity_version_id, rules, source_evidence, reviewed)
    select version_id, item->'rules', jsonb_build_array(jsonb_build_object('source_url', item->>'source_url', 'anchor', item->>'source_anchor')), false
    where not exists (select 1 from public.eligibility_rule_sets where opportunity_version_id = version_id);
    insert into public.opportunity_steps (opportunity_version_id, step_number, title, description, official_url)
    select version_id, row_number() over ()::integer, step->>'title', step->>'description', step->>'url'
    from jsonb_array_elements(item->'steps') as steps(step)
    where not exists (select 1 from public.opportunity_steps where opportunity_version_id = version_id);
    insert into public.opportunity_windows (opportunity_version_id, window_type, closes_at, label, source_evidence)
    select version_id, item->>'window_type', (item->>'window_close_at')::timestamptz, item->>'window_label', item->'window_evidence'
    where not exists (select 1 from public.opportunity_windows where opportunity_version_id = version_id);
    insert into public.review_tasks (opportunity_version_id, task_type, status)
    select version_id, 'publish', 'open'
    where not exists (select 1 from public.review_tasks where opportunity_version_id = version_id and task_type = 'publish' and status in ('open', 'in_review'));
  end loop;
end $$;
