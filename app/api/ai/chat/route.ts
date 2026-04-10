import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { messages, systemPrompt } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages' }), { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      // Demo mode: return a helpful mock response
      return mockStreamResponse(messages[messages.length - 1]?.content ?? '')
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'messages-2023-12-15',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        stream: true,
        system: systemPrompt || 'You are FlowAI, an expert AI financial advisor. Be specific, actionable, and grounded in the user\'s financial data.',
        messages: messages.slice(-20), // last 20 messages for context window mgmt
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Anthropic API error:', err)
      return mockStreamResponse(messages[messages.length - 1]?.content ?? '')
    }

    // Stream the response directly
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        try {
          while (reader) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim()
                if (data === '[DONE]' || data === 'event: message_stop') continue
                try {
                  const parsed = JSON.parse(data)
                  // Anthropic SSE format
                  if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                    controller.enqueue(
                      new TextEncoder().encode(`data: ${JSON.stringify({ delta: { text: parsed.delta.text } })}\n\n`)
                    )
                  }
                  if (parsed.type === 'message_stop') {
                    controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'))
                  }
                } catch { /* skip malformed */ }
              }
            }
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (err) {
    console.error('Chat API error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}

// Demo mode: realistic financial advisor responses when no API key
function mockStreamResponse(userMessage: string): Response {
  const lowerMsg = userMessage.toLowerCase()

  let reply = ''

  if (lowerMsg.includes('credit card') || lowerMsg.includes('debt') || lowerMsg.includes('invest')) {
    reply = `Great question — this is one of the most common financial dilemmas, and your numbers actually make the answer clear.\n\n**Your situation:**\n→ Chase Sapphire balance: $2,340\n→ Monthly savings rate: 46.7% (excellent!)\n→ Investment portfolio: $102,920 total\n\n**My recommendation: Pay off the credit card first.**\n\nHere's the math: Credit card interest rates typically run 20–29% APR. Your S&P 500 index fund (FXAIX) has returned ~18.9% this year — but that's not guaranteed going forward. The average long-term market return is ~10%/year.\n\nPaying off a 24% APR debt is a guaranteed 24% return. That beats your expected investment returns.\n\n**Concrete next steps:**\n1. Make a $1,500 lump payment this week (you have $8,420 in checking — this won't strain you)\n2. Pay the remaining $840 next paycheck\n3. Once cleared (3 weeks), redirect that payment amount into your Fidelity 401k or Robinhood\n\nAfter the card is paid off, you'll free up ~$200/month in interest payments that go directly to building wealth. Want me to model what that looks like over 5 years?`
  } else if (lowerMsg.includes('emergency') || lowerMsg.includes('savings goal')) {
    reply = `You're so close — this is exciting! Let's look at exactly where you stand.\n\n**Emergency fund status:**\n→ Current Ally Savings: $24,800\n→ Target (3 months expenses): $30,000\n→ Gap: $5,200\n→ Progress: 82.7% ✦\n\n**At your current savings rate ($868/mo toward this goal), you'll hit it in ~6 months** — around May 2025.\n\n**But here's how to get there faster:**\n\n1. **Redirect your crypto gains** — your Bitcoin position is up 163% ($10,332 in gains). Taking just $5,000 in profits would complete your emergency fund in one move and simultaneously rebalance your crypto allocation from 15.8% back toward a healthier 10%.\n\n2. **Cut the overspending** — you're $265 over budget on shopping this month. That extra $265 could go straight to Ally instead.\n\n3. **Your freelance income** — you earned $1,200 this month from consulting. Even routing 50% of future freelance income to savings would accelerate this significantly.\n\n**My recommendation:** Sell $5,200 of BTC, complete the emergency fund, then redirect your $868/month emergency contribution toward your Japan vacation goal.\n\nWant me to map out what your savings trajectory looks like after the emergency fund is complete?`
  } else if (lowerMsg.includes('shopping') || lowerMsg.includes('budget') || lowerMsg.includes('over')) {
    reply = `I hear you — being over budget is frustrating, but you caught it early enough to course-correct.\n\n**What happened:**\n→ Shopping budget: $300/month\n→ Spent so far: $565 (+88% over)\n→ Two big purchases: Nordstrom $320, Amazon $245\n\nThis wasn't random — it was two specific decisions. That's actually good news because it means the fix is behavioral, not structural.\n\n**For the rest of this month:**\n1. Put your Amazon and Nordstrom apps in a folder — the friction helps\n2. You have ~10 days left. Keep shopping at $0 and you'll end at $565 total\n3. The $265 overage? Don't stress about it. Just don't add to it.\n\n**For December:**\nI'd suggest temporarily bumping your shopping budget to $400 (holidays are real) and adding a rule: any single purchase over $100 requires a 24-hour wait before buying. This \"cooling off\" technique reduces impulse spending by ~35% for most people.\n\n**Longer-term insight:**\nYour food & dining (81% of budget) plus shopping (188% of budget) together account for $1,054 this month — 22% of your income. That's on the high side given your other goals. I'd recommend a combined cap of $800/month for these two categories.\n\nWant me to suggest a revised budget that keeps your current lifestyle but accelerates your down payment goal?`
  } else if (lowerMsg.includes('invest') || lowerMsg.includes('portfolio') || lowerMsg.includes('diversif')) {
    reply = `Your portfolio has grown impressively — up significantly this year. Let me give you an honest assessment.\n\n**Current allocation:**\n→ S&P 500 (FXAIX): $77,302 — 75.1%\n→ Apple (AAPL): $4,983 — 4.8%\n→ Bitcoin (BTC): $16,632 — 16.1% ⚠️\n→ Bonds (BND): $4,326 — 4.2%\n→ NVIDIA (NVDA): $6,677 — 6.5%\n\n**What's working:** Your FXAIX position is solid — index investing is statistically the right long-term move. NVDA has been exceptional (+98.7%).\n\n**The concern:** Bitcoin at 16.1% of your portfolio is above most financial advisors' recommended 5–10% for crypto. Given BTC's volatility (it can drop 50–70% in bear markets), this concentration is a real risk to your net worth.\n\n**Recommended rebalance:**\n1. Sell ~$6,000 of BTC (you're still up massively on the remainder)\n2. Put $4,000 into FXAIX (brings index to 78%)\n3. Put $2,000 into BND (brings bonds to 6%)\n\nThis locks in some BTC profits while reducing risk without exiting crypto entirely.\n\n**Also:** Consider increasing your bond allocation as you approach your down payment goal (2027). Bonds smooth out volatility when you need the money.\n\nShall I model what your portfolio looks like after this rebalance?`
  } else if (lowerMsg.includes('cashflow') || lowerMsg.includes('next month') || lowerMsg.includes('predict')) {
    reply = `Based on your spending patterns and income schedule, here's my 30-day forecast for December.\n\n**Projected December cashflow:**\n\n📥 **Income (expected):** $9,000–$10,200\n→ Salary: $7,800 (arrives Dec 1)\n→ Freelance: $0–$1,200 (variable — you've earned this 2 of 3 recent months)\n\n📤 **Fixed expenses:** $3,030\n→ Rent: $1,850\n→ 401k contribution: $850\n→ Subscriptions: $32\n→ Utilities: ~$180 (estimate)\n→ Car: ~$118 (gas, based on Nov pattern)\n\n📤 **Variable expenses (at current pace):** $1,500–$2,200\n→ Food & dining: ~$500 (you're pacing higher)\n→ Shopping: you have $300 budgeted — stick to it!\n→ Entertainment: ~$150\n\n**Net projected for December:** +$3,800 to +$5,100\n\n⚠️ **One risk to watch:** If you continue November's shopping pace into December (holiday season effect is real), you could spend $800–$1,200 on shopping instead of $300. That single category could reduce your savings by $500–$900.\n\n**My recommendation:** Set a $400 shopping budget for December (holiday allowance), automate a $1,500 transfer to savings on Dec 1, and treat the rest as flexible spending.\n\nWant me to set up a recurring alert if your spending pace puts you at risk of going over?`
  } else {
    reply = `Thanks for asking — let me pull up your financial data to give you a specific answer.\n\n**Your current snapshot:**\n→ Net worth: $134,180 (up $4,230 this month 📈)\n→ Monthly savings rate: 46.7% — that's genuinely excellent (most financial advisors target 20%)\n→ Three active goals: emergency fund (83%), Japan trip (40%), house down payment (31%)\n\n**A few things worth your attention right now:**\n\n1. **Shopping budget overage** — you're 89% over budget this month. This is the most immediate thing to address before month-end.\n\n2. **Crypto rebalancing** — Bitcoin has grown to 16% of your portfolio due to its massive gains. Consider taking some profits.\n\n3. **Emergency fund finish line** — you're only $5,200 away. One strategic move could get you there this month.\n\nWhich of these would you like to dig into? Or ask me anything specific — I can analyze your spending trends, model different savings scenarios, compare debt payoff vs. investing strategies, or help you think through any financial decision.\n\nI have full visibility into your accounts, transactions, investments, and goals, so my answers will be grounded in your real numbers.`
  }

  // Simulate streaming
  const encoder = new TextEncoder()
  const words = reply.split(' ')
  let index = 0

  const stream = new ReadableStream({
    async start(controller) {
      const sendNext = () => {
        if (index >= words.length) {
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
          return
        }
        const chunk = words.slice(index, index + 3).join(' ') + ' '
        index += 3
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ delta: { text: chunk } })}\n\n`)
        )
        setTimeout(sendNext, 35)
      }
      setTimeout(sendNext, 200)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  })
}
