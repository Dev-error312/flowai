import { useState, useEffect, useCallback } from 'react'
import { MOCK_DASHBOARD, MOCK_TRANSACTIONS, MOCK_BUDGETS, MOCK_INVESTMENTS, MOCK_GOALS, MOCK_INSIGHTS } from '@/lib/mock-data'
import type { Transaction, Budget, Investment, Goal, AIInsight, DashboardData } from '@/types'

// ─── useDashboard ─────────────────────────────────────────────────────────────
export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await window.fetch('/api/dashboard')
      const json = await res.json()
      setData(json.data)
    } catch {
      // Fallback to mock data
      setData(MOCK_DASHBOARD)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { data, loading, error, refetch: fetch }
}

// ─── useTransactions ──────────────────────────────────────────────────────────
export function useTransactions(filters?: { type?: string; search?: string; limit?: number }) {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(MOCK_TRANSACTIONS.length)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters?.type) params.set('type', filters.type)
      if (filters?.search) params.set('search', filters.search)
      if (filters?.limit) params.set('limit', String(filters.limit))

      const res = await window.fetch(`/api/transactions?${params}`)
      const json = await res.json()
      setTransactions(json.data)
      setTotal(json.meta?.total ?? json.data.length)
    } catch {
      setTransactions(MOCK_TRANSACTIONS)
      setTotal(MOCK_TRANSACTIONS.length)
    } finally {
      setLoading(false)
    }
  }, [filters?.type, filters?.search, filters?.limit])

  useEffect(() => { fetch() }, [fetch])

  const addTransaction = async (tx: Partial<Transaction>) => {
    try {
      const res = await window.fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tx),
      })
      const json = await res.json()
      setTransactions(prev => [json.data, ...prev])
    } catch {
      console.error('Failed to add transaction')
    }
  }

  return { transactions, loading, total, addTransaction, refetch: fetch }
}

// ─── useBudgets ───────────────────────────────────────────────────────────────
export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>(MOCK_BUDGETS)
  const [loading, setLoading] = useState(false)
  return { budgets, loading, setBudgets }
}

// ─── useInvestments ───────────────────────────────────────────────────────────
export function useInvestments() {
  const [investments, setInvestments] = useState<Investment[]>(MOCK_INVESTMENTS)
  const [loading, setLoading] = useState(false)
  return { investments, loading, setInvestments }
}

// ─── useGoals ─────────────────────────────────────────────────────────────────
export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS)
  const [loading, setLoading] = useState(false)

  const updateGoalAmount = (id: string, amount: number) => {
    setGoals(prev => prev.map(g =>
      g.id === id
        ? { ...g, current_amount: amount, progress_percent: (amount / g.target_amount) * 100 }
        : g
    ))
  }

  return { goals, loading, setGoals, updateGoalAmount }
}

// ─── useAIInsights ────────────────────────────────────────────────────────────
export function useAIInsights() {
  const [insights, setInsights] = useState<AIInsight[]>(MOCK_INSIGHTS)
  const [generating, setGenerating] = useState(false)

  const generateInsights = async () => {
    setGenerating(true)
    try {
      const res = await window.fetch('/api/ai/insights', { method: 'POST' })
      const json = await res.json()
      setInsights(json.insights)
    } catch {
      console.error('Failed to generate insights')
    } finally {
      setGenerating(false)
    }
  }

  const markRead = (id: string) => {
    setInsights(prev => prev.map(i => i.id === id ? { ...i, is_read: true } : i))
  }

  const unreadCount = insights.filter(i => !i.is_read).length

  return { insights, generating, generateInsights, markRead, unreadCount }
}

// ─── usePlaid ─────────────────────────────────────────────────────────────────
export function usePlaid() {
  const [linking, setLinking] = useState(false)
  const [syncing, setSyncing] = useState(false)

  const openLink = async () => {
    setLinking(true)
    try {
      // Create link token
      const res = await window.fetch('/api/plaid/create-link-token', { method: 'POST' })
      const { link_token, demo } = await res.json()

      if (demo) {
        alert('Demo mode: Real bank connection requires PLAID_CLIENT_ID and PLAID_SECRET in .env.local')
        return
      }

      // In production: open Plaid Link with the link_token
      // const { open } = usePlaidLink({ token: link_token, onSuccess: handleSuccess })
      // open()
      console.log('Plaid link token:', link_token)

    } finally {
      setLinking(false)
    }
  }

  const sync = async (itemId: string) => {
    setSyncing(true)
    try {
      await window.fetch('/api/plaid/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: itemId }),
      })
    } finally {
      setSyncing(false)
    }
  }

  return { linking, syncing, openLink, sync }
}

// ─── useNetWorth ──────────────────────────────────────────────────────────────
export function useNetWorth() {
  const { data } = useDashboard()
  return {
    netWorth: data?.net_worth ?? 0,
    change: data?.net_worth_change ?? 0,
    changePct: data?.net_worth_change_percent ?? 0,
  }
}

// ─── useLocalStorage ──────────────────────────────────────────────────────────
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch {
      console.error(`Failed to set localStorage key "${key}"`)
    }
  }

  return [storedValue, setValue] as const
}
