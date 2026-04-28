import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') ?? '50')
    const page = parseInt(searchParams.get('page') ?? '1')

    let query = supabase
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)

    if (type && type !== 'all') {
      query = query.eq('type', type)
    }
    if (category) {
      query = query.eq('category_id', category)
    }

    const { data: transactions, count, error } = await query
      .order('date', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) throw error

    // Client-side search if needed
    let filtered = transactions || []
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(t =>
        t.merchant?.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({
      data: filtered,
      meta: { total: count || 0, page, limit, pages: Math.ceil((count || 0) / limit) },
    })
  } catch (error) {
    console.error('Transactions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: user.id,
          ...body,
        },
      ])
      .select()

    if (error) throw error
    return NextResponse.json({ data: data?.[0] }, { status: 201 })
  } catch (error) {
    console.error('Create transaction error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
