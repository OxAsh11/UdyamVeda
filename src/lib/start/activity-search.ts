import type { FlowActivity } from './types'

const DEFAULT_LIMIT = 8
const MIN_SIMILARITY = 0.3

// Keeps Devanagari vowel signs (\p{M}), so "लोणचे" stays one word.
function normalise(value: string) {
  return value.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim()
}

function trigrams(value: string) {
  const padded = Array.from(` ${value} `)
  const grams = new Set<string>()
  for (let index = 0; index + 2 < padded.length; index += 1) grams.add(padded.slice(index, index + 3).join(''))
  return grams
}

function similarity(left: string, right: string) {
  const a = trigrams(left)
  const b = trigrams(right)
  let shared = 0
  for (const gram of a) if (b.has(gram)) shared += 1
  return shared / (a.size + b.size - shared)
}

function termScore(query: string, term: string) {
  if (term === query) return 1
  if (term.startsWith(query)) return 0.9
  if (term.split(' ').some(word => word.startsWith(query))) return 0.8
  if (term.includes(query)) return 0.7
  // Compare with the closest single word too, so a typo in one word of a long
  // label ("pikle" against "pickles and chutney") still matches.
  const best = Math.max(similarity(query, term), ...term.split(' ').map(word => similarity(query, word)))
  return best >= MIN_SIMILARITY ? best * 0.6 : 0
}

function startingPoints(activities: FlowActivity[], limit: number) {
  const byPack = new Map<string, FlowActivity[]>()
  for (const activity of activities) {
    const pack = activity.packIds[0] ?? ''
    byPack.set(pack, [...(byPack.get(pack) ?? []), activity])
  }
  const picked: FlowActivity[] = []
  for (let round = 0; picked.length < limit && round < activities.length; round += 1) {
    for (const group of byPack.values()) {
      if (group[round] && picked.length < limit) picked.push(group[round])
    }
  }
  return picked
}

/** Finds activities from what a founder types, in English, Hindi, Marathi or transliterated. */
export function searchActivities(query: string, activities: FlowActivity[], limit = DEFAULT_LIMIT): FlowActivity[] {
  const needle = normalise(query)
  if (!needle) return startingPoints(activities, limit)

  return activities
    .map((activity, index) => {
      const terms = [activity.label.en, activity.label.hi, activity.label.mr, ...activity.synonyms].map(normalise)
      return { activity, index, score: Math.max(...terms.map(term => termScore(needle, term))) }
    })
    .filter(match => match.score > 0)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, limit)
    .map(match => match.activity)
}
