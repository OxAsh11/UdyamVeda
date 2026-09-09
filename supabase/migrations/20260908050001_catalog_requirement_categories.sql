-- Keep the detailed requirement categories used by the researched catalog.
-- This additive constraint expansion must precede the EPCG data migration.
alter table public.opportunity_requirements
  drop constraint opportunity_requirements_requirement_type_check;

alter table public.opportunity_requirements
  add constraint opportunity_requirements_requirement_type_check
  check (requirement_type in (
    'document', 'registration', 'declaration', 'financial', 'other',
    'compliance', 'eligibility', 'export_obligation', 'film_incentive',
    'identity', 'incubation', 'institutional', 'institutional_grant',
    'pharma_subsidy', 'procurement', 'project_readiness', 'regulatory', 'research'
  ));
