import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost' | 'outline' | 'accent'
  size?: 'sm' | 'md' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const variants = {
      default: 'bg-odyssey-accent text-white hover:bg-odyssey-accent-glow shadow-lg shadow-odyssey-accent/20',
      secondary: 'bg-odyssey-surface text-odyssey-text hover:bg-odyssey-border border border-odyssey-border',
      ghost: 'text-odyssey-muted hover:text-odyssey-text hover:bg-odyssey-surface',
      outline: 'border border-odyssey-border text-odyssey-text hover:bg-odyssey-surface hover:border-odyssey-accent/50',
      accent: 'bg-gradient-to-r from-odyssey-accent to-odyssey-accent-glow text-white hover:from-odyssey-accent-glow hover:to-purple-400 shadow-lg shadow-odyssey-accent/20',
    }
    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-lg',
      md: 'px-5 py-2.5 text-sm rounded-xl',
      lg: 'px-8 py-3.5 text-base rounded-2xl',
    }

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-odyssey-accent/50',
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
export { Button }
