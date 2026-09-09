'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createRecoveryClient } from '@/lib/supabase/recovery'
import { toast } from 'sonner'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const [recoveryError, setRecoveryError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const supabase = createRecoveryClient()
    let mounted = true

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted && (event === 'PASSWORD_RECOVERY' || session)) {
        setHasSession(Boolean(session))
        setRecoveryError(null)
        setChecking(false)
      }
    })

    async function resolveRecoverySession() {
      const callbackUrl = new URL(window.location.href)
      const hashParams = new URLSearchParams(callbackUrl.hash.replace(/^#/, ''))
      const callbackError = callbackUrl.searchParams.get('error_description')
        ?? callbackUrl.searchParams.get('error')
        ?? hashParams.get('error_description')
        ?? hashParams.get('error')

      if (callbackError) {
        if (mounted) {
          setRecoveryError(decodeURIComponent(callbackError.replace(/\+/g, ' ')))
          setChecking(false)
        }
        return
      }

      // The recovery client starts Supabase initialization immediately. Awaiting
      // it here ensures the URL callback has been processed before we decide
      // whether the password form can be shown.
      const { error: initializationError } = await supabase.auth.initialize()
      if (!mounted) return

      if (initializationError) {
        setRecoveryError(initializationError.message)
        setChecking(false)
        return
      }

      const { data, error: sessionError } = await supabase.auth.getSession()
      if (!mounted) return

      if (sessionError) {
        setRecoveryError(sessionError.message)
      }
      setHasSession(Boolean(data.session))
      setChecking(false)
    }

    resolveRecoverySession().catch(error => {
      if (mounted) {
        setRecoveryError(error instanceof Error ? error.message : 'We could not verify this reset link.')
        setChecking(false)
      }
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (password !== confirmation) {
      toast.error('Passwords do not match.')
      return
    }

    setLoading(true)
    const supabase = createRecoveryClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success('Password updated. You can now sign in.')
    await supabase.auth.signOut({ scope: 'local' })
    router.replace('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass p-10 w-full max-w-md">
        <div className="mb-8">
          <div className="text-2xl font-bold text-neutral-900 tracking-tight">UdyamVeda</div>
          <p className="text-neutral-500 text-sm mt-1">India&apos;s Business Lifecycle &amp; Growth OS</p>
        </div>

        <h1 className="text-xl font-semibold text-neutral-900 mb-1">Choose a new password</h1>
        <p className="text-neutral-500 text-sm mb-8">Use at least 8 characters. This link can only be used once.</p>

        {checking ? (
          <p className="text-sm text-neutral-500">Checking your reset link...</p>
        ) : !hasSession ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-900">
            <p>
              {recoveryError ?? 'This reset link could not be verified. It may be missing, expired, or already used.'}
            </p>
            <p className="mt-2">
              Request a new link from <Link href="/forgot-password" className="font-semibold underline">account recovery</Link> and open the newest email link. Older links expire and can only be used once.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="new-password" className="text-neutral-500 text-xs font-medium uppercase tracking-wide">New password</label>
              <input id="new-password" type="password" required minLength={8} value={password} onChange={event => setPassword(event.target.value)} className="glass-input w-full px-4 py-2.5 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirm-password" className="text-neutral-500 text-xs font-medium uppercase tracking-wide">Confirm password</label>
              <input id="confirm-password" type="password" required minLength={8} value={confirmation} onChange={event => setConfirmation(event.target.value)} className="glass-input w-full px-4 py-2.5 text-sm" />
            </div>
            <button type="submit" disabled={loading} className="btn-accent w-full py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Updating password...' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
