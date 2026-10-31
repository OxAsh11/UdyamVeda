# M1 Results Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Given a founder's answers, return the four result buckets, honest own/subsidy/loan lines and a recommended scheme combination from `POST /api/results`, with no login.

**Architecture:** Pure, offline-testable functions in `src/lib/opportunities/engine/` take facts plus a catalog object and a `now` date. One server loader builds the catalog from Supabase, and one route handler exposes it. The existing rules engine and fact mapping are reused, and old dashboard recommendations stay untouched until M2.

**Tech Stack:** Next.js 16.2, TypeScript, Supabase (Postgres, RLS), Vitest (new, dev only).

**Spec:** [docs/product/udyamveda-mvp-prd-v1.md](../../product/udyamveda-mvp-prd-v1.md), Sections 8 and 12. Read [the roadmap](2026-10-31-mvp-roadmap.md) too; its "differ" table overrides the PRD.

## Global Constraints

- "Any false hard rule → bucket D regardless of unknown facts" (FR-06).
- "records unchecked for >60 days cannot appear in bucket A"; older than 30 days shows amber (FR-08, Section 10.4).
- Own, subsidy and loan are separate lines, "never added into one 'benefit' number"; "no total of scheme maximums anywhere" (FR-10). No result type has a `total` field.
- "Two `exclusive` records never appear together in the recommended combination"; the engine never infers `stackable` (FR-09, Section 8.3).
- "same facts + same catalog version = same result" (Section 13). Engine functions take `now` as a parameter and never read the clock.
- No LLM decides anything. No Aadhaar, PAN or bank numbers are accepted or stored.
- Never edit an applied migration. Generate new ones from `supabase/seed/mvp/` with a script, as `scripts/mvp-*-sql.mjs` do. Approved versions are immutable.
- Migrations: dry-run first with `begin; ... rollback;` through `npx --yes supabase@2.117.0 db query --linked --file x.sql`. Apply with `db push --linked --yes` only after the owner approves. Production deploys need the owner's explicit OK.
- Before route or cache code, read `node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md` and the route handler reference (AGENTS.md).
- Commit messages end with the attribution line given in the session.

## Review Focus

1. A founder picks "prefer not to say" (`gender`, `social_category`, `minority_community`, `annual_family_income_band`) or "don't know": the record stays open, never D. Test in Task 4.
2. A rule uses `exists` on an unanswered fact. Live rules do this on `entity_type` and `traditional_trade`, and today that returns false. It must be unknown. Test in Task 2.
3. Supabase is down, paused (this has happened) or returns no records: the founder gets "try again", never an empty or all-D result. Test in Task 7.
4. Open-ended project cost (`above_2cr`) or a project above a scheme's ceiling: no `Infinity`, no invented amount, valid JSON. Test in Task 5.
5. An anonymous caller sends unknown keys, invalid values or a huge body: dropped or rejected before any rule sees them. Tests in Tasks 4 and 7.

---

## File Structure

| File | Responsibility |
| --- | --- |
| `vitest.config.ts` | Test runner with the `@/` alias |
| `src/lib/opportunities/rules.ts` (modify) | `exists` on a missing fact is unknown |
| `src/lib/opportunities/fact-mapping.ts` (modify) | `DERIVATION_INPUTS`, `factKeysForRuleField`, exact project cost |
| `src/lib/opportunities/engine/types.ts` | Shared engine types |
| `src/lib/opportunities/engine/facts.ts` | `cleanFacts` |
| `src/lib/opportunities/engine/classify.ts` | `windowState`, `freshnessOf`, `classifyRecord` |
| `src/lib/opportunities/engine/calculator.ts` | `pickRate`, `computeBenefit` |
| `src/lib/opportunities/engine/combination.ts` | `chooseCombination` |
| `src/lib/opportunities/engine/results.ts` | `buildResults` |
| `src/lib/opportunities/engine/load-catalog.ts` | Cached Supabase loader |
| `src/app/api/results/route.ts` | Public endpoint |
| `src/lib/opportunities/engine/__tests__/` | Tests, fixtures, catalog snapshot |
| `supabase/seed/mvp/{opportunity-packs,benefit-rates}.json` | Owner-approved data |
| `scripts/mvp-engine-sql.mjs`, `scripts/mvp-export-engine-snapshot.mjs` | Migration generator, snapshot export |

---

### Task 1: Test runner and persona baseline

**Files:**
- Create: `vitest.config.ts`, `src/lib/opportunities/engine/__tests__/seeds.ts`, `src/lib/opportunities/engine/__tests__/p04-personas.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `npm test`; `seeds.ts` exports `mappings: RuleFieldMapping[]`, `factDefinitions`, `activityPacks: Record<string, string[]>`, `p04Catalog`, read from `supabase/seed/mvp/` (`facts.json` has `{ facts }`; each fact has `key`, `type`, `fixable`, `stage`, `values: [value, en, hi, mr][]`).

- [ ] **Step 1: Add Vitest.** Install a version whose peer range accepts `vite ^8`, add `"test": "vitest run"`, and alias `@` to `src`.
- [ ] **Step 2: Port the persona checks.** Convert the 14 cases in `docs/superpowers/plans/2026-10-31-p04-persona-cases.ts.txt` to `it.each`, keeping names and expected statuses. Delete the `.txt` copy in the same commit.
- [ ] **Step 3: Run.** `npm test`. Expected: 14 passed.
- [ ] **Step 4: Check nothing else broke.** `npm run typecheck && npm run lint`. Expected: no new errors.
- [ ] **Step 5: Commit** "Add Vitest and port the P0.4 persona checks".

### Task 2: Honest unknowns and fact tracing

**Files:**
- Modify: `src/lib/opportunities/rules.ts:71`, `src/lib/opportunities/fact-mapping.ts:144`
- Test: `src/lib/opportunities/engine/__tests__/rules-and-mapping.test.ts`

**Interfaces:**
- Produces: `DERIVATION_INPUTS: Record<string, readonly string[]>`; `factKeysForRuleField(field: string, mappings: RuleFieldMapping[]): string[]` (a `fact` row gives its `fact_key`, a `derived` row gives its inputs, otherwise `[]`).

- [ ] **Step 1: Write the failing tests.**

```ts
it('exists on an unanswered fact is unknown, not false', () => {
  const e = evaluateEligibilityRules({ all: [{ field: 'entity_type', operator: 'exists' }] }, {})
  expect(e.result).toBeNull()
  expect(e.missingFacts).toEqual(['entity_type'])
})
it('exists on an answered fact is true', () => {
  expect(evaluateEligibilityRules({ all: [{ field: 'entity_type', operator: 'exists' }] }, { entity_type: 'llp' }).result).toBe(true)
})
it('every derivation lists its inputs, and each input is a dictionary fact', () => {
  expect(Object.keys(DERIVATION_INPUTS).sort()).toEqual(Object.keys(DERIVATIONS).sort())
  for (const inputs of Object.values(DERIVATION_INPUTS)) for (const key of inputs) expect(factKeys).toContain(key)
})
it('every derivation is undefined when nothing is answered', () => {
  for (const derive of Object.values(DERIVATIONS)) expect(derive({}, context)).toBeUndefined()
})
it('exact project cost wins over the band', () => {
  expect(DERIVATIONS.project_cost_inr({ project_cost_exact_inr: 800000, project_cost_band: '5l_10l' }, context)).toEqual({ min: 800000, max: 800000 })
})
it('traces a derived rule field to its facts', () => {
  expect(factKeysForRuleField('is_sc_st', mappings)).toEqual(['social_category'])
})
```

(Use a legacy field that really maps to `is_sc_st` in `rule-field-map.json` for the last test.) The third test needs `project_cost_exact_inr` in `facts.json`, which Task 3 adds. Add that fact entry here so this task passes alone.

- [ ] **Step 2: Run to confirm they fail.** `npx vitest run rules-and-mapping`. Expected: FAIL.
- [ ] **Step 3: Implement.** In `compare`, return `null` for `exists` on a missing value. `not_exists` is unused live, so leave it. Add `DERIVATION_INPUTS` and `factKeysForRuleField`, and make `project_cost_inr` prefer the exact fact.
- [ ] **Step 4: Run all tests.** `npm test`. Expected: PASS, including the 14 persona checks.
- [ ] **Step 5: Commit** "Treat unanswered exists rules as unknown and trace rule fields to facts".

### Task 3: Schema and owner-approved data

**Files:**
- Create: `supabase/seed/mvp/opportunity-packs.json`, `supabase/seed/mvp/benefit-rates.json`, `scripts/mvp-engine-sql.mjs`, generated migrations
- Modify: `supabase/seed/mvp/facts.json`
- Test: `src/lib/opportunities/engine/__tests__/engine-seeds.test.ts`

**Interfaces:**
- Produces these database objects:
  - `opportunity_packs(opportunity_id uuid, pack_id text, primary key both)`.
  - `benefit_rates(id, opportunity_version_id, priority smallint default 100, applies_when jsonb null, area text default 'any' check in ('rural','urban','any'), project_type text default 'any' check in ('any','manufacturing','service','trading','agri_allied'), own_pct, subsidy_pct, subsidy_cap_inr, loan_cap_inr, project_cap_inr, interest_rate_pct, interest_subvention_pct, label_en text not null, source_url text not null check https, quote text not null)`.
  - `opportunities.last_checked_at timestamptz`.
  - `mark_opportunity_checked(p_slug text, p_note text)`: reviewer only, writes the audit log.
  - `business_facts.answer_state text not null default 'answered' check in ('answered','dont_know','declined')`.
- Lower `priority` is tried first, so the most generous rate gets the lowest number. `applies_when` is a rule tree over dictionary facts; null means everyone.

- [ ] **Step 1: Write the failing seed tests.**

```ts
it('pack tags name real packs', () => { /* every value in opportunity-packs.json is in packs.json */ })
it('every rate has an https source and a quote', () => { /* source_url starts https://, quote non-empty */ })
it('every applies_when field is a dictionary fact', () => { /* walk the tree; each field is in facts.json */ })
it('every rate set has a fallback row for everyone', () => { /* per slug, at least one row: applies_when null, area any */ })
it('herd sizes are not fixable', () => {
  for (const key of ['small_ruminant_females', 'small_ruminant_males', 'sow_count', 'boar_count', 'poultry_bird_count']) expect(fact(key).fixable).toBe(false)
})
```

- [ ] **Step 2: Run to confirm they fail.** `npx vitest run engine-seeds`. Expected: FAIL.
- [ ] **Step 3: Write the data.**
  - `opportunity-packs.json` maps `{ slug: pack ids[] }` for every live record in PRD Section 11, including the five Shop Act guides and P0.4 records. Core schemes (Mudra, CGTMSE) list all six packs.
  - `benefit-rates.json` covers `cmegp-maharashtra`, `cm-yuva-uttar-pradesh`, `odop-margin-money-uttar-pradesh`, `mukhyamantri-udyami-yojana-bihar`, `bihar-laghu-udyami-yojana`, `mukhyamantri-rojgar-srijan-yojana-jharkhand`, `pmmsy-beneficiary-oriented-subsidy`, `kisan-credit-card-animal-husbandry-fisheries` and NLM. Take values and quotes from `p04-catalog.json`; do not re-derive them. CMEGP's women-in-urban row must be own 5, subsidy 25.
  - In `facts.json`, set the four herd facts to `fixable: false`. Otherwise a 40-goat keeper is told "one step away" from a 500-doe unit.
- [ ] **Step 4: Write `scripts/mvp-engine-sql.mjs <out>`** and generate a schema migration and a seed migration.
  - Add RLS: public read, reviewer write, matching `scheme_relationships`.
  - Backfill `last_checked_at` from the current version's `last_verified_at`.
  - Add a `before update of current_version_id` trigger on `opportunities` that sets `last_checked_at`, so any publish counts as a check.
  - Redefine `publish_catalog_correction` with `benefit_rates` added to its child-table list (`20261025140000_catalog_records_relationships_renewal.sql:76`), or a correction silently loses a scheme's amounts.
  - Regenerate facts through `scripts/mvp-foundation-sql.mjs`.
- [ ] **Step 5: Run the seed tests.** `npx vitest run engine-seeds`. Expected: PASS.
- [ ] **Step 6: Dry-run against the live database** inside `begin; ... rollback;`, including one test correction as a reviewer (set `request.jwt.claims` to a `catalog_reviewers.user_id`). Expected: rows created, and the new version has the same `benefit_rates` count as the old one.
- [ ] **Step 7: Owner approval.** Show the owner the pack tags and rates as a plain table with source links. **Stop until they approve.** Then apply with `db push`.
- [ ] **Step 8: Commit** "Add pack tags, benefit rates and last-checked dates".

### Task 4: Clean facts and classify a record

**Files:**
- Create: `src/lib/opportunities/engine/types.ts`, `facts.ts`, `classify.ts`
- Test: `src/lib/opportunities/engine/__tests__/classify.test.ts`

**Interfaces:**
- Consumes: `factKeysForRuleField`, `ruleFactsFromCanonical`, `evaluateEligibilityRules`, `RecommendationWindow`.
- Produces:

```ts
export type Bucket = 'A' | 'B' | 'C' | 'D'
export type Freshness = 'fresh' | 'amber' | 'stale'
export type WindowState = 'open' | 'closed' | 'not_yet_open'
export type FounderStep = { kind: 'answer' | 'obtain'; factKey: string }
export type BenefitRate = { priority: number; appliesWhen: unknown; area: 'rural' | 'urban' | 'any'; projectType: string; ownPct: number; subsidyPct: number; subsidyCapInr: number | null; loanCapInr: number | null; projectCapInr: number | null; interestRatePct: number | null; interestSubventionPct: number | null; labelEn: string; sourceUrl: string }
export type EngineRecord = { id: string; slug: string; title: string; type: string; status: string; versionId: string; rules: unknown; windows: RecommendationWindow[]; lastCheckedAt: string | null; packIds: string[]; coverage: string; locations: string[]; rates: BenefitRate[]; requiredCount: number; stepCount: number }
export type EngineContext = { mappings: RuleFieldMapping[]; reviewerChecks: ReadonlyMap<string, string>; fixableKeys: ReadonlySet<string>; derivation: DerivationContext }
export type RecordVerdict = { bucket: Bucket; windowState: WindowState; freshness: Freshness; steps: FounderStep[]; bankChecks: string[]; blockers: string[] }

export function cleanFacts(raw: unknown, definitions: FactDefinition[], activityIds: ReadonlySet<string>): { facts: CanonicalFacts; nonAnswers: Record<string, 'dont_know' | 'declined'> }
export function windowState(windows: RecommendationWindow[], status: string, now: Date): WindowState
export function freshnessOf(lastCheckedAt: string | null, now: Date): Freshness
export function classifyRecord(record: EngineRecord, facts: CanonicalFacts, context: EngineContext, now: Date): RecordVerdict
```

- [ ] **Step 1: Write the failing tests.** Use `now = new Date('2026-10-31T00:00:00Z')` and small inline rule trees, with real mappings where named.

| Test | Input | Expected |
| --- | --- | --- |
| hard false beats unknown | Bihar founder, rule needs Maharashtra plus an unanswered age | D |
| fixable false | `udyam_registered: false`, rule needs true | B; steps `[{ kind: 'obtain', factKey: 'udyam_registered' }]` |
| two fixable blockers | Udyam and training both false, both required | B; both listed |
| fixable that does not matter | Rule fails only on Udyam; training also false but unused | B; only Udyam listed |
| unanswered | Rule needs `applicant_age_years`, not given | B; `{ kind: 'answer', factKey: 'applicant_age_years' }` |
| derived unanswered | Rule field derived from `social_category` | B; answer step names `social_category` |
| prefer not to say | `cleanFacts` on `social_category: 'prefer_not'`, then a rule on it | Fact removed; `nonAnswers.social_category === 'declined'`; B, not D |
| herd below threshold | 40 females, NLM rule | D |
| bank check | Rule on a `bank_check` field only, open window | A; note in `bankChecks` |
| open, fresh | Rules true, active, checked 10 days ago | A; freshness `fresh` |
| amber | Checked 45 days ago | A; freshness `amber` |
| exactly at limit | Checked 60 days ago | A; `amber` |
| stale | Checked 61 days ago | C; `stale` |
| never checked | `lastCheckedAt: null` | C; `stale` |
| pending renewal, closed, paused | Rules true, each status | C |
| hard false with closed window | Both | D |
| fixable false with closed window | Both | C; steps kept |
| past window, active status | Only dated window ended in 2025 | C |
| closed window type, no dates | `windowType: 'closed'`, also `'closed_or_claim_only'` | C |
| not yet open | `opensAt` next month | C; `not_yet_open` |
| rolling, undated, no windows | `rolling`; `static` with null dates; `[]` | A |
| junk facts | `cleanFacts` on unknown key, bad enum, negative number, `'NaN'`, unknown activity id, 6 activities | Each dropped; activities capped at 5 |

- [ ] **Step 2: Run to confirm they fail.** `npx vitest run classify`. Expected: FAIL.
- [ ] **Step 3: Implement `classifyRecord`** in this order:
  1. Evaluate the rules on `ruleFactsFromCanonical(facts, ...)`.
  2. If false, evaluate again with every fixable key removed. Still false means D.
  3. Otherwise find the blockers: start with all answered fixable keys removed, restore each in turn, and keep it restored if the result stays not false. What remains are the `obtain` steps.
  4. Map `missingFacts` through `factKeysForRuleField`, drop facts already answered, and de-duplicate into `answer` steps.
  5. Bucket: not `active`, window not open or `stale` means C; result true means A; otherwise B.

  `windowState`: any open window wins. Types `closed` and `closed_or_claim_only` count only when no other window exists. Undated windows and an empty list are open, and the UI's existing "check official portal" label covers them.

  Non-answer values are `prefer_not` and `dont_know`. `facts.json` has `prefer_not` on four facts.
- [ ] **Step 4: Run.** `npx vitest run classify`. Expected: PASS.
- [ ] **Step 5: Commit** "Classify each record into the four result buckets".

### Task 5: Honest amount calculator

**Files:**
- Create: `src/lib/opportunities/engine/calculator.ts`
- Test: `src/lib/opportunities/engine/__tests__/calculator.test.ts`

**Interfaces:**
- Consumes: `BenefitRate`, `CanonicalFacts`, `BAND_RANGES`, `evaluateEligibilityRules`.
- Produces:

```ts
export type InrRange = { min: number; max: number | null } // null = no upper limit
export type BenefitLines = {
  projectCost: InrRange; own: InrRange; subsidy: InrRange; loan: InrRange; uncovered: InrRange
  interestRatePct: number | null; interestSubventionPct: number | null
  rateLabel: string; sourceUrl: string
  betterIfAnswered: string[]; ownShortfall: boolean; aboveCeiling: boolean; ifRenewed: boolean
}
export function pickRate(rates: BenefitRate[], facts: CanonicalFacts): { rate: BenefitRate; betterIfAnswered: string[] } | null
export function computeBenefit(rates: BenefitRate[], facts: CanonicalFacts, status: string): BenefitLines | null
```

- [ ] **Step 1: Write the failing tests.** CMEGP values are the PRD's worked example (Section 8.4).

```ts
it('CMEGP, woman, urban, ₹8 lakh: own 40,000, subsidy 2,00,000, loan 5,60,000', () => {
  const lines = computeBenefit(cmegp, { gender: 'woman', area_type: 'urban', project_cost_exact_inr: 800000 }, 'active')!
  expect(lines.own).toEqual({ min: 40000, max: 40000 })
  expect(lines.subsidy).toEqual({ min: 200000, max: 200000 })
  expect(lines.loan).toEqual({ min: 560000, max: 560000 })
})
it('a band gives a range, not a guess', () => {
  const lines = computeBenefit(cmegp, { gender: 'woman', area_type: 'urban', project_cost_band: '5l_10l' }, 'active')!
  expect(lines.subsidy).toEqual({ min: 125000, max: 250000 })
  expect(lines.own).toEqual({ min: 25000, max: 50000 })
})
it('applies the subsidy cap', () => { /* subsidyPct 50, cap 2500000, cost 8000000 → subsidy 2500000 */ })
it('caps the loan and reports the gap', () => { /* subsidy 50% cap 500000, loanCap 500000, cost 1200000 → loan 500000, uncovered 200000 */ })
it('above the ceiling shows no amounts', () => { /* projectCap 5000000, exact 6000000 → aboveCeiling true, subsidy { min: 0, max: 0 } */ })
it('a band across the ceiling is clipped to it', () => { /* projectCap 5000000, band 50l_1cr → projectCost.max 5000000 */ })
it('open-ended cost survives JSON', () => {
  const lines = computeBenefit(uncappedRate, { project_cost_band: 'above_2cr' }, 'active')!
  expect(lines.projectCost.max).toBeNull()
  expect(JSON.parse(JSON.stringify(lines))).toEqual(lines)
})
it('unanswered gender uses the general rate and says it could be higher', () => {
  const lines = computeBenefit(cmegp, { area_type: 'urban', project_cost_exact_inr: 800000 }, 'active')!
  expect(lines.betterIfAnswered).toContain('gender')
})
it('flags too little own money', () => { /* own_contribution_band up_to_25k, own needed 40000 → ownShortfall true */ })
it('marks pending renewal as if renewed', () => { /* status pending_renewal → ifRenewed true */ })
it('returns null with no rates or no project cost', () => { /* computeBenefit([], ...) and no cost fact */ })
it('has no total field', () => { /* no key in lines matches /total|sum/i */ })
```

- [ ] **Step 2: Run to confirm they fail.** `npx vitest run calculator`. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - `pickRate` walks rates by ascending priority. It returns the first whose `appliesWhen`, area and project type all match. Any earlier row that is unknown rather than false adds its unanswered facts to `betterIfAnswered`.
  - For each end of the cost range: own is `ownPct × cost`; subsidy is `min(subsidyPct × cost, cap)`; loan is `min(cost − own − subsidy, loanCap)`, at least 0; uncovered is the remainder.
  - An open end (`Infinity` in `BAND_RANGES`) gives `null`, except that a capped subsidy's maximum is its cap.
- [ ] **Step 4: Run.** `npx vitest run calculator`. Expected: PASS.
- [ ] **Step 5: Commit** "Calculate own, subsidy and loan lines for a founder's project".

### Task 6: Recommended combination

**Files:**
- Create: `src/lib/opportunities/engine/combination.ts`
- Test: `src/lib/opportunities/engine/__tests__/combination.test.ts`

**Interfaces:**
- Consumes: `BenefitLines`; `scheme_relationships` rows as `Relationship = { a: string; b: string; relation: 'stackable' | 'exclusive' | 'sequential' | 'conditional' | 'unknown'; capRule: { max_total_subsidy_pct?: number } | null; noteEn: string | null; sourceUrl: string }`.
- Produces:

```ts
export type Combination = {
  recommended: string[]
  alternatives: { id: string; excludedBy: string[]; notConfirmedWith: string[] }[]
  sequences: { before: string; after: string }[]
}
export function chooseCombination(candidates: { id: string; lines: BenefitLines }[], relationships: Relationship[]): Combination
```

- [ ] **Step 1: Write the failing tests.**

| Test | Input | Expected |
| --- | --- | --- |
| exclusive never together | CMEGP (₹2 lakh), PMFME (₹1 lakh), exclusive | Recommended CMEGP only; PMFME `excludedBy` CMEGP |
| no relationship means not confirmed | Two schemes, no row | Larger one recommended; other has `notConfirmedWith` |
| explicit `unknown` | Same with an `unknown` row | Same result |
| stackable | Two schemes, `stackable` | Both recommended |
| pair order ignored | Row stored as (b, a) | Same result as (a, b) |
| conditional within cap | Subsidies 20% + 20%, cap 50 | Both |
| conditional over cap | Subsidies 40% + 20%, cap 50 | Larger only |
| sequential | Udyam `sequential` PMEGP | Both; `sequences` is before Udyam, after PMEGP |
| too many | 11 candidates | Finishes; only the top 10 by subsidy are combined; 11th is an alternative |
| tie | Equal subsidy | Same answer each run, ordered by id |
| no candidates | `[]` | Empty result, no error |
| no total | Any | No key matches `/total|sum/i` |

- [ ] **Step 2: Run to confirm they fail.** `npx vitest run combination`. Expected: FAIL.
- [ ] **Step 3: Implement.** Try every subset of the top 10 by `subsidy.max`, as Section 10.1 allows. A pair is allowed together only if `stackable`, `sequential` or `conditional` within its cap. A missing row counts as `unknown`, which is not allowed together. Pick the allowed subset with the largest subsidy using a private score that is never returned. Compare `conditional` caps at each range's `max`.
- [ ] **Step 4: Run.** `npx vitest run combination`. Expected: PASS.
- [ ] **Step 5: Commit** "Recommend scheme combinations that respect stacking rules".

### Task 7: Build results, load the catalog, expose the route

**Files:**
- Create: `src/lib/opportunities/engine/results.ts`, `load-catalog.ts`, `src/app/api/results/route.ts`, `scripts/mvp-export-engine-snapshot.mjs`, `src/lib/opportunities/engine/__tests__/catalog-snapshot.json`
- Test: `src/lib/opportunities/engine/__tests__/results.test.ts`, `results-route.test.ts`

**Interfaces:**
- Consumes: everything above.
- Produces:

```ts
export type EngineCatalog = { records: EngineRecord[]; relationships: Relationship[]; context: EngineContext; definitions: FactDefinition[]; activityIds: ReadonlySet<string>; version: string }
export type RecordResult = RecordVerdict & { id: string; slug: string; title: string; type: string; lastCheckedAt: string | null; lines: BenefitLines | null }
export type ResultsPayload = { catalogVersion: string; counts: Record<Bucket, number>; buckets: Record<Bucket, RecordResult[]>; combination: Combination; nonAnswers: Record<string, string> }
export function buildResults(facts: CanonicalFacts, nonAnswers: Record<string, string>, catalog: EngineCatalog, now: Date): ResultsPayload
export function loadEngineCatalog(): Promise<EngineCatalog | null> // null on any query error or zero records
```

`POST /api/results` takes `{ facts }` and returns `ResultsPayload`, with no login. Errors: 400 bad JSON, 413 over 16 KB, 503 `{ error: 'catalog_unavailable' }`.

- [ ] **Step 1: Export a snapshot.** `scripts/mvp-export-engine-snapshot.mjs` writes the fields `EngineRecord` needs for all current records, relationships and rates, using the linked database. Records are public data.
- [ ] **Step 2: Write the failing tests** on the snapshot with `now = 2026-10-31`.

| Persona (PRD Section 5 and owner's test personas) | Expected |
| --- | --- |
| Rakesh: poultry + pond fish, Gaya, Bihar, 34, class 12, 500 broilers | NLM in D; PMMSY in C (pending renewal); Bihar MMUY in C (window closed); KCC in A; `cmegp-maharashtra` absent |
| Pooja: beauty parlour, Pune, woman, 32, urban, ₹8 lakh, no prior subsidy | CMEGP in A with subsidy ₹2,00,000; no Bihar or UP schemes present |
| Imran: carpentry, Saharanpur UP, 31, class 10 | CM-YUVA in A; PMEGP not in A |
| Fisheries founder: pond fish, Bihar, SC | PMMSY in C and `ifRenewed` true |
| Poultry founder: hatchery, 1,200 parent layers | NLM in A |
| Tech founder: Delhi, no DPIIT recognition | SISFS in C if tagged; no fisheries records |

Also:

| Test | Expected |
| --- | --- |
| Same input twice | Deep-equal output (determinism) |
| JSON round trip | Deep-equal output |
| `{}` facts | No error; A may be empty; D is empty |
| State filter | Other-state records are absent, not in D; with no state answered they are kept |
| Untagged record (for example a PLI scheme) | Absent unless its rules are true, then A only (Section 4) |
| Exclusive across buckets | PMEGP in C is not a combination candidate |
| Ranking | A by subsidy, then lower effort (`effortFor`), then freshness; B by fewest steps; ties by slug |
| Route: loader returns null | 503 `catalog_unavailable` |
| Route: bad JSON; 17 KB body | 400; 413 |
| Route: unknown keys, `pan_number` in facts | Ignored; never echoed back |

If a persona's expectation disagrees with live catalog data, stop and report it. Do not change the expectation to pass. A real mismatch is a catalog question for the owner.

- [ ] **Step 3: Run to confirm they fail.** `npx vitest run results`. Expected: FAIL.
- [ ] **Step 4: Implement `buildResults`.** Filter (state, pack, untagged rule), classify, compute lines for A and C, choose the combination from A only, then rank.
- [ ] **Step 5: Implement `loadEngineCatalog`** with `unstable_cache` per the guide named in Global Constraints, using a cookie-less anon Supabase client and a 300-second revalidate. Set `version` to a SHA-256 of the sorted catalog JSON, so a rate or date change produces a new version. Anon read policies already exist for `rule_field_mappings` and the new tables; confirm with a live query that `eligibility_rule_sets` is readable by anon for published versions, and report if not.
- [ ] **Step 6: Implement the route.** Check body size before parsing, use `cleanFacts`, and return JSON.
- [ ] **Step 7: Run everything.** `npm test && npm run typecheck && npm run lint && npm run build:next`. Expected: all pass.
- [ ] **Step 8: Smoke test on a preview deployment.** POST the Pooja persona. Expected: CMEGP in bucket A with subsidy ₹2,00,000. Production stays untouched until the owner says deploy; deploys are batched with M2.
- [ ] **Step 9: Commit** "Serve founder results from POST /api/results".
