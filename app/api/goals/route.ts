import { NextRequest, NextResponse } from 'next/server'
import { MOCK_GOALS } from '@/lib/mock-data'

export async function GET() {
  return NextResponse.json({ data: MOCK_GOALS })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const goal = {
    id: `goal-${Date.now()}`,
    user_id: 'user-1',
    current_amount: 0,
    is_completed: false,
    created_at: new Date().toISOString(),
    progress_percent: 0,
    ...body,
  }
  return NextResponse.json({ data: goal }, { status: 201 })
}
