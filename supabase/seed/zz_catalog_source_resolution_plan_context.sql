-- Review-only source context for current capture-resolution plans.
-- These URLs are registered for future reviewer capture and comparison;
-- registration alone is not evidence, approval, or a primary-source change.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, active)
values
  ('Assistance to Training Institutions official portal context', 'https://ati.msme.gov.in/', 'agency', 'central', 'weekly', true),
  ('Central Pollution Control Board official portal context', 'https://cpcb.nic.in/', 'agency', 'central', 'weekly', true),
  ('National Cooperative Development Corporation official portal context', 'https://www.ncdc.in/', 'agency', 'central', 'weekly', true),
  ('Employees Provident Fund Organisation official portal context', 'https://www.epfindia.gov.in/', 'agency', 'central', 'weekly', true),
  ('Food Safety and Standards Authority of India official portal context', 'https://fssai.gov.in/', 'agency', 'central', 'weekly', true),
  ('FSSAI 2026 licensing and registration amendment FAQ context', 'https://fssai.gov.in/upload/advisories/2026/03/69c6a23234827order_27032026.pdf', 'guideline', 'central', 'weekly', true),
  ('Development Commissioner Handicrafts official portal context', 'https://handicrafts.nic.in/', 'agency', 'central', 'weekly', true),
  ('KVIC PMEGP official portal context', 'https://kviconline.gov.in/pmegpeportal/', 'agency', 'central', 'weekly', true),
  ('Department of Pharmaceuticals official portal context', 'https://pharmaceuticals.gov.in/', 'ministry', 'central', 'weekly', true),
  ('MeitY Startup Hub official portal context', 'https://msh.meity.gov.in/', 'agency', 'central', 'weekly', true),
  ('Startup India official mentorship route context', 'https://www.startupindia.gov.in/', 'startup_india', 'central', 'weekly', true),
  ('Ministry of Tribal Affairs official portal context', 'https://tribal.gov.in/', 'ministry', 'central', 'weekly', true),
  ('Women Entrepreneurship Platform official portal context', 'https://wep.gov.in/', 'agency', 'central', 'weekly', true),
  ('KVIC official office portal context', 'https://kviconline.gov.in/kvicoffice.jsp', 'agency', 'central', 'weekly', true),
  ('KVIC certified PMEGP guideline context', 'https://kviconline.gov.in/pmegpeportal/pmegpeportaltutorialdoc/PMEGP_Guidelines_Certified_2022_3.pdf', 'guideline', 'central', 'weekly', true),
  ('Ministry of Skill Development and Entrepreneurship official portal context', 'https://msde.gov.in', 'ministry', 'central', 'weekly', true),
  ('MSME Annual Report procurement-policy context', 'https://msme.gov.in/sites/default/files/MSME-ANNUAL-REPORT-2024-25-ENGLISH.pdf', 'ministry', 'central', 'weekly', true),
  ('Ministry of Tourism NIDHI portal context', 'https://nidhi.tourism.gov.in', 'agency', 'central', 'weekly', true),
  ('MSME RAMP official portal context', 'https://ramp.msme.gov.in/ramp', 'agency', 'central', 'weekly', true),
  ('Indian Railways startup procurement portal context', 'https://secr.indianrailways.gov.in', 'agency', 'central', 'weekly', true),
  ('TRIFED official implementing-agency portal context', 'https://trifed.tribal.gov.in', 'agency', 'central', 'weekly', true),
  ('Bureau of Energy Efficiency official portal context', 'https://www.beeindia.gov.in', 'agency', 'central', 'weekly', true),
  ('PM-eBus Sewa official portal context', 'https://www.disclaimerpms.mohua.gov.in', 'agency', 'central', 'weekly', true),
  ('EPFO PMVBRY official press-release context', 'https://www.epfindia.gov.in/site_docs/PDFs/EPFO_PRESS_RELEASES/PressRelease_03092025_MOLECautionsCitizensAgainstFakePMVBRY.pdf', 'agency', 'central', 'weekly', true),
  ('EPFO official newsletter context', 'https://www.epfindia.gov.in/site_docs/PDFs/Updates/Newsletter_July_September_2025_EPFO.pdf', 'agency', 'central', 'weekly', true),
  ('EPFO official Ease of Doing Business registration context', 'https://www.epfindia.gov.in/site_en/EODB.php?id=sm22_index', 'agency', 'central', 'weekly', true),
  ('MeitY official programme context', 'https://www.meity.gov.in/static/uploads/2024/02/32-1.pdf', 'ministry', 'central', 'weekly', true),
  ('MoFPI CEFPPC official scheme context', 'https://www.mofpi.gov.in/en/Schemes/about-cefppc-scheme', 'ministry', 'central', 'weekly', true),
  ('MoFPI CEFPPC official guideline context', 'https://www.mofpi.gov.in/sites/default/files/cefppc_scheme_guidelines_dated_08.06.2022.pdf', 'guideline', 'central', 'weekly', true),
  ('MSME Technology Centres official route context', 'https://www.msme.gov.in/technology-centres', 'ministry', 'central', 'weekly', true),
  ('MyMSME Coir component context', 'https://www.my.msme.gov.in/MyMsmeMob/MsmeScheme/Pages/1_3_5_1.html', 'agency', 'central', 'weekly', true),
  ('NCDC official annual-report context', 'https://www.ncdc.in/documents/annual-report/2813271221NCDC_Annual-Report_2020-21_English.pdf', 'agency', 'central', 'weekly', true),
  ('PIB official current-status context', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2289997', 'pib', 'central', 'weekly', true),
  ('Skill India Digital official portal context', 'https://www.skillindiadigital.gov.in', 'agency', 'central', 'weekly', true)
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  active = true;
