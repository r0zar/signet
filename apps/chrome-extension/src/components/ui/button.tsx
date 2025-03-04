import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~utils/components';


const buttonVariants = cva(
  'plasmo-inline-flex plasmo-items-center plasmo-justify-center plasmo-rounded-lg plasmo-text-sm plasmo-font-medium plasmo-transition-all focus-visible:plasmo-outline-none focus-visible:plasmo-ring-2 focus-visible:plasmo-ring-ring focus-visible:plasmo-ring-offset-2 disabled:plasmo-pointer-events-none disabled:plasmo-opacity-50',
  {
    variants: {
      variant: {
        default: 'plasmo-bg-primary plasmo-text-primary-foreground hover:plasmo-opacity-90 plasmo-shadow-glow',
        destructive:
          'plasmo-bg-destructive plasmo-text-destructive-foreground hover:plasmo-opacity-90',
        outline:
          'plasmo-border plasmo-border-border plasmo-bg-transparent hover:plasmo-border-primary-legacy hover:plasmo-bg-primary-legacy/10',
        secondary:
          'plasmo-bg-secondary plasmo-text-secondary-foreground hover:plasmo-opacity-90',
        accent:
          'plasmo-bg-accent plasmo-text-accent-foreground hover:plasmo-opacity-90',
        ghost: 'hover:plasmo-bg-muted',
        link: 'plasmo-text-primary plasmo-underline-offset-4 hover:plasmo-underline',
        
        // Charisma themed variants
        charisma: 'plasmo-bg-gradient-charisma plasmo-text-white plasmo-border-0 hover:plasmo-bg-gradient-charisma-hover plasmo-shadow-glow hover:plasmo-shadow-charisma',
        charismaOutline: 'plasmo-border plasmo-border-border plasmo-bg-transparent plasmo-text-foreground hover:plasmo-border-primary-legacy/50 hover:plasmo-bg-primary-legacy/10',
        charismaSecondary: 'plasmo-bg-secondary-legacy plasmo-text-white plasmo-border-0 hover:plasmo-opacity-90 plasmo-shadow-glow',
        charismaGhost: 'plasmo-bg-transparent plasmo-text-foreground hover:plasmo-bg-primary-legacy/10',
        glassMorph: 'plasmo-bg-gradient-card plasmo-backdrop-blur-md plasmo-text-foreground plasmo-border plasmo-border-border hover:plasmo-border-primary-legacy/30 hover:plasmo-bg-primary-legacy/5',
      },
      size: {
        default: 'plasmo-h-10 plasmo-px-4 plasmo-py-2',
        sm: 'plasmo-h-9 plasmo-rounded-md plasmo-px-3',
        lg: 'plasmo-h-11 plasmo-px-8',
        icon: 'plasmo-h-10 plasmo-w-10',
        xl: 'plasmo-h-12 plasmo-px-6 plasmo-py-3 plasmo-text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
