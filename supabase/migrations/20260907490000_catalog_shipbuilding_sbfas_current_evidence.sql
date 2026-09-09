-- Current Shipbuilding Financial Assistance Scheme evidence.
-- The record is a shipyard/vessel-contract route, not a generic logistics
-- subsidy or an entitlement for ordinary transport businesses.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Ministry of Ports SBFAS modified guidelines', 'https://shipmin.gov.in/sites/default/files/Modified%20Guidelines%20for%20implementation%20of%20Shipbuilding%20Financial%20Assistance%20Scheme%20%28SBFAS%29_0.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official modified SBFAS guidelines dated 7 January 2026 with contract dates, assistance rates, domestic content, application and verification conditions.'),
  ('Ministry of Ports shipping guidelines index', 'https://shipmin.gov.in/en/orders/guideline', 'notice_index', 'central', 'weekly', 1, true, 'Official Ministry index listing current SBFAS, SBFAP and shipbuilding development guidelines.'),
  ('Ministry of Ports SBFAS official notice', 'https://shipmin.gov.in/en/content/modified-guidelines-implementation-shipbuilding-financial-assistance-scheme-sbfas', 'scheme_page', 'central', 'weekly', 1, true, 'Official notice page for the modified SBFAS guidelines and current Ministry metadata.'),
  ('Ministry of Ports shipping guidelines overview', 'https://shipmin.gov.in/guideline/guidelines-shipping', 'scheme_page', 'central', 'weekly', 1, true, 'Current official shipping-guidelines overview including SBFAS and related shipbuilding routes.'),
  ('Ministry of Ports, Shipping and Waterways official portal', 'https://shipmin.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Ministry portal for current shipbuilding notices, forms and competent-authority routes.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
