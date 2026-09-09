# UdyamVeda completion checklist

Status date: 9 September 2026

Latest integration checkpoint (9 September 2026): Supabase CLI authentication and project linking are confirmed. All 160 migrations have executed, including corrective SQL/schema migrations. All 113 seed files are imported: 174 opportunities, 174 versions, 174 review tasks, 1,218 pending checks, 103 authority entries, and 974 live source-registry rows. No current-version links are missing. Live structural checks and a rollback-only focused RLS smoke passed. After restarting the local development server, dashboard, catalog, and search return HTTP 200 on port 3010; the public catalog remains correctly empty/unpublished.

See [the live integration handoff](catalog-live-integration-2026-09-09.md) for exact evidence, remaining work, and safe continuation commands.

Research checkpoint: 94 controlled evidence batches cover 174 structured records; 925 seeded URLs are covered by 975 locally registered sources and 202 captured snapshots pass local integrity. These research counts are not evidence of published records or completed live ingestion.

This is the honest repository-level status. A route, migration, or UI component is not called complete merely because its file exists.

## First, the communication answer

No: I did not previously give you this complete distinction clearly enough. Earlier updates mixed planned work, repository scaffolding, visual changes, and live functionality. That made it sound as though the product direction and government catalog were completed when they were not. That was a reporting failure.

The corrected status is:

- The product plan is defined.
- The repository contains a substantial foundation and review tooling.
- The government catalog is not complete or publishable yet.
- The remote Supabase schema is now provisioned and initial live checks pass; the full acceptance suite remains unfinished.
- The redesigned interface is partial, not a finished product-wide redesign.

## Status legend

- **Complete:** implemented and verified in the repository for this scope.
- **Partial:** meaningful code or data exists, but a live integration, coverage, review, or acceptance step remains.
- **Incomplete:** the planned capability is not yet implemented end-to-end.
- **Blocked:** implementation is prepared, but an external credential, environment, or access step prevents execution.

## Complete in the repository

| Area | Evidence |
| --- | --- |
| Next.js foundation cleanup | `proxy.ts` replaces the deprecated middleware convention; TypeScript, ESLint, and the production build pass. |
| Catalog data shape and safety checks | 174 structured Central opportunity records pass local shape, provenance, eligibility-rule, window, and review-gate checks. No record is automatically publishable. |
| Catalog review machinery | Seven explicit review checks per record, review batches, review ledger, review pack, source-failure queue, source integrity checks, authority crosswalk, local preflight, offline batch filtering, and bounded server-side authority filtering in the live reviewer queue exist. |
| Catalog reviewer bootstrap | A validated, idempotent Windows helper adds or reactivates a trusted `catalog_reviewers` row after Supabase Auth creation without storing credentials in the repository. |
| Official-source evidence capture | 925 seeded URLs are covered by 975 registered sources; 202 captured snapshots pass local integrity, including current LEAP, AcE, SEED, GREAT, MAHIR, BHARATI, AgriSURE, SRI Fund, NQM, BIRAC SBIRI/BIPP/SITARE/E-YUVA/PACE, Antariksh Venture Capital Fund and other official evidence. Captures remain review-gated. |
| Legacy safety boundary | The old 36-record static catalog is development-only and cannot silently become public data. |
| Application-workspace contract | Business-scoped application controls, official handoff, consented concierge intake, and audit boundary pass the local application check. |

The complete 13-pack authority evidence queue is now present at [authority-review-batch-01.json](authority-review-batch-01.json) through [authority-review-batch-13.json](authority-review-batch-13.json): 103 source-anchored proposed decisions cover every IGOD baseline authority and are queued for human approval. They intentionally do not change any authority to terminal `assessed` status.

## Partial

| Area | Current state | Remaining work |
| --- | --- | --- |
| Vibrant product redesign | Indigo, saffron, emerald, violet, cyan surfaces and a redesigned dashboard shell exist. | Apply the design system consistently across all Start & Operate and Grow screens, then perform responsive/accessibility review. |
| Authentication | Login, signup, forgot-password, and reset-password routes exist. | Verify Supabase email, recovery, redirect, session, and account-state behavior against the real project. |
| Dashboard and information architecture | Home, opportunities, applications, documents, registration, compliance, strategy, plays, calendar, and tracking routes exist. | Replace remaining static/placeholder data, finish empty/loading/error states, and connect approved catalog data. |
| Multi-business, consent, audit, and RLS | Migrations are applied. Live owner reads, unrelated-user read/write denial, and anonymous draft/source-registry denial passed with rolled-back fixtures. | Extend cross-tenant tests to every business-owned table, storage path, and application workflow. |
| Opportunity catalog | 174 records are structured and sourced, but all are still `in_review` or otherwise review-gated; 0 are public. Ninety-four controlled evidence batches cover all 174 records with anchors and follow-ups. | Assess all 103 authorities, resolve/exclude 73 mappings, review each record, and approve only verified current records. |
| Ingestion and change detection | Firecrawl/OpenAI/Inngest paths, hashes, diffs, retries, manual capture, and validation exist. | Run recurring production crawls, review changes, and connect durable jobs to the live environment. |

| Catalog evidence checkpoint | Ninety-four controlled batches now have first-party evidence packets covering 174 records; all remain review-gated and 0 records are public. The latest evidence includes LEAP, AcE, SEED, GREAT, MAHIR, BHARATI, NQM, SRI Fund, AgriSURE, BIRAC SITARE, E-YUVA, PACE and Antariksh Venture Capital Fund. The evidence validator requires every packet primary and supporting source to be registered. | Continue source, eligibility, amendment/window and factual review before any publication. |
| Recommendations | Deterministic matching, unknown handling, evidence details, ranking signals, and persistence are implemented. | Provide a complete profile UI, populate approved opportunity versions, and test real business cases remotely. |
| Applications | Versioned eligibility snapshots, tasks, dependencies, document links, status events, handoff, and concierge intake exist. | Add email delivery, operational professional handoff, reminders/preferences, outcome tracking, and end-to-end tests. |
| Registrations and licences | National preparation journeys cover incorporation, PAN/TAN, banking, Udyam, GST, DPIIT, IEC, FSSAI, EPFO/ESIC and state/local expansion markers. | Connect them to reviewed catalog records, persist progress, add renewals, and review state/local source packs. |
| Document vault | Private bucket/RLS model, signed links, validation, checksums, scan-pending state, deletion, and audit boundaries exist locally. | Provision storage, configure real malware scanning, test expiry/tenant denial/deletion, and add retention automation. |
| Notifications and localization | Tables and version-keyed translation invalidation exist. | Provision Resend, send deadline/change/application alerts, add language UX, and test canonical-English fallback. |
| Concierge | Consented request route, taxonomy, business scope, and audit logging exist. | Add triage/handoff operations and live notifications. |
| Grow/GTM | Existing strategy, plays, campaigns, calendar, distribution, and tracking routes remain available. | Regression-test and later deepen the GTM model; it has not received the full planned second-cycle redesign. |
| Performance | Avoidable public-preview calls were removed and unavailable database state is explicit. | Measure local/deployed latency, remove remaining waterfalls, add safe caching, and run representative concurrency tests. |

## Incomplete

- The Central Government catalog has not passed the publishing gate.
- The 103 IGOD authorities have not been terminally relevance-assessed; 53 ministries and 50 departments remain pending human approval. The 13-pack evidence queue covers all 103 rows without duplication, but proposed decisions are not assessments.
- The 174 records have not received human source, eligibility, amendment/window, and factual-accuracy approval.
- State, Union Territory, and local coverage is not yet actionable; it must be added source-pack by source-pack.
- The complete live recommendation-to-application journey has not been accepted against real data.
- Remote RLS, upload, signed-link, translation, notification, and end-to-end acceptance suites have not run.
- The nationwide public beta has not launched.
- The “all Government schemes” objective is not finished. The current 174 records are a controlled seed/review queue, not a claim of exhaustive coverage.

## Remaining environment and access work

- Supabase authentication and linking are resolved; all migrations and seed files have executed and the catalog REST schema is available. A missing Docker installation does not block these remote operations.
- Reviewer access requires the specific existing application login email to authorize; no password or OTP is needed. Record-level checklist evidence and the manual accuracy audit are not fabricated by migration approval.
- A server-only Supabase service-role key is not configured for the repository/Vercel environments.
- Resend is not configured for transactional email.
- The repository is linked to the Vercel project currently named `center-app`; the current UdyamVeda build and production environment are configured. The remaining infrastructure task is to rename the Vercel project label and complete post-deployment worker-log verification.
- Live crawler scheduling and worker inspection still require the provisioned environment and authenticated integrations.

## What we can achieve now

Locally, the dashboard and public catalog/search APIs now reach the migrated database. The response is healthy but empty because no records have been published. This does not prove recommendations, applications, authentication recovery, or production deployment end to end.

## Ordered build sequence from here

1. Database provisioning and the 113-file seed import are complete. Continue with reviewer access and evidence persistence; do not restart from authentication or blindly replay completed seed files.
2. Assess the 103 IGOD authorities and resolve or explicitly exclude every crosswalk mapping.
3. Review the 174 records in controlled batches, starting with the current official-source evidence already captured.
4. Publish only records that satisfy the Central beta gate, including the 98% manual factual audit.
5. Connect search, profile, recommendations, save, application workspace, registration journeys, and notifications to approved versions.
6. Finish document-vault security, email, concierge operations, and end-to-end tests.
7. Complete the product-wide vibrant redesign and accessibility/performance verification.
8. Launch the free nationwide beta only after the gate; then expand State/UT coverage one reviewed source pack at a time.

The immediate next unit of work is catalog review and publication readiness, not another isolated visual change.
