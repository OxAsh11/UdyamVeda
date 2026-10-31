'use client'

import dynamic from 'next/dynamic'

// These screens read the founder's draft from the browser, so they render there.
const loading = () => <p className="py-16 text-center text-sm text-slate-500">…</p>
const StartFlow = dynamic(() => import('./StartFlow'), { ssr: false, loading })
const ResultsView = dynamic(() => import('./ResultsView'), { ssr: false, loading })

export function StartFlowClient() {
  return <StartFlow />
}

export function ResultsClient() {
  return <ResultsView />
}
