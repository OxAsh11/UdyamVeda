-- Official sources for Central procurement-policy and credit-readiness records.
-- These are provenance inputs only; they do not approve or publish records.
insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('MSME Public Procurement Policy MyMSME portal', 'https://my.msme.gov.in/MyMsme/Reg/PPP_Home.aspx', 'implementing_portal', 'central', 'weekly', 1, true, 'Official MyMSME policy portal for procurement participation measures and buyer-development routes.'),
  ('MSME Annual Report 2025-26 procurement policy section', 'https://msme.gov.in/sites/default/files/MSMEANNUALREPORT2025-26ENGLISH_0.pdf', 'ministry', 'central', 'monthly', 1, true, 'Official current annual-report source for the policy target and procurement implementation context.'),
  ('MSME Performance and Credit Rating guidelines', 'https://msme.gov.in/sites/default/files/PCRSchemeGuidelines.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official PCR scheme guideline source for NSIC implementation, rating route and evidence.'),
  ('MSME Performance and Credit Rating overview', 'https://my.msme.gov.in/MyMsmeMob/MsmeScheme/Pages/1_2_0.html', 'implementing_portal', 'central', 'weekly', 1, true, 'Official MyMSME scheme page for current eligibility, reimbursement bands and application route.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
