-- Official Ministry of Coal evidence for the current Surface Coal/Lignite
-- Gasification financial-incentive RFP. This is a large project-finance route,
-- not a general MSME or founder grant.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Ministry of Coal surface coal/lignite gasification RFP, 07 July 2026', 'https://coal.gov.in/sites/default/files/2026-07/07-07-2026-rpf.pdf', 'guideline', 'central', 'daily', 1, true, 'Current RFP defining applicant classes, project capacity, net-worth, financial incentive, security, documents, milestones and round timeline.'),
  ('Ministry of Coal opening applications notice, 01 September 2026', 'https://www.coal.gov.in/sites/default/files/2026-09/03-09-2026b-wn.pdf', 'notice', 'central', 'daily', 1, true, 'Official notice stating the application deadline, 5 PM physical-submission cutoff and opening arrangements.'),
  ('Ministry of Coal Coal Gasification mission page', 'https://www.coal.gov.in/major-statistics/national-coal-gasification-mission', 'ministry_portal', 'central', 'daily', 1, true, 'Official index of the current scheme, RFP, timeline and clarification documents.'),
  ('Ministry of Coal official portal', 'https://coal.gov.in/', 'ministry_portal', 'central', 'daily', 1, true, 'Official Ministry of Coal portal and change-detection surface.'),
  ('MSTC Coal Gasification Portal', 'https://mstcecommerce.com/auctionhome/coalgasnew/index.jsp', 'application_portal', 'central', 'daily', 1, true, 'Official implementing portal referenced by the Ministry notice for online applications; applicant credentials and signing remain outside UdyamVeda.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
