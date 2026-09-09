-- NIDHI Entrepreneur-in-Residence. Review-gated because the fellowship is
-- incubator-mediated and the current page/guideline differ on duration.

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
        "slug":"dst-nidhi-entrepreneur-in-residence-fellowship",
        "name":"NIDHI Entrepreneur-in-Residence (EIR) Fellowship",
        "type":"grant",
        "status":"active",
        "authority":"Department of Science and Technology (DST)",
        "authority_url":"https://dst.gov.in/",
        "canonical_url":"https://nidhi.dst.gov.in/nidhieir/",
        "source_url":"https://nidhi.dst.gov.in/nidhieir/",
        "source_kind":"ministry",
        "source_title":"NIDHI Entrepreneur-in-Residence official programme page",
        "source_anchor":"Introduction, programme management, application route and beneficiaries: technology-idea fellowship, INR 10,000-30,000 monthly, current page maximum 12 months, selected TBI route",
        "summary":"Incubator-mediated NIDHI fellowship for Indian graduate students, researchers, innovators and entrepreneurs pursuing a promising technology business idea.",
        "objective":"Reduce the personal risk of pursuing a technology venture by combining a fellowship with TBI infrastructure, mentoring, technical and financial advice, and industry connections.",
        "legal_basis":"DST/NSTEDB NIDHI Entrepreneur-in-Residence programme page and NIDHI-EIR guidelines updated April 2022; current NIDHI-EIR centre notice and programme terms control the live application.",
        "eligibility":{"entity_types":["indian_citizen","graduate_student","researcher","innovator","aspiring_entrepreneur","budding_entrepreneur"],"lifecycle_stages":["idea","pre_seed","prototype","pre_incubation"],"industries":["technology","science_and_engineering","deep_technology","knowledge_based_business","sector_agnostic"],"locations":["India","selected_nidhi_eir_centre"],"conditions":["applicant must be an Indian citizen","applicant must meet the formal education or equivalent education-plus-work-experience condition in the current guideline","applicant must propose one promising technology business idea and be committed to exploring it full time","applicant must be admitted to or registered in the pre-incubation/incubation programme of a selected NIDHI-EIR TBI for the support period","support cannot be treated as concurrent with another remuneration or fellowship and the applicant must disclose material prior company ownership or support","selection is made by the selected TBI under the current NIDHI-EIR process"],"thresholds":{"monthly_support_min_inr":10000,"monthly_support_max_inr":30000,"current_page_max_period_months":12,"guideline_extension_max_period_months":18,"minimum_formal_education_years":4,"alternative_education_plus_work_years":5,"significant_other_company_shareholding_max_percent":10},"unknown_handling":"needs_information"},
        "exclusions":["not a universal direct DST application or guaranteed grant","support is available only through selected NIDHI-EIR centres/TBIs and each centre may have its own call, format and selection process","the current official programme page states a maximum 12-month period, while the April 2022 guideline permits extension from 12 to 18 months for deserving candidates; do not infer the extension without current committee approval","monthly fellowship support is not the same as a startup grant, investment, loan or combined total eligible value","full-time commitment, no concurrent remuneration/fellowship, education, technology-idea, TBI admission and company-ownership restrictions apply","the TBI can review progress and may terminate support for non-performing recipients under the guideline"],
        "application":{"portal":"https://nidhi.dst.gov.in/nidhieir/","route":"Identify a selected NIDHI-EIR centre/TBI with a current call, prepare the technology idea and education/experience evidence, apply through the centre’s prescribed route, and complete its selection, pre-incubation and review process.","selection":"Selected NIDHI-EIR TBIs receive applications locally and select support grantees using their qualifying criteria and committee process; DST/NSTEDB oversees the programme framework.","fees":"No applicant fee is stated on the reviewed NIDHI programme page. Any centre-specific fee, equity, incubation or co-working term must be verified before acceptance.","applicant_note":"UdyamVeda may prepare the idea, founder, education, ownership and application checklist, but must not impersonate the applicant, control the TBI account or promise fellowship selection."},
        "fine_print":{"current_page_terms":"The current NIDHI-EIR programme page states monthly support from INR 10,000 to INR 30,000 for a maximum period of 12 months, plus TBI infrastructure, mentoring, technical/financial advice and industry connections.","guideline_duration_conflict":"The official guideline updated April 2022 states support for 12 months extendable up to 18 months for deserving candidates subject to approval by the selection committee at the respective TBI. This is a conditional extension, not an automatic 18-month entitlement.","formal_eligibility":"The guideline requires Indian citizenship, the specified science/engineering education or education-plus-work path, full-time pursuit of a scalable technology business, a prescribed idea/business plan, TBI registration and restrictions on concurrent remuneration and significant ownership of another company.","route":"The NIDHI page identifies selected TBIs/NIDHI-EIR centres as the startup and innovator application route; a central page listing the programme is not itself an application approval.","review_note":"Before publication, verify the current centre list, live call, application form, education equivalence, current monthly support, 12/18-month duration treatment, TBI admission, selection committee, non-concurrent-income rule, ownership restriction, milestones, termination, reporting and any amended guideline."},
        "benefit_summary":{"types":["grant","training","mentorship"],"summary":"Selected EIRs may receive a monthly fellowship plus TBI infrastructure and mentoring to develop a technology business idea; current duration and any extension must be verified at the centre level.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"NIDHI-EIR fellowship of INR 10,000 to INR 30,000 per month through a selected TBI",
        "amount_max":null,
        "percentage":null,
        "benefit_conditions":{"monthly_support_min_inr":10000,"monthly_support_max_inr":30000,"current_page_max_period_months":12,"guideline_extension_max_period_months":18,"selected_tbi_required":true,"fellowship_not_startup_grant":true},
        "requirement":"Indian technology entrepreneur, education/experience evidence and selected TBI route",
        "requirement_description":"Provide nationality, education or education-plus-work evidence, technology business idea, business plan/presentation, full-time commitment, current income/fellowship disclosure, company ownership disclosure, TBI admission and current centre application documents.",
        "rules":{"all":[{"field":"indian_citizenship_verified","operator":"equals","value":true},{"field":"education_or_experience_criteria_verified","operator":"equals","value":true},{"field":"technology_business_idea_verified","operator":"equals","value":true},{"field":"selected_nidhi_eir_tbi_route_verified","operator":"equals","value":true},{"field":"full_time_and_no_concurrent_fellowship_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Find a current NIDHI-EIR centre or call","description":"Use the official NIDHI page and current centre list to identify a selected TBI with an open local call; do not treat the programme index as an open application notice.","url":"https://nidhi.dst.gov.in/nidhieir/"},{"title":"Verify founder eligibility","description":"Prepare Indian citizenship, science/engineering education or alternative education-plus-work evidence, full-time commitment and non-concurrent-fellowship declarations.","url":"https://cdnbbsr.s3waas.gov.in/s312b1e42dc0746f22cf361267de07073f/uploads/2023/01/2023010680.pdf"},{"title":"Prepare the technology venture dossier","description":"Document the promising technology idea, business plan, presentation, technology uncertainty, market path, founder background and any IP or research linkage.","url":"https://nidhi.dst.gov.in/nidhieir/"},{"title":"Apply and complete TBI selection","description":"Apply through the selected centre, complete its committee and pre-incubation route, and track fellowship instalments, mentoring, reporting and any conditional extension separately.","url":"https://cdnbbsr.s3waas.gov.in/s312b1e42dc0746f22cf361267de07073f/uploads/2023/01/2023010680.pdf"}],
        "window_type":"rolling",
        "window_label":"Centre-mediated rolling programme; each selected TBI announces its own call and deadline. No nationwide closing date is asserted.",
        "window_evidence":{"source_url":"https://nidhi.dst.gov.in/nidhieir/","anchor":"How To Apply: students and innovators apply through selected NIDHI-EIR centres/TBIs; current centre calls must be checked individually."},
        "review_note":"Keep review-gated. Present monthly support and the current 12-month page term separately from the conditional guideline extension to 18 months."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Science and Technology', 'Department of Science and Technology', item->>'authority_url'
    where not exists (select 1 from public.authorities where name = item->>'authority')
    returning id into authority_id;
    if authority_id is null then
      select id into authority_id from public.authorities where name = item->>'authority' limit 1;
      update public.authorities set official_url = item->>'authority_url' where id = authority_id;
    end if;
    seed_opportunity_id := null;
    insert into public.opportunities (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (item->>'slug', item->>'name', item->>'type', item->>'status', authority_id, '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, status = excluded.status, authority_id = excluded.authority_id, canonical_url = excluded.canonical_url
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1; end if;
    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.94, 0.9, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1; end if;
    update public.opportunities set current_version_id = version_id, status = item->>'status' where id = seed_opportunity_id;
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true),
      (version_id, 'https://nidhi.dst.gov.in/schemes-programmes/', 'ministry_portal', 'NIDHI schemes and programmes index', 'Index lists NIDHI-EIR among the current programme components', now(), false),
      (version_id, 'https://nidhi.dst.gov.in/about-department/about-nidhi/', 'ministry', 'About NIDHI and implementation route', 'NIDHI offerings are disbursed through eligible DST/NSTEDB-associated incubators', now(), false),
      (version_id, 'https://cdnbbsr.s3waas.gov.in/s312b1e42dc0746f22cf361267de07073f/uploads/2023/01/2023010680.pdf', 'guideline', 'NIDHI-EIR guidelines updated April 2022', 'Pages 2-8: duration, support, eligibility, TBI route, selection and monitoring', now(), false)
    on conflict do nothing;
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', null, null, item->'benefit_conditions'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = item->>'benefit_label');
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'incubation', item->>'requirement', item->>'requirement_description', true
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
