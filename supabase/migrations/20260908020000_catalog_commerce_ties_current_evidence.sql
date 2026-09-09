-- Official Department of Commerce evidence for the Trade Infrastructure for
-- Export Scheme (TIES). The route is project/institutional infrastructure
-- support, not a direct founder or exporter cash benefit.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Department of Commerce TIES revised guidelines FY 2021-22 to FY 2025-26', 'https://www.commerce.gov.in/wp-content/uploads/2021/07/TIES-revised-guidelines-FY22-to-FY26.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official Trade Infrastructure for Export Scheme guidelines defining scope, eligible implementing agencies, project conditions and grant boundaries.'),
  ('Department of Commerce TIES 20th Empowered Committee minutes', 'https://www.commerce.gov.in/wp-content/uploads/2025/08/MoM_20th-EC_23.07.2025.pdf', 'notice', 'central', 'monthly', 1, true, 'Official July 2025 committee minutes recording implementation status, remaining approved-outlay context and proposals considered.'),
  ('Department of Commerce TIES projects parliamentary answer', 'https://www.commerce.gov.in/wp-content/uploads/2025/03/LS-USQ-No.2050-dated.-11.03.2025.pdf', 'policy_update', 'central', 'monthly', 1, true, 'Official March 2025 parliamentary answer describing TIES objectives, eligible Central/State agencies and joint ventures, and sanctioned project context.'),
  ('Department of Commerce scheme claim monitoring system', 'https://apps.commerce.gov.in/schemes/schemereport', 'monitoring_portal', 'central', 'weekly', 1, true, 'Official claim-monitoring view showing TIES balances and activity through the reported month; does not itself open a new applicant window.'),
  ('Department of Commerce official portal', 'https://www.commerce.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Ministry of Commerce and Industry portal for scheme notices and trade-promotion material.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
