-- Chemicals Promotion and Development Scheme record. This is an
-- association-led ecosystem-support route, not a direct subsidy or automatic
-- reimbursement for every participating business.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Department of Chemicals and Petrochemicals CPDS', 'https://chemicals.gov.in/chemicals-promotion-development-scheme', 'ministry_portal', 'central', 'monthly', 1, true, 'Official CPDS page with scheme guidelines, eligible industry-association route and application references; current calls and eligible cost terms require review.'),
  ('Department of Chemicals and Petrochemicals CPDS current overview', 'https://chemicals.gov.in/cpds', 'ministry_portal', 'central', 'monthly', 1, true, 'Official current CPDS overview describing scheme purpose and promotion/development activities.'),
  ('Department of Chemicals and Petrochemicals CPDS grant portal', 'https://cpds.chemicals.gov.in/', 'implementing_portal', 'central', 'weekly', 2, true, 'Official CPDS grant-in-aid portal for eligible NGO and government-body registrations; current call and document requirements require review.'),
  ('Department of Chemicals and Petrochemicals official portal', 'https://chemicals.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Official department portal for CPDS notices, amendments and current application updates.')
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
        "slug":"chemicals-promotion-development-scheme",
        "name":"Chemicals Promotion and Development Scheme",
        "type":"industry_association_support",
        "authority":"Department of Chemicals and Petrochemicals",
        "authority_url":"https://chemicals.gov.in/",
        "canonical_url":"https://chemicals.gov.in/cpds",
        "source_url":"https://chemicals.gov.in/cpds",
        "source_kind":"ministry",
        "source_title":"Chemical Promotion Development Scheme current overview",
        "source_anchor":"Objective, four components, eligible organizations/industry associations, grant-in-aid scope and current CPDS application references",
        "summary":"An association-led Department of Chemicals and Petrochemicals support route for studies, surveys, promotion, events, knowledge resources and development activities that strengthen the chemicals and petrochemicals sector.",
        "objective":"Support sector development, evidence-building, knowledge sharing and promotion of the Indian chemicals and petrochemicals industry through eligible organizations and industry associations.",
        "legal_basis":"Chemicals Promotion and Development Scheme implemented by the Department of Chemicals and Petrochemicals under the applicable guidelines, annual activity approvals and grant-in-aid conditions.",
        "eligibility":{"entity_types":["registered_industry_association","registered_organization","society","chamber_of_commerce","sector_body"],"lifecycle_stages":["operating","growth","scaling"],"industries":["chemicals","petrochemicals","downstream_plastics","specialty_chemicals","chemical_manufacturing"],"locations":["India"],"conditions":["applicant organization must satisfy the registration, governance and financial conditions in the current guidelines","proposal must promote or develop the chemicals and petrochemicals sector and fit an eligible CPDS activity","audited accounts, activity plan, budget, outputs and utilization evidence must be provided as required","activities and assistance are subject to official approval, sanction and grant conditions","participating companies may benefit indirectly through an approved association activity but are not automatically grant recipients"],"exclusions":["individual businesses applying for a direct CPDS subsidy without an eligible association route","activities outside the approved sector-promotion and development scope","claims that participation guarantees procurement, finance, sales or reimbursement","proposals without the required governance, financial, activity and utilization evidence"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://cpds.chemicals.gov.in/","route":"Review the current CPDS guidelines and notice, register the eligible organization on the official grant portal, prepare the association proposal and submit through the notified route when a call or application process is open","applicant_note":"UdyamVeda can help an association structure the proposal and member-benefit explanation, but the eligible organization must submit through the official department route and manage all grant records."},
        "fine_print":{"benefit_is_association_grant_support":true,"direct_company_subsidy":false,"eligible_activity_examples":["studies and surveys","sector reports and data banks","promotional materials and knowledge resources","approved industry-development events and activities"],"member_benefit_note":"Individual companies may receive discovery, knowledge, market-development or networking value through an approved association activity, but that does not create an individual grant entitlement.","review_note":"Confirm current activity categories, eligible organizations, maximum assistance, applicant contribution, event calendar, application window, sanction authority, release tranches, utilization certificate, audit, unspent funds and recovery conditions before publication."},
        "benefit_summary":{"types":["association_grant","sector_development","events_and_workshops"],"summary":"Potential grant-in-aid support for eligible organizations and industry associations carrying out approved chemicals and petrochemicals sector-promotion or development activities; it is not a direct individual-company subsidy."},
        "benefit_type":"association_grant",
        "benefit_label":"Sector-development support through eligible chemical-industry associations",
        "benefit_conditions":{"eligible_association_required":true,"approved_activity_required":true,"sanction_required":true,"utilization_reporting_required":true,"no_individual_company_grant_entitlement":true},
        "requirement":"Registered sector organization with an approved activity proposal",
        "requirement_description":"The applicant must provide registration and governance records, audited financials, a sector-development proposal, activity calendar, budget, expected outputs, member/industry benefit rationale and utilization-reporting plan required by the current CPDS route.",
        "rules":{"all":[{"field":"is_registered_sector_association","operator":"equals","value":true},{"field":"chemical_sector_development_activity_identified","operator":"equals","value":true},{"field":"association_proposal_evidence_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm the current CPDS activity route","description":"Check the official CPDS pages and department notices for current activity categories, calendar and application instructions.","url":"https://chemicals.gov.in/cpds"},{"title":"Prepare the association proposal","description":"Document the sector problem, eligible activity, participating industry, outputs, budget, governance, member benefit and utilization plan.","url":"https://chemicals.gov.in/chemicals-promotion-development-scheme"},{"title":"Submit through the official department route","description":"Use the notified official application or grant-in-aid route and retain the proposal, acknowledgement and sanction records.","url":"https://chemicals.gov.in/"},{"title":"Deliver, report and close the activity","description":"Complete the sanctioned activity, preserve evidence and submit utilization, outcome and audit documents in the format required by the current sanction.","url":"https://chemicals.gov.in/chemicals-promotion-development-scheme"}],
        "window_type":"call_for_applications",
        "window_label":"The scheme is an ongoing policy route with activity-specific approvals; current calls, calendars and application availability must be verified before presenting an action.",
        "window_evidence":{"source_url":"https://chemicals.gov.in/cpds","anchor":"Current CPDS overview and department activity/application updates"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Chemicals and Fertilizers', 'Department of Chemicals and Petrochemicals', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.84, 0.82, 'in_review')
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
    values
      (version_id, 'https://chemicals.gov.in/chemicals-promotion-development-scheme', 'ministry_portal', 'Department of Chemicals and Petrochemicals CPDS', 'Historical CPDS page with guideline and application references; reconcile with the current overview before publication.', now(), false),
      (version_id, 'https://cpds.chemicals.gov.in/', 'implementing_portal', 'Department of Chemicals and Petrochemicals CPDS grant portal', 'Official CPDS grant-in-aid portal registration and application handoff; current calls and document requirements require review.', now(), false)
    on conflict do nothing;
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
