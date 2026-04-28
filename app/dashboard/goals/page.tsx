'use client'
import { useState } from 'react'
import { MOCK_GOALS } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Goal } from '@/types'

function GoalCard({ goal }: { goal: Goal }) {
  const pct = goal.progress_percent ?? 0
  const monthsLeft = goal.months_remaining ?? 0
  const isCompleted = pct >= 100

  const COLOR_MAP: Record<string, { bg: string; bar: string; text: string }> = {
    emergency: { bg: '#f0fdf4', bar: '#22c55e', text: '#15803d' },
    vacation:  { bg: '#f0fdf9', bar: '#14b8a6', text: '#0f766e' },
    house:     { bg: '#eff6ff', bar: '#6366f1', text: '#4338ca' },
    retirement:{ bg: '#fdf4ff', bar: '#a855f7', text: '#7e22ce' },
    education: { bg: '#fff7ed', bar: '#f97316', text: '#c2410c' },
    car:       { bg: '#fefce8', bar: '#eab308', text: '#a16207' },
    other:     { bg: '#f8fafb', bar: '#9aaab4', text: '#465662' },
  }
  const c = COLOR_MAP[goal.category] ?? COLOR_MAP.other

  return (
    <div style={{ background: 'white', border: '1px solid #e5eaed', borderRadius: '16px', padding: '1.4rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)' }}>

      {/* Icon & name */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
            {goal.icon}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '15px', color: '#111820' }}>{goal.name}</div>
            {goal.target_date && (
              <div style={{ fontSize: '12px', color: '#9aaab4' }}>Target: {formatDate(goal.target_date, 'MMM yyyy')}</div>
            )}
          </div>
        </div>
        {isCompleted && (
          <span style={{ fontSize: '12px', padding: '3px 10px', background: '#f0fdf4', color: '#15803d', borderRadius: '100px', fontWeight: 600 }}>
            Complete ✓
          </span>
        )}
      </div>

      {/* Progress */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '24px', fontWeight: 700, color: '#111820', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}>
            {formatCurrency(goal.current_amount)}
          </span>
          <span style={{ fontSize: '14px', color: '#9aaab4', alignSelf: 'flex-end' }}>
            of {formatCurrency(goal.target_amount)}
          </span>
        </div>
        <div style={{ height: '8px', background: '#f1f4f6', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: '4px',
            background: c.bar,
            width: `${Math.min(pct, 100)}%`,
            transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: c.text }}>{pct.toFixed(0)}% saved</span>
          <span style={{ fontSize: '12px', color: '#9aaab4' }}>{formatCurrency(goal.target_amount - goal.current_amount)} to go</span>
        </div>
      </div>

      {/* Monthly target */}
      {!isCompleted && goal.monthly_needed && (
        <div style={{ background: c.bg, borderRadius: '8px', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#9aaab4' }}>Monthly savings needed</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: c.text }}>{formatCurrency(goal.monthly_needed)}/mo</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#9aaab4' }}>Time remaining</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: c.text }}>{monthsLeft} months</div>
          </div>
        </div>
      )}
    </div>
  )
}

function NewGoalModal({ onClose, onAdd }: { onClose: () => void; onAdd: (g: Goal) => void }) {
  const [form, setForm] = useState({
    name: '', target_amount: '', current_amount: '0', target_date: '',
    category: 'other' as Goal['category'], icon: 'target',
  })

  const GOAL_CATEGORIES = [
    { value: 'emergency', label: '🛡️ Emergency Fund', icon: '🛡️' },
    { value: 'vacation',  label: '✈️ Vacation',       icon: '✈️' },
    { value: 'house',     label: '🏡 House',           icon: '🏡' },
    { value: 'retirement',label: '🏖️ Retirement',     icon: '🏖️' },
    { value: 'education', label: '📚 Education',       icon: '📚' },
    { value: 'car',       label: '🚗 Car',             icon: '🚗' },
    { value: 'other',     label: 'Other',           icon: 'target' },
  ]

  const handleSubmit = () => {
    if (!form.name || !form.target_amount) return
    const target = parseFloat(form.target_amount)
    const current = parseFloat(form.current_amount) || 0
    const selectedCat = GOAL_CATEGORIES.find(c => c.value === form.category)

    onAdd({
      id: `goal-${Date.now()}`,
      user_id: 'user-1',
      name: form.name,
      target_amount: target,
      current_amount: current,
      target_date: form.target_date,
      category: form.category,
      icon: selectedCat?.icon ?? 'target',
      color: '#14b8a6',
      progress_percent: (current / target) * 100,
      monthly_needed: form.target_date ? (target - current) / Math.max(1, Math.ceil((new Date(form.target_date).getTime() - Date.now()) / (30 * 24 * 60 * 60 * 1000))) : undefined,
    })
    onClose()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e5eaed',
    fontSize: '14px', fontFamily: 'DM Sans, sans-serif', color: '#111820', outline: 'none',
    background: '#f8fafb', boxSizing: 'border-box',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div style={{ background: 'white', borderRadius: '18px', padding: '1.75rem', width: '420px', maxWidth: '95vw', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '18px', color: '#111820' }}>New Goal</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '20px', color: '#9aaab4', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#627282', fontWeight: 500, display: 'block', marginBottom: '5px' }}>Goal Category</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {GOAL_CATEGORIES.map(cat => (
                <button key={cat.value} onClick={() => setForm(f => ({ ...f, category: cat.value as Goal['category'], icon: cat.icon }))} style={{
                  padding: '8px 4px', borderRadius: '8px', border: '1.5px solid',
                  borderColor: form.category === cat.value ? '#14b8a6' : '#e5eaed',
                  background: form.category === cat.value ? '#f0fdf9' : 'transparent',
                  cursor: 'pointer', fontSize: '18px', lineHeight: 1, transition: 'all 0.15s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                }}>
                  {cat.icon}
                  <span style={{ fontSize: '9px', color: form.category === cat.value ? '#0f766e' : '#9aaab4' }}>
                    {cat.label.split(' ').slice(1).join(' ')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#627282', fontWeight: 500, display: 'block', marginBottom: '5px' }}>Goal Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Emergency Fund" style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#627282', fontWeight: 500, display: 'block', marginBottom: '5px' }}>Target Amount</label>
              <input type="number" value={form.target_amount} onChange={e => setForm(f => ({ ...f, target_amount: e.target.value }))} placeholder="30000" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#627282', fontWeight: 500, display: 'block', marginBottom: '5px' }}>Already Saved</label>
              <input type="number" value={form.current_amount} onChange={e => setForm(f => ({ ...f, current_amount: e.target.value }))} placeholder="0" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#627282', fontWeight: 500, display: 'block', marginBottom: '5px' }}>Target Date (optional)</label>
            <input type="date" value={form.target_date} onChange={e => setForm(f => ({ ...f, target_date: e.target.value }))} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #e5eaed', background: 'transparent', color: '#627282', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSubmit} style={{ flex: 2, padding: '10px', borderRadius: '10px', background: '#9333ea', border: 'none', color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Create Goal
          </button>
        </div>
      </div>
    </div>
  )
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS)
  const [showModal, setShowModal] = useState(false)

  const totalTargeted = goals.reduce((s, g) => s + g.target_amount, 0)
  const totalSaved = goals.reduce((s, g) => s + g.current_amount, 0)

  return (
    <div style={{ maxWidth: '960px' }}>
      {showModal && <NewGoalModal onClose={() => setShowModal(false)} onAdd={g => setGoals(prev => [...prev, g])} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em', color: '#111820', marginBottom: '4px' }}>Goals</h1>
          <p style={{ color: '#9aaab4', fontSize: '14px' }}>{goals.length} active goals · {formatCurrency(totalSaved)} saved of {formatCurrency(totalTargeted)}</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{
            padding: '10px 20px', background: '#9333ea', border: 'none', borderRadius: '10px',
            color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
        }}>
          + New Goal
        </button>
      </div>

      {/* AI suggestion */}
      <div style={{ background: '#f0fdf9', border: '1px solid #99f6df', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '12px' }}>
        <div style={{ fontSize: '20px' }}>✦</div>
        <div>
          <div style={{ fontWeight: 500, fontSize: '13px', color: '#111820', marginBottom: '4px' }}>AI Goal Optimization</div>
          <div style={{ fontSize: '12px', color: '#627282', lineHeight: 1.6 }}>
            You&apos;re $5,200 from completing your emergency fund — just 6 months away at current pace.
            Once complete, redirect the $868/month you&apos;re contributing to your emergency fund toward your Japan vacation goal.
            That would get you there by August 2025 instead of November 2025 — 3 months early!
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
        {goals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
      </div>
    </div>
  )
}
