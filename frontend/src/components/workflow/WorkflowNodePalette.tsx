import React from 'react';
import { useWorkflowStore } from '@stores/workflowStore';
import { WorkflowNodeType } from '@app-types/workflow.types';
import {
  Zap,
  Cpu,
  GitBranch,
  Search,
  Brain,
  Sparkles,
  ShieldCheck,
  Award,
  BookOpen,
  Bell,
  Database,
  Layers,
  Globe,
  Code2,
  CheckCircle,
  Flag,
} from 'lucide-react';

interface NodePaletteItem {
  type: WorkflowNodeType;
  label: string;
  category: 'Triggers' | 'AI Intelligence' | 'Logic & Flow' | 'Actions & Storage';
  icon: React.ElementType;
}

const PALETTE_ITEMS: NodePaletteItem[] = [
  { type: WorkflowNodeType.TRIGGER, label: 'Event Trigger', category: 'Triggers', icon: Zap },
  { type: WorkflowNodeType.WEBHOOK, label: 'Incoming Webhook', category: 'Triggers', icon: Globe },
  { type: WorkflowNodeType.SEARCH, label: 'AI Search Scan', category: 'AI Intelligence', icon: Search },
  { type: WorkflowNodeType.REASONING, label: 'Reasoning Engine', category: 'AI Intelligence', icon: Brain },
  { type: WorkflowNodeType.GENERATION, label: 'Auto-Fix Generation', category: 'AI Intelligence', icon: Sparkles },
  { type: WorkflowNodeType.VERIFICATION, label: 'Verification Guard', category: 'AI Intelligence', icon: ShieldCheck },
  { type: WorkflowNodeType.RECOMMENDATION, label: 'Strategy Engine', category: 'AI Intelligence', icon: Award },
  { type: WorkflowNodeType.KNOWLEDGE, label: 'Knowledge Graph', category: 'AI Intelligence', icon: BookOpen },
  { type: WorkflowNodeType.CONDITION, label: 'If / Else Condition', category: 'Logic & Flow', icon: GitBranch },
  { type: WorkflowNodeType.SWITCH, label: 'Multi-Switch', category: 'Logic & Flow', icon: Layers },
  { type: WorkflowNodeType.NOTIFICATION, label: 'Notify Team', category: 'Actions & Storage', icon: Bell },
  { type: WorkflowNodeType.DATABASE, label: 'Database Storage', category: 'Actions & Storage', icon: Database },
  { type: WorkflowNodeType.CUSTOM_FUNCTION, label: 'Custom Code', category: 'Actions & Storage', icon: Code2 },
  { type: WorkflowNodeType.APPROVAL, label: 'Human Review', category: 'Logic & Flow', icon: CheckCircle },
  { type: WorkflowNodeType.FINISH, label: 'Finish Workflow', category: 'Logic & Flow', icon: Flag },
];

export function WorkflowNodePalette() {
  const { addNode } = useWorkflowStore();

  const categories: Array<NodePaletteItem['category']> = [
    'Triggers',
    'AI Intelligence',
    'Logic & Flow',
    'Actions & Storage',
  ];

  return (
    <aside className="w-64 border-r border-border bg-card p-4 space-y-5 overflow-y-auto select-none">
      <div className="space-y-1">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Node Palette</h3>
        <p className="text-[11px] text-muted-foreground">Click to add nodes onto canvas.</p>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => {
          const items = PALETTE_ITEMS.filter((i) => i.category === cat);
          return (
            <div key={cat} className="space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                {cat}
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.type}
                      onClick={() => addNode(item.type, item.label)}
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/20 border border-border/50 text-foreground hover:bg-primary/10 hover:border-primary/50 transition-all text-xs font-medium text-left group"
                    >
                      <Icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
