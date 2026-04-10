import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Account, Transaction, Budget, Investment, Goal, AIInsight } from '@/types'

// ─── Auth Store ───────────────────────────────────────────────────────────────
interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
}))

// ─── UI Store ─────────────────────────────────────────────────────────────────
interface UIState {
  sidebarOpen: boolean
  activeModal: string | null
  setSidebarOpen: (open: boolean) => void
  openModal: (name: string) => void
  closeModal: () => void
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  activeModal: null,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  openModal: (name) => set({ activeModal: name }),
  closeModal: () => set({ activeModal: null }),
}))

// ─── Financial Data Store ─────────────────────────────────────────────────────
interface FinancialState {
  accounts: Account[]
  transactions: Transaction[]
  budgets: Budget[]
  investments: Investment[]
  goals: Goal[]
  insights: AIInsight[]
  lastFetched: Date | null

  // Actions
  setAccounts: (accounts: Account[]) => void
  setTransactions: (txs: Transaction[]) => void
  addTransaction: (tx: Transaction) => void
  updateTransaction: (id: string, tx: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  setBudgets: (budgets: Budget[]) => void
  setInvestments: (investments: Investment[]) => void
  setGoals: (goals: Goal[]) => void
  updateGoal: (id: string, goal: Partial<Goal>) => void
  setInsights: (insights: AIInsight[]) => void
  markInsightRead: (id: string) => void
  setLastFetched: (date: Date) => void
}

export const useFinancialStore = create<FinancialState>()((set) => ({
  accounts: [],
  transactions: [],
  budgets: [],
  investments: [],
  goals: [],
  insights: [],
  lastFetched: null,

  setAccounts: (accounts) => set({ accounts }),
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (tx) => set((state) => ({ transactions: [tx, ...state.transactions] })),
  updateTransaction: (id, updates) => set((state) => ({
    transactions: state.transactions.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  deleteTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter(t => t.id !== id)
  })),
  setBudgets: (budgets) => set({ budgets }),
  setInvestments: (investments) => set({ investments }),
  setGoals: (goals) => set({ goals }),
  updateGoal: (id, updates) => set((state) => ({
    goals: state.goals.map(g => g.id === id ? { ...g, ...updates } : g)
  })),
  setInsights: (insights) => set({ insights }),
  markInsightRead: (id) => set((state) => ({
    insights: state.insights.map(i => i.id === id ? { ...i, is_read: true } : i)
  })),
  setLastFetched: (lastFetched) => set({ lastFetched }),
}))

// ─── Preferences Store (persisted) ───────────────────────────────────────────
interface PreferencesState {
  currency: string
  theme: 'light' | 'dark' | 'system'
  weeklyDigestEnabled: boolean
  insightNotificationsEnabled: boolean
  budgetAlertsEnabled: boolean

  setCurrency: (currency: string) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setWeeklyDigest: (enabled: boolean) => void
  setInsightNotifications: (enabled: boolean) => void
  setBudgetAlerts: (enabled: boolean) => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      currency: 'USD',
      theme: 'light',
      weeklyDigestEnabled: true,
      insightNotificationsEnabled: true,
      budgetAlertsEnabled: true,

      setCurrency: (currency) => set({ currency }),
      setTheme: (theme) => set({ theme }),
      setWeeklyDigest: (weeklyDigestEnabled) => set({ weeklyDigestEnabled }),
      setInsightNotifications: (insightNotificationsEnabled) => set({ insightNotificationsEnabled }),
      setBudgetAlerts: (budgetAlertsEnabled) => set({ budgetAlertsEnabled }),
    }),
    { name: 'flowai-preferences' }
  )
)
