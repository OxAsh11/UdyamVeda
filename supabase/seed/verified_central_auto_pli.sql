-- Ministry of Heavy Industries PLI-Auto record. This remains review-gated:
-- the scheme period and official implementation pages do not by themselves
-- prove that a new applicant window is open.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Ministry of Heavy Industries official portal', 'https://www.heavyindustries.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Ministry of Heavy Industries portal for scheme notices, amendments and implementation updates.'),
  ('Ministry of Heavy Industries PLI-Auto overview', 'https://www.heavyindustries.gov.in/en/pli-scheme-automobile-and-auto-component-industry', 'ministry_portal', 'central', 'weekly', 1, true, 'Official PLI-Auto overview with scheme period, target advanced automotive technology products and official portal route.'),
  ('Ministry of Heavy Industries PLI-Auto guidelines', 'https://www.heavyindustries.gov.in/sites/default/files/2023-09/PLI%20AUto%20Guidelines.pdf', 'gazette_guidelines', 'central', 'monthly', 1, true, 'Official Gazette guidelines for the PLI Scheme for Automobile and Auto Component Industry.'),
  ('Ministry of Heavy Industries PLI-Auto amendments and manufacturer list', 'https://heavyindustries.gov.in/en/the-production-linked-incentive-pli-scheme-for-automobile-and-auto-components', 'ministry_portal', 'central', 'monthly', 1, true, 'Official amendments and approved-manufacturer updates for current implementation and change detection.'),
  ('Ministry of Heavy Industries PLI-Auto PMP amendment', 'https://heavyindustries.gov.in/sites/default/files/2024-09/notification_on_pmp_in_pli_auto_06092024.pdf', 'gazette_amendment', 'central', 'monthly', 1, true, 'Official 6 September 2024 amendment to the PLI-Auto domestic-value-addition and phased-manufacturing mechanism.'),
  ('PLI-Auto official application portal', 'https://pliauto.in/', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Official PLI-Auto application and implementation portal; current access and claim workflow require review.')
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
        "slug":"production-linked-incentive-automobile-auto-components",
        "name":"Production Linked Incentive Scheme for Automobile and Auto Component Industry",
        "type":"manufacturing_incentive",
        "authority":"Ministry of Heavy Industries",
        "authority_url":"https://www.heavyindustries.gov.in/",
        "canonical_url":"https://www.heavyindustries.gov.in/en/pli-scheme-automobile-and-auto-component-industry",
        "source_url":"https://www.heavyindustries.gov.in/sites/default/files/2023-09/PLI%20AUto%20Guidelines.pdf",
        "source_kind":"gazette_guidelines",
        "source_title":"PLI Scheme Guidelines for Automobile and Auto Component Industry",
        "source_anchor":"Sections 1.1-1.4; scheme objective, advanced automotive technology products and implementation framework",
        "summary":"A production-linked incentive framework for eligible automobile and auto-component manufacturers focused on Advanced Automotive Technology products and deeper localization of the automotive value chain.",
        "objective":"Boost domestic manufacturing and attract investment in the automotive manufacturing value chain, with emphasis on advanced automotive technology products and zero-emission vehicle technologies.",
        "legal_basis":"Government of India PLI-Auto notification and guidelines issued by the Ministry of Heavy Industries on 23 September 2021, as amended by later official notifications and guidelines.",
        "eligibility":{"entity_types":["company","private_limited","public_limited","automobile_oem","auto_component_manufacturer"],"lifecycle_stages":["operating","growth","scaling"],"industries":["automobile","auto_components","advanced_automotive_technology","electric_vehicle","hydrogen_fuel_cell_vehicle"],"locations":["India"],"conditions":["applicant must satisfy the applicable Indian company and manufacturer criteria","product must be an eligible Advanced Automotive Technology product or component under the current guidelines","global-group revenue, domestic investment, sales, domestic value addition and other track conditions must be evidenced","the applicant must satisfy the applicable scheme approval, testing, localization, reporting and claim conditions","the official implementation and application route must be followed"],"exclusions":["products outside the current eligible AAT list","claims based only on the scheme budgetary outlay","applications or claims that ignore current amendments, approval conditions or performance milestones","businesses unable to evidence the relevant manufacturing, investment and sales conditions"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://pliauto.in/","route":"review the current MHI guidelines, AAT product list, amendments and official PLI-Auto portal instructions, then use the designated route if applications or claims are available","applicant_note":"UdyamVeda can prepare the evidence checklist and explain the route, but the applicant must use the official PLI-Auto process and remain responsible for all declarations and claims."},
        "fine_print":{"benefit_is_performance_linked":true,"grant_or_subsidy":false,"loan":false,"scheme_period":"The 29 December 2023 MHI amendment states that incentive applicability starts in FY 2023-24 and continues for five consecutive financial years, with disbursement in the following financial year; the scheme period alone does not establish a current application window.","target_focus":["Advanced Automotive Technology products","Battery Electric Vehicles","Hydrogen Fuel Cell Vehicles","eligible advanced automotive components"],"thresholds":{"champion_oem_first_year_determined_sales_value_inr_crore":125,"component_champion_first_year_determined_sales_value_inr_crore":25,"minimum_domestic_value_addition_percent":50},"budgetary_outlay_inr":25938,"budgetary_outlay_is_not_applicant_ceiling":true,"performance_conditions":["approved applicant status","eligible product pre-approval","determined-sales thresholds and applicable year-on-year growth","annual audited claims","domestic value addition and current PMP requirements"],"recovery_condition":"Claims may be forfeited or recovered with interest if an approved applicant is later found ineligible or non-compliant.","review_note":"Confirm the current AAT product list, applicant track, global-group revenue and investment thresholds, domestic value addition and PMP amendment, testing/certification, sales milestones, incentive rate, application status, claim period, portal workflow and recovery/clawback conditions before publication."},
        "benefit_summary":{"types":["production_linked_incentive","manufacturing_support"],"summary":"Potential performance-linked support for eligible automobile and auto-component manufacturers of qualifying Advanced Automotive Technology products; the scheme outlay is not an individual applicant entitlement."},
        "benefit_type":"production_linked_incentive",
        "benefit_label":"Performance-linked support for eligible advanced automotive manufacturing",
        "benefit_conditions":{"eligible_aat_product_required":true,"manufacturer_status_required":true,"approval_required":true,"investment_sales_and_localization_conditions_apply":true,"current_portal_route_required":true},
        "requirement":"Eligible AAT product, manufacturer status and investment/sales/localization evidence",
        "requirement_description":"The applicant must evidence its legal and manufacturing status, qualifying AAT product, track-specific revenue and investment, eligible sales, domestic value addition and any testing or certification evidence required by the current guidelines.",
        "rules":{"all":[{"field":"is_eligible_automotive_manufacturer","operator":"equals","value":true},{"field":"aat_product_identified","operator":"equals","value":true},{"field":"investment_sales_localization_evidence_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Identify the eligible AAT product or component","description":"Map the vehicle, system or component to the current Advanced Automotive Technology product list and applicable manufacturer track.","url":"https://www.heavyindustries.gov.in/sites/default/files/2023-09/PLI%20AUto%20Guidelines.pdf"},{"title":"Verify current application and claim status","description":"Check the latest MHI amendments, approved-manufacturer updates and PLI-Auto portal instructions; do not infer an open application window from the scheme period alone.","url":"https://heavyindustries.gov.in/en/the-production-linked-incentive-pli-scheme-for-automobile-and-auto-components"},{"title":"Prepare qualification evidence","description":"Assemble company, manufacturing, revenue, investment, sales, localization, testing and certification evidence in the prescribed format.","url":"https://www.heavyindustries.gov.in/sites/default/files/2023-09/PLI%20AUto%20Guidelines.pdf"},{"title":"Submit and maintain performance records","description":"If the official route is available and the applicant is approved, submit through PLI-Auto and retain the records needed for milestone verification, claims, reporting and audit.","url":"https://pliauto.in/"}],
        "window_type":"closed",
        "window_label":"The original application window was a 60-day launch window. The scheme's five-year incentive period and later amendments do not prove that a new application window is open; verify a current MHI notice or official portal route before treating this as actionable.",
        "window_evidence":{"source_url":"https://www.heavyindustries.gov.in/sites/default/files/2023-09/PLI%20AUto%20Guidelines.pdf","anchor":"Sections 2.4 and 5.1: applications invited within 60 days and application window for 60 days; sections 3 and 2023 amendment establish the incentive period but not a new intake window"}
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
