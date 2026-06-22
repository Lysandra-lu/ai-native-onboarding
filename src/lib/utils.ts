import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function levelToLabel(level: number): string {
  const labels = ['未解锁', 'Lv.1 · 觉醒', 'Lv.2 · 探索', 'Lv.3 · 掌握', 'Lv.4 · 精通', 'Lv.5 · 传奇']
  return labels[level] || '未知'
}

export function levelToColor(level: number): string {
  const colors = [
    'text-odyssey-muted',
    'text-odyssey-cyan',
    'text-blue-400',
    'text-odyssey-accent-glow',
    'text-odyssey-gold',
    'text-orange-400',
  ]
  return colors[level] || colors[0]
}
