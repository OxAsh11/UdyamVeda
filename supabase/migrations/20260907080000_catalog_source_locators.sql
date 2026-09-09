-- Keep source evidence auditable at document/page/section granularity.
-- source_anchor remains the human-readable citation; these fields preserve
-- structured locators for review, diffing and future source rendering.

alter table public.opportunity_sources
  add column if not exists page_number integer,
  add column if not exists section text,
  add column if not exists paragraph text,
  add column if not exists document_anchor text;

alter table public.opportunity_sources
  drop constraint if exists opportunity_sources_page_number_positive;

alter table public.opportunity_sources
  add constraint opportunity_sources_page_number_positive
  check (page_number is null or page_number >= 1);

create index if not exists opportunity_sources_locator_idx
  on public.opportunity_sources(page_number, section);
