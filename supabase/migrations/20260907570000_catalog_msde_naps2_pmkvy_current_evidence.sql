-- Current official MSDE evidence for apprenticeship and skill-development routes.
-- Both records remain review-gated because the composite Skill India Programme,
-- current portal availability, calls and local implementation routes need a
-- human check before publication.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Prime Minister Office Skill India Programme continuation release', 'https://www.pmindia.gov.in/en/news_updates/cabinet-approves-continuation-and-restructuring-of-skill-india-programme/', 'government_announcement', 'central', 'monthly', 1, true, 'Official release describing PMKVY 4.0, PM-NAPS and JSS under the composite Skill India Programme, with the stated 2022-23 to 2025-26 programme period.'),
  ('PIB NAPS-2 industry-aligned skill development release', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2294856&lang=1&reg=1', 'government_announcement', 'central', 'monthly', 1, true, 'Official MSDE release confirming NAPS-2, apprenticeship portal operation, participating establishments and the 25%/Rs.1,500 DBT stipend-support boundary.'),
  ('MSDE PMKVY 4.0 guidelines', 'https://www.msde.gov.in/static/uploads/2025/09/20d9aac4ce972a765e83f28682536ee0.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official PMKVY 4.0 guideline document covering beneficiary routes, training providers, Skill India centres, RPL and implementation conditions.'),
  ('MSDE official portal', 'https://www.msde.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Ministry portal used for current programme and implementation announcements.'),
  ('Skill India Digital official about page', 'https://www.skillindiadigital.gov.in/about-us', 'agency_portal', 'central', 'weekly', 1, true, 'Official digital discovery and delivery route for courses, centres, employers and training providers; verify current route during review.'),
  ('National Apprenticeship Promotion Scheme portal', 'https://www.apprenticeshipindia.gov.in/', 'agency_portal', 'central', 'daily', 1, true, 'Official apprenticeship portal referenced by MSDE and PIB for establishment registration, apprenticeship engagement and DBT-linked processes.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
