import React from 'react';
import { OperationsDashboard } from '@components/autonomous-ops/OperationsDashboard';
import { CopilotPanel } from '@components/autonomous-ops/CopilotPanel';
import { IncidentTimeline } from '@components/autonomous-ops/IncidentTimeline';
import { RootCauseViewer } from '@components/autonomous-ops/RootCauseViewer';
import { Badge } from '@components/ui/Badge';

export default function AutonomousOpsPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Enterprise Autonomous Operations, Copilot & Self-Optimizing Intelligence
          </h1>
          <Badge variant="default" size="sm">Phase F13 Enterprise</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Real-time SRE operational health, AI Copilot assistant workspace, auto-remediation playbook execution, and FinOps infrastructure cost optimization.
        </p>
      </div>

      {/* Main Operations Matrix Card */}
      <OperationsDashboard />

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: AI Copilot Panel */}
        <CopilotPanel />

        {/* Right: Root Cause & Capacity Forecast */}
        <RootCauseViewer />
      </div>

      {/* Incident & Remediation Timeline */}
      <IncidentTimeline />
    </div>
  );
}
