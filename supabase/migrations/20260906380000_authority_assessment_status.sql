-- The reviewer API and beta gate use `assessed` as the terminal authority
-- assessment state. Normalize the earlier `complete` spelling before tightening
-- the constraint so the release check cannot disagree with the UI.
update public.authority_coverage
set assessment_status = 'assessed'
where assessment_status = 'complete';

alter table public.authority_coverage
  drop constraint if exists authority_coverage_assessment_status_check;

alter table public.authority_coverage
  add constraint authority_coverage_assessment_status_check
  check (assessment_status in ('not_assessed', 'in_progress', 'assessed'));
