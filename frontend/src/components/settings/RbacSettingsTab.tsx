import React from 'react';
import { usePermissionStore } from '@stores/permissionStore';
import { Badge } from '@components/ui/Badge';
import { ShieldCheck, Lock, Check, X } from 'lucide-react';

const ROLES_MATRIX = [
  { role: 'SUPER_ADMIN', name: 'Super Admin', weight: 100 },
  { role: 'OWNER', name: 'Owner', weight: 90 },
  { role: 'ADMIN', name: 'Admin', weight: 80 },
  { role: 'MANAGER', name: 'Manager', weight: 60 },
  { role: 'DEVELOPER', name: 'Developer', weight: 50 },
  { role: 'MEMBER', name: 'Member', weight: 30 },
  { role: 'VIEWER', name: 'Viewer', weight: 10 },
] as const;

const PERMISSIONS_LIST = [
  { key: 'org.edit', name: 'Edit Organization Profile', minWeight: 80 },
  { key: 'org.invite', name: 'Invite Team Members', minWeight: 60 },
  { key: 'org.billing', name: 'Manage Billing & Subscription', minWeight: 90 },
  { key: 'project.create', name: 'Create Business Workspaces', minWeight: 60 },
  { key: 'project.delete', name: 'Delete Workspaces', minWeight: 80 },
  { key: 'security.manage', name: 'Manage Security & API Keys', minWeight: 80 },
  { key: 'feature_flag.manage', name: 'Toggle Feature Flags', minWeight: 60 },
  { key: 'data.view', name: 'View AI Intelligence & Reports', minWeight: 10 },
];

export function RbacSettingsTab() {
  const { activeRole } = usePermissionStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-heading-md font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" /> Role-Based Access Control (RBAC)
          </h2>
          <p className="text-body-xs text-muted-foreground">
            Enterprise role hierarchy, inherited permissions, and active capability matrix.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Your Effective Role:</span>
          <Badge variant="default" size="md">
            {activeRole ?? 'MEMBER'}
          </Badge>
        </div>
      </div>

      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
            <tr>
              <th className="p-3">Permission / Capability</th>
              {ROLES_MATRIX.map((r) => (
                <th key={r.role} className="p-3 text-center">
                  {r.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {PERMISSIONS_LIST.map((perm) => (
              <tr key={perm.key} className="hover:bg-muted/30 transition-colors">
                <td className="p-3 font-semibold text-foreground">{perm.name}</td>
                {ROLES_MATRIX.map((r) => {
                  const hasAccess = r.weight >= perm.minWeight;
                  return (
                    <td key={r.role} className="p-3 text-center">
                      {hasAccess ? (
                        <Check className="w-4 h-4 text-success mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 rounded-xl border border-border bg-muted/20 text-xs text-muted-foreground flex items-start gap-2">
        <Lock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <span>
          Permissions are hierarchically inherited. Higher roles inherit all capabilities of lower roles automatically.
        </span>
      </div>
    </div>
  );
}
