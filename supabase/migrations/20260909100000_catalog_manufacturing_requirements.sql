-- Include the manufacturing readiness requirements used by the PLI dossiers.
alter table public.opportunity_requirements drop constraint opportunity_requirements_requirement_type_check;
alter table public.opportunity_requirements add constraint opportunity_requirements_requirement_type_check
  check (requirement_type in (
    'cluster_infrastructure',
    'compliance',
    'declaration',
    'document',
    'eligibility',
    'export_obligation',
    'film_incentive',
    'finance',
    'financial',
    'identity',
    'incubation',
    'institutional',
    'institutional_grant',
    'manufacturing',
    'medical_device_support',
    'other',
    'pharma_subsidy',
    'procurement',
    'project_readiness',
    'registration',
    'regulatory',
    'research',
    'shipbuilding'
  ));
