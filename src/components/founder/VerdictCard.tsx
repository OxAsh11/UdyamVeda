import Link from 'next/link'
import { Card, MoneyTile, StatusChip, VerdictBand } from '@/components/ui/founder'
import { cardContent } from '@/lib/founder/card'
import { toneClasses } from '@/lib/design/tones'
import type { Combination } from '@/lib/opportunities/engine/combination'
import type { RecordResult } from '@/lib/opportunities/engine/results'
import { t } from '@/lib/start/i18n'
import type { Lang, Text } from '@/lib/start/types'
import { cn } from '@/lib/utils'

const BUTTON = 'inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-bold'
const FILLED = 'bg-act text-on-act'
const OUTLINED = 'border border-act text-act-ink'
const LINE_INK = { go: toneClasses('go').ink, step: toneClasses('step').ink, plain: 'text-ink' }

type Props = {
  item: RecordResult
  combination: Combination
  lang: Lang
  labels: Record<string, Text>
  answerWords: Record<string, Text>
  detailHref: string
  // Left out where the questions are answered on the same page: the card then only lists them.
  answerHref?: string
  // A signed-out visitor keeps their results open while reading the details.
  newTab?: boolean
}

/** One scheme, led by the verdict. Every page that shows a scheme to a founder uses this card. */
export default function VerdictCard({ item, combination, lang, labels, answerWords, detailHref, answerHref, newTab = false }: Props) {
  const card = cardContent(item, combination, lang, labels, answerWords)
  const money = card.money
  const canAnswer = answerHref !== undefined && card.toAnswer.length > 0

  return (
    <article>
      <Card>
        <div className="flex flex-col gap-3">
          <VerdictBand tone={card.verdict.tone} text={card.verdict.text} />

          <div className="flex flex-wrap gap-4">
            <div className="flex min-w-0 flex-[1_1_20rem] flex-col gap-2">
              <h3 className="text-lg leading-snug font-bold break-words text-ink">{item.title}</h3>
              {card.verdict.detail ? <p className="text-sm text-ink-2">{card.verdict.detail}</p> : null}
              {card.windowLine ? <p className="text-sm text-ink-2">{card.windowLine}</p> : null}
              {card.why ? <p className="text-sm text-ink-2">{card.why}</p> : null}
              {card.nextStep ? <p className="text-sm text-ink-2">{card.nextStep}</p> : null}
              {card.noAmount ? <p className="text-sm text-ink-2">{t(lang, 'noAmount')}</p> : null}
              {card.toAnswer.length > 0 ? (
                <ul className="flex flex-wrap gap-1.5">
                  {card.toAnswer.map(label => (
                    <li key={label} className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', toneClasses('step').chip)}>{label}</li>
                  ))}
                </ul>
              ) : null}
              {card.toObtain.length > 0 ? (
                <ul className="flex flex-col gap-1">
                  {card.toObtain.map(text => <li key={text} className={cn('text-sm font-semibold', toneClasses('step').ink)}>{text}</li>)}
                </ul>
              ) : null}
              {card.ownShortfall ? <div><StatusChip tone="step" text={card.ownShortfall} /></div> : null}
              {card.betterRate ? <p className="text-sm text-ink-2">{card.betterRate}</p> : null}
              {card.bankChecks.length > 0 ? (
                <details className="text-sm text-ink-2">
                  <summary className="cursor-pointer py-3 font-semibold">{t(lang, 'bankWillCheck')}</summary>
                  <ul className="list-disc space-y-1 pb-2 pl-5">
                    {card.bankChecks.map(check => <li key={check}>{check}</li>)}
                  </ul>
                </details>
              ) : null}
            </div>

            {money || card.moneyLines.length > 0 ? (
              <div className="min-w-0 flex-[1_1_14rem]">
                {money ? <MoneyTile label={money.label} value={money.value} note={money.note ?? undefined} tone={money.tone === 'plain' ? undefined : money.tone} /> : null}
                {card.moneyLines.length > 0 ? (
                  <div className={money ? 'mt-3' : undefined}>
                    {card.ifRenewed ? <p className="text-xs font-semibold text-ink-2">{t(lang, 'ifRenewed')}</p> : null}
                    <dl className="divide-y divide-line">
                      {card.moneyLines.map(line => (
                        <div key={line.label} className="flex items-baseline justify-between gap-3 py-1.5">
                          <dt className="min-w-0 flex-1 text-sm text-ink-2">
                            {line.label}
                            {line.note ? <span className="mt-0.5 block text-xs">{line.note}</span> : null}
                          </dt>
                          <dd className={cn('max-w-[60%] text-right text-sm font-bold break-words', LINE_INK[line.tone])}>{line.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ) : null}
              </div>
            ) : null}
            {card.couldMean ? (
              <div className="min-w-0 flex-[1_1_14rem]">
                <MoneyTile label={t(lang, 'moneyCouldMean')} value={card.couldMean} />
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div className="flex flex-wrap gap-2">
              {canAnswer ? <Link href={answerHref} className={cn(BUTTON, FILLED)}>{t(lang, 'answerNow')}</Link> : null}
              <Link
                href={detailHref}
                // Each prefetch would look the founder up again, and on the start page cross hosts.
                prefetch={false}
                {...(newTab ? { target: '_blank', rel: 'noreferrer' } : {})}
                className={cn(BUTTON, item.bucket === 'A' ? FILLED : OUTLINED)}
              >
                {t(lang, 'seeDetails')}
              </Link>
            </div>
            <p className={cn('text-xs', card.checkedStale ? 'font-semibold text-step-ink' : 'text-ink-2')}>
              {card.checkedOn ? t(lang, 'checkedOn', { date: card.checkedOn }) : t(lang, 'checkDue')}
            </p>
          </div>
        </div>
      </Card>
    </article>
  )
}
