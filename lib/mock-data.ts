import type {
  Account, Transaction, Category, Budget, Investment,
  Goal, AIInsight, DashboardData, SpendingTrend
} from '@/types'

// ─── Accounts ───────────────────────────────
export const MOCK_ACCOUNTS: Account[] = [
  { id: 'acc-1', user_id: 'user-1', name: 'Chase Checking', type: 'checking', institution: 'Chase', balance: 8420.50, currency: 'USD', color: '#14b8a6', icon: 'building', is_active: true, created_at: '2024-01-01' },
  { id: 'acc-2', user_id: 'user-1', name: 'Ally Savings', type: 'savings', institution: 'Ally Bank', balance: 24800.00, currency: 'USD', color: '#22c55e', icon: 'building', is_active: true, created_at: '2024-01-01' },
  { id: 'acc-3', user_id: 'user-1', name: 'Fidelity 401k', type: 'investment', institution: 'Fidelity', balance: 87340.00, currency: 'USD', color: '#6366f1', icon: '📈', is_active: true, created_at: '2024-01-01' },
  { id: 'acc-4', user_id: 'user-1', name: 'Chase Sapphire', type: 'credit', institution: 'Chase', balance: 2340.00, currency: 'USD', color: '#f59e0b', icon: 'creditCard', is_active: true, created_at: '2024-01-01' },
  { id: 'acc-5', user_id: 'user-1', name: 'Robinhood', type: 'investment', institution: 'Robinhood', balance: 15600.00, currency: 'USD', color: '#10b981', icon: '🦾', is_active: true, created_at: '2024-01-01' },
]

// ─── Categories ─────────────────────────────
export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', user_id: 'user-1', name: 'Housing', icon: '🏠', color: '#6366f1', type: 'expense', is_system: true },
  { id: 'cat-2', user_id: 'user-1', name: 'Food & Dining', icon: '🍽️', color: '#f59e0b', type: 'expense', is_system: true },
  { id: 'cat-3', user_id: 'user-1', name: 'Transportation', icon: '🚗', color: '#3b82f6', type: 'expense', is_system: true },
  { id: 'cat-4', user_id: 'user-1', name: 'Entertainment', icon: '🎬', color: '#8b5cf6', type: 'expense', is_system: true },
  { id: 'cat-5', user_id: 'user-1', name: 'Subscriptions', icon: '📱', color: '#06b6d4', type: 'expense', is_system: true },
  { id: 'cat-6', user_id: 'user-1', name: 'Utilities', icon: '⚡', color: '#eab308', type: 'expense', is_system: true },
  { id: 'cat-7', user_id: 'user-1', name: 'Shopping', icon: '🛍️', color: '#ec4899', type: 'expense', is_system: true },
  { id: 'cat-8', user_id: 'user-1', name: 'Healthcare', icon: '🏥', color: '#ef4444', type: 'expense', is_system: true },
  { id: 'cat-9', user_id: 'user-1', name: 'Investments', icon: '📈', color: '#10b981', type: 'expense', is_system: true },
  { id: 'cat-10', user_id: 'user-1', name: 'Salary', icon: 'dollarSign', color: '#22c55e', type: 'income', is_system: true },
  { id: 'cat-11', user_id: 'user-1', name: 'Freelance', icon: '💼', color: '#14b8a6', type: 'income', is_system: true },
]

// ─── Transactions ────────────────────────────
export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx-1', user_id: 'user-1', account_id: 'acc-1', amount: 7800, type: 'income', category_id: 'cat-10', category: MOCK_CATEGORIES[9], merchant: 'Acme Corp', description: 'Monthly salary', date: '2024-11-01', is_recurring: true, recurring_frequency: 'monthly', created_at: '2024-11-01' },
  { id: 'tx-2', user_id: 'user-1', account_id: 'acc-1', amount: 1850, type: 'expense', category_id: 'cat-1', category: MOCK_CATEGORIES[0], merchant: 'Riverside Apartments', description: 'Rent', date: '2024-11-01', is_recurring: true, recurring_frequency: 'monthly', created_at: '2024-11-01' },
  { id: 'tx-3', user_id: 'user-1', account_id: 'acc-4', amount: 124.50, type: 'expense', category_id: 'cat-2', category: MOCK_CATEGORIES[1], merchant: 'Whole Foods', description: 'Groceries', date: '2024-11-03', is_recurring: false, created_at: '2024-11-03' },
  { id: 'tx-4', user_id: 'user-1', account_id: 'acc-4', amount: 67.80, type: 'expense', category_id: 'cat-2', category: MOCK_CATEGORIES[1], merchant: 'DoorDash', description: 'Food delivery', date: '2024-11-05', is_recurring: false, created_at: '2024-11-05' },
  { id: 'tx-5', user_id: 'user-1', account_id: 'acc-1', amount: 850, type: 'expense', category_id: 'cat-9', category: MOCK_CATEGORIES[8], merchant: 'Fidelity', description: '401k contribution', date: '2024-11-01', is_recurring: true, recurring_frequency: 'monthly', created_at: '2024-11-01' },
  { id: 'tx-6', user_id: 'user-1', account_id: 'acc-4', amount: 16.99, type: 'expense', category_id: 'cat-5', category: MOCK_CATEGORIES[4], merchant: 'Netflix', description: 'Streaming subscription', date: '2024-11-06', is_recurring: true, recurring_frequency: 'monthly', created_at: '2024-11-06' },
  { id: 'tx-7', user_id: 'user-1', account_id: 'acc-4', amount: 14.99, type: 'expense', category_id: 'cat-5', category: MOCK_CATEGORIES[4], merchant: 'Spotify', description: 'Music subscription', date: '2024-11-07', is_recurring: true, recurring_frequency: 'monthly', created_at: '2024-11-07' },
  { id: 'tx-8', user_id: 'user-1', account_id: 'acc-4', amount: 89.50, type: 'expense', category_id: 'cat-3', category: MOCK_CATEGORIES[2], merchant: 'Shell Gas Station', description: 'Fuel', date: '2024-11-08', is_recurring: false, created_at: '2024-11-08' },
  { id: 'tx-9', user_id: 'user-1', account_id: 'acc-1', amount: 1200, type: 'income', category_id: 'cat-11', category: MOCK_CATEGORIES[10], merchant: 'Client Project', description: 'Freelance consulting', date: '2024-11-10', is_recurring: false, created_at: '2024-11-10' },
  { id: 'tx-10', user_id: 'user-1', account_id: 'acc-4', amount: 245.60, type: 'expense', category_id: 'cat-7', category: MOCK_CATEGORIES[6], merchant: 'Amazon', description: 'Online shopping', date: '2024-11-11', is_recurring: false, created_at: '2024-11-11' },
  { id: 'tx-11', user_id: 'user-1', account_id: 'acc-4', amount: 42.00, type: 'expense', category_id: 'cat-2', category: MOCK_CATEGORIES[1], merchant: 'Starbucks', description: 'Coffee & snacks', date: '2024-11-12', is_recurring: false, created_at: '2024-11-12' },
  { id: 'tx-12', user_id: 'user-1', account_id: 'acc-4', amount: 180.00, type: 'expense', category_id: 'cat-6', category: MOCK_CATEGORIES[5], merchant: 'ComEd', description: 'Electric bill', date: '2024-11-13', is_recurring: true, recurring_frequency: 'monthly', created_at: '2024-11-13' },
  { id: 'tx-13', user_id: 'user-1', account_id: 'acc-4', amount: 95.00, type: 'expense', category_id: 'cat-4', category: MOCK_CATEGORIES[3], merchant: 'AMC Theatres', description: 'Movies & entertainment', date: '2024-11-15', is_recurring: false, created_at: '2024-11-15' },
  { id: 'tx-14', user_id: 'user-1', account_id: 'acc-4', amount: 55.00, type: 'expense', category_id: 'cat-2', category: MOCK_CATEGORIES[1], merchant: 'Uber Eats', description: 'Food delivery', date: '2024-11-16', is_recurring: false, created_at: '2024-11-16' },
  { id: 'tx-15', user_id: 'user-1', account_id: 'acc-4', amount: 320.00, type: 'expense', category_id: 'cat-7', category: MOCK_CATEGORIES[6], merchant: 'Nordstrom', description: 'Clothing', date: '2024-11-18', is_recurring: false, created_at: '2024-11-18' },
]

// ─── Budgets ─────────────────────────────────
export const MOCK_BUDGETS: Budget[] = [
  { id: 'bud-1', user_id: 'user-1', category_id: 'cat-1', category: MOCK_CATEGORIES[0], amount: 2000, period: 'monthly', rollover: false, alert_at_percent: 90, month_year: '2024-11', spent: 1850, remaining: 150, percent_used: 92.5 },
  { id: 'bud-2', user_id: 'user-1', category_id: 'cat-2', category: MOCK_CATEGORIES[1], amount: 600, period: 'monthly', rollover: false, alert_at_percent: 80, month_year: '2024-11', spent: 489.30, remaining: 110.70, percent_used: 81.5 },
  { id: 'bud-3', user_id: 'user-1', category_id: 'cat-3', category: MOCK_CATEGORIES[2], amount: 200, period: 'monthly', rollover: false, alert_at_percent: 80, month_year: '2024-11', spent: 89.50, remaining: 110.50, percent_used: 44.7 },
  { id: 'bud-4', user_id: 'user-1', category_id: 'cat-7', category: MOCK_CATEGORIES[6], amount: 300, period: 'monthly', rollover: false, alert_at_percent: 80, month_year: '2024-11', spent: 565.60, remaining: -265.60, percent_used: 188.5 },
  { id: 'bud-5', user_id: 'user-1', category_id: 'cat-5', category: MOCK_CATEGORIES[4], amount: 50, period: 'monthly', rollover: false, alert_at_percent: 90, month_year: '2024-11', spent: 31.98, remaining: 18.02, percent_used: 64.0 },
  { id: 'bud-6', user_id: 'user-1', category_id: 'cat-4', category: MOCK_CATEGORIES[3], amount: 150, period: 'monthly', rollover: false, alert_at_percent: 80, month_year: '2024-11', spent: 95, remaining: 55, percent_used: 63.3 },
]

// ─── Investments ──────────────────────────────
export const MOCK_INVESTMENTS: Investment[] = [
  { id: 'inv-1', user_id: 'user-1', name: 'S&P 500 Index Fund', symbol: 'FXAIX', type: 'etf', quantity: 125, avg_cost: 520, current_price: 618.42, last_updated: '2024-11-20', current_value: 77302.50, gain_loss: 12302.50, gain_loss_percent: 18.9 },
  { id: 'inv-2', user_id: 'user-1', name: 'Apple Inc.', symbol: 'AAPL', type: 'stock', quantity: 22, avg_cost: 168, current_price: 226.50, last_updated: '2024-11-20', current_value: 4983, gain_loss: 1265, gain_loss_percent: 34.8 },
  { id: 'inv-3', user_id: 'user-1', name: 'Bitcoin', symbol: 'BTC', type: 'crypto', quantity: 0.18, avg_cost: 35000, current_price: 92400, last_updated: '2024-11-20', current_value: 16632, gain_loss: 10332, gain_loss_percent: 163.2 },
  { id: 'inv-4', user_id: 'user-1', name: 'Vanguard Total Bond', symbol: 'BND', type: 'bond', quantity: 60, avg_cost: 73, current_price: 72.10, last_updated: '2024-11-20', current_value: 4326, gain_loss: -54, gain_loss_percent: -1.2 },
  { id: 'inv-5', user_id: 'user-1', name: 'NVIDIA Corp.', symbol: 'NVDA', type: 'stock', quantity: 8, avg_cost: 420, current_price: 834.60, last_updated: '2024-11-20', current_value: 6676.80, gain_loss: 3316.80, gain_loss_percent: 98.7 },
]

// ─── Goals ───────────────────────────────────
export const MOCK_GOALS: Goal[] = [
  { id: 'goal-1', user_id: 'user-1', name: 'Emergency Fund', target_amount: 30000, current_amount: 24800, target_date: '2025-06-01', category: 'emergency', icon: '🛡️', color: '#22c55e', progress_percent: 82.7, monthly_needed: 868, months_remaining: 6 },
  { id: 'goal-2', user_id: 'user-1', name: 'Japan Vacation', target_amount: 8000, current_amount: 3200, target_date: '2025-09-01', category: 'vacation', icon: '✈️', color: '#14b8a6', progress_percent: 40, monthly_needed: 480, months_remaining: 10 },
  { id: 'goal-3', user_id: 'user-1', name: 'Down Payment', target_amount: 80000, current_amount: 24800, target_date: '2027-01-01', category: 'house', icon: '🏡', color: '#6366f1', progress_percent: 31, monthly_needed: 2060, months_remaining: 26 },
]

// ─── AI Insights ──────────────────────────────
export const MOCK_INSIGHTS: AIInsight[] = [
  {
    id: 'ins-1',
    user_id: 'user-1',
    type: 'anomaly',
    title: 'Shopping budget exceeded by 89%',
    body: 'You\'ve spent $565 on shopping this month — nearly double your $300 budget. This was driven by a $320 Nordstrom purchase and $245 on Amazon. Over 12 months, this pattern would cost you an extra $3,196 vs your budget.',
    action: 'Review your shopping budget or reduce to planned purchases only for the rest of November.',
    severity: 'warning',
    is_read: false,
    generated_at: '2024-11-20T09:00:00Z',
  },
  {
    id: 'ins-2',
    user_id: 'user-1',
    type: 'investment',
    title: 'Your crypto allocation is growing above target',
    body: 'Bitcoin now represents 15.8% of your portfolio — up from your likely comfort level of 5–10%. Your BTC position has surged 163% in gains. Consider whether to rebalance by taking some profits into your index fund.',
    action: 'Rebalance: sell ~$5K of BTC gains into FXAIX to bring crypto back to 10% allocation.',
    severity: 'info',
    is_read: false,
    generated_at: '2024-11-20T09:00:00Z',
  },
  {
    id: 'ins-3',
    user_id: 'user-1',
    type: 'suggestion',
    title: 'You\'re 83% to your emergency fund goal 🎉',
    body: 'Your Ally Savings has grown to $24,800 — just $5,200 from your 3-month emergency fund target of $30,000. At your current savings rate of $868/month, you\'ll hit this milestone in ~6 months.',
    action: 'Once your emergency fund is complete, redirect that $868/mo toward your Japan vacation goal.',
    severity: 'positive',
    is_read: false,
    generated_at: '2024-11-20T09:00:00Z',
  },
  {
    id: 'ins-4',
    user_id: 'user-1',
    type: 'cashflow',
    title: 'Food delivery spending up 34% this month',
    body: 'You\'ve ordered food delivery 4 times this month for $167 total. That\'s $67 above your typical pace. At this rate, your food budget will be 95% used by month-end, with 10 days remaining.',
    action: 'Cook at home for the next 3 dinners — you\'ll save ~$60 and finish within budget.',
    severity: 'warning',
    is_read: true,
    generated_at: '2024-11-19T09:00:00Z',
  },
]

// ─── Spending trends ──────────────────────────
export const MOCK_SPENDING_TRENDS: SpendingTrend[] = [
  { month: 'Jun', income: 8200, expenses: 4800, savings: 3400 },
  { month: 'Jul', income: 8200, expenses: 5200, savings: 3000 },
  { month: 'Aug', income: 9200, expenses: 5600, savings: 3600 },
  { month: 'Sep', income: 8200, expenses: 4400, savings: 3800 },
  { month: 'Oct', income: 8200, expenses: 5800, savings: 2400 },
  { month: 'Nov', income: 9000, expenses: 4800, savings: 4200 },
]

// ─── Cashflow forecast ─────────────────────────
export const MOCK_CASHFLOW = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() + i)
  const base = 8420
  const income = i === 0 ? 0 : i === 14 ? 7800 : i === 28 ? 1200 : 0
  const expenses = Math.random() * 200 + 50
  const balance = base + (i * 30) + income - (i * 180)
  return {
    date: date.toISOString().split('T')[0],
    projected_balance: Math.max(balance, 1000),
    income,
    expenses,
  }
})

// ─── Dashboard composite ──────────────────────
export const MOCK_DASHBOARD: DashboardData = {
  net_worth: 134180.50,
  net_worth_change: 4230,
  net_worth_change_percent: 3.25,
  monthly_income: 9000,
  monthly_income_change: 1200,
  monthly_expenses: 4800,
  monthly_expenses_change: -200,
  monthly_savings: 4200,
  savings_rate: 46.7,
  top_categories: [
    { category: MOCK_CATEGORIES[0], total: 1850, count: 1, percent_of_total: 38.5, change_from_last_month: 0 },
    { category: MOCK_CATEGORIES[9], total: 850, count: 1, percent_of_total: 17.7, change_from_last_month: 0 },
    { category: MOCK_CATEGORIES[6], total: 565.60, count: 2, percent_of_total: 11.8, change_from_last_month: 89 },
    { category: MOCK_CATEGORIES[1], total: 489.30, count: 4, percent_of_total: 10.2, change_from_last_month: 15 },
    { category: MOCK_CATEGORIES[5], total: 180, count: 1, percent_of_total: 3.7, change_from_last_month: 0 },
  ],
  recent_transactions: MOCK_TRANSACTIONS.slice(0, 8),
  active_insights: MOCK_INSIGHTS,
  cashflow_forecast: MOCK_CASHFLOW,
  accounts: MOCK_ACCOUNTS,
}
