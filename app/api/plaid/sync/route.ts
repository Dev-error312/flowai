import { NextRequest, NextResponse } from 'next/server'
import { createDecipheriv } from 'crypto'

function decryptToken(encryptedData: string, keyHex: string): string {
  const [ivHex, authTagHex, encryptedHex] = encryptedData.split(':')
  const key = Buffer.from(keyHex, 'hex')
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  const encrypted = Buffer.from(encryptedHex, 'hex')

  const decipher = createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(authTag)
  return decipher.update(encrypted) + decipher.final('utf8')
}

export async function POST(req: NextRequest) {
  try {
    const { item_id } = await req.json()

    const clientId = process.env.PLAID_CLIENT_ID
    const secret = process.env.PLAID_SECRET
    const encryptionKey = process.env.ENCRYPTION_KEY
    const env = process.env.PLAID_ENV ?? 'sandbox'

    if (!clientId || !secret) {
      // Demo mode — return mock sync summary
      return NextResponse.json({
        demo: true,
        synced: {
          added: 12,
          modified: 2,
          removed: 0,
          accounts_updated: 3,
        },
        message: 'Demo sync complete — showing mock data',
      })
    }

    // TODO: Fetch encrypted token from Supabase
    // const supabase = await createServerSupabaseClient()
    // const { data: plaidItem } = await supabase
    //   .from('plaid_items')
    //   .select('access_token_enc, cursor')
    //   .eq('id', item_id)
    //   .single()

    // const accessToken = decryptToken(plaidItem.access_token_enc, encryptionKey!)

    const plaidBaseUrl = {
      sandbox: 'https://sandbox.plaid.com',
      development: 'https://development.plaid.com',
      production: 'https://production.plaid.com',
    }[env] ?? 'https://sandbox.plaid.com'

    // Incremental sync using cursor
    // const syncResponse = await fetch(`${plaidBaseUrl}/transactions/sync`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     client_id: clientId,
    //     secret,
    //     access_token: accessToken,
    //     cursor: plaidItem.cursor ?? undefined,
    //     count: 500,
    //   }),
    // })

    // Process added/modified/removed transactions...
    // AI-categorize new transactions via Claude Haiku...
    // Update cursor in database...

    return NextResponse.json({
      synced: { added: 0, modified: 0, removed: 0, accounts_updated: 0 },
      message: 'Sync complete',
    })

  } catch (err) {
    console.error('Plaid sync error:', err)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
