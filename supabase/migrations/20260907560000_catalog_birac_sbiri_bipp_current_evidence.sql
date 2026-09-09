-- Current official BIRAC evidence for distinct early-stage and advanced biotech
-- industry-support tracks. Records remain review-gated until calls, amendments,
-- applicant documents and royalty/funding conditions are checked by a reviewer.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('BIRAC SBIRI official scheme page', 'https://birac.nic.in/sbiri.php', 'agency_portal', 'central', 'monthly', 1, true, 'Official BIRAC page describing SBIRI objectives, applicant forms and recurring call windows.'),
  ('BIRAC SBIRI 2025 scheme guidelines', 'https://birac.nic.in/webcontent/1745298212_SBIRI_scheme_guidelines_16_04_2025.pdf', 'guideline', 'central', 'monthly', 1, true, 'Current official SBIRI scheme document with startup-age, prior-BIRAC-support, funding, milestone, contribution and royalty conditions.'),
  ('BIRAC SBIRI funding guidelines', 'https://birac.nic.in/webcontent/1729753741_Funding_guidelines_SBIRI_oct24.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official SBIRI funding guidance; reconcile against the 2025 complete scheme document before publication.'),
  ('BIRAC proposal submission guide', 'https://www.birac.nic.in/howtoSubmitProposal.php', 'application_guide', 'central', 'monthly', 1, true, 'Official BIRAC submission sequence and proposal-document route.'),
  ('BIRAC company proposal document checklist', 'https://www.birac.nic.in/docRequired.php?type=c', 'document_checklist', 'central', 'monthly', 1, true, 'Official BIRAC company/institution document list for proposal preparation.'),
  ('BIRAC BIPP official scheme page', 'https://www.birac.nic.in/bipp.php?scheme=1', 'agency_portal', 'central', 'monthly', 1, true, 'Official BIRAC page describing BIPP categories, current themes, recurring calls and proposal resources.'),
  ('BIRAC BIPP 2024 revised scheme guidelines', 'https://www.birac.nic.in/webcontent/1729751884_BIPP_scheme_guidelines_revised.pdf', 'guideline', 'central', 'monthly', 1, true, 'Current official BIPP guideline with eligibility, TRL, cost sharing, milestone disbursement, royalty and facility conditions.'),
  ('BIRAC BIPP fund disbursement guideline', 'https://www.birac.nic.in/webcontent/BIPP_fund_disb_guideline_2016.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official BIPP disbursement and category-specific funding document referenced by the revised guideline.'),
  ('BIRAC official portal', 'https://birac.nic.in/', 'agency_portal', 'central', 'weekly', 1, true, 'Underlying official implementing-agency portal for BIRAC schemes, calls and registration.'),
  ('Department of Biotechnology official portal', 'https://dbt.gov.in/', 'ministry_portal', 'central', 'monthly', 1, true, 'Underlying Department of Biotechnology authority portal for BIRAC programmes.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
