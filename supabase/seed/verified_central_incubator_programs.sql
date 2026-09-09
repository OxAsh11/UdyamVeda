-- Central incubator-programme records discovered from the official Startup
-- India incubator page. They remain in_review until the underlying authority
-- guidelines and current application windows are checked.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('DST Technology Business Incubator official route', 'https://nidhi.dst.gov.in/nidhitbi', 'agency_portal', 'central', 'monthly', 1, true, 'Canonical primary source cited by the DST Technology Business Incubator review packet.'),
  ('Atal Innovation Mission Atal Incubation Centres official page', 'https://aim.gov.in/atal-incubation-centres.php', 'agency_portal', 'central', 'monthly', 1, true, 'Canonical primary source cited by the Atal Incubation Centres review packet.'),
  ('BIRAC BioNEST official page', 'https://birac.nic.in/bionest.php', 'agency_portal', 'central', 'monthly', 1, true, 'Canonical primary source cited by the BioNEST review packet.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Supporting evidence source 001', 'https://agriinfra.dac.gov.in/Documents/Circular/BB3379A9D79A4DF09414E3F1DAE59AFD.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 002', 'https://agriinfra.dac.gov.in/Content/DocAttachment/FINALSchemeGuidelinesAIF.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 003', 'https://sezindia.gov.in/how-to-apply', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 004', 'https://sezindia.gov.in/sez-rules-and-amendments', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 005', 'https://sezindia.gov.in/instructions', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 006', 'https://www.pharmaceuticals.gov.in/sites/default/files/Details%20of%20Applications%20approved%20under%20Production%20Linked%20Incentive.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 007', 'https://pharmaceuticals.gov.in/sites/default/files/Final%20Boosting%20of%20Medical%20Devices%20Industry%20-%20Report%20-%202023.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 008', 'https://www.pharmaceuticals.gov.in/sites/default/files/Guidelines%20of%20the%20Scheme%20Promotion%20of%20Medical%20Devices%20Parks.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 009', 'https://cdnbbsr.s3waas.gov.in/s312b1e42dc0746f22cf361267de07073f/uploads/2026/05/20260520803129779.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 010', 'https://coal.gov.in/sites/default/files/2026-06/04-06-2026b-wn%20.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 011', 'https://mofpi.gov.in/en/pmfme/shgs-fpos-co-operatives-individual-micro-food-enterprise', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 012', 'https://pmfme.mofpi.gov.in/?trk=public_post_reshare-text', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 013', 'https://www.mofpi.gov.in/sites/default/files/1585.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 014', 'https://pli.texmin.gov.in/frontend/images/Documents/PLI%20Textile_%20User%20guide%20Cum%20SOP%20-%2016.04.2025.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 015', 'https://seedfund.startupindia.gov.in/startup', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 016', 'https://www.ivri.nic.in/Rabi/document/NavodayaInstructions.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 017', 'https://ivri.nic.in/Division/JD/ExtenstionEdu', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 018', 'https://ivri.nic.in/Rabi/downloads/publications/Newsletters/Newsletter-Srijan-1st%20Issue.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 019', 'https://www.dahd.gov.in/sites/default/files/2026-04/AnnualReport2025-26.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 020', 'https://dahd.gov.in/node/3914', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 021', 'https://www.dahd.gov.in/en/schemes/programmes/national_livestock_mission', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 022', 'https://dahd.gov.in/en/nlm-edp', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 023', 'https://chemicals.gov.in/sites/default/files/inline-files/CPDSguidline1.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 024', 'https://chemicals.gov.in/sites/default/files/Reports/annual_report_2025-26_Eng_1.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 025', 'https://www.mudra.org.in', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 026', 'https://financialservices.gov.in/beta/sites/default/files/2026-04/DFS-ANNUAL-REPORT-ENGLISH-2025-26.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 027', 'https://nfdp.dof.gov.in/nfdp/#', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 028', 'https://pmmkssy.dof.gov.in/pmmkssy/#/guidelines', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 029', 'https://pharma-dept.gov.in/important-document', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 030', 'https://cdnbbsr.s3waas.gov.in/s312b1e42dc0746f22cf361267de07073f/uploads/2023/09/202309061141858190.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 031', 'https://cdnbbsr.s3waas.gov.in/s312b1e42dc0746f22cf361267de07073f/uploads/2023/09/20230906543462663.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 032', 'https://nidhi.dst.gov.in/document/list-of-nidhi-centres-of-excellence', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 033', 'https://www.nidhi-eir.in', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 034', 'https://cdnbbsr.s3waas.gov.in/s312b1e42dc0746f22cf361267de07073f/uploads/2024/03/202403201078034720.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 035', 'https://nidhi.dst.gov.in/document-category/programme-wise-tbi-lists', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 036', 'https://www.ifcicegssc.in/Home/FAQ', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 037', 'https://www.ifcicegssc.in/DownloadForms', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 038', 'https://dcis.dot.gov.in/assets/document/DCIS_Guidelines2.0.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 039', 'https://www.pli-telecom.udyamimitra.in', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 040', 'https://www.mtcte.tec.gov.in', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 041', 'https://nccs.gov.in', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 042', 'https://pm-ebus-sewa.mohua.gov.in/?page_id=631', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 043', 'https://pm-ebus-sewa.mohua.gov.in/?page_id=857', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 044', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2237554&reg=3&lang=2', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 045', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2303797&lang=2&reg=48', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 046', 'https://ngo.ayush.gov.in/scheme6', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 047', 'https://ngo.ayush.gov.in/faq', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 048', 'https://www.ayush.gov.in', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 049', 'https://www.civilaviation.gov.in/ministry-documents/notifications/archive-document', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 050', 'https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1822838', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 051', 'https://www.pib.gov.in/pressreleasepage.aspx?lang=2&prid=1776089&reg=48', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 052', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1880690&lang=2&reg=48', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 053', 'https://lm.doca.gov.in/oregis/Certificates.aspx', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 054', 'https://lm.doca.gov.in/OREGIS/uploads/14862/14862_10-03-2026_1.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 055', 'https://consumeraffairs.gov.in/index.php/pages/legal-metrology-act', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 056', 'https://consumeraffairs.gov.in/pages/legal-metrology-overview', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 057', 'https://lm.doca.gov.in/modelapproval/Certificates.aspx', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 058', 'https://lm.doca.gov.in/ModelApproval/Certificates/2026/20.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 059', 'https://consumeraffairs.gov.in/public/upload/admin/cmsfiles/whatsnews/FAQs_on_Packaged_Commodities%2C%20Rules_2011_whatsnews.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 060', 'https://consumeraffairs.gov.in/public/upload/admin/cmsfiles/whatsnews/Book_on_Legal_Metrology_Packaged_Commodities_Rules%2C2011_with_all_amendments_whatsnews.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 061', 'https://consumeraffairs.gov.in/public/upload/files/2026.02.13%20PCR%201st%20COO%20Filter%20on%20e-commerce%20websites_1771231030.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 062', 'https://www.ncdc.in/index.jsp?page=common-application', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 063', 'https://www.ncdc.in/documents/annual-report/0016261222Annual-Report_2021-22-English.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 064', 'https://www.ncdc.in/documents/other/4822131219Activities-Assisted-and-Pattern-of-Assistance.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 065', 'https://www.incometax.gov.in/iec/foportal/central-state-government-approved-undertaking-agency', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 066', 'https://culture.gov.in/files/inline-documents/Revised_Guidelines_TCC_Scheme_07092022.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 067', 'https://culture.gov.in/financial-assistance-cultural-organizations-national-presence-minutes', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 068', 'https://www.meity.gov.in/whats-new', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 069', 'https://msh.meity.gov.in/schemes/tide', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 070', 'https://www.meity.gov.in/offerings?persona=Business-owner', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 071', 'https://cpc.parivesh.nic.in/SingleWindow.aspx', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 072', 'https://cpc.parivesh.nic.in/acts.aspx?id=EC', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 073', 'https://cpc.parivesh.nic.in/writereaddata/ENV/EnvironmentalClearance-General/18.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 074', 'https://www.mofpi.gov.in/sites/default/files/operational_revised_cold_chain_scheme_duidelines_dated_22.05.2025.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 075', 'https://www.mofpi.gov.in/node/197', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 076', 'https://www.mofpi.gov.in/en/announcements/extension-timeline-1700-hrs-30092026-submission-multiproduct-food-irradiation', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 077', 'https://www.mofpi.gov.in/announcements-archive', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 078', 'https://www.mofpi.gov.in/sites/default/files/20250122205611_1.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 079', 'https://www.mofpi.gov.in/sites/default/files/eoi_notice_0.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 080', 'https://www.mofpi.gov.in/en/Schemes/agro-processing-cluster/download-guidelines-2', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 081', 'https://www.mofpi.gov.in/sites/default/files/_annex_266_au2946_tb9abm.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 082', 'https://heavyindustries.gov.in/en/rajya-sabha-q-a?page=2', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 083', 'https://heavyindustries.gov.in/en/pli-scheme-automobile-and-auto-component-industry', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 084', 'https://pliauto.in/approvedaatproduct/1', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 085', 'https://pliauto.in/docs/app/List%20of%20Approved%20Applicants%20-%20Feb%202026.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 086', 'https://heavyindustries.gov.in/sites/default/files/2024-01/notification-pli_auto-amendment-in-guidelines-29-12-2023_0.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 087', 'https://www.labour.gov.in/static/uploads/2025/09/353e2fe2cb47ec3385be85ff44afda63.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 088', 'https://labour.gov.in/sites/default/files/pib2209767.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 089', 'https://my.msme.gov.in/mymsme/Scheme.aspx', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 090', 'https://my.msme.gov.in/MyMsmeMob/MsmeScheme/Pages/0_3_1.html', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 091', 'https://ic.msme.gov.in/IC_APP/WriteReadData/GuideLine/MDAGuidelines_2024.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 092', 'https://www.kvic.gov.in', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 093', 'https://msme.gov.in/offerings', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 094', 'https://dashboard.msme.gov.in/cdp.aspx', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 095', 'https://msme.gov.in/sites/default/files/ModifiedGuidelinesofMSE_0.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 096', 'https://ramp.msme.gov.in/ramp/pdf-documents/scheme-guidelines/MSE-GIFT-Circular.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 097', 'https://ramp.msme.gov.in/ramp/scheme-guidelines', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 098', 'https://ramp.msme.gov.in/ramp/RAMP-initiative/mse-odr/mse-odr-scheme', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 099', 'https://lean.msme.gov.in/Home/FAQs', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 100', 'https://dcmsme.gov.in/CLCS_TUS_Scheme/TCSP/new-Technology-Centers/Scheme_Guidelines.aspx', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 101', 'https://www.dcmsme.gov.in/CLCS_TUS_Scheme/TCSP/new_tcs.aspx', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 102', 'https://ramp.msme.gov.in/ramp/pdf-documents/scheme-guidelines/Approved-msme-team-guidelines.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 103', 'https://www.nsic.co.in/Corporate/AboutUs', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 104', 'https://www.nsic.co.in/Schemes/MarketingFacilitation?AspxAutoDetectCookieSupport=1', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 105', 'https://ner-promotion.msme.gov.in/NERegion/schemes/RevisedGuidelines_NER_Sikkim.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 106', 'https://msme.gov.in/sites/default/files/SO-581_E_23_March_2012.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 107', 'https://www.nsic.co.in/Schemes/SinglePointRegistration', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 108', 'https://pmkusum.mnre.gov.in', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 109', 'https://mnre.gov.in/en/notice/comprehensive-guidelines-for-implementation-of-pradhan-mantri-kisan-urja-suraksha-evam-utthaan-mahabhiyaan-pm-kusum-scheme', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 110', 'https://bam.eil.co.in/Default', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 111', 'https://bam.eil.co.in/Frequently%20asked%20questions%20BAM%2031.03.2025%20rev.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 112', 'https://shipmin.gov.in/en/content/guidelines-greenfield-shipbuilding-cluster-development-under-shipbuilding-development-scheme', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 113', 'https://www.shipmin.gov.in/sites/default/files/Annexure%202%20Credit%20risk%20coverage%20guidelines.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 114', 'https://shipmin.gov.in/en/content/modified-guidelines-implementation-shipbuilding-financial-assistance-scheme-sbfas-0', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 115', 'https://adeetie.beeindia.gov.in/list-of-energy-efficient-technologies', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 116', 'https://beeindia.gov.in/sites/default/files/ADEETIE_Brochure.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 117', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2238227&lang=1&reg=3', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 118', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2286582&lang=1&reg=3', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 119', 'https://steel.gov.in/sites/default/files/2026-04/OOMF%202026-27%20%281%29.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 120', 'https://nidhi.tourism.gov.in/home', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 121', 'https://nidhi.tourism.gov.in/home/page/accommodation-units', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 122', 'https://trifed.tribal.gov.in/index.php/node/1857', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 123', 'https://tribal.gov.in/downloads/Livelihood/Guidelines/VCF-STGuidelines1123.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 124', 'https://ifciventure.com', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 125', 'https://aim.gov.in/pdf/AIC-Guidelines-Final_24Nov-2023.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 126', 'https://www.aim.gov.in/established-incubation-centres.php', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 127', 'https://aim.gov.in/aic-overview.php', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 128', 'https://www.birac.nic.in/webcontent/bionest_guidelines_2025.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 129', 'https://birac.nic.in/desc_new.php?id=264', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 130', 'https://www.birac.nic.in/webcontent/1761936564_big_new_guidelines_nov_2025.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 131', 'https://www.birac.nic.in/desc_new.php?id=1046', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 132', 'https://www.birac.nic.in/cfp_view.php?id=32&scheme_type=5', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 133', 'https://www.crsbis.in/BIS/registration-page.do', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 134', 'https://www.crsbis.in/BIS/bis_lab.do', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 135', 'https://www.crsbis.in/BIS/inclusion_renewal.do', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 136', 'https://www.crsbis.in/BIS/app_srv/tdc/gl/docs/Revised_Fee_Structure.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 137', 'https://www.bis.gov.in/fmcs/certification-process/nomination-of-air/?lang=en', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 138', 'https://www.bis.gov.in/fmcs/certification-process/grant-of-licence/?lang=en', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 139', 'https://www.bis.gov.in/fmcs/forms-and-formats/?lang=en', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 140', 'https://www.bis.gov.in/fmcs/fmcs-fee/?lang=en', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 141', 'https://cpcb.nic.in/index.php', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 142', 'https://eprewastecpcb.in', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 143', 'https://www.cgtmse.in/Default/ViewFile/?id=1743176302611_CGTMSE+-+Scheme+Document+CGS+I_updated+as+on+Apr+1+2025.pdf&path=Page', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 144', 'https://www.cgtmse.in/Default/ViewFile/?id=1733998438524_Circular+241-+enhancement+in+extent+of+coverage+for+women+entrepreneurs.pdf&path=Circular', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 145', 'https://svep.nrlm.gov.in/Privacy-Policy.html', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 146', 'https://www.idex.gov.in/disc-category/44', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 147', 'https://idex.gov.in/disc-category/34', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 148', 'https://idex.gov.in/disc-category/35', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 149', 'https://www.idex.gov.in/financial-faq', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 150', 'https://www.idex.gov.in/notices', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 151', 'https://idex.gov.in/disc-category/18', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 152', 'https://www.idex.gov.in/challenges', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 153', 'https://idex.gov.in/financial-faq', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 154', 'https://content.dgft.gov.in/Website/dgftprod/413a800f-f35b-436c-b255-cd781f015731/ANF%205A.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 155', 'https://www.startupindia.gov.in/content/sih/en/startup_ranking_framework.html', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 156', 'https://www.startupindia.gov.in/content/sih/en/nsa2025.html', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 157', 'https://www.startupindia.gov.in/content/sih/en/startup-awards.html', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 158', 'https://www.epfindia.gov.in/site_en/For_Employers.php/Contact_us.php?id=sm4_index', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 159', 'https://registration.shramsuvidha.gov.in', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 160', 'https://foscos.fssai.gov.in/search-eligibility/CL', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 161', 'https://cbic-gst.gov.in/gst-registration-rules.html', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 162', 'https://tutorial.gst.gov.in/userguide/registration/Business_Details.htm', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 163', 'https://gem.gov.in/Startup_Runway', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 164', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2296546&lang=1&reg=6', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 165', 'https://indiacinehub.gov.in/about-us/FAQs', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 166', 'https://www.msme.gov.in/sites/default/files/Revisedguidelines07.12.2023.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 167', 'https://www.ncdc.in/documents/whats-new/3716081121LAUNCH-OF-DAIRY-SAHAKAR.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 168', 'https://nmdfc.org/faq', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 169', 'https://nmdfc.org/credit-1', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 170', 'https://nmdfc.org/termloan', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 171', 'https://innovative.msme.gov.in/Documents/FinalGuidelines_MSME_Innovative.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 172', 'https://dcmsme.gov.in/CLCS_TUS_Scheme/ZED_Scheme/Scheme_Guidelines.aspx', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 173', 'https://www.dcmsme.gov.in/Guidelines_MSME%20Sustainable%28ZED%29%20Certification%20Scheme.pdf', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.'),
  ('Supporting evidence source 174', 'https://tdb.gov.in/acts-and-rules', 'supporting_evidence', 'central', 'monthly', 1, true, 'URL cited as supporting evidence by a controlled review packet; publication remains human-review gated.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;

do $$
declare
  item jsonb;
  authority_id uuid;
  seed_opportunity_id uuid;
  version_id uuid;
begin
  for item in
    select value from jsonb_array_elements($records$[
      {
        "slug":"dst-technology-business-incubator",
        "name":"DST Technology Business Incubator (TBI)",
        "type":"incubator",
        "authority":"Department of Science and Technology - Technology Business Incubator",
        "authority_url":"https://dst.gov.in/",
        "canonical_url":"https://www.startupindia.gov.in/content/sih/en/incubator-schemes.html",
        "source_url":"https://www.startupindia.gov.in/content/sih/en/incubator-schemes.html",
        "source_kind":"ministry",
        "source_title":"Startup India Incubator Schemes - DST TBI",
        "source_anchor":"Schemes for Incubators; DST - TBI; Objective; Eligibility criteria",
        "summary":"Incubation-centre support for technology, knowledge and innovation-based startups, including mentoring and legal, financial, technical and intellectual-property support.",
        "objective":"Promote technology and knowledge-based startups, speed commercialisation of institutional technology and provide value-added incubation support.",
        "legal_basis":"DST Technology Business Incubator information published through Startup India",
        "eligibility":{"entity_types":["academic_institute","technical_institute","r_and_d_institution","not_for_profit_legal_entity"],"conditions":["host institute must have adequate incubation expertise and infrastructure","a non-academic host should have a clear Indian legal purpose related to research, innovation and entrepreneurship","the host institution should generally be in existence for at least three years, subject to the stated government-entity exception"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.startupindia.gov.in/content/sih/en/incubator-schemes.html","route":"eligible host institutions follow the current DST proposal route","applicant":"host institute or eligible institution, not an individual startup applicant"},
        "fine_print":{"institution_led":true,"for_profit_incubator_support":"not supported according to the discovery page","support_areas":["mentoring","capacity building","industry linkages","legal","financial","technical","intellectual property"],"review_note":"Confirm the current DST guideline, proposal window, funding pattern, eligible costs and whether the discovery-page terms remain current before publication."},
        "benefit_summary":{"types":["grant","incubation","mentorship"],"summary":"Institution-led incubation support and startup handholding; funding amount and current call must be verified from the underlying DST authority source."},
        "benefit_type":"grant",
        "benefit_label":"Technology business incubator support",
        "benefit_conditions":{"host_institute_required":true,"underlying_dst_guideline_required":true},
        "requirement":"Eligible host institute and incubation proposal",
        "requirement_description":"An eligible host institution must satisfy the current DST criteria and submit a qualifying incubation proposal.",
        "rules":{"all":[{"field":"eligible_incubator_host","operator":"equals","value":true},{"field":"incubator_proposal_route_open","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Verify host-institute eligibility","description":"Confirm legal status, incubation experience, infrastructure and industry linkages against the current DST guidance.","url":"https://www.startupindia.gov.in/content/sih/en/incubator-schemes.html"},{"title":"Submit the current proposal","description":"Follow the current DST proposal route and retain the institutional and project evidence.","url":"https://dst.gov.in/"}],
        "window_type":"call_for_applications",
        "window_label":"Institutional proposal windows and funding terms require current DST confirmation.",
        "window_evidence":{"source_url":"https://www.startupindia.gov.in/content/sih/en/incubator-schemes.html","anchor":"DST - TBI; Eligibility criteria"}
      },
      {
        "slug":"birac-bionest-incubation-support",
        "name":"BIRAC BioNEST Incubation Support",
        "type":"incubator",
        "authority":"Biotechnology Industry Research Assistance Council - BioNEST",
        "authority_url":"https://birac.nic.in/",
        "canonical_url":"https://www.startupindia.gov.in/content/sih/en/incubator-schemes.html",
        "source_url":"https://www.startupindia.gov.in/content/sih/en/incubator-schemes.html",
        "source_kind":"ministry",
        "source_title":"Startup India Incubator Schemes - DBT BioNEST",
        "source_anchor":"Schemes for Incubators; DBT - BioNest; Objective; Eligibility criteria",
        "summary":"BioNEST support for establishing or strengthening biotech incubation facilities at academic, research, hospital and related organisations.",
        "objective":"Scale biotech incubation, foster innovation and entrepreneurship, and strengthen existing incubators attached to eligible research and academic organisations.",
        "legal_basis":"DBT BioNEST information published through Startup India",
        "eligibility":{"entity_types":["academic_institute","research_institute","research_hospital","biotech_council","incubator"],"conditions":["the applicant must fit one of the published BioNEST categories","private academic, research, hospital or incubator applicants are shown as contributing 20 percent of total capex","already-funded BioNEST facilities may have a separate scale-up route"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.startupindia.gov.in/content/sih/en/incubator-schemes.html","route":"select the applicable BioNEST category and follow the current BIRAC/DBT proposal process","applicant":"eligible host organisation or existing BioNEST facility"},
        "fine_print":{"categories":["new_bionest","state_biotech_or_science_council_bionest","strengthening_existing_incubator","scale_up_existing_bionest"],"private_capex_contribution_percent":20,"possible_equity":"BIRAC may take a small equity position in startups incubated in the facility according to the discovery page","review_note":"Confirm the current BIRAC BioNEST guideline, category-specific funding, capex definition, proposal window and equity terms before publication."},
        "benefit_summary":{"types":["grant","incubation"],"summary":"Biotech incubation-facility support under category-specific routes; funding amount and current call require direct BIRAC verification."},
        "benefit_type":"grant",
        "benefit_label":"Biotech incubator establishment or strengthening support",
        "benefit_conditions":{"biotech_host_required":true,"category_specific":true},
        "requirement":"Eligible BioNEST host or existing facility",
        "requirement_description":"The applicant must fit the applicable BioNEST category and provide the required institutional and facility evidence.",
        "rules":{"all":[{"field":"eligible_bionest_host","operator":"equals","value":true},{"field":"bionest_category_selected","operator":"exists"}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Select the applicable BioNEST category","description":"Determine whether the proposal is for a new facility, state council route, strengthening or scale-up.","url":"https://www.startupindia.gov.in/content/sih/en/incubator-schemes.html"},{"title":"Verify the BIRAC proposal route","description":"Use the current BIRAC/DBT route and document capex, facility and implementation plans.","url":"https://birac.nic.in/"}],
        "window_type":"call_for_applications",
        "window_label":"BioNEST proposal categories and windows require current BIRAC confirmation.",
        "window_evidence":{"source_url":"https://www.startupindia.gov.in/content/sih/en/incubator-schemes.html","anchor":"DBT - BioNest; There are 4 categories under which interested applicants can apply"}
      },
      {
        "slug":"atal-incubation-centres",
        "name":"Atal Incubation Centres (AIC)",
        "type":"incubator",
        "authority":"Atal Innovation Mission - NITI Aayog",
        "authority_url":"https://aim.gov.in/",
        "canonical_url":"https://www.startupindia.gov.in/content/sih/en/incubator-schemes.html",
        "source_url":"https://www.startupindia.gov.in/content/sih/en/incubator-schemes.html",
        "source_kind":"ministry",
        "source_title":"Startup India Incubator Schemes - AIM AIC",
        "source_anchor":"Schemes for Incubators; AIM - AIC; Objective; Eligibility criteria; Funding support",
        "summary":"Incubation-centre support for startups in sectors including manufacturing, health, education, agriculture, water and sanitation, with emphasis on underserved areas.",
        "objective":"Establish and support incubation centres that provide infrastructure and value-added services to startups and promote inclusive innovation ecosystems.",
        "legal_basis":"Atal Incubation Centres information published through Startup India",
        "eligibility":{"entity_types":["public_institution","private_institution","public_private_partnership","academic_institute","research_institute","company","individual_or_group"],"conditions":["the proposed AIC must meet the current AIM eligibility and evaluation criteria","the discovery page allows public, private and PPP modes, but the legal and operating structure must be verified"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.startupindia.gov.in/content/sih/en/incubator-schemes.html","route":"follow the current AIM call and proposal process","applicant":"eligible institution, company or collaboration route"},
        "fine_print":{"focus":["manufacturing","transport","energy","health","education","agriculture","water","sanitation"],"underserved_area_focus":true,"source_displayed_max_grant_inr":100000000,"source_displayed_max_grant_note":"The discovery page displays a maximum grant-in-aid figure in its scheme table; amount, unit, tranche and eligible-cost conditions must be checked in the current AIM guideline before normalising it as a benefit.","review_note":"Do not present the displayed maximum as an applicant entitlement until the current AIM call and funding instrument are verified."},
        "benefit_summary":{"types":["grant","incubation","mentorship"],"summary":"AIC establishment and operating support subject to current AIM eligibility, evaluation and funding conditions."},
        "benefit_type":"grant",
        "benefit_label":"Atal Incubation Centre establishment support",
        "benefit_conditions":{"aic_host_required":true,"current_aim_call_required":true},
        "requirement":"Eligible AIC host and proposal",
        "requirement_description":"The applicant must satisfy the current AIM host, team, business-plan and ecosystem requirements.",
        "rules":{"all":[{"field":"eligible_aic_host","operator":"equals","value":true},{"field":"aic_call_open","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm host and sector fit","description":"Check the proposed host, sector focus, underserved-area rationale and startup-support model against the current AIM call.","url":"https://www.startupindia.gov.in/content/sih/en/incubator-schemes.html"},{"title":"Submit through the AIM route","description":"Prepare the proposal, team, milestones and sustainability plan for the current AIC application process.","url":"https://aim.gov.in/"}],
        "window_type":"call_for_applications",
        "window_label":"AIC applications depend on the current AIM call; no open deadline is assumed from the discovery page.",
        "window_evidence":{"source_url":"https://www.startupindia.gov.in/content/sih/en/incubator-schemes.html","anchor":"AIM - AIC; Funding support"}
      },
      {
        "slug":"meity-tide-2-incubation-centres",
        "name":"MeitY TIDE 2.0 Incubation Centres",
        "type":"incubator",
        "authority":"Ministry of Electronics and Information Technology - TIDE 2.0",
        "authority_url":"https://www.meity.gov.in/",
        "canonical_url":"https://www.startupindia.gov.in/content/sih/en/incubator-schemes.html",
        "source_url":"https://www.startupindia.gov.in/content/sih/en/incubator-schemes.html",
        "source_kind":"ministry",
        "source_title":"Startup India Incubator Schemes - MeitY TIDE 2.0",
        "source_anchor":"Schemes for Incubators; MeitY - TIDE 2.0; Objective; G1C/G2C/G3C; Eligibility criteria",
        "summary":"Technology incubation-centre support with distinct G1C, G2C and G3C roles for deep startup support, aspiring entrepreneurs and unexplored regions.",
        "objective":"Establish incubation centres that help build high-quality technology startups and strengthen innovation and entrepreneurship ecosystems.",
        "legal_basis":"MeitY TIDE 2.0 information published through Startup India",
        "eligibility":{"entity_types":["section_8_entity","registered_society","academic_institute","incubation_centre"],"conditions":["G1C, G2C and G3C categories have different legal-status, experience and industry-linkage conditions","the discovery page states that G1C and G2C centres should nurture other centres","category-specific eligibility must be verified from the current MeitY notice"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.startupindia.gov.in/content/sih/en/incubator-schemes.html","route":"select G1C, G2C or G3C and follow the current MeitY proposal route","applicant":"eligible host or incubation centre"},
        "fine_print":{"categories":{"G1C":"deep startup support, mentoring, capacity building and industry linkages","G2C":"support for aspiring entrepreneurs and students","G3C":"initiate innovation and entrepreneurship ecosystems in unexplored regions"},"source_displayed_support_inr":272000000,"source_displayed_support_note":"The discovery page displays an amount in its scheme table; this is not treated as a per-applicant benefit or entitlement until the current MeitY guideline clarifies unit, tranche and eligible cost.","review_note":"Confirm the current TIDE 2.0 call, category experience requirements, grant structure, milestones and reporting obligations before publication."},
        "benefit_summary":{"types":["grant","incubation","mentorship"],"summary":"Category-specific technology incubation support with mentoring, capacity building and industry-linkage objectives; funding terms require direct MeitY verification."},
        "benefit_type":"grant",
        "benefit_label":"Technology incubation-centre support",
        "benefit_conditions":{"tide_category_required":true,"current_meity_call_required":true},
        "requirement":"TIDE 2.0 category and eligible host",
        "requirement_description":"The host must select a TIDE 2.0 category and satisfy the corresponding legal, experience and industry-linkage requirements.",
        "rules":{"all":[{"field":"eligible_tide_host","operator":"equals","value":true},{"field":"tide_category_selected","operator":"in","value":["g1c","g2c","g3c"]},{"field":"tide_call_open","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Select the TIDE 2.0 category","description":"Choose G1C, G2C or G3C based on the host experience and intended incubation role.","url":"https://www.startupindia.gov.in/content/sih/en/incubator-schemes.html"},{"title":"Verify and submit the MeitY proposal","description":"Use the current MeitY route and retain legal-status, experience, industry-linkage and implementation evidence.","url":"https://www.meity.gov.in/"}],
        "window_type":"call_for_applications",
        "window_label":"TIDE 2.0 proposal windows and support terms require current MeitY confirmation.",
        "window_evidence":{"source_url":"https://www.startupindia.gov.in/content/sih/en/incubator-schemes.html","anchor":"MeitY - TIDE 2.0; Eligibility criteria"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, official_url)
    select item->>'authority', 'central', null, item->>'authority_url'
    where not exists (select 1 from public.authorities where name = item->>'authority')
    returning id into authority_id;
    if authority_id is null then
      select id into authority_id from public.authorities where name = item->>'authority' limit 1;
    end if;

    seed_opportunity_id := null;
    insert into public.opportunities (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (item->>'slug', item->>'name', item->>'type', 'in_review', authority_id, '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, authority_id = excluded.authority_id, canonical_url = excluded.canonical_url
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then
      select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1;
    end if;

    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.80, 0.78, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where public.opportunities.id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', item->'benefit_conditions'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = item->>'benefit_label');
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'other', item->>'requirement', item->>'requirement_description', true
    where not exists (select 1 from public.opportunity_requirements where opportunity_version_id = version_id and name = item->>'requirement');
    insert into public.eligibility_rule_sets (opportunity_version_id, rules, source_evidence, reviewed)
    select version_id, item->'rules', jsonb_build_array(jsonb_build_object('source_url', item->>'source_url', 'anchor', item->>'source_anchor')), false
    where not exists (select 1 from public.eligibility_rule_sets where opportunity_version_id = version_id);
    insert into public.opportunity_steps (opportunity_version_id, step_number, title, description, official_url)
    select version_id, (row_number() over ())::integer, step->>'title', step->>'description', step->>'url'
    from jsonb_array_elements(item->'steps') as steps(step)
    where not exists (select 1 from public.opportunity_steps where opportunity_version_id = version_id);
    insert into public.opportunity_windows (opportunity_version_id, window_type, label, source_evidence)
    select version_id, item->>'window_type', item->>'window_label', item->'window_evidence'
    where not exists (select 1 from public.opportunity_windows where opportunity_version_id = version_id);
    insert into public.review_tasks (opportunity_version_id, task_type, status)
    select version_id, 'publish', 'open'
    where not exists (select 1 from public.review_tasks where opportunity_version_id = version_id and task_type = 'publish' and status in ('open', 'in_review'));
  end loop;
end $$;
