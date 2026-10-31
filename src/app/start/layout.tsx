import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Check what you qualify for',
  description: 'Answer a few simple questions to see the government schemes and registrations that fit your business. No account needed.',
}

export default function StartLayout({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-[#f8f7f3]">{children}</main>
}
