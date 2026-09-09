-- Official sources for national EPFO and ESIC employer registration/compliance.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('EPFO official portal', 'https://www.epfindia.gov.in/', 'ministry_portal', 'central', 'weekly', 2, true, 'Official Employees Provident Fund Organisation portal.'),
  ('EPFO Ease of Doing Business', 'https://www.epfindia.gov.in/site_en/EODB.php', 'ministry_portal', 'central', 'weekly', 2, true, 'Official EPFO employer services page, including establishment registration and common EPFO/ESIC registration.'),
  ('EPFO employer unified portal', 'https://unifiedportal-emp.epfindia.gov.in/epfo/', 'ministry_portal', 'central', 'weekly', 2, true, 'Official employer portal; current login and registration route must be checked before publication.'),
  ('EPFO online employer registration instructions', 'https://www.epfindia.gov.in/site_docs/PDFs/OLRE_PDFs/OLRE_withDSC_RevisedJune2016.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official EPFO registration instructions; retained as procedural evidence and requires current-route review.'),
  ('ESIC employer registration overview', 'https://portal.esic.gov.in/ESICInsurance1/ESICInsurancePortal/Employer_Employee_registration_through_portal.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official ESIC employer-registration overview; applicability thresholds and current portal behavior require review.'),
  ('ESIC employer registration manual', 'https://esic.gov.in/attachments/circularfile/Guidelines_for_USSP_Unified_Shram_Suvidha_Portal_Registration_for_ESIC_User_Manual_V1_0_1752730200.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official ESIC/Sharm Suvidha registration manual for the employer workflow.'),
  ('ESIC official portal', 'https://esic.gov.in/', 'ministry_portal', 'central', 'weekly', 2, true, 'Official Employees State Insurance Corporation portal.'),
  ('Employees State Insurance Act official text', 'https://esic.gov.in/Publications/ESIAct1948Amendedupto010610.htm', 'other', 'central', 'monthly', 1, true, 'Official ESIC-hosted Act text used for legal-basis discovery; current amendments must be checked before publication.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
