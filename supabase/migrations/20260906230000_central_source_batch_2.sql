-- Additional official implementing-authority sources for the Central catalog.
-- These are discovery inputs; the records seeded from them remain in_review.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Department of Financial Services PMMY page', 'https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy', 'agency_portal', 'central', 'weekly', 1, true, 'Official PMMY categories, eligibility framing, lending institutions, and collateral statement.'),
  ('Department of Financial Services Stand Up India page', 'https://www.financialservices.gov.in/stand-india-scheme-supi', 'agency_portal', 'central', 'weekly', 1, true, 'Official Stand Up India eligibility, loan structure, project scope, contribution, and repayment terms.'),
  ('DC MSME ZED Scheme guidelines page', 'https://www.dcmsme.gov.in/CLCS_TUS_Scheme/ZED_Scheme/Scheme_Guidelines.aspx', 'guideline', 'central', 'monthly', 1, true, 'Official ZED eligibility, certification subsidy, implementing agency, and application portal.'),
  ('ZED official application portal', 'https://zed.msme.gov.in/', 'implementing_portal', 'central', 'weekly', 2, true, 'Official ZED application handoff; current portal operation requires reviewer confirmation.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
