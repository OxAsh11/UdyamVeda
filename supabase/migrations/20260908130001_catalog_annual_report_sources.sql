-- Official annual reports are supporting evidence, not primary publication authority.
alter table public.opportunity_sources
  drop constraint opportunity_sources_source_kind_check;
alter table public.opportunity_sources
  add constraint opportunity_sources_source_kind_check
  check (source_kind in (
    'gazette', 'guideline', 'ministry', 'agency', 'myscheme',
    'startup_india', 'pib', 'other', 'annual_report'
  ));
