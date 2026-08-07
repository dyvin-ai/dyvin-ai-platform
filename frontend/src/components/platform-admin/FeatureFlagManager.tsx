import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { ToggleLeft, ToggleRight, Flag, Zap } from 'lucide-react';
import type { FeatureFlagItem } from '@app-types/platform-admin.types';

export function FeatureFlagManager() {
  const FLAGS: FeatureFlagItem[] = [
    { id: 'ff-1', key: 'ai_copilot_v2', name: 'AI Copilot v2.4 Workspace', isEnabled: true, isKillSwitched: false, strategy: 'ALL_USERS' },
    { id: 'ff-2', key: 'advanced_analytics', name: 'Advanced Analytics Dashboard', isEnabled: true, isKillSwitched: false, strategy: 'PERCENTAGE', percentage: 85 },
    { id: 'ff-3', key: 'beta_app_builder', name: 'Beta App Builder Platform', isEnabled: false, isKillSwitched: false, strategy: 'AUDIENCE', percentage: 10 },
    { id: 'ff-4', key: 'dark_mode_v3', name: 'Dark Mode v3 Theme Engine', isEnabled: true, isKillSwitched: false, strategy: 'ALL_USERS' },
  ];

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Flag className="w-5 h-5 text-indigo-400" /> Feature Flags & Dynamic Configuration
        </CardTitle>
        <Badge variant="outline" className="font-mono">
          {FLAGS.filter((f) => f.isEnabled).length}/{FLAGS.length} Active
        </Badge>
      </CardHeader>

      <div className="space-y-2.5 pt-2 text-xs">
        {FLAGS.map((flag) => (
          <div
            key={flag.id}
            className="p-3.5 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {flag.isEnabled ? (
                <ToggleRight className="w-5 h-5 text-emerald-400" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <h4 className="font-bold text-foreground text-sm">{flag.name}</h4>
                <span className="text-muted-foreground text-[10px] font-mono">key: {flag.key}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" size="sm">{flag.strategy}</Badge>
              {flag.percentage !== undefined && (
                <span className="text-[10px] font-mono text-indigo-400 font-bold">{flag.percentage}%</span>
              )}
              <Badge
                variant={flag.isEnabled ? 'default' : 'outline'}
                className={flag.isEnabled ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : ''}
              >
                {flag.isEnabled ? 'ENABLED' : 'DISABLED'}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
