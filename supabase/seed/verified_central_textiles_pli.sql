-- PLI Scheme for Textiles. New applicants and existing selected participants
-- are modelled separately because the current portal and amendments expose
-- different routes. PLI percentages are not a guaranteed cash value and must
-- never be calculated without eligible turnover, notified-product and claim
-- conditions.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Ministry of Textiles PLI Textiles operational guidelines', 'https://pli.texmin.gov.in/frontend/images/Documents/Approved%20Guidelines%20for%20PLI%20scheme%20for%20Textiles.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official operational guidelines for MMF apparel, MMF fabrics and technical textiles, including investment, turnover, incentive rates, products, claims and audit requirements.'),
  ('PLI Textiles October 2025 amendment and product addition', 'https://pli.texmin.gov.in/frontend/images/Documents/Amendment%20%26%20Addition-PLI%20for%20Textiles%20-%20Noti%20dt%2009.10.2025.pdf', 'gazette', 'central', 'weekly', 1, true, 'Official Ministry of Textiles notification adding products and changing later-round investment, project-unit, turnover and existing-applicant conditions.'),
  ('PLI Textiles official scheme notifications and guidelines index', 'https://pli.texmin.gov.in/Scheme-Notifications', 'agency_portal', 'central', 'weekly', 1, true, 'Official PLI Textiles index listing amendments through December 2025, application extensions, approved applicants and current operational notices.'),
  ('PLI Textiles official applicants list', 'https://pli.texmin.gov.in/Applicants_list', 'agency_portal', 'central', 'weekly', 1, true, 'Official PLI Textiles participant/applicant list used to verify the restricted existing-participant route; it is not itself proof of eligibility.'),
  ('PLI Textiles official portal', 'https://pli.texmin.gov.in/', 'agency_portal', 'central', 'daily', 1, true, 'Official Ministry of Textiles PLI portal. Current application route, selected-participant access and open-house notices must be rechecked before publication.')
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
        "slug":"production-linked-incentive-textiles-new-applicants",
        "name":"Production Linked Incentive (PLI) Scheme for Textiles - New Applicant Track",
        "type":"production_linked_incentive",
        "authority":"Ministry of Textiles - PLI Textiles",
        "authority_url":"https://pli.texmin.gov.in/",
        "canonical_url":"https://pli.texmin.gov.in/",
        "source_url":"https://pli.texmin.gov.in/frontend/images/Documents/Approved%20Guidelines%20for%20PLI%20scheme%20for%20Textiles.pdf",
        "source_kind":"guideline",
        "source_title":"Operational Guidelines for PLI Scheme for Textiles",
        "source_anchor":"Sections 3-6, 7, 16-17 and Table 2; pages 4-6, 7-8 and 13-14, read with later amendments",
        "summary":"A production-linked incentive for eligible manufacturers of notified MMF apparel, MMF fabrics and technical-textile products, with high investment and turnover thresholds and a five-year incentive schedule.",
        "objective":"Promote scale, competitiveness, employment and production of notified MMF apparel, MMF fabrics and technical-textile products manufactured in India.",
        "legal_basis":"PLI Scheme for Textiles notified by the Ministry of Textiles on 24 September 2021 under Notification No. 12015/03/2020-IT, with subsequent official notifications and operational-guideline amendments.",
        "eligibility":{"entity_types":["company","firm","llp","trust","manufacturing_company"],"lifecycle_stages":["growth","scaling","manufacturing_expansion"],"industries":["mmf_apparel","mmf_fabrics","technical_textiles"],"locations":["India"],"conditions":["applicant manufactures products in the notified product lists and maintains the required product and accounting evidence","for subsequent rounds, the applicant satisfies the applicable amended minimum plan investment threshold: INR 150 crore for Part I or INR 50 crore for Part II, excluding land and administrative-building cost","the project or separate project unit satisfies the applicable company, distinct-books, investment, turnover and GST invoice conditions","the participant achieves the prescribed threshold turnover and applicable incremental-turnover condition in the performance year","only notified products manufactured by the registered participant and invoiced with the relevant 8-digit HS code are counted"],"exclusions":["trading, job work, non-notified products, captive consumption or related transactions that do not satisfy the applicable rules","turnover or investment presented as a guarantee of incentive payment","claims that use the original 2021 thresholds without reconciling subsequent amendments","new applications after the latest verified application deadline or outside the notified portal route","land and administrative-building cost counted as eligible plan investment"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://pli.texmin.gov.in/","route":"The new-applicant route is through the Ministry of Textiles PLI portal in the notified application window; selected participants submit claims and prescribed evidence through the portal and PMA route.","applicant_note":"UdyamVeda can prepare an investment, product, HS-code, turnover, auditor-certificate and claim checklist, but cannot submit the PLI application or claim on behalf of the applicant.","window_note":"The Ministry index records an extension of new applications through 31 March 2026; current new-applicant availability must be confirmed before any application action is offered."},
        "fine_print":{"track":"new applicant; existing selected participants have a separate amendment/added-product route","current_entry_thresholds":{"part_1_minimum_plan_investment_inr":1500000000,"part_2_minimum_plan_investment_inr":500000000,"note":"The October 2025 amendment states these minimum thresholds for subsequent rounds; verify the latest December 2025 operational amendment before publication."},"original_guideline_reference":{"part_1_minimum_investment_inr":3000000000,"part_1_first_performance_turnover_inr":6000000000,"part_2_minimum_investment_inr":1000000000,"part_2_first_performance_turnover_inr":2000000000},"incentive_schedule":{"part_1_rates_percent_by_year":[15,14,13,12,11],"part_2_rates_percent_by_year":[11,10,9,8,7],"part_1_threshold_turnover_crore_by_year":[600,750,937.5,1171.87,1464.84],"part_2_threshold_turnover_crore_by_year":[200,250,312.5,390.63,488.2]},"incremental_turnover":"The 2021 guideline states 25% incremental turnover from Year 2; the October 2025 amendment reduces the requirement to 10% from the second performance year for the amended route. Reconcile the latest operational amendments before calculating eligibility.","duration":"Scheme operation is stated through 31 March 2030, with incentive payable for five performance years, subject to the applicable entry and claim conditions.","eligible_sales":"Only notified products manufactured by the participant and supported by the prescribed GST invoice/8-digit HS-code evidence count; trading and job work do not count.","audit_and_claims":"Auditor certificates, audited accounts, tax/ITC and product records, inventory/consumption registers and other prescribed evidence are required.","window_note":"The official notifications index records new-application extensions through 31 March 2026. Because the current date is after that deadline, this track must remain closed or more-information-required unless a newer official window is verified.","review_note":"Reconcile the 17 October 2025 and 26 December 2025 operational amendments, the latest product lists/corrigendum, current applicant window, project-unit rule, turnover revision, PMA route, claim forms, eligible costs, audit, clawback and grievance conditions before approval."},
        "benefit_summary":{"types":["subsidy"],"summary":"Production-linked incentive calculated as a prescribed percentage of eligible net incremental sales of notified products, with separate Part I and Part II rates and no fixed applicant entitlement.","separate_value_buckets":true},
        "benefit_type":"subsidy",
        "benefit_label":"PLI Textiles production incentive - prescribed percentage of eligible sales",
        "benefit_conditions":{"part_1_rate_percent_by_year":[15,14,13,12,11],"part_2_rate_percent_by_year":[11,10,9,8,7],"eligible_turnover_and_incremental_turnover_required":true,"notified_products_only":true,"auditor_certificate_required":true,"no_guaranteed_amount":true},
        "requirement":"Notified-product manufacturing investment and turnover evidence",
        "requirement_description":"The applicant must establish the applicable amended investment threshold, notified-product plan, separate project/accounting evidence, threshold and incremental turnover, GST HS-code alignment, statutory-auditor certifications and prescribed claim records.",
        "rules":{"all":[{"field":"manufactures_notified_textile_products","operator":"equals","value":true},{"field":"pli_textiles_investment_threshold_met","operator":"equals","value":true},{"field":"pli_textiles_turnover_threshold_met","operator":"equals","value":true},{"field":"notified_product_gst_hsn_evidence_ready","operator":"equals","value":true},{"field":"statutory_auditor_certificate_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Check the latest PLI Textiles window and amendments","description":"Review the Ministry notifications index, latest amendment and portal notices before deciding whether a new application is open.","url":"https://pli.texmin.gov.in/Scheme-Notifications"},{"title":"Select Part I or Part II and verify investment","description":"Confirm the applicable amended plan-investment threshold and the separate project/company or project-unit requirements.","url":"https://pli.texmin.gov.in/frontend/images/Documents/Amendment%20%26%20Addition-PLI%20for%20Textiles%20-%20Noti%20dt%2009.10.2025.pdf"},{"title":"Validate products and HS codes","description":"Map the proposed MMF apparel, MMF fabric or technical-textile products to the current notified list and preserve 8-digit HS-code/GST invoice evidence.","url":"https://pli.texmin.gov.in/frontend/images/Documents/Approved%20Guidelines%20for%20PLI%20scheme%20for%20Textiles.pdf"},{"title":"Prepare investment, turnover and audit evidence","description":"Prepare project, investment, production, turnover, tax, accounting, inventory and auditor-certificate records required by the current claim route.","url":"https://pli.texmin.gov.in/"},{"title":"Use the official Ministry portal","description":"Submit only during a verified official window and retain the application, approval, claim, payment and grievance records.","url":"https://pli.texmin.gov.in/"}],
        "window_type":"closed",
        "window_label":"New-applicant deadline was recorded by the official Ministry index as extended through 31 March 2026; no later new-applicant window is verified in this record.",
        "window_evidence":{"source_url":"https://pli.texmin.gov.in/Scheme-Notifications","anchor":"Press-release entry: Government extends the last date for submitting new applications up to 31st March 2026, listed 2 January 2026"}
      },
      {
        "slug":"production-linked-incentive-textiles-existing-participants-added-products",
        "name":"Production Linked Incentive (PLI) Scheme for Textiles - Existing Participant Added-Product Track",
        "type":"production_linked_incentive",
        "authority":"Ministry of Textiles - PLI Textiles",
        "authority_url":"https://pli.texmin.gov.in/",
        "canonical_url":"https://pli.texmin.gov.in/",
        "source_url":"https://pli.texmin.gov.in/frontend/images/Documents/Amendment%20%26%20Addition-PLI%20for%20Textiles%20-%20Noti%20dt%2009.10.2025.pdf",
        "source_kind":"gazette",
        "source_title":"PLI Textiles Amendments and Addition in the Scheme",
        "source_anchor":"Sections 2.1-2.3 and 3.3-4.1; amendment pages 12-14, read with current portal notices",
        "summary":"A restricted amendment route for existing PLI Textiles applicants or selected participants seeking to use added MMF apparel/fabric product codes or fresh qualifying investment under the amended scheme.",
        "objective":"Address implementation hardship for existing PLI Textiles participants while extending eligible notified products and prospective production support within the fixed scheme outlay and duration.",
        "legal_basis":"Official Ministry of Textiles amendments to the PLI Textiles notification and operational guidelines, including the 9 October 2025 product and participant amendment.",
        "eligibility":{"entity_types":["existing_pli_textiles_applicant","selected_pli_textiles_participant","manufacturing_company"],"lifecycle_stages":["operating","growth","manufacturing_expansion"],"industries":["mmf_apparel","mmf_fabrics","technical_textiles"],"locations":["India"],"conditions":["applicant is an existing PLI Textiles applicant or selected participant in the applicable round","fresh investment meets at least 15% of the prescribed minimum threshold where the additional existing-applicant provision applies","the proposed products are within the current amended notified HSN-code lists and GST invoice descriptions correspond to the applicable 8-digit codes","the project unit or separate accounting records satisfy the applicable amended conditions","the current portal confirms the additional application route and accepts the filing"],"exclusions":["new applicants without the existing-applicant or participant status required by the route","added products or HSN codes not in the current notified annexures","an assumption that the existence of a participant approval automatically approves new products, investment or claims","a claim that treats the scheme outlay or projected turnover as the applicant's benefit","applications made outside the currently notified portal route or window"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://pli.texmin.gov.in/","route":"Use the official portal's existing-participant/additional-product route only after the applicant status, current HSN list, fresh investment and window are confirmed.","applicant_note":"UdyamVeda can prepare the participant-status, product-code, investment, turnover and audit checklist but cannot submit or certify the PLI claim.","window_note":"The portal currently advertises an added-product route for existing Round 1 and Round 2 companies, but this record does not infer an open deadline without a dated official notice."},
        "fine_print":{"track":"existing Round 1/2 applicants or selected participants; not a general new-company application","added_products":"The October 2025 notification adds MMF apparel and fabric products identified through the notified annexures and requires GST invoice descriptions to correspond to the relevant 8-digit HS codes.","fresh_investment":"The amendment describes an additional application window for existing applicants with fresh investment of at least 15% of the applicable prescribed minimum threshold, with incentives for current-year and prospective production subject to availability and conditions.","project_unit":"The amendment replaces the earlier separate-company condition for applicants with a separate project unit under the existing company and distinct books of account for the amended route; confirm the latest operational wording.","fixed_outlay_and_duration":"The amendment states that total fund outgo and scheme duration remain fixed; an entry extension provision is subject to availability of funds and the stated scheme-period limits.","review_note":"Confirm selected-participant status, exact current portal form, added HSN codes, 15% calculation base, current-year/prospective treatment, latest December 2025 amendment, claim schedule, audit and grievance conditions before approval."},
        "benefit_summary":{"types":["subsidy"],"summary":"Potential continuation or additional production-linked incentive for an existing participant's qualifying notified products and fresh investment; amount depends on eligible production, turnover, rates and current amendment conditions.","separate_value_buckets":true},
        "benefit_type":"subsidy",
        "benefit_label":"PLI Textiles existing-participant added-product incentive",
        "benefit_conditions":{"existing_participant_required":true,"fresh_investment_minimum_percent_of_threshold":15,"notified_hsn_codes_only":true,"current_portal_confirmation_required":true,"no_guaranteed_amount":true},
        "requirement":"Existing participant and amended product-route evidence",
        "requirement_description":"The applicant must show the applicable PLI Textiles participant status, fresh investment, current notified HSN/product mapping, separate project or accounting records, turnover and auditor evidence, and an accepted official portal route.",
        "rules":{"all":[{"field":"existing_pli_textiles_participant","operator":"equals","value":true},{"field":"additional_product_or_fresh_investment_route_available","operator":"equals","value":true},{"field":"current_notified_hsn_code_match","operator":"equals","value":true},{"field":"fresh_investment_threshold_met","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Verify existing participant status","description":"Confirm the Round 1/2 application or participant status and the exact route made available by the current PLI portal.","url":"https://pli.texmin.gov.in/Applicants_list"},{"title":"Map the added product and HSN code","description":"Check the current amendment annexures and align GST invoice descriptions to the relevant 8-digit notified HSN codes.","url":"https://pli.texmin.gov.in/frontend/images/Documents/Amendment%20%26%20Addition-PLI%20for%20Textiles%20-%20Noti%20dt%2009.10.2025.pdf"},{"title":"Validate fresh investment and project records","description":"Calculate the applicable 15% fresh-investment condition and maintain distinct project, investment and accounting evidence.","url":"https://pli.texmin.gov.in/frontend/images/Documents/Approved%20Guidelines%20for%20PLI%20scheme%20for%20Textiles.pdf"},{"title":"Confirm the live application route","description":"Check the current portal notice, deadline and PMA instructions; do not infer an open call from the existence of a portal page alone.","url":"https://pli.texmin.gov.in/Scheme-Notifications"}],
        "window_type":"call_for_applications",
        "window_label":"The official portal advertises an added-product route for existing Round 1 and Round 2 companies; deadline and operational availability require current reviewer confirmation.",
        "window_evidence":{"source_url":"https://pli.texmin.gov.in/","anchor":"Current portal notice for existing PLI companies selected in Round 1 and 2 and 17 added HSN codes; no dated closing window captured"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Textiles', 'PLI Textiles', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.87, 0.84, 'in_review')
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
    select version_id, 'https://pli.texmin.gov.in/Scheme-Notifications', 'agency', 'PLI Textiles notifications and guidelines index', 'Amendment, application-window and selected-participant notice index', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://pli.texmin.gov.in/Scheme-Notifications');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://pli.texmin.gov.in/', 'agency', 'PLI Textiles official portal', 'Current route and portal notice', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://pli.texmin.gov.in/');
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
