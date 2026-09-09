-- Additional Central Government discovery records from official MSME sources.
-- These records remain in_review: component rules, current calls, amendments,
-- and window status require an editorial review before publication.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('MSME Innovative official portal', 'https://innovative.msme.gov.in/', 'ministry_portal', 'central', 'weekly', 2, true, 'Official portal for the unified Incubation, Design and IPR framework; current Idea Hackathon and component notices require review.'),
  ('MSME Innovative official About page', 'https://innovative.msme.gov.in/Home/About', 'ministry_portal', 'central', 'weekly', 2, true, 'Official Ministry of MSME description of the unified Incubation, Design and IPR framework.'),
  ('MSME Innovative Idea Hackathon 6.0', 'https://innovative.msme.gov.in/Home/', 'ministry_portal', 'central', 'weekly', 2, true, 'Official MSME Innovative portal with current Idea Hackathon 6.0 and host-institute instructions.'),
  ('MSME Innovative current design page', 'https://innovative.msme.gov.in/Home/Index', 'ministry_portal', 'central', 'weekly', 2, true, 'Official current design-component page; assistance and Udyam requirement require reviewer confirmation.'),
  ('MSME Innovative current IPR page', 'https://innovative.msme.gov.in/Home/IprIndex', 'ministry_portal', 'central', 'monthly', 2, true, 'Official current IPR-component page with reimbursement routes.'),
  ('MSME Innovative scheme guidelines', 'https://design.msme.gov.in/Documents/FinalGuidelines_MSME_Innovative.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official guideline source for Incubation, Design and IPR components; component-specific limits require review.'),
  ('MSME Innovative current incubation and Idea Hackathon route', 'https://www.my.msme.gov.in/inc/Default.aspx', 'implementing_portal', 'central', 'weekly', 2, true, 'Official incubation and Idea Hackathon route with Host Institute instructions and challenge-window notices.'),
  ('MSME Innovative RAMP description', 'https://ramp.msme.gov.in/ramp/RAMP-initiative/msme-innovative/msme-innovative', 'ministry_portal', 'central', 'monthly', 2, true, 'Official Ministry of MSME RAMP description of the unified Incubation, Design and IPR framework.'),
  ('SFURTI official portal', 'https://sfurti.msme.gov.in/SFURTI/Home.aspx', 'agency_portal', 'central', 'weekly', 2, true, 'Official Ministry of MSME portal for cluster proposals, approved clusters and notices.'),
  ('SFURTI revised guidelines', 'https://sfurti.msme.gov.in/WriteReadData/Circular/SFURTI_NEW.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official revised guideline source for traditional-industry cluster support.'),
  ('National SC-ST Hub revised guidelines 2025', 'https://sclcss.msme.gov.in/Manual/Guidelines.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official 15 May 2025 NSSH memorandum and revised guideline; cited financial-cycle period ends 31 March 2026 and any successor notice requires review.'),
  ('SCLCSS official portal', 'https://sclcss.msme.gov.in/', 'agency_portal', 'central', 'weekly', 2, true, 'Official SCLCSS/NSSH portal; current page describes the component and lender route, but portal availability is not proof of post-March-2026 continuation.'),
  ('SCLCSS application checklist January 2026', 'https://sclcss.msme.gov.in/Manual/Checklist_SCLCSS_Application_26Jan2026.pdf', 'application_checklist', 'central', 'monthly', 1, true, 'Official SCLCSS application checklist with application, undertaking, DIC, lender due-diligence, GeM and caste-certificate document references.'),
  ('National SC-ST Hub official dashboard', 'https://dashboard.msme.gov.in/scsthub.aspx', 'ministry_portal', 'central', 'weekly', 2, true, 'Official MSME dashboard with current reporting context; dashboard activity is not treated as a legal continuation notice.'),
  ('ASPIRE operational guidelines', 'https://aspire.msme.gov.in/WriteReadData/DocumentFile/New_Operational_Guidelines_ASPIRE_2018.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official guideline source for innovation, rural industry and entrepreneurship support; current availability requires review.'),
  ('ASPIRE revised operational guidelines 2022', 'https://aspire.msme.gov.in/WriteReadData/DocumentFile/ASPIRE_NEW.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official revised operational guideline for the 2021-22 to 2025-26 cycle; continuation requires review.'),
  ('ASPIRE current registration portal', 'https://aspire.msme.gov.in/ASPIRE/Registration.aspx', 'agency_portal', 'central', 'weekly', 2, true, 'Official current registration route for new Livelihood Business Incubators.'),
  ('ASPIRE current scheme dashboard', 'https://aspire.msme.gov.in/ASPIRE/AFHome.aspx', 'agency_portal', 'central', 'weekly', 2, true, 'Official ASPIRE portal reporting and current LBI application notice.'),
  ('ASPIRE LBI application form 2023', 'https://aspire.msme.gov.in/WriteReadData/DocumentFile/ASPIRE_New_21112023.pdf', 'application_form', 'central', 'monthly', 1, true, 'Official LBI application form and document structure; current route and conditions require review.'),
  ('ASPIRE registration user manual', 'https://aspire.msme.gov.in/WriteReadData/Circular/RegistrationUserManualAspire.pdf', 'portal_manual', 'central', 'monthly', 2, true, 'Official ASPIRE registration manual covering LBI/TBI portal registration and login flow.')
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
  item jsonb;
  authority_id uuid;
  seed_opportunity_id uuid;
  version_id uuid;
begin
  for item in
    select value from jsonb_array_elements('[
      {
        "slug":"msme-innovative-incubation-design-ipr",
        "name":"MSME Innovative (Incubation, Design and IPR)",
        "type":"innovation",
        "authority":"Office of the Development Commissioner (MSME) - Innovative",
        "authority_url":"https://innovative.msme.gov.in/",
        "canonical_url":"https://innovative.msme.gov.in/",
        "source_url":"https://design.msme.gov.in/Documents/FinalGuidelines_MSME_Innovative.pdf",
        "source_kind":"guideline",
        "source_title":"MSME Innovative Scheme Guidelines",
        "source_anchor":"Incubation, Design and IPR components",
        "summary":"Innovation support for MSMEs through incubation, design assistance and intellectual-property support.",
        "objective":"Move ideas and products from concept toward commercialisation while improving design capability and protection of intellectual creations.",
        "legal_basis":"MSME Innovative Scheme Guidelines covering the Incubation, Design and IPR components",
        "eligibility":{"entity_types":["msme","host_institute","business_incubator"],"conditions":["component-specific eligibility must be met","Udyam registration may be required for MSME applicants"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://innovative.msme.gov.in/","route":"select the applicable component and follow the current official portal instructions","components":["incubation","design","ipr"],"current_portal_context":"The official portal currently advertises Idea Hackathon 6.0 and host-institute instructions; component-specific routes remain separate."},
        "fine_print":{"component_specific":true,"illustrative_terms":{"incubation_idea_support_max_inr":1500000,"design_government_contribution_percent":{"micro":75,"small_or_medium":60},"design_project_government_contribution_max_inr":4000000,"ipr_reimbursement_maxima_inr":{"foreign_patent":500000,"domestic_patent":100000,"gi":200000,"design":15000,"trademark":10000}},"current_innovative_facts":{"official_sources_checked":"2026-09-08","current_portal":"https://innovative.msme.gov.in/","current_hackathon":{"name":"MSME Idea Hackathon 6.0","host_institute_forwarding_deadline":"2026-09-07","status_as_of":"closed","source_url":"https://www.my.msme.gov.in/inc/Default.aspx"},"design_context":"The current design page advertises up to Rs. 40 lakh financial assistance and an Udyam-registration route, subject to component conditions.","ipr_context":"The current IPR page exposes reimbursement routes for patents, GI, trademarks and design patents; exact reimbursement and applicant conditions remain guideline-dependent.","incubation_context":"Incubation is Host Institute/Business Incubator-led; the idea route, challenge window and HI evaluation conditions are separate from Design and IPR."},"current_source_reconciliation":"The current MSME Innovative portal, design page, IPR page, incubation route and RAMP description were checked on 8 September 2026. Idea Hackathon 6.0’s displayed Host Institute deadline has passed, while component routes remain separately review-gated.","review_note":"Confirm the current guideline version, component route, applicant type, matching contribution, eligible-cost conditions and current Idea Hackathon or component notice before publication."},
        "benefit_summary":{"types":["grant","reimbursement","innovation"],"summary":"Component-specific incubation, design and IPR assistance; amounts and applicant routes differ by component."},
        "benefit_type":"grant",
        "benefit_label":"Component-specific innovation and IPR assistance",
        "benefit_conditions":{"component_specific":true,"official_current_rules_required":true},
        "requirement":"Component selection and current portal eligibility",
        "requirement_description":"The applicant must select a supported component and satisfy the current component-specific eligibility and submission requirements.",
        "rules":{"all":[{"field":"innovative_component_selected","operator":"exists"},{"field":"current_component_call_or_route_available","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Choose the applicable component","description":"Identify whether the need is incubation, design or IPR support and confirm the current route.","url":"https://innovative.msme.gov.in/"},{"title":"Submit through the official route","description":"Prepare the component-specific documents and submit through the official portal or implementing agency route.","url":"https://innovative.msme.gov.in/"}],
        "window_type":"rolling",
        "window_label":"Incubation challenge windows and component routes differ. Idea Hackathon 6.0’s displayed Host Institute forwarding deadline was 7 September 2026 and is closed as of this audit; Design and IPR routes require separate current-notice verification.",
        "window_evidence":{"source_url":"https://www.my.msme.gov.in/inc/Default.aspx","anchor":"Idea Hackathon 6.0 Host Institute forwarding deadline extended through 07.09.2026; current Design/IPR routes remain separate"}
      },
      {
        "slug":"scheme-for-fund-for-regeneration-of-traditional-industries-sfurti",
        "name":"Scheme of Fund for Regeneration of Traditional Industries (SFURTI)",
        "type":"grant",
        "authority":"Ministry of Micro, Small and Medium Enterprises - SFURTI",
        "authority_url":"https://sfurti.msme.gov.in/SFURTI/Home.aspx",
        "canonical_url":"https://sfurti.msme.gov.in/SFURTI/Home.aspx",
        "source_url":"https://sfurti.msme.gov.in/WriteReadData/Circular/SFURTI_NEW.pdf",
        "source_kind":"guideline",
        "source_title":"Revised Guidelines for SFURTI",
        "source_anchor":"Objectives of SFURTI Scheme",
        "summary":"Cluster-based support for traditional industries and artisan collectives covering infrastructure, technology, skills, design and marketability.",
        "objective":"Organise traditional industries and artisans into competitive collectives and improve sustainable employment, products and market access.",
        "legal_basis":"Revised Guidelines for Scheme of Fund for Regeneration of Traditional Industries (SFURTI)",
        "eligibility":{"entity_types":["artisan_collective","traditional_industry_cluster","implementing_agency","state_or_central_agency"],"industries":["khadi","village_industry","coir","traditional_industry"],"conditions":["proposal and cluster must satisfy the current scheme process"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://sfurti.msme.gov.in/SFURTI/Home.aspx","route":"eligible nodal or implementing agencies submit cluster proposals through the official portal","selection":"proposal and cluster appraisal under the current scheme process","applicant_route":"This is a cluster/institution-led route; an individual artisan or founder should be matched to a qualifying cluster and implementing agency rather than shown a direct personal grant application.","current_portal_context":"The official portal currently exposes SignUp for New Proposal, nodal-agency information, current notices and proposal/status reporting."},
        "fine_print":{"cluster_based":true,"direct_individual_grant":false,"support_areas":["common_facilities","tools_and_technology","training","product_development","design","packaging","marketing"],"current_sfurti_facts":{"official_sources_checked":"2026-09-08","current_portal":"https://sfurti.msme.gov.in/SFURTI/Home.aspx","current_portal_status":"The official portal reports 513 approved clusters, 376 functional clusters and 0 proposals under consideration at the displayed dashboard snapshot; these are programme-dashboard metrics, not applicant entitlement or a funding promise.","current_guideline":"The portal displays Revised Guidelines for SFURTI dated 09 September 2022; the guideline frames support around traditional-industry collectives, cluster infrastructure, technology, training, product development, design, packaging and marketability.","current_availability":"The portal exposes SignUp for New Proposal and a nodal-agency route, but no universal deadline is asserted; verify the nodal agency, current notice, project terms and live submission state before recommendation."},"current_source_reconciliation":"The current SFURTI portal, proposal/status surfaces and 09 September 2022 revised-guideline link were checked on 8 September 2026. Portal access is retained as operational evidence, not as proof that every cluster, artisan, founder or enterprise is eligible or that funding is currently available.","review_note":"Confirm eligible cluster composition, implementing agency, funding pattern, project ceiling, current notice, proposal window and the route from an individual business to a supported cluster before publication."},
        "benefit_summary":{"types":["grant","training","market_access"],"summary":"Cluster infrastructure, technology, training, product-development and market-support assistance under the applicable project approval."},
        "benefit_type":"grant",
        "benefit_label":"Traditional-industry cluster development support",
        "benefit_conditions":{"cluster_project_required":true,"current_project_approval_required":true},
        "requirement":"Eligible cluster proposal",
        "requirement_description":"A qualifying traditional-industry cluster and an eligible proposal route must be established before application.",
        "rules":{"all":[{"field":"traditional_industry_cluster_identified","operator":"equals","value":true},{"field":"sfurti_proposal_route_open","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Identify the cluster and nodal route","description":"Confirm the traditional-industry cluster, artisan/producer collective and eligible nodal or implementing agency.","url":"https://sfurti.msme.gov.in/SFURTI/Home.aspx"},{"title":"Prepare and submit the proposal","description":"Use the current SFURTI proposal process and retain the cluster, project and implementation evidence.","url":"https://sfurti.msme.gov.in/SFURTI/Home.aspx"}],
        "window_type":"rolling",
        "window_label":"The official portal exposes a new-proposal route, but proposal availability, nodal route, project terms and any notice-specific deadline must be verified before an actionable recommendation.",
        "window_evidence":{"source_url":"https://sfurti.msme.gov.in/SFURTI/Home.aspx","anchor":"SignUp for New Proposal, Nodal Agency List, current notices and proposal/status reporting; checked 8 September 2026"}
      },
      {
        "slug":"national-scheduled-caste-scheduled-tribe-hub",
        "name":"National Scheduled Caste and Scheduled Tribe Hub (NSSH)",
        "type":"market_access",
        "authority":"Ministry of Micro, Small and Medium Enterprises - National SC-ST Hub",
        "authority_url":"https://msme.gov.in/",
        "canonical_url":"https://sclcss.msme.gov.in/Manual/Guidelines.pdf",
        "source_url":"https://sclcss.msme.gov.in/Manual/Guidelines.pdf",
        "source_kind":"guideline",
        "source_title":"Revised Guidelines of National Scheduled Caste and Scheduled Tribe Hub Scheme",
        "source_anchor":"Definition of SC/ST MSEs and Functions of NSSH",
        "summary":"Capacity-building, procurement participation, mentoring and credit-linkage support for SC/ST-owned micro and small enterprises.",
        "objective":"Enable SC/ST entrepreneurs to participate in public procurement and build enterprise capacity, market access and linkages.",
        "legal_basis":"Revised Guidelines of National Scheduled Caste and Scheduled Tribe Hub Scheme for the 2021-22 to 2025-26 financial cycle",
        "eligibility":{"entity_types":["micro","small"],"founder_categories":["sc","st"],"conditions":["SC/ST ownership threshold depends on entity form","current successor or extension notice must be verified"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://dashboard.msme.gov.in/scsthub.aspx","route":"follow the current NSSH/NSIC implementation and outreach route only after a current continuation or operating notice is verified","support_routes":["procurement facilitation","vendor development","mentoring","credit linkage"],"current_route_boundary":"The official dashboard is a reporting surface, not proof of a new application window or legal continuation."},
        "fine_print":{"ownership_thresholds":{"proprietary":100,"partnership_or_private_company":51},"procurement_target_percent":4,"financial_cycle_end":"2026-03-31","current_nssh_facts":{"official_sources_checked":"2026-09-08","revised_guideline_date":"2025-05-15","guideline_source":"https://sclcss.msme.gov.in/Manual/Guidelines.pdf","cited_cycle":"2021-22 to 2025-26","cited_cycle_end":"2026-03-31","implementing_agency":"National Small Industries Corporation (NSIC)","dashboard_context":"The official MSME National SC-ST Hub dashboard was last updated 14 August 2026 and includes 2026-27 reporting context, but dashboard activity does not establish a successor legal cycle, continued funding authority or universal application window.","current_availability":"No post-31 March 2026 continuation or universal application window was evidenced in the official sources checked; keep the national opportunity closed pending an official continuation or current operating notice."},"review_note":"The official 15 May 2025 memorandum and revised guideline cover a financial cycle ending 31 March 2026. Do not publish as current until a successor, extension or current operating notice is verified."},
        "benefit_summary":{"types":["market_access","training","mentorship"],"summary":"Procurement participation, vendor-development, mentoring, capacity-building and credit-linkage support subject to the current operating notice."},
        "benefit_type":"market_access",
        "benefit_label":"SC/ST procurement and capacity-building support",
        "benefit_conditions":{"sc_st_owned_mse_required":true,"current_operating_notice_required":true},
        "requirement":"SC/ST ownership and current programme route",
        "requirement_description":"The enterprise must satisfy the applicable SC/ST ownership threshold and the current NSSH/implementing-agency route.",
        "rules":{"all":[{"field":"enterprise_size","operator":"in","value":["micro","small"]},{"field":"sc_st_ownership_percent","operator":"greater_than_or_equal","value":51},{"field":"nssh_current_route_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Verify ownership and current NSSH status","description":"Confirm entity-form ownership thresholds and whether a current successor or extension notice is available.","url":"https://sclcss.msme.gov.in/Manual/Guidelines.pdf"},{"title":"Use the current implementation route","description":"Follow the official NSSH/NSIC route only after the current continuation or operating notice is verified.","url":"https://dashboard.msme.gov.in/scsthub.aspx"}],
        "window_type":"closed",
        "window_label":"The cited NSSH financial-cycle guideline ended on 31 March 2026. Dashboard reporting does not establish a new universal application window.",
        "closes_at":"2026-03-31",
        "window_evidence":{"source_url":"https://sclcss.msme.gov.in/Manual/Guidelines.pdf","anchor":"15 May 2025 memorandum; scheme applicability and financial cycle 2021-22 to 2025-26"}
      },
      {
        "slug":"special-credit-linked-capital-subsidy-scheme-sclcss",
        "name":"Special Credit Linked Capital Subsidy Scheme (SCLCSS)",
        "type":"subsidy",
        "authority":"National SC-ST Hub - SCLCSS",
        "authority_url":"https://sclcss.msme.gov.in/",
        "canonical_url":"https://sclcss.msme.gov.in/",
        "source_url":"https://sclcss.msme.gov.in/",
        "source_kind":"agency",
        "source_title":"Special Credit Linked Capital Subsidy Scheme official portal",
        "source_anchor":"Nature of assistance, Who can be benefitted and How to apply",
        "summary":"Capital-subsidy support for eligible SC/ST-owned micro and small enterprises purchasing new plant, machinery or equipment through institutional credit.",
        "objective":"Improve access to modern technology and support new or expanding SC/ST-owned MSEs participating in public procurement.",
        "legal_basis":"Special Credit Linked Capital Subsidy Scheme component under the National SC-ST Hub framework",
        "eligibility":{"entity_types":["sole_proprietorship","partnership","cooperative","society","private_micro_or_small_enterprise"],"founder_categories":["sc","st"],"industries":["manufacturing","services"],"conditions":["new plant, machinery or equipment","term loan from an eligible Prime Lending Institution"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://sclcss.msme.gov.in/","route":"submit the subsidy application and required documents to the concerned Prime Lending Institution from which the term loan is availed only after current continuation is verified","current_route_boundary":"The official portal describes the lender-led route but does not by itself establish post-March-2026 continuation.","current_document_checklist":"The official January 2026 checklist references the application form, revised/family undertaking, DIC clearance, PLI due-diligence certificate, GeM undertaking and recent caste certificate; current submission and claim requirements remain subject to the controlling route."},
        "fine_print":{"subsidy_percent":25,"subsidy_ceiling_inr":2500000,"asset_condition":"new plant, machinery or equipment eligible for term loan","lender_condition":"institutional credit through an eligible Prime Lending Institution","current_sclcss_facts":{"official_sources_checked":"2026-09-08","current_portal":"https://sclcss.msme.gov.in/","portal_terms":"The official portal describes a 25% subsidy with an overall subsidy ceiling of Rs. 25 lakh for eligible new plant, machinery or equipment through institutional credit.","application_checklist":"The portal links an application checklist dated 26 January 2026; the checklist is operational document evidence and does not itself extend the NSSH financial cycle or establish a universal new-intake window.","co_terminus_boundary":"SCLCSS is represented as a component under NSSH, whose cited financial cycle ended 31 March 2026.","current_availability":"No post-31 March 2026 continuation or universal application window was evidenced in the official sources checked; keep closed pending an official continuation notice."},"review_note":"The portal and January 2026 checklist are retained as component and operating evidence. Confirm current continuation, eligible asset list, SC/ST ownership evidence, documents, claim timing and lender route before publication."},
        "benefit_summary":{"types":["subsidy"],"summary":"25% capital subsidy with a cited overall subsidy ceiling of Rs. 25 lakh, subject to current official conditions and lender processing."},
        "benefit_type":"subsidy",
        "benefit_label":"Plant and machinery capital subsidy",
        "amount_max":2500000,
        "percentage":25,
        "benefit_conditions":{"sc_st_owned_mse_required":true,"new_equipment_required":true,"term_loan_required":true},
        "requirement":"SC/ST ownership, eligible MSE and institutional term loan",
        "requirement_description":"The enterprise must meet the applicable SC/ST ownership and MSE conditions and obtain an eligible institutional term loan for new plant, machinery or equipment.",
        "rules":{"all":[{"field":"enterprise_size","operator":"in","value":["micro","small"]},{"field":"sc_st_owned","operator":"equals","value":true},{"field":"new_plant_machinery_or_equipment","operator":"equals","value":true},{"field":"term_loan_from_prime_lending_institution","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Verify enterprise and asset eligibility","description":"Confirm SC/ST ownership, MSE status, manufacturing or service activity, and that the proposed new equipment is eligible.","url":"https://sclcss.msme.gov.in/"},{"title":"Verify continuation and lender route","description":"Confirm a current NSSH/SCLCSS operating notice, then submit the subsidy request and supporting documents to the Prime Lending Institution providing the term loan.","url":"https://dashboard.msme.gov.in/scsthub.aspx"}],
        "window_type":"closed",
        "window_label":"The SCLCSS portal remains an official reference, but the component is treated as closed nationally pending post-31 March 2026 NSSH continuation evidence.",
        "closes_at":"2026-03-31",
        "window_evidence":{"source_url":"https://sclcss.msme.gov.in/Manual/Guidelines.pdf","anchor":"NSSH financial-cycle end and component co-terminus boundary"}
      },
      {
        "slug":"aspire-innovation-rural-industry-entrepreneurship",
        "name":"A Scheme for Promoting Innovation, Rural Industry and Entrepreneurship (ASPIRE)",
        "type":"incubator",
        "authority":"Ministry of Micro, Small and Medium Enterprises - ASPIRE",
        "authority_url":"https://aspire.msme.gov.in/",
        "canonical_url":"https://aspire.msme.gov.in/WriteReadData/DocumentFile/ASPIRE_NEW.pdf",
        "source_url":"https://aspire.msme.gov.in/WriteReadData/DocumentFile/ASPIRE_NEW.pdf",
        "source_kind":"guideline",
        "source_title":"Operational Guidelines for ASPIRE",
        "source_anchor":"Guidelines for ASPIRE - A Scheme for Promoting Innovation, Rural Industry & Entrepreneurship",
        "summary":"Incubation and rural entrepreneurship support through livelihood business incubators and related institutional routes.",
        "objective":"Promote innovation, rural industry and entrepreneurship by supporting incubation and enterprise development in rural and underserved areas.",
        "legal_basis":"Operational Guidelines for ASPIRE",
        "eligibility":{"entity_types":["host_institute","business_incubator","government_institution","ngo","rural_enterprise_support_organisation"],"conditions":["institutional eligibility and approval route apply","current availability and component rules must be verified"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://aspire.msme.gov.in/ASPIRE/Registration.aspx","route":"eligible institutions follow the current official proposal or approval route for a new Livelihood Business Incubator","focus":["livelihood_business_incubators","rural_industry","entrepreneurship"],"current_portal_context":"The official ASPIRE portal currently states that eligible applicants may apply for new Livelihood Business Incubators and exposes a registration form.","applicant_route_boundary":"This is an institution-led incubator route; an individual founder should be matched to an approved/current LBI for incubation rather than shown a direct personal ASPIRE grant application."},
        "fine_print":{"institution_led":true,"rural_focus":true,"direct_individual_grant":false,"current_aspire_facts":{"official_sources_checked":"2026-09-08","current_portal":"https://aspire.msme.gov.in/ASPIRE/AFHome.aspx","current_application_route":"The official portal exposes Apply for New LBI and the registration form identifies Livelihood Business Incubator (LBI) as the applicant category.","current_notice":"The official portal displays that eligible applicants may apply for new Livelihood Business Incubators.","current_dashboard_context":"The portal reports 109 LBIs approved, 82 functional, 1,15,437 beneficiaries skilled, 32,085 beneficiaries suitably employed and 1,006 micro enterprises established/supported at the displayed snapshot; these are programme metrics, not applicant entitlement.","guideline_boundary":"The revised operational guideline dated 28 January 2022 covers continuation for 2021-22 to 2025-26; post-2025-26 continuation, current assistance ceilings and current approval terms require review.","application_material":"The official LBI application form identifies executive summary, need statement, proposed interventions, outputs/outcomes, mentor institute, host institute, proposed LBI and responsible contacts as application sections; current form and attachment requirements must be verified before submission."},"current_source_reconciliation":"The current ASPIRE dashboard, Apply for New LBI/login route, registration form, registration manual, 2023 LBI application form and revised 2022 operational guideline were checked on 8 September 2026. The record remains institution-led and review-gated; portal availability does not establish eligibility or sanction for a specific institution.","review_note":"Confirm the latest operational guideline, eligible host/mentor institution categories, assistance ceilings, matching or contribution conditions, implementation route, current application form, document formats and post-2025-26 continuation before publication."},
        "benefit_summary":{"types":["grant","incubation","training"],"summary":"Institution-led incubation and rural entrepreneurship support under the applicable ASPIRE component and approval route."},
        "benefit_type":"grant",
        "benefit_label":"Rural innovation and incubation support",
        "benefit_conditions":{"institution_led":true,"current_approval_required":true},
        "requirement":"Eligible institution and current ASPIRE route",
        "requirement_description":"An eligible institution must satisfy the current ASPIRE approval and proposal conditions.",
        "rules":{"all":[{"field":"eligible_host_institute","operator":"equals","value":true},{"field":"aspire_current_route_available","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Check institutional eligibility","description":"Confirm the institution or incubator fits the current ASPIRE categories and rural-enterprise focus.","url":"https://aspire.msme.gov.in/"},{"title":"Follow the current proposal route","description":"Use the official ASPIRE route and retain institutional, project and implementation documents.","url":"https://aspire.msme.gov.in/"}],
        "window_type":"rolling",
        "window_label":"The official ASPIRE portal displays an invitation for eligible applicants to apply for new Livelihood Business Incubators; verify current institutional eligibility, post-2025-26 continuation and live submission state.",
        "window_evidence":{"source_url":"https://aspire.msme.gov.in/ASPIRE/Registration.aspx","anchor":"ASPIRE Registration Form; Livelihood Business Incubator (LBI) category; checked 8 September 2026"}
      }
    ]'::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, official_url)
    select
      item->>'authority', 'central', 'Ministry of Micro, Small and Medium Enterprises', item->>'authority_url'
    where not exists (
      select 1 from public.authorities existing_authority
      where existing_authority.name = item->>'authority'
    )
    returning id into authority_id;
    if authority_id is null then
      select id into authority_id from public.authorities where name = item->>'authority' limit 1;
    end if;

    seed_opportunity_id := null;
    insert into public.opportunities
      (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (
      item->>'slug', item->>'name', item->>'type', 'in_review', authority_id,
      '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url'
    )
    on conflict (slug) do update set
      name = excluded.name,
      authority_id = excluded.authority_id,
      canonical_url = excluded.canonical_url
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then
      select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1;
    end if;

    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis,
       eligibility, application, fine_print, benefit_summary,
       last_verified_at, completeness, confidence, review_status)
    values (
      seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis',
      item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary',
      now(), 0.82, 0.80, 'in_review'
    )
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov
      where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where id = seed_opportunity_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (
      select 1 from public.opportunity_sources os
      where os.opportunity_version_id = version_id and os.source_url = item->>'source_url'
    );

    insert into public.opportunity_benefits
      (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select
      version_id, item->>'benefit_type', item->>'benefit_label',
      case when item ? 'amount_max' then (item->>'amount_max')::numeric else null end,
      case when item ? 'percentage' then (item->>'percentage')::numeric else null end,
      item->'benefit_conditions'
    where not exists (
      select 1 from public.opportunity_benefits ob
      where ob.opportunity_version_id = version_id and ob.label = item->>'benefit_label'
    );

    insert into public.opportunity_requirements
      (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'other', item->>'requirement', item->>'requirement_description', true
    where not exists (
      select 1 from public.opportunity_requirements oq
      where oq.opportunity_version_id = version_id and oq.name = item->>'requirement'
    );

    insert into public.eligibility_rule_sets
      (opportunity_version_id, rules, source_evidence, reviewed)
    select version_id, item->'rules', jsonb_build_array(jsonb_build_object('source_url', item->>'source_url', 'anchor', item->>'source_anchor')), false
    where not exists (
      select 1 from public.eligibility_rule_sets er
      where er.opportunity_version_id = version_id
    );

    insert into public.opportunity_steps
      (opportunity_version_id, step_number, title, description, official_url)
    select version_id, step_number, step->>'title', step->>'description', step->>'url'
    from (
      select (row_number() over ())::integer as step_number, step
      from jsonb_array_elements(item->'steps') as steps(step)
    ) numbered_steps
    where not exists (
      select 1 from public.opportunity_steps os
      where os.opportunity_version_id = version_id
        and os.step_number = numbered_steps.step_number
    );

    insert into public.opportunity_windows
      (opportunity_version_id, window_type, label, opens_at, closes_at, source_evidence)
    select
      version_id, item->>'window_type', item->>'window_label',
      case when item ? 'opens_at' then (item->>'opens_at')::date else null end,
      case when item ? 'closes_at' then (item->>'closes_at')::date else null end,
      item->'window_evidence'
    where not exists (
      select 1 from public.opportunity_windows ow
      where ow.opportunity_version_id = version_id
    );

    insert into public.review_tasks (opportunity_version_id, task_type, status)
    select version_id, 'publish', 'open'
    where not exists (
      select 1 from public.review_tasks rt
      where rt.opportunity_version_id = version_id
        and rt.task_type = 'publish'
        and rt.status in ('open', 'in_review')
    );
  end loop;
end $$;

-- Clean-seed correction: preserve the Batch 085 MSME Innovative evidence
-- metadata when migrations run before the opportunity seed rows.
do $$
declare
  version_id uuid;
begin
  select current_version_id into version_id
  from public.opportunities
  where slug = 'msme-innovative-incubation-design-ipr';

  if version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_portal_context', 'The official MSME Innovative portal displays Idea Hackathon 6.0 host-institute instructions and separate Design, IPR and incubation routes.',
        'current_source_checked_at', '2026-09-08'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_innovative_reconciliation', jsonb_build_object(
          'official_sources_checked', '2026-09-08',
          'framework_boundary', 'Incubation, Design and IPR are separate component verticals with permitted interoperability; benefits and conditions are not one combined entitlement.',
          'current_portal', 'https://innovative.msme.gov.in/',
          'design_route', 'https://innovative.msme.gov.in/Home/Index',
          'ipr_route', 'https://innovative.msme.gov.in/Home/IprIndex',
          'incubation_route', 'https://www.my.msme.gov.in/inc/Default.aspx',
          'hackathon_status', 'Existing controlled evidence records the displayed 7 September 2026 Host Institute forwarding deadline as closed; fresh live capture is required before publication.',
          'review_boundary', 'Verify current component notice, applicant type, eligible costs, contribution, window, documents and selection conditions before recommendation.'
        ),
        'current_source_reconciliation', 'Official MSME Innovative portal, About page, Design route, IPR route, guideline and MyMSME incubation route were checked on 8 September 2026. The record remains component-specific and review-gated; portal availability is not a universal entitlement.'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://innovative.msme.gov.in/Home/About', 'ministry', 'MSME Innovative official About page', 'Unified Incubation, Design and IPR framework'),
      ('https://www.my.msme.gov.in/inc/Default.aspx', 'implementing_portal', 'MSME Innovative current incubation route', 'Host Institute and Idea Hackathon instructions')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources os
      where os.opportunity_version_id = version_id
        and os.source_url = evidence.source_url
    );
  end if;
end $$;
