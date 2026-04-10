import { NextRequest, NextResponse } from 'next/server'
import { MOCK_TRANSACTIONS } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const category = searchParams.get('category')
  const search = searchParams.get('search')?.toLowerCase()
  const limit = parseInt(searchParams.get('limit') ?? '50')
  const page = parseInt(searchParams.get('page') ?? '1')

  let transactions = [...MOCK_TRANSACTIONS]

  if (type && type !== 'all') {
    transactions = transactions.filter(t => t.type === type)
  }
  if (category) {
    transactions = transactions.filter(t => t.category_id === category)
  }
  if (search) {
    transactions = transactions.filter(t =>
      t.merchant?.toLowerCase().includes(search) ||
      t.description.toLowerCase().includes(search) ||
      t.category?.name.toLowerCase().includes(search)
    )
  }

  // Sort by date desc
  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const total = transactions.length
  const paginated = transactions.slice((page - 1) * limit, page * limit)

  return NextResponse.json({
    data: paginated,
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  // In production: validate with Zod, insert to Supabase, trigger AI categorization
  const newTx = {
    id: `tx-${Date.now()}`,
    user_id: 'user-1',
    created_at: new Date().toISOString(),
    ...body,
  }
  return NextResponse.json({ data: newTx }, { status: 201 })
}
