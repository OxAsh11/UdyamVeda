'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createRecoveryClient } from '@/lib/supabase/recovery'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)

    const supabase = createRecoveryClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass p-10 w-full max-w-md">
        <div className="mb-8">
          <div className="text-2xl font-bold text-neutral-900 tracking-tight">UdyamVeda</div>
          <p className="text-neutral-500 text-sm mt-1">India&apos;s Business Lifecycle &amp; Growth OS</p>
        </div>

        <h1 className="text-xl font-semibold text-neutral-900 mb-1">Reset your password</h1>
        <p className="text-neutral-500 text-sm mb-8">Enter your account email and we&apos;ll send you a secure reset link.</p>

        {sent ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-900">
            If an account exists for <strong>{email}</strong>, a reset link is on its way. Check your inbox and spam folder.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reset-email" className="text-neutral-500 text-xs font-medium uppercase tracking-wide">Email</label>
              <input
                id="reset-email"
                type="email"
                placeholder="you@company.com"
                required
                value={email}
                onChange={event => setEmail(event.target.value)}
                className="glass-input w-full px-4 py-2.5 text-sm"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-accent w-full py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Sending link...' : 'Send reset link'}
            </button>
          </form>
        )}

        <p className="text-neutral-400 text-sm text-center mt-6">
          Remembered it? <Link href="/login" className="text-indigo-600 underline">Back to sign in</Link>
        </p>
      </div>
    </div>
  )
}
