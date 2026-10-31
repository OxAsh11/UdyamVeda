import { redirect } from 'next/navigation'

// The old one-page form is gone. Onboarding is not required, so an old link goes
// to the dashboard, which offers the questions without forcing them.
export default function OnboardingPage() {
  redirect('/dashboard')
}
