import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, WifiOff, Lock, ServerCrash } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { cn } from '@lib/utils';

interface FeedbackStateProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  action?: { label: string; onClick: () => void };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

function FeedbackState({ title, description, icon: Icon = AlertTriangle, action, className, size = 'md' }: FeedbackStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        size === 'sm' && 'gap-2 py-8',
        size === 'md' && 'gap-3 py-16',
        size === 'lg' && 'gap-4 py-24',
        className
      )}
    >
      <div className={cn(
        'rounded-2xl bg-muted flex items-center justify-center flex-shrink-0',
        size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12'
      )}>
        <Icon className={cn('text-muted-foreground', size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6')} />
      </div>
      <div className="space-y-1 max-w-sm">
        <p className={cn('font-semibold text-foreground', size === 'sm' ? 'text-sm' : 'text-base')}>{title}</p>
        {description && <p className="text-body-sm text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <Button variant="outline" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}

export function ErrorState({ onRetry, message }: { onRetry?: () => void; message?: string }) {
  return (
    <FeedbackState
      icon={AlertTriangle}
      title="Something went wrong"
      description={message || 'An unexpected error occurred. Please try again.'}
      action={onRetry ? { label: 'Try again', onClick: onRetry } : undefined}
    />
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: { label: string; onClick: () => void } }) {
  return <FeedbackState icon={ServerCrash} title={title} description={description} action={action} />;
}

export function OfflineState() {
  return (
    <FeedbackState
      icon={WifiOff}
      title="You're offline"
      description="Check your internet connection and try again."
      action={{ label: 'Retry', onClick: () => window.location.reload() }}
    />
  );
}

export function UnauthorizedState() {
  return (
    <FeedbackState
      icon={Lock}
      title="Access denied"
      description="You don't have permission to view this content."
    />
  );
}
