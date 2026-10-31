'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import LanguageSwitch from './LanguageSwitch'
import QuestionField from './QuestionField'
import { evaluateEligibilityRules } from '@/lib/opportunities/rules'
import { fetchStep, type StepResponse } from '@/lib/start/api'
import { loadDraft, saveDraft, type Draft } from '@/lib/start/draft'
import { t } from '@/lib/start/i18n'
import { answersMissing, withScreenAnswers } from '@/lib/start/screen'
import type { NextStep, ScreenQuestion } from '@/lib/start/next-screen'
import type { Lang } from '@/lib/start/types'

const FIRST_RESULT_STAGES = 7

function isVisible(question: ScreenQuestion, facts: Record<string, unknown>) {
  return !question.dependsOn || evaluateEligibilityRules(question.dependsOn, facts).result === true
}

export function TryAgain({ lang, onRetry }: { lang: Lang; onRetry: () => void }) {
  return (
    <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
      <p className="font-bold">{t(lang, 'tryAgainTitle')}</p>
      <p className="mt-1 text-sm leading-6">{t(lang, 'tryAgainBody')}</p>
      <button type="button" onClick={onRetry} className="btn-accent mt-4 px-4 py-2.5 text-sm">{t(lang, 'tryAgain')}</button>
    </div>
  )
}

export default function StartFlow() {
  const router = useRouter()
  const [draft, setDraft] = useState<Draft>(loadDraft)
  const [step, setStep] = useState<NextStep | null>(null)
  const [failed, setFailed] = useState(false)
  const [missing, setMissing] = useState(false)
  const lang = draft.lang

  const apply = useCallback((response: StepResponse | null) => {
    if (!response) {
      setFailed(true)
      return
    }
    if (response.step.phase !== 'first') {
      router.replace('/start/results')
      return
    }
    setStep(response.step)
    setFailed(false)
    setMissing(false)
    window.scrollTo(0, 0)
  }, [router])

  const show = useCallback(async (current: Draft) => {
    apply(await fetchStep(current.facts, current.asked))
  }, [apply])

  // The first load uses the draft as the page found it; later ones pass it in.
  const [initialDraft] = useState(draft)
  useEffect(() => {
    let active = true
    void fetchStep(initialDraft.facts, initialDraft.asked).then(response => {
      if (active) apply(response)
    })
    return () => {
      active = false
    }
  }, [apply, initialDraft])

  function update(next: Draft) {
    setDraft(next)
    saveDraft(next)
  }

  function next() {
    if (!step) return
    const visible = step.questions.filter(question => isVisible(question, draft.facts))
    if (answersMissing(visible, draft.facts)) {
      setMissing(true)
      return
    }
    const updated = withScreenAnswers(draft, step.questions, visible)
    update(updated)
    setStep(null)
    void show(updated)
  }

  function back() {
    const previous = draft.history[draft.history.length - 1]
    if (!previous) return
    const updated = { ...draft, asked: draft.asked.filter(id => !previous.includes(id)), history: draft.history.slice(0, -1) }
    update(updated)
    setStep(null)
    void show(updated)
  }

  const visibleQuestions = step?.questions.filter(question => isVisible(question, draft.facts)) ?? []
  const isLastScreen = step?.stage === FIRST_RESULT_STAGES

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5 px-4 py-6">
      <header className="flex items-center justify-between gap-3">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-slate-900">{t(lang, 'brand')}</Link>
        <LanguageSwitch lang={lang} onChange={value => update({ ...draft, lang: value })} />
      </header>

      {draft.history.length === 0 && (
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">{t(lang, 'startTitle')}</h1>
          <p className="mt-1 text-sm text-slate-500">{t(lang, 'startSub')}</p>
        </div>
      )}

      {failed && <TryAgain lang={lang} onRetry={() => void show(draft)} />}
      {!failed && !step && <p className="py-10 text-center text-sm text-slate-500">{t(lang, 'loading')}</p>}

      {!failed && step && (
        <div className="glass flex flex-col gap-6 p-5">
          {step.stage !== null && (
            <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">{t(lang, 'stepOf', { step: step.stage, total: FIRST_RESULT_STAGES })}</p>
          )}
          {visibleQuestions.map(question => (
            <QuestionField
              key={question.id}
              question={question}
              lang={lang}
              facts={draft.facts}
              activityItems={draft.activityItems}
              onActivities={(items, value) => {
                setMissing(false)
                update({ ...draft, activityItems: items, facts: { ...draft.facts, activity_codes: value } })
              }}
              onChange={changes => {
                setMissing(false)
                update({ ...draft, facts: { ...draft.facts, ...changes } })
              }}
            />
          ))}
          {missing && <p role="alert" className="text-sm font-semibold text-rose-700">{t(lang, 'pleaseAnswer')}</p>}
          <div className="flex items-center gap-3">
            {draft.history.length > 0 && (
              <button type="button" onClick={back} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">{t(lang, 'back')}</button>
            )}
            <button type="button" onClick={next} className="btn-accent flex-1 px-4 py-3 text-sm">{isLastScreen ? t(lang, 'seeResults') : t(lang, 'next')}</button>
          </div>
        </div>
      )}
    </div>
  )
}
