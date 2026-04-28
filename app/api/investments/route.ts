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
      .from('investments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    const investments = (data || []).map(inv => ({
      ...inv,
      current_value: parseFloat(inv.quantity || 0) * parseFloat(inv.current_price || 0),
      gain_loss: (parseFloat(inv.current_price || 0) - parseFloat(inv.avg_cost || 0)) * parseFloat(inv.quantity || 0),
      gain_loss_percent: parseFloat(inv.avg_cost || 0) > 0
        ? ((parseFloat(inv.current_price || 0) - parseFloat(inv.avg_cost || 0)) / parseFloat(inv.avg_cost || 0)) * 100
        : 0,
    }))

    return NextResponse.json({ data: investments })
  } catch (error) {
    console.error('Investments error:', error)
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
      .from('investments')
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
    console.error('Create investment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
