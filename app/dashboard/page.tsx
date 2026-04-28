'use client'
import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts'
import { MOCK_DASHBOARD, MOCK_SPENDING_TRENDS, MOCK_ACCOUNTS } from '@/lib/mock-data'
import { formatCurrency, formatPercent, formatDate, getBudgetColor } from '@/lib/utils'
import { getIcon } from '@/lib/icon-map'
import type { AIInsight } from '@/types'
import Link from 'next/link'

const SEVERITY_CONFIG = {
  positive: { bg: '#f0fdf4', border: '#dcfce7', icon: '●', color: '#16a34a' },
  info:     { bg: '#eff6ff', border: '#dbeafe', icon: 'ℹ', color: '#06b6d4' },
  warning:  { bg: '#fffbeb', border: '#fef3c7', icon: '⚠', color: '#f59e0b' },
  critical: { bg: '#fef2f2', border: '#fee2e2', icon: '●', color: '#ef4444' },
}

function InsightCard({ insight }: { insight: AIInsight }) {
  const cfg = SEVERITY_CONFIG[insight.severity]
  return (
    <div style={{
      background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: '12px',
      padding: '1rem 1.1rem', marginBottom: '10px',
      animation: 'slideUp 0.4s ease both',
    }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '16px', color: cfg.color, flexShrink: 0, marginTop: '2px' }}>
          {(() => {
            const Icon = getIcon(cfg.icon)
            return Icon ? <Icon size={16} /> : null
          })()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, fontSize: '13px', color: '#111820', marginBottom: '4px' }}>{insight.title}</div>
          <div style={{ fontSize: '12px', color: '#627282', lineHeight: 1.6, marginBottom: insight.action ? '8px' : 0 }}>{insight.body}</div>
          {insight.action && (
            <div style={{ fontSize: '12px', fontWeight: 500, color: cfg.color }}>→ {insight.action}</div>
          )}
        </div>
        {!insight.is_read && (
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: cfg.color, flexShrink: 0, marginTop: '6px' }} />
        )}
      </div>
    </div>
  )
}

function MetricCard({ label, value, change, changeLabel, color = '#9333ea', icon }: {
  label: string; value: string; change?: number; changeLabel?: string; color?: string; icon?: string
}) {
  const positive = (change ?? 0) >= 0
  return (
    <div style={{
      background: 'white', borderRadius: '16px', padding: '1.5rem',
      border: '1px solid #e9d5ff', flex: 1,
      boxShadow: '0 4px 12px rgba(147, 51, 234, 0.08)',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '11px', color: '#9370db', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
        {icon && (() => {
          const Icon = getIcon(icon)
          return Icon ? <div style={{ fontSize: '22px', opacity: 0.8 }}><Icon size={22} /></div> : null
        })()}
      </div>
      <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f0d1a', marginBottom: '0.6rem', letterSpacing: '-0.02em' }}>{value}</div>
      {change !== undefined && (
        <div style={{ fontSize: '12px', color: positive ? '#16a34a' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
          <span>{positive ? '↑' : '↓'}</span>
          <span>{Math.abs(change).toFixed(1)}% {changeLabel}</span>
        </div>
      )}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: Array<{value: number, dataKey: string, color: string}>, label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '12px', color: '#0f0d1a' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', fontSize: '13px', marginBottom: i < payload.length - 1 ? '4px' : 0 }}>
          <span style={{ color: '#5d4e7f', fontWeight: 500 }}>{p.dataKey}</span>
          <span style={{ fontWeight: 600, color: '#0f0d1a' }}>{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const data = MOCK_DASHBOARD
  const [showAllInsights, setShowAllInsights] = useState(false)

  const displayedInsights = showAllInsights ? data.active_insights : data.active_insights.slice(0, 2)
  const unreadCount = data.active_insights.filter(i => !i.is_read).length

  // Pie data for category breakdown
  const pieData = data.top_categories.map((c) => ({
    name: c.category.name,
    value: c.total,
    color: c.category.color,
  }))

  return (
    <div style={{ maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em', color: '#111820', marginBottom: '4px' }}>
          Good morning, Alex
        </h1>
        <p style={{ color: '#9aaab4', fontSize: '14px' }}>Here&apos;s your financial snapshot for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '1.25rem' }}>
        <MetricCard
          label="Net Worth"
          value={formatCurrency(data.net_worth, 'USD', true)}
          change={data.net_worth_change_percent}
          changeLabel="this month"
          icon="🏆"
        />
        <MetricCard
          label="Monthly Income"
          value={formatCurrency(data.monthly_income)}
          change={data.monthly_income_change / data.monthly_income * 100}
          changeLabel="vs last month"
          icon="�"
        />
        <MetricCard
          label="Monthly Expenses"
          value={formatCurrency(data.monthly_expenses)}
          change={-(data.monthly_expenses_change / data.monthly_expenses * 100)}
          changeLabel="vs last month"
          icon="💸"
        />
        <MetricCard
          label="Savings Rate"
          value={`${data.savings_rate.toFixed(1)}%`}
          change={4.2}
          changeLabel="vs last month"
          icon="✓"
        />
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '14px', marginBottom: '14px' }}>

        {/* Cash flow chart */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '1.4rem', border: '1px solid #e5eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#111820' }}>Income vs Expenses</div>
              <div style={{ fontSize: '12px', color: '#9aaab4' }}>Last 6 months</div>
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#627282' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#14b8a6', display: 'inline-block' }} /> Income
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#627282' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#f43f5e', display: 'inline-block' }} /> Expenses
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart id="bar-chart" data={MOCK_SPENDING_TRENDS} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f4f6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9aaab4' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9aaab4' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#fda4af" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insights */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '1.4rem', border: '1px solid #e5eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#111820', display: 'flex', alignItems: 'center', gap: '8px' }}>
                AI Insights
                {unreadCount > 0 && (
                  <span style={{ fontSize: '10px', padding: '1px 6px', background: '#fef3c7', color: '#b45309', borderRadius: '100px', fontWeight: 600 }}>
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div style={{ fontSize: '12px', color: '#9aaab4' }}>Powered by Claude</div>
            </div>
            <Link href="/dashboard/advisor" style={{ textDecoration: 'none', fontSize: '12px', color: '#14b8a6', fontWeight: 500 }}>
              Chat →
            </Link>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {displayedInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
          {data.active_insights.length > 2 && (
            <button onClick={() => setShowAllInsights(!showAllInsights)} style={{
              marginTop: '8px', padding: '8px', background: 'transparent', border: '1px solid #e5eaed',
              borderRadius: '8px', fontSize: '12px', color: '#627282', cursor: 'pointer', width: '100%',
              transition: 'all 0.15s',
            }}>
              {showAllInsights ? 'Show less' : `View all ${data.active_insights.length} insights`}
            </button>
          )}
        </div>
      </div>

      {/* Second row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 340px', gap: '14px', marginBottom: '14px' }}>

        {/* Cashflow forecast */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '1.4rem', border: '1px solid #e5eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#111820' }}>30-Day Cashflow Forecast</div>
            <div style={{ fontSize: '12px', color: '#9aaab4' }}>AI-powered prediction</div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart id="area-chart" data={data.cashflow_forecast.slice(0, 20)}>
              <defs>
                <linearGradient id="cfGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f4f6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9aaab4' }} axisLine={false} tickLine={false} tickFormatter={(v) => v.slice(8)} />
              <YAxis hide />
              <Tooltip formatter={(v: number) => formatCurrency(v)} labelFormatter={(l) => `Day ${l}`} />
              <Area type="monotone" dataKey="projected_balance" stroke="#14b8a6" strokeWidth={2} fill="url(#cfGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Spending by category */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '1.4rem', border: '1px solid #e5eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#111820' }}>Spending by Category</div>
            <div style={{ fontSize: '12px', color: '#9aaab4' }}>This month</div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <PieChart id="pie-chart" width={100} height={100}>
              <Pie data={pieData} cx={50} cy={50} innerRadius={28} outerRadius={48} paddingAngle={2} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
            <div style={{ flex: 1 }}>
              {data.top_categories.slice(0, 4).map((c) => (
                <div key={c.category.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: c.category.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: '12px', color: '#627282', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.category.name}</div>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: '#111820' }}>{formatCurrency(c.total)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Account balances */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '1.4rem', border: '1px solid #e5eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#111820' }}>Accounts</div>
              <div style={{ fontSize: '12px', color: '#9aaab4' }}>All connected</div>
            </div>
            <button style={{ fontSize: '12px', color: '#14b8a6', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 500 }}>+ Add</button>
          </div>
          {MOCK_ACCOUNTS.map((acc) => (
            <div key={acc.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid #f1f4f6' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: acc.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                {(() => {
                  const Icon = getIcon(acc.icon)
                  return Icon ? <Icon size={18} /> : null
                })()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#111820', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{acc.name}</div>
                <div style={{ fontSize: '11px', color: '#9aaab4' }}>{acc.institution}</div>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: acc.type === 'credit' || acc.type === 'loan' ? '#be123c' : '#111820', flexShrink: 0 }}>
                {acc.type === 'credit' ? '-' : ''}{formatCurrency(acc.balance)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div style={{ background: 'white', borderRadius: '14px', padding: '1.4rem', border: '1px solid #e5eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#111820' }}>Recent Transactions</div>
            <div style={{ fontSize: '12px', color: '#9aaab4' }}>Last 8 transactions</div>
          </div>
          <Link href="/dashboard/transactions" style={{ textDecoration: 'none', fontSize: '12px', color: '#14b8a6', fontWeight: 500 }}>View all →</Link>
        </div>
        <div>
          {data.recent_transactions.map((tx, i) => (
            <div key={tx.id} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 0',
              borderBottom: i < data.recent_transactions.length - 1 ? '1px solid #f8fafb' : 'none',
            }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: (tx.category?.color ?? '#9aaab4') + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                {(() => {
                  const Icon = getIcon(tx.category?.icon) || getIcon('dollarSign')
                  return Icon ? <Icon size={18} /> : null
                })()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#111820', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {tx.merchant || tx.description}
                </div>
                <div style={{ fontSize: '11px', color: '#9aaab4', display: 'flex', gap: '8px' }}>
                  <span>{tx.category?.name ?? 'Uncategorized'}</span>
                  <span>·</span>
                  <span>{formatDate(tx.date, 'MMM d')}</span>
                  {tx.is_recurring && <span style={{ color: '#14b8a6' }}>↺</span>}
                </div>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: tx.type === 'income' ? '#15803d' : '#111820', flexShrink: 0 }}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
