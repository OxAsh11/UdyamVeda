-- Current evidence registry for the five distinct sub-schemes under SMDI.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Department of Pharmaceuticals SMDI operational guidelines', 'https://pharma-dept.gov.in/sites/default/files/Final%20guidelines%20for%20SMDI-8.11.2024_0.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official operational guidelines dated 8 November 2024 for all five SMDI sub-schemes, outlay and tenure.'),
  ('Department of Pharmaceuticals SMDI current scheme page', 'https://pharma-dept.gov.in/schemes/scheme-strengthening-medical-device-industry', 'scheme_page', 'central', 'weekly', 1, true, 'Current official page listing apply-online route, amendments and 2026 calls/revised notices.'),
  ('PIB SMDI launch release', 'https://www.pib.gov.in/PressReleasePage.aspx/pib.gov.in/Pressreleaseshare.aspx?PRID=2071850', 'press_release', 'central', 'monthly', 1, true, 'Official launch release with component outlays, grant/subsidy caps and support boundaries.'),
  ('Department of Pharmaceuticals SMDI MIS and clinical call', 'https://pharma-dept.gov.in/sites/default/files/Marginal%20Investment%20Scheme-English.pdf', 'notice', 'central', 'weekly', 1, true, 'Official call for MIS RID and MDCSSS; the notice recorded a 15 February 2026 deadline and LSSSDC-PMA route.'),
  ('Department of Pharmaceuticals SMDI clinical amendment 2026', 'https://pharma-dept.gov.in/sites/default/files/Corrigendum%20for%20revised%20operational%20guidelines%20of%20sub-scheme%20Medical%20Device_0.pdf', 'corrigendum', 'central', 'monthly', 1, true, 'Official 23 February 2026 amendment to Medical Device Clinical Studies Support Scheme.'),
  ('Department of Pharmaceuticals SMDI capacity amendment 2025', 'https://pharma-dept.gov.in/important-document/modification-operational-guidelines-sub-scheme-capacity-building-and-skill', 'corrigendum', 'central', 'monthly', 1, true, 'Official 9 June 2025 modification to Capacity Building and Skill Development.'),
  ('Department of Pharmaceuticals Annual Report 2025-26', 'https://pharma-dept.gov.in/sites/default/files/Annual%20Report%202025-26_0.pdf', 'annual_report', 'central', 'monthly', 1, true, 'Official implementation context for the five SMDI sub-schemes.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
