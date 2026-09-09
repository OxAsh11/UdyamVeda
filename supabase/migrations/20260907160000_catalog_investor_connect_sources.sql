-- Official sources for Startup India Investor Connect.
-- This is a non-cash market-access opportunity, not a grant or funding
-- entitlement. Keep it review-gated until the current portal flow is checked.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Startup India Investor Connect overview', 'https://www.startupindia.gov.in/content/sih/en/about-startup-india-initiative.html', 'ministry', 'central', 'weekly', 1, true, 'Official Startup India overview describing Investor Connect purpose and launch; current access and onboarding flow require verification.'),
  ('Startup India user dashboard Investor Connect entry', 'https://www.startupindia.gov.in/content/sih/en/user/my-dashboard/Startup.html', 'ministry', 'central', 'weekly', 1, true, 'Official logged-in dashboard reference for Investor Connect discovery and startup-facing access; do not infer funding eligibility from the dashboard label alone.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
