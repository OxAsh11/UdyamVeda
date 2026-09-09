-- UdyamVeda catalog operations: authoritative source registry and coverage audit.
-- These rows define where discovery starts; they do not make any opportunity publishable.

alter table public.source_registry
  add column if not exists authority_rank smallint not null default 5,
  add column if not exists verification_required boolean not null default true,
  add column if not exists expected_item_count integer,
  add column if not exists notes text;

create table if not exists public.opportunity_windows (
  id uuid primary key default gen_random_uuid(),
  opportunity_version_id uuid not null references public.opportunity_versions(id) on delete cascade,
  window_type text not null check (window_type in ('rolling', 'annual', 'fixed', 'call_for_applications', 'closed')),
  opens_at timestamptz,
  closes_at timestamptz,
  label text,
  source_evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists opportunity_windows_version_idx
  on public.opportunity_windows(opportunity_version_id, closes_at);

create table if not exists public.authority_coverage (
  id uuid primary key default gen_random_uuid(),
  source_registry_id uuid not null references public.source_registry(id) on delete cascade,
  authority_level text not null check (authority_level in ('ministry', 'department', 'agency')),
  authority_name text not null,
  authority_url text,
  business_relevance text not null default 'pending' check (business_relevance in ('pending', 'relevant', 'not_relevant', 'unclear')),
  assessment_status text not null default 'not_assessed' check (assessment_status in ('not_assessed', 'assessed', 'in_progress', 'complete')),
  exclusion_reason text,
  assessed_at timestamptz,
  assessed_by uuid references auth.users(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (source_registry_id, authority_level, authority_name)
);

create index if not exists authority_coverage_status_idx
  on public.authority_coverage(authority_level, assessment_status, business_relevance);

drop trigger if exists authority_coverage_updated_at on public.authority_coverage;
create trigger authority_coverage_updated_at
  before update on public.authority_coverage
  for each row execute function public.set_updated_at();

alter table public.authority_coverage enable row level security;

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, expected_item_count, notes)
values
  ('IGOD Union Government ministries directory', 'https://igod.gov.in/ug/E002/organizations', 'authority_directory', 'central', 'monthly', 1, true, 53, 'Enumerate every Union ministry before the Central beta gate.'),
  ('IGOD Union Government departments directory', 'https://igod.gov.in/ug/E003/organizations', 'authority_directory', 'central', 'monthly', 1, true, 50, 'Enumerate every Union department before the Central beta gate.'),
  ('Ministry of Commerce and Industry Startup India schemes', 'https://www.startupindia.gov.in/content/sih/en/government-schemes.html', 'ministry_portal', 'central', 'weekly', 2, true, null, 'Discovery and cross-checking only; follow each scheme to its implementing authority.'),
  ('Startup India scheme detail and policy portal', 'https://www.startupindia.gov.in/content/sih/en/startup-scheme.html', 'ministry_portal', 'central', 'weekly', 2, true, null, 'Official portal content for startup recognition and related benefits.'),
  ('myScheme national scheme discovery portal', 'https://www.myscheme.gov.in/', 'discovery_portal', 'central', 'weekly', 3, true, null, 'Discovery and cross-checking only; never the sole publishing authority.'),
  ('Startup India Schemes Playbook June 2026', 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'reference_playbook', 'central', 'monthly', 3, true, null, 'Initial seed and discovery reference; not exhaustive and not sufficient provenance by itself.'),
  ('Udyam Registration official portal', 'https://udyamregistration.gov.in/', 'implementing_portal', 'central', 'weekly', 2, true, null, 'Official registration flow and applicant guidance.'),
  ('GST official registration document checklist', 'https://tutorial.gst.gov.in/cbt/registration/gstregistration/course/story_content/external_files/GST_Registration_Document_Checklist.pdf', 'implementing_portal', 'central', 'monthly', 2, true, null, 'Official document checklist seed for registration workflows.'),
  ('KVIC PMEGP official guidelines', 'https://kviconline.gov.in/pmegpeportal/dashboard/notification/Revised_PMEGP_Scheme_Guidelines_07122023_compressed.pdf', 'guideline', 'central', 'monthly', 1, true, null, 'Official scheme guideline used for PMEGP draft extraction.'),
  ('CGTMSE official overview', 'https://www.cgtmse.in/Home/VS/3', 'agency_portal', 'central', 'weekly', 1, true, null, 'Official guarantee coverage and scheme-purpose source.'),
  ('CGTMSE eligible borrowers', 'https://www.cgtmse.in/Home/VS/95', 'agency_portal', 'central', 'weekly', 1, true, null, 'Official borrower eligibility and activity exclusions source.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  expected_item_count = excluded.expected_item_count,
  notes = excluded.notes;
