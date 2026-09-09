-- Current-source reconciliation for the India Cine Hub foreign-film incentive.
-- Permission and incentive claim stages remain separate and review-gated.

do $$
declare
  version_id uuid;
begin
  select current_version_id into version_id
  from public.opportunities
  where slug = 'incentive-scheme-foreign-films-official-coproduction-india';

  if version_id is null then
    return;
  end if;

  update public.opportunity_versions
  set
    fine_print = fine_print || jsonb_build_object(
      'current_source_reconciliation', 'Current India Cine Hub international-project guidance and FAQ were checked on 8 September 2026. The Ministry incentive guideline remains indexed but requires exact current-document capture and revision reconciliation before publication.',
      'current_permission_boundary', 'India Cine Hub permission, local/location permissions, equipment import, restricted-area approvals and Film Visa are separate workflow stages; permission does not equal incentive approval or reimbursement.',
      'current_guideline_resolution', 'MIB Revised incentive guidelines PDF timed out during current retrieval and the indexed ICH February 2025 guideline copy returned 404. Keep the 40% and INR 30 crore figures review-only until an exact current official document is captured and hashed.',
      'current_route_checked_at', '2026-09-08'
    ),
    last_verified_at = now(),
    review_status = 'in_review'
  where id = version_id;
end $$;
