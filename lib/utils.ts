import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  amount: number,
  currency = 'USD',
  compact = false
): string {
  if (compact && Math.abs(amount) >= 1000) {
    const abs = Math.abs(amount)
    const sign = amount < 0 ? '-' : ''
    if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`
    if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr: string, formatStr = 'MMM d, yyyy'): string {
  try {
    return format(parseISO(dateStr), formatStr)
  } catch {
    return dateStr
  }
}

export function formatRelativeDate(dateStr: string): string {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true })
  } catch {
    return dateStr
  }
}

export function formatPercent(value: number, showSign = false): string {
  const sign = showSign && value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

export function getChangeColor(change: number): string {
  if (change > 0) return 'text-positive-700'
  if (change < 0) return 'text-negative-700'
  return 'text-surface-500'
}

export function getChangeIcon(change: number): string {
  if (change > 0) return '↑'
  if (change < 0) return '↓'
  return '→'
}

export function getBudgetColor(percentUsed: number): string {
  if (percentUsed >= 100) return '#f43f5e'
  if (percentUsed >= 80) return '#f59e0b'
  return '#14b8a6'
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((groups, item) => {
    const group = String(item[key])
    return { ...groups, [group]: [...(groups[group] || []), item] }
  }, {} as Record<string, T[]>)
}

export function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0)
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max)
}
