-- Current-source reconciliation for PM SVANidhi.
-- The record remains review-gated because local-body coverage, lender rules and
-- subsidy/cashback mechanics still require live operational confirmation.

do $$
declare
  version_id uuid;
begin
  select current_version_id into version_id
  from public.opportunities
  where slug = 'pm-street-vendors-atmanirbhar-nidhi-pm-svanidhi';

  if version_id is null then
    return;
  end if;

  update public.opportunity_versions
  set
    fine_print = fine_print || jsonb_build_object(
      'current_source_findings', jsonb_build_object(
        'loan_tranches', jsonb_build_array(
          jsonb_build_object('amount_max_inr', 15000, 'repayment_months', 12),
          jsonb_build_object('amount_max_inr', 25000, 'repayment_months', 18),
          jsonb_build_object('amount_max_inr', 50000, 'repayment_months', 36)
        ),
        'current_until', '2030-03-31',
        'clarification_as_of', '2026-07-12',
        'coverage_expansion', 'census towns, urban agglomerations and peri-urban areas in a graded manner',
        'portal_boundary', 'Submission is not an assurance of a loan; lenders apply their own credit and risk policies.'
      ),
      'current_source_reconciliation', 'PIB releases dated 27 August 2025 and 27 July 2026 were reviewed against the existing MoHUA guideline and FAQ; retain in review until local-body routes and current subsidy/cashback mechanics are confirmed.'
    ),
    last_verified_at = now(),
    review_status = 'in_review'
  where id = version_id;
end $$;
