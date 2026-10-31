import Link from 'next/link'
import VerdictCard from '@/components/founder/VerdictCard'
import { Card } from '@/components/ui/founder'
import { toneClasses } from '@/lib/design/tones'
import { answerWordsFor, factLabelsOf } from '@/lib/founder/answers'
import { answersLine, type SavedScheme } from '@/lib/founder/browse'
import type { FounderResults } from '@/lib/founder/load-results'
import { ft } from '@/lib/founder/text'
import type { Bucket } from '@/lib/opportunities/engine/types'
import { t } from '@/lib/start/i18n'
import type { Lang } from '@/lib/start/types'
import { cn } from '@/lib/utils'

const BUTTON = 'inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-bold'
const FILLED = 'bg-act text-on-act'
const LINK = 'inline-flex min-h-11 items-center text-sm font-bold text-act-ink underline underline-offset-2'

// The sections shown open, in the order a founder wants them. Not for you comes last, closed.
const SECTIONS: { bucket: Exclude<Bucket, 'D'>; tone: 'go' | 'step' | 'wait' }[] = [
  { bucket: 'A', tone: 'go' },
  { bucket: 'B', tone: 'step' },
  { bucket: 'C', tone: 'wait' },
]

type Props = {
  founder: FounderResults
  lang: Lang
  // Where a founder answers what a card still needs, and changes the answers the list is sorted by.
  answerHref: string
  // The page this one reloads to, for when results could not load.
  retryHref: string
  saved: SavedScheme[]
}

type Ready = Extract<FounderResults, { status: 'ready' }>

const detailHref = (slug: string) => `/dashboard/schemes/${encodeURIComponent(slug)}`

function SavedList({ saved }: { saved: SavedScheme[] }) {
  if (saved.length === 0) return null
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-ink">{ft('savedTitle')}</h2>
      <ul className="flex flex-col gap-2">
        {saved.map(scheme => (
          <li key={scheme.slug}>
            <Link
              href={detailHref(scheme.slug)}
              className="flex min-h-11 items-center rounded-xl border border-line bg-card px-4 py-2 text-sm font-semibold break-words text-ink"
            >
              {scheme.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Sorted({ founder, lang, answerHref, saved }: Omit<Props, 'founder' | 'retryHref'> & { founder: Ready }) {
  const { results, bundle, answers } = founder
  const labels = factLabelsOf(bundle)
  const answerWords = answerWordsFor(answers, bundle)
  const line = answersLine(answers, bundle, lang)
  const open = results.counts.A + results.counts.B + results.counts.C

  const cards = (bucket: Bucket) => results.buckets[bucket].map(item => (
    <VerdictCard
      key={item.id}
      item={item}
      combination={results.combination}
      lang={lang}
      labels={labels}
      answerWords={answerWords}
      detailHref={detailHref(item.slug)}
      answerHref={answerHref}
    />
  ))

  return (
    <>
      {line ? (
        <div className="flex flex-col items-start gap-x-3 sm:flex-row sm:flex-wrap sm:items-center">
          <p className="min-w-0 text-sm text-ink-2">{ft('sortedUsing', { answers: line })}</p>
          <Link href={answerHref} className={LINK}>{ft('changeDetails')}</Link>
        </div>
      ) : null}

      {SECTIONS.filter(section => results.counts[section.bucket] > 0).map(section => (
        <section key={section.bucket} className="flex flex-col gap-3">
          <h2 className={cn('text-xl font-bold', toneClasses(section.tone).ink)}>
            {t(lang, `bucket${section.bucket}`)} ({results.counts[section.bucket]})
          </h2>
          {cards(section.bucket)}
        </section>
      ))}

      {open === 0 ? <Card><p className="text-sm text-ink-2">{ft('nothingForYou')}</p></Card> : null}

      <SavedList saved={saved} />

      {results.counts.D > 0 ? (
        <details className="group rounded-2xl bg-wait-soft">
          <summary className="flex min-h-11 cursor-pointer flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3">
            <span className="flex flex-col gap-0.5">
              <strong className="text-base text-ink">{t(lang, 'bucketD')} ({results.counts.D})</strong>
              <span className="text-sm text-ink-2">{t(lang, 'bucketDDesc')}</span>
            </span>
            <span className="text-sm font-bold text-act-ink group-open:hidden">{t(lang, 'showList')}</span>
            <span className="hidden text-sm font-bold text-act-ink group-open:inline">{t(lang, 'hideList')}</span>
          </summary>
          <div className="flex flex-col gap-3 px-4 pb-4">{cards('D')}</div>
        </details>
      ) : null}
    </>
  )
}

/** The For you view: the founder's own schemes sorted by verdict, or what to do when there is nothing to sort. */
export default function SchemesForYou(props: Props) {
  const { founder, lang, answerHref, retryHref, saved } = props

  if (founder.status === 'ready') {
    return <div className="flex flex-col gap-6"><Sorted founder={founder} lang={lang} answerHref={answerHref} saved={saved} /></div>
  }

  return (
    <div className="flex flex-col gap-6">
      {founder.status === 'no_answers' ? (
        <Card>
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-ink">{ft('tellTitle')}</h2>
            <p className="text-sm text-ink-2">{ft('tellBody')}</p>
            <div><Link href={answerHref} className={cn(BUTTON, FILLED)}>{ft('tellCta')}</Link></div>
          </div>
        </Card>
      ) : (
        <Card>
          <div role="alert" className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-ink">{t(lang, 'tryAgainTitle')}</h2>
            <p className="text-sm text-ink-2">{t(lang, 'tryAgainBody')}</p>
            <div><Link href={retryHref} className={LINK}>{t(lang, 'tryAgain')}</Link></div>
          </div>
        </Card>
      )}
      <SavedList saved={saved} />
    </div>
  )
}
