# Udyam Registration source audit — 7 September 2026

Status: `in_review` — not approved for publication.

Record: `udyam-registration`

## Official evidence checked

- [Official Udyam portal](https://udyamregistration.gov.in/), checked 7 September 2026.
- [Official new-enterprise registration form](https://udyamregistration.gov.in/udyamregistration.aspx), checked for Aadhaar, PAN/GST and applicant-role requirements.
- [Official important-information page](https://udyamregistration.gov.in/Important.aspx), checked for the free, paperless, self-declaration, no-upload and no-renewal statements.

## Confirmed facts captured in the seed dossier

- Udyam registration is free, online, paperless and based on self-declaration; private intermediaries are not authorized to charge a registration fee.
- No proof or document upload is required for the registration flow, but identity and linked government-data fields are still collected through the official portal.
- The current classification thresholds shown by the portal are effective from 1 April 2025: micro up to ₹2.5 crore investment/₹10 crore turnover, small up to ₹25 crore/₹100 crore, and medium up to ₹125 crore/₹500 crore.
- Aadhaar responsibility differs by entity type; companies, LLPs, cooperatives, societies and trusts use the organisation or authorised signatory path with PAN and GSTIN where applicable.
- The portal says one enterprise must not file more than one Udyam Registration and that multiple activities can be specified in one registration.
- The certificate is online with a dynamic QR code and the registration does not require renewal.

## Remaining publication blockers

- Confirm the live flow and update/cancellation routes during reviewer testing.
- Complete legal/security review of Aadhaar/PAN handling before exposing any document or data-preparation feature.
- Keep UdyamVeda in a preparation and official-handoff role; it must not collect OTPs or impersonate the applicant.
- Attach the live source snapshot and approve the structured thresholds and identity requirements.

This audit updates the review-gated seed and a forward migration. It does not approve the record.
