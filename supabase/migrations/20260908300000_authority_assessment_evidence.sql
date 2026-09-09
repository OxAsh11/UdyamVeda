-- A terminal IGOD authority assessment must retain the official evidence used
-- to decide relevance. Notes alone are not sufficient coverage evidence.

alter table public.authority_coverage
  add column if not exists assessment_evidence_url text,
  add column if not exists assessment_evidence_anchor text;

update public.authority_coverage
set assessment_status = 'in_progress',
    assessed_at = null,
    assessed_by = null,
    assessment_note = coalesce(nullif(trim(assessment_note), ''), 'Terminal authority decision needs an official evidence URL and precise anchor.')
where assessment_status = 'assessed'
  and (
    assessment_evidence_url is null
    or assessment_evidence_url !~* '^https://'
    or nullif(trim(assessment_evidence_anchor), '') is null
  );

alter table public.authority_coverage
  drop constraint if exists authority_coverage_assessed_evidence;

alter table public.authority_coverage
  add constraint authority_coverage_assessed_evidence
  check (
    assessment_status <> 'assessed'
    or (
      assessment_evidence_url ~* '^https://'
      and length(trim(coalesce(assessment_evidence_anchor, ''))) > 0
    )
  );
