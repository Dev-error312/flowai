import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#f1f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div>
        <div style={{ fontSize: '6rem', fontWeight: 800, color: '#e5eaed', letterSpacing: '-0.05em', lineHeight: 1 }}>404</div>
        <h1 style={{ fontWeight: 700, fontSize: '1.5rem', color: '#111820', marginBottom: '0.5rem', marginTop: '1rem' }}>Page not found</h1>
        <p style={{ color: '#9aaab4', marginBottom: '2rem', fontSize: '15px' }}>
          The page you&apos;re looking for doesn&apos;t exist or was moved.
        </p>
        <Link href="/dashboard" style={{
          padding: '10px 24px', background: '#9333ea', color: 'white',
          borderRadius: '100px', textDecoration: 'none', fontSize: '14px', fontWeight: 600,
        }}>
          Back to dashboard →
        </Link>
      </div>
    </div>
  )
}
