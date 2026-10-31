/** Where to go after signing in. Only a path inside this app, never another website. */
export function safeNextPath(value: string | null | undefined, fallback: string) {
  return value && value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\') ? value : fallback
}
