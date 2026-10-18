import Link from 'next/link'
import { getCatalogReviewer } from '@/lib/catalog/reviewer'
import { opportunityGroup, OPPORTUNITY_GROUPS } from '@/lib/opportunities/taxonomy'
import SchemePicker, { type PickerRow } from '@/components/admin/SchemePicker'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Edit schemes' }

export default async function EditSchemesPage() {
  const { supabase, reviewer } = await getCatalogReviewer()
  if (!reviewer) {
    return <main className="mx-auto max-w-3xl p-8"><h1 className="text-2xl font-black">Catalog reviewer access is required</h1><p className="mt-2 text-sm text-slate-600">Sign in with a catalog reviewer account to edit schemes.</p></main>
  }

  const { data } = await supabase
    .from('opportunities')
    .select('slug, name, status, opportunity_type, updated_at, authority:authorities!opportunities_authority_id_fkey(name), current_version:opportunity_versions!opportunities_current_version_fk(version_number, last_verified_at)')
    .order('name')

  const rows: PickerRow[] = (data ?? []).map(row => {
    const authority = Array.isArray(row.authority) ? row.authority[0] : row.authority
    const version = Array.isArray(row.current_version) ? row.current_version[0] : row.current_version
    return {
      slug: row.slug,
      name: row.name,
      status: row.status,
      group: OPPORTUNITY_GROUPS[opportunityGroup(row.opportunity_type)],
      authority: authority?.name ?? '',
      versionNumber: version?.version_number ?? 1,
      lastCheckedAt: version?.last_verified_at ?? null,
    }
  })

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/admin/catalog" className="text-sm font-bold text-indigo-700 underline underline-offset-2">← Catalog admin</Link>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Edit schemes</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Pick a scheme, change what is wrong, add a one-line reason, and publish. Each save creates a new version with a full history; the previous version stays on record.</p>
        <SchemePicker rows={rows} />
      </div>
    </main>
  )
}
