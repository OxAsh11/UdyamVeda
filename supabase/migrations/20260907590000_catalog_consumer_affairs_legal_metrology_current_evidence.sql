-- Current official Department of Consumer Affairs evidence for national Legal
-- Metrology routes. These are separate compliance records and remain
-- review-gated because product, State/UT, document, fee and portal conditions
-- vary by route and current rules.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Legal Metrology official portal', 'https://lm.doca.gov.in/index.aspx', 'agency_portal', 'central', 'weekly', 1, true, 'Official Department of Consumer Affairs portal describing model approval, importer registration and packaged-commodities registration routes.'),
  ('Legal Metrology packaged commodities registration portal', 'https://lm.doca.gov.in/pcr/', 'agency_portal', 'central', 'weekly', 1, true, 'Official portal route for manufacturer, packer and importer registration under Rule 27 of the Packaged Commodities Rules.'),
  ('Legal Metrology importer registration portal', 'https://lm.doca.gov.in/oregis/', 'agency_portal', 'central', 'weekly', 1, true, 'Official portal route for importer registration of weights and measures under Section 19.'),
  ('Legal Metrology Model Approval System', 'https://lm.doca.gov.in/model/', 'agency_portal', 'central', 'weekly', 1, true, 'Official portal route for model approval of weights and measures under Section 22.'),
  ('Department of Consumer Affairs Legal Metrology Act and rules', 'https://consumeraffairs.gov.in/pages/legal-metrology-act', 'act_and_rules', 'central', 'monthly', 1, true, 'Official Act and rules index, including the Packaged Commodities, Approval of Models and General Rules and amendments.'),
  ('Department of Consumer Affairs weights and measures overview', 'https://consumeraffairs.gov.in/pages/weight-and-measures', 'ministry_portal', 'central', 'monthly', 1, true, 'Official overview of weights/measures, importer registration, model approval and State enforcement rules.'),
  ('Legal Metrology channel of submission', 'https://consumeraffairs.gov.in/pages/channel-of-submission-weights-and-measures', 'application_guide', 'central', 'monthly', 1, true, 'Official channel-of-submission page identifying Rule 27 registration, director nomination and model approval routes.'),
  ('National Single Window System', 'https://www.nsws.gov.in/', 'government_portal', 'central', 'weekly', 1, true, 'Official national single-window route referenced by Legal Metrology for model approval and packaged-commodities registration applications.'),
  ('Legal Metrology packaged commodities certificate list', 'https://lm.doca.gov.in/pcr/certificates', 'agency_portal', 'central', 'weekly', 1, true, 'Official certificate listing used as current operational evidence for Rule 27 registrations.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
