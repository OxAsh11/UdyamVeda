export type RegistrationJourneyStatus = 'review-gated' | 'expanding'

export type RegistrationJourney = {
  id: string
  title: string
  shortTitle: string
  category: 'foundation' | 'tax' | 'recognition' | 'trade' | 'food' | 'workforce' | 'state'
  description: string
  whyItMatters: string
  status: RegistrationJourneyStatus
  officialUrl?: string
  sourceLabel: string
  prerequisites: string[]
  documents: string[]
  steps: string[]
  reviewNote: string
  actionable: boolean
}

/**
 * These are preparation journeys, not filing claims. The corresponding
 * catalog records are seeded as `in_review` until a reviewer confirms the
 * current form, applicability, thresholds and portal route.
 */
export const NATIONAL_REGISTRATION_JOURNEYS: RegistrationJourney[] = [
  {
    id: 'company-incorporation-spice-plus',
    title: 'Company incorporation through SPICe+',
    shortTitle: 'Incorporate your company',
    category: 'foundation',
    description: 'Prepare the MCA name reservation and incorporation journey, including linked services where the current form supports them.',
    whyItMatters: 'Creates the legal foundation for a company and unlocks downstream tax, banking and recognition steps.',
    status: 'review-gated',
    officialUrl: 'https://www.mca.gov.in/',
    sourceLabel: 'MCA SPICe+ and Linked Filings FAQ',
    prerequisites: ['Choose an eligible company structure', 'Confirm registered-office details', 'Identify proposed directors and subscribers'],
    documents: ['Identity and address evidence for proposed directors', 'Registered-office evidence', 'Subscriber and director declarations', 'Digital-signature readiness'],
    steps: ['Choose or reserve a name', 'Prepare the current SPICe+ form and linked filings', 'Review PAN, TAN, GST, EPFO, ESIC and bank-account options shown by the current form', 'Submit through MCA and retain the acknowledgement'],
    reviewNote: 'Current MCA forms, fees, linked-service availability and document rules must be confirmed before this journey becomes actionable.',
    actionable: false,
  },
  {
    id: 'pan-tan-tax-identity',
    title: 'PAN and TAN readiness',
    shortTitle: 'Set up tax identity',
    category: 'tax',
    description: 'Organise the business and authorised-person information needed for PAN and, where applicable, TAN.',
    whyItMatters: 'Tax identity is a dependency for banking, GST, payroll and several government applications.',
    status: 'review-gated',
    officialUrl: 'https://www.incometax.gov.in/iec/foportal/help/all-topics/pan',
    sourceLabel: 'Income Tax Department PAN and TAN guidance',
    prerequisites: ['Know the final entity or proprietor name', 'Keep incorporation or constitution evidence ready'],
    documents: ['Entity constitution or incorporation evidence', 'Authorised-person identity and address evidence', 'Principal-place or correspondence address evidence'],
    steps: ['Confirm whether PAN is already issued', 'Determine whether TAN is required for the business activity', 'Use the official Income Tax route or the route linked from the incorporation workflow', 'Store the acknowledgement and issued identifiers securely'],
    reviewNote: 'The exact application route and supporting documents vary by entity type and must be checked against the current official guidance.',
    actionable: false,
  },
  {
    id: 'business-banking-readiness',
    title: 'Business banking readiness',
    shortTitle: 'Open a current account',
    category: 'foundation',
    description: 'Create a clean handoff pack for a business current account after the entity and tax identity are ready.',
    whyItMatters: 'Separating business and personal money improves bookkeeping, scheme disbursement readiness and application traceability.',
    status: 'review-gated',
    officialUrl: 'https://www.rbi.org.in/',
    sourceLabel: 'RBI banking and KYC framework; bank-specific checklist applies',
    prerequisites: ['Entity or proprietor identity is settled', 'PAN and business address are available'],
    documents: ['PAN and constitution evidence', 'Business address evidence', 'Authorised signatory KYC', 'Board or partner authorisation where applicable'],
    steps: ['Compare current-account requirements from the selected bank', 'Prepare the business KYC pack', 'Apply directly with the bank', 'Record the account opening date and renewal or KYC reminders'],
    reviewNote: 'This is a bank handoff, not a government registration. Fees, minimum balances and KYC requirements are bank-specific.',
    actionable: false,
  },
  {
    id: 'udyam-registration',
    title: 'Udyam / MSME registration',
    shortTitle: 'Register as an MSME',
    category: 'recognition',
    description: 'Prepare the free, paperless, self-declared Udyam registration journey for an eligible enterprise.',
    whyItMatters: 'Udyam status can support access to MSME protections, schemes, tenders and lender programmes where their rules apply.',
    status: 'review-gated',
    officialUrl: 'https://udyamregistration.gov.in/',
    sourceLabel: 'Official Udyam Registration portal',
    prerequisites: ['Aadhaar of the relevant proprietor, partner or authorised signatory', 'PAN and business details', 'Investment and turnover information where requested'],
    documents: ['Aadhaar-linked identity', 'PAN', 'Business address and bank details', 'NIC activity information'],
    steps: ['Open the official Udyam portal', 'Complete the self-declared enterprise details', 'Submit using the applicant’s own mobile and email', 'Save the Udyam certificate and reference'],
    reviewNote: 'UdyamVeda can explain and validate preparation, but will not store OTPs, impersonate the applicant or claim to be the government portal.',
    actionable: false,
  },
  {
    id: 'gst-registration',
    title: 'GST registration',
    shortTitle: 'Assess GST and prepare',
    category: 'tax',
    description: 'Assess GST applicability and assemble the official document set before the portal handoff.',
    whyItMatters: 'GST readiness affects invoicing, interstate or online selling and tax-compliance operations.',
    status: 'review-gated',
    officialUrl: 'https://www.gst.gov.in/',
    sourceLabel: 'GSTN portal and official GST registration document checklist',
    prerequisites: ['State and principal place of business', 'Supply, turnover and e-commerce facts', 'Authorised signatory identified'],
    documents: ['Proof of constitution', 'Authorised-signatory evidence and photograph', 'Principal-place evidence', 'Additional-place evidence where applicable'],
    steps: ['Assess applicability using current GST law and business facts', 'Validate file types and size limits against the current checklist', 'Complete the official GST portal workflow', 'Retain the ARN, clarifications and certificate'],
    reviewNote: 'Do not infer GST liability from a generic profile. State, supply, turnover, e-commerce and sector facts require a current review.',
    actionable: false,
  },
  {
    id: 'dpiit-startup-recognition',
    title: 'DPIIT Startup recognition',
    shortTitle: 'Apply for startup recognition',
    category: 'recognition',
    description: 'Prepare the Startup India recognition route through the official National Single Window System handoff.',
    whyItMatters: 'Recognition can connect an eligible startup to separate Startup India benefits and support routes.',
    status: 'review-gated',
    officialUrl: 'https://www.startupindia.gov.in/content/sih/en/startupgov/startup_recognition_page.html',
    sourceLabel: 'Startup India DPIIT recognition guidance',
    prerequisites: ['Eligible incorporated or registered entity', 'Innovation or improvement case', 'Incorporation, turnover and age facts'],
    documents: ['Incorporation or registration certificate', 'PAN', 'Innovation or improvement description', 'Current form-specific declarations'],
    steps: ['Confirm the current recognition criteria', 'Create or use the startup’s own NSWS account', 'Add Registration as a Startup', 'Submit the current form and retain the certificate or acknowledgement'],
    reviewNote: 'Recognition is not a cash grant and does not guarantee every linked benefit. The applicant must use its own account, mobile and email.',
    actionable: false,
  },
  {
    id: 'iec-registration',
    title: 'Import Export Code (IEC)',
    shortTitle: 'Prepare for importing or exporting',
    category: 'trade',
    description: 'Check whether the business needs an IEC and prepare the DGFT application handoff.',
    whyItMatters: 'IEC readiness supports lawful import and export operations and related trade workflows.',
    status: 'review-gated',
    officialUrl: 'https://www.dgft.gov.in/CP/?opt=iec-profile-management-system',
    sourceLabel: 'DGFT IEC profile-management route',
    prerequisites: ['Business PAN and entity details', 'Authorised person and address details', 'A current import/export use case'],
    documents: ['PAN and constitution evidence', 'Address evidence', 'Bank details and authorised-person information as requested by DGFT'],
    steps: ['Confirm whether IEC is needed for the proposed activity', 'Create or use the business’s own DGFT account', 'Complete the current IEC application', 'Save the IEC record and update obligations'],
    reviewNote: 'Current exemptions, fees, bank validation and annual update requirements must be confirmed before publication.',
    actionable: false,
  },
  {
    id: 'fssai-license',
    title: 'FSSAI food-business licensing',
    shortTitle: 'License a food business',
    category: 'food',
    description: 'Identify the food-safety registration or licence path and prepare the FoSCoS handoff for a food business.',
    whyItMatters: 'Food businesses need the correct food-safety registration or licence before operating in the applicable category.',
    status: 'review-gated',
    officialUrl: 'https://foscos.fssai.gov.in/',
    sourceLabel: 'FSSAI FoSCoS official portal',
    prerequisites: ['Food activity and premises identified', 'Business constitution and responsible person known', 'State and operating location known'],
    documents: ['Constitution evidence', 'Premises and layout information', 'Responsible-person identity', 'Activity-specific documents requested by the current form'],
    steps: ['Classify the activity and premises', 'Select the correct registration or licence route', 'Prepare the current Form A or Form B material', 'Submit through FoSCoS and track inspection or clarification tasks'],
    reviewNote: 'The correct category, fee and document list depend on the activity, premises and current FSSAI rules.',
    actionable: false,
  },
  {
    id: 'epfo-esic-compliance',
    title: 'EPFO and ESIC employer readiness',
    shortTitle: 'Prepare workforce compliance',
    category: 'workforce',
    description: 'Assess employer coverage and organise the workforce information needed for EPFO and ESIC routes where applicable.',
    whyItMatters: 'It gives growing employers a controlled path to statutory payroll and employee-benefit compliance.',
    status: 'review-gated',
    officialUrl: 'https://www.epfindia.gov.in/site_en/EODB.php',
    sourceLabel: 'EPFO Ease of Doing Business and ESIC employer guidance',
    prerequisites: ['Establishment type and location', 'Employee and wage facts', 'Authorised employer identified'],
    documents: ['PAN and establishment details', 'Authorised-person information', 'Employee and wage information', 'Current declarations and licences where requested'],
    steps: ['Assess current coverage, exclusions and area conditions', 'Prepare establishment and workforce data', 'Use the current EPFO, ESIC or common-registration route', 'Record the employer code and recurring filing tasks'],
    reviewNote: 'Do not use a single employee threshold as a universal rule. Establishment class, area, wage, exclusions and current notifications require review.',
    actionable: false,
  },
  {
    id: 'state-local-licences',
    title: 'State and local licences',
    shortTitle: 'Add state and local permits',
    category: 'state',
    description: 'State Shops and Establishments, professional tax and sector or municipal permits will be added through reviewed state source packs.',
    whyItMatters: 'Local applicability can determine whether a business may operate, hire, trade or use a particular premises.',
    status: 'expanding',
    sourceLabel: 'State and local source packs — coverage expanding',
    prerequisites: ['State, district and municipality', 'Sector and premises type', 'Employees and operating activities'],
    documents: ['Business constitution evidence', 'Premises evidence', 'Owner or authorised-person KYC', 'Sector-specific documents'],
    steps: ['Tell us the operating location and activity', 'Wait for the relevant source pack to pass review', 'Review the applicable permits and renewal dates', 'Use the official state or local portal handoff'],
    reviewNote: 'This journey is intentionally not actionable in Central beta until the relevant state or local source pack is reviewed.',
    actionable: false,
  },
]

export const ACTIONABLE_NATIONAL_JOURNEYS = NATIONAL_REGISTRATION_JOURNEYS.filter((journey) => journey.actionable)
