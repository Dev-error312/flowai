'use client'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '400px', textAlign: 'center',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      <div style={{ fontSize: '40px', marginBottom: '1rem' }}>😕</div>
      <h2 style={{
        fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.25rem',
        color: '#111820', marginBottom: '8px',
      }}>
        This section failed to load
      </h2>
      <p style={{ color: '#9aaab4', fontSize: '14px', marginBottom: '1.5rem', maxWidth: '320px', lineHeight: 1.6 }}>
        {error.message || 'An unexpected error occurred. Your data is safe.'}
      </p>
      <button
        onClick={reset}
        style={{
          padding: '9px 20px', borderRadius: '10px', border: 'none',
          background: '#14b8a6', color: '#042f2e', fontSize: '13px',
          fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
        }}
      >
        Retry
      </button>
    </div>
  )
}
