import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Building2, Users, Globe, ShieldCheck } from 'lucide-react';
import type { TenantItem } from '@app-types/platform-admin.types';

export function TenantAdminPanel() {
  const TENANTS: TenantItem[] = [
    { id: 'tn-1', name: 'Acme Corporation', plan: 'ENTERPRISE', status: 'ACTIVE', usersCount: 342, region: 'US-EAST' },
    { id: 'tn-2', name: 'GlobalTech Industries', plan: 'PROFESSIONAL', status: 'ACTIVE', usersCount: 128, region: 'EU-WEST' },
    { id: 'tn-3', name: 'Nexus Ventures', plan: 'GROWTH', status: 'ACTIVE', usersCount: 56, region: 'APAC' },
  ];

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" /> Multi-Tenant Administration & Quota Management
        </CardTitle>
        <Badge variant="outline" className="font-mono">
          {TENANTS.length} Active Tenants
        </Badge>
      </CardHeader>

      <div className="space-y-3 pt-2 text-xs">
        {TENANTS.map((tenant) => (
          <div
            key={tenant.id}
            className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">{tenant.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="secondary" size="sm">{tenant.plan}</Badge>
                    <span className="text-muted-foreground text-[10px] font-mono">{tenant.region}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-bold block">Users</span>
                  <span className="font-mono font-bold text-foreground">{tenant.usersCount}</span>
                </div>
                <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono">
                  {tenant.status}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
