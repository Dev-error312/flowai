import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  const checks = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      api: 'ok',
      anthropic: !!process.env.ANTHROPIC_API_KEY ? 'configured' : 'demo-mode',
      supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'demo-mode',
      plaid: !!process.env.PLAID_CLIENT_ID ? 'configured' : 'demo-mode',
    },
  }

  return NextResponse.json(checks)
}
