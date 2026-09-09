-- Current SFURTI reconciliation. Preserve cluster-level roles, source-specific
-- dashboard snapshots and project funding boundaries; keep the record review-gated.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('SFURTI Ministry dashboard', 'https://sfurti.msme.gov.in/MinistryDashboard.aspx', 'agency_dashboard', 'central', 'weekly', 1, true, 'Official Ministry dashboard with cluster and proposal-stage reporting; counters are snapshot- and scope-specific.'),
  ('SFURTI approved proposal listing', 'https://sfurti.msme.gov.in/SFURTI/Applicant/Ministry/Total_Proposals_Approved_By_SSC.aspx', 'agency_dashboard', 'central', 'weekly', 1, true, 'Official approved-cluster listing with applicant organization, location, artisan potential and nodal agency.'),
  ('SFURTI pending proposal listing', 'https://sfurti.msme.gov.in/SFURTI/Applicant/Ministry/AllPendingProposals.aspx', 'agency_dashboard', 'central', 'weekly', 1, true, 'Official pending-proposal listing with nodal route, receipt dates and proposal status.'),
  ('MSME SFURTI performance smartboard', 'https://dashboard.msme.gov.in/sfurti.aspx', 'ministry_dashboard', 'central', 'monthly', 1, true, 'Official MSME smartboard for dated SFURTI performance and proposal context.')
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
  sfurti_version_id uuid;
begin
  select current_version_id into sfurti_version_id
  from public.opportunities
  where slug = 'scheme-for-fund-for-regeneration-of-traditional-industries-sfurti';

  if sfurti_version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_portal_checked_at', '2026-09-08',
        'proposal_route', 'https://sfurti.msme.gov.in/SFURTI/Home.aspx',
        'approved_proposal_route', 'https://sfurti.msme.gov.in/SFURTI/Applicant/Ministry/Total_Proposals_Approved_By_SSC.aspx',
        'pending_proposal_route', 'https://sfurti.msme.gov.in/SFURTI/Applicant/Ministry/AllPendingProposals.aspx',
        'applicant_boundary', 'Cluster/institution-led route; an individual artisan or founder should be matched to a qualifying cluster and nodal/implementing agency.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_source_reconciliation', 'SFURTI portal, Ministry dashboard, proposal listings, MSME smartboard and 9 September 2022 revised guideline were checked on 8 September 2026.',
        'cluster_minimum_artisans_general', 100,
        'cluster_minimum_artisans_ner_hilly', 50,
        'hard_intervention_scheme_share_percent_general', 90,
        'hard_intervention_ia_cash_contribution_percent_general', 10,
        'hard_intervention_scheme_share_percent_ner_jk_hilly', 95,
        'hard_intervention_ia_cash_contribution_percent_ner_jk_hilly', 5,
        'land_cost_excluded', true,
        'dashboard_scopes_not_combinable', true,
        'homepage_snapshot', jsonb_build_object('approved_clusters', 513, 'functional_clusters', 376, 'ssc_proposals_under_consideration', 0, 'checked_at', '2026-09-08'),
        'ministry_dashboard_snapshot', jsonb_build_object('approved_clusters', 513, 'functional_clusters', 376, 'in_progress_clusters', 137, 'total_proposals', 147, 'nodal_evaluation', 80, 'ministry_evaluation', 67, 'ssc_evaluation', 0, 'grant_extended_inr_crore', 1336, 'checked_at', '2026-09-08'),
        'current_route_checked_at', '2026-09-08'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = sfurti_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select sfurti_version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://sfurti.msme.gov.in/SFURTI/Home.aspx', 'agency', 'SFURTI official portal', 'New Proposal, Nodal Agency, DFO, notices and homepage dashboard'),
      ('https://sfurti.msme.gov.in/MinistryDashboard.aspx', 'agency_dashboard', 'SFURTI Ministry dashboard', 'Cluster and proposal-stage counters with grant reporting'),
      ('https://sfurti.msme.gov.in/SFURTI/Applicant/Ministry/Total_Proposals_Approved_By_SSC.aspx', 'agency_dashboard', 'SFURTI approved proposals', 'Approved clusters, organizations, locations, artisan potential and nodal agencies'),
      ('https://sfurti.msme.gov.in/SFURTI/Applicant/Ministry/AllPendingProposals.aspx', 'agency_dashboard', 'SFURTI pending proposals', 'Pending proposal receipt, nodal agency, location, artisan and status context'),
      ('https://dashboard.msme.gov.in/sfurti.aspx', 'ministry_dashboard', 'MSME SFURTI performance smartboard', 'Dated performance and online proposal context'),
      ('https://sfurti.msme.gov.in/WriteReadData/Circular/SFURTI_NEW.pdf', 'guideline', 'Revised SFURTI Guidelines 09 September 2022', 'Cluster composition, intervention funding, contribution and land-cost boundaries')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = sfurti_version_id and source_url = evidence.source_url
    );
  end if;
end $$;
