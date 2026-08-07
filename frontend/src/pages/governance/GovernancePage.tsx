import React from 'react';
import { useOrgStore } from '@stores/orgStore';
import { GovernancePolicyManager } from '@components/search-intelligence/GovernancePolicyManager';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

export default function GovernancePage() {
  const { activeOrg } = useOrgStore();
  const orgId = activeOrg?.id || 'org-default';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">AI Governance, Risk & Compliance Platform</h1>
          <Badge variant="default" size="sm">SOC2 Type II & ISO27001 Certified</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Responsible AI model guardrails, decision explainability chains, human workflow approvals, and audit log provenance.
        </p>
      </div>

      {/* Main Governance Manager */}
      <GovernancePolicyManager orgId={orgId} />
    </div>
  );
}