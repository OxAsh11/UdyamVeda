-- Current official MoFPI/PMKSY evidence for business-facing food-processing
-- infrastructure routes. These rows remain review-gated until a human checks
-- the current EOI, project configuration, source amendments and fund/window
-- status.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('MoFPI Integrated Cold Chain revised guidelines', 'https://www.mofpi.gov.in/en/announcements/revised-operational-guidelines-dated-22052025-respect-component-scheme-integrated-cold', 'guideline', 'central', 'weekly', 1, true, 'Current Ministry of Food Processing Industries revised operational-guidelines page for the Integrated Cold Chain and Value Addition Infrastructure component of PMKSY.'),
  ('MoFPI Cold Chain circulars and irradiation EOI', 'https://mofpi.gov.in/en/Schemes/cold-chain/download-circulars-0', 'ministry_portal', 'central', 'daily', 1, true, 'Current Cold Chain circular list, including the 2026 multiproduct food irradiation EOI and deadline extensions.'),
  ('MoFPI Cold Chain pattern of assistance', 'https://mofpi.gov.in/en/Schemes/cold-chain/pattern-assistance-0', 'scheme_page', 'central', 'monthly', 1, true, 'Official component-level grant rates, project ceiling and staged release conditions.'),
  ('MoFPI multiproduct irradiation deadline notice', 'https://mofpi.gov.in/en/announcements/extension-timeline-1700-hrs-30092026-submission-multiproduct-food-irradiation', 'notice', 'central', 'daily', 1, true, 'Official 31 August 2026 extension to 17:00 on 30 September 2026 for the specified multiproduct irradiation EOI.'),
  ('MoFPI PMKSY component FAQs', 'https://mofpi.gov.in/sites/default/files/pmksy_faqs.pdf', 'faq', 'central', 'monthly', 1, true, 'Official FAQ describing applicant categories, SAMPADA submission route and component assistance boundaries.'),
  ('MoFPI CEFPPC scheme page', 'https://mofpi.gov.in/en/Schemes/creation-expansion-food-processing-preservation-capacities-unit-scheme', 'scheme_page', 'central', 'weekly', 1, true, 'Official CEFPPC objective, applicant categories and EOI-based application route.'),
  ('MoFPI CEFPPC current guidelines', 'https://mofpi.gov.in/en/Schemes/creation-expansion-food-processing-preservation-capacities-unit-scheme/download-guidelines-1', 'guideline', 'central', 'monthly', 1, true, 'Official 22 January 2025 CEFPPC guidelines listing.'),
  ('MoFPI CEFPPC circulars and project status', 'https://mofpi.gov.in/en/Schemes/creation-expansion-food-processing-preservation-capacities-unit-scheme/download-circulars-1', 'ministry_portal', 'central', 'weekly', 1, true, 'Current CEFPPC EOI, FAQ and approved-project-status notices.'),
  ('MoFPI APC current guidelines', 'https://www.mofpi.gov.in/en/announcements/operational-guidelines-scheme-creation-infrastructure-agro-processing-clusters-apc', 'guideline', 'central', 'monthly', 1, true, 'Official 25 April 2025 operational-guidelines page for the APC component of PMKSY.'),
  ('MoFPI APC guideline archive', 'https://www.mofpi.gov.in//Schemes/agro-processing-cluster/download-guidelines-2', 'ministry_portal', 'central', 'monthly', 1, true, 'Official APC guideline archive and dated revisions.'),
  ('MoFPI APC circulars and project status', 'https://mofpi.gov.in/Schemes/agro-processing-cluster/download-circulars-2', 'ministry_portal', 'central', 'weekly', 1, true, 'Current APC EOI, FAQ and approved-project-status notices.'),
  ('MoFPI official home and PMKSY index', 'https://mofpi.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Official PMKSY component index and current Ministry announcements.'),
  ('MoFPI SAMPADA application portal', 'https://sampada-mofpi.gov.in/', 'implementing_portal', 'central', 'weekly', 1, true, 'Official Ministry application handoff for PMKSY EOI submissions.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
