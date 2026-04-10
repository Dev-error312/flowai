'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error reporting service (e.g. Sentry) in production
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="en">
      <body style={{ fontFamily: 'DM Sans, sans-serif', background: '#f1f4f6', margin: 0 }}>
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '2rem',
        }}>
          <div style={{ maxWidth: '440px' }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>⚠️</div>
            <h1 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.5rem',
              color: '#111820', marginBottom: '0.5rem', letterSpacing: '-0.03em',
            }}>
              Something went wrong
            </h1>
            <p style={{ color: '#627282', fontSize: '14px', lineHeight: 1.6, marginBottom: '2rem' }}>
              FlowAI hit an unexpected error. Your financial data is safe — this is a display issue only.
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={reset}
                style={{
                  padding: '10px 24px', borderRadius: '10px', border: 'none',
                  background: '#14b8a6', color: '#042f2e', fontSize: '14px',
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                }}
              >
                Try again
              </button>
              <Link
                href="/dashboard"
                style={{
                  padding: '10px 24px', borderRadius: '10px', border: '1px solid #e5eaed',
                  background: 'white', color: '#627282', fontSize: '14px',
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
                }}
              >
                Go to dashboard
              </Link>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details style={{
                marginTop: '2rem', background: '#fff1f2', border: '1px solid #fecdd3',
                borderRadius: '10px', padding: '1rem', textAlign: 'left',
              }}>
                <summary style={{ fontSize: '12px', color: '#be123c', cursor: 'pointer', fontWeight: 500 }}>
                  Error details (dev only)
                </summary>
                <pre style={{
                  marginTop: '0.5rem', fontSize: '11px', color: '#be123c',
                  overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                }}>
                  {error.message}
                  {error.digest && `\nDigest: ${error.digest}`}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}
