import React from 'react';
import { useSettingsStore, SettingsTab } from '@stores/settingsStore';
import { OrgSettingsTab } from '@components/settings/OrgSettingsTab';
import { WorkspaceSettingsTab } from '@components/settings/WorkspaceSettingsTab';
import { TeamSettingsTab } from '@components/settings/TeamSettingsTab';
import { RbacSettingsTab } from '@components/settings/RbacSettingsTab';
import { ProfileSettingsTab } from '@components/settings/ProfileSettingsTab';
import { SecuritySettingsTab } from '@components/settings/SecuritySettingsTab';
import { NotificationSettingsTab } from '@components/settings/NotificationSettingsTab';
import { FeatureFlagsSettingsTab } from '@components/settings/FeatureFlagsSettingsTab';
import { AuditSettingsTab } from '@components/settings/AuditSettingsTab';

import {
  Building2,
  FolderKanban,
  Users,
  ShieldCheck,
  User,
  ShieldAlert,
  Bell,
  Zap,
  History,
} from 'lucide-react';

const TABS: { id: SettingsTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'general', label: 'Organization', icon: Building2 },
  { id: 'workspaces' as any, label: 'Workspaces', icon: FolderKanban },
  { id: 'members', label: 'Team', icon: Users },
  { id: 'roles', label: 'RBAC', icon: ShieldCheck },
  { id: 'profile' as any, label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: ShieldAlert },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'feature-flags', label: 'Feature Flags', icon: Zap },
  { id: 'audit', label: 'Audit', icon: History },
];

export default function SettingsPage() {
  const { activeTab, setActiveTab } = useSettingsStore();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-heading-xl font-bold text-foreground">Organization & Enterprise Settings</h1>
        <p className="text-body-md text-muted-foreground">
          Manage your organization, workspaces, team members, RBAC security, and dynamic platform options.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto no-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-primary text-primary bg-primary/5 rounded-t-lg'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active Tab View */}
      <div className="pt-2">
        {activeTab === 'general' && <OrgSettingsTab />}
        {(activeTab as string) === 'workspaces' && <WorkspaceSettingsTab />}
        {activeTab === 'members' && <TeamSettingsTab />}
        {activeTab === 'roles' && <RbacSettingsTab />}
        {(activeTab as string) === 'profile' && <ProfileSettingsTab />}
        {activeTab === 'security' && <SecuritySettingsTab />}
        {activeTab === 'notifications' && <NotificationSettingsTab />}
        {activeTab === 'feature-flags' && <FeatureFlagsSettingsTab />}
        {activeTab === 'audit' && <AuditSettingsTab />}
      </div>
    </div>
  );
}