-- Official national registration and recognition sources used by the
-- registration-journey catalog seed.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('DPIIT Startup Recognition official guidance', 'https://www.startupindia.gov.in/content/sih/en/startupgov/startup_recognition_page.html', 'ministry_portal', 'central', 'weekly', 2, true, 'Recognition eligibility, application route, fee and applicant-control guidance.'),
  ('National Single Window System official portal', 'https://www.nsws.gov.in/', 'ministry_portal', 'central', 'weekly', 2, true, 'Official application handoff for Registration as a Startup and other approvals.'),
  ('GST official portal', 'https://www.gst.gov.in/', 'ministry_portal', 'central', 'weekly', 2, true, 'Official GST registration portal and current filing entry point.'),
  ('GST registration document checklist', 'https://tutorial.gst.gov.in/cbt/registration/gstregistration/course/story_content/external_files/GST_Registration_Document_Checklist.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official GSTN document-format, size and upload checklist; current applicability and portal terms still require review.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
