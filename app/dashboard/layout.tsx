'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { getIcon } from '@/lib/icon-map'
import { Settings } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard',              label: 'Dashboard',    icon: 'barChart' },
  { href: '/dashboard/transactions', label: 'Transactions', icon: 'dollarSign' },
  { href: '/dashboard/budgets',      label: 'Budgets',      icon: 'zap' },
  { href: '/dashboard/investments',  label: 'Investments',  icon: 'trendingUp' },
  { href: '/dashboard/accounts',     label: 'Accounts',     icon: 'building' },
  { href: '/dashboard/advisor',      label: 'AI Advisor',   icon: 'brain', highlight: true },
  { href: '/dashboard/goals',        label: 'Goals',        icon: 'target' },
  { href: '/dashboard/analytics',   label: 'Analytics',    icon: 'barChart' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f4f6' }}>
      <aside style={{
        width: collapsed ? '64px' : '224px', flexShrink: 0, background: '#1e1b4b',
        display: 'flex', flexDirection: 'column', position: 'fixed',
        top: 0, left: 0, bottom: 0, zIndex: 50,
        transition: 'width 0.25s cubic-bezier(0.16,1,0.3,1)', overflow: 'hidden',
      }}>
        <div style={{ padding: collapsed ? '1.25rem 0' : '1.25rem 1rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', minHeight: '64px' }}>
          {!collapsed && (
            <Link href="/dashboard" style={{ textDecoration: 'none', flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-0.02em' }}>
                <span style={{ color: '#9333ea' }}>Flow</span><span style={{ color: '#f8fafb' }}>AI</span>
              </div>
              <div style={{ fontSize: '10px', color: '#627282', marginTop: '1px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>AI Advisor</div>
            </Link>
          )}
          <button onClick={() => setCollapsed(c => !c)} style={{
            background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '6px',
            width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#627282', fontSize: '12px', flexShrink: 0,
          }}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {!collapsed && (
          <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #9333ea, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'white', flexShrink: 0 }}>A</div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 500, color: '#f1f4f6' }}>Alex Johnson</div>
              <div style={{ fontSize: '10px', color: '#627282' }}>Pro plan</div>
            </div>
          </div>
        )}

        <nav style={{ flex: 1, padding: collapsed ? '0.75rem 0.5rem' : '0.75rem', overflowY: 'auto', overflowX: 'hidden' }}>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            const Icon = getIcon(item.icon)
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none', display: 'block' }}>
                <div title={collapsed ? item.label : undefined} style={{
                  display: 'flex', alignItems: 'center', gap: collapsed ? 0 : '10px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  padding: collapsed ? '10px' : '8px 10px', borderRadius: '8px', marginBottom: '2px',
                  background: active ? 'rgba(147,51,234,0.12)' : item.highlight && !active ? 'rgba(147,51,234,0.06)' : 'transparent',
                  border: active ? '1px solid rgba(147,51,234,0.25)' : item.highlight && !active ? '1px solid rgba(147,51,234,0.12)' : '1px solid transparent',
                  color: active ? '#d8b4fe' : item.highlight ? '#e9d5ff' : '#9aaab4',
                  fontSize: '13px', fontWeight: active ? 500 : 400, transition: 'all 0.15s', cursor: 'pointer', whiteSpace: 'nowrap',
                }}>
                  {Icon && <Icon size={18} style={{ flexShrink: 0, width: '18px', textAlign: 'center' }} />}
                  {!collapsed && item.label}
                  {!collapsed && item.highlight && !active && (
                    <span style={{ marginLeft: 'auto', fontSize: '9px', padding: '1px 5px', background: 'rgba(147,51,234,0.2)', color: '#d8b4fe', borderRadius: '3px', fontWeight: 600 }}>AI</span>
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: collapsed ? '0.75rem 0.5rem' : '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/dashboard/settings" style={{ textDecoration: 'none', display: 'block' }}>
            <div title={collapsed ? 'Settings' : undefined} style={{
              display: 'flex', alignItems: 'center', gap: collapsed ? 0 : '10px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: collapsed ? '10px' : '8px 10px', borderRadius: '8px',
              color: '#627282', fontSize: '13px', transition: 'all 0.15s', cursor: 'pointer',
            }}>
              <Settings size={18} style={{ flexShrink: 0 }} />
              {!collapsed && 'Settings'}
            </div>
          </Link>
        </div>
      </aside>

      <main style={{ flex: 1, marginLeft: collapsed ? '64px' : '224px', minHeight: '100vh', display: 'flex', flexDirection: 'column', transition: 'margin-left 0.25s cubic-bezier(0.16,1,0.3,1)' }}>
        <header style={{ height: '60px', background: 'white', borderBottom: '1px solid #e9d5ff', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
          <div style={{ fontSize: '13px', color: '#9aaab4' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <Link href="/dashboard/advisor" style={{ textDecoration: 'none' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f9f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px', color: '#9333ea' }}>🔔</div>
              </Link>
              <div style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e', border: '2px solid white' }} />
            </div>
            <Link href="/dashboard/settings" style={{ textDecoration: 'none' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #9333ea, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'white', cursor: 'pointer' }}>A</div>
            </Link>
          </div>
        </header>
        <div style={{ flex: 1, padding: '1.5rem', background: '#f9f5ff' }}>{children}</div>
      </main>
    </div>
  )
}
