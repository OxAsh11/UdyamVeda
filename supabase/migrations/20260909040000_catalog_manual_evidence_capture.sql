-- Allow reviewers to submit official text evidence when automated capture is
-- unavailable. This remains a needs_review snapshot and never approves data.

alter table public.source_snapshots
  drop constraint if exists source_snapshots_capture_method_check;

alter table public.source_snapshots
  add constraint source_snapshots_capture_method_check
  check (capture_method in ('firecrawl_markdown', 'http_html_fallback', 'manual_official_pdf_text', 'manual_official_text', 'unknown'));
