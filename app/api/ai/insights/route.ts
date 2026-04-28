import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { formatCurrency } from '@/lib/utils'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('user_id', user.id)
      .order('generated_at', { ascending: false })
      .limit(10)

    if (error) throw error
    return NextResponse.json({ data })
  } catch (error) {
    console.error('Insights error:', error)
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

    const apiKey = process.env.ANTHROPIC_API_KEY

    // Fetch user's financial data
    const { data: budgets } = await supabase
      .from('budget_summary')
      .select('*')
      .eq('user_id', user.id)

    const { data: investments } = await supabase
      .from('investments')
      .select('*')
      .eq('user_id', user.id)

    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)

    const { data: accounts } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)

    // Calculate stats
    const currentMonth = new Date().toISOString().slice(0, 7)
    const monthlyTx = transactions?.filter(t => t.date?.startsWith(currentMonth)) || []
    const totalExpenses = monthlyTx
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
    const totalIncome = monthlyTx
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
    const netWorth = accounts?.reduce((sum, a) => sum + parseFloat(a.balance || 0), 0) || 0
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

    if (!apiKey) {
      // Return mock insights in demo mode
      return NextResponse.json({
        insights: [
          {
            type: 'suggestion',
            title: 'Set up your financial data',
            body: 'Connect your accounts and add transactions to get AI insights.',
            action: 'Add an account',
            severity: 'info',
          },
        ],
      })
    }

    // Build financial context
    const overBudget = budgets?.filter(b => (b.percent_used ?? 0) > 100) || []
    const nearBudget = budgets?.filter(b => (b.percent_used ?? 0) >= 80 && (b.percent_used ?? 0) < 100) || []
    const totalInvestments = investments?.reduce((s, i) => s + parseFloat(i.current_price || 0) * parseFloat(i.quantity || 0), 0) || 0

    const prompt = `You are a financial analyst generating personalized insights for a user's finance app.

USER FINANCIAL DATA:
- Net worth: ${formatCurrency(netWorth)}
- Monthly income: ${formatCurrency(totalIncome)}
- Monthly expenses: ${formatCurrency(totalExpenses)}  
- Savings rate: ${savingsRate.toFixed(1)}%

BUDGET STATUS:
${budgets?.map(b => `- Category: $${b.spent?.toFixed(0)} / $${b.amount} (${b.percent_used?.toFixed(0)}%)`).join('\n') || 'No budgets'}
Over budget: ${overBudget.length > 0 ? 'Yes' : 'None'}
Near limit (80%+): ${nearBudget.length > 0 ? 'Yes' : 'None'}

INVESTMENTS (total: ${formatCurrency(totalInvestments)}):
${investments?.map(i => `- ${i.name}: ${formatCurrency(parseFloat(i.current_price || 0) * parseFloat(i.quantity || 0))}`).join('\n') || 'None'}

Generate exactly 4 financial insights in this JSON format (return ONLY the JSON array, no markdown):
[
  {
    "type": "anomaly|suggestion|risk|investment|cashflow|weekly_review",
    "title": "Short actionable title (max 60 chars)",
    "body": "2-3 sentences with specific dollar amounts.",
    "action": "One specific next step",
    "severity": "positive|info|warning|critical"
  }
]`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      return NextResponse.json({
        insights: [
          {
            type: 'suggestion',
            title: 'Keep tracking your finances',
            body: 'Your data is being monitored for insights.',
            action: 'Continue adding data',
            severity: 'info',
          },
        ],
      })
    }

    const responseData = await response.json()
    const text = responseData.content[0]?.text ?? '[]'
    const clean = text.replace(/```json\n?|\n?```/g, '').trim()
    const insights = JSON.parse(clean)

    // Enrich with IDs and timestamps
    const enriched = insights.map((ins: Record<string, string>, i: number) => ({
      id: `ai-${Date.now()}-${i}`,
      user_id: 'user-1',
      ...ins,
      is_read: false,
      generated_at: new Date().toISOString(),
    }))

    return NextResponse.json({ insights: enriched })
  } catch (err) {
    console.error('Insights generation error:', err)
    return NextResponse.json({ insights: [
      {
        type: 'suggestion',
        title: 'Keep tracking your finances',
        body: 'Your data is being monitored for insights.',
        action: 'Continue adding data',
        severity: 'info',
      },
    ] })
  }
}
