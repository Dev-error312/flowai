// ─────────────────────────────────────────────
// Core domain types
// ─────────────────────────────────────────────

export type Currency = 'USD' | 'EUR' | 'GBP' | 'NPR' | 'INR' | 'AUD' | 'CAD'

export type TransactionType = 'income' | 'expense' | 'transfer'
export type AccountType = 'checking' | 'savings' | 'investment' | 'credit' | 'loan' | 'cash'
export type InvestmentType = 'stock' | 'etf' | 'crypto' | 'bond' | 'real_estate' | 'mutual_fund' | 'other'
export type InsightType = 'weekly_review' | 'anomaly' | 'suggestion' | 'risk' | 'investment' | 'cashflow'
export type InsightSeverity = 'info' | 'warning' | 'critical' | 'positive'
export type GoalCategory = 'emergency' | 'vacation' | 'house' | 'retirement' | 'education' | 'car' | 'other'
export type BudgetPeriod = 'monthly' | 'weekly' | 'yearly'

// ─────────────────────────────────────────────
// User & Auth
// ─────────────────────────────────────────────

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  currency: Currency
  timezone: string
  monthly_income?: number
  created_at: string
}

// ─────────────────────────────────────────────
// Accounts
// ─────────────────────────────────────────────

export interface Account {
  id: string
  user_id: string
  name: string
  type: AccountType
  institution?: string
  balance: number
  currency: Currency
  color?: string
  icon?: string
  is_active: boolean
  plaid_account_id?: string
  last_synced?: string
  created_at: string
}

// ─────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────

export interface Category {
  id: string
  user_id: string
  name: string
  icon: string
  color: string
  type: 'income' | 'expense'
  parent_id?: string
  is_system: boolean
}

export const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'user_id'>[] = [
  // Expenses
  { name: 'Housing', icon: '🏠', color: '#6366f1', type: 'expense', is_system: true },
  { name: 'Food & Dining', icon: '🍽️', color: '#f59e0b', type: 'expense', is_system: true },
  { name: 'Transportation', icon: '🚗', color: '#3b82f6', type: 'expense', is_system: true },
  { name: 'Healthcare', icon: '🏥', color: '#ef4444', type: 'expense', is_system: true },
  { name: 'Shopping', icon: '🛍️', color: '#ec4899', type: 'expense', is_system: true },
  { name: 'Entertainment', icon: '🎬', color: '#8b5cf6', type: 'expense', is_system: true },
  { name: 'Subscriptions', icon: '📱', color: '#06b6d4', type: 'expense', is_system: true },
  { name: 'Utilities', icon: '⚡', color: '#eab308', type: 'expense', is_system: true },
  { name: 'Travel', icon: '✈️', color: '#14b8a6', type: 'expense', is_system: true },
  { name: 'Education', icon: '📚', color: '#f97316', type: 'expense', is_system: true },
  { name: 'Personal Care', icon: '💆', color: '#a855f7', type: 'expense', is_system: true },
  { name: 'Savings', icon: 'building', color: '#22c55e', type: 'expense', is_system: true },
  { name: 'Investments', icon: '📈', color: '#10b981', type: 'expense', is_system: true },
  { name: 'Debt Payments', icon: 'creditCard', color: '#64748b', type: 'expense', is_system: true },
  { name: 'Other', icon: '📦', color: '#9aaab4', type: 'expense', is_system: true },
  // Income
  { name: 'Salary', icon: 'dollarSign', color: '#22c55e', type: 'income', is_system: true },
  { name: 'Freelance', icon: '💼', color: '#14b8a6', type: 'income', is_system: true },
  { name: 'Investment Returns', icon: '📈', color: '#10b981', type: 'income', is_system: true },
  { name: 'Rental Income', icon: '🏘️', color: '#6366f1', type: 'income', is_system: true },
  { name: 'Other Income', icon: '🎁', color: '#f59e0b', type: 'income', is_system: true },
]

// ─────────────────────────────────────────────
// Transactions
// ─────────────────────────────────────────────

export interface Transaction {
  id: string
  user_id: string
  account_id: string
  amount: number
  type: TransactionType
  category_id?: string
  category?: Category
  account?: Account
  merchant?: string
  description: string
  date: string
  is_recurring: boolean
  recurring_frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  plaid_tx_id?: string
  ai_category_confidence?: number
  notes?: string
  tags?: string[]
  created_at: string
}

// ─────────────────────────────────────────────
// Budgets
// ─────────────────────────────────────────────

export interface Budget {
  id: string
  user_id: string
  category_id: string
  category?: Category
  amount: number
  period: BudgetPeriod
  rollover: boolean
  alert_at_percent: number
  month_year: string // "2024-01"
  spent?: number // computed
  remaining?: number // computed
  percent_used?: number // computed
}

// ─────────────────────────────────────────────
// Investments
// ─────────────────────────────────────────────

export interface Investment {
  id: string
  user_id: string
  account_id?: string
  symbol?: string
  name: string
  type: InvestmentType
  quantity: number
  avg_cost: number
  current_price: number
  last_updated: string
  // Computed
  current_value?: number
  gain_loss?: number
  gain_loss_percent?: number
}

// ─────────────────────────────────────────────
// Goals
// ─────────────────────────────────────────────

export interface Goal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  target_date?: string
  category: GoalCategory
  icon: string
  color: string
  // Computed
  progress_percent?: number
  monthly_needed?: number
  months_remaining?: number
}

// ─────────────────────────────────────────────
// AI Insights
// ─────────────────────────────────────────────

export interface AIInsight {
  id: string
  user_id: string
  type: InsightType
  title: string
  body: string
  action?: string
  severity: InsightSeverity
  is_read: boolean
  generated_at: string
  expires_at?: string
  context?: Record<string, unknown>
}

// ─────────────────────────────────────────────
// Chat
// ─────────────────────────────────────────────

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface ChatSession {
  id: string
  user_id: string
  title: string
  messages: ChatMessage[]
  created_at: string
  updated_at: string
}

// ─────────────────────────────────────────────
// Dashboard / Analytics
// ─────────────────────────────────────────────

export interface DashboardData {
  net_worth: number
  net_worth_change: number
  net_worth_change_percent: number
  monthly_income: number
  monthly_income_change: number
  monthly_expenses: number
  monthly_expenses_change: number
  monthly_savings: number
  savings_rate: number
  top_categories: CategorySummary[]
  recent_transactions: Transaction[]
  active_insights: AIInsight[]
  cashflow_forecast: CashflowPoint[]
  accounts: Account[]
}

export interface CategorySummary {
  category: Category
  total: number
  count: number
  percent_of_total: number
  change_from_last_month: number
}

export interface CashflowPoint {
  date: string
  projected_balance: number
  income: number
  expenses: number
}

export interface SpendingTrend {
  month: string
  income: number
  expenses: number
  savings: number
}

// ─────────────────────────────────────────────
// API Response types
// ─────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// ─────────────────────────────────────────────
// Financial calculations
// ─────────────────────────────────────────────

export function formatCurrency(
  amount: number,
  currency: Currency = 'USD',
  compact = false
): string {
  if (compact && Math.abs(amount) >= 1000) {
    const abs = Math.abs(amount)
    const sign = amount < 0 ? '-' : ''
    if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`
    if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`
}

export function calculateNetWorth(accounts: Account[]): number {
  return accounts.reduce((sum, a) => {
    const balance = a.type === 'credit' || a.type === 'loan' ? -Math.abs(a.balance) : a.balance
    return sum + balance
  }, 0)
}
