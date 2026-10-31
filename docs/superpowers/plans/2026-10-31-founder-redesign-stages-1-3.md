# Founder Redesign, Stages 1 to 3: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every founder page says what fits this founder and what to do next: verdicts on schemes, an About me page, a real ask for missing answers, and one meaning per colour.

**Architecture:** Pure functions in `src/lib/founder/` turn engine results into words, tones and page data, and are unit-tested. Pages stay thin and server-rendered where they can. Stage 4 (My path) gets its own plan after Stage 3 ships, because it needs new tables, source research and the owner's approval of content.

**Tech Stack:** Next.js 16 App Router, Tailwind v4, Supabase, Vitest (`src/**/*.test.ts` only, so logic must live in `.ts` files).

**Spec:** `docs/superpowers/specs/2026-10-31-founder-product-redesign-design.md`. Mock-ups: https://claude.ai/artifact/QvT3gP8pFMPKQG5Pt5A1fD

## Global Constraints

- AGENTS.md: read the relevant guide in `node_modules/next/dist/docs/` before writing code. `cookies()`, `params` and `searchParams` are async. Route files export only HTTP handlers.
- Verdicts come only from the rules engine. No AI decides or words them.
- The final decision line ("The final decision is made by the bank or department") appears at least once on every page that shows a verdict.
- Asking stays skippable. Nobody is blocked from their account.
- Never ask for or store Aadhaar or PAN numbers.
- Text shown on `/start` and its results goes in `src/lib/start/i18n.ts` in all three languages (the type requires it). Dashboard-only text goes in `src/lib/founder/text.ts`, English now, translated in M5. New Hindi and Marathi strings are drafts for the owner's sign-off in M5.
- Touch targets at least 44px. Pages must not scroll sideways at 320px.
- Commit message trailer: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Use `git add` with named paths. Never `--no-verify`.
- Pushing `main` deploys production. Push only at a stage gate, after the owner says yes.
- Windows: tracked files may be CRLF, so multi-line edits must match the file's line endings.
- Checks after each task: `npm test`, `npx tsc --noEmit`, `npx eslint src scripts`.
- Ruling already made: colour tokens and shared parts move from spec Stage 3 into Task 1, because Stage 1's pages need them. Stage 3 migrates the remaining pages.

## Review Focus

1. A founder edits About me, then opens results on a device holding an older draft of their own. Expected: the newer saved answers are not overwritten without asking. Pinned in Task 8.
2. An older account whose only saved facts are free text ("Mumbai" as a state, no activity). Expected: treated as no answers, with no crash and no wrong verdict. Pinned in Task 3.
3. The catalog is down when a signed-in founder with no answers opens `/dashboard`. Expected: a "try again" message, no redirect and no loop. Pinned in Task 9.
4. A scheme outside the founder's results (another state, another industry, a registration, or a slug the engine does not hold) opened directly. Expected: details with a grey plain note, never a green verdict or a crash. Pinned in Task 2.
5. Browse all with no matches or a search full of symbols (`%`, `'`), and with the catalog down. Expected: a plain message, not an empty page or an error. Pinned in Task 5.

---

# Stage 1: Schemes for you and the verdict

### Task 1: Colour tokens and shared parts

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/lib/design/tones.ts`, `src/components/ui/founder.tsx`
- Test: `src/lib/design/__tests__/design-rules.test.ts`

**Interfaces:**
- Produces: `type Tone = 'go' | 'step' | 'wait' | 'urgent'`; `toneClasses(tone: Tone): { band: string; chip: string; line: string; soft: string; ink: string }`; components `VerdictBand({ tone, text, aside })`, `StatusChip({ tone, text })`, `MoneyTile({ label, value, note, tone })`, `PageHeader({ title, sub, action })`, `Card({ children })`. Icons per tone: go check, step arrow, wait pause, urgent alert.
- Produces: test constants `MIGRATED_FILES: string[]` and `BANNED_WORDS: string[]` in `design-rules.test.ts`, which later tasks extend.

- [ ] **Step 1: Write the failing tests**

```ts
// Reads --uv-* hex values from globals.css and computes WCAG contrast.
it.each([
  ['go-ink', 'go-soft'], ['go-deep', 'go-fade'], ['on-go', 'go'],
  ['step-ink', 'step-soft'], ['step-deep', 'step-fade'],
  ['wait-ink', 'wait-soft'], ['urgent-ink', 'urgent-soft'], ['on-urgent', 'urgent'],
  ['act-ink', 'act-soft'], ['on-act', 'act'],
  ['ink', 'paper'], ['ink-2', 'paper'], ['ink-2', 'card'],
])('%s on %s has at least 4.5:1 contrast', (text, background) => { /* ... */ })
it('green and amber differ in lightness, not hue alone', ...)
it('migrated files use no raw colour classes or hex values', ...) // regex over MIGRATED_FILES
it('founder text uses none of the banned words', ...) // JSX text in MIGRATED_FILES, plus TEXT.en and founder text values
```

`BANNED_WORDS`: evidence, provenance, handoff, review-gated, review required, source-linked, research beta, preparation workspace, versioned, seeded, catalog. Raw colour regex: `\b(bg|text|border|from|to|via|ring|fill|stroke|divide|shadow)-(slate|neutral|gray|zinc|stone|indigo|violet|purple|blue|sky|cyan|teal|emerald|green|lime|yellow|amber|orange|red|rose|pink|fuchsia)-\d{2,3}\b`, and `#[0-9a-fA-F]{3,8}\b` in class strings.

- [ ] **Step 2: Run to verify they fail.** Run: `npx vitest run design-rules`. Expected: FAIL, tokens not found.

- [ ] **Step 3: Add tokens to `globals.css`** as `--uv-*` on `:root`, mapped in `@theme inline` so `bg-go-soft`, `text-go-ink`, `border-go-line` and so on work.

```css
--uv-go:#0B7A4B; --uv-on-go:#FFFFFF; --uv-go-soft:#E3F5EB; --uv-go-ink:#0B6B43; --uv-go-line:#BFE5CF; --uv-go-fade:#CDEEDB; --uv-go-fade-end:#F1FAF5; --uv-go-deep:#0B4F33;
--uv-step:#F2B233; --uv-step-soft:#FFF1CC; --uv-step-ink:#6E4200; --uv-step-line:#F5D98B; --uv-step-fade:#FFE7A8; --uv-step-fade-end:#FFF9E8; --uv-step-deep:#5C3700;
--uv-wait:#8A929E; --uv-wait-soft:#EBEDF1; --uv-wait-ink:#4A5361;
--uv-urgent:#C62F26; --uv-on-urgent:#FFFFFF; --uv-urgent-soft:#FDE9E7; --uv-urgent-ink:#A8201A;
--uv-act:#3F46E8; --uv-on-act:#FFFFFF; --uv-act-soft:#EEF0FF; --uv-act-ink:#2A2FB5;
--uv-paper:#F7F7F4; --uv-card:#FFFFFF; --uv-line:#E2E4E8; --uv-ink:#14181F; --uv-ink-2:#4A5361;
```

Add `.uv-band-go`, `.uv-band-step` (90deg fade with their deep text) and `.uv-band-wait` (flat `wait-soft`). Add `.uv-hero` (`linear-gradient(120deg,#2A2FB5,#3F46E8)`), used only on Home.

- [ ] **Step 4: Implement `tones.ts` and `founder.tsx`**, and add `src/components/ui/founder.tsx` to `MIGRATED_FILES`.

- [ ] **Step 5: Run to verify they pass.** Run: `npx vitest run design-rules`. Expected: PASS.

- [ ] **Step 6: Commit:** "Give each colour one meaning, and test it".

### Task 2: The verdict

**Files:**
- Create: `src/lib/founder/verdict.ts`
- Modify: `src/lib/start/i18n.ts`
- Test: `src/lib/founder/__tests__/verdict.test.ts`

**Interfaces:**
- Consumes: `RecordResult`, `Combination`, `Tone`, `formatDate`, `t`.
- Produces: `type Verdict = { tone: Tone; text: string; detail: string | null }`; `verdictFor(item: RecordResult, combination: Combination, lang: Lang, labelOf: (factKey: string) => string): Verdict`; `outsideVerdict(record: EngineRecord | undefined, facts: CanonicalFacts, lang: Lang, stateName: (code: string) => string): Verdict`.

- [ ] **Step 1: Write the failing tests.** A helper builds a `RecordResult`. One test per row, with exact English, first match top-down:

| Given | Text | Tone |
| --- | --- | --- |
| A, id in `recommended`, no `bankChecks` | You qualify. We suggest you apply first. | go |
| A, not recommended, no `bankChecks` | You qualify. Apply now. | go |
| A, recommended, `bankChecks` present | You qualify on what we could check. | go |
| B, 3 distinct `answer` steps | Answer 3 questions to find out. | step |
| B, 1 `answer` step | Answer 1 question to find out. | step |
| B, 1 `obtain` step labelled "Udyam" | Get this first: Udyam | step |
| B, `answer` and `obtain` steps | counts answers | step |
| B, no steps, `decidedBy` empty | We cannot check this for you yet. | step |
| B, no steps, `decidedBy` set (founder declined) | We cannot check this for you yet. | step |
| C, `pending_renewal`, even if stale | Renewal awaited | wait |
| C, `paused` | Paused | wait |
| C, `not_yet_open`, dated | Opens on (formatted date) | wait |
| C, `not_yet_open`, undated | Not open yet | wait |
| C, active, stale | Status not confirmed | wait |
| C, otherwise | Closed | wait |
| D, `failedFacts` | Not for you, `detail` names the labels | wait |
| D, `aboveLimitInr` | Not for you, `detail` gives the limit | wait |

`outsideVerdict`, the Review Focus 4 pin:

```ts
it('says a state scheme is for that state only', ...)      // "For Bihar only", wait
it('sends a registration to the path', ...)                // type registration or licence: "On My path", wait
it('says a record from another industry is not matched', ...) // "Not matched to your work", wait
it('never returns go, including for an unknown slug', ...)  // undefined record: "We cannot check this for you yet.", wait
```

Also: `it('has every verdict word in Hindi and Marathi')`.

- [ ] **Step 2: Run to verify they fail.** Run: `npx vitest run founder/__tests__/verdict`. Expected: FAIL, module not found.

- [ ] **Step 3: Add i18n keys and implement.** New keys in all three languages: `verdictApplyFirst`, `verdictApply`, `verdictChecked`, `verdictAnswerOne`, `verdictAnswerMany`, `verdictCannotCheck`, `verdictOpens`, `verdictNotOpen`, `verdictNotForYou`, `verdictStateOnly`, `verdictOnPath`, `verdictNotMatched`. Reuse `stepObtain`, `statusRenewal`, `statusPaused`, `statusClosed`, `statusUnconfirmed`, `whyFacts`, `aboveLimit`. Change English `bucketA` to "You can apply now". Update tests that assert the old words.

- [ ] **Step 4: Run to verify they pass.** Run: `npm test`. Expected: all pass.

- [ ] **Step 5: Commit:** "Say plainly whether a founder qualifies".

### Task 3: Loading results, and answers in words

**Files:**
- Create: `src/lib/founder/load-results.ts`, `src/lib/founder/answers.ts`
- Modify: `src/lib/opportunities/engine/catalog.ts`, `load-catalog.ts`, `types.ts`, `results.ts`, `scripts/mvp-export-engine-snapshot.mjs`, `src/lib/opportunities/engine/__tests__/snapshot.ts`, `src/app/(dashboard)/dashboard/page.tsx`
- Test: `src/lib/founder/__tests__/load-results.test.ts`, `answers.test.ts`, additions to `catalog-rows.test.ts`

**Interfaces:**
- Produces: `EngineRecord` and `RecordResult` gain `applyRoute: string | null` and `benefitHeadline: string | null`. They come from `opportunity_versions.application` (through `applicationView`) and `benefit_summary.headline`, and text passing `isInternalNote` becomes null.
- Produces:

```ts
type FounderResults =
  | { status: 'no_answers'; bundle: StartBundle | null }
  | { status: 'unavailable' }
  | { status: 'ready'; facts: CanonicalFacts; nonAnswers: Record<string, NonAnswer>; answers: Record<string, unknown>; results: ResultsPayload; bundle: StartBundle; catalog: EngineCatalog }
loadFounderResults(supabase: SupabaseClient, userId: string, now?: Date): Promise<FounderResults>
factLabelsOf(bundle: StartBundle): Record<string, Text>
answerText(factKey: string, value: unknown, bundle: StartBundle, lang: Lang): string | null
answerWordsFor(answers: Record<string, unknown>, bundle: StartBundle): Record<string, Text>
checkedFacts(item: RecordResult, answerWords: Record<string, Text>, labels: Record<string, Text>, lang: Lang): { key: string; label: string; answer: string }[]
```

- [ ] **Step 1: Write the failing tests.**

```ts
// answers.test.ts
it('names an option in the chosen language', ...)        // state: jharkhand -> "Jharkhand"
it('names chosen activities', ...)                       // activity_codes -> "Pond fish farming"
it('says Yes and No', ...)
it('says a non-answer in words', ...)                    // dont_know, prefer_not
it('returns null for no answer', ...)
it('lists only what the rule read and the founder answered', ...) // checkedFacts

// load-results.test.ts, using the fake Supabase from founder-facts-route.test, snapshotCatalog and seedBundle
it('is no_answers without an activity', ...)
it('is no_answers when old free text is all there is', ...) // Review Focus 2: state "Mumbai", sector "Food"
it('is unavailable when the catalog is down', ...)
it('is unavailable when the facts cannot be read', ...)
it('is ready with results for a real founder', ...)      // pond_fish, jharkhand: KCC in bucket A
```

- [ ] **Step 2: Run to verify they fail.** Run: `npx vitest run founder/__tests__ catalog-rows`. Expected: FAIL.

- [ ] **Step 3: Implement.** Extend the `versions` select to `id, title, application, benefit_summary`. Move Home's `founderResults` into `loadFounderResults` and make Home use it. Run `node scripts/mvp-export-engine-snapshot.mjs` to refresh the snapshot with the new fields (read-only on the database).

- [ ] **Step 4: Run to verify they pass.** Run: `npm test`. Expected: all pass.

- [ ] **Step 5: Commit:** "Load a founder's results once, and put answers into words".

### Task 4: One scheme card

**Files:**
- Create: `src/lib/founder/card.ts`, `src/components/founder/VerdictCard.tsx`
- Modify: `src/components/start/ResultsView.tsx`, `src/lib/start/api.ts`, `src/app/api/onboarding/answer/route.ts`, `src/lib/start/i18n.ts`
- Delete: `src/components/start/SchemeCard.tsx`
- Test: `src/lib/founder/__tests__/card.test.ts`, addition to `answer-route.test.ts`

**Interfaces:**
- Consumes: `verdictFor`, `answerWordsFor`, `checkedFacts`, `factLabelsOf`.
- Produces: `cardContent(item, combination, lang, labels, answerWords): CardContent`, with `CardContent = { verdict: Verdict; why: string | null; nextStep: string | null; money: { label: string; value: string; note: string | null; tone: 'go' | 'plain' | 'step' } | null; noAmount: boolean; toAnswer: string[]; couldMean: string | null; ifRenewed: boolean; bankChecks: string[]; checkedOn: string | null }`.
- Produces: `VerdictCard({ item, combination, lang, labels, answerWords, detailHref, answerHref })`. `StepResponse` gains `answerWords: Record<string, Text>`.

- [ ] **Step 1: Write the failing tests.**

```ts
it('says why it fits using the founder\'s own answer', ...) // A: "Why it fits you: you said Pond fish farming."
it('gives the application route as the next step', ...)    // A with applyRoute
it('falls back to the official source when no route is stored', ...)
it('shows free money in green when there is a subsidy', ...)
it('shows a loan as a plain tile with the interest note', ...) // "7% interest, effectively 4% if repaid on time"
it('does not ask for a project cost the founder gave', ...) // A, no lines: noAmount true, text "We have not worked out an amount yet."
it('lists what to answer, and what it could mean, for one step away', ...) // B: toAnswer labels, couldMean = benefitHeadline
it('shows what a renewed scheme could be worth', ...)      // C with lines.ifRenewed
it('marks a stale date for the card', ...)
```

Plus in `answer-route.test.ts`: `it('returns the founder\'s answers in words')`.

- [ ] **Step 2: Run to verify they fail.** Run: `npx vitest run founder/__tests__/card answer-route`. Expected: FAIL.

- [ ] **Step 3: Implement.** The card follows the mock-up: band on top, name, why, next step, money tile, buttons. `/start/results` uses `/schemes/{slug}` for signed-out visitors and `/dashboard/schemes/{slug}` for signed-in ones. Replace the `noAmount` text with "We have not worked out an amount yet." Add the card to `MIGRATED_FILES`.

- [ ] **Step 4: Run to verify they pass, then check in a browser.** Run: `npm test`, then the walks in the session's scratch `browser/` folder (Playwright with system Chrome, real catalog) on `/start/results`, updating "Eligible now" to "You can apply now". Expected: all pass; fits 320px.

- [ ] **Step 5: Commit:** "Show one scheme card everywhere".

### Task 5: Schemes for you

**Files:**
- Modify: `src/app/(dashboard)/dashboard/schemes/page.tsx` (rewrite as a server page), `src/components/layout/Sidebar.tsx`
- Create: `src/lib/founder/browse.ts`, `src/lib/founder/text.ts`, `src/components/founder/SchemesForYou.tsx`, `src/components/founder/BrowseAll.tsx`
- Test: `src/lib/founder/__tests__/browse.test.ts`

**Interfaces:**
- Consumes: `loadFounderResults`, `VerdictCard`, `verdictFor`, `outsideVerdict`, `searchPublishedOpportunities`, `TYPE_FILTERS`.
- Produces: `ft(key: FounderTextKey, values?): string`; `chipFor(slug: string, founder: FounderResults, lang: Lang): Verdict | null`; `browseView(input: { rows: OpportunitySummary[]; availability: CatalogAvailability; query: string; type: string; group: string }): { kind: 'list' | 'none_found' | 'unavailable'; rows: OpportunitySummary[]; groups: { id: string; label: string; count: number }[] }`; `answersLine(answers, bundle, lang): string`.

- [ ] **Step 1: Write the failing tests.**

```ts
it('gives a verdict chip to a scheme in the founder\'s results', ...)
it('gives a grey chip to one outside them', ...)
it('gives no chip to a founder with no answers', ...)
it('finds nothing without pretending the catalog is empty', ...)  // Review Focus 5: kind none_found
it('says when the catalog cannot be reached', ...)                // Review Focus 5: kind unavailable
it('filters by type and by group', ...)
it('treats a search full of symbols as no matches', ...)          // Review Focus 5: query "%' <", no rows: none_found, query kept
it('sums up the answers in one line', ...)                        // "pond fish farming, Ranchi, Jharkhand, setting up, ₹5–10 lakh project"
```

- [ ] **Step 2: Run to verify they fail.** Run: `npx vitest run founder/__tests__/browse`. Expected: FAIL.

- [ ] **Step 3: Implement.** Follow the mock-up.
  - `searchParams: Promise<{ view?: string; q?: string; type?: string; group?: string }>`. `q` or `type` opens Browse all.
  - Heading "Schemes for you". Tabs "For you (N)" and "Browse all (M)".
  - Sections in order: You can apply now, One step away, Closed or waiting. Hide empty sections. Not for you is a `<details>`, collapsed.
  - `no_answers`: a "Tell us about you" card linking to `/start`, then Browse all. `unavailable`: `tryAgainTitle`, then Browse all.
  - Browse rows link to `/dashboard/schemes/{id}`. The accordion goes.
  - Remove stat tiles, the "Catalog status" box, Share, and "ranked for your business". Save and Start move to Task 6.
  - The final decision line sits under the page heading.
  - Sidebar: "Opportunities" becomes "Schemes for you".
  - Add these files to `MIGRATED_FILES`.

- [ ] **Step 4: Run to verify they pass.** Run: `npm test`, `npx tsc --noEmit`, `npx eslint src scripts`, then open `/dashboard/schemes?q=%25'%3C` in a browser. Expected: clean, and the search shows the "no match" message.

- [ ] **Step 5: Commit:** "Show founders their schemes, not the whole catalog".

### Task 6: One scheme in detail

**Files:**
- Modify: `src/app/(dashboard)/dashboard/schemes/[slug]/page.tsx`, `src/lib/opportunities/published.ts:207`
- Create: `src/lib/founder/detail.ts`, `src/components/founder/SchemeActions.tsx`
- Test: `src/lib/founder/__tests__/detail.test.ts`

**Interfaces:**
- Consumes: `getPublishedOpportunity`, `loadFounderResults`, `chipFor`, `checkedFacts`, `Relationship`.
- Produces: `suggestionFor(item, combination, lang): string | null`; `moneyTiles(lines: BenefitLines, lang): { label: string; value: string; note: string | null; tone: 'go' | 'step' | 'plain' }[]`; `keepReady(requirements: { name: string; required: boolean }[], answers): { name: string; required: boolean; have: boolean }[]`; `connectedSchemes(item, results, relationships, lang, labelOf): { slug: string; title: string; verdict: Verdict; note: string | null }[]`.

- [ ] **Step 1: Write the failing tests.**

```ts
it('suggests only for bucket A in the best route', ...)
it('says what is left to arrange in the suggestion', ...)
it('makes no suggestion when the amount is unknown', ...)
it('shows loan, interest, free money and still to arrange', ...)  // KCC: Up to ₹2,00,000; 4%; ₹0; ₹3–8 lakh
it('marks a document the founder said they have', ...)            // has_pan true -> "PAN card"
it('needs every fact for a combined document', ...)               // "Aadhaar and PAN" with only has_pan: have false
it('never marks "no" or "don\'t know" as having it', ...)
it('links the best route and its alternatives both ways', ...)
it('explains a scheme that cannot be combined', ...)              // exclusive row: note from note_en
```

Fact matching for `keepReady`: Aadhaar `aadhaar_mobile_linked`; PAN `has_pan`; bank account `has_bank_account`; Udyam `udyam_registered`; GST `gst_registered`; Shop Act `shop_act_registered`; training `training_certificate`; DPIIT `dpiit_recognized`; FSSAI `fssai_status`; land, pond or lease `land_or_pond_status`. Read the allowed values from `supabase/seed/mvp/facts.json` to decide which mean "has it".

- [ ] **Step 2: Run to verify they fail.** Run: `npx vitest run founder/__tests__/detail`. Expected: FAIL.

- [ ] **Step 3: Implement.** Order from spec Section 4.1:
  1. Band, name, summary.
  2. Our suggestion, and actions.
  3. Money tiles.
  4. What we checked, then "The bank or department will check".
  5. Keep ready.
  6. What to do, and Connected to this.
  7. Where this comes from: the rate's quote where one exists, source links, checked date.

  Fixed links: My path (`/dashboard/registration` until Stage 4), My documents, About me. Hide empty sections. A signed-in founder with no answers sees a "Tell us about you" card instead of a verdict. If results are unavailable, the record still shows, with `tryAgainTitle` in place of the verdict. The final decision line sits under the band.

  `SchemeActions` keeps the existing `/api/saved-opportunities` and `/api/applications` calls, labelled "Save for later" and "Start my application checklist", or "Open my application" when one exists. The page's server query finds the existing application by opportunity slug. In `published.ts:207`, drop the "Research Beta source" label and use `Official source`. Add these files to `MIGRATED_FILES`.

- [ ] **Step 4: Run to verify they pass.** Run: `npm test`. Expected: all pass.

- [ ] **Step 5: Commit:** "Tell a founder what a scheme means for them".

### Task 7: Stage 1 gate

- [ ] **Step 1: Full checks.** Run: `npm test`, `npx tsc --noEmit`, `npx eslint src scripts`, `npm run build:next`. Expected: all clean.
- [ ] **Step 2: Preview.** Run: `npx --yes vercel@latest deploy --yes`. Then browser walks at 390px and 320px with the preview token. Expected: internal-link audit shows at least 3 on a detail page; banned words absent from rendered text. With approved test accounts, also run the three personas signed in.
- [ ] **Step 3: Independent review** of this stage's commits on the most capable model, using the Review Focus lines. Re-grade findings; fix Critical and Important, each test-first; record minors.
- [ ] **Step 4: Owner check.** Send the preview link with 2 or 3 things to look at. **Stop and wait.** Merge only on the owner's yes.
- [ ] **Step 5: Go live.** Run: `git switch main`, `git merge --ff-only mvp/m3-founder-redesign`, `npm test`, `git push origin main`, then `git switch mvp/m3-founder-redesign`. Wait for the production build; check domains, health and error logs.

---

# Stage 2: About me and asking the basics

### Task 8: About me data, and protecting newer answers

**Files:**
- Create: `src/lib/founder/about.ts`
- Modify: `src/app/api/founder/facts/route.ts`, `src/lib/businesses/dal.ts`, `src/lib/start/api.ts`, `src/lib/start/sync.ts`, `src/lib/start/next-screen.ts`
- Test: `src/lib/founder/__tests__/about.test.ts`, additions to `founder-facts-route.test.ts`, `sync.test.ts`, `api.test.ts`

**Interfaces:**
- Produces:

```ts
aboutGroups(input: { bundle: StartBundle; answers: Record<string, unknown>; results: ResultsPayload | null; lang: Lang }): {
  id: 'you' | 'where' | 'business' | 'money' | 'have'; title: string
  rows: { questionId: string; label: string; answer: string | null; state: 'answered' | 'non_answer' | 'empty'; decides: { slug: string; title: string }[]; tone: 'step' | null }[]
}[]
questionsForFacts(factKeys: string[], facts: Record<string, unknown>, bundle: StartBundle): ScreenQuestion[]  // next-screen.ts
deleteFounderFacts(): Promise<boolean>                                  // api.ts
DELETE /api/founder/facts -> { deleted: number } | 401 | 500 (save_failed)
```

- `FounderState` and `GET /api/founder/facts` gain `updatedAt: string | null`. `PUT` writes `updated_at` on each row, and `getBusinessFacts` selects it.
- Groups: **you** `q_age q_gender q_category q_minority q_disability q_ex_serviceman q_education`; **where** `q_state q_district q_area`; **money** `q_project_cost q_exact_cost q_own_money q_needs_loan q_income q_prior_subsidy`; **have** `q_have`; **business** every other question.

- [ ] **Step 1: Write the failing tests.**

```ts
// about.test.ts
it('puts every seeded question in exactly one group', ...)        // all 40
it('hides questions that do not apply', ...)                      // poultry count for a tech founder; depends_on false
it('marks an empty row amber and names the scheme it decides', ...) // q_age with MRSY: step, decides [{ slug: 'mukhyamantri-rojgar-srijan-yojana-jharkhand', title: ... }]
it('leaves an empty row plain when it decides nothing', ...)
it('shows a non-answer in words and keeps it plain', ...)
it('lists the ticked items for the things-you-have question', ...)

// founder-facts-route.test.ts
it('deletes the answers and keeps the account', ...)
it('refuses to delete for nobody', ...)                           // 401
it('reports a failed delete', ...)                                // 500
it('stamps when answers were saved', ...)

// sync.test.ts, Review Focus 1
it('asks when an older draft of your own differs from newer saved answers', ...) // kind 'ask'
it('uses saved answers when the older draft says the same', ...)  // kind 'use_account'
it('still saves a newer draft', ...)                              // use_draft, save true
it('still saves when the account has no date', ...)               // older accounts
```

- [ ] **Step 2: Run to verify they fail.** Run: `npx vitest run founder/__tests__/about founder-facts-route sync api`. Expected: FAIL.

- [ ] **Step 3: Implement.** Compare `draft.updatedAt` with `founder.updatedAt` in `resolveDraft`, and ask instead of silently choosing, so a wrong phone clock cannot lose answers. `DELETE` removes `business_facts` rows for every key in `catalog.definitions`, and clears `state`, `district` and `lifecycle_stage` on the business. It keeps `name` and the account.

- [ ] **Step 4: Run to verify they pass.** Run: `npm test`. Expected: all pass.

- [ ] **Step 5: Commit:** "Let founders see and delete their answers, and protect newer ones".

### Task 9: Asking once, without forcing

**Files:**
- Create: `src/lib/founder/ask.ts`
- Modify: `src/app/(dashboard)/dashboard/page.tsx`, `src/components/start/StartFlow.tsx`, `src/lib/start/i18n.ts`
- Test: `src/lib/founder/__tests__/ask.test.ts`

**Interfaces:**
- Produces: `SKIP_COOKIE = 'uv_questions_skipped'`; `shouldAskFirst(founder: FounderResults, skipped: boolean): boolean`; `nextToAnswer(results: ResultsPayload): { slug: string; title: string; count: number; headline: string | null } | null`.

- [ ] **Step 1: Write the failing tests.**

```ts
it('asks a founder with no answers who has not skipped', ...)
it('does not ask after a skip', ...)
it('does not ask a founder with answers', ...)
it('does not redirect when results are unavailable', ...)        // Review Focus 3
it('picks the one-step-away scheme needing the fewest answers', ...)
it('picks by name when two need the same number', ...)
it('has nothing to ask when no scheme waits on an answer', ...)
```

- [ ] **Step 2: Run to verify they fail.** Run: `npx vitest run founder/__tests__/ask`. Expected: FAIL.

- [ ] **Step 3: Implement.**
  - In `/dashboard`: when `AUTH_REQUIRED` and a user exists, read the cookie with `await cookies()` and `redirect('/start')` when `shouldAskFirst`.
  - `StartFlow` calls `fetchFounder()` and, for a signed-in founder only, shows "Skip for now". Tapping it sets `uv_questions_skipped=1; path=/; max-age=31536000; samesite=lax` and goes to `/dashboard`.
  - Home shows a large "Tell us about you" card for `no_answers`, and a "Answer N questions" card from `nextToAnswer`, naming the scheme and headline. Stage 3 rebuilds the rest of Home.

- [ ] **Step 4: Run to verify they pass.** Run: `npm test`. Expected: all pass.

- [ ] **Step 5: Commit:** "Ask new founders once, and let them skip".

### Task 10: The About me page and one-at-a-time questions

**Files:**
- Modify: `src/app/(dashboard)/dashboard/settings/page.tsx`, `src/components/layout/Sidebar.tsx`
- Create: `src/components/founder/AboutMe.tsx`, `src/components/founder/AccountTab.tsx`, `src/app/(dashboard)/dashboard/settings/questions/page.tsx`, `src/components/founder/AskOneByOne.tsx`
- Test: additions to `about.test.ts`, `design-rules.test.ts`

**Interfaces:**
- Consumes: `aboutGroups`, `nextToAnswer`, `questionsForFacts`, `QuestionField`, `applyAnswers`, `numberProblem`, `saveFounderFacts`, `deleteFounderFacts`, `clearDraft`, `GTM_TOOLS_ENABLED`.
- Produces: `aboutBanner(groups, nextToAnswer): { title: string; body: string } | null`; `questionsForScheme(item: RecordResult, facts, bundle): ScreenQuestion[]`.

- [ ] **Step 1: Write the failing tests.**

```ts
it('offers the banner when answers could unlock a scheme', ...) // "6 answers could unlock 40% subsidy (up to ₹5 lakh) on a loan at 6%"
it('has no banner when nothing waits on an answer', ...)
it('asks one question per missing fact, without repeats', ...)  // questionsForScheme
it('asks nothing for obtain steps', ...)
it('the settings page keeps marketing tabs behind the flag', ...) // source scan for GTM_TOOLS_ENABLED
```

- [ ] **Step 2: Run to verify they fail.** Run: `npx vitest run founder/__tests__/about design-rules`. Expected: FAIL.

- [ ] **Step 3: Implement.**
  - `settings/page.tsx` becomes a server page, loading `FounderResults` and the bundle, with tabs About me (default) and Account (name and business name). Modules and Integrations show only when `GTM_TOOLS_ENABLED`. The sector, stage, state and district boxes go.
  - Each row edits inline with `QuestionField`, and names the schemes in `decides` as links. Save sends all answers through `saveFounderFacts`. On failure the answer stays with "Could not save. Try again".
  - After a save or delete: `clearDraft()` and `router.refresh()`.
  - "Delete my answers" confirms first. "We never ask for your Aadhaar or PAN number" appears on the page.
  - `settings/questions?for={slug}` shows one question at a time with "Save and continue" and "Skip for now", ending on the scheme's page. A missing or unknown `for` returns to About me.
  - Sidebar: "Settings" becomes "About me". Add these files to `MIGRATED_FILES`.

- [ ] **Step 4: Run to verify they pass.** Run: `npm test`. Expected: all pass.

- [ ] **Step 5: Commit:** "Give founders an About me page".

### Task 11: Stage 2 gate

- [ ] Same five steps as Task 7. The walk also covers: edit an answer and see schemes change; delete answers; skip the first ask and confirm it does not return; Review Focus 1 and 3.

---

# Stage 3: Colours, labels and remaining pages

### Task 12: Home

**Files:**
- Modify: `src/app/(dashboard)/dashboard/page.tsx`, `src/app/(dashboard)/dashboard/layout.tsx`, `src/components/layout/Sidebar.tsx`
- Create: `src/lib/founder/home.ts`
- Test: `src/lib/founder/__tests__/home.test.ts`

**Interfaces:**
- Produces: `homeView(founder: FounderResults, lang: Lang): { headline: string; sub: string | null; counts: Record<'A' | 'B' | 'C', number>; tasks: { title: string; body: string; href: string; tone: 'step' | 'go' | 'plain'; action: string }[]; money: { loan: string | null; free: string | null; toArrange: string | null } | null; waiting: { title: string; body: string } | null; bestHref: string | null } | null`.

- [ ] **Step 1: Write the failing tests.**

```ts
it('counts open schemes in the headline', ...)        // "3 schemes are open for you today"
it('says 1 scheme is open', ...)
it('is honest when none is confirmed', ...)           // "No scheme is confirmed open for you yet"
it('names the best first step', ...)                  // KCC with its amount and rate
it('puts answering first, then the best scheme, then Udyam', ...)
it('leaves out tasks that do not apply', ...)         // udyam_registered true drops the Udyam task
it('shows what a renewal could be worth', ...)
it('adds up money for the best route only', ...)
```

- [ ] **Step 2: Run to verify they fail.** Run: `npx vitest run founder/__tests__/home`. Expected: FAIL.

- [ ] **Step 3: Implement from the mock-up.** The final decision line sits under the counts. Remove the "Discover. Apply. Grow." banner, the module cards, the category grid, the readiness score and "Next action". Header and Sidebar move to tokens. Sidebar: "Applications" becomes "My applications", "Document Vault" becomes "My documents". Add files to `MIGRATED_FILES`.

- [ ] **Step 4: Run to verify they pass.** Run: `npm test`. Expected: all pass.

- [ ] **Step 5: Commit:** "Open Home on what a founder should do next".

### Task 13: Applications and documents

**Files:**
- Modify: `src/app/(dashboard)/dashboard/applications/page.tsx`, `applications/[id]/page.tsx`, `documents/page.tsx`, `src/components/applications/ApplicationWorkspaceControls.tsx`, `DocumentLinker.tsx`, `ConciergeRequestForm.tsx`
- Test: `design-rules.test.ts`

- [ ] **Step 1: Add these six files to `MIGRATED_FILES`.**
- [ ] **Step 2: Run to verify it fails.** Run: `npx vitest run design-rules`. Expected: FAIL, naming the raw colour classes and banned words.
- [ ] **Step 3: Migrate to tokens and plain words.** Status colours: approved and clean are `go`; started and in progress are `step`; rejected and failed are `urgent`; closed and withdrawn are `wait`. Remove the dead "Request help" button (the form is on the application page). "Eligibility snapshot" becomes "When you started", without the version number. Each application links to its scheme page. Documents link to Schemes for you until Stage 4 adds per-document links.
- [ ] **Step 4: Run to verify it passes.** Run: `npm test`. Expected: all pass.
- [ ] **Step 5: Commit:** "Use plain words and real status colours on applications and documents".

### Task 14: Questions, results and sign-in

**Files:**
- Modify: `src/components/start/StartFlow.tsx`, `ResultsView.tsx`, `QuestionField.tsx`, `ActivityPicker.tsx`, `LanguageSwitch.tsx`, `src/app/start/layout.tsx`, `src/app/(auth)/login/page.tsx`, `src/app/(auth)/signup/page.tsx`, `src/lib/start/i18n.ts`
- Create: `src/lib/auth/login-method.ts`
- Test: `src/lib/auth/__tests__/login-method.test.ts`, `design-rules.test.ts`

**Interfaces:**
- Produces: `defaultLoginMethod(requested: string | null, phoneEnabled: boolean): 'phone' | 'email'`.

- [ ] **Step 1: Write the failing tests.**

```ts
it('opens on email while mobile sign-in is off', ...)
it('opens on mobile when it is on', ...)
it('respects a requested method', ...)
it('does not promise mobile sign-in while it is off', ...) // saveBody offers email unless the flag is on
```

Add these files to `MIGRATED_FILES`.

- [ ] **Step 2: Run to verify they fail.** Run: `npx vitest run login-method design-rules`. Expected: FAIL.
- [ ] **Step 3: Implement.** Move to tokens and shared parts. Add `saveBodyEmail` in all three languages and pick by the flag.
- [ ] **Step 4: Run to verify they pass.** Run: `npm test`, then browser walks at 390px and 320px in English and Hindi. Expected: all pass.
- [ ] **Step 5: Commit:** "Match the questions and sign-in to the new colours".

### Task 15: Stage 3 gate

- [ ] Same five steps as Task 7. In addition, compare screenshots of every migrated page against the mock-ups before the owner check. After going live, the finish steps of the chosen execution skill apply, except that the Registration and Compliance pages stay until Stage 4's plan replaces them.

## Not in this plan

- Stage 4, My path: its own plan after Stage 3 ships, with `roadmap_items`, `document_definitions`, `document_requirements`, the readiness score, share and print, researched content, and per-document links.
- Registration and Compliance keep their old look until then, because Stage 4 removes them.
