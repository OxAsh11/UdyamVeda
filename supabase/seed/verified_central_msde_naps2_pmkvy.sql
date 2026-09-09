-- Central MSDE opportunity records from official evidence. These are not
-- publishable yet: the NAPS establishment route and the PMKVY/SIP transition,
-- current calls, local implementation and applicant documents require review.

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
        "slug":"msde-national-apprenticeship-promotion-scheme-2",
        "name":"Pradhan Mantri National Apprenticeship Promotion Scheme (PM-NAPS / NAPS-2)",
        "type":"apprenticeship_support",
        "authority":"Ministry of Skill Development and Entrepreneurship - PM-NAPS",
        "authority_url":"https://www.msde.gov.in/",
        "canonical_url":"https://www.apprenticeshipindia.gov.in/",
        "source_url":"https://www.pib.gov.in/PressReleasePage.aspx?PRID=2294856&lang=1&reg=1",
        "source_kind":"government_announcement",
        "source_title":"Industry-Aligned Skill Development and Apprenticeship Promotion",
        "source_anchor":"NAPS-2 continuity, establishment route, portal, DBT and stipend support",
        "summary":"Establishment-based apprenticeship support that helps Indian employers engage apprentices under the Apprentices Act, 1961, with a capped Central Government stipend contribution paid by DBT.",
        "objective":"Promote industry-led on-the-job training, support the transition from education to work and expand apprenticeship engagement across establishments and sectors, including MSMEs.",
        "legal_basis":"Apprentices Act, 1961 and the Pradhan Mantri National Apprenticeship Promotion Scheme under the Ministry of Skill Development and Entrepreneurship.",
        "eligibility":{"entity_types":["establishment","company","llp","msme","industry","eligible_employer"],"founder_categories":["employer","apprentice"],"lifecycle_stages":["hiring","workforce_development","skill_development"],"industries":["manufacturing","engineering","logistics","agriculture","food_processing","retail","healthcare","tourism_hospitality","it_ites","electronics","services"],"locations":["India"],"conditions":["the establishment must be eligible to engage apprentices under the Apprentices Act and current portal rules","the employer must create and manage eligible apprenticeship contracts and pay the prescribed stipend","the establishment and apprentice must complete the official portal and DBT-linked process","trade, qualification, age, training-period and establishment conditions depend on the current route and applicable rules"],"thresholds":{"government_stipend_share_percent_max":25,"government_stipend_support_max_inr_per_apprentice_per_month":1500,"naps2_since_financial_year":"2022-23"},"unknown_handling":"needs_information"},
        "exclusions":["a business treating the Central contribution as a general grant or unrestricted payroll reimbursement","Central or State Government departments, PSUs or other excluded establishments where the current support route does not provide stipend support","engagement outside the Apprentices Act, current apprenticeship portal and approved trade or contract route","an apprentice or employer whose age, trade, contract, bank, attendance or compliance evidence is not verified"],
        "application":{"portal":"https://www.apprenticeshipindia.gov.in/","route":"Register or update the establishment on the official apprenticeship portal, identify eligible trades and seats, engage apprentices, execute the required contract and complete stipend/DBT and reporting steps","selection":"Establishment and apprentice eligibility, trade and seat conditions, contract registration, portal validation and compliance during the apprenticeship period","fees":"Confirm current portal and third-party aggregator instructions; no fee entitlement is inferred from the scheme record","applicant_note":"UdyamVeda can prepare the establishment-readiness checklist and explain the portal handoff, but cannot create contracts, store OTPs or impersonate the employer or apprentice."},
        "fine_print":{"status":"NAPS continues as NAPS-2 from FY 2022-23 and is described by the Prime Minister Office as a component of the composite Skill India Programme.","benefit":"The Central Government share is limited to 25% of stipend paid by the establishment, subject to a maximum of Rs. 1,500 per month per apprentice during the training period, credited through DBT to the apprentice bank account.","employer_obligation":"The establishment remains responsible for the prescribed stipend, workplace training, contract, attendance, records, safety and other obligations; the Central share is not the employer's total benefit ceiling or a promise of approval.","route_note":"The official route uses the National Apprenticeship Portal with support from RDSDEs, State Apprenticeship Advisers and eligible Third Party Aggregators.","review_note":"Verify current establishment categories, excluded public bodies, age and trade rules, stipend schedule, contract templates, claim timing, attendance evidence, TPA route, portal availability and any transition instructions before publication."},
        "benefit_summary":{"types":["stipend_support","apprenticeship","workforce_development"],"summary":"Capped Central Government stipend contribution for eligible apprentices engaged by eligible establishments through the official apprenticeship route. Do not present it as a general employer grant or combine it with the establishment's own stipend obligation.","separate_value_buckets":true},
        "benefit_type":"stipend_support",
        "benefit_label":"PM-NAPS Central stipend contribution per apprentice",
        "amount_max":1500,
        "benefit_conditions":{"government_share_percent_max":25,"amount_max_unit":"INR per apprentice per month","dbt_to_apprentice":true,"establishment_stipend_obligation_remains":true,"apprenticeship_contract_required":true},
        "requirement":"Eligible establishment with an apprenticeship engagement plan",
        "requirement_description":"Prepare establishment registration, authorised signatory, eligible trade and seat details, workplace and trainer evidence, apprentice and contract information, stipend, attendance, bank and reporting records required by the current portal route.",
        "rules":{"all":[{"field":"eligible_apprenticeship_establishment","operator":"equals","value":true},{"field":"approved_trade_or_apprenticeship_route","operator":"equals","value":true},{"field":"apprenticeship_contract_and_stipend_plan_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Check establishment and trade eligibility","description":"Confirm the current Apprentices Act, portal, trade, seat, age, contract and public-body conditions before creating an engagement plan.","url":"https://www.apprenticeshipindia.gov.in/"},{"title":"Register the establishment and vacancies","description":"Use the official apprenticeship portal to complete establishment details, eligible trades, seats and required workplace or trainer information.","url":"https://www.apprenticeshipindia.gov.in/"},{"title":"Execute contracts and maintain records","description":"Engage apprentices through the official route, pay the prescribed stipend, maintain attendance and workplace-training evidence, and complete DBT-linked claims and reporting.","url":"https://www.pib.gov.in/PressReleasePage.aspx?PRID=2294856&lang=1&reg=1"}],
        "window_type":"rolling",
        "window_label":"The portal route is operational on a rolling establishment and apprenticeship-engagement basis, but seats, trades, contracts, claim timing and local implementation must be checked at the time of application.",
        "window_evidence":{"source_url":"https://www.pib.gov.in/PressReleasePage.aspx?PRID=2294856&lang=1&reg=1","anchor":"NAPS-2 portal, establishment engagement and DBT stipend support"},
        "review_note":"Current portal route, public-body exclusions, contract and claim rules, and any Skill India Programme transition instructions require human review."
      },
      {
        "slug":"msde-pradhan-mantri-kaushal-vikas-yojana-4",
        "name":"Pradhan Mantri Kaushal Vikas Yojana 4.0 (PMKVY 4.0)",
        "type":"skill_development",
        "authority":"Ministry of Skill Development and Entrepreneurship - PMKVY",
        "authority_url":"https://www.msde.gov.in/",
        "canonical_url":"https://www.skillindiadigital.gov.in/about-us",
        "source_url":"https://www.pmindia.gov.in/en/news_updates/cabinet-approves-continuation-and-restructuring-of-skill-india-programme/",
        "source_kind":"government_announcement",
        "source_title":"Cabinet Approves Continuation and Restructuring of Skill India Programme",
        "source_anchor":"PMKVY 4.0 under the composite Skill India Programme; beneficiary routes and industry-aligned training",
        "summary":"Industry-aligned skilling and reskilling route offering NSQF-aligned short-term training, special projects, recognition of prior learning and newer technology job roles through the Skill India ecosystem.",
        "objective":"Improve access to demand-driven vocational training, reskilling, upskilling, on-the-job exposure and recognized credentials for workers, aspiring entrepreneurs and other eligible beneficiaries.",
        "legal_basis":"Pradhan Mantri Kaushal Vikas Yojana 4.0 under the composite Central Sector Skill India Programme of the Ministry of Skill Development and Entrepreneurship.",
        "eligibility":{"entity_types":["individual","aspiring_entrepreneur","worker","self_employed_professional","training_provider","company","llp","society","trust","government_institution"],"founder_categories":["jobseeker","worker","entrepreneur","training_provider"],"lifecycle_stages":["pre_start","operate","workforce_development","skill_development"],"industries":["industry_aligned_job_roles","emerging_technology","manufacturing","services","digital","green_skills"],"locations":["India"],"conditions":["individual candidates must satisfy the current job-role, route and identity requirements","RPL candidates need prior experience in the relevant job role where required","training providers and RPL project entities must satisfy the current institutional, accreditation, infrastructure and project conditions","course, age, location, batch, assessment and certification availability must be confirmed on the current Skill India route"],"thresholds":{"short_term_training_age_years_min":15,"short_term_training_age_years_max":45,"rpl_age_years_max":59,"guideline_programme_period":"2022-23 to 2025-26"},"unknown_handling":"needs_information"},
        "exclusions":["a user treating PMKVY training provision as a guaranteed cash grant, loan or subsidy payable to the business","courses or job roles not currently available or approved on the official Skill India route","training-provider claims without the required legal entity, accreditation, infrastructure, disclosure and project evidence","duplicative or unverifiable training enrolment and certification claims"],
        "application":{"portal":"https://www.skillindiadigital.gov.in/about-us","route":"Use the current Skill India Digital discovery and registration route to identify available courses, centres, job roles, RPL or provider pathways; confirm the current PMKVY/SIP status before acting","selection":"Candidate or provider eligibility, job-role and demand assessment, centre/provider conditions, attendance, assessment, certification and scheme monitoring","fees":"Confirm the current centre or provider terms; this record does not infer a fee, stipend or cash entitlement","applicant_note":"UdyamVeda can recommend relevant training or help a business assess a provider pathway, but cannot guarantee a course seat, certificate, employment result or government payment."},
        "fine_print":{"status":"The Prime Minister Office describes PMKVY 4.0 as a component of the composite Skill India Programme, with the stated programme period running from 2022-23 to 2025-26. On 7 September 2026, current portal availability and any successor or continuation route must be rechecked before publication.","beneficiary_route":"The official material describes Short-Term Training, Special Projects, Recognition of Prior Learning, industry-oriented job roles, on-the-job exposure and Skill India Digital integration. This is a training and credential pathway, not a single business-funding award.","provider_route":"The PMKVY guideline permits legally established societies, trusts, proprietorships, companies, LLPs and government organisations to be training providers subject to current centre, accreditation, infrastructure, disclosure and project rules; provider onboarding is separate from candidate enrolment.","review_note":"Confirm the current PMKVY/SIP notice, active course and provider routes, age and identity conditions, job-role availability, centre accreditation, RPL evidence, assessment/certification rules and any transition after FY2025-26 before publication."},
        "benefit_summary":{"types":["training","skill_development","recognition_of_prior_learning","on_the_job_training"],"summary":"Access to eligible, industry-aligned training, reskilling, RPL and recognized certification routes through the Skill India ecosystem. No direct cash benefit is asserted for the learner or business.","separate_value_buckets":true},
        "benefit_type":"training",
        "benefit_label":"PMKVY 4.0 industry-aligned training and certification route",
        "benefit_conditions":{"cash_benefit_not_asserted":true,"course_and_provider_availability_required":true,"official_skill_india_route_required":true,"assessment_or_certification_conditions_apply":true},
        "requirement":"Eligible learner, worker, entrepreneur or approved training-provider pathway",
        "requirement_description":"Confirm the current beneficiary or provider route, identity and age conditions, job role or RPL evidence, course or project availability, centre/provider status and assessment or certification requirements.",
        "rules":{"all":[{"field":"current_skill_india_route_available","operator":"equals","value":true},{"field":"beneficiary_or_provider_route_eligible","operator":"equals","value":true},{"field":"course_job_role_or_project_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm the current PMKVY/SIP route","description":"Check the current MSDE and Skill India Digital route, because the published PMKVY 4.0 guideline period ends in FY2025-26 and transition status must be verified.","url":"https://www.pmindia.gov.in/en/news_updates/cabinet-approves-continuation-and-restructuring-of-skill-india-programme/"},{"title":"Choose a course, RPL or provider pathway","description":"Use the official digital ecosystem to identify available job roles, centres, short-term training, special projects, RPL or training-provider requirements.","url":"https://www.skillindiadigital.gov.in/about-us"},{"title":"Complete the official training lifecycle","description":"Follow enrolment or provider onboarding, attendance, assessment, certification, disclosure and monitoring requirements applicable to the selected route.","url":"https://www.msde.gov.in/static/uploads/2025/09/20d9aac4ce972a765e83f28682536ee0.pdf"}],
        "window_type":"rolling",
        "window_label":"Course, batch, RPL and provider opportunities depend on the current Skill India Digital and MSDE route. No universal deadline or cash entitlement is asserted; the post-FY2025-26 continuation status requires current verification.",
        "window_evidence":{"source_url":"https://www.pmindia.gov.in/en/news_updates/cabinet-approves-continuation-and-restructuring-of-skill-india-programme/","anchor":"Skill India Programme period, PMKVY 4.0 components and current beneficiary routes"},
        "review_note":"This record must not publish as an active universal opportunity until current PMKVY/SIP status, portal availability and course/provider routes are rechecked."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, official_url)
    select item->>'authority', 'central', 'Ministry of Skill Development and Entrepreneurship', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.88, 0.84, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1; end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, 'https://www.msde.gov.in/', 'ministry_portal', 'MSDE official portal', 'Ministry programme and implementation portal', now(), false),
      (version_id, 'https://www.skillindiadigital.gov.in/about-us', 'agency_portal', 'Skill India Digital official about page', 'Digital discovery and delivery route', now(), false),
      (version_id, 'https://www.apprenticeshipindia.gov.in/', 'agency_portal', 'National Apprenticeship Promotion Scheme portal', 'Establishment and apprenticeship portal route', now(), false)
    on conflict do nothing;
    if item->>'slug' = 'msde-pradhan-mantri-kaushal-vikas-yojana-4' then
      insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
      values
        (version_id, 'https://www.msde.gov.in/static/uploads/2025/09/20d9aac4ce972a765e83f28682536ee0.pdf', 'guideline', 'MSDE PMKVY 4.0 guidelines', 'Training provider, beneficiary and RPL requirements', now(), false)
      on conflict do nothing;
    else
      insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
      values
        (version_id, 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2294856&lang=1&reg=1', 'government_announcement', 'PIB NAPS-2 industry-aligned skill development release', 'NAPS-2, establishments, portal and DBT stipend support', now(), false)
      on conflict do nothing;
    end if;

    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', case when item ? 'amount_max' then (item->>'amount_max')::numeric else null end, case when item ? 'percentage' then (item->>'percentage')::numeric else null end, item->'benefit_conditions'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = item->>'benefit_label');
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'eligibility', item->>'requirement', item->>'requirement_description', true
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
