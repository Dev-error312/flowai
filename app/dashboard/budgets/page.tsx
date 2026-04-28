'use client'
import { useState } from 'react'
import { MOCK_BUDGETS, MOCK_CATEGORIES } from '@/lib/mock-data'
import { formatCurrency, getBudgetColor } from '@/lib/utils'
import { getIcon } from '@/lib/icon-map'
import type { Budget } from '@/types'

function BudgetBar({ budget }: { budget: Budget }) {
  const pct = Math.min(budget.percent_used ?? 0, 100)
  const over = (budget.percent_used ?? 0) > 100
  const color = getBudgetColor(budget.percent_used ?? 0)

  return (
    <div style={{ background: 'white', border: `1px solid ${over ? '#fecdd3' : '#e5eaed'}`, borderRadius: '12px', padding: '1.1rem 1.25rem', boxShadow: over ? '0 0 0 1px #fecdd3' : '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: (budget.category?.color ?? '#9aaab4') + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
            {(() => {
              const Icon = getIcon(budget.category?.icon)
              return Icon ? <Icon size={18} /> : null
            })()}
          </div>
          <div>
            <div style={{ fontWeight: 500, fontSize: '14px', color: '#111820' }}>{budget.category?.name}</div>
            <div style={{ fontSize: '11px', color: '#9aaab4' }}>{budget.period}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 600, fontSize: '14px', color: over ? '#be123c' : '#111820', fontVariantNumeric: 'tabular-nums' }}>
            {formatCurrency(budget.spent ?? 0)}
            <span style={{ color: '#9aaab4', fontWeight: 400 }}> / {formatCurrency(budget.amount)}</span>
          </div>
          {over ? (
            <div style={{ fontSize: '11px', color: '#be123c', fontWeight: 500 }}>Over by {formatCurrency(Math.abs(budget.remaining ?? 0))}</div>
          ) : (
            <div style={{ fontSize: '11px', color: '#9aaab4' }}>{formatCurrency(budget.remaining ?? 0)} left</div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '6px', background: '#f1f4f6', borderRadius: '3px', overflow: 'hidden', marginBottom: '6px' }}>
        <div style={{
          height: '100%', borderRadius: '3px', background: color,
          width: `${pct}%`,
          transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9aaab4' }}>
        <span style={{ color: over ? '#be123c' : color, fontWeight: 500 }}>{(budget.percent_used ?? 0).toFixed(0)}% used</span>
        <span>Alert at {budget.alert_at_percent}%</span>
      </div>

      {over && (
        <div style={{ marginTop: '10px', padding: '8px 12px', background: '#fff1f2', borderRadius: '8px', fontSize: '12px', color: '#be123c', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
          <span>⚠</span>
          <span>Over budget by {formatCurrency(Math.abs(budget.remaining ?? 0))}. Consider pausing spending in this category until month-end.</span>
        </div>
      )}
    </div>
  )
}

function AddBudgetModal({ onClose, onAdd }: { onClose: () => void; onAdd: (b: Partial<Budget>) => void }) {
  const [form, setForm] = useState({ category_id: 'cat-4', amount: '', alert_at_percent: 80, rollover: false })

  const handleSubmit = () => {
    if (!form.amount) return
    const cat = MOCK_CATEGORIES.find(c => c.id === form.category_id)
    onAdd({
      id: `bud-${Date.now()}`,
      user_id: 'user-1',
      category_id: form.category_id,
      category: cat,
      amount: parseFloat(form.amount),
      period: 'monthly',
      alert_at_percent: form.alert_at_percent,
      rollover: form.rollover,
      month_year: '2024-11',
      spent: 0,
      remaining: parseFloat(form.amount),
      percent_used: 0,
    })
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div style={{ background: 'white', borderRadius: '18px', padding: '1.75rem', width: '400px', maxWidth: '95vw', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '18px', color: '#111820' }}>New Budget</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '20px', color: '#9aaab4', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Category</label>
            <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} style={inputStyle}>
              {MOCK_CATEGORIES.filter(c => c.type === 'expense').map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Monthly Budget Amount</label>
            <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="e.g. 500" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Alert me at {form.alert_at_percent}% used</label>
            <input type="range" min={50} max={100} value={form.alert_at_percent} onChange={e => setForm(f => ({ ...f, alert_at_percent: parseInt(e.target.value) }))} style={{ width: '100%', accentColor: '#14b8a6' }} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#627282' }}>
            <input type="checkbox" checked={form.rollover} onChange={e => setForm(f => ({ ...f, rollover: e.target.checked }))} style={{ accentColor: '#14b8a6' }} />
            Roll over unused budget to next month
          </label>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #e5eaed', background: 'transparent', color: '#627282', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSubmit} style={{ flex: 2, padding: '10px', borderRadius: '10px', background: '#9333ea', border: 'none', color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Create Budget
          </button>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e5eaed',
  fontSize: '14px', fontFamily: 'DM Sans, sans-serif', color: '#111820', outline: 'none',
  background: '#f8fafb', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  fontSize: '12px', color: '#627282', fontWeight: 500, display: 'block', marginBottom: '5px'
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>(MOCK_BUDGETS)
  const [showModal, setShowModal] = useState(false)

  const totalBudgeted = budgets.reduce((s, b) => s + b.amount, 0)
  const totalSpent = budgets.reduce((s, b) => s + (b.spent ?? 0), 0)
  const overCount = budgets.filter(b => (b.percent_used ?? 0) > 100).length
  const onTrackCount = budgets.filter(b => (b.percent_used ?? 0) <= 80).length

  const handleAdd = (b: Partial<Budget>) => {
    setBudgets(prev => [...prev, b as Budget])
  }

  return (
    <div style={{ maxWidth: '960px' }}>
      {showModal && <AddBudgetModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em', color: '#111820', marginBottom: '4px' }}>Budgets</h1>
          <p style={{ color: '#9aaab4', fontSize: '14px' }}>November 2024 · {budgets.length} categories</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          padding: '10px 20px', background: '#9333ea', border: 'none', borderRadius: '10px',
          color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
        }}>
          + New Budget
        </button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Budgeted', value: formatCurrency(totalBudgeted), sub: 'this month', color: '#111820' },
          { label: 'Total Spent', value: formatCurrency(totalSpent), sub: `${((totalSpent / totalBudgeted) * 100).toFixed(0)}% of budget`, color: '#111820' },
          { label: 'Remaining', value: formatCurrency(totalBudgeted - totalSpent), sub: 'across all categories', color: '#15803d' },
          { label: 'Status', value: overCount > 0 ? `${overCount} over budget` : `${onTrackCount} on track`, sub: overCount > 0 ? 'needs attention' : 'great job!', color: overCount > 0 ? '#be123c' : '#15803d' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', border: '1px solid #e5eaed', borderRadius: '12px', padding: '1rem 1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '11px', color: '#9aaab4', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{s.label}</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: s.color, fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: '#9aaab4', marginTop: '2px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Overall progress */}
      <div style={{ background: 'white', border: '1px solid #e5eaed', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#111820' }}>Overall budget usage</span>
          <span style={{ fontSize: '13px', color: '#627282' }}>{formatCurrency(totalSpent)} / {formatCurrency(totalBudgeted)}</span>
        </div>
        <div style={{ height: '8px', background: '#f1f4f6', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: '4px',
            background: 'linear-gradient(90deg, #14b8a6, #22c55e)',
            width: `${Math.min((totalSpent / totalBudgeted) * 100, 100)}%`,
            transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }} />
        </div>
        <div style={{ marginTop: '6px', fontSize: '11px', color: '#9aaab4', textAlign: 'right' }}>
          {((totalSpent / totalBudgeted) * 100).toFixed(0)}% of monthly budget used
        </div>
      </div>

      {/* AI Suggestion */}
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '20px' }}>✦</div>
        <div>
          <div style={{ fontWeight: 500, fontSize: '13px', color: '#111820', marginBottom: '4px' }}>AI Budget Insight</div>
          <div style={{ fontSize: '12px', color: '#627282', lineHeight: 1.6 }}>
            Your Shopping budget is overspent by $265 (188%). With 10 days left in November, I suggest pausing discretionary shopping.
            Your Food & Dining (81% used) is also approaching its limit. Together, these two categories account for $1,054 this month — 22% of your income.
          </div>
          <div style={{ fontSize: '12px', fontWeight: 500, color: '#b45309', marginTop: '6px' }}>
            → Redirect the next $265 in impulse purchases to your emergency fund instead.
          </div>
        </div>
      </div>

      {/* Budget grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '12px' }}>
        {budgets
          .sort((a, b) => (b.percent_used ?? 0) - (a.percent_used ?? 0))
          .map(budget => (
            <BudgetBar key={budget.id} budget={budget} />
          ))}
      </div>
    </div>
  )
}
