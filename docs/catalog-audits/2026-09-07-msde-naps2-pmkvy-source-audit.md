# MSDE PM-NAPS / PMKVY source audit

Date: 2026-09-07  
Status: review-gated; not approved for publication

## Scope

This batch adds two separate Central Government records:

- PM-NAPS / NAPS-2: an establishment-led apprenticeship route with capped Central stipend support.
- PMKVY 4.0: a learner, worker and training-provider skill-development route. It is not represented as a direct grant or loan.

## Official evidence

- [PMO Skill India Programme continuation and restructuring](https://www.pmindia.gov.in/en/news_updates/cabinet-approves-continuation-and-restructuring-of-skill-india-programme/): describes PMKVY 4.0 and PM-NAPS as components of the composite Skill India Programme, and states the programme period as 2022-23 to 2025-26. The current post-FY2025-26 route must be checked before publication.
- [PIB/MSDE apprenticeship release, 5 August 2026](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2294856&lang=1&reg=1): confirms NAPS-2 since 2022-23, the establishment and National Apprenticeship Portal route, DBT, sector coverage, and Central support of 25% of establishment-paid stipend subject to Rs. 1,500 per apprentice per month.
- [MSDE PMKVY 4.0 guidelines](https://www.msde.gov.in/static/uploads/2025/09/20d9aac4ce972a765e83f28682536ee0.pdf): records candidate routes, age boundaries for short-term training/RPL, training-provider entity types, RPL project conditions and Skill India implementation requirements.
- [Skill India Digital](https://www.skillindiadigital.gov.in/about-us): recorded as the current discovery and delivery route, subject to live route verification.
- [National Apprenticeship Portal](https://www.apprenticeshipindia.gov.in/): recorded as the official establishment and apprenticeship handoff route.

## Editorial decisions

- NAPS and PMKVY are separate records because the applicant, benefit, lifecycle and evidence model differ.
- NAPS does not promise a general employer grant: the employer's stipend and apprenticeship obligations remain separate from the capped Central DBT contribution.
- PMKVY carries no `amount_max`; training, certification and provider access are shown as benefits rather than cash value.
- Both records use `in_review`, unreviewed structured rules and explicit current-route uncertainty. They cannot publish automatically.

## Required human review before publication

1. Reconfirm the live PM-NAPS establishment, trade, age, contract, attendance, claim and public-body rules.
2. Reconfirm PMKVY/SIP status after FY2025-26, current Skill India Digital availability, active courses, provider onboarding and RPL routes.
3. Verify the current application documents, portal instructions, local implementation contacts and any amended guidelines.
4. Verify each eligibility rule against the current primary source and record page/section anchors.
