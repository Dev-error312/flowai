import { NextResponse } from 'next/server'
import { MOCK_DASHBOARD } from '@/lib/mock-data'

export async function GET() {
  // In production: fetch from Supabase with user auth
  // const supabase = createClient()
  // const { data: { user } } = await supabase.auth.getUser()
  // Then query transactions, budgets, investments etc.
  
  return NextResponse.json({ data: MOCK_DASHBOARD })
}
