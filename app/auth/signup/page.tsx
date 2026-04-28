'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
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

  const inp: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: '10px',
    border: '1px solid #e5eaed', fontSize: '15px',
    color: '#111820', outline: 'none', background: '#f8fafb', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#f1f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>✉️</div>
          <h1 style={{ fontWeight: 800, fontSize: '24px', color: '#111820', marginBottom: '0.5rem' }}>Check your inbox</h1>
          <p style={{ color: '#627282', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account and start your financial journey.
          </p>
          <Link href="/auth/login" style={{
            display: 'inline-block', padding: '10px 24px', background: '#14b8a6', color: '#042f2e',
            borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 600,
          }}>
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontWeight: 800, fontSize: '28px', letterSpacing: '-0.04em' }}>
              <span style={{ color: '#9333ea' }}>Flow</span><span style={{ color: '#111820' }}>AI</span>
            </div>
          </Link>
          <div style={{ color: '#9aaab4', fontSize: '14px', marginTop: '4px' }}>Start your financial journey</div>
        </div>

        <div style={{ background: 'white', borderRadius: '18px', padding: '2rem', border: '1px solid #e5eaed', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <h1 style={{ fontWeight: 700, fontSize: '22px', color: '#111820', marginBottom: '0.25rem' }}>Create your account</h1>
          <p style={{ color: '#9aaab4', fontSize: '14px', marginBottom: '1.5rem' }}>Free forever. No credit card required.</p>

          <button onClick={handleGoogle} disabled={loading} style={{
            width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid #e5eaed',
            background: 'white', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            color: '#111820', marginBottom: '1rem', fontFamily: 'DM Sans, sans-serif',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
            <div style={{ flex: 1, height: '1px', background: '#e5eaed' }} />
            <span style={{ fontSize: '12px', color: '#9aaab4' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#e5eaed' }} />
          </div>

          <form onSubmit={handleSignup}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#627282', display: 'block', marginBottom: '5px' }}>Full name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Alex Johnson" required style={inp}
                  onFocus={e => { e.currentTarget.style.borderColor = '#14b8a6'; e.currentTarget.style.background = 'white' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e5eaed'; e.currentTarget.style.background = '#f8fafb' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#627282', display: 'block', marginBottom: '5px' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={inp}
                  onFocus={e => { e.currentTarget.style.borderColor = '#14b8a6'; e.currentTarget.style.background = 'white' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e5eaed'; e.currentTarget.style.background = '#f8fafb' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#627282', display: 'block', marginBottom: '5px' }}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" required style={inp}
                  onFocus={e => { e.currentTarget.style.borderColor = '#14b8a6'; e.currentTarget.style.background = 'white' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e5eaed'; e.currentTarget.style.background = '#f8fafb' }} />
                {/* Strength indicator */}
                <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                  {[8, 12, 16].map((threshold, i) => (
                    <div key={i} style={{
                      flex: 1, height: '3px', borderRadius: '2px',
                      background: password.length >= threshold ? (i === 0 ? '#f59e0b' : i === 1 ? '#14b8a6' : '#22c55e') : '#e5eaed',
                      transition: 'background 0.2s',
                    }} />
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '12px', background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
              background: loading ? '#e9d5ff' : '#9333ea', color: loading ? '#9aaab4' : 'white',
              fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}>
              {loading ? 'Creating account...' : 'Create free account'}
            </button>

            <p style={{ fontSize: '11px', color: '#9aaab4', textAlign: 'center', marginTop: '12px', lineHeight: 1.5 }}>
              By signing up you agree to our{' '}
              <Link href="/terms" style={{ color: '#627282' }}>Terms</Link> and{' '}
              <Link href="/privacy" style={{ color: '#627282' }}>Privacy Policy</Link>.
            </p>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '13px', color: '#9aaab4' }}>
            Have an account? <Link href="/auth/login" style={{ color: '#9333ea', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
