'use client'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line, Legend, Cell,
} from 'recharts'
import { MOCK_SPENDING_TRENDS, MOCK_DASHBOARD, MOCK_TRANSACTIONS } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'

const MONTHLY_CATEGORY_DATA = [
  { month: 'Jun', Housing: 1850, Dining: 380, Transport: 120, Shopping: 200, Entertainment: 80 },
  { month: 'Jul', Housing: 1850, Dining: 420, Transport: 145, Shopping: 350, Entertainment: 120 },
  { month: 'Aug', Housing: 1850, Dining: 390, Transport: 130, Shopping: 280, Entertainment: 95 },
  { month: 'Sep', Housing: 1850, Dining: 310, Transport: 95,  Shopping: 150, Entertainment: 60 },
  { month: 'Oct', Housing: 1850, Dining: 445, Transport: 160, Shopping: 420, Entertainment: 140 },
  { month: 'Nov', Housing: 1850, Dining: 489, Transport: 90,  Shopping: 566, Entertainment: 95 },
]

const COLORS = ['#6366f1', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6']

const TABS = ['Overview', 'Spending trends', 'Categories', 'Savings rate']

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('Overview')

  const avgSavings = MOCK_SPENDING_TRENDS.reduce((s, m) => s + m.savings, 0) / MOCK_SPENDING_TRENDS.length
  const avgIncome = MOCK_SPENDING_TRENDS.reduce((s, m) => s + m.income, 0) / MOCK_SPENDING_TRENDS.length
  const avgSavingsRate = (avgSavings / avgIncome) * 100

  return (
    <div style={{ maxWidth: '1100px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em', color: '#111820', marginBottom: '4px' }}>Analytics</h1>
        <p style={{ color: '#9aaab4', fontSize: '14px' }}>Last 6 months · AI-powered insights</p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '4px', background: '#f1f4f6', borderRadius: '10px', padding: '3px', marginBottom: '1.5rem', width: 'fit-content' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '6px 16px', borderRadius: '8px', border: 'none', fontSize: '13px',
            background: activeTab === tab ? 'white' : 'transparent',
            color: activeTab === tab ? '#111820' : '#9aaab4',
            fontWeight: activeTab === tab ? 500 : 400,
            cursor: 'pointer', boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s', fontFamily: 'DM Sans, sans-serif',
          }}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <>
          {/* KPI row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '1.25rem' }}>
            {[
              { label: 'Avg monthly income', value: formatCurrency(avgIncome), change: '+4.2%', pos: true },
              { label: 'Avg monthly expenses', value: formatCurrency(MOCK_SPENDING_TRENDS.reduce((s, m) => s + m.expenses, 0) / 6), change: '-2.1%', pos: true },
              { label: 'Avg monthly savings', value: formatCurrency(avgSavings), change: '+12%', pos: true },
              { label: 'Avg savings rate', value: `${avgSavingsRate.toFixed(1)}%`, change: 'Top 20%', pos: true },
            ].map(m => (
              <div key={m.label} style={{ background: 'white', border: '1px solid #e5eaed', borderRadius: '12px', padding: '1rem 1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '11px', color: '#9aaab4', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{m.label}</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#111820', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}>{m.value}</div>
                <div style={{ fontSize: '11px', color: m.pos ? '#15803d' : '#be123c', marginTop: '4px' }}>{m.change} vs prior period</div>
              </div>
            ))}
          </div>

          {/* Income vs Expense area chart */}
          <div style={{ background: 'white', border: '1px solid #e5eaed', borderRadius: '14px', padding: '1.4rem', marginBottom: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#111820' }}>Income & Expense Trend</div>
              <div style={{ fontSize: '12px', color: '#9aaab4' }}>Monthly comparison over 6 months</div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={MOCK_SPENDING_TRENDS}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f4f6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9aaab4' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9aaab4' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Area type="monotone" dataKey="income" stroke="#14b8a6" strokeWidth={2} fill="url(#incomeGrad)" name="Income" />
                <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2} fill="url(#expenseGrad)" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* AI Commentary */}
          <div style={{ background: '#f0fdf9', border: '1px solid #99f6df', borderRadius: '12px', padding: '1.1rem 1.25rem', display: 'flex', gap: '12px' }}>
            <div style={{ fontSize: '20px' }}>✦</div>
            <div>
              <div style={{ fontWeight: 500, fontSize: '13px', color: '#111820', marginBottom: '4px' }}>AI 6-Month Summary</div>
              <div style={{ fontSize: '12px', color: '#627282', lineHeight: 1.7 }}>
                <strong style={{ color: '#111820' }}>Strong savings pattern:</strong> You&apos;ve averaged a 43% savings rate over 6 months — nearly double the 20% recommended target. Your income grew in August and November (likely freelance income), which boosted savings those months.
                <br /><br />
                <strong style={{ color: '#111820' }}>Watch October:</strong> Your expenses spiked to $5,800 in October — your highest in 6 months — primarily driven by shopping ($420). November is trending similarly. This pattern suggests a lifestyle drift worth addressing before it compounds.
                <br /><br />
                <strong style={{ color: '#be123c' }}>→ Action:</strong> Set a $300 hard cap on shopping for December and January to course-correct.
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'Spending trends' && (
        <div style={{ background: 'white', border: '1px solid #e5eaed', borderRadius: '14px', padding: '1.4rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#111820' }}>Monthly savings trajectory</div>
            <div style={{ fontSize: '12px', color: '#9aaab4' }}>Income, expenses, and net savings by month</div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={MOCK_SPENDING_TRENDS} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f4f6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9aaab4' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9aaab4' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="income" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Income" />
              <Bar dataKey="expenses" fill="#fda4af" radius={[4, 4, 0, 0]} name="Expenses" />
              <Bar dataKey="savings" fill="#6366f1" radius={[4, 4, 0, 0]} name="Savings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === 'Categories' && (
        <div style={{ background: 'white', border: '1px solid #e5eaed', borderRadius: '14px', padding: '1.4rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#111820' }}>Category spending by month</div>
            <div style={{ fontSize: '12px', color: '#9aaab4' }}>Stacked view of top 5 categories</div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={MONTHLY_CATEGORY_DATA} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f4f6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9aaab4' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9aaab4' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              {['Housing', 'Dining', 'Transport', 'Shopping', 'Entertainment'].map((cat, i) => (
                <Bar key={cat} dataKey={cat} stackId="a" fill={COLORS[i]} radius={i === 4 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === 'Savings rate' && (
        <div style={{ background: 'white', border: '1px solid #e5eaed', borderRadius: '14px', padding: '1.4rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#111820' }}>Savings rate over time</div>
            <div style={{ fontSize: '12px', color: '#9aaab4' }}>Target: 20% · Your avg: {avgSavingsRate.toFixed(1)}%</div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={MOCK_SPENDING_TRENDS.map(m => ({ ...m, rate: ((m.savings / m.income) * 100), target: 20 }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f4f6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9aaab4' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9aaab4' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="rate" stroke="#14b8a6" strokeWidth={2.5} dot={{ fill: '#14b8a6', strokeWidth: 0, r: 4 }} name="Your rate" />
              <Line type="monotone" dataKey="target" stroke="#e5eaed" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Target (20%)" />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ marginTop: '1rem', padding: '12px 16px', background: '#f0fdf4', borderRadius: '10px', fontSize: '13px', color: '#15803d' }}>
            ✦ You&apos;ve exceeded the 20% savings target every single month. Your average rate of {avgSavingsRate.toFixed(1)}% puts you in the top 15% of savers. Keep it up!
          </div>
        </div>
      )}
    </div>
  )
}
