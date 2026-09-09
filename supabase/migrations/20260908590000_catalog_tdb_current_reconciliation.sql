-- Current TDB reconciliation for controlled Batch 088 review.
-- Keep TDB Core Funding separate from the newer RDIF/SLFM route and keep
-- loan, equity, grant and fee conditions in distinct value buckets.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('TDB current FAQ PDF', 'https://tdb.gov.in/sites/default/files/2024-12/f_q.pdf', 'faq', 'central', 'monthly', 1, true, 'Current official FAQ PDF covering Core Funding application timing, eligibility, repayment, security, startup wording and earnest-fee conditions.'),
  ('TDB current Downloads page', 'https://www.tdb.gov.in/node/1946', 'forms', 'central', 'monthly', 1, true, 'Current official Downloads page exposing revised guidelines/FAQs, Loan Application Form-A/Checklist and Return Submission Form.'),
  ('TDB RDIF/SLFM related route', 'https://tdb.gov.in/rdi_slfm', 'scheme_page', 'central', 'monthly', 1, true, 'Related current RDIF/SLFM route with materially different terms; retained to prevent merging it into TDB Core Funding.' )
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;

do $$
declare
  version_id uuid;
begin
  select current_version_id into version_id
  from public.opportunities
  where slug = 'technology-development-board-technology-commercialisation-finance';

  if version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_source_checked_at', '2026-09-08',
        'current_core_funding_route', 'https://www.tdb.gov.in/',
        'current_forms_route', 'https://www.tdb.gov.in/node/1946',
        'current_route_boundary', 'This record covers TDB Core Funding. The current portal also exposes RDIF/SLFM and active calls; those routes require separate records and review.',
        'current_submission_boundary', 'Use the current official TDB route and prescribed form. UdyamVeda may prepare evidence and explain terms but cannot submit or handle credentials and OTPs.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_tdb_reconciliation', jsonb_build_object(
          'observed_at', '2026-09-08',
          'scope', 'tdb_core_funding_only',
          'general_loan_share_up_to_percent', 50,
          'general_loan_interest_simple_percent', 5,
          'equity_share_up_to_percent', 25,
          'exception_wording', 'The current FAQ contains committee wording for up to 70% with a project ceiling of INR 5 crore and a separate DPIIT-registered startup exception for qualifying Companies Act entities. Human review must reconcile these provisions against the controlling guideline and form.',
          'application_window', 'The current FAQ states that applications can be submitted throughout the year.',
          'evaluation_duration', 'The current FAQ says evaluation typically takes 3-4 months from a complete application, subject to complexity and applicant responsiveness.',
          'repayment_boundary', 'The FAQ describes a one-year post-completion moratorium and nine half-yearly instalments over 4.5 years; the Modes of Funding page uses different instalment wording and the controlling current agreement must govern.',
          'fee_boundary', 'No processing, administrative or commitment charges are stated on the Modes of Funding page, while the FAQ separately describes a 1% earnest fee that may be forfeited after a letter of intent. Keep these conditions separate.',
          'rdif_boundary', 'The related TDB RDIF/SLFM route has different TRL, interest, tenure and grant terms. Do not merge it into Core Funding.',
          'review_boundary', 'Confirm current legal forms, startup exception, project-cost definition, security, royalty, milestones, reporting, forms and live submission route before publication.'
        ),
        'current_source_reconciliation', 'The current TDB portal, Core Funding page, FAQ PDF, Downloads page, statutory page and related RDIF page were checked on 8 September 2026. The record remains in_review.'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://tdb.gov.in/sites/default/files/2024-12/f_q.pdf', 'faq', 'TDB current FAQ PDF', 'Current FAQ pages 2-9: application timing, eligibility, financing, repayment, security, fees and startup wording'),
      ('https://www.tdb.gov.in/node/1946', 'forms', 'TDB current Downloads page', 'Revised guidelines/FAQs, Loan Application Form-A/Checklist and Return Submission Form'),
      ('https://tdb.gov.in/rdi_slfm', 'scheme_page', 'TDB RDIF/SLFM related route', 'Separate current RDI route; do not merge its terms into Core Funding')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources os
      where os.opportunity_version_id = version_id
        and os.source_url = evidence.source_url
    );
  end if;
end $$;
