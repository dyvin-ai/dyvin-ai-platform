import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Project } from '@app-types/workspace.types';

interface WorkspaceStore {
  workspaces: Project[];
  activeWorkspace: Project | null;
  activeWorkspaceId: string | null;
  setWorkspaces: (workspaces: Project[]) => void;
  setActiveWorkspace: (workspace: Project | null) => void;
  setActiveWorkspaceId: (id: string | null) => void;
  addWorkspace: (workspace: Project) => void;
  updateWorkspaceInStore: (id: string, patch: Partial<Project>) => void;
  removeWorkspace: (id: string) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set, get) => ({
      workspaces: [],
      activeWorkspace: null,
      activeWorkspaceId: null,

      setWorkspaces: (workspaces) => {
        const currentActiveId = get().activeWorkspaceId;
        const matched = workspaces.find((w) => w.id === currentActiveId);
        const nextActive = matched || workspaces[0] || null;
        set({
          workspaces,
          activeWorkspace: nextActive,
          activeWorkspaceId: nextActive ? nextActive.id : null,
        });
      },

      setActiveWorkspace: (workspace) => {
        set({
          activeWorkspace: workspace,
          activeWorkspaceId: workspace ? workspace.id : null,
        });
      },

      setActiveWorkspaceId: (id) => {
        const matched = get().workspaces.find((w) => w.id === id) || null;
        set({
          activeWorkspaceId: id,
          activeWorkspace: matched,
        });
      },

      addWorkspace: (workspace) => {
        set((state) => {
          const exists = state.workspaces.some((w) => w.id === workspace.id);
          const nextWorkspaces = exists ? state.workspaces : [...state.workspaces, workspace];
          return {
            workspaces: nextWorkspaces,
            activeWorkspace: workspace,
            activeWorkspaceId: workspace.id,
          };
        });
      },

      updateWorkspaceInStore: (id, patch) => {
        set((state) => {
          const nextWorkspaces = state.workspaces.map((w) =>
            w.id === id ? { ...w, ...patch } : w
          );
          const activeWorkspace =
            state.activeWorkspace?.id === id
              ? { ...state.activeWorkspace, ...patch }
              : state.activeWorkspace;
          return { workspaces: nextWorkspaces, activeWorkspace };
        });
      },

      removeWorkspace: (id) => {
        set((state) => {
          const nextWorkspaces = state.workspaces.filter((w) => w.id !== id);
          const isCurrentActive = state.activeWorkspaceId === id;
          const nextActive = isCurrentActive
            ? nextWorkspaces[0] || null
            : state.activeWorkspace;
          return {
            workspaces: nextWorkspaces,
            activeWorkspace: nextActive,
            activeWorkspaceId: nextActive ? nextActive.id : null,
          };
        });
      },
    }),
    {
      name: 'dyvin-workspace-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ activeWorkspaceId: state.activeWorkspaceId }),
    }
  )
);
