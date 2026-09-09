-- Official sources for review-gated defence-startup ADITI and DRDO TDF routes.
insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('iDEX official portal', 'https://idex.gov.in/', 'agency_portal', 'central', 'weekly', 1, true, 'Official Defence Innovation Organisation/iDEX portal.'),
  ('iDEX ADITI scheme page', 'https://idex.gov.in/disc-category/26', 'agency_portal', 'central', 'weekly', 1, true, 'Official ADITI scheme page with eligibility, timeline and grant ceiling.'),
  ('iDEX ADITI scheme guideline', 'https://www.idex.gov.in/uploads/page/aditi_scheeme.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official ADITI scheme guideline PDF.'),
  ('iDEX FAQ', 'https://idex.gov.in/faq', 'faq', 'central', 'weekly', 1, true, 'Official iDEX category, applicant, grant and milestone FAQ.'),
  ('DRDO industry support', 'https://drdo.gov.in/drdo/en/offerings/industry-support', 'agency_portal', 'central', 'monthly', 1, true, 'Official DRDO industry and startup support overview.'),
  ('DRDO TDF startup support', 'https://drdo.gov.in/drdo/en/offerings/schemes-and-services/startups-support', 'agency_portal', 'central', 'monthly', 1, true, 'Official DRDO TDF startup/MSME support description.'),
  ('TDF official portal', 'https://tdf.drdo.gov.in/', 'agency_portal', 'central', 'weekly', 1, true, 'Official Technology Development Fund project and registration portal.'),
  ('TDF FAQ', 'https://tdf.drdo.gov.in/faq', 'faq', 'central', 'weekly', 1, true, 'Official TDF applicant, cost, entity and funding FAQ.'),
  ('TDF innovator registration', 'https://tdf.drdo.gov.in/public/innovator/register', 'agency_portal', 'central', 'weekly', 1, true, 'Official industry registration route for TDF applicants.'),
  ('TDF 2024 operating procedure', 'https://www.drdo.gov.in/drdo/sites/default/files/inline-files/SOP_TDF24102024.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official modified TDF operating procedure.'),
  ('TDF terms for MSMEs and startups', 'https://tdf.drdo.gov.in/sites/default/files/2022-07/Terms%20and%20Conditions%20II_TDF%20Terms%20and%20Conditions%20for%20MSMEs%20and%20Startups_0.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official TDF terms and conditions for MSMEs and startups.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
