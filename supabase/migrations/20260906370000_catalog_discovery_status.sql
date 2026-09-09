-- Keep unclear discovery assessments explicitly unresolved until a reviewer
-- either links an approved opportunity or records a not-relevant decision.
alter table public.catalog_discoveries
  drop constraint if exists catalog_discoveries_assessment_status_check;

alter table public.catalog_discoveries
  add constraint catalog_discoveries_assessment_status_check
  check (assessment_status in ('not_assessed', 'in_progress', 'assessed'));
