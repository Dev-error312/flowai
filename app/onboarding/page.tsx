'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Pencil, PartyPopper } from 'lucide-react'
import { getIcon } from '@/lib/icon-map'

const STEPS = [
  { id: 'welcome',   title: 'Welcome to FlowAI',      subtitle: "Let's set up your financial picture in 2 minutes" },
  { id: 'income',    title: 'What\'s your income?',   subtitle: 'This helps AI calibrate your budget recommendations' },
  { id: 'accounts',  title: 'Connect your accounts',  subtitle: 'Link your bank for automatic tracking, or add manually' },
  { id: 'goals',     title: 'Set your first goal',    subtitle: 'What are you saving toward?' },
  { id: 'ready',     title: 'You\'re all set!',       subtitle: 'Your AI financial advisor is ready to help' },
]

const GOAL_PRESETS = [
  { icon: 'shield', label: 'Emergency Fund',  amount: 15000, category: 'emergency' },
  { icon: 'plane', label: 'Vacation',         amount: 5000,  category: 'vacation' },
  { icon: 'home', label: 'House Down Payment', amount: 50000, category: 'house' },
  { icon: 'umbrella', label: 'Early Retirement', amount: 1000000, category: 'retirement' },
  { icon: 'book', label: 'Education',        amount: 20000, category: 'education' },
  { icon: 'target', label: 'Something else',   amount: 10000, category: 'other' },
]

const INCOME_PRESETS = [25000, 50000, 75000, 100000, 150000, 200000]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')

  // Step data
  const [income, setIncome] = useState('')
  const [incomeFreq, setIncomeFreq] = useState<'monthly' | 'yearly'>('yearly')
  const [selectedGoal, setSelectedGoal] = useState<typeof GOAL_PRESETS[0] | null>(null)
  const [goalAmount, setGoalAmount] = useState('')
  const [bankConnected, setBankConnected] = useState(false)

  const goNext = () => {
    setDirection('forward')
    setStep(s => Math.min(s + 1, STEPS.length - 1))
  }
  const goBack = () => {
    setDirection('back')
    setStep(s => Math.max(s - 1, 0))
  }

  const finish = () => router.push('/dashboard')

  const annualIncome = incomeFreq === 'yearly'
    ? parseFloat(income.replace(/,/g, '')) || 0
    : (parseFloat(income.replace(/,/g, '')) || 0) * 12

  const S: React.CSSProperties = {
    minHeight: '100vh',
    background: '#f1f4f6',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
  }

  const card: React.CSSProperties = {
    background: 'white',
    borderRadius: '20px',
    border: '1px solid #e5eaed',
    boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '520px',
    overflow: 'hidden',
  }

  const inp: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: '1px solid #e5eaed',
    fontSize: '15px',
    color: '#111820',
    outline: 'none',
    background: '#f8fafb',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s, background 0.15s',
  }

  return (
    <div style={S}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', marginBottom: '2rem' }}>
        <div style={{ fontWeight: 800, fontSize: '22px', letterSpacing: '-0.04em', textAlign: 'center' }}>
          <span style={{ color: '#9333ea' }}>Flow</span><span style={{ color: '#111820' }}>AI</span>
        </div>
      </Link>

      <div style={card}>
        {/* Progress bar */}
        <div style={{ height: '3px', background: '#f1f4f6' }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #9333ea, #16a34a)',
            width: `${((step + 1) / STEPS.length) * 100}%`,
            transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
          }} />
        </div>

        {/* Step counter */}
        <div style={{ padding: '1.25rem 1.75rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', color: '#9aaab4', fontWeight: 500 }}>
            Step {step + 1} of {STEPS.length}
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                width: i === step ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i <= step ? '#9333ea' : '#e9d5ff',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem 1.75rem 1.75rem' }}>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.03em', color: '#111820', marginBottom: '6px' }}>
            {STEPS[step].title}
          </h1>
          <p style={{ fontSize: '14px', color: '#9aaab4', marginBottom: '1.75rem' }}>
            {STEPS[step].subtitle}
          </p>

          {/* ── Step 0: Welcome ── */}
          {step === 0 && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.5rem' }}>
                {[
                  { icon: 'brain', title: 'AI-powered advice', desc: 'Claude analyzes your finances and tells you what to do' },
                  { icon: 'barChart', title: 'Everything unified', desc: 'Income, expenses, investments in one dashboard' },
                  { icon: 'eye', title: 'Future-aware', desc: 'See cashflow forecasts 90 days ahead' },
                  { icon: 'shield', title: 'Bank-level security', desc: 'Read-only access, AES-256 encrypted, never shared' },
                ].map(f => (
                  <div key={f.title} style={{ background: '#f8fafb', borderRadius: '12px', padding: '1rem', border: '1px solid #f1f4f6' }}>
                    <div style={{ fontSize: '22px', marginBottom: '6px' }}>
                      {(() => {
                        const Icon = getIcon(f.icon)
                        return Icon ? <Icon size={22} /> : null
                      })()}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#111820', marginBottom: '3px' }}>{f.title}</div>
                    <div style={{ fontSize: '12px', color: '#9aaab4', lineHeight: 1.4 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
              <button onClick={goNext} style={primaryBtn}>Get started →</button>
            </div>
          )}

          {/* ── Step 1: Income ── */}
          {step === 1 && (
            <div>
              {/* Freq toggle */}
              <div style={{ display: 'flex', background: '#f1f4f6', borderRadius: '8px', padding: '3px', marginBottom: '1rem', width: 'fit-content' }}>
                {(['monthly', 'yearly'] as const).map(f => (
                  <button key={f} onClick={() => setIncomeFreq(f)} style={{
                    padding: '6px 16px', borderRadius: '6px', border: 'none', fontSize: '13px',
                    background: incomeFreq === f ? 'white' : 'transparent',
                    color: incomeFreq === f ? '#111820' : '#9aaab4',
                    fontWeight: incomeFreq === f ? 500 : 400,
                    cursor: 'pointer',
                    boxShadow: incomeFreq === f ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s', textTransform: 'capitalize',
                  }}>{f}</button>
                ))}
              </div>

              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9aaab4', fontSize: '16px', fontWeight: 500 }}>$</span>
                <input
                  type="text"
                  value={income}
                  onChange={e => setIncome(e.target.value)}
                  placeholder="0"
                  style={{ ...inp, paddingLeft: '28px', fontSize: '24px', fontWeight: 700 }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#14b8a6'; e.currentTarget.style.background = 'white' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e5eaed'; e.currentTarget.style.background = '#f8fafb' }}
                />
              </div>

              {/* Quick select */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.5rem' }}>
                {INCOME_PRESETS.map(p => {
                  const display = incomeFreq === 'yearly' ? p : Math.round(p / 12)
                  return (
                    <button key={p} onClick={() => setIncome(display.toLocaleString())} style={{
                      padding: '5px 12px', borderRadius: '100px', border: '1px solid #e5eaed',
                      background: 'transparent', fontSize: '12px', color: '#627282',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                      onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = '#14b8a6'; el.style.color = '#14b8a6' }}
                      onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = '#e5eaed'; el.style.color = '#627282' }}>
                      ${display.toLocaleString()}
                    </button>
                  )
                })}
              </div>

              {annualIncome > 0 && (
                <div style={{ background: '#f0fdf9', border: '1px solid #dcfce7', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#16a34a', marginBottom: '1.25rem' }}>
                  ✦ Based on ${annualIncome.toLocaleString()}/year, your recommended monthly savings is{' '}
                  <strong>${Math.round(annualIncome * 0.2 / 12).toLocaleString()}</strong> (20% savings rate)
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={goBack} style={secondaryBtn}>← Back</button>
                <button onClick={goNext} style={primaryBtn}>Continue →</button>
              </div>
            </div>
          )}

          {/* ── Step 2: Accounts ── */}
          {step === 2 && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => {
                    alert('Plaid Link opens here in production. Add PLAID_CLIENT_ID to .env.local to enable real bank connections.')
                    setBankConnected(true)
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '1rem 1.25rem', borderRadius: '12px',
                    border: bankConnected ? '2px solid #14b8a6' : '1.5px solid #e5eaed',
                    background: bankConnected ? '#f0fdf9' : 'white',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.2s',
                  }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#111820', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                    {/* Building icon component goes here */}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#111820' }}>
                      {bankConnected ? '✓ Bank connected!' : 'Connect your bank via Plaid'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9aaab4', marginTop: '2px' }}>
                      {bankConnected ? 'Transactions will sync automatically' : 'Supports 13,000+ institutions · Read-only · Secure'}
                    </div>
                  </div>
                </button>

                <div style={{ textAlign: 'center', fontSize: '12px', color: '#9aaab4' }}>or</div>

                <button onClick={goNext} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '1rem 1.25rem', borderRadius: '12px',
                  border: '1.5px dashed #e5eaed', background: 'transparent',
                  cursor: 'pointer', textAlign: 'left',
                }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f1f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                    <Pencil size={24} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#111820' }}>Add accounts manually</div>
                    <div style={{ fontSize: '12px', color: '#9aaab4', marginTop: '2px' }}>Enter balances yourself — you can connect later</div>
                  </div>
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={goBack} style={secondaryBtn}>← Back</button>
                <button onClick={goNext} style={primaryBtn}>
                  {bankConnected ? 'Continue →' : 'Skip for now →'}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Goals ── */}
          {step === 3 && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1rem' }}>
                {GOAL_PRESETS.map(g => (
                  <button key={g.label} onClick={() => {
                    setSelectedGoal(g)
                    setGoalAmount(g.amount.toLocaleString())
                  }} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', borderRadius: '10px',
                    border: selectedGoal?.label === g.label ? '2px solid #9333ea' : '1.5px solid #e9d5ff',
                    background: selectedGoal?.label === g.label ? '#f3e8ff' : 'white',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.15s',
                  }}>
                    <span style={{ fontSize: '20px', color: '#9333ea' }}>
                      {(() => {
                        const Icon = getIcon(g.icon)
                        return Icon ? <Icon size={20} /> : null
                      })()}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#111820' }}>{g.label}</span>
                  </button>
                ))}
              </div>

              {selectedGoal && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: '#627282', display: 'block', marginBottom: '5px' }}>
                    Target amount for {selectedGoal.label}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9aaab4' }}>$</span>
                    <input
                      value={goalAmount}
                      onChange={e => setGoalAmount(e.target.value)}
                      style={{ ...inp, paddingLeft: '26px' }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#14b8a6'; e.currentTarget.style.background = 'white' }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#e5eaed'; e.currentTarget.style.background = '#f8fafb' }}
                    />
                  </div>
                  {annualIncome > 0 && selectedGoal && (
                    <div style={{ fontSize: '12px', color: '#9aaab4', marginTop: '6px' }}>
                      At 20% savings rate: ~{Math.ceil(parseFloat(goalAmount.replace(/,/g, '')) / (annualIncome * 0.2 / 12))} months to reach goal
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={goBack} style={secondaryBtn}>← Back</button>
                <button onClick={goNext} style={primaryBtn}>
                  {selectedGoal ? 'Set goal →' : 'Skip for now →'}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 4: Ready ── */}
          {step === 4 && (
            <div style={{ textAlign: 'center' }}>
              <PartyPopper size={64} style={{ marginBottom: '1rem', animation: 'float 2s ease-in-out infinite' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.75rem' }}>
                {[
                  { done: true,  text: 'Financial profile created' },
                  { done: true,  text: income ? `Income set: $${parseFloat(income.replace(/,/g,'') || '0').toLocaleString()}/${incomeFreq === 'monthly' ? 'mo' : 'yr'}` : 'Income added' },
                  { done: bankConnected, text: bankConnected ? 'Bank account connected' : 'Manual accounts ready to add' },
                  { done: !!selectedGoal, text: selectedGoal ? `Goal set: ${selectedGoal.icon} ${selectedGoal.label}` : 'Goals ready to set' },
                  { done: true,  text: 'AI advisor ready to help' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 14px', borderRadius: '10px',
                    background: item.done ? '#f0fdf4' : '#f8fafb',
                    border: `1px solid ${item.done ? '#bbf7d0' : '#f1f4f6'}`,
                  }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                      background: item.done ? '#22c55e' : '#e5eaed',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', color: 'white', fontWeight: 700,
                    }}>
                      {item.done ? '✓' : '·'}
                    </div>
                    <span style={{ fontSize: '13px', color: item.done ? '#15803d' : '#9aaab4', fontWeight: item.done ? 500 : 400 }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
              <button onClick={finish} style={{ ...primaryBtn, width: '100%', fontSize: '16px', padding: '14px' }}>
                Open my dashboard →
              </button>
            </div>
          )}
        </div>
      </div>

      {step < 4 && step > 0 && (
        <div style={{ marginTop: '1rem', fontSize: '12px', color: '#9aaab4' }}>
          You can always change this later in Settings
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}

const primaryBtn: React.CSSProperties = {
  flex: 1, padding: '11px 20px', borderRadius: '10px', border: 'none',
  background: '#14b8a6', color: '#042f2e', fontSize: '14px', fontWeight: 600,
  cursor: 'pointer', transition: 'all 0.15s',
}

const secondaryBtn: React.CSSProperties = {
  padding: '11px 18px', borderRadius: '10px', border: '1px solid #e5eaed',
  background: 'transparent', color: '#627282', fontSize: '14px',
  cursor: 'pointer',
}
