-- Current-source reconciliation for DPIIT Startup Recognition.
-- Recognition is preparation and an official handoff, not a filing UdyamVeda
-- may impersonate or submit on the startup's behalf.

do $$
declare
  version_id uuid;
begin
  select current_version_id into version_id
  from public.opportunities
  where slug = 'dpiit-startup-recognition';

  if version_id is null then
    return;
  end if;

  update public.opportunity_versions
  set
    fine_print = fine_print || jsonb_build_object(
      'current_page_facts', jsonb_build_object(
        'last_updated', '20-AUG-2026',
        'application_route', 'Create an Investor Account on NSWS, choose Add Approvals > Central Approvals, find Registration as a Startup, add it to the dashboard, complete the application and submit it',
        'self_certification', 'The application details are submitted on a self-certification basis',
        'fee', 'The Ministry of Commerce and Industry states that it does not charge a fee for the DPIIT recognition or eligibility certificate',
        'deeptech_boundary', 'DeepTech recognition has separate age and turnover limits and requires the applicant to satisfy the applicable DPIIT deep-tech framework and evidence requirements; do not infer DeepTech status from an ordinary innovation claim',
        'linked_tax_routes', '80-IAC and other tax exemptions are separate post-recognition applications with their own entity, incorporation-date and approval conditions'
      ),
      'current_source_reconciliation', 'The current Startup India recognition page confirms the entity forms, 200 crore ordinary and 300 crore DeepTech turnover ceilings, 10-year ordinary and 20-year DeepTech age limits, NSWS route, self-certification, no-fee statement and applicant-controlled filing boundary.'
    ),
    last_verified_at = now(),
    review_status = 'in_review'
  where id = version_id;
end $$;
