-- Official MoPNG/EIL evidence for financial assistance to CBG producers for
-- biomass aggregation machinery. This is a project-specific grant with
-- quarterly intake and strict pre-purchase/verification obligations.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('MoPNG natural-gas policies and guidelines index', 'https://mopng.gov.in/en/natural-gas/policies-guidelines', 'ministry_portal', 'central', 'weekly', 1, true, 'Official MoPNG index listing the revised BAM guideline and related CBG policies.'),
  ('MoPNG revised BAM scheme guideline', 'https://mopng.gov.in/files/natural-gas/policies-and-guidelines/Revised-scheme-guideline.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official revised guideline for financial assistance to CBG producers for biomass aggregation machinery.'),
  ('MoPNG BAM guideline copy hosted by GOBARdhan', 'https://gobardhan.sbm.gov.in/whats-new/1752042813_2a6f019a8e6186349c85.pdf', 'guideline', 'central', 'monthly', 1, true, 'Government-hosted copy exposing eligibility, quarterly intake, deadline, documents, verification and beneficiary obligations.'),
  ('GOBARdhan unified CBG registration portal', 'https://gobardhan.eil.co.in/petroleum_ministry', 'application_portal', 'central', 'weekly', 1, true, 'EIL-hosted Government portal for CBG/Bio-CNG plant registration and BAM route access.'),
  ('EIL BAM application portal', 'https://bam.eil.co.in/', 'application_portal', 'central', 'weekly', 1, true, 'Official Project Management Agency portal for BAM applications; credentials and submissions remain outside UdyamVeda.'),
  ('EIL BAM application document checklist', 'https://bam.eil.co.in/AboutSchemeNew.pdf', 'application_guidance', 'central', 'monthly', 1, true, 'Official implementing-portal document checklist for DPR, registration, tax identity, quotations and declarations.'),
  ('MoPNG SATAT overview', 'https://mopng.gov.in/en/pdc/investible-projects/alternate-fuels/sustainable-alternative-towards-affordable-transportation', 'scheme_page', 'central', 'monthly', 1, true, 'Official SATAT context: independent entrepreneurs, CBG production and OMC offtake; not treated as a cash benefit in the BAM record.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
