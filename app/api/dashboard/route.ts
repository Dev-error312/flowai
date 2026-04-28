import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch active accounts
    const { data: accounts } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)

    // Fetch recent transactions
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(10)

    // Calculate stats
    const currentMonth = new Date().toISOString().slice(0, 7)
    const monthlyTransactions = transactions?.filter(t => t.date?.startsWith(currentMonth)) || []
    const expenses = monthlyTransactions.filter(t => t.type === 'expense')
    const income = monthlyTransactions.filter(t => t.type === 'income')
    const totalExpenses = expenses.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
    const totalIncome = income.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)

    const totalAccountBalance = accounts?.reduce((sum, a) => sum + parseFloat(a.balance || 0), 0) || 0
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

    // Fetch insights
    const { data: insights } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_read', false)
      .order('generated_at', { ascending: false })
      .limit(5)

    return NextResponse.json({
      data: {
        net_worth: totalAccountBalance,
        monthly_income: totalIncome,
        monthly_expenses: totalExpenses,
        savings_rate: savingsRate,
        accounts,
        recent_transactions: transactions,
        active_insights: insights || [],
      },
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
