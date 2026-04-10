// Supabase Edge Function: weekly-digest
// Deploy: supabase functions deploy weekly-digest
// Schedule: Every Monday 9am via pg_cron:
//   select cron.schedule('weekly-digest', '0 9 * * 1', $$
//     select net.http_post(url := 'https://[project].supabase.co/functions/v1/weekly-digest',
//       headers := '{"Authorization": "Bearer [service_role_key]"}'::jsonb)
//   $$);

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface UserDigestData {
  user_id: string
  email: string
  name: string
  monthly_income: number
  this_month_expenses: number
  savings: number
  savings_rate: number
  top_overspend_category: string
  net_worth_change: number
  insights_count: number
}

Deno.serve(async () => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  // Fetch all users with weekly digest enabled
  // In production you'd join with a preferences table
  const { data: users } = await supabase
    .from('users')
    .select('id, email, name, monthly_income')
    .limit(100)

  if (!users?.length) {
    return new Response(JSON.stringify({ sent: 0 }), { status: 200 })
  }

  let sent = 0

  for (const user of users) {
    try {
      // Build financial snapshot for this user
      const thisMonth = new Date().toISOString().slice(0, 7) // "2024-11"

      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount, type, category_id')
        .eq('user_id', user.id)
        .gte('date', `${thisMonth}-01`)

      if (!transactions?.length) continue

      const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
      const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
      const savings = income - expenses
      const savingsRate = income > 0 ? (savings / income) * 100 : 0

      // Generate AI digest content
      const digestPrompt = `You are writing a weekly financial digest email for ${user.name}.

Their financial snapshot this month:
- Income: $${income.toFixed(0)}
- Expenses: $${expenses.toFixed(0)}  
- Savings: $${savings.toFixed(0)} (${savingsRate.toFixed(1)}% savings rate)

Write a friendly, personalized 3-paragraph digest that:
1. Opens with a warm greeting and 1-sentence monthly summary
2. Highlights 2-3 specific observations about their finances this month (use the numbers)
3. Ends with 1-2 concrete action items for next week

Tone: Financial coach who genuinely cares. Warm but specific. Max 200 words total.
Do not use markdown formatting — plain text only.`

      const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 400,
          messages: [{ role: 'user', content: digestPrompt }],
        }),
      })

      const aiData = await aiResponse.json()
      const digestContent = aiData.content[0]?.text ?? 'Your weekly financial digest is ready.'

      // Send email via Resend
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'FlowAI <digest@yourapp.com>',
          to: user.email,
          subject: `Your weekly financial digest — ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`,
          html: buildEmailHTML(user.name, digestContent, {
            income, expenses, savings, savingsRate,
          }),
        }),
      })

      if (emailResponse.ok) {
        sent++

        // Store insight in database
        await supabase.from('ai_insights').insert({
          user_id: user.id,
          type: 'weekly_review',
          title: `Week of ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`,
          body: digestContent,
          severity: savingsRate >= 20 ? 'positive' : savingsRate >= 0 ? 'info' : 'warning',
          is_read: false,
        })
      }

    } catch (err) {
      console.error(`Failed to send digest for ${user.email}:`, err)
    }
  }

  return new Response(JSON.stringify({ sent, total: users.length }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})

function buildEmailHTML(
  name: string,
  content: string,
  stats: { income: number; expenses: number; savings: number; savingsRate: number }
): string {
  const sign = stats.savings >= 0 ? '+' : ''
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <style>
    body { font-family: 'DM Sans', -apple-system, sans-serif; background: #f1f4f6; margin: 0; padding: 20px; }
    .container { max-width: 560px; margin: 0 auto; }
    .card { background: white; border-radius: 16px; overflow: hidden; }
    .header { background: #111820; padding: 24px 32px; }
    .logo { font-size: 22px; font-weight: 800; letter-spacing: -0.04em; }
    .logo span { color: #14b8a6; }
    .body { padding: 32px; }
    .stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin: 24px 0; }
    .stat { background: #f8fafb; border-radius: 10px; padding: 12px; text-align: center; }
    .stat-label { font-size: 11px; color: #9aaab4; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
    .stat-value { font-size: 18px; font-weight: 700; color: #111820; }
    .content { font-size: 15px; line-height: 1.7; color: #465662; white-space: pre-line; }
    .cta { display: block; margin: 24px auto 0; padding: 12px 28px; background: #14b8a6; color: #042f2e; border-radius: 100px; text-align: center; text-decoration: none; font-weight: 600; font-size: 14px; width: fit-content; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #9aaab4; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo"><span>Flow</span><span style="color:white">AI</span></div>
        <div style="color:#627282;font-size:13px;margin-top:4px">Your weekly financial digest</div>
      </div>
      <div class="body">
        <div class="stats">
          <div class="stat">
            <div class="stat-label">Income</div>
            <div class="stat-value">$${stats.income.toLocaleString()}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Expenses</div>
            <div class="stat-value">$${stats.expenses.toLocaleString()}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Saved</div>
            <div class="stat-value" style="color:${stats.savings >= 0 ? '#15803d' : '#be123c'}">${sign}$${Math.abs(stats.savings).toLocaleString()}</div>
          </div>
        </div>
        <div class="content">${content}</div>
        <a href="https://yourapp.com/dashboard" class="cta">View your dashboard →</a>
      </div>
    </div>
    <div class="footer">
      FlowAI · <a href="https://yourapp.com/settings" style="color:#9aaab4">Unsubscribe</a> · 
      Not financial advice. AI-generated insights for informational purposes only.
    </div>
  </div>
</body>
</html>`
}
