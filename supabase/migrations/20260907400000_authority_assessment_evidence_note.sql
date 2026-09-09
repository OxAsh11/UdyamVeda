-- A relevant authority assessment must preserve the reviewer's evidence scope.
-- This prevents a terminal relevance decision from becoming an unexplained
-- boolean that cannot guide the subsequent source crawl.

update public.authority_coverage
set assessment_status = 'in_progress',
    assessed_at = null,
    assessed_by = null,
    assessment_note = 'A relevant authority assessment needs a reviewer note describing the official source scope before it can remain terminal.'
where assessment_status = 'assessed'
  and business_relevance = 'relevant'
  and nullif(trim(assessment_note), '') is null;

alter table public.authority_coverage
  drop constraint if exists authority_coverage_assessed_relevant_note;

alter table public.authority_coverage
  add constraint authority_coverage_assessed_relevant_note
  check (
    business_relevance <> 'relevant'
    or assessment_status <> 'assessed'
    or length(trim(coalesce(assessment_note, ''))) > 0
  );
