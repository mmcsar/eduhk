'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const buttonVariants = {
  primary: 'bg-gradient-to-r from-amber-500 to-rose-500 text-black shadow-lg hover:opacity-90',
  outline: 'border border-white/30 text-white hover:bg-white/10',
  ghost: 'text-white/70 hover:text-white',
};

type ButtonVariant = keyof typeof buttonVariants;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: ButtonVariant;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : 'button';
    return (
      <Component
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
          buttonVariants[variant],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
