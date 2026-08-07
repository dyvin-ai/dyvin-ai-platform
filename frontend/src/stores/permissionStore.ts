import { create } from 'zustand';
import type { UserRole } from '@app-types/auth.types';

interface PermissionStore {
  activeRole: UserRole | null;
  orgPermissions: Record<string, UserRole>; // orgId → role

  setActiveRole: (role: UserRole | null) => void;
  setOrgPermissions: (permissions: Record<string, UserRole>) => void;
  hasRole: (role: UserRole | UserRole[], orgId?: string) => boolean;
  canAccess: (minRole: UserRole, orgId?: string) => boolean;
}

const ROLE_HIERARCHY: Record<UserRole, number> = {
  SUPER_ADMIN: 100,
  OWNER: 90,
  ADMIN: 80,
  MANAGER: 60,
  DEVELOPER: 50,
  PARTNER: 45,
  AGENCY: 40,
  MEMBER: 30,
  VIEWER: 10,
};

export const usePermissionStore = create<PermissionStore>()((set, get) => ({
  activeRole: null,
  orgPermissions: {},

  setActiveRole: (activeRole) => set({ activeRole }),

  setOrgPermissions: (orgPermissions) => set({ orgPermissions }),

  hasRole: (role, orgId) => {
    const { activeRole, orgPermissions } = get();
    const currentRole = orgId ? orgPermissions[orgId] : activeRole;
    if (!currentRole) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(currentRole);
  },

  canAccess: (minRole, orgId) => {
    const { activeRole, orgPermissions } = get();
    const currentRole = orgId ? orgPermissions[orgId] : activeRole;
    if (!currentRole) return false;
    return ROLE_HIERARCHY[currentRole] >= ROLE_HIERARCHY[minRole];
  },
}));

// Helper selector — does not need orgId for simple checks
export function useHasPermission(minRole: UserRole): boolean {
  return usePermissionStore((s) => s.canAccess(minRole));
}

