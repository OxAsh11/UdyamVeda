import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="glass p-10 max-w-sm w-full text-center">
        <div className="text-5xl font-bold text-neutral-300 mb-4">404</div>
        <div className="text-neutral-600 font-medium text-base mb-1">Page not found</div>
        <p className="text-neutral-400 text-sm mb-6">This page doesn&apos;t exist or may have been moved.</p>
        <Link href="/dashboard"
          className="btn-accent inline-flex items-center gap-2 px-5 py-2.5 text-sm">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
