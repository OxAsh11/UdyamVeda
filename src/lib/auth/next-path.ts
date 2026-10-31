const PARSE_BASE = 'https://app.invalid'

/**
 * Where to go after signing in. Only a path inside this app, never another
 * website. Browsers strip tabs and newlines and read backslashes as slashes, so
 * a path is judged by how it actually parses, not by how it looks. Without a
 * request it is the dashboard: the questions are offered there, never forced.
 */
export function safeNextPath(value: string | null | undefined, fallback = '/dashboard') {
  if (!value || !value.startsWith('/')) return fallback
  try {
    const url = new URL(value, PARSE_BASE)
    return url.origin === PARSE_BASE ? `${url.pathname}${url.search}${url.hash}` : fallback
  } catch {
    return fallback
  }
}

/** A sign-in or sign-up link that returns to the page the founder came from. */
export function authLink(path: string, next: string | null | undefined) {
  const safe = safeNextPath(next, '')
  return safe ? `${path}?next=${encodeURIComponent(safe)}` : path
}
