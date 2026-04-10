'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const FEATURES = [
  { icon: '🧠', title: 'AI Financial Advisor', desc: 'Claude analyzes your complete financial picture and tells you exactly what to do — not just what happened.' },
  { icon: '📊', title: 'Unified Dashboard', desc: 'Income, expenses, investments, and net worth — all in one place, updated in real time.' },
  { icon: '🔮', title: 'Cashflow Forecasting', desc: 'See 90 days into the future. Get warned before you run short, not after.' },
  { icon: '💬', title: 'Conversational Advisor', desc: '"Should I pay off debt or invest?" Ask anything. Get answers grounded in your real financial data.' },
  { icon: '🎯', title: 'Goal Tracking', desc: 'Set financial goals and let AI optimize your path to reach them faster.' },
  { icon: '⚡', title: 'Proactive Insights', desc: 'Weekly AI summaries surface risks, savings opportunities, and investment suggestions automatically.' },
]

const STATS = [
  { value: '$2,340', label: 'Average monthly savings found' },
  { value: '94%', label: 'Users feel more financially confident' },
  { value: '3 min', label: 'Average setup time' },
  { value: '10K+', label: 'Transactions analyzed daily' },
]

const TESTIMONIALS = [
  { name: 'Sarah K.', role: 'Product Designer', text: 'FlowAI found $340/month in subscriptions I forgot about. That\'s $4,000 a year. The AI advisor is like having a CFO in my pocket.' },
  { name: 'Marcus T.', role: 'Software Engineer', text: 'Finally a finance app that tells me what to *do*, not just what *happened*. The investment allocation suggestions alone are worth it.' },
  { name: 'Priya M.', role: 'Marketing Manager', text: 'The cashflow forecasting saved me from a $800 overdraft. It warned me 12 days before I would have had a problem.' },
]

export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ fontFamily: 'var(--font-dm-sans, DM Sans, sans-serif)', background: '#080c10', color: '#f8fafb', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrollY > 40 ? 'rgba(8,12,16,0.92)' : 'transparent',
        backdropFilter: scrollY > 40 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 40 ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '20px', letterSpacing: '-0.02em' }}>
          <span style={{ color: '#14b8a6' }}>Flow</span><span style={{ color: '#f8fafb' }}>AI</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#features" style={{ fontSize: '14px', color: '#9aaab4', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f8fafb')}
            onMouseLeave={e => (e.currentTarget.style.color = '#9aaab4')}>Features</a>
          <a href="#pricing" style={{ fontSize: '14px', color: '#9aaab4', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f8fafb')}
            onMouseLeave={e => (e.currentTarget.style.color = '#9aaab4')}>Pricing</a>
          <Link href="/dashboard" style={{
            padding: '8px 20px', background: '#14b8a6', color: '#042f2e', borderRadius: '100px',
            fontSize: '13px', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.01em',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#0d9488' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#14b8a6' }}>
            Open App →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '8rem 2rem 4rem', position: 'relative' }}>
        {/* Radial glow */}
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(20,184,166,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        {/* Grid lines */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: '760px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: '100px', fontSize: '12px', color: '#5eead4', marginBottom: '2rem', letterSpacing: '0.05em', fontWeight: 500 }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#14b8a6', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
            AI-powered by Claude — Anthropic
          </div>

          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2.8rem, 8vw, 5.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '1.5rem' }}>
            Your money,<br />
            <span style={{ color: '#14b8a6' }}>finally thinking</span><br />
            for itself.
          </h1>

          <p style={{ fontSize: '18px', color: '#9aaab4', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '520px', margin: '0 auto 2.5rem' }}>
            FlowAI tracks your income, expenses, and investments — then uses AI to tell you exactly what to do with your money. Not a tracker. An advisor.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard" style={{
              padding: '14px 32px', background: '#14b8a6', color: '#042f2e', borderRadius: '100px',
              fontSize: '15px', fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.01em',
              boxShadow: '0 0 40px rgba(20,184,166,0.3)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 60px rgba(20,184,166,0.4)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(20,184,166,0.3)' }}>
              Start for free — no credit card
            </Link>
            <a href="#features" style={{
              padding: '14px 32px', background: 'rgba(255,255,255,0.06)', color: '#f8fafb', borderRadius: '100px',
              fontSize: '15px', fontWeight: 500, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.2s',
            }}>
              See how it works
            </a>
          </div>

          <div style={{ marginTop: '1.5rem', fontSize: '12px', color: '#627282', display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <span>✓ Bank-level security</span>
            <span>✓ Read-only bank access</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          {STATS.map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#14b8a6', letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: '#627282', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
              Everything your money needs.
            </h2>
            <p style={{ color: '#9aaab4', fontSize: '17px', maxWidth: '480px', margin: '0 auto' }}>
              Built from the ground up around AI — not bolted on as an afterthought.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                padding: '1.75rem', borderRadius: '16px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(20,184,166,0.05)'; el.style.border = '1px solid rgba(20,184,166,0.2)'; el.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.03)'; el.style.border = '1px solid rgba(255,255,255,0.07)'; el.style.transform = 'translateY(0)' }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{f.icon}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '8px', letterSpacing: '-0.01em' }}>{f.title}</div>
                <div style={{ fontSize: '14px', color: '#9aaab4', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '3rem' }}>Loved by people who care about money.</h2>
          <div style={{ position: 'relative', minHeight: '180px' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                opacity: i === activeTestimonial ? 1 : 0,
                transform: i === activeTestimonial ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 0.5s ease',
                pointerEvents: i === activeTestimonial ? 'auto' : 'none',
              }}>
                <p style={{ fontSize: '18px', lineHeight: 1.7, color: '#d1d9de', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ fontSize: '13px', color: '#627282' }}>
                  <strong style={{ color: '#9aaab4' }}>{t.name}</strong> · {t.role}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '2rem' }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)} style={{
                width: '8px', height: '8px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: i === activeTestimonial ? '#14b8a6' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.2s', padding: 0,
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>Simple, honest pricing.</h2>
          <p style={{ color: '#9aaab4', fontSize: '16px', marginBottom: '3rem' }}>No ads. No selling your data. Just tools that make you richer.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {[
              { plan: 'Free', price: '$0', period: 'forever', features: ['Manual transaction entry', 'Basic budgets (3 categories)', '5 AI insights per month', 'Dashboard & reports'], cta: 'Start free', highlight: false },
              { plan: 'Pro', price: '$8', period: 'per month', features: ['Bank sync via Plaid', 'Unlimited budgets & goals', 'Unlimited AI advisor chat', 'Investment tracking', 'Cashflow forecasting', 'Weekly AI digest emails', 'CSV/PDF exports'], cta: 'Start 7-day trial', highlight: true },
            ].map((p) => (
              <div key={p.plan} style={{
                padding: '2rem', borderRadius: '20px',
                background: p.highlight ? 'rgba(20,184,166,0.08)' : 'rgba(255,255,255,0.03)',
                border: p.highlight ? '1px solid rgba(20,184,166,0.3)' : '1px solid rgba(255,255,255,0.07)',
                textAlign: 'left',
              }}>
                {p.highlight && <div style={{ fontSize: '11px', fontWeight: 600, color: '#14b8a6', letterSpacing: '0.08em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Most popular</div>}
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.25rem' }}>{p.plan}</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: p.highlight ? '#14b8a6' : '#f8fafb', letterSpacing: '-0.04em', marginBottom: '0.25rem' }}>{p.price}</div>
                <div style={{ fontSize: '13px', color: '#627282', marginBottom: '1.5rem' }}>{p.period}</div>
                {p.features.map((f) => (
                  <div key={f} style={{ fontSize: '14px', color: '#9aaab4', padding: '5px 0', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <span style={{ color: '#14b8a6', flexShrink: 0 }}>✓</span> {f}
                  </div>
                ))}
                <Link href="/dashboard" style={{
                  display: 'block', marginTop: '1.5rem', textAlign: 'center',
                  padding: '11px 20px', borderRadius: '100px',
                  background: p.highlight ? '#14b8a6' : 'rgba(255,255,255,0.08)',
                  color: p.highlight ? '#042f2e' : '#f8fafb',
                  fontSize: '14px', fontWeight: 600, textDecoration: 'none',
                  transition: 'all 0.15s',
                }}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Ready to meet your AI financial advisor?
          </h2>
          <p style={{ color: '#9aaab4', marginBottom: '2rem', fontSize: '16px' }}>Setup takes 3 minutes. Your first AI insights arrive in seconds.</p>
          <Link href="/dashboard" style={{
            display: 'inline-block', padding: '16px 40px', background: '#14b8a6', color: '#042f2e',
            borderRadius: '100px', fontSize: '16px', fontWeight: 700, textDecoration: 'none',
            letterSpacing: '-0.01em', boxShadow: '0 0 60px rgba(20,184,166,0.3)',
          }}>
            Open FlowAI — it&apos;s free to start
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', fontSize: '13px', color: '#627282' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: '0.5rem' }}>
          <span style={{ color: '#14b8a6' }}>Flow</span><span>AI</span>
        </div>
        <div>Not financial advice. AI responses are informational only. Always consult a licensed financial advisor for major decisions.</div>
        <div style={{ marginTop: '0.5rem' }}>© 2026 FlowAI · Privacy · Terms</div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
