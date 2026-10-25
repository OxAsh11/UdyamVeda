'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [accountHint, setAccountHint] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    })

    if (error) {
      const mayAlreadyExist = /already|exist|registered/i.test(error.message)
      setAccountHint(mayAlreadyExist)
      toast.error(error.message)
      setLoading(false)
      return
    }

    // Supabase may return an apparently successful response for an existing
    // email to avoid account enumeration. An empty identities array is the
    // signal that this was not a new account; never send that user through
    // onboarding or back into a misleading "account created" state.
    if (data.user && data.user.identities?.length === 0) {
      setAccountHint(true)
      toast.error('This email already has an account. Sign in or reset your password.')
      setLoading(false)
      return
    }

    if (!data.session) {
      toast.success('Account created. Check your email to confirm it, then sign in.')
      router.replace('/login')
      return
    }

    router.replace('/onboarding')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass p-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <div className="text-2xl font-bold text-neutral-900 tracking-tight">UdyamVeda</div>
          <p className="text-neutral-500 text-sm mt-1">India&apos;s Business Lifecycle &amp; Growth OS</p>
        </div>

        <h1 className="text-xl font-semibold text-neutral-900 mb-1">Create your account</h1>
        <p className="text-neutral-500 text-sm mb-6">Free to start. No credit card needed.</p>

        <Link href="/login" className="mb-6 flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-800 hover:bg-indigo-100">
          <span>Sign up with your mobile number instead</span>
          <span aria-hidden="true">→</span>
        </Link>
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-neutral-400">Or create an account with email</p>

        {accountHint && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            This email may already have an account.{' '}
            <Link href="/login" className="font-semibold underline">Sign in</Link>{' '}
            or <Link href="/forgot-password" className="font-semibold underline">reset your password</Link>.
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-neutral-500 text-xs font-medium uppercase tracking-wide">Full Name</label>
            <input
              type="text"
              placeholder="Rahul Sharma"
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="glass-input w-full px-4 py-2.5 text-sm"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-neutral-500 text-xs font-medium uppercase tracking-wide">Email</label>
            <input
              type="email"
              placeholder="you@company.com"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="glass-input w-full px-4 py-2.5 text-sm"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-neutral-500 text-xs font-medium uppercase tracking-wide">Password</label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              required
              minLength={8}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="glass-input w-full px-4 py-2.5 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-accent w-full py-2.5 text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Get started →'}
          </button>
        </form>

        <p className="text-neutral-400 text-sm text-center mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-neutral-700 underline hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
