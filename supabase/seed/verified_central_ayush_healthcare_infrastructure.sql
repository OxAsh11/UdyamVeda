-- AYUSH healthcare infrastructure grant record. The official scheme document
-- includes investor/SME/organization language, but current calls, sanction
-- availability and project-specific grant terms require manual verification.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Ministry of AYUSH AYUSH hospital and day-care updated guidelines', 'https://ngo.ayush.gov.in/Default/assets/front/documents/Updated_Guidelines_of_CSSS_(Hospital).pdf', 'guideline', 'central', 'monthly', 1, true, 'Official Ministry of AYUSH updated guideline for establishment of AYUSH super-speciality hospitals and day-care centres; the stated scheme validity ends 31 March 2024 unless extended by competent authority.'),
  ('Ministry of AYUSH AYUSH hospital and day-care original guidelines', 'https://ngo.ayush.gov.in/Default/assets/front/documents/Guidelines-for-Central-Sector-Schemem-for-Establishment-of-AYUSHSuper-Speciality-Hospitals-and-Day-care-centres_0.pdf', 'guideline_historical', 'central', 'monthly', 1, true, 'Historical official guideline retained for version comparison; do not use it alone to infer a current application window.'),
  ('Ministry of AYUSH parliamentary record for medical value travel', 'https://www.ayush.gov.in/resources/pdf/Parliament/budget2023.pdf', 'parliamentary_record', 'central', 'monthly', 1, true, 'Official parliamentary record confirming the interest-subsidy form, maximum category reference and component outlay; not an applicant entitlement.'),
  ('Ministry of AYUSH official portal', 'https://ayush.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Ministry of AYUSH portal for current notices, amendments and scheme updates.'),
  ('AYUSH Anudan portal', 'https://ngo.ayush.gov.in/', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Official AYUSH grant portal for central-sector scheme proposals and funding workflows; current portal status and applicant route require review.')
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
        "slug":"ayush-super-speciality-hospital-day-care-infrastructure",
        "name":"AYUSH Super-Speciality Hospital and Day-Care Centre Infrastructure Support",
        "type":"grant",
        "authority":"Ministry of AYUSH",
        "authority_url":"https://ayush.gov.in/",
        "canonical_url":"https://ngo.ayush.gov.in/",
        "source_url":"https://ngo.ayush.gov.in/Default/assets/front/documents/Updated_Guidelines_of_CSSS_(Hospital).pdf",
        "source_kind":"guideline",
        "source_title":"Guidelines for Central Sector Scheme for Establishment of AYUSH Super-Speciality Hospitals and Day-care Centres",
        "source_anchor":"Project eligibility, investor/SME/organization conditions, PSC consideration, CPMU implementation and grant conditions",
        "summary":"A historical Central Sector Scheme route in which eligible private investors could receive interest subsidy for AYUSH super-speciality hospitals and day-care centres, subject to project appraisal, loan and sanction conditions.",
        "objective":"Expand AYUSH healthcare infrastructure and support establishment of eligible hospitals and day-care centres through a documented project proposal, appraisal and sanctioned grant process.",
        "legal_basis":"Central Sector Scheme for Medical Value Travel under the Champion Services Sector Scheme, implemented through Ministry of AYUSH guidelines and interest-subsidy conditions; the cited updated guideline states validity up to 31 March 2024 unless extended by competent authority.",
        "eligibility":{"entity_types":["company","private_limited","public_limited","msme","trust","society","registered_organization","investor"],"lifecycle_stages":["operating","growth","scaling"],"industries":["ayush_healthcare","hospitals","day_care_centres","healthcare_infrastructure"],"locations":["India"],"conditions":["applicant must fall within the organization/investor categories and conditions in the current guidelines","project must establish an eligible AYUSH super-speciality hospital or day-care centre","land, building, equipment, clinical, staffing, financial and statutory evidence must be provided as required","proposal must pass the prescribed scrutiny and Project Screening Committee process","grant use, milestones, monitoring, reporting and asset conditions apply after sanction"],"exclusions":["projects outside the eligible AYUSH healthcare infrastructure scope","claims that a guideline or proposal submission guarantees sanction","diversion or unauthorized use of sanctioned grant assets or funds","applicants unable to satisfy the current legal, technical, financial and operational conditions"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://ngo.ayush.gov.in/","route":"review the current Ministry of AYUSH guideline and portal instructions, prepare the project proposal and supporting evidence, and submit through the official grant route if a current call is available","applicant_note":"UdyamVeda can help structure the project checklist and explain the official handoff, but the applicant must submit through the official portal and remain responsible for the proposal, declarations and grant conditions."},
        "fine_print":{"benefit_is_interest_subsidy":true,"grant_or_subsidy":false,"interest_subsidy_is_sanction_based":true,"maximum_interest_subsidy_50_bed_hospital_inr":81500000,"maximum_interest_subsidy_10_bed_hospital_inr":24500000,"maximum_interest_subsidy_day_care_inr":9800000,"maximum_interest_rate_percent":9,"subsidy_schedule_percent":[100,70,50,40,20],"scheme_valid_until":"2024-03-31 unless extended by competent authority","project_completion_limit_years":3,"operational_obligation_years":15,"implementation_body":"SIDBI is engaged to channel the interest subsidy through financial institutions/banks under the Ministry of AYUSH scheme.","asset_and_use_conditions":"The facility must meet sanctioned project, monitoring, operational and affidavit conditions; breach, premature termination or misrepresentation can require repayment with penal interest.","review_note":"Confirm any official extension or current call, eligible applicant definitions, project category, cost heads, applicant contribution, actual-loan boundary, release conditions, clinical/statutory approvals, monitoring, audit, operational obligation and clawback conditions before publication."},
        "benefit_summary":{"types":["interest_subsidy","healthcare_infrastructure_support"],"summary":"Historical interest-subsidy support for an eligible AYUSH hospital or day-care infrastructure project; category caps, actual loan, interest rate, sanction and project conditions apply, and no current 2026 intake is established."},
        "benefit_type":"interest_subsidy",
        "benefit_label":"Interest subsidy for eligible AYUSH healthcare infrastructure",
        "benefit_conditions":{"eligible_project_required":true,"project_appraisal_required":true,"loan_in_principle_required":true,"sanction_required":true,"actual_loan_and_interest_cap_apply":true,"operational_and_monitoring_conditions_apply":true},
        "requirement":"Eligible AYUSH project proposal and organizational/financial evidence",
        "requirement_description":"The applicant must prepare the entity and governance evidence, project report, land/building and equipment details, AYUSH service plan, staffing, statutory approvals, financing plan, milestones and other documents required by the current official route.",
        "rules":{"all":[{"field":"is_eligible_healthcare_organization_or_investor","operator":"equals","value":true},{"field":"ayush_infrastructure_project_identified","operator":"equals","value":true},{"field":"project_proposal_evidence_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm the project category and current call","description":"Check the official Ministry and AYUSH Anudan sources for a current call and confirm that the proposed facility fits the eligible hospital or day-care category.","url":"https://ngo.ayush.gov.in/"},{"title":"Prepare the project proposal","description":"Assemble the organization, land, building, clinical, staffing, equipment, statutory, financial and implementation evidence required by the current guidelines.","url":"https://ngo.ayush.gov.in/Default/assets/front/documents/Guidelines-for-Central-Sector-Schemem-for-Establishment-of-AYUSHSuper-Speciality-Hospitals-and-Day-care-centres_0.pdf"},{"title":"Submit through the official grant route","description":"Use the official portal or notified submission route with the applicant's own credentials and retain the submitted proposal and acknowledgements.","url":"https://ngo.ayush.gov.in/"},{"title":"Complete appraisal and sanctioned milestones","description":"Respond to scrutiny and Project Screening Committee requirements, then comply with sanction-letter, release, monitoring, reporting, audit and asset-use conditions.","url":"https://ayush.gov.in/"}],
        "window_type":"closed",
        "window_label":"The updated guideline states scheme validity up to 31.03.2024 unless extended by competent authority. No current 2026 call or extension was established; do not present the historical portal route as an open application action.",
        "window_evidence":{"source_url":"https://ngo.ayush.gov.in/Default/assets/front/documents/Updated_Guidelines_of_CSSS_(Hospital).pdf","anchor":"Sections 3(ii) and 6: scheme valid up to 31.03.2024 and may be extended only after approval of the competent authority"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, official_url)
    select item->>'authority', 'central', item->>'authority', item->>'authority_url'
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
