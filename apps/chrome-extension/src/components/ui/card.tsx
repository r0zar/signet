import * as React from 'react'
import { cn } from '~utils/components'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glassMorph' | 'shadow' | 'simple'
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default: 'plasmo-border plasmo-border-border plasmo-bg-card plasmo-shadow-sm',
      glassMorph: 'plasmo-border plasmo-border-border plasmo-bg-gradient-card plasmo-backdrop-blur-md plasmo-shadow-charisma',
      shadow: 'plasmo-border-0 plasmo-bg-muted plasmo-shadow-charisma',
      simple: 'plasmo-border plasmo-border-border plasmo-bg-transparent'
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          'plasmo-rounded-lg',
          variantClasses[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('plasmo-flex plasmo-flex-col plasmo-space-y-1.5 plasmo-p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'plasmo-text-2xl plasmo-font-semibold plasmo-leading-none plasmo-tracking-tight plasmo-text-foreground',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('plasmo-text-sm plasmo-text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('plasmo-p-6 plasmo-pt-0', className)}
    {...props}
  />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('plasmo-flex plasmo-items-center plasmo-p-6 plasmo-pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }