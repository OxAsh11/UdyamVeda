-- Official Central sources for Production Linked Incentive Scheme 2.0 for IT
-- Hardware. These sources feed review; they do not make an applicant eligible
-- or establish that a current application window is open.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('PLI Working Group IT Hardware official portal', 'https://www.pliwg.dpiit.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Official scheme portal for PLI IT Hardware 2.0 target segments, incentive summary and current notices.'),
  ('MeitY PLI 2.0 IT Hardware guidelines', 'https://www.meity.gov.in/static/uploads/2024/03/Guidelines_PLI-Scheme-ITHW-min.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official MeitY guidelines for applicant definition, product scope, qualification criteria, application materials and claims.'),
  ('MeitY PLI 2.0 IT Hardware notification', 'https://www.meity.gov.in/writereaddata/files/Production%20Linked%20Scheme%202.0%20for%20IT%20Hardware%20notification_0.pdf', 'gazette', 'central', 'monthly', 1, true, 'Official scheme notification; use with the latest guidelines because the notification prevails if inconsistent.'),
  ('PLI Working Group IT Hardware guidelines copy', 'https://www.pliwg.dpiit.gov.in/docs/guidelines/ITHW2.O/Guidelines_PLI-Scheme-IT-Hardware_14.07.2023.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official PLI Working Group-hosted copy of the MeitY operational guidelines and application requirements.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
