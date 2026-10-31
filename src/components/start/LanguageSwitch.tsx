'use client'

import type { Lang } from '@/lib/start/types'

const LANGS: { value: Lang; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी' },
  { value: 'mr', label: 'मराठी' },
]

export default function LanguageSwitch({ lang, onChange }: { lang: Lang; onChange: (lang: Lang) => void }) {
  return (
    <div role="group" aria-label="Language" className="flex gap-1 rounded-xl bg-slate-100 p-1">
      {LANGS.map(option => (
        <button
          key={option.value}
          type="button"
          aria-pressed={lang === option.value}
          onClick={() => onChange(option.value)}
          className={`min-h-10 rounded-lg px-3 text-xs font-semibold transition ${lang === option.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
