import { NextRequest, NextResponse } from 'next/server'
import { createCipheriv, randomBytes } from 'crypto'

// AES-256-GCM encryption for Plaid access tokens
function encryptToken(plaintext: string, keyHex: string): string {
  const key = Buffer.from(keyHex, 'hex')
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  // Format: iv:authTag:encrypted (all hex)
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`
}

export async function POST(req: NextRequest) {
  try {
    const { public_token, institution_id, institution_name } = await req.json()

    const clientId = process.env.PLAID_CLIENT_ID
    const secret = process.env.PLAID_SECRET
    const encryptionKey = process.env.ENCRYPTION_KEY
    const env = process.env.PLAID_ENV ?? 'sandbox'

    if (!clientId || !secret) {
      // Demo mode
      return NextResponse.json({
        success: true,
        demo: true,
        message: 'Demo mode: bank account simulated as connected',
        accounts: [
          { id: 'demo-checking', name: 'Demo Checking', type: 'checking', balance: 8420.50 },
          { id: 'demo-savings', name: 'Demo Savings', type: 'savings', balance: 24800.00 },
        ],
      })
    }

    if (!encryptionKey) {
      return NextResponse.json({ error: 'ENCRYPTION_KEY not configured' }, { status: 500 })
    }

    const plaidBaseUrl = {
      sandbox: 'https://sandbox.plaid.com',
      development: 'https://development.plaid.com',
      production: 'https://production.plaid.com',
    }[env] ?? 'https://sandbox.plaid.com'

    // Exchange public token for access token
    const tokenResponse = await fetch(`${plaidBaseUrl}/item/public_token/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, secret, public_token }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      return NextResponse.json({ error: tokenData.error_message }, { status: 400 })
    }

    const accessToken = tokenData.access_token
    const itemId = tokenData.item_id

    // Encrypt before storing
    const encryptedToken = encryptToken(accessToken, encryptionKey)

    // TODO: Store in Supabase plaid_items table
    // const supabase = await createServerSupabaseClient()
    // await supabase.from('plaid_items').insert({
    //   user_id: user.id,
    //   access_token_enc: encryptedToken,
    //   institution_id,
    //   institution_name,
    //   status: 'active',
    // })

    // Fetch accounts immediately
    const accountsResponse = await fetch(`${plaidBaseUrl}/accounts/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, secret, access_token: accessToken }),
    })

    const accountsData = await accountsResponse.json()

    return NextResponse.json({
      success: true,
      item_id: itemId,
      accounts: accountsData.accounts?.map((a: { account_id: string; name: string; type: string; subtype: string; balances: { current: number; available: number } }) => ({
        id: a.account_id,
        name: a.name,
        type: a.type,
        subtype: a.subtype,
        balance: a.balances.current ?? a.balances.available,
      })) ?? [],
    })

  } catch (err) {
    console.error('Plaid exchange token error:', err)
    return NextResponse.json({ error: 'Failed to connect bank account' }, { status: 500 })
  }
}
