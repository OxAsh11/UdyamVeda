-- Current NMDFC Virasat reconciliation. Preserve the artisan-credit route,
-- separate financial/non-financial benefits, and keep the current-page rate
-- conflict review-gated rather than silently choosing one value.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('NMDFC Virasat artisan-credit route', 'https://nmdfc.org/virasat_a_credit_scheme_for_craftpersons', 'agency_portal', 'central', 'monthly', 1, true, 'Official Virasat route; dedicated page is image-led and current fine print requires human review.'),
  ('NMDFC Credit Line 2 detail', 'https://nmdfc.org/credit-2', 'agency_portal', 'central', 'monthly', 1, true, 'Official Credit Line 2 route used to cross-check income and beneficiary terms.'),
  ('NMDFC lending policy', 'https://nmdfc.org/lendingpolicy', 'agency_portal', 'central', 'monthly', 1, true, 'Official lending-policy route controlling current appraisal and amendment terms.')
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
  virasat_version_id uuid;
begin
  select current_version_id into virasat_version_id
  from public.opportunities
  where slug = 'nmdfc-virasat-artisan-credit';

  if virasat_version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_scheme_route', 'https://www.nmdfc.org/nmdfcschemes',
        'current_virasat_route', 'https://nmdfc.org/virasat_a_credit_scheme_for_craftpersons',
        'current_credit_line_1_route', 'https://nmdfc.org/credit-1',
        'current_credit_line_2_route', 'https://nmdfc.org/credit-2',
        'current_faq_route', 'https://nmdfc.org/faq',
        'current_lending_policy_route', 'https://nmdfc.org/lendingpolicy',
        'current_route_checked_at', '2026-09-08',
        'official_handoff_boundary', 'Confirm the artisan route and apply through the relevant SCA or partner; UdyamVeda prepares and explains but does not submit or guarantee sanction.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_source_reconciliation', 'The current NMDFC schemes page, dedicated Virasat route, Credit Line 1, Credit Line 2, FAQ, lending-policy route and scheme landing page were checked on 8 September 2026.',
        'credit_line_1_artisan_annual_family_income_max_inr', 300000,
        'credit_line_2_artisan_annual_family_income_max_inr', 800000,
        'loan_ceiling_inr', 1000000,
        'credit_line_1_interest_percent', 5,
        'credit_line_2_interest_percent_male', 6,
        'female_artisan_concession_percent', 1,
        'beneficiary_moratorium_months', 6,
        'beneficiary_repayment_years', 5,
        'working_capital_and_fixed_capital', true,
        'eligible_purpose', 'Equipment, tools, machinery and raw material for an eligible artisan or craft activity',
        'sca_or_partner_route_required', true,
        'not_free_toolkit_or_grant', true,
        'loan_not_guaranteed', true,
        'market_access_must_remain_separate', true,
        'current_page_female_rate_conflict', true,
        'current_page_female_rate_conflict_note', 'The current page narrative states a 1% female-artisan concession under both credit lines, while its comparison table shows different female rates. Human review must identify the controlling value before publication.',
        'current_route_checked_at', '2026-09-08'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = virasat_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select virasat_version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://www.nmdfc.org/nmdfcschemes', 'agency', 'NMDFC current schemes page', 'Virasat purpose, ceiling, rates, women concession, moratorium and repayment'),
      ('https://nmdfc.org/virasat_a_credit_scheme_for_craftpersons', 'agency', 'NMDFC Virasat artisan-credit route', 'Official dedicated Virasat route; image-led page requires fine-print review'),
      ('https://nmdfc.org/credit-1', 'agency', 'NMDFC Credit Line 1 detail', 'Credit Line 1 income and beneficiary-term context'),
      ('https://nmdfc.org/credit-2', 'agency', 'NMDFC Credit Line 2 detail', 'Credit Line 2 income and beneficiary-term context'),
      ('https://nmdfc.org/faq', 'agency', 'NMDFC current FAQ', 'Current route and product-term cross-check'),
      ('https://nmdfc.org/lendingpolicy', 'agency', 'NMDFC lending policy', 'Current policy and amendment boundary'),
      ('https://www.nmdfc.org/home/nmdfc_schemes', 'agency', 'NMDFC scheme landing page', 'Current scheme navigation and document route')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = virasat_version_id and source_url = evidence.source_url
    );
  end if;
end $$;
