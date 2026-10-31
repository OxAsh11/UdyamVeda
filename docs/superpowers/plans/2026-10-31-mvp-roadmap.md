# Udyam Veda MVP Roadmap

**Spec:** [docs/product/udyamveda-mvp-prd-v1.md](../../product/udyamveda-mvp-prd-v1.md)

**Goal:** Take the MVP PRD from today's state to the 20-founder cohort with no scope cut. Six milestones, each shippable on its own. Each milestone gets its own detailed plan when it starts, because it builds on the interfaces the one before produces. Milestone 1 is detailed now: [2026-10-31-m1-results-engine.md](2026-10-31-m1-results-engine.md).

## Where the PRD and reality differ

The PRD's review was based on older repo documents. These override it.

| PRD says | Reality or owner decision | Effect on the build |
| --- | --- | --- |
| 174 records, 0 published, 1,218 checks pending | 187 published (141 active, 18 paused, 4 pending renewal, 24 closed) | The problem is now scoping, not publishing. Records need pack tags, so founders see about 45, not 187 |
| States: Maharashtra, UP, Bihar | Plus Delhi and Jharkhand | Five state packs |
| Login: phone OTP or Google (FR-15) | Founder chooses phone OTP or email. Login tabs are live; phone waits for an SMS provider | Saving results uses either method |
| Two real test founders | Fisheries, poultry and tech personas for round 1 | Build P2 and Lite first. Rounds 2 and 3 still need real people (Section 14) |
| 10 hours a week; cut list if time slips | More time; no cuts | The cut list in Section 15 does not apply |
| Publish gate: 6 checks in a new workflow | One-form correction editor already exists | Add the 6 checks and "mark checked" to it (M4) |
| `opportunity_versions.status_state`, `last_checked_at` | `opportunities.status` already holds the state. Approved versions are immutable, so a sweep cannot touch them | `last_checked_at` goes on `opportunities`; "unknown" status is derived from staleness |
| CMEGP service limit ₹10 lakh, age 18–45 | Official MAITRI page: manufacturing ₹1 crore, service/agro ₹50 lakh, age 18+ | The catalog is right. PRD examples are illustrative |
| Maharashtra Shop Act intimation under 10 workers | Under 20 workers (Ordinance VIII of 2025) | Same. Bihar's Shop Act was also repealed on 1 Jun 2026 |
| Bihar window 15 Feb–23 Mar | Guideline says 25 Feb–23 Mar 2026 | Same |
| Forced flow implied by "onboarding" | Owner: no forced onboarding. Results flow is offered, never a gate to the dashboard | `/start` is optional for signed-in users |

## Done already

| PRD item | State |
| --- | --- |
| Bugs #2, #3, #4 (Section 6.3) | Fixed |
| `packs`, `activities`, `fact_definitions`, `questions` tables (6 packs, 83 activities, 68 facts) | Live; `questions` is empty |
| All 564 legacy rule fields mapped to facts (`rule_field_mappings`) | Live; not yet wired into recommendations |
| `scheme_relationships` table | Live with 6 exclusive pairs |
| Five-state schemes, NLM/PMMSY/KCC, Shop Act guides, pending-renewal status | Live |
| Email or mobile login choice | Live; mobile tab waits on the provider |

## Milestones

Catalog work (M4) runs in parallel from M1 onward because it needs the owner's review time, not code. P2 and Lite records go first, matching the fisheries, poultry and tech personas.

### M1: Results engine (detailed plan ready)

Answers "do you qualify, is it open, can they combine, how much really" as tested code behind `POST /api/results`. No founder-facing screens yet.

- **Covers:** FR-05 (partly), FR-06, FR-08, FR-09, FR-10; Sections 8.1–8.4; bugs #4–#6.
- **Done when:** All persona checks pass on a snapshot of the real catalog.

### M2: Founder flow

The adaptive questions and the results page, usable without an account.

| Work | Decision already made |
| --- | --- |
| Seed `questions` in three languages; every question writes a fact that a rule or the roadmap uses | A check script fails on any question whose facts nothing reads (Section 7.1 rule 1) |
| `GET /api/activities?q=` | Served from cached rows with a tested in-memory trigram scorer. Handles "achaar", "pickle", "लोणचे". LLM fallback only for free text, confirmed by the founder |
| `POST /api/onboarding/answer` returns the next screen and a live preview | Facts travel in the request until the founder saves. Next question is the one deciding the most candidate records, using `factKeysForRuleField` from M1 |
| `/start` and `/start/results` | On the app host: add `/start` to `PRODUCT_PATH_PREFIXES` in `src/proxy.ts`, no login check. Website buttons link there. Drafts stay in `localStorage`, which is per host, which is why the flow cannot live on the website host |
| Save on login | Draft moves to `business_facts` with `answer_state`. Dashboard shows results with the existing soft prompt. `/onboarding` redirects to `/start` |
| Existing 14 accounts | Convert old state and stage answers to fact codes; old sector labels are ignored and re-asked |
| Hide GTM tools | `NEXT_PUBLIC_SHOW_GTM_TOOLS=false` hides the sidebar "Grow" section and redirects those routes. Nothing is deleted |

- **Covers:** FR-01, 02, 03, 04, 07, 15; Sections 7 and 10.6; Phase 0's GTM flag.
- **"8 questions" is read as 8 screens**, matching the 8-step table in Section 7.2. One screen can hold up to three short answers.
- **Done when:** Desk test passes 5/5 personas plus fisheries, poultry and tech; a simulated session reaches first result in ≤ 8 screens with no repeated question.

### M3: Roadmap and readiness

The ordered registrations, the score and the document checklist.

| Work | Decision already made |
| --- | --- |
| `roadmap_items` table: stage (0–9, Section 5.1), `applies_when` rule tree, `depends_on`, `done_fact_key`, labels, optional `opportunity_id` | Reuses content from the static registration journeys. Not in the PRD's table list, but the builder needs it |
| `document_definitions` and `document_requirements` | Requirements link a document to a scheme or roadmap item, with a category for scoring |
| Readiness score | Weights: identity 20, business setup 25, premises 20, money 25, skills 10. "Don't know" counts as missing and becomes a task. Computed only from the chosen route |
| Share and print | WhatsApp link and text, printable bank visit pack. Shared links never include sensitive answers (category, income, disability) |

- **Covers:** FR-11, 12, 13; Section 9; ranking by time to money (uses `typical_days`).
- **Done when:** Round 1 persona test passes (fisheries, poultry, tech each finish in under 10 minutes).

### M4: Catalog to launch quality (owner-heavy, parallel)

| Work | Detail |
| --- | --- |
| Pack tags, benefit rates, documents | All PRD Section 11 records, per state |
| Relationships | Set for every pair in the same pack, with source and quote; anything else shows "not confirmed" |
| Records still missing | Local trade licence / gram panchayat NOC, state fisheries licence and pond lease, WDRA, cosmetics and AYUSH pointers, Maharashtra professional tax |
| Schemes still to research | Annasaheb Patil, UP Vishwakarma Shram Samman, Dilli Swarojgar Yojana, Maharashtra startup and women's schemes. Dropped if no official source confirms them |
| Assumptions in Section 16.2 | Each verified or recorded as open; includes whether Udyam moved to NIC 2025 |
| Gate and freshness | Six checks in the editor; "mark checked today"; monthly sweep at 30 days (amber) and 60 days (bucket C); public change log; weekly crawl and diff summarised for the reviewer |
| Rule validation (FR-05) | Database trigger rejects a rule whose field is in neither `fact_definitions` nor `rule_field_mappings`, and rejects `unknown_handling: fail_closed` (0 of 187 use it today; it would wrongly mark unanswered records as not eligible) |

- **Covers:** Sections 10.4, 10.5, 11; FR-08, FR-18.
- **Done when:** About 45 records are in packs with relationships, rates and documents set, and all were checked in the last 30 days.

### M5: Languages and mobile login

- **Languages (FR-14):** All founder-facing text and in-pack scheme content in English, Hindi and Marathi, with an `opportunity_translations` table. Machine drafts need the owner's sign-off before publishing, because a wrong Hindi amount misleads as much as a wrong English one.
- **Mobile OTP:** Send SMS hook at `/api/auth/send-sms` (signature-verified, MSG91 or 2Factor plus WhatsApp), Supabase test numbers for personas, DLT registration, then turn on `NEXT_PUBLIC_PHONE_LOGIN_ENABLED`.
- **Privacy (Section 13):** Consent text in the founder's language; one-tap delete of category answers.
- **Done when:** A persona signs up by phone in Hindi and sees the same buckets as in English.

### M6: After-result features and cohort

| Work | Requirement |
| --- | --- |
| "Why" explainer from stored text only, capped at about 5 low-cost calls a session, cached per record, question and language | FR-16, Sections 8.5, 10.7 |
| Window alerts by WhatsApp and email | FR-17 |
| Project report outline, marked draft | FR-19 |
| "This is wrong" button creating a reviewer task | FR-21 |
| Helper mode; voice input | FR-20, Section 7.1 |
| Performance: first screen under 150 KB, results under 2.5 s on 3G, PWA install | Section 13 |
| Metrics events for Section 14.2 | Section 14 |

- **Done when:** Rounds 2 and 3 run and the Section 14.2 metrics are measured.

## What only the owner can do

| When | What |
| --- | --- |
| M1 | Approve the pack tags and benefit rates before they go live |
| M4 | Review about 10 records a week; this is the real speed limit on launch |
| Before M2 goes live | Status sweep. The oldest live check is 8 Sep, so records start passing the 60-day limit on 7 Nov. Today's product does not enforce the limit; the new results page will, and unchecked records would leave bucket A. So M4's "mark checked today" button ships before M2 goes live |
| M5 | Choose MSG91 or 2Factor (open question: is UdyamVeda linked to an incubator?), register for DLT, review translations |
| M6 | Find 1 CA, 2 CSC operators and 20 founders; personas cannot replace them for these rounds |

## Requirement coverage

| Requirement | Milestone | Requirement | Milestone |
| --- | --- | --- | --- |
| FR-01 Activity search | M2 | FR-12 Readiness | M3 |
| FR-02 Multi-pack | M2 | FR-13 Checklist | M3 |
| FR-03 Adaptive questions | M2 | FR-14 Languages | M5 |
| FR-04 Don't know | M1 (logic), M2 (screens) | FR-15 No-login result | M1 (API), M2 (screens) |
| FR-05 Dictionary enforced | M1 (seeds), M4 (trigger) | FR-16 Explain why | M6 |
| FR-06 Correct verdicts | M1 | FR-17 Alerts | M6 |
| FR-07 Four buckets | M1 (logic), M2 (screens) | FR-18 Reviewer workflow | M4 |
| FR-08 Freshness | M1 (logic), M4 (sweep) | FR-19 Report outline | M6 |
| FR-09 Stacking | M1 (logic), M4 (data) | FR-20 Helper mode | M6 |
| FR-10 Honest amount | M1 (logic), M4 (data) | FR-21 Feedback | M6 |
| FR-11 Roadmap | M3 | Sections 13, 14, 16.2 | M4, M5, M6 |

Section 16.4's long-term ideas (marketplace, AI planning, assisted filing) are out of the MVP by the PRD's own terms. GTM tools stay in the repo, hidden.

**Known limit to settle in M2:** A founder with two activities (poultry and fish) gives one project cost, but schemes may fund each unit separately, and "same project" exclusions may not apply across units. M2 decides whether to ask project cost per activity.
