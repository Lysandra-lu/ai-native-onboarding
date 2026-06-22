import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-12 w-full rounded-xl border border-odyssey-border bg-odyssey-bg px-4 py-2 text-sm text-odyssey-text placeholder:text-odyssey-muted focus:outline-none focus:border-odyssey-accent/50 focus:ring-2 focus:ring-odyssey-accent/20 transition-all duration-200',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'
export { Input }
