// ─── Browser client (for Client Components) ──────────────────────────────────
import { createBrowserClient } from '@supabase/ssr'

const IS_DEMO = !process.env.NEXT_PUBLIC_SUPABASE_URL

export function createClient() {
  if (IS_DEMO) {
    // Demo mode stub — no real Supabase
    return {
      auth: {
        signInWithPassword: async () => ({ error: null, data: { user: { id: 'demo' } } }),
        signInWithOtp: async () => ({ error: null }),
        signInWithOAuth: async () => ({ error: null }),
        signUp: async () => ({ error: null, data: { user: null } }),
        signOut: async () => ({ error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
        insert: async () => ({ error: null }),
        update: () => ({ eq: async () => ({ error: null }) }),
        delete: () => ({ eq: async () => ({ error: null }) }),
      }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ─── Type-safe database helpers ───────────────────────────────────────────────
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string; email: string; name: string | null; avatar_url: string | null
          currency: string; timezone: string; monthly_income: number | null
          created_at: string; updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      accounts: {
        Row: {
          id: string; user_id: string; name: string; type: string
          institution: string | null; balance: number; currency: string
          color: string | null; icon: string | null; is_active: boolean
          plaid_account_id: string | null; last_synced: string | null; created_at: string
        }
        Insert: Omit<Database['public']['Tables']['accounts']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['accounts']['Insert']>
      }
      transactions: {
        Row: {
          id: string; user_id: string; account_id: string; amount: number
          type: string; category_id: string | null; merchant: string | null
          description: string; date: string; is_recurring: boolean
          recurring_frequency: string | null; plaid_tx_id: string | null
          ai_category_confidence: number | null; notes: string | null
          tags: string[]; created_at: string
        }
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>
      }
      categories: {
        Row: {
          id: string; user_id: string; name: string; icon: string
          color: string; type: string; parent_id: string | null; is_system: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      budgets: {
        Row: {
          id: string; user_id: string; category_id: string; amount: number
          period: string; rollover: boolean; alert_at_percent: number
          month_year: string; created_at: string
        }
        Insert: Omit<Database['public']['Tables']['budgets']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['budgets']['Insert']>
      }
      investments: {
        Row: {
          id: string; user_id: string; account_id: string | null; symbol: string | null
          name: string; type: string; quantity: number; avg_cost: number
          current_price: number; last_updated: string; created_at: string
        }
        Insert: Omit<Database['public']['Tables']['investments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['investments']['Insert']>
      }
      goals: {
        Row: {
          id: string; user_id: string; name: string; target_amount: number
          current_amount: number; target_date: string | null; category: string
          icon: string; color: string; is_completed: boolean; created_at: string
        }
        Insert: Omit<Database['public']['Tables']['goals']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['goals']['Insert']>
      }
      ai_insights: {
        Row: {
          id: string; user_id: string; type: string; title: string; body: string
          action: string | null; severity: string; is_read: boolean
          generated_at: string; expires_at: string | null; context: Record<string, unknown> | null
        }
        Insert: Omit<Database['public']['Tables']['ai_insights']['Row'], 'id' | 'generated_at'>
        Update: Partial<Database['public']['Tables']['ai_insights']['Insert']>
      }
      chat_sessions: {
        Row: {
          id: string; user_id: string; title: string; messages: unknown[]
          context_snapshot: unknown | null; created_at: string; updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['chat_sessions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['chat_sessions']['Insert']>
      }
    }
  }
}
