-- Central export and market-access records from official Department of
-- Commerce and DGFT sources. These records remain in_review because current
-- sub-scheme notices, tariff-line rates, agency routes and amendments must be
-- verified before publication.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Department of Commerce official portal', 'https://www.commerce.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Department of Commerce portal for export promotion and trade schemes.'),
  ('Export Promotion Mission policy update', 'https://www.commerce.gov.in/wp-content/uploads/2026/02/USQ-1516-PDF.pdf', 'policy_update', 'central', 'weekly', 1, true, 'Official policy update describing Niryat Protsahan, Niryat Disha and exporter credit support; detailed operational guidelines require review.'),
  ('Export Promotion Mission operational status', 'https://www.commerce.gov.in/wp-content/uploads/2026/02/Starred-Question-87.pdf', 'policy_update', 'central', 'weekly', 1, true, 'Official Department of Commerce statement confirming EPM approval, FY 2025-31 outlay and phased operationalisation of MSME exporter interventions.'),
  ('Market Access Initiative scheme guidelines', 'https://www.commerce.gov.in/wp-content/uploads/2021/07/Market-Access-Initiative-MAI-Scheme-2021-dated-19-July-2021.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official Department of Commerce MAI guidelines; current agency calls and assistance ceilings require review.'),
  ('Market Access Initiative Scheme 2018 historical guideline', 'https://commerce.gov.in/wp-content/uploads/2020/08/MOC_636546562282394611_Market_Access_Initiative-_Scheme_2018.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official Department of Commerce MAI Scheme 2018 used for historical scope and eligible-agency comparison; it does not establish a current application window.'),
  ('Department of Commerce Annual Report 2025-26', 'https://www.commerce.gov.in/ministryofcommerce/sites/default/files/2026-04/Annual_0.pdf', 'annual_report', 'central', 'monthly', 1, true, 'Official Annual Report 2025-26 used to reconcile MAI continuation through 31 March 2026 and its consolidation into the Export Promotion Mission.'),
  ('Department of Commerce scheme claims monitor', 'https://apps.commerce.gov.in/schemes/schemereport', 'ministry_portal', 'central', 'weekly', 2, true, 'Official claims monitor listing MAI and other Department of Commerce schemes; current claims are operational context, not a universal direct-applicant entitlement.'),
  ('RoDTEP scheme overview', 'https://www.commerce.gov.in/ministryofcommerce/node/856', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Department of Commerce RoDTEP overview; current tariff-line rates and caps require DGFT/Customs verification.'),
  ('RoDTEP continuation notification through September 2026', 'https://content.dgft.gov.in/Website/dgftprod/1322d65e-dd25-46ec-a7e9-7b0a3f9765f2/RoDTEP%20Notification.pdf', 'gazette', 'central', 'weekly', 1, true, 'Official DGFT Notification 74/2025-26 dated 31 March 2026 continuing RoDTEP from 1 April to 30 September 2026 at rates and caps in force on 31 March 2026.'),
  ('DGFT export promotion schemes report', 'https://content.dgft.gov.in/Website/dgftprod/816a9d11-d7a1-46c8-8098-47afade7f6e6/Annual%20MIS%20Report%20on%20Export%20Promotion%20Schemes-%20%202025.pdf', 'report', 'central', 'monthly', 1, true, 'Official DGFT report used for export-scheme context; it is not a substitute for current scheme notifications or rate tables.')
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
        "slug":"export-promotion-mission-niryat-protsahan-niryat-disha",
        "name":"Export Promotion Mission (Niryat Protsahan and Niryat Disha)",
        "type":"market_access",
        "authority":"Department of Commerce - Export Promotion Mission",
        "authority_url":"https://www.commerce.gov.in/",
        "lifecycle_status":"active",
        "canonical_url":"https://www.commerce.gov.in/",
        "source_url":"https://www.commerce.gov.in/wp-content/uploads/2026/02/Starred-Question-87.pdf",
        "source_kind":"policy_update",
        "source_title":"Export Promotion Mission operational status",
        "source_anchor":"EPM approval, FY 2025-26 to FY 2030-31 outlay and phased operationalisation of MSME exporter interventions",
        "summary":"An integrated export-promotion framework combining trade finance, collateral support, export-quality assistance, branding, market access and export capacity building.",
        "objective":"Improve exporter access to affordable trade finance and non-financial export-readiness, market-diversification and compliance support.",
        "legal_basis":"Export Promotion Mission policy update; detailed operational guidelines and implementing notices require confirmation",
        "eligibility":{"entity_types":["exporter","msme_exporter","startup_exporter","export_oriented_business"],"industries":["manufacturing","services","textiles","leather","gems_and_jewellery","engineering","marine_products"],"conditions":["current Niryat Protsahan or Niryat Disha route must be available","IEC and export documentation requirements apply where relevant","sub-scheme and lender-specific conditions apply"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.commerce.gov.in/","route":"follow the current Department of Commerce, DGFT, lender or implementing-agency notice for the applicable sub-scheme","sub_schemes":["niryat_protsahan","niryat_disha","credit_guarantee_scheme_for_exporters"],"current_route_boundary":"The Department of Commerce statement confirms that interest subvention for pre/post-shipment export credit and collateral support for export credit have been operationalised for MSME exporters; remaining initiatives are being rolled out in phases."},
        "fine_print":{"mission_outlay_inr":250600000000,"mission_period":"FY 2025-26 to FY 2030-31 as stated in the cited policy update","outlay_is_not_applicant_entitlement":true,"support_areas":["interest_subvention","export_factoring","collateral_guarantees","ecommerce_export_credit_cards","quality_and_compliance","branding_and_packaging","trade_fairs","warehousing_and_logistics","trade_intelligence"],"credit_guarantee_additional_credit_facility_ceiling_inr":200000000000,"current_epm_facts":{"official_sources_checked":"2026-09-07","operational_status_source":"https://www.commerce.gov.in/wp-content/uploads/2026/02/Starred-Question-87.pdf","approved_period":"FY 2025-26 to FY 2030-31","msme_exporter_interventions_operationalised":["interest_subvention_for_pre_and_post_shipment_export_credit","collateral_support_for_export_credit"],"phased_interventions":["export_factoring","credit_assistance_for_ecommerce_exporters","credit_enhancement_for_export_diversification","quality_and_compliance","branding_and_packaging","market_access","logistics_and_warehousing","trade_intelligence"],"current_availability":"The mission framework is current, but each intervention requires its own implementing notice, lender or agency route and eligibility review."},"current_source_reconciliation":"The February 2026 Department of Commerce policy update and operational-status statement were checked on 7 September 2026. The record remains a framework-level opportunity and does not convert the mission outlay into a direct applicant entitlement.","review_note":"Confirm current implementing notifications, eligible exporters, lender route, credit-card or guarantee terms, reimbursement rules, agency responsibilities and application windows before publication."},
        "benefit_summary":{"types":["export_finance","credit_guarantee","market_access","compliance_support"],"summary":"Potential access to export-finance and non-financial export-readiness support through the mission's sub-schemes; no single guaranteed applicant amount is inferred from the mission outlay."},
        "benefit_type":"export_finance_and_market_access",
        "benefit_label":"Export finance and market-readiness support",
        "benefit_conditions":{"sub_scheme_specific":true,"current_operational_notice_required":true},
        "requirement":"Exporter profile and applicable mission route",
        "requirement_description":"The business must identify the applicable mission sub-scheme and satisfy its current exporter, documentation, lender or implementing-agency conditions.",
        "rules":{"all":[{"field":"export_intent_or_existing_export_activity","operator":"equals","value":true},{"field":"iec_or_applicable_export_registration_available","operator":"equals","value":true},{"field":"current_epm_route_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Classify the export need","description":"Determine whether the need is trade finance, credit enhancement, compliance, branding, logistics, market access or capacity building.","url":"https://www.commerce.gov.in/wp-content/uploads/2026/02/USQ-1516-PDF.pdf"},{"title":"Follow the current implementing route","description":"Use the current Department of Commerce, DGFT, lender or designated agency notice and retain the applicable export evidence.","url":"https://www.commerce.gov.in/"}],
        "window_type":"rolling",
        "window_label":"Mission framework is approved for FY 2025-26 to FY 2030-31; each intervention has a separate operational route and phased notice.",
        "window_evidence":{"source_url":"https://www.commerce.gov.in/wp-content/uploads/2026/02/Starred-Question-87.pdf","anchor":"EPM approval, six-year outlay and operationalised MSME exporter interventions; checked 7 September 2026"}
      },
      {
        "slug":"market-access-initiative-mai",
        "name":"Market Access Initiative (MAI)",
        "type":"market_access",
        "authority":"Department of Commerce - Market Access Initiative",
        "authority_url":"https://www.commerce.gov.in/",
        "lifecycle_status":"superseded",
        "canonical_url":"https://www.commerce.gov.in/wp-content/uploads/2021/07/Market-Access-Initiative-MAI-Scheme-2021-dated-19-July-2021.pdf",
        "source_url":"https://www.commerce.gov.in/wp-content/uploads/2021/07/Market-Access-Initiative-MAI-Scheme-2021-dated-19-July-2021.pdf",
        "source_kind":"guideline",
        "source_title":"Market Access Initiative Scheme 2021 Guidelines",
        "source_anchor":"Main focus, eligible agencies and components",
        "summary":"Project-based export-promotion assistance for eligible agencies supporting new markets, products, exporters, branding, standards, fairs and market development.",
        "objective":"Develop and promote Indian exports, particularly MSME, startup, traditional-product, women-led, SC/ST, youth and regional export activity.",
        "legal_basis":"Central Sector Market Access Initiative Scheme 2021 Guidelines",
        "eligibility":{"entity_types":["export_promotion_council","government_agency","commodity_board","trade_body","industrial_cluster","research_institution","university","exporter_through_eligible_agency"],"founder_categories":["women","sc","st","startup","youth"],"conditions":["the cited guidelines describe an agency-led proposal route","direct individual or business entitlement must not be assumed","current Department of Commerce approval and project conditions apply"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://apps.commerce.gov.in/schemes/schemereport","route":"Do not present MAI as a new universal direct application window. For historical or continuing project claims, eligible agencies must follow the Department of Commerce route and verify any successor or consolidated EPM route.","selection":"Department of Commerce project review and approval","current_portal_context":"The official claims monitor reports MAI claims through August 2026; this is operational reporting for historical or continuing claims, not proof of a fresh 2026-27 direct application window."},
        "fine_print":{"agency_led":true,"support_areas":["standards_and_regulations","export_packaging","skill_development","marketing_and_branding","cataloguing","trade_fairs","buyer_seller_meets","market_research"],"priority_groups":["msme","startup","women_exporter","sc_st_exporter","traditional_products","north_east","jammu_and_kashmir","ladakh","hill_regions"],"no_universal_direct_applicant_ceiling_inferred":true,"current_mai_facts":{"official_sources_checked":"2026-09-07","claims_monitor":"https://apps.commerce.gov.in/schemes/schemereport","reporting_cutoff":"August 2026","reporting_context":"The Department of Commerce monitor lists MAI claims and disbursement reporting; the route remains agency-led and project-specific.","approved_period_end":"2026-03-31","current_availability":"No new MAI application window is asserted after 31 March 2026. The 2025-26 Annual Report describes MAI as consolidated into the Export Promotion Mission; the claim monitor remains useful for historical or continuing claims."},"current_source_reconciliation":"The 2021 MAI guideline, the Department of Commerce 2025-26 Annual Report and the current claims monitor were checked on 7 September 2026. MAI is retained as a superseded historical/claims record and must not be presented as a currently open direct grant.","review_note":"Confirm any successor EPM route, residual claims process, beneficiary pass-through rules and amendment history before publication."},
        "benefit_summary":{"types":["market_access","reimbursement","training"],"summary":"Agency-led project assistance for export development and market access; it is not a universal direct grant for every individual exporter."},
        "benefit_type":"agency_project_assistance",
        "benefit_label":"Export market-development project support",
        "benefit_conditions":{"eligible_agency_route_required":true,"approved_project_required":true},
        "requirement":"Eligible agency and approved export-promotion project",
        "requirement_description":"The applicant route requires an eligible agency to submit and obtain approval for a project under the current MAI procedure.",
        "rules":{"all":[{"field":"eligible_export_promotion_agency","operator":"equals","value":true},{"field":"mai_project_proposal_available","operator":"equals","value":true},{"field":"current_mai_route_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Identify an eligible agency route","description":"Confirm whether an export promotion council, government body, cluster, institution or other eligible agency can sponsor the relevant project.","url":"https://www.commerce.gov.in/wp-content/uploads/2021/07/Market-Access-Initiative-MAI-Scheme-2021-dated-19-July-2021.pdf"},{"title":"Submit the project under the current procedure","description":"Prepare the evidence-based project proposal and submit it to the Department of Commerce through the current official process.","url":"https://apps.commerce.gov.in/schemes/schemereport"}],
        "window_type":"closed",
        "window_label":"The MAI 2021 continuation ran through 31 March 2026. It is retained for historical and claims context; no new 2026-27 application window is asserted, and the Department of Commerce describes MAI as consolidated into the Export Promotion Mission.",
        "closes_at":"2026-03-31",
        "window_evidence":{"source_url":"https://www.commerce.gov.in/ministryofcommerce/sites/default/files/2026-04/Annual_0.pdf","anchor":"MAI Scheme 2021 continuation through 31 March 2026 and consolidation into the Export Promotion Mission"}
      },
      {
        "slug":"remission-of-duties-and-taxes-on-exported-products-rodtep",
        "name":"Remission of Duties and Taxes on Exported Products (RoDTEP)",
        "type":"tax_benefit",
        "authority":"Department of Commerce - RoDTEP",
        "authority_url":"https://www.commerce.gov.in/",
        "canonical_url":"https://www.commerce.gov.in/ministryofcommerce/node/856",
        "source_url":"https://www.commerce.gov.in/ministryofcommerce/node/856",
        "source_kind":"ministry_portal",
        "source_title":"RoDTEP scheme overview and rates announcement",
        "source_anchor":"Eligibility framing, notified rates, value caps and e-scrip mechanism",
        "summary":"Export duty and tax remission through notified tariff-line rates and electronic transferable duty-credit scrips, subject to current rules and caps.",
        "objective":"Refund eligible duties, taxes and levies borne on exported products where those amounts have not otherwise been exempted, remitted or credited.",
        "legal_basis":"Remission of Duties and Taxes on Exported Products scheme and applicable Foreign Trade Policy/DGFT notifications",
        "eligibility":{"entity_types":["exporter","manufacturer_exporter","merchant_exporter","msme_exporter","startup_exporter"],"industries":["marine","agriculture","leather","gems_and_jewellery","automobile","plastics","electronics","machinery"],"conditions":["export product and tariff line must be covered by the current notified rates","rebate is not available for duties or taxes already exempted, remitted or credited","shipping, customs and DGFT documentation conditions apply"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.dgft.gov.in/","route":"claim through the current Customs/DGFT export documentation and electronic-scrip process","mechanism":"transferable electronic duty-credit scrip in an electronic ledger","current_route_boundary":"Notification 74/2025-26 continues RoDTEP for eligible exports from 1 April through 30 September 2026 at rates and value caps in force on 31 March 2026, subject to existing terms."},
        "fine_print":{"rate_is_not_universal":true,"rate_basis":"notified percentage of FOB value subject to product-specific value cap per unit","covered_tariff_lines_must_be_verified":true,"benefit_is_not_a_cash_grant":true,"current_rodtep_facts":{"official_sources_checked":"2026-09-07","continuation_notification":"https://content.dgft.gov.in/Website/dgftprod/1322d65e-dd25-46ec-a7e9-7b0a3f9765f2/RoDTEP%20Notification.pdf","eligible_export_period":"2026-04-01 to 2026-09-30","rate_boundary":"Rates and value caps in force on 31 March 2026 continue during the notified six-month period.","current_availability":"Current for eligible exports through 30 September 2026; product tariff line, cap, exporter category, customs documentation and no-double-benefit conditions still require verification."},"current_source_reconciliation":"DGFT Notification 74/2025-26 dated 31 March 2026 was checked on 7 September 2026 and establishes the current six-month continuation. The current rate schedule remains tariff-line-specific and is not represented as a universal percentage.","review_note":"Confirm the current tariff-line schedule, caps, exclusions, export-document linkage, e-scrip ledger operation and any further extension or amendment before publication."},
        "benefit_summary":{"types":["tax_benefit","duty_remission"],"summary":"Product-specific remission through electronic duty-credit scrips at notified rates and caps; no universal percentage or guaranteed amount should be shown without the current tariff-line lookup."},
        "benefit_type":"duty_remission",
        "benefit_label":"Export duty and tax remission",
        "benefit_conditions":{"current_tariff_line_rate_required":true,"customs_documentation_required":true,"no_double_benefit":true},
        "requirement":"Eligible export and current tariff-line notification",
        "requirement_description":"The exporter must complete the applicable customs and DGFT process and verify that the exported product, tariff line and taxes fit the current RoDTEP rules.",
        "rules":{"all":[{"field":"export_transaction_identified","operator":"equals","value":true},{"field":"current_rodtep_tariff_line_covered","operator":"equals","value":true},{"field":"same_duty_or_tax_not_already_remitted","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Check the current tariff-line schedule","description":"Verify the product classification, notified RoDTEP rate, cap and exclusions in the current official schedule.","url":"https://www.commerce.gov.in/ministryofcommerce/node/856"},{"title":"Complete the export claim route","description":"Use the current Customs/DGFT documentation and electronic-scrip process and retain the shipping and tax evidence.","url":"https://www.dgft.gov.in/"}],
        "window_type":"rolling",
        "window_label":"Eligible exports are covered through 30 September 2026 under DGFT Notification 74/2025-26; tariff-line rates, caps and claim mechanics require verification.",
        "closes_at":"2026-09-30",
        "window_evidence":{"source_url":"https://content.dgft.gov.in/Website/dgftprod/1322d65e-dd25-46ec-a7e9-7b0a3f9765f2/RoDTEP%20Notification.pdf","anchor":"Continuation from 1 April to 30 September 2026 and rates/caps in force on 31 March 2026"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, official_url)
    select item->>'authority', 'central', 'Ministry of Commerce and Industry', item->>'authority_url'
    where not exists (
      select 1 from public.authorities existing_authority
      where existing_authority.name = item->>'authority'
    )
    returning id into authority_id;
    if authority_id is null then
      select id into authority_id from public.authorities where name = item->>'authority' limit 1;
    end if;

    seed_opportunity_id := null;
    insert into public.opportunities
      (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (
      item->>'slug', item->>'name', item->>'type', coalesce(item->>'lifecycle_status', 'in_review'), authority_id,
      '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url'
    )
    on conflict (slug) do update set
      name = excluded.name,
      authority_id = excluded.authority_id,
      canonical_url = excluded.canonical_url,
      status = excluded.status
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then
      select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1;
    end if;

    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis,
       eligibility, application, fine_print, benefit_summary,
       last_verified_at, completeness, confidence, review_status)
    values (
      seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis',
      item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary',
      now(), 0.82, 0.80, 'in_review'
    )
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov
      where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities
       set current_version_id = version_id,
           status = coalesce(item->>'lifecycle_status', 'in_review')
     where id = seed_opportunity_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (
      select 1 from public.opportunity_sources os
      where os.opportunity_version_id = version_id and os.source_url = item->>'source_url'
    );

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, alternate_url, alternate_kind, alternate_title, alternate_anchor, now(), false
    from (
      values
        ('https://www.commerce.gov.in/wp-content/uploads/2026/02/USQ-1516-PDF.pdf'::text, 'policy_update'::text, 'Export Promotion Mission policy update'::text, 'Niryat Protsahan, Niryat Disha and Credit Guarantee Scheme for Exporters'::text),
        ('https://www.commerce.gov.in/ministryofcommerce/sites/default/files/2026-04/Annual_0.pdf'::text, 'annual_report'::text, 'Department of Commerce Annual Report 2025-26'::text, 'MAI continuation and consolidation into EPM'::text),
        ('https://commerce.gov.in/wp-content/uploads/2020/08/MOC_636546562282394611_Market_Access_Initiative-_Scheme_2018.pdf'::text, 'guideline'::text, 'Market Access Initiative Scheme 2018 historical guideline'::text, 'Historical scope, eligible agencies and components'::text)
    ) as alternates(alternate_url, alternate_kind, alternate_title, alternate_anchor)
    where item->>'slug' in ('export-promotion-mission-niryat-protsahan-niryat-disha', 'market-access-initiative-mai')
      and not exists (
        select 1 from public.opportunity_sources os
        where os.opportunity_version_id = version_id and os.source_url = alternate_url
      );

    insert into public.opportunity_benefits
      (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select
      version_id, item->>'benefit_type', item->>'benefit_label',
      case when item ? 'amount_max' then (item->>'amount_max')::numeric else null end,
      case when item ? 'percentage' then (item->>'percentage')::numeric else null end,
      item->'benefit_conditions'
    where not exists (
      select 1 from public.opportunity_benefits ob
      where ob.opportunity_version_id = version_id and ob.label = item->>'benefit_label'
    );

    insert into public.opportunity_requirements
      (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'other', item->>'requirement', item->>'requirement_description', true
    where not exists (
      select 1 from public.opportunity_requirements oq
      where oq.opportunity_version_id = version_id and oq.name = item->>'requirement'
    );

    insert into public.eligibility_rule_sets
      (opportunity_version_id, rules, source_evidence, reviewed)
    select version_id, item->'rules', jsonb_build_array(jsonb_build_object('source_url', item->>'source_url', 'anchor', item->>'source_anchor')), false
    where not exists (
      select 1 from public.eligibility_rule_sets er
      where er.opportunity_version_id = version_id
    );

    insert into public.opportunity_steps
      (opportunity_version_id, step_number, title, description, official_url)
    select version_id, step_number, step->>'title', step->>'description', step->>'url'
    from (
      select (row_number() over ())::integer as step_number, step
      from jsonb_array_elements(item->'steps') as steps(step)
    ) numbered_steps
    where not exists (
      select 1 from public.opportunity_steps os
      where os.opportunity_version_id = version_id
        and os.step_number = numbered_steps.step_number
    );

    insert into public.opportunity_windows
      (opportunity_version_id, window_type, label, opens_at, closes_at, source_evidence)
    select
      version_id, item->>'window_type', item->>'window_label',
      case when item ? 'opens_at' then (item->>'opens_at')::date else null end,
      case when item ? 'closes_at' then (item->>'closes_at')::date else null end,
      item->'window_evidence'
    where not exists (
      select 1 from public.opportunity_windows ow
      where ow.opportunity_version_id = version_id
    );

    insert into public.review_tasks (opportunity_version_id, task_type, status)
    select version_id, 'publish', 'open'
    where not exists (
      select 1 from public.review_tasks rt
      where rt.opportunity_version_id = version_id
        and rt.task_type = 'publish'
        and rt.status in ('open', 'in_review')
    );
  end loop;
end $$;
