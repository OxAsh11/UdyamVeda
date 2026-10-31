import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { AUTH_REQUIRED } from '@/lib/auth/mode'
import { safeNextPath } from '@/lib/auth/next-path'
import { GTM_TOOLS_ENABLED, isGtmToolPath } from '@/lib/features/gtm'

// Host separation: udyamveda.in (and www) is the public website.
// app.udyamveda.in is the product: login, dashboard, admin, workspace.
// Sessions are host-scoped, so authentication happens on the app host and
// the website host forwards every auth/product route there.
const SITE_HOST = process.env.NEXT_PUBLIC_SITE_HOST || 'udyamveda.in'
const APP_HOST = process.env.NEXT_PUBLIC_APP_HOST || `app.${SITE_HOST}`

// Onboarding runs right after signup and needs the app-host session; /auth
// holds the email-link callback, which must set its cookie on the app host.
// The /start flow needs no login, but its draft and session live on the app host.
const PRODUCT_PATH_PREFIXES = ['/dashboard', '/admin', '/onboarding', '/auth', '/start']
const AUTH_PATHS = ['/login', '/signup', '/forgot-password', '/reset-password']

function isProductPath(pathname: string) {
  return PRODUCT_PATH_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

function hostOf(request: NextRequest) {
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? ''
  return host.split(':')[0].toLowerCase()
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const { pathname } = request.nextUrl
  const host = hostOf(request)
  const onSiteHost = host === SITE_HOST || host === `www.${SITE_HOST}`
  const onAppHost = host === APP_HOST
  // Once apex DNS points at Vercel, enforce the strict split: the app host
  // serves only the product; public pages live on the website host.
  const enforceSplit = process.env.NEXT_PUBLIC_ENFORCE_HOST_SPLIT === 'true'

  // The website host serves only public marketing content; every auth and
  // product route hands off to the app host, preserving the query string.
  if (onSiteHost && (isProductPath(pathname) || AUTH_PATHS.includes(pathname))) {
    const url = new URL(`https://${APP_HOST}${pathname}`)
    url.search = request.nextUrl.search
    return NextResponse.redirect(url)
  }

  // The app host's root opens the product; signed-out users then land on login.
  if (onAppHost && enforceSplit && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // The app host serves only the product (login, dashboard, admin) and APIs;
  // every public page redirects to the website host.
  if (onAppHost && enforceSplit && !isProductPath(pathname) && !AUTH_PATHS.includes(pathname) && !pathname.startsWith('/api')) {
    const url = new URL(`https://${SITE_HOST}${pathname}`)
    url.search = request.nextUrl.search
    return NextResponse.redirect(url)
  }

  if (!GTM_TOOLS_ENABLED && isGtmToolPath(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const isAdminPage = pathname === '/admin' || pathname.startsWith('/admin/')

  if (!AUTH_REQUIRED && !isAdminPage) {
    return supabaseResponse
  }

  // Only product and auth pages depend on the session here. Public pages and
  // API routes skip the Supabase round-trip (route handlers check auth
  // themselves), so the website stays fast even when Supabase is slow.
  if (!isProductPath(pathname) && !AUTH_PATHS.includes(pathname)) {
    return supabaseResponse
  }

  const { data: { user } } = await supabase.auth.getUser()

  if ((isAdminPage || pathname.startsWith('/dashboard')) && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (AUTH_PATHS.includes(pathname) && user) {
    return NextResponse.redirect(new URL(safeNextPath(request.nextUrl.searchParams.get('next')), request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
