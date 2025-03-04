import * as React from 'react'
import { cn } from '~utils/components'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'charisma' | 'glassMorph'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', type, ...props }, ref) => {
    const variantClasses = {
      default: 'plasmo-border-input plasmo-bg-card/40 focus:plasmo-border-primary focus:plasmo-ring-primary',
      charisma: 'plasmo-border-border plasmo-bg-card/40 plasmo-rounded-lg plasmo-text-foreground focus:plasmo-border-primary-legacy focus:plasmo-ring-primary-legacy/30',
      glassMorph: 'plasmo-border-border plasmo-bg-card/50 plasmo-rounded-lg plasmo-text-foreground plasmo-backdrop-blur-md focus:plasmo-border-primary-legacy focus:plasmo-ring-primary-legacy/30'
    }

    return (
      <input
        type={type}
        className={cn(
          'plasmo-flex plasmo-h-10 plasmo-w-full plasmo-rounded-md plasmo-border plasmo-px-3 plasmo-py-2 plasmo-text-sm',
          'focus:plasmo-outline-none focus:plasmo-ring-2 focus:plasmo-ring-offset-0',
          'disabled:plasmo-cursor-not-allowed disabled:plasmo-opacity-50',
          'placeholder:plasmo-text-muted-foreground',
          variantClasses[variant],
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