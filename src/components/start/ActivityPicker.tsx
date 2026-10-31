'use client'

import { useEffect, useState } from 'react'
import { searchActivityItems, suggestActivityItems, type ActivityItem } from '@/lib/start/api'
import { t } from '@/lib/start/i18n'
import { pickerState } from '@/lib/start/screen'
import type { Lang } from '@/lib/start/types'

const MAX_ACTIVITIES = 2
const SEARCH_DELAY_MS = 250

type Props = {
  lang: Lang
  chosen: ActivityItem[]
  onChange: (items: ActivityItem[]) => void
}

export default function ActivityPicker({ lang, chosen, onChange }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ActivityItem[] | null | undefined>(undefined)
  const [suggestions, setSuggestions] = useState<ActivityItem[] | null>(null)
  const [finding, setFinding] = useState(false)

  useEffect(() => {
    let current = true
    const timer = setTimeout(async () => {
      const items = await searchActivityItems(query)
      if (current) setResults(items)
    }, query ? SEARCH_DELAY_MS : 0)
    return () => {
      current = false
      clearTimeout(timer)
    }
  }, [query])

  function add(item: ActivityItem) {
    if (chosen.some(existing => existing.id === item.id) || chosen.length >= MAX_ACTIVITIES) return
    onChange([...chosen, item])
    setQuery('')
    setSuggestions(null)
  }

  async function findForMe() {
    setFinding(true)
    setSuggestions(await suggestActivityItems(query.trim()))
    setFinding(false)
  }

  const listed = (results ?? []).filter(item => !chosen.some(existing => existing.id === item.id))
  const state = pickerState(query, results)

  return (
    <div className="flex flex-col gap-3">
      {chosen.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {chosen.map(item => (
            <li key={item.id} className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-900">
              {item.label[lang]}
              <button type="button" aria-label={`${t(lang, 'remove')}: ${item.label[lang]}`} onClick={() => onChange(chosen.filter(existing => existing.id !== item.id))} className="-my-2 -mr-2 flex h-11 w-11 items-center justify-center text-lg text-indigo-500 hover:text-indigo-800">×</button>
            </li>
          ))}
        </ul>
      )}

      {chosen.length < MAX_ACTIVITIES && (
        <>
          <label className="sr-only" htmlFor="activity-search">{t(lang, 'searchLabel')}</label>
          <input
            id="activity-search"
            value={query}
            onChange={event => {
              setQuery(event.target.value)
              setSuggestions(null)
            }}
            placeholder={t(lang, 'searchPlaceholder')}
            autoComplete="off"
            className="glass-input w-full px-4 py-3 text-base"
          />

          <ul className="flex flex-col gap-2">
            {listed.map(item => (
              <li key={item.id}>
                <button type="button" onClick={() => add(item)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:border-indigo-300 hover:bg-indigo-50">
                  {item.label[lang]}
                </button>
              </li>
            ))}
          </ul>

          {state === 'failed' && <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{t(lang, 'searchFailed')}</p>}

          {state === 'none' && (
            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">
              <p>{t(lang, 'noMatch')}</p>
              {suggestions === null && (
                <button type="button" onClick={findForMe} disabled={finding} className="mt-2 font-semibold text-indigo-700 underline underline-offset-2 disabled:opacity-50">
                  {finding ? t(lang, 'finding') : t(lang, 'helpMeFind')}
                </button>
              )}
              {suggestions !== null && suggestions.length === 0 && <p className="mt-2">{t(lang, 'suggestNothing')}</p>}
              {suggestions !== null && suggestions.length > 0 && (
                <ul className="mt-3 flex flex-col gap-2">
                  {suggestions.map(item => (
                    <li key={item.id}>
                      <button type="button" onClick={() => add(item)} className="w-full rounded-xl border border-indigo-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-800 hover:bg-indigo-50">
                        {item.label[lang]}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
