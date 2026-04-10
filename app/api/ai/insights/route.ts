import { NextRequest, NextResponse } from 'next/server'
import { MOCK_DASHBOARD, MOCK_BUDGETS, MOCK_INVESTMENTS } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      // Return mock insights in demo mode
      return NextResponse.json({ insights: MOCK_DASHBOARD.active_insights })
    }

    // Build financial context for insight generation
    const overBudget = MOCK_BUDGETS.filter(b => (b.percent_used ?? 0) > 100)
    const nearBudget = MOCK_BUDGETS.filter(b => (b.percent_used ?? 0) >= 80 && (b.percent_used ?? 0) < 100)
    const totalInvestments = MOCK_INVESTMENTS.reduce((s, i) => s + (i.current_value ?? 0), 0)

    const prompt = `You are a financial analyst generating personalized insights for a user's finance app.

USER FINANCIAL DATA:
- Net worth: ${formatCurrency(MOCK_DASHBOARD.net_worth)}
- Monthly income: ${formatCurrency(MOCK_DASHBOARD.monthly_income)}
- Monthly expenses: ${formatCurrency(MOCK_DASHBOARD.monthly_expenses)}  
- Savings rate: ${MOCK_DASHBOARD.savings_rate.toFixed(1)}%

BUDGET STATUS:
${MOCK_BUDGETS.map(b => `- ${b.category?.name}: $${b.spent?.toFixed(0)} / $${b.amount} (${b.percent_used?.toFixed(0)}%)`).join('\n')}
Over budget: ${overBudget.map(b => b.category?.name).join(', ') || 'none'}
Near budget (80%+): ${nearBudget.map(b => b.category?.name).join(', ') || 'none'}

INVESTMENTS (total: ${formatCurrency(totalInvestments)}):
${MOCK_INVESTMENTS.map(i => `- ${i.name}: ${formatCurrency(i.current_value ?? 0)} (${i.gain_loss_percent?.toFixed(1)}% gain)`).join('\n')}

Generate exactly 4 financial insights in this JSON format (return ONLY the JSON array, no markdown):
[
  {
    "type": "anomaly|suggestion|risk|investment|cashflow|weekly_review",
    "title": "Short actionable title (max 60 chars)",
    "body": "2-3 sentences with specific dollar amounts. Reference their real data.",
    "action": "One specific next step they can take today",
    "severity": "positive|info|warning|critical"
  }
]

Rules:
- Reference specific dollar amounts from the data
- Be coaching in tone, not alarmist
- Give concrete, actionable advice
- Cover spending, investment, and cashflow angles
- The first insight should be the most impactful one`

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
      return NextResponse.json({ insights: MOCK_DASHBOARD.active_insights })
    }

    const data = await response.json()
    const text = data.content[0]?.text ?? '[]'

    // Parse the JSON response
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
    return NextResponse.json({ insights: MOCK_DASHBOARD.active_insights })
  }
}
