-- Official sources for review-gated BIS product certification and registration routes.
insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('BIS official portal', 'https://www.bis.gov.in/', 'agency_portal', 'central', 'monthly', 1, true, 'Official Bureau of Indian Standards portal.'),
  ('BIS FMCS overview', 'https://www.bis.gov.in/fmcs/fmcs-overview/?lang=en', 'agency_portal', 'central', 'monthly', 1, true, 'Official Bureau of Indian Standards Foreign Manufacturers Certification Scheme overview.'),
  ('BIS FMCS application process', 'https://www.bis.gov.in/fmcs/certification-process/how-to-apply/?lang=en', 'agency_portal', 'central', 'weekly', 1, true, 'Official FMCS application steps, documents, representative and fee route.'),
  ('BIS FMCS who can apply', 'https://www.bis.gov.in/fmcs/certification-process/who-can-apply/?lang=en', 'agency_portal', 'central', 'monthly', 1, true, 'Official FMCS applicant, factory, product and Indian Standard conditions.'),
  ('BIS FMCS FAQs', 'https://www.bis.gov.in/fmcs/fmcs-faqs/?lang=en', 'faq', 'central', 'monthly', 1, true, 'Official BIS voluntary and compulsory-certification boundary.'),
  ('BIS Manakonline portal', 'https://www.manakonline.in/', 'agency_portal', 'central', 'weekly', 1, true, 'Official BIS online application portal.'),
  ('BIS hallmarking jeweller route', 'https://www.bis.gov.in/hallmarking-jewellers/?lang=en', 'agency_portal', 'central', 'weekly', 1, true, 'Official jeweller registration and hallmarking route.'),
  ('BIS hallmarking overview', 'https://www.bis.gov.in/hallmarking-overview/?lang=en', 'agency_portal', 'central', 'monthly', 1, true, 'Official hallmarking scope, registration, validity and fee boundary.'),
  ('BIS apply for jeweller registration', 'https://www.bis.gov.in/apply-for-jewellers-registration/?lang=en', 'agency_portal', 'central', 'weekly', 1, true, 'Official jeweller registration application route.'),
  ('BIS jeweller registration guidelines', 'https://www.bis.gov.in/wp-content/uploads/2024/01/Revised-Guidelines-for-JEWELLERS-Jan-24.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official revised jeweller registration guidelines.'),
  ('BIS Compulsory Registration Scheme portal', 'https://www.crsbis.in/BIS/about-crs.do', 'agency_portal', 'central', 'weekly', 1, true, 'Official Electronics and IT product registration route referenced by BIS.'),
  ('National Single Window System', 'https://www.nsws.gov.in/', 'agency_portal', 'central', 'weekly', 1, true, 'Official national portal route referenced for jeweller registration access.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
