-- Current Shipbuilding Development Scheme evidence.
-- Greenfield clusters, brownfield expansion and credit-risk coverage remain
-- separate opportunity records because their applicants and benefits differ.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Ministry of Ports SbDS guideline index', 'https://shipmin.gov.in/en/orders/guideline', 'notice_index', 'central', 'weekly', 1, true, 'Official index listing the current Greenfield, Brownfield and Risk Coverage SbDS guidelines.'),
  ('SbDS Greenfield Shipbuilding Cluster guidelines', 'https://shipmin.gov.in/sites/default/files/Annexure%203%20Greenfield%20guidelines.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official Greenfield SbDS guidelines for SPV-led cluster infrastructure and capital assistance.'),
  ('SbDS Brownfield Capacity Expansion guidelines', 'https://shipmin.gov.in/sites/default/files/Annexure%204%20Brownfield_V23%20%282%29_0.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official Brownfield SbDS guidelines for existing shipyard expansion and capital assistance.'),
  ('SbDS Shipbuilding Risk Coverage guidelines', 'https://shipmin.gov.in/sites/default/files/Annexure%202%20Credit%20risk%20coverage%20guidelines_0.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official SbDS credit-risk coverage guidelines for pre-shipment, post-shipment and vendor-default risks.'),
  ('SbDS Greenfield official notice', 'https://shipmin.gov.in/en/content/guidelines-greenfield-shipbuilding-cluster-development-under-shipbuilding-development-0', 'scheme_page', 'central', 'weekly', 1, true, 'Official Ministry page for Greenfield SbDS guideline metadata.'),
  ('SbDS Brownfield official notice', 'https://shipmin.gov.in/en/content/guidelines-brownfield-capacity-expansion-under-shipbuilding-development-scheme-sbds', 'scheme_page', 'central', 'weekly', 1, true, 'Official Ministry page for Brownfield SbDS guideline metadata.'),
  ('SbDS Risk Coverage official notice', 'https://shipmin.gov.in/en/content/guidelines-shipbuilding-risk-coverage-under-shipbuilding-development-scheme-sbds-0', 'scheme_page', 'central', 'weekly', 1, true, 'Official Ministry page for Risk Coverage SbDS guideline metadata.'),
  ('Ministry of Ports shipping guidelines overview', 'https://shipmin.gov.in/guideline/guidelines-shipping', 'scheme_page', 'central', 'weekly', 1, true, 'Current official overview for SBFAS, SbDS and related shipping guidelines.'),
  ('Directorate General of Maritime Administration SbDS portal', 'https://dgma.gov.in/pillar3-shipbuilding-development-scheme', 'implementing_portal', 'central', 'weekly', 1, true, 'Official current implementation overview with component outlays, cluster status and brownfield route context.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
