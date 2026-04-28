'use client'
import { useState, useMemo } from 'react'
import { MOCK_TRANSACTIONS, MOCK_CATEGORIES, MOCK_ACCOUNTS } from '@/lib/mock-data'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { getIcon } from '@/lib/icon-map'
import type { Transaction, TransactionType } from '@/types'

const TYPE_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expenses' },
  { value: 'transfer', label: 'Transfers' },
]

function AddTransactionModal({ onClose, onAdd }: { onClose: () => void; onAdd: (tx: Partial<Transaction>) => void }) {
  const [form, setForm] = useState({
    description: '', merchant: '', amount: '', type: 'expense' as TransactionType,
    category_id: 'cat-2', account_id: 'acc-1', date: new Date().toISOString().split('T')[0],
    is_recurring: false, notes: '',
  })

  const handleSubmit = () => {
    if (!form.description || !form.amount) return
    onAdd({
      ...form,
      amount: parseFloat(form.amount),
      id: `tx-${Date.now()}`,
      user_id: 'user-1',
      created_at: new Date().toISOString(),
      category: MOCK_CATEGORIES.find(c => c.id === form.category_id),
      account: MOCK_ACCOUNTS.find(a => a.id === form.account_id),
    })
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div style={{ background: 'white', borderRadius: '18px', padding: '1.75rem', width: '460px', maxWidth: '95vw', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '18px', color: '#111820' }}>Add Transaction</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '20px', color: '#9aaab4', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        {/* Type selector */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
          {(['income', 'expense', 'transfer'] as TransactionType[]).map(t => (
            <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))} style={{
              flex: 1, padding: '8px', borderRadius: '8px', border: '1.5px solid',
              borderColor: form.type === t ? (t === 'income' ? '#16a34a' : t === 'expense' ? '#ef4444' : '#9333ea') : '#e9d5ff',
              background: form.type === t ? (t === 'income' ? '#f0fdf4' : t === 'expense' ? '#fef2f2' : '#f3e8ff') : 'transparent',
              color: form.type === t ? (t === 'income' ? '#16a34a' : t === 'expense' ? '#ef4444' : '#9333ea') : '#9aaab4',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s',
            }}>
              {t}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={{ fontSize: '12px', color: '#627282', fontWeight: 500, display: 'block', marginBottom: '5px' }}>Description *</label>
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. Grocery run" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#627282', fontWeight: 500, display: 'block', marginBottom: '5px' }}>Amount *</label>
            <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" style={{ ...inputStyle, fontVariantNumeric: 'tabular-nums' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#627282', fontWeight: 500, display: 'block', marginBottom: '5px' }}>Date</label>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#627282', fontWeight: 500, display: 'block', marginBottom: '5px' }}>Category</label>
            <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} style={inputStyle}>
              {MOCK_CATEGORIES.filter(c => c.type === (form.type === 'income' ? 'income' : 'expense')).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#627282', fontWeight: 500, display: 'block', marginBottom: '5px' }}>Account</label>
            <select value={form.account_id} onChange={e => setForm(f => ({ ...f, account_id: e.target.value }))} style={inputStyle}>
              {MOCK_ACCOUNTS.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#627282', fontWeight: 500, display: 'block', marginBottom: '5px' }}>Merchant</label>
            <input value={form.merchant} onChange={e => setForm(f => ({ ...f, merchant: e.target.value }))} placeholder="Optional" style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
          <input type="checkbox" id="recurring" checked={form.is_recurring} onChange={e => setForm(f => ({ ...f, is_recurring: e.target.checked }))} style={{ width: '16px', height: '16px', accentColor: '#14b8a6' }} />
          <label htmlFor="recurring" style={{ fontSize: '13px', color: '#627282', cursor: 'pointer' }}>This is a recurring transaction</label>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #e5eaed', background: 'transparent', color: '#627282', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSubmit} style={{ flex: 2, padding: '10px', borderRadius: '10px', background: '#14b8a6', border: 'none', color: '#042f2e', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Add Transaction
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

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)
  const [typeFilter, setTypeFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [sortField, setSortField] = useState<'date' | 'amount'>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const filtered = useMemo(() => {
    let txs = [...transactions]
    if (typeFilter !== 'all') txs = txs.filter(t => t.type === typeFilter)
    if (search) {
      const s = search.toLowerCase()
      txs = txs.filter(t =>
        t.merchant?.toLowerCase().includes(s) ||
        t.description.toLowerCase().includes(s) ||
        t.category?.name.toLowerCase().includes(s)
      )
    }
    txs.sort((a, b) => {
      if (sortField === 'date') {
        const diff = new Date(b.date).getTime() - new Date(a.date).getTime()
        return sortDir === 'desc' ? diff : -diff
      }
      const diff = b.amount - a.amount
      return sortDir === 'desc' ? diff : -diff
    })
    return txs
  }, [transactions, typeFilter, search, sortField, sortDir])

  const totalIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpenses = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  const handleAdd = (tx: Partial<Transaction>) => {
    setTransactions(prev => [tx as Transaction, ...prev])
  }

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortField === field) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortField(field); setSortDir('desc') }
  }

  return (
    <div style={{ maxWidth: '1000px' }}>
      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em', color: '#111820', marginBottom: '4px' }}>Transactions</h1>
          <p style={{ color: '#9aaab4', fontSize: '14px' }}>{filtered.length} transactions</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{
            padding: '10px 20px', background: '#9333ea', border: 'none', borderRadius: '10px',
            color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
          transition: 'all 0.15s',
        }}>
          + Add Transaction
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.25rem' }}>
        {[
          { label: 'Total Income', value: totalIncome, color: '#15803d', bg: '#f0fdf4', icon: '↑' },
          { label: 'Total Expenses', value: totalExpenses, color: '#be123c', bg: '#fff1f2', icon: '↓' },
          { label: 'Net', value: totalIncome - totalExpenses, color: totalIncome - totalExpenses >= 0 ? '#15803d' : '#be123c', bg: totalIncome - totalExpenses >= 0 ? '#f0fdf4' : '#fff1f2', icon: '=' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', border: '1px solid #e5eaed', borderRadius: '12px', padding: '1rem 1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '12px', color: '#9aaab4', marginBottom: '6px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: s.color, fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}>
              {s.value >= 0 ? '' : '-'}{formatCurrency(Math.abs(s.value))}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ background: 'white', border: '1px solid #e5eaed', borderRadius: '14px', padding: '1rem 1.25rem', marginBottom: '12px', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9aaab4', fontSize: '14px' }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search transactions..."
            style={{ ...inputStyle, paddingLeft: '36px', width: '100%' }}
          />
        </div>

        {/* Type filters */}
        <div style={{ display: 'flex', gap: '4px', background: '#f1f4f6', borderRadius: '8px', padding: '3px' }}>
          {TYPE_FILTERS.map(f => (
            <button key={f.value} onClick={() => setTypeFilter(f.value)} style={{
              padding: '5px 12px', borderRadius: '6px', border: 'none', fontSize: '13px',
              background: typeFilter === f.value ? 'white' : 'transparent',
              color: typeFilter === f.value ? '#111820' : '#9aaab4',
              fontWeight: typeFilter === f.value ? 500 : 400,
              cursor: 'pointer', boxShadow: typeFilter === f.value ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s',
            }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'white', border: '1px solid #e5eaed', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr auto', gap: '1rem', padding: '12px 1.25rem', borderBottom: '1px solid #f1f4f6', background: '#f8fafb' }}>
          {[
            { label: 'Transaction', field: null },
            { label: 'Category', field: null },
            { label: 'Date', field: 'date' as const },
            { label: 'Amount', field: 'amount' as const },
            { label: '', field: null },
          ].map((col, i) => (
            <div key={i}
              onClick={col.field ? () => toggleSort(col.field!) : undefined}
              style={{ fontSize: '11px', fontWeight: 600, color: '#9aaab4', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: col.field ? 'pointer' : 'default', userSelect: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {col.label}
              {col.field && sortField === col.field && (
                <span>{sortDir === 'desc' ? '↓' : '↑'}</span>
              )}
            </div>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#9aaab4' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
            <div style={{ fontSize: '14px' }}>No transactions found</div>
          </div>
        ) : (
          filtered.map((tx, i) => (
            <div key={tx.id} style={{
              display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr auto', gap: '1rem',
              padding: '12px 1.25rem', alignItems: 'center',
              borderBottom: i < filtered.length - 1 ? '1px solid #f8fafb' : 'none',
              transition: 'background 0.1s',
              cursor: 'pointer',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fafbfc' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>

              {/* Transaction info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: (tx.category?.color ?? '#9aaab4') + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>
                  {(() => {
                    const Icon = getIcon(tx.category?.icon) || getIcon('dollarSign')
                    return Icon ? <Icon size={18} /> : null
                  })()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#111820', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {tx.merchant || tx.description}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9aaab4' }}>
                    {tx.description !== tx.merchant ? tx.description : tx.account?.name}
                    {tx.is_recurring && <span style={{ marginLeft: '5px', color: '#14b8a6' }}>↺ recurring</span>}
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '3px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: 500,
                  background: (tx.category?.color ?? '#9aaab4') + '18',
                  color: tx.category?.color ?? '#9aaab4',
                }}>
                  {(() => {
                    const Icon = getIcon(tx.category?.icon)
                    return Icon ? <Icon size={12} /> : null
                  })()}
                  {tx.category?.name ?? 'Uncategorized'}
                </span>
              </div>

              {/* Date */}
              <div style={{ fontSize: '13px', color: '#627282' }}>{formatDate(tx.date, 'MMM d')}</div>

              {/* Amount */}
              <div style={{ fontSize: '13px', fontWeight: 600, color: tx.type === 'income' ? '#15803d' : '#111820', fontVariantNumeric: 'tabular-nums' }}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </div>

              {/* Actions */}
              <div>
                <button style={{ background: 'transparent', border: 'none', color: '#d1d9de', cursor: 'pointer', fontSize: '16px', padding: '4px', borderRadius: '4px', transition: 'color 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget).style.color = '#f43f5e' }}
                  onMouseLeave={e => { (e.currentTarget).style.color = '#d1d9de' }}>
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '12px', color: '#d1d9de' }}>
        Showing {filtered.length} of {transactions.length} transactions
      </div>
    </div>
  )
}
