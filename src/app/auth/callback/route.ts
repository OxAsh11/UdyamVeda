import type { EmailOtpType } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Landing point for links in Supabase auth emails (signup confirmation,
// magic link, email change). Supabase sends either a PKCE `code` or a
// `token_hash` + `type`; both are exchanged here for a session cookie on
// the app host before the user continues to `next`.
function safeNextPath(value: string | null) {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/dashboard'
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const next = safeNextPath(searchParams.get('next'))
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  const supabase = await createClient()
  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash && type
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
      : { error: new Error('Missing confirmation code') }

  if (error) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('error', 'This confirmation link is invalid or has expired. Sign in or request a new link.')
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.redirect(new URL(next, request.url))
}
