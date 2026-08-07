import React from 'react';
import { Card } from '@components/ui/Card';

interface CategoryBreakdownProps {
  categories: string[];
  scores: number[];
}

export function CategoryBreakdownBar({ categories, scores }: CategoryBreakdownProps) {
  return (
    <Card className="p-5 bg-card border border-border rounded-xl space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Category Performance Breakdown</h3>
      <div className="space-y-3">
        {categories.map((cat, idx) => {
          const score = scores[idx] ?? 0;
          return (
            <div key={cat} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{cat}</span>
                <span className="font-bold text-primary">{score}/100</span>
              </div>
              <div className="w-full bg-muted/40 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary/80 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
