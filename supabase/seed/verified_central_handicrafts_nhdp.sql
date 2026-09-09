-- National Handicrafts Development Programme (NHDP) records from the
-- Development Commissioner (Handicrafts), Ministry of Textiles. These are
-- separate agency/project routes, not automatic cash entitlements for every
-- artisan or handicraft business.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Development Commissioner Handicrafts official portal', 'https://handicrafts.nic.in', 'agency_portal', 'central', 'weekly', 1, true, 'Official Development Commissioner (Handicrafts) portal used for current scheme navigation and notices.'),
  ('Development Commissioner Handicrafts NHDP guidelines', 'https://handicrafts.nic.in/cmsUpload/20230425203825NHDP_Guidlines.pdf', 'guideline', 'central', 'monthly', 1, true, 'Current official NHDP guideline covering Marketing Support and Services and Design and Skill Development components; current amendments and proposal notices require review.'),
  ('Development Commissioner Handicrafts scheme index', 'https://handicrafts.nic.in/schemes.aspx', 'agency_portal', 'central', 'weekly', 1, true, 'Official scheme index for NHDP components and handicraft-sector support routes.'),
  ('Development Commissioner Handicrafts circulars and notices', 'https://handicrafts.nic.in/tenders.aspx?type=27', 'agency_portal', 'central', 'weekly', 1, true, 'Official notices for FY 2026-27 marketing calendars, skill-development proposals, infrastructure support and related application windows.'),
  ('Development Commissioner Handicrafts skill-development proposal notice', 'https://handicrafts.nic.in/CmsUpload/05322024063222Invitation%20CSUP%20FY%202024-25_0001.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official skill-development proposal material used for component detail; current financial-year notice and implementation route must be checked before publication.'),
  ('Development Commissioner Handicrafts current news index', 'https://handicrafts.nic.in/Showall.aspx?link=allnews', 'agency_portal', 'central', 'weekly', 1, true, 'Current official news index used to detect FY 2026-27 NHDP MSS and SDHS notices; attachment-level review is still required.')
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
        "slug":"nhdp-marketing-support-services-handicrafts",
        "name":"National Handicrafts Development Programme - Marketing Support and Services",
        "type":"market_access",
        "authority":"Office of Development Commissioner (Handicrafts) - NHDP",
        "authority_url":"https://handicrafts.nic.in/",
        "canonical_url":"https://handicrafts.nic.in/schemes.aspx",
        "source_url":"https://handicrafts.nic.in/cmsUpload/20230425203825NHDP_Guidlines.pdf",
        "source_kind":"guideline",
        "source_title":"National Handicrafts Development Programme Guidelines",
        "source_anchor":"Marketing Support and Services (MSS): marketing events, exhibitions, fairs, buyer-seller meets, brand promotion and market-development activities",
        "summary":"A project and participation route supporting approved handicraft-sector marketing events, exhibitions, fairs, buyer-seller meets and market-development activities.",
        "objective":"Create domestic and international marketing platforms that improve market access, sales, export readiness and income opportunities for handicraft artisans and eligible sector organizations.",
        "legal_basis":"National Handicrafts Development Programme guidelines issued by the Office of Development Commissioner (Handicrafts), Ministry of Textiles.",
        "eligibility":{"entity_types":["central_government_body","state_government_body","handloom_handicrafts_development_corporation","empaneled_ngo","registered_shg","registered_cooperative_society","national_apex_society","artisan_producer_company"],"lifecycle_stages":["operating","growth","market_expansion"],"industries":["handicrafts","artisan_products","textiles_handicrafts"],"locations":["India"],"conditions":["the applicant is an eligible agency or organization under the current MSS guidelines and notice","the proposal or participation fits an approved domestic or international marketing activity and is submitted through the prescribed field-office or official notice route","the project supports handicraft artisans or eligible sector products and follows the applicable event, stall, branding, reporting and utilization conditions"],"exclusions":["an individual artisan should not be shown as automatically entitled to a project grant under the agency proposal route","a listing in an annual calendar does not guarantee selection, stall allotment, reimbursement or sales","third-party event organizers and partner offerings require separate due diligence","project support must not be combined with unrelated MSME marketing benefits"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://handicrafts.nic.in/","route":"Monitor the official DC (Handicrafts) schemes and circulars, confirm the applicable MSS advertisement or event calendar, and submit the agency or participation proposal through the prescribed route.","applicant_note":"UdyamVeda can prepare the proposal, artisan/organization evidence, product catalogue, event-readiness checklist and official handoff, but cannot promise selection or sales.","fees":"Confirm event-specific participation, stall, travel, contribution and documentation terms in the current notice."},
        "fine_print":{"support_categories":["domestic_marketing_events","international_marketing_events","exhibitions_and_fairs","buyer_seller_meets","brand_promotion","market_intelligence","stall_or_platform_access"],"benefit_structure":"Project/event support and market-access opportunity subject to approved activity, eligible agency, annual calendar, field recommendation and sanctioned norms.","no_fixed_entitlement":true,"agency_route":true,"selection":"The guidelines provide for proposal submission and committee/field-office consideration; an application or event listing is not an approval.","reporting":"Selected agencies and participants may have event, utilization, beneficiary, attendance, sales and compliance reporting obligations under the applicable notice.","review_note":"Confirm the current FY 2026-27 MSS notice, eligible agency class, field-office recommendation, proposal format, event calendar, contribution/stall terms, selection committee, reimbursement norms, reporting, cancellation and grievance route before publication."},
        "benefit_summary":{"types":["market_access","non_financial_support"],"summary":"Potential access to approved handicraft marketing events, exhibition platforms, buyer-seller meets and related market-development support; selection and any sanctioned project assistance are not guaranteed.","separate_value_buckets":true},
        "benefit_type":"market_access",
        "benefit_label":"NHDP handicraft marketing and event access",
        "benefit_conditions":{"approved_activity_required":true,"eligible_agency_or_participant_required":true,"annual_calendar_or_notice_applies":true,"selection_required":true,"no_guaranteed_amount":true},
        "requirement":"Eligible agency, artisan group or producer-company proposal",
        "requirement_description":"Prepare organization registration, artisan or beneficiary profile, craft/product details, event or market plan, budget, field-office recommendation and the documents required by the current MSS notice.",
        "rules":{"all":[{"field":"handicraft_sector_activity","operator":"equals","value":true},{"field":"eligible_nhdp_mss_organization_or_group","operator":"equals","value":true},{"field":"current_mss_notice_or_event_route_available","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Classify the MSS route","description":"Decide whether the need is a domestic event, international event, exhibition, buyer-seller meet, stall/platform access or a project proposal under the current NHDP component.","url":"https://handicrafts.nic.in/schemes.aspx"},{"title":"Check the current notice and calendar","description":"Review the latest official circular, annual marketing calendar, deadline and eligible-agency instructions; do not infer an open route from the scheme name alone.","url":"https://handicrafts.nic.in/tenders.aspx?type=27"},{"title":"Prepare the organization and product evidence","description":"Compile registration, artisan or producer-group details, craft/product catalogue, market plan, budget, prior activity and declarations requested by the notice.","url":"https://handicrafts.nic.in/cmsUpload/20230425203825NHDP_Guidlines.pdf"},{"title":"Submit through the official route","description":"Submit only through the prescribed DC (Handicrafts), field-office or event route and retain selection, participation, expenditure and reporting records.","url":"https://handicrafts.nic.in/"}],
        "window_type":"call_for_applications",
        "window_label":"FY 2026-27 marketing calendars and proposal notices are published through the official DC (Handicrafts) notice route; each event or proposal has its own availability and deadline.",
        "window_evidence":{"source_url":"https://handicrafts.nic.in/tenders.aspx?type=27","anchor":"FY 2026-27 Annual Marketing Calendar and invitation for proposals under Marketing Support and Services listed in official circulars"}
      },
      {
        "slug":"nhdp-skill-development-handicraft-sector",
        "name":"National Handicrafts Development Programme - Skill Development in Handicraft Sector",
        "type":"training",
        "authority":"Office of Development Commissioner (Handicrafts) - NHDP",
        "authority_url":"https://handicrafts.nic.in/",
        "canonical_url":"https://handicrafts.nic.in/schemes.aspx",
        "source_url":"https://handicrafts.nic.in/cmsUpload/20230425203825NHDP_Guidlines.pdf",
        "source_kind":"guideline",
        "source_title":"National Handicrafts Development Programme Guidelines - Design and Skill Development",
        "source_anchor":"Design and Skill Development in Handicraft Sector: Design and Technology Development Workshop, Toolkit Distribution, Guru Shishya Hastshilp Prashikshan and Comprehensive Skill Upgradation",
        "summary":"A design and training support route for handicraft-sector artisans, including technical, design, soft-skill and craft-exposure components delivered through approved proposals and institutions.",
        "objective":"Bridge craft-sector skill gaps, support design innovation and product development, preserve traditional skills and improve demand-driven self-employment and market readiness.",
        "legal_basis":"National Handicrafts Development Programme guidelines issued by the Office of Development Commissioner (Handicrafts), Ministry of Textiles.",
        "eligibility":{"entity_types":["artisan","handicraft_worker","artisan_group","registered_shg","registered_cooperative_society","empaneled_training_agency","approved_institution"],"lifecycle_stages":["idea","operating","growth"],"industries":["handicrafts","artisan_products","textiles_handicrafts"],"founder_categories":["traditional_artisan","craft_worker"],"locations":["India"],"conditions":["the participant is an artisan with the relevant craft evidence, including PAHCHAN-card evidence where required for the component","the training, workshop or design activity is part of an approved current proposal or official programme route","the implementing agency and batch satisfy the component's prescribed norms"],"exclusions":["training availability is not a guaranteed grant, job, loan or market order","individual eligibility can differ by component, craft and programme notice","the implementing agency must not claim a current opening solely from an old guideline or archived notice","attendance, certification and any toolkit or stipend condition must be verified from the current programme notice"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://handicrafts.nic.in/","route":"Monitor the official NHDP scheme and circular pages for the current SDHS proposal or training route, then apply as an eligible artisan/participant or implementing agency as directed.","applicant_note":"UdyamVeda can explain the component, prepare participant and agency evidence and guide the official handoff, but cannot enroll a person into a batch or guarantee certification.","fees":"Confirm whether the current programme has any participant contribution or agency-specific terms."},
        "fine_print":{"components":["design_and_technology_development_workshop","toolkit_distribution_program","guru_shishya_hastshilp_prashikshan_program","comprehensive_skill_upgradation_program"],"training_structure":"The guideline describes component-specific duration, batch-size, craft, trainer and assistance norms. One cited CSUP route uses technical training, design-development training and soft-skill/craft-exposure components over a maximum five-month programme for a batch of 30 artisans.","participant_evidence":"The cited CSUP material states that an artisan with a PAHCHAN card in the relevant craft is eligible for that training component; the current notice controls any variation.","agency_route":true,"no_fixed_entitlement":true,"review_note":"Confirm the current FY 2026-27 SDHS notice, component selection, PAHCHAN requirement, batch size, duration, approved institution/agency, proposal format, trainer norms, toolkit/stipend/certificate terms, attendance, monitoring, reporting and current application window before publication."},
        "benefit_summary":{"types":["training","design_support","non_financial_support"],"summary":"Potential access to approved craft training, design development, technical and soft-skill support, and component-specific exposure or toolkit assistance; batch admission and any financial support are subject to the current programme route.","separate_value_buckets":true},
        "benefit_type":"training",
        "benefit_label":"NHDP handicraft design and skill-development access",
        "benefit_conditions":{"relevant_craft_required":true,"component_specific_rules_apply":true,"approved_programme_or_agency_required":true,"pahchan_card_may_be_required":true,"no_guaranteed_amount":true},
        "requirement":"Relevant craft identity and programme evidence",
        "requirement_description":"Provide craft identity, artisan or participant records, PAHCHAN card where required, location, training need and the current programme or agency details requested by the official notice.",
        "rules":{"all":[{"field":"relevant_handicraft_craft_identified","operator":"equals","value":true},{"field":"artisan_or_handicraft_participant","operator":"equals","value":true},{"field":"current_nhdp_skill_programme_available","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Choose the relevant component","description":"Map the need to design and technology development, toolkit distribution, Guru Shishya training or comprehensive skill upgradation.","url":"https://handicrafts.nic.in/cmsUpload/20230425203825NHDP_Guidlines.pdf"},{"title":"Check the current programme notice","description":"Review the latest SDHS proposal or training notice and confirm the relevant craft, participant, agency, batch and deadline conditions.","url":"https://handicrafts.nic.in/tenders.aspx?type=27"},{"title":"Prepare artisan or agency evidence","description":"Prepare PAHCHAN card or craft identity evidence, participant list, training need, institution/agency details and any proposal documents required by the component.","url":"https://handicrafts.nic.in/CmsUpload/05322024063222Invitation%20CSUP%20FY%202024-25_0001.pdf"},{"title":"Use the official enrollment or proposal route","description":"Continue through the official DC (Handicrafts) or approved implementing-agency route and retain attendance, certificate, toolkit and reporting records.","url":"https://handicrafts.nic.in/"}],
        "window_type":"call_for_applications",
        "window_label":"An FY 2026-27 SDHS project-proposal invitation is listed in the official notice index; participant enrollment and proposal deadlines remain component- and agency-specific.",
        "window_evidence":{"source_url":"https://handicrafts.nic.in/tenders.aspx?type=27","anchor":"Invitation of Project Proposal under Skill Development for Handicraft Sector for FY 2026-27 listed in official circulars"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Textiles', 'Development Commissioner (Handicrafts)', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.82, 0.79, 'in_review')
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
    select version_id, 'https://handicrafts.nic.in/schemes.aspx', 'agency', 'DC (Handicrafts) scheme index', 'NHDP scheme components and official scheme navigation', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://handicrafts.nic.in/schemes.aspx');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://handicrafts.nic.in/tenders.aspx?type=27', 'agency', 'DC (Handicrafts) official circulars', item->'window_evidence'->>'anchor', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://handicrafts.nic.in/tenders.aspx?type=27');
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

-- Clean-seed correction: the current notice index establishes notice presence,
-- not an open universal deadline or guaranteed award. Keep it separate from
-- the historical CSUP component-detail source.
do $$
declare
  item record;
begin
  for item in
    select o.current_version_id as version_id, o.slug
    from public.opportunities o
    where o.slug in ('nhdp-marketing-support-services-handicrafts', 'nhdp-skill-development-handicraft-sector')
  loop
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_notice_index', 'https://handicrafts.nic.in/tenders.aspx?type=27',
        'current_news_index', 'https://handicrafts.nic.in/Showall.aspx?link=allnews',
        'current_route_checked_at', '2026-09-08',
        'notice_presence_is_not_open_deadline', true,
        'official_handoff_boundary', 'UdyamVeda may prepare and explain the route, but the eligible agency, artisan, participant or implementing institution must use the official DC (Handicrafts) notice or MIS route.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || case
        when item.slug = 'nhdp-marketing-support-services-handicrafts' then jsonb_build_object(
          'current_notice_index_observation', 'The official index lists FY 2026-27 MSS project-proposal, international action-plan, domestic marketing-calendar and Dilli Haat calendar notices.',
          'current_notice_dates', jsonb_build_array('2026-01-02', '2026-01-19', '2026-03-31', '2026-04-06'),
          'deadline_status', 'notice_listed_attachment_review_required',
          'open_window_not_inferred', true,
          'event_selection_not_guaranteed', true,
          'current_terms_require_attachment_capture', true,
          'current_route_checked_at', '2026-09-08'
        )
        else jsonb_build_object(
          'current_notice_index_observation', 'The official index lists an FY 2026-27 SDHS project-proposal invitation dated 2026-01-02.',
          'current_notice_dates', jsonb_build_array('2026-01-02'),
          'deadline_status', 'notice_listed_attachment_review_required',
          'open_window_not_inferred', true,
          'historical_csup_terms_not_current', true,
          'current_terms_require_attachment_capture', true,
          'current_route_checked_at', '2026-09-08'
        )
      end,
      last_verified_at = now(),
      review_status = 'in_review'
    where id = item.version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (item.version_id, 'https://handicrafts.nic.in/Showall.aspx?link=allnews', 'agency', 'DC (Handicrafts) current news index', 'Current FY 2026-27 NHDP notice presence cross-check', now(), false)
    on conflict do nothing;

    update public.opportunity_windows
    set
      label = case when item.slug = 'nhdp-marketing-support-services-handicrafts'
        then 'FY 2026-27 MSS proposals and marketing calendars are listed by the official portal; exact event/proposal deadlines and terms require attachment review.'
        else 'An FY 2026-27 SDHS project-proposal invitation is listed by the official portal; exact deadline and participant/agency terms require attachment review.'
      end,
      source_evidence = jsonb_build_object(
        'source_url', 'https://handicrafts.nic.in/tenders.aspx?type=27',
        'supporting_url', 'https://handicrafts.nic.in/Showall.aspx?link=allnews',
        'anchor', case when item.slug = 'nhdp-marketing-support-services-handicrafts' then 'FY 2026-27 MSS proposal and marketing-calendar entries' else 'FY 2026-27 SDHS project-proposal entry' end,
        'observed_at', '2026-09-08',
        'deadline_status', 'notice_listed_attachment_review_required',
        'open_window_not_inferred', true
      )
    where opportunity_version_id = item.version_id;
  end loop;
end $$;
