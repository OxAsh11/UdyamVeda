import type { ReactNode } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, ExternalLink, Minus } from 'lucide-react'
import SchemeActions from '@/components/founder/SchemeActions'
import { Card, MoneyTile, StatusChip, VerdictBand } from '@/components/ui/founder'
import { AUTH_REQUIRED } from '@/lib/auth/mode'
import { toneClasses } from '@/lib/design/tones'
import { answerWordsFor, checkedFacts, factLabelsOf, labelReader } from '@/lib/founder/answers'
import { ANSWER_HREF, chipFor, findResult, SCHEMES_PATH } from '@/lib/founder/browse'
import { cardContent } from '@/lib/founder/card'
import {
  benefitRows, connectedSchemes, keepReady, loadRateQuote, loadSchemeState, moneyTiles, offersChecklist, recordSections, recordSummary, suggestionFor,
  tilesNote, windowLineFor,
  type SchemeState,
} from '@/lib/founder/detail'
import { loadFounderResults, type FounderResults } from '@/lib/founder/load-results'
import { ft } from '@/lib/founder/text'
import { publicText } from '@/lib/opportunities/display'
import { getPublishedOpportunity } from '@/lib/opportunities/published'
import { formatDate } from '@/lib/start/format'
import { t } from '@/lib/start/i18n'
import type { Lang } from '@/lib/start/types'
import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

// The page is English for now; the words are translated in M5.
const LANG: Lang = 'en'

// Until the My path page exists, the nearest thing is the registrations page.
const PATH_HREF = '/dashboard/registration'
const DOCUMENTS_HREF = '/dashboard/documents'

const BUTTON = 'inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-bold'
const FILLED = 'bg-act text-on-act'
const OUTLINED = 'border border-act text-act-ink'
const LINK = 'inline-flex min-h-11 items-center text-sm font-bold text-act-ink underline underline-offset-2'

type PageProps = {
  params: Promise<{ slug: string }>
}

const isWebAddress = (url: string) => /^https?:\/\//i.test(url)

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        {children}
      </section>
    </Card>
  )
}

function External({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      <span className="min-w-0 break-words">{children}</span>
      <ExternalLink className="ml-1.5 size-4 shrink-0" aria-hidden="true" />
      <span className="sr-only">{ft('newTab')}</span>
    </a>
  )
}

/** Who is looking, if we can tell. Without an account there is no one to look up. */
async function signedIn() {
  if (!AUTH_REQUIRED) return null
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user ? { supabase, userId: user.id } : null
}

export default async function OpportunityDetailPage({ params }: PageProps) {
  const { slug } = await params
  const now = new Date()
  const [opportunity, session] = await Promise.all([getPublishedOpportunity(slug), signedIn()])
  if (!opportunity) notFound()

  // Anyone we cannot look up is shown the same as someone with no answers.
  const nobody: FounderResults = { status: 'no_answers', bundle: null }
  const none: SchemeState = { applicationId: null, saved: false }
  const [founder, state] = session
    ? await Promise.all([loadFounderResults(session.supabase, session.userId, now), loadSchemeState(session.supabase, session.userId, slug)])
    : [nobody, none]

  const ready = founder.status === 'ready' ? founder : null
  const record = ready?.catalog.records.find(candidate => candidate.slug === slug)
  const item = ready ? findResult(ready.results, slug) : undefined
  const labels = ready ? factLabelsOf(ready.bundle) : {}
  const answerWords = ready ? answerWordsFor(ready.answers, ready.bundle) : {}

  // The verdict is the engine's, worded once for every page; the rest is read from the same result.
  const verdict = chipFor(slug, founder, LANG, now)
  const card = ready && item ? cardContent(item, ready.results.combination, LANG, labels, answerWords, now) : null
  const checked = ready && item ? checkedFacts(item, answerWords, labels, LANG) : []
  const suggestion = ready && item ? suggestionFor(item, ready.results.combination, LANG) : null
  const tiles = item?.lines ? moneyTiles(item.lines, LANG) : []
  const connected = ready && record
    ? connectedSchemes(record, ready.results, ready.catalog.relationships, LANG, labelReader(labels, LANG), now)
    : []
  const quote = session && record && item?.lines ? await loadRateQuote(session.supabase, record.versionId, item.lines.rateLabel) : null

  const sections = recordSections(opportunity)
  const keep = keepReady(opportunity.requirements, ready?.answers ?? {})
  const savable = ['active', 'upcoming'].includes(opportunity.status)

  const checkedOn = card ? card.checkedOn : formatDate(record?.lastCheckedAt ?? opportunity.lastVerifiedAt, LANG) || null
  const checkedText = checkedOn ? t(LANG, 'checkedOn', { date: checkedOn }) : t(LANG, 'checkDue')
  // A line the record only fills with a fixed fallback is left out, not shown as if it were its own words.
  const summary = recordSummary(opportunity)
  const windowText = windowLineFor(card?.windowLine ?? null, item?.windowState, summary.window, LANG)
  const renewedNote = tilesNote(item?.lines ?? null)
  const benefits = benefitRows(opportunity.benefits, summary.benefit, LANG)
  const windowNote = publicText(opportunity.windowNote)
  const hasMoney = tiles.length > 0 || summary.benefit !== null

  const hasChecked = checked.length > 0 || (card?.toAnswer.length ?? 0) > 0 || (card?.toObtain.length ?? 0) > 0 || (card?.bankChecks.length ?? 0) > 0
  const sourceLinks = [
    ...opportunity.sources.filter(source => isWebAddress(source.url)),
    // The rate's own source, when the record does not list it.
    ...(quote && !opportunity.sources.some(source => source.url === quote.sourceUrl) ? [{ url: quote.sourceUrl, title: null, isPrimary: false, pageNumber: null, section: null, anchor: null }] : []),
  ]

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5 p-5 md:p-8">
      <Link href={SCHEMES_PATH} className={LINK}>{ft('backToSchemes')}</Link>

      <Card>
        <div className="flex flex-col gap-3">
          {verdict ? (
            <div className="flex flex-col gap-2">
              <VerdictBand tone={verdict.tone} text={verdict.text} aside={checkedText} />
              {verdict.detail ? <p className="text-sm text-ink-2">{verdict.detail}</p> : null}
              <p className="text-sm text-ink-2">{ft('finalDecision')}</p>
            </div>
          ) : founder.status === 'unavailable' ? (
            <div role="alert" className="flex flex-col gap-2 rounded-2xl bg-wait-soft p-4">
              <h2 className="text-lg font-bold text-ink">{t(LANG, 'tryAgainTitle')}</h2>
              <p className="text-sm text-ink-2">{t(LANG, 'tryAgainBody')}</p>
              <div><Link href={`${SCHEMES_PATH}/${encodeURIComponent(slug)}`} className={LINK}>{t(LANG, 'tryAgain')}</Link></div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 rounded-2xl bg-act-soft p-4">
              <h2 className="text-lg font-bold text-ink">{ft('tellTitle')}</h2>
              <p className="text-sm text-ink-2">{ft('tellBody')}</p>
              <div><Link href={ANSWER_HREF} className={cn(BUTTON, FILLED)}>{ft('tellCta')}</Link></div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            {summary.authority ? <p className="text-sm text-ink-2">{summary.authority}</p> : null}
            <h1 className="text-2xl leading-tight font-bold tracking-tight break-words text-ink">{opportunity.name}</h1>
          </div>
          {summary.description ? <p className="text-base text-ink-2">{summary.description}</p> : null}
          {windowText || windowNote || summary.processing ? (
            <div className="flex flex-col gap-0.5 text-sm text-ink-2">
              {windowText ? <p>{windowText}</p> : null}
              {windowNote ? <p>{windowNote}</p> : null}
              {summary.processing ? <p>{ft('processingIs', { value: summary.processing })}</p> : null}
            </div>
          ) : null}

          {suggestion ? (
            <div className="flex flex-col gap-1 rounded-2xl bg-act-soft p-4">
              <h2 className="text-base font-bold text-act-ink">{ft('suggestionTitle')}</h2>
              <p className="text-base text-ink">{suggestion}</p>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            {session ? (
              <SchemeActions
                slug={slug}
                applicationId={state.applicationId}
                saved={state.saved}
                canSave={savable}
                canStart={savable && offersChecklist(founder, slug)}
              />
            ) : null}
            {isWebAddress(opportunity.officialUrl) ? (
              <External href={opportunity.officialUrl} className={cn(BUTTON, OUTLINED)}>{ft('officialSource')}</External>
            ) : null}
          </div>
        </div>
      </Card>

      {hasMoney || card?.noAmount || card?.ownShortfall || card?.betterRate ? (
        <section aria-label={ft('tilesLabel')} className="flex flex-col gap-2">
          {renewedNote && tiles.length > 0 ? <p className="text-sm font-semibold text-ink-2">{renewedNote}</p> : null}
          {hasMoney ? (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(13rem,1fr))] gap-3">
              {tiles.length > 0
                ? tiles.map(tile => (
                  <MoneyTile key={tile.label} label={tile.label} value={tile.value} note={tile.note ?? undefined} tone={tile.tone === 'plain' ? undefined : tile.tone} />
                ))
                : <MoneyTile label={ft('benefitShort')} value={summary.benefit ?? ''} />}
            </div>
          ) : null}
          {tiles.length === 0 && card?.noAmount ? <p className="text-sm text-ink-2">{t(LANG, 'noAmount')}</p> : null}
          {card?.ownShortfall ? <div><StatusChip tone="step" text={card.ownShortfall} /></div> : null}
          {card?.betterRate ? <p className="text-sm text-ink-2">{card.betterRate}</p> : null}
        </section>
      ) : null}

      {benefits.length > 0 ? (
        <Block title={ft('benefitTitle')}>
          <ul className="flex flex-col divide-y divide-line">
            {benefits.map((row, index) => (
              <li key={`${row.label}-${row.amount}-${index}`} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 py-2 first:pt-0 last:pb-0">
                {row.label ? <span className="min-w-0 flex-[1_1_12rem] text-base break-words text-ink">{row.label}</span> : null}
                {row.amount ? <strong className="text-base break-words text-ink">{row.amount}</strong> : null}
              </li>
            ))}
          </ul>
        </Block>
      ) : null}

      {hasChecked || keep.length > 0 ? (
        <div className="grid items-start gap-4 lg:grid-cols-2">
          {hasChecked && card ? (
            <Block title={ft('checkedTitle')}>
              {checked.length > 0 ? (
                <ul className="flex flex-col divide-y divide-line">
                  {checked.map(fact => (
                    <li key={fact.key} className="flex gap-2.5 py-2 first:pt-0">
                      {/* The rule reads an answer whether or not it matched: only one that matched gets the tick. */}
                      {fact.met
                        ? <Check className={cn('mt-0.5 size-4 shrink-0', toneClasses('go').ink)} aria-hidden="true" />
                        : <Minus className={cn('mt-0.5 size-4 shrink-0', toneClasses('wait').ink)} aria-hidden="true" />}
                      <span className="min-w-0 text-sm break-words text-ink-2">
                        {fact.label}
                        <strong className="block text-base text-ink">{ft('youSaid', { answer: fact.answer })}</strong>
                        {fact.met ? null : <span className={cn('block text-xs font-semibold', toneClasses('wait').ink)}>{ft('factNotMet')}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {card.toAnswer.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <h3 className={cn('text-sm font-bold', toneClasses('step').ink)}>{ft('stillToAnswer')}</h3>
                  <ul className="flex flex-wrap gap-1.5">
                    {card.toAnswer.map(label => (
                      <li key={label} className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', toneClasses('step').chip)}>{label}</li>
                    ))}
                  </ul>
                  <div><Link href={ANSWER_HREF} className={cn(BUTTON, FILLED)}>{t(LANG, 'answerNow')}</Link></div>
                </div>
              ) : null}
              {card.toObtain.length > 0 ? (
                <ul className="flex flex-col gap-1">
                  {card.toObtain.map(text => <li key={text} className={cn('text-sm font-semibold', toneClasses('step').ink)}>{text}</li>)}
                </ul>
              ) : null}
              {card.bankChecks.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-bold text-ink">{t(LANG, 'bankWillCheck')}</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-ink-2">
                    {card.bankChecks.map(check => <li key={check}>{check}</li>)}
                  </ul>
                </div>
              ) : null}
              <div><Link href={ANSWER_HREF} className={LINK}>{ft('wrongChange')}</Link></div>
            </Block>
          ) : null}

          {keep.length > 0 ? (
            <Block title={ft('readyTitle')}>
              <ul className="flex flex-col gap-2">
                {keep.map(requirement => {
                  const description = publicText(requirement.description)
                  return (
                    <li
                      key={requirement.name}
                      className={cn('flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5 rounded-xl p-3', requirement.have ? toneClasses('go').soft : 'bg-paper')}
                    >
                      <span className="min-w-0 flex-[1_1_12rem]">
                        <strong className="block text-base break-words text-ink">{requirement.name}</strong>
                        <span className="block text-xs text-ink-2">{requirement.required ? ft('readyRequired') : ft('readyOptional')}</span>
                        {description ? <span className="mt-1 block text-sm text-ink-2">{description}</span> : null}
                      </span>
                      {requirement.have ? <StatusChip tone="go" text={ft('readyHave')} /> : null}
                    </li>
                  )
                })}
              </ul>
              <p className="text-sm text-ink-2">{ft('neverAsk')}</p>
              <div><Link href={DOCUMENTS_HREF} className={LINK}>{ft('yourDocuments')}</Link></div>
            </Block>
          ) : null}
        </div>
      ) : null}

      {sections.steps.length > 0 ? (
        <Block title={ft('stepsTitle')}>
          <ol className="grid grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-3">
            {sections.steps.map(step => {
              const description = publicText(step.description)
              return (
                <li key={step.number} className="flex min-w-0 flex-col items-start gap-1.5 rounded-xl bg-paper p-4">
                  <span className="flex size-8 items-center justify-center rounded-full bg-ink text-sm font-bold text-card">{step.number}</span>
                  <strong className="text-base break-words text-ink">{step.title}</strong>
                  {description ? <span className="text-sm text-ink-2">{description}</span> : null}
                  {step.expectedDays !== null ? <span className="text-xs text-ink-2">{ft('stepDays', { days: step.expectedDays })}</span> : null}
                  {step.officialUrl && isWebAddress(step.officialUrl) ? <External href={step.officialUrl} className={LINK}>{ft('stepOfficial')}</External> : null}
                </li>
              )
            })}
          </ol>
        </Block>
      ) : null}

      <Block title={ft('connectedTitle')}>
        {connected.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {connected.map(entry => (
              <li key={entry.slug}>
                <Link
                  href={`${SCHEMES_PATH}/${encodeURIComponent(entry.slug)}`}
                  className="flex min-h-11 flex-col gap-1.5 rounded-xl border border-line px-3 py-2.5"
                >
                  <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <strong className="min-w-0 text-base break-words text-ink">{entry.title}</strong>
                    <StatusChip tone={entry.verdict.tone} text={entry.verdict.text} />
                  </span>
                  {entry.note ? <span className="text-xs text-ink-2">{entry.note}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
        <nav aria-label={ft('connectedTitle')} className="flex flex-wrap gap-x-5">
          <Link href={PATH_HREF} className={LINK}>{ft('pathLink')}</Link>
          <Link href={DOCUMENTS_HREF} className={LINK}>{ft('yourDocuments')}</Link>
          {ready ? <Link href={ANSWER_HREF} className={LINK}>{t(LANG, 'changeAnswers')}</Link> : null}
        </nav>
      </Block>

      {sections.eligibility || sections.about || sections.apply ? (
        <div className="grid items-start gap-4 lg:grid-cols-2">
          {sections.eligibility ? (
            <Block title={ft('eligibleTitle')}>
              {sections.eligibility.chips.map(group => (
                <div key={group.label} className="flex flex-col gap-1.5">
                  <h3 className="text-xs font-semibold text-ink-2">{group.label}</h3>
                  <ul className="flex flex-wrap gap-1.5">
                    {group.values.map(value => <li key={value} className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', toneClasses('wait').chip)}>{value}</li>)}
                  </ul>
                </div>
              ))}
              {sections.eligibility.conditions.length > 0 ? (
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink">
                  {sections.eligibility.conditions.map(condition => <li key={condition}>{condition}</li>)}
                </ul>
              ) : null}
              {sections.eligibility.thresholds.length > 0 ? (
                <dl className="grid gap-2 text-sm">
                  {sections.eligibility.thresholds.map(threshold => (
                    <div key={threshold.label} className="rounded-xl bg-paper p-3">
                      <dt className="text-xs font-semibold text-ink-2">{threshold.label}</dt>
                      <dd className="mt-0.5 break-words text-ink">{threshold.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {sections.eligibility.exclusions.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-bold text-ink">{ft('notEligibleIf')}</h3>
                  <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink">
                    {sections.eligibility.exclusions.map(exclusion => <li key={exclusion}>{exclusion}</li>)}
                  </ul>
                </div>
              ) : null}
            </Block>
          ) : null}

          {sections.about ? (
            <Block title={ft('aboutTitle')}>
              {sections.about.objective ? <p className="text-sm text-ink">{sections.about.objective}</p> : null}
              {sections.about.legalBasis ? (
                <p className="text-sm text-ink-2"><strong className="text-ink">{ft('legalBasis')}: </strong>{sections.about.legalBasis}</p>
              ) : null}
            </Block>
          ) : null}

          {sections.apply ? (
            <Block title={ft('howToApplyTitle')}>
              {sections.apply.route ? <p className="text-sm text-ink">{sections.apply.route}</p> : null}
              {sections.apply.selection ? <p className="text-sm text-ink-2"><strong className="text-ink">{ft('selection')}: </strong>{sections.apply.selection}</p> : null}
              {sections.apply.fees ? <p className="text-sm text-ink-2"><strong className="text-ink">{ft('fees')}: </strong>{sections.apply.fees}</p> : null}
            </Block>
          ) : null}
        </div>
      ) : null}

      <Block title={ft('sourceTitle')}>
        {quote ? <blockquote className="rounded-xl bg-paper p-3 text-sm break-words text-ink">{`“${quote.quote}”`}</blockquote> : null}
        {summary.source ? <p className="text-sm text-ink-2">{summary.source}</p> : null}
        {sourceLinks.length > 0 ? (
          <ul className="flex flex-col">
            {sourceLinks.map(source => (
              <li key={`${source.url}-${source.anchor}`} className="flex flex-col">
                <External href={source.url} className={LINK}>{source.title ?? source.url}</External>
                <span className="text-xs text-ink-2">
                  {source.isPrimary ? ft('primarySource') : ft('supportingSource')}
                  {source.pageNumber ? ` · ${ft('sourcePage', { page: source.pageNumber })}` : ''}
                  {source.section ? ` · ${ft('sourceSection', { section: source.section })}` : ''}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="text-sm text-ink-2">{checkedText}. {ft('finalDecision')}</p>
      </Block>
    </div>
  )
}
