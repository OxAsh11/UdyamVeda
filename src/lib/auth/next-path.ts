/**
 * Where to go after signing in. Only a path inside this app, never another
 * website. Without a request it is the dashboard: the questions are offered
 * there, never forced on anyone.
 */
export function safeNextPath(value: string | null | undefined, fallback = '/dashboard') {
  return value && value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\') ? value : fallback
}
