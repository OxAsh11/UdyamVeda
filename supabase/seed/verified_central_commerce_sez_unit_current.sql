-- Review-gated SEZ unit route. Historical income-tax concessions are not
-- represented as current benefits without current legal confirmation.

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
        "slug":"commerce-special-economic-zone-unit-approval-and-authorized-operations",
        "name":"Special Economic Zone Unit Approval and Authorized-Operations Benefits",
        "type":"tax_benefit",
        "authority":"Department of Commerce - Special Economic Zones",
        "authority_url":"https://sezindia.gov.in/",
        "canonical_url":"https://sezindia.gov.in/facilities-and-incentives",
        "source_url":"https://sezindia.gov.in/facilities-and-incentives",
        "source_kind":"ministry",
        "source_title":"SEZ Facilities and Incentives",
        "source_anchor":"Unit facilities, duty-free import/domestic procurement, zero-rated supplies and single-window clearance; Section 10AA sunset note",
        "summary":"A regulatory and trade-access route for an approved unit operating in a Special Economic Zone, with duty treatment for authorized operations and export-oriented operating facilities subject to positive NFE, customs, GST and SEZ compliance.",
        "objective":"Promote additional economic activity, exports, investment and employment through approved SEZ units and authorized operations.",
        "legal_basis":"Special Economic Zones Act, 2005; SEZ Rules, 2006 as amended; applicable IGST, customs, foreign-trade and current Department of Commerce instructions.",
        "eligibility":{"entity_types":["company","limited_liability_partnership","partnership","proprietorship","service_provider","manufacturer","trading_unit","bonded_warehouse_unit"],"lifecycle_stages":["new_business","scaling","exporting","operating"],"industries":["manufacturing","services","trading","information_technology","electronics","engineering","textiles","gems_and_jewellery","export"],"locations":["India - notified Special Economic Zone"],"conditions":["the applicant must propose an authorized operation in an available/notified SEZ","the unit must obtain the applicable Development Commissioner/Approval Committee approval and Letter of Approval","the unit must achieve positive Net Foreign Exchange cumulatively over the prescribed five-year period from commencement of production","duty-free imports/domestic procurement apply to authorized operations and require current customs/SEZ documentation","supplies to SEZ units or developers require the current zero-rated IGST route and supporting evidence","state-level approvals, levies, land/lease terms and sector restrictions remain separately applicable"],"thresholds":{"positive_nfe_calculation_period_years":5,"income_tax_section_10aa_current_status":"sunset_for_new_units_from_2020; do_not_present_as_current_benefit_without_legal_confirmation"},"unknown_handling":"needs_information"},
        "exclusions":["presenting the historical Section 10AA income-tax exemption as a current automatic benefit for new units","assuming a location outside an SEZ can use unit-level SEZ facilities without an approved SEZ route","treating duty-free import or domestic procurement as available for non-authorized operations or personal use","ignoring positive NFE, customs records, bond/LUT, reporting, installation, authorized-operation and domestic-sale conditions","assuming state levies, local approvals, land/lease terms or sector licences are waived","treating a SEZ unit approval as a cash grant, loan, subsidy or guaranteed tax refund"],
        "application":{"portal":"https://sezonline-ndml.co.in/","route":"Select a suitable notified SEZ, prepare the new-unit proposal and submit it through SEZ Online to the concerned Development Commissioner/Approval Committee; obtain and retain the Letter of Approval before representing the unit as approved.","selection":"Development Commissioner and applicable Approval Committee review under the SEZ Act/Rules and current Department of Commerce instructions.","fees":"Confirm current SEZ Online user charges, registration fees and any Development Commissioner charges in the live portal.","applicant_note":"UdyamVeda can prepare the proposal, document and readiness checklist but must not store credentials, submit as the applicant, or represent itself as the Development Commissioner or SEZ Online operator."},
        "fine_print":{"current_facilities":"The official facilities page describes duty-free import/domestic procurement for SEZ units and zero-rated supplies under IGST, subject to the current legal and documentary route; it also describes single-window clearance, which does not erase every central, state or local approval.","positive_nfe":"The official FAQ and Rules describe positive Net Foreign Exchange calculated cumulatively over five years from commencement of production; the detailed formula and eligible supplies/exports must be checked against the current Rules.","domestic_sales":"Domestic Tariff Area sales are subject to full customs duty and import-policy conditions rather than the unit's export-side treatment.","tax_boundary":"Section 10AA income-tax concessions and older MAT/CST/service-tax descriptions on legacy pages contain sunset or withdrawn benefits; they are not included as current entitlement in this record.","amendment_boundary":"SEZ Rules and the Department of Commerce instructions change over time, including 2026 system and procedural notices; current amendments, authorized operations, user charges and forms must be checked before recommending.","documents":"The official SEZ Online new-unit help identifies general, director, infrastructure, item, investment, foreign-collaboration, equity, foreign-exchange, subcontracting, applicant, marketing, supporting-document, checklist and LOA sections; the exact current attachments and format limits require live review.","review_note":"Human review must confirm the available SEZ, authorized activity, entity/IEC/PAN details, positive-NFE plan, customs/GST treatment, current forms, BOA/DC route, user charges, state/local dependencies, current amendments and whether the applicant is seeking a unit route rather than a developer route."},
        "benefit_summary":{"types":["tax_benefit","market_access","compliance_support"],"summary":"Potential duty-free authorized-operation procurement/import treatment, zero-rated SEZ supplies and single-window operating facilities for an approved SEZ unit; no current income-tax holiday or cash entitlement is inferred.","separate_value_buckets":true},
        "benefit_type":"tax",
        "benefit_label":"SEZ authorized-operation duty treatment and zero-rated supply route",
        "benefit_conditions":{"approved_sez_unit_required":true,"authorized_operations_only":true,"positive_nfe_required":true,"current_customs_and_igst_route_required":true,"historical_income_tax_benefit_excluded":true},
        "requirement":"Approved SEZ unit proposal with a positive-NFE and authorized-operation plan",
        "requirement_description":"Prepare the unit proposal, IEC/PAN/entity details, SEZ selection, authorized activity, investment and infrastructure plan, item and export details, foreign-exchange plan, director/equity information, supporting documents and applicable lease/LOA evidence.",
        "rules":{"all":[{"field":"applicant_proposes_authorized_operation_in_notified_sez","operator":"equals","value":true},{"field":"entity_and_iec_pan_details_ready","operator":"equals","value":true},{"field":"positive_nfe_plan_feasible","operator":"equals","value":true},{"field":"current_sez_rules_and_igst_customs_route_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Select the SEZ and authorized activity","description":"Confirm the proposed manufacturing, service, trading or bonded-warehouse activity, available space, sector permissions and the concerned Development Commissioner.","url":"https://sezindia.gov.in/"},{"title":"Prepare the new-unit proposal","description":"Complete the SEZ Online sections for entity, directors, infrastructure, items, investment, foreign exchange, subcontracting, marketing and supporting documents.","url":"https://sezonline-ndml.co.in/Help/NUA/NUAMain.html"},{"title":"Submit to the Development Commissioner","description":"Use the official SEZ Online new-unit route, respond to review requests and retain the application reference and Letter of Approval.","url":"https://sezonline-ndml.co.in/"},{"title":"Operate with SEZ records and positive NFE","description":"Use facilities only for authorized operations, maintain customs/GST/SEZ records, monitor positive NFE and complete continuing reporting and approvals.","url":"https://sezindia.gov.in/index.php/FAQ"}],
        "window_type":"rolling",
        "window_label":"No universal closing date is stated; new-unit proposals follow the current SEZ Online, Development Commissioner and Approval Committee route. Confirm current portal availability and charges before recommendation.",
        "window_evidence":{"source_url":"https://sezonline-ndml.co.in/Help/NUA/NUAMain.html","anchor":"New Unit Application help: proposal to the concerned Development Commissioner and required application sections"},
        "review_note":"Keep review-gated. Never display historical Section 10AA claims as a current tax benefit, and never describe SEZ facilities as an unconditional subsidy or approval."
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.89, 0.84, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1; end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true),
      (version_id, 'https://sezindia.gov.in/index.php/FAQ', 'ministry', 'Department of Commerce SEZ FAQ', 'Unit features, positive NFE, domestic sales and duty-free operating context', now(), false),
      (version_id, 'https://www.commerce.gov.in/wp-content/uploads/2021/06/SEZAct2005.pdf', 'gazette', 'Special Economic Zones Act 2005', 'Section 26 exemptions and concessions for developers and entrepreneurs', now(), false),
      (version_id, 'https://www.sezindia.gov.in/sez-rules-and-amendments', 'ministry', 'SEZ Rules and amendments index', 'Current 2026/2025 amendment list', now(), false),
      (version_id, 'https://www.sezindia.gov.in/index.php/instructions', 'ministry', 'Department of Commerce SEZ instructions', 'Current operating instructions and user-charge notices', now(), false),
      (version_id, 'https://sezonline-ndml.co.in/', 'agency', 'SEZ Online official application portal', 'New-unit application, LOA and unit workflow handoff', now(), false),
      (version_id, 'https://sezonline-ndml.co.in/Help/NUA/NUAMain.html', 'agency', 'SEZ Online new-unit application help', 'Development Commissioner route and application sections', now(), false)
    on conflict do nothing;
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', (item->>'amount_max')::numeric, (item->>'percentage')::numeric, item->'benefit_conditions'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = item->>'benefit_label');
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'regulatory', item->>'requirement', item->>'requirement_description', true
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
