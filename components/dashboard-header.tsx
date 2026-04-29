'use client'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { useEffect, useState } from 'react'

export function DashboardHeader() {
  const [date, setDate] = useState('')

  useEffect(() => {
    setDate(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
  }, [])

  return (
    <header style={{ height: '60px', background: 'white', borderBottom: '1px solid #e9d5ff', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
      <div style={{ fontSize: '13px', color: '#9aaab4', minHeight: '20px' }}>
        {date}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ position: 'relative' }}>
          <Link href="/dashboard/advisor" style={{ textDecoration: 'none' }}>
            <Bell size={18} style={{ cursor: 'pointer', color: '#9333ea' }} />
          </Link>
          <div style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e', border: '2px solid white' }} />
        </div>
        <Link href="/dashboard/settings" style={{ textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #9333ea, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'white', cursor: 'pointer' }}>A</div>
        </Link>
      </div>
    </header>
  )
}
