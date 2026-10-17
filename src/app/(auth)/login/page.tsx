'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  // Failed email-link confirmations land here with a readable reason.
  useEffect(() => {
    const message = new URLSearchParams(window.location.search).get('error')
    if (message) toast.error(message)
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    const requestedPath = new URLSearchParams(window.location.search).get('next')
    const safePath = requestedPath && requestedPath.startsWith('/') && !requestedPath.startsWith('//')
      ? requestedPath
      : '/dashboard'
    router.replace(safePath)
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass p-10 w-full max-w-md">
        <div className="mb-8">
          <div className="text-2xl font-bold text-neutral-900 tracking-tight">UdyamVeda</div>
          <p className="text-neutral-500 text-sm mt-1">India&apos;s Business Lifecycle &amp; Growth OS</p>
        </div>

        <h1 className="text-xl font-semibold text-neutral-900 mb-1">Welcome back</h1>
        <p className="text-neutral-500 text-sm mb-8">Sign in to your account</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
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

          <div className="flex flex-col gap-1.5">
            <label className="text-neutral-500 text-xs font-medium uppercase tracking-wide">Password</label>
            <input
              type="password"
              placeholder="Your password"
              required
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
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </form>

        <div className="mt-4 text-right">
          <Link href="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
            Forgot password?
          </Link>
        </div>

        <p className="text-neutral-400 text-sm text-center mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-neutral-700 underline hover:underline">Get started free</Link>
        </p>
      </div>
    </div>
  )
}
