'use client'
import { useState } from 'react'
import { getIcon } from '@/lib/icon-map'
import { MOCK_ACCOUNTS } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Account, AccountType } from '@/types'

const TYPE_CONFIG: Record<AccountType, { icon: string; label: string; color: string }> = {
  checking:   { icon: 'building', label: 'Checking',   color: '#9333ea' },
  savings:    { icon: 'building', label: 'Savings',    color: '#16a34a' },
  investment: { icon: 'trendingUp', label: 'Investment', color: '#0ea5e9' },
  credit:     { icon: 'creditCard', label: 'Credit',     color: '#f59e0b' },
  loan:       { icon: 'home', label: 'Loan',       color: '#ef4444' },
  cash:       { icon: '💵', label: 'Cash',       color: '#9aaab4' },
}

function AccountCard({ account, onEdit }: { account: Account; onEdit: (a: Account) => void }) {
  const cfg = TYPE_CONFIG[account.type]
  const isLiability = account.type === 'credit' || account.type === 'loan'

  return (
    <div style={{
      background: 'white', border: '1px solid #e5eaed', borderRadius: '14px',
      padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      display: 'flex', flexDirection: 'column', gap: '12px',
      transition: 'all 0.15s', cursor: 'pointer',
    }}
      onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)' }}
      onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)' }}
      onClick={() => onEdit(account)}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: cfg.color + '18',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
          }}>
            {(() => {
              const Icon = getIcon(cfg.icon)
              return Icon ? <Icon size={18} /> : null
            })()}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#111820' }}>{account.name}</div>
            <div style={{ fontSize: '12px', color: '#9aaab4' }}>{account.institution}</div>
          </div>
        </div>
        <span style={{
          fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px',
          background: cfg.color + '18', color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          {cfg.label}
        </span>
      </div>

      {/* Balance */}
      <div>
        <div style={{ fontSize: '11px', color: '#9aaab4', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
          {isLiability ? 'Balance owed' : 'Current balance'}
        </div>
        <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'Syne, sans-serif', letterSpacing: '-0.03em', color: isLiability ? '#be123c' : '#111820' }}>
          {isLiability ? '-' : ''}{formatCurrency(account.balance)}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f4f6', paddingTop: '10px' }}>
        <div style={{ fontSize: '11px', color: '#9aaab4' }}>
          {account.plaid_account_id ? '🔗 Auto-synced' : '✏️ Manual'}
        </div>
        {account.last_synced && (
          <div style={{ fontSize: '11px', color: '#9aaab4' }}>
            Updated {formatDate(account.last_synced, 'MMM d')}
          </div>
        )}
      </div>
    </div>
  )
}

function AddAccountModal({ onClose, onAdd }: { onClose: () => void; onAdd: (a: Account) => void }) {
  const [form, setForm] = useState({ name: '', type: 'checking' as AccountType, institution: '', balance: '' })

  const inp: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5eaed',
    fontSize: '14px', fontFamily: 'DM Sans, sans-serif', color: '#111820',
    outline: 'none', background: '#f8fafb', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  }

  const handleSubmit = () => {
    if (!form.name || !form.balance) return
    const cfg = TYPE_CONFIG[form.type]
    onAdd({
      id: `acc-${Date.now()}`,
      user_id: 'user-1',
      name: form.name,
      type: form.type,
      institution: form.institution || undefined,
      balance: parseFloat(form.balance.replace(/,/g, '')),
      currency: 'USD',
      color: cfg.color,
      icon: cfg.icon,
      is_active: true,
      created_at: new Date().toISOString(),
    })
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div style={{ background: 'white', borderRadius: '18px', padding: '1.75rem', width: '400px', maxWidth: '95vw', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '18px', color: '#111820' }}>Add Account</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '20px', color: '#9aaab4', cursor: 'pointer' }}>×</button>
        </div>

        {/* Type selector */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '12px', fontWeight: 500, color: '#627282', display: 'block', marginBottom: '6px' }}>Account type</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {(Object.entries(TYPE_CONFIG) as [AccountType, typeof TYPE_CONFIG[AccountType]][]).map(([type, cfg]) => (
              <button key={type} onClick={() => setForm(f => ({ ...f, type }))} style={{
                padding: '8px 4px', borderRadius: '8px', border: '1.5px solid',
                borderColor: form.type === type ? cfg.color : '#e9d5ff',
                background: form.type === type ? cfg.color + '12' : 'transparent',
                cursor: 'pointer', fontSize: '11px', fontWeight: 500,
                color: form.type === type ? cfg.color : '#9aaab4',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: '18px' }}>
                  {(() => {
                    const Icon = getIcon(cfg.icon)
                    return Icon ? <Icon size={18} /> : null
                  })()}
                </span>
                {cfg.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500, color: '#627282', display: 'block', marginBottom: '5px' }}>Account name *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Chase Checking" style={inp}
              onFocus={e => { e.currentTarget.style.borderColor = '#14b8a6'; e.currentTarget.style.background = 'white' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e5eaed'; e.currentTarget.style.background = '#f8fafb' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500, color: '#627282', display: 'block', marginBottom: '5px' }}>Institution</label>
            <input value={form.institution} onChange={e => setForm(f => ({ ...f, institution: e.target.value }))} placeholder="e.g. Chase Bank" style={inp}
              onFocus={e => { e.currentTarget.style.borderColor = '#14b8a6'; e.currentTarget.style.background = 'white' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e5eaed'; e.currentTarget.style.background = '#f8fafb' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500, color: '#627282', display: 'block', marginBottom: '5px' }}>Current balance *</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9aaab4' }}>$</span>
              <input type="text" value={form.balance} onChange={e => setForm(f => ({ ...f, balance: e.target.value }))} placeholder="0.00"
                style={{ ...inp, paddingLeft: '24px' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#14b8a6'; e.currentTarget.style.background = 'white' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#e5eaed'; e.currentTarget.style.background = '#f8fafb' }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #e5eaed', background: 'transparent', color: '#627282', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSubmit} style={{ flex: 2, padding: '10px', borderRadius: '10px', background: '#14b8a6', border: 'none', color: '#042f2e', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Add Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS)
  const [showModal, setShowModal] = useState(false)
  const [editAccount, setEditAccount] = useState<Account | null>(null)

  const assets = accounts.filter(a => !['credit', 'loan'].includes(a.type))
  const liabilities = accounts.filter(a => ['credit', 'loan'].includes(a.type))
  const totalAssets = assets.reduce((s, a) => s + a.balance, 0)
  const totalLiabilities = liabilities.reduce((s, a) => s + a.balance, 0)
  const netWorth = totalAssets - totalLiabilities

  return (
    <div style={{ maxWidth: '960px' }}>
      {showModal && <AddAccountModal onClose={() => setShowModal(false)} onAdd={a => setAccounts(p => [...p, a])} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em', color: '#111820', marginBottom: '4px' }}>Accounts</h1>
          <p style={{ color: '#9aaab4', fontSize: '14px' }}>{accounts.length} accounts · Net worth {formatCurrency(netWorth)}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #e5eaed', background: 'white', color: '#627282', fontSize: '14px', cursor: 'pointer' }}>
            🔗 Connect bank
          </button>
          <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', background: '#14b8a6', border: 'none', borderRadius: '10px', color: '#042f2e', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            + Add manual
          </button>
        </div>
      </div>

      {/* Net worth summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total assets', value: totalAssets, color: '#15803d' },
          { label: 'Total liabilities', value: totalLiabilities, color: '#be123c', neg: true },
          { label: 'Net worth', value: netWorth, color: netWorth >= 0 ? '#15803d' : '#be123c' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', border: '1px solid #e5eaed', borderRadius: '12px', padding: '1rem 1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '11px', color: '#9aaab4', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{s.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: s.color, fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}>
              {s.neg ? '-' : ''}{formatCurrency(s.value)}
            </div>
          </div>
        ))}
      </div>

      {/* Assets */}
      {assets.length > 0 && (
        <>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#9aaab4', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
            Assets — {formatCurrency(totalAssets)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px', marginBottom: '1.5rem' }}>
            {assets.map(acc => <AccountCard key={acc.id} account={acc} onEdit={setEditAccount} />)}
          </div>
        </>
      )}

      {/* Liabilities */}
      {liabilities.length > 0 && (
        <>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#9aaab4', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
            Liabilities — {formatCurrency(totalLiabilities)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
            {liabilities.map(acc => <AccountCard key={acc.id} account={acc} onEdit={setEditAccount} />)}
          </div>
        </>
      )}
    </div>
  )
}
