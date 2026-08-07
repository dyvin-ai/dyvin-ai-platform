import React, { useRef, useState } from 'react';
import { useWorkflowStore } from '@stores/workflowStore';
import { WorkflowNodeType } from '@app-types/workflow.types';
import {
  Zap,
  Search,
  Brain,
  Sparkles,
  ShieldCheck,
  Award,
  BookOpen,
  GitBranch,
  Bell,
  Database,
  Code2,
  Flag,
  Trash2,
} from 'lucide-react';

const NODE_ICONS: Record<string, React.ElementType> = {
  [WorkflowNodeType.TRIGGER]: Zap,
  [WorkflowNodeType.SEARCH]: Search,
  [WorkflowNodeType.REASONING]: Brain,
  [WorkflowNodeType.GENERATION]: Sparkles,
  [WorkflowNodeType.VERIFICATION]: ShieldCheck,
  [WorkflowNodeType.RECOMMENDATION]: Award,
  [WorkflowNodeType.KNOWLEDGE]: BookOpen,
  [WorkflowNodeType.CONDITION]: GitBranch,
  [WorkflowNodeType.NOTIFICATION]: Bell,
  [WorkflowNodeType.DATABASE]: Database,
  [WorkflowNodeType.CUSTOM_FUNCTION]: Code2,
  [WorkflowNodeType.FINISH]: Flag,
};

export function WorkflowCanvas() {
  const {
    activeWorkflow,
    selectedNodeId,
    setSelectedNodeId,
    zoomLevel,
    panOffset,
    setPanOffset,
    removeNode,
    addEdge,
    removeEdge,
  } = useWorkflowStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [connectingSourceId, setConnectingSourceId] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const nodes = activeWorkflow?.nodes ?? [];
  const edges = activeWorkflow?.edges ?? [];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setSelectedNodeId(null);
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handlePortClick = (nodeId: string, isOutput: boolean) => {
    if (isOutput) {
      setConnectingSourceId(nodeId);
    } else if (connectingSourceId && connectingSourceId !== nodeId) {
      addEdge(connectingSourceId, nodeId);
      setConnectingSourceId(null);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="flex-1 h-full bg-background relative overflow-hidden cursor-crosshair select-none"
      style={{
        backgroundImage: `radial-gradient(var(--border) 1px, transparent 1px)`,
        backgroundSize: `${20 * zoomLevel}px ${20 * zoomLevel}px`,
        backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
      }}
    >
      <div
        className="w-full h-full absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Render Connection Edges */}
        <svg className="w-full h-full absolute inset-0 overflow-visible pointer-events-auto">
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--primary)" />
            </marker>
          </defs>

          {edges.map((edge) => {
            const sourceNode = nodes.find((n) => n.id === edge.sourceNodeId);
            const targetNode = nodes.find((n) => n.id === edge.targetNodeId);
            if (!sourceNode || !targetNode) return null;

            const x1 = (sourceNode.positionX ?? 200) + 180;
            const y1 = (sourceNode.positionY ?? 150) + 30;
            const x2 = targetNode.positionX ?? 400;
            const y2 = (targetNode.positionY ?? 150) + 30;

            const dx = Math.abs(x2 - x1) * 0.5;
            const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

            return (
              <g key={edge.id} className="group cursor-pointer" onClick={() => removeEdge(edge.id)}>
                <path
                  d={pathData}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="2.5"
                  markerEnd="url(#arrow)"
                  className="transition-all group-hover:stroke-danger group-hover:stroke-[3.5]"
                />
              </g>
            );
          })}
        </svg>

        {/* Render Canvas Nodes */}
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const Icon = NODE_ICONS[node.nodeType] ?? Zap;

          return (
            <div
              key={node.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedNodeId(node.id);
              }}
              className={`absolute w-48 p-3 rounded-xl border bg-card shadow-md transition-all pointer-events-auto ${
                isSelected
                  ? 'border-primary ring-2 ring-primary/30 shadow-lg'
                  : 'border-border hover:border-primary/50'
              }`}
              style={{
                left: `${node.positionX ?? 200}px`,
                top: `${node.positionY ?? 150}px`,
              }}
            >
              {/* Input Port */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handlePortClick(node.id, false);
                }}
                className="w-3 h-3 rounded-full bg-border border-2 border-background absolute -left-1.5 top-1/2 -translate-y-1/2 cursor-pointer hover:bg-primary transition-colors"
                title="Input Connection Port"
              />

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-bold text-foreground block truncate">
                      {node.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-mono">
                      {node.nodeType}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNode(node.id);
                  }}
                  className="text-muted-foreground hover:text-danger p-1 rounded-md transition-colors"
                  title="Remove Node"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Output Port */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handlePortClick(node.id, true);
                }}
                className={`w-3 h-3 rounded-full border-2 border-background absolute -right-1.5 top-1/2 -translate-y-1/2 cursor-pointer transition-colors ${
                  connectingSourceId === node.id ? 'bg-primary ring-2 ring-primary/50' : 'bg-primary/80 hover:bg-primary'
                }`}
                title="Output Connection Port (Click then click target input port)"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
