-- Official sources for the next Central catalog batch. These are crawl and
-- provenance inputs only; they do not approve or publish opportunities.
insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('MSME MSE-CDP MyMSME application page', 'https://www.my.msme.gov.in/MyMsme/Reg/COM_ClusterForm.aspx', 'implementing_portal', 'central', 'weekly', 2, true, 'Official MyMSME cluster application and scheme overview page for MSE-CDP.'),
  ('MSME MSE-CDP modified guidelines', 'https://msme.gov.in/sites/default/files/ModifiedGuidelinesofMSE.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official MSE-CDP guidelines for project types, eligibility, funding pattern and proposal evidence.'),
  ('MSME Competitive LEAN official portal', 'https://lean.msme.gov.in/Home/index', 'implementing_portal', 'central', 'weekly', 1, true, 'Official Ministry of MSME LEAN portal and current registration entry point.'),
  ('MSME Competitive LEAN eligibility', 'https://lean.msme.gov.in/Home/Eligibility', 'implementing_portal', 'central', 'weekly', 1, true, 'Official LEAN coverage and eligibility page for Udyam-registered MSMEs and eligible CFCs.'),
  ('MSME Competitive LEAN components', 'https://lean.msme.gov.in/Home/SchemeComponents', 'implementing_portal', 'central', 'weekly', 1, true, 'Official LEAN components page for handholding, levels, incentives and digital process.'),
  ('MSME Competitive LEAN levels', 'https://lean.msme.gov.in/Home/SchemeLevels', 'implementing_portal', 'central', 'weekly', 1, true, 'Official LEAN levels and pledge sequence page.'),
  ('MSME Competitive LEAN financial assistance', 'https://lean.msme.gov.in/Home/FinancialAssistance', 'implementing_portal', 'central', 'weekly', 1, true, 'Official LEAN financial assistance page; current subsidy terms require editorial confirmation.'),
  ('Ministry of MSME Consortia and Tender Marketing offering', 'https://www.msme.gov.in/offerings', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Ministry of MSME offering page describing NSIC Consortia and Tender Marketing Scheme; tender-specific NSIC evidence is required before publication.'),
  ('National Small Industries Corporation official portal', 'https://www.nsic.co.in/', 'implementing_portal', 'central', 'weekly', 1, true, 'Official NSIC portal for current consortia, tender and procurement routes.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
