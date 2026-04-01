export interface Scheme {
  id: string
  name: string
  shortName: string
  ministry: string
  category: 'startup' | 'msme' | 'credit' | 'women' | 'sc-st' | 'sector' | 'state' | 'skill'
  benefitType: 'financial' | 'tax' | 'recognition' | 'credit' | 'training' | 'subsidy'
  benefitHeadline: string
  benefitEstimate: string        // human readable
  benefitValue: number           // for sorting (in INR)
  description: string
  eligibility: {
    stages?: string[]            // pre-launch | just-started | 1-2-years | 2-plus
    founderTypes?: string[]      // general | women | sc-st | ex-serviceman
    sectors?: string[]           // specific sectors, empty = all
    states?: string[]            // specific states, empty = all India
    capitalMin?: string          // minimum capital range
    registrationRequired?: boolean
    maxTurnoverCrore?: number
  }
  applicationSteps: string[]
  officialUrl: string
  deadline: string               // 'rolling' | 'annual' | specific date
  processingTime: string
  tags: string[]
}

export const SCHEMES: Scheme[] = [
  // ── STARTUP & RECOGNITION ─────────────────────────────────────
  {
    id: 'startup-india-dpiit',
    name: 'Startup India — DPIIT Recognition',
    shortName: 'DPIIT Recognition',
    ministry: 'DPIIT, Ministry of Commerce',
    category: 'startup',
    benefitType: 'recognition',
    benefitHeadline: 'Tax exemption + 80% off patents',
    benefitEstimate: '₹2L–10L+ in savings over 3 years',
    benefitValue: 500000,
    description: 'Government recognition that unlocks a bundle of benefits — 3-year income tax exemption, 80% rebate on patent fees, angel tax exemption, self-certification for labour/environment laws, and faster company closure.',
    eligibility: {
      stages: ['pre-launch', 'just-started', '1-2-years', '2-plus'],
      registrationRequired: true,
      maxTurnoverCrore: 100,
    },
    applicationSteps: [
      'Register on startupindia.gov.in',
      'Fill in company details and upload incorporation certificate',
      'Write a brief description of innovation/scalability',
      'Submit — approval takes 2–10 working days',
      'Download your DPIIT recognition certificate',
    ],
    officialUrl: 'https://www.startupindia.gov.in/content/sih/en/regsiter.html',
    deadline: 'rolling',
    processingTime: '2–10 working days',
    tags: ['Tax exemption', 'Patent rebate', 'Angel tax', 'Self-certification'],
  },
  {
    id: 'udyam-msme',
    name: 'Udyam Registration (MSME)',
    shortName: 'Udyam / MSME',
    ministry: 'Ministry of MSME',
    category: 'msme',
    benefitType: 'recognition',
    benefitHeadline: 'Free access to 3,000+ government schemes',
    benefitEstimate: 'Unlocks ₹10L+ in potential benefits',
    benefitValue: 400000,
    description: 'Completely free registration that classifies you as a Micro/Small/Medium Enterprise. Unlocks collateral-free loans, government tender preference, interest subsidies, ISO certification reimbursement, and protection against delayed payments.',
    eligibility: {
      stages: ['pre-launch', 'just-started', '1-2-years', '2-plus'],
      registrationRequired: false,
    },
    applicationSteps: [
      'Visit udyamregistration.gov.in',
      'Enter Aadhaar number of proprietor/director',
      'Fill in business details (NIC code, turnover, investment)',
      'Submit — certificate generated instantly',
      'Download Udyam Registration Certificate',
    ],
    officialUrl: 'https://udyamregistration.gov.in',
    deadline: 'rolling',
    processingTime: 'Instant',
    tags: ['Free', 'Collateral-free loans', 'Tender preference', 'Interest subsidy'],
  },
  {
    id: 'startup-india-seed-fund',
    name: 'Startup India Seed Fund Scheme',
    shortName: 'SISFS',
    ministry: 'DPIIT, Ministry of Commerce',
    category: 'startup',
    benefitType: 'financial',
    benefitHeadline: 'Up to ₹50L in seed funding',
    benefitEstimate: '₹20L–₹50L grant/loan',
    benefitValue: 5000000,
    description: 'Seed funding for startups to validate proof of concept, prototype development, and market entry. Disbursed through DPIIT-recognised incubators.',
    eligibility: {
      stages: ['pre-launch', 'just-started', '1-2-years'],
      registrationRequired: true,
      maxTurnoverCrore: 10,
    },
    applicationSteps: [
      'Get DPIIT recognition first',
      'Find an approved incubator on startupindia.gov.in',
      'Apply through the incubator with your pitch deck',
      'Incubator evaluates and disburses funds',
      'Submit milestone reports quarterly',
    ],
    officialUrl: 'https://www.startupindia.gov.in/content/sih/en/sisfs.html',
    deadline: 'rolling',
    processingTime: '30–90 days',
    tags: ['Seed funding', 'Grant', 'Incubator', 'POC stage'],
  },
  {
    id: 'cgss-credit-guarantee',
    name: 'Credit Guarantee Scheme for Startups (CGSS)',
    shortName: 'CGSS',
    ministry: 'DPIIT / NCGTC',
    category: 'credit',
    benefitType: 'credit',
    benefitHeadline: 'Collateral-free loans up to ₹20 crore',
    benefitEstimate: 'Up to ₹20 crore guaranteed loan',
    benefitValue: 20000000,
    description: 'Government provides credit guarantee of up to 85% on loans up to ₹10 crore and 75% on amounts up to ₹20 crore — letting startups access institutional credit without collateral.',
    eligibility: {
      stages: ['just-started', '1-2-years', '2-plus'],
      registrationRequired: true,
    },
    applicationSteps: [
      'Get DPIIT recognition',
      'Approach any scheduled commercial bank or NBFC',
      'Apply for term loan — bank applies for CGSS cover',
      'NCGTC issues guarantee certificate',
      'Loan disbursed — no collateral required',
    ],
    officialUrl: 'https://www.ncgtc.in/cgss',
    deadline: 'rolling',
    processingTime: '15–30 days',
    tags: ['No collateral', 'Loan guarantee', 'Up to ₹20 crore', 'DPIIT required'],
  },

  // ── CREDIT & LOANS ────────────────────────────────────────────
  {
    id: 'mudra-shishu',
    name: 'PM Mudra Yojana — Shishu',
    shortName: 'Mudra Shishu',
    ministry: 'Ministry of Finance / MUDRA',
    category: 'credit',
    benefitType: 'credit',
    benefitHeadline: 'Collateral-free loan up to ₹50,000',
    benefitEstimate: 'Up to ₹50,000 at low interest',
    benefitValue: 50000,
    description: 'For very early-stage micro businesses. No collateral required. Available from banks, MFIs, and NBFCs. Ideal for buying equipment, stock, or working capital.',
    eligibility: {
      stages: ['pre-launch', 'just-started'],
      registrationRequired: false,
      capitalMin: 'Under ₹1 lakh',
    },
    applicationSteps: [
      'Visit any PSU bank, MFI, or NBFC branch',
      'Fill Mudra loan application form',
      'Submit KYC documents + business plan (simple)',
      'Bank processes and disburses loan',
      'Repay in EMIs (1–5 years)',
    ],
    officialUrl: 'https://www.mudra.org.in',
    deadline: 'rolling',
    processingTime: '7–15 days',
    tags: ['No collateral', 'Micro business', 'Working capital', '₹50K'],
  },
  {
    id: 'mudra-kishore',
    name: 'PM Mudra Yojana — Kishore',
    shortName: 'Mudra Kishore',
    ministry: 'Ministry of Finance / MUDRA',
    category: 'credit',
    benefitType: 'credit',
    benefitHeadline: 'Collateral-free loan ₹50K – ₹5L',
    benefitEstimate: '₹50,000 – ₹5 lakh at low interest',
    benefitValue: 500000,
    description: 'For growing micro businesses that need more capital. No collateral. Covers machinery, equipment, expansion, and working capital needs.',
    eligibility: {
      stages: ['just-started', '1-2-years'],
      registrationRequired: false,
    },
    applicationSteps: [
      'Visit any PSU bank, RRB, or MFI',
      'Submit Mudra Kishore application',
      'KYC + last 6 months bank statement + basic business proof',
      'Loan sanctioned and disbursed',
    ],
    officialUrl: 'https://www.mudra.org.in',
    deadline: 'rolling',
    processingTime: '10–21 days',
    tags: ['No collateral', '₹5 lakh', 'Expansion', 'Working capital'],
  },
  {
    id: 'mudra-tarun',
    name: 'PM Mudra Yojana — Tarun',
    shortName: 'Mudra Tarun',
    ministry: 'Ministry of Finance / MUDRA',
    category: 'credit',
    benefitType: 'credit',
    benefitHeadline: 'Collateral-free loan ₹5L – ₹10L',
    benefitEstimate: 'Up to ₹10 lakh at low interest',
    benefitValue: 1000000,
    description: 'For established small businesses looking to scale. Covers capital expenditure, machinery, and expansion. No collateral required.',
    eligibility: {
      stages: ['1-2-years', '2-plus'],
      registrationRequired: false,
    },
    applicationSteps: [
      'Apply at any scheduled commercial bank',
      'Submit 2 years ITR, bank statements, business proof',
      'Collateral-free — MUDRA guarantee covers the bank',
      'Disbursed in 15–30 days after approval',
    ],
    officialUrl: 'https://www.mudra.org.in',
    deadline: 'rolling',
    processingTime: '15–30 days',
    tags: ['No collateral', '₹10 lakh', 'Scale-up', 'Machinery'],
  },
  {
    id: 'cgtmse',
    name: 'CGTMSE — Credit Guarantee for MSMEs',
    shortName: 'CGTMSE',
    ministry: 'Ministry of MSME / SIDBI',
    category: 'credit',
    benefitType: 'credit',
    benefitHeadline: 'Collateral-free loans up to ₹2 crore',
    benefitEstimate: 'Up to ₹2 crore without collateral',
    benefitValue: 20000000,
    description: 'Trust-backed credit guarantee for MSMEs. Banks are covered for 75–85% of the loan amount, allowing them to lend without collateral. Requires Udyam registration.',
    eligibility: {
      stages: ['just-started', '1-2-years', '2-plus'],
      registrationRequired: true,
    },
    applicationSteps: [
      'Get Udyam registration first',
      'Apply for term loan at any member lending institution',
      'Bank files for CGTMSE cover',
      'Guarantee certificate issued',
      'No personal assets pledged',
    ],
    officialUrl: 'https://www.cgtmse.in',
    deadline: 'rolling',
    processingTime: '15–30 days',
    tags: ['MSME', 'No collateral', '₹2 crore', 'Bank loan'],
  },

  // ── WOMEN-SPECIFIC ────────────────────────────────────────────
  {
    id: 'stand-up-india',
    name: 'Stand-Up India',
    shortName: 'Stand-Up India',
    ministry: 'Ministry of Finance / SIDBI',
    category: 'women',
    benefitType: 'credit',
    benefitHeadline: 'Loan ₹10L–₹1 crore for women & SC/ST',
    benefitEstimate: '₹10 lakh to ₹1 crore loan',
    benefitValue: 10000000,
    description: 'Promotes entrepreneurship among women and SC/ST communities. Each bank branch must extend at least one loan each to a woman entrepreneur and an SC/ST entrepreneur. Covers greenfield enterprises.',
    eligibility: {
      stages: ['pre-launch', 'just-started', '1-2-years'],
      founderTypes: ['women', 'sc-st'],
    },
    applicationSteps: [
      'Visit standupmitra.in portal',
      'Register and fill application',
      'Submit business plan, KYC, and project report',
      'Bank evaluates — CGTMSE covers collateral',
      'Loan disbursed in 30–45 days',
    ],
    officialUrl: 'https://www.standupmitra.in',
    deadline: 'rolling',
    processingTime: '30–45 days',
    tags: ['Women', 'SC/ST', '₹1 crore', 'Greenfield'],
  },
  {
    id: 'wep-niti',
    name: 'Women Entrepreneurship Platform (WEP)',
    shortName: 'WEP — NITI Aayog',
    ministry: 'NITI Aayog',
    category: 'women',
    benefitType: 'recognition',
    benefitHeadline: 'Mentorship, funding access & networking',
    benefitEstimate: 'Access to ₹500Cr+ funding pool',
    benefitValue: 200000,
    description: 'NITI Aayog\'s digital hub connecting women entrepreneurs with mentors, investors, incubators, and government schemes. Free to join, gives access to curated opportunities.',
    eligibility: {
      stages: ['pre-launch', 'just-started', '1-2-years', '2-plus'],
      founderTypes: ['women'],
    },
    applicationSteps: [
      'Register on wep.gov.in',
      'Create your entrepreneur profile',
      'Access curated schemes, mentors, and investors',
      'Apply for programs of interest',
    ],
    officialUrl: 'https://wep.gov.in',
    deadline: 'rolling',
    processingTime: 'Instant',
    tags: ['Women', 'Mentorship', 'Investor access', 'Free'],
  },
  {
    id: 'mahila-udyam-nidhi',
    name: 'Mahila Udyam Nidhi Scheme',
    shortName: 'Mahila Udyam Nidhi',
    ministry: 'Ministry of MSME / Punjab National Bank',
    category: 'women',
    benefitType: 'financial',
    benefitHeadline: 'Soft loan up to ₹10 lakh for women',
    benefitEstimate: 'Up to ₹10 lakh at subsidised rate',
    benefitValue: 1000000,
    description: 'Soft loan for women entrepreneurs setting up new small businesses. Covers capital for equipment, machinery, and working capital. Repayment period up to 10 years.',
    eligibility: {
      stages: ['pre-launch', 'just-started'],
      founderTypes: ['women'],
    },
    applicationSteps: [
      'Approach Punjab National Bank or SBI',
      'Submit business project report',
      'KYC + address proof + qualification proof',
      'Bank evaluates and sanctions loan',
      'Disbursed in tranches based on project milestones',
    ],
    officialUrl: 'https://msme.gov.in/schemes',
    deadline: 'rolling',
    processingTime: '30–60 days',
    tags: ['Women', 'Soft loan', '₹10 lakh', '10-year repayment'],
  },

  // ── SECTOR-SPECIFIC ──────────────────────────────────────────
  {
    id: 'pm-vishwakarma',
    name: 'PM Vishwakarma Scheme',
    shortName: 'PM Vishwakarma',
    ministry: 'Ministry of MSME',
    category: 'skill',
    benefitType: 'financial',
    benefitHeadline: '₹3L loan + ₹15K toolkit + skill training',
    benefitEstimate: '₹3 lakh + ₹15,000 + ₹500/day stipend',
    benefitValue: 315000,
    description: 'Covers 18 traditional trades (carpenter, blacksmith, goldsmith, tailor, mason, potter, etc.). Provides ₹15,000 toolkit voucher, skill training with ₹500/day stipend, and soft loan up to ₹3 lakh at 5% interest.',
    eligibility: {
      stages: ['pre-launch', 'just-started', '1-2-years', '2-plus'],
      sectors: ['Manufacturing', 'Consumer Goods', 'Fashion & Apparel'],
    },
    applicationSteps: [
      'Visit pmvishwakarma.gov.in',
      'Register with Aadhaar + mobile OTP',
      'Verify trade at Common Service Centre (CSC)',
      'Get skill training at PMK centre',
      'Apply for toolkit voucher and loan component',
    ],
    officialUrl: 'https://pmvishwakarma.gov.in',
    deadline: 'rolling',
    processingTime: '15–30 days after training',
    tags: ['Artisan', 'Traditional trades', 'Toolkit', 'Skill training'],
  },
  {
    id: 'atal-incubation',
    name: 'Atal Innovation Mission — Incubation',
    shortName: 'AIM Incubation',
    ministry: 'NITI Aayog',
    category: 'startup',
    benefitType: 'financial',
    benefitHeadline: 'Up to ₹10 crore + incubation support',
    benefitEstimate: 'Up to ₹10 crore grant for incubators',
    benefitValue: 3000000,
    description: 'AIM supports startups through 72 Atal Incubation Centers. Benefits include incubation space, mentoring, funding facilitation, prototyping labs, and market access — all through approved AICs.',
    eligibility: {
      stages: ['pre-launch', 'just-started', '1-2-years'],
      registrationRequired: false,
    },
    applicationSteps: [
      'Find your nearest AIC at aim.gov.in',
      'Apply to the AIC with your business plan',
      'Clear their selection process (varies by AIC)',
      'Join incubation program (6–24 months)',
      'Access funding, mentors, and lab facilities',
    ],
    officialUrl: 'https://aim.gov.in',
    deadline: 'rolling',
    processingTime: '30–60 days (per AIC)',
    tags: ['Incubation', 'Mentorship', 'Lab access', 'Innovation'],
  },
  {
    id: 'nirf-agri-startup',
    name: 'Agri-Startup India Fund',
    shortName: 'Agri Startup Fund',
    ministry: 'Ministry of Agriculture',
    category: 'sector',
    benefitType: 'financial',
    benefitHeadline: 'Up to ₹25 lakh for agri-startups',
    benefitEstimate: 'Up to ₹25 lakh equity-free',
    benefitValue: 2500000,
    description: 'Provides equity-free seed funding to agri and food-tech startups. Also includes mentorship, market linkages, and access to ICAR research facilities.',
    eligibility: {
      stages: ['pre-launch', 'just-started', '1-2-years'],
      sectors: ['Agriculture & Food'],
    },
    applicationSteps: [
      'Apply at agristartup.dac.gov.in',
      'Submit innovation details and business plan',
      'Shortlisting by Ministry panel',
      'Mentorship phase + milestone validation',
      'Funding disbursement in tranches',
    ],
    officialUrl: 'https://agristartup.dac.gov.in',
    deadline: 'annual',
    processingTime: '60–90 days',
    tags: ['Agriculture', 'Food tech', 'Equity-free', '₹25 lakh'],
  },
  {
    id: 'startup-india-fund-of-funds',
    name: 'Startup India Fund of Funds (FFS)',
    shortName: 'Fund of Funds',
    ministry: 'DPIIT / SIDBI',
    category: 'startup',
    benefitType: 'financial',
    benefitHeadline: '₹10,000 crore corpus for VC-backed startups',
    benefitEstimate: 'Indirect VC funding access',
    benefitValue: 1000000,
    description: 'SIDBI manages a ₹10,000 crore Fund of Funds that invests in SEBI-registered AIFs (VC funds), which in turn invest in DPIIT-recognized startups. Access through VC funds, not directly.',
    eligibility: {
      stages: ['just-started', '1-2-years', '2-plus'],
      registrationRequired: true,
    },
    applicationSteps: [
      'Get DPIIT recognition',
      'Connect with SEBI-registered AIFs on sidbi.in',
      'Pitch to AIF fund managers',
      'Due diligence by AIF',
      'Investment made by AIF (SIDBI backs them)',
    ],
    officialUrl: 'https://www.sidbi.in/en/startup',
    deadline: 'rolling',
    processingTime: '60–180 days',
    tags: ['VC funding', 'SIDBI', 'Scale-up', 'DPIIT required'],
  },

  // ── STATE SCHEMES ─────────────────────────────────────────────
  {
    id: 'kerala-ksum',
    name: 'Kerala Startup Mission (KSUM)',
    shortName: 'KSUM',
    ministry: 'Government of Kerala',
    category: 'state',
    benefitType: 'financial',
    benefitHeadline: 'Grants, incubation & global networking',
    benefitEstimate: 'Up to ₹10 lakh grants + incubation',
    benefitValue: 1000000,
    description: 'Kerala\'s nodal agency for startup ecosystem. Provides co-working space, prototype funding up to ₹10L, mentorship, and facilitation for international markets.',
    eligibility: {
      stages: ['pre-launch', 'just-started', '1-2-years'],
      states: ['Kerala'],
    },
    applicationSteps: [
      'Register on startupmission.in',
      'Apply for incubation or funding program',
      'Present to KSUM panel',
      'Selected startups get space + funding',
    ],
    officialUrl: 'https://startupmission.in',
    deadline: 'rolling',
    processingTime: '30–60 days',
    tags: ['Kerala', 'Incubation', 'International', 'Grant'],
  },
  {
    id: 'karnataka-elevate',
    name: 'Karnataka ELEVATE Program',
    shortName: 'ELEVATE Karnataka',
    ministry: 'Government of Karnataka',
    category: 'state',
    benefitType: 'financial',
    benefitHeadline: 'Grants up to ₹50 lakh + mentoring',
    benefitEstimate: 'Up to ₹50 lakh grant',
    benefitValue: 5000000,
    description: 'Karnataka\'s flagship startup grant program offering up to ₹50 lakh in equity-free funding along with mentoring, market access, and investor connects.',
    eligibility: {
      stages: ['pre-launch', 'just-started', '1-2-years'],
      states: ['Karnataka'],
    },
    applicationSteps: [
      'Visit elevate.karnataka.gov.in',
      'Submit innovation pitch with team details',
      'Shortlisting + Demo Day presentation',
      'Grant disbursement in milestones',
    ],
    officialUrl: 'https://elevate.karnataka.gov.in',
    deadline: 'annual',
    processingTime: '60–90 days',
    tags: ['Karnataka', 'Equity-free', '₹50 lakh', 'Demo Day'],
  },
  {
    id: 'maharashtra-startup',
    name: 'Maharashtra Startup Yatra',
    shortName: 'Maharashtra Startup',
    ministry: 'Government of Maharashtra',
    category: 'state',
    benefitType: 'recognition',
    benefitHeadline: 'Startup recognition + incentives',
    benefitEstimate: '₹5L–₹25L based on stage',
    benefitValue: 1000000,
    description: 'Maharashtra\'s startup policy offers financial incentives, SGST reimbursement, and stamp duty exemption for recognized startups in the state.',
    eligibility: {
      stages: ['pre-launch', 'just-started', '1-2-years'],
      states: ['Maharashtra'],
    },
    applicationSteps: [
      'Apply on mahaonline.gov.in',
      'Submit DPIIT certificate + Maharashtra address proof',
      'State review process',
      'Receive state recognition certificate + benefits',
    ],
    officialUrl: 'https://mahaonline.gov.in',
    deadline: 'rolling',
    processingTime: '30–45 days',
    tags: ['Maharashtra', 'GST reimbursement', 'Stamp duty', 'Recognition'],
  },

  // ── SC/ST ──────────────────────────────────────────────────────
  {
    id: 'venture-capital-sc-st',
    name: 'Venture Capital Fund for SC/ST',
    shortName: 'VC Fund SC/ST',
    ministry: 'Ministry of Social Justice / NSFDC',
    category: 'sc-st',
    benefitType: 'financial',
    benefitHeadline: 'Concessional loans for SC/ST entrepreneurs',
    benefitEstimate: 'Up to ₹15 lakh at 2% interest',
    benefitValue: 1500000,
    description: 'NSFDC provides concessional finance to SC/ST entrepreneurs at 2% per annum interest through State Channelising Agencies. Covers manufacturing, service, and trading businesses.',
    eligibility: {
      stages: ['pre-launch', 'just-started', '1-2-years'],
      founderTypes: ['sc-st'],
    },
    applicationSteps: [
      'Contact your State Channelising Agency (SCA)',
      'Submit project report + caste certificate',
      'SCA forwards to NSFDC',
      'Loan sanctioned at 2% p.a.',
      'Repayment over 5–10 years',
    ],
    officialUrl: 'https://www.nsfdc.nic.in',
    deadline: 'rolling',
    processingTime: '30–60 days',
    tags: ['SC/ST', '2% interest', 'Concessional', 'NSFDC'],
  },
]

// Matching engine
export function matchSchemes(profile: {
  stage: string
  founder_type: string
  sector: string
  state: string
  initial_capital: string
}): Scheme[] {
  return SCHEMES.filter(scheme => {
    const e = scheme.eligibility

    // Stage check
    if (e.stages && e.stages.length > 0) {
      if (!e.stages.includes(profile.stage)) return false
    }

    // Founder type check
    if (e.founderTypes && e.founderTypes.length > 0) {
      if (!e.founderTypes.includes(profile.founder_type)) return false
    }

    // Sector check
    if (e.sectors && e.sectors.length > 0) {
      if (!e.sectors.includes(profile.sector)) return false
    }

    // State check
    if (e.states && e.states.length > 0) {
      if (!e.states.includes(profile.state)) return false
    }

    return true
  }).sort((a, b) => b.benefitValue - a.benefitValue)
}

export const CATEGORY_LABELS: Record<string, string> = {
  startup: 'Startup',
  msme: 'MSME',
  credit: 'Credit & Loans',
  women: 'Women',
  'sc-st': 'SC/ST',
  sector: 'Sector-specific',
  state: 'State scheme',
  skill: 'Skill & Trade',
}

export const BENEFIT_TYPE_LABELS: Record<string, string> = {
  financial: 'Grant / Fund',
  tax: 'Tax benefit',
  recognition: 'Recognition',
  credit: 'Loan / Credit',
  training: 'Training',
  subsidy: 'Subsidy',
}
