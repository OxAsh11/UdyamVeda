// Marketing tools are outside the MVP (PRD §2). They stay in the repo, switched
// off, and come back by setting NEXT_PUBLIC_SHOW_GTM_TOOLS=true.
export const GTM_TOOLS_ENABLED = process.env.NEXT_PUBLIC_SHOW_GTM_TOOLS === 'true'

const GTM_TOOL_PATHS = ['strategy', 'plays', 'calendar', 'track', 'campaigns', 'distribute', 'drawing-board', 'ideate'].map(tool => `/dashboard/${tool}`)

export function isGtmToolPath(pathname: string) {
  return GTM_TOOL_PATHS.some(path => pathname === path || pathname.startsWith(`${path}/`))
}
