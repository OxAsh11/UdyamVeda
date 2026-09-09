import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams: Promise<{ path?: string; slug?: string }>
}

async function readSnapshot(requestedPath: string | undefined) {
  if (!requestedPath) return null
  const [{ default: fs }, path] = await Promise.all([import('node:fs'), import('node:path')])
  if (path.extname(requestedPath).toLowerCase() !== '.md') return null
  const root = path.resolve(process.cwd(), '.catalog-snapshots')
  const target = path.resolve(process.cwd(), requestedPath)
  const relative = path.relative(root, target)
  if (!relative || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) return null
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) return null
  const stat = fs.statSync(target)
  const maxBytes = 2 * 1024 * 1024
  const body = fs.readFileSync(target, 'utf8')
  return {
    relative,
    body: stat.size > maxBytes ? `${body.slice(0, maxBytes)}\n\n[Snapshot truncated at 2 MiB for the local review surface.]` : body,
  }
}

export default async function OfflineCatalogSnapshotPage({ searchParams }: PageProps) {
  if (process.env.NODE_ENV === 'production') notFound()

  const params = await searchParams
  const file = await readSnapshot(params.path)
  if (!file) notFound()

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-6 py-10 text-[#111827] md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#3f46e8]">Local editorial tooling</p>
            <h1 className="text-2xl font-black tracking-tight">Captured official-source snapshot</h1>
            <p className="mt-2 break-all text-xs text-slate-500">{params.slug ?? 'record'} · {file.relative}</p>
          </div>
          <a href="/admin/catalog/offline-review" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Back to review pack</a>
        </div>
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong>Evidence boundary:</strong> This is a captured source for editorial comparison, not a publication approval or current eligibility decision. Confirm the official source and record a precise anchor before passing a review check.
        </div>
        <pre className="max-h-[75vh] overflow-auto whitespace-pre-wrap rounded-2xl border border-slate-200 bg-white p-6 text-xs leading-6 text-slate-700 shadow-sm">{file.body}</pre>
      </div>
    </main>
  )
}
