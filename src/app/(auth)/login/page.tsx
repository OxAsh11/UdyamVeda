'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

type Method = 'phone' | 'email'

// Phone OTP needs an SMS provider connected in Supabase; until then the
// Mobile tab explains that and points to email.
const PHONE_LOGIN_ENABLED = process.env.NEXT_PUBLIC_PHONE_LOGIN_ENABLED === 'true'
const RESEND_SECONDS = 30

function safeNextPath() {
  const requested = new URLSearchParams(window.location.search).get('next')
  return requested && requested.startsWith('/') && !requested.startsWith('//') ? requested : '/dashboard'
}

// Accepts "98765 43210", "+91 98765 43210" or "098765..."; returns +91XXXXXXXXXX.
function indianMobile(input: string) {
  const digits = input.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '')
  return /^[6-9]\d{9}$/.test(digits) ? `+91${digits}` : null
}

// The search params decide the opening tab, so that part renders on the
// client inside a Suspense boundary while the page shell stays prerendered.
export default function LoginPageShell() {
  return <Suspense fallback={<div className="min-h-screen" />}><LoginPage /></Suspense>
}

function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [method, setMethod] = useState<Method>(() => (searchParams.get('method') === 'email' ? 'email' : 'phone'))

  // Failed email-link confirmations land here with a readable reason.
  useEffect(() => {
    const message = searchParams.get('error')
    if (message) toast.error(message)
  }, [searchParams])

  function signedIn() {
    router.replace(safeNextPath())
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass p-8 sm:p-10 w-full max-w-md">
        <div className="mb-8">
          <div className="text-2xl font-bold text-neutral-900 tracking-tight">UdyamVeda</div>
          <p className="text-neutral-500 text-sm mt-1">India&apos;s Business Lifecycle &amp; Growth OS</p>
        </div>

        <h1 className="text-xl font-semibold text-neutral-900 mb-1">Welcome</h1>
        <p className="text-neutral-500 text-sm mb-6">Sign in or create your account</p>

        <div role="tablist" aria-label="Sign-in method" className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-neutral-100 p-1">
          {([['phone', 'Mobile number'], ['email', 'Email']] as const).map(([value, label]) => (
            <button
              key={value}
              id={`tab-${value}`}
              role="tab"
              type="button"
              aria-selected={method === value}
              aria-controls={`panel-${value}`}
              onClick={() => setMethod(value)}
              className={`rounded-lg py-2 text-sm font-semibold transition ${method === value ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div id={`panel-${method}`} role="tabpanel" aria-labelledby={`tab-${method}`}>
          {method === 'phone'
            ? <PhoneLogin onSignedIn={signedIn} onUseEmail={() => setMethod('email')} />
            : <EmailLogin onSignedIn={signedIn} />}
        </div>
      </div>
    </div>
  )
}

function PhoneLogin({ onSignedIn, onUseEmail }: { onSignedIn: () => void; onUseEmail: () => void }) {
  const [mobile, setMobile] = useState('')
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setTimeout(() => setSecondsLeft(seconds => seconds - 1), 1000)
    return () => clearTimeout(timer)
  }, [secondsLeft])

  if (!PHONE_LOGIN_ENABLED) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">Mobile OTP sign-in is being set up</p>
        <p className="mt-1 leading-6">You will soon be able to sign in with a one-time code sent to your phone. For now, please use your email.</p>
        <button type="button" onClick={onUseEmail} className="btn-accent mt-4 w-full py-2.5 text-sm">Continue with email</button>
      </div>
    )
  }

  async function sendCode(event?: React.FormEvent) {
    event?.preventDefault()
    const phone = indianMobile(mobile)
    if (!phone) {
      toast.error('Enter a 10-digit Indian mobile number.')
      return
    }
    setLoading(true)
    const { error } = await createClient().auth.signInWithOtp({ phone, options: { shouldCreateUser: true, channel: 'sms' } })
    setLoading(false)
    if (error) {
      toast.error(error.message)
      return
    }
    setSentTo(phone)
    setCode('')
    setSecondsLeft(RESEND_SECONDS)
    toast.success(`Code sent to ${phone.replace('+91', '+91 ')}`)
  }

  async function verifyCode(event: React.FormEvent) {
    event.preventDefault()
    if (!sentTo || !/^\d{6}$/.test(code)) {
      toast.error('Enter the 6-digit code from the SMS.')
      return
    }
    setLoading(true)
    const { error } = await createClient().auth.verifyOtp({ phone: sentTo, token: code, type: 'sms' })
    setLoading(false)
    if (error) {
      toast.error(error.message.includes('expired') ? 'That code has expired. Send a new one.' : 'That code is not correct. Check the SMS and try again.')
      return
    }
    onSignedIn()
  }

  if (sentTo) {
    return (
      <form onSubmit={verifyCode} className="flex flex-col gap-4">
        <p className="text-sm text-neutral-600">Enter the 6-digit code sent to <span className="font-semibold text-neutral-900">{sentTo.replace('+91', '+91 ')}</span>.</p>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="otp" className="text-neutral-500 text-xs font-medium uppercase tracking-wide">One-time code</label>
          <input
            id="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            required
            value={code}
            onChange={event => setCode(event.target.value.replace(/\D/g, ''))}
            className="glass-input w-full px-4 py-2.5 text-center text-lg tracking-[0.4em]"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-accent w-full py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Checking...' : 'Verify and continue →'}
        </button>
        <div className="flex items-center justify-between text-sm">
          <button type="button" onClick={() => setSentTo(null)} className="font-medium text-neutral-500 hover:text-neutral-700">Change number</button>
          <button type="button" disabled={secondsLeft > 0 || loading} onClick={() => void sendCode()} className="font-medium text-indigo-600 hover:text-indigo-700 disabled:text-neutral-400">
            {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : 'Resend code'}
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={sendCode} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="mobile" className="text-neutral-500 text-xs font-medium uppercase tracking-wide">Mobile number</label>
        <div className="flex gap-2">
          <span className="glass-input flex items-center px-3 text-sm text-neutral-500">+91</span>
          <input
            id="mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="98765 43210"
            required
            value={mobile}
            onChange={event => setMobile(event.target.value)}
            className="glass-input w-full px-4 py-2.5 text-sm"
          />
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-accent w-full py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? 'Sending...' : 'Send OTP →'}
      </button>
      <p className="text-neutral-400 text-xs text-center">New number? Your account is created when you verify the code.</p>
    </form>
  )
}

function EmailLogin({ onSignedIn }: { onSignedIn: () => void }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    const { error } = await createClient().auth.signInWithPassword({ email: form.email, password: form.password })
    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }
    onSignedIn()
  }

  return (
    <>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-neutral-500 text-xs font-medium uppercase tracking-wide">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@company.com"
            required
            value={form.email}
            onChange={event => setForm(previous => ({ ...previous, email: event.target.value }))}
            className="glass-input w-full px-4 py-2.5 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-neutral-500 text-xs font-medium uppercase tracking-wide">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Your password"
            required
            value={form.password}
            onChange={event => setForm(previous => ({ ...previous, password: event.target.value }))}
            className="glass-input w-full px-4 py-2.5 text-sm"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-accent w-full py-2.5 text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
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
    </>
  )
}
