import React from 'react';
import { useWorkflowStore } from '@stores/workflowStore';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  Save,
  Sparkles,
  LayoutGrid,
} from 'lucide-react';
import type { StudioWorkflow } from '@app-types/workflow.types';

interface WorkflowHeaderProps {
  workflow: StudioWorkflow | null;
  onRun: () => void;
  onPause: () => void;
  onSave: () => void;
  onOpenTemplates: () => void;
  isRunning?: boolean;
}

export function WorkflowHeader({
  workflow,
  onRun,
  onPause,
  onSave,
  onOpenTemplates,
  isRunning,
}: WorkflowHeaderProps) {
  const { zoomLevel, setZoomLevel, undo, redo, clearCanvas, historyIndex, history } = useWorkflowStore();

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="h-14 border-b border-border bg-card px-4 flex items-center justify-between gap-4 select-none">
      {/* Title & Status */}
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-bold text-foreground tracking-tight">
          {workflow?.name || 'Untitled Workflow'}
        </h2>
        <Badge variant={workflow?.status === 'ACTIVE' || workflow?.status === 'RUNNING' ? 'success' : 'secondary'} size="sm">
          {workflow?.status || 'DRAFT'}
        </Badge>
        <span className="text-[11px] text-muted-foreground hidden md:inline font-mono">
          {workflow?.nodes?.length ?? 0} Nodes • {workflow?.edges?.length ?? 0} Connections
        </span>
      </div>

      {/* Toolbar Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg border border-border/50">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => undo()}
            disabled={!canUndo}
            title="Undo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => redo()}
            disabled={!canRedo}
            title="Redo"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </Button>

          <div className="h-4 w-px bg-border/60 mx-1" />

          <Button
            size="xs"
            variant="ghost"
            onClick={() => setZoomLevel((z) => Math.max(0.4, z - 0.1))}
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <span className="text-[11px] font-mono text-muted-foreground px-1">
            {Math.round(zoomLevel * 100)}%
          </span>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.1))}
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => setZoomLevel(1)}
            title="Reset Zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </Button>

          <div className="h-4 w-px bg-border/60 mx-1" />

          <Button
            size="xs"
            variant="ghost"
            className="text-danger hover:text-danger"
            onClick={() => clearCanvas()}
            title="Clear Canvas"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>

        <Button size="sm" variant="outline" onClick={onOpenTemplates} leftIcon={<LayoutGrid className="w-3.5 h-3.5" />}>
          Templates
        </Button>

        <Button size="sm" variant="outline" onClick={onSave} leftIcon={<Save className="w-3.5 h-3.5" />}>
          Save
        </Button>

        {workflow?.status === 'RUNNING' || isRunning ? (
          <Button size="sm" variant="secondary" onClick={onPause} leftIcon={<Pause className="w-3.5 h-3.5" />}>
            Pause
          </Button>
        ) : (
          <Button size="sm" onClick={onRun} leftIcon={<Play className="w-3.5 h-3.5" />}>
            Run Workflow
          </Button>
        )}
      </div>
    </div>
  );
}
