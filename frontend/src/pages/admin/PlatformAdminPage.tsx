import React from 'react';
import { TenantAdminPanel } from '@components/platform-admin/TenantAdminPanel';
import { BillingDashboard } from '@components/platform-admin/BillingDashboard';
import { FeatureFlagManager } from '@components/platform-admin/FeatureFlagManager';
import { SupportAuditCenter } from '@components/platform-admin/SupportAuditCenter';
import { Badge } from '@components/ui/Badge';

export default function PlatformAdminPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Enterprise Multi-Tenant Administration, Billing & Global Operations
          </h1>
          <Badge variant="default" size="sm">Phase F14 Enterprise</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Multi-tenant management, subscription billing with Stripe & Razorpay, feature flag governance, support center, and admin audit trail.
        </p>
      </div>

      {/* Billing Dashboard */}
      <BillingDashboard />

      {/* Tenant Admin Panel */}
      <TenantAdminPanel />

      {/* Feature Flag Manager */}
      <FeatureFlagManager />

      {/* Support & Audit Center */}
      <SupportAuditCenter />
    </div>
  );
}
