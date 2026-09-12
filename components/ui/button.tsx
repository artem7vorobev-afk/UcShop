import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-white/[0.06] text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        neon: 'bg-gradient-to-r from-[#ff2d42] to-[#e50914] text-white shadow-[0_4px_24px_rgba(229,9,20,0.4)] hover:shadow-[0_4px_32px_rgba(229,9,20,0.55)] hover:brightness-110',
        neonPurple: 'bg-white/[0.08] text-foreground border border-white/10 hover:bg-white/[0.12]',
      },
      size: {
        default: 'h-11 px-5 py-2',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-13 px-8 text-base h-[52px]',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
