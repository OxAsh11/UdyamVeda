-- Additional official Ministry of MSME market-access records.
-- These remain in_review until a human reviewer confirms current event
-- windows, amendments, application fields and component-specific conditions.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('MSME Procurement and Marketing Support scheme guidelines', 'https://msme.gov.in/sites/default/files/PMSSchemeGuidelines.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official PMS guideline; event-specific windows and claim rules require review.'),
  ('MyMSME Procurement and Marketing Support portal', 'https://my.msme.gov.in/MyMsme/Reg/COM_Matu.aspx', 'implementing_portal', 'central', 'weekly', 2, true, 'Official portal for fairs, claims and PMS applications.'),
  ('PMS IITF 2026 event listing', 'https://pms.dcmsme.gov.in/view-all-event', 'implementing_portal', 'central', 'daily', 1, true, 'Official current event listing and application route for the IITF 2026 PMS opportunity.'),
  ('MyMSME current PMS notice', 'https://my.msme.gov.in/mymsme/Reg/home.aspx', 'ministry_portal', 'central', 'daily', 1, true, 'Official current notice for the temporary PMS extension, new portal route and IITF 2026 dates.'),
  ('MSME International Cooperation scheme guidelines', 'https://msme.gov.in/sites/default/files/Revised_IC_Scheme2023.pdf', 'guideline', 'central', 'monthly', 1, true, 'Amended 2023 official guideline; component-specific assistance and calls require review.'),
  ('MSME International Cooperation application portal', 'https://ic.msme.gov.in/', 'implementing_portal', 'central', 'weekly', 2, true, 'Official current call and application portal for IC components.'),
  ('MSME International Cooperation login route', 'https://ic.msme.gov.in/IC_APP/IC_Login.aspx', 'application_portal', 'central', 'weekly', 2, true, 'Official applicant login and registration route for the IC scheme.'),
  ('MSME International Cooperation RAMP description', 'https://ramp.msme.gov.in/ramp/RAMP-initiative/ic-scheme/ic-scheme', 'ministry_portal', 'central', 'monthly', 2, true, 'Official Ministry of MSME RAMP description of the IC scheme and current component context.')
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
        "slug":"procurement-and-marketing-support-pms",
        "name":"Procurement and Marketing Support (PMS) Scheme",
        "type":"procurement",
        "authority":"Office of the Development Commissioner (MSME) - PMS",
        "authority_url":"https://ramp.msme.gov.in/ramp/RAMP-initiative/pms-scheme/pms-scheme",
        "canonical_url":"https://ramp.msme.gov.in/ramp/RAMP-initiative/pms-scheme/pms-scheme",
        "source_url":"https://msme.gov.in/sites/default/files/PMSSchemeGuidelines.pdf",
        "source_kind":"guideline",
        "source_title":"PMS Scheme Guidelines",
        "source_anchor":"Trade fairs, exhibitions and participation assistance",
        "summary":"Market-access support for eligible micro and small enterprises through domestic trade fairs, exhibitions, vendor-development activity and related marketing components.",
        "objective":"Enhance the marketability of MSME products and services and help enterprises explore and retain markets.",
        "legal_basis":"Procurement and Marketing Support Scheme Guidelines issued by the Office of the Development Commissioner (MSME).",
        "eligibility":{"entity_types":["micro","small"],"lifecycle_stages":["operating","market_expansion"],"locations":["India"],"founder_categories":["women","sc_st","north_eastern_region"],"conditions":["eligible MSE under the applicable PMS component","event or activity must be approved under the current scheme process"],"exclusions":["support is event and component specific","illustrative guideline caps cannot be treated as a current universal entitlement"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://pms.dcmsme.gov.in/view-all-event","legacy_scheme_portal":"https://my.msme.gov.in/MyMsme/Reg/COM_Matu.aspx","event_portal":"https://pms.dcmsme.gov.in/","route":"Select the applicable event or component on the current PMS portal and follow the current official application or claim process; organizer proposals and MSE applications may use different routes.","applicant_note":"UdyamVeda can prepare event, invoice and claim checklists but cannot guarantee reimbursement or event allotment."},
        "fine_print":{"event_specific":true,"valid_udyam_required":true,"illustrative_guideline_terms":{"general_space_rent_support_percent":80,"special_category_space_rent_support_percent":100,"airfare_support_percent":100,"general_space_rent_cap_inr":100000,"airfare_cap_inr":125000,"maximum_reimbursed_events_per_year":2},"current_pms_facts":{"official_pages_checked":"2026-09-08","current_application_route":"https://pms.dcmsme.gov.in/view-all-event","eligibility":"Manufacturing or service-sector MSE with valid Udyam Registration, subject to the applicable component and event notice.","current_operational_context":"The DCMSME circular page lists 2026 operational notices, event-count restrictions, document requirements and FY 2026-27 proposal instructions; organizer proposals and MSE participation are separate routes.","window_boundary":"Generic PMS is rolling/event-specific. The separate IITF 2026 record carries its own deadline and Udyam cut-off and must not be merged into this generic scheme record."},"review_note":"Component, category, event, Udyam validity, document/claim route and extension conditions must be confirmed from the current notice before publication."},
        "benefit_summary":{"types":["reimbursement","market_access"],"summary":"Event and marketing assistance may reimburse eligible costs under the applicable component; exact benefit depends on the event, category and current notice.","separate_value_buckets":true},
        "benefit_type":"reimbursement",
        "benefit_label":"Trade fair and marketing cost support",
        "benefit_conditions":{"illustrative_cap":"airfare per representative under cited guideline terms","event_specific":true,"current_notice_required":true},
        "requirement":"Approved event or component selection",
        "requirement_description":"The enterprise must apply under an event or component supported by the current PMS notice and portal.",
        "rules":{"all":[{"field":"enterprise_size","operator":"in","value":["micro","small"]},{"field":"pms_event_or_component_available","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Check the current PMS event or component","description":"Confirm that the relevant fair, exhibition, vendor-development activity or other component is open and approved.","url":"https://my.msme.gov.in/MyMsme/Reg/COM_Matu.aspx"},{"title":"Apply or claim through the official portal","description":"Use the official PMS route and preserve event, invoice and claim evidence required by the current notice.","url":"https://pms.dcmsme.gov.in/"}],
        "window_type":"rolling",
        "window_label":"Event-specific windows are published separately; verify the current event notice before recommendation.",
        "window_evidence":{"source_url":"https://my.msme.gov.in/MyMsme/Reg/COM_Matu.aspx","anchor":"Current events and notices"}
      },
      {
        "slug":"iitf-2026-pms-domestic-trade-fair",
        "name":"IITF 2026 under Procurement and Marketing Support Scheme",
        "type":"event",
        "authority":"Office of the Development Commissioner (MSME) - PMS",
        "authority_url":"https://ramp.msme.gov.in/ramp/RAMP-initiative/pms-scheme/pms-scheme",
        "canonical_url":"https://pms.dcmsme.gov.in/view-all-event",
        "source_url":"https://pms.dcmsme.gov.in/view-all-event",
        "source_kind":"agency",
        "source_title":"PMS IITF 2026 event listing",
        "source_anchor":"Online applications for IITF-2026 are open from 01.09.2026 to 20.09.2026; valid Udyam registration as on 31.08.2026; late applications not considered",
        "summary":"A current domestic trade-fair application opportunity for eligible micro and small enterprises under the PMS Scheme.",
        "objective":"Enable eligible MSEs to apply for participation in IITF 2026 through the current PMS event route.",
        "legal_basis":"Procurement and Marketing Support Scheme Guidelines and the current official IITF 2026 event notice.",
        "eligibility":{"entity_types":["micro","small"],"lifecycle_stages":["operating","market_expansion"],"locations":["India"],"conditions":["the enterprise must be an eligible MSE under the applicable PMS component","valid Udyam registration must exist as of 31 August 2026","the application must be submitted through the official PMS event route before the deadline"],"exclusions":["applications received after 20 September 2026 are not considered","stall fee or receipt is not required at application stage and must not be represented as an upfront application fee","event participation and allotment are not guaranteed"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://pms.dcmsme.gov.in/view-all-event","scheme_portal":"https://pms.dcmsme.gov.in/","route":"Select IITF 2026 on the official PMS event listing and submit the MSE application before the published deadline.","stall_fee_at_application":"not_required_at_application_stage","applicant_note":"UdyamVeda can explain the event requirements and prepare the application checklist but cannot allot a stall, collect the application, or guarantee selection."},
        "fine_print":{"event_name":"India International Trade Fair (IITF) 2026","application_open":"2026-09-01","application_deadline":"2026-09-20","udyam_valid_as_of":"2026-08-31","late_applications":"not_considered","stall_fee_at_application":"not_required; collected only from MSEs allotted stalls according to the PMS guidelines","current_source_checked_at":"2026-09-07","review_note":"Recheck the event listing, eligibility, Udyam validity, deadline, allotment terms, stall-fee treatment and any event-specific instructions immediately before publication or recommendation."},
        "benefit_summary":{"types":["market_access","event_participation"],"summary":"Access to an official domestic trade-fair application route; stall allotment and any PMS support remain subject to eligibility, event terms and approval.","separate_value_buckets":true},
        "benefit_type":"market_access",
        "benefit_label":"IITF 2026 domestic trade-fair participation opportunity",
        "benefit_conditions":{"valid_udyam_as_of":"2026-08-31","application_window":"2026-09-01_to_2026-09-20","allotment_required":true},
        "requirement":"Valid Udyam registration and eligible MSE status",
        "requirement_description":"Provide the current Udyam registration and enterprise details required by the IITF 2026 PMS application before the event deadline.",
        "rules":{"all":[{"field":"enterprise_size","operator":"in","value":["micro","small"]},{"field":"udyam_registration_valid_as_of","operator":"less_than_or_equal","value":"2026-08-31"},{"field":"pms_event_application_open","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm current event eligibility","description":"Verify MSE status and valid Udyam registration as of 31 August 2026 before applying.","url":"https://my.msme.gov.in/mymsme/Reg/home.aspx"},{"title":"Open the IITF 2026 event listing","description":"Use the official PMS event listing and select the IITF 2026 application route.","url":"https://pms.dcmsme.gov.in/view-all-event"},{"title":"Submit before the deadline","description":"Complete the official application by 20 September 2026; late applications are not considered and stall fee is not required at application stage.","url":"https://pms.dcmsme.gov.in/view-all-event"}],
        "window_type":"fixed",
        "window_label":"IITF 2026 applications are open from 1 September 2026 through 20 September 2026; late applications are not considered.",
        "opens_at":"2026-09-01",
        "closes_at":"2026-09-20",
        "window_evidence":{"source_url":"https://pms.dcmsme.gov.in/view-all-event","anchor":"Online applications for IITF-2026 are open from 01.09.2026 to 20.09.2026; applications after 20.09.2026 will not be considered"}
      },
      {
        "slug":"msme-international-cooperation-scheme",
        "name":"International Cooperation (IC) Scheme",
        "type":"scheme",
        "authority":"Ministry of Micro, Small and Medium Enterprises - International Cooperation",
        "authority_url":"https://ic.msme.gov.in/",
        "canonical_url":"https://ic.msme.gov.in/",
        "source_url":"https://msme.gov.in/sites/default/files/Revised_IC_Scheme2023.pdf",
        "source_kind":"guideline",
        "source_title":"Amended Guidelines of International Cooperation (IC) Scheme",
        "source_anchor":"Objective and sub-components",
        "summary":"Export and international market-access support for MSME participation in exhibitions, trade fairs, buyer-seller meets, conferences and related capacity-building activities.",
        "objective":"Build MSME capacity to enter export markets, access market intelligence and improve international competitiveness.",
        "legal_basis":"Amended Guidelines of International Cooperation (IC) Scheme, Ministry of MSME, 2023.",
        "eligibility":{"entity_types":["msme","industry_association","government_organisation","registered_society_or_trust"],"lifecycle_stages":["operating","export_readiness","market_expansion"],"locations":["India","international"],"activities":["international_exhibitions","trade_fairs","buyer_seller_meets","international_conferences","export_capacity_building"],"conditions":["The applicant must fit the applicable IC component and current official call.","The proposed activity and claimed costs must fall within the eligible component and call conditions."],"exclusions":["component-specific eligibility and eligible-cost rules apply","call dates, applicant categories, caps and reimbursement treatment must be confirmed from the current notice"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://ic.msme.gov.in/","route":"Select the applicable component and submit through the official call or application route.","components":["Market Development Assistance","Capacity Building for First-Time Exporters"],"applicant_note":"UdyamVeda can organize export-readiness and event evidence but cannot guarantee selection or reimbursement."},
        "fine_print":{"component_specific":true,"support":"Reimbursement or financial assistance for eligible costs under the applicable component.","current_call":{"events_period":"2026-06-01_to_2026-09-30","submission_deadline":"2026-05-05T17:30:00+05:30","status_as_of":"closed","source_url":"https://ic.msme.gov.in/","note":"The official portal displayed this 2026 call; the submission deadline has passed as of the 8 September 2026 audit."},"eligible_costs_are_component_specific":true,"current_call_note":"Future call dates, eligible applicants and reimbursement caps must be confirmed from the current official notice.","review_note":"Confirm the current IC component, call window, eligible applicant, eligible cost, advance or reimbursement treatment, caps, evidence and approval route before publication."},
        "benefit_summary":{"types":["reimbursement","market_access","training"],"summary":"Internationalisation and export-market support; amount and eligible cost depend on the selected component and current call.","separate_value_buckets":true},
        "benefit_type":"reimbursement",
        "benefit_label":"Export-market participation and capacity-building assistance",
        "benefit_conditions":{"eligible_costs":"component and call dependent","international_exhibitions":true,"buyer_seller_meets":true,"current_call_required":true},
        "requirement":"Component and current call eligibility",
        "requirement_description":"Applicant and eligible-cost requirements vary by IC component and the current official call.",
        "rules":{"all":[{"field":"ic_component_selected","operator":"exists"},{"field":"ic_call_open","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Choose the applicable IC component","description":"Identify the exhibition, trade-fair, buyer-seller, conference or first-time-exporter component that matches the business need.","url":"https://ic.msme.gov.in/"},{"title":"Apply through the current official call","description":"Use the official portal and retain the call, event, cost and reimbursement evidence required by the selected component.","url":"https://ic.msme.gov.in/"}],
        "window_type":"closed",
        "window_label":"The official portal displayed a 2026 call for events from 1 June through 30 September 2026 with applications due by 5 May 2026 at 5:30 PM; that call is closed as of this audit. Future calls must be separately verified.",
        "window_evidence":{"source_url":"https://ic.msme.gov.in/","anchor":"New applications notice for events from 01.06.2026 to 30.09.2026; last date 05.05.2026 at 5:30 PM"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Micro, Small and Medium Enterprises', item->>'authority', item->>'authority_url'
    where not exists (select 1 from public.authorities where name = item->>'authority')
    returning id into authority_id;
    if authority_id is null then
      select id into authority_id from public.authorities where name = item->>'authority' limit 1;
    end if;

    seed_opportunity_id := null;
    insert into public.opportunities (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (item->>'slug', item->>'name', item->>'type', 'in_review', authority_id, case when item->>'slug' = 'msme-international-cooperation-scheme' then '{"coverage":"central","locations":["India","international"]}'::jsonb else '{"coverage":"central","locations":["India"]}'::jsonb end, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, authority_id = excluded.authority_id, canonical_url = excluded.canonical_url
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then
      select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1;
    end if;

    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.87, 0.85, 'in_review')
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
    select version_id, case when item->>'slug' = 'procurement-and-marketing-support-pms' then 'https://my.msme.gov.in/MyMsme/Reg/COM_Matu.aspx' else 'https://ic.msme.gov.in/' end, 'ministry', case when item->>'slug' = 'procurement-and-marketing-support-pms' then 'MyMSME PMS portal' else 'International Cooperation official portal' end, case when item->>'slug' = 'procurement-and-marketing-support-pms' then 'Current events, claim route and scheme notices' else 'Current calls and application components' end, now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = case when item->>'slug' = 'procurement-and-marketing-support-pms' then 'https://my.msme.gov.in/MyMsme/Reg/COM_Matu.aspx' else 'https://ic.msme.gov.in/' end);
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://pms.dcmsme.gov.in/', 'agency', 'PMS event portal', 'Current PMS event/application route', now(), false
    where item->>'slug' = 'procurement-and-marketing-support-pms'
      and not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://pms.dcmsme.gov.in/');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, source_url, source_kind, source_title, source_anchor, now(), false
    from (values
      ('https://my.msme.gov.in/mymsme/Reg/home.aspx', 'ministry', 'MyMSME current PMS notice', 'Temporary PMS extension, new portal route and IITF 2026 dates'),
      ('https://pms.dcmsme.gov.in/view-all-event', 'agency', 'PMS IITF 2026 event listing', 'Current event application deadline, Udyam validity and stall-fee treatment')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where item->>'slug' = 'iitf-2026-pms-domestic-trade-fair'
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

-- Clean-seed correction: preserve the current IITF 2026 event window and
-- source reconciliation when migrations run before opportunity seed rows.
do $$
declare
  version_id uuid;
begin
  select current_version_id into version_id
  from public.opportunities
  where slug = 'iitf-2026-pms-domestic-trade-fair';

  if version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_source_checked_at', '2026-09-08',
        'current_event_portal', 'https://pms.dcmsme.gov.in/view-all-event',
        'current_notice', 'Official MyMSME and PMS notices state that IITF 2026 applications are open from 2026-09-01 through 2026-09-20; only MSEs with valid Udyam Registration as of 2026-08-31 are eligible and late applications are not considered.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_pms_iitf_reconciliation', jsonb_build_object(
          'official_sources_checked', '2026-09-08',
          'application_open', '2026-09-01',
          'application_deadline', '2026-09-20',
          'udyam_valid_as_of', '2026-08-31',
          'late_applications', 'not_considered',
          'stall_fee_at_application', 'not_required; collected only from MSEs allotted stalls according to PMS guidelines',
          'organiser_route_separate', true,
          'review_boundary', 'Confirm the current event form, documents, selection/allotment terms and post-event claim evidence before publication.'
        ),
        'current_source_reconciliation', 'The official PMS portal and MyMSME notice were checked on 8 September 2026. IITF 2026 remains a separate fixed-window event opportunity and must not be merged with generic PMS or the organiser proposal route.'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = version_id;

    update public.opportunity_windows
    set
      window_type = 'fixed',
      opens_at = '2026-09-01',
      closes_at = '2026-09-20',
      label = 'IITF 2026 MSE applications: 1 September 2026 to 20 September 2026; late applications are not considered.',
      source_evidence = jsonb_build_object('source_url', 'https://my.msme.gov.in/mymsme/Reg/home.aspx', 'anchor', 'Official IITF 2026 application dates and late-application rule; checked 8 September 2026')
    where opportunity_version_id = version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://pms.dcmsme.gov.in/', 'agency', 'PMS portal', 'IITF 2026 announcement and separate organiser route'),
      ('https://my.msme.gov.in/mymsme/Reg/home.aspx', 'ministry', 'MyMSME current PMS notice', 'IITF 2026 dates, Udyam validity and stall-fee treatment'),
      ('https://msme.gov.in/sites/default/files/PMSSchemeGuidelines.pdf', 'guideline', 'PMS Scheme Guidelines', 'Underlying PMS terms and claim boundaries')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources os
      where os.opportunity_version_id = version_id
        and os.source_url = evidence.source_url
    );
  end if;
end $$;
