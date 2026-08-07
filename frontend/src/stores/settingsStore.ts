import { create } from 'zustand';

export type SettingsTab =
  | 'general'
  | 'branding'
  | 'domains'
  | 'members'
  | 'roles'
  | 'security'
  | 'notifications'
  | 'feature-flags'
  | 'audit';

interface SettingsStore {
  activeTab: SettingsTab;
  setActiveTab: (tab: SettingsTab) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  activeTab: 'general',
  setActiveTab: (activeTab) => set({ activeTab }),
}));
