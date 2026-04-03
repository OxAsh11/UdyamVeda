export type ComplianceCategory = 'foundation' | 'tax' | 'license' | 'ip' | 'trade' | 'hr' | 'corporate'
export type CompliancePriority = 'critical' | 'high' | 'medium' | 'low'

export interface CalendarEntry {
  label: string
  dayOfMonth?: number       // e.g. 11 = 11th of each applicable month
  month?: number            // 1–12 for annual deadlines
  months?: number[]         // for quarterly, e.g. [3, 6, 9, 12]
  frequency: 'monthly' | 'quarterly' | 'annual' | 'once'
  note?: string
}

export interface ComplianceItem {
  id: string
  name: string
  shortName: string
  category: ComplianceCategory
  priority: CompliancePriority
  description: string
  why: string
  cost: string
  timeline: string
  officialUrl: string
  scoreWeight: number        // contribution to health score (normalized per user)
  applicableSectors: string[]  // empty = all sectors; strings matched via includes()
  applicableStages: string[]   // empty = all stages; from business_profiles.stage
  documents: string[]
  steps: string[]
  calendar?: CalendarEntry
  penalty?: string
}

export const COMPLIANCE_ITEMS: ComplianceItem[] = [

  // ── FOUNDATION ─────────────────────────────────────────────────

  {
    id: 'current-account',
    name: 'Business Current Account',
    shortName: 'Current Account',
    category: 'foundation',
    priority: 'critical',
    description: 'A current account in your business name is the financial foundation of any business. It separates personal and business finances, enables vendor payments, and is required to accept customer transfers.',
    why: 'Banks, investors, and govt portals all require a business current account. GST returns, scheme disbursements, and payroll all flow through it. Operating without one is a compliance and credibility risk.',
    cost: '₹0 – ₹2,000 (minimum balance varies)',
    timeline: '2–5 days',
    officialUrl: 'https://www.rbi.org.in',
    scoreWeight: 5,
    applicableSectors: [],
    applicableStages: [],
    documents: ['PAN card', 'Entity registration certificate', 'GST certificate (if registered)', 'Address proof of business', 'Aadhaar of owner/directors'],
    steps: [
      'Choose a bank — public sector (SBI, PNB) or private (HDFC, ICICI, Kotak)',
      'Visit branch with business documents or apply online',
      'Submit KYC for all directors/proprietors',
      'Deposit initial minimum balance (₹10,000 – ₹1,00,000 depending on bank)',
      'Receive account number and cheque book',
    ],
    penalty: 'No legal penalty, but rejection from govt scheme portals, client transfers, and GST registration if not done.',
  },

  {
    id: 'udyam',
    name: 'Udyam / MSME Registration',
    shortName: 'Udyam',
    category: 'foundation',
    priority: 'critical',
    description: 'Free government registration that classifies your business as a Micro, Small, or Medium Enterprise. Unlocks collateral-free loans, tender preferences, interest subsidies, delayed payment protection, and 3,000+ schemes.',
    why: 'Udyam is the gateway to almost every MSME scheme in India. It takes 10 minutes, is free, and has no downside. Not registering means leaving significant money on the table.',
    cost: '₹0 — completely free',
    timeline: 'Instant (self-declaration)',
    officialUrl: 'https://udyamregistration.gov.in',
    scoreWeight: 8,
    applicableSectors: [],
    applicableStages: [],
    documents: ['Aadhaar number of proprietor/director', 'PAN card', 'Bank account details', 'Business address'],
    steps: [
      'Go to udyamregistration.gov.in',
      'Enter Aadhaar number and select enterprise type',
      'Fill in business details — name, address, NIC code, turnover, investment',
      'Submit — the certificate generates instantly',
      'Download and save your Udyam Registration Certificate',
    ],
  },

  {
    id: 'dpiit',
    name: 'DPIIT Startup India Recognition',
    shortName: 'DPIIT',
    category: 'foundation',
    priority: 'high',
    description: 'Official government recognition as a "Startup" from DPIIT. Unlocks 3-year tax holiday, 80% off patent fees, angel tax exemption, self-certification for 9 labour laws, and priority in government tenders.',
    why: 'If you\'re building something innovative and scalable, DPIIT recognition pays for itself in the first year through tax savings alone. The angel tax exemption protects you if you raise from investors.',
    cost: '₹0 — free to apply',
    timeline: '2–10 working days',
    officialUrl: 'https://www.startupindia.gov.in',
    scoreWeight: 6,
    applicableSectors: [],
    applicableStages: ['pre-launch', 'just-started', '1-2-years'],
    documents: ['Company incorporation certificate or LLP agreement', 'Brief description of innovation', 'PAN card'],
    steps: [
      'Register on startupindia.gov.in as a startup',
      'Fill in company/LLP details and CIN/LLPIN',
      'Write a 500-word description of your innovation and scalability',
      'Upload your incorporation certificate',
      'Submit — approval typically within 2–10 working days',
      'Download your DPIIT recognition certificate',
    ],
    penalty: 'Missing the angel tax exemption (Section 56(2)(viib)) if you raise from investors without recognition. Tax demand + 30% penalty on the excess premium.',
  },

  // ── TAX ────────────────────────────────────────────────────────

  {
    id: 'gst',
    name: 'GST Registration',
    shortName: 'GST',
    category: 'tax',
    priority: 'critical',
    description: 'Goods & Services Tax registration is mandatory for any business with turnover above ₹20 lakh (₹10L for special category states), or for any business selling online through e-commerce platforms — regardless of turnover.',
    why: 'Without GST registration, you can\'t sell on Amazon, Flipkart, or Meesho. You can\'t claim input tax credit. You can\'t invoice B2B clients who need GST compliance. It is the single most important tax registration.',
    cost: '₹0 government fees + ₹1,000–3,000 CA fees (optional)',
    timeline: '3–7 working days',
    officialUrl: 'https://www.gst.gov.in',
    scoreWeight: 10,
    applicableSectors: [],
    applicableStages: [],
    documents: ['PAN card', 'Aadhaar card', 'Proof of business address (rental agreement or own property documents)', 'Bank account statement', 'Entity registration certificate', 'Digital signature (for companies)'],
    steps: [
      'Visit gst.gov.in → Services → Registration → New Registration',
      'Fill Part A: PAN, mobile, email — get temporary reference number (TRN)',
      'Fill Part B: Business details, address, bank account, directors',
      'Upload documents and submit with DSC or EVC',
      'GST officer may ask for clarification — respond within 7 days',
      'GSTIN issued — typically in 3–7 working days',
    ],
    calendar: {
      label: 'GST Registration review',
      frequency: 'annual',
      month: 4,
      note: 'Review GSTIN details annually; update address/bank if changed',
    },
    penalty: '10% of tax due (minimum ₹10,000) for delay. 100% of tax due for deliberate evasion. ₹200/day for late GST return filing.',
  },

  {
    id: 'gstr1',
    name: 'GSTR-1 Monthly Filing',
    shortName: 'GSTR-1',
    category: 'tax',
    priority: 'critical',
    description: 'Monthly return detailing all outward supplies (sales invoices). Due on the 11th of every month for businesses with turnover above ₹5 crore. Quarterly (QRMP scheme) for smaller businesses.',
    why: 'Your buyers claim input tax credit based on your GSTR-1. If you don\'t file, your customers can\'t claim ITC — they will stop buying from you. Courts have held that non-filing is equivalent to tax evasion.',
    cost: '₹0 government fees',
    timeline: 'Ongoing — due 11th of each month',
    officialUrl: 'https://www.gst.gov.in',
    scoreWeight: 7,
    applicableSectors: [],
    applicableStages: [],
    documents: ['Sales invoices for the month', 'HSN/SAC codes for all products/services', 'GST software or portal access'],
    steps: [
      'Compile all sales invoices for the month',
      'Log in to gst.gov.in → Returns → GSTR-1',
      'Add B2B invoices (with buyer GSTIN), B2C invoices, and nil-rated/exempt supplies',
      'Verify auto-populated data and correct any errors',
      'File with DSC or EVC before the 11th',
    ],
    calendar: { label: 'GSTR-1 filing', dayOfMonth: 11, frequency: 'monthly' },
    penalty: '₹50/day (₹25 CGST + ₹25 SGST) for late filing. ₹20/day for nil returns. Buyer\'s ITC blocked if you don\'t file.',
  },

  {
    id: 'gstr3b',
    name: 'GSTR-3B Monthly Filing',
    shortName: 'GSTR-3B',
    category: 'tax',
    priority: 'critical',
    description: 'Monthly summary return of tax liability and input tax credit. Pay the net GST due (output tax minus ITC) when filing. Due by the 20th of each month for monthly filers.',
    why: 'GSTR-3B is where you actually pay GST. Delays attract interest at 18% per annum plus late fees. The GST portal now auto-populates data from GSTR-1, making filing faster.',
    cost: 'GST liability varies',
    timeline: 'Ongoing — due 20th of each month',
    officialUrl: 'https://www.gst.gov.in',
    scoreWeight: 7,
    applicableSectors: [],
    applicableStages: [],
    documents: ['GSTR-1 data (auto-populated)', 'Purchase invoices for ITC claim', 'Bank account for payment'],
    steps: [
      'Log in to gst.gov.in → Returns → GSTR-3B',
      'Review auto-populated liability from GSTR-1',
      'Enter eligible Input Tax Credit from purchases',
      'Compute net tax liability (output - ITC)',
      'Pay using internet banking / challan if liability exists',
      'File return before the 20th',
    ],
    calendar: { label: 'GSTR-3B filing + GST payment', dayOfMonth: 20, frequency: 'monthly' },
    penalty: '₹50/day late fee + 18% p.a. interest on unpaid tax. Interest accrues from the due date.',
  },

  {
    id: 'itr',
    name: 'Income Tax Return (ITR) Filing',
    shortName: 'ITR',
    category: 'tax',
    priority: 'critical',
    description: 'Annual filing of income tax return. Form depends on entity type — ITR-3 for proprietors, ITR-5 for partnerships/LLPs, ITR-6 for companies. Due 31st July for individuals and proprietors; 31st October for companies and audited entities.',
    why: 'ITR is legally mandatory and is required for loan applications, visa applications, Udyam compliance, and scheme applications. Banks verify ITR before approving business loans. Missing it triggers notices, penalties, and prosecution for repeated defaults.',
    cost: '₹0 government fees + ₹2,000–15,000 CA fees',
    timeline: 'Annual',
    officialUrl: 'https://www.incometax.gov.in',
    scoreWeight: 8,
    applicableSectors: [],
    applicableStages: [],
    documents: ['PAN card', 'Form 26AS (tax credit statement)', 'Books of accounts / P&L statement', 'Balance sheet', 'GST returns filed', 'TDS certificates'],
    steps: [
      'Close your books of accounts for the financial year (April – March)',
      'Prepare P&L and balance sheet with your CA or accounting software',
      'Download Form 26AS from incometax.gov.in to verify TDS credits',
      'File the appropriate ITR form before the due date',
      'Verify the return online (Aadhaar OTP / Net banking / DSC)',
    ],
    calendar: { label: 'ITR filing', dayOfMonth: 31, month: 7, frequency: 'annual', note: '31st July for proprietors; 31st October for companies/LLPs requiring audit' },
    penalty: '₹5,000 late filing fee (₹1,000 for income below ₹5L). Interest at 1% per month on unpaid tax. Prosecution for repeated non-filing.',
  },

  {
    id: 'advance-tax',
    name: 'Advance Tax Payments',
    shortName: 'Advance Tax',
    category: 'tax',
    priority: 'high',
    description: 'Businesses with estimated annual tax liability above ₹10,000 must pay tax in four instalments throughout the year — 15% by June 15, 45% by September 15, 75% by December 15, and 100% by March 15.',
    why: 'Missing advance tax payments attracts interest at 1% per month under Sections 234B and 234C. For a business paying ₹3L in annual tax, the interest penalty on missing instalments is ₹9,000–36,000 per year.',
    cost: 'Tax liability varies',
    timeline: 'Quarterly',
    officialUrl: 'https://www.incometax.gov.in',
    scoreWeight: 5,
    applicableSectors: [],
    applicableStages: ['1-2-years', '2-plus'],
    documents: ['Estimated P&L for the year', 'Challan 280 for payment', 'Net banking access'],
    steps: [
      'Estimate your annual income and tax liability with your CA',
      'Pay 15% of estimated tax by June 15',
      'Pay cumulative 45% by September 15',
      'Pay cumulative 75% by December 15',
      'Pay balance 100% by March 15',
      'Adjust actual liability when filing ITR in July/October',
    ],
    calendar: { label: 'Advance Tax payment', months: [6, 9, 12, 3], dayOfMonth: 15, frequency: 'quarterly', note: '15th June / Sept / Dec / March' },
    penalty: '1% per month interest under Section 234C for underpayment in each instalment.',
  },

  {
    id: 'tds',
    name: 'TDS Compliance (Deduction & Return)',
    shortName: 'TDS',
    category: 'tax',
    priority: 'high',
    description: 'If you pay contractors, freelancers, rent, or professional fees above threshold amounts, you must deduct Tax Deducted at Source (TDS) and deposit it with the government. Quarterly returns (Form 26Q) must be filed.',
    why: 'TDS non-compliance results in a 1% per month interest on the un-deducted amount, plus a 1.5% per month penalty from deduction to deposit. Disallowance of 30% of the expense in your own ITR is an additional hit.',
    cost: '₹0 government fees + ₹2,000–8,000 CA fees per quarter',
    timeline: 'Quarterly returns',
    officialUrl: 'https://www.tdscpc.gov.in',
    scoreWeight: 5,
    applicableSectors: [],
    applicableStages: ['1-2-years', '2-plus'],
    documents: ['TAN (Tax Deduction Account Number)', 'Vendor PAN cards', 'Payment records', 'Challan 281 for TDS deposit'],
    steps: [
      'Apply for TAN if not done (traces.gov.in)',
      'Identify all payments subject to TDS (rent > ₹50K/month, contractor > ₹30K, professional fees > ₹30K)',
      'Deduct TDS at applicable rate (1–10%) at time of payment',
      'Deposit TDS to government by 7th of next month via Challan 281',
      'File quarterly 26Q return by due date (15th of month following quarter end)',
      'Issue TDS certificates (Form 16A) to vendors within 15 days of filing',
    ],
    calendar: { label: 'TDS quarterly return (26Q)', months: [7, 10, 1, 5], dayOfMonth: 15, frequency: 'quarterly', note: '15th July / Oct / Jan / May' },
    penalty: '1% p.m. interest if TDS not deducted; 1.5% p.m. if deducted but not deposited. ₹200/day late fee for delayed 26Q filing.',
  },

  // ── LICENSES ────────────────────────────────────────────────────

  {
    id: 'shops-act',
    name: 'Shops & Establishments Act Registration',
    shortName: 'Shops Act',
    category: 'license',
    priority: 'high',
    description: 'State-specific registration for any business operating from a commercial premises, or employing workers. Covers working hours, leave policies, and wages. Required by most states before opening a bank account or hiring staff.',
    why: 'Most banks require Shops Act registration as KYC proof for a business current account. Clients and co-working spaces also ask for it. Without it, you have no legal proof of business existence at a particular address.',
    cost: '₹0 – ₹500 (varies by state and number of employees)',
    timeline: '1–7 days',
    officialUrl: 'https://labour.gov.in',
    scoreWeight: 5,
    applicableSectors: [],
    applicableStages: [],
    documents: ['PAN card', 'Aadhaar of owner', 'Business address proof (rental agreement or owned)', 'Passport photo', 'Number of employees'],
    steps: [
      'Visit your state Labour Department portal (varies by state)',
      'Fill the registration form with business name, address, nature of business, and employee count',
      'Upload documents and pay the nominal fee',
      'Certificate issued within 1–7 days (instant in some states)',
      'Renew annually — some states auto-renew, others require manual renewal',
    ],
    calendar: { label: 'Shops Act renewal', frequency: 'annual', month: 4, note: 'Renewal month varies by state — check your state Labour Dept portal' },
    penalty: '₹1,000–₹10,000 fine per inspection for operating without registration. Repeated violations can lead to business closure.',
  },

  {
    id: 'fssai',
    name: 'FSSAI Food License / Registration',
    shortName: 'FSSAI',
    category: 'license',
    priority: 'critical',
    description: 'Mandatory license for any business that manufactures, processes, stores, distributes, or sells food products. Basic Registration for annual turnover below ₹12 lakh; State License up to ₹20 crore; Central License above ₹20 crore or for export/multi-state.',
    why: 'Selling food without FSSAI is a criminal offence under the Food Safety & Standards Act 2006. Platforms like Zomato, Swiggy, Amazon Food, and BigBasket require FSSAI registration before onboarding. Banks also ask for it when opening accounts for food businesses.',
    cost: '₹100 (Basic) / ₹2,000–₹7,500 (State/Central license, varies by category)',
    timeline: '7–30 days',
    officialUrl: 'https://foscos.fssai.gov.in',
    scoreWeight: 10,
    applicableSectors: ['Food', 'Agriculture', 'Beverage', 'Restaurant', 'Catering', 'FMCG'],
    applicableStages: [],
    documents: ['PAN card', 'Aadhaar card', 'Proof of business address', 'Food safety management plan', 'List of food products', 'Partnership deed / incorporation certificate (if applicable)', 'Import/export license (for importers)'],
    steps: [
      'Determine your license type: Basic (< ₹12L), State (₹12L–₹20Cr), or Central (> ₹20Cr)',
      'Register on foscos.fssai.gov.in',
      'Fill application Form A (Basic) or Form B (State/Central)',
      'Upload documents and pay license fee',
      'Inspector visit for State/Central license (within 30 days)',
      'License issued — download certificate and display it at premises',
    ],
    calendar: { label: 'FSSAI license renewal', dayOfMonth: 31, month: 5, frequency: 'annual', note: 'Renew before expiry — licenses are valid 1–5 years based on type' },
    penalty: 'Imprisonment up to 6 months and fine up to ₹5 lakh for operating without license. ₹2,000–₹5,00,000 penalty for various violations.',
  },

  {
    id: 'fssai-return',
    name: 'FSSAI Annual Return (Form D1)',
    shortName: 'FSSAI Return',
    category: 'license',
    priority: 'high',
    description: 'Annual return that State and Central FSSAI license holders must file before May 31 each year. Covers details of food products manufactured, imported, exported, and sold during the financial year.',
    why: 'Failure to file FSSAI annual return can lead to license suspension or non-renewal. It\'s a compliance signal that FSSAI uses to track active licensees.',
    cost: '₹0',
    timeline: 'Annual — due 31st May',
    officialUrl: 'https://foscos.fssai.gov.in',
    scoreWeight: 4,
    applicableSectors: ['Food', 'Agriculture', 'Beverage', 'Restaurant', 'Catering', 'FMCG'],
    applicableStages: ['just-started', '1-2-years', '2-plus'],
    documents: ['FSSAI license number', 'Details of food products — quantity manufactured/sold', 'Turnover for the year'],
    steps: [
      'Log in to foscos.fssai.gov.in with your license credentials',
      'Navigate to Annual Return → Form D1',
      'Enter product category-wise production and sales data',
      'Submit before 31st May for the preceding financial year',
    ],
    calendar: { label: 'FSSAI Annual Return (Form D1)', dayOfMonth: 31, month: 5, frequency: 'annual' },
    penalty: '₹500–₹5,000 penalty per day for delay.',
  },

  {
    id: 'factory-license',
    name: 'Factory License',
    shortName: 'Factory License',
    category: 'license',
    priority: 'critical',
    description: 'Mandatory under the Factories Act 1948 for any premises where manufacturing is done by 10 or more workers (with power) or 20 or more workers (without power). Covers worker safety, working hours, and conditions.',
    why: 'Operating a factory without a license is a cognizable offence. State labour inspectors conduct surprise checks. Industrial buyers, banks, and export certification bodies all ask for the factory license.',
    cost: '₹2,000 – ₹50,000 (varies by state, machinery horsepower, and worker count)',
    timeline: '15–45 days',
    officialUrl: 'https://labour.gov.in',
    scoreWeight: 9,
    applicableSectors: ['Manufacturing', 'Consumer Goods', 'Fashion', 'Textile', 'Chemical', 'Pharmaceutical', 'Auto'],
    applicableStages: ['just-started', '1-2-years', '2-plus'],
    documents: ['Site plan and layout of factory', 'Proof of ownership/lease of premises', 'List of machinery and their horsepower', 'Employee details', 'Occupier declaration', 'Certificate of stability (for building)'],
    steps: [
      'Check if your establishment qualifies under the Factories Act',
      'Apply through your State Labour Department portal',
      'Submit factory layout plan, machinery list, and safety plans',
      'Inspector visits for physical verification',
      'License issued — display prominently at premises',
      'Renew annually — typically before December 31 for the following year',
    ],
    calendar: { label: 'Factory License renewal', dayOfMonth: 31, month: 12, frequency: 'annual' },
    penalty: 'Up to 2 years imprisonment and ₹1 lakh fine for operating without license.',
  },

  {
    id: 'pollution-noc',
    name: 'Pollution Control NOC (Consent to Operate)',
    shortName: 'Pollution NOC',
    category: 'license',
    priority: 'high',
    description: 'State Pollution Control Board\'s "Consent to Operate" (CTO) required for any business that generates industrial effluent, air emissions, or solid waste. Essential for manufacturing, dyeing, chemical processing, and food processing businesses.',
    why: 'Without Consent to Operate, your factory license application is incomplete. Banks hesitate to fund manufacturing businesses without it. Export certification bodies (BIS, EIC) require it. NGT courts have shut down units operating without it.',
    cost: '₹500 – ₹50,000 (depends on industry category — Green/Orange/Red)',
    timeline: '30–90 days',
    officialUrl: 'https://cpcb.nic.in',
    scoreWeight: 6,
    applicableSectors: ['Manufacturing', 'Chemical', 'Textile', 'Dyeing', 'Food Processing', 'Pharmaceutical'],
    applicableStages: ['just-started', '1-2-years', '2-plus'],
    documents: ['Site plan', 'Details of manufacturing process and raw materials', 'Effluent treatment plan', 'Air pollution control device details', 'Water consumption details'],
    steps: [
      'Classify your industry (Green / Orange / Red) using CPCB norms',
      'Apply to your State Pollution Control Board portal',
      'Submit Consent to Establish (CTE) first, then Consent to Operate (CTO)',
      'Board inspects the premises and pollution control systems',
      'Consent issued — valid 1–5 years based on category',
      'Renew before expiry',
    ],
    calendar: { label: 'Pollution NOC renewal', frequency: 'annual', note: 'Validity varies — Red category: 1 year, Orange: 2 years, Green: 5 years' },
    penalty: 'Up to 5 years imprisonment, unlimited fines, and forced closure under Environment Protection Act.',
  },

  // ── IP ──────────────────────────────────────────────────────────

  {
    id: 'trademark',
    name: 'Trademark Registration',
    shortName: 'Trademark',
    category: 'ip',
    priority: 'medium',
    description: 'Legal protection for your brand name, logo, and tagline. Once registered, you have exclusive rights to the mark and can take legal action against counterfeiters. Registration is valid for 10 years, renewable indefinitely.',
    why: 'Copycats are fastest to hit growing D2C brands and food businesses. Without a trademark, you can\'t stop someone from using your brand name. Platforms like Amazon Brand Registry also require trademark registration before brand protection tools are unlocked.',
    cost: '₹4,500 (govt fees for small businesses/startups) / ₹9,000 (others), per class',
    timeline: '12–24 months for full registration (TM-R acknowledgment in 1–2 days)',
    officialUrl: 'https://ipindia.gov.in',
    scoreWeight: 5,
    applicableSectors: [],
    applicableStages: [],
    documents: ['Identity proof of applicant', 'Business registration certificate', 'Logo/wordmark in JPEG (high resolution)', 'User affidavit (if mark already in use)', 'Power of attorney (if filing through agent)'],
    steps: [
      'Search for existing trademarks on ipindia.gov.in to avoid conflict',
      'Determine the correct class(es) for your products/services (45 classes)',
      'Apply on IP India portal or through a trademark agent',
      'Pay government filing fee (₹4,500 for proprietors/startups)',
      'Receive TM number and acknowledgment — you can use ™ symbol immediately',
      'Respond to any objections from examiner (if raised)',
      'Trademark published in Trademark Journal — 4-month opposition period',
      'Certificate of registration issued after 12–24 months',
    ],
  },

  {
    id: 'copyright',
    name: 'Copyright Registration',
    shortName: 'Copyright',
    category: 'ip',
    priority: 'low',
    description: 'Protection for original creative works — software code, content, designs, books, music, photographs. Copyright exists automatically in India, but registration provides legal proof in disputes and is required for some international filings.',
    why: 'If you create original content, code, or creative works, copyright registration gives you a dated certificate that is strong evidence in court. Software companies and content businesses benefit most.',
    cost: '₹500 – ₹5,000 per work',
    timeline: '3–6 months',
    officialUrl: 'https://copyright.gov.in',
    scoreWeight: 2,
    applicableSectors: ['Technology', 'Media', 'Education', 'Design', 'Publishing', 'Software'],
    applicableStages: [],
    documents: ['Identity proof', 'Copy of the work to be registered', 'No objection certificate if work has multiple authors', 'Power of attorney (if filing through agent)'],
    steps: [
      'Log in to copyright.gov.in',
      'Fill application and select category of work (literary, artistic, software, etc.)',
      'Upload the work or a representative sample',
      'Pay fees (₹500–₹5,000 depending on category)',
      'Mandatory 30-day waiting period for objections',
      'Registration certificate issued if no objection',
    ],
  },

  // ── TRADE ───────────────────────────────────────────────────────

  {
    id: 'iec',
    name: 'Import Export Code (IEC)',
    shortName: 'IEC',
    category: 'trade',
    priority: 'high',
    description: 'A 10-digit code issued by DGFT that is mandatory for any business that imports goods into India or exports goods out of India. Without IEC, customs clearance is impossible. There is no annual filing required — it\'s a lifetime code.',
    why: 'Even if you\'re primarily domestic, sourcing raw materials or components from abroad requires IEC. D2C brands sourcing leather, fabric, or electronics from China/Bangladesh need it. Exporters lose IGST refund claims without it.',
    cost: '₹500 (government fee)',
    timeline: '3–5 working days (online, often same day)',
    officialUrl: 'https://dgft.gov.in',
    scoreWeight: 7,
    applicableSectors: ['Export', 'Import', 'Manufacturing', 'Fashion', 'Leather', 'Textile', 'Electronics'],
    applicableStages: [],
    documents: ['PAN card of applicant', 'Bank certificate or cancelled cheque', 'Aadhaar / passport / voter ID', 'Business address proof', 'GST registration certificate'],
    steps: [
      'Register on dgft.gov.in and create an account',
      'Go to Services → IEC → Apply for IEC',
      'Fill the online form (PAN, business details, bank details)',
      'Upload documents (scan quality matters — clarity is checked)',
      'Pay ₹500 via netbanking',
      'IEC issued within same day to 5 working days',
      'Download IEC certificate — lifetime validity, no renewal',
    ],
  },

  // ── HR ──────────────────────────────────────────────────────────

  {
    id: 'epf',
    name: 'EPF Registration (Employee Provident Fund)',
    shortName: 'EPF',
    category: 'hr',
    priority: 'high',
    description: 'Mandatory for establishments with 20 or more employees. Both employer and employee contribute 12% of basic salary each to the EPF. Employees get retirement corpus; employer contributions are a business expense.',
    why: 'Quality talent increasingly checks PF compliance before joining. Labour courts take non-compliance seriously — arrears are demanded with 18% interest. Establishments that grow past 20 employees must register within 30 days or face penalties.',
    cost: '12% of basic salary (employer contribution — recurring)',
    timeline: '5–10 days for registration',
    officialUrl: 'https://www.epfindia.gov.in',
    scoreWeight: 5,
    applicableSectors: [],
    applicableStages: ['1-2-years', '2-plus'],
    documents: ['PAN card of company', 'Cancelled cheque', 'List of all employees with salary details', 'Proprietor/directors Aadhaar and PAN', 'Incorporation certificate'],
    steps: [
      'Register on EPFO unified portal (unifiedportal-emp.epfindia.gov.in)',
      'Fill registration form with business details and employee details',
      'Upload supporting documents',
      'EPFO may call for inspection',
      'PF code allotted — generate UAN for each employee',
      'Deposit EPF monthly by the 15th of each month',
      'File ECR (Electronic Challan cum Return) monthly on EPFO portal',
    ],
    calendar: { label: 'EPF monthly deposit + ECR filing', dayOfMonth: 15, frequency: 'monthly', note: 'Deposit by 15th — ECR filing deadline is also 15th' },
    penalty: '18% p.a. interest on delayed deposits + ₹5,000 minimum damages. Criminal prosecution for wilful default.',
  },

  {
    id: 'esi',
    name: 'ESI Registration (Employee State Insurance)',
    shortName: 'ESI',
    category: 'hr',
    priority: 'high',
    description: 'Mandatory for establishments with 10 or more employees earning up to ₹21,000/month. Employee contributes 0.75% of wages; employer contributes 3.25%. Employees get medical, disability, maternity, and pension benefits.',
    why: 'ESI provides employees with free medical care at ESIC hospitals. Non-compliance exposes you to the same penalties as EPF — arrears with interest, plus reputational damage. HR departments flag ESI compliance when hiring.',
    cost: 'Employer: 3.25% of wages; Employee: 0.75% (deducted from salary)',
    timeline: '5–10 days for registration',
    officialUrl: 'https://www.esic.gov.in',
    scoreWeight: 5,
    applicableSectors: [],
    applicableStages: ['1-2-years', '2-plus'],
    documents: ['PAN card', 'GST registration', 'List of employees with wages', 'Employer bank details', 'Incorporation certificate'],
    steps: [
      'Register on esic.gov.in → Employer Login → New Employer Registration',
      'Fill employer details, employee details, and wage information',
      'Get ESIC Employer Code',
      'Generate employee IP numbers and issue ESI cards',
      'Deduct 0.75% from each eligible employee\'s salary',
      'Deposit contributions by the 15th of each month',
      'File half-yearly contribution statement',
    ],
    calendar: { label: 'ESI monthly deposit', dayOfMonth: 15, frequency: 'monthly', note: 'Half-yearly return in April and October' },
    penalty: '12% p.a. interest on delayed deposits + ₹5,000 minimum fine. Criminal prosecution for repeated defaults.',
  },

  // ── CORPORATE ───────────────────────────────────────────────────

  {
    id: 'roc-annual',
    name: 'ROC Annual Return (MGT-7 / Form 11)',
    shortName: 'ROC Return',
    category: 'corporate',
    priority: 'critical',
    description: 'Annual filing with the Registrar of Companies (MCA) summarising shareholding structure, director details, and registered office. Pvt Ltd / OPC file MGT-7A; LLPs file Form 11. Due within 60 days of AGM (by November 29 for companies with March 31 year-end).',
    why: 'Failure to file ROC annual return for 3 consecutive years leads to company strike-off. DIN (Director Identification Number) becomes deactivated, preventing directors from joining any other company. This is the most consequential compliance for registered entities.',
    cost: '₹0 – ₹1,000 govt fees + ₹3,000–₹15,000 CA fees',
    timeline: 'Annual',
    officialUrl: 'https://www.mca.gov.in',
    scoreWeight: 7,
    applicableSectors: [],
    applicableStages: ['just-started', '1-2-years', '2-plus'],
    documents: ['List of shareholders and share holdings', 'Director details and DINs', 'Registered office address proof', 'Details of any changes in the year (new directors, share allotment, etc.)'],
    steps: [
      'Conduct Annual General Meeting (AGM) by September 30',
      'Prepare MGT-7A (Pvt Ltd/OPC) or Form 11 (LLP)',
      'Have it certified by a Practicing Company Secretary (CS)',
      'File on mca.gov.in before November 29',
      'Pay government fees (based on paid-up capital)',
      'File AOC-4 (financial statements) simultaneously',
    ],
    calendar: { label: 'ROC Annual Return (MGT-7A)', dayOfMonth: 29, month: 11, frequency: 'annual', note: 'LLP Form 11 is due by May 30' },
    penalty: '₹100 per day for delay (no cap). Disqualification of all directors from all companies for 5 years if non-filed for 3 consecutive years.',
  },

  {
    id: 'dir3-kyc',
    name: 'Director KYC (DIR-3 KYC)',
    shortName: 'DIR-3 KYC',
    category: 'corporate',
    priority: 'high',
    description: 'Annual KYC filing required for all directors who have a DIN (Director Identification Number). Must be filed between April 1 and September 30 each year. A simple web form with Aadhaar and PAN verification.',
    why: 'Missing DIR-3 KYC deactivates your DIN immediately. A deactivated DIN means you cannot sign any company documents, file returns, or be a director in any company until you pay the penalty and refile. It blocks all company compliance downstream.',
    cost: '₹0 (within deadline) / ₹5,000 penalty + fees if filed after September 30',
    timeline: 'Annual — April 1 to September 30',
    officialUrl: 'https://www.mca.gov.in',
    scoreWeight: 3,
    applicableSectors: [],
    applicableStages: ['just-started', '1-2-years', '2-plus'],
    documents: ['DIN number', 'PAN card', 'Aadhaar card', 'Mobile number linked to Aadhaar', 'Personal email address'],
    steps: [
      'Log in to MCA portal (mca.gov.in) with director credentials',
      'Navigate to MCA Services → e-Filing → Company Forms → DIR-3 KYC',
      'Fill in details and verify with Aadhaar OTP',
      'Submit the form before September 30',
      'Save the acknowledgment number',
    ],
    calendar: { label: 'Director KYC (DIR-3)', dayOfMonth: 30, month: 9, frequency: 'annual', note: 'File between April 1 and September 30 — zero fee if filed on time' },
    penalty: '₹5,000 penalty for late filing + DIN deactivation until paid.',
  },

  {
    id: 'statutory-audit',
    name: 'Statutory Audit',
    shortName: 'Statutory Audit',
    category: 'corporate',
    priority: 'critical',
    description: 'Mandatory independent audit of financial statements for all Private Limited Companies and OPCs, regardless of turnover. LLPs with turnover above ₹40 lakh or capital above ₹25 lakh also require audit. The auditor must be a Chartered Accountant.',
    why: 'Without a statutory audit, you cannot file AOC-4 (financial statements with MCA). This triggers ROC non-compliance, which cascades into director disqualification. Banks also require audited financials for loans above ₹50 lakh.',
    cost: '₹15,000 – ₹1,00,000 (varies by company size and CA fees)',
    timeline: 'Annual — must complete before AGM (September 30)',
    officialUrl: 'https://www.mca.gov.in',
    scoreWeight: 6,
    applicableSectors: [],
    applicableStages: ['just-started', '1-2-years', '2-plus'],
    documents: ['Books of accounts (Tally / QuickBooks / Zoho)', 'Bank statements', 'GST returns', 'TDS returns', 'Asset register', 'Loan and liability schedules', 'Board meeting minutes'],
    steps: [
      'Appoint a statutory auditor at first AGM or within 30 days of incorporation',
      'Maintain proper books of accounts throughout the year',
      'Submit all financial records to the auditor by June',
      'Auditor conducts audit and prepares audit report',
      'Board approves financial statements',
      'File AOC-4 (financial statements) and MGT-7A (annual return) with MCA',
    ],
    calendar: { label: 'Statutory Audit completion', dayOfMonth: 30, month: 9, frequency: 'annual', note: 'Audit must complete before AGM — September 30 deadline for companies' },
    penalty: 'Fine up to ₹25,000 for failure to get accounts audited. ROC default leads to director disqualification.',
  },

  {
    id: 'professional-tax',
    name: 'Professional Tax Registration',
    shortName: 'Professional Tax',
    category: 'tax',
    priority: 'medium',
    description: 'State-level tax on professionals and salaried employees. Applicable in Maharashtra, Karnataka, Tamil Nadu, Andhra Pradesh, West Bengal, Telangana, Gujarat, and others. Employer must register and deduct PT from employee salaries.',
    why: 'PT non-compliance attracts penalties from state labour departments during inspections. In Maharashtra, PT applies to all entities with even one employee. The amounts are small (max ₹2,500/year per employee) but the compliance is checked during Shop Act inspections.',
    cost: '₹0 – ₹2,500 per employee per year (state-specific slabs)',
    timeline: '3–7 days for registration',
    officialUrl: 'https://mahagst.gov.in',
    scoreWeight: 3,
    applicableSectors: [],
    applicableStages: [],
    documents: ['PAN card', 'Incorporation certificate', 'Employee list with salary details', 'Bank account details'],
    steps: [
      'Check if your state levies Professional Tax',
      'Register as employer on state PT portal',
      'Deduct PT from employee salaries per state slabs',
      'Deposit PT monthly or quarterly per state rules',
      'File annual PT return',
    ],
    calendar: { label: 'Professional Tax deposit', frequency: 'monthly', dayOfMonth: 30, note: 'Monthly in most states; quarterly in some. Annual return typically March 31.' },
    penalty: 'Varies by state — typically ₹1,000–₹5,000 per quarter for delayed filing + penalty on unpaid amount.',
  },

]

// ── HELPER FUNCTIONS ─────────────────────────────────────────────

export const CATEGORY_LABELS: Record<ComplianceCategory, string> = {
  foundation: 'Foundation',
  tax: 'Tax & Filings',
  license: 'Licenses & Permits',
  ip: 'Intellectual Property',
  trade: 'Import & Export',
  hr: 'Employment',
  corporate: 'Corporate Governance',
}

export const PRIORITY_LABELS: Record<CompliancePriority, string> = {
  critical: 'Critical',
  high: 'Important',
  medium: 'Recommended',
  low: 'Optional',
}

export function filterCompliance(
  items: ComplianceItem[],
  profile: { sector: string; stage: string }
): ComplianceItem[] {
  return items.filter(item => {
    if (item.applicableStages.length > 0 && !item.applicableStages.includes(profile.stage)) return false
    if (item.applicableSectors.length > 0) {
      const matches = item.applicableSectors.some(s =>
        profile.sector.toLowerCase().includes(s.toLowerCase())
      )
      if (!matches) return false
    }
    return true
  })
}

export function calculateHealthScore(
  applicable: ComplianceItem[],
  completedIds: string[]
): { score: number; completed: number; total: number; byCategory: Record<string, { completed: number; total: number }> } {
  const totalWeight = applicable.reduce((s, i) => s + i.scoreWeight, 0)
  const completedWeight = applicable
    .filter(i => completedIds.includes(i.id))
    .reduce((s, i) => s + i.scoreWeight, 0)

  const score = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0

  const byCategory: Record<string, { completed: number; total: number }> = {}
  for (const item of applicable) {
    if (!byCategory[item.category]) byCategory[item.category] = { completed: 0, total: 0 }
    byCategory[item.category].total++
    if (completedIds.includes(item.id)) byCategory[item.category].completed++
  }

  return { score, completed: completedIds.filter(id => applicable.some(i => i.id === id)).length, total: applicable.length, byCategory }
}

export function getUpcomingDeadlines(
  applicable: ComplianceItem[],
  fromDate = new Date()
): { item: ComplianceItem; date: Date; label: string }[] {
  const results: { item: ComplianceItem; date: Date; label: string }[] = []
  const today = fromDate

  for (const item of applicable) {
    const cal = item.calendar
    if (!cal) continue

    if (cal.frequency === 'monthly' && cal.dayOfMonth) {
      // Next 2 monthly occurrences
      for (let m = 0; m < 2; m++) {
        const d = new Date(today.getFullYear(), today.getMonth() + m, cal.dayOfMonth)
        if (d >= today) results.push({ item, date: d, label: cal.label })
      }
    } else if (cal.frequency === 'quarterly' && cal.months && cal.dayOfMonth) {
      for (const month of cal.months) {
        const year = month < today.getMonth() + 1 ? today.getFullYear() + 1 : today.getFullYear()
        const d = new Date(year, month - 1, cal.dayOfMonth)
        if (d >= today) results.push({ item, date: d, label: cal.label })
      }
    } else if (cal.frequency === 'annual' && cal.month && cal.dayOfMonth) {
      let year = today.getFullYear()
      const d = new Date(year, cal.month - 1, cal.dayOfMonth)
      if (d < today) year++
      results.push({ item, date: new Date(year, cal.month - 1, cal.dayOfMonth), label: cal.label })
    }
  }

  return results.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 20)
}
