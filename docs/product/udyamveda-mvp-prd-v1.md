# Udyam Veda — MVP PRD v1

Oct 25, 2026 · @Ashish Mishra

## 1. Summary

The MVP is a mobile-first discovery tool: a first-time founder answers 8–15 adaptive questions about their business, then gets (a) the registrations and licences they actually need, in order, (b) the schemes they qualify for **now**, sorted into four honest buckets with a realistic rupee figure, and (c) a readiness score with a document checklist. It covers 5 industry packs on one shared core, for Central schemes plus Maharashtra, Uttar Pradesh and Bihar.

**Eight decisions this PRD makes**

1. **Common core + industry packs.** Most of a founder's journey (entity, PAN, bank account, Udyam, GST test, local trade licence, Mudra/CGTMSE, the state self-employment scheme) is the same for every industry. Packs add only what differs: licences, the ministry scheme, and pack-specific questions.
2. **Five MVP packs:** Food processing and home food; Livestock and fisheries; Agri enterprise and value addition; Small manufacturing, artisans and textiles; Local services and retail. Tech startups get a thin "lite" path only, because they are already the best-served segment.
3. **States: Maharashtra, Uttar Pradesh, Bihar.** Maharashtra is the home market; UP and Bihar are the largest Tier 2/3 founder pools, and each has one flagship scheme (CMEGP, CM-YUVA, Mukhyamantri Udyami Yojana) with a different mechanic: subsidy, interest-free loan, lottery.
4. **Onboarding asks business questions, not welfare questions.** The questions are generated from a *fact dictionary*: every question exists because at least one rule needs its answer. This is the biggest gap in both myScheme and the current repo.
5. **Status beats breadth.** Every record shows *Open / Closed / Pending renewal / Unknown* with a "last checked" date. 2026 is a renewal year (PMEGP, PMFME, AHIDF have uncertain status), so freshness is the product's core promise.
6. **Honest amounts.** The founder sees one realistic figure after stacking rules and own contribution, never a sum of every scheme's maximum.
7. **Rules engine decides; LLM only explains.** No eligibility verdict comes from an LLM.
8. **Reuse the repo's rules engine, catalog schema and evidence model. Cut the publication bureaucracy and GTM features for the MVP.** Today the repo has 174 researched records and **0 published**. A single-reviewer gate with 1,218 pending checks is unlikely to clear at side-project pace.

**What changes vs the current repo:** new fact dictionary + adaptive onboarding, a stacking/relationship table, a closed-window bucket, a readiness module, three state packs, a lighter review gate (one reviewer, a 6-point checklist per record), and two bug fixes in matching logic (Section 6).

## 2. Problem, users and scope

A first-time founder in a Tier 2/3 town cannot answer three questions without paying an agent or a CA: *which registrations do I need, which schemes can I get right now, and am I ready to apply?* The information exists, but it is split across 50+ ministries, departments and state portals, and much of it is stale.

**Evidence we already have** (see the Product Document's research tabs):

- myScheme's quiz is built for welfare; it asks no business questions. Its chatbot said SISFS is open "on an ongoing basis" after it closed on 31 May 2026, and that SISFS and GENESIS can both be taken "because they are different ministries".
- YouTube comment research: founders pay for free registrations, get stuck when premises belong to a family member, and when Aadhaar is linked to someone else's phone.
- Registration volume is not the gap: Udyam + Udyam Assist crossed about 8.9 crore. The gap is what happens after: credit, schemes, readiness.

### Primary users

| Persona | Example | What they need first |
| --- | --- | --- |
| Home / micro food maker | Sunita, pickles from home, Nagpur | FSSAI basic registration, whether GST applies, PMFME |
| Livestock / fish farmer turning business | Rakesh, 2 ponds + 500 birds, Gaya (Bihar) | Which subsidy (NLM / PMMSY / state), bank loan route, land papers |
| Artisan / small manufacturer | Imran, furniture workshop, Saharanpur (UP) | Udyam, PM Vishwakarma vs PMEGP vs CM-YUVA, pollution consent if needed |
| Local service / retail | Pooja, beauty parlour, Pune | Shop Act, Mudra, CMEGP service limit |
| Agri value-add / FPO member | Ganesh, dal mill / cold storage, Latur | AIF, PMFME/PMKSY, FPO route |

Secondary: CSC operators and "helper" relatives who fill forms on the founder's behalf. They use the same tool on the founder's phone.

### In scope (MVP)

- Adaptive onboarding in Hindi, Marathi and English
- Registration and licence roadmap for the five packs
- Scheme results in four buckets with honest amounts and stacking notes
- Readiness score + document checklist (what you have, what is missing, how to get it)
- Central schemes + Maharashtra, UP, Bihar flagship schemes (about 45 records)
- Shareable result page (WhatsApp link) and a printable checklist

### Out of scope (MVP)

- Filing applications on the founder's behalf, storing Aadhaar/PAN numbers, OTP handling
- Marketplace, AI business planning, assisted filing via representatives (long-term vision; Section 16)
- All 28 states, PLI and large-industry schemes (shipbuilding, semiconductor, pharma PLI)
- GTM tools already in the repo (plays, campaigns, drawing board)

## 3. Industry segmentation (government view)

The taxonomy follows how the government itself is organised: **NIC 2008 codes** (what Udyam asks for) mapped to **the ministry or department that runs the schemes** and **the regulator that issues the licence**. A founder never sees NIC codes; they pick plain-language activities ("I sell pickles", "I keep goats") and the system maps them. MoSPI released NIC 2025 in November 2025; the Udyam portal still needs checking for when it switches, so every activity stores both codes once NIC 2025 mapping is available.

### A. Agriculture and allied (NIC Section A + agro-processing)

| Segment | Subsegments (MVP activities) | NIC 2008 | Lead ministry / department | Licence / regulator | Main central support |
| --- | --- | --- | --- | --- | --- |
| Dairy | Milk production, dairy farm, milk collection / chilling | 0141, 1050 | Dept of Animal Husbandry & Dairying (DAHD) | FSSAI (if processing/selling packaged), local body | NPDD, AHIDF (status to verify), Mudra, KCC for AH |
| Poultry | Broiler, layer, rural backyard breeds, hatchery | 0146 | DAHD | Gram panchayat / local NOC; state pollution board check for larger farms | NLM entrepreneurship (50% capital subsidy, up to ₹25 lakh), AHIDF |
| Small ruminants and piggery | Goat / sheep breeding, piggery | 0144, 0145 | DAHD | Local NOC | NLM (up to ₹50 lakh goat/sheep, ₹30 lakh piggery) |
| Fisheries and aquaculture | Pond culture, biofloc / RAS, fish seed hatchery, ornamental fish, fish kiosk / retail | 0321, 0322, 1020, 4721 | Dept of Fisheries (DoF) | State fisheries dept (pond lease, seed licence); Coastal Aquaculture Authority for coastal farms | PMMSY, PM-MKSSY, KCC, FIDF |
| Crop and horticulture enterprise | Nursery, mushroom, protected cultivation, organic produce | 0111–0130 | Dept of Agriculture & Farmers Welfare (DA&FW) | Seed / nursery licence (state agri dept) | MIDH, RKVY-RAFTAAR agripreneur, PM-KUSUM (MNRE) |
| Agri services and infrastructure | Custom hiring centre, cold storage, warehouse, sorting/grading | 0161, 0163, 5210 | DA&FW, WDRA | WDRA registration (warehouse), FSSAI if storing food | Agriculture Infrastructure Fund (AIF), SMAM |
| Beekeeping, sericulture, bamboo | Apiary, honey processing, silk rearing, bamboo plantation / products | 0149, 1629 | DA&FW (NBHM, National Bamboo Mission), Ministry of Textiles (Central Silk Board) | FSSAI for honey | NBHM, NBM, Silk Samagra |
| Producer collectives | FPO, cooperative, SHG enterprise | (entity form, not activity) | DA&FW, Ministry of Cooperation, MoRD (DAY-NRLM) | Registrar of Companies / Cooperatives | 10,000 FPO scheme, credit guarantee for FPOs, SVEP |

### B. Manufacturing (NIC Section C)

| Segment | Subsegments (MVP activities) | NIC 2008 | Lead ministry / department | Licence / regulator | Main central support |
| --- | --- | --- | --- | --- | --- |
| Food processing | Pickles, papad, spices, bakery, flour / dal mill, snacks, fruit pulp, ghee / paneer, oil expeller | 103–107 | Ministry of Food Processing Industries (MoFPI) | FSSAI (basic up to ₹1.5 crore turnover from 1 Apr 2026), Legal Metrology for packaged goods | PMFME (extension status to verify), PMKSY, PMEGP |
| Beverages | Packaged water, juices, cold-press | 1104, 1079 | MoFPI | FSSAI + BIS (packaged water) | PMFME |
| Animal feed | Cattle / poultry / fish feed | 1080 | DAHD, MoFPI | FSSAI not needed for feed; BIS for some feeds | AHIDF, PMEGP |
| Textiles and apparel | Tailoring unit, garment, handloom, embroidery, block printing | 13, 14 | Ministry of Textiles (DC Handloom, DC Handicrafts) | Shop / factory registration; GST | PM Vishwakarma (tailors), NHDP, Samarth (skilling), PMEGP |
| Artisan and craft | Pottery, carpentry, blacksmith, cane / bamboo, jewellery, leather crafts | 16, 23, 25, 32 | Ministry of MSME (PM Vishwakarma), Ministry of Textiles (handicrafts) | Artisan card (handicrafts) | PM Vishwakarma, SFURTI (clusters), PMEGP |
| Khadi and village industries | Agro-based, mineral-based, forest-based village units | many | KVIC / state KVIB (MSME) | — | PMEGP (rural), KGVY components |
| Personal care and AYUSH | Soap, detergent, herbal cosmetics, Ayurvedic products | 2023, 2100 | MoHFW (CDSCO), Ministry of AYUSH | Cosmetics manufacturing licence (state), AYUSH manufacturing licence | PMEGP, state schemes |
| Light engineering | Fabrication, welding, auto parts, electrical assembly, printing, packaging, plastic products | 22, 25, 27, 28, 18 | Ministry of MSME, DPIIT | State Pollution Control Board consent (category-based), BIS where QCOs apply, factory licence above thresholds | CGTMSE, PMEGP, ZED, MSME Champions |
| Building materials | Bricks, fly-ash bricks, concrete blocks | 2392, 2395 | MSME, MoEFCC (for consent) | SPCB consent, mining / clay permits | PMEGP |

### C. Services and trade (NIC Sections F–S)

| Segment | Subsegments (MVP activities) | NIC 2008 | Lead ministry / department | Licence / regulator | Main central support |
| --- | --- | --- | --- | --- | --- |
| Retail and trading | Kirana, general store, wholesale, online seller | 46, 47 | DPIIT (trade), MSME (Udyam allows trading for priority-sector credit) | Shop & Establishment (state labour dept), local trade licence, FSSAI if food | Mudra, PM SVANidhi (street vendors, MoHUA) |
| Food service | Dhaba, café, tiffin service, cloud kitchen, catering | 5610–5629 | MoFPI (no scheme focus), MoHUA (vendors) | FSSAI, Shop Act, local health / trade licence, fire NOC above size thresholds | Mudra, state schemes (CMEGP service, CM-YUVA) |
| Personal services | Beauty parlour, salon, tailoring shop, laundry | 9601, 9602 | Ministry of MSME | Shop Act, trade licence | PM Vishwakarma (barbers, washermen, tailors), Mudra |
| Repair services | Mobile, electrical, two-wheeler, AC repair | 4520, 9512, 9522 | Ministry of MSME, MSDE (skills) | Shop Act | Mudra, PMEGP (service limit), PMKVY training |
| Transport and logistics | Goods carrier, e-rickshaw / EV goods, courier, warehouse | 49, 52, 53 | MoRTH (permits), MHI (EV) | RTO permit, commercial vehicle registration | Mudra, CMEGP (EV goods transport) |
| Tourism and hospitality | Homestay, guesthouse, travel agency, tour operator | 55, 79 | Ministry of Tourism, state tourism dept | State homestay registration, NIDHI registration | State homestay schemes |
| Health, education, care | Clinic, diagnostic lab, coaching, daycare | 85, 86, 88 | MoHFW, Ministry of Education | Clinical Establishments registration (state), local licences | Mudra, Stand-Up India |
| Digital and professional services | Web/IT services, design, CA/consulting, digital marketing | 62, 63, 69–74 | MeitY, DPIIT (startups) | Professional tax (state), GST, LUT for exports | DPIIT recognition, GENESIS, Startup India Credit Guarantee |
| Construction and contracting | Civil contractor, interior, electrical contractor | 41–43 | MoHUA, state PWD | Contractor registration (state PWD), electrical contractor licence | Mudra, CGTMSE |

Cross-cutting groups apply on top of any segment: women, SC/ST, OBC/EBC, minority, ex-servicemen, persons with disability, age bands. These change subsidy rates (e.g. CMEGP 25–35% vs 15–25%), not which segment someone belongs to.

## 4. MVP industry packs

Five packs are enough to cover most Tier 2/3 first-time founders while keeping the catalog small enough for one person to keep fresh. A pack is a bundle of: activity list (plain language → NIC), pack questions, licence rules, pack schemes, and pack documents.

| # | Pack | Segments from Section 3 | Why it is in the MVP | Pack-specific complexity |
| --- | --- | --- | --- | --- |
| P1 | Food processing and home food | Food processing, beverages, food service (FSSAI side) | Highest founder interest; PMFME is the clearest grant route; FSSAI rules just changed (₹1.5 crore basic) | FSSAI tier, packaged-goods labelling, home kitchen premises |
| P2 | Livestock and fisheries | Dairy, poultry, goat/sheep, piggery, fisheries | Your fish/poultry example; large rural pool; generous capital subsidies (NLM 50%, PMMSY) but complex routes via state agencies | Land/pond ownership or lease, training certificate, unit size thresholds, SC/ST/women rate differences |
| P3 | Agri enterprise and value addition | Crop enterprise, agri services, beekeeping/bamboo, FPOs | AIF and FPO routes; covers the bamboo founder who has produce but no buyer | Land records, FPO membership, collective entity forms |
| P4 | Small manufacturing, artisans and textiles | Textiles, artisan/craft, KVI, light engineering, building materials, personal care | PMEGP / CMEGP / CM-YUVA / Vishwakarma overlap is exactly where founders get confused | Trade-based eligibility (Vishwakarma's 18 trades), pollution category, project report |
| P5 | Local services and retail | Retail, personal services, repair, transport, homestay, small food service | Largest count of enterprises; mostly needs Shop Act + Mudra + state scheme service limit | Rent agreements, Shop Act thresholds by state, trading not eligible for most subsidies |
| Lite | Tech and digital startups | Digital services | Already served by Startup India; keep only DPIIT test, GENESIS, credit guarantee, 80-IAC entity test | Closed SISFS window must show clearly |

**Pack selection rule:** a founder can belong to two packs (e.g. poultry + fish integrated farm). The engine merges both packs' questions and de-duplicates facts; the roadmap shows one combined order.

**What stays out of packs:** PLI, shipbuilding, semiconductor, pharma and defence records already in the repo. They stay in the database but are hidden unless the founder's entity type and project size qualify.

## 5. User journeys

Every founder walks the same ten-stage spine; packs only change what happens inside stages 3, 6 and 8. The order matters because each stage produces a document the next one needs (for example, a proprietor's current account usually needs Udyam, GST or Shop Act proof).

### 5.1 Common core journey

| Stage | What the founder does | Output document | Most common blocker (from research) |
| --- | --- | --- | --- |
| 0. Self-check | Picks activity, place, rough budget, own money available | Profile | Thinks schemes fund 100%; most need 5–10% own contribution |
| 1. Identity readiness | Aadhaar linked to own mobile, PAN, personal bank account; caste / residence certificate if claiming a category | Aadhaar, PAN, certificates | Aadhaar OTP goes to someone else's phone; caste certificate takes weeks |
| 2. Entity form | Proprietorship by default; partnership/LLP/Pvt Ltd only if a scheme or partner needs it | Entity decision | Pays an agent for a Pvt Ltd that a home business does not need |
| 3. Premises | Own, rented, or family-owned; rural or urban; home or shop | Ownership proof, rent agreement or consent/NOC letter | Premises in a parent's or spouse's name |
| 4. Udyam | Free registration on udyamregistration.gov.in (Udyam Assist if no PAN/GST) | Udyam certificate | Paying ₹500–2,000 to agents; wrong NIC code |
| 5. Local registration | Shop & Establishment intimation/registration, local trade licence, gram panchayat NOC | Shop Act / trade licence | Not knowing the threshold below which only intimation is needed |
| 6. Pack licences | FSSAI, pollution consent, fisheries licence, etc. (pack decides) | Licences | Picking the wrong FSSAI tier |
| 7. GST test | Threshold check, inter-state sales, e-commerce | GSTIN or a "not required" note | Registering early and then missing monthly returns |
| 8. Funding route | Own contribution → best-fit scheme (state, central, pack) → project report → bank | Project report, sanction letter | Bank delay, collateral demand, closed windows |
| 9. After sanction | Training (EDP), utilisation proof, compliance calendar | Training certificate, UC | Subsidy held because training or UC is pending |

### 5.2 P1 — Food: Sunita, home pickles, Nagpur (Maharashtra)

1. Activity "pickles from home" → NIC 1079 → Pack P1. Turnover estimate ₹6 lakh.
2. Premises: home owned by husband → needs a consent letter + his ownership proof.
3. Udyam (free) → FSSAI **basic registration** (turnover under ₹1.5 crore) → Shop Act intimation only if she opens a shop.
4. GST: not required below ₹40 lakh for intra-state goods; required from ₹0 if she sells goods to buyers in other states, online or offline; selling through e-commerce only within Maharashtra below the threshold is exempt since 1 Oct 2023. The tool asks "Will you sell outside Maharashtra?" and "Will you sell on Amazon/Meesho?"
5. Funding: PMFME (35% credit-linked subsidy, up to ₹10 lakh) shown as **pending renewal** until MoFPI confirms extension; CMEGP agro/service limit ₹10 lakh with 25–35% subsidy for women; Mudra as fallback. Engine picks one, because CMEGP and PMFME subsidy on the same project are treated as exclusive until a source says otherwise.
6. Documents: Aadhaar, PAN, photo, consent letter, kitchen photos, product list, bank statement, quotation for machines.

### 5.3 P2 — Livestock and fish: Rakesh, 500 birds + 2 ponds, Gaya (Bihar)

1. Activities poultry (0146) + pond fish (0322) → Pack P2, both sub-flows merged.
2. **Honest result:** NLM poultry supports breeding units of at least 1,000 parent layers, so a 500-bird broiler shed is *not* eligible. The tool says this plainly instead of showing ₹25 lakh.
3. Fish: PMMSY beneficiary subsidy (40% general, 60% SC/ST/women) via the state fisheries department; status to verify for 2026–27. Needs pond ownership or a registered lease.
4. State: Bihar Mukhyamantri Udyami Yojana (₹5 lakh grant + ₹5 lakh interest-free loan, lottery-based) — 2026 window ran 15 Feb–23 Mar, so it goes to **Window closed, next cycle** with an alert.
5. Credit: KCC for animal husbandry and fisheries; Mudra.
6. Documents: land/pond records (khatauni / lease), Aadhaar, PAN, caste certificate if claiming 60%, training certificate, bank account, project estimate.

### 5.4 P3 — Agri enterprise: Ganesh, farmer group wants a cold store, Latur (Maharashtra)

1. Activity cold storage (5210) → Pack P3; entity question: individual, FPO or cooperative.
2. AIF: loans up to ₹2 crore with 3% interest subvention and credit guarantee; works for individuals, FPOs and agri-entrepreneurs.
3. Stacking note: AIF interest subvention can sit on top of some capital subsidies; the engine shows the relationship stored for that pair, or "not confirmed".
4. Licences: FSSAI if storing food for others, WDRA if he wants negotiable warehouse receipts, local building permission.
5. Documents: 7/12 extract, FPO registration (if applicable), DPR, quotations.

### 5.5 P4 — Artisan / manufacturing: Imran, wood carving workshop, Saharanpur (UP)

1. Activity woodwork (1629) → Pack P4. Trade = carpenter → PM Vishwakarma candidate.
2. Three routes compared on one screen: **PM Vishwakarma** (₹1 lakh + ₹2 lakh at 5% concessional interest, toolkit voucher, training), **CM-YUVA** (up to ₹5 lakh interest-free, 10% margin money, age 21–40), **PMEGP** (up to ₹50 lakh, pending renewal). CM-YUVA excludes people availing other loan-subsidy schemes, so the engine marks it exclusive with PMEGP.
3. UP ODOP: Saharanpur's ODOP product is woodcraft, so ODOP schemes are surfaced as a state add-on.
4. Pollution: wood workshops are usually low category; tool asks about machines and polishing chemicals before saying "no consent needed".
5. Documents: Aadhaar, PAN, artisan card (optional), workshop proof, quotations, training certificate.

### 5.6 P5 — Local service: Pooja, beauty parlour, Pune (Maharashtra)

1. Activity beauty parlour (9602) → Pack P5.
2. Shop Act: under 10 workers in Maharashtra → intimation, not full registration (verify on the Aaple Sarkar / labour portal at build time).
3. CMEGP service project limit ₹10 lakh, women get 25% urban subsidy with 5% own contribution; Mudra Kishore/Tarun as credit-only fallback.
4. GST: not required below ₹20 lakh services.
5. Documents: rent agreement, owner NOC, Aadhaar, PAN, education proof (if project above ₹10 lakh), quotations.

## 6. Existing product review (repo OxAsh11/UdyamVeda, last commit 18 Oct 2026)

The repo has strong foundations (a real rules engine, versioned catalog, source evidence) but **no founder can get a useful answer from it today**: 174 researched Central records, 0 published, and onboarding that collects 7 facts while the rules need 555 different facts.

### 6.1 What is built

| Area | What exists | Size / state | MVP verdict |
| --- | --- | --- | --- |
| Stack | Next.js (new version, `proxy.ts`), Supabase (Postgres + Auth + Storage), Inngest jobs, Firecrawl + OpenAI extraction, Vercel / Cloudflare builds | \~21,700 lines in `src`, 164 migrations, 113 seed files, 187 scripts | Keep stack |
| Catalog schema | `opportunities` → `opportunity_versions` → benefits, requirements, steps, sources, windows, `eligibility_rule_sets`; taxonomy tables | 174 records with sources and rules | **Keep** — this is the right shape |
| Evidence and review | source\_registry (974 rows), snapshots, change\_events, review\_tasks, 7 checks per record, authority assessments (103 IGOD ministries/depts), 13 review batches | 1,218 checks pending, 0 passed | **Simplify** — too heavy for one reviewer |
| Rules engine | `rules.ts`: all/any trees, 12 operators, unknown → missing fact, `fail_closed` option | Works; 2 logic bugs below | **Keep and fix** |
| Ranking | `recommendation-ranking.ts`: weighted score (eligibility 45%, relevance 15%, freshness 15%, urgency 10%, support fit 10%, benefit/effort 5%) | Works on published data only | Keep, retune |
| Onboarding | 1 screen: name, sector (18 options), stage, state, district, founder type, capital range | 7 facts | **Rebuild** (Section 7) |
| Registration journeys | Static guides for SPICe+, PAN/TAN, bank, Udyam, GST, DPIIT, IEC, FSSAI, EPFO/ESIC | All `actionable: false` | Reuse content inside the roadmap |
| Applications, document vault, concierge, notifications | Tables, routes and RLS exist | Not tested end-to-end | Park; vault returns in v2 |
| GTM features | Plays, campaigns, strategy, calendar, distribute, drawing board | Unrelated to discovery | **Hide** from MVP |
| Legacy static data | `schemes.ts` (36 records) | Dev-only, blocked from public | Delete later |

### 6.2 How the matching logic works today

1. Onboarding writes facts to `business_facts` (key/value, source=user).
2. `profileFromBusinessFacts` builds a profile; `factsFromProfile` adds aliases (industry = sector, udyam\_registered = has\_udyam).
3. Only opportunities with status active/upcoming **and** an approved version **and** reviewed rules are evaluated.
4. Each rule tree returns true / false / unknown, plus missing facts and blockers.
5. `statusFor` maps that to eligible / likely / possible / needs\_information / not\_eligible; ranking sorts the list.

### 6.3 Problems found (tested, not assumed)

| # | Problem | Evidence | Fix |
| --- | --- | --- | --- |
| 1 | **Fact gap:** rules use 555 distinct fact keys; onboarding fills 7, and only 3 of them (`sector`, `employees`, `has_udyam`) appear in any rule | grep over all seeds and migrations | Fact dictionary of \~60 canonical facts; rewrite rules to use them (Section 10.3) |
| 2 | **Label mismatch:** onboarding saves `"Agriculture & Food"`; rules expect `"food_processing"`. A food founder is marked *not eligible* for a food scheme | Ran `rules.ts` locally: result `not_eligible` | Store activity codes, never display labels |
| 3 | **Status bug:** if one hard rule fails but another fact is unknown, the result shows as *possible* instead of *not eligible*. A Bihar founder sees a Maharashtra-only scheme as "possible" | Ran `statusFor`: state=Bihar vs Maharashtra rule + missing age → `possible` | A false result with blockers is always `not_eligible`, whatever is missing |
| 4 | **No closed-window bucket:** urgency ignores past closing dates; a closed scheme can rank as "routine" | `urgencyFor` drops past dates and returns `unknown` | Window state is its own field; closed records go to bucket C |
| 5 | **No stacking model:** no table says which schemes combine or exclude each other (only free-text "exclusions") | No relationship table among the 45 tables | `scheme_relationship` table (Section 8.3) |
| 6 | **No amount calculation:** benefits are stored as min/max/percentage but nothing computes "you would get ₹X on your project" | No calculator in `src/lib` | Benefit calculator (Section 8.4) |
| 7 | **No state records:** state expansion was deferred; all 174 records are Central | Seeds contain only `verified_central_*` | MH/UP/Bihar packs (Section 11) |
| 8 | **Catalog is wide, not deep:** shipbuilding, semiconductor, pharma PLI, foreign film incentive researched; no NLM poultry flow, no Shop Act rules per state | Seed file list | Pack-first catalog |
| 9 | **Publication gate cannot clear:** 7 checks × 174 records + 103 authority assessments + 98% audit, one reviewer | `catalog-live-integration-2026-09-09.md` | One-person gate: 6 checks, publish in batches of 10 |

### 6.4 Verdict

Do not rewrite. By my estimate, more than half of the backend is reusable as is. The MVP work is: fact dictionary, new onboarding, two logic fixes, relationship + calculator, readiness module, \~45 pack-focused records published under a lighter gate, and hiding everything else behind a feature flag. Content quality in the seeds is high (e.g. FSSAI ₹1.5 crore threshold and SISFS status are already correct), so the problem is plumbing and scope, not research.

## 7. Onboarding redesign

Onboarding asks only questions whose answer changes a result. Target: a useful first result in **under 3 minutes and 8 questions**, refined by up to 7 more questions that appear only when a candidate scheme or licence depends on them.

### 7.1 Rules for every question

1. **Linked to a fact.** Each question writes one or more canonical facts (Section 10.3). A question with no rule using its fact is deleted.
2. **Asked when it matters.** Ask by *information gain*: after each answer, the engine counts how many candidate records each unanswered fact would decide, and asks the highest one next.
3. **Plain words, local language.** "Aapka kaam ghar se hoga ya dukaan se?" not "Premises type". Hindi, Marathi, English from day one; voice input later.
4. **Explain sensitive questions.** Social category, disability and income are asked only at the funding stage, with one line on why ("SC/ST/women get 35% instead of 25% under CMEGP") and a "prefer not to say" option.
5. **"Don't know" is a valid answer.** It keeps the record in *Blocked by one step* and turns into a task ("Check your land record on Bhulekh").
6. **No ID numbers stored.** We ask "Do you have a PAN?", never the PAN itself.

### 7.2 Flow

| Step | Screen | Questions | Result unlocked |
| --- | --- | --- | --- |
| 1 | What will you do? | Activity search with examples and icons ("achaar", "murgi palan", "silai") → 1–2 activities | Pack(s), NIC codes |
| 2 | Where? | State, district, rural or urban (village/town name helps decide) | State pack, rural subsidy rates, local body |
| 3 | Stage | Idea / setting up / already running (since when) | New-unit-only schemes filter |
| 4 | Size | Expected yearly sales band; project cost band; people working | FSSAI tier, GST test, scheme ceilings |
| 5 | Money | How much can you put yourself? Need a loan? | Own-contribution check, credit routes |
| 6 | Premises | Home / rented / own shop / family-owned / land or pond (own or lease) | Documents, NOC tasks, pack licences |
| 7 | What you already have | Aadhaar linked to your phone, PAN, bank account, Udyam, GST, FSSAI, training certificate | Readiness score, skips done steps |
| 8 | About you (funding stage) | Age, education level, gender, social category, ex-serviceman, disability — each optional with a reason shown | Category subsidy rates |
| 9+ | Pack follow-ups (only if needed) | P1: will you sell packaged / outside state / online? P2: number of birds or animals, pond area, breeding or rearing? P3: individual, FPO or cooperative? P4: your trade (carpenter, tailor…), machines used? P5: number of workers, vehicle? | Specific licence and scheme decisions |

Results appear after step 7 and sharpen with every later answer; the founder never hits a 20-field form.

### 7.3 How this beats myScheme

| Dimension | myScheme (tested Oct 2026) | Udyam Veda MVP |
| --- | --- | --- |
| Question focus | Welfare profile: occupation, income, caste early | Business: activity, place, size, money, premises |
| Category question | Asked upfront without reason | Asked at funding stage, with the rupee difference shown |
| Live status | Said SISFS open after it closed | Status + last-checked date on every record |
| Stacking | Said SISFS + GENESIS fine because different ministries | Stored relationships; unknown shown as "not confirmed" |
| Registrations | Not part of the flow | Ordered roadmap with documents |
| Readiness | None | Score + missing documents + how to get them |
| Honest amount | Lists scheme maximums | One realistic figure for your project |

## 8. Eligibility engine and results

The engine answers four things per record: *Do you qualify? Is it open? Can it combine with the others? How much would you really get?* The first is the existing rules engine (fixed); the other three are new.

### 8.1 Four result buckets

| Bucket | Rule | Founder sees |
| --- | --- | --- |
| A. Eligible now | Rules = true, window open or rolling, status active | Amount for their project, next step, documents |
| B. Blocked by one step | Rules = unknown or false only because of a fixable fact (no Udyam, no training certificate, premises proof missing) | "Get X first" + how long X takes |
| C. Window closed / pending renewal | Rules true or unknown, but window closed or status pending renewal | Last window dates, "Notify me" toggle |
| D. Not for you | Any hard rule false (state, age, activity, entity) | Collapsed list with one-line reason each |

**Fixable vs hard facts.** Each fact in the dictionary has `fixable: true/false`. Missing Udyam is fixable; being in Bihar for a Maharashtra scheme is not. This replaces today's likely/possible labels, which mixed both.

### 8.2 Engine order

1. Filter by pack + state + entity (cheap SQL filter).
2. Evaluate rule tree → true / false / unknown with blockers and missing facts.
3. Apply window and status → bucket.
4. Apply relationships → mark exclusive groups, pick best combination.
5. Run calculator on the chosen combination → one honest figure.
6. Rank inside each bucket: amount for this project, effort, time to money, freshness.

### 8.3 Stacking model

Every pair of records that a founder could see together gets a relationship, or is shown as "not confirmed".

| Relationship | Meaning | Example (to verify per pair) |
| --- | --- | --- |
| `stackable` | Can take both on the same project | AIF interest subvention + a capital subsidy where the guideline allows |
| `exclusive` | One or the other on the same project | CM-YUVA vs any other loan-subsidy scheme (stated in UP guidelines); PMEGP vs CMEGP on one unit |
| `sequential` | One must come before the other | Udyam before PMEGP disbursal; DPIIT recognition before startup schemes |
| `conditional` | Combine only within a cap | Total subsidy capped at a % of project cost |
| `unknown` | No source either way | Shown as "Not confirmed — ask the bank / DIC" |

Each relationship row stores the source URL and quote, like any other fact. The engine never infers "stackable" because two schemes belong to different ministries.

### 8.4 Honest amount calculator

Inputs: project cost band, own money, category, rural/urban, chosen scheme(s). Output: own contribution, subsidy/grant, loan, interest benefit — each a separate line, never added into one "benefit" number.

**Worked example (CMEGP, Pooja, beauty parlour, Pune urban, woman, project ₹8 lakh):**

| Line | Rule | Amount |
| --- | --- | --- |
| Own contribution | 5% (special category) | ₹40,000 |
| Subsidy (margin money) | 25% urban special category | ₹2,00,000 |
| Bank loan | balance | ₹5,60,000 |
| Shown headline | "You can get ₹2 lakh subsidy on an ₹8 lakh project if a bank sanctions ₹5.6 lakh" | — |

If a scheme is bucket C (pending renewal), its figure is shown greyed with "if the scheme is renewed on the same terms".

### 8.5 What the LLM does and does not do

- **Does:** rephrase the result in the founder's language, answer "why" using stored rule text and sources, draft a project-report outline from stored data, summarise a changed guideline for the reviewer.
- **Does not:** decide eligibility, invent amounts, say a window is open, or claim two schemes combine. Any answer without a stored source shows "I don't have a verified answer".

## 9. Readiness and documents check

Readiness answers "If I go to the bank or DIC tomorrow, what will stop me?" It is computed from the documents and facts that the founder's **chosen route** needs, not from a generic list, so two founders with the same documents can have different scores.

### 9.1 Score

Five categories, each scored 0–100 from the items the chosen route requires:

| Category | Example items | Weight |
| --- | --- | --- |
| Identity | Aadhaar linked to own mobile, PAN, photo, category / residence certificate if claimed | 20% |
| Business setup | Udyam, Shop Act / trade licence, pack licence (FSSAI etc.), GST if required | 25% |
| Premises | Ownership proof, rent agreement, family consent/NOC, land or pond record | 20% |
| Money | Own contribution ready, bank account with 6-month statement, quotations, project report | 25% |
| Skills | Training / EDP certificate, education proof where a scheme needs it | 10% |

Score = weighted share of required items marked *have*. A required item marked *don't know* counts as missing and becomes a task. The founder sees one number plus the top three missing items, never a wall of red.

### 9.2 Document master list (MVP)

Each document is a record with: who issues it, where (portal/office), typical time, official fee (often zero), and which facts it proves. The tool always says when an agent is not needed.

| Document | Issuer / where | Proves | Notes for founders |
| --- | --- | --- | --- |
| Aadhaar with own mobile | UIDAI, Aadhaar Seva Kendra | Identity, OTP access | Most Udyam/GST failures start here; update mobile first |
| PAN | Income Tax Dept (instant e-PAN with Aadhaar) | Tax identity | Needed for Udyam unless using Udyam Assist |
| Bank account + statement | Any bank | Money trail | Separate business account before applying |
| Udyam certificate | udyamregistration.gov.in | MSME status | Free; never pay for it |
| Caste / residence / income certificate | State e-district (Aaple Sarkar, e-Sathi UP, RTPS Bihar) | Category rates, state residence | Start early; can take weeks |
| Premises proof | Owner's property paper, rent agreement, consent letter | Place of business | Family-owned premises need a consent/NOC letter |
| Land / pond record | 7/12 (MH), khatauni (UP), jamabandi/khatiyan (Bihar) | Agri/livestock eligibility | Lease must be registered for some schemes |
| FSSAI registration/licence | foscos.fssai.gov.in | Food business | Basic up to ₹1.5 crore turnover |
| Shop & Establishment | State labour portal | Local business existence | Maharashtra: intimation below 10 workers |
| Quotations | Machine / material sellers | Project cost | 2–3 quotes, on letterhead with GSTIN |
| Project report | Founder (tool drafts an outline) | Viability | Banks reject vague reports; the tool fills the numbers from answers |
| Training / EDP certificate | KVIC/DIC/RSETI/scheme portal | Scheme condition | PMEGP and Bihar MUY release money only after training |

### 9.3 Output

- Readiness score with a short reason ("62% — missing premises NOC, quotations, project report")
- A checklist the founder can tick and share on WhatsApp
- For each missing item: where to get it, how long it usually takes, and whether it blocks bucket A or only slows it
- A printable one-page "bank visit pack" listing what to carry

## 10. System design

The system has two halves that meet only at the published catalog: an **offline research half** (strong model + one human reviewer keep records true) and an **online founder half** (deterministic engine + cheap LLM for explanations). The founder half never calls the strong model.

[embedded content: architecture · research half, shared catalog, founder half\]

Everything a founder sees comes from the shared catalog in the middle; the reviewer is the only way data enters it.

### 10.1 Components

| Component | Job | Built on | Status in repo |
| --- | --- | --- | --- |
| Activity mapper | Plain-language activity → NIC code(s) → pack(s) | Postgres table + trigram search; LLM fallback for free text, confirmed by founder | New |
| Onboarding service | Picks the next question by information gain; writes facts | Next.js route + `fact_definition` table | New (replaces current form) |
| Rules engine | Evaluates rule trees on facts | `rules.ts` | Exists, fix 2 bugs |
| Bucket + window service | Status and window → bucket A–D | New module | New |
| Relationship resolver | Exclusive groups, sequences, best combination | `scheme_relationship` table + small solver (≤ 10 candidates, brute force is fine) | New |
| Benefit calculator | Own / subsidy / loan lines for the chosen combination | `benefit_rate` rows per category × area | New |
| Roadmap builder | Orders registrations and licences by dependencies | `opportunity_steps.dependsOn` + `registration` records | Partly exists (static journeys) |
| Readiness service | Score + missing items for the chosen route | `requirement` + `document_definition` + founder answers | New |
| Explainer | Answers "why" in Hindi/Marathi/English from stored text only | Low-cost LLM with retrieval over the approved version | New (AI config exists) |
| Catalog ops | Crawl, diff, extract, review, publish | Firecrawl + Inngest + strong model + admin UI | Exists, simplify gate |
| Alerts | Window opens, scheme renewed, deadline in 14 days | Inngest cron + WhatsApp/email | Tables exist, delivery not built |

### 10.2 Data model

Reuse the catalog tables as they are. Add seven tables:

| Table | Key columns | Purpose |
| --- | --- | --- |
| `activity` | id, label\_en/hi/mr, synonyms\[\], nic2008\[\], nic2025\[\], pack\_ids\[\] | Activity search and mapping |
| `pack` | id, name, question\_ids\[\], default\_licences\[\] | Pack bundles |
| `fact_definition` | key, type (bool/enum/number/band/date), allowed\_values, fixable, sensitive, question\_id, label per language | The single list of facts rules may use |
| `question` | id, fact\_keys\[\], prompt per language, help\_text, answer\_options, ask\_stage, depends\_on | Onboarding questions |
| `scheme_relationship` | opportunity\_a, opportunity\_b, relation, cap\_rule, source\_url, quote, verified\_at | Stacking |
| `benefit_rate` | opportunity\_version\_id, category, area (rural/urban), project\_type, own\_pct, subsidy\_pct, cap\_inr, interest\_rate | Calculator inputs |
| `document_definition` | key, issuer, where\_url\_by\_state, typical\_days, proves\_fact\_keys\[\] | Readiness and checklist |

Add to existing tables: `opportunity_versions.status_state` (active / closed / pending\_renewal / unknown) and `last_checked_at` separate from `last_verified_at`; `business_facts.answer_state` (answered / dont\_know / declined).

### 10.3 Fact dictionary (first 30 of \~60)

| Fact key | Type | Fixable | Asked at | Used by |
| --- | --- | --- | --- | --- |
| `activity_codes` | list of activity ids | no | Step 1 | everything |
| `state`, `district`, `area_type` | enum | no | Step 2 | state schemes, rural rates |
| `stage` | enum: idea / setting\_up / running | no | Step 3 | new-unit-only schemes |
| `operating_since` | date | no | Step 3 | age-of-business rules |
| `annual_turnover_band` | band | no | Step 4 | FSSAI tier, GST, MSME class |
| `project_cost_inr` | band | no | Step 4 | ceilings, calculator |
| `workers_count` | number | no | Step 4 | Shop Act, ESIC/EPF |
| `own_contribution_inr` | band | yes | Step 5 | own-share check |
| `needs_loan` | bool | no | Step 5 | credit routes |
| `premises_type` | enum | no | Step 6 | documents, licences |
| `premises_owner` | enum: self / family / landlord | no | Step 6 | NOC task |
| `land_or_pond_status` | enum: owned / registered\_lease / informal / none | yes | Step 6 (P2, P3) | NLM, PMMSY, AIF |
| `entity_type` | enum | yes | Step 7 | entity-limited schemes |
| `has_pan`, `aadhaar_mobile_linked`, `has_bank_account` | bool | yes | Step 7 | readiness, Udyam |
| `udyam_registered`, `gst_registered`, `fssai_status` | bool / enum | yes | Step 7 | sequences |
| `training_certificate` | bool | yes | Step 7 | PMEGP, Bihar MUY, NLM |
| `applicant_age_years` | number | no | Step 8 | CMEGP 18–45, CM-YUVA 21–40, MUY 18–50 |
| `education_level` | enum | yes (slow) | Step 8 | PMEGP, CMEGP, MUY 10+2 |
| `gender` | enum | no | Step 8 | women rates |
| `social_category` | enum incl. prefer\_not | no | Step 8 | SC/ST/OBC/EBC rates |
| `ex_serviceman`, `disability` | bool | no | Step 8 | special category |
| `sells_interstate`, `sells_online` | bool | no | P1 / P5 | GST test |
| `animal_count`, `unit_type` | number / enum | no | P2 | NLM thresholds |
| `artisan_trade` | enum (18 Vishwakarma trades + other) | no | P4 | PM Vishwakarma |
| `prior_scheme_benefit` | bool + which | no | Step 8 | exclusions (CM-YUVA, PMEGP) |

Migration task: map each of the 555 existing rule fields to one of these keys or mark it `reviewer_only` (a check the reviewer does, not the founder). Rules on `reviewer_only` facts never block a founder result; they appear as "the bank/DIC will check X".

### 10.4 Data freshness pipeline

1. **Weekly crawl** of each record's primary source (repo already captures snapshots + hashes).
2. **Diff → strong model** summarises what changed (amount, window, eligibility, status) and proposes a field-level edit.
3. **Reviewer** accepts/rejects in the admin UI; one click publishes a new version.
4. **Status sweep** on the 1st of every month: every record's `last_checked_at` older than 30 days turns amber; older than 60 days drops to bucket C with "status not confirmed".
5. **Change log** is public on each record ("Updated 12 Oct: window closed").

### 10.5 Publication gate (one-person version)

A record publishes when the reviewer ticks six checks: primary source opened today; status and window confirmed; eligibility rules match the guideline text; benefit rates entered per category; relationships set for every record in the same pack; documents listed. Target: 10 records a week, so \~45 records in about 5 weeks.

### 10.6 Interfaces

- `POST /api/onboarding/answer` → saves facts, returns next question + live result preview
- `GET /api/results` → buckets, combination, calculator lines, roadmap, readiness
- `GET /api/activities?q=` → activity search in three languages
- `POST /api/explain` → LLM answer grounded on the approved version id
- `POST /api/alerts` → subscribe to a record's window

### 10.7 Cost guardrails

Founder session = 0 strong-model calls; explainer capped at \~5 low-cost calls per session with cached answers per (record, question, language). Research cost sits in catalog ops, where it is batched weekly.

## 11. Catalog scope: Central + Maharashtra, UP, Bihar

The MVP launches with about 45 records: 15 registrations/licences, 22 Central schemes, 8 state schemes. About 30 already exist in the repo as researched drafts; the rest are new. "Status (Oct 2026)" is what I could confirm while writing this PRD; every row is re-checked at publication.

### 11.1 Registrations and licences (core + packs)

| Record | Packs | In repo | Notes |
| --- | --- | --- | --- |
| Udyam / Udyam Assist | all | yes | Free |
| PAN, bank account readiness | all | yes (journeys) | Guidance only |
| GST registration test | all | yes | MH/UP/Bihar: ₹40 lakh goods, ₹20 lakh services; inter-state goods from ₹0 |
| FSSAI basic / state / central | P1, P2, P3 | yes | Basic up to ₹1.5 crore from 1 Apr 2026 |
| Shop & Establishment — Maharashtra, UP, Bihar | P1, P4, P5 | partly (central guide) | New per state |
| Local trade licence / gram panchayat NOC | all | no | Guidance by area type |
| Legal Metrology packaged commodity registration | P1 | yes | For packaged goods sellers |
| State Pollution Control Board consent (category check) | P2, P4 | yes (central) | Per state category list |
| State fisheries licence / pond lease | P2 | no | New per state |
| WDRA warehouse registration | P3 | no | Optional |
| Cosmetics / AYUSH manufacturing licence | P4 | no | Pointer only in MVP |
| DPIIT recognition | Lite | yes |  |
| EPFO / ESIC threshold check | all | yes | Trigger at 10/20 workers |
| IEC (export) | optional | yes | Only if exporting |
| Professional tax (MH) | P5, Lite | no | Maharashtra only |

### 11.2 Central schemes

| Scheme | Ministry | Packs | In repo | Status (Oct 2026) |
| --- | --- | --- | --- | --- |
| PMEGP | MSME / KVIC | P1, P4, P5 | yes | Pending renewal: approved to Mar 2026, extension not confirmed |
| PMFME | MoFPI | P1 | yes | Pending renewal: extended to Sep 2026; ministry sought extension in May 2026 |
| PMKSY components | MoFPI | P1, P3 | yes | Verify per component |
| PM Vishwakarma | MSME | P4, P5 | yes | Verify |
| PM Mudra (Shishu / Kishore / Tarun / Tarun Plus up to ₹20 lakh) | DFS / banks | all | yes | Active |
| CGTMSE | MSME / SIDBI | all | yes | Active |
| Stand-Up India | DFS | all (SC/ST/women) | yes | Verify |
| PM SVANidhi | MoHUA | P5 | yes | Verify |
| National Livestock Mission – entrepreneurship | DAHD | P2 | yes | Verify portal window |
| AHIDF | DAHD | P2, P1 | yes | Approved to 2025–26; renewal to verify |
| National Programme for Dairy Development | DAHD | P2 | no | Verify |
| PMMSY (beneficiary component) | DoF | P2 | **no** (only PM-MKSSY) | Budget 2026–27 allocation exists; tenure to verify |
| PM-MKSSY | DoF | P2 | yes | Verify |
| Kisan Credit Card (AH and fisheries) | DFS / RBI | P2, P3 | **no** | Active |
| Agriculture Infrastructure Fund | DA&FW | P3 | yes | Verify tenure |
| 10,000 FPO scheme + FPO credit guarantee | DA&FW | P3 | yes | Verify |
| MIDH | DA&FW | P3 | yes | Verify |
| National Beekeeping and Honey Mission | DA&FW | P3 | yes | Verify |
| National Bamboo Mission | DA&FW | P3 | yes | Verify |
| PM-KUSUM (component for farmers) | MNRE | P3 | yes | Verify |
| SFURTI (clusters) | MSME | P4 | yes | Cluster-level; show as "through a cluster agency" |
| DPIIT stack: GENESIS, Startup India Credit Guarantee, 80-IAC, SISFS (closed) | DPIIT / MeitY | Lite | yes | SISFS closed 31 May 2026 |

### 11.3 State schemes (new)

| State | Scheme | Mechanic | Key rules (from bank/state pages; verify against GR) |
| --- | --- | --- | --- |
| Maharashtra | CMEGP | Subsidy on bank loan | Manufacturing up to ₹50 lakh; service/agro up to ₹10 lakh; subsidy 15–25% general, 25–35% special; own 10% / 5%; age 18–45 (+5 special); apply on maha-cmegp.gov.in |
| Maharashtra | Annasaheb Patil Mahamandal interest refund (for eligible groups) | Interest reimbursement | To research |
| Maharashtra | State Startup / women entrepreneur schemes | Grant / incubation | To research; keep only if open |
| Uttar Pradesh | CM-YUVA | Interest-free, collateral-free loan | Up to ₹5 lakh; 10% margin money subsidy; age 21–40; class 8 pass or training; not if availing other loan-subsidy schemes |
| Uttar Pradesh | ODOP Financial Assistance (margin money) | Subsidy | District product must match (e.g. Saharanpur woodcraft) |
| Uttar Pradesh | Vishwakarma Shram Samman (state) | Toolkit + training | To research |
| Bihar | Mukhyamantri Udyami Yojana (SC/ST, EBC, women, youth, minority) | 50% grant up to ₹5 lakh + interest-free loan up to ₹5 lakh (youth 1%) | Lottery; 2026 window 15 Feb–23 Mar; 9,347 provisional selections; 10+2 pass; age 18–50; unit in home district |
| Bihar | Bihar Laghu Udyami Yojana | Grant up to ₹2 lakh for low-income families | To research |

Rows marked "to research" are included only if a current official order or portal confirms them before launch; otherwise they are dropped, not shown as stale.

## 12. Functional requirements

P0 = needed for the two-person test; P1 = needed before 20 users; P2 = after.

| ID | Requirement | Acceptance criteria | Priority |
| --- | --- | --- | --- |
| FR-01 | Activity search | Typing "achaar", "pickle" or "लोणचे" returns the pickles activity; every MVP activity maps to ≥1 NIC code and ≥1 pack | P0 |
| FR-02 | Multi-pack founder | Selecting poultry + fish shows one merged question flow with no repeated question | P0 |
| FR-03 | Adaptive questions | After each answer the next question is the one that decides the most candidate records; median session reaches first result in ≤ 8 questions | P0 |
| FR-04 | Don't know / prefer not | Every question offers "don't know"; sensitive ones offer "prefer not to say"; neither blocks the result page | P0 |
| FR-05 | Fact dictionary enforced | Publishing a rule that uses a fact key not in `fact_definition` fails validation | P0 |
| FR-06 | Correct verdicts | Any false hard rule → bucket D regardless of unknown facts (fixes bug #3); activity codes, not labels, are compared (bug #2) | P0 |
| FR-07 | Four buckets | Result page shows A/B/C/D with counts; C shows last window dates; D collapsed by default | P0 |
| FR-08 | Status and freshness | Every record shows status + "checked on" date; records unchecked for >60 days cannot appear in bucket A | P0 |
| FR-09 | Stacking | Two `exclusive` records never appear together in the recommended combination; `unknown` pairs show "not confirmed" | P0 |
| FR-10 | Honest amount | Each A-bucket record shows own / subsidy / loan lines computed from `benefit_rate` for the founder's category and area; no total of scheme maximums anywhere | P0 |
| FR-11 | Registration roadmap | Ordered list of registrations/licences with dependency arrows (e.g. Udyam before PMEGP disbursal); steps already done are ticked from Step 7 answers | P0 |
| FR-12 | Readiness score | Score per category + top 3 missing items; changes immediately when an item is ticked | P0 |
| FR-13 | Document checklist | Per missing document: issuer, where (state-specific link), typical days; shareable on WhatsApp as a link and as text | P0 |
| FR-14 | Languages | All founder-facing text in English, Hindi, Marathi; switching language keeps answers | P0 (Hindi + English), P1 (Marathi) |
| FR-15 | No-login first result | Founder sees results without an account; saving or alerts needs phone OTP or Google login | P0 |
| FR-16 | Explain why | "Why am I not eligible?" answers from stored rule text with a source link; no source → says so | P1 |
| FR-17 | Window alerts | Founder can subscribe to a C-bucket record; alert sent when status changes to active | P1 |
| FR-18 | Reviewer workflow | Diff summary, 6-check publish, version history; publishing 10 records takes < 3 hours of reviewer time | P0 |
| FR-19 | Project report outline | Generates a 1–2 page outline (cost, means of finance, monthly sales) from answers; marked "draft for your CA/bank" | P1 |
| FR-20 | Helper mode | A CSC operator or relative can run the flow for someone else and send the result to that person's phone | P2 |
| FR-21 | Feedback per record | "This is wrong / outdated" button creates a reviewer task with the founder's note | P1 |

## 13. Non-functional requirements

| Area | Requirement |
| --- | --- |
| Device and network | Works on a ₹8,000 Android phone on 3G: first screen < 150 KB, result page < 2.5 s; installable PWA (repo already has a service worker) |
| Privacy | No Aadhaar, PAN, bank or caste certificate numbers stored; category answers stored as answers, deletable by the founder in one tap; consent text in the founder's language |
| Trust | Every claim on a result card links to its official source; "checked on" date always visible; no advertising, no paid ranking |
| Neutrality | The tool never says "pay us to get this scheme"; it names free official routes first |
| Accessibility | Large tap targets, icons with every activity, readable at 200% zoom, voice input in P2 |
| Reliability | Result computation is deterministic: same facts + same catalog version = same result (stored with the version id) |
| Security | Existing Supabase RLS kept; reviewer routes admin-only; rate limits on explainer |
| Cost | < ₹1 of LLM cost per founder session at MVP scale |

## 14. Metrics and validation plan

The MVP succeeds if real founders say the result told them something they did not know and would have paid an agent for. Accuracy comes before growth: one wrong "eligible" costs more trust than ten slow answers.

### 14.1 Validation rounds

| Round | Who | What we check | Pass bar |
| --- | --- | --- | --- |
| 0. Desk test | You, with the 5 personas in Section 5 | Each persona's result matches a hand-checked answer | 5/5 correct buckets, 0 wrong amounts |
| 1. Two-person test | 2 real first-time founders (different packs) | Can they finish alone? What confused them? | Both finish in < 10 min; both name 1 new thing learned |
| 2. Expert check | 1 CA + 2 CSC operators (from the ground-research plan) | Are the roadmap and documents right for their area? | No critical error; list of local exceptions |
| 3. Small cohort | 20 founders across 3 states | Retention and action | Metrics below |

### 14.2 Metrics (round 3)

| Metric | Definition | Target |
| --- | --- | --- |
| Completion | Reached result page / started | ≥ 60% |
| Time to first result | Median minutes | ≤ 3 |
| Learned something | "Did this tell you something new?" = yes | ≥ 70% |
| Took a step in 14 days | Completed ≥1 roadmap item (self-reported or ticked) | ≥ 40% |
| Accuracy | Records reported wrong / records shown | < 2% |
| Freshness | Published records checked in last 30 days | 100% |
| Return | Came back within 30 days (alert, checklist) | ≥ 30% |
| Willingness to pay | Would pay for done-for-you filing (and how much) | Measure only; no target |

## 15. Build plan

Assuming about 10 hours a week (side project), the two-person test is reachable in about 9 weeks and the 20-founder cohort in about 12. Catalog work runs in parallel with code, because 45 reviewed records is the real bottleneck, not the UI.

| Phase | Weeks | Code work | Catalog work | Gate to pass |
| --- | --- | --- | --- | --- |
| 0. Clean up | 1–2 | Fix bugs #2–#4; feature-flag GTM routes; add `status_state`, `last_checked_at`; create `fact_definition`, `activity`, `pack` | Map existing rule fields of the \~30 reused records to canonical facts | All repo checks pass; 5 persona fact-sets evaluate without crashes |
| 1. Engine | 3–5 | Adaptive onboarding, buckets, `scheme_relationship`, `benefit_rate`, calculator, roadmap builder | Publish first 10 records (core registrations + Mudra, CGTMSE, PMEGP, CMEGP) | Desk test: 5/5 personas correct |
| 2. Packs | 4–8 | Activity search (3 languages), pack follow-up questions | 10 records/week: P1, P2, P4 first, then P3, P5, states | 45 records published with relationships set |
| 3. Readiness | 7–9 | Readiness score, document checklist, WhatsApp share, Hindi | Document master list per state | Two-person test passed |
| 4. Cohort | 10–12 | Marathi, alerts, explainer, feedback button, project report outline | Monthly status sweep live | 20-founder cohort metrics measured |

**Cut list if time slips:** Marathi (keep Hindi + English), explainer, project report outline, alerts. **Never cut:** status/freshness, honest amounts, the bug fixes.

**Agent-friendly tasks:** most phase 0–1 work is well-specified (schema, tests on the 5 persona fact-sets) and can be handed to a coding agent with this PRD; catalog review cannot be delegated to an agent without your sign-off.

## 16. Risks, assumptions, open questions

### 16.1 Risks

| Risk | Why it is real | Mitigation |
| --- | --- | --- |
| Data goes stale | 2026 is a renewal year: PMEGP, PMFME, AHIDF status all uncertain right now | Status sweep, 60-day rule, public change log |
| One reviewer is a single point of failure | You have a full-time job | 45 records max; 10/week; founders' "this is wrong" button feeds the queue |
| Wrong "eligible" hurts a founder | A founder may borrow money based on our result | Bucket A requires reviewed rules + fresh status; every card says "final decision by bank / department" |
| State rules vary by district | DIC/KVIB practice differs from the GR | Expert round with CSC operators; per-district notes field |
| Founders want the filing done, not advice | YouTube research: people pay agents even for free steps | Measure willingness to pay in round 3 before building assisted filing |
| Scope creep back into GTM / all-India | Repo history shows breadth before depth | This PRD's out-of-scope list; packs before states |

### 16.2 Assumptions to verify before launch

- PMEGP, PMFME, AHIDF, PMMSY, AIF current tenure and window (official notifications)
- PMEGP vs CMEGP and PMFME vs CMEGP on the same unit: exclusive or not (Maharashtra GR)
- Maharashtra Shop Act intimation threshold (below 10 workers) still current
- NLM poultry minimum unit (1,000 parent layers) in the current guideline, and the exact portal name
- Bihar MUY 2026–27 window dates; UP CM-YUVA current education and age rules
- Whether Udyam has moved to NIC 2025 codes

### 16.3 Open questions for you

1. Are Maharashtra, UP and Bihar the right three states, or is Delhi needed for your own test (you mentioned Delhi earlier)?
2. Who are the two test founders, and which packs are they in? Their packs should be built first.
3. Login: phone OTP (costs per SMS) or Google login only for the MVP?
4. Should the result page carry the founder's name (more personal) or stay anonymous until they save?

### 16.4 Where the long-term ideas fit

The MVP's data is the base for each later idea; none of them is built now.

| Idea (from your notes) | What the MVP already collects that it needs | Earliest sensible start |
| --- | --- | --- |
| Marketplace ("100 quintal rohu in August") | Activity, location, unit size, certifications (FSSAI, organic) | After 200+ active founders in one pack and district |
| AI business planning (poultry + fish integrated farm) | Activity combos, land/pond, money, rules for each component | After the calculator is trusted; start with 3 template plans |
| Assisted filing via vetted local helpers | Readiness checklist = the helper's job card | After willingness-to-pay is measured; fee-based, no cut of grants, no "speed money" |
| Retention | Alerts, renewals, compliance calendar | Phase 4 alerts are the first step |

## 17. Sources

**Pages opened for this PRD**

- [DAHD — National Livestock Mission leaflet](https://dahd.gov.in/sites/default/files/2023-07/NLM-Leaflet-E.pdf) (50% capital subsidy; poultry ₹25 lakh with 1,000 parent layers; goat/sheep ₹50 lakh; piggery ₹30 lakh)
- [Bank of Maharashtra — CMEGP](https://bankofmaharashtra.bank.in/cmegp) (project limits, subsidy and own-contribution table, age, portal)
- [UP MSME 1-Connect — CM-YUVA](https://msme1connect.up.gov.in/Home/SchemesList/66) (₹5 lakh interest-free, 10% margin money, age 21–40)
- [Patna Press — Bihar Udyami Yojana 2025–26 selections](https://patnapress.com/bihar-udyami-yojana-9347-beneficiaries-selected-2025-26/) (9,347 provisional selections, randomised draw, window 15 Feb–23 Mar 2026)
- [ClearTax — Bihar Mukhyamantri Udyami Yojana](https://cleartax.in/s/bihar-mukhyamantri-udyami-yojana) (₹5 lakh grant + ₹5 lakh interest-free loan, eligibility, documents)
- [Insights on India — PMMSY 2026](https://www.insightsonindia.com/2026/03/11/pm-matsya-sampada-yojana-pmmsy/) (Budget 2026–27 allocation; no tenure stated)
- Repo OxAsh11/UdyamVeda: `docs/catalog-live-integration-2026-09-09.md`, `docs/udyamveda-completion-checklist.md`, `src/lib/opportunities/rules.ts`, `recommendation-ranking.ts`, `published-recommendations.ts`, onboarding page and API, seed files

**Headlines seen in search, not yet opened (treat as leads)**

- [Outlook Business — PMFME set for extension](https://www.outlookbusiness.com/news/pmfme-scheme-set-for-extension-after-hitting-2-lakh-unit-target); [The Hitavada — MoFPI seeking PMFME extension (May 2026)](https://www.thehitavada.com/Encyc/2026/5/23/food-processing-industries-ministry-seeking-pmfme-scheme-extension-with-revised-norms.html)
- [VisionIAS — AHIDF extended till 2025–26](https://visionias.in/current-affairs/news-today/2024-02-02/schemes-in-news/union-cabinet-approves-extension-of-animal-husbandry-infrastructure-development-fund-ahidf-till-2025-26)
- [Business Standard — Mudra limit doubled to ₹20 lakh (Tarun Plus)](https://www.business-standard.com/amp/economy/news/centre-doubles-loan-limit-under-pradhan-mantri-mudra-yojana-to-rs-20-lakh-124102501146_1.html)
- [VisionIAS — MoSPI releases NIC 2025](https://visionias.in/current-affairs/news-today/2025-11-19/economy/mospi-releases-the-national-industrial-classification-nic-2025)

Earlier verified facts (SISFS closure, FSSAI ₹1.5 crore, GST thresholds, myScheme tests, YouTube research) are sourced in the *Udyam Veda — Product Document* tabs.
