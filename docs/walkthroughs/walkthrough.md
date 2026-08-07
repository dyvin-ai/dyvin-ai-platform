# Phase F3 Walkthrough — Enterprise Organization, Workspace, Teams, RBAC & Settings Platform

## Summary

Phase F3 delivers the complete enterprise Organization, Workspace, Teams, RBAC, Profile, Security, Notification, Feature Flags, and Audit platform for Dyvin AI. All features connect directly to existing NestJS backend endpoints with zero mocks.

---

## Capabilities & Components Delivered

### 1. Organization Management
- **Org Profile & Branding**: Edit organization name, logo URL, custom slug, and metadata via `OrgSettingsTab.tsx`.
- **Org Roster**: View all members, roles, and invitation states via `TeamSettingsTab.tsx`.

### 2. Workspace Platform (Projects)
- **Top Nav Organization & Workspace Switcher**: `OrganizationSwitcher.tsx` with search, recent items, and keyboard navigation.
- **Workspace CRUD**: `CreateWorkspaceModal.tsx`, `WorkspaceSettingsTab.tsx` with full support for primary domains, website attachments, scan frequencies, and soft-delete.

### 3. Role-Based Access Control (RBAC)
- **RBAC Matrix**: Interactive 7-tier role weight hierarchy (SUPER_ADMIN 100 → VIEWER 10) in `RbacSettingsTab.tsx`.
- **Frontend Guard Integration**: `canAccess()` method in `usePermissionStore` controls menu visibility and action enablement.

### 4. Profile & Security Center
- **Profile Center**: Avatar management and personal info updates via `ProfileSettingsTab.tsx`.
- **Security Center**: Real-time runtime security telemetry, active session counts, device fingerprints, session revocation, and immutable audit logs via `SecuritySettingsTab.tsx`.

### 5. Notification & Feature Flag Platform
- **Notification Preferences**: Category delivery toggles (Analysis, Recommendation, Verification, Monitoring, Billing, Collaboration, System) in `NotificationSettingsTab.tsx`.
- **Feature Flags**: Environment indicator, rollout strategy view, and toggle controls in `FeatureFlagsSettingsTab.tsx`.
- **Audit Center**: SOC 2 compliance records, 365-day retention policy indicator, and JSON audit log export in `AuditSettingsTab.tsx`.

---

## Files Created & Updated

### Types
- `src/types/workspace.types.ts`
- `src/types/security.types.ts`
- `src/types/notification.types.ts`
- `src/types/feature-flag.types.ts`
- `src/types/index.ts`

### API Services
- `src/services/api/project.api.ts`
- `src/services/api/user.api.ts`
- `src/services/api/security.api.ts`
- `src/services/api/notification.api.ts`
- `src/services/api/feature-flag.api.ts`

### Stores
- `src/stores/workspaceStore.ts`
- `src/stores/settingsStore.ts`
- `src/stores/index.ts`

### React Query Hooks
- `src/hooks/useWorkspaces.ts`
- `src/hooks/useSecurity.ts`
- `src/hooks/useNotifications.ts`
- `src/hooks/useFeatureFlags.ts`
- `src/hooks/index.ts`

### UI Components & Modals
- `src/components/organization/OrganizationSwitcher.tsx`
- `src/components/modals/CreateWorkspaceModal.tsx`
- `src/components/modals/InviteMemberModal.tsx`
- `src/components/navigation/TopNav.tsx`

### Settings Sub-Tabs & Settings Page
- `src/components/settings/OrgSettingsTab.tsx`
- `src/components/settings/WorkspaceSettingsTab.tsx`
- `src/components/settings/TeamSettingsTab.tsx`
- `src/components/settings/RbacSettingsTab.tsx`
- `src/components/settings/ProfileSettingsTab.tsx`
- `src/components/settings/SecuritySettingsTab.tsx`
- `src/components/settings/NotificationSettingsTab.tsx`
- `src/components/settings/FeatureFlagsSettingsTab.tsx`
- `src/components/settings/AuditSettingsTab.tsx`
- `src/pages/dashboard/SettingsPage.tsx`
