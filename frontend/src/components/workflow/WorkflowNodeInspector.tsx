import React, { useState, useEffect } from 'react';
import { useWorkflowStore } from '@stores/workflowStore';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { Sliders, Code2, Save, Trash2, X } from 'lucide-react';

export function WorkflowNodeInspector() {
  const { activeWorkflow, selectedNodeId, setSelectedNodeId, updateNodeConfig, removeNode } = useWorkflowStore();

  const selectedNode = activeWorkflow?.nodes.find((n) => n.id === selectedNodeId);

  const [label, setLabel] = useState('');
  const [configText, setConfigText] = useState('{}');

  useEffect(() => {
    if (selectedNode) {
      setLabel(selectedNode.label);
      setConfigText(JSON.stringify(selectedNode.configJson || {}, null, 2));
    }
  }, [selectedNode]);

  if (!selectedNode) {
    return (
      <aside className="w-80 border-l border-border bg-card p-5 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2 select-none">
        <Sliders className="w-6 h-6 text-muted-foreground" />
        <span className="font-semibold text-foreground">No Node Selected</span>
        <p className="text-[11px] text-muted-foreground">Select a node on the canvas to configure parameters and payloads.</p>
      </aside>
    );
  }

  const handleSave = () => {
    try {
      const parsed = JSON.parse(configText);
      updateNodeConfig(selectedNode.id, parsed, label.trim() || undefined);
    } catch {
      // Invalid JSON fallback
    }
  };

  return (
    <aside className="w-80 border-l border-border bg-card p-4 space-y-4 overflow-y-auto select-none flex flex-col justify-between">
      <div className="space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-foreground">Node Inspector</h3>
          </div>
          <button
            onClick={() => setSelectedNodeId(null)}
            className="text-muted-foreground hover:text-foreground p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <Input
          label="Node Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />

        <div className="space-y-1.5">
          <label className="font-semibold text-foreground block">Node Type</label>
          <div className="p-2 rounded-lg bg-muted/40 border border-border font-mono text-[11px] text-primary">
            {selectedNode.nodeType}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-foreground flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-primary" /> Config JSON (Payload/Params)
            </span>
          </label>
          <textarea
            rows={10}
            value={configText}
            onChange={(e) => setConfigText(e.target.value)}
            className="w-full p-2.5 bg-muted/30 border border-border rounded-lg font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-border flex items-center justify-between gap-2">
        <Button
          size="sm"
          variant="outline"
          className="text-danger hover:text-danger border-danger/30"
          onClick={() => removeNode(selectedNode.id)}
          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
        >
          Delete Node
        </Button>
        <Button size="sm" onClick={handleSave} leftIcon={<Save className="w-3.5 h-3.5" />}>
          Save Config
        </Button>
      </div>
    </aside>
  );
}
