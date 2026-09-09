-- IN-SPACe Seed Fund record. The official scheme document describes a
-- milestone-based seed grant for space-sector startups and MSEs, but the
-- current portal evidence found here is a results/use-case page rather than a
-- verified open 2026 application call. Keep the record paused and review-gated.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('IN-SPACe Seed Fund Scheme', 'https://www.inspace.gov.in/sys_attachment.do?sys_id=7adb190c4703aa10d4bc5b31516d43fc', 'scheme_guideline', 'central', 'monthly', 1, true, 'Official IN-SPACe seed-fund scheme document for startups and micro/small enterprises in the commercial space sector.'),
  ('IN-SPACe Seed Fund earlier scheme document', 'https://www.inspace.gov.in/sys_attachment.do?sys_id=2d09969c879a755082e163d70cbb3518', 'scheme_guideline', 'central', 'monthly', 1, true, 'Official IN-SPACe scheme document containing eligibility, Indian ownership, matching contribution, grant ceiling, milestones and application conditions.'),
  ('IN-SPACe official portal', 'https://www.inspace.gov.in/', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Official Indian National Space Promotion and Authorisation Centre portal; current homepage includes Seed Fund results/use-case information and current announcements.'),
  ('IN-SPACe Seed Fund knowledge article', 'https://www.inspace.gov.in/inspace?id=kb_article&sysparm_article=KB0010016', 'implementing_agency_portal', 'central', 'monthly', 1, true, 'Official IN-SPACe knowledge article for the Seed Fund Scheme.'),
  ('IN-SPACe Seed Fund 2026 results', 'https://www.inspace.gov.in/inspace?id=results_seedfund_2026', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Official IN-SPACe results route; results do not by themselves establish a current application window.'),
  ('Department of Space official IN-SPACe context', 'https://www.inspace.gov.in/inspace?id=kb_article&sysparm_article=KB0010003', 'department_portal', 'central', 'monthly', 1, true, 'Official IN-SPACe institutional context and Department of Space relationship.')
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
        "slug":"in-space-seed-fund",
        "name":"IN-SPACe Seed Fund Scheme",
        "type":"grant",
        "lifecycle_status":"paused",
        "authority":"Indian National Space Promotion and Authorisation Centre (IN-SPACe)",
        "authority_url":"https://www.inspace.gov.in/",
        "canonical_url":"https://www.inspace.gov.in/",
        "source_url":"https://www.inspace.gov.in/sys_attachment.do?sys_id=7adb190c4703aa10d4bc5b31516d43fc",
        "source_kind":"official_scheme_guideline",
        "source_title":"IN-SPACe Seed Fund Scheme",
        "source_anchor":"Pages 2-7: scheme purpose, space-sector focus, applicant conditions, grant structure, milestone disbursement, utilization and application announcement route",
        "summary":"A milestone-based seed grant route formulated by IN-SPACe for eligible Indian space-sector startups and micro/small enterprises developing technology-led products or services.",
        "objective":"Provide early-stage support for research and development of novel space-sector technologies and help eligible non-government entities move toward demonstration and commercialization.",
        "legal_basis":"IN-SPACe Seed Fund Scheme document issued by the Indian National Space Promotion and Authorisation Centre under the Department of Space; the operative announcement and any later amendment control the live application route.",
        "eligibility":{"entity_types":["dpiit_recognized_startup","micro_enterprise","small_enterprise","company"],"lifecycle_stages":["idea","prototype","early_stage","validation"],"industries":["space_technology","space_applications","satellite","launch_vehicle","earth_observation","navigation","communications","space_data","aerospace"],"locations":["India"],"conditions":["applicant must be an eligible startup or micro/small enterprise under the controlling IN-SPACe call","technology must be core to the product or service and relevant to the commercial space sector","Indian shareholding by employees, promoters and angel investors must meet the stated minimum of 80 percent, subject to the controlling document","promoters and angel investors must have invested at least the requested grant amount at application time","the startup must not have received more than INR 50 lakh of monetary support under other Central or State Government schemes, subject to stated exclusions","project must be suitable for milestone-based research, development, testing, validation or demonstration","applicant must comply with any additional criteria stated by IN-SPACe and the current announcement"],"exclusions":["a results page or historical announcement does not prove that a new application window is open","the INR 1 crore ceiling is not an automatic award and the Experts Committee decides the exact amount and instalments","venture-capital investment may be permitted but does not remove the other ownership, funding-round or scheme conditions","prize money, subsidized workspace, lab access and prototype-facility access must be treated only as the specific exclusions stated in the controlling document","unverified space activity, ownership, milestone or commercialization claims cannot be used to recommend eligibility"],"thresholds":{"indian_shareholding_min_percent":80,"maximum_other_government_monetary_support_inr":5000000,"maximum_grant_inr":10000000,"promoter_and_angel_investment_must_match_requested_grant":true,"grant_first_installment_up_to_percent":40,"grant_utilization_period_years":3},"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.inspace.gov.in/","route":"Monitor the official IN-SPACe announcement route, prepare the space-technology, ownership, funding, milestone, budget and commercialization dossier, and apply only through the current official call or notified IN-SPACe route.","selection":"An Experts Committee determines the exact grant quantum and instalments based on the project and progress; selection is not automatic.","fees":"No application fee is established by the reviewed scheme documents; verify the current announcement before submission.","applicant_note":"UdyamVeda may explain the scheme and prepare a checklist, but the applicant must use its own IN-SPACe account, declarations and submission route."},
        "fine_print":{"benefit_is_grant_support":true,"grant_ceiling_inr":10000000,"grant_structure":"Up to INR 1 crore, released on milestones in three or more instalments; the first instalment may be up to 40 percent of the approved commitment.","duration":"The grant should be fully utilized within three years from receipt of the first instalment.","accountability":"The recipient must maintain proper accounts, submit utilization certificates, allow verification/audit and submit a final report and audited utilization certificate.","ip":"IPR generated under the programme is stated to be owned by the startup.","current_portal_state":"The official IN-SPACe portal currently exposes Seed Fund results/use-case information and announcements, but the reviewed evidence does not establish a currently open 2026 application window.","window_note":"Keep paused until a current announcement, closing date and operative application route are verified.","review_note":"Reconcile the current announcement with the scheme document, confirm startup/MSE definitions, Indian ownership, funding-round treatment, matching investment, prior-government-support calculation, space-sector scope, milestones, eligible costs, documents, committee process, audit, IP and any amendment before publication."},
        "benefit_summary":{"types":["grant"],"summary":"Milestone-based seed grant of up to INR 1 crore for eligible space-sector startups under the scheme document; the exact award is committee-determined and the current application window is not verified.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"IN-SPACe milestone-based seed grant up to INR 1 crore",
        "benefit_conditions":{"maximum_grant_inr":10000000,"milestone_release_required":true,"experts_committee_decision_required":true,"first_installment_up_to_percent":40,"utilization_period_years":3,"current_call_required":true},
        "requirement":"Eligible Indian space-technology startup or micro/small enterprise with ownership, matching-investment, prior-support and milestone evidence",
        "requirement_description":"Prepare incorporation/startup or MSE evidence, Indian shareholding and promoter/angel investment records, prior-government-support declaration, technical and commercial plan, milestones, budget, IP and utilization/audit commitments required by the current IN-SPACe announcement.",
        "rules":{"all":[{"field":"eligible_startup_or_micro_small_enterprise","operator":"equals","value":true},{"field":"space_technology_is_core_to_product_or_service","operator":"equals","value":true},{"field":"indian_shareholding_percent","operator":"greater_than_or_equal","value":80},{"field":"promoter_and_angel_investment_matches_requested_grant","operator":"equals","value":true},{"field":"prior_government_support_within_limit","operator":"equals","value":true},{"field":"current_inspace_call_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Verify the current IN-SPACe call","description":"Check the official IN-SPACe announcements/results route for a current call, closing date, operative document and application route before treating the record as actionable.","url":"https://www.inspace.gov.in/"},{"title":"Classify the applicant and space scope","description":"Confirm startup or micro/small enterprise status, core space-technology relevance, Indian shareholding and any current additional criteria.","url":"https://www.inspace.gov.in/sys_attachment.do?sys_id=7adb190c4703aa10d4bc5b31516d43fc"},{"title":"Prepare ownership, funding and project evidence","description":"Assemble the cap table, promoter/angel investment, prior-government-support declaration, technical dossier, milestones, budget, commercialization plan and IP position.","url":"https://www.inspace.gov.in/sys_attachment.do?sys_id=2d09969c879a755082e163d70cbb3518"},{"title":"Submit and manage milestone reporting","description":"Apply through the current notified IN-SPACe route if open, then retain the agreement, milestone evidence, accounts, utilization certificates, audit records and final report.","url":"https://www.inspace.gov.in/inspace?id=kb_article&sysparm_article=KB0010016"}],
        "window_type":"call_for_applications",
        "window_label":"Announcement-based route; the reviewed official portal shows Seed Fund results/use-case information, but no current 2026 application window has been verified.",
        "window_evidence":{"source_url":"https://www.inspace.gov.in/","anchor":"Current official portal lists Seed Fund - Use Case Demonstration results and current announcements; this does not establish an open application call."}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Department of Space', 'Indian National Space Promotion and Authorisation Centre', item->>'authority_url'
    where not exists (select 1 from public.authorities where name = item->>'authority')
    returning id into authority_id;
    if authority_id is null then
      select id into authority_id from public.authorities where name = item->>'authority' limit 1;
    end if;

    seed_opportunity_id := null;
    insert into public.opportunities (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (item->>'slug', item->>'name', item->>'type', coalesce(item->>'lifecycle_status', 'in_review'), authority_id, '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, authority_id = excluded.authority_id, canonical_url = excluded.canonical_url, status = excluded.status
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then
      select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1;
    end if;

    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.86, 0.82, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = coalesce(item->>'lifecycle_status', 'in_review') where public.opportunities.id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, 'https://www.inspace.gov.in/', 'implementing_agency_portal', 'IN-SPACe official portal', 'Current homepage Seed Fund results/use-case information and announcements', now(), false),
      (version_id, 'https://www.inspace.gov.in/sys_attachment.do?sys_id=2d09969c879a755082e163d70cbb3518', 'scheme_guideline', 'IN-SPACe Seed Fund earlier scheme document', 'Eligibility, Indian ownership, matching investment, grant ceiling, milestones and application announcement', now(), false),
      (version_id, 'https://www.inspace.gov.in/inspace?id=results_seedfund_2026', 'implementing_agency_portal', 'IN-SPACe Seed Fund 2026 results', 'Results route; does not prove a current application window', now(), false),
      (version_id, 'https://www.inspace.gov.in/inspace?id=kb_article&sysparm_article=KB0010016', 'implementing_agency_portal', 'IN-SPACe Seed Fund knowledge article', 'Official Seed Fund article and application context', now(), false)
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
