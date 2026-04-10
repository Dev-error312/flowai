'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'password' | 'magic'>('password')

  const supabase = createClient()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setError('✓ Check your email — magic link sent!')
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  const handleDemo = () => {
    router.push('/dashboard')
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: '10px',
    border: '1px solid #e5eaed', fontSize: '15px', fontFamily: 'DM Sans, sans-serif',
    color: '#111820', outline: 'none', background: '#f8fafb', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', letterSpacing: '-0.04em' }}>
              <span style={{ color: '#14b8a6' }}>Flow</span><span style={{ color: '#111820' }}>AI</span>
            </div>
          </Link>
          <div style={{ color: '#9aaab4', fontSize: '14px', marginTop: '4px' }}>Your AI financial advisor</div>
        </div>

        <div style={{ background: 'white', borderRadius: '18px', padding: '2rem', border: '1px solid #e5eaed', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '22px', color: '#111820', marginBottom: '0.25rem' }}>Welcome back</h1>
          <p style={{ color: '#9aaab4', fontSize: '14px', marginBottom: '1.5rem' }}>Sign in to your account</p>

          {/* Google OAuth */}
          <button onClick={handleGoogle} disabled={loading} style={{
            width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid #e5eaed',
            background: 'white', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            color: '#111820', marginBottom: '1rem', fontFamily: 'DM Sans, sans-serif',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f8fafb' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'white' }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <div style={{ flex: 1, height: '1px', background: '#e5eaed' }} />
            <span style={{ fontSize: '12px', color: '#9aaab4' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#e5eaed' }} />
          </div>

          {/* Mode toggle */}
          <div style={{ display: 'flex', background: '#f1f4f6', borderRadius: '8px', padding: '3px', marginBottom: '1.25rem' }}>
            {(['password', 'magic'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: '6px', borderRadius: '6px', border: 'none', fontSize: '13px',
                background: mode === m ? 'white' : 'transparent',
                color: mode === m ? '#111820' : '#9aaab4', fontWeight: mode === m ? 500 : 400,
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s',
              }}>
                {m === 'password' ? 'Password' : 'Magic link'}
              </button>
            ))}
          </div>

          <form onSubmit={mode === 'password' ? handleEmailLogin : handleMagicLink}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#627282', display: 'block', marginBottom: '5px' }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required style={inp}
                onFocus={e => { e.currentTarget.style.borderColor = '#14b8a6'; e.currentTarget.style.background = 'white' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#e5eaed'; e.currentTarget.style.background = '#f8fafb' }}
              />
            </div>

            {mode === 'password' && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#627282' }}>Password</label>
                  <Link href="/auth/forgot" style={{ fontSize: '12px', color: '#14b8a6', textDecoration: 'none' }}>Forgot password?</Link>
                </div>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required style={inp}
                  onFocus={e => { e.currentTarget.style.borderColor = '#14b8a6'; e.currentTarget.style.background = 'white' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e5eaed'; e.currentTarget.style.background = '#f8fafb' }}
                />
              </div>
            )}

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '12px',
                background: error.startsWith('✓') ? '#f0fdf4' : '#fff1f2',
                color: error.startsWith('✓') ? '#15803d' : '#be123c',
                border: `1px solid ${error.startsWith('✓') ? '#bbf7d0' : '#fecdd3'}`,
              }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
              background: loading ? '#e5eaed' : '#14b8a6', color: loading ? '#9aaab4' : '#042f2e',
              fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
            }}>
              {loading ? 'Signing in...' : mode === 'password' ? 'Sign in' : 'Send magic link'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '13px', color: '#9aaab4' }}>
            No account? <Link href="/auth/signup" style={{ color: '#14b8a6', textDecoration: 'none', fontWeight: 500 }}>Sign up free</Link>
          </div>
        </div>

        {/* Demo CTA */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button onClick={handleDemo} style={{
            background: 'transparent', border: 'none', color: '#9aaab4', fontSize: '13px', cursor: 'pointer',
            textDecoration: 'underline', textDecorationColor: 'transparent', fontFamily: 'DM Sans, sans-serif',
          }}
            onMouseEnter={e => { (e.currentTarget).style.color = '#627282' }}
            onMouseLeave={e => { (e.currentTarget).style.color = '#9aaab4' }}>
            Or explore demo without signing in →
          </button>
        </div>
      </div>
    </div>
  )
}

// Force dynamic rendering — this page needs browser APIs (Supabase auth)
