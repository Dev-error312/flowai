import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const clientId = process.env.PLAID_CLIENT_ID
    const secret = process.env.PLAID_SECRET
    const env = process.env.PLAID_ENV ?? 'sandbox'

    if (!clientId || !secret) {
      // Demo mode — return a mock link token
      return NextResponse.json({
        link_token: 'demo-link-token-' + Date.now(),
        expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        demo: true,
      })
    }

    const plaidBaseUrl = {
      sandbox: 'https://sandbox.plaid.com',
      development: 'https://development.plaid.com',
      production: 'https://production.plaid.com',
    }[env] ?? 'https://sandbox.plaid.com'

    const response = await fetch(`${plaidBaseUrl}/link/token/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        secret,
        client_name: 'FlowAI',
        country_codes: ['US'],
        language: 'en',
        user: { client_user_id: 'user-1' }, // Replace with actual user ID from session
        products: ['transactions', 'investments'],
        transactions: { days_requested: 90 },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Plaid link token error:', data)
      return NextResponse.json({ error: data.error_message ?? 'Failed to create link token' }, { status: 400 })
    }

    return NextResponse.json({
      link_token: data.link_token,
      expiration: data.expiration,
    })

  } catch (err) {
    console.error('Plaid create-link-token error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
