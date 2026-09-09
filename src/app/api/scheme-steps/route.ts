import { NextResponse } from 'next/server'

const retiredResponse = {
  error: 'The legacy scheme-progress endpoint has been retired. Use the versioned application workspace and application task endpoints instead.',
}

export async function GET() {
  return NextResponse.json(retiredResponse, { status: 410 })
}

export async function POST() {
  return NextResponse.json(retiredResponse, { status: 410 })
}
