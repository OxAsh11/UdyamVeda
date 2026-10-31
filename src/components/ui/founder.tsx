import type { ReactNode } from 'react'
import { ArrowRight, Check, Pause, TriangleAlert, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toneClasses, type Tone } from '@/lib/design/tones'

// Colour is never the only signal: each tone also has its own icon, and the text says the same thing.
const TONE_ICON: Record<Tone, LucideIcon> = {
  go: Check,
  step: ArrowRight,
  wait: Pause,
  urgent: TriangleAlert,
}

export function VerdictBand({ tone, text, aside }: { tone: Tone; text: string; aside?: ReactNode }) {
  const Icon = TONE_ICON[tone]
  return (
    <div className={cn('flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl px-4 py-3', toneClasses(tone).band)}>
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      <p className="min-w-[10rem] flex-1 text-base font-semibold leading-snug break-words">{text}</p>
      {aside ? <div className="shrink-0 text-sm">{aside}</div> : null}
    </div>
  )
}

export function StatusChip({ tone, text }: { tone: Tone; text: string }) {
  const Icon = TONE_ICON[tone]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', toneClasses(tone).chip)}>
      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      {text}
    </span>
  )
}

export function MoneyTile({ label, value, note, tone }: { label: string; value: string; note?: string; tone?: Tone }) {
  const classes = tone ? toneClasses(tone) : null
  return (
    <div className={cn('min-w-0 rounded-2xl border p-4', classes ? [classes.soft, classes.line] : 'border-line bg-card')}>
      <p className="text-xs font-medium text-ink-2">{label}</p>
      <p className={cn('mt-1 text-xl font-bold break-words', classes ? classes.ink : 'text-ink')}>{value}</p>
      {note ? <p className="mt-1 text-xs text-ink-2">{note}</p> : null}
    </div>
  )
}

export function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
        {sub ? <p className="mt-1 text-sm text-ink-2">{sub}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  )
}

export function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-line bg-card p-4 text-ink">{children}</div>
}
