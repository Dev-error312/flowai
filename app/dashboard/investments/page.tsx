'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { MOCK_INVESTMENTS, MOCK_ACCOUNTS } from '@/lib/mock-data'
import { formatCurrency, formatPercent } from '@/lib/utils'

const PORTFOLIO_HISTORY = [
  { month: 'May', value: 87000 },
  { month: 'Jun', value: 89200 },
  { month: 'Jul', value: 91400 },
  { month: 'Aug', value: 88600 },
  { month: 'Sep', value: 95800 },
  { month: 'Oct', value: 98200 },
  { month: 'Nov', value: 102920 },
]

const TYPE_COLORS: Record<string, string> = {
  etf: '#9333ea',
  stock: '#0ea5e9',
  crypto: '#f59e0b',
  bond: '#16a34a',
  real_estate: '#ec4899',
  mutual_fund: '#06b6d4',
  other: '#9aaab4',
}

export default function InvestmentsPage() {
  const totalValue = MOCK_INVESTMENTS.reduce((s, i) => s + (i.current_value ?? 0), 0)
  const totalGain = MOCK_INVESTMENTS.reduce((s, i) => s + (i.gain_loss ?? 0), 0)
  const totalCost = MOCK_INVESTMENTS.reduce((s, i) => s + (i.avg_cost * i.quantity), 0)
  const totalGainPct = (totalGain / totalCost) * 100

  const allocationData = MOCK_INVESTMENTS.map(inv => ({
    name: inv.name,
    value: inv.current_value ?? 0,
    color: TYPE_COLORS[inv.type] ?? '#9aaab4',
    type: inv.type,
    pct: ((inv.current_value ?? 0) / totalValue) * 100,
  }))

  const typeAllocation = Object.entries(
    MOCK_INVESTMENTS.reduce((acc, inv) => {
      const type = inv.type
      acc[type] = (acc[type] ?? 0) + (inv.current_value ?? 0)
      return acc
    }, {} as Record<string, number>)
  ).map(([type, value]) => ({
    type, value, pct: (value / totalValue) * 100, color: TYPE_COLORS[type] ?? '#9aaab4'
  })).sort((a, b) => b.value - a.value)

  const investmentAccounts = MOCK_ACCOUNTS.filter(a => a.type === 'investment')

  return (
    <div style={{ maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em', color: '#111820', marginBottom: '4px' }}>Investments</h1>
        <p style={{ color: '#9aaab4', fontSize: '14px' }}>Portfolio overview · Last updated today</p>
      </div>

      {/* Top metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '1.25rem' }}>
        {[
          { label: 'Portfolio Value', value: formatCurrency(totalValue), sub: `+${formatCurrency(totalGain)} total gain`, color: '#15803d' },
          { label: 'Total Return', value: `+${totalGainPct.toFixed(1)}%`, sub: `+${formatCurrency(totalGain)} all-time`, color: '#15803d' },
          { label: 'This Month', value: formatCurrency(totalValue - PORTFOLIO_HISTORY[PORTFOLIO_HISTORY.length - 2].value), sub: 'vs last month', color: '#15803d' },
          { label: 'Holdings', value: `${MOCK_INVESTMENTS.length}`, sub: `across ${investmentAccounts.length} accounts`, color: '#111820' },
        ].map(m => (
          <div key={m.label} style={{ background: 'white', border: '1px solid #e5eaed', borderRadius: '12px', padding: '1rem 1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '11px', color: '#9aaab4', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{m.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: m.color, letterSpacing: '-0.02em' }}>{m.value}</div>
            <div style={{ fontSize: '11px', color: '#9aaab4', marginTop: '2px' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '14px', marginBottom: '14px' }}>
        {/* Growth chart */}
        <div style={{ background: 'white', border: '1px solid #e5eaed', borderRadius: '14px', padding: '1.4rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#111820' }}>Portfolio Growth</div>
            <div style={{ fontSize: '12px', color: '#9aaab4' }}>Last 7 months</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={PORTFOLIO_HISTORY}>
              <defs>
                <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f4f6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9aaab4' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9aaab4' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [formatCurrency(v), 'Portfolio value']} />
              <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} fill="url(#portGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Allocation pie */}
        <div style={{ background: 'white', border: '1px solid #e5eaed', borderRadius: '14px', padding: '1.4rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#111820' }}>Asset Allocation</div>
            <div style={{ fontSize: '12px', color: '#9aaab4' }}>By investment type</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <PieChart width={160} height={160}>
              <Pie data={allocationData} cx={80} cy={80} innerRadius={40} outerRadius={72} paddingAngle={2} dataKey="value">
                {allocationData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
            </PieChart>
          </div>
          <div>
            {typeAllocation.map(t => (
              <div key={t.type} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: t.color, flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: '12px', color: '#627282', textTransform: 'capitalize' }}>{t.type}</div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: '#111820' }}>{t.pct.toFixed(1)}%</div>
                <div style={{ fontSize: '12px', color: '#9aaab4' }}>{formatCurrency(t.value, 'USD', true)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Risk Alert */}
      <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', gap: '12px' }}>
        <div style={{ fontSize: '20px' }}>✦</div>
        <div>
          <div style={{ fontWeight: 500, fontSize: '13px', color: '#111820', marginBottom: '4px' }}>AI Portfolio Insight</div>
          <div style={{ fontSize: '12px', color: '#627282', lineHeight: 1.6 }}>
            Your Bitcoin position has grown to <strong>15.8% of your portfolio</strong> due to a 163% gain. Most financial planning frameworks recommend keeping crypto at 5–10% of total holdings. 
            Rebalancing $6,000 of BTC profits into FXAIX would bring you back in range while locking in significant gains.
          </div>
          <div style={{ fontSize: '12px', fontWeight: 500, color: '#b45309', marginTop: '6px' }}>→ Consider selling ~$6K of BTC and moving to FXAIX to rebalance to ~10% crypto exposure.</div>
        </div>
      </div>

      {/* Holdings table */}
      <div style={{ background: 'white', border: '1px solid #e5eaed', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '1.1rem 1.25rem', borderBottom: '1px solid #f1f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: '14px', color: '#111820' }}>Holdings</div>
          <button style={{ fontSize: '12px', color: '#14b8a6', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 500 }}>+ Add holding</button>
        </div>

        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', gap: '1rem', padding: '10px 1.25rem', background: '#f8fafb' }}>
          {['Asset', 'Type', 'Quantity', 'Avg Cost', 'Current', 'Gain/Loss'].map(h => (
            <div key={h} style={{ fontSize: '11px', fontWeight: 600, color: '#9aaab4', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
          ))}
        </div>

        {MOCK_INVESTMENTS.map((inv, i) => {
          const pct = inv.gain_loss_percent ?? 0
          return (
            <div key={inv.id} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', gap: '1rem',
              padding: '12px 1.25rem', alignItems: 'center',
              borderBottom: i < MOCK_INVESTMENTS.length - 1 ? '1px solid #f8fafb' : 'none',
              transition: 'background 0.1s', cursor: 'pointer',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fafbfc' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: (TYPE_COLORS[inv.type] ?? '#9aaab4') + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: TYPE_COLORS[inv.type] ?? '#9aaab4' }}>
                  {inv.symbol?.slice(0, 3) ?? inv.type.slice(0, 3).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#111820' }}>{inv.name}</div>
                  <div style={{ fontSize: '11px', color: '#9aaab4' }}>{inv.symbol}</div>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: (TYPE_COLORS[inv.type] ?? '#9aaab4') + '18', color: TYPE_COLORS[inv.type] ?? '#9aaab4', fontWeight: 500, textTransform: 'capitalize' }}>
                  {inv.type}
                </span>
              </div>

              <div style={{ fontSize: '13px', color: '#627282', fontVariantNumeric: 'tabular-nums' }}>
                {inv.quantity >= 1 ? inv.quantity.toFixed(2) : inv.quantity.toFixed(4)}
              </div>

              <div style={{ fontSize: '13px', color: '#627282', fontVariantNumeric: 'tabular-nums' }}>
                {formatCurrency(inv.avg_cost)}
              </div>

              <div style={{ fontSize: '13px', fontWeight: 500, color: '#111820', fontVariantNumeric: 'tabular-nums' }}>
                {formatCurrency(inv.current_value ?? 0)}
              </div>

              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: pct >= 0 ? '#15803d' : '#be123c', fontVariantNumeric: 'tabular-nums' }}>
                  {pct >= 0 ? '+' : ''}{formatCurrency(inv.gain_loss ?? 0)}
                </div>
                <div style={{ fontSize: '11px', color: pct >= 0 ? '#15803d' : '#be123c' }}>
                  {pct >= 0 ? '+' : ''}{pct.toFixed(1)}%
                </div>
              </div>
            </div>
          )
        })}

        {/* Total row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', gap: '1rem', padding: '12px 1.25rem', borderTop: '1px solid #e5eaed', background: '#f8fafb' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#111820' }}>Total</div>
          <div /><div /><div />
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#111820', fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(totalValue)}</div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#15803d' }}>+{formatCurrency(totalGain)}</div>
            <div style={{ fontSize: '11px', color: '#15803d' }}>+{totalGainPct.toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
