import { ft } from '@/lib/founder/text'

// Shown at once when a founder opens a scheme, while the scheme and their answers are read.
export default function SchemeLoading() {
  return (
    <div role="status" aria-busy="true" className="mx-auto flex max-w-5xl flex-col gap-5 p-5 md:p-8">
      <span className="sr-only">{ft('loadingScheme')}</span>
      <div aria-hidden="true" className="flex animate-pulse flex-col gap-5">
        <div className="h-5 w-40 rounded-xl bg-line" />
        <div className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-4">
          <div className="h-12 rounded-xl bg-line" />
          <div className="h-8 w-3/4 rounded-xl bg-line" />
          <div className="h-4 w-full rounded-xl bg-line" />
          <div className="h-4 w-2/3 rounded-xl bg-line" />
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(13rem,1fr))] gap-3">
          <div className="h-24 rounded-2xl bg-line" />
          <div className="h-24 rounded-2xl bg-line" />
        </div>
      </div>
    </div>
  )
}
