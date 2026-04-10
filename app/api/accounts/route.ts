import { NextRequest, NextResponse } from 'next/server'
import { MOCK_ACCOUNTS } from '@/lib/mock-data'

export async function GET() {
  // In production: fetch from Supabase with user auth
  return NextResponse.json({ data: MOCK_ACCOUNTS })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const newAccount = {
    id: `acc-${Date.now()}`,
    user_id: 'user-1',
    is_active: true,
    created_at: new Date().toISOString(),
    currency: 'USD',
    ...body,
  }
  return NextResponse.json({ data: newAccount }, { status: 201 })
}
