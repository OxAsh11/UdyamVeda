import { redirect } from 'next/navigation'

// The question flow replaced the old one-page form. Anyone with an old link or
// a fresh signup lands there; the dashboard itself never requires it.
export default function OnboardingPage() {
  redirect('/start')
}
