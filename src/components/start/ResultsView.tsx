'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import LanguageSwitch from './LanguageSwitch'
import QuestionField from './QuestionField'
import SchemeCard from './SchemeCard'
import { TryAgain } from './StartFlow'
import type { RecordResult, ResultsPayload } from '@/lib/opportunities/engine/results'
import { fetchFounder, fetchResults, fetchStep, saveFounderFacts, type StepResponse } from '@/lib/start/api'
import { clearDraft, loadDraft, saveDraft, type Draft } from '@/lib/start/draft'
import { t, type TextKey } from '@/lib/start/i18n'
import { answersMissing, withScreenAnswers } from '@/lib/start/screen'
import type { Lang, Text } from '@/lib/start/types'

type Loaded = { results: ResultsPayload; flow: StepResponse }

const hasAnswers = (draft: Draft) => Object.values(draft.facts).some(value => value !== undefined)

function Bucket({ title, description, items, lang, labels }: { title: TextKey; description: TextKey; items: RecordResult[]; lang: Lang; labels: Record<string, Text> }) {
  return (
    <section>
      <h2 className="text-base font-extrabold text-slate-900">{t(lang, title)} <span className="text-slate-400">({items.length})</span></h2>
      <p className="mb-3 text-xs text-slate-500">{t(lang, description)}</p>
      {items.length === 0 && <p className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-400">{t(lang, 'nothingHere')}</p>}
      <div className="flex flex-col gap-3">
        {items.map(item => <SchemeCard key={item.id} item={item} lang={lang} labels={labels} />)}
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
  const [missing, setMissing] = useState(false)
  const [showD, setShowD] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [saved, setSaved] = useState(false)
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
    setMissing(false)
  }, [router])

  const load = useCallback(async (current: Draft) => {
    apply(await Promise.all([fetchResults(current.facts), fetchStep(current.facts, current.asked)]))
  }, [apply])

  const [initialDraft] = useState(draft)
  useEffect(() => {
    let active = true
    void fetchFounder().then(async founder => {
      if (!active) return
      setSignedIn(founder.signedIn)

      // A draft is what the founder just did, so it wins. With no draft, pick up
      // what the account holds, as on a new device.
      let current = initialDraft
      if (!hasAnswers(current)) {
        if (!Object.keys(founder.facts).length) {
          router.replace('/start')
          return
        }
        current = { ...current, facts: founder.facts, asked: founder.asked }
        setDraft(current)
        saveDraft(current)
      } else if (founder.signedIn) {
        setSaved(await saveFounderFacts(current.facts))
      }
      const pair = await Promise.all([fetchResults(current.facts), fetchStep(current.facts, current.asked)])
      if (active) apply(pair)
    })
    return () => {
      active = false
    }
  }, [apply, initialDraft, router])

  function update(next: Draft) {
    setDraft(next)
    saveDraft(next)
  }

  const refine = loaded?.flow.step.phase === 'refine' ? loaded.flow.step : null

  function saveRefineAnswer() {
    if (!refine) return
    if (answersMissing(refine.questions, draft.facts)) {
      setMissing(true)
      return
    }
    const updated = withScreenAnswers(draft, refine.questions, refine.questions)
    update(updated)
    void load(updated)
    if (signedIn) void saveFounderFacts(updated.facts).then(setSaved)
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5 px-4 py-6">
      <header className="flex items-center justify-between gap-3">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-slate-900">{t(lang, 'brand')}</Link>
        <LanguageSwitch lang={lang} onChange={value => update({ ...draft, lang: value })} />
      </header>

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">{t(lang, 'resultsTitle')}</h1>
        <p className="mt-1 text-sm text-slate-500">{t(lang, 'resultsSub')}</p>
      </div>

      {failed && <TryAgain lang={lang} onRetry={() => void load(draft)} />}
      {!failed && !loaded && <p className="py-10 text-center text-sm text-slate-500">{t(lang, 'loading')}</p>}

      {!failed && loaded && (
        <>
          <BestRoute results={loaded.results} lang={lang} />
          <SaveCard lang={lang} signedIn={signedIn} saved={saved} />

          {refine && (
            <section className="glass flex flex-col gap-4 p-5">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">{t(lang, 'sharpenTitle')}</h2>
                <p className="text-xs text-slate-500">{t(lang, 'sharpenDecides', { count: refine.decides })} {t(lang, 'sharpenLeft', { count: refine.refineLeft })}</p>
              </div>
              {refine.questions.map(question => (
                <QuestionField
                  key={question.id}
                  question={question}
                  lang={lang}
                  facts={draft.facts}
                  activityItems={[]}
                  onActivities={() => undefined}
                  onChange={changes => {
                    setMissing(false)
                    update({ ...draft, facts: { ...draft.facts, ...changes } })
                  }}
                />
              ))}
              {missing && <p role="alert" className="text-sm font-semibold text-rose-700">{t(lang, 'pleaseAnswer')}</p>}
              <button type="button" onClick={saveRefineAnswer} className="btn-accent px-4 py-3 text-sm">{t(lang, 'saveAnswer')}</button>
            </section>
          )}

          <Bucket title="bucketA" description="bucketADesc" items={loaded.results.buckets.A} lang={lang} labels={loaded.flow.factLabels} />
          <Bucket title="bucketB" description="bucketBDesc" items={loaded.results.buckets.B} lang={lang} labels={loaded.flow.factLabels} />
          <Bucket title="bucketC" description="bucketCDesc" items={loaded.results.buckets.C} lang={lang} labels={loaded.flow.factLabels} />

          <section>
            <h2 className="text-base font-extrabold text-slate-900">{t(lang, 'bucketD')} <span className="text-slate-400">({loaded.results.counts.D})</span></h2>
            <p className="mb-3 text-xs text-slate-500">{t(lang, 'bucketDDesc')}</p>
            {loaded.results.counts.D > 0 && (
              <button type="button" aria-expanded={showD} onClick={() => setShowD(value => !value)} className="chip mb-3">
                {t(lang, showD ? 'hideList' : 'showList')}
              </button>
            )}
            {showD && (
              <div className="flex flex-col gap-3">
                {loaded.results.buckets.D.map(item => <SchemeCard key={item.id} item={item} lang={lang} labels={loaded.flow.factLabels} />)}
              </div>
            )}
          </section>

          <footer className="flex flex-wrap gap-3 border-t border-slate-200 pt-4 text-sm">
            <button
              type="button"
              onClick={() => {
                update({ ...draft, asked: [], history: [] })
                router.push('/start')
              }}
              className="font-semibold text-indigo-700 underline underline-offset-2"
            >
              {t(lang, 'changeAnswers')}
            </button>
            <button
              type="button"
              onClick={() => {
                clearDraft()
                router.push('/start')
              }}
              className="font-semibold text-slate-500 underline underline-offset-2"
            >
              {t(lang, 'startOver')}
            </button>
          </footer>
        </>
      )}
    </div>
  )
}
