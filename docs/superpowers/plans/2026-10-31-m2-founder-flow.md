# M2 Founder Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A founder with no account opens `/start`, answers up to 7 screens, sees their four result buckets, can sharpen them with up to 7 more questions, and can save them by signing in.

**Architecture:** The flow is stateless on the server: the browser keeps the answers and sends them each time, so an anonymous founder needs no account. Pure logic in `src/lib/start/` decides the next screen, on top of M1's `buildResults`. A signed-in founder's answers also live in `business_facts`.

**Tech Stack:** Next.js 16.2, React 19, Supabase, Vitest, Tailwind 4, existing `glass`, `btn-accent`, `chip` and `glass-input` styles.

**Spec:** [docs/product/udyamveda-mvp-prd-v1.md](../../product/udyamveda-mvp-prd-v1.md) Sections 7, 8.1, 10.6, 12. [The roadmap](2026-10-31-mvp-roadmap.md) overrides it, and fixes the M2 decisions.

## Global Constraints

- FR-01: typing "achaar", "pickle" or "लोणचे" returns the pickles activity.
- FR-02: poultry + fish gives one merged flow with no repeated question.
- FR-03: first result in ≤ 8 screens; refinement asks whichever question decides the most records. "8 questions" means 8 screens (roadmap).
- FR-04: every question offers "don't know"; sensitive ones offer "prefer not to say"; neither blocks the result page.
- FR-07: results show A/B/C/D with counts; C shows window dates; D is collapsed by default.
- FR-08: every record shows status and a "checked on" date.
- FR-10: own, subsidy and loan are separate lines; no total anywhere.
- FR-15: no account needed for the first result.
- Section 7.1: a question exists only if a rule, a rate, or M3's roadmap and readiness needs its fact. Sensitive questions come at the funding stage with one line on why. No ID numbers are ever asked.
- Owner decisions: no forced onboarding (the dashboard stays open and only prompts softly). Login is mobile or email.
- Existing logic is not rewritten: `buildResults`, `cleanFacts` and `loadEngineCatalog` are reused.
- Deploy only when the owner says "deploy". GTM tools are hidden, never deleted.
- Corrections to approved rules need the owner's approval before they are applied.
- Before writing routes or pages, read the relevant guide in `node_modules/next/dist/docs/` (AGENTS.md).

## Review Focus

1. A founder closes the tab halfway and comes back, or their browser blocks storage: answers return when possible, and the flow still works when not. Test in Task 5.
2. The catalog is unavailable mid-flow: "try again", answers kept, no blank or fake result. Tests in Tasks 3 and 5.
3. A founder answers "don't know" to everything: they still reach results, and nothing repeats forever. Test in Task 3.
4. A signed-in founder with old-style answers ("Maharashtra", "pre-launch"), or one with a mobile login and no email: answers convert, and saving works. Test in Task 6.
5. The free-text activity helper calls a paid AI: anonymous callers cannot run up a bill, and it only returns real activity ids. Test in Task 2.

---

## File Structure

| File | Responsibility |
| --- | --- |
| `supabase/seed/mvp/questions.json`, `scripts/mvp-questions-sql.mjs` | Questions in three languages and their migration |
| `src/lib/start/types.ts` | Flow types |
| `src/lib/start/activity-search.ts` | Pure search over activities |
| `src/lib/start/next-screen.ts` | Which screen comes next |
| `src/lib/start/load-bundle.ts` | Cached questions, fact labels and activities |
| `src/lib/start/i18n.ts` | Screen text in three languages |
| `src/lib/start/draft.ts` | Browser draft that survives blocked storage |
| `src/lib/businesses/founder-facts.ts` | Saved answers to facts, including old-style ones |
| `src/lib/features/gtm.ts` | The GTM flag and its paths |
| `src/app/api/activities/route.ts`, `suggest/route.ts` | Search and AI helper |
| `src/app/api/onboarding/answer/route.ts` | Next screen and live counts |
| `src/app/api/founder/facts/route.ts` | Read and save a signed-in founder's answers |
| `src/app/api/admin/catalog/mark-checked/route.ts` | The "checked today" action |
| `src/app/start/**`, `src/components/start/**` | The flow and results pages |

---

### Task 1: Engine carry-overs from M1

**Files:** Modify `src/lib/opportunities/engine/{classify,facts,calculator,results,types}.ts`, `src/app/api/results/route.ts`. Test: existing engine test files.

**Produces:** `RecordResult.windows: RecommendationWindow[]`; no `steps` on bucket A; `betterIfAnswered` without declined facts.

- [ ] **Step 1: Write failing tests:**
  - A record in A has `steps: []` even when an unused `any` branch was unanswered.
  - `lines.betterIfAnswered` omits facts in `nonAnswers` marked `declined`.
  - `RecordResult.windows` matches the record's windows.
  - `cleanFacts` on `{ gender: '__proto__' }` gives `{}` with empty `nonAnswers`.
  - A number above 1e12 is dropped.
  - A request with `content-length` over 16 KB gets 413 before its body is read.
- [ ] **Step 2: Run to confirm they fail.** `npm test`.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run.** `npm test`. Expected: all pass.
- [ ] **Step 5: Commit** "Close the engine carry-overs from the M1 review".

### Task 2: Questions, facts v4 and activity search

**Files:** Create `questions.json`, `scripts/mvp-questions-sql.mjs`, `src/lib/start/{types,activity-search}.ts`, the two activity routes, and generated migrations. Modify `facts.json`, `fact-mapping.ts`. Test: `src/lib/start/__tests__/{questions-seed,activity-search,activities-route}.test.ts`.

**Produces:**

```ts
export type Lang = 'en' | 'hi' | 'mr'
export type Text = Record<Lang, string>
export type FlowOption = { value: string; label: Text }
export type FlowFact = { key: string; type: string; label: Text; packIds: string[]; sensitive: boolean; options: FlowOption[] }
export type FlowQuestion = { id: string; stage: number; sort: number; kind: string; prompt: Text; help: Text | null; dependsOn: unknown; factKeys: string[] }
export type FlowActivity = { id: string; label: Text; synonyms: string[]; icon: string | null; packIds: string[] }
export type StartBundle = { questions: FlowQuestion[]; facts: Record<string, FlowFact>; activities: FlowActivity[] }
export function searchActivities(query: string, activities: FlowActivity[], limit?: number): FlowActivity[]
```

Data decisions:
- Split the `3l_6l` income band into `3l_5l` and `5l_6l`, because Jharkhand's limit is ₹5 lakh and no answer could decide it.
- Add the boolean fact `matches_district_odop` (not fixable, stage 9), because UP ODOP needs it.
- Stages 1–7 follow PRD Section 7.2. Stage 8 is "about you". Stage 9 is pack follow-ups.
- `sells_interstate`, `sells_online`, `vehicle_type`, `uses_powered_machines` and `uses_chemicals_or_effluent` get no question yet, because nothing reads them until M3 (Section 7.1 rule 1).

- [ ] **Step 1: Write failing tests:**
  - Every question has all three languages and at least one real fact.
  - **Every fact a tagged rule reads has a question**, so no scheme asks something the flow can't.
  - Every question's fact is read by a rule, a rate, or the named M3 list.
  - No question asks for an ID number.
  - Sensitive questions are stage 8 with a reason in all three languages.
  - `BAND_RANGES` matches every band in `facts.json`.
  - Search: "achaar", "pickle", "लोणचे" → `pickles_chutney`; "murgi palan" → a poultry activity; "silai" → tailoring; "pikle" (typo) → pickles; empty gives a starter list; nonsense gives nothing.
  - Suggest route: ids outside the list are dropped; no API key gives an empty list; a 121-character text gets 400; the 11th call from one address in an hour gets 429.
- [ ] **Step 2: Run to confirm they fail.**
- [ ] **Step 3: Write `questions.json`, the generator and the search.** Search ranks exact, then prefix, then contains, then trigram similarity above 0.3 across labels and synonyms.
- [ ] **Step 4: Run, then generate migrations** `20261031130000_mvp_foundation_seed_v4.sql` and `20261031140000_questions_seed.sql`.
- [ ] **Step 5: Dry-run in a rolled-back transaction, then apply.** Nothing reads these tables on the live site yet.
- [ ] **Step 6: Commit** "Add the question set and activity search".

### Task 3: Which screen comes next

**Files:** Create `src/lib/start/next-screen.ts`, `load-bundle.ts`, `src/app/api/onboarding/answer/route.ts`. Test: `src/lib/start/__tests__/{next-screen,flow-simulation,answer-route}.test.ts`.

**Produces:**

```ts
export type ScreenQuestion = FlowQuestion & { facts: FlowFact[] }
export type NextStep = { phase: 'first' | 'refine' | 'done'; stage: number | null; questions: ScreenQuestion[]; decides: number; refineLeft: number }
export function nextStep(input: { facts: CanonicalFacts; nonAnswers: Record<string, string>; asked: readonly string[] }, bundle: StartBundle, catalog: EngineCatalog, now: Date): NextStep
```

Rules:
- Stages 1–7 come in order as whole screens.
- Then refinement: one question at a time, the one with the highest `decides`, at most 7, and only if `decides > 0`.
- `decides` counts records in B and C whose answer steps name the question's facts, plus records whose rate `betterIfAnswered` does.
- A question is skipped if its `dependsOn` is not true or its facts' packs miss the founder's packs.
- A checklist option is hidden the same way.

- [ ] **Step 1: Write failing tests:**
  - Simulated sessions for all 5 PRD personas plus fisheries, poultry and tech reach `refine` in ≤ 7 screens, repeat no question, and finish within 7 refinement questions.
  - Poultry + fish merges with no repeats.
  - Pack questions never reach the wrong founder (goat counts to a tailor).
  - All "don't know" still reaches `done`.
  - `operating_since` is asked only when running.
  - The route gives 503 when the catalog or bundle is down, and drops unknown question ids.
- [ ] **Step 2: Run to confirm they fail.**
- [ ] **Step 3: Implement.** Read `caching-without-cache-components.md` first.
- [ ] **Step 4: Run.** Expected: all pass.
- [ ] **Step 5: Commit** "Decide the next question from what it would settle".

### Task 4: GTM flag and the `/start` route

**Files:** Create `src/lib/features/gtm.ts`. Modify `src/proxy.ts`, `Sidebar.tsx`, `dashboard/page.tsx`, `.env.example`. Test: `src/lib/features/__tests__/gtm.test.ts`.

**Produces:** `GTM_TOOLS_ENABLED`, `isGtmToolPath(pathname)`. Paths: strategy, plays, calendar, track, campaigns, distribute, drawing-board, ideate under `/dashboard`.

- [ ] **Step 1: Write failing tests:** each path is recognised; `/dashboard/schemes` and `/dashboard/strategyx` are not.
- [ ] **Step 2: Implement.** Add `/start` to `PRODUCT_PATH_PREFIXES`; redirect GTM paths to `/dashboard` while the flag is off; hide the Grow section, the Grow card and the Calendar shortcut.
- [ ] **Step 3: Run.** `npm test && npm run build:next`. Commit "Hide GTM tools behind a flag and open /start".

### Task 5: The flow and results pages

**Files:** Create `src/lib/start/{i18n,draft}.ts`, `src/app/start/{layout,page}.tsx`, `src/app/start/results/page.tsx`, `src/components/start/{StartFlow,QuestionField,ActivityPicker,ResultsView,SchemeCard,LanguageSwitch}.tsx`. Test: `src/lib/start/__tests__/{draft,i18n}.test.ts`.

**Produces:** `loadDraft(): Draft`, `saveDraft(draft)`, `clearDraft()`, `t(lang, key)`.

Decisions:
- Results have a "best route" card from `combination`, then A, B, C, and a collapsed D.
- Cards show status, "checked on", separate lines, "if renewed", the bank's checks and a source link. Scheme text stays English until M5.
- The own line reads "not stated by the source" when null, and "still to arrange" comes from `uncovered`.
- Every result carries "final decision by the bank or department".
- Refinement questions appear inline on the results page.

- [ ] **Step 1: Write failing tests:** the draft survives a round trip; throwing storage still works in memory; corrupt JSON gives an empty draft; every text key exists in all three languages.
- [ ] **Step 2: Implement the helpers, then the pages.**
- [ ] **Step 3: Run.** `npm test && npm run build:next`.
- [ ] **Step 4: Open it in a real browser at phone width** and walk the fisheries persona through to results, in Hindi and in English. Check catalog-down behaviour by forcing a 503.
- [ ] **Step 5: Commit** "Add the founder flow and results pages".

### Task 6: Save on sign-in, old accounts and the dashboard

**Files:** Create `src/lib/businesses/{founder-facts,workspace}.ts`, `src/app/api/founder/facts/route.ts`. Modify `onboard/route.ts`, `onboarding/page.tsx`, `signup/page.tsx`, `login/page.tsx`, `dashboard/page.tsx`. Test: `src/lib/businesses/__tests__/founder-facts.test.ts`, `src/lib/start/__tests__/founder-facts-route.test.ts`.

**Produces:**

```ts
export function founderFactsFromRows(rows: { fact_key: string; fact_value: unknown; answer_state?: string }[]): Record<string, unknown>
export async function ensureBusiness(supabase: SupabaseClient, userId: string): Promise<{ businessId: string } | { error: string }>
```

- [ ] **Step 1: Write failing tests:**
  - "Maharashtra" → `maharashtra`; "Delhi" → `delhi`; "pre-launch" → `idea`; "2-plus" → `running`; "women" → `gender: woman`; "ex-serviceman" → `ex_serviceman: true`; old sector labels are ignored.
  - A new-style answer wins over an old one.
  - `answer_state` becomes `dont_know` / `prefer_not`.
  - Route: anonymous gets 401; PUT drops junk; a founder with no business gets one; a phone-only user with no email works.
- [ ] **Step 2: Run to confirm they fail.**
- [ ] **Step 3: Implement.** `/onboarding` redirects to `/dashboard`, and so does signup unless the founder chose to save results. Signup and login carry `next`. The results page saves the draft after sign-in. The dashboard shows counts and top results from `buildResults`, with a soft prompt when there are no answers.
- [ ] **Step 4: Run.** `npm test && npm run build:next`. Commit "Save results on sign-in and show them on the dashboard".

### Task 7: "Checked today" and the sweep view

**Files:** Create `src/app/api/admin/catalog/mark-checked/route.ts`. Modify `src/app/admin/catalog/edit/page.tsx`, `SchemePicker.tsx`. Test: `src/lib/start/__tests__/mark-checked-route.test.ts`.

- [ ] **Step 1: Write failing tests:** anonymous gets 401; non-reviewer 403; success calls `mark_opportunity_checked` and clears the catalog cache; failure leaves the cache.
- [ ] **Step 2: Implement.** The picker reads `opportunities.last_checked_at`, sorts oldest first under a "Needs checking" filter, and flags 30+ days amber and 60+ days red. The button says "Source opened today: still correct".
- [ ] **Step 3: Run and commit** "Let a reviewer mark a scheme checked in one click".

### Task 8: Rule corrections, ready for approval

**Files:** Create `supabase/seed/mvp/m2-rule-corrections.json`, `scripts/mvp-rule-corrections-sql.mjs`. Test: `src/lib/start/__tests__/rule-corrections.test.ts`.

- **UP ODOP:** add `matches_district_odop = true`.
- **Jharkhand MRSY:** `not_in` also rejects `5l_6l`.
- **CMEGP:** `activity` in manufacturing, service or agro; `entity_type` is individual, proprietorship, partnership or SHG; Class 8 when the project is above ₹10 lakh (manufacturing) or ₹5 lakh (service).

- [ ] **Step 1: Write failing tests on the snapshot with corrections applied:** a UP founder saying no to ODOP is D, and unanswered is B; ₹5–6 lakh income in Jharkhand is D and ₹3–5 lakh is not; a kirana in Maharashtra is D; an LLP is not A; Pooja at ₹8 lakh without education is B, and with Class 10 is A.
- [ ] **Step 2: Write the data and generator; run the tests; dry-run in a rolled-back transaction.** Do **not** apply; the owner approves first.
- [ ] **Step 3: Commit** "Prepare the three rule corrections for approval".

### Task 9: Website button and end-to-end check

**Files:** Modify `src/app/page.tsx`.

- [ ] **Step 1: Add "Check what you qualify for"** to the website's hero, linking to `/start`.
- [ ] **Step 2: Run everything.** `npm test && npm run typecheck && npm run build:next`.
- [ ] **Step 3: Deploy a preview.** Walk the personas in a browser using Vercel's own access path. Do not deploy to production.
- [ ] **Step 4: Commit** "Link the website to the founder flow".
