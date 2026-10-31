import type { InrRange } from '@/lib/opportunities/engine/calculator'
import type { Lang } from './types'

const OR_MORE: Record<Lang, string> = { en: 'or more', hi: 'या अधिक', mr: 'किंवा अधिक' }
const LOCALE: Record<Lang, string> = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' }

export function formatInr(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function formatRange(range: InrRange, lang: Lang) {
  if (range.max === null) return `${formatInr(range.min)} ${OR_MORE[lang]}`
  return range.min === range.max ? formatInr(range.min) : `${formatInr(range.min)} – ${formatInr(range.max)}`
}

export function formatDate(value: string | null | undefined, lang: Lang) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(LOCALE[lang], { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })
}
