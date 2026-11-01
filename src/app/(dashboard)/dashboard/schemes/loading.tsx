import { ft } from '@/lib/founder/text'

// Shown at once when a founder taps through to the schemes, while their results are worked out.
export default function SchemesLoading() {
  return (
    <div role="status" aria-busy="true" className="mx-auto flex max-w-5xl flex-col gap-6 p-5 md:p-8">
      <span className="sr-only">{ft('loadingSchemes')}</span>
      <div aria-hidden="true" className="flex animate-pulse flex-col gap-4">
        <div className="h-8 w-2/3 max-w-xs rounded-xl bg-line" />
        <div className="h-4 w-full max-w-md rounded-xl bg-line" />
        {[0, 1, 2].map(index => (
          <div key={index} className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-4">
            <div className="h-10 rounded-xl bg-line" />
            <div className="h-5 w-3/4 rounded-xl bg-line" />
            <div className="h-4 w-1/2 rounded-xl bg-line" />
            <div className="h-11 w-40 rounded-xl bg-line" />
          </div>
        ))}
      </div>
    </div>
  )
}
