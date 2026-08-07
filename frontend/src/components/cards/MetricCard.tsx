import React from 'react';
import { cn } from '@lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ElementType;
  description?: string;
  className?: string;
  isLoading?: boolean;
}

export function MetricCard({
  label, value, change, changeType = 'neutral', icon: Icon, description, className, isLoading,
}: MetricCardProps) {
  const TrendIcon = changeType === 'positive' ? TrendingUp : changeType === 'negative' ? TrendingDown : Minus;
  const trendColor = changeType === 'positive' ? 'text-success' : changeType === 'negative' ? 'text-danger' : 'text-muted-foreground';

  if (isLoading) {
    return (
      <div className={cn('rounded-xl border border-border bg-card p-5 space-y-3 shadow-card', className)}>
        <div className="h-3 bg-muted rounded shimmer w-24" />
        <div className="h-7 bg-muted rounded shimmer w-16" />
        <div className="h-3 bg-muted rounded shimmer w-20" />
      </div>
    );
  }

  return (
    <div className={cn(
      'rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-md transition-shadow duration-200',
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-label-md text-muted-foreground">{label}</p>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 text-accent-foreground" />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground tracking-tight mb-1">{value}</p>
      {change && (
        <div className={cn('flex items-center gap-1 text-xs font-medium', trendColor)}>
          <TrendIcon className="w-3 h-3" />
          <span>{change}</span>
        </div>
      )}
      {description && <p className="text-body-xs text-muted-foreground mt-1">{description}</p>}
    </div>
  );
}
