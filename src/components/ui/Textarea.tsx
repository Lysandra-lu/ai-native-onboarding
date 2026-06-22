import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[120px] w-full rounded-xl border border-odyssey-border bg-odyssey-bg px-4 py-3 text-sm text-odyssey-text placeholder:text-odyssey-muted focus:outline-none focus:border-odyssey-accent/50 focus:ring-2 focus:ring-odyssey-accent/20 transition-all duration-200 resize-y',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'
export { Textarea }
