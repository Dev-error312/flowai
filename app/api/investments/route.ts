import { NextRequest, NextResponse } from 'next/server'
import { MOCK_INVESTMENTS } from '@/lib/mock-data'

export async function GET() {
  const investments = MOCK_INVESTMENTS.map(inv => ({
    ...inv,
    current_value: inv.quantity * inv.current_price,
    gain_loss: (inv.current_price - inv.avg_cost) * inv.quantity,
    gain_loss_percent: ((inv.current_price - inv.avg_cost) / inv.avg_cost) * 100,
  }))
  return NextResponse.json({ data: investments })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const investment = {
    id: `inv-${Date.now()}`,
    user_id: 'user-1',
    last_updated: new Date().toISOString(),
    created_at: new Date().toISOString(),
    ...body,
  }
  return NextResponse.json({ data: investment }, { status: 201 })
}
