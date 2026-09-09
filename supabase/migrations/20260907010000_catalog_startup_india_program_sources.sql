-- Expand the Central source registry with official Startup India programme and
-- discovery pages. These rows are crawl inputs only; they do not publish or
-- approve any opportunity record.
insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Startup India official portal', 'https://www.startupindia.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Startup India authority portal used for authority identity and programme navigation; individual opportunities require their own evidence source.'),
  ('Department of Science and Technology official portal', 'https://dst.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Underlying authority portal for Technology Business Incubator guidance and calls; Startup India is discovery evidence only until direct source review.'),
  ('BIRAC official portal', 'https://birac.nic.in/', 'agency_portal', 'central', 'weekly', 1, true, 'Underlying implementing-agency portal for BioNEST guidance and calls.'),
  ('Atal Innovation Mission official portal', 'https://aim.gov.in/', 'agency_portal', 'central', 'weekly', 1, true, 'Underlying authority portal for Atal Incubation Centre guidance and calls.'),
  ('Ministry of Electronics and Information Technology official portal', 'https://www.meity.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Underlying authority portal for TIDE 2.0 guidance and calls.'),
  ('MSME RAMP MSE ODR scheme page', 'https://ramp.msme.gov.in/ramp/index.php/RAMP-initiative/mse-odr/mse-odr-scheme', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Ministry of MSME RAMP page for the Online Dispute Resolution scheme.'),
  ('MSME RAMP MSE ODR guidelines', 'https://ramp.msme.gov.in/ramp/pdf-documents/scheme-guidelines/odr-guidelines.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official MSE ODR guidelines for scope, eligibility and assistance limits.'),
  ('MSME RAMP MSE GIFT scheme page', 'https://ramp.msme.gov.in/ramp/RAMP-initiative/mse-gift/gift-risk-sharing-facility-coverage-rsf', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Ministry of MSME RAMP page for green investment and financing support.'),
  ('MSME RAMP MSE SPICE scheme page', 'https://ramp.msme.gov.in/ramp/RAMP-initiative/mse-spice/mse-spice', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Ministry of MSME RAMP page for circular-economy capital subsidy.'),
  ('MSME RAMP TEAM initiative page', 'https://ramp.msme.gov.in/ramp/RAMP-initiative/msme-team-initiative/msme-team-initiative', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Ministry of MSME RAMP page for digital marketing and ONDC market access.'),
  ('PM Vishwakarma official portal', 'https://pmvishwakarma.gov.in/Home/', 'implementing_portal', 'central', 'weekly', 2, true, 'Official PM Vishwakarma application and beneficiary portal.'),
  ('PM Vishwakarma official guidelines', 'https://pmvishwakarma.gov.in/cdn/MiscFiles/eng_v30.0_PM_Vishwakarma_Guidelines_final.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official scheme guidelines for trades, eligibility, verification, training, toolkit, credit and marketing components.'),
  ('Startup India programmes and challenge directory', 'https://www.startupindia.gov.in/content/sih/en/ams-application/application-listing.html', 'ministry_portal', 'central', 'weekly', 2, true, 'Official discovery directory for startup schemes, incubator programmes, challenges, procurement, and awards; each item requires source-level review before publication.'),
  ('Startup India Credit Guarantee Scheme for Startups', 'https://www.startupindia.gov.in/content/sih/en/credit-guarantee-scheme-for-startups.html', 'ministry_portal', 'central', 'weekly', 2, true, 'Official CGSS detail page; capture current eligibility, guarantee structure, lender route, and amendments with page or section evidence.'),
  ('Startup India incubator schemes', 'https://www.startupindia.gov.in/content/sih/en/incubator-schemes.html', 'ministry_portal', 'central', 'weekly', 2, true, 'Official incubator-scheme discovery/detail page; each underlying programme remains separately reviewable.'),
  ('Startup India Bharat Startup Grand Challenge', 'https://www.startupindia.gov.in/content/sih/en/bharat-startup-grand-challenge.html', 'ministry_portal', 'central', 'weekly', 2, true, 'Official challenge page; window, eligibility, and selection details are deadline-sensitive.'),
  ('Startup India National Startup Awards', 'https://www.startupindia.gov.in/content/sih/en/nsa-landing.html', 'ministry_portal', 'central', 'weekly', 2, true, 'Official awards page; categories, windows, eligibility, and benefits require current-edition review.'),
  ('Startup India Fund of Funds 2.0 scheme document', 'https://www.startupindia.gov.in/content/dam/startupindia/Startup-India-Fund-of-Funds-2.0-Scheme.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official scheme document registered for later extraction; a failed fetch or inaccessible document must never be treated as verified evidence.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
