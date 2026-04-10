import type { Transaction, Account, CashflowPoint } from '@/types'

export interface RecurringItem {
  description: string
  merchant?: string
  amount: number
  type: 'income' | 'expense'
  frequency: 'weekly' | 'monthly' | 'yearly'
  next_date: Date
  category?: string
}

// Detect recurring transactions from history
export function detectRecurring(transactions: Transaction[]): RecurringItem[] {
  const recurring: RecurringItem[] = []

  // Group by merchant + approximate amount
  const groups = new Map<string, Transaction[]>()
  for (const tx of transactions) {
    const key = `${(tx.merchant ?? tx.description).toLowerCase()}-${Math.round(tx.amount / 10) * 10}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(tx)
  }

  for (const [, txs] of Array.from(groups.entries())) {
    if (txs.length < 2) continue

    // Sort by date
    txs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Calculate average gap between occurrences
    const gaps: number[] = []
    for (let i = 1; i < txs.length; i++) {
      const days = (new Date(txs[i].date).getTime() - new Date(txs[i - 1].date).getTime()) / (1000 * 60 * 60 * 24)
      gaps.push(days)
    }

    const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length
    let frequency: 'weekly' | 'monthly' | 'yearly' | null = null

    if (avgGap >= 6 && avgGap <= 8) frequency = 'weekly'
    else if (avgGap >= 25 && avgGap <= 35) frequency = 'monthly'
    else if (avgGap >= 350 && avgGap <= 380) frequency = 'yearly'

    if (!frequency) continue

    const lastTx = txs[txs.length - 1]
    const lastDate = new Date(lastTx.date)
    const nextDate = new Date(lastDate)

    if (frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7)
    else if (frequency === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1)
    else nextDate.setFullYear(nextDate.getFullYear() + 1)

    const avgAmount = txs.reduce((s, t) => s + t.amount, 0) / txs.length

    recurring.push({
      description: lastTx.description,
      merchant: lastTx.merchant ?? undefined,
      amount: Math.round(avgAmount * 100) / 100,
      type: lastTx.type as 'income' | 'expense',
      frequency,
      next_date: nextDate,
      category: lastTx.category?.name,
    })
  }

  return recurring
}

// Generate 30/60/90 day cashflow forecast
export function generateCashflowForecast(
  currentBalance: number,
  recurring: RecurringItem[],
  days = 30
): CashflowPoint[] {
  const points: CashflowPoint[] = []
  let balance = currentBalance

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]

    let dayIncome = 0
    let dayExpenses = 0

    for (const item of recurring) {
      const nextDate = new Date(item.next_date)

      // Check if this recurring item hits today
      let hits = false
      if (item.frequency === 'weekly') {
        const dayOfWeek = nextDate.getDay()
        hits = date.getDay() === dayOfWeek
      } else if (item.frequency === 'monthly') {
        hits = date.getDate() === nextDate.getDate()
      } else if (item.frequency === 'yearly') {
        hits = date.getDate() === nextDate.getDate() && date.getMonth() === nextDate.getMonth()
      }

      if (hits) {
        if (item.type === 'income') dayIncome += item.amount
        else dayExpenses += item.amount
      }
    }

    balance += dayIncome - dayExpenses

    points.push({
      date: dateStr,
      projected_balance: Math.max(balance, 0),
      income: dayIncome,
      expenses: dayExpenses,
    })
  }

  return points
}

// Detect cashflow risks
export interface CashflowRisk {
  type: 'shortfall' | 'low_balance' | 'large_expense_coming'
  date: string
  amount: number
  description: string
  severity: 'warning' | 'critical'
}

export function detectCashflowRisks(
  forecast: CashflowPoint[],
  warningThreshold = 1000,
  criticalThreshold = 0
): CashflowRisk[] {
  const risks: CashflowRisk[] = []

  for (const point of forecast) {
    if (point.projected_balance < criticalThreshold) {
      risks.push({
        type: 'shortfall',
        date: point.date,
        amount: Math.abs(point.projected_balance),
        description: `Account may go negative — shortfall of $${Math.abs(point.projected_balance).toFixed(0)}`,
        severity: 'critical',
      })
    } else if (point.projected_balance < warningThreshold) {
      risks.push({
        type: 'low_balance',
        date: point.date,
        amount: point.projected_balance,
        description: `Balance will drop to $${point.projected_balance.toFixed(0)}`,
        severity: 'warning',
      })
    }

    if (point.expenses > 1000) {
      risks.push({
        type: 'large_expense_coming',
        date: point.date,
        amount: point.expenses,
        description: `Large expenses of $${point.expenses.toFixed(0)} on this date`,
        severity: 'warning',
      })
    }
  }

  // Deduplicate consecutive warnings
  return risks.filter((r, i) => {
    if (i === 0) return true
    return r.type !== risks[i - 1].type
  })
}
