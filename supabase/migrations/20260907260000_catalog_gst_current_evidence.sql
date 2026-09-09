-- Current-source reconciliation for GST Registration.
-- The document checklist is evidence for preparation only; tax liability and
-- filing applicability still require a current facts-based review.

do $$
declare
  version_id uuid;
begin
  select current_version_id into version_id
  from public.opportunities
  where slug = 'gst-registration';

  if version_id is null then
    return;
  end if;

  update public.opportunity_versions
  set
    fine_print = fine_print || jsonb_build_object(
      'current_checklist_findings', jsonb_build_object(
        'constitution_proof', 'JPG/PDF up to 1 MB; multiple upload not permitted in the official checklist row',
        'stakeholder_or_authorised_signatory_photo', 'JPG up to 100 KB; multiple upload not permitted',
        'authorised_signatory_appointment', 'Letter of Authorisation or Board/Managing Committee resolution and acceptance letter, JPG/PDF up to 100 KB; multiple upload permitted for the resolution/acceptance row',
        'principal_place_of_business', 'Property tax receipt, municipal khata, electricity bill, rent/lease agreement, consent letter or government-issued document; JPG/PDF with 100 KB or 1 MB limits and multiple upload permitted',
        'additional_place_of_business', 'Same evidence pattern where applicable; multiple upload permitted',
        'clarification', 'Any supporting document, JPG/PDF up to 1 MB; multiple upload permitted'
      ),
      'current_source_reconciliation', 'Official GSTN registration document checklist reviewed for document types, formats, size limits and multiple-upload rules; tax applicability and current portal workflow remain review items.'
    ),
    last_verified_at = now(),
    review_status = 'in_review'
  where id = version_id;
end $$;
