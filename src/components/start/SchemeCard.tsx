'use client'

import type { RecordResult } from '@/lib/opportunities/engine/results'
import { formatDate, formatInr, formatRange } from '@/lib/start/format'
import { t, type TextKey } from '@/lib/start/i18n'
import type { Lang, Text } from '@/lib/start/types'

const STATUS_KEYS: Record<string, TextKey> = {
  active: 'statusActive',
  upcoming: 'statusUpcoming',
  paused: 'statusPaused',
  pending_renewal: 'statusRenewal',
  closed: 'statusClosed',
}

const STATUS_STYLE: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  upcoming: 'bg-sky-50 text-sky-700',
  paused: 'bg-amber-50 text-amber-800',
  pending_renewal: 'bg-orange-50 text-orange-800',
  closed: 'bg-slate-100 text-slate-600',
}

function windowText(item: RecordResult, lang: Lang) {
  const dated = item.windows.filter(window => window.closesAt || window.opensAt)
  if (item.windowState === 'not_yet_open') {
    const opens = dated.map(window => window.opensAt).find(Boolean)
    return opens ? t(lang, 'windowOpens', { from: formatDate(opens, lang) }) : null
  }
  if (item.windowState === 'closed') {
    const closes = dated.map(window => window.closesAt).filter(Boolean).sort().at(-1)
    return closes ? t(lang, 'windowUntil', { to: formatDate(closes, lang) }) : null
  }
  const current = dated.find(window => window.closesAt)
  if (current?.closesAt && current.opensAt) return t(lang, 'windowDates', { from: formatDate(current.opensAt, lang), to: formatDate(current.closesAt, lang) })
  return item.windows.some(window => window.windowType === 'rolling') ? null : t(lang, 'checkPortal')
}

function Line({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <dt className="text-sm text-slate-600">{label}{note && <span className="mt-0.5 block text-xs text-slate-400">{note}</span>}</dt>
      <dd className="shrink-0 text-right text-sm font-bold text-slate-900">{value}</dd>
    </div>
  )
}

export default function SchemeCard({ item, lang, labels }: { item: RecordResult; lang: Lang; labels: Record<string, Text> }) {
  const labelOf = (key: string) => labels[key]?.[lang] ?? key.replace(/_/g, ' ')
  const lines = item.lines
  const statusKey = item.freshness === 'stale' ? 'statusUnconfirmed' : STATUS_KEYS[item.status] ?? 'statusUnconfirmed'
  const checked = formatDate(item.lastCheckedAt, lang)
  const windowLine = item.bucket === 'D' ? null : windowText(item, lang)
  const nothingTested = item.bucket === 'B' && item.decidedBy.length === 0 && item.steps.length === 0
  const interest = lines?.interestRatePct ?? null
  const subvention = lines?.interestSubventionPct ?? null

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-bold leading-snug text-slate-900">{item.title}</h3>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
        <span className={`rounded-full px-2 py-0.5 font-bold ${item.freshness === 'stale' ? 'bg-amber-50 text-amber-800' : STATUS_STYLE[item.status] ?? 'bg-slate-100 text-slate-600'}`}>{t(lang, statusKey)}</span>
        <span className={item.freshness === 'amber' ? 'font-semibold text-amber-700' : 'text-slate-400'}>{checked ? t(lang, 'checkedOn', { date: checked }) : t(lang, 'checkDue')}</span>
      </div>
      {windowLine && <p className="mt-2 text-xs text-slate-500">{windowLine}</p>}

      {lines && (
        <div className={`mt-3 rounded-lg p-3 ${lines.ifRenewed ? 'bg-slate-50 opacity-80' : 'bg-indigo-50/60'}`}>
          {lines.ifRenewed && <p className="mb-1 text-xs font-bold text-slate-600">{t(lang, 'ifRenewed')}</p>}
          <dl className="divide-y divide-slate-200/70">
            <Line label={t(lang, 'projectCost')} value={formatRange(lines.projectCost, lang)} />
            <Line label={t(lang, 'ownMoney')} value={lines.own ? formatRange(lines.own, lang) : t(lang, 'ownNotStated')} />
            <Line label={t(lang, 'subsidy')} value={formatRange(lines.subsidy, lang)} />
            {lines.loan && <Line label={t(lang, 'loan')} value={formatRange(lines.loan, lang)} />}
            {(lines.uncovered.max === null || lines.uncovered.max > 0) && (
              <Line label={t(lang, 'toArrange')} value={formatRange(lines.uncovered, lang)} note={lines.own ? undefined : t(lang, 'toArrangeNote')} />
            )}
          </dl>
          {interest !== null && (
            <p className="mt-2 text-xs text-slate-600">
              {subvention ? t(lang, 'interestAfter', { rate: interest, net: interest - subvention }) : t(lang, 'interest', { rate: interest })}
            </p>
          )}
          {lines.ownShortfall && <p className="mt-2 text-xs font-semibold text-rose-700">{t(lang, 'ownShortfall')}</p>}
          {lines.betterIfAnswered.length > 0 && (
            <p className="mt-2 text-xs text-slate-600">{t(lang, 'betterRate', { labels: lines.betterIfAnswered.map(labelOf).join(', ') })}</p>
          )}
        </div>
      )}
      {!lines && item.bucket === 'A' && <p className="mt-3 text-xs text-slate-500">{t(lang, 'noAmount')}</p>}

      {item.steps.length > 0 && (
        <ul className="mt-3 space-y-1 text-xs font-semibold text-indigo-800">
          {item.steps.map(step => (
            <li key={`${step.kind}-${step.factKey}`}>{t(lang, step.kind === 'obtain' ? 'stepObtain' : 'stepAnswer', { label: labelOf(step.factKey) })}</li>
          ))}
        </ul>
      )}
      {nothingTested && <p className="mt-3 text-xs text-slate-600">{t(lang, 'departmentDecides')}</p>}
      {item.aboveLimitInr !== null && <p className="mt-2 text-xs text-slate-600">{t(lang, 'aboveLimit', { limit: formatInr(item.aboveLimitInr) })}</p>}
      {item.bucket === 'D' && item.aboveLimitInr === null && item.failedFacts.length > 0 && (
        <p className="mt-2 text-xs text-slate-600">{t(lang, 'whyFacts', { labels: item.failedFacts.map(labelOf).join(', ') })}</p>
      )}
      {item.bucket !== 'D' && item.bankChecks.length > 0 && (
        <details className="mt-3 text-xs text-slate-500">
          <summary className="cursor-pointer font-semibold">{t(lang, 'bankWillCheck')}</summary>
          <ul className="mt-1 list-disc space-y-1 pl-4">{item.bankChecks.map(check => <li key={check}>{check}</li>)}</ul>
        </details>
      )}

      <a href={`/schemes/${item.slug}`} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs font-bold text-indigo-700 underline underline-offset-2">{t(lang, 'seeDetails')}</a>
    </article>
  )
}
