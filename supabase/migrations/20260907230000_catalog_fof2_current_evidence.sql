-- Current-source reconciliation for Startup India Fund of Funds 2.0.
-- This remains review-gated: the scheme is an indirect AIF route and the
-- startup-facing selected-fund access path still requires live confirmation.

do $$
declare
  version_id uuid;
begin
  select current_version_id into version_id
  from public.opportunities
  where slug = 'startup-india-fund-of-funds-2';

  if version_id is null then
    return;
  end if;

  update public.opportunity_versions
  set
    legal_basis = 'DPIIT notification dated 13 April 2026 and operational guidelines issued on 25 April 2026 for Startup India Fund of Funds 2.0.',
    fine_print = fine_print || jsonb_build_object(
      'annexure_parameters', jsonb_build_object(
        'deep_tech', jsonb_build_object('aif_corpus_cap', 'none', 'aif_life_years_max', 18, 'contribution_percent_max', 40, 'contribution_inr_max', 5000000000, 'minimum_investment_multiplier', 1.5),
        'smaller_aif_early_growth', jsonb_build_object('aif_corpus_inr_max', 4000000000, 'aif_life_years_max', 10, 'contribution_percent_max', 30, 'contribution_inr_max', 1000000000, 'minimum_investment_multiplier', 2, 'private_placement_memorandum', 'At least 50% of corpus for seed/early-stage funding and funding up to Rs. 10 crore per startup.'),
        'innovative_manufacturing', jsonb_build_object('aif_corpus_cap', 'none', 'aif_life_years_max', 18, 'contribution_percent_max', 30, 'contribution_inr_max', 2000000000, 'minimum_investment_multiplier', 1.75, 'private_placement_memorandum', 'Support technology-driven innovative startups in at least one manufacturing-oriented champion sector.'),
        'sector_or_stage_agnostic', jsonb_build_object('aif_corpus_cap', 'none', 'aif_life_years_max', 12, 'contribution_percent_max', 25, 'contribution_inr_max', 1800000000, 'minimum_investment_multiplier', 2.5)
      ),
      'current_source_reconciliation', 'DPIIT notification dated 13 April 2026 and operational guidelines dated 25 April 2026 reviewed; selected AIF list, live proposal window and startup-facing access path remain to be confirmed.'
    ),
    last_verified_at = now(),
    review_status = 'in_review'
  where id = version_id;
end $$;
