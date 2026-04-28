import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('budget_summary')
      .select('*')
      .eq('user_id', user.id)
      .order('month_year', { ascending: false })

    if (error) throw error
    return NextResponse.json({ data })
  } catch (error) {
    console.error('Budgets error:', error)
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
      .from('budgets')
      .insert([
        {
          user_id: user.id,
          period: 'monthly',
          rollover: false,
          alert_at_percent: 80,
          month_year: new Date().toISOString().slice(0, 7),
          ...body,
        },
      ])
      .select()

    if (error) throw error
    return NextResponse.json({ data: data?.[0] }, { status: 201 })
  } catch (error) {
    console.error('Create budget error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
