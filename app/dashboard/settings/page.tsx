'use client'
import { useState } from 'react'
import { MOCK_ACCOUNTS } from '@/lib/mock-data'

const TABS = [
  { id: 'profile',    label: 'Profile',    icon: '👤' },
  { id: 'accounts',  label: 'Accounts',   icon: 'building' },
  { id: 'ai',        label: 'AI Settings', icon: '✦' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'security',  label: 'Security',   icon: '🔒' },
  { id: 'billing',   label: 'Billing',    icon: '💳' },
]

const CURRENCIES = ['USD', 'EUR', 'GBP', 'NPR', 'INR', 'AUD', 'CAD', 'JPY', 'CHF']

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!checked)} style={{
      width: '40px', height: '22px', borderRadius: '11px', cursor: 'pointer',
      background: checked ? '#14b8a6' : '#e5eaed', position: 'relative',
      transition: 'background 0.2s', flexShrink: 0,
    }}>
      <div style={{
        width: '16px', height: '16px', borderRadius: '50%', background: 'white',
        position: 'absolute', top: '3px',
        left: checked ? '21px' : '3px',
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
      }} />
    </div>
  )
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f1f4f6' }}>
      <div>
        <div style={{ fontSize: '14px', fontWeight: 500, color: '#111820' }}>{label}</div>
        {description && <div style={{ fontSize: '12px', color: '#9aaab4', marginTop: '2px' }}>{description}</div>}
      </div>
      {children}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ fontSize: '12px', fontWeight: 600, color: '#9aaab4', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>{title}</div>
      <div style={{ background: 'white', border: '1px solid #e5eaed', borderRadius: '14px', padding: '0 1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        {children}
      </div>
    </div>
  )
}

function SaveBar({ onSave, saving }: { onSave: () => void; saving: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
      <button style={{ padding: '9px 20px', borderRadius: '9px', border: '1px solid #e5eaed', background: 'transparent', color: '#627282', fontSize: '14px', cursor: 'pointer' }}>
        Cancel
      </button>
      <button onClick={onSave} disabled={saving} style={{
        padding: '9px 20px', borderRadius: '9px', border: 'none',
        background: saving ? '#e5eaed' : '#14b8a6', color: saving ? '#9aaab4' : '#042f2e',
        fontSize: '14px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
      }}>
        {saving ? 'Saving...' : 'Save changes'}
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Profile state
  const [name, setName] = useState('Alex Johnson')
  const [email] = useState('alex@example.com')
  const [currency, setCurrency] = useState('USD')
  const [timezone, setTimezone] = useState('America/New_York')
  const [monthlyIncome, setMonthlyIncome] = useState('7800')

  // Notifications
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [budgetAlerts, setBudgetAlerts] = useState(true)
  const [aiInsights, setAiInsights] = useState(true)
  const [largeTransactions, setLargeTransactions] = useState(true)
  const [goalMilestones, setGoalMilestones] = useState(true)

  // AI settings
  const [aiModel, setAiModel] = useState('claude-sonnet-4-6')
  const [insightFrequency, setInsightFrequency] = useState('weekly')
  const [riskTolerance, setRiskTolerance] = useState('moderate')
  const [financialGoalFocus, setFinancialGoalFocus] = useState('balanced')

  // Security
  const [mfaEnabled, setMfaEnabled] = useState(false)

  const [plaidConnecting, setPlaidConnecting] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 900))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleConnectBank = async () => {
    setPlaidConnecting(true)
    // In production: call /api/plaid/create-link-token, then open Plaid Link
    await new Promise(r => setTimeout(r, 1500))
    setPlaidConnecting(false)
    alert('Plaid Link would open here. Add PLAID_CLIENT_ID and PLAID_SECRET to .env.local to enable real bank connections.')
  }

  const inp: React.CSSProperties = {
    padding: '9px 12px', borderRadius: '8px', border: '1px solid #e5eaed',
    fontSize: '14px', fontFamily: 'DM Sans, sans-serif', color: '#111820', outline: 'none',
    background: '#f8fafb',
  }

  return (
    <div style={{ maxWidth: '780px' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em', color: '#111820', marginBottom: '4px' }}>Settings</h1>
        <p style={{ color: '#9aaab4', fontSize: '14px' }}>Manage your account, AI preferences, and security</p>
      </div>

      {saved && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '10px 16px', marginBottom: '1rem', fontSize: '13px', color: '#15803d', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ✓ Changes saved successfully
        </div>
      )}

      <div style={{ display: 'flex', gap: '16px' }}>
        {/* Sidebar nav */}
        <div style={{ width: '160px', flexShrink: 0 }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 12px', borderRadius: '8px', border: 'none', textAlign: 'left',
              background: activeTab === tab.id ? '#f0fdf9' : 'transparent',
              color: activeTab === tab.id ? '#0f766e' : '#627282',
              fontSize: '13px', fontWeight: activeTab === tab.id ? 500 : 400,
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              marginBottom: '2px', transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: '15px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>

          {/* ── Profile ─────────────────────────── */}
          {activeTab === 'profile' && (
            <div>
              {/* Avatar */}
              <div style={{ background: 'white', border: '1px solid #e5eaed', borderRadius: '14px', padding: '1.4rem', marginBottom: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #14b8a6, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: '#042f2e', flexShrink: 0 }}>
                  A
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '16px', color: '#111820' }}>{name}</div>
                  <div style={{ fontSize: '13px', color: '#9aaab4' }}>{email}</div>
                  <button style={{ marginTop: '6px', fontSize: '12px', color: '#14b8a6', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                    Change photo
                  </button>
                </div>
              </div>

              <Section title="Personal information">
                <SettingRow label="Full name" description="Your display name across the app">
                  <input value={name} onChange={e => setName(e.target.value)} style={{ ...inp, width: '200px' }} />
                </SettingRow>
                <SettingRow label="Email address" description="Used for login and notifications">
                  <div style={{ fontSize: '14px', color: '#627282' }}>{email}</div>
                </SettingRow>
                <SettingRow label="Monthly income" description="Helps AI give more accurate advice">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '14px', color: '#9aaab4' }}>$</span>
                    <input type="number" value={monthlyIncome} onChange={e => setMonthlyIncome(e.target.value)} style={{ ...inp, width: '120px' }} />
                  </div>
                </SettingRow>
              </Section>

              <Section title="Regional settings">
                <SettingRow label="Currency" description="Your primary currency for display">
                  <select value={currency} onChange={e => setCurrency(e.target.value)} style={inp}>
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </SettingRow>
                <SettingRow label="Timezone" description="For cashflow and bill reminders">
                  <select value={timezone} onChange={e => setTimezone(e.target.value)} style={{ ...inp, width: '200px' }}>
                    <option value="America/New_York">Eastern (ET)</option>
                    <option value="America/Chicago">Central (CT)</option>
                    <option value="America/Denver">Mountain (MT)</option>
                    <option value="America/Los_Angeles">Pacific (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Asia/Kathmandu">Kathmandu (NPT)</option>
                    <option value="Asia/Kolkata">India (IST)</option>
                  </select>
                </SettingRow>
              </Section>

              <SaveBar onSave={handleSave} saving={saving} />
            </div>
          )}

          {/* ── Connected Accounts ─────────────── */}
          {activeTab === 'accounts' && (
            <div>
              <div style={{ background: '#f0fdf9', border: '1px solid #99f6df', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1rem', fontSize: '13px', color: '#0f766e', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '16px' }}>🔐</span>
                <div>
                  <strong>Read-only access</strong> — FlowAI uses Plaid to securely read your transactions and balances. We never store your bank credentials and cannot move money.
                </div>
              </div>

              <Section title="Connected banks">
                {MOCK_ACCOUNTS.slice(0, 3).map(acc => (
                  <SettingRow key={acc.id} label={acc.name} description={`${acc.institution} · Last synced 2 hours ago`}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', padding: '2px 8px', background: '#f0fdf4', color: '#15803d', borderRadius: '100px', fontWeight: 500 }}>Connected</span>
                      <button style={{ fontSize: '12px', color: '#be123c', background: 'transparent', border: 'none', cursor: 'pointer' }}>Remove</button>
                    </div>
                  </SettingRow>
                ))}
                <div style={{ padding: '16px 0' }}>
                  <button onClick={handleConnectBank} disabled={plaidConnecting} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 18px', borderRadius: '10px', border: '1.5px dashed #e5eaed',
                    background: 'transparent', color: '#627282', fontSize: '14px', cursor: 'pointer',
                    transition: 'all 0.15s', fontFamily: 'DM Sans, sans-serif',
                  }}>
                    {plaidConnecting ? '⏳ Connecting...' : '+ Connect a bank account'}
                  </button>
                </div>
              </Section>

              <Section title="Manual accounts">
                {MOCK_ACCOUNTS.slice(3).map(acc => (
                  <SettingRow key={acc.id} label={acc.name} description={`${acc.institution ?? 'Manual'} · Updated manually`}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', padding: '2px 8px', background: '#f1f4f6', color: '#627282', borderRadius: '100px' }}>Manual</span>
                      <button style={{ fontSize: '12px', color: '#14b8a6', background: 'transparent', border: 'none', cursor: 'pointer' }}>Edit</button>
                    </div>
                  </SettingRow>
                ))}
              </Section>
            </div>
          )}

          {/* ── AI Settings ─────────────────────── */}
          {activeTab === 'ai' && (
            <div>
              <Section title="AI advisor configuration">
                <SettingRow label="AI model" description="Higher quality models give better advice">
                  <select value={aiModel} onChange={e => setAiModel(e.target.value)} style={inp}>
                    <option value="claude-sonnet-4-6">Claude Sonnet 4.6 (recommended)</option>
                    <option value="claude-haiku-4-5">Claude Haiku 4.5 (faster)</option>
                  </select>
                </SettingRow>
                <SettingRow label="Insight frequency" description="How often AI analyzes your finances">
                  <select value={insightFrequency} onChange={e => setInsightFrequency(e.target.value)} style={inp}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly (recommended)</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </SettingRow>
                <SettingRow label="Risk tolerance" description="Influences investment recommendations">
                  <select value={riskTolerance} onChange={e => setRiskTolerance(e.target.value)} style={inp}>
                    <option value="conservative">Conservative — Capital preservation</option>
                    <option value="moderate">Moderate — Balanced growth</option>
                    <option value="aggressive">Aggressive — Maximum growth</option>
                  </select>
                </SettingRow>
                <SettingRow label="Financial goal focus" description="What the AI prioritizes in advice">
                  <select value={financialGoalFocus} onChange={e => setFinancialGoalFocus(e.target.value)} style={inp}>
                    <option value="savings">Build savings</option>
                    <option value="debt">Pay off debt</option>
                    <option value="investing">Grow investments</option>
                    <option value="balanced">Balanced approach</option>
                    <option value="fire">FIRE (early retirement)</option>
                  </select>
                </SettingRow>
              </Section>

              <Section title="Data shared with AI">
                <SettingRow label="Transaction history" description="Required for spending analysis">
                  <span style={{ fontSize: '12px', color: '#15803d' }}>✓ Always shared</span>
                </SettingRow>
                <SettingRow label="Investment portfolio" description="For investment advice">
                  <Toggle checked={true} onChange={() => {}} />
                </SettingRow>
                <SettingRow label="Goals & targets" description="For goal-based recommendations">
                  <Toggle checked={true} onChange={() => {}} />
                </SettingRow>
                <SettingRow label="Income information" description="For budget recommendations">
                  <Toggle checked={true} onChange={() => {}} />
                </SettingRow>
              </Section>

              <div style={{ background: '#f8fafb', border: '1px solid #e5eaed', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1rem', fontSize: '12px', color: '#627282', lineHeight: 1.6 }}>
                <strong style={{ color: '#111820' }}>Privacy note:</strong> Your financial data is sent to Anthropic&apos;s Claude API for AI analysis. Data is processed per Anthropic&apos;s privacy policy and is not used for model training. Only summary snapshots are sent — not raw transaction data.
              </div>

              <SaveBar onSave={handleSave} saving={saving} />
            </div>
          )}

          {/* ── Notifications ───────────────────── */}
          {activeTab === 'notifications' && (
            <div>
              <Section title="Email notifications">
                <SettingRow label="Weekly AI digest" description="Summary of spending, savings, and top insights every Monday">
                  <Toggle checked={weeklyDigest} onChange={setWeeklyDigest} />
                </SettingRow>
                <SettingRow label="Budget alerts" description="When you reach 80% or 100% of a budget">
                  <Toggle checked={budgetAlerts} onChange={setBudgetAlerts} />
                </SettingRow>
                <SettingRow label="New AI insights" description="When Claude generates a new high-priority insight">
                  <Toggle checked={aiInsights} onChange={setAiInsights} />
                </SettingRow>
                <SettingRow label="Large transactions" description="Alert for transactions over $500">
                  <Toggle checked={largeTransactions} onChange={setLargeTransactions} />
                </SettingRow>
                <SettingRow label="Goal milestones" description="When you hit 25%, 50%, 75%, 100% of a goal">
                  <Toggle checked={goalMilestones} onChange={setGoalMilestones} />
                </SettingRow>
              </Section>

              <Section title="Alert thresholds">
                <SettingRow label="Large transaction threshold" description="Alert me when a single transaction exceeds this amount">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '14px', color: '#9aaab4' }}>$</span>
                    <input type="number" defaultValue={500} style={{ ...inp, width: '100px' }} />
                  </div>
                </SettingRow>
                <SettingRow label="Low balance warning" description="Alert when any account drops below this amount">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '14px', color: '#9aaab4' }}>$</span>
                    <input type="number" defaultValue={500} style={{ ...inp, width: '100px' }} />
                  </div>
                </SettingRow>
              </Section>

              <SaveBar onSave={handleSave} saving={saving} />
            </div>
          )}

          {/* ── Security ────────────────────────── */}
          {activeTab === 'security' && (
            <div>
              <Section title="Authentication">
                <SettingRow label="Password" description="Last changed 3 months ago">
                  <button style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #e5eaed', background: 'transparent', color: '#627282', fontSize: '13px', cursor: 'pointer' }}>
                    Change password
                  </button>
                </SettingRow>
                <SettingRow label="Two-factor authentication" description="Add an extra layer of security with an authenticator app">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {!mfaEnabled && <span style={{ fontSize: '11px', color: '#b45309', background: '#fffbeb', padding: '2px 7px', borderRadius: '4px' }}>Recommended</span>}
                    <Toggle checked={mfaEnabled} onChange={setMfaEnabled} />
                  </div>
                </SettingRow>
                <SettingRow label="Active sessions" description="Devices currently logged into your account">
                  <button style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #e5eaed', background: 'transparent', color: '#627282', fontSize: '13px', cursor: 'pointer' }}>
                    View sessions
                  </button>
                </SettingRow>
              </Section>

              <Section title="Data & privacy">
                <SettingRow label="Export my data" description="Download all your transactions, budgets, and settings as CSV">
                  <button style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #e5eaed', background: 'transparent', color: '#627282', fontSize: '13px', cursor: 'pointer' }}>
                    Export CSV
                  </button>
                </SettingRow>
                <SettingRow label="Delete account" description="Permanently delete your account and all associated data">
                  <button style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #fecdd3', background: '#fff1f2', color: '#be123c', fontSize: '13px', cursor: 'pointer' }}>
                    Delete account
                  </button>
                </SettingRow>
              </Section>
            </div>
          )}

          {/* ── Billing ─────────────────────────── */}
          {activeTab === 'billing' && (
            <div>
              {/* Current plan */}
              <div style={{ background: 'linear-gradient(135deg, #f0fdf9, #e1f5ee)', border: '1px solid #99f6df', borderRadius: '14px', padding: '1.4rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f766e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Current plan</div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '24px', color: '#111820', letterSpacing: '-0.03em' }}>Pro</div>
                    <div style={{ fontSize: '14px', color: '#627282', marginTop: '2px' }}>$8/month · Next billing Dec 1, 2024</div>
                  </div>
                  <span style={{ fontSize: '11px', padding: '4px 10px', background: '#14b8a6', color: '#042f2e', borderRadius: '100px', fontWeight: 600 }}>Active</span>
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '16px', fontSize: '12px', color: '#627282' }}>
                  <span>✓ Unlimited AI advisor chat</span>
                  <span>✓ Bank sync via Plaid</span>
                  <span>✓ Weekly AI digest</span>
                </div>
              </div>

              <Section title="Billing details">
                <SettingRow label="Payment method" description="Visa ending in 4242">
                  <button style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #e5eaed', background: 'transparent', color: '#627282', fontSize: '13px', cursor: 'pointer' }}>
                    Update
                  </button>
                </SettingRow>
                <SettingRow label="Billing email" description="alex@example.com">
                  <button style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #e5eaed', background: 'transparent', color: '#627282', fontSize: '13px', cursor: 'pointer' }}>
                    Change
                  </button>
                </SettingRow>
              </Section>

              <Section title="Billing history">
                {[
                  { date: 'Nov 1, 2024', amount: '$8.00', status: 'Paid' },
                  { date: 'Oct 1, 2024', amount: '$8.00', status: 'Paid' },
                  { date: 'Sep 1, 2024', amount: '$8.00', status: 'Paid' },
                ].map((inv) => (
                  <SettingRow key={inv.date} label={inv.date} description={inv.amount}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', padding: '2px 7px', background: '#f0fdf4', color: '#15803d', borderRadius: '4px' }}>{inv.status}</span>
                      <button style={{ fontSize: '12px', color: '#14b8a6', background: 'transparent', border: 'none', cursor: 'pointer' }}>Download</button>
                    </div>
                  </SettingRow>
                ))}
              </Section>

              <div style={{ textAlign: 'right' }}>
                <button style={{ fontSize: '13px', color: '#be123c', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  Cancel subscription
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
