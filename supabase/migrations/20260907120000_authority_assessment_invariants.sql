-- Keep unresolved authority decisions visibly unresolved and auditable.

alter table public.authority_coverage
  add column if not exists assessment_note text;

update public.authority_coverage
set assessment_status = 'in_progress',
    assessed_at = null,
    assessed_by = null
where assessment_status = 'assessed'
  and (
    business_relevance not in ('relevant', 'not_relevant')
    or assessed_at is null
    or assessed_by is null
  );

update public.authority_coverage
set assessment_note = 'Legacy unclear decision requires reviewer follow-up.'
where business_relevance = 'unclear'
  and nullif(trim(assessment_note), '') is null;

-- A relevant authority must have a verified official portal URL. Rows that
-- predate this rule are returned to the reviewer queue instead of failing the
-- migration or masquerading as complete coverage.
update public.authority_coverage
set assessment_status = 'in_progress',
    assessed_at = null,
    assessed_by = null,
    assessment_note = coalesce(nullif(trim(assessment_note), ''), 'Official HTTPS authority URL is required before relevance can be confirmed.')
where business_relevance = 'relevant'
  and (authority_url is null or authority_url !~* '^https://');

alter table public.authority_coverage
  drop constraint if exists authority_coverage_assessment_consistency;

alter table public.authority_coverage
  add constraint authority_coverage_assessment_consistency
  check (
    (assessment_status = 'assessed'
      and business_relevance in ('relevant', 'not_relevant')
      and assessed_at is not null
      and assessed_by is not null)
    or
    (assessment_status in ('not_assessed', 'in_progress'))
  );

alter table public.authority_coverage
  drop constraint if exists authority_coverage_unclear_note;

alter table public.authority_coverage
  add constraint authority_coverage_unclear_note
  check (business_relevance <> 'unclear' or length(trim(coalesce(assessment_note, ''))) > 0);

alter table public.authority_coverage
  drop constraint if exists authority_coverage_relevant_url;

alter table public.authority_coverage
  add constraint authority_coverage_relevant_url
  check (business_relevance <> 'relevant' or authority_url ~* '^https://');
