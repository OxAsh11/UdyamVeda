-- Additional Central Government records discovered from official Ministry pages
-- and guidelines. These records intentionally remain in_review until a human
-- reviewer confirms current operation, source anchors, amendments, windows,
-- and the complete application fine print.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('MoFPI PMFME scheme guidelines', 'https://www.pmfme.mofpi.gov.in/newsletters/docs/SchemeGuidelines.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official guideline for PMFME individual and group components; current window and amendments require review.'),
  ('MoFPI PMFME official portal', 'https://pmfme.mofpi.gov.in/', 'ministry_portal', 'central', 'weekly', 2, true, 'Official discovery and implementation portal for PMFME.'),
  ('MSME Samadhaan official RAMP page', 'https://ramp.msme.gov.in/ramp/RAMP-initiative/msme-samadhaan/msme-samadhaan', 'ministry_portal', 'central', 'weekly', 2, true, 'Official Ministry of MSME description of delayed-payment assistance and MSEFC route.'),
  ('MSME Samadhaan application portal', 'https://samadhaan.msme.gov.in/', 'implementing_portal', 'central', 'weekly', 2, true, 'Official application handoff; portal operation and current filing requirements require review.'),
  ('MSME Online Dispute Resolution portal', 'https://odr.msme.gov.in/', 'implementing_portal', 'central', 'weekly', 1, true, 'Official MSME ODR portal for digital dispute avoidance, containment and resolution; current delayed-payment route must be verified at handoff.'),
  ('MSME ODR claimant seller route', 'https://odr.msme.gov.in/seller/', 'implementing_portal', 'central', 'weekly', 1, true, 'Official claimant/seller entry point for the current MSME ODR route.'),
  ('MSME Annual Report 2025-26 delayed-payment update', 'https://msme.gov.in/sites/default/files/MSMEANNUALREPORT2025-26ENGLISH_0.pdf', 'ministry', 'central', 'monthly', 1, true, 'Official Ministry annual report recording the post-15 October 2025 ODR route and its integration with Samadhaan.')
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
        "slug":"pm-formalisation-micro-food-processing-enterprises",
        "name":"Pradhan Mantri Formalisation of Micro Food Processing Enterprises (PMFME)",
        "type":"subsidy",
        "authority":"Ministry of Food Processing Industries - PMFME",
        "authority_url":"https://pmfme.mofpi.gov.in/",
        "canonical_url":"https://pmfme.mofpi.gov.in/",
        "source_url":"https://www.pmfme.mofpi.gov.in/newsletters/docs/SchemeGuidelines.pdf",
        "source_kind":"guideline",
        "source_title":"PMFME Scheme Guidelines",
        "source_anchor":"Support to Individual Micro Enterprises, sections 4.1-4.2",
        "summary":"Financial, technical and business support for formalisation and upgradation of eligible micro food processing enterprises.",
        "objective":"Improve the competitiveness of micro food processing enterprises and support formalisation of the unorganised food-processing sector through credit, technical and business support.",
        "legal_basis":"PMFME Scheme Guidelines issued by the Ministry of Food Processing Industries.",
        "eligibility":{"entity_types":["micro_enterprise","proprietorship","partnership"],"lifecycle_stages":["operating","formalisation","growth"],"industries":["food_processing"],"locations":["India"],"conditions":["existing unit in operation for the individual route","unincorporated enterprise","fewer than 10 workers","applicant owns the enterprise","applicant is above 18 years and at least VIII-standard pass","unit should preferably be engaged in the district ODOP product","new-unit support is restricted to ODOP products under the guideline route"],"thresholds":{"employees_max_exclusive":10,"beneficiary_contribution_min_percent":10},"beneficiary_contribution_min_percent":10,"exclusions":["group, SHG, FPO and common-infrastructure components have separate conditions and must not be merged with the individual-unit rule set","land cost is excluded from project cost","only one person from one family may receive financial assistance under the individual route"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://pmfme.mofpi.gov.in/","route":"Follow the State and district implementation route; exact current application route requires reviewer confirmation.","support":"Credit-linked bank finance with scheme subsidy.","applicant_note":"UdyamVeda can prepare the project, contribution and bank-appraisal checklist but cannot promise subsidy sanction."},
        "fine_print":{"individual_unit_subsidy_percent":35,"individual_unit_subsidy_max_inr":1000000,"beneficiary_contribution_min_percent":10,"balance":"Loan from bank.","project_cost_exclusions":["land cost","costs outside the eligible project-cost rules"],"individual_route_conditions":["existing unit in operation","one person per family","ownership right","above 18 years","minimum VIII-standard pass","willingness to formalise and obtain bank finance"],"odop_rule":"Existing individual units producing the district ODOP product receive preference; other existing micro enterprises may be considered, while new units are supported only for ODOP products under the guideline route.","selection_route":"District-level applications, Resource Person field verification and due diligence, District Level Committee or State Nodal Agency routing, DPR preparation and bank loan sanction under the applicable State implementation route.","scope_note":"Group, SHG, FPO and common-infrastructure components have separate conditions and must not be merged with the individual-unit rule set.","current_pmfme_facts":{"official_portal_checked":"2026-09-08","official_guideline_capture":"The official MoFPI guideline PDF was captured and its sections 1.2, 2.0, 2.3, 2.5, 4.1, 4.2 and 4.3 were reconciled into the blocked review record.","scheme_route":"MoFPI describes PMFME as an all-India Centrally Sponsored scheme implemented with State and UT Governments; the portal exposes State/UT, district, ODOP, training and application resources.","current_notices":"The official portal displays a 30 December 2025 clarification concerning primary-processing applications and a modification notice for individual and group components; these amendments must be reconciled against the base guidelines before an eligibility decision.","individual_component":"The portal and guideline describe 35% credit-linked capital subsidy on eligible project cost up to Rs 10 lakh for the individual route, subject to the applicable rules, bank finance and contribution.","separate_components":"Common infrastructure, SHG seed capital, branding/marketing and capacity building have separate benefit models and must not be merged into the individual-unit recommendation.","availability_boundary":"The guideline states the original 2020-21 to 2024-25 programme period; current State or district intake must be verified before presenting an actionable deadline or active window."},"review_note":"Reconcile the 2025-12-30 primary-processing clarification and all current individual/group amendments with the base guidelines; confirm the State and district route, ODOP treatment, eligible project-cost basis, contribution, bank appraisal and component-specific conditions before publication."},
        "benefit_summary":{"types":["subsidy"],"amounts":[{"type":"credit_linked_capital_subsidy","percentage":35,"max_inr":1000000}],"summary":"Individual micro food processing units may receive credit-linked capital subsidy subject to the official guidelines and reviewer-confirmed current operation.","separate_value_buckets":true},
        "benefit_type":"subsidy",
        "benefit_label":"Individual unit credit-linked capital subsidy",
        "benefit_conditions":{"eligible_project_cost":true,"individual_unit":true,"beneficiary_contribution_min_percent":10,"bank_appraisal_required":true},
        "requirement":"Existing micro food-processing operations, owner qualification and beneficiary contribution",
        "requirement_description":"Provide evidence of an existing unit in operation, micro-enterprise status, food-processing activity, worker count, ownership, applicant age and education, one-person-per-family status, project cost, minimum beneficiary contribution, bank-finance readiness and the applicable ODOP context.",
        "rules":{"all":[{"field":"sector","operator":"equals","value":"food_processing"},{"field":"enterprise_status","operator":"equals","value":"micro"},{"field":"is_existing_unit_in_operation","operator":"equals","value":true},{"field":"is_unincorporated","operator":"equals","value":true},{"field":"employees","operator":"less_than","value":10}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm the individual-unit criteria","description":"Verify food-processing activity, existing operations, enterprise size, worker count, contribution and ODOP context.","url":"https://www.pmfme.mofpi.gov.in/newsletters/docs/SchemeGuidelines.pdf"},{"title":"Prepare the bank and implementation dossier","description":"Prepare project cost, contribution, existing-unit evidence and the current State or district documents required for bank appraisal.","url":"https://pmfme.mofpi.gov.in/"},{"title":"Use the official PMFME implementation route","description":"Follow the current State/UT and district implementation instructions after the reviewer confirms the active route.","url":"https://pmfme.mofpi.gov.in/"}],
        "window_type":"call_for_applications",
        "window_label":"Current application window and any extension require reviewer confirmation.",
        "window_evidence":{"source_url":"https://pmfme.mofpi.gov.in/","anchor":"Current scheme notices and implementation resources"}
      },
      {
        "slug":"msme-samadhaan-delayed-payment-assistance",
        "name":"MSME Samadhaan - Delayed Payment Assistance",
        "type":"compliance",
        "authority":"Ministry of Micro, Small and Medium Enterprises - MSME Samadhaan",
        "authority_url":"https://ramp.msme.gov.in/ramp/RAMP-initiative/msme-samadhaan/msme-samadhaan",
        "canonical_url":"https://samadhaan.msme.gov.in/",
        "source_url":"https://ramp.msme.gov.in/ramp/RAMP-initiative/msme-samadhaan/msme-samadhaan",
        "source_kind":"ministry",
        "source_title":"MSME Samadhaan official Ministry of MSME page",
        "source_anchor":"Introduction; Nature of Assistance; Who can Apply",
        "summary":"Official route for eligible micro and small enterprises to file delayed-payment references and seek assistance through the State MSE Facilitation Council.",
        "objective":"Support settlement and recovery of delayed payments owed to eligible micro and small enterprises.",
        "legal_basis":"Micro, Small and Medium Enterprises Development Act, 2006, sections 15-24; implementation through State MSE Facilitation Councils under sections 20-21.",
        "eligibility":{"entity_types":["micro","small"],"lifecycle_stages":["operating","receivables_recovery"],"locations":["India"],"conditions":["valid Udyam Registration","delayed payment claim against buyer"],"geography":"State MSEFC route","unknown_handling":"needs_information"},
        "application":{"portal":"https://odr.msme.gov.in/seller/","integrated_samadhaan_portal":"https://samadhaan.msme.gov.in/","route":"For new delayed-payment cases, use the current MSME ODR claimant/seller route and verify the live Samadhaan handoff; the relevant State MSEFC examines the statutory reference.","official_overview":"https://ramp.msme.gov.in/ramp/RAMP-initiative/msme-samadhaan/msme-samadhaan","applicant_note":"UdyamVeda can organize invoice and buyer evidence but cannot determine the legal merits or represent itself as the MSEFC or ODR institution."},
        "fine_print":{"assistance":"MSEFC may issue directions for payment of the amount due along with interest as provided under the MSMED Act, 2006.","payment_delay_trigger_days":45,"complaint_registration_target_days":15,"state_dependency":true,"no_grant_or_loan":true,"current_route":{"effective_from":"2025-10-15","new_cases":"The Ministry's 2025-26 Annual Report states that new delayed-payment cases are being filed on the MSME ODR Portal, which is being integrated with Samadhaan.","odr_scope":"The official ODR portal describes dispute avoidance, containment and resolution through digital access; this does not guarantee recovery or a decision timeline."},"claim_evidence_and_procedure":"Reviewer must confirm current portal fields, handoff, limitation/procedure position and evidence requirements.","review_note":"Confirm the current ODR/Samadhaan handoff, limitation/procedure position, Udyam evidence, buyer and invoice evidence, State MSEFC route, interest treatment and any amendments before publication."},
        "benefit_summary":{"types":["market_access"],"summary":"Delayed-payment dispute and recovery assistance; this is not a grant, loan, subsidy or tax benefit.","separate_value_buckets":true},
        "benefit_type":"market_access",
        "benefit_label":"Delayed-payment dispute and recovery assistance",
        "benefit_conditions":{"delivery":"State MSE Facilitation Council","interest":"As provided under the MSMED Act, 2006","no_grant_or_loan":true},
        "requirement":"Valid Udyam Registration and delayed-payment claim",
        "requirement_description":"Provide valid Udyam evidence, buyer and invoice details and the claim material required for examination by the relevant State MSEFC.",
        "rules":{"all":[{"field":"enterprise_status","operator":"in","value":["micro","small"]},{"field":"has_udyam","operator":"equals","value":true},{"field":"delayed_payment_claim_present","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm MSE and Udyam status","description":"Verify that the enterprise is micro or small and has a valid Udyam Registration.","url":"https://ramp.msme.gov.in/ramp/RAMP-initiative/msme-samadhaan/msme-samadhaan"},{"title":"Prepare the delayed-payment reference","description":"Collect claim, buyer, invoice and supporting evidence after confirming the current ODR/Samadhaan portal requirements with the reviewer.","url":"https://odr.msme.gov.in/"},{"title":"Use the current ODR/Samadhaan route","description":"For a new case, follow the official ODR claimant/seller route and its Samadhaan integration for examination by the relevant State MSE Facilitation Council.","url":"https://odr.msme.gov.in/seller/"}],
        "window_type":"rolling",
        "window_label":"Portal filing is treated as rolling subject to current portal operation and applicable limitation/procedure review.",
        "window_evidence":{"source_url":"https://samadhaan.msme.gov.in/","anchor":"Official filing portal"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', case when item->>'slug' like 'pm-%' then 'Ministry of Food Processing Industries' else 'Ministry of Micro, Small and Medium Enterprises' end, item->>'authority', item->>'authority_url'
    where not exists (select 1 from public.authorities where name = item->>'authority')
    returning id into authority_id;
    if authority_id is null then
      select id into authority_id from public.authorities where name = item->>'authority' limit 1;
    end if;

    seed_opportunity_id := null;
    insert into public.opportunities (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (item->>'slug', item->>'name', item->>'type', 'in_review', authority_id, case when item->>'slug' = 'msme-samadhaan-delayed-payment-assistance' then '{"coverage":"central","locations":["India"],"implementation":"state_msefc"}'::jsonb else '{"coverage":"central","locations":["India"]}'::jsonb end, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, authority_id = excluded.authority_id, canonical_url = excluded.canonical_url
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then
      select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1;
    end if;

    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.88, 0.88, 'in_review')
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
    select version_id, case when item->>'slug' = 'pm-formalisation-micro-food-processing-enterprises' then 'https://pmfme.mofpi.gov.in/' else 'https://samadhaan.msme.gov.in/' end, 'agency', case when item->>'slug' = 'pm-formalisation-micro-food-processing-enterprises' then 'PMFME official portal' else 'MSME Samadhaan application portal' end, case when item->>'slug' = 'pm-formalisation-micro-food-processing-enterprises' then 'Scheme overview and implementation resources' else 'Official filing handoff' end, now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = case when item->>'slug' = 'pm-formalisation-micro-food-processing-enterprises' then 'https://pmfme.mofpi.gov.in/' else 'https://samadhaan.msme.gov.in/' end);
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://odr.msme.gov.in/', 'agency', 'MSME ODR official portal', 'Dispute avoidance, containment and resolution; official service scope'),
      ('https://msme.gov.in/sites/default/files/MSMEANNUALREPORT2025-26ENGLISH_0.pdf', 'ministry', 'MSME Annual Report 2025-26', 'Section 1.7.1: new delayed-payment cases on MSME ODR from 15 October 2025 and integration with Samadhaan')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where item->>'slug' = 'msme-samadhaan-delayed-payment-assistance'
      and not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = evidence.source_url);
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
