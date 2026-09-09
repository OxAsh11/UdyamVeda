import { NextResponse } from 'next/server'
import { getCatalogReviewer } from '@/lib/catalog/reviewer'
import { getCurrentSourceGapSummary } from '@/lib/catalog/current-source-gaps'

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET() {
  const context = await getCatalogReviewer()
  if (!context.user) return errorResponse('Sign in is required.', 401)
  if (context.error) return errorResponse('Catalog operations are not provisioned yet.', 503)
  if (!context.reviewer) return errorResponse('Catalog reviewer access is required.', 403)

  return NextResponse.json(getCurrentSourceGapSummary(), {
    headers: { 'cache-control': 'no-store' },
  })
}
