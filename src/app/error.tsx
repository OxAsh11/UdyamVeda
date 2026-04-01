'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="glass p-10 max-w-sm w-full text-center">
        <div className="text-neutral-600 font-medium text-base mb-1">Something went wrong</div>
        <p className="text-neutral-400 text-sm mb-6">An unexpected error occurred. Try refreshing the page.</p>
        <button onClick={reset}
          className="btn-accent inline-flex items-center gap-2 px-5 py-2.5 text-sm">
          Try again
        </button>
      </div>
    </div>
  )
}
