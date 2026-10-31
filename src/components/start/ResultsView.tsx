'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import LanguageSwitch from './LanguageSwitch'
import QuestionField from './QuestionField'
import { TryAgain } from './StartFlow'
import VerdictCard from '@/components/founder/VerdictCard'
import type { RecordResult, ResultsPayload } from '@/lib/opportunities/engine/results'
import { fetchFounder, fetchResults, fetchStep, saveFounderFacts, type StepResponse } from '@/lib/start/api'
import { clearDraft, emptyDraft, loadDraft, saveDraft, type Draft } from '@/lib/start/draft'
import { t, type TextKey } from '@/lib/start/i18n'
import type { ScreenQuestion } from '@/lib/start/next-screen'
import { answersMissing, applyAnswers, numberProblem, withScreenAnswers } from '@/lib/start/screen'
import { draftFromAccount, resolveDraft, shouldSaveDraft } from '@/lib/start/sync'
import type { Lang } from '@/lib/start/types'

type Loaded = { results: ResultsPayload; flow: StepResponse }

function Bucket({ title, description, items, lang, card }: { title: TextKey; description: TextKey; items: RecordResult[]; lang: Lang; card: (item: RecordResult) => ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-extrabold text-slate-900">{t(lang, title)} <span className="text-slate-400">({items.length})</span></h2>
      <p className="mb-3 text-xs text-slate-500">{t(lang, description)}</p>
      {items.length === 0 && <p className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-400">{t(lang, 'nothingHere')}</p>}
      <div className="flex flex-col gap-3">
        {items.map(item => card(item))}
      </div>
    </section>
  )
}

function SaveCard({ lang, signedIn, saved }: { lang: Lang; signedIn: boolean; saved: boolean }) {
  if (signedIn) {
    return (
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-sm font-semibold text-emerald-900">{saved ? t(lang, 'savedNote') : t(lang, 'notSavedYet')}</p>
        <Link href="/dashboard" className="text-sm font-bold text-emerald-900 underline underline-offset-2">{t(lang, 'goDashboard')}</Link>
      </section>
    )
  }
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="text-base font-extrabold text-slate-900">{t(lang, 'saveTitle')}</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">{t(lang, 'saveBody')}</p>
      <Link href="/login?next=/start/results" className="btn-accent mt-3 px-4 py-2.5 text-sm">{t(lang, 'saveCta')}</Link>
    </section>
  )
}

function BestRoute({ results, lang }: { results: ResultsPayload; lang: Lang }) {
  const names = new Map(results.buckets.A.map(item => [item.id, item.title]))
  const nameList = (ids: string[]) => ids.map(id => names.get(id) ?? '').filter(Boolean).join(', ')
  const { recommended, alternatives } = results.combination

  return (
    <section className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
      <h2 className="text-base font-extrabold text-indigo-950">{t(lang, 'bestRoute')}</h2>
      {recommended.length === 0 && <p className="mt-1 text-sm text-indigo-900">{t(lang, 'noRouteYet')}</p>}
      {recommended.length > 0 && (
        <>
          <p className="mt-1 text-xs text-indigo-800">{t(lang, 'bestRouteNote')}</p>
          <ul className="mt-2 list-disc pl-5 text-sm font-bold text-indigo-950">
            {recommended.map(id => <li key={id}>{names.get(id)}</li>)}
          </ul>
        </>
      )}
      {alternatives.length > 0 && (
        <div className="mt-3 border-t border-indigo-200 pt-3">
          <p className="text-xs font-bold text-indigo-900">{t(lang, 'alsoPossible')}</p>
          <ul className="mt-1 space-y-1.5 text-xs text-indigo-900">
            {alternatives.map(item => (
              <li key={item.id}>
                <span className="font-semibold">{names.get(item.id)}</span>
                {item.excludedBy.length > 0 && <span> — {t(lang, 'excludedByName', { names: nameList(item.excludedBy) })}</span>}
                {item.notConfirmedWith.length > 0 && <span> — {t(lang, 'notConfirmedWith', { names: nameList(item.notConfirmedWith) })}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export default function ResultsView() {
  const router = useRouter()
  const [draft, setDraft] = useState<Draft>(loadDraft)
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [failed, setFailed] = useState(false)
  const [problem, setProblem] = useState<TextKey | null>(null)
  const [showD, setShowD] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  // Answers on this device that were not allowed to replace the account's saved ones.
  const [unsavedDraft, setUnsavedDraft] = useState<Draft | null>(null)
  const lang = draft.lang

  const apply = useCallback(([results, flow]: [ResultsPayload | null, StepResponse | null]) => {
    if (!results || !flow) {
      setFailed(true)
      return
    }
    if (flow.step.phase === 'first') {
      router.replace('/start')
      return
    }
    setLoaded({ results, flow })
    setFailed(false)
    setProblem(null)
  }, [router])

  const load = useCallback(async (current: Draft) => {
    apply(await Promise.all([fetchResults(current.facts), fetchStep(current.facts, current.asked)]))
  }, [apply])

  const [initialDraft] = useState(draft)
  useEffect(() => {
    let active = true
    void fetchFounder().then(async founder => {
      if (!active) return
      setSignedIn(founder.status === 'signed_in')
      setUserId(founder.userId)

      const decision = resolveDraft(initialDraft, founder)
      const someoneElses = founder.status === 'signed_in' && initialDraft.ownerId && initialDraft.ownerId !== founder.userId
      if (decision.kind === 'forget' || someoneElses) clearDraft()
      if (decision.kind === 'forget' || decision.kind === 'start') {
        router.replace('/start')
        return
      }

      let current = initialDraft
      if (decision.kind === 'use_account' || decision.kind === 'ask') {
        current = draftFromAccount(founder, initialDraft.lang)
        if (decision.kind === 'ask') setUnsavedDraft(initialDraft)
        setDraft(current)
        saveDraft(current)
        setSaved(true)
      }

      const pair = await Promise.all([fetchResults(current.facts), fetchStep(current.facts, current.asked)])
      if (!active) return
      apply(pair)

      if (pair[1] && shouldSaveDraft(decision, pair[1].step.phase)) {
        const ok = await saveFounderFacts(current.facts)
        setSaved(ok)
        if (ok && active) {
          const owned = { ...current, ownerId: founder.userId }
          setDraft(owned)
          saveDraft(owned)
        }
      }
    })
    return () => {
      active = false
    }
  }, [apply, initialDraft, router])

  function update(next: Draft) {
    setDraft(next)
    saveDraft(next)
  }

  function saveAndReload(next: Draft) {
    update(next)
    void load(next)
    if (signedIn) void saveFounderFacts(next.facts).then(setSaved)
  }

  function submit(questions: ScreenQuestion[], record: boolean) {
    if (answersMissing(questions, draft.facts)) {
      setProblem('pleaseAnswer')
      return
    }
    const wrongNumber = questions.map(question => numberProblem(question, draft.facts)).find(Boolean)
    if (wrongNumber) {
      setProblem(wrongNumber)
      return
    }
    saveAndReload(record ? withScreenAnswers(draft, questions, questions) : draft)
  }

  function startOver() {
    if (!window.confirm(t(lang, 'confirmStartOver'))) return
    clearDraft()
    saveDraft({ ...emptyDraft(), lang, ownerId: draft.ownerId })
    router.push('/start')
  }

  function useThisDevice() {
    if (!unsavedDraft) return
    setUnsavedDraft(null)
    saveAndReload({ ...unsavedDraft, ownerId: userId })
  }

  const refine = loaded?.flow.step.phase === 'refine' ? loaded.flow.step : null
  const answered = loaded?.flow.step.answered ?? []
  const fieldProps = {
    lang,
    facts: draft.facts,
    activityItems: draft.activityItems,
    onActivities: () => undefined,
    onChange: (changes: Record<string, unknown>) => {
      setProblem(null)
      update({ ...draft, facts: applyAnswers(draft.facts, changes) })
    },
  }
  const twoActivities = Array.isArray(draft.facts.activity_codes) && draft.facts.activity_codes.length > 1

  // The questions are answered in the box above, so the card gets no link to answer them.
  const card = (item: RecordResult) => loaded && (
    <VerdictCard
      key={item.id}
      item={item}
      combination={loaded.results.combination}
      lang={lang}
      labels={loaded.flow.factLabels}
      answerWords={loaded.flow.answerWords}
      detailHref={signedIn ? `/dashboard/schemes/${item.slug}` : `/schemes/${item.slug}`}
      newTab={!signedIn}
    />
  )

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5 px-4 py-6">
      <header className="flex items-center justify-between gap-3">
        <span className="text-lg font-extrabold tracking-tight text-slate-900">{t(lang, 'brand')}</span>
        <LanguageSwitch lang={lang} onChange={value => update({ ...draft, lang: value })} />
      </header>

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">{t(lang, 'resultsTitle')}</h1>
        <p className="mt-1 text-sm text-slate-500">{t(lang, 'resultsSub')}</p>
        {!signedIn && loaded && (
          <button type="button" onClick={startOver} className="mt-2 min-h-11 text-sm font-semibold text-slate-600 underline underline-offset-2">{t(lang, 'notYou')}</button>
        )}
      </div>

      {failed && <TryAgain lang={lang} onRetry={() => void load(draft)} />}
      {!failed && !loaded && <p className="py-10 text-center text-sm text-slate-500">{t(lang, 'loading')}</p>}

      {!failed && loaded && (
        <>
          {unsavedDraft && (
            <section role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h2 className="text-base font-extrabold text-amber-950">{t(lang, 'pendingTitle')}</h2>
              <p className="mt-1 text-sm leading-6 text-amber-900">{t(lang, 'pendingBody')}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => setUnsavedDraft(null)} className="btn-accent min-h-11 px-4 text-sm">{t(lang, 'keepSaved')}</button>
                <button type="button" onClick={useThisDevice} className="min-h-11 rounded-xl border border-amber-300 bg-white px-4 text-sm font-semibold text-amber-900">{t(lang, 'useDeviceAnswers')}</button>
              </div>
            </section>
          )}

          <BestRoute results={loaded.results} lang={lang} />
          <SaveCard lang={lang} signedIn={signedIn} saved={saved} />
          {twoActivities && <p className="rounded-xl border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-600">{t(lang, 'twoActivitiesNote')}</p>}

          {refine && (
            <section className="glass flex flex-col gap-4 p-5">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">{t(lang, 'sharpenTitle')}</h2>
                <p className="text-xs text-slate-500">{t(lang, 'sharpenDecides', { count: refine.decides })} {t(lang, 'sharpenLeft', { count: refine.refineLeft })}</p>
              </div>
              {refine.questions.map(question => <QuestionField key={question.id} question={question} {...fieldProps} />)}
              {problem && <p role="alert" className="text-sm font-semibold text-rose-700">{t(lang, problem)}</p>}
              <button type="button" onClick={() => submit(refine.questions, true)} className="btn-accent px-4 py-3 text-sm">{t(lang, 'saveAnswer')}</button>
            </section>
          )}

          <Bucket title="bucketA" description="bucketADesc" items={loaded.results.buckets.A} lang={lang} card={card} />
          <Bucket title="bucketB" description="bucketBDesc" items={loaded.results.buckets.B} lang={lang} card={card} />
          <Bucket title="bucketC" description="bucketCDesc" items={loaded.results.buckets.C} lang={lang} card={card} />

          <section>
            <h2 className="text-base font-extrabold text-slate-900">{t(lang, 'bucketD')} <span className="text-slate-400">({loaded.results.counts.D})</span></h2>
            <p className="mb-3 text-xs text-slate-500">{t(lang, 'bucketDDesc')}</p>
            {loaded.results.counts.D > 0 && (
              <button type="button" aria-expanded={showD} onClick={() => setShowD(value => !value)} className="chip mb-3 min-h-11 px-4">
                {t(lang, showD ? 'hideList' : 'showList')}
              </button>
            )}
            {showD && (
              <div className="flex flex-col gap-3">
                {loaded.results.buckets.D.map(item => card(item))}
              </div>
            )}
          </section>

          {answered.length > 0 && (
            <details className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer py-2 text-sm font-semibold text-slate-700">{t(lang, 'otherAnswers')}</summary>
              <div className="mt-3 flex flex-col gap-6">
                {answered.map(question => <QuestionField key={question.id} question={question} {...fieldProps} />)}
                {problem && !refine && <p role="alert" className="text-sm font-semibold text-rose-700">{t(lang, problem)}</p>}
                <button type="button" onClick={() => submit(answered, false)} className="btn-accent px-4 py-3 text-sm">{t(lang, 'saveChanges')}</button>
              </div>
            </details>
          )}

          <footer className="flex flex-wrap gap-4 border-t border-slate-200 pt-4 text-sm">
            <button
              type="button"
              onClick={() => {
                update({ ...draft, asked: draft.asked.filter(id => answered.some(question => question.id === id)), history: [] })
                router.push('/start')
              }}
              className="min-h-11 font-semibold text-indigo-700 underline underline-offset-2"
            >
              {t(lang, 'changeAnswers')}
            </button>
            <button type="button" onClick={startOver} className="min-h-11 font-semibold text-slate-500 underline underline-offset-2">
              {t(lang, 'startOver')}
            </button>
          </footer>
        </>
      )}
    </div>
  )
}
