import { create } from 'zustand';
import type { StudioWorkflow, WorkflowNodeItem, WorkflowEdgeItem, WorkflowNodeType, WorkflowExecutionMode } from '@app-types/workflow.types';

interface WorkflowStoreState {
  activeWorkflow: StudioWorkflow | null;
  selectedNodeId: string | null;
  zoomLevel: number;
  panOffset: { x: number; y: number };
  history: StudioWorkflow[];
  historyIndex: number;
  isDraggingNode: boolean;

  // Actions
  setActiveWorkflow: (workflow: StudioWorkflow | null) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  setZoomLevel: (zoom: number | ((prev: number) => number)) => void;
  setPanOffset: (offset: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  addNode: (nodeType: WorkflowNodeType, label?: string, position?: { x: number; y: number }) => void;
  updateNodeConfig: (nodeId: string, config: Record<string, any>, label?: string) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (sourceNodeId: string, targetNodeId: string, label?: string) => void;
  removeEdge: (edgeId: string) => void;
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
}

export const useWorkflowStore = create<WorkflowStoreState>((set, get) => ({
  activeWorkflow: null,
  selectedNodeId: null,
  zoomLevel: 1,
  panOffset: { x: 0, y: 0 },
  history: [],
  historyIndex: -1,
  isDraggingNode: false,

  setActiveWorkflow: (workflow) => {
    set({
      activeWorkflow: workflow,
      selectedNodeId: null,
      history: workflow ? [workflow] : [],
      historyIndex: workflow ? 0 : -1,
    });
  },

  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),

  setZoomLevel: (zoom) =>
    set((state) => ({
      zoomLevel: typeof zoom === 'function' ? zoom(state.zoomLevel) : zoom,
    })),

  setPanOffset: (offset) =>
    set((state) => ({
      panOffset: typeof offset === 'function' ? offset(state.panOffset) : offset,
    })),

  addNode: (nodeType, label, position) => {
    const { activeWorkflow } = get();
    if (!activeWorkflow) return;

    const newNodeId = `node-${Date.now()}`;
    const newNode: WorkflowNodeItem = {
      id: newNodeId,
      label: label || `${nodeType} Node`,
      nodeType,
      positionX: position?.x ?? 250,
      positionY: position?.y ?? 180,
      configJson: {},
    };

    const updatedWorkflow: StudioWorkflow = {
      ...activeWorkflow,
      nodes: [...activeWorkflow.nodes, newNode],
    };

    set((state) => ({
      activeWorkflow: updatedWorkflow,
      selectedNodeId: newNodeId,
      history: [...state.history.slice(0, state.historyIndex + 1), updatedWorkflow],
      historyIndex: state.historyIndex + 1,
    }));
  },

  updateNodeConfig: (nodeId, config, label) => {
    const { activeWorkflow } = get();
    if (!activeWorkflow) return;

    const updatedNodes = activeWorkflow.nodes.map((n) =>
      n.id === nodeId ? { ...n, configJson: { ...n.configJson, ...config }, label: label || n.label } : n
    );

    const updatedWorkflow: StudioWorkflow = {
      ...activeWorkflow,
      nodes: updatedNodes,
    };

    set((state) => ({
      activeWorkflow: updatedWorkflow,
      history: [...state.history.slice(0, state.historyIndex + 1), updatedWorkflow],
      historyIndex: state.historyIndex + 1,
    }));
  },

  removeNode: (nodeId) => {
    const { activeWorkflow } = get();
    if (!activeWorkflow) return;

    const updatedNodes = activeWorkflow.nodes.filter((n) => n.id !== nodeId);
    const updatedEdges = activeWorkflow.edges.filter((e) => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId);

    const updatedWorkflow: StudioWorkflow = {
      ...activeWorkflow,
      nodes: updatedNodes,
      edges: updatedEdges,
    };

    set((state) => ({
      activeWorkflow: updatedWorkflow,
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
      history: [...state.history.slice(0, state.historyIndex + 1), updatedWorkflow],
      historyIndex: state.historyIndex + 1,
    }));
  },

  addEdge: (sourceNodeId, targetNodeId, label) => {
    const { activeWorkflow } = get();
    if (!activeWorkflow) return;

    // Prevent duplicate edges
    if (activeWorkflow.edges.some((e) => e.sourceNodeId === sourceNodeId && e.targetNodeId === targetNodeId)) {
      return;
    }

    const newEdgeId = `edge-${Date.now()}`;
    const newEdge: WorkflowEdgeItem = {
      id: newEdgeId,
      sourceNodeId,
      targetNodeId,
      label,
    };

    const updatedWorkflow: StudioWorkflow = {
      ...activeWorkflow,
      edges: [...activeWorkflow.edges, newEdge],
    };

    set((state) => ({
      activeWorkflow: updatedWorkflow,
      history: [...state.history.slice(0, state.historyIndex + 1), updatedWorkflow],
      historyIndex: state.historyIndex + 1,
    }));
  },

  removeEdge: (edgeId) => {
    const { activeWorkflow } = get();
    if (!activeWorkflow) return;

    const updatedEdges = activeWorkflow.edges.filter((e) => e.id !== edgeId);
    const updatedWorkflow: StudioWorkflow = {
      ...activeWorkflow,
      edges: updatedEdges,
    };

    set((state) => ({
      activeWorkflow: updatedWorkflow,
      history: [...state.history.slice(0, state.historyIndex + 1), updatedWorkflow],
      historyIndex: state.historyIndex + 1,
    }));
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      set({
        activeWorkflow: history[historyIndex - 1],
        historyIndex: historyIndex - 1,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      set({
        activeWorkflow: history[historyIndex + 1],
        historyIndex: historyIndex + 1,
      });
    }
  },

  clearCanvas: () => {
    const { activeWorkflow } = get();
    if (!activeWorkflow) return;

    const updatedWorkflow: StudioWorkflow = {
      ...activeWorkflow,
      nodes: [],
      edges: [],
    };

    set((state) => ({
      activeWorkflow: updatedWorkflow,
      selectedNodeId: null,
      history: [...state.history.slice(0, state.historyIndex + 1), updatedWorkflow],
      historyIndex: state.historyIndex + 1,
    }));
  },
}));
