-- ═══════════════════════════════════════════════════════
-- FlowAI — Complete Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────
-- 1. USERS (extends Supabase auth.users)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT UNIQUE NOT NULL,
  name         TEXT,
  avatar_url   TEXT,
  currency     TEXT DEFAULT 'USD' CHECK (currency IN ('USD','EUR','GBP','NPR','INR','AUD','CAD')),
  timezone     TEXT DEFAULT 'America/New_York',
  monthly_income NUMERIC(12,2),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create user record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────
-- 2. ACCOUNTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.accounts (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  type              TEXT NOT NULL CHECK (type IN ('checking','savings','investment','credit','loan','cash')),
  institution       TEXT,
  balance           NUMERIC(14,2) DEFAULT 0,
  currency          TEXT DEFAULT 'USD',
  color             TEXT DEFAULT '#14b8a6',
  icon              TEXT DEFAULT 'building',
  is_active         BOOLEAN DEFAULT TRUE,
  plaid_account_id  TEXT UNIQUE,
  last_synced       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_accounts_user_id ON public.accounts(user_id);

-- ─────────────────────────────────────────────
-- 3. CATEGORIES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  icon        TEXT DEFAULT '📦',
  color       TEXT DEFAULT '#9aaab4',
  type        TEXT NOT NULL CHECK (type IN ('income','expense')),
  parent_id   UUID REFERENCES public.categories(id),
  is_system   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_user_id ON public.categories(user_id);

-- Default categories for new users
CREATE OR REPLACE FUNCTION public.create_default_categories(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.categories (user_id, name, icon, color, type, is_system) VALUES
    -- Expenses
    (p_user_id, 'Housing',        'home', '#6366f1', 'expense', TRUE),
    (p_user_id, 'Food & Dining',  'utensils', '#f59e0b', 'expense', TRUE),
    (p_user_id, 'Transportation', 'car', '#3b82f6', 'expense', TRUE),
    (p_user_id, 'Healthcare',     'heart', '#ef4444', 'expense', TRUE),
    (p_user_id, 'Shopping',       'shoppingBag', '#ec4899', 'expense', TRUE),
    (p_user_id, 'Entertainment',  'rocket', '#8b5cf6', 'expense', TRUE),
    (p_user_id, 'Subscriptions',  'smartphone', '#06b6d4', 'expense', TRUE),
    (p_user_id, 'Utilities',      'zap', '#eab308', 'expense', TRUE),
    (p_user_id, 'Travel',         'plane', '#14b8a6', 'expense', TRUE),
    (p_user_id, 'Education',      'book', '#f97316', 'expense', TRUE),
    (p_user_id, 'Savings',        'building', '#22c55e', 'expense', TRUE),
    (p_user_id, 'Investments',    'trendingUp', '#10b981', 'expense', TRUE),
    (p_user_id, 'Other',          'dollarSign', '#9aaab4', 'expense', TRUE),
    -- Income
    (p_user_id, 'Salary',              'dollarSign', '#22c55e', 'income', TRUE),
    (p_user_id, 'Freelance',           'briefcase', '#14b8a6', 'income', TRUE),
    (p_user_id, 'Investment Returns',  'trendingUp', '#10b981', 'income', TRUE),
    (p_user_id, 'Other Income',        'gift', '#f59e0b', 'income', TRUE);
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────
-- 4. TRANSACTIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.transactions (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  account_id              UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  amount                  NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  type                    TEXT NOT NULL CHECK (type IN ('income','expense','transfer')),
  category_id             UUID REFERENCES public.categories(id),
  merchant                TEXT,
  description             TEXT NOT NULL DEFAULT '',
  date                    DATE NOT NULL DEFAULT CURRENT_DATE,
  is_recurring            BOOLEAN DEFAULT FALSE,
  recurring_frequency     TEXT CHECK (recurring_frequency IN ('daily','weekly','monthly','yearly')),
  plaid_tx_id             TEXT UNIQUE,
  ai_category_confidence  NUMERIC(3,2) CHECK (ai_category_confidence BETWEEN 0 AND 1),
  notes                   TEXT,
  tags                    TEXT[] DEFAULT '{}',
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_date ON public.transactions(date DESC);
CREATE INDEX idx_transactions_type ON public.transactions(type);
CREATE INDEX idx_transactions_category ON public.transactions(category_id);
CREATE INDEX idx_transactions_account ON public.transactions(account_id);

-- ─────────────────────────────────────────────
-- 5. BUDGETS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.budgets (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category_id       UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  amount            NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  period            TEXT DEFAULT 'monthly' CHECK (period IN ('monthly','weekly','yearly')),
  rollover          BOOLEAN DEFAULT FALSE,
  alert_at_percent  INTEGER DEFAULT 80 CHECK (alert_at_percent BETWEEN 1 AND 100),
  month_year        TEXT NOT NULL, -- "2024-11"
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category_id, month_year)
);

CREATE INDEX idx_budgets_user_id ON public.budgets(user_id);

-- View: budget with spending
CREATE OR REPLACE VIEW public.budget_summary AS
SELECT
  b.*,
  COALESCE(SUM(t.amount), 0) as spent,
  b.amount - COALESCE(SUM(t.amount), 0) as remaining,
  ROUND((COALESCE(SUM(t.amount), 0) / b.amount) * 100, 1) as percent_used
FROM public.budgets b
LEFT JOIN public.transactions t ON (
  t.category_id = b.category_id
  AND t.user_id = b.user_id
  AND t.type = 'expense'
  AND TO_CHAR(t.date, 'YYYY-MM') = b.month_year
)
GROUP BY b.id;

-- ─────────────────────────────────────────────
-- 6. INVESTMENTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.investments (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  account_id     UUID REFERENCES public.accounts(id),
  symbol         TEXT,
  name           TEXT NOT NULL,
  type           TEXT NOT NULL CHECK (type IN ('stock','etf','crypto','bond','real_estate','mutual_fund','other')),
  quantity       NUMERIC(18,8) NOT NULL,
  avg_cost       NUMERIC(12,4) NOT NULL,
  current_price  NUMERIC(12,4) NOT NULL DEFAULT 0,
  last_updated   TIMESTAMPTZ DEFAULT NOW(),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_investments_user_id ON public.investments(user_id);

-- ─────────────────────────────────────────────
-- 7. GOALS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.goals (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  target_amount    NUMERIC(12,2) NOT NULL CHECK (target_amount > 0),
  current_amount   NUMERIC(12,2) DEFAULT 0,
  target_date      DATE,
  category         TEXT DEFAULT 'other' CHECK (category IN ('emergency','vacation','house','retirement','education','car','other')),
  icon             TEXT DEFAULT 'target',
  color            TEXT DEFAULT '#14b8a6',
  is_completed     BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_goals_user_id ON public.goals(user_id);

-- ─────────────────────────────────────────────
-- 8. AI INSIGHTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ai_insights (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type          TEXT NOT NULL CHECK (type IN ('weekly_review','anomaly','suggestion','risk','investment','cashflow')),
  title         TEXT NOT NULL,
  body          TEXT NOT NULL,
  action        TEXT,
  severity      TEXT DEFAULT 'info' CHECK (severity IN ('positive','info','warning','critical')),
  is_read       BOOLEAN DEFAULT FALSE,
  generated_at  TIMESTAMPTZ DEFAULT NOW(),
  expires_at    TIMESTAMPTZ,
  context       JSONB
);

CREATE INDEX idx_ai_insights_user_id ON public.ai_insights(user_id);
CREATE INDEX idx_ai_insights_is_read ON public.ai_insights(is_read);

-- ─────────────────────────────────────────────
-- 9. CHAT SESSIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title              TEXT DEFAULT 'Financial advice',
  messages           JSONB DEFAULT '[]',
  context_snapshot   JSONB,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);

-- ─────────────────────────────────────────────
-- 10. PLAID ITEMS (encrypted)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.plaid_items (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  access_token_enc TEXT NOT NULL, -- AES-256-GCM encrypted
  institution_id   TEXT,
  institution_name TEXT,
  status           TEXT DEFAULT 'active' CHECK (status IN ('active','error','revoked')),
  cursor           TEXT, -- for incremental sync
  last_sync        TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_plaid_items_user_id ON public.plaid_items(user_id);

-- ─────────────────────────────────────────────
-- 11. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────
ALTER TABLE public.users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plaid_items  ENABLE ROW LEVEL SECURITY;

-- Generic RLS policy helper
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['users','accounts','categories','transactions','budgets','investments','goals','ai_insights','chat_sessions','plaid_items']
  LOOP
    EXECUTE format('
      CREATE POLICY "Users can only access own data" ON public.%I
        FOR ALL USING (user_id = auth.uid())
        WITH CHECK (user_id = auth.uid());
    ', t);
  END LOOP;
END $$;

-- ─────────────────────────────────────────────
-- 12. HELPFUL QUERIES (reference)
-- ─────────────────────────────────────────────

-- Monthly spending by category:
-- SELECT c.name, c.icon, c.color, SUM(t.amount) as total, COUNT(*) as count
-- FROM transactions t JOIN categories c ON t.category_id = c.id
-- WHERE t.user_id = auth.uid()
--   AND t.type = 'expense'
--   AND TO_CHAR(t.date, 'YYYY-MM') = '2024-11'
-- GROUP BY c.id ORDER BY total DESC;

-- Net worth:
-- SELECT
--   SUM(CASE WHEN type NOT IN ('credit','loan') THEN balance ELSE -balance END) as net_worth
-- FROM accounts WHERE user_id = auth.uid() AND is_active = TRUE;

-- Recurring transactions calendar:
-- SELECT * FROM transactions
-- WHERE user_id = auth.uid() AND is_recurring = TRUE
-- ORDER BY date;

COMMENT ON TABLE public.transactions IS 'Core transaction ledger. All AI analysis is derived from this table.';
COMMENT ON TABLE public.plaid_items IS 'Plaid connections. access_token_enc is AES-256-GCM encrypted — never decrypt client-side.';
