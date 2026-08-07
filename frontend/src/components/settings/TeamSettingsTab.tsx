import React, { useState } from 'react';
import { useOrgDetails, useCreateInvitation } from '@hooks/useOrganizations';
import { useOrgStore } from '@stores/orgStore';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { InviteMemberModal } from '@components/modals/InviteMemberModal';
import { Users, UserPlus, Search, Mail, Shield } from 'lucide-react';
import type { OrganizationMember } from '@app-types/org.types';

export function TeamSettingsTab() {
  const { activeOrg } = useOrgStore();
  const orgId = activeOrg?.id ?? '';
  const { data: orgDetails, isLoading } = useOrgDetails(orgId);
  const [search, setSearch] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const members: OrganizationMember[] = orgDetails?.members ?? [];
  const filteredMembers = members.filter(
    (m: OrganizationMember) =>
      m.user?.email.toLowerCase().includes(search.toLowerCase()) ||
      m.user?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      m.user?.lastName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-heading-md font-bold text-foreground">Team Management</h2>
          <p className="text-body-xs text-muted-foreground">
            Manage organization members, invites, and access roles.
          </p>
        </div>
        <Button size="sm" onClick={() => setIsInviteOpen(true)} leftIcon={<UserPlus className="w-3.5 h-3.5" />}>
          Invite Member
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members by name or email..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-muted/40 border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-sm text-muted-foreground">Loading members roster...</div>
      ) : filteredMembers.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-border rounded-2xl space-y-2">
          <Users className="w-6 h-6 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">No members matching your search.</p>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden bg-card">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredMembers.map((m: OrganizationMember) => (
                <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {m.user?.firstName?.[0] ?? m.user?.email?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {m.user?.firstName ? `${m.user.firstName} ${m.user.lastName ?? ''}` : 'User'}
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3 text-muted-foreground" /> {m.user?.email}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge variant={m.role === 'OWNER' || m.role === 'ADMIN' ? 'default' : 'secondary'} size="sm">
                      <Shield className="w-3 h-3 mr-1 inline" /> {m.role}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-success text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" /> Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <InviteMemberModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
    </div>
  );
}
