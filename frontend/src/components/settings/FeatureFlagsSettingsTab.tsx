import React from 'react';
import { useFeatureFlags, useUpdateFeatureFlag } from '@hooks/useFeatureFlags';
import { Badge } from '@components/ui/Badge';
import { ToggleLeft, Zap, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export function FeatureFlagsSettingsTab() {
  const { data: flags = [], isLoading } = useFeatureFlags();
  const { mutateAsync: updateFlag } = useUpdateFeatureFlag();

  const handleToggle = async (id: string, current: boolean) => {
    try {
      await updateFlag({ id, data: { isEnabled: !current } });
      toast.success('Feature flag updated');
    } catch {
      toast.error('Failed to update feature flag');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-heading-md font-bold text-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-warning" /> Feature Flags & Dynamic Configuration
        </h2>
        <p className="text-body-xs text-muted-foreground">
          View backend feature flag evaluations, rollout strategies, and environment indicators.
        </p>
      </div>

      <div className="p-3 rounded-xl border border-warning/30 bg-warning/5 text-xs text-warning flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 flex-shrink-0" />
        <span>Environment: PRODUCTION • Evaluated dynamically per organization and plan.</span>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-sm text-muted-foreground">Loading feature flags...</div>
      ) : flags.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-border rounded-2xl text-sm text-muted-foreground italic">
          No feature flags registered on the server.
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden bg-card text-xs">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="p-3">Flag Key & Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Strategy</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {flags.map((flag) => (
                <tr key={flag.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div className="font-semibold text-foreground">{flag.name}</div>
                    <code className="text-[11px] text-muted-foreground bg-muted px-1 rounded">{flag.key}</code>
                  </td>
                  <td className="p-3">
                    <Badge variant="secondary" size="sm">{flag.type || 'BOOLEAN'}</Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">{flag.strategy || 'GLOBAL'}</td>
                  <td className="p-3">
                    <Badge variant={flag.isEnabled ? 'success' : 'secondary'} size="sm">
                      {flag.isEnabled ? 'ENABLED' : 'DISABLED'}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggle(flag.id, flag.isEnabled)}
                      className="text-primary hover:underline font-medium text-xs"
                    >
                      {flag.isEnabled ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
