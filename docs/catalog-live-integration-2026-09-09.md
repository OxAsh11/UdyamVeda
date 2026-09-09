# Live integration handoff — 9 September 2026

Project: `udyamveda` / `xvbirrthvzhhpkdciywd`.

## Completed and verified live

| Checkpoint | Result |
| --- | --- |
| Supabase login and repository link | Confirmed; no further migration permission is required |
| Migrations | 160 applied, including 11 corrective migrations; four duplicate IDs repaired |
| Seed import | All 113 SQL files executed successfully, with local SHA-256 receipts |
| Catalog | 174 opportunities, 174 versions, zero missing current-version links |
| Review workspace data | 174 review tasks and 1,218 pending checklist items |
| Authority inventory | 103 entries persisted; all still awaiting assessed decisions |
| Source registry | 974 actual database rows; do not substitute the local text-derived inventory count of 975 |
| Storage | `business-documents` exists and is private |
| Structural database checks | `catalog_release_checks.sql` completed without an invariant exception |
| Focused live RLS smoke | Owner read succeeds; unrelated-user business/membership/fact reads and fact writes denied; anonymous draft, source-registry, and business reads denied; all fixtures rolled back |
| Localhost | Dashboard, catalog API, and filtered search return HTTP 200 at port 3010 after restarting the stale server |
| Reviewer access | `ashish011am@gmail.com` is active in `catalog_reviewers`; use `/admin/catalog` after signing in |
| Authentication route smoke | `/login`, `/signup`, `/forgot-password`, `/reset-password`, and `/dashboard` return HTTP 200; login defaults to `/dashboard`; existing signup emails show sign-in/reset guidance |
| Local checks | 167 catalog preflight checks passed during integration; these are not substitutes for database execution or factual review |

The public API returns `empty_unpublished`, not `unavailable`. No published metrics or eligible-value totals were fabricated. No production deployment or public brand rename was performed.

## Still not complete

- Zero approved/public opportunity records; one active reviewer account; zero factual-accuracy audits.
- The live review table currently shows all 174 publication tasks as `open`, all 1,218 checks as `pending`, and zero passed checks. The four records mentioned in the latest user message are not identifiable as persisted approvals in Supabase; do not publish by guessing their slugs.
- Zero source snapshots persisted in Supabase. The 202 integrity-checked local captures remain local and must be transferred with their original provenance and hashes.
- All 103 authority assessments and all 174 persisted opportunity-authority signoffs remain pending. The separate local research crosswalk has 73 unresolved mappings; these are different measures, not contradictory counts.
- Source-category normalization for publication and the local-versus-live source inventory difference require reconciliation. Import accepts researched subcategories, but the canonical primary-authority whitelist was not relaxed.
- Full cross-tenant, document upload/download/scanning, recovery-email, application, recommendation, notification, translation, accessibility, performance, and GTM regression acceptance are not complete.
- Server-only Supabase service credentials, email delivery, operational scanning, scheduled ingestion, and concierge operations still need configuration/verification. No passwords or OTPs were requested or stored by this work.

## Product stage against the original plan

| Phase | Status |
| --- | --- |
| Foundation | Database provisioning complete; auth and full tenant acceptance still partial |
| Catalog operations | Research and draft import advanced; evidence persistence, editorial operations, coverage, and publication partial |
| Discovery and matching | Code exists and public catalog API connects; approved data and real business journey acceptance incomplete |
| Applications and registration | Partial implementation; end-to-end operation unverified |
| Localization and communication | Partial foundation; live delivery incomplete |
| Visual rollout | Partial; not all Start & Operate and Grow screens are redesigned |
| Public beta | Not ready; publishing and acceptance gates unmet |
| State expansion | Deferred until reviewed source packs are ready |

No defensible overall completion percentage is available. Completing migrations does not mean completing the product.

## Next work, in order

1. Sign in as `ashish011am@gmail.com` and open `/admin/catalog`. Confirm the four exact opportunity slugs that were reviewed; the database currently contains no persisted approval decisions for them.
2. Persist existing local evidence snapshots, reconcile source inventory/categories, and verify the reviewer dossier against live data. Do not recrawl everything merely because the database was newly provisioned.
3. Resolve authority assessments/crosswalks and complete evidence-backed record checks in batches. Record corrections and audit evidence; do not turn a blanket approval into invented per-record review notes.
4. Publish qualifying records, then verify business profile → recommendation → save → application → first task using real approved versions.
5. Complete the remaining operational, security, visual, and release-gate work from the main checklist before a nationwide beta claim.

## Safe continuation

```powershell
# Remote structural checks and focused tenant/public-access checks:
npx.cmd --yes supabase@2.116.0 db query --linked --file supabase/tests/catalog_release_checks.sql
npx.cmd --yes supabase@2.116.0 db query --linked --file supabase/tests/catalog_live_access_smoke.sql
npx.cmd --yes supabase@2.116.0 db query --linked --file supabase/tests/catalog_live_status.sql

# Local app connection check (development server on port 3010):
node scripts/catalog-public-runtime-smoke.mjs
```

Do not blindly rerun the older full provisioning script: it predates the live schema and resumable import. The dedicated `catalog-apply-seeds.mjs` command skips unchanged completed receipts in `supabase/.temp/catalog-seeds-xvbirrthvzhhpkdciywd.json` and stops on changed applied files. Those receipts are local, not a portable database migration ledger. Published records must be corrected through versioned editorial operations, not reseeded.

Run CLI database operations sequentially: overlapping commands can renew the same temporary CLI login role and cause a transient authentication failure.
