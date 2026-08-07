import React from 'react';
import { ObservabilityDashboard } from '@components/observability-platform/ObservabilityDashboard';
import { MetricsConsole } from '@components/observability-platform/MetricsConsole';
import { IncidentLogViewer } from '@components/observability-platform/IncidentLogViewer';
import { CapacitySrePanel } from '@components/observability-platform/CapacitySrePanel';
import { Badge } from '@components/ui/Badge';

export default function ObservabilityPlatformPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Enterprise Observability, Reliability Engineering & Operations Command Center
          </h1>
          <Badge variant="default" size="sm">Phase F15 Enterprise</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Prometheus metrics stream, SLO/SLA error budgets, distributed tracing telemetry, automated incident postmortems, and third-party gateway monitoring.
        </p>
      </div>

      {/* Main Scorecard */}
      <ObservabilityDashboard />

      {/* Metrics Console Stream */}
      <MetricsConsole />

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Incident Postmortem Log */}
        <IncidentLogViewer />

        {/* Right: Infrastructure Dependencies */}
        <CapacitySrePanel />
      </div>
    </div>
  );
}
