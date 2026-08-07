import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary ring-primary/20',
        secondary: 'bg-muted text-muted-foreground ring-border',
        success: 'bg-success-subtle text-success ring-success/20',
        warning: 'bg-warning-subtle text-warning ring-warning/20',
        danger: 'bg-danger-subtle text-danger ring-danger/20',
        info: 'bg-info-subtle text-info ring-info/20',
        outline: 'border border-border text-foreground bg-transparent ring-transparent',
        brand: 'bg-brand-500/10 text-brand-600 ring-brand-500/20 dark:text-brand-400',
      },
      size: {
        sm: 'text-[10px] px-1.5 py-px',
        md: 'text-xs px-2 py-0.5',
        lg: 'text-sm px-2.5 py-1',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full flex-shrink-0',
          variant === 'success' ? 'bg-success' :
          variant === 'warning' ? 'bg-warning' :
          variant === 'danger' ? 'bg-danger' :
          variant === 'info' ? 'bg-info' : 'bg-primary'
        )} />
      )}
      {children}
    </span>
  );
}
