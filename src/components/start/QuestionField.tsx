'use client'

import ActivityPicker from './ActivityPicker'
import type { ActivityItem } from '@/lib/start/api'
import { t } from '@/lib/start/i18n'
import type { ScreenQuestion } from '@/lib/start/next-screen'
import type { FlowFact, Lang } from '@/lib/start/types'

const DONT_KNOW = 'dont_know'
const PREFER_NOT = 'prefer_not'
const MAX_BUTTON_OPTIONS = 12

type Props = {
  question: ScreenQuestion
  lang: Lang
  facts: Record<string, unknown>
  activityItems: ActivityItem[]
  onChange: (changes: Record<string, unknown>) => void
  onActivities: (items: ActivityItem[], value: unknown) => void
}

function ChoiceButton({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${selected ? 'border-indigo-500 bg-indigo-50 text-indigo-900' : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'}`}
    >
      {children}
    </button>
  )
}

function SingleChoice({ fact, lang, value, onChange }: { fact: FlowFact; lang: Lang; value: unknown; onChange: (value: unknown) => void }) {
  const options = fact.options.filter(option => option.value !== PREFER_NOT)
  if (options.length > MAX_BUTTON_OPTIONS) {
    return (
      <select
        aria-label={fact.label[lang]}
        value={typeof value === 'string' && value !== DONT_KNOW && value !== PREFER_NOT ? value : ''}
        onChange={event => onChange(event.target.value)}
        className="glass-input w-full px-4 py-3 text-base"
      >
        <option value="" disabled>{t(lang, 'select')}</option>
        {options.map(option => <option key={option.value} value={option.value}>{option.label[lang]}</option>)}
      </select>
    )
  }
  return (
    <div className="flex flex-col gap-2">
      {options.map(option => (
        <ChoiceButton key={option.value} selected={value === option.value} onClick={() => onChange(option.value)}>
          {option.label[lang]}
        </ChoiceButton>
      ))}
    </div>
  )
}

/** One question: its prompt, its reason, its answer control and its way out. */
export default function QuestionField({ question, lang, facts, activityItems, onChange, onActivities }: Props) {
  const fact = question.facts[0]
  const value = facts[fact.key]
  const set = (next: unknown) => onChange({ [fact.key]: next })
  const inputId = `field-${question.id}`
  const isNonAnswer = value === DONT_KNOW || value === PREFER_NOT

  const allDontKnow = question.kind === 'multi' && question.facts.every(item => facts[item.key] === DONT_KNOW)

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-lg font-bold leading-snug text-slate-900">
        <label htmlFor={['text', 'number', 'date'].includes(question.kind) ? inputId : undefined}>{question.prompt[lang]}</label>
      </legend>
      {question.help && <p className="-mt-1 text-sm leading-6 text-slate-500">{question.help[lang]}</p>}

      {question.kind === 'activity_search' && (
        <ActivityPicker
          lang={lang}
          chosen={activityItems}
          onChange={items => onActivities(items, items.length ? items.map(item => item.id) : undefined)}
        />
      )}

      {(question.kind === 'single' || question.kind === 'band') && (
        <SingleChoice fact={fact} lang={lang} value={value} onChange={set} />
      )}

      {question.kind === 'yes_no' && (
        <div className="grid grid-cols-2 gap-2">
          <ChoiceButton selected={value === true} onClick={() => set(true)}>{t(lang, 'yes')}</ChoiceButton>
          <ChoiceButton selected={value === false} onClick={() => set(false)}>{t(lang, 'no')}</ChoiceButton>
        </div>
      )}

      {question.kind === 'number' && (
        <input
          id={inputId}
          type="number"
          inputMode="numeric"
          min={0}
          value={typeof value === 'number' ? value : ''}
          onChange={event => set(event.target.value === '' ? undefined : Number(event.target.value))}
          className="glass-input w-full px-4 py-3 text-base"
        />
      )}

      {question.kind === 'text' && (
        <input
          id={inputId}
          maxLength={100}
          value={typeof value === 'string' && !isNonAnswer ? value : ''}
          onChange={event => set(event.target.value || undefined)}
          className="glass-input w-full px-4 py-3 text-base"
        />
      )}

      {question.kind === 'date' && (
        <input
          id={inputId}
          type="date"
          max={new Date().toISOString().slice(0, 10)}
          value={typeof value === 'string' && !isNonAnswer ? value : ''}
          onChange={event => set(event.target.value || undefined)}
          className="glass-input w-full px-4 py-3 text-base"
        />
      )}

      {question.kind === 'multi' && (
        <div className="flex flex-col gap-2">
          {question.facts.map(item => (
            <label key={item.key} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition ${facts[item.key] === true ? 'border-indigo-500 bg-indigo-50 text-indigo-900' : 'border-slate-200 bg-white text-slate-700'}`}>
              <input
                type="checkbox"
                checked={facts[item.key] === true}
                onChange={event => onChange({ [item.key]: event.target.checked })}
                className="h-4 w-4 accent-indigo-600"
              />
              {item.label[lang]}
            </label>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {question.kind === 'multi' ? (
          <button
            type="button"
            aria-pressed={allDontKnow}
            onClick={() => onChange(Object.fromEntries(question.facts.map(item => [item.key, DONT_KNOW])))}
            className={`chip ${allDontKnow ? 'selected' : ''}`}
          >
            {t(lang, 'dontKnow')}
          </button>
        ) : (
          <button
            type="button"
            aria-pressed={value === DONT_KNOW}
            onClick={() => (question.kind === 'activity_search' ? onActivities([], DONT_KNOW) : set(DONT_KNOW))}
            className={`chip ${value === DONT_KNOW ? 'selected' : ''}`}
          >
            {t(lang, 'dontKnow')}
          </button>
        )}
        {fact.sensitive && (
          <button type="button" aria-pressed={value === PREFER_NOT} onClick={() => set(PREFER_NOT)} className={`chip ${value === PREFER_NOT ? 'selected' : ''}`}>
            {t(lang, 'preferNot')}
          </button>
        )}
      </div>
    </fieldset>
  )
}
