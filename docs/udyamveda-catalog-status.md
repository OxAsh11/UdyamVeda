# UdyamVeda Government Opportunity Catalog

Live integration update (9 September 2026): all 160 migrations and 113 seed files are applied to Supabase. The database contains 174 opportunity/version pairs, 974 source-registry rows, 103 authority entries, and 1,218 pending review checks. Structural and focused RLS tests pass; localhost catalog/search now return HTTP 200 with an empty-unpublished result. Earlier statements below about missing schema or CLI authentication are historical and superseded. See [the current live integration handoff](catalog-live-integration-2026-09-09.md).

Current source-registry checkpoint (2026-09-09): 925 seeded URLs are covered by 975 registered sources after registering missing canonical, supporting, and resolution-plan context sources. Older historical counts below are superseded by the authoritative ledger.

Source-audit exact checkpoint: 925 seeded URLs covered by 975 registered sources.

Latest authoritative ledger: 174 structured Central records, 94 evidence packets covering 174 records, 149 migrations, 925 seeded URLs and 975 registered sources; 0 records are approved for publication.

Current discovery-gap register (2026-09-09): the official Startup India June 2026 Playbook now has 0 unresolved labels and 17 resolved structured drafts, including AcE, LEAP, SEED, GREAT, MAHIR, APEDA BHARATI and NQM. All resolved drafts remain non-publishable until their responsible-authority evidence and human review are complete.

Current manual-evidence checkpoint (2026-09-08): reviewer-only manual intake is available from the source-failure queue. It requires an exact registered primary/alternate URL, a precise anchor, bounded source text, server-side SHA-256 hashing, and an audit event. It stores `manual_official_text` snapshots as `needs_review` and cannot approve or publish an opportunity.

Current provenance correction (2026-09-07): PRIP Component A and B now use the current Department of Pharmaceuticals scheme page and official PRIP guideline PDF as primary evidence; the older guideline URL is retained only as historical compatibility data.

Status: foundation in progress. No legacy record is treated as verified or publishable.

Current audit (2026-09-09): the seed set contains 174 official-source records. It contains 174 Central records across 109 seed files (all 109 are opportunity seed files), plus 4 supporting seed files; the editorial report identifies 174 structured records and 0 raw-SQL dossiers, with zero records allowed to publish automatically. The source audit reports 925 seeded URLs covered by 975 registered sources. These are review-gated local dossiers, not verified public opportunities.

Current review-pack checkpoint (2026-09-09): [catalog-review-pack.json](catalog-review-pack.json) is generated from the structured seed records and gives all 174 records seven explicit review checks: source, eligibility, benefit, application, window, fine print, and amendment. It now joins the exact-URL-bound capture manifest so each record shows whether the official snapshot is missing or captured, while reporting 1,218 pending checks and zero publication-ready records. This is an editor-ready queue, not a verification or publication decision.

Current reviewer workflow correction (2026-09-08): the live catalog review queue accepts a bounded authority filter and resolves authority names through the database before paginating review tasks. Batch-by-authority review therefore remains server-side and does not alter review or publication status.

Current capture-resilience checkpoint (2026-09-08): live capture now has explicit `--http-fallback`, `--http-only`, and `--pdf-only` modes for official sources when Firecrawl is unavailable or exhausted. The PDF path downloads same-host PDFs, records the original document hash, extracts page-separated text with the bundled runtime, and keeps results review-blocked. Single-record writes now append by default; replacement requires an explicit `--replace`. The latest bounded run leaves 202 captured snapshots, all passing local integrity, 0 current evidence gaps, and 0 publication-ready records.

Current snapshot-provenance checkpoint (2026-09-09): migration `20260909030000_catalog_snapshot_provenance.sql` adds immutable capture metadata to `source_snapshots`: capture method, final URL, provider response status, and response content type. The Firecrawl adapter persists `firecrawl_markdown`, while fallback/manual paths remain distinguishable and legacy rows default to `unknown`. Local ingestion, static, source-gap, preflight, typecheck, lint, and production-build checks pass; the migration has not yet been applied to the remote Supabase project.

Current local-gate correction (2026-09-09): the release explanation now matches each capture to the current primary source URL for each record. It reports 174/174 current records with integrity-passing snapshots and 0 current records with failed snapshots; the larger 202-snapshot total includes earlier source versions and alternate evidence and must not be read as 202 currently verified opportunities.

Current source-gap queue (2026-09-09): [catalog-current-source-gaps.json](catalog-current-source-gaps.json) is empty for the 174 current records: every current primary source has an integrity-passing snapshot, with no failed capture, missing snapshot, integrity review or alternate-resolution item remaining. All records remain publication-blocked because source capture is evidence, not human approval.

Current source-plan reconciliation (2026-09-08): the review-only resolution-plan manifest contains 47 unique plans and covers every current failed primary source. The manual-capture check cross-references the current capture manifest and fails if a current failed source has no plan. Plans provide explicit retry/manual instructions only; they do not approve evidence or replace primary provenance.

Current legacy-boundary checkpoint (2026-09-07): the client opportunity page imports taxonomy labels rather than the legacy static scheme dataset, and `catalog:legacy-safety` verifies that the legacy module is only dynamically loaded behind `NODE_ENV !== 'production'` plus `NEXT_PUBLIC_SHOW_LEGACY_DRAFT_CATALOG=true`. Published opportunity actions require database records.

Authoritative latest ledger counts: 174 structured Central opportunity records, 109 opportunity seed files (113 total seed files including the authority baseline, authority-relationship candidates, source-resolution alternates, and resolution-plan context), 149 migrations, 925 seeded source URLs and 975 registered sources. Any older counts in detailed historical descriptions below are superseded by this checkpoint.
Current controlled evidence update (2026-09-09): review packets now cover 94 batches and all 174 records, including NMDFC Virasat, SCLCSS portal/checklist evidence, NSFDC current FAQ terms, NSTFDC current Term Loan routes, the corrected NSTFDC/TRIFED artisan route, current NHDP MSS/SDHS notice-index evidence, current Udyam portal/form/threshold evidence, current MSME Innovative component evidence, current IITF 2026 PMS event evidence, current ZED guideline/process evidence, current TDB Core Funding/RDIF boundary evidence, current WEP ecosystem/mentorship evidence, and BIRAC AcE Fund evidence; all remain review-gated and none authorizes publication.

Latest batch delta: MeitY GENESIS and DoT telecom testing/certification reimbursement added 2 records, followed by 3 Legal Metrology compliance routes (Rule 27, Section 19 and Section 22), 1 PMFME food-processing formalisation route, then 3 MoFPI PMKSY food-processing infrastructure routes (Cold Chain, CEFPPC and APC), 1 Department of Commerce TIES institutional route, 2 DST/NIDHI routes (SSP and CoE), 1 Ministry of Coal gasification route, 1 MoPNG CBG BAM route, 1 DGFT EPCG duty-relief route, 1 SEZ unit approval route, 1 closed MoCA drone PLI route, 1 conditional Indian Railways startup procurement-access route, 1 conditional ADEETIE MSME energy-efficiency route, 1 PM E-DRIVE EV public-charging institutional route, 2 India Post franchise/agent routes, 2 Ministry of Social Justice and Empowerment credit routes (CEGSSC and NSFDC), 3 Ministry of Minority Affairs/NMDFC credit routes (Term Loan, Micro-Finance and Virasat), 4 Ministry of Tribal Affairs/NSTFDC routes (PMJVM, VCF-ST, NSTFDC Term Loan and TRIFED-empanelled Artisan Credit), 3 MoEFCC/CPCB environmental compliance routes (plastic EPR, e-waste EPR and PARIVESH environmental clearance), 3 BIS product-certification/compliance routes (FMCS, jeweller hallmarking registration and CRS), 2 Defence Production/DRDO routes (ADITI and TDF), and 1 Department of Defence Production Scheme for Promotion of MSMEs in Defence route. The latest controlled increments add 1 institutional Promotion of MSMEs in NER and Sikkim route, 1 component-specific KGVY route, and 4 Ministry of Culture institutional routes (CFPG, Allied Cultural Activities, Building Grants including Studio Theatres and Tagore Cultural Complexes). The current source-pack increments add the CPDS grant portal route, the Department of Commerce Annual Report used to reconcile MAI as superseded, the official JanSamarth handoff used by Stand Up India, and the direct DSIR Creative India PRISM 2025 compendium. The Department of Pharmaceuticals RPTUAS route is now added as a paused, review-gated record with 2026 official modifications. The latest controlled evidence increment adds the current NSTFDC Term Loan route with official contribution, interest, repayment and eligibility reconciliation. Historical detail rows below may retain earlier batch descriptions; this checkpoint is authoritative.

Historical detail rows below may contain earlier batch counts; the authoritative current ledger is the checkpoint immediately above.

Current evidence checkpoint (2026-09-09): the latest controlled batches bring the capture manifest to 202 captured snapshots, all passing local integrity, and the current source-gap queue contains 0 publication-blocking capture failures. The evidence validator requires every packet primary, supporting, and resolution-plan source to be registered; that provenance check is clean. Older snapshot totals below are historical and superseded.

## Current status

| Work item | Status | Evidence |
| --- | --- | --- |
| Opportunity/version/source schema | Partial | Foundation schema plus `20260906400000_opportunity_source_registry_link.sql` and `20260907080000_catalog_source_locators.sql`; provenance rows retain a database link and structured page/section/paragraph/document locators, but remote migration execution is still due |
| Source registry metadata | Partial | Migration/seed registry now covers the URLs used by all current seed records, the official IGOD directories, the IGOD-linked plus separately verified authority/parent-ministry portals, the supporting URLs cited by controlled evidence packets, and all resolution-plan alternate URLs; `catalog:source-audit` reports 925 seeded URLs covered by 975 registered sources, but the remote registry and scheduled live crawl state are still due |
| Authority coverage matrix | Partial | `authority_coverage` table, fail-closed/deduplicating IGOD parser, persisted refresh workflow, prior-decision preservation, expected-count mismatch warnings, exact-count progress summary, bounded server-side filtering/pagination, reviewer assessment path, official evidence URL/anchor requirements for terminal decisions, canonical `assessed` status migration, a review-pending `authority_relationships` layer for implementing-authority to IGOD-parent candidates with a paginated confirm/reject queue, and an idempotent `authority_directory_baseline.sql` seed with official portal URLs for all 53 ministry and 50 department baseline rows exist. The deterministic coverage report confirms 103/103 URL-bearing authority rows and 96/96 unique authority portal URLs registered as crawl sources. The [authority assessment ledger](authority-assessment-ledger.json) now contains one pending review row for each of the 103 authorities. The generated [authority-to-opportunity crosswalk](catalog-authority-opportunity-crosswalk.json), exposed through the reviewer-only crosswalk API/UI, now classifies all 174 seeded opportunity records, retains the 73 unresolved opportunity mappings, and exposes 14 unverified declared-authority name candidates without counting them as evidence. The 13-pack source-anchored evidence queue covers all 103 authorities without terminally assessing them. Some rows intentionally use a verified parent-ministry portal rather than a separate department domain; all business-relevance assessments, live extraction, and mapping confirmation are still due |
| Authority assessment workflow | Partial | Reviewer-only coverage API and matrix screen record relevant/not-relevant/unclear decisions with audit notes and audit logs; terminal decisions now require an exact registered `source_registry` row enforced by both the API and database trigger; the matrix returns bounded pages while preserving a full CSV export and global progress counts; unclear decisions remain unresolved and live rows are still not assessed |
| Editorial source policy | Partial | `src/lib/opportunities/editorial.ts`; the policy is implemented locally, while live source review and remote execution remain due |
| Legacy scheme import | Partial | `catalog:legacy-audit` confirms 36 unique records; reviewer-only `/api/admin/catalog/legacy-import` persists the former static records idempotently into `source_snapshots` and `opportunity_drafts` with `needs_review` status and blocking legacy-review errors; the live import still requires a provisioned database and reviewer |
| Evidence-backed seed batch | Partial | Existing seed files contain 174 Central records across 109 opportunity seed files, including the current finance, startup, MSME, registration, procurement, sector, compliance, EV infrastructure, BIS, Defence Production/DRDO, Department of Defence Production MSME promotion, Ministry of Culture National Presence, CFPG, Allied Cultural Activities, Building Grants and Tagore Cultural Complexes, Department of Pharmaceuticals RPTUAS, PMFME, India Cine Hub foreign-film incentive, PM-eBus Sewa, RKVY-RAFTAAR, NIDHI-EIR, NER/Sikkim, KGVY, IN-SPACe Seed Fund, Antariksh Venture Capital Fund, AgriSURE, C2S, SITARE, E-YUVA, PACE and AcE batches; `catalog:seed-audit` confirms 174 unique review-gated identities. All 174 structured records pass per-record editorial and eligibility-rule checks; no raw-SQL dossiers remain. All remain in review and still require manual source-by-source approval. |
| Editorial readiness ledger | Partial | `catalog:review-readiness` enumerates all 174 records, identifies 174 structured records and 0 raw-SQL dossiers, checks source anchors, eligibility unknown handling, benefits, application data, steps, windows and fine-print reviewer notes, and reports zero records as automatically publishable. The generated [record-level review ledger](catalog-review-ledger.json) gives every record the same explicit `in_review`/`blocked` status, and the generated [editor review pack](catalog-review-pack.json) gives every record seven persisted review checks, with 1,218 checks pending and zero publication-ready records; live crawled snapshots and reviewer decisions are still due |
| Official opportunity records | Partial | Seed records have official Government or explicitly allowlisted implementing-agency hosts, including DAHD-linked Udyamimitra application portals; publication still requires human review and approval |
| Database-backed public discovery/detail | Partial | `/api/opportunities` and `/api/opportunities/[slug]` serve approved records; unreviewed records are withheld by default, the legacy catalog requires the explicit development-only `NEXT_PUBLIC_SHOW_LEGACY_DRAFT_CATALOG=true` opt-in, and the search/API/UI now distinguish healthy empty-unpublished state from an unavailable catalog connection |
| Freshness and staleness control | Partial | Approved records are marked stale after 30 days for fixed/call windows or 90 days for rolling/static records; re-verification is required before publication approval |
| Database integrity constraints | Partial | Migrations add bounds for completeness/confidence, benefit amounts/percentages, date windows, and exclusion reasons; database-deferred publication invariants now require reviewed rules, structured benefits/requirements/steps/windows, and registered primary provenance while making approved versions immutable; remote application is still due |
| Opportunity UI wiring | Partial | The schemes view now consumes the database-backed API when approved records exist; it shows an explicit empty-unpublished state by default, a separate unavailable/retry state for database failures, and permits the visibly labelled legacy interface catalog only in non-production development with an explicit opt-in. The client page no longer imports the legacy static dataset, and `catalog:legacy-safety` guards this boundary |
| Eligibility evidence | Partial | Initial Udyam, SISFS, PMEGP, CGTMSE, CGSS, Startup India Fund of Funds 2.0, Investor Connect, and PLI 2.0 IT Hardware evidence is captured; PMEGP, SISFS, CGTMSE, CGSS, Fund of Funds 2.0, Investor Connect, and PLI 2.0 IT Hardware now also have structured requirements, application steps, application-window records, and source locators. The SISFS, CGSS and Fund of Funds 2.0 audits are recorded in `docs/catalog-audits/`; the other records still require manual source-anchor and factual audits. |
| Reviewer workflow | Partial | Protected review queue, objective/legal-basis/eligibility/application/fine-print plus structured benefit/requirement/step/window dossier, visible registered-provenance status, structured source locators, per-check structured evidence capture, explicit eligibility-rule confirmation, official-host provenance, freshness/completeness gates, an authorized transactional approve/reject/request-changes decision function with audit write, and database-enforced approved-version invariants are implemented; passing a checklist item now requires non-empty evidence; migration and reviewer bootstrap are still due |
| Archive and correction workflow | Partial | Reviewer-only records API can archive a record or create a fresh in-review version with new official sources; the prior published version remains current until approval |
| Source refresh operations | Partial | Reviewer-protected source registry screen and refresh endpoint, daily/weekly/monthly Inngest schedulers, Firecrawl extraction restricted to official-host policy, bounded request timeout, usable-content validation, content hashing, idempotent run replay guards, ingestion-run status, and pending authority upsert are implemented. An elevated smoke test successfully fetched usable markdown from the official Udyam portal; source persistence and scheduled crawls remain due until the remote schema is provisioned |
| Ingestion staging and validation | Partial | Source snapshots, AI draft extraction with exact crawled-source evidence checks, deterministic completeness validation, window persistence during draft promotion, payload-hash draft deduplication, discovery upserts, retry-safe staging, and fail-closed checks for snapshot evidence persistence are implemented; live extraction and source-by-source editorial review are still due |
| Source change events and diff review | Partial | `change_events` stores initial/changed/unchanged hashes and reviewer notes; source snapshots and change events now protect crawled bodies, hashes, linkage, event type, summaries, and original timestamps with database triggers while allowing only reviewer disposition fields to change; `/admin/catalog/changes` provides bounded deterministic line diffs with added/removed counts and disposition controls; live source snapshots are still due |
| Draft-to-review promotion | Partial | Reviewer screen can promote a validated draft into an `in_review` opportunity version with a publish task, or reject it; transactional remote execution is still due |
| Central beta gate | Partial | `/admin/catalog/gate` evaluates exact authority inventory counts, approved current versions, registered official provenance, discovery/change blockers, freshness, completeness, and manual factual-accuracy audits; `catalog:gate` protects the route/release invariants. The generated [local gate report](catalog-local-gate-report.json) now records the current blockers deterministically, while live coverage, publication, freshness, and the 98% audit evidence are still due |
| Discovery coverage ledger | Partial | `catalog_discoveries` records active/upcoming crawl findings; relevant findings require an approved record link, unclear findings remain unresolved, and reviewer/beta-gate enforcement is implemented, but no live discovery run has been assessed |
| Recommendation persistence | Partial | `/api/recommendations/run` now resolves a member business, snapshots normalized facts, and stores recommendation runs/results with opportunity-version references; the latest elevated read-only probe reaches Supabase but reports `schema_not_applied` because `public.opportunities` is absent, and no approved catalog data exists |

## Latest environment verification

- The latest elevated read-only probe reports the configured project as reachable but `schema_not_applied`: `public.opportunities` returns HTTP 404. The same probe detects Vercel CLI 59.12.0; Supabase CLI authentication is still absent and no remote migration or seed write has been attempted.
- An elevated Firecrawl smoke test on 07 September 2026 returned HTTP 200 and usable markdown from `https://udyamregistration.gov.in/`; this verifies the configured Firecrawl credential and official-source fetch path, but does not persist or publish a catalog record.
- Earlier controlled Firecrawl/manual captures on 08 September 2026 produced the initial 118-snapshot evidence phase described below; those totals are superseded by the current checkpoints above. The hardened validator rejected one access-denied shipbuilding response and retained it only in the failure queue; the valid Agriculture Infrastructure Fund capture remains intact. The Nandini Sahakar timeout was successfully retried with bounded backoff and now has a primary capture. Earlier failed captures have current exact-URL-bound manual replacements for DRDO TDF, MAI, EPM and the TIES guideline, and the Ministry of Culture National Presence, CFPG, Allied Cultural Activities, Building Grants, Tagore Cultural Complexes, RPTUAS scheme-page, India Cine Hub calculator, Agriculture Infrastructure Fund guideline, PM-KUSUM MNRE page, NLM revised guideline, PM Vishwakarma guideline, PMS guideline, MSME Samadhaan ministry-page, IITF 2026 event, PLI-Auto guideline/amendment, AYUSH hospital-guideline, Ayushman Sahakar NCDC scheme, MSME International Cooperation, MSME Innovative, SFURTI, CPDS, BIRAC SBIRI/BIPP, MSME Technology Centres, NIDHI, DSIR PRISM, CEGSSC, DCIS, telecom PLI, telecom testing reimbursement, PM-eBus Sewa, PM SVANidhi current-tranche clarification and portal disclaimer, MoCA drone-PLI operational guideline, MSE-ODR scheme-page and official guideline PDF, MSME Tool Rooms and Technology Centres network/tool-room dashboards and scheme booklet, Performance and Credit Rating MyMSME scheme page/index/proposal context, MSE-CDP primary guideline, ADEETIE BEE current eligibility page, NAPS-2 PIB release, MoPNG CBG programme-context page, Specialty Steel PLI guideline and PIB status release, Startup India public-procurement context, PMKVY 4.0 MSDE guideline, PMJVM guideline, NIDHI+ guidelines index, KVIC Khadi applications portal, and current Ministry of Ports, Shipping and Waterways Brownfield, shipbuilding risk-coverage and modified SBFAS guidelines, Public Procurement Policy portal, Coir Vikas Yojana guideline, ESDP guideline, PMVBRY Parts A/B guideline. Every capture remains `in_review` and publication-blocked until a reviewer compares the evidence with the official source and approves the record. Raw snapshots are kept under the ignored `.catalog-snapshots/` directory.
- Two captured sources have been passed through the configured `gpt-5.6-luna` extraction path with high reasoning; they produced four exact-source-evidenced draft records, all marked `needs_review` and blocked. The draft manifest is `docs/catalog-live-extraction.json`; no AI output is publication-ready.
- `npm run catalog:remote-status -- --require-schema` remains the required verification command once connectivity is restored; it exits nonzero until both catalog tables exist, without requiring or exposing a service-role key.
- The guarded provisioning dry-run resolved project `xvbirrthvzhhpkdciywd`, and the current read-only readiness report enumerates 149 migrations, 113 seed files, and 109 opportunity seed files. It explicitly performs no authentication, link, migration push, seed write, or release-check query. Docker is not installed, so the same sequence cannot currently be exercised against local Supabase.
- Fresh production runtime probes on ports 3007 and 3049 returned HTTP 503 from `/api/opportunities?limit=1` with `source: "unavailable"`, `availability: "unavailable"`, and `retryable: true`; `/` returned HTTP 200. Database failure is now reported separately from a healthy empty-unpublished catalog, and no legacy records were returned by the current-code instance.
- The repository pins Supabase CLI 2.116.0 through `npx.cmd` in `scripts/apply-catalog-remote.ps1` for Windows PowerShell compatibility; the pinned CLI downloads and reports its version successfully, but `supabase projects list` reports `LegacyPlatformAuthRequiredError` because no `SUPABASE_ACCESS_TOKEN` or CLI login is present. After authentication, the runner will link the project, push migrations, apply the ordered seeds, and run release checks.
- On 07 September 2026, the local catalog checks (116 checks), `catalog:legacy-safety`, `catalog:manual-capture`, TypeScript check, full ESLint pass, diff checks, and production build passed; the current build generated 69 routes.
- On 07 September 2026, the local runtime probe confirmed the new unavailable state. When the database is reachable but has no approved records, the code returns `source: "empty_unpublished"` with `availability: "available"`; when the database cannot be reached, it returns the retryable 503 state above. The legacy catalog remains opt-in and development-only.
- Port 3000 is occupied by an older Next development process (PID 60712) that still serves the legacy draft response; a fresh current-code instance on port 3007 returns the expected empty-unpublished response. Restart the stale process before evaluating the current local UI.
- The Vercel project has Supabase URL/anon, Firecrawl, and Inngest variables, but no server-only `SUPABASE_SERVICE_ROLE_KEY` or `RESEND_API_KEY`.
- Deployment verification (2026-09-09): The repository is linked to the Vercel project currently named `center-app`; the current UdyamVeda catalog routes are deployed and the production API responds. The catalog still reports no approved published records, so publication remains a separate pending track.

## Authority seed sources

1. IGOD Union ministries: https://igod.gov.in/ug/E002/organizations
2. IGOD Union departments: https://igod.gov.in/ug/E003/organizations
3. Startup India schemes discovery: https://www.startupindia.gov.in/content/sih/en/government-schemes.html
4. Startup India scheme detail: https://www.startupindia.gov.in/content/sih/en/startup-scheme.html
5. myScheme discovery: https://www.myscheme.gov.in/
6. Startup India Schemes Playbook: https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf
7. Udyam official portal: https://udyamregistration.gov.in/
8. GST registration document checklist: https://tutorial.gst.gov.in/cbt/registration/gstregistration/course/story_content/external_files/GST_Registration_Document_Checklist.pdf
9. KVIC PMEGP guidelines: https://kviconline.gov.in/pmegpeportal/dashboard/notification/Revised_PMEG_Scheme_Guidelines_07122023_compressed.pdf
10. CGTMSE official overview: https://www.cgtmse.in/Home/VS/3
11. CGTMSE eligible borrowers: https://www.cgtmse.in/Home/VS/95
12. Startup India Credit Guarantee Scheme for Startups page: https://www.startupindia.gov.in/content/sih/en/credit-guarantee-scheme-for-startups.html
13. Startup India Credit Guarantee Scheme for Startups 2025 Gazette guideline: https://www.startupindia.gov.in/content/dam/invest-india/PGF/credit-guarantee-scheme-for-startup.pdf
14. NCGTC Credit Guarantee Scheme for Startups product page: https://www.ncgtc.in/cgss/
15. Jan Samarth national application portal: https://www.jansamarth.in/
16. PMMY official DFS page: https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy
17. Stand Up India official DFS page: https://www.financialservices.gov.in/stand-india-scheme-supi
18. ZED official DC MSME page: https://www.dcmsme.gov.in/CLCS_TUS_Scheme/ZED_Scheme/Scheme_Guidelines.aspx
19. ZED application portal: https://zed.msme.gov.in/
20. MSME Procurement and Marketing Support guidelines: https://msme.gov.in/sites/default/files/PMSSchemeGuidelines.pdf
21. MyMSME PMS portal: https://my.msme.gov.in/MyMsme/Reg/COM_Matu.aspx
22. MSME International Cooperation guidelines: https://msme.gov.in/sites/default/files/Revised_IC_Scheme2023.pdf
23. MSME International Cooperation portal: https://ic.msme.gov.in/
24. MSME Innovative official portal: https://innovative.msme.gov.in/
25. MSME Innovative scheme guidelines: https://design.msme.gov.in/Documents/FinalGuidelines_MSME_Innovative.pdf
26. SFURTI official portal: https://sfurti.msme.gov.in/SFURTI/Home.aspx
27. SFURTI revised guidelines: https://sfurti.msme.gov.in/WriteReadData/Circular/SFURTI_NEW.pdf
28. National SC-ST Hub revised guidelines: https://msme.gov.in/sites/default/files/Revised-NSSH-Guidelines.pdf
29. SCLCSS official portal: https://sclcss.msme.gov.in/Common/Home.aspx
30. ASPIRE operational guidelines: https://aspire.msme.gov.in/WriteReadData/DocumentFile/New_Operational_Guidelines_ASPIRE_2018.pdf
31. Startup India programmes and challenge directory: https://www.startupindia.gov.in/content/sih/en/ams-application/application-listing.html
32. Startup India incubator schemes: https://www.startupindia.gov.in/content/sih/en/incubator-schemes.html
33. Bharat Startup Grand Challenge: https://www.startupindia.gov.in/content/sih/en/bharat-startup-grand-challenge.html
34. National Startup Awards: https://www.startupindia.gov.in/content/sih/en/nsa-landing.html
35. Startup India Fund of Funds 2.0 scheme document: https://www.startupindia.gov.in/content/dam/startupindia/Startup-India-Fund-of-Funds-2.0-Scheme.pdf
36. MSME RAMP MSE ODR scheme: https://ramp.msme.gov.in/ramp/index.php/RAMP-initiative/mse-odr/mse-odr-scheme
37. MSME RAMP MSE ODR guidelines: https://ramp.msme.gov.in/ramp/pdf-documents/scheme-guidelines/odr-guidelines.pdf
38. MeitY TIDE scheme page: https://www.meity.gov.in/offerings/schemes-and-services/details/technology-incubation-and-development-of-entrepreneurs-QMwEjNtQWa
39. MeitY Startup Hub SAMRIDH: https://msh.meity.gov.in/schemes/samridh
40. DST NIDHI PRAYAS 2.0: https://nidhi.dst.gov.in/prayas2-0/
41. DST NIDHI PRAYAS 2.0 guidelines: https://nidhi.dst.gov.in/document/nidhi-prayas-2-0-program-guidelines/
42. BIRAC Biotechnology Ignition Grant: https://www.birac.nic.in/big.php
43. BIRAC BIG user guide: https://birac.nic.in/webcontent/big_user_guide.pdf
44. Agriculture Infrastructure Fund official portal: https://agriinfra.dac.gov.in/
45. Agriculture Infrastructure Fund scheme guidelines: https://agriinfra.dac.gov.in/Documents/Circular/91EE46A50D3941908F192725717E431B.pdf
46. MNRE PM-KUSUM official scheme page: https://mnre.gov.in/en/pradhan-mantri-kisan-urja-suraksha-evam-utthaan-mahabhiyaan-pm-kusum/
47. National PM-KUSUM portal and FAQ: https://pmkusum.mnre.gov.in/landing-faq.html
48. Export Promotion Mission policy update: https://www.commerce.gov.in/wp-content/uploads/2026/02/USQ-1516-PDF.pdf
49. Market Access Initiative scheme guidelines: https://www.commerce.gov.in/wp-content/uploads/2021/07/Market-Access-Initiative-MAI-Scheme-2021-dated-19-July-2021.pdf
50. Department of Commerce scheme claims monitor: https://apps.commerce.gov.in/schemes/schemereport
51. RoDTEP scheme overview: https://www.commerce.gov.in/ministryofcommerce/node/856
52. DGFT export promotion schemes report: https://content.dgft.gov.in/Website/dgftprod/816a9d11-d7a1-46c8-8098-47afade7f6e6/Annual%20MIS%20Report%20on%20Export%20Promotion%20Schemes-%20%202025.pdf
53. Government e-Marketplace official portal: https://gem.gov.in/
54. Startup India public procurement guidance: https://www.startupindia.gov.in/content/sih/en/public_procurement.html
55. GeM Startup Runway overview: https://assets-bg.gem.gov.in/resources/upload/shared_doc/gem-overview-ppt-2-september-2024-1_1725964078.pdf
56. GeM seller manual: https://assets-bg.gem.gov.in/resources/pdf/seller-user-manual.pdf
57. GeM seller journey training: https://elearning.gem.gov.in/course/index.php?categoryid=2
58. PIB GeM Startup Runway 2.0 update: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2296546&lang=1&reg=48
59. Startup India MAARG portal: https://maarg.startupindia.gov.in/
60. Startup India MAARG get-a-mentor route: https://maarg.startupindia.gov.in/get-a-mentor
61. Startup India platform overview: https://www.startupindia.gov.in/
62. Startup India mentor dashboard guidance: https://www.startupindia.gov.in/content/sih/en/user/my-dashboard/Investor.html
38. MSME RAMP MSE GIFT: https://ramp.msme.gov.in/ramp/RAMP-initiative/mse-gift/gift-risk-sharing-facility-coverage-rsf
39. MSME RAMP MSE SPICE: https://ramp.msme.gov.in/ramp/RAMP-initiative/mse-spice/mse-spice
40. MSME RAMP TEAM initiative: https://ramp.msme.gov.in/ramp/RAMP-initiative/msme-team-initiative/msme-team-initiative
41. PM Vishwakarma official portal: https://pmvishwakarma.gov.in/Home/
42. PM Vishwakarma official guidelines: https://pmvishwakarma.gov.in/cdn/MiscFiles/eng_v30.0_PM_Vishwakarma_Guidelines_final.pdf
43. MSE-CDP MyMSME application page: https://www.my.msme.gov.in/MyMsme/Reg/COM_ClusterForm.aspx
44. MSE-CDP modified guidelines: https://msme.gov.in/sites/default/files/ModifiedGuidelinesofMSE.pdf
45. MSME Competitive LEAN official portal: https://lean.msme.gov.in/Home/index
46. MSME Competitive LEAN eligibility: https://lean.msme.gov.in/Home/Eligibility
47. MSME Competitive LEAN components: https://lean.msme.gov.in/Home/SchemeComponents
48. MSME Competitive LEAN levels: https://lean.msme.gov.in/Home/SchemeLevels
49. MSME Competitive LEAN financial assistance: https://lean.msme.gov.in/Home/FinancialAssistance
50. Ministry of MSME Consortia and Tender Marketing offering: https://www.msme.gov.in/offerings
51. National Small Industries Corporation official portal: https://www.nsic.co.in/
52. MSME Assistance to Training Institutions: https://ati.msme.gov.in/ATI/home.aspx
53. MSME ESDP approved guidelines: https://msme.gov.in/sites/default/files/Approved_ESDP_Guidelines.pdf
54. Ministry of MSME official portal for ESDP route: https://msme.gov.in/
55. MSME Public Procurement Policy MyMSME portal: https://my.msme.gov.in/MyMsme/Reg/PPP_Home.aspx
56. MSME Annual Report 2025-26 procurement policy section: https://msme.gov.in/sites/default/files/MSMEANNUALREPORT2025-26ENGLISH_0.pdf
57. MSME Performance and Credit Rating guidelines: https://msme.gov.in/sites/default/files/PCRSchemeGuidelines.pdf
58. MSME Performance and Credit Rating overview: https://my.msme.gov.in/MyMsmeMob/MsmeScheme/Pages/1_2_0.html
59. MSME Tool Rooms dashboard: https://dashboard.msme.gov.in/tool_rooms.aspx
60. MSME Tool Rooms and Technical Institutions scheme booklet: https://www.msme.gov.in/sites/default/files/MSMESchemebooklet2024.pdf
61. Coir Board official portal: https://coirboard.gov.in/
62. Coir Vikas Yojana operational guidelines: https://msme.gov.in/sites/default/files/Coir-Vikas-YojanaContents.pdf
63. DPIIT Startup Recognition official guidance: https://www.startupindia.gov.in/content/sih/en/startupgov/startup_recognition_page.html
64. National Single Window System: https://www.nsws.gov.in/
65. GST official portal: https://www.gst.gov.in/
66. GST registration document checklist: https://tutorial.gst.gov.in/cbt/registration/gstregistration/course/story_content/external_files/GST_Registration_Document_Checklist.pdf
67. MCA SPICe+ and linked filings FAQ: https://www.mca.gov.in/content/dam/mca/pdf/SPICEplus-and-linked-filings-FAQs-V3-20230122.pdf
68. MCA official portal: https://www.mca.gov.in/
69. FSSAI official portal: https://fssai.gov.in/
70. FSSAI business services hub: https://fssai.gov.in/business
71. FSSAI food-business registration page: https://fssai.gov.in/business/registration
72. FoSCoS official portal: https://foscos.fssai.gov.in/
73. DGFT official portal: https://www.dgft.gov.in/
74. DGFT IEC services page: https://www.dgft.gov.in/CP/
75. Income Tax e-Filing official portal: https://www.incometax.gov.in/iec/foportal/
76. MCA SPICe+ PAN/TAN guidance: https://www.mca.gov.in/content/dam/mca/pdf/SPICEplus-and-linked-filings-FAQs-V3-20230122.pdf
77. EPFO Ease of Doing Business: https://www.epfindia.gov.in/site_en/EODB.php
78. EPFO employer unified portal: https://unifiedportal-emp.epfindia.gov.in/epfo/
79. EPFO online employer registration instructions: https://www.epfindia.gov.in/site_docs/PDFs/OLRE_PDFs/OLRE_withDSC_RevisedJune2016.pdf
80. ESIC employer registration overview: https://portal.esic.gov.in/ESICInsurance1/ESICInsurancePortal/Employer_Employee_registration_through_portal.pdf
81. ESIC Unified Shram Suvidha registration manual: https://esic.gov.in/attachments/circularfile/Guidelines_for_USSP_Unified_Shram_Suvidha_Portal_Registration_for_ESIC_User_Manual_V1_0_1752730200.pdf
82. Employees State Insurance Act official text: https://esic.gov.in/Publications/ESIAct1948Amendedupto010610.htm
83. DPIIT Startup India Fund of Funds 2.0 operational guidelines: https://www.dpiit.gov.in/static/uploads/2026/04/8949d8e0dabf11cb9291b00ec1d1f727.pdf
84. DPIIT Startup India Fund of Funds 2.0 notification and VCIC constitution: https://www.dpiit.gov.in/static/uploads/2026/04/3382625ffc31ea32ecc33ea68365172d.pdf
85. SIDBI Fund of Funds application portal: https://vcfapplication.sidbi.in/login
86. Startup India Investor Connect overview: https://www.startupindia.gov.in/content/sih/en/about-startup-india-initiative.html
87. Startup India user dashboard Investor Connect entry: https://www.startupindia.gov.in/content/sih/en/user/my-dashboard/Startup.html
88. PLI Working Group IT Hardware official portal: https://www.pliwg.dpiit.gov.in/
89. MeitY PLI 2.0 IT Hardware guidelines: https://www.meity.gov.in/static/uploads/2024/03/Guidelines_PLI-Scheme-ITHW-min.pdf
90. MeitY PLI 2.0 IT Hardware notification: https://www.meity.gov.in/writereaddata/files/Production%20Linked%20Scheme%202.0%20for%20IT%20Hardware%20notification_0.pdf
91. PLI Working Group IT Hardware guidelines copy: https://www.pliwg.dpiit.gov.in/docs/guidelines/ITHW2.O/Guidelines_PLI-Scheme-IT-Hardware_14.07.2023.pdf
92. iDEX official portal: https://idex.gov.in/
93. iDEX Open Challenge: https://idex.gov.in/open-challenge/
94. iDEX how-to-apply guidance: https://idex.gov.in/how_to_apply
95. iDEX FAQ: https://idex.gov.in/faq
96. iDEX challenges directory: https://idex.gov.in/challenges

## Discovery snapshot

The official [IGOD Union ministries page](https://igod.gov.in/ug/E002/organizations) currently returns 53 ministries and the official [IGOD Union departments page](https://igod.gov.in/ug/E003/organizations) currently returns 50 departments; both pages report a last-updated date of 03 September 2026 in the 07 September 2026 source check. This is a discovery count, not a claim that all authorities have been assessed. The coverage matrix must be populated and reviewed authority by authority before the Central beta gate can pass.

## Publication rule

The old static catalog can be used for interface development only. It is hidden by default and requires `NEXT_PUBLIC_SHOW_LEGACY_DRAFT_CATALOG=true`; when enabled, it must remain visibly labelled as a legacy draft until an opportunity has an official source, reviewed structured eligibility, evidence anchors, completeness review, and an approved version.

The reviewer route is `/admin/catalog`. It is intentionally inaccessible until a signed-in user is inserted into `public.catalog_reviewers` after the review-access migration is applied. Approval is blocked below 95% completeness or without a primary official source; this is a publishing guard, not a substitute for factual review.
