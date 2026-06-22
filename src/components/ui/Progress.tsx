import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  className?: string
  variant?: 'default' | 'accent' | 'gold' | 'success'
}

function Progress({ value, className, variant = 'default' }: ProgressProps) {
  const variants = {
    default: 'bg-odyssey-accent',
    accent: 'bg-gradient-to-r from-odyssey-accent to-odyssey-accent-glow',
    gold: 'bg-gradient-to-r from-odyssey-gold to-orange-400',
    success: 'bg-gradient-to-r from-green-500 to-emerald-400',
  }

  return (
    <div
      className={cn(
        'h-2 w-full overflow-hidden rounded-full bg-odyssey-bg',
        className
      )}
    >
      <div
        className={cn(
          'h-full rounded-full transition-all duration-1000 ease-out',
          variants[variant]
        )}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  )
}

export { Progress }
