import React from 'react';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ScoreCardItem } from '@app-types/report.types';

interface ScoreCardProps {
  item: ScoreCardItem;
}

export function ScoreCard({ item }: ScoreCardProps) {
  const getBadgeVariant = (status: ScoreCardItem['status']) => {
    switch (status) {
      case 'EXCELLENT':
      case 'GOOD':
        return 'success';
      case 'IMPROVING':
        return 'default';
      case 'STABLE':
        return 'secondary';
      default:
        return 'warning';
    }
  };

  return (
    <Card className="p-4 bg-card border border-border rounded-xl space-y-3 shadow-xs hover:border-primary/50 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{item.title}</span>
        <Badge variant={getBadgeVariant(item.status)} size="sm">
          {item.status}
        </Badge>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-extrabold text-foreground tracking-tight">{item.score}</span>
        <div className="flex items-center gap-1 text-xs font-semibold">
          {item.delta > 0 ? (
            <span className="text-success flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +{item.delta}%
            </span>
          ) : item.delta < 0 ? (
            <span className="text-danger flex items-center gap-0.5">
              <TrendingDown className="w-3.5 h-3.5" /> {item.delta}%
            </span>
          ) : (
            <span className="text-muted-foreground flex items-center gap-0.5">
              <Minus className="w-3.5 h-3.5" /> 0%
            </span>
          )}
        </div>
      </div>

      <div className="w-full bg-muted/40 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-primary h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(Math.max(item.score, 0), 100)}%` }}
        />
      </div>
    </Card>
  );
}
