import { NextRequest, NextResponse } from 'next/server'
import { MOCK_BUDGETS } from '@/lib/mock-data'

export async function GET() {
  return NextResponse.json({ data: MOCK_BUDGETS })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const budget = {
    id: `bud-${Date.now()}`,
    user_id: 'user-1',
    period: 'monthly',
    rollover: false,
    alert_at_percent: 80,
    month_year: new Date().toISOString().slice(0, 7),
    spent: 0,
    remaining: body.amount,
    percent_used: 0,
    created_at: new Date().toISOString(),
    ...body,
  }
  return NextResponse.json({ data: budget }, { status: 201 })
}
