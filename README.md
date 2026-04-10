# FlowAI — AI-Powered Personal Finance Tracker

> Your money, finally thinking for itself.

FlowAI is a production-ready AI financial advisor built with Next.js 14, Supabase, and Claude (Anthropic). It tracks income, expenses, and investments — and uses Claude to proactively tell you what to do with your money, not just what happened to it.

---

## 🚀 Quick Start (Demo mode — no API keys needed)

```bash
# Clone and install
git clone https://github.com/yourname/flowai
cd flowai
npm install

# Run (works without any API keys in demo mode)
npm run dev

# Open http://localhost:3000
```

The app runs fully in **demo mode** with realistic mock financial data. AI chat uses pre-built responses. Connect your API keys to enable live Claude AI.

---

## 📁 Project Structure

```
flowai/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Design system CSS
│   ├── api/
│   │   ├── ai/
│   │   │   ├── chat/route.ts       # Streaming Claude advisor
│   │   │   └── insights/route.ts  # AI insight generation
│   │   ├── dashboard/route.ts      # Dashboard data API
│   │   └── transactions/route.ts  # Transactions CRUD API
│   └── dashboard/
│       ├── layout.tsx              # Sidebar navigation
│       ├── page.tsx                # Main dashboard
│       ├── transactions/page.tsx   # Transaction management
│       ├── budgets/page.tsx        # Budget tracking
│       ├── investments/page.tsx    # Portfolio view
│       ├── goals/page.tsx          # Financial goals
│       ├── advisor/page.tsx        # AI chat interface
│       └── analytics/page.tsx     # Spending analytics
├── lib/
│   ├── mock-data.ts               # Realistic demo data
│   └── utils.ts                   # Utilities (formatCurrency etc)
├── types/
│   └── index.ts                   # All TypeScript types
├── supabase/
│   └── schema.sql                 # Complete DB schema with RLS
├── .env.example                   # Environment variable template
├── tailwind.config.ts             # Design system tokens
└── next.config.js                 # Next.js configuration
```

---

## 🔑 Environment Setup

```bash
cp .env.example .env.local
```

Fill in your keys:

| Variable | Where to get it | Required |
|----------|-----------------|----------|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) | For live AI |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API | For auth + DB |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API | For auth + DB |
| `PLAID_CLIENT_ID` | [dashboard.plaid.com](https://dashboard.plaid.com) | For bank sync |
| `PLAID_SECRET` | Plaid Dashboard | For bank sync |
| `ENCRYPTION_KEY` | `openssl rand -hex 32` | For Plaid token encryption |

---

## 🗄️ Database Setup (Supabase)

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your dashboard
3. Run the entire contents of `supabase/schema.sql`
4. This creates all tables, indexes, RLS policies, and triggers

```bash
# Or use the Supabase CLI
supabase db push
```

---

## 🤖 AI Architecture

### Claude models used
- **`claude-sonnet-4-6`** — Conversational advisor chat (high quality, streaming)
- **`claude-haiku-4-5`** — Batch insight generation (fast, cost-efficient)

### How AI analysis works

```
User Financial Data (Supabase)
         ↓
  Financial Snapshot Builder
  (90-day transactions, budgets, investments, goals)
         ↓
  System Prompt Engineering
  (grounds Claude in specific dollar amounts)
         ↓
  Claude API (streaming SSE)
         ↓
  Structured Response
  (specific advice with action steps)
```

### Prompt engineering strategy
The system prompt enforces:
1. Always cite specific dollar amounts from user data
2. Give one concrete action step per response
3. Use coaching tone (supportive, not alarming)
4. Never give unqualified investment guarantees
5. Reference the user's goals and timeline

### Insight generation (weekly cron)
```
Monday 9am → Cron trigger
→ Build financial snapshot (90-day window)
→ Claude Haiku generates 4 structured insights
→ Stored in ai_insights table
→ Pushed to user dashboard
→ Sent via Resend digest email
```

---

## 🚢 Deployment (Vercel + Supabase)

### 1. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add ANTHROPIC_API_KEY
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add PLAID_CLIENT_ID
vercel env add PLAID_SECRET
vercel env add ENCRYPTION_KEY
```

### 2. Or deploy via GitHub

1. Push to GitHub
2. Connect repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel dashboard
4. Vercel auto-deploys on every push to `main`

### 3. Configure Supabase Auth redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:
```
Site URL: https://your-app.vercel.app
Redirect URLs: https://your-app.vercel.app/auth/callback
```

---

## 🔒 Security

| Layer | Implementation |
|-------|---------------|
| Authentication | Supabase Auth (JWT, auto-refresh) |
| Data isolation | Row Level Security on every table |
| Plaid tokens | AES-256-GCM encrypted at rest |
| HTTPS | Enforced by Vercel, HSTS headers |
| Input validation | Zod schemas on all API routes |
| Rate limiting | Vercel Edge middleware (100 req/min) |
| AI prompt injection | User input sandboxed from system prompt |
| Error messages | Generic errors to client, full logs server-side |

---

## 📊 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 14 (App Router) | RSC, streaming, Vercel-native |
| UI | Tailwind CSS + inline styles | Zero-config, custom design system |
| Charts | Recharts + D3 | Composable, accessible charts |
| Auth | Supabase Auth | JWT, OAuth, RLS integration |
| Database | Supabase (PostgreSQL) | RLS, realtime, pgcrypto |
| AI | Claude (Anthropic) | Best conversational reasoning |
| Bank sync | Plaid | 13,000+ institutions |
| Email | Resend | React Email templates |
| Hosting | Vercel | Zero-config Next.js deploy |
| Types | TypeScript + Zod | End-to-end type safety |

---

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build for production
npm run build
```

---

## 📈 Feature Roadmap

### MVP (current)
- [x] Dashboard with net worth, income, expenses
- [x] Transaction management (add, filter, search)
- [x] Budget tracking with AI alerts
- [x] Investment portfolio view
- [x] Financial goals tracker
- [x] AI advisor chat (Claude-powered)
- [x] Spending analytics (6-month trends)
- [x] Mock data demo mode

### V1 (next 4 weeks)
- [ ] Supabase auth (email + Google)
- [ ] Plaid bank sync integration
- [ ] Real transaction data pipeline
- [ ] Weekly AI insight emails (Resend)
- [ ] Cashflow forecast engine
- [ ] Mobile-responsive polish

### V2 (future)
- [ ] Tax optimization suggestions
- [ ] Retirement planning calculator
- [ ] Multi-currency support
- [ ] Family/household mode
- [ ] Credit score monitoring
- [ ] iOS/Android apps (React Native)

---

## 📄 License

MIT — build on this, launch something, make money.

---

## ⚠️ Disclaimer

FlowAI provides informational guidance only. Not regulated financial advice. Always consult a licensed financial advisor before making major financial decisions. AI responses are based on your transaction data and general financial principles — they do not account for your complete tax situation, legal obligations, or personal circumstances.
