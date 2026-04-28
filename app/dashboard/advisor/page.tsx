'use client'
import { useState, useRef, useEffect } from 'react'
import { formatCurrency } from '@/lib/utils'
import { MOCK_DASHBOARD, MOCK_TRANSACTIONS, MOCK_INVESTMENTS, MOCK_BUDGETS } from '@/lib/mock-data'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SUGGESTED_QUESTIONS = [
  'Should I pay off my credit card debt or invest more?',
  'How can I reach my emergency fund goal faster?',
  'My shopping budget is over — what should I do?',
  'Is my investment portfolio well-diversified?',
  'Predict my cashflow for next month',
  'What unnecessary expenses can I cut?',
]

function buildFinancialContext() {
  const d = MOCK_DASHBOARD
  const overBudget = MOCK_BUDGETS.filter(b => (b.percent_used ?? 0) > 100)
  const totalInvestments = MOCK_INVESTMENTS.reduce((s, i) => s + (i.current_value ?? 0), 0)
  const totalGains = MOCK_INVESTMENTS.reduce((s, i) => s + (i.gain_loss ?? 0), 0)

  return `You are FlowAI, an expert AI financial advisor. You have access to this user's real financial data. Always ground your advice in their specific numbers. Be conversational, specific, and actionable. Use a coaching tone — supportive, not alarming. Always give at least one concrete next step.

USER'S FINANCIAL SNAPSHOT:
- Net worth: ${formatCurrency(d.net_worth)} (up ${formatCurrency(d.net_worth_change)} this month, +${d.net_worth_change_percent.toFixed(1)}%)
- Monthly income: ${formatCurrency(d.monthly_income)}
- Monthly expenses: ${formatCurrency(d.monthly_expenses)}
- Monthly savings: ${formatCurrency(d.monthly_savings)} (${d.savings_rate.toFixed(1)}% savings rate)

ACCOUNTS:
${d.accounts.map(a => `- ${a.name} (${a.type}): ${formatCurrency(a.balance)}`).join('\n')}

TOP SPENDING CATEGORIES THIS MONTH:
${d.top_categories.map(c => `- ${c.category.name}: ${formatCurrency(c.total)} (${c.percent_of_total.toFixed(1)}% of expenses)`).join('\n')}

BUDGET STATUS:
${MOCK_BUDGETS.map(b => `- ${b.category?.name}: ${formatCurrency(b.spent ?? 0)} / ${formatCurrency(b.amount)} (${b.percent_used?.toFixed(0)}% used)`).join('\n')}

${overBudget.length > 0 ? `OVER-BUDGET CATEGORIES: ${overBudget.map(b => b.category?.name).join(', ')}` : ''}

INVESTMENT PORTFOLIO (total: ${formatCurrency(totalInvestments)}, total gain: ${formatCurrency(totalGains)}):
${MOCK_INVESTMENTS.map(i => `- ${i.name} (${i.symbol}): ${formatCurrency(i.current_value ?? 0)} — ${i.gain_loss_percent?.toFixed(1)}% gain`).join('\n')}

RECENT TRANSACTIONS (last 5):
${MOCK_TRANSACTIONS.slice(0, 5).map(t => `- ${t.date}: ${t.merchant} — ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)} (${t.category?.name})`).join('\n')}

When giving advice:
1. Always reference specific dollar amounts from their data
2. Give concrete, actionable recommendations
3. Keep responses focused and practical (200-400 words max unless a detailed analysis is requested)
4. Use plain language, not financial jargon
5. Always mention one specific next step they can take today
6. Never make guarantees about investment returns`
}

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi Alex! I'm your AI financial advisor, powered by Claude. I have access to your complete financial picture — your accounts, spending, investments, and goals.\n\nI noticed a few things worth discussing:\n\n→ Your shopping budget is **89% over** this month ($565 vs $300 target)\n→ Your crypto allocation has grown to **15.8%** of your portfolio — above typical targets\n→ You're just **$5,200 away** from your emergency fund goal!\n\nWhat would you like to work through today?",
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    // Build message history for Claude
    const history = [...messages, userMsg]
      .filter(m => m.id !== 'welcome')
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

    if (messages[0]?.id === 'welcome') {
      history.unshift({ role: 'assistant', content: messages[0].content })
    }

    const assistantId = (Date.now() + 1).toString()
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '', timestamp: new Date() }])

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          systemPrompt: buildFinancialContext(),
        }),
      })

      if (!response.ok) throw new Error('API error')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break
            try {
              const parsed = JSON.parse(data)
              const delta = parsed?.delta?.text || parsed?.choices?.[0]?.delta?.content || ''
              accumulated += delta
              setMessages(prev => prev.map(m =>
                m.id === assistantId ? { ...m, content: accumulated } : m
              ))
            } catch { /* skip */ }
          }
        }
      }
    } catch {
      setMessages(prev => prev.map(m =>
        m.id === assistantId ? { ...m, content: "I'm having trouble connecting right now. Please try again in a moment." } : m
      ))
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const formatMessageContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/→ /g, '<span style="color:#14b8a6">→</span> ')
      .replace(/\n/g, '<br/>')
  }

  return (
    <div style={{ height: 'calc(100vh - 60px - 3rem)', display: 'flex', flexDirection: 'column', maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ background: 'white', borderRadius: '14px 14px 0 0', padding: '1.1rem 1.4rem', border: '1px solid #e5eaed', borderBottom: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #9333ea, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
          ✦
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '15px', color: '#111820', fontFamily: 'Syne, sans-serif' }}>AI Financial Advisor</div>
          <div style={{ fontSize: '12px', color: '#9aaab4', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
            Powered by Claude · Sees your real financial data
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#9aaab4', background: '#f1f4f6', padding: '4px 10px', borderRadius: '100px' }}>
          Context: Nov 2024 snapshot
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'white', border: '1px solid #e5eaed', borderTop: 'none', borderBottom: 'none', padding: '1rem 1.4rem' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            display: 'flex', gap: '12px', marginBottom: '1.25rem',
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
          }}>
            {/* Avatar */}
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
              background: msg.role === 'assistant' ? 'linear-gradient(135deg, #9333ea, #0ea5e9)' : 'linear-gradient(135deg, #9333ea, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: msg.role === 'assistant' ? '14px' : '11px',
              fontWeight: 700, color: msg.role === 'assistant' ? '#d8b4fe' : 'white',
            }}>
              {msg.role === 'assistant' ? '✦' : 'A'}
            </div>

            {/* Bubble */}
            <div style={{ maxWidth: '75%', minWidth: '60px' }}>
              <div style={{
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
                background: msg.role === 'user' ? '#9333ea' : '#f9f5ff',
                border: msg.role === 'user' ? 'none' : '1px solid #e9d5ff',
                color: msg.role === 'user' ? 'white' : '#0f0d1a',
                fontSize: '14px', lineHeight: 1.65,
              }}>
                {msg.content ? (
                  <div
                    className="prose-ai"
                    dangerouslySetInnerHTML={{ __html: formatMessageContent(msg.content) }}
                  />
                ) : (
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '2px 0' }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: '6px', height: '6px', borderRadius: '50%', background: '#14b8a6',
                        animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
                      }} />
                    ))}
                  </div>
                )}
              </div>
              <div style={{ fontSize: '11px', color: '#9aaab4', marginTop: '4px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div style={{ background: '#f8fafb', border: '1px solid #e5eaed', borderTop: 'none', borderBottom: 'none', padding: '0.75rem 1.4rem' }}>
          <div style={{ fontSize: '11px', color: '#9aaab4', marginBottom: '8px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Suggested questions</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {SUGGESTED_QUESTIONS.slice(0, 4).map((q) => (
              <button key={q} onClick={() => sendMessage(q)} style={{
                fontSize: '12px', padding: '5px 12px', borderRadius: '100px',
                background: 'white', border: '1px solid #e5eaed', color: '#465662',
                cursor: 'pointer', transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.border = '1px solid #14b8a6'; el.style.color = '#14b8a6' }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.border = '1px solid #e5eaed'; el.style.color = '#465662' }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ background: 'white', border: '1px solid #e5eaed', borderRadius: '0 0 14px 14px', padding: '1rem 1.4rem', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your spending, investments, goals..."
          rows={1}
          style={{
            flex: 1, resize: 'none', border: '1px solid #e5eaed', borderRadius: '10px',
            padding: '10px 14px', fontSize: '14px', fontFamily: 'DM Sans, sans-serif',
            outline: 'none', lineHeight: 1.5, color: '#111820', background: '#f8fafb',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = '#14b8a6'; e.currentTarget.style.background = 'white' }}
          onBlur={e => { e.currentTarget.style.borderColor = '#e5eaed'; e.currentTarget.style.background = '#f8fafb' }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          style={{
            width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
            background: input.trim() && !loading ? '#14b8a6' : '#e5eaed',
            color: input.trim() && !loading ? '#042f2e' : '#9aaab4',
            border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
        >
          ↑
        </button>
      </div>

      <div style={{ textAlign: 'center', fontSize: '11px', color: '#d1d9de', marginTop: '8px' }}>
        FlowAI provides informational guidance only. Not regulated financial advice. Consult a licensed advisor for major decisions.
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
