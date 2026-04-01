'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name } },
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    router.push('/onboarding')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass p-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <div className="text-2xl font-bold text-white tracking-tight">Center</div>
          <p className="text-white/50 text-sm mt-1">From idea to first customer</p>
        </div>

        <h1 className="text-xl font-semibold text-white mb-1">Create your account</h1>
        <p className="text-white/50 text-sm mb-8">Free to start. No credit card needed.</p>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white/60 text-xs font-medium uppercase tracking-wide">Full Name</label>
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
            <label className="text-white/60 text-xs font-medium uppercase tracking-wide">Email</label>
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
            <label className="text-white/60 text-xs font-medium uppercase tracking-wide">Password</label>
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

        <p className="text-white/40 text-sm text-center mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-white/80 underline hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
