import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Organization } from '@app-types/org.types';

interface OrgStore {
  activeOrg: Organization | null;
  organizations: Organization[];
  isLoading: boolean;

  setActiveOrg: (org: Organization | null) => void;
  setOrganizations: (orgs: Organization[]) => void;
  addOrganization: (org: Organization) => void;
  updateOrganization: (id: string, partial: Partial<Organization>) => void;
  clearOrgs: () => void;
  setLoading: (loading: boolean) => void;
}

export const useOrgStore = create<OrgStore>()(
  persist(
    (set) => ({
      activeOrg: null,
      organizations: [],
      isLoading: false,

      setActiveOrg: (activeOrg) => set({ activeOrg }),

      setOrganizations: (organizations) =>
        set({
          organizations,
          // Auto-select first if none active
          activeOrg: organizations[0] ?? null,
        }),

      addOrganization: (org) =>
        set((s) => ({
          organizations: [...s.organizations, org],
          activeOrg: s.activeOrg ?? org,
        })),

      updateOrganization: (id, partial) =>
        set((s) => ({
          organizations: s.organizations.map((o) =>
            o.id === id ? { ...o, ...partial } : o
          ),
          activeOrg:
            s.activeOrg?.id === id
              ? { ...s.activeOrg, ...partial }
              : s.activeOrg,
        })),

      clearOrgs: () => set({ activeOrg: null, organizations: [] }),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'dyvin-org',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeOrg: state.activeOrg,
        organizations: state.organizations,
      }),
    }
  )
);

