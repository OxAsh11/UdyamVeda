-- Database-level invariants for catalog values produced by humans or models.

alter table public.opportunity_versions
  drop constraint if exists opportunity_versions_completeness_range,
  drop constraint if exists opportunity_versions_confidence_range;

alter table public.opportunity_versions
  add constraint opportunity_versions_completeness_range check (completeness >= 0 and completeness <= 1),
  add constraint opportunity_versions_confidence_range check (confidence >= 0 and confidence <= 1);

alter table public.opportunity_benefits
  drop constraint if exists opportunity_benefits_amount_min_nonnegative,
  drop constraint if exists opportunity_benefits_amount_max_nonnegative,
  drop constraint if exists opportunity_benefits_percentage_range,
  drop constraint if exists opportunity_benefits_amount_order;

alter table public.opportunity_benefits
  add constraint opportunity_benefits_amount_min_nonnegative check (amount_min is null or amount_min >= 0),
  add constraint opportunity_benefits_amount_max_nonnegative check (amount_max is null or amount_max >= 0),
  add constraint opportunity_benefits_percentage_range check (percentage is null or (percentage >= 0 and percentage <= 100)),
  add constraint opportunity_benefits_amount_order check (amount_min is null or amount_max is null or amount_max >= amount_min);

alter table public.opportunity_windows
  drop constraint if exists opportunity_windows_date_order;

alter table public.opportunity_windows
  add constraint opportunity_windows_date_order check (opens_at is null or closes_at is null or closes_at >= opens_at);

alter table public.authority_coverage
  drop constraint if exists authority_coverage_exclusion_reason;

alter table public.authority_coverage
  add constraint authority_coverage_exclusion_reason
  check (business_relevance <> 'not_relevant' or length(trim(coalesce(exclusion_reason, ''))) > 0);

alter table public.opportunity_drafts
  drop constraint if exists opportunity_drafts_completeness_range;

alter table public.opportunity_drafts
  add constraint opportunity_drafts_completeness_range check (completeness >= 0 and completeness <= 1);
