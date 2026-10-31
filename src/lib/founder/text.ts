// Words only the dashboard shows. Words shown on /start and its results live in
// src/lib/start/i18n.ts, in all three languages. These are English for now and are
// translated in M5, so a page never writes a word of its own: it asks ft().
export const FOUNDER_TEXT_EN = {
  title: 'Schemes for you',
  finalDecision: 'The final decision is made by the bank or department.',
  sortedUsing: 'Sorted using your answers: {answers}.',
  answersProject: '{cost} project',
  changeDetails: 'Change my details',
  viewsLabel: 'Schemes views',
  tabForYou: 'For you',
  tabForYouCount: 'For you ({count})',
  tabBrowse: 'Browse all',
  tabBrowseCount: 'Browse all ({count})',
  tellTitle: 'Tell us about you',
  tellBody: 'Answer a few simple questions and we show the schemes that fit you, with the amount you could get. You can do this whenever you like.',
  tellCta: 'Answer a few questions',
  nothingForYou: 'Nothing fits your answers yet. Browse all to see every scheme.',
  savedTitle: 'Saved for later',
  browseTitle: 'All schemes',
  searchLabel: 'Search schemes',
  searchPlaceholder: 'Search schemes, grants, loans',
  searchButton: 'Search',
  clearSearch: 'Clear search',
  showing: 'Showing',
  showAllTypes: 'Show all types',
  groupsLabel: 'Kind of scheme',
  groupsCurrent: 'Kind of scheme: {current}',
  groupAll: 'All ({count})',
  groupCount: '{label} ({count})',
  noMatch: 'No scheme matches “{query}”. Try a shorter word, or clear the search.',
  noSchemes: 'No schemes are listed here yet.',
  browseUnavailableTitle: 'Schemes are temporarily unavailable',
  browseUnavailableBody: 'This is a connection problem, not an answer about you. Please try again in a moment.',
} as const

export type FounderTextKey = keyof typeof FOUNDER_TEXT_EN

/** One dashboard word or sentence, with {name} places filled in. */
export function ft(key: FounderTextKey, values: Record<string, string | number> = {}): string {
  return FOUNDER_TEXT_EN[key].replace(/\{(\w+)\}/g, (match, name: string) => (Object.hasOwn(values, name) ? String(values[name]) : match))
}
