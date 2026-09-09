-- Register every additional official portal or guideline URL referenced by the
-- current Central seed records so refresh cadence and change detection have a
-- single source registry. These rows still do not make any opportunity
-- publishable.
insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('ASPIRE official portal', 'https://aspire.msme.gov.in/', 'implementing_portal', 'central', 'weekly', 2, true, 'Official ASPIRE portal and current notices; operating status requires reviewer confirmation.'),
  ('DPIIT official portal', 'https://dpiit.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Authority portal referenced for startup recognition and innovation programmes.'),
  ('Department of Financial Services official portal', 'https://financialservices.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Authority portal for financial inclusion and Government-backed credit programmes.'),
  ('KVIC official portal', 'https://kviconline.gov.in/', 'implementing_portal', 'central', 'weekly', 2, true, 'Implementing-agency portal for PMEGP and related notices.'),
  ('PMEGP official application portal', 'https://kviconline.gov.in/pmegpeportal/', 'implementing_portal', 'central', 'weekly', 2, true, 'Official PMEGP application handoff and current operational notices.'),
  ('Ministry of MSME official portal', 'https://msme.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Authority portal for Ministry of MSME schemes, guidelines, and notices.'),
  ('PMS official application portal', 'https://pms.dcmsme.gov.in/', 'implementing_portal', 'central', 'weekly', 2, true, 'Official Procurement and Marketing Support application handoff.'),
  ('MSME PMS scheme page', 'https://ramp.msme.gov.in/ramp/RAMP-initiative/pms-scheme/pms-scheme', 'ministry_portal', 'central', 'weekly', 2, true, 'Official scheme description and current component information for PMS.'),
  ('Startup India Seed Fund official portal', 'https://seedfund.startupindia.gov.in/', 'implementing_portal', 'central', 'weekly', 2, true, 'Official SISFS portal and current application operations.'),
  ('Startup India Seed Fund about page', 'https://seedfund.startupindia.gov.in/about', 'implementing_portal', 'central', 'weekly', 2, true, 'Official SISFS scheme description and eligibility evidence.'),
  ('Startup India Seed Fund FAQ', 'https://seedfund.startupindia.gov.in/faq', 'implementing_portal', 'central', 'weekly', 2, true, 'Official SISFS FAQ and application guidance.'),
  ('Udyam registration detail page', 'https://udyamregistration.gov.in/default.aspx/UdyamRegistrationExist.aspx', 'implementing_portal', 'central', 'weekly', 2, true, 'Official Udyam registration guidance and self-declaration evidence.'),
  ('CGTMSE official portal', 'https://www.cgtmse.in/', 'agency_portal', 'central', 'weekly', 1, true, 'Authority portal for credit guarantee notices and implementation information.'),
  ('Stand Up India official portal', 'https://www.standupmitra.in/', 'implementing_portal', 'central', 'weekly', 2, true, 'Official Stand Up India application and lender handoff portal.'),
  ('Startup India Seed Fund Scheme guidelines', 'https://www.startupindia.gov.in/content/dam/invest-india/Templates/public/Guidelines%20for%20Startup%20India%20Seed%20Fund%20Scheme.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official SISFS guideline document; current amendments and window require review.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
