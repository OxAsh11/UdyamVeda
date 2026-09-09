# Catalog operations runbook

This is the first operational path for the Central Government catalog. It deliberately separates discovery from relevance assessment and publication.

Current local audit (2026-09-09): the repository contains 109 opportunity seed files and 174 review-gated opportunity records. The seed set is not public until each record passes human review. The beta-gate accuracy workflow now records the selected opportunity-version sample items individually, with a database-computed aggregate and reconciliation check.

## Provisioning

1. Apply the migrations in `supabase/migrations` in timestamp order.
2. Apply the seed files in `supabase/seed`.
3. Add a trusted reviewer after the user has been created in Supabase Auth. The checked-in Windows helper validates the Auth UUID, links the project, and performs an idempotent insert without storing credentials in the repository:

```sql
insert into public.catalog_reviewers (user_id, email_snapshot)
values ('AUTH_USER_UUID', 'reviewer@example.com');
```

Equivalent Windows command after CLI authentication:

```powershell
.\scripts\bootstrap-catalog-reviewer.cmd -UserId AUTH_USER_UUID -Email reviewer@example.com -ProjectRef YOUR_PROJECT_REF
```

4. Configure `SUPABASE_SERVICE_ROLE_KEY` only in the server/worker environment. It must never be exposed through a `NEXT_PUBLIC_*` variable.
5. Configure `FIRECRAWL_API_KEY` and the Inngest event/signing keys.

After migrations and seeds are applied, run `supabase/tests/catalog_release_checks.sql` in the Supabase SQL editor or through the project’s database test runner. The structural assertions must pass before reviewer bootstrap; the three report queries at the end must be zero before declaring the Central beta gate ready. The ordered seed set includes `authority_directory_baseline.sql`, which creates the 53 ministry and 50 department review rows as `pending`/`not_assessed`, registers the IGOD-linked and separately verified official authority portals, and never counts as a completed authority review.

Before any remote run, use `npm run catalog:check`, `npm run catalog:seed-json` for the structured batch payload, and `npm run catalog:rules` for the deterministic eligibility golden cases. These local checks do not prove remote provisioning or source accuracy.

Use `npm run catalog:review-ledger -- --write` to regenerate `docs/catalog-review-ledger.json`. The ledger is the record-level status checklist for the local catalog: every seeded opportunity remains `in_review` and `blocked` until a live official-source snapshot and an authorized human review decision exist.

Use `npm run catalog:review-pack -- --write` to regenerate `docs/catalog-review-pack.json`. The pack is the editor-facing dossier queue: it mirrors the structured record, source locator, eligibility, benefit, application, window and fine-print summary, and creates seven explicit review checks per record. It reports pending work but cannot approve or publish records. Running it without `--write` is a freshness check; catalog preflight fails if the checked-in pack has drifted from the structured seeds.

For local inspection before Supabase provisioning, authenticate as a reviewer and open `/admin/catalog/offline-review`. This development-only page reads the generated review pack, exposes all record-level evidence and blockers in 20-record server-rendered pages, supports search by scheme/authority/slug/source, and links to a path-confined captured-snapshot viewer; it is protected by the reviewer boundary, disabled in production, and never approves or publishes records. Run `npm run catalog-offline-review` to verify that unauthenticated requests redirect to sign-in without exposing the pack; an authenticated content check requires an explicitly supplied `CATALOG_REVIEW_COOKIE` and is never part of preflight. Once the remote schema is provisioned, `/admin/catalog` supports bounded server-side search across review tasks by scheme name, slug, summary, objective, and opportunity name, while `/admin/catalog/sources` searches the registered source name, URL, type, and coverage level. The preflight endpoint checks the full catalog, tenancy, application, document, recommendation, consent, notification, concierge, and audit table set in parallel and reports missing remote tables without revealing secrets.

Use `npm run catalog:review-batches -- --write` to regenerate `docs/catalog-review-batches.json`. This partitions every seeded opportunity exactly once into authority-based review batches. Each record remains blocked until a reviewer verifies the live official source, eligibility, benefits, application route, window, amendments, and publication decision.

Use `npm run catalog:local-gate` to regenerate `docs/catalog-local-gate-report.json`. This report makes the Central beta blockers explicit from repository evidence plus the read-only remote schema probe: remote schema, opportunity approvals, IGOD authority assessments, crosswalk gaps, live snapshots and the 98% factual-accuracy audit. The remote check fails closed when the project is unreachable or the schema is missing. Use `npm run catalog:local-gate:required` in a release or CI step; it exits non-zero whenever the Central beta gate is blocked.

Use `npm run catalog:current-source-gaps -- --write` to regenerate `docs/catalog-current-source-gaps.json`. This reconciles every structured record with its current primary source URL and lists missing snapshots, failed captures, integrity exceptions, alternate evidence, and the next editorial action. It is a review queue only; every item remains publication-blocked.

With Firecrawl configured, use `npm.cmd run source:capture -- --offset 0 --limit 5 --timeout-ms 60000 --append --write` to capture a small, ordered set of official-source snapshots into the ignored `.catalog-snapshots/` directory and append hashes to `docs/catalog-live-source-capture.json`. The capture worker retries retryable transport/5xx failures twice by default with bounded exponential backoff; pass `--retries 0` to disable retries. For a single record, pass `--slug <opportunity-slug> --limit 1`; this keeps the snapshot metadata synchronized after a source or anchor correction. For unattended continuation or retry, add `--resume`; it selects only sources that are missing from the manifest or previously failed, so offsets do not revisit successful captures. Captures remain `in_review` and `blocked`; this command never publishes a record.

Run `npm.cmd run catalog:evidence-integrity -- --write` after capture. It verifies snapshot existence, SHA-256 integrity, and presence of source-anchor terms; it is an evidence-integrity check only and cannot approve a record.

Use `npm run catalog:source-failure-queue -- --write` to regenerate `docs/catalog-source-failure-queue.json`. It separates retryable transport failures from non-retryable/manual-review failures, attaches the reviewed `docs/catalog-source-resolution-plan.json` alternate-source/manual-capture path, and keeps every item publication-blocking. Running it without `--write` is a freshness check used by catalog preflight. An alternate official URL is an evidence lead only; it does not approve or replace the primary source without reviewer comparison.

Once the remote schema is provisioned, reviewers can use `/admin/catalog/source-failures` or `GET/POST /api/admin/catalog/source-failures` to record an explicit resolution decision for each failed primary capture. Accepted alternates require an exact registered alternate URL, captured snapshot hash, precise evidence anchor, and reviewer note. The decision is stored in `source_resolution_reviews`, audited, and remains supporting evidence only; it never replaces the primary source or publishes an opportunity automatically.

Firecrawl quota or credit failures are classified separately from source-policy failures. They are not retried automatically; restore the Firecrawl allowance or use the exact-URL-bound manual capture path, then re-run the capture and evidence-integrity checks.

Use `npm run catalog:legacy-safety` to verify that the user-facing catalog cannot expose the hard-coded legacy dataset by default. Production always withholds the legacy fallback; local draft visibility requires `NEXT_PUBLIC_SHOW_LEGACY_DRAFT_CATALOG=true`, and draft records remain non-actionable.

With the local Next server running, use `npm run catalog:runtime-smoke` (or pass `--base-url http://localhost:PORT`) to verify that `/dashboard/schemes` loads and `/api/opportunities` returns only approved database data or an explicit empty/unavailable state. The smoke test rejects the legacy draft source and validates the no-eligibility message when the catalog connection is unavailable.

For an official PDF that Firecrawl returns without usable Markdown, prepare a reviewer-controlled Markdown file with a first-line metadata header such as `<!-- source-url: https://official.example/document.pdf -->`, followed by the extracted text. Run `npm.cmd run source:manual-capture -- --slug <opportunity-slug> --markdown-file <path> --write`; pass `--source-url <alternate-official-url>` when resolving through a source listed in `catalog-source-resolution-plan.json`. The command requires an exact match to the registered primary or approved alternate source URL, stores a SHA-256 snapshot keyed by opportunity and source, preserves the primary failure when an alternate is captured, and leaves the record `in_review`/`blocked`. It never promotes or publishes a record.

With `OPENAI_API_KEY` configured, use `npm.cmd run source:extract -- --offset 0 --limit 1 --append --write` or target a record with `--slug dpiit-startup-recognition` to stage structured drafts from captured sources. Add `--resume` to select only sources without a draft or with a changed snapshot; use `--refresh` when the extraction contract changes and existing drafts must be regenerated. The command uses `OPENAI_MODEL` (default `gpt-5.6-luna`) and `OPENAI_REASONING_EFFORT` (default `high`), requires exact source-URL evidence, and always writes `needs_review`/blocked output.

`npm.cmd run catalog:extraction-integrity` verifies that captured AI drafts retain model metadata, exact source evidence, and the blocked review status.

Use `npm run catalog:coverage-report` to compare the IGOD authority inventory with the current opportunity seed sources and persist the authority-by-authority evidence and next action in `docs/catalog-coverage-report.json`. The report deterministically verifies that all 103 authority rows have URLs and that all 96 unique authority portal URLs are registered as crawl sources; its opportunity-source and name-token matches remain heuristic. It does not assess business relevance, prove complete scheme coverage, or authorize publication.

Once the remote catalog is provisioned, the reviewer can use `/admin/catalog/coverage` to assess each ministry or department and export the current matrix with `Export CSV`. The export is an operational review aid; it does not mark any authority assessed or bypass the reviewer API and audit log.

The coverage matrix API returns bounded pages by default, filters relevance status server-side, and includes exact global progress counts. CSV export is intentionally unbounded because it is an explicit reviewer export operation; the interactive matrix never loads all authority rows into one browser request.

The authority relationship candidate seed derives pending implementing-authority-to-IGOD-parent candidates from structured seed metadata. Candidates are RLS-protected and remain `pending` until a reviewer confirms or rejects the relationship against an official organizational source. A candidate is never a publication decision.

### CLI execution path

The repository now includes `supabase/config.toml` and its seed glob. After authenticating the CLI, link the project and push the ordered migrations:

```powershell
npx.cmd supabase login
npx.cmd supabase link --project-ref YOUR_PROJECT_REF
npx.cmd supabase db push
```

The CLI does not apply these seed files as part of `db push`. Run every seed file explicitly, in filename order, through the linked database, then run the release checks. The PowerShell runner already does this automatically:

```powershell
Get-ChildItem supabase/seed/*.sql | Sort-Object Name | ForEach-Object {
  npx.cmd supabase db query --linked --file $_.FullName
  if ($LASTEXITCODE -ne 0) { throw "Seed failed: $($_.Name)" }
}
npx.cmd supabase db query --linked --file supabase/tests/catalog_release_checks.sql
```

The current repository contains 109 opportunity seed files (113 seed files including the authority-directory baseline, authority-relationship candidate, source-resolution alternate, and resolution-plan context seeds). Never apply only the initial finance or batch files; doing so would leave the source registry and Central catalog incomplete.

The same ordered operation is available as `scripts/apply-catalog-remote.ps1`. On Windows PowerShell execution-policy restrictions, use the checked-in `scripts/apply-catalog-remote.cmd` entry point; it invokes the runner with a process-scoped bypass and does not change the machine policy. By default it runs the local catalog preflight checks first, uses an installed Supabase CLI when available (otherwise pins the `npx.cmd` fallback to version 2.116.0), derives the project ref from `NEXT_PUBLIC_SUPABASE_URL` when possible, checks CLI authentication before any remote write, and stops at the first failed migration, seed or release check. Use `-SkipLocalChecks` only when the local checks have already been run in the same worktree:

```powershell
.\scripts\apply-catalog-remote.ps1 -ProjectRef YOUR_PROJECT_REF
```

Windows command-wrapper equivalent:

```powershell
.\scripts\apply-catalog-remote.cmd -ProjectRef YOUR_PROJECT_REF
```

To inspect the exact migration and seed order without authenticating or writing to Supabase, use the safe dry run:

```powershell
.\scripts\apply-catalog-remote.ps1 -ProjectRef YOUR_PROJECT_REF -DryRun
```

The dry run still performs local preflight by default and exits before CLI authentication, project linking, migration push, seed application or release-check queries.

Use `npm run ops:catalog-readiness` for a secret-safe, read-only provisioning report. It records the local migration/seed inventory, Supabase reachability/schema state, environment-variable presence, pinned CLI availability, and the result of a read-only Supabase `projects list` authentication check without printing secret values or attempting authentication or writes. It writes `docs/catalog-provisioning-readiness.json`; use `--require-ready` when a CI or release step must fail unless remote provisioning prerequisites are present.

Before running the remote operation, authenticate the pinned CLI in the same user environment. The CLI requires a Supabase access token; it is not stored in the repository or `.env.local`:

```powershell
npx.cmd --yes supabase@2.116.0 login
```

In this agent shell the interactive prompt is disabled, so use the token form when authenticating non-interactively. Set the token only in the current process environment and do not commit or paste it into repository files:

```powershell
$env:SUPABASE_ACCESS_TOKEN = '<your Supabase access token>'
npx.cmd --yes supabase@2.116.0 login --token $env:SUPABASE_ACCESS_TOKEN --no-browser
```

Before or after authentication, the read-only remote schema probe can be run without a service-role key:

```powershell
npm run catalog:remote-status
npm run catalog:remote-status -- --require-schema
```

It reports `unreachable`, `schema_not_applied`, `query_error`, or `schema_available`. `schema_available` proves only that the catalog tables exist; it does not approve records or pass the Central beta gate.

Then run the provisioning script. The runner invokes `ops:catalog-readiness --require-ready` immediately before its write path and stops if the remote schema/authentication state is unsafe. A successful link alone is not evidence that the catalog is ready; the migration push, ordered seed application and `catalog_release_checks.sql` must all pass. The latest elevated read-only probe in this environment (2026-09-08) reports `schema_not_applied`: the project is reachable, but `public.opportunities` and `public.source_registry` both return 404. The Supabase CLI still requires authentication before any migration or seed write can begin. Treat the catalog as unverified until the ordered migration, seed, and release-check run completes.

## Refreshing official authority directories

The reviewer-only `POST /api/admin/catalog/sources` endpoint accepts a registered `sourceId` and sends a durable refresh event. The worker:

- scrapes the registered URL with Firecrawl;
- computes a SHA-256 content hash;
- creates an `ingestion_runs` record;
- parses IGOD ministry/department rows when the source is an IGOD directory;
- upserts rows into `authority_coverage` as `pending` and `not_assessed`, preserving any reviewer decision already made for the same authority;
- records warnings, timestamps, counts, and failures;
- never marks a ministry or department relevant automatically. The static baseline seed is a names-and-official-portal-URLs starting queue; an official directory refresh and human review must confirm portal mappings and assess business relevance before publication.

Registered active sources are also queued by Inngest cron functions: daily at 02:00 UTC, weekly on Monday at 03:00 UTC, and monthly on the first day at 04:00 UTC. Each scheduler only queues sources whose registry cadence matches its schedule; the refresh worker remains hash-idempotent and human review is still required.

The `GET /api/admin/catalog/sources` endpoint is reviewer-only and exposes registry state for the future source-operations screen.

## Draft extraction

For non-directory sources, a changed snapshot is sent to OpenAI for JSON-only extraction. The result is stored in `opportunity_drafts` with the model name, completeness score, blocking validation errors, warnings, and source snapshot hash. The reviewer can inspect these drafts at `/admin/catalog/drafts`.

Promotion creates an `in_review` opportunity, version, source records, requirements, steps, eligibility rule set, and publish review task. It does not set the opportunity to `active`. A second review action is required before public discovery can see it.

## Importing the former static catalog

The reviewer-only `POST /api/admin/catalog/legacy-import` operation copies the former static UI records into `source_snapshots` and `opportunity_drafts`. It is idempotent by content hash. Imported records are marked `legacy_import`, have zero completeness, and contain a blocking validation error, so they cannot be promoted until an editor replaces the legacy claims with current official-source evidence.

Each source refresh also writes a `change_events` record containing the current and previous snapshot hashes, event type, and review state. The reviewer UI computes a bounded deterministic line diff with added/removed counts; a changed event is evidence that the reviewer must compare the two stored snapshots. Ignoring an event requires a persisted reviewer note. Unchanged events are retained for audit history but do not block the beta gate; this is not an automatic content update or publication.

## Review rule

The authority matrix is not complete when rows are merely discovered. A reviewer must assess each authority for business relevance, record an exclusion reason when appropriate, and follow relevant authority portals to opportunity records. Opportunity records remain unpublished until their version passes the completeness and official-provenance gates.

Publication requires at least one primary Gazette/guideline/Ministry/implementing-agency source with an HTTPS URL and a non-empty page, section, paragraph or heading anchor. The publication status is derived from the reviewed window (`active`, `upcoming` or `closed`) rather than being forced to `active`.

Every non-directory extraction also creates a `catalog_discoveries` row for each named active/upcoming opportunity. Reviewers must mark it relevant and select an approved active/upcoming opportunity, or mark it not relevant with a reason; an unclear assessment remains `in_progress` and unresolved. The Central beta gate fails while any active/upcoming discovery remains unresolved or points to a non-approved record.
