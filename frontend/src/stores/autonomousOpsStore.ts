import { create } from 'zustand';
import type { CopilotChatMessage } from '@app-types/autonomous-ops.types';

interface AutonomousOpsStoreState {
  copilotMessages: CopilotChatMessage[];
  isCopilotOpen: boolean;
  selectedSeverityFilter: string;
  addCopilotMessage: (msg: CopilotChatMessage) => void;
  setIsCopilotOpen: (open: boolean) => void;
  setSelectedSeverityFilter: (severity: string) => void;
}

export const useAutonomousOpsStore = create<AutonomousOpsStoreState>((set) => ({
  copilotMessages: [
    {
      id: 'm-1',
      sender: 'COPILOT',
      messageText: 'Hello! I am your Dyvin AI SRE Copilot. Platform SLA is 99.98%. How can I assist you with autonomous operations today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ],
  isCopilotOpen: true,
  selectedSeverityFilter: 'ALL',
  addCopilotMessage: (msg) => set((state) => ({ copilotMessages: [...state.copilotMessages, msg] })),
  setIsCopilotOpen: (open) => set({ isCopilotOpen: open }),
  setSelectedSeverityFilter: (severity) => set({ selectedSeverityFilter: severity }),
}));
