# Founder product redesign: design

- **Date:** 31 October 2026
- **Status:** Written for the owner's review. No product code until this is approved.
- **Mock-ups:** https://claude.ai/artifact/QvT3gP8pFMPKQG5Pt5A1fD
- **Builds on:** `docs/product/udyamveda-mvp-prd-v1.md`, `docs/superpowers/plans/2026-10-31-mvp-roadmap.md`

## 1. What this is for

**What the owner said (31 Oct 2026, after using the live product):** the content is slop, pages do not link to each other, colour carries no meaning, detail pages are thin, every scheme is shown instead of the ones that matter, no scheme says whether the person qualifies or should apply, there is no place to change their details, and the platform does not ask for basics like category, age and location.

**The outcome:** on every page, a founder can see what fits them and what to do next, without reading everything.

**Done means:**

1. A signed-in founder with answers opens Schemes and sees only their schemes, sorted by verdict. The full list is one tap away, not the default.
2. Every scheme says in plain words whether they qualify and whether to apply, and gives the reason using their own answers.
3. Every detail page links to at least three other useful places in the product.
4. Each colour means one thing everywhere, and a test fails if a page breaks that.
5. A founder can see and change every answer in About me, and is asked for missing ones without being forced.
6. No two items on My path share template text for cost or time. Where a fact is not researched, the page says so honestly.

**Assumed, for the owner to correct:**

- Asking stays skippable, as the owner turned forced onboarding off on purpose.
- The owner's myScheme screenshots have not been received. Section 4.3 follows the PRD's order and is revisited when they arrive.
- The marketing website, admin pages and hidden marketing tools are not redesigned here.
- English comes first on the dashboard pages. Hindi and Marathi for them stay in M5, but all new text goes through the existing translation keys so nothing has to be rewritten.

## 2. Why it looks this way today

M1 and M2 built the engine that decides who qualifies, but only `/start/results` and one card on Home use it.

| Page | What is wrong |
| --- | --- |
| Opportunities | Lists all 187 records from `/api/opportunities` and never calls the engine, yet says "ranked for your business" |
| Scheme detail | No verdict. Its only internal link goes back to the list. Internal words like "Research Beta source" reach founders |
| Compliance | Cost and time come from one template line ([compliance-roadmap.ts:71-72](../../../src/lib/data/compliance-roadmap.ts)). Everyone gets the same 10 items. The calendar is always empty |
| Registration | The same 10 journeys as Compliance, shown again, each marked "Review required" |
| Settings | Six free-text boxes, plus tabs for marketing tools that are hidden |
| Everywhere | Over 1,000 raw colour classes across 14 colour families, used as decoration. The same purple banner tops most pages |

## 3. Shared rules

These apply to all four stages.

### 3.1 Colour

| Colour | Means | Used for |
| --- | --- | --- |
| Green | Go | You qualify, open, done, free money |
| Amber | One thing needed | Answer something, get something, still to arrange |
| Grey | Not now | Closed, waiting, not for you, not needed yet |
| Red | Act soon | A close deadline or a real penalty. Rare on purpose |
| Indigo | Click, or our advice | Buttons, links, our suggestion. Never a status |

- White cards on warm paper. A soft fade appears only on a verdict band. One bold gradient appears only on the Home banner.
- Every status also has an icon and a plain word, so nobody relies on colour alone.
- Money: free money is green, a loan is black, your own money is black, still to arrange is amber.
- Text meets 4.5:1 contrast, and colours that must be told apart also differ in lightness.

### 3.2 Verdict words

One pure function, `verdictFor(item, combination)`, turns an engine `RecordResult` into words and a colour. Every page uses it, so a scheme never says two different things.

| Engine result | Band says | Colour |
| --- | --- | --- |
| A, in the best route, no bank checks open | You qualify. We suggest you apply first. | Green |
| A, no bank checks open | You qualify. Apply now. | Green |
| A, bank checks open | You qualify on what we could check. | Green |
| B, with answer steps | Answer N questions to find out. | Amber |
| B, with obtain steps | Get this first: (the thing) | Amber |
| B, rule tests nothing about the founder | We cannot check this for you yet. | Amber |
| C, status `pending_renewal` | Renewal awaited | Grey |
| C, status `paused` | Paused | Grey |
| C, window not yet open | Opens on (date) | Grey |
| C, stale check | Status not confirmed | Grey |
| C, otherwise | Closed | Grey |
| D | Not for you, with the reason | Grey |

Every verdict carries "The final decision is made by the bank or department", at least once per page. Verdicts come only from the rules engine. No AI decides or words them. The explainer stays in M6.

### 3.3 Plain words

Removed from founder pages: evidence, provenance, handoff, review-gated, review required, source-linked, research beta, preparation workspace, versioned, seeded, catalog. A test fails if they return.

| Today | Becomes |
| --- | --- |
| Evidence detail | See full details |
| Opportunities | Schemes for you |
| Registration & Licences, Compliance | My path |
| Applications, Document Vault | My applications, My documents |
| Settings | About me |

### 3.4 Links between pages

| From | Links to |
| --- | --- |
| Home | Top scheme, each bucket, next tasks, About me, My path |
| Scheme list | Scheme detail, About me (to change answers or answer missing ones) |
| Scheme detail | Schemes in the same route or alternatives, the questions it still needs, My path steps it needs, My documents, About me |
| My path step | Schemes that need it, My documents, official source |
| My documents | Schemes and path steps that need each document |
| About me row | The schemes that answer affects |

## 4. The four stages

Each stage ships on its own: branch, tests, preview, merge, then live.

### 4.1 Stage 1: Schemes for you and the verdict

**Why first:** it is the owner's biggest complaint, and the engine already exists.

**Data.** A new server helper, `loadFounderResults(supabase, userId)`, moves the logic out of the Home page and returns one of `no_answers`, `unavailable`, or `ready` with facts, non-answers, the results and answer labels.

**`/dashboard/schemes`** becomes a server page.

- **For you (default):** a sentence of the founder's own answers with a link to change them, then the buckets in order: You can apply now, One step away, Closed or waiting. Not for you stays collapsed, with its reasons.
- **Browse all (`?view=all`):** the existing search over 187 records, with a verdict chip on each. Other states' schemes say "For (state) only". Registrations say "On My path".
- **Each card:** verdict band, name, why it fits, the next step, and the amount or a plain "we have not worked out an amount yet". This replaces the wording that asks for a project cost the founder already gave.
- **Stat tiles and "Catalog status" box:** removed. They describe our database, not the founder.
- The false "ranked for your business" line goes.

**`/dashboard/schemes/[slug]`** keeps its real content and gains, in this order:

1. Verdict band, name, one-line summary.
2. **Our suggestion**, from fixed templates, shown only for bucket A in the best route: start here, what it covers, what is left to arrange.
3. **Money tiles** from `lines`: loan, interest, free money, still to arrange.
4. **What we checked:** each `decidedBy` fact with the founder's own answer and a tick. Then "The bank or department will check", from `bankChecks`.
5. **Keep ready**, marking anything the founder already said they have.
6. **What to do:** steps. **Connected to this:** schemes from `combination.alternatives` and `scheme_relationships`, each with its verdict.
7. **Where this comes from:** the source quote where a rate has one, source links and the checked date.

A scheme with a thin record hides empty sections rather than showing filler.

`/start/results` uses the same card, so a founder sees the same thing before and after signing in.

### 4.2 Stage 2: About me

`/dashboard/settings` gets a new default tab, About me, and Account keeps name and business name. Modules and Integrations are hidden while marketing tools are off.

- Rows are grouped: You, Where you are, Your business, Money, What you have. A test fails if a founder question belongs to no group.
- Each row shows the answer in words, with Change or Answer. Editing reuses `QuestionField`, `applyAnswers`, `numberProblem` and `PUT /api/founder/facts`, so its checks already apply.
- An unanswered row is amber if it decides a scheme, and names it. Otherwise it stays plain.
- Free-text sector, stage, state and district boxes go. Those answers now come from the question list, so a typed state can no longer break matching.
- **Delete my answers** arrives here, ahead of M5, because the page now shows those answers: `DELETE /api/founder/facts` with a confirmation. It removes the answers only, not the account.

### 4.3 Stage 2: Asking the basics

The PRD's order stays: first result after step 7, then "About you" at step 8, each answer optional with its reason shown.

- **First time:** a signed-in founder with no activity answer who has not skipped goes from `/dashboard` to `/start`, once. `/start` shows **Skip for now** to signed-in founders. Skipping sets a cookie and returns them to the dashboard, which then shows a large "Tell us about you" card. Their account is never blocked.
- **After the first result:** Home's first task becomes "Answer N questions", naming what it could unlock, for as long as a scheme is waiting on answers.
- **Answering:** a one-question-at-a-time screen, as in the mock-up, at `/dashboard/settings/questions?for=(scheme)`, built on the existing flow.

This changes the standing rule that questions are only offered. It stays optional, but it is now a real ask.

### 4.4 Stage 3: Colours, labels and remaining pages

- Tokens for the Section 3.1 colours go in `src/app/globals.css`.
- Shared parts: `VerdictBand`, `StatusChip`, `MoneyTile`, `PageHeader`, `Card`.
- Pages: Home, Schemes, Scheme detail, My applications and its detail page, My documents, About me, `/start`, results, login and signup.
- **Home** is rebuilt from the mock-up: a personal banner, bucket counts, "Do these next", the project money and what is waiting. The readiness score leaves Home until Stage 4 can compute a real one, because today's number only counts ticks on a generic list.

### 4.5 Stage 4: My path

This is roadmap M3, shown as one page. `/dashboard/registration` and `/dashboard/compliance` redirect to `/dashboard/path`.

- **Data:** the roadmap's `roadmap_items` (stage 0 to 9, `applies_when` rules, `depends_on`, `done_fact_key`, optional `opportunity_id`), plus `document_definitions` and `document_requirements`.
- **Each founder sees** only items whose rules apply, in order: Done, Do this now (one item), Coming up, Not needed yet.
- **Each item has** real cost, time, why it applies to you, the common mistake from PRD Section 5.1, steps, official source, checked date, and links to the schemes that need it.
- **Filing dates** appear only where a sourced record supplies a real date.
- **Readiness score and share or print**, as the roadmap defines them.

**Content is the real work.** Facts are researched from official sources, with a source link and checked date on each item, and go through the owner's approval like other catalog data. Order: the common core for the 5 states, then fisheries, poultry and tech. An item not yet researched says "Ask at the office; we have not confirmed this yet" and never shows template text.

## 5. When something is missing or fails

| Situation | What the founder sees |
| --- | --- |
| No answers yet | Schemes opens on a "Tell us about you" card with Browse all below it, and no verdicts are guessed |
| Engine or catalog unavailable | "Results are temporarily unavailable. Your answers are safe", with Try again. Browse all still works if its own data loads |
| Scheme not in this founder's results | Details as normal, with a grey "For (state) only" or "We cannot check this for you yet" |
| Answered "Don't know" or "Prefer not to say" | Shown as such in About me, never treated as a no. The scheme stays one step away |
| A save fails | The answer stays on screen with "Could not save. Try again" |
| Stale check | "Status not confirmed", and the scheme leaves "You can apply now" |
| Path item not researched | The honest line from Section 4.5 |

## 6. Testing

- **Pure logic:** `verdictFor` for every row of Section 3.2, the About me grouping, and path item selection, each test written first.
- **Rule tests:** colour contrast computed for every token pair; a scan failing on raw colour classes in migrated pages; a scan failing on the banned words; a check that no two path items share cost or time text.
- **Real browser:** walks at phone and desktop width on a preview with the real database, including the audit that counts internal links per page.
- **Signed-in checks:** these need real test founders. The plan will ask the owner to approve three test accounts (fisheries, poultry, tech). Until then, the owner checks each preview.

## 7. Not included

- Hindi and Marathi for dashboard pages and scheme text (M5).
- Mobile login (M5).
- More scheme amounts and missing records (M4). Cards stay honest until then.
- The automatic freshness check. It has its own open question and design, and only touches the "checked on" date shown here.
- The AI explainer, alerts and the "This is wrong" button (M6).
- Marketing website, admin pages and hidden marketing tools.

## 8. Risks

| Risk | What we do |
| --- | --- |
| Few schemes show rupee amounts, so cards can feel empty | Say so plainly, and fill rates in M4 starting with schemes founders see most |
| Research for My path takes longer than the code | Stages 1 to 3 do not depend on it, and path content ships a group at a time |
| 102 open schemes pass the 60-day limit on 7–8 Nov | Stage 1 makes this more visible, because stale schemes leave "You can apply now". The re-check must happen by then, whichever way the freshness decision goes |
| The one-time redirect annoys existing founders | It happens once, Skip is visible, and the cookie stops repeats on that device |
| One card shared with `/start/results` breaks the working flow | The existing tests and browser walks must pass before Stage 1 merges |

## 9. Changes to the roadmap

- Stages 1 to 3 are new work, added ahead of M3.
- Stage 4 is M3, unchanged in scope.
- One-tap delete moves from M5 to Stage 2.
- The live site already runs M1 and M2. Each stage goes live separately after its own preview.
