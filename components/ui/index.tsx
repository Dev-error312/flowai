import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

// ─── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 border-transparent shadow-lg hover:shadow-xl hover:shadow-brand-500/50',
      secondary: 'bg-white text-surface-700 hover:bg-surface-50 border-surface-200 shadow-sm',
      ghost: 'bg-transparent text-surface-600 hover:bg-surface-100 border-transparent',
      danger: 'bg-negative-50 text-negative-700 hover:bg-negative-100 border-negative-200 shadow-sm',
    }
    const sizes = {
      sm: 'px-3 py-1.5 text-xs rounded-lg font-medium',
      md: 'px-4 py-2.5 text-sm rounded-xl font-medium',
      lg: 'px-6 py-3 text-base rounded-xl font-semibold',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 border font-medium transition-all duration-150',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ className, hover, padding = 'md', children, ...props }: CardProps) {
  const paddings = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-6' }
  return (
    <div
      className={cn(
        'bg-white border border-surface-200 rounded-2xl shadow-md',
        'backdrop-blur-sm',
        hover && 'transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-surface-300 cursor-pointer',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  variant?: 'positive' | 'negative' | 'neutral' | 'brand' | 'warning' | 'info'
  size?: 'sm' | 'md'
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'neutral', size = 'sm', children, className }: BadgeProps) {
  const variants = {
    positive: 'bg-positive-50 text-positive-700 border border-positive-100',
    negative: 'bg-negative-50 text-negative-700 border border-negative-100',
    neutral: 'bg-surface-100 text-surface-700 border border-surface-200',
    brand: 'bg-brand-50 text-brand-700 border border-brand-200',
    warning: 'bg-warning-50 text-warning-700 border border-warning-100',
    info: 'bg-info-50 text-info-700 border border-info-100',
  }
  const sizes = { sm: 'px-2.5 py-1 text-xs font-medium', md: 'px-3.5 py-1.5 text-sm font-medium' }

  return (
    <span className={cn('inline-flex items-center rounded-full', variants[variant], sizes[size], className)}>
      {children}
    </span>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  circle?: boolean
}

export function Skeleton({ className, width, height, circle }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton', circle && 'rounded-full', className)}
      style={{ width, height: height || '1rem' }}
    />
  )
}

export function SkeletonCard() {
  return (
    <Card>
      <Skeleton className="mb-3" width="40%" height="0.75rem" />
      <Skeleton width="60%" height="1.5rem" />
    </Card>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: string
  change?: number
  changeLabel?: string
  icon?: string
  loading?: boolean
}

export function StatCard({ label, value, change, changeLabel, icon, loading }: StatCardProps) {
  if (loading) return <SkeletonCard />

  return (
    <Card className="flex-1">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-medium text-surface-400 uppercase tracking-wide">{label}</span>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-surface-900 font-display tracking-tight mb-1">{value}</div>
      {change !== undefined && (
        <div className={cn('text-xs flex items-center gap-1', change >= 0 ? 'text-positive-700' : 'text-negative-700')}>
          <span>{change >= 0 ? '↑' : '↓'}</span>
          <span>{Math.abs(change).toFixed(1)}% {changeLabel}</span>
        </div>
      )}
    </Card>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <div className="text-sm font-medium text-surface-700 mb-2">{title}</div>
      {description && <div className="text-xs text-surface-400 max-w-xs mb-4">{description}</div>}
      {action && (
        <Button variant="secondary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  prefix?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, prefix, ...props }, ref) => (
    <div>
      {label && (
        <label className="block text-xs font-medium text-surface-500 mb-1.5">{label}</label>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-sm">{prefix}</span>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-xl border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-900',
            'placeholder:text-surface-400 outline-none',
            'focus:border-brand-500 focus:bg-white transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            prefix && 'pl-7',
            error && 'border-negative-400',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-negative-600">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'

// ─── Select ───────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, ...props }, ref) => (
    <div>
      {label && <label className="block text-xs font-medium text-surface-500 mb-1.5">{label}</label>}
      <select
        ref={ref}
        className={cn(
          'w-full rounded-xl border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-900',
          'outline-none focus:border-brand-500 focus:bg-white transition-colors',
          'disabled:opacity-50 cursor-pointer',
          className
        )}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
)
Select.displayName = 'Select'

// ─── Progress Bar ─────────────────────────────────────────────────────────────
interface ProgressBarProps {
  value: number
  max?: number
  color?: string
  height?: number
  animated?: boolean
}

export function ProgressBar({ value, max = 100, color = '#9333ea', height = 6, animated = true }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div style={{ height, background: '#f1f4f6', borderRadius: height / 2, overflow: 'hidden' }}>
      <div style={{
        height: '100%', background: color, borderRadius: height / 2,
        width: `${pct}%`,
        transition: animated ? 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
      }} />
    </div>
  )
}
